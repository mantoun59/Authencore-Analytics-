/**
 * Professional Workplace Values Assessment
 * Based on Schwartz Values Theory and organizational psychology research
 * Replaces the problematic Faith & Values assessment
 * Focuses on work-related values without religious bias
 */

export interface WorkplaceValue {
  id: string;
  name: string;
  description: string;
  icon: string;
  work_behaviors: string[];
  research_foundation: string;
}

export interface WorkplaceScenario {
  id: string;
  category: string;
  context: string;
  scenario: string;
  options: Array<{
    text: string;
    values: Record<string, number>;
  }>;
}

export interface CultureAlignment {
  id: string;
  name: string;
  description: string;
  key_values: string[];
  characteristics: string[];
  work_environment: string[];
}

// Based on Schwartz Values Theory and organizational research
export const workplaceValuesData = {
  core_values: [
    {
      id: "achievement",
      name: "Achievement",
      description: "Personal success and demonstrating competence",
      icon: "🏆",
      research_foundation: "Schwartz Values Theory - Achievement dimension",
      work_behaviors: [
        "Setting ambitious goals",
        "Seeking challenging projects",
        "Pursuing excellence in work",
        "Building professional reputation"
      ]
    },
    {
      id: "autonomy", 
      name: "Autonomy",
      description: "Independence in thought and action",
      icon: "🦅",
      research_foundation: "Self-Determination Theory - Autonomy need",
      work_behaviors: [
        "Preferring flexible work arrangements",
        "Making independent decisions",
        "Taking initiative on projects",
        "Resisting micromanagement"
      ]
    },
    {
      id: "security",
      name: "Security",
      description: "Safety, stability, and predictability",
      icon: "🛡️",
      research_foundation: "Schwartz Values Theory - Security dimension",
      work_behaviors: [
        "Valuing job stability",
        "Following established procedures",
        "Building emergency funds",
        "Preferring clear expectations"
      ]
    },
    {
      id: "stimulation",
      name: "Stimulation",
      description: "Excitement, novelty, and challenge",
      icon: "⚡",
      research_foundation: "Schwartz Values Theory - Stimulation dimension",
      work_behaviors: [
        "Seeking diverse experiences",
        "Embracing change and innovation",
        "Taking calculated risks",
        "Pursuing learning opportunities"
      ]
    },
    {
      id: "benevolence",
      name: "Benevolence",
      description: "Concern for the welfare of close others",
      icon: "🤝",
      research_foundation: "Schwartz Values Theory - Benevolence dimension",
      work_behaviors: [
        "Supporting team members",
        "Mentoring colleagues",
        "Collaborative problem-solving",
        "Building positive relationships"
      ]
    },
    {
      id: "universalism",
      name: "Universalism",
      description: "Understanding, tolerance, and protection for all",
      icon: "🌍",
      research_foundation: "Schwartz Values Theory - Universalism dimension",
      work_behaviors: [
        "Promoting diversity and inclusion",
        "Considering environmental impact",
        "Advocating for social justice",
        "Supporting ethical business practices"
      ]
    },
    {
      id: "conformity",
      name: "Conformity",
      description: "Restraint of actions that might harm others",
      icon: "📋",
      research_foundation: "Schwartz Values Theory - Conformity dimension",
      work_behaviors: [
        "Following organizational policies",
        "Respecting authority structures",
        "Maintaining professional standards",
        "Avoiding disruptive behavior"
      ]
    },
    {
      id: "tradition",
      name: "Tradition",
      description: "Respect for cultural and organizational customs",
      icon: "🏛️",
      research_foundation: "Schwartz Values Theory - Tradition dimension",
      work_behaviors: [
        "Honoring company history",
        "Maintaining established practices",
        "Respecting cultural customs",
        "Preserving institutional knowledge"
      ]
    }
  ],

  scenarios: [
    {
      id: "ws001",
      category: "decision_making",
      context: "Resource Allocation",
      scenario: "Your department has a limited budget for professional development. How should it be distributed?",
      options: [
        {
          text: "Invest in the highest performers to maximize ROI",
          values: { achievement: 4, autonomy: 2, security: 3 }
        },
        {
          text: "Distribute equally among all team members",
          values: { benevolence: 4, universalism: 4, conformity: 3 }
        },
        {
          text: "Focus on emerging technologies and innovation",
          values: { stimulation: 5, achievement: 3, autonomy: 3 }
        },
        {
          text: "Prioritize skills that ensure job security",
          values: { security: 5, conformity: 3, tradition: 2 }
        }
      ]
    },
    {
      id: "ws002", 
      category: "work_style",
      context: "Project Management",
      scenario: "You're leading a project with tight deadlines. What's your approach?",
      options: [
        {
          text: "Create detailed plans and stick to proven methods",
          values: { security: 4, conformity: 4, tradition: 3 }
        },
        {
          text: "Give team members autonomy to find creative solutions",
          values: { autonomy: 5, stimulation: 3, benevolence: 3 }
        },
        {
          text: "Focus on achieving the best possible outcome",
          values: { achievement: 5, stimulation: 2, security: 2 }
        },
        {
          text: "Ensure everyone contributes equally to the solution",
          values: { benevolence: 4, universalism: 3, conformity: 2 }
        }
      ]
    },
    {
      id: "ws003",
      category: "ethical_decision",
      context: "Environmental Impact",
      scenario: "Your company is considering a profitable opportunity that may have environmental consequences.",
      options: [
        {
          text: "Pursue the opportunity while implementing safeguards",
          values: { achievement: 3, security: 3, stimulation: 2 }
        },
        {
          text: "Decline if there's any environmental risk",
          values: { universalism: 5, benevolence: 3, conformity: 2 }
        },
        {
          text: "Research innovative solutions to minimize impact",
          values: { stimulation: 4, universalism: 4, achievement: 3 }
        },
        {
          text: "Follow industry standards and regulations",
          values: { conformity: 4, tradition: 3, security: 3 }
        }
      ]
    },
    {
      id: "ws004",
      category: "team_dynamics",
      context: "Conflict Resolution",
      scenario: "Two team members have conflicting approaches to completing a task.",
      options: [
        {
          text: "Let them work it out independently",
          values: { autonomy: 4, stimulation: 2, achievement: 2 }
        },
        {
          text: "Facilitate a collaborative solution",
          values: { benevolence: 5, universalism: 3, conformity: 3 }
        },
        {
          text: "Choose the approach with best chance of success",
          values: { achievement: 4, security: 3, stimulation: 2 }
        },
        {
          text: "Apply established company procedures",
          values: { conformity: 5, tradition: 4, security: 3 }
        }
      ]
    },
    {
      id: "ws005",
      category: "innovation",
      context: "Process Improvement",
      scenario: "You've identified a way to improve efficiency, but it requires changing established workflows.",
      options: [
        {
          text: "Implement the change immediately for competitive advantage",
          values: { achievement: 4, stimulation: 4, autonomy: 3 }
        },
        {
          text: "Test with a small group before wider implementation",
          values: { security: 4, benevolence: 3, conformity: 3 }
        },
        {
          text: "Involve all stakeholders in the decision process",
          values: { universalism: 4, benevolence: 4, conformity: 2 }
        },
        {
          text: "Maintain current processes to avoid disruption",
          values: { tradition: 5, security: 4, conformity: 4 }
        }
      ]
    },
    {
      id: "ws006",
      category: "career_development",
      context: "Professional Growth",
      scenario: "You're offered a promotion that requires relocating and more responsibility.",
      options: [
        {
          text: "Accept immediately - it's a great opportunity",
          values: { achievement: 5, stimulation: 4, autonomy: 3 }
        },
        {
          text: "Consider impact on family and work-life balance",
          values: { benevolence: 4, security: 4, tradition: 3 }
        },
        {
          text: "Negotiate terms that work for everyone",
          values: { autonomy: 4, benevolence: 3, universalism: 3 }
        },
        {
          text: "Decline to maintain current stability",
          values: { security: 5, tradition: 4, conformity: 3 }
        }
      ]
    },
    {
      id: "ws007",
      category: "diversity_inclusion",
      context: "Hiring Decision",
      scenario: "You're on a hiring committee with candidates of varying backgrounds and experience levels.",
      options: [
        {
          text: "Select the candidate with the highest qualifications",
          values: { achievement: 4, conformity: 3, security: 3 }
        },
        {
          text: "Consider how each candidate adds to team diversity",
          values: { universalism: 5, benevolence: 4, stimulation: 3 }
        },
        {
          text: "Choose based on cultural fit with the team",
          values: { tradition: 4, conformity: 4, benevolence: 3 }
        },
        {
          text: "Focus on potential for innovation and fresh perspectives",
          values: { stimulation: 5, autonomy: 3, achievement: 3 }
        }
      ]
    },
    {
      id: "ws008",
      category: "work_life_balance",
      context: "Schedule Management",
      scenario: "Your ideal work schedule would prioritize:",
      options: [
        {
          text: "Maximum productivity and achievement",
          values: { achievement: 5, stimulation: 3, autonomy: 2 }
        },
        {
          text: "Flexibility to balance all life priorities",
          values: { autonomy: 5, benevolence: 4, security: 3 }
        },
        {
          text: "Consistency and predictable routine",
          values: { security: 5, conformity: 4, tradition: 3 }
        },
        {
          text: "Variety and new challenges",
          values: { stimulation: 5, autonomy: 4, achievement: 3 }
        }
      ]
    }
  ],

  culture_alignments: [
    {
      id: "achievement_oriented",
      name: "Achievement-Oriented Culture",
      description: "High-performance environments focused on results and excellence",
      key_values: ["achievement", "stimulation", "autonomy"],
      characteristics: [
        "Merit-based advancement",
        "Competitive environment",
        "Innovation encouraged",
        "Results-driven decisions"
      ],
      work_environment: [
        "Tech startups",
        "Consulting firms",
        "Sales organizations",
        "Investment firms"
      ]
    },
    {
      id: "collaborative_culture",
      name: "Collaborative Culture", 
      description: "Team-focused environments emphasizing cooperation and support",
      key_values: ["benevolence", "universalism", "conformity"],
      characteristics: [
        "Team-based decisions",
        "Supportive management",
        "Inclusive practices",
        "Consensus building"
      ],
      work_environment: [
        "Healthcare organizations",
        "Educational institutions",
        "Non-profit organizations",
        "Cooperative businesses"
      ]
    },
    {
      id: "stable_traditional",
      name: "Stable Traditional Culture",
      description: "Established organizations with clear structures and procedures",
      key_values: ["security", "tradition", "conformity"],
      characteristics: [
        "Clear hierarchies",
        "Established procedures",
        "Long-term planning",
        "Risk management focus"
      ],
      work_environment: [
        "Government agencies",
        "Financial institutions",
        "Manufacturing companies",
        "Utility companies"
      ]
    },
    {
      id: "innovative_adaptive",
      name: "Innovative Adaptive Culture",
      description: "Dynamic environments embracing change and experimentation",
      key_values: ["stimulation", "autonomy", "universalism"],
      characteristics: [
        "Rapid adaptation",
        "Experimental mindset",
        "Diverse perspectives valued",
        "Continuous learning"
      ],
      work_environment: [
        "Research institutions",
        "Creative agencies",
        "Technology companies",
        "Biotech firms"
      ]
    }
  ]
};