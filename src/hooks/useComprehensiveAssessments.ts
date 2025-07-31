// Comprehensive Assessment Hooks
// Specialized hooks for each new assessment type

import { useState, useCallback } from 'react';
import { 
  ComprehensiveAssessmentScoring,
  TechIntegrationResult,
  CommCompetencyResult,
  LeadershipResult,
  WorkValuesResult,
  WorkPreferencesResult
} from '@/services/comprehensiveAssessmentScoring';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Technology Integration Assessment Hook
export const useTechnologyIntegrationAssessment = () => {
  const [results, setResults] = useState<TechIntegrationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (responses: number[]) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculatedResults = ComprehensiveAssessmentScoring.calculateTechnologyIntegration(responses);
      setResults(calculatedResults);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sessionId = crypto.randomUUID();
        
        const { error: saveError } = await supabase
          .from('technology_integration_results')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            usage_patterns: calculatedResults.scores.usage_patterns,
            digital_boundaries: calculatedResults.scores.digital_boundaries,
            tech_life_balance: calculatedResults.scores.tech_life_balance,
            productivity_impact: calculatedResults.scores.productivity_impact,
            overall_tech_integration: calculatedResults.scores.overall_tech_integration,
            interpretation: calculatedResults.interpretation,
            recommendations: calculatedResults.recommendations
          });
          
        if (saveError) {
          console.error('Error saving tech integration results:', saveError);
        }
      }
      
      toast.success('Technology Integration assessment completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isCalculating,
    error,
    calculateResults,
    clearResults
  };
};

// Communication Competency Assessment Hook
export const useCommunicationCompetencyAssessment = () => {
  const [results, setResults] = useState<CommCompetencyResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (responses: number[]) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculatedResults = ComprehensiveAssessmentScoring.calculateCommunicationCompetencies(responses);
      setResults(calculatedResults);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sessionId = crypto.randomUUID();
        
        const { error: saveError } = await supabase
          .from('communication_competency_results')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            direct_indirect: calculatedResults.scores.direct_indirect,
            formal_informal: calculatedResults.scores.formal_informal,
            expressive_reserved: calculatedResults.scores.expressive_reserved,
            task_relationship: calculatedResults.scores.task_relationship,
            overall_communication_effectiveness: calculatedResults.scores.overall_communication_effectiveness,
            interpretation: calculatedResults.interpretation,
            recommendations: calculatedResults.recommendations
          });
          
        if (saveError) {
          console.error('Error saving communication competency results:', saveError);
        }
      }
      
      toast.success('Communication Competency assessment completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isCalculating,
    error,
    calculateResults,
    clearResults
  };
};

// Leadership Behavior Assessment Hook
export const useLeadershipBehaviorAssessment = () => {
  const [results, setResults] = useState<LeadershipResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (responses: number[]) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculatedResults = ComprehensiveAssessmentScoring.calculateLeadershipBehaviors(responses);
      setResults(calculatedResults);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sessionId = crypto.randomUUID();
        
        const { error: saveError } = await supabase
          .from('leadership_behavior_results')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            visionary_leadership: calculatedResults.scores.visionary_leadership,
            coaching_leadership: calculatedResults.scores.coaching_leadership,
            affiliative_leadership: calculatedResults.scores.affiliative_leadership,
            democratic_leadership: calculatedResults.scores.democratic_leadership,
            pacesetting_leadership: calculatedResults.scores.pacesetting_leadership,
            commanding_leadership: calculatedResults.scores.commanding_leadership,
            overall_leadership_effectiveness: calculatedResults.leadership_effectiveness,
            primary_style: calculatedResults.primary_style,
            secondary_style: calculatedResults.secondary_style,
            interpretation: calculatedResults.interpretation,
            recommendations: calculatedResults.recommendations
          });
          
        if (saveError) {
          console.error('Error saving leadership behavior results:', saveError);
        }
      }
      
      toast.success('Leadership Behavior assessment completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isCalculating,
    error,
    calculateResults,
    clearResults
  };
};

// Work Values Assessment Hook
export const useWorkValuesAssessment = () => {
  const [results, setResults] = useState<WorkValuesResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (responses: number[]) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculatedResults = ComprehensiveAssessmentScoring.calculateWorkValues(responses);
      setResults(calculatedResults);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sessionId = crypto.randomUUID();
        
        const { error: saveError } = await supabase
          .from('work_values_results')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            achievement_recognition: calculatedResults.scores.achievement_recognition,
            autonomy_independence: calculatedResults.scores.autonomy_independence,
            social_impact_service: calculatedResults.scores.social_impact_service,
            security_stability: calculatedResults.scores.security_stability,
            growth_learning: calculatedResults.scores.growth_learning,
            work_life_integration: calculatedResults.scores.work_life_integration,
            innovation_creativity: calculatedResults.scores.innovation_creativity,
            leadership_influence: calculatedResults.scores.leadership_influence,
            collaboration_teamwork: calculatedResults.scores.collaboration_teamwork,
            values_hierarchy: calculatedResults.values_hierarchy,
            top_values: calculatedResults.top_values,
            bottom_values: calculatedResults.bottom_values,
            values_profile: { profile: calculatedResults.values_profile },
            interpretation: calculatedResults.interpretation,
            recommendations: calculatedResults.recommendations
          });
          
        if (saveError) {
          console.error('Error saving work values results:', saveError);
        }
      }
      
      toast.success('Work Values assessment completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isCalculating,
    error,
    calculateResults,
    clearResults
  };
};

// Work Preferences Assessment Hook
export const useWorkPreferencesAssessment = () => {
  const [results, setResults] = useState<WorkPreferencesResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateResults = useCallback(async (responses: number[]) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const calculatedResults = ComprehensiveAssessmentScoring.calculateWorkPreferences(responses);
      setResults(calculatedResults);
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sessionId = crypto.randomUUID();
        
        const { error: saveError } = await supabase
          .from('work_preferences_results')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            work_preferences: calculatedResults.scores.work_preferences,
            communication_styles: calculatedResults.scores.communication_styles,
            career_expectations: calculatedResults.scores.career_expectations,
            technology_integration: calculatedResults.scores.technology_integration,
            multigenerational_strategies: calculatedResults.scores.multigenerational_strategies,
            preference_profile: { profile: calculatedResults.preference_profile },
            workplace_fit: calculatedResults.workplace_fit,
            interpretation: calculatedResults.interpretation,
            recommendations: calculatedResults.recommendations
          });
          
        if (saveError) {
          console.error('Error saving work preferences results:', saveError);
        }
      }
      
      toast.success('Work Preferences assessment completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isCalculating,
    error,
    calculateResults,
    clearResults
  };
};