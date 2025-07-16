export interface StressResilienceQuestion {
  id: string;
  category: 'emotional' | 'cognitive' | 'physical' | 'social' | 'adaptability' | 'performance';
  dimension: string;
  question: string;
  options: {
    text: string;
    score: number;
    explanation?: string;
  }[];
  scenario?: string;
  stressLevel: 'low' | 'medium' | 'high';
}

export const stressResilienceQuestions: StressResilienceQuestion[] = [
  // Emotional Resilience Questions
  {
    id: "sr001",
    category: "emotional",
    dimension: "Emotional Stability",
    question: "When facing a major setback at work, how do you typically respond?",
    options: [
      { text: "I feel overwhelmed and need several days to recover", score: 1 },
      { text: "I experience stress but can function normally within a day", score: 3 },
      { text: "I feel challenged but maintain emotional balance", score: 4 },
      { text: "I view it as an opportunity to grow and learn", score: 5 }
    ],
    stressLevel: "high"
  },
  {
    id: "sr002",
    category: "emotional",
    dimension: "Emotional Recovery",
    question: "After a stressful meeting with difficult feedback, how quickly do you bounce back?",
    options: [
      { text: "It affects my mood for the rest of the week", score: 1 },
      { text: "I need 2-3 days to fully process and move on", score: 2 },
      { text: "I recover within a day with some self-care", score: 3 },
      { text: "I process it constructively within hours", score: 4 },
      { text: "I immediately reframe it as valuable feedback", score: 5 }
    ],
    stressLevel: "medium"
  },
  {
    id: "sr003",
    category: "emotional",
    dimension: "Emotional Regulation",
    question: "During high-pressure situations, how well do you manage your emotions?",
    options: [
      { text: "I often feel out of control and reactive", score: 1 },
      { text: "I struggle but can manage with great effort", score: 2 },
      { text: "I maintain composure most of the time", score: 3 },
      { text: "I stay calm and focused under pressure", score: 4 },
      { text: "I actually perform better under pressure", score: 5 }
    ],
    stressLevel: "high"
  },

  // Cognitive Flexibility Questions
  {
    id: "sr004",
    category: "cognitive",
    dimension: "Problem-Solving Under Pressure",
    question: "When faced with an unexpected problem that needs immediate solution, you:",
    options: [
      { text: "Feel paralyzed and have difficulty thinking clearly", score: 1 },
      { text: "Rely on others to help me think through solutions", score: 2 },
      { text: "Take time to analyze but can find solutions", score: 3 },
      { text: "Quickly generate multiple solution options", score: 4 },
      { text: "Thrive in these situations and find creative solutions", score: 5 }
    ],
    stressLevel: "high"
  },
  {
    id: "sr005",
    category: "cognitive",
    dimension: "Mental Adaptability",
    question: "When your carefully planned approach suddenly won't work, how do you adapt?",
    options: [
      { text: "I feel frustrated and struggle to adjust", score: 1 },
      { text: "I need significant time to develop a new approach", score: 2 },
      { text: "I can adapt but it takes some mental energy", score: 3 },
      { text: "I quickly shift to alternative strategies", score: 4 },
      { text: "I enjoy the challenge of finding new approaches", score: 5 }
    ],
    stressLevel: "medium"
  },
  {
    id: "sr006",
    category: "cognitive",
    dimension: "Focus Under Stress",
    question: "During stressful periods, how well do you maintain concentration?",
    options: [
      { text: "I find it very difficult to concentrate", score: 1 },
      { text: "My focus is significantly reduced", score: 2 },
      { text: "I can focus but it requires more effort", score: 3 },
      { text: "I maintain good focus with some strategies", score: 4 },
      { text: "Stress actually sharpens my focus", score: 5 }
    ],
    stressLevel: "medium"
  },

  // Physical Response Questions
  {
    id: "sr007",
    category: "physical",
    dimension: "Physical Stress Response",
    question: "How does your body typically respond to high-stress situations?",
    options: [
      { text: "I experience significant physical symptoms (headaches, tension, fatigue)", score: 1 },
      { text: "I notice physical stress but can manage it", score: 2 },
      { text: "I have mild physical responses that don't interfere", score: 3 },
      { text: "I rarely experience physical stress symptoms", score: 4 },
      { text: "I feel energized and physically ready for challenges", score: 5 }
    ],
    stressLevel: "high"
  },
  {
    id: "sr008",
    category: "physical",
    dimension: "Energy Management",
    question: "How do you manage your energy levels during demanding periods?",
    options: [
      { text: "I quickly become exhausted and need frequent breaks", score: 1 },
      { text: "I can maintain energy for short periods only", score: 2 },
      { text: "I pace myself and maintain steady energy", score: 3 },
      { text: "I have good energy reserves and recovery", score: 4 },
      { text: "I seem to have endless energy during challenges", score: 5 }
    ],
    stressLevel: "medium"
  },
  {
    id: "sr009",
    category: "physical",
    dimension: "Sleep Under Stress",
    question: "How does stress affect your sleep patterns?",
    options: [
      { text: "I have severe sleep disruption and insomnia", score: 1 },
      { text: "My sleep is significantly affected", score: 2 },
      { text: "I experience some sleep disturbances", score: 3 },
      { text: "My sleep remains mostly normal", score: 4 },
      { text: "I sleep well even during stressful periods", score: 5 }
    ],
    stressLevel: "medium"
  },

  // Social Support Questions
  {
    id: "sr010",
    category: "social",
    dimension: "Support Network Utilization",
    question: "When facing challenges, how effectively do you utilize your support network?",
    options: [
      { text: "I tend to isolate myself and avoid asking for help", score: 1 },
      { text: "I struggle to reach out even when I need support", score: 2 },
      { text: "I can ask for help but find it difficult", score: 3 },
      { text: "I effectively seek support when needed", score: 4 },
      { text: "I'm excellent at building and using support networks", score: 5 }
    ],
    stressLevel: "low"
  },
  {
    id: "sr011",
    category: "social",
    dimension: "Team Collaboration Under Pressure",
    question: "How do you work with others when the team is under pressure?",
    options: [
      { text: "I become less collaborative and more withdrawn", score: 1 },
      { text: "I can work with others but with reduced effectiveness", score: 2 },
      { text: "I maintain normal collaboration levels", score: 3 },
      { text: "I become more focused on team success", score: 4 },
      { text: "I naturally rally the team and enhance collaboration", score: 5 }
    ],
    stressLevel: "high"
  },
  {
    id: "sr012",
    category: "social",
    dimension: "Communication Under Stress",
    question: "How does stress affect your communication with colleagues?",
    options: [
      { text: "I become irritable and communication suffers", score: 1 },
      { text: "I'm more cautious and less open in communication", score: 2 },
      { text: "My communication style remains mostly unchanged", score: 3 },
      { text: "I become more direct and effective in communication", score: 4 },
      { text: "I excel at clear, calm communication under pressure", score: 5 }
    ],
    stressLevel: "medium"
  },

  // Change Adaptability Questions
  {
    id: "sr013",
    category: "adaptability",
    dimension: "Change Tolerance",
    question: "How do you react to sudden organizational changes?",
    options: [
      { text: "I resist change and feel anxious about uncertainty", score: 1 },
      { text: "I adapt slowly and need significant support", score: 2 },
      { text: "I can adapt but prefer stability", score: 3 },
      { text: "I adapt relatively quickly to changes", score: 4 },
      { text: "I thrive in dynamic environments with constant change", score: 5 }
    ],
    stressLevel: "medium"
  },
  {
    id: "sr014",
    category: "adaptability",
    dimension: "Uncertainty Comfort",
    question: "How comfortable are you with ambiguous or unclear situations?",
    options: [
      { text: "I feel very uncomfortable and anxious", score: 1 },
      { text: "I can tolerate some ambiguity but prefer clarity", score: 2 },
      { text: "I'm generally comfortable with reasonable uncertainty", score: 3 },
      { text: "I work well even with significant ambiguity", score: 4 },
      { text: "I actually prefer situations with some uncertainty", score: 5 }
    ],
    stressLevel: "low"
  },
  {
    id: "sr015",
    category: "adaptability",
    dimension: "Learning from Setbacks",
    question: "When you experience a failure or setback, how do you respond?",
    options: [
      { text: "I dwell on the failure and have difficulty moving forward", score: 1 },
      { text: "I eventually learn from it but the process is slow", score: 2 },
      { text: "I can extract lessons but it takes some time", score: 3 },
      { text: "I quickly identify lessons and apply them", score: 4 },
      { text: "I immediately reframe failures as learning opportunities", score: 5 }
    ],
    stressLevel: "high"
  },

  // Performance Under Pressure Questions
  {
    id: "sr016",
    category: "performance",
    dimension: "Performance Maintenance",
    question: "How does your work performance change under tight deadlines?",
    options: [
      { text: "My performance significantly deteriorates", score: 1 },
      { text: "I struggle to maintain my usual standards", score: 2 },
      { text: "I maintain adequate performance levels", score: 3 },
      { text: "My performance remains consistently high", score: 4 },
      { text: "I actually perform better under pressure", score: 5 }
    ],
    stressLevel: "high"
  },
  {
    id: "sr017",
    category: "performance",
    dimension: "Decision Making Under Pressure",
    question: "When you must make important decisions quickly, how do you perform?",
    options: [
      { text: "I freeze up and have difficulty making decisions", score: 1 },
      { text: "I can make decisions but doubt myself significantly", score: 2 },
      { text: "I make reasonable decisions with some hesitation", score: 3 },
      { text: "I make good decisions efficiently", score: 4 },
      { text: "I excel at rapid, high-quality decision making", score: 5 }
    ],
    stressLevel: "high"
  },
  {
    id: "sr018",
    category: "performance",
    dimension: "Quality Under Pressure",
    question: "How does pressure affect the quality of your work?",
    options: [
      { text: "Quality drops significantly under pressure", score: 1 },
      { text: "I struggle to maintain quality standards", score: 2 },
      { text: "Quality remains acceptable but not optimal", score: 3 },
      { text: "I maintain high quality even under pressure", score: 4 },
      { text: "Pressure actually improves my attention to quality", score: 5 }
    ],
    stressLevel: "medium"
  },

  // Additional Advanced Questions
  {
    id: "sr019",
    category: "emotional",
    dimension: "Stress Anticipation",
    question: "How do you handle anticipated stressful events?",
    options: [
      { text: "I worry extensively and it affects my current performance", score: 1 },
      { text: "I feel anxious but can still function normally", score: 2 },
      { text: "I prepare mentally and emotionally for challenges", score: 3 },
      { text: "I use anticipation to better prepare and strategize", score: 4 },
      { text: "I look forward to challenges as growth opportunities", score: 5 }
    ],
    stressLevel: "low"
  },
  {
    id: "sr020",
    category: "cognitive",
    dimension: "Stress Recovery",
    question: "After a particularly stressful period, how quickly do you return to baseline?",
    options: [
      { text: "It takes weeks to fully recover", score: 1 },
      { text: "I need several days to feel normal again", score: 2 },
      { text: "I recover within a day or two with self-care", score: 3 },
      { text: "I bounce back quickly with minimal intervention", score: 4 },
      { text: "I recover almost immediately and feel energized", score: 5 }
    ],
    stressLevel: "medium"
  }
];

export const stressResilienceScenarios = [
  {
    id: "scenario1",
    title: "Impossible Deadline",
    description: "Your manager has just informed you that a major project deadline has been moved up by two weeks. The client is demanding, and failure could cost the company a significant contract.",
    stressLevel: "high",
    questions: ["sr001", "sr004", "sr016", "sr017"]
  },
  {
    id: "scenario2", 
    title: "Team Conflict",
    description: "There's significant tension between team members on a critical project. Communication has broken down, and productivity is suffering.",
    stressLevel: "medium",
    questions: ["sr011", "sr012", "sr005", "sr010"]
  },
  {
    id: "scenario3",
    title: "Organizational Restructuring",
    description: "Your company is undergoing major changes. Roles are being eliminated, departments are being merged, and your position's future is uncertain.",
    stressLevel: "high",
    questions: ["sr013", "sr014", "sr015", "sr019"]
  }
];

export const resilienceProfiles = [
  {
    name: "Titanium",
    range: { min: 90, max: 100 },
    description: "Exceptional resilience - thrives under extreme pressure",
    characteristics: [
      "Maintains peak performance under intense stress",
      "Views challenges as energizing opportunities",
      "Quickly recovers from setbacks",
      "Serves as a stabilizing force for others"
    ],
    developmentAreas: [
      "Continue modeling resilience for others",
      "Seek increasingly challenging opportunities",
      "Mentor others in stress management"
    ],
    color: "bg-slate-600"
  },
  {
    name: "Steel",
    range: { min: 80, max: 89 },
    description: "High resilience - handles most pressures effectively",
    characteristics: [
      "Maintains good performance under pressure",
      "Adapts well to changing circumstances",
      "Generally positive outlook during challenges",
      "Effective stress management strategies"
    ],
    developmentAreas: [
      "Fine-tune stress management techniques",
      "Build additional coping strategies",
      "Practice under higher-pressure scenarios"
    ],
    color: "bg-gray-500"
  },
  {
    name: "Iron",
    range: { min: 70, max: 79 },
    description: "Good resilience - manages stress with some effort",
    characteristics: [
      "Handles routine stress well",
      "May need support during peak challenges",
      "Generally recovers from setbacks",
      "Benefits from stress management resources"
    ],
    developmentAreas: [
      "Develop stronger emotional regulation skills",
      "Build more robust support networks",
      "Practice stress inoculation techniques"
    ],
    color: "bg-zinc-600"
  },
  {
    name: "Copper",
    range: { min: 60, max: 69 },
    description: "Moderate resilience - needs development and support",
    characteristics: [
      "Manages low-moderate stress adequately",
      "Struggles with high-pressure situations",
      "May experience stress-related symptoms",
      "Benefits from structured support"
    ],
    developmentAreas: [
      "Learn fundamental stress management skills",
      "Develop emotional regulation techniques",
      "Build stronger support systems"
    ],
    color: "bg-orange-600"
  },
  {
    name: "Bronze",
    range: { min: 50, max: 59 },
    description: "Developing resilience - requires significant support",
    characteristics: [
      "Struggles with moderate stress levels",
      "May avoid challenging situations",
      "Needs considerable recovery time",
      "Benefits from intensive development"
    ],
    developmentAreas: [
      "Focus on basic stress management",
      "Build foundational coping skills",
      "Seek professional development support"
    ],
    color: "bg-amber-600"
  },
  {
    name: "Clay",
    range: { min: 0, max: 49 },
    description: "Low resilience - needs immediate support and development",
    characteristics: [
      "Significant difficulty with stress",
      "May experience stress-related health impacts",
      "Requires structured intervention",
      "Benefits from professional guidance"
    ],
    developmentAreas: [
      "Immediate stress management intervention",
      "Professional counseling support",
      "Gradual exposure to manageable challenges"
    ],
    color: "bg-red-600"
  }
];

export const dimensionWeights = {
  emotional: 0.25,
  cognitive: 0.20,
  physical: 0.15,
  social: 0.15,
  adaptability: 0.15,
  performance: 0.10
};