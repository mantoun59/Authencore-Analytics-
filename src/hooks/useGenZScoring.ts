import { useState, useCallback } from 'react';
import { GenZScenario, GenZValue, companyProfiles } from '../data/genZScenariosFixed';

export interface GenZDimensions {
  flexibility: { score: number; weight: number };
  purpose_alignment: { score: number; weight: number };
  growth_mindset: { score: number; weight: number };
  digital_native: { score: number; weight: number };
  work_life_balance: { score: number; weight: number };
  authenticity: { score: number; weight: number };
  social_impact: { score: number; weight: number };
}

export interface GenZTraits {
  innovation: number;
  collaboration: number;
  autonomy: number;
  transparency: number;
  diversity_inclusion: number;
  mental_health_awareness: number;
  sustainability: number;
  continuous_learning: number;
}

export interface WorkplacePreferences {
  remote_hybrid: number;
  flexible_hours: number;
  casual_culture: number;
  flat_hierarchy: number;
  quick_feedback: number;
  tech_forward: number;
  mission_driven: number;
}

export interface RedFlags {
  micromanagement: number;
  rigid_structure: number;
  poor_work_life: number;
  lack_of_growth: number;
  outdated_tech: number;
  toxic_culture: number;
}

export interface ValidityCheck {
  allPositive: number;
  allNegative: number;
  tooFast: number;
  samePattern: number;
  noSwipes: boolean;
}

export interface CompanyMatch {
  id: string;
  name: string;
  score: number;
  tags: string[];
  matchReasons: string[];
}

export interface WorkplaceProfile {
  name: string;
  emoji: string;
  traits: string[];
  description: string;
}

export interface GenZResults {
  overallScore: number;
  dimensions: GenZDimensions;
  traits: GenZTraits;
  workStyle: string;
  teamVibe: string;
  energyPeak: string;
  commStyle: string;
  companyMatches: CompanyMatch[];
  workplacePreferences: WorkplacePreferences;
  redFlags: RedFlags;
  workplaceProfile: WorkplaceProfile;
  validityCheck: ValidityCheck;
  authenticityScore: number;
  retentionRisk: {
    level: 'low' | 'medium' | 'high';
    probability: number;
    keyFactors: string[];
  };
}

export interface ScenarioResponse {
  scenarioId: string;
  category: string;
  reaction: 'love' | 'good' | 'neutral' | 'bad' | 'toxic';
  responseTime: number;
  timestamp: number;
}

export interface UserData {
  username: string;
  email?: string;
  birthYear: number;
  avatar: string;
  topValues: GenZValue[];
  responses: ScenarioResponse[];
  collaborationResponse?: {
    scenarioId: string;
    selectedOption: string;
    scores: { [key: string]: number };
  };
  validityCheck?: ValidityCheck;
  bookmarks?: string[];
}

export const useGenZScoring = () => {
  const [dimensions, setDimensions] = useState<GenZDimensions>({
    flexibility: { score: 0, weight: 0.15 },
    purpose_alignment: { score: 0, weight: 0.20 },
    growth_mindset: { score: 0, weight: 0.15 },
    digital_native: { score: 0, weight: 0.10 },
    work_life_balance: { score: 0, weight: 0.20 },
    authenticity: { score: 0, weight: 0.10 },
    social_impact: { score: 0, weight: 0.10 }
  });

  const [traits, setTraits] = useState<GenZTraits>({
    innovation: 0,
    collaboration: 0,
    autonomy: 0,
    transparency: 0,
    diversity_inclusion: 0,
    mental_health_awareness: 0,
    sustainability: 0,
    continuous_learning: 0
  });

  const [workplacePreferences, setWorkplacePreferences] = useState<WorkplacePreferences>({
    remote_hybrid: 0,
    flexible_hours: 0,
    casual_culture: 0,
    flat_hierarchy: 0,
    quick_feedback: 0,
    tech_forward: 0,
    mission_driven: 0
  });

  const [redFlags, setRedFlags] = useState<RedFlags>({
    micromanagement: 0,
    rigid_structure: 0,
    poor_work_life: 0,
    lack_of_growth: 0,
    outdated_tech: 0,
    toxic_culture: 0
  });

  const [validityCheck, setValidityCheck] = useState<ValidityCheck | null>(null);

  const processReaction = useCallback((scenario: GenZScenario, reaction: 'love' | 'good' | 'neutral' | 'bad' | 'toxic') => {
    const scores = scenario.reactions[reaction];
    if (!scores) return;

    // Update dimensions
    setDimensions(prev => {
      const newDimensions = { ...prev };
      Object.entries(scores).forEach(([trait, value]) => {
        if (newDimensions[trait as keyof GenZDimensions]) {
          newDimensions[trait as keyof GenZDimensions].score += (value as number);
        }
      });
      return newDimensions;
    });

    // Update traits
    setTraits(prev => {
      const newTraits = { ...prev };
      Object.entries(scores).forEach(([trait, value]) => {
        if (newTraits[trait as keyof GenZTraits] !== undefined) {
          newTraits[trait as keyof GenZTraits] += (value as number);
        }
      });
      return newTraits;
    });

    // Update workplace preferences based on positive reactions
    if (reaction === 'love' || reaction === 'good') {
      setWorkplacePreferences(prev => {
        const newPrefs = { ...prev };
        Object.entries(scores).forEach(([trait, value]) => {
          switch(trait) {
            case 'flexibility':
              newPrefs.remote_hybrid += (value as number);
              newPrefs.flexible_hours += (value as number);
              break;
            case 'innovation':
              newPrefs.tech_forward += (value as number);
              break;
            case 'growth_mindset':
              newPrefs.quick_feedback += (value as number);
              break;
            case 'authenticity':
              newPrefs.casual_culture += (value as number);
              break;
          }
        });
        return newPrefs;
      });
    }

    // Update red flags based on toxic reactions
    if (reaction === 'toxic') {
      setRedFlags(prev => {
        const newFlags = { ...prev };
        Object.entries(scores).forEach(([trait, value]) => {
          switch(trait) {
            case 'work_life_balance':
              newFlags.poor_work_life += Math.abs(value);
              break;
            case 'authenticity':
              newFlags.toxic_culture += Math.abs(value);
              break;
            case 'flexibility':
              newFlags.rigid_structure += Math.abs(value);
              break;
            case 'growth_mindset':
              newFlags.lack_of_growth += Math.abs(value);
              break;
            case 'digital_native':
              newFlags.outdated_tech += Math.abs(value);
              break;
          }
        });
        return newFlags;
      });
    }
  }, []);

  const processValues = useCallback((selectedValues: GenZValue[]) => {
    selectedValues.forEach((value, index) => {
      const weight = 1 - (index * 0.15); // Higher rank = more weight
      
      setDimensions(prev => {
        const newDimensions = { ...prev };
        switch(value.id) {
          case 'v2': // Remote First
            newDimensions.flexibility.score += 15 * weight;
            break;
          case 'v3': // Growth Path
            newDimensions.growth_mindset.score += 15 * weight;
            break;
          case 'v4': // Learning
            newDimensions.growth_mindset.score += 12 * weight;
            break;
          case 'v5': // Work-Life Balance
            newDimensions.work_life_balance.score += 20 * weight;
            break;
          case 'v6': // Impact
            newDimensions.purpose_alignment.score += 15 * weight;
            newDimensions.social_impact.score += 10 * weight;
            break;
          case 'v7': // Innovation
            newDimensions.digital_native.score += 12 * weight;
            break;
          case 'v10': // Diversity
            newDimensions.social_impact.score += 12 * weight;
            break;
          case 'v12': // Transparency
            newDimensions.authenticity.score += 15 * weight;
            break;
        }
        return newDimensions;
      });

      setWorkplacePreferences(prev => {
        const newPrefs = { ...prev };
        switch(value.id) {
          case 'v2': // Remote First
            newPrefs.remote_hybrid += 20;
            break;
          case 'v6': // Impact
            newPrefs.mission_driven += 15;
            break;
          case 'v14': // Tech Forward
            newPrefs.tech_forward += 15;
            break;
        }
        return newPrefs;
      });
    });
  }, []);

  const processCollaboration = useCallback((scores: { [key: string]: number }) => {
    Object.entries(scores).forEach(([trait, value]) => {
      if (trait === 'team_player') {
        setTraits(prev => ({ ...prev, collaboration: prev.collaboration + value * 3 }));
      } else if (trait === 'boundaries') {
        setDimensions(prev => ({
          ...prev,
          work_life_balance: { ...prev.work_life_balance, score: prev.work_life_balance.score + value * 2 }
        }));
      } else if (trait === 'quality_focus') {
        setDimensions(prev => ({
          ...prev,
          growth_mindset: { ...prev.growth_mindset, score: prev.growth_mindset.score + value }
        }));
      }
    });
  }, []);

  const calculateValidityCheck = useCallback((userData: UserData): ValidityCheck => {
    const reactions = userData.responses.map(r => r.reaction);
    const loveCount = reactions.filter(r => r === 'love').length;
    const toxicCount = reactions.filter(r => r === 'toxic').length;
    const fastResponses = userData.responses.filter(r => r.responseTime < 1000).length;
    
    // Check for same pattern (consecutive same reactions)
    let samePatternCount = 0;
    for (let i = 1; i < reactions.length; i++) {
      if (reactions[i] === reactions[i - 1]) {
        samePatternCount++;
      }
    }

    const validity: ValidityCheck = {
      allPositive: loveCount / reactions.length,
      allNegative: toxicCount / reactions.length,
      tooFast: fastResponses / reactions.length,
      samePattern: samePatternCount / reactions.length,
      noSwipes: !userData.bookmarks || userData.bookmarks.length === 0
    };

    setValidityCheck(validity);
    return validity;
  }, []);

  const calculateAuthenticityScore = useCallback((validity: ValidityCheck): number => {
    let score = 100;
    
    if (validity.allPositive > 0.9) score -= 25;
    if (validity.allNegative > 0.9) score -= 25;
    if (validity.tooFast > 0.5) score -= 20;
    if (validity.samePattern > 0.8) score -= 15;
    if (validity.noSwipes) score -= 15;
    
    return Math.max(score, 0);
  }, []);

  const determineWorkplaceProfile = useCallback((): WorkplaceProfile => {
    const flexibilityScore = dimensions.flexibility.score;
    const innovationScore = traits.innovation;
    const collaborationScore = traits.collaboration;
    const impactScore = dimensions.social_impact.score;
    const techScore = dimensions.digital_native.score;

    if (techScore > 15 && innovationScore > 10) {
      return {
        name: 'The Digital Pioneer',
        emoji: '🚀',
        traits: ['Tech-forward', 'Innovative', 'Efficiency-driven'],
        description: 'Thrives in cutting-edge tech environments with modern tools and processes'
      };
    } else if (impactScore > 15 && dimensions.purpose_alignment.score > 20) {
      return {
        name: 'The Purpose-Driven Achiever',
        emoji: '🎯',
        traits: ['Mission-focused', 'Values-aligned', 'Impact-oriented'],
        description: 'Motivated by meaningful work that creates positive change'
      };
    } else if (flexibilityScore > 15 && dimensions.work_life_balance.score > 20) {
      return {
        name: 'The Flexible Creator',
        emoji: '🎨',
        traits: ['Adaptable', 'Creative', 'Balance-focused'],
        description: 'Values autonomy and work-life integration above all else'
      };
    } else if (collaborationScore > 15) {
      return {
        name: 'The Social Connector',
        emoji: '🌟',
        traits: ['People-focused', 'Collaborative', 'Communicative'],
        description: 'Energized by teamwork and building strong relationships'
      };
    } else {
      return {
        name: 'The Innovative Collaborator',
        emoji: '🦄',
        traits: ['Creative', 'Team-focused', 'Adaptable'],
        description: 'Balances innovation with strong teamwork and collaboration'
      };
    }
  }, [dimensions, traits]);

  const generateCompanyMatches = useCallback((): CompanyMatch[] => {
    const matches: CompanyMatch[] = [];
    
    Object.entries(companyProfiles).forEach(([companyKey, company]) => {
      let matchScore = 0;
      const matchReasons: string[] = [];
      
      // Calculate match based on dimensions using company scores
      Object.entries(company.scores).forEach(([factor, companyScore]) => {
        const dimScore = dimensions[factor as keyof GenZDimensions]?.score || 0;
        const contribution = (dimScore / 100) * (companyScore as number) * 10;
        matchScore += contribution;
        
        if (contribution > 15) {
          matchReasons.push(`Strong ${factor.replace('_', ' ')} alignment`);
        }
      });
      
      // Adjust for red flags based on company characteristics
      if (company.characteristics.some(char => char.includes('startup')) && redFlags.rigid_structure > 5) {
        matchScore -= 10;
      }
      if (company.characteristics.some(char => char.includes('flexible')) && redFlags.micromanagement > 5) {
        matchScore -= 15;
      }
      
      matches.push({
        id: companyKey,
        name: company.name,
        score: Math.round(Math.max(0, Math.min(100, matchScore))),
        tags: company.characteristics,
        matchReasons
      });
    });
    
    return matches.sort((a, b) => b.score - a.score);
  }, [dimensions, redFlags]);

  const calculateRetentionRisk = useCallback((): { level: 'low' | 'medium' | 'high'; probability: number; keyFactors: string[] } => {
    let riskScore = 0;
    const keyFactors: string[] = [];
    
    // High work-life balance importance but low flexibility
    if (dimensions.work_life_balance.score > 20 && dimensions.flexibility.score < 10) {
      riskScore += 25;
      keyFactors.push('Work-life balance mismatch');
    }
    
    // High authenticity needs but red flags
    if (dimensions.authenticity.score > 15 && redFlags.toxic_culture > 8) {
      riskScore += 30;
      keyFactors.push('Cultural authenticity concerns');
    }
    
    // Growth mindset but lack of opportunities
    if (dimensions.growth_mindset.score > 15 && redFlags.lack_of_growth > 5) {
      riskScore += 20;
      keyFactors.push('Limited growth opportunities');
    }
    
    // Digital native but outdated tech
    if (dimensions.digital_native.score > 12 && redFlags.outdated_tech > 5) {
      riskScore += 15;
      keyFactors.push('Technology gap');
    }
    
    const probability = Math.min(85, riskScore);
    let level: 'low' | 'medium' | 'high' = 'low';
    
    if (probability > 60) level = 'high';
    else if (probability > 35) level = 'medium';
    
    return { level, probability, keyFactors };
  }, [dimensions, redFlags]);

  const calculateFinalScores = useCallback((userData: UserData): GenZResults => {
    // Normalize dimension scores
    const normalizedDimensions = { ...dimensions };
    Object.keys(normalizedDimensions).forEach(key => {
      const dim = normalizedDimensions[key as keyof GenZDimensions];
      dim.score = Math.max(0, Math.min(100, dim.score));
    });

    // Calculate overall score
    const overallScore = Object.values(normalizedDimensions).reduce((sum, dim) => 
      sum + (dim.score * dim.weight), 0
    );

    // Calculate validity and authenticity
    const validity = calculateValidityCheck(userData);
    const authenticityScore = calculateAuthenticityScore(validity);

    // Generate results
    const workplaceProfile = determineWorkplaceProfile();
    const companyMatches = generateCompanyMatches();
    const retentionRisk = calculateRetentionRisk();

    return {
      overallScore: Math.round(overallScore),
      dimensions: normalizedDimensions,
      traits,
      workStyle: determineWorkStyle(),
      teamVibe: determineTeamVibe(),
      energyPeak: determineEnergyPeak(),
      commStyle: determineCommunicationStyle(),
      companyMatches,
      workplacePreferences,
      redFlags,
      workplaceProfile,
      validityCheck: validity,
      authenticityScore,
      retentionRisk
    };
  }, [dimensions, traits, workplacePreferences, redFlags, calculateValidityCheck, calculateAuthenticityScore, determineWorkplaceProfile, generateCompanyMatches, calculateRetentionRisk]);

  const determineWorkStyle = useCallback((): string => {
    const flexibility = dimensions.flexibility.score;
    const autonomy = traits.autonomy;
    
    if (flexibility > 70 && autonomy > 10) {
      return 'Flexible Focus';
    } else if (flexibility > 50) {
      return 'Hybrid Balance';
    } else {
      return 'Structured Flow';
    }
  }, [dimensions, traits]);

  const determineTeamVibe = useCallback((): string => {
    const collaboration = traits.collaboration;
    
    if (collaboration > 15) {
      return 'Collaborative';
    } else if (collaboration > 5) {
      return 'Balanced';
    } else {
      return 'Independent';
    }
  }, [traits]);

  const determineEnergyPeak = useCallback((): string => {
    const flexibility = dimensions.flexibility.score;
    
    if (flexibility > 70) {
      return 'Varies';
    } else if (flexibility > 40) {
      return 'Afternoon';
    } else {
      return 'Morning';
    }
  }, [dimensions]);

  const determineCommunicationStyle = useCallback((): string => {
    const digitalNative = dimensions.digital_native.score;
    const quickFeedback = workplacePreferences.quick_feedback;
    
    if (digitalNative > 60 && quickFeedback > 10) {
      return 'Async First';
    } else if (quickFeedback > 15) {
      return 'Real-time';
    } else {
      return 'Mixed Mode';
    }
  }, [dimensions, workplacePreferences]);

  const reset = useCallback(() => {
    setDimensions({
      flexibility: { score: 0, weight: 0.15 },
      purpose_alignment: { score: 0, weight: 0.20 },
      growth_mindset: { score: 0, weight: 0.15 },
      digital_native: { score: 0, weight: 0.10 },
      work_life_balance: { score: 0, weight: 0.20 },
      authenticity: { score: 0, weight: 0.10 },
      social_impact: { score: 0, weight: 0.10 }
    });
    setTraits({
      innovation: 0,
      collaboration: 0,
      autonomy: 0,
      transparency: 0,
      diversity_inclusion: 0,
      mental_health_awareness: 0,
      sustainability: 0,
      continuous_learning: 0
    });
    setWorkplacePreferences({
      remote_hybrid: 0,
      flexible_hours: 0,
      casual_culture: 0,
      flat_hierarchy: 0,
      quick_feedback: 0,
      tech_forward: 0,
      mission_driven: 0
    });
    setRedFlags({
      micromanagement: 0,
      rigid_structure: 0,
      poor_work_life: 0,
      lack_of_growth: 0,
      outdated_tech: 0,
      toxic_culture: 0
    });
    setValidityCheck(null);
  }, []);

  return {
    processReaction,
    processValues,
    processCollaboration,
    calculateFinalScores,
    reset,
    dimensions,
    traits,
    workplacePreferences,
    redFlags,
    validityCheck
  };
};