-- Fix function search path security warnings by setting proper search_path

-- Fix the functions created in the previous migration
ALTER FUNCTION public.check_contact_inquiry_rate_limit() SET search_path TO 'public';
ALTER FUNCTION public.log_sensitive_operation() SET search_path TO 'public';
ALTER FUNCTION public.log_failed_access(text, text) SET search_path TO 'public';
ALTER FUNCTION public.detect_bulk_operations() SET search_path TO 'public';