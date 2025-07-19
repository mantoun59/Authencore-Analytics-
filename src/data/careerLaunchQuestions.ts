export const careerInterests = [
  {
    id: "ci_001",
    title: "Data Scientist",
    description: "Uncover insights from complex data to drive business decisions",
    tags: ["Analytics", "Tech", "Problem-Solving"],
    category: "stem"
  },
  {
    id: "ci_002",
    title: "UX Designer",
    description: "Create intuitive and beautiful user experiences",
    tags: ["Creative", "Tech", "User-Focused"],
    category: "creative_tech"
  },
  {
    id: "ci_003",
    title: "Sustainability Consultant",
    description: "Help organizations reduce their environmental impact",
    tags: ["Environment", "Strategy", "Impact"],
    category: "social_impact"
  },
  {
    id: "ci_004",
    title: "Digital Marketing Specialist",
    description: "Build brand presence across digital channels",
    tags: ["Creative", "Analytics", "Communication"],
    category: "business"
  },
  {
    id: "ci_005",
    title: "Healthcare Technology Specialist",
    description: "Bridge the gap between healthcare and technology",
    tags: ["Healthcare", "Tech", "Innovation"],
    category: "healthcare_tech"
  },
  {
    id: "ci_006",
    title: "AI/ML Engineer",
    description: "Build intelligent systems that learn and adapt",
    tags: ["AI", "Programming", "Innovation"],
    category: "stem"
  },
  {
    id: "ci_007",
    title: "Social Media Manager",
    description: "Craft engaging content and build online communities",
    tags: ["Creative", "Communication", "Strategy"],
    category: "business"
  },
  {
    id: "ci_008",
    title: "Environmental Engineer",
    description: "Design solutions for environmental challenges",
    tags: ["Environment", "Engineering", "Problem-Solving"],
    category: "stem"
  },
  {
    id: "ci_009",
    title: "Product Manager",
    description: "Lead product development from idea to market",
    tags: ["Strategy", "Leadership", "Innovation"],
    category: "business"
  },
  {
    id: "ci_010",
    title: "Game Developer",
    description: "Create immersive gaming experiences",
    tags: ["Creative", "Programming", "Entertainment"],
    category: "creative_tech"
  }
];

export const aptitudeTests = [
  // Verbal Reasoning Tests
  {
    id: "apt_verbal_001",
    type: "verbal_reasoning",
    title: "Word Relationships",
    instruction: "Choose the word that best completes the analogy",
    question: "Ocean is to Water as Library is to ___",
    options: [
      { id: "A", text: "Books", correct: true, dimension: "verbal", score: 1 },
      { id: "B", text: "Quiet", correct: false, dimension: "verbal", score: 0 },
      { id: "C", text: "Reading", correct: false, dimension: "verbal", score: 0 },
      { id: "D", text: "Building", correct: false, dimension: "verbal", score: 0 }
    ]
  },
  {
    id: "apt_verbal_002",
    type: "verbal_reasoning",
    title: "Reading Comprehension",
    instruction: "Read the passage and answer the question",
    passage: "Remote work has fundamentally changed how companies operate. While it offers flexibility and reduces commuting costs, it also presents challenges in team collaboration and company culture maintenance.",
    question: "What is the main challenge of remote work mentioned?",
    options: [
      { id: "A", text: "Higher costs", correct: false, dimension: "verbal", score: 0 },
      { id: "B", text: "Team collaboration difficulties", correct: true, dimension: "verbal", score: 1 },
      { id: "C", text: "Lack of flexibility", correct: false, dimension: "verbal", score: 0 },
      { id: "D", text: "Commuting issues", correct: false, dimension: "verbal", score: 0 }
    ]
  },
  
  // Numerical Reasoning Tests
  {
    id: "apt_numerical_001",
    type: "numerical_reasoning",
    title: "Data Analysis",
    instruction: "Study the chart and answer the question",
    data: { sales: [120, 150, 180, 200], months: ["Jan", "Feb", "Mar", "Apr"] },
    question: "What is the percentage increase in sales from January to April?",
    options: [
      { id: "A", text: "50%", correct: false, dimension: "numerical", score: 0 },
      { id: "B", text: "66.7%", correct: true, dimension: "numerical", score: 1 },
      { id: "C", text: "80%", correct: false, dimension: "numerical", score: 0 },
      { id: "D", text: "100%", correct: false, dimension: "numerical", score: 0 }
    ]
  },
  {
    id: "apt_numerical_002",
    type: "numerical_reasoning",
    title: "Problem Solving",
    instruction: "Solve the mathematical problem",
    question: "A company's profit increased by 25% to $75,000. What was the original profit?",
    options: [
      { id: "A", text: "$50,000", correct: false, dimension: "numerical", score: 0 },
      { id: "B", text: "$56,250", correct: false, dimension: "numerical", score: 0 },
      { id: "C", text: "$60,000", correct: true, dimension: "numerical", score: 1 },
      { id: "D", text: "$62,500", correct: false, dimension: "numerical", score: 0 }
    ]
  },
  
  // Abstract Logic Tests
  {
    id: "apt_abstract_001",
    type: "abstract_logic",
    title: "Pattern Recognition",
    instruction: "What comes next in this sequence?",
    sequence: "△, ○, △△, ○○, △△△, ?",
    question: "What comes next?",
    options: [
      { id: "A", text: "○○○", correct: true, dimension: "abstract", score: 1 },
      { id: "B", text: "△○", correct: false, dimension: "abstract", score: 0 },
      { id: "C", text: "○△", correct: false, dimension: "abstract", score: 0 },
      { id: "D", text: "△△△△", correct: false, dimension: "abstract", score: 0 }
    ]
  },
  {
    id: "apt_abstract_002",
    type: "abstract_logic",
    title: "Logical Reasoning",
    instruction: "If all Bloops are Razzles and all Razzles are Lazzles, then:",
    question: "Which statement is definitely true?",
    options: [
      { id: "A", text: "All Lazzles are Bloops", correct: false, dimension: "abstract", score: 0 },
      { id: "B", text: "All Bloops are Lazzles", correct: true, dimension: "abstract", score: 1 },
      { id: "C", text: "Some Lazzles are not Razzles", correct: false, dimension: "abstract", score: 0 },
      { id: "D", text: "No Bloops are Lazzles", correct: false, dimension: "abstract", score: 0 }
    ]
  },
  
  // Memory/Attention Tests
  {
    id: "apt_memory_001",
    type: "memory_attention",
    title: "Pattern Memory",
    instruction: "Study this sequence for 5 seconds, then reproduce it",
    sequence: [1, 4, 2, 7, 3, 9, 5],
    question: "What was the 4th number in the sequence?",
    options: [
      { id: "A", text: "2", correct: false, dimension: "memory", score: 0 },
      { id: "B", text: "7", correct: true, dimension: "memory", score: 1 },
      { id: "C", text: "3", correct: false, dimension: "memory", score: 0 },
      { id: "D", text: "4", correct: false, dimension: "memory", score: 0 }
    ]
  },
  {
    id: "apt_memory_002",
    type: "memory_attention",
    title: "Detail Recognition",
    instruction: "Count how many times the letter 'A' appears in this text",
    text: "Analytical thinking requires careful attention to patterns and data analysis.",
    question: "How many times does 'A' appear? (case insensitive)",
    options: [
      { id: "A", text: "6", correct: false, dimension: "memory", score: 0 },
      { id: "B", text: "7", correct: false, dimension: "memory", score: 0 },
      { id: "C", text: "8", correct: true, dimension: "memory", score: 1 },
      { id: "D", text: "9", correct: false, dimension: "memory", score: 0 }
    ]
  }
];

export const skillsChallenges = [
  {
    id: "sc_001",
    type: "problem_solving",
    title: "The Budget Puzzle",
    description: "You have $10,000 to allocate across 5 departments. Each has different ROI rates.",
    challenge_type: "allocation",
    difficulty: "medium",
    time_limit: 120,
    departments: [
      { name: "Marketing", roi: 1.5, suggested: 3000 },
      { name: "Technology", roi: 2.0, suggested: 4000 },
      { name: "HR", roi: 1.2, suggested: 1000 },
      { name: "Operations", roi: 1.3, suggested: 1500 },
      { name: "R&D", roi: 1.8, suggested: 500 }
    ],
    scoring: {
      optimal_solution: { marketing: 3000, tech: 4000, hr: 1000, operations: 1500, rd: 500 },
      scoring_method: "percentage_match"
    }
  },
  {
    id: "sc_002",
    type: "creative_thinking",
    title: "Innovation Sprint",
    description: "Generate as many uses as possible for a paperclip in 60 seconds",
    challenge_type: "divergent_thinking",
    difficulty: "easy",
    time_limit: 60,
    scoring: {
      metrics: ["fluency", "originality", "elaboration"],
      baseline_scores: { fluency: 8, originality: 3, elaboration: 2 }
    }
  },
  {
    id: "sc_003",
    type: "communication",
    title: "Email Rewrite Challenge",
    description: "Rewrite this angry customer email to be professional yet assertive",
    challenge_type: "writing",
    original_text: "This is absolutely unacceptable! I've been waiting for 3 weeks and no one has bothered to respond!",
    time_limit: 180,
    scoring: {
      keywords: ["apologize", "understand", "resolve", "timeline", "follow-up"],
      tone_analysis: true
    }
  }
];

export const workScenarios = [
  {
    id: "ws_001",
    title: "The Deadline Dilemma",
    setup: "Your team lead assigns you a project due in 2 days, but you already have 3 other deadlines this week.",
    options: [
      {
        id: "A",
        text: "Accept it without question to show you're a team player",
        scores: { adaptability: 2, communication: 0, self_management: -1 }
      },
      {
        id: "B",
        text: "Discuss your current workload and negotiate priorities",
        scores: { adaptability: 3, communication: 4, self_management: 4 }
      },
      {
        id: "C",
        text: "Delegate your other work to focus on this new project",
        scores: { adaptability: 2, communication: 1, self_management: 2 }
      },
      {
        id: "D",
        text: "Work overtime to complete everything",
        scores: { adaptability: 1, communication: 0, self_management: 1 }
      }
    ]
  },
  {
    id: "ws_002",
    title: "The Team Conflict",
    setup: "Two team members are in a heated disagreement during a meeting, making everyone uncomfortable.",
    options: [
      {
        id: "A",
        text: "Stay quiet and let them work it out",
        scores: { leadership: 0, communication: 0, emotional_intelligence: 1 }
      },
      {
        id: "B",
        text: "Suggest taking a 5-minute break to cool down",
        scores: { leadership: 3, communication: 3, emotional_intelligence: 4 }
      },
      {
        id: "C",
        text: "Take a side to help resolve it faster",
        scores: { leadership: 1, communication: 1, emotional_intelligence: 0 }
      },
      {
        id: "D",
        text: "Redirect focus to the meeting agenda",
        scores: { leadership: 3, communication: 3, emotional_intelligence: 3 }
      }
    ]
  },
  {
    id: "ws_003",
    title: "The Presentation Panic",
    setup: "You're about to give a presentation when you realize half your slides are missing.",
    options: [
      {
        id: "A",
        text: "Panic and ask to reschedule",
        scores: { adaptability: 0, communication: 1, self_management: 0 }
      },
      {
        id: "B",
        text: "Improvise and present what you have confidently",
        scores: { adaptability: 4, communication: 3, self_management: 3 }
      },
      {
        id: "C",
        text: "Quickly recreate the missing slides",
        scores: { adaptability: 2, communication: 2, self_management: 4 }
      },
      {
        id: "D",
        text: "Turn it into an interactive discussion",
        scores: { adaptability: 4, communication: 4, self_management: 3 }
      }
    ]
  }
];

export const rapidFireQuestions = [
  {
    id: "rf_001",
    question: "Work alone or in teams?",
    optionA: "Alone - I focus better",
    optionB: "Teams - I love collaboration",
    dimension: "collaboration_preference"
  },
  {
    id: "rf_002",
    question: "Detailed plan or figure it out as you go?",
    optionA: "Detailed plan always",
    optionB: "Adapt as I go",
    dimension: "planning_style"
  },
  {
    id: "rf_003",
    question: "Lead the project or support the leader?",
    optionA: "Lead the way",
    optionB: "Support role",
    dimension: "leadership_preference"
  },
  {
    id: "rf_004",
    question: "Creative freedom or clear structure?",
    optionA: "Creative freedom",
    optionB: "Clear structure",
    dimension: "work_environment"
  },
  {
    id: "rf_005",
    question: "Fast-paced or steady rhythm?",
    optionA: "Fast-paced",
    optionB: "Steady rhythm",
    dimension: "work_pace"
  },
  {
    id: "rf_006",
    question: "Big picture or attention to detail?",
    optionA: "Big picture",
    optionB: "Attention to detail",
    dimension: "thinking_style"
  },
  {
    id: "rf_007",
    question: "Risk-taking or play it safe?",
    optionA: "Take calculated risks",
    optionB: "Play it safe",
    dimension: "risk_tolerance"
  },
  {
    id: "rf_008",
    question: "Feedback frequently or when needed?",
    optionA: "Frequent feedback",
    optionB: "When I need it",
    dimension: "feedback_preference"
  },
  {
    id: "rf_009",
    question: "Variety or routine?",
    optionA: "Variety and change",
    optionB: "Routine and consistency",
    dimension: "work_variety"
  },
  {
    id: "rf_010",
    question: "Competitive or collaborative?",
    optionA: "Competitive",
    optionB: "Collaborative",
    dimension: "work_style"
  }
];

export const careerMilestones = [
  {
    id: "m_001",
    title: "Internship",
    description: "Gain real-world experience",
    type: "experience",
    timeframe: "Year 1"
  },
  {
    id: "m_002",
    title: "Professional Certification",
    description: "Earn industry credentials",
    type: "credential",
    timeframe: "Year 1-2"
  },
  {
    id: "m_003",
    title: "First Job",
    description: "Start your career journey",
    type: "position",
    timeframe: "Year 1"
  },
  {
    id: "m_004",
    title: "Skill Development",
    description: "Master key competencies",
    type: "skill",
    timeframe: "Year 1-3"
  },
  {
    id: "m_005",
    title: "Leadership Role",
    description: "Take on team responsibility",
    type: "position",
    timeframe: "Year 3-5"
  },
  {
    id: "m_006",
    title: "Advanced Degree",
    description: "Further your education",
    type: "education",
    timeframe: "Year 2-4"
  },
  {
    id: "m_007",
    title: "Industry Conference",
    description: "Network and learn",
    type: "networking",
    timeframe: "Year 1-2"
  },
  {
    id: "m_008",
    title: "Mentor Relationship",
    description: "Find a career guide",
    type: "networking",
    timeframe: "Year 1"
  },
  {
    id: "m_009",
    title: "Project Management",
    description: "Lead a major initiative",
    type: "experience",
    timeframe: "Year 2-3"
  },
  {
    id: "m_010",
    title: "Career Pivot",
    description: "Explore new opportunities",
    type: "transition",
    timeframe: "Year 3-5"
  },
  {
    id: "m_011",
    title: "Start Own Business",
    description: "Become an entrepreneur",
    type: "position",
    timeframe: "Year 5-10"
  },
  {
    id: "m_012",
    title: "Executive Position",
    description: "Reach senior leadership",
    type: "position",
    timeframe: "Year 5-10"
  }
];

export const careerDatabase = {
  stem: [
    { title: "Data Analyst", match: 85, growth: "High", salary: "$65-85k" },
    { title: "Software Developer", match: 78, growth: "Very High", salary: "$75-95k" },
    { title: "UX Researcher", match: 72, growth: "High", salary: "$70-90k" },
    { title: "AI/ML Engineer", match: 88, growth: "Very High", salary: "$95-130k" },
    { title: "Environmental Engineer", match: 75, growth: "Medium", salary: "$70-90k" }
  ],
  creative_tech: [
    { title: "Digital Product Designer", match: 88, growth: "High", salary: "$65-85k" },
    { title: "Content Strategist", match: 75, growth: "Medium", salary: "$55-75k" },
    { title: "Creative Technologist", match: 82, growth: "High", salary: "$70-95k" },
    { title: "Game Developer", match: 80, growth: "High", salary: "$70-95k" }
  ],
  business: [
    { title: "Business Analyst", match: 80, growth: "High", salary: "$60-80k" },
    { title: "Marketing Coordinator", match: 76, growth: "Medium", salary: "$45-65k" },
    { title: "Product Manager", match: 71, growth: "Very High", salary: "$85-110k" },
    { title: "Digital Marketing Specialist", match: 78, growth: "High", salary: "$50-70k" }
  ],
  social_impact: [
    { title: "Sustainability Consultant", match: 82, growth: "High", salary: "$60-80k" },
    { title: "Non-profit Manager", match: 75, growth: "Medium", salary: "$45-65k" },
    { title: "Social Media Manager", match: 73, growth: "Medium", salary: "$45-65k" }
  ],
  healthcare_tech: [
    { title: "Health Informatics Specialist", match: 80, growth: "Very High", salary: "$70-90k" },
    { title: "Telemedicine Coordinator", match: 75, growth: "High", salary: "$55-75k" },
    { title: "Healthcare Data Analyst", match: 78, growth: "High", salary: "$65-85k" }
  ]
};

export const translations = {
  en: {
    welcome: {
      title: "CareerLaunch Assessment",
      tagline: "Discover Your Career Superpowers!",
      startButton: "Start Your Journey"
    },
    registration: {
      title: "Create Your Career Profile",
      avatarPrompt: "Choose Your Avatar:",
      beginAssessment: "Begin Assessment"
    },
    levels: {
      1: { title: "Career Interest Swiper", instruction: "Swipe right if interested, left if not!" },
      2: { title: "Skills Challenge Arena", instruction: "Complete challenges to showcase your skills!" },
      3: { title: "Real World Scenarios", instruction: "How would you handle these workplace situations?" },
      4: { title: "Future Quest: Build Your Career Path", instruction: "Map out your career journey!" },
      5: { title: "Rapid Fire Round!", instruction: "Quick decisions, big insights!" }
    },
    results: {
      title: "Assessment Complete!",
      scoreLabel: "Your Career Readiness Score",
      achievements: "Achievements Unlocked",
      careerMatches: "Your Top Career Matches",
      viewReport: "View Detailed Report",
      shareResults: "Share Results",
      downloadPDF: "Download PDF"
    }
  }
};