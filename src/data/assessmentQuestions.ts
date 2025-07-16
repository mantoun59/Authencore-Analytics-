export interface CareerCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  salaryRange: string;
  growth: string;
  skills: string[];
}

export interface SkillsChallenge {
  id: string;
  type: 'problem_solving' | 'creative_thinking' | 'communication' | 'analytical';
  title: string;
  description: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  scoring: any;
}

export interface WorkScenario {
  id: string;
  title: string;
  setup: string;
  options: Array<{
    id: string;
    text: string;
    scores: Record<string, number>;
  }>;
}

export interface RapidFireQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  dimension: string;
}

export const careerCards: CareerCard[] = [
  {
    id: 'ci_001',
    title: 'Data Scientist',
    description: 'Uncover insights from complex data to drive business decisions',
    tags: ['Analytics', 'Tech', 'Problem-Solving'],
    category: 'stem',
    salaryRange: '$75,000 - $120,000',
    growth: 'Very High',
    skills: ['Python', 'Statistics', 'Machine Learning', 'SQL']
  },
  {
    id: 'ci_002',
    title: 'UX Designer',
    description: 'Create intuitive and beautiful user experiences',
    tags: ['Creative', 'Tech', 'User-Focused'],
    category: 'creative_tech',
    salaryRange: '$65,000 - $95,000',
    growth: 'High',
    skills: ['Design Thinking', 'Prototyping', 'User Research', 'Figma']
  },
  {
    id: 'ci_003',
    title: 'Sustainability Consultant',
    description: 'Help organizations reduce their environmental impact',
    tags: ['Environment', 'Strategy', 'Impact'],
    category: 'social_impact',
    salaryRange: '$55,000 - $85,000',
    growth: 'High',
    skills: ['Environmental Science', 'Project Management', 'Analysis', 'Communication']
  },
  {
    id: 'ci_004',
    title: 'Digital Marketing Specialist',
    description: 'Build brand presence across digital channels',
    tags: ['Creative', 'Analytics', 'Communication'],
    category: 'business',
    salaryRange: '$45,000 - $75,000',
    growth: 'High',
    skills: ['SEO', 'Social Media', 'Analytics', 'Content Creation']
  },
  {
    id: 'ci_005',
    title: 'Healthcare Technology Specialist',
    description: 'Bridge the gap between healthcare and technology',
    tags: ['Healthcare', 'Tech', 'Innovation'],
    category: 'healthcare_tech',
    salaryRange: '$70,000 - $110,000',
    growth: 'Very High',
    skills: ['Healthcare Systems', 'Technology', 'Compliance', 'Training']
  },
  {
    id: 'ci_006',
    title: 'Product Manager',
    description: 'Guide products from conception to launch',
    tags: ['Strategy', 'Leadership', 'Innovation'],
    category: 'business',
    salaryRange: '$85,000 - $130,000',
    growth: 'Very High',
    skills: ['Product Strategy', 'Analytics', 'Leadership', 'Communication']
  },
  {
    id: 'ci_007',
    title: 'AI Research Scientist',
    description: 'Develop cutting-edge artificial intelligence systems',
    tags: ['Research', 'Tech', 'Innovation'],
    category: 'stem',
    salaryRange: '$95,000 - $160,000',
    growth: 'Exceptional',
    skills: ['Machine Learning', 'Research', 'Programming', 'Mathematics']
  },
  {
    id: 'ci_008',
    title: 'Social Media Manager',
    description: 'Build communities and engagement online',
    tags: ['Creative', 'Communication', 'Marketing'],
    category: 'business',
    salaryRange: '$40,000 - $65,000',
    growth: 'Medium',
    skills: ['Content Creation', 'Community Management', 'Analytics', 'Creativity']
  },
  {
    id: 'ci_009',
    title: 'Cybersecurity Analyst',
    description: 'Protect organizations from digital threats',
    tags: ['Security', 'Tech', 'Problem-Solving'],
    category: 'stem',
    salaryRange: '$70,000 - $105,000',
    growth: 'Very High',
    skills: ['Security Protocols', 'Risk Assessment', 'Technical Analysis', 'Problem Solving']
  },
  {
    id: 'ci_010',
    title: 'Environmental Engineer',
    description: 'Design solutions for environmental problems',
    tags: ['Environment', 'Engineering', 'Impact'],
    category: 'stem',
    salaryRange: '$65,000 - $95,000',
    growth: 'High',
    skills: ['Engineering', 'Environmental Science', 'Project Management', 'Analysis']
  },
  {
    id: 'ci_011',
    title: 'Financial Analyst',
    description: 'Analyze financial data to guide business decisions',
    tags: ['Finance', 'Analytics', 'Strategy'],
    category: 'business',
    salaryRange: '$60,000 - $85,000',
    growth: 'Medium',
    skills: ['Financial Modeling', 'Excel', 'Analysis', 'Communication']
  },
  {
    id: 'ci_012',
    title: 'Graphic Designer',
    description: 'Create visual content for brands and media',
    tags: ['Creative', 'Visual', 'Brand'],
    category: 'creative',
    salaryRange: '$40,000 - $65,000',
    growth: 'Medium',
    skills: ['Adobe Creative Suite', 'Typography', 'Branding', 'Creativity']
  }
];

export const skillsChallenges: SkillsChallenge[] = [
  {
    id: 'sc_001',
    type: 'problem_solving',
    title: 'The Budget Allocation Challenge',
    description: 'You have $100,000 to allocate across 5 departments. Each has different ROI rates and strategic importance.',
    timeLimit: 180,
    difficulty: 'medium',
    scoring: {
      departments: [
        { name: 'Technology', optimalRange: [35000, 45000], roi: 40, strategic: 5 },
        { name: 'Marketing', optimalRange: [25000, 35000], roi: 30, strategic: 4 },
        { name: 'R&D', optimalRange: [15000, 25000], roi: 50, strategic: 5 },
        { name: 'Operations', optimalRange: [10000, 20000], roi: 15, strategic: 3 },
        { name: 'HR', optimalRange: [5000, 15000], roi: 10, strategic: 3 }
      ]
    }
  },
  {
    id: 'sc_002',
    type: 'creative_thinking',
    title: 'Innovation Sprint: Alternative Uses',
    description: 'Generate as many creative uses as possible for a paperclip in 90 seconds',
    timeLimit: 90,
    difficulty: 'easy',
    scoring: {
      fluencyBaseline: 8,
      originalityBaseline: 3,
      elaborationBaseline: 2,
      commonUses: ['hold papers', 'pick lock', 'clean ears', 'reset device', 'bookmark']
    }
  },
  {
    id: 'sc_003',
    type: 'communication',
    title: 'Professional Communication Challenge',
    description: 'Rewrite this customer complaint email to be professional yet assertive',
    timeLimit: 120,
    difficulty: 'medium',
    scoring: {
      originalText: "This is absolutely unacceptable! I've been waiting for 3 weeks and no one has bothered to respond to my emails or calls. This is the worst customer service I've ever experienced!",
      keywords: ['apologize', 'understand', 'resolve', 'timeline', 'follow-up', 'appreciate', 'concern'],
      avoidWords: ['absolutely', 'never', 'worst', 'unacceptable']
    }
  },
  {
    id: 'sc_004',
    type: 'analytical',
    title: 'Data Pattern Recognition',
    description: 'Analyze the sales data and identify the key trends and recommendations',
    timeLimit: 150,
    difficulty: 'hard',
    scoring: {
      dataset: [
        { month: 'Jan', sales: 45000, region: 'North' },
        { month: 'Feb', sales: 52000, region: 'North' },
        { month: 'Mar', sales: 48000, region: 'North' },
        { month: 'Jan', sales: 38000, region: 'South' },
        { month: 'Feb', sales: 41000, region: 'South' },
        { month: 'Mar', sales: 44000, region: 'South' }
      ],
      expectedInsights: ['seasonal_trend', 'regional_difference', 'growth_rate', 'recommendations']
    }
  }
];

export const workScenarios: WorkScenario[] = [
  {
    id: 'ws_001',
    title: 'The Competing Deadlines Dilemma',
    setup: 'Your manager assigns you a high-priority project due in 2 days, but you already have 3 other critical deadlines this week. How do you handle this situation?',
    options: [
      {
        id: 'A',
        text: 'Accept it immediately without question to show you\'re a team player',
        scores: { adaptability: 2, communication: 0, self_management: -1, stress_management: -2 }
      },
      {
        id: 'B',
        text: 'Discuss your current workload with your manager and negotiate priorities',
        scores: { adaptability: 4, communication: 5, self_management: 4, stress_management: 3 }
      },
      {
        id: 'C',
        text: 'Delegate some of your current work to focus on the new priority',
        scores: { adaptability: 3, communication: 2, self_management: 3, stress_management: 2 }
      },
      {
        id: 'D',
        text: 'Work overtime and weekends to complete everything',
        scores: { adaptability: 1, communication: 0, self_management: 1, stress_management: -1 }
      }
    ]
  },
  {
    id: 'ws_002',
    title: 'The Team Conflict Resolution',
    setup: 'During a crucial team meeting, two colleagues get into a heated argument about project direction, making everyone uncomfortable. What\'s your approach?',
    options: [
      {
        id: 'A',
        text: 'Stay quiet and let them work it out themselves',
        scores: { leadership: 0, communication: 0, emotional_intelligence: 1, conflict_resolution: 0 }
      },
      {
        id: 'B',
        text: 'Suggest a 5-minute break and then facilitate a constructive discussion',
        scores: { leadership: 4, communication: 4, emotional_intelligence: 5, conflict_resolution: 5 }
      },
      {
        id: 'C',
        text: 'Take a side to help resolve the issue faster',
        scores: { leadership: 1, communication: 1, emotional_intelligence: 0, conflict_resolution: -1 }
      },
      {
        id: 'D',
        text: 'Redirect everyone\'s attention back to the meeting agenda',
        scores: { leadership: 3, communication: 3, emotional_intelligence: 2, conflict_resolution: 2 }
      }
    ]
  },
  {
    id: 'ws_003',
    title: 'The Innovation Opportunity',
    setup: 'You notice a process inefficiency that could save the company significant time and money. However, implementing your solution would disrupt established workflows. What do you do?',
    options: [
      {
        id: 'A',
        text: 'Keep the idea to yourself to avoid causing disruption',
        scores: { innovation: 0, initiative: 0, change_management: 0, business_acumen: 0 }
      },
      {
        id: 'B',
        text: 'Research the idea thoroughly and present a detailed proposal with implementation plan',
        scores: { innovation: 5, initiative: 5, change_management: 4, business_acumen: 5 }
      },
      {
        id: 'C',
        text: 'Informally mention it to your supervisor and let them decide',
        scores: { innovation: 3, initiative: 2, change_management: 2, business_acumen: 2 }
      },
      {
        id: 'D',
        text: 'Start implementing small changes within your own work area first',
        scores: { innovation: 4, initiative: 4, change_management: 3, business_acumen: 3 }
      }
    ]
  },
  {
    id: 'ws_004',
    title: 'The Client Relationship Challenge',
    setup: 'A long-term client is consistently late with payments and demanding additional services beyond the agreed scope. Your company values this relationship. How do you address this?',
    options: [
      {
        id: 'A',
        text: 'Continue providing extra services to maintain the relationship',
        scores: { client_relations: 2, assertiveness: 0, business_acumen: -1, problem_solving: 1 }
      },
      {
        id: 'B',
        text: 'Schedule a professional meeting to discuss boundaries and payment terms',
        scores: { client_relations: 5, assertiveness: 4, business_acumen: 5, problem_solving: 4 }
      },
      {
        id: 'C',
        text: 'Escalate the issue to senior management immediately',
        scores: { client_relations: 1, assertiveness: 2, business_acumen: 2, problem_solving: 2 }
      },
      {
        id: 'D',
        text: 'Document everything but avoid confrontation',
        scores: { client_relations: 2, assertiveness: 1, business_acumen: 3, problem_solving: 2 }
      }
    ]
  },
  {
    id: 'ws_005',
    title: 'The Learning Curve Challenge',
    setup: 'You\'re assigned to lead a project requiring skills you don\'t yet possess. The deadline is tight and the project is visible to senior leadership. What\'s your strategy?',
    options: [
      {
        id: 'A',
        text: 'Ask to be reassigned to someone more qualified',
        scores: { growth_mindset: 0, resilience: 0, leadership: 0, self_confidence: -1 }
      },
      {
        id: 'B',
        text: 'Accept the challenge and create a rapid learning plan while identifying expert mentors',
        scores: { growth_mindset: 5, resilience: 4, leadership: 4, self_confidence: 4 }
      },
      {
        id: 'C',
        text: 'Accept but immediately hire external consultants to handle the technical aspects',
        scores: { growth_mindset: 2, resilience: 2, leadership: 3, self_confidence: 2 }
      },
      {
        id: 'D',
        text: 'Accept but request a deadline extension to allow for proper learning',
        scores: { growth_mindset: 3, resilience: 3, leadership: 2, self_confidence: 3 }
      }
    ]
  }
];

export const rapidFireQuestions: RapidFireQuestion[] = [
  { id: 'rf_001', question: 'Work alone or in teams?', optionA: 'Alone - I focus better', optionB: 'Teams - I love collaboration', dimension: 'collaboration_preference' },
  { id: 'rf_002', question: 'Detailed plan or figure it out as you go?', optionA: 'Detailed plan always', optionB: 'Adapt as I go', dimension: 'planning_style' },
  { id: 'rf_003', question: 'Lead the project or support the leader?', optionA: 'Lead the way', optionB: 'Support role', dimension: 'leadership_preference' },
  { id: 'rf_004', question: 'Morning person or night owl?', optionA: 'Early bird gets the worm', optionB: 'Night owl productivity', dimension: 'energy_pattern' },
  { id: 'rf_005', question: 'Big picture or details?', optionA: 'See the forest', optionB: 'Focus on trees', dimension: 'thinking_style' },
  { id: 'rf_006', question: 'Take risks or play it safe?', optionA: 'Fortune favors the bold', optionB: 'Better safe than sorry', dimension: 'risk_tolerance' },
  { id: 'rf_007', question: 'Give feedback directly or diplomatically?', optionA: 'Straight to the point', optionB: 'Gentle and tactful', dimension: 'communication_style' },
  { id: 'rf_008', question: 'Structured routine or flexible schedule?', optionA: 'Love my routine', optionB: 'Go with the flow', dimension: 'structure_preference' },
  { id: 'rf_009', question: 'Compete or collaborate?', optionA: 'Healthy competition drives me', optionB: 'Together we achieve more', dimension: 'motivation_style' },
  { id: 'rf_010', question: 'Innovation or improvement?', optionA: 'Create something new', optionB: 'Perfect what exists', dimension: 'innovation_style' },
  { id: 'rf_011', question: 'Quick decisions or thorough analysis?', optionA: 'Trust my gut', optionB: 'Analyze all options', dimension: 'decision_making' },
  { id: 'rf_012', question: 'Specialize deeply or learn broadly?', optionA: 'Master one domain', optionB: 'Jack of all trades', dimension: 'learning_style' },
  { id: 'rf_013', question: 'Work under pressure or steady pace?', optionA: 'Thrive under pressure', optionB: 'Prefer steady progress', dimension: 'pressure_response' },
  { id: 'rf_014', question: 'Public recognition or private satisfaction?', optionA: 'Love the spotlight', optionB: 'Personal fulfillment', dimension: 'recognition_preference' },
  { id: 'rf_015', question: 'Start new projects or finish existing ones?', optionA: 'New beginnings excite me', optionB: 'Completion satisfies me', dimension: 'project_preference' },
  { id: 'rf_016', question: 'Traditional methods or cutting-edge approaches?', optionA: 'Proven methods work', optionB: 'Latest and greatest', dimension: 'change_adoption' },
  { id: 'rf_017', question: 'Work from office or remotely?', optionA: 'Office energy motivates me', optionB: 'Remote flexibility preferred', dimension: 'work_environment' },
  { id: 'rf_018', question: 'Teach others or learn from others?', optionA: 'Love sharing knowledge', optionB: 'Always learning', dimension: 'knowledge_sharing' },
  { id: 'rf_019', question: 'Small startup or large corporation?', optionA: 'Startup energy and impact', optionB: 'Corporate stability and resources', dimension: 'company_size_preference' },
  { id: 'rf_020', question: 'Process oriented or results oriented?', optionA: 'How we do it matters', optionB: 'Results are everything', dimension: 'focus_orientation' }
];

export const futureQuestMilestones = [
  { id: 'fm_001', title: 'Complete First Internship', category: 'experience', description: 'Gain real-world work experience', years: [1] },
  { id: 'fm_002', title: 'Graduate with Bachelor\'s Degree', category: 'education', description: 'Complete undergraduate studies', years: [2, 3, 4] },
  { id: 'fm_003', title: 'Land First Full-Time Job', category: 'career', description: 'Secure entry-level position', years: [2, 3, 4] },
  { id: 'fm_004', title: 'Get Professional Certification', category: 'skills', description: 'Earn industry-recognized credential', years: [2, 3, 4, 5] },
  { id: 'fm_005', title: 'Lead a Team/Project', category: 'leadership', description: 'Take on leadership responsibilities', years: [3, 4, 5] },
  { id: 'fm_006', title: 'Earn Graduate Degree/MBA', category: 'education', description: 'Pursue advanced education', years: [4, 5, 6, 7] },
  { id: 'fm_007', title: 'Switch Career Fields', category: 'career', description: 'Pivot to new industry/role', years: [3, 4, 5, 6] },
  { id: 'fm_008', title: 'Start Own Business', category: 'entrepreneurship', description: 'Launch startup or consultancy', years: [5, 6, 7, 8] },
  { id: 'fm_009', title: 'Mentor Junior Professionals', category: 'giving_back', description: 'Guide others in their careers', years: [5, 6, 7, 8] },
  { id: 'fm_010', title: 'Become Industry Expert', category: 'expertise', description: 'Recognized thought leader', years: [7, 8, 9, 10] },
  { id: 'fm_011', title: 'Publish Book/Research', category: 'thought_leadership', description: 'Share knowledge through writing', years: [8, 9, 10] },
  { id: 'fm_012', title: 'Achieve Work-Life Balance', category: 'personal', description: 'Sustainable lifestyle integration', years: [3, 4, 5, 6, 7] },
  { id: 'fm_013', title: 'Reach Six-Figure Salary', category: 'financial', description: 'Achieve financial milestone', years: [5, 6, 7, 8] },
  { id: 'fm_014', title: 'International Work Experience', category: 'global', description: 'Work abroad or with global teams', years: [4, 5, 6, 7] },
  { id: 'fm_015', title: 'Launch Innovation/Patent', category: 'innovation', description: 'Create something new and valuable', years: [6, 7, 8, 9, 10] }
];