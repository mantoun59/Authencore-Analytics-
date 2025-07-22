import { CommunicationStylesResults } from '@/hooks/useCommunicationStylesScoring';

export interface EmployerReport {
  // Header
  candidateName: string;
  assessmentType: string;
  dateCompleted: string;
  positionConsidered?: string;
  
  // Executive Summary
  hiringRecommendation: {
    overall: 'Highly Recommended' | 'Recommended' | 'Consider with Caution' | 'Not Recommended';
    confidence: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    reasoning: string[];
  };
  
  // Personality/Communication Profile
  profileSummary: {
    primaryType: string;
    strengthAreas: string[];
    potentialConcerns: string[];
    workEnvironmentFit: string;
    teamDynamicsContribution: string[];
  };
  
  // Role Alignment Analysis
  roleAlignment: {
    leadership: { score: number; fit: string; reasoning: string };
    teamwork: { score: number; fit: string; reasoning: string };
    customerFacing: { score: number; fit: string; reasoning: string };
    independentWork: { score: number; fit: string; reasoning: string };
    conflictResolution: { score: number; fit: string; reasoning: string };
  };
  
  // Interview Guide
  interviewQuestions: {
    category: string;
    questions: string[];
    lookFor: string[];
    redFlags: string[];
  }[];
  
  // Management Considerations
  managementGuidance: {
    motivationalFactors: string[];
    communicationPreferences: string[];
    developmentNeeds: string[];
    potentialChallenges: string[];
    managementTips: string[];
  };
  
  // Validity Assessment
  assessmentReliability: {
    score: number;
    level: string;
    concerns: string[];
    recommendations: string[];
  };
  
  // Development Recommendations
  onboardingRecommendations: string[];
  professionalDevelopment: string[];
  performanceExpectations: string[];
}

export const generateEmployerReport = (
  results: CommunicationStylesResults,
  candidateName: string,
  positionConsidered?: string
): EmployerReport => {
  
  return {
    candidateName,
    assessmentType: 'Communication Styles Assessment',
    dateCompleted: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    positionConsidered,
    
    hiringRecommendation: generateHiringRecommendation(results),
    profileSummary: generateProfileSummary(results),
    roleAlignment: generateRoleAlignment(results),
    interviewQuestions: generateInterviewQuestions(results),
    managementGuidance: generateManagementGuidance(results),
    assessmentReliability: generateAssessmentReliability(results),
    onboardingRecommendations: generateOnboardingRecommendations(results),
    professionalDevelopment: generateProfessionalDevelopment(results),
    performanceExpectations: generatePerformanceExpectations(results)
  };
};

const generateHiringRecommendation = (results: CommunicationStylesResults) => {
  const { overallScore, distortionAnalysis, profile, dimensions } = results;
  
  let overall: EmployerReport['hiringRecommendation']['overall'];
  let confidence: number;
  let riskLevel: EmployerReport['hiringRecommendation']['riskLevel'];
  const reasoning: string[] = [];
  
  // Base recommendation on overall score and distortion
  if (overallScore >= 85 && distortionAnalysis.reliability === 'High') {
    overall = 'Highly Recommended';
    confidence = 95;
    riskLevel = 'Low';
    reasoning.push(`Exceptional communication effectiveness (${overallScore}%)`);
    reasoning.push(`Strong ${profile.type} profile well-suited for professional environments`);
    reasoning.push('High assessment reliability with minimal response distortion');
  } else if (overallScore >= 75 && ['High', 'Moderate'].includes(distortionAnalysis.reliability)) {
    overall = 'Recommended';
    confidence = 85;
    riskLevel = 'Low';
    reasoning.push(`Strong communication effectiveness (${overallScore}%)`);
    reasoning.push(`${profile.type} style brings valuable contributions to team dynamics`);
    reasoning.push(`Reliable assessment results with ${distortionAnalysis.reliability.toLowerCase()} validity`);
  } else if (overallScore >= 65 && distortionAnalysis.reliability !== 'Questionable') {
    overall = 'Consider with Caution';
    confidence = 70;
    riskLevel = 'Moderate';
    reasoning.push(`Adequate communication effectiveness (${overallScore}%) with development potential`);
    reasoning.push(`${profile.type} profile may require specific management support`);
    reasoning.push('Recommend additional behavioral assessment for validation');
  } else {
    overall = 'Not Recommended';
    confidence = 60;
    riskLevel = 'High';
    reasoning.push(`Below-average communication effectiveness (${overallScore}%)`);
    if (distortionAnalysis.reliability === 'Questionable') {
      reasoning.push('Questionable assessment validity raises concerns about response authenticity');
    }
    reasoning.push('Significant development required before role readiness');
  }
  
  // Add specific concerns from low-scoring dimensions
  const lowDimensions = Object.entries(dimensions)
    .filter(([_, dim]) => dim.score < 50)
    .map(([key, dim]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (${dim.score}%)`);
    
  if (lowDimensions.length > 0) {
    reasoning.push(`Areas of concern: ${lowDimensions.join(', ')}`);
  }
  
  return { overall, confidence, riskLevel, reasoning };
};

const generateProfileSummary = (results: CommunicationStylesResults) => {
  const { profile, dimensions } = results;
  
  const strengthAreas = Object.entries(dimensions)
    .filter(([_, dim]) => dim.score > 70)
    .map(([key, dim]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (${dim.score}%)`);
    
  const potentialConcerns = Object.entries(dimensions)
    .filter(([_, dim]) => dim.score < 60)
    .map(([key, dim]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} - ${dim.level} performance may impact effectiveness`);
  
  const teamContributions = [];
  if (dimensions.assertiveness.score > 70) teamContributions.push('Taking initiative and driving decisions');
  if (dimensions.expressiveness.score > 70) teamContributions.push('Building energy and maintaining team morale');
  if (dimensions.listeningPatterns.score > 70) teamContributions.push('Facilitating understanding and building consensus');
  if (dimensions.conflictCommunication.score > 70) teamContributions.push('Mediating conflicts and finding solutions');
  if (dimensions.influenceStrategies.score > 70) teamContributions.push('Persuading stakeholders and gaining buy-in');
  
  return {
    primaryType: profile.type,
    strengthAreas,
    potentialConcerns,
    workEnvironmentFit: profile.workStyle,
    teamDynamicsContribution: teamContributions
  };
};

const generateRoleAlignment = (results: CommunicationStylesResults) => {
  const { contextualEffectiveness, profile } = results;
  
  const getFitDescription = (score: number): string => {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 70) return 'Good Fit';
    if (score >= 60) return 'Moderate Fit';
    if (score >= 50) return 'Developing Fit';
    return 'Poor Fit';
  };
  
  return {
    leadership: {
      score: contextualEffectiveness.leadership,
      fit: getFitDescription(contextualEffectiveness.leadership),
      reasoning: contextualEffectiveness.leadership > 70 ? 
        `${profile.type} profile demonstrates strong leadership communication with effective ${profile.strength.toLowerCase()}` :
        `${profile.type} style may need development in assertiveness and influence for leadership roles`
    },
    teamwork: {
      score: contextualEffectiveness.teamwork,
      fit: getFitDescription(contextualEffectiveness.teamwork),
      reasoning: contextualEffectiveness.teamwork > 70 ?
        `Excellent collaborative communication aligning with ${profile.workStyle.toLowerCase()}` :
        `Team effectiveness could improve with development in listening and collaborative skills`
    },
    customerFacing: {
      score: contextualEffectiveness.customerService,
      fit: getFitDescription(contextualEffectiveness.customerService),
      reasoning: contextualEffectiveness.customerService > 70 ?
        `Strong customer communication with ${profile.type} approach building effective relationships` :
        `Customer service effectiveness limited by current communication development level`
    },
    independentWork: {
      score: Math.min(100, results.dimensions.informationProcessing.score + results.dimensions.assertiveness.score) / 2,
      fit: getFitDescription(Math.min(100, results.dimensions.informationProcessing.score + results.dimensions.assertiveness.score) / 2),
      reasoning: results.dimensions.informationProcessing.score > 70 ?
        `${profile.type} style well-suited for independent analysis and decision-making` :
        `May benefit from structured support and guidance in independent work contexts`
    },
    conflictResolution: {
      score: contextualEffectiveness.conflictResolution,
      fit: getFitDescription(contextualEffectiveness.conflictResolution),
      reasoning: contextualEffectiveness.conflictResolution > 70 ?
        `Strong conflict resolution abilities supporting ${profile.workStyle.toLowerCase()}` :
        `Conflict management skills need development before handling complex interpersonal issues`
    }
  };
};

const generateInterviewQuestions = (results: CommunicationStylesResults) => {
  const { profile, dimensions } = results;
  const questions = [];
  
  // Communication Style Verification
  questions.push({
    category: 'Communication Style Verification',
    questions: [
      'Describe your preferred communication style and how you adapt it for different audiences.',
      'Tell me about a time when you had to communicate complex information to a non-technical stakeholder.',
      'How do you handle situations where your communication style conflicts with a colleague\'s preferences?',
      `Given your ${profile.type} communication style, how do you ensure you don't ${profile.challenge.toLowerCase()}?`
    ],
    lookFor: [
      'Self-awareness of communication preferences',
      'Ability to adapt style based on audience needs',
      'Understanding of own communication strengths and limitations',
      'Concrete examples of successful communication adaptation'
    ],
    redFlags: [
      'Lack of awareness about communication impact on others',
      'Rigid communication approach with no adaptation',
      'Blaming others for communication breakdowns',
      'Inconsistency with assessment results'
    ]
  });
  
  // Based on lowest scoring dimension
  const lowestDimension = Object.entries(dimensions).sort(([,a], [,b]) => a.score - b.score)[0];
  const dimensionName = lowestDimension[0].charAt(0).toUpperCase() + lowestDimension[0].slice(1).replace(/([A-Z])/g, ' $1');
  
  const dimensionQuestions: Record<string, any> = {
    'assertiveness': {
      category: 'Assertiveness and Leadership',
      questions: [
        'Describe a situation where you had to stand firm on an unpopular decision.',
        'Tell me about a time when you had to give difficult feedback to a colleague.',
        'How do you handle pushback when you believe strongly in your position?',
        'Describe your approach to setting boundaries with colleagues or customers.'
      ],
      lookFor: [
        'Ability to maintain position under pressure',
        'Diplomatic but firm communication',
        'Comfort with direct, honest conversations',
        'Evidence of backbone in challenging situations'
      ],
      redFlags: [
        'Avoiding difficult conversations',
        'Always backing down from conflict',
        'Inability to set or maintain boundaries',
        'Passive-aggressive communication patterns'
      ]
    },
    'expressiveness': {
      category: 'Expressiveness and Engagement',
      questions: [
        'How do you build rapport with new team members or clients?',
        'Describe your approach to motivating others during challenging times.',
        'Tell me about a presentation where you needed to engage a difficult audience.',
        'How do you show enthusiasm while maintaining professionalism?'
      ],
      lookFor: [
        'Natural warmth and connection-building',
        'Appropriate emotional expression',
        'Ability to engage and motivate others',
        'Balance between authenticity and professionalism'
      ],
      redFlags: [
        'Overly formal or robotic interaction style',
        'Inability to connect on interpersonal level',
        'Inappropriate emotional expression',
        'Discomfort with showing genuine enthusiasm'
      ]
    },
    'informationProcessing': {
      category: 'Information Processing and Decision Making',
      questions: [
        'Walk me through your process for analyzing complex information.',
        'Describe a time when you had to make a quick decision with limited information.',
        'How do you ensure accuracy when processing large amounts of data?',
        'Tell me about a situation where your thorough analysis prevented a problem.'
      ],
      lookFor: [
        'Systematic approach to information analysis',
        'Balance between thoroughness and efficiency',
        'Quality decision-making under pressure',
        'Evidence of analytical thinking skills'
      ],
      redFlags: [
        'Impulsive decision-making without analysis',
        'Paralysis by analysis in time-sensitive situations',
        'Difficulty organizing complex information',
        'Poor attention to detail in analysis'
      ]
    },
    'listeningPatterns': {
      category: 'Listening and Empathy',
      questions: [
        'Describe a time when really listening to someone changed your perspective.',
        'How do you ensure you understand someone\'s point of view when you disagree?',
        'Tell me about a situation where you helped resolve a misunderstanding between colleagues.',
        'How do you handle conversations when you\'re pressed for time?'
      ],
      lookFor: [
        'Active listening behaviors and techniques',
        'Empathy and perspective-taking ability',
        'Patience in understanding others',
        'Evidence of building on others\' ideas'
      ],
      redFlags: [
        'Always waiting for their turn to speak',
        'Making assumptions without clarification',
        'Showing impatience during others\' explanations',
        'Consistently misunderstanding others\' points'
      ]
    },
    'influenceStrategies': {
      category: 'Influence and Persuasion',
      questions: [
        'Describe a time when you successfully changed someone\'s mind about an important issue.',
        'How do you approach gaining buy-in from skeptical stakeholders?',
        'Tell me about a situation where you had to influence without formal authority.',
        'What strategies do you use when logical arguments aren\'t working?'
      ],
      lookFor: [
        'Sophisticated influence techniques beyond just logic',
        'Ability to understand others\' motivations',
        'Ethical use of persuasion strategies',
        'Success in building consensus'
      ],
      redFlags: [
        'Manipulation or coercive influence tactics',
        'Inability to persuade even with good ideas',
        'Over-reliance on authority or position',
        'Giving up easily when met with resistance'
      ]
    },
    'conflictCommunication': {
      category: 'Conflict Resolution',
      questions: [
        'Walk me through how you handled a significant conflict with a colleague.',
        'Describe a time when you mediated a dispute between team members.',
        'How do you approach conversations when emotions are running high?',
        'Tell me about a situation where you had to deliver news that would upset someone.'
      ],
      lookFor: [
        'Calm, diplomatic approach to conflict',
        'Ability to remain objective during disputes',
        'Skills in finding win-win solutions',
        'Comfort with difficult conversations'
      ],
      redFlags: [
        'Avoiding conflicts entirely',
        'Escalating conflicts unnecessarily',
        'Taking sides rather than mediating',
        'Inability to remain calm under pressure'
      ]
    }
  };
  
  if (dimensionQuestions[lowestDimension[0]]) {
    questions.push(dimensionQuestions[lowestDimension[0]]);
  }
  
  // Situational effectiveness questions
  questions.push({
    category: 'Situational Leadership and Adaptability',
    questions: [
      'Describe how you adapt your communication style for different stakeholder groups.',
      'Tell me about a time when you had to lead a team through a challenging change.',
      'How do you handle situations where your natural communication style isn\'t working?',
      'Describe your approach to communicating with senior executives versus front-line employees.'
    ],
    lookFor: [
      'Flexibility in communication approach',
      'Situational awareness and adaptation',
      'Leadership communication skills',
      'Understanding of audience needs'
    ],
    redFlags: [
      'One-size-fits-all communication approach',
      'Inability to read the room',
      'Inappropriate communication for the audience',
      'Lack of situational awareness'
    ]
  });
  
  return questions;
};

const generateManagementGuidance = (results: CommunicationStylesResults) => {
  const { profile, dimensions } = results;
  
  const motivationalFactors = [];
  const communicationPreferences = [];
  const developmentNeeds = [];
  const potentialChallenges = [];
  const managementTips = [];
  
  // Profile-specific guidance
  const profileGuidance: Record<string, any> = {
    'Director': {
      motivational: ['Clear goals and deadlines', 'Autonomy in execution', 'Results-based recognition', 'Leadership opportunities'],
      communication: ['Direct, concise communication', 'Bottom-line focus', 'Minimal small talk', 'Respect for time constraints'],
      challenges: ['May appear impatient with others', 'Could overlook team emotional needs', 'Might make decisions too quickly'],
      tips: ['Give them control over their projects', 'Focus feedback on results and efficiency', 'Don\'t micromanage their process']
    },
    'Socializer': {
      motivational: ['Team recognition', 'Collaborative projects', 'Variety and interaction', 'Public acknowledgment'],
      communication: ['Warm, personal approach', 'Allow for relationship building', 'Include social elements', 'Encourage brainstorming'],
      challenges: ['May talk too much in meetings', 'Could lose focus on details', 'Might overpromise enthusiasm'],
      tips: ['Help them structure their ideas', 'Set clear deadlines for deliverables', 'Use their enthusiasm to motivate others']
    },
    'Thinker': {
      motivational: ['Quality standards', 'Time for analysis', 'Recognition for accuracy', 'Systematic processes'],
      communication: ['Provide detailed information', 'Allow processing time', 'Respect need for preparation', 'Focus on logic and data'],
      challenges: ['May be slow to make decisions', 'Could get lost in details', 'Might resist quick changes'],
      tips: ['Give advance notice of changes', 'Provide comprehensive information', 'Allow time for thoughtful responses']
    },
    'Supporter': {
      motivational: ['Team harmony', 'Stable environment', 'Helping others succeed', 'Gradual, supported change'],
      communication: ['Gentle, supportive tone', 'Personal attention', 'Collaborative approach', 'Patience with pace'],
      challenges: ['May avoid difficult conversations', 'Could resist necessary changes', 'Might suppress own needs'],
      tips: ['Encourage them to voice opinions', 'Provide security during changes', 'Acknowledge their contributions to team harmony']
    },
    'Balanced': {
      motivational: ['Variety in tasks', 'Flexibility in approach', 'Recognition for adaptability', 'Cross-functional opportunities'],
      communication: ['Adapt style based on situation', 'Provide options and choices', 'Respect their versatility', 'Use their perspective on team dynamics'],
      challenges: ['May lack distinctive strengths', 'Could be seen as indecisive', 'Might not stand out in specialized roles'],
      tips: ['Help them identify signature strengths', 'Use them as cultural bridge-builders', 'Leverage their adaptability in complex situations']
    }
  };
  
  const guidance = profileGuidance[profile.type] || profileGuidance['Balanced'];
  
  motivationalFactors.push(...guidance.motivational);
  communicationPreferences.push(...guidance.communication);
  potentialChallenges.push(...guidance.challenges);
  managementTips.push(...guidance.tips);
  
  // Add dimension-specific development needs
  Object.entries(dimensions).forEach(([key, dimension]) => {
    if (dimension.score < 60) {
      const dimensionName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      developmentNeeds.push(`${dimensionName} development (current: ${dimension.level})`);
    }
  });
  
  // Add general management tips
  managementTips.push('Regular feedback aligned with their communication style');
  managementTips.push('Clear expectations about communication standards');
  managementTips.push('Opportunities to leverage their natural strengths');
  
  return {
    motivationalFactors,
    communicationPreferences,
    developmentNeeds,
    potentialChallenges,
    managementTips
  };
};

const generateAssessmentReliability = (results: CommunicationStylesResults) => {
  const { distortionAnalysis } = results;
  
  return {
    score: Math.max(0, 100 - distortionAnalysis.score),
    level: distortionAnalysis.reliability,
    concerns: distortionAnalysis.indicators,
    recommendations: distortionAnalysis.recommendations
  };
};

const generateOnboardingRecommendations = (results: CommunicationStylesResults) => {
  const { profile } = results;
  
  const recommendations = [
    `Introduce team communication norms aligned with ${profile.type} preferences`,
    'Provide clear communication expectations and protocols',
    'Set up mentoring relationship focused on organizational communication culture',
    `Leverage their ${profile.strength.toLowerCase()} during initial projects`
  ];
  
  if (profile.challenge.includes('impatient')) {
    recommendations.push('Provide clear timelines and expectations to manage impatience');
  }
  if (profile.challenge.includes('avoid')) {
    recommendations.push('Create safe environment for difficult conversations');
  }
  if (profile.challenge.includes('detail')) {
    recommendations.push('Provide structured frameworks for detail management');
  }
  
  return recommendations;
};

const generateProfessionalDevelopment = (results: CommunicationStylesResults) => {
  const { dimensions } = results;
  const development = [];
  
  // Add development based on lowest scoring dimensions
  const developmentAreas = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 3);
    
  developmentAreas.forEach(([key, dimension]) => {
    const dimensionName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    development.push(`${dimensionName} development training (Priority: ${dimension.score < 40 ? 'High' : dimension.score < 60 ? 'Medium' : 'Low'})`);
  });
  
  development.push('Communication effectiveness coaching');
  development.push('Leadership communication skills program');
  development.push('Emotional intelligence development');
  
  return development;
};

const generatePerformanceExpectations = (results: CommunicationStylesResults) => {
  const { profile, overallScore } = results;
  
  const expectations = [
    `Demonstrate ${profile.type} communication effectiveness in team interactions`,
    `Leverage ${profile.strength.toLowerCase()} to contribute to team goals`,
    'Adapt communication style appropriately for different stakeholders',
    'Participate actively in team meetings and collaborative sessions'
  ];
  
  if (overallScore > 80) {
    expectations.push('Mentor others in effective communication practices');
    expectations.push('Take on communication-intensive projects and assignments');
  } else if (overallScore > 60) {
    expectations.push('Seek feedback on communication effectiveness regularly');
    expectations.push('Participate in communication skills development opportunities');
  } else {
    expectations.push('Work with manager on communication improvement plan');
    expectations.push('Complete communication skills training within first 90 days');
  }
  
  return expectations;
};