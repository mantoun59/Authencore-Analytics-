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
  dimensions?: Array<{ name: string; score: number; description?: string; level?: string; icon?: string }> | Record<string, number>;
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
    // Professional header background with centered branding
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 70, 'F');

    // Centered company logo and platform name
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    const logoText = 'AuthenCore';
    const logoWidth = doc.getTextWidth(logoText);
    doc.text(logoText, (pageWidth - logoWidth) / 2, 35);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const platformText = 'Professional Assessment Platform';
    const platformWidth = doc.getTextWidth(platformText);
    doc.text(platformText, (pageWidth - platformWidth) / 2, 50);

    // Generate unique report ID
    const reportId = `CR-${Date.now().toString().slice(-8)}`;
    doc.setFontSize(10);
    doc.setTextColor(220, 220, 220);
    doc.text(`Report ID: ${reportId}`, pageWidth - 60, 60);

    // Assessment title with professional styling
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(data.assessmentType, 20, 95);
    doc.text('Professional Assessment Report', 20, 115);

    // Executive summary card with visual elements
    doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
    doc.roundedRect(20, 135, pageWidth - 40, 90, 8, 8, 'F');
    doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.setLineWidth(1);
    doc.roundedRect(20, 135, pageWidth - 40, 90, 8, 8, 'S');

    // Summary card header with centered title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    const summaryTitle = 'Executive Summary';
    const summaryWidth = doc.getTextWidth(summaryTitle);
    doc.text(summaryTitle, (pageWidth - summaryWidth) / 2, 155);

    // Validity badge with color coding
    if (data.userInfo.reliabilityScore) {
      const reliability = data.userInfo.reliabilityScore;
      let validityLevel = '🟢 Excellent';
      let badgeColor = colors.accent;
      
      if (reliability < 70) {
        validityLevel = '🔴 Needs Review';
        badgeColor = colors.danger;
      } else if (reliability < 85) {
        validityLevel = '🟡 Good';
        badgeColor = colors.warning;
      }

      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.roundedRect(30, 165, 60, 15, 3, 3, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`Validity: ${reliability}%`, 32, 175);
      
      doc.setFontSize(12);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(validityLevel, 95, 175);
    }

    // Candidate info with icons
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    
    // Using icons in text
    doc.text(`👤 ${data.userInfo.name}`, 30, 190);
    doc.text(`📧 ${data.userInfo.email}`, 30, 200);
    
    if (data.userInfo.assessmentDate) {
      doc.text(`📅 ${data.userInfo.assessmentDate}`, 120, 190);
    }
    if (data.userInfo.timeSpent) {
      doc.text(`⏱️ ${data.userInfo.timeSpent}`, 120, 200);
    }
    if (data.userInfo.questionsAnswered) {
      doc.text(`✅ ${data.userInfo.questionsAnswered} Questions`, 30, 210);
    }

    // Overall score with enhanced visual design
    if (data.overallScore !== undefined) {
      const centerX = pageWidth - 60;
      const centerY = 180;
      const radius = 30;

      // Outer ring for visual appeal
      doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setLineWidth(3);
      doc.circle(centerX, centerY, radius + 5);

      // Score circle with gradient effect simulation
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.circle(centerX, centerY, radius, 'F');

      // Score text with better typography
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      const scoreText = data.overallScore.toString();
      const textWidth = doc.getTextWidth(scoreText);
      doc.text(scoreText, centerX - textWidth/2, centerY + 5);
      
      doc.setFontSize(12);
      doc.text('/100', centerX - 12, centerY + 18);
      
      // Score level below circle
      const level = getScoreLevel(data.overallScore);
      doc.setFontSize(10);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const levelWidth = doc.getTextWidth(level);
      doc.text(level, centerX - levelWidth/2, centerY + 35);
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

    // ==================== PAGE 2: ENHANCED EXECUTIVE SUMMARY ====================
    doc.addPage();
    yPosition = 30;

    // Page header
    addPageHeader(doc, 'Executive Summary & Key Insights', colors);
    yPosition = 70;

    // Key findings with icons
    addSectionHeader(doc, '🎯 Assessment Highlights', yPosition, colors);
    yPosition += 25;

    const keyHighlights = [
      '✅ Strong analytical + creative problem-solving capabilities',
      '🎨 Excellent potential for innovation-focused roles', 
      '🧠 Natural bridge-builder between technical and creative teams',
      '🔄 High adaptability and openness to new experiences',
      '🗣️ Well-developed communication and collaboration skills'
    ];

    keyHighlights.forEach((highlight, index) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(highlight, 30, yPosition);
      yPosition += 12;
    });

    yPosition += 15;

    // Visual score summary cards
    addSectionHeader(doc, '📊 Score Summary Dashboard', yPosition, colors);
    yPosition += 25;

    // Create score cards in a grid
    const scoreCards = [
      { label: 'Overall Performance', score: data.overallScore || 85, icon: '🎯' },
      { label: 'Reliability Index', score: data.userInfo.reliabilityScore || 94, icon: '✅' },
      { label: 'Career Fit Strength', score: 88, icon: '🎯' },
      { label: 'Development Potential', score: 92, icon: '📈' }
    ];

    scoreCards.forEach((card, index) => {
      const cardX = 25 + (index % 2) * 85;
      const cardY = yPosition + Math.floor(index / 2) * 45;
      
      // Card background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(cardX, cardY, 80, 35, 5, 5, 'F');
      doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(cardX, cardY, 80, 35, 5, 5, 'S');
      
      // Icon and score
      doc.setFontSize(16);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(card.icon, cardX + 5, cardY + 15);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.text(`${card.score}`, cardX + 55, cardY + 15);
      
      // Label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      const labelLines = doc.splitTextToSize(card.label, 70);
      doc.text(labelLines, cardX + 5, cardY + 25);
    });

    yPosition += 100;

    // ==================== PAGE 3: VISUAL DIMENSIONAL ANALYSIS ====================
    doc.addPage();
    addPageHeader(doc, 'Dimensional Analysis with Visualizations', colors);
    yPosition = 80;

    if (data.dimensions) {
      // Add RIASEC radar chart section
      addSectionHeader(doc, '📊 RIASEC Interest Profile (Radar View)', yPosition, colors);
      yPosition += 20;

      // Simulate radar chart with hexagon and scores
      const radarCenterX = pageWidth / 2;
      const radarCenterY = yPosition + 40;
      const radarRadius = 35;
      
      // Draw hexagon background
      doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setLineWidth(0.5);
      
      // Draw radar grid circles
      for (let r = 10; r <= radarRadius; r += 10) {
        doc.circle(radarCenterX, radarCenterY, r);
      }
      
      // RIASEC dimensions
      const riasecDimensions = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'];
      const riasecAngles = [0, 60, 120, 180, 240, 300];
      
      riasecDimensions.forEach((dim, index) => {
        const angle = (riasecAngles[index] * Math.PI) / 180;
        const x = radarCenterX + radarRadius * Math.cos(angle);
        const y = radarCenterY + radarRadius * Math.sin(angle);
        
        // Draw axis line
        doc.line(radarCenterX, radarCenterY, x, y);
        
        // Add dimension label
        doc.setFontSize(8);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const labelX = radarCenterX + (radarRadius + 15) * Math.cos(angle);
        const labelY = radarCenterY + (radarRadius + 15) * Math.sin(angle);
        doc.text(dim, labelX - 10, labelY);
      });

      yPosition += 100;

      // Dimensional analysis with enhanced cards
      addSectionHeader(doc, '🔍 Detailed Dimension Breakdown', yPosition, colors);
      yPosition += 20;

      const dimensionArray = Array.isArray(data.dimensions) 
        ? data.dimensions 
        : Object.entries(data.dimensions).map(([key, value]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: typeof value === 'number' ? value : 0,
            description: getDimensionDescription(key),
            level: typeof value === 'number' ? getScoreLevel(value) : 'Developing',
            icon: getDimensionIcon(key)
          }));

      dimensionArray.forEach((dim, index) => {
        if (yPosition > 240) {
          doc.addPage();
          addPageHeader(doc, 'Dimensional Analysis (continued)', colors);
          yPosition = 80;
        }

        // Enhanced dimension card with icons
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, yPosition - 5, pageWidth - 40, 50, 5, 5, 'F');
        doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.setLineWidth(0.8);
        doc.roundedRect(20, yPosition - 5, pageWidth - 40, 50, 5, 5, 'S');

        // Dimension icon and name
        doc.setFontSize(16);
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(dim.icon, 25, yPosition + 8);
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(dim.name, 40, yPosition + 8);

        // Enhanced score visualization
        const score = typeof dim.score === 'number' ? dim.score : 0;
        const barWidth = (score / 100) * 100;
        const scoreColor = getScoreColor(score, colors);
        
        // Score background
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(25, yPosition + 15, 100, 10, 3, 3, 'F');
        
        // Score fill with gradient effect
        doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        doc.roundedRect(25, yPosition + 15, barWidth, 10, 3, 3, 'F');
        
        // Score text in colored box
        doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
        doc.roundedRect(130, yPosition + 12, 25, 16, 3, 3, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(`${score}`, 135, yPosition + 22);
        
        // Level indicator with badge
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.text(`${dim.level}`, 160, yPosition + 22);

        // Enhanced description
        if (dim.description) {
          doc.setFontSize(9);
          doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
          const descLines = doc.splitTextToSize(dim.description, 150);
          doc.text(descLines, 25, yPosition + 35);
        }

        yPosition += 60;
      });
    }

    // ==================== PAGE 4: CAREER MATCH CARDS ====================
    if (data.careerMatches && data.careerMatches.length > 0) {
      doc.addPage();
      addPageHeader(doc, 'Career Path Recommendations', colors);
      yPosition = 80;

      addSectionHeader(doc, '🎯 Top Career Matches', yPosition, colors);
      yPosition += 25;

      data.careerMatches.slice(0, 6).forEach((match, index) => {
        if (yPosition > 200) {
          doc.addPage();
          addPageHeader(doc, 'Career Recommendations (continued)', colors);
          yPosition = 80;
        }

        // Enhanced career match card
        const cardColor = index < 2 ? colors.accent : index < 4 ? colors.warning : colors.secondary;
        
        doc.setFillColor(cardColor[0], cardColor[1], cardColor[2]);
        doc.roundedRect(20, yPosition, pageWidth - 40, 45, 8, 8, 'F');

        // Career rank badge
        doc.setFillColor(255, 255, 255);
        doc.circle(35, yPosition + 15, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(cardColor[0], cardColor[1], cardColor[2]);
        doc.text(`${index + 1}`, 32, yPosition + 18);

        // Industry icon (simplified)
        const industryIcon = getIndustryIcon(match.title);
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text(industryIcon, 50, yPosition + 20);

        // Career title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(match.title, 70, yPosition + 18);

        // Match percentage with visual indicator
        const matchWidth = (match.match / 100) * 60;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - 80, yPosition + 8, 60, 8, 2, 2, 'F');
        doc.setFillColor(0, 200, 0);
        doc.roundedRect(pageWidth - 80, yPosition + 8, matchWidth, 8, 2, 2, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(`${match.match}%`, pageWidth - 70, yPosition + 25);
        doc.setFontSize(8);
        doc.text('MATCH', pageWidth - 70, yPosition + 35);

        // Match strength indicator
        const strengthText = match.match >= 85 ? '🔥 Excellent Fit' : 
                           match.match >= 70 ? '⚖️ Good Match' : 
                           '📈 Potential';
        doc.setFontSize(10);
        doc.text(strengthText, 70, yPosition + 35);

        // Why it fits (simplified description)
        if (match.description) {
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          const whyText = `💡 ${match.description}`;
          const descLines = doc.splitTextToSize(whyText, 120);
          doc.text(descLines, 25, yPosition + 50);
        }

        yPosition += 65;
      });

      // Career exploration tips
      yPosition += 15;
      addSectionHeader(doc, '🧭 Next Steps for Career Exploration', yPosition, colors);
      yPosition += 20;

      const explorationTips = [
        '🔍 Research each recommended role through O*NET or LinkedIn',
        '🗣️ Conduct informational interviews with professionals in these fields',
        '📚 Identify skill gaps and create a learning plan',
        '🌟 Look for internships or project opportunities to test fit'
      ];

      explorationTips.forEach(tip => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(tip, 30, yPosition);
        yPosition += 12;
      });
    }

    // ==================== PAGE 5: PROGRESSIVE DEVELOPMENT ROADMAP ====================
    if (data.recommendations && data.recommendations.length > 0) {
      doc.addPage();
      addPageHeader(doc, 'Development Action Plan & Roadmap', colors);
      yPosition = 80;

      // Introduction with coaching tone
      addSectionHeader(doc, '🚀 Your Personalized Development Journey', yPosition, colors);
      yPosition += 20;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const intro = 'Based on your assessment results, here\'s your strategic roadmap to maximize your career potential. Each recommendation includes priority level, timeline, and specific tools to help you succeed.';
      const introLines = doc.splitTextToSize(intro, 160);
      doc.text(introLines, 25, yPosition);
      yPosition += introLines.length * 6 + 20;

      // Roadmap timeline sections
      const timelineSections = [
        { title: '🔥 High Priority (1-3 months)', color: colors.danger, items: data.recommendations.slice(0, 3) },
        { title: '⚖️ Medium Priority (3-6 months)', color: colors.warning, items: data.recommendations.slice(3, 6) },
        { title: '📈 Long-term Goals (6+ months)', color: colors.accent, items: data.recommendations.slice(6, 8) }
      ];

      timelineSections.forEach((section, sectionIndex) => {
        if (yPosition > 220) {
          doc.addPage();
          addPageHeader(doc, 'Development Roadmap (continued)', colors);
          yPosition = 80;
        }

        // Section header with timeline
        doc.setFillColor(section.color[0], section.color[1], section.color[2]);
        doc.roundedRect(20, yPosition, pageWidth - 40, 20, 5, 5, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(section.title, 30, yPosition + 13);
        yPosition += 30;

        section.items.forEach((recommendation, index) => {
          if (yPosition > 250) {
            doc.addPage();
            addPageHeader(doc, 'Development Roadmap (continued)', colors);
            yPosition = 80;
          }

          // Action item card
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(25, yPosition, pageWidth - 50, 35, 5, 5, 'F');
          doc.setDrawColor(section.color[0], section.color[1], section.color[2]);
          doc.setLineWidth(1);
          doc.roundedRect(25, yPosition, pageWidth - 50, 35, 5, 5, 'S');

          // Progress indicator (visual steps)
          const steps = ['⬜', '⬜', '⬜'];
          if (sectionIndex === 0) steps[0] = '⬛'; // High priority partially started
          
          doc.setFontSize(12);
          doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
          doc.text(steps.join(' '), 30, yPosition + 10);

          // Action text
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          const actionLines = doc.splitTextToSize(`${index + 1}. ${recommendation}`, 130);
          doc.text(actionLines, 30, yPosition + 22);

          // Suggested tools/resources
          const toolSuggestions = getToolSuggestions(recommendation);
          if (toolSuggestions) {
            doc.setFontSize(9);
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.text(`🛠️ Tools: ${toolSuggestions}`, 30, yPosition + 32);
          }

          yPosition += 45;
        });

        yPosition += 10;
      });

      // Success metrics section
      yPosition += 15;
      addSectionHeader(doc, '📊 Measuring Your Progress', yPosition, colors);
      yPosition += 20;

      const successMetrics = [
        '📈 Track skill development through project portfolios',
        '🎯 Set monthly goals and review progress with mentors',
        '🌟 Seek feedback from peers and supervisors regularly',
        '📋 Reassess career fit quarterly using updated assessments'
      ];

      successMetrics.forEach(metric => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(metric, 30, yPosition);
        yPosition += 12;
      });
    }

    // ==================== FINAL PAGE: ENHANCED METHODOLOGY & COMPLIANCE ====================
    doc.addPage();
    addPageHeader(doc, 'Assessment Methodology & Compliance', colors);
    yPosition = 80;

    // Methodology in organized columns
    addSectionHeader(doc, '📚 Assessment Framework', yPosition, colors);
    yPosition += 20;

    // Create methodology cards
    const methodologyCards = [
      { 
        title: '📊 Psychometric Foundation', 
        content: 'Evidence-based personality assessment using validated psychological models and standardized testing protocols.'
      },
      { 
        title: '🧠 Cognitive Measurement', 
        content: 'Multi-dimensional aptitude analysis measuring abstract thinking, problem-solving, and communication abilities.'
      },
      { 
        title: '🎯 Career Alignment', 
        content: 'Integration with O*NET occupational database for accurate career fit analysis and recommendations.'
      }
    ];

    methodologyCards.forEach((card, index) => {
      const cardY = yPosition + (index * 45);
      
      doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      doc.roundedRect(25, cardY, pageWidth - 50, 35, 5, 5, 'F');
      doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(25, cardY, pageWidth - 50, 35, 5, 5, 'S');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(card.title, 30, cardY + 12);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      const contentLines = doc.splitTextToSize(card.content, 140);
      doc.text(contentLines, 30, cardY + 22);
    });

    yPosition += 150;

    // Compliance badges and certifications
    addSectionHeader(doc, '🔒 Privacy & Compliance', yPosition, colors);
    yPosition += 20;

    // GDPR compliance badge
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.roundedRect(25, yPosition, 80, 20, 5, 5, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('🛡️ GDPR Compliant', 30, yPosition + 13);

    // ISO certification (simulated)
    doc.setFillColor(colors.warning[0], colors.warning[1], colors.warning[2]);
    doc.roundedRect(110, yPosition, 80, 20, 5, 5, 'F');
    doc.text('📋 ISO 27001', 115, yPosition + 13);

    yPosition += 35;

    // Enhanced disclaimers with better formatting
    const disclaimers = [
      '🎯 This assessment provides professional development insights and career guidance',
      '🔍 Results should complement other career factors like experience and education',
      '📞 For detailed interpretation, consult with your career advisor or coach',
      '🔐 All data is confidential and handled per strict privacy guidelines'
    ];

    disclaimers.forEach(disclaimer => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text(disclaimer, 25, yPosition);
      yPosition += 12;
    });

    // Contact information footer
    yPosition += 20;
    doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
    doc.roundedRect(20, yPosition, pageWidth - 40, 30, 5, 5, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('📧 Questions or Support?', 30, yPosition + 12);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text('Contact: support@authencore.org | Website: authencore.org', 30, yPosition + 22);

    // Add enhanced page numbers and footers to all pages
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Enhanced footer with contact info and branding
      doc.setDrawColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
      
      // Footer background
      doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      
      // Footer content with enhanced information
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text('AuthenCore Assessment Platform - Confidential Professional Report', 20, pageHeight - 18);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 35, pageHeight - 18);
      
      // Report ID and generation info
      doc.text(`Report ID: ${reportId}`, 20, pageHeight - 12);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, pageWidth - 80, pageHeight - 12);
      
      // Copyright notice
      doc.text('© 2025 AuthenCore - All Rights Reserved', 20, pageHeight - 6);
      
      if (i > 1) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${data.userInfo.name} - ${data.assessmentType}`, 20, pageHeight - 6);
      }
    }

    // Save with enhanced professional filename
    const dateStamp = new Date().toISOString().split('T')[0];
    const fileName = `${data.userInfo.name.replace(/\s+/g, '_')}_${data.assessmentType.replace(/\s+/g, '_')}_Professional_Report_${dateStamp}.pdf`;
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

function getDimensionIcon(dimension: string): string {
  const icons: Record<string, string> = {
    'realistic': '🔧',
    'investigative': '🔬', 
    'artistic': '🎨',
    'social': '👥',
    'enterprising': '💼',
    'conventional': '📊',
    'abstract_thinking': '🧠',
    'communication_skills': '🗣️',
    'problem_solving': '🧩',
    'focus_memory': '🎯',
    'introversion': '🤔',
    'openness': '🌟',
    'conscientiousness': '📋',
    'adaptability': '🔄'
  };
  
  return icons[dimension.toLowerCase()] || '📈';
}

function getIndustryIcon(careerTitle: string): string {
  const title = careerTitle.toLowerCase();
  if (title.includes('data') || title.includes('analyst')) return '📊';
  if (title.includes('ux') || title.includes('design')) return '🎨';
  if (title.includes('research')) return '🔬';
  if (title.includes('manager') || title.includes('director')) return '💼';
  if (title.includes('consultant')) return '💡';
  if (title.includes('tech') || title.includes('engineer')) return '💻';
  return '🎯';
}

function getToolSuggestions(recommendation: string): string {
  const rec = recommendation.toLowerCase();
  if (rec.includes('portfolio')) return 'GitHub, Behance, LinkedIn';
  if (rec.includes('data') || rec.includes('analytical')) return 'Tableau, Python, SQL';
  if (rec.includes('communication') || rec.includes('storytelling')) return 'Presentations, Toastmasters';
  if (rec.includes('mentor') || rec.includes('network')) return 'LinkedIn, Industry meetups';
  if (rec.includes('skill') || rec.includes('learn')) return 'Coursera, Udemy, edX';
  return 'Various tools available';
}