import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface AIReportRequest {
  assessmentId: string;
  reportType: 'comprehensive' | 'summary' | 'development';
  includeRecommendations?: boolean;
  targetAudience?: 'individual' | 'manager' | 'hr';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentId, reportType, includeRecommendations = true, targetAudience = 'individual' }: AIReportRequest = await req.json();

    console.log(`Generating AI report for assessment ${assessmentId}`);

    // Get assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_results')
      .select(`
        *,
        profiles:user_id (full_name, email)
      `)
      .eq('id', assessmentId)
      .single();

    if (assessmentError) {
      throw new Error(`Assessment not found: ${assessmentError.message}`);
    }

    // Get demographics if available
    const { data: demographics } = await supabase
      .from('assessment_demographics')
      .select('*')
      .eq('assessment_result_id', assessmentId)
      .single();

    // Get normative data for comparison
    const assessmentResults = assessment.results;
    const scores = assessmentResults?.scores || {};

    // Generate AI analysis prompt
    const analysisPrompt = generateAnalysisPrompt(assessment, demographics, reportType, targetAudience);

    // Call OpenAI for analysis
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(reportType, targetAudience)
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiAnalysis = aiData.choices[0]?.message?.content;

    // Structure the report
    const reportData = {
      assessment_id: assessmentId,
      report_type: reportType,
      target_audience: targetAudience,
      participant_info: {
        name: assessment.profiles?.full_name || 'Anonymous',
        assessment_type: assessment.assessment_type,
        completion_date: assessment.completed_at
      },
      scores: scores,
      ai_analysis: aiAnalysis,
      recommendations: includeRecommendations ? generateRecommendations(scores, assessment.assessment_type) : null,
      demographics_considered: demographics ? true : false,
      generated_at: new Date().toISOString(),
      tokens_used: aiData.usage?.total_tokens || 0
    };

    // Save the generated report
    const { data: savedReport, error: saveError } = await supabase
      .from('generated_reports')
      .insert({
        user_id: assessment.user_id,
        assessment_result_id: assessmentId,
        report_type: `ai_${reportType}`,
        report_data: reportData
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save report:', saveError);
    }

    // Log analytics
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'ai_report_generated',
      p_entity_type: 'report',
      p_entity_id: savedReport?.id,
      p_metadata: {
        assessment_type: assessment.assessment_type,
        report_type: reportType,
        target_audience: targetAudience,
        tokens_used: aiData.usage?.total_tokens
      }
    });

    return new Response(JSON.stringify({
      success: true,
      report: reportData,
      reportId: savedReport?.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('AI report generation error:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getSystemPrompt(reportType: string, targetAudience: string): string {
  const basePrompt = `You are a professional psychometric assessment analyst with expertise in workplace psychology, organizational behavior, and professional development.`;
  
  const reportSpecific = {
    comprehensive: "Provide a detailed, thorough analysis covering all aspects of the assessment results.",
    summary: "Provide a concise, executive summary focusing on key insights and main findings.",
    development: "Focus specifically on professional development opportunities and growth recommendations."
  };

  const audienceSpecific = {
    individual: "Write for the assessment participant, using encouraging and developmental language.",
    manager: "Write for a people manager, focusing on team leadership and management insights.",
    hr: "Write for HR professionals, including hiring and organizational development perspectives."
  };

  return `${basePrompt} ${reportSpecific[reportType as keyof typeof reportSpecific]} ${audienceSpecific[targetAudience as keyof typeof audienceSpecific]}

Guidelines:
- Use professional, clear language
- Provide evidence-based insights
- Include specific, actionable recommendations
- Maintain confidentiality and respect
- Focus on strengths and development opportunities
- Use a balanced, constructive tone`;
}

function generateAnalysisPrompt(assessment: any, demographics: any, reportType: string, targetAudience: string): string {
  const results = assessment.results;
  const scores = results?.scores || {};
  
  return `Please analyze the following assessment results:

Assessment Type: ${assessment.assessment_type}
Overall Score: ${results?.overallScore || 'N/A'}
Profile: ${results?.profile || 'N/A'}

Detailed Scores:
${Object.entries(scores).map(([dimension, score]) => `- ${dimension}: ${score}`).join('\n')}

${demographics ? `
Demographics Context:
- Age Range: ${demographics.age_range || 'N/A'}
- Industry: ${demographics.industry || 'N/A'}
- Experience Level: ${demographics.work_experience || 'N/A'}
- Education: ${demographics.education_level || 'N/A'}
` : ''}

Please provide a ${reportType} analysis for a ${targetAudience} audience, including:
1. Key strengths identified
2. Areas for development
3. Professional implications
4. Specific recommendations
5. Next steps for growth

Focus on actionable insights that can guide professional development and workplace success.`;
}

function generateRecommendations(scores: Record<string, any>, assessmentType: string): string[] {
  const recommendations: string[] = [];
  
  Object.entries(scores).forEach(([dimension, score]) => {
    const numScore = typeof score === 'number' ? score : 0;
    if (numScore < 70) {
      recommendations.push(`Consider focused development in ${dimension} through targeted training or mentoring.`);
    } else if (numScore > 85) {
      recommendations.push(`Leverage your strength in ${dimension} by taking on leadership roles or mentoring others.`);
    }
  });

  // Add assessment-specific recommendations
  switch (assessmentType) {
    case 'emotional-intelligence':
      recommendations.push('Practice mindfulness and emotional regulation techniques daily.');
      break;
    case 'leadership':
      recommendations.push('Seek opportunities to lead cross-functional projects.');
      break;
    case 'communication-styles':
      recommendations.push('Participate in public speaking or presentation skills workshops.');
      break;
  }

  return recommendations.length > 0 ? recommendations : ['Continue building on your strengths while exploring new growth opportunities.'];
}