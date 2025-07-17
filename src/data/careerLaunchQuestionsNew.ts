export interface CareerLaunchQuestion {
  id: string;
  category: 'interest' | 'aptitude' | 'personality' | 'value';
  dimension: string;
  question: string;
  type: 'choice' | 'aptitude_task' | 'likert';
  options?: {
    A: { text: string; score: Record<string, number> };
    B: { text: string; score: Record<string, number> };
  };
  correctAnswer?: string;
  likertScale?: {
    statement: string;
    dimensions: string[];
  };
}

export const careerLaunchQuestions: CareerLaunchQuestion[] = [
  // INTEREST QUESTIONS (RIASEC) - 36 questions (6 per dimension)
  
  // Realistic Interest Questions
  {
    id: "int_r_001",
    category: "interest",
    dimension: "realistic",
    type: "choice",
    question: "Which activity would you prefer?",
    options: {
      A: { text: "Building a wooden cabinet", score: { realistic: 1 } },
      B: { text: "Writing a research report", score: { investigative: 1 } }
    }
  },
  {
    id: "int_r_002",
    category: "interest",
    dimension: "realistic",
    type: "choice",
    question: "Choose your preferred weekend activity:",
    options: {
      A: { text: "Fixing a motorcycle engine", score: { realistic: 1 } },
      B: { text: "Organizing a community event", score: { social: 1 } }
    }
  },
  {
    id: "int_r_003",
    category: "interest",
    dimension: "realistic",
    type: "choice",
    question: "Which work environment appeals more to you?",
    options: {
      A: { text: "Outdoor construction site", score: { realistic: 1 } },
      B: { text: "Modern office space", score: { conventional: 1 } }
    }
  },
  {
    id: "int_r_004",
    category: "interest",
    dimension: "realistic",
    type: "choice",
    question: "What sounds more interesting?",
    options: {
      A: { text: "Operating heavy machinery", score: { realistic: 1 } },
      B: { text: "Creating digital artwork", score: { artistic: 1 } }
    }
  },
  {
    id: "int_r_005",
    category: "interest",
    dimension: "realistic",
    type: "choice",
    question: "Which skill would you rather develop?",
    options: {
      A: { text: "Welding and metalwork", score: { realistic: 1 } },
      B: { text: "Business negotiation", score: { enterprising: 1 } }
    }
  },
  {
    id: "int_r_006",
    category: "interest",
    dimension: "realistic",
    type: "choice",
    question: "Choose your ideal project:",
    options: {
      A: { text: "Restoring a vintage car", score: { realistic: 1 } },
      B: { text: "Analyzing market trends", score: { investigative: 1 } }
    }
  },

  // Investigative Interest Questions
  {
    id: "int_i_001",
    category: "interest",
    dimension: "investigative",
    type: "choice",
    question: "Which activity excites you more?",
    options: {
      A: { text: "Solving a complex math problem", score: { investigative: 1 } },
      B: { text: "Designing a poster", score: { artistic: 1 } }
    }
  },
  {
    id: "int_i_002",
    category: "interest",
    dimension: "investigative",
    type: "choice",
    question: "What would you rather spend time doing?",
    options: {
      A: { text: "Conducting scientific experiments", score: { investigative: 1 } },
      B: { text: "Leading a team meeting", score: { enterprising: 1 } }
    }
  },
  {
    id: "int_i_003",
    category: "interest",
    dimension: "investigative",
    type: "choice",
    question: "Which sounds more appealing?",
    options: {
      A: { text: "Researching medical breakthroughs", score: { investigative: 1 } },
      B: { text: "Teaching children", score: { social: 1 } }
    }
  },
  {
    id: "int_i_004",
    category: "interest",
    dimension: "investigative",
    type: "choice",
    question: "Choose your preferred challenge:",
    options: {
      A: { text: "Analyzing data patterns", score: { investigative: 1 } },
      B: { text: "Managing financial records", score: { conventional: 1 } }
    }
  },
  {
    id: "int_i_005",
    category: "interest",
    dimension: "investigative",
    type: "choice",
    question: "What interests you more?",
    options: {
      A: { text: "Understanding how things work", score: { investigative: 1 } },
      B: { text: "Building things with your hands", score: { realistic: 1 } }
    }
  },
  {
    id: "int_i_006",
    category: "interest",
    dimension: "investigative",
    type: "choice",
    question: "Which career path sounds more interesting?",
    options: {
      A: { text: "Laboratory researcher", score: { investigative: 1 } },
      B: { text: "Gallery curator", score: { artistic: 1 } }
    }
  },

  // Artistic Interest Questions
  {
    id: "int_a_001",
    category: "interest",
    dimension: "artistic",
    type: "choice",
    question: "Which activity would you choose?",
    options: {
      A: { text: "Writing a creative story", score: { artistic: 1 } },
      B: { text: "Organizing a filing system", score: { conventional: 1 } }
    }
  },
  {
    id: "int_a_002",
    category: "interest",
    dimension: "artistic",
    type: "choice",
    question: "What sounds more enjoyable?",
    options: {
      A: { text: "Composing music", score: { artistic: 1 } },
      B: { text: "Solving technical problems", score: { investigative: 1 } }
    }
  },
  {
    id: "int_a_003",
    category: "interest",
    dimension: "artistic",
    type: "choice",
    question: "Choose your ideal work setting:",
    options: {
      A: { text: "Creative studio space", score: { artistic: 1 } },
      B: { text: "Community center", score: { social: 1 } }
    }
  },
  {
    id: "int_a_004",
    category: "interest",
    dimension: "artistic",
    type: "choice",
    question: "Which project appeals more?",
    options: {
      A: { text: "Designing a website", score: { artistic: 1 } },
      B: { text: "Starting a business", score: { enterprising: 1 } }
    }
  },
  {
    id: "int_a_005",
    category: "interest",
    dimension: "artistic",
    type: "choice",
    question: "What would you rather do?",
    options: {
      A: { text: "Create a photography exhibit", score: { artistic: 1 } },
      B: { text: "Repair electronic devices", score: { realistic: 1 } }
    }
  },
  {
    id: "int_a_006",
    category: "interest",
    dimension: "artistic",
    type: "choice",
    question: "Which skill interests you more?",
    options: {
      A: { text: "Graphic design", score: { artistic: 1 } },
      B: { text: "Data analysis", score: { investigative: 1 } }
    }
  },

  // Social Interest Questions
  {
    id: "int_s_001",
    category: "interest",
    dimension: "social",
    type: "choice",
    question: "Which role appeals more to you?",
    options: {
      A: { text: "Counseling people through problems", score: { social: 1 } },
      B: { text: "Managing business operations", score: { enterprising: 1 } }
    }
  },
  {
    id: "int_s_002",
    category: "interest",
    dimension: "social",
    type: "choice",
    question: "What would you prefer to do?",
    options: {
      A: { text: "Teaching a workshop", score: { social: 1 } },
      B: { text: "Conducting research", score: { investigative: 1 } }
    }
  },
  {
    id: "int_s_003",
    category: "interest",
    dimension: "social",
    type: "choice",
    question: "Choose your ideal activity:",
    options: {
      A: { text: "Volunteering at a hospital", score: { social: 1 } },
      B: { text: "Creating art installations", score: { artistic: 1 } }
    }
  },
  {
    id: "int_s_004",
    category: "interest",
    dimension: "social",
    type: "choice",
    question: "Which work environment do you prefer?",
    options: {
      A: { text: "People-focused organization", score: { social: 1 } },
      B: { text: "Traditional office setting", score: { conventional: 1 } }
    }
  },
  {
    id: "int_s_005",
    category: "interest",
    dimension: "social",
    type: "choice",
    question: "What sounds more fulfilling?",
    options: {
      A: { text: "Helping others develop skills", score: { social: 1 } },
      B: { text: "Building mechanical systems", score: { realistic: 1 } }
    }
  },
  {
    id: "int_s_006",
    category: "interest",
    dimension: "social",
    type: "choice",
    question: "Which career path interests you more?",
    options: {
      A: { text: "Social worker", score: { social: 1 } },
      B: { text: "Laboratory technician", score: { investigative: 1 } }
    }
  },

  // Enterprising Interest Questions
  {
    id: "int_e_001",
    category: "interest",
    dimension: "enterprising",
    type: "choice",
    question: "Which activity excites you more?",
    options: {
      A: { text: "Leading a sales team", score: { enterprising: 1 } },
      B: { text: "Working in a lab", score: { investigative: 1 } }
    }
  },
  {
    id: "int_e_002",
    category: "interest",
    dimension: "enterprising",
    type: "choice",
    question: "What would you rather do?",
    options: {
      A: { text: "Start your own business", score: { enterprising: 1 } },
      B: { text: "Organize community events", score: { social: 1 } }
    }
  },
  {
    id: "int_e_003",
    category: "interest",
    dimension: "enterprising",
    type: "choice",
    question: "Choose your preferred role:",
    options: {
      A: { text: "Company executive", score: { enterprising: 1 } },
      B: { text: "Creative writer", score: { artistic: 1 } }
    }
  },
  {
    id: "int_e_004",
    category: "interest",
    dimension: "enterprising",
    type: "choice",
    question: "Which sounds more appealing?",
    options: {
      A: { text: "Negotiating business deals", score: { enterprising: 1 } },
      B: { text: "Maintaining databases", score: { conventional: 1 } }
    }
  },
  {
    id: "int_e_005",
    category: "interest",
    dimension: "enterprising",
    type: "choice",
    question: "What interests you more?",
    options: {
      A: { text: "Managing investment portfolios", score: { enterprising: 1 } },
      B: { text: "Installing electrical systems", score: { realistic: 1 } }
    }
  },
  {
    id: "int_e_006",
    category: "interest",
    dimension: "enterprising",
    type: "choice",
    question: "Which work environment appeals to you?",
    options: {
      A: { text: "Fast-paced business environment", score: { enterprising: 1 } },
      B: { text: "Quiet research facility", score: { investigative: 1 } }
    }
  },

  // Conventional Interest Questions
  {
    id: "int_c_001",
    category: "interest",
    dimension: "conventional",
    type: "choice",
    question: "Which task would you prefer?",
    options: {
      A: { text: "Organizing financial records", score: { conventional: 1 } },
      B: { text: "Creating marketing campaigns", score: { artistic: 1 } }
    }
  },
  {
    id: "int_c_002",
    category: "interest",
    dimension: "conventional",
    type: "choice",
    question: "What appeals more to you?",
    options: {
      A: { text: "Managing office procedures", score: { conventional: 1 } },
      B: { text: "Providing customer service", score: { social: 1 } }
    }
  },
  {
    id: "int_c_003",
    category: "interest",
    dimension: "conventional",
    type: "choice",
    question: "Choose your preferred activity:",
    options: {
      A: { text: "Processing data systematically", score: { conventional: 1 } },
      B: { text: "Leading project teams", score: { enterprising: 1 } }
    }
  },
  {
    id: "int_c_004",
    category: "interest",
    dimension: "conventional",
    type: "choice",
    question: "Which work style suits you better?",
    options: {
      A: { text: "Following established procedures", score: { conventional: 1 } },
      B: { text: "Testing new theories", score: { investigative: 1 } }
    }
  },
  {
    id: "int_c_005",
    category: "interest",
    dimension: "conventional",
    type: "choice",
    question: "What sounds more satisfying?",
    options: {
      A: { text: "Maintaining accurate records", score: { conventional: 1 } },
      B: { text: "Operating machinery", score: { realistic: 1 } }
    }
  },
  {
    id: "int_c_006",
    category: "interest",
    dimension: "conventional",
    type: "choice",
    question: "Which environment do you prefer?",
    options: {
      A: { text: "Structured office environment", score: { conventional: 1 } },
      B: { text: "Creative workspace", score: { artistic: 1 } }
    }
  },

  // APTITUDE QUESTIONS - 20 questions (5 per dimension)
  
  // Verbal Reasoning Aptitude
  {
    id: "apt_v_001",
    category: "aptitude",
    dimension: "verbal",
    type: "aptitude_task",
    question: "Choose the word that best completes the analogy: Book is to Reading as Fork is to ___",
    options: {
      A: { text: "Eating", score: { verbal: 1 } },
      B: { text: "Kitchen", score: { verbal: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_v_002",
    category: "aptitude",
    dimension: "verbal",
    type: "aptitude_task",
    question: "Which word is most similar in meaning to 'Meticulous'?",
    options: {
      A: { text: "Careful", score: { verbal: 1 } },
      B: { text: "Quick", score: { verbal: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_v_003",
    category: "aptitude",
    dimension: "verbal",
    type: "aptitude_task",
    question: "Complete the sentence: The manager's decision was so _______ that it surprised everyone.",
    options: {
      A: { text: "predictable", score: { verbal: 0 } },
      B: { text: "unexpected", score: { verbal: 1 } }
    },
    correctAnswer: "B"
  },
  {
    id: "apt_v_004",
    category: "aptitude",
    dimension: "verbal",
    type: "aptitude_task",
    question: "What is the opposite of 'Abundant'?",
    options: {
      A: { text: "Scarce", score: { verbal: 1 } },
      B: { text: "Plentiful", score: { verbal: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_v_005",
    category: "aptitude",
    dimension: "verbal",
    type: "aptitude_task",
    question: "Choose the correct word: The new policy will _______ all employees.",
    options: {
      A: { text: "effect", score: { verbal: 0 } },
      B: { text: "affect", score: { verbal: 1 } }
    },
    correctAnswer: "B"
  },

  // Numerical Reasoning Aptitude
  {
    id: "apt_n_001",
    category: "aptitude",
    dimension: "numerical",
    type: "aptitude_task",
    question: "If 3x + 5 = 17, what is x?",
    options: {
      A: { text: "4", score: { numerical: 1 } },
      B: { text: "6", score: { numerical: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_n_002",
    category: "aptitude",
    dimension: "numerical",
    type: "aptitude_task",
    question: "What is 15% of 200?",
    options: {
      A: { text: "30", score: { numerical: 1 } },
      B: { text: "35", score: { numerical: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_n_003",
    category: "aptitude",
    dimension: "numerical",
    type: "aptitude_task",
    question: "If a product costs $80 and is discounted by 25%, what is the final price?",
    options: {
      A: { text: "$60", score: { numerical: 1 } },
      B: { text: "$65", score: { numerical: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_n_004",
    category: "aptitude",
    dimension: "numerical",
    type: "aptitude_task",
    question: "What comes next in the sequence: 2, 6, 18, 54, ___?",
    options: {
      A: { text: "162", score: { numerical: 1 } },
      B: { text: "108", score: { numerical: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_n_005",
    category: "aptitude",
    dimension: "numerical",
    type: "aptitude_task",
    question: "If 5 workers can complete a task in 8 hours, how long will it take 10 workers?",
    options: {
      A: { text: "4 hours", score: { numerical: 1 } },
      B: { text: "6 hours", score: { numerical: 0 } }
    },
    correctAnswer: "A"
  },

  // Abstract Logic Aptitude
  {
    id: "apt_a_001",
    category: "aptitude",
    dimension: "abstract",
    type: "aptitude_task",
    question: "In a pattern where shapes rotate 90° clockwise each step, what comes next after: Square→Diamond→?",
    options: {
      A: { text: "Square", score: { abstract: 1 } },
      B: { text: "Circle", score: { abstract: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_a_002",
    category: "aptitude",
    dimension: "abstract",
    type: "aptitude_task",
    question: "If all Glips are Blops, and all Blops are Flops, then all Glips are:",
    options: {
      A: { text: "Flops", score: { abstract: 1 } },
      B: { text: "Not Flops", score: { abstract: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_a_003",
    category: "aptitude",
    dimension: "abstract",
    type: "aptitude_task",
    question: "Complete the pattern: ▲●■ ▲●■ ▲●___",
    options: {
      A: { text: "■", score: { abstract: 1 } },
      B: { text: "●", score: { abstract: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_a_004",
    category: "aptitude",
    dimension: "abstract",
    type: "aptitude_task",
    question: "Which doesn't belong: Triangle, Square, Pentagon, Circle, Rectangle?",
    options: {
      A: { text: "Circle", score: { abstract: 1 } },
      B: { text: "Triangle", score: { abstract: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_a_005",
    category: "aptitude",
    dimension: "abstract",
    type: "aptitude_task",
    question: "If you flip the letter 'b' horizontally and then vertically, what do you get?",
    options: {
      A: { text: "q", score: { abstract: 1 } },
      B: { text: "d", score: { abstract: 0 } }
    },
    correctAnswer: "A"
  },

  // Memory/Attention Aptitude
  {
    id: "apt_m_001",
    category: "aptitude",
    dimension: "memory",
    type: "aptitude_task",
    question: "Study this sequence for 5 seconds: 7-2-9-4-1. What was the middle number?",
    options: {
      A: { text: "9", score: { memory: 1 } },
      B: { text: "4", score: { memory: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_m_002",
    category: "aptitude",
    dimension: "memory",
    type: "aptitude_task",
    question: "How many times does the letter 'e' appear in: 'The excellent executive seems extremely eager'?",
    options: {
      A: { text: "9", score: { memory: 1 } },
      B: { text: "7", score: { memory: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_m_003",
    category: "aptitude",
    dimension: "memory",
    type: "aptitude_task",
    question: "Remember these words: CAR, BLUE, HAPPY, MOUNTAIN. Which word was third?",
    options: {
      A: { text: "HAPPY", score: { memory: 1 } },
      B: { text: "BLUE", score: { memory: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_m_004",
    category: "aptitude",
    dimension: "memory",
    type: "aptitude_task",
    question: "In the list: 15, 23, 31, 48, 52, 67, how many numbers are greater than 40?",
    options: {
      A: { text: "3", score: { memory: 1 } },
      B: { text: "4", score: { memory: 0 } }
    },
    correctAnswer: "A"
  },
  {
    id: "apt_m_005",
    category: "aptitude",
    dimension: "memory",
    type: "aptitude_task",
    question: "What comes after this pattern: Monday, Wednesday, Friday, ___?",
    options: {
      A: { text: "Sunday", score: { memory: 1 } },
      B: { text: "Saturday", score: { memory: 0 } }
    },
    correctAnswer: "A"
  },

  // PERSONALITY QUESTIONS - 20 questions (5 per dimension)
  
  // Introversion vs Extraversion
  {
    id: "per_i_001",
    category: "personality",
    dimension: "introversion",
    type: "likert",
    question: "I prefer working alone rather than in groups.",
    likertScale: {
      statement: "Rate how much you agree with this statement",
      dimensions: ["introversion"]
    }
  },
  {
    id: "per_i_002",
    category: "personality",
    dimension: "introversion",
    type: "choice",
    question: "At a party, you would rather:",
    options: {
      A: { text: "Have deep conversations with a few people", score: { introversion: 1 } },
      B: { text: "Meet and talk with many different people", score: { introversion: 0 } }
    }
  },
  {
    id: "per_i_003",
    category: "personality",
    dimension: "introversion",
    type: "choice",
    question: "When making decisions, you:",
    options: {
      A: { text: "Think it through carefully first", score: { introversion: 1 } },
      B: { text: "Discuss it with others", score: { introversion: 0 } }
    }
  },
  {
    id: "per_i_004",
    category: "personality",
    dimension: "introversion",
    type: "choice",
    question: "Your ideal weekend would be:",
    options: {
      A: { text: "Reading or pursuing hobbies at home", score: { introversion: 1 } },
      B: { text: "Going out with friends", score: { introversion: 0 } }
    }
  },
  {
    id: "per_i_005",
    category: "personality",
    dimension: "introversion",
    type: "choice",
    question: "In meetings, you typically:",
    options: {
      A: { text: "Listen and contribute when you have something valuable to say", score: { introversion: 1 } },
      B: { text: "Speak up frequently and share ideas", score: { introversion: 0 } }
    }
  },

  // Openness to Experience
  {
    id: "per_o_001",
    category: "personality",
    dimension: "openness",
    type: "choice",
    question: "When approaching a new task, you prefer to:",
    options: {
      A: { text: "Try creative, untested approaches", score: { openness: 1 } },
      B: { text: "Use proven, reliable methods", score: { openness: 0 } }
    }
  },
  {
    id: "per_o_002",
    category: "personality",
    dimension: "openness",
    type: "choice",
    question: "You are more drawn to:",
    options: {
      A: { text: "Abstract ideas and theories", score: { openness: 1 } },
      B: { text: "Practical, concrete concepts", score: { openness: 0 } }
    }
  },
  {
    id: "per_o_003",
    category: "personality",
    dimension: "openness",
    type: "choice",
    question: "When traveling, you prefer:",
    options: {
      A: { text: "Exploring new places spontaneously", score: { openness: 1 } },
      B: { text: "Following a planned itinerary", score: { openness: 0 } }
    }
  },
  {
    id: "per_o_004",
    category: "personality",
    dimension: "openness",
    type: "choice",
    question: "You find yourself more interested in:",
    options: {
      A: { text: "Learning about different cultures and philosophies", score: { openness: 1 } },
      B: { text: "Focusing on familiar topics you know well", score: { openness: 0 } }
    }
  },
  {
    id: "per_o_005",
    category: "personality",
    dimension: "openness",
    type: "choice",
    question: "Your approach to change is usually:",
    options: {
      A: { text: "Embrace it as an opportunity", score: { openness: 1 } },
      B: { text: "Approach it cautiously", score: { openness: 0 } }
    }
  },

  // Conscientiousness
  {
    id: "per_c_001",
    category: "personality",
    dimension: "conscientiousness",
    type: "choice",
    question: "When working on projects, you:",
    options: {
      A: { text: "Plan everything in detail before starting", score: { conscientiousness: 1 } },
      B: { text: "Start working and figure it out as you go", score: { conscientiousness: 0 } }
    }
  },
  {
    id: "per_c_002",
    category: "personality",
    dimension: "conscientiousness",
    type: "choice",
    question: "Your workspace is typically:",
    options: {
      A: { text: "Organized and tidy", score: { conscientiousness: 1 } },
      B: { text: "Comfortable chaos that works for you", score: { conscientiousness: 0 } }
    }
  },
  {
    id: "per_c_003",
    category: "personality",
    dimension: "conscientiousness",
    type: "choice",
    question: "When you commit to something, you:",
    options: {
      A: { text: "Always follow through, even if it's difficult", score: { conscientiousness: 1 } },
      B: { text: "Try your best but adapt if circumstances change", score: { conscientiousness: 0 } }
    }
  },
  {
    id: "per_c_004",
    category: "personality",
    dimension: "conscientiousness",
    type: "choice",
    question: "Your approach to deadlines is:",
    options: {
      A: { text: "Complete tasks well before they're due", score: { conscientiousness: 1 } },
      B: { text: "Work best under pressure close to deadlines", score: { conscientiousness: 0 } }
    }
  },
  {
    id: "per_c_005",
    category: "personality",
    dimension: "conscientiousness",
    type: "choice",
    question: "When setting goals, you prefer:",
    options: {
      A: { text: "Specific, measurable objectives with clear timelines", score: { conscientiousness: 1 } },
      B: { text: "General directions that allow flexibility", score: { conscientiousness: 0 } }
    }
  },

  // Adaptability
  {
    id: "per_a_001",
    category: "personality",
    dimension: "adaptability",
    type: "choice",
    question: "When plans change unexpectedly, you:",
    options: {
      A: { text: "Quickly adjust and find new solutions", score: { adaptability: 1 } },
      B: { text: "Feel frustrated and need time to regroup", score: { adaptability: 0 } }
    }
  },
  {
    id: "per_a_002",
    category: "personality",
    dimension: "adaptability",
    type: "choice",
    question: "In uncertain situations, you:",
    options: {
      A: { text: "Stay calm and look for opportunities", score: { adaptability: 1 } },
      B: { text: "Prefer to wait until things become clearer", score: { adaptability: 0 } }
    }
  },
  {
    id: "per_a_003",
    category: "personality",
    dimension: "adaptability",
    type: "choice",
    question: "When learning new skills, you:",
    options: {
      A: { text: "Enjoy the challenge and adapt quickly", score: { adaptability: 1 } },
      B: { text: "Prefer to master current skills first", score: { adaptability: 0 } }
    }
  },
  {
    id: "per_a_004",
    category: "personality",
    dimension: "adaptability",
    type: "choice",
    question: "Your reaction to feedback is typically:",
    options: {
      A: { text: "Welcome it and adjust accordingly", score: { adaptability: 1 } },
      B: { text: "Consider it carefully before making changes", score: { adaptability: 0 } }
    }
  },
  {
    id: "per_a_005",
    category: "personality",
    dimension: "adaptability",
    type: "choice",
    question: "When working with different personality types, you:",
    options: {
      A: { text: "Easily adjust your communication style", score: { adaptability: 1 } },
      B: { text: "Maintain your consistent approach", score: { adaptability: 0 } }
    }
  },

  // VALUES QUESTIONS - 16 questions (4 per dimension)
  
  // Security Values
  {
    id: "val_s_001",
    category: "value",
    dimension: "security",
    type: "choice",
    question: "What's more important in a career?",
    options: {
      A: { text: "Job stability and predictable income", score: { security: 1 } },
      B: { text: "Exciting challenges and growth potential", score: { achievement: 1 } }
    }
  },
  {
    id: "val_s_002",
    category: "value",
    dimension: "security",
    type: "choice",
    question: "When choosing a job, you prioritize:",
    options: {
      A: { text: "Comprehensive benefits and job security", score: { security: 1 } },
      B: { text: "Creative freedom and self-expression", score: { creativity: 1 } }
    }
  },
  {
    id: "val_s_003",
    category: "value",
    dimension: "security",
    type: "choice",
    question: "Your ideal work environment provides:",
    options: {
      A: { text: "Clear expectations and reliable structure", score: { security: 1 } },
      B: { text: "Opportunities to help others and make a difference", score: { community: 1 } }
    }
  },
  {
    id: "val_s_004",
    category: "value",
    dimension: "security",
    type: "choice",
    question: "You value most:",
    options: {
      A: { text: "Financial stability and retirement planning", score: { security: 1 } },
      B: { text: "Recognition and advancement opportunities", score: { achievement: 1 } }
    }
  },

  // Achievement Values
  {
    id: "val_a_001",
    category: "value",
    dimension: "achievement",
    type: "choice",
    question: "What motivates you most?",
    options: {
      A: { text: "Reaching ambitious goals and targets", score: { achievement: 1 } },
      B: { text: "Having a steady, peaceful work life", score: { security: 1 } }
    }
  },
  {
    id: "val_a_002",
    category: "value",
    dimension: "achievement",
    type: "choice",
    question: "You prefer work that:",
    options: {
      A: { text: "Offers clear metrics for success", score: { achievement: 1 } },
      B: { text: "Allows artistic and personal expression", score: { creativity: 1 } }
    }
  },
  {
    id: "val_a_003",
    category: "value",
    dimension: "achievement",
    type: "choice",
    question: "Success means:",
    options: {
      A: { text: "Exceeding performance expectations", score: { achievement: 1 } },
      B: { text: "Contributing to community welfare", score: { community: 1 } }
    }
  },
  {
    id: "val_a_004",
    category: "value",
    dimension: "achievement",
    type: "choice",
    question: "You're drawn to:",
    options: {
      A: { text: "Competitive environments with clear winners", score: { achievement: 1 } },
      B: { text: "Stable environments with minimal risk", score: { security: 1 } }
    }
  },

  // Creativity Values
  {
    id: "val_c_001",
    category: "value",
    dimension: "creativity",
    type: "choice",
    question: "What's most fulfilling?",
    options: {
      A: { text: "Creating something original and unique", score: { creativity: 1 } },
      B: { text: "Achieving measurable goals", score: { achievement: 1 } }
    }
  },
  {
    id: "val_c_002",
    category: "value",
    dimension: "creativity",
    type: "choice",
    question: "Your ideal job allows you to:",
    options: {
      A: { text: "Express your creative vision", score: { creativity: 1 } },
      B: { text: "Have predictable routines", score: { security: 1 } }
    }
  },
  {
    id: "val_c_003",
    category: "value",
    dimension: "creativity",
    type: "choice",
    question: "You value work that:",
    options: {
      A: { text: "Encourages innovation and new ideas", score: { creativity: 1 } },
      B: { text: "Benefits society and helps others", score: { community: 1 } }
    }
  },
  {
    id: "val_c_004",
    category: "value",
    dimension: "creativity",
    type: "choice",
    question: "What's more important?",
    options: {
      A: { text: "Having freedom to work creatively", score: { creativity: 1 } },
      B: { text: "Getting recognition for accomplishments", score: { achievement: 1 } }
    }
  },

  // Community Values
  {
    id: "val_co_001",
    category: "value",
    dimension: "community",
    type: "choice",
    question: "Work is most meaningful when it:",
    options: {
      A: { text: "Makes a positive impact on society", score: { community: 1 } },
      B: { text: "Provides financial security", score: { security: 1 } }
    }
  },
  {
    id: "val_co_002",
    category: "value",
    dimension: "community",
    type: "choice",
    question: "You prefer jobs that:",
    options: {
      A: { text: "Serve the greater good", score: { community: 1 } },
      B: { text: "Allow creative self-expression", score: { creativity: 1 } }
    }
  },
  {
    id: "val_co_003",
    category: "value",
    dimension: "community",
    type: "choice",
    question: "What gives you the most satisfaction?",
    options: {
      A: { text: "Helping others achieve their goals", score: { community: 1 } },
      B: { text: "Reaching personal milestones", score: { achievement: 1 } }
    }
  },
  {
    id: "val_co_004",
    category: "value",
    dimension: "community",
    type: "choice",
    question: "Your ideal workplace:",
    options: {
      A: { text: "Has a strong mission to help others", score: { community: 1 } },
      B: { text: "Offers stable employment", score: { security: 1 } }
    }
  }
];

export const getQuestionsByCategory = (category: string) => {
  return careerLaunchQuestions.filter(q => q.category === category);
};

export const getQuestionsByDimension = (dimension: string) => {
  return careerLaunchQuestions.filter(q => q.dimension === dimension);
};