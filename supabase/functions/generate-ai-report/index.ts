import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIReportRequest {
  assessmentResultId: string;
  reportType: 'candidate' | 'employer';
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    company?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting AI report generation...');
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Parse request body
    const { assessmentResultId, reportType, candidateInfo }: AIReportRequest = await req.json();
    
    console.log('Request details:', { assessmentResultId, reportType, candidateInfo: candidateInfo?.name || 'Unknown' });

    // Validate input
    if (!assessmentResultId || assessmentResultId === 'undefined') {
      console.error('Invalid or missing assessmentResultId:', assessmentResultId);
      throw new Error('Valid assessment result ID is required');
    }

    // Fetch assessment data from database
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('id', assessmentResultId)
      .single();

    if (assessmentError) {
      console.error('Assessment fetch error:', assessmentError);
      throw new Error(`Database error: ${assessmentError.message}`);
    }
    
    if (!assessment) {
      console.error('No assessment found for ID:', assessmentResultId);
      throw new Error('Assessment result not found in database');
    }

    console.log('Found assessment:', assessment.assessment_type, 'for user:', assessment.user_id);

    // Fetch demographics if available
    const { data: demographics } = await supabase
      .from('assessment_demographics')
      .select('*')
      .eq('assessment_result_id', assessmentResultId)
      .single();

    console.log('Demographics data:', demographics ? 'Found' : 'Not found');

    // Generate analysis using OpenAI
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating AI analysis...');

    const analysisPrompt = generateAnalysisPrompt(assessment, demographics, assessment.assessment_type, reportType);
    const systemPrompt = getSystemPrompt(assessment.assessment_type, reportType);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiAnalysis = data.choices[0].message.content;

    console.log('AI analysis generated successfully');

    // Generate recommendations based on scores
    const recommendations = generateRecommendations(assessment.results, assessment.assessment_type);

    // Structure the report data
    const reportData = {
      candidateInfo: {
        name: candidateInfo.name,
        email: candidateInfo.email,
        position: candidateInfo.position,
        company: candidateInfo.company,
        completionDate: new Date().toISOString(),
        assessmentType: assessment.assessment_type
      },
      aiAnalysis: aiAnalysis,
      recommendations: recommendations,
      rawResults: assessment.results,
      demographics: demographics || {}
    };

    // Save the generated report
    const { data: savedReport, error: saveError } = await supabase
      .from('generated_reports')
      .insert({
        user_id: assessment.user_id,
        assessment_result_id: assessmentResultId,
        report_type: reportType,
        report_data: reportData
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving generated report:', saveError);
      throw new Error('Failed to save generated report');
    }

    console.log('Report saved successfully with ID:', savedReport.id);

    // Log analytics event
    try {
      await supabase.rpc('log_analytics_event', {
        event_type: 'ai_report_generated',
        entity_type: 'assessment',
        entity_id: assessmentResultId,
        metadata: {
          report_type: reportType,
          assessment_type: assessment.assessment_type,
          candidate_name: candidateInfo.name
        }
      });
    } catch (analyticsError) {
      console.error('Analytics logging failed:', analyticsError);
      // Don't fail the whole operation for analytics
    }

    return new Response(JSON.stringify({
      success: true,
      reportId: savedReport.id,
      reportData: reportData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-report function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getSystemPrompt(reportType: string, targetAudience: string): string {
  const basePrompt = `You are a senior psychologist specializing in psychometric assessment and career development with 20+ years of experience. You provide evidence-based insights using established psychological frameworks.`;
  
  const reportTypePrompts = {
    'cair-personality': `Focus on personality dimensions including conscientiousness, agreeableness, innovation, and resilience. Provide insights into work style, team dynamics, and professional development opportunities.`,
    'career-launch': `Focus on career readiness, professional skills development, workplace adaptation, and growth trajectory planning for early-career professionals.`,
    'communication-styles': `Focus on communication effectiveness, interpersonal skills, collaboration style, and professional relationship building.`,
    'emotional-intelligence': `Focus on emotional awareness, self-regulation, empathy, social skills, and their impact on professional effectiveness.`,
    'default': `Analyze the assessment results to provide meaningful insights for professional development and workplace effectiveness.`
  };

  const audiencePrompts = {
    'candidate': `Write for the individual taking the assessment. Use encouraging, developmental language that promotes self-awareness and growth.`,
    'employer': `Write for hiring managers and HR professionals. Focus on workplace behavior prediction, team fit, and development recommendations.`,
    'default': `Write in a professional, balanced tone that provides actionable insights.`
  };

  return `${basePrompt}

${reportTypePrompts[reportType] || reportTypePrompts.default}

${audiencePrompts[targetAudience] || audiencePrompts.default}

Provide detailed, evidence-based analysis that includes specific recommendations and actionable insights.`;
}

function generateAnalysisPrompt(assessment: any, demographics: any, reportType: string, targetAudience: string): string {
  const baseInfo = `
Assessment Type: ${reportType}
Assessment Results: ${JSON.stringify(assessment.results)}
${demographics ? `Demographics: ${JSON.stringify(demographics)}` : ''}

Please provide a comprehensive analysis that includes:

1. **Executive Summary**: A concise overview of key findings and implications

2. **Strengths Analysis**: Top 3-5 areas of strength with specific evidence from the data

3. **Development Opportunities**: Areas for growth with practical recommendations

4. **Behavioral Insights**: How these results translate to workplace behavior and performance

5. **Recommendations**: Specific, actionable steps for development

Focus on providing insights that are:
- Evidence-based and tied to the assessment data
- Actionable and practical
- Professional and constructive
- Relevant to workplace performance

Structure your response clearly with headings and bullet points for easy reading.`;

  return baseInfo;
}

function generateRecommendations(scores: Record<string, any>, assessmentType: string): string[] {
  const recommendations: string[] = [];
  
  // Generate basic recommendations based on assessment type
  switch (assessmentType) {
    case 'cair-personality':
      recommendations.push(
        'Develop a personal organization system to leverage conscientiousness strengths',
        'Practice active listening to enhance collaborative relationships',
        'Seek creative problem-solving opportunities to build innovation skills',
        'Build stress management techniques to maintain resilience under pressure'
      );
      break;
    case 'career-launch':
      recommendations.push(
        'Create a professional development plan with specific milestones',
        'Seek mentorship opportunities in your field of interest',
        'Build technical skills through online courses or certifications',
        'Develop networking skills for career advancement'
      );
      break;
    default:
      recommendations.push(
        'Focus on continuous learning and skill development',
        'Seek feedback regularly to improve self-awareness',
        'Build strong professional relationships',
        'Set clear goals and track progress regularly'
      );
  }

  return recommendations;
}