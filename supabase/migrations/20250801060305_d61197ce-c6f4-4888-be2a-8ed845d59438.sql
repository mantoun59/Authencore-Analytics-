-- Create data deletion system (without recreating existing tables)

-- Create data deletion requests table for audit compliance
CREATE TABLE IF NOT EXISTS public.data_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'full_deletion',
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id),
  deletion_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on deletion requests
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Policies for deletion requests
CREATE POLICY "Users can view their own deletion requests" 
ON public.data_deletion_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deletion requests" 
ON public.data_deletion_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all deletion requests" 
ON public.data_deletion_requests 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create comprehensive data deletion function
CREATE OR REPLACE FUNCTION public.delete_user_data(p_user_id UUID)
RETURNS JSONB 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  deletion_summary JSONB := '{}';
  tables_cleaned TEXT[] := '{}';
BEGIN
  -- Only allow users to delete their own data or admins
  IF NOT (auth.uid() = p_user_id OR is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Insufficient permissions to delete user data';
  END IF;

  -- Delete assessment progress
  DELETE FROM public.assessment_progress WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'assessment_progress');

  -- Delete assessment results
  DELETE FROM public.assessment_results WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'assessment_results');

  -- Delete generated reports
  DELETE FROM public.generated_reports WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'generated_reports');

  -- Delete communication competency results
  DELETE FROM public.communication_competency_results WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'communication_competency_results');

  -- Delete Gen Z assessment results
  DELETE FROM public.genz_assessment_results WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'genz_assessment_results');

  -- Delete Gen Z assessment responses
  DELETE FROM public.genz_assessment_responses WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'genz_assessment_responses');

  -- Delete work preferences results
  DELETE FROM public.work_preferences_results WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'work_preferences_results');

  -- Delete technology integration results
  DELETE FROM public.technology_integration_results WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'technology_integration_results');

  -- Delete assessment demographics
  DELETE FROM public.assessment_demographics WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'assessment_demographics');

  -- Delete chatbot conversations
  DELETE FROM public.chatbot_conversations WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'chatbot_conversations');

  -- Delete chatbot analytics
  DELETE FROM public.chatbot_analytics WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'chatbot_analytics');

  -- Delete user MFA settings
  DELETE FROM public.user_mfa WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'user_mfa');

  -- Delete user roles (if table exists)
  DELETE FROM public.user_roles WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'user_roles');

  -- Delete security events for this user
  DELETE FROM public.security_events WHERE user_id = p_user_id;
  tables_cleaned := array_append(tables_cleaned, 'security_events');

  -- Create deletion summary
  deletion_summary := jsonb_build_object(
    'user_id', p_user_id,
    'deleted_at', now(),
    'tables_cleaned', tables_cleaned,
    'total_tables', array_length(tables_cleaned, 1)
  );

  -- Log the deletion event (before deleting the user)
  PERFORM public.log_security_event(
    p_user_id,
    'user_data_deleted',
    deletion_summary,
    NULL,
    NULL,
    'info'
  );

  RETURN deletion_summary;
END;
$$;

-- Create function to request data deletion
CREATE OR REPLACE FUNCTION public.request_data_deletion(p_reason TEXT DEFAULT 'user_request')
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
DECLARE
  request_id UUID;
  user_email TEXT;
BEGIN
  -- Get user email
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Create deletion request
  INSERT INTO public.data_deletion_requests (
    user_id, 
    email, 
    metadata
  ) VALUES (
    auth.uid(),
    user_email,
    jsonb_build_object('reason', p_reason, 'request_timestamp', now())
  ) RETURNING id INTO request_id;

  -- Log the request
  PERFORM public.log_security_event(
    auth.uid(),
    'data_deletion_requested',
    jsonb_build_object('request_id', request_id, 'reason', p_reason),
    NULL,
    NULL,
    'info'
  );

  RETURN request_id;
END;
$$;

-- Create function to get user's deletion request status
CREATE OR REPLACE FUNCTION public.get_deletion_request_status()
RETURNS TABLE(
  request_id UUID,
  status TEXT,
  requested_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    data_deletion_requests.status,
    requested_at,
    processed_at
  FROM public.data_deletion_requests 
  WHERE user_id = auth.uid()
  ORDER BY requested_at DESC
  LIMIT 1;
END;
$$;