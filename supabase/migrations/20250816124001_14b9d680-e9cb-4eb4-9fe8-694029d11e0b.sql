-- Enable Row Level Security on solo_candidates table
ALTER TABLE public.solo_candidates ENABLE ROW LEVEL SECURITY;

-- Create policy for candidates to access only their own data via access_token
CREATE POLICY "Solo candidates can view their own data via token" 
ON public.solo_candidates 
FOR SELECT 
USING (access_token = current_setting('request.jwt.claims', true)::json->>'sub' OR access_token = auth.jwt()->>'sub');

-- Create policy for system operations (for creating new candidates)
CREATE POLICY "System can insert solo candidates" 
ON public.solo_candidates 
FOR INSERT 
WITH CHECK (true);

-- Create policy for system operations (for updating payment status, etc.)
CREATE POLICY "System can update solo candidates" 
ON public.solo_candidates 
FOR UPDATE 
USING (true);

-- Create policy for admins to manage all candidates
CREATE POLICY "Admins can manage all solo candidates" 
ON public.solo_candidates 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add additional policy for candidates to access their data when authenticated via email
CREATE POLICY "Authenticated users can view their own solo candidate data" 
ON public.solo_candidates 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);