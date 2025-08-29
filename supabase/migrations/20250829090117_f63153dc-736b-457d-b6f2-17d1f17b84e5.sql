-- CRITICAL SECURITY FIX: Remove conflicting RLS policies on contact_inquiries
-- The table had overlapping policies that could expose customer contact information

-- Drop the potentially conflicting "ALL" policy that might override specific policies
DROP POLICY IF EXISTS "Only admins can manage contact inquiries" ON public.contact_inquiries;

-- Keep the existing secure policies but ensure they're properly isolated
-- 1. Allow contact forms to insert inquiries (for website functionality)
-- This policy already exists and is secure: "Contact forms can insert inquiries"

-- 2. Create separate, specific admin policies to avoid conflicts
CREATE POLICY "admin_can_view_contact_inquiries" 
ON public.contact_inquiries 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "admin_can_update_contact_inquiries" 
ON public.contact_inquiries 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "admin_can_delete_contact_inquiries" 
ON public.contact_inquiries 
FOR DELETE 
USING (is_admin(auth.uid()));

-- This ensures customer contact information is only accessible to authenticated admins
-- and prevents any data theft or unauthorized access