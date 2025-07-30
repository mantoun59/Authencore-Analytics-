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

export type ReportType = 'applicant' | 'advisor' | 'certificate';

// Convert image to base64 for embedding in PDF
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

// Professional color scheme (RGB values for jsPDF compatibility)
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

// Enhanced text processing with proper Unicode support
const normalizeText = (text: any): string => {
  if (!text) return 'N/A';
  if (typeof text !== 'string') text = String(text);
  
  // More aggressive text cleaning for PDF compatibility
  return text
    .normalize('NFKC') // Use canonical composition
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^\x20-\x7E]/g, ' ') // Replace non-ASCII with spaces
    .replace(/[""'']/g, '"') // Normalize quotes
    .replace(/[–—]/g, '-') // Normalize dashes
    .replace(/…/g, '...') // Fix ellipsis
    .replace(/\s+/g, ' ') // Normalize all whitespace
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

// Main PDF generation function with enhanced visuals
export const generateClientSidePdf = async (data: SimplePdfData): Promise<void> => {
  console.log('Starting enhanced PDF generation for:', data.userInfo?.name);
  
  try {
    validateInput(data);
    
    const doc = new jsPDF();
    
    // Set proper encoding and font for Unicode support
    doc.setFont('helvetica', 'normal');
    doc.setCharSpace(0);
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Try to get logo base64
    let logoBase64: string | null = null;
    try {
      logoBase64 = await getLogoBase64();
    } catch (error) {
      console.warn('Could not load logo, using text fallback:', error);
    }

    // Page 1: Professional Cover & Executive Summary
    yPosition = await addEnhancedHeader(doc, pageWidth, logoBase64);
    yPosition = addExecutiveSummary(doc, data, yPosition);
    yPosition = addKeyMetrics(doc, data, yPosition);
    
    // Page 2: Dimensional Analysis with Charts
    doc.addPage();
    yPosition = 20;
    yPosition = addSectionHeader(doc, 'RIASEC Interest Profile Analysis', yPosition);
    yPosition = addRiasecVisualization(doc, data, yPosition);
    
    // Page 3: Career Recommendations with Rankings
    if (data.careerMatches && data.careerMatches.length > 0) {
      doc.addPage();
      yPosition = 20;
      yPosition = addSectionHeader(doc, 'Top Career Recommendations', yPosition);
      yPosition = addEnhancedCareerCards(doc, data, yPosition);
    }
    
    // Page 4: Development Action Plan with Timeline
    if (data.recommendations && data.recommendations.length > 0) {
      doc.addPage();
      yPosition = 20;
      yPosition = addSectionHeader(doc, 'Personal Development Roadmap', yPosition);
      yPosition = addEnhancedActionPlan(doc, data, yPosition);
    }
    
    // Page 5: Assessment Methodology
    doc.addPage();
    yPosition = 20;
    yPosition = addSectionHeader(doc, 'Assessment Methodology & Validity', yPosition);
    yPosition = addMethodologySection(doc, data, yPosition);
    
    // Add professional footers to all pages
    addEnhancedFooters(doc);
    
    // Generate clean filename
    const cleanName = normalizeText(data.userInfo.name).replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${cleanName}_Career_Report_${timestamp}.pdf`;
    
    console.log('Enhanced PDF generation completed successfully:', filename);
    doc.save(filename);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert(`PDF generation failed: ${error.message}`);
    throw error;
  }
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
  doc.text('🛡️ CONFIDENTIAL', pageWidth - 62, 37);
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
  doc.text(`${priority.icon} ${normalizeText(priority.label)}`, 45, yPos + 10);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text(`Timeline: ${normalizeText(priority.timeframe)}`, 130, yPos + 10);
  
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
