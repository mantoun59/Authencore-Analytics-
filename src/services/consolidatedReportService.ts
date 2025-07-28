import { UnifiedAssessmentResult } from '@/services/unifiedAssessmentService';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ReportConfig {
  includeExecutiveSummary: boolean;
  includeDimensionAnalysis: boolean;
  includePersonalizedRecommendations: boolean;
  includeCareerGuidance: boolean;
  includeValidityAnalysis: boolean;
  includeVisualCharts: boolean;
  reportFormat: 'candidate' | 'employer' | 'professional';
  branding: {
    logo?: string;
    companyName?: string;
    footer?: string;
  };
}

export class ConsolidatedReportService {
  private static instance: ConsolidatedReportService;

  static getInstance(): ConsolidatedReportService {
    if (!ConsolidatedReportService.instance) {
      ConsolidatedReportService.instance = new ConsolidatedReportService();
    }
    return ConsolidatedReportService.instance;
  }

  async generateComprehensiveReport(
    result: UnifiedAssessmentResult,
    config: ReportConfig = this.getDefaultConfig()
  ): Promise<void> {
    try {
      // Try server-side PDF generation for better performance
      try {
        // Attempting server-side PDF generation
        const { data: pdfData, error } = await supabase.functions.invoke('generate-pdf-report', {
          body: {
            assessmentType: result.assessmentType,
            results: {
              scores: result.dimensionScores,
              overallScore: result.overallScore,
              profile: result.profile,
              recommendations: result.recommendations,
              interests: result.dimensionScores,
              aptitudes: result.dimensionScores
            },
            userData: result.candidateInfo
          }
        });

        if (!error && pdfData && pdfData.reportHtml) {
          // Create PDF from HTML report
          const blob = new Blob([pdfData.reportHtml], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.generateFileName(result, config).replace('.pdf', '.html');
          a.click();
          URL.revokeObjectURL(url);
          
          await this.logReportGeneration(result, config);
          toast.success('Report generated successfully!');
          return;
        }
        
        // Server-side PDF generation failed, falling back to client-side
      } catch (error) {
        console.warn('Server-side PDF generation error, using fallback:', error);
      }

      // Fallback to client-side generation
      const doc = new jsPDF();
      let yPosition = 20;

      // Title and Header
      yPosition = this.addReportHeader(doc, result, yPosition, config);
      yPosition = this.addExecutiveSummary(doc, result, yPosition, config);
      yPosition = this.addDimensionAnalysis(doc, result, yPosition, config);
      yPosition = this.addValidityAnalysis(doc, result, yPosition, config);
      yPosition = this.addRecommendations(doc, result, yPosition, config);
      yPosition = this.addCareerGuidance(doc, result, yPosition, config);
      
      // Footer
      this.addFooter(doc, config);

      // Save and download
      const fileName = this.generateFileName(result, config);
      doc.save(fileName);

      // Log the report generation for analytics
      await this.logReportGeneration(result, config);

      toast.success('Comprehensive report generated successfully!');
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      toast.error('Failed to generate report. Please try again.');
      throw error;
    }
  }

  private getDefaultConfig(): ReportConfig {
    return {
      includeExecutiveSummary: true,
      includeDimensionAnalysis: true,
      includePersonalizedRecommendations: true,
      includeCareerGuidance: true,
      includeValidityAnalysis: true,
      includeVisualCharts: false, // For future implementation
      reportFormat: 'candidate',
      branding: {
        companyName: 'AuthenCore Assessment Platform',
        footer: 'Confidential Assessment Report'
      }
    };
  }

  private addReportHeader(
    doc: jsPDF,
    result: UnifiedAssessmentResult,
    yPosition: number,
    config: ReportConfig
  ): number {
    // Logo/Branding space
    if (config.branding.companyName) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(config.branding.companyName, 20, yPosition);
      yPosition += 10;
    }

    // Assessment Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    const title = this.getAssessmentTitle(result.assessmentType);
    doc.text(title, 20, yPosition);
    yPosition += 15;

    // Candidate Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Candidate: ${result.candidateInfo.name}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Email: ${result.candidateInfo.email}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Report Type: ${config.reportFormat.charAt(0).toUpperCase() + config.reportFormat.slice(1)}`, 20, yPosition);
    yPosition += 20;

    return yPosition;
  }

  private addExecutiveSummary(
    doc: jsPDF,
    result: UnifiedAssessmentResult,
    yPosition: number,
    config: ReportConfig
  ): number {
    if (!config.includeExecutiveSummary) return yPosition;

    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Overall Score Box
    doc.setDrawColor(0, 102, 204);
    doc.setFillColor(240, 248, 255);
    doc.rect(20, yPosition, 170, 25, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Assessment Score', 25, yPosition + 8);
    doc.setFontSize(16);
    doc.text(`${result.overallScore}/100`, 25, yPosition + 18);
    doc.setFontSize(12);
    doc.text(`Profile: ${result.profile}`, 100, yPosition + 12);
    yPosition += 35;

    // Key Insights
    const insights = this.generateKeyInsights(result);
    const insightLines = doc.splitTextToSize(insights, 170);
    doc.setFont('helvetica', 'normal');
    doc.text(insightLines, 20, yPosition);
    yPosition += insightLines.length * 6 + 15;

    return yPosition;
  }

  private addDimensionAnalysis(
    doc: jsPDF,
    result: UnifiedAssessmentResult,
    yPosition: number,
    config: ReportConfig
  ): number {
    if (!config.includeDimensionAnalysis) return yPosition;

    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Dimension Analysis', 20, yPosition);
    yPosition += 15;

    // Create dimension breakdown
    Object.entries(result.dimensionScores).forEach(([dimension, score]) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const formattedDimension = this.formatDimensionName(dimension);
      doc.text(`${formattedDimension}: ${score}/100`, 25, yPosition);
      
      // Score bar
      const barWidth = (score / 100) * 120;
      const barColor = this.getScoreColor(score);
      doc.setFillColor(...barColor);
      doc.rect(25, yPosition + 3, barWidth, 6, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(25, yPosition + 3, 120, 6);
      
      // Interpretation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const interpretation = this.getDimensionInterpretation(dimension, score);
      const interpretationLines = doc.splitTextToSize(interpretation, 160);
      doc.text(interpretationLines, 25, yPosition + 15);
      yPosition += 15 + interpretationLines.length * 5 + 8;
    });

    return yPosition + 10;
  }

  private addValidityAnalysis(
    doc: jsPDF,
    result: UnifiedAssessmentResult,
    yPosition: number,
    config: ReportConfig
  ): number {
    if (!config.includeValidityAnalysis || !result.validityMetrics) return yPosition;

    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Validity Analysis', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const validity = result.validityMetrics;
    doc.text(`Response Consistency: ${validity.consistency}%`, 25, yPosition);
    yPosition += 8;
    doc.text(`Average Response Time: ${validity.responseTime}s`, 25, yPosition);
    yPosition += 8;
    doc.text(`Engagement Level: ${validity.engagement.charAt(0).toUpperCase() + validity.engagement.slice(1)}`, 25, yPosition);
    yPosition += 15;

    const validityText = this.getValidityInterpretation(validity);
    const validityLines = doc.splitTextToSize(validityText, 170);
    doc.text(validityLines, 25, yPosition);
    yPosition += validityLines.length * 6 + 15;

    return yPosition;
  }

  private addRecommendations(
    doc: jsPDF,
    result: UnifiedAssessmentResult,
    yPosition: number,
    config: ReportConfig
  ): number {
    if (!config.includePersonalizedRecommendations) return yPosition;

    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Development Recommendations', 20, yPosition);
    yPosition += 15;

    // Strengths
    if (result.strengths.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Key Strengths:', 25, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      result.strengths.forEach((strength, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${strength}`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Development Areas
    if (result.developmentAreas.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Development Areas:', 25, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      result.developmentAreas.forEach((area, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${area}`, 30, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Action Items
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Actions:', 25, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    result.recommendations.forEach((recommendation, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${recommendation}`, 30, yPosition);
      yPosition += 8;
    });

    return yPosition + 10;
  }

  private addCareerGuidance(
    doc: jsPDF,
    result: UnifiedAssessmentResult,
    yPosition: number,
    config: ReportConfig
  ): number {
    if (!config.includeCareerGuidance || result.assessmentType !== 'career-launch') return yPosition;

    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Career Guidance', 20, yPosition);
    yPosition += 15;

    const careerSuggestions = this.getCareerSuggestions(result);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const careerLines = doc.splitTextToSize(careerSuggestions, 170);
    doc.text(careerLines, 25, yPosition);
    yPosition += careerLines.length * 6 + 15;

    return yPosition;
  }

  private addFooter(doc: jsPDF, config: ReportConfig): void {
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      if (config.branding.footer) {
        doc.text(config.branding.footer, 20, 285);
      }
      
      doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 290);
    }
  }

  // Helper methods
  private getAssessmentTitle(assessmentType: string): string {
    // Getting assessment title for type
    
    const titles: Record<string, string> = {
      'career-launch': 'CareerLaunch Assessment Report',
      'career': 'CareerLaunch Assessment Report',
      'cair-personality': 'CAIR+ Personality Assessment Report',
      'cair': 'CAIR+ Personality Assessment Report',
      'cairplus': 'CAIR+ Personality Assessment Report',
      'burnout-prevention': 'Burnout Prevention Assessment Report',
      'burnout': 'Burnout Prevention Assessment Report',
      'stress-resilience': 'Burnout Prevention Assessment Report',
      'stress': 'Burnout Prevention Assessment Report',
      'cultural-intelligence': 'Cultural Intelligence Assessment Report',
      'cultural': 'Cultural Intelligence Assessment Report',
      'communication': 'Communication Assessment Report',
      'communication-styles': 'Communication Styles Assessment Report',
      'digital-wellness': 'Digital Wellness Assessment Report',
      'digital': 'Digital Wellness Assessment Report',
      'faith-values': 'Faith & Values Assessment Report',
      'leadership': 'Leadership Assessment Report',
      'genz': 'Gen Z Workplace Assessment Report',
      'genz-assessment': 'Gen Z Workplace Assessment Report',
      'genz-workplace': 'Gen Z Workplace Assessment Report',
      'emotional-intelligence': 'Emotional Intelligence Assessment Report',
      'emotional': 'Emotional Intelligence Assessment Report'
    };
    
    const title = titles[assessmentType] || `${assessmentType.toUpperCase()} Assessment Report`;
    // Assessment title selected
    return title;
  }

  private formatDimensionName(dimension: string): string {
    return dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private getScoreColor(score: number): [number, number, number] {
    if (score >= 85) return [76, 175, 80]; // Green
    if (score >= 70) return [255, 193, 7]; // Amber
    if (score >= 55) return [255, 152, 0]; // Orange
    return [244, 67, 54]; // Red
  }

  private getDimensionInterpretation(dimension: string, score: number): string {
    if (score >= 85) return `Exceptional ${this.formatDimensionName(dimension).toLowerCase()} - a significant strength area.`;
    if (score >= 70) return `Strong ${this.formatDimensionName(dimension).toLowerCase()} - performing well in this area.`;
    if (score >= 55) return `Moderate ${this.formatDimensionName(dimension).toLowerCase()} - room for improvement.`;
    return `Developing ${this.formatDimensionName(dimension).toLowerCase()} - priority area for development.`;
  }

  private generateKeyInsights(result: UnifiedAssessmentResult): string {
    const scoreLevel = result.overallScore >= 85 ? 'exceptional' : 
                      result.overallScore >= 70 ? 'strong' : 
                      result.overallScore >= 55 ? 'developing' : 'emerging';
    
    return `This comprehensive assessment reveals ${scoreLevel} performance across multiple dimensions. ` +
           `Key strengths include ${result.strengths.slice(0, 2).join(' and ').toLowerCase()}, ` +
           `while development opportunities exist in ${result.developmentAreas.slice(0, 2).join(' and ').toLowerCase()}. ` +
           `The candidate demonstrates strong potential for growth and professional development.`;
  }

  private getValidityInterpretation(validity: any): string {
    if (validity.consistency >= 85 && validity.engagement === 'high') {
      return 'Assessment results demonstrate high validity with consistent responses and strong engagement.';
    } else if (validity.consistency >= 70) {
      return 'Assessment results show good validity with acceptable response patterns.';
    } else {
      return 'Assessment results should be interpreted with caution due to response consistency patterns.';
    }
  }

  private getCareerSuggestions(result: UnifiedAssessmentResult): string {
    const suggestions = [
      'Consider roles that leverage your strongest dimension areas',
      'Explore positions that provide growth opportunities in developing areas',
      'Focus on building experience in your identified strength areas',
      'Seek mentorship in areas highlighted for development'
    ];
    return suggestions.join('. ') + '.';
  }

  private generateFileName(result: UnifiedAssessmentResult, config: ReportConfig): string {
    const cleanName = result.candidateInfo.name.replace(/[^a-zA-Z0-9]/g, '-');
    const dateStr = new Date().toISOString().split('T')[0];
    return `${result.assessmentType}-${config.reportFormat}-${cleanName}-${dateStr}.pdf`;
  }

  private async logReportGeneration(result: UnifiedAssessmentResult, config: ReportConfig): Promise<void> {
    try {
      await supabase.from('analytics_events').insert({
        event_type: 'report_generated',
        entity_type: 'assessment',
        entity_id: result.assessmentId,
        metadata: {
          assessment_type: result.assessmentType,
          report_format: config.reportFormat,
          candidate_name: result.candidateInfo.name,
          overall_score: result.overallScore
        }
      });
    } catch (error) {
      console.error('Failed to log report generation:', error);
    }
  }
}

export default ConsolidatedReportService;