/**
 * Centralized Assessment Scoring Engine
 * Handles all scoring logic for consistency and maintainability
 */

import { useCareerLaunchScoring } from '@/hooks/useCareerLaunchScoring';
import { useCommunicationScoring } from '@/hooks/useCommunicationScoring';
import { useCommunicationStylesScoring } from '@/hooks/useCommunicationStylesScoring';
import { useEmotionalIntelligenceScoring } from '@/hooks/useEmotionalIntelligenceScoring';
import { useFaithValuesScoring } from '@/hooks/useFaithValuesScoring';
import { useGenZScoring } from '@/hooks/useGenZScoring';
import { useLeadershipScoring } from '@/hooks/useLeadershipScoring';
import { useStressResilienceScoring } from '@/hooks/useStressResilienceScoring';
import { useDigitalWellnessScoring } from '@/hooks/useDigitalWellnessScoring';
import { useCQScoring } from '@/hooks/useCQScoring';

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
 * Universal scoring engine that routes to appropriate scoring hooks
 */
export const useUniversalScoring = () => {
  const careerLaunchScoring = useCareerLaunchScoring();
  const communicationScoring = useCommunicationScoring();
  const communicationStylesScoring = useCommunicationStylesScoring();
  const emotionalIntelligenceScoring = useEmotionalIntelligenceScoring();
  const faithValuesScoring = useFaithValuesScoring();
  const genZScoring = useGenZScoring();
  const leadershipScoring = useLeadershipScoring();
  const stressResilienceScoring = useStressResilienceScoring();
  const digitalWellnessScoring = useDigitalWellnessScoring();
  const cqScoring = useCQScoring();

  const calculateScore = (config: ScoringConfig): ScoringResult => {
    const { assessmentType, responses, metadata } = config;

    try {
      switch (assessmentType) {
        case 'career-launch':
          return careerLaunchScoring.calculateResults(responses, metadata);
          
        case 'communication-assessment':
        case 'communication':
          return communicationScoring.calculateResults(responses, metadata);
          
        case 'communication-styles':
          return communicationStylesScoring.calculateResults(responses, metadata);
          
        case 'emotional-intelligence':
          return emotionalIntelligenceScoring.calculateResults(responses, metadata);
          
        case 'faith-values':
          return faithValuesScoring.calculateResults(responses, metadata);
          
        case 'genz-assessment':
        case 'genz':
        case 'genz-workplace':
          return genZScoring.calculateResults(responses, metadata);
          
        case 'leadership-assessment':
        case 'leadership':
          return leadershipScoring.calculateResults(responses, metadata);
          
        case 'stress-resilience':
          return stressResilienceScoring.calculateResults(responses, metadata);
          
        case 'digital-wellness':
          return digitalWellnessScoring.calculateResults(responses, metadata);
          
        case 'cultural-intelligence':
        case 'cair-assessment':
        case 'cair':
          return cqScoring.calculateResults(responses, metadata);

        default:
          throw new Error(`Unknown assessment type: ${assessmentType}`);
      }
    } catch (error) {
      console.error(`Scoring error for ${assessmentType}:`, error);
      return {
        scores: {},
        validity: {
          isValid: false,
          warnings: [`Scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          confidence: 0
        }
      };
    }
  };

  const validateResponses = (config: ScoringConfig): boolean => {
    const { responses, assessmentType } = config;
    
    // Basic validation
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return false;
    }

    // Assessment-specific validation could be added here
    return true;
  };

  const getScoreInterpretation = (score: number, assessmentType: string, dimension: string): string => {
    // Standardized score interpretation across all assessments
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Below Average';
    return 'Needs Development';
  };

  return {
    calculateScore,
    validateResponses,
    getScoreInterpretation
  };
};

/**
 * Standardized percentile calculations
 */
export const calculatePercentile = (score: number, allScores: number[]): number => {
  if (allScores.length === 0) return 50; // Default to 50th percentile
  
  const sortedScores = [...allScores].sort((a, b) => a - b);
  const rank = sortedScores.filter(s => s <= score).length;
  return Math.round((rank / sortedScores.length) * 100);
};

/**
 * Common validity detection algorithms
 */
export const detectResponsePatterns = (responses: any[]): {
  straightLining: boolean;
  randomness: number;
  speedWarning: boolean;
} => {
  // Implement common validity detection patterns
  const straightLining = responses.every((r, i) => i === 0 || r === responses[0]);
  
  // Calculate response variance as randomness indicator
  const values = responses.filter(r => typeof r === 'number');
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const randomness = variance / mean || 0;
  
  return {
    straightLining,
    randomness,
    speedWarning: false // Would need timing data
  };
};