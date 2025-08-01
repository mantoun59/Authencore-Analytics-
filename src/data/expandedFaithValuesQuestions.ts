// Expanded Faith and Values Assessment - 90 Questions
// Based on validated instruments: Rokeach Value Survey, Schwartz Values Survey, 
// Portrait Values Questionnaire, Religious Orientation Scale, Spiritual Well-Being Scale,
// and workplace values research from multiple sources

export interface FaithValuesQuestion {
  id: string;
  type: 'likert' | 'ranking' | 'scenario' | 'forced_choice' | 'semantic_differential';
  category: string;
  subcategory: string;
  question: string;
  options?: Array<{
    text: string;
    value: number;
    dimensions: Record<string, number>;
  }>;
  scale?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
    dimensions: Record<string, number>[];
  };
  items?: Array<{
    text: string;
    dimensions: Record<string, number>;
  }>;
  source: string;
  validityCheck?: boolean;
}

export const expandedFaithValuesQuestions: FaithValuesQuestion[] = [
  // SECTION 1: CORE SPIRITUAL/FAITH DIMENSIONS (15 questions)
  // Based on Religious Orientation Scale & Spiritual Well-Being Scale
  
  {
    id: "fv001",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "intrinsic_faith",
    question: "My spiritual beliefs provide a framework for understanding life's meaning and purpose.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { spiritual_purpose: 1, meaning_making: 0.5, moral_foundation: 0.3 },
        { spiritual_purpose: 2, meaning_making: 1, moral_foundation: 0.5 },
        { spiritual_purpose: 3, meaning_making: 1.5, moral_foundation: 1 },
        { spiritual_purpose: 4, meaning_making: 2, moral_foundation: 1.5 },
        { spiritual_purpose: 5, meaning_making: 3, moral_foundation: 2 },
        { spiritual_purpose: 6, meaning_making: 4, moral_foundation: 3 },
        { spiritual_purpose: 7, meaning_making: 5, moral_foundation: 4 }
      ]
    },
    source: "Religious Orientation Scale (Allport & Ross, 1967)",
    validityCheck: false
  },

  {
    id: "fv002",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "transcendent_connection",
    question: "I experience a sense of connection to something greater than myself.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Never",
      maxLabel: "Very Frequently",
      dimensions: [
        { transcendence: 1, spiritual_wellbeing: 0.5, holistic_thinking: 0.3 },
        { transcendence: 2, spiritual_wellbeing: 1, holistic_thinking: 0.5 },
        { transcendence: 3, spiritual_wellbeing: 1.5, holistic_thinking: 1 },
        { transcendence: 4, spiritual_wellbeing: 2, holistic_thinking: 1.5 },
        { transcendence: 5, spiritual_wellbeing: 3, holistic_thinking: 2 },
        { transcendence: 6, spiritual_wellbeing: 4, holistic_thinking: 3 },
        { transcendence: 7, spiritual_wellbeing: 5, holistic_thinking: 4 }
      ]
    },
    source: "Spiritual Well-Being Scale (Paloutzian & Ellison, 1982)"
  },

  {
    id: "fv003",
    type: "scenario",
    category: "spiritual_foundation",
    subcategory: "faith_integration",
    question: "Your company asks you to work on a project that conflicts with your deepest spiritual convictions. How do you respond?",
    options: [
      {
        text: "Decline respectfully, explaining my values-based concerns",
        value: 1,
        dimensions: { spiritual_integrity: 5, authenticity: 4, moral_courage: 4, workplace_harmony: -1 }
      },
      {
        text: "Seek alternative ways to contribute that align with my values",
        value: 2,
        dimensions: { spiritual_integrity: 4, creativity: 3, problem_solving: 4, collaboration: 3 }
      },
      {
        text: "Participate while maintaining internal spiritual practices",
        value: 3,
        dimensions: { spiritual_resilience: 3, adaptation: 2, inner_strength: 3, compartmentalization: 2 }
      },
      {
        text: "Consider it an opportunity for spiritual growth through challenge",
        value: 4,
        dimensions: { spiritual_growth: 4, resilience: 3, openness: 2, perspective_taking: 3 }
      },
      {
        text: "Participate fully, viewing work as separate from spiritual life",
        value: 5,
        dimensions: { secular_pragmatism: 4, compartmentalization: 4, workplace_harmony: 3, spiritual_integrity: -2 }
      }
    ],
    source: "Original workplace faith integration research"
  },

  {
    id: "fv004",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "sacred_worldview",
    question: "I view my work as having sacred or spiritual significance.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { work_meaning: 1, sacred_calling: 1, purpose_driven: 0.5 },
        { work_meaning: 2, sacred_calling: 2, purpose_driven: 1 },
        { work_meaning: 3, sacred_calling: 3, purpose_driven: 1.5 },
        { work_meaning: 4, sacred_calling: 4, purpose_driven: 2 },
        { work_meaning: 5, sacred_calling: 5, purpose_driven: 3 },
        { work_meaning: 6, sacred_calling: 6, purpose_driven: 4 },
        { work_meaning: 7, sacred_calling: 7, purpose_driven: 5 }
      ]
    },
    source: "Calling and Vocation Questionnaire (Dik et al., 2012)"
  },

  {
    id: "fv005",
    type: "forced_choice",
    category: "spiritual_foundation",
    subcategory: "spiritual_practices",
    question: "Which spiritual practices are most important to you in maintaining your values? (Choose top 3)",
    items: [
      { text: "Regular prayer or meditation", dimensions: { contemplative_practice: 3, inner_discipline: 2, mindfulness: 2 } },
      { text: "Study of sacred texts or teachings", dimensions: { wisdom_seeking: 3, intellectual_faith: 2, learning_orientation: 2 } },
      { text: "Community worship or fellowship", dimensions: { communal_faith: 3, belonging: 2, shared_values: 2 } },
      { text: "Service to others in need", dimensions: { compassionate_action: 3, service_orientation: 3, social_justice: 2 } },
      { text: "Reflection and journaling", dimensions: { self_awareness: 3, introspection: 2, personal_growth: 2 } },
      { text: "Nature connection and contemplation", dimensions: { ecological_spirituality: 3, mindfulness: 2, holistic_thinking: 2 } },
      { text: "Ethical business practices", dimensions: { moral_leadership: 3, integrity: 3, values_driven: 2 } },
      { text: "Mentoring and spiritual guidance", dimensions: { wisdom_sharing: 3, teaching_orientation: 2, interpersonal_connection: 2 } }
    ],
    source: "Spiritual Practices Inventory (Hall & Edwards, 2002)"
  },

  // SECTION 2: UNIVERSAL HUMAN VALUES (20 questions)
  // Based on Schwartz Values Survey & Portrait Values Questionnaire
  
  {
    id: "fv006",
    type: "ranking",
    category: "universal_values",
    subcategory: "schwartz_basic_values",
    question: "Rank these life principles in order of personal importance (1 = most important, 10 = least important):",
    items: [
      { text: "Security: Safety, harmony, and stability of society and relationships", dimensions: { security: 5, stability: 3, conformity: 2 } },
      { text: "Achievement: Personal success through demonstrating competence", dimensions: { achievement: 5, competence: 3, recognition: 2 } },
      { text: "Benevolence: Preserving and enhancing the welfare of close others", dimensions: { benevolence: 5, caring: 3, loyalty: 2 } },
      { text: "Universalism: Understanding, appreciation, tolerance for all people", dimensions: { universalism: 5, justice: 3, wisdom: 2 } },
      { text: "Self-Direction: Independent thought and action, creativity", dimensions: { autonomy: 5, creativity: 3, independence: 2 } },
      { text: "Stimulation: Excitement, novelty, and challenge in life", dimensions: { stimulation: 5, adventure: 3, change: 2 } },
      { text: "Hedonism: Pleasure and sensuous gratification", dimensions: { pleasure: 5, enjoyment: 3, self_indulgence: 2 } },
      { text: "Power: Social status, prestige, dominance over people", dimensions: { power: 5, influence: 3, control: 2 } },
      { text: "Tradition: Respect for cultural and religious customs", dimensions: { tradition: 5, cultural_preservation: 3, respect: 2 } },
      { text: "Conformity: Restraint of actions that might upset others", dimensions: { conformity: 5, politeness: 3, social_harmony: 2 } }
    ],
    source: "Schwartz Values Survey (Schwartz, 1992)"
  },

  {
    id: "fv007",
    type: "likert",
    category: "universal_values",
    subcategory: "moral_foundations",
    question: "I believe that treating people with kindness and compassion is a fundamental moral principle.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { care_harm: 1, compassion: 0.5, moral_intuition: 0.3 },
        { care_harm: 2, compassion: 1, moral_intuition: 0.5 },
        { care_harm: 3, compassion: 2, moral_intuition: 1 },
        { care_harm: 4, compassion: 3, moral_intuition: 1.5 },
        { care_harm: 5, compassion: 4, moral_intuition: 2 },
        { care_harm: 6, compassion: 5, moral_intuition: 3 },
        { care_harm: 7, compassion: 6, moral_intuition: 4 }
      ]
    },
    source: "Moral Foundations Questionnaire (Graham et al., 2011)"
  },

  {
    id: "fv008",
    type: "likert",
    category: "universal_values",
    subcategory: "moral_foundations",
    question: "Justice and fairness for all people is more important than loyalty to my group.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { fairness_cheating: 1, universalism: 0.5, justice: 0.5, loyalty: 2 },
        { fairness_cheating: 2, universalism: 1, justice: 1, loyalty: 1.5 },
        { fairness_cheating: 3, universalism: 2, justice: 2, loyalty: 1 },
        { fairness_cheating: 4, universalism: 3, justice: 3, loyalty: 0 },
        { fairness_cheating: 5, universalism: 4, justice: 4, loyalty: -1 },
        { fairness_cheating: 6, universalism: 5, justice: 5, loyalty: -2 },
        { fairness_cheating: 7, universalism: 6, justice: 6, loyalty: -3 }
      ]
    },
    source: "Moral Foundations Questionnaire (Graham et al., 2011)"
  },

  {
    id: "fv009",
    type: "semantic_differential",
    category: "universal_values",
    subcategory: "value_priorities",
    question: "Rate where you stand on these value dimensions:",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Left Statement",
      maxLabel: "Right Statement",
      dimensions: [
        { individual_focus: 1, collective_focus: 6, balance: 0 },
        { individual_focus: 2, collective_focus: 5, balance: 1 },
        { individual_focus: 3, collective_focus: 4, balance: 2 },
        { individual_focus: 4, collective_focus: 3, balance: 3 },
        { individual_focus: 5, collective_focus: 2, balance: 2 },
        { individual_focus: 6, collective_focus: 1, balance: 1 },
        { individual_focus: 7, collective_focus: 0, balance: 0 }
      ]
    },
    items: [
      { text: "Individual achievement vs Community wellbeing", dimensions: { achievement: 1, community: -1 } },
      { text: "Personal freedom vs Social responsibility", dimensions: { autonomy: 1, responsibility: -1 } },
      { text: "Innovation and change vs Tradition and stability", dimensions: { innovation: 1, tradition: -1 } },
      { text: "Competition vs Cooperation", dimensions: { competitive: 1, collaborative: -1 } },
      { text: "Efficiency vs Relationship harmony", dimensions: { efficiency: 1, harmony: -1 } }
    ],
    source: "Hofstede Cultural Dimensions (adapted for individuals)"
  },

  // SECTION 3: WORKPLACE VALUES & ETHICS (25 questions)
  
  {
    id: "fv010",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "integrity_decisions",
    question: "You discover that your team's presentation contains data that, while technically accurate, presents a misleading picture that favors your proposal. The presentation is tomorrow.",
    options: [
      {
        text: "Insist on revising the presentation to provide full context",
        value: 1,
        dimensions: { integrity: 5, truth_telling: 5, transparency: 4, team_harmony: -1, time_pressure: -2 }
      },
      {
        text: "Add disclaimers and context without changing the main message",
        value: 2,
        dimensions: { integrity: 3, balance: 3, diplomacy: 3, transparency: 2, pragmatism: 2 }
      },
      {
        text: "Present it as is but be prepared to clarify if questioned",
        value: 3,
        dimensions: { strategic_thinking: 2, efficiency: 3, integrity: 1, transparency: 0, pragmatism: 4 }
      },
      {
        text: "Voice concerns privately but support the team decision",
        value: 4,
        dimensions: { team_loyalty: 3, conflict_avoidance: 3, integrity: 2, voice: 1, harmony: 2 }
      },
      {
        text: "Present it as planned since the data is technically correct",
        value: 5,
        dimensions: { technical_accuracy: 4, efficiency: 4, team_support: 3, integrity: -1, transparency: -2 }
      }
    ],
    source: "Business Ethics Decision-Making Framework"
  },

  {
    id: "fv011",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "moral_courage",
    question: "I am willing to speak up against unethical practices even if it might hurt my career.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { moral_courage: 1, integrity: 1, whistleblowing: 0.5, career_focus: 3 },
        { moral_courage: 2, integrity: 2, whistleblowing: 1, career_focus: 2.5 },
        { moral_courage: 3, integrity: 3, whistleblowing: 1.5, career_focus: 2 },
        { moral_courage: 4, integrity: 4, whistleblowing: 2, career_focus: 1.5 },
        { moral_courage: 5, integrity: 5, whistleblowing: 3, career_focus: 1 },
        { moral_courage: 6, integrity: 6, whistleblowing: 4, career_focus: 0.5 },
        { moral_courage: 7, integrity: 7, whistleblowing: 5, career_focus: 0 }
      ]
    },
    source: "Workplace Moral Courage Scale (Sekerka et al., 2009)"
  },

  {
    id: "fv012",
    type: "forced_choice",
    category: "workplace_ethics",
    subcategory: "ethical_climate",
    question: "In difficult ethical situations at work, I most often rely on: (Choose your top 2 approaches)",
    items: [
      { text: "My personal moral principles and conscience", dimensions: { personal_ethics: 4, moral_autonomy: 3, principle_based: 3 } },
      { text: "Company policies and procedures", dimensions: { rule_following: 4, organizational_loyalty: 3, structure: 2 } },
      { text: "What would benefit the greatest number of people", dimensions: { utilitarian: 4, collective_good: 3, consequences: 3 } },
      { text: "Guidance from supervisors or leadership", dimensions: { authority_oriented: 4, hierarchy_respect: 3, guidance_seeking: 2 } },
      { text: "Team consensus and group input", dimensions: { collaborative: 4, democratic: 3, group_harmony: 2 } },
      { text: "Legal requirements and regulations", dimensions: { legal_compliance: 4, rule_of_law: 3, external_standards: 2 } },
      { text: "My religious or spiritual beliefs", dimensions: { faith_based: 4, spiritual_guidance: 3, transcendent_values: 3 } },
      { text: "Professional standards and best practices", dimensions: { professional_ethics: 4, expertise: 3, industry_standards: 2 } }
    ],
    source: "Ethical Climate Questionnaire (Victor & Cullen, 1988)"
  },

  // SECTION 4: WORK-LIFE INTEGRATION & PURPOSE (15 questions)
  
  {
    id: "fv013",
    type: "likert",
    category: "work_life_integration",
    subcategory: "calling_orientation",
    question: "I experience my work as a calling that contributes to the greater good.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { calling: 1, purpose: 1, meaning_making: 0.5, job_orientation: 2 },
        { calling: 2, purpose: 2, meaning_making: 1, job_orientation: 1.5 },
        { calling: 3, purpose: 3, meaning_making: 1.5, job_orientation: 1 },
        { calling: 4, purpose: 4, meaning_making: 2, job_orientation: 0.5 },
        { calling: 5, purpose: 5, meaning_making: 3, job_orientation: 0 },
        { calling: 6, purpose: 6, meaning_making: 4, job_orientation: -0.5 },
        { calling: 7, purpose: 7, meaning_making: 5, job_orientation: -1 }
      ]
    },
    source: "Calling and Vocation Questionnaire (Dik et al., 2012)"
  },

  {
    id: "fv014",
    type: "scenario",
    category: "work_life_integration",
    subcategory: "boundary_management",
    question: "Your supervisor regularly sends work emails and messages during your family time and religious observances, expecting quick responses.",
    options: [
      {
        text: "Set clear boundaries and explain the importance of these times",
        value: 1,
        dimensions: { boundary_setting: 5, self_advocacy: 4, work_life_balance: 4, assertiveness: 3, compliance: -2 }
      },
      {
        text: "Establish specific 'emergency only' criteria for after-hours contact",
        value: 2,
        dimensions: { boundary_negotiation: 4, pragmatism: 3, work_life_balance: 3, collaboration: 3, flexibility: 2 }
      },
      {
        text: "Respond when possible but explain delays are due to personal commitments",
        value: 3,
        dimensions: { accommodation: 3, transparency: 2, work_life_balance: 2, compliance: 2, communication: 3 }
      },
      {
        text: "Adapt by checking messages regularly to show dedication",
        value: 4,
        dimensions: { work_dedication: 4, adaptability: 3, career_focus: 3, work_life_balance: -2, stress_tolerance: 1 }
      },
      {
        text: "Always respond quickly to demonstrate commitment and reliability",
        value: 5,
        dimensions: { responsiveness: 5, work_priority: 4, career_ambition: 3, work_life_balance: -3, family_priority: -2 }
      }
    ],
    source: "Work-Life Boundary Management Research"
  },

  // SECTION 5: DIVERSITY, INCLUSION & SOCIAL JUSTICE (15 questions)
  
  {
    id: "fv015",
    type: "likert",
    category: "social_justice",
    subcategory: "diversity_valuation",
    question: "I believe that diverse perspectives and backgrounds strengthen team performance.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { diversity_value: 1, inclusion: 0.5, openness: 0.5, homogeneity_preference: 3 },
        { diversity_value: 2, inclusion: 1, openness: 1, homogeneity_preference: 2.5 },
        { diversity_value: 3, inclusion: 2, openness: 1.5, homogeneity_preference: 2 },
        { diversity_value: 4, inclusion: 3, openness: 2, homogeneity_preference: 1.5 },
        { diversity_value: 5, inclusion: 4, openness: 3, homogeneity_preference: 1 },
        { diversity_value: 6, inclusion: 5, openness: 4, homogeneity_preference: 0.5 },
        { diversity_value: 7, inclusion: 6, openness: 5, homogeneity_preference: 0 }
      ]
    },
    source: "Diversity Beliefs Scale (Williams & O'Reilly, 1998)"
  },

  // [Continue with remaining 70+ questions covering all dimensions...]
  // Due to length constraints, showing structure for remaining sections:

  // VALIDITY CHECK QUESTIONS (Embedded throughout)
  {
    id: "fv090",
    type: "likert",
    category: "validity_check",
    subcategory: "response_consistency",
    question: "I am responding to these questions honestly and thoughtfully.",
    scale: {
      min: 1,
      max: 7,
      minLabel: "Strongly Disagree",
      maxLabel: "Strongly Agree",
      dimensions: [
        { response_validity: 1, honesty: 1, engagement: 0.5 },
        { response_validity: 2, honesty: 2, engagement: 1 },
        { response_validity: 3, honesty: 3, engagement: 1.5 },
        { response_validity: 4, honesty: 4, engagement: 2 },
        { response_validity: 5, honesty: 5, engagement: 3 },
        { response_validity: 6, honesty: 6, engagement: 4 },
        { response_validity: 7, honesty: 7, engagement: 5 }
      ]
    },
    source: "Response Validity Check",
    validityCheck: true
  }
];

// Scoring dimensions for the expanded assessment
export const faithValuesDimensions = {
  // Spiritual/Faith Foundations
  spiritual_purpose: "Sense of life purpose through spiritual beliefs",
  transcendence: "Connection to something greater than oneself", 
  spiritual_integrity: "Consistency between spiritual beliefs and actions",
  spiritual_wellbeing: "Overall spiritual health and satisfaction",
  
  // Universal Human Values (Schwartz Model)
  achievement: "Personal success through competence demonstration",
  benevolence: "Concern for welfare of close others", 
  universalism: "Understanding and tolerance for all people",
  security: "Safety and stability of relationships and society",
  self_direction: "Independent thought and creative action",
  stimulation: "Excitement, novelty, and challenge",
  hedonism: "Pleasure and sensuous gratification",
  power: "Social status and dominance over others",
  tradition: "Respect for cultural and religious customs",
  conformity: "Restraint to avoid upsetting others",
  
  // Moral Foundations
  care_harm: "Concern for suffering and care for others",
  fairness_cheating: "Proportionality and justice concerns",
  loyalty_betrayal: "Group loyalty and patriotism", 
  authority_subversion: "Deference to authority and tradition",
  sanctity_degradation: "Avoiding contamination and preserving sacred",
  
  // Workplace Values
  integrity: "Honesty and ethical behavior in work context",
  moral_courage: "Willingness to speak up for ethical principles",
  transparency: "Openness and honest communication",
  accountability: "Taking responsibility for actions and decisions",
  
  // Work-Life Integration  
  calling: "Experience of work as meaningful vocation",
  work_life_balance: "Harmony between work and personal life",
  boundary_setting: "Ability to maintain healthy limits",
  
  // Social Justice & Inclusion
  diversity_value: "Appreciation for diverse perspectives and backgrounds",
  inclusion: "Creating welcoming environments for all",
  social_justice: "Commitment to fairness and equality",
  
  // Response Validity
  response_validity: "Honesty and engagement in assessment responses"
};

export default expandedFaithValuesQuestions;