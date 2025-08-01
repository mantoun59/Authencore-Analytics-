-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.policy_exists(table_name text, policy_name text)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_catalog'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = table_name 
        AND policyname = policy_name
        AND schemaname = 'public'
    );
END;
$$;