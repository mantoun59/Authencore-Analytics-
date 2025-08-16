-- Let's analyze and fix any potential security gaps in contact_inquiries table

-- First, let's drop existing policies and create more explicit, secure ones
DROP POLICY IF EXISTS "Admins can manage contact inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "System can insert contact inquiries" ON public.contact_inquiries;

-- Create a more explicit admin-only read policy
CREATE POLICY "Only admins can view contact inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true
);

-- Create a more explicit admin-only management policy
CREATE POLICY "Only admins can manage contact inquiries" 
ON public.contact_inquiries 
FOR ALL 
USING (
  auth.uid() IS NOT NULL AND 
  is_admin(auth.uid()) = true
);

-- Create a secure system insert policy for contact forms
CREATE POLICY "Contact forms can insert inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (
  -- Allow insertion but no reading - system can submit forms
  true
);

-- Verify RLS is enabled (should already be enabled)
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;