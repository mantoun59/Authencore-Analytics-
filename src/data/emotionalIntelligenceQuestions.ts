export interface EmotionalIntelligenceQuestion {
  id: string;
  dimension: string;
  question: string;
}

export const emotionalIntelligenceQuestions: EmotionalIntelligenceQuestion[] = [
  // Self-Awareness (12 questions)
  {
    id: "sa1",
    dimension: "selfAwareness",
    question: "I am aware of my emotions as they arise"
  },
  {
    id: "sa2",
    dimension: "selfAwareness",
    question: "I understand what triggers my emotional responses"
  },
  {
    id: "sa3",
    dimension: "selfAwareness",
    question: "I can accurately describe how I'm feeling"
  },
  {
    id: "sa4",
    dimension: "selfAwareness",
    question: "I recognize patterns in my emotional reactions"
  },
  {
    id: "sa5",
    dimension: "selfAwareness",
    question: "I understand my personal strengths and weaknesses"
  },
  {
    id: "sa6",
    dimension: "selfAwareness",
    question: "I am aware of how my mood affects others"
  },
  {
    id: "sa7",
    dimension: "selfAwareness",
    question: "I notice physical sensations that accompany my emotions"
  },
  {
    id: "sa8",
    dimension: "selfAwareness",
    question: "I can identify subtle differences in my emotions"
  },
  {
    id: "sa9",
    dimension: "selfAwareness",
    question: "I reflect on my emotional experiences regularly"
  },
  {
    id: "sa10",
    dimension: "selfAwareness",
    question: "I understand the connection between my thoughts and feelings"
  },
  {
    id: "sa11",
    dimension: "selfAwareness",
    question: "I am aware of my values and how they guide my decisions"
  },
  {
    id: "sa12",
    dimension: "selfAwareness",
    question: "I recognize when my emotions are influencing my judgment"
  },

  // Self-Regulation (12 questions)
  {
    id: "sr1",
    dimension: "selfRegulation",
    question: "I can calm myself when feeling anxious or upset"
  },
  {
    id: "sr2",
    dimension: "selfRegulation",
    question: "I think before acting on my emotions"
  },
  {
    id: "sr3",
    dimension: "selfRegulation",
    question: "I can control my temper in difficult situations"
  },
  {
    id: "sr4",
    dimension: "selfRegulation",
    question: "I adapt well to changing circumstances"
  },
  {
    id: "sr5",
    dimension: "selfRegulation",
    question: "I can delay gratification for long-term goals"
  },
  {
    id: "sr6",
    dimension: "selfRegulation",
    question: "I remain composed under pressure"
  },
  {
    id: "sr7",
    dimension: "selfRegulation",
    question: "I can redirect negative emotions productively"
  },
  {
    id: "sr8",
    dimension: "selfRegulation",
    question: "I practice stress management techniques regularly"
  },
  {
    id: "sr9",
    dimension: "selfRegulation",
    question: "I can maintain focus despite emotional distractions"
  },
  {
    id: "sr10",
    dimension: "selfRegulation",
    question: "I respond rather than react to challenging situations"
  },
  {
    id: "sr11",
    dimension: "selfRegulation",
    question: "I can express disagreement without becoming aggressive"
  },
  {
    id: "sr12",
    dimension: "selfRegulation",
    question: "I manage my impulses effectively"
  },

  // Motivation (12 questions)
  {
    id: "m1",
    dimension: "motivation",
    question: "I persist despite obstacles and setbacks"
  },
  {
    id: "m2",
    dimension: "motivation",
    question: "I am driven by internal rather than external rewards"
  },
  {
    id: "m3",
    dimension: "motivation",
    question: "I set challenging goals for myself"
  },
  {
    id: "m4",
    dimension: "motivation",
    question: "I maintain optimism even in difficult times"
  },
  {
    id: "m5",
    dimension: "motivation",
    question: "I find satisfaction in continuous improvement"
  },
  {
    id: "m6",
    dimension: "motivation",
    question: "I am committed to excellence in my work"
  },
  {
    id: "m7",
    dimension: "motivation",
    question: "I take initiative without being prompted"
  },
  {
    id: "m8",
    dimension: "motivation",
    question: "I see failures as learning opportunities"
  },
  {
    id: "m9",
    dimension: "motivation",
    question: "I maintain enthusiasm for long-term projects"
  },
  {
    id: "m10",
    dimension: "motivation",
    question: "I celebrate small victories along the way"
  },
  {
    id: "m11",
    dimension: "motivation",
    question: "I am passionate about my personal growth"
  },
  {
    id: "m12",
    dimension: "motivation",
    question: "I maintain hope for positive outcomes"
  },

  // Empathy (12 questions)
  {
    id: "e1",
    dimension: "empathy",
    question: "I can sense others' emotions even when unspoken"
  },
  {
    id: "e2",
    dimension: "empathy",
    question: "I listen actively to understand others' perspectives"
  },
  {
    id: "e3",
    dimension: "empathy",
    question: "I notice non-verbal cues in others"
  },
  {
    id: "e4",
    dimension: "empathy",
    question: "I can put myself in others' shoes"
  },
  {
    id: "e5",
    dimension: "empathy",
    question: "I respond appropriately to others' emotional states"
  },
  {
    id: "e6",
    dimension: "empathy",
    question: "I show genuine concern for others' wellbeing"
  },
  {
    id: "e7",
    dimension: "empathy",
    question: "I can read the emotional climate of a room"
  },
  {
    id: "e8",
    dimension: "empathy",
    question: "I validate others' feelings even when I disagree"
  },
  {
    id: "e9",
    dimension: "empathy",
    question: "I adjust my communication style to others' needs"
  },
  {
    id: "e10",
    dimension: "empathy",
    question: "I recognize when someone needs emotional support"
  },
  {
    id: "e11",
    dimension: "empathy",
    question: "I am sensitive to cultural differences in emotional expression"
  },
  {
    id: "e12",
    dimension: "empathy",
    question: "I can comfort others effectively"
  },

  // Social Skills (12 questions)
  {
    id: "ss1",
    dimension: "socialSkills",
    question: "I build rapport easily with new people"
  },
  {
    id: "ss2",
    dimension: "socialSkills",
    question: "I communicate clearly and persuasively"
  },
  {
    id: "ss3",
    dimension: "socialSkills",
    question: "I resolve conflicts constructively"
  },
  {
    id: "ss4",
    dimension: "socialSkills",
    question: "I collaborate effectively in team settings"
  },
  {
    id: "ss5",
    dimension: "socialSkills",
    question: "I influence others positively"
  },
  {
    id: "ss6",
    dimension: "socialSkills",
    question: "I maintain strong professional relationships"
  },
  {
    id: "ss7",
    dimension: "socialSkills",
    question: "I give constructive feedback tactfully"
  },
  {
    id: "ss8",
    dimension: "socialSkills",
    question: "I facilitate group discussions effectively"
  },
  {
    id: "ss9",
    dimension: "socialSkills",
    question: "I network comfortably in professional settings"
  },
  {
    id: "ss10",
    dimension: "socialSkills",
    question: "I inspire and motivate others"
  },
  {
    id: "ss11",
    dimension: "socialSkills",
    question: "I manage difficult conversations with grace"
  },
  {
    id: "ss12",
    dimension: "socialSkills",
    question: "I create inclusive environments for all"
  }
];

export const dimensionNames = {
  selfAwareness: "Self-Awareness",
  selfRegulation: "Self-Regulation", 
  motivation: "Motivation",
  empathy: "Empathy",
  socialSkills: "Social Skills"
};