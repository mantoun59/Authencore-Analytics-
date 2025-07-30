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
  managementRecommendations?: string[];
  careerMatches?: Array<{ career?: { title: string; description?: string }; title?: string; match?: number; matchPercentage?: number; description?: string }>;
  profile?: string;
  riskFlags?: string[];
  validityLevel?: string;
  riasecResults?: Record<string, number>;
  aptitudeResults?: Record<string, number>;
  contextualEffectiveness?: Record<string, { score: number; description: string }>;
  workingStyles?: Record<string, string>;
  employerInsights?: Record<string, string>;
  riskAssessment?: Record<string, string>;
  distortionAnalysis?: Record<string, string>;
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideDown {
      from { 
        opacity: 0;
        transform: translateY(-20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.9);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: scaleIn 0.6s ease-out;
    }
    
    .report-header {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
      color: white;
      padding: 40px 30px;
      margin: -20px -20px 30px -20px;
      border-radius: 16px 16px 0 0;
      text-align: center;
      position: relative;
      overflow: hidden;
      animation: slideDown 0.7s ease-out;
    }
    
    .report-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 30px 30px;
      animation: shimmer 3s linear infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .logo {
      width: 100px;
      height: auto;
      margin: 0 auto 25px;
      filter: brightness(0) invert(1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
    }
    
    .logo:hover {
      transform: scale(1.1) rotate(5deg);
    }
    
    .report-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 12px;
      text-shadow: 0 4px 8px rgba(0,0,0,0.2);
      position: relative;
      z-index: 1;
      background: linear-gradient(45deg, #ffffff, #f1f5f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .report-subtitle {
      font-size: 1.1rem;
      opacity: 0.95;
      font-weight: 400;
      position: relative;
      z-index: 1;
      letter-spacing: 0.5px;
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
    
    .contextual-section {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .context-item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #f59e0b;
    }
    
    .context-score {
      font-weight: bold;
      color: #f59e0b;
      font-size: 18px;
    }
    
    .working-styles-section {
      background: #f3e8ff;
      border: 1px solid #8b5cf6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .style-item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #8b5cf6;
    }
    
    .strengths-development-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .strengths-section {
      background: #dcfce7;
      border: 1px solid #16a34a;
      border-radius: 8px;
      padding: 20px;
    }
    
    .development-section {
      background: #fef2f2;
      border: 1px solid #ef4444;
      border-radius: 8px;
      padding: 20px;
    }
    
    .list-item {
      background: white;
      padding: 10px 15px;
      margin: 8px 0;
      border-radius: 6px;
      border-left: 4px solid currentColor;
    }
    
    .dimension-description {
      font-size: 14px;
      color: #64748b;
      margin-top: 8px;
      line-height: 1.4;
    }
    
    .dimension-level {
      background: #008080;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .profile-description {
      background: #e0f2fe;
      border-left: 4px solid #008080;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      line-height: 1.6;
    }
    
    .employer-insights-section {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .insight-item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #0ea5e9;
    }
    
    .risk-assessment-section {
      background: #fef2f2;
      border: 1px solid #f87171;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .risk-item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #f87171;
    }
    
    .distortion-analysis-section {
      background: #fffbeb;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .distortion-item {
      background: white;
      border-radius: 6px;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #f59e0b;
    }
    
    .print-button {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin: 20px 0;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .print-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }
    
    .print-button:active {
      transform: translateY(0);
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
      <div class="report-subtitle">${getReportSubtitle(data.assessmentType)}</div>
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
    
    ${data.profile ? `
    <div class="profile-description">
      <h2 class="section-title">${getProfileSectionTitle(data.assessmentType)}</h2>
      <p>${data.profile}</p>
    </div>
    ` : ''}
    
    ${generateDimensionsSection(data)}
    
    ${generateStrengthsAndDevelopmentSection(data)}
    
    ${generateContextualEffectivenessSection(data)}
    
    ${generateWorkingStylesSection(data)}
    
    ${generateEmployerInsightsSection(data)}
    
    ${generateRiskAssessmentSection(data)}
    
    ${generateDistortionAnalysisSection(data)}
    
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
    'faith-values': 'Faith & Values Alignment Index (FVAI)',
    'cair': 'CAIR Personality Assessment',
    'gen-z': 'Gen Z Workplace Assessment',
    'digital-wellness': 'Digital Wellness Assessment',
    'stress-resilience': 'Stress Resilience Assessment',
    'burnout-prevention': 'Burnout Prevention Assessment',
    'cultural-intelligence': 'Cultural Intelligence Assessment'
  };
  return titles[assessmentType] || 'Professional Assessment';
};

const getReportSubtitle = (assessmentType: string): string => {
  const subtitles: Record<string, string> = {
    'communication': 'Communication Styles Assessment Report',
    'emotional-intelligence': 'Emotional Intelligence Assessment Report', 
    'leadership': 'Leadership Assessment Report',
    'faith-values': 'Faith & Values Alignment Report',
    'cair': 'CAIR Personality Assessment Report',
    'gen-z': 'Gen Z Workplace Assessment Report',
    'digital-wellness': 'Digital Wellness Assessment Report',
    'stress-resilience': 'Stress Resilience Assessment Report',
    'burnout-prevention': 'Burnout Prevention Assessment Report',
    'cultural-intelligence': 'Cultural Intelligence Assessment Report',
    'career-launch': 'Career Launch Assessment Report'
  };
  return subtitles[assessmentType] || 'Professional Assessment Report';
};

const getProfileSectionTitle = (assessmentType: string): string => {
  const profileTitles: Record<string, string> = {
    'communication': '🎯 Communication Profile',
    'emotional-intelligence': '🧠 Emotional Intelligence Profile',
    'leadership': '👥 Leadership Profile', 
    'faith-values': '🙏 Values Alignment Profile',
    'cair': '🎭 Personality Profile',
    'gen-z': '🚀 Gen Z Profile',
    'digital-wellness': '📱 Digital Wellness Profile',
    'stress-resilience': '💪 Resilience Profile',
    'burnout-prevention': '🛡️ Burnout Prevention Profile',
    'cultural-intelligence': '🌍 Cultural Intelligence Profile',
    'career-launch': '🎯 Career Readiness Profile'
  };
  return profileTitles[assessmentType] || '🎯 Assessment Profile';
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
  
  let dimensions: Array<{ name: string; score: number; description?: string; level?: string }> = [];
  
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
            <div>
              ${dim.level ? `<span class="dimension-level">${dim.level}</span>` : ''}
              <span class="dimension-score">${Math.round(dim.score)}</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(dim.score, 100)}%"></div>
          </div>
          ${dim.description ? `<div class="dimension-description">${dim.description}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
};

const generateStrengthsAndDevelopmentSection = (data: HtmlReportData): string => {
  if ((!data.strengths || data.strengths.length === 0) && (!data.developmentAreas || data.developmentAreas.length === 0)) return '';
  
  return `
    <div class="strengths-development-grid">
      ${data.strengths && data.strengths.length > 0 ? `
        <div class="strengths-section">
          <h3 class="section-title">✅ Key Strengths</h3>
          ${data.strengths.map(strength => `
            <div class="list-item" style="border-left-color: #16a34a;">
              ${strength}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.developmentAreas && data.developmentAreas.length > 0 ? `
        <div class="development-section">
          <h3 class="section-title">🎯 Development Areas</h3>
          ${data.developmentAreas.map(area => `
            <div class="list-item" style="border-left-color: #ef4444;">
              ${area}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
};

const generateContextualEffectivenessSection = (data: HtmlReportData): string => {
  if (!data.contextualEffectiveness || Object.keys(data.contextualEffectiveness).length === 0) return '';
  
  return `
    <div class="contextual-section">
      <h2 class="section-title">📈 Contextual Effectiveness</h2>
      ${Object.entries(data.contextualEffectiveness).map(([context, details]) => `
        <div class="context-item">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong>${context}</strong>
            <span class="context-score">${details.score}/100</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(details.score, 100)}%; background: #f59e0b;"></div>
          </div>
          <div style="font-size: 14px; color: #64748b; margin-top: 8px;">
            ${details.description}
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

const generateWorkingStylesSection = (data: HtmlReportData): string => {
  if (!data.workingStyles || Object.keys(data.workingStyles).length === 0) return '';
  
  return `
    <div class="working-styles-section">
      <h2 class="section-title">💼 Working Styles</h2>
      ${Object.entries(data.workingStyles).map(([style, description]) => `
        <div class="style-item">
          <strong>${style}:</strong> ${description}
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
      ${data.careerMatches.slice(0, 10).map((career, index) => {
        const title = career.career?.title || career.title || 'Unknown Career';
        const match = career.matchPercentage || career.match || 0;
        const description = career.career?.description || career.description || '';
        
        return `
          <div class="career-item">
            <div class="career-title">#${index + 1} ${title}</div>
            <div class="career-match">${Math.round(match)}% Match</div>
            ${description ? `<p>${description}</p>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
};

const generateEmployerInsightsSection = (data: HtmlReportData): string => {
  if (!data.employerInsights || Object.keys(data.employerInsights).length === 0) return '';
  
  return `
    <div class="employer-insights-section">
      <h2 class="section-title">👔 Employer Insights</h2>
      ${Object.entries(data.employerInsights).map(([insight, value]) => `
        <div class="insight-item">
          <strong>${insight}:</strong> ${value}
        </div>
      `).join('')}
    </div>
  `;
};

const generateRiskAssessmentSection = (data: HtmlReportData): string => {
  if (!data.riskAssessment || Object.keys(data.riskAssessment).length === 0) return '';
  
  return `
    <div class="risk-assessment-section">
      <h2 class="section-title">⚠️ Risk Assessment</h2>
      ${Object.entries(data.riskAssessment).map(([risk, assessment]) => `
        <div class="risk-item">
          <strong>${risk}:</strong> ${assessment}
        </div>
      `).join('')}
    </div>
  `;
};

const generateDistortionAnalysisSection = (data: HtmlReportData): string => {
  if (!data.distortionAnalysis || Object.keys(data.distortionAnalysis).length === 0) return '';
  
  return `
    <div class="distortion-analysis-section">
      <h2 class="section-title">🔍 Response Validity & Distortion Analysis</h2>
      ${Object.entries(data.distortionAnalysis).map(([indicator, analysis]) => `
        <div class="distortion-item">
          <strong>${indicator}:</strong> ${analysis}
        </div>
      `).join('')}
    </div>
  `;
};