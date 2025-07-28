import jsPDF from 'jspdf';

export interface SimplePdfData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
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

    // Header with styling
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(`${data.assessmentType} Assessment Report`, 20, yPosition);
    yPosition += 15;

    // Decorative line
    doc.setDrawColor(100, 149, 237);
    doc.setLineWidth(2);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;

    // User info section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('Candidate Information', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Name: ${data.userInfo.name}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Email: ${data.userInfo.email}`, 25, yPosition);
    yPosition += 6;
    if (data.userInfo.position) {
      doc.text(`Position: ${data.userInfo.position}`, 25, yPosition);
      yPosition += 6;
    }
    if (data.userInfo.company || data.userInfo.organization) {
      doc.text(`Organization: ${data.userInfo.company || data.userInfo.organization}`, 25, yPosition);
      yPosition += 6;
    }
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 25, yPosition);
    yPosition += 15;

    // Overall Score with visual bar
    if (data.overallScore !== undefined) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Overall Assessment Score', 20, yPosition);
      yPosition += 10;

      // Score box with color coding
      const scoreColor = data.overallScore >= 80 ? [76, 175, 80] as [number, number, number] : 
                        data.overallScore >= 60 ? [255, 193, 7] as [number, number, number] : [244, 67, 54] as [number, number, number];
      doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      doc.rect(25, yPosition, 40, 15, 'F');
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`${data.overallScore}`, 30, yPosition + 10);
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('/100', 70, yPosition + 10);

      // Performance level
      const level = data.overallScore >= 85 ? 'Excellent' : 
                   data.overallScore >= 70 ? 'Good' : 
                   data.overallScore >= 55 ? 'Developing' : 'Needs Improvement';
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Performance Level: ${level}`, 80, yPosition + 10);
      yPosition += 25;
    }

    // Profile summary
    if (data.profile) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Assessment Profile', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const profileLines = doc.splitTextToSize(data.profile, 170);
      doc.text(profileLines, 25, yPosition);
      yPosition += profileLines.length * 5 + 10;
    }

    // Dimension Analysis with detailed scoring
    if (data.dimensions && (Array.isArray(data.dimensions) ? data.dimensions.length > 0 : Object.keys(data.dimensions).length > 0)) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Detailed Dimension Analysis', 20, yPosition);
      yPosition += 15;

      const dimensionArray = Array.isArray(data.dimensions) 
        ? data.dimensions 
        : Object.entries(data.dimensions).map(([key, value]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: typeof value === 'number' ? value : 0,
            description: `Assessment of ${key.replace(/_/g, ' ').toLowerCase()}`,
            level: typeof value === 'number' ? (value >= 80 ? 'Strong' : value >= 60 ? 'Moderate' : 'Developing') : 'Developing'
          }));

      dimensionArray.forEach((dim, index) => {
        if (yPosition > 240) {
          doc.addPage();
          yPosition = 20;
        }

        // Dimension name
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(`${index + 1}. ${dim.name}`, 25, yPosition);
        yPosition += 8;

        // Score bar visualization
        const dimScore = typeof dim.score === 'number' ? dim.score : 0;
        const barWidth = (dimScore / 100) * 120;
        const barColor = dimScore >= 80 ? [76, 175, 80] as [number, number, number] : 
                        dimScore >= 60 ? [255, 193, 7] as [number, number, number] : [244, 67, 54] as [number, number, number];
        
        doc.setFillColor(barColor[0], barColor[1], barColor[2]);
        doc.rect(30, yPosition, barWidth, 8, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(30, yPosition, 120, 8);
        
        // Score text
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text(`${dimScore}/100`, 155, yPosition + 5);
        
        // Level indicator
        if (dim.level) {
          doc.setTextColor(60, 60, 60);
          doc.text(`(${dim.level})`, 155, yPosition + 12);
        }
        
        yPosition += 15;

        // Description if available
        if (dim.description) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(dim.description, 140);
          doc.text(descLines, 30, yPosition);
          yPosition += descLines.length * 4 + 8;
        }
      });
      yPosition += 10;
    }

    // Strengths section
    if (data.strengths && data.strengths.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(76, 175, 80);
      doc.text('Key Strengths', 20, yPosition);
      yPosition += 10;

      data.strengths.forEach((strength, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(`• ${strength}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Development Areas
    if (data.developmentAreas && data.developmentAreas.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 152, 0);
      doc.text('Development Opportunities', 20, yPosition);
      yPosition += 10;

      data.developmentAreas.forEach((area, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(`• ${area}`, 25, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Career Matches (for career assessments)
    if (data.careerMatches && data.careerMatches.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 149, 237);
      doc.text('Career Match Recommendations', 20, yPosition);
      yPosition += 10;

      data.careerMatches.slice(0, 5).forEach((match, index) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(`${index + 1}. ${match.title}`, 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`Match: ${match.match}%`, 150, yPosition);
        yPosition += 8;

        if (match.description) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const descLines = doc.splitTextToSize(match.description, 160);
          doc.text(descLines, 30, yPosition);
          yPosition += descLines.length * 4 + 5;
        }
      });
      yPosition += 10;
    }

    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(156, 39, 176);
      doc.text('Personalized Recommendations', 20, yPosition);
      yPosition += 10;

      data.recommendations.slice(0, 8).forEach((recommendation, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const recLines = doc.splitTextToSize(`${index + 1}. ${recommendation}`, 170);
        doc.text(recLines, 25, yPosition);
        yPosition += recLines.length * 5 + 3;
      });
    }

    // Footer
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('Confidential Assessment Report', 20, 285);
      doc.text(`Page ${i} of ${totalPages}`, 170, 285);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 290);
    }

    // Save PDF
    const fileName = `${data.assessmentType.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};