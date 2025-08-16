-- Remove the dangerous policy that allows public access
DROP POLICY IF EXISTS "Solo candidates can view their own data" ON public.solo_candidates;

-- Remove the overly permissive system policy 
DROP POLICY IF EXISTS "System can manage solo candidates" ON public.solo_candidates;

-- Create a more secure system policy for updates only
CREATE POLICY "System can update solo candidate status" 
ON public.solo_candidates 
FOR UPDATE 
USING (true);