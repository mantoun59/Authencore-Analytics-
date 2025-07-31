/**
 * Digital Wellbeing Assessment
 * Replaces the problematic Digital Wellness assessment
 * Based on established research on technology use and psychological wellbeing
 * Uses validated frameworks from cyberpsychology and digital health research
 */

export interface DigitalWellbeingDimension {
  id: string;
  name: string;
  description: string;
  research_foundation: string;
}

export interface DigitalBehaviorQuestion {
  id: number;
  dimension: string;
  text: string;
  response_type: 'likert' | 'frequency' | 'duration' | 'behavior';
  reversed: boolean;
  weight: number;
  research_source?: string;
}

export interface DigitalScenario {
  id: number;
  dimension: string;
  scenario: string;
  options: Array<{
    text: string;
    scores: Record<string, number>;
    wellbeing_impact: 'positive' | 'neutral' | 'negative';
  }>;
}

export interface WellbeingProfile {
  id: string;
  name: string;
  description: string;
  key_dimensions: string[];
  recommendations: string[];
  risk_factors: string[];
}

// Based on validated digital wellbeing research
export const digitalWellbeingData = {
  dimensions: [
    {
      id: "intentional_use",
      name: "Intentional Use",
      description: "Purposeful and mindful technology engagement",
      research_foundation: "Digital Mindfulness Research (Levy, 2016)"
    },
    {
      id: "digital_boundaries", 
      name: "Digital Boundaries",
      description: "Healthy limits between digital and offline activities",
      research_foundation: "Work-Life Balance Theory (Clark, 2000)"
    },
    {
      id: "social_connection",
      name: "Social Connection",
      description: "Quality of relationships facilitated by technology",
      research_foundation: "Social Capital Theory (Putnam, 2000)"
    },
    {
      id: "cognitive_control",
      name: "Cognitive Control", 
      description: "Ability to regulate attention and resist digital distractions",
      research_foundation: "Attention Regulation Research (Posner & Petersen, 1990)"
    },
    {
      id: "physical_wellbeing",
      name: "Physical Wellbeing",
      description: "Physical health in relation to technology use",
      research_foundation: "Digital Health Research (WHO, 2019)"
    },
    {
      id: "information_literacy",
      name: "Information Literacy",
      description: "Critical evaluation and effective use of digital information",
      research_foundation: "Media Literacy Framework (Potter, 2004)"
    }
  ],

  questions: [
    {
      id: 1,
      dimension: "intentional_use",
      text: "I use technology with specific goals in mind",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Digital Mindfulness Scale"
    },
    {
      id: 2,
      dimension: "intentional_use", 
      text: "I often find myself using devices without remembering why I picked them up",
      response_type: "likert",
      reversed: true,
      weight: 1,
      research_source: "Problematic Internet Use Scale"
    },
    {
      id: 3,
      dimension: "digital_boundaries",
      text: "I maintain specific times when I'm completely offline",
      response_type: "likert", 
      reversed: false,
      weight: 1,
      research_source: "Digital Detox Research"
    },
    {
      id: 4,
      dimension: "digital_boundaries",
      text: "Work-related notifications interrupt my personal time",
      response_type: "frequency",
      reversed: true,
      weight: 1,
      research_source: "Technostress Scale"
    },
    {
      id: 5,
      dimension: "social_connection",
      text: "Technology helps me maintain meaningful relationships",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Social Capital and Technology Use"
    },
    {
      id: 6,
      dimension: "social_connection",
      text: "I prefer digital communication over face-to-face interaction",
      response_type: "likert",
      reversed: true,
      weight: 0.8,
      research_source: "Social Displacement Theory"
    },
    {
      id: 7,
      dimension: "cognitive_control",
      text: "I can resist the urge to check notifications during focused work",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Attention Control Scale"
    },
    {
      id: 8,
      dimension: "cognitive_control",
      text: "I feel anxious when I can't access my devices",
      response_type: "likert",
      reversed: true,
      weight: 1,
      research_source: "Nomophobia Questionnaire"
    },
    {
      id: 9,
      dimension: "physical_wellbeing",
      text: "I take regular breaks from screen-based activities",
      response_type: "frequency",
      reversed: false,
      weight: 1,
      research_source: "Digital Eye Strain Research"
    },
    {
      id: 10,
      dimension: "physical_wellbeing",
      text: "Technology use affects my sleep quality",
      response_type: "likert",
      reversed: true,
      weight: 1,
      research_source: "Sleep and Media Use Studies"
    },
    {
      id: 11,
      dimension: "information_literacy",
      text: "I critically evaluate information I encounter online",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Digital Literacy Assessment"
    },
    {
      id: 12,
      dimension: "information_literacy",
      text: "I can identify misleading or biased information online",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Media Literacy Scale"
    },
    {
      id: 13,
      dimension: "intentional_use",
      text: "I regularly review and adjust my app usage patterns",
      response_type: "frequency",
      reversed: false,
      weight: 0.9,
      research_source: "Self-Regulation Theory"
    },
    {
      id: 14,
      dimension: "digital_boundaries",
      text: "I have specific locations in my home that are device-free",
      response_type: "behavior",
      reversed: false,
      weight: 1,
      research_source: "Environmental Psychology Research"
    },
    {
      id: 15,
      dimension: "social_connection",
      text: "My online interactions enhance my offline relationships",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Relational Maintenance Theory"
    },
    {
      id: 16,
      dimension: "cognitive_control",
      text: "I can focus on tasks without being distracted by technology",
      response_type: "likert",
      reversed: false,
      weight: 1,
      research_source: "Cognitive Load Theory"
    },
    {
      id: 17,
      dimension: "physical_wellbeing",
      text: "I maintain good posture when using digital devices",
      response_type: "likert",
      reversed: false,
      weight: 0.8,
      research_source: "Ergonomics Research"
    },
    {
      id: 18,
      dimension: "information_literacy",
      text: "I verify information from multiple sources before sharing",
      response_type: "frequency",
      reversed: false,
      weight: 1,
      research_source: "Information Verification Behavior"
    }
  ],

  scenarios: [
    {
      id: 1,
      dimension: "intentional_use",
      scenario: "You pick up your phone to check the weather, but see a social media notification.",
      options: [
        {
          text: "Check the weather quickly and put the phone away",
          scores: { intentional_use: 5, cognitive_control: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Check the weather, then briefly look at the notification",
          scores: { intentional_use: 3, cognitive_control: 2 },
          wellbeing_impact: "neutral"
        },
        {
          text: "Get distracted by the notification and forget about the weather",
          scores: { intentional_use: 1, cognitive_control: 1 },
          wellbeing_impact: "negative"
        },
        {
          text: "Turn off notifications to avoid future distractions",
          scores: { intentional_use: 5, digital_boundaries: 4 },
          wellbeing_impact: "positive"
        }
      ]
    },
    {
      id: 2,
      dimension: "digital_boundaries",
      scenario: "It's 10 PM and you receive work-related messages.",
      options: [
        {
          text: "Respond immediately to stay on top of work",
          scores: { digital_boundaries: 1, physical_wellbeing: 2 },
          wellbeing_impact: "negative"
        },
        {
          text: "Read but wait until morning to respond",
          scores: { digital_boundaries: 3, cognitive_control: 3 },
          wellbeing_impact: "neutral"
        },
        {
          text: "Don't check work messages after hours",
          scores: { digital_boundaries: 5, physical_wellbeing: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Set automatic 'after hours' responses",
          scores: { digital_boundaries: 5, intentional_use: 4 },
          wellbeing_impact: "positive"
        }
      ]
    },
    {
      id: 3,
      dimension: "social_connection",
      scenario: "You're at dinner with friends, and everyone is looking at their phones.",
      options: [
        {
          text: "Join them and check your own phone",
          scores: { social_connection: 1, intentional_use: 1 },
          wellbeing_impact: "negative"
        },
        {
          text: "Put your phone away and try to engage others",
          scores: { social_connection: 5, digital_boundaries: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Suggest a 'phone-free' dinner agreement",
          scores: { social_connection: 5, intentional_use: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Continue eating quietly without engaging",
          scores: { social_connection: 2, digital_boundaries: 3 },
          wellbeing_impact: "neutral"
        }
      ]
    },
    {
      id: 4,
      dimension: "cognitive_control",
      scenario: "You're working on an important task and keep getting distracted by notifications.",
      options: [
        {
          text: "Leave notifications on but try to ignore them",
          scores: { cognitive_control: 2, intentional_use: 2 },
          wellbeing_impact: "neutral"
        },
        {
          text: "Turn on 'Do Not Disturb' mode",
          scores: { cognitive_control: 5, digital_boundaries: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Check each notification as it comes in",
          scores: { cognitive_control: 1, intentional_use: 1 },
          wellbeing_impact: "negative"
        },
        {
          text: "Move the device to another room",
          scores: { cognitive_control: 5, physical_wellbeing: 3 },
          wellbeing_impact: "positive"
        }
      ]
    },
    {
      id: 5,
      dimension: "physical_wellbeing",
      scenario: "You've been working on a computer for 3 hours without a break.",
      options: [
        {
          text: "Continue working to finish the task",
          scores: { physical_wellbeing: 1, cognitive_control: 2 },
          wellbeing_impact: "negative"
        },
        {
          text: "Take a 5-minute break to stretch",
          scores: { physical_wellbeing: 4, intentional_use: 3 },
          wellbeing_impact: "positive"
        },
        {
          text: "Take a 15-minute walk outside",
          scores: { physical_wellbeing: 5, cognitive_control: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Switch to a different screen-based task",
          scores: { physical_wellbeing: 2, intentional_use: 2 },
          wellbeing_impact: "neutral"
        }
      ]
    },
    {
      id: 6,
      dimension: "information_literacy",
      scenario: "You see a concerning news article on social media.",
      options: [
        {
          text: "Share it immediately to warn others",
          scores: { information_literacy: 1, social_connection: 2 },
          wellbeing_impact: "negative"
        },
        {
          text: "Read the full article before reacting",
          scores: { information_literacy: 3, cognitive_control: 3 },
          wellbeing_impact: "neutral"
        },
        {
          text: "Verify the information from multiple sources",
          scores: { information_literacy: 5, cognitive_control: 4 },
          wellbeing_impact: "positive"
        },
        {
          text: "Check the credibility of the source",
          scores: { information_literacy: 4, intentional_use: 3 },
          wellbeing_impact: "positive"
        }
      ]
    }
  ],

  wellbeing_profiles: [
    {
      id: "mindful_user",
      name: "Mindful Digital User",
      description: "Uses technology intentionally with strong self-regulation",
      key_dimensions: ["intentional_use", "cognitive_control", "digital_boundaries"],
      recommendations: [
        "Continue modeling healthy digital habits",
        "Consider mentoring others in digital wellness",
        "Maintain current boundary-setting practices"
      ],
      risk_factors: [
        "May become overly rigid about technology use",
        "Could miss benefits of spontaneous digital discovery"
      ]
    },
    {
      id: "connected_communicator",
      name: "Connected Communicator",
      description: "Leverages technology effectively for social connection",
      key_dimensions: ["social_connection", "information_literacy", "intentional_use"],
      recommendations: [
        "Balance online and offline social activities",
        "Continue using critical thinking for information",
        "Set boundaries to protect deep relationships"
      ],
      risk_factors: [
        "May rely too heavily on digital communication",
        "Risk of information overload from multiple sources"
      ]
    },
    {
      id: "boundary_builder",
      name: "Boundary Builder",
      description: "Excels at maintaining healthy digital boundaries",
      key_dimensions: ["digital_boundaries", "physical_wellbeing", "cognitive_control"],
      recommendations: [
        "Help others develop boundary-setting skills",
        "Continue prioritizing physical health",
        "Maintain consistency in boundary practices"
      ],
      risk_factors: [
        "May miss important communications",
        "Could become isolated from digital collaboration"
      ]
    },
    {
      id: "developing_control",
      name: "Developing Control",
      description: "Working on building better digital self-regulation",
      key_dimensions: ["cognitive_control", "intentional_use"],
      recommendations: [
        "Use app timers and notification controls",
        "Practice single-tasking with technology",
        "Develop pre-use intention setting habits"
      ],
      risk_factors: [
        "Vulnerable to digital distractions",
        "May experience attention fragmentation"
      ]
    },
    {
      id: "social_seeker",
      name: "Social Seeker",
      description: "Highly engaged in digital social environments",
      key_dimensions: ["social_connection"],
      recommendations: [
        "Balance online and offline social time",
        "Develop skills for deeper digital conversations",
        "Practice digital empathy and communication"
      ],
      risk_factors: [
        "May experience social media fatigue",
        "Risk of superficial relationship maintenance"
      ]
    }
  ]
};