-- Fix Security Issue #1: Function Search Path Mutable
-- Update all functions to have secure search_path

-- Fix functions that don't have proper search_path set
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix the user roles function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Fix the admin check function  
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT public.has_role(_user_id, 'admin')
$function$;

-- Add missing search_path to handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

-- Create security improvements tracking table if not exists
CREATE TABLE IF NOT EXISTS public.security_improvements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  improvement_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  implemented_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security improvements
ALTER TABLE public.security_improvements ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for security improvements (admin only)
CREATE POLICY "Only admins can manage security improvements" ON public.security_improvements
FOR ALL USING (public.is_admin(auth.uid()));

-- Insert security improvement records
INSERT INTO public.security_improvements (improvement_type, description, status) VALUES
('function_search_path', 'Secure search_path set for all database functions', 'implemented'),
('password_protection', 'Enable leaked password protection', 'requires_dashboard_config'),
('otp_expiry', 'Reduce OTP expiry to recommended threshold', 'requires_dashboard_config'),
('extension_security', 'Move extensions from public schema', 'requires_dashboard_config')
ON CONFLICT DO NOTHING;

-- Update timestamps trigger for security improvements
CREATE TRIGGER update_security_improvements_updated_at
    BEFORE UPDATE ON public.security_improvements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();