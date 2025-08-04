import { supabase } from '@/integrations/supabase/client';
import { generateHtmlReport } from '@/utils/htmlReportGenerator';

// Unified interface for all assessments
export interface UnifiedAssessmentData {
  assessmentType: string;
  userProfile: {
    name: string;
    email: string;
    position?: string;
    company?: string;
  };
  responses: any[];
  scores: Record<string, number>;
  dimensions: Array<{
    name: string;
    score: number;
  }>;
  overallScore: number;
  validity?: {
    isValid: boolean;
    flags: string[];
  };
  metadata?: Record<string, any>;
}

export class UnifiedAssessmentEngine {
  private static instance: UnifiedAssessmentEngine;

  static getInstance(): UnifiedAssessmentEngine {
    if (!UnifiedAssessmentEngine.instance) {
      UnifiedAssessmentEngine.instance = new UnifiedAssessmentEngine();
    }
    return UnifiedAssessmentEngine.instance;
  }

  /**
   * Save assessment results to database with proper UUID handling
   */
  async saveAssessmentResults(data: UnifiedAssessmentData): Promise<{ success: boolean; assessmentId?: string; error?: string }> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Prepare assessment results for database
      const assessmentResults = {
        user_id: user.id,
        assessment_type: data.assessmentType,
        results: {
          userProfile: data.userProfile,
          responses: data.responses,
          scores: data.scores,
          dimensions: data.dimensions,
          overallScore: data.overallScore,
          validity: data.validity,
          metadata: {
            ...data.metadata,
            completedAt: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

      const { data: savedResult, error } = await supabase
        .from('assessment_results')
        .insert(assessmentResults)
        .select('id')
        .single();

      if (error) {
        console.error('Database save error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, assessmentId: savedResult.id };
    } catch (error: any) {
      console.error('Assessment save error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate comprehensive report with logo and branding
   */
  async generateAssessmentReport(data: UnifiedAssessmentData): Promise<{ success: boolean; error?: string }> {
    try {
      await generateHtmlReport({
        assessmentType: data.assessmentType,
        userInfo: data.userProfile,
        overallScore: data.overallScore,
        dimensions: data.dimensions,
        organizationName: 'AuthenCore Analytics',
        customBranding: {
          primaryColor: '#2563eb',
          secondaryColor: '#1e293b'
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error('Report generation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate AI-enhanced report if assessment is saved
   */
  async generateAIReport(assessmentId: string, reportType: 'candidate' | 'employer', candidateInfo: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: aiReport, error } = await supabase.functions.invoke('generate-ai-report', {
        body: {
          assessmentResultId: assessmentId,
          reportType,
          candidateInfo
        }
      });

      if (error) {
        console.error('AI report error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('AI report generation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Complete assessment workflow: save → report → AI report
   */
  async processAssessmentComplete(data: UnifiedAssessmentData, generateAI: boolean = false): Promise<{
    success: boolean;
    assessmentId?: string;
    reportGenerated: boolean;
    aiReportGenerated: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    let assessmentId: string | undefined;
    let reportGenerated = false;
    let aiReportGenerated = false;

    // Step 1: Save to database
    const saveResult = await this.saveAssessmentResults(data);
    if (saveResult.success) {
      assessmentId = saveResult.assessmentId;
      // Assessment saved successfully
    } else {
      errors.push(`Database save failed: ${saveResult.error}`);
    }

    // Step 2: Generate standard report (always)
    const reportResult = await this.generateAssessmentReport(data);
    if (reportResult.success) {
      reportGenerated = true;
      // Standard report generated
    } else {
      errors.push(`Report generation failed: ${reportResult.error}`);
    }

    // Step 3: Generate AI report (if requested and assessment saved)
    if (generateAI && assessmentId) {
      const aiResult = await this.generateAIReport(assessmentId, 'candidate', data.userProfile);
      if (aiResult.success) {
        aiReportGenerated = true;
        // AI report generated
      } else {
        errors.push(`AI report failed: ${aiResult.error}`);
      }
    }

    return {
      success: errors.length === 0 || reportGenerated, // Success if at least report generated
      assessmentId,
      reportGenerated,
      aiReportGenerated,
      errors
    };
  }

  /**
   * Validate assessment data before processing
   */
  validateAssessmentData(data: UnifiedAssessmentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.assessmentType) errors.push('Assessment type is required');
    if (!data.userProfile?.name) errors.push('User name is required');
    if (!data.userProfile?.email) errors.push('User email is required');
    if (!data.responses || data.responses.length === 0) errors.push('Assessment responses are required');
    if (typeof data.overallScore !== 'number' || data.overallScore < 0 || data.overallScore > 100) {
      errors.push('Overall score must be a number between 0 and 100');
    }
    if (!data.dimensions || data.dimensions.length === 0) errors.push('Dimension scores are required');

    return { valid: errors.length === 0, errors };
  }
}

export const unifiedAssessmentEngine = UnifiedAssessmentEngine.getInstance();