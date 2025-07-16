-- Create assessment_results table to store assessment data
CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  results JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies for assessment_results
CREATE POLICY "Users can view their own assessment results" 
ON public.assessment_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment results" 
ON public.assessment_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment results" 
ON public.assessment_results 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_assessment_results_updated_at
BEFORE UPDATE ON public.assessment_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create generated_reports table to store generated reports
CREATE TABLE public.generated_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_result_id UUID NOT NULL REFERENCES public.assessment_results(id),
  report_type TEXT NOT NULL CHECK (report_type IN ('candidate', 'employer')),
  report_data JSONB NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for generated_reports
CREATE POLICY "Users can view their own generated reports" 
ON public.generated_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated reports" 
ON public.generated_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_generated_reports_updated_at
BEFORE UPDATE ON public.generated_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();