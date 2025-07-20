-- Create Gen Z Assessment specific tables
CREATE TABLE public.genz_assessment_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    text TEXT NOT NULL,
    context TEXT,
    emoji TEXT,
    responses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Gen Z assessment responses
CREATE TABLE public.genz_assessment_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    scenario_id UUID REFERENCES genz_assessment_scenarios(id),
    response_type TEXT NOT NULL, -- love, good, meh, nope, toxic
    response_time INTEGER, -- milliseconds
    swipe_data JSONB, -- velocity, direction, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Gen Z values selection
CREATE TABLE public.genz_values_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    value_id TEXT NOT NULL,
    rank INTEGER NOT NULL, -- 1-5 for top 5 values
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Gen Z collaboration responses
CREATE TABLE public.genz_collaboration_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    scenario_id TEXT NOT NULL,
    selected_option TEXT NOT NULL,
    option_scores JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Gen Z assessment results
CREATE TABLE public.genz_assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    username TEXT NOT NULL,
    birth_year INTEGER,
    avatar_emoji TEXT,
    workplace_profile JSONB NOT NULL,
    dimensions JSONB NOT NULL,
    traits JSONB NOT NULL,
    workplace_preferences JSONB NOT NULL,
    red_flags JSONB NOT NULL,
    company_matches JSONB NOT NULL,
    employer_insights JSONB, -- for employer view
    validity_metrics JSONB, -- authenticity checks
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.genz_assessment_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_values_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_collaboration_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genz_assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scenarios (public read)
CREATE POLICY "Anyone can view scenarios" ON public.genz_assessment_scenarios
    FOR SELECT USING (true);

-- RLS Policies for responses (user-specific)
CREATE POLICY "Users can insert their own responses" ON public.genz_assessment_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own responses" ON public.genz_assessment_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own values" ON public.genz_values_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own values" ON public.genz_values_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collaboration responses" ON public.genz_collaboration_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own collaboration responses" ON public.genz_collaboration_responses
    FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for results
CREATE POLICY "Users can insert their own results" ON public.genz_assessment_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own results" ON public.genz_assessment_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own results" ON public.genz_assessment_results
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE TRIGGER update_genz_results_updated_at
    BEFORE UPDATE ON public.genz_assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample scenarios (subset for demo)
INSERT INTO public.genz_assessment_scenarios (category, type, text, context, emoji, responses) VALUES
('work_style', 'situation', 'Your manager just Slacked: "Can we do a quick sync?" at 4:45 PM on Friday', 'No context given, just the message', '😰', 
'{"love": {"flexibility": -2, "boundaries": -3, "anxiety": 2}, "good": {"flexibility": 2, "boundaries": 0, "anxiety": 0}, "meh": {"flexibility": 1, "boundaries": 1, "anxiety": 1}, "nope": {"flexibility": -1, "boundaries": 3, "anxiety": 0}, "toxic": {"flexibility": -2, "boundaries": 4, "anxiety": 3}}'),

('values', 'decision', 'The company just announced they''re back to 5 days in office. Your commute is 1 hour each way.', 'You were hired as ''hybrid flexible''', '🏢',
'{"love": {"flexibility": -3, "trust": 2, "loyalty": 3}, "good": {"flexibility": -1, "trust": 1, "loyalty": 2}, "meh": {"flexibility": -2, "trust": 0, "loyalty": 0}, "nope": {"flexibility": 3, "trust": -2, "loyalty": -1}, "toxic": {"flexibility": 4, "trust": -3, "loyalty": -3}}'),

('growth', 'opportunity', 'You can either: Get a 10% raise OR work on an innovative project with no extra pay', 'The project could be huge for your portfolio', '🤔',
'{"love": {"growth_mindset": 4, "financial_priority": -2, "risk_taking": 3}, "good": {"growth_mindset": 3, "financial_priority": -1, "risk_taking": 2}, "meh": {"growth_mindset": 0, "financial_priority": 0, "risk_taking": 0}, "nope": {"growth_mindset": -2, "financial_priority": 3, "risk_taking": -1}, "toxic": {"growth_mindset": -3, "financial_priority": 2, "risk_taking": -2}}'),

('culture', 'observation', 'The CEO posts LinkedIn humble brags every day about ''grinding'' and ''5am club''', 'Expects everyone to like and share', '💪',
'{"love": {"hustle_culture": 4, "authenticity": -3, "work_life_balance": -3}, "good": {"hustle_culture": 2, "authenticity": -1, "work_life_balance": -1}, "meh": {"hustle_culture": 0, "authenticity": 0, "work_life_balance": 0}, "nope": {"hustle_culture": -3, "authenticity": 2, "work_life_balance": 2}, "toxic": {"hustle_culture": -4, "authenticity": 3, "work_life_balance": 3}}'),

('innovation', 'scenario', 'You suggest using AI to automate a tedious task. Manager says "We''ve always done it this way"', 'The task takes 3 hours daily', '🤖',
'{"love": {"innovation": -3, "tradition": 4, "efficiency": -3}, "good": {"innovation": -1, "tradition": 2, "efficiency": -1}, "meh": {"innovation": 0, "tradition": 1, "efficiency": 0}, "nope": {"innovation": 3, "tradition": -2, "efficiency": 3}, "toxic": {"innovation": 4, "tradition": -4, "efficiency": 4}}');