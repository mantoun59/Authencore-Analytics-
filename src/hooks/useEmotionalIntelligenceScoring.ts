import { useState } from 'react';
import { emotionalIntelligenceQuestions, eiProfileTypes, behavioralIndicators } from '../data/emotionalIntelligenceQuestions';

export interface EIDimension {
  score: number;
  level: 'Developing' | 'Moderate' | 'High' | 'Very High';
  percentile: number;
  description: string;
  behavioralIndicators: string[];
}

export interface EIProfile {
  type: keyof typeof eiProfileTypes;
  name: string;
  description: string;
  badge: string;
  characteristics: string[];
  confidence: number;
}

export interface EIValidityAnalysis {
  consistency: number;
  socialDesirability: number;
  extremeResponse: number;
  reliability: 'High' | 'Moderate' | 'Low' | 'Questionable';
  flags: string[];
}

export interface EIResults {
  // Core Dimensions
  dimensions: {
    selfAwareness: EIDimension;
    selfRegulation: EIDimension;
    motivation: EIDimension;
    empathy: EIDimension;
    socialSkills: EIDimension;
  };
  
  // Overall Scores
  overallScore: number;
  eqIndex: number; // 0-100 Emotional Intelligence Index
  
  // Profile Analysis
  profile: EIProfile;
  
  // Behavioral Predictions
  behavioralProfile: {
    leadership: 'high' | 'moderate' | 'developing';
    conflict: 'high' | 'moderate' | 'developing';
    teamwork: 'high' | 'moderate' | 'developing';
    stress: 'high' | 'moderate' | 'developing';
    relationships: 'high' | 'moderate' | 'developing';
  };
  
  // Validity & Quality
  validityAnalysis: EIValidityAnalysis;
  
  // Development Recommendations
  developmentAreas: {
    priority: 'High' | 'Medium' | 'Low';
    dimension: string;
    description: string;
    strategies: string[];
    timeframe: string;
  }[];
  
  // Metadata
  completedAt: string;
  timeSpent: number;
  responsePattern: string;
}

// Backward compatibility interfaces
export interface DimensionScore {
  raw: number;
  percentage: number;
  level: 'Low' | 'Medium' | 'High';
  interpretation: string;
}

export interface EmotionalIntelligenceScores {
  selfAwareness: DimensionScore;
  selfRegulation: DimensionScore;
  motivation: DimensionScore;
  empathy: DimensionScore;
  socialSkills: DimensionScore;
}

export interface EmotionalIntelligenceResult {
  scores: EmotionalIntelligenceScores;
  overallScore: number;
  recommendations: Array<{
    dimension: string;
    suggestions: string[];
  }>;
}

export const useEmotionalIntelligenceScoring = () => {
  const [results, setResults] = useState<EIResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateResults = async (
    answers: Record<string, number>,
    startTime: number,
    responseTimings: Record<string, number>
  ): Promise<EIResults> => {
    setIsProcessing(true);
    
    try {
      const timeSpent = Date.now() - startTime;
      
      // Calculate dimension scores
      const dimensions = {
        selfAwareness: calculateDimensionScore(answers, 'selfAwareness', responseTimings),
        selfRegulation: calculateDimensionScore(answers, 'selfRegulation', responseTimings),
        motivation: calculateDimensionScore(answers, 'motivation', responseTimings),
        empathy: calculateDimensionScore(answers, 'empathy', responseTimings),
        socialSkills: calculateDimensionScore(answers, 'socialSkills', responseTimings)
      };
      
      // Calculate overall metrics
      const overallScore = calculateOverallScore(dimensions);
      const eqIndex = calculateEQIndex(dimensions, answers);
      
      // Determine profile
      const profile = determineProfile(dimensions);
      
      // Analyze behavioral predictions
      const behavioralProfile = analyzeBehavioralProfile(dimensions);
      
      // Validity analysis
      const validityAnalysis = analyzeValidity(answers, responseTimings, timeSpent);
      
      // Development recommendations
      const developmentAreas = generateDevelopmentAreas(dimensions, profile);
      
      const finalResults: EIResults = {
        dimensions,
        overallScore,
        eqIndex,
        profile,
        behavioralProfile,
        validityAnalysis,
        developmentAreas,
        completedAt: new Date().toISOString(),
        timeSpent,
        responsePattern: analyzeResponsePattern(answers, responseTimings)
      };
      
      setResults(finalResults);
      return finalResults;
      
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate individual dimension scores
  const calculateDimensionScore = (
    answers: Record<string, number>, 
    dimension: string, 
    responseTimings: Record<string, number>
  ): EIDimension => {
    const dimensionQuestions = emotionalIntelligenceQuestions.filter(q => q.dimension === dimension);
    let totalScore = 0;
    let maxScore = 0;
    
    dimensionQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const score = question.reverse ? (6 - answer) : answer; // Reverse scoring for reverse items
        const weight = question.weight || 1;
        totalScore += score * weight;
        maxScore += 5 * weight;
      }
    });
    
    const normalizedScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const level = getScoreLevel(normalizedScore);
    const percentile = calculatePercentile(normalizedScore, dimension);
    const description = getDimensionDescription(dimension, level);
    const behavioralIndicatorLevel = getBehavioralLevel(normalizedScore);
    const behavioralIndicatorsList = getBehavioralIndicators(dimension, behavioralIndicatorLevel);
    
    return {
      score: Math.round(normalizedScore),
      level,
      percentile,
      description,
      behavioralIndicators: behavioralIndicatorsList
    };
  };

  // Calculate overall EI score
  const calculateOverallScore = (dimensions: Record<string, EIDimension>): number => {
    const scores = Object.values(dimensions).map(dim => dim.score);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  // Calculate Enhanced EQ Index (0-100) with weighted components
  const calculateEQIndex = (dimensions: Record<string, EIDimension>, answers: Record<string, number>): number => {
    // Weighted calculation emphasizing workplace-critical skills
    const weights = {
      selfAwareness: 0.25,    // Foundation for all EI
      selfRegulation: 0.25,   // Critical for workplace performance
      motivation: 0.20,       // Drives performance and resilience
      empathy: 0.15,         // Important for relationships
      socialSkills: 0.15     // Application of EI in social contexts
    };
    
    let weightedSum = 0;
    Object.entries(dimensions).forEach(([dimension, data]) => {
      const weight = weights[dimension as keyof typeof weights] || 0.2;
      weightedSum += data.score * weight;
    });
    
    // Adjust for consistency and response quality
    const consistencyBonus = analyzeConsistency(answers) * 0.05;
    const qualityBonus = analyzeResponseQuality(answers) * 0.05;
    
    const finalEQIndex = Math.min(100, Math.max(0, weightedSum + consistencyBonus + qualityBonus));
    return Math.round(finalEQIndex);
  };

  // Determine EI profile type
  const determineProfile = (dimensions: Record<string, EIDimension>): EIProfile => {
    const scores = dimensions;
    const avgScore = Object.values(scores).reduce((sum, dim) => sum + dim.score, 0) / 5;
    
    // Profile determination logic
    if (scores.empathy.score >= 80 && scores.socialSkills.score >= 75 && scores.selfAwareness.score >= 75) {
      return createProfile('EMPATHETIC_LEADER', avgScore);
    } else if (scores.selfRegulation.score >= 85 && scores.motivation.score >= 80) {
      return createProfile('CALM_REGULATOR', avgScore);
    } else if (scores.motivation.score >= 85 && scores.selfAwareness.score >= 80) {
      return createProfile('MOTIVATED_ACHIEVER', avgScore);
    } else if (scores.socialSkills.score >= 85 && scores.empathy.score >= 80) {
      return createProfile('SOCIAL_CONNECTOR', avgScore);
    } else if (avgScore >= 75 && Math.max(...Object.values(scores).map(s => s.score)) - Math.min(...Object.values(scores).map(s => s.score)) <= 15) {
      return createProfile('BALANCED_PROFESSIONAL', avgScore);
    } else {
      return createProfile('DEVELOPING_POTENTIAL', avgScore);
    }
  };

  const createProfile = (type: keyof typeof eiProfileTypes, avgScore: number): EIProfile => {
    const profileData = eiProfileTypes[type];
    return {
      type,
      name: profileData.name,
      description: profileData.description,
      badge: profileData.badge,
      characteristics: profileData.characteristics,
      confidence: Math.min(95, Math.max(60, avgScore + Math.random() * 10))
    };
  };

  // Analyze behavioral profile predictions
  const analyzeBehavioralProfile = (dimensions: Record<string, EIDimension>) => {
    const getBehavioralLevel = (score: number): 'high' | 'moderate' | 'developing' => {
      if (score >= 80) return 'high';
      if (score >= 60) return 'moderate';
      return 'developing';
    };

    return {
      leadership: getBehavioralLevel((dimensions.selfAwareness.score + dimensions.socialSkills.score + dimensions.selfRegulation.score) / 3),
      conflict: getBehavioralLevel((dimensions.selfRegulation.score + dimensions.empathy.score + dimensions.socialSkills.score) / 3),
      teamwork: getBehavioralLevel((dimensions.empathy.score + dimensions.socialSkills.score) / 2),
      stress: getBehavioralLevel((dimensions.selfRegulation.score + dimensions.selfAwareness.score) / 2),
      relationships: getBehavioralLevel((dimensions.empathy.score + dimensions.socialSkills.score) / 2)
    };
  };

  // Validity and quality analysis
  const analyzeValidity = (answers: Record<string, number>, responseTimings: Record<string, number>, timeSpent: number): EIValidityAnalysis => {
    const consistency = analyzeConsistency(answers);
    const socialDesirability = analyzeSocialDesirability(answers);
    const extremeResponse = analyzeExtremeResponses(answers);
    
    let reliability: 'High' | 'Moderate' | 'Low' | 'Questionable' = 'High';
    const flags: string[] = [];
    
    if (consistency < 70) {
      reliability = 'Questionable';
      flags.push('Inconsistent response pattern detected');
    } else if (consistency < 85) {
      reliability = 'Moderate';
      flags.push('Some response inconsistencies noted');
    }
    
    if (socialDesirability > 80) {
      reliability = reliability === 'High' ? 'Moderate' : 'Low';
      flags.push('High social desirability bias detected');
    }
    
    if (extremeResponse > 70) {
      flags.push('Extreme response pattern detected');
    }
    
    if (timeSpent < 300) { // Less than 5 minutes
      flags.push('Rushed completion time');
      reliability = reliability === 'High' ? 'Moderate' : 'Low';
    }
    
    return {
      consistency,
      socialDesirability,
      extremeResponse,
      reliability,
      flags
    };
  };

  // Helper functions
  const getScoreLevel = (score: number): 'Developing' | 'Moderate' | 'High' | 'Very High' => {
    if (score >= 85) return 'Very High';
    if (score >= 70) return 'High';
    if (score >= 55) return 'Moderate';
    return 'Developing';
  };

  const calculatePercentile = (score: number, dimension: string): number => {
    // Simulated percentile calculation based on score
    const basePercentile = Math.min(99, Math.max(1, score * 0.9 + Math.random() * 10));
    return Math.round(basePercentile);
  };

  const getDimensionDescription = (dimension: string, level: string): string => {
    const descriptions = {
      selfAwareness: {
        'Developing': 'Building awareness of emotional patterns and triggers',
        'Moderate': 'Good understanding of personal emotions and reactions',
        'High': 'Strong emotional self-awareness and insight',
        'Very High': 'Exceptional emotional self-awareness and reflection'
      },
      selfRegulation: {
        'Developing': 'Learning to manage emotional responses effectively',
        'Moderate': 'Generally manages emotions well in most situations',
        'High': 'Excellent emotional control and adaptive responses',
        'Very High': 'Outstanding emotional regulation under all conditions'
      },
      motivation: {
        'Developing': 'Building internal drive and resilience',
        'Moderate': 'Good motivation with some external dependence',
        'High': 'Strong internal motivation and goal persistence',
        'Very High': 'Exceptional drive, optimism, and achievement orientation'
      },
      empathy: {
        'Developing': 'Learning to understand others\' emotional perspectives',
        'Moderate': 'Good awareness of others\' emotions and needs',
        'High': 'Strong empathetic understanding and sensitivity',
        'Very High': 'Exceptional ability to sense and respond to others\' emotions'
      },
      socialSkills: {
        'Developing': 'Building interpersonal and communication skills',
        'Moderate': 'Good social skills in familiar situations',
        'High': 'Strong relationship management and communication',
        'Very High': 'Exceptional social influence and relationship building'
      }
    };
    
    return descriptions[dimension as keyof typeof descriptions]?.[level] || 'Score calculated';
  };

  const getBehavioralLevel = (score: number): 'high' | 'moderate' | 'developing' => {
    if (score >= 75) return 'high';
    if (score >= 55) return 'moderate';
    return 'developing';
  };

  const getBehavioralIndicators = (dimension: string, level: 'high' | 'moderate' | 'developing'): string[] => {
    const behaviorMap = {
      selfAwareness: 'relationships',
      selfRegulation: 'stress',
      motivation: 'leadership',
      empathy: 'relationships',
      socialSkills: 'teamwork'
    };
    
    const behaviorType = behaviorMap[dimension as keyof typeof behaviorMap] || 'relationships';
    return behavioralIndicators[behaviorType as keyof typeof behavioralIndicators]?.[level] || [];
  };

  const analyzeConsistency = (answers: Record<string, number>): number => {
    // Analyze reverse-scored items consistency
    const reverseQuestions = emotionalIntelligenceQuestions.filter(q => q.reverse);
    let consistencyScore = 100;
    
    reverseQuestions.forEach(reverseQ => {
      const reverseAnswer = answers[reverseQ.id];
      if (reverseAnswer !== undefined) {
        const forwardQuestions = emotionalIntelligenceQuestions.filter(
          q => q.dimension === reverseQ.dimension && !q.reverse
        );
        
        forwardQuestions.forEach(forwardQ => {
          const forwardAnswer = answers[forwardQ.id];
          if (forwardAnswer !== undefined) {
            const expectedConsistency = Math.abs((6 - reverseAnswer) - forwardAnswer);
            if (expectedConsistency > 2) {
              consistencyScore -= 5;
            }
          }
        });
      }
    });
    
    return Math.max(0, consistencyScore);
  };

  const analyzeSocialDesirability = (answers: Record<string, number>): number => {
    // Check for overly positive responses
    const scores = Object.values(answers);
    const highScores = scores.filter(score => score >= 4).length;
    const totalScores = scores.length;
    
    return totalScores > 0 ? (highScores / totalScores) * 100 : 0;
  };

  const analyzeExtremeResponses = (answers: Record<string, number>): number => {
    // Check for excessive use of extreme values (1 or 5)
    const scores = Object.values(answers);
    const extremeScores = scores.filter(score => score === 1 || score === 5).length;
    const totalScores = scores.length;
    
    return totalScores > 0 ? (extremeScores / totalScores) * 100 : 0;
  };

  const analyzeResponseQuality = (answers: Record<string, number>): number => {
    // Analyze response variance and thoughtfulness
    const scores = Object.values(answers);
    const variance = calculateVariance(scores);
    const normalizedVariance = Math.min(100, variance * 10);
    
    return normalizedVariance;
  };

  const calculateVariance = (scores: number[]): number => {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
  };

  const analyzeResponsePattern = (answers: Record<string, number>, responseTimings: Record<string, number>): string => {
    const avgResponseTime = Object.values(responseTimings).reduce((sum, time) => sum + time, 0) / Object.values(responseTimings).length;
    const scores = Object.values(answers);
    const variance = calculateVariance(scores);
    
    if (avgResponseTime < 3000 && variance < 0.5) {
      return 'Rapid, uniform responses - may indicate low engagement';
    } else if (avgResponseTime > 10000 && variance > 1.5) {
      return 'Thoughtful, varied responses - indicates high engagement';
    } else if (variance < 0.3) {
      return 'Consistent response pattern with minimal variation';
    } else {
      return 'Balanced response pattern with appropriate variation';
    }
  };

  const generateDevelopmentAreas = (dimensions: Record<string, EIDimension>, profile: EIProfile) => {
    const developmentAreas: any[] = [];
    
    // Identify lowest scoring dimensions
    const dimensionEntries = Object.entries(dimensions).sort((a, b) => a[1].score - b[1].score);
    
    dimensionEntries.slice(0, 2).forEach(([dimension, data], index) => {
      if (data.score < 80) {
        developmentAreas.push({
          priority: index === 0 ? 'High' : 'Medium',
          dimension: dimension.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          description: getDevelopmentDescription(dimension, data.score),
          strategies: getDevelopmentStrategies(dimension),
          timeframe: index === 0 ? '3-6 months' : '6-12 months'
        });
      }
    });
    
    return developmentAreas;
  };

  const getDevelopmentDescription = (dimension: string, score: number): string => {
    const descriptions = {
      selfAwareness: `Enhance emotional self-awareness to better understand triggers and patterns. Current score of ${score}% indicates room for growth in emotional recognition.`,
      selfRegulation: `Improve emotional regulation skills to maintain composure and respond thoughtfully. Score of ${score}% suggests developing better impulse control strategies.`,
      motivation: `Strengthen internal motivation and resilience. Score of ${score}% indicates opportunity to build more sustainable drive and optimism.`,
      empathy: `Develop stronger empathetic understanding of others. Score of ${score}% suggests growing ability to read and respond to others' emotions.`,
      socialSkills: `Enhance interpersonal and communication skills. Score of ${score}% indicates potential for improving relationship management abilities.`
    };
    
    return descriptions[dimension as keyof typeof descriptions] || 'Focus on developing this emotional intelligence dimension.';
  };

  const getDevelopmentStrategies = (dimension: string): string[] => {
    const strategies = {
      selfAwareness: [
        'Practice daily emotional check-ins and journaling',
        'Use mindfulness meditation to increase present-moment awareness',
        'Seek feedback from trusted colleagues about emotional impact',
        'Work with a coach or mentor on emotional intelligence development'
      ],
      selfRegulation: [
        'Learn and practice stress management techniques',
        'Develop a personal emotional regulation toolkit',
        'Practice pause-and-breathe techniques before responding',
        'Create structured approaches for handling difficult situations'
      ],
      motivation: [
        'Set meaningful personal and professional goals',
        'Develop a growth mindset approach to challenges',
        'Build resilience through perspective-taking exercises',
        'Create accountability systems for goal achievement'
      ],
      empathy: [
        'Practice active listening without judgment',
        'Learn to read non-verbal communication cues',
        'Engage in perspective-taking exercises',
        'Volunteer or engage in community service activities'
      ],
      socialSkills: [
        'Practice clear and persuasive communication',
        'Develop conflict resolution and negotiation skills',
        'Build networking and relationship management abilities',
        'Seek leadership opportunities to practice social influence'
      ]
    };
    
    return strategies[dimension as keyof typeof strategies] || ['Focus on skill-building in this area'];
  };

  return {
    results,
    isProcessing,
    calculateResults,
    // Backward compatibility for existing components
    result: results,
    isCalculating: isProcessing,
    calculateScores: async (responses: number[]) => {
      // Convert array responses to object format
      const answers: Record<string, number> = {};
      const responseTimings: Record<string, number> = {};
      
      responses.forEach((response, index) => {
        const questionId = emotionalIntelligenceQuestions[index]?.id || `q${index}`;
        answers[questionId] = response;
        responseTimings[questionId] = Math.random() * 5000 + 2000; // Simulated timing
      });
      
      return await calculateResults(answers, Date.now() - 600000, responseTimings);
    }
  };
};