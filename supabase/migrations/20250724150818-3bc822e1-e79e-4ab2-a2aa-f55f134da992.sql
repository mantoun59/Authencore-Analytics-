-- Fix function security warnings by setting search_path
CREATE OR REPLACE FUNCTION generate_guest_token()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;

CREATE OR REPLACE FUNCTION check_guest_access(p_token TEXT, p_assessment_type TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION use_guest_token(p_token TEXT, p_assessment_type TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;