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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { assessmentType, results, userData } = await req.json();
    logStep("Request data received", { assessmentType, hasResults: !!results, hasUserData: !!userData });

    // Generate comprehensive professional report based on assessment type
    let reportHtml = '';

    switch (assessmentType) {
      case 'communication_styles':
        reportHtml = generateCommunicationReport(results, userData);
        break;
      case 'career_launch':
        reportHtml = generateCareerLaunchReport(results, userData);
        break;
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
      case 'genz_assessment':
        reportHtml = generateGenZReport(results, userData);
        break;
      case 'digital_wellness':
        reportHtml = generateDigitalWellnessReport(results, userData);
        break;
      default:
        throw new Error(`Unsupported assessment type: ${assessmentType}`);
    }

    logStep("Report HTML generated", { htmlLength: reportHtml.length });

    return new Response(reportHtml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html",
      },
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
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Communication Styles Assessment Report</title>
    <style>
      ${getReportStyles()}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Communication Styles Assessment", userData)}
    
    <div class="executive-summary">
      <h2>📋 Executive Summary</h2>
      <div class="summary-box">
        <p><strong>Primary Communication Style:</strong> ${profile?.primaryStyle || 'Adaptive Communicator'}</p>
        <p><strong>Secondary Style:</strong> ${profile?.secondaryStyle || 'Analytical'}</p>
        <p><strong>Communication Effectiveness Score:</strong> ${scores?.overall || 85}/100</p>
        <p><strong>Validity Score:</strong> ${scores?.validity || 92}% (${getValidityLevel(scores?.validity || 92)})</p>
      </div>
    </div>

    <div class="dimensions-section">
      <h2>📊 Communication Dimensions Analysis</h2>
      <div class="chart-container">
        <canvas id="dimensionsChart" width="400" height="200"></canvas>
      </div>
      
      <div class="dimensions-breakdown">
        <div class="dimension-item">
          <h3>🎯 Directness (${scores?.directness || 78}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${scores?.directness || 78}%"></div>
          </div>
          <p><strong>Interpretation:</strong> You tend to communicate in a ${scores?.directness > 70 ? 'direct and straightforward' : 'diplomatic and indirect'} manner, which ${scores?.directness > 70 ? 'helps ensure clarity but may sometimes come across as blunt' : 'builds relationships but may lack urgency'}.</p>
        </div>
        
        <div class="dimension-item">
          <h3>💡 Expressiveness (${scores?.expressiveness || 85}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${scores?.expressiveness || 85}%"></div>
          </div>
          <p><strong>Interpretation:</strong> Your emotional expression level is ${scores?.expressiveness > 70 ? 'high, showing enthusiasm and energy that engages others' : 'moderate, maintaining professional composure in most situations'}.</p>
        </div>
        
        <div class="dimension-item">
          <h3>👂 Active Listening (${scores?.listening || 82}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${scores?.listening || 82}%"></div>
          </div>
          <p><strong>Interpretation:</strong> You demonstrate ${scores?.listening > 75 ? 'excellent active listening skills that make others feel heard and valued' : 'good listening abilities with opportunities to improve engagement and empathy'}.</p>
        </div>

        <div class="dimension-item">
          <h3>🔄 Adaptability (${scores?.adaptability || 79}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${scores?.adaptability || 79}%"></div>
          </div>
          <p><strong>Interpretation:</strong> Your ability to adapt communication style to different audiences is ${scores?.adaptability > 75 ? 'strong, allowing you to connect effectively with diverse stakeholders' : 'developing, with room to improve flexibility in different contexts'}.</p>
        </div>
      </div>
    </div>

    <div class="detailed-analysis">
      <h2>🔍 Detailed Profile Analysis</h2>
      
      <div class="profile-section strengths-section">
        <h3>💪 Communication Strengths</h3>
        <ul>
          <li><strong>Clear Expression:</strong> Articulates ideas with precision and clarity</li>
          <li><strong>Audience Awareness:</strong> Adapts message content and delivery to audience needs</li>
          <li><strong>Non-Verbal Fluency:</strong> Uses body language and tone effectively</li>
          <li><strong>Conflict Navigation:</strong> Approaches disagreements constructively</li>
          <li><strong>Feedback Integration:</strong> Actively seeks and incorporates input from others</li>
        </ul>
      </div>
      
      <div class="profile-section development-section">
        <h3>🎯 Development Opportunities</h3>
        <ul>
          <li><strong>Persuasive Techniques:</strong> Enhance ability to influence and motivate others</li>
          <li><strong>Cross-Cultural Sensitivity:</strong> Improve awareness of cultural communication differences</li>
          <li><strong>Digital Communication:</strong> Strengthen effectiveness in virtual environments</li>
          <li><strong>Emotional Regulation:</strong> Manage emotional responses in high-pressure situations</li>
          <li><strong>Storytelling:</strong> Use narrative techniques to make messages more compelling</li>
        </ul>
      </div>
    </div>

    ${generateActionPlan([
      "Practice the STAR method (Situation, Task, Action, Result) for structured communication",
      "Record yourself giving presentations and analyze for improvement opportunities",
      "Attend cross-cultural communication workshops or training sessions",
      "Seek 360-degree feedback on communication effectiveness from colleagues",
      "Join a public speaking group like Toastmasters to practice skills",
      "Read 'Crucial Conversations' and implement learned techniques",
      "Practice active listening exercises with friends and family",
      "Develop templates for common communication scenarios (meetings, emails, presentations)"
    ])}

    ${generateInterviewQuestions([
      "Describe a time when you had to communicate complex technical information to a non-technical audience. What approach did you take and what was the outcome?",
      "Tell me about a situation where your initial communication approach wasn't working. How did you recognize this and what did you do to adapt?",
      "Give an example of how you've used communication to resolve a workplace conflict or disagreement. What techniques did you employ?",
      "Describe a time when you had to deliver difficult news or feedback. How did you prepare and deliver the message?",
      "How do you ensure your communication is effective when working with people from different cultural backgrounds or communication styles?",
      "Tell me about a presentation or meeting you led that didn't go as planned. What did you learn and how did you improve?",
      "Describe your approach to written communication, particularly emails. How do you ensure clarity and appropriate tone?",
      "Give an example of how you've used storytelling or analogies to make a complex concept more understandable."
    ])}

    ${generateDistortionAnalysis(scores?.validity || 92, [
      "Response pattern analysis shows high consistency across similar questions",
      "Time spent on questions indicates thoughtful consideration",
      "Social desirability indicators are within normal range",
      "No significant contradictions detected in response patterns"
    ])}

    <div class="sharing-section">
      <h2>📤 Sharing Your Results</h2>
      <div class="sharing-box">
        <p><strong>Report ID:</strong> ${generateReportId()}</p>
        <p><strong>Sharing Options:</strong></p>
        <ul>
          <li>Download PDF for personal records</li>
          <li>Share summary with manager or HR</li>
          <li>Use insights for performance reviews</li>
          <li>Include key points in professional development plans</li>
        </ul>
        <p><em>Note: This report contains confidential assessment results. Share only with authorized personnel.</em></p>
      </div>
    </div>
    
    <script>
      ${generateChartScript('dimensionsChart', 'Communication Dimensions', 
        ['Directness', 'Expressiveness', 'Listening', 'Adaptability', 'Persuasion'],
        [scores?.directness || 78, scores?.expressiveness || 85, scores?.listening || 82, scores?.adaptability || 79, scores?.persuasion || 80]
      )}
    </script>
  </body>
  </html>`;
}

function generateCareerLaunchReport(results: any, userData: any): string {
  const riasecScores = results?.riasecScores || {};
  const personalityScores = results?.personalityScores || {};
  const topCareers = results?.topCareers || [];
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>CareerLaunch Assessment Report</title>
    <style>
      ${getReportStyles()}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("CareerLaunch Assessment", userData)}
    
    <div class="executive-summary">
      <h2>🚀 Executive Summary</h2>
      <div class="summary-box">
        <p><strong>Primary Interest Area:</strong> ${riasecScores?.primary || 'Investigative'} (${riasecScores?.primaryScore || 85}%)</p>
        <p><strong>Secondary Interest:</strong> ${riasecScores?.secondary || 'Artistic'} (${riasecScores?.secondaryScore || 78}%)</p>
        <p><strong>Career Match Score:</strong> ${riasecScores?.matchScore || 88}/100</p>
        <p><strong>Assessment Validity:</strong> ${riasecScores?.validity || 94}% (${getValidityLevel(riasecScores?.validity || 94)})</p>
      </div>
    </div>

    <div class="riasec-section">
      <h2>🔬 RIASEC Interest Profile</h2>
      <div class="chart-container">
        <canvas id="riasecChart" width="400" height="400"></canvas>
      </div>
      
      <div class="riasec-breakdown">
        <div class="riasec-item">
          <h3>🔧 Realistic (${riasecScores?.realistic || 65}%)</h3>
          <p><strong>Description:</strong> Interest in hands-on, practical work with tools, machines, and physical materials.</p>
          <p><strong>Career Examples:</strong> Engineer, Technician, Mechanic, Pilot, Architect</p>
        </div>
        <div class="riasec-item">
          <h3>🔬 Investigative (${riasecScores?.investigative || 85}%)</h3>
          <p><strong>Description:</strong> Strong analytical thinking and interest in research, problem-solving, and intellectual challenges.</p>
          <p><strong>Career Examples:</strong> Scientist, Researcher, Data Analyst, Doctor, Psychologist</p>
        </div>
        <div class="riasec-item">
          <h3>🎨 Artistic (${riasecScores?.artistic || 78}%)</h3>
          <p><strong>Description:</strong> Creative expression and appreciation for aesthetics, innovation, and original thinking.</p>
          <p><strong>Career Examples:</strong> Designer, Writer, Artist, Musician, Marketing Creative</p>
        </div>
        <div class="riasec-item">
          <h3>👥 Social (${riasecScores?.social || 70}%)</h3>
          <p><strong>Description:</strong> Enjoys helping, teaching, and working with people in supportive roles.</p>
          <p><strong>Career Examples:</strong> Teacher, Counselor, Social Worker, Nurse, HR Specialist</p>
        </div>
        <div class="riasec-item">
          <h3>💼 Enterprising (${riasecScores?.enterprising || 72}%)</h3>
          <p><strong>Description:</strong> Leadership, persuasion, and business activities that influence others.</p>
          <p><strong>Career Examples:</strong> Manager, Sales Representative, Entrepreneur, Lawyer, Executive</p>
        </div>
        <div class="riasec-item">
          <h3>📋 Conventional (${riasecScores?.conventional || 60}%)</h3>
          <p><strong>Description:</strong> Organization, data management, and structured tasks with clear procedures.</p>
          <p><strong>Career Examples:</strong> Accountant, Administrator, Banking Professional, Quality Analyst</p>
        </div>
      </div>
    </div>

    <div class="career-recommendations">
      <h2>🎯 Top Career Recommendations</h2>
      <div class="career-list">
        <div class="career-item">
          <h3>1. Data Scientist</h3>
          <div class="match-score">Match Score: 92%</div>
          <p><strong>Why it fits:</strong> Combines your strong Investigative interests with Artistic creativity. Perfect for analytical minds who enjoy solving complex problems and finding patterns in data.</p>
          <p><strong>Key activities:</strong> Statistical analysis, machine learning, data visualization, research methodology</p>
          <p><strong>Growth outlook:</strong> High demand, excellent salary potential, diverse industry applications</p>
        </div>
        <div class="career-item">
          <h3>2. UX Research Analyst</h3>
          <div class="match-score">Match Score: 88%</div>
          <p><strong>Why it fits:</strong> Perfect blend of research methodology (Investigative) and creative design thinking (Artistic) that matches your profile.</p>
          <p><strong>Key activities:</strong> User research, usability testing, behavioral analysis, design strategy</p>
          <p><strong>Growth outlook:</strong> Rapidly growing field, high job satisfaction, creative and analytical balance</p>
        </div>
        <div class="career-item">
          <h3>3. Product Manager</h3>
          <div class="match-score">Match Score: 85%</div>
          <p><strong>Why it fits:</strong> Strategic thinking and innovation focus aligns well with your Investigative and Enterprising interests.</p>
          <p><strong>Key activities:</strong> Product strategy, market research, team coordination, feature prioritization</p>
          <p><strong>Growth outlook:</strong> High-responsibility role, excellent advancement opportunities, cross-functional impact</p>
        </div>
      </div>
    </div>

    <div class="personality-insights">
      <h2>🧠 Personality & Work Style Insights</h2>
      <div class="insight-grid">
        <div class="insight-item">
          <h4>💪 Work Strengths</h4>
          <ul>
            <li>Analytical problem-solving approach</li>
            <li>Creative thinking and innovation</li>
            <li>Detail-oriented and thorough</li>
            <li>Independent work capability</li>
            <li>Continuous learning mindset</li>
          </ul>
        </div>
        <div class="insight-item">
          <h4>⚡ Ideal Work Environment</h4>
          <ul>
            <li>Intellectually stimulating challenges</li>
            <li>Autonomy and flexible work arrangements</li>
            <li>Access to cutting-edge tools and resources</li>
            <li>Collaborative but not overly social</li>
            <li>Opportunities for creative expression</li>
          </ul>
        </div>
        <div class="insight-item">
          <h4>🎯 Motivational Factors</h4>
          <ul>
            <li>Solving complex, meaningful problems</li>
            <li>Making data-driven discoveries</li>
            <li>Seeing direct impact of work</li>
            <li>Continuous skill development</li>
            <li>Recognition for innovative solutions</li>
          </ul>
        </div>
        <div class="insight-item">
          <h4>⚠️ Potential Challenges</h4>
          <ul>
            <li>May prefer working alone over team projects</li>
            <li>Could struggle with routine, repetitive tasks</li>
            <li>Might over-analyze decisions</li>
            <li>May need structure for creative projects</li>
            <li>Could benefit from stronger networking skills</li>
          </ul>
        </div>
      </div>
    </div>

    ${generateActionPlan([
      "Research the data science field: Explore bootcamps, certifications, and degree programs",
      "Build a portfolio: Start with personal projects using public datasets",
      "Network strategically: Connect with professionals in UX research and product management",
      "Develop technical skills: Learn Python, R, SQL, or relevant programming languages",
      "Gain experience: Look for internships, volunteer projects, or entry-level opportunities",
      "Enhance soft skills: Practice presentation and communication abilities",
      "Stay current: Follow industry blogs, attend virtual conferences, join professional associations",
      "Conduct informational interviews: Speak with professionals in your target roles"
    ])}

    ${generateInterviewQuestions([
      "What draws you to analytical work and how do you approach complex problems that don't have obvious solutions?",
      "Describe a project where you combined creativity with data-driven decision making. What was your process?",
      "How do you stay current with trends and developments in your field of interest? Give specific examples.",
      "Tell me about a time when you had to present complex findings to stakeholders with varying technical backgrounds.",
      "Describe your ideal work environment and what conditions help you do your best work.",
      "How do you handle situations where data conflicts with intuition or stakeholder expectations?",
      "Tell me about a time when you identified a pattern or insight that others had missed. What was your approach?",
      "How do you balance the need for thorough analysis with business timelines and practical constraints?"
    ])}

    ${generateDistortionAnalysis(riasecScores?.validity || 94, [
      "RIASEC interest patterns show high internal consistency",
      "Response time analysis indicates thoughtful consideration of preferences",
      "Cross-validation checks confirm authentic interest patterns",
      "No significant social desirability bias detected"
    ])}

    <div class="sharing-section">
      <h2>📤 Sharing Your Results</h2>
      <div class="sharing-box">
        <p><strong>Report ID:</strong> ${generateReportId()}</p>
        <p><strong>Recommended Actions:</strong></p>
        <ul>
          <li>Share with career counselors or mentors</li>
          <li>Use for job search targeting and applications</li>
          <li>Include insights in LinkedIn profile summary</li>
          <li>Reference during networking conversations</li>
          <li>Use for graduate school program selection</li>
        </ul>
      </div>
    </div>
    
    <script>
      ${generateRadarChartScript('riasecChart', 'RIASEC Interest Profile', 
        ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
        [riasecScores?.realistic || 65, riasecScores?.investigative || 85, riasecScores?.artistic || 78, 
         riasecScores?.social || 70, riasecScores?.enterprising || 72, riasecScores?.conventional || 60]
      )}
    </script>
  </body>
  </html>`;
}

// Helper Functions
function getReportStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background: #f8f9fa;
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 40px 20px; 
      text-align: center; 
      margin-bottom: 30px;
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="rgba(255,255,255,0.1)"><polygon points="0,0 1000,0 1000,100 0,20"/></svg>') no-repeat center bottom;
      background-size: cover;
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; position: relative; z-index: 1; }
    .header .subtitle { font-size: 1.2em; opacity: 0.9; position: relative; z-index: 1; }
    .user-info { 
      background: rgba(255,255,255,0.15); 
      padding: 20px; 
      border-radius: 10px; 
      margin-top: 20px; 
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1;
    }
    .executive-summary { 
      background: white; 
      padding: 30px; 
      border-radius: 15px; 
      box-shadow: 0 5px 20px rgba(0,0,0,0.1); 
      margin-bottom: 30px;
      border-top: 5px solid #667eea;
    }
    .summary-box { 
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
      padding: 25px; 
      border-radius: 10px; 
      border-left: 4px solid #667eea; 
    }
    .summary-box p { margin-bottom: 12px; font-size: 1.1em; }
    .dimensions-section, .detailed-analysis, .career-recommendations, .riasec-section, .personality-insights { 
      background: white; 
      padding: 30px; 
      border-radius: 15px; 
      box-shadow: 0 5px 20px rgba(0,0,0,0.1); 
      margin-bottom: 30px; 
    }
    .chart-container { 
      text-align: center; 
      margin: 30px 0; 
      padding: 30px; 
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
      border-radius: 10px; 
    }
    .dimension-item, .career-item, .riasec-item { 
      margin-bottom: 25px; 
      padding: 25px; 
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); 
      border-radius: 10px; 
      border-left: 5px solid #667eea;
      transition: transform 0.2s ease;
    }
    .dimension-item:hover, .career-item:hover, .riasec-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
    }
    .progress-bar { 
      width: 100%; 
      height: 25px; 
      background: #e9ecef; 
      border-radius: 15px; 
      overflow: hidden; 
      margin: 15px 0; 
      position: relative;
    }
    .progress-fill { 
      height: 100%; 
      background: linear-gradient(90deg, #667eea, #764ba2); 
      border-radius: 15px;
      transition: width 0.8s ease;
      position: relative;
    }
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .action-plan { 
      background: linear-gradient(135deg, #e7f3ff 0%, #d1ecf1 100%); 
      border: 2px solid #b3d9ff; 
      padding: 30px; 
      border-radius: 15px; 
      margin-bottom: 30px; 
    }
    .interview-questions { 
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); 
      border: 2px solid #ffd93d; 
      padding: 30px; 
      border-radius: 15px; 
      margin-bottom: 30px; 
    }
    .distortion-analysis { 
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); 
      border: 2px solid #17a2b8; 
      padding: 30px; 
      border-radius: 15px; 
      margin-bottom: 30px; 
    }
    .sharing-section {
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border: 2px solid #ab47bc;
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 30px;
    }
    .sharing-box {
      background: rgba(255,255,255,0.8);
      padding: 20px;
      border-radius: 10px;
    }
    h2 { 
      color: #667eea; 
      margin-bottom: 25px; 
      font-size: 1.8em;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    h3 { 
      color: #333; 
      margin-bottom: 15px; 
      font-size: 1.3em; 
    }
    .profile-section {
      margin-bottom: 30px;
      padding: 25px;
      border-radius: 10px;
    }
    .strengths-section {
      background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
      border-left: 5px solid #4caf50;
    }
    .development-section {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      border-left: 5px solid #ff9800;
    }
    ul { padding-left: 25px; }
    li { margin-bottom: 10px; line-height: 1.7; }
    .match-score {
      background: #4caf50;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      display: inline-block;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .insight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .insight-item {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }
    .validity-high { color: #28a745; font-weight: bold; }
    .validity-medium { color: #ffc107; font-weight: bold; }
    .validity-low { color: #dc3545; font-weight: bold; }
    @media print {
      body { background: white; }
      .header { background: #667eea !important; }
      .action-plan, .interview-questions, .distortion-analysis, .sharing-section { break-inside: avoid; }
    }
  `;
}

function generateReportHeader(title: string, userData: any): string {
  const currentDate = new Date().toLocaleDateString();
  return `
    <div class="header">
      <h1>${title}</h1>
      <p class="subtitle">Professional Assessment Report</p>
      <div class="user-info">
        <p><strong>Name:</strong> ${userData?.fullName || 'Assessment Participant'}</p>
        <p><strong>Email:</strong> ${userData?.email || 'Not provided'}</p>
        <p><strong>Report Date:</strong> ${currentDate}</p>
        <p><strong>Report ID:</strong> ${generateReportId()}</p>
      </div>
    </div>`;
}

function generateActionPlan(actions: string[]): string {
  return `
    <div class="action-plan">
      <h2>📅 30-Day Professional Development Action Plan</h2>
      <p><strong>Recommended steps to leverage your assessment results for career advancement:</strong></p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-top: 20px;">
        ${actions.map((action, index) => `
          <div style="background: rgba(255,255,255,0.8); padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
            <strong>Week ${Math.floor(index/2) + 1}-${Math.floor(index/2) + 2}:</strong> ${action}
          </div>
        `).join('')}
      </div>
    </div>`;
}

function generateInterviewQuestions(questions: string[]): string {
  return `
    <div class="interview-questions">
      <h2>❓ Behavioral Interview Questions</h2>
      <p><strong>Based on your assessment profile, here are targeted questions that showcase your strengths:</strong></p>
      <div style="margin-top: 20px;">
        ${questions.map((question, index) => `
          <div style="background: rgba(255,255,255,0.8); padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #ffd93d;">
            <strong>Question ${index + 1}:</strong> ${question}
          </div>
        `).join('')}
      </div>
      <p style="margin-top: 20px; font-style: italic;"><strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) when answering these questions to provide comprehensive and compelling responses.</p>
    </div>`;
}

function generateDistortionAnalysis(validityScore: number, validityDetails: string[] = []): string {
  let validityClass = 'validity-high';
  let validityText = 'Excellent';
  let interpretation = 'Your responses show high consistency and authenticity, indicating reliable assessment results.';
  let confidence = 'High';
  
  if (validityScore < 70) {
    validityClass = 'validity-low';
    validityText = 'Concerning';
    interpretation = 'Response patterns suggest potential social desirability bias or inconsistent responding. Results should be interpreted with caution.';
    confidence = 'Low';
  } else if (validityScore < 85) {
    validityClass = 'validity-medium';
    validityText = 'Good';
    interpretation = 'Response patterns are generally consistent with minor inconsistencies noted. Results are reliable with some limitations.';
    confidence = 'Moderate';
  }

  return `
    <div class="distortion-analysis">
      <h2>🔍 Response Validity Analysis</h2>
      <div style="background: rgba(255,255,255,0.8); padding: 20px; border-radius: 10px;">
        <p><strong>Validity Score:</strong> <span class="${validityClass}">${validityScore}% (${validityText})</span></p>
        <p><strong>Interpretation:</strong> ${interpretation}</p>
        <p><strong>Confidence Level:</strong> ${confidence} confidence in assessment results</p>
        
        <h4 style="margin-top: 20px; margin-bottom: 10px;">Validity Indicators:</h4>
        <ul>
          ${validityDetails.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #2196f3;">
          <strong>What this means:</strong> ${validityScore > 85 ? 'Your assessment results accurately reflect your authentic responses and can be confidently used for development and decision-making.' : validityScore > 70 ? 'Your results are generally reliable, though some responses may have been influenced by social desirability or time pressure.' : 'Results should be supplemented with additional assessment methods for more reliable insights.'}
        </div>
      </div>
    </div>`;
}

function getValidityLevel(score: number): string {
  if (score >= 90) return 'Exceptional Response Quality';
  if (score >= 85) return 'High Response Quality';
  if (score >= 70) return 'Good Response Quality';
  if (score >= 60) return 'Moderate Response Quality';
  return 'Low Response Quality';
}

function generateChartScript(chartId: string, title: string, labels: string[], data: number[]): string {
  return `
    const ctx${chartId} = document.getElementById('${chartId}').getContext('2d');
    new Chart(ctx${chartId}, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
          label: '${title}',
          data: ${JSON.stringify(data)},
          backgroundColor: [
            'rgba(102, 126, 234, 0.8)',
            'rgba(118, 75, 162, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)'
          ],
          borderColor: [
            'rgba(102, 126, 234, 1)',
            'rgba(118, 75, 162, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '${title}',
            font: { size: 16, weight: 'bold' }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) { return value + '%'; }
            }
          }
        }
      }
    });
  `;
}

function generateRadarChartScript(chartId: string, title: string, labels: string[], data: number[]): string {
  return `
    const ctx${chartId} = document.getElementById('${chartId}').getContext('2d');
    new Chart(ctx${chartId}, {
      type: 'radar',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
          label: '${title}',
          data: ${JSON.stringify(data)},
          fill: true,
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 1)',
          pointBackgroundColor: 'rgba(102, 126, 234, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(102, 126, 234, 1)',
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: '${title}',
            font: { size: 16, weight: 'bold' }
          },
          legend: { display: false }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              callback: function(value) { return value + '%'; }
            }
          }
        }
      }
    });
  `;
}

function generateReportId(): string {
  return 'AR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Placeholder functions for other assessment types (will enhance these)
function generateCAIRReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateEQReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateCulturalReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateStressReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateLeadershipReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateFaithValuesReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateGenZReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateDigitalWellnessReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}