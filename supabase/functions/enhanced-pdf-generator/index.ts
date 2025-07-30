import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssessmentData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    assessmentDate?: string;
    questionsAnswered?: number;
    timeSpent?: string;
    reliabilityScore?: number;
    reportId?: string;
  };
  overallScore?: number;
  dimensions?: Array<{ name: string; score: number; description?: string; level?: string }>;
  strengths?: string[];
  developmentAreas?: string[];
  recommendations?: string[];
  careerMatches?: Array<{ title: string; match: number; description?: string }>;
  riasecResults?: Record<string, number>;
}

const generateHTMLReport = (data: AssessmentData): string => {
  const safeText = (text: any): string => {
    return String(text || 'N/A').replace(/[<>&"']/g, (match) => {
      const escapes: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return escapes[match] || match;
    });
  };

  const riasecTypes = [
    { name: 'Realistic', color: '#008080', description: 'Hands-on, practical, mechanical' },
    { name: 'Investigative', color: '#228B22', description: 'Research, analysis, problem-solving' },
    { name: 'Artistic', color: '#FF9800', description: 'Creative, expressive, innovative' },
    { name: 'Social', color: '#2E8B57', description: 'People-focused, helping, teaching' },
    { name: 'Enterprising', color: '#FFD700', description: 'Leadership, business, persuasion' },
    { name: 'Conventional', color: '#191970', description: 'Organized, detail-oriented, systematic' }
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Career Assessment Report</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: white;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
        }
        
        .header {
            background: linear-gradient(135deg, #008080 0%, #191970 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            position: relative;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .logo-icon {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #008080;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
        }
        
        .report-title {
            font-size: 18px;
            opacity: 0.9;
            margin: 0;
        }
        
        .confidential-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #dc3545;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .user-card {
            background: #f8f9fa;
            border: 2px solid #008080;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .user-card h2 {
            color: #008080;
            margin-bottom: 15px;
            font-size: 20px;
        }
        
        .user-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .detail-icon {
            width: 20px;
            text-align: center;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .metric-card {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .metric-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #008080, #228B22);
        }
        
        .metric-value {
            font-size: 36px;
            font-weight: 700;
            color: #008080;
            margin: 10px 0;
        }
        
        .metric-label {
            font-size: 14px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section-header {
            background: #008080;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
        }
        
        .riasec-chart {
            display: grid;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .riasec-item {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            position: relative;
        }
        
        .riasec-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .riasec-name {
            font-weight: 600;
            font-size: 16px;
        }
        
        .riasec-score {
            font-size: 24px;
            font-weight: 700;
        }
        
        .riasec-description {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .progress-bar {
            height: 12px;
            background: #e9ecef;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 6px;
            transition: width 0.3s ease;
        }
        
        .career-cards {
            display: grid;
            gap: 20px;
        }
        
        .career-card {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 25px;
            position: relative;
        }
        
        .career-rank {
            position: absolute;
            top: -10px;
            left: 20px;
            background: #FFD700;
            color: #1a1a1a;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
        }
        
        .career-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            padding-left: 20px;
        }
        
        .career-match {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .match-bar {
            flex: 1;
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .match-fill {
            height: 100%;
            background: linear-gradient(90deg, #008080, #228B22);
            border-radius: 4px;
        }
        
        .recommendations-list {
            display: grid;
            gap: 20px;
        }
        
        .recommendation-item {
            background: white;
            border-left: 4px solid #008080;
            padding: 20px;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .recommendation-priority {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        
        .priority-high { background: #fee; color: #d63384; }
        .priority-medium { background: #fff3cd; color: #f57c00; }
        .priority-low { background: #d1edff; color: #0969da; }
        
        .methodology-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .methodology-item {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
        }
        
        .methodology-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #008080;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
        }
        
        @media print {
            .container { margin: 0; padding: 15mm; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="confidential-badge">CONFIDENTIAL</div>
            <div class="logo">
                <div class="logo-icon">AC</div>
                <div>
                    <h1 class="company-name">AuthenCore Analytics</h1>
                    <p class="report-title">Career Launch Assessment Report</p>
                </div>
            </div>
        </div>

        <!-- User Information -->
        <div class="user-card">
            <h2>Candidate Profile</h2>
            <div class="user-details">
                <div class="detail-item">
                    <span class="detail-icon">Name:</span>
                    <strong>${safeText(data.userInfo.name)}</strong>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">Email:</span>
                    ${safeText(data.userInfo.email)}
                </div>
                <div class="detail-item">
                    <span class="detail-icon">Date:</span>
                    ${safeText(data.userInfo.assessmentDate || new Date().toLocaleDateString())}
                </div>
                <div class="detail-item">
                    <span class="detail-icon">ID:</span>
                    ${safeText(data.userInfo.reportId || 'N/A')}
                </div>
            </div>
        </div>

        <!-- Key Metrics -->
        ${data.overallScore || data.userInfo.reliabilityScore ? `
        <div class="metrics-grid">
            ${data.overallScore ? `
            <div class="metric-card">
                <div class="metric-label">Overall Score</div>
                <div class="metric-value">${data.overallScore}</div>
                <div style="color: #6c757d; font-size: 12px;">out of 100</div>
            </div>
            ` : ''}
            ${data.userInfo.reliabilityScore ? `
            <div class="metric-card">
                <div class="metric-label">Reliability</div>
                <div class="metric-value">${data.userInfo.reliabilityScore}%</div>
                <div style="color: #6c757d; font-size: 12px;">response quality</div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        <!-- RIASEC Profile -->
        ${data.dimensions ? `
        <div class="section">
            <div class="section-header">RIASEC Interest Profile Analysis</div>
            <div class="riasec-chart">
                ${(Array.isArray(data.dimensions) ? data.dimensions : Object.entries(data.dimensions).map(([key, value]) => ({ name: key.replace(/_/g, ' '), score: value }))).slice(0, 6).map((dim, index) => {
                  const riasecType = riasecTypes[index] || riasecTypes[0];
                  return `
                    <div class="riasec-item">
                        <div class="riasec-header">
                            <div class="riasec-name" style="color: ${riasecType.color}">${safeText(dim.name)}</div>
                            <div class="riasec-score" style="color: ${riasecType.color}">${dim.score}</div>
                        </div>
                        <div class="riasec-description">${riasecType.description}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${dim.score}%; background: ${riasecType.color}"></div>
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Career Matches -->
        ${data.careerMatches?.length ? `
        <div class="section">
            <div class="section-header">Top Career Recommendations</div>
            <div class="career-cards">
                ${data.careerMatches.slice(0, 6).map((match, index) => `
                    <div class="career-card">
                        <div class="career-rank">${index + 1}</div>
                        <div class="career-title">${safeText(match.title)}</div>
                        <div class="career-match">
                            <span>Match:</span>
                            <div class="match-bar">
                                <div class="match-fill" style="width: ${match.match}%"></div>
                            </div>
                            <span><strong>${match.match}%</strong></span>
                        </div>
                        ${match.description ? `<p style="color: #6c757d; font-size: 14px; margin-top: 10px;">${safeText(match.description)}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Recommendations -->
        ${data.recommendations?.length ? `
        <div class="section">
            <div class="section-header">Personal Development Roadmap</div>
            <div class="recommendations-list">
                ${data.recommendations.slice(0, 6).map((rec, index) => {
                  const priorities = ['high', 'medium', 'low'];
                  const priorityLabels = ['Immediate Focus', 'Medium Term', 'Long-term Goal'];
                  const priority = priorities[index % 3];
                  const priorityLabel = priorityLabels[index % 3];
                  return `
                    <div class="recommendation-item">
                        <div class="recommendation-priority priority-${priority}">${priorityLabel}</div>
                        <p>${safeText(rec)}</p>
                    </div>
                  `;
                }).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Methodology -->
        <div class="section">
            <div class="section-header">Assessment Methodology & Validity</div>
            <p style="margin-bottom: 20px; color: #6c757d;">This assessment is based on scientifically validated methodologies:</p>
            <div class="methodology-grid">
                <div class="methodology-item">
                    <div class="methodology-title">Holland RIASEC Theory</div>
                    <p style="font-size: 14px; color: #6c757d;">Six personality types and work environments for career matching</p>
                </div>
                <div class="methodology-item">
                    <div class="methodology-title">O*NET Career Database</div>
                    <p style="font-size: 14px; color: #6c757d;">900+ career profiles with detailed requirements and outcomes</p>
                </div>
                <div class="methodology-item">
                    <div class="methodology-title">Cognitive Aptitude Assessment</div>
                    <p style="font-size: 14px; color: #6c757d;">Validated measures of reasoning and problem-solving abilities</p>
                </div>
                <div class="methodology-item">
                    <div class="methodology-title">Response Quality Validation</div>
                    <p style="font-size: 14px; color: #6c757d;">Statistical analysis ensures reliable and consistent responses</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>AuthenCore Analytics</strong> - Professional Career Assessment Platform</p>
            <p>This report is confidential and intended for professional use only</p>
            <p>Generated on ${new Date().toLocaleDateString()} | www.authencore.com</p>
        </div>
    </div>
</body>
</html>
  `;
};

serve(async (req) => {
  console.log('Enhanced PDF Generator called:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: AssessmentData = await req.json();
    console.log('Generating PDF for user:', data.userInfo?.name);

    // Generate HTML content
    const htmlContent = generateHTMLReport(data);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set content with proper encoding
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Generate PDF with proper options
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    await browser.close();

    console.log('PDF generated successfully, size:', pdfBuffer.length);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.userInfo.name || 'Assessment'}_Report.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'PDF generation failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});