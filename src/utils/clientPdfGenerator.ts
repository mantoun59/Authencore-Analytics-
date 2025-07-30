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
  interviewQuestions?: string[];
  coachingPlan?: Array<{ priority: string; timeline: string; target: string; tools: string }>;
  [key: string]: any;
}

export type ReportType = 'applicant' | 'advisor' | 'certificate';

// Professional color scheme
const colors = {
  primary: [0, 128, 128] as [number, number, number], // Teal
  secondary: [0, 51, 102] as [number, number, number], // Dark Blue
  accent: [16, 185, 129] as [number, number, number], // Green
  neutral: [107, 114, 128] as [number, number, number], // Gray
  light: [249, 250, 251] as [number, number, number], // Light Gray
  white: [255, 255, 255] as [number, number, number]
};

// Professional PDF generator with multiple report types
export const generateProfessionalPdf = (data: SimplePdfData, reportType: ReportType = 'applicant'): void => {
  try {
    validateInput(data);
    
    console.log(`Starting ${reportType} PDF generation for:`, data.userInfo.name);

    const doc = new jsPDF();
    
    switch (reportType) {
      case 'applicant':
        generateApplicantReport(doc, data);
        break;
      case 'advisor':
        generateAdvisorReport(doc, data);
        break;
      case 'certificate':
        generateCertificate(doc, data);
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    const fileName = generateFileName(data, reportType);
    console.log('PDF generation completed successfully. Saving as:', fileName);
    doc.save(fileName);

  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF report. Please check the console for details and try again.');
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Legacy function for backward compatibility
export const generateClientSidePdf = (data: SimplePdfData): void => {
  generateProfessionalPdf(data, 'applicant');
};

// Input validation
const validateInput = (data: SimplePdfData): void => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided to PDF generator');
  }
  if (!data.userInfo?.name || !data.userInfo?.email) {
    throw new Error('Missing required user information (name/email)');
  }
};

// Text cleaning utility
const cleanText = (text: string): string => {
  if (!text || typeof text !== 'string') return 'N/A';
  return text.replace(/[^\x00-\x7F]/g, "").trim() || 'N/A';
};

// File name generator
const generateFileName = (data: SimplePdfData, reportType: ReportType): string => {
  const name = cleanText(data.userInfo.name).replace(/\s+/g, '_');
  const date = new Date().toISOString().split('T')[0];
  const suffix = reportType === 'certificate' ? '_Certificate' : 
                reportType === 'advisor' ? '_Advisor_Report' : '_Report';
  return `${name}${suffix}_${date}.pdf`;
};

// Professional header with logo space
const addProfessionalHeader = (doc: jsPDF, title: string, subtitle?: string): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Logo space (left side)
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.rect(15, 10, 25, 25, 'F');
  doc.setFontSize(8);
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('LOGO', 20, 25);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(title, 50, 25);
  
  // Subtitle
  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 50, 35);
  }
  
  // Confidential badge
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(pageWidth - 80, 15, 65, 15, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('CONFIDENTIAL', pageWidth - 75, 25);
  
  return 55; // Return Y position after header
};

// Professional footer
const addProfessionalFooter = (doc: jsPDF): void => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(8);
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text('AuthenCore Analytics - Professional Assessment Report', 20, pageHeight - 15);
  doc.text('This report is confidential and for professional use only', 20, pageHeight - 10);
  
  const totalPages = (doc as any).internal.getNumberOfPages();
  const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
  doc.text(`Page ${currentPage} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
};

// Executive summary card
const addExecutiveSummary = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = yPos;
  
  // Section title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Executive Summary', 20, yPosition);
  yPosition += 15;
  
  // Summary cards in 2-column layout
  const cardWidth = 80;
  const cardHeight = 35;
  
  // Left column - Overall Score
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.rect(20, yPosition, cardWidth, cardHeight, 'F');
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(20, yPosition, cardWidth, cardHeight, 'S');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Overall Score', 25, yPosition + 10);
  
  if (data.overallScore !== undefined) {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(data.overallScore.toString(), 25, yPosition + 25);
    doc.setFontSize(12);
    doc.text('/100', 50, yPosition + 25);
  }
  
  // Right column - Validity Level
  const rightCardX = 110;
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.rect(rightCardX, yPosition, cardWidth, cardHeight, 'F');
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.rect(rightCardX, yPosition, cardWidth, cardHeight, 'S');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Reliability Score', rightCardX + 5, yPosition + 10);
  
  if (data.userInfo.reliabilityScore) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(data.userInfo.reliabilityScore.toString() + '%', rightCardX + 5, yPosition + 25);
    
    const validityLevel = data.userInfo.reliabilityScore >= 90 ? 'Excellent' :
                         data.userInfo.reliabilityScore >= 80 ? 'Good' :
                         data.userInfo.reliabilityScore >= 70 ? 'Moderate' : 'Low';
    doc.setFontSize(10);
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(validityLevel, rightCardX + 5, yPosition + 32);
  }
  
  return yPosition + cardHeight + 20;
};

// RIASEC visualization
const addRiasecAnalysis = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('RIASEC Interest Profile', 20, yPosition);
  yPosition += 15;
  
  const riasecData = data.riasecResults || {};
  const riasecTypes = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
  const icons = ['🔧', '🔍', '🎨', '👥', '📈', '📊'];
  
  riasecTypes.forEach((type, index) => {
    if (yPosition > 250) {
      doc.addPage();
      addProfessionalHeader(doc, 'Career Launch Assessment', 'Personalized Report');
      yPosition = 60;
    }
    
    const score = riasecData[type] || 0;
    const barWidth = (score / 100) * 120;
    
    // Type label with icon representation
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(`${icons[index]} ${type}`, 20, yPosition);
    
    // Score
    doc.setFontSize(11);
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(score.toString(), 75, yPosition);
    
    // Progress bar
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.rect(85, yPosition - 5, 120, 8, 'F');
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(85, yPosition - 5, barWidth, 8, 'F');
    
    // Level indicator
    const level = score >= 80 ? 'High' : score >= 60 ? 'Moderate' : score >= 40 ? 'Average' : 'Low';
    doc.setFontSize(10);
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(level, 210, yPosition);
    
    yPosition += 15;
  });
  
  return yPosition + 10;
};

// Career recommendations as cards
const addCareerCards = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.careerMatches || data.careerMatches.length === 0) return yPosition;
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Top Career Recommendations', 20, yPosition);
  yPosition += 15;
  
  data.careerMatches.slice(0, 5).forEach((match, index) => {
    if (yPosition > 240) {
      doc.addPage();
      addProfessionalHeader(doc, 'Career Launch Assessment', 'Personalized Report');
      yPosition = 60;
    }
    
    const cardHeight = 25;
    
    // Career card background
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.rect(20, yPosition, 170, cardHeight, 'F');
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(20, yPosition, 170, cardHeight, 'S');
    
    // Rank badge
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.circle(30, yPosition + 12, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.text((index + 1).toString(), 27, yPosition + 15);
    
    // Career title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(cleanText(match.title), 45, yPosition + 10);
    
    // Match percentage
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(match.match.toString() + '%', 150, yPosition + 10);
    doc.setFontSize(10);
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text('match', 150, yPosition + 20);
    
    // Description (if available)
    if (match.description) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
      const desc = cleanText(match.description).substring(0, 60) + '...';
      doc.text(desc, 45, yPosition + 20);
    }
    
    yPosition += cardHeight + 8;
  });
  
  return yPosition + 10;
};

// Development action plan with timeline
const addActionPlan = (doc: jsPDF, data: SimplePdfData, yPos: number): number => {
  let yPosition = yPos;
  
  if (!data.recommendations || data.recommendations.length === 0) return yPosition;
  
  if (yPosition > 200) {
    doc.addPage();
    addProfessionalHeader(doc, 'Career Launch Assessment', 'Personalized Report');
    yPosition = 60;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Personalized Action Plan', 20, yPosition);
  yPosition += 15;
  
  const priorities = ['🔥 High', '⚡ Medium', '📅 Long-term'];
  const timelines = ['1-3 months', '3-6 months', '6-12 months'];
  
  data.recommendations.slice(0, 6).forEach((rec, index) => {
    if (yPosition > 250) {
      doc.addPage();
      addProfessionalHeader(doc, 'Career Launch Assessment', 'Personalized Report');
      yPosition = 60;
    }
    
    const priority = priorities[index % 3];
    const timeline = timelines[index % 3];
    
    // Priority badge
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text(priority, 20, yPosition);
    
    // Timeline
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(timeline, 60, yPosition);
    
    // Recommendation text
    yPosition += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    const lines = doc.splitTextToSize(cleanText(rec), 150);
    if (Array.isArray(lines)) {
      lines.forEach((line, lineIndex) => {
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

// Generate applicant report
const generateApplicantReport = (doc: jsPDF, data: SimplePdfData): void => {
  let yPosition = addProfessionalHeader(doc, 'Career Launch Assessment', 'Personalized Report');
  
  // Candidate info section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Candidate Information', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  doc.text(`Name: ${cleanText(data.userInfo.name)}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Email: ${cleanText(data.userInfo.email)}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Assessment Date: ${data.userInfo.assessmentDate || new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 8;
  if (data.userInfo.reportId) {
    doc.text(`Report ID: ${data.userInfo.reportId}`, 20, yPosition);
    yPosition += 8;
  }
  yPosition += 10;
  
  // Executive summary
  yPosition = addExecutiveSummary(doc, data, yPosition);
  
  // Add new page for detailed analysis
  doc.addPage();
  yPosition = addProfessionalHeader(doc, 'Career Launch Assessment', 'Detailed Analysis');
  
  // RIASEC analysis
  yPosition = addRiasecAnalysis(doc, data, yPosition);
  
  // Add new page for career recommendations
  doc.addPage();
  yPosition = addProfessionalHeader(doc, 'Career Launch Assessment', 'Career Guidance');
  
  // Career cards
  yPosition = addCareerCards(doc, data, yPosition);
  
  // Action plan
  yPosition = addActionPlan(doc, data, yPosition);
  
  // Add methodology page
  doc.addPage();
  yPosition = addProfessionalHeader(doc, 'Assessment Methodology', 'Technical Information');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Assessment Framework', 20, yPosition);
  yPosition += 15;
  
  const methodology = [
    '📚 RIASEC Interest Assessment - Based on Holland\'s career theory',
    '🎯 O*NET Career Database - 900+ career matches',
    '🧠 Cognitive Aptitude Measures - Problem-solving and reasoning',
    '🔐 Response Quality Validation - Ensures accurate results'
  ];
  
  methodology.forEach(item => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(item, 20, yPosition);
    yPosition += 12;
  });
  
  // Add footer to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addProfessionalFooter(doc);
  }
};

// Generate advisor report
const generateAdvisorReport = (doc: jsPDF, data: SimplePdfData): void => {
  let yPosition = addProfessionalHeader(doc, 'Career Launch Assessment', 'Coaching Summary Report');
  
  // Snapshot overview table
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('Candidate Snapshot', 20, yPosition);
  yPosition += 15;
  
  const snapshot = [
    ['Candidate', cleanText(data.userInfo.name)],
    ['Date', data.userInfo.assessmentDate || new Date().toLocaleDateString()],
    ['Reliability Score', (data.userInfo.reliabilityScore || 0) + '%'],
    ['Risk Flags', data.riskFlags?.length ? data.riskFlags.join(', ') : 'None'],
    ['Primary Style', data.profile || 'Mixed Profile'],
    ['Top Career Cluster', data.careerMatches?.[0]?.title || 'Various']
  ];
  
  snapshot.forEach(([label, value]) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(label + ':', 20, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    doc.text(value, 90, yPosition);
    yPosition += 12;
  });
  
  yPosition += 10;
  
  // Risk alerts section
  if (data.riskFlags && data.riskFlags.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text('⚠️ Risk Alerts', 20, yPosition);
    yPosition += 15;
    
    data.riskFlags.forEach(flag => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
      doc.text('• ' + cleanText(flag), 25, yPosition);
      yPosition += 10;
    });
    yPosition += 10;
  }
  
  // Interview guide
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('🧭 Suggested Interview Questions', 20, yPosition);
  yPosition += 15;
  
  const defaultQuestions = [
    'What aspects of your assessment results surprised you most?',
    'How do you see yourself using your strongest interests in a career?',
    'What development areas from the report resonate with your experience?',
    'Which career recommendations align with your current goals?',
    'What barriers do you anticipate in pursuing these career paths?'
  ];
  
  const questions = data.interviewQuestions || defaultQuestions;
  questions.slice(0, 8).forEach((question, index) => {
    if (yPosition > 260) {
      doc.addPage();
      addProfessionalHeader(doc, 'Career Launch Assessment', 'Coaching Guide');
      yPosition = 60;
    }
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
    const lines = doc.splitTextToSize((index + 1) + '. ' + cleanText(question), 170);
    if (Array.isArray(lines)) {
      lines.forEach((line, lineIndex) => {
        doc.text(line, 20, yPosition + (lineIndex * 5));
      });
      yPosition += lines.length * 5 + 8;
    } else {
      doc.text(lines, 20, yPosition);
      yPosition += 15;
    }
  });
  
  // Coaching plan section
  if (yPosition > 200) {
    doc.addPage();
    addProfessionalHeader(doc, 'Career Launch Assessment', 'Development Plan');
    yPosition = 60;
  }
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text('🧩 Development Coaching Plan', 20, yPosition);
  yPosition += 15;
  
  if (data.coachingPlan && data.coachingPlan.length > 0) {
    data.coachingPlan.forEach(item => {
      if (yPosition > 250) {
        doc.addPage();
        addProfessionalHeader(doc, 'Career Launch Assessment', 'Development Plan');
        yPosition = 60;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.text(item.priority, 20, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
      doc.text('Timeline: ' + item.timeline, 80, yPosition);
      yPosition += 8;
      
      doc.text('Target: ' + cleanText(item.target), 25, yPosition);
      yPosition += 8;
      doc.text('Tools: ' + cleanText(item.tools), 25, yPosition);
      yPosition += 15;
    });
  }
  
  // Add footer to all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addProfessionalFooter(doc);
  }
};

// Generate certificate
const generateCertificate = (doc: jsPDF, data: SimplePdfData): void => {
  // Landscape orientation for certificate
  const certificate = new jsPDF('landscape');
  const pageWidth = certificate.internal.pageSize.getWidth();
  const pageHeight = certificate.internal.pageSize.getHeight();
  
  // Certificate border
  certificate.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  certificate.setLineWidth(3);
  certificate.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
  certificate.setLineWidth(1);
  certificate.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');
  
  // Logo space
  certificate.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  certificate.rect(30, 30, 40, 30, 'F');
  certificate.setFontSize(10);
  certificate.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  certificate.text('AuthenCore', 35, 50);
  certificate.text('Analytics', 35, 55);
  
  // Certificate title
  certificate.setFontSize(28);
  certificate.setFont('helvetica', 'bold');
  certificate.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  certificate.text('Certificate of Completion', pageWidth / 2, 80, { align: 'center' });
  
  // Recipient section
  certificate.setFontSize(16);
  certificate.setFont('helvetica', 'normal');
  certificate.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  certificate.text('This certifies that', pageWidth / 2, 110, { align: 'center' });
  
  certificate.setFontSize(24);
  certificate.setFont('helvetica', 'bold');
  certificate.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  certificate.text(cleanText(data.userInfo.name), pageWidth / 2, 130, { align: 'center' });
  
  certificate.setFontSize(16);
  certificate.setFont('helvetica', 'normal');
  certificate.text('has successfully completed the', pageWidth / 2, 150, { align: 'center' });
  
  certificate.setFontSize(20);
  certificate.setFont('helvetica', 'bold');
  certificate.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  certificate.text('Career Launch Assessment', pageWidth / 2, 170, { align: 'center' });
  
  // Date and score
  certificate.setFontSize(14);
  certificate.setFont('helvetica', 'normal');
  certificate.setTextColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  certificate.text('Completed on: ' + (data.userInfo.assessmentDate || new Date().toLocaleDateString()), 
                  pageWidth / 2, 190, { align: 'center' });
  
  if (data.overallScore) {
    certificate.text('Overall Score: ' + data.overallScore + '/100', pageWidth / 2, 205, { align: 'center' });
  }
  
  // Signature line
  certificate.setDrawColor(colors.neutral[0], colors.neutral[1], colors.neutral[2]);
  certificate.line(pageWidth - 120, pageHeight - 60, pageWidth - 40, pageHeight - 60);
  certificate.setFontSize(12);
  certificate.text('AuthenCore Analytics', pageWidth - 80, pageHeight - 50, { align: 'center' });
  certificate.text('Assessment Platform', pageWidth - 80, pageHeight - 40, { align: 'center' });
  
  // Verification QR placeholder
  certificate.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  certificate.rect(30, pageHeight - 80, 25, 25, 'F');
  certificate.setFontSize(8);
  certificate.text('QR Code', 35, pageHeight - 65);
  certificate.text('Verify', 37, pageHeight - 60);
  
  // Copy certificate content to main doc
  const certificatePages = (certificate as any).internal.pages;
  certificatePages.forEach((page: any, index: number) => {
    if (index > 0) {
      doc.addPage('landscape');
      // Copy page content (simplified - in real implementation you'd need proper page copying)
    }
  });
  
  // For now, we'll generate directly on the main doc
  doc.addPage('landscape');
  generateCertificate(doc, data);
};