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

class ServerSideAssessmentProcessor {
  static async processCareerLaunch(responses: any[]): Promise<Record<string, number>> {
    const dimensions = {
      careerClarity: 0,
      skillsAlignment: 0,
      networkingReadiness: 0,
      professionalPresence: 0,
      adaptability: 0,
      goalOrientation: 0
    };

    for (const response of responses) {
      const { questionId, answer } = response;
      const score = typeof answer === 'number' ? answer : this.parseAnswer(answer);
      
      // Map questions to dimensions based on Career Launch assessment structure
      if (questionId >= 1 && questionId <= 5) {
        dimensions.careerClarity += score;
      } else if (questionId >= 6 && questionId <= 10) {
        dimensions.skillsAlignment += score;
      } else if (questionId >= 11 && questionId <= 15) {
        dimensions.networkingReadiness += score;
      } else if (questionId >= 16 && questionId <= 20) {
        dimensions.professionalPresence += score;
      } else if (questionId >= 21 && questionId <= 25) {
        dimensions.adaptability += score;
      } else if (questionId >= 26 && questionId <= 30) {
        dimensions.goalOrientation += score;
      }
    }

    // Normalize scores (assuming 5 questions per dimension, scale 1-5)
    Object.keys(dimensions).forEach(key => {
      dimensions[key as keyof typeof dimensions] = (dimensions[key as keyof typeof dimensions] / 5) * 20; // Scale to 0-100
    });

    return dimensions;
  }

  static async processBurnoutPrevention(responses: any[]): Promise<Record<string, number>> {
    const dimensions = {
      workLifeBalance: 0,
      stressManagement: 0,
      emotionalResilience: 0,
      supportSystems: 0,
      selfCare: 0,
      workload: 0
    };

    for (const response of responses) {
      const { questionId, answer } = response;
      const score = typeof answer === 'number' ? answer : this.parseAnswer(answer);
      
      // Map questions to burnout prevention dimensions
      if (questionId >= 1 && questionId <= 4) {
        dimensions.workLifeBalance += score;
      } else if (questionId >= 5 && questionId <= 8) {
        dimensions.stressManagement += score;
      } else if (questionId >= 9 && questionId <= 12) {
        dimensions.emotionalResilience += score;
      } else if (questionId >= 13 && questionId <= 16) {
        dimensions.supportSystems += score;
      } else if (questionId >= 17 && questionId <= 20) {
        dimensions.selfCare += score;
      } else if (questionId >= 21 && questionId <= 24) {
        dimensions.workload += score;
      }
    }

    // Normalize scores
    Object.keys(dimensions).forEach(key => {
      dimensions[key as keyof typeof dimensions] = (dimensions[key as keyof typeof dimensions] / 4) * 25; // Scale to 0-100
    });

    return dimensions;
  }

  static parseAnswer(answer: any): number {
    if (typeof answer === 'number') return answer;
    if (typeof answer === 'string') {
      // Handle Likert scale responses
      const likertMap: Record<string, number> = {
        'strongly_disagree': 1,
        'disagree': 2,
        'neutral': 3,
        'agree': 4,
        'strongly_agree': 5
      };
      return likertMap[answer.toLowerCase()] || 3;
    }
    return 3; // Default neutral response
  }

  static calculateValidityMetrics(responses: any[], processingTime: number) {
    const responseTime = processingTime;
    const completionRate = responses.length / 30; // Assuming 30 questions
    
    // Calculate response consistency
    const scores = responses.map(r => this.parseAnswer(r.answer));
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const consistency = Math.max(0, 1 - (variance / 2)); // Normalize to 0-1

    return {
      responseTime,
      completionRate,
      consistency: Math.round(consistency * 100) / 100,
      validityScore: Math.round((consistency + completionRate) * 50) / 100
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const { assessmentType, responses, candidateInfo } = await req.json();

    console.log(`Processing ${assessmentType} assessment with ${responses.length} responses`);

    let scores: Record<string, number> = {};

    // Route to appropriate processor
    switch (assessmentType) {
      case 'career-launch':
        scores = await ServerSideAssessmentProcessor.processCareerLaunch(responses);
        break;
      case 'burnout-prevention':
        scores = await ServerSideAssessmentProcessor.processBurnoutPrevention(responses);
        break;
      default:
        throw new Error(`Unsupported assessment type: ${assessmentType}`);
    }

    // Calculate overall score
    const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

    // Generate profile based on scores
    const profile = this.generateProfile(scores, assessmentType);

    // Calculate validity metrics
    const processingTime = Date.now() - startTime;
    const validityMetrics = ServerSideAssessmentProcessor.calculateValidityMetrics(responses, processingTime);

    // Log assessment processing
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'assessment_processed',
      p_entity_type: 'assessment',
      p_metadata: {
        assessment_type: assessmentType,
        response_count: responses.length,
        processing_time: processingTime,
        overall_score: overallScore
      }
    });

    const result = {
      scores,
      overallScore: Math.round(overallScore * 100) / 100,
      profile,
      validityMetrics,
      processedAt: new Date().toISOString()
    };

    console.log(`Assessment processed successfully in ${processingTime}ms`);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error processing assessment:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  function generateProfile(scores: Record<string, number>, assessmentType: string) {
    const averageScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    
    if (assessmentType === 'career-launch') {
      if (averageScore >= 80) return 'Career Ready';
      if (averageScore >= 60) return 'Developing Professional';
      if (averageScore >= 40) return 'Emerging Talent';
      return 'Early Career Explorer';
    }
    
    if (assessmentType === 'burnout-prevention') {
      if (averageScore >= 80) return 'Resilient Professional';
      if (averageScore >= 60) return 'Balanced Individual';
      if (averageScore >= 40) return 'At-Risk Professional';
      return 'High Burnout Risk';
    }
    
    return 'Professional Profile';
  }
});