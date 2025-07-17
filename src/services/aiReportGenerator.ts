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
      const margin = 15; // Reduced margin for more content space
      const contentWidth = pageWidth - 2 * margin;
      const usableHeight = pageHeight - 70; // Reserve space for header/footer
      let currentY = margin;

      // Load logo image first
      const logoBase64 = await this.loadLogoAsBase64();
      
      // Page break utility that respects margins
      const smartPageBreak = (requiredHeight: number): number => {
        if (currentY + requiredHeight > usableHeight) {
          doc.addPage();
          this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
          return 45; // Start position after header
        }
        return currentY;
      };

      // PAGE 1: Header + Executive Summary
      this.addProfessionalHeader(doc, reportContent.candidateInfo.assessmentType, logoBase64);
      currentY = 75;
      
      currentY = this.addCompactExecutiveSummary(doc, reportContent, currentY, smartPageBreak);

      // PAGE 2: Detailed Analysis + Behavioral Insights
      currentY = smartPageBreak(40);
      currentY = this.addCompactDetailedAnalysis(doc, reportContent, currentY, smartPageBreak);
      currentY = this.addCompactBehavioralInsights(doc, reportContent, currentY, smartPageBreak);

      // PAGE 3: Action Plan + Career Guidance
      currentY = smartPageBreak(40);
      currentY = this.addCompactActionPlan(doc, reportContent, currentY, smartPageBreak);
      currentY = this.addCompactCareerGuidance(doc, reportContent, currentY, smartPageBreak);

      // Employer-specific section (if needed)
      if (reportContent.employerSpecific) {
        currentY = smartPageBreak(60);
        this.addCompactEmployerSection(doc, reportContent, currentY);
      }

      // Add final footer with page numbers
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
    
    // Add white background for logo visibility
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 10, 52, 40, 'F');
    
    // Add the actual logo image if available
    if (logoBase64) {
      try {
        // Use the actual logo image stretched 30% rectangularly at left margin
        doc.addImage(logoBase64, 'PNG', 5, 10, 52, 40);
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
        // Fallback to placeholder
        this.addLogoPlaceholder(doc, 5);
      }
    } else {
      // Fallback to placeholder
      this.addLogoPlaceholder(doc, 5);
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

  private addCompactExecutiveSummary(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    // Executive Summary Title
    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE SUMMARY', margin, yPosition);
    yPosition += 20;

    // Overall Score - Compact version
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Score:', margin, yPosition);
    
    const scoreColor = reportContent.executiveSummary.overallScore >= 80 ? [34, 197, 94] as [number, number, number] : 
                      reportContent.executiveSummary.overallScore >= 60 ? [245, 158, 11] as [number, number, number] : [239, 68, 68] as [number, number, number];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.setFontSize(24);
    doc.text(`${reportContent.executiveSummary.overallScore}/100`, margin + 80, yPosition);
    
    // Progress bar
    const barWidth = 100;
    const fillWidth = (reportContent.executiveSummary.overallScore / 100) * barWidth;
    doc.setFillColor(229, 231, 235);
    doc.rect(margin, yPosition + 8, barWidth, 8, 'F');
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.rect(margin, yPosition + 8, fillWidth, 8, 'F');
    yPosition += 25;

    // Key Insights - Compact
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Insights:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    reportContent.executiveSummary.keyInsights.slice(0, 3).forEach((insight) => {
      const lines = doc.splitTextToSize(`• ${insight}`, contentWidth - 10);
      if (yPosition + lines.length * 3.5 > 200) {
        yPosition = pageBreak(lines.length * 3.5 + 10);
      }
      doc.text(lines, margin + 5, yPosition);
      yPosition += lines.length * 3.5 + 4;
    });

    yPosition += 10;

    // Two-column layout for strengths and development - Compact
    const colWidth = (contentWidth - 10) / 2;
    const startColumnY = yPosition;

    // Strengths
    doc.setFillColor(239, 246, 255);
    doc.rect(margin - 2, yPosition - 5, colWidth + 2, 50, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Core Strengths', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.executiveSummary.topStrengths.slice(0, 3).forEach((strength) => {
      const lines = doc.splitTextToSize(`✓ ${strength}`, colWidth - 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 3 + 2;
    });

    // Development Areas
    let rightY = startColumnY;
    doc.setFillColor(254, 242, 242);
    doc.rect(margin + colWidth + 8, rightY - 5, colWidth + 2, 50, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('Development Focus', margin + colWidth + 10, rightY);
    rightY += 10;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.executiveSummary.developmentAreas.slice(0, 3).forEach((area) => {
      const lines = doc.splitTextToSize(`◦ ${area}`, colWidth - 8);
      doc.text(lines, margin + colWidth + 10, rightY);
      rightY += lines.length * 3 + 2;
    });

    return Math.max(yPosition, rightY) + 15;
  }

  private addDetailedAnalysis(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILED PSYCHOLOGICAL ANALYSIS', margin, yPosition);
    yPosition += 25;

    // Page break checker
    const checkPageBreak = (estimatedHeight: number) => {
      if (yPosition + estimatedHeight > pageHeight - 40) {
        doc.addPage();
        this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
        yPosition = 50;
      }
    };

    // Dimension Scores Chart
    this.addDimensionScoresChart(doc, reportContent.detailedAnalysis.dimensionScores, yPosition);
    yPosition += 120;

    // Personalized Insights
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Personalized Professional Insights:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const insightLines = doc.splitTextToSize(reportContent.detailedAnalysis.personalizedInsights, contentWidth);
    
    // Split insights into chunks to handle page breaks
    let currentLine = 0;
    while (currentLine < insightLines.length) {
      const remainingLines = insightLines.slice(currentLine);
      const chunkSize = Math.min(remainingLines.length, Math.floor((pageHeight - yPosition - 40) / 4));
      
      if (chunkSize <= 0) {
        checkPageBreak(40);
        continue;
      }
      
      const chunk = remainingLines.slice(0, chunkSize);
      doc.text(chunk, margin, yPosition);
      yPosition += chunk.length * 4 + 8;
      currentLine += chunkSize;
      
      if (currentLine < insightLines.length) {
        checkPageBreak(40);
      }
    }

    yPosition += 10;

    // Behavioral Patterns
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Behavioral Patterns & Workplace Implications:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    reportContent.detailedAnalysis.behavioralPatterns.forEach((pattern, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${pattern}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });
  }

  private addBehavioralInsights(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BEHAVIORAL INSIGHTS & WORKPLACE DYNAMICS', margin, yPosition);
    yPosition += 25;

    // Page break checker
    const checkPageBreak = (estimatedHeight: number) => {
      if (yPosition + estimatedHeight > pageHeight - 40) {
        doc.addPage();
        this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
        yPosition = 50;
      }
    };

    // Communication Style
    checkPageBreak(50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Communication Style Analysis:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const commItems = [
      'Preferred communication channels and effectiveness patterns',
      'Influence tactics and persuasion style preferences',
      'Conflict resolution approach and negotiation capabilities'
    ];
    
    commItems.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, contentWidth);
      checkPageBreak(lines.length * 4 + 6);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 6;
    });

    yPosition += 10;

    // Leadership Potential
    checkPageBreak(50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Leadership Potential Assessment:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const leadershipItems = [
      'Natural leadership tendencies and influence capacity evaluation',
      'Team dynamics and collaboration effectiveness analysis',
      'Decision-making style under pressure assessment'
    ];
    
    leadershipItems.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, contentWidth);
      checkPageBreak(lines.length * 4 + 6);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 6;
    });

    yPosition += 10;

    // Motivation & Engagement
    checkPageBreak(50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Motivation & Engagement Drivers:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const motivationItems = [
      'Primary motivational factors and engagement triggers',
      'Work environment preferences and productivity factors',
      'Recognition and reward responsiveness patterns'
    ];
    
    motivationItems.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, contentWidth);
      checkPageBreak(lines.length * 4 + 6);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 6;
    });
  }

  private addActionPlan(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PERSONALIZED DEVELOPMENT ACTION PLAN', margin, yPosition);
    yPosition += 25;

    // Page break checker
    const checkPageBreak = (estimatedHeight: number) => {
      if (yPosition + estimatedHeight > pageHeight - 40) {
        doc.addPage();
        this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
        yPosition = 50;
      }
    };

    // Immediate Actions
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('Immediate Actions (Next 30 Days):', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.immediate.forEach((action, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${action}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });

    yPosition += 10;

    // Short-term Actions
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(251, 146, 60);
    doc.text('Short-term Development (3-6 Months):', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.shortTerm.forEach((action, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${action}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });

    yPosition += 10;

    // Long-term Actions
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('Long-term Strategic Development (6-18 Months):', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.longTerm.forEach((action, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${action}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });
  }

  private addCareerGuidance(doc: jsPDF, reportContent: AIReportContent) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 50;

    // Section title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CAREER OPTIMIZATION & STRATEGIC GUIDANCE', margin, yPosition);
    yPosition += 25;

    // Page break checker
    const checkPageBreak = (estimatedHeight: number) => {
      if (yPosition + estimatedHeight > pageHeight - 40) {
        doc.addPage();
        this.addHeaderFooter(doc, reportContent.candidateInfo.assessmentType);
        yPosition = 50;
      }
    };

    // Career Recommendations
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Career Paths:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    reportContent.careerGuidance.recommendations.forEach((rec, index) => {
      const lines = doc.splitTextToSize(`• ${rec}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });

    yPosition += 10;

    // Strategic Career Pathways
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Strategic Career Pathways:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    reportContent.careerGuidance.pathways.forEach((pathway, index) => {
      const lines = doc.splitTextToSize(`→ ${pathway}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });

    yPosition += 10;

    // Skills to Acquire
    checkPageBreak(40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Priority Skills for Acquisition:', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    reportContent.careerGuidance.skills.forEach((skill, index) => {
      const lines = doc.splitTextToSize(`▸ ${skill}`, contentWidth);
      checkPageBreak(lines.length * 4 + 8);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
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

  private addCompactDetailedAnalysis(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    // Section title
    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILED ANALYSIS', margin, yPosition);
    yPosition += 20;

    // Compact dimension scores
    yPosition = this.addCompactDimensionScores(doc, reportContent.detailedAnalysis.dimensionScores, yPosition);
    yPosition += 15;

    // Personalized insights - truncated
    if (yPosition + 50 > 250) {
      yPosition = pageBreak(50);
    }
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Professional Insights:', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const truncatedInsights = reportContent.detailedAnalysis.personalizedInsights.substring(0, 300) + "...";
    const insightLines = doc.splitTextToSize(truncatedInsights, contentWidth);
    doc.text(insightLines.slice(0, 6), margin, yPosition);
    yPosition += insightLines.slice(0, 6).length * 3.5 + 10;

    return yPosition;
  }

  private addCompactBehavioralInsights(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    if (yPosition + 80 > 250) {
      yPosition = pageBreak(80);
    }

    // Section title
    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BEHAVIORAL INSIGHTS', margin, yPosition);
    yPosition += 20;

    // Compact behavioral patterns
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Behavioral Patterns:', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    reportContent.detailedAnalysis.behavioralPatterns.slice(0, 4).forEach((pattern, index) => {
      const lines = doc.splitTextToSize(`• ${pattern}`, contentWidth - 10);
      doc.text(lines.slice(0, 2), margin + 5, yPosition);
      yPosition += Math.min(lines.length, 2) * 3 + 4;
    });

    return yPosition + 10;
  }

  private addCompactActionPlan(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    // Section title
    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ACTION PLAN', margin, yPosition);
    yPosition += 20;

    // Three columns for immediate, short-term, long-term
    const colWidth = (contentWidth - 20) / 3;

    // Immediate Actions
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('30 Days', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.immediate.slice(0, 3).forEach((action) => {
      const lines = doc.splitTextToSize(`• ${action}`, colWidth - 5);
      doc.text(lines.slice(0, 2), margin, yPosition);
      yPosition += Math.min(lines.length, 2) * 3 + 2;
    });

    // Short-term (middle column)
    let midY = startY + 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(251, 146, 60);
    doc.text('3-6 Months', margin + colWidth + 10, midY);
    midY += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.shortTerm.slice(0, 3).forEach((action) => {
      const lines = doc.splitTextToSize(`• ${action}`, colWidth - 5);
      doc.text(lines.slice(0, 2), margin + colWidth + 10, midY);
      midY += Math.min(lines.length, 2) * 3 + 2;
    });

    // Long-term (right column)
    let rightY = startY + 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('6-18 Months', margin + 2 * colWidth + 20, rightY);
    rightY += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.actionPlan.longTerm.slice(0, 3).forEach((action) => {
      const lines = doc.splitTextToSize(`• ${action}`, colWidth - 5);
      doc.text(lines.slice(0, 2), margin + 2 * colWidth + 20, rightY);
      rightY += Math.min(lines.length, 2) * 3 + 2;
    });

    return Math.max(yPosition, midY, rightY) + 15;
  }

  private addCompactCareerGuidance(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    if (yPosition + 80 > 250) {
      yPosition = pageBreak(80);
    }

    // Section title
    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CAREER GUIDANCE', margin, yPosition);
    yPosition += 20;

    // Two-column layout
    const colWidth = (contentWidth - 10) / 2;

    // Recommended paths
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Recommended Paths:', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.careerGuidance.recommendations.slice(0, 3).forEach((rec) => {
      const lines = doc.splitTextToSize(`• ${rec}`, colWidth - 5);
      doc.text(lines.slice(0, 2), margin, yPosition);
      yPosition += Math.min(lines.length, 2) * 3 + 2;
    });

    // Skills (right column)
    let rightY = startY + 28;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('Priority Skills:', margin + colWidth + 10, rightY);
    rightY += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    reportContent.careerGuidance.skills.slice(0, 5).forEach((skill) => {
      const lines = doc.splitTextToSize(`• ${skill}`, colWidth - 5);
      doc.text(lines.slice(0, 1), margin + colWidth + 10, rightY);
      rightY += Math.min(lines.length, 1) * 3 + 2;
    });

    return Math.max(yPosition, rightY) + 15;
  }

  private addCompactEmployerSection(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let yPosition = startY;

    if (!reportContent.employerSpecific) return yPosition;

    // Section title
    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, pageWidth - 2 * margin + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPLOYER INSIGHTS', margin, yPosition);
    yPosition += 25;

    // Risk assessment - compact
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Hiring Risk Assessment:', margin, yPosition);
    yPosition += 10;

    const risk = reportContent.employerSpecific.riskAssessment;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Risk Level: ${risk.hiringRisk} | Success Rate: ${risk.successProbability}%`, margin, yPosition);
    yPosition += 8;
    doc.text(`Retention Risk: ${risk.retentionRisk} | Ramp-up: ${risk.rampUpTime}`, margin, yPosition);

    return yPosition + 15;
  }

  private addCompactDimensionScores(doc: jsPDF, dimensionScores: Record<string, any>, yPosition: number): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Competency Scores:', margin, yPosition);
    yPosition += 10;

    // Create compact visual chart with smaller bars
    let currentY = yPosition;
    const itemsPerRow = 2;
    let itemsInCurrentRow = 0;
    const colWidth = contentWidth / itemsPerRow;

    Object.entries(dimensionScores).slice(0, 6).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' && value !== null ? value.score || 0 : value;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).substring(0, 15);
      
      const xOffset = (itemsInCurrentRow % itemsPerRow) * colWidth;
      
      // Label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(label, margin + xOffset, currentY);
      
      // Score
      doc.setFont('helvetica', 'bold');
      doc.text(`${score}`, margin + xOffset + 60, currentY);
      
      // Mini bar
      const barWidth = 40;
      const barHeight = 3;
      
      // Background bar
      doc.setFillColor(229, 231, 235);
      doc.rect(margin + xOffset + 70, currentY - 2, barWidth, barHeight, 'F');
      
      // Score bar
      const scoreColor = score >= 70 ? [34, 197, 94] : score >= 50 ? [251, 146, 60] : [239, 68, 68];
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.rect(margin + xOffset + 70, currentY - 2, (score / 100) * barWidth, barHeight, 'F');
      
      itemsInCurrentRow++;
      if (itemsInCurrentRow % itemsPerRow === 0) {
        currentY += 12;
      }
    });

    if (itemsInCurrentRow % itemsPerRow !== 0) {
      currentY += 12;
    }

    return currentY;
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