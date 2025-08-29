-- Create real-time data sources and multi-AI engine system
-- Data Sources Management
CREATE TABLE public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('recruitment', 'government', 'ngo', 'academic', 'industry', 'social_media')),
  api_endpoint TEXT,
  refresh_frequency INTEGER DEFAULT 3600, -- seconds
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_quality_score DECIMAL(3,2) DEFAULT 0.85,
  region TEXT,
  industry_focus TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Engines Management
CREATE TABLE public.ai_engines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engine_name TEXT NOT NULL,
  engine_type TEXT NOT NULL CHECK (engine_type IN ('openai', 'anthropic', 'google', 'huggingface', 'custom')),
  model_version TEXT NOT NULL,
  api_endpoint TEXT,
  capabilities TEXT[],
  accuracy_score DECIMAL(3,2) DEFAULT 0.90,
  cost_per_request DECIMAL(8,4) DEFAULT 0.01,
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 1000,
  region_availability TEXT[],
  specialization TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time Skills Market Data
CREATE TABLE public.skills_market_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  region TEXT NOT NULL,
  industry TEXT NOT NULL,
  data_source_id UUID REFERENCES public.data_sources(id),
  demand_volume INTEGER DEFAULT 0,
  supply_volume INTEGER DEFAULT 0,
  avg_salary_usd INTEGER DEFAULT 0,
  job_postings_count INTEGER DEFAULT 0,
  growth_rate_percentage DECIMAL(5,2) DEFAULT 0,
  automation_risk_score DECIMAL(3,2) DEFAULT 0,
  data_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confidence_score DECIMAL(3,2) DEFAULT 0.85,
  raw_data JSONB DEFAULT '{}',
  UNIQUE(skill_name, region, industry, data_source_id, data_timestamp)
);

-- Live Economic Indicators
CREATE TABLE public.economic_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  indicator_type TEXT NOT NULL CHECK (indicator_type IN ('gdp_growth', 'unemployment', 'inflation', 'interest_rates', 'tech_investment', 'education_spending')),
  value DECIMAL(10,4) NOT NULL,
  unit TEXT NOT NULL,
  data_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_source_id UUID REFERENCES public.data_sources(id),
  forecast_horizon TEXT,
  confidence_level DECIMAL(3,2) DEFAULT 0.90,
  metadata JSONB DEFAULT '{}'
);

-- Multi-AI Consensus Predictions
CREATE TABLE public.ai_consensus_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  region TEXT NOT NULL,
  industry TEXT NOT NULL,
  prediction_horizon TEXT NOT NULL,
  ai_engine_results JSONB NOT NULL, -- Results from multiple AI engines
  consensus_score DECIMAL(10,2) NOT NULL,
  confidence_interval JSONB NOT NULL, -- {lower, upper, level}
  variance_score DECIMAL(3,2) NOT NULL,
  prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  validation_score DECIMAL(3,2),
  market_sentiment TEXT CHECK (market_sentiment IN ('bullish', 'bearish', 'neutral')),
  risk_factors TEXT[],
  opportunity_factors TEXT[]
);

-- Real-time Notifications and Alerts
CREATE TABLE public.market_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('skill_surge', 'market_shift', 'opportunity', 'risk')),
  skill_name TEXT,
  region TEXT,
  industry TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  triggered_by JSONB NOT NULL, -- Source data that triggered alert
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT now() + INTERVAL '7 days'
);

-- Add RLS policies
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.economic_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_consensus_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for data sources and AI engines (for transparency)
CREATE POLICY "Data sources are publicly viewable" ON public.data_sources FOR SELECT USING (true);
CREATE POLICY "AI engines are publicly viewable" ON public.ai_engines FOR SELECT USING (true);

-- Public read access for market data and indicators
CREATE POLICY "Market data is publicly viewable" ON public.skills_market_data FOR SELECT USING (true);
CREATE POLICY "Economic indicators are publicly viewable" ON public.economic_indicators FOR SELECT USING (true);
CREATE POLICY "AI predictions are publicly viewable" ON public.ai_consensus_predictions FOR SELECT USING (true);

-- User-specific alerts
CREATE POLICY "Users can view their own alerts" ON public.market_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.market_alerts FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial data sources
INSERT INTO public.data_sources (source_name, source_type, api_endpoint, region, industry_focus, metadata) VALUES
('LinkedIn Talent Solutions', 'recruitment', 'https://api.linkedin.com/v2/skills', 'Global', ARRAY['Technology', 'Finance', 'Healthcare'], '{"rate_limit": 1000, "data_freshness": "hourly"}'),
('Indeed Job Trends', 'recruitment', 'https://api.indeed.com/ads/trends', 'Global', ARRAY['All'], '{"historical_depth": "5_years", "update_frequency": "daily"}'),
('US Bureau of Labor Statistics', 'government', 'https://api.bls.gov/publicAPI/v2/', 'North America', ARRAY['All'], '{"official_data": true, "lag_time": "monthly"}'),
('European Skills Panorama', 'government', 'https://skillspanorama.cedefop.europa.eu/api/', 'Europe', ARRAY['All'], '{"eu_official": true, "forecast_horizon": "10_years"}'),
('World Economic Forum', 'ngo', 'https://api.weforum.org/skills/', 'Global', ARRAY['All'], '{"future_of_work": true, "expert_analysis": true}'),
('OECD Skills Database', 'ngo', 'https://stats.oecd.org/restsdmx/sdmx.ashx/', 'Global', ARRAY['All'], '{"comparative_data": true, "country_benchmarks": true}'),
('Coursera Skills Report', 'academic', 'https://api.coursera.org/skills-trends/', 'Global', ARRAY['Technology', 'Data Science'], '{"learning_trends": true, "skill_popularity": true}'),
('GitHub Jobs API', 'industry', 'https://jobs.github.com/api/', 'Global', ARRAY['Technology'], '{"developer_skills": true, "open_source": true}'),
('Stack Overflow Developer Survey', 'industry', 'https://api.stackexchange.com/', 'Global', ARRAY['Technology'], '{"developer_sentiment": true, "salary_data": true}');

-- Insert AI engines
INSERT INTO public.ai_engines (engine_name, engine_type, model_version, capabilities, accuracy_score, specialization) VALUES
('GPT-5 Turbo', 'openai', 'gpt-5-2025-08-07', ARRAY['text_analysis', 'prediction', 'reasoning'], 0.94, ARRAY['general_intelligence', 'market_analysis']),
('Claude 4 Sonnet', 'anthropic', 'claude-sonnet-4-20250514', ARRAY['analysis', 'reasoning', 'forecasting'], 0.92, ARRAY['analytical_reasoning', 'trend_analysis']),
('Gemini Ultra', 'google', 'gemini-ultra-1.5', ARRAY['multimodal', 'prediction', 'analysis'], 0.90, ARRAY['data_integration', 'pattern_recognition']),
('Prophet Forecasting', 'custom', 'prophet-2.1', ARRAY['time_series', 'forecasting'], 0.88, ARRAY['time_series_analysis', 'trend_detection']),
('LightGBM Ensemble', 'custom', 'lightgbm-3.2', ARRAY['gradient_boosting', 'classification'], 0.91, ARRAY['tabular_data', 'feature_importance']),
('XGBoost Advanced', 'custom', 'xgboost-1.7', ARRAY['ensemble', 'regression'], 0.89, ARRAY['structured_prediction', 'cross_validation']);

-- Create indexes for performance
CREATE INDEX idx_skills_market_data_timestamp ON public.skills_market_data(data_timestamp DESC);
CREATE INDEX idx_skills_market_data_skill_region ON public.skills_market_data(skill_name, region, industry);
CREATE INDEX idx_economic_indicators_timestamp ON public.economic_indicators(data_timestamp DESC);
CREATE INDEX idx_ai_predictions_timestamp ON public.ai_consensus_predictions(prediction_timestamp DESC);
CREATE INDEX idx_market_alerts_user_created ON public.market_alerts(user_id, created_at DESC);

-- Create real-time subscription triggers
ALTER TABLE public.skills_market_data REPLICA IDENTITY FULL;
ALTER TABLE public.ai_consensus_predictions REPLICA IDENTITY FULL;
ALTER TABLE public.market_alerts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.skills_market_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_consensus_predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_alerts;