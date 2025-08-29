-- Create comprehensive future skills database schema

-- Skills catalog with ML features
CREATE TABLE public.future_skills_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  demand_score NUMERIC DEFAULT 0,
  supply_score NUMERIC DEFAULT 0,
  salary_premium NUMERIC DEFAULT 0,
  learning_difficulty NUMERIC DEFAULT 0,
  tech_adoption_score NUMERIC DEFAULT 0,
  automation_risk NUMERIC DEFAULT 0,
  growth_rate NUMERIC DEFAULT 0,
  confidence_score NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Industry trends and forecasting data
CREATE TABLE public.industry_trends_forecast (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry_name TEXT NOT NULL,
  region TEXT NOT NULL,
  forecast_period TEXT NOT NULL, -- '1y', '3y', '5y', '10y'
  job_postings_volume INTEGER DEFAULT 0,
  avg_salary NUMERIC DEFAULT 0,
  growth_rate NUMERIC DEFAULT 0,
  automation_risk NUMERIC DEFAULT 0,
  innovation_index NUMERIC DEFAULT 0,
  unemployment_rate NUMERIC DEFAULT 0,
  gdp_growth NUMERIC DEFAULT 0,
  confidence_intervals JSONB DEFAULT '{}',
  ml_model_version TEXT DEFAULT '1.0',
  forecast_generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(industry_name, region, forecast_period)
);

-- ML feature store for real-time features
CREATE TABLE public.ml_feature_store (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_category TEXT NOT NULL, -- 'regional', 'industry', 'skills', 'temporal', 'economic'
  feature_name TEXT NOT NULL,
  feature_value NUMERIC NOT NULL,
  entity_id TEXT, -- industry, region, skill identifier
  feature_metadata JSONB DEFAULT '{}',
  transformation_applied TEXT,
  data_source TEXT,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(feature_category, feature_name, entity_id, collected_at)
);

-- ML model experiments and performance tracking
CREATE TABLE public.ml_model_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL, -- 'prophet', 'lightgbm', 'xgboost', 'ensemble'
  model_version TEXT NOT NULL,
  hyperparameters JSONB NOT NULL DEFAULT '{}',
  training_metrics JSONB NOT NULL DEFAULT '{}',
  validation_metrics JSONB NOT NULL DEFAULT '{}',
  feature_importance JSONB DEFAULT '{}',
  data_version TEXT DEFAULT '1.0',
  training_duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
  created_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills demand forecasting results
CREATE TABLE public.skills_demand_forecast (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id UUID REFERENCES public.future_skills_catalog(id),
  region TEXT NOT NULL,
  industry TEXT,
  forecast_horizon INTEGER NOT NULL, -- months ahead
  predicted_demand NUMERIC NOT NULL,
  confidence_lower NUMERIC NOT NULL,
  confidence_upper NUMERIC NOT NULL,
  confidence_level NUMERIC DEFAULT 0.95,
  model_ensemble_results JSONB DEFAULT '{}',
  features_used JSONB DEFAULT '{}',
  forecast_metadata JSONB DEFAULT '{}',
  generated_by_model TEXT NOT NULL,
  model_version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(skill_id, region, industry, forecast_horizon)
);

-- User skill development tracking
CREATE TABLE public.user_skill_development (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  skill_id UUID REFERENCES public.future_skills_catalog(id),
  current_level INTEGER CHECK (current_level >= 1 AND current_level <= 10),
  target_level INTEGER CHECK (target_level >= 1 AND target_level <= 10),
  learning_path JSONB DEFAULT '[]',
  progress_percentage NUMERIC DEFAULT 0,
  estimated_completion_date DATE,
  priority_score NUMERIC DEFAULT 0,
  recommended_resources JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Enable RLS on all tables
ALTER TABLE public.future_skills_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_trends_forecast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_feature_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_demand_forecast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_development ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills catalog (public read)
CREATE POLICY "Anyone can view skills catalog" 
ON public.future_skills_catalog 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage skills catalog" 
ON public.future_skills_catalog 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for industry forecasts (public read)
CREATE POLICY "Anyone can view industry forecasts" 
ON public.industry_trends_forecast 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage forecasts" 
ON public.industry_trends_forecast 
FOR ALL 
USING (true);

-- RLS Policies for ML feature store (admin/system only)
CREATE POLICY "Admins can view ML features" 
ON public.ml_feature_store 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "System can manage ML features" 
ON public.ml_feature_store 
FOR ALL 
USING (true);

-- RLS Policies for ML experiments (admin only)
CREATE POLICY "Admins can view ML experiments" 
ON public.ml_model_experiments 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage ML experiments" 
ON public.ml_model_experiments 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for demand forecasts (public read)
CREATE POLICY "Anyone can view demand forecasts" 
ON public.skills_demand_forecast 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage demand forecasts" 
ON public.skills_demand_forecast 
FOR ALL 
USING (true);

-- RLS Policies for user skill development (user-specific)
CREATE POLICY "Users can view their own skill development" 
ON public.user_skill_development 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skill development" 
ON public.user_skill_development 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_skills_catalog_category ON public.future_skills_catalog(category);
CREATE INDEX idx_skills_catalog_demand_score ON public.future_skills_catalog(demand_score DESC);
CREATE INDEX idx_industry_forecast_region_industry ON public.industry_trends_forecast(region, industry_name);
CREATE INDEX idx_ml_features_category_entity ON public.ml_feature_store(feature_category, entity_id);
CREATE INDEX idx_skills_forecast_skill_region ON public.skills_demand_forecast(skill_id, region);
CREATE INDEX idx_user_skills_user_id ON public.user_skill_development(user_id);

-- Create updated_at triggers
CREATE TRIGGER update_skills_catalog_updated_at
  BEFORE UPDATE ON public.future_skills_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_forecast_updated_at
  BEFORE UPDATE ON public.industry_trends_forecast
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ml_experiments_updated_at
  BEFORE UPDATE ON public.ml_model_experiments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_forecast_updated_at
  BEFORE UPDATE ON public.skills_demand_forecast
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at
  BEFORE UPDATE ON public.user_skill_development
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();