-- Remove the dangerous public access policy
DROP POLICY IF EXISTS "Anyone can view scenarios" ON public.genz_assessment_scenarios;

-- Create secure policy for authenticated users only
CREATE POLICY "Authenticated users can view assessment scenarios" 
ON public.genz_assessment_scenarios 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policy for admins to manage scenarios
CREATE POLICY "Admins can manage assessment scenarios" 
ON public.genz_assessment_scenarios 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create policy for system operations (if needed for seeding data)
CREATE POLICY "System can insert assessment scenarios" 
ON public.genz_assessment_scenarios 
FOR INSERT 
WITH CHECK (true);