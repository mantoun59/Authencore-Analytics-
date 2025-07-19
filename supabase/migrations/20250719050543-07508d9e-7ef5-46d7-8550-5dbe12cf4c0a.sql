-- Create employer accounts table
CREATE TABLE public.employer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  plan_type TEXT DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create solo candidates table
CREATE TABLE public.solo_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  country TEXT,
  access_token TEXT UNIQUE NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  assessment_completed BOOLEAN DEFAULT false,
  report_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create employer candidates table (candidates assigned to employers)
CREATE TABLE public.employer_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.employer_accounts(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  country TEXT,
  position_applied TEXT,
  assessment_completed BOOLEAN DEFAULT false,
  report_url TEXT,
  invited_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID,
  candidate_type TEXT NOT NULL CHECK (candidate_type IN ('solo', 'employer')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create analytics events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.employer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solo_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employer accounts
CREATE POLICY "Employers can view their own account" ON public.employer_accounts
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "System can manage employer accounts" ON public.employer_accounts
  FOR ALL USING (true);

-- RLS Policies for solo candidates (token-based access)
CREATE POLICY "Solo candidates can view their own data" ON public.solo_candidates
  FOR SELECT USING (true);

CREATE POLICY "System can manage solo candidates" ON public.solo_candidates
  FOR ALL USING (true);

-- RLS Policies for employer candidates
CREATE POLICY "Employers can view their own candidates" ON public.employer_candidates
  FOR SELECT USING (
    employer_id IN (
      SELECT id FROM public.employer_accounts 
      WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "System can manage employer candidates" ON public.employer_candidates
  FOR ALL USING (true);

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    CASE 
      WHEN candidate_type = 'solo' THEN 
        candidate_id IN (SELECT id FROM public.solo_candidates)
      WHEN candidate_type = 'employer' THEN 
        candidate_id IN (
          SELECT ec.id FROM public.employer_candidates ec
          JOIN public.employer_accounts ea ON ec.employer_id = ea.id
          WHERE auth.uid()::text = ea.id::text
        )
      ELSE false
    END
  );

CREATE POLICY "System can manage payments" ON public.payments
  FOR ALL USING (true);

-- RLS Policies for analytics (admin only)
CREATE POLICY "Admins can view analytics" ON public.analytics_events
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION public.log_analytics_event(
  p_event_type TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.analytics_events (event_type, entity_type, entity_id, metadata)
  VALUES (p_event_type, p_entity_type, p_entity_id, p_metadata);
END;
$$;

-- Create function to authenticate employers
CREATE OR REPLACE FUNCTION public.authenticate_employer(
  p_email TEXT,
  p_password TEXT
) RETURNS TABLE(
  employer_id UUID,
  name TEXT,
  email TEXT,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ea.id,
    ea.name,
    ea.email,
    ea.is_active
  FROM public.employer_accounts ea
  WHERE ea.email = p_email 
    AND ea.password_hash = crypt(p_password, ea.password_hash)
    AND ea.is_active = true;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_employer_accounts_updated_at
  BEFORE UPDATE ON public.employer_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solo_candidates_updated_at
  BEFORE UPDATE ON public.solo_candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employer_candidates_updated_at
  BEFORE UPDATE ON public.employer_candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();