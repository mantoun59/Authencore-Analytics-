-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create admin settings table to store notification preferences
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on admin settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin settings
CREATE POLICY "Admins can manage settings" ON public.admin_settings
FOR ALL
USING (is_admin(auth.uid()));

-- Insert default notification settings
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES 
('purchase_notifications', '{
  "enabled": true,
  "admin_email": "admin@authencore.org",
  "daily_enabled": true,
  "weekly_enabled": true,
  "monthly_enabled": true,
  "daily_time": "09:00",
  "weekly_day": "monday",
  "monthly_day": 1
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Schedule daily purchase reports (9 AM every day)
SELECT cron.schedule(
  'daily-purchase-report',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://jlbftyjewxgetxcihban.supabase.co/functions/v1/purchase-analytics',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg"}'::jsonb,
      body := '{"period": "Daily", "adminEmail": "admin@authencore.org"}'::jsonb
    ) as request_id;
  $$
);

-- Schedule weekly purchase reports (Monday 9 AM)
SELECT cron.schedule(
  'weekly-purchase-report',
  '0 9 * * 1',
  $$
  SELECT
    net.http_post(
      url := 'https://jlbftyjewxgetxcihban.supabase.co/functions/v1/purchase-analytics',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg"}'::jsonb,
      body := '{"period": "Weekly", "adminEmail": "admin@authencore.org"}'::jsonb
    ) as request_id;
  $$
);

-- Schedule monthly purchase reports (1st of month 9 AM)
SELECT cron.schedule(
  'monthly-purchase-report',
  '0 9 1 * *',
  $$
  SELECT
    net.http_post(
      url := 'https://jlbftyjewxgetxcihban.supabase.co/functions/v1/purchase-analytics',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg"}'::jsonb,
      body := '{"period": "Monthly", "adminEmail": "admin@authencore.org"}'::jsonb
    ) as request_id;
  $$
);

-- Create function to manually trigger reports
CREATE OR REPLACE FUNCTION public.trigger_purchase_report(p_period TEXT, p_admin_email TEXT DEFAULT 'admin@authencore.org')
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSON;
BEGIN
  -- Only admins can trigger reports
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Insufficient permissions to trigger purchase reports';
  END IF;

  -- Trigger the edge function
  SELECT net.http_post(
    url := 'https://jlbftyjewxgetxcihban.supabase.co/functions/v1/purchase-analytics',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg"}'::jsonb,
    body := json_build_object('period', p_period, 'adminEmail', p_admin_email, 'manual', true)::jsonb
  ) INTO result;

  -- Log the manual trigger
  PERFORM log_analytics_event(
    p_event_type := 'manual_purchase_report_triggered',
    p_entity_type := 'analytics',
    p_metadata := json_build_object(
      'period', p_period,
      'admin_email', p_admin_email,
      'triggered_by', auth.uid(),
      'triggered_at', now()
    )::jsonb
  );

  RETURN json_build_object('success', true, 'message', 'Report triggered successfully', 'request_id', result);
END;
$$;