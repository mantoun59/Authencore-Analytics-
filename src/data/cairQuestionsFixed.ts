export interface CAIRQuestion {
  id: string;
  type: 'forced_choice' | 'distortion';
  questionText: string;
  optionA: string;
  optionB: string;
  dimension: 'conscientiousness' | 'agreeableness' | 'innovation' | 'resilience' | 'validity';
  subdimension?: string;
  reverse?: boolean;
  distortionType?: 'fake_good' | 'fake_bad' | 'inconsistency' | 'random_check';
}

// Complete 100 personality questions + 20 distortion questions = 120 total
export const cairQuestions: CAIRQuestion[] = [
  // CONSCIENTIOUSNESS (25 questions)
  {
    id: 'c001',
    type: 'forced_choice',
    questionText: 'When planning projects, I prefer to:',
    optionA: 'Create detailed timelines and stick to them',
    optionB: 'Set general goals and adapt as needed',
    dimension: 'conscientiousness',
    subdimension: 'planning'
  },
  {
    id: 'c002',
    type: 'forced_choice',
    questionText: 'My workspace is typically:',
    optionA: 'Highly organized with everything in its place',
    optionB: 'Lived-in with some controlled chaos',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'c003',
    type: 'forced_choice',
    questionText: 'When facing deadlines, I:',
    optionA: 'Complete tasks well ahead of schedule',
    optionB: 'Work efficiently under time pressure',
    dimension: 'conscientiousness',
    subdimension: 'time_management'
  },
  {
    id: 'c004',
    type: 'forced_choice',
    questionText: 'I approach quality standards by:',
    optionA: 'Striving for perfection in every detail',
    optionB: 'Balancing quality with practical constraints',
    dimension: 'conscientiousness',
    subdimension: 'quality_focus'
  },
  {
    id: 'c005',
    type: 'forced_choice',
    questionText: 'When given multiple tasks, I:',
    optionA: 'Prioritize systematically and work sequentially',
    optionB: 'Switch between tasks based on energy and interest',
    dimension: 'conscientiousness',
    subdimension: 'task_management'
  },
  {
    id: 'c006',
    type: 'forced_choice',
    questionText: 'My approach to following rules is:',
    optionA: 'Rules exist for good reasons and should be followed',
    optionB: 'Rules are guidelines that may need interpretation',
    dimension: 'conscientiousness',
    subdimension: 'rule_following'
  },
  {
    id: 'c007',
    type: 'forced_choice',
    questionText: 'When learning new skills, I prefer to:',
    optionA: 'Master fundamentals thoroughly before advancing',
    optionB: 'Jump in and learn through trial and error',
    dimension: 'conscientiousness',
    subdimension: 'learning_approach'
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
  {
    id: 'c011',
    type: 'forced_choice',
    questionText: 'I handle multiple priorities by:',
    optionA: 'Creating systematic schedules and sticking to them',
    optionB: 'Switching between tasks based on urgency',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'c012',
    type: 'forced_choice',
    questionText: 'When faced with tedious but important work, I:',
    optionA: 'Complete it thoroughly regardless of boredom',
    optionB: 'Find ways to make it more interesting or efficient',
    dimension: 'conscientiousness',
    subdimension: 'persistence'
  },
  {
    id: 'c013',
    type: 'forced_choice',
    questionText: 'My commitment to goals is best described as:',
    optionA: 'Unwavering once I decide on something',
    optionB: 'Flexible and willing to pivot when needed',
    dimension: 'conscientiousness',
    subdimension: 'goal_commitment'
  },
  {
    id: 'c014',
    type: 'forced_choice',
    questionText: 'When others depend on my work, I:',
    optionA: 'Feel extra pressure to deliver perfectly',
    optionB: 'Focus on meeting their actual needs',
    dimension: 'conscientiousness',
    subdimension: 'responsibility'
  },
  {
    id: 'c015',
    type: 'forced_choice',
    questionText: 'I prefer work environments that are:',
    optionA: 'Structured with clear expectations',
    optionB: 'Flexible with room for creativity',
    dimension: 'conscientiousness',
    subdimension: 'structure_preference'
  },
  {
    id: 'c016',
    type: 'forced_choice',
    questionText: 'When managing resources, I:',
    optionA: 'Plan carefully to avoid waste',
    optionB: 'Use what I need to get results',
    dimension: 'conscientiousness',
    subdimension: 'resource_management'
  },
  {
    id: 'c017',
    type: 'forced_choice',
    questionText: 'My approach to documentation is:',
    optionA: 'Detailed records are essential',
    optionB: 'Document what\'s necessary for others',
    dimension: 'conscientiousness',
    subdimension: 'documentation'
  },
  {
    id: 'c018',
    type: 'forced_choice',
    questionText: 'When I commit to something, others can expect:',
    optionA: 'Exactly what I promised, when I promised',
    optionB: 'Good faith effort with honest communication',
    dimension: 'conscientiousness',
    subdimension: 'reliability'
  },
  {
    id: 'c019',
    type: 'forced_choice',
    questionText: 'I handle interruptions by:',
    optionA: 'Minimizing them to maintain focus',
    optionB: 'Adapting my workflow to accommodate them',
    dimension: 'conscientiousness',
    subdimension: 'focus_management'
  },
  {
    id: 'c020',
    type: 'forced_choice',
    questionText: 'When evaluating my work, I focus on:',
    optionA: 'Areas where I could have done better',
    optionB: 'Whether I achieved the intended outcome',
    dimension: 'conscientiousness',
    subdimension: 'self_evaluation'
  },
  {
    id: 'c021',
    type: 'forced_choice',
    questionText: 'My personal standards are:',
    optionA: 'Higher than most people would expect',
    optionB: 'Appropriate for the situation',
    dimension: 'conscientiousness',
    subdimension: 'standards'
  },
  {
    id: 'c022',
    type: 'forced_choice',
    questionText: 'When building habits, I:',
    optionA: 'Create detailed systems and track progress',
    optionB: 'Start simple and build naturally over time',
    dimension: 'conscientiousness',
    subdimension: 'habit_formation'
  },
  {
    id: 'c023',
    type: 'forced_choice',
    questionText: 'I approach long-term projects by:',
    optionA: 'Breaking them into detailed phases',
    optionB: 'Setting milestones and adjusting along the way',
    dimension: 'conscientiousness',
    subdimension: 'project_management'
  },
  {
    id: 'c024',
    type: 'forced_choice',
    questionText: 'When others are less organized than me, I:',
    optionA: 'Feel frustrated by their lack of structure',
    optionB: 'Appreciate different working styles',
    dimension: 'conscientiousness',
    subdimension: 'tolerance'
  },
  {
    id: 'c025',
    type: 'forced_choice',
    questionText: 'My relationship with time is best described as:',
    optionA: 'Time is precious and should be optimized',
    optionB: 'Time is a resource to be used wisely',
    dimension: 'conscientiousness',
    subdimension: 'time_orientation'
  },

  // AGREEABLENESS (25 questions)
  {
    id: 'a001',
    type: 'forced_choice',
    questionText: 'When conflicts arise, I typically:',
    optionA: 'Seek harmony and compromise',
    optionB: 'Address issues directly and honestly',
    dimension: 'agreeableness',
    subdimension: 'conflict_approach'
  },
  {
    id: 'a002',
    type: 'forced_choice',
    questionText: 'I believe most people are:',
    optionA: 'Fundamentally good and trustworthy',
    optionB: 'Mixed, requiring careful judgment',
    dimension: 'agreeableness',
    subdimension: 'trust'
  },
  {
    id: 'a003',
    type: 'forced_choice',
    questionText: 'When someone asks for help, I:',
    optionA: 'Almost always say yes if I can',
    optionB: 'Consider my capacity and priorities first',
    dimension: 'agreeableness',
    subdimension: 'helpfulness'
  },
  {
    id: 'a004',
    type: 'forced_choice',
    questionText: 'In group decisions, I prefer to:',
    optionA: 'Build consensus even if it takes longer',
    optionB: 'Make efficient decisions with key input',
    dimension: 'agreeableness',
    subdimension: 'cooperation'
  },
  {
    id: 'a005',
    type: 'forced_choice',
    questionText: 'When someone is struggling, my instinct is to:',
    optionA: 'Offer emotional support and encouragement',
    optionB: 'Help them find practical solutions',
    dimension: 'agreeableness',
    subdimension: 'empathy'
  },
  {
    id: 'a006',
    type: 'forced_choice',
    questionText: 'I handle criticism by:',
    optionA: 'Considering how it might be true',
    optionB: 'Evaluating its validity and source',
    dimension: 'agreeableness',
    subdimension: 'receptivity'
  },
  {
    id: 'a007',
    type: 'forced_choice',
    questionText: 'When others make mistakes, I:',
    optionA: 'Focus on understanding why it happened',
    optionB: 'Address what needs to be corrected',
    dimension: 'agreeableness',
    subdimension: 'forgiveness'
  },
  {
    id: 'a008',
    type: 'forced_choice',
    questionText: 'My communication style tends to be:',
    optionA: 'Gentle and considerate of feelings',
    optionB: 'Clear and straightforward',
    dimension: 'agreeableness',
    subdimension: 'communication'
  },
  {
    id: 'a009',
    type: 'forced_choice',
    questionText: 'When negotiating, I:',
    optionA: 'Look for win-win solutions',
    optionB: 'Aim for the best outcome for my side',
    dimension: 'agreeableness',
    subdimension: 'negotiation'
  },
  {
    id: 'a010',
    type: 'forced_choice',
    questionText: 'I express disagreement by:',
    optionA: 'Softening my words to avoid offense',
    optionB: 'Being direct while remaining respectful',
    dimension: 'agreeableness',
    subdimension: 'assertiveness'
  },
  {
    id: 'a011',
    type: 'forced_choice',
    questionText: 'When leading teams, I:',
    optionA: 'Emphasize collaboration and team harmony',
    optionB: 'Focus on clear goals and accountability',
    dimension: 'agreeableness',
    subdimension: 'leadership_style'
  },
  {
    id: 'a012',
    type: 'forced_choice',
    questionText: 'I tend to assume others\' motives are:',
    optionA: 'Generally positive until proven otherwise',
    optionB: 'Mixed and require observation',
    dimension: 'agreeableness',
    subdimension: 'assumption_of_intent'
  },
  {
    id: 'a013',
    type: 'forced_choice',
    questionText: 'When someone is upset with me, I:',
    optionA: 'Feel bad and want to make things right',
    optionB: 'Try to understand what happened objectively',
    dimension: 'agreeableness',
    subdimension: 'emotional_response'
  },
  {
    id: 'a014',
    type: 'forced_choice',
    questionText: 'My approach to giving feedback is:',
    optionA: 'Emphasize positives and soften critiques',
    optionB: 'Balance honest assessment with encouragement',
    dimension: 'agreeableness',
    subdimension: 'feedback_style'
  },
  {
    id: 'a015',
    type: 'forced_choice',
    questionText: 'When others are in pain, I:',
    optionA: 'Feel their pain almost as if it were my own',
    optionB: 'Feel concerned and want to help if I can',
    dimension: 'agreeableness',
    subdimension: 'emotional_sensitivity'
  },
  {
    id: 'a016',
    type: 'forced_choice',
    questionText: 'I prefer workplace cultures that are:',
    optionA: 'Warm and supportive of everyone',
    optionB: 'Professional and results-oriented',
    dimension: 'agreeableness',
    subdimension: 'culture_preference'
  },
  {
    id: 'a017',
    type: 'forced_choice',
    questionText: 'When allocating limited resources, I:',
    optionA: 'Consider everyone\'s needs fairly',
    optionB: 'Prioritize based on strategic importance',
    dimension: 'agreeableness',
    subdimension: 'fairness'
  },
  {
    id: 'a018',
    type: 'forced_choice',
    questionText: 'My tolerance for difficult people is:',
    optionA: 'High - everyone has their reasons',
    optionB: 'Moderate - depends on the impact',
    dimension: 'agreeableness',
    subdimension: 'tolerance'
  },
  {
    id: 'a019',
    type: 'forced_choice',
    questionText: 'When making tough decisions, I:',
    optionA: 'Consider how it will affect everyone involved',
    optionB: 'Focus on what\'s best for the organization',
    dimension: 'agreeableness',
    subdimension: 'decision_making'
  },
  {
    id: 'a020',
    type: 'forced_choice',
    questionText: 'I build relationships by:',
    optionA: 'Being genuinely interested in others',
    optionB: 'Finding common ground and shared goals',
    dimension: 'agreeableness',
    subdimension: 'relationship_building'
  },
  {
    id: 'a021',
    type: 'forced_choice',
    questionText: 'When someone betrays my trust, I:',
    optionA: 'Eventually forgive and give second chances',
    optionB: 'Become much more cautious with them',
    dimension: 'agreeableness',
    subdimension: 'forgiveness'
  },
  {
    id: 'a022',
    type: 'forced_choice',
    questionText: 'I handle competitive situations by:',
    optionA: 'Focusing on everyone doing their best',
    optionB: 'Playing to win while staying fair',
    dimension: 'agreeableness',
    subdimension: 'competitiveness'
  },
  {
    id: 'a023',
    type: 'forced_choice',
    questionText: 'When others succeed, I typically feel:',
    optionA: 'Genuinely happy for their achievement',
    optionB: 'Pleased and perhaps motivated to excel myself',
    dimension: 'agreeableness',
    subdimension: 'supportiveness'
  },
  {
    id: 'a024',
    type: 'forced_choice',
    questionText: 'My approach to team conflicts is:',
    optionA: 'Mediate to restore harmony',
    optionB: 'Address the root issue directly',
    dimension: 'agreeableness',
    subdimension: 'conflict_resolution'
  },
  {
    id: 'a025',
    type: 'forced_choice',
    questionText: 'I show care for others by:',
    optionA: 'Being emotionally available and supportive',
    optionB: 'Helping them achieve their goals',
    dimension: 'agreeableness',
    subdimension: 'caring_expression'
  },

  // INNOVATION (25 questions)
  {
    id: 'i001',
    type: 'forced_choice',
    questionText: 'When facing new challenges, I prefer to:',
    optionA: 'Explore creative and unconventional solutions',
    optionB: 'Build on proven methods and best practices',
    dimension: 'innovation',
    subdimension: 'problem_solving'
  },
  {
    id: 'i002',
    type: 'forced_choice',
    questionText: 'I am most energized by:',
    optionA: 'Possibilities and future potential',
    optionB: 'Current realities and concrete progress',
    dimension: 'innovation',
    subdimension: 'orientation'
  },
  {
    id: 'i003',
    type: 'forced_choice',
    questionText: 'When learning new concepts, I:',
    optionA: 'Make connections to unrelated ideas',
    optionB: 'Focus on understanding the fundamentals',
    dimension: 'innovation',
    subdimension: 'learning_style'
  },
  {
    id: 'i004',
    type: 'forced_choice',
    questionText: 'My approach to brainstorming is:',
    optionA: 'Generate many ideas without immediate judgment',
    optionB: 'Focus on feasible and practical solutions',
    dimension: 'innovation',
    subdimension: 'ideation'
  },
  {
    id: 'i005',
    type: 'forced_choice',
    questionText: 'I prefer projects that:',
    optionA: 'Break new ground or explore uncharted territory',
    optionB: 'Improve existing systems or processes',
    dimension: 'innovation',
    subdimension: 'project_preference'
  },
  {
    id: 'i006',
    type: 'forced_choice',
    questionText: 'When rules seem limiting, I:',
    optionA: 'Look for creative ways to work around them',
    optionB: 'Work within constraints to find solutions',
    dimension: 'innovation',
    subdimension: 'rule_orientation'
  },
  {
    id: 'i007',
    type: 'forced_choice',
    questionText: 'I am drawn to ideas that are:',
    optionA: 'Novel and potentially game-changing',
    optionB: 'Practical and immediately implementable',
    dimension: 'innovation',
    subdimension: 'idea_preference'
  },
  {
    id: 'i008',
    type: 'forced_choice',
    questionText: 'When planning, I focus on:',
    optionA: 'Vision and big picture possibilities',
    optionB: 'Concrete steps and deliverables',
    dimension: 'innovation',
    subdimension: 'planning_style'
  },
  {
    id: 'i009',
    type: 'forced_choice',
    questionText: 'I handle uncertainty by:',
    optionA: 'Embracing it as an opportunity',
    optionB: 'Seeking information to reduce it',
    dimension: 'innovation',
    subdimension: 'uncertainty_tolerance'
  },
  {
    id: 'i010',
    type: 'forced_choice',
    questionText: 'My thinking style is more:',
    optionA: 'Intuitive and pattern-based',
    optionB: 'Logical and sequential',
    dimension: 'innovation',
    subdimension: 'thinking_style'
  },
  {
    id: 'i011',
    type: 'forced_choice',
    questionText: 'When improving processes, I:',
    optionA: 'Question fundamental assumptions',
    optionB: 'Optimize current approaches',
    dimension: 'innovation',
    subdimension: 'improvement_approach'
  },
  {
    id: 'i012',
    type: 'forced_choice',
    questionText: 'I prefer work that:',
    optionA: 'Varies significantly from day to day',
    optionB: 'Has consistent patterns and expectations',
    dimension: 'innovation',
    subdimension: 'variety_preference'
  },
  {
    id: 'i013',
    type: 'forced_choice',
    questionText: 'When others propose new ideas, I:',
    optionA: 'Build on them with additional possibilities',
    optionB: 'Evaluate their practical feasibility',
    dimension: 'innovation',
    subdimension: 'idea_response'
  },
  {
    id: 'i014',
    type: 'forced_choice',
    questionText: 'I am most comfortable with:',
    optionA: 'Ambiguous situations requiring creativity',
    optionB: 'Clear situations with defined parameters',
    dimension: 'innovation',
    subdimension: 'comfort_zone'
  },
  {
    id: 'i015',
    type: 'forced_choice',
    questionText: 'My communication often includes:',
    optionA: 'Metaphors and analogies',
    optionB: 'Facts and specific examples',
    dimension: 'innovation',
    subdimension: 'communication_style'
  },
  {
    id: 'i016',
    type: 'forced_choice',
    questionText: 'When researching topics, I:',
    optionA: 'Explore tangential and related areas',
    optionB: 'Focus deeply on the core subject',
    dimension: 'innovation',
    subdimension: 'research_style'
  },
  {
    id: 'i017',
    type: 'forced_choice',
    questionText: 'I generate my best ideas when:',
    optionA: 'My mind is free to wander and connect',
    optionB: 'I focus intently on the specific problem',
    dimension: 'innovation',
    subdimension: 'creativity_process'
  },
  {
    id: 'i018',
    type: 'forced_choice',
    questionText: 'I prefer feedback that:',
    optionA: 'Encourages exploration of new directions',
    optionB: 'Helps refine and perfect current work',
    dimension: 'innovation',
    subdimension: 'feedback_preference'
  },
  {
    id: 'i019',
    type: 'forced_choice',
    questionText: 'When starting new projects, I:',
    optionA: 'Begin with broad exploration',
    optionB: 'Start with clear objectives',
    dimension: 'innovation',
    subdimension: 'project_initiation'
  },
  {
    id: 'i020',
    type: 'forced_choice',
    questionText: 'I am energized by:',
    optionA: 'Theoretical discussions and conceptual debates',
    optionB: 'Practical applications and real-world results',
    dimension: 'innovation',
    subdimension: 'energy_source'
  },
  {
    id: 'i021',
    type: 'forced_choice',
    questionText: 'My workspace reflects:',
    optionA: 'Creative inspiration and visual stimulation',
    optionB: 'Functional organization and efficiency',
    dimension: 'innovation',
    subdimension: 'environment_preference'
  },
  {
    id: 'i022',
    type: 'forced_choice',
    questionText: 'When solving problems, I:',
    optionA: 'Start with the ideal solution and work backward',
    optionB: 'Start with current constraints and work forward',
    dimension: 'innovation',
    subdimension: 'solution_approach'
  },
  {
    id: 'i023',
    type: 'forced_choice',
    questionText: 'I prefer meetings that:',
    optionA: 'Allow for open-ended discussion and exploration',
    optionB: 'Have clear agendas and defined outcomes',
    dimension: 'innovation',
    subdimension: 'meeting_preference'
  },
  {
    id: 'i024',
    type: 'forced_choice',
    questionText: 'When evaluating ideas, I focus on:',
    optionA: 'Their transformational potential',
    optionB: 'Their implementation feasibility',
    dimension: 'innovation',
    subdimension: 'evaluation_criteria'
  },
  {
    id: 'i025',
    type: 'forced_choice',
    questionText: 'I find inspiration in:',
    optionA: 'Cross-industry examples and diverse fields',
    optionB: 'Best practices within my domain',
    dimension: 'innovation',
    subdimension: 'inspiration_source'
  },

  // RESILIENCE (25 questions)
  {
    id: 'r001',
    type: 'forced_choice',
    questionText: 'When facing significant setbacks, I:',
    optionA: 'Quickly bounce back and refocus on solutions',
    optionB: 'Take time to process before moving forward',
    dimension: 'resilience',
    subdimension: 'recovery_speed'
  },
  {
    id: 'r002',
    type: 'forced_choice',
    questionText: 'I view failure as:',
    optionA: 'Valuable learning opportunity',
    optionB: 'Temporary obstacle to overcome',
    dimension: 'resilience',
    subdimension: 'failure_mindset'
  },
  {
    id: 'r003',
    type: 'forced_choice',
    questionText: 'Under pressure, I tend to:',
    optionA: 'Maintain calm and think clearly',
    optionB: 'Feel stressed but push through',
    dimension: 'resilience',
    subdimension: 'pressure_response'
  },
  {
    id: 'r004',
    type: 'forced_choice',
    questionText: 'When plans fall apart, I:',
    optionA: 'Adapt quickly and find alternative paths',
    optionB: 'Regroup and create new structured plans',
    dimension: 'resilience',
    subdimension: 'adaptability'
  },
  {
    id: 'r005',
    type: 'forced_choice',
    questionText: 'I handle criticism by:',
    optionA: 'Extracting useful insights and moving on',
    optionB: 'Reflecting carefully on its validity',
    dimension: 'resilience',
    subdimension: 'feedback_processing'
  },
  {
    id: 'r006',
    type: 'forced_choice',
    questionText: 'During difficult times, my energy:',
    optionA: 'Remains relatively stable',
    optionB: 'Fluctuates but eventually stabilizes',
    dimension: 'resilience',
    subdimension: 'energy_management'
  },
  {
    id: 'r007',
    type: 'forced_choice',
    questionText: 'I cope with stress by:',
    optionA: 'Maintaining perspective and staying grounded',
    optionB: 'Working harder to regain control',
    dimension: 'resilience',
    subdimension: 'stress_coping'
  },
  {
    id: 'r008',
    type: 'forced_choice',
    questionText: 'When facing uncertainty, I:',
    optionA: 'Stay flexible and see what unfolds',
    optionB: 'Seek information to reduce uncertainty',
    dimension: 'resilience',
    subdimension: 'uncertainty_management'
  },
  {
    id: 'r009',
    type: 'forced_choice',
    questionText: 'My support system is:',
    optionA: 'Strong and readily available',
    optionB: 'Present but I prefer self-reliance',
    dimension: 'resilience',
    subdimension: 'social_support'
  },
  {
    id: 'r010',
    type: 'forced_choice',
    questionText: 'When overwhelmed, I:',
    optionA: 'Break things down into manageable pieces',
    optionB: 'Take a step back to regain perspective',
    dimension: 'resilience',
    subdimension: 'overwhelm_management'
  },
  {
    id: 'r011',
    type: 'forced_choice',
    questionText: 'I maintain motivation by:',
    optionA: 'Connecting work to larger purpose',
    optionB: 'Setting and achieving concrete goals',
    dimension: 'resilience',
    subdimension: 'motivation_maintenance'
  },
  {
    id: 'r012',
    type: 'forced_choice',
    questionText: 'During conflicts, I:',
    optionA: 'Stay centered and focus on resolution',
    optionB: 'Feel tension but work through it',
    dimension: 'resilience',
    subdimension: 'conflict_management'
  },
  {
    id: 'r013',
    type: 'forced_choice',
    questionText: 'I recharge my energy by:',
    optionA: 'Taking regular breaks and maintaining balance',
    optionB: 'Completing tasks and seeing progress',
    dimension: 'resilience',
    subdimension: 'energy_restoration'
  },
  {
    id: 'r014',
    type: 'forced_choice',
    questionText: 'When things go wrong, I:',
    optionA: 'Focus on what I can control and influence',
    optionB: 'Analyze what happened and plan prevention',
    dimension: 'resilience',
    subdimension: 'control_focus'
  },
  {
    id: 'r015',
    type: 'forced_choice',
    questionText: 'My emotional stability is:',
    optionA: 'Consistently steady across situations',
    optionB: 'Generally stable with occasional fluctuations',
    dimension: 'resilience',
    subdimension: 'emotional_stability'
  },
  {
    id: 'r016',
    type: 'forced_choice',
    questionText: 'I handle change by:',
    optionA: 'Embracing it as natural and inevitable',
    optionB: 'Managing the transition carefully',
    dimension: 'resilience',
    subdimension: 'change_management'
  },
  {
    id: 'r017',
    type: 'forced_choice',
    questionText: 'When projects are cancelled, I:',
    optionA: 'Quickly redirect energy to new opportunities',
    optionB: 'Learn from the experience before moving on',
    dimension: 'resilience',
    subdimension: 'redirection_ability'
  },
  {
    id: 'r018',
    type: 'forced_choice',
    questionText: 'I maintain optimism by:',
    optionA: 'Naturally seeing possibilities in situations',
    optionB: 'Choosing to focus on positive aspects',
    dimension: 'resilience',
    subdimension: 'optimism_source'
  },
  {
    id: 'r019',
    type: 'forced_choice',
    questionText: 'During busy periods, I:',
    optionA: 'Maintain steady performance',
    optionB: 'Rise to meet increased demands',
    dimension: 'resilience',
    subdimension: 'workload_management'
  },
  {
    id: 'r020',
    type: 'forced_choice',
    questionText: 'I handle disappointment by:',
    optionA: 'Processing it quickly and moving forward',
    optionB: 'Understanding its impact before progressing',
    dimension: 'resilience',
    subdimension: 'disappointment_processing'
  },
  {
    id: 'r021',
    type: 'forced_choice',
    questionText: 'My confidence in difficult situations:',
    optionA: 'Remains strong and unwavering',
    optionB: 'May dip but recovers quickly',
    dimension: 'resilience',
    subdimension: 'confidence_stability'
  },
  {
    id: 'r022',
    type: 'forced_choice',
    questionText: 'I learn from mistakes by:',
    optionA: 'Integrating lessons without dwelling',
    optionB: 'Thoroughly analyzing what went wrong',
    dimension: 'resilience',
    subdimension: 'learning_integration'
  },
  {
    id: 'r023',
    type: 'forced_choice',
    questionText: 'When resources are limited, I:',
    optionA: 'Find creative ways to work within constraints',
    optionB: 'Prioritize and focus on essentials',
    dimension: 'resilience',
    subdimension: 'resource_management'
  },
  {
    id: 'r024',
    type: 'forced_choice',
    questionText: 'I maintain perspective by:',
    optionA: 'Naturally seeing the bigger picture',
    optionB: 'Deliberately stepping back to gain clarity',
    dimension: 'resilience',
    subdimension: 'perspective_maintenance'
  },
  {
    id: 'r025',
    type: 'forced_choice',
    questionText: 'My approach to recovery after setbacks is:',
    optionA: 'Trust the natural healing process',
    optionB: 'Take active steps to rebuild',
    dimension: 'resilience',
    subdimension: 'recovery_approach'
  },

  // DISTORTION DETECTION QUESTIONS (20 questions)
  {
    id: 'd001',
    type: 'distortion',
    questionText: 'I am the most capable person in every team I join.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd002',
    type: 'distortion',
    questionText: 'I have never told even a small lie.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd003',
    type: 'distortion',
    questionText: 'I am terrible at everything I attempt.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd004',
    type: 'distortion',
    questionText: 'I never have any positive thoughts.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd005',
    type: 'distortion',
    questionText: 'I am perfect in every way imaginable.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd006',
    type: 'distortion',
    questionText: 'Everyone always loves everything about me.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd007',
    type: 'distortion',
    questionText: 'I have never experienced any negative emotion.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd008',
    type: 'distortion',
    questionText: 'I constantly fail at everything.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd009',
    type: 'distortion',
    questionText: 'Blue is the same color as seven.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'random_check'
  },
  {
    id: 'd010',
    type: 'distortion',
    questionText: 'I always make the right decision in every situation.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd011',
    type: 'distortion',
    questionText: 'Nothing I do ever works out well.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd012',
    type: 'distortion',
    questionText: 'I have never made any mistakes in my entire life.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd013',
    type: 'distortion',
    questionText: 'Cars typically drive on the ceiling.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'random_check'
  },
  {
    id: 'd014',
    type: 'distortion',
    questionText: 'I am completely worthless as a person.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd015',
    type: 'distortion',
    questionText: 'I never experience any stress or challenges.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd016',
    type: 'distortion',
    questionText: 'Water flows upward naturally.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'random_check'
  },
  {
    id: 'd017',
    type: 'distortion',
    questionText: 'I am incapable of learning anything new.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd018',
    type: 'distortion',
    questionText: 'I have never had a negative thought about anyone.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'd019',
    type: 'distortion',
    questionText: 'Everyone dislikes me intensely.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },
  {
    id: 'd020',
    type: 'distortion',
    questionText: 'I am loved by every single person I meet.',
    optionA: 'Completely true',
    optionB: 'Mostly false',
    dimension: 'validity',
    distortionType: 'fake_good'
  }
];