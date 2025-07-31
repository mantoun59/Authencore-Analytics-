// Technology Integration & Boundary Management Assessment Questions
export const technologyIntegrationQuestions = [
  // Usage Patterns (Questions 1-6)
  {
    id: 1,
    text: "How often do you check your work email outside of normal business hours?",
    type: "scale",
    options: [
      { text: "Never", value: 1 },
      { text: "Rarely (once a week or less)", value: 2 },
      { text: "Sometimes (2-3 times per week)", value: 3 },
      { text: "Often (daily)", value: 4 },
      { text: "Constantly (multiple times per day)", value: 5 }
    ],
    dimension: "usage_patterns"
  },
  {
    id: 2,
    text: "When using technology for work, I feel most productive when:",
    type: "scale",
    options: [
      { text: "Using minimal technology with focused single-tasking", value: 5 },
      { text: "Using essential tools with limited multitasking", value: 4 },
      { text: "Balancing multiple apps and moderate multitasking", value: 3 },
      { text: "Juggling many applications and heavy multitasking", value: 2 },
      { text: "Having all possible tech tools and constant connectivity", value: 1 }
    ],
    dimension: "usage_patterns"
  },
  {
    id: 3,
    text: "How do you typically handle technology notifications during focused work time?",
    type: "scale",
    options: [
      { text: "Turn off all notifications completely", value: 5 },
      { text: "Allow only urgent/critical notifications", value: 4 },
      { text: "Check notifications at scheduled intervals", value: 3 },
      { text: "Respond to most notifications as they come", value: 2 },
      { text: "Always have notifications on and respond immediately", value: 1 }
    ],
    dimension: "usage_patterns"
  },
  {
    id: 4,
    text: "Your approach to learning new workplace technology is:",
    type: "scale",
    options: [
      { text: "Eager early adopter - I try everything immediately", value: 3 },
      { text: "Selective adopter - I evaluate before implementing", value: 5 },
      { text: "Cautious adopter - I wait to see how others use it first", value: 4 },
      { text: "Reluctant adopter - I use it only when required", value: 2 },
      { text: "Resistant adopter - I avoid new technology when possible", value: 1 }
    ],
    dimension: "usage_patterns"
  },
  {
    id: 5,
    text: "How often do you find yourself using personal devices for work tasks?",
    type: "scale",
    options: [
      { text: "Never - I maintain strict separation", value: 5 },
      { text: "Rarely - Only for urgent situations", value: 4 },
      { text: "Sometimes - For convenience or when necessary", value: 3 },
      { text: "Often - It's part of my regular workflow", value: 2 },
      { text: "Always - I seamlessly blend personal and work technology", value: 1 }
    ],
    dimension: "usage_patterns"
  },
  {
    id: 6,
    text: "When technology fails or malfunctions during important work, you typically:",
    type: "scale",
    options: [
      { text: "Have pre-planned backup systems and alternative workflows", value: 5 },
      { text: "Quickly adapt and find alternative solutions", value: 4 },
      { text: "Experience some disruption but recover reasonably well", value: 3 },
      { text: "Feel frustrated and struggle to maintain productivity", value: 2 },
      { text: "Become significantly stressed and unable to work effectively", value: 1 }
    ],
    dimension: "usage_patterns"
  },

  // Digital Boundaries (Questions 7-12)
  {
    id: 7,
    text: "I have established clear rules about when I will and won't use work technology:",
    type: "scale",
    options: [
      { text: "Strongly Agree - I have very clear, consistent boundaries", value: 5 },
      { text: "Agree - I have mostly clear boundaries with some flexibility", value: 4 },
      { text: "Neutral - I have some boundaries but they're not always consistent", value: 3 },
      { text: "Disagree - My boundaries are unclear or frequently change", value: 2 },
      { text: "Strongly Disagree - I have no clear boundaries", value: 1 }
    ],
    dimension: "digital_boundaries"
  },
  {
    id: 8,
    text: "How well do you maintain separation between personal and professional digital spaces?",
    type: "scale",
    options: [
      { text: "Excellent - Complete separation with dedicated devices/accounts", value: 5 },
      { text: "Good - Mostly separate with clear organizational systems", value: 4 },
      { text: "Moderate - Some mixing but generally well-organized", value: 3 },
      { text: "Poor - Frequent mixing with minimal organization", value: 2 },
      { text: "Very Poor - Everything is completely mixed together", value: 1 }
    ],
    dimension: "digital_boundaries"
  },
  {
    id: 9,
    text: "When colleagues contact me through technology outside work hours:",
    type: "scale",
    options: [
      { text: "I respond only to true emergencies, others wait until business hours", value: 5 },
      { text: "I acknowledge receipt but provide full responses during work hours", value: 4 },
      { text: "I provide brief responses and handle fully during work hours", value: 3 },
      { text: "I usually respond fully regardless of the time", value: 2 },
      { text: "I feel obligated to respond immediately and comprehensively", value: 1 }
    ],
    dimension: "digital_boundaries"
  },
  {
    id: 10,
    text: "My family/friends respect my technology boundaries for work:",
    type: "scale",
    options: [
      { text: "Always - They fully understand and support my boundaries", value: 5 },
      { text: "Usually - They generally respect boundaries with rare exceptions", value: 4 },
      { text: "Sometimes - They understand but occasionally interrupt", value: 3 },
      { text: "Rarely - They often don't respect my technology boundaries", value: 2 },
      { text: "Never - There's constant conflict over technology use", value: 1 }
    ],
    dimension: "digital_boundaries"
  },
  {
    id: 11,
    text: "I feel comfortable saying 'no' to technology-related requests that fall outside my boundaries:",
    type: "scale",
    options: [
      { text: "Very Comfortable - I confidently maintain my boundaries", value: 5 },
      { text: "Comfortable - I can say no with minimal difficulty", value: 4 },
      { text: "Somewhat Comfortable - I can say no but feel some guilt", value: 3 },
      { text: "Uncomfortable - I struggle to say no and often compromise", value: 2 },
      { text: "Very Uncomfortable - I almost never say no, even when I should", value: 1 }
    ],
    dimension: "digital_boundaries"
  },
  {
    id: 12,
    text: "How often do you take deliberate breaks from work-related technology?",
    type: "scale",
    options: [
      { text: "Daily - I have regular tech-free periods every day", value: 5 },
      { text: "Several times a week - I regularly schedule tech breaks", value: 4 },
      { text: "Weekly - I take at least one day with minimal work tech", value: 3 },
      { text: "Monthly - I occasionally take extended breaks from work tech", value: 2 },
      { text: "Rarely/Never - I'm almost always connected to work technology", value: 1 }
    ],
    dimension: "digital_boundaries"
  },

  // Tech-Life Balance (Questions 13-19)
  {
    id: 13,
    text: "Technology helps me maintain a healthy work-life balance:",
    type: "scale",
    options: [
      { text: "Strongly Agree - Technology significantly enhances my balance", value: 5 },
      { text: "Agree - Technology generally helps with balance", value: 4 },
      { text: "Neutral - Technology has mixed effects on my balance", value: 3 },
      { text: "Disagree - Technology generally hurts my balance", value: 2 },
      { text: "Strongly Disagree - Technology significantly disrupts my balance", value: 1 }
    ],
    dimension: "tech_life_balance"
  },
  {
    id: 14,
    text: "How often does work technology use interfere with your personal relationships?",
    type: "scale",
    options: [
      { text: "Never - Technology never impacts my personal relationships", value: 5 },
      { text: "Rarely - Very minimal interference with relationships", value: 4 },
      { text: "Sometimes - Occasional interference but manageable", value: 3 },
      { text: "Often - Regular interference that causes some tension", value: 2 },
      { text: "Always - Constant interference causing significant relationship issues", value: 1 }
    ],
    dimension: "tech_life_balance"
  },
  {
    id: 15,
    text: "I can easily disconnect from work technology when I want to focus on personal activities:",
    type: "scale",
    options: [
      { text: "Always - I can completely disconnect without any difficulty", value: 5 },
      { text: "Usually - I can disconnect with minimal effort most of the time", value: 4 },
      { text: "Sometimes - I can disconnect but it requires conscious effort", value: 3 },
      { text: "Rarely - I struggle to disconnect and often think about work", value: 2 },
      { text: "Never - I feel unable to truly disconnect from work technology", value: 1 }
    ],
    dimension: "tech_life_balance"
  },
  {
    id: 16,
    text: "The physical setup of my technology supports both work productivity and personal well-being:",
    type: "scale",
    options: [
      { text: "Excellent - My setup perfectly balances productivity and well-being", value: 5 },
      { text: "Good - My setup generally supports both needs well", value: 4 },
      { text: "Adequate - My setup works but could be improved", value: 3 },
      { text: "Poor - My setup favors one area at the expense of the other", value: 2 },
      { text: "Very Poor - My setup creates problems for both productivity and well-being", value: 1 }
    ],
    dimension: "tech_life_balance"
  },
  {
    id: 17,
    text: "How well do you manage technology-related stress?",
    type: "scale",
    options: [
      { text: "Excellently - I have effective strategies and rarely feel tech stress", value: 5 },
      { text: "Well - I manage tech stress effectively most of the time", value: 4 },
      { text: "Adequately - I cope with tech stress but it's sometimes challenging", value: 3 },
      { text: "Poorly - I struggle with tech stress and it affects me regularly", value: 2 },
      { text: "Very Poorly - Tech stress significantly impacts my daily life", value: 1 }
    ],
    dimension: "tech_life_balance"
  },
  {
    id: 18,
    text: "My use of work technology aligns with my personal values and priorities:",
    type: "scale",
    options: [
      { text: "Completely - Perfect alignment with values and priorities", value: 5 },
      { text: "Mostly - Generally good alignment with minor compromises", value: 4 },
      { text: "Somewhat - Moderate alignment but some conflicts exist", value: 3 },
      { text: "Minimally - Frequent conflicts between tech use and values", value: 2 },
      { text: "Not at all - Major conflicts between tech use and personal values", value: 1 }
    ],
    dimension: "tech_life_balance"
  },
  {
    id: 19,
    text: "I feel in control of my technology use rather than controlled by it:",
    type: "scale",
    options: [
      { text: "Always - I have complete control over my technology use", value: 5 },
      { text: "Usually - I generally feel in control with occasional lapses", value: 4 },
      { text: "Sometimes - I feel in control about half the time", value: 3 },
      { text: "Rarely - I often feel controlled by technology", value: 2 },
      { text: "Never - I feel completely controlled by technology", value: 1 }
    ],
    dimension: "tech_life_balance"
  },

  // Productivity Impact (Questions 20-25)
  {
    id: 20,
    text: "Technology enhances my ability to accomplish meaningful work:",
    type: "scale",
    options: [
      { text: "Strongly Agree - Technology significantly amplifies my meaningful work", value: 5 },
      { text: "Agree - Technology generally enhances my meaningful work", value: 4 },
      { text: "Neutral - Technology has mixed impact on meaningful work", value: 3 },
      { text: "Disagree - Technology often hinders my meaningful work", value: 2 },
      { text: "Strongly Disagree - Technology significantly interferes with meaningful work", value: 1 }
    ],
    dimension: "productivity_impact"
  },
  {
    id: 21,
    text: "How often does technology create unnecessary complexity in your work processes?",
    type: "scale",
    options: [
      { text: "Never - Technology always simplifies my work processes", value: 5 },
      { text: "Rarely - Technology occasionally adds complexity but usually helps", value: 4 },
      { text: "Sometimes - Technology creates moderate complexity that's manageable", value: 3 },
      { text: "Often - Technology frequently creates unnecessary complexity", value: 2 },
      { text: "Always - Technology constantly creates problematic complexity", value: 1 }
    ],
    dimension: "productivity_impact"
  },
  {
    id: 22,
    text: "I can maintain deep focus and concentration despite having access to multiple technologies:",
    type: "scale",
    options: [
      { text: "Always - Technology never impacts my ability to focus deeply", value: 5 },
      { text: "Usually - I can maintain focus despite tech distractions most of the time", value: 4 },
      { text: "Sometimes - I can focus but it requires effort to manage tech distractions", value: 3 },
      { text: "Rarely - I struggle to maintain focus with technology present", value: 2 },
      { text: "Never - Technology completely prevents me from focusing deeply", value: 1 }
    ],
    dimension: "productivity_impact"
  },
  {
    id: 23,
    text: "The time I spend managing technology (updates, troubleshooting, organizing) is:",
    type: "scale",
    options: [
      { text: "Minimal and well-invested - Very little time, high return", value: 5 },
      { text: "Reasonable and productive - Moderate time, good return", value: 4 },
      { text: "Acceptable but could be better - Fair amount of time, adequate return", value: 3 },
      { text: "Excessive for the benefits - Too much time, poor return", value: 2 },
      { text: "Overwhelming and counterproductive - Excessive time, negative return", value: 1 }
    ],
    dimension: "productivity_impact"
  },
  {
    id: 24,
    text: "Technology helps me collaborate more effectively with others:",
    type: "scale",
    options: [
      { text: "Strongly Agree - Technology dramatically improves my collaboration", value: 5 },
      { text: "Agree - Technology generally enhances my collaboration", value: 4 },
      { text: "Neutral - Technology has mixed effects on my collaboration", value: 3 },
      { text: "Disagree - Technology often hinders effective collaboration", value: 2 },
      { text: "Strongly Disagree - Technology significantly impairs my collaboration", value: 1 }
    ],
    dimension: "productivity_impact"
  },
  {
    id: 25,
    text: "Overall, my current technology integration strategy serves my professional goals:",
    type: "scale",
    options: [
      { text: "Excellently - My strategy perfectly supports all my professional goals", value: 5 },
      { text: "Well - My strategy generally supports my professional goals", value: 4 },
      { text: "Adequately - My strategy meets some goals but could be improved", value: 3 },
      { text: "Poorly - My strategy often conflicts with my professional goals", value: 2 },
      { text: "Very Poorly - My strategy significantly undermines my professional goals", value: 1 }
    ],
    dimension: "productivity_impact"
  }
];

export const technologyIntegrationInfo = {
  title: "Technology Integration & Boundary Management",
  description: "Assess your relationship with technology in the workplace and identify strategies for optimal integration.",
  duration: "10 minutes",
  questionCount: 25,
  dimensions: [
    {
      name: "Usage Patterns",
      description: "How you interact with and utilize technology in your daily work"
    },
    {
      name: "Digital Boundaries", 
      description: "Your ability to set and maintain healthy limits around technology use"
    },
    {
      name: "Tech-Life Balance",
      description: "How well you integrate technology while maintaining personal well-being"
    },
    {
      name: "Productivity Impact",
      description: "The effect of technology on your work effectiveness and goal achievement"
    }
  ]
};