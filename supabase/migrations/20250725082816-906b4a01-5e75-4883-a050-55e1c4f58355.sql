-- Fix the search path security issue for the new function
CREATE OR REPLACE FUNCTION sync_solo_payment_status()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- If payment status changed to completed and no payment record exists
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
    -- Create payment record if it doesn't exist
    INSERT INTO public.payments (
      candidate_id,
      candidate_type,
      amount,
      status,
      currency,
      payment_method,
      metadata
    ) VALUES (
      NEW.id,
      'solo',
      9.99,
      'paid',
      'USD',
      'stripe',
      jsonb_build_object(
        'assessment_type', 'solo',
        'auto_synced', true
      )
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;