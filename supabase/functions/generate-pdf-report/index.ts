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
<head>
  <meta charset="UTF-8">
  <title>CAIR+ Employer Report</title>
  <style>
    @page { 
      margin: 1in;
      @top-center {
        content: "CONFIDENTIAL EMPLOYER REPORT";
        font-family: 'Segoe UI', sans-serif;
        font-size: 12px;
        color: #d32f2f;
        font-weight: bold;
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
      border-bottom: 3px solid #d32f2f;
      padding-bottom: 20px;
    }
    .logo-placeholder {
      width: 200px;
      height: 60px;
      background: linear-gradient(45deg, #d32f2f, #f44336);
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
      color: #d32f2f; 
      margin: 0;
      font-weight: 300;
    }
    h2 { 
      font-size: 24px; 
      color: #333; 
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
    .confidential-banner {
      background: #d32f2f;
      color: white;
      padding: 15px;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 30px;
    }
    .section { 
      margin-bottom: 30px; 
      page-break-inside: avoid;
    }
    .score-table, .validity-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .score-table th, .validity-table th { 
      background: #d32f2f;
      color: white;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
    }
    .score-table td, .validity-table td { 
      border: 1px solid #e0e0e0; 
      padding: 12px; 
      vertical-align: middle;
    }
    .score-table tr:nth-child(even), .validity-table tr:nth-child(even) {
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
      background: linear-gradient(90deg, #1976d2, #2196f3);
      border-radius: 10px;
    }
    .risk-high { color: #d32f2f; font-weight: bold; }
    .risk-medium { color: #ff9800; font-weight: bold; }
    .risk-low { color: #4caf50; font-weight: bold; }
    .validity-summary {
      background: #fff3e0;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #ff9800;
      margin: 20px 0;
    }
    .recommendation {
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    .recommendation.proceed {
      background: #e8f5e8;
      border: 2px solid #4caf50;
      color: #2e7d32;
    }
    .recommendation.caution {
      background: #fff3e0;
      border: 2px solid #ff9800;
      color: #f57c00;
    }
    .recommendation.warning {
      background: #ffebee;
      border: 2px solid #f44336;
      color: #d32f2f;
    }
    .interview-questions {
      background: #e3f2fd;
      padding: 20px;
      border-radius: 8px;
      border-left: 5px solid #2196f3;
    }
    .question {
      margin: 15px 0;
      padding: 12px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #2196f3;
    }
    .footer { 
      font-size: 12px; 
      color: #666; 
      text-align: center; 
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="confidential-banner">
    🔒 CONFIDENTIAL EMPLOYER REPORT - AUTHORIZED PERSONNEL ONLY
  </div>

  <div class="header">
    <div class="logo-placeholder">AuthenCore CAIR+</div>
    <h1>Employer Assessment Report</h1>
    <div class="candidate-info">
      <strong>Candidate:</strong> ${data.candidateData.name}<br>
      <strong>Position:</strong> ${data.candidateData.position || 'Not specified'}<br>
      <strong>Assessment Date:</strong> ${data.candidateData.date}
    </div>
  </div>

  <div class="section">
    <h2>📊 Personality Profile Summary</h2>
    <table class="score-table">
      <thead>
        <tr>
          <th>Dimension</th>
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
            <td>${dim.level}</td>
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
    <h2>🛡️ Validity & Distortion Analysis</h2>
    <div class="validity-summary">
      <strong>Overall Validity Status:</strong> 
      <span class="${data.validity.overallValidity === 'Valid' ? 'risk-low' : 
                     data.validity.overallValidity === 'Questionable' ? 'risk-medium' : 'risk-high'}">
        ${data.validity.overallValidity}
      </span>
    </div>
    
    <table class="validity-table">
      <thead>
        <tr>
          <th>Validity Metric</th>
          <th>Score</th>
          <th>Risk Level</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Fake Good (Social Desirability)</td>
          <td>${data.validity.fakeGoodScore}</td>
          <td class="${data.validity.fakeGoodScore > 3 ? 'risk-high' : data.validity.fakeGoodScore > 1 ? 'risk-medium' : 'risk-low'}">
            ${data.validity.fakeGoodScore > 3 ? 'High Risk' : data.validity.fakeGoodScore > 1 ? 'Medium Risk' : 'Low Risk'}
          </td>
        </tr>
        <tr>
          <td>Fake Bad (Negative Impression)</td>
          <td>${data.validity.fakeBadScore}</td>
          <td class="${data.validity.fakeBadScore > 2 ? 'risk-high' : data.validity.fakeBadScore > 0 ? 'risk-medium' : 'risk-low'}">
            ${data.validity.fakeBadScore > 2 ? 'High Risk' : data.validity.fakeBadScore > 0 ? 'Medium Risk' : 'Low Risk'}
          </td>
        </tr>
        <tr>
          <td>Random Response Pattern</td>
          <td>${data.validity.randomResponseScore}</td>
          <td class="${data.validity.randomResponseScore > 2 ? 'risk-high' : data.validity.randomResponseScore > 0 ? 'risk-medium' : 'risk-low'}">
            ${data.validity.randomResponseScore > 2 ? 'High Risk' : data.validity.randomResponseScore > 0 ? 'Medium Risk' : 'Low Risk'}
          </td>
        </tr>
        <tr>
          <td>Response Inconsistency</td>
          <td>${data.validity.inconsistencyScore}</td>
          <td class="${data.validity.inconsistencyScore > 2 ? 'risk-high' : data.validity.inconsistencyScore > 0 ? 'risk-medium' : 'risk-low'}">
            ${data.validity.inconsistencyScore > 2 ? 'High Risk' : data.validity.inconsistencyScore > 0 ? 'Medium Risk' : 'Low Risk'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>💼 Interview Recommendations</h2>
    <div class="interview-questions">
      <p><strong>Suggested Interview Questions Based on Assessment Results:</strong></p>
      ${data.interviewQuestions.map((question, index) => `
        <div class="question">
          <strong>Q${index + 1}:</strong> ${question}
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>⚖️ Final Hiring Recommendation</h2>
    <div class="recommendation ${
      data.validity.overallValidity === 'Valid' && data.scores.some(s => s.percentile >= 70) ? 'proceed' :
      data.validity.overallValidity === 'Questionable' ? 'caution' : 'warning'
    }">
      ${data.validity.overallValidity === 'Valid' && data.scores.some(s => s.percentile >= 70) 
        ? '✅ PROCEED WITH CONFIDENCE' :
        data.validity.overallValidity === 'Questionable' 
        ? '⚠️ PROCEED WITH CAUTION - Additional Verification Recommended' : 
        '🚫 EXERCISE EXTREME CAUTION - Consider Alternative Candidates'
      }
    </div>
  </div>

  <div class="footer">
    <p><strong>AuthenCore Assessment Platform - Confidential Employer Report</strong><br>
    Generated on ${data.candidateData.date} | For Authorized HR Personnel Only<br>
    <small>Assessment Integrity: These tools were developed using open-source frameworks, academic research, 
    and AI insights. All content independently developed by AuthenCore Analytics.</small></p>
  </div>
</body>
</html>
`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { candidateData, scores, validity, actionPlan, interviewQuestions, reportType }: ReportRequest = await req.json()

    // Select template based on report type
    const htmlContent = reportType === 'employer' 
      ? employerTemplate({ candidateData, scores, validity, actionPlan, interviewQuestions, reportType })
      : applicantTemplate({ candidateData, scores, validity, actionPlan, interviewQuestions, reportType })

    // For now, return the HTML content
    // In production, you would use Puppeteer or similar to convert to PDF
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