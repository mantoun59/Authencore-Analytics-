import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { toast } from "sonner";

Chart.register(...registerables);

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
    validityMetrics: any;
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
  employerSpecific?: {
    distortionScale: any;
    interviewQuestions: any;
    riskAssessment: any;
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

      // Call the edge function to generate AI report
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

      toast.success('AI Report generated successfully!');
      return data.reportContent;

    } catch (error) {
      console.error('Error generating AI report:', error);
      toast.error('Failed to generate AI report');
      throw error;
    }
  }

  async generatePDFReport(reportContent: AIReportContent): Promise<void> {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Helper function to add page break if needed
      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      };

      // Helper function to add wrapped text
      const addWrappedText = (text: string, fontSize: number, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        
        const maxWidth = pageWidth - 2 * margin;
        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.35;
        
        checkPageBreak(lines.length * lineHeight + 10);
        
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + 10;
      };

      // Header
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('AI-POWERED ASSESSMENT REPORT', pageWidth / 2, 25, { align: 'center' });
      
      yPosition = 50;
      doc.setTextColor(0, 0, 0);

      // Candidate Information
      addWrappedText('CANDIDATE INFORMATION', 16, true);
      addWrappedText(`Name: ${reportContent.candidateInfo.name}`, 12);
      addWrappedText(`Email: ${reportContent.candidateInfo.email}`, 12);
      addWrappedText(`Assessment Type: ${reportContent.candidateInfo.assessmentType}`, 12);
      addWrappedText(`Completion Date: ${new Date(reportContent.candidateInfo.completionDate).toLocaleDateString()}`, 12);
      addWrappedText(`Assessment ID: ${reportContent.candidateInfo.assessmentId}`, 12);

      yPosition += 10;

      // Executive Summary
      addWrappedText('EXECUTIVE SUMMARY', 16, true);
      
      // Overall Score visual
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Overall Score:', margin, yPosition);
      doc.setFontSize(24);
      doc.setTextColor(52, 152, 219);
      doc.text(`${reportContent.executiveSummary.overallScore}/100`, margin + 50, yPosition);
      yPosition += 20;
      
      // Progress bar
      doc.setFillColor(52, 152, 219);
      doc.rect(margin, yPosition, (reportContent.executiveSummary.overallScore / 100) * (pageWidth - 2 * margin), 6, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 6);
      yPosition += 20;
      
      doc.setTextColor(0, 0, 0);

      // Key Insights
      addWrappedText('Key Insights:', 14, true);
      reportContent.executiveSummary.keyInsights.forEach((insight, index) => {
        addWrappedText(`• ${insight}`, 11);
      });

      // Top Strengths
      addWrappedText('Top Strengths:', 14, true);
      reportContent.executiveSummary.topStrengths.forEach((strength, index) => {
        addWrappedText(`✓ ${strength}`, 11);
      });

      // Development Areas
      addWrappedText('Development Areas:', 14, true);
      reportContent.executiveSummary.developmentAreas.forEach((area, index) => {
        addWrappedText(`◦ ${area}`, 11);
      });

      // New page for detailed analysis
      doc.addPage();
      yPosition = margin;

      // Detailed Analysis
      addWrappedText('DETAILED ANALYSIS', 16, true);
      
      // Dimension Scores
      addWrappedText('Dimension Scores:', 14, true);
      if (reportContent.detailedAnalysis.dimensionScores) {
        Object.entries(reportContent.detailedAnalysis.dimensionScores).forEach(([key, value]) => {
          const score = typeof value === 'object' && value !== null ? (value as any).score || 0 : value;
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          addWrappedText(`${label}: ${score}/100`, 11);
        });
      }

      // Personalized Insights
      addWrappedText('Personalized Insights:', 14, true);
      addWrappedText(reportContent.detailedAnalysis.personalizedInsights, 11);

      // Behavioral Patterns
      addWrappedText('Behavioral Patterns:', 14, true);
      reportContent.detailedAnalysis.behavioralPatterns.forEach((pattern, index) => {
        addWrappedText(`• ${pattern}`, 11);
      });

      // Action Plan
      doc.addPage();
      yPosition = margin;
      
      addWrappedText('ACTION PLAN', 16, true);
      
      // Immediate Actions
      addWrappedText('Immediate Actions (Next 30 Days):', 14, true);
      reportContent.actionPlan.immediate.forEach((action, index) => {
        addWrappedText(`${index + 1}. ${action}`, 11);
      });

      // Short-term Actions
      addWrappedText('Short-term Actions (3-6 Months):', 14, true);
      reportContent.actionPlan.shortTerm.forEach((action, index) => {
        addWrappedText(`${index + 1}. ${action}`, 11);
      });

      // Long-term Actions
      addWrappedText('Long-term Actions (6-18 Months):', 14, true);
      reportContent.actionPlan.longTerm.forEach((action, index) => {
        addWrappedText(`${index + 1}. ${action}`, 11);
      });

      // Career Guidance
      checkPageBreak(80);
      addWrappedText('CAREER GUIDANCE', 16, true);
      
      addWrappedText('Career Recommendations:', 14, true);
      reportContent.careerGuidance.recommendations.forEach((rec, index) => {
        addWrappedText(`• ${rec}`, 11);
      });

      addWrappedText('Career Pathways:', 14, true);
      reportContent.careerGuidance.pathways.forEach((pathway, index) => {
        addWrappedText(`• ${pathway}`, 11);
      });

      addWrappedText('Skills to Acquire:', 14, true);
      reportContent.careerGuidance.skills.forEach((skill, index) => {
        addWrappedText(`• ${skill}`, 11);
      });

      // Employer-specific section
      if (reportContent.employerSpecific) {
        doc.addPage();
        yPosition = margin;

        // Employer header
        doc.setFillColor(231, 76, 60);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('EMPLOYER ASSESSMENT REPORT', pageWidth / 2, 25, { align: 'center' });
        
        yPosition = 50;
        doc.setTextColor(0, 0, 0);

        // Distortion Scale
        addWrappedText('DISTORTION SCALE ANALYSIS', 16, true);
        
        const distortion = reportContent.employerSpecific.distortionScale;
        addWrappedText(`Validity Index: ${distortion.validityIndex}/100`, 14, true);
        
        addWrappedText(`Social Desirability: ${distortion.socialDesirability.score}/100`, 12);
        addWrappedText(distortion.socialDesirability.interpretation, 11);
        
        addWrappedText(`Response Consistency: ${distortion.responseConsistency.score}/100`, 12);
        addWrappedText(distortion.responseConsistency.interpretation, 11);
        
        addWrappedText(`Extreme Responding: ${distortion.extremeResponding.score}/100`, 12);
        addWrappedText(distortion.extremeResponding.interpretation, 11);

        // Risk Assessment
        addWrappedText('RISK ASSESSMENT', 16, true);
        const risk = reportContent.employerSpecific.riskAssessment;
        addWrappedText(`Hiring Risk: ${risk.hiringRisk}`, 12);
        addWrappedText(`Success Probability: ${risk.successProbability}%`, 12);
        addWrappedText(`Retention Risk: ${risk.retentionRisk}`, 12);
        addWrappedText(`Ramp-up Time: ${risk.rampUpTime}`, 12);

        // Interview Questions
        addWrappedText('INTERVIEW QUESTIONS', 16, true);
        const questions = reportContent.employerSpecific.interviewQuestions;
        
        if (questions.behavioralQuestions) {
          addWrappedText('Behavioral Questions:', 14, true);
          questions.behavioralQuestions.forEach((q: string, index: number) => {
            addWrappedText(`${index + 1}. ${q}`, 11);
          });
        }

        if (questions.situationalQuestions) {
          addWrappedText('Situational Questions:', 14, true);
          questions.situationalQuestions.forEach((q: string, index: number) => {
            addWrappedText(`${index + 1}. ${q}`, 11);
          });
        }

        // Hiring Recommendations
        addWrappedText('HIRING RECOMMENDATIONS', 16, true);
        reportContent.employerSpecific.hiringRecommendations.forEach((rec, index) => {
          addWrappedText(`• ${rec}`, 11);
        });

        // Onboarding Plan
        addWrappedText('ONBOARDING PLAN', 16, true);
        reportContent.employerSpecific.onboardingPlan.forEach((step, index) => {
          addWrappedText(`${index + 1}. ${step}`, 11);
        });
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.text('Generated by Authencore Analytics', margin, pageHeight - 10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      // Save the PDF
      const fileName = `AI_${reportContent.candidateInfo.name.replace(/\s+/g, '_')}_${reportContent.candidateInfo.assessmentType}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('AI-powered PDF Report downloaded successfully!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
      throw error;
    }
  }

  private async addDimensionScoresChart(doc: jsPDF, dimensionScores: Record<string, any>, yPosition: number) {
    try {
      // Simplified chart representation using text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Dimension Scores Overview', 30, yPosition);
      
      let textY = yPosition + 20;
      Object.entries(dimensionScores).forEach(([key, value]: [string, any]) => {
        const score = typeof value === 'object' && value !== null ? value.score || 0 : value;
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Draw a simple bar representation
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`${label}:`, 30, textY);
        doc.text(`${score}/100`, 120, textY);
        
        // Draw a simple progress bar
        doc.setDrawColor(200, 200, 200);
        doc.rect(30, textY + 2, 80, 4);
        doc.setFillColor(52, 152, 219);
        doc.rect(30, textY + 2, (score / 100) * 80, 4, 'F');
        
        textY += 15;
      });
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
    }
  }
}

// Export singleton instance
export const aiReportGenerator = AIReportGenerator.getInstance();