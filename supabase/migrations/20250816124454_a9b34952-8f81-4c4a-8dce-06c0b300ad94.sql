-- Remove the old incomplete policy that doesn't properly restrict access
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- The secure "Users can view their own payment records" policy is already in place
-- Verify we now have proper security with no public access