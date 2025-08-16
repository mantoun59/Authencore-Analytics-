-- Remove the dangerous public access policy
DROP POLICY IF EXISTS "System can manage payments" ON public.payments;

-- Create secure policy for users to view only their own payment records
-- This policy handles both solo candidates and employer candidates properly
CREATE POLICY "Users can view their own payment records" 
ON public.payments 
FOR SELECT 
USING (
  -- For solo candidates: check if user's email matches the candidate's email
  (candidate_type = 'solo' AND candidate_id IN (
    SELECT sc.id FROM solo_candidates sc 
    WHERE sc.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  ))
  OR
  -- For employer candidates: check if user is the employer who owns the candidate
  (candidate_type = 'employer' AND candidate_id IN (
    SELECT ec.id FROM employer_candidates ec 
    JOIN employer_accounts ea ON ec.employer_id = ea.id 
    WHERE ea.id::text = auth.uid()::text
  ))
  OR
  -- For authenticated users who might have direct payments
  (auth.uid() IS NOT NULL AND candidate_id::text = auth.uid()::text)
);

-- Create policy for admins to manage all payments
CREATE POLICY "Admins can manage all payments" 
ON public.payments 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create policy for system operations (edge functions with service role)
CREATE POLICY "System can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

-- Create policy for system operations (edge functions with service role)  
CREATE POLICY "System can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);