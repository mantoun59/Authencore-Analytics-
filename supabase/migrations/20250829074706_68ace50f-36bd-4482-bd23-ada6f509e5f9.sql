-- Future Skills Database Schema
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
  prediction_timeframe INTEGER NOT NULL DEFAULT 36, -- months
  confidence_level NUMERIC NOT NULL DEFAULT 0,
  industry_context TEXT,
  role_context TEXT,
  prediction_metadata JSONB DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '6 months'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Career pathway predictions
CREATE TABLE public.career_pathway_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_role TEXT NOT NULL,
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

-- Enable RLS on all tables
ALTER TABLE public.skills_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_pathway_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_skills_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_skills_mapping ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view skills taxonomy" 
ON public.skills_taxonomy FOR SELECT USING (true);

CREATE POLICY "Admins can manage skills taxonomy" 
ON public.skills_taxonomy FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own predictions" 
ON public.user_skills_predictions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" 
ON public.user_skills_predictions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can manage predictions" 
ON public.user_skills_predictions FOR ALL 
USING (true);

CREATE POLICY "Users can view their own career pathways" 
ON public.career_pathway_predictions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career pathways" 
ON public.career_pathway_predictions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can manage career pathways" 
ON public.career_pathway_predictions FOR ALL 
USING (true);

CREATE POLICY "Anyone can view industry trends" 
ON public.industry_skills_trends FOR SELECT USING (true);

CREATE POLICY "Admins can manage industry trends" 
ON public.industry_skills_trends FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view assessment mappings" 
ON public.assessment_skills_mapping FOR SELECT USING (true);

CREATE POLICY "Admins can manage assessment mappings" 
ON public.assessment_skills_mapping FOR ALL USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_skills_taxonomy_category ON public.skills_taxonomy(skill_category);
CREATE INDEX idx_skills_taxonomy_demand ON public.skills_taxonomy(future_demand_score DESC);
CREATE INDEX idx_user_predictions_user_id ON public.user_skills_predictions(user_id);
CREATE INDEX idx_career_pathways_user_id ON public.career_pathway_predictions(user_id);
CREATE INDEX idx_industry_trends_industry ON public.industry_skills_trends(industry_name);
CREATE INDEX idx_assessment_mapping_type ON public.assessment_skills_mapping(assessment_type);

-- Insert sample skills taxonomy data
INSERT INTO public.skills_taxonomy (skill_name, skill_category, current_demand_score, future_demand_score, growth_trajectory, industry_relevance, related_skills, skill_type, description, emergence_timeline) VALUES
('Artificial Intelligence', 'Technology', 85, 95, 25, '{"technology": 95, "healthcare": 80, "finance": 85}', '{"Machine Learning", "Data Science", "Python"}', 'technical', 'Core AI technologies and methodologies', 'current'),
('Machine Learning', 'Technology', 80, 90, 30, '{"technology": 90, "healthcare": 75, "finance": 80}', '{"Artificial Intelligence", "Data Science", "Statistics"}', 'technical', 'ML algorithms and model development', 'current'),
('Quantum Computing', 'Technology', 15, 70, 400, '{"technology": 85, "research": 95, "defense": 75}', '{"Physics", "Mathematics", "Computer Science"}', 'technical', 'Quantum algorithms and systems', 'emerging'),
('Prompt Engineering', 'Technology', 70, 85, 35, '{"technology": 90, "marketing": 60, "content": 75}', '{"Artificial Intelligence", "Natural Language Processing"}', 'technical', 'AI prompt optimization and design', 'current'),
('Emotional Intelligence', 'Soft Skills', 75, 85, 20, '{"management": 90, "healthcare": 85, "education": 95}', '{"Leadership", "Communication", "Empathy"}', 'soft', 'Understanding and managing emotions', 'current'),
('Systems Thinking', 'Cognitive', 65, 80, 35, '{"management": 85, "engineering": 80, "consulting": 90}', '{"Problem Solving", "Strategic Planning"}', 'cognitive', 'Holistic approach to complex problems', 'current'),
('Blockchain Development', 'Technology', 45, 65, 50, '{"fintech": 85, "supply_chain": 70, "gaming": 60}', '{"Cryptography", "Distributed Systems"}', 'technical', 'Blockchain and DeFi technologies', 'current'),
('Virtual Reality Design', 'Technology', 35, 75, 120, '{"gaming": 90, "education": 70, "healthcare": 65}', '{"3D Modeling", "User Experience", "Programming"}', 'technical', 'VR/AR interface and experience design', 'emerging'),
('Data Privacy Engineering', 'Technology', 60, 85, 45, '{"technology": 85, "healthcare": 90, "finance": 95}', '{"Cybersecurity", "Legal Compliance", "Data Science"}', 'technical', 'Privacy-preserving data systems', 'current'),
('Climate Technology', 'Sustainability', 55, 90, 85, '{"energy": 95, "manufacturing": 80, "agriculture": 75}', '{"Engineering", "Data Analysis", "Policy"}', 'technical', 'Clean technology and sustainability solutions', 'emerging');

-- Insert sample industry trends
INSERT INTO public.industry_skills_trends (industry_name, trending_skills, declining_skills, emerging_technologies, skill_demand_forecast, data_collection_date, forecast_horizon) VALUES
('Technology', '{"AI/ML": 95, "Cloud Computing": 90, "Cybersecurity": 88, "Data Science": 85}', '{"Legacy Systems": 25, "Manual Testing": 35, "Waterfall PM": 30}', '{"Quantum Computing": 85, "Edge AI": 80, "Web3": 75}', '{"AI/ML": {"2024": 85, "2025": 92, "2026": 98}, "Cybersecurity": {"2024": 88, "2025": 91, "2026": 95}}', CURRENT_DATE, 36),
('Healthcare', '{"Digital Health": 90, "AI Diagnostics": 85, "Telemedicine": 80, "Genomics": 75}', '{"Paper Records": 15, "Manual Scheduling": 25}', '{"Precision Medicine": 90, "Digital Therapeutics": 85}', '{"Digital Health": {"2024": 80, "2025": 88, "2026": 95}, "AI Diagnostics": {"2024": 70, "2025": 82, "2026": 90}}', CURRENT_DATE, 36),
('Finance', '{"FinTech": 90, "Blockchain": 75, "RegTech": 80, "Digital Banking": 85}', '{"Manual Processing": 20, "Legacy Banking": 30}', '{"DeFi": 70, "Central Bank Digital Currencies": 85}', '{"FinTech": {"2024": 85, "2025": 90, "2026": 95}, "Blockchain": {"2024": 60, "2025": 75, "2026": 85}}', CURRENT_DATE, 36);

-- Insert sample assessment mappings
INSERT INTO public.assessment_skills_mapping (assessment_type, assessment_dimension, mapped_skills, skill_weights, prediction_relevance, mapping_confidence) VALUES
('career-launch', 'analytical_thinking', '{"Data Science", "Problem Solving", "Critical Thinking"}', '{"Data Science": 0.4, "Problem Solving": 0.35, "Critical Thinking": 0.25}', 0.85, 0.90),
('career-launch', 'creativity', '{"Innovation", "Design Thinking", "Creative Problem Solving"}', '{"Innovation": 0.4, "Design Thinking": 0.35, "Creative Problem Solving": 0.25}', 0.80, 0.85),
('communication', 'digital_communication', '{"Digital Marketing", "Social Media", "Content Creation"}', '{"Digital Marketing": 0.4, "Social Media": 0.3, "Content Creation": 0.3}', 0.75, 0.80),
('emotional-intelligence', 'self_awareness', '{"Emotional Intelligence", "Self Management", "Leadership"}', '{"Emotional Intelligence": 0.5, "Self Management": 0.3, "Leadership": 0.2}', 0.90, 0.95);