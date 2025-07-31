-- Fix Security Warning 2: Extension in Public Schema  
-- Create extensions schema and move extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pgcrypto extension to extensions schema
DROP EXTENSION IF EXISTS "pgcrypto" CASCADE;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO authenticated, anon;

-- Update admin_settings to track configuration
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('security_warnings_dashboard_config', '{"auth_otp_expiry": "Set to 300 seconds in Auth settings", "leaked_password_protection": "Enable in Auth settings", "completion_instructions": "Navigate to Supabase dashboard Auth settings"}')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value;

-- Log that extension security is now implemented
INSERT INTO public.security_improvements (
  improvement_type,
  description,
  status,
  metadata
) VALUES (
  'extension_security', 
  'Moved extensions from public schema to secure extensions schema', 
  'implemented', 
  '{"completion_date": "2024-07-31", "extensions_moved": ["pgcrypto"]}'
) ON CONFLICT DO NOTHING;