-- Function to assign admin role to a user by email
CREATE OR REPLACE FUNCTION public.assign_admin_role(p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get the user ID from auth.users by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = p_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', p_email;
  END IF;
  
  -- Insert admin role (will ignore if already exists due to unique constraint)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE 'Admin role assigned to user %', p_email;
END;
$$;

-- Example: Uncomment and modify the line below with your email to assign admin role
-- SELECT public.assign_admin_role('your-email@example.com');