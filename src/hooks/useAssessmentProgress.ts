import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProgressData {
  currentPhase: number;
  currentQuestion: number;
  responses: Record<string, any>;
  phaseData: Record<string, any>;
  progressPercentage: number;
  assessmentType: string;
}

interface SavedProgress {
  id: string;
  assessment_type: string;
  current_phase: number;
  current_question: number;
  responses: any;
  phase_data: any;
  progress_percentage: number;
  started_at: string;
  last_saved_at: string;
}

export const useAssessmentProgress = (assessmentType: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const generateGuestToken = () => {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
  };

  // Check for existing saved progress
  const checkForSavedProgress = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let query = supabase
        .from('assessment_progress')
        .select('*')
        .eq('assessment_type', assessmentType)
        .eq('is_completed', false)
        .gt('expires_at', new Date().toISOString())
        .order('last_saved_at', { ascending: false })
        .limit(1);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        // For guest users, check localStorage for token
        const guestToken = localStorage.getItem('guest-assessment-token');
        if (guestToken) {
          query = query.eq('guest_token', guestToken);
        } else {
          return null;
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error checking for saved progress:', error);
        return null;
      }

      if (data && data.length > 0) {
        setSavedProgress(data[0]);
        return data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error checking for saved progress:', error);
      return null;
    }
  }, [assessmentType]);

  // Save progress to database
  const saveProgress = useCallback(async (progressData: ProgressData) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For guest users, get or create a token
      let guestToken = null;
      if (!user) {
        guestToken = localStorage.getItem('guest-assessment-token');
        if (!guestToken) {
          guestToken = generateGuestToken();
          localStorage.setItem('guest-assessment-token', guestToken);
        }
      }

      const progressRecord = {
        user_id: user?.id || null,
        guest_token: guestToken,
        assessment_type: progressData.assessmentType,
        current_phase: progressData.currentPhase,
        current_question: progressData.currentQuestion,
        responses: progressData.responses,
        phase_data: progressData.phaseData,
        progress_percentage: progressData.progressPercentage,
        last_saved_at: new Date().toISOString(),
      };

      if (savedProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('assessment_progress')
          .update(progressRecord)
          .eq('id', savedProgress.id);

        if (error) throw error;
      } else {
        // Create new progress record
        const { data, error } = await supabase
          .from('assessment_progress')
          .insert(progressRecord)
          .select()
          .single();

        if (error) throw error;
        setSavedProgress(data);
      }

    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your progress. Your work is still secure locally.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, savedProgress, toast]);

  // Restore progress
  const restoreProgress = useCallback(async (): Promise<ProgressData | null> => {
    if (!savedProgress) return null;

    setIsRestoring(true);
    try {
      const progressData: ProgressData = {
        currentPhase: savedProgress.current_phase,
        currentQuestion: savedProgress.current_question,
        responses: savedProgress.responses,
        phaseData: savedProgress.phase_data,
        progressPercentage: savedProgress.progress_percentage,
        assessmentType: savedProgress.assessment_type,
      };

      toast({
        title: "Progress Restored",
        description: `Continuing from where you left off (${Math.round(savedProgress.progress_percentage)}% complete)`,
      });

      return progressData;
    } catch (error) {
      console.error('Error restoring progress:', error);
      toast({
        title: "Restore Failed",
        description: "Unable to restore saved progress. Starting fresh.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsRestoring(false);
    }
  }, [savedProgress, toast]);

  // Mark assessment as completed
  const markCompleted = useCallback(async () => {
    if (!savedProgress) return;

    try {
      const { error } = await supabase
        .from('assessment_progress')
        .update({ is_completed: true })
        .eq('id', savedProgress.id);

      if (error) throw error;
      setSavedProgress(null);
      
      // Clear guest token if used
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        localStorage.removeItem('guest-assessment-token');
      }
    } catch (error) {
      console.error('Error marking assessment as completed:', error);
    }
  }, [savedProgress]);

  // Clear progress (user chooses to restart)
  const clearProgress = useCallback(async () => {
    if (!savedProgress) return;

    try {
      const { error } = await supabase
        .from('assessment_progress')
        .delete()
        .eq('id', savedProgress.id);

      if (error) throw error;
      setSavedProgress(null);
      
      // Clear guest token if used
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        localStorage.removeItem('guest-assessment-token');
      }

      toast({
        title: "Progress Cleared",
        description: "Starting fresh assessment",
      });
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }, [savedProgress, toast]);

  // Auto-save with debouncing
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (progressData: ProgressData) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => saveProgress(progressData), 2000);
      };
    })(),
    [saveProgress]
  );

  // Initialize on mount
  useEffect(() => {
    checkForSavedProgress();
  }, [checkForSavedProgress]);

  return {
    savedProgress,
    isSaving,
    isRestoring,
    saveProgress: debouncedSave,
    restoreProgress,
    markCompleted,
    clearProgress,
    checkForSavedProgress,
  };
};