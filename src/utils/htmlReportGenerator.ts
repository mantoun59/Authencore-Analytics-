import finalLogo from '../assets/final-logo.png';

export interface HtmlReportData {
  assessmentType: string;
  reportType?: 'standard' | 'advisor' | 'employer';
  userInfo: {
    name: string;
    email: string;
    assessmentDate?: string;
    questionsAnswered?: number;
    timeSpent?: string;
    reliabilityScore?: number;
    reportId?: string;
    [key: string]: any;
  };
  overallScore?: number;
  dimensions?: Array<{ name: string; score: number; description?: string; level?: string }> | Record<string, number>;
  strengths?: string[];
  developmentAreas?: string[];
  recommendations?: string[];
  careerMatches?: Array<{ title: string; match: number; description?: string }>;
  profile?: string;
  riskFlags?: string[];
  validityLevel?: string;
  riasecResults?: Record<string, number>;
  aptitudeResults?: Record<string, number>;
  [key: string]: any;
}

// Generate HTML report that can be displayed or printed
export const generateHtmlReport = async (data: HtmlReportData): Promise<void> => {
  console.log('Generating HTML report for:', data.userInfo?.name);
  
  try {
    if (!data || !data.userInfo?.name || !data.userInfo?.email) {
      throw new Error('Missing required user information');
    }
    
    // Create HTML report content
    const htmlContent = createHtmlReportContent(data);
    
    // Open in new window for viewing/printing
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (!reportWindow) {
      throw new Error('Unable to open report window. Please allow popups for this site.');
    }
    
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    
    // Auto-focus the window
    reportWindow.onload = () => {
      reportWindow.focus();
    };
    
    console.log('HTML report generated successfully');
    
  } catch (error) {
    console.error('Report generation failed:', error);
    alert(`Report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// Create the complete HTML content for the report
const createHtmlReportContent = (data: HtmlReportData): string => {
  const reportTitle = getReportTitle(data.assessmentType);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - ${data.userInfo.name}</title>
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
      background: white;
    }
    
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .report-header {
      background: linear-gradient(135deg, #008080, #006666);
      color: white;
      padding: 30px;
      margin: -20px -20px 30px -20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: white;
      border-radius: 8px;
      padding: 8px;
    }
    
    .report-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .report-subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .profile-section {
      background: #f8fafc;
      border: 2px solid #008080;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .profile-header {
      background: #008080;
      color: white;
      padding: 10px 15px;
      margin: -20px -20px 15px -20px;
      border-radius: 6px 6px 0 0;
      font-weight: bold;
    }
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .score-section {
      background: #e0f2fe;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    
    .overall-score {
      font-size: 48px;
      font-weight: bold;
      color: #008080;
      margin: 10px 0;
    }
    
    .score-label {
      font-size: 16px;
      color: #64748b;
    }
    
    .dimensions-section {
      margin: 30px 0;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
      margin: 30px 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 3px solid #008080;
    }
    
    .dimension-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }
    
    .dimension-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .dimension-name {
      font-weight: bold;
      font-size: 16px;
    }
    
    .dimension-score {
      font-size: 18px;
      font-weight: bold;
      color: #008080;
    }
    
    .progress-bar {
      background: #e2e8f0;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      margin: 10px 0;
    }
    
    .progress-fill {
      height: 100%;
      background: #008080;
      border-radius: 6px;
    }
    
    .recommendations-section {
      background: #f0fdf4;
      border: 1px solid #22c55e;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .recommendation-item {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 6px;
      border-left: 4px solid #22c55e;
    }
    
    .career-matches {
      margin: 30px 0;
    }
    
    .career-item {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .career-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 5px;
    }
    
    .career-match {
      font-size: 16px;
      font-weight: bold;
      color: #22c55e;
      margin-bottom: 10px;
    }
    
    .print-button {
      background: #008080;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      margin: 20px 0;
    }
    
    .print-button:hover {
      background: #006666;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    
    @media print {
      .print-button { display: none; }
      body { margin: 0; }
      .report-container { max-width: none; margin: 0; padding: 15px; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <img src="${finalLogo}" alt="AuthenCore Analytics" class="logo" />
      <div class="report-title">${reportTitle}</div>
      <div class="report-subtitle">Professional Assessment Report</div>
    </div>
    
    <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
    
    <div class="profile-section">
      <div class="profile-header">👤 Participant Information</div>
      <div class="profile-grid">
        <div><strong>Name:</strong> ${data.userInfo.name}</div>
        <div><strong>Email:</strong> ${data.userInfo.email}</div>
        <div><strong>Assessment Date:</strong> ${formatDate(data.userInfo.assessmentDate)}</div>
        <div><strong>Report ID:</strong> ${data.userInfo.reportId || generateReportId()}</div>
        ${data.userInfo.questionsAnswered ? `<div><strong>Questions Answered:</strong> ${data.userInfo.questionsAnswered}</div>` : ''}
        ${data.userInfo.timeSpent ? `<div><strong>Time Spent:</strong> ${data.userInfo.timeSpent}</div>` : ''}
      </div>
    </div>
    
    ${data.overallScore !== undefined ? `
    <div class="score-section">
      <div class="overall-score">${data.overallScore}</div>
      <div class="score-label">Overall Assessment Score</div>
    </div>
    ` : ''}
    
    ${generateDimensionsSection(data)}
    
    ${generateRecommendationsSection(data)}
    
    ${generateCareerMatchesSection(data)}
    
    <div class="footer">
      <p>This report was generated on ${new Date().toLocaleDateString()} using advanced psychometric analysis.</p>
      <p>© ${new Date().getFullYear()} AuthenCore Analytics - Confidential Assessment Report</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Helper functions
const getReportTitle = (assessmentType: string): string => {
  const titles: Record<string, string> = {
    'career-launch': 'Career Launch Assessment',
    'communication-styles': 'Communication Styles Assessment',
    'emotional-intelligence': 'Emotional Intelligence Assessment',
    'leadership': 'Leadership Assessment',
    'faith-values': 'Faith & Values Assessment',
    'cair': 'CAIR Personality Assessment',
    'gen-z': 'Gen Z Workplace Assessment',
    'digital-wellness': 'Digital Wellness Assessment',
    'stress-resilience': 'Stress Resilience Assessment',
    'burnout-prevention': 'Burnout Prevention Assessment',
    'cultural-intelligence': 'Cultural Intelligence Assessment'
  };
  return titles[assessmentType] || 'Professional Assessment';
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return new Date().toLocaleDateString();
  return new Date(dateString).toLocaleDateString();
};

const generateReportId = (): string => {
  return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
};

const generateDimensionsSection = (data: HtmlReportData): string => {
  if (!data.dimensions) return '';
  
  let dimensions: Array<{ name: string; score: number }> = [];
  
  if (Array.isArray(data.dimensions)) {
    dimensions = data.dimensions;
  } else if (typeof data.dimensions === 'object') {
    dimensions = Object.entries(data.dimensions).map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      score: Number(value) || 0
    }));
  }
  
  if (dimensions.length === 0) return '';
  
  return `
    <div class="dimensions-section">
      <h2 class="section-title">📊 Assessment Dimensions</h2>
      ${dimensions.map(dim => `
        <div class="dimension-item">
          <div class="dimension-header">
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-score">${Math.round(dim.score)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(dim.score, 100)}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

const generateRecommendationsSection = (data: HtmlReportData): string => {
  if (!data.recommendations || data.recommendations.length === 0) return '';
  
  return `
    <div class="recommendations-section">
      <h2 class="section-title">💡 Development Recommendations</h2>
      ${data.recommendations.map((rec, index) => `
        <div class="recommendation-item">
          <strong>${index + 1}.</strong> ${rec}
        </div>
      `).join('')}
    </div>
  `;
};

const generateCareerMatchesSection = (data: HtmlReportData): string => {
  if (!data.careerMatches || data.careerMatches.length === 0) return '';
  
  return `
    <div class="career-matches">
      <h2 class="section-title">🎯 Career Recommendations</h2>
      ${data.careerMatches.slice(0, 10).map((career, index) => `
        <div class="career-item">
          <div class="career-title">#${index + 1} ${career.title}</div>
          <div class="career-match">${Math.round(career.match)}% Match</div>
          ${career.description ? `<p>${career.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
};