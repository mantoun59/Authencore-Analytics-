import { useState, useCallback } from 'react';
import { complete90FaithValuesQuestions } from '@/data/complete90FaithValuesQuestions';

export interface FaithValuesScores {
  [key: string]: number;
}

export interface CultureMatch {
  culture: {
    id: string;
    name: string;
    description: string;
    characteristics: string[];
    examples: string[];
  };
  score: number;
  alignment: string;
}

export interface FaithValuesResult {
  valueScores: FaithValuesScores;
  topValues: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    score: number;
  }>;
  cultureMatches: CultureMatch[];
  insights: {
    workStyle: string;
    idealEnvironment: string;
    challenges: string;
    growthAreas: string;
  };
  distortionScore: number;
  defensivenessScore: number;
  validityMetrics: {
    responseConsistency: number;
    socialDesirabilityBias: number;
    fakeGoodPattern: number;
    responsePatternFlag: boolean;
  };
  validity: string;
}

export const useFaithValuesScoring = () => {
  const [result, setResult] = useState<FaithValuesResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateScores = useCallback((
    responses: number[],
    questions: any[]
  ): FaithValuesResult => {
    setIsCalculating(true);
    
    const valueScores: FaithValuesScores = {};
    
    // Define dimensions from the complete questions
    const dimensions = [
      'spiritual_purpose', 'transcendence', 'spiritual_practices', 'work_meaning', 
      'moral_guidance', 'spiritual_integrity', 'divine_relationship', 'spiritual_growth',
      'community_connection', 'spiritual_coping', 'scriptural_guidance', 'worship_engagement',
      'spiritual_discernment', 'eternal_perspective', 'spiritual_transformation',
      'achievement', 'benevolence', 'universalism', 'self_direction', 'security',
      'power', 'tradition', 'conformity', 'stimulation', 'hedonism'
    ];
    
    // Initialize scores
    dimensions.forEach(dimension => {
      valueScores[dimension] = 0;
    });
    
    // Process responses based on question types
    responses.forEach((response, index) => {
      if (index < questions.length && response > 0) {
        const question = questions[index];
        const dimension = dimensions[index % dimensions.length];
        
        let score = 0;
        if (question.type === 'likert') {
          // Convert Likert scale to 0-100
          score = ((response - 1) / (question.scale.max - 1)) * 100;
        } else if (question.type === 'scenario') {
          // Scenario responses already scored
          score = response * 20; // Scale to 0-100
        } else if (question.type === 'ranking') {
          // Ranking responses (higher rank = higher score)
          score = ((10 - response) / 9) * 100;
        }
        
        valueScores[dimension] = (valueScores[dimension] || 0) + score;
      }
    });
    
    // Normalize scores
    Object.keys(valueScores).forEach(dimension => {
      const questionCount = Math.max(1, Math.floor(responses.length / dimensions.length));
      valueScores[dimension] = Math.min(100, Math.max(0, valueScores[dimension] / questionCount));
    });
    
    // Calculate validity scores and metrics
    const validityMetrics = calculateValidityMetrics(responses, questions);
    const distortionScore = calculateDistortionScore(responses);
    const defensivenessScore = calculateDefensivenessScore(responses, questions);
    
    // Calculate culture matches
    const cultureMatches = calculateCultureMatches(valueScores);
    
    // Generate insights
    const insights = generateInsights(valueScores, cultureMatches);
    
    // Get top values
    const topValues = getTopValues(valueScores);
    
    const result: FaithValuesResult = {
      valueScores,
      topValues,
      cultureMatches,
      insights,
      distortionScore,
      defensivenessScore,
      validityMetrics,
      validity: getValidityStatus(distortionScore, defensivenessScore, validityMetrics)
    };
    
    setResult(result);
    setIsCalculating(false);
    
    return result;
  }, []);

  const calculateValidityMetrics = (
    responses: number[],
    questions: any[]
  ) => {
    // Response consistency check
    const responseConsistency = calculateResponseConsistency(responses);
    
    // Social desirability bias detection
    const socialDesirabilityBias = calculateSocialDesirabilityBias(responses);
    
    // Fake good pattern detection
    const fakeGoodPattern = calculateFakeGoodPattern(responses);
    
    // Response pattern flag
    const responsePatternFlag = checkResponsePattern(responses);
    
    return {
      responseConsistency,
      socialDesirabilityBias,
      fakeGoodPattern,
      responsePatternFlag
    };
  };

  const calculateResponseConsistency = (
    responses: number[]
  ): number => {
    let consistencyScore = 100;
    
    // Check for response variance
    const validResponses = responses.filter(r => r > 0);
    if (validResponses.length < 2) return 50;
    
    const mean = validResponses.reduce((sum, r) => sum + r, 0) / validResponses.length;
    const variance = validResponses.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / validResponses.length;
    
    // Very low variance indicates potential response pattern issues
    if (variance < 0.5) {
      consistencyScore -= 30;
    } else if (variance < 1) {
      consistencyScore -= 15;
    }
    
    return Math.max(0, consistencyScore);
  };

  const calculateSocialDesirabilityBias = (responses: number[]): number => {
    let biasScore = 0;
    const validResponses = responses.filter(r => r > 0);
    
    if (validResponses.length === 0) return 0;
    
    // Check for too many high scores (social desirability)
    const highScores = validResponses.filter(r => r >= 6).length;
    const highRatio = highScores / validResponses.length;
    
    if (highRatio > 0.8) {
      biasScore = 75;
    } else if (highRatio > 0.7) {
      biasScore = 50;
    } else if (highRatio > 0.6) {
      biasScore = 25;
    }
    
    return biasScore;
  };

  const calculateFakeGoodPattern = (responses: number[]): number => {
    let fakeGoodScore = 0;
    const validResponses = responses.filter(r => r > 0);
    
    if (validResponses.length === 0) return 0;
    
    // Check for maximum score responses
    const maxScores = validResponses.filter(r => r === 7).length;
    const maxRatio = maxScores / validResponses.length;
    
    if (maxRatio > 0.6) {
      fakeGoodScore = 80;
    } else if (maxRatio > 0.4) {
      fakeGoodScore = 50;
    } else if (maxRatio > 0.3) {
      fakeGoodScore = 25;
    }
    
    return fakeGoodScore;
  };

  const checkResponsePattern = (responses: number[]): boolean => {
    const validResponses = responses.filter(r => r > 0);
    if (validResponses.length < 5) return false;
    
    // Check for same response repeated too often
    const responseCounts: Record<number, number> = {};
    validResponses.forEach(r => {
      responseCounts[r] = (responseCounts[r] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(responseCounts));
    if (maxCount > validResponses.length * 0.7) {
      return true;
    }
    
    // Check for alternating pattern
    let alternatingPattern = 0;
    for (let i = 1; i < validResponses.length; i++) {
      if (Math.abs(validResponses[i] - validResponses[i-1]) === 1) {
        alternatingPattern++;
      }
    }
    
    return alternatingPattern > validResponses.length * 0.8;
  };

  const calculateDistortionScore = (responses: number[]): number => {
    let distortionScore = 0;
    const validResponses = responses.filter(r => r > 0);
    
    if (validResponses.length === 0) return 0;
    
    // Check for lack of variability
    const uniqueResponses = new Set(validResponses);
    if (uniqueResponses.size < 3 && validResponses.length > 10) {
      distortionScore += 30;
    }
    
    // Check for extreme response patterns
    const mean = validResponses.reduce((sum, r) => sum + r, 0) / validResponses.length;
    const standardDev = Math.sqrt(
      validResponses.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / validResponses.length
    );
    
    if (standardDev < 0.5) {
      distortionScore += 25;
    }
    
    return Math.min(distortionScore, 100);
  };

  const calculateDefensivenessScore = (
    responses: number[],
    questions: any[]
  ): number => {
    let defensivenessScore = 0;
    const validResponses = responses.filter(r => r > 0);
    
    if (validResponses.length === 0) return 0;
    
    // Check for avoidance of extreme responses
    const middleResponses = validResponses.filter(r => r >= 3 && r <= 5).length;
    const middleRatio = middleResponses / validResponses.length;
    
    if (middleRatio > 0.8) {
      defensivenessScore = 60;
    } else if (middleRatio > 0.7) {
      defensivenessScore = 40;
    } else if (middleRatio > 0.6) {
      defensivenessScore = 20;
    }
    
    return Math.min(defensivenessScore, 100);
  };

  const calculateCultureMatches = (valueScores: FaithValuesScores): CultureMatch[] => {
    const matches: CultureMatch[] = [];
    
    // Mock culture types for now
    const cultureTypes = [
      { id: 'mission_driven', name: 'Mission-Driven Culture', description: 'Purpose and values-focused organizations', characteristics: ['Values-based decisions', 'Social impact focus'], examples: ['Nonprofits', 'B-Corps'] },
      { id: 'traditional', name: 'Traditional Culture', description: 'Established values and practices', characteristics: ['Respect for tradition', 'Clear hierarchy'], examples: ['Religious organizations', 'Family businesses'] },
      { id: 'innovative', name: 'Innovative Culture', description: 'Progressive and adaptive organizations', characteristics: ['Continuous improvement', 'Embracing change'], examples: ['Tech companies', 'Startups'] }
    ];
    
    cultureTypes.forEach(culture => {
      let matchScore = 0;
      let matchCount = 0;
      
      // Calculate match based on available dimensions
      const cultureDimensions = ['spiritual_purpose', 'moral_guidance', 'work_meaning'];
      cultureDimensions.forEach(dimension => {
        if (valueScores[dimension] !== undefined) {
          matchScore += valueScores[dimension];
          matchCount++;
        }
      });
      
      const finalScore = matchCount > 0 ? matchScore / matchCount : 0;
      
      matches.push({
        culture,
        score: finalScore,
        alignment: getAlignmentLevel(finalScore)
      });
    });
    
    return matches.sort((a, b) => b.score - a.score);
  };

  const getAlignmentLevel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Moderate';
    if (score >= 35) return 'Fair';
    return 'Low';
  };

  const generateInsights = (valueScores: FaithValuesScores, cultureMatches: CultureMatch[]) => {
    const topValueIds = Object.entries(valueScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
    
    const topCulture = cultureMatches[0];
    
    let workStyle = "You bring a unique combination of values that helps you adapt to various work environments while staying true to your principles.";
    
    if (topValueIds.includes('excellence') && topValueIds.includes('growth')) {
      workStyle = "You thrive in high-performance environments where continuous improvement and learning are valued. You likely prefer clear goals, feedback, and opportunities to develop expertise.";
    } else if (topValueIds.includes('compassion') && topValueIds.includes('service')) {
      workStyle = "You excel in collaborative, mission-driven environments where you can make a positive impact. You value supportive relationships and meaningful work over pure achievement.";
    } else if (topValueIds.includes('balance') && topValueIds.includes('integrity')) {
      workStyle = "You work best in environments that respect boundaries and operate with transparency. You value sustainable practices and ethical decision-making over short-term gains.";
    }
    
    const idealEnvironment = `Based on your values profile, you would thrive in ${topCulture.culture.description.toLowerCase()}. Look for organizations that ${topCulture.culture.characteristics[0].toLowerCase()} and ${topCulture.culture.characteristics[1].toLowerCase()}.`;
    
    const lowestValueId = Object.entries(valueScores)
      .sort((a, b) => a[1] - b[1])[0][0];
    
    const lowestValue = { name: lowestValueId };
    const challenges = `You may find it challenging to work in environments that heavily emphasize ${lowestValue?.name.toLowerCase()} at the expense of your core values. Be aware of situations where you might need to advocate for what matters most to you.`;
    
    const growthAreas = "Consider developing strategies to communicate your values effectively in professional settings. This will help you find alignment with employers and build authentic professional relationships.";
    
    return {
      workStyle,
      idealEnvironment,
      challenges,
      growthAreas
    };
  };

  const getTopValues = (valueScores: FaithValuesScores) => {
    return Object.entries(valueScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([valueId, score]) => {
        return {
          id: valueId,
          name: valueId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Your ${valueId.replace(/_/g, ' ')} orientation and practices`,
          icon: '⭐',
          score
        };
      });
  };

  const getValidityStatus = (
    distortionScore: number, 
    defensivenessScore: number, 
    validityMetrics: any
  ): string => {
    const overallScore = (distortionScore + defensivenessScore + validityMetrics.socialDesirabilityBias + validityMetrics.fakeGoodPattern) / 4;
    
    if (overallScore < 15 && validityMetrics.responseConsistency > 80 && !validityMetrics.responsePatternFlag) {
      return 'Excellent';
    }
    if (overallScore < 25 && validityMetrics.responseConsistency > 70) {
      return 'High';
    }
    if (overallScore < 40 && validityMetrics.responseConsistency > 60) {
      return 'Moderate';
    }
    if (overallScore < 60) {
      return 'Questionable';
    }
    return 'Poor';
  };

  const reset = useCallback(() => {
    setResult(null);
    setIsCalculating(false);
  }, []);

  return {
    result,
    isCalculating,
    calculateScores,
    reset
  };
};