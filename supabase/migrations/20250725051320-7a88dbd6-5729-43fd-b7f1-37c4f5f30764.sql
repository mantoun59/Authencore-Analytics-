-- Insert sample payment plans if they don't exist
INSERT INTO payment_plans (id, name, description, plan_type, price, currency, billing_interval, assessment_access, is_active) VALUES
(gen_random_uuid(), 'CareerLaunch Assessment', 'Complete career discovery assessment', 'individual', 19.99, 'USD', 'one-time', '["career-launch"]', true),
(gen_random_uuid(), 'Communication Styles', 'Workplace communication analysis', 'individual', 24.99, 'USD', 'one-time', '["communication-styles"]', true),
(gen_random_uuid(), 'Gen Z Workplace', 'Generational workplace assessment', 'individual', 14.99, 'USD', 'one-time', '["genz-assessment"]', true),
(gen_random_uuid(), 'Premium Bundle', 'Access to all assessments', 'subscription', 49.99, 'USD', 'monthly', '["all"]', true)
ON CONFLICT (id) DO NOTHING;