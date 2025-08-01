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

  {
    id: "fv007",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "divine_relationship",
    question: "I have a personal relationship with God or a higher power.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { divine_relationship: 1, personal_faith: 1, spiritual_intimacy: 0.5 },
        { divine_relationship: 2, personal_faith: 2, spiritual_intimacy: 1 },
        { divine_relationship: 3, personal_faith: 3, spiritual_intimacy: 1.5 },
        { divine_relationship: 4, personal_faith: 4, spiritual_intimacy: 2 },
        { divine_relationship: 5, personal_faith: 5, spiritual_intimacy: 3 },
        { divine_relationship: 6, personal_faith: 6, spiritual_intimacy: 4 },
        { divine_relationship: 7, personal_faith: 7, spiritual_intimacy: 5 }
      ]
    },
    source: "Spiritual Assessment Inventory (Hall & Edwards, 1996)"
  },

  {
    id: "fv008",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "spiritual_growth",
    question: "I am committed to ongoing spiritual growth and development.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { spiritual_growth: 1, self_development: 1, lifelong_learning: 0.5 },
        { spiritual_growth: 2, self_development: 2, lifelong_learning: 1 },
        { spiritual_growth: 3, self_development: 3, lifelong_learning: 1.5 },
        { spiritual_growth: 4, self_development: 4, lifelong_learning: 2 },
        { spiritual_growth: 5, self_development: 5, lifelong_learning: 3 },
        { spiritual_growth: 6, self_development: 6, lifelong_learning: 4 },
        { spiritual_growth: 7, self_development: 7, lifelong_learning: 5 }
      ]
    },
    source: "Spiritual Growth Assessment"
  },

  {
    id: "fv009",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "faith_community",
    question: "Being part of a faith community is important to my spiritual life.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { community_connection: 1, religious_involvement: 1, social_support: 0.5 },
        { community_connection: 2, religious_involvement: 2, social_support: 1 },
        { community_connection: 3, religious_involvement: 3, social_support: 1.5 },
        { community_connection: 4, religious_involvement: 4, social_support: 2 },
        { community_connection: 5, religious_involvement: 5, social_support: 3 },
        { community_connection: 6, religious_involvement: 6, social_support: 4 },
        { community_connection: 7, religious_involvement: 7, social_support: 5 }
      ]
    },
    source: "Religious Involvement Inventory"
  },

  {
    id: "fv010",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "spiritual_coping",
    question: "I turn to my spiritual beliefs when facing difficult situations.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { spiritual_coping: 1, faith_resilience: 1, stress_management: 0.5 },
        { spiritual_coping: 2, faith_resilience: 2, stress_management: 1 },
        { spiritual_coping: 3, faith_resilience: 3, stress_management: 1.5 },
        { spiritual_coping: 4, faith_resilience: 4, stress_management: 2 },
        { spiritual_coping: 5, faith_resilience: 5, stress_management: 3 },
        { spiritual_coping: 6, faith_resilience: 6, stress_management: 4 },
        { spiritual_coping: 7, faith_resilience: 7, stress_management: 5 }
      ]
    },
    source: "Brief RCOPE Scale (Pargament et al., 2011)"
  },

  {
    id: "fv011",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "sacred_texts",
    question: "Sacred texts or spiritual writings provide guidance for my life decisions.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { scriptural_guidance: 1, wisdom_seeking: 1, textual_authority: 0.5 },
        { scriptural_guidance: 2, wisdom_seeking: 2, textual_authority: 1 },
        { scriptural_guidance: 3, wisdom_seeking: 3, textual_authority: 1.5 },
        { scriptural_guidance: 4, wisdom_seeking: 4, textual_authority: 2 },
        { scriptural_guidance: 5, wisdom_seeking: 5, textual_authority: 3 },
        { scriptural_guidance: 6, wisdom_seeking: 6, textual_authority: 4 },
        { scriptural_guidance: 7, wisdom_seeking: 7, textual_authority: 5 }
      ]
    },
    source: "Scriptural Reasoning Scale"
  },

  {
    id: "fv012",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "worship_expression",
    question: "Worship and spiritual expression are meaningful parts of my life.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { worship_engagement: 1, spiritual_expression: 1, devotional_life: 0.5 },
        { worship_engagement: 2, spiritual_expression: 2, devotional_life: 1 },
        { worship_engagement: 3, spiritual_expression: 3, devotional_life: 1.5 },
        { worship_engagement: 4, spiritual_expression: 4, devotional_life: 2 },
        { worship_engagement: 5, spiritual_expression: 5, devotional_life: 3 },
        { worship_engagement: 6, spiritual_expression: 6, devotional_life: 4 },
        { worship_engagement: 7, spiritual_expression: 7, devotional_life: 5 }
      ]
    },
    source: "Worship Styles Inventory"
  },

  {
    id: "fv013",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "spiritual_discernment",
    question: "I seek spiritual discernment when making important decisions.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { spiritual_discernment: 1, prayerful_decision: 1, divine_guidance: 0.5 },
        { spiritual_discernment: 2, prayerful_decision: 2, divine_guidance: 1 },
        { spiritual_discernment: 3, prayerful_decision: 3, divine_guidance: 1.5 },
        { spiritual_discernment: 4, prayerful_decision: 4, divine_guidance: 2 },
        { spiritual_discernment: 5, prayerful_decision: 5, divine_guidance: 3 },
        { spiritual_discernment: 6, prayerful_decision: 6, divine_guidance: 4 },
        { spiritual_discernment: 7, prayerful_decision: 7, divine_guidance: 5 }
      ]
    },
    source: "Spiritual Discernment Scale"
  },

  {
    id: "fv014",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "eternal_perspective",
    question: "I consider the eternal significance of my actions and decisions.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { eternal_perspective: 1, long_term_thinking: 1, transcendent_values: 0.5 },
        { eternal_perspective: 2, long_term_thinking: 2, transcendent_values: 1 },
        { eternal_perspective: 3, long_term_thinking: 3, transcendent_values: 1.5 },
        { eternal_perspective: 4, long_term_thinking: 4, transcendent_values: 2 },
        { eternal_perspective: 5, long_term_thinking: 5, transcendent_values: 3 },
        { eternal_perspective: 6, long_term_thinking: 6, transcendent_values: 4 },
        { eternal_perspective: 7, long_term_thinking: 7, transcendent_values: 5 }
      ]
    },
    source: "Eternal Perspective Assessment"
  },

  {
    id: "fv015",
    type: "likert",
    category: "spiritual_foundation",
    subcategory: "spiritual_transformation",
    question: "My spiritual journey has transformed how I see myself and others.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { spiritual_transformation: 1, personal_change: 1, worldview_shift: 0.5 },
        { spiritual_transformation: 2, personal_change: 2, worldview_shift: 1 },
        { spiritual_transformation: 3, personal_change: 3, worldview_shift: 1.5 },
        { spiritual_transformation: 4, personal_change: 4, worldview_shift: 2 },
        { spiritual_transformation: 5, personal_change: 5, worldview_shift: 3 },
        { spiritual_transformation: 6, personal_change: 6, worldview_shift: 4 },
        { spiritual_transformation: 7, personal_change: 7, worldview_shift: 5 }
      ]
    },
    source: "Spiritual Transformation Scale"
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

  {
    id: "fv017",
    type: "likert",
    category: "universal_values",
    subcategory: "achievement_orientation",
    question: "Being successful and achieving my goals is very important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { achievement: 1, goal_orientation: 1, success_drive: 0.5 },
        { achievement: 2, goal_orientation: 2, success_drive: 1 },
        { achievement: 3, goal_orientation: 3, success_drive: 1.5 },
        { achievement: 4, goal_orientation: 4, success_drive: 2 },
        { achievement: 5, goal_orientation: 5, success_drive: 3 },
        { achievement: 6, goal_orientation: 6, success_drive: 4 },
        { achievement: 7, goal_orientation: 7, success_drive: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv018",
    type: "likert",
    category: "universal_values",
    subcategory: "benevolence_caring",
    question: "Helping and supporting the people close to me is a priority.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { benevolence: 1, caring: 1, helpfulness: 0.5 },
        { benevolence: 2, caring: 2, helpfulness: 1 },
        { benevolence: 3, caring: 3, helpfulness: 1.5 },
        { benevolence: 4, caring: 4, helpfulness: 2 },
        { benevolence: 5, caring: 5, helpfulness: 3 },
        { benevolence: 6, caring: 6, helpfulness: 4 },
        { benevolence: 7, caring: 7, helpfulness: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv019",
    type: "likert",
    category: "universal_values",
    subcategory: "universalism_justice",
    question: "Equal opportunities and justice for everyone in society matter to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { universalism: 1, justice: 1, equality: 0.5 },
        { universalism: 2, justice: 2, equality: 1 },
        { universalism: 3, justice: 3, equality: 1.5 },
        { universalism: 4, justice: 4, equality: 2 },
        { universalism: 5, justice: 5, equality: 3 },
        { universalism: 6, justice: 6, equality: 4 },
        { universalism: 7, justice: 7, equality: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv020",
    type: "likert",
    category: "universal_values",
    subcategory: "self_direction",
    question: "Having the freedom to think and act independently is important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { self_direction: 1, autonomy: 1, independence: 0.5 },
        { self_direction: 2, autonomy: 2, independence: 1 },
        { self_direction: 3, autonomy: 3, independence: 1.5 },
        { self_direction: 4, autonomy: 4, independence: 2 },
        { self_direction: 5, autonomy: 5, independence: 3 },
        { self_direction: 6, autonomy: 6, independence: 4 },
        { self_direction: 7, autonomy: 7, independence: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv021",
    type: "likert",
    category: "universal_values",
    subcategory: "security_stability",
    question: "Living in secure surroundings and avoiding risks is important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { security: 1, stability: 1, risk_aversion: 0.5 },
        { security: 2, stability: 2, risk_aversion: 1 },
        { security: 3, stability: 3, risk_aversion: 1.5 },
        { security: 4, stability: 4, risk_aversion: 2 },
        { security: 5, stability: 5, risk_aversion: 3 },
        { security: 6, stability: 6, risk_aversion: 4 },
        { security: 7, stability: 7, risk_aversion: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv022",
    type: "likert",
    category: "universal_values",
    subcategory: "stimulation_adventure",
    question: "Seeking adventure and new experiences excites me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { stimulation: 1, adventure: 1, novelty_seeking: 0.5 },
        { stimulation: 2, adventure: 2, novelty_seeking: 1 },
        { stimulation: 3, adventure: 3, novelty_seeking: 1.5 },
        { stimulation: 4, adventure: 4, novelty_seeking: 2 },
        { stimulation: 5, adventure: 5, novelty_seeking: 3 },
        { stimulation: 6, adventure: 6, novelty_seeking: 4 },
        { stimulation: 7, adventure: 7, novelty_seeking: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv023",
    type: "likert",
    category: "universal_values",
    subcategory: "hedonism_pleasure",
    question: "Enjoying life's pleasures and having a good time matter to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { hedonism: 1, pleasure: 1, enjoyment: 0.5 },
        { hedonism: 2, pleasure: 2, enjoyment: 1 },
        { hedonism: 3, pleasure: 3, enjoyment: 1.5 },
        { hedonism: 4, pleasure: 4, enjoyment: 2 },
        { hedonism: 5, pleasure: 5, enjoyment: 3 },
        { hedonism: 6, pleasure: 6, enjoyment: 4 },
        { hedonism: 7, pleasure: 7, enjoyment: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv024",
    type: "likert",
    category: "universal_values",
    subcategory: "power_influence",
    question: "Having influence and being able to guide others' actions is important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { power: 1, influence: 1, leadership: 0.5 },
        { power: 2, influence: 2, leadership: 1 },
        { power: 3, influence: 3, leadership: 1.5 },
        { power: 4, influence: 4, leadership: 2 },
        { power: 5, influence: 5, leadership: 3 },
        { power: 6, influence: 6, leadership: 4 },
        { power: 7, influence: 7, leadership: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv025",
    type: "likert",
    category: "universal_values",
    subcategory: "tradition_heritage",
    question: "Maintaining traditional values and respecting customs is important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { tradition: 1, heritage: 1, cultural_preservation: 0.5 },
        { tradition: 2, heritage: 2, cultural_preservation: 1 },
        { tradition: 3, heritage: 3, cultural_preservation: 1.5 },
        { tradition: 4, heritage: 4, cultural_preservation: 2 },
        { tradition: 5, heritage: 5, cultural_preservation: 3 },
        { tradition: 6, heritage: 6, cultural_preservation: 4 },
        { tradition: 7, heritage: 7, cultural_preservation: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv026",
    type: "likert",
    category: "universal_values",
    subcategory: "conformity_rules",
    question: "Following rules and behaving properly in social situations is important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { conformity: 1, rule_following: 1, social_appropriateness: 0.5 },
        { conformity: 2, rule_following: 2, social_appropriateness: 1 },
        { conformity: 3, rule_following: 3, social_appropriateness: 1.5 },
        { conformity: 4, rule_following: 4, social_appropriateness: 2 },
        { conformity: 5, rule_following: 5, social_appropriateness: 3 },
        { conformity: 6, rule_following: 6, social_appropriateness: 4 },
        { conformity: 7, rule_following: 7, social_appropriateness: 5 }
      ]
    },
    source: "Portrait Values Questionnaire (Schwartz, 2003)"
  },

  {
    id: "fv027",
    type: "scenario",
    category: "universal_values",
    subcategory: "values_conflict",
    question: "You have an opportunity for a promotion that would require relocating far from family. How do you decide?",
    options: [
      {
        text: "Prioritize family relationships and decline the promotion",
        value: 1,
        dimensions: { benevolence: 5, family_values: 4, loyalty: 3, achievement: -2 }
      },
      {
        text: "Take the promotion to advance my career goals",
        value: 2,
        dimensions: { achievement: 5, self_direction: 3, ambition: 4, benevolence: -1 }
      },
      {
        text: "Negotiate for alternatives that honor both priorities",
        value: 3,
        dimensions: { problem_solving: 4, creativity: 3, balance: 4, diplomatic: 3 }
      },
      {
        text: "Make the decision that provides the most security",
        value: 4,
        dimensions: { security: 5, practical_thinking: 3, stability: 4, risk_aversion: 3 }
      }
    ],
    source: "Values Conflict Resolution"
  },

  {
    id: "fv028",
    type: "likert",
    category: "universal_values",
    subcategory: "fairness_equality",
    question: "Treating all people equally regardless of their background is essential.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { fairness: 1, equality: 1, universalism: 0.5 },
        { fairness: 2, equality: 2, universalism: 1 },
        { fairness: 3, equality: 3, universalism: 1.5 },
        { fairness: 4, equality: 4, universalism: 2 },
        { fairness: 5, equality: 5, universalism: 3 },
        { fairness: 6, equality: 6, universalism: 4 },
        { fairness: 7, equality: 7, universalism: 5 }
      ]
    },
    source: "Universal Values Scale"
  },

  {
    id: "fv029",
    type: "likert",
    category: "universal_values",
    subcategory: "creativity_innovation",
    question: "Being creative and coming up with new ideas energizes me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { creativity: 1, innovation: 1, self_direction: 0.5 },
        { creativity: 2, innovation: 2, self_direction: 1 },
        { creativity: 3, innovation: 3, self_direction: 1.5 },
        { creativity: 4, innovation: 4, self_direction: 2 },
        { creativity: 5, innovation: 5, self_direction: 3 },
        { creativity: 6, innovation: 6, self_direction: 4 },
        { creativity: 7, innovation: 7, self_direction: 5 }
      ]
    },
    source: "Creativity Values Assessment"
  },

  {
    id: "fv030",
    type: "likert",
    category: "universal_values",
    subcategory: "humility_modesty",
    question: "Being humble and not drawing attention to myself is important.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { humility: 1, modesty: 1, self_restraint: 0.5 },
        { humility: 2, modesty: 2, self_restraint: 1 },
        { humility: 3, modesty: 3, self_restraint: 1.5 },
        { humility: 4, modesty: 4, self_restraint: 2 },
        { humility: 5, modesty: 5, self_restraint: 3 },
        { humility: 6, modesty: 6, self_restraint: 4 },
        { humility: 7, modesty: 7, self_restraint: 5 }
      ]
    },
    source: "Humility-Modesty Scale"
  },

  {
    id: "fv031",
    type: "likert",
    category: "universal_values",
    subcategory: "nature_environment",
    question: "Protecting the environment and preserving nature is important to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { environmental_concern: 1, nature_value: 1, universalism: 0.5 },
        { environmental_concern: 2, nature_value: 2, universalism: 1 },
        { environmental_concern: 3, nature_value: 3, universalism: 1.5 },
        { environmental_concern: 4, nature_value: 4, universalism: 2 },
        { environmental_concern: 5, nature_value: 5, universalism: 3 },
        { environmental_concern: 6, nature_value: 6, universalism: 4 },
        { environmental_concern: 7, nature_value: 7, universalism: 5 }
      ]
    },
    source: "Environmental Values Scale"
  },

  {
    id: "fv032",
    type: "likert",
    category: "universal_values",
    subcategory: "wisdom_understanding",
    question: "Seeking wisdom and understanding life deeply matters to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { wisdom: 1, understanding: 1, knowledge_seeking: 0.5 },
        { wisdom: 2, understanding: 2, knowledge_seeking: 1 },
        { wisdom: 3, understanding: 3, knowledge_seeking: 1.5 },
        { wisdom: 4, understanding: 4, knowledge_seeking: 2 },
        { wisdom: 5, understanding: 5, knowledge_seeking: 3 },
        { wisdom: 6, understanding: 6, knowledge_seeking: 4 },
        { wisdom: 7, understanding: 7, knowledge_seeking: 5 }
      ]
    },
    source: "Wisdom Values Assessment"
  },

  {
    id: "fv033",
    type: "likert",
    category: "universal_values",
    subcategory: "beauty_aesthetics",
    question: "Appreciating and creating beauty in the world is meaningful to me.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { aesthetic_appreciation: 1, beauty_value: 1, artistic_sense: 0.5 },
        { aesthetic_appreciation: 2, beauty_value: 2, artistic_sense: 1 },
        { aesthetic_appreciation: 3, beauty_value: 3, artistic_sense: 1.5 },
        { aesthetic_appreciation: 4, beauty_value: 4, artistic_sense: 2 },
        { aesthetic_appreciation: 5, beauty_value: 5, artistic_sense: 3 },
        { aesthetic_appreciation: 6, beauty_value: 6, artistic_sense: 4 },
        { aesthetic_appreciation: 7, beauty_value: 7, artistic_sense: 5 }
      ]
    },
    source: "Aesthetic Values Scale"
  },

  {
    id: "fv034",
    type: "scenario",
    category: "universal_values",
    subcategory: "resource_allocation",
    question: "Your organization has limited resources. How should they be allocated?",
    options: [
      {
        text: "Ensure everyone gets an equal share",
        value: 1,
        dimensions: { fairness: 5, equality: 5, universalism: 4, pragmatism: -1 }
      },
      {
        text: "Give more to those who contribute most",
        value: 2,
        dimensions: { achievement: 4, meritocracy: 4, efficiency: 3, equality: -2 }
      },
      {
        text: "Prioritize those with the greatest need",
        value: 3,
        dimensions: { benevolence: 5, compassion: 4, care: 4, achievement: -1 }
      },
      {
        text: "Invest in initiatives with highest return",
        value: 4,
        dimensions: { pragmatism: 5, efficiency: 4, strategic_thinking: 3, benevolence: -1 }
      }
    ],
    source: "Resource Allocation Ethics"
  },

  {
    id: "fv035",
    type: "likert",
    category: "universal_values",
    subcategory: "personal_growth",
    question: "Continuously developing myself and reaching my potential is essential.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { personal_growth: 1, self_development: 1, achievement: 0.5 },
        { personal_growth: 2, self_development: 2, achievement: 1 },
        { personal_growth: 3, self_development: 3, achievement: 1.5 },
        { personal_growth: 4, self_development: 4, achievement: 2 },
        { personal_growth: 5, self_development: 5, achievement: 3 },
        { personal_growth: 6, self_development: 6, achievement: 4 },
        { personal_growth: 7, self_development: 7, achievement: 5 }
      ]
    },
    source: "Personal Growth Values"
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

  {
    id: "fv038",
    type: "likert",
    category: "moral_foundations",
    subcategory: "loyalty_betrayal",
    question: "Loyalty to my group and community is an important moral value.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { loyalty_betrayal: 1, group_loyalty: 1, community_bond: 0.5 },
        { loyalty_betrayal: 2, group_loyalty: 2, community_bond: 1 },
        { loyalty_betrayal: 3, group_loyalty: 3, community_bond: 1.5 },
        { loyalty_betrayal: 4, group_loyalty: 4, community_bond: 2 },
        { loyalty_betrayal: 5, group_loyalty: 5, community_bond: 3 },
        { loyalty_betrayal: 6, group_loyalty: 6, community_bond: 4 },
        { loyalty_betrayal: 7, group_loyalty: 7, community_bond: 5 }
      ]
    },
    source: "Moral Foundations Questionnaire (Graham et al., 2011)"
  },

  {
    id: "fv039",
    type: "likert",
    category: "moral_foundations",
    subcategory: "authority_subversion",
    question: "Respecting authority and maintaining social order is morally important.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { authority_subversion: 1, respect_authority: 1, social_order: 0.5 },
        { authority_subversion: 2, respect_authority: 2, social_order: 1 },
        { authority_subversion: 3, respect_authority: 3, social_order: 1.5 },
        { authority_subversion: 4, respect_authority: 4, social_order: 2 },
        { authority_subversion: 5, respect_authority: 5, social_order: 3 },
        { authority_subversion: 6, respect_authority: 6, social_order: 4 },
        { authority_subversion: 7, respect_authority: 7, social_order: 5 }
      ]
    },
    source: "Moral Foundations Questionnaire (Graham et al., 2011)"
  },

  {
    id: "fv040",
    type: "likert",
    category: "moral_foundations",
    subcategory: "sanctity_degradation",
    question: "Certain things are sacred and should not be violated or degraded.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { sanctity_degradation: 1, sacred_respect: 1, purity: 0.5 },
        { sanctity_degradation: 2, sacred_respect: 2, purity: 1 },
        { sanctity_degradation: 3, sacred_respect: 3, purity: 1.5 },
        { sanctity_degradation: 4, sacred_respect: 4, purity: 2 },
        { sanctity_degradation: 5, sacred_respect: 5, purity: 3 },
        { sanctity_degradation: 6, sacred_respect: 6, purity: 4 },
        { sanctity_degradation: 7, sacred_respect: 7, purity: 5 }
      ]
    },
    source: "Moral Foundations Questionnaire (Graham et al., 2011)"
  },

  {
    id: "fv041",
    type: "scenario",
    category: "moral_foundations",
    subcategory: "moral_dilemma",
    question: "A friend asks you to lie to protect them from consequences of a minor mistake. What guides your decision?",
    options: [
      {
        text: "Tell the truth because honesty is always right",
        value: 1,
        dimensions: { sanctity_degradation: 5, integrity: 5, truth_telling: 4, loyalty_betrayal: -2 }
      },
      {
        text: "Protect my friend because loyalty matters most",
        value: 2,
        dimensions: { loyalty_betrayal: 5, friendship: 4, care_harm: 3, sanctity_degradation: -2 }
      },
      {
        text: "Consider what's fair to all parties involved",
        value: 3,
        dimensions: { fairness_cheating: 5, justice: 4, balance: 3, perspective_taking: 3 }
      },
      {
        text: "Follow established rules about truthfulness",
        value: 4,
        dimensions: { authority_subversion: 4, rule_following: 4, consistency: 3, flexibility: -1 }
      }
    ],
    source: "Moral Dilemma Resolution"
  },

  {
    id: "fv042",
    type: "likert",
    category: "moral_foundations",
    subcategory: "moral_disgust",
    question: "I feel disgusted when people violate moral standards.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { moral_sensitivity: 1, sanctity_degradation: 1, emotional_response: 0.5 },
        { moral_sensitivity: 2, sanctity_degradation: 2, emotional_response: 1 },
        { moral_sensitivity: 3, sanctity_degradation: 3, emotional_response: 1.5 },
        { moral_sensitivity: 4, sanctity_degradation: 4, emotional_response: 2 },
        { moral_sensitivity: 5, sanctity_degradation: 5, emotional_response: 3 },
        { moral_sensitivity: 6, sanctity_degradation: 6, emotional_response: 4 },
        { moral_sensitivity: 7, sanctity_degradation: 7, emotional_response: 5 }
      ]
    },
    source: "Moral Disgust Scale"
  },

  {
    id: "fv043",
    type: "likert",
    category: "moral_foundations",
    subcategory: "proportionality",
    question: "Punishments should be proportional to the severity of wrongdoing.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { fairness_cheating: 1, proportionality: 1, justice: 0.5 },
        { fairness_cheating: 2, proportionality: 2, justice: 1 },
        { fairness_cheating: 3, proportionality: 3, justice: 1.5 },
        { fairness_cheating: 4, proportionality: 4, justice: 2 },
        { fairness_cheating: 5, proportionality: 5, justice: 3 },
        { fairness_cheating: 6, proportionality: 6, justice: 4 },
        { fairness_cheating: 7, proportionality: 7, justice: 5 }
      ]
    },
    source: "Proportionality Principle Scale"
  },

  {
    id: "fv044",
    type: "likert",
    category: "moral_foundations",
    subcategory: "group_cohesion",
    question: "Maintaining group unity and solidarity is morally important.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { loyalty_betrayal: 1, group_cohesion: 1, collective_good: 0.5 },
        { loyalty_betrayal: 2, group_cohesion: 2, collective_good: 1 },
        { loyalty_betrayal: 3, group_cohesion: 3, collective_good: 1.5 },
        { loyalty_betrayal: 4, group_cohesion: 4, collective_good: 2 },
        { loyalty_betrayal: 5, group_cohesion: 5, collective_good: 3 },
        { loyalty_betrayal: 6, group_cohesion: 6, collective_good: 4 },
        { loyalty_betrayal: 7, group_cohesion: 7, collective_good: 5 }
      ]
    },
    source: "Group Cohesion Values"
  },

  {
    id: "fv045",
    type: "likert",
    category: "moral_foundations",
    subcategory: "harm_prevention",
    question: "Preventing suffering should be our highest moral priority.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { care_harm: 1, suffering_prevention: 1, compassion: 0.5 },
        { care_harm: 2, suffering_prevention: 2, compassion: 1 },
        { care_harm: 3, suffering_prevention: 3, compassion: 1.5 },
        { care_harm: 4, suffering_prevention: 4, compassion: 2 },
        { care_harm: 5, suffering_prevention: 5, compassion: 3 },
        { care_harm: 6, suffering_prevention: 6, compassion: 4 },
        { care_harm: 7, suffering_prevention: 7, compassion: 5 }
      ]
    },
    source: "Harm Prevention Ethics"
  },

  {
    id: "fv046",
    type: "likert",
    category: "moral_foundations",
    subcategory: "moral_elevation",
    question: "I feel inspired when I witness acts of moral excellence.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { moral_elevation: 1, inspiration: 1, virtue_appreciation: 0.5 },
        { moral_elevation: 2, inspiration: 2, virtue_appreciation: 1 },
        { moral_elevation: 3, inspiration: 3, virtue_appreciation: 1.5 },
        { moral_elevation: 4, inspiration: 4, virtue_appreciation: 2 },
        { moral_elevation: 5, inspiration: 5, virtue_appreciation: 3 },
        { moral_elevation: 6, inspiration: 6, virtue_appreciation: 4 },
        { moral_elevation: 7, inspiration: 7, virtue_appreciation: 5 }
      ]
    },
    source: "Moral Elevation Scale"
  },

  {
    id: "fv047",
    type: "scenario",
    category: "moral_foundations",
    subcategory: "whistleblowing",
    question: "You discover your organization is engaged in practices that harm others but benefit the company. What do you do?",
    options: [
      {
        text: "Report it externally to protect those being harmed",
        value: 1,
        dimensions: { care_harm: 5, moral_courage: 5, whistleblowing: 4, loyalty_betrayal: -3 }
      },
      {
        text: "Address it internally through proper channels first",
        value: 2,
        dimensions: { authority_subversion: 4, fairness_cheating: 3, procedure_following: 4, care_harm: 2 }
      },
      {
        text: "Stay loyal to the organization and say nothing",
        value: 3,
        dimensions: { loyalty_betrayal: 5, group_loyalty: 4, job_security: 3, care_harm: -4 }
      },
      {
        text: "Find ways to minimize harm without betraying trust",
        value: 4,
        dimensions: { creativity: 4, problem_solving: 4, balance: 3, compromise: 3 }
      }
    ],
    source: "Whistleblowing Ethics"
  },

  {
    id: "fv048",
    type: "likert",
    category: "moral_foundations",
    subcategory: "collective_responsibility",
    question: "Individuals have moral obligations to their community and society.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { collective_responsibility: 1, social_obligation: 1, community_duty: 0.5 },
        { collective_responsibility: 2, social_obligation: 2, community_duty: 1 },
        { collective_responsibility: 3, social_obligation: 3, community_duty: 1.5 },
        { collective_responsibility: 4, social_obligation: 4, community_duty: 2 },
        { collective_responsibility: 5, social_obligation: 5, community_duty: 3 },
        { collective_responsibility: 6, social_obligation: 6, community_duty: 4 },
        { collective_responsibility: 7, social_obligation: 7, community_duty: 5 }
      ]
    },
    source: "Collective Responsibility Scale"
  },

  {
    id: "fv049",
    type: "likert",
    category: "moral_foundations",
    subcategory: "moral_intuition",
    question: "I trust my gut feelings about what is morally right or wrong.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { moral_intuition: 1, intuitive_ethics: 1, emotional_judgment: 0.5 },
        { moral_intuition: 2, intuitive_ethics: 2, emotional_judgment: 1 },
        { moral_intuition: 3, intuitive_ethics: 3, emotional_judgment: 1.5 },
        { moral_intuition: 4, intuitive_ethics: 4, emotional_judgment: 2 },
        { moral_intuition: 5, intuitive_ethics: 5, emotional_judgment: 3 },
        { moral_intuition: 6, intuitive_ethics: 6, emotional_judgment: 4 },
        { moral_intuition: 7, intuitive_ethics: 7, emotional_judgment: 5 }
      ]
    },
    source: "Moral Intuition Scale"
  },

  {
    id: "fv050",
    type: "likert",
    category: "moral_foundations",
    subcategory: "moral_reasoning",
    question: "I carefully reason through moral decisions rather than relying on feelings.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { moral_reasoning: 1, analytical_ethics: 1, cognitive_judgment: 0.5 },
        { moral_reasoning: 2, analytical_ethics: 2, cognitive_judgment: 1 },
        { moral_reasoning: 3, analytical_ethics: 3, cognitive_judgment: 1.5 },
        { moral_reasoning: 4, analytical_ethics: 4, cognitive_judgment: 2 },
        { moral_reasoning: 5, analytical_ethics: 5, cognitive_judgment: 3 },
        { moral_reasoning: 6, analytical_ethics: 6, cognitive_judgment: 4 },
        { moral_reasoning: 7, analytical_ethics: 7, cognitive_judgment: 5 }
      ]
    },
    source: "Moral Reasoning Scale"
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

  {
    id: "fv052",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "professional_integrity",
    question: "Maintaining professional integrity is worth personal sacrifice.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { integrity: 1, moral_courage: 1, professional_ethics: 0.5 },
        { integrity: 2, moral_courage: 2, professional_ethics: 1 },
        { integrity: 3, moral_courage: 3, professional_ethics: 1.5 },
        { integrity: 4, moral_courage: 4, professional_ethics: 2 },
        { integrity: 5, moral_courage: 5, professional_ethics: 3 },
        { integrity: 6, moral_courage: 6, professional_ethics: 4 },
        { integrity: 7, moral_courage: 7, professional_ethics: 5 }
      ]
    },
    source: "Professional Ethics Scale"
  },

  {
    id: "fv053",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "transparency",
    question: "Being transparent and honest in all professional communications is essential.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { transparency: 1, honesty: 1, open_communication: 0.5 },
        { transparency: 2, honesty: 2, open_communication: 1 },
        { transparency: 3, honesty: 3, open_communication: 1.5 },
        { transparency: 4, honesty: 4, open_communication: 2 },
        { transparency: 5, honesty: 5, open_communication: 3 },
        { transparency: 6, honesty: 6, open_communication: 4 },
        { transparency: 7, honesty: 7, open_communication: 5 }
      ]
    },
    source: "Workplace Transparency Index"
  },

  {
    id: "fv054",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "accountability",
    question: "I take full responsibility for my mistakes and their consequences.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { accountability: 1, responsibility: 1, ownership: 0.5 },
        { accountability: 2, responsibility: 2, ownership: 1 },
        { accountability: 3, responsibility: 3, ownership: 1.5 },
        { accountability: 4, responsibility: 4, ownership: 2 },
        { accountability: 5, responsibility: 5, ownership: 3 },
        { accountability: 6, responsibility: 6, ownership: 4 },
        { accountability: 7, responsibility: 7, ownership: 5 }
      ]
    },
    source: "Personal Accountability Assessment"
  },

  {
    id: "fv055",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "confidentiality",
    question: "A colleague shares confidential information that could help you in an upcoming negotiation. How do you respond?",
    options: [
      {
        text: "Refuse to use the information and report the breach",
        value: 1,
        dimensions: { integrity: 5, ethical_leadership: 4, professional_ethics: 5, relationship_cost: -2 }
      },
      {
        text: "Use the information but keep the source secret",
        value: 2,
        dimensions: { strategic_advantage: 3, pragmatism: 3, integrity: -2, professional_ethics: -3 }
      },
      {
        text: "Remind colleague about confidentiality without using info",
        value: 3,
        dimensions: { integrity: 4, mentoring: 3, relationship_preservation: 3, professional_ethics: 3 }
      },
      {
        text: "Ask colleague to officially share the information",
        value: 4,
        dimensions: { creativity: 3, problem_solving: 4, procedure_following: 4, integrity: 2 }
      }
    ],
    source: "Confidentiality Ethics Assessment"
  },

  {
    id: "fv056",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "fairness_workplace",
    question: "All employees should be treated fairly regardless of personal relationships.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { workplace_fairness: 1, equal_treatment: 1, impartiality: 0.5 },
        { workplace_fairness: 2, equal_treatment: 2, impartiality: 1 },
        { workplace_fairness: 3, equal_treatment: 3, impartiality: 1.5 },
        { workplace_fairness: 4, equal_treatment: 4, impartiality: 2 },
        { workplace_fairness: 5, equal_treatment: 5, impartiality: 3 },
        { workplace_fairness: 6, equal_treatment: 6, impartiality: 4 },
        { workplace_fairness: 7, equal_treatment: 7, impartiality: 5 }
      ]
    },
    source: "Workplace Fairness Scale"
  },

  {
    id: "fv057",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "ethical_leadership",
    question: "Leaders have a special responsibility to model ethical behavior.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { ethical_leadership: 1, leadership_responsibility: 1, role_modeling: 0.5 },
        { ethical_leadership: 2, leadership_responsibility: 2, role_modeling: 1 },
        { ethical_leadership: 3, leadership_responsibility: 3, role_modeling: 1.5 },
        { ethical_leadership: 4, leadership_responsibility: 4, role_modeling: 2 },
        { ethical_leadership: 5, leadership_responsibility: 5, role_modeling: 3 },
        { ethical_leadership: 6, leadership_responsibility: 6, role_modeling: 4 },
        { ethical_leadership: 7, leadership_responsibility: 7, role_modeling: 5 }
      ]
    },
    source: "Ethical Leadership Inventory"
  },

  {
    id: "fv058",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "stakeholder_consideration",
    question: "Business decisions should consider the impact on all stakeholders.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { stakeholder_orientation: 1, holistic_thinking: 1, social_responsibility: 0.5 },
        { stakeholder_orientation: 2, holistic_thinking: 2, social_responsibility: 1 },
        { stakeholder_orientation: 3, holistic_thinking: 3, social_responsibility: 1.5 },
        { stakeholder_orientation: 4, holistic_thinking: 4, social_responsibility: 2 },
        { stakeholder_orientation: 5, holistic_thinking: 5, social_responsibility: 3 },
        { stakeholder_orientation: 6, holistic_thinking: 6, social_responsibility: 4 },
        { stakeholder_orientation: 7, holistic_thinking: 7, social_responsibility: 5 }
      ]
    },
    source: "Stakeholder Theory Assessment"
  },

  {
    id: "fv059",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "competitive_intelligence",
    question: "You have an opportunity to access a competitor's confidential strategic plan. What do you do?",
    options: [
      {
        text: "Refuse to look at it and report the opportunity",
        value: 1,
        dimensions: { integrity: 5, professional_ethics: 5, competitive_fairness: 4, strategic_disadvantage: -3 }
      },
      {
        text: "Review it but don't use the information directly",
        value: 2,
        dimensions: { curiosity: 3, information_gathering: 2, integrity: -2, professional_ethics: -2 }
      },
      {
        text: "Use the information to gain competitive advantage",
        value: 3,
        dimensions: { strategic_advantage: 4, competitiveness: 3, integrity: -4, professional_ethics: -4 }
      },
      {
        text: "Return it to the competitor anonymously",
        value: 4,
        dimensions: { integrity: 4, fairness: 4, relationship_building: 2, strategic_thinking: 1 }
      }
    ],
    source: "Competitive Intelligence Ethics"
  },

  {
    id: "fv060",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "environmental_responsibility",
    question: "Organizations have a moral obligation to protect the environment.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { environmental_ethics: 1, sustainability: 1, corporate_responsibility: 0.5 },
        { environmental_ethics: 2, sustainability: 2, corporate_responsibility: 1 },
        { environmental_ethics: 3, sustainability: 3, corporate_responsibility: 1.5 },
        { environmental_ethics: 4, sustainability: 4, corporate_responsibility: 2 },
        { environmental_ethics: 5, sustainability: 5, corporate_responsibility: 3 },
        { environmental_ethics: 6, sustainability: 6, corporate_responsibility: 4 },
        { environmental_ethics: 7, sustainability: 7, corporate_responsibility: 5 }
      ]
    },
    source: "Corporate Environmental Responsibility Scale"
  },

  {
    id: "fv061",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "diversity_inclusion",
    question: "Creating inclusive workplaces that value diversity is morally important.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { diversity_ethics: 1, inclusion_value: 1, equality_promotion: 0.5 },
        { diversity_ethics: 2, inclusion_value: 2, equality_promotion: 1 },
        { diversity_ethics: 3, inclusion_value: 3, equality_promotion: 1.5 },
        { diversity_ethics: 4, inclusion_value: 4, equality_promotion: 2 },
        { diversity_ethics: 5, inclusion_value: 5, equality_promotion: 3 },
        { diversity_ethics: 6, inclusion_value: 6, equality_promotion: 4 },
        { diversity_ethics: 7, inclusion_value: 7, equality_promotion: 5 }
      ]
    },
    source: "Workplace Diversity Ethics Scale"
  },

  {
    id: "fv062",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "work_life_balance",
    question: "Employers should respect employees' need for work-life balance.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { work_life_ethics: 1, employee_wellbeing: 1, balance_respect: 0.5 },
        { work_life_ethics: 2, employee_wellbeing: 2, balance_respect: 1 },
        { work_life_ethics: 3, employee_wellbeing: 3, balance_respect: 1.5 },
        { work_life_ethics: 4, employee_wellbeing: 4, balance_respect: 2 },
        { work_life_ethics: 5, employee_wellbeing: 5, balance_respect: 3 },
        { work_life_ethics: 6, employee_wellbeing: 6, balance_respect: 4 },
        { work_life_ethics: 7, employee_wellbeing: 7, balance_respect: 5 }
      ]
    },
    source: "Work-Life Balance Ethics"
  },

  {
    id: "fv063",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "performance_evaluation",
    question: "You're evaluating two employees: one is a friend with average performance, the other is disliked but excellent. How do you proceed?",
    options: [
      {
        text: "Evaluate based purely on objective performance metrics",
        value: 1,
        dimensions: { fairness: 5, objectivity: 5, professional_ethics: 4, relationship_cost: -2 }
      },
      {
        text: "Give friend benefit of doubt while being fair to both",
        value: 2,
        dimensions: { loyalty: 3, balance: 2, fairness: 2, objectivity: -1 }
      },
      {
        text: "Focus on potential rather than just current performance",
        value: 3,
        dimensions: { developmental_focus: 3, optimism: 2, fairness: 1, objectivity: 0 }
      },
      {
        text: "Ask colleague to evaluate to avoid bias",
        value: 4,
        dimensions: { self_awareness: 4, process_integrity: 4, conflict_avoidance: 2, accountability: 1 }
      }
    ],
    source: "Performance Evaluation Ethics"
  },

  {
    id: "fv064",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "customer_first",
    question: "Customer welfare should take priority over short-term profits.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { customer_ethics: 1, long_term_thinking: 1, service_orientation: 0.5 },
        { customer_ethics: 2, long_term_thinking: 2, service_orientation: 1 },
        { customer_ethics: 3, long_term_thinking: 3, service_orientation: 1.5 },
        { customer_ethics: 4, long_term_thinking: 4, service_orientation: 2 },
        { customer_ethics: 5, long_term_thinking: 5, service_orientation: 3 },
        { customer_ethics: 6, long_term_thinking: 6, service_orientation: 4 },
        { customer_ethics: 7, long_term_thinking: 7, service_orientation: 5 }
      ]
    },
    source: "Customer-Centric Ethics"
  },

  {
    id: "fv065",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "innovation_responsibility",
    question: "We have a responsibility to consider the societal impact of innovations.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { innovation_ethics: 1, social_responsibility: 1, future_thinking: 0.5 },
        { innovation_ethics: 2, social_responsibility: 2, future_thinking: 1 },
        { innovation_ethics: 3, social_responsibility: 3, future_thinking: 1.5 },
        { innovation_ethics: 4, social_responsibility: 4, future_thinking: 2 },
        { innovation_ethics: 5, social_responsibility: 5, future_thinking: 3 },
        { innovation_ethics: 6, social_responsibility: 6, future_thinking: 4 },
        { innovation_ethics: 7, social_responsibility: 7, future_thinking: 5 }
      ]
    },
    source: "Innovation Ethics Framework"
  },

  {
    id: "fv066",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "truth_telling",
    question: "I prefer to tell difficult truths rather than comfortable lies.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { truth_telling: 1, courage: 1, authenticity: 0.5 },
        { truth_telling: 2, courage: 2, authenticity: 1 },
        { truth_telling: 3, courage: 3, authenticity: 1.5 },
        { truth_telling: 4, courage: 4, authenticity: 2 },
        { truth_telling: 5, courage: 5, authenticity: 3 },
        { truth_telling: 6, courage: 6, authenticity: 4 },
        { truth_telling: 7, courage: 7, authenticity: 5 }
      ]
    },
    source: "Truth-Telling Assessment"
  },

  {
    id: "fv067",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "resource_stewardship",
    question: "You notice significant waste in company resources that management seems unaware of. What do you do?",
    options: [
      {
        text: "Document and report the waste through proper channels",
        value: 1,
        dimensions: { stewardship: 5, responsibility: 4, process_following: 3, efficiency: 4 }
      },
      {
        text: "Address it informally with immediate supervisor first",
        value: 2,
        dimensions: { relationship_building: 3, diplomacy: 3, stewardship: 3, efficiency: 2 }
      },
      {
        text: "Implement improvements within my own sphere of control",
        value: 3,
        dimensions: { initiative: 4, self_direction: 3, stewardship: 2, limited_impact: -1 }
      },
      {
        text: "Focus on my own responsibilities and let others handle it",
        value: 4,
        dimensions: { role_clarity: 2, conflict_avoidance: 3, stewardship: -2, responsibility: -3 }
      }
    ],
    source: "Resource Stewardship Ethics"
  },

  {
    id: "fv068",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "promise_keeping",
    question: "Keeping commitments and promises is essential for professional credibility.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { promise_keeping: 1, reliability: 1, trustworthiness: 0.5 },
        { promise_keeping: 2, reliability: 2, trustworthiness: 1 },
        { promise_keeping: 3, reliability: 3, trustworthiness: 1.5 },
        { promise_keeping: 4, reliability: 4, trustworthiness: 2 },
        { promise_keeping: 5, reliability: 5, trustworthiness: 3 },
        { promise_keeping: 6, reliability: 6, trustworthiness: 4 },
        { promise_keeping: 7, reliability: 7, trustworthiness: 5 }
      ]
    },
    source: "Promise-Keeping Ethics"
  },

  {
    id: "fv069",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "conflict_resolution",
    question: "I address workplace conflicts directly rather than avoiding them.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { conflict_resolution: 1, directness: 1, problem_solving: 0.5 },
        { conflict_resolution: 2, directness: 2, problem_solving: 1 },
        { conflict_resolution: 3, directness: 3, problem_solving: 1.5 },
        { conflict_resolution: 4, directness: 4, problem_solving: 2 },
        { conflict_resolution: 5, directness: 5, problem_solving: 3 },
        { conflict_resolution: 6, directness: 6, problem_solving: 4 },
        { conflict_resolution: 7, directness: 7, problem_solving: 5 }
      ]
    },
    source: "Conflict Resolution Style"
  },

  {
    id: "fv070",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "mentoring_development",
    question: "I have a responsibility to help develop others' capabilities.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { mentoring: 1, development_focus: 1, generosity: 0.5 },
        { mentoring: 2, development_focus: 2, generosity: 1 },
        { mentoring: 3, development_focus: 3, generosity: 1.5 },
        { mentoring: 4, development_focus: 4, generosity: 2 },
        { mentoring: 5, development_focus: 5, generosity: 3 },
        { mentoring: 6, development_focus: 6, generosity: 4 },
        { mentoring: 7, development_focus: 7, generosity: 5 }
      ]
    },
    source: "Mentoring Responsibility Scale"
  },

  {
    id: "fv071",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "cost_cutting",
    question: "Economic pressures require cost cutting. Senior leadership proposes reducing employee benefits. How do you respond?",
    options: [
      {
        text: "Advocate for alternative cost-saving measures that protect employees",
        value: 1,
        dimensions: { employee_advocacy: 5, creativity: 4, leadership_courage: 4, management_tension: -2 }
      },
      {
        text: "Support the decision as necessary for business survival",
        value: 2,
        dimensions: { business_pragmatism: 4, loyalty_to_leadership: 3, financial_responsibility: 3, employee_advocacy: -3 }
      },
      {
        text: "Propose phased reductions with employee input",
        value: 3,
        dimensions: { collaborative_approach: 4, communication: 3, compromise: 3, process_focus: 2 }
      },
      {
        text: "Request detailed justification and explore all options",
        value: 4,
        dimensions: { analytical_thinking: 4, due_diligence: 4, questioning_authority: 2, thoroughness: 3 }
      }
    ],
    source: "Cost-Cutting Ethics"
  },

  {
    id: "fv072",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "continuous_improvement",
    question: "I actively seek ways to improve processes and outcomes at work.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { continuous_improvement: 1, initiative: 1, innovation: 0.5 },
        { continuous_improvement: 2, initiative: 2, innovation: 1 },
        { continuous_improvement: 3, initiative: 3, innovation: 1.5 },
        { continuous_improvement: 4, initiative: 4, innovation: 2 },
        { continuous_improvement: 5, initiative: 5, innovation: 3 },
        { continuous_improvement: 6, initiative: 6, innovation: 4 },
        { continuous_improvement: 7, initiative: 7, innovation: 5 }
      ]
    },
    source: "Continuous Improvement Mindset"
  },

  {
    id: "fv073",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "data_privacy",
    question: "Protecting customer and employee data privacy is a fundamental ethical obligation.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { data_ethics: 1, privacy_protection: 1, information_security: 0.5 },
        { data_ethics: 2, privacy_protection: 2, information_security: 1 },
        { data_ethics: 3, privacy_protection: 3, information_security: 1.5 },
        { data_ethics: 4, privacy_protection: 4, information_security: 2 },
        { data_ethics: 5, privacy_protection: 5, information_security: 3 },
        { data_ethics: 6, privacy_protection: 6, information_security: 4 },
        { data_ethics: 7, privacy_protection: 7, information_security: 5 }
      ]
    },
    source: "Data Privacy Ethics"
  },

  {
    id: "fv074",
    type: "likert",
    category: "workplace_ethics",
    subcategory: "quality_standards",
    question: "Maintaining high quality standards is worth the extra effort and cost.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { quality_commitment: 1, excellence: 1, customer_service: 0.5 },
        { quality_commitment: 2, excellence: 2, customer_service: 1 },
        { quality_commitment: 3, excellence: 3, customer_service: 1.5 },
        { quality_commitment: 4, excellence: 4, customer_service: 2 },
        { quality_commitment: 5, excellence: 5, customer_service: 3 },
        { quality_commitment: 6, excellence: 6, customer_service: 4 },
        { quality_commitment: 7, excellence: 7, customer_service: 5 }
      ]
    },
    source: "Quality Standards Ethics"
  },

  {
    id: "fv075",
    type: "scenario",
    category: "workplace_ethics",
    subcategory: "vendor_relationships",
    question: "A vendor offers you expensive tickets to a sporting event. Company policy is unclear about such gifts. What do you do?",
    options: [
      {
        text: "Decline the tickets to avoid any appearance of impropriety",
        value: 1,
        dimensions: { integrity: 5, ethical_caution: 4, appearance_management: 4, relationship_cost: -1 }
      },
      {
        text: "Accept but disclose to supervisor and pay fair value",
        value: 2,
        dimensions: { transparency: 4, compromise: 3, relationship_building: 2, process_following: 3 }
      },
      {
        text: "Accept the tickets since policy doesn't explicitly forbid it",
        value: 3,
        dimensions: { rule_interpretation: 2, relationship_building: 3, ethical_risk: -2, integrity: -1 }
      },
      {
        text: "Suggest vendor donates tickets to company charity event",
        value: 4,
        dimensions: { creativity: 4, win_win_thinking: 4, integrity: 3, relationship_building: 2 }
      }
    ],
    source: "Vendor Relations Ethics"
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

  {
    id: "fv077",
    type: "likert",
    category: "work_life_integration",
    subcategory: "values_alignment",
    question: "My personal values are well-aligned with my work responsibilities.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { values_integration: 1, authenticity: 1, work_satisfaction: 0.5 },
        { values_integration: 2, authenticity: 2, work_satisfaction: 1 },
        { values_integration: 3, authenticity: 3, work_satisfaction: 1.5 },
        { values_integration: 4, authenticity: 4, work_satisfaction: 2 },
        { values_integration: 5, authenticity: 5, work_satisfaction: 3 },
        { values_integration: 6, authenticity: 6, work_satisfaction: 4 },
        { values_integration: 7, authenticity: 7, work_satisfaction: 5 }
      ]
    },
    source: "Values-Work Alignment Scale"
  },

  {
    id: "fv078",
    type: "likert",
    category: "work_life_integration",
    subcategory: "boundary_management",
    question: "I maintain healthy boundaries between my work and personal life.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { boundary_setting: 1, work_life_balance: 1, self_care: 0.5 },
        { boundary_setting: 2, work_life_balance: 2, self_care: 1 },
        { boundary_setting: 3, work_life_balance: 3, self_care: 1.5 },
        { boundary_setting: 4, work_life_balance: 4, self_care: 2 },
        { boundary_setting: 5, work_life_balance: 5, self_care: 3 },
        { boundary_setting: 6, work_life_balance: 6, self_care: 4 },
        { boundary_setting: 7, work_life_balance: 7, self_care: 5 }
      ]
    },
    source: "Work-Life Boundary Scale"
  },

  {
    id: "fv079",
    type: "scenario",
    category: "work_life_integration",
    subcategory: "priority_conflict",
    question: "Your child has an important school event the same day as a crucial work meeting. How do you decide?",
    options: [
      {
        text: "Attend the school event - family always comes first",
        value: 1,
        dimensions: { family_priority: 5, boundary_setting: 4, work_commitment: -2, values_clarity: 4 }
      },
      {
        text: "Attend the work meeting - professional obligations are essential",
        value: 2,
        dimensions: { work_commitment: 5, professional_responsibility: 4, family_priority: -2, career_focus: 3 }
      },
      {
        text: "Try to attend both by splitting time or rescheduling",
        value: 3,
        dimensions: { problem_solving: 4, flexibility: 3, compromise: 3, stress_management: -1 }
      },
      {
        text: "Delegate work responsibilities to attend family event",
        value: 4,
        dimensions: { family_priority: 4, delegation: 3, trust_building: 2, work_efficiency: 2 }
      }
    ],
    source: "Work-Family Conflict Resolution"
  },

  {
    id: "fv080",
    type: "likert",
    category: "work_life_integration",
    subcategory: "spiritual_work_connection",
    question: "I see my daily work as an expression of my spiritual values.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Always",
      dimensions: [
        { spiritual_work_integration: 1, sacred_calling: 1, meaning_making: 0.5 },
        { spiritual_work_integration: 2, sacred_calling: 2, meaning_making: 1 },
        { spiritual_work_integration: 3, sacred_calling: 3, meaning_making: 1.5 },
        { spiritual_work_integration: 4, sacred_calling: 4, meaning_making: 2 },
        { spiritual_work_integration: 5, sacred_calling: 5, meaning_making: 3 },
        { spiritual_work_integration: 6, sacred_calling: 6, meaning_making: 4 },
        { spiritual_work_integration: 7, sacred_calling: 7, meaning_making: 5 }
      ]
    },
    source: "Spiritual-Work Integration Scale"
  },

  {
    id: "fv081",
    type: "likert",
    category: "work_life_integration",
    subcategory: "holistic_success",
    question: "True success includes personal fulfillment, not just professional achievement.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { holistic_success: 1, life_satisfaction: 1, balanced_achievement: 0.5 },
        { holistic_success: 2, life_satisfaction: 2, balanced_achievement: 1 },
        { holistic_success: 3, life_satisfaction: 3, balanced_achievement: 1.5 },
        { holistic_success: 4, life_satisfaction: 4, balanced_achievement: 2 },
        { holistic_success: 5, life_satisfaction: 5, balanced_achievement: 3 },
        { holistic_success: 6, life_satisfaction: 6, balanced_achievement: 4 },
        { holistic_success: 7, life_satisfaction: 7, balanced_achievement: 5 }
      ]
    },
    source: "Holistic Success Definition"
  },

  {
    id: "fv082",
    type: "likert",
    category: "work_life_integration",
    subcategory: "sabbath_rest",
    question: "Regular rest and renewal are essential for sustainable productivity.",
    scale: {
      min: 1, max: 7,
      minLabel: "Strongly Disagree", maxLabel: "Strongly Agree",
      dimensions: [
        { rest_value: 1, sustainability: 1, renewal: 0.5 },
        { rest_value: 2, sustainability: 2, renewal: 1 },
        { rest_value: 3, sustainability: 3, renewal: 1.5 },
        { rest_value: 4, sustainability: 4, renewal: 2 },
        { rest_value: 5, sustainability: 5, renewal: 3 },
        { rest_value: 6, sustainability: 6, renewal: 4 },
        { rest_value: 7, sustainability: 7, renewal: 5 }
      ]
    },
    source: "Sabbath Rest Principle"
  },

  {
    id: "fv083",
    type: "likert",
    category: "work_life_integration",
    subcategory: "service_others",
    question: "My work should contribute to serving others and making a positive difference.",
    scale: {
      min: 1, max: 7,
      minLabel: "Not Important", maxLabel: "Extremely Important",
      dimensions: [
        { service_orientation: 1, altruism: 1, social_contribution: 0.5 },
        { service_orientation: 2, altruism: 2, social_contribution: 1 },
        { service_orientation: 3, altruism: 3, social_contribution: 1.5 },
        { service_orientation: 4, altruism: 4, social_contribution: 2 },
        { service_orientation: 5, altruism: 5, social_contribution: 3 },
        { service_orientation: 6, altruism: 6, social_contribution: 4 },
        { service_orientation: 7, altruism: 7, social_contribution: 5 }
      ]
    },
    source: "Service Orientation Scale"
  },

  {
    id: "fv084",
    type: "scenario",
    category: "work_life_integration",
    subcategory: "career_transition",
    question: "You're offered a higher-paying job that would require compromising some of your core values. How do you decide?",
    options: [
      {
        text: "Decline the offer to maintain value integrity",
        value: 1,
        dimensions: { values_integrity: 5, authenticity: 4, financial_sacrifice: -2, moral_courage: 4 }
      },
      {
        text: "Accept and try to influence the organization toward better values",
        value: 2,
        dimensions: { change_agent: 4, optimism: 3, compromise: 2, values_integrity: -1 }
      },
      {
        text: "Negotiate for changes that would align with my values",
        value: 3,
        dimensions: { negotiation: 4, problem_solving: 3, assertiveness: 3, creativity: 2 }
      },
      {
        text: "Take the job temporarily while looking for better alignment",
        value: 4,
        dimensions: { pragmatism: 3, financial_security: 3, strategic_thinking: 2, values_integrity: -2 }
      }
    ],
    source: "Values-Career Decision Framework"
  },

  {
    id: "fv085",
    type: "likert",
    category: "work_life_integration",
    subcategory: "legacy_thinking",
    question: "I think about the legacy I want to leave through my work and life.",
    scale: {
      min: 1, max: 7,
      minLabel: "Never", maxLabel: "Very Frequently",
      dimensions: [
        { legacy_focus: 1, long_term_thinking: 1, impact_consciousness: 0.5 },
        { legacy_focus: 2, long_term_thinking: 2, impact_consciousness: 1 },
        { legacy_focus: 3, long_term_thinking: 3, impact_consciousness: 1.5 },
        { legacy_focus: 4, long_term_thinking: 4, impact_consciousness: 2 },
        { legacy_focus: 5, long_term_thinking: 5, impact_consciousness: 3 },
        { legacy_focus: 6, long_term_thinking: 6, impact_consciousness: 4 },
        { legacy_focus: 7, long_term_thinking: 7, impact_consciousness: 5 }
      ]
    },
    source: "Legacy Thinking Assessment"
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
  // Spiritual/Faith Foundations (15 dimensions)
  spiritual_purpose: { name: "Spiritual Purpose", description: "Sense of life meaning through spiritual beliefs" },
  transcendence: { name: "Transcendent Connection", description: "Connection to something greater than oneself" },
  spiritual_integrity: { name: "Spiritual Integrity", description: "Consistency between beliefs and actions" },
  spiritual_practices: { name: "Spiritual Practices", description: "Engagement in regular spiritual activities" },
  sacred_calling: { name: "Sacred Work View", description: "Viewing work as sacred or spiritually significant" },
  divine_relationship: { name: "Divine Relationship", description: "Personal connection with God or higher power" },
  spiritual_growth: { name: "Spiritual Growth", description: "Commitment to ongoing spiritual development" },
  community_connection: { name: "Faith Community", description: "Importance of spiritual community" },
  spiritual_coping: { name: "Spiritual Coping", description: "Using faith in difficult times" },
  scriptural_guidance: { name: "Sacred Text Guidance", description: "Drawing wisdom from sacred writings" },
  worship_engagement: { name: "Worship Expression", description: "Meaningful spiritual worship practices" },
  spiritual_discernment: { name: "Spiritual Discernment", description: "Seeking divine guidance in decisions" },
  eternal_perspective: { name: "Eternal Perspective", description: "Considering eternal significance of actions" },
  spiritual_transformation: { name: "Spiritual Transformation", description: "Life change through spiritual journey" },
  moral_guidance: { name: "Moral Guidance", description: "Spiritual beliefs guiding ethical decisions" },
  
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
  
  // Workplace Ethics (15 dimensions)
  integrity: { name: "Workplace Integrity", description: "Honesty and ethical behavior at work" },
  moral_courage: { name: "Moral Courage", description: "Speaking up for ethical principles" },
  transparency: { name: "Transparency", description: "Openness and honest communication" },
  accountability: { name: "Accountability", description: "Taking responsibility for actions" },
  ethical_leadership: { name: "Ethical Leadership", description: "Leading with moral principles" },
  whistleblowing: { name: "Whistleblowing Readiness", description: "Willingness to report wrongdoing" },
  professional_ethics: { name: "Professional Ethics", description: "Adherence to professional standards" },
  stakeholder_orientation: { name: "Stakeholder Orientation", description: "Considering all affected parties" },
  environmental_ethics: { name: "Environmental Ethics", description: "Commitment to environmental responsibility" },
  diversity_ethics: { name: "Diversity Ethics", description: "Valuing diversity and inclusion" },
  customer_ethics: { name: "Customer Ethics", description: "Putting customer welfare first" },
  innovation_ethics: { name: "Innovation Ethics", description: "Responsible innovation practices" },
  truth_telling: { name: "Truth Telling", description: "Commitment to honesty and truthfulness" },
  stewardship: { name: "Resource Stewardship", description: "Responsible use of organizational resources" },
  quality_commitment: { name: "Quality Commitment", description: "Dedication to excellence and quality" },
  
  // Work-Life Integration (5 dimensions)
  calling: { name: "Work as Calling", description: "Experience of work as meaningful vocation" },
  work_life_balance: { name: "Work-Life Balance", description: "Harmony between work and personal life" },
  boundary_setting: { name: "Boundary Management", description: "Ability to maintain healthy limits" },
  values_integration: { name: "Values Integration", description: "Aligning personal values with work" },
  holistic_success: { name: "Holistic Success", description: "Balanced definition of success" },
  
  // Response Validity (5 dimensions)
  response_validity: { name: "Response Validity", description: "Honesty and quality of responses" },
  attention_check: { name: "Attention Check", description: "Careful reading of questions" },
  social_desirability: { name: "Social Desirability Bias", description: "Tendency to give socially desirable answers" },
  consistency: { name: "Response Consistency", description: "Consistency across similar questions" },
  response_effort: { name: "Response Effort", description: "Level of effort in responding" }
};

export default complete90FaithValuesQuestions;