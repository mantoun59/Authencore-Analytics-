import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImage from '@/assets/final-logo.png';

export interface ReportData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    position?: string;
    company?: string;
  };
  overallScore: number;
  dimensions: Array<{
    name: string;
    score: number;
  }>;
  includeLogo?: boolean;
  organizationName?: string;
  customBranding?: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

const assessmentTitles: Record<string, string> = {
  'cair-personality': 'CAIR Personality Assessment',
  'career-launch': 'Career Launch Assessment',
  'communication-styles': 'Communication Styles Assessment',
  'emotional-intelligence': 'Emotional Intelligence Assessment',
  'leadership': 'Leadership Assessment',
  'faith-values': 'Faith & Values Integration',
  'burnout-prevention': 'Burnout Prevention Assessment',
  'genz-workplace': 'Gen Z Workplace Assessment',
  'digital-wellness': 'Digital Wellness Assessment'
};

const reportTitles: Record<string, string> = {
  'cair-personality': 'CAIR Personality Assessment Report',
  'career-launch': 'Career Launch Assessment Report',
  'communication-styles': 'Communication Styles Assessment Report',
  'emotional-intelligence': 'Emotional Intelligence Assessment Report',
  'leadership': 'Leadership Assessment Report',
  'faith-values': 'Faith & Values Integration Report',
  'burnout-prevention': 'Burnout Prevention Assessment Report',
  'genz-workplace': 'Gen Z Workplace Assessment Report',
  'digital-wellness': 'Digital Wellness Assessment Report'
};

async function getLogoBase64(): Promise<string> {
  try {
    const response = await fetch(logoImage);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading logo:', error);
    return '';
  }
}

function getScoreInterpretation(score: number): string {
  if (score >= 85) return 'Excellent performance with exceptional capabilities';
  if (score >= 70) return 'Strong performance with notable strengths';
  if (score >= 60) return 'Good performance with balanced capabilities';
  if (score >= 40) return 'Developing performance with growth opportunities';
  return 'Emerging capabilities with significant development potential';
}

function getAssessmentDimensionsTitle(assessmentType: string): string {
  const titles: Record<string, string> = {
    'cair-personality': 'Personality Dimensions',
    'career-launch': 'Career Readiness Dimensions',
    'communication-styles': 'Communication Dimensions',
    'emotional-intelligence': 'Emotional Intelligence Dimensions',
    'leadership': 'Leadership Dimensions',
    'faith-values': 'Values Alignment Dimensions',
    'burnout-prevention': 'Resilience & Prevention Dimensions',
    'genz-workplace': 'Workplace Preference Dimensions',
    'digital-wellness': 'Digital Wellness Dimensions'
  };
  return titles[assessmentType] || 'Assessment Dimensions';
}

export async function generateHtmlReport(data: ReportData): Promise<void> {
  // Always include logo and use consistent branding
  const logoBase64 = await getLogoBase64();
  const organizationName = data.organizationName || 'AuthenCore Analytics';
  const currentDate = new Date().toLocaleDateString();
  const primaryColor = data.customBranding?.primaryColor || '#2563eb';
  const secondaryColor = data.customBranding?.secondaryColor || '#1e293b';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${assessmentTitles[data.assessmentType] || 'Assessment Report'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #ffffff;
        }
        
        .report-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 3px solid ${primaryColor};
        }
        
        .logo {
          max-width: 200px;
          height: auto;
          margin-bottom: 20px;
        }
        
        .company-name {
          color: ${primaryColor};
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .company-tagline {
          color: ${secondaryColor};
          font-size: 16px;
          font-style: italic;
        }
        
        .report-title {
          color: ${secondaryColor};
          font-size: 32px;
          font-weight: bold;
          margin: 30px 0 20px 0;
        }
        
        .candidate-info {
          background: linear-gradient(135deg, ${primaryColor}15, ${primaryColor}25);
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 30px;
          border-left: 5px solid ${primaryColor};
        }
        
        .candidate-info h3 {
          color: ${secondaryColor};
          margin-bottom: 15px;
          font-size: 20px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-weight: bold;
          color: ${secondaryColor};
          margin-bottom: 5px;
        }
        
        .info-value {
          color: #555;
        }
        
        .overall-score {
          text-align: center;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd);
          color: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
        }
        
        .overall-score h2 {
          font-size: 24px;
          margin-bottom: 15px;
        }
        
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: white;
          color: ${primaryColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          margin: 20px auto;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .dimensions-section {
          margin: 40px 0;
        }
        
        .dimensions-section h2 {
          color: ${secondaryColor};
          font-size: 24px;
          margin-bottom: 25px;
          text-align: center;
        }
        
        .dimension-item {
          background: #f8fafc;
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 10px;
          border-left: 5px solid ${primaryColor};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .dimension-name {
          font-weight: bold;
          color: ${secondaryColor};
          font-size: 18px;
        }
        
        .dimension-score {
          font-size: 24px;
          font-weight: bold;
          color: ${primaryColor};
        }
        
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid #e5e7eb;
          color: #666;
        }
        
        .footer-logo {
          max-width: 100px;
          height: auto;
          margin-bottom: 15px;
          opacity: 0.7;
        }
        
        .disclaimer {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          font-size: 14px;
          color: #666;
          border: 1px solid #e5e7eb;
        }
        
        @media print {
          .report-container {
            padding: 20px;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <img src="data:image/png;base64,${logoBase64}" alt="Logo" class="logo" />
          <div class="company-name">${organizationName}</div>
          <div class="company-tagline">Professional Assessment Platform</div>
          <div class="report-title">${reportTitles[data.assessmentType] || 'Assessment Report'}</div>
        </div>
        
        <div class="candidate-info">
          <h3>Candidate Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span class="info-value">${data.userInfo.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${data.userInfo.email}</span>
            </div>
            ${data.userInfo.position ? `
            <div class="info-item">
              <span class="info-label">Position:</span>
              <span class="info-value">${data.userInfo.position}</span>
            </div>` : ''}
            ${data.userInfo.company ? `
            <div class="info-item">
              <span class="info-label">Company:</span>
              <span class="info-value">${data.userInfo.company}</span>
            </div>` : ''}
            <div class="info-item">
              <span class="info-label">Assessment Date:</span>
              <span class="info-value">${currentDate}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Report Type:</span>
              <span class="info-value">${assessmentTitles[data.assessmentType] || 'Professional Assessment'}</span>
            </div>
          </div>
        </div>
        
        <div class="overall-score">
          <h2>Overall Assessment Score</h2>
          <div class="score-circle">${data.overallScore}%</div>
          <p>${getScoreInterpretation(data.overallScore)}</p>
        </div>
        
        <div class="dimensions-section">
          <h2>${getAssessmentDimensionsTitle(data.assessmentType)}</h2>
          ${data.dimensions.map(dimension => `
            <div class="dimension-item">
              <span class="dimension-name">${dimension.name}</span>
              <span class="dimension-score">${dimension.score}%</span>
            </div>
          `).join('')}
        </div>
        
        <div class="disclaimer">
          <strong>Professional Assessment Disclaimer:</strong><br>
          This assessment provides insights based on responses to standardized questions. Results should be considered as one factor among many in professional evaluation. For comprehensive assessment, consider additional evaluation methods and professional consultation.
        </div>
        
        <div class="footer">
          <img src="data:image/png;base64,${logoBase64}" alt="Logo" class="footer-logo" />
          <p>Generated by ${organizationName}</p>
          <p>Professional Assessment Platform | www.authencore.org</p>
          <p>Report Date: ${currentDate}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a temporary element to render the HTML
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;
  tempElement.style.position = 'absolute';
  tempElement.style.left = '-9999px';
  tempElement.style.top = '-9999px';
  tempElement.style.width = '800px';
  document.body.appendChild(tempElement);

  try {
    // Convert to canvas and then to PDF
    const canvas = await html2canvas(tempElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${data.assessmentType}-report-${timestamp}.pdf`;

    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(tempElement);
  }
}