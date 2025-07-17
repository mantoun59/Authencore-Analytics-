import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import { toast } from "sonner";

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
  distortionAnalysis: {
    score: number;
    reliability: 'low' | 'medium' | 'high';
    consistencyFlags: string[];
    interpretation: string;
  };
  employerSpecific?: {
    summaryTable: any;
    interviewQuestions: {
      clarification: string[];
      validation: string[];
      behavioral: string[];
    };
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

  async generatePDFReport(reportContent: AIReportContent, reportType: 'candidate' | 'employer' = 'candidate'): Promise<void> {
    try {
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
        
        const fileName = `${reportContent.candidateInfo.assessmentType}_Adaptation_Readiness_Report_${reportContent.candidateInfo.name.replace(/\s+/g, '_')}.pdf`;
        doc.save(fileName);
        toast.success('Applicant PDF Report generated successfully!');
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
      throw error;
    }
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
      img.src = '/lovable-uploads/5eb5f31e-5eaa-4d7d-a93c-5c9ebf449b63.png';
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
}

export const aiReportGenerator = AIReportGenerator.getInstance();