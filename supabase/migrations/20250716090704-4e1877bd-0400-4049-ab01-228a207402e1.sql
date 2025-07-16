-- Create themes table for storing user theme preferences
CREATE TABLE public.user_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_name TEXT NOT NULL DEFAULT 'default',
  custom_colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_themes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own theme" 
ON public.user_themes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own theme" 
ON public.user_themes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own theme" 
ON public.user_themes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own theme" 
ON public.user_themes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_user_themes_updated_at
BEFORE UPDATE ON public.user_themes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();