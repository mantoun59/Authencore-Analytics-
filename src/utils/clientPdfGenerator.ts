import jsPDF from 'jspdf';
import finalLogo from '../assets/final-logo.png';

export interface SimplePdfData {
  assessmentType: string;
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

export type ReportType = 'applicant' | 'advisor';

// Convert image to base64 for embedding in HTML
const getLogoBase64 = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load logo'));
    img.crossOrigin = 'anonymous';
    img.src = finalLogo;
  });
};
const colors = {
  primary: [0, 128, 128] as const, // Teal
  secondary: [25, 25, 112] as const, // Navy  
  accent: [34, 139, 34] as const, // Forest Green
  neutral: [105, 105, 105] as const, // Dim Gray
  light: [245, 245, 245] as const, // White Smoke
  white: [255, 255, 255] as const,
  gold: [255, 215, 0] as const, // Gold accent
  success: [46, 160, 67] as const, // Success green
  warning: [255, 152, 0] as const, // Warning orange
  danger: [244, 67, 54] as const // Danger red
};

// Visual elements for enhanced design
const icons = {
  realistic: '🔧',
  investigative: '🔬', 
  artistic: '🎨',
  social: '👥',
  enterprising: '📈',
  conventional: '📊',
  star: '⭐',
  trophy: '🏆',
  target: '🎯',
  rocket: '🚀',
  lightbulb: '💡',
  shield: '🛡️'
};

// Force ASCII-only text for jsPDF compatibility  
const normalizeText = (text: any): string => {
  if (!text) return 'N/A';
  if (typeof text !== 'string') text = String(text);
  
  // Convert to ASCII-only characters for jsPDF
  return text
    .normalize('NFD') // Decompose characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
    .replace(/[^\x20-\x7E]/g, '') // Remove ALL non-ASCII characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim() || 'N/A';
};

// Safe number utility
const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : Math.round(num);
};

// Input validation
const validateInput = (data: SimplePdfData): void => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided');
  }
  if (!data.userInfo?.name || !data.userInfo?.email) {
    throw new Error('Missing required user information');
  }
};

// Generate HTML report instead of PDF
export const generateClientSidePdf = async (data: SimplePdfData): Promise<void> => {
  console.log('Generating HTML report for:', data.userInfo?.name);
  
  try {
    validateInput(data);
    
    // Get logo as base64
    const logoBase64 = await getLogoBase64().catch(() => null);
    
    // Create HTML report with logo
    const htmlContent = generateHTMLReport(data, logoBase64);
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups for this site.');
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Auto-focus and show print dialog after content loads
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
    
    console.log('HTML report generated successfully');
    
  } catch (error) {
    console.error('Report generation failed:', error);
    alert(`Report generation failed: ${error.message}`);
    throw error;
  }
};

// Generate complete HTML report with logo
const generateHTMLReport = (data: SimplePdfData, logoBase64: string | null = null): string => {
  // Process dimensions data
  const processDimensions = (dimensions: any): Array<{ name: string; score: number }> => {
    if (!dimensions) return [];
    
    if (Array.isArray(dimensions)) {
      return dimensions.map(dim => ({
        name: dim.name || 'Unknown',
        score: Number(dim.score) || 0
      }));
    }
    
    if (typeof dimensions === 'object') {
      return Object.entries(dimensions).map(([key, value]) => ({
        name: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
        score: Number(value) || 0
      }));
    }
    
    return [];
  };

  const processedDimensions = processDimensions(data.dimensions || data.riasecResults);
  const careerMatches = data.careerMatches || [];
  const recommendations = data.recommendations || [];

  // Generate college majors based on career matches and RIASEC scores
  const generateCollegeMajors = (dimensions: Array<{ name: string; score: number }>, careers: any[]): Array<{ name: string; match: number; careers: string[]; description: string }> => {
    const majorMappings = [
      { name: 'Computer Science', riasec: ['Investigative', 'Conventional'], careers: ['Software Engineer', 'Data Scientist', 'Systems Analyst'], description: 'Programming, algorithms, and computational thinking' },
      { name: 'Business Administration', riasec: ['Enterprising', 'Conventional'], careers: ['Business Manager', 'Marketing Manager', 'Operations Manager'], description: 'Leadership, strategy, and organizational management' },
      { name: 'Psychology', riasec: ['Social', 'Investigative'], careers: ['Psychologist', 'Counselor', 'Human Resources'], description: 'Human behavior, mental processes, and social dynamics' },
      { name: 'Engineering', riasec: ['Realistic', 'Investigative'], careers: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer'], description: 'Problem-solving, design, and technical innovation' },
      { name: 'Graphic Design', riasec: ['Artistic', 'Conventional'], careers: ['Graphic Designer', 'Art Director', 'UX Designer'], description: 'Visual communication, creativity, and design principles' },
      { name: 'Education', riasec: ['Social', 'Conventional'], careers: ['Teacher', 'Principal', 'Curriculum Developer'], description: 'Learning theory, pedagogy, and human development' },
      { name: 'Marketing', riasec: ['Enterprising', 'Artistic'], careers: ['Marketing Specialist', 'Brand Manager', 'Digital Marketer'], description: 'Consumer behavior, branding, and communication strategies' },
      { name: 'Environmental Science', riasec: ['Investigative', 'Realistic'], careers: ['Environmental Scientist', 'Conservation Biologist', 'Sustainability Consultant'], description: 'Ecology, research, and environmental protection' },
      { name: 'Finance', riasec: ['Conventional', 'Enterprising'], careers: ['Financial Analyst', 'Investment Banker', 'Financial Planner'], description: 'Economics, financial markets, and quantitative analysis' },
      { name: 'Communications', riasec: ['Social', 'Artistic'], careers: ['Public Relations Specialist', 'Journalist', 'Content Creator'], description: 'Media, storytelling, and interpersonal communication' }
    ];

    return majorMappings.map(major => {
      const matchScore = major.riasec.reduce((score, riasecType) => {
        const dimension = dimensions.find(d => d.name.toLowerCase().includes(riasecType.toLowerCase()));
        return score + (dimension ? dimension.score : 0);
      }, 0) / major.riasec.length;

      return {
        name: major.name,
        match: Math.round(matchScore),
        careers: major.careers,
        description: major.description
      };
    }).sort((a, b) => b.match - a.match);
  };

  const collegeMajors = generateCollegeMajors(processedDimensions, careerMatches);

  // RIASEC types with colors and descriptions
  const riasecTypes = [
    { name: 'Realistic', color: '#008080', description: 'Hands-on, practical, mechanical', icon: '🔧' },
    { name: 'Investigative', color: '#228B22', description: 'Research, analysis, problem-solving', icon: '🔬' },
    { name: 'Artistic', color: '#FF8C00', description: 'Creative, expressive, innovative', icon: '🎨' },
    { name: 'Social', color: '#32CD32', description: 'People-focused, helping, teaching', icon: '👥' },
    { name: 'Enterprising', color: '#FFD700', description: 'Leadership, business, persuasion', icon: '📈' },
    { name: 'Conventional', color: '#4169E1', description: 'Organized, detail-oriented, systematic', icon: '📊' }
  ];

  const getScoreLevel = (score: number): { level: string; color: string } => {
    if (score >= 85) return { level: 'Excellent', color: '#22C55E' };
    if (score >= 70) return { level: 'Good', color: '#3B82F6' };
    if (score >= 55) return { level: 'Average', color: '#EAB308' };
    return { level: 'Developing', color: '#EF4444' };
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString();
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Career Assessment Report - ${normalizeText(data.userInfo.name)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.4;
      color: #333;
      background: white;
    }
    
    @media print {
      body { margin: 0; }
      .report-page {
        page-break-after: always;
        padding: 20px;
        min-height: 100vh;
      }
      .report-page:last-child {
        page-break-after: avoid;
      }
    }
    
    @media screen {
      .report-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        min-height: 100vh;
      }
    }
    
    .report-header {
      background: linear-gradient(135deg, #008080, #006666);
      color: white;
      padding: 20px;
      margin: -20px -20px 30px -20px;
      border-radius: 0;
      position: relative;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logo {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      background: white;
      padding: 5px;
    }
    
    .logo-fallback {
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #008080;
      font-size: 10px;
      text-align: center;
      line-height: 1.2;
    }
    
    .company-info h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    
    .company-info p {
      margin: 5px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    
    .confidential-badge {
      background: #dc2626;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
      position: absolute;
      top: 20px;
      right: 20px;
    }
    
    .profile-card {
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
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    
    .metric-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    
    .metric-card.primary {
      border-color: #008080;
      background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
    }
    
    .metric-card.success {
      border-color: #22c55e;
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    }
    
    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: #008080;
      margin: 10px 0;
    }
    
    .metric-label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 5px;
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
      border-radius: 6px;
    }
    
    .college-major-card {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
    }
    
    .major-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .major-name {
      font-size: 18px;
      font-weight: bold;
      color: #92400e;
    }
    
    .major-match {
      font-size: 16px;
      font-weight: bold;
      color: #f59e0b;
    }
    
    .related-careers {
      background: white;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      font-size: 12px;
      color: #374151;
    }
    
    .career-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }
    
    .career-rank {
      background: #fbbf24;
      color: #92400e;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .career-content {
      flex: 1;
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
      margin-bottom: 10px;
    }
    
    .recommendation-item {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 15px;
      margin: 10px 0;
      border-radius: 0 8px 8px 0;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    .recommendation-number {
      background: #22c55e;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      flex-shrink: 0;
    }
    
    .summary-box {
      background: #e0f2fe;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .methodology-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .methodology-card {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    
    .footer {
      background: #f8fafc;
      padding: 20px;
      margin: 30px -20px -20px -20px;
      border-top: 2px solid #008080;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <!-- Page 1: Overview and Profile -->
  <div class="report-page">
    <div class="report-header">
      <div class="confidential-badge">CONFIDENTIAL</div>
      <div class="logo-section">
        ${logoBase64 
          ? `<img src="${logoBase64}" alt="AuthenCore Analytics" class="logo" />`
          : `<div class="logo-fallback">AuthenCore<br>Analytics</div>`
        }
        <div class="company-info">
          <h1>AuthenCore Analytics</h1>
          <p>Career Launch Assessment Report</p>
        </div>
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-header">
        👤 Candidate Profile
      </div>
      <div class="profile-grid">
        <div><strong>Name:</strong> ${normalizeText(data.userInfo.name)}</div>
        <div><strong>Email:</strong> ${normalizeText(data.userInfo.email)}</div>
        <div><strong>Assessment Date:</strong> ${formatDate(data.userInfo.assessmentDate)}</div>
        <div><strong>Report ID:</strong> ${normalizeText(data.userInfo.reportId) || `CLR-${Date.now()}`}</div>
        ${data.userInfo.questionsAnswered ? `<div><strong>Questions Answered:</strong> ${data.userInfo.questionsAnswered}</div>` : ''}
        ${data.userInfo.timeSpent ? `<div><strong>Time Spent:</strong> ${normalizeText(data.userInfo.timeSpent)}</div>` : ''}
      </div>
    </div>

    <div class="metrics-grid">
      ${data.overallScore !== undefined ? `
      <div class="metric-card primary">
        <div class="metric-label">🏆 Overall Score</div>
        <div class="metric-value">${safeNumber(data.overallScore)}</div>
        <div style="font-size: 12px; color: #64748b;">out of 100</div>
      </div>
      ` : ''}
      ${data.userInfo.reliabilityScore ? `
      <div class="metric-card success">
        <div class="metric-label">🛡️ Reliability Score</div>
        <div class="metric-value">${safeNumber(data.userInfo.reliabilityScore)}%</div>
        <div style="font-size: 12px; color: #64748b;">response quality</div>
      </div>
      ` : ''}
    </div>

    <div class="summary-box">
      <h3 style="margin: 0 0 10px 0; color: #0277bd;">📋 Executive Summary</h3>
      <p style="margin: 0; line-height: 1.6;">
        This comprehensive career assessment analyzes your interests, aptitudes, and personality traits 
        to provide personalized career recommendations based on scientifically validated methodologies. 
        The report uses the Holland RIASEC model and integrates with the O*NET career database for 
        accurate career matching.
      </p>
    </div>
  </div>

  <!-- Page 2: RIASEC Analysis -->
  <div class="report-page">
    <h2 class="section-title">🔬 RIASEC Interest Profile Analysis</h2>
    <p style="margin-bottom: 20px; color: #64748b;">
      Your interest profile based on Holland's RIASEC model - six personality types that help predict career satisfaction:
    </p>

    ${processedDimensions.slice(0, 6).map((dim, index) => {
      const riasecType = riasecTypes[index] || riasecTypes[0];
      const scoreInfo = getScoreLevel(dim.score);
      
      return `
      <div class="dimension-item">
        <div class="dimension-header">
          <div>
            <span style="font-size: 20px; margin-right: 10px;">${riasecType.icon}</span>
            <span class="dimension-name" style="color: ${riasecType.color};">
              ${normalizeText(dim.name)}
            </span>
            <div style="font-size: 14px; color: #64748b; margin-top: 2px;">
              ${riasecType.description}
            </div>
          </div>
          <div style="text-align: right;">
            <div class="dimension-score" style="color: ${riasecType.color};">
              ${dim.score}
            </div>
            <div style="font-size: 12px; color: ${scoreInfo.color}; font-weight: bold;">
              ${scoreInfo.level}
            </div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${dim.score}%; background-color: ${riasecType.color};"></div>
        </div>
      </div>
      `;
    }).join('')}
  </div>

  <!-- Page 3: College Majors -->
  <div class="report-page">
    <h2 class="section-title">🎓 Recommended College Majors</h2>
    <p style="margin-bottom: 20px; color: #64748b;">
      Academic programs that align with your interests and career goals, ranked by compatibility:
    </p>

    ${collegeMajors.slice(0, 6).map((major, index) => {
      const matchColor = major.match >= 80 ? '#22c55e' : major.match >= 60 ? '#f59e0b' : '#6b7280';
      
      return `
      <div class="college-major-card">
        <div class="major-header">
          <div class="major-name">🎓 ${normalizeText(major.name)}</div>
          <div class="major-match" style="color: ${matchColor};">
            ${major.match}% Match
          </div>
        </div>
        <div class="progress-bar" style="width: 100%; margin-bottom: 10px;">
          <div class="progress-fill" style="width: ${major.match}%; background-color: ${matchColor};"></div>
        </div>
        <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
          ${normalizeText(major.description)}
        </div>
        <div class="related-careers">
          <strong>Related Careers:</strong> ${major.careers.join(', ')}
        </div>
      </div>
      `;
    }).join('')}
  </div>

  <!-- Page 4: Career Recommendations -->
  <div class="report-page">
    <h2 class="section-title">🚀 Top Career Recommendations</h2>
    <p style="margin-bottom: 20px; color: #64748b;">
      Based on your assessment results, here are your top career matches ranked by compatibility:
    </p>

    ${careerMatches.slice(0, 8).map((match, index) => {
      const matchScore = safeNumber(match.match);
      const matchColor = matchScore >= 80 ? '#22c55e' : matchScore >= 60 ? '#f59e0b' : '#6b7280';
      
      return `
      <div class="career-card">
        <div class="career-rank">${index + 1}</div>
        <div class="career-content">
          <div class="career-title">${normalizeText(match.title)}</div>
          <div class="career-match" style="color: ${matchColor};">
            ${matchScore}% Match
          </div>
          <div class="progress-bar" style="width: 200px;">
            <div class="progress-fill" style="width: ${matchScore}%; background-color: ${matchColor};"></div>
          </div>
          ${match.description ? `
          <div style="margin-top: 10px; color: #64748b; font-size: 14px;">
            ${normalizeText(match.description)}
          </div>
          ` : ''}
        </div>
      </div>
      `;
    }).join('')}
    
    ${careerMatches.length === 0 ? `
    <div style="text-align: center; padding: 40px; color: #64748b;">
      <p>Career recommendations will be generated based on your specific assessment results.</p>
    </div>
    ` : ''}
  </div>

  <!-- Page 5: Development Recommendations -->
  <div class="report-page">
    <h2 class="section-title">💡 Personal Development Roadmap</h2>
    <p style="margin-bottom: 20px; color: #64748b;">
      Your personalized development roadmap with prioritized action items for career growth:
    </p>

    ${recommendations.slice(0, 10).map((rec, index) => `
    <div class="recommendation-item">
      <span class="recommendation-number">${index + 1}</span>
      <span>${normalizeText(rec)}</span>
    </div>
    `).join('')}

    ${recommendations.length === 0 ? `
    <div style="text-align: center; padding: 40px; color: #64748b;">
      <p>Personalized recommendations will be generated based on your specific assessment results.</p>
    </div>
    ` : ''}

    <div style="margin-top: 40px; background: #f0fdf4; padding: 20px; border-radius: 8px; border: 2px solid #22c55e;">
      <h3 style="margin: 0 0 15px 0; color: #16a34a;">🎯 Next Steps</h3>
      <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Review your RIASEC profile and identify your strongest interest areas</li>
        <li>Research the recommended careers that align with your interests and values</li>
        <li>Consider informational interviews with professionals in your target fields</li>
        <li>Develop skills and gain experience in your areas of interest</li>
        <li>Create a timeline for your career transition or development goals</li>
      </ul>
    </div>
  </div>

  <!-- Page 6: Assessment Details & Methodology -->
  <div class="report-page">
    <h2 class="section-title">📊 Assessment Methodology & Validity</h2>
    
    <div class="methodology-grid">
      <div class="methodology-card">
        <h4 style="color: #008080; margin: 0 0 10px 0;">🔬 Holland RIASEC Theory</h4>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          Six personality types and work environments for accurate career matching based on decades of research.
        </p>
      </div>
      
      <div class="methodology-card">
        <h4 style="color: #008080; margin: 0 0 10px 0;">📚 O*NET Career Database</h4>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          900+ career profiles with detailed requirements and outcomes for comprehensive matching.
        </p>
      </div>
      
      <div class="methodology-card">
        <h4 style="color: #008080; margin: 0 0 10px 0;">🧠 Cognitive Aptitude Assessment</h4>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          Validated measures of reasoning and problem-solving abilities for accurate predictions.
        </p>
      </div>
      
      <div class="methodology-card">
        <h4 style="color: #008080; margin: 0 0 10px 0;">✅ Response Quality Validation</h4>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          Statistical analysis ensures reliable and consistent responses for trustworthy results.
        </p>
      </div>
    </div>

    <div class="summary-box">
      <h4 style="color: #0277bd; margin: 0 0 15px 0;">📈 Assessment Statistics</h4>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
        <div><strong>Questions Answered:</strong> ${data.userInfo.questionsAnswered || 'Complete Set'}</div>
        <div><strong>Time Spent:</strong> ${normalizeText(data.userInfo.timeSpent) || 'Appropriate Duration'}</div>
        <div><strong>Reliability Score:</strong> ${data.userInfo.reliabilityScore || 'High'}%</div>
        <div><strong>Report Generated:</strong> ${formatDate()}</div>
      </div>
    </div>

    <div class="footer">
      <div style="margin-bottom: 10px;">
        <strong>AuthenCore Analytics</strong> | Professional Career Assessment Platform
      </div>
      <div style="font-size: 11px;">
        This report is confidential and intended for professional use only. 
        For questions about this report, contact: support@authencore.com
      </div>
      <div style="margin-top: 10px; font-size: 11px;">
        Generated on ${formatDate()} | www.authencore.com
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Enhanced header with real logo
const addEnhancedHeader = async (doc: jsPDF, pageWidth: number, logoBase64: string | null): Promise<number> => {
  // Gradient-style header background
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Add subtle secondary stripe
  doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.rect(0, 45, pageWidth, 5, 'F');
  
  // Logo section
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 15, 10, 30, 30);
    } catch (error) {
      console.warn('Failed to add logo image, using text fallback');
      addLogoFallback(doc);
    }
  } else {
    addLogoFallback(doc);
  }
  
  // Main branding
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('AuthenCore Analytics', 55, 25);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Career Launch Assessment Report', 55, 35);
  
  // Professional badges
  addProfessionalBadges(doc, pageWidth);
  
  return 60;
};

// Logo fallback with professional styling
const addLogoFallback = (doc: jsPDF): void => {
  // Modern logo background
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, 10, 30, 30, 'F');
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(2);
  doc.rect(15, 10, 30, 30, 'S');
  
  // Logo text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('AuthenCore', 18, 22);
  doc.setFontSize(8);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('ANALYTICS', 20, 30);
  doc.text('EST. 2024', 21, 37);
};

// Professional certification badges
const addProfessionalBadges = (doc: jsPDF, pageWidth: number): void => {
  // Confidential badge - moved to not overlap with main branding
  doc.setFillColor(colors.danger[0], colors.danger[1], colors.danger[2]);
  doc.rect(pageWidth - 65, 30, 55, 10, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('CONFIDENTIAL', pageWidth - 62, 37);
};

// Executive summary with enhanced metrics
const addExecutiveSummary = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos + 10;
  
  // Section title with icon
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('📊 Executive Summary', 20, yPosition);
  yPosition += 20;
  
  // User info card with enhanced styling
  addUserInfoCard(doc, data, yPosition);
  
  return yPosition + 45;
};

// Enhanced user info card
const addUserInfoCard = (doc: jsPDF, data: SimplePdfData, yPos: number): void => {
  const cardHeight = 40;
  
  // Card background with gradient effect
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.rect(15, yPos, 180, cardHeight, 'F');
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(1);
  doc.rect(15, yPos, 180, cardHeight, 'S');
  
  // Header stripe
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPos, 180, 8, 'F');
  
  // Section title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('Candidate Profile', 20, yPos + 6);
  
  // User details with icons
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  
  let detailY = yPos + 18;
  doc.text(`👤 ${normalizeText(data.userInfo.name)}`, 20, detailY);
  detailY += 6;
  doc.text(`📧 ${normalizeText(data.userInfo.email)}`, 20, detailY);
  detailY += 6;
  doc.text(`📅 ${normalizeText(data.userInfo.assessmentDate) || new Date().toLocaleDateString()}`, 20, detailY);
  
  if (data.userInfo.reportId) {
    detailY += 6;
    doc.text(`🆔 Report ID: ${normalizeText(data.userInfo.reportId)}`, 20, detailY);
  }
};

// Key metrics dashboard
const addKeyMetrics = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos + 10;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('🎯 Key Performance Metrics', 20, yPosition);
  yPosition += 20;
  
  // Metrics cards in a grid
  const cardWidth = 85;
  const cardHeight = 50;
  const gap = 10;
  
  // Overall Score Card
  if (data.overallScore !== undefined) {
    addMetricCard(doc, 20, yPosition, cardWidth, cardHeight, 
      'Overall Score', data.overallScore, '/100', colors.primary, '🏆');
  }
  
  // Reliability Score Card
  if (data.userInfo.reliabilityScore) {
    addMetricCard(doc, 20 + cardWidth + gap, yPosition, cardWidth, cardHeight,
      'Reliability', data.userInfo.reliabilityScore, '%', colors.success, '🛡️');
  }
  
  return yPosition + cardHeight + 20;
};

// Individual metric card
const addMetricCard = (doc: jsPDF, x: number, y: number, width: number, height: number,
  title: string, value: number, suffix: string, color: readonly number[], icon: string): void => {
  
  // Card background
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(x, y, width, height, 'F');
  
  // White content area
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(x + 2, y + 15, width - 4, height - 17, 'F');
  
  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(`${icon} ${title}`, x + 5, y + 12);
  
  // Value
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(value.toString(), x + 8, y + 35);
  
  // Suffix
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(suffix, x + 35, y + 35);
  
  // Performance level
  const level = value >= 85 ? 'Excellent' : value >= 70 ? 'Good' : value >= 55 ? 'Average' : 'Developing';
  doc.setFontSize(10);
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text(level, x + 8, y + 45);
};

// Enhanced RIASEC visualization with charts
const addRiasecVisualization = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.dimensions) return yPosition;
  
  const dimensionArray = Array.isArray(data.dimensions) 
    ? data.dimensions 
    : Object.entries(data.dimensions).map(([key, value]) => ({
        name: normalizeText(key.replace(/_/g, ' ')),
        score: safeNumber(value)
      }));
  
  // RIASEC types with enhanced descriptions
  const riasecTypes = [
    { name: 'Realistic', icon: icons.realistic, description: 'Hands-on, practical, mechanical', color: colors.primary },
    { name: 'Investigative', icon: icons.investigative, description: 'Research, analysis, problem-solving', color: colors.accent },
    { name: 'Artistic', icon: icons.artistic, description: 'Creative, expressive, innovative', color: colors.warning },
    { name: 'Social', icon: icons.social, description: 'People-focused, helping, teaching', color: colors.success },
    { name: 'Enterprising', icon: icons.enterprising, description: 'Leadership, business, persuasion', color: colors.gold },
    { name: 'Conventional', icon: icons.conventional, description: 'Organized, detail-oriented, systematic', color: colors.secondary }
  ];
  
  // Add chart explanation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('Your interest profile based on Holland\'s RIASEC model:', 20, yPosition);
  yPosition += 20;
  
  dimensionArray.slice(0, 6).forEach((dim, index) => {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'RIASEC Analysis (Continued)', 20);
    }
    
    const riasecType = riasecTypes[index] || { 
      name: dim.name, 
      icon: '📊', 
      description: 'General interest area',
      color: colors.neutral 
    };
    
    addEnhancedDimensionBar(doc, dim, riasecType, yPosition);
    yPosition += 35;
  });
  
  return yPosition + 10;
};

// Enhanced dimension bar with styling
const addEnhancedDimensionBar = (doc: jsPDF, dim: any, riasecType: any, yPos: number): void => {
  const barWidth = 140;
  const barHeight = 12;
  
  // Background card
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.rect(15, yPos - 5, 180, 30, 'F');
  doc.setDrawColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.setLineWidth(0.5);
  doc.rect(15, yPos - 5, 180, 30, 'S');
  
  // Type icon and name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(`${riasecType.icon} ${normalizeText(dim.name)}`, 20, yPos + 5);
  
  // Description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text(riasecType.description, 20, yPos + 12);
  
  // Progress bar background
  doc.setFillColor(230, 230, 230);
  doc.rect(20, yPos + 16, barWidth, barHeight, 'F');
  
  // Progress bar fill
  const fillWidth = (dim.score / 100) * barWidth;
  doc.setFillColor(riasecType.color[0], riasecType.color[1], riasecType.color[2]);
  doc.rect(20, yPos + 16, fillWidth, barHeight, 'F');
  
  // Score text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(`${dim.score}`, 170, yPos + 25);
  
  // Level indicator with color coding
  const level = dim.score >= 75 ? 'High' : dim.score >= 50 ? 'Moderate' : 'Low';
  const levelColor = dim.score >= 75 ? colors.success : dim.score >= 50 ? colors.warning : colors.neutral;
  doc.setFontSize(10);
  doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.text(level, 170, yPos + 12);
};

// Enhanced career recommendations with rich cards
const addEnhancedCareerCards = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.careerMatches) return yPosition;
  
  // Add intro text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('Based on your assessment results, here are your top career matches:', 20, yPosition);
  yPosition += 20;
  
  data.careerMatches.slice(0, 6).forEach((match, index) => {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'Career Recommendations (Continued)', 20);
    }
    
    addProfessionalCareerCard(doc, match, index, yPosition);
    yPosition += 40;
  });
  
  return yPosition + 10;
};

// Professional career card with enhanced styling
const addProfessionalCareerCard = (doc: jsPDF, match: any, index: number, yPos: number): void => {
  const cardHeight = 35;
  const matchScore = safeNumber(match.match);
  
  // Card background with gradient effect
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, yPos, 180, cardHeight, 'F');
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(1);
  doc.rect(15, yPos, 180, cardHeight, 'S');
  
  // Rank badge with gradient
  const rankColor = index < 3 ? colors.gold : colors.primary;
  doc.setFillColor(rankColor[0], rankColor[1], rankColor[2]);
  doc.circle(30, yPos + 17, 10, 'F');
  
  // Rank number
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(`${index + 1}`, 26, yPos + 21);
  
  // Career title with enhanced typography
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(normalizeText(match.title), 45, yPos + 12);
  
  // Match percentage with visual indicator
  addMatchIndicator(doc, matchScore, 140, yPos + 8);
  
  // Brief description with better formatting
  if (match.description) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    const desc = normalizeText(match.description).substring(0, 90) + '...';
    const lines = doc.splitTextToSize(desc, 120);
    if (Array.isArray(lines)) {
      lines.slice(0, 2).forEach((line, lineIndex) => {
        doc.text(line, 45, yPos + 20 + (lineIndex * 5));
      });
    }
  }
  
  // Career fit icon
  const fitIcon = matchScore >= 85 ? '🌟' : matchScore >= 70 ? '⭐' : '📌';
  doc.setFontSize(16);
  doc.text(fitIcon, 170, yPos + 25);
};

// Visual match percentage indicator
const addMatchIndicator = (doc: jsPDF, score: number, x: number, y: number): void => {
  const barWidth = 40;
  const barHeight = 8;
  
  // Background
  doc.setFillColor(230, 230, 230);
  doc.rect(x, y, barWidth, barHeight, 'F');
  
  // Fill based on score
  const fillWidth = (score / 100) * barWidth;
  const fillColor = score >= 85 ? colors.success : score >= 70 ? colors.warning : colors.primary;
  doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
  doc.rect(x, y, fillWidth, barHeight, 'F');
  
  // Score text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(`${score}%`, x, y + 18);
};

// Enhanced action plan with timeline visualization
const addEnhancedActionPlan = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.recommendations) return yPosition;
  
  // Add intro
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('Your personalized development roadmap with prioritized action items:', 20, yPosition);
  yPosition += 20;
  
  const priorities = [
    { label: 'Immediate Focus', timeframe: '1-3 months', color: colors.danger, icon: '🚀' },
    { label: 'Medium Term', timeframe: '3-6 months', color: colors.warning, icon: '🎯' },
    { label: 'Long-term Goal', timeframe: '6-12 months', color: colors.success, icon: '🌟' }
  ];
  
  data.recommendations.slice(0, 6).forEach((rec, index) => {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'Development Action Plan (Continued)', 20);
    }
    
    const priority = priorities[index % 3];
    addEnhancedActionItem(doc, rec, priority, yPosition, index + 1);
    yPosition += 45;
  });
  
  return yPosition;
};

// Enhanced action item with timeline
const addEnhancedActionItem = (doc: jsPDF, recommendation: string, priority: any, yPos: number, stepNumber: number): void => {
  const cardHeight = 40;
  
  // Card background
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.rect(15, yPos, 180, cardHeight, 'F');
  doc.setDrawColor(priority.color[0], priority.color[1], priority.color[2]);
  doc.setLineWidth(2);
  doc.rect(15, yPos, 180, cardHeight, 'S');
  
  // Priority stripe
  doc.setFillColor(priority.color[0], priority.color[1], priority.color[2]);
  doc.rect(15, yPos, 5, cardHeight, 'F');
  
  // Step number
  doc.setFillColor(priority.color[0], priority.color[1], priority.color[2]);
  doc.circle(30, yPos + 12, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(stepNumber.toString(), 27, yPos + 15);
  
  // Priority label and timeframe
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(priority.color[0], priority.color[1], priority.color[2]);
  doc.text(normalizeText(priority.label), 45, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('Timeline: ' + normalizeText(priority.timeframe), 130, yPos + 10);
  
  // Recommendation text with better formatting
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  
  const cleanedRec = normalizeText(recommendation);
  const lines = doc.splitTextToSize(cleanedRec, 140);
  
  if (Array.isArray(lines)) {
    lines.slice(0, 3).forEach((line, lineIndex) => {
      doc.text(line, 45, yPos + 20 + (lineIndex * 5));
    });
  } else {
    doc.text(lines, 45, yPos + 20);
  }
};

// Assessment methodology section
const addMethodologySection = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('This assessment is based on scientifically validated methodologies:', 20, yPosition);
  yPosition += 20;
  
  const methodologies = [
    { 
      icon: '📚', 
      title: 'Holland RIASEC Theory', 
      description: 'Six personality types and work environments for career matching'
    },
    { 
      icon: '🎯', 
      title: 'O*NET Career Database', 
      description: '900+ career profiles with detailed requirements and outcomes'
    },
    { 
      icon: '🧠', 
      title: 'Cognitive Aptitude Assessment', 
      description: 'Validated measures of reasoning and problem-solving abilities'
    },
    { 
      icon: '🔐', 
      title: 'Response Quality Validation', 
      description: 'Statistical analysis ensures reliable and consistent responses'
    }
  ];
  
  methodologies.forEach((method, index) => {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'Assessment Methodology (Continued)', 20);
    }
    
    addMethodologyCard(doc, method, yPosition);
    yPosition += 30;
  });
  
  // Assessment statistics
  yPosition += 10;
  addAssessmentStats(doc, data, yPosition);
  
  return yPosition + 40;
};

// Methodology card
const addMethodologyCard = (doc: jsPDF, method: any, yPos: number): void => {
  // Card background
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, yPos, 180, 25, 'F');
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPos, 180, 25, 'S');
  
  // Icon and title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text(`${method.icon} ${method.title}`, 20, yPos + 10);
  
  // Description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text(method.description, 20, yPos + 18);
};

// Assessment statistics
const addAssessmentStats = (doc: jsPDF, data: SimplePdfData, yPos: number): void => {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('📊 Assessment Statistics', 20, yPos);
  
  const stats = [
    `Questions Answered: ${data.userInfo.questionsAnswered || 'N/A'}`,
    `Time Spent: ${data.userInfo.timeSpent || 'N/A'}`,
    `Reliability Score: ${data.userInfo.reliabilityScore || 'N/A'}%`,
    `Report Generated: ${new Date().toLocaleDateString()}`
  ];
  
  stats.forEach((stat, index) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(`• ${stat}`, 25, yPos + 15 + (index * 6));
  });
};

// Section header utility with enhanced styling
const addSectionHeader = (doc: jsPDF, title: string, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Gradient background
  doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.rect(0, yPos - 8, pageWidth, 25, 'F');
  
  // Accent stripe
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(0, yPos + 12, pageWidth, 3, 'F');
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(title, 20, yPos + 8);
  
  return yPos + 30;
};

// Enhanced footers with professional styling
const addEnhancedFooters = (doc: jsPDF): void => {
  const totalPages = (doc as any).internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    // Footer line
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(1);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text('🏢 AuthenCore Analytics - Professional Career Assessment Platform', 20, pageHeight - 12);
    doc.text('🔒 This report is confidential and intended for professional use only', 20, pageHeight - 7);
    
    // Page number with styling
    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 7);
    
    // Website/contact info
    doc.setFont('helvetica', 'normal');
    doc.text('www.authencore.com', pageWidth - 60, pageHeight - 12);
  }
};

// Export function for backward compatibility
export const generateProfessionalPdf = (data: SimplePdfData, reportType: ReportType = 'applicant'): void => {
  generateClientSidePdf(data);
};
