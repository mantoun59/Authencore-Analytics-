export interface FaithValuesValue {
  id: string;
  name: string;
  description: string;
  icon: string;
  workplace_behaviors: string[];
}

export interface FaithValuesScenario {
  id: string;
  category: string;
  context?: string;
  scenario: string;
  options: Array<{
    text: string;
    values: Record<string, number>;
  }>;
  follow_up?: string;
}

export interface CultureType {
  id: string;
  name: string;
  description: string;
  key_values: string[];
  characteristics: string[];
  examples: string[];
}

export const faithValuesData = {
  universal_values: [
    {
      id: "integrity",
      name: "Integrity",
      description: "Honesty, ethical behavior, and moral principles",
      icon: "⚖️",
      workplace_behaviors: [
        "Transparent communication",
        "Ethical decision-making",
        "Accountability for actions",
        "Consistency between values and actions"
      ]
    },
    {
      id: "respect",
      name: "Respect",
      description: "Dignity, consideration, and appreciation for all",
      icon: "🤝",
      workplace_behaviors: [
        "Inclusive environment",
        "Valuing diverse perspectives",
        "Professional courtesy",
        "Recognition of contributions"
      ]
    },
    {
      id: "compassion",
      name: "Compassion",
      description: "Empathy, kindness, and care for others",
      icon: "❤️",
      workplace_behaviors: [
        "Supportive culture",
        "Work-life balance",
        "Mental health awareness",
        "Helping colleagues"
      ]
    },
    {
      id: "excellence",
      name: "Excellence",
      description: "High standards, quality, and continuous improvement",
      icon: "⭐",
      workplace_behaviors: [
        "Quality focus",
        "Professional development",
        "Innovation encouragement",
        "Recognition of achievement"
      ]
    },
    {
      id: "service",
      name: "Service",
      description: "Contributing to something greater than oneself",
      icon: "🌍",
      workplace_behaviors: [
        "Community impact",
        "Customer focus",
        "Social responsibility",
        "Meaningful work"
      ]
    },
    {
      id: "growth",
      name: "Growth",
      description: "Learning, development, and personal evolution",
      icon: "🌱",
      workplace_behaviors: [
        "Learning opportunities",
        "Career advancement",
        "Skill development",
        "Mentorship programs"
      ]
    },
    {
      id: "balance",
      name: "Balance",
      description: "Harmony between different life aspects",
      icon: "⚡",
      workplace_behaviors: [
        "Flexible scheduling",
        "Remote work options",
        "Family-friendly policies",
        "Wellness programs"
      ]
    },
    {
      id: "justice",
      name: "Justice",
      description: "Fairness, equality, and standing for what's right",
      icon: "⚖️",
      workplace_behaviors: [
        "Fair compensation",
        "Equal opportunities",
        "Anti-discrimination policies",
        "Advocacy support"
      ]
    }
  ],

  scenarios: [
    {
      id: "s001",
      category: "ethical_dilemma",
      context: "Corporate Ethics",
      scenario: "You discover a colleague has been slightly inflating their expense reports. They're a single parent struggling financially. What would you do?",
      options: [
        {
          text: "Report it immediately to management",
          values: { integrity: 5, justice: 4, compassion: -2 }
        },
        {
          text: "Talk to them privately and encourage them to correct it",
          values: { integrity: 3, compassion: 4, respect: 3 }
        },
        {
          text: "Offer to help them financially instead",
          values: { compassion: 5, service: 3, integrity: -1 }
        },
        {
          text: "Stay out of it - it's not your business",
          values: { balance: 3, respect: 2, integrity: -2 }
        }
      ]
    },
    {
      id: "s002",
      category: "work_life_balance",
      context: "Personal Boundaries",
      scenario: "Your team has an important deadline, but you've already committed to attending your child's school event. Your manager asks you to stay late.",
      options: [
        {
          text: "Stay late and miss the event",
          values: { excellence: 4, service: 3, balance: -3 }
        },
        {
          text: "Attend the event and work from home later",
          values: { balance: 4, excellence: 2, integrity: 3 }
        },
        {
          text: "Delegate tasks and attend the event",
          values: { balance: 5, growth: 2, service: 1 }
        },
        {
          text: "Negotiate a compromise with your manager",
          values: { respect: 4, balance: 3, excellence: 2 }
        }
      ]
    },
    {
      id: "s003",
      category: "diversity_inclusion",
      context: "Workplace Respect",
      scenario: "A colleague makes an insensitive comment about another employee's religious practices during a team meeting.",
      options: [
        {
          text: "Address it immediately in the meeting",
          values: { justice: 5, respect: 4, integrity: 4 }
        },
        {
          text: "Speak to them privately after the meeting",
          values: { respect: 5, compassion: 3, justice: 3 }
        },
        {
          text: "Report it to HR",
          values: { justice: 4, integrity: 4, respect: 2 }
        },
        {
          text: "Support the affected colleague privately",
          values: { compassion: 5, respect: 3, service: 3 }
        }
      ]
    },
    {
      id: "s004",
      category: "environmental_social",
      context: "Corporate Responsibility",
      scenario: "Your company is considering a profitable partnership with a firm known for poor environmental practices.",
      options: [
        {
          text: "Vocally oppose the partnership",
          values: { service: 5, integrity: 4, justice: 4 }
        },
        {
          text: "Suggest environmental conditions for the partnership",
          values: { service: 4, excellence: 3, balance: 3 }
        },
        {
          text: "Focus on the financial benefits for employees",
          values: { service: 2, compassion: 3, growth: 2 }
        },
        {
          text: "Trust leadership to make the right decision",
          values: { respect: 3, balance: 2, excellence: 1 }
        }
      ]
    },
    {
      id: "s005",
      category: "leadership_authority",
      context: "Professional Communication",
      scenario: "You strongly disagree with a new policy your manager wants to implement. You believe it will harm team morale.",
      options: [
        {
          text: "Express your concerns directly to your manager",
          values: { integrity: 4, respect: 3, service: 3 }
        },
        {
          text: "Gather team feedback first, then present it",
          values: { service: 4, respect: 4, excellence: 3 }
        },
        {
          text: "Implement it but try to minimize negative impact",
          values: { compassion: 3, balance: 3, respect: 2 }
        },
        {
          text: "Escalate your concerns to senior leadership",
          values: { integrity: 5, justice: 4, respect: 1 }
        }
      ]
    },
    {
      id: "s006",
      category: "whistleblowing",
      context: "Public Safety",
      scenario: "You discover your company is knowingly selling products with a safety defect. Management says fixing it would be too expensive and the risk is minimal.",
      options: [
        {
          text: "Report to regulatory authorities immediately",
          values: { integrity: 5, service: 5, justice: 5, balance: -2 }
        },
        {
          text: "Document everything and consult with a lawyer first",
          values: { integrity: 4, justice: 4, balance: 2, growth: 1 }
        },
        {
          text: "Push internally for change through proper channels",
          values: { integrity: 3, respect: 4, excellence: 3, service: 2 }
        },
        {
          text: "Leave the company but stay quiet",
          values: { balance: 4, integrity: 1, compassion: 2, growth: 2 }
        }
      ]
    },
    {
      id: "s007",
      category: "discrimination",
      context: "Workplace Equality",
      scenario: "You notice that promotions in your department consistently go to people of a certain demographic, despite other qualified candidates.",
      options: [
        {
          text: "Raise the issue with HR formally",
          values: { justice: 5, integrity: 4, respect: 3, service: 3 }
        },
        {
          text: "Mentor and advocate for overlooked colleagues",
          values: { service: 5, compassion: 4, justice: 3, growth: 4 }
        },
        {
          text: "Discuss concerns with leadership directly",
          values: { integrity: 4, respect: 4, justice: 4, excellence: 2 }
        },
        {
          text: "Focus on your own advancement first",
          values: { growth: 4, balance: 3, excellence: 3, justice: -1 }
        }
      ]
    },
    {
      id: "s008",
      category: "sustainability",
      context: "Environmental Impact",
      scenario: "Your role requires frequent air travel. You're concerned about the environmental impact but it's essential for client relationships.",
      options: [
        {
          text: "Propose virtual meetings as the primary option",
          values: { service: 5, integrity: 4, excellence: 4, balance: 3 }
        },
        {
          text: "Offset travel with personal environmental actions",
          values: { balance: 4, service: 3, integrity: 3, compassion: 2 }
        },
        {
          text: "Accept it as a necessary part of business",
          values: { excellence: 3, balance: 2, growth: 3, service: 0 }
        },
        {
          text: "Look for a role with less travel required",
          values: { integrity: 5, service: 4, balance: 4, growth: 1 }
        }
      ]
    },
    {
      id: "s009",
      category: "honesty",
      context: "Accountability",
      scenario: "Your team made a significant error that cost the company money. Your manager suggests presenting it as an external vendor's fault.",
      options: [
        {
          text: "Insist on telling the truth to leadership",
          values: { integrity: 5, respect: 3, excellence: 4, justice: 4 }
        },
        {
          text: "Suggest a compromise that's partially true",
          values: { balance: 3, respect: 2, integrity: 1, compassion: 2 }
        },
        {
          text: "Go along but document the truth privately",
          values: { balance: 2, growth: 1, integrity: 2, respect: 1 }
        },
        {
          text: "Refuse to participate in the deception",
          values: { integrity: 5, justice: 3, respect: 2, balance: 3 }
        }
      ]
    },
    {
      id: "s010",
      category: "loyalty",
      context: "Team Relations",
      scenario: "A close colleague and friend is underperforming significantly. Their job is at risk, but they're going through personal difficulties.",
      options: [
        {
          text: "Cover for them while they work through issues",
          values: { compassion: 5, service: 3, balance: 1, excellence: -2 }
        },
        {
          text: "Encourage them to speak with management about support",
          values: { compassion: 4, integrity: 4, respect: 4, growth: 3 }
        },
        {
          text: "Offer personal support but maintain professional standards",
          values: { balance: 5, compassion: 3, excellence: 3, integrity: 3 }
        },
        {
          text: "Distance yourself professionally to protect your reputation",
          values: { growth: 3, excellence: 3, balance: 2, compassion: -1 }
        }
      ]
    },
    {
      id: "s011",
      category: "religious_accommodation",
      context: "Cultural Sensitivity",
      scenario: "A colleague requests time off for religious observances that fall during a busy period.",
      options: [
        {
          text: "Fully support and help cover their responsibilities",
          values: { respect: 5, compassion: 4, service: 4 }
        },
        {
          text: "Support if they can make up the work at another time",
          values: { balance: 4, respect: 3, excellence: 3 }
        },
        {
          text: "Let management decide based on business needs",
          values: { balance: 3, respect: 2, excellence: 2 }
        },
        {
          text: "Express concern about the timing to management",
          values: { excellence: 4, balance: 2, respect: 0 }
        }
      ]
    },
    {
      id: "s012",
      category: "cultural_expression",
      context: "Workplace Inclusion",
      scenario: "Your workplace is discussing dress code policies. Some want to allow cultural/religious attire, others prefer uniformity.",
      options: [
        {
          text: "Advocate strongly for inclusive dress policies",
          values: { respect: 5, justice: 4, compassion: 4 }
        },
        {
          text: "Suggest guidelines that balance both concerns",
          values: { balance: 5, respect: 3, excellence: 2 }
        },
        {
          text: "Support whatever management decides",
          values: { respect: 2, balance: 3, growth: 1 }
        },
        {
          text: "Prefer professional uniformity for client-facing roles",
          values: { excellence: 4, balance: 2, respect: 1 }
        }
      ]
    },
    {
      id: "s013",
      category: "work_life_integration",
      context: "Personal Boundaries",
      scenario: "Your company culture expects employees to be 'always available' via phone/email. This conflicts with your family time.",
      options: [
        {
          text: "Set clear boundaries and stick to them",
          values: { balance: 5, integrity: 4, respect: 3 }
        },
        {
          text: "Be available for true emergencies only",
          values: { balance: 4, excellence: 3, compassion: 3 }
        },
        {
          text: "Adapt to the culture to advance career",
          values: { growth: 4, excellence: 4, balance: -2 }
        },
        {
          text: "Look for a company with better boundaries",
          values: { balance: 5, integrity: 3, growth: 2 }
        }
      ]
    },
    {
      id: "s014",
      category: "personal_beliefs",
      context: "Value Conflicts",
      scenario: "Your company asks employees to participate in activities that conflict with your personal beliefs.",
      options: [
        {
          text: "Politely decline and explain your position",
          values: { integrity: 5, respect: 4, balance: 3 }
        },
        {
          text: "Participate minimally to avoid conflict",
          values: { balance: 3, respect: 2, integrity: 1 }
        },
        {
          text: "Suggest alternative activities that are inclusive",
          values: { service: 4, respect: 5, excellence: 3 }
        },
        {
          text: "Participate fully despite discomfort",
          values: { excellence: 2, growth: 1, integrity: -2 }
        }
      ]
    },
    {
      id: "s015",
      category: "team_development",
      context: "Leadership",
      scenario: "A team member comes to you about pursuing an opportunity in another department. Their departure would impact your team.",
      options: [
        {
          text: "Enthusiastically support their growth",
          values: { growth: 5, service: 4, compassion: 4 }
        },
        {
          text: "Support them while planning for transition",
          values: { balance: 5, growth: 3, excellence: 3 }
        },
        {
          text: "Try to counter-offer to keep them",
          values: { excellence: 3, growth: 2, balance: 2 }
        },
        {
          text: "Express disappointment but accept their decision",
          values: { respect: 3, balance: 2, growth: 1 }
        }
      ]
    }
  ],

  culture_types: [
    {
      id: "mission_driven",
      name: "Mission-Driven Culture",
      description: "Organizations focused on making a positive impact",
      key_values: ["service", "integrity", "justice"],
      characteristics: [
        "Clear social/environmental mission",
        "Values-based decision making",
        "Community engagement",
        "Purpose over profit mentality"
      ],
      examples: ["Non-profits", "B-Corps", "Social enterprises"]
    },
    {
      id: "innovation_growth",
      name: "Innovation & Growth Culture",
      description: "Fast-paced environments focused on breakthrough thinking",
      key_values: ["growth", "excellence", "balance"],
      characteristics: [
        "Continuous learning",
        "Risk-taking encouraged",
        "Rapid advancement opportunities",
        "Flexible work arrangements"
      ],
      examples: ["Tech startups", "R&D companies", "Creative agencies"]
    },
    {
      id: "people_first",
      name: "People-First Culture",
      description: "Organizations prioritizing employee wellbeing and development",
      key_values: ["compassion", "respect", "balance"],
      characteristics: [
        "Strong work-life balance",
        "Comprehensive benefits",
        "Supportive management",
        "Team collaboration"
      ],
      examples: ["Progressive corporations", "Healthcare organizations", "Education institutions"]
    },
    {
      id: "excellence_driven",
      name: "Excellence-Driven Culture",
      description: "High-performance environments with strong quality focus",
      key_values: ["excellence", "integrity", "growth"],
      characteristics: [
        "High standards",
        "Meritocracy",
        "Professional development",
        "Recognition programs"
      ],
      examples: ["Consulting firms", "Financial services", "Engineering companies"]
    },
    {
      id: "traditional_stable",
      name: "Traditional Stable Culture",
      description: "Established organizations with clear structures",
      key_values: ["respect", "integrity", "balance"],
      characteristics: [
        "Clear hierarchies",
        "Established processes",
        "Job security",
        "Predictable advancement"
      ],
      examples: ["Government", "Large corporations", "Utilities"]
    }
  ]
};