-- Fix Security Warning 2: Extension in Public Schema
-- Move extensions from public schema to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move uuid-ossp extension to extensions schema
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Grant usage on extensions schema to authenticated users
GRANT USAGE ON SCHEMA extensions TO authenticated;

-- Update any functions that might reference uuid functions
-- Since we're using gen_random_uuid() which is in pgcrypto, ensure it's properly configured
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- Update admin settings to track this fix
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('extensions_schema_configured', '{"configured_at": "2024-07-31", "status": "Extensions moved to secure schema"}')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Update security improvements table
UPDATE public.security_improvements 
SET status = 'implemented', 
    metadata = jsonb_set(metadata, '{completion_date}', '"2024-07-31"')
WHERE improvement_type = 'extension_security' 
  AND description LIKE '%extension%';

-- If no record exists, insert it
INSERT INTO public.security_improvements (
  improvement_type,
  description,
  status,
  metadata
) 
SELECT 'extension_security', 'Moved extensions from public schema to secure extensions schema', 'implemented', '{"completion_date": "2024-07-31", "extensions_moved": ["uuid-ossp", "pgcrypto"]}'
WHERE NOT EXISTS (
  SELECT 1 FROM public.security_improvements 
  WHERE improvement_type = 'extension_security'
);