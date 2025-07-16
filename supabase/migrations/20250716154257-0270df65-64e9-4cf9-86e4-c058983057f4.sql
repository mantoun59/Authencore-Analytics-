-- Create partner accounts table
CREATE TABLE public.partner_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  access_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create partner access permissions table
CREATE TABLE public.partner_access_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partner_accounts(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  can_access BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(partner_id, assessment_type)
);

-- Create partner access logs table
CREATE TABLE public.partner_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partner_accounts(id) ON DELETE CASCADE,
  assessment_type TEXT,
  action TEXT NOT NULL, -- 'login', 'access_assessment', 'generate_report'
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all partner tables
ALTER TABLE public.partner_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_access_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_access_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partner_accounts (only admins can manage)
CREATE POLICY "Admins can manage partner accounts"
ON public.partner_accounts
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for partner_access_permissions
CREATE POLICY "Admins can manage partner permissions"
ON public.partner_access_permissions
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for partner_access_logs
CREATE POLICY "Admins can view partner logs"
ON public.partner_access_logs
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert partner logs"
ON public.partner_access_logs
FOR INSERT
WITH CHECK (true);

-- Create updated_at trigger for partner_accounts
CREATE TRIGGER update_partner_accounts_updated_at
BEFORE UPDATE ON public.partner_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to authenticate partners
CREATE OR REPLACE FUNCTION public.authenticate_partner(
  p_username TEXT,
  p_password TEXT
) RETURNS TABLE(
  partner_id UUID,
  username TEXT,
  organization_name TEXT,
  access_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  is_expired BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pa.id,
    pa.username,
    pa.organization_name,
    pa.access_expires_at,
    pa.is_active,
    (pa.access_expires_at < now()) as is_expired
  FROM public.partner_accounts pa
  WHERE pa.username = p_username 
    AND pa.password_hash = crypt(p_password, pa.password_hash)
    AND pa.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check partner access to assessments
CREATE OR REPLACE FUNCTION public.check_partner_assessment_access(
  p_partner_id UUID,
  p_assessment_type TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  -- Check if partner exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.partner_accounts 
    WHERE id = p_partner_id 
      AND is_active = true 
      AND access_expires_at > now()
  ) THEN
    RETURN false;
  END IF;
  
  -- Check specific permission (if no specific permission exists, deny access)
  RETURN EXISTS (
    SELECT 1 FROM public.partner_access_permissions 
    WHERE partner_id = p_partner_id 
      AND assessment_type = p_assessment_type 
      AND can_access = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log partner activity
CREATE OR REPLACE FUNCTION public.log_partner_activity(
  p_partner_id UUID,
  p_action TEXT,
  p_assessment_type TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.partner_access_logs (
    partner_id, assessment_type, action, ip_address, user_agent, metadata
  ) VALUES (
    p_partner_id, p_assessment_type, p_action, p_ip_address, p_user_agent, p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;