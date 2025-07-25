-- Create storage bucket for marketing materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-materials', 'marketing-materials', true);

-- Create policies for marketing materials bucket
CREATE POLICY "Allow public viewing of marketing materials" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'marketing-materials');

CREATE POLICY "Allow authenticated uploads to marketing materials" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'marketing-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update marketing materials" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'marketing-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete marketing materials" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'marketing-materials' AND auth.role() = 'authenticated');