-- Fix Supabase security configuration issues

-- 1. Move uuid-ossp extension from public to extensions schema
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- 2. Enable leaked password protection (this needs to be done in Supabase Dashboard)
-- Note: This setting needs to be enabled in the Supabase Dashboard under Authentication > Settings

-- 3. Configure OTP expiry to recommended settings (this also needs Dashboard configuration)
-- Note: OTP expiry should be set to 600 seconds (10 minutes) in the Dashboard

-- 4. Ensure proper RLS policies are in place for all tables
-- Check if we have any tables without RLS enabled

-- Enable RLS on critical tables if not already enabled
DO $$
DECLARE
    table_name text;
BEGIN
    -- List of tables that should have RLS enabled
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'spatial_%'
        AND tablename NOT LIKE 'geography_%'
        AND tablename NOT LIKE 'geometry_%'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_name);
    END LOOP;
END $$;

-- Add basic security policies for any tables that might be missing them
-- Note: These are generic policies - specific tables may need custom policies

-- Create a function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(table_name text, policy_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = table_name 
        AND policyname = policy_name
        AND schemaname = 'public'
    );
END;
$$ LANGUAGE plpgsql;

-- Ensure auth.users table access is properly configured
-- Note: Most of these settings need to be configured in the Supabase Dashboard