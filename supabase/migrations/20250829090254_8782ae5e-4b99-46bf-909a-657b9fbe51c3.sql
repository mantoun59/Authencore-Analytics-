-- CRITICAL SECURITY FIX: Remove dangerous policy exposing business intelligence data
-- The 'ml_feature_store' table had a policy allowing public access to sensitive economic data

-- Drop the extremely dangerous policy that allows public access to all ML data
DROP POLICY IF EXISTS "System can manage ML features" ON public.ml_feature_store;

-- The existing "Admins can view ML features" policy is secure and should remain

-- Create secure policies for ML feature store access
-- 1. Only authenticated users with proper authorization can insert ML features
CREATE POLICY "authorized_users_can_insert_ml_features" 
ON public.ml_feature_store 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- 2. Only admins can update ML features to protect data integrity
CREATE POLICY "admins_can_update_ml_features" 
ON public.ml_feature_store 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- 3. Only admins can delete ML features to prevent data loss
CREATE POLICY "admins_can_delete_ml_features" 
ON public.ml_feature_store 
FOR DELETE 
USING (is_admin(auth.uid()));

-- This completely eliminates competitor access to sensitive business intelligence data
-- including GDP growth rates, unemployment rates, and other economic indicators