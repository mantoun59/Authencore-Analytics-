-- Create storage bucket for assessment logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assessment-logos', 'assessment-logos', true);

-- Create storage policies for assessment logos
CREATE POLICY "Assessment logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assessment-logos');

CREATE POLICY "Admins can upload assessment logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'assessment-logos' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update assessment logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'assessment-logos' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete assessment logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'assessment-logos' AND is_admin(auth.uid()));