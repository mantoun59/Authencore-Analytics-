/**
 * Centralized Assessment Scoring Engine
 * Provides consistent scoring logic across all assessments with improved methodologies
 */

import type { DemographicProfile } from '../services/normativeDatabaseService';

export interface ScoringConfig {
  assessmentType: string;
  responses: any[];
  metadata?: Record<string, any>;
  demographics?: Partial<DemographicProfile>;
  enableBiasDetection?: boolean;
  enableNormativeComparison?: boolean;
}

export interface ScoringResult {
  scores: Record<string, number>;
  percentiles?: Record<string, number>;
  normativeComparisons?: Record<string, any>;
  categories?: Record<string, string>;
  insights?: string[];
  validity?: {
    isValid: boolean;
    warnings: string[];
    confidence: number;
  };
  biasAnalysis?: {
    hasPotentialBias: boolean;
    biasFlags: string[];
    confidenceLevel: number;
  };
  fairnessMetrics?: {
    overallFairnessScore: number;
    groupComparisons: Record<string, any>;
  };
  recommendations?: string[];
  dimensionBreakdown?: Record<string, any>;
}

export interface DimensionConfig {
  name: string;
  weight: number;
  questions: string[];
  reverseScored?: boolean;
  interpretation: {
    high: string;
    medium: string;
    low: string;
  };
}

/**
 * Enhanced scoring utility with advanced psychometric features
 */
export const ScoringEngine = {
  /**
   * Calculate scores with proper weighting and normalization
   */
  calculateWeightedScores: (
    responses: any[], 
    dimensions: DimensionConfig[]
  ): Record<string, number> => {
    const scores: Record<string, number> = {};
    
    if (!responses || responses.length === 0) {
      dimensions.forEach(dim => scores[dim.name] = 0);
      return scores;
    }

    dimensions.forEach(dimension => {
      let dimensionScore = 0;
      let validResponses = 0;
      
      dimension.questions.forEach(questionId => {
        const response = responses.find(r => r.questionId === questionId);
        if (response) {
          let score = typeof response.score === 'number' ? response.score : 0;
          
          // Apply reverse scoring if needed
          if (dimension.reverseScored) {
            score = 6 - score; // Assuming 1-5 scale
          }
          
          dimensionScore += score;
          validResponses++;
        }
      });
      
      // Calculate average and normalize to 0-100 scale
      if (validResponses > 0) {
        const average = dimensionScore / validResponses;
        scores[dimension.name] = Math.round(((average - 1) / 4) * 100); // Convert 1-5 to 0-100
      } else {
        scores[dimension.name] = 0;
      }
    });

    return scores;
  },

  /**
   * Advanced validity detection with multiple measures
   */
  detectAdvancedPatterns: (responses: any[]): {
    straightLining: boolean;
    randomness: number;
    speedWarning: boolean;
    carelessness: number;
    socialDesirability: number;
    responseSet: boolean;
  } => {
    if (!responses || responses.length === 0) {
      return { 
        straightLining: false, 
        randomness: 0, 
        speedWarning: false,
        carelessness: 0,
        socialDesirability: 0,
        responseSet: false
      };
    }

    // Straight-lining detection
    const straightLining = responses.every((r, i) => i === 0 || r.score === responses[0].score);
    
    // Response time analysis
    const avgResponseTime = responses.reduce((sum, r) => sum + (r.timeTaken || 5000), 0) / responses.length;
    const speedWarning = avgResponseTime < 2000; // Less than 2 seconds per question
    
    // Variance analysis for randomness
    const scores = responses.map(r => r.score).filter(s => typeof s === 'number');
    if (scores.length === 0) {
      return { 
        straightLining, 
        randomness: 0, 
        speedWarning,
        carelessness: 0,
        socialDesirability: 0,
        responseSet: false
      };
    }

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const randomness = Math.min(variance, 2); // Normalize randomness score
    
    // Carelessness detection (extreme response patterns)
    const extremeResponses = scores.filter(s => s === 1 || s === 5).length;
    const carelessness = extremeResponses / scores.length;
    
    // Social desirability bias (tendency toward "positive" responses)
    const positiveResponses = scores.filter(s => s >= 4).length;
    const socialDesirability = positiveResponses / scores.length;
    
    // Response set (preference for certain response positions)
    const responseSet = straightLining || carelessness > 0.8;
    
    return {
      straightLining,
      randomness,
      speedWarning,
      carelessness,
      socialDesirability,
      responseSet
    };
  },

  /**
   * Calculate percentiles using normative data
   */
  calculateNormativePercentiles: (
    scores: Record<string, number>,
    normativeData: Record<string, number[]>
  ): Record<string, number> => {
    const percentiles: Record<string, number> = {};
    
    Object.keys(scores).forEach(dimension => {
      const score = scores[dimension];
      const norms = normativeData[dimension] || [];
      
      if (norms.length === 0) {
        percentiles[dimension] = 50; // Default to median
        return;
      }
      
      const sortedNorms = [...norms].sort((a, b) => a - b);
      const rank = sortedNorms.filter(s => s <= score).length;
      percentiles[dimension] = Math.round((rank / sortedNorms.length) * 100);
    });
    
    return percentiles;
  },

  /**
   * Generate reliability estimates
   */
  calculateReliability: (
    responses: any[],
    dimensions: DimensionConfig[]
  ): Record<string, number> => {
    const reliability: Record<string, number> = {};
    
    dimensions.forEach(dimension => {
      const dimensionResponses = responses.filter(r => 
        dimension.questions.includes(r.questionId)
      );
      
      if (dimensionResponses.length < 3) {
        reliability[dimension.name] = 0.5; // Low reliability for few items
        return;
      }
      
      // Simplified Cronbach's alpha estimation
      const scores = dimensionResponses.map(r => r.score);
      const variance = scores.reduce((sum, score) => {
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        return sum + Math.pow(score - mean, 2);
      }, 0) / scores.length;
      
      // Simplified formula (actual Cronbach's alpha would require inter-item correlations)
      const estimatedAlpha = Math.min(0.95, Math.max(0.3, variance / 2));
      reliability[dimension.name] = estimatedAlpha;
    });
    
    return reliability;
  },

  /**
   * Assessment-specific dimension configurations
   */
  getAssessmentDimensions: (assessmentType: string): DimensionConfig[] => {
    switch (assessmentType) {
      case 'career-launch':
        return [
          { 
            name: 'Realistic', 
            weight: 1.0, 
            questions: ['q1', 'q7', 'q13'], 
            interpretation: { high: 'Practical & hands-on', medium: 'Balanced approach', low: 'Abstract preference' }
          },
          { 
            name: 'Investigative', 
            weight: 1.0, 
            questions: ['q2', 'q8', 'q14'], 
            interpretation: { high: 'Analytical & research-oriented', medium: 'Some analytical interest', low: 'Less research-focused' }
          },
          { 
            name: 'Artistic', 
            weight: 1.0, 
            questions: ['q3', 'q9', 'q15'], 
            interpretation: { high: 'Creative & expressive', medium: 'Some creative interests', low: 'Structured preference' }
          },
          { 
            name: 'Social', 
            weight: 1.0, 
            questions: ['q4', 'q10', 'q16'], 
            interpretation: { high: 'People-oriented & helping', medium: 'Balanced social interest', low: 'Task-focused' }
          },
          { 
            name: 'Enterprising', 
            weight: 1.0, 
            questions: ['q5', 'q11', 'q17'], 
            interpretation: { high: 'Leadership & business-oriented', medium: 'Some entrepreneurial interest', low: 'Collaborative preference' }
          },
          { 
            name: 'Conventional', 
            weight: 1.0, 
            questions: ['q6', 'q12', 'q18'], 
            interpretation: { high: 'Organized & systematic', medium: 'Moderately structured', low: 'Flexible approach' }
          }
        ];

      case 'stress-resilience':
        return [
          { 
            name: 'Emotional', 
            weight: 0.25, 
            questions: ['sr001', 'sr002', 'sr003'], 
            interpretation: { high: 'Excellent emotional regulation', medium: 'Good emotional stability', low: 'Needs emotional support' }
          },
          { 
            name: 'Cognitive', 
            weight: 0.20, 
            questions: ['sr004', 'sr005', 'sr006'], 
            interpretation: { high: 'Strong mental adaptability', medium: 'Good problem-solving', low: 'Needs cognitive strategies' }
          },
          { 
            name: 'Physical', 
            weight: 0.15, 
            questions: ['sr007', 'sr008', 'sr009'], 
            interpretation: { high: 'Excellent physical resilience', medium: 'Good physical management', low: 'Physical stress concerns' }
          },
          { 
            name: 'Social', 
            weight: 0.15, 
            questions: ['sr010', 'sr011', 'sr012'], 
            interpretation: { high: 'Strong support utilization', medium: 'Good social resources', low: 'Needs support building' }
          },
          { 
            name: 'Adaptability', 
            weight: 0.15, 
            questions: ['sr013', 'sr014', 'sr015'], 
            interpretation: { high: 'Excellent change adaptation', medium: 'Good flexibility', low: 'Prefers stability' }
          },
          { 
            name: 'Performance', 
            weight: 0.10, 
            questions: ['sr016', 'sr017', 'sr018'], 
            interpretation: { high: 'Maintains quality under pressure', medium: 'Generally good performance', low: 'Performance affected by stress' }
          }
        ];

      case 'communication-styles':
        return [
          { 
            name: 'Direct', 
            weight: 1.0, 
            questions: ['cs001', 'cs005', 'cs009'], 
            interpretation: { high: 'Clear & straightforward communicator', medium: 'Balanced directness', low: 'Indirect communication style' }
          },
          { 
            name: 'Collaborative', 
            weight: 1.0, 
            questions: ['cs002', 'cs006', 'cs010'], 
            interpretation: { high: 'Team-oriented communicator', medium: 'Some collaborative tendencies', low: 'Independent communicator' }
          },
          { 
            name: 'Supportive', 
            weight: 1.0, 
            questions: ['cs003', 'cs007', 'cs011'], 
            interpretation: { high: 'Empathetic & encouraging', medium: 'Generally supportive', low: 'Task-focused communication' }
          },
          { 
            name: 'Analytical', 
            weight: 1.0, 
            questions: ['cs004', 'cs008', 'cs012'], 
            interpretation: { high: 'Data-driven communicator', medium: 'Some analytical approach', low: 'Intuitive communication' }
          }
        ];

      default:
        return [{ 
          name: 'Overall', 
          weight: 1.0, 
          questions: [], 
          interpretation: { high: 'Strong performance', medium: 'Average performance', low: 'Needs development' }
        }];
    }
  },

  /**
   * Generate comprehensive scoring result with advanced features
   */
  generateAdvancedScoringResult: async (config: ScoringConfig): Promise<ScoringResult> => {
    const { assessmentType, responses, metadata = {}, demographics, enableBiasDetection = false, enableNormativeComparison = false } = config;
    const dimensions = ScoringEngine.getAssessmentDimensions(assessmentType);
    const scores = ScoringEngine.calculateWeightedScores(responses, dimensions);
    const patterns = ScoringEngine.detectAdvancedPatterns(responses);
    const reliability = ScoringEngine.calculateReliability(responses, dimensions);

    // Calculate overall validity score
    const validityScore = (
      (patterns.straightLining ? 0 : 25) +
      (patterns.speedWarning ? 0 : 25) +
      (patterns.carelessness < 0.5 ? 25 : 0) +
      (patterns.responseSet ? 0 : 25)
    ) / 100;

    const validity = {
      isValid: validityScore > 0.6,
      warnings: [
        ...(patterns.straightLining ? ['Straight-line responding detected'] : []),
        ...(patterns.speedWarning ? ['Responses may be too quick'] : []),
        ...(patterns.carelessness > 0.7 ? ['High careless responding pattern'] : []),
        ...(patterns.responseSet ? ['Response set bias detected'] : [])
      ],
      confidence: validityScore
    };

    // Enhanced analysis with normative and bias detection
    let normativeComparisons: Record<string, any> = {};
    let biasAnalysis: any = undefined;
    let fairnessMetrics: any = undefined;

    // Perform normative comparison if enabled
    if (enableNormativeComparison && typeof window !== 'undefined') {
      try {
        const { normativeService } = await import('../services/normativeDatabaseService');
        normativeComparisons = await normativeService.getEnrichedPercentiles(
          assessmentType,
          scores,
          demographics
        );
      } catch (error) {
        console.warn('Normative comparison unavailable:', error);
      }
    }

    // Perform bias detection if enabled and demographics provided
    if (enableBiasDetection && demographics && typeof window !== 'undefined') {
      try {
        const { biasDetectionService } = await import('../services/biasDetectionService');
        // Check if we have the required fields for bias detection
        if (demographics.gender && demographics.ageRange) {
          biasAnalysis = await biasDetectionService.performRealTimeBiasCheck(
            assessmentType,
            scores,
            demographics as any
          );
        }
        
        const monitoringData = await biasDetectionService.getBiasMonitoringData([assessmentType]);
        fairnessMetrics = {
          overallFairnessScore: monitoringData.overallFairnessScore,
          groupComparisons: monitoringData.assessmentFairness
        };
      } catch (error) {
        console.warn('Bias detection unavailable:', error);
      }
    }

    // Generate enhanced insights
    const insights = [
      `Assessment completed with ${responses.length} responses`,
      `Validity confidence: ${Math.round(validityScore * 100)}%`,
      ...Object.entries(scores).map(([dim, score]) => {
        const config = dimensions.find(d => d.name === dim);
        const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
        const normativeInfo = normativeComparisons[dim];
        const percentileInfo = normativeInfo?.dataAvailable ? 
          ` (${normativeInfo.percentile}th percentile)` : '';
        return config ? `${dim}: ${config.interpretation[level]}${percentileInfo}` : `${dim}: ${score}%`;
      }),
      ...(biasAnalysis?.biasFlags || [])
    ];

    return {
      scores,
      percentiles: Object.fromEntries(
        Object.entries(normativeComparisons).map(([dim, data]) => [dim, data.percentile || 50])
      ),
      normativeComparisons,
      categories: {
        assessment: assessmentType,
        primary: Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, ''),
        validity: validity.isValid ? 'valid' : 'questionable'
      },
      insights,
      validity,
      biasAnalysis,
      fairnessMetrics,
      recommendations: ScoringEngine.generateRecommendations(scores, dimensions, patterns),
      dimensionBreakdown: {
        reliability,
        patterns,
        rawScores: scores,
        normativeData: normativeComparisons
      }
    };
  },

  /**
   * Generate personalized recommendations
   */
  generateRecommendations: (
    scores: Record<string, number>,
    dimensions: DimensionConfig[],
    patterns: any
  ): string[] => {
    const recommendations: string[] = [];
    
    // Validity-based recommendations
    if (patterns.straightLining) {
      recommendations.push('Consider retaking the assessment with more varied responses');
    }
    
    if (patterns.speedWarning) {
      recommendations.push('Take time to carefully consider each question for more accurate results');
    }

    // Score-based recommendations
    Object.entries(scores).forEach(([dimension, score]) => {
      const config = dimensions.find(d => d.name === dimension);
      if (!config) return;
      
      if (score < 40) {
        recommendations.push(`Focus on developing ${dimension.toLowerCase()} skills`);
      } else if (score > 80) {
        recommendations.push(`Leverage your strong ${dimension.toLowerCase()} abilities`);
      }
    });

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Continue developing a balanced approach across all dimensions');
    }
    
    return recommendations;
  }
};

// Export utility functions for backward compatibility
export const calculateBasicScores = ScoringEngine.calculateWeightedScores;
export const detectResponsePatterns = ScoringEngine.detectAdvancedPatterns;
export const generateScoringResult = ScoringEngine.generateAdvancedScoringResult;