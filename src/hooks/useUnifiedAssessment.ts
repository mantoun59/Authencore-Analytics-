// Unified Assessment Hook
// Single hook to handle all assessment types with consistent functionality

import { useState, useCallback } from 'react';
import { 
  UnifiedAssessmentData, 
  UnifiedAssessmentResults, 
  UnifiedScoringConfig,
  UnifiedReportConfig 
} from '@/types/unifiedAssessment.types';
import { unifiedScoringEngine } from '@/services/unifiedScoringEngine';
import { unifiedReportGenerator } from '@/services/unifiedReportGenerator';
import { toast } from 'sonner';

export interface UseUnifiedAssessmentReturn {
  results: UnifiedAssessmentResults | null;
  isCalculating: boolean;
  isGeneratingReport: boolean;
  error: string | null;
  calculateResults: (data: UnifiedAssessmentData, config: UnifiedScoringConfig) => Promise<void>;
  generateReport: (reportConfig?: Partial<UnifiedReportConfig>) => Promise<void>;
  clearResults: () => void;
  shareResults: () => Promise<void>;
  retakeAssessment: () => void;
}

export const useUnifiedAssessment = (): UseUnifiedAssessmentReturn => {
  const [results, setResults] = useState<UnifiedAssessmentResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (
    data: UnifiedAssessmentData, 
    config: UnifiedScoringConfig
  ) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculatedResults = await unifiedScoringEngine.calculateResults(data, config);
      setResults(calculatedResults);
      toast.success('Assessment results calculated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const generateReport = useCallback(async (
    reportConfig?: Partial<UnifiedReportConfig>
  ) => {
    if (!results) {
      toast.error('No results available to generate report');
      return;
    }

    setIsGeneratingReport(true);
    setError(null);

    try {
      const config: UnifiedReportConfig = {
        assessmentType: results.assessmentType,
        reportType: 'candidate',
        results,
        template: 'standard',
        includeCharts: true,
        includeRecommendations: true,
        includeActionPlan: true,
        ...reportConfig
      };

      await unifiedReportGenerator.generateReport(config);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingReport(false);
    }
  }, [results]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  const shareResults = useCallback(async () => {
    if (!results) {
      toast.error('No results to share');
      return;
    }

    try {
      const shareText = `I just completed the ${results.assessmentType} assessment and scored ${results.overallScore}% overall! My top strengths include: ${results.insights.strengths.slice(0, 3).join(', ')}.`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Assessment Results',
          text: shareText,
          url: window.location.href
        });
        toast.success('Results shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Results copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      toast.error('Failed to share results');
    }
  }, [results]);

  const retakeAssessment = useCallback(() => {
    setResults(null);
    setError(null);
    toast.info('Ready to retake assessment');
  }, []);

  return {
    results,
    isCalculating,
    isGeneratingReport,
    error,
    calculateResults,
    generateReport,
    clearResults,
    shareResults,
    retakeAssessment
  };
};

// Assessment-specific hooks that extend the unified hook
export const useCareerLaunchAssessment = () => {
  const unifiedHook = useUnifiedAssessment();
  
  const calculateCareerResults = useCallback(async (data: UnifiedAssessmentData) => {
    const config: UnifiedScoringConfig = {
      assessmentType: 'career-launch',
      questions: [], // Would be loaded from career launch questions
      dimensions: {
        interests: { name: 'Career Interests', description: 'Areas of professional interest', weight: 1, questions: [] },
        skills: { name: 'Skills Assessment', description: 'Current skill levels', weight: 1, questions: [] },
        values: { name: 'Work Values', description: 'Professional values alignment', weight: 1, questions: [] },
        readiness: { name: 'Career Readiness', description: 'Preparedness for career progression', weight: 1, questions: [] }
      },
      validityChecks: ['consistency', 'engagement', 'completion']
    };
    
    await unifiedHook.calculateResults(data, config);
  }, [unifiedHook]);

  return {
    ...unifiedHook,
    calculateCareerResults
  };
};

export const useCommunicationAssessment = () => {
  const unifiedHook = useUnifiedAssessment();
  
  const calculateCommunicationResults = useCallback(async (data: UnifiedAssessmentData) => {
    const config: UnifiedScoringConfig = {
      assessmentType: 'communication',
      questions: [],
      dimensions: {
        direct: { name: 'Direct Communication', description: 'Clear, straightforward communication style', weight: 1, questions: [] },
        supportive: { name: 'Supportive Communication', description: 'Empathetic, encouraging communication', weight: 1, questions: [] },
        analytical: { name: 'Analytical Communication', description: 'Data-driven, logical communication', weight: 1, questions: [] },
        expressive: { name: 'Expressive Communication', description: 'Enthusiastic, creative communication', weight: 1, questions: [] }
      },
      validityChecks: ['consistency', 'engagement', 'completion']
    };
    
    await unifiedHook.calculateResults(data, config);
  }, [unifiedHook]);

  return {
    ...unifiedHook,
    calculateCommunicationResults
  };
};

export const useGenZAssessment = () => {
  const unifiedHook = useUnifiedAssessment();
  
  const calculateGenZResults = useCallback(async (data: UnifiedAssessmentData) => {
    const config: UnifiedScoringConfig = {
      assessmentType: 'genz',
      questions: [],
      dimensions: {
        authenticity: { name: 'Authenticity', description: 'Value for genuine, authentic workplace culture', weight: 1, questions: [] },
        flexibility: { name: 'Flexibility', description: 'Preference for flexible work arrangements', weight: 1, questions: [] },
        purpose: { name: 'Purpose', description: 'Desire for meaningful, purpose-driven work', weight: 1, questions: [] },
        collaboration: { name: 'Collaboration', description: 'Team-oriented work style', weight: 1, questions: [] },
        innovation: { name: 'Innovation', description: 'Openness to new ideas and technologies', weight: 1, questions: [] },
        wellbeing: { name: 'Well-being', description: 'Priority on work-life balance and mental health', weight: 1, questions: [] }
      },
      validityChecks: ['consistency', 'engagement', 'completion']
    };
    
    await unifiedHook.calculateResults(data, config);
  }, [unifiedHook]);

  return {
    ...unifiedHook,
    calculateGenZResults
  };
};

// Export default hook
export default useUnifiedAssessment;