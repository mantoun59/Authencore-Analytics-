// HTML report generation - jsPDF removed
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
    // Enhanced data for comprehensive analysis
    stressIndicators?: {
      workload: number;
      interpersonal: number;
      control: number;
      recognition: number;
      fairness: number;
      values: number;
    };
    wellnessMetrics?: {
      physicalHealth: number;
      mentalHealth: number;
      workLifeBalance: number;
      jobSatisfaction: number;
    };
    comparativeData?: {
      industryAverage: number;
      roleAverage: number;
      previousAssessment?: number;
    };
  };
}

// Helper functions for enhanced report generation
const addPageHeader = (pdf: any, pageWidth: number, title: string) => {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(150, 150, 150);
  pdf.text(title, pageWidth / 2, 15, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  return 25;
};

const addSectionSeparator = (pdf: any, pageWidth: number, y: number) => {
  pdf.setDrawColor(220, 220, 220);
  pdf.line(20, y, pageWidth - 20, y);
  return y + 10;
};

const createChart = (pdf: any, data: any[], x: number, y: number, width: number, height: number, type: 'bar' | 'line' = 'bar') => {
  const maxValue = Math.max(...data.map(d => d.value));
  const barSpacing = width / data.length;
  
  // Draw chart frame
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(x, y, width, height);
  
  // Draw bars or line
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * height;
    const barX = x + (index * barSpacing) + (barSpacing * 0.1);
    const barWidth = barSpacing * 0.8;
    
    if (type === 'bar') {
      const color = item.value >= 70 ? [76, 175, 80] : 
                   item.value >= 40 ? [255, 193, 7] : [244, 67, 54];
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.rect(barX, y + height - barHeight, barWidth, barHeight, 'F');
    }
    
    // Add labels
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(item.label.substring(0, 8), barX + barWidth/2, y + height + 10, { align: 'center' });
    pdf.text(`${item.value}%`, barX + barWidth/2, y + height - barHeight - 2, { align: 'center' });
  });
};

export const generateDetailedBurnoutReport = async (config: BurnoutReportConfig): Promise<void> => {
  // Generate HTML report instead of PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Burnout Prevention Assessment Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #008080; }
    .metric { margin: 10px 0; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>Comprehensive Burnout Prevention Assessment Report</h1>
  <h2>Generated for: ${config.candidateInfo.name}</h2>
  <p>Assessment Date: ${config.candidateInfo.date}</p>
  <p>Overall Score: ${config.results.overallScore}/100</p>
  <p>Risk Level: ${config.results.burnoutRisk}</p>
  <p>Generated on: ${new Date().toLocaleDateString()}</p>
</body>
</html>`;

  const reportWindow = window.open('', '_blank', 'width=900,height=700');
  if (reportWindow) {
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  }
};