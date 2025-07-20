// Fixed GenZ Assessment data with 45 scenarios for proper assessment length

export interface GenZScenario {
  id: string;
  category: 'work_style' | 'communication' | 'career_values' | 'social_impact' | 'personal_growth' | 'technology';
  text: string;
  context?: string;
  type?: string;
  messages?: Array<{ user: string; time: string; text: string }>;
  reactions: {
    love: { [key: string]: number };
    good: { [key: string]: number };
    neutral: { [key: string]: number };
    bad: { [key: string]: number };
    toxic: { [key: string]: number };
  };
}

export interface GenZValue {
  id: string;
  text: string;
  category: string;
  scores: { [key: string]: number };
}

export const genZScenarios: GenZScenario[] = [
  // WORK STYLE SCENARIOS (15 scenarios)
  {
    id: 'gz001',
    category: 'work_style',
    text: 'Your manager wants you to work from the office 5 days a week, no exceptions.',
    reactions: {
      love: { flexibility: -2, autonomy: -2, workplace_culture: -1 },
      good: { flexibility: -1, autonomy: -1, workplace_culture: 0 },
      neutral: { flexibility: 0, autonomy: 0, workplace_culture: 0 },
      bad: { flexibility: 1, autonomy: 1, workplace_culture: 1 },
      toxic: { flexibility: 2, autonomy: 2, workplace_culture: 2 }
    }
  },
  {
    id: 'gz002',
    category: 'work_style',
    text: 'Your company offers unlimited PTO but has an unspoken culture of never taking time off.',
    reactions: {
      love: { authenticity: -2, mental_health: -2, trust: -2 },
      good: { authenticity: -1, mental_health: -1, trust: -1 },
      neutral: { authenticity: 0, mental_health: 0, trust: 0 },
      bad: { authenticity: 1, mental_health: 1, trust: 1 },
      toxic: { authenticity: 2, mental_health: 2, trust: 2 }
    }
  },
  {
    id: 'gz003',
    category: 'work_style',
    text: 'You can set your own schedule as long as you deliver results.',
    reactions: {
      love: { flexibility: 2, autonomy: 2, trust: 1 },
      good: { flexibility: 1, autonomy: 1, trust: 1 },
      neutral: { flexibility: 0, autonomy: 0, trust: 0 },
      bad: { flexibility: -1, autonomy: -1, trust: 0 },
      toxic: { flexibility: -2, autonomy: -2, trust: -1 }
    }
  },
  {
    id: 'gz004',
    category: 'work_style',
    text: 'Your workplace has mandatory fun activities and team bonding events.',
    reactions: {
      love: { authenticity: -1, autonomy: -1, workplace_culture: 0 },
      good: { authenticity: 0, autonomy: 0, workplace_culture: 1 },
      neutral: { authenticity: 0, autonomy: 0, workplace_culture: 0 },
      bad: { authenticity: 1, autonomy: 1, workplace_culture: -1 },
      toxic: { authenticity: 2, autonomy: 2, workplace_culture: -2 }
    }
  },
  {
    id: 'gz005',
    category: 'work_style',
    text: 'Your company tracks your every keystroke and website visit.',
    reactions: {
      love: { privacy: -2, trust: -2, autonomy: -2 },
      good: { privacy: -1, trust: -1, autonomy: -1 },
      neutral: { privacy: 0, trust: 0, autonomy: 0 },
      bad: { privacy: 1, trust: 1, autonomy: 1 },
      toxic: { privacy: 2, trust: 2, autonomy: 2 }
    }
  },
  {
    id: 'gz006',
    category: 'work_style',
    text: 'You can work from anywhere in the world as long as you maintain productivity.',
    reactions: {
      love: { flexibility: 2, autonomy: 2, global_perspective: 1 },
      good: { flexibility: 1, autonomy: 1, global_perspective: 1 },
      neutral: { flexibility: 0, autonomy: 0, global_perspective: 0 },
      bad: { flexibility: -1, autonomy: -1, global_perspective: 0 },
      toxic: { flexibility: -2, autonomy: -2, global_perspective: -1 }
    }
  },
  {
    id: 'gz007',
    category: 'work_style',
    text: 'Your manager micromanages every detail of your work process.',
    reactions: {
      love: { autonomy: -2, trust: -2, creativity: -1 },
      good: { autonomy: -1, trust: -1, creativity: 0 },
      neutral: { autonomy: 0, trust: 0, creativity: 0 },
      bad: { autonomy: 1, trust: 1, creativity: 1 },
      toxic: { autonomy: 2, trust: 2, creativity: 2 }
    }
  },
  {
    id: 'gz008',
    category: 'work_style',
    text: 'Your company has a 4-day work week with compressed hours.',
    reactions: {
      love: { work_life_balance: 2, mental_health: 1, flexibility: 1 },
      good: { work_life_balance: 1, mental_health: 1, flexibility: 1 },
      neutral: { work_life_balance: 0, mental_health: 0, flexibility: 0 },
      bad: { work_life_balance: -1, mental_health: 0, flexibility: -1 },
      toxic: { work_life_balance: -2, mental_health: -1, flexibility: -2 }
    }
  },
  {
    id: 'gz009',
    category: 'work_style',
    text: 'You have to be available for calls and emails 24/7.',
    reactions: {
      love: { work_life_balance: -2, mental_health: -2, boundaries: -2 },
      good: { work_life_balance: -1, mental_health: -1, boundaries: -1 },
      neutral: { work_life_balance: 0, mental_health: 0, boundaries: 0 },
      bad: { work_life_balance: 1, mental_health: 1, boundaries: 1 },
      toxic: { work_life_balance: 2, mental_health: 2, boundaries: 2 }
    }
  },
  {
    id: 'gz010',
    category: 'work_style',
    text: 'Your workplace encourages experimentation and allows failure as learning.',
    reactions: {
      love: { innovation: 2, psychological_safety: 2, growth: 1 },
      good: { innovation: 1, psychological_safety: 1, growth: 1 },
      neutral: { innovation: 0, psychological_safety: 0, growth: 0 },
      bad: { innovation: -1, psychological_safety: -1, growth: 0 },
      toxic: { innovation: -2, psychological_safety: -2, growth: -1 }
    }
  },
  {
    id: 'gz011',
    category: 'work_style',
    text: 'Your company uses outdated technology and resists digital transformation.',
    reactions: {
      love: { innovation: -2, efficiency: -2, frustration: 2 },
      good: { innovation: -1, efficiency: -1, frustration: 1 },
      neutral: { innovation: 0, efficiency: 0, frustration: 0 },
      bad: { innovation: 1, efficiency: 1, frustration: -1 },
      toxic: { innovation: 2, efficiency: 2, frustration: -2 }
    }
  },
  {
    id: 'gz012',
    category: 'work_style',
    text: 'You can bring your pet to work every day.',
    reactions: {
      love: { workplace_culture: 2, personal_expression: 1, comfort: 2 },
      good: { workplace_culture: 1, personal_expression: 1, comfort: 1 },
      neutral: { workplace_culture: 0, personal_expression: 0, comfort: 0 },
      bad: { workplace_culture: -1, personal_expression: 0, comfort: -1 },
      toxic: { workplace_culture: -2, personal_expression: -1, comfort: -2 }
    }
  },
  {
    id: 'gz013',
    category: 'work_style',
    text: 'Your company has strict dress codes and appearance standards.',
    reactions: {
      love: { personal_expression: -2, authenticity: -1, comfort: -1 },
      good: { personal_expression: -1, authenticity: 0, comfort: 0 },
      neutral: { personal_expression: 0, authenticity: 0, comfort: 0 },
      bad: { personal_expression: 1, authenticity: 1, comfort: 1 },
      toxic: { personal_expression: 2, authenticity: 2, comfort: 2 }
    }
  },
  {
    id: 'gz014',
    category: 'work_style',
    text: 'Your workplace offers meditation rooms and mental health days.',
    reactions: {
      love: { mental_health: 2, workplace_culture: 2, support: 1 },
      good: { mental_health: 1, workplace_culture: 1, support: 1 },
      neutral: { mental_health: 0, workplace_culture: 0, support: 0 },
      bad: { mental_health: -1, workplace_culture: -1, support: 0 },
      toxic: { mental_health: -2, workplace_culture: -2, support: -1 }
    }
  },
  {
    id: 'gz015',
    category: 'work_style',
    text: 'You have to ask permission for every decision, no matter how small.',
    reactions: {
      love: { autonomy: -2, empowerment: -2, efficiency: -1 },
      good: { autonomy: -1, empowerment: -1, efficiency: 0 },
      neutral: { autonomy: 0, empowerment: 0, efficiency: 0 },
      bad: { autonomy: 1, empowerment: 1, efficiency: 1 },
      toxic: { autonomy: 2, empowerment: 2, efficiency: 2 }
    }
  },

  // COMMUNICATION SCENARIOS (10 scenarios)
  {
    id: 'gz016',
    category: 'communication',
    text: 'All communication must go through formal email chains with multiple approvals.',
    reactions: {
      love: { efficiency: -2, innovation: -1, collaboration: -1 },
      good: { efficiency: -1, innovation: 0, collaboration: 0 },
      neutral: { efficiency: 0, innovation: 0, collaboration: 0 },
      bad: { efficiency: 1, innovation: 1, collaboration: 1 },
      toxic: { efficiency: 2, innovation: 2, collaboration: 2 }
    }
  },
  {
    id: 'gz017',
    category: 'communication',
    text: 'Your team communicates primarily through Slack and video calls.',
    reactions: {
      love: { digital_nativity: 2, efficiency: 1, flexibility: 1 },
      good: { digital_nativity: 1, efficiency: 1, flexibility: 0 },
      neutral: { digital_nativity: 0, efficiency: 0, flexibility: 0 },
      bad: { digital_nativity: -1, efficiency: -1, flexibility: -1 },
      toxic: { digital_nativity: -2, efficiency: -2, flexibility: -2 }
    }
  },
  {
    id: 'gz018',
    category: 'communication',
    text: 'Your manager only gives feedback during annual performance reviews.',
    reactions: {
      love: { growth: -2, support: -2, engagement: -1 },
      good: { growth: -1, support: -1, engagement: 0 },
      neutral: { growth: 0, support: 0, engagement: 0 },
      bad: { growth: 1, support: 1, engagement: 1 },
      toxic: { growth: 2, support: 2, engagement: 2 }
    }
  },
  {
    id: 'gz019',
    category: 'communication',
    text: 'You receive real-time feedback and regular check-ins.',
    reactions: {
      love: { growth: 2, support: 2, engagement: 1 },
      good: { growth: 1, support: 1, engagement: 1 },
      neutral: { growth: 0, support: 0, engagement: 0 },
      bad: { growth: -1, support: -1, engagement: 0 },
      toxic: { growth: -2, support: -2, engagement: -1 }
    }
  },
  {
    id: 'gz020',
    category: 'communication',
    text: 'Your workplace bans social media and personal device use.',
    reactions: {
      love: { personal_expression: -2, digital_nativity: -2, autonomy: -1 },
      good: { personal_expression: -1, digital_nativity: -1, autonomy: 0 },
      neutral: { personal_expression: 0, digital_nativity: 0, autonomy: 0 },
      bad: { personal_expression: 1, digital_nativity: 1, autonomy: 1 },
      toxic: { personal_expression: 2, digital_nativity: 2, autonomy: 2 }
    }
  },
  {
    id: 'gz021',
    category: 'communication',
    text: 'Your company encourages sharing personal achievements on internal platforms.',
    reactions: {
      love: { recognition: 2, workplace_culture: 1, authenticity: 1 },
      good: { recognition: 1, workplace_culture: 1, authenticity: 0 },
      neutral: { recognition: 0, workplace_culture: 0, authenticity: 0 },
      bad: { recognition: -1, workplace_culture: -1, authenticity: -1 },
      toxic: { recognition: -2, workplace_culture: -2, authenticity: -2 }
    }
  },
  {
    id: 'gz022',
    category: 'communication',
    text: 'All meetings are mandatory and could have been emails.',
    reactions: {
      love: { efficiency: -2, respect: -2, autonomy: -1 },
      good: { efficiency: -1, respect: -1, autonomy: 0 },
      neutral: { efficiency: 0, respect: 0, autonomy: 0 },
      bad: { efficiency: 1, respect: 1, autonomy: 1 },
      toxic: { efficiency: 2, respect: 2, autonomy: 2 }
    }
  },
  {
    id: 'gz023',
    category: 'communication',
    text: 'Your input is actively sought and implemented in decision-making.',
    reactions: {
      love: { empowerment: 2, respect: 2, engagement: 2 },
      good: { empowerment: 1, respect: 1, engagement: 1 },
      neutral: { empowerment: 0, respect: 0, engagement: 0 },
      bad: { empowerment: -1, respect: -1, engagement: -1 },
      toxic: { empowerment: -2, respect: -2, engagement: -2 }
    }
  },
  {
    id: 'gz024',
    category: 'communication',
    text: 'Your company uses AI chatbots for most internal communications.',
    reactions: {
      love: { digital_nativity: 1, efficiency: 1, human_connection: -1 },
      good: { digital_nativity: 1, efficiency: 0, human_connection: 0 },
      neutral: { digital_nativity: 0, efficiency: 0, human_connection: 0 },
      bad: { digital_nativity: -1, efficiency: -1, human_connection: 1 },
      toxic: { digital_nativity: -2, efficiency: -2, human_connection: 2 }
    }
  },
  {
    id: 'gz025',
    category: 'communication',
    text: 'Your manager publicly criticizes your work in team meetings.',
    reactions: {
      love: { respect: -2, psychological_safety: -2, workplace_culture: -2 },
      good: { respect: -1, psychological_safety: -1, workplace_culture: -1 },
      neutral: { respect: 0, psychological_safety: 0, workplace_culture: 0 },
      bad: { respect: 1, psychological_safety: 1, workplace_culture: 1 },
      toxic: { respect: 2, psychological_safety: 2, workplace_culture: 2 }
    }
  },

  // CAREER VALUES SCENARIOS (10 scenarios)
  {
    id: 'gz026',
    category: 'career_values',
    text: 'Your job offers high pay but no opportunities for advancement.',
    reactions: {
      love: { financial_security: 1, growth: -2, ambition: -1 },
      good: { financial_security: 1, growth: -1, ambition: 0 },
      neutral: { financial_security: 0, growth: 0, ambition: 0 },
      bad: { financial_security: -1, growth: 1, ambition: 1 },
      toxic: { financial_security: -2, growth: 2, ambition: 2 }
    }
  },
  {
    id: 'gz027',
    category: 'career_values',
    text: 'Your company prioritizes profits over employee wellbeing.',
    reactions: {
      love: { values_alignment: -2, ethics: -2, respect: -2 },
      good: { values_alignment: -1, ethics: -1, respect: -1 },
      neutral: { values_alignment: 0, ethics: 0, respect: 0 },
      bad: { values_alignment: 1, ethics: 1, respect: 1 },
      toxic: { values_alignment: 2, ethics: 2, respect: 2 }
    }
  },
  {
    id: 'gz028',
    category: 'career_values',
    text: 'You can learn new skills and switch between different roles.',
    reactions: {
      love: { growth: 2, versatility: 2, boredom_resistance: 1 },
      good: { growth: 1, versatility: 1, boredom_resistance: 1 },
      neutral: { growth: 0, versatility: 0, boredom_resistance: 0 },
      bad: { growth: -1, versatility: -1, boredom_resistance: -1 },
      toxic: { growth: -2, versatility: -2, boredom_resistance: -2 }
    }
  },
  {
    id: 'gz029',
    category: 'career_values',
    text: 'Your job is the same routine every single day for years.',
    reactions: {
      love: { boredom_resistance: -2, growth: -2, stimulation: -2 },
      good: { boredom_resistance: -1, growth: -1, stimulation: -1 },
      neutral: { boredom_resistance: 0, growth: 0, stimulation: 0 },
      bad: { boredom_resistance: 1, growth: 1, stimulation: 1 },
      toxic: { boredom_resistance: 2, growth: 2, stimulation: 2 }
    }
  },
  {
    id: 'gz030',
    category: 'career_values',
    text: 'Your company offers excellent benefits but below-market salary.',
    reactions: {
      love: { security: 1, financial_security: -1, holistic_compensation: 1 },
      good: { security: 1, financial_security: 0, holistic_compensation: 1 },
      neutral: { security: 0, financial_security: 0, holistic_compensation: 0 },
      bad: { security: -1, financial_security: 1, holistic_compensation: -1 },
      toxic: { security: -2, financial_security: 2, holistic_compensation: -2 }
    }
  },
  {
    id: 'gz031',
    category: 'career_values',
    text: 'You can start your own projects and initiatives within the company.',
    reactions: {
      love: { entrepreneurship: 2, creativity: 2, empowerment: 1 },
      good: { entrepreneurship: 1, creativity: 1, empowerment: 1 },
      neutral: { entrepreneurship: 0, creativity: 0, empowerment: 0 },
      bad: { entrepreneurship: -1, creativity: -1, empowerment: -1 },
      toxic: { entrepreneurship: -2, creativity: -2, empowerment: -2 }
    }
  },
  {
    id: 'gz032',
    category: 'career_values',
    text: 'Your role focuses on maintaining existing systems with no innovation.',
    reactions: {
      love: { innovation: -2, creativity: -2, stimulation: -1 },
      good: { innovation: -1, creativity: -1, stimulation: 0 },
      neutral: { innovation: 0, creativity: 0, stimulation: 0 },
      bad: { innovation: 1, creativity: 1, stimulation: 1 },
      toxic: { innovation: 2, creativity: 2, stimulation: 2 }
    }
  },
  {
    id: 'gz033',
    category: 'career_values',
    text: 'Your workplace celebrates failures as learning experiences.',
    reactions: {
      love: { psychological_safety: 2, innovation: 2, growth: 1 },
      good: { psychological_safety: 1, innovation: 1, growth: 1 },
      neutral: { psychological_safety: 0, innovation: 0, growth: 0 },
      bad: { psychological_safety: -1, innovation: -1, growth: 0 },
      toxic: { psychological_safety: -2, innovation: -2, growth: -1 }
    }
  },
  {
    id: 'gz034',
    category: 'career_values',
    text: 'Promotions are based on years of service rather than performance.',
    reactions: {
      love: { meritocracy: -2, fairness: -1, motivation: -1 },
      good: { meritocracy: -1, fairness: 0, motivation: 0 },
      neutral: { meritocracy: 0, fairness: 0, motivation: 0 },
      bad: { meritocracy: 1, fairness: 1, motivation: 1 },
      toxic: { meritocracy: 2, fairness: 2, motivation: 2 }
    }
  },
  {
    id: 'gz035',
    category: 'career_values',
    text: 'Your company provides continuous learning budgets and skill development.',
    reactions: {
      love: { growth: 2, investment_in_people: 2, future_readiness: 1 },
      good: { growth: 1, investment_in_people: 1, future_readiness: 1 },
      neutral: { growth: 0, investment_in_people: 0, future_readiness: 0 },
      bad: { growth: -1, investment_in_people: -1, future_readiness: -1 },
      toxic: { growth: -2, investment_in_people: -2, future_readiness: -2 }
    }
  },

  // SOCIAL IMPACT SCENARIOS (5 scenarios)
  {
    id: 'gz036',
    category: 'social_impact',
    text: 'Your company actively works to solve climate change and environmental issues.',
    reactions: {
      love: { purpose: 2, environmental_consciousness: 2, values_alignment: 1 },
      good: { purpose: 1, environmental_consciousness: 1, values_alignment: 1 },
      neutral: { purpose: 0, environmental_consciousness: 0, values_alignment: 0 },
      bad: { purpose: -1, environmental_consciousness: -1, values_alignment: -1 },
      toxic: { purpose: -2, environmental_consciousness: -2, values_alignment: -2 }
    }
  },
  {
    id: 'gz037',
    category: 'social_impact',
    text: 'Your job contributes to widening social inequality.',
    reactions: {
      love: { social_consciousness: -2, ethics: -2, purpose: -2 },
      good: { social_consciousness: -1, ethics: -1, purpose: -1 },
      neutral: { social_consciousness: 0, ethics: 0, purpose: 0 },
      bad: { social_consciousness: 1, ethics: 1, purpose: 1 },
      toxic: { social_consciousness: 2, ethics: 2, purpose: 2 }
    }
  },
  {
    id: 'gz038',
    category: 'social_impact',
    text: 'Your workplace is diverse and actively promotes inclusion.',
    reactions: {
      love: { inclusion: 2, authenticity: 1, social_values: 2 },
      good: { inclusion: 1, authenticity: 1, social_values: 1 },
      neutral: { inclusion: 0, authenticity: 0, social_values: 0 },
      bad: { inclusion: -1, authenticity: -1, social_values: -1 },
      toxic: { inclusion: -2, authenticity: -2, social_values: -2 }
    }
  },
  {
    id: 'gz039',
    category: 'social_impact',
    text: 'Your company donates significant portions of profits to charitable causes.',
    reactions: {
      love: { purpose: 2, social_consciousness: 2, values_alignment: 1 },
      good: { purpose: 1, social_consciousness: 1, values_alignment: 1 },
      neutral: { purpose: 0, social_consciousness: 0, values_alignment: 0 },
      bad: { purpose: -1, social_consciousness: -1, values_alignment: -1 },
      toxic: { purpose: -2, social_consciousness: -2, values_alignment: -2 }
    }
  },
  {
    id: 'gz040',
    category: 'social_impact',
    text: 'Your work directly helps improve people\'s lives and communities.',
    reactions: {
      love: { purpose: 2, meaning: 2, fulfillment: 2 },
      good: { purpose: 1, meaning: 1, fulfillment: 1 },
      neutral: { purpose: 0, meaning: 0, fulfillment: 0 },
      bad: { purpose: -1, meaning: -1, fulfillment: -1 },
      toxic: { purpose: -2, meaning: -2, fulfillment: -2 }
    }
  },

  // TECHNOLOGY SCENARIOS (5 scenarios)
  {
    id: 'gz041',
    category: 'technology',
    text: 'Your company uses cutting-edge AI and automation tools.',
    reactions: {
      love: { innovation: 2, efficiency: 2, future_readiness: 2 },
      good: { innovation: 1, efficiency: 1, future_readiness: 1 },
      neutral: { innovation: 0, efficiency: 0, future_readiness: 0 },
      bad: { innovation: -1, efficiency: -1, future_readiness: -1 },
      toxic: { innovation: -2, efficiency: -2, future_readiness: -2 }
    }
  },
  {
    id: 'gz042',
    category: 'technology',
    text: 'AI might eventually replace your job role entirely.',
    reactions: {
      love: { job_security: -2, anxiety: 2, adaptability: -1 },
      good: { job_security: -1, anxiety: 1, adaptability: 0 },
      neutral: { job_security: 0, anxiety: 0, adaptability: 0 },
      bad: { job_security: 1, anxiety: -1, adaptability: 1 },
      toxic: { job_security: 2, anxiety: -2, adaptability: 2 }
    }
  },
  {
    id: 'gz043',
    category: 'technology',
    text: 'Your workplace still uses fax machines and paper filing systems.',
    reactions: {
      love: { digital_nativity: -2, efficiency: -2, modernity: -2 },
      good: { digital_nativity: -1, efficiency: -1, modernity: -1 },
      neutral: { digital_nativity: 0, efficiency: 0, modernity: 0 },
      bad: { digital_nativity: 1, efficiency: 1, modernity: 1 },
      toxic: { digital_nativity: 2, efficiency: 2, modernity: 2 }
    }
  },
  {
    id: 'gz044',
    category: 'technology',
    text: 'You can use any tech tools you want to optimize your productivity.',
    reactions: {
      love: { autonomy: 2, efficiency: 2, empowerment: 1 },
      good: { autonomy: 1, efficiency: 1, empowerment: 1 },
      neutral: { autonomy: 0, efficiency: 0, empowerment: 0 },
      bad: { autonomy: -1, efficiency: -1, empowerment: -1 },
      toxic: { autonomy: -2, efficiency: -2, empowerment: -2 }
    }
  },
  {
    id: 'gz045',
    category: 'technology',
    text: 'Your company blocks access to most websites and applications.',
    reactions: {
      love: { freedom: -2, trust: -2, digital_nativity: -1 },
      good: { freedom: -1, trust: -1, digital_nativity: 0 },
      neutral: { freedom: 0, trust: 0, digital_nativity: 0 },
      bad: { freedom: 1, trust: 1, digital_nativity: 1 },
      toxic: { freedom: 2, trust: 2, digital_nativity: 2 }
    }
  }
];

export const genZValues: GenZValue[] = [
  {
    id: 'gv001',
    text: 'Financial stability and security',
    category: 'security',
    scores: { financial_security: 2, stability: 1, pragmatism: 1 }
  },
  {
    id: 'gv002',
    text: 'Flexible work arrangements',
    category: 'flexibility',
    scores: { flexibility: 2, autonomy: 1, work_life_balance: 1 }
  },
  {
    id: 'gv003',
    text: 'Making a positive social impact',
    category: 'purpose',
    scores: { purpose: 2, social_consciousness: 2, meaning: 1 }
  },
  {
    id: 'gv004',
    text: 'Continuous learning and growth',
    category: 'growth',
    scores: { growth: 2, adaptability: 1, future_readiness: 1 }
  },
  {
    id: 'gv005',
    text: 'Authentic workplace culture',
    category: 'authenticity',
    scores: { authenticity: 2, workplace_culture: 1, trust: 1 }
  },
  {
    id: 'gv006',
    text: 'Work-life balance',
    category: 'balance',
    scores: { work_life_balance: 2, mental_health: 1, boundaries: 1 }
  },
  {
    id: 'gv007',
    text: 'Diversity and inclusion',
    category: 'inclusion',
    scores: { inclusion: 2, social_values: 1, respect: 1 }
  },
  {
    id: 'gv008',
    text: 'Innovation and creativity',
    category: 'innovation',
    scores: { innovation: 2, creativity: 1, stimulation: 1 }
  },
  {
    id: 'gv009',
    text: 'Mental health support',
    category: 'wellbeing',
    scores: { mental_health: 2, support: 1, workplace_culture: 1 }
  },
  {
    id: 'gv010',
    text: 'Environmental sustainability',
    category: 'environment',
    scores: { environmental_consciousness: 2, values_alignment: 1, purpose: 1 }
  },
  {
    id: 'gv011',
    text: 'Recognition and appreciation',
    category: 'recognition',
    scores: { recognition: 2, respect: 1, motivation: 1 }
  },
  {
    id: 'gv012',
    text: 'Entrepreneurial opportunities',
    category: 'entrepreneurship',
    scores: { entrepreneurship: 2, autonomy: 1, creativity: 1 }
  },
  {
    id: 'gv013',
    text: 'Technology and digital tools',
    category: 'technology',
    scores: { digital_nativity: 2, efficiency: 1, modernity: 1 }
  },
  {
    id: 'gv014',
    text: 'Transparent communication',
    category: 'transparency',
    scores: { transparency: 2, trust: 1, authenticity: 1 }
  },
  {
    id: 'gv015',
    text: 'Personal expression and individuality',
    category: 'expression',
    scores: { personal_expression: 2, authenticity: 1, freedom: 1 }
  }
];

export const collaborationScenarios: GenZScenario[] = [
  {
    id: 'gc001',
    category: 'communication',
    text: 'Your team prefers quick video calls over long email chains.',
    reactions: {
      love: { efficiency: 2, digital_nativity: 1, collaboration: 1 },
      good: { efficiency: 1, digital_nativity: 1, collaboration: 1 },
      neutral: { efficiency: 0, digital_nativity: 0, collaboration: 0 },
      bad: { efficiency: -1, digital_nativity: -1, collaboration: -1 },
      toxic: { efficiency: -2, digital_nativity: -2, collaboration: -2 }
    }
  },
  {
    id: 'gc002',
    category: 'work_style',
    text: 'Your company encourages cross-functional collaboration and breaking down silos.',
    reactions: {
      love: { collaboration: 2, innovation: 1, learning: 1 },
      good: { collaboration: 1, innovation: 1, learning: 1 },
      neutral: { collaboration: 0, innovation: 0, learning: 0 },
      bad: { collaboration: -1, innovation: -1, learning: -1 },
      toxic: { collaboration: -2, innovation: -2, learning: -2 }
    }
  },
  {
    id: 'gc003',
    category: 'career_values',
    text: 'Your success is measured by how well you help others succeed.',
    reactions: {
      love: { collaboration: 2, purpose: 1, social_values: 1 },
      good: { collaboration: 1, purpose: 1, social_values: 1 },
      neutral: { collaboration: 0, purpose: 0, social_values: 0 },
      bad: { collaboration: -1, purpose: -1, social_values: -1 },
      toxic: { collaboration: -2, purpose: -2, social_values: -2 }
    }
  },
  {
    id: 'gc004',
    category: 'communication',
    text: 'Your workplace uses collaborative platforms like Notion, Miro, and shared workspaces.',
    reactions: {
      love: { digital_nativity: 2, collaboration: 2, efficiency: 1 },
      good: { digital_nativity: 1, collaboration: 1, efficiency: 1 },
      neutral: { digital_nativity: 0, collaboration: 0, efficiency: 0 },
      bad: { digital_nativity: -1, collaboration: -1, efficiency: -1 },
      toxic: { digital_nativity: -2, collaboration: -2, efficiency: -2 }
    }
  },
  {
    id: 'gc005',
    category: 'work_style',
    text: 'Your team works in highly competitive individual environments with ranking systems.',
    reactions: {
      love: { collaboration: -2, psychological_safety: -1, stress: 2 },
      good: { collaboration: -1, psychological_safety: 0, stress: 1 },
      neutral: { collaboration: 0, psychological_safety: 0, stress: 0 },
      bad: { collaboration: 1, psychological_safety: 1, stress: -1 },
      toxic: { collaboration: 2, psychological_safety: 2, stress: -2 }
    }
  }
];

export const companyProfiles = {
  traditional_corporate: {
    name: "Traditional Corporate",
    characteristics: [
      "Hierarchical structure",
      "Formal communication",
      "Standard 9-5 schedule",
      "Conservative culture"
    ],
    scores: {
      flexibility: -2,
      autonomy: -1,
      innovation: -1,
      stability: 2,
      structure: 2
    }
  },
  tech_startup: {
    name: "Tech Startup",
    characteristics: [
      "Fast-paced environment",
      "Flexible work arrangements",
      "Innovation focused",
      "Casual culture"
    ],
    scores: {
      flexibility: 2,
      innovation: 2,
      growth: 2,
      stability: -1,
      work_life_balance: -1
    }
  },
  mission_driven: {
    name: "Mission-Driven Organization",
    characteristics: [
      "Strong social purpose",
      "Values-driven decisions",
      "Community impact focus",
      "Collaborative culture"
    ],
    scores: {
      purpose: 2,
      social_consciousness: 2,
      collaboration: 1,
      financial_security: -1
    }
  },
  creative_agency: {
    name: "Creative Agency",
    characteristics: [
      "Creative freedom",
      "Project-based work",
      "Flexible schedules",
      "Artistic expression"
    ],
    scores: {
      creativity: 2,
      flexibility: 2,
      personal_expression: 2,
      stability: -1,
      structure: -1
    }
  },
  remote_first: {
    name: "Remote-First Company",
    characteristics: [
      "Fully distributed team",
      "Digital-first processes",
      "Flexible location",
      "Results-oriented"
    ],
    scores: {
      flexibility: 2,
      digital_nativity: 2,
      work_life_balance: 1,
      human_connection: -1
    }
  }
};