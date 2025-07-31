-- Set secure search paths for all database functions to prevent SQL injection
-- This addresses security warnings about function search paths

-- Update all existing functions to use secure search paths
DO $$
DECLARE
    func_record RECORD;
    new_function_sql TEXT;
BEGIN
    -- Loop through all user-defined functions
    FOR func_record IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_functiondef(p.oid) as function_definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'st_%'
        AND p.proname NOT LIKE 'geography_%'
        AND p.proname NOT LIKE 'geometry_%'
    LOOP
        -- Check if function definition doesn't already contain SET search_path
        IF func_record.function_definition NOT LIKE '%SET search_path%' THEN
            -- Extract function signature and body to add secure search path
            new_function_sql := REPLACE(
                func_record.function_definition,
                ' LANGUAGE ',
                ' SET search_path = public, pg_temp LANGUAGE '
            );
            
            -- Execute the modified function definition
            EXECUTE new_function_sql;
            
            RAISE NOTICE 'Updated function % with secure search path', func_record.function_name;
        END IF;
    END LOOP;
END $$;