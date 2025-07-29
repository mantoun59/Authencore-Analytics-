-- AuthenCore Analytics Additional Database Tables
-- Normative data, bias analysis, and advanced features

-- Normative databases for scoring comparison
CREATE TABLE public.normative_databases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  dimension TEXT NOT NULL,
  demographic_group JSONB NOT NULL,
  sample_size INTEGER NOT NULL,
  data_points NUMERIC[] NOT NULL,
  mean_score NUMERIC NOT NULL,
  std_deviation NUMERIC NOT NULL,
  percentile_25 NUMERIC NOT NULL,
  percentile_50 NUMERIC NOT NULL,
  percentile_75 NUMERIC NUMERIC NOT NULL,
  percentile_90 NUMERIC NOT NULL,
  collected_date DATE NOT NULL DEFAULT CURRENT_DATE,
  data_quality_score NUMERIC DEFAULT 85.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bias analysis results
CREATE TABLE public.bias_analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  assessment_result_id UUID,
  demographic_data JSONB NOT NULL,
  dimension_scores JSONB NOT NULL,
  bias_indicators JSONB NOT NULL,
  fairness_metrics JSONB NOT NULL,
  flagged_dimensions TEXT[],
  bias_severity TEXT,
  recommended_actions TEXT[],
  analysis_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI content validation
CREATE TABLE public.ai_content_validation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  validation_score NUMERIC NOT NULL DEFAULT 0,
  is_valid BOOLEAN NOT NULL DEFAULT false,
  human_review_required BOOLEAN NOT NULL DEFAULT false,
  issues TEXT[] DEFAULT '{}',
  bias_flags TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  validated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Professional standards compliance tracking
CREATE TABLE public.professional_standards_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  standard_type TEXT NOT NULL,
  compliance_status TEXT NOT NULL DEFAULT 'non_compliant',
  compliance_score NUMERIC NOT NULL DEFAULT 0,
  requirements_met TEXT[] DEFAULT '{}',
  requirements_missing TEXT[] DEFAULT '{}',
  last_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_review_due TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  remediation_plan TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Scoring versions for algorithm management
CREATE TABLE public.scoring_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version_number TEXT NOT NULL,
  algorithm_type TEXT NOT NULL,
  parameters JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Schema versions for migration tracking
CREATE TABLE public.schema_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version_number TEXT NOT NULL,
  description TEXT NOT NULL,
  migration_file TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  executed_by TEXT DEFAULT CURRENT_USER,
  checksum TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Gen Z specific assessment tables
CREATE TABLE public.genz_assessment_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  context TEXT,
  emoji TEXT,
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.genz_assessment_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID NOT NULL,
  scenario_id UUID,
  response_type TEXT NOT NULL,
  swipe_data JSONB,
  response_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.genz_assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID NOT NULL,
  username TEXT NOT NULL,
  birth_year INTEGER,
  avatar_emoji TEXT,
  workplace_preferences JSONB NOT NULL,
  dimensions JSONB NOT NULL,
  traits JSONB NOT NULL,
  workplace_profile JSONB NOT NULL,
  company_matches JSONB NOT NULL,
  red_flags JSONB NOT NULL,
  validity_metrics JSONB,
  employer_insights JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.genz_values_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID NOT NULL,
  value_id TEXT NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.genz_collaboration_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID NOT NULL,
  scenario_id TEXT NOT NULL,
  selected_option TEXT NOT NULL,
  option_scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_normative_databases_assessment_type ON public.normative_databases(assessment_type);
CREATE INDEX idx_normative_databases_dimension ON public.normative_databases(dimension);
CREATE INDEX idx_bias_analysis_assessment_type ON public.bias_analysis_results(assessment_type);
CREATE INDEX idx_ai_content_validation_report_id ON public.ai_content_validation(report_id);
CREATE INDEX idx_professional_standards_assessment_type ON public.professional_standards_compliance(assessment_type);
CREATE INDEX idx_genz_responses_session_id ON public.genz_assessment_responses(session_id);
CREATE INDEX idx_genz_results_session_id ON public.genz_assessment_results(session_id);

-- Enable RLS on new tables
ALTER TABLE public.normative_databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bias_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content_validation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_standards_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_assessment_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_values_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_collaboration_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables

-- Normative databases policies
CREATE POLICY "Admins can manage normative data" 
ON public.normative_databases 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "System can read normative data" 
ON public.normative_databases 
FOR SELECT 
USING (is_active = true);

-- Bias analysis policies
CREATE POLICY "System can insert bias analysis" 
ON public.bias_analysis_results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view bias analysis" 
ON public.bias_analysis_results 
FOR SELECT 
USING (is_admin(auth.uid()));

-- AI content validation policies
CREATE POLICY "System can insert validation results" 
ON public.ai_content_validation 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage AI validation results" 
ON public.ai_content_validation 
FOR ALL 
USING (is_admin(auth.uid()));

-- Professional standards policies
CREATE POLICY "Admins can manage compliance tracking" 
ON public.professional_standards_compliance 
FOR ALL 
USING (is_admin(auth.uid()));

-- Scoring versions policies
CREATE POLICY "Anyone can view active versions" 
ON public.scoring_versions 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage scoring versions" 
ON public.scoring_versions 
FOR ALL 
USING (is_admin(auth.uid()));

-- Schema versions policies
CREATE POLICY "Admins can manage schema versions" 
ON public.schema_versions 
FOR ALL 
USING (is_admin(auth.uid()));

-- Gen Z assessment policies
CREATE POLICY "Anyone can view scenarios" 
ON public.genz_assessment_scenarios 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own responses" 
ON public.genz_assessment_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own responses" 
ON public.genz_assessment_responses 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own results" 
ON public.genz_assessment_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own results" 
ON public.genz_assessment_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own results" 
ON public.genz_assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own values" 
ON public.genz_values_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own values" 
ON public.genz_values_responses 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own collaboration responses" 
ON public.genz_collaboration_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own collaboration responses" 
ON public.genz_collaboration_responses 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);