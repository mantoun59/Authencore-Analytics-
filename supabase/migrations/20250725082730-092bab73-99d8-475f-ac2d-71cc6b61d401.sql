-- Fix payment data consistency by creating payment record for solo candidate with completed status
INSERT INTO payments (
  candidate_id,
  candidate_type,
  amount,
  status,
  currency,
  created_at,
  updated_at,
  payment_method,
  metadata
)
SELECT 
  id,
  'solo',
  9.99, -- Default solo assessment price
  'paid',
  'USD',
  created_at,
  updated_at,
  'stripe',
  jsonb_build_object(
    'assessment_type', 'solo',
    'automated_fix', true,
    'note', 'Created to fix data consistency'
  )
FROM solo_candidates 
WHERE payment_status = 'completed' 
  AND id NOT IN (SELECT candidate_id FROM payments WHERE candidate_type = 'solo');

-- Add trigger to automatically create payment record when solo candidate payment status is updated
CREATE OR REPLACE FUNCTION sync_solo_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If payment status changed to completed and no payment record exists
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
    -- Create payment record if it doesn't exist
    INSERT INTO payments (
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
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_solo_payment_trigger ON solo_candidates;
CREATE TRIGGER sync_solo_payment_trigger
  AFTER UPDATE ON solo_candidates
  FOR EACH ROW
  EXECUTE FUNCTION sync_solo_payment_status();