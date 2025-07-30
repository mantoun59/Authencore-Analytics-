import { useState, useCallback } from 'react';
import { burnoutPreventionQuestions } from '@/data/burnoutPreventionQuestions';

// Define burnout risk profiles
const burnoutRiskProfiles = [
  { name: 'Thriving', range: { min: 85, max: 100 }, description: 'Excellent burnout resilience' },
  { name: 'Resilient', range: { min: 70, max: 84 }, description: 'Strong burnout resistance' },
  { name: 'Stable', range: { min: 55, max: 69 }, description: 'Moderate burnout resilience' },
  { name: 'Vulnerable', range: { min: 40, max: 54 }, description: 'At-risk for burnout' },
  { name: 'Critical', range: { min: 0, max: 39 }, description: 'High burnout risk' }
];

// Define dimension weights for comprehensive scoring
const dimensionWeights = {
  workload: 0.25,
  emotional: 0.25,
  efficacy: 0.20,
  support: 0.15,
  worklife: 0.10,
  coping: 0.05
};

interface BurnoutPreventionResponse {
  questionId: string;
  selectedOption: number;
  score: number;
  timeTaken: number;
  confidence: number;
  category: string;
  dimension: string;
}

interface DimensionScore {
  dimension: string;
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface DistortionMetrics {
  responseAuthenticity: number;
  socialDesirabilityBias: number;
  impressionManagement: number;
  responseConsistency: number;
  straightLining: boolean;
  speedWarning: boolean;
  overallValidity: 'high' | 'medium' | 'low';
}

interface BurnoutPreventionResult {
  overallScore: number;
  percentileScore: number;
  burnoutRiskProfile: string;
  categoryScores: DimensionScore[];
  dimensionScores: DimensionScore[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  burnoutRisk: 'low' | 'medium' | 'high';
  wellnessLevel: 'excellent' | 'good' | 'fair' | 'poor';
  distortionMetrics: DistortionMetrics;
  priorityAreas: string[];
}

export const useBurnoutPreventionScoring = () => {
  const [responses, setResponses] = useState<BurnoutPreventionResponse[]>([]);
  const [currentResults, setCurrentResults] = useState<BurnoutPreventionResult | null>(null);

  const addResponse = useCallback((response: BurnoutPreventionResponse) => {
    setResponses(prev => [...prev, response]);
  }, []);

  const calculateCategoryScores = (responses: BurnoutPreventionResponse[]) => {
    const categories = ['workload', 'emotional', 'efficacy', 'support', 'worklife', 'coping', 'wellbeing'];
    
    return categories.map(category => {
      const categoryResponses = responses.filter(r => r.category === category);
      const totalScore = categoryResponses.reduce((sum, r) => sum + r.score, 0);
      const maxScore = categoryResponses.length * 5; // Assuming 5-point scale
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      
      const level = percentage >= 80 ? 'Excellent' :
                   percentage >= 65 ? 'Good' :
                   percentage >= 50 ? 'Fair' :
                   percentage >= 35 ? 'Poor' : 'Critical';
      
      const riskLevel: 'low' | 'medium' | 'high' = percentage >= 65 ? 'low' :
                       percentage >= 45 ? 'medium' : 'high';

      return {
        dimension: category.charAt(0).toUpperCase() + category.slice(1),
        category,
        score: totalScore,
        maxScore,
        percentage,
        level,
        riskLevel
      };
    });
  };

  const calculateDimensionScores = (responses: BurnoutPreventionResponse[]) => {
    const dimensionMap = new Map<string, BurnoutPreventionResponse[]>();
    
    responses.forEach(response => {
      if (!dimensionMap.has(response.dimension)) {
        dimensionMap.set(response.dimension, []);
      }
      dimensionMap.get(response.dimension)!.push(response);
    });

    return Array.from(dimensionMap.entries()).map(([dimension, dimResponses]) => {
      const totalScore = dimResponses.reduce((sum, r) => sum + r.score, 0);
      const maxScore = dimResponses.length * 5;
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      
      const level = percentage >= 80 ? 'Excellent' :
                   percentage >= 65 ? 'Good' :
                   percentage >= 50 ? 'Fair' :
                   percentage >= 35 ? 'Poor' : 'Critical';
      
      const riskLevel: 'low' | 'medium' | 'high' = percentage >= 65 ? 'low' :
                       percentage >= 45 ? 'medium' : 'high';

      return {
        dimension,
        category: dimResponses[0].category,
        score: totalScore,
        maxScore,
        percentage,
        level,
        riskLevel
      };
    });
  };

  const calculateOverallScore = (categoryScores: DimensionScore[]) => {
    let weightedSum = 0;
    let totalWeight = 0;

    categoryScores.forEach(category => {
      const weight = dimensionWeights[category.category as keyof typeof dimensionWeights] || 0;
      weightedSum += category.percentage * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  const determineBurnoutRiskProfile = (overallScore: number) => {
    const profile = burnoutRiskProfiles.find(p => 
      overallScore >= p.range.min && overallScore <= p.range.max
    );
    return profile?.name || 'Unknown';
  };

  const calculatePercentileScore = (overallScore: number) => {
    // Simulate percentile based on normal distribution
    if (overallScore >= 85) return 90 + Math.random() * 10;
    if (overallScore >= 70) return 70 + Math.random() * 20;
    if (overallScore >= 55) return 40 + Math.random() * 30;
    if (overallScore >= 40) return 20 + Math.random() * 20;
    return Math.random() * 20;
  };

  const calculateDistortionMetrics = (responses: BurnoutPreventionResponse[]): DistortionMetrics => {
    const scores = responses.map(r => r.score);
    const times = responses.map(r => r.timeTaken);
    
    // Calculate response authenticity (variation in responses)
    const scoreVariance = scores.reduce((acc, score, idx) => {
      const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      return acc + Math.pow(score - mean, 2);
    }, 0) / scores.length;
    
    const responseAuthenticity = Math.min(100, (scoreVariance / 2) * 100);
    
    // Detect straight-lining (same response pattern)
    const uniqueScores = new Set(scores).size;
    const straightLining = uniqueScores <= 2 && scores.length > 10;
    
    // Speed warning (too fast responses)
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    const speedWarning = avgTime < 2000; // Less than 2 seconds average
    
    // Social desirability bias (too many high scores)
    const highScores = scores.filter(s => s >= 4).length;
    const socialDesirabilityBias = (highScores / scores.length) * 100;
    
    // Response consistency
    const responseConsistency = 100 - (scoreVariance * 10);
    
    const impressionManagement = socialDesirabilityBias > 80 ? 
      Math.min(100, socialDesirabilityBias + 20) : socialDesirabilityBias;
    
    const overallValidity = 
      straightLining || speedWarning || impressionManagement > 85 ? 'low' :
      socialDesirabilityBias > 70 || responseConsistency < 40 ? 'medium' : 'high';

    return {
      responseAuthenticity: Math.round(responseAuthenticity),
      socialDesirabilityBias: Math.round(socialDesirabilityBias),
      impressionManagement: Math.round(impressionManagement),
      responseConsistency: Math.round(Math.max(0, responseConsistency)),
      straightLining,
      speedWarning,
      overallValidity
    };
  };

  const identifyStrengths = (categoryScores: DimensionScore[]) => {
    return categoryScores
      .filter(score => score.percentage >= 70)
      .map(score => `Strong ${score.dimension.toLowerCase()} management`)
      .slice(0, 3);
  };

  const identifyChallenges = (categoryScores: DimensionScore[]) => {
    return categoryScores
      .filter(score => score.percentage < 50)
      .sort((a, b) => a.percentage - b.percentage)
      .map(score => `${score.dimension} requires attention`)
      .slice(0, 3);
  };

  const identifyPriorityAreas = (categoryScores: DimensionScore[]) => {
    return categoryScores
      .filter(score => score.riskLevel === 'high')
      .map(score => score.dimension)
      .slice(0, 3);
  };

  const generateRecommendations = (categoryScores: DimensionScore[], overallScore: number) => {
    const recommendations: string[] = [];
    
    categoryScores.forEach(category => {
      if (category.riskLevel === 'high') {
        switch (category.category) {
          case 'workload':
            recommendations.push('Implement time management strategies and workload prioritization techniques');
            break;
          case 'emotional':
            recommendations.push('Develop emotional regulation skills and seek peer support');
            break;
          case 'efficacy':
            recommendations.push('Set achievable goals and celebrate small wins to build confidence');
            break;
          case 'support':
            recommendations.push('Strengthen social connections and communicate needs to supervisors');
            break;
          case 'worklife':
            recommendations.push('Establish clear boundaries between work and personal time');
            break;
          case 'coping':
            recommendations.push('Learn stress management techniques and relaxation methods');
            break;
          case 'wellbeing':
            recommendations.push('Focus on physical health, sleep hygiene, and self-care practices');
            break;
        }
      }
    });

    if (overallScore < 50) {
      recommendations.push('Consider professional counseling or employee assistance programs');
    }

    return recommendations.slice(0, 5);
  };

  const assessBurnoutRisk = (categoryScores: DimensionScore[]) => {
    const highRiskCount = categoryScores.filter(score => score.riskLevel === 'high').length;
    const mediumRiskCount = categoryScores.filter(score => score.riskLevel === 'medium').length;
    
    if (highRiskCount >= 3) return 'high';
    if (highRiskCount >= 1 || mediumRiskCount >= 4) return 'medium';
    return 'low';
  };

  const determineWellnessLevel = (overallScore: number) => {
    if (overallScore >= 80) return 'excellent';
    if (overallScore >= 65) return 'good';
    if (overallScore >= 45) return 'fair';
    return 'poor';
  };

  const calculateResults = useCallback((finalResponses: BurnoutPreventionResponse[]) => {
    const categoryScores = calculateCategoryScores(finalResponses);
    const dimensionScores = calculateDimensionScores(finalResponses);
    const overallScore = calculateOverallScore(categoryScores);
    const burnoutRiskProfile = determineBurnoutRiskProfile(overallScore);
    const percentileScore = calculatePercentileScore(overallScore);
    const distortionMetrics = calculateDistortionMetrics(finalResponses);
    const strengths = identifyStrengths(categoryScores);
    const challenges = identifyChallenges(categoryScores);
    const priorityAreas = identifyPriorityAreas(categoryScores);
    const recommendations = generateRecommendations(categoryScores, overallScore);
    const burnoutRisk = assessBurnoutRisk(categoryScores);
    const wellnessLevel = determineWellnessLevel(overallScore);

    const results: BurnoutPreventionResult = {
      overallScore,
      percentileScore,
      burnoutRiskProfile,
      categoryScores,
      dimensionScores,
      strengths,
      challenges,
      recommendations,
      burnoutRisk,
      wellnessLevel,
      distortionMetrics,
      priorityAreas
    };

    setCurrentResults(results);
    return results;
  }, []);

  const resetAssessment = useCallback(() => {
    setResponses([]);
    setCurrentResults(null);
  }, []);

  return {
    responses,
    currentResults,
    addResponse,
    calculateResults,
    resetAssessment
  };
};