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
    question: "How often do you feel overwhelmed by your workload?",
    options: [
      { text: "Never", score: 5, explanation: "Excellent workload management" },
      { text: "Rarely", score: 4, explanation: "Good workload balance" },
      { text: "Sometimes", score: 3, explanation: "Moderate workload stress" },
      { text: "Often", score: 2, explanation: "High workload stress" },
      { text: "Always", score: 1, explanation: "Critical workload overload" }
    ],
    priority: "high"
  },
  {
    id: "bp002",
    category: "workload",
    dimension: "Time Management",
    question: "How effectively do you manage your time at work?",
    options: [
      { text: "Very effectively", score: 5 },
      { text: "Effectively", score: 4 },
      { text: "Moderately", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp003",
    category: "workload",
    dimension: "Deadline Pressure",
    question: "How often do you work under unrealistic deadlines?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp004",
    category: "workload",
    dimension: "Task Clarity",
    question: "How clear are your job responsibilities and expectations?",
    options: [
      { text: "Very clear", score: 5 },
      { text: "Clear", score: 4 },
      { text: "Somewhat clear", score: 3 },
      { text: "Unclear", score: 2 },
      { text: "Very unclear", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp005",
    category: "workload",
    dimension: "Work Volume",
    question: "How manageable is your daily work volume?",
    options: [
      { text: "Very manageable", score: 5 },
      { text: "Manageable", score: 4 },
      { text: "Somewhat manageable", score: 3 },
      { text: "Unmanageable", score: 2 },
      { text: "Completely unmanageable", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp006",
    category: "workload",
    dimension: "Resource Availability",
    question: "How adequate are the resources provided to complete your work?",
    options: [
      { text: "Very adequate", score: 5 },
      { text: "Adequate", score: 4 },
      { text: "Somewhat adequate", score: 3 },
      { text: "Inadequate", score: 2 },
      { text: "Very inadequate", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp007",
    category: "workload",
    dimension: "Multi-tasking",
    question: "How often are you required to juggle multiple high-priority tasks?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp008",
    category: "workload",
    dimension: "Interruptions",
    question: "How often do interruptions disrupt your workflow?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Constantly", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp009",
    category: "workload",
    dimension: "Work Planning",
    question: "How well can you plan and organize your work schedule?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp010",
    category: "workload",
    dimension: "Skill Match",
    question: "How well do your skills match your job requirements?",
    options: [
      { text: "Perfect match", score: 5 },
      { text: "Good match", score: 4 },
      { text: "Adequate match", score: 3 },
      { text: "Poor match", score: 2 },
      { text: "No match", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp011",
    category: "workload",
    dimension: "Overtime Frequency",
    question: "How often do you work overtime or extra hours?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp012",
    category: "workload",
    dimension: "Priority Changes",
    question: "How often do your work priorities change unexpectedly?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Constantly", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp013",
    category: "workload",
    dimension: "Break Time",
    question: "How often do you take scheduled breaks during your workday?",
    options: [
      { text: "Always", score: 5 },
      { text: "Often", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Rarely", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp014",
    category: "workload",
    dimension: "Task Variety",
    question: "How varied and stimulating are your daily work tasks?",
    options: [
      { text: "Very varied and stimulating", score: 5 },
      { text: "Varied and stimulating", score: 4 },
      { text: "Somewhat varied", score: 3 },
      { text: "Repetitive", score: 2 },
      { text: "Very repetitive and boring", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp015",
    category: "workload",
    dimension: "Workload Control",
    question: "How much control do you have over your workload and pace?",
    options: [
      { text: "Complete control", score: 5 },
      { text: "Good control", score: 4 },
      { text: "Some control", score: 3 },
      { text: "Little control", score: 2 },
      { text: "No control", score: 1 }
    ],
    priority: "high"
  },

  // EMOTIONAL EXHAUSTION (15 questions)
  {
    id: "bp016",
    category: "emotional",
    dimension: "Energy Levels",
    question: "How energetic do you feel at the start of your workday?",
    options: [
      { text: "Very energetic", score: 5 },
      { text: "Energetic", score: 4 },
      { text: "Moderately energetic", score: 3 },
      { text: "Low energy", score: 2 },
      { text: "Completely drained", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp017",
    category: "emotional",
    dimension: "Work Motivation",
    question: "How motivated do you feel about going to work?",
    options: [
      { text: "Very motivated", score: 5 },
      { text: "Motivated", score: 4 },
      { text: "Somewhat motivated", score: 3 },
      { text: "Unmotivated", score: 2 },
      { text: "Completely unmotivated", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp018",
    category: "emotional",
    dimension: "Emotional Drain",
    question: "How emotionally draining do you find your work?",
    options: [
      { text: "Not at all draining", score: 5 },
      { text: "Slightly draining", score: 4 },
      { text: "Moderately draining", score: 3 },
      { text: "Very draining", score: 2 },
      { text: "Extremely draining", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp019",
    category: "emotional",
    dimension: "Work Satisfaction",
    question: "How satisfied are you with your current job?",
    options: [
      { text: "Very satisfied", score: 5 },
      { text: "Satisfied", score: 4 },
      { text: "Neutral", score: 3 },
      { text: "Dissatisfied", score: 2 },
      { text: "Very dissatisfied", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp020",
    category: "emotional",
    dimension: "Emotional Recovery",
    question: "How quickly do you recover emotionally after a challenging workday?",
    options: [
      { text: "Very quickly", score: 5 },
      { text: "Quickly", score: 4 },
      { text: "Moderately", score: 3 },
      { text: "Slowly", score: 2 },
      { text: "I don't recover", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp021",
    category: "emotional",
    dimension: "Stress Response",
    question: "How well do you handle work-related stress?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp022",
    category: "emotional",
    dimension: "Cynicism",
    question: "How cynical do you feel about your work and workplace?",
    options: [
      { text: "Not at all cynical", score: 5 },
      { text: "Slightly cynical", score: 4 },
      { text: "Moderately cynical", score: 3 },
      { text: "Very cynical", score: 2 },
      { text: "Extremely cynical", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp023",
    category: "emotional",
    dimension: "Work Enthusiasm",
    question: "How enthusiastic do you feel about your work tasks?",
    options: [
      { text: "Very enthusiastic", score: 5 },
      { text: "Enthusiastic", score: 4 },
      { text: "Moderately enthusiastic", score: 3 },
      { text: "Unenthusiastic", score: 2 },
      { text: "Completely apathetic", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp024",
    category: "emotional",
    dimension: "Emotional Numbness",
    question: "How often do you feel emotionally numb or detached at work?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp025",
    category: "emotional",
    dimension: "Irritability",
    question: "How irritable or short-tempered are you at work?",
    options: [
      { text: "Never irritable", score: 5 },
      { text: "Rarely irritable", score: 4 },
      { text: "Sometimes irritable", score: 3 },
      { text: "Often irritable", score: 2 },
      { text: "Always irritable", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp026",
    category: "emotional",
    dimension: "Work Dread",
    question: "How often do you dread going to work?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp027",
    category: "emotional",
    dimension: "Emotional Investment",
    question: "How emotionally invested are you in your work outcomes?",
    options: [
      { text: "Very invested", score: 5 },
      { text: "Invested", score: 4 },
      { text: "Moderately invested", score: 3 },
      { text: "Barely invested", score: 2 },
      { text: "Not invested at all", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp028",
    category: "emotional",
    dimension: "Emotional Overflow",
    question: "How often do work emotions spill over into your personal life?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp029",
    category: "emotional",
    dimension: "Emotional Resilience",
    question: "How resilient are you when facing work setbacks?",
    options: [
      { text: "Very resilient", score: 5 },
      { text: "Resilient", score: 4 },
      { text: "Moderately resilient", score: 3 },
      { text: "Not very resilient", score: 2 },
      { text: "Not resilient at all", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp030",
    category: "emotional",
    dimension: "Passion Loss",
    question: "How much passion do you still have for your field/profession?",
    options: [
      { text: "Strong passion", score: 5 },
      { text: "Good passion", score: 4 },
      { text: "Some passion", score: 3 },
      { text: "Little passion", score: 2 },
      { text: "No passion left", score: 1 }
    ],
    priority: "high"
  },

  // PERSONAL EFFICACY (15 questions) 
  {
    id: "bp031",
    category: "efficacy",
    dimension: "Accomplishment Sense",
    question: "How accomplished do you feel in your current role?",
    options: [
      { text: "Very accomplished", score: 5 },
      { text: "Accomplished", score: 4 },
      { text: "Moderately accomplished", score: 3 },
      { text: "Unaccomplished", score: 2 },
      { text: "Completely unaccomplished", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp032",
    category: "efficacy",
    dimension: "Skill Confidence",
    question: "How confident are you in your professional abilities?",
    options: [
      { text: "Very confident", score: 5 },
      { text: "Confident", score: 4 },
      { text: "Moderately confident", score: 3 },
      { text: "Not confident", score: 2 },
      { text: "Completely lacking confidence", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp033",
    category: "efficacy",
    dimension: "Problem Solving",
    question: "How effectively do you solve work-related problems?",
    options: [
      { text: "Very effectively", score: 5 },
      { text: "Effectively", score: 4 },
      { text: "Moderately effectively", score: 3 },
      { text: "Ineffectively", score: 2 },
      { text: "Very ineffectively", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp034",
    category: "efficacy",
    dimension: "Goal Achievement",
    question: "How often do you achieve your work goals?",
    options: [
      { text: "Always", score: 5 },
      { text: "Often", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Rarely", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp035",
    category: "efficacy",
    dimension: "Competence Growth",
    question: "How much are you growing professionally in your current role?",
    options: [
      { text: "Growing significantly", score: 5 },
      { text: "Growing well", score: 4 },
      { text: "Growing moderately", score: 3 },
      { text: "Barely growing", score: 2 },
      { text: "Not growing at all", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp036",
    category: "efficacy",
    dimension: "Recognition",
    question: "How recognized are your contributions at work?",
    options: [
      { text: "Highly recognized", score: 5 },
      { text: "Well recognized", score: 4 },
      { text: "Moderately recognized", score: 3 },
      { text: "Barely recognized", score: 2 },
      { text: "Not recognized at all", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp037",
    category: "efficacy",
    dimension: "Meaningful Impact",
    question: "How meaningful is the impact of your work?",
    options: [
      { text: "Very meaningful", score: 5 },
      { text: "Meaningful", score: 4 },
      { text: "Somewhat meaningful", score: 3 },
      { text: "Not very meaningful", score: 2 },
      { text: "Completely meaningless", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp038",
    category: "efficacy",
    dimension: "Learning Opportunities",
    question: "How many learning and development opportunities do you have?",
    options: [
      { text: "Many opportunities", score: 5 },
      { text: "Good opportunities", score: 4 },
      { text: "Some opportunities", score: 3 },
      { text: "Few opportunities", score: 2 },
      { text: "No opportunities", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp039",
    category: "efficacy",
    dimension: "Value Contribution",
    question: "How valuable do you feel your contributions are to the organization?",
    options: [
      { text: "Very valuable", score: 5 },
      { text: "Valuable", score: 4 },
      { text: "Moderately valuable", score: 3 },
      { text: "Not very valuable", score: 2 },
      { text: "Worthless", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp040",
    category: "efficacy",
    dimension: "Professional Pride",
    question: "How proud are you of your professional work?",
    options: [
      { text: "Very proud", score: 5 },
      { text: "Proud", score: 4 },
      { text: "Moderately proud", score: 3 },
      { text: "Not proud", score: 2 },
      { text: "Ashamed", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp041",
    category: "efficacy",
    dimension: "Innovation Ability",
    question: "How innovative are you in your approach to work challenges?",
    options: [
      { text: "Very innovative", score: 5 },
      { text: "Innovative", score: 4 },
      { text: "Moderately innovative", score: 3 },
      { text: "Not innovative", score: 2 },
      { text: "Completely uncreative", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp042",
    category: "efficacy",
    dimension: "Expertise Development",
    question: "How well are you developing expertise in your field?",
    options: [
      { text: "Excellent development", score: 5 },
      { text: "Good development", score: 4 },
      { text: "Moderate development", score: 3 },
      { text: "Poor development", score: 2 },
      { text: "No development", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp043",
    category: "efficacy",
    dimension: "Task Mastery",
    question: "How well do you master new tasks and responsibilities?",
    options: [
      { text: "Master very well", score: 5 },
      { text: "Master well", score: 4 },
      { text: "Master moderately", score: 3 },
      { text: "Struggle to master", score: 2 },
      { text: "Cannot master new tasks", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp044",
    category: "efficacy",
    dimension: "Influence Ability",
    question: "How much positive influence do you have in your workplace?",
    options: [
      { text: "Significant influence", score: 5 },
      { text: "Good influence", score: 4 },
      { text: "Some influence", score: 3 },
      { text: "Little influence", score: 2 },
      { text: "No influence", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp045",
    category: "efficacy",
    dimension: "Career Progress",
    question: "How satisfied are you with your career progression?",
    options: [
      { text: "Very satisfied", score: 5 },
      { text: "Satisfied", score: 4 },
      { text: "Moderately satisfied", score: 3 },
      { text: "Dissatisfied", score: 2 },
      { text: "Very dissatisfied", score: 1 }
    ],
    priority: "high"
  },

  // SOCIAL SUPPORT (15 questions)
  {
    id: "bp046",
    category: "support",
    dimension: "Manager Support",
    question: "How supportive is your direct manager?",
    options: [
      { text: "Very supportive", score: 5 },
      { text: "Supportive", score: 4 },
      { text: "Moderately supportive", score: 3 },
      { text: "Unsupportive", score: 2 },
      { text: "Very unsupportive", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp047",
    category: "support",
    dimension: "Colleague Support",
    question: "How supportive are your colleagues and teammates?",
    options: [
      { text: "Very supportive", score: 5 },
      { text: "Supportive", score: 4 },
      { text: "Moderately supportive", score: 3 },
      { text: "Unsupportive", score: 2 },
      { text: "Very unsupportive", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp048",
    category: "support",
    dimension: "Organizational Support",
    question: "How much does your organization support employee wellbeing?",
    options: [
      { text: "Strong support", score: 5 },
      { text: "Good support", score: 4 },
      { text: "Moderate support", score: 3 },
      { text: "Little support", score: 2 },
      { text: "No support", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp049",
    category: "support",
    dimension: "Communication Quality",
    question: "How effective is communication in your workplace?",
    options: [
      { text: "Very effective", score: 5 },
      { text: "Effective", score: 4 },
      { text: "Moderately effective", score: 3 },
      { text: "Ineffective", score: 2 },
      { text: "Very ineffective", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp050",
    category: "support",
    dimension: "Team Cohesion",
    question: "How cohesive and united is your work team?",
    options: [
      { text: "Very cohesive", score: 5 },
      { text: "Cohesive", score: 4 },
      { text: "Moderately cohesive", score: 3 },
      { text: "Not cohesive", score: 2 },
      { text: "Completely fragmented", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp051",
    category: "support",
    dimension: "Mentorship Access",
    question: "How available is mentorship and guidance in your workplace?",
    options: [
      { text: "Readily available", score: 5 },
      { text: "Available", score: 4 },
      { text: "Somewhat available", score: 3 },
      { text: "Rarely available", score: 2 },
      { text: "Not available", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp052",
    category: "support",
    dimension: "Conflict Resolution",
    question: "How well are workplace conflicts resolved?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp053",
    category: "support",
    dimension: "Trust Level",
    question: "How much do you trust your colleagues and management?",
    options: [
      { text: "Complete trust", score: 5 },
      { text: "High trust", score: 4 },
      { text: "Moderate trust", score: 3 },
      { text: "Low trust", score: 2 },
      { text: "No trust", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp054",
    category: "support",
    dimension: "Feedback Quality",
    question: "How constructive and helpful is the feedback you receive?",
    options: [
      { text: "Very constructive", score: 5 },
      { text: "Constructive", score: 4 },
      { text: "Somewhat constructive", score: 3 },
      { text: "Unconstructive", score: 2 },
      { text: "Destructive", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp055",
    category: "support",
    dimension: "Social Connection",
    question: "How connected do you feel to your workplace community?",
    options: [
      { text: "Very connected", score: 5 },
      { text: "Connected", score: 4 },
      { text: "Moderately connected", score: 3 },
      { text: "Disconnected", score: 2 },
      { text: "Completely isolated", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp056",
    category: "support",
    dimension: "Resource Access",
    question: "How easily can you access help and resources when needed?",
    options: [
      { text: "Very easily", score: 5 },
      { text: "Easily", score: 4 },
      { text: "Moderately easily", score: 3 },
      { text: "With difficulty", score: 2 },
      { text: "Cannot access", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp057",
    category: "support",
    dimension: "Psychological Safety",
    question: "How psychologically safe do you feel in your workplace?",
    options: [
      { text: "Very safe", score: 5 },
      { text: "Safe", score: 4 },
      { text: "Moderately safe", score: 3 },
      { text: "Unsafe", score: 2 },
      { text: "Very unsafe", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp058",
    category: "support",
    dimension: "Appreciation",
    question: "How appreciated do you feel by your supervisors and peers?",
    options: [
      { text: "Very appreciated", score: 5 },
      { text: "Appreciated", score: 4 },
      { text: "Somewhat appreciated", score: 3 },
      { text: "Unappreciated", score: 2 },
      { text: "Completely unappreciated", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp059",
    category: "support",
    dimension: "Inclusion Level",
    question: "How included do you feel in workplace decisions and activities?",
    options: [
      { text: "Fully included", score: 5 },
      { text: "Included", score: 4 },
      { text: "Moderately included", score: 3 },
      { text: "Excluded", score: 2 },
      { text: "Completely excluded", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp060",
    category: "support",
    dimension: "Advocacy",
    question: "How much do you feel your manager advocates for you?",
    options: [
      { text: "Strong advocacy", score: 5 },
      { text: "Good advocacy", score: 4 },
      { text: "Some advocacy", score: 3 },
      { text: "Little advocacy", score: 2 },
      { text: "No advocacy", score: 1 }
    ],
    priority: "medium"
  },

  // WORK-LIFE BALANCE (15 questions)
  {
    id: "bp061",
    category: "worklife",
    dimension: "Boundary Setting",
    question: "How well do you maintain boundaries between work and personal life?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp062",
    category: "worklife",
    dimension: "Personal Time",
    question: "How much quality personal time do you have outside of work?",
    options: [
      { text: "Plenty of time", score: 5 },
      { text: "Adequate time", score: 4 },
      { text: "Some time", score: 3 },
      { text: "Little time", score: 2 },
      { text: "No personal time", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp063",
    category: "worklife",
    dimension: "Family Relationships",
    question: "How has your work affected your family relationships?",
    options: [
      { text: "Positive impact", score: 5 },
      { text: "No impact", score: 4 },
      { text: "Slight negative impact", score: 3 },
      { text: "Negative impact", score: 2 },
      { text: "Very negative impact", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp064",
    category: "worklife",
    dimension: "After-Hours Work",
    question: "How often do you work or think about work outside of office hours?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Constantly", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp065",
    category: "worklife",
    dimension: "Vacation Time",
    question: "How well do you utilize your vacation and time off?",
    options: [
      { text: "Use all vacation time", score: 5 },
      { text: "Use most vacation time", score: 4 },
      { text: "Use some vacation time", score: 3 },
      { text: "Rarely use vacation", score: 2 },
      { text: "Never use vacation", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp066",
    category: "worklife",
    dimension: "Hobby Engagement",
    question: "How engaged are you in hobbies and personal interests?",
    options: [
      { text: "Very engaged", score: 5 },
      { text: "Engaged", score: 4 },
      { text: "Moderately engaged", score: 3 },
      { text: "Barely engaged", score: 2 },
      { text: "Not engaged at all", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp067",
    category: "worklife",
    dimension: "Sleep Quality",
    question: "How has work stress affected your sleep quality?",
    options: [
      { text: "No impact on sleep", score: 5 },
      { text: "Minor impact", score: 4 },
      { text: "Moderate impact", score: 3 },
      { text: "Significant impact", score: 2 },
      { text: "Severe impact", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp068",
    category: "worklife",
    dimension: "Social Life",
    question: "How has your work schedule affected your social life?",
    options: [
      { text: "Positive impact", score: 5 },
      { text: "No impact", score: 4 },
      { text: "Slight negative impact", score: 3 },
      { text: "Negative impact", score: 2 },
      { text: "Very negative impact", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp069",
    category: "worklife",
    dimension: "Physical Health",
    question: "How has work stress affected your physical health?",
    options: [
      { text: "No impact", score: 5 },
      { text: "Minor impact", score: 4 },
      { text: "Moderate impact", score: 3 },
      { text: "Significant impact", score: 2 },
      { text: "Severe impact", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp070",
    category: "worklife",
    dimension: "Flexibility",
    question: "How flexible is your work schedule for personal needs?",
    options: [
      { text: "Very flexible", score: 5 },
      { text: "Flexible", score: 4 },
      { text: "Moderately flexible", score: 3 },
      { text: "Inflexible", score: 2 },
      { text: "Very inflexible", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp071",
    category: "worklife",
    dimension: "Commute Impact",
    question: "How does your commute affect your work-life balance?",
    options: [
      { text: "No negative impact", score: 5 },
      { text: "Minor impact", score: 4 },
      { text: "Moderate impact", score: 3 },
      { text: "Significant impact", score: 2 },
      { text: "Major impact", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp072",
    category: "worklife",
    dimension: "Remote Work",
    question: "How well does your workplace support work-life balance through remote options?",
    options: [
      { text: "Excellent support", score: 5 },
      { text: "Good support", score: 4 },
      { text: "Moderate support", score: 3 },
      { text: "Poor support", score: 2 },
      { text: "No support", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp073",
    category: "worklife",
    dimension: "Emergency Coverage",
    question: "How often are you required to be available for work emergencies?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp074",
    category: "worklife",
    dimension: "Recovery Time",
    question: "How much time do you need to recover after intensive work periods?",
    options: [
      { text: "No recovery needed", score: 5 },
      { text: "Minimal recovery", score: 4 },
      { text: "Moderate recovery", score: 3 },
      { text: "Significant recovery", score: 2 },
      { text: "Long recovery period", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp075",
    category: "worklife",
    dimension: "Personal Growth",
    question: "How much time do you have for personal development outside work?",
    options: [
      { text: "Plenty of time", score: 5 },
      { text: "Adequate time", score: 4 },
      { text: "Some time", score: 3 },
      { text: "Little time", score: 2 },
      { text: "No time", score: 1 }
    ],
    priority: "low"
  },

  // COPING STRATEGIES (15 questions)
  {
    id: "bp076",
    category: "coping",
    dimension: "Stress Management",
    question: "How effectively do you manage stress in healthy ways?",
    options: [
      { text: "Very effectively", score: 5 },
      { text: "Effectively", score: 4 },
      { text: "Moderately effectively", score: 3 },
      { text: "Ineffectively", score: 2 },
      { text: "Very ineffectively", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp077",
    category: "coping",
    dimension: "Exercise Habits",
    question: "How regularly do you engage in physical exercise?",
    options: [
      { text: "Daily", score: 5 },
      { text: "Several times per week", score: 4 },
      { text: "Weekly", score: 3 },
      { text: "Occasionally", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp078",
    category: "coping",
    dimension: "Mindfulness Practice",
    question: "How often do you practice mindfulness, meditation, or relaxation techniques?",
    options: [
      { text: "Daily", score: 5 },
      { text: "Several times per week", score: 4 },
      { text: "Weekly", score: 3 },
      { text: "Occasionally", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp079",
    category: "coping",
    dimension: "Professional Help",
    question: "How comfortable are you seeking professional help for stress or mental health?",
    options: [
      { text: "Very comfortable", score: 5 },
      { text: "Comfortable", score: 4 },
      { text: "Somewhat comfortable", score: 3 },
      { text: "Uncomfortable", score: 2 },
      { text: "Very uncomfortable", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp080",
    category: "coping",
    dimension: "Support Network",
    question: "How strong is your personal support network outside of work?",
    options: [
      { text: "Very strong", score: 5 },
      { text: "Strong", score: 4 },
      { text: "Moderate", score: 3 },
      { text: "Weak", score: 2 },
      { text: "Very weak", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp081",
    category: "coping",
    dimension: "Healthy Outlets",
    question: "How many healthy outlets do you have for releasing stress?",
    options: [
      { text: "Many outlets", score: 5 },
      { text: "Several outlets", score: 4 },
      { text: "Some outlets", score: 3 },
      { text: "Few outlets", score: 2 },
      { text: "No healthy outlets", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp082",
    category: "coping",
    dimension: "Self-Awareness",
    question: "How aware are you of your stress signals and triggers?",
    options: [
      { text: "Very aware", score: 5 },
      { text: "Aware", score: 4 },
      { text: "Moderately aware", score: 3 },
      { text: "Slightly aware", score: 2 },
      { text: "Not aware", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp083",
    category: "coping",
    dimension: "Substance Use",
    question: "How often do you use alcohol, drugs, or other substances to cope with work stress?",
    options: [
      { text: "Never", score: 5 },
      { text: "Rarely", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Often", score: 2 },
      { text: "Always", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp084",
    category: "coping",
    dimension: "Problem-Focused Coping",
    question: "How often do you address the source of stress rather than just the symptoms?",
    options: [
      { text: "Always", score: 5 },
      { text: "Often", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Rarely", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp085",
    category: "coping",
    dimension: "Emotional Regulation",
    question: "How well do you regulate your emotions during stressful situations?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp086",
    category: "coping",
    dimension: "Perspective Taking",
    question: "How well do you maintain perspective during challenging times?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp087",
    category: "coping",
    dimension: "Relaxation Skills",
    question: "How skilled are you at relaxing and unwinding from work stress?",
    options: [
      { text: "Very skilled", score: 5 },
      { text: "Skilled", score: 4 },
      { text: "Moderately skilled", score: 3 },
      { text: "Not skilled", score: 2 },
      { text: "Cannot relax", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp088",
    category: "coping",
    dimension: "Creative Expression",
    question: "How often do you engage in creative activities for stress relief?",
    options: [
      { text: "Daily", score: 5 },
      { text: "Several times per week", score: 4 },
      { text: "Weekly", score: 3 },
      { text: "Occasionally", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp089",
    category: "coping",
    dimension: "Time Management",
    question: "How well do you manage your personal time to reduce stress?",
    options: [
      { text: "Very well", score: 5 },
      { text: "Well", score: 4 },
      { text: "Moderately well", score: 3 },
      { text: "Poorly", score: 2 },
      { text: "Very poorly", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp090",
    category: "coping",
    dimension: "Adaptability",
    question: "How adaptable are you when facing unexpected changes or setbacks?",
    options: [
      { text: "Very adaptable", score: 5 },
      { text: "Adaptable", score: 4 },
      { text: "Moderately adaptable", score: 3 },
      { text: "Not very adaptable", score: 2 },
      { text: "Not adaptable at all", score: 1 }
    ],
    priority: "medium"
  },

  // OVERALL WELLBEING (12 questions)
  {
    id: "bp091",
    category: "wellbeing",
    dimension: "Life Satisfaction",
    question: "How satisfied are you with your overall quality of life?",
    options: [
      { text: "Very satisfied", score: 5 },
      { text: "Satisfied", score: 4 },
      { text: "Neutral", score: 3 },
      { text: "Dissatisfied", score: 2 },
      { text: "Very dissatisfied", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp092",
    category: "wellbeing",
    dimension: "Energy Levels",
    question: "How would you rate your overall energy levels?",
    options: [
      { text: "Very high energy", score: 5 },
      { text: "High energy", score: 4 },
      { text: "Moderate energy", score: 3 },
      { text: "Low energy", score: 2 },
      { text: "Very low energy", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp093",
    category: "wellbeing",
    dimension: "Mental Health",
    question: "How would you rate your current mental health?",
    options: [
      { text: "Excellent", score: 5 },
      { text: "Good", score: 4 },
      { text: "Fair", score: 3 },
      { text: "Poor", score: 2 },
      { text: "Very poor", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp094",
    category: "wellbeing",
    dimension: "Optimism",
    question: "How optimistic do you feel about your future?",
    options: [
      { text: "Very optimistic", score: 5 },
      { text: "Optimistic", score: 4 },
      { text: "Neutral", score: 3 },
      { text: "Pessimistic", score: 2 },
      { text: "Very pessimistic", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp095",
    category: "wellbeing",
    dimension: "Purpose Sense",
    question: "How strong is your sense of purpose and meaning in life?",
    options: [
      { text: "Very strong", score: 5 },
      { text: "Strong", score: 4 },
      { text: "Moderate", score: 3 },
      { text: "Weak", score: 2 },
      { text: "Very weak", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp096",
    category: "wellbeing",
    dimension: "Self-Efficacy",
    question: "How confident are you in your ability to handle life's challenges?",
    options: [
      { text: "Very confident", score: 5 },
      { text: "Confident", score: 4 },
      { text: "Moderately confident", score: 3 },
      { text: "Not confident", score: 2 },
      { text: "Not confident at all", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp097",
    category: "wellbeing",
    dimension: "Happiness",
    question: "How often do you feel genuinely happy?",
    options: [
      { text: "Very often", score: 5 },
      { text: "Often", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Rarely", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "high"
  },
  {
    id: "bp098",
    category: "wellbeing",
    dimension: "Peace of Mind",
    question: "How often do you feel at peace and content?",
    options: [
      { text: "Very often", score: 5 },
      { text: "Often", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Rarely", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp099",
    category: "wellbeing",
    dimension: "Fulfillment",
    question: "How fulfilled do you feel with your life choices?",
    options: [
      { text: "Very fulfilled", score: 5 },
      { text: "Fulfilled", score: 4 },
      { text: "Moderately fulfilled", score: 3 },
      { text: "Unfulfilled", score: 2 },
      { text: "Very unfulfilled", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp100",
    category: "wellbeing",
    dimension: "Future Outlook",
    question: "How positive is your outlook for the next 12 months?",
    options: [
      { text: "Very positive", score: 5 },
      { text: "Positive", score: 4 },
      { text: "Neutral", score: 3 },
      { text: "Negative", score: 2 },
      { text: "Very negative", score: 1 }
    ],
    priority: "medium"
  },
  {
    id: "bp101",
    category: "wellbeing",
    dimension: "Gratitude",
    question: "How often do you feel grateful and appreciative?",
    options: [
      { text: "Very often", score: 5 },
      { text: "Often", score: 4 },
      { text: "Sometimes", score: 3 },
      { text: "Rarely", score: 2 },
      { text: "Never", score: 1 }
    ],
    priority: "low"
  },
  {
    id: "bp102",
    category: "wellbeing",
    dimension: "Life Control",
    question: "How much control do you feel you have over your life direction?",
    options: [
      { text: "Complete control", score: 5 },
      { text: "Good control", score: 4 },
      { text: "Some control", score: 3 },
      { text: "Little control", score: 2 },
      { text: "No control", score: 1 }
    ],
    priority: "high"
  }
];

// Risk levels for scoring interpretation
export const burnoutRiskLevels = [
  {
    name: "Optimal Wellbeing",
    range: { min: 400, max: 510 },
    description: "Excellent burnout resilience with strong protective factors",
    characteristics: [
      "Manageable workload with clear priorities",
      "High energy and motivation",
      "Strong sense of accomplishment",
      "Excellent social support systems",
      "Healthy work-life balance",
      "Effective coping strategies",
      "High overall wellbeing"
    ],
    developmentAreas: [
      "Maintain current positive practices",
      "Continue regular self-assessment",
      "Consider mentoring others",
      "Stay vigilant for early warning signs"
    ],
    color: "bg-green-600"
  },
  {
    name: "Good Resilience",
    range: { min: 325, max: 399 },
    description: "Good burnout protection with minor areas for improvement",
    characteristics: [
      "Generally manageable workload",
      "Good energy levels most days",
      "Adequate social support",
      "Reasonable work-life balance",
      "Some effective coping strategies"
    ],
    developmentAreas: [
      "Strengthen weakest protective factors",
      "Enhance stress management skills",
      "Build stronger support networks",
      "Improve work-life boundaries"
    ],
    color: "bg-blue-500"
  },
  {
    name: "Moderate Risk",
    range: { min: 250, max: 324 },
    description: "Some burnout vulnerability - prevention strategies needed",
    characteristics: [
      "Occasionally overwhelming workload",
      "Variable energy levels",
      "Mixed sense of accomplishment",
      "Adequate but inconsistent support",
      "Some work-life balance challenges"
    ],
    developmentAreas: [
      "Develop better workload management",
      "Strengthen coping strategies",
      "Improve social support systems",
      "Focus on self-care practices",
      "Consider professional guidance"
    ],
    color: "bg-yellow-500"
  },
  {
    name: "High Risk",
    range: { min: 175, max: 249 },
    description: "Significant burnout risk - intervention recommended",
    characteristics: [
      "Frequently overwhelming workload",
      "Low energy and motivation",
      "Diminished sense of accomplishment",
      "Limited social support",
      "Poor work-life balance",
      "Ineffective coping strategies"
    ],
    developmentAreas: [
      "Immediate workload assessment and adjustment",
      "Professional stress management support",
      "Strengthen support networks",
      "Establish better boundaries",
      "Consider role or environment changes"
    ],
    color: "bg-orange-500"
  },
  {
    name: "Critical Risk",
    range: { min: 102, max: 174 },
    description: "Severe burnout risk - immediate intervention required",
    characteristics: [
      "Severe workload overwhelm",
      "Chronic emotional exhaustion",
      "Minimal sense of accomplishment",
      "Poor social support systems",
      "Complete work-life imbalance",
      "Maladaptive coping strategies"
    ],
    developmentAreas: [
      "Immediate professional mental health support",
      "Workplace accommodation or leave consideration",
      "Comprehensive lifestyle and work changes",
      "Medical evaluation if needed",
      "Crisis intervention resources"
    ],
    color: "bg-red-600"
  }
];