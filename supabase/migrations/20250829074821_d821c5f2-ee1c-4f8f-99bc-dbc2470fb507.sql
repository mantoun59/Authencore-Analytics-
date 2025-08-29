-- Future Skills Database Schema (Fixed)
CREATE TABLE public.skills_taxonomy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  current_demand_score NUMERIC NOT NULL DEFAULT 0,
  future_demand_score NUMERIC NOT NULL DEFAULT 0,
  growth_trajectory NUMERIC NOT NULL DEFAULT 0,
  industry_relevance JSONB NOT NULL DEFAULT '{}',
  related_skills TEXT[] NOT NULL DEFAULT '{}',
  obsolescence_risk NUMERIC NOT NULL DEFAULT 0,
  emergence_timeline TEXT NOT NULL DEFAULT 'current',
  skill_type TEXT NOT NULL DEFAULT 'technical',
  description TEXT,
  data_sources JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills Predictions for users
CREATE TABLE public.user_skills_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_result_id UUID,
  predicted_skills JSONB NOT NULL DEFAULT '{}',
  skills_gap_analysis JSONB NOT NULL DEFAULT '{}',
  recommended_learning_path JSONB NOT NULL DEFAULT '{}',
  future_readiness_score NUMERIC NOT NULL DEFAULT 0,
  prediction_timeframe INTEGER NOT NULL DEFAULT 36,
  confidence_level NUMERIC NOT NULL DEFAULT 0,
  industry_context TEXT,
  role_context TEXT,
  prediction_metadata JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '6 months'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Career pathway predictions (fixed column name)
CREATE TABLE public.career_pathway_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_current_role TEXT NOT NULL,
  predicted_pathways JSONB NOT NULL DEFAULT '[]',
  skills_progression JSONB NOT NULL DEFAULT '{}',
  timeline_predictions JSONB NOT NULL DEFAULT '{}',
  market_opportunities JSONB NOT NULL DEFAULT '{}',
  risk_factors JSONB NOT NULL DEFAULT '{}',
  confidence_scores JSONB NOT NULL DEFAULT '{}',
  industry_trends JSONB NOT NULL DEFAULT '{}',
  personalization_factors JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Industry trends and market data
CREATE TABLE public.industry_skills_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry_name TEXT NOT NULL,
  trending_skills JSONB NOT NULL DEFAULT '{}',
  declining_skills JSONB NOT NULL DEFAULT '{}',
  emerging_technologies JSONB NOT NULL DEFAULT '{}',
  skill_demand_forecast JSONB NOT NULL DEFAULT '{}',
  salary_trends JSONB NOT NULL DEFAULT '{}',
  job_market_data JSONB NOT NULL DEFAULT '{}',
  geographic_variations JSONB DEFAULT '{}',
  data_collection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  forecast_horizon INTEGER NOT NULL DEFAULT 36,
  confidence_level NUMERIC NOT NULL DEFAULT 0,
  data_sources JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills mapping for assessments
CREATE TABLE public.assessment_skills_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  assessment_dimension TEXT NOT NULL,
  mapped_skills TEXT[] NOT NULL DEFAULT '{}',
  skill_weights JSONB NOT NULL DEFAULT '{}',
  prediction_relevance NUMERIC NOT NULL DEFAULT 0,
  mapping_confidence NUMERIC NOT NULL DEFAULT 0,
  created_by UUID,
  validated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skills_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_pathway_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_skills_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_skills_mapping ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view skills taxonomy" ON public.skills_taxonomy FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills taxonomy" ON public.skills_taxonomy FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Users can view their own predictions" ON public.user_skills_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own predictions" ON public.user_skills_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can manage predictions" ON public.user_skills_predictions FOR ALL USING (true);
CREATE POLICY "Users can view their own career pathways" ON public.career_pathway_predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own career pathways" ON public.career_pathway_predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can manage career pathways" ON public.career_pathway_predictions FOR ALL USING (true);
CREATE POLICY "Anyone can view industry trends" ON public.industry_skills_trends FOR SELECT USING (true);
CREATE POLICY "Admins can manage industry trends" ON public.industry_skills_trends FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view assessment mappings" ON public.assessment_skills_mapping FOR SELECT USING (true);
CREATE POLICY "Admins can manage assessment mappings" ON public.assessment_skills_mapping FOR ALL USING (is_admin(auth.uid()));

-- Create indexes
CREATE INDEX idx_skills_taxonomy_category ON public.skills_taxonomy(skill_category);
CREATE INDEX idx_skills_taxonomy_demand ON public.skills_taxonomy(future_demand_score DESC);
CREATE INDEX idx_user_predictions_user_id ON public.user_skills_predictions(user_id);
CREATE INDEX idx_career_pathways_user_id ON public.career_pathway_predictions(user_id);
CREATE INDEX idx_industry_trends_industry ON public.industry_skills_trends(industry_name);
CREATE INDEX idx_assessment_mapping_type ON public.assessment_skills_mapping(assessment_type);