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
  allPositive: number;
  allNegative: number;
  tooFast: number;
  samePattern: number;
  noSwipes: boolean;
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

  const calculateValidityMetrics = useCallback((responses: GenZResponse[], totalTime: number): ValidityMetrics => {
    const totalResponses = responses.length;
    const avgResponseTime = totalTime / totalResponses;
    
    const positiveCount = responses.filter(r => ['love', 'good'].includes(r.response)).length;
    const negativeCount = responses.filter(r => ['nope', 'toxic'].includes(r.response)).length;
    const fastResponses = responses.filter(r => r.responseTime < 1000).length;
    
    const responsePattern = responses.map(r => r.response);
    const uniqueResponses = new Set(responsePattern).size;
    
    return {
      allPositive: positiveCount / totalResponses,
      allNegative: negativeCount / totalResponses,
      tooFast: fastResponses / totalResponses,
      samePattern: 1 - (uniqueResponses / Math.min(5, totalResponses)),
      noSwipes: !responses.some(r => r.swipeData)
    };
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
      const validityMetrics = calculateValidityMetrics(responses, totalTime);
      
      // Generate employer insights
      const employerInsights = {
        authenticity: {
          score: Math.max(0, 100 - (validityMetrics.allPositive * 30) - (validityMetrics.tooFast * 40)),
          flags: [] as string[]
        },
        traits: {
          digitalFluency: Math.min(95, dimensions.digital_native.score + 15),
          purposeDriven: dimensions.purpose_alignment.score,
          flexibilityNeeds: dimensions.flexibility.score,
          growthMindset: dimensions.growth_mindset.score
        },
        retention: {
          riskLevel: 'low' as 'low' | 'medium' | 'high',
          stayProbability: Math.min(95, 40 + Object.values(workplacePreferences).reduce((a, b) => a + b, 0) / 10),
          keyDrivers: ['Flexible work options', 'Growth opportunities', 'Purpose alignment']
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

  return {
    calculateFinalResults,
    isCalculating
  };
};