export interface WorkValuesQuestion {
  id: number;
  text: string;
  category: 'achievement' | 'autonomy' | 'social-impact' | 'security' | 'growth' | 'work-life' | 'innovation' | 'leadership' | 'collaboration';
  options: {
    text: string;
    value: number;
  }[];
}

export const workValuesQuestions: WorkValuesQuestion[] = [
  {
    id: 1,
    text: "Being recognized for my accomplishments is important to me",
    category: "achievement",
    options: [
      { text: "Not important at all", value: 1 },
      { text: "Slightly important", value: 2 },
      { text: "Moderately important", value: 3 },
      { text: "Very important", value: 4 },
      { text: "Extremely important", value: 5 }
    ]
  },
  {
    id: 2,
    text: "Having control over how I complete my work is essential",
    category: "autonomy",
    options: [
      { text: "Not important at all", value: 1 },
      { text: "Slightly important", value: 2 },
      { text: "Moderately important", value: 3 },
      { text: "Very important", value: 4 },
      { text: "Extremely important", value: 5 }
    ]
  },
  {
    id: 3,
    text: "Making a positive difference in people's lives drives me",
    category: "social-impact",
    options: [
      { text: "Not important at all", value: 1 },
      { text: "Slightly important", value: 2 },
      { text: "Moderately important", value: 3 },
      { text: "Very important", value: 4 },
      { text: "Extremely important", value: 5 }
    ]
  },
  {
    id: 4,
    text: "Job security and stable employment are priorities for me",
    category: "security",
    options: [
      { text: "Not important at all", value: 1 },
      { text: "Slightly important", value: 2 },
      { text: "Moderately important", value: 3 },
      { text: "Very important", value: 4 },
      { text: "Extremely important", value: 5 }
    ]
  },
  {
    id: 5,
    text: "Continuous learning and skill development energize me",
    category: "growth",
    options: [
      { text: "Not important at all", value: 1 },
      { text: "Slightly important", value: 2 },
      { text: "Moderately important", value: 3 },
      { text: "Very important", value: 4 },
      { text: "Extremely important", value: 5 }
    ]
  }
];