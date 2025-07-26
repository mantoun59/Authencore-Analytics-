-- Fix critical RLS policies to prevent anonymous access where inappropriate

-- Update policies that should require authentication
DROP POLICY IF EXISTS "Users can view their own demographics" ON public.assessment_demographics;
DROP POLICY IF EXISTS "Users can view their own assessment progress" ON public.assessment_progress;
DROP POLICY IF EXISTS "Users can update their own assessment progress" ON public.assessment_progress;
DROP POLICY IF EXISTS "Users can delete their own assessment progress" ON public.assessment_progress;
DROP POLICY IF EXISTS "Users can view their own assessment results" ON public.assessment_results;
DROP POLICY IF EXISTS "Users can update their own assessment results" ON public.assessment_results;
DROP POLICY IF EXISTS "Users can view their own generated reports" ON public.generated_reports;
DROP POLICY IF EXISTS "Users can view their own responses" ON public.genz_assessment_responses;
DROP POLICY IF EXISTS "Users can view their own results" ON public.genz_assessment_results;
DROP POLICY IF EXISTS "Users can update their own results" ON public.genz_assessment_results;
DROP POLICY IF EXISTS "Users can view their own collaboration responses" ON public.genz_collaboration_responses;
DROP POLICY IF EXISTS "Users can view their own values" ON public.genz_values_responses;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own PDF reports" ON public.pdf_reports;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own security events" ON public.security_events;
DROP POLICY IF EXISTS "Users can manage their own MFA settings" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.user_sessions;

-- Recreate policies with proper authentication checks
CREATE POLICY "Authenticated users can view their own demographics" 
ON public.assessment_demographics 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own assessment progress" 
ON public.assessment_progress 
FOR SELECT 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR 
  (user_id IS NULL AND guest_token IS NOT NULL AND auth.uid() IS NOT NULL)
);

CREATE POLICY "Authenticated users can update their own assessment progress" 
ON public.assessment_progress 
FOR UPDATE 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR 
  (user_id IS NULL AND guest_token IS NOT NULL AND auth.uid() IS NOT NULL)
);

CREATE POLICY "Authenticated users can delete their own assessment progress" 
ON public.assessment_progress 
FOR DELETE 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR 
  (user_id IS NULL AND guest_token IS NOT NULL AND auth.uid() IS NOT NULL)
);

CREATE POLICY "Authenticated users can view their own assessment results" 
ON public.assessment_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own assessment results" 
ON public.assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own generated reports" 
ON public.generated_reports 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own responses" 
ON public.genz_assessment_responses 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own results" 
ON public.genz_assessment_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own results" 
ON public.genz_assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own collaboration responses" 
ON public.genz_collaboration_responses 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own values" 
ON public.genz_values_responses 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their order items" 
ON public.order_items 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND
  order_id IN (
    SELECT orders.id
    FROM orders
    WHERE (
      (auth.uid() = orders.user_id) OR 
      (orders.is_guest_order = true AND orders.guest_email = (
        SELECT users.email FROM auth.users WHERE users.id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Authenticated users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    (auth.uid() = user_id) OR 
    (is_guest_order = true AND guest_email = (
      SELECT users.email FROM auth.users WHERE users.id = auth.uid()
    ))
  )
);

CREATE POLICY "Authenticated users can view own PDF reports" 
ON public.pdf_reports 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage their own MFA settings" 
ON public.user_mfa 
FOR ALL 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);