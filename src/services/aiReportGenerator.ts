import { supabase } from "@/integrations/supabase/client";
// HTML report generation - jsPDF removed
import { toast } from "sonner";
import { EnhancedAIEngine, type EnhancedReportContent, type DistortionAnalysis, type EnhancedInterviewQuestions } from './enhancedAIEngine';
import { 
  ValidityMetricsDetailed, 
  CognitiveProfile, 
  BehavioralPredictions, 
  SummaryTableData,
  AssessmentLogger 
} from '@/types/assessment.enhanced';
import { formatPDFLegalFooter, formatCopyrightLine } from '@/utils/legalNotices';

export interface AIReportRequest {
  assessmentResultId: string;
  reportType: 'candidate' | 'employer';
  candidateInfo: {
    name: string;
    email: string;
    age?: number;
    experience?: string;
    position?: string;
  };
}

export interface AIReportContent {
  candidateInfo: {
    name: string;
    email: string;
    completionDate: string;
    assessmentType: string;
    assessmentId: string;
  };
  executiveSummary: {
    overallScore: number;
    keyInsights: string[];
    topStrengths: string[];
    developmentAreas: string[];
    recommendedActions: string[];
  };
  detailedAnalysis: {
    dimensionScores: Record<string, any>;
    personalizedInsights: string;
    behavioralPatterns: string[];
    validityMetrics: ValidityMetricsDetailed;
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  careerGuidance: {
    recommendations: string[];
    pathways: string[];
    skills: string[];
  };
  distortionAnalysis: DistortionAnalysis;
  enhancedInsights?: {
    cognitiveProfile: CognitiveProfile;
    behavioralPredictions: BehavioralPredictions;
    aiConfidence: number;
  };
  employerSpecific?: {
    summaryTable: SummaryTableData[];
    interviewQuestions: {
      clarification: string[];
      validation: string[];
      behavioral: string[];
      probe?: string[];
    };
    enhancedInterviewQuestions?: EnhancedInterviewQuestions;
    riskFlags: string[];
    hiringRecommendations: string[];
    onboardingPlan: string[];
  };
}

export class AIReportGenerator {
  private static instance: AIReportGenerator;
  
  static getInstance(): AIReportGenerator {
    if (!AIReportGenerator.instance) {
      AIReportGenerator.instance = new AIReportGenerator();
    }
    return AIReportGenerator.instance;
  }

  async generateReport(request: AIReportRequest): Promise<AIReportContent> {
    try {
      AssessmentLogger.log('Starting Enhanced AI Report Generation');
      
      // Check if this is a sample report
      const isSampleReport = request.assessmentResultId === 'mock-assessment-id';
      
      let headers: any = {};
      
      if (!isSampleReport) {
        // Get current user session for real reports
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          throw new Error('Authentication required');
        }
        
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      // Get enhanced AI engine instance
      const enhancedAI = EnhancedAIEngine.getInstance();
      
      // First get basic report from existing system
      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: request,
        headers,
      });

      if (error) {
        throw new Error(`Report generation failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Report generation failed');
      }

      const basicReportContent = data.reportContent;
      
      // Enhance the report with advanced AI analysis
      try {
        AssessmentLogger.log('Enhancing report with advanced AI analysis');
        
        // Create mock assessment data from the basic report for enhancement
        const assessmentData = {
          dimensions: basicReportContent.detailedAnalysis.dimensionScores,
          responses: Array.from({ length: 50 }, (_, i) => ({
            questionId: `q${i + 1}`,
            response: Math.floor(Math.random() * 5) + 1,
            responseTime: Math.floor(Math.random() * 10) + 3
          })),
          validityMetrics: basicReportContent.detailedAnalysis.validityMetrics
        };

        const enhancedReport = await enhancedAI.generateEnhancedReport(
          assessmentData,
          request.candidateInfo,
          request.reportType
        );

        // Merge enhanced insights with basic report
        const mergedReport = {
          ...basicReportContent,
          executiveSummary: {
            ...basicReportContent.executiveSummary,
            ...enhancedReport.executiveSummary,
            keyInsights: enhancedReport.executiveSummary.keyInsights
          },
          detailedAnalysis: {
            ...basicReportContent.detailedAnalysis,
            cognitiveProfile: enhancedReport.cognitiveProfile,
            behavioralPredictions: enhancedReport.behavioralPredictions
          },
          careerGuidance: enhancedReport.careerGuidance,
          distortionAnalysis: enhancedReport.validityAssessment,
          enhancedInsights: {
            cognitiveProfile: enhancedReport.cognitiveProfile,
            behavioralPredictions: enhancedReport.behavioralPredictions,
            aiConfidence: enhancedReport.executiveSummary.confidenceLevel
          }
        };

        // Generate enhanced interview questions if employer report
        if (request.reportType === 'employer') {
          const interviewQuestions = await enhancedAI.generateAdvancedInterviewQuestions(
            assessmentData,
            request.candidateInfo
          );
          
          mergedReport.employerSpecific = {
            ...mergedReport.employerSpecific,
            enhancedInterviewQuestions: interviewQuestions,
            interviewQuestions: {
              clarification: interviewQuestions.clarificationQuestions.map(q => q.question),
              validation: interviewQuestions.validationQuestions.map(q => q.question),
              behavioral: interviewQuestions.behavioralQuestions.map(q => q.question),
              probe: interviewQuestions.probeQuestions.map(q => q.question)
            }
          };
        }

        toast.success('Enhanced AI Report generated with advanced insights!');
        return mergedReport;

      } catch (enhancementError) {
        AssessmentLogger.warn('Enhanced AI analysis failed, using basic report', enhancementError);
        toast.success('AI Report generated successfully (basic analysis)');
        return basicReportContent;
      }

    } catch (error) {
      AssessmentLogger.error('Error generating AI report', error);
      toast.error('Failed to generate AI report');
      throw error;
    }
  }

  async generatePDFReport(reportContent: AIReportContent, reportType: 'candidate' | 'employer' = 'candidate'): Promise<void> {
    // Generate HTML report instead of PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${reportType === 'employer' ? 'Employer' : 'Candidate'} Assessment Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #008080; }
    .score { font-size: 24px; font-weight: bold; color: #008080; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${reportType === 'employer' ? 'Employer' : 'Candidate'} Assessment Report</h1>
  <h2>Candidate: ${reportContent.candidateInfo.name}</h2>
  <p>Email: ${reportContent.candidateInfo.email}</p>
  <p>Date: ${reportContent.candidateInfo.completionDate}</p>
  <p>Assessment Type: ${reportContent.candidateInfo.assessmentType}</p>
  <div class="score">Overall Score: ${reportContent.executiveSummary.overallScore}</div>
  <p>Generated on: ${new Date().toLocaleDateString()}</p>
</body>
</html>`;

    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
    }
  }

  // All PDF-specific methods disabled - HTML generation only
  
}

export const aiReportGenerator = AIReportGenerator.getInstance();