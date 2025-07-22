import { CommunicationStylesResults } from '@/hooks/useCommunicationStylesScoring';

export interface EnhancedCommunicationReport {
  // Header Information
  participantName: string;
  assessmentDate: string;
  assessmentType: string;
  
  // Executive Summary
  overallEffectiveness: {
    score: number;
    percentile: number;
    interpretation: string;
    profileType: string;
  };
  
  // Communication Profile Analysis
  communicationProfile: {
    primaryType: string;
    strengthAreas: string[];
    developmentAreas: string[];
    workStyleMatch: string;
    teamContributions: string[];
  };
  
  // Detailed Dimension Analysis
  dimensionBreakdown: {
    dimension: string;
    score: number;
    level: string;
    percentile: number;
    strengthDescription: string;
    developmentRecommendations: string[];
    behavioralIndicators: string[];
  }[];
  
  // Contextual Effectiveness
  situationalEffectiveness: {
    leadership: { score: number; description: string; recommendations: string[] };
    teamwork: { score: number; description: string; recommendations: string[] };
    customerInteraction: { score: number; description: string; recommendations: string[] };
    conflictResolution: { score: number; description: string; recommendations: string[] };
  };
  
  // Professional Development Plan
  developmentPlan: {
    priority: 'High' | 'Medium' | 'Low';
    area: string;
    currentLevel: string;
    targetBehaviors: string[];
    actionSteps: string[];
    timeline: string;
    successMetrics: string[];
  }[];
  
  // Validity and Reliability
  assessmentValidity: {
    responseConsistency: number;
    engagementLevel: string;
    recommendationConfidence: string;
    additionalAssessmentNeeds?: string[];
  };
}

export const generateEnhancedCommunicationReport = (
  results: CommunicationStylesResults,
  participantName: string
): EnhancedCommunicationReport => {
  
  const report: EnhancedCommunicationReport = {
    participantName,
    assessmentDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }),
    assessmentType: 'Communication Styles Assessment',
    
    overallEffectiveness: generateOverallEffectiveness(results),
    communicationProfile: generateCommunicationProfile(results),
    dimensionBreakdown: generateDimensionBreakdown(results),
    situationalEffectiveness: generateSituationalEffectiveness(results),
    developmentPlan: generateDevelopmentPlan(results),
    assessmentValidity: generateAssessmentValidity(results)
  };
  
  return report;
};

const generateOverallEffectiveness = (results: CommunicationStylesResults) => {
  const { overallScore, communicationEffectivenessIndex, profile } = results;
  
  let interpretation = '';
  let percentile = 0;
  
  if (overallScore >= 90) {
    interpretation = `Exceptional communication effectiveness. ${profile.type} style with outstanding capability across all dimensions. Natural communication leader with ability to adapt and influence effectively.`;
    percentile = 95;
  } else if (overallScore >= 80) {
    interpretation = `Strong communication effectiveness. ${profile.type} style with well-developed skills. Effective across most situations with specific strengths in ${profile.strength.toLowerCase()}.`;
    percentile = 85;
  } else if (overallScore >= 70) {
    interpretation = `Good communication effectiveness. ${profile.type} style with solid foundation. Effective in familiar contexts with opportunity to develop ${profile.challenge.toLowerCase()}.`;
    percentile = 70;
  } else if (overallScore >= 60) {
    interpretation = `Developing communication effectiveness. ${profile.type} tendencies with emerging skills. Clear areas for development to enhance overall communication impact.`;
    percentile = 55;
  } else {
    interpretation = `Early-stage communication development. ${profile.type} preferences identified with significant opportunities for skill building across multiple dimensions.`;
    percentile = 35;
  }
  
  return {
    score: overallScore,
    percentile,
    interpretation,
    profileType: profile.type
  };
};

const generateCommunicationProfile = (results: CommunicationStylesResults) => {
  const { profile, dimensions } = results;
  
  // Identify top 3 strength areas
  const strengthAreas = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)
    .slice(0, 3)
    .map(([key, dimension]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (${dimension.score}%)`);
  
  // Identify bottom 2 development areas  
  const developmentAreas = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
    .map(([key, dimension]) => `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} (${dimension.score}%)`);
  
  const teamContributions = generateTeamContributions(profile, dimensions);
  
  return {
    primaryType: profile.type,
    strengthAreas,
    developmentAreas,
    workStyleMatch: profile.workStyle,
    teamContributions
  };
};

const generateTeamContributions = (profile: any, dimensions: any) => {
  const contributions = [];
  
  if (dimensions.assertiveness.score > 70) {
    contributions.push('Driving decisions and taking initiative in team settings');
  }
  if (dimensions.expressiveness.score > 70) {
    contributions.push('Building energy and enthusiasm in group dynamics');
  }
  if (dimensions.informationProcessing.score > 70) {
    contributions.push('Providing thorough analysis and systematic thinking');
  }
  if (dimensions.listeningPatterns.score > 70) {
    contributions.push('Facilitating understanding and building consensus');
  }
  if (dimensions.influenceStrategies.score > 70) {
    contributions.push('Persuading stakeholders and gaining buy-in for initiatives');
  }
  if (dimensions.conflictCommunication.score > 70) {
    contributions.push('Mediating conflicts and finding collaborative solutions');
  }
  if (dimensions.channelPreferences.score > 70) {
    contributions.push('Adapting communication across various platforms and formats');
  }
  
  // Add default contribution based on profile type
  const profileContributions = {
    'Director': 'Leading with clear direction and accountability',
    'Socializer': 'Inspiring and motivating team members',
    'Thinker': 'Ensuring thoroughness and quality in team outputs',
    'Supporter': 'Building stability and maintaining team harmony',
    'Balanced': 'Providing flexibility and adaptability across team needs'
  };
  
  contributions.push(profileContributions[profile.type as keyof typeof profileContributions] || 'Contributing unique communication perspective');
  
  return contributions.slice(0, 4); // Return top 4 contributions
};

const generateDimensionBreakdown = (results: CommunicationStylesResults) => {
  const { dimensions } = results;
  
  return Object.entries(dimensions).map(([key, dimension]) => {
    const dimensionName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    
    const strengthDescriptions = {
      'assertiveness': dimension.score > 70 ? 
        'Demonstrates confident, direct communication that drives results and maintains clear boundaries.' :
        'Developing assertiveness skills to enhance leadership presence and decision-making effectiveness.',
      'expressiveness': dimension.score > 70 ?
        'Shows engaging, animated communication style that builds rapport and motivates others.' :
        'Building expressiveness to create stronger connections and more impactful communication.',
      'informationProcessing': dimension.score > 70 ?
        'Exhibits systematic, thorough approach to processing and communicating complex information.' :
        'Developing more efficient information processing to enhance decision-making speed.',
      'channelPreferences': dimension.score > 70 ?
        'Demonstrates versatility across communication channels and adapts well to different mediums.' :
        'Building comfort and effectiveness across various communication platforms.',
      'listeningPatterns': dimension.score > 70 ?
        'Shows strong active listening skills with empathetic responses and understanding.' :
        'Developing deeper listening skills to build stronger relationships and understanding.',
      'influenceStrategies': dimension.score > 70 ?
        'Uses sophisticated influence techniques to gain buy-in and persuade effectively.' :
        'Building influence capabilities to enhance persuasion and leadership impact.',
      'conflictCommunication': dimension.score > 70 ?
        'Handles conflicts diplomatically and finds solutions that work for all parties.' :
        'Developing conflict resolution skills to manage difficult conversations more effectively.'
    };
    
    const developmentRecommendations = generateDimensionRecommendations(key, dimension);
    const behavioralIndicators = generateBehavioralIndicators(key, dimension);
    
    return {
      dimension: dimensionName,
      score: dimension.score,
      level: dimension.level,
      percentile: dimension.percentile,
      strengthDescription: strengthDescriptions[key as keyof typeof strengthDescriptions] || 'Communication dimension identified.',
      developmentRecommendations,
      behavioralIndicators
    };
  });
};

const generateDimensionRecommendations = (dimension: string, data: any): string[] => {
  const recommendations: Record<string, string[]> = {
    'assertiveness': data.score < 60 ? [
      'Practice stating opinions clearly and confidently in team meetings',
      'Set specific, measurable boundaries with colleagues and stakeholders',
      'Take initiative on projects that align with your expertise',
      'Use "I" statements to express needs and expectations directly'
    ] : [
      'Balance directness with empathy in sensitive conversations',
      'Mentor others in developing assertiveness skills',
      'Practice diplomatic assertiveness in high-stakes situations',
      'Use assertiveness to drive positive organizational change'
    ],
    'expressiveness': data.score < 60 ? [
      'Practice using varied vocal tone and pacing in presentations',
      'Share appropriate personal experiences to build rapport',
      'Use stories and examples to make points more engaging',
      'Experiment with body language and gestures to support your message'
    ] : [
      'Adjust expressiveness based on audience and context',
      'Use expressiveness strategically to motivate and inspire',
      'Help others feel comfortable expressing themselves',
      'Balance enthusiasm with professionalism in formal settings'
    ],
    'informationProcessing': data.score < 60 ? [
      'Develop structured approaches to analyzing complex information',
      'Practice summarizing key points clearly and concisely',
      'Ask clarifying questions to ensure full understanding',
      'Create frameworks for organizing and presenting information'
    ] : [
      'Help others break down complex information into manageable parts',
      'Balance thoroughness with efficiency in time-sensitive situations',
      'Teach systematic thinking approaches to team members',
      'Use analytical skills to support strategic decision-making'
    ],
    'channelPreferences': data.score < 60 ? [
      'Practice communicating effectively via video conferencing platforms',
      'Develop comfort with various digital collaboration tools',
      'Adapt message style for different communication channels',
      'Experiment with visual aids and multimedia in presentations'
    ] : [
      'Help others navigate different communication platforms effectively',
      'Lead adoption of new communication technologies',
      'Create communication guidelines for optimal channel selection',
      'Mentor others in multi-channel communication strategies'
    ],
    'listeningPatterns': data.score < 60 ? [
      'Practice active listening techniques like paraphrasing and reflecting',
      'Ask follow-up questions to demonstrate engagement and understanding',
      'Minimize distractions and give full attention to speakers',
      'Practice empathetic responses that validate others\' perspectives'
    ] : [
      'Model excellent listening behaviors for team members',
      'Use listening skills to facilitate difficult conversations',
      'Help create inclusive environments where all voices are heard',
      'Mentor others in developing empathetic listening skills'
    ],
    'influenceStrategies': data.score < 60 ? [
      'Study and practice different persuasion techniques',
      'Build credibility through expertise and consistent follow-through',
      'Learn to adapt influence style to different personality types',
      'Practice building compelling business cases for your ideas'
    ] : [
      'Use influence skills ethically and for positive organizational impact',
      'Teach influence and persuasion skills to team members',
      'Help build consensus on complex organizational initiatives',
      'Leverage influence to drive positive cultural change'
    ],
    'conflictCommunication': data.score < 60 ? [
      'Learn structured conflict resolution frameworks',
      'Practice staying calm and objective during disagreements',
      'Develop skills in finding win-win solutions',
      'Practice having difficult conversations with clear, specific feedback'
    ] : [
      'Mediate conflicts between team members effectively',
      'Help create psychological safety for difficult conversations',
      'Train others in conflict resolution approaches',
      'Use conflict resolution skills to drive organizational improvements'
    ]
  };
  
  return recommendations[dimension] || [
    'Continue developing this communication dimension',
    'Seek feedback from colleagues on effectiveness',
    'Practice applying skills in various professional contexts',
    'Consider additional training or coaching in this area'
  ];
};

const generateBehavioralIndicators = (dimension: string, data: any): string[] => {
  const indicators: Record<string, string[]> = {
    'assertiveness': [
      'Speaks up in meetings with confidence and clarity',
      'Sets and maintains professional boundaries effectively',
      'Takes initiative on projects and decisions',
      'Communicates expectations and requirements directly'
    ],
    'expressiveness': [
      'Uses varied vocal tone and engaging body language',
      'Shares appropriate emotions and enthusiasm',
      'Tells stories and uses examples to illustrate points',
      'Creates personal connections with colleagues'
    ],
    'informationProcessing': [
      'Processes complex information systematically',
      'Asks thoughtful clarifying questions',
      'Organizes information logically for others',
      'Takes time to consider implications before responding'
    ],
    'channelPreferences': [
      'Adapts communication style to different mediums',
      'Comfortable with various technology platforms',
      'Chooses appropriate channels for different messages',
      'Maintains effectiveness across communication formats'
    ],
    'listeningPatterns': [
      'Gives full attention and maintains eye contact',
      'Asks follow-up questions to show engagement',
      'Reflects back understanding accurately',
      'Shows empathy and validates others\' perspectives'
    ],
    'influenceStrategies': [
      'Builds compelling arguments with supporting evidence',
      'Adapts persuasion style to different audiences',
      'Gains buy-in for ideas and initiatives',
      'Uses credibility and relationships to influence'
    ],
    'conflictCommunication': [
      'Addresses conflicts directly but diplomatically',
      'Remains calm and objective during disagreements',
      'Seeks understanding of all parties\' perspectives',
      'Facilitates solutions that work for everyone'
    ]
  };
  
  return indicators[dimension] || [
    'Demonstrates effective communication in this area',
    'Shows consistent application of relevant skills',
    'Adapts approach based on situation and audience',
    'Continues to develop expertise in this dimension'
  ];
};

const generateSituationalEffectiveness = (results: CommunicationStylesResults) => {
  const { contextualEffectiveness, dimensions, profile } = results;
  
  return {
    leadership: {
      score: contextualEffectiveness.leadership,
      description: contextualEffectiveness.leadership > 75 ?
        `Strong leadership communication effectiveness. ${profile.type} style well-suited for guiding teams and driving organizational objectives.` :
        `Developing leadership communication skills. ${profile.type} approach has potential with focused development in assertiveness and influence.`,
      recommendations: contextualEffectiveness.leadership > 75 ? [
        'Mentor others in developing leadership communication skills',
        'Take on high-visibility leadership opportunities',
        'Practice communicating vision and strategy across organizational levels'
      ] : [
        'Develop confident presentation and public speaking skills',
        'Practice giving clear direction and feedback to team members',
        'Build influence and persuasion capabilities for leadership contexts'
      ]
    },
    teamwork: {
      score: contextualEffectiveness.teamwork,
      description: contextualEffectiveness.teamwork > 75 ?
        `Excellent team communication. ${profile.type} style contributes effectively to collaborative environments and builds strong working relationships.` :
        `Building team communication effectiveness. ${profile.type} approach benefits from enhanced listening and collaborative communication skills.`,
      recommendations: contextualEffectiveness.teamwork > 75 ? [
        'Help facilitate team meetings and collaborative sessions',
        'Support team members who struggle with communication',
        'Lead cross-functional projects requiring strong collaboration'
      ] : [
        'Practice active listening and empathetic responding',
        'Develop skills in building consensus and managing group dynamics',
        'Focus on contributing positively to team morale and effectiveness'
      ]
    },
    customerInteraction: {
      score: contextualEffectiveness.customerService,
      description: contextualEffectiveness.customerService > 75 ?
        `Strong customer communication skills. ${profile.type} style effectively builds rapport and addresses customer needs.` :
        `Developing customer communication effectiveness. ${profile.type} approach can be enhanced with improved listening and service orientation.`,
      recommendations: contextualEffectiveness.customerService > 75 ? [
        'Train others in effective customer communication techniques',
        'Handle complex or challenging customer situations',
        'Develop customer relationship management strategies'
      ] : [
        'Practice empathetic listening and problem-solving communication',
        'Develop skills in managing difficult customer conversations',
        'Focus on building rapport and trust with external stakeholders'
      ]
    },
    conflictResolution: {
      score: contextualEffectiveness.conflictResolution,
      description: contextualEffectiveness.conflictResolution > 75 ?
        `Effective conflict resolution communication. ${profile.type} style manages disagreements well and finds collaborative solutions.` :
        `Building conflict resolution capabilities. ${profile.type} approach would benefit from enhanced diplomatic and mediation skills.`,
      recommendations: contextualEffectiveness.conflictResolution > 75 ? [
        'Mediate conflicts between team members or departments',
        'Train others in conflict resolution communication techniques',
        'Help create systems for preventing and addressing workplace conflicts'
      ] : [
        'Learn structured approaches to conflict resolution',
        'Practice staying calm and objective during disagreements',
        'Develop skills in finding win-win solutions and compromises'
      ]
    }
  };
};

const generateDevelopmentPlan = (results: CommunicationStylesResults) => {
  const { dimensions, profile } = results;
  
  // Get lowest scoring dimensions for development focus
  const developmentAreas = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 3);
  
  return developmentAreas.map(([key, dimension], index) => {
    const priority = index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low' as const;
    const dimensionName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    
    const developmentPlans: Record<string, any> = {
      'assertiveness': {
        targetBehaviors: [
          'Express opinions confidently in group settings',
          'Set clear boundaries and expectations with others',
          'Take initiative on important projects and decisions',
          'Provide direct, constructive feedback when needed'
        ],
        actionSteps: [
          'Practice speaking up in the first 10 minutes of meetings',
          'Volunteer to lead one project or initiative',
          'Schedule regular one-on-one feedback sessions with team members',
          'Join a leadership development program or Toastmasters'
        ],
        timeline: dimension.score < 40 ? '6-12 months' : '3-6 months',
        successMetrics: [
          'Increased participation in team meetings (measured by speaking frequency)',
          '360-degree feedback improvement in leadership presence',
          'Successful completion of leadership project with measurable outcomes',
          'Improved comfort level with giving difficult feedback'
        ]
      },
      'expressiveness': {
        targetBehaviors: [
          'Use varied vocal tone and engaging body language',
          'Share appropriate personal experiences to build rapport',
          'Express enthusiasm and emotions authentically',
          'Use storytelling to make communication more engaging'
        ],
        actionSteps: [
          'Practice presentation skills with video recording for self-review',
          'Share one personal professional experience in team meetings',
          'Join an improv or public speaking group',
          'Practice using stories and analogies in explanations'
        ],
        timeline: dimension.score < 40 ? '4-8 months' : '2-4 months',
        successMetrics: [
          'Improved presentation engagement scores from audiences',
          'Increased comfort level with expressing emotions at work',
          'Positive feedback on storytelling and communication style',
          'Enhanced team relationships and rapport building'
        ]
      },
      'informationProcessing': {
        targetBehaviors: [
          'Process complex information systematically and thoroughly',
          'Ask clarifying questions to ensure understanding',
          'Organize information logically for clear communication',
          'Balance thoroughness with efficiency in decision-making'
        ],
        actionSteps: [
          'Develop and use structured frameworks for information analysis',
          'Practice the "5 Whys" technique for problem-solving',
          'Create templates for organizing and presenting complex information',
          'Take a course in critical thinking or data analysis'
        ],
        timeline: dimension.score < 40 ? '3-6 months' : '2-3 months',
        successMetrics: [
          'Improved accuracy in information analysis and reporting',
          'Reduced time needed for decision-making processes',
          'Positive feedback on clarity and organization of communications',
          'Successful completion of complex analytical projects'
        ]
      },
      'channelPreferences': {
        targetBehaviors: [
          'Adapt communication style effectively across different mediums',
          'Choose appropriate channels for different types of messages',
          'Maintain effectiveness in both digital and in-person formats',
          'Help others navigate communication platform challenges'
        ],
        actionSteps: [
          'Practice presenting via various platforms (video, phone, in-person)',
          'Experiment with different digital collaboration tools',
          'Create communication guidelines for channel selection',
          'Seek training in virtual meeting facilitation'
        ],
        timeline: dimension.score < 40 ? '2-4 months' : '1-2 months',
        successMetrics: [
          'Improved effectiveness scores across different communication channels',
          'Successful facilitation of virtual meetings and collaborations',
          'Positive feedback on multi-channel communication adaptation',
          'Increased comfort and confidence with new communication technologies'
        ]
      },
      'listeningPatterns': {
        targetBehaviors: [
          'Give full attention and demonstrate active engagement',
          'Ask thoughtful follow-up questions',
          'Reflect back understanding accurately',
          'Show empathy and validate others\' perspectives'
        ],
        actionSteps: [
          'Practice the SOLER technique (Square shoulders, Open posture, Lean in, Eye contact, Relax)',
          'Use the "seek first to understand" approach in conversations',
          'Practice paraphrasing and reflecting in daily interactions',
          'Take a course in emotional intelligence or empathetic communication'
        ],
        timeline: dimension.score < 40 ? '3-6 months' : '2-3 months',
        successMetrics: [
          'Improved feedback from colleagues on feeling heard and understood',
          'Increased accuracy in understanding others\' perspectives',
          'Enhanced relationship quality with team members',
          'Reduced miscommunications and conflicts'
        ]
      },
      'influenceStrategies': {
        targetBehaviors: [
          'Build compelling arguments with supporting evidence',
          'Adapt persuasion style to different audiences',
          'Gain buy-in for ideas and initiatives effectively',
          'Use credibility and relationships to influence positively'
        ],
        actionSteps: [
          'Study and practice different persuasion frameworks (SCARF, SPIN, etc.)',
          'Practice building business cases for proposals',
          'Seek mentoring from influential leaders in the organization',
          'Take a negotiation or influence training course'
        ],
        timeline: dimension.score < 40 ? '4-8 months' : '3-4 months',
        successMetrics: [
          'Increased success rate in gaining approval for proposals',
          'Improved ability to build consensus on complex issues',
          'Enhanced credibility and influence within the organization',
          'Successful implementation of influenced initiatives'
        ]
      },
      'conflictCommunication': {
        targetBehaviors: [
          'Address conflicts directly but diplomatically',
          'Remain calm and objective during disagreements',
          'Seek understanding of all parties\' perspectives',
          'Facilitate solutions that work for everyone involved'
        ],
        actionSteps: [
          'Learn and practice conflict resolution frameworks (e.g., mediation techniques)',
          'Practice having difficult conversations with role-playing exercises',
          'Seek training in emotional regulation and stress management',
          'Find opportunities to mediate minor conflicts between colleagues'
        ],
        timeline: dimension.score < 40 ? '6-9 months' : '3-6 months',
        successMetrics: [
          'Successful resolution of workplace conflicts',
          'Improved comfort level with difficult conversations',
          'Positive feedback on diplomatic communication during disagreements',
          'Reduced escalation of conflicts to higher management'
        ]
      }
    };
    
    const plan = developmentPlans[key] || {
      targetBehaviors: ['Develop stronger communication skills in this area'],
      actionSteps: ['Seek additional training and practice opportunities'],
      timeline: '3-6 months',
      successMetrics: ['Improved effectiveness in this communication dimension']
    };
    
    return {
      priority,
      area: dimensionName,
      currentLevel: dimension.level,
      ...plan
    };
  });
};

const generateAssessmentValidity = (results: CommunicationStylesResults) => {
  const { distortionAnalysis, timeSpent } = results;
  
  const responseConsistency = Math.max(0, 100 - distortionAnalysis.score);
  
  let engagementLevel = '';
  if (timeSpent < 300000) { // Less than 5 minutes
    engagementLevel = 'Low - Rapid responses may indicate limited engagement';
  } else if (timeSpent < 900000) { // 5-15 minutes  
    engagementLevel = 'Moderate - Appropriate time investment for thorough responses';
  } else if (timeSpent < 1800000) { // 15-30 minutes
    engagementLevel = 'High - Thoughtful consideration evident in response patterns';
  } else {
    engagementLevel = 'Very High - Extensive deliberation, may indicate overthinking';
  }
  
  let recommendationConfidence = '';
  const additionalAssessmentNeeds = [];
  
  if (distortionAnalysis.reliability === 'High') {
    recommendationConfidence = 'High - Results are reliable for decision-making purposes';
  } else if (distortionAnalysis.reliability === 'Moderate') {
    recommendationConfidence = 'Moderate - Results provide useful insights with minor cautions';
    additionalAssessmentNeeds.push('Consider behavioral interview to validate key findings');
  } else if (distortionAnalysis.reliability === 'Low') {
    recommendationConfidence = 'Low - Results should be supplemented with additional assessment methods';
    additionalAssessmentNeeds.push('Behavioral interview required');
    additionalAssessmentNeeds.push('Reference checks focusing on communication effectiveness');
  } else {
    recommendationConfidence = 'Questionable - Results not recommended for decision-making';
    additionalAssessmentNeeds.push('Complete re-assessment under controlled conditions');
    additionalAssessmentNeeds.push('Structured behavioral interview');
    additionalAssessmentNeeds.push('360-degree feedback assessment');
  }
  
  return {
    responseConsistency,
    engagementLevel,
    recommendationConfidence,
    additionalAssessmentNeeds: additionalAssessmentNeeds.length > 0 ? additionalAssessmentNeeds : undefined
  };
};