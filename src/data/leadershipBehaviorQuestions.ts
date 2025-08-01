export interface LeadershipBehaviorQuestion {
  id: number;
  text: string;
  category: 'visionary' | 'coaching' | 'affiliative' | 'democratic' | 'pacesetting' | 'commanding';
  options: {
    text: string;
    value: number;
  }[];
}

export const leadershipBehaviorQuestions: LeadershipBehaviorQuestion[] = [
  // Visionary Leadership
  {
    id: 1,
    text: "I articulate a compelling vision that inspires others to follow",
    category: "visionary",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 2,
    text: "I help team members understand how their work contributes to the bigger picture",
    category: "visionary",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 3,
    text: "I communicate clear direction and purpose for organizational goals",
    category: "visionary",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 4,
    text: "I motivate others by painting an inspiring picture of the future",
    category: "visionary",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 5,
    text: "I encourage innovation and creative thinking to achieve our vision",
    category: "visionary",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 6,
    text: "I model the behaviors and values I expect from others",
    category: "visionary",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },

  // Coaching Leadership
  {
    id: 7,
    text: "I invest time in developing individual team members' skills",
    category: "coaching",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 8,
    text: "I provide specific, constructive feedback to help others improve",
    category: "coaching",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 9,
    text: "I delegate assignments that stretch people's capabilities",
    category: "coaching",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 10,
    text: "I help team members identify their long-term development goals",
    category: "coaching",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 11,
    text: "I create learning opportunities for team members",
    category: "coaching",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 12,
    text: "I ask questions that help others discover solutions themselves",
    category: "coaching",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },

  // Affiliative Leadership
  {
    id: 13,
    text: "I prioritize building strong relationships with team members",
    category: "affiliative",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 14,
    text: "I create a harmonious work environment where people feel valued",
    category: "affiliative",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 15,
    text: "I show genuine concern for team members' personal well-being",
    category: "affiliative",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 16,
    text: "I resolve conflicts by focusing on maintaining relationships",
    category: "affiliative",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 17,
    text: "I celebrate team accomplishments and recognize individual contributions",
    category: "affiliative",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 18,
    text: "I encourage open communication and emotional expression",
    category: "affiliative",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },

  // Democratic Leadership
  {
    id: 19,
    text: "I involve team members in decision-making processes",
    category: "democratic",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 20,
    text: "I seek input from team members before making important decisions",
    category: "democratic",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 21,
    text: "I encourage diverse perspectives and opinions in discussions",
    category: "democratic",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 22,
    text: "I build consensus before implementing new initiatives",
    category: "democratic",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 23,
    text: "I value collaboration and team input in problem-solving",
    category: "democratic",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 24,
    text: "I empower team members to take ownership of decisions",
    category: "democratic",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },

  // Pacesetting Leadership
  {
    id: 25,
    text: "I set high performance standards for myself and others",
    category: "pacesetting",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 26,
    text: "I lead by example and demonstrate excellence in my work",
    category: "pacesetting",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 27,
    text: "I expect quick results and high-quality performance",
    category: "pacesetting",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 28,
    text: "I step in to improve performance when standards aren't met",
    category: "pacesetting",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 29,
    text: "I push for continuous improvement and efficiency",
    category: "pacesetting",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 30,
    text: "I challenge team members to exceed their previous performance",
    category: "pacesetting",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },

  // Commanding Leadership
  {
    id: 31,
    text: "I take charge immediately in crisis situations",
    category: "commanding",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 32,
    text: "I give clear, direct instructions when urgent action is needed",
    category: "commanding",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 33,
    text: "I make tough decisions quickly when time is critical",
    category: "commanding",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 34,
    text: "I enforce compliance with rules and procedures when necessary",
    category: "commanding",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 35,
    text: "I provide firm direction to get teams back on track",
    category: "commanding",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  },
  {
    id: 36,
    text: "I set non-negotiable expectations when performance is poor",
    category: "commanding",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely", value: 2 },
      { text: "Sometimes", value: 3 },
      { text: "Often", value: 4 },
      { text: "Always", value: 5 }
    ]
  }
];