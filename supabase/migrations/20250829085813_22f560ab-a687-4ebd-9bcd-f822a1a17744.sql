-- CRITICAL SECURITY FIX: Remove dangerous RLS policy that allows public access to employer accounts
-- This policy was allowing anyone to view/modify business customer data including emails, phone numbers, and password hashes

-- First, drop the dangerous policy that gives full access to everyone
DROP POLICY IF EXISTS "System can manage employer accounts" ON public.employer_accounts;

-- Create secure RLS policies for employer_accounts table
-- 1. Employers can only view and update their own account data
CREATE POLICY "Employers can view their own account" 
ON public.employer_accounts 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Employers can update their own account" 
ON public.employer_accounts 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- 2. Only authenticated employers can insert their own account (during registration)
CREATE POLICY "Employers can create their own account" 
ON public.employer_accounts 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- 3. Only admins can delete employer accounts (for account management)
CREATE POLICY "Admins can delete employer accounts" 
ON public.employer_accounts 
FOR DELETE 
USING (is_admin(auth.uid()));

-- 4. Only admins can view all employer accounts (for admin dashboard)
CREATE POLICY "Admins can view all employer accounts" 
ON public.employer_accounts 
FOR SELECT 
USING (is_admin(auth.uid()));

-- 5. System operations for authentication are handled through secure RPC functions
-- No direct public access to sensitive data