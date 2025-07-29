import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportData {
  id: string;
  assessment_type: string;
  results: any;
  created_at: string;
  user_profile?: {
    name: string;
    email: string;
  };
}

interface UseDynamicReportOptions {
  assessmentId?: string;
  assessmentType?: string;
  userId?: string;
  autoFetch?: boolean;
}

export const useDynamicReport = (options: UseDynamicReportOptions = {}) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReportData = async () => {
    if (!options.assessmentId && !options.userId) {
      setError('Assessment ID or User ID required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('assessment_results')
        .select(`
          id,
          assessment_type,
          results,
          created_at,
          user_id
        `);

      if (options.assessmentId) {
        query = query.eq('id', options.assessmentId);
      } else if (options.userId) {
        query = query.eq('user_id', options.userId);
        if (options.assessmentType) {
          query = query.eq('assessment_type', options.assessmentType);
        }
        query = query.order('created_at', { ascending: false }).limit(1);
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data) {
        // Get user profile separately
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('user_id', data.user_id)
          .single();

        const formattedData: ReportData = {
          id: data.id,
          assessment_type: data.assessment_type,
          results: data.results,
          created_at: data.created_at,
          user_profile: {
            name: profileData?.full_name || 'Unknown User',
            email: profileData?.email || ''
          }
        };
        setReportData(formattedData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveReportData = async (data: Partial<ReportData>) => {
    if (!reportData?.id) {
      setError('No report ID available for update');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('assessment_results')
        .update({
          results: data.results || reportData.results,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportData.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Update local state
      setReportData(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Success",
        description: "Report data updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update report data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicInsights = async () => {
    if (!reportData) {
      setError('No report data available for insights generation');
      return;
    }

    setLoading(true);
    try {
      const { data, error: insightsError } = await supabase.functions.invoke('enhanced-ai-analysis', {
        body: {
          assessmentType: reportData.assessment_type,
          results: reportData.results,
          userId: reportData.user_profile?.email
        }
      });

      if (insightsError) {
        throw new Error(insightsError.message);
      }

      // Update report data with enhanced insights
      const updatedResults = {
        ...reportData.results,
        enhancedAI: data
      };

      await saveReportData({ results: updatedResults });
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options.autoFetch && (options.assessmentId || options.userId)) {
      fetchReportData();
    }
  }, [options.autoFetch, options.assessmentId, options.userId]);

  return {
    reportData,
    loading,
    error,
    fetchReportData,
    saveReportData,
    generateDynamicInsights,
    refetch: fetchReportData
  };
};