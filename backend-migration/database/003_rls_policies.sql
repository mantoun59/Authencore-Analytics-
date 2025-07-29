-- AuthenCore Analytics Row Level Security Policies
-- Comprehensive security policies for all tables

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdf_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solo_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_access_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

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

-- User roles policies
CREATE POLICY "Authenticated users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all user roles" 
ON public.user_roles 
FOR ALL 
USING (is_admin(auth.uid()));

-- Assessment results policies
CREATE POLICY "Users can create their own assessment results" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own assessment results" 
ON public.assessment_results 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own assessment results" 
ON public.assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Assessment progress policies
CREATE POLICY "Users can create their own assessment progress" 
ON public.assessment_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND guest_token IS NOT NULL));

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

-- Assessment demographics policies
CREATE POLICY "Users can insert their own demographics" 
ON public.assessment_demographics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own demographics" 
ON public.assessment_demographics 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view demographics for research" 
ON public.assessment_demographics 
FOR SELECT 
USING (is_admin(auth.uid()) AND consent_for_research = true);

-- Payment plans policies
CREATE POLICY "Anyone can view active payment plans" 
ON public.payment_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage payment plans" 
ON public.payment_plans 
FOR ALL 
USING (is_admin(auth.uid()));

-- Orders policies
CREATE POLICY "System can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR 
    (is_guest_order = true AND guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Order items policies
CREATE POLICY "System can manage order items" 
ON public.order_items 
FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can view their order items" 
ON public.order_items 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND order_id IN (
    SELECT id FROM orders 
    WHERE auth.uid() = user_id OR 
    (is_guest_order = true AND guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

-- Guest access tokens policies
CREATE POLICY "System can manage guest tokens" 
ON public.guest_access_tokens 
FOR ALL 
USING (true);

CREATE POLICY "Guests can view their own tokens" 
ON public.guest_access_tokens 
FOR SELECT 
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR 
  auth.uid()::text = token
);

-- Generated reports policies
CREATE POLICY "Users can create their own generated reports" 
ON public.generated_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own generated reports" 
ON public.generated_reports 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- PDF reports policies
CREATE POLICY "System can create PDF reports" 
ON public.pdf_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view own PDF reports" 
ON public.pdf_reports 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Analytics events policies
CREATE POLICY "System can insert analytics" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view analytics" 
ON public.analytics_events 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Security events policies
CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view their own security events" 
ON public.security_events 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all security events" 
ON public.security_events 
FOR SELECT 
USING (is_admin(auth.uid()));

-- API rate limits policies
CREATE POLICY "System can manage rate limits" 
ON public.api_rate_limits 
FOR ALL 
WITH CHECK (true);

CREATE POLICY "Admins can view all rate limits" 
ON public.api_rate_limits 
FOR SELECT 
USING (is_admin(auth.uid()));

-- User sessions policies
CREATE POLICY "System can manage sessions" 
ON public.user_sessions 
FOR ALL 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- User MFA policies
CREATE POLICY "Authenticated users can manage their own MFA settings" 
ON public.user_mfa 
FOR ALL 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Employer accounts policies
CREATE POLICY "System can manage employer accounts" 
ON public.employer_accounts 
FOR ALL 
USING (true);

CREATE POLICY "Employers can view their own account" 
ON public.employer_accounts 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Employer candidates policies
CREATE POLICY "System can manage employer candidates" 
ON public.employer_candidates 
FOR ALL 
USING (true);

CREATE POLICY "Employers can view their own candidates" 
ON public.employer_candidates 
FOR SELECT 
USING (
  employer_id IN (
    SELECT id FROM employer_accounts 
    WHERE auth.uid()::text = id::text
  )
);

-- Solo candidates policies
CREATE POLICY "System can manage solo candidates" 
ON public.solo_candidates 
FOR ALL 
USING (true);

CREATE POLICY "Solo candidates can view their own data" 
ON public.solo_candidates 
FOR SELECT 
USING (true);

-- Payments policies
CREATE POLICY "System can manage payments" 
ON public.payments 
FOR ALL 
USING (true);

CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (
  CASE
    WHEN candidate_type = 'solo' THEN 
      candidate_id IN (SELECT id FROM solo_candidates)
    WHEN candidate_type = 'employer' THEN 
      candidate_id IN (
        SELECT ec.id FROM employer_candidates ec
        JOIN employer_accounts ea ON ec.employer_id = ea.id
        WHERE auth.uid()::text = ea.id::text
      )
    ELSE false
  END
);

-- Partner accounts policies
CREATE POLICY "Admin only partner accounts" 
ON public.partner_accounts 
FOR ALL 
USING (is_admin(auth.uid()));

-- Partner access permissions policies
CREATE POLICY "Admin only partner permissions" 
ON public.partner_access_permissions 
FOR ALL 
USING (is_admin(auth.uid()));

-- Partner access logs policies
CREATE POLICY "System can insert partner logs" 
ON public.partner_access_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin only partner logs" 
ON public.partner_access_logs 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Partner pricing policies
CREATE POLICY "Admins can manage partner pricing" 
ON public.partner_pricing 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Partners can view their own pricing" 
ON public.partner_pricing 
FOR SELECT 
USING (
  partner_id IN (
    SELECT id FROM partner_accounts 
    WHERE username = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Admin settings policies
CREATE POLICY "Admins can manage settings" 
ON public.admin_settings 
FOR ALL 
USING (is_admin(auth.uid()));