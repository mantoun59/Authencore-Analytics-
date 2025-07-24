import { useState, useCallback } from 'react';
import { SwipeData } from '@/types/assessment.enhanced';

interface GenZScenario {
  id: string;
  category: string;
  text: string;
  context?: string;
  emoji?: string;
  responses: Record<string, Record<string, number>>;
}

interface ValueSelection {
  valueId: string;
  rank: number;
}

interface GenZResponse {
  scenarioId: string;
  response: string;
  responseTime: number;
  swipeData?: SwipeData;
}

interface GenZDimension {
  score: number;
  category: string;
  factors: string[];
}

interface GenZTraits {
  innovation: number;
  collaboration: number;
  autonomy: number;
  transparency: number;
  continuous_learning: number;
}

interface WorkplacePreferences {
  remote_hybrid: number;
  flat_hierarchy: number;
  quick_feedback: number;
  flexible_schedule: number;
  purpose_driven: number;
  [key: string]: number;
}

interface RedFlags {
  micromanagement: number;
  rigid_structure: number;
  poor_work_life: number;
  outdated_tech: number;
  [key: string]: number;
}

interface CompanyMatch {
  name: string;
  score: number;
  culture: string[];
  values: string[];
  tags: string[];
}

interface WorkplaceProfile {
  name: string;
  emoji: string;
  description: string;
  strengths: string[];
  preferences: string[];
}

interface ValidityMetrics {
  responseConsistency: number;
  fakeGoodPattern: number;
  fakeBadPattern: number;
  socialDesirabilityBias: number;
  speedFlags: number;
  patternFlags: boolean;
  engagementLevel: number;
  authenticityScore: number;
}

export interface GenZScoringData {
  sessionId: string;
  responses: GenZResponse[];
  valuesSelection: Array<{
    valueId: string;
    rank: number;
  }>;
  collaborationResponse?: {
    scenarioId: string;
    selectedOption: string;
    optionScores: Record<string, number>;
  };
  userData: {
    username: string;
    birthYear?: number;
    avatarEmoji?: string;
  };
  startTime: number;
}

export const useGenZScoring = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDimensions = useCallback((responses: GenZResponse[], scenarios: GenZScenario[]) => {
    const dimensions: Record<string, GenZDimension> = {
      flexibility: { score: 50, category: 'work_style', factors: [] },
      purpose_alignment: { score: 50, category: 'values', factors: [] },
      growth_mindset: { score: 50, category: 'learning', factors: [] },
      digital_native: { score: 70, category: 'innovation', factors: [] },
      work_life_balance: { score: 50, category: 'culture', factors: [] },
      authenticity: { score: 50, category: 'trust', factors: [] },
      social_impact: { score: 50, category: 'values', factors: [] }
    };

    responses.forEach(response => {
      const scenario = scenarios.find(s => s.id === response.scenarioId);
      if (!scenario || !scenario.responses[response.response]) return;

      const scoreDeltas = scenario.responses[response.response];
      
      Object.entries(scoreDeltas).forEach(([key, delta]) => {
        if (key === 'flexibility' && dimensions.flexibility) {
          dimensions.flexibility.score = Math.max(0, Math.min(100, dimensions.flexibility.score + (delta as number) * 3));
        }
        if (key === 'growth_mindset' && dimensions.growth_mindset) {
          dimensions.growth_mindset.score = Math.max(0, Math.min(100, dimensions.growth_mindset.score + (delta as number) * 3));
        }
        if (key === 'innovation' && dimensions.digital_native) {
          dimensions.digital_native.score = Math.max(0, Math.min(100, dimensions.digital_native.score + (delta as number) * 2));
        }
        if (key === 'authenticity' && dimensions.authenticity) {
          dimensions.authenticity.score = Math.max(0, Math.min(100, dimensions.authenticity.score + (delta as number) * 3));
        }
        if (key === 'work_life_balance' && dimensions.work_life_balance) {
          dimensions.work_life_balance.score = Math.max(0, Math.min(100, dimensions.work_life_balance.score + (delta as number) * 3));
        }
      });
    });

    return dimensions;
  }, []);

  const calculateTraits = useCallback((responses: GenZResponse[], scenarios: GenZScenario[]) => {
    const traits: GenZTraits = {
      innovation: 0,
      collaboration: 0,
      autonomy: 0,
      transparency: 0,
      continuous_learning: 0
    };

    responses.forEach(response => {
      const scenario = scenarios.find(s => s.id === response.scenarioId);
      if (!scenario) return;

      // Map responses to traits based on scenario category and response type
      if (scenario.category === 'innovation' && response.response === 'love') {
        traits.innovation += 5;
      }
      if (scenario.category === 'collaboration' && ['love', 'good'].includes(response.response)) {
        traits.collaboration += 3;
      }
      if (response.response === 'nope' || response.response === 'toxic') {
        traits.autonomy += 2;
      }
      if (scenario.category === 'culture' && response.response === 'toxic') {
        traits.transparency += 4;
      }
      if (scenario.category === 'learning' && ['love', 'good'].includes(response.response)) {
        traits.continuous_learning += 3;
      }
    });

    return traits;
  }, []);

  const calculateWorkplacePreferences = useCallback((valuesSelection: ValueSelection[]) => {
    const preferences: WorkplacePreferences = {
      remote_hybrid: 0,
      flat_hierarchy: 0,
      quick_feedback: 0,
      flexible_schedule: 0,
      purpose_driven: 0
    };

    valuesSelection.forEach(({ valueId, rank }) => {
      const weight = 6 - rank; // Rank 1 = 5 points, Rank 5 = 1 point
      
      switch (valueId) {
        case 'v2': // Remote First
          preferences.remote_hybrid += weight * 4;
          break;
        case 'v5': // Work-Life Balance
          preferences.flexible_schedule += weight * 3;
          break;
        case 'v6': // Impact
          preferences.purpose_driven += weight * 4;
          break;
        case 'v8': // Autonomy
          preferences.flat_hierarchy += weight * 3;
          break;
        case 'v12': // Transparency
          preferences.quick_feedback += weight * 2;
          break;
      }
    });

    return preferences;
  }, []);

  const calculateRedFlags = useCallback((responses: GenZResponse[], scenarios: GenZScenario[]) => {
    const redFlags: RedFlags = {
      micromanagement: 0,
      rigid_structure: 0,
      poor_work_life: 0,
      outdated_tech: 0
    };

    responses.forEach(response => {
      const scenario = scenarios.find(s => s.id === response.scenarioId);
      if (!scenario) return;

      if (response.response === 'toxic' || response.response === 'nope') {
        if (scenario.category === 'work_style') {
          redFlags.micromanagement += 1;
        }
        if (scenario.category === 'culture') {
          redFlags.rigid_structure += 1;
        }
        if (scenario.text.includes('Friday') || scenario.text.includes('5am')) {
          redFlags.poor_work_life += 1;
        }
        if (scenario.category === 'innovation') {
          redFlags.outdated_tech += 1;
        }
      }
    });

    return redFlags;
  }, []);

  const generateCompanyMatches = useCallback((dimensions: Record<string, GenZDimension>, traits: GenZTraits, redFlags: RedFlags) => {
    const companies = [
      {
        name: 'TechFlow Innovations',
        culture: ['innovative', 'flexible', 'fast-paced'],
        values: ['growth', 'innovation', 'autonomy'],
        tags: ['Remote-first', 'Equity', 'Learning budget']
      },
      {
        name: 'Green Impact Co',
        culture: ['mission-driven', 'sustainable', 'collaborative'],
        values: ['impact', 'transparency', 'community'],
        tags: ['B-Corp', 'Carbon neutral', '4-day week']
      },
      {
        name: 'Digital Studios',
        culture: ['creative', 'flexible', 'diverse'],
        values: ['creativity', 'diversity', 'balance'],
        tags: ['Creative freedom', 'Unlimited PTO', 'Inclusive']
      }
    ];

    const matches: CompanyMatch[] = companies.map(company => {
      let score = Math.random() * 20 + 60; // Base score 60-80

      // Boost score based on alignment
      if (company.culture.includes('innovative') && traits.innovation > 10) {
        score += 15;
      }
      if (company.culture.includes('flexible') && dimensions.flexibility.score > 70) {
        score += 10;
      }
      if (company.values.includes('impact') && dimensions.social_impact.score > 60) {
        score += 12;
      }

      // Penalty for red flags
      if (redFlags.poor_work_life > 3 && !company.tags.includes('4-day week')) {
        score -= 8;
      }

      return {
        ...company,
        score: Math.min(95, Math.max(45, Math.round(score)))
      };
    });

    return matches.sort((a, b) => b.score - a.score);
  }, []);

  const determineWorkplaceProfile = useCallback((dimensions: Record<string, GenZDimension>, traits: GenZTraits): WorkplaceProfile => {
    const profiles: Record<string, WorkplaceProfile> = {
      innovative_collaborator: {
        name: 'The Innovative Collaborator',
        emoji: '🚀',
        description: 'You thrive in dynamic environments where innovation meets teamwork',
        strengths: ['Creative problem-solving', 'Team synergy', 'Adaptability'],
        preferences: ['Collaborative workspaces', 'Innovation time', 'Cross-functional teams']
      },
      purpose_driven_achiever: {
        name: 'The Purpose-Driven Achiever',
        emoji: '🎯',
        description: 'You excel when your work creates meaningful impact',
        strengths: ['Goal orientation', 'Values alignment', 'Long-term thinking'],
        preferences: ['Mission-driven companies', 'Clear impact metrics', 'Social responsibility']
      },
      flexible_creator: {
        name: 'The Flexible Creator',
        emoji: '🎨',
        description: 'You need freedom to create and work on your own terms',
        strengths: ['Creative expression', 'Independent work', 'Flexible thinking'],
        preferences: ['Flexible schedules', 'Creative autonomy', 'Remote options']
      },
      digital_pioneer: {
        name: 'The Digital Pioneer',
        emoji: '⚡',
        description: 'You leverage technology to drive innovation and efficiency',
        strengths: ['Tech savvy', 'Process optimization', 'Digital fluency'],
        preferences: ['Latest tools', 'Tech-forward culture', 'Automation']
      }
    };

    // Determine profile based on highest scoring dimensions and traits
    const scores = {
      innovative_collaborator: traits.innovation + traits.collaboration,
      purpose_driven_achiever: dimensions.purpose_alignment.score + dimensions.social_impact.score,
      flexible_creator: dimensions.flexibility.score + traits.autonomy,
      digital_pioneer: dimensions.digital_native.score + traits.innovation
    };

    const topProfile = Object.entries(scores).reduce((max, [profile, score]) => 
      score > max.score ? { profile, score } : max, 
      { profile: 'innovative_collaborator', score: 0 }
    ).profile;

    return profiles[topProfile];
  }, []);

  const calculateValidityMetrics = useCallback((responses: GenZResponse[], valuesSelection: ValueSelection[], totalTime: number): ValidityMetrics => {
    const totalResponses = responses.length;
    const avgResponseTime = totalTime / totalResponses;
    
    // Fake-Good Pattern Detection
    const fakeGoodPattern = calculateFakeGoodPattern(responses, valuesSelection);
    
    // Fake-Bad Pattern Detection  
    const fakeBadPattern = calculateFakeBadPattern(responses);
    
    // Social Desirability Bias
    const socialDesirabilityBias = calculateSocialDesirabilityBias(responses);
    
    // Response Consistency
    const responseConsistency = calculateResponseConsistency(responses, valuesSelection);
    
    // Speed and Pattern Flags
    const speedFlags = calculateSpeedFlags(responses);
    const patternFlags = calculatePatternFlags(responses);
    
    // Engagement Level
    const engagementLevel = calculateEngagementLevel(responses);
    
    // Overall Authenticity Score
    const authenticityScore = Math.max(0, 100 - (fakeGoodPattern * 0.3) - (fakeBadPattern * 0.3) - (socialDesirabilityBias * 0.2) - (speedFlags * 0.2));
    
    return {
      responseConsistency,
      fakeGoodPattern,
      fakeBadPattern,
      socialDesirabilityBias,
      speedFlags,
      patternFlags,
      engagementLevel,
      authenticityScore
    };
  }, []);

  const calculateFakeGoodPattern = useCallback((responses: GenZResponse[], valuesSelection: ValueSelection[]): number => {
    let fakeGoodScore = 0;
    
    // Check for excessive positive responses
    const positiveResponses = responses.filter(r => ['love', 'good'].includes(r.response)).length;
    const positiveRatio = positiveResponses / responses.length;
    
    if (positiveRatio > 0.85) {
      fakeGoodScore += 40;
    } else if (positiveRatio > 0.75) {
      fakeGoodScore += 25;
    } else if (positiveRatio > 0.65) {
      fakeGoodScore += 15;
    }
    
    // Check for inconsistency between values and responses
    const topValues = valuesSelection.slice(0, 3).map(v => v.valueId);
    let valueConsistency = 0;
    
    responses.forEach(response => {
      if (response.response === 'love' || response.response === 'good') {
        // If responding positively to scenarios that don't align with top values
        if (!isResponseAlignedWithValues(response.scenarioId, topValues)) {
          valueConsistency += 1;
        }
      }
    });
    
    if (valueConsistency > responses.length * 0.4) {
      fakeGoodScore += 30;
    }
    
    return Math.min(100, fakeGoodScore);
  }, []);

  const calculateFakeBadPattern = useCallback((responses: GenZResponse[]): number => {
    let fakeBadScore = 0;
    
    // Check for excessive negative responses
    const negativeResponses = responses.filter(r => ['nope', 'toxic'].includes(r.response)).length;
    const negativeRatio = negativeResponses / responses.length;
    
    if (negativeRatio > 0.8) {
      fakeBadScore += 50;
    } else if (negativeRatio > 0.7) {
      fakeBadScore += 35;
    } else if (negativeRatio > 0.6) {
      fakeBadScore += 20;
    }
    
    // Check for consistently toxic responses without variation
    const toxicResponses = responses.filter(r => r.response === 'toxic').length;
    if (toxicResponses > responses.length * 0.5) {
      fakeBadScore += 25;
    }
    
    return Math.min(100, fakeBadScore);
  }, []);

  const calculateSocialDesirabilityBias = useCallback((responses: GenZResponse[]): number => {
    let biasScore = 0;
    
    // Count responses that are socially desirable but unrealistic
    const perfectResponses = responses.filter(r => {
      // Scenarios about work-life balance, collaboration, etc. where "love" might be socially desirable
      return r.response === 'love' && (r.scenarioId.includes('collaboration') || r.scenarioId.includes('balance'));
    }).length;
    
    if (perfectResponses > responses.length * 0.7) {
      biasScore += 35;
    }
    
    // Check for avoidance of "toxic" responses even for clearly problematic scenarios
    const problematicScenarios = responses.filter(r => 
      r.scenarioId.includes('micromanage') || r.scenarioId.includes('overtime')
    );
    
    const avoidedToxicResponses = problematicScenarios.filter(r => r.response !== 'toxic').length;
    if (avoidedToxicResponses > problematicScenarios.length * 0.8) {
      biasScore += 25;
    }
    
    return Math.min(100, biasScore);
  }, []);

  const calculateResponseConsistency = useCallback((responses: GenZResponse[], valuesSelection: ValueSelection[]): number => {
    let consistencyScore = 100;
    const topValues = valuesSelection.slice(0, 3).map(v => v.valueId);
    
    // Check alignment between top values and scenario responses
    responses.forEach(response => {
      const isPositive = ['love', 'good'].includes(response.response);
      const alignsWithValues = isResponseAlignedWithValues(response.scenarioId, topValues);
      
      if (isPositive && !alignsWithValues) {
        consistencyScore -= 3;
      } else if (!isPositive && alignsWithValues) {
        consistencyScore -= 2;
      }
    });
    
    return Math.max(0, consistencyScore);
  }, []);

  const calculateSpeedFlags = useCallback((responses: GenZResponse[]): number => {
    let speedScore = 0;
    
    // Too fast responses (less than 1 second for swipe decision)
    const tooFastResponses = responses.filter(r => r.responseTime < 1000).length;
    const fastRatio = tooFastResponses / responses.length;
    
    if (fastRatio > 0.6) {
      speedScore += 40;
    } else if (fastRatio > 0.4) {
      speedScore += 25;
    } else if (fastRatio > 0.3) {
      speedScore += 15;
    }
    
    // Too slow responses (over 30 seconds - potential overthinking or distraction)
    const tooSlowResponses = responses.filter(r => r.responseTime > 30000).length;
    if (tooSlowResponses > responses.length * 0.3) {
      speedScore += 15;
    }
    
    return Math.min(100, speedScore);
  }, []);

  const calculatePatternFlags = useCallback((responses: GenZResponse[]): boolean => {
    // Check for alternating patterns
    let alternatingCount = 0;
    for (let i = 1; i < responses.length; i++) {
      const prev = ['love', 'good'].includes(responses[i-1].response);
      const curr = ['love', 'good'].includes(responses[i].response);
      if (prev !== curr) {
        alternatingCount++;
      }
    }
    
    // Flag if more than 80% of responses alternate
    if (alternatingCount > responses.length * 0.8) {
      return true;
    }
    
    // Check for same response repeated too often
    const responseCounts = { love: 0, good: 0, nope: 0, toxic: 0 };
    responses.forEach(r => {
      responseCounts[r.response as keyof typeof responseCounts]++;
    });
    
    const maxCount = Math.max(...Object.values(responseCounts));
    return maxCount > responses.length * 0.85;
  }, []);

  const calculateEngagementLevel = useCallback((responses: GenZResponse[]): number => {
    let engagementScore = 50; // Base score
    
    // Check for swipe data usage (indicates higher engagement)
    const swipeResponses = responses.filter(r => r.swipeData).length;
    engagementScore += (swipeResponses / responses.length) * 20;
    
    // Check response time distribution (good engagement shows thoughtful variation)
    const responseTimes = responses.map(r => r.responseTime);
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
    
    // Moderate variance indicates thoughtful responses
    if (variance > 1000000 && variance < 10000000) {
      engagementScore += 15;
    }
    
    // Check for use of all response types
    const uniqueResponses = new Set(responses.map(r => r.response)).size;
    engagementScore += (uniqueResponses / 4) * 15; // Max 4 response types
    
    return Math.min(100, engagementScore);
  }, []);

  const isResponseAlignedWithValues = useCallback((scenarioId: string, topValues: string[]): boolean => {
    // Map scenario types to values (simplified mapping)
    const scenarioValueMap: Record<string, string[]> = {
      'remote': ['v2'], // Remote First
      'balance': ['v5'], // Work-Life Balance  
      'impact': ['v6'], // Impact
      'autonomy': ['v8'], // Autonomy
      'transparency': ['v12'], // Transparency
      'innovation': ['v1'], // Innovation
      'growth': ['v3'], // Growth
      'collaboration': ['v4'] // Collaboration
    };
    
    for (const [scenarioType, valueIds] of Object.entries(scenarioValueMap)) {
      if (scenarioId.includes(scenarioType)) {
        return valueIds.some(valueId => topValues.includes(valueId));
      }
    }
    
    return false; // Default to not aligned if scenario type not recognized
  }, []);

  const calculateFinalResults = useCallback(async (data: GenZScoringData, scenarios: GenZScenario[]) => {
    setIsCalculating(true);
    
    try {
      const { responses, valuesSelection, collaborationResponse, userData, startTime } = data;
      const totalTime = Date.now() - startTime;
      
      const dimensions = calculateDimensions(responses, scenarios);
      const traits = calculateTraits(responses, scenarios);
      const workplacePreferences = calculateWorkplacePreferences(valuesSelection);
      const redFlags = calculateRedFlags(responses, scenarios);
      const companyMatches = generateCompanyMatches(dimensions, traits, redFlags);
      const workplaceProfile = determineWorkplaceProfile(dimensions, traits);
      const validityMetrics = calculateValidityMetrics(responses, valuesSelection, totalTime);
      
      // Generate employer insights with enhanced validity considerations
      const employerInsights = {
        authenticity: {
          score: validityMetrics.authenticityScore,
          flags: generateValidityFlags(validityMetrics)
        },
        traits: {
          digitalFluency: Math.min(95, dimensions.digital_native.score + 15),
          purposeDriven: dimensions.purpose_alignment.score,
          flexibilityNeeds: dimensions.flexibility.score,
          growthMindset: dimensions.growth_mindset.score
        },
        retention: {
          riskLevel: calculateRetentionRisk(validityMetrics, redFlags) as 'low' | 'medium' | 'high',
          stayProbability: Math.min(95, 40 + Object.values(workplacePreferences).reduce((a, b) => a + b, 0) / 10),
          keyDrivers: ['Flexible work options', 'Growth opportunities', 'Purpose alignment']
        },
        validityAssessment: {
          overallReliability: getReliabilityLevel(validityMetrics),
          recommendedActions: getRecommendedActions(validityMetrics)
        }
      };

      return {
        sessionId: data.sessionId,
        userData,
        workplaceProfile,
        dimensions,
        traits,
        workplacePreferences,
        redFlags,
        companyMatches,
        employerInsights,
        validityMetrics,
        completedAt: new Date().toISOString()
      };
    } finally {
      setIsCalculating(false);
    }
  }, [calculateDimensions, calculateTraits, calculateWorkplacePreferences, calculateRedFlags, generateCompanyMatches, determineWorkplaceProfile, calculateValidityMetrics]);

  const generateValidityFlags = useCallback((validityMetrics: ValidityMetrics): string[] => {
    const flags = [];
    
    if (validityMetrics.fakeGoodPattern > 60) {
      flags.push('Potential fake-good responding detected');
    }
    if (validityMetrics.fakeBadPattern > 60) {
      flags.push('Potential fake-bad responding detected');
    }
    if (validityMetrics.socialDesirabilityBias > 50) {
      flags.push('High social desirability bias');
    }
    if (validityMetrics.speedFlags > 50) {
      flags.push('Response speed concerns');
    }
    if (validityMetrics.patternFlags) {
      flags.push('Systematic response pattern detected');
    }
    if (validityMetrics.responseConsistency < 70) {
      flags.push('Low response consistency');
    }
    
    return flags;
  }, []);

  const calculateRetentionRisk = useCallback((validityMetrics: ValidityMetrics, redFlags: RedFlags): string => {
    if (validityMetrics.authenticityScore < 60) {
      return 'high'; // Low authenticity suggests unreliable data
    }
    
    const totalRedFlags = Object.values(redFlags).reduce((sum, count) => sum + count, 0);
    if (totalRedFlags > 8) {
      return 'high';
    } else if (totalRedFlags > 4) {
      return 'medium';
    }
    
    return 'low';
  }, []);

  const getReliabilityLevel = useCallback((validityMetrics: ValidityMetrics): string => {
    if (validityMetrics.authenticityScore > 85 && validityMetrics.responseConsistency > 80 && !validityMetrics.patternFlags) {
      return 'Excellent';
    } else if (validityMetrics.authenticityScore > 70 && validityMetrics.responseConsistency > 70) {
      return 'Good';
    } else if (validityMetrics.authenticityScore > 55) {
      return 'Moderate';
    } else {
      return 'Poor';
    }
  }, []);

  const getRecommendedActions = useCallback((validityMetrics: ValidityMetrics): string[] => {
    const actions = [];
    
    if (validityMetrics.authenticityScore < 70) {
      actions.push('Consider follow-up interview to verify responses');
    }
    if (validityMetrics.fakeGoodPattern > 50) {
      actions.push('Probe for specific examples during behavioral interviews');
    }
    if (validityMetrics.fakeBadPattern > 50) {
      actions.push('Explore motivation and career goals in interview');
    }
    if (validityMetrics.engagementLevel < 60) {
      actions.push('Assess genuine interest in role and company');
    }
    
    if (actions.length === 0) {
      actions.push('Results appear reliable - proceed with confidence');
    }
    
    return actions;
  }, []);

  return {
    calculateFinalResults,
    isCalculating
  };
};