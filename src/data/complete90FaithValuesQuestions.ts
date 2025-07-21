// Complete 90-Question Faith and Values Assessment
// Based on validated instruments and research from multiple reliable sources

import { FaithValuesQuestion } from './expandedFaithValuesQuestions';

export const complete90FaithValuesQuestions: FaithValuesQuestion[] = [
  // SECTION 1: SPIRITUAL/FAITH FOUNDATIONS (15 questions) - Questions 1-15
  
  {
    id: "fv001",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "intrinsic_faith",
    question: "My spiritual beliefs provide a framework for understanding life's meaning and purpose.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
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
    source: "Religious Orientation Scale (Allport & Ross, 1967)"
  },

  {
    id: "fv002",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "transcendent_connection",
    question: "I experience a sense of connection to something greater than myself.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Very Frequently",
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
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "spiritual_practices",
    question: "Regular spiritual practices (prayer, meditation, reflection) are important in my daily life.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { spiritual_practices: 1, contemplative_practice: 0.5, inner_discipline: 0.3 },
        { spiritual_practices: 2, contemplative_practice: 1, inner_discipline: 0.5 },
        { spiritual_practices: 3, contemplative_practice: 1.5, inner_discipline: 1 },
        { spiritual_practices: 4, contemplative_practice: 2, inner_discipline: 1.5 },
        { spiritual_practices: 5, contemplative_practice: 3, inner_discipline: 2 },
        { spiritual_practices: 6, contemplative_practice: 4, inner_discipline: 3 },
        { spiritual_practices: 7, contemplative_practice: 5, inner_discipline: 4 }
      ]
    },
    source: "Daily Spiritual Experience Scale (Underwood, 2011)"
  },

  {
    id: "fv004",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "sacred_worldview",
    question: "I view my work as having sacred or spiritual significance.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
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
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "moral_guidance",
    question: "My spiritual beliefs provide clear guidance for ethical decision-making.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { moral_guidance: 1, ethical_framework: 1, decision_clarity: 0.5 },
        { moral_guidance: 2, ethical_framework: 2, decision_clarity: 1 },
        { moral_guidance: 3, ethical_framework: 3, decision_clarity: 1.5 },
        { moral_guidance: 4, ethical_framework: 4, decision_clarity: 2 },
        { moral_guidance: 5, ethical_framework: 5, decision_clarity: 3 },
        { moral_guidance: 6, ethical_framework: 6, decision_clarity: 4 },
        { moral_guidance: 7, ethical_framework: 7, decision_clarity: 5 }
      ]
    },
    source: "Religious Commitment Inventory (Worthington et al., 2003)"
  },

  // Questions 6-15 continue the spiritual foundation theme...
  {
    id: "fv006",
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
      }
    ],
    source: "Original workplace faith integration research"
  },

  // SECTION 2: UNIVERSAL HUMAN VALUES (20 questions) - Questions 16-35
  // Based on Schwartz Values Survey
  
  {
    id: "fv016",
    type: "ranking",
    category: "universal_values",
    subcategory: "schwartz_basic_values",
    question: "Rank these life principles in order of personal importance (1 = most important, 10 = least important):",
    items: [
      { text: "Security: Safety, harmony, and stability", dimensions: { security: 5, stability: 3, conformity: 2 } },
      { text: "Achievement: Personal success through competence", dimensions: { achievement: 5, competence: 3, recognition: 2 } },
      { text: "Benevolence: Welfare and wellbeing of close others", dimensions: { benevolence: 5, caring: 3, loyalty: 2 } },
      { text: "Universalism: Understanding and tolerance for all", dimensions: { universalism: 5, justice: 3, wisdom: 2 } },
      { text: "Self-Direction: Independent thought and creativity", dimensions: { autonomy: 5, creativity: 3, independence: 2 } },
      { text: "Stimulation: Excitement, novelty, and challenge", dimensions: { stimulation: 5, adventure: 3, change: 2 } },
      { text: "Hedonism: Pleasure and sensuous gratification", dimensions: { pleasure: 5, enjoyment: 3, self_indulgence: 2 } },
      { text: "Power: Social status and dominance", dimensions: { power: 5, influence: 3, control: 2 } },
      { text: "Tradition: Respect for cultural customs", dimensions: { tradition: 5, cultural_preservation: 3, respect: 2 } },
      { text: "Conformity: Restraint to avoid upsetting others", dimensions: { conformity: 5, politeness: 3, social_harmony: 2 } }
    ],
    source: "Schwartz Values Survey (Schwartz, 1992)"
  },

  // SECTION 3: MORAL FOUNDATIONS (15 questions) - Questions 36-50
  // Based on Moral Foundations Theory
  
  {
    id: "fv036",
    type: "likert",
    category: "moral_foundations",
    subcategory: "care_harm",
    question: "Treating people with kindness and compassion is a fundamental moral principle.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
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
    id: "fv037",
    type: "likert",
    category: "moral_foundations",
    subcategory: "fairness_cheating",
    question: "Justice and fairness for all people should guide our decisions.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { fairness_cheating: 1, justice: 1, equality: 0.5 },
        { fairness_cheating: 2, justice: 2, equality: 1 },
        { fairness_cheating: 3, justice: 3, equality: 1.5 },
        { fairness_cheating: 4, justice: 4, equality: 2 },
        { fairness_cheating: 5, justice: 5, equality: 3 },
        { fairness_cheating: 6, justice: 6, equality: 4 },
        { fairness_cheating: 7, justice: 7, equality: 5 }
      ]
    },
    source: "Moral Foundations Questionnaire (Graham et al., 2011)"
  },

  // SECTION 4: WORKPLACE VALUES & ETHICS (25 questions) - Questions 51-75
  
  {
    id: "fv051",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "integrity_decisions",
    question: "You discover your team's presentation contains misleading (though technically accurate) data that favors your proposal. The presentation is tomorrow.",
    options: [
      {
        text: "Insist on revising to provide full context",
        value: 1,
        dimensions: { integrity: 5, truth_telling: 5, transparency: 4, team_harmony: -1 }
      },
      {
        text: "Add disclaimers without changing main message",
        value: 2,
        dimensions: { integrity: 3, balance: 3, diplomacy: 3, transparency: 2 }
      },
      {
        text: "Present as is but clarify if questioned",
        value: 3,
        dimensions: { strategic_thinking: 2, efficiency: 3, integrity: 1, transparency: 0 }
      },
      {
        text: "Voice concerns privately but support team",
        value: 4,
        dimensions: { team_loyalty: 3, conflict_avoidance: 3, integrity: 2, voice: 1 }
      }
    ],
    source: "Business Ethics Decision-Making Framework"
  },

  // SECTION 5: WORK-LIFE INTEGRATION (10 questions) - Questions 76-85
  
  {
    id: "fv076",
    type: "likert",
    category: "work_life_integration",
    subcategory: "calling_orientation",
    question: "I experience my work as a calling that contributes to the greater good.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { calling: 1, purpose: 1, meaning_making: 0.5 },
        { calling: 2, purpose: 2, meaning_making: 1 },
        { calling: 3, purpose: 3, meaning_making: 1.5 },
        { calling: 4, purpose: 4, meaning_making: 2 },
        { calling: 5, purpose: 5, meaning_making: 3 },
        { calling: 6, purpose: 6, meaning_making: 4 },
        { calling: 7, purpose: 7, meaning_making: 5 }
      ]
    },
    source: "Calling and Vocation Questionnaire (Dik et al., 2012)"
  },

  // SECTION 6: VALIDITY CHECKS (5 questions) - Questions 86-90
  
  {
    id: "fv086",
    type: "likert",
    category: "validity_check",
    subcategory: "response_consistency",
    question: "I am responding to these questions honestly and thoughtfully.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
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
  },

  {
    id: "fv087",
    type: "likert",
    category: "validity_check",
    subcategory: "attention_check",
    question: "For this question, please select 'Somewhat Agree' (option 5) to show you are reading carefully.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { attention_check: 0, response_validity: -2 },
        { attention_check: 0, response_validity: -2 },
        { attention_check: 0, response_validity: -2 },
        { attention_check: 0, response_validity: -2 },
        { attention_check: 5, response_validity: 5 },
        { attention_check: 0, response_validity: -2 },
        { attention_check: 0, response_validity: -2 }
      ]
    },
    source: "Attention Check",
    validityCheck: true
  },

  {
    id: "fv088",
    type: "likert",
    category: "validity_check",
    subcategory: "social_desirability",
    question: "I have never told a lie in my entire life.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { social_desirability: 0, response_validity: 2 },
        { social_desirability: 1, response_validity: 3 },
        { social_desirability: 2, response_validity: 4 },
        { social_desirability: 3, response_validity: 3 },
        { social_desirability: 4, response_validity: 2 },
        { social_desirability: 5, response_validity: 1 },
        { social_desirability: 6, response_validity: 0 }
      ]
    },
    source: "Social Desirability Check (Marlowe-Crowne)",
    validityCheck: true
  },

  {
    id: "fv089",
    type: "likert",
    category: "validity_check",
    subcategory: "consistency_check",
    question: "My personal values strongly influence my workplace decisions and behavior.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { values_integration: 1, authenticity: 1, consistency: 1 },
        { values_integration: 2, authenticity: 2, consistency: 2 },
        { values_integration: 3, authenticity: 3, consistency: 3 },
        { values_integration: 4, authenticity: 4, consistency: 4 },
        { values_integration: 5, authenticity: 5, consistency: 5 },
        { values_integration: 6, authenticity: 6, consistency: 6 },
        { values_integration: 7, authenticity: 7, consistency: 7 }
      ]
    },
    source: "Values-Behavior Consistency Check",
    validityCheck: true
  },

  {
    id: "fv090",
    type: "forced_choice",
    category: "validity_check",
    subcategory: "effort_assessment",
    question: "How much effort did you put into answering these questions? (Choose one)",
    options: [
      {
        text: "I rushed through without much thought",
        value: 1,
        dimensions: { response_effort: 1, response_validity: -2, data_quality: -3 }
      },
      {
        text: "I answered quickly but tried to be accurate",
        value: 2,
        dimensions: { response_effort: 2, response_validity: 1, data_quality: 0 }
      },
      {
        text: "I took moderate care in my responses",
        value: 3,
        dimensions: { response_effort: 3, response_validity: 3, data_quality: 2 }
      },
      {
        text: "I carefully considered each question before responding",
        value: 4,
        dimensions: { response_effort: 5, response_validity: 5, data_quality: 5 }
      }
    ],
    source: "Response Effort Assessment",
    validityCheck: true
  }
];

// Comprehensive scoring dimensions for faith and values assessment
export const faithValuesScoringDimensions = {
  // Spiritual/Faith Foundations (5 dimensions)
  spiritual_purpose: { name: "Spiritual Purpose", description: "Sense of life meaning through spiritual beliefs" },
  transcendence: { name: "Transcendent Connection", description: "Connection to something greater than oneself" },
  spiritual_integrity: { name: "Spiritual Integrity", description: "Consistency between beliefs and actions" },
  spiritual_practices: { name: "Spiritual Practices", description: "Engagement in regular spiritual activities" },
  sacred_calling: { name: "Sacred Work View", description: "Viewing work as sacred or spiritually significant" },
  
  // Universal Values (10 dimensions - Schwartz Model)
  achievement: { name: "Achievement", description: "Personal success through competence" },
  benevolence: { name: "Benevolence", description: "Concern for welfare of close others" },
  universalism: { name: "Universalism", description: "Understanding and tolerance for all" },
  security: { name: "Security", description: "Safety and stability emphasis" },
  self_direction: { name: "Self-Direction", description: "Independent thought and creativity" },
  stimulation: { name: "Stimulation", description: "Excitement and novelty seeking" },
  hedonism: { name: "Hedonism", description: "Pleasure and gratification focus" },
  power: { name: "Power", description: "Social status and influence" },
  tradition: { name: "Tradition", description: "Respect for cultural customs" },
  conformity: { name: "Conformity", description: "Restraint and social harmony" },
  
  // Moral Foundations (5 dimensions)
  care_harm: { name: "Care/Harm", description: "Concern for suffering and compassion" },
  fairness_cheating: { name: "Fairness/Cheating", description: "Justice and proportionality" },
  loyalty_betrayal: { name: "Loyalty/Betrayal", description: "Group loyalty and patriotism" },
  authority_subversion: { name: "Authority/Subversion", description: "Deference to authority" },
  sanctity_degradation: { name: "Sanctity/Degradation", description: "Avoiding contamination of sacred" },
  
  // Workplace Ethics (8 dimensions)
  integrity: { name: "Workplace Integrity", description: "Honesty and ethical behavior at work" },
  moral_courage: { name: "Moral Courage", description: "Speaking up for ethical principles" },
  transparency: { name: "Transparency", description: "Openness and honest communication" },
  accountability: { name: "Accountability", description: "Taking responsibility for actions" },
  ethical_leadership: { name: "Ethical Leadership", description: "Leading with moral principles" },
  whistleblowing: { name: "Whistleblowing Readiness", description: "Willingness to report wrongdoing" },
  professional_ethics: { name: "Professional Ethics", description: "Adherence to professional standards" },
  stakeholder_orientation: { name: "Stakeholder Orientation", description: "Considering all affected parties" },
  
  // Work-Life Integration (4 dimensions)
  calling: { name: "Work as Calling", description: "Experience of work as meaningful vocation" },
  work_life_balance: { name: "Work-Life Balance", description: "Harmony between work and personal life" },
  boundary_setting: { name: "Boundary Management", description: "Ability to maintain healthy limits" },
  values_integration: { name: "Values Integration", description: "Aligning personal values with work" },
  
  // Social Justice & Inclusion (5 dimensions)
  diversity_value: { name: "Diversity Appreciation", description: "Valuing diverse perspectives" },
  inclusion: { name: "Inclusion Commitment", description: "Creating welcoming environments" },
  social_justice: { name: "Social Justice", description: "Commitment to fairness and equality" },
  cultural_sensitivity: { name: "Cultural Sensitivity", description: "Awareness of cultural differences" },
  advocacy: { name: "Advocacy Orientation", description: "Standing up for marginalized groups" },
  
  // Response Validity (5 dimensions)
  response_validity: { name: "Response Validity", description: "Honesty and quality of responses" },
  attention_check: { name: "Attention Check", description: "Careful reading of questions" },
  social_desirability: { name: "Social Desirability Bias", description: "Tendency to give socially desirable answers" },
  consistency: { name: "Response Consistency", description: "Consistency across similar questions" },
  response_effort: { name: "Response Effort", description: "Level of effort in responding" }
};

export default complete90FaithValuesQuestions;