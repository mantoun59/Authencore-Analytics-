export interface BurnoutPreventionQuestion {
  id: string;
  category: 'workload' | 'emotional' | 'efficacy' | 'support' | 'worklife' | 'coping' | 'wellbeing';
  dimension: string;
  question: string;
  options: {
    text: string;
    score: number;
    explanation?: string;
  }[];
  scenario?: string;
  priority: 'high' | 'medium' | 'low';
}

export const burnoutPreventionQuestions: BurnoutPreventionQuestion[] = [
  // WORKLOAD MANAGEMENT (15 questions)
  {
    id: "bp001",
    category: "workload",
    dimension: "Task Prioritization",
    question: "When facing multiple urgent deadlines, how do you handle the situation?",
    options: [
      { text: "I feel completely overwhelmed and don't know where to start", score: 1 },
      { text: "I try to do everything but struggle to prioritize effectively", score: 2 },
      { text: "I create a list and tackle tasks based on urgency and importance", score: 3 },
      { text: "I systematically assess deadlines, delegate when possible, and manage expectations", score: 4 },
      { text: "I efficiently prioritize, negotiate timelines, and maintain quality standards", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp002",
    category: "workload",
    dimension: "Delegation Skills",
    question: "How comfortable are you with delegating tasks to others?",
    options: [
      { text: "I never delegate - it's faster to do everything myself", score: 1 },
      { text: "I rarely delegate because I worry about quality", score: 2 },
      { text: "I delegate sometimes but only simple tasks", score: 3 },
      { text: "I delegate regularly and provide clear instructions", score: 4 },
      { text: "I effectively delegate, empower others, and follow up appropriately", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp003",
    category: "workload",
    dimension: "Time Management",
    question: "How well do you manage your time throughout the workday?",
    options: [
      { text: "I constantly feel behind and struggle to complete tasks", score: 1 },
      { text: "I often run late and feel stressed about deadlines", score: 2 },
      { text: "I manage my time adequately but could be more efficient", score: 3 },
      { text: "I use time management techniques and stay mostly on schedule", score: 4 },
      { text: "I excel at time management and consistently meet deadlines with quality work", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp004",
    category: "workload",
    dimension: "Boundary Setting",
    question: "How effectively do you set boundaries around your workload?",
    options: [
      { text: "I say yes to everything and never set limits", score: 1 },
      { text: "I struggle to say no even when overwhelmed", score: 2 },
      { text: "I sometimes set boundaries but feel guilty about it", score: 3 },
      { text: "I set clear boundaries and communicate my limits professionally", score: 4 },
      { text: "I proactively manage my workload and help others understand healthy boundaries", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp005",
    category: "workload",
    dimension: "Resource Management",
    question: "When you lack the resources needed to complete a task, what do you do?",
    options: [
      { text: "I try to do it anyway and often produce poor quality work", score: 1 },
      { text: "I struggle through and feel frustrated about the limitations", score: 2 },
      { text: "I mention the resource gap but don't actively seek solutions", score: 3 },
      { text: "I proactively communicate resource needs and propose solutions", score: 4 },
      { text: "I systematically identify resource gaps early and create contingency plans", score: 5 }
    ],
    priority: "medium"
  },

  // EMOTIONAL EXHAUSTION (15 questions)
  {
    id: "bp006",
    category: "emotional",
    dimension: "Energy Depletion",
    question: "How often do you feel emotionally drained at the end of your workday?",
    options: [
      { text: "Almost every day - I feel completely depleted", score: 1 },
      { text: "Most days I feel very tired and emotionally spent", score: 2 },
      { text: "Some days are draining, others are manageable", score: 3 },
      { text: "I occasionally feel tired but usually maintain energy", score: 4 },
      { text: "I rarely feel emotionally drained and maintain consistent energy", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp007",
    category: "emotional",
    dimension: "Cynicism",
    question: "How do you view your work and its meaningfulness?",
    options: [
      { text: "I feel like my work is pointless and question why I bother", score: 1 },
      { text: "I often feel disconnected from the purpose of my work", score: 2 },
      { text: "I have mixed feelings about the value of my work", score: 3 },
      { text: "I generally find meaning in my work despite challenges", score: 4 },
      { text: "I consistently find my work meaningful and engaging", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp008",
    category: "emotional",
    dimension: "Detachment",
    question: "How connected do you feel to your colleagues and work environment?",
    options: [
      { text: "I feel completely isolated and disconnected", score: 1 },
      { text: "I often feel like an outsider at work", score: 2 },
      { text: "I have some connections but often feel distant", score: 3 },
      { text: "I feel generally connected with occasional periods of distance", score: 4 },
      { text: "I maintain strong, positive connections with colleagues", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp009",
    category: "emotional",
    dimension: "Irritability",
    question: "How often do you feel irritated or impatient at work?",
    options: [
      { text: "Almost constantly - everything bothers me", score: 1 },
      { text: "Frequently - I have little patience for interruptions or requests", score: 2 },
      { text: "Sometimes - certain situations trigger irritation", score: 3 },
      { text: "Occasionally - mostly when under high stress", score: 4 },
      { text: "Rarely - I maintain patience even under pressure", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp010",
    category: "emotional",
    dimension: "Sleep Impact",
    question: "How does work stress affect your sleep patterns?",
    options: [
      { text: "I have severe insomnia and racing thoughts about work", score: 1 },
      { text: "I frequently have trouble falling asleep due to work worries", score: 2 },
      { text: "I sometimes have sleep issues when work is particularly stressful", score: 3 },
      { text: "My sleep is occasionally affected but generally stable", score: 4 },
      { text: "Work stress rarely affects my sleep quality", score: 5 }
    ],
    priority: "medium"
  },

  // PERSONAL EFFICACY (15 questions)
  {
    id: "bp011",
    category: "efficacy",
    dimension: "Confidence in Abilities",
    question: "How confident are you in your ability to handle job demands?",
    options: [
      { text: "I feel completely incompetent and doubt my abilities", score: 1 },
      { text: "I often question whether I can handle my responsibilities", score: 2 },
      { text: "I have mixed confidence depending on the task", score: 3 },
      { text: "I generally feel confident but have occasional doubts", score: 4 },
      { text: "I consistently feel capable and confident in my abilities", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp012",
    category: "efficacy",
    dimension: "Problem-Solving Confidence",
    question: "When facing complex work challenges, how do you feel?",
    options: [
      { text: "Completely overwhelmed and unable to find solutions", score: 1 },
      { text: "Anxious and uncertain about my problem-solving abilities", score: 2 },
      { text: "Cautious but willing to work through challenges", score: 3 },
      { text: "Confident that I can find effective solutions", score: 4 },
      { text: "Energized by challenges and confident in my problem-solving skills", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp013",
    category: "efficacy",
    dimension: "Achievement Satisfaction",
    question: "How satisfied are you with your accomplishments at work?",
    options: [
      { text: "I feel like I never accomplish anything meaningful", score: 1 },
      { text: "I rarely feel satisfied with what I achieve", score: 2 },
      { text: "I sometimes feel accomplished but it doesn't last", score: 3 },
      { text: "I regularly feel satisfied with my contributions", score: 4 },
      { text: "I consistently feel proud of my achievements and impact", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp014",
    category: "efficacy",
    dimension: "Growth Mindset",
    question: "How do you view opportunities to learn new skills or take on new challenges?",
    options: [
      { text: "I avoid them because I fear failure and exposure of my inadequacies", score: 1 },
      { text: "I'm hesitant because I doubt my ability to succeed", score: 2 },
      { text: "I'm interested but worry about my capacity to handle more", score: 3 },
      { text: "I welcome most opportunities and see them as growth experiences", score: 4 },
      { text: "I actively seek challenges and view them as exciting opportunities", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp015",
    category: "efficacy",
    dimension: "Impact Awareness",
    question: "How aware are you of the positive impact you have at work?",
    options: [
      { text: "I don't think I have any positive impact", score: 1 },
      { text: "I rarely notice or acknowledge my contributions", score: 2 },
      { text: "I sometimes recognize my impact but downplay it", score: 3 },
      { text: "I regularly notice and value my contributions", score: 4 },
      { text: "I clearly see and appreciate the positive difference I make", score: 5 }
    ],
    priority: "low"
  },

  // SUPPORT SYSTEMS (15 questions)
  {
    id: "bp016",
    category: "support",
    dimension: "Manager Support",
    question: "How supportive is your direct manager when you face challenges?",
    options: [
      { text: "My manager is unavailable and unhelpful when I need support", score: 1 },
      { text: "My manager provides minimal support and seems too busy", score: 2 },
      { text: "My manager provides adequate support when directly asked", score: 3 },
      { text: "My manager is generally supportive and checks in regularly", score: 4 },
      { text: "My manager is highly supportive and proactively offers help", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp017",
    category: "support",
    dimension: "Colleague Collaboration",
    question: "How supportive are your colleagues when you need assistance?",
    options: [
      { text: "Colleagues are competitive and rarely help each other", score: 1 },
      { text: "Colleagues help occasionally but seem reluctant", score: 2 },
      { text: "Colleagues provide reasonable support when asked", score: 3 },
      { text: "Colleagues are generally collaborative and helpful", score: 4 },
      { text: "Colleagues consistently support each other and work as a team", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp018",
    category: "support",
    dimension: "Organizational Resources",
    question: "How accessible are organizational resources (HR, EAP, training) when needed?",
    options: [
      { text: "Resources are non-existent or completely inaccessible", score: 1 },
      { text: "Resources exist but are difficult to access or poor quality", score: 2 },
      { text: "Resources are available but require significant effort to access", score: 3 },
      { text: "Resources are generally accessible and reasonably helpful", score: 4 },
      { text: "Resources are easily accessible, high-quality, and well-communicated", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp019",
    category: "support",
    dimension: "Personal Network",
    question: "How strong is your personal support network outside of work?",
    options: [
      { text: "I have no one to talk to about work stress", score: 1 },
      { text: "I have limited support and feel isolated", score: 2 },
      { text: "I have some support but don't always feel comfortable sharing", score: 3 },
      { text: "I have good support from friends or family", score: 4 },
      { text: "I have strong, reliable support from multiple sources", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp020",
    category: "support",
    dimension: "Professional Networks",
    question: "How connected are you to professional networks or mentors?",
    options: [
      { text: "I have no professional connections or mentors", score: 1 },
      { text: "I have minimal professional connections", score: 2 },
      { text: "I have some professional contacts but limited engagement", score: 3 },
      { text: "I maintain good professional relationships and some mentoring", score: 4 },
      { text: "I have strong professional networks and active mentoring relationships", score: 5 }
    ],
    priority: "low"
  },

  // WORK-LIFE INTEGRATION (15 questions)
  {
    id: "bp021",
    category: "worklife",
    dimension: "Boundary Management",
    question: "How well do you maintain boundaries between work and personal time?",
    options: [
      { text: "Work completely dominates my personal time", score: 1 },
      { text: "I struggle to disconnect from work during personal time", score: 2 },
      { text: "I sometimes maintain boundaries but often blur the lines", score: 3 },
      { text: "I generally maintain good work-life boundaries", score: 4 },
      { text: "I consistently maintain healthy boundaries and protect personal time", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp022",
    category: "worklife",
    dimension: "Time for Relationships",
    question: "How much quality time do you have for important relationships?",
    options: [
      { text: "Work prevents me from maintaining any meaningful relationships", score: 1 },
      { text: "I have very limited time for family and friends", score: 2 },
      { text: "I sometimes make time but often cancel due to work", score: 3 },
      { text: "I generally balance work with relationship time", score: 4 },
      { text: "I consistently prioritize and protect time for important relationships", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp023",
    category: "worklife",
    dimension: "Personal Interests",
    question: "How much time do you have for hobbies and personal interests?",
    options: [
      { text: "I have no time for personal interests or hobbies", score: 1 },
      { text: "I rarely engage in activities I enjoy", score: 2 },
      { text: "I occasionally make time for personal interests", score: 3 },
      { text: "I regularly engage in hobbies and personal activities", score: 4 },
      { text: "I consistently maintain a rich personal life with varied interests", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp024",
    category: "worklife",
    dimension: "Flexibility",
    question: "How flexible is your work arrangement to accommodate personal needs?",
    options: [
      { text: "My work is completely inflexible and rigid", score: 1 },
      { text: "There's minimal flexibility for personal needs", score: 2 },
      { text: "Some flexibility exists but requires significant negotiation", score: 3 },
      { text: "My work offers reasonable flexibility for personal needs", score: 4 },
      { text: "My work provides excellent flexibility and accommodates personal priorities", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp025",
    category: "worklife",
    dimension: "Recovery Time",
    question: "How effectively do you recover and recharge during non-work time?",
    options: [
      { text: "I never feel rested or recharged", score: 1 },
      { text: "I rarely feel refreshed even after time off", score: 2 },
      { text: "I sometimes feel refreshed but it doesn't last long", score: 3 },
      { text: "I generally recover well during breaks and weekends", score: 4 },
      { text: "I consistently feel refreshed and energized after personal time", score: 5 }
    ],
    priority: "high"
  },

  // COPING STRATEGIES (15 questions)
  {
    id: "bp026",
    category: "coping",
    dimension: "Stress Management Techniques",
    question: "What stress management techniques do you actively use?",
    options: [
      { text: "I have no effective strategies for managing stress", score: 1 },
      { text: "I try unhealthy coping mechanisms that often backfire", score: 2 },
      { text: "I have some strategies but use them inconsistently", score: 3 },
      { text: "I regularly use effective stress management techniques", score: 4 },
      { text: "I have multiple proven strategies and use them proactively", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp027",
    category: "coping",
    dimension: "Problem-Focused Coping",
    question: "When facing work stressors, how do you typically respond?",
    options: [
      { text: "I avoid problems and hope they go away", score: 1 },
      { text: "I worry about problems but struggle to take action", score: 2 },
      { text: "I sometimes address problems directly, sometimes avoid them", score: 3 },
      { text: "I usually take direct action to solve problems", score: 4 },
      { text: "I consistently address problems proactively with effective solutions", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp028",
    category: "coping",
    dimension: "Emotional Regulation",
    question: "How well do you manage your emotional responses to work stress?",
    options: [
      { text: "My emotions are completely out of control when stressed", score: 1 },
      { text: "I struggle to manage my emotional reactions", score: 2 },
      { text: "I have some control over my emotions but it's inconsistent", score: 3 },
      { text: "I generally manage my emotions well under stress", score: 4 },
      { text: "I consistently maintain emotional balance even under high stress", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp029",
    category: "coping",
    dimension: "Help-Seeking Behavior",
    question: "How comfortable are you seeking help when overwhelmed?",
    options: [
      { text: "I never ask for help and struggle alone", score: 1 },
      { text: "I'm very reluctant to ask for help even when needed", score: 2 },
      { text: "I sometimes ask for help but feel uncomfortable doing so", score: 3 },
      { text: "I'm generally comfortable seeking help when needed", score: 4 },
      { text: "I proactively seek help and support when facing challenges", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp030",
    category: "coping",
    dimension: "Perspective Taking",
    question: "How effectively do you maintain perspective during stressful periods?",
    options: [
      { text: "I catastrophize and see everything as a crisis", score: 1 },
      { text: "I often lose perspective and magnify problems", score: 2 },
      { text: "I sometimes maintain perspective but often get caught up in stress", score: 3 },
      { text: "I generally keep a balanced perspective on work challenges", score: 4 },
      { text: "I consistently maintain a healthy perspective and see the bigger picture", score: 5 }
    ],
    priority: "medium"
  },

  // WELLBEING PRACTICES (17 questions to reach 102 total)
  {
    id: "bp031",
    category: "wellbeing",
    dimension: "Physical Self-Care",
    question: "How consistently do you engage in physical self-care activities?",
    options: [
      { text: "I neglect all physical self-care and feel constantly run down", score: 1 },
      { text: "I rarely engage in physical self-care activities", score: 2 },
      { text: "I occasionally exercise or engage in physical activities", score: 3 },
      { text: "I regularly engage in physical activities and maintain my health", score: 4 },
      { text: "I consistently prioritize physical self-care and maintain excellent health habits", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp032",
    category: "wellbeing",
    dimension: "Mental Health Practices",
    question: "How actively do you engage in mental health and mindfulness practices?",
    options: [
      { text: "I never engage in mental health practices", score: 1 },
      { text: "I rarely think about or practice mental health strategies", score: 2 },
      { text: "I occasionally practice mindfulness or mental health activities", score: 3 },
      { text: "I regularly engage in mental health practices", score: 4 },
      { text: "I consistently prioritize mental health through multiple proven practices", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp033",
    category: "wellbeing",
    dimension: "Nutrition and Energy",
    question: "How well do you maintain healthy eating habits to support your energy levels?",
    options: [
      { text: "My eating habits are very poor and affect my energy and mood", score: 1 },
      { text: "I often skip meals or eat unhealthy foods due to work demands", score: 2 },
      { text: "My eating habits are inconsistent but adequate", score: 3 },
      { text: "I generally maintain healthy eating habits", score: 4 },
      { text: "I consistently maintain excellent nutrition to support my wellbeing", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp034",
    category: "wellbeing",
    dimension: "Sleep Hygiene",
    question: "How would you rate your sleep quality and hygiene practices?",
    options: [
      { text: "My sleep is severely disrupted and I have poor sleep habits", score: 1 },
      { text: "I frequently have poor sleep and inconsistent sleep patterns", score: 2 },
      { text: "My sleep is adequate but could be more consistent", score: 3 },
      { text: "I generally maintain good sleep habits and quality", score: 4 },
      { text: "I consistently maintain excellent sleep hygiene and quality rest", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp035",
    category: "wellbeing",
    dimension: "Social Connections",
    question: "How actively do you maintain and nurture social connections?",
    options: [
      { text: "I'm socially isolated and don't maintain relationships", score: 1 },
      { text: "I have minimal social connections and rarely engage with others", score: 2 },
      { text: "I maintain some social connections but could be more active", score: 3 },
      { text: "I regularly maintain and enjoy social connections", score: 4 },
      { text: "I actively nurture rich social connections that support my wellbeing", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp036",
    category: "wellbeing",
    dimension: "Recreation and Fun",
    question: "How often do you engage in activities purely for enjoyment and recreation?",
    options: [
      { text: "I never have fun or engage in recreational activities", score: 1 },
      { text: "I rarely do things just for enjoyment", score: 2 },
      { text: "I occasionally engage in fun activities", score: 3 },
      { text: "I regularly make time for enjoyable recreational activities", score: 4 },
      { text: "I consistently prioritize fun and recreation as essential to my wellbeing", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp037",
    category: "wellbeing",
    dimension: "Purpose and Meaning",
    question: "How connected do you feel to a sense of purpose beyond work?",
    options: [
      { text: "I feel no sense of purpose or meaning in life", score: 1 },
      { text: "I rarely feel connected to any greater purpose", score: 2 },
      { text: "I sometimes feel connected to purpose but it's inconsistent", score: 3 },
      { text: "I generally feel connected to meaningful purposes in life", score: 4 },
      { text: "I consistently feel deeply connected to purpose and meaning beyond work", score: 5 }
    ],
    priority: "low"
  },
  {
    id: "bp038",
    category: "wellbeing",
    dimension: "Learning and Growth",
    question: "How actively do you pursue personal learning and growth outside of work?",
    options: [
      { text: "I never engage in personal learning or growth activities", score: 1 },
      { text: "I rarely pursue learning outside of work requirements", score: 2 },
      { text: "I occasionally engage in personal development activities", score: 3 },
      { text: "I regularly pursue personal learning and growth", score: 4 },
      { text: "I consistently prioritize personal development and lifelong learning", score: 5 }
    ],
    priority: "low"
  },
  {
    id: "bp039",
    category: "wellbeing",
    dimension: "Financial Wellness",
    question: "How well do you manage financial stress and maintain financial wellbeing?",
    options: [
      { text: "Financial stress dominates my life and causes constant worry", score: 1 },
      { text: "I frequently worry about finances and feel financially unstable", score: 2 },
      { text: "I have some financial stress but manage reasonably well", score: 3 },
      { text: "I generally manage finances well with minimal stress", score: 4 },
      { text: "I maintain excellent financial wellbeing and rarely worry about money", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp040",
    category: "wellbeing",
    dimension: "Environmental Wellness",
    question: "How satisfied are you with your physical environment (home, workspace)?",
    options: [
      { text: "My environment is chaotic and negatively impacts my wellbeing", score: 1 },
      { text: "My environment often feels stressful or uncomfortable", score: 2 },
      { text: "My environment is adequate but could be more supportive", score: 3 },
      { text: "I generally maintain a supportive and comfortable environment", score: 4 },
      { text: "My environment consistently supports and enhances my wellbeing", score: 5 }
    ],
    priority: "low"
  },
  {
    id: "bp041",
    category: "wellbeing",
    dimension: "Creative Expression",
    question: "How often do you engage in creative activities or hobbies?",
    options: [
      { text: "I never engage in creative activities", score: 1 },
      { text: "I rarely have time or energy for creative pursuits", score: 2 },
      { text: "I occasionally engage in creative activities", score: 3 },
      { text: "I regularly make time for creative expression", score: 4 },
      { text: "I consistently prioritize and enjoy creative activities as essential to my wellbeing", score: 5 }
    ],
    priority: "low"
  },
  {
    id: "bp042",
    category: "wellbeing",
    dimension: "Spiritual Wellness",
    question: "How connected do you feel to spiritual or philosophical practices that ground you?",
    options: [
      { text: "I feel completely disconnected from any spiritual grounding", score: 1 },
      { text: "I rarely feel spiritually grounded or connected", score: 2 },
      { text: "I sometimes feel connected to spiritual or philosophical practices", score: 3 },
      { text: "I regularly engage in spiritual or philosophical practices that ground me", score: 4 },
      { text: "I consistently maintain deep spiritual or philosophical connections that support my wellbeing", score: 5 }
    ],
    priority: "low"
  },

  // Additional questions to reach 102
  {
    id: "bp043",
    category: "workload",
    dimension: "Workload Assessment",
    question: "How would you describe your current workload compared to your capacity?",
    options: [
      { text: "Severely overwhelming - far beyond my capacity", score: 1 },
      { text: "Consistently overwhelming - difficult to manage", score: 2 },
      { text: "Sometimes overwhelming but usually manageable", score: 3 },
      { text: "Generally appropriate for my skills and capacity", score: 4 },
      { text: "Well-matched to my capacity with room for growth", score: 5 }
    ],
    priority: "high"
  },
  {
    id: "bp044",
    category: "emotional",
    dimension: "Emotional Awareness",
    question: "How aware are you of your emotional state throughout the workday?",
    options: [
      { text: "I'm completely unaware of my emotions until they overwhelm me", score: 1 },
      { text: "I rarely notice my emotional state until it's too late", score: 2 },
      { text: "I sometimes notice my emotions but don't always respond well", score: 3 },
      { text: "I regularly check in with my emotions and respond appropriately", score: 4 },
      { text: "I consistently maintain high emotional awareness and self-regulation", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp045",
    category: "efficacy",
    dimension: "Skill Development",
    question: "How confident are you in your ability to develop new skills needed for your role?",
    options: [
      { text: "I feel unable to learn new skills and fear being left behind", score: 1 },
      { text: "I doubt my ability to keep up with changing skill requirements", score: 2 },
      { text: "I'm somewhat confident but worry about my learning speed", score: 3 },
      { text: "I'm generally confident in my ability to learn and adapt", score: 4 },
      { text: "I'm highly confident and excited about continuous skill development", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp046",
    category: "support",
    dimension: "Communication Quality",
    question: "How effectively do you communicate your needs and concerns at work?",
    options: [
      { text: "I never communicate my needs and suffer in silence", score: 1 },
      { text: "I struggle to communicate my needs effectively", score: 2 },
      { text: "I sometimes communicate my needs but not always clearly", score: 3 },
      { text: "I generally communicate my needs and concerns well", score: 4 },
      { text: "I consistently communicate needs clearly and get appropriate support", score: 5 }
    ],
    priority: "medium"
  },
  {
    id: "bp047",
    category: "worklife",
    dimension: "Energy Management",
    question: "How well do you manage your energy levels throughout the week?",
    options: [
      { text: "My energy is completely depleted and never recovers", score: 1 },
      { text: "I consistently feel low energy and struggle to recharge", score: 2 },
      { text: "My energy fluctuates but I sometimes feel energized", score: 3 },
      { text: "I generally manage my energy well with regular renewal", score: 4 },
      { text: "I consistently maintain high energy through effective energy management", score: 5 }
    ],
    priority: "high"
  }
];

export const burnoutDimensions = {
  workload: {
    name: "Workload Management",
    description: "Ability to prioritise, delegate, and manage tasks effectively",
    weight: 0.20
  },
  emotional: {
    name: "Emotional Exhaustion",
    description: "Current levels of emotional depletion and fatigue",
    weight: 0.20
  },
  efficacy: {
    name: "Personal Efficacy",
    description: "Belief in your capability to handle job demands",
    weight: 0.15
  },
  support: {
    name: "Support Systems",
    description: "Strength and accessibility of social and professional support",
    weight: 0.15
  },
  worklife: {
    name: "Work-Life Integration",
    description: "Balance and harmony between personal and professional life",
    weight: 0.15
  },
  coping: {
    name: "Coping Strategies",
    description: "Healthy responses to stress and adversity",
    weight: 0.10
  },
  wellbeing: {
    name: "Wellbeing Practices",
    description: "Routines promoting physical, mental, and emotional wellbeing",
    weight: 0.05
  }
};

export const burnoutRiskProfiles = [
  {
    name: "Optimal Wellbeing",
    range: { min: 90, max: 100 },
    description: "Exceptional burnout prevention - thriving with sustainable practices",
    characteristics: [
      "Excellent workload management and boundary setting",
      "High energy levels and emotional resilience",
      "Strong support systems and effective coping strategies",
      "Integrated wellbeing practices and work-life balance"
    ],
    developmentAreas: [
      "Continue modeling healthy practices for others",
      "Share strategies and mentor colleagues",
      "Stay vigilant for early warning signs"
    ],
    color: "bg-green-600"
  },
  {
    name: "Low Risk",
    range: { min: 75, max: 89 },
    description: "Good burnout prevention - maintaining healthy practices",
    characteristics: [
      "Generally effective workload management",
      "Good emotional regulation and energy levels",
      "Adequate support systems and coping strategies",
      "Mostly balanced work-life integration"
    ],
    developmentAreas: [
      "Strengthen specific areas showing lower scores",
      "Build additional coping strategies",
      "Enhance support network connections"
    ],
    color: "bg-blue-600"
  },
  {
    name: "Moderate Risk",
    range: { min: 60, max: 74 },
    description: "Some burnout risk - needs attention and improvement",
    characteristics: [
      "Inconsistent workload management",
      "Occasional emotional exhaustion",
      "Limited support systems or coping strategies",
      "Work-life balance challenges"
    ],
    developmentAreas: [
      "Develop stronger workload management skills",
      "Build more effective coping strategies",
      "Strengthen support networks",
      "Improve work-life boundaries"
    ],
    color: "bg-yellow-600"
  },
  {
    name: "High Risk",
    range: { min: 45, max: 59 },
    description: "Significant burnout risk - requires immediate attention",
    characteristics: [
      "Poor workload management and boundary setting",
      "Regular emotional exhaustion",
      "Weak support systems",
      "Poor work-life integration"
    ],
    developmentAreas: [
      "Urgent workload assessment and reduction",
      "Professional support and counseling",
      "Immediate stress management intervention",
      "Boundary setting training"
    ],
    color: "bg-orange-600"
  },
  {
    name: "Critical Risk",
    range: { min: 0, max: 44 },
    description: "Severe burnout risk - requires immediate professional intervention",
    characteristics: [
      "Severe workload overwhelm",
      "Chronic emotional exhaustion",
      "Minimal support systems",
      "Complete work-life imbalance"
    ],
    developmentAreas: [
      "Immediate professional mental health support",
      "Workplace accommodation or leave consideration",
      "Comprehensive lifestyle and work changes",
      "Medical evaluation if needed"
    ],
    color: "bg-red-600"
  }
];