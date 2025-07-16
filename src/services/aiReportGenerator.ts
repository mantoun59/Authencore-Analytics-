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
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      // Call the edge function to generate AI report
      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: request,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
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
      const addWrappedText = (text: string, fontSize: number, maxWidth: number, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        if (isBold) {
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'normal');
        }
        
        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.4;
        
        checkPageBreak(lines.length * lineHeight);
        
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + 5;
      };

      // Header
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL ASSESSMENT REPORT', pageWidth / 2, 25, { align: 'center' });
      
      yPosition = 50;
      doc.setTextColor(0, 0, 0);

      // Candidate Information
      addWrappedText('CANDIDATE INFORMATION', 16, pageWidth - 2 * margin, true);
      addWrappedText(`Name: ${reportContent.candidateInfo.name}`, 12, pageWidth - 2 * margin);
      addWrappedText(`Email: ${reportContent.candidateInfo.email}`, 12, pageWidth - 2 * margin);
      addWrappedText(`Assessment Type: ${reportContent.candidateInfo.assessmentType}`, 12, pageWidth - 2 * margin);
      addWrappedText(`Completion Date: ${new Date(reportContent.candidateInfo.completionDate).toLocaleDateString()}`, 12, pageWidth - 2 * margin);
      addWrappedText(`Assessment ID: ${reportContent.candidateInfo.assessmentId}`, 12, pageWidth - 2 * margin);

      yPosition += 10;

      // Executive Summary
      addWrappedText('EXECUTIVE SUMMARY', 16, pageWidth - 2 * margin, true);
      
      // Overall Score with visual representation
      doc.setFillColor(52, 152, 219);
      doc.rect(margin, yPosition, (reportContent.executiveSummary.overallScore / 100) * (pageWidth - 2 * margin), 8, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 8);
      doc.setFontSize(12);
      doc.text(`Overall Score: ${reportContent.executiveSummary.overallScore}/100`, margin, yPosition + 15);
      yPosition += 25;

      // Key Insights
      addWrappedText('Key Insights:', 14, pageWidth - 2 * margin, true);
      reportContent.executiveSummary.keyInsights.forEach((insight, index) => {
        addWrappedText(`• ${insight}`, 11, pageWidth - 2 * margin - 10);
      });

      yPosition += 10;

      // Top Strengths
      addWrappedText('Top Strengths:', 14, pageWidth - 2 * margin, true);
      reportContent.executiveSummary.topStrengths.forEach((strength, index) => {
        addWrappedText(`✓ ${strength}`, 11, pageWidth - 2 * margin - 10);
      });

      yPosition += 10;

      // Development Areas
      addWrappedText('Development Areas:', 14, pageWidth - 2 * margin, true);
      reportContent.executiveSummary.developmentAreas.forEach((area, index) => {
        addWrappedText(`◦ ${area}`, 11, pageWidth - 2 * margin - 10);
      });

      // New page for detailed analysis
      doc.addPage();
      yPosition = margin;

      // Detailed Analysis
      addWrappedText('DETAILED ANALYSIS', 16, pageWidth - 2 * margin, true);
      
      // Dimension Scores Chart
      if (reportContent.detailedAnalysis.dimensionScores) {
        await this.addDimensionScoresChart(doc, reportContent.detailedAnalysis.dimensionScores, yPosition);
        yPosition += 120; // Space for chart
      }

      // Personalized Insights
      addWrappedText('Personalized Insights:', 14, pageWidth - 2 * margin, true);
      addWrappedText(reportContent.detailedAnalysis.personalizedInsights, 11, pageWidth - 2 * margin);

      // Behavioral Patterns
      addWrappedText('Behavioral Patterns:', 14, pageWidth - 2 * margin, true);
      reportContent.detailedAnalysis.behavioralPatterns.forEach((pattern, index) => {
        addWrappedText(`• ${pattern}`, 11, pageWidth - 2 * margin - 10);
      });

      // Action Plan
      checkPageBreak(100);
      addWrappedText('ACTION PLAN', 16, pageWidth - 2 * margin, true);
      
      // Immediate Actions
      addWrappedText('Immediate Actions (Next 30 Days):', 14, pageWidth - 2 * margin, true);
      reportContent.actionPlan.immediate.forEach((action, index) => {
        addWrappedText(`${index + 1}. ${action}`, 11, pageWidth - 2 * margin - 10);
      });

      // Short-term Actions
      addWrappedText('Short-term Actions (3-6 Months):', 14, pageWidth - 2 * margin, true);
      reportContent.actionPlan.shortTerm.forEach((action, index) => {
        addWrappedText(`${index + 1}. ${action}`, 11, pageWidth - 2 * margin - 10);
      });

      // Long-term Actions
      addWrappedText('Long-term Actions (6-18 Months):', 14, pageWidth - 2 * margin, true);
      reportContent.actionPlan.longTerm.forEach((action, index) => {
        addWrappedText(`${index + 1}. ${action}`, 11, pageWidth - 2 * margin - 10);
      });

      // Career Guidance
      checkPageBreak(80);
      addWrappedText('CAREER GUIDANCE', 16, pageWidth - 2 * margin, true);
      
      addWrappedText('Career Recommendations:', 14, pageWidth - 2 * margin, true);
      reportContent.careerGuidance.recommendations.forEach((rec, index) => {
        addWrappedText(`• ${rec}`, 11, pageWidth - 2 * margin - 10);
      });

      addWrappedText('Career Pathways:', 14, pageWidth - 2 * margin, true);
      reportContent.careerGuidance.pathways.forEach((pathway, index) => {
        addWrappedText(`• ${pathway}`, 11, pageWidth - 2 * margin - 10);
      });

      addWrappedText('Skills to Acquire:', 14, pageWidth - 2 * margin, true);
      reportContent.careerGuidance.skills.forEach((skill, index) => {
        addWrappedText(`• ${skill}`, 11, pageWidth - 2 * margin - 10);
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
        addWrappedText('DISTORTION SCALE ANALYSIS', 16, pageWidth - 2 * margin, true);
        
        const distortion = reportContent.employerSpecific.distortionScale;
        addWrappedText(`Validity Index: ${distortion.validityIndex}/100`, 14, pageWidth - 2 * margin, true);
        
        addWrappedText(`Social Desirability: ${distortion.socialDesirability.score}/100`, 12, pageWidth - 2 * margin);
        addWrappedText(distortion.socialDesirability.interpretation, 11, pageWidth - 2 * margin);
        
        addWrappedText(`Response Consistency: ${distortion.responseConsistency.score}/100`, 12, pageWidth - 2 * margin);
        addWrappedText(distortion.responseConsistency.interpretation, 11, pageWidth - 2 * margin);
        
        addWrappedText(`Extreme Responding: ${distortion.extremeResponding.score}/100`, 12, pageWidth - 2 * margin);
        addWrappedText(distortion.extremeResponding.interpretation, 11, pageWidth - 2 * margin);

        // Risk Assessment
        addWrappedText('RISK ASSESSMENT', 16, pageWidth - 2 * margin, true);
        const risk = reportContent.employerSpecific.riskAssessment;
        addWrappedText(`Hiring Risk: ${risk.hiringRisk}`, 12, pageWidth - 2 * margin);
        addWrappedText(`Success Probability: ${risk.successProbability}%`, 12, pageWidth - 2 * margin);
        addWrappedText(`Retention Risk: ${risk.retentionRisk}`, 12, pageWidth - 2 * margin);
        addWrappedText(`Ramp-up Time: ${risk.rampUpTime}`, 12, pageWidth - 2 * margin);

        // Interview Questions
        addWrappedText('INTERVIEW QUESTIONS', 16, pageWidth - 2 * margin, true);
        const questions = reportContent.employerSpecific.interviewQuestions;
        
        if (questions.behavioralQuestions) {
          addWrappedText('Behavioral Questions:', 14, pageWidth - 2 * margin, true);
          questions.behavioralQuestions.forEach((q: string, index: number) => {
            addWrappedText(`${index + 1}. ${q}`, 11, pageWidth - 2 * margin - 10);
          });
        }

        if (questions.situationalQuestions) {
          addWrappedText('Situational Questions:', 14, pageWidth - 2 * margin, true);
          questions.situationalQuestions.forEach((q: string, index: number) => {
            addWrappedText(`${index + 1}. ${q}`, 11, pageWidth - 2 * margin - 10);
          });
        }

        // Hiring Recommendations
        addWrappedText('HIRING RECOMMENDATIONS', 16, pageWidth - 2 * margin, true);
        reportContent.employerSpecific.hiringRecommendations.forEach((rec, index) => {
          addWrappedText(`• ${rec}`, 11, pageWidth - 2 * margin - 10);
        });

        // Onboarding Plan
        addWrappedText('ONBOARDING PLAN', 16, pageWidth - 2 * margin, true);
        reportContent.employerSpecific.onboardingPlan.forEach((step, index) => {
          addWrappedText(`${index + 1}. ${step}`, 11, pageWidth - 2 * margin - 10);
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
      const fileName = `${reportContent.candidateInfo.name.replace(/\s+/g, '_')}_${reportContent.candidateInfo.assessmentType}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast.success('PDF Report downloaded successfully!');

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
      throw error;
    }
  }

  private async addDimensionScoresChart(doc: jsPDF, dimensionScores: Record<string, any>, yPosition: number) {
    try {
      // Create a canvas element for the chart
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Prepare data for chart
      const labels = Object.keys(dimensionScores).map(key => 
        key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      );
      const data = Object.values(dimensionScores).map((dim: any) => dim.score || 0);

      // Create chart
      const chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Dimension Scores',
            data: data,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          }]
        },
        options: {
          responsive: false,
          scales: {
            r: {
              angleLines: {
                display: false
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      // Convert chart to image and add to PDF
      const chartImage = canvas.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', 30, yPosition, 150, 100);
      
      // Add title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Dimension Scores Overview', 105, yPosition - 5, { align: 'center' });

      // Clean up
      chart.destroy();
      canvas.remove();

    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      // Fallback to text-based representation
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Dimension Scores:', 30, yPosition);
      
      let textY = yPosition + 15;
      Object.entries(dimensionScores).forEach(([key, value]: [string, any]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        doc.setFont('helvetica', 'normal');
        doc.text(`${label}: ${value.score || 0}/100`, 30, textY);
        textY += 10;
      });
    }
  }
}

// Export singleton instance
export const aiReportGenerator = AIReportGenerator.getInstance();