-- Create assessment progress tracking table
CREATE TABLE public.assessment_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  guest_token TEXT,
  assessment_type TEXT NOT NULL,
  phase_data JSONB NOT NULL DEFAULT '{}',
  responses JSONB NOT NULL DEFAULT '{}',
  current_phase INTEGER DEFAULT 0,
  current_question INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0.0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessment_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own assessment progress" 
ON public.assessment_progress 
FOR SELECT 
USING (auth.uid() = user_id OR (user_id IS NULL AND guest_token IS NOT NULL));

CREATE POLICY "Users can create their own assessment progress" 
ON public.assessment_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND guest_token IS NOT NULL));

CREATE POLICY "Users can update their own assessment progress" 
ON public.assessment_progress 
FOR UPDATE 
USING (auth.uid() = user_id OR (user_id IS NULL AND guest_token IS NOT NULL));

CREATE POLICY "Users can delete their own assessment progress" 
ON public.assessment_progress 
FOR DELETE 
USING (auth.uid() = user_id OR (user_id IS NULL AND guest_token IS NOT NULL));

-- Create function to auto-update timestamps
CREATE TRIGGER update_assessment_progress_updated_at
BEFORE UPDATE ON public.assessment_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to cleanup expired progress
CREATE OR REPLACE FUNCTION public.cleanup_expired_assessment_progress()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.assessment_progress 
  WHERE expires_at < now() AND is_completed = false;
END;
$function$;