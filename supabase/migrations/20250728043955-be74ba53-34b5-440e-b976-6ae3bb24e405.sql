-- Make reports bucket public so PDFs can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'reports';

-- Create policy to allow public access to reports  
CREATE POLICY "Public access to reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'reports');