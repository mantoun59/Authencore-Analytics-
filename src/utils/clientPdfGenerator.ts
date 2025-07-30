import jsPDF from 'jspdf';

export interface SimplePdfData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    assessmentDate?: string;
    questionsAnswered?: number;
    timeSpent?: string;
    reliabilityScore?: number;
    [key: string]: any;
  };
  overallScore?: number;
  dimensions?: Array<{ name: string; score: number; description?: string; level?: string }> | Record<string, number>;
  strengths?: string[];
  developmentAreas?: string[];
  recommendations?: string[];
  careerMatches?: Array<{ title: string; match: number; description?: string }>;
  profile?: string;
  [key: string]: any;
}

export const generateClientSidePdf = (data: SimplePdfData): void => {
  try {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors
    const primaryColor = [41, 98, 255] as [number, number, number];
    const accentColor = [16, 185, 129] as [number, number, number];

    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AuthenCore Assessment Platform', 20, 30);
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(data.assessmentType || 'Assessment Report', 20, 70);
    
    yPosition = 90;

    // User Info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Candidate Information', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Name: ' + (data.userInfo.name || 'N/A'), 20, yPosition);
    yPosition += 8;
    doc.text('Email: ' + (data.userInfo.email || 'N/A'), 20, yPosition);
    yPosition += 8;
    
    if (data.userInfo.assessmentDate) {
      doc.text('Date: ' + data.userInfo.assessmentDate, 20, yPosition);
      yPosition += 8;
    }
    
    if (data.userInfo.reliabilityScore) {
      doc.text('Reliability: ' + data.userInfo.reliabilityScore.toString() + '%', 20, yPosition);
      yPosition += 8;
    }
    
    yPosition += 10;

    // Overall Score
    if (data.overallScore !== undefined) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Overall Score', 20, yPosition);
      yPosition += 10;
      
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(20, yPosition, 30, 20, 'F');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(data.overallScore.toString(), 25, yPosition + 13);
      
      doc.setTextColor(0, 0, 0);
      doc.text('/100', 55, yPosition + 13);
      yPosition += 30;
    }

    // Dimensions
    if (data.dimensions) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Assessment Dimensions', 20, yPosition);
      yPosition += 15;

      const dimensionArray = Array.isArray(data.dimensions) 
        ? data.dimensions 
        : Object.entries(data.dimensions).map(([key, value]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: typeof value === 'number' ? value : 0
          }));

      dimensionArray.forEach((dim) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(dim.name + ': ' + dim.score.toString(), 20, yPosition);
        
        // Simple score bar
        const barWidth = (dim.score / 100) * 100;
        doc.setFillColor(200, 200, 200);
        doc.rect(120, yPosition - 5, 100, 8, 'F');
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.rect(120, yPosition - 5, barWidth, 8, 'F');
        
        yPosition += 12;
      });
      yPosition += 10;
    }

    // Career Matches
    if (data.careerMatches && data.careerMatches.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Career Recommendations', 20, yPosition);
      yPosition += 15;

      data.careerMatches.slice(0, 5).forEach((match, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text((index + 1).toString() + '. ' + match.title + ' (' + match.match.toString() + '% match)', 20, yPosition);
        yPosition += 10;
      });
      yPosition += 10;
    }

    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      if (yPosition > 180) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Development Recommendations', 20, yPosition);
      yPosition += 15;

      data.recommendations.slice(0, 6).forEach((rec, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize((index + 1).toString() + '. ' + rec, 170);
        if (Array.isArray(lines)) {
          lines.forEach((line, lineIndex) => {
            doc.text(line, 20, yPosition + (lineIndex * 5));
          });
          yPosition += lines.length * 5 + 5;
        } else {
          doc.text(lines, 20, yPosition);
          yPosition += 10;
        }
      });
    }

    // Footer on all pages
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('AuthenCore Assessment - Confidential Report', 20, pageHeight - 10);
      doc.text('Page ' + i.toString() + ' of ' + totalPages.toString(), pageWidth - 40, pageHeight - 10);
    }

    // Save
    const fileName = (data.userInfo.name || 'Assessment').replace(/\s+/g, '_') + '_Report_' + 
                   new Date().toISOString().split('T')[0] + '.pdf';
    doc.save(fileName);

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF report');
  }
};