import { useState, useCallback } from 'react';
import { stressResilienceQuestions, resilienceProfiles, dimensionWeights } from '@/data/stressResilienceQuestions';

interface StressResilienceResponse {
  questionId: string;
  selectedOption: number;
  score: number;
  timeTaken: number;
  confidence: number;
}

interface DimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
}

interface StressResilienceResult {
  overallScore: number;
  percentileScore: number;
  resilienceProfile: string;
  dimensionScores: DimensionScore[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  burnoutRisk: 'low' | 'medium' | 'high';
  stressManagementLevel: 'excellent' | 'good' | 'fair' | 'needs-improvement';
}

export const useStressResilienceScoring = () => {
  const [responses, setResponses] = useState<StressResilienceResponse[]>([]);
  const [currentResults, setCurrentResults] = useState<StressResilienceResult | null>(null);

  const addResponse = useCallback((response: StressResilienceResponse) => {
    setResponses(prev => [...prev, response]);
  }, []);

  const calculateDimensionScores = useCallback((responses: StressResilienceResponse[]): DimensionScore[] => {
    const dimensionTotals = {
      emotional: { score: 0, maxScore: 0, questions: 0 },
      cognitive: { score: 0, maxScore: 0, questions: 0 },
      physical: { score: 0, maxScore: 0, questions: 0 },
      social: { score: 0, maxScore: 0, questions: 0 },
      adaptability: { score: 0, maxScore: 0, questions: 0 },
      performance: { score: 0, maxScore: 0, questions: 0 }
    };

    responses.forEach(response => {
      const question = stressResilienceQuestions.find(q => q.id === response.questionId);
      if (question) {
        const dimension = question.category;
        dimensionTotals[dimension].score += response.score;
        dimensionTotals[dimension].maxScore += 5; // Max score per question
        dimensionTotals[dimension].questions += 1;
      }
    });

    return Object.entries(dimensionTotals).map(([dimension, totals]) => {
      const percentage = totals.maxScore > 0 ? (totals.score / totals.maxScore) * 100 : 0;
      let level = 'needs-improvement';
      
      if (percentage >= 80) level = 'excellent';
      else if (percentage >= 65) level = 'good';
      else if (percentage >= 50) level = 'fair';

      return {
        dimension: dimension.charAt(0).toUpperCase() + dimension.slice(1),
        score: totals.score,
        maxScore: totals.maxScore,
        percentage,
        level
      };
    });
  }, []);

  const calculateOverallScore = useCallback((dimensionScores: DimensionScore[]): number => {
    let weightedScore = 0;
    let totalWeight = 0;

    dimensionScores.forEach(dimScore => {
      const weight = dimensionWeights[dimScore.dimension.toLowerCase() as keyof typeof dimensionWeights] || 0;
      weightedScore += (dimScore.percentage * weight);
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }, []);

  const determineResilienceProfile = useCallback((overallScore: number): string => {
    for (const profile of resilienceProfiles) {
      if (overallScore >= profile.range.min && overallScore <= profile.range.max) {
        return profile.name;
      }
    }
    return 'Clay';
  }, []);

  const calculatePercentileScore = useCallback((overallScore: number): number => {
    // Simulated percentile based on score distribution
    if (overallScore >= 90) return 95;
    if (overallScore >= 80) return 85;
    if (overallScore >= 70) return 70;
    if (overallScore >= 60) return 55;
    if (overallScore >= 50) return 35;
    return 15;
  }, []);

  const identifyStrengths = useCallback((dimensionScores: DimensionScore[]): string[] => {
    const strengths: string[] = [];
    
    dimensionScores.forEach(dimension => {
      if (dimension.percentage >= 75) {
        switch (dimension.dimension.toLowerCase()) {
          case 'emotional':
            strengths.push('Excellent emotional regulation under pressure');
            break;
          case 'cognitive':
            strengths.push('Strong problem-solving abilities in challenging situations');
            break;
          case 'physical':
            strengths.push('Effective physical stress management');
            break;
          case 'social':
            strengths.push('Strong support network utilization');
            break;
          case 'adaptability':
            strengths.push('Excellent adaptability to change');
            break;
          case 'performance':
            strengths.push('Maintains high performance under pressure');
            break;
        }
      }
    });

    return strengths;
  }, []);

  const identifyChallenges = useCallback((dimensionScores: DimensionScore[]): string[] => {
    const challenges: string[] = [];
    
    dimensionScores.forEach(dimension => {
      if (dimension.percentage < 50) {
        switch (dimension.dimension.toLowerCase()) {
          case 'emotional':
            challenges.push('Emotional regulation during high-stress periods');
            break;
          case 'cognitive':
            challenges.push('Maintaining clear thinking under pressure');
            break;
          case 'physical':
            challenges.push('Managing physical stress responses');
            break;
          case 'social':
            challenges.push('Effectively utilizing support systems');
            break;
          case 'adaptability':
            challenges.push('Adapting to unexpected changes');
            break;
          case 'performance':
            challenges.push('Maintaining performance quality under pressure');
            break;
        }
      }
    });

    return challenges;
  }, []);

  const generateRecommendations = useCallback((dimensionScores: DimensionScore[], overallScore: number): string[] => {
    const recommendations: string[] = [];
    
    // General recommendations based on overall score
    if (overallScore < 50) {
      recommendations.push('Consider professional stress management counseling');
      recommendations.push('Implement daily mindfulness or meditation practice');
      recommendations.push('Establish regular exercise routine for stress relief');
    } else if (overallScore < 70) {
      recommendations.push('Develop structured stress management techniques');
      recommendations.push('Practice progressive muscle relaxation');
      recommendations.push('Build stronger support networks');
    } else if (overallScore < 85) {
      recommendations.push('Fine-tune existing stress management strategies');
      recommendations.push('Seek challenging projects to build resilience');
      recommendations.push('Consider mentoring others in stress management');
    }

    // Specific recommendations based on dimension scores
    dimensionScores.forEach(dimension => {
      if (dimension.percentage < 60) {
        switch (dimension.dimension.toLowerCase()) {
          case 'emotional':
            recommendations.push('Practice emotional regulation techniques like deep breathing');
            break;
          case 'cognitive':
            recommendations.push('Develop problem-solving frameworks for high-pressure situations');
            break;
          case 'physical':
            recommendations.push('Incorporate stress-reducing physical activities');
            break;
          case 'social':
            recommendations.push('Build and maintain professional support networks');
            break;
          case 'adaptability':
            recommendations.push('Practice flexibility through varied experiences');
            break;
          case 'performance':
            recommendations.push('Develop pressure-testing strategies for skill maintenance');
            break;
        }
      }
    });

    return recommendations;
  }, []);

  const assessBurnoutRisk = useCallback((dimensionScores: DimensionScore[]): 'low' | 'medium' | 'high' => {
    const emotionalScore = dimensionScores.find(d => d.dimension.toLowerCase() === 'emotional')?.percentage || 0;
    const physicalScore = dimensionScores.find(d => d.dimension.toLowerCase() === 'physical')?.percentage || 0;
    const adaptabilityScore = dimensionScores.find(d => d.dimension.toLowerCase() === 'adaptability')?.percentage || 0;

    const avgCriticalScores = (emotionalScore + physicalScore + adaptabilityScore) / 3;

    if (avgCriticalScores < 40) return 'high';
    if (avgCriticalScores < 60) return 'medium';
    return 'low';
  }, []);

  const determineStressManagementLevel = useCallback((overallScore: number): 'excellent' | 'good' | 'fair' | 'needs-improvement' => {
    if (overallScore >= 80) return 'excellent';
    if (overallScore >= 65) return 'good';
    if (overallScore >= 50) return 'fair';
    return 'needs-improvement';
  }, []);

  const calculateResults = useCallback((finalResponses: StressResilienceResponse[]): StressResilienceResult => {
    const dimensionScores = calculateDimensionScores(finalResponses);
    const overallScore = calculateOverallScore(dimensionScores);
    const resilienceProfile = determineResilienceProfile(overallScore);
    const percentileScore = calculatePercentileScore(overallScore);
    const strengths = identifyStrengths(dimensionScores);
    const challenges = identifyChallenges(dimensionScores);
    const recommendations = generateRecommendations(dimensionScores, overallScore);
    const burnoutRisk = assessBurnoutRisk(dimensionScores);
    const stressManagementLevel = determineStressManagementLevel(overallScore);

    const results = {
      overallScore,
      percentileScore,
      resilienceProfile,
      dimensionScores,
      strengths,
      challenges,
      recommendations,
      burnoutRisk,
      stressManagementLevel
    };

    setCurrentResults(results);
    return results;
  }, [
    calculateDimensionScores,
    calculateOverallScore,
    determineResilienceProfile,
    calculatePercentileScore,
    identifyStrengths,
    identifyChallenges,
    generateRecommendations,
    assessBurnoutRisk,
    determineStressManagementLevel
  ]);

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