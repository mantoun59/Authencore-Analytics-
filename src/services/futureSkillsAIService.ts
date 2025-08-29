import { supabase } from '@/integrations/supabase/client';

export interface SkillsTaxonomy {
  id: string;
  skill_name: string;
  skill_category: string;
  current_demand_score: number;
  future_demand_score: number;
  growth_trajectory: number;
  industry_relevance: any;
  related_skills: any;
  skill_type: string;
  emergence_timeline: string;
  description?: string;
}

export interface SkillsPrediction {
  id: string;
  user_id: string;
  predicted_skills: any;
  skills_gap_analysis: any;
  recommended_learning_path: any;
  future_readiness_score: number;
  confidence_level: number;
  prediction_timeframe: number;
  industry_context?: string;
  role_context?: string;
  prediction_metadata: any;
  generated_at: string;
}

export interface CareerPathway {
  id: string;
  user_id: string;
  user_current_role: string;
  predicted_pathways: any;
  skills_progression: any;
  market_opportunities: any;
  confidence_scores: any;
  industry_trends: any;
}

export class FutureSkillsAIService {
  static async getSkillsTaxonomy(category?: string): Promise<SkillsTaxonomy[]> {
    let query = supabase.from('skills_taxonomy').select('*');
    
    if (category) {
      query = query.eq('skill_category', category);
    }
    
    const { data, error } = await query.order('future_demand_score', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getIndustryTrends(industry?: string) {
    let query = supabase.from('industry_skills_trends').select('*');
    
    if (industry) {
      query = query.eq('industry_name', industry);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getUserSkillsPredictions(userId: string): Promise<SkillsPrediction[]> {
    const { data, error } = await supabase
      .from('user_skills_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getLatestSkillsPrediction(userId: string): Promise<SkillsPrediction | null> {
    const { data, error } = await supabase
      .from('user_skills_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  static async getUserCareerPathways(userId: string): Promise<CareerPathway[]> {
    const { data, error } = await supabase
      .from('career_pathway_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getLatestCareerPathway(userId: string): Promise<CareerPathway | null> {
    const { data, error } = await supabase
      .from('career_pathway_predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  static async generateSkillsPrediction(params: {
    userId: string;
    assessmentData: any;
    assessmentType: string;
    industryContext?: string;
    roleContext?: string;
    timeframe?: number;
  }) {
    const { data, error } = await supabase.functions.invoke('skills-prediction-engine', {
      body: params
    });

    if (error) throw error;
    return data;
  }

  static async generateCareerPathways(params: {
    userId: string;
    currentRole: string;
    skillsPredictionId?: string;
    industryPreference?: string;
    careerGoals?: string[];
    timeHorizon?: number;
  }) {
    const { data, error } = await supabase.functions.invoke('career-pathway-generator', {
      body: params
    });

    if (error) throw error;
    return data;
  }

  static async getSkillsMapping(assessmentType: string) {
    const { data, error } = await supabase
      .from('assessment_skills_mapping')
      .select('*')
      .eq('assessment_type', assessmentType);
    
    if (error) throw error;
    return data || [];
  }

  static async analyzeSkillsGap(currentSkills: Record<string, number>, futureSkills: Record<string, number>) {
    const gaps = [];
    const strengths = [];
    
    for (const [skill, futureLevel] of Object.entries(futureSkills)) {
      const currentLevel = currentSkills[skill] || 0;
      const gap = futureLevel - currentLevel;
      
      if (gap > 0.3) {
        gaps.push({ skill, gap, priority: gap > 0.6 ? 'high' : 'medium' });
      } else if (currentLevel > 0.7) {
        strengths.push({ skill, level: currentLevel });
      }
    }
    
    return {
      criticalGaps: gaps.filter(g => g.priority === 'high'),
      moderateGaps: gaps.filter(g => g.priority === 'medium'),
      strengths: strengths
    };
  }

  static async getMarketInsights(skills: string[], industry?: string) {
    const taxonomyData = await this.getSkillsTaxonomy();
    const industryData = await this.getIndustryTrends(industry);
    
    const insights = {
      demandTrends: {},
      emergingSkills: [],
      decliningSkills: [],
      salaryImpact: {}
    };
    
    for (const skill of skills) {
      const skillData = taxonomyData.find(s => s.skill_name === skill);
      if (skillData) {
        insights.demandTrends[skill] = {
          current: skillData.current_demand_score,
          future: skillData.future_demand_score,
          growth: skillData.growth_trajectory
        };
      }
    }
    
    return insights;
  }
}