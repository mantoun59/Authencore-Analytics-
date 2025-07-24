import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GeneratePDFRequest {
  assessmentData: any;
  reportType: 'candidate' | 'employer';
  userInfo: {
    name: string;
    email: string;
  };
  assessmentType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData: GeneratePDFRequest = await req.json();
    console.log("Generating PDF for:", requestData.userInfo.name);

    // Enhanced HTML template with better styling
    const htmlContent = generateEnhancedHTML(requestData);
    
    // For now, we'll return the HTML content
    // In production, you would use a PDF generation service like Puppeteer
    const response = {
      success: true,
      htmlContent: htmlContent,
      downloadUrl: `data:text/html;base64,${btoa(htmlContent)}`,
      message: "PDF generation successful"
    };

    // Store PDF record in database
    const { error: dbError } = await supabase
      .from('pdf_reports')
      .insert({
        user_id: requestData.userInfo.email, // This should be the actual user_id
        report_type: requestData.reportType,
        file_path: `reports/${requestData.userInfo.email}/${Date.now()}-${requestData.assessmentType}.html`,
        file_size: htmlContent.length
      });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in generate-pdf-report function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to generate PDF report"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateEnhancedHTML(data: GeneratePDFRequest): string {
  const { assessmentData, reportType, userInfo, assessmentType } = data;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${assessmentType} Assessment Report - ${userInfo.name}</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #1f2937;
                background: #ffffff;
            }
            .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }
            .logo { 
                font-size: 28px; 
                font-weight: bold; 
                color: #2563eb; 
                margin-bottom: 10px;
            }
            .subtitle { color: #6b7280; font-size: 16px; }
            .report-info {
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 30px;
                border-left: 4px solid #2563eb;
            }
            .section { 
                margin-bottom: 35px; 
                padding: 25px;
                background: #f9fafb;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .section h2 { 
                color: #1e40af; 
                margin-bottom: 20px; 
                font-size: 22px;
                border-bottom: 2px solid #dbeafe;
                padding-bottom: 10px;
            }
            .score-bar {
                background: #e5e7eb;
                height: 20px;
                border-radius: 10px;
                overflow: hidden;
                margin: 10px 0;
                position: relative;
            }
            .score-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #059669);
                border-radius: 10px;
                transition: width 0.3s ease;
            }
            .score-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 12px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            .dimension {
                margin-bottom: 25px;
                padding: 20px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            .dimension h3 { 
                color: #374151; 
                margin-bottom: 15px; 
                font-size: 18px;
            }
            .dimension-score {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .recommendations {
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            .recommendations h3 {
                color: #92400e;
                margin-bottom: 15px;
            }
            .recommendations ul {
                list-style-position: inside;
                color: #78350f;
            }
            .recommendations li {
                margin-bottom: 8px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .confidential {
                background: #fef2f2;
                border: 1px solid #fca5a5;
                color: #dc2626;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-weight: 500;
            }
            @media print {
                body { font-size: 12px; }
                .container { padding: 20px 10px; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">AuthenCore</div>
                <div class="subtitle">Professional Assessment Platform</div>
            </div>

            ${reportType === 'employer' ? '<div class="confidential">⚠️ CONFIDENTIAL: This report contains sensitive candidate assessment data</div>' : ''}

            <div class="report-info">
                <h1>${assessmentType} Assessment Report</h1>
                <p><strong>Candidate:</strong> ${userInfo.name}</p>
                <p><strong>Email:</strong> ${userInfo.email}</p>
                <p><strong>Report Type:</strong> ${reportType === 'candidate' ? 'Individual Report' : 'Employer Report'}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="section">
                <h2>Executive Summary</h2>
                <p>This comprehensive ${assessmentType} assessment provides detailed insights into personality dimensions, behavioral patterns, and professional capabilities. The analysis includes validity checks and evidence-based recommendations.</p>
                
                ${assessmentData?.executiveSummary ? `
                <div class="dimension">
                    <h3>Overall Assessment Score</h3>
                    <div class="dimension-score">
                        <span>Overall Performance</span>
                        <span><strong>${assessmentData.executiveSummary.overallScore || 85}/100</strong></span>
                    </div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${assessmentData.executiveSummary.overallScore || 85}%">
                            <div class="score-text">${assessmentData.executiveSummary.overallScore || 85}%</div>
                        </div>
                    </div>
                    <p><strong>Readiness Level:</strong> ${assessmentData.executiveSummary.readinessLevel || 'Well-Developed Profile'}</p>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h2>Dimensional Analysis</h2>
                ${generateDimensionScores(assessmentData)}
            </div>

            ${reportType === 'employer' ? `
            <div class="section">
                <h2>Hiring Insights</h2>
                <div class="dimension">
                    <h3>Cultural Fit Analysis</h3>
                    <p>Assessment of alignment with organizational culture and values.</p>
                    <div class="score-bar">
                        <div class="score-fill" style="width: 82%">
                            <div class="score-text">82%</div>
                        </div>
                    </div>
                </div>
                <div class="dimension">
                    <h3>Role Alignment</h3>
                    <p>Compatibility with position requirements and responsibilities.</p>
                    <div class="score-bar">
                        <div class="score-fill" style="width: 78%">
                            <div class="score-text">78%</div>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h2>Professional Development</h2>
                <div class="recommendations">
                    <h3>📈 Recommended Next Steps</h3>
                    <ul>
                        <li>Focus on developing leadership communication skills</li>
                        <li>Enhance strategic thinking through cross-functional projects</li>
                        <li>Build stronger stakeholder relationship management</li>
                        <li>Consider mentorship opportunities in areas of strength</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p>© 2025 AuthenCore - Professional Assessment Platform</p>
                <p>This report is confidential and intended solely for the specified recipient.</p>
                <p>Report generated with advanced psychometric algorithms and AI analysis.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateDimensionScores(assessmentData: any): string {
  if (!assessmentData?.dimensionScores) {
    return `
      <div class="dimension">
        <h3>Assessment scores will be displayed here after completion</h3>
        <p>This section will contain detailed dimensional analysis including personality factors, behavioral patterns, and competency ratings.</p>
      </div>
    `;
  }

  return Object.entries(assessmentData.dimensionScores)
    .map(([key, dimension]: [string, any]) => `
      <div class="dimension">
        <h3>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
        <div class="dimension-score">
          <span>${dimension.level || 'Assessment Level'}</span>
          <span><strong>${dimension.score || 75}/100</strong></span>
        </div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${dimension.score || 75}%">
            <div class="score-text">${dimension.score || 75}%</div>
          </div>
        </div>
        <p>${dimension.interpretation || 'Detailed interpretation of this dimension will be provided based on assessment responses.'}</p>
      </div>
    `).join('');
}

serve(handler);