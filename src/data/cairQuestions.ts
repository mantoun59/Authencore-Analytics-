export interface CAIRQuestion {
  id: string;
  type: 'forced_choice' | 'distortion';
  questionText: string;
  optionA: string;
  optionB: string;
  dimension: 'conscientiousness' | 'agreeableness' | 'innovation' | 'resilience' | 'validity';
  subdimension?: string;
  reverse?: boolean; // For reverse-scored items
  distortionType?: 'fake_good' | 'fake_bad' | 'inconsistency' | 'random_check';
}

// Core Personality Questions (100 forced-choice)
export const personalityQuestions: CAIRQuestion[] = [
  // CONSCIENTIOUSNESS (25 questions)
  {
    id: 'c001',
    type: 'forced_choice',
    questionText: 'When planning projects, I prefer to:',
    optionA: 'Create detailed timelines and stick to them',
    optionB: 'Keep flexible and adapt as needed',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'c002',
    type: 'forced_choice',
    questionText: 'My workspace is typically:',
    optionA: 'Very organized and clean',
    optionB: 'Creative chaos that works for me',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'c003',
    type: 'forced_choice',
    questionText: 'When I commit to something, I:',
    optionA: 'Always follow through completely',
    optionB: 'Do my best but circumstances change',
    dimension: 'conscientiousness',
    subdimension: 'reliability'
  },
  {
    id: 'c004',
    type: 'forced_choice',
    questionText: 'I prefer to complete tasks:',
    optionA: 'Well before the deadline',
    optionB: 'Right when they\'re due',
    dimension: 'conscientiousness',
    subdimension: 'reliability'
  },
  {
    id: 'c005',
    type: 'forced_choice',
    questionText: 'When setting goals, I:',
    optionA: 'Break them into specific, measurable steps',
    optionB: 'Keep them flexible and aspirational',
    dimension: 'conscientiousness',
    subdimension: 'goal_orientation'
  },
  {
    id: 'c006',
    type: 'forced_choice',
    questionText: 'I pay attention to details:',
    optionA: 'Meticulously - every detail matters',
    optionB: 'Enough to get the big picture right',
    dimension: 'conscientiousness',
    subdimension: 'attention_to_detail'
  },
  {
    id: 'c007',
    type: 'forced_choice',
    questionText: 'My approach to rules is:',
    optionA: 'Rules exist for good reasons and should be followed',
    optionB: 'Rules are guidelines that can be adapted',
    dimension: 'conscientiousness',
    subdimension: 'rule_following'
  },
  {
    id: 'c008',
    type: 'forced_choice',
    questionText: 'When I make mistakes, I:',
    optionA: 'Analyze what went wrong and create prevention systems',
    optionB: 'Learn from it and move forward',
    dimension: 'conscientiousness',
    subdimension: 'self_improvement'
  },
  {
    id: 'c009',
    type: 'forced_choice',
    questionText: 'I track my progress on important tasks:',
    optionA: 'Daily with specific metrics',
    optionB: 'Periodically when I remember',
    dimension: 'conscientiousness',
    subdimension: 'self_monitoring'
  },
  {
    id: 'c010',
    type: 'forced_choice',
    questionText: 'When starting a new job, I:',
    optionA: 'Research everything thoroughly before day one',
    optionB: 'Learn as I go and ask questions',
    dimension: 'conscientiousness',
    subdimension: 'preparation'
  },

  // AGREEABLENESS (25 questions)
  {
    id: 'a001',
    type: 'forced_choice',
    questionText: 'In team conflicts, I typically:',
    optionA: 'Try to find solutions that work for everyone',
    optionB: 'Focus on what\'s best for the project',
    dimension: 'agreeableness',
    subdimension: 'cooperation'
  },
  {
    id: 'a002',
    type: 'forced_choice',
    questionText: 'When someone asks for help, I:',
    optionA: 'Always try to assist if I can',
    optionB: 'Help if it fits my schedule',
    dimension: 'agreeableness',
    subdimension: 'helpfulness'
  },
  {
    id: 'a003',
    type: 'forced_choice',
    questionText: 'I believe most people are:',
    optionA: 'Fundamentally good and trustworthy',
    optionB: 'Generally okay but you need to be careful',
    dimension: 'agreeableness',
    subdimension: 'trust'
  },
  {
    id: 'a004',
    type: 'forced_choice',
    questionText: 'When giving feedback, I:',
    optionA: 'Focus on being gentle and supportive',
    optionB: 'Focus on being direct and honest',
    dimension: 'agreeableness',
    subdimension: 'compassion'
  },
  {
    id: 'a005',
    type: 'forced_choice',
    questionText: 'In negotiations, I prefer to:',
    optionA: 'Find win-win solutions for all parties',
    optionB: 'Achieve the best outcome for my side',
    dimension: 'agreeableness',
    subdimension: 'cooperation'
  },
  {
    id: 'a006',
    type: 'forced_choice',
    questionText: 'When someone is upset, I:',
    optionA: 'Feel their emotions and want to comfort them',
    optionB: 'Stay calm and offer practical solutions',
    dimension: 'agreeableness',
    subdimension: 'empathy'
  },
  {
    id: 'a007',
    type: 'forced_choice',
    questionText: 'I handle criticism by:',
    optionA: 'Listening carefully and looking for truth in it',
    optionB: 'Evaluating if the critic has valid expertise',
    dimension: 'agreeableness',
    subdimension: 'modesty'
  },
  {
    id: 'a008',
    type: 'forced_choice',
    questionText: 'My communication style is:',
    optionA: 'Warm and personal',
    optionB: 'Professional and efficient',
    dimension: 'agreeableness',
    subdimension: 'interpersonal_warmth'
  },
  {
    id: 'a009',
    type: 'forced_choice',
    questionText: 'When leading a team, I:',
    optionA: 'Build consensus and ensure everyone feels heard',
    optionB: 'Make decisions efficiently and communicate clearly',
    dimension: 'agreeableness',
    subdimension: 'consensus_building'
  },
  {
    id: 'a010',
    type: 'forced_choice',
    questionText: 'I prefer workplace environments that are:',
    optionA: 'Collaborative and relationship-focused',
    optionB: 'Results-oriented and performance-focused',
    dimension: 'agreeableness',
    subdimension: 'cooperation'
  },

  // INNOVATION (25 questions)
  {
    id: 'i001',
    type: 'forced_choice',
    questionText: 'When facing a problem, I:',
    optionA: 'Look for creative, unconventional solutions',
    optionB: 'Use proven methods that have worked before',
    dimension: 'innovation',
    subdimension: 'creativity'
  },
  {
    id: 'i002',
    type: 'forced_choice',
    questionText: 'I\'m energized by:',
    optionA: 'Exploring new ideas and possibilities',
    optionB: 'Perfecting existing systems and processes',
    dimension: 'innovation',
    subdimension: 'openness_to_change'
  },
  {
    id: 'i003',
    type: 'forced_choice',
    questionText: 'When learning new skills, I prefer:',
    optionA: 'Experimenting and discovering on my own',
    optionB: 'Following established training programs',
    dimension: 'innovation',
    subdimension: 'learning_style'
  },
  {
    id: 'i004',
    type: 'forced_choice',
    questionText: 'In brainstorming sessions, I:',
    optionA: 'Generate lots of wild, creative ideas',
    optionB: 'Focus on practical, implementable solutions',
    dimension: 'innovation',
    subdimension: 'ideation'
  },
  {
    id: 'i005',
    type: 'forced_choice',
    questionText: 'I approach change as:',
    optionA: 'An exciting opportunity for improvement',
    optionB: 'A necessary challenge to manage carefully',
    dimension: 'innovation',
    subdimension: 'change_tolerance'
  },
  {
    id: 'i006',
    type: 'forced_choice',
    questionText: 'My ideal project involves:',
    optionA: 'Building something completely new',
    optionB: 'Improving something that already exists',
    dimension: 'innovation',
    subdimension: 'innovation_preference'
  },
  {
    id: 'i007',
    type: 'forced_choice',
    questionText: 'When I see inefficiencies, I:',
    optionA: 'Immediately start thinking of better ways',
    optionB: 'Document the issue and work within the system',
    dimension: 'innovation',
    subdimension: 'improvement_orientation'
  },
  {
    id: 'i008',
    type: 'forced_choice',
    questionText: 'I\'m most comfortable with:',
    optionA: 'Ambiguous situations where I can be flexible',
    optionB: 'Clear expectations and defined processes',
    dimension: 'innovation',
    subdimension: 'ambiguity_tolerance',
    reverse: true
  },
  {
    id: 'i009',
    type: 'forced_choice',
    questionText: 'My thinking style is:',
    optionA: 'Abstract and conceptual',
    optionB: 'Concrete and practical',
    dimension: 'innovation',
    subdimension: 'abstract_thinking'
  },
  {
    id: 'i010',
    type: 'forced_choice',
    questionText: 'When taking risks, I:',
    optionA: 'Trust my intuition and go for it',
    optionB: 'Carefully analyze potential outcomes first',
    dimension: 'innovation',
    subdimension: 'risk_taking'
  },

  // RESILIENCE (25 questions)
  {
    id: 'r001',
    type: 'forced_choice',
    questionText: 'When facing setbacks, I:',
    optionA: 'Bounce back quickly and keep moving forward',
    optionB: 'Take time to process before moving on',
    dimension: 'resilience',
    subdimension: 'recovery_speed'
  },
  {
    id: 'r002',
    type: 'forced_choice',
    questionText: 'Under pressure, I:',
    optionA: 'Stay calm and think clearly',
    optionB: 'Feel the stress but push through it',
    dimension: 'resilience',
    subdimension: 'stress_tolerance'
  },
  {
    id: 'r003',
    type: 'forced_choice',
    questionText: 'When things go wrong, I typically think:',
    optionA: 'This is temporary and I can handle it',
    optionB: 'This is really challenging and concerning',
    dimension: 'resilience',
    subdimension: 'optimism'
  },
  {
    id: 'r004',
    type: 'forced_choice',
    questionText: 'My energy level throughout the day is:',
    optionA: 'Consistently high and steady',
    optionB: 'Variable depending on circumstances',
    dimension: 'resilience',
    subdimension: 'energy_management'
  },
  {
    id: 'r005',
    type: 'forced_choice',
    questionText: 'When criticized unfairly, I:',
    optionA: 'Don\'t let it affect my confidence',
    optionB: 'Feel hurt but work through it',
    dimension: 'resilience',
    subdimension: 'emotional_stability'
  },
  {
    id: 'r006',
    type: 'forced_choice',
    questionText: 'In high-stress situations, I:',
    optionA: 'Perform at my best',
    optionB: 'Do well but feel the strain',
    dimension: 'resilience',
    subdimension: 'pressure_performance'
  },
  {
    id: 'r007',
    type: 'forced_choice',
    questionText: 'When facing multiple deadlines, I:',
    optionA: 'Stay organized and handle them systematically',
    optionB: 'Feel overwhelmed but manage to get through',
    dimension: 'resilience',
    subdimension: 'workload_management'
  },
  {
    id: 'r008',
    type: 'forced_choice',
    questionText: 'My overall outlook on life is:',
    optionA: 'Very positive - things usually work out',
    optionB: 'Realistic - life has ups and downs',
    dimension: 'resilience',
    subdimension: 'life_perspective'
  },
  {
    id: 'r009',
    type: 'forced_choice',
    questionText: 'When learning new skills, I:',
    optionA: 'Persist through difficulties without getting discouraged',
    optionB: 'Sometimes get frustrated but keep trying',
    dimension: 'resilience',
    subdimension: 'persistence'
  },
  {
    id: 'r010',
    type: 'forced_choice',
    questionText: 'After a difficult day at work, I:',
    optionA: 'Quickly shift gears and enjoy my personal time',
    optionB: 'Need some time to decompress and reset',
    dimension: 'resilience',
    subdimension: 'work_recovery'
  }
];

// Distortion Scale Questions (20 questions)
export const distortionQuestions: CAIRQuestion[] = [
  // Fake-good detection (8 questions)
  {
    id: 'fg001',
    type: 'distortion',
    questionText: 'I have never told a lie, even a small one.',
    optionA: 'True - I\'ve never lied',
    optionB: 'False - I\'ve told small lies',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg002',
    type: 'distortion',
    questionText: 'I always arrive exactly on time for every appointment.',
    optionA: 'True - Always exactly on time',
    optionB: 'False - Sometimes early or late',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg003',
    type: 'distortion',
    questionText: 'I have never felt angry or irritated at work.',
    optionA: 'True - Never felt anger at work',
    optionB: 'False - I\'ve felt frustrated at times',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg004',
    type: 'distortion',
    questionText: 'I always remember everyone\'s name after meeting them once.',
    optionA: 'True - Perfect memory for names',
    optionB: 'False - Sometimes forget names',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg005',
    type: 'distortion',
    questionText: 'I never procrastinate on any task, no matter how small.',
    optionA: 'True - Never procrastinate',
    optionB: 'False - Sometimes delay tasks',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg006',
    type: 'distortion',
    questionText: 'I have never had a negative thought about a coworker.',
    optionA: 'True - Always positive thoughts',
    optionB: 'False - Had occasional negative thoughts',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg007',
    type: 'distortion',
    questionText: 'I always read every word of every document I sign.',
    optionA: 'True - Read everything completely',
    optionB: 'False - Sometimes skim documents',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg008',
    type: 'distortion',
    questionText: 'I have never made any mistakes in my work.',
    optionA: 'True - Never made mistakes',
    optionB: 'False - Made some mistakes',
    dimension: 'validity',
    distortionType: 'fake_good'
  },

  // Fake-bad detection (4 questions)
  {
    id: 'fb001',
    type: 'distortion',
    questionText: 'I am completely incompetent at everything I do.',
    optionA: 'True - Completely incompetent',
    optionB: 'False - Have some competencies',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'fb002',
    type: 'distortion',
    questionText: 'I never contribute anything valuable to team projects.',
    optionA: 'True - Never contribute value',
    optionB: 'False - Sometimes contribute',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'fb003',
    type: 'distortion',
    questionText: 'I would never be able to learn any new skills.',
    optionA: 'True - Cannot learn new skills',
    optionB: 'False - Can learn some things',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'fb004',
    type: 'distortion',
    questionText: 'I have absolutely no positive qualities as a person.',
    optionA: 'True - No positive qualities',
    optionB: 'False - Have some positive traits',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },

  // Inconsistency checks (4 questions - pairs)
  {
    id: 'ic001',
    type: 'distortion',
    questionText: 'I prefer working with others rather than alone.',
    optionA: 'True - Prefer working with others',
    optionB: 'False - Prefer working alone',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic002',
    type: 'distortion',
    questionText: 'I work better when I can focus by myself.',
    optionA: 'True - Work better alone',
    optionB: 'False - Work better with others',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic003',
    type: 'distortion',
    questionText: 'I like taking on challenging projects.',
    optionA: 'True - Like challenging projects',
    optionB: 'False - Prefer easier projects',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic004',
    type: 'distortion',
    questionText: 'I avoid difficult tasks when possible.',
    optionA: 'True - Avoid difficult tasks',
    optionB: 'False - Don\'t avoid difficult tasks',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },

  // Random response detection (4 questions - obvious answers)
  {
    id: 'rr001',
    type: 'distortion',
    questionText: 'I am currently taking this assessment.',
    optionA: 'True - Taking this assessment',
    optionB: 'False - Not taking this assessment',
    dimension: 'validity',
    distortionType: 'random_check'
  },
  {
    id: 'rr002',
    type: 'distortion',
    questionText: 'The sun rises in the east.',
    optionA: 'True - Sun rises in east',
    optionB: 'False - Sun doesn\'t rise in east',
    dimension: 'validity',
    distortionType: 'random_check'
  },
  {
    id: 'rr003',
    type: 'distortion',
    questionText: 'Water freezes at 0 degrees Celsius.',
    optionA: 'True - Water freezes at 0°C',
    optionB: 'False - Water doesn\'t freeze at 0°C',
    dimension: 'validity',
    distortionType: 'random_check'
  },
  {
    id: 'rr004',
    type: 'distortion',
    questionText: 'There are 12 months in a year.',
    optionA: 'True - 12 months in a year',
    optionB: 'False - Not 12 months in a year',
    dimension: 'validity',
    distortionType: 'random_check'
  }
];

// Combine and shuffle questions for the assessment
export const createAssessmentQuestions = (): CAIRQuestion[] => {
  // Take first 10 from each personality dimension for a 40-question version
  // In production, you'd use all 100
  const selectedPersonality = [
    ...personalityQuestions.filter(q => q.dimension === 'conscientiousness').slice(0, 10),
    ...personalityQuestions.filter(q => q.dimension === 'agreeableness').slice(0, 10),
    ...personalityQuestions.filter(q => q.dimension === 'innovation').slice(0, 10),
    ...personalityQuestions.filter(q => q.dimension === 'resilience').slice(0, 10)
  ];

  // Intersperse distortion questions evenly
  const allQuestions = [...selectedPersonality];
  const distortionInterval = Math.floor(allQuestions.length / distortionQuestions.length);
  
  distortionQuestions.forEach((dq, index) => {
    const insertPosition = (index + 1) * distortionInterval + index;
    allQuestions.splice(insertPosition, 0, dq);
  });

  return allQuestions;
};

export const personalityDimensions = {
  conscientiousness: {
    name: 'Conscientiousness',
    description: 'Organization, reliability, and goal-oriented behavior',
    subdimensions: ['organization', 'reliability', 'goal_orientation', 'attention_to_detail', 'self_discipline']
  },
  agreeableness: {
    name: 'Agreeableness', 
    description: 'Cooperation, trust, and interpersonal harmony',
    subdimensions: ['cooperation', 'trust', 'empathy', 'helpfulness', 'modesty']
  },
  innovation: {
    name: 'Innovation',
    description: 'Creativity, adaptability, and openness to new experiences',
    subdimensions: ['creativity', 'openness_to_change', 'abstract_thinking', 'learning_agility', 'risk_taking']
  },
  resilience: {
    name: 'Resilience',
    description: 'Stress tolerance, emotional stability, and bounce-back ability',
    subdimensions: ['stress_tolerance', 'emotional_stability', 'optimism', 'persistence', 'adaptability']
  }
};