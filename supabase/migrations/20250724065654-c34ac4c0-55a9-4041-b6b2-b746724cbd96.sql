-- CRITICAL SECURITY FIX: Enhanced RLS and remove hardcoded password reference

-- Remove the unsafe migration that sets hardcoded passwords
-- Note: The previous migration with admin123 should be manually rolled back

-- Create the PDF reports table that was mentioned in the audit
CREATE TABLE IF NOT EXISTS public.pdf_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_result_id UUID REFERENCES public.assessment_results(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('candidate', 'employer')),
    file_path TEXT NOT NULL,
    file_size INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on PDF reports
ALTER TABLE public.pdf_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for PDF reports
CREATE POLICY "Users can view own PDF reports" 
ON public.pdf_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create PDF reports" 
ON public.pdf_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create secure password reset function instead of hardcoded passwords
CREATE OR REPLACE FUNCTION public.request_admin_password_reset(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- This function should trigger a secure password reset email
  -- Instead of setting a hardcoded password
  -- The actual reset should happen through proper auth flow
  INSERT INTO public.security_events (
    user_id,
    event_type,
    event_details,
    severity
  )
  SELECT 
    id,
    'admin_password_reset_requested',
    jsonb_build_object('email', p_email, 'requested_at', now()),
    'info'
  FROM auth.users 
  WHERE email = p_email;
  
  RAISE NOTICE 'Password reset request logged for email: %', p_email;
END;
$$;

-- Add storage bucket for PDF reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for PDF reports
CREATE POLICY "Users can upload own reports" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add version tracking for scoring algorithms
CREATE TABLE IF NOT EXISTS public.scoring_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version_number TEXT NOT NULL UNIQUE,
    algorithm_type TEXT NOT NULL,
    parameters JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT false
);

ALTER TABLE public.scoring_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scoring versions" 
ON public.scoring_versions 
FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view active versions" 
ON public.scoring_versions 
FOR SELECT 
USING (is_active = true);