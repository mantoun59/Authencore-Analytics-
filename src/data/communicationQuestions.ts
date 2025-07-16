export interface CommunicationQuestion {
  id: string;
  module: 'style_identification' | 'linguistic_analysis' | 'interactive_simulation' | 'adaptive_scenario';
  dimension: 'assertiveness' | 'expressiveness' | 'detail_orientation' | 'processing_speed' | 'channel_preference' | 'formality' | 'listening' | 'empathy' | 'influence' | 'negotiation' | 'conflict';
  type: 'multiple_choice' | 'scenario' | 'written_response' | 'simulation' | 'ranking';
  question: string;
  context?: string;
  options?: Array<{
    id: string;
    text: string;
    scores: Record<string, number>;
    indicators: string[];
  }>;
  writtenPrompt?: string;
  timeLimit?: number;
  adaptiveRules?: {
    showIf: string;
    skipIf: string;
  };
}

export const communicationQuestions: CommunicationQuestion[] = [
  // Module 1: Style Identification - Team Meeting Scenarios
  {
    id: 'cs_001',
    module: 'style_identification',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'Team Meeting Disagreement',
    context: 'During a team meeting, a colleague presents an idea you strongly disagree with. How do you typically respond?',
    options: [
      {
        id: 'A',
        text: 'Immediately voice your differing opinion with specific reasons',
        scores: { assertiveness: 4, directness: 4, confrontation_comfort: 3 },
        indicators: ['direct_communication', 'high_assertiveness', 'conflict_engagement']
      },
      {
        id: 'B',
        text: 'Wait for a break to speak privately with the key person',
        scores: { assertiveness: 2, diplomacy: 4, relationship_focus: 3 },
        indicators: ['indirect_communication', 'relationship_preservation', 'private_feedback']
      },
      {
        id: 'C',
        text: 'Send a follow-up email with your thoughts',
        scores: { assertiveness: 2, written_preference: 4, processing_time: 3 },
        indicators: ['written_communication', 'thoughtful_response', 'conflict_avoidance']
      },
      {
        id: 'D',
        text: 'Ask clarifying questions to understand better first',
        scores: { assertiveness: 1, listening: 4, empathy: 3 },
        indicators: ['listening_first', 'understanding_seeking', 'collaborative_approach']
      }
    ]
  },
  
  {
    id: 'cs_002',
    module: 'style_identification',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'Delivering Critical Feedback',
    context: 'You need to give critical feedback to a team member about their performance. What approach do you take?',
    options: [
      {
        id: 'A',
        text: 'Direct and specific with concrete examples',
        scores: { assertiveness: 4, clarity: 4, directness: 4 },
        indicators: ['direct_feedback', 'specific_examples', 'clear_communication']
      },
      {
        id: 'B',
        text: 'Sandwich approach (positive-negative-positive)',
        scores: { assertiveness: 2, diplomacy: 4, relationship_focus: 3 },
        indicators: ['diplomatic_feedback', 'relationship_preservation', 'structured_approach']
      },
      {
        id: 'C',
        text: 'Written documentation first, then discuss',
        scores: { assertiveness: 2, written_preference: 4, preparation: 4 },
        indicators: ['written_communication', 'prepared_feedback', 'documentation_focus']
      },
      {
        id: 'D',
        text: 'Collaborative problem-solving session',
        scores: { assertiveness: 1, collaboration: 4, empathy: 3 },
        indicators: ['collaborative_approach', 'problem_solving', 'team_oriented']
      }
    ]
  },

  // Module 1: Expressiveness Questions
  {
    id: 'cs_003',
    module: 'style_identification',
    dimension: 'expressiveness',
    type: 'multiple_choice',
    question: 'When sharing exciting news with your team, you typically:',
    options: [
      {
        id: 'A',
        text: 'Share enthusiastically with lots of energy and details',
        scores: { expressiveness: 4, enthusiasm: 4, storytelling: 3 },
        indicators: ['high_energy', 'detailed_sharing', 'emotional_expression']
      },
      {
        id: 'B',
        text: 'Present the facts clearly and concisely',
        scores: { expressiveness: 1, clarity: 4, brevity: 3 },
        indicators: ['fact_focused', 'concise_communication', 'low_emotion']
      },
      {
        id: 'C',
        text: 'Share with moderate enthusiasm and key points',
        scores: { expressiveness: 2, balance: 3, professionalism: 3 },
        indicators: ['moderate_expression', 'balanced_approach', 'professional_tone']
      },
      {
        id: 'D',
        text: 'Wait for others to ask for details',
        scores: { expressiveness: 1, restraint: 3, reactive: 2 },
        indicators: ['reserved_communication', 'reactive_sharing', 'minimal_expression']
      }
    ]
  },

  // Module 2: Linguistic Analysis - Written Response
  {
    id: 'cs_004',
    module: 'linguistic_analysis',
    dimension: 'detail_orientation',
    type: 'written_response',
    question: 'Team Success Description',
    writtenPrompt: 'Describe a recent team success you were part of. Include what made it successful and your role in achieving it.',
    timeLimit: 300 // 5 minutes
  },

  {
    id: 'cs_005',
    module: 'linguistic_analysis',
    dimension: 'processing_speed',
    type: 'written_response',
    question: 'Complex Idea Explanation',
    writtenPrompt: 'Explain a complex work concept or process to someone new to your field. Focus on making it clear and understandable.',
    timeLimit: 240 // 4 minutes
  },

  // Module 3: Interactive Simulations
  {
    id: 'cs_006',
    module: 'interactive_simulation',
    dimension: 'channel_preference',
    type: 'simulation',
    question: 'Urgent Client Complaint Response',
    context: 'A client has sent an urgent complaint about a service issue. Choose your response approach:',
    options: [
      {
        id: 'A',
        text: 'Call immediately to discuss the issue',
        scores: { channel_preference: 4, urgency_response: 4, personal_touch: 3 },
        indicators: ['phone_preference', 'immediate_response', 'personal_connection']
      },
      {
        id: 'B',
        text: 'Send a detailed email addressing each point',
        scores: { channel_preference: 2, written_preference: 4, thoroughness: 4 },
        indicators: ['written_communication', 'detailed_response', 'systematic_approach']
      },
      {
        id: 'C',
        text: 'Schedule a video call to show your concern',
        scores: { channel_preference: 3, visual_communication: 3, empathy: 3 },
        indicators: ['video_preference', 'face_to_face', 'empathetic_response']
      },
      {
        id: 'D',
        text: 'Quick acknowledgment then follow up with solution',
        scores: { channel_preference: 2, responsiveness: 4, solution_focus: 4 },
        indicators: ['multi_channel', 'quick_response', 'solution_oriented']
      }
    ]
  },

  // Module 4: Adaptive Scenarios - Leadership Communication
  {
    id: 'cs_007',
    module: 'adaptive_scenario',
    dimension: 'influence',
    type: 'scenario',
    question: 'Proposing Initiative to Leadership',
    context: 'You have an innovative idea that requires leadership approval and budget. How do you present it?',
    options: [
      {
        id: 'A',
        text: 'Data-driven presentation with ROI calculations',
        scores: { influence: 3, logic_appeal: 4, data_focus: 4 },
        indicators: ['logical_persuasion', 'data_driven', 'business_case']
      },
      {
        id: 'B',
        text: 'Story about customer impact and vision',
        scores: { influence: 3, emotion_appeal: 4, storytelling: 4 },
        indicators: ['emotional_persuasion', 'story_telling', 'vision_focused']
      },
      {
        id: 'C',
        text: 'Pilot proposal with phased implementation',
        scores: { influence: 2, risk_management: 4, pragmatism: 3 },
        indicators: ['risk_mitigation', 'practical_approach', 'incremental_change']
      },
      {
        id: 'D',
        text: 'Collaborative workshop to co-create the idea',
        scores: { influence: 2, collaboration: 4, consensus_building: 4 },
        indicators: ['collaborative_influence', 'consensus_building', 'co_creation']
      }
    ]
  },

  // Conflict Communication
  {
    id: 'cs_008',
    module: 'adaptive_scenario',
    dimension: 'conflict',
    type: 'scenario',
    question: 'Team Conflict Resolution',
    context: 'Two team members are in ongoing conflict affecting team morale. As a colleague, how do you address this?',
    options: [
      {
        id: 'A',
        text: 'Directly address both parties about the impact',
        scores: { conflict: 4, assertiveness: 4, directness: 3 },
        indicators: ['direct_confrontation', 'conflict_engagement', 'impact_focus']
      },
      {
        id: 'B',
        text: 'Suggest mediation or involve a neutral party',
        scores: { conflict: 3, diplomacy: 4, mediation: 4 },
        indicators: ['mediation_approach', 'neutral_facilitation', 'structured_resolution']
      },
      {
        id: 'C',
        text: 'Speak with each person individually first',
        scores: { conflict: 2, empathy: 3, individual_focus: 3 },
        indicators: ['individual_approach', 'understanding_seeking', 'private_discussion']
      },
      {
        id: 'D',
        text: 'Focus on team activities that rebuild connection',
        scores: { conflict: 1, harmony: 4, team_building: 3 },
        indicators: ['harmony_focus', 'team_building', 'indirect_resolution']
      }
    ]
  },

  // Channel Preferences
  {
    id: 'cs_009',
    module: 'style_identification',
    dimension: 'channel_preference',
    type: 'ranking',
    question: 'Rank your preferred communication channels for different situations:',
    context: 'For delivering important news to your team, rank these options from most to least preferred:',
    options: [
      {
        id: 'A',
        text: 'Face-to-face team meeting',
        scores: { channel_preference: 4, personal_connection: 4, group_communication: 3 },
        indicators: ['face_to_face', 'group_preferred', 'personal_touch']
      },
      {
        id: 'B',
        text: 'Video conference call',
        scores: { channel_preference: 3, visual_communication: 3, remote_comfort: 3 },
        indicators: ['video_conference', 'visual_cues', 'remote_friendly']
      },
      {
        id: 'C',
        text: 'Detailed email to all',
        scores: { channel_preference: 2, written_preference: 4, documentation: 4 },
        indicators: ['written_communication', 'detailed_information', 'documentation_focus']
      },
      {
        id: 'D',
        text: 'Individual conversations',
        scores: { channel_preference: 2, personal_touch: 4, individual_focus: 4 },
        indicators: ['one_on_one', 'personalized_approach', 'individual_attention']
      }
    ]
  },

  // Listening Patterns
  {
    id: 'cs_010',
    module: 'style_identification',
    dimension: 'listening',
    type: 'multiple_choice',
    question: 'When someone is explaining a complex problem to you, you typically:',
    options: [
      {
        id: 'A',
        text: 'Ask clarifying questions throughout',
        scores: { listening: 4, engagement: 4, clarification: 4 },
        indicators: ['active_listening', 'question_asking', 'engaged_listening']
      },
      {
        id: 'B',
        text: 'Listen completely, then ask questions',
        scores: { listening: 3, patience: 4, respectful: 3 },
        indicators: ['patient_listening', 'respectful_approach', 'delayed_questioning']
      },
      {
        id: 'C',
        text: 'Take notes and paraphrase what you heard',
        scores: { listening: 4, comprehension: 4, systematic: 3 },
        indicators: ['note_taking', 'paraphrasing', 'systematic_listening']
      },
      {
        id: 'D',
        text: 'Focus on the emotions behind the words',
        scores: { listening: 3, empathy: 4, emotional_intelligence: 4 },
        indicators: ['empathetic_listening', 'emotional_focus', 'reading_between_lines']
      }
    ]
  }
];

// Extended question bank for full 80-question assessment
export const extendedQuestions: CommunicationQuestion[] = [
  // Additional Style Identification Questions (10 more)
  {
    id: 'cs_011',
    module: 'style_identification',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'Deadline Pressure Communication',
    context: 'Your team is behind on a critical deadline. How do you communicate this to stakeholders?',
    options: [
      {
        id: 'A',
        text: 'Immediately escalate with facts and timeline',
        scores: { assertiveness: 4, transparency: 4, urgency: 4 },
        indicators: ['immediate_escalation', 'transparent_communication', 'fact_based']
      },
      {
        id: 'B',
        text: 'Present solutions alongside the problem',
        scores: { assertiveness: 3, solution_focus: 4, proactive: 3 },
        indicators: ['solution_oriented', 'proactive_communication', 'problem_solving']
      },
      {
        id: 'C',
        text: 'Discuss with team first, then communicate',
        scores: { assertiveness: 2, collaboration: 3, preparation: 3 },
        indicators: ['collaborative_approach', 'team_consultation', 'prepared_communication']
      },
      {
        id: 'D',
        text: 'Gradually introduce the delay concerns',
        scores: { assertiveness: 1, diplomacy: 3, gradual_approach: 3 },
        indicators: ['gradual_disclosure', 'diplomatic_approach', 'soft_delivery']
      }
    ]
  },

  // More Linguistic Analysis Prompts (5 more)
  {
    id: 'cs_012',
    module: 'linguistic_analysis',
    dimension: 'formality',
    type: 'written_response',
    question: 'Client Proposal Response',
    writtenPrompt: 'Write a response to a client who has requested a proposal for a new project. Include your initial thoughts and next steps.',
    timeLimit: 180
  },

  // Additional Interactive Simulations (10 more)
  {
    id: 'cs_013',
    module: 'interactive_simulation',
    dimension: 'negotiation',
    type: 'simulation',
    question: 'Salary Negotiation Approach',
    context: 'You are negotiating a salary increase with your manager. Choose your opening approach:',
    options: [
      {
        id: 'A',
        text: 'Present market data and your value contribution',
        scores: { negotiation: 4, data_driven: 4, value_focus: 4 },
        indicators: ['data_negotiation', 'value_demonstration', 'market_comparison']
      },
      {
        id: 'B',
        text: 'Discuss career growth and future potential',
        scores: { negotiation: 3, future_focus: 4, relationship_building: 3 },
        indicators: ['future_oriented', 'growth_discussion', 'relationship_leverage']
      },
      {
        id: 'C',
        text: 'Ask about company compensation philosophy',
        scores: { negotiation: 2, understanding: 3, company_focus: 3 },
        indicators: ['information_gathering', 'company_alignment', 'understanding_first']
      },
      {
        id: 'D',
        text: 'Share your financial needs and goals',
        scores: { negotiation: 1, personal_disclosure: 3, needs_focus: 2 },
        indicators: ['personal_approach', 'needs_disclosure', 'emotional_appeal']
      }
    ]
  }
];

// Linguistic Patterns for Analysis
export const linguisticPatterns = {
  formality: {
    formal: ['therefore', 'however', 'furthermore', 'consequently', 'moreover', 'nevertheless', 'subsequently', 'accordingly', 'nonetheless', 'likewise'],
    informal: ['yeah', 'ok', 'cool', 'awesome', 'great', 'nice', 'wow', 'hey', 'sure', 'got it']
  },
  assertiveness: {
    high: ['will', 'must', 'should', 'need', 'require', 'expect', 'demand', 'insist', 'determine', 'decide'],
    low: ['might', 'could', 'perhaps', 'maybe', 'possibly', 'seems', 'appears', 'think', 'feel', 'believe']
  },
  emotion: {
    high: ['excited', 'thrilled', 'passionate', 'love', 'amazing', 'fantastic', 'incredible', 'outstanding', 'brilliant', 'wonderful'],
    low: ['adequate', 'sufficient', 'acceptable', 'reasonable', 'standard', 'typical', 'normal', 'usual', 'regular', 'basic']
  },
  detail: {
    high: ['specifically', 'precisely', 'exactly', 'detailed', 'comprehensive', 'thorough', 'systematic', 'methodical', 'step-by-step', 'analysis'],
    low: ['generally', 'overall', 'basically', 'roughly', 'approximately', 'mainly', 'mostly', 'typically', 'usually', 'broadly']
  }
};

// Scoring Dimensions
export const scoringDimensions = [
  'assertiveness',
  'expressiveness', 
  'detail_orientation',
  'processing_speed',
  'channel_preference',
  'formality',
  'listening',
  'empathy',
  'influence',
  'negotiation',
  'conflict'
];

// Communication Profiles
export interface CommunicationProfile {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  blindSpots: string[];
  idealConditions: string[];
  stressPatterns: string[];
  communicationWith: {
    director: string;
    socializer: string;
    thinker: string;
    supporter: string;
  };
}

export const communicationProfiles: CommunicationProfile[] = [
  {
    id: 'director',
    name: 'The Director',
    description: 'Direct, results-focused, and time-efficient communication style',
    characteristics: [
      'Direct and to-the-point',
      'Results-focused',
      'Time-efficient',
      'Bottom-line oriented',
      'Quick decision making',
      'High control needs'
    ],
    strengths: [
      'Clear and decisive communication',
      'Efficient use of time',
      'Strong leadership presence',
      'Results-oriented focus',
      'Comfortable with conflict',
      'Quick problem resolution'
    ],
    blindSpots: [
      'May seem too blunt or insensitive',
      'Impatient with detailed explanations',
      'May not show enough empathy',
      'Could miss emotional nuances',
      'Tendency to dominate conversations',
      'May rush important decisions'
    ],
    idealConditions: [
      'Clear goals and expectations',
      'Authority to make decisions',
      'Minimal bureaucracy',
      'Results-focused environment',
      'Direct feedback culture',
      'Efficient processes'
    ],
    stressPatterns: [
      'Becomes more demanding',
      'Shows impatience openly',
      'May become overly critical',
      'Increases control behaviors',
      'Tends to rush decisions',
      'Shows less empathy'
    ],
    communicationWith: {
      director: 'Be direct, stick to facts, focus on results, respect their time',
      socializer: 'Allow for relationship building, show enthusiasm, use stories',
      thinker: 'Provide data, allow processing time, be systematic',
      supporter: 'Show empathy, build trust, allow for questions'
    }
  },
  {
    id: 'socializer',
    name: 'The Socializer',
    description: 'Enthusiastic, people-focused, and relationship-building communication style',
    characteristics: [
      'Enthusiastic and energetic',
      'People-focused',
      'Story-driven communication',
      'Relationship building',
      'Inspiring and motivating',
      'Collaborative approach'
    ],
    strengths: [
      'Builds strong relationships',
      'Motivates and inspires others',
      'Creates positive team energy',
      'Excellent at networking',
      'Skilled at persuasion',
      'Brings creativity and innovation'
    ],
    blindSpots: [
      'May lack attention to details',
      'Can be disorganized',
      'May overshare personal information',
      'Tendency to be overly optimistic',
      'May not follow through consistently',
      'Could dominate conversations'
    ],
    idealConditions: [
      'Collaborative environment',
      'Opportunities for interaction',
      'Recognition and appreciation',
      'Variety in work',
      'Freedom to be creative',
      'Supportive team culture'
    ],
    stressPatterns: [
      'Becomes more talkative',
      'May lose focus on tasks',
      'Shows increased emotionality',
      'Seeks more social interaction',
      'May become disorganized',
      'Tends to avoid conflict'
    ],
    communicationWith: {
      director: 'Be enthusiastic, show personal interest, use stories to illustrate points',
      socializer: 'Share experiences, be collaborative, allow for social interaction',
      thinker: 'Be patient with their process, provide social context for data',
      supporter: 'Show warmth, be encouraging, build on their ideas'
    }
  },
  {
    id: 'thinker',
    name: 'The Thinker',
    description: 'Analytical, detail-oriented, and systematic communication style',
    characteristics: [
      'Analytical and logical',
      'Detail-oriented',
      'Data-driven communication',
      'Systematic approach',
      'Quality focused',
      'Thoughtful and deliberate'
    ],
    strengths: [
      'Thorough and accurate',
      'Excellent problem-solving skills',
      'High quality standards',
      'Logical decision making',
      'Good at planning',
      'Reliable and consistent'
    ],
    blindSpots: [
      'May seem cold or impersonal',
      'Can be overly critical',
      'May take too long to decide',
      'Tendency to over-analyze',
      'May resist change',
      'Could be seen as inflexible'
    ],
    idealConditions: [
      'Time to think and analyze',
      'Access to complete information',
      'Structured environment',
      'Quality-focused culture',
      'Minimal interruptions',
      'Clear processes and procedures'
    ],
    stressPatterns: [
      'Becomes more withdrawn',
      'Increases analysis paralysis',
      'Shows more criticism',
      'Becomes rigid in thinking',
      'May procrastinate',
      'Tends to avoid social interaction'
    ],
    communicationWith: {
      director: 'Provide data quickly, be concise, focus on key points',
      socializer: 'Allow for relationship building, be patient with their energy',
      thinker: 'Share detailed analysis, be systematic, respect their process',
      supporter: 'Be patient, show data behind decisions, build trust slowly'
    }
  },
  {
    id: 'supporter',
    name: 'The Supporter',
    description: 'Empathetic, team-oriented, and harmony-seeking communication style',
    characteristics: [
      'Empathetic and caring',
      'Team-oriented',
      'Collaborative communication',
      'Harmony seeking',
      'Patient and steady',
      'Relationship focused'
    ],
    strengths: [
      'Excellent listener',
      'Builds team cohesion',
      'Skilled at mediation',
      'Reliable and dependable',
      'Shows genuine care for others',
      'Creates safe communication environment'
    ],
    blindSpots: [
      'May avoid difficult conversations',
      'Can be indecisive',
      'May not assert own needs',
      'Tendency to take on too much',
      'May resist necessary changes',
      'Could be seen as too accommodating'
    ],
    idealConditions: [
      'Collaborative team environment',
      'Clear expectations',
      'Stable, predictable environment',
      'Opportunities to help others',
      'Recognition for contributions',
      'Minimal conflict'
    ],
    stressPatterns: [
      'Becomes more accommodating',
      'May withdraw from conflict',
      'Shows increased worry',
      'Becomes less decisive',
      'May take on others\' problems',
      'Tends to internalize stress'
    ],
    communicationWith: {
      director: 'Be respectful, show appreciation, allow time for processing',
      socializer: 'Be warm and friendly, show interest in their wellbeing',
      thinker: 'Be patient, provide clear information, avoid rushing',
      supporter: 'Be collaborative, show empathy, work together on solutions'
    }
  }
];
