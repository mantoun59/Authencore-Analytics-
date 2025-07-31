// Professional Communication Competencies Assessment Questions
export const communicationCompetencyQuestions = [
  // Direct vs Indirect Communication (Questions 1-8)
  {
    id: 1,
    text: "When you need to address a performance issue with a colleague, you typically:",
    type: "multiple_choice",
    options: [
      { text: "A) Address the issue directly and specifically in a private conversation", value: 0, effectiveness: 4 },
      { text: "B) Hint at the issue through indirect comments and suggestions", value: 1, effectiveness: 3 },
      { text: "C) Discuss the issue with others first to get their perspective", value: 2, effectiveness: 3 },
      { text: "D) Wait and hope the issue resolves itself naturally", value: 3, effectiveness: 2 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 2,
    text: "In a team meeting when you disagree with a proposed solution, you:",
    type: "multiple_choice",
    options: [
      { text: "A) Immediately express your concerns with specific alternatives", value: 0, effectiveness: 4 },
      { text: "B) Ask probing questions to guide others to see potential issues", value: 1, effectiveness: 2 },
      { text: "C) Express general concerns without specific disagreement", value: 2, effectiveness: 3 },
      { text: "D) Stay quiet and address concerns privately with the leader later", value: 3, effectiveness: 3 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 3,
    text: "When giving feedback on a project, your approach is to:",
    type: "multiple_choice",
    options: [
      { text: "A) Provide specific, actionable feedback with clear examples", value: 0, effectiveness: 3 },
      { text: "B) Focus on positive aspects first, then gently introduce concerns", value: 1, effectiveness: 4 },
      { text: "C) Offer general impressions and let them ask for specifics", value: 2, effectiveness: 3 },
      { text: "D) Provide written feedback to avoid potential confrontation", value: 3, effectiveness: 2 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 4,
    text: "When setting expectations with your team, you prefer to:",
    type: "multiple_choice",
    options: [
      { text: "A) Clearly state specific deliverables, deadlines, and quality standards", value: 0, effectiveness: 4 },
      { text: "B) Provide general guidance and trust them to figure out details", value: 1, effectiveness: 2 },
      { text: "C) Share your vision and let them propose their own expectations", value: 2, effectiveness: 3 },
      { text: "D) Give examples of past successful projects as guidance", value: 3, effectiveness: 3 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 5,
    text: "If someone asks for your honest opinion about their idea, you:",
    type: "multiple_choice",
    options: [
      { text: "A) Give direct, honest feedback even if it might be difficult to hear", value: 0, effectiveness: 4 },
      { text: "B) Focus on the positive aspects while diplomatically noting concerns", value: 1, effectiveness: 3 },
      { text: "C) Ask questions to help them evaluate their own idea", value: 2, effectiveness: 3 },
      { text: "D) Provide encouraging support while avoiding potential criticism", value: 3, effectiveness: 2 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 6,
    text: "When communicating urgency about a deadline, you:",
    type: "multiple_choice",
    options: [
      { text: "A) Clearly state the deadline and consequences of missing it", value: 0, effectiveness: 3 },
      { text: "B) Emphasize importance while providing context and flexibility", value: 1, effectiveness: 3 },
      { text: "C) Express the urgency and ask them to prioritize accordingly", value: 2, effectiveness: 4 },
      { text: "D) Mention the deadline and trust they'll understand the priority", value: 3, effectiveness: 2 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 7,
    text: "Your preferred way to handle miscommunication is to:",
    type: "multiple_choice",
    options: [
      { text: "A) Address it immediately and clarify what you meant to communicate", value: 0, effectiveness: 4 },
      { text: "B) Circle back later to ensure understanding and clear up confusion", value: 1, effectiveness: 3 },
      { text: "C) Provide additional context and examples to clarify your point", value: 2, effectiveness: 3 },
      { text: "D) Let it resolve naturally through future interactions", value: 3, effectiveness: 3 }
    ],
    dimension: "direct_indirect"
  },
  {
    id: 8,
    text: "When declining a request, your typical approach is:",
    type: "multiple_choice",
    options: [
      { text: "A) Clearly state you cannot do it and explain why", value: 0, effectiveness: 3 },
      { text: "B) Decline politely while offering alternative solutions or compromises", value: 1, effectiveness: 3 },
      { text: "C) Explain the constraints and let them decide if they want to modify the request", value: 2, effectiveness: 4 },
      { text: "D) Suggest they might want to find someone else who can help", value: 3, effectiveness: 2 }
    ],
    dimension: "direct_indirect"
  },

  // Formal vs Informal Communication (Questions 9-15)
  {
    id: 9,
    text: "In client communications, your style tends to be:",
    type: "multiple_choice",
    options: [
      { text: "A) Professional and structured with formal language and clear protocols", value: 0, effectiveness: 4 },
      { text: "B) Professional but approachable with some personal connection", value: 1, effectiveness: 3 },
      { text: "C) Friendly and conversational while maintaining professionalism", value: 2, effectiveness: 3 },
      { text: "D) Casual and personal to build strong relationships", value: 3, effectiveness: 3 }
    ],
    dimension: "formal_informal"
  },
  {
    id: 10,
    text: "When presenting to senior leadership, you prefer to:",
    type: "multiple_choice",
    options: [
      { text: "A) Use formal presentation structure with detailed documentation", value: 0, effectiveness: 2 },
      { text: "B) Balance structure with conversational elements and storytelling", value: 1, effectiveness: 3 },
      { text: "C) Focus on engaging dialogue with flexible agenda", value: 2, effectiveness: 3 },
      { text: "D) Create an interactive, informal discussion format", value: 3, effectiveness: 4 }
    ],
    dimension: "formal_informal"
  },
  {
    id: 11,
    text: "Your email communication style is typically:",
    type: "multiple_choice",
    options: [
      { text: "A) Formal with proper salutations, structured content, and professional closings", value: 0, effectiveness: 3 },
      { text: "B) Professional but concise with clear subject lines and action items", value: 1, effectiveness: 4 },
      { text: "C) Friendly and conversational with professional content", value: 2, effectiveness: 3 },
      { text: "D) Brief and informal, similar to text messaging", value: 3, effectiveness: 2 }
    ],
    dimension: "formal_informal"
  },
  {
    id: 12,
    text: "During team brainstorming sessions, you tend to:",
    type: "multiple_choice",
    options: [
      { text: "A) Follow structured processes with organized idea capture", value: 0, effectiveness: 3 },
      { text: "B) Balance structure with creative freedom and open discussion", value: 1, effectiveness: 4 },
      { text: "C) Encourage free-flowing conversation with minimal structure", value: 2, effectiveness: 3 },
      { text: "D) Keep things loose and spontaneous for maximum creativity", value: 3, effectiveness: 3 }
    ],
    dimension: "formal_informal"
  },
  {
    id: 13,
    text: "When building relationships with new colleagues, you:",
    type: "multiple_choice",
    options: [
      { text: "A) Maintain professional boundaries and focus on work-related interactions", value: 0, effectiveness: 2 },
      { text: "B) Gradually build personal connections through work-related conversations", value: 1, effectiveness: 4 },
      { text: "C) Actively seek to learn about their interests and share your own", value: 2, effectiveness: 3 },
      { text: "D) Quickly move to personal topics and informal interactions", value: 3, effectiveness: 3 }
    ],
    dimension: "formal_informal"
  },
  {
    id: 14,
    text: "Your approach to documentation and record-keeping is:",
    type: "multiple_choice",
    options: [
      { text: "A) Comprehensive and formal with detailed records and proper formatting", value: 0, effectiveness: 3 },
      { text: "B) Thorough but practical with clear organization and easy access", value: 1, effectiveness: 3 },
      { text: "C) Focused on key points with informal but clear documentation", value: 2, effectiveness: 4 },
      { text: "D) Minimal documentation with preference for verbal communication", value: 3, effectiveness: 3 }
    ],
    dimension: "formal_informal"
  },
  {
    id: 15,
    text: "When conducting performance reviews or feedback sessions, you prefer:",
    type: "multiple_choice",
    options: [
      { text: "A) Structured format with formal evaluation criteria and documentation", value: 0, effectiveness: 3 },
      { text: "B) Organized discussion with prepared topics but flexible conversation", value: 1, effectiveness: 3 },
      { text: "C) Conversational approach with informal check-ins and open dialogue", value: 2, effectiveness: 4 },
      { text: "D) Casual conversations integrated into regular work interactions", value: 3, effectiveness: 3 }
    ],
    dimension: "formal_informal"
  },

  // Expressive vs Reserved Communication (Questions 16-23)
  {
    id: 16,
    text: "When sharing your ideas in a group setting, you typically:",
    type: "multiple_choice",
    options: [
      { text: "A) Share enthusiastically with detailed explanations and examples", value: 0, effectiveness: 4 },
      { text: "B) Present ideas clearly with appropriate energy and supporting details", value: 1, effectiveness: 3 },
      { text: "C) Offer ideas thoughtfully with measured tone and concise explanation", value: 2, effectiveness: 3 },
      { text: "D) Share briefly and let others ask questions if they want more detail", value: 3, effectiveness: 3 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 17,
    text: "Your body language and vocal expression during presentations tends to be:",
    type: "multiple_choice",
    options: [
      { text: "A) Animated with varied gestures, vocal inflection, and dynamic movement", value: 0, effectiveness: 3 },
      { text: "B) Engaging with purposeful gestures and clear vocal variety", value: 1, effectiveness: 3 },
      { text: "C) Professional with controlled gestures and steady vocal tone", value: 2, effectiveness: 4 },
      { text: "D) Reserved with minimal gestures and consistent, calm delivery", value: 3, effectiveness: 3 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 18,
    text: "When you're excited about a project or achievement, you:",
    type: "multiple_choice",
    options: [
      { text: "A) Share your enthusiasm openly and encourage others to get excited too", value: 0, effectiveness: 3 },
      { text: "B) Express positive energy while gauging others' interest levels", value: 1, effectiveness: 4 },
      { text: "C) Share your satisfaction in a measured way with focus on the results", value: 2, effectiveness: 3 },
      { text: "D) Keep your enthusiasm private and focus on the practical outcomes", value: 3, effectiveness: 2 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 19,
    text: "Your storytelling style when sharing examples or experiences is:",
    type: "multiple_choice",
    options: [
      { text: "A) Detailed and vivid with colorful descriptions and emotional context", value: 0, effectiveness: 4 },
      { text: "B) Engaging with relevant details and clear connection to the point", value: 1, effectiveness: 3 },
      { text: "C) Concise with key facts and straightforward narrative", value: 2, effectiveness: 3 },
      { text: "D) Brief and factual with minimal elaboration", value: 3, effectiveness: 2 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 20,
    text: "When facilitating meetings, your energy and engagement style is:",
    type: "multiple_choice",
    options: [
      { text: "A) High energy with interactive elements and enthusiastic participation", value: 0, effectiveness: 3 },
      { text: "B) Appropriately energetic with good pace and engaging discussion", value: 1, effectiveness: 3 },
      { text: "C) Professional and steady with clear structure and controlled pace", value: 2, effectiveness: 4 },
      { text: "D) Calm and measured with focus on efficient information exchange", value: 3, effectiveness: 2 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 21,
    text: "Your approach to celebrating team successes is to:",
    type: "multiple_choice",
    options: [
      { text: "A) Organize enthusiastic celebrations and make sure everyone feels appreciated", value: 0, effectiveness: 3 },
      { text: "B) Acknowledge achievements meaningfully with appropriate recognition", value: 1, effectiveness: 4 },
      { text: "C) Provide sincere acknowledgment and focus on lessons learned", value: 2, effectiveness: 3 },
      { text: "D) Quietly appreciate the accomplishment and move forward to next goals", value: 3, effectiveness: 3 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 22,
    text: "When explaining complex concepts, you tend to:",
    type: "multiple_choice",
    options: [
      { text: "A) Use multiple examples, analogies, and interactive explanations", value: 0, effectiveness: 3 },
      { text: "B) Provide clear explanations with relevant examples and check understanding", value: 1, effectiveness: 3 },
      { text: "C) Give structured, logical explanations with supporting facts", value: 2, effectiveness: 4 },
      { text: "D) Present information systematically and let people ask questions", value: 3, effectiveness: 3 }
    ],
    dimension: "expressive_reserved"
  },
  {
    id: 23,
    text: "Your natural reaction to unexpected challenges during meetings is to:",
    type: "multiple_choice",
    options: [
      { text: "A) Address them dynamically with creative problem-solving and group energy", value: 0, effectiveness: 3 },
      { text: "B) Adapt flexibly while maintaining positive momentum and focus", value: 1, effectiveness: 4 },
      { text: "C) Handle them systematically with calm analysis and structured approach", value: 2, effectiveness: 3 },
      { text: "D) Address them quietly and efficiently with minimal disruption", value: 3, effectiveness: 3 }
    ],
    dimension: "expressive_reserved"
  },

  // Task vs Relationship Focus (Questions 24-30)
  {
    id: 24,
    text: "At the start of a new project, you prioritize:",
    type: "multiple_choice",
    options: [
      { text: "A) Defining clear objectives, timelines, and deliverables", value: 0, effectiveness: 2 },
      { text: "B) Understanding team dynamics and individual working styles", value: 1, effectiveness: 4 },
      { text: "C) Balancing project requirements with team relationship building", value: 2, effectiveness: 3 },
      { text: "D) Establishing efficient processes and resource allocation", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  },
  {
    id: 25,
    text: "When conflicts arise in your team, you first focus on:",
    type: "multiple_choice",
    options: [
      { text: "A) Understanding the underlying relationship dynamics and emotions", value: 0, effectiveness: 2 },
      { text: "B) Identifying the specific issues and finding mutually acceptable solutions", value: 1, effectiveness: 3 },
      { text: "C) Ensuring the conflict doesn't impact project deadlines and deliverables", value: 2, effectiveness: 4 },
      { text: "D) Facilitating communication to restore working relationships", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  },
  {
    id: 26,
    text: "Your primary concern during team meetings is typically:",
    type: "multiple_choice",
    options: [
      { text: "A) Ensuring everyone feels heard and valued in the discussion", value: 0, effectiveness: 3 },
      { text: "B) Balancing inclusive participation with productive outcomes", value: 1, effectiveness: 4 },
      { text: "C) Covering all agenda items efficiently and making necessary decisions", value: 2, effectiveness: 3 },
      { text: "D) Achieving specific objectives and maintaining forward momentum", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  },
  {
    id: 27,
    text: "When providing performance feedback, you emphasize:",
    type: "multiple_choice",
    options: [
      { text: "A) Personal growth, development opportunities, and individual strengths", value: 0, effectiveness: 2 },
      { text: "B) Both personal development and specific performance improvements", value: 1, effectiveness: 3 },
      { text: "C) Specific results, goal achievement, and areas for improvement", value: 2, effectiveness: 4 },
      { text: "D) Clear performance standards and measurable outcomes", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  },
  {
    id: 28,
    text: "Your approach to motivating team members involves:",
    type: "multiple_choice",
    options: [
      { text: "A) Understanding individual motivations and personal career goals", value: 0, effectiveness: 3 },
      { text: "B) Connecting personal interests with team objectives and recognition", value: 1, effectiveness: 4 },
      { text: "C) Setting clear expectations and providing tools for success", value: 2, effectiveness: 3 },
      { text: "D) Establishing challenging goals and tracking progress systematically", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  },
  {
    id: 29,
    text: "When delegating tasks, you focus most on:",
    type: "multiple_choice",
    options: [
      { text: "A) Matching tasks to individual interests and development needs", value: 0, effectiveness: 3 },
      { text: "B) Considering both individual capabilities and task requirements", value: 1, effectiveness: 4 },
      { text: "C) Ensuring optimal task distribution for project efficiency", value: 2, effectiveness: 3 },
      { text: "D) Assigning based on skills, availability, and deadlines", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  },
  {
    id: 30,
    text: "Your definition of successful team communication includes:",
    type: "multiple_choice",
    options: [
      { text: "A) Strong interpersonal relationships and high team satisfaction", value: 0, effectiveness: 3 },
      { text: "B) Both positive team dynamics and effective information sharing", value: 1, effectiveness: 3 },
      { text: "C) Clear information flow and efficient decision-making processes", value: 2, effectiveness: 4 },
      { text: "D) Precise communication that drives results and meets objectives", value: 3, effectiveness: 3 }
    ],
    dimension: "task_relationship"
  }
];

export const communicationCompetencyInfo = {
  title: "Professional Communication Competencies",
  description: "Evaluate your communication effectiveness across various professional contexts and identify opportunities for growth.",
  duration: "12 minutes",
  questionCount: 30,
  dimensions: [
    {
      name: "Direct vs Indirect",
      description: "Your preference for straightforward versus diplomatic communication approaches"
    },
    {
      name: "Formal vs Informal",
      description: "Your comfort level with structured versus casual communication styles"
    },
    {
      name: "Expressive vs Reserved",
      description: "Your tendency toward animated versus controlled communication expression"
    },
    {
      name: "Task vs Relationship",
      description: "Your focus on objectives versus interpersonal connections in communication"
    }
  ]
};