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
    subdimension: 'perseverance'
  },
  {
    id: 'c013',
    type: 'forced_choice',
    questionText: 'My approach to quality is:',
    optionA: 'Perfection in every detail is the standard',
    optionB: 'Good enough to meet objectives is sufficient',
    dimension: 'conscientiousness',
    subdimension: 'perfectionism'
  },
  {
    id: 'c014',
    type: 'forced_choice',
    questionText: 'I prefer instructions that are:',
    optionA: 'Detailed and comprehensive',
    optionB: 'Brief and leave room for interpretation',
    dimension: 'conscientiousness',
    subdimension: 'structure_preference'
  },
  {
    id: 'c015',
    type: 'forced_choice',
    questionText: 'When others depend on my work, I:',
    optionA: 'Feel extra pressure to deliver flawlessly',
    optionB: 'Work normally but communicate any issues early',
    dimension: 'conscientiousness',
    subdimension: 'responsibility'
  },
  {
    id: 'c016',
    type: 'forced_choice',
    questionText: 'I manage my time by:',
    optionA: 'Using detailed calendars and scheduling systems',
    optionB: 'Keeping mental notes and going with the flow',
    dimension: 'conscientiousness',
    subdimension: 'time_management'
  },
  {
    id: 'c017',
    type: 'forced_choice',
    questionText: 'When reviewing my work, I:',
    optionA: 'Check multiple times for any possible errors',
    optionB: 'Review once to catch major issues',
    dimension: 'conscientiousness',
    subdimension: 'quality_control'
  },
  {
    id: 'c018',
    type: 'forced_choice',
    questionText: 'I approach deadlines by:',
    optionA: 'Building in buffer time for unexpected issues',
    optionB: 'Using all available time to maximize quality',
    dimension: 'conscientiousness',
    subdimension: 'planning'
  },
  {
    id: 'c019',
    type: 'forced_choice',
    questionText: 'My filing and documentation system is:',
    optionA: 'Meticulously organized and easily searchable',
    optionB: 'Functional but somewhat informal',
    dimension: 'conscientiousness',
    subdimension: 'organization'
  },
  {
    id: 'c020',
    type: 'forced_choice',
    questionText: 'When I say I\'ll do something, others can:',
    optionA: 'Count on it happening exactly as promised',
    optionB: 'Expect a good faith effort with possible changes',
    dimension: 'conscientiousness',
    subdimension: 'reliability'
  },
  {
    id: 'c021',
    type: 'forced_choice',
    questionText: 'I handle routine tasks by:',
    optionA: 'Following established procedures consistently',
    optionB: 'Looking for ways to improve or streamline them',
    dimension: 'conscientiousness',
    subdimension: 'routine_compliance'
  },
  {
    id: 'c022',
    type: 'forced_choice',
    questionText: 'My approach to personal development is:',
    optionA: 'Systematic with clear goals and metrics',
    optionB: 'Organic based on interests and opportunities',
    dimension: 'conscientiousness',
    subdimension: 'self_discipline'
  },
  {
    id: 'c023',
    type: 'forced_choice',
    questionText: 'When starting a complex project, I:',
    optionA: 'Map out all steps before beginning',
    optionB: 'Start with what I know and figure out the rest',
    dimension: 'conscientiousness',
    subdimension: 'planning'
  },
  {
    id: 'c024',
    type: 'forced_choice',
    questionText: 'I maintain professional standards by:',
    optionA: 'Consistently adhering to established best practices',
    optionB: 'Adapting standards to fit specific situations',
    dimension: 'conscientiousness',
    subdimension: 'professionalism'
  },
  {
    id: 'c025',
    type: 'forced_choice',
    questionText: 'My work environment functions best when:',
    optionA: 'Everything has a designated place and process',
    optionB: 'There\'s flexibility for spontaneous collaboration',
    dimension: 'conscientiousness',
    subdimension: 'environmental_order'
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
  {
    id: 'a011',
    type: 'forced_choice',
    questionText: 'When someone disagrees with me, I:',
    optionA: 'Try to understand their perspective first',
    optionB: 'Present stronger evidence for my position',
    dimension: 'agreeableness',
    subdimension: 'perspective_taking'
  },
  {
    id: 'a012',
    type: 'forced_choice',
    questionText: 'My approach to workplace politics is:',
    optionA: 'Focus on maintaining positive relationships',
    optionB: 'Stay focused on work and avoid office politics',
    dimension: 'agreeableness',
    subdimension: 'harmony_seeking'
  },
  {
    id: 'a013',
    type: 'forced_choice',
    questionText: 'When allocating resources, I consider:',
    optionA: 'What\'s fair and equitable for everyone involved',
    optionB: 'What will produce the best overall results',
    dimension: 'agreeableness',
    subdimension: 'fairness'
  },
  {
    id: 'a014',
    type: 'forced_choice',
    questionText: 'I respond to others\' mistakes by:',
    optionA: 'Focusing on learning and improvement',
    optionB: 'Analyzing what went wrong and preventing recurrence',
    dimension: 'agreeableness',
    subdimension: 'forgiveness'
  },
  {
    id: 'a015',
    type: 'forced_choice',
    questionText: 'My leadership style emphasizes:',
    optionA: 'Supporting and developing team members',
    optionB: 'Setting clear expectations and driving results',
    dimension: 'agreeableness',
    subdimension: 'nurturing'
  },
  {
    id: 'a016',
    type: 'forced_choice',
    questionText: 'When someone is struggling at work, I:',
    optionA: 'Offer assistance and emotional support',
    optionB: 'Suggest resources or training they might need',
    dimension: 'agreeableness',
    subdimension: 'altruism'
  },
  {
    id: 'a017',
    type: 'forced_choice',
    questionText: 'In competitive situations, I:',
    optionA: 'Prefer collaboration over competition',
    optionB: 'Enjoy the challenge and strive to win',
    dimension: 'agreeableness',
    subdimension: 'competitiveness',
    reverse: true
  },
  {
    id: 'a018',
    type: 'forced_choice',
    questionText: 'My decision-making process includes:',
    optionA: 'Considering impact on all stakeholders',
    optionB: 'Focusing on efficiency and optimal outcomes',
    dimension: 'agreeableness',
    subdimension: 'consideration'
  },
  {
    id: 'a019',
    type: 'forced_choice',
    questionText: 'When someone interrupts my work, I:',
    optionA: 'Welcome the interaction and try to help',
    optionB: 'Politely redirect them to respect my time',
    dimension: 'agreeableness',
    subdimension: 'accommodation'
  },
  {
    id: 'a020',
    type: 'forced_choice',
    questionText: 'I build professional relationships by:',
    optionA: 'Being genuinely interested in others as people',
    optionB: 'Focusing on shared work goals and objectives',
    dimension: 'agreeableness',
    subdimension: 'social_interest'
  },
  {
    id: 'a021',
    type: 'forced_choice',
    questionText: 'When someone takes credit for my work, I:',
    optionA: 'Address it diplomatically to maintain the relationship',
    optionB: 'Firmly correct the record to protect my reputation',
    dimension: 'agreeableness',
    subdimension: 'conflict_avoidance'
  },
  {
    id: 'a022',
    type: 'forced_choice',
    questionText: 'My approach to team recognition is:',
    optionA: 'Highlight everyone\'s contributions equally',
    optionB: 'Recognize individual achievements based on merit',
    dimension: 'agreeableness',
    subdimension: 'egalitarianism'
  },
  {
    id: 'a023',
    type: 'forced_choice',
    questionText: 'When setting team goals, I:',
    optionA: 'Ensure they\'re achievable for all team members',
    optionB: 'Set challenging targets to drive high performance',
    dimension: 'agreeableness',
    subdimension: 'consideration'
  },
  {
    id: 'a024',
    type: 'forced_choice',
    questionText: 'I handle diverse opinions by:',
    optionA: 'Finding common ground and building bridges',
    optionB: 'Evaluating which perspective is most logical',
    dimension: 'agreeableness',
    subdimension: 'harmony_seeking'
  },
  {
    id: 'a025',
    type: 'forced_choice',
    questionText: 'My networking approach focuses on:',
    optionA: 'Building genuine friendships and connections',
    optionB: 'Developing strategic professional relationships',
    dimension: 'agreeableness',
    subdimension: 'relationship_orientation'
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
    subdimension: 'ambiguity_tolerance'
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
  {
    id: 'i011',
    type: 'forced_choice',
    questionText: 'I prefer work environments that:',
    optionA: 'Encourage experimentation and new approaches',
    optionB: 'Have established procedures and best practices',
    dimension: 'innovation',
    subdimension: 'innovation_culture'
  },
  {
    id: 'i012',
    type: 'forced_choice',
    questionText: 'When solving complex problems, I:',
    optionA: 'Look for patterns and novel connections',
    optionB: 'Break them down systematically step by step',
    dimension: 'innovation',
    subdimension: 'pattern_recognition'
  },
  {
    id: 'i013',
    type: 'forced_choice',
    questionText: 'My approach to established processes is:',
    optionA: 'Question them and seek improvements',
    optionB: 'Follow them unless there\'s a clear problem',
    dimension: 'innovation',
    subdimension: 'process_questioning'
  },
  {
    id: 'i014',
    type: 'forced_choice',
    questionText: 'I get inspiration from:',
    optionA: 'Diverse sources and unexpected connections',
    optionB: 'Expert knowledge and proven techniques',
    dimension: 'innovation',
    subdimension: 'inspiration_sources'
  },
  {
    id: 'i015',
    type: 'forced_choice',
    questionText: 'When facing constraints, I:',
    optionA: 'See them as creative challenges to overcome',
    optionB: 'Work efficiently within the given limitations',
    dimension: 'innovation',
    subdimension: 'constraint_response'
  },
  {
    id: 'i016',
    type: 'forced_choice',
    questionText: 'My idea evaluation process emphasizes:',
    optionA: 'Potential and possibility',
    optionB: 'Feasibility and practicality',
    dimension: 'innovation',
    subdimension: 'idea_evaluation'
  },
  {
    id: 'i017',
    type: 'forced_choice',
    questionText: 'I prefer projects that:',
    optionA: 'Push boundaries and explore new territory',
    optionB: 'Build upon proven foundations',
    dimension: 'innovation',
    subdimension: 'boundary_pushing'
  },
  {
    id: 'i018',
    type: 'forced_choice',
    questionText: 'When collaborating, I contribute:',
    optionA: 'Original perspectives and creative alternatives',
    optionB: 'Practical insights and implementation expertise',
    dimension: 'innovation',
    subdimension: 'collaboration_style'
  },
  {
    id: 'i019',
    type: 'forced_choice',
    questionText: 'My learning preference is:',
    optionA: 'Exploring multiple approaches simultaneously',
    optionB: 'Mastering one approach thoroughly',
    dimension: 'innovation',
    subdimension: 'learning_breadth'
  },
  {
    id: 'i020',
    type: 'forced_choice',
    questionText: 'I respond to failure by:',
    optionA: 'Seeing it as data for the next iteration',
    optionB: 'Analyzing what went wrong to avoid repetition',
    dimension: 'innovation',
    subdimension: 'failure_response'
  },
  {
    id: 'i021',
    type: 'forced_choice',
    questionText: 'My work style involves:',
    optionA: 'Rapid prototyping and testing ideas',
    optionB: 'Careful planning before implementation',
    dimension: 'innovation',
    subdimension: 'work_methodology'
  },
  {
    id: 'i022',
    type: 'forced_choice',
    questionText: 'I find routine work:',
    optionA: 'Boring and seek ways to make it more interesting',
    optionB: 'Satisfying when done efficiently and well',
    dimension: 'innovation',
    subdimension: 'routine_tolerance',
    reverse: true
  },
  {
    id: 'i023',
    type: 'forced_choice',
    questionText: 'When presenting ideas, I focus on:',
    optionA: 'Vision and transformative potential',
    optionB: 'Evidence and practical benefits',
    dimension: 'innovation',
    subdimension: 'presentation_focus'
  },
  {
    id: 'i024',
    type: 'forced_choice',
    questionText: 'My professional development emphasizes:',
    optionA: 'Exploring emerging trends and technologies',
    optionB: 'Deepening expertise in core competencies',
    dimension: 'innovation',
    subdimension: 'development_focus'
  },
  {
    id: 'i025',
    type: 'forced_choice',
    questionText: 'I measure success by:',
    optionA: 'How much I\'ve innovated and created',
    optionB: 'How well I\'ve executed and delivered',
    dimension: 'innovation',
    subdimension: 'success_metrics'
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
  },
  {
    id: 'r011',
    type: 'forced_choice',
    questionText: 'When plans don\'t work out, I:',
    optionA: 'Quickly adapt and find alternative approaches',
    optionB: 'Feel disappointed but eventually adjust',
    dimension: 'resilience',
    subdimension: 'adaptability'
  },
  {
    id: 'r012',
    type: 'forced_choice',
    questionText: 'My confidence in handling challenges is:',
    optionA: 'High - I believe I can overcome most obstacles',
    optionB: 'Moderate - depends on the specific challenge',
    dimension: 'resilience',
    subdimension: 'self_efficacy'
  },
  {
    id: 'r013',
    type: 'forced_choice',
    questionText: 'When facing uncertainty, I:',
    optionA: 'Stay calm and focus on what I can control',
    optionB: 'Feel anxious but try to manage it',
    dimension: 'resilience',
    subdimension: 'uncertainty_tolerance'
  },
  {
    id: 'r014',
    type: 'forced_choice',
    questionText: 'My approach to obstacles is:',
    optionA: 'See them as challenges to overcome',
    optionB: 'Recognize them as serious problems to solve',
    dimension: 'resilience',
    subdimension: 'challenge_appraisal'
  },
  {
    id: 'r015',
    type: 'forced_choice',
    questionText: 'When others doubt my abilities, I:',
    optionA: 'Stay focused on my goals regardless',
    optionB: 'Feel motivated to prove them wrong',
    dimension: 'resilience',
    subdimension: 'self_confidence'
  },
  {
    id: 'r016',
    type: 'forced_choice',
    questionText: 'I handle workplace stress by:',
    optionA: 'Maintaining perspective and staying balanced',
    optionB: 'Working through it but feeling the impact',
    dimension: 'resilience',
    subdimension: 'stress_management'
  },
  {
    id: 'r017',
    type: 'forced_choice',
    questionText: 'When projects face unexpected problems, I:',
    optionA: 'See opportunities within the challenges',
    optionB: 'Focus on minimizing damage and finding solutions',
    dimension: 'resilience',
    subdimension: 'problem_reframing'
  },
  {
    id: 'r018',
    type: 'forced_choice',
    questionText: 'My emotional response to failure is:',
    optionA: 'Brief disappointment followed by renewed determination',
    optionB: 'Significant impact that takes time to process',
    dimension: 'resilience',
    subdimension: 'emotional_regulation'
  },
  {
    id: 'r019',
    type: 'forced_choice',
    questionText: 'When facing competing priorities, I:',
    optionA: 'Stay calm and work through them systematically',
    optionB: 'Feel the pressure but manage to handle them',
    dimension: 'resilience',
    subdimension: 'priority_management'
  },
  {
    id: 'r020',
    type: 'forced_choice',
    questionText: 'My sleep quality during stressful periods is:',
    optionA: 'Generally unaffected - I sleep well regardless',
    optionB: 'Sometimes disrupted but manageable',
    dimension: 'resilience',
    subdimension: 'sleep_resilience'
  },
  {
    id: 'r021',
    type: 'forced_choice',
    questionText: 'When receiving negative feedback, I:',
    optionA: 'Focus on the learning opportunity',
    optionB: 'Feel hurt initially but work to improve',
    dimension: 'resilience',
    subdimension: 'feedback_resilience'
  },
  {
    id: 'r022',
    type: 'forced_choice',
    questionText: 'During busy periods, my work quality:',
    optionA: 'Remains consistently high',
    optionB: 'Sometimes suffers but I recover quickly',
    dimension: 'resilience',
    subdimension: 'performance_consistency'
  },
  {
    id: 'r023',
    type: 'forced_choice',
    questionText: 'My support network during tough times:',
    optionA: 'I actively use it and find it very helpful',
    optionB: 'I sometimes reach out but prefer to handle things alone',
    dimension: 'resilience',
    subdimension: 'social_support_utilization'
  },
  {
    id: 'r024',
    type: 'forced_choice',
    questionText: 'When deadlines are moved up unexpectedly, I:',
    optionA: 'Adapt quickly and find ways to meet them',
    optionB: 'Feel stressed but work extra hard to deliver',
    dimension: 'resilience',
    subdimension: 'deadline_flexibility'
  },
  {
    id: 'r025',
    type: 'forced_choice',
    questionText: 'My overall resilience in professional settings is:',
    optionA: 'Very high - I thrive despite challenges',
    optionB: 'Good - I manage well with some effort',
    dimension: 'resilience',
    subdimension: 'overall_resilience'
  },

  // DISTORTION SCALE (20 questions)
  // Fake-good detection (10 questions)
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
  {
    id: 'fg009',
    type: 'distortion',
    questionText: 'I never feel stressed or overwhelmed at work.',
    optionA: 'True - Never feel stressed',
    optionB: 'False - Sometimes feel stress',
    dimension: 'validity',
    distortionType: 'fake_good'
  },
  {
    id: 'fg010',
    type: 'distortion',
    questionText: 'I always complete every task perfectly on the first try.',
    optionA: 'True - Always perfect first attempt',
    optionB: 'False - Sometimes need revisions',
    dimension: 'validity',
    distortionType: 'fake_good'
  },

  // Fake-bad detection (5 questions)
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
  {
    id: 'fb005',
    type: 'distortion',
    questionText: 'I always make the worst possible decisions.',
    optionA: 'True - Always worst decisions',
    optionB: 'False - Sometimes make good decisions',
    dimension: 'validity',
    distortionType: 'fake_bad'
  },

  // Inconsistency checks (5 questions - pairs)
  {
    id: 'ic001',
    type: 'distortion',
    questionText: 'I prefer working in teams rather than alone.',
    optionA: 'True - Prefer teamwork',
    optionB: 'False - Prefer working alone',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic002',
    type: 'distortion',
    questionText: 'I work better independently than in group settings.',
    optionA: 'True - Better independently',
    optionB: 'False - Better in groups',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic003',
    type: 'distortion',
    questionText: 'I am very detail-oriented in my work.',
    optionA: 'True - Very detail-oriented',
    optionB: 'False - Focus on big picture',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic004',
    type: 'distortion',
    questionText: 'I prefer to focus on the overall vision rather than small details.',
    optionA: 'True - Prefer big picture',
    optionB: 'False - Focus on details',
    dimension: 'validity',
    distortionType: 'inconsistency'
  },
  {
    id: 'ic005',
    type: 'distortion',
    questionText: 'I rarely pay attention to minor details in projects.',
    optionA: 'True - Don\'t focus on details',
    optionB: 'False - Pay attention to details',
    dimension: 'validity',
    distortionType: 'inconsistency'
  }
];

export const cairDimensions = {
  conscientiousness: {
    name: "Conscientiousness",
    description: "Tendency toward organization, persistence, and goal achievement",
    subdimensions: [
      "Organization", "Reliability", "Goal Orientation", "Attention to Detail", 
      "Rule Following", "Self Improvement", "Planning", "Quality Control"
    ]
  },
  agreeableness: {
    name: "Agreeableness", 
    description: "Tendency toward cooperation, trust, and interpersonal harmony",
    subdimensions: [
      "Cooperation", "Helpfulness", "Trust", "Compassion", "Empathy",
      "Modesty", "Interpersonal Warmth", "Consensus Building"
    ]
  },
  innovation: {
    name: "Innovation",
    description: "Tendency toward creativity, openness to change, and novel thinking",
    subdimensions: [
      "Creativity", "Openness to Change", "Learning Style", "Ideation",
      "Change Tolerance", "Innovation Preference", "Abstract Thinking", "Risk Taking"
    ]
  },
  resilience: {
    name: "Resilience",
    description: "Ability to bounce back from setbacks and maintain performance under pressure",
    subdimensions: [
      "Recovery Speed", "Stress Tolerance", "Optimism", "Energy Management",
      "Emotional Stability", "Pressure Performance", "Adaptability", "Persistence"
    ]
  },
  validity: {
    name: "Response Validity",
    description: "Measures of response consistency and social desirability",
    subdimensions: [
      "Fake Good", "Fake Bad", "Inconsistency", "Random Responding"
    ]
  }
};