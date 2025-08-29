import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CareerPathwayRequest {
  userId: string;
  currentRole: string;
  skillsPredictionId?: string;
  industryPreference?: string;
  careerGoals?: string[];
  timeHorizon?: number; // years
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: CareerPathwayRequest = await req.json();

    console.log('🛤️ Career Pathway Generator - Processing for user:', requestData.userId);

    // 1. Get user's skills prediction if available
    let skillsPrediction = null;
    if (requestData.skillsPredictionId) {
      const { data } = await supabase
        .from('user_skills_predictions')
        .select('*')
        .eq('id', requestData.skillsPredictionId)
        .single();
      skillsPrediction = data;
    } else {
      // Get latest prediction
      const { data } = await supabase
        .from('user_skills_predictions')
        .select('*')
        .eq('user_id', requestData.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      skillsPrediction = data;
    }

    // 2. Get industry trends and market data
    const { data: industryTrends } = await supabase
      .from('industry_skills_trends')
      .select('*');

    // 3. Get skills taxonomy for context
    const { data: skillsTaxonomy } = await supabase
      .from('skills_taxonomy')
      .select('*')
      .order('future_demand_score', { ascending: false })
      .limit(50);

    // 4. Generate career pathways with AI
    const pathwayPrompt = `
    You are an advanced career pathway prediction AI. Generate comprehensive career progression pathways.
    
    Current Role: ${requestData.currentRole}
    Industry Preference: ${requestData.industryPreference || 'Technology'}
    Career Goals: ${JSON.stringify(requestData.careerGoals || [])}
    Time Horizon: ${requestData.timeHorizon || 5} years
    
    Skills Prediction Data: ${JSON.stringify(skillsPrediction)}
    Industry Trends: ${JSON.stringify(industryTrends?.slice(0, 3))}
    High-Demand Skills: ${JSON.stringify(skillsTaxonomy?.slice(0, 20))}
    
    Generate 3-5 realistic career pathways with detailed progression plans. Consider:
    1. Natural career progressions from current role
    2. Emerging opportunities in the industry
    3. Skills-based transitions
    4. Market demand and growth potential
    5. Salary progression estimates
    6. Required skills development
    
    Return valid JSON with this structure:
    {
      "pathways": [
        {
          "id": "pathway_1",
          "title": "Pathway Title",
          "description": "Brief description",
          "viabilityScore": 0.85,
          "timeToAchieve": "2-3 years",
          "salaryGrowthPotential": "25-40%",
          "steps": [
            {
              "year": 1,
              "role": "Intermediate Role",
              "requiredSkills": ["skill1", "skill2"],
              "developmentActions": ["action1", "action2"],
              "milestones": ["milestone1", "milestone2"]
            }
          ],
          "riskFactors": ["risk1", "risk2"],
          "advantages": ["advantage1", "advantage2"],
          "marketDemand": "high|medium|low"
        }
      ],
      "skillsProgression": {
        "immediateSkills": ["skill1", "skill2"],
        "shortTermSkills": ["skill3", "skill4"],
        "longTermSkills": ["skill5", "skill6"]
      },
      "marketOpportunities": {
        "emergingRoles": ["role1", "role2"],
        "industryGrowthAreas": ["area1", "area2"],
        "geographicHotspots": ["location1", "location2"]
      },
      "confidenceScores": {
        "overall": 0.82,
        "skillsAlignment": 0.85,
        "marketTiming": 0.78,
        "feasibility": 0.80
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
            content: 'You are an expert career progression analyst with deep knowledge of industry trends, skill requirements, and career development patterns across various fields.'
          },
          {
            role: 'user',
            content: pathwayPrompt
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
    const pathwayAnalysis = JSON.parse(aiData.choices[0].message.content);

    // 5. Save career pathway prediction
    const pathwayResult = {
      user_id: requestData.userId,
      user_current_role: requestData.currentRole,
      predicted_pathways: pathwayAnalysis.pathways,
      skills_progression: pathwayAnalysis.skillsProgression,
      timeline_predictions: {
        time_horizon: requestData.timeHorizon || 5,
        generated_at: new Date().toISOString()
      },
      market_opportunities: pathwayAnalysis.marketOpportunities,
      risk_factors: pathwayAnalysis.pathways.map(p => ({ pathway: p.id, risks: p.riskFactors })),
      confidence_scores: pathwayAnalysis.confidenceScores,
      industry_trends: industryTrends?.slice(0, 3) || [],
      personalization_factors: {
        current_role: requestData.currentRole,
        industry_preference: requestData.industryPreference,
        career_goals: requestData.careerGoals,
        skills_prediction_id: requestData.skillsPredictionId
      }
    };

    const { data: savedPathway, error } = await supabase
      .from('career_pathway_predictions')
      .insert(pathwayResult)
      .select()
      .single();

    if (error) {
      console.error('Error saving pathway:', error);
      throw error;
    }

    // 6. Log analytics
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'career_pathway_generated',
      p_entity_type: 'pathway',
      p_entity_id: savedPathway.id,
      p_metadata: {
        current_role: requestData.currentRole,
        pathways_count: pathwayAnalysis.pathways.length,
        overall_confidence: pathwayAnalysis.confidenceScores.overall,
        time_horizon: requestData.timeHorizon || 5
      }
    });

    console.log('✅ Career pathway generated successfully');

    return new Response(JSON.stringify({
      success: true,
      pathway: savedPathway,
      summary: {
        totalPathways: pathwayAnalysis.pathways.length,
        averageViability: pathwayAnalysis.pathways.reduce((sum, p) => sum + p.viabilityScore, 0) / pathwayAnalysis.pathways.length,
        confidenceScores: pathwayAnalysis.confidenceScores
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Career Pathway Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});