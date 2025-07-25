/**
 * Centralized Assessment Scoring Engine
 * Simplified version to handle scoring consistency across assessments
 */

export interface ScoringConfig {
  assessmentType: string;
  responses: any[];
  metadata?: Record<string, any>;
}

export interface ScoringResult {
  scores: Record<string, number>;
  percentiles?: Record<string, number>;
  categories?: Record<string, string>;
  insights?: string[];
  validity?: {
    isValid: boolean;
    warnings: string[];
    confidence: number;
  };
}

/**
 * Simplified scoring utility for assessment consistency
 */
export const ScoringEngine = {
  /**
   * Basic scoring calculation with standardized output
   */
  calculateBasicScores: (responses: any[], dimensions: string[]): Record<string, number> => {
    const scores: Record<string, number> = {};
    
    if (!responses || responses.length === 0) {
      dimensions.forEach(dim => scores[dim] = 0);
      return scores;
    }

    // Basic scoring logic - can be customized per assessment
    dimensions.forEach((dimension, index) => {
      const relevantResponses = responses.filter((_, i) => i % dimensions.length === index);
      const average = relevantResponses.length > 0 
        ? relevantResponses.reduce((sum, r) => sum + (typeof r === 'number' ? r : 0), 0) / relevantResponses.length
        : 0;
      scores[dimension] = Math.round(average * 20); // Scale to 0-100
    });

    return scores;
  },

  /**
   * Standardized percentile calculations
   */
  calculatePercentile: (score: number, allScores: number[]): number => {
    if (allScores.length === 0) return 50;
    
    const sortedScores = [...allScores].sort((a, b) => a - b);
    const rank = sortedScores.filter(s => s <= score).length;
    return Math.round((rank / sortedScores.length) * 100);
  },

  /**
   * Common validity detection
   */
  detectResponsePatterns: (responses: any[]): {
    straightLining: boolean;
    randomness: number;
    speedWarning: boolean;
  } => {
    if (!responses || responses.length === 0) {
      return { straightLining: false, randomness: 0, speedWarning: false };
    }

    const straightLining = responses.every((r, i) => i === 0 || r === responses[0]);
    
    const values = responses.filter(r => typeof r === 'number');
    if (values.length === 0) {
      return { straightLining, randomness: 0, speedWarning: false };
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const randomness = mean > 0 ? variance / mean : 0;
    
    return {
      straightLining,
      randomness,
      speedWarning: false
    };
  },

  /**
   * Standardized score interpretation
   */
  getScoreInterpretation: (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Below Average';
    return 'Needs Development';
  },

  /**
   * Assessment-specific dimension mappings
   */
  getAssessmentDimensions: (assessmentType: string): string[] => {
    switch (assessmentType) {
      case 'career-launch':
        return ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
      case 'communication-styles':
        return ['Direct', 'Collaborative', 'Supportive', 'Analytical'];
      case 'emotional-intelligence':
        return ['Self-Awareness', 'Self-Regulation', 'Motivation', 'Empathy', 'Social-Skills'];
      case 'leadership-assessment':
        return ['Vision', 'Influence', 'Execution', 'Innovation'];
      case 'stress-resilience':
        return ['Resilience', 'Stress-Management', 'Adaptability', 'Recovery'];
      case 'cultural-intelligence':
        return ['Cultural-Drive', 'Cultural-Knowledge', 'Cultural-Strategy', 'Cultural-Action'];
      default:
        return ['Overall'];
    }
  },

  /**
   * Generate a standardized scoring result
   */
  generateScoringResult: (config: ScoringConfig): ScoringResult => {
    const { assessmentType, responses } = config;
    const dimensions = ScoringEngine.getAssessmentDimensions(assessmentType);
    const scores = ScoringEngine.calculateBasicScores(responses, dimensions);
    const patterns = ScoringEngine.detectResponsePatterns(responses);

    return {
      scores,
      categories: {
        assessment: assessmentType,
        primary: Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, '')
      },
      insights: [
        `Assessment completed with ${responses.length} responses`,
        `Primary strength: ${Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, '')}`,
        patterns.straightLining ? 'Response pattern may indicate lack of engagement' : 'Response pattern appears valid'
      ],
      validity: {
        isValid: !patterns.straightLining && responses.length > 0,
        warnings: patterns.straightLining ? ['Straight-line responding detected'] : [],
        confidence: patterns.straightLining ? 0.3 : 0.8
      }
    };
  }
};