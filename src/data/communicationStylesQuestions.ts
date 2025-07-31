export interface CommunicationQuestion {
  id: string;
  module: 'style-identification' | 'linguistic-analysis' | 'interactive-simulations' | 'adaptive-scenarios';
  dimension: 'assertiveness' | 'expressiveness' | 'information-processing' | 'channel-preferences' | 'listening-patterns' | 'influence-strategies' | 'conflict-communication';
  type: 'multiple-choice' | 'scenario' | 'written-response' | 'ranking' | 'simulation';
  question: string;
  context?: string;
  options?: string[];
  prompt?: string;
  timeLimit?: number;
  weight: number;
  reverseScored?: boolean; // For consistency validation
  attentionCheck?: boolean; // For attention validation
}

export const communicationStylesQuestions: CommunicationQuestion[] = [
  // MODULE 1: STYLE IDENTIFICATION (35 questions)
  // Communication Style Preferences - Assertiveness Spectrum (15 questions)
  {
    id: 'cs1',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'In a team meeting, you strongly disagree with the proposed solution. What do you do?',
    context: 'Team Meeting Disagreement',
    options: [
      'Immediately voice your differing opinion with specific concerns',
      'Wait for a break to speak privately with the key decision maker',
      'Send a follow-up email with your thoughts and alternatives',
      'Ask clarifying questions to better understand the rationale'
    ],
    weight: 1.2
  },
  {
    id: 'cs2',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When someone interrupts you during a presentation, you typically:',
    options: [
      'Firmly but politely redirect attention back to your point',
      'Acknowledge their input and incorporate it into your flow',
      'Stop and fully address their interruption before continuing',
      'Note their concern and promise to address it at the end'
    ],
    weight: 1.0
  },
  {
    id: 'cs3',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'You need to deliver critical feedback to a colleague. Your approach is:',
    context: 'Delivering Critical Feedback',
    options: [
      'Direct and specific with concrete examples and immediate solutions',
      'Sandwich approach: positive feedback, concerns, then positive reinforcement',
      'Written documentation first, then schedule a private discussion',
      'Collaborative problem-solving session to find solutions together'
    ],
    weight: 1.3
  },
  {
    id: 'cs4',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When your ideas are challenged in a group setting, you:',
    options: [
      'Defend your position with facts and logical arguments',
      'Acknowledge valid points while maintaining your core position',
      'Seek to understand the challenger\'s perspective first',
      'Look for common ground and areas of agreement'
    ],
    weight: 1.1
  },
  {
    id: 'cs5',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'In negotiations, your natural tendency is to:',
    options: [
      'State your position clearly and hold firm on key points',
      'Start with rapport building before discussing terms',
      'Focus on finding mutually beneficial solutions',
      'Listen extensively to understand all perspectives'
    ],
    weight: 1.0
  },
  {
    id: 'cs6',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When setting boundaries with colleagues, you prefer to:',
    options: [
      'Be direct and explicit about your limits',
      'Use examples to illustrate your boundaries',
      'Explain the reasoning behind your boundaries',
      'Set boundaries through your actions rather than words'
    ],
    weight: 1.0
  },
  {
    id: 'cs7',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When making requests of others, you typically:',
    options: [
      'State exactly what you need and when you need it',
      'Explain the context and importance of your request',
      'Ask if they have capacity and discuss alternatives',
      'Frame requests as suggestions or options'
    ],
    weight: 1.0
  },
  {
    id: 'cs8',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'In conflict situations, your first instinct is to:',
    options: [
      'Address the issue head-on with facts and solutions',
      'Seek to understand all parties\' perspectives',
      'Find a compromise that works for everyone',
      'Step back and let emotions cool before engaging'
    ],
    weight: 1.1
  },
  {
    id: 'cs9',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When expressing disagreement, you prefer to:',
    options: [
      'State your disagreement clearly and provide alternatives',
      'Ask questions that highlight the issues you see',
      'Share your concerns and invite discussion',
      'Find aspects you can agree with while noting differences'
    ],
    weight: 1.0
  },
  {
    id: 'cs10',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'Your approach to giving opinions in group discussions is:',
    options: [
      'Share your views confidently and support them with evidence',
      'Offer opinions while remaining open to other viewpoints',
      'Ask questions to understand before sharing your perspective',
      'Wait to see where the group is heading before contributing'
    ],
    weight: 1.0
  },
  {
    id: 'cs11',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When facing pushback on your ideas, you:',
    options: [
      'Stand firm and provide additional supporting evidence',
      'Acknowledge concerns and modify your proposal accordingly',
      'Seek to understand the source of resistance',
      'Look for ways to address concerns while maintaining core concepts'
    ],
    weight: 1.0
  },
  {
    id: 'cs12',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'Your communication style when you\'re under pressure is:',
    options: [
      'Become more direct and focused on essential points',
      'Maintain your usual approach but speak more quickly',
      'Take time to organize your thoughts before speaking',
      'Focus on staying calm and measured in your delivery'
    ],
    weight: 1.1
  },
  {
    id: 'cs13',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When someone challenges your authority or expertise, you:',
    options: [
      'Confidently reinforce your position with credentials and experience',
      'Acknowledge their input while maintaining your stance',
      'Ask questions to understand their perspective better',
      'Focus on the merit of ideas rather than authority'
    ],
    weight: 1.0
  },
  {
    id: 'cs14',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'Your preferred approach to leading meetings is:',
    options: [
      'Set clear agenda, keep discussions focused, make decisions quickly',
      'Facilitate open discussion while guiding toward outcomes',
      'Encourage participation and build consensus gradually',
      'Listen extensively and synthesize different viewpoints'
    ],
    weight: 1.0
  },
  {
    id: 'cs15',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When you need to say no to a request, you typically:',
    options: [
      'Give a clear, direct no with brief explanation',
      'Explain your reasoning and offer alternatives',
      'Express regret and explain your constraints',
      'Suggest other people or resources that might help'
    ],
    weight: 1.0
  },

  // Communication Style Preferences - Expressiveness Scale (10 questions)
  {
    id: 'cs16',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'When sharing exciting news with colleagues, you:',
    options: [
      'Share the facts clearly and concisely',
      'Tell the story with energy and enthusiasm',
      'Explain the context and implications',
      'Mention it casually in conversation'
    ],
    weight: 1.0
  },
  {
    id: 'cs17',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'Your use of humor in professional settings is:',
    options: [
      'Minimal and only when appropriate',
      'Regular to build rapport and lighten mood',
      'Occasional to make points more memorable',
      'Rare and usually self-deprecating'
    ],
    weight: 1.0
  },
  {
    id: 'cs18',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'When describing problems to others, you tend to:',
    options: [
      'Focus on facts, impact, and solutions',
      'Paint a picture of the situation and its effects',
      'Provide systematic analysis of causes and effects',
      'Describe how it affects people and relationships'
    ],
    weight: 1.0
  },
  {
    id: 'cs19',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'Your body language and gestures during communication are:',
    options: [
      'Controlled and purposeful',
      'Animated and expressive',
      'Thoughtful and measured',
      'Subtle and reserved'
    ],
    weight: 1.0
  },
  {
    id: 'cs20',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'When sharing personal experiences in professional contexts, you:',
    options: [
      'Share only when directly relevant to business',
      'Often share stories to build connections',
      'Share thoughtfully when it adds value',
      'Rarely share personal information'
    ],
    weight: 1.0
  },
  {
    id: 'cs21',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'Your emotional expression at work is:',
    options: [
      'Professional and controlled',
      'Open and authentic',
      'Measured and appropriate',
      'Reserved and private'
    ],
    weight: 1.0
  },
  {
    id: 'cs22',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'When presenting ideas, your energy level is:',
    options: [
      'Steady and confident',
      'High and enthusiastic',
      'Thoughtful and engaging',
      'Calm and measured'
    ],
    weight: 1.0
  },
  {
    id: 'cs23',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'Your storytelling style in professional settings is:',
    options: [
      'Brief and to the point',
      'Detailed and engaging',
      'Structured and informative',
      'Minimal and factual'
    ],
    weight: 1.0
  },
  {
    id: 'cs24',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'When celebrating team successes, you:',
    options: [
      'Acknowledge achievements professionally',
      'Express genuine excitement and enthusiasm',
      'Reflect on what made the success possible',
      'Quietly appreciate the accomplishment'
    ],
    weight: 1.0
  },
  {
    id: 'cs25',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'Your vocal tone and pace in meetings is:',
    options: [
      'Clear and business-like',
      'Varied and expressive',
      'Thoughtful and measured',
      'Quiet and steady'
    ],
    weight: 1.0
  },

  // Information Processing (10 questions)
  {
    id: 'cs26',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'When receiving complex information, you prefer:',
    options: [
      'Executive summary with key points',
      'Full context with examples and stories',
      'Detailed analysis with supporting data',
      'Step-by-step breakdown with rationale'
    ],
    weight: 1.0
  },
  {
    id: 'cs27',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'Your thinking process during discussions is:',
    options: [
      'Quick conclusions with immediate responses',
      'Thinking out loud to process ideas',
      'Internal reflection before contributing',
      'Asking questions to understand fully'
    ],
    weight: 1.0
  },
  {
    id: 'cs28',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'When making decisions, you prefer:',
    options: [
      'Fast decisions with available information',
      'Collaborative discussion of options',
      'Thorough analysis of all factors',
      'Careful consideration of implications'
    ],
    weight: 1.0
  },
  {
    id: 'cs29',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'Your preference for meeting pace is:',
    options: [
      'Fast-paced with quick decisions',
      'Dynamic with energetic discussion',
      'Measured with thorough coverage',
      'Unhurried with thoughtful dialogue'
    ],
    weight: 1.0
  },
  {
    id: 'cs30',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'When interrupted during deep thinking, you:',
    options: [
      'Switch focus quickly to the interruption',
      'Engage with the interruption enthusiastically',
      'Need time to shift mental gears',
      'Prefer to finish your thought first'
    ],
    weight: 1.0
  },
  {
    id: 'cs31',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'Your preference for information sequencing is:',
    options: [
      'Bottom line first, then details',
      'Story flow with natural progression',
      'Logical sequence from start to finish',
      'Key points with supporting context'
    ],
    weight: 1.0
  },
  {
    id: 'cs32',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'When learning new concepts, you prefer:',
    options: [
      'Practical applications and examples',
      'Interactive discussion and exploration',
      'Comprehensive explanation with theory',
      'Time to reflect and ask questions'
    ],
    weight: 1.0
  },
  {
    id: 'cs33',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'Your approach to problem-solving is:',
    options: [
      'Identify solutions quickly and act',
      'Brainstorm multiple creative options',
      'Analyze systematically and methodically',
      'Understand root causes thoroughly'
    ],
    weight: 1.0
  },
  {
    id: 'cs34',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'When others speak slowly or pause frequently, you:',
    options: [
      'Feel impatient and want to speed up',
      'Fill silences with encouragement',
      'Appreciate thoroughness and detail',
      'Give them space to think and respond'
    ],
    weight: 1.0
  },
  {
    id: 'cs35',
    module: 'style-identification',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'Your response time preference in conversations is:',
    options: [
      'Immediate and decisive',
      'Quick and enthusiastic',
      'Thoughtful and considered',
      'Careful and deliberate'
    ],
    weight: 1.0
  },

  // MODULE 2: LINGUISTIC ANALYSIS (15 questions)
  {
    id: 'cs36',
    module: 'linguistic-analysis',
    dimension: 'assertiveness',
    type: 'written-response',
    question: 'Describe a recent team success and your role in it.',
    prompt: 'Write 3-4 sentences about a recent team achievement.',
    timeLimit: 180,
    weight: 1.5
  },
  {
    id: 'cs37',
    module: 'linguistic-analysis',
    dimension: 'expressiveness',
    type: 'written-response',
    question: 'Explain a complex process or concept to a new employee.',
    prompt: 'Choose something from your work and explain it simply.',
    timeLimit: 240,
    weight: 1.5
  },
  {
    id: 'cs38',
    module: 'linguistic-analysis',
    dimension: 'assertiveness',
    type: 'written-response',
    question: 'Respond to an urgent client complaint about service quality.',
    prompt: 'Write your response as if emailing the client directly.',
    timeLimit: 180, // High pressure, quick response needed
    weight: 1.8
  },
  {
    id: 'cs39',
    module: 'linguistic-analysis',
    dimension: 'influence-strategies',
    type: 'written-response',
    question: 'Propose a new initiative to leadership that requires budget approval.',
    prompt: 'Write a brief proposal for a new project or initiative.',
    timeLimit: 360,
    weight: 1.8
  },
  {
    id: 'cs40',
    module: 'linguistic-analysis',
    dimension: 'conflict-communication',
    type: 'written-response',
    question: 'Address a situation where two team members have conflicting approaches.',
    prompt: 'Describe how you would handle this interpersonal conflict.',
    timeLimit: 240,
    weight: 1.6
  },
  {
    id: 'cs41',
    module: 'linguistic-analysis',
    dimension: 'channel-preferences',
    type: 'written-response',
    question: 'Announce a significant change in company policy to your team.',
    prompt: 'Write your announcement message.',
    timeLimit: 180,
    weight: 1.4
  },
  {
    id: 'cs42',
    module: 'linguistic-analysis',
    dimension: 'listening-patterns',
    type: 'written-response',
    question: 'Respond to a colleague who shared concerns about their workload.',
    prompt: 'Write your response showing you understand their concerns.',
    timeLimit: 120,
    weight: 1.3
  },
  {
    id: 'cs43',
    module: 'linguistic-analysis',
    dimension: 'influence-strategies',
    type: 'written-response',
    question: 'Convince a skeptical stakeholder to support your project.',
    prompt: 'Write your persuasive message.',
    timeLimit: 240, // Medium cognitive load for persuasion
    weight: 1.7
  },
  {
    id: 'cs44',
    module: 'linguistic-analysis',
    dimension: 'expressiveness',
    type: 'written-response',
    question: 'Share feedback on a creative presentation that missed the mark.',
    prompt: 'Write constructive feedback for the presenter.',
    timeLimit: 180,
    weight: 1.4
  },
  {
    id: 'cs45',
    module: 'linguistic-analysis',
    dimension: 'information-processing',
    type: 'written-response',
    question: 'Explain why a project deadline needs to be extended.',
    prompt: 'Write your explanation to the project sponsor.',
    timeLimit: 240,
    weight: 1.5
  },
  {
    id: 'cs46',
    module: 'linguistic-analysis',
    dimension: 'assertiveness',
    type: 'written-response',
    question: 'Decline a meeting request that conflicts with your priorities.',
    prompt: 'Write your decline message.',
    timeLimit: 120,
    weight: 1.3
  },
  {
    id: 'cs47',
    module: 'linguistic-analysis',
    dimension: 'channel-preferences',
    type: 'written-response',
    question: 'Follow up on an important decision made in a meeting.',
    prompt: 'Write your follow-up message.',
    timeLimit: 150,
    weight: 1.2
  },
  {
    id: 'cs48',
    module: 'linguistic-analysis',
    dimension: 'conflict-communication',
    type: 'written-response',
    question: 'Respond to criticism of your work in a public forum.',
    prompt: 'Write your professional response.',
    timeLimit: 180,
    weight: 1.6
  },
  {
    id: 'cs49',
    module: 'linguistic-analysis',
    dimension: 'listening-patterns',
    type: 'written-response',
    question: 'Acknowledge a team member\'s innovative idea that you want to build upon.',
    prompt: 'Write your acknowledgment and expansion.',
    timeLimit: 150,
    weight: 1.3
  },
  {
    id: 'cs50',
    module: 'linguistic-analysis',
    dimension: 'influence-strategies',
    type: 'written-response',
    question: 'Motivate a team that\'s struggling with morale.',
    prompt: 'Write your motivational message.',
    timeLimit: 240,
    weight: 1.6
  },

  // MODULE 3: INTERACTIVE SIMULATIONS (15 questions)
  {
    id: 'cs51',
    module: 'interactive-simulations',
    dimension: 'channel-preferences',
    type: 'simulation',
    question: 'Choose your preferred method for delivering sensitive feedback:',
    context: 'Performance feedback scenario',
    options: [
      'Face-to-face private meeting',
      'Video call with screen sharing',
      'Detailed written feedback first, then discussion',
      'Phone call for personal touch'
    ],
    weight: 1.4
  },
  {
    id: 'cs52',
    module: 'interactive-simulations',
    dimension: 'conflict-communication',
    type: 'simulation',
    question: 'Two team members are in heated disagreement during a video call. Your immediate action:',
    context: 'Real-time conflict management',
    options: [
      'Take control and redirect to problem-solving',
      'Acknowledge emotions and create space for each person',
      'Suggest taking a break to cool down',
      'Ask clarifying questions to understand root issues'
    ],
    weight: 1.6
  },
  {
    id: 'cs53',
    module: 'interactive-simulations',
    dimension: 'influence-strategies',
    type: 'simulation',
    question: 'You need to influence a decision-maker who prefers data. Your approach:',
    context: 'Stakeholder influence scenario',
    options: [
      'Present clear metrics and ROI calculations',
      'Combine data with compelling success stories',
      'Provide comprehensive analysis with recommendations',
      'Show peer comparisons and industry benchmarks'
    ],
    weight: 1.5
  },
  {
    id: 'cs54',
    module: 'interactive-simulations',
    dimension: 'listening-patterns',
    type: 'simulation',
    question: 'A colleague is explaining a complex problem. You:',
    context: 'Active listening simulation',
    options: [
      'Listen for key points and ask clarifying questions',
      'Engage with encouragement and related experiences',
      'Take notes and ask for additional details',
      'Listen without interrupting and reflect back what you heard'
    ],
    weight: 1.3
  },
  {
    id: 'cs55',
    module: 'interactive-simulations',
    dimension: 'assertiveness',
    type: 'simulation',
    question: 'In a client meeting, they make an unreasonable request. Your response:',
    context: 'Client boundary setting',
    options: [
      'Clearly explain why it\'s not feasible and offer alternatives',
      'Acknowledge their needs and work together on solutions',
      'Explore the request thoroughly before responding',
      'Find aspects you can accommodate while addressing constraints'
    ],
    weight: 1.5
  },
  {
    id: 'cs56',
    module: 'interactive-simulations',
    dimension: 'expressiveness',
    type: 'simulation',
    question: 'Leading a brainstorming session with a quiet team. Your facilitation style:',
    context: 'Team facilitation scenario',
    options: [
      'Set clear structure and timelines for idea generation',
      'Use energy and enthusiasm to encourage participation',
      'Create safe space and ask thoughtful questions',
      'Give individuals time to think before sharing'
    ],
    weight: 1.4
  },
  {
    id: 'cs57',
    module: 'interactive-simulations',
    dimension: 'information-processing',
    type: 'simulation',
    question: 'Receiving rapid-fire questions in a presentation. Your handling:',
    context: 'Presentation Q&A management',
    options: [
      'Answer quickly and move to next question',
      'Engage with each question enthusiastically',
      'Group related questions and provide comprehensive answers',
      'Take time to think and provide thoughtful responses'
    ],
    weight: 1.3
  },
  {
    id: 'cs58',
    module: 'interactive-simulations',
    dimension: 'channel-preferences',
    type: 'simulation',
    question: 'Coordinating a complex project with remote team members. Your communication strategy:',
    context: 'Remote team coordination',
    options: [
      'Daily stand-ups with clear action items',
      'Mix of video calls, messaging, and collaborative tools',
      'Detailed written updates with regular check-ins',
      'One-on-one conversations to understand individual needs'
    ],
    weight: 1.4
  },
  {
    id: 'cs59',
    module: 'interactive-simulations',
    dimension: 'influence-strategies',
    type: 'simulation',
    question: 'Presenting to a skeptical audience. Your persuasion approach:',
    context: 'Skeptical audience presentation',
    options: [
      'Lead with strong evidence and logical arguments',
      'Use stories and examples to make points relatable',
      'Address concerns systematically with data',
      'Build credibility through expertise and track record'
    ],
    weight: 1.5
  },
  {
    id: 'cs60',
    module: 'interactive-simulations',
    dimension: 'conflict-communication',
    type: 'simulation',
    question: 'Mediating between two departments with competing priorities. Your approach:',
    context: 'Inter-departmental conflict mediation',
    options: [
      'Focus on organizational goals and make executive decisions',
      'Facilitate open dialogue to find win-win solutions',
      'Analyze the situation objectively and propose compromises',
      'Help each side understand the other\'s perspective'
    ],
    weight: 1.6
  },
  {
    id: 'cs61',
    module: 'interactive-simulations',
    dimension: 'listening-patterns',
    type: 'simulation',
    question: 'An employee comes to you with a personal problem affecting work. Your response:',
    context: 'Employee counseling scenario',
    options: [
      'Listen briefly and focus on work impact solutions',
      'Offer support and explore ways to help',
      'Listen carefully and ask questions to understand fully',
      'Provide patient, non-judgmental listening space'
    ],
    weight: 1.4
  },
  {
    id: 'cs62',
    module: 'interactive-simulations',
    dimension: 'expressiveness',
    type: 'simulation',
    question: 'Announcing layoffs to your team. Your communication approach:',
    context: 'Difficult news delivery',
    options: [
      'Direct, factual presentation with clear next steps',
      'Acknowledge emotions while maintaining professional composure',
      'Provide thorough context and reasoning',
      'Show empathy and personal concern for team members'
    ],
    weight: 1.7
  },
  {
    id: 'cs63',
    module: 'interactive-simulations',
    dimension: 'assertiveness',
    type: 'simulation',
    question: 'Your boss asks you to take on additional work when you\'re already overloaded. Your response:',
    context: 'Workload boundary setting',
    options: [
      'Clearly state your capacity limits and current priorities',
      'Explain your situation and ask for help prioritizing',
      'Present your workload data and discuss options',
      'Express concerns and seek collaborative solutions'
    ],
    weight: 1.5
  },
  {
    id: 'cs64',
    module: 'interactive-simulations',
    dimension: 'information-processing',
    type: 'simulation',
    question: 'Making a decision with incomplete information under time pressure. Your approach:',
    context: 'Pressure decision-making',
    options: [
      'Make the best decision with available information',
      'Quickly gather input from key stakeholders',
      'Identify critical missing information and seek it rapidly',
      'Consider multiple scenarios and their implications'
    ],
    weight: 1.4
  },
  {
    id: 'cs65',
    module: 'interactive-simulations',
    dimension: 'channel-preferences',
    type: 'simulation',
    question: 'Handling a crisis communication that affects multiple stakeholders. Your channel strategy:',
    context: 'Crisis communication management',
    options: [
      'Immediate calls to key stakeholders, then broad communication',
      'All-hands meeting with follow-up individual conversations',
      'Detailed written brief with phone calls for questions',
      'Tiered communication starting with most affected parties'
    ],
    weight: 1.6
  },

  // MODULE 4: ADAPTIVE SCENARIOS (15 questions)
  {
    id: 'cs66',
    module: 'adaptive-scenarios',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'Presenting a budget request to the executive team. Your communication style:',
    context: 'Upward communication to executives',
    options: [
      'Direct presentation focused on ROI and business impact',
      'Compelling story about organizational benefits',
      'Comprehensive analysis with detailed justification',
      'Collaborative discussion of options and alternatives'
    ],
    weight: 1.6
  },
  {
    id: 'cs67',
    module: 'adaptive-scenarios',
    dimension: 'expressiveness',
    type: 'scenario',
    question: 'Delegating a challenging project to your direct reports. Your approach:',
    context: 'Downward communication to direct reports',
    options: [
      'Clear expectations with defined milestones and outcomes',
      'Inspiring vision with enthusiasm for the opportunity',
      'Detailed briefing with comprehensive support resources',
      'Collaborative planning with team input and buy-in'
    ],
    weight: 1.4
  },
  {
    id: 'cs68',
    module: 'adaptive-scenarios',
    dimension: 'influence-strategies',
    type: 'scenario',
    question: 'Negotiating resource allocation with peer department heads. Your strategy:',
    context: 'Lateral communication with peers',
    options: [
      'Present clear business case with objective criteria',
      'Build relationships and find mutually beneficial solutions',
      'Provide detailed analysis of organizational impact',
      'Facilitate discussion to understand all perspectives'
    ],
    weight: 1.5
  },
  {
    id: 'cs69',
    module: 'adaptive-scenarios',
    dimension: 'channel-preferences',
    type: 'scenario',
    question: 'Communicating service issues to external clients. Your communication plan:',
    context: 'External communication to clients',
    options: [
      'Direct phone calls with clear resolution timelines',
      'Personal video messages with follow-up actions',
      'Detailed written communication with comprehensive updates',
      'Combination of immediate contact and ongoing dialogue'
    ],
    weight: 1.5
  },
  {
    id: 'cs70',
    module: 'adaptive-scenarios',
    dimension: 'conflict-communication',
    type: 'scenario',
    question: 'Managing communication during a company merger. Your approach:',
    context: 'Crisis communication situation',
    options: [
      'Frequent, factual updates with clear timelines',
      'Open forums for questions and concerns',
      'Comprehensive communication packages with detailed information',
      'Individual conversations to address specific worries'
    ],
    weight: 1.7
  },
  {
    id: 'cs71',
    module: 'adaptive-scenarios',
    dimension: 'listening-patterns',
    type: 'scenario',
    question: 'Receiving feedback from a 360-degree review process. Your response:',
    context: 'Feedback reception scenario',
    options: [
      'Focus on actionable items and create improvement plan',
      'Engage with feedback providers to understand better',
      'Analyze patterns and root causes systematically',
      'Reflect deeply on feedback and seek clarification'
    ],
    weight: 1.3
  },
  {
    id: 'cs72',
    module: 'adaptive-scenarios',
    dimension: 'information-processing',
    type: 'scenario',
    question: 'Onboarding a new team member from a different cultural background. Your communication adaptation:',
    context: 'Cross-cultural communication',
    options: [
      'Maintain consistent communication style with clear expectations',
      'Adapt energy and approach based on their communication preferences',
      'Provide comprehensive context and background information',
      'Take time to understand their communication style and adapt accordingly'
    ],
    weight: 1.4
  },
  {
    id: 'cs73',
    module: 'adaptive-scenarios',
    dimension: 'assertiveness',
    type: 'scenario',
    question: 'Advocating for your team\'s needs during budget cuts. Your approach:',
    context: 'Advocacy in challenging circumstances',
    options: [
      'Present compelling case with clear business justification',
      'Rally support and build coalition for your position',
      'Provide detailed analysis of impact and alternatives',
      'Seek to understand constraints and find creative solutions'
    ],
    weight: 1.6
  },
  {
    id: 'cs74',
    module: 'adaptive-scenarios',
    dimension: 'expressiveness',
    type: 'scenario',
    question: 'Leading a town hall meeting after a difficult quarter. Your communication tone:',
    context: 'Large group difficult communication',
    options: [
      'Straightforward and focused on solutions',
      'Honest but inspiring with path forward',
      'Thorough and transparent about challenges',
      'Empathetic and understanding of concerns'
    ],
    weight: 1.5
  },
  {
    id: 'cs75',
    module: 'adaptive-scenarios',
    dimension: 'influence-strategies',
    type: 'scenario',
    question: 'Convincing a traditional industry client to adopt innovative technology. Your persuasion approach:',
    context: 'Innovation adoption influence',
    options: [
      'Focus on competitive advantage and ROI',
      'Use success stories and peer examples',
      'Provide comprehensive risk analysis and mitigation',
      'Start with small pilot and build trust gradually'
    ],
    weight: 1.6
  },
  {
    id: 'cs76',
    module: 'adaptive-scenarios',
    dimension: 'channel-preferences',
    type: 'scenario',
    question: 'Coordinating a global project across multiple time zones. Your communication rhythm:',
    context: 'Global team coordination',
    options: [
      'Structured schedule with rotating meeting times',
      'Flexible approach using multiple communication channels',
      'Detailed written updates with scheduled sync points',
      'Regional liaisons with personalized communication'
    ],
    weight: 1.4
  },
  {
    id: 'cs77',
    module: 'adaptive-scenarios',
    dimension: 'conflict-communication',
    type: 'scenario',
    question: 'Addressing public criticism of your organization on social media. Your response strategy:',
    context: 'Public relations crisis communication',
    options: [
      'Direct, factual response addressing specific concerns',
      'Engaging dialogue showing human side of organization',
      'Comprehensive statement with full context and data',
      'Personal outreach to critics seeking understanding'
    ],
    weight: 1.7
  },
  {
    id: 'cs78',
    module: 'adaptive-scenarios',
    dimension: 'listening-patterns',
    type: 'scenario',
    question: 'Facilitating a session where stakeholders have strongly opposing views. Your facilitation approach:',
    context: 'Multi-stakeholder facilitation',
    options: [
      'Keep discussion focused on facts and solutions',
      'Encourage open expression while maintaining energy',
      'Systematically explore each perspective thoroughly',
      'Create safe space for all voices to be heard'
    ],
    weight: 1.5
  },
  {
    id: 'cs79',
    module: 'adaptive-scenarios',
    dimension: 'information-processing',
    type: 'scenario',
    question: 'Presenting complex technical information to a non-technical executive audience. Your adaptation:',
    context: 'Technical to executive communication',
    options: [
      'Focus on business impact and strategic implications',
      'Use analogies and stories to make concepts relatable',
      'Provide layered information with executive summary',
      'Interactive discussion to ensure understanding'
    ],
    weight: 1.5
  },
  {
    id: 'cs80',
    module: 'adaptive-scenarios',
    dimension: 'influence-strategies',
    type: 'scenario',
    question: 'Building support for a culture change initiative across the organization. Your influence campaign:',
    context: 'Organizational change communication',
    options: [
      'Clear communication of business case and benefits',
      'Inspiring vision with emotional connection to change',
      'Comprehensive change management with detailed planning',
      'Inclusive process with extensive stakeholder engagement'
    ],
    weight: 1.8
  },

  // REVERSE-CODED QUESTIONS FOR CONSISTENCY VALIDATION
  {
    id: 'cs81-rev',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'When leading a team, I rarely speak up during meetings.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 1.0,
    reverseScored: true
  },
  {
    id: 'cs82-rev',
    module: 'style-identification',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'I avoid showing emotions in professional settings.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 1.0,
    reverseScored: true
  },
  {
    id: 'cs83-rev',
    module: 'style-identification',
    dimension: 'influence-strategies',
    type: 'multiple-choice',
    question: 'I rarely try to persuade others to see my point of view.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 1.0,
    reverseScored: true
  },
  {
    id: 'cs84-rev',
    module: 'style-identification',
    dimension: 'listening-patterns',
    type: 'multiple-choice',
    question: 'I often interrupt others when they are speaking.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 1.0,
    reverseScored: true
  },
  {
    id: 'cs85-rev',
    module: 'style-identification',
    dimension: 'conflict-communication',
    type: 'multiple-choice',
    question: 'I always avoid discussing disagreements directly.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 1.0,
    reverseScored: true
  },

  // ATTENTION CHECK QUESTIONS
  {
    id: 'cs86-att',
    module: 'style-identification',
    dimension: 'assertiveness',
    type: 'multiple-choice',
    question: 'For quality assurance, please select "Disagree" for this question.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 0,
    attentionCheck: true
  },
  {
    id: 'cs87-att',
    module: 'linguistic-analysis',
    dimension: 'expressiveness',
    type: 'multiple-choice',
    question: 'To ensure you are reading carefully, please choose the third option.',
    options: [
      'First option',
      'Second option',
      'Third option',
      'Fourth option',
      'Fifth option'
    ],
    weight: 0,
    attentionCheck: true
  },
  {
    id: 'cs88-att',
    module: 'interactive-simulations',
    dimension: 'information-processing',
    type: 'multiple-choice',
    question: 'This is an attention check. Please select "Neutral" to continue.',
    options: [
      'Strongly Agree',
      'Agree',
      'Neutral',
      'Disagree',
      'Strongly Disagree'
    ],
    weight: 0,
    attentionCheck: true
  }
];

export default communicationStylesQuestions;