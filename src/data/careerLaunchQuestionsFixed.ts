export interface CareerLaunchQuestion {
  id: string;
  category: 'RIASEC' | 'Aptitude' | 'Personality' | 'Values';
  dimension: string;
  question: string;
  optionA: string;
  optionB: string;
  scoringWeight: number;
  isReversed?: boolean;
}

// Complete 120-question Career Launch Assessment with balanced content
export const careerLaunchQuestions: CareerLaunchQuestion[] = [
  // RIASEC INTEREST QUESTIONS (30 questions - 5 per dimension)
  // REALISTIC (5 questions)
  {
    id: "cl_r001",
    category: "RIASEC",
    dimension: "Realistic",
    question: "Which type of work appeals to you more?",
    optionA: "Working with tools, machinery, or equipment",
    optionB: "Working with ideas, concepts, or theories",
    scoringWeight: 1.0
  },
  {
    id: "cl_r002", 
    category: "RIASEC",
    dimension: "Realistic",
    question: "In your ideal job, you would prefer to:",
    optionA: "Build, repair, or construct physical objects",
    optionB: "Analyze, plan, or develop strategies",
    scoringWeight: 1.0
  },
  {
    id: "cl_r003",
    category: "RIASEC", 
    dimension: "Realistic",
    question: "Which activities sound more appealing?",
    optionA: "Operating machinery or working with your hands",
    optionB: "Reading, writing, or researching information",
    scoringWeight: 1.0
  },
  {
    id: "cl_r004",
    category: "RIASEC",
    dimension: "Realistic", 
    question: "You would rather work in:",
    optionA: "A workshop, lab, or outdoor environment",
    optionB: "An office or meeting room setting",
    scoringWeight: 1.0
  },
  {
    id: "cl_r005",
    category: "RIASEC",
    dimension: "Realistic",
    question: "Which describes your preferred work style?",
    optionA: "Practical, hands-on problem solving",
    optionB: "Theoretical, conceptual problem solving",
    scoringWeight: 1.0
  },

  // INVESTIGATIVE (5 questions)
  {
    id: "cl_i001",
    category: "RIASEC",
    dimension: "Investigative", 
    question: "Which type of challenge excites you more?",
    optionA: "Conducting research and analyzing data",
    optionB: "Organizing events and managing people",
    scoringWeight: 1.0
  },
  {
    id: "cl_i002",
    category: "RIASEC",
    dimension: "Investigative",
    question: "You prefer work that involves:",
    optionA: "Systematic investigation and discovery",
    optionB: "Creative expression and innovation",
    scoringWeight: 1.0
  },
  {
    id: "cl_i003",
    category: "RIASEC",
    dimension: "Investigative",
    question: "Which work environment appeals to you?",
    optionA: "Laboratory or research facility",
    optionB: "Studio or collaborative workspace",
    scoringWeight: 1.0
  },
  {
    id: "cl_i004",
    category: "RIASEC",
    dimension: "Investigative",
    question: "Your ideal role would involve:",
    optionA: "Testing hypotheses and gathering evidence",
    optionB: "Developing relationships and helping others",
    scoringWeight: 1.0
  },
  {
    id: "cl_i005",
    category: "RIASEC", 
    dimension: "Investigative",
    question: "You're most motivated by:",
    optionA: "Understanding how things work and why",
    optionB: "Making a positive impact on others",
    scoringWeight: 1.0
  },

  // ARTISTIC (5 questions)
  {
    id: "cl_a001",
    category: "RIASEC",
    dimension: "Artistic",
    question: "Which type of work energizes you?",
    optionA: "Creating original designs or artistic works", 
    optionB: "Analyzing systems and solving technical problems",
    scoringWeight: 1.0
  },
  {
    id: "cl_a002",
    category: "RIASEC",
    dimension: "Artistic",
    question: "You prefer projects that allow you to:",
    optionA: "Express creativity and personal vision",
    optionB: "Follow established procedures and standards",
    scoringWeight: 1.0
  },
  {
    id: "cl_a003", 
    category: "RIASEC",
    dimension: "Artistic",
    question: "Your ideal work environment would be:",
    optionA: "Flexible and inspiring with creative freedom",
    optionB: "Structured and organized with clear guidelines",
    scoringWeight: 1.0
  },
  {
    id: "cl_a004",
    category: "RIASEC",
    dimension: "Artistic",
    question: "Which describes your preferred approach?",
    optionA: "Intuitive and imaginative",
    optionB: "Logical and systematic",
    scoringWeight: 1.0
  },
  {
    id: "cl_a005",
    category: "RIASEC",
    dimension: "Artistic", 
    question: "You're most satisfied when your work:",
    optionA: "Allows for unique self-expression",
    optionB: "Produces measurable, concrete results",
    scoringWeight: 1.0
  },

  // SOCIAL (5 questions)
  {
    id: "cl_s001",
    category: "RIASEC",
    dimension: "Social",
    question: "Which type of work gives you the most satisfaction?",
    optionA: "Teaching, counseling, or helping others develop",
    optionB: "Leading projects and driving business results",
    scoringWeight: 1.0
  },
  {
    id: "cl_s002",
    category: "RIASEC", 
    dimension: "Social",
    question: "You prefer roles where you can:",
    optionA: "Support others and build relationships",
    optionB: "Work independently on complex tasks",
    scoringWeight: 1.0
  },
  {
    id: "cl_s003",
    category: "RIASEC",
    dimension: "Social",
    question: "Your ideal workday would involve:",
    optionA: "Collaborating and communicating with people",
    optionB: "Focusing on individual projects and analysis",
    scoringWeight: 1.0
  },
  {
    id: "cl_s004",
    category: "RIASEC",
    dimension: "Social",
    question: "You're most motivated by:",
    optionA: "Helping others achieve their potential",
    optionB: "Achieving personal goals and recognition",
    scoringWeight: 1.0
  },
  {
    id: "cl_s005",
    category: "RIASEC",
    dimension: "Social",
    question: "Which work setting appeals to you more?",
    optionA: "Community-focused, people-centered environment",
    optionB: "Competitive, performance-driven environment",
    scoringWeight: 1.0
  },

  // ENTERPRISING (5 questions)
  {
    id: "cl_e001",
    category: "RIASEC",
    dimension: "Enterprising",
    question: "Which type of role excites you most?",
    optionA: "Leading teams and driving business growth",
    optionB: "Providing support and helping others succeed",
    scoringWeight: 1.0
  },
  {
    id: "cl_e002",
    category: "RIASEC",
    dimension: "Enterprising",
    question: "You prefer work that involves:",
    optionA: "Selling, persuading, and influencing others",
    optionB: "Researching, analyzing, and understanding complex issues",
    scoringWeight: 1.0
  },
  {
    id: "cl_e003",
    category: "RIASEC",
    dimension: "Enterprising",
    question: "Your ideal work environment would be:",
    optionA: "Dynamic, competitive, and results-oriented",
    optionB: "Calm, supportive, and collaborative",
    scoringWeight: 1.0
  },
  {
    id: "cl_e004",
    category: "RIASEC", 
    dimension: "Enterprising",
    question: "You're most energized by:",
    optionA: "Taking charge and making important decisions",
    optionB: "Supporting others and working as part of a team",
    scoringWeight: 1.0
  },
  {
    id: "cl_e005",
    category: "RIASEC",
    dimension: "Enterprising",
    question: "Which describes your preferred work style?",
    optionA: "Assertive, ambitious, and goal-driven", 
    optionB: "Thoughtful, methodical, and detail-oriented",
    scoringWeight: 1.0
  },

  // CONVENTIONAL (5 questions)
  {
    id: "cl_c001",
    category: "RIASEC",
    dimension: "Conventional",
    question: "Which type of work appeals to you more?",
    optionA: "Organizing data, maintaining records, and following procedures",
    optionB: "Creating new concepts and exploring innovative ideas",
    scoringWeight: 1.0
  },
  {
    id: "cl_c002",
    category: "RIASEC",
    dimension: "Conventional",
    question: "You prefer tasks that are:",
    optionA: "Structured, detailed, and systematic",
    optionB: "Open-ended, flexible, and creative",
    scoringWeight: 1.0
  },
  {
    id: "cl_c003",
    category: "RIASEC",
    dimension: "Conventional",
    question: "Your ideal work environment would have:",
    optionA: "Clear policies, established procedures, and organized systems",
    optionB: "Flexible schedules, creative freedom, and minimal restrictions",
    scoringWeight: 1.0
  },
  {
    id: "cl_c004",
    category: "RIASEC",
    dimension: "Conventional",
    question: "You feel most comfortable when:",
    optionA: "Following proven methods and established guidelines",
    optionB: "Experimenting with new approaches and taking risks",
    scoringWeight: 1.0
  },
  {
    id: "cl_c005",
    category: "RIASEC",
    dimension: "Conventional",
    question: "Which work style suits you better?",
    optionA: "Precise, accurate, and methodical",
    optionB: "Spontaneous, adaptable, and innovative",
    scoringWeight: 1.0
  },

  // APTITUDE QUESTIONS (30 questions - 7-8 per dimension)
  // NUMERICAL REASONING (8 questions)
  {
    id: "cl_num001",
    category: "Aptitude",
    dimension: "Numerical Reasoning",
    question: "A product costs $120 and is marked up by 25%. What is the selling price?",
    optionA: "$150",
    optionB: "$145",
    scoringWeight: 1.0
  },
  {
    id: "cl_num002",
    category: "Aptitude",
    dimension: "Numerical Reasoning", 
    question: "If sales increased from 500 to 650 units, what is the percentage increase?",
    optionA: "30%",
    optionB: "25%",
    scoringWeight: 1.0
  },
  {
    id: "cl_num003",
    category: "Aptitude",
    dimension: "Numerical Reasoning",
    question: "A team of 6 people can complete a project in 8 days. How long would it take 4 people?",
    optionA: "12 days",
    optionB: "10 days",
    scoringWeight: 1.0
  },
  {
    id: "cl_num004",
    category: "Aptitude",
    dimension: "Numerical Reasoning",
    question: "What is 15% of 240?",
    optionA: "36",
    optionB: "32",
    scoringWeight: 1.0
  },
  {
    id: "cl_num005",
    category: "Aptitude",
    dimension: "Numerical Reasoning",
    question: "If a company's revenue is $2.4M and expenses are $1.8M, what is the profit margin?",
    optionA: "25%",
    optionB: "20%",
    scoringWeight: 1.0
  },
  {
    id: "cl_num006",
    category: "Aptitude", 
    dimension: "Numerical Reasoning",
    question: "A survey of 200 people shows 60% prefer product A. How many people is this?",
    optionA: "120 people",
    optionB: "140 people",
    scoringWeight: 1.0
  },
  {
    id: "cl_num007",
    category: "Aptitude",
    dimension: "Numerical Reasoning",
    question: "If you invest $1000 at 5% annual interest, what's the value after 2 years (simple interest)?",
    optionA: "$1100",
    optionB: "$1050",
    scoringWeight: 1.0
  },
  {
    id: "cl_num008",
    category: "Aptitude",
    dimension: "Numerical Reasoning",
    question: "A budget allocates 40% to salaries, 25% to operations, and 15% to marketing. What percentage remains?",
    optionA: "20%",
    optionB: "25%",
    scoringWeight: 1.0
  },

  // VERBAL REASONING (8 questions)
  {
    id: "cl_ver001",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "Complete the analogy: Ocean is to Water as Library is to ___",
    optionA: "Books",
    optionB: "Reading",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver002",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "Which word means the opposite of 'expand'?",
    optionA: "Contract",
    optionB: "Extend",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver003",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "If all successful people work hard, and John works hard, can we conclude John is successful?",
    optionA: "No - hard work doesn't guarantee success",
    optionB: "Yes - hard work always leads to success",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver004",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "Which word best describes someone who pays attention to small details?",
    optionA: "Meticulous",
    optionB: "Generous",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver005",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "Complete: 'The research findings were _____ because they contradicted previous studies.'",
    optionA: "Surprising",
    optionB: "Predictable",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver006",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "Which sentence is grammatically correct?",
    optionA: "The team achieved their goals successfully.",
    optionB: "The team achieved there goals successfully.",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver007",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "What does 'collaborate' mean?",
    optionA: "Work together toward a common goal",
    optionB: "Compete against others for success",
    scoringWeight: 1.0
  },
  {
    id: "cl_ver008",
    category: "Aptitude",
    dimension: "Verbal Reasoning",
    question: "Which statement shows cause and effect?",
    optionA: "Because it rained, the event was moved indoors.",
    optionB: "It rained and the event was moved indoors.",
    scoringWeight: 1.0
  },

  // SPATIAL THINKING (7 questions)
  {
    id: "cl_spa001",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "If you rotate a square 90 degrees clockwise, which side that was on top is now on the right?",
    optionA: "The left side",
    optionB: "The bottom side",
    scoringWeight: 1.0
  },
  {
    id: "cl_spa002",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "You're looking at a map where north is up. If you turn left, which direction are you facing?",
    optionA: "West",
    optionB: "East",
    scoringWeight: 1.0
  },
  {
    id: "cl_spa003",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "Which 3D shape would you get if you folded a square piece of paper in half twice?",
    optionA: "A smaller, thicker rectangle",
    optionB: "A triangle",
    scoringWeight: 1.0
  },
  {
    id: "cl_spa004",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "If you're facing north and turn 180 degrees, then turn 90 degrees left, which direction are you facing?",
    optionA: "West",
    optionB: "East",
    scoringWeight: 1.0
  },
  {
    id: "cl_spa005",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "A cube has how many faces?",
    optionA: "6",
    optionB: "8",
    scoringWeight: 1.0
  },
  {
    id: "cl_spa006",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "If you mirror the letter 'b' horizontally, what letter do you get?",
    optionA: "d",
    optionB: "p",
    scoringWeight: 1.0
  },
  {
    id: "cl_spa007",
    category: "Aptitude",
    dimension: "Spatial Thinking",
    question: "You have a rectangular box. Which view would show its length and width but not height?",
    optionA: "Top view",
    optionB: "Side view",
    scoringWeight: 1.0
  },

  // PROBLEM SOLVING (7 questions)
  {
    id: "cl_prob001",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "You have a deadline conflict between two important projects. What's the best first step?",
    optionA: "Assess priorities and communicate with stakeholders",
    optionB: "Work longer hours to complete both",
    scoringWeight: 1.0
  },
  {
    id: "cl_prob002",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "A process is taking longer than expected. What should you do first?",
    optionA: "Analyze where the delays are occurring",
    optionB: "Add more people to speed it up",
    scoringWeight: 1.0
  },
  {
    id: "cl_prob003",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "Your team disagrees on the best approach. How do you proceed?",
    optionA: "Facilitate discussion to understand different perspectives",
    optionB: "Make a quick decision to avoid further delays",
    scoringWeight: 1.0
  },
  {
    id: "cl_prob004",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "You discover an error in work that's already been submitted. What do you do?",
    optionA: "Immediately inform relevant parties and propose a solution",
    optionB: "Fix it quietly without mentioning the error",
    scoringWeight: 1.0
  },
  {
    id: "cl_prob005",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "A new technology could improve your process but requires learning time. You should:",
    optionA: "Evaluate the long-term benefits vs. short-term costs",
    optionB: "Stick with current methods to avoid disruption",
    scoringWeight: 1.0
  },
  {
    id: "cl_prob006",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "You receive contradictory instructions from two supervisors. Best approach?",
    optionA: "Clarify priorities with both supervisors together",
    optionB: "Follow the instruction from your direct supervisor",
    scoringWeight: 1.0
  },
  {
    id: "cl_prob007",
    category: "Aptitude",
    dimension: "Problem Solving",
    question: "A team member consistently misses deadlines. How do you address this?",
    optionA: "Have a private conversation to understand and address root causes",
    optionB: "Reassign their tasks to more reliable team members",
    scoringWeight: 1.0
  },

  // PERSONALITY QUESTIONS (30 questions - 7-8 per dimension)
  // EXTRAVERSION (8 questions)
  {
    id: "cl_ext001",
    category: "Personality",
    dimension: "Extraversion",
    question: "At work, you prefer to:",
    optionA: "Collaborate and discuss ideas with colleagues frequently",
    optionB: "Work independently and share ideas when they're fully developed",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext002",
    category: "Personality",
    dimension: "Extraversion",
    question: "In meetings, you typically:",
    optionA: "Actively participate and share your thoughts",
    optionB: "Listen carefully and contribute when asked",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext003",
    category: "Personality",
    dimension: "Extraversion",
    question: "When facing a challenge, you prefer to:",
    optionA: "Brainstorm with others to generate solutions",
    optionB: "Think through the problem alone first",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext004",
    category: "Personality",
    dimension: "Extraversion",
    question: "Your ideal work environment would be:",
    optionA: "Open and collaborative with lots of interaction",
    optionB: "Quiet and private where you can focus",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext005",
    category: "Personality",
    dimension: "Extraversion",
    question: "You gain energy from:",
    optionA: "Interacting with people and being in social situations",
    optionB: "Having quiet time to reflect and recharge",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext006",
    category: "Personality",
    dimension: "Extraversion",
    question: "When presenting to a group, you:",
    optionA: "Feel energized and enjoy the interaction",
    optionB: "Prepare thoroughly and prefer smaller groups",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext007",
    category: "Personality",
    dimension: "Extraversion",
    question: "Your communication style is typically:",
    optionA: "Expressive and spontaneous",
    optionB: "Thoughtful and measured",
    scoringWeight: 1.0
  },
  {
    id: "cl_ext008",
    category: "Personality",
    dimension: "Extraversion",
    question: "At workplace social events, you:",
    optionA: "Enjoy meeting new people and networking",
    optionB: "Prefer deeper conversations with people you know well",
    scoringWeight: 1.0
  },

  // CONSCIENTIOUSNESS (8 questions)
  {
    id: "cl_con001",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "Your approach to deadlines is:",
    optionA: "I always plan ahead and finish early",
    optionB: "I work well under pressure and meet deadlines",
    scoringWeight: 1.0
  },
  {
    id: "cl_con002",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "When starting a project, you prefer to:",
    optionA: "Create detailed plans and timelines",
    optionB: "Start working and adapt as you go",
    scoringWeight: 1.0
  },
  {
    id: "cl_con003",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "Your workspace is typically:",
    optionA: "Very organized and everything has its place",
    optionB: "Somewhat messy but you know where things are",
    scoringWeight: 1.0
  },
  {
    id: "cl_con004",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "When you commit to something, you:",
    optionA: "Always follow through completely",
    optionB: "Do your best but circumstances sometimes change",
    scoringWeight: 1.0
  },
  {
    id: "cl_con005",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "Your attention to detail is:",
    optionA: "Very high - I notice and care about small details",
    optionB: "Focused on what matters most for the big picture",
    scoringWeight: 1.0
  },
  {
    id: "cl_con006",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "You handle multiple tasks by:",
    optionA: "Creating systems and following organized processes",
    optionB: "Juggling priorities and adapting as needed",
    scoringWeight: 1.0
  },
  {
    id: "cl_con007",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "When you make a mistake, you:",
    optionA: "Analyze what went wrong and create prevention systems",
    optionB: "Learn from it and move forward quickly",
    scoringWeight: 1.0
  },
  {
    id: "cl_con008",
    category: "Personality",
    dimension: "Conscientiousness",
    question: "Your approach to rules and procedures is:",
    optionA: "They exist for good reasons and should be followed",
    optionB: "They're guidelines that can be adapted when needed",
    scoringWeight: 1.0
  },

  // EMOTIONAL STABILITY (7 questions)
  {
    id: "cl_emo001",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "When facing criticism, you typically:",
    optionA: "Stay calm and look for constructive feedback",
    optionB: "Feel defensive but work through it",
    scoringWeight: 1.0
  },
  {
    id: "cl_emo002",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "Under pressure, you:",
    optionA: "Remain calm and think clearly",
    optionB: "Feel stressed but push through it",
    scoringWeight: 1.0
  },
  {
    id: "cl_emo003",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "When things don't go as planned, you:",
    optionA: "Adapt quickly and stay positive",
    optionB: "Feel frustrated but eventually adjust",
    scoringWeight: 1.0
  },
  {
    id: "cl_emo004",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "Your typical stress level at work is:",
    optionA: "Low - I manage stress well and stay balanced",
    optionB: "Moderate - I feel stress but it doesn't overwhelm me",
    scoringWeight: 1.0
  },
  {
    id: "cl_emo005",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "When dealing with difficult people, you:",
    optionA: "Stay patient and try to understand their perspective",
    optionB: "Find it challenging but manage to work with them",
    scoringWeight: 1.0
  },
  {
    id: "cl_emo006",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "Your confidence level in challenging situations is:",
    optionA: "High - I believe in my ability to handle difficulties",
    optionB: "Variable - depends on the situation and my experience",
    scoringWeight: 1.0
  },
  {
    id: "cl_emo007",
    category: "Personality",
    dimension: "Emotional Stability",
    question: "When you receive unexpected bad news, you:",
    optionA: "Process it calmly and focus on solutions",
    optionB: "Have an emotional reaction but recover relatively quickly",
    scoringWeight: 1.0
  },

  // OPENNESS TO EXPERIENCE (7 questions)
  {
    id: "cl_open001",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "You prefer work that:",
    optionA: "Involves new challenges and learning opportunities",
    optionB: "Uses your existing skills and proven methods",
    scoringWeight: 1.0
  },
  {
    id: "cl_open002",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "When approaching problems, you:",
    optionA: "Look for creative and innovative solutions",
    optionB: "Apply reliable methods that have worked before",
    scoringWeight: 1.0
  },
  {
    id: "cl_open003",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "You're most interested in:",
    optionA: "Exploring new ideas and possibilities",
    optionB: "Deepening expertise in areas you know well",
    scoringWeight: 1.0
  },
  {
    id: "cl_open004",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "Your approach to change is:",
    optionA: "I embrace change as an opportunity to grow",
    optionB: "I adapt to change when necessary",
    scoringWeight: 1.0
  },
  {
    id: "cl_open005",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "You prefer learning through:",
    optionA: "Experimentation and discovery",
    optionB: "Structured training and proven methods",
    scoringWeight: 1.0
  },
  {
    id: "cl_open006",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "When facing ambiguous situations, you:",
    optionA: "Feel comfortable and see potential opportunities",
    optionB: "Prefer more clarity and defined expectations",
    scoringWeight: 1.0
  },
  {
    id: "cl_open007",
    category: "Personality",
    dimension: "Openness to Experience",
    question: "Your thinking style is typically:",
    optionA: "Abstract and conceptual",
    optionB: "Practical and concrete",
    scoringWeight: 1.0
  },

  // VALUES QUESTIONS (30 questions - 7-8 per dimension)
  // AUTONOMY (8 questions)
  {
    id: "cl_aut001",
    category: "Values",
    dimension: "Autonomy",
    question: "You prefer work environments where:",
    optionA: "You have freedom to make decisions about how to do your work",
    optionB: "There are clear guidelines and expectations for how work should be done",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut002",
    category: "Values",
    dimension: "Autonomy",
    question: "When it comes to supervision, you prefer:",
    optionA: "Minimal oversight and independence in your role",
    optionB: "Regular check-ins and guidance from your supervisor",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut003",
    category: "Values",
    dimension: "Autonomy",
    question: "Your ideal work schedule would be:",
    optionA: "Flexible hours that you can control",
    optionB: "Set hours that provide structure and routine",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut004",
    category: "Values",
    dimension: "Autonomy",
    question: "You value most:",
    optionA: "Being able to work in your own way",
    optionB: "Being part of a well-coordinated team effort",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut005",
    category: "Values",
    dimension: "Autonomy",
    question: "When assigned a project, you prefer to:",
    optionA: "Define your own approach and methods",
    optionB: "Receive detailed instructions and expectations",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut006",
    category: "Values",
    dimension: "Autonomy",
    question: "Decision-making authority is:",
    optionA: "Very important to you in your work",
    optionB: "Less important than collaboration and input",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut007",
    category: "Values",
    dimension: "Autonomy",
    question: "You feel most satisfied when:",
    optionA: "You can control the pace and direction of your work",
    optionB: "You're working as part of a coordinated team effort",
    scoringWeight: 1.0
  },
  {
    id: "cl_aut008",
    category: "Values",
    dimension: "Autonomy",
    question: "In terms of workplace policies, you prefer:",
    optionA: "Minimal rules that allow for personal judgment",
    optionB: "Clear policies that ensure consistency and fairness",
    scoringWeight: 1.0
  },

  // SECURITY (8 questions)
  {
    id: "cl_sec001",
    category: "Values",
    dimension: "Security",
    question: "In choosing a job, how important is job stability?",
    optionA: "Very important - I value long-term security",
    optionB: "Less important than growth opportunities and excitement",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec002",
    category: "Values",
    dimension: "Security",
    question: "You prefer companies that offer:",
    optionA: "Excellent benefits and retirement planning",
    optionB: "Exciting projects and rapid advancement opportunities",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec003",
    category: "Values",
    dimension: "Security",
    question: "When considering career moves, you prioritize:",
    optionA: "Financial stability and predictable income",
    optionB: "Challenge and potential for higher rewards",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec004",
    category: "Values",
    dimension: "Security",
    question: "Your ideal work environment provides:",
    optionA: "Clear expectations and low risk of layoffs",
    optionB: "Dynamic challenges and opportunities for rapid growth",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec005",
    category: "Values",
    dimension: "Security",
    question: "You value most:",
    optionA: "A steady paycheck and predictable routine",
    optionB: "Variable rewards based on performance and achievement",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec006",
    category: "Values",
    dimension: "Security",
    question: "When it comes to taking career risks, you:",
    optionA: "Prefer to avoid unnecessary risks to your stability",
    optionB: "Are willing to take calculated risks for potential gains",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec007",
    category: "Values",
    dimension: "Security",
    question: "Long-term planning is:",
    optionA: "Very important for your peace of mind",
    optionB: "Less important than seizing immediate opportunities",
    scoringWeight: 1.0
  },
  {
    id: "cl_sec008",
    category: "Values",
    dimension: "Security",
    question: "You prefer organizations that are:",
    optionA: "Well-established with a proven track record",
    optionB: "Innovative startups with high growth potential",
    scoringWeight: 1.0
  },

  // IMPACT (7 questions)
  {
    id: "cl_imp001",
    category: "Values",
    dimension: "Impact",
    question: "You want your work to:",
    optionA: "Make a meaningful difference in people's lives",
    optionB: "Provide personal satisfaction and financial rewards",
    scoringWeight: 1.0
  },
  {
    id: "cl_imp002",
    category: "Values",
    dimension: "Impact",
    question: "You're most motivated by jobs that:",
    optionA: "Contribute to solving important social or environmental problems",
    optionB: "Offer opportunities for personal advancement and recognition",
    scoringWeight: 1.0
  },
  {
    id: "cl_imp003",
    category: "Values",
    dimension: "Impact",
    question: "When choosing between job offers, you would prioritize:",
    optionA: "The opportunity to make a positive impact on society",
    optionB: "The salary and career advancement potential",
    scoringWeight: 1.0
  },
  {
    id: "cl_imp004",
    category: "Values",
    dimension: "Impact",
    question: "You feel most fulfilled when your work:",
    optionA: "Helps others and contributes to the greater good",
    optionB: "Achieves your personal goals and aspirations",
    scoringWeight: 1.0
  },
  {
    id: "cl_imp005",
    category: "Values",
    dimension: "Impact",
    question: "The legacy you want to leave is:",
    optionA: "Having made the world a better place through your work",
    optionB: "Having achieved success and recognition in your field",
    scoringWeight: 1.0
  },
  {
    id: "cl_imp006",
    category: "Values",
    dimension: "Impact",
    question: "You're drawn to organizations that:",
    optionA: "Have a strong mission focused on positive social impact",
    optionB: "Are leaders in their industry and offer prestige",
    scoringWeight: 1.0
  },
  {
    id: "cl_imp007",
    category: "Values",
    dimension: "Impact",
    question: "Purpose in your work comes from:",
    optionA: "Knowing you're helping solve meaningful problems",
    optionB: "Achieving professional success and recognition",
    scoringWeight: 1.0
  },

  // GROWTH (7 questions)
  {
    id: "cl_gro001",
    category: "Values",
    dimension: "Growth",
    question: "In your career, you prioritize:",
    optionA: "Continuous learning and skill development",
    optionB: "Stability and work-life balance",
    scoringWeight: 1.0
  },
  {
    id: "cl_gro002",
    category: "Values",
    dimension: "Growth",
    question: "You're most excited by jobs that offer:",
    optionA: "Opportunities to develop new competencies",
    optionB: "A comfortable routine using existing skills",
    scoringWeight: 1.0
  },
  {
    id: "cl_gro003",
    category: "Values",
    dimension: "Growth",
    question: "When it comes to challenges, you:",
    optionA: "Seek out stretch assignments that push your abilities",
    optionB: "Prefer assignments where you can succeed confidently",
    scoringWeight: 1.0
  },
  {
    id: "cl_gro004",
    category: "Values",
    dimension: "Growth",
    question: "Professional development is:",
    optionA: "Essential and you actively pursue learning opportunities",
    optionB: "Nice to have but not your top priority",
    scoringWeight: 1.0
  },
  {
    id: "cl_gro005",
    category: "Values",
    dimension: "Growth",
    question: "You value feedback because it:",
    optionA: "Helps you identify areas for improvement and growth",
    optionB: "Confirms you're meeting expectations",
    scoringWeight: 1.0
  },
  {
    id: "cl_gro006",
    category: "Values",
    dimension: "Growth",
    question: "Your ideal career path involves:",
    optionA: "Regular advancement and expanding responsibilities",
    optionB: "Finding a role you enjoy and staying in it long-term",
    scoringWeight: 1.0
  },
  {
    id: "cl_gro007",
    category: "Values",
    dimension: "Growth",
    question: "You're most satisfied when:",
    optionA: "You're learning something new and developing your capabilities",
    optionB: "You're performing well in familiar tasks and responsibilities",
    scoringWeight: 1.0
  }
];

export const careerLaunchDimensions = {
  // Interest dimensions
  Realistic: { name: "Realistic", category: "interest", weight: 1.0 },
  Investigative: { name: "Investigative", category: "interest", weight: 1.0 },
  Artistic: { name: "Artistic", category: "interest", weight: 1.0 },
  Social: { name: "Social", category: "interest", weight: 1.0 },
  Enterprising: { name: "Enterprising", category: "interest", weight: 1.0 },
  Conventional: { name: "Conventional", category: "interest", weight: 1.0 },
  
  // Aptitude dimensions
  "Numerical Reasoning": { name: "Numerical Reasoning", category: "aptitude", weight: 1.0 },
  "Verbal Reasoning": { name: "Verbal Reasoning", category: "aptitude", weight: 1.0 },
  "Spatial Thinking": { name: "Spatial Thinking", category: "aptitude", weight: 1.0 },
  "Problem Solving": { name: "Problem Solving", category: "aptitude", weight: 1.0 },
  
  // Personality dimensions
  "Extraversion": { name: "Extraversion", category: "personality", weight: 1.0 },
  "Conscientiousness": { name: "Conscientiousness", category: "personality", weight: 1.0 },
  "Emotional Stability": { name: "Emotional Stability", category: "personality", weight: 1.0 },
  "Openness to Experience": { name: "Openness to Experience", category: "personality", weight: 1.0 },
  
  // Values dimensions
  "Autonomy": { name: "Autonomy", category: "values", weight: 1.0 },
  "Security": { name: "Security", category: "values", weight: 1.0 },
  "Impact": { name: "Impact", category: "values", weight: 1.0 },
  "Growth": { name: "Growth", category: "values", weight: 1.0 }
};