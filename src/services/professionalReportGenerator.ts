import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';

export interface ProfessionalReportConfig {
  assessmentType: string;
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    date: string;
  };
  results: any;
  reportType: 'individual' | 'employer';
  includeDistortion?: boolean;
  includeLogo?: boolean;
  includeCopyright?: boolean;
}

export class ProfessionalReportGenerator {
  private static instance: ProfessionalReportGenerator;
  
  static getInstance(): ProfessionalReportGenerator {
    if (!ProfessionalReportGenerator.instance) {
      ProfessionalReportGenerator.instance = new ProfessionalReportGenerator();
    }
    return ProfessionalReportGenerator.instance;
  }

  async generateReport(config: ProfessionalReportConfig): Promise<void> {
    try {
      // First try professional PDF generation
      await this.generateProfessionalPDF(config);
    } catch (error) {
      console.error('Professional PDF failed, using fallback:', error);
      // Fallback to jsPDF
      await this.generateFallbackPDF(config);
    }
  }

  private async generateProfessionalPDF(config: ProfessionalReportConfig): Promise<void> {
    const reportData = {
      assessmentType: config.assessmentType,
      candidateInfo: config.candidateInfo,
      results: config.results,
      reportType: config.reportType,
      includeDistortion: config.includeDistortion || true,
      includeLogo: config.includeLogo !== false,
      includeCopyright: config.includeCopyright !== false,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase.functions.invoke('generate-pdf-report', {
      body: reportData
    });

    if (error) throw error;

    if (data) {
      // Open in new window for printing
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(data);
        newWindow.document.close();
        
        // Auto-print after a delay
        setTimeout(() => {
          newWindow.focus();
          newWindow.print();
        }, 1000);
      }
    }
  }

  private async generateFallbackPDF(config: ProfessionalReportConfig): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with logo
    if (config.includeLogo) {
      try {
        const logoBase64 = await this.loadLogoAsBase64();
        pdf.addImage(logoBase64, 'PNG', 20, yPosition, 40, 30);
        yPosition += 35;
      } catch (error) {
        // Fallback to text logo
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(41, 128, 185);
        pdf.text('AuthenCore Analytics', 20, yPosition);
        yPosition += 15;
      }
    }

    // Report title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const title = this.getReportTitle(config.assessmentType, config.reportType);
    pdf.text(title, 20, yPosition);
    yPosition += 15;

    // Candidate information
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Candidate: ${config.candidateInfo.name}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Email: ${config.candidateInfo.email}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Date: ${config.candidateInfo.date}`, 20, yPosition);
    yPosition += 7;
    if (config.candidateInfo.position) {
      pdf.text(`Position: ${config.candidateInfo.position}`, 20, yPosition);
      yPosition += 7;
    }
    yPosition += 10;

    // Executive Summary
    yPosition = this.addExecutiveSummary(pdf, config, yPosition);

    // Detailed Results
    yPosition = this.addDetailedResults(pdf, config, yPosition);

    // Employer-specific content
    if (config.reportType === 'employer') {
      yPosition = this.addEmployerContent(pdf, config, yPosition);
    }

    // Distortion Analysis
    if (config.includeDistortion && config.results.distortionAnalysis) {
      yPosition = this.addDistortionAnalysis(pdf, config, yPosition);
    }

    // Footer with copyright
    if (config.includeCopyright) {
      this.addFooter(pdf);
    }

    // Download the PDF
    const fileName = `${config.assessmentType}-Report-${config.candidateInfo.name.replace(/\s+/g, '-')}.pdf`;
    pdf.save(fileName);
  }

  private getReportTitle(assessmentType: string, reportType: string): string {
    const typeMap: Record<string, string> = {
      'career_launch': 'CareerLaunch Assessment Report',
      'burnout_prevention': 'Burnout Prevention Index Report',
      'cultural_intelligence': 'Cultural Intelligence Assessment Report',
      'gen_z': 'Gen Z Workplace Assessment Report',
      'communication_styles': 'Communication Styles Assessment Report',
      'cair': 'CAIR+ Personality Assessment Report',
      'emotional_intelligence': 'Emotional Intelligence Assessment Report',
      'digital_wellness': 'Digital Wellness Assessment Report',
      'leadership': 'Leadership Assessment Report'
    };

    const baseTitle = typeMap[assessmentType] || 'Assessment Report';
    return reportType === 'employer' ? `${baseTitle} - Employer Version` : baseTitle;
  }

  private addExecutiveSummary(pdf: jsPDF, config: ProfessionalReportConfig, yPosition: number): number {
    // Add new page if needed
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Overall score
    if (config.results.overallScore !== undefined) {
      pdf.text(`Overall Score: ${config.results.overallScore}%`, 20, yPosition);
      yPosition += 7;
    }

    // Key insights
    if (config.results.keyInsights) {
      pdf.text('Key Insights:', 20, yPosition);
      yPosition += 7;
      config.results.keyInsights.slice(0, 3).forEach((insight: string) => {
        const lines = pdf.splitTextToSize(`• ${insight}`, pdf.internal.pageSize.getWidth() - 40);
        pdf.text(lines, 25, yPosition);
        yPosition += lines.length * 5;
      });
    }

    // Top strengths
    if (config.results.topStrengths || config.results.strengths) {
      const strengths = config.results.topStrengths || config.results.strengths;
      pdf.text('Top Strengths:', 20, yPosition);
      yPosition += 7;
      strengths.slice(0, 3).forEach((strength: string) => {
        pdf.text(`• ${strength}`, 25, yPosition);
        yPosition += 7;
      });
    }

    // Development areas
    if (config.results.developmentAreas || config.results.keyDevelopmentAreas) {
      const areas = config.results.developmentAreas || config.results.keyDevelopmentAreas;
      pdf.text('Development Areas:', 20, yPosition);
      yPosition += 7;
      areas.slice(0, 3).forEach((area: string) => {
        pdf.text(`• ${area}`, 25, yPosition);
        yPosition += 7;
      });
    }

    return yPosition + 10;
  }

  private addDetailedResults(pdf: jsPDF, config: ProfessionalReportConfig, yPosition: number): number {
    // Add new page if needed
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Detailed Analysis', 20, yPosition);
    yPosition += 15;

    // Dimension scores
    if (config.results.dimensions || config.results.dimensionScores) {
      const dimensions = config.results.dimensions || config.results.dimensionScores;
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dimension Scores:', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');

      Object.entries(dimensions).forEach(([dimension, score]: [string, any]) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        const scoreValue = typeof score === 'object' ? score.score || score.value || 0 : score;
        pdf.text(`${dimension}: ${Math.round(scoreValue)}%`, 25, yPosition);
        yPosition += 7;
      });
    }

    return yPosition + 10;
  }

  private addEmployerContent(pdf: jsPDF, config: ProfessionalReportConfig, yPosition: number): number {
    // Add new page if needed
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Employer Insights', 20, yPosition);
    yPosition += 15;

    // Interview questions
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommended Interview Questions:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const interviewQuestions = this.getInterviewQuestions(config.assessmentType, config.results);
    interviewQuestions.forEach((question: string) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      const lines = pdf.splitTextToSize(`• ${question}`, pdf.internal.pageSize.getWidth() - 40);
      pdf.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 2;
    });

    yPosition += 10;

    // Coaching recommendations
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Coaching Recommendations:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const coachingRecs = this.getCoachingRecommendations(config.assessmentType, config.results);
    coachingRecs.forEach((rec: string) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      const lines = pdf.splitTextToSize(`• ${rec}`, pdf.internal.pageSize.getWidth() - 40);
      pdf.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 2;
    });

    return yPosition + 10;
  }

  private addDistortionAnalysis(pdf: jsPDF, config: ProfessionalReportConfig, yPosition: number): number {
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Response Validity Analysis', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const distortion = config.results.distortionAnalysis;
    if (distortion) {
      pdf.text(`Reliability Score: ${distortion.score || 'N/A'}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Consistency Level: ${distortion.reliability || 'Medium'}`, 20, yPosition);
      yPosition += 7;
      
      if (distortion.interpretation) {
        pdf.text('Interpretation:', 20, yPosition);
        yPosition += 7;
        const lines = pdf.splitTextToSize(distortion.interpretation, pdf.internal.pageSize.getWidth() - 40);
        pdf.text(lines, 25, yPosition);
        yPosition += lines.length * 5;
      }
    }

    return yPosition + 10;
  }

  private addFooter(pdf: jsPDF): void {
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        '© 2024 AuthenCore Analytics. All rights reserved. Confidential assessment report.',
        20,
        pdf.internal.pageSize.getHeight() - 10
      );
    }
  }

  private getInterviewQuestions(assessmentType: string, results: any): string[] {
    const baseQuestions = [
      "Tell me about a time when you had to adapt to significant change at work.",
      "Describe a situation where you had to work with a difficult colleague.",
      "How do you prioritize tasks when facing multiple deadlines?",
      "Give an example of how you've handled constructive criticism.",
      "Describe your approach to learning new skills or technologies."
    ];

    // Add assessment-specific questions based on results
    const specificQuestions: Record<string, string[]> = {
      'career_launch': [
        "What type of work environment brings out your best performance?",
        "How do you see your career developing over the next five years?"
      ],
      'burnout_prevention': [
        "How do you maintain work-life balance during busy periods?",
        "What strategies do you use to manage workplace stress?"
      ],
      'leadership': [
        "Describe your leadership style and how you motivate others.",
        "Tell me about a time you had to make a difficult decision as a leader."
      ]
    };

    return [...baseQuestions, ...(specificQuestions[assessmentType] || [])];
  }

  private getCoachingRecommendations(assessmentType: string, results: any): string[] {
    const baseRecommendations = [
      "Provide regular feedback and recognition for achievements",
      "Set clear expectations and measurable goals",
      "Offer opportunities for professional development",
      "Create a supportive work environment that encourages growth"
    ];

    // Add assessment-specific recommendations
    const specificRecs: Record<string, string[]> = {
      'burnout_prevention': [
        "Monitor workload and stress levels regularly",
        "Encourage use of available wellness resources",
        "Promote healthy work-life boundaries"
      ],
      'communication_styles': [
        "Adapt communication style to match the individual's preferences",
        "Provide multiple channels for feedback and discussion"
      ],
      'leadership': [
        "Provide leadership development opportunities",
        "Assign mentoring or coaching roles when appropriate"
      ]
    };

    return [...baseRecommendations, ...(specificRecs[assessmentType] || [])];
  }

  private async loadLogoAsBase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Unable to get canvas context'));
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
}

export const professionalReportGenerator = ProfessionalReportGenerator.getInstance();

// Export convenience function
export const generateProfessionalReport = async (config: ProfessionalReportConfig): Promise<void> => {
  return professionalReportGenerator.generateReport(config);
};