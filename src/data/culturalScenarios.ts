export interface CulturalScenario {
  id: string;
  type: 'business_meeting' | 'email_communication' | 'negotiation' | 'team_conflict' | 'presentation_style';
  location: {
    country: string;
    city: string;
    flag: string;
  };
  industry: string;
  title: string;
  description: string;
  visual?: {
    type: 'image' | 'video';
    src: string;
  };
  culturalContext: string[];
  options: CulturalOption[];
  followUp?: {
    question: string;
    culturalInsight: string;
  };
  emailComponents?: {
    greetings: string[];
    approaches: EmailApproach[];
  };
}

export interface CulturalOption {
  text: string;
  cqScores: {
    drive: number;
    knowledge: number;
    strategy: number;
    action: number;
  };
  culturalAppropriateness: number;
  explanation: string;
}

export interface EmailApproach {
  style: string;
  text: string;
  appropriateness: number;
}

export interface CulturalChallenge {
  id: string;
  type: 'email_adaptation' | 'meeting_scheduling' | 'negotiation_simulation';
  originalContext?: string;
  originalMessage?: string;
  adaptationTargets?: AdaptationTarget[];
  scenario?: string;
  constraints?: string[];
  culturalFactors?: Record<string, CulturalFactor>;
}

export interface AdaptationTarget {
  country: string;
  hints: string[];
}

export interface CulturalFactor {
  workHours: string;
  preferences: string;
  avoid: string;
}

export const culturalScenarios: CulturalScenario[] = [
  {
    id: "cs001",
    type: "business_meeting",
    location: {
      country: "Japan",
      city: "Tokyo",
      flag: "🇯🇵"
    },
    industry: "Technology",
    title: "First Meeting with Japanese Partners",
    description: "You're meeting with potential Japanese partners for your tech startup. As you enter the conference room, three executives stand and bow. The senior executive, Mr. Tanaka, approaches you.",
    visual: {
      type: "image",
      src: "/placeholder.svg?height=300&width=500"
    },
    culturalContext: [
      "Business card exchange (meishi) is ritualistic in Japan",
      "Hierarchy and seniority are highly respected",
      "Initial meetings focus on relationship building, not immediate business"
    ],
    options: [
      {
        text: "Offer a firm handshake and immediately hand out your business cards with one hand while introducing your company",
        cqScores: {
          drive: 2,
          knowledge: 1,
          strategy: 1,
          action: 1
        },
        culturalAppropriateness: 0.2,
        explanation: "This approach shows low cultural awareness. In Japan, business cards should be presented with both hands, and rushing into business is considered rude."
      },
      {
        text: "Return the bow, then present your business card with both hands while slightly bowing again",
        cqScores: {
          drive: 4,
          knowledge: 5,
          strategy: 4,
          action: 5
        },
        culturalAppropriateness: 0.95,
        explanation: "Excellent approach showing high cultural intelligence. This demonstrates respect for Japanese business etiquette."
      },
      {
        text: "Wait for them to initiate the greeting, then follow their lead exactly",
        cqScores: {
          drive: 3,
          knowledge: 3,
          strategy: 4,
          action: 3
        },
        culturalAppropriateness: 0.7,
        explanation: "Safe approach showing cultural sensitivity, though some initiative in showing cultural knowledge would be appreciated."
      },
      {
        text: "Bow deeply and say 'Konnichiwa', then wait in silence for them to guide the interaction",
        cqScores: {
          drive: 3,
          knowledge: 2,
          strategy: 2,
          action: 3
        },
        culturalAppropriateness: 0.5,
        explanation: "Shows effort but may be overly cautious. The deep bow might be excessive for this context."
      }
    ],
    followUp: {
      question: "How would you handle the business card you receive?",
      culturalInsight: "In Japan, business cards represent the person. Treating them carelessly is insulting."
    }
  },
  {
    id: "cs002",
    type: "email_communication",
    location: {
      country: "Germany",
      city: "Frankfurt",
      flag: "🇩🇪"
    },
    industry: "Finance",
    title: "Project Delay Email to German Client",
    description: "Your project is running two weeks behind schedule due to unexpected technical issues. You need to inform your German client, Frau Mueller, who values punctuality and precision.",
    culturalContext: [
      "Germans typically prefer direct, honest communication",
      "Punctuality and meeting deadlines are extremely important",
      "Detailed explanations and solutions are expected"
    ],
    options: [
      {
        text: "I hope this email finds you well. I wanted to touch base about our project timeline. Unfortunately, we've encountered some challenges...",
        cqScores: {
          drive: 2,
          knowledge: 2,
          strategy: 2,
          action: 2
        },
        culturalAppropriateness: 0.3,
        explanation: "Too indirect for German business culture. Germans prefer direct communication."
      },
      {
        text: "I am writing to inform you that the project will be delayed by two weeks due to technical issues discovered during testing phase.",
        cqScores: {
          drive: 4,
          knowledge: 5,
          strategy: 4,
          action: 4
        },
        culturalAppropriateness: 0.9,
        explanation: "Direct and factual approach that Germans appreciate. Clear about the delay and reason."
      },
      {
        text: "Due to circumstances beyond our control and vendor delays, we are experiencing some timeline adjustments...",
        cqScores: {
          drive: 1,
          knowledge: 1,
          strategy: 1,
          action: 1
        },
        culturalAppropriateness: 0.1,
        explanation: "Blame-shifting and vague language will frustrate German business partners."
      }
    ],
    emailComponents: {
      greetings: [
        "Dear Frau Mueller",
        "Hi Mueller",
        "Sehr geehrte Frau Mueller",
        "Hello Mrs. Mueller"
      ],
      approaches: [
        {
          style: "indirect_apologetic",
          text: "I hope this email finds you well. I wanted to touch base about our project timeline. Unfortunately, we've encountered some challenges...",
          appropriateness: 0.3
        },
        {
          style: "direct_factual",
          text: "I am writing to inform you that the project will be delayed by two weeks due to technical issues discovered during testing phase.",
          appropriateness: 0.9
        },
        {
          style: "blame_shifting",
          text: "Due to circumstances beyond our control and vendor delays, we are experiencing some timeline adjustments...",
          appropriateness: 0.1
        }
      ]
    }
  },
  {
    id: "cs003",
    type: "negotiation",
    location: {
      country: "Brazil",
      city: "São Paulo",
      flag: "🇧🇷"
    },
    industry: "Marketing",
    title: "Contract Negotiation with Brazilian Agency",
    description: "You're in São Paulo negotiating a marketing contract. After two hours of friendly conversation about football, family, and Brazilian culture, your counterpart, Roberto, still hasn't discussed business.",
    culturalContext: [
      "Brazilians prioritize relationship building before business",
      "Personal connections are crucial for successful business",
      "Rushing to business can be seen as rude and transactional"
    ],
    options: [
      {
        text: "Politely interrupt and say, 'This has been wonderful, but perhaps we should discuss the contract now?'",
        cqScores: {
          drive: 2,
          knowledge: 2,
          strategy: 2,
          action: 2
        },
        culturalAppropriateness: 0.3,
        explanation: "Too direct and may damage the relationship-building process that's crucial in Brazilian business."
      },
      {
        text: "Continue engaging in personal conversation, sharing your own stories and asking about his recommendations for your stay",
        cqScores: {
          drive: 4,
          knowledge: 4,
          strategy: 5,
          action: 4
        },
        culturalAppropriateness: 0.9,
        explanation: "Perfect approach for Brazilian business culture. Shows respect for relationship-building."
      },
      {
        text: "Start weaving business topics naturally into the personal conversation",
        cqScores: {
          drive: 4,
          knowledge: 4,
          strategy: 4,
          action: 4
        },
        culturalAppropriateness: 0.75,
        explanation: "Good middle ground that respects Brazilian culture while making progress."
      }
    ]
  },
  {
    id: "cs004",
    type: "team_conflict",
    location: {
      country: "India",
      city: "Bangalore",
      flag: "🇮🇳"
    },
    industry: "IT Services",
    title: "Managing Disagreement in Indian Team",
    description: "During a video call with your Indian development team, you notice that junior developer Priya seems to disagree with the technical approach but isn't speaking up directly, only giving subtle nonverbal cues.",
    culturalContext: [
      "Hierarchy is respected; juniors rarely contradict seniors openly",
      "Indirect communication is common to maintain harmony",
      "Reading between the lines is important"
    ],
    options: [
      {
        text: "Directly ask Priya: 'You seem to disagree. What's your opinion?'",
        cqScores: {
          drive: 3,
          knowledge: 2,
          strategy: 2,
          action: 2
        },
        culturalAppropriateness: 0.4,
        explanation: "Too direct; may cause embarrassment in front of seniors"
      },
      {
        text: "After the meeting, privately message Priya to ask for her thoughts",
        cqScores: {
          drive: 4,
          knowledge: 5,
          strategy: 5,
          action: 5
        },
        culturalAppropriateness: 0.95,
        explanation: "Excellent approach respecting hierarchy while getting valuable input"
      },
      {
        text: "Ask the team broadly: 'Are there any other approaches we should consider?'",
        cqScores: {
          drive: 3,
          knowledge: 4,
          strategy: 4,
          action: 3
        },
        culturalAppropriateness: 0.7,
        explanation: "Good middle ground allowing face-saving participation"
      }
    ]
  },
  {
    id: "cs005",
    type: "presentation_style",
    location: {
      country: "United Arab Emirates",
      city: "Dubai",
      flag: "🇦🇪"
    },
    industry: "Real Estate",
    title: "Presenting to Emirati Investors",
    description: "You're presenting your real estate technology platform to a group of Emirati investors. The meeting is scheduled during Ramadan, and it's 2 PM.",
    culturalContext: [
      "During Ramadan, Muslims fast from dawn to sunset",
      "Business pace may be different during Ramadan",
      "Showing cultural awareness is highly appreciated"
    ],
    options: [
      {
        text: "Proceed with your standard presentation and offer refreshments as usual",
        cqScores: {
          drive: 1,
          knowledge: 1,
          strategy: 1,
          action: 1
        },
        culturalAppropriateness: 0.1,
        explanation: "Shows complete lack of cultural awareness during Ramadan."
      },
      {
        text: "Acknowledge Ramadan, keep the presentation concise, and don't offer any food or drink",
        cqScores: {
          drive: 5,
          knowledge: 5,
          strategy: 5,
          action: 5
        },
        culturalAppropriateness: 0.95,
        explanation: "Perfect cultural sensitivity showing respect for Islamic practices."
      },
      {
        text: "Ask if they would prefer to reschedule after Iftar (evening meal)",
        cqScores: {
          drive: 4,
          knowledge: 4,
          strategy: 3,
          action: 3
        },
        culturalAppropriateness: 0.6,
        explanation: "Shows cultural awareness but may be unnecessary if they scheduled the meeting."
      }
    ]
  }
];

export const culturalChallenges: CulturalChallenge[] = [
  {
    id: "ch001",
    type: "email_adaptation",
    originalContext: "US_direct",
    originalMessage: "Hi Team,\n\nWe need to pivot our strategy immediately. The current approach isn't working, and we're burning through budget. I need everyone to submit new ideas by EOD tomorrow.\n\nNo excuses - this is critical.\n\nThanks,\nJohn",
    adaptationTargets: [
      {
        country: "Japan",
        hints: [
          "Soften direct criticism",
          "Use more collaborative language",
          "Avoid ultimatums",
          "Consider group harmony"
        ]
      },
      {
        country: "Brazil",
        hints: [
          "Add personal warmth",
          "Use more positive framing",
          "Include team encouragement",
          "Soften urgency with relationship focus"
        ]
      },
      {
        country: "Germany",
        hints: [
          "Add specific data/reasons",
          "Maintain directness but add logic",
          "Include detailed timeline",
          "Explain consequences clearly"
        ]
      }
    ]
  },
  {
    id: "ch002",
    type: "meeting_scheduling",
    scenario: "Schedule a project kickoff with team members in New York, London, Singapore, and São Paulo",
    constraints: [
      "Consider prayer times for Muslim team members",
      "Account for Brazilian preference for avoiding early morning meetings",
      "Respect European work-life balance (no late evenings)",
      "Consider Asian holidays and cultural events"
    ],
    culturalFactors: {
      Singapore: {
        workHours: "9:00-18:00",
        preferences: "Efficiency valued, punctual starts",
        avoid: "Chinese New Year period"
      },
      Brazil: {
        workHours: "10:00-19:00",
        preferences: "Relationship building time needed",
        avoid: "Carnival season, early mornings"
      },
      London: {
        workHours: "9:00-17:00",
        preferences: "Work-life balance respected",
        avoid: "Bank holidays, late evenings"
      },
      NewYork: {
        workHours: "9:00-18:00",
        preferences: "Direct communication, efficient meetings",
        avoid: "Major holidays"
      }
    }
  }
];

export const culturalDimensions = {
  hofstede: {
    powerDistance: {
      description: "Acceptance of unequal power distribution",
      lowCountries: ["Denmark", "New Zealand", "Austria"],
      highCountries: ["Malaysia", "Mexico", "India"]
    },
    individualismCollectivism: {
      description: "Preference for individual vs group identity",
      individualist: ["USA", "Australia", "UK"],
      collectivist: ["China", "Japan", "Mexico"]
    },
    uncertaintyAvoidance: {
      description: "Tolerance for ambiguity and uncertainty",
      lowAvoidance: ["Singapore", "Denmark", "Sweden"],
      highAvoidance: ["Greece", "Portugal", "Japan"]
    }
  },
  globe: {
    assertiveness: {
      description: "Degree of assertive, confrontational behavior",
      low: ["Sweden", "Japan", "New Zealand"],
      high: ["Germany", "USA", "Austria"]
    },
    humanOrientation: {
      description: "Reward for being fair, caring, kind",
      low: ["Germany", "Spain", "France"],
      high: ["Philippines", "Ireland", "Malaysia"]
    }
  }
};

export const communicationStyles = {
  directness: {
    direct: {
      countries: ["Germany", "Netherlands", "Israel"],
      characteristics: ["Clear 'yes' or 'no'", "Explicit disagreement", "Direct feedback"]
    },
    indirect: {
      countries: ["Japan", "Korea", "Indonesia"],
      characteristics: ["Implied meanings", "Nonverbal cues important", "Face-saving language"]
    }
  },
  context: {
    lowContext: {
      countries: ["Germany", "Scandinavia", "USA"],
      characteristics: ["Explicit communication", "Written documentation", "Clear instructions"]
    },
    highContext: {
      countries: ["Japan", "Arab countries", "Latin America"],
      characteristics: ["Implicit understanding", "Relationship-dependent", "Contextual interpretation"]
    }
  }
};