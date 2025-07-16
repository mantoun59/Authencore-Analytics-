export interface GenZScenario {
  id: string;
  category: string;
  text: string;
  type: 'basic' | 'chat_simulation';
  messages?: Array<{
    user: string;
    text: string;
    time: string;
  }>;
  responses: {
    love: { [key: string]: number };
    good: { [key: string]: number };
    neutral: { [key: string]: number };
    bad: { [key: string]: number };
    toxic: { [key: string]: number };
  };
}

export interface GenZValue {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface CollaborationScenario {
  id: string;
  title: string;
  your_role: string;
  messages: Array<{
    user: string;
    text: string;
    time: string;
  }>;
  response_options: Array<{
    id: string;
    text: string;
    scores: { [key: string]: number };
  }>;
}

export const genZScenarios: GenZScenario[] = [
  {
    id: 'gz001',
    category: 'work_style',
    text: 'Your manager wants you to work from the office 5 days a week, no exceptions.',
    type: 'basic',
    responses: {
      love: { flexibility: -5, work_life_balance: -3 },
      good: { flexibility: -2, work_life_balance: -1 },
      neutral: { flexibility: 0, work_life_balance: 0 },
      bad: { flexibility: 3, work_life_balance: 2 },
      toxic: { flexibility: 5, work_life_balance: 4 }
    }
  },
  {
    id: 'gz002',
    category: 'collaboration',
    text: 'Your team uses Slack, but your manager insists on long email chains for everything.',
    type: 'basic',
    responses: {
      love: { digital_native: -3, innovation: -2 },
      good: { digital_native: -1, innovation: -1 },
      neutral: { digital_native: 0, innovation: 0 },
      bad: { digital_native: 2, innovation: 3 },
      toxic: { digital_native: 4, innovation: 5 }
    }
  },
  {
    id: 'gz003',
    category: 'values',
    text: 'Your company talks about diversity but all the leadership is very homogeneous.',
    type: 'basic',
    responses: {
      love: { authenticity: -5, social_impact: -3 },
      good: { authenticity: -2, social_impact: -1 },
      neutral: { authenticity: 0, social_impact: 0 },
      bad: { authenticity: 3, social_impact: 2 },
      toxic: { authenticity: 5, social_impact: 4 }
    }
  },
  {
    id: 'gz004',
    category: 'growth',
    text: 'No learning budget, but they expect you to stay current with industry trends.',
    type: 'basic',
    responses: {
      love: { growth_mindset: -4, purpose_alignment: -2 },
      good: { growth_mindset: -1, purpose_alignment: -1 },
      neutral: { growth_mindset: 0, purpose_alignment: 0 },
      bad: { growth_mindset: 2, purpose_alignment: 3 },
      toxic: { growth_mindset: 4, purpose_alignment: 5 }
    }
  },
  {
    id: 'gz005',
    category: 'communication',
    text: 'Team meeting at 6 AM because "that works for everyone"',
    type: 'chat_simulation',
    messages: [
      { user: 'Sarah (Manager)', text: 'Hi team! New mandatory meeting every day at 6 AM sharp 📅', time: '2:30 PM' },
      { user: 'Mike', text: 'Wait... 6 AM? That\'s pretty early', time: '2:32 PM' },
      { user: 'Sarah (Manager)', text: 'It works for everyone! We need to be more productive', time: '2:33 PM' }
    ],
    responses: {
      love: { work_life_balance: -4, authenticity: -2 },
      good: { work_life_balance: -2, authenticity: -1 },
      neutral: { work_life_balance: 0, authenticity: 0 },
      bad: { work_life_balance: 3, authenticity: 2 },
      toxic: { work_life_balance: 5, authenticity: 4 }
    }
  },
  {
    id: 'gz006',
    category: 'culture',
    text: 'Unlimited PTO policy, but everyone who takes time off gets passive-aggressive comments.',
    type: 'basic',
    responses: {
      love: { authenticity: -5, work_life_balance: -4 },
      good: { authenticity: -2, work_life_balance: -2 },
      neutral: { authenticity: 0, work_life_balance: 0 },
      bad: { authenticity: 3, work_life_balance: 3 },
      toxic: { authenticity: 5, work_life_balance: 5 }
    }
  },
  {
    id: 'gz007',
    category: 'benefits',
    text: 'Company offers meditation app subscription but no mental health days.',
    type: 'basic',
    responses: {
      love: { authenticity: -3, work_life_balance: -2 },
      good: { authenticity: -1, work_life_balance: -1 },
      neutral: { authenticity: 0, work_life_balance: 0 },
      bad: { authenticity: 2, work_life_balance: 3 },
      toxic: { authenticity: 4, work_life_balance: 5 }
    }
  },
  {
    id: 'gz008',
    category: 'feedback',
    text: 'Annual reviews only, no ongoing feedback or career development discussions.',
    type: 'basic',
    responses: {
      love: { growth_mindset: -4, purpose_alignment: -2 },
      good: { growth_mindset: -2, purpose_alignment: -1 },
      neutral: { growth_mindset: 0, purpose_alignment: 0 },
      bad: { growth_mindset: 3, purpose_alignment: 2 },
      toxic: { growth_mindset: 5, purpose_alignment: 4 }
    }
  },
  {
    id: 'gz009',
    category: 'innovation',
    text: 'Still using Windows 95 and insisting "it works fine"',
    type: 'basic',
    responses: {
      love: { digital_native: -5, innovation: -4 },
      good: { digital_native: -2, innovation: -2 },
      neutral: { digital_native: 0, innovation: 0 },
      bad: { digital_native: 3, innovation: 4 },
      toxic: { digital_native: 5, innovation: 5 }
    }
  },
  {
    id: 'gz010',
    category: 'diversity',
    text: 'HR training on inclusion consists of a 10-minute video from 2005.',
    type: 'basic',
    responses: {
      love: { social_impact: -4, authenticity: -3 },
      good: { social_impact: -2, authenticity: -1 },
      neutral: { social_impact: 0, authenticity: 0 },
      bad: { social_impact: 3, authenticity: 2 },
      toxic: { social_impact: 5, authenticity: 4 }
    }
  }
];

export const genZValues: GenZValue[] = [
  {
    id: 'v1',
    title: 'Fair Pay',
    description: 'Transparent, equitable compensation',
    emoji: '💰'
  },
  {
    id: 'v2',
    title: 'Remote First',
    description: 'Work from anywhere flexibility',
    emoji: '🏠'
  },
  {
    id: 'v3',
    title: 'Growth Path',
    description: 'Clear career advancement opportunities',
    emoji: '📈'
  },
  {
    id: 'v4',
    title: 'Learning',
    description: 'Continuous skill development',
    emoji: '📚'
  },
  {
    id: 'v5',
    title: 'Work-Life Balance',
    description: 'Healthy boundaries and well-being',
    emoji: '⚖️'
  },
  {
    id: 'v6',
    title: 'Impact',
    description: 'Meaningful work that matters',
    emoji: '🌟'
  },
  {
    id: 'v7',
    title: 'Innovation',
    description: 'Creative freedom and new ideas',
    emoji: '💡'
  },
  {
    id: 'v8',
    title: 'Team Culture',
    description: 'Collaborative and supportive environment',
    emoji: '🤝'
  },
  {
    id: 'v9',
    title: 'Autonomy',
    description: 'Freedom to work your way',
    emoji: '🦅'
  },
  {
    id: 'v10',
    title: 'Diversity',
    description: 'Inclusive and representative workplace',
    emoji: '🌈'
  },
  {
    id: 'v11',
    title: 'Sustainability',
    description: 'Environmental responsibility',
    emoji: '🌱'
  },
  {
    id: 'v12',
    title: 'Transparency',
    description: 'Open communication and honesty',
    emoji: '🔍'
  },
  {
    id: 'v13',
    title: 'Recognition',
    description: 'Appreciation for your contributions',
    emoji: '🏆'
  },
  {
    id: 'v14',
    title: 'Tech Forward',
    description: 'Modern tools and digital-first approach',
    emoji: '⚡'
  },
  {
    id: 'v15',
    title: 'Mental Health',
    description: 'Psychological safety and support',
    emoji: '🧠'
  }
];

export const collaborationScenarios: CollaborationScenario[] = [
  {
    id: 'collab001',
    title: 'Project Deadline Conflict',
    your_role: 'Team Member',
    messages: [
      { user: 'Alex (PM)', text: 'Hey team, client wants this done by Friday instead of next week', time: '2:15 PM' },
      { user: 'Jordan', text: 'That\'s literally impossible. We planned for 10 days, not 3', time: '2:16 PM' },
      { user: 'Sam', text: 'Maybe we can cut some features?', time: '2:17 PM' },
      { user: 'Alex (PM)', text: 'Client is firm on scope. We need to make it work', time: '2:18 PM' }
    ],
    response_options: [
      {
        id: 'option1',
        text: 'Suggest working extra hours to meet the deadline',
        scores: { work_life_balance: -2, team_player: 3, boundaries: -1 }
      },
      {
        id: 'option2',
        text: 'Push back and explain why the timeline is unrealistic',
        scores: { authenticity: 3, boundaries: 2, team_player: 1 }
      },
      {
        id: 'option3',
        text: 'Offer to help prioritize the most important features',
        scores: { team_player: 2, innovation: 2, quality_focus: 1 }
      },
      {
        id: 'option4',
        text: 'Ask what support/resources we can get to make it happen',
        scores: { team_player: 2, boundaries: 1, innovation: 1 }
      }
    ]
  }
];

export const companyProfiles = [
  {
    id: 'tech_startup',
    name: 'TechStart Inc',
    culture: ['startup', 'flexible', 'innovative'],
    values: ['growth', 'innovation', 'autonomy'],
    tags: ['Remote-first', 'Stock options', 'Fast-paced'],
    matchFactors: {
      flexibility: 0.8,
      innovation: 0.9,
      growth_mindset: 0.85,
      work_life_balance: 0.6
    }
  },
  {
    id: 'green_company',
    name: 'Green Future Co',
    culture: ['mission-driven', 'sustainable', 'collaborative'],
    values: ['impact', 'sustainability', 'transparency'],
    tags: ['B-Corp', 'Hybrid work', '4-day week'],
    matchFactors: {
      social_impact: 0.95,
      authenticity: 0.8,
      work_life_balance: 0.9,
      purpose_alignment: 0.9
    }
  },
  {
    id: 'creative_agency',
    name: 'Digital Studios',
    culture: ['creative', 'flexible', 'diverse'],
    values: ['creativity', 'diversity', 'balance'],
    tags: ['Creative freedom', 'Unlimited PTO', 'Inclusive'],
    matchFactors: {
      innovation: 0.85,
      social_impact: 0.8,
      flexibility: 0.9,
      authenticity: 0.75
    }
  },
  {
    id: 'data_company',
    name: 'NextGen Analytics',
    culture: ['data-driven', 'innovative', 'growth-focused'],
    values: ['learning', 'innovation', 'excellence'],
    tags: ['AI-focused', 'Learning budget', 'Mentorship'],
    matchFactors: {
      growth_mindset: 0.9,
      digital_native: 0.95,
      innovation: 0.85,
      purpose_alignment: 0.7
    }
  },
  {
    id: 'nonprofit',
    name: 'Community Connect',
    culture: ['social-impact', 'collaborative', 'authentic'],
    values: ['impact', 'community', 'authenticity'],
    tags: ['Non-profit', 'Mission-driven', 'Volunteer time'],
    matchFactors: {
      social_impact: 1.0,
      purpose_alignment: 0.95,
      authenticity: 0.9,
      work_life_balance: 0.75
    }
  }
];