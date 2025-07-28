import jsPDF from 'jspdf';

export interface SimplePdfData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    [key: string]: any;
  };
  overallScore?: number;
  dimensions?: Array<{ name: string; score: number }> | Record<string, number>;
  [key: string]: any;
}

export const generateClientSidePdf = (data: SimplePdfData): void => {
  try {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.assessmentType} Assessment Report`, 20, yPosition);
    yPosition += 20;

    // User info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${data.userInfo.name}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Email: ${data.userInfo.email}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    // Overall Score
    if (data.overallScore !== undefined) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Overall Score: ${data.overallScore}/100`, 20, yPosition);
      yPosition += 15;
    }

    // Dimensions
    if (data.dimensions) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Dimension Scores:', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      if (Array.isArray(data.dimensions)) {
        data.dimensions.forEach((dim) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          const dimensionName = String(dim.name || 'Unknown');
          const dimensionScore = typeof dim.score === 'number' ? dim.score : 0;
          doc.text(`${dimensionName}: ${dimensionScore}/100`, 25, yPosition);
          yPosition += 8;
        });
      } else {
        Object.entries(data.dimensions).forEach(([key, value]) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          const dimensionName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const dimensionScore = typeof value === 'number' ? value : 0;
          doc.text(`${dimensionName}: ${dimensionScore}/100`, 25, yPosition);
          yPosition += 8;
        });
      }
    }

    // Save PDF
    const fileName = `${data.assessmentType.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};