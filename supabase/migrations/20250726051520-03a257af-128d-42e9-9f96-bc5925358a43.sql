-- Create normative databases tables for assessment scoring
CREATE TABLE public.normative_databases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  dimension TEXT NOT NULL,
  demographic_group JSONB NOT NULL, -- age_range, gender, education, industry, etc.
  sample_size INTEGER NOT NULL,
  data_points NUMERIC[] NOT NULL, -- array of scores for percentile calculation
  mean_score NUMERIC NOT NULL,
  std_deviation NUMERIC NOT NULL,
  percentile_25 NUMERIC NOT NULL,
  percentile_50 NUMERIC NOT NULL,
  percentile_75 NUMERIC NOT NULL,
  percentile_90 NUMERIC NOT NULL,
  collected_date DATE NOT NULL DEFAULT CURRENT_DATE,
  data_quality_score NUMERIC DEFAULT 85.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bias analysis tracking table
CREATE TABLE public.bias_analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_result_id UUID REFERENCES assessment_results(id),
  assessment_type TEXT NOT NULL,
  demographic_data JSONB NOT NULL,
  dimension_scores JSONB NOT NULL,
  bias_indicators JSONB NOT NULL, -- adverse impact ratios, score differences by group
  fairness_metrics JSONB NOT NULL, -- statistical parity, equalized odds, etc.
  flagged_dimensions TEXT[],
  bias_severity TEXT CHECK (bias_severity IN ('low', 'medium', 'high', 'critical')),
  recommended_actions TEXT[],
  analysis_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment demographics tracking
CREATE TABLE public.assessment_demographics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  assessment_result_id UUID REFERENCES assessment_results(id),
  age_range TEXT, -- "18-24", "25-34", etc.
  gender TEXT,
  education_level TEXT,
  work_experience TEXT, -- "0-2", "3-5", "6-10", "10+" years
  industry TEXT,
  country TEXT,
  socioeconomic_background TEXT,
  cultural_background TEXT,
  primary_language TEXT,
  disability_accommodations BOOLEAN DEFAULT false,
  consent_for_research BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.normative_databases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bias_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_demographics ENABLE ROW LEVEL SECURITY;

-- Create policies for normative databases
CREATE POLICY "Admins can manage normative data" 
ON public.normative_databases 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "System can read normative data" 
ON public.normative_databases 
FOR SELECT 
USING (is_active = true);

-- Create policies for bias analysis
CREATE POLICY "Admins can view bias analysis" 
ON public.bias_analysis_results 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert bias analysis" 
ON public.bias_analysis_results 
FOR INSERT 
WITH CHECK (true);

-- Create policies for demographics
CREATE POLICY "Users can insert their own demographics" 
ON public.assessment_demographics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own demographics" 
ON public.assessment_demographics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view demographics for research" 
ON public.assessment_demographics 
FOR SELECT 
USING (is_admin(auth.uid()) AND consent_for_research = true);

-- Create indexes for performance
CREATE INDEX idx_normative_databases_assessment_type_dimension ON public.normative_databases(assessment_type, dimension);
CREATE INDEX idx_normative_databases_demographic_group ON public.normative_databases USING GIN(demographic_group);
CREATE INDEX idx_bias_analysis_assessment_type ON public.bias_analysis_results(assessment_type);
CREATE INDEX idx_bias_analysis_severity ON public.bias_analysis_results(bias_severity);
CREATE INDEX idx_assessment_demographics_user_id ON public.assessment_demographics(user_id);

-- Create function to get normative percentiles
CREATE OR REPLACE FUNCTION public.get_normative_percentiles(
  p_assessment_type TEXT,
  p_dimension TEXT,
  p_score NUMERIC,
  p_demographics JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  norm_data RECORD;
  percentile_result NUMERIC;
  result JSONB;
BEGIN
  -- Find best matching normative group
  SELECT * INTO norm_data
  FROM public.normative_databases
  WHERE assessment_type = p_assessment_type
    AND dimension = p_dimension
    AND is_active = true
    AND (
      demographic_group = p_demographics
      OR demographic_group @> p_demographics
      OR p_demographics = '{}'::jsonb
    )
  ORDER BY 
    CASE WHEN demographic_group = p_demographics THEN 1
         WHEN demographic_group @> p_demographics THEN 2
         ELSE 3 END,
    sample_size DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    -- Return default percentile if no normative data found
    RETURN jsonb_build_object(
      'percentile', 50,
      'normative_group', 'general',
      'sample_size', 0,
      'data_available', false
    );
  END IF;
  
  -- Calculate percentile based on score position in distribution
  IF p_score <= norm_data.percentile_25 THEN
    percentile_result := 25 * (p_score - (norm_data.mean_score - 2 * norm_data.std_deviation)) / 
                        (norm_data.percentile_25 - (norm_data.mean_score - 2 * norm_data.std_deviation));
  ELSIF p_score <= norm_data.percentile_50 THEN
    percentile_result := 25 + 25 * (p_score - norm_data.percentile_25) / 
                        (norm_data.percentile_50 - norm_data.percentile_25);
  ELSIF p_score <= norm_data.percentile_75 THEN
    percentile_result := 50 + 25 * (p_score - norm_data.percentile_50) / 
                        (norm_data.percentile_75 - norm_data.percentile_50);
  ELSIF p_score <= norm_data.percentile_90 THEN
    percentile_result := 75 + 15 * (p_score - norm_data.percentile_75) / 
                        (norm_data.percentile_90 - norm_data.percentile_75);
  ELSE
    percentile_result := 90 + 10 * (p_score - norm_data.percentile_90) / 
                        (norm_data.mean_score + 2 * norm_data.std_deviation - norm_data.percentile_90);
  END IF;
  
  -- Ensure percentile is within bounds
  percentile_result := GREATEST(1, LEAST(99, percentile_result));
  
  RETURN jsonb_build_object(
    'percentile', ROUND(percentile_result),
    'normative_group', norm_data.demographic_group,
    'sample_size', norm_data.sample_size,
    'data_available', true,
    'mean_score', norm_data.mean_score,
    'your_score', p_score,
    'score_interpretation', 
      CASE 
        WHEN percentile_result >= 90 THEN 'exceptional'
        WHEN percentile_result >= 75 THEN 'above_average'
        WHEN percentile_result >= 25 THEN 'average'
        WHEN percentile_result >= 10 THEN 'below_average'
        ELSE 'needs_development'
      END
  );
END;
$$;

-- Create function for bias detection analysis
CREATE OR REPLACE FUNCTION public.analyze_assessment_bias(
  p_assessment_type TEXT,
  p_time_period_days INTEGER DEFAULT 30
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  bias_analysis JSONB := '{}';
  dimension_analysis JSONB;
  adverse_impact NUMERIC;
  result JSONB := '{}';
BEGIN
  -- Only admins can run bias analysis
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Insufficient permissions to run bias analysis';
  END IF;
  
  -- Analyze bias by gender
  WITH gender_scores AS (
    SELECT 
      ad.gender,
      ar.results::jsonb as scores,
      COUNT(*) as sample_size
    FROM assessment_results ar
    JOIN assessment_demographics ad ON ar.id = ad.assessment_result_id
    WHERE ar.assessment_type = p_assessment_type
      AND ar.created_at >= now() - interval '1 day' * p_time_period_days
      AND ad.gender IN ('male', 'female', 'non-binary')
    GROUP BY ad.gender, ar.results
  ),
  bias_metrics AS (
    SELECT 
      gender,
      AVG((scores->>'overallScore')::numeric) as avg_score,
      sample_size
    FROM gender_scores
    GROUP BY gender, sample_size
  )
  SELECT jsonb_object_agg(
    gender, 
    jsonb_build_object(
      'average_score', avg_score,
      'sample_size', sample_size
    )
  ) INTO dimension_analysis
  FROM bias_metrics;
  
  -- Calculate adverse impact ratio (80% rule)
  SELECT 
    CASE 
      WHEN MAX(avg_score) > 0 THEN ROUND((MIN(avg_score) / MAX(avg_score)) * 100, 2)
      ELSE 100
    END
  INTO adverse_impact
  FROM (
    SELECT AVG((scores->>'overallScore')::numeric) as avg_score
    FROM assessment_results ar
    JOIN assessment_demographics ad ON ar.id = ad.assessment_result_id
    WHERE ar.assessment_type = p_assessment_type
      AND ar.created_at >= now() - interval '1 day' * p_time_period_days
    GROUP BY ad.gender
  ) subq;
  
  result := jsonb_build_object(
    'assessment_type', p_assessment_type,
    'analysis_period_days', p_time_period_days,
    'gender_analysis', dimension_analysis,
    'adverse_impact_ratio', adverse_impact,
    'bias_risk', 
      CASE 
        WHEN adverse_impact < 80 THEN 'high'
        WHEN adverse_impact < 90 THEN 'medium'
        ELSE 'low'
      END,
    'recommendations', 
      CASE 
        WHEN adverse_impact < 80 THEN ARRAY['Review assessment items for potential bias', 'Consider demographic-adjusted scoring', 'Expand normative database']
        WHEN adverse_impact < 90 THEN ARRAY['Monitor for emerging bias patterns', 'Collect more diverse normative data']
        ELSE ARRAY['Continue monitoring', 'Maintain current practices']
      END,
    'analyzed_at', now()
  );
  
  RETURN result;
END;
$$;