-- Phase 1: Database Migration for Comprehensive Assessment Suite

-- Create assessment catalog table
CREATE TABLE public.assessment_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  question_count INTEGER NOT NULL,
  estimated_duration_minutes INTEGER NOT NULL,
  theoretical_foundation TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create technology integration results table
CREATE TABLE public.technology_integration_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  usage_patterns NUMERIC NOT NULL,
  digital_boundaries NUMERIC NOT NULL,
  tech_life_balance NUMERIC NOT NULL,
  productivity_impact NUMERIC NOT NULL,
  overall_tech_integration NUMERIC NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communication competency results table
CREATE TABLE public.communication_competency_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  direct_indirect NUMERIC NOT NULL,
  formal_informal NUMERIC NOT NULL,
  expressive_reserved NUMERIC NOT NULL,
  task_relationship NUMERIC NOT NULL,
  overall_communication_effectiveness NUMERIC NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leadership behavior results table
CREATE TABLE public.leadership_behavior_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  visionary_leadership NUMERIC NOT NULL,
  coaching_leadership NUMERIC NOT NULL,
  affiliative_leadership NUMERIC NOT NULL,
  democratic_leadership NUMERIC NOT NULL,
  pacesetting_leadership NUMERIC NOT NULL,
  commanding_leadership NUMERIC NOT NULL,
  overall_leadership_effectiveness NUMERIC NOT NULL,
  primary_style TEXT NOT NULL,
  secondary_style TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work values results table
CREATE TABLE public.work_values_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  achievement_recognition NUMERIC NOT NULL,
  autonomy_independence NUMERIC NOT NULL,
  social_impact_service NUMERIC NOT NULL,
  security_stability NUMERIC NOT NULL,
  growth_learning NUMERIC NOT NULL,
  work_life_integration NUMERIC NOT NULL,
  innovation_creativity NUMERIC NOT NULL,
  leadership_influence NUMERIC NOT NULL,
  collaboration_teamwork NUMERIC NOT NULL,
  values_hierarchy JSONB NOT NULL,
  top_values JSONB NOT NULL,
  bottom_values JSONB NOT NULL,
  values_profile JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create work preferences results table
CREATE TABLE public.work_preferences_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  work_preferences NUMERIC NOT NULL,
  communication_styles NUMERIC NOT NULL,
  career_expectations NUMERIC NOT NULL,
  technology_integration NUMERIC NOT NULL,
  multigenerational_strategies NUMERIC NOT NULL,
  preference_profile JSONB NOT NULL,
  workplace_fit JSONB NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.assessment_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_integration_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_competency_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_behavior_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_values_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_preferences_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_catalog
CREATE POLICY "Anyone can view active assessments" 
ON public.assessment_catalog 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage assessment catalog" 
ON public.assessment_catalog 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for technology_integration_results
CREATE POLICY "Users can view their own tech integration results" 
ON public.technology_integration_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own tech integration results" 
ON public.technology_integration_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tech integration results" 
ON public.technology_integration_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- RLS Policies for communication_competency_results
CREATE POLICY "Users can view their own communication results" 
ON public.communication_competency_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own communication results" 
ON public.communication_competency_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own communication results" 
ON public.communication_competency_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- RLS Policies for leadership_behavior_results
CREATE POLICY "Users can view their own leadership results" 
ON public.leadership_behavior_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own leadership results" 
ON public.leadership_behavior_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leadership results" 
ON public.leadership_behavior_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- RLS Policies for work_values_results
CREATE POLICY "Users can view their own work values results" 
ON public.work_values_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own work values results" 
ON public.work_values_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work values results" 
ON public.work_values_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- RLS Policies for work_preferences_results
CREATE POLICY "Users can view their own work preferences results" 
ON public.work_preferences_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own work preferences results" 
ON public.work_preferences_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work preferences results" 
ON public.work_preferences_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_tech_integration_user_id ON public.technology_integration_results(user_id);
CREATE INDEX idx_tech_integration_session_id ON public.technology_integration_results(session_id);
CREATE INDEX idx_communication_competency_user_id ON public.communication_competency_results(user_id);
CREATE INDEX idx_communication_competency_session_id ON public.communication_competency_results(session_id);
CREATE INDEX idx_leadership_behavior_user_id ON public.leadership_behavior_results(user_id);
CREATE INDEX idx_leadership_behavior_session_id ON public.leadership_behavior_results(session_id);
CREATE INDEX idx_work_values_user_id ON public.work_values_results(user_id);
CREATE INDEX idx_work_values_session_id ON public.work_values_results(session_id);
CREATE INDEX idx_work_preferences_user_id ON public.work_preferences_results(user_id);
CREATE INDEX idx_work_preferences_session_id ON public.work_preferences_results(session_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_assessment_catalog_updated_at
    BEFORE UPDATE ON public.assessment_catalog
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tech_integration_updated_at
    BEFORE UPDATE ON public.technology_integration_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communication_competency_updated_at
    BEFORE UPDATE ON public.communication_competency_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leadership_behavior_updated_at
    BEFORE UPDATE ON public.leadership_behavior_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_values_updated_at
    BEFORE UPDATE ON public.work_values_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_preferences_updated_at
    BEFORE UPDATE ON public.work_preferences_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert assessment catalog data
INSERT INTO public.assessment_catalog (
  assessment_type, 
  name, 
  description, 
  question_count, 
  estimated_duration_minutes,
  theoretical_foundation,
  is_active
) VALUES 
  ('technology_integration', 'Technology Integration & Boundary Management', 'Assesses effective technology use and digital boundaries', 25, 10, 'Boundary Theory + Technology Acceptance Model', true),
  ('communication_competency', 'Professional Communication Competencies', 'Evaluates communication effectiveness across professional contexts', 30, 12, 'Communication Competence Model', true),
  ('leadership_behavior', 'Leadership Behaviors & Effectiveness', 'Measures leadership behaviors and situational effectiveness', 40, 17, 'Transformational Leadership Theory', true),
  ('work_values', 'Work Values & Motivation', 'Identifies personal work values and motivational drivers', 45, 16, 'Super Work Values Inventory + Self-Determination Theory', true),
  ('work_preferences', 'Individual Work Preferences', 'Assesses individual workplace preferences and optimal environments', 35, 15, 'Job Characteristics Model', true);