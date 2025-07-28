import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
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
    try {
      // Use the new Supabase Edge Function for professional PDF generation
      await this.generateProfessionalPDF(reportContent, reportType);
    } catch (error) {
      AssessmentLogger.error('Error generating PDF report', error);
      // Fallback to jsPDF if edge function fails
      await this.generateFallbackPDF(reportContent, reportType);
    }
  }

  private async generateProfessionalPDF(reportContent: AIReportContent, reportType: 'candidate' | 'employer'): Promise<void> {
    try {
      // Parse scores from the report content
      const scores = this.parseScoresFromContent(reportContent);
      const validity = this.parseValidityFromContent(reportContent);
      const actionPlan = this.parseActionPlanFromContent(reportContent);
      const interviewQuestions = this.parseInterviewQuestionsFromContent(reportContent);
      
      const candidateData = {
        name: reportContent.candidateInfo.name,
        email: reportContent.candidateInfo.email,
        date: new Date().toLocaleDateString(),
        position: 'Position Applied For',
        company: 'Company Name'
      };

      const reportRequest = {
        candidateData,
        scores,
        validity,
        actionPlan,
        interviewQuestions,
        reportType
      };

      const { data, error } = await supabase.functions.invoke('generate-pdf-report', {
        body: reportRequest
      });

      if (error) {
        throw new Error(`PDF generation failed: ${error.message}`);
      }

      // Open the HTML in a new window for preview
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(data);
        newWindow.document.close();
        newWindow.document.title = `${reportType === 'employer' ? 'Employer' : 'Candidate'} Report - ${candidateData.name}`;
      }

      toast.success(`Professional ${reportType} PDF report generated successfully!`);
      
    } catch (error) {
      AssessmentLogger.error('Error with professional PDF generation', error);
      throw error;
    }
  }

  private async generateFallbackPDF(reportContent: AIReportContent, reportType: 'candidate' | 'employer'): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let currentY = margin;

    // Load logo
    const logoBase64 = await this.loadLogoAsBase64();
    
    if (reportType === 'employer') {
      // EMPLOYER REPORT STRUCTURE
      this.addEmployerPDFHeader(doc, reportContent, logoBase64);
      currentY = 75;
      
      // Score Table + Graph
      currentY = this.addEmployerScoreTable(doc, reportContent, currentY);
      
      // Distortion Scale
      currentY = this.addDistortionSection(doc, reportContent, currentY);
      
      // Interview Questions
      if (reportContent.employerSpecific) {
        currentY = this.addEmployerInterviewQuestions(doc, reportContent, currentY);
      }
      
      // Add legal footer before saving
      this.addLegalFooter(doc);
      
      const fileName = `${reportContent.candidateInfo.assessmentType}_Candidate_Report_for_Employers_${reportContent.candidateInfo.name.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
      toast.success('Employer PDF Report generated successfully!');
      
    } else {
      // APPLICANT REPORT STRUCTURE  
      this.addApplicantPDFHeader(doc, reportContent, logoBase64);
      currentY = 75;
      
      // Overview
      currentY = this.addApplicantOverview(doc, reportContent, currentY);
      
      // Score Summary Table
      currentY = this.addApplicantScoreTable(doc, reportContent, currentY);
      
      // Bar Graph
      currentY = this.addDimensionScoresChart(doc, reportContent.detailedAnalysis.dimensionScores, currentY);
      
      // Strengths and Growth sections
      currentY = this.addApplicantStrengthsAndGrowth(doc, reportContent, currentY);
      
      // Action Plan
      this.addApplicantActionPlan(doc, reportContent, currentY);
      
      // Add legal footer before saving
      this.addLegalFooter(doc);
      
      const fileName = `${reportContent.candidateInfo.assessmentType}_Adaptation_Readiness_Report_${reportContent.candidateInfo.name.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
      toast.success('Applicant PDF Report generated successfully!');
    }
  }

  private parseScoresFromContent(reportContent: AIReportContent): Array<{name: string, percentile: number, level: string, description: string}> {
    const scores: Array<{name: string, percentile: number, level: string, description: string}> = [];
    
    // Handle new CareerLaunch assessment structure
    const dimensionScores = reportContent.detailedAnalysis.dimensionScores;
    
    // Process all dimensions including RIASEC, aptitudes, personality, and values
    Object.entries(dimensionScores).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' ? value.score || 0 : value;
      const percentile = Math.min(100, Math.max(0, score));
      
      let level = 'Average';
      if (percentile >= 80) level = 'High';
      else if (percentile >= 60) level = 'Above Average';
      else if (percentile <= 40) level = 'Below Average';
      else if (percentile <= 20) level = 'Low';
      
      const description = this.getDescriptionForDimension(key, level);
      
      scores.push({
        name: this.formatDimensionName(key),
        percentile,
        level,
        description
      });
    });
    
    return scores;
  }

  private formatDimensionName(dimension: string): string {
    // Handle RIASEC dimensions
    const riasecMap: Record<string, string> = {
      'realistic': 'Realistic',
      'investigative': 'Investigative', 
      'artistic': 'Artistic',
      'social': 'Social',
      'enterprising': 'Enterprising',
      'conventional': 'Conventional'
    };
    
    // Handle aptitude dimensions
    const aptitudeMap: Record<string, string> = {
      'numerical': 'Numerical Reasoning',
      'verbal': 'Verbal Reasoning',
      'abstract': 'Abstract Reasoning',
      'memory': 'Memory & Processing'
    };
    
    // Handle personality dimensions
    const personalityMap: Record<string, string> = {
      'introversion': 'Introversion/Extraversion',
      'conscientiousness': 'Conscientiousness',
      'adaptability': 'Adaptability',
      'openness': 'Openness to Experience'
    };
    
    // Handle values dimensions
    const valuesMap: Record<string, string> = {
      'creativity': 'Creativity & Innovation',
      'security': 'Security & Stability',
      'community': 'Community & Impact',
      'achievement': 'Achievement & Growth'
    };
    
    return riasecMap[dimension] || aptitudeMap[dimension] || personalityMap[dimension] || valuesMap[dimension] || 
           dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private parseValidityFromContent(reportContent: AIReportContent): ValidityMetricsDetailed {
    return {
      consistencyScore: reportContent.distortionAnalysis?.score || 85,
      responsePattern: 'Normal',
      flaggedResponses: 0,
      overallValidity: reportContent.distortionAnalysis?.reliability === 'high' ? 'Valid' : 
                      reportContent.distortionAnalysis?.reliability === 'medium' ? 'Questionable' : 'Invalid',
      fakeGoodScore: reportContent.distortionAnalysis?.score || 2,
      fakeBadScore: 1,
      randomResponseScore: 0,
      inconsistencyScore: reportContent.distortionAnalysis?.reliability === 'low' ? 3 : 1,
      responseTimeProfile: 'Normal'
    };
  }

  private parseActionPlanFromContent(reportContent: AIReportContent): string[] {
    const actions: string[] = [];
    
    if (reportContent.actionPlan?.immediate) {
      actions.push(...reportContent.actionPlan.immediate);
    }
    if (reportContent.actionPlan?.shortTerm) {
      actions.push(...reportContent.actionPlan.shortTerm.slice(0, 2));
    }
    if (reportContent.executiveSummary?.recommendedActions) {
      actions.push(...reportContent.executiveSummary.recommendedActions.slice(0, 2));
    }
    
    return actions.length > 0 ? actions : [
      'Develop time management skills through structured planning',
      'Practice active listening in team meetings',
      'Seek feedback regularly to improve performance'
    ];
  }

  private parseInterviewQuestionsFromContent(reportContent: AIReportContent): string[] {
    if (reportContent.employerSpecific?.interviewQuestions) {
      const questions: string[] = [];
      
      if (reportContent.employerSpecific.interviewQuestions.behavioral) {
        questions.push(...reportContent.employerSpecific.interviewQuestions.behavioral.slice(0, 2));
      }
      if (reportContent.employerSpecific.interviewQuestions.clarification) {
        questions.push(...reportContent.employerSpecific.interviewQuestions.clarification.slice(0, 2));
      }
      
      return questions;
    }
    
    return [
      'Describe a situation where you had to manage multiple competing priorities.',
      'Tell me about a time when you had to work with a difficult team member.',
      'How do you handle stress and pressure in the workplace?',
      'Give an example of when you had to adapt to significant change.'
    ];
  }

  private getDescriptionForDimension(dimension: string, level: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      conscientiousness: {
        'High': 'Highly organized, disciplined, and goal-oriented with strong attention to detail.',
        'Above Average': 'Generally organized and reliable with good follow-through on commitments.',
        'Average': 'Moderately organized with balanced approach to planning and spontaneity.',
        'Below Average': 'Tends to be more flexible and spontaneous, may struggle with detailed planning.',
        'Low': 'Prefers flexibility and may find rigid structure constraining.'
      },
      agreeableness: {
        'High': 'Very cooperative, empathetic, and focused on maintaining harmony in relationships.',
        'Above Average': 'Generally cooperative and considerate of others\' needs and feelings.',
        'Average': 'Balanced approach between cooperation and assertiveness.',
        'Below Average': 'More direct and competitive, may prioritize results over relationships.',
        'Low': 'Highly competitive and direct, focuses on outcomes over consensus.'
      },
      innovation: {
        'High': 'Highly creative, enjoys exploring new ideas and approaches to problem-solving.',
        'Above Average': 'Open to new ideas and comfortable with change and innovation.',
        'Average': 'Moderately open to new approaches while valuing proven methods.',
        'Below Average': 'Prefers established methods and may be cautious about new approaches.',
        'Low': 'Strongly prefers traditional and proven approaches to work and problem-solving.'
      }
    };
    
    const key = dimension.toLowerCase().replace(/\s+/g, '');
    return descriptions[key]?.[level] || `${level} level in ${dimension.replace(/_/g, ' ')}.`;
  }

  private addEmployerPDFHeader(doc: jsPDF, reportContent: AIReportContent, logoBase64?: string) {
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 5, 10, 52, 40);
      } catch (error) {
        this.addLogoPlaceholder(doc, 5);
      }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${reportContent.candidateInfo.assessmentType.toUpperCase()} CANDIDATE REPORT FOR EMPLOYERS`, 60, 25);
    
    doc.setFontSize(12);
    doc.text(`Candidate: ${reportContent.candidateInfo.name} | Date: ${new Date().toLocaleDateString()}`, 60, 45);
  }

  private addApplicantPDFHeader(doc: jsPDF, reportContent: AIReportContent, logoBase64?: string) {
    const pageWidth = doc.internal.pageSize.width;
    
    // Header  
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 5, 10, 52, 40);
      } catch (error) {
        this.addLogoPlaceholder(doc, 5);
      }
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${reportContent.candidateInfo.assessmentType.toUpperCase()} ADAPTATION READINESS REPORT`, 60, 25);
    
    doc.setFontSize(12);
    doc.text(`Name: ${reportContent.candidateInfo.name} | Date: ${new Date().toLocaleDateString()}`, 60, 45);
  }

  private addEmployerScoreTable(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('SCORE TABLE + GRAPH', margin, yPosition);
    yPosition += 20;
    
    // Add dimension scores chart
    this.addDimensionScoresChart(doc, reportContent.detailedAnalysis.dimensionScores, yPosition);
    
    return yPosition + 120;
  }

  private addApplicantScoreTable(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('SCORE SUMMARY TABLE', margin, yPosition);
    yPosition += 20;
    
    // Simple score table
    Object.entries(reportContent.detailedAnalysis.dimensionScores).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' ? value.score || 0 : value;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${key.replace(/_/g, ' ')}: ${score}`, margin, yPosition);
      yPosition += 12;
    });
    
    return yPosition + 10;
  }

  private addDistortionSection(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('DISTORTION SCALE SCORE', margin, yPosition);
    yPosition += 20;
    
    const reliability = reportContent.distortionAnalysis.reliability;
    const reliabilityText = reliability === 'high' ? 'Low' : reliability === 'medium' ? 'Mild inconsistency' : 'Caution — validate with interview';
    
    doc.setFontSize(12);
    doc.text(`Reliability: ${reliabilityText}`, margin, yPosition);
    yPosition += 15;
    doc.text(`Score: ${reportContent.distortionAnalysis.score}`, margin, yPosition);
    
    return yPosition + 20;
  }

  private addEmployerInterviewQuestions(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('SUGGESTED INTERVIEW QUESTIONS', margin, yPosition);
    yPosition += 20;
    
    if (reportContent.employerSpecific?.interviewQuestions.behavioral) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      reportContent.employerSpecific.interviewQuestions.behavioral.slice(0, 3).forEach((q, index) => {
        doc.text(`${index + 1}. ${q}`, margin, yPosition);
        yPosition += 15;
      });
    }
    
    return yPosition;
  }

  private addApplicantOverview(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('OVERVIEW', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Purpose: This assessment evaluates your capacity to adapt and thrive in changing environments.', margin, yPosition);
    
    return yPosition + 25;
  }

  private addApplicantStrengthsAndGrowth(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    // Strengths
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('YOUR STRENGTHS', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.executiveSummary.topStrengths.slice(0, 3).forEach((strength, index) => {
      doc.text(`${index + 1}. ${strength}`, margin, yPosition);
      yPosition += 12;
    });
    
    yPosition += 10;
    
    // Growth Opportunities
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(251, 146, 60);
    doc.text('GROWTH OPPORTUNITIES', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.executiveSummary.developmentAreas.slice(0, 3).forEach((area, index) => {
      doc.text(`${index + 1}. ${area}`, margin, yPosition);
      yPosition += 12;
    });
    
    return yPosition + 15;
  }

  private addApplicantActionPlan(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    let yPosition = startY;
    const margin = 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('YOUR ACTION PLAN', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.immediate.slice(0, 3).forEach((action, index) => {
      doc.text(`${index + 1}. ${action}`, margin, yPosition);
      yPosition += 12;
    });
    
    return yPosition;
  }

  private addDimensionScoresChart(doc: jsPDF, dimensionScores: Record<string, any>, yPosition: number): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    
    // Chart title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Dimension Score Breakdown:', margin, yPosition);
    yPosition += 15;

    // Draw bars for each dimension
    Object.entries(dimensionScores).forEach(([key, value]: [string, any], index) => {
      const score = typeof value === 'object' ? value.score || 0 : value;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(label, margin, yPosition);
      
      // Bar background
      const barWidth = 120;
      const barHeight = 8;
      doc.setFillColor(229, 231, 235);
      doc.rect(margin + 80, yPosition - 6, barWidth, barHeight, 'F');
      
      // Bar fill
      const fillWidth = (score / 100) * barWidth;
      const color = score >= 80 ? [34, 197, 94] : score >= 60 ? [251, 146, 60] : [239, 68, 68];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin + 80, yPosition - 6, fillWidth, barHeight, 'F');
      
      // Score text
      doc.setTextColor(15, 23, 42);
      doc.text(`${score}`, margin + 210, yPosition);
      
      yPosition += 12;
    });

    return yPosition + 10;
  }

  private loadLogoAsBase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load logo image'));
      
      // Try to get logo from LogoContext first, then fallback to static paths
      try {
        import('../assets/final-logo.png').then(module => {
          img.src = module.default;
        }).catch(() => {
          // Fallback to public path
          img.src = './src/assets/final-logo.png';
        });
      } catch {
        // Final fallback
        img.src = './src/assets/final-logo.png';
      }
    });
  }

  private addLogoPlaceholder(doc: jsPDF, margin: number) {
    // Create a professional logo placeholder
    doc.setFillColor(59, 130, 246); // Blue brand color
    doc.circle(margin + 17.5, 27.5, 15, 'F');
    
    // Add inner circle
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 17.5, 27.5, 10, 'F');
    
    // Add "AC" text
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AC', margin + 13, 30);
  }

  private addLegalFooter(doc: jsPDF): void {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const footerY = pageHeight - 40;

    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

    // Add legal notices
    const legalLines = formatPDFLegalFooter();
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    let currentY = footerY;
    legalLines.forEach((line, index) => {
      if (line.trim()) {
        if (index === 0 || index === 1) {
          // Copyright and trademark - make them bold
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        
        if (line.length > 80) {
          // Wrap long lines
          const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin);
          wrappedLines.forEach((wrappedLine: string) => {
            doc.text(wrappedLine, margin, currentY);
            currentY += 8;
          });
        } else {
          doc.text(line, margin, currentY);
          currentY += 8;
        }
      } else {
        currentY += 4; // Empty line spacing
      }
    });
  }
}

export const aiReportGenerator = AIReportGenerator.getInstance();