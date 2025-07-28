-- Upload the emotional intelligence logo to storage
-- First ensure the assessment-logos bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assessment-logos', 'assessment-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public access to assessment logos
CREATE POLICY "Assessment logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assessment-logos');

-- Create policy to allow uploads to assessment logos
CREATE POLICY "Allow uploads to assessment logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'assessment-logos');