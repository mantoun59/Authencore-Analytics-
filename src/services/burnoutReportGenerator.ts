import jsPDF from 'jspdf';
import { formatPDFLegalFooter } from '@/utils/legalNotices';

export interface BurnoutReportConfig {
  candidateInfo: {
    name: string;
    email: string;
    date: string;
  };
  results: {
    overallScore: number;
    percentileScore: number;
    resilienceProfile: string;
    dimensionScores: any[];
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    burnoutRisk: string;
    stressManagementLevel: string;
  };
}

export const generateDetailedBurnoutReport = async (config: BurnoutReportConfig): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      currentY = 20;
    }
  };

  // Helper function to add wrapped text
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 11) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * (fontSize * 0.5);
  };

  // Header
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Burnout Prevention Assessment Report', pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated for: ${config.candidateInfo.name}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 8;
  pdf.text(`Date: ${config.candidateInfo.date}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 20;

  // Executive Summary
  checkPageBreak(60);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 20, currentY);
  currentY += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const summaryText = `Your Burnout Prevention Assessment reveals an overall resilience score of ${config.results.overallScore}/100, placing you in the ${config.results.percentileScore}th percentile. Your resilience profile is classified as "${config.results.resilienceProfile}" with a ${config.results.burnoutRisk.toLowerCase()} risk of burnout. Your stress management level is currently rated as "${config.results.stressManagementLevel}".`;
  
  const summaryHeight = addWrappedText(summaryText, 20, currentY, pageWidth - 40);
  currentY += summaryHeight + 15;

  // Risk Level Assessment
  checkPageBreak(50);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Burnout Risk Assessment', 20, currentY);
  currentY += 15;

  // Risk indicator box
  const riskColor = config.results.burnoutRisk === 'low' ? [76, 175, 80] : 
                   config.results.burnoutRisk === 'medium' ? [255, 193, 7] : [244, 67, 54];
  
  pdf.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  pdf.rect(20, currentY, pageWidth - 40, 25, 'F');
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text(`Burnout Risk Level: ${config.results.burnoutRisk.toUpperCase()}`, pageWidth / 2, currentY + 17, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  
  currentY += 35;

  // Dimension Scores
  checkPageBreak(80);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resilience Dimension Breakdown', 20, currentY);
  currentY += 15;

  config.results.dimensionScores.forEach((dimension: any) => {
    checkPageBreak(15);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dimension.name.charAt(0).toUpperCase() + dimension.name.slice(1), 20, currentY);
    
    // Score bar
    const barWidth = 100;
    const scoreWidth = (dimension.score / 100) * barWidth;
    
    pdf.setFillColor(230, 230, 230);
    pdf.rect(120, currentY - 5, barWidth, 8, 'F');
    
    const scoreColor = dimension.score >= 70 ? [76, 175, 80] : 
                      dimension.score >= 40 ? [255, 193, 7] : [244, 67, 54];
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.rect(120, currentY - 5, scoreWidth, 8, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${dimension.score}%`, 225, currentY);
    
    currentY += 15;
  });

  // Strengths Section
  checkPageBreak(60);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Strengths', 20, currentY);
  currentY += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  config.results.strengths.forEach((strength: string, index: number) => {
    checkPageBreak(10);
    pdf.text(`• ${strength}`, 25, currentY);
    currentY += 8;
  });
  
  currentY += 10;

  // Development Areas
  checkPageBreak(60);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Areas for Development', 20, currentY);
  currentY += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  config.results.challenges.forEach((challenge: string, index: number) => {
    checkPageBreak(10);
    pdf.text(`• ${challenge}`, 25, currentY);
    currentY += 8;
  });

  currentY += 10;

  // Recommendations
  checkPageBreak(80);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Personalized Recommendations', 20, currentY);
  currentY += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  config.results.recommendations.forEach((recommendation: string, index: number) => {
    checkPageBreak(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}. Action Item:`, 25, currentY);
    currentY += 8;
    
    pdf.setFont('helvetica', 'normal');
    const recHeight = addWrappedText(recommendation, 30, currentY, pageWidth - 60);
    currentY += recHeight + 10;
  });

  // Wellness Plan
  checkPageBreak(80);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('30-Day Burnout Prevention Plan', 20, currentY);
  currentY += 15;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const wellnessPlan = [
    'Week 1-2: Focus on stress awareness and early warning signs recognition',
    'Week 2-3: Implement boundary-setting strategies and workload management techniques',
    'Week 3-4: Develop coping mechanisms and resilience-building practices',
    'Ongoing: Regular check-ins and progress monitoring'
  ];

  wellnessPlan.forEach((week: string) => {
    checkPageBreak(15);
    const weekHeight = addWrappedText(`• ${week}`, 25, currentY, pageWidth - 50);
    currentY += weekHeight + 8;
  });

  // Add legal footer
  checkPageBreak(50);
  const currentPageHeight = pdf.internal.pageSize.getHeight();
  const footerY = currentPageHeight - 40;
  
  // Add separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, footerY - 10, pageWidth - 20, footerY - 10);

  // Add legal notices
  const legalLines = formatPDFLegalFooter();
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);

  let footerCurrentY = footerY;
  legalLines.forEach((line, index) => {
    if (line.trim()) {
      if (index === 0 || index === 1) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      if (line.length > 80) {
        const wrappedLines = pdf.splitTextToSize(line, pageWidth - 40);
        wrappedLines.forEach((wrappedLine: string) => {
          pdf.text(wrappedLine, 20, footerCurrentY);
          footerCurrentY += 8;
        });
      } else {
        pdf.text(line, 20, footerCurrentY);
        footerCurrentY += 8;
      }
    } else {
      footerCurrentY += 4;
    }
  });
  
  // Download the PDF
  const fileName = `Burnout-Prevention-Report-${config.candidateInfo.name.replace(/\s+/g, '-')}.pdf`;
  pdf.save(fileName);
};