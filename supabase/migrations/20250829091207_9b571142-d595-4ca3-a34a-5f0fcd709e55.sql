-- Fix critical security vulnerabilities identified in security scan

-- 1. Fix contact_inquiries - remove overly permissive INSERT policy and add proper restrictions
DROP POLICY IF EXISTS "Contact forms can insert inquiries" ON public.contact_inquiries;
CREATE POLICY "Authenticated users can submit contact inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Add rate limiting constraint to prevent spam
CREATE OR REPLACE FUNCTION public.check_contact_inquiry_rate_limit() 
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Check for more than 3 inquiries from same user in last hour
  SELECT COUNT(*) INTO recent_count
  FROM public.contact_inquiries
  WHERE email = NEW.email
    AND created_at > now() - interval '1 hour';
    
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Too many contact inquiries from this email';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER contact_inquiry_rate_limit_trigger
  BEFORE INSERT ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION check_contact_inquiry_rate_limit();

-- 2. Fix orders security - remove overly permissive system policies
DROP POLICY IF EXISTS "System can create orders" ON public.orders;
DROP POLICY IF EXISTS "System can update orders" ON public.orders;

CREATE POLICY "Authenticated users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR (is_guest_order = true AND guest_email IS NOT NULL))
);

CREATE POLICY "Only admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- 3. Fix order_items security - remove overly permissive system policy
DROP POLICY IF EXISTS "System can manage order items" ON public.order_items;

CREATE POLICY "Authenticated users can create their order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  order_id IN (
    SELECT id FROM public.orders 
    WHERE auth.uid() = user_id OR (is_guest_order = true AND guest_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ))
  )
);

CREATE POLICY "Only admins can modify order items" 
ON public.order_items 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete order items" 
ON public.order_items 
FOR DELETE 
USING (is_admin(auth.uid()));

-- 4. Fix partner_accounts - the current policy is only for authenticated role, make it more restrictive
DROP POLICY IF EXISTS "Admin only partner accounts" ON public.partner_accounts;

CREATE POLICY "Only admins can view partner accounts" 
ON public.partner_accounts 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can create partner accounts" 
ON public.partner_accounts 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update partner accounts" 
ON public.partner_accounts 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete partner accounts" 
ON public.partner_accounts 
FOR DELETE 
USING (is_admin(auth.uid()));

-- 5. Add additional security for guest_access_tokens
CREATE POLICY "Users can only view tokens they created or received" 
ON public.guest_access_tokens 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    is_admin(auth.uid())
  )
);

-- 6. Create security event logging for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive tables
  PERFORM public.log_security_event(
    auth.uid(),
    'sensitive_table_access',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now()
    ),
    NULL,
    NULL,
    'info'
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for sensitive tables
CREATE TRIGGER log_contact_inquiries_access
  AFTER INSERT OR UPDATE OR DELETE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();

CREATE TRIGGER log_orders_access
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();

CREATE TRIGGER log_partner_accounts_access
  AFTER INSERT OR UPDATE OR DELETE ON public.partner_accounts
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();

-- 7. Add function to monitor failed access attempts
CREATE OR REPLACE FUNCTION public.log_failed_access(table_name text, attempted_action text)
RETURNS void AS $$
BEGIN
  PERFORM public.log_security_event(
    auth.uid(),
    'failed_access_attempt',
    jsonb_build_object(
      'table', table_name,
      'action', attempted_action,
      'user_id', auth.uid(),
      'timestamp', now()
    ),
    NULL,
    NULL,
    'warning'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to check for suspicious bulk operations
CREATE OR REPLACE FUNCTION public.detect_bulk_operations()
RETURNS TRIGGER AS $$
DECLARE
  recent_ops INTEGER;
BEGIN
  -- Check for more than 10 operations in 1 minute
  SELECT COUNT(*) INTO recent_ops
  FROM public.security_events
  WHERE user_id = auth.uid()
    AND event_type = 'sensitive_table_access'
    AND created_at > now() - interval '1 minute';
    
  IF recent_ops > 10 THEN
    PERFORM public.log_security_event(
      auth.uid(),
      'suspicious_bulk_operation',
      jsonb_build_object(
        'operations_count', recent_ops,
        'table', TG_TABLE_NAME,
        'timestamp', now()
      ),
      NULL,
      NULL,
      'critical'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add bulk operation detection to sensitive tables
CREATE TRIGGER detect_bulk_contact_ops
  AFTER INSERT ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION detect_bulk_operations();

CREATE TRIGGER detect_bulk_order_ops
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION detect_bulk_operations();