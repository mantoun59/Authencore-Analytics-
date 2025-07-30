export interface EmotionalIntelligenceQuestion {
  id: string;
  dimension: string;
  question: string;
  reverse?: boolean; // For reverse-scored items
  context?: 'general' | 'workplace' | 'social'; // Context categorization
}

export const emotionalIntelligenceQuestions: EmotionalIntelligenceQuestion[] = [
  // Self-Awareness (14 questions - 2 reverse-scored, workplace contexts added)
  {
    id: "sa1",
    dimension: "selfAwareness",
    question: "I am aware of my emotions as they arise",
    context: "general"
  },
  {
    id: "sa2",
    dimension: "selfAwareness",
    question: "I understand what triggers my emotional responses",
    context: "general"
  },
  {
    id: "sa3",
    dimension: "selfAwareness",
    question: "I can accurately describe how I'm feeling",
    context: "general"
  },
  {
    id: "sa4",
    dimension: "selfAwareness",
    question: "I recognize patterns in my emotional reactions",
    context: "general"
  },
  {
    id: "sa5",
    dimension: "selfAwareness",
    question: "I understand my personal strengths and weaknesses",
    context: "general"
  },
  {
    id: "sa6",
    dimension: "selfAwareness",
    question: "I am aware of how my mood affects others at work",
    context: "workplace"
  },
  {
    id: "sa7",
    dimension: "selfAwareness",
    question: "I notice physical sensations that accompany my emotions",
    context: "general"
  },
  {
    id: "sa8",
    dimension: "selfAwareness",
    question: "I can identify subtle differences in my emotions",
    context: "general"
  },
  {
    id: "sa9",
    dimension: "selfAwareness",
    question: "I reflect on my emotional experiences regularly",
    context: "general"
  },
  {
    id: "sa10",
    dimension: "selfAwareness",
    question: "I understand the connection between my thoughts and feelings",
    context: "general"
  },
  {
    id: "sa11",
    dimension: "selfAwareness",
    question: "I am aware of my values and how they guide my workplace decisions",
    context: "workplace"
  },
  {
    id: "sa12",
    dimension: "selfAwareness",
    question: "I recognize when my emotions are influencing my judgment",
    context: "general"
  },
  {
    id: "sa13",
    dimension: "selfAwareness",
    question: "I often feel confused about why I react the way I do",
    reverse: true,
    context: "general"
  },
  {
    id: "sa14",
    dimension: "selfAwareness",
    question: "I struggle to understand my emotional impact on colleagues",
    reverse: true,
    context: "workplace"
  },

  // Self-Regulation (14 questions - 2 reverse-scored, workplace contexts added)
  {
    id: "sr1",
    dimension: "selfRegulation",
    question: "I can calm myself when feeling anxious or upset",
    context: "general"
  },
  {
    id: "sr2",
    dimension: "selfRegulation",
    question: "I think before acting on my emotions",
    context: "general"
  },
  {
    id: "sr3",
    dimension: "selfRegulation",
    question: "I can control my temper in difficult workplace situations",
    context: "workplace"
  },
  {
    id: "sr4",
    dimension: "selfRegulation",
    question: "I adapt well to changing circumstances",
    context: "general"
  },
  {
    id: "sr5",
    dimension: "selfRegulation",
    question: "I can delay gratification for long-term goals",
    context: "general"
  },
  {
    id: "sr6",
    dimension: "selfRegulation",
    question: "I remain composed under pressure at work",
    context: "workplace"
  },
  {
    id: "sr7",
    dimension: "selfRegulation",
    question: "I can redirect negative emotions productively",
    context: "general"
  },
  {
    id: "sr8",
    dimension: "selfRegulation",
    question: "I practice stress management techniques regularly",
    context: "general"
  },
  {
    id: "sr9",
    dimension: "selfRegulation",
    question: "I can maintain focus despite emotional distractions",
    context: "general"
  },
  {
    id: "sr10",
    dimension: "selfRegulation",
    question: "I respond rather than react to challenging situations",
    context: "general"
  },
  {
    id: "sr11",
    dimension: "selfRegulation",
    question: "I can express disagreement without becoming aggressive",
    context: "workplace"
  },
  {
    id: "sr12",
    dimension: "selfRegulation",
    question: "I manage my impulses effectively",
    context: "general"
  },
  {
    id: "sr13",
    dimension: "selfRegulation",
    question: "I often act impulsively when stressed at work",
    reverse: true,
    context: "workplace"
  },
  {
    id: "sr14",
    dimension: "selfRegulation",
    question: "I frequently lose my temper in challenging situations",
    reverse: true,
    context: "general"
  },

  // Motivation (14 questions - 2 reverse-scored, workplace contexts added)
  {
    id: "m1",
    dimension: "motivation",
    question: "I persist despite obstacles and setbacks",
    context: "general"
  },
  {
    id: "m2",
    dimension: "motivation",
    question: "I am driven by internal rather than external rewards",
    context: "general"
  },
  {
    id: "m3",
    dimension: "motivation",
    question: "I set challenging goals for myself at work",
    context: "workplace"
  },
  {
    id: "m4",
    dimension: "motivation",
    question: "I maintain optimism even in difficult times",
    context: "general"
  },
  {
    id: "m5",
    dimension: "motivation",
    question: "I find satisfaction in continuous improvement",
    context: "general"
  },
  {
    id: "m6",
    dimension: "motivation",
    question: "I am committed to excellence in my work",
    context: "workplace"
  },
  {
    id: "m7",
    dimension: "motivation",
    question: "I take initiative without being prompted",
    context: "workplace"
  },
  {
    id: "m8",
    dimension: "motivation",
    question: "I see failures as learning opportunities",
    context: "general"
  },
  {
    id: "m9",
    dimension: "motivation",
    question: "I maintain enthusiasm for long-term projects",
    context: "workplace"
  },
  {
    id: "m10",
    dimension: "motivation",
    question: "I celebrate small victories along the way",
    context: "general"
  },
  {
    id: "m11",
    dimension: "motivation",
    question: "I am passionate about my personal growth",
    context: "general"
  },
  {
    id: "m12",
    dimension: "motivation",
    question: "I maintain hope for positive outcomes",
    context: "general"
  },
  {
    id: "m13",
    dimension: "motivation",
    question: "I often give up when projects become difficult",
    reverse: true,
    context: "workplace"
  },
  {
    id: "m14",
    dimension: "motivation",
    question: "I need constant external motivation to stay engaged",
    reverse: true,
    context: "workplace"
  },

  // Empathy (14 questions - 2 reverse-scored, workplace contexts added)
  {
    id: "e1",
    dimension: "empathy",
    question: "I can sense others' emotions even when unspoken",
    context: "general"
  },
  {
    id: "e2",
    dimension: "empathy",
    question: "I listen actively to understand others' perspectives",
    context: "general"
  },
  {
    id: "e3",
    dimension: "empathy",
    question: "I notice non-verbal cues in others",
    context: "general"
  },
  {
    id: "e4",
    dimension: "empathy",
    question: "I can put myself in others' shoes",
    context: "general"
  },
  {
    id: "e5",
    dimension: "empathy",
    question: "I respond appropriately to others' emotional states",
    context: "general"
  },
  {
    id: "e6",
    dimension: "empathy",
    question: "I show genuine concern for colleagues' wellbeing",
    context: "workplace"
  },
  {
    id: "e7",
    dimension: "empathy",
    question: "I can read the emotional climate of a meeting room",
    context: "workplace"
  },
  {
    id: "e8",
    dimension: "empathy",
    question: "I validate others' feelings even when I disagree",
    context: "general"
  },
  {
    id: "e9",
    dimension: "empathy",
    question: "I adjust my communication style to others' needs",
    context: "workplace"
  },
  {
    id: "e10",
    dimension: "empathy",
    question: "I recognize when someone needs emotional support",
    context: "general"
  },
  {
    id: "e11",
    dimension: "empathy",
    question: "I am sensitive to cultural differences in emotional expression",
    context: "workplace"
  },
  {
    id: "e12",
    dimension: "empathy",
    question: "I can comfort others effectively",
    context: "general"
  },
  {
    id: "e13",
    dimension: "empathy",
    question: "I find it difficult to understand what others are feeling",
    reverse: true,
    context: "general"
  },
  {
    id: "e14",
    dimension: "empathy",
    question: "I often dismiss colleagues' emotional concerns as unimportant",
    reverse: true,
    context: "workplace"
  },

  // Social Skills (14 questions - 2 reverse-scored, workplace contexts added)
  {
    id: "ss1",
    dimension: "socialSkills",
    question: "I build rapport easily with new people",
    context: "general"
  },
  {
    id: "ss2",
    dimension: "socialSkills",
    question: "I communicate clearly and persuasively",
    context: "workplace"
  },
  {
    id: "ss3",
    dimension: "socialSkills",
    question: "I resolve conflicts constructively",
    context: "workplace"
  },
  {
    id: "ss4",
    dimension: "socialSkills",
    question: "I collaborate effectively in team settings",
    context: "workplace"
  },
  {
    id: "ss5",
    dimension: "socialSkills",
    question: "I influence others positively",
    context: "general"
  },
  {
    id: "ss6",
    dimension: "socialSkills",
    question: "I maintain strong professional relationships",
    context: "workplace"
  },
  {
    id: "ss7",
    dimension: "socialSkills",
    question: "I give constructive feedback tactfully",
    context: "workplace"
  },
  {
    id: "ss8",
    dimension: "socialSkills",
    question: "I facilitate group discussions effectively",
    context: "workplace"
  },
  {
    id: "ss9",
    dimension: "socialSkills",
    question: "I network comfortably in professional settings",
    context: "workplace"
  },
  {
    id: "ss10",
    dimension: "socialSkills",
    question: "I inspire and motivate others",
    context: "general"
  },
  {
    id: "ss11",
    dimension: "socialSkills",
    question: "I manage difficult conversations with grace",
    context: "workplace"
  },
  {
    id: "ss12",
    dimension: "socialSkills",
    question: "I create inclusive environments for all",
    context: "workplace"
  },
  {
    id: "ss13",
    dimension: "socialSkills",
    question: "I struggle to connect with people in social situations",
    reverse: true,
    context: "social"
  },
  {
    id: "ss14",
    dimension: "socialSkills",
    question: "I often avoid difficult conversations at work",
    reverse: true,
    context: "workplace"
  }
];

export const dimensionNames = {
  selfAwareness: "Self-Awareness",
  selfRegulation: "Self-Regulation", 
  motivation: "Motivation",
  empathy: "Empathy",
  socialSkills: "Social Skills"
};