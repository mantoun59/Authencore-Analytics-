import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-PDF-REPORT] ${step}${detailsStr}`);
};

// Helper function to safely extract score values
const getScoreValue = (score: any): number => {
  if (typeof score === 'number') return Math.round(score);
  if (typeof score === 'object' && score !== null) {
    return Math.round(score.value || score.score || score.percentage || 0);
  }
  if (typeof score === 'string') {
    const parsed = parseFloat(score);
    return isNaN(parsed) ? 0 : Math.round(parsed);
  }
  return 0;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { assessmentType, results, userData } = await req.json();
    logStep("Request data received", { 
      assessmentType, 
      hasResults: !!results, 
      hasUserData: !!userData,
      resultsType: typeof results,
      userDataType: typeof userData
    });

    // Generate comprehensive professional report based on assessment type
    let reportHtml = '';

    switch (assessmentType) {
      case 'communication_styles':
        reportHtml = generateCommunicationReport(results, userData);
        break;
      case 'career_launch':
        reportHtml = generateCareerLaunchReport(results, userData);
        break;
      case 'cair_plus':
      case 'cair_personality':
        reportHtml = generateCAIRReport(results, userData);
        break;
      case 'emotional_intelligence':
        reportHtml = generateEQReport(results, userData);
        break;
      case 'cultural_intelligence':
        reportHtml = generateCulturalReport(results, userData);
        break;
      case 'stress_resilience':
        reportHtml = generateStressReport(results, userData);
        break;
      case 'leadership_assessment':
        reportHtml = generateLeadershipReport(results, userData);
        break;
      case 'faith_values':
        reportHtml = generateFaithValuesReport(results, userData);
        break;
      case 'genz_workplace':
        reportHtml = generateGenZReport(results, userData);
        break;
      case 'digital_wellness':
        reportHtml = generateDigitalWellnessReport(results, userData);
        break;
      default:
        throw new Error(`Unknown assessment type: ${assessmentType}`);
    }

    logStep("Report generated successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      reportHtml,
      message: "PDF report generated successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR in generate-pdf-report", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Professional Report Template Functions
function generateCommunicationReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  const profile = results?.profile || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Communication Styles Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Communication Styles Assessment", userData)}
            
            <div class="section">
                <h2>Communication Profile Overview</h2>
                <p>Your communication style reflects how you naturally express ideas, listen to others, and engage in conversations.</p>
                
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Development Recommendations</h2>
                <ul>
                    <li>Practice active listening techniques to improve comprehension</li>
                    <li>Adapt your communication style to match your audience</li>
                    <li>Seek feedback on your communication effectiveness</li>
                    <li>Develop both verbal and non-verbal communication skills</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateCareerLaunchReport(results: any, userData: any): string {
  const interests = results?.interests || {};
  const aptitudes = results?.aptitudes || {};
  const recommendations = results?.recommendations || [];
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CareerLaunch Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("CareerLaunch Assessment", userData)}
            
            <div class="section">
                <h2>Interest Profile (RIASEC)</h2>
                <div class="score-grid">
                    ${Object.entries(interests).map(([type, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${type}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Career Recommendations</h2>
                <div class="recommendations">
                    ${recommendations.slice(0, 5).map((career: any) => `
                        <div class="recommendation-item">
                            <h3>${career.title || 'Career Option'}</h3>
                            <p><strong>Match Score:</strong> ${getScoreValue(career.score)}%</p>
                            <p>${career.description || 'No description available'}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Next Steps</h2>
                <ul>
                    <li>Research your top career recommendations in detail</li>
                    <li>Connect with professionals in your fields of interest</li>
                    <li>Explore relevant educational pathways</li>
                    <li>Consider internships or job shadowing opportunities</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateCAIRReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CAIR+ Personality Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("CAIR+ Personality Assessment", userData)}
            
            <div class="section">
                <h2>Personality Dimensions</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Workplace Applications</h2>
                <p>Your personality profile suggests you excel in roles that require strong interpersonal skills and strategic thinking.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateEQReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Emotional Intelligence Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Emotional Intelligence Assessment", userData)}
            
            <div class="section">
                <h2>Emotional Intelligence Dimensions</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateCulturalReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cultural Intelligence Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Cultural Intelligence Assessment", userData)}
            
            <div class="section">
                <h2>Cultural Intelligence Dimensions</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateStressReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stress Resilience Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Stress Resilience Assessment", userData)}
            
            <div class="section">
                <h2>Stress Resilience Profile</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateLeadershipReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leadership Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Leadership Assessment", userData)}
            
            <div class="section">
                <h2>Leadership Dimensions</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateFaithValuesReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Faith & Values Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Faith & Values Assessment", userData)}
            
            <div class="section">
                <h2>Faith & Values Profile</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateGenZReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gen Z Workplace Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Gen Z Workplace Assessment", userData)}
            
            <div class="section">
                <h2>Workplace Preferences</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateDigitalWellnessReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Digital Wellness Assessment Report</title>
        ${getReportStyles()}
    </head>
    <body>
        <div class="container">
            ${generateReportHeader("Digital Wellness Assessment", userData)}
            
            <div class="section">
                <h2>Digital Wellness Profile</h2>
                <div class="score-grid">
                    ${Object.entries(scores).map(([dimension, score]: [string, any]) => {
                        const displayScore = getScoreValue(score);
                        return `
                        <div class="score-card">
                            <h3>${formatDimensionName(dimension)}</h3>
                            <div class="score-value">${displayScore}%</div>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${displayScore}%"></div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getReportStyles(): string {
  return `
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #ffffff;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            background: #ffffff;
        }
        .logo { 
            font-size: 28px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px;
            background: #ffffff;
            padding: 10px;
        }
        .subtitle { color: #6b7280; font-size: 16px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2563eb; margin-bottom: 15px; font-size: 24px; }
        .score-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
        }
        .score-card { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 8px; 
            padding: 20px; 
            text-align: center; 
        }
        .score-card h3 { color: #2563eb; margin-bottom: 10px; }
        .score-value { 
            font-size: 32px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px; 
        }
        .score-bar { 
            width: 100%; 
            height: 8px; 
            background: #e2e8f0; 
            border-radius: 4px; 
            overflow: hidden; 
        }
        .score-fill { 
            height: 100%; 
            background: linear-gradient(90deg, #3b82f6, #2563eb); 
            transition: width 0.3s ease; 
        }
        .recommendations { margin: 20px 0; }
        .recommendation-item { 
            background: #f8fafc; 
            border-left: 4px solid #2563eb; 
            padding: 15px; 
            margin-bottom: 15px; 
        }
        .recommendation-item h3 { color: #2563eb; margin-bottom: 8px; }
        ul { margin-left: 20px; }
        li { margin-bottom: 8px; }
        @media print {
            body { font-size: 12px; }
            .container { padding: 20px 10px; }
            .section { page-break-inside: avoid; }
        }
    </style>
  `;
}

function generateReportHeader(title: string, userData: any): string {
  // Extract assessment type from title for logo
  const assessmentType = title.toLowerCase().replace(/[\s+]/g, '-').replace(/assessment/, '').trim();
  
  // AUDIT FIX: Verify and construct absolute logo URL
  const logoUrl = `https://jlbftyjewxgetxcihban.supabase.co/storage/v1/object/public/assessment-logos/${assessmentType}-logo.png`;
  console.log(`🖼️ Using logo URL for "${assessmentType}":`, logoUrl);
  
  // AUDIT FIX: Pre-validate image accessibility 
  const logoImageTag = `
    <img src="${logoUrl}" 
         alt="${title} Logo" 
         style="max-height: 80px; max-width: 120px; object-fit: contain;" 
         onerror="console.log('❌ Logo failed to load: ${logoUrl}'); this.style.display='none'"
         onload="console.log('✅ Logo loaded successfully: ${logoUrl}')">
  `;
  
  return `
    <div class="header">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; background: #ffffff; padding: 10px;">
            <div>
                <div class="logo">AuthenCore</div>
                <div class="subtitle">Professional Assessment Platform</div>
            </div>
            <div style="text-align: right;">
                ${logoImageTag}
            </div>
        </div>
        <h1 style="text-align: center; margin: 20px 0;">${title}</h1>
        <div style="text-align: center; margin-bottom: 20px;">
            <p><strong>Candidate:</strong> ${userData?.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${userData?.email || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
  `;
}

function formatDimensionName(name: string): string {
  return name.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}