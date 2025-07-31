-- Disable problematic assessments identified in audit
-- Add assessment status and risk tracking

-- Add assessment validation tracking table
CREATE TABLE public.assessment_validation_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL UNIQUE,
  validation_status TEXT NOT NULL DEFAULT 'under_review', -- under_review, validated, deprecated, disabled
  risk_level TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  theoretical_foundation TEXT,
  reliability_score NUMERIC,
  validity_evidence TEXT[],
  ethical_concerns TEXT[],
  legal_compliance_status TEXT DEFAULT 'review_required',
  psychometric_rating NUMERIC CHECK (psychometric_rating >= 0 AND psychometric_rating <= 10),
  last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_validation_status ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage assessment validation"
ON public.assessment_validation_status
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view validation status"
ON public.assessment_validation_status
FOR SELECT
USING (validation_status = 'validated');

-- Add trigger for updated_at
CREATE TRIGGER update_assessment_validation_status_updated_at
BEFORE UPDATE ON public.assessment_validation_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial validation status based on audit findings
INSERT INTO public.assessment_validation_status 
(assessment_type, validation_status, risk_level, theoretical_foundation, psychometric_rating, ethical_concerns, notes) 
VALUES
-- Strong assessments
('career-launch', 'validated', 'low', 'RIASEC Model (Holland)', 8.5, '{}', 'Excellent theoretical foundation with proven validity'),
('cultural-intelligence', 'validated', 'low', 'Ang & Van Dyne Four-Factor CQ Model', 8.0, '{}', 'Strong scientific foundation with minor implementation concerns'),
('burnout-prevention', 'under_review', 'medium', 'Adapted Maslach Burnout Inventory', 7.0, ARRAY['Clinical claims overstated'], 'Strong foundation but implementation concerns'),

-- Moderate assessments requiring review
('emotional-intelligence', 'under_review', 'medium', 'Five-Factor EQ Model', 6.0, ARRAY['Framework ambiguity', 'Self-report bias'], 'Conceptually sound but implementation concerns'),
('stress-resilience', 'under_review', 'medium', 'Resilience Quotient Model', 6.5, '{}', 'Solid concept with implementation questions'),
('communication-styles', 'under_review', 'high', 'Four-Quadrant Communication Matrix', 5.0, ARRAY['Oversimplified', 'Cultural bias'], 'Potentially useful but scientifically unvalidated'),
('leadership', 'under_review', 'high', 'Six Leadership Styles Model', 5.5, ARRAY['Oversimplified model', 'Cultural bias'], 'Useful concept but limited scientific rigor'),

-- High-risk assessments requiring immediate action
('faith-values', 'disabled', 'critical', 'Values Hierarchy Model', 2.0, ARRAY['Religious bias', 'Cultural insensitivity', 'Employment discrimination risk'], 'Potentially problematic and scientifically weak - DISABLED'),
('genz-workplace', 'disabled', 'critical', 'Generational Theory', 2.5, ARRAY['Generational stereotyping', 'Age discrimination risk', 'Cultural assumptions'], 'Scientifically problematic and potentially discriminatory - DISABLED'),
('digital-wellness', 'disabled', 'high', 'Custom Framework', 3.0, ARRAY['No theoretical foundation', 'Generational bias'], 'Well-intentioned but scientifically unfounded - DISABLED');

-- Add professional oversight requirements table
CREATE TABLE public.professional_oversight_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  requires_qualified_administrator BOOLEAN DEFAULT true,
  minimum_qualification_level TEXT DEFAULT 'graduate_psychology',
  requires_supervision BOOLEAN DEFAULT false,
  usage_restrictions TEXT[],
  legal_disclaimers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_oversight_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage oversight requirements"
ON public.professional_oversight_requirements
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view oversight requirements"
ON public.professional_oversight_requirements
FOR SELECT
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_professional_oversight_requirements_updated_at
BEFORE UPDATE ON public.professional_oversight_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert professional requirements
INSERT INTO public.professional_oversight_requirements 
(assessment_type, requires_qualified_administrator, minimum_qualification_level, requires_supervision, usage_restrictions, legal_disclaimers)
VALUES
('career-launch', true, 'career_counseling_certification', false, 
 ARRAY['Not for clinical diagnosis', 'Career guidance only'],
 ARRAY['Results are for guidance purposes only', 'Not a substitute for professional career counseling']),

('cultural-intelligence', true, 'cross_cultural_training', false,
 ARRAY['Training context only', 'Not for hiring decisions without validation'],
 ARRAY['Cultural assessment for development purposes', 'May not predict cross-cultural performance']),

('emotional-intelligence', true, 'psychology_degree', true,
 ARRAY['Development purposes only', 'Not for clinical assessment'],
 ARRAY['Self-report measure with inherent limitations', 'Not a clinical diagnostic tool']),

('communication-styles', true, 'communication_training', false,
 ARRAY['Training and development only', 'Not validated for hiring'],
 ARRAY['Proprietary model requiring further validation', 'Results may not predict communication effectiveness']),

('leadership', true, 'leadership_development_certification', false,
 ARRAY['Development context only', 'Not for promotion decisions'],
 ARRAY['Simplified leadership model', 'Does not assess situational leadership capabilities']),

('stress-resilience', true, 'psychology_degree', true,
 ARRAY['Wellness screening only', 'Not for clinical diagnosis'],
 ARRAY['Not a clinical diagnostic tool', 'Professional support may be needed for high-risk results']),

('burnout-prevention', true, 'occupational_health_training', true,
 ARRAY['Screening tool only', 'Not for clinical diagnosis'],
 ARRAY['Early warning system only', 'Clinical assessment required for diagnosis']);

-- Add assessment access control based on validation status
CREATE OR REPLACE FUNCTION public.check_assessment_access(p_assessment_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  assessment_status TEXT;
BEGIN
  -- Check validation status
  SELECT validation_status INTO assessment_status
  FROM public.assessment_validation_status
  WHERE assessment_type = p_assessment_type;
  
  -- Allow access only to validated or under_review assessments
  -- Block disabled assessments
  RETURN COALESCE(assessment_status IN ('validated', 'under_review'), false);
END;
$$;