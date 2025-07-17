-- Create tables for enhanced security features

-- 1. Multi-Factor Authentication table
CREATE TABLE public.user_mfa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for MFA table
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;

-- MFA policies
CREATE POLICY "Users can manage their own MFA settings" 
ON public.user_mfa 
FOR ALL 
USING (auth.uid()::text = user_id::text);

-- 2. Security events logging table
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_details JSONB,
  ip_address INET,
  user_agent TEXT,
  severity TEXT NOT NULL DEFAULT 'info', -- info, warning, critical
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Security events policies
CREATE POLICY "Admins can view all security events" 
ON public.security_events 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- 3. API rate limiting table
CREATE TABLE public.api_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user_id
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Enable RLS for rate limits
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limiting policies
CREATE POLICY "Admins can view all rate limits" 
ON public.api_rate_limits 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "System can manage rate limits" 
ON public.api_rate_limits 
FOR ALL 
WITH CHECK (true);

-- 4. Session security table
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Session policies
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can manage sessions" 
ON public.user_sessions 
FOR ALL 
WITH CHECK (true);

-- Create security functions

-- Function to log security events
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
SET search_path TO ''
AS $$
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
$$;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_limit INTEGER DEFAULT 60,
  p_window_minutes INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;

-- Function to detect suspicious activity
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
  p_user_id UUID,
  p_ip_address INET,
  p_user_agent TEXT,
  p_action TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;

-- Create indexes for performance
CREATE INDEX idx_security_events_user_created ON public.security_events(user_id, created_at);
CREATE INDEX idx_security_events_type_created ON public.security_events(event_type, created_at);
CREATE INDEX idx_rate_limits_identifier_endpoint ON public.api_rate_limits(identifier, endpoint);
CREATE INDEX idx_user_sessions_user_active ON public.user_sessions(user_id, is_active);

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_mfa_updated_at
BEFORE UPDATE ON public.user_mfa
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Clean up old rate limit entries (daily cleanup)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.api_rate_limits 
  WHERE created_at < now() - interval '1 day';
END;
$$;