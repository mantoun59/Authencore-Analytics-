-- Add remaining 25 scenarios to reach promised 45 questions
INSERT INTO public.genz_assessment_scenarios (category, type, text, context, emoji, responses) VALUES

-- Digital Communication (5 more)
('digital_communication', 'tool', 'Company uses only email and phone calls, no Slack, Teams, or modern tools', 'Says they are "old school" and "professional"', '📠',
'{"love": {"digital_fluency": -4, "efficiency": -3, "modern_tools": -4}, "good": {"digital_fluency": -2, "efficiency": -1, "modern_tools": -2}, "meh": {"digital_fluency": -1, "efficiency": 0, "modern_tools": -1}, "nope": {"digital_fluency": 3, "efficiency": 3, "modern_tools": 3}, "toxic": {"digital_fluency": 4, "efficiency": 4, "modern_tools": 4}}'),

('digital_communication', 'policy', 'All messages must be formal emails with proper salutations, even for quick questions', 'Takes 5 minutes to ask "what time is the meeting?"', '✉️',
'{"love": {"formality": 4, "efficiency": -3, "communication_style": -2}, "good": {"formality": 2, "efficiency": -1, "communication_style": -1}, "meh": {"formality": 1, "efficiency": 0, "communication_style": 0}, "nope": {"formality": -2, "efficiency": 3, "communication_style": 2}, "toxic": {"formality": -4, "efficiency": 4, "communication_style": 3}}'),

('digital_communication', 'meeting', 'Video calls where everyone must have cameras on and sit formally', 'Even for 15-minute check-ins', '🎥',
'{"love": {"video_presence": 3, "formality": 3, "connection": 2}, "good": {"video_presence": 1, "formality": 1, "connection": 1}, "meh": {"video_presence": 0, "formality": 0, "connection": 0}, "nope": {"video_presence": -2, "formality": -2, "connection": -1}, "toxic": {"video_presence": -3, "formality": -3, "connection": -2}}'),

('digital_communication', 'response', 'Expected to respond to all messages within 15 minutes, even after hours', 'Including weekends and vacation', '⚡',
'{"love": {"responsiveness": 3, "boundaries": -4, "availability": 4}, "good": {"responsiveness": 1, "boundaries": -2, "availability": 2}, "meh": {"responsiveness": 0, "boundaries": -1, "availability": 1}, "nope": {"responsiveness": -2, "boundaries": 3, "availability": -2}, "toxic": {"responsiveness": -3, "boundaries": 4, "availability": -4}}'),

('digital_communication', 'platform', 'Company monitors all digital communications for "quality assurance"', 'Including private DMs between coworkers', '🕵️',
'{"love": {"privacy": -4, "oversight": 4, "trust": -3}, "good": {"privacy": -2, "oversight": 2, "trust": -1}, "meh": {"privacy": -1, "oversight": 1, "trust": 0}, "nope": {"privacy": 3, "oversight": -2, "trust": 2}, "toxic": {"privacy": 4, "oversight": -4, "trust": 3}}'),

-- Work-Life Balance (8 more)
('work_life_balance', 'expectation', 'Boss texts you at 11 PM about "quick questions" for tomorrow', 'Happens multiple times per week', '📱',
'{"love": {"availability": 3, "boundaries": -4, "dedication": 2}, "good": {"availability": 1, "boundaries": -2, "dedication": 1}, "meh": {"availability": 0, "boundaries": -1, "dedication": 0}, "nope": {"availability": -2, "boundaries": 3, "dedication": -1}, "toxic": {"availability": -4, "boundaries": 4, "dedication": -2}}'),

('work_life_balance', 'policy', 'Company has "unlimited vacation" but tracks and questions any time off', 'Average employee takes 5 days per year', '🏖️',
'{"love": {"fake_benefits": 2, "time_off": -3, "surveillance": 2}, "good": {"fake_benefits": 1, "time_off": -1, "surveillance": 1}, "meh": {"fake_benefits": 0, "time_off": 0, "surveillance": 0}, "nope": {"fake_benefits": -2, "time_off": 2, "surveillance": -2}, "toxic": {"fake_benefits": -4, "time_off": 4, "surveillance": -3}}'),

('work_life_balance', 'culture', 'Colleagues brag about working 80-hour weeks and "living for the grind"', 'Expected to match their energy', '💪',
'{"love": {"hustle_culture": 4, "work_life_balance": -4, "peer_pressure": 3}, "good": {"hustle_culture": 2, "work_life_balance": -2, "peer_pressure": 1}, "meh": {"hustle_culture": 1, "work_life_balance": -1, "peer_pressure": 0}, "nope": {"hustle_culture": -3, "work_life_balance": 3, "peer_pressure": -2}, "toxic": {"hustle_culture": -4, "work_life_balance": 4, "peer_pressure": -3}}'),

('work_life_balance', 'remote', 'Remote work allowed but expected to be online 7 AM to 9 PM', 'To "show commitment"', '💻',
'{"love": {"remote_work": 2, "time_boundaries": -4, "flexibility": -2}, "good": {"remote_work": 1, "time_boundaries": -2, "flexibility": -1}, "meh": {"remote_work": 0, "time_boundaries": -1, "flexibility": 0}, "nope": {"remote_work": -1, "time_boundaries": 3, "flexibility": 2}, "toxic": {"remote_work": -2, "time_boundaries": 4, "flexibility": 3}}'),

('work_life_balance', 'wellness', 'Company offers meditation app but schedules mandatory overtime', 'Mixed messages about wellness', '🧘',
'{"love": {"wellness_theater": 2, "authenticity": -3, "work_pressure": 1}, "good": {"wellness_theater": 1, "authenticity": -1, "work_pressure": 0}, "meh": {"wellness_theater": 0, "authenticity": 0, "work_pressure": 0}, "nope": {"wellness_theater": -2, "authenticity": 2, "work_pressure": -2}, "toxic": {"wellness_theater": -3, "authenticity": 4, "work_pressure": -3}}'),

('work_life_balance', 'schedule', 'Flexible hours but all meetings scheduled for 8 AM or 6 PM', 'Because "that works for leadership"', '⏰',
'{"love": {"fake_flexibility": 2, "leadership_priority": 3, "accommodation": -2}, "good": {"fake_flexibility": 1, "leadership_priority": 1, "accommodation": -1}, "meh": {"fake_flexibility": 0, "leadership_priority": 0, "accommodation": 0}, "nope": {"fake_flexibility": -2, "leadership_priority": -2, "accommodation": 2}, "toxic": {"fake_flexibility": -3, "leadership_priority": -3, "accommodation": 3}}'),

('work_life_balance', 'mental_health', 'Mental health days allowed but you need to explain your "mental state"', 'To HR in writing', '🧠',
'{"love": {"mental_health_support": -2, "privacy": -3, "bureaucracy": 3}, "good": {"mental_health_support": 0, "privacy": -1, "bureaucracy": 1}, "meh": {"mental_health_support": 0, "privacy": 0, "bureaucracy": 0}, "nope": {"mental_health_support": 2, "privacy": 2, "bureaucracy": -2}, "toxic": {"mental_health_support": 3, "privacy": 4, "bureaucracy": -3}}'),

('work_life_balance', 'boundary', 'Working from coffee shop is "unprofessional" even during personal time', 'Company tracks your location', '📍',
'{"love": {"location_control": 3, "personal_freedom": -4, "professionalism": 3}, "good": {"location_control": 1, "personal_freedom": -2, "professionalism": 1}, "meh": {"location_control": 0, "personal_freedom": -1, "professionalism": 0}, "nope": {"location_control": -2, "personal_freedom": 3, "professionalism": -1}, "toxic": {"location_control": -4, "personal_freedom": 4, "professionalism": -2}}'),

-- Career Expectations (8 more)
('career_expectations', 'growth', 'Promotion requires 5+ years in same role, regardless of performance', 'Company policy for "paying dues"', '🪜',
'{"love": {"traditional_path": 4, "meritocracy": -3, "patience": 3}, "good": {"traditional_path": 2, "meritocracy": -1, "patience": 1}, "meh": {"traditional_path": 1, "meritocracy": 0, "patience": 0}, "nope": {"traditional_path": -2, "meritocracy": 3, "patience": -2}, "toxic": {"traditional_path": -4, "meritocracy": 4, "patience": -3}}'),

('career_expectations', 'skills', 'Training budget exists but only for "legacy systems" and outdated software', 'No budget for modern skills', '💾',
'{"love": {"legacy_focus": 3, "modern_skills": -4, "company_priorities": 2}, "good": {"legacy_focus": 1, "modern_skills": -2, "company_priorities": 1}, "meh": {"legacy_focus": 0, "modern_skills": -1, "company_priorities": 0}, "nope": {"legacy_focus": -2, "modern_skills": 3, "company_priorities": -1}, "toxic": {"legacy_focus": -3, "modern_skills": 4, "company_priorities": -2}}'),

('career_expectations', 'feedback', 'No career development plan, just told to "keep doing what you''re doing"', 'When asking about growth', '🔄',
'{"love": {"status_quo": 3, "career_planning": -4, "guidance": -3}, "good": {"status_quo": 1, "career_planning": -2, "guidance": -1}, "meh": {"status_quo": 0, "career_planning": -1, "guidance": 0}, "nope": {"status_quo": -2, "career_planning": 3, "guidance": 2}, "toxic": {"status_quo": -3, "career_planning": 4, "guidance": 3}}'),

('career_expectations', 'mentorship', 'Mentorship program assigns you someone who retired 10 years ago', 'They don''t understand your field', '👴',
'{"love": {"traditional_wisdom": 3, "relevance": -3, "connection": -1}, "good": {"traditional_wisdom": 1, "relevance": -1, "connection": 0}, "meh": {"traditional_wisdom": 0, "relevance": 0, "connection": 0}, "nope": {"traditional_wisdom": -1, "relevance": 2, "connection": 1}, "toxic": {"traditional_wisdom": -2, "relevance": 4, "connection": 2}}'),

('career_expectations', 'networking', 'All networking events are golf tournaments and wine tastings', 'During work hours, attendance "encouraged"', '⛳',
'{"love": {"traditional_networking": 3, "inclusion": -2, "work_time": 1}, "good": {"traditional_networking": 1, "inclusion": -1, "work_time": 0}, "meh": {"traditional_networking": 0, "inclusion": 0, "work_time": 0}, "nope": {"traditional_networking": -2, "inclusion": 2, "work_time": -1}, "toxic": {"traditional_networking": -3, "inclusion": 3, "work_time": -2}}'),

('career_expectations', 'recognition', 'Employee of the month gets a parking spot closer to the building', 'Only reward for exceptional performance', '🅿️',
'{"love": {"simple_rewards": 2, "recognition_value": -3, "motivation": -1}, "good": {"simple_rewards": 1, "recognition_value": -1, "motivation": 0}, "meh": {"simple_rewards": 0, "recognition_value": 0, "motivation": 0}, "nope": {"simple_rewards": -1, "recognition_value": 2, "motivation": 1}, "toxic": {"simple_rewards": -2, "recognition_value": 4, "motivation": 2}}'),

('career_expectations', 'side_projects', 'Any side projects or freelancing requires written approval from CEO', 'Even personal coding projects', '📝',
'{"love": {"control": 4, "personal_freedom": -4, "trust": -2}, "good": {"control": 2, "personal_freedom": -2, "trust": -1}, "meh": {"control": 1, "personal_freedom": -1, "trust": 0}, "nope": {"control": -2, "personal_freedom": 3, "trust": 2}, "toxic": {"control": -4, "personal_freedom": 4, "trust": 3}}'),

('career_expectations', 'impact', 'Your work directly affects millions but you''re not allowed to mention it externally', 'Company doesn''t want employees getting "big heads"', '🤫',
'{"love": {"humility": 3, "external_recognition": -3, "company_credit": 2}, "good": {"humility": 1, "external_recognition": -1, "company_credit": 1}, "meh": {"humility": 0, "external_recognition": 0, "company_credit": 0}, "nope": {"humility": -1, "external_recognition": 2, "company_credit": -1}, "toxic": {"humility": -2, "external_recognition": 4, "company_credit": -2}}'),

-- Purpose & Values (4 more)
('purpose_values', 'mission', 'Company mission is "maximize shareholder value" with no mention of purpose', 'Posted prominently in lobby', '💰',
'{"love": {"profit_focus": 4, "purpose": -4, "transparency": 2}, "good": {"profit_focus": 2, "purpose": -2, "transparency": 1}, "meh": {"profit_focus": 1, "purpose": -1, "transparency": 0}, "nope": {"profit_focus": -2, "purpose": 3, "transparency": -1}, "toxic": {"profit_focus": -4, "purpose": 4, "transparency": -2}}'),

('purpose_values', 'sustainability', 'Company talks about being green but uses single-use everything', 'Including plastic cups for water', '♻️',
'{"love": {"green_washing": 2, "environmental_care": -3, "authenticity": -2}, "good": {"green_washing": 1, "environmental_care": -1, "authenticity": -1}, "meh": {"green_washing": 0, "environmental_care": 0, "authenticity": 0}, "nope": {"green_washing": -2, "environmental_care": 2, "authenticity": 2}, "toxic": {"green_washing": -3, "environmental_care": 4, "authenticity": 3}}'),

('purpose_values', 'community', 'Mandatory volunteer events during personal time for "team building"', 'Unpaid community service', '🤝',
'{"love": {"community_service": 3, "personal_time": -3, "team_building": 2}, "good": {"community_service": 1, "personal_time": -1, "team_building": 1}, "meh": {"community_service": 0, "personal_time": 0, "team_building": 0}, "nope": {"community_service": -1, "personal_time": 3, "team_building": -1}, "toxic": {"community_service": -2, "personal_time": 4, "team_building": -2}}'),

('purpose_values', 'ethics', 'Company donates to charity but treats employees poorly', 'Great external image, internal issues', '🎭',
'{"love": {"external_image": 3, "internal_culture": -3, "priorities": -2}, "good": {"external_image": 1, "internal_culture": -1, "priorities": -1}, "meh": {"external_image": 0, "internal_culture": 0, "priorities": 0}, "nope": {"external_image": -2, "internal_culture": 2, "priorities": 2}, "toxic": {"external_image": -3, "internal_culture": 4, "priorities": 3}}');