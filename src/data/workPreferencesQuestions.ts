/**
 * Individual Work Preferences Assessment
 * Replaces the problematic Gen Z assessment
 * Based on research on individual differences rather than generational stereotypes
 * Uses validated frameworks from organizational psychology
 */

export interface WorkPreference {
  id: string;
  dimension: string;
  name: string;
  description: string;
  research_foundation: string;
}

export interface WorkScenario {
  id: string;
  category: string;
  title: string;
  scenario: string;
  options: Array<{
    text: string;
    scores: Record<string, number>;
  }>;
}

export interface WorkStyleProfile {
  id: string;
  name: string;
  description: string;
  key_preferences: string[];
  work_environments: string[];
  career_paths: string[];
}

// Based on established organizational psychology research
export const workPreferencesData = {
  dimensions: [
    {
      id: "work_autonomy",
      name: "Work Autonomy",
      description: "Preference for independence and self-direction in work",
      research_foundation: "Self-Determination Theory (Deci & Ryan)"
    },
    {
      id: "structure_flexibility",
      name: "Structure vs Flexibility", 
      description: "Preference for structured vs flexible work arrangements",
      research_foundation: "Work Design Theory (Hackman & Oldham)"
    },
    {
      id: "collaboration_style",
      name: "Collaboration Style",
      description: "Preference for individual vs team-based work",
      research_foundation: "Team Effectiveness Research (Salas et al.)"
    },
    {
      id: "feedback_frequency",
      name: "Feedback Frequency",
      description: "Preference for feedback timing and frequency",
      research_foundation: "Feedback Intervention Theory (Kluger & DeNisi)"
    },
    {
      id: "learning_approach",
      name: "Learning Approach",
      description: "Preferred methods for skill development and learning",
      research_foundation: "Adult Learning Theory (Knowles)"
    },
    {
      id: "communication_style",
      name: "Communication Style",
      description: "Preferred communication methods and channels",
      research_foundation: "Media Richness Theory (Daft & Lengel)"
    },
    {
      id: "goal_orientation",
      name: "Goal Orientation",
      description: "Preference for different types of goals and achievement",
      research_foundation: "Goal Setting Theory (Locke & Latham)"
    },
    {
      id: "innovation_comfort",
      name: "Innovation Comfort",
      description: "Comfort level with change and innovation",
      research_foundation: "Innovation Adoption Theory (Rogers)"
    }
  ],

  scenarios: [
    {
      id: "wp001",
      category: "work_structure",
      title: "Daily Schedule Preference",
      scenario: "Which work schedule would you find most productive?",
      options: [
        {
          text: "Flexible hours with core meeting times",
          scores: { structure_flexibility: 4, work_autonomy: 4, collaboration_style: 3 }
        },
        {
          text: "Standard 9-5 with clear start/end times",
          scores: { structure_flexibility: -2, goal_orientation: 3, collaboration_style: 2 }
        },
        {
          text: "Project-based deadlines with complete time freedom",
          scores: { work_autonomy: 5, structure_flexibility: 5, goal_orientation: 4 }
        },
        {
          text: "Structured schedule with built-in collaboration time",
          scores: { structure_flexibility: -1, collaboration_style: 4, communication_style: 3 }
        }
      ]
    },
    {
      id: "wp002",
      category: "feedback_learning",
      title: "Performance Feedback",
      scenario: "How often would you like to receive feedback on your work?",
      options: [
        {
          text: "Continuous real-time feedback",
          scores: { feedback_frequency: 5, learning_approach: 4, communication_style: 3 }
        },
        {
          text: "Weekly check-ins with structured reviews",
          scores: { feedback_frequency: 3, structure_flexibility: 2, goal_orientation: 3 }
        },
        {
          text: "Monthly formal reviews with detailed analysis",
          scores: { feedback_frequency: 1, structure_flexibility: -1, goal_orientation: 2 }
        },
        {
          text: "As-needed feedback when I request it",
          scores: { work_autonomy: 4, feedback_frequency: 2, learning_approach: 3 }
        }
      ]
    },
    {
      id: "wp003",
      category: "collaboration",
      title: "Project Approach",
      scenario: "On a complex project, you prefer to:",
      options: [
        {
          text: "Work independently and share results at milestones",
          scores: { collaboration_style: -3, work_autonomy: 4, goal_orientation: 3 }
        },
        {
          text: "Collaborate closely throughout the entire process",
          scores: { collaboration_style: 5, communication_style: 4, feedback_frequency: 3 }
        },
        {
          text: "Split tasks clearly and coordinate regularly",
          scores: { collaboration_style: 2, structure_flexibility: 1, goal_orientation: 4 }
        },
        {
          text: "Use collaborative tools to work together asynchronously",
          scores: { collaboration_style: 3, communication_style: 4, innovation_comfort: 3 }
        }
      ]
    },
    {
      id: "wp004",
      category: "communication",
      title: "Communication Preference",
      scenario: "For important work discussions, you prefer:",
      options: [
        {
          text: "Face-to-face meetings with agenda",
          scores: { communication_style: 2, structure_flexibility: 1, collaboration_style: 3 }
        },
        {
          text: "Video calls with shared documents",
          scores: { communication_style: 4, innovation_comfort: 3, collaboration_style: 3 }
        },
        {
          text: "Written communication with time to think",
          scores: { communication_style: 1, work_autonomy: 3, structure_flexibility: 2 }
        },
        {
          text: "Mix of formats depending on the topic",
          scores: { communication_style: 3, innovation_comfort: 4, structure_flexibility: 4 }
        }
      ]
    },
    {
      id: "wp005",
      category: "learning_development",
      title: "Skill Development",
      scenario: "When learning new skills, you prefer:",
      options: [
        {
          text: "Hands-on practice with immediate application",
          scores: { learning_approach: 4, work_autonomy: 3, innovation_comfort: 3 }
        },
        {
          text: "Structured training programs with certification",
          scores: { learning_approach: 2, structure_flexibility: -1, goal_orientation: 4 }
        },
        {
          text: "Mentoring and shadowing experienced colleagues",
          scores: { learning_approach: 3, collaboration_style: 4, feedback_frequency: 3 }
        },
        {
          text: "Self-directed online learning at your own pace",
          scores: { learning_approach: 5, work_autonomy: 5, structure_flexibility: 4 }
        }
      ]
    },
    {
      id: "wp006",
      category: "goal_setting",
      title: "Goal Structure",
      scenario: "You work best when goals are:",
      options: [
        {
          text: "Clearly defined with specific metrics",
          scores: { goal_orientation: 5, structure_flexibility: -1, feedback_frequency: 2 }
        },
        {
          text: "Broad direction with flexibility in approach",
          scores: { goal_orientation: 3, work_autonomy: 4, structure_flexibility: 4 }
        },
        {
          text: "Collaboratively set with team input",
          scores: { goal_orientation: 4, collaboration_style: 4, communication_style: 3 }
        },
        {
          text: "Adaptive and can change based on circumstances",
          scores: { goal_orientation: 2, innovation_comfort: 5, structure_flexibility: 5 }
        }
      ]
    },
    {
      id: "wp007",
      category: "innovation_change",
      title: "New Technology",
      scenario: "When new tools or technologies are introduced:",
      options: [
        {
          text: "I'm excited to be an early adopter",
          scores: { innovation_comfort: 5, learning_approach: 4, communication_style: 3 }
        },
        {
          text: "I prefer to wait and see how others use it first",
          scores: { innovation_comfort: 1, structure_flexibility: -1, goal_orientation: 2 }
        },
        {
          text: "I evaluate based on specific benefits to my work",
          scores: { innovation_comfort: 3, goal_orientation: 4, work_autonomy: 3 }
        },
        {
          text: "I like to be involved in testing and providing feedback",
          scores: { innovation_comfort: 4, feedback_frequency: 4, collaboration_style: 3 }
        }
      ]
    },
    {
      id: "wp008",
      category: "work_environment",
      title: "Physical Workspace",
      scenario: "Your ideal work environment would be:",
      options: [
        {
          text: "Quiet private office with minimal distractions",
          scores: { work_autonomy: 4, collaboration_style: -2, structure_flexibility: 2 }
        },
        {
          text: "Open collaborative space with easy team interaction",
          scores: { collaboration_style: 5, communication_style: 4, innovation_comfort: 3 }
        },
        {
          text: "Flexible spaces that can be configured as needed",
          scores: { structure_flexibility: 5, innovation_comfort: 4, work_autonomy: 3 }
        },
        {
          text: "Home office with occasional team meetups",
          scores: { work_autonomy: 5, structure_flexibility: 4, collaboration_style: 1 }
        }
      ]
    }
  ],

  work_style_profiles: [
    {
      id: "autonomous_specialist",
      name: "Autonomous Specialist",
      description: "Prefers independence and deep focus on specialized work",
      key_preferences: ["work_autonomy", "structure_flexibility", "learning_approach"],
      work_environments: [
        "Research and development",
        "Technical consulting", 
        "Freelance/contract work",
        "Academic positions"
      ],
      career_paths: [
        "Subject matter expert",
        "Independent consultant", 
        "Research scientist",
        "Technical architect"
      ]
    },
    {
      id: "collaborative_builder",
      name: "Collaborative Builder",
      description: "Thrives in team environments with shared goals",
      key_preferences: ["collaboration_style", "communication_style", "feedback_frequency"],
      work_environments: [
        "Cross-functional teams",
        "Client-facing roles",
        "Project management",
        "Community organizations"
      ],
      career_paths: [
        "Team leader",
        "Project manager",
        "Account manager", 
        "HR business partner"
      ]
    },
    {
      id: "structured_achiever",
      name: "Structured Achiever",
      description: "Excels with clear goals and organized processes",
      key_preferences: ["goal_orientation", "structure_flexibility", "feedback_frequency"],
      work_environments: [
        "Operations roles",
        "Financial services",
        "Manufacturing",
        "Government agencies"
      ],
      career_paths: [
        "Operations manager",
        "Financial analyst",
        "Quality assurance",
        "Compliance officer"
      ]
    },
    {
      id: "adaptive_innovator",
      name: "Adaptive Innovator", 
      description: "Embraces change and drives innovation",
      key_preferences: ["innovation_comfort", "structure_flexibility", "learning_approach"],
      work_environments: [
        "Startups",
        "Technology companies",
        "Creative agencies",
        "Strategy consulting"
      ],
      career_paths: [
        "Product manager",
        "Innovation lead",
        "Strategy consultant",
        "Entrepreneur"
      ]
    },
    {
      id: "learning_connector",
      name: "Learning Connector",
      description: "Focuses on growth and connecting people and ideas",
      key_preferences: ["learning_approach", "communication_style", "collaboration_style"],
      work_environments: [
        "Training and development",
        "Educational technology",
        "Change management",
        "Talent development"
      ],
      career_paths: [
        "Learning specialist",
        "Change manager",
        "Talent developer",
        "Corporate trainer"
      ]
    }
  ]
};