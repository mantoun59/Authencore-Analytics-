-- Fix Security Warning 1: Function Search Path Mutable
-- Update all functions to have secure search_path settings

-- Update existing functions to be more secure
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Update auth-related settings for Security Warning 3: Auth OTP long expiry
-- Note: This needs to be done via Supabase dashboard Auth settings, but we can log it
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('auth_otp_expiry_configured', '{"configured_at": "2024-07-31", "recommendation": "Set OTP expiry to 300 seconds (5 minutes) in Supabase Auth settings"}')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Security Warning 4: Log password protection recommendation
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('password_protection_configured', '{"configured_at": "2024-07-31", "recommendation": "Enable leaked password protection in Supabase Auth settings"}')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Add security audit log
INSERT INTO public.security_improvements (
  improvement_type,
  description,
  status,
  metadata
) VALUES 
  ('function_security', 'Updated all functions with secure search_path settings', 'implemented', '{"functions_updated": ["has_role", "is_admin", "update_updated_at_column", "handle_new_user"]}'),
  ('auth_security', 'Documented OTP expiry configuration requirement', 'requires_dashboard_config', '{"setting": "OTP expiry", "recommended_value": "300 seconds"}'),
  ('password_security', 'Documented leaked password protection requirement', 'requires_dashboard_config', '{"setting": "Leaked password protection", "action": "Enable in Auth settings"}')