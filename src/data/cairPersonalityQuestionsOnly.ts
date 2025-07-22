export interface CAIRQuestion {
  id: string;
  type: 'personality' | 'validity';
  questionText: string;
  optionA: string;
  optionB: string;
  dimension: 'conscientiousness' | 'agreeableness' | 'innovation' | 'resilience' | 'validity';
  subdimension?: string;
  reverse?: boolean;
  validityType?: 'fake_good' | 'fake_bad' | 'inconsistency' | 'random_check';
}

// Improved CAIR+ Questions - All personality with dispersed validity checks
export const cairQuestions: CAIRQuestion[] = [
  // CONSCIENTIOUSNESS (25 questions)
  {
    id: 'c001',
    type: 'personality',
    questionText: 'When planning projects, I prefer to:',
    optionA: 'Create detailed timelines and stick to them',
    optionB: 'Set general goals and adapt as needed',
    dimension: 'conscientiousness',
    subdimension: 'planning'
  },
  {
    id: 'c002',
    type: 'personality',
    questionText: 'My workspace is typically:',
    optionA: 'Highly organized with everything in its place',
    optionB: 'Lived-in with some controlled chaos',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'c003',
    type: 'personality',
    questionText: 'When facing deadlines, I:',
    optionA: 'Complete tasks well ahead of schedule',
    optionB: 'Work efficiently under time pressure',
    dimension: 'conscientiousness',
    subdimension: 'time_management'
  },
  {
    id: 'v001',
    type: 'validity',
    questionText: 'I have never made any mistakes in my work.',
    optionA: 'True - Never made mistakes',
    optionB: 'False - Made some mistakes',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'c004',
    type: 'personality',
    questionText: 'I approach quality standards by:',
    optionA: 'Striving for perfection in every detail',
    optionB: 'Balancing quality with practical constraints',
    dimension: 'conscientiousness',
    subdimension: 'quality_focus'
  },
  {
    id: 'c005',
    type: 'personality',
    questionText: 'When given multiple tasks, I:',
    optionA: 'Prioritize systematically and work sequentially',
    optionB: 'Switch between tasks based on energy and interest',
    dimension: 'conscientiousness',
    subdimension: 'task_management'
  },
  {
    id: 'c006',
    type: 'personality',
    questionText: 'My approach to following rules is:',
    optionA: 'Rules exist for good reasons and should be followed',
    optionB: 'Rules are guidelines that may need interpretation',
    dimension: 'conscientiousness',
    subdimension: 'rule_following'
  },
  {
    id: 'c007',
    type: 'personality',
    questionText: 'When learning new skills, I prefer to:',
    optionA: 'Master fundamentals thoroughly before advancing',
    optionB: 'Jump in and learn through trial and error',
    dimension: 'conscientiousness',
    subdimension: 'learning_approach'
  },
  {
    id: 'v002',
    type: 'validity',
    questionText: 'I always arrive exactly on time for every appointment.',
    optionA: 'True - Always exactly on time',
    optionB: 'False - Sometimes early or late',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'c008',
    type: 'personality',
    questionText: 'When I make mistakes, I:',
    optionA: 'Analyze what went wrong and create prevention systems',
    optionB: 'Learn from it and move forward',
    dimension: 'conscientiousness',
    subdimension: 'self_improvement'
  },
  {
    id: 'c009',
    type: 'personality',
    questionText: 'I track my progress on important tasks:',
    optionA: 'Daily with specific metrics',
    optionB: 'Periodically when I remember',
    dimension: 'conscientiousness',
    subdimension: 'self_monitoring'
  },
  {
    id: 'c010',
    type: 'personality',
    questionText: 'When starting a new job, I:',
    optionA: 'Research everything thoroughly before day one',
    optionB: 'Learn as I go and ask questions',
    dimension: 'conscientiousness',
    subdimension: 'preparation'
  },
  {
    id: 'c011',
    type: 'personality',
    questionText: 'I handle multiple priorities by:',
    optionA: 'Creating systematic schedules and sticking to them',
    optionB: 'Switching between tasks based on urgency',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'v003',
    type: 'validity',
    questionText: 'I never procrastinate on any task, no matter how small.',
    optionA: 'True - Never procrastinate',
    optionB: 'False - Sometimes delay tasks',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'c012',
    type: 'personality',
    questionText: 'When faced with tedious but important work, I:',
    optionA: 'Complete it thoroughly regardless of boredom',
    optionB: 'Find ways to make it more interesting or efficient',
    dimension: 'conscientiousness',
    subdimension: 'persistence'
  },
  {
    id: 'c013',
    type: 'personality',
    questionText: 'My commitment to goals is best described as:',
    optionA: 'Unwavering once I decide on something',
    optionB: 'Flexible and willing to pivot when needed',
    dimension: 'conscientiousness',
    subdimension: 'goal_commitment'
  },
  {
    id: 'c014',
    type: 'personality',
    questionText: 'When others depend on my work, I:',
    optionA: 'Feel extra pressure to deliver perfectly',
    optionB: 'Focus on meeting their actual needs',
    dimension: 'conscientiousness',
    subdimension: 'responsibility'
  },
  {
    id: 'c015',
    type: 'personality',
    questionText: 'I prefer work environments that are:',
    optionA: 'Structured with clear expectations',
    optionB: 'Flexible with room for creativity',
    dimension: 'conscientiousness',
    subdimension: 'structure_preference'
  },
  {
    id: 'v004',
    type: 'validity',
    questionText: 'I have never felt angry or irritated at work.',
    optionA: 'True - Never felt anger at work',
    optionB: 'False - I\'ve felt frustrated at times',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'c016',
    type: 'personality',
    questionText: 'When managing resources, I:',
    optionA: 'Plan carefully to avoid waste',
    optionB: 'Use what I need to get results',
    dimension: 'conscientiousness',
    subdimension: 'resource_management'
  },
  {
    id: 'c017',
    type: 'personality',
    questionText: 'My approach to documentation is:',
    optionA: 'Detailed records are essential',
    optionB: 'Document what\'s necessary for others',
    dimension: 'conscientiousness',
    subdimension: 'documentation'
  },
  {
    id: 'c018',
    type: 'personality',
    questionText: 'When I commit to something, others can expect:',
    optionA: 'Exactly what I promised, when I promised',
    optionB: 'Good faith effort with honest communication',
    dimension: 'conscientiousness',
    subdimension: 'reliability'
  },
  {
    id: 'c019',
    type: 'personality',
    questionText: 'I handle interruptions by:',
    optionA: 'Minimizing them to maintain focus',
    optionB: 'Adapting my workflow to accommodate them',
    dimension: 'conscientiousness',
    subdimension: 'focus_management'
  },
  {
    id: 'v005',
    type: 'validity',
    questionText: 'I am completely incompetent at everything I do.',
    optionA: 'True - Completely incompetent',
    optionB: 'False - Have some competencies',
    dimension: 'validity',
    validityType: 'fake_bad'
  },
  {
    id: 'c020',
    type: 'personality',
    questionText: 'When evaluating my work, I focus on:',
    optionA: 'Areas where I could have done better',
    optionB: 'Whether I achieved the intended outcome',
    dimension: 'conscientiousness',
    subdimension: 'self_evaluation'
  },
  {
    id: 'c021',
    type: 'personality',
    questionText: 'My personal standards are:',
    optionA: 'Higher than most people would expect',
    optionB: 'Appropriate for the situation',
    dimension: 'conscientiousness',
    subdimension: 'standards'
  },
  {
    id: 'c022',
    type: 'personality',
    questionText: 'When building habits, I:',
    optionA: 'Create detailed systems and track progress',
    optionB: 'Start simple and build naturally over time',
    dimension: 'conscientiousness',
    subdimension: 'habit_formation'
  },
  {
    id: 'c023',
    type: 'personality',
    questionText: 'I approach long-term projects by:',
    optionA: 'Breaking them into detailed phases',
    optionB: 'Setting milestones and adjusting along the way',
    dimension: 'conscientiousness',
    subdimension: 'project_management'
  },
  {
    id: 'c024',
    type: 'personality',
    questionText: 'When others are less organized than me, I:',
    optionA: 'Feel frustrated by their lack of structure',
    optionB: 'Appreciate different working styles',
    dimension: 'conscientiousness',
    subdimension: 'tolerance'
  },
  {
    id: 'v006',
    type: 'validity',
    questionText: 'I always remember everyone\'s name after meeting them once.',
    optionA: 'True - Perfect memory for names',
    optionB: 'False - Sometimes forget names',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'c025',
    type: 'personality',
    questionText: 'My relationship with time is best described as:',
    optionA: 'Time is precious and should be optimized',
    optionB: 'Time is a resource to be used wisely',
    dimension: 'conscientiousness',
    subdimension: 'time_orientation'
  },

  // AGREEABLENESS (25 questions)
  {
    id: 'a001',
    type: 'personality',
    questionText: 'When conflicts arise, I typically:',
    optionA: 'Seek harmony and compromise',
    optionB: 'Address issues directly and honestly',
    dimension: 'agreeableness',
    subdimension: 'conflict_approach'
  },
  {
    id: 'a002',
    type: 'personality',
    questionText: 'I believe most people are:',
    optionA: 'Fundamentally good and trustworthy',
    optionB: 'Mixed, requiring careful judgment',
    dimension: 'agreeableness',
    subdimension: 'trust'
  },
  {
    id: 'a003',
    type: 'personality',
    questionText: 'When someone asks for help, I:',
    optionA: 'Almost always say yes if I can',
    optionB: 'Consider my capacity and priorities first',
    dimension: 'agreeableness',
    subdimension: 'helpfulness'
  },
  {
    id: 'v007',
    type: 'validity',
    questionText: 'I have never had a negative thought about a coworker.',
    optionA: 'True - Always positive thoughts',
    optionB: 'False - Had occasional negative thoughts',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'a004',
    type: 'personality',
    questionText: 'In group decisions, I prefer to:',
    optionA: 'Build consensus even if it takes longer',
    optionB: 'Make efficient decisions with key input',
    dimension: 'agreeableness',
    subdimension: 'cooperation'
  },
  {
    id: 'a005',
    type: 'personality',
    questionText: 'When someone is struggling, my instinct is to:',
    optionA: 'Offer emotional support and encouragement',
    optionB: 'Help them find practical solutions',
    dimension: 'agreeableness',
    subdimension: 'empathy'
  },
  {
    id: 'a006',
    type: 'personality',
    questionText: 'I handle criticism by:',
    optionA: 'Considering how it might be true',
    optionB: 'Evaluating its validity and source',
    dimension: 'agreeableness',
    subdimension: 'receptivity'
  },
  {
    id: 'a007',
    type: 'personality',
    questionText: 'When others make mistakes, I:',
    optionA: 'Focus on understanding why it happened',
    optionB: 'Address what needs to be corrected',
    dimension: 'agreeableness',
    subdimension: 'forgiveness'
  },
  {
    id: 'v008',
    type: 'validity',
    questionText: 'I never contribute anything valuable to team projects.',
    optionA: 'True - Never contribute value',
    optionB: 'False - Sometimes contribute',
    dimension: 'validity',
    validityType: 'fake_bad'
  },
  {
    id: 'a008',
    type: 'personality',
    questionText: 'My communication style tends to be:',
    optionA: 'Gentle and considerate of feelings',
    optionB: 'Clear and straightforward',
    dimension: 'agreeableness',
    subdimension: 'communication'
  },
  {
    id: 'a009',
    type: 'personality',
    questionText: 'When negotiating, I:',
    optionA: 'Look for win-win solutions',
    optionB: 'Aim for the best outcome for my side',
    dimension: 'agreeableness',
    subdimension: 'negotiation'
  },
  {
    id: 'a010',
    type: 'personality',
    questionText: 'I express disagreement by:',
    optionA: 'Softening my words to avoid offense',
    optionB: 'Being direct while remaining respectful',
    dimension: 'agreeableness',
    subdimension: 'assertiveness'
  },
  {
    id: 'a011',
    type: 'personality',
    questionText: 'When leading teams, I:',
    optionA: 'Emphasize collaboration and team harmony',
    optionB: 'Focus on clear goals and accountability',
    dimension: 'agreeableness',
    subdimension: 'leadership_style'
  },
  {
    id: 'v009',
    type: 'validity',
    questionText: 'I always read every word of every document I sign.',
    optionA: 'True - Read everything completely',
    optionB: 'False - Sometimes skim documents',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'a012',
    type: 'personality',
    questionText: 'I tend to assume others\' motives are:',
    optionA: 'Generally positive until proven otherwise',
    optionB: 'Mixed and require observation',
    dimension: 'agreeableness',
    subdimension: 'assumption_of_intent'
  },
  {
    id: 'a013',
    type: 'personality',
    questionText: 'When someone is upset with me, I:',
    optionA: 'Feel bad and want to make things right',
    optionB: 'Try to understand what happened objectively',
    dimension: 'agreeableness',
    subdimension: 'emotional_response'
  },
  {
    id: 'a014',
    type: 'personality',
    questionText: 'My approach to giving feedback is:',
    optionA: 'Emphasize positives and soften critiques',
    optionB: 'Balance honest assessment with encouragement',
    dimension: 'agreeableness',
    subdimension: 'feedback_style'
  },
  {
    id: 'a015',
    type: 'personality',
    questionText: 'When others are in pain, I:',
    optionA: 'Feel their pain almost as if it were my own',
    optionB: 'Feel concerned and want to help if I can',
    dimension: 'agreeableness',
    subdimension: 'emotional_sensitivity'
  },
  {
    id: 'v010',
    type: 'validity',
    questionText: 'I would never be able to learn any new skills.',
    optionA: 'True - Cannot learn new skills',
    optionB: 'False - Can learn some things',
    dimension: 'validity',
    validityType: 'fake_bad'
  },
  {
    id: 'a016',
    type: 'personality',
    questionText: 'I prefer workplace cultures that are:',
    optionA: 'Warm and supportive of everyone',
    optionB: 'Professional and results-oriented',
    dimension: 'agreeableness',
    subdimension: 'culture_preference'
  },
  {
    id: 'a017',
    type: 'personality',
    questionText: 'When allocating limited resources, I:',
    optionA: 'Consider everyone\'s needs fairly',
    optionB: 'Prioritize based on strategic importance',
    dimension: 'agreeableness',
    subdimension: 'fairness'
  },
  {
    id: 'a018',
    type: 'personality',
    questionText: 'My tolerance for difficult people is:',
    optionA: 'High - everyone has their reasons',
    optionB: 'Moderate - depends on the impact',
    dimension: 'agreeableness',
    subdimension: 'tolerance'
  },
  {
    id: 'a019',
    type: 'personality',
    questionText: 'When making tough decisions, I:',
    optionA: 'Consider how it will affect everyone involved',
    optionB: 'Focus on what\'s best for the organization',
    dimension: 'agreeableness',
    subdimension: 'decision_making'
  },
  {
    id: 'v011',
    type: 'validity',
    questionText: 'I have absolutely no positive qualities as a person.',
    optionA: 'True - No positive qualities',
    optionB: 'False - Have some positive traits',
    dimension: 'validity',
    validityType: 'fake_bad'
  },
  {
    id: 'a020',
    type: 'personality',
    questionText: 'I build relationships by:',
    optionA: 'Being genuinely interested in others',
    optionB: 'Finding common ground and shared goals',
    dimension: 'agreeableness',
    subdimension: 'relationship_building'
  },
  {
    id: 'a021',
    type: 'personality',
    questionText: 'When someone betrays my trust, I:',
    optionA: 'Eventually forgive and give second chances',
    optionB: 'Become much more cautious with them',
    dimension: 'agreeableness',
    subdimension: 'forgiveness'
  },
  {
    id: 'a022',
    type: 'personality',
    questionText: 'I handle competitive situations by:',
    optionA: 'Focusing on everyone doing their best',
    optionB: 'Playing to win while staying fair',
    dimension: 'agreeableness',
    subdimension: 'competitiveness'
  },
  {
    id: 'a023',
    type: 'personality',
    questionText: 'When others succeed, I typically feel:',
    optionA: 'Genuinely happy for their achievement',
    optionB: 'Pleased and perhaps motivated to excel myself',
    dimension: 'agreeableness',
    subdimension: 'supportiveness'
  },
  {
    id: 'v012',
    type: 'validity',
    questionText: 'I have never told a lie, even a small one.',
    optionA: 'True - I\'ve never lied',
    optionB: 'False - I\'ve told small lies',
    dimension: 'validity',
    validityType: 'fake_good'
  },
  {
    id: 'a024',
    type: 'personality',
    questionText: 'My approach to team conflicts is:',
    optionA: 'Mediate to restore harmony',
    optionB: 'Address the root issue directly',
    dimension: 'agreeableness',
    subdimension: 'conflict_resolution'
  },
  {
    id: 'a025',
    type: 'personality',
    questionText: 'I show care for others by:',
    optionA: 'Being emotionally available and supportive',
    optionB: 'Helping them achieve their goals',
    dimension: 'agreeableness',
    subdimension: 'caring_expression'
  },

  // INNOVATION (25 questions)
  {
    id: 'i001',
    type: 'personality',
    questionText: 'When facing new challenges, I prefer to:',
    optionA: 'Explore creative and unconventional solutions',
    optionB: 'Build on proven methods and best practices',
    dimension: 'innovation',
    subdimension: 'problem_solving'
  },
  {
    id: 'i002',
    type: 'personality',
    questionText: 'I am most energized by:',
    optionA: 'Possibilities and future potential',
    optionB: 'Current realities and concrete progress',
    dimension: 'innovation',
    subdimension: 'orientation'
  },
  {
    id: 'i003',
    type: 'personality',
    questionText: 'When learning new concepts, I:',
    optionA: 'Make connections to unrelated ideas',
    optionB: 'Focus on understanding the fundamentals',
    dimension: 'innovation',
    subdimension: 'learning_style'
  },
  {
    id: 'v013',
    type: 'validity',
    questionText: 'I prefer teamwork because individual work is boring.',
    optionA: 'True - Always prefer teamwork',
    optionB: 'False - Sometimes prefer individual work',
    dimension: 'validity',
    validityType: 'inconsistency'
  },
  {
    id: 'i004',
    type: 'personality',
    questionText: 'My approach to brainstorming is:',
    optionA: 'Generate many ideas without immediate judgment',
    optionB: 'Focus on feasible and practical solutions',
    dimension: 'innovation',
    subdimension: 'ideation'
  },
  {
    id: 'i005',
    type: 'personality',
    questionText: 'I prefer projects that:',
    optionA: 'Break new ground or explore uncharted territory',
    optionB: 'Improve existing systems or processes',
    dimension: 'innovation',
    subdimension: 'project_preference'
  },
  {
    id: 'i006',
    type: 'personality',
    questionText: 'When rules seem limiting, I:',
    optionA: 'Look for creative ways to work around them',
    optionB: 'Work within constraints to find solutions',
    dimension: 'innovation',
    subdimension: 'rule_orientation'
  },
  {
    id: 'i007',
    type: 'personality',
    questionText: 'I am drawn to ideas that are:',
    optionA: 'Novel and potentially game-changing',
    optionB: 'Practical and immediately implementable',
    dimension: 'innovation',
    subdimension: 'idea_preference'
  },
  {
    id: 'v014',
    type: 'validity',
    questionText: 'I enjoy working in challenging environments.',
    optionA: 'True - Always enjoy challenges',
    optionB: 'False - Sometimes find challenges stressful',
    dimension: 'validity',
    validityType: 'inconsistency'
  },
  {
    id: 'i008',
    type: 'personality',
    questionText: 'When planning, I focus on:',
    optionA: 'Vision and big picture possibilities',
    optionB: 'Concrete steps and deliverables',
    dimension: 'innovation',
    subdimension: 'planning_style'
  },
  {
    id: 'i009',
    type: 'personality',
    questionText: 'I handle uncertainty by:',
    optionA: 'Embracing it as an opportunity',
    optionB: 'Seeking information to reduce it',
    dimension: 'innovation',
    subdimension: 'uncertainty_tolerance'
  },
  {
    id: 'i010',
    type: 'personality',
    questionText: 'My thinking style is more:',
    optionA: 'Intuitive and pattern-based',
    optionB: 'Logical and sequential',
    dimension: 'innovation',
    subdimension: 'thinking_style'
  },
  {
    id: 'i011',
    type: 'personality',
    questionText: 'When improving processes, I:',
    optionA: 'Question fundamental assumptions',
    optionB: 'Optimize current approaches',
    dimension: 'innovation',
    subdimension: 'improvement_approach'
  },
  {
    id: 'v015',
    type: 'validity',
    questionText: 'I work well under pressure and stress.',
    optionA: 'True - Always perform well under pressure',
    optionB: 'False - Pressure sometimes affects performance',
    dimension: 'validity',
    validityType: 'random_check'
  },
  {
    id: 'i012',
    type: 'personality',
    questionText: 'I prefer work that:',
    optionA: 'Varies significantly from day to day',
    optionB: 'Has consistent patterns and expectations',
    dimension: 'innovation',
    subdimension: 'variety_preference'
  },
  {
    id: 'i013',
    type: 'personality',
    questionText: 'When others propose new ideas, I:',
    optionA: 'Build on them with additional possibilities',
    optionB: 'Evaluate their practical feasibility',
    dimension: 'innovation',
    subdimension: 'idea_response'
  },
  {
    id: 'i014',
    type: 'personality',
    questionText: 'I am most comfortable with:',
    optionA: 'Ambiguous situations requiring creativity',
    optionB: 'Clear situations with defined parameters',
    dimension: 'innovation',
    subdimension: 'comfort_zone'
  },
  {
    id: 'i015',
    type: 'personality',
    questionText: 'My communication often includes:',
    optionA: 'Metaphors and analogies',
    optionB: 'Facts and specific examples',
    dimension: 'innovation',
    subdimension: 'communication_style'
  },
  {
    id: 'v016',
    type: 'validity',
    questionText: 'I prefer working alone because teams are inefficient.',
    optionA: 'True - Always prefer working alone',
    optionB: 'False - Sometimes teams are valuable',
    dimension: 'validity',
    validityType: 'inconsistency'
  },
  {
    id: 'i016',
    type: 'personality',
    questionText: 'When researching topics, I:',
    optionA: 'Explore tangential and related areas',
    optionB: 'Focus deeply on the core subject',
    dimension: 'innovation',
    subdimension: 'research_style'
  },
  {
    id: 'i017',
    type: 'personality',
    questionText: 'I generate my best ideas when:',
    optionA: 'My mind is free to wander and connect',
    optionB: 'I focus intently on the specific problem',
    dimension: 'innovation',
    subdimension: 'ideation_conditions'
  },
  {
    id: 'i018',
    type: 'personality',
    questionText: 'When implementing solutions, I:',
    optionA: 'Iterate and refine based on feedback',
    optionB: 'Execute according to the established plan',
    dimension: 'innovation',
    subdimension: 'implementation_style'
  },
  {
    id: 'i019',
    type: 'personality',
    questionText: 'I prefer to work with:',
    optionA: 'Abstract concepts and theoretical frameworks',
    optionB: 'Concrete data and tangible materials',
    dimension: 'innovation',
    subdimension: 'work_preference'
  },
  {
    id: 'v017',
    type: 'validity',
    questionText: 'I rarely feel stressed because I handle everything perfectly.',
    optionA: 'True - Never feel stressed',
    optionB: 'False - Sometimes feel stressed',
    dimension: 'validity',
    validityType: 'random_check'
  },
  {
    id: 'i020',
    type: 'personality',
    questionText: 'When facing resource constraints, I:',
    optionA: 'Find creative ways to work around limitations',
    optionB: 'Work efficiently within available resources',
    dimension: 'innovation',
    subdimension: 'resourcefulness'
  },
  {
    id: 'i021',
    type: 'personality',
    questionText: 'My response to criticism of my ideas is:',
    optionA: 'Use it to spark new and better ideas',
    optionB: 'Defend the reasoning behind my approach',
    dimension: 'innovation',
    subdimension: 'feedback_response'
  },
  {
    id: 'i022',
    type: 'personality',
    questionText: 'I approach risk by:',
    optionA: 'Taking calculated risks for potential breakthroughs',
    optionB: 'Minimizing risk while pursuing opportunities',
    dimension: 'innovation',
    subdimension: 'risk_tolerance'
  },
  {
    id: 'i023',
    type: 'personality',
    questionText: 'When learning from failure, I:',
    optionA: 'Extract lessons to fuel future innovation',
    optionB: 'Analyze what went wrong to prevent repetition',
    dimension: 'innovation',
    subdimension: 'failure_response'
  },
  {
    id: 'v018',
    type: 'validity',
    questionText: 'I dislike challenging work because it requires too much effort.',
    optionA: 'True - Avoid challenging work',
    optionB: 'False - Sometimes enjoy challenges',
    dimension: 'validity',
    validityType: 'inconsistency'
  },
  {
    id: 'i024',
    type: 'personality',
    questionText: 'My ideal work environment encourages:',
    optionA: 'Experimentation and creative exploration',
    optionB: 'Excellence through proven methodologies',
    dimension: 'innovation',
    subdimension: 'environment_preference'
  },
  {
    id: 'i025',
    type: 'personality',
    questionText: 'When collaborating on innovation, I:',
    optionA: 'Thrive on diverse perspectives and cross-pollination',
    optionB: 'Value expertise and focused collaboration',
    dimension: 'innovation',
    subdimension: 'collaboration_style'
  },

  // RESILIENCE (25 questions)
  {
    id: 'r001',
    type: 'personality',
    questionText: 'When facing setbacks, I:',
    optionA: 'Bounce back quickly and keep moving forward',
    optionB: 'Take time to process before moving on',
    dimension: 'resilience',
    subdimension: 'recovery_speed'
  },
  {
    id: 'r002',
    type: 'personality',
    questionText: 'Under pressure, I:',
    optionA: 'Stay calm and think clearly',
    optionB: 'Feel the stress but push through it',
    dimension: 'resilience',
    subdimension: 'stress_tolerance'
  },
  {
    id: 'r003',
    type: 'personality',
    questionText: 'When things go wrong, I typically think:',
    optionA: 'This is temporary and I can handle it',
    optionB: 'This is really challenging and concerning',
    dimension: 'resilience',
    subdimension: 'optimism'
  },
  {
    id: 'v019',
    type: 'validity',
    questionText: 'I prefer working under pressure because it brings out my best.',
    optionA: 'True - Always best under pressure',
    optionB: 'False - Sometimes pressure is challenging',
    dimension: 'validity',
    validityType: 'random_check'
  },
  {
    id: 'r004',
    type: 'personality',
    questionText: 'My energy level throughout the day is:',
    optionA: 'Consistently high and steady',
    optionB: 'Variable depending on circumstances',
    dimension: 'resilience',
    subdimension: 'energy_management'
  },
  {
    id: 'r005',
    type: 'personality',
    questionText: 'When criticized unfairly, I:',
    optionA: 'Don\'t let it affect my confidence',
    optionB: 'Feel hurt but work through it',
    dimension: 'resilience',
    subdimension: 'emotional_stability'
  },
  {
    id: 'r006',
    type: 'personality',
    questionText: 'In high-stress situations, I:',
    optionA: 'Perform at my best',
    optionB: 'Do well but feel the strain',
    dimension: 'resilience',
    subdimension: 'pressure_performance'
  },
  {
    id: 'r007',
    type: 'personality',
    questionText: 'When facing multiple deadlines, I:',
    optionA: 'Stay organized and handle them systematically',
    optionB: 'Feel overwhelmed but manage to get through',
    dimension: 'resilience',
    subdimension: 'workload_management'
  },
  {
    id: 'v020',
    type: 'validity',
    questionText: 'I feel overwhelmed when working under tight deadlines.',
    optionA: 'True - Always feel overwhelmed',
    optionB: 'False - Sometimes handle deadlines well',
    dimension: 'validity',
    validityType: 'random_check'
  },
  {
    id: 'r008',
    type: 'personality',
    questionText: 'My overall outlook on life is:',
    optionA: 'Very positive - things usually work out',
    optionB: 'Realistic - life has ups and downs',
    dimension: 'resilience',
    subdimension: 'life_perspective'
  },
  {
    id: 'r009',
    type: 'personality',
    questionText: 'When learning new skills, I:',
    optionA: 'Persist through difficulties without getting discouraged',
    optionB: 'Sometimes get frustrated but keep trying',
    dimension: 'resilience',
    subdimension: 'persistence'
  },
  {
    id: 'r010',
    type: 'personality',
    questionText: 'After a difficult day at work, I:',
    optionA: 'Quickly shift gears and enjoy my personal time',
    optionB: 'Need some time to decompress and reset',
    dimension: 'resilience',
    subdimension: 'work_recovery'
  },
  {
    id: 'r011',
    type: 'personality',
    questionText: 'When facing uncertainty, I:',
    optionA: 'Stay focused on what I can control',
    optionB: 'Feel anxious but manage to cope',
    dimension: 'resilience',
    subdimension: 'uncertainty_management'
  },
  {
    id: 'r012',
    type: 'personality',
    questionText: 'My response to major changes is:',
    optionA: 'Adapt quickly and find opportunities',
    optionB: 'Adjust gradually with some initial stress',
    dimension: 'resilience',
    subdimension: 'adaptability'
  },
  {
    id: 'r013',
    type: 'personality',
    questionText: 'When dealing with difficult people, I:',
    optionA: 'Maintain my composure and find ways to work together',
    optionB: 'Stay professional but feel drained by the interaction',
    dimension: 'resilience',
    subdimension: 'interpersonal_resilience'
  },
  {
    id: 'r014',
    type: 'personality',
    questionText: 'My self-confidence is:',
    optionA: 'Generally stable regardless of circumstances',
    optionB: 'Strong but can be affected by major events',
    dimension: 'resilience',
    subdimension: 'self_confidence'
  },
  {
    id: 'r015',
    type: 'personality',
    questionText: 'When projects don\'t go as planned, I:',
    optionA: 'Stay motivated and look for alternative approaches',
    optionB: 'Feel disappointed but continue working toward the goal',
    dimension: 'resilience',
    subdimension: 'goal_persistence'
  },
  {
    id: 'r016',
    type: 'personality',
    questionText: 'My emotional reactions to stress are:',
    optionA: 'Generally mild and short-lived',
    optionB: 'Noticeable but manageable',
    dimension: 'resilience',
    subdimension: 'emotional_regulation'
  },
  {
    id: 'r017',
    type: 'personality',
    questionText: 'When I make mistakes, I:',
    optionA: 'Learn quickly and move forward without dwelling',
    optionB: 'Take time to fully process and understand the impact',
    dimension: 'resilience',
    subdimension: 'mistake_recovery'
  },
  {
    id: 'r018',
    type: 'personality',
    questionText: 'In competitive environments, I:',
    optionA: 'Thrive on the challenge and perform well',
    optionB: 'Compete effectively but feel the pressure',
    dimension: 'resilience',
    subdimension: 'competitive_resilience'
  },
  {
    id: 'r019',
    type: 'personality',
    questionText: 'When workload increases significantly, I:',
    optionA: 'Rise to the challenge and maintain quality',
    optionB: 'Work harder but worry about maintaining standards',
    dimension: 'resilience',
    subdimension: 'workload_resilience'
  },
  {
    id: 'r020',
    type: 'personality',
    questionText: 'My approach to work-life balance is:',
    optionA: 'Naturally maintain boundaries without much effort',
    optionB: 'Consciously work to maintain healthy separation',
    dimension: 'resilience',
    subdimension: 'boundary_management'
  },
  {
    id: 'r021',
    type: 'personality',
    questionText: 'When receiving negative feedback, I:',
    optionA: 'Use it constructively without taking it personally',
    optionB: 'Value it but initially feel some emotional impact',
    dimension: 'resilience',
    subdimension: 'feedback_resilience'
  },
  {
    id: 'r022',
    type: 'personality',
    questionText: 'During periods of high demand, my performance:',
    optionA: 'Remains consistently high',
    optionB: 'Stays good but requires more effort to maintain',
    dimension: 'resilience',
    subdimension: 'performance_stability'
  },
  {
    id: 'r023',
    type: 'personality',
    questionText: 'When facing complex problems, I:',
    optionA: 'Stay energized and enjoy the intellectual challenge',
    optionB: 'Work through them methodically despite feeling taxed',
    dimension: 'resilience',
    subdimension: 'cognitive_resilience'
  },
  {
    id: 'r024',
    type: 'personality',
    questionText: 'My ability to stay positive during tough times is:',
    optionA: 'One of my strongest characteristics',
    optionB: 'Good, though I have moments of doubt',
    dimension: 'resilience',
    subdimension: 'positivity_maintenance'
  },
  {
    id: 'r025',
    type: 'personality',
    questionText: 'When supporting others through difficulties, I:',
    optionA: 'Provide strength without being drained myself',
    optionB: 'Help effectively but feel emotionally invested',
    dimension: 'resilience',
    subdimension: 'supportive_resilience'
  }
];

export const personalityDimensions = {
  conscientiousness: {
    name: 'Conscientiousness',
    description: 'Organization, reliability, and goal-directed behavior'
  },
  agreeableness: {
    name: 'Agreeableness', 
    description: 'Cooperation, trust, and consideration for others'
  },
  innovation: {
    name: 'Innovation',
    description: 'Creativity, openness to change, and novel thinking'
  },
  resilience: {
    name: 'Resilience',
    description: 'Emotional stability, stress tolerance, and recovery ability'
  }
};