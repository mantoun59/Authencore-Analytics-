-- Create payment plans table for subscription management
CREATE TABLE public.payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('individual', 'subscription', 'bulk')),
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_interval TEXT CHECK (billing_interval IN ('one-time', 'monthly', 'yearly')),
  assessment_access JSONB, -- Which assessments are included
  max_assessments INTEGER, -- For bulk plans
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table for payment tracking
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest checkout
  guest_email TEXT, -- For guest orders
  guest_name TEXT, -- For guest orders
  plan_id UUID REFERENCES public.payment_plans(id),
  assessment_type TEXT, -- For individual assessment purchases
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_processor TEXT, -- Which processor was used
  payment_reference TEXT, -- External payment ID
  payment_metadata JSONB, -- Store processor-specific data
  billing_info JSONB, -- Store billing address, etc.
  is_guest_order BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ, -- For guest access expiration
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order items for detailed tracking
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create partner pricing table for bulk discounts
CREATE TABLE public.partner_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partner_accounts(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  discount_percentage DECIMAL(5,2), -- Percentage discount
  fixed_price DECIMAL(10,2), -- Or fixed price per assessment
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create guest access tokens for temporary assessment access
CREATE TABLE public.guest_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_access_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_plans (public read, admin manage)
CREATE POLICY "Anyone can view active payment plans" ON public.payment_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage payment plans" ON public.payment_plans
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (is_guest_order = true AND guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "System can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update orders" ON public.orders
  FOR UPDATE USING (true);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE auth.uid() = user_id OR 
            (is_guest_order = true AND guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

CREATE POLICY "System can manage order items" ON public.order_items
  FOR ALL USING (true);

-- RLS Policies for partner_pricing
CREATE POLICY "Partners can view their own pricing" ON public.partner_pricing
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM public.partner_accounts 
      WHERE username = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage partner pricing" ON public.partner_pricing
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for guest_access_tokens
CREATE POLICY "Guests can view their own tokens" ON public.guest_access_tokens
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    auth.uid()::text = token
  );

CREATE POLICY "System can manage guest tokens" ON public.guest_access_tokens
  FOR ALL USING (true);

-- Insert default payment plans based on your assessment prices
INSERT INTO public.payment_plans (name, description, plan_type, price, billing_interval, assessment_access) VALUES
  ('CareerLaunch Assessment', 'Comprehensive career discovery assessment', 'individual', 9.99, 'one-time', '["career-launch"]'),
  ('CAIR+ Personality', 'Advanced personality assessment with validity detection', 'individual', 29.99, 'one-time', '["cair-personality"]'),
  ('Burnout Prevention Index', 'Proactive stress & resilience evaluation', 'individual', 39.99, 'one-time', '["stress-resilience"]'),
  ('Cultural Intelligence', 'Global competency assessment', 'individual', 19.99, 'one-time', '["cultural-intelligence"]'),
  ('Communication Styles', 'Advanced communication analysis', 'individual', 24.99, 'one-time', '["communication-styles"]'),
  ('Emotional Intelligence', 'EQ assessment & development', 'individual', 24.99, 'one-time', '["emotional-intelligence"]'),
  ('Faith & Values', 'Values alignment assessment', 'individual', 19.99, 'one-time', '["faith-values"]'),
  ('Gen Z Workplace', 'Generational workplace assessment', 'individual', 9.99, 'one-time', '["genz-assessment"]'),
  ('Premium Monthly', 'Access to all assessments monthly', 'subscription', 49.99, 'monthly', '["all"]'),
  ('Premium Yearly', 'Access to all assessments yearly (20% off)', 'subscription', 479.99, 'yearly', '["all"]'),
  ('Enterprise Bulk - 10 Pack', 'Bulk assessment package for organizations', 'bulk', 199.99, 'one-time', '["all"]'),
  ('Enterprise Bulk - 50 Pack', 'Large bulk assessment package', 'bulk', 799.99, 'one-time', '["all"]');

-- Create function to generate unique guest access tokens
CREATE OR REPLACE FUNCTION generate_guest_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Create function to check guest access
CREATE OR REPLACE FUNCTION check_guest_access(p_token TEXT, p_assessment_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.guest_access_tokens
    WHERE token = p_token
      AND assessment_type = p_assessment_type
      AND expires_at > now()
      AND is_active = true
      AND used_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to use guest token
CREATE OR REPLACE FUNCTION use_guest_token(p_token TEXT, p_assessment_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.guest_access_tokens
  SET used_at = now()
  WHERE token = p_token
    AND assessment_type = p_assessment_type
    AND expires_at > now()
    AND is_active = true
    AND used_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_plans_updated_at
  BEFORE UPDATE ON public.payment_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_pricing_updated_at
  BEFORE UPDATE ON public.partner_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();