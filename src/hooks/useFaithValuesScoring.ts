import { useState, useCallback } from 'react';
import { faithValuesData } from '@/data/faithValuesQuestions';

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
    rankedValues: string[],
    scenarioResponses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>
  ): FaithValuesResult => {
    setIsCalculating(true);
    
    const valueScores: FaithValuesScores = {};
    
    // Initialize scores
    faithValuesData.universal_values.forEach(value => {
      valueScores[value.id] = 0;
    });
    
    // Process ranked values (higher weight for top-ranked)
    rankedValues.forEach((valueId, index) => {
      const weight = 1 - (index * 0.1); // 1st = 100%, 8th = 30%
      valueScores[valueId] += 30 * weight;
    });
    
    // Process scenario responses
    scenarioResponses.forEach(response => {
      const scenario = faithValuesData.scenarios.find(s => s.id === response.scenarioId);
      if (scenario && scenario.options[response.selectedOption]) {
        const option = scenario.options[response.selectedOption];
        Object.entries(option.values).forEach(([valueId, score]) => {
          if (valueScores[valueId] !== undefined) {
            valueScores[valueId] += score * 2;
          }
        });
      }
    });
    
    // Normalize scores to 0-100 range
    const maxScore = Math.max(...Object.values(valueScores));
    if (maxScore > 0) {
      Object.keys(valueScores).forEach(valueId => {
        valueScores[valueId] = Math.max(0, (valueScores[valueId] / maxScore) * 100);
      });
    }
    
    // Calculate validity scores and metrics
    const validityMetrics = calculateValidityMetrics(scenarioResponses, rankedValues);
    const distortionScore = calculateDistortionScore(scenarioResponses);
    const defensivenessScore = calculateDefensivenessScore(scenarioResponses, rankedValues);
    
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
    responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>,
    rankedValues: string[]
  ) => {
    // Response consistency check
    const responseConsistency = calculateResponseConsistency(responses, rankedValues);
    
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
    responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>,
    rankedValues: string[]
  ): number => {
    let consistencyScore = 100;
    
    // Check if scenario responses align with ranked values
    responses.forEach(response => {
      const scenario = faithValuesData.scenarios.find(s => s.id === response.scenarioId);
      if (scenario && scenario.options[response.selectedOption]) {
        const option = scenario.options[response.selectedOption];
        
        // Check alignment with top 3 ranked values
        const topValues = rankedValues.slice(0, 3);
        let hasAlignment = false;
        
        topValues.forEach(valueId => {
          if (option.values[valueId] && option.values[valueId] >= 3) {
            hasAlignment = true;
          }
        });
        
        if (!hasAlignment) {
          consistencyScore -= 5;
        }
      }
    });
    
    return Math.max(0, consistencyScore);
  };

  const calculateSocialDesirabilityBias = (responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>): number => {
    let biasScore = 0;
    
    const highEthicalChoices = responses.filter(r => {
      const scenario = faithValuesData.scenarios.find(s => s.id === r.scenarioId);
      if (scenario && scenario.options[r.selectedOption]) {
        const option = scenario.options[r.selectedOption];
        return (option.values['integrity'] && option.values['integrity'] >= 4) || 
               (option.values['justice'] && option.values['justice'] >= 4) ||
               (option.values['service'] && option.values['service'] >= 4);
      }
      return false;
    }).length;
    
    const ethicalRatio = highEthicalChoices / responses.length;
    if (ethicalRatio > 0.85) {
      biasScore = 80;
    } else if (ethicalRatio > 0.75) {
      biasScore = 60;
    } else if (ethicalRatio > 0.65) {
      biasScore = 40;
    }
    
    return biasScore;
  };

  const calculateFakeGoodPattern = (responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>): number => {
    let fakeGoodScore = 0;
    
    // Check for extremely consistent "perfect" responses
    const perfectResponses = responses.filter(r => {
      const scenario = faithValuesData.scenarios.find(s => s.id === r.scenarioId);
      if (scenario && scenario.options[r.selectedOption]) {
        const option = scenario.options[r.selectedOption];
        const totalScore = Object.values(option.values).reduce((sum, score) => sum + score, 0);
        return totalScore >= 15; // Very high total score indicates "perfect" answer
      }
      return false;
    }).length;
    
    const perfectRatio = perfectResponses / responses.length;
    if (perfectRatio > 0.7) {
      fakeGoodScore = 85;
    } else if (perfectRatio > 0.5) {
      fakeGoodScore = 60;
    } else if (perfectRatio > 0.35) {
      fakeGoodScore = 35;
    }
    
    return fakeGoodScore;
  };

  const checkResponsePattern = (responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>): boolean => {
    // Check for same option selected too frequently
    const optionCounts = [0, 0, 0, 0];
    responses.forEach(r => {
      if (r.selectedOption < 4) {
        optionCounts[r.selectedOption]++;
      }
    });
    
    const maxOptionCount = Math.max(...optionCounts);
    if (maxOptionCount > responses.length * 0.75) {
      return true;
    }
    
    // Check for alternating pattern
    let alternatingPattern = 0;
    for (let i = 1; i < responses.length; i++) {
      if (Math.abs(responses[i].selectedOption - responses[i-1].selectedOption) === 1) {
        alternatingPattern++;
      }
    }
    
    return alternatingPattern > responses.length * 0.8;
  };

  const calculateDistortionScore = (responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>): number => {
    let distortionScore = 0;
    
    // Check for rapid responses (less than 4 seconds)
    const rapidResponses = responses.filter(r => r.responseTime < 4000).length;
    if (rapidResponses > responses.length * 0.6) {
      distortionScore += 25;
    } else if (rapidResponses > responses.length * 0.4) {
      distortionScore += 15;
    }
    
    // Check for extremely slow responses (over 60 seconds) - potential overthinking
    const slowResponses = responses.filter(r => r.responseTime > 60000).length;
    if (slowResponses > responses.length * 0.3) {
      distortionScore += 10;
    }
    
    // Check for response time variance
    const responseTimes = responses.map(r => r.responseTime);
    const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
    
    if (variance < 1000000) { // Very low variance indicates mechanical responding
      distortionScore += 15;
    }
    
    return Math.min(distortionScore, 100);
  };

  const calculateDefensivenessScore = (
    responses: Array<{ scenarioId: string; selectedOption: number; responseTime: number }>,
    rankedValues: string[]
  ): number => {
    let defensivenessScore = 0;
    
    // Check for avoidance of challenging scenarios
    const challengingScenarios = responses.filter(r => {
      const scenario = faithValuesData.scenarios.find(s => s.id === r.scenarioId);
      return scenario && scenario.category.includes('conflict') || scenario.category.includes('ethical');
    });
    
    const neutralChoices = challengingScenarios.filter(r => {
      const scenario = faithValuesData.scenarios.find(s => s.id === r.scenarioId);
      if (scenario && scenario.options[r.selectedOption]) {
        const option = scenario.options[r.selectedOption];
        const totalScore = Object.values(option.values).reduce((sum, score) => sum + score, 0);
        return totalScore < 8; // Low engagement with the scenario
      }
      return false;
    }).length;
    
    if (challengingScenarios.length > 0) {
      const neutralRatio = neutralChoices / challengingScenarios.length;
      if (neutralRatio > 0.7) {
        defensivenessScore = 75;
      } else if (neutralRatio > 0.5) {
        defensivenessScore = 50;
      } else if (neutralRatio > 0.3) {
        defensivenessScore = 25;
      }
    }
    
    // Check for inconsistency between high-ranked values and low scenario engagement
    const topValue = rankedValues[0];
    const lowEngagementResponses = responses.filter(r => {
      const scenario = faithValuesData.scenarios.find(s => s.id === r.scenarioId);
      if (scenario && scenario.options[r.selectedOption]) {
        const option = scenario.options[r.selectedOption];
        return option.values[topValue] && option.values[topValue] < 2;
      }
      return false;
    }).length;
    
    if (lowEngagementResponses > responses.length * 0.4) {
      defensivenessScore += 20;
    }
    
    return Math.min(defensivenessScore, 100);
  };

  const calculateCultureMatches = (valueScores: FaithValuesScores): CultureMatch[] => {
    const matches: CultureMatch[] = [];
    
    faithValuesData.culture_types.forEach(culture => {
      let matchScore = 0;
      let matchCount = 0;
      
      culture.key_values.forEach(valueId => {
        if (valueScores[valueId] !== undefined) {
          matchScore += valueScores[valueId];
          matchCount++;
        }
      });
      
      const finalScore = matchCount > 0 ? matchScore / matchCount : 0;
      
      matches.push({
        culture: {
          id: culture.id,
          name: culture.name,
          description: culture.description,
          characteristics: culture.characteristics,
          examples: culture.examples
        },
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
    
    const lowestValue = faithValuesData.universal_values.find(v => v.id === lowestValueId);
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
        const valueDef = faithValuesData.universal_values.find(v => v.id === valueId);
        return {
          id: valueId,
          name: valueDef?.name || valueId,
          description: valueDef?.description || '',
          icon: valueDef?.icon || '⭐',
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