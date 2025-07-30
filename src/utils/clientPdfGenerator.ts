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

export type ReportType = 'applicant' | 'advisor' | 'certificate';

// Clean color scheme (RGB values for jsPDF compatibility)
const colors = {
  primary: [0, 128, 128] as const, // Teal
  secondary: [25, 25, 112] as const, // Navy
  accent: [34, 139, 34] as const, // Forest Green
  neutral: [105, 105, 105] as const, // Dim Gray
  light: [245, 245, 245] as const, // White Smoke
  white: [255, 255, 255] as const
};

// Clean text utility that removes problematic characters
const cleanText = (text: any): string => {
  if (!text) return 'N/A';
  if (typeof text !== 'string') return String(text);
  
  // Remove all non-ASCII characters and control characters
  return text
    .replace(/[^\x20-\x7E]/g, '') // Keep only printable ASCII
    .replace(/\s+/g, ' ') // Normalize whitespace
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

// Main PDF generation function
export const generateClientSidePdf = (data: SimplePdfData): void => {
  console.log('Starting clean PDF generation for:', data.userInfo?.name);
  
  try {
    validateInput(data);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Page 1: Cover & Summary
    yPosition = addCleanHeader(doc, pageWidth);
    yPosition = addUserInfo(doc, data, yPosition);
    yPosition = addScoreSummary(doc, data, yPosition);
    
    // Page 2: Dimensional Analysis
    doc.addPage();
    yPosition = 20;
    yPosition = addSectionHeader(doc, 'Assessment Dimensions', yPosition);
    yPosition = addDimensionalAnalysis(doc, data, yPosition);
    
    // Page 3: Career Recommendations
    if (data.careerMatches && data.careerMatches.length > 0) {
      doc.addPage();
      yPosition = 20;
      yPosition = addSectionHeader(doc, 'Career Recommendations', yPosition);
      yPosition = addCareerRecommendations(doc, data, yPosition);
    }
    
    // Page 4: Development Plan
    if (data.recommendations && data.recommendations.length > 0) {
      doc.addPage();
      yPosition = 20;
      yPosition = addSectionHeader(doc, 'Development Action Plan', yPosition);
      yPosition = addDevelopmentPlan(doc, data, yPosition);
    }
    
    // Add page numbers and footers
    addPageFooters(doc);
    
    // Generate clean filename
    const cleanName = cleanText(data.userInfo.name).replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${cleanName}_Career_Report_${timestamp}.pdf`;
    
    console.log('PDF generation completed successfully:', filename);
    doc.save(filename);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert(`PDF generation failed: ${error.message}`);
    throw error;
  }
};

// Clean header with logo and branding
const addCleanHeader = (doc: jsPDF, pageWidth: number): number => {
  // Header background
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Logo area (placeholder)
  doc.setFillColor(...colors.white);
  doc.rect(10, 5, 25, 25, 'F');
  doc.setDrawColor(...colors.secondary);
  doc.rect(10, 5, 25, 25, 'S');
  
  // Logo text
  doc.setFontSize(8);
  doc.setTextColor(...colors.secondary);
  doc.text('AuthenCore', 12, 20);
  doc.text('Analytics', 12, 26);
  
  // Main title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('Career Launch Assessment', 45, 20);
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Career Development Report', 45, 28);
  
  // Confidential badge
  doc.setFillColor(...colors.accent);
  doc.rect(pageWidth - 60, 8, 50, 18, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text('CONFIDENTIAL', pageWidth - 55, 19);
  
  return 45;
};

// User information section
const addUserInfo = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos + 10;
  
  // Section background
  doc.setFillColor(...colors.light);
  doc.rect(15, yPosition - 5, 180, 35, 'F');
  doc.setDrawColor(...colors.neutral);
  doc.rect(15, yPosition - 5, 180, 35, 'S');
  
  // Section title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.secondary);
  doc.text('Candidate Information', 20, yPosition + 5);
  
  // User details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.neutral);
  
  yPosition += 15;
  doc.text(`Name: ${cleanText(data.userInfo.name)}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Email: ${cleanText(data.userInfo.email)}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Assessment Date: ${cleanText(data.userInfo.assessmentDate) || new Date().toLocaleDateString()}`, 20, yPosition);
  
  // Report ID if available
  if (data.userInfo.reportId) {
    yPosition += 6;
    doc.text(`Report ID: ${cleanText(data.userInfo.reportId)}`, 20, yPosition);
  }
  
  return yPosition + 20;
};

// Score summary with visual indicators
const addScoreSummary = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos + 10;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.secondary);
  doc.text('Assessment Summary', 20, yPosition);
  yPosition += 15;
  
  // Overall score box
  if (data.overallScore !== undefined) {
    const score = safeNumber(data.overallScore);
    
    // Score card
    doc.setFillColor(...colors.primary);
    doc.rect(20, yPosition, 80, 30, 'F');
    
    // Score text
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text('Overall Score', 25, yPosition + 12);
    
    doc.setFontSize(24);
    doc.text(`${score}/100`, 25, yPosition + 25);
    
    // Score interpretation
    const interpretation = score >= 85 ? 'Excellent' : 
                          score >= 70 ? 'Good' : 
                          score >= 55 ? 'Average' : 'Developing';
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.secondary);
    doc.text(`Performance Level: ${interpretation}`, 110, yPosition + 15);
  }
  
  // Reliability score
  if (data.userInfo.reliabilityScore) {
    const reliability = safeNumber(data.userInfo.reliabilityScore);
    yPosition += 40;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text('Response Reliability', 20, yPosition);
    
    // Reliability bar
    const barWidth = (reliability / 100) * 100;
    doc.setFillColor(...colors.light);
    doc.rect(20, yPosition + 5, 100, 10, 'F');
    doc.setFillColor(...colors.accent);
    doc.rect(20, yPosition + 5, barWidth, 10, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.neutral);
    doc.text(`${reliability}% - ${reliability >= 85 ? 'Highly Reliable' : reliability >= 70 ? 'Reliable' : 'Moderate'}`, 130, yPosition + 12);
  }
  
  return yPosition + 25;
};

// Section header utility
const addSectionHeader = (doc: jsPDF, title: string, yPos: number): number => {
  doc.setFillColor(...colors.secondary);
  doc.rect(0, yPos - 5, doc.internal.pageSize.getWidth(), 20, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.white);
  doc.text(title, 20, yPos + 8);
  
  return yPos + 25;
};

// Dimensional analysis with clean bars
const addDimensionalAnalysis = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.dimensions) return yPosition;
  
  const dimensionArray = Array.isArray(data.dimensions) 
    ? data.dimensions 
    : Object.entries(data.dimensions).map(([key, value]) => ({
        name: cleanText(key.replace(/_/g, ' ')),
        score: safeNumber(value)
      }));
  
  // RIASEC types with simple icons
  const riasecTypes = [
    { name: 'Realistic', icon: 'Tools & Hands-on', color: colors.primary },
    { name: 'Investigative', icon: 'Research & Analysis', color: colors.accent },
    { name: 'Artistic', icon: 'Creative & Design', color: colors.secondary },
    { name: 'Social', icon: 'People & Service', color: colors.primary },
    { name: 'Enterprising', icon: 'Business & Leadership', color: colors.accent },
    { name: 'Conventional', icon: 'Organization & Detail', color: colors.secondary }
  ];
  
  dimensionArray.slice(0, 6).forEach((dim, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'Assessment Dimensions (Continued)', 20);
    }
    
    const riasecType = riasecTypes[index] || { name: dim.name, icon: 'General', color: colors.neutral };
    
    // Dimension name and description
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text(cleanText(dim.name), 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.neutral);
    doc.text(riasecType.icon, 20, yPosition + 8);
    
    // Score bar
    const barWidth = (dim.score / 100) * 120;
    doc.setFillColor(...colors.light);
    doc.rect(20, yPosition + 12, 120, 8, 'F');
    doc.setFillColor(riasecType.color[0], riasecType.color[1], riasecType.color[2]);
    doc.rect(20, yPosition + 12, barWidth, 8, 'F');
    
    // Score text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text(`${dim.score}`, 150, yPosition + 18);
    
    // Level indicator
    const level = dim.score >= 75 ? 'High' : dim.score >= 50 ? 'Moderate' : 'Low';
    doc.setFontSize(10);
    doc.setTextColor(...colors.neutral);
    doc.text(level, 170, yPosition + 18);
    
    yPosition += 25;
  });
  
  return yPosition + 10;
};

// Career recommendations
const addCareerRecommendations = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.careerMatches) return yPosition;
  
  data.careerMatches.slice(0, 6).forEach((match, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'Career Recommendations (Continued)', 20);
    }
    
    const matchScore = safeNumber(match.match);
    
    // Career card background
    doc.setFillColor(...colors.light);
    doc.rect(15, yPosition - 5, 180, 25, 'F');
    doc.setDrawColor(...colors.primary);
    doc.rect(15, yPosition - 5, 180, 25, 'S');
    
    // Rank circle
    doc.setFillColor(...colors.primary);
    doc.circle(25, yPosition + 7, 6, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text(`${index + 1}`, 22, yPosition + 10);
    
    // Career title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text(cleanText(match.title), 35, yPosition + 5);
    
    // Match percentage
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.accent);
    doc.text(`${matchScore}%`, 160, yPosition + 5);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.neutral);
    doc.text('Match', 160, yPosition + 15);
    
    // Brief description
    if (match.description) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.neutral);
      const desc = cleanText(match.description).substring(0, 80) + '...';
      doc.text(desc, 35, yPosition + 15);
    }
    
    yPosition += 30;
  });
  
  return yPosition + 10;
};

// Development plan
const addDevelopmentPlan = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.recommendations) return yPosition;
  
  const priorities = ['High Priority', 'Medium Priority', 'Long-term Goal'];
  const timeframes = ['1-3 months', '3-6 months', '6-12 months'];
  
  data.recommendations.slice(0, 6).forEach((rec, index) => {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = addSectionHeader(doc, 'Development Action Plan (Continued)', 20);
    }
    
    const priority = priorities[index % 3];
    const timeframe = timeframes[index % 3];
    const priorityColor = index % 3 === 0 ? colors.accent : 
                         index % 3 === 1 ? colors.primary : colors.neutral;
    
    // Priority badge
    doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
    doc.rect(20, yPosition - 3, 60, 12, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text(priority, 22, yPosition + 5);
    
    // Timeframe
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.neutral);
    doc.text(timeframe, 90, yPosition + 5);
    
    // Recommendation text
    yPosition += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.secondary);
    
    const cleanedRec = cleanText(rec);
    const lines = doc.splitTextToSize(cleanedRec, 170);
    
    if (Array.isArray(lines)) {
      lines.slice(0, 3).forEach((line, lineIndex) => {
        doc.text(line, 20, yPosition + (lineIndex * 5));
      });
      yPosition += lines.length * 5 + 10;
    } else {
      doc.text(lines, 20, yPosition);
      yPosition += 15;
    }
  });
  
  return yPosition;
};

// Add footers to all pages
const addPageFooters = (doc: jsPDF): void => {
  const totalPages = (doc as any).internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(...colors.neutral);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(...colors.neutral);
    doc.text('AuthenCore Analytics - Professional Career Assessment', 20, pageHeight - 12);
    doc.text('Confidential Report - For Professional Use Only', 20, pageHeight - 7);
    
    // Page number
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 7);
  }
};

// Export additional functions for specific report types
export const generateProfessionalPdf = (data: SimplePdfData, reportType: ReportType = 'applicant'): void => {
  // For now, all types use the same clean implementation
  // Can be extended later with type-specific layouts
  generateClientSidePdf(data);
};