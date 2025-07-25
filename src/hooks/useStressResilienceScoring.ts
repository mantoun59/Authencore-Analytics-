import { useState, useCallback } from 'react';
import { burnoutPreventionQuestions } from '@/data/burnoutPreventionQuestions';

// Define resilience profiles for burnout prevention assessment
const resilienceProfiles = [
  { name: 'Diamond', range: { min: 85, max: 100 } },
  { name: 'Steel', range: { min: 70, max: 84 } },
  { name: 'Bamboo', range: { min: 55, max: 69 } },
  { name: 'Glass', range: { min: 40, max: 54 } },
  { name: 'Clay', range: { min: 0, max: 39 } }
];

// Define dimension weights for scoring
const dimensionWeights = {
  workload: 0.2,
  emotional: 0.25,
  efficacy: 0.2,
  support: 0.15,
  worklife: 0.1,
  coping: 0.1
};

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
      workload: { score: 0, maxScore: 0, questions: 0 },
      emotional: { score: 0, maxScore: 0, questions: 0 },
      efficacy: { score: 0, maxScore: 0, questions: 0 },
      support: { score: 0, maxScore: 0, questions: 0 },
      worklife: { score: 0, maxScore: 0, questions: 0 },
      coping: { score: 0, maxScore: 0, questions: 0 }
    };

    responses.forEach(response => {
      const question = burnoutPreventionQuestions.find(q => q.id === response.questionId);
      if (question) {
        const dimension = question.category;
        if (dimensionTotals[dimension]) {
          dimensionTotals[dimension].score += response.score;
          dimensionTotals[dimension].maxScore += 5; // Max score per question
          dimensionTotals[dimension].questions += 1;
        }
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
          case 'workload':
            strengths.push('Excellent workload management and organization');
            break;
          case 'emotional':
            strengths.push('Strong emotional resilience and energy levels');
            break;
          case 'efficacy':
            strengths.push('High sense of personal accomplishment and competence');
            break;
          case 'support':
            strengths.push('Strong support network utilization');
            break;
          case 'worklife':
            strengths.push('Excellent work-life balance and integration');
            break;
          case 'coping':
            strengths.push('Effective stress coping and wellness practices');
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
          case 'workload':
            challenges.push('Managing workload and time effectively');
            break;
          case 'emotional':
            challenges.push('Emotional exhaustion and energy depletion');
            break;
          case 'efficacy':
            challenges.push('Sense of personal accomplishment and competence');
            break;
          case 'support':
            challenges.push('Building and utilizing support systems');
            break;
          case 'worklife':
            challenges.push('Achieving work-life balance and boundaries');
            break;
          case 'coping':
            challenges.push('Developing effective stress coping strategies');
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
          case 'workload':
            recommendations.push('Implement time management and task prioritization strategies');
            break;
          case 'emotional':
            recommendations.push('Practice emotional regulation and stress recovery techniques');
            break;
          case 'efficacy':
            recommendations.push('Set achievable goals and celebrate accomplishments');
            break;
          case 'support':
            recommendations.push('Build and maintain professional and personal support networks');
            break;
          case 'worklife':
            recommendations.push('Establish clear boundaries between work and personal time');
            break;
          case 'coping':
            recommendations.push('Develop healthy coping mechanisms and wellness practices');
            break;
        }
      }
    });

    return recommendations;
  }, []);

  const assessBurnoutRisk = useCallback((dimensionScores: DimensionScore[]): 'low' | 'medium' | 'high' => {
    const emotionalScore = dimensionScores.find(d => d.dimension.toLowerCase() === 'emotional')?.percentage || 0;
    const workloadScore = dimensionScores.find(d => d.dimension.toLowerCase() === 'workload')?.percentage || 0;
    const efficacyScore = dimensionScores.find(d => d.dimension.toLowerCase() === 'efficacy')?.percentage || 0;

    const avgCriticalScores = (emotionalScore + workloadScore + efficacyScore) / 3;

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