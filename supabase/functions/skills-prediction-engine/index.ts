import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SkillsPredictionRequest {
  userId: string;
  assessmentData: any;
  assessmentType: string;
  industryContext?: string;
  roleContext?: string;
  timeframe?: number; // months
}

interface SkillsPredictionResult {
  predictedSkills: Record<string, number>;
  skillsGapAnalysis: any;
  recommendedLearningPath: any[];
  futureReadinessScore: number;
  confidenceLevel: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: SkillsPredictionRequest = await req.json();

    console.log('🔮 Skills Prediction Engine - Processing request for user:', requestData.userId);

    // 1. Get assessment skills mapping
    const { data: mappings } = await supabase
      .from('assessment_skills_mapping')
      .select('*')
      .eq('assessment_type', requestData.assessmentType);

    // 2. Get skills taxonomy
    const { data: skillsTaxonomy } = await supabase
      .from('skills_taxonomy')
      .select('*');

    // 3. Get industry trends
    const { data: industryTrends } = await supabase
      .from('industry_skills_trends')
      .select('*')
      .eq('industry_name', requestData.industryContext || 'Technology');

    // 4. Analyze assessment results with AI
    const analysisPrompt = `
    You are an advanced AI skills prediction engine. Analyze this assessment data and predict future skills needs.
    
    Assessment Data: ${JSON.stringify(requestData.assessmentData)}
    Assessment Type: ${requestData.assessmentType}
    Industry Context: ${requestData.industryContext || 'Technology'}
    Role Context: ${requestData.roleContext || 'Professional'}
    Prediction Timeframe: ${requestData.timeframe || 36} months
    
    Available Skills Taxonomy: ${JSON.stringify(skillsTaxonomy?.slice(0, 20))}
    Industry Trends: ${JSON.stringify(industryTrends?.[0])}
    Assessment Mappings: ${JSON.stringify(mappings)}
    
    Provide a comprehensive skills prediction analysis including:
    1. Current skill levels based on assessment
    2. Future skills needed in ${requestData.timeframe || 36} months
    3. Skills gap analysis
    4. Recommended learning path with priorities
    5. Future readiness score (0-100)
    6. Confidence level (0-1)
    
    Return valid JSON format with these fields:
    {
      "predictedSkills": {"skillName": confidence_score},
      "currentSkillLevels": {"skillName": current_level},
      "skillsGapAnalysis": {
        "criticalGaps": ["skill1", "skill2"],
        "emergingSkills": ["skill1", "skill2"],
        "strengths": ["skill1", "skill2"]
      },
      "recommendedLearningPath": [
        {
          "skill": "skillName",
          "priority": "high|medium|low",
          "timeToLearn": "months",
          "resources": ["resource1", "resource2"],
          "rationale": "why this skill is important"
        }
      ],
      "futureReadinessScore": 85,
      "confidenceLevel": 0.87,
      "insights": {
        "marketAlignment": "How well aligned with market trends",
        "careerProgression": "Career advancement potential",
        "riskFactors": ["potential obstacles"],
        "opportunities": ["emerging opportunities"]
      }
    }
    `;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI skills prediction engine that provides accurate, data-driven insights for career development and future skills planning.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_completion_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // 5. Store prediction results
    const predictionResult = {
      user_id: requestData.userId,
      assessment_result_id: requestData.assessmentData.id,
      predicted_skills: analysis.predictedSkills,
      skills_gap_analysis: analysis.skillsGapAnalysis,
      recommended_learning_path: analysis.recommendedLearningPath,
      future_readiness_score: analysis.futureReadinessScore,
      prediction_timeframe: requestData.timeframe || 36,
      confidence_level: analysis.confidenceLevel,
      industry_context: requestData.industryContext,
      role_context: requestData.roleContext,
      prediction_metadata: {
        analysis_date: new Date().toISOString(),
        ai_insights: analysis.insights,
        current_skill_levels: analysis.currentSkillLevels
      }
    };

    const { data: savedPrediction, error } = await supabase
      .from('user_skills_predictions')
      .insert(predictionResult)
      .select()
      .single();

    if (error) {
      console.error('Error saving prediction:', error);
      throw error;
    }

    // 6. Log analytics
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'skills_prediction_generated',
      p_entity_type: 'prediction',
      p_entity_id: savedPrediction.id,
      p_metadata: {
        assessment_type: requestData.assessmentType,
        industry_context: requestData.industryContext,
        future_readiness_score: analysis.futureReadinessScore,
        confidence_level: analysis.confidenceLevel
      }
    });

    console.log('✅ Skills prediction generated successfully');

    return new Response(JSON.stringify({
      success: true,
      prediction: savedPrediction,
      insights: analysis.insights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Skills Prediction Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});