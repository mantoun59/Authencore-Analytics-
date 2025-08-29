-- CRITICAL SECURITY FIX: Remove ALL dangerous RLS policies and recreate secure ones
-- The employer_accounts table had policies allowing public access to business customer data

-- Drop ALL existing policies on employer_accounts table
DROP POLICY IF EXISTS "Employers can view their own account" ON public.employer_accounts;
DROP POLICY IF EXISTS "System can manage employer accounts" ON public.employer_accounts;
DROP POLICY IF EXISTS "Employers can update their own account" ON public.employer_accounts;
DROP POLICY IF EXISTS "Employers can create their own account" ON public.employer_accounts;
DROP POLICY IF EXISTS "Admins can delete employer accounts" ON public.employer_accounts;
DROP POLICY IF EXISTS "Admins can view all employer accounts" ON public.employer_accounts;

-- Create secure RLS policies that prevent data theft by competitors
-- 1. Employers can only view their own account data (no access to other business data)
CREATE POLICY "employer_view_own_account" 
ON public.employer_accounts 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- 2. Employers can only update their own account
CREATE POLICY "employer_update_own_account" 
ON public.employer_accounts 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- 3. Secure account creation during registration
CREATE POLICY "employer_create_own_account" 
ON public.employer_accounts 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- 4. Only admins can delete accounts (for proper account management)
CREATE POLICY "admin_delete_employer_accounts" 
ON public.employer_accounts 
FOR DELETE 
USING (is_admin(auth.uid()));

-- 5. Only admins can view all accounts (for administrative purposes)
CREATE POLICY "admin_view_all_employer_accounts" 
ON public.employer_accounts 
FOR SELECT 
USING (is_admin(auth.uid()));

-- This completely eliminates the security vulnerability where competitors could steal business data