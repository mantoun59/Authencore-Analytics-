-- Create AI content validation table
CREATE TABLE public.ai_content_validation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  validation_score NUMERIC NOT NULL DEFAULT 0,
  is_valid BOOLEAN NOT NULL DEFAULT false,
  issues TEXT[] DEFAULT '{}',
  bias_flags TEXT[] DEFAULT '{}',
  human_review_required BOOLEAN NOT NULL DEFAULT false,
  recommendations TEXT[] DEFAULT '{}',
  validated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_content_validation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage AI validation results" 
ON public.ai_content_validation 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "System can insert validation results" 
ON public.ai_content_validation 
FOR INSERT 
WITH CHECK (true);

-- Add update trigger
CREATE TRIGGER update_ai_content_validation_updated_at
BEFORE UPDATE ON public.ai_content_validation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create professional standards compliance tracking table
CREATE TABLE public.professional_standards_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_type TEXT NOT NULL,
  standard_type TEXT NOT NULL, -- 'APA', 'ITC', 'AERA', etc.
  compliance_score NUMERIC NOT NULL DEFAULT 0,
  requirements_met TEXT[] DEFAULT '{}',
  requirements_missing TEXT[] DEFAULT '{}',
  compliance_status TEXT NOT NULL DEFAULT 'non_compliant', -- 'compliant', 'partial', 'non_compliant'
  last_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_review_due TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  remediation_plan TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_standards_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage compliance tracking" 
ON public.professional_standards_compliance 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add update trigger
CREATE TRIGGER update_professional_standards_compliance_updated_at
BEFORE UPDATE ON public.professional_standards_compliance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();