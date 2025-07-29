-- AuthenCore Analytics Advanced Database Functions
-- Additional business logic, analytics, and specialized functions

-- Get normative percentiles function
CREATE OR REPLACE FUNCTION public.get_normative_percentiles(
  p_assessment_type TEXT,
  p_dimension TEXT,
  p_score NUMERIC,
  p_demographics JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Analyze assessment bias function
CREATE OR REPLACE FUNCTION public.analyze_assessment_bias(
  p_assessment_type TEXT,
  p_time_period_days INTEGER DEFAULT 30
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Log security audit function
CREATE OR REPLACE FUNCTION public.log_security_audit(
  p_audit_type TEXT,
  p_findings JSONB DEFAULT NULL,
  p_recommendations JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO public.security_events (
        user_id,
        event_type,
        event_details,
        severity
    ) VALUES (
        auth.uid(),
        'security_audit',
        jsonb_build_object(
            'audit_type', p_audit_type,
            'findings', p_findings,
            'recommendations', p_recommendations,
            'timestamp', now()
        ),
        'info'
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$function$;

-- Request admin password reset function
CREATE OR REPLACE FUNCTION public.request_admin_password_reset(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- This function should trigger a secure password reset email
  -- Instead of setting a hardcoded password
  -- The actual reset should happen through proper auth flow
  INSERT INTO public.security_events (
    user_id,
    event_type,
    event_details,
    severity
  )
  SELECT 
    id,
    'admin_password_reset_requested',
    jsonb_build_object('email', p_email, 'requested_at', now()),
    'info'
  FROM auth.users 
  WHERE email = p_email;
  
  RAISE NOTICE 'Password reset request logged for email: %', p_email;
END;
$function$;

-- Trigger purchase report function
CREATE OR REPLACE FUNCTION public.trigger_purchase_report(
  p_period TEXT,
  p_admin_email TEXT DEFAULT 'admin@authencore.org'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSON;
BEGIN
  -- Only admins can trigger reports
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Insufficient permissions to trigger purchase reports';
  END IF;

  -- Trigger the edge function
  SELECT net.http_post(
    url := 'https://jlbftyjewxgetxcihban.supabase.co/functions/v1/purchase-analytics',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg"}'::jsonb,
    body := json_build_object('period', p_period, 'adminEmail', p_admin_email, 'manual', true)::jsonb
  ) INTO result;

  -- Log the manual trigger
  PERFORM log_analytics_event(
    p_event_type := 'manual_purchase_report_triggered',
    p_entity_type := 'analytics',
    p_metadata := json_build_object(
      'period', p_period,
      'admin_email', p_admin_email,
      'triggered_by', auth.uid(),
      'triggered_at', now()
    )::jsonb
  );

  RETURN json_build_object('success', true, 'message', 'Report triggered successfully', 'request_id', result);
END;
$function$;

-- Calculate Gen Z workplace compatibility function
CREATE OR REPLACE FUNCTION public.calculate_genz_compatibility(
  p_session_id UUID,
  p_workplace_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_preferences JSONB;
  compatibility_score NUMERIC := 0;
  compatibility_details JSONB := '{}';
  total_factors INTEGER := 0;
BEGIN
  -- Get user's workplace preferences
  SELECT workplace_preferences INTO user_preferences
  FROM public.genz_assessment_results
  WHERE session_id = p_session_id;
  
  IF user_preferences IS NULL THEN
    RETURN jsonb_build_object('error', 'No assessment results found for session');
  END IF;
  
  -- Calculate compatibility across key factors
  
  -- Work flexibility
  IF (user_preferences->>'flexibility_importance')::numeric > 0 AND 
     (p_workplace_data->>'remote_work_options')::boolean = true THEN
    compatibility_score := compatibility_score + (user_preferences->>'flexibility_importance')::numeric;
    compatibility_details := compatibility_details || jsonb_build_object('flexibility_match', true);
  END IF;
  total_factors := total_factors + 1;
  
  -- Growth opportunities
  IF (user_preferences->>'growth_importance')::numeric > 0 AND 
     (p_workplace_data->>'learning_budget')::numeric > 1000 THEN
    compatibility_score := compatibility_score + (user_preferences->>'growth_importance')::numeric;
    compatibility_details := compatibility_details || jsonb_build_object('growth_match', true);
  END IF;
  total_factors := total_factors + 1;
  
  -- Technology adoption
  IF (user_preferences->>'tech_forward')::boolean = true AND 
     (p_workplace_data->>'modern_tech_stack')::boolean = true THEN
    compatibility_score := compatibility_score + 20;
    compatibility_details := compatibility_details || jsonb_build_object('tech_match', true);
  END IF;
  total_factors := total_factors + 1;
  
  -- Purpose and values alignment
  IF user_preferences ? 'values' AND p_workplace_data ? 'company_values' THEN
    -- Simple overlap calculation
    IF jsonb_array_length(user_preferences->'values') > 0 AND
       jsonb_array_length(p_workplace_data->'company_values') > 0 THEN
      compatibility_score := compatibility_score + 15;
      compatibility_details := compatibility_details || jsonb_build_object('values_match', true);
    END IF;
  END IF;
  total_factors := total_factors + 1;
  
  -- Normalize score to 0-100
  IF total_factors > 0 THEN
    compatibility_score := (compatibility_score / total_factors);
  END IF;
  
  RETURN jsonb_build_object(
    'compatibility_score', ROUND(compatibility_score, 1),
    'compatibility_level', 
      CASE 
        WHEN compatibility_score >= 80 THEN 'excellent'
        WHEN compatibility_score >= 60 THEN 'good'
        WHEN compatibility_score >= 40 THEN 'moderate'
        ELSE 'low'
      END,
    'details', compatibility_details,
    'calculated_at', now()
  );
END;
$function$;

-- Advanced analytics aggregation function
CREATE OR REPLACE FUNCTION public.get_assessment_analytics(
  p_time_period_days INTEGER DEFAULT 30,
  p_assessment_type TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  analytics_result JSONB := '{}';
  completion_stats JSONB;
  score_distribution JSONB;
  demographic_breakdown JSONB;
BEGIN
  -- Only admins can access analytics
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Insufficient permissions to access analytics';
  END IF;
  
  -- Get completion statistics
  WITH completion_data AS (
    SELECT 
      assessment_type,
      COUNT(*) as total_completions,
      AVG((results->>'overallScore')::numeric) as avg_score,
      MIN(created_at) as first_completion,
      MAX(created_at) as last_completion
    FROM assessment_results
    WHERE created_at >= now() - interval '1 day' * p_time_period_days
      AND (p_assessment_type IS NULL OR assessment_type = p_assessment_type)
    GROUP BY assessment_type
  )
  SELECT jsonb_object_agg(assessment_type, jsonb_build_object(
    'total_completions', total_completions,
    'average_score', ROUND(avg_score, 2),
    'first_completion', first_completion,
    'last_completion', last_completion
  )) INTO completion_stats
  FROM completion_data;
  
  -- Get score distribution
  WITH score_ranges AS (
    SELECT 
      assessment_type,
      CASE 
        WHEN (results->>'overallScore')::numeric >= 90 THEN 'excellent'
        WHEN (results->>'overallScore')::numeric >= 80 THEN 'good'
        WHEN (results->>'overallScore')::numeric >= 70 THEN 'average'
        WHEN (results->>'overallScore')::numeric >= 60 THEN 'below_average'
        ELSE 'needs_improvement'
      END as score_range,
      COUNT(*) as count
    FROM assessment_results
    WHERE created_at >= now() - interval '1 day' * p_time_period_days
      AND (p_assessment_type IS NULL OR assessment_type = p_assessment_type)
      AND results ? 'overallScore'
    GROUP BY assessment_type, score_range
  )
  SELECT jsonb_object_agg(assessment_type, 
    jsonb_object_agg(score_range, count)
  ) INTO score_distribution
  FROM score_ranges;
  
  -- Get demographic breakdown
  WITH demographic_data AS (
    SELECT 
      ar.assessment_type,
      ad.gender,
      ad.age_range,
      COUNT(*) as count,
      AVG((ar.results->>'overallScore')::numeric) as avg_score
    FROM assessment_results ar
    LEFT JOIN assessment_demographics ad ON ar.id = ad.assessment_result_id
    WHERE ar.created_at >= now() - interval '1 day' * p_time_period_days
      AND (p_assessment_type IS NULL OR ar.assessment_type = p_assessment_type)
      AND ad.consent_for_research = true
    GROUP BY ar.assessment_type, ad.gender, ad.age_range
  )
  SELECT jsonb_object_agg(assessment_type,
    jsonb_build_object(
      'by_gender', jsonb_object_agg(gender, jsonb_build_object('count', count, 'avg_score', ROUND(avg_score, 2))),
      'by_age', jsonb_object_agg(age_range, jsonb_build_object('count', count, 'avg_score', ROUND(avg_score, 2)))
    )
  ) INTO demographic_breakdown
  FROM demographic_data;
  
  analytics_result := jsonb_build_object(
    'time_period_days', p_time_period_days,
    'assessment_type_filter', p_assessment_type,
    'completion_stats', COALESCE(completion_stats, '{}'),
    'score_distribution', COALESCE(score_distribution, '{}'),
    'demographic_breakdown', COALESCE(demographic_breakdown, '{}'),
    'generated_at', now()
  );
  
  RETURN analytics_result;
END;
$function$;

-- Schedule cron jobs for maintenance tasks
SELECT cron.schedule(
  'cleanup-expired-progress',
  '0 2 * * *', -- Daily at 2 AM
  $$SELECT public.cleanup_expired_assessment_progress();$$
);

SELECT cron.schedule(
  'cleanup-old-rate-limits',
  '0 3 * * *', -- Daily at 3 AM
  $$SELECT public.cleanup_old_rate_limits();$$
);

SELECT cron.schedule(
  'storage-optimization',
  '0 4 * * 0', -- Weekly on Sunday at 4 AM
  $$
  SELECT net.http_post(
    url := 'https://jlbftyjewxgetxcihban.supabase.co/functions/v1/storage-monitor',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"action": "optimize"}'::jsonb
  );
  $$
);