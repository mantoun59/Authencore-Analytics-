-- Insert sample skills taxonomy data
INSERT INTO public.skills_taxonomy (skill_name, skill_category, current_demand_score, future_demand_score, growth_trajectory, industry_relevance, related_skills, skill_type, description, emergence_timeline) VALUES
('Artificial Intelligence', 'Technology', 85, 95, 25, '{"technology": 95, "healthcare": 80, "finance": 85}', '{"Machine Learning", "Data Science", "Python"}', 'technical', 'Core AI technologies and methodologies', 'current'),
('Machine Learning', 'Technology', 80, 90, 30, '{"technology": 90, "healthcare": 75, "finance": 80}', '{"Artificial Intelligence", "Data Science", "Statistics"}', 'technical', 'ML algorithms and model development', 'current'),
('Quantum Computing', 'Technology', 15, 70, 400, '{"technology": 85, "research": 95, "defense": 75}', '{"Physics", "Mathematics", "Computer Science"}', 'technical', 'Quantum algorithms and systems', 'emerging'),
('Prompt Engineering', 'Technology', 70, 85, 35, '{"technology": 90, "marketing": 60, "content": 75}', '{"Artificial Intelligence", "Natural Language Processing"}', 'technical', 'AI prompt optimization and design', 'current'),
('Emotional Intelligence', 'Soft Skills', 75, 85, 20, '{"management": 90, "healthcare": 85, "education": 95}', '{"Leadership", "Communication", "Empathy"}', 'soft', 'Understanding and managing emotions', 'current'),
('Systems Thinking', 'Cognitive', 65, 80, 35, '{"management": 85, "engineering": 80, "consulting": 90}', '{"Problem Solving", "Strategic Planning"}', 'cognitive', 'Holistic approach to complex problems', 'current'),
('Blockchain Development', 'Technology', 45, 65, 50, '{"fintech": 85, "supply_chain": 70, "gaming": 60}', '{"Cryptography", "Distributed Systems"}', 'technical', 'Blockchain and DeFi technologies', 'current'),
('Virtual Reality Design', 'Technology', 35, 75, 120, '{"gaming": 90, "education": 70, "healthcare": 65}', '{"3D Modeling", "User Experience", "Programming"}', 'technical', 'VR/AR interface and experience design', 'emerging'),
('Data Privacy Engineering', 'Technology', 60, 85, 45, '{"technology": 85, "healthcare": 90, "finance": 95}', '{"Cybersecurity", "Legal Compliance", "Data Science"}', 'technical', 'Privacy-preserving data systems', 'current'),
('Climate Technology', 'Sustainability', 55, 90, 85, '{"energy": 95, "manufacturing": 80, "agriculture": 75}', '{"Engineering", "Data Analysis", "Policy"}', 'technical', 'Clean technology and sustainability solutions', 'emerging')
ON CONFLICT (skill_name) DO NOTHING;

-- Insert sample industry trends
INSERT INTO public.industry_skills_trends (industry_name, trending_skills, declining_skills, emerging_technologies, skill_demand_forecast, data_collection_date, forecast_horizon) VALUES
('Technology', '{"AI/ML": 95, "Cloud Computing": 90, "Cybersecurity": 88, "Data Science": 85}', '{"Legacy Systems": 25, "Manual Testing": 35, "Waterfall PM": 30}', '{"Quantum Computing": 85, "Edge AI": 80, "Web3": 75}', '{"AI/ML": {"2024": 85, "2025": 92, "2026": 98}, "Cybersecurity": {"2024": 88, "2025": 91, "2026": 95}}', CURRENT_DATE, 36),
('Healthcare', '{"Digital Health": 90, "AI Diagnostics": 85, "Telemedicine": 80, "Genomics": 75}', '{"Paper Records": 15, "Manual Scheduling": 25}', '{"Precision Medicine": 90, "Digital Therapeutics": 85}', '{"Digital Health": {"2024": 80, "2025": 88, "2026": 95}, "AI Diagnostics": {"2024": 70, "2025": 82, "2026": 90}}', CURRENT_DATE, 36),
('Finance', '{"FinTech": 90, "Blockchain": 75, "RegTech": 80, "Digital Banking": 85}', '{"Manual Processing": 20, "Legacy Banking": 30}', '{"DeFi": 70, "Central Bank Digital Currencies": 85}', '{"FinTech": {"2024": 85, "2025": 90, "2026": 95}, "Blockchain": {"2024": 60, "2025": 75, "2026": 85}}', CURRENT_DATE, 36)
ON CONFLICT (industry_name) DO NOTHING;

-- Insert sample assessment mappings
INSERT INTO public.assessment_skills_mapping (assessment_type, assessment_dimension, mapped_skills, skill_weights, prediction_relevance, mapping_confidence) VALUES
('career-launch', 'analytical_thinking', '{"Data Science", "Problem Solving", "Critical Thinking"}', '{"Data Science": 0.4, "Problem Solving": 0.35, "Critical Thinking": 0.25}', 0.85, 0.90),
('career-launch', 'creativity', '{"Innovation", "Design Thinking", "Creative Problem Solving"}', '{"Innovation": 0.4, "Design Thinking": 0.35, "Creative Problem Solving": 0.25}', 0.80, 0.85),
('communication', 'digital_communication', '{"Digital Marketing", "Social Media", "Content Creation"}', '{"Digital Marketing": 0.4, "Social Media": 0.3, "Content Creation": 0.3}', 0.75, 0.80),
('emotional-intelligence', 'self_awareness', '{"Emotional Intelligence", "Self Management", "Leadership"}', '{"Emotional Intelligence": 0.5, "Self Management": 0.3, "Leadership": 0.2}', 0.90, 0.95);