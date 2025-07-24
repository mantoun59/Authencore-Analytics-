-- SECURITY ENHANCEMENT: Fix function search_path warnings
-- Update existing functions to have proper search_path settings

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add schema versioning table for better change tracking
CREATE TABLE IF NOT EXISTS public.schema_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version_number TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    migration_file TEXT NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    executed_by TEXT DEFAULT current_user,
    checksum TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on schema versions (admin only access)
ALTER TABLE public.schema_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage schema versions" 
ON public.schema_versions 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Insert current version record
INSERT INTO public.schema_versions (
    version_number, 
    description, 
    migration_file,
    metadata
) VALUES (
    '2025.01.24.001',
    'Security enhancement and schema versioning implementation',
    '20250124-security-schema-versioning.sql',
    jsonb_build_object(
        'security_fixes', jsonb_build_array(
            'Fixed function search_path warnings',
            'Added schema versioning system',
            'Enhanced RLS policy documentation'
        ),
        'tables_with_rls', jsonb_build_array(
            'profiles', 'assessment_results', 'pdf_reports', 
            'partner_accounts', 'employer_accounts', 'user_roles',
            'security_events', 'analytics_events'
        )
    )
);

-- Create function to get current security status
CREATE OR REPLACE FUNCTION public.get_security_status()
RETURNS TABLE (
    table_name TEXT,
    rls_enabled BOOLEAN,
    policy_count INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
    SELECT 
        schemaname||'.'||tablename as table_name,
        rowsecurity as rls_enabled,
        (SELECT COUNT(*) FROM pg_policies WHERE schemaname = t.schemaname AND tablename = t.tablename) as policy_count,
        now() as last_updated
    FROM pg_tables t 
    WHERE schemaname = 'public'
    ORDER BY tablename;
$$;

-- Enhanced security logging function
CREATE OR REPLACE FUNCTION public.log_security_audit(
    p_audit_type TEXT,
    p_findings JSONB DEFAULT NULL,
    p_recommendations JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;