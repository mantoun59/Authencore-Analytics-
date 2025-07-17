import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  candidateData: {
    name: string
    email: string
    date: string
    position?: string
    company?: string
  }
  scores: Array<{
    name: string
    percentile: number
    level: string
    description: string
  }>
  validity: {
    fakeGoodScore: number
    fakeBadScore: number
    randomResponseScore: number
    inconsistencyScore: number
    responseTimeProfile: string
    overallValidity: string
  }
  actionPlan: string[]
  interviewQuestions: string[]
  reportType: 'candidate' | 'employer'
}

// CareerLaunch specific interface
interface CareerLaunchReportRequest {
  candidateData: {
    name: string;
    email?: string;
    date: string;
  };
  interests: Record<string, number>;
  aptitudes: Array<{ name: string; score: number }>;
  personality: Record<string, number>;
  values: Record<string, number>;
  flags: { misalignment: string[] };
  career_fit: { label: string; suggestions: string[] };
  action_plan: string[];
  reportType: 'careerlaunch-applicant' | 'careerlaunch-advisor';
}

const applicantTemplate = (data: ReportRequest) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CAIR+ Applicant Report</title>
  <style>
    @page { 
      margin: 1in; 
      @top-center {
        content: "CAIR+ Assessment Report";
        font-family: 'Segoe UI', sans-serif;
        font-size: 12px;
        color: #666;
      }
    }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 0; 
      color: #333; 
      line-height: 1.6;
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px; 
      border-bottom: 3px solid #003366;
      padding-bottom: 20px;
    }
    .logo-placeholder {
      width: 200px;
      height: 60px;
      background: linear-gradient(45deg, #003366, #005b96);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      border-radius: 8px;
      font-weight: bold;
    }
    h1 { 
      font-size: 32px; 
      color: #003366; 
      margin: 0;
      font-weight: 300;
    }
    h2 { 
      font-size: 24px; 
      color: #005b96; 
      border-bottom: 2px solid #e0e0e0; 
      padding-bottom: 8px; 
      margin: 30px 0 20px 0;
    }
    .candidate-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .section { 
      margin-bottom: 30px; 
      page-break-inside: avoid;
    }
    .score-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .score-table th { 
      background: #003366;
      color: white;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
    }
    .score-table td { 
      border: 1px solid #e0e0e0; 
      padding: 12px; 
      vertical-align: middle;
    }
    .score-table tr:nth-child(even) {
      background: #f8f9fa;
    }
    .bar-container {
      width: 100px;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
    }
    .bar { 
      height: 100%; 
      background: linear-gradient(90deg, #005b96, #00796b);
      border-radius: 10px;
      transition: width 0.3s ease;
    }
    .level { 
      font-weight: bold; 
      padding: 4px 8px;
      border-radius: 4px;
      color: white;
    }
    .level.high { background: #4caf50; }
    .level.average { background: #ff9800; }
    .level.low { background: #f44336; }
    .insights {
      background: #e3f2fd;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #2196f3;
      margin: 20px 0;
    }
    .strengths {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #4caf50;
      margin: 20px 0;
    }
    .development {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #ff9800;
      margin: 20px 0;
    }
    .action-plan {
      background: #f3e5f5;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #9c27b0;
    }
    .action-item {
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #9c27b0;
    }
    .footer { 
      font-size: 12px; 
      color: #666; 
      text-align: center; 
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
    .confidentiality {
      background: #ffebee;
      border: 1px solid #f44336;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-placeholder">AuthenCore CAIR+</div>
    <h1>Personality Assessment Report</h1>
    <div class="candidate-info">
      <strong>Candidate:</strong> ${data.candidateData.name}<br>
      <strong>Email:</strong> ${data.candidateData.email}<br>
      <strong>Assessment Date:</strong> ${data.candidateData.date}
    </div>
  </div>

  <div class="section">
    <h2>📊 Score Summary</h2>
    <table class="score-table">
      <thead>
        <tr>
          <th>Personality Dimension</th>
          <th>Percentile</th>
          <th>Level</th>
          <th>Visual</th>
        </tr>
      </thead>
      <tbody>
        ${data.scores.map(dim => `
          <tr>
            <td><strong>${dim.name}</strong></td>
            <td>${dim.percentile}%</td>
            <td><span class="level ${dim.level.toLowerCase()}">${dim.level}</span></td>
            <td>
              <div class="bar-container">
                <div class="bar" style="width: ${dim.percentile}%"></div>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>🔍 Personality Insights</h2>
    ${data.scores.map(dim => `
      <div class="insights">
        <h3>${dim.name} (${dim.percentile}th percentile)</h3>
        <p>${dim.description}</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>💪 Your Strengths</h2>
    <div class="strengths">
      ${data.scores
        .filter(s => s.percentile >= 70)
        .slice(0, 2)
        .map(s => `<h4>${s.name}</h4><p>${s.description}</p>`)
        .join('')}
    </div>
  </div>

  <div class="section">
    <h2>🎯 Development Areas</h2>
    <div class="development">
      ${data.scores
        .filter(s => s.percentile < 50)
        .slice(0, 2)
        .map(s => `<h4>${s.name}</h4><p>${s.description}</p>`)
        .join('')}
    </div>
  </div>

  <div class="section">
    <h2>📋 Personalized Action Plan</h2>
    <div class="action-plan">
      ${data.actionPlan.map(item => `
        <div class="action-item">
          <strong>Action:</strong> ${item}
        </div>
      `).join('')}
    </div>
  </div>

  <div class="confidentiality">
    <strong>Confidentiality Notice:</strong> This report contains confidential assessment results. 
    It should only be shared with authorized personnel and used for intended purposes.
    <br><br>
    <strong>Assessment Integrity:</strong> These assessments were developed using open-source psychological 
    frameworks and AI-generated insights. All content was independently developed by AuthenCore Analytics 
    and is not affiliated with existing commercial tools.
  </div>

  <div class="footer">
    <p><strong>AuthenCore Assessment Platform</strong><br>
    Generated on ${data.candidateData.date} | Professional Personality Assessment<br>
    <small>Developed with open-source frameworks, academic research, and AI insights.</small></p>
  </div>
</body>
</html>
`

const employerTemplate = (data: ReportRequest) => `
<!DOCTYPE html>
<html lang="en">
...
</html>
`

// CareerLaunch Applicant Template
const careerLaunchApplicantTemplate = (data: CareerLaunchReportRequest) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CareerLaunch Applicant Report</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; margin: 40px; color: #333; }
    header { text-align: center; margin-bottom: 30px; }
    h1 { font-size: 26px; color: #004080; }
    h2 { font-size: 20px; color: #005b96; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    .bar { height: 16px; background: #005b96; display: inline-block; }
    .highlight { background: #e6f7ff; border-left: 4px solid #3399ff; padding: 10px; margin-bottom: 8px; }
    footer { font-size: 12px; color: #777; text-align: center; margin-top: 40px; }
  </style>
</head>
<body>
  <header>
    <h1>CareerLaunch Report – Applicant Copy</h1>
    <p><strong>Name:</strong> ${data.candidateData.name} | <strong>Date:</strong> ${data.candidateData.date}</p>
  </header>

  <section>
    <h2>Interest Profile (RIASEC)</h2>
    <table>
      <tr><th>Interest Area</th><th>Score</th><th>Bar</th></tr>
      ${Object.entries(data.interests).map(([interest, score]) => `
      <tr>
        <td>${interest.charAt(0).toUpperCase() + interest.slice(1)}</td>
        <td>${score}%</td>
        <td><div class="bar" style="width:${Math.min(score as number, 100)}%"></div></td>
      </tr>
      `).join('')}
    </table>
  </section>

  <section>
    <h2>Aptitude Strengths</h2>
    <ul>
      ${data.aptitudes.slice(0, 3).map((aptitude) => `
      <li><strong>${aptitude.name}</strong>: ${aptitude.score}%</li>
      `).join('')}
    </ul>
  </section>

  <section>
    <h2>Personality Traits</h2>
    <table>
      <tr><th>Trait</th><th>Score</th></tr>
      ${Object.entries(data.personality).map(([trait, value]) => `
      <tr><td>${trait.charAt(0).toUpperCase() + trait.slice(1)}</td><td>${value}%</td></tr>
      `).join('')}
    </table>
  </section>

  <section>
    <h2>Top Values</h2>
    <table>
      <tr><th>Value</th><th>Score</th></tr>
      ${Object.entries(data.values).filter(([_, score]) => (score as number) >= 50).map(([value, score]) => `
      <tr><td>${value.charAt(0).toUpperCase() + value.slice(1)}</td><td>${score}%</td></tr>
      `).join('')}
    </table>
  </section>

  <section>
    <h2>Career Fit Profile</h2>
    <div class="highlight">
      <strong>${data.career_fit.label}</strong><br>
      Best-fit roles: ${data.career_fit.suggestions.join(', ')}
    </div>
  </section>

  ${data.flags.misalignment.length > 0 ? `
  <section>
    <h2>Misalignment Flags</h2>
    ${data.flags.misalignment.map((flag) => `
    <div class="highlight">${flag}</div>
    `).join('')}
  </section>
  ` : ''}

  <section>
    <h2>Personal Action Plan</h2>
    <ul>
      ${data.action_plan.map((tip) => `
      <li>${tip}</li>
      `).join('')}
    </ul>
  </section>

  <footer>
    This report is private and generated by CareerLaunch under AuthenCore Analytics © 2025
  </footer>
</body>
</html>
`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    let htmlContent: string

    // Check if it's a CareerLaunch report or CAIR+ report
    if (requestData.reportType === 'careerlaunch-applicant' || requestData.reportType === 'careerlaunch-advisor') {
      // CareerLaunch report
      const careerLaunchData = requestData as CareerLaunchReportRequest
      
      if (careerLaunchData.reportType === 'careerlaunch-applicant') {
        htmlContent = careerLaunchApplicantTemplate(careerLaunchData)
      } else {
        // TODO: Add advisor template later
        htmlContent = careerLaunchApplicantTemplate(careerLaunchData)
      }
    } else {
      // CAIR+ report
      const cairData = requestData as ReportRequest
      htmlContent = cairData.reportType === 'employer' 
        ? employerTemplate(cairData)
        : applicantTemplate(cairData)
    }

    // Return the HTML content
    return new Response(htmlContent, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html' 
      }
    })

  } catch (error) {
    console.error('Error generating PDF report:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF report' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})