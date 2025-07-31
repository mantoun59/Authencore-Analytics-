// Comprehensive assessment data with descriptions and dimensions
export interface AssessmentDimension {
  name: string;
  description: string;
}

export interface AssessmentData {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  questions: number;
  description: string;
  detailedDescription: string;
  whatItMeasures: string[];
  dimensions: AssessmentDimension[];
  features: string[];
  badges: string[];
  route: string;
  icon: string;
  color: string;
  gradient: string;
}

export const assessmentsData: AssessmentData[] = [
  {
    id: 'technology-integration',
    title: 'Technology Integration & Boundary Management',
    subtitle: 'Master Your Digital Workplace Balance',
    price: '$9.99',
    duration: '10 minutes',
    questions: 25,
    description: 'Assess your relationship with technology in the workplace and develop strategies for optimal integration while maintaining healthy boundaries.',
    detailedDescription: 'The Technology Integration & Boundary Management assessment evaluates how effectively you integrate technology into your work while maintaining healthy boundaries. Based on Boundary Theory and Technology Acceptance Model, this assessment provides insights into your digital usage patterns, boundary-setting skills, and overall tech-life balance.',
    whatItMeasures: [
      'Technology usage patterns and intentionality',
      'Digital boundary setting and maintenance',
      'Tech-life balance and well-being integration',
      'Productivity impact of technology use',
      'Stress management in digital environments'
    ],
    dimensions: [
      { name: 'Usage Patterns', description: 'How you interact with and utilize technology in your daily work' },
      { name: 'Digital Boundaries', description: 'Your ability to set and maintain healthy limits around technology use' },
      { name: 'Tech-Life Balance', description: 'How well you integrate technology while maintaining personal well-being' },
      { name: 'Productivity Impact', description: 'The effect of technology on your work effectiveness and goal achievement' }
    ],
    features: [
      'Digital Usage Pattern Analysis',
      'Boundary Setting Assessment', 
      'Tech-Life Balance Evaluation',
      'Productivity Enhancement Strategies'
    ],
    badges: ['Professional Development', 'Workplace Well-being', 'Digital Balance'],
    route: '/technology-integration',
    icon: 'smartphone',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'communication-competency',
    title: 'Professional Communication Competencies',
    subtitle: 'Enhance Your Communication Effectiveness', 
    price: '$9.99',
    duration: '12 minutes',
    questions: 30,
    description: 'Evaluate your communication skills across various professional contexts and identify opportunities for enhanced effectiveness.',
    detailedDescription: 'The Professional Communication Competencies assessment measures your effectiveness across four key communication dimensions using evidence-based research. This assessment helps you understand your communication style preferences and provides targeted recommendations for improving your professional communication impact.',
    whatItMeasures: [
      'Direct vs indirect communication effectiveness',
      'Formal vs informal style adaptability',
      'Expressive vs reserved communication expression',
      'Task vs relationship focus in communication',
      'Overall communication competence and impact'
    ],
    dimensions: [
      { name: 'Direct vs Indirect', description: 'Your preference for straightforward versus diplomatic communication approaches' },
      { name: 'Formal vs Informal', description: 'Your comfort level with structured versus casual communication styles' },
      { name: 'Expressive vs Reserved', description: 'Your tendency toward animated versus controlled communication expression' },
      { name: 'Task vs Relationship', description: 'Your focus on objectives versus interpersonal connections in communication' }
    ],
    features: [
      'Communication Style Analysis',
      'Context Adaptability Assessment',
      'Effectiveness Measurement', 
      'Professional Growth Recommendations'
    ],
    badges: ['Communication Skills', 'Professional Development', 'Leadership Growth'],
    route: '/communication-competency',
    icon: 'message-circle',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'leadership-behavior',
    title: 'Leadership Behaviors & Effectiveness',
    subtitle: 'Develop Your Leadership Approach',
    price: '$9.99', 
    duration: '17 minutes',
    questions: 40,
    description: 'Measure your leadership behaviors across different styles and situations to enhance your leadership effectiveness.',
    detailedDescription: 'The Leadership Behaviors & Effectiveness assessment evaluates your leadership approach across six research-based leadership styles. Using Transformational Leadership Theory, this assessment identifies your primary and secondary leadership styles while providing insights into your overall leadership effectiveness and development opportunities.',
    whatItMeasures: [
      'Visionary leadership capabilities and inspiration skills',
      'Coaching leadership approach and development focus',
      'Affiliative leadership and relationship building',
      'Democratic leadership and collaborative decision-making',
      'Pacesetting leadership and performance standards',
      'Commanding leadership and directive approaches'
    ],
    dimensions: [
      { name: 'Visionary Leadership', description: 'Inspiring others with compelling visions and driving change through shared purpose' },
      { name: 'Coaching Leadership', description: 'Developing individual capabilities and supporting personal/professional growth' },
      { name: 'Affiliative Leadership', description: 'Building strong relationships and creating harmony within teams' },
      { name: 'Democratic Leadership', description: 'Valuing input and making decisions through collaboration and consensus' },
      { name: 'Pacesetting Leadership', description: 'Setting high standards and modeling excellence while expecting high performance' },
      { name: 'Commanding Leadership', description: 'Providing clear direction and making decisive decisions in critical situations' }
    ],
    features: [
      'Leadership Style Identification',
      'Situational Effectiveness Analysis',
      'Behavioral Pattern Assessment',
      'Development Action Planning'
    ],
    badges: ['Leadership Development', 'Management Skills', 'Team Leadership'],
    route: '/leadership-behavior',
    icon: 'crown',
    color: 'purple',
    gradient: 'from-purple-500 to-violet-500'
  },
  {
    id: 'work-values',
    title: 'Work Values & Motivation',
    subtitle: 'Discover What Drives You Professionally',
    price: '$9.99',
    duration: '16 minutes', 
    questions: 45,
    description: 'Identify your core work values and motivational drivers to find greater career satisfaction and alignment.',
    detailedDescription: 'The Work Values & Motivation assessment identifies your core professional values using the Super Work Values Inventory framework combined with Self-Determination Theory. This comprehensive evaluation helps you understand what motivates you at work and guides career decisions that align with your intrinsic values.',
    whatItMeasures: [
      'Achievement and recognition motivation',
      'Autonomy and independence preferences',
      'Social impact and service orientation',
      'Security and stability priorities',
      'Growth and learning drive',
      'Work-life integration values',
      'Innovation and creativity motivation',
      'Leadership and influence aspirations',
      'Collaboration and teamwork preferences'
    ],
    dimensions: [
      { name: 'Achievement & Recognition', description: 'Motivation for accomplishment, success, and acknowledgment of your contributions' },
      { name: 'Autonomy & Independence', description: 'Preference for self-direction, decision-making authority, and flexible work arrangements' },
      { name: 'Social Impact & Service', description: 'Drive to make a meaningful difference and contribute to society or community' },
      { name: 'Security & Stability', description: 'Priority on job security, predictable income, and stable work environments' },
      { name: 'Growth & Learning', description: 'Motivation for continuous development, skill acquisition, and intellectual challenge' },
      { name: 'Work-Life Integration', description: 'Importance of balance between professional and personal life priorities' },
      { name: 'Innovation & Creativity', description: 'Drive for creative expression, novel solutions, and innovative thinking' },
      { name: 'Leadership & Influence', description: 'Motivation to guide others, make decisions, and have organizational impact' },
      { name: 'Collaboration & Teamwork', description: 'Preference for working with others and building strong team relationships' }
    ],
    features: [
      'Values Hierarchy Mapping',
      'Motivation Driver Analysis',
      'Career Alignment Assessment',
      'Workplace Fit Evaluation'
    ],
    badges: ['Career Development', 'Values Alignment', 'Personal Growth'],
    route: '/work-values',
    icon: 'heart',
    color: 'red',
    gradient: 'from-red-500 to-rose-500'
  },
  {
    id: 'work-preferences',
    title: 'Individual Work Preferences',
    subtitle: 'Optimize Your Work Environment',
    price: '$9.99',
    duration: '15 minutes',
    questions: 35,
    description: 'Assess your individual workplace preferences to identify optimal environments for maximum productivity and satisfaction.',
    detailedDescription: 'The Individual Work Preferences assessment evaluates your preferences across five key workplace dimensions using the Job Characteristics Model. This assessment helps you understand your ideal work environment, communication preferences, career expectations, and optimal conditions for professional success.',
    whatItMeasures: [
      'Work environment and structure preferences',
      'Communication style and frequency preferences',
      'Career expectations and advancement priorities',
      'Technology integration and digital work preferences',
      'Multigenerational collaboration strategies and approaches'
    ],
    dimensions: [
      { name: 'Work Preferences', description: 'Your preferences for work structure, environment, and task organization' },
      { name: 'Communication Styles', description: 'Your preferred methods and frequency of professional communication' },
      { name: 'Career Expectations', description: 'Your expectations for career growth, advancement, and professional development' },
      { name: 'Technology Integration', description: 'Your comfort and preferences for technology use in work environments' },
      { name: 'Multigenerational Strategies', description: 'Your approach to working effectively across different generations' }
    ],
    features: [
      'Work Environment Analysis',
      'Communication Preference Assessment',
      'Career Expectation Evaluation',
      'Multigenerational Strategy Planning'
    ],
    badges: ['Workplace Optimization', 'Professional Preferences', 'Career Planning'],
    route: '/work-preferences',
    icon: 'settings',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'career-launch',
    title: 'CareerLaunch',
    subtitle: 'Career Discovery & Planning',
    price: '$9.99',
    duration: '30-35 minutes',
    questions: 144,
    description: 'Comprehensive career discovery assessment analyzing interests, aptitudes, personality, and values with personalized insights',
    detailedDescription: 'The CareerLaunch assessment is a comprehensive career discovery tool that combines multiple validated instruments to provide deep insights into your career potential. Using the RIASEC model (Realistic, Investigative, Artistic, Social, Enterprising, Conventional), this assessment evaluates your interests, aptitudes, personality traits, and work values to generate personalized career recommendations.',
    whatItMeasures: [
      'Career interests using the RIASEC framework',
      'Cognitive aptitudes and problem-solving abilities',
      'Personality traits relevant to work performance',
      'Work values and motivational drivers',
      'Learning style preferences',
      'Leadership potential and interpersonal skills'
    ],
    dimensions: [
      { name: 'Realistic', description: 'Preference for working with tools, machines, and physical materials' },
      { name: 'Investigative', description: 'Interest in research, analysis, and intellectual challenges' },
      { name: 'Artistic', description: 'Creative expression and aesthetic appreciation' },
      { name: 'Social', description: 'Helping, teaching, and working with people' },
      { name: 'Enterprising', description: 'Leadership, persuasion, and business activities' },
      { name: 'Conventional', description: 'Organization, data management, and structured tasks' },
      { name: 'Cognitive Ability', description: 'Problem-solving and analytical thinking capacity' },
      { name: 'Work Values', description: 'What motivates and drives career satisfaction' },
      { name: 'Personality Fit', description: 'How personality aligns with different work environments' }
    ],
    features: [
      'RIASEC interest profiling',
      'Cognitive aptitude assessment',
      'Personality and work style analysis',
      'Career-value alignment scoring',
      'Personalized career recommendations',
      'Professional development action plans',
      'Comprehensive PDF report',
      'Career pathway suggestions'
    ],
    badges: ['Best Value', 'RIASEC Profile', 'PDF Reports'],
    route: '/career-launch',
    icon: 'Rocket',
    color: 'blue',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 'cair-personality',
    title: 'CAIR+ Personality',
    subtitle: 'Advanced Personality Assessment',
    price: '$29.99',
    duration: '25-30 minutes',
    questions: 120,
    description: 'Comprehensive personality assessment with 100 personality questions + 20 validity checks across 4 key dimensions',
    detailedDescription: 'The CAIR+ Personality Assessment is a scientifically validated personality evaluation tool that measures four core dimensions crucial for workplace success. With 100 personality questions and 20 validity detection mechanisms, this comprehensive assessment provides reliable insights into personality traits that predict performance, job satisfaction, and team dynamics.',
    whatItMeasures: [
      'Conscientiousness and work ethic',
      'Agreeableness and interpersonal effectiveness',
      'Innovation and creative thinking',
      'Resilience and stress management',
      'Response validity and social desirability',
      'Workplace behavior predictions'
    ],
    dimensions: [
      { name: 'Conscientiousness', description: 'Organization, self-discipline, and goal-directed behavior' },
      { name: 'Agreeableness', description: 'Cooperation, trust, and consideration for others' },
      { name: 'Innovation', description: 'Openness to new ideas, creativity, and adaptability' },
      { name: 'Resilience', description: 'Emotional stability and ability to cope with stress' },
      { name: 'Response Validity', description: 'Measures honesty and consistency in responses' },
      { name: 'Social Desirability', description: 'Tendency to present oneself favorably' }
    ],
    features: [
      'Validity detection algorithms',
      'Percentile-based scoring',
      'Workplace behavior predictions',
      'Team compatibility analysis',
      'Leadership potential assessment',
      'Dual reporting (candidate & employer)',
      'Research-based interpretations',
      'Cultural bias mitigation'
    ],
    badges: ['Premium', 'Validity Detection', 'Percentile Scoring'],
    route: '/cair-assessment',
    icon: 'Brain',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'stress-resilience',
    title: 'Burnout Prevention Index',
    subtitle: 'Proactive Burnout Prevention Assessment',
    price: '$39.99',
    duration: '25-30 minutes',
    questions: 102,
    description: 'Comprehensive burnout prevention assessment evaluating stress levels, risk factors, and resilience capabilities across 7 dimensions',
    detailedDescription: 'The Burnout Prevention Index assessment evaluates your current stress levels, risk factors, and resilience capabilities to prevent burnout proactively. Covering 7 dimensions, it empowers you to maintain high performance with optimal health and wellbeing.',
    whatItMeasures: [
      'Current stress levels and burnout risk factors',
      'Workload management and task prioritization abilities',
      'Emotional exhaustion and depletion levels',
      'Personal efficacy and job capability beliefs',
      'Support systems strength and accessibility',
      'Work-life integration and balance patterns',
      'Coping strategies and stress responses'
    ],
    dimensions: [
      { name: 'Workload Management', description: 'Ability to prioritise, delegate, and manage tasks effectively' },
      { name: 'Emotional Exhaustion', description: 'Current levels of emotional depletion and fatigue' },
      { name: 'Personal Efficacy', description: 'Belief in your capability to handle job demands' },
      { name: 'Support Systems', description: 'Strength and accessibility of social and professional support' },
      { name: 'Work-Life Integration', description: 'Balance and harmony between personal and professional life' },
      { name: 'Coping Strategies', description: 'Healthy responses to stress and adversity' },
      { name: 'Wellbeing Practices', description: 'Routines promoting physical, mental, and emotional wellbeing' }
    ],
    features: [
      'Comprehensive burnout risk assessment',
      'Proactive prevention strategies',
      'Workload management evaluation',
      'Emotional exhaustion measurement',
      'Personal efficacy analysis',
      'Support systems assessment',
      'Work-life integration scoring',
      'Personalized wellness recommendations'
    ],
    badges: ['Premium', 'Burnout Prevention', '7 Dimensions'],
    route: '/stress-resilience',
    icon: 'Shield',
    color: 'green',
    gradient: 'from-green-500 to-teal-500'
  },
  {
    id: 'cultural-intelligence',
    title: 'Cultural Intelligence',
    subtitle: 'Global Business Competency',
    price: '$19.99',
    duration: '20-25 minutes',
    questions: 60,
    description: 'Comprehensive cultural intelligence assessment with real-world scenarios and global business challenges',
    detailedDescription: 'The Cultural Intelligence Assessment measures your ability to function effectively in culturally diverse environments. Through real-world business scenarios, email adaptation challenges, and cross-cultural problem-solving tasks, this assessment evaluates your cultural competency across multiple dimensions.',
    whatItMeasures: [
      'Cultural knowledge and awareness',
      'Cross-cultural communication effectiveness',
      'Adaptation to cultural differences',
      'Global business acumen',
      'Cultural sensitivity and respect',
      'International collaboration skills'
    ],
    dimensions: [
      { name: 'Cultural Knowledge', description: 'Understanding of different cultural norms and practices' },
      { name: 'Cultural Empathy', description: 'Ability to understand and relate to different cultural perspectives' },
      { name: 'Cross-Cultural Communication', description: 'Effectiveness in communicating across cultures' },
      { name: 'Cultural Adaptation', description: 'Flexibility in adjusting behavior to cultural contexts' },
      { name: 'Global Mindset', description: 'Openness to and appreciation of cultural diversity' },
      { name: 'International Business Skills', description: 'Competency in global business practices' }
    ],
    features: [
      'Real-world cultural scenarios',
      'Email adaptation challenges',
      'Global meeting scheduling simulations',
      'Cross-cultural negotiation scenarios',
      'Cultural competency mapping',
      'International collaboration insights',
      'Global business readiness score',
      'Cultural development recommendations'
    ],
    badges: ['Global', '60+ Scenarios', '4 CQ Dimensions'],
    route: '/cultural-intelligence',
    icon: 'Globe',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'communication-styles',
    title: 'Communication Styles',
    subtitle: 'Advanced Communication Analysis',
    price: '$24.99',
    duration: '18-22 minutes',
    questions: 80,
    description: 'Comprehensive communication assessment with linguistic analysis and real-time simulations',
    detailedDescription: 'The Communication Styles Assessment provides deep insights into your communication DNA, analyzing how you express ideas, process information, and interact with others. Using advanced linguistic analysis and interactive simulations, this assessment reveals your unique communication patterns and effectiveness across different channels and contexts.',
    whatItMeasures: [
      'Communication style preferences',
      'Channel effectiveness patterns',
      'Conflict resolution approaches',
      'Team collaboration dynamics',
      'Persuasion and influence strategies',
      'Listening and empathy skills'
    ],
    dimensions: [
      { name: 'Directness', description: 'Preference for direct vs. indirect communication' },
      { name: 'Expressiveness', description: 'Emotional expression and enthusiasm in communication' },
      { name: 'Formality', description: 'Preference for formal vs. informal communication styles' },
      { name: 'Detail Orientation', description: 'Focus on big picture vs. specific details' },
      { name: 'Listening Style', description: 'Active listening patterns and engagement' },
      { name: 'Conflict Approach', description: 'Strategies for handling disagreements and conflicts' },
      { name: 'Channel Preference', description: 'Effectiveness across different communication mediums' },
      { name: 'Influence Style', description: 'Methods of persuasion and influence' }
    ],
    features: [
      'Communication DNA profiling',
      'Channel effectiveness mapping',
      'Interactive communication simulations',
      'Conflict resolution style analysis',
      'Team compatibility insights',
      'Linguistic pattern analysis',
      'Persuasion effectiveness assessment',
      'Professional communication recommendations'
    ],
    badges: ['Advanced', 'Linguistic Analysis', 'Team Compatibility'],
    route: '/communication-assessment',
    icon: 'MessageSquare',
    color: 'indigo',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence',
    subtitle: 'EQ Assessment & Development',
    price: '$24.99',
    duration: '12-15 minutes',
    questions: 60,
    description: 'Comprehensive emotional intelligence assessment measuring self-awareness, empathy, and social skills',
    detailedDescription: 'The Emotional Intelligence Assessment evaluates your ability to understand, manage, and effectively use emotions in yourself and others. This scientifically-based assessment measures key EQ competencies that are critical for leadership, teamwork, and professional success.',
    whatItMeasures: [
      'Self-awareness and emotional recognition',
      'Self-regulation and impulse control',
      'Empathy and social awareness',
      'Relationship management skills',
      'Emotional decision-making',
      'Stress and emotion management'
    ],
    dimensions: [
      { name: 'Self-Awareness', description: 'Recognition and understanding of own emotions' },
      { name: 'Self-Regulation', description: 'Management and control of emotional responses' },
      { name: 'Motivation', description: 'Internal drive and emotional resilience' },
      { name: 'Empathy', description: 'Understanding and sensing others\' emotions' },
      { name: 'Social Skills', description: 'Managing relationships and social interactions' },
      { name: 'Emotional Decision-Making', description: 'Using emotions effectively in decision processes' }
    ],
    features: [
      'Comprehensive EQ profiling',
      'Workplace emotional scenarios',
      'Leadership EQ assessment',
      'Team emotional dynamics',
      'Stress management evaluation',
      'Empathy and social awareness measurement',
      'EQ development recommendations',
      'Emotional competency mapping'
    ],
    badges: ['EQ Focus', 'EQ Dimensions', 'Workplace Applications'],
    route: '/emotional-intelligence',
    icon: 'Heart',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500'
  },
  {
    id: 'faith-values',
    title: 'Faith & Values',
    subtitle: 'Comprehensive Values Alignment Assessment',
    price: '$19.99',
    duration: '25-30 minutes',
    questions: 90,
    description: 'Comprehensive 90-question assessment using validated instruments to analyze faith-based values alignment across 42 dimensions',
    detailedDescription: 'The Faith & Values Alignment Index (FVAI) is a comprehensive 90-question assessment using validated psychological instruments to understand how your daily thoughts, decisions, and behaviours align with your core faith-based values. Covering 42 detailed dimensions across spiritual foundations, moral values, workplace ethics, and life integration, FVAI empowers personal growth, spiritual coaching, and faith-based leadership development through evidence-based insights.',
    whatItMeasures: [
      'Spiritual/Faith foundations and practices (12 dimensions)',
      'Universal human values and moral frameworks (8 dimensions)',
      'Moral foundations and ethical reasoning (6 dimensions)',
      'Workplace values and professional ethics (8 dimensions)',
      'Work-life integration and spiritual calling (4 dimensions)',
      'Response validity and assessment integrity (4 dimensions)'
    ],
    dimensions: [
      { name: 'Spiritual Foundations', description: 'Core spiritual beliefs, practices, and relationship with the divine (12 dimensions)' },
      { name: 'Universal Values', description: 'Fundamental human values that guide decision-making and behavior (8 dimensions)' },
      { name: 'Moral Foundations', description: 'Ethical principles and moral reasoning frameworks (6 dimensions)' },
      { name: 'Workplace Ethics', description: 'Professional integrity and faith-based workplace behavior (8 dimensions)' },
      { name: 'Work-Life Integration', description: 'Balance between spiritual calling and professional responsibilities (4 dimensions)' },
      { name: 'Response Validity', description: 'Assessment integrity and response authenticity measures (4 dimensions)' }
    ],
    features: [
      'Validated psychological instruments',
      'Multiple assessment techniques (Likert, ranking, scenarios)',
      'Comprehensive 42-dimension analysis',
      'Advanced distortion detection',
      'Faith-based leadership insights',
      'Spiritual growth recommendations',
      'Professional coaching guidance',
      'Evidence-based interpretations'
    ],
    badges: ['90 Questions', '42 Dimensions', 'Validated Instruments'],
    route: '/faith-values',
    icon: 'Lightbulb',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'genz-assessment',
    title: 'Gen Z Workplace',
    subtitle: 'Generational Workplace Assessment',
    price: '$9.99',
    duration: '14-18 minutes',
    questions: 45,
    description: 'Specialized assessment for Gen Z workplace preferences, values, and career expectations',
    detailedDescription: 'The Gen Z Workplace Assessment is specifically designed to understand the unique workplace preferences, communication styles, and career expectations of Generation Z professionals. This assessment provides insights into how Gen Z individuals thrive in modern workplace environments.',
    whatItMeasures: [
      'Digital-first work preferences',
      'Work-life balance priorities',
      'Career advancement expectations',
      'Communication style preferences',
      'Values-driven decision making',
      'Technology adoption patterns'
    ],
    dimensions: [
      { name: 'Digital Nativity', description: 'Comfort and preference for digital-first work environments' },
      { name: 'Work-Life Integration', description: 'Approach to balancing personal and professional life' },
      { name: 'Purpose-Driven Work', description: 'Importance of meaningful and impactful work' },
      { name: 'Collaborative Style', description: 'Preferences for teamwork and collaboration' },
      { name: 'Learning Agility', description: 'Approach to continuous learning and skill development' },
      { name: 'Career Expectations', description: 'Views on career progression and success' }
    ],
    features: [
      'Generational workplace preferences',
      'Digital communication assessment',
      'Work-life balance evaluation',
      'Career expectation analysis',
      'Values-driven work assessment',
      'Technology adoption profiling',
      'Gen Z career development insights',
      'Generational team dynamics'
    ],
    badges: ['Gen Z Focus', 'Digital-First', 'Purpose-Driven'],
    route: '/genz-assessment',
    icon: 'Zap',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    id: 'digital-wellness',
    title: 'Digital Wellness',
    subtitle: 'Digital Health & Productivity',
    price: '$12.99',
    duration: '10-12 minutes',
    questions: 60,
    description: 'Assessment of digital habits, screen time impact, and technology wellness in professional settings',
    detailedDescription: 'The Digital Wellness Assessment evaluates your relationship with technology and its impact on productivity, well-being, and professional performance. This assessment provides insights into digital habits and offers strategies for optimizing technology use in work environments.',
    whatItMeasures: [
      'Digital usage patterns and habits',
      'Technology impact on productivity',
      'Digital stress and fatigue levels',
      'Information overload management',
      'Digital boundary setting',
      'Technology-enabled wellness'
    ],
    dimensions: [
      { name: 'Digital Consumption', description: 'Patterns and volume of digital media consumption' },
      { name: 'Technology Productivity', description: 'How technology enhances or hinders productivity' },
      { name: 'Digital Stress', description: 'Stress and anxiety related to technology use' },
      { name: 'Information Management', description: 'Ability to process and organize digital information' },
      { name: 'Digital Boundaries', description: 'Setting healthy limits on technology use' },
      { name: 'Tech-Life Balance', description: 'Integration of technology with personal well-being' }
    ],
    features: [
      'Digital habits analysis',
      'Screen time impact assessment',
      'Productivity optimization insights',
      'Digital stress evaluation',
      'Technology wellness recommendations',
      'Information overload management',
      'Digital boundary strategies',
      'Workplace technology guidelines'
    ],
    badges: ['Digital Health', 'Productivity Focus', 'Wellness-Based'],
    route: '/digital-wellness',
    icon: 'Monitor',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'leadership-assessment',
    title: 'Authentic Leadership Assessment',
    subtitle: 'Comprehensive Leadership Evaluation',
    price: '$34.99',
    duration: '25-30 minutes',
    questions: 120,
    description: 'Comprehensive authentic leadership assessment evaluating management style, team effectiveness, and leadership potential',
    detailedDescription: 'The Authentic Leadership Assessment provides a comprehensive evaluation of leadership capabilities across multiple dimensions. This assessment combines behavioral analysis, situational judgment, and 360-degree perspectives to provide insights into current leadership effectiveness and development opportunities.',
    whatItMeasures: [
      'Leadership style and approach',
      'Team management effectiveness',
      'Strategic thinking capabilities',
      'Decision-making processes',
      'Communication and influence skills',
      'Change management abilities'
    ],
    dimensions: [
      { name: 'Visionary Leadership', description: 'Ability to create and communicate compelling visions' },
      { name: 'People Leadership', description: 'Skills in managing, developing, and inspiring teams' },
      { name: 'Strategic Thinking', description: 'Capacity for long-term planning and strategic analysis' },
      { name: 'Decision Making', description: 'Quality and effectiveness of leadership decisions' },
      { name: 'Influence & Communication', description: 'Ability to persuade and communicate effectively' },
      { name: 'Change Leadership', description: 'Leading organizations through change and transformation' },
      { name: 'Emotional Leadership', description: 'Using emotional intelligence in leadership contexts' },
      { name: 'Results Orientation', description: 'Focus on achieving results and performance outcomes' }
    ],
    features: [
      'Comprehensive leadership profiling',
      'Management style assessment',
      'Team effectiveness evaluation',
      'Strategic thinking analysis',
      'Leadership competency mapping',
      '360-degree leadership insights',
      'Leadership development planning',
      'Executive readiness assessment'
    ],
    badges: ['Premium', 'Comprehensive', '360-Degree'],
    route: '/leadership-assessment',
    icon: 'Users',
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-500'
  }
];

// Helper functions to get assessment data
export const getAssessmentById = (id: string): AssessmentData | undefined => {
  return assessmentsData.find(assessment => assessment.id === id);
};

export const getAssessmentByRoute = (route: string): AssessmentData | undefined => {
  return assessmentsData.find(assessment => assessment.route === route);
};

export const getAssessmentsByCategory = (category: string): AssessmentData[] => {
  // Could be extended to filter by categories if needed
  return assessmentsData;
};

export default assessmentsData;