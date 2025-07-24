-- Fix function search_path security warnings
CREATE OR REPLACE FUNCTION public.request_admin_password_reset(p_email text)
 RETURNS void
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

CREATE OR REPLACE FUNCTION public.authenticate_employer(p_email text, p_password text)
 RETURNS TABLE(employer_id uuid, name text, email text, is_active boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ea.id,
    ea.name,
    ea.email,
    ea.is_active
  FROM public.employer_accounts ea
  WHERE ea.email = p_email 
    AND ea.password_hash = crypt(p_password, ea.password_hash)
    AND ea.is_active = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_analytics_event(p_event_type text, p_entity_type text DEFAULT NULL::text, p_entity_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.analytics_events (event_type, entity_type, entity_id, metadata)
  VALUES (p_event_type, p_entity_type, p_entity_id, p_metadata);
END;
$function$;

CREATE OR REPLACE FUNCTION public.assign_admin_role(p_email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get the user ID from auth.users by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = p_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', p_email;
  END IF;
  
  -- Insert admin role (will ignore if already exists due to unique constraint)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role assigned to user %', p_email;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_partner_assessment_access(p_partner_id uuid, p_assessment_type text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if partner exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.partner_accounts 
    WHERE id = p_partner_id 
      AND is_active = true 
      AND access_expires_at > now()
  ) THEN
    RETURN false;
  END IF;
  
  -- Check specific permission (if no specific permission exists, deny access)
  RETURN EXISTS (
    SELECT 1 FROM public.partner_access_permissions 
    WHERE partner_id = p_partner_id 
      AND assessment_type = p_assessment_type 
      AND can_access = true
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.authenticate_partner(p_username text, p_password text)
 RETURNS TABLE(partner_id uuid, username text, organization_name text, access_expires_at timestamp with time zone, is_active boolean, is_expired boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pa.id,
    pa.username,
    pa.organization_name,
    pa.access_expires_at,
    pa.is_active,
    (pa.access_expires_at < now()) as is_expired
  FROM public.partner_accounts pa
  WHERE pa.username = p_username 
    AND pa.password_hash = crypt(p_password, pa.password_hash)
    AND pa.is_active = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_partner_activity(p_partner_id uuid, p_action text, p_assessment_type text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text, p_metadata jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.partner_access_logs (
    partner_id, assessment_type, action, ip_address, user_agent, metadata
  ) VALUES (
    p_partner_id, p_assessment_type, p_action, p_ip_address, p_user_agent, p_metadata
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_security_event(p_user_id uuid, p_event_type text, p_event_details jsonb DEFAULT NULL::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_severity text DEFAULT 'info'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id, event_type, event_details, ip_address, user_agent, severity
  ) VALUES (
    p_user_id, p_event_type, p_event_details, p_ip_address, p_user_agent, p_severity
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_endpoint text, p_limit integer DEFAULT 60, p_window_minutes integer DEFAULT 1)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start := date_trunc('minute', now()) - interval '1 second' * ((extract(minute from now())::integer % p_window_minutes) * 60 + extract(second from now())::integer);
  
  -- Check if blocked
  IF EXISTS (
    SELECT 1 FROM public.api_rate_limits 
    WHERE identifier = p_identifier 
      AND endpoint = p_endpoint 
      AND blocked_until > now()
  ) THEN
    RETURN false;
  END IF;
  
  -- Get current count for this window
  SELECT COALESCE(request_count, 0) INTO current_count
  FROM public.api_rate_limits
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start = window_start;
  
  -- If over limit, block for 5 minutes
  IF current_count >= p_limit THEN
    UPDATE public.api_rate_limits 
    SET blocked_until = now() + interval '5 minutes'
    WHERE identifier = p_identifier 
      AND endpoint = p_endpoint 
      AND window_start = window_start;
    RETURN false;
  END IF;
  
  -- Increment or create counter
  INSERT INTO public.api_rate_limits (identifier, endpoint, request_count, window_start)
  VALUES (p_identifier, p_endpoint, 1, window_start)
  ON CONFLICT (identifier, endpoint, window_start)
  DO UPDATE SET request_count = public.api_rate_limits.request_count + 1;
  
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(p_user_id uuid, p_ip_address inet, p_user_agent text, p_action text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_events INTEGER;
  different_ips INTEGER;
  is_suspicious BOOLEAN := false;
BEGIN
  -- Check for too many events in short time
  SELECT COUNT(*) INTO recent_events
  FROM public.security_events
  WHERE user_id = p_user_id 
    AND created_at > now() - interval '5 minutes';
  
  -- Check for multiple IP addresses in short time
  SELECT COUNT(DISTINCT ip_address) INTO different_ips
  FROM public.security_events
  WHERE user_id = p_user_id 
    AND created_at > now() - interval '30 minutes'
    AND ip_address IS NOT NULL;
  
  -- Flag as suspicious if conditions met
  IF recent_events > 10 OR different_ips > 3 THEN
    is_suspicious := true;
    
    -- Log the suspicious activity
    PERFORM public.log_security_event(
      p_user_id,
      'suspicious_activity_detected',
      jsonb_build_object(
        'action', p_action,
        'recent_events_count', recent_events,
        'different_ips_count', different_ips
      ),
      p_ip_address,
      p_user_agent,
      'warning'
    );
  END IF;
  
  RETURN is_suspicious;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.api_rate_limits 
  WHERE created_at < now() - interval '1 day';
END;
$function$;