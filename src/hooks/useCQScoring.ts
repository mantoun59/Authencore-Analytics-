import { useState, useCallback } from 'react';

export interface CQDimension {
  score: number;
  components: {
    [key: string]: number;
  };
}

export interface CQScores {
  drive: CQDimension;
  knowledge: CQDimension;
  strategy: CQDimension;
  action: CQDimension;
}

export interface CulturalProfile {
  interactions: number;
  totalScore: number;
  averageAppropriateness: number;
  strengths: Array<{
    scenarioId: string;
    location: string;
    type: string;
    appropriateness: number;
    confidence: number;
    timestamp: number;
  }>;
  challenges: Array<{
    scenarioId: string;
    location: string;
    type: string;
    appropriateness: number;
    confidence: number;
    timestamp: number;
  }>;
}

export interface AdaptationPattern {
  scenarioType: string;
  culturalContext: string;
  decisionStyle: 'cautious' | 'assertive' | 'adaptive' | 'contextual';
  adaptationLevel: number;
}

export interface ScenarioHistory {
  scenarioId: string;
  location: string;
  type: string;
  appropriateness: number;
  confidence: number;
  timestamp: number;
}

export interface CQAnalysis {
  effortScore: number;
  culturalAccuracy: number;
  strategicThinking: number;
  executionQuality: number;
}

export const useCQScoring = () => {
  const [dimensions, setDimensions] = useState<CQScores>({
    drive: {
      score: 0,
      components: {
        intrinsic: 0,
        extrinsic: 0,
        selfEfficacy: 0
      }
    },
    knowledge: {
      score: 0,
      components: {
        cultural: 0,
        business: 0,
        interpersonal: 0
      }
    },
    strategy: {
      score: 0,
      components: {
        planning: 0,
        checking: 0,
        adjusting: 0
      }
    },
    action: {
      score: 0,
      components: {
        verbal: 0,
        nonverbal: 0,
        behavioral: 0
      }
    }
  });

  const [culturalProfiles, setCulturalProfiles] = useState<Record<string, CulturalProfile>>({});
  const [scenarioHistory, setScenarioHistory] = useState<ScenarioHistory[]>([]);
  const [confidenceLevels, setConfidenceLevels] = useState<number[]>([]);
  const [adaptationPatterns, setAdaptationPatterns] = useState<AdaptationPattern[]>([]);

  const calculateWeightedScore = useCallback((rawScore: number, appropriateness: number, confidence: number) => {
    let score = rawScore;
    
    // Weight by cultural appropriateness
    score *= appropriateness;
    
    // Adjust for confidence-accuracy alignment
    const confidenceAccuracyGap = Math.abs(confidence / 5 - appropriateness);
    if (confidenceAccuracyGap > 0.3) {
      // Overconfidence or underconfidence penalty
      score *= (1 - confidenceAccuracyGap * 0.5);
    }
    
    return score;
  }, []);

  const updateDimensionComponents = useCallback((dimension: keyof CQScores, scenarioType: string, cqScores: any, appropriateness: number) => {
    const componentMap = {
      drive: {
        business_meeting: 'intrinsic',
        email_communication: 'extrinsic',
        negotiation: 'selfEfficacy',
        team_conflict: 'intrinsic',
        presentation_style: 'selfEfficacy'
      },
      knowledge: {
        business_meeting: 'business',
        team_conflict: 'interpersonal',
        presentation_style: 'cultural',
        email_communication: 'business',
        negotiation: 'cultural'
      },
      strategy: {
        email_communication: 'planning',
        negotiation: 'checking',
        team_conflict: 'adjusting',
        business_meeting: 'planning',
        presentation_style: 'checking'
      },
      action: {
        business_meeting: 'nonverbal',
        email_communication: 'verbal',
        presentation_style: 'behavioral',
        negotiation: 'behavioral',
        team_conflict: 'verbal'
      }
    };
    
    const component = componentMap[dimension]?.[scenarioType as keyof typeof componentMap[typeof dimension]];
    if (component) {
      setDimensions(prev => ({
        ...prev,
        [dimension]: {
          ...prev[dimension],
          components: {
            ...prev[dimension].components,
            [component]: prev[dimension].components[component] + (cqScores[dimension] * appropriateness)
          }
        }
      }));
    }
  }, []);

  const updateCulturalProfile = useCallback((country: string, appropriateness: number, scenarioData: Omit<ScenarioHistory, 'location'>) => {
    setCulturalProfiles(prev => {
      const profile = prev[country] || {
        interactions: 0,
        totalScore: 0,
        averageAppropriateness: 0,
        strengths: [],
        challenges: []
      };

      const newProfile = {
        ...profile,
        interactions: profile.interactions + 1,
        totalScore: profile.totalScore + appropriateness,
        averageAppropriateness: (profile.totalScore + appropriateness) / (profile.interactions + 1)
      };

      const scenarioRecord = { ...scenarioData, location: country };

      // Track specific successes and challenges
      if (appropriateness > 0.8) {
        newProfile.strengths.push(scenarioRecord);
      } else if (appropriateness < 0.4) {
        newProfile.challenges.push(scenarioRecord);
      }

      return {
        ...prev,
        [country]: newProfile
      };
    });
  }, []);

  const categorizeDecisionStyle = useCallback((responseText: string): AdaptationPattern['decisionStyle'] => {
    const text = responseText.toLowerCase();
    
    if (text.includes('wait') || text.includes('follow') || text.includes('observe')) {
      return 'cautious';
    } else if (text.includes('direct') || text.includes('immediate') || text.includes('firm')) {
      return 'assertive';
    } else if (text.includes('adapt') || text.includes('moderate') || text.includes('balance')) {
      return 'adaptive';
    } else {
      return 'contextual';
    }
  }, []);

  const processScenarioResponse = useCallback((scenario: any, response: any, confidence: number) => {
    const scores = response.cqScores;
    const appropriateness = response.culturalAppropriateness;
    
    // Update dimension scores with weighted calculation
    setDimensions(prev => {
      const newDimensions = { ...prev };
      
      Object.keys(scores).forEach(dimension => {
        const rawScore = scores[dimension];
        const weightedScore = calculateWeightedScore(rawScore, appropriateness, confidence);
        
        newDimensions[dimension as keyof CQScores] = {
          ...newDimensions[dimension as keyof CQScores],
          score: newDimensions[dimension as keyof CQScores].score + weightedScore
        };
        
        // Update components based on scenario type
        updateDimensionComponents(dimension as keyof CQScores, scenario.type, scores, appropriateness);
      });
      
      return newDimensions;
    });
    
    // Track scenario performance
    const scenarioRecord = {
      scenarioId: scenario.id,
      location: scenario.location.country,
      type: scenario.type,
      appropriateness: appropriateness,
      confidence: confidence,
      timestamp: Date.now()
    };
    
    setScenarioHistory(prev => [...prev, scenarioRecord]);
    setConfidenceLevels(prev => [...prev, confidence]);
    
    // Update cultural profile for specific country
    updateCulturalProfile(scenario.location.country, appropriateness, {
      scenarioId: scenario.id,
      type: scenario.type,
      appropriateness: appropriateness,
      confidence: confidence,
      timestamp: Date.now()
    });
    
    // Analyze patterns
    const pattern: AdaptationPattern = {
      scenarioType: scenario.type,
      culturalContext: scenario.location.country,
      decisionStyle: categorizeDecisionStyle(response.text),
      adaptationLevel: appropriateness
    };
    
    setAdaptationPatterns(prev => [...prev, pattern]);
  }, [calculateWeightedScore, updateDimensionComponents, updateCulturalProfile, categorizeDecisionStyle]);

  const calculateEditDistance = useCallback((str1: string, str2: string) => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }, []);

  const analyzeEmailAdaptation = useCallback((original: string, adapted: string, targetCountry: string): CQAnalysis => {
    const analysis: CQAnalysis = {
      effortScore: 0,
      culturalAccuracy: 0,
      strategicThinking: 0,
      executionQuality: 0
    };
    
    // Calculate edit distance for effort
    analysis.effortScore = calculateEditDistance(original, adapted) / original.length;
    
    // Cultural accuracy based on key adaptations
    const culturalMarkers: Record<string, { positive: string[], negative: string[] }> = {
      Japan: {
        positive: ['apologize', 'respect', 'consider', 'group', 'we'],
        negative: ['immediate', 'critical', 'no excuses', 'I need']
      },
      Brazil: {
        positive: ['team', 'together', 'appreciate', 'hope', 'family'],
        negative: ['burning', 'critical', 'immediately']
      },
      Germany: {
        positive: ['specifically', 'data', 'timeline', 'efficiency', 'objectives'],
        negative: ['hope', 'touch base', 'maybe']
      }
    };
    
    const markers = culturalMarkers[targetCountry];
    if (markers) {
      let accuracy = 0.5; // Base score
      
      markers.positive.forEach(marker => {
        if (adapted.toLowerCase().includes(marker)) accuracy += 0.1;
      });
      
      markers.negative.forEach(marker => {
        if (!adapted.toLowerCase().includes(marker) && 
            original.toLowerCase().includes(marker)) accuracy += 0.1;
      });
      
      analysis.culturalAccuracy = Math.min(accuracy, 1);
    }
    
    // Strategic thinking - structural changes
    const originalLines = original.split('\n').length;
    const adaptedLines = adapted.split('\n').length;
    const originalSentences = original.split(/[.!?]/).length;
    const adaptedSentences = adapted.split(/[.!?]/).length;
    
    const structureChange = Math.abs(originalLines - adaptedLines) / originalLines +
                           Math.abs(originalSentences - adaptedSentences) / originalSentences;
    
    analysis.strategicThinking = Math.min(structureChange, 1);
    
    // Execution quality - overall coherence
    analysis.executionQuality = adapted.length > 50 ? 0.8 : 0.4; // Simple coherence check
    
    return analysis;
  }, [calculateEditDistance]);

  const processEmailChallenge = useCallback((challenge: any, adaptations: Array<{ text: string; targetCountry: string }>) => {
    const scores = {
      drive: 0,
      knowledge: 0,
      strategy: 0,
      action: 0
    };
    
    adaptations.forEach(adaptation => {
      const analysis = analyzeEmailAdaptation(
        challenge.originalMessage,
        adaptation.text,
        adaptation.targetCountry
      );
      
      // Update scores based on adaptation quality
      scores.drive += analysis.effortScore * 2;
      scores.knowledge += analysis.culturalAccuracy * 5;
      scores.strategy += analysis.strategicThinking * 4;
      scores.action += analysis.executionQuality * 5;
    });
    
    // Average across all adaptations
    Object.keys(scores).forEach(dimension => {
      scores[dimension as keyof typeof scores] /= adaptations.length;
      setDimensions(prev => ({
        ...prev,
        [dimension]: {
          ...prev[dimension as keyof CQScores],
          score: prev[dimension as keyof CQScores].score + scores[dimension as keyof typeof scores]
        }
      }));
    });
  }, [analyzeEmailAdaptation]);

  const identifyStrengthsAndWeaknesses = useCallback(() => {
    const recentPatterns = adaptationPatterns.slice(-10);
    
    // Analyze by scenario type
    const typePerformance: Record<string, number> = {};
    recentPatterns.forEach(pattern => {
      if (!typePerformance[pattern.scenarioType]) {
        typePerformance[pattern.scenarioType] = 0;
      }
      typePerformance[pattern.scenarioType] += pattern.adaptationLevel;
    });
    
    // Calculate averages
    Object.keys(typePerformance).forEach(type => {
      const count = recentPatterns.filter(p => p.scenarioType === type).length;
      typePerformance[type] = typePerformance[type] / count;
    });
    
    return typePerformance;
  }, [adaptationPatterns]);

  const getOverallCQScore = useCallback(() => {
    const totalScore = dimensions.drive.score + dimensions.knowledge.score + 
                      dimensions.strategy.score + dimensions.action.score;
    return Math.min(Math.max(totalScore / 4, 0), 100);
  }, [dimensions]);

  const getCQLevel = useCallback(() => {
    const score = getOverallCQScore();
    if (score >= 80) return 'Advanced Cultural Intelligence';
    if (score >= 60) return 'Proficient Cultural Intelligence';
    if (score >= 40) return 'Developing Cultural Intelligence';
    return 'Emerging Cultural Intelligence';
  }, [getOverallCQScore]);

  const resetScores = useCallback(() => {
    setDimensions({
      drive: {
        score: 0,
        components: { intrinsic: 0, extrinsic: 0, selfEfficacy: 0 }
      },
      knowledge: {
        score: 0,
        components: { cultural: 0, business: 0, interpersonal: 0 }
      },
      strategy: {
        score: 0,
        components: { planning: 0, checking: 0, adjusting: 0 }
      },
      action: {
        score: 0,
        components: { verbal: 0, nonverbal: 0, behavioral: 0 }
      }
    });
    setCulturalProfiles({});
    setScenarioHistory([]);
    setConfidenceLevels([]);
    setAdaptationPatterns([]);
  }, []);

  return {
    dimensions,
    culturalProfiles,
    scenarioHistory,
    confidenceLevels,
    adaptationPatterns,
    processScenarioResponse,
    processEmailChallenge,
    analyzeEmailAdaptation,
    identifyStrengthsAndWeaknesses,
    getOverallCQScore,
    getCQLevel,
    resetScores
  };
};