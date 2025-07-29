-- Storage Buckets Configuration for AuthenCore Analytics
-- Run this after the main database schema is set up

-- Create storage buckets (if using Supabase storage)
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('reports', 'reports', true),
  ('marketing-materials', 'marketing-materials', true),
  ('assessment-logos', 'assessment-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for reports bucket
CREATE POLICY "Authenticated users can view their own reports" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'reports' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "System can upload reports" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'reports');

CREATE POLICY "System can update reports" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'reports');

-- Storage policies for marketing materials
CREATE POLICY "Marketing materials are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'marketing-materials');

CREATE POLICY "Admins can manage marketing materials" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'marketing-materials' AND 
  (SELECT has_role(auth.uid(), 'admin'))
);

-- Storage policies for assessment logos
CREATE POLICY "Assessment logos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assessment-logos');

CREATE POLICY "Admins can manage assessment logos" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'assessment-logos' AND 
  (SELECT has_role(auth.uid(), 'admin'))
);

-- Storage size limits and monitoring
CREATE OR REPLACE FUNCTION check_storage_quota()
RETURNS TRIGGER AS $$
DECLARE
  bucket_size BIGINT;
  bucket_limit BIGINT;
BEGIN
  -- Define bucket limits
  CASE NEW.bucket_id
    WHEN 'reports' THEN bucket_limit := 5368709120; -- 5GB
    WHEN 'marketing-materials' THEN bucket_limit := 2147483648; -- 2GB
    WHEN 'assessment-logos' THEN bucket_limit := 524288000; -- 500MB
    ELSE bucket_limit := 1073741824; -- 1GB default
  END CASE;

  -- Calculate current bucket size
  SELECT COALESCE(SUM(metadata->>'size')::BIGINT, 0)
  INTO bucket_size
  FROM storage.objects
  WHERE bucket_id = NEW.bucket_id;

  -- Check if adding this file would exceed the limit
  IF bucket_size + COALESCE((NEW.metadata->>'size')::BIGINT, 0) > bucket_limit THEN
    RAISE EXCEPTION 'Storage quota exceeded for bucket %', NEW.bucket_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for storage quota checking
CREATE TRIGGER storage_quota_check
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION check_storage_quota();

-- Create function to get storage statistics
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS TABLE(
  bucket_name TEXT,
  file_count BIGINT,
  total_size BIGINT,
  quota_limit BIGINT,
  quota_used_percent NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH bucket_stats AS (
    SELECT 
      o.bucket_id,
      COUNT(*) as files,
      COALESCE(SUM((o.metadata->>'size')::BIGINT), 0) as size
    FROM storage.objects o
    GROUP BY o.bucket_id
  ),
  bucket_limits AS (
    SELECT 'reports' as bucket_id, 5368709120::BIGINT as limit_bytes
    UNION ALL
    SELECT 'marketing-materials', 2147483648::BIGINT
    UNION ALL
    SELECT 'assessment-logos', 524288000::BIGINT
  )
  SELECT 
    bs.bucket_id::TEXT,
    COALESCE(bs.files, 0),
    COALESCE(bs.size, 0),
    bl.limit_bytes,
    ROUND((COALESCE(bs.size, 0)::NUMERIC / bl.limit_bytes::NUMERIC) * 100, 2)
  FROM bucket_limits bl
  LEFT JOIN bucket_stats bs ON bl.bucket_id = bs.bucket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated, anon;
GRANT SELECT ON storage.buckets TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;