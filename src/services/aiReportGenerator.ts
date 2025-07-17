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

      const riskFlags = reportContent.employerSpecific.riskFlags;
      doc.setFontSize(12);
      doc.text(`Hiring Risk Level: ${riskFlags.length > 0 ? 'High' : 'Low'}`, margin, yPosition);
      yPosition += 15;
      doc.text(`Success Probability: 75%`, margin, yPosition);
      yPosition += 15;
      doc.text(`Retention Risk: Medium`, margin, yPosition);
      yPosition += 15;
      doc.text(`Expected Ramp-up Time: 3-6 months`, margin, yPosition);
      yPosition += 25;

      // Interview Questions
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('TARGETED INTERVIEW QUESTIONS', margin, yPosition);
      yPosition += 20;

      const questions = reportContent.employerSpecific.interviewQuestions;
      
      if (questions.behavioral) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Behavioral Questions:', margin, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        questions.behavioral.forEach((q: string, index: number) => {
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

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Risk Level: ${reportContent.employerSpecific.riskFlags.length > 0 ? 'High' : 'Low'} | Success Rate: 75%`, margin, yPosition);
    yPosition += 8;
    doc.text(`Retention Risk: Medium | Ramp-up: 3-6 months`, margin, yPosition);

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

  // Applicant-specific methods
  private addApplicantHeader(doc: jsPDF, reportContent: AIReportContent, logoBase64?: string) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    
    // Header with applicant focus
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Logo
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 5, 10, 52, 40);
      } catch (error) {
        this.addLogoPlaceholder(doc, 5);
      }
    } else {
      this.addLogoPlaceholder(doc, 5);
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const assessmentTitle = reportContent.candidateInfo.assessmentType.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
    doc.text(`${assessmentTitle} ADAPTATION READINESS REPORT`, margin + 40, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Applicant: ${reportContent.candidateInfo.name} | Date: ${new Date().toLocaleDateString()}`, margin + 40, 45);
  }

  private addEmployerHeader(doc: jsPDF, reportContent: AIReportContent, logoBase64?: string) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    
    // Header with employer focus
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Logo
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 5, 10, 52, 40);
      } catch (error) {
        this.addLogoPlaceholder(doc, 5);
      }
    } else {
      this.addLogoPlaceholder(doc, 5);
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const assessmentTitle = reportContent.candidateInfo.assessmentType.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
    doc.text(`${assessmentTitle} CANDIDATE REPORT FOR EMPLOYERS`, margin + 40, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Candidate: ${reportContent.candidateInfo.name} | Date: ${new Date().toLocaleDateString()}`, margin + 40, 45);
  }

  private addOverviewSection(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    let yPosition = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('OVERVIEW', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Purpose: This assessment evaluates your capacity to adapt and thrive in changing environments,', margin, yPosition);
    yPosition += 8;
    doc.text('measuring key dimensions that predict success in dynamic workplace settings.', margin, yPosition);
    yPosition += 20;

    return yPosition;
  }

  private addScoreSummaryTable(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('SCORE SUMMARY', margin, yPosition);
    yPosition += 20;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Dimension', margin + 5, yPosition);
    doc.text('Score', pageWidth - margin - 30, yPosition);
    yPosition += 15;

    // Table rows
    Object.entries(reportContent.detailedAnalysis.dimensionScores).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' ? value.score || 0 : value;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(label, margin + 5, yPosition);
      doc.text(`${score}`, pageWidth - margin - 25, yPosition);
      yPosition += 10;
    });

    return yPosition + 10;
  }

  private addDimensionChart(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    const margin = 15;
    let yPosition = startY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('DIMENSION SCORES CHART', margin, yPosition);
    yPosition += 20;

    // Use existing chart method
    this.addDimensionScoresChart(doc, reportContent.detailedAnalysis.dimensionScores, yPosition);
    
    return yPosition + Object.keys(reportContent.detailedAnalysis.dimensionScores).length * 15 + 20;
  }

  private addDimensionInsights(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    doc.setFillColor(15, 23, 42);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DIMENSION INSIGHTS', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Add personalized insights for each dimension
    Object.entries(reportContent.detailedAnalysis.dimensionScores).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' ? value.score || 0 : value;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (yPosition + 30 > 250) {
        yPosition = pageBreak(30);
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label} (${score}/100):`, margin, yPosition);
      yPosition += 12;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const insight = this.generateDimensionInsight(key, score);
      const lines = doc.splitTextToSize(insight, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 8;
    });

    return yPosition;
  }

  private addStrengthsSection(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    if (yPosition + 40 > 250) {
      yPosition = pageBreak(40);
    }

    doc.setFillColor(34, 197, 94);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('YOUR STRENGTHS', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    reportContent.executiveSummary.topStrengths.forEach((strength, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${strength}`, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 6;
    });

    return yPosition + 10;
  }

  private addGrowthOpportunities(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    if (yPosition + 40 > 250) {
      yPosition = pageBreak(40);
    }

    doc.setFillColor(251, 146, 60);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('GROWTH OPPORTUNITIES', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    reportContent.executiveSummary.developmentAreas.forEach((area, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${area}`, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 6;
    });

    return yPosition + 10;
  }

  private addPersonalActionPlan(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    doc.setFillColor(59, 130, 246);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('YOUR ACTION PLAN', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    
    // 3 personalized development suggestions
    const personalizedActions = reportContent.actionPlan.immediate.slice(0, 3);
    personalizedActions.forEach((action, index) => {
      if (yPosition + 20 > 250) {
        yPosition = pageBreak(20);
      }
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. Personal Development Action:`, margin, yPosition);
      yPosition += 12;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(action, contentWidth);
      doc.text(lines, margin + 10, yPosition);
      yPosition += lines.length * 4 + 10;
    });

    return yPosition;
  }

  // Employer-specific methods
  private addEmployerScoreSection(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    let yPosition = startY;

    // Score table
    yPosition = this.addScoreSummaryTable(doc, reportContent, yPosition);
    
    // Chart
    if (yPosition + 120 > 250) {
      yPosition = pageBreak(120);
    }
    yPosition = this.addDimensionChart(doc, reportContent, yPosition);

    return yPosition;
  }

  private addDistortionAnalysis(doc: jsPDF, reportContent: AIReportContent, startY: number): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    doc.setFillColor(239, 68, 68);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DISTORTION SCALE ANALYSIS', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const reliability = reportContent.distortionAnalysis.reliability;
    const reliabilityText = reliability === 'high' ? 'Low' : reliability === 'medium' ? 'Mild inconsistency' : 'Caution — validate with interview';
    const reliabilityColor = reliability === 'high' ? [34, 197, 94] : reliability === 'medium' ? [251, 146, 60] : [239, 68, 68];
    
    doc.setTextColor(reliabilityColor[0], reliabilityColor[1], reliabilityColor[2]);
    doc.text(`Reliability: ${reliabilityText}`, margin, yPosition);
    yPosition += 15;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Distortion Score: ${reportContent.distortionAnalysis.score}/100`, margin, yPosition);
    yPosition += 10;
    
    const lines = doc.splitTextToSize(reportContent.distortionAnalysis.interpretation, contentWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * 4 + 15;

    if (reportContent.distortionAnalysis.consistencyFlags.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Consistency Flags:', margin, yPosition);
      yPosition += 10;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      reportContent.distortionAnalysis.consistencyFlags.forEach(flag => {
        const flagLines = doc.splitTextToSize(`• ${flag}`, contentWidth);
        doc.text(flagLines, margin, yPosition);
        yPosition += flagLines.length * 4 + 4;
      });
    }

    return yPosition + 10;
  }

  private addInterviewQuestions(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    if (!reportContent.employerSpecific) return yPosition;

    doc.setFillColor(59, 130, 246);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SUGGESTED INTERVIEW QUESTIONS', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    const questions = reportContent.employerSpecific.interviewQuestions;

    // Clarification Questions
    if (questions.clarification.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Clarification Questions:', margin, yPosition);
      yPosition += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      questions.clarification.forEach((q, index) => {
        if (yPosition + 15 > 250) {
          yPosition = pageBreak(15);
        }
        const lines = doc.splitTextToSize(`${index + 1}. ${q}`, contentWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 4 + 8;
      });
      yPosition += 10;
    }

    // Validation Questions
    if (questions.validation.length > 0) {
      if (yPosition + 20 > 250) {
        yPosition = pageBreak(20);
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Validation Questions:', margin, yPosition);
      yPosition += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      questions.validation.forEach((q, index) => {
        if (yPosition + 15 > 250) {
          yPosition = pageBreak(15);
        }
        const lines = doc.splitTextToSize(`${index + 1}. ${q}`, contentWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 4 + 8;
      });
    }

    return yPosition + 10;
  }

  private addRiskFlags(doc: jsPDF, reportContent: AIReportContent, startY: number, pageBreak: Function): number {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = startY;

    if (!reportContent.employerSpecific) return yPosition;

    if (yPosition + 40 > 250) {
      yPosition = pageBreak(40);
    }

    const hasRisks = reportContent.employerSpecific.riskFlags.length > 0 && 
                     !reportContent.employerSpecific.riskFlags[0].includes('No significant risk');

    const bgColor = hasRisks ? [254, 242, 242] : [240, 253, 244];
    const textColor = hasRisks ? [239, 68, 68] : [34, 197, 94];
    
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(margin - 5, yPosition - 8, contentWidth + 10, 16, 'F');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(hasRisks ? 'RISK FLAGS' : 'RISK ASSESSMENT', margin, yPosition);
    yPosition += 25;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    reportContent.employerSpecific.riskFlags.forEach((flag, index) => {
      const lines = doc.splitTextToSize(`• ${flag}`, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 4 + 6;
    });

    return yPosition + 10;
  }

  private generateDimensionInsight(dimension: string, score: number): string {
    const insights = {
      'emotional': score >= 70 ? 'Shows strong emotional resilience and self-regulation capabilities.' : 
                   'May benefit from emotional intelligence development and stress management techniques.',
      'cognitive': score >= 70 ? 'Demonstrates excellent analytical thinking and problem-solving abilities.' : 
                   'Could enhance cognitive flexibility through structured thinking exercises.',
      'physical': score >= 70 ? 'Maintains good physical wellness and energy management.' : 
                  'Should focus on physical health and stress reduction practices.',
      'social': score >= 70 ? 'Exhibits strong interpersonal skills and social awareness.' : 
                'Would benefit from communication skills development and relationship building.',
      'adaptability': score >= 70 ? 'Shows excellent adaptability to change and new situations.' : 
                      'Needs to develop comfort with ambiguity and change management skills.',
      'performance': score >= 70 ? 'Maintains high performance standards under pressure.' : 
                     'Should work on performance consistency and pressure management techniques.'
    };
    
    return insights[dimension as keyof typeof insights] || 'This dimension reflects your overall capability in this area.';
  }

// Export singleton instance
export const aiReportGenerator = AIReportGenerator.getInstance();