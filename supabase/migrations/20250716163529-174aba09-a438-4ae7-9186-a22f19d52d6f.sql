-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS policies for user_roles table
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update existing tables to use admin role
CREATE POLICY "Only admins can manage partner accounts"
ON public.partner_accounts
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Replace existing partner policies
DROP POLICY IF EXISTS "Admins can manage partner accounts" ON public.partner_accounts;
DROP POLICY IF EXISTS "Admins can manage partner permissions" ON public.partner_access_permissions;
DROP POLICY IF EXISTS "Admins can view partner logs" ON public.partner_access_logs;

CREATE POLICY "Only admins can manage partner accounts"
ON public.partner_accounts
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage partner permissions"
ON public.partner_access_permissions
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can view partner logs"
ON public.partner_access_logs
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));