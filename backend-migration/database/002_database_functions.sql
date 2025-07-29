-- AuthenCore Analytics Database Functions
-- Core business logic and security functions

-- Generate guest token function
CREATE OR REPLACE FUNCTION public.generate_guest_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$function$;

-- Check guest access function
CREATE OR REPLACE FUNCTION public.check_guest_access(p_token TEXT, p_assessment_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.guest_access_tokens
    WHERE token = p_token
      AND assessment_type = p_assessment_type
      AND expires_at > now()
      AND is_active = true
      AND used_at IS NULL
  );
END;
$function$;

-- Use guest token function
CREATE OR REPLACE FUNCTION public.use_guest_token(p_token TEXT, p_assessment_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.guest_access_tokens
  SET used_at = now()
  WHERE token = p_token
    AND assessment_type = p_assessment_type
    AND expires_at > now()
    AND is_active = true
    AND used_at IS NULL;
  
  RETURN FOUND;
END;
$function$;

-- User role checking functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT public.has_role(_user_id, 'admin')
$function$;

-- Assign admin role function
CREATE OR REPLACE FUNCTION public.assign_admin_role(p_email TEXT)
RETURNS VOID
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

-- Analytics logging function
CREATE OR REPLACE FUNCTION public.log_analytics_event(
  p_event_type TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.analytics_events (event_type, entity_type, entity_id, metadata)
  VALUES (p_event_type, p_entity_type, p_entity_id, p_metadata);
END;
$function$;

-- Security logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_severity TEXT DEFAULT 'info'
)
RETURNS UUID
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

-- Rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_limit INTEGER DEFAULT 60,
  p_window_minutes INTEGER DEFAULT 1
)
RETURNS BOOLEAN
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

-- Employer authentication function
CREATE OR REPLACE FUNCTION public.authenticate_employer(p_email TEXT, p_password TEXT)
RETURNS TABLE(employer_id UUID, name TEXT, email TEXT, is_active BOOLEAN)
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

-- Partner authentication function
CREATE OR REPLACE FUNCTION public.authenticate_partner(p_username TEXT, p_password TEXT)
RETURNS TABLE(
  partner_id UUID,
  username TEXT,
  organization_name TEXT,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  is_expired BOOLEAN
)
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

-- Check partner assessment access
CREATE OR REPLACE FUNCTION public.check_partner_assessment_access(
  p_partner_id UUID,
  p_assessment_type TEXT
)
RETURNS BOOLEAN
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

-- Log partner activity
CREATE OR REPLACE FUNCTION public.log_partner_activity(
  p_partner_id UUID,
  p_action TEXT,
  p_assessment_type TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS VOID
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

-- Detect suspicious activity
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
  p_user_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_action TEXT
)
RETURNS BOOLEAN
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

-- Get security status
CREATE OR REPLACE FUNCTION public.get_security_status()
RETURNS TABLE(
  table_name TEXT,
  rls_enabled BOOLEAN,
  policy_count INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $function$
    SELECT 
        schemaname||'.'||tablename as table_name,
        rowsecurity as rls_enabled,
        (SELECT COUNT(*) FROM pg_policies WHERE schemaname = t.schemaname AND tablename = t.tablename) as policy_count,
        now() as last_updated
    FROM pg_tables t 
    WHERE schemaname = 'public'
    ORDER BY tablename;
$function$;

-- Cleanup functions
CREATE OR REPLACE FUNCTION public.cleanup_expired_assessment_progress()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.assessment_progress 
  WHERE expires_at < now() AND is_completed = false;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.api_rate_limits 
  WHERE created_at < now() - interval '1 day';
END;
$function$;

-- Solo payment status sync trigger
CREATE OR REPLACE FUNCTION public.sync_solo_payment_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- If payment status changed to completed and no payment record exists
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
    -- Create payment record if it doesn't exist
    INSERT INTO public.payments (
      candidate_id,
      candidate_type,
      amount,
      status,
      currency,
      payment_method,
      metadata
    ) VALUES (
      NEW.id,
      'solo',
      9.99,
      'paid',
      'USD',
      'stripe',
      jsonb_build_object(
        'assessment_type', 'solo',
        'auto_synced', true
      )
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for solo payment sync
CREATE TRIGGER sync_solo_payment_status_trigger
  AFTER UPDATE ON public.solo_candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_solo_payment_status();