import { CommunicationStylesResults } from '../hooks/useCommunicationStylesScoring';

export interface CommunicationReport {
  // Basic Report Data
  title: string;
  subtitle: string;
  participantName: string;
  dateGenerated: string;
  
  // Executive Summary
  executiveSummary: {
    overallScore: number;
    profileType: string;
    keyStrengths: string[];
    primaryChallenges: string[];
    recommendedActions: string[];
  };
  
  // Detailed Analysis
  dimensionAnalysis: {
    dimension: string;
    score: number;
    level: string;
    percentile: number;
    description: string;
    interpretation: string;
    behavioralIndicators: string[];
    workplaceImplications: string[];
  }[];
  
  // Communication Profile
  profileAnalysis: {
    primaryType: string;
    secondaryInfluences: string[];
    workStyleDescription: string;
    communicationPreferences: string[];
    strengthsDescription: string;
    challengesDescription: string;
    adaptabilityInsights: string;
  };
  
  // Contextual Effectiveness
  contextualAnalysis: {
    context: string;
    effectiveness: number;
    description: string;
    recommendations: string[];
  }[];
  
  // Development Recommendations
  developmentPlan: {
    priority: string;
    area: string;
    currentLevel: string;
    targetLevel: string;
    actionItems: string[];
    timeframe: string;
    successIndicators: string[];
  }[];
  
  // Employer-Only Section
  employerAnalysis?: {
    distortionAnalysis: {
      score: number;
      level: string;
      reliability: string;
      indicators: string[];
      recommendations: string[];
    };
    hiringRecommendations: {
      overallRecommendation: 'Highly Recommended' | 'Recommended' | 'Consider with Caution' | 'Not Recommended';
      roleAlignment: string[];
      concernAreas: string[];
      interviewQuestions: string[];
      referenceCheckFocus: string[];
    };
    teamFitAnalysis: {
      idealTeamComposition: string[];
      potentialConflicts: string[];
      managementConsiderations: string[];
      trainingNeeds: string[];
    };
  };
}

// Enhanced Communication Report with Modern Design & Analysis
export const generateCommunicationReport = (
  results: CommunicationStylesResults,
  participantName: string,
  includeEmployerSection: boolean = false
): CommunicationReport => {
  
  const report: CommunicationReport = {
    title: "Communication Styles Assessment Report",
    subtitle: "Comprehensive Analysis of Communication Preferences and Effectiveness",
    participantName,
    dateGenerated: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    
    executiveSummary: generateExecutiveSummary(results),
    dimensionAnalysis: generateDimensionAnalysis(results),
    profileAnalysis: generateProfileAnalysis(results),
    contextualAnalysis: generateContextualAnalysis(results),
    developmentPlan: generateDevelopmentPlan(results)
  };
  
  // Add employer-only section if requested
  if (includeEmployerSection) {
    report.employerAnalysis = generateEmployerAnalysis(results);
  }
  
  return report;
};

const generateExecutiveSummary = (results: CommunicationStylesResults) => {
  const { overallScore, profile, dimensions } = results;
  
  // Identify top 3 strengths (highest scoring dimensions) 
  const strengthDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)
    .slice(0, 3);
  
  const keyStrengths = strengthDimensions.map(([key, dimension]) => {
    const strengthDescriptions = {
      'assertiveness': `${profile.type} communication with ${dimension.score}% assertiveness effectiveness`,
      'expressiveness': `${dimension.level} expressiveness driving ${profile.primary.toLowerCase()}`, 
      'informationProcessing': `${dimension.level} information processing supporting ${profile.workStyle.toLowerCase()}`,
      'channelPreferences': `${dimension.level} channel versatility across communication platforms`,
      'listeningPatterns': `${dimension.level} listening effectiveness with ${dimension.percentile}th percentile performance`,
      'influenceStrategies': `${dimension.level} influence capability aligned with ${profile.strength.toLowerCase()}`,
      'conflictCommunication': `${dimension.level} conflict resolution skills in ${profile.workStyle.toLowerCase()}`
    };
    return strengthDescriptions[key as keyof typeof strengthDescriptions] || `${dimension.level} ${key} communication skill`;
  });
  
  // Identify primary challenges (lowest scoring dimensions)
  const challengeDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2);
  
  const primaryChallenges = challengeDimensions.map(([key, dimension]) => {
    const challengeDescriptions = {
      'assertiveness': `${dimension.level} assertiveness (${dimension.score}%) may limit ${profile.type} effectiveness in leadership situations`,
      'expressiveness': `${dimension.level} expressiveness (${dimension.percentile}th percentile) could impact ${profile.primary.toLowerCase()} in team dynamics`,
      'informationProcessing': `${dimension.level} information processing may create gaps in ${profile.workStyle.toLowerCase()}`,
      'channelPreferences': `${dimension.level} channel adaptation could limit versatility in diverse communication contexts`,
      'listeningPatterns': `${dimension.level} listening effectiveness (${dimension.score}%) may affect relationship building in ${profile.workStyle.toLowerCase()}`,
      'influenceStrategies': `${dimension.level} influence skills could limit impact in ${profile.strength.toLowerCase()} situations`,
      'conflictCommunication': `${dimension.level} conflict resolution abilities may create challenges in ${profile.challenge.toLowerCase()}`
    };
    return challengeDescriptions[key as keyof typeof challengeDescriptions] || `Development opportunity in ${key} (${dimension.score}%)`;
  });
  
  const recommendedActions = [
    `Focus on ${profile.type.toLowerCase()} communication strengths while addressing ${challengeDimensions[0][0]} development`,
    `Leverage ${profile.strength.toLowerCase()} in team and leadership contexts`,
    `Practice adaptive communication based on situational needs`,
    `Seek feedback and coaching in identified development areas`
  ];
  
  return {
    overallScore,
    profileType: profile.type,
    keyStrengths,
    primaryChallenges,
    recommendedActions
  };
};

const generateDimensionAnalysis = (results: CommunicationStylesResults) => {
  const { dimensions } = results;
  
  return Object.entries(dimensions).map(([key, dimension]) => {
    const interpretations = {
      'assertiveness': {
        behavioral: [
          'Expresses opinions and ideas clearly',
          'Comfortable with direct communication',
          'Sets boundaries effectively',
          'Takes initiative in conversations'
        ],
        workplace: [
          'Effective in leadership roles',
          'Valuable in decision-making processes',
          'Good at setting expectations with team members',
          'Comfortable with accountability discussions'
        ]
      },
      'expressiveness': {
        behavioral: [
          'Uses varied vocal tone and gestures',
          'Shares emotions appropriately',
          'Engages others through storytelling',
          'Creates rapport through personal connection'
        ],
        workplace: [
          'Effective at motivating and inspiring others',
          'Good at building team morale',
          'Valuable in customer-facing roles',
          'Helps create positive work environment'
        ]
      },
      'informationProcessing': {
        behavioral: [
          'Processes information systematically',
          'Considers multiple perspectives',
          'Asks clarifying questions',
          'Takes time to make thoughtful decisions'
        ],
        workplace: [
          'Valuable in complex problem-solving',
          'Good at analyzing data and trends',
          'Effective in planning and strategy roles',
          'Helps ensure thoroughness in decision-making'
        ]
      },
      'channelPreferences': {
        behavioral: [
          'Adapts communication style to medium',
          'Comfortable with technology tools',
          'Chooses appropriate channels for messages',
          'Maintains effectiveness across platforms'
        ],
        workplace: [
          'Effective in remote and hybrid work',
          'Good at managing multi-channel communications',
          'Valuable in client relationship management',
          'Helps bridge communication gaps'
        ]
      },
      'listeningPatterns': {
        behavioral: [
          'Gives full attention to speakers',
          'Asks follow-up questions',
          'Reflects back understanding',
          'Shows empathy and understanding'
        ],
        workplace: [
          'Effective in customer service roles',
          'Good at conflict mediation',
          'Valuable in team collaboration',
          'Helps build trust and rapport'
        ]
      },
      'influenceStrategies': {
        behavioral: [
          'Uses persuasion techniques effectively',
          'Builds compelling arguments',
          'Adapts influence style to audience',
          'Gains buy-in for ideas and initiatives'
        ],
        workplace: [
          'Effective in sales and negotiation',
          'Good at change management',
          'Valuable in leadership roles',
          'Helps drive organizational initiatives'
        ]
      },
      'conflictCommunication': {
        behavioral: [
          'Addresses conflicts directly but diplomatically',
          'Seeks win-win solutions',
          'Remains calm under pressure',
          'Facilitates resolution between parties'
        ],
        workplace: [
          'Effective in management roles',
          'Good at team mediation',
          'Valuable in high-pressure situations',
          'Helps maintain team harmony'
        ]
      }
    };
    
    const template = interpretations[key as keyof typeof interpretations];
    
    return {
      dimension: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      score: dimension.score,
      level: dimension.level,
      percentile: dimension.percentile,
      description: dimension.description,
      interpretation: generateInterpretation(key, dimension.score, dimension.level),
      behavioralIndicators: template?.behavioral || [],
      workplaceImplications: template?.workplace || []
    };
  });
};

const generateInterpretation = (dimension: string, score: number, level: string): string => {
  const interpretations = {
    'assertiveness': {
      'Low': 'Tends to be more collaborative and diplomatic in approach. May benefit from developing confidence in expressing strong opinions and taking decisive action.',
      'Moderate': 'Demonstrates balanced assertiveness, adapting directness based on situation. Good foundation for further development.',
      'High': 'Communicates with confidence and clarity. Comfortable taking charge and expressing viewpoints directly.',
      'Very High': 'Highly assertive communication style. May need to balance directness with diplomacy in sensitive situations.'
    },
    'expressiveness': {
      'Low': 'Maintains professional composure with controlled emotional expression. May benefit from developing greater warmth and connection.',
      'Moderate': 'Shows appropriate expressiveness for most situations. Good balance between professionalism and personal connection.',
      'High': 'Expressive and engaging communication style. Effective at building rapport and creating positive interactions.',
      'Very High': 'Highly expressive with strong emotional communication. May need to adjust expressiveness for formal or sensitive contexts.'
    },
    'informationProcessing': {
      'Low': 'Prefers quick decision-making with available information. May benefit from developing more systematic analysis approaches.',
      'Moderate': 'Balances efficiency with thoroughness. Good foundation for handling various types of information processing needs.',
      'High': 'Systematic and thorough in information analysis. Effective at processing complex information and making informed decisions.',
      'Very High': 'Extremely thorough in information processing. May need to balance comprehensiveness with efficiency in time-sensitive situations.'
    },
    'channelPreferences': {
      'Low': 'Has preferred communication channels but may struggle with less familiar mediums. Development opportunity for channel versatility.',
      'Moderate': 'Comfortable with common communication channels. Good foundation for expanding digital and virtual communication skills.',
      'High': 'Adaptable across multiple communication channels. Effective at choosing appropriate mediums for different messages.',
      'Very High': 'Highly versatile across all communication channels. Excellent at leveraging technology and adapting to new platforms.'
    },
    'listeningPatterns': {
      'Low': 'Focuses primarily on conveying own messages. Would benefit from developing stronger active listening and empathy skills.',
      'Moderate': 'Demonstrates good listening skills in most situations. Foundation for developing deeper empathetic responses.',
      'High': 'Strong active listening skills with empathetic responses. Effective at understanding and responding to others\' needs.',
      'Very High': 'Exceptional listening and empathy skills. May sometimes focus too much on others\' needs at expense of own objectives.'
    },
    'influenceStrategies': {
      'Low': 'Relies on basic influence approaches. Would benefit from developing more sophisticated persuasion and influence techniques.',
      'Moderate': 'Uses effective influence strategies in routine situations. Good foundation for developing advanced persuasion skills.',
      'High': 'Skilled at using various influence strategies. Effective at gaining buy-in and persuading others.',
      'Very High': 'Highly sophisticated influence abilities. May need to ensure influence is used ethically and appropriately.'
    },
    'conflictCommunication': {
      'Low': 'May avoid or struggle with conflict situations. Development opportunity for building conflict resolution skills.',
      'Moderate': 'Handles routine conflicts reasonably well. Good foundation for developing advanced conflict resolution abilities.',
      'High': 'Skilled at managing and resolving conflicts. Effective at finding solutions that work for all parties.',
      'Very High': 'Exceptional conflict resolution skills. May sometimes be called upon to mediate complex interpersonal situations.'
    }
  };
  
  return interpretations[dimension as keyof typeof interpretations]?.[level as keyof any] || 'Individual communication pattern identified.';
};

const generateProfileAnalysis = (results: CommunicationStylesResults) => {
  const { profile, dimensions, adaptabilityScore } = results;
  
  // Identify secondary influences
  const sortedDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)
    .slice(1, 3);
  
  const secondaryInfluences = sortedDimensions.map(([key]) => {
    const influences = {
      'assertiveness': 'Direct communication tendencies',
      'expressiveness': 'Expressive communication elements',
      'informationProcessing': 'Analytical processing influences',
      'channelPreferences': 'Multi-channel adaptability',
      'listeningPatterns': 'Empathetic listening qualities',
      'influenceStrategies': 'Persuasive communication skills',
      'conflictCommunication': 'Conflict resolution capabilities'
    };
    return influences[key as keyof typeof influences] || 'Communication strength';
  });
  
  const communicationPreferences = [
    `Prefers ${profile.workStyle.toLowerCase()}`,
    `Communicates with ${profile.primary.toLowerCase()}`,
    `Values ${profile.secondary.toLowerCase()}`,
    `Adapts communication style ${adaptabilityScore > 70 ? 'very effectively' : adaptabilityScore > 50 ? 'reasonably well' : 'with some effort'}`
  ];
  
  return {
    primaryType: profile.type,
    secondaryInfluences,
    workStyleDescription: profile.workStyle,
    communicationPreferences,
    strengthsDescription: profile.strength,
    challengesDescription: profile.challenge,
    adaptabilityInsights: `Adaptability Score: ${adaptabilityScore}/100. ${
      adaptabilityScore > 80 ? 'Highly adaptable communication style across contexts.' :
      adaptabilityScore > 60 ? 'Good adaptability with room for further development.' :
      'May benefit from developing greater communication flexibility.'
    }`
  };
};

const generateContextualAnalysis = (results: CommunicationStylesResults) => {
  const { contextualEffectiveness } = results;
  
  const contextDescriptions = {
    leadership: {
      description: 'Ability to communicate vision, direction, and expectations effectively in leadership roles.',
      recommendations: [
        'Develop executive presence and strategic communication',
        'Practice inspiring and motivating team members',
        'Enhance skills in delivering difficult messages',
        'Build coalition and stakeholder management abilities'
      ]
    },
    teamwork: {
      description: 'Effectiveness in collaborative team environments and group communication.',
      recommendations: [
        'Strengthen active listening in team meetings',
        'Develop skills in building consensus',
        'Practice giving and receiving feedback',
        'Enhance conflict resolution within teams'
      ]
    },
    customerService: {
      description: 'Communication effectiveness in client-facing and service-oriented interactions.',
      recommendations: [
        'Develop empathetic listening and response skills',
        'Practice handling difficult customer situations',
        'Enhance problem-solving communication',
        'Build relationship management capabilities'
      ]
    },
    salesNegotiation: {
      description: 'Persuasive communication and negotiation effectiveness in sales contexts.',
      recommendations: [
        'Develop consultative selling communication',
        'Practice objection handling and persuasion',
        'Enhance value-based communication',
        'Build relationship-based selling skills'
      ]
    },
    conflictResolution: {
      description: 'Ability to mediate, resolve conflicts, and manage difficult conversations.',
      recommendations: [
        'Learn structured conflict resolution approaches',
        'Practice remaining neutral and objective',
        'Develop skills in finding win-win solutions',
        'Enhance emotional regulation during conflicts'
      ]
    },
    publicSpeaking: {
      description: 'Effectiveness in formal presentations and public speaking situations.',
      recommendations: [
        'Develop confidence in public speaking',
        'Practice engaging and dynamic presentation skills',
        'Enhance audience analysis and adaptation',
        'Build storytelling and persuasive speaking abilities'
      ]
    }
  };
  
  return Object.entries(contextualEffectiveness).map(([context, effectiveness]) => {
    const template = contextDescriptions[context as keyof typeof contextDescriptions];
    return {
      context: context.charAt(0).toUpperCase() + context.slice(1).replace(/([A-Z])/g, ' $1'),
      effectiveness,
      description: template?.description || 'Communication effectiveness in this context',
      recommendations: template?.recommendations || ['Develop context-specific communication skills']
    };
  });
};

const generateDevelopmentPlan = (results: CommunicationStylesResults) => {
  const { developmentAreas, dimensions } = results;
  
  return developmentAreas.map(area => {
    const currentDimension = Object.entries(dimensions).find(([key]) => 
      key.includes(area.description.toLowerCase()) || 
      area.description.toLowerCase().includes(key)
    );
    
    const currentLevel = currentDimension?.[1].level || 'Moderate';
    const targetLevel = currentLevel === 'Low' ? 'Moderate' : 
                        currentLevel === 'Moderate' ? 'High' : 'Very High';
    
    const timeframes = {
      'High': '3-6 months',
      'Medium': '6-12 months',
      'Low': '12-18 months'
    };
    
    const successIndicators = [
      'Increased confidence in this communication area',
      'Positive feedback from colleagues and supervisors',
      'Improved effectiveness in relevant situations',
      'Greater comfort with challenging communications'
    ];
    
    return {
      priority: area.priority,
      area: area.description,
      currentLevel,
      targetLevel,
      actionItems: area.actionItems,
      timeframe: timeframes[area.priority as keyof typeof timeframes] || '6-12 months',
      successIndicators
    };
  });
};

const generateEmployerAnalysis = (results: CommunicationStylesResults) => {
  const { distortionAnalysis, profile, dimensions, overallScore, contextualEffectiveness } = results;
  
  // Generate hiring recommendation
  let overallRecommendation: 'Highly Recommended' | 'Recommended' | 'Consider with Caution' | 'Not Recommended';
  
  if (distortionAnalysis.reliability === 'High' && overallScore >= 75) {
    overallRecommendation = 'Highly Recommended';
  } else if (distortionAnalysis.reliability === 'High' && overallScore >= 60) {
    overallRecommendation = 'Recommended';
  } else if (distortionAnalysis.reliability === 'Moderate' || overallScore >= 40) {
    overallRecommendation = 'Consider with Caution';
  } else {
    overallRecommendation = 'Not Recommended';
  }
  
  // Role alignment analysis
  const roleAlignment = [];
  if (contextualEffectiveness.leadership > 70) roleAlignment.push('Leadership and management roles');
  if (contextualEffectiveness.teamwork > 70) roleAlignment.push('Collaborative team environments');
  if (contextualEffectiveness.customerService > 70) roleAlignment.push('Client-facing and service roles');
  if (contextualEffectiveness.salesNegotiation > 70) roleAlignment.push('Sales and negotiation positions');
  if (contextualEffectiveness.conflictResolution > 70) roleAlignment.push('Mediation and conflict resolution roles');
  if (contextualEffectiveness.publicSpeaking > 70) roleAlignment.push('Presentation and public speaking roles');
  
  // Concern areas
  const concernAreas = [];
  if (distortionAnalysis.score > 40) concernAreas.push('Response authenticity and reliability');
  if (dimensions.conflictCommunication.score < 40) concernAreas.push('Conflict resolution capabilities');
  if (dimensions.assertiveness.score < 30) concernAreas.push('Leadership assertiveness');
  if (dimensions.listeningPatterns.score < 40) concernAreas.push('Active listening and empathy');
  
  // Interview questions
  const interviewQuestions = [
    'Can you describe a time when you had to communicate a difficult message to a team member?',
    'How do you adapt your communication style when working with different personality types?',
    'Tell me about a conflict you helped resolve. What was your approach?',
    'Describe a situation where you had to influence someone who initially disagreed with your idea.',
    'How do you ensure you\'re truly listening and understanding others in important conversations?'
  ];
  
  // Reference check focus
  const referenceCheckFocus = [
    'Communication effectiveness in team settings',
    'Ability to handle difficult conversations',
    'Adaptability to different communication styles',
    'Conflict resolution and mediation skills',
    'Leadership and influence capabilities'
  ];
  
  // Team fit analysis
  const idealTeamComposition = [
    `Works well with ${profile.type === 'Director' ? 'detail-oriented supporters' : 
                        profile.type === 'Socializer' ? 'focused and organized team members' :
                        profile.type === 'Thinker' ? 'decisive and action-oriented colleagues' :
                        profile.type === 'Supporter' ? 'assertive and decisive leaders' : 'diverse communication styles'}`,
    'Benefits from clear communication protocols',
    'Thrives in environments that value their communication strengths'
  ];
  
  const potentialConflicts = [
    `May clash with ${profile.type === 'Director' ? 'overly cautious or indirect communicators' :
                        profile.type === 'Socializer' ? 'highly analytical or reserved team members' :
                        profile.type === 'Thinker' ? 'impulsive or highly expressive colleagues' :
                        profile.type === 'Supporter' ? 'very direct or confrontational team members' : 'rigid communication styles'}`,
    'Potential misunderstandings in high-pressure situations',
    'May need mediation in communication style conflicts'
  ];
  
  const managementConsiderations = [
    `Respond well to ${profile.type === 'Director' ? 'direct feedback and clear expectations' :
                        profile.type === 'Socializer' ? 'positive reinforcement and social recognition' :
                        profile.type === 'Thinker' ? 'detailed explanations and logical rationale' :
                        profile.type === 'Supporter' ? 'patient guidance and supportive feedback' : 'adaptive management approaches'}`,
    'May need coaching in identified development areas',
    'Benefits from communication skill development opportunities'
  ];
  
  const trainingNeeds = results.developmentAreas.map(area => area.description);
  
  return {
    distortionAnalysis: {
      score: distortionAnalysis.score,
      level: distortionAnalysis.level,
      reliability: distortionAnalysis.reliability,
      indicators: distortionAnalysis.indicators,
      recommendations: distortionAnalysis.recommendations
    },
    hiringRecommendations: {
      overallRecommendation,
      roleAlignment,
      concernAreas,
      interviewQuestions,
      referenceCheckFocus
    },
    teamFitAnalysis: {
      idealTeamComposition,
      potentialConflicts,
      managementConsiderations,
      trainingNeeds
    }
  };
};

export default generateCommunicationReport;