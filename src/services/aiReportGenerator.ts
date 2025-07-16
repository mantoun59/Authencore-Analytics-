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

      // Load logo image first
      const logoBase64 = await this.loadLogoAsBase64();
      
      // Add professional header with branding
      this.addProfessionalHeader(doc, reportContent.candidateInfo.assessmentType, logoBase64);
      yPosition = 70;

      // Executive Summary Section
      this.addExecutiveSummary(doc, reportContent);
      
      // Detailed Analysis Section
      doc.addPage();
      this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
      this.addDetailedAnalysis(doc, reportContent);

      // Behavioral Insights Section
      doc.addPage();
      this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
      this.addBehavioralInsights(doc, reportContent);

      // Action Plan Section
      doc.addPage();
      this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
      this.addActionPlan(doc, reportContent);

      // Career Guidance Section
      doc.addPage();
      this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
      this.addCareerGuidance(doc, reportContent);

      // Employer-specific section
      if (reportContent.employerSpecific) {
        doc.addPage();
        this.addEmployerSection(doc, reportContent);
      }

      // Add final footer with copyright
      this.addFinalFooter(doc);

      // Save the PDF
      const fileName = `Authencore_AI_${reportContent.candidateInfo.name.replace(/\s+/g, '_')}_${reportContent.candidateInfo.assessmentType}_Professional_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('Professional AI Report generated successfully!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
      throw error;
    }
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

  private addProfessionalHeader(doc: jsPDF, assessmentType: string, logoBase64?: string) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Professional gradient header
    doc.setFillColor(15, 23, 42); // Dark blue-gray
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Add company logo - white background for logo
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, 10, 35, 35, 'F');
    
    // Add the actual logo image if available
    if (logoBase64) {
      try {
        // Use the actual logo image
        doc.addImage(logoBase64, 'PNG', margin + 2, 12, 31, 31);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
        // Fallback to placeholder
        this.addLogoPlaceholder(doc, margin);
      }
    } else {
      // Fallback to placeholder
      this.addLogoPlaceholder(doc, margin);
    }
    
    // Company name and tagline
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHENCORE ANALYTICS', margin + 40, 22);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Measuring Minds. Shaping Futures.', margin + 40, 32);
    
    // Assessment type
    doc.setTextColor(96, 165, 250); // Light blue
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    const assessmentTitle = assessmentType.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
    doc.text(`${assessmentTitle} ASSESSMENT REPORT`, margin + 40, 45);
    
    // Professional report badge
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(pageWidth - 80, 10, 60, 15, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('AI-POWERED', pageWidth - 75, 20);
    
    doc.setFillColor(239, 68, 68); // Red
    doc.rect(pageWidth - 80, 27, 60, 15, 'F');
    doc.text('PROFESSIONAL', pageWidth - 78, 37);
  }

  private addHeaderFooter(doc: jsPDF, assessmentType: string) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    
    // Header
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.line(0, 35, pageWidth, 35);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHENCORE ANALYTICS', margin, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`${assessmentType.toUpperCase()} ASSESSMENT`, pageWidth - margin, 25, { align: 'right' });
    
    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.text('© 2024 Authencore Analytics. All rights reserved. | Measuring Minds. Shaping Futures.', margin, pageHeight - 15);
    doc.text('www.authencore.org', pageWidth - margin, pageHeight - 15, { align: 'right' });
  }

  private addExecutiveSummary(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 80;

    // Executive Summary Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE SUMMARY', margin, yPosition);
    yPosition += 20;

    // Overall Score with visual representation
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Assessment Score:', margin, yPosition);
    doc.setFontSize(32);
    doc.setTextColor(59, 130, 246);
    doc.text(`${reportContent.executiveSummary.overallScore}/100`, margin + 80, yPosition);
    yPosition += 20;

    // Progress bar
    doc.setFillColor(59, 130, 246);
    doc.rect(margin, yPosition, (reportContent.executiveSummary.overallScore / 100) * 120, 8, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.rect(margin, yPosition, 120, 8);
    yPosition += 25;

    // Key Insights
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Professional Insights:', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    reportContent.executiveSummary.keyInsights.forEach((insight, index) => {
      const lines = doc.splitTextToSize(`• ${insight}`, pageWidth - 2 * margin);
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 5 + 5;
    });

    yPosition += 10;

    // Two-column layout for strengths and development areas
    const colWidth = (pageWidth - 3 * margin) / 2;
    let leftY = yPosition;
    let rightY = yPosition;

    // Top Strengths (Left Column)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green
    doc.text('Core Strengths', margin, leftY);
    leftY += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.executiveSummary.topStrengths.forEach((strength, index) => {
      const lines = doc.splitTextToSize(`✓ ${strength}`, colWidth);
      doc.text(lines, margin, leftY);
      leftY += lines.length * 5 + 3;
    });

    // Development Areas (Right Column)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68); // Red
    doc.text('Development Opportunities', margin + colWidth + 10, rightY);
    rightY += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.executiveSummary.developmentAreas.forEach((area, index) => {
      const lines = doc.splitTextToSize(`◦ ${area}`, colWidth);
      doc.text(lines, margin + colWidth + 10, rightY);
      rightY += lines.length * 5 + 3;
    });
  }

  private addDetailedAnalysis(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILED PSYCHOLOGICAL ANALYSIS', margin, yPosition);
    yPosition += 30;

    // Dimension Scores Chart
    this.addDimensionScoresChart(doc, reportContent.detailedAnalysis.dimensionScores, yPosition);
    yPosition += 120;

    // Personalized Insights
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Personalized Professional Insights:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const insightLines = doc.splitTextToSize(reportContent.detailedAnalysis.personalizedInsights, pageWidth - 2 * margin);
    doc.text(insightLines, margin, yPosition);
    yPosition += insightLines.length * 5 + 15;

    // Behavioral Patterns
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Behavioral Patterns & Workplace Implications:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    reportContent.detailedAnalysis.behavioralPatterns.forEach((pattern, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${pattern}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });
  }

  private addBehavioralInsights(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BEHAVIORAL INSIGHTS & WORKPLACE DYNAMICS', margin, yPosition);
    yPosition += 30;

    // Communication Style
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Communication Style Analysis:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('• Preferred communication channels and effectiveness', margin, yPosition);
    yPosition += 10;
    doc.text('• Influence tactics and persuasion style', margin, yPosition);
    yPosition += 10;
    doc.text('• Conflict resolution approach and negotiation style', margin, yPosition);
    yPosition += 20;

    // Leadership Potential
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Leadership Potential Assessment:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('• Natural leadership tendencies and influence capacity', margin, yPosition);
    yPosition += 10;
    doc.text('• Team dynamics and collaboration effectiveness', margin, yPosition);
    yPosition += 10;
    doc.text('• Decision-making style under pressure', margin, yPosition);
    yPosition += 20;

    // Motivation & Engagement
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Motivation & Engagement Drivers:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('• Primary motivational factors and engagement triggers', margin, yPosition);
    yPosition += 10;
    doc.text('• Work environment preferences and productivity factors', margin, yPosition);
    yPosition += 10;
    doc.text('• Recognition and reward responsiveness', margin, yPosition);
  }

  private addActionPlan(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PERSONALIZED DEVELOPMENT ACTION PLAN', margin, yPosition);
    yPosition += 30;

    // Immediate Actions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68); // Red for urgency
    doc.text('Immediate Actions (Next 30 Days):', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.immediate.forEach((action, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${action}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });

    yPosition += 10;

    // Short-term Actions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(251, 146, 60); // Orange
    doc.text('Short-term Development (3-6 Months):', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.shortTerm.forEach((action, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${action}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });

    yPosition += 10;

    // Long-term Actions
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Green
    doc.text('Long-term Strategic Development (6-18 Months):', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.longTerm.forEach((action, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${action}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });
  }

  private addCareerGuidance(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CAREER OPTIMIZATION & STRATEGIC GUIDANCE', margin, yPosition);
    yPosition += 30;

    // Career Recommendations
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Career Paths:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    reportContent.careerGuidance.recommendations.forEach((rec, index) => {
      const lines = doc.splitTextToSize(`• ${rec}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });

    yPosition += 10;

    // Career Pathways
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Strategic Career Pathways:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    reportContent.careerGuidance.pathways.forEach((pathway, index) => {
      const lines = doc.splitTextToSize(`→ ${pathway}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });

    yPosition += 10;

    // Skills to Acquire
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Priority Skills for Acquisition:', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    reportContent.careerGuidance.skills.forEach((skill, index) => {
      const lines = doc.splitTextToSize(`▸ ${skill}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 5 + 8;
    });
  }

  private addEmployerSection(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 50;

    // Employer header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYER ASSESSMENT REPORT', pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Comprehensive Hiring Decision Support', pageWidth / 2, 40, { align: 'center' });

    yPosition = 80;
    doc.setTextColor(15, 23, 42);

    if (reportContent.employerSpecific) {
      // Risk Assessment
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('HIRING RISK ASSESSMENT', margin, yPosition);
      yPosition += 20;

      const risk = reportContent.employerSpecific.riskAssessment;
      doc.setFontSize(12);
      doc.text(`Hiring Risk Level: ${risk.hiringRisk}`, margin, yPosition);
      yPosition += 15;
      doc.text(`Success Probability: ${risk.successProbability}%`, margin, yPosition);
      yPosition += 15;
      doc.text(`Retention Risk: ${risk.retentionRisk}`, margin, yPosition);
      yPosition += 15;
      doc.text(`Expected Ramp-up Time: ${risk.rampUpTime}`, margin, yPosition);
      yPosition += 25;

      // Interview Questions
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('TARGETED INTERVIEW QUESTIONS', margin, yPosition);
      yPosition += 20;

      const questions = reportContent.employerSpecific.interviewQuestions;
      
      if (questions.behavioralQuestions) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Behavioral Questions:', margin, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        questions.behavioralQuestions.forEach((q: string, index: number) => {
          const lines = doc.splitTextToSize(`${index + 1}. ${q}`, pageWidth - 2 * margin);
          doc.text(lines, margin, yPosition);
          yPosition += lines.length * 5 + 8;
        });
      }

      // Hiring Recommendations
      if (yPosition > 200) {
        doc.addPage();
        this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
        yPosition = 50;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('HIRING RECOMMENDATIONS', margin, yPosition);
      yPosition += 20;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      reportContent.employerSpecific.hiringRecommendations.forEach((rec, index) => {
        const lines = doc.splitTextToSize(`• ${rec}`, pageWidth - 2 * margin);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 5 + 8;
      });
    }
  }

  private addFinalFooter(doc: jsPDF) {
    const totalPages = doc.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Page number
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
      
      // Copyright and generation info
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    }
  }

  private addDimensionScoresChart(doc: jsPDF, dimensionScores: Record<string, any>, yPosition: number) {
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    
    // Chart title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Competency Dimension Scores', margin, yPosition);
    yPosition += 20;

    // Create visual chart
    Object.entries(dimensionScores).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' && value !== null ? value.score || 0 : value;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Label
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(label, margin, yPosition);
      
      // Score
      doc.setFont('helvetica', 'bold');
      doc.text(`${score}/100`, margin + 100, yPosition);
      
      // Visual bar
      const barWidth = 80;
      const barHeight = 6;
      
      // Background bar
      doc.setFillColor(229, 231, 235);
      doc.rect(margin + 120, yPosition - 4, barWidth, barHeight, 'F');
      
      // Score bar with color coding
      let barColor = [239, 68, 68]; // Red for low scores
      if (score >= 70) barColor = [34, 197, 94]; // Green for high scores
      else if (score >= 50) barColor = [251, 146, 60]; // Orange for medium scores
      
      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.rect(margin + 120, yPosition - 4, (score / 100) * barWidth, barHeight, 'F');
      
      yPosition += 15;
    });
  }
}

// Export singleton instance
export const aiReportGenerator = AIReportGenerator.getInstance();