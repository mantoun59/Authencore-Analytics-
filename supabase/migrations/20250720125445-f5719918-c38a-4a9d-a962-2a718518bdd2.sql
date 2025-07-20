-- Add more Gen Z workplace scenarios for a complete assessment
INSERT INTO public.genz_assessment_scenarios (category, type, text, context, emoji, responses) VALUES

-- Work Style Scenarios
('work_style', 'situation', 'Your team has a "mandatory fun" happy hour every Friday at 6 PM', 'You usually leave at 5 PM and have personal commitments', '🍻',
'{"love": {"social_connection": 3, "boundaries": -2, "team_culture": 3}, "good": {"social_connection": 1, "boundaries": 0, "team_culture": 1}, "meh": {"social_connection": 0, "boundaries": 1, "team_culture": 0}, "nope": {"social_connection": -2, "boundaries": 3, "team_culture": -1}, "toxic": {"social_connection": -3, "boundaries": 4, "team_culture": -2}}'),

('work_style', 'communication', 'Your boss prefers 45-minute video calls for updates you could send in a 2-minute Slack message', 'This happens 3x per week', '📹',
'{"love": {"efficiency": -3, "face_time": 3, "communication": 1}, "good": {"efficiency": -1, "face_time": 1, "communication": 1}, "meh": {"efficiency": -1, "face_time": 0, "communication": 0}, "nope": {"efficiency": 3, "face_time": -2, "communication": -1}, "toxic": {"efficiency": 4, "face_time": -3, "communication": -2}}'),

-- Technology & Innovation
('innovation', 'policy', 'Company blocks social media, personal email, and requires IE browser only', 'For "security reasons"', '🔒',
'{"love": {"digital_freedom": -4, "security": 3, "trust": -2}, "good": {"digital_freedom": -2, "security": 2, "trust": -1}, "meh": {"digital_freedom": -1, "security": 1, "trust": 0}, "nope": {"digital_freedom": 3, "security": -1, "trust": 2}, "toxic": {"digital_freedom": 4, "security": -2, "trust": -3}}'),

('innovation', 'scenario', 'You see a process that could be automated with a simple script, saving 2 hours daily', 'Management says "if it ain''t broke, don''t fix it"', '⚙️',
'{"love": {"innovation": -3, "efficiency": -3, "status_quo": 4}, "good": {"innovation": -1, "efficiency": -1, "status_quo": 2}, "meh": {"innovation": 0, "efficiency": 0, "status_quo": 1}, "nope": {"innovation": 3, "efficiency": 3, "status_quo": -2}, "toxic": {"innovation": 4, "efficiency": 4, "status_quo": -4}}'),

-- Culture & Values
('culture', 'observation', 'CEO posts daily about "family culture" but laid off 30% of staff via email', 'During record profit quarter', '👨‍👩‍👧‍👦',
'{"love": {"authenticity": -4, "loyalty": -3, "business_first": 3}, "good": {"authenticity": -2, "loyalty": -1, "business_first": 1}, "meh": {"authenticity": -1, "loyalty": 0, "business_first": 0}, "nope": {"authenticity": 3, "loyalty": 2, "business_first": -2}, "toxic": {"authenticity": 4, "loyalty": 3, "business_first": -4}}'),

('culture', 'policy', 'Open office with no personal decorations allowed and "collaboration zones" everywhere', 'No quiet spaces to focus', '🏢',
'{"love": {"collaboration": 3, "personal_space": -3, "focus": -2}, "good": {"collaboration": 1, "personal_space": -1, "focus": -1}, "meh": {"collaboration": 0, "personal_space": 0, "focus": 0}, "nope": {"collaboration": -2, "personal_space": 3, "focus": 3}, "toxic": {"collaboration": -3, "personal_space": 4, "focus": 4}}'),

-- Benefits & Compensation
('benefits', 'offer', 'Choose: $10K raise OR unlimited PTO (but average team member takes 8 days/year)', 'Company culture discourages actually using the PTO', '💰',
'{"love": {"financial_security": 4, "work_life_balance": -2, "transparency": 2}, "good": {"financial_security": 3, "work_life_balance": -1, "transparency": 1}, "meh": {"financial_security": 1, "work_life_balance": 0, "transparency": 0}, "nope": {"financial_security": -2, "work_life_balance": 3, "transparency": -1}, "toxic": {"financial_security": -3, "work_life_balance": 4, "transparency": -3}}'),

('benefits', 'perk', 'Free kombucha, ping pong table, and massage chairs, but no health insurance', 'Startup with 50 employees', '🏓',
'{"love": {"lifestyle_perks": 3, "real_benefits": -4, "priorities": -3}, "good": {"lifestyle_perks": 1, "real_benefits": -2, "priorities": -1}, "meh": {"lifestyle_perks": 0, "real_benefits": -1, "priorities": 0}, "nope": {"lifestyle_perks": -2, "real_benefits": 3, "priorities": 3}, "toxic": {"lifestyle_perks": -3, "real_benefits": 4, "priorities": 4}}'),

-- Leadership & Management
('leadership', 'situation', 'Your manager takes credit for your ideas in meetings with senior leadership', 'This has happened multiple times', '🎭',
'{"love": {"loyalty": -4, "recognition": -4, "hierarchy": 3}, "good": {"loyalty": -2, "recognition": -2, "hierarchy": 1}, "meh": {"loyalty": -1, "recognition": -1, "hierarchy": 0}, "nope": {"loyalty": 2, "recognition": 3, "hierarchy": -2}, "toxic": {"loyalty": -3, "recognition": 4, "hierarchy": -4}}'),

('leadership', 'style', 'Manager tracks your bathroom breaks and questions any absence over 5 minutes', 'Remote work monitoring software sends them alerts', '⏱️',
'{"love": {"micromanagement": 4, "trust": -4, "autonomy": -4}, "good": {"micromanagement": 2, "trust": -2, "autonomy": -2}, "meh": {"micromanagement": 1, "trust": -1, "autonomy": -1}, "nope": {"micromanagement": -3, "trust": 3, "autonomy": 3}, "toxic": {"micromanagement": -4, "trust": 4, "autonomy": 4}}'),

-- Growth & Development
('growth', 'opportunity', 'Company offers "stretch assignments" (extra work) instead of promotions', 'To "prove you''re ready for the next level"', '🪜',
'{"love": {"growth_opportunity": 2, "fair_compensation": -3, "exploitation": -2}, "good": {"growth_opportunity": 1, "fair_compensation": -1, "exploitation": 0}, "meh": {"growth_opportunity": 0, "fair_compensation": 0, "exploitation": 0}, "nope": {"growth_opportunity": -2, "fair_compensation": 3, "exploitation": 2}, "toxic": {"growth_opportunity": -3, "fair_compensation": 4, "exploitation": 4}}'),

('growth', 'learning', '$500 learning budget but only for "business-critical skills" pre-approved by 3 managers', 'Process takes 2-3 months', '📖',
'{"love": {"learning_support": -2, "bureaucracy": 3, "control": 2}, "good": {"learning_support": 0, "bureaucracy": 1, "control": 1}, "meh": {"learning_support": 0, "bureaucracy": 0, "control": 0}, "nope": {"learning_support": 2, "bureaucracy": -2, "control": -2}, "toxic": {"learning_support": 3, "bureaucracy": -4, "control": -3}}'),

-- Diversity & Inclusion
('diversity', 'observation', 'All-hands meeting: 15 white men on stage talking about "embracing diversity"', 'While diverse employees watch from the audience', '🎤',
'{"love": {"diversity_actions": -4, "authenticity": -4, "representation": -3}, "good": {"diversity_actions": -2, "authenticity": -2, "representation": -1}, "meh": {"diversity_actions": -1, "authenticity": -1, "representation": 0}, "nope": {"diversity_actions": 3, "authenticity": 3, "representation": 3}, "toxic": {"diversity_actions": 4, "authenticity": 4, "representation": 4}}'),

('diversity', 'policy', 'Company celebrates Pride Month with rainbow logo but donates to anti-LGBTQ+ politicians', 'You found this in public donation records', '🏳️‍🌈',
'{"love": {"values_alignment": -4, "corporate_hypocrisy": 4, "authenticity": -4}, "good": {"values_alignment": -2, "corporate_hypocrisy": 2, "authenticity": -2}, "meh": {"values_alignment": -1, "corporate_hypocrisy": 1, "authenticity": -1}, "nope": {"values_alignment": 3, "corporate_hypocrisy": -3, "authenticity": 3}, "toxic": {"values_alignment": 4, "corporate_hypocrisy": -4, "authenticity": 4}}'),

-- Communication Style
('communication', 'meeting', 'Weekly 2-hour "syncs" where only managers talk and no decisions are made', 'Could have been an email', '📧',
'{"love": {"meeting_culture": 3, "efficiency": -3, "hierarchy": 2}, "good": {"meeting_culture": 1, "efficiency": -1, "hierarchy": 1}, "meh": {"meeting_culture": 0, "efficiency": 0, "hierarchy": 0}, "nope": {"meeting_culture": -2, "efficiency": 3, "hierarchy": -1}, "toxic": {"meeting_culture": -3, "efficiency": 4, "hierarchy": -2}}'),

('communication', 'feedback', 'Annual performance reviews with no feedback throughout the year', 'Then surprised by "areas for improvement"', '📋',
'{"love": {"structured_process": 2, "continuous_feedback": -3, "transparency": -2}, "good": {"structured_process": 1, "continuous_feedback": -1, "transparency": -1}, "meh": {"structured_process": 0, "continuous_feedback": 0, "transparency": 0}, "nope": {"structured_process": -1, "continuous_feedback": 3, "transparency": 2}, "toxic": {"structured_process": -2, "continuous_feedback": 4, "transparency": 3}}');