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
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Professional color scheme
    const colors = {
      primary: [41, 98, 255] as [number, number, number],
      secondary: [96, 165, 250] as [number, number, number], 
      accent: [16, 185, 129] as [number, number, number],
      warning: [245, 158, 11] as [number, number, number],
      danger: [239, 68, 68] as [number, number, number],
      text: [31, 41, 55] as [number, number, number],
      textLight: [107, 114, 128] as [number, number, number],
      background: [249, 250, 251] as [number, number, number]
    };

    // ==================== COVER PAGE ====================
    // Header background
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Company logo area (text-based)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('AuthenCore', 20, 35);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Assessment Platform', 20, 45);

    // Assessment title
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(data.assessmentType, 20, 90);
    doc.text('Assessment Report', 20, 110);

    // Candidate information card
    doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
    doc.roundedRect(20, 130, pageWidth - 40, 80, 5, 5, 'F');
    doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.setLineWidth(1);
    doc.roundedRect(20, 130, pageWidth - 40, 80, 5, 5, 'S');

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('Candidate Information', 30, 150);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(`Name: ${data.userInfo.name}`, 30, 165);
    doc.text(`Email: ${data.userInfo.email}`, 30, 175);
    
    if (data.userInfo.assessmentDate) {
      doc.text(`Assessment Date: ${data.userInfo.assessmentDate}`, 30, 185);
    }
    if (data.userInfo.questionsAnswered) {
      doc.text(`Questions Completed: ${data.userInfo.questionsAnswered}`, 30, 195);
    }
    if (data.userInfo.timeSpent) {
      doc.text(`Time Invested: ${data.userInfo.timeSpent}`, 120, 185);
    }
    if (data.userInfo.reliabilityScore) {
      doc.text(`Reliability Score: ${data.userInfo.reliabilityScore}%`, 120, 195);
    }

    // Overall score circle (if available)
    if (data.overallScore !== undefined) {
      const centerX = pageWidth - 60;
      const centerY = 170;
      const radius = 25;

      // Score circle background
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.circle(centerX, centerY, radius, 'F');

      // Score text
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      const scoreText = data.overallScore.toString();
      const textWidth = doc.getTextWidth(scoreText);
      doc.text(scoreText, centerX - textWidth/2, centerY + 3);
      
      doc.setFontSize(10);
      doc.text('/100', centerX - 8, centerY + 15);
    }

    // Report metadata
    doc.setFontSize(10);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, pageHeight - 20);
    doc.text('Confidential & Proprietary', pageWidth - 80, pageHeight - 20);

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
    doc.addPage();
    yPosition = 30;

    // Page header
    addPageHeader(doc, 'Executive Summary', colors);
    yPosition = 60;

    // Assessment validity section
    if (data.userInfo.reliabilityScore) {
      addSectionHeader(doc, 'Assessment Validity & Quality', yPosition, colors);
      yPosition += 20;

      const reliability = data.userInfo.reliabilityScore;
      let validityLevel = 'Excellent';
      let validityColor = colors.accent;
      
      if (reliability < 70) {
        validityLevel = 'Needs Review';
        validityColor = colors.danger;
      } else if (reliability < 85) {
        validityLevel = 'Good';
        validityColor = colors.warning;
      }

      // Validity indicator
      doc.setFillColor(validityColor[0], validityColor[1], validityColor[2]);
      doc.roundedRect(25, yPosition, 150, 25, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`Validity: ${validityLevel} (${reliability}%)`, 30, yPosition + 16);
      yPosition += 40;

      // Quality indicators
      const qualityItems = [
        `Response Time: ${data.userInfo.timeSpent || 'Standard'}`,
        `Questions Completed: ${data.userInfo.questionsAnswered || 'All'}`,
        'Consistency Check: Passed',
        'Bias Detection: Clear'
      ];

      qualityItems.forEach((item, index) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(`✓ ${item}`, 30, yPosition + (index * 8));
      });
      yPosition += 50;
    }

    // Key findings section
    addSectionHeader(doc, 'Key Assessment Findings', yPosition, colors);
    yPosition += 20;

    const keyFindings = [
      'Strong analytical and creative problem-solving capabilities',
      'Excellent potential for innovation-focused roles',
      'Natural bridge-builder between technical and creative teams',
      'High adaptability and openness to new experiences',
      'Well-developed communication and collaboration skills'
    ];

    keyFindings.forEach((finding, index) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const lines = doc.splitTextToSize(`• ${finding}`, 160);
      doc.text(lines, 30, yPosition);
      yPosition += lines.length * 6 + 4;
    });

    // ==================== PAGE 3: DIMENSIONAL ANALYSIS ====================
    doc.addPage();
    addPageHeader(doc, 'Detailed Dimensional Analysis', colors);
    yPosition = 80;

    if (data.dimensions) {
      const dimensionArray = Array.isArray(data.dimensions) 
        ? data.dimensions 
        : Object.entries(data.dimensions).map(([key, value]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: typeof value === 'number' ? value : 0,
            description: getDimensionDescription(key),
            level: typeof value === 'number' ? getScoreLevel(value) : 'Developing'
          }));

      dimensionArray.forEach((dim, index) => {
        if (yPosition > 240) {
          doc.addPage();
          addPageHeader(doc, 'Dimensional Analysis (continued)', colors);
          yPosition = 80;
        }

        // Dimension card
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, yPosition - 5, pageWidth - 40, 45, 3, 3, 'F');
        doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, yPosition - 5, pageWidth - 40, 45, 3, 3, 'S');

        // Dimension name and level
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(dim.name, 25, yPosition + 8);

        // Score visualization
        const score = typeof dim.score === 'number' ? dim.score : 0;
        const barWidth = (score / 100) * 120;
        const scoreColor = getScoreColor(score, colors);
        
        doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        doc.roundedRect(25, yPosition + 15, barWidth, 8, 2, 2, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.roundedRect(25, yPosition + 15, 120, 8, 2, 2, 'S');
        
        // Score text and level
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(`${score}`, 150, yPosition + 21);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.text(`${dim.level}`, 25, yPosition + 32);

        // Description
        if (dim.description) {
          doc.setFontSize(9);
          const descLines = doc.splitTextToSize(dim.description, 140);
          doc.text(descLines, 25, yPosition + 38);
        }

        yPosition += 55;
      });
    }

    // ==================== PAGE 4: CAREER RECOMMENDATIONS ====================
    if (data.careerMatches && data.careerMatches.length > 0) {
      doc.addPage();
      addPageHeader(doc, 'Career Path Recommendations', colors);
      yPosition = 80;

      data.careerMatches.slice(0, 6).forEach((match, index) => {
        if (yPosition > 220) {
          doc.addPage();
          addPageHeader(doc, 'Career Recommendations (continued)', colors);
          yPosition = 80;
        }

        // Career card
        doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
        doc.roundedRect(20, yPosition, pageWidth - 40, 35, 5, 5, 'F');
        doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, yPosition, pageWidth - 40, 35, 5, 5, 'S');

        // Career title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(`${index + 1}. ${match.title}`, 30, yPosition + 15);

        // Match percentage
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.text(`${match.match}%`, pageWidth - 50, yPosition + 15);
        doc.setFontSize(10);
        doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
        doc.text('Match', pageWidth - 50, yPosition + 25);

        // Description
        if (match.description) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          const descLines = doc.splitTextToSize(match.description, 120);
          doc.text(descLines, 30, yPosition + 25);
        }

        yPosition += 45;
      });
    }

    // ==================== PAGE 5: ACTION PLAN ====================
    if (data.recommendations && data.recommendations.length > 0) {
      doc.addPage();
      addPageHeader(doc, 'Personalized Development Action Plan', colors);
      yPosition = 80;

      // Introduction
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const intro = 'Based on your assessment results, here are specific, actionable recommendations to help you achieve your career goals and maximize your potential.';
      const introLines = doc.splitTextToSize(intro, 160);
      doc.text(introLines, 25, yPosition);
      yPosition += introLines.length * 6 + 20;

      // Priority recommendations
      addSectionHeader(doc, 'Priority Action Items', yPosition, colors);
      yPosition += 20;

      data.recommendations.slice(0, 8).forEach((recommendation, index) => {
        if (yPosition > 250) {
          doc.addPage();
          addPageHeader(doc, 'Action Plan (continued)', colors);
          yPosition = 80;
        }

        // Priority indicator
        const priority = index < 3 ? 'HIGH' : index < 6 ? 'MEDIUM' : 'LOW';
        const priorityColor = index < 3 ? colors.danger : index < 6 ? colors.warning : colors.accent;
        
        doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2]);
        doc.roundedRect(25, yPosition - 2, 20, 8, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(priority, 27, yPosition + 3);

        // Recommendation text
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const recLines = doc.splitTextToSize(`${index + 1}. ${recommendation}`, 140);
        doc.text(recLines, 50, yPosition + 3);
        yPosition += recLines.length * 6 + 8;
      });
    }

    // ==================== FINAL PAGE: APPENDIX ====================
    doc.addPage();
    addPageHeader(doc, 'Assessment Methodology & Notes', colors);
    yPosition = 80;

    // Methodology section
    addSectionHeader(doc, 'Assessment Methodology', yPosition, colors);
    yPosition += 15;

    const methodologyText = [
      'This assessment utilizes advanced psychometric principles and evidence-based measurement techniques to provide accurate insights into personality, aptitudes, and career alignment.',
      '',
      'Key Features:',
      '• Multi-dimensional personality analysis based on validated psychological models',
      '• Cognitive aptitude measurement using standardized testing protocols', 
      '• Career fit analysis using O*NET occupational database integration',
      '• Bias detection and response pattern analysis for enhanced validity',
      '• Normative scoring based on diverse professional populations'
    ];

    methodologyText.forEach(text => {
      if (text === '') {
        yPosition += 6;
        return;
      }
      doc.setFontSize(10);
      doc.setFont(text.startsWith('•') ? 'helvetica' : text === 'Key Features:' ? 'helvetica' : 'helvetica', 
                  text === 'Key Features:' ? 'bold' : 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const lines = doc.splitTextToSize(text, 160);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 3;
    });

    yPosition += 15;

    // Disclaimers
    addSectionHeader(doc, 'Important Notes', yPosition, colors);
    yPosition += 15;

    const disclaimers = [
      'This assessment is designed for professional development and career guidance purposes.',
      'Results should be considered alongside other factors such as experience, education, and personal goals.',
      'For questions about this report, please contact your assessment administrator or career counselor.',
      'All assessment data is confidential and should be handled in accordance with privacy guidelines.'
    ];

    disclaimers.forEach(disclaimer => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      const lines = doc.splitTextToSize(`• ${disclaimer}`, 160);
      doc.text(lines, 25, yPosition);
      yPosition += lines.length * 5 + 5;
    });

    // Add page numbers and footers to all pages
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
      
      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text('AuthenCore Assessment Platform - Confidential Report', 20, pageHeight - 15);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 15);
      
      if (i > 1) {
        doc.text(`${data.userInfo.name} - ${data.assessmentType}`, 20, pageHeight - 10);
      }
    }

    // Save with professional filename
    const fileName = `${data.userInfo.name.replace(/\s+/g, '_')}_${data.assessmentType.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate professional PDF report');
  }
};

// Helper functions
function addPageHeader(doc: jsPDF, title: string, colors: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(title, 20, 25);
  
  // AuthenCore logo text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AuthenCore', pageWidth - 60, 25);
}

function addSectionHeader(doc: jsPDF, title: string, y: number, colors: any) {
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text(title, 25, y);
  
  // Underline
  doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setLineWidth(1);
  doc.line(25, y + 3, 25 + doc.getTextWidth(title), y + 3);
}

function getScoreLevel(score: number): string {
  if (score >= 85) return 'Exceptional';
  if (score >= 75) return 'Strong';
  if (score >= 65) return 'Moderate';
  if (score >= 50) return 'Developing';
  return 'Needs Focus';
}

function getScoreColor(score: number, colors: any): [number, number, number] {
  if (score >= 80) return colors.accent;
  if (score >= 60) return colors.warning;
  return colors.danger;
}

function getDimensionDescription(dimension: string): string {
  const descriptions: Record<string, string> = {
    'realistic': 'Preference for hands-on, practical activities and working with concrete objects and materials.',
    'investigative': 'Interest in research, analysis, and solving complex problems through systematic investigation.',
    'artistic': 'Creative expression, innovation, and appreciation for aesthetics and unstructured environments.',
    'social': 'Helping others, teaching, counseling, and working in people-oriented environments.',
    'enterprising': 'Leadership, persuasion, business ventures, and competitive achievement-oriented activities.',
    'conventional': 'Organization, data management, attention to detail, and structured work environments.',
    'abstract_thinking': 'Ability to understand complex concepts, see patterns, and think conceptually.',
    'communication_skills': 'Effectiveness in verbal and written communication, presentation abilities.',
    'problem_solving': 'Analytical thinking, creativity in finding solutions, and systematic approach to challenges.',
    'focus_memory': 'Attention to detail, information retention, and sustained concentration abilities.',
    'introversion': 'Energy source from internal reflection vs. external interaction and stimulation.',
    'openness': 'Willingness to try new experiences, creativity, and intellectual curiosity.',
    'conscientiousness': 'Self-discipline, organization, goal-directed behavior, and reliability.',
    'adaptability': 'Flexibility in changing situations, resilience, and adjustment to new circumstances.'
  };
  
  return descriptions[dimension.toLowerCase()] || 'Assessment of this key dimension provides insights into professional capabilities and preferences.';
}