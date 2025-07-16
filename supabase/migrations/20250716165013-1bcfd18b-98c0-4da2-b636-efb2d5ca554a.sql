-- Fix search_path for all functions to improve security
CREATE OR REPLACE FUNCTION public.log_partner_activity(p_partner_id uuid, p_action text, p_assessment_type text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text, p_user_agent text DEFAULT NULL::text, p_metadata jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.partner_access_logs (
    partner_id, assessment_type, action, ip_address, user_agent, metadata
  ) VALUES (
    p_partner_id, p_assessment_type, p_action, p_ip_address, p_user_agent, p_metadata
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.authenticate_partner(p_username text, p_password text)
 RETURNS TABLE(partner_id uuid, username text, organization_name text, access_expires_at timestamp with time zone, is_active boolean, is_expired boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.check_partner_assessment_access(p_partner_id uuid, p_assessment_type text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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