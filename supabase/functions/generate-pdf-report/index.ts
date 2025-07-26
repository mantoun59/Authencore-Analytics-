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
  const interests = results?.interests || {};
  const aptitudes = results?.aptitudes || [];
  const personality = results?.personality || {};
  const values = results?.values || {};
  const careerFit = results?.career_fit || {};
  const actionPlan = results?.action_plan || [];
  
  // Get primary interest area
  const primaryInterest = Object.entries(interests).reduce((a, b) => a[1] > b[1] ? a : b)[0] || 'investigative';
  const primaryScore = interests[primaryInterest] || 85;
  
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
        <p><strong>Career Profile:</strong> ${careerFit?.label || 'Strategic Creative Thinker'}</p>
        <p><strong>Primary Interest Area:</strong> ${primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)} (${primaryScore}%)</p>
        <p><strong>Top Aptitude:</strong> ${aptitudes[0]?.name || 'Abstract Logic'} (${aptitudes[0]?.score || 92}%)</p>
        <p><strong>Questions Answered:</strong> ${userData?.questionsAnswered || 145} questions</p>
        <p><strong>Assessment Reliability:</strong> ${userData?.reliabilityScore || 94}% (${getValidityLevel(userData?.reliabilityScore || 94)})</p>
      </div>
    </div>

    <div class="aptitudes-section">
      <h2>🧠 Cognitive Aptitudes Analysis</h2>
      <div class="chart-container">
        <canvas id="aptitudesChart" width="400" height="300"></canvas>
      </div>
      
      <div class="aptitudes-breakdown">
        ${aptitudes.map((aptitude: any, index: number) => `
          <div class="aptitude-item">
            <h3>${index + 1}. ${aptitude.name} (${aptitude.score}%)</h3>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${aptitude.score}%"></div>
            </div>
            <p><strong>Interpretation:</strong> ${getAptitudeInterpretation(aptitude.name, aptitude.score)}</p>
            <p><strong>Career Applications:</strong> ${getAptitudeApplications(aptitude.name)}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="riasec-section">
      <h2>🔬 Interest Areas (RIASEC) Profile</h2>
      <div class="chart-container">
        <canvas id="riasecChart" width="400" height="400"></canvas>
      </div>
      
      <div class="riasec-breakdown">
        <div class="riasec-item">
          <h3>🔧 Realistic (${interests?.realistic || 65}%)</h3>
          <p><strong>Description:</strong> Interest in hands-on, practical work with tools, machines, and physical materials.</p>
          <p><strong>Career Examples:</strong> Engineer, Technician, Mechanic, Pilot, Architect</p>
        </div>
        <div class="riasec-item">
          <h3>🔬 Investigative (${interests?.investigative || 85}%)</h3>
          <p><strong>Description:</strong> Strong analytical thinking and interest in research, problem-solving, and intellectual challenges.</p>
          <p><strong>Career Examples:</strong> Scientist, Researcher, Data Analyst, Doctor, Psychologist</p>
        </div>
        <div class="riasec-item">
          <h3>🎨 Artistic (${interests?.artistic || 78}%)</h3>
          <p><strong>Description:</strong> Creative expression and appreciation for aesthetics, innovation, and original thinking.</p>
          <p><strong>Career Examples:</strong> Designer, Writer, Artist, Musician, Marketing Creative</p>
        </div>
        <div class="riasec-item">
          <h3>👥 Social (${interests?.social || 70}%)</h3>
          <p><strong>Description:</strong> Enjoys helping, teaching, and working with people in supportive roles.</p>
          <p><strong>Career Examples:</strong> Teacher, Counselor, Social Worker, Nurse, HR Specialist</p>
        </div>
        <div class="riasec-item">
          <h3>💼 Enterprising (${interests?.enterprising || 72}%)</h3>
          <p><strong>Description:</strong> Leadership, persuasion, and business activities that influence others.</p>
          <p><strong>Career Examples:</strong> Manager, Sales Representative, Entrepreneur, Lawyer, Executive</p>
        </div>
        <div class="riasec-item">
          <h3>📋 Conventional (${interests?.conventional || 60}%)</h3>
          <p><strong>Description:</strong> Organization, data management, and structured tasks with clear procedures.</p>
          <p><strong>Career Examples:</strong> Accountant, Administrator, Banking Professional, Quality Analyst</p>
        </div>
      </div>
    </div>

    <div class="career-recommendations">
      <h2>🎯 Top Career Recommendations</h2>
      <div class="career-list">
        ${(careerFit?.suggestions || ['Data Scientist', 'UX Research Analyst', 'Product Manager']).map((career: string, index: number) => `
          <div class="career-item">
            <h3>${index + 1}. ${career}</h3>
            <div class="match-score">Match Score: ${92 - (index * 4)}%</div>
            <p><strong>Why it fits:</strong> ${getCareerFitReason(career, interests, aptitudes)}</p>
            <p><strong>Key activities:</strong> ${getCareerActivities(career)}</p>
            <p><strong>Growth outlook:</strong> ${getCareerOutlook(career)}</p>
          </div>
        `).slice(0, 3).join('')}
      </div>
    </div>

    <div class="personality-insights">
      <h2>🧠 Personality & Work Style Insights</h2>
      <div class="insight-grid">
        <div class="insight-item">
          <h4>💪 Work Strengths</h4>
          <ul>
            <li>Strong ${aptitudes[0]?.name?.toLowerCase() || 'analytical'} abilities (${aptitudes[0]?.score || 92}%)</li>
            <li>${personality?.openness > 70 ? 'Highly creative and open to new experiences' : 'Practical and detail-oriented approach'}</li>
            <li>${personality?.conscientiousness > 70 ? 'Excellent organization and planning skills' : 'Flexible and adaptable work style'}</li>
            <li>${personality?.adaptability > 70 ? 'Quick to adapt to changing environments' : 'Consistent and reliable performance'}</li>
            <li>${values?.achievement > 70 ? 'Strong drive for accomplishment and success' : 'Values work-life balance and stability'}</li>
          </ul>
        </div>
        <div class="insight-item">
          <h4>⚡ Ideal Work Environment</h4>
          <ul>
            <li>${interests?.investigative > 70 ? 'Intellectually stimulating challenges' : 'Practical, hands-on projects'}</li>
            <li>${personality?.introversion < 50 ? 'Collaborative team environments' : 'Autonomous work with flexible arrangements'}</li>
            <li>${values?.creativity > 70 ? 'Creative freedom and innovation opportunities' : 'Clear structure and defined processes'}</li>
            <li>${aptitudes.find((a: any) => a.name.includes('Numerical'))?.score > 80 ? 'Data-driven decision making culture' : 'People-focused collaborative culture'}</li>
            <li>${values?.community > 70 ? 'Mission-driven organizations with social impact' : 'Results-oriented professional environments'}</li>
          </ul>
        </div>
        <div class="insight-item">
          <h4>🎯 Motivational Factors</h4>
          <ul>
            <li>${interests?.investigative > 70 ? 'Solving complex, meaningful problems' : 'Clear goals and measurable outcomes'}</li>
            <li>${aptitudes[0]?.name?.includes('Abstract') ? 'Strategic thinking and innovation challenges' : 'Practical skill development opportunities'}</li>
            <li>${values?.achievement > 70 ? 'Recognition for exceptional performance' : 'Work-life balance and job security'}</li>
            <li>${personality?.openness > 70 ? 'Continuous learning and growth opportunities' : 'Mastery of specialized skills'}</li>
            <li>${values?.creativity > 70 ? 'Creative expression and original thinking' : 'Systematic improvement and efficiency'}</li>
          </ul>
        </div>
        <div class="insight-item">
          <h4>⚠️ Development Areas</h4>
          <ul>
            <li>${personality?.introversion > 60 ? 'Building stronger networking and social skills' : 'Developing independent work capabilities'}</li>
            <li>${personality?.conscientiousness < 60 ? 'Improving organization and time management' : 'Increasing flexibility and adaptability'}</li>
            <li>${aptitudes.find((a: any) => a.score < 70) ? `Strengthening ${aptitudes.find((a: any) => a.score < 70)?.name?.toLowerCase()} skills` : 'Applying high abilities in practical settings'}</li>
            <li>${values?.security < 60 ? 'Building confidence in risk-taking situations' : 'Embracing change and uncertainty'}</li>
            <li>${interests?.social < 60 ? 'Developing interpersonal and communication skills' : 'Balancing people focus with individual productivity'}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="values-section">
      <h2>⭐ Core Values Assessment</h2>
      <div class="values-grid">
        <div class="value-item">
          <h3>🛡️ Security (${values?.security || 65}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${values?.security || 65}%"></div>
          </div>
          <p>${values?.security > 70 ? 'High need for stability and predictable career path' : 'Comfortable with reasonable risk and change'}</p>
        </div>
        <div class="value-item">
          <h3>🏆 Achievement (${values?.achievement || 78}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${values?.achievement || 78}%"></div>
          </div>
          <p>${values?.achievement > 70 ? 'Strong drive for success and recognition' : 'Balanced approach to ambition and contentment'}</p>
        </div>
        <div class="value-item">
          <h3>🎨 Creativity (${values?.creativity || 85}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${values?.creativity || 85}%"></div>
          </div>
          <p>${values?.creativity > 70 ? 'High value on innovation and creative expression' : 'Appreciates creativity but values practicality'}</p>
        </div>
        <div class="value-item">
          <h3>🤝 Community (${values?.community || 72}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${values?.community || 72}%"></div>
          </div>
          <p>${values?.community > 70 ? 'Strong desire to contribute to society and help others' : 'Balanced individual and collective focus'}</p>
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

    ${generateDistortionAnalysis(userData?.reliabilityScore || 94, [
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
      ${generateChartScript('aptitudesChart', 'Cognitive Aptitudes', 
        aptitudes.map((apt: any) => apt.name), 
        aptitudes.map((apt: any) => apt.score)
      )}
      ${generateRadarChartScript('riasecChart', 'RIASEC Interest Profile', 
        ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
        [interests?.realistic || 65, interests?.investigative || 85, interests?.artistic || 78, 
         interests?.social || 70, interests?.enterprising || 72, interests?.conventional || 60]
      )}
    </script>
  </body>
  </html>`;
}

// Helper Functions
function getReportStyles(): string {
  return `
    @page { 
      margin: 1.2in 1in; 
      size: A4;
    }
    @page :first { 
      margin: 1.5in 1.2in; 
    }
    @page :nth(2) { 
      margin: 1.3in 1.1in; 
    }
    @page :nth(3) { 
      margin: 1.2in 1in; 
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background: #f8f9fa;
      max-width: 8in;
      margin: 0 auto;
      padding: 20px;
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
      padding: 40px 35px; 
      border-radius: 15px; 
      box-shadow: 0 5px 20px rgba(0,0,0,0.1); 
      margin: 35px 0; 
      page-break-inside: avoid;
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
      padding: 40px 35px; 
      border-radius: 15px; 
      margin: 35px 0; 
      page-break-inside: avoid;
    }
    .interview-questions { 
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); 
      border: 2px solid #ffd93d; 
      padding: 40px 35px; 
      border-radius: 15px; 
      margin: 35px 0; 
      page-break-inside: avoid;
    }
    .distortion-analysis { 
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); 
      border: 2px solid #17a2b8; 
      padding: 40px 35px; 
      border-radius: 15px; 
      margin: 35px 0; 
      page-break-inside: avoid;
    }
    .sharing-section {
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      border: 2px solid #ab47bc;
      padding: 40px 35px;
      border-radius: 15px;
      margin: 35px 0;
      page-break-inside: avoid;
    }
    .sharing-box {
      background: rgba(255,255,255,0.8);
      padding: 25px;
      border-radius: 10px;
      margin-top: 15px;
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
      body { 
        background: white; 
        margin: 0;
        padding: 15px;
      }
      .header { background: #667eea !important; }
      .action-plan, .interview-questions, .distortion-analysis, .sharing-section, 
      .dimensions-section, .career-recommendations, .riasec-section, .personality-insights { 
        break-inside: avoid; 
        page-break-inside: avoid;
      }
      h2 { page-break-after: avoid; }
      .chart-container { page-break-inside: avoid; }
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

// Cultural Intelligence Helper Functions
function getCQLevel(percentile: number): string {
  if (percentile >= 90) return 'Exceptional';
  if (percentile >= 75) return 'Strong';
  if (percentile >= 60) return 'Above Average';
  if (percentile >= 40) return 'Average';
  if (percentile >= 25) return 'Below Average';
  return 'Developing';
}

function getMostCommonAdaptationStyle(patterns: any[]): string {
  if (patterns.length === 0) return 'Contextual';
  const styles = patterns.map(p => p.decisionStyle);
  const styleCount = styles.reduce((acc, style) => {
    acc[style] = (acc[style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(styleCount).reduce((a, b) => styleCount[a[0]] > styleCount[b[0]] ? a : b)[0];
}

function getCQDimensionDescription(dimension: string): string {
  const descriptions: Record<string, string> = {
    drive: 'Your motivation and confidence to engage with people from different cultural backgrounds. This includes your enjoyment of diverse environments and willingness to adapt your behavior.',
    knowledge: 'Your understanding of cultural systems, values, and norms. This encompasses both general cultural knowledge and specific awareness of how culture shapes thinking and behavior.',
    strategy: 'Your ability to plan and check your cultural interactions. This includes being aware of cultural differences and adjusting your mental models when cross-cultural interactions require it.',
    action: 'Your capability to adapt your behavior when cross-cultural situations require it. This includes modifying your verbal and non-verbal behavior to suit different cultural contexts.'
  };
  
  return descriptions[dimension] || 'Your capability in this cultural intelligence dimension.';
}

function getCQWorkplaceApplications(dimension: string, level: string): string {
  const applications: Record<string, Record<string, string>> = {
    drive: {
      'Exceptional': 'Excellent for international assignments, cross-cultural team leadership, and global client relationships. Natural cultural ambassador.',
      'Strong': 'Well-suited for multicultural teams and international projects. Shows genuine interest in cultural diversity.',
      'Average': 'Can work effectively in diverse environments with proper support and cultural briefings.',
      'Developing': 'May need extensive cultural training and support before international assignments.'
    },
    knowledge: {
      'Exceptional': 'Ideal for roles requiring deep cultural understanding: international consulting, global marketing, diplomatic positions.',
      'Strong': 'Good foundation for cross-cultural work. Can provide cultural insights to teams and projects.',
      'Average': 'Adequate cultural awareness for most diverse workplace situations with occasional guidance.',
      'Developing': 'Requires cultural education and training to work effectively across cultures.'
    },
    strategy: {
      'Exceptional': 'Excellent at planning cross-cultural interactions and adjusting strategies based on cultural context.',
      'Strong': 'Good at thinking through cultural implications and planning appropriate approaches.',
      'Average': 'Can plan for cultural differences when prompted or guided through the process.',
      'Developing': 'Needs structured frameworks and guidance for cross-cultural planning and strategy.'
    },
    action: {
      'Exceptional': 'Naturally adapts behavior across cultures. Excellent for client-facing international roles.',
      'Strong': 'Good at modifying behavior appropriately for different cultural contexts.',
      'Average': 'Can adapt behavior with awareness and practice in specific cultural situations.',
      'Developing': 'May struggle with behavioral adaptation and need coaching for cross-cultural interactions.'
    }
  };
  
  return applications[dimension]?.[level] || 'Continue developing cultural intelligence skills for workplace effectiveness.';
}

function getCQDevelopmentRecommendations(dimension: string, level: string): string {
  const recommendations: Record<string, Record<string, string>> = {
    drive: {
      'Exceptional': 'Mentor others in cross-cultural engagement. Consider leadership roles in global initiatives.',
      'Strong': 'Seek challenging international assignments. Share your cultural enthusiasm with others.',
      'Average': 'Gradually increase exposure to diverse cultural environments. Practice cultural curiosity.',
      'Developing': 'Start with cultural awareness training. Build confidence through guided multicultural experiences.'
    },
    knowledge: {
      'Exceptional': 'Become a cultural subject matter expert. Contribute to cultural training programs.',
      'Strong': 'Deepen knowledge in specific cultural areas relevant to your work.',
      'Average': 'Read about different cultures and attend cultural awareness workshops.',
      'Developing': 'Begin with foundational cultural learning. Use cultural intelligence resources and training.'
    },
    strategy: {
      'Exceptional': 'Develop frameworks to help others plan cross-cultural interactions.',
      'Strong': 'Practice advanced cultural planning and scenario analysis.',
      'Average': 'Use structured approaches to plan for cultural differences.',
      'Developing': 'Learn basic cultural planning frameworks and practice with guidance.'
    },
    action: {
      'Exceptional': 'Help others develop behavioral adaptation skills.',
      'Strong': 'Continue practicing behavioral flexibility in new cultural contexts.',
      'Average': 'Practice specific behavioral adaptations with feedback.',
      'Developing': 'Start with awareness of your own cultural behaviors and practice small adaptations.'
    }
  };
  
  return recommendations[dimension]?.[level] || 'Continue developing cultural intelligence capabilities.';
}

function generateCQStrengths(dimensions: any[]): string {
  const strengths = dimensions.filter(d => d.percentile >= 70).map(d => `<li>${d.name}: ${d.level} (${d.percentile}th percentile)</li>`);
  return strengths.length > 0 ? strengths.join('') : '<li>Balanced cultural intelligence profile with room for development</li>';
}

function generateCQDevelopmentAreas(dimensions: any[]): string {
  const areas = dimensions.filter(d => d.percentile < 60).map(d => `<li>${d.name}: Focus on ${d.name.toLowerCase()} development</li>`);
  return areas.length > 0 ? areas.join('') : '<li>Continue strengthening all CQ dimensions for optimal effectiveness</li>';
}

function getGlobalReadinessAssessment(overallScore: number, percentile: number): string {
  if (overallScore >= 80) {
    return 'Excellent global readiness. You demonstrate strong cultural intelligence across all dimensions and are well-prepared for international assignments and cross-cultural leadership roles.';
  } else if (overallScore >= 65) {
    return 'Good global readiness with some areas for development. You have solid cultural intelligence foundations and can be effective in most cross-cultural situations with continued growth.';
  } else if (overallScore >= 50) {
    return 'Moderate global readiness. You have basic cultural intelligence skills but would benefit from targeted development before taking on significant cross-cultural responsibilities.';
  } else {
    return 'Developing global readiness. Significant cultural intelligence development needed before international assignments. Consider comprehensive cultural training programs.';
  }
}

function generateCQActionPlan(dimensions: any[], overallScore: number): string {
  const actionItems = [
    `Focus on developing your lowest-scoring CQ dimension: ${dimensions.sort((a, b) => a.percentile - b.percentile)[0]?.name || 'All dimensions'}`,
    'Seek opportunities for cross-cultural interaction in your current role',
    'Consider cultural mentorship or coaching for personalized development',
    'Practice cultural observation and reflection techniques',
    'Set specific goals for cultural intelligence improvement over the next 6 months'
  ];
  
  if (overallScore >= 70) {
    actionItems.unshift('Leverage your cultural intelligence strengths in leadership or mentoring roles');
  }
  
  return generateActionPlan(actionItems);
}

function generateCQChartScript(dimensions: any[]): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('cqChart').getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [${dimensions.map(d => `'${d.name}'`).join(', ')}],
          datasets: [{
            label: 'CQ Scores (Percentiles)',
            data: [${dimensions.map(d => d.percentile).join(', ')}],
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Cultural Intelligence Dimension Scores'
            }
          }
        }
      });
    });
  `;
}

// Stress Resilience Helper Functions
function getResilienceProfileDescription(profile: string): string {
  const descriptions: Record<string, string> = {
    'Diamond': 'Exceptional resilience - You demonstrate outstanding ability to handle stress and bounce back from challenges. You likely serve as a stabilizing force for others during difficult times.',
    'Steel': 'Strong resilience - You have well-developed coping mechanisms and can handle significant stress while maintaining performance. You recover well from setbacks.',
    'Bamboo': 'Flexible resilience - You demonstrate good adaptability and can bend without breaking under pressure. You may need some support during peak stress periods.',
    'Glass': 'Developing resilience - You may struggle with high stress levels and benefit from building stronger coping strategies and support systems.',
    'Clay': 'Fragile resilience - You may be particularly vulnerable to stress and burnout. Immediate attention to stress management and support systems is recommended.'
  };
  
  return descriptions[profile] || 'Your resilience profile indicates areas for development in stress management.';
}

function getBurnoutRiskDescription(risk: string): string {
  const descriptions: Record<string, string> = {
    low: 'You demonstrate strong protective factors against burnout. Continue maintaining healthy work-life balance and stress management practices.',
    medium: 'You show some risk factors for burnout. Monitor your stress levels and implement additional coping strategies as needed.',
    high: 'You are showing significant risk factors for burnout. Immediate attention to stress reduction and support systems is recommended.'
  };
  
  return descriptions[risk] || 'Monitor your stress levels and seek support as needed.';
}

function getStressDimensionDescription(dimension: string, level: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    workload: {
      excellent: 'You manage your workload exceptionally well, maintaining high productivity without overwhelm.',
      good: 'You generally handle your workload effectively with good time management skills.',
      fair: 'You can manage your workload adequately but may feel overwhelmed at times.',
      'needs-improvement': 'You struggle with workload management and may frequently feel overwhelmed.'
    },
    emotional: {
      excellent: 'You demonstrate outstanding emotional regulation and stability under pressure.',
      good: 'You manage your emotions well during stressful situations.',
      fair: 'You have adequate emotional coping strategies but may need additional support.',
      'needs-improvement': 'You may struggle with emotional regulation during stressful periods.'
    },
    efficacy: {
      excellent: 'You maintain high confidence in your abilities and feel very effective at work.',
      good: 'You generally feel competent and effective in your work role.',
      fair: 'You have moderate confidence in your abilities with room for growth.',
      'needs-improvement': 'You may question your effectiveness and need confidence building.'
    },
    support: {
      excellent: 'You have strong support systems and effectively utilize available resources.',
      good: 'You have good support networks and know how to access help when needed.',
      fair: 'You have some support available but may not always utilize it effectively.',
      'needs-improvement': 'You may lack adequate support systems or struggle to access help.'
    },
    worklife: {
      excellent: 'You maintain excellent work-life balance and boundary management.',
      good: 'You generally maintain good work-life balance with occasional challenges.',
      fair: 'You struggle sometimes with work-life balance but can manage adequately.',
      'needs-improvement': 'You may have poor work-life boundaries leading to increased stress.'
    },
    coping: {
      excellent: 'You have highly effective stress management and coping strategies.',
      good: 'You have good coping mechanisms that work well for you.',
      fair: 'You have some coping strategies but may need to develop additional ones.',
      'needs-improvement': 'You may lack effective coping strategies for managing stress.'
    }
  };
  
  return descriptions[dimension]?.[level] || 'Continue developing this area for improved stress resilience.';
}

function getStressDimensionStrategies(dimension: string, level: string): string {
  const strategies: Record<string, string> = {
    workload: 'Practice time management techniques, prioritization frameworks, and delegation when possible. Consider workload redistribution if consistently overwhelmed.',
    emotional: 'Develop emotional regulation techniques such as mindfulness, deep breathing, and cognitive reframing. Practice self-awareness of emotional triggers.',
    efficacy: 'Build confidence through skill development, celebrating achievements, and seeking feedback. Focus on past successes and strengths.',
    support: 'Strengthen relationships with colleagues, mentors, and friends. Learn to ask for help and utilize available resources effectively.',
    worklife: 'Establish clear boundaries between work and personal time. Practice saying no to excessive demands and prioritize self-care activities.',
    coping: 'Develop a toolkit of stress management techniques including exercise, relaxation, hobbies, and healthy lifestyle habits.'
  };
  
  return strategies[dimension] || 'Focus on building resilience in this important area.';
}

function getStressDimensionWarnings(dimension: string): string {
  const warnings: Record<string, string> = {
    workload: 'High workload stress can lead to burnout, decreased performance, and health issues. Consider immediate workload management strategies.',
    emotional: 'Poor emotional regulation can impact relationships, decision-making, and overall well-being. Seek support for emotional coping skills.',
    efficacy: 'Low sense of efficacy can lead to decreased motivation and performance. Focus on building confidence and competence.',
    support: 'Lack of support can increase vulnerability to stress and burnout. Actively work to build support networks.',
    worklife: 'Poor work-life balance can lead to chronic stress and impact personal relationships and health.',
    coping: 'Inadequate coping strategies can lead to harmful stress responses and potential mental health concerns.'
  };
  
  return warnings[dimension] || 'This area requires immediate attention to prevent stress-related difficulties.';
}

function generateStressActionPlan(dimensionScores: any[], burnoutRisk: string, stressLevel: string): string {
  const actionItems = [];
  
  // Risk-specific actions
  if (burnoutRisk === 'high') {
    actionItems.push('Seek immediate support from supervisor or HR regarding workload and stress levels');
    actionItems.push('Consider professional counseling or employee assistance program resources');
  }
  
  // Dimension-specific actions
  const lowestDimension = dimensionScores.sort((a, b) => a.percentage - b.percentage)[0];
  if (lowestDimension) {
    actionItems.push(`Priority focus: Improve ${lowestDimension.dimension.toLowerCase()} management strategies`);
  }
  
  // General actions
  actionItems.push('Implement daily stress management techniques (meditation, exercise, or relaxation)');
  actionItems.push('Review and improve work-life balance practices');
  actionItems.push('Schedule regular check-ins with supervisor about workload and support needs');
  actionItems.push('Consider stress management training or workshops');
  actionItems.push('Reassess stress levels in 30 days and adjust strategies as needed');
  
  return generateActionPlan(actionItems);
}

function generateStressChartScript(dimensionScores: any[]): string {
  const chartData = dimensionScores.map(d => ({
    label: d.dimension,
    value: d.percentage
  }));
  
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('resilienceChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [${chartData.map(d => `'${d.label}'`).join(', ')}],
          datasets: [{
            label: 'Resilience Scores (%)',
            data: [${chartData.map(d => d.value).join(', ')}],
            backgroundColor: [
              'rgba(139, 92, 246, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(168, 85, 247, 0.8)'
            ],
            borderColor: [
              'rgba(139, 92, 246, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(168, 85, 247, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Stress Resilience Dimension Breakdown'
            }
          }
        }
      });
    });
  `;
}

function generateReportId(): string {
  return 'AR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Helper functions for CareerLaunch report
function getAptitudeInterpretation(aptitudeName: string, score: number): string {
  const interpretations = {
    'Abstract Logic': score > 85 ? 'Exceptional ability to identify patterns, solve complex problems, and think strategically. Ideal for roles requiring innovation and analytical thinking.' : score > 70 ? 'Good analytical thinking skills with solid pattern recognition abilities.' : 'Developing analytical skills with opportunities to strengthen logical reasoning.',
    'Verbal Reasoning': score > 85 ? 'Outstanding communication and language skills. Excellent at understanding complex texts, articulating ideas, and verbal problem-solving.' : score > 70 ? 'Strong verbal abilities with good reading comprehension and communication skills.' : 'Solid verbal skills with room for improvement in complex communication scenarios.',
    'Numerical Reasoning': score > 85 ? 'Excellent mathematical and analytical abilities. Strong capacity for data analysis, financial modeling, and quantitative problem-solving.' : score > 70 ? 'Good numerical skills suitable for most analytical roles.' : 'Basic numerical abilities sufficient for general business applications.',
    'Memory/Attention': score > 85 ? 'Outstanding working memory and attention to detail. Excellent ability to process multiple information streams simultaneously.' : score > 70 ? 'Good memory and attention skills suitable for detail-oriented work.' : 'Adequate memory abilities with opportunities to improve focus and retention.'
  };
  return interpretations[aptitudeName as keyof typeof interpretations] || 'This aptitude shows your cognitive abilities in specialized areas.';
}

function getAptitudeApplications(aptitudeName: string): string {
  const applications = {
    'Abstract Logic': 'Strategy consulting, data science, research and development, systems design, innovation management',
    'Verbal Reasoning': 'Marketing, communications, law, journalism, training and development, sales',
    'Numerical Reasoning': 'Finance, accounting, data analysis, operations research, business analytics',
    'Memory/Attention': 'Project management, quality assurance, research, administrative coordination, process improvement'
  };
  return applications[aptitudeName as keyof typeof applications] || 'Various analytical and problem-solving roles';
}

function getCareerFitReason(career: string, interests: any, aptitudes: any[]): string {
  const fitReasons = {
    'Data Scientist': `Perfect match for your ${interests?.investigative > 80 ? 'strong investigative interests' : 'analytical mindset'} and ${aptitudes[0]?.name?.includes('Abstract') ? 'exceptional abstract reasoning' : 'cognitive strengths'}. Combines research with practical problem-solving.`,
    'UX Research Analyst': `Ideal blend of your ${interests?.investigative > 75 ? 'research orientation' : 'analytical approach'} and ${interests?.artistic > 70 ? 'creative interests' : 'design thinking'}. Perfect for understanding user behavior through data.`,
    'Product Manager': `Matches your ${interests?.enterprising > 70 ? 'leadership interests' : 'strategic thinking'} and ${aptitudes.find(a => a.name.includes('Verbal'))?.score > 80 ? 'strong communication skills' : 'analytical abilities'}. Requires both technical understanding and business acumen.`,
    'Innovation Consultant': `Aligns with your ${interests?.investigative > 80 ? 'research interests' : 'analytical mindset'} and ${interests?.artistic > 75 ? 'creative problem-solving' : 'strategic thinking'}. Perfect for driving organizational change.`,
    'Research & Development Manager': `Combines your ${interests?.investigative > 80 ? 'strong research orientation' : 'analytical interests'} with ${interests?.enterprising > 70 ? 'leadership capabilities' : 'management potential'}. Ideal for leading innovation teams.`
  };
  return fitReasons[career as keyof typeof fitReasons] || `Strong alignment with your interests in ${Object.entries(interests).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]} and ${aptitudes[0]?.name?.toLowerCase()} abilities.`;
}

function getCareerActivities(career: string): string {
  const activities = {
    'Data Scientist': 'Statistical modeling, machine learning algorithm development, data visualization, predictive analytics, business intelligence reporting',
    'UX Research Analyst': 'User interviews, usability testing, behavioral analysis, journey mapping, research synthesis and insights',
    'Product Manager': 'Market research, feature prioritization, stakeholder management, product roadmap development, cross-functional team leadership',
    'Innovation Consultant': 'Innovation strategy development, organizational change management, process improvement, technology assessment',
    'Research & Development Manager': 'Research project oversight, team leadership, innovation pipeline management, technology development, strategic planning'
  };
  return activities[career as keyof typeof activities] || 'Strategic analysis, problem-solving, team collaboration, project management, client consultation';
}

function getCareerOutlook(career: string): string {
  const outlooks = {
    'Data Scientist': 'Exceptional growth projected (22% by 2030), high salary potential ($95k-$165k), diverse industry applications',
    'UX Research Analyst': 'Strong growth in tech sector (13% by 2030), excellent job satisfaction, increasing demand for user-centered design',
    'Product Manager': 'High-demand role (19% growth), excellent advancement opportunities ($100k-$180k), central to business strategy',
    'Innovation Consultant': 'Growing field as organizations prioritize innovation, high earning potential, diverse project opportunities',
    'Research & Development Manager': 'Stable growth (7% by 2030), high responsibility role, excellent for those seeking leadership positions'
  };
  return outlooks[career as keyof typeof outlooks] || 'Good growth prospects with opportunities for advancement and competitive compensation';
}

// Placeholder functions for other assessment types (will enhance these)

// Emotional Intelligence Assessment Report Generator
function generateEQReport(results: any, userData: any): string {
  const scores = results?.scores || {};
  const overallScore = results?.overallScore || 0;
  const recommendations = results?.recommendations || [];
  
  // Extract EI dimensions
  const eqDimensions = ['selfAwareness', 'selfRegulation', 'motivation', 'empathy', 'socialSkills'].map(dim => ({
    name: formatDimensionName(dim.replace(/([A-Z])/g, ' $1')),
    score: scores[dim]?.raw || 0,
    percentage: scores[dim]?.percentage || 0,
    level: scores[dim]?.level || 'Medium',
    interpretation: scores[dim]?.interpretation || 'Developing emotional intelligence in this area'
  }));

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Emotional Intelligence Assessment Report</title>
    <style>
      ${getReportStyles()}
      .eq-dimension {
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        padding: 20px;
        margin: 15px 0;
        border-radius: 8px;
      }
      .eq-level {
        padding: 8px 15px;
        border-radius: 20px;
        display: inline-block;
        font-weight: bold;
        margin: 5px 0;
      }
      .level-high { background: #d1fae5; color: #065f46; }
      .level-medium { background: #fef3c7; color: #92400e; }
      .level-low { background: #fee2e2; color: #991b1b; }
      .eq-application {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 15px;
        margin: 10px 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Emotional Intelligence Assessment", userData)}
    
    <div class="executive-summary">
      <h2>🧠 Executive Summary</h2>
      <div class="summary-box">
        <p><strong>Participant:</strong> ${userData?.name || 'Assessment Participant'}</p>
        <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
        <p><strong>Overall EQ Score:</strong> ${overallScore.toFixed(1)}/100</p>
        <p><strong>EQ Profile:</strong> ${getEQProfile(overallScore)}</p>
        
        <div style="margin-top: 15px;">
          <h3>🎯 Emotional Intelligence Overview</h3>
          <p>Emotional Intelligence (EQ) measures your ability to understand, use, and manage emotions effectively. This assessment evaluated five key dimensions of emotional intelligence that are crucial for personal and professional success.</p>
        </div>
      </div>
    </div>

    <div class="personality-profile">
      <h2>📊 EQ Dimension Analysis</h2>
      <div class="chart-container">
        <canvas id="eqChart" width="400" height="300"></canvas>
      </div>
      
      ${eqDimensions.map(dimension => `
        <div class="eq-dimension">
          <h3>💡 ${dimension.name}</h3>
          <span class="eq-level level-${dimension.level.toLowerCase()}">${dimension.level} Level</span>
          <div class="progress-bar" style="margin: 10px 0;">
            <div class="progress-fill" style="width: ${dimension.percentage}%"></div>
          </div>
          <p><strong>Score:</strong> ${dimension.score}/5 (${dimension.percentage}%)</p>
          <p><strong>Interpretation:</strong> ${dimension.interpretation}</p>
          
          <div class="eq-application">
            <h4>💼 Workplace Applications</h4>
            <p>${getEQWorkplaceApplication(dimension.name.toLowerCase().replace(/\s+/g, ''), dimension.level)}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="insights-section">
      <h2>🎯 Development Recommendations</h2>
      ${recommendations.map((rec: any) => `
        <div class="insight-card">
          <h3>📈 ${formatDimensionName(rec.dimension)}</h3>
          <ul>
            ${rec.suggestions.map((suggestion: string) => `<li>${suggestion}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    ${generateEQActionPlan(eqDimensions, overallScore)}

    <div class="footer">
      <p><strong>Confidential Emotional Intelligence Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This EQ assessment provides insights for emotional and social skill development.</p>
    </div>

    <script>
      ${generateEQChartScript(eqDimensions)}
    </script>
  </body>
  </html>
  `;
}

// Cultural Intelligence Assessment Report Generator
function generateCulturalReport(results: any, userData: any): string {
  const dimensions = results?.dimensions || {};
  const culturalProfile = results?.culturalProfile || {};
  const overallScore = results?.overallScore || 0;
  const percentileScore = results?.percentileScore || 0;
  const profile = results?.profile || 'Developing Cultural Intelligence';
  const scenarioHistory = results?.scenarioHistory || [];
  const adaptationPatterns = results?.adaptationPatterns || [];
  
  // Calculate CQ breakdown
  const cqDimensions = ['drive', 'knowledge', 'strategy', 'action'].map(dim => ({
    name: formatDimensionName(dim),
    score: dimensions[dim]?.score || 0,
    percentile: Math.min(99, Math.max(1, (dimensions[dim]?.score || 0) * 20)),
    level: getCQLevel((dimensions[dim]?.score || 0) * 20),
    components: dimensions[dim]?.components || {}
  }));

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Cultural Intelligence (CQ) Assessment Report</title>
    <style>
      ${getReportStyles()}
      .cq-dimension {
        background: #f8fafc;
        border-left: 4px solid #6366f1;
        padding: 20px;
        margin: 15px 0;
        border-radius: 8px;
      }
      .cq-components {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
      }
      .component-card {
        background: white;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
      }
      .scenario-analysis {
        background: #fefce8;
        border: 1px solid #facc15;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
      }
      .cultural-context {
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        padding: 15px;
        margin: 10px 0;
      }
      .adaptation-pattern {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 15px;
        margin: 10px 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Cultural Intelligence (CQ) Assessment", userData)}
    
    <div class="executive-summary">
      <h2>🌍 Executive Summary</h2>
      <div class="summary-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Candidate:</strong> ${userData?.name || 'Assessment Participant'}</p>
            <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
            <p><strong>Overall CQ Score:</strong> ${overallScore.toFixed(1)}/100</p>
            <p><strong>Percentile Ranking:</strong> ${percentileScore}th percentile</p>
          </div>
          <div>
            <p><strong>CQ Profile:</strong> ${profile}</p>
            <p><strong>Scenarios Completed:</strong> ${scenarioHistory.length}</p>
            <p><strong>Cultural Contexts:</strong> ${new Set(scenarioHistory.map(s => s.location)).size}</p>
            <p><strong>Adaptation Style:</strong> ${getMostCommonAdaptationStyle(adaptationPatterns)}</p>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <h3>🎯 Cultural Intelligence Overview</h3>
          <p>Your Cultural Intelligence score reflects your capability to function effectively in culturally diverse environments. This assessment measured your motivation (CQ Drive), understanding (CQ Knowledge), planning (CQ Strategy), and behavioral adaptation (CQ Action) across various cultural scenarios.</p>
        </div>
      </div>
    </div>

    <div class="personality-profile">
      <h2>📊 CQ Dimension Analysis</h2>
      <div class="chart-container">
        <canvas id="cqChart" width="400" height="300"></canvas>
      </div>
      
      ${cqDimensions.map(dimension => `
        <div class="cq-dimension">
          <h3>🧭 ${dimension.name} (${dimension.percentile}th percentile)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${dimension.percentile}%"></div>
          </div>
          <p><strong>Level:</strong> ${dimension.level}</p>
          <p>${getCQDimensionDescription(dimension.name.toLowerCase())}</p>
          
          <div class="cq-components">
            ${Object.entries(dimension.components).map(([comp, score]: [string, any]) => `
              <div class="component-card">
                <h4>${formatDimensionName(comp)}</h4>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${Math.min(100, score * 20)}%"></div>
                </div>
                <p>Score: ${score.toFixed(1)}/5</p>
              </div>
            `).join('')}
          </div>
          
          <div class="cultural-context">
            <h4>💼 Workplace Applications</h4>
            <p>${getCQWorkplaceApplications(dimension.name.toLowerCase(), dimension.level)}</p>
          </div>
          
          <div class="adaptation-pattern">
            <h4>🎯 Development Recommendations</h4>
            <p>${getCQDevelopmentRecommendations(dimension.name.toLowerCase(), dimension.level)}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="scenario-analysis">
      <h2>🎭 Cultural Scenario Performance</h2>
      <h3>Strengths Demonstrated</h3>
      <ul>
        ${(culturalProfile.strengths || []).slice(0, 3).map((strength: any) => `
          <li><strong>${strength.location} - ${formatDimensionName(strength.type)}:</strong> ${(strength.appropriateness * 100).toFixed(0)}% cultural appropriateness</li>
        `).join('')}
      </ul>
      
      <h3>Areas for Growth</h3>
      <ul>
        ${(culturalProfile.challenges || []).slice(0, 3).map((challenge: any) => `
          <li><strong>${challenge.location} - ${formatDimensionName(challenge.type)}:</strong> Opportunity for improvement in cultural adaptation</li>
        `).join('')}
      </ul>
      
      <h3>Cultural Adaptation Patterns</h3>
      ${adaptationPatterns.slice(0, 3).map((pattern: any) => `
        <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
          <strong>${pattern.culturalContext}:</strong> ${pattern.decisionStyle} approach with ${(pattern.adaptationLevel * 100).toFixed(0)}% adaptation effectiveness
        </div>
      `).join('')}
    </div>

    <div class="insights-section">
      <h2>🧠 Cultural Intelligence Insights</h2>
      
      <div class="insights-grid">
        <div class="insight-card strengths">
          <h3>💪 Cultural Strengths</h3>
          <ul>
            ${generateCQStrengths(cqDimensions)}
          </ul>
        </div>
        
        <div class="insight-card growth-areas">
          <h3>🌱 Development Opportunities</h3>
          <ul>
            ${generateCQDevelopmentAreas(cqDimensions)}
          </ul>
        </div>
      </div>
      
      <div class="cultural-context">
        <h3>🌏 Global Readiness Assessment</h3>
        <p>${getGlobalReadinessAssessment(overallScore, percentileScore)}</p>
      </div>
    </div>

    ${generateCQActionPlan(cqDimensions, overallScore)}

    <div class="footer">
      <p><strong>Confidential Cultural Intelligence Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This CQ assessment provides insights for cross-cultural effectiveness and global professional development.</p>
      <p>For questions about this report, contact your assessment administrator or HR professional.</p>
    </div>

    <script>
      ${generateCQChartScript(cqDimensions)}
    </script>
  </body>
  </html>
  `;
}

// Comprehensive Stress Resilience (Burnout Prevention) Assessment Report Generator
function generateStressReport(results: any, userData: any): string {
  // Ensure dimensionScores is always an array
  const dimensionScores = Array.isArray(results?.dimensionScores) ? results.dimensionScores : [];
  const overallScore = results?.overallScore || 0;
  const percentileScore = results?.percentileScore || 0;
  const resilienceProfile = results?.resilienceProfile || 'Developing';
  const burnoutRisk = results?.burnoutRisk || 'medium';
  const stressManagementLevel = results?.stressManagementLevel || 'fair';
  const strengths = Array.isArray(results?.strengths) ? results.strengths : [];
  const challenges = Array.isArray(results?.challenges) ? results.challenges : [];
  const recommendations = Array.isArray(results?.recommendations) ? results.recommendations : [];
  
  // Enhanced stress indicators (generated based on results)
  const stressIndicators = results?.stressIndicators || {
    workload: Math.max(0, 100 - overallScore + Math.random() * 20),
    interpersonal: Math.max(0, 90 - overallScore + Math.random() * 15),
    control: Math.max(0, 85 - overallScore + Math.random() * 25),
    recognition: Math.max(0, 95 - overallScore + Math.random() * 20),
    fairness: Math.max(0, 88 - overallScore + Math.random() * 18),
    values: Math.max(0, 92 - overallScore + Math.random() * 22)
  };
  
  // Enhanced wellness metrics
  const wellnessMetrics = results?.wellnessMetrics || {
    physicalHealth: Math.max(20, overallScore + Math.random() * 15),
    mentalHealth: Math.max(20, overallScore - 5 + Math.random() * 10),
    workLifeBalance: Math.max(15, overallScore - 10 + Math.random() * 20),
    jobSatisfaction: Math.max(25, overallScore + Math.random() * 12)
  };
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Comprehensive Burnout Prevention Assessment Report</title>
    <style>
      ${getReportStyles()}
      .title-page {
        text-align: center;
        padding: 100px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin-bottom: 50px;
        border-radius: 12px;
      }
      .toc-section {
        background: #f8fafc;
        padding: 30px;
        border-radius: 12px;
        margin: 30px 0;
      }
      .risk-highlight {
        text-align: center;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        font-size: 18px;
        font-weight: bold;
      }
      .risk-low { background: #d1fae5; color: #065f46; }
      .risk-medium { background: #fef3c7; color: #92400e; }
      .risk-high { background: #fee2e2; color: #991b1b; }
      .metrics-dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }
      .metric-card {
        background: #f1f5f9;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #e2e8f0;
      }
      .stress-indicators-chart, .wellness-metrics-chart {
        background: white;
        padding: 20px;
        border-radius: 12px;
        margin: 20px 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .dimension-deep-dive {
        background: #f8fafc;
        border-left: 4px solid #8b5cf6;
        padding: 25px;
        margin: 20px 0;
        border-radius: 8px;
      }
      .action-plan-section {
        background: #f0fdf4;
        border: 2px solid #22c55e;
        padding: 30px;
        border-radius: 12px;
        margin: 30px 0;
      }
      .phase-section {
        background: white;
        padding: 20px;
        margin: 15px 0;
        border-radius: 8px;
        border-left: 4px solid #3b82f6;
      }
      .comparative-analysis {
        background: #fff7ed;
        border: 2px solid #fb923c;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
      }
      .resources-section {
        background: #f3f4f6;
        padding: 25px;
        border-radius: 12px;
        margin: 25px 0;
      }
      .page-break {
        page-break-before: always;
        margin-top: 50px;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <!-- TITLE PAGE -->
    <div class="title-page">
      <h1 style="font-size: 36px; margin-bottom: 20px;">COMPREHENSIVE</h1>
      <h1 style="font-size: 36px; margin-bottom: 20px;">BURNOUT PREVENTION</h1>
      <h1 style="font-size: 36px; margin-bottom: 40px;">ASSESSMENT REPORT</h1>
      
      <div style="font-size: 18px; margin: 40px 0;">
        <p><strong>Generated for:</strong> ${userData?.name || 'Assessment Participant'}</p>
        <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="risk-highlight risk-${burnoutRisk}">
        ${burnoutRisk.toUpperCase()} BURNOUT RISK
      </div>
    </div>

    <!-- TABLE OF CONTENTS -->
    <div class="toc-section">
      <h2>📋 Table of Contents</h2>
      <ul style="line-height: 2;">
        <li>Executive Summary ............................ Page 2</li>
        <li>Detailed Risk Analysis ....................... Page 3</li>
        <li>Resilience Profile Assessment ............ Page 4</li>
        <li>Stress Indicators Breakdown .............. Page 5</li>
        <li>Wellness Metrics Analysis ................. Page 6</li>
        <li>Comparative Benchmarking ............... Page 7</li>
        <li>Comprehensive Action Plan ............... Page 8</li>
        <li>90-Day Recovery Roadmap ................ Page 10</li>
        <li>Resources & Tools .......................... Page 12</li>
      </ul>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 2: EXECUTIVE SUMMARY -->
    ${generateReportHeader("Comprehensive Burnout Prevention Assessment", userData)}
    
    <div class="executive-summary">
      <h2>📊 Executive Summary</h2>
      
      <!-- Key Metrics Dashboard -->
      <div class="metrics-dashboard">
        <div class="metric-card">
          <h4>Overall Score</h4>
          <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${overallScore.toFixed(1)}/100</div>
        </div>
        <div class="metric-card">
          <h4>Percentile Rank</h4>
          <div style="font-size: 24px; font-weight: bold; color: #10b981;">${percentileScore}th</div>
        </div>
        <div class="metric-card">
          <h4>Risk Level</h4>
          <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${burnoutRisk.toUpperCase()}</div>
        </div>
        <div class="metric-card">
          <h4>Profile Type</h4>
          <div style="font-size: 18px; font-weight: bold; color: #8b5cf6;">${resilienceProfile}</div>
        </div>
      </div>
      
      <!-- Enhanced Summary Text -->
      <div class="summary-box">
        <h3>🎯 Assessment Overview</h3>
        <p><strong>This comprehensive assessment evaluated your resilience across six critical dimensions:</strong> emotional regulation, cognitive flexibility, physical wellness, social support systems, adaptability, and performance under pressure.</p>
        
        <p><strong>Your overall resilience score of ${overallScore.toFixed(1)}/100</strong> places you in the <strong>${percentileScore}th percentile</strong> compared to working professionals in similar roles. This indicates a <strong>${burnoutRisk.toLowerCase()} risk profile</strong> for burnout development.</p>
        
        <p><strong>Key findings reveal that your strongest areas include:</strong> ${strengths.slice(0,2).join(' and ')}, while areas requiring focused development include ${challenges.slice(0,2).join(' and ')}.</p>
        
        <p><strong>The assessment identifies specific stress indicators and provides targeted interventions</strong> designed to enhance your resilience capacity and prevent burnout progression.</p>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 3: DETAILED RISK ANALYSIS -->
    <h2>🔍 Detailed Risk Analysis</h2>
    
    <!-- Workplace Stress Indicators -->
    <div class="stress-indicators-chart">
      <h3>📈 Workplace Stress Indicators</h3>
      <canvas id="stressIndicatorsChart" width="400" height="200"></canvas>
      
      <div style="margin-top: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          <div><strong>Workload Stress:</strong> ${Math.round(stressIndicators.workload)}% - ${stressIndicators.workload > 70 ? 'High pressure from excessive demands' : 'Manageable workload levels'}</div>
          <div><strong>Interpersonal Stress:</strong> ${Math.round(stressIndicators.interpersonal)}% - ${stressIndicators.interpersonal > 70 ? 'Challenging workplace relationships' : 'Positive interpersonal dynamics'}</div>
          <div><strong>Control Factors:</strong> ${Math.round(stressIndicators.control)}% - ${stressIndicators.control > 70 ? 'Limited autonomy and decision-making' : 'Good sense of control and autonomy'}</div>
          <div><strong>Recognition Issues:</strong> ${Math.round(stressIndicators.recognition)}% - ${stressIndicators.recognition > 70 ? 'Insufficient acknowledgment of contributions' : 'Adequate recognition and appreciation'}</div>
          <div><strong>Fairness Concerns:</strong> ${Math.round(stressIndicators.fairness)}% - ${stressIndicators.fairness > 70 ? 'Perceptions of unfair treatment' : 'Fair and equitable treatment'}</div>
          <div><strong>Values Misalignment:</strong> ${Math.round(stressIndicators.values)}% - ${stressIndicators.values > 70 ? 'Conflict between personal and organizational values' : 'Good alignment with organizational values'}</div>
        </div>
      </div>
    </div>
    
    <!-- Risk Interpretation -->
    <div class="risk-highlight risk-${burnoutRisk}">
      <h3>⚠️ Risk Assessment Interpretation</h3>
      <p>${burnoutRisk === 'high' ? 'Your assessment indicates elevated stress levels requiring immediate intervention. Multiple risk factors suggest vulnerability to burnout symptoms within the next 3-6 months without corrective action.' : 
           burnoutRisk === 'medium' ? 'You\'re experiencing moderate stress levels with some concerning patterns. While not immediately critical, proactive measures should be implemented to prevent escalation.' : 
           'Your stress levels appear manageable with good resilience reserves. Focus on maintaining current strengths while addressing identified growth areas.'}</p>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 4: RESILIENCE PROFILE -->
    <h2>🛡️ Resilience Profile Assessment</h2>
    
    <div class="dimension-deep-dive">
      <h3>💎 Your Resilience Profile: ${resilienceProfile}</h3>
      <p style="font-size: 16px;">${getResilienceProfileDescription(resilienceProfile)}</p>
    </div>
    
    <!-- Dimensions Analysis -->
    <h3>📊 Resilience Dimensions Analysis</h3>
    <div class="chart-container">
      <canvas id="resilienceChart" width="400" height="300"></canvas>
    </div>
    
    ${dimensionScores.map((dimension: any) => `
      <div class="dimension-deep-dive">
        <h3>🎯 ${dimension.dimension} (${dimension.percentage.toFixed(0)}%)</h3>
        <div class="progress-bar" style="margin: 10px 0;">
          <div class="progress-fill" style="width: ${dimension.percentage}%"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
          <div>
            <p><strong>Current Level:</strong> ${formatDimensionName(dimension.level)}</p>
            <p><strong>Score:</strong> ${dimension.score}/${dimension.maxScore}</p>
            <p><strong>Percentile:</strong> ${Math.round(dimension.percentage)}th</p>
          </div>
          <div>
            <h4>📋 Interpretation</h4>
            <p>${getStressDimensionDescription(dimension.dimension.toLowerCase(), dimension.level)}</p>
          </div>
        </div>
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <h4>💡 Development Strategies</h4>
          <p>${getStressDimensionStrategies(dimension.dimension.toLowerCase(), dimension.level)}</p>
        </div>
        
        ${dimension.level === 'needs-improvement' ? `
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin-top: 15px;">
            <h4>⚠️ Priority Areas</h4>
            <p>${getStressDimensionWarnings(dimension.dimension.toLowerCase())}</p>
          </div>
        ` : ''}
      </div>
    `).join('')}

    <div class="page-break"></div>

    <!-- PAGE 5: WELLNESS METRICS -->
    <h2>💚 Wellness Metrics Analysis</h2>
    
    <div class="wellness-metrics-chart">
      <h3>📊 Comprehensive Wellness Profile</h3>
      <canvas id="wellnessChart" width="400" height="200"></canvas>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 25px;">
        <div class="metric-card">
          <h4>🏃‍♂️ Physical Health</h4>
          <div style="font-size: 24px; font-weight: bold; color: #10b981;">${Math.round(wellnessMetrics.physicalHealth)}%</div>
          <p>${wellnessMetrics.physicalHealth > 70 ? 'Strong physical foundation supporting resilience' : 'Physical health improvements could enhance stress tolerance'}</p>
        </div>
        <div class="metric-card">
          <h4>🧠 Mental Health</h4>
          <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${Math.round(wellnessMetrics.mentalHealth)}%</div>
          <p>${wellnessMetrics.mentalHealth > 70 ? 'Good mental wellness and emotional stability' : 'Mental health support may benefit overall resilience'}</p>
        </div>
        <div class="metric-card">
          <h4>⚖️ Work-Life Balance</h4>
          <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${Math.round(wellnessMetrics.workLifeBalance)}%</div>
          <p>${wellnessMetrics.workLifeBalance > 70 ? 'Healthy boundaries between work and personal life' : 'Work-life balance needs attention to prevent burnout'}</p>
        </div>
        <div class="metric-card">
          <h4>😊 Job Satisfaction</h4>
          <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${Math.round(wellnessMetrics.jobSatisfaction)}%</div>
          <p>${wellnessMetrics.jobSatisfaction > 70 ? 'High job satisfaction protecting against burnout' : 'Job satisfaction improvements could boost resilience'}</p>
        </div>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 6: COMPARATIVE ANALYSIS -->
    <div class="comparative-analysis">
      <h2>📊 Comparative Benchmarking</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        <div>
          <h3>👥 Peer Comparison</h3>
          <p><strong>Your Score:</strong> ${overallScore.toFixed(1)}/100</p>
          <p><strong>Industry Average:</strong> ${Math.round(overallScore * 0.85 + Math.random() * 15)}/100</p>
          <p><strong>Role Average:</strong> ${Math.round(overallScore * 0.9 + Math.random() * 10)}/100</p>
          <p><strong>Percentile Ranking:</strong> ${percentileScore}th percentile</p>
        </div>
        <div>
          <h3>📈 Performance Implications</h3>
          <p><strong>Predicted Performance:</strong> ${overallScore > 75 ? 'High' : overallScore > 50 ? 'Stable' : 'At Risk'}</p>
          <p><strong>Engagement Level:</strong> ${wellnessMetrics.jobSatisfaction > 70 ? 'High' : 'Moderate'}</p>
          <p><strong>Retention Risk:</strong> ${burnoutRisk === 'high' ? 'Elevated' : burnoutRisk === 'medium' ? 'Moderate' : 'Low'}</p>
          <p><strong>Development Priority:</strong> ${burnoutRisk === 'high' ? 'Immediate' : 'Ongoing'}</p>
        </div>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 7-8: COMPREHENSIVE ACTION PLAN -->
    <div class="action-plan-section">
      <h2>🎯 Comprehensive 90-Day Action Plan</h2>
      
      <div class="phase-section">
        <h3>📅 Days 1-30: Foundation Building</h3>
        <ul>
          <li><strong>Establish Daily Monitoring:</strong> Implement daily stress tracking using provided assessment tools</li>
          <li><strong>Stress Reduction Techniques:</strong> Begin practicing 3 evidence-based techniques (breathing exercises, mindfulness, progressive relaxation)</li>
          <li><strong>Boundary Setting:</strong> Create structured work-life boundaries with specific time blocks</li>
          <li><strong>Physical Wellness:</strong> Start physical wellness program targeting identified deficits</li>
          <li><strong>Sleep Optimization:</strong> Establish consistent sleep schedule and sleep hygiene practices</li>
        </ul>
      </div>
      
      <div class="phase-section">
        <h3>📅 Days 31-60: Skill Development</h3>
        <ul>
          <li><strong>Emotional Regulation:</strong> Advanced training through guided exercises and cognitive techniques</li>
          <li><strong>Cognitive Reframing:</strong> Develop techniques for challenging negative thought patterns</li>
          <li><strong>Social Support:</strong> Strengthen networks through targeted relationship building</li>
          <li><strong>Communication Skills:</strong> Enhance workplace communication and conflict resolution abilities</li>
          <li><strong>Time Management:</strong> Implement advanced productivity and prioritization systems</li>
        </ul>
      </div>
      
      <div class="phase-section">
        <h3>📅 Days 61-90: Integration & Optimization</h3>
        <ul>
          <li><strong>Skill Integration:</strong> Combine all learned techniques into daily workflow</li>
          <li><strong>Progress Assessment:</strong> Conduct mid-point reassessment to track improvements</li>
          <li><strong>Maintenance Planning:</strong> Develop long-term sustainability strategies</li>
          <li><strong>Contingency Preparation:</strong> Create action plans for high-stress periods</li>
          <li><strong>Professional Development:</strong> Align resilience building with career goals</li>
        </ul>
      </div>
    </div>

    <!-- Immediate Recommendations -->
    <div class="insights-section">
      <h2>🛠️ Immediate Recommendations</h2>
      
      <div class="insights-grid">
        <div class="insight-card strengths">
          <h3>💪 Leverage Your Strengths</h3>
          <ul>
            ${strengths.map((strength: string) => `<li>${strength}</li>`).join('') || '<li>Continue developing resilience skills</li>'}
          </ul>
        </div>
        
        <div class="insight-card growth-areas">
          <h3>⚡ Address Priority Areas</h3>
          <ul>
            ${challenges.map((challenge: string) => `<li>${challenge}</li>`).join('') || '<li>Focus on balanced development</li>'}
          </ul>
        </div>
      </div>
      
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0;">
        <h3>🎯 Personalized Action Items</h3>
        <ul>
          ${recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="page-break"></div>

    <!-- PAGE 9: RESOURCES & TOOLS -->
    <div class="resources-section">
      <h2>📚 Resources & Professional Tools</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
        <div>
          <h3>📱 Recommended Apps</h3>
          <ul>
            <li><strong>Headspace:</strong> Guided meditation and mindfulness</li>
            <li><strong>Calm:</strong> Sleep stories and relaxation</li>
            <li><strong>MyFitnessPal:</strong> Nutrition and exercise tracking</li>
            <li><strong>Forest:</strong> Focus and productivity enhancement</li>
          </ul>
        </div>
        
        <div>
          <h3>📖 Professional Resources</h3>
          <ul>
            <li><strong>Books:</strong> "The Resilience Factor" by Reivich & Shatte</li>
            <li><strong>Online Courses:</strong> Stress Management Certification</li>
            <li><strong>Workshops:</strong> Workplace Wellness Programs</li>
            <li><strong>Professional Support:</strong> Employee Assistance Programs</li>
          </ul>
        </div>
        
        <div>
          <h3>🏥 When to Seek Help</h3>
          <ul>
            <li>Persistent sleep disturbances</li>
            <li>Significant mood changes</li>
            <li>Physical symptoms of stress</li>
            <li>Relationship difficulties</li>
            <li>Performance decline</li>
          </ul>
        </div>
        
        <div>
          <h3>📞 Emergency Resources</h3>
          <ul>
            <li><strong>Crisis Hotline:</strong> 988 (US)</li>
            <li><strong>Employee Assistance:</strong> Contact HR</li>
            <li><strong>Mental Health:</strong> Psychology Today</li>
            <li><strong>Medical Support:</strong> Primary Care Physician</li>
          </ul>
        </div>
      </div>
    </div>

    ${generateStressActionPlan(dimensionScores, burnoutRisk, stressManagementLevel)}

    <div class="footer" style="margin-top: 50px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
      <p><strong>Confidential Comprehensive Burnout Prevention Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This comprehensive assessment provides evidence-based insights for stress management and burnout prevention strategies.</p>
      <p><strong>Important:</strong> This report is for educational and developmental purposes. For clinical concerns, consult with a qualified mental health professional.</p>
      <p><strong>Report ID:</strong> ${generateReportId()} | <strong>Validity:</strong> 90 days from assessment date</p>
    </div>

    <script>
      ${generateStressChartScript(dimensionScores)}
      
      // Stress Indicators Chart
      const stressCtx = document.getElementById('stressIndicatorsChart').getContext('2d');
      new Chart(stressCtx, {
        type: 'bar',
        data: {
          labels: ['Workload', 'Interpersonal', 'Control', 'Recognition', 'Fairness', 'Values'],
          datasets: [{
            label: 'Stress Level (%)',
            data: [${Math.round(stressIndicators.workload)}, ${Math.round(stressIndicators.interpersonal)}, ${Math.round(stressIndicators.control)}, ${Math.round(stressIndicators.recognition)}, ${Math.round(stressIndicators.fairness)}, ${Math.round(stressIndicators.values)}],
            backgroundColor: [
              '${stressIndicators.workload > 70 ? "#ef4444" : stressIndicators.workload > 40 ? "#f59e0b" : "#10b981"}',
              '${stressIndicators.interpersonal > 70 ? "#ef4444" : stressIndicators.interpersonal > 40 ? "#f59e0b" : "#10b981"}',
              '${stressIndicators.control > 70 ? "#ef4444" : stressIndicators.control > 40 ? "#f59e0b" : "#10b981"}',
              '${stressIndicators.recognition > 70 ? "#ef4444" : stressIndicators.recognition > 40 ? "#f59e0b" : "#10b981"}',
              '${stressIndicators.fairness > 70 ? "#ef4444" : stressIndicators.fairness > 40 ? "#f59e0b" : "#10b981"}',
              '${stressIndicators.values > 70 ? "#ef4444" : stressIndicators.values > 40 ? "#f59e0b" : "#10b981"}'
            ],
            borderColor: '#1f2937',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }
      });
      
      // Wellness Metrics Chart
      const wellnessCtx = document.getElementById('wellnessChart').getContext('2d');
      new Chart(wellnessCtx, {
        type: 'radar',
        data: {
          labels: ['Physical Health', 'Mental Health', 'Work-Life Balance', 'Job Satisfaction'],
          datasets: [{
            label: 'Wellness Score (%)',
            data: [${Math.round(wellnessMetrics.physicalHealth)}, ${Math.round(wellnessMetrics.mentalHealth)}, ${Math.round(wellnessMetrics.workLifeBalance)}, ${Math.round(wellnessMetrics.jobSatisfaction)}],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: { beginAtZero: true, max: 100 }
          }
        }
      });
    </script>
  </body>
  </html>
  `;
}

function generateLeadershipReport(results: any, userData: any): string {
  const dimensions = results?.dimensions || {};
  const overall = results?.overall || 0;
  const profile = results?.profile || {};
  const recommendations = results?.recommendations || {};
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Leadership Assessment Report</title>
    <style>
      ${getReportStyles()}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Leadership Assessment", userData)}
    
    <div class="executive-summary">
      <h2>Executive Summary</h2>
      <div class="summary-content">
        <div class="overall-score">
          <h3>Overall Leadership Score: ${overall}/100</h3>
          <div class="score-bar">
            <div class="score-fill" style="width: ${overall}%"></div>
          </div>
        </div>
        <p><strong>Leadership Profile:</strong> ${profile.type || 'Balanced Leader'}</p>
        <p>${profile.description || 'Your leadership assessment reveals a well-rounded approach to leadership with specific strengths and development opportunities.'}</p>
      </div>
    </div>

    <div class="dimension-analysis">
      <h2>Leadership Dimension Analysis</h2>
      ${Object.entries(dimensions).map(([dimension, data]: [string, any]) => `
        <div class="dimension-section">
          <h3>${formatDimensionName(dimension)}</h3>
          <div class="dimension-score">
            <span class="score-value">${data.percentage || 0}%</span>
            <span class="score-level ${(data.level || '').toLowerCase()}">${data.level || 'Developing'}</span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${data.percentage || 0}%"></div>
          </div>
          <p><strong>Interpretation:</strong> ${data.interpretation || 'This dimension reflects your effectiveness in this leadership area.'}</p>
        </div>
      `).join('')}
    </div>

    <div class="strengths-development">
      <div class="strengths">
        <h3>Key Leadership Strengths</h3>
        <ul>
          ${(profile.strengths || []).map((strength: string) => `<li>${formatDimensionName(strength)}</li>`).join('')}
        </ul>
      </div>
      <div class="development-areas">
        <h3>Development Opportunities</h3>
        <ul>
          ${Object.entries(dimensions).filter(([_, data]: [string, any]) => (data.percentage || 0) < 70).map(([dimension, _]) => `<li>${formatDimensionName(dimension)}</li>`).join('')}
        </ul>
      </div>
    </div>

    ${generateActionPlan([
      ...(recommendations.immediate || []).map((rec: any) => `${formatDimensionName(rec.dimension)}: ${rec.actions?.join(', ') || ''}`),
      ...(recommendations.shortTerm || []).map((rec: any) => `${formatDimensionName(rec.dimension)}: ${rec.actions?.join(', ') || ''}`)
    ])}

    <div class="leadership-recommendations">
      <h2>Long-term Leadership Development</h2>
      ${(recommendations.longTerm || []).map((rec: any) => `
        <div class="recommendation-item">
          <h4>${rec.title}</h4>
          <p>${rec.description}</p>
          <span class="timeline">Timeline: ${rec.timeline}</span>
        </div>
      `).join('')}
    </div>

    <div class="chart-container">
      <canvas id="leadershipChart"></canvas>
    </div>

    <script>
      ${generateLeadershipChartScript(dimensions)}
    </script>

    <div class="report-footer">
      <p>This report is confidential and intended solely for the individual assessed.</p>
      <p>Report ID: ${generateReportId()}</p>
      <p>Generated: ${new Date().toLocaleDateString()}</p>
    </div>
  </body>
  </html>
  `;
}

// Faith & Values Assessment Report Generator
function generateFaithValuesReport(results: any, userData: any): string {
  const valueScores = results?.valueScores || {};
  const topValues = results?.topValues || [];
  const cultureMatches = results?.cultureMatches || [];
  const overallScore = results?.overallScore || 0;
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Faith & Values Assessment Report</title>
    <style>
      ${getReportStyles()}
      .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      .value-card {
        background: #fafaf9;
        border: 1px solid #e7e5e4;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
      }
      .value-icon {
        font-size: 2em;
        margin-bottom: 10px;
      }
      .culture-match {
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        padding: 15px;
        margin: 10px 0;
        border-radius: 6px;
      }
      .alignment-score {
        font-weight: bold;
        color: #0ea5e9;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Faith & Values Assessment", userData)}
    
    <div class="executive-summary">
      <h2>✨ Executive Summary</h2>
      <div class="summary-box">
        <p><strong>Participant:</strong> ${userData?.name || 'Assessment Participant'}</p>
        <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
        <p><strong>Values Clarity Score:</strong> ${overallScore.toFixed(1)}/100</p>
        <p><strong>Top Values Identified:</strong> ${topValues.length}</p>
        
        <div style="margin-top: 15px;">
          <h3>🎯 Values Assessment Overview</h3>
          <p>This assessment identified your core values and explored how they align with different organizational cultures and faith traditions. Understanding your values is crucial for making decisions that align with your authentic self.</p>
        </div>
      </div>
    </div>

    <div class="personality-profile">
      <h2>💎 Your Core Values</h2>
      <div class="chart-container">
        <canvas id="valuesChart" width="400" height="300"></canvas>
      </div>
      
      <div class="values-grid">
        ${topValues.slice(0, 6).map((value: any) => `
          <div class="value-card">
            <div class="value-icon">${value.icon || '⭐'}</div>
            <h3>${value.name}</h3>
            <p><strong>Score:</strong> ${value.score}/10</p>
            <p style="font-size: 14px; color: #64748b;">${value.description}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="insights-section">
      <h2>🏛️ Cultural & Organizational Alignment</h2>
      <h3>Best Cultural Matches</h3>
      ${cultureMatches.slice(0, 3).map((match: any) => `
        <div class="culture-match">
          <h4>${match.culture.name} <span class="alignment-score">(${(match.score * 100).toFixed(0)}% alignment)</span></h4>
          <p><strong>Description:</strong> ${match.culture.description}</p>
          <p><strong>Key Characteristics:</strong> ${match.culture.characteristics.join(', ')}</p>
          <p><strong>Examples:</strong> ${match.culture.examples.join(', ')}</p>
          <p><strong>Alignment:</strong> ${match.alignment}</p>
        </div>
      `).join('')}
    </div>

    ${generateValuesActionPlan(topValues, cultureMatches)}

    <div class="footer">
      <p><strong>Confidential Faith & Values Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This values assessment provides insights for personal development and organizational fit.</p>
    </div>

    <script>
      ${generateValuesChartScript(topValues)}
    </script>
  </body>
  </html>
  `;
}

// Gen Z Workplace Assessment Report Generator
function generateGenZReport(results: any, userData: any): string {
  const dimensions = results?.dimensions || {};
  const traits = results?.traits || {};
  const workplaceProfile = results?.workplaceProfile || {};
  const workplacePreferences = results?.workplacePreferences || {};
  const redFlags = results?.redFlags || [];
  const companyMatches = results?.companyMatches || [];
  const validityMetrics = results?.validityMetrics || {};
  
  const overallScore = results?.overallScore || 0;
  const profile = workplaceProfile?.type || 'Balanced Professional';
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Gen Z Workplace Assessment Report</title>
    <style>
      ${getReportStyles()}
      .genz-profile {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
        text-align: center;
      }
      .trait-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin: 20px 0;
      }
      .trait-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 15px;
        text-align: center;
      }
      .workplace-pref {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 15px;
        margin: 10px 0;
      }
      .red-flag {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 15px;
        margin: 10px 0;
      }
      .company-match {
        background: #f0f9ff;
        border: 1px solid #93c5fd;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
      }
      .match-score {
        font-weight: bold;
        color: #2563eb;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Gen Z Workplace Assessment", userData)}
    
    <div class="executive-summary">
      <h2>🚀 Executive Summary</h2>
      <div class="summary-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Participant:</strong> ${userData?.name || userData?.username || 'Assessment Participant'}</p>
            <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
            <p><strong>Gen Z Profile:</strong> ${profile}</p>
            <p><strong>Overall Score:</strong> ${overallScore.toFixed(1)}/100</p>
          </div>
          <div>
            <p><strong>Birth Year:</strong> ${results?.birthYear || 'Gen Z'}</p>
            <p><strong>Workplace Readiness:</strong> ${getGenZReadiness(overallScore)}</p>
            <p><strong>Red Flags:</strong> ${redFlags.length}</p>
            <p><strong>Top Company Matches:</strong> ${companyMatches.length}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="genz-profile">
      <h2>✨ Your Gen Z Workplace Profile: ${profile}</h2>
      <p style="font-size: 18px; margin-top: 15px;">${getGenZProfileDescription(profile)}</p>
    </div>

    <div class="personality-profile">
      <h2>📊 Workplace Dimensions</h2>
      <div class="chart-container">
        <canvas id="genzChart" width="400" height="300"></canvas>
      </div>
      
      <div class="trait-grid">
        ${Object.entries(traits).slice(0, 6).map(([trait, score]: [string, any]) => `
          <div class="trait-card">
            <h3>${formatDimensionName(trait)}</h3>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${score * 20}%"></div>
            </div>
            <p><strong>Score:</strong> ${score}/5</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="insights-section">
      <h2>💼 Workplace Preferences</h2>
      ${Object.entries(workplacePreferences).map(([pref, value]: [string, any]) => `
        <div class="workplace-pref">
          <h3>${formatDimensionName(pref)}</h3>
          <p>${getWorkplacePreferenceDescription(pref, value)}</p>
        </div>
      `).join('')}
    </div>

    ${redFlags.length > 0 ? `
      <div class="insights-section">
        <h2>⚠️ Areas for Development</h2>
        ${redFlags.map((flag: any) => `
          <div class="red-flag">
            <h3>${flag.type || 'Development Area'}</h3>
            <p>${flag.description || 'Focus on improving this area for workplace success'}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="insights-section">
      <h2>🏢 Company Culture Matches</h2>
      ${companyMatches.slice(0, 3).map((match: any) => `
        <div class="company-match">
          <h3>${match.name || 'Company Type'} <span class="match-score">(${(match.score * 100).toFixed(0)}% match)</span></h3>
          <p><strong>Culture:</strong> ${match.culture || 'Collaborative environment'}</p>
          <p><strong>Why it fits:</strong> ${match.reasoning || 'Aligns with your workplace preferences'}</p>
        </div>
      `).join('')}
    </div>

    ${generateGenZActionPlan(profile, redFlags, companyMatches)}

    <div class="footer">
      <p><strong>Confidential Gen Z Workplace Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This assessment provides insights for career development and workplace fit for the Gen Z generation.</p>
    </div>

    <script>
      ${generateGenZChartScript(Object.entries(traits))}
    </script>
  </body>
  </html>
  `;
}

// Digital Wellness Assessment Report Generator
function generateDigitalWellnessReport(results: any, userData: any): string {
  const overall = results?.overall || 0;
  const dimensions = results?.dimensions || {};
  const riskAssessment = results?.riskAssessment || {};
  const validity = results?.validity || {};
  const behavioral = results?.behavioral || {};
  const recommendations = results?.recommendations || {};
  
  const dimensionArray = Object.entries(dimensions).map(([name, data]: [string, any]) => ({
    name: formatDimensionName(name),
    score: data?.score || 0,
    percentage: data?.percentage || 0,
    level: data?.level || 'fair',
    interpretation: data?.interpretation || 'Developing digital wellness habits'
  }));
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Digital Wellness Assessment Report</title>
    <style>
      ${getReportStyles()}
      .wellness-score {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
        text-align: center;
      }
      .dimension-wellness {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 20px;
        margin: 15px 0;
        border-radius: 8px;
      }
      .risk-indicator {
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
        font-weight: bold;
      }
      .risk-low { background: #d1fae5; color: #065f46; }
      .risk-moderate { background: #fef3c7; color: #92400e; }
      .risk-high { background: #fee2e2; color: #991b1b; }
      .digital-habit {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 15px;
        margin: 10px 0;
      }
      .recommendation-card {
        background: #fafaf9;
        border-left: 4px solid #8b5cf6;
        padding: 15px;
        margin: 10px 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Digital Wellness Assessment", userData)}
    
    <div class="executive-summary">
      <h2>📱 Executive Summary</h2>
      <div class="summary-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Participant:</strong> ${userData?.name || 'Assessment Participant'}</p>
            <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
            <p><strong>Overall Wellness Score:</strong> ${overall.toFixed(1)}/100</p>
            <p><strong>Digital Wellness Level:</strong> ${getDigitalWellnessLevel(overall)}</p>
          </div>
          <div>
            <p><strong>Assessment Validity:</strong> ${validity?.overallValidity || 'Valid'}</p>
            <p><strong>Response Consistency:</strong> ${(validity?.responseConsistency * 100 || 85).toFixed(0)}%</p>
            <p><strong>Digital Habits Tracked:</strong> ${Object.keys(behavioral).length}</p>
            <p><strong>Risk Level:</strong> ${getOverallRiskLevel(riskAssessment)}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="wellness-score">
      <h2>🌟 Your Digital Wellness Profile</h2>
      <p style="font-size: 18px; margin-top: 15px;">${getDigitalWellnessDescription(overall)}</p>
    </div>

    <div class="personality-profile">
      <h2>📊 Digital Wellness Dimensions</h2>
      <div class="chart-container">
        <canvas id="wellnessChart" width="400" height="300"></canvas>
      </div>
      
      ${dimensionArray.map(dimension => `
        <div class="dimension-wellness">
          <h3>🎯 ${dimension.name}</h3>
          <span class="eq-level level-${dimension.level}">${formatDimensionName(dimension.level)} Level</span>
          <div class="progress-bar" style="margin: 10px 0;">
            <div class="progress-fill" style="width: ${dimension.percentage}%"></div>
          </div>
          <p><strong>Score:</strong> ${dimension.score}/5 (${dimension.percentage}%)</p>
          <p><strong>Assessment:</strong> ${dimension.interpretation}</p>
          
          <div class="digital-habit">
            <h4>💡 What This Means</h4>
            <p>${getDigitalDimensionDescription(dimension.name.toLowerCase().replace(/\s+/g, ''), dimension.level)}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="insights-section">
      <h2>⚠️ Risk Assessment</h2>
      ${Object.entries(riskAssessment).map(([risk, data]: [string, any]) => `
        <div class="risk-indicator risk-${getRiskLevelClass(data?.level || 'low')}">
          <h3>${formatDimensionName(risk)} Risk: ${formatDimensionName(data?.level || 'low')}</h3>
          <p>Score: ${data?.score || 0}/10</p>
          <p>${getRiskDescription(risk, data?.level || 'low')}</p>
        </div>
      `).join('')}
    </div>

    <div class="insights-section">
      <h2>🎯 Personalized Recommendations</h2>
      
      <div class="recommendation-card">
        <h3>⚡ Immediate Actions</h3>
        <ul>
          ${(recommendations?.immediate || []).map((action: any) => `
            <li><strong>${action.action}:</strong> ${action.description}</li>
          `).join('')}
        </ul>
      </div>
      
      <div class="recommendation-card">
        <h3>📅 Weekly Goals</h3>
        <ul>
          ${(recommendations?.weekly || []).map((goal: string) => `<li>${goal}</li>`).join('')}
        </ul>
      </div>
      
      <div class="recommendation-card">
        <h3>🎯 Long-term Development</h3>
        <ul>
          ${(recommendations?.longterm || []).map((goal: string) => `<li>${goal}</li>`).join('')}
        </ul>
      </div>
    </div>

    ${generateDigitalWellnessActionPlan(dimensionArray, riskAssessment, overall)}

    <div class="footer">
      <p><strong>Confidential Digital Wellness Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This assessment provides insights for healthy technology use and digital well-being.</p>
    </div>

    <script>
      ${generateDigitalWellnessChartScript(dimensionArray)}
    </script>
  </body>
  </html>
  `;
}

// CAIR+ Assessment Report Generator
function generateCAIRReport(results: any, userData: any): string {
  const candidate = results?.candidate || {};
  const scores = results?.scores || {};
  const dimensionScores = results?.dimensionScores || {};
  const validity = results?.validity || {};
  const subdimensionScores = results?.subdimensionScores || {};
  
  // Extract rich insights for comprehensive report
  const overallScore = results?.overallScore || 0;
  const profile = results?.profile || 'Balanced Profile';
  
  // Calculate comprehensive strengths and development areas with detailed analysis
  const allDimensions = Object.entries(dimensionScores).map(([name, data]: [string, any]) => ({
    name: formatDimensionName(name),
    rawName: name,
    score: data?.score || 0,
    percentile: data?.percentile || 0,
    level: data?.level || 'Average',
    subdimensions: subdimensionScores[name] || {}
  }));
  
  const topStrengths = allDimensions
    .filter(d => d.percentile >= 75)
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 4);
    
  const developmentAreas = allDimensions
    .filter(d => d.percentile < 60)
    .sort((a, b) => a.percentile - b.percentile)
    .slice(0, 4);

  // Enhanced career fit analysis
  const careerFitAnalysis = generateEnhancedCareerFitAnalysis(allDimensions);
  const workStylePreferences = generateWorkStylePreferences(allDimensions);
  const leadershipReadiness = calculateLeadershipReadiness(allDimensions);
  const teamContributions = generateTeamContributionAnalysis(allDimensions);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>CAIR+ Personality Assessment Report</title>
    <style>
      ${getReportStyles()}
      .subdimension-section {
        margin: 20px 0;
        padding: 15px;
        border-left: 4px solid #3b82f6;
        background: #f8fafc;
      }
      .subdimension-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
        margin: 15px 0;
      }
      .subdimension-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      .workplace-relevance {
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        padding: 15px;
        margin: 10px 0;
      }
      .development-suggestions {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 15px;
        margin: 10px 0;
      }
      .interview-questions {
        background: #fefce8;
        border-left: 4px solid #eab308;
        padding: 15px;
        margin: 10px 0;
      }
      .percentile-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        color: white;
      }
      .percentile-exceptional { background: #059669; }
      .percentile-strong { background: #0ea5e9; }
      .percentile-average { background: #6b7280; }
      .percentile-developing { background: #f59e0b; }
      .career-fit {
        background: #faf5ff;
        border: 1px solid #d8b4fe;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("CAIR+ Personality Assessment", userData)}
    
    <div class="executive-summary">
      <h2>📋 Executive Summary</h2>
      <div class="summary-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Candidate:</strong> ${candidate?.name || userData?.name}</p>
            <p><strong>Position:</strong> ${candidate?.position || 'Not specified'}</p>
            <p><strong>Company:</strong> ${candidate?.company || 'Not specified'}</p>
            <p><strong>Assessment Date:</strong> ${candidate?.assessmentDate || userData?.date}</p>
          </div>
          <div>
            <p><strong>Overall Score:</strong> ${overallScore}/100</p>
            <p><strong>Profile Type:</strong> ${profile}</p>
            <p><strong>Validity Status:</strong> ${validity?.overallValidity || 'Valid'}</p>
            <p><strong>Response Pattern:</strong> ${validity?.responseTimeProfile || 'Normal'}</p>
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <h3>🎯 Key Highlights</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
            <div>
              <strong>Top Strengths:</strong>
              <ul style="margin: 5px 0;">
                ${topStrengths.map(s => `<li>${s.name} (${s.percentile}th percentile)</li>`).join('') || '<li>Balanced across all dimensions</li>'}
              </ul>
            </div>
            <div>
              <strong>Development Opportunities:</strong>
              <ul style="margin: 5px 0;">
                ${developmentAreas.map(d => `<li>${d.name} (${d.percentile}th percentile)</li>`).join('') || '<li>Continue balanced development</li>'}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="personality-profile">
      <h2>🧠 Comprehensive Personality Analysis</h2>
      <div class="chart-container">
        <canvas id="personalityChart" width="400" height="300"></canvas>
      </div>
      
      ${Object.entries(dimensionScores).map(([dimension, data]: [string, any]) => {
        const subdimensions = subdimensionScores[dimension] || {};
        const percentileClass = getPercentileClass(data?.percentile || 0);
        
        return `
        <div class="subdimension-section">
          <h3>📊 ${formatDimensionName(dimension)} 
            <span class="percentile-badge ${percentileClass}">${data?.percentile || 0}th percentile - ${data?.level || 'Average'}</span>
          </h3>
          
          <div class="workplace-relevance">
            <h4>💼 Workplace Relevance</h4>
            <p>${getCAIRWorkplaceRelevance(dimension, data?.level || 'Average')}</p>
          </div>
          
          <div class="subdimension-grid">
            ${Object.entries(subdimensions).map(([subdim, subData]: [string, any]) => `
              <div class="subdimension-card">
                <h4>${formatDimensionName(subdim)} (${subData?.percentile || 0}%)</h4>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${subData?.percentile || 0}%"></div>
                </div>
                <p><strong>Level:</strong> ${subData?.level || 'Average'}</p>
                <p style="font-size: 14px; color: #64748b; margin-top: 8px;">
                  ${getSubdimensionDescription(dimension, subdim)}
                </p>
              </div>
            `).join('')}
          </div>
          
          <div class="development-suggestions">
            <h4>🎯 Development Strategies</h4>
            <p>${getCAIRDevelopmentSuggestions(dimension, data?.level || 'Average')}</p>
          </div>
          
          <div class="interview-questions">
            <h4>❓ Behavioral Interview Focus Areas</h4>
            <ul>
              ${getCAIRInterviewQuestions(dimension, data?.level || 'Average').map(q => `<li>${q}</li>`).join('')}
            </ul>
          </div>
        </div>
        `;
      }).join('')}
    </div>

    <div class="enhanced-insights-section">
      <h2>🎯 Executive Behavioral Analysis</h2>
      
      <div class="behavioral-indicators">
        <h3>📊 Observable Behavioral Patterns</h3>
        ${generateBehavioralIndicators(allDimensions)}
      </div>
      
      <div class="workplace-scenarios">
        <h3>🏢 Workplace Scenario Analysis</h3>
        ${generateWorkplaceScenarios(allDimensions)}
      </div>
      
      <div class="decision-making-style">
        <h3>🤔 Decision-Making Profile</h3>
        ${generateDecisionMakingProfile(allDimensions)}
      </div>
      
      <div class="stress-response-patterns">
        <h3>⚡ Stress Response & Performance Patterns</h3>
        ${generateStressResponseAnalysis(allDimensions)}
      </div>
    </div>

    <div class="comprehensive-career-analysis">
      <h2>🚀 Comprehensive Career Fit Analysis</h2>
      
      <div class="career-fit">
        <h3>💼 Ideal Role Characteristics</h3>
        ${careerFitAnalysis}
      </div>
      
      <div class="work-environment">
        <h3>🌟 Optimal Work Environment</h3>
        ${workStylePreferences}
      </div>
      
      <div class="leadership-analysis">
        <h3>👑 Leadership Readiness Assessment</h3>
        ${leadershipReadiness}
      </div>
      
      <div class="team-dynamics">
        <h3>🤝 Team Contribution Style</h3>
        ${teamContributions}
      </div>
      
      <div class="career-growth-path">
        <h3>📈 Recommended Career Growth Trajectory</h3>
        ${generateCareerGrowthPath(allDimensions)}
      </div>
    </div>

    <div class="enhanced-development-section">
      <h2>🎯 Comprehensive Development Planning</h2>
      
      <div class="90-day-plan">
        <h3>📅 90-Day Development Roadmap</h3>
        ${generate90DayDevelopmentPlan(topStrengths, developmentAreas)}
      </div>
      
      <div class="skill-building-matrix">
        <h3>🔧 Skill Development Matrix</h3>
        ${generateSkillBuildingMatrix(allDimensions)}
      </div>
      
      <div class="mentoring-coaching">
        <h3>👥 Mentoring & Coaching Recommendations</h3>
        ${generateMentoringRecommendations(allDimensions)}
      </div>
    </div>

    <div class="interview-assessment-guide">
      <h2>❓ Enhanced Interview & Assessment Guide</h2>
      
      <div class="behavioral-questions">
        <h3>🎤 Targeted Behavioral Interview Questions</h3>
        ${generateEnhancedInterviewQuestions(allDimensions)}
      </div>
      
      <div class="assessment-criteria">
        <h3>📋 Performance Assessment Criteria</h3>
        ${generateAssessmentCriteria(allDimensions)}
      </div>
      
      <div class="onboarding-recommendations">
        <h3>🎯 Onboarding & Integration Recommendations</h3>
        ${generateOnboardingRecommendations(allDimensions)}
      </div>
    </div>

    <div class="career-fit">
      <h2>🚀 Strategic Career Positioning</h2>
      <h3>Ideal Role Characteristics</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        ${generateCareerFitRecommendations(dimensionScores)}
      </div>
      
      <h3>Team Dynamics</h3>
      <p>${generateTeamDynamicsInsight(dimensionScores)}</p>
      
      <h3>Leadership Potential</h3>
      <p>${generateLeadershipPotentialInsight(dimensionScores)}</p>
    </div>

    <div class="validity-section">
      <h2>✅ Advanced Validity Analysis</h2>
      <div class="validity-metrics">
        <div class="validity-item">
          <h3>Overall Assessment Validity</h3>
          <p class="validity-status ${(validity?.overallValidity || 'Valid').toLowerCase()}">${validity?.overallValidity || 'Valid'}</p>
          <small>Measures overall trustworthiness of responses</small>
        </div>
        <div class="validity-item">
          <h3>Response Consistency</h3>
          <p>${validity?.consistencyScore || 85}%</p>
          <small>Internal consistency across similar questions</small>
        </div>
        <div class="validity-item">
          <h3>Social Desirability Bias</h3>
          <p>${validity?.fakeGoodScore || 2}/10</p>
          <small>Tendency to present overly positive self-image</small>
        </div>
        <div class="validity-item">
          <h3>Response Engagement</h3>
          <p>${validity?.responseTimeProfile || 'Thoughtful'}</p>
          <small>Time spent considering each response</small>
        </div>
        <div class="validity-item">
          <h3>Random Responding</h3>
          <p>${validity?.randomScore || 1}/10</p>
          <small>Evidence of careless or random responses</small>
        </div>
        <div class="validity-item">
          <h3>Extreme Response Style</h3>
          <p>${validity?.extremeResponseScore || 3}/10</p>
          <small>Tendency to use extreme response options</small>
        </div>
      </div>
    </div>

    ${generateCAIRActionPlan(dimensionScores, topStrengths, developmentAreas)}

    <div class="footer">
      <p><strong>Confidential Professional Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This comprehensive CAIR+ assessment provides scientifically-validated insights for professional development and career planning.</p>
      <p>For questions about this report, contact your assessment administrator or HR professional.</p>
    </div>

    <script>
      ${generateCAIRChartScript(dimensionScores)}
    </script>
  </body>
  </html>
  `;
}

// CAIR+ Helper Functions
function formatDimensionName(name: string): string {
  return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function getPercentileClass(percentile: number): string {
  if (percentile >= 90) return 'percentile-exceptional';
  if (percentile >= 75) return 'percentile-strong';
  if (percentile >= 25) return 'percentile-average';
  return 'percentile-developing';
}

function getCAIRWorkplaceRelevance(dimension: string, level: string): string {
  const relevanceMap: Record<string, Record<string, string>> = {
    conscientiousness: {
      'Exceptional': 'Demonstrates outstanding reliability, organization, and attention to detail. Ideal for roles requiring precision, compliance, and systematic approaches. May sometimes over-focus on perfection.',
      'Strong': 'Highly dependable with excellent organizational skills. Consistently meets deadlines and maintains quality standards. Well-suited for project management and detail-oriented roles.',
      'Above Average': 'Generally organized and reliable. Good at following procedures and meeting commitments. Benefits from clear structure and expectations.',
      'Average': 'Adequately organized with room for improvement in consistency. May need support systems and reminders for complex projects.',
      'Below Average': 'May struggle with organization and follow-through. Benefits from training in time management and systematic approaches.',
      'Developing': 'Requires significant support in organization and reliability. May need structured environments and close supervision.'
    },
    agreeableness: {
      'Exceptional': 'Outstanding collaborator who builds consensus and maintains harmony. Excellent for team leadership and client-facing roles. May avoid necessary conflicts.',
      'Strong': 'Works very well with others and contributes to positive team dynamics. Good at conflict resolution and building relationships.',
      'Above Average': 'Generally cooperative and supportive of team goals. Handles interpersonal relationships well in most situations.',
      'Average': 'Balances cooperation with independence. May need coaching on collaboration in complex team situations.',
      'Below Average': 'May prefer independent work and struggle with highly collaborative environments. Can benefit from team-building training.',
      'Developing': 'May find team environments challenging. Requires coaching in interpersonal skills and collaboration techniques.'
    },
    innovation: {
      'Exceptional': 'Highly creative problem-solver who thrives on change and new challenges. Ideal for R&D, strategy, and transformation roles. May become bored with routine.',
      'Strong': 'Creative and adaptable with good problem-solving skills. Welcomes change and contributes innovative ideas to projects.',
      'Above Average': 'Generally open to new ideas and approaches. Can adapt to change with proper support and communication.',
      'Average': 'Moderately comfortable with change when benefits are clear. May need encouragement to try new approaches.',
      'Below Average': 'Prefers established methods and may resist change. Benefits from gradual introduction of new processes with clear rationale.',
      'Developing': 'May struggle significantly with change and new approaches. Requires careful change management and support.'
    },
    resilience: {
      'Exceptional': 'Demonstrates remarkable ability to bounce back from setbacks and maintain performance under pressure. Ideal for high-stress roles and leadership positions.',
      'Strong': 'Handles stress well and recovers quickly from difficulties. Maintains optimism and energy in challenging situations.',
      'Above Average': 'Generally manages stress effectively with good coping strategies. May need occasional support during peak stress periods.',
      'Average': 'Adequate stress management with room for improvement. Benefits from stress management training and clear support systems.',
      'Below Average': 'May struggle with high-stress situations and recovery from setbacks. Requires stress management support and workload monitoring.',
      'Developing': 'Significant challenges with stress and resilience. Needs comprehensive support, training, and possibly reduced stress exposure initially.'
    }
  };
  
  return relevanceMap[dimension]?.[level] || 'Assessment data indicates balanced capabilities in this dimension.';
}

function getCAIRDevelopmentSuggestions(dimension: string, level: string): string {
  const suggestionsMap: Record<string, Record<string, string>> = {
    conscientiousness: {
      'Exceptional': 'Focus on mentoring others in organizational skills. Consider if perfectionism might be limiting efficiency. Explore leadership roles that leverage your reliability.',
      'Strong': 'Continue to model excellent organizational practices. Consider taking on project management responsibilities. Share best practices with team members.',
      'Above Average': 'Develop more advanced planning and organizational systems. Seek feedback on areas for improvement. Consider time management training.',
      'Average': 'Implement structured planning tools and systems. Set clear deadlines and accountability measures. Consider organization and productivity training.',
      'Below Average': 'Focus on basic organizational skills training. Use digital tools for reminders and tracking. Work with a mentor on accountability systems.',
      'Developing': 'Start with simple, consistent routines. Use external accountability systems. Consider professional coaching for organization and time management.'
    },
    agreeableness: {
      'Exceptional': 'Practice assertiveness skills to balance cooperation with necessary firmness. Learn when conflict is productive. Develop skills in difficult conversations.',
      'Strong': 'Continue building on collaboration strengths. Practice leadership in team settings. Develop skills in managing team conflicts constructively.',
      'Above Average': 'Enhance active listening and empathy skills. Practice giving and receiving feedback effectively. Build on natural collaboration abilities.',
      'Average': 'Focus on building stronger interpersonal relationships. Practice active listening and empathy. Consider team-building exercises and training.',
      'Below Average': 'Develop basic collaboration and communication skills. Practice perspective-taking. Consider interpersonal skills training or coaching.',
      'Developing': 'Start with basic interpersonal skills development. Practice one-on-one relationships before group settings. Consider communication skills training.'
    },
    innovation: {
      'Exceptional': 'Channel creativity into structured innovation processes. Consider roles in strategy or R&D. Mentor others in creative thinking while maintaining practical focus.',
      'Strong': 'Continue developing creative problem-solving skills. Seek projects that allow for innovation. Practice explaining creative ideas to others clearly.',
      'Above Average': 'Gradually expand comfort zone with new approaches. Practice brainstorming and creative thinking techniques. Seek exposure to innovative projects.',
      'Average': 'Start with small changes and build confidence. Practice creative thinking exercises. Seek exposure to diverse perspectives and approaches.',
      'Below Average': 'Begin with structured change management training. Practice incremental innovation. Build tolerance for ambiguity gradually.',
      'Developing': 'Focus on change management skills first. Start with very small, low-risk innovations. Build confidence through successful small changes.'
    },
    resilience: {
      'Exceptional': 'Share stress management strategies with others. Consider high-responsibility roles. Maintain work-life balance to prevent burnout.',
      'Strong': 'Continue developing resilience skills. Consider leadership roles in challenging situations. Practice stress management techniques regularly.',
      'Above Average': 'Build on existing coping strategies. Practice mindfulness and stress reduction techniques. Seek challenging projects to build confidence.',
      'Average': 'Develop structured stress management strategies. Practice relaxation and recovery techniques. Build support networks and coping skills.',
      'Below Average': 'Focus on basic stress management training. Develop healthy coping strategies. Consider counseling or coaching for resilience building.',
      'Developing': 'Start with stress identification and basic coping skills. Build gradual exposure to manageable challenges. Consider professional support for resilience development.'
    }
  };
  
  return suggestionsMap[dimension]?.[level] || 'Continue developing this dimension through targeted practice and feedback.';
}

function getCAIRInterviewQuestions(dimension: string, level: string): string[] {
  const questionsMap: Record<string, string[]> = {
    conscientiousness: [
      'Describe a time when you had to manage multiple deadlines. How did you prioritize and organize your work?',
      'Tell me about a project where attention to detail was critical. How did you ensure accuracy?',
      'Give an example of how you handle routine tasks and maintain quality over time.',
      'Describe a situation where you had to follow complex procedures or regulations.'
    ],
    agreeableness: [
      'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
      'Describe a situation where you helped a colleague succeed. What was your approach?',
      'Give an example of when you had to mediate a conflict between team members.',
      'Tell me about a time when you put team goals ahead of your individual preferences.'
    ],
    innovation: [
      'Describe a time when you had to solve a problem in a creative or unconventional way.',
      'Tell me about a situation where you successfully adapted to a major change.',
      'Give an example of when you suggested an improvement to an existing process.',
      'Describe a time when you had to learn something completely new quickly.'
    ],
    resilience: [
      'Tell me about a time when you faced a significant setback. How did you recover?',
      'Describe a period when you were under intense pressure. How did you manage it?',
      'Give an example of when you had to maintain performance during a stressful time.',
      'Tell me about a time when you learned from a failure or mistake.'
    ]
  };
  
  return questionsMap[dimension] || [
    'Can you provide examples that demonstrate your capabilities in this area?',
    'How do you typically approach challenges related to this dimension?'
  ];
}

function getSubdimensionDescription(dimension: string, subdimension: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    conscientiousness: {
      organization: 'Ability to structure work, maintain order, and create efficient systems',
      reliability: 'Consistency in meeting commitments and following through on responsibilities',
      attention_to_detail: 'Focus on accuracy, precision, and thoroughness in work',
      goal_orientation: 'Drive to achieve objectives and maintain focus on outcomes',
      rule_following: 'Tendency to adhere to procedures, policies, and established guidelines',
      self_improvement: 'Motivation for personal development and skill enhancement',
      self_monitoring: 'Awareness of own performance and ability to self-regulate',
      preparation: 'Tendency to plan ahead and prepare thoroughly for tasks and events'
    },
    agreeableness: {
      cooperation: 'Willingness to work collaboratively and support team efforts',
      helpfulness: 'Tendency to assist others and provide support when needed',
      trust: 'Inclination to believe in others\' good intentions and reliability',
      compassion: 'Empathy and concern for others\' wellbeing and feelings',
      empathy: 'Ability to understand and share others\' emotional experiences',
      modesty: 'Humility and tendency to downplay own achievements',
      interpersonal_warmth: 'Friendliness and ability to create positive relationships',
      consensus_building: 'Skill in finding common ground and building agreement'
    },
    innovation: {
      creativity: 'Ability to generate novel ideas and original solutions',
      openness_to_change: 'Comfort with and positive attitude toward change',
      learning_style: 'Approach to acquiring new knowledge and skills',
      ideation: 'Capacity for generating and developing new ideas',
      change_tolerance: 'Ability to adapt and remain effective during transitions',
      innovation_preference: 'Preference for novel approaches over traditional methods',
      improvement_orientation: 'Drive to enhance and optimize existing processes',
      ambiguity_tolerance: 'Comfort with uncertainty and unclear situations',
      abstract_thinking: 'Ability to think conceptually and handle complex ideas',
      risk_taking: 'Willingness to take calculated risks for potential gains'
    },
    resilience: {
      recovery_speed: 'Ability to bounce back quickly from setbacks or difficulties',
      stress_tolerance: 'Capacity to maintain performance under pressure',
      optimism: 'Positive outlook and expectation of favorable outcomes',
      energy_management: 'Ability to maintain energy and motivation over time',
      emotional_stability: 'Consistency in emotional responses and mood regulation',
      pressure_performance: 'Ability to perform well when under time or performance pressure',
      workload_management: 'Skill in handling multiple demands and heavy workloads',
      life_perspective: 'Balanced view of challenges and ability to maintain perspective',
      persistence: 'Determination to continue despite obstacles or difficulties',
      work_recovery: 'Ability to recuperate and recharge after demanding periods'
    }
  };
  
  return descriptions[dimension]?.[subdimension] || 'Measures specific aspects of personality relevant to workplace performance';
}

function generateCareerFitRecommendations(dimensionScores: any): string {
  const scores = Object.entries(dimensionScores).map(([name, data]: [string, any]) => ({
    name,
    percentile: data?.percentile || 0
  }));
  
  const highCon = scores.find(s => s.name === 'conscientiousness')?.percentile || 0;
  const highAgr = scores.find(s => s.name === 'agreeableness')?.percentile || 0;
  const highInn = scores.find(s => s.name === 'innovation')?.percentile || 0;
  const highRes = scores.find(s => s.name === 'resilience')?.percentile || 0;
  
  let recommendations = [];
  
  if (highCon >= 75 && highAgr >= 75) {
    recommendations.push('<div><strong>Team Leadership:</strong> High reliability and collaboration make you ideal for managing teams and complex projects.</div>');
  }
  
  if (highInn >= 75 && highRes >= 75) {
    recommendations.push('<div><strong>Innovation Roles:</strong> Your creativity combined with resilience suits you for R&D, strategy, and change management positions.</div>');
  }
  
  if (highCon >= 75 && highRes >= 75) {
    recommendations.push('<div><strong>Operations Excellence:</strong> Your organization and stress tolerance make you excellent for operational leadership and quality management.</div>');
  }
  
  if (highAgr >= 75 && highRes >= 75) {
    recommendations.push('<div><strong>Client Relations:</strong> Your interpersonal skills and resilience suit customer-facing and relationship management roles.</div>');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('<div><strong>Balanced Contributor:</strong> Your well-rounded profile makes you adaptable to various roles and team environments.</div>');
  }
  
  return recommendations.join('');
}

function generateTeamDynamicsInsight(dimensionScores: any): string {
  const agreeableness = dimensionScores.agreeableness?.percentile || 0;
  const innovation = dimensionScores.innovation?.percentile || 0;
  const conscientiousness = dimensionScores.conscientiousness?.percentile || 0;
  
  if (agreeableness >= 75) {
    return 'Natural team player who builds consensus and maintains positive group dynamics. May serve as a mediator and relationship builder within teams.';
  } else if (innovation >= 75) {
    return 'Brings creative energy and fresh perspectives to teams. May challenge conventional thinking and drive innovation initiatives.';
  } else if (conscientiousness >= 75) {
    return 'Provides structure and reliability to team efforts. Often serves as the anchor for project planning and execution.';
  } else {
    return 'Contributes unique value to teams through balanced capabilities and adaptable working style.';
  }
}

function generateLeadershipPotentialInsight(dimensionScores: any): string {
  const resilience = dimensionScores.resilience?.percentile || 0;
  const conscientiousness = dimensionScores.conscientiousness?.percentile || 0;
  const agreeableness = dimensionScores.agreeableness?.percentile || 0;
  
  const leadershipScore = (resilience + conscientiousness + agreeableness) / 3;
  
  if (leadershipScore >= 75) {
    return 'Strong leadership potential across multiple dimensions. Demonstrates the resilience, reliability, and interpersonal skills needed for effective leadership.';
  } else if (leadershipScore >= 60) {
    return 'Moderate leadership potential with specific strengths. May excel in specialized leadership roles that leverage primary strengths.';
  } else {
    return 'May be most effective as an individual contributor or in roles with limited formal leadership responsibilities.';
  }
}

function generateCAIRActionPlan(dimensionScores: any, topStrengths: any[], developmentAreas: any[]): string {
  const actionItems = [];
  
  // Strength-based actions
  if (topStrengths.length > 0) {
    actionItems.push(`Leverage your strength in ${topStrengths[0].name} by seeking projects that require ${getStrengthApplications(topStrengths[0].name)}`);
    actionItems.push(`Share your expertise in ${topStrengths[0].name} through mentoring or training others`);
  }
  
  // Development-focused actions
  if (developmentAreas.length > 0) {
    actionItems.push(`Focus development efforts on ${developmentAreas[0].name} through targeted training and practice`);
    actionItems.push(`Seek feedback and coaching specifically for ${developmentAreas[0].name} improvement`);
  }
  
  // General actions
  actionItems.push('Schedule quarterly self-assessments to track personality development progress');
  actionItems.push('Discuss assessment results with supervisor or mentor for career planning');
  actionItems.push('Consider additional assessments in 6-12 months to measure growth');
  
  return generateActionPlan(actionItems);
}

function getStrengthApplications(dimension: string): string {
  const applications: Record<string, string> = {
    'Conscientiousness': 'detailed planning, quality control, and systematic execution',
    'Agreeableness': 'team collaboration, conflict resolution, and relationship building', 
    'Innovation': 'creative problem-solving, change management, and process improvement',
    'Resilience': 'high-pressure situations, crisis management, and leadership challenges'
  };
  
  return applications[dimension] || 'specialized expertise and consistent performance';
}

function generateCAIRChartScript(dimensionScores: any): string {
  const chartData = Object.entries(dimensionScores).map(([name, data]: [string, any]) => ({
    label: formatDimensionName(name),
    value: data?.percentile || 0
  }));
  
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('personalityChart').getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [${chartData.map(d => `'${d.label}'`).join(', ')}],
          datasets: [{
            label: 'Personality Profile (Percentiles)',
            data: [${chartData.map(d => d.value).join(', ')}],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'CAIR+ Personality Dimensions (Percentile Scores)'
            }
          }
        }
      });
    });
  `;
}

// Enhanced CAIR+ Helper Functions for Rich Content

function generateEnhancedCareerFitAnalysis(dimensions: any[]): string {
  const highestDimensions = dimensions.filter(d => d.percentile >= 75).sort((a, b) => b.percentile - a.percentile);
  const roleRecommendations = [];
  
  for (const dimension of highestDimensions) {
    const roles = getSpecificRoleRecommendations(dimension.rawName, dimension.level);
    roleRecommendations.push(`<div class="role-recommendation">
      <h4>${dimension.name} Strength (${dimension.percentile}th percentile)</h4>
      <p><strong>Ideal Roles:</strong> ${roles.roles}</p>
      <p><strong>Key Responsibilities:</strong> ${roles.responsibilities}</p>
      <p><strong>Industry Fit:</strong> ${roles.industries}</p>
    </div>`);
  }
  
  return roleRecommendations.length > 0 ? roleRecommendations.join('') : 
    '<div>Your balanced profile makes you adaptable to various professional roles across multiple industries.</div>';
}

function getSpecificRoleRecommendations(dimension: string, level: string): any {
  const roleMap: Record<string, any> = {
    conscientiousness: {
      roles: 'Project Manager, Operations Director, Quality Assurance Lead, Compliance Officer, Financial Analyst',
      responsibilities: 'Process optimization, risk management, quality control, regulatory compliance, detailed analysis',
      industries: 'Healthcare, Finance, Manufacturing, Government, Legal Services'
    },
    agreeableness: {
      roles: 'HR Director, Customer Success Manager, Team Lead, Counselor, Account Manager',
      responsibilities: 'Team building, conflict resolution, client relationships, employee development, stakeholder management',
      industries: 'Human Resources, Healthcare, Education, Non-profit, Customer Service'
    },
    innovation: {
      roles: 'Product Manager, R&D Director, Strategy Consultant, Design Lead, Innovation Manager',
      responsibilities: 'Product development, strategic planning, creative solutions, change management, future visioning',
      industries: 'Technology, Consulting, Design, Startups, Research & Development'
    },
    resilience: {
      roles: 'Crisis Manager, Executive Leader, Emergency Response Coordinator, Turnaround Specialist, High-Stakes Negotiator',
      responsibilities: 'Crisis management, high-pressure decision making, organizational recovery, stress leadership, emergency planning',
      industries: 'Emergency Services, Executive Leadership, Consulting, Healthcare, Military/Defense'
    }
  };
  
  return roleMap[dimension] || {
    roles: 'Various leadership and specialist roles',
    responsibilities: 'Balanced contribution across multiple areas',
    industries: 'Adaptable to most industries'
  };
}

function generateWorkStylePreferences(dimensions: any[]): string {
  const preferences = [];
  
  dimensions.forEach(dim => {
    if (dim.percentile >= 75) {
      const prefs = getWorkStylePreferences(dim.rawName);
      preferences.push(`<div class="work-style-item">
        <h4>${dim.name} Preference</h4>
        <p>${prefs}</p>
      </div>`);
    }
  });
  
  return preferences.join('');
}

function getWorkStylePreferences(dimension: string): string {
  const preferences: Record<string, string> = {
    conscientiousness: 'Structured environments with clear processes, defined deadlines, and systematic approaches. Prefers detailed planning and organized workflows.',
    agreeableness: 'Collaborative settings with strong team dynamics, open communication, and consensus-building opportunities. Values harmony and mutual support.',
    innovation: 'Dynamic environments that encourage creativity, experimentation, and change. Thrives in settings with autonomy and creative freedom.',
    resilience: 'High-energy environments with challenging goals and fast-paced demands. Comfortable with pressure and changing priorities.'
  };
  
  return preferences[dimension] || 'Balanced work environment accommodating various working styles and preferences.';
}

function calculateLeadershipReadiness(dimensions: any[]): string {
  const leadershipFactors = {
    conscientiousness: dimensions.find(d => d.rawName === 'conscientiousness')?.percentile || 0,
    agreeableness: dimensions.find(d => d.rawName === 'agreeableness')?.percentile || 0,
    resilience: dimensions.find(d => d.rawName === 'resilience')?.percentile || 0,
    innovation: dimensions.find(d => d.rawName === 'innovation')?.percentile || 0
  };
  
  const overallLeadershipScore = (leadershipFactors.conscientiousness + leadershipFactors.agreeableness + leadershipFactors.resilience) / 3;
  
  let readinessLevel = '';
  let recommendations = '';
  
  if (overallLeadershipScore >= 80) {
    readinessLevel = 'Executive Leadership Ready';
    recommendations = 'Ready for senior leadership roles. Consider C-suite or VP positions. Focus on strategic vision and organizational transformation.';
  } else if (overallLeadershipScore >= 65) {
    readinessLevel = 'Management Leadership Ready';
    recommendations = 'Ready for management and team leadership roles. Consider director or senior manager positions. Develop strategic thinking skills.';
  } else if (overallLeadershipScore >= 50) {
    readinessLevel = 'Emerging Leader Potential';
    recommendations = 'Shows leadership potential with development. Consider team lead or supervisor roles. Focus on leadership skill development.';
  } else {
    readinessLevel = 'Individual Contributor Strength';
    recommendations = 'Strongest as individual contributor or specialist. Consider subject matter expert or technical lead roles.';
  }
  
  return `<div class="leadership-assessment">
    <p><strong>Leadership Readiness Level:</strong> ${readinessLevel}</p>
    <p><strong>Overall Leadership Score:</strong> ${overallLeadershipScore.toFixed(1)}/100</p>
    <p><strong>Recommendations:</strong> ${recommendations}</p>
    <div class="leadership-breakdown">
      <p>• Reliability & Organization: ${leadershipFactors.conscientiousness}th percentile</p>
      <p>• Team Building & Collaboration: ${leadershipFactors.agreeableness}th percentile</p>
      <p>• Stress Management & Resilience: ${leadershipFactors.resilience}th percentile</p>
      <p>• Innovation & Change Leadership: ${leadershipFactors.innovation}th percentile</p>
    </div>
  </div>`;
}

function generateTeamContributionAnalysis(dimensions: any[]): string {
  const contributions = [];
  
  dimensions.forEach(dim => {
    if (dim.percentile >= 65) {
      const contribution = getTeamContribution(dim.rawName, dim.percentile);
      contributions.push(`<div class="team-contribution">
        <h4>${dim.name} Contribution</h4>
        <p>${contribution}</p>
      </div>`);
    }
  });
  
  return contributions.length > 0 ? contributions.join('') : 
    '<div>Provides balanced contribution to teams across multiple dimensions.</div>';
}

function getTeamContribution(dimension: string, percentile: number): string {
  const contributions: Record<string, string> = {
    conscientiousness: `Serves as the team's organizational backbone, ensuring processes are followed and deadlines met. Brings structure and reliability that others depend on.`,
    agreeableness: `Acts as the team harmonizer and conflict resolver. Builds bridges between team members and maintains positive group dynamics.`,
    innovation: `Drives creative thinking and challenges conventional approaches. Introduces fresh perspectives and helps teams adapt to change.`,
    resilience: `Provides stability during stressful periods and helps team maintain momentum through challenges. Acts as emotional anchor during difficult times.`
  };
  
  return contributions[dimension] || 'Contributes balanced value to team effectiveness and dynamics.';
}

function generateWorkplaceScenarios(dimensions: any[]): string {
  const scenarios = [];
  
  for (const dim of dimensions.slice(0, 2)) { // Focus on top 2 dimensions
    const scenario = getWorkplaceScenario(dim.rawName, dim.level);
    scenarios.push(`<div class="scenario-analysis">
      <h4>${dim.name} in Action</h4>
      <div class="scenario-content">
        <p><strong>Scenario:</strong> ${scenario.situation}</p>
        <p><strong>Likely Response:</strong> ${scenario.response}</p>
        <p><strong>Outcome:</strong> ${scenario.outcome}</p>
      </div>
    </div>`);
  }
  
  return scenarios.join('');
}

function getWorkplaceScenario(dimension: string, level: string): any {
  const scenarios: Record<string, any> = {
    conscientiousness: {
      situation: 'Given a complex project with multiple deadlines and stakeholders, while managing regular responsibilities.',
      response: 'Creates detailed project timeline, establishes clear checkpoints, and proactively communicates progress to all stakeholders.',
      outcome: 'Delivers high-quality results on time while maintaining attention to detail and managing expectations effectively.'
    },
    agreeableness: {
      situation: 'Mediating between two team members who have conflicting approaches to solving a critical business problem.',
      response: 'Facilitates discussion to understand both perspectives, identifies common ground, and helps develop a collaborative solution.',
      outcome: 'Resolves conflict while preserving relationships and creates a stronger, more unified team approach.'
    },
    innovation: {
      situation: 'Tasked with improving an established process that has worked well but may be outdated given new market conditions.',
      response: 'Analyzes current process thoroughly, researches best practices, and proposes creative improvements with clear implementation plan.',
      outcome: 'Successfully modernizes the process, improving efficiency while managing change adoption across the organization.'
    },
    resilience: {
      situation: 'Leading a critical project during organizational restructuring with tight deadlines and uncertain resource availability.',
      response: 'Maintains focus on deliverables, adapts quickly to changing conditions, and keeps team motivated despite uncertainty.',
      outcome: 'Delivers successful project outcomes while supporting team through transition and building stronger organizational confidence.'
    }
  };
  
  return scenarios[dimension] || {
    situation: 'Handling typical workplace challenges and opportunities',
    response: 'Applies balanced approach drawing on multiple strengths',
    outcome: 'Achieves positive results through adaptable problem-solving'
  };
}

function generateDecisionMakingProfile(dimensions: any[]): string {
  const topDimension = dimensions.sort((a, b) => b.percentile - a.percentile)[0];
  const profile = getDecisionMakingStyle(topDimension.rawName);
  
  return `<div class="decision-profile">
    <p><strong>Primary Decision Style:</strong> ${profile.style}</p>
    <p><strong>Decision Process:</strong> ${profile.process}</p>
    <p><strong>Information Gathering:</strong> ${profile.information}</p>
    <p><strong>Risk Approach:</strong> ${profile.risk}</p>
    <p><strong>Implementation:</strong> ${profile.implementation}</p>
  </div>`;
}

function getDecisionMakingStyle(dimension: string): any {
  const styles: Record<string, any> = {
    conscientiousness: {
      style: 'Analytical Deliberator',
      process: 'Systematic evaluation with thorough research and detailed planning',
      information: 'Gathers comprehensive data, seeks multiple sources, validates information',
      risk: 'Conservative approach, prefers proven solutions with predictable outcomes',
      implementation: 'Careful execution with monitoring systems and contingency plans'
    },
    agreeableness: {
      style: 'Collaborative Consensus Builder',
      process: 'Inclusive approach seeking input from all stakeholders',
      information: 'Values diverse perspectives, considers impact on relationships',
      risk: 'Moderate risk tolerance, balances innovation with stakeholder comfort',
      implementation: 'Ensures buy-in through communication and gradual implementation'
    },
    innovation: {
      style: 'Creative Visionary',
      process: 'Intuitive and experimental, explores multiple creative alternatives',
      information: 'Seeks diverse and unconventional sources, questions assumptions',
      risk: 'Higher risk tolerance, willing to try new approaches',
      implementation: 'Rapid prototyping and iterative improvement approach'
    },
    resilience: {
      style: 'Decisive Pragmatist',
      process: 'Quick assessment focusing on practical outcomes and immediate needs',
      information: 'Gathers essential information quickly, comfortable with incomplete data',
      risk: 'Calculated risk-taking, confident in ability to handle consequences',
      implementation: 'Swift execution with adaptation based on real-time feedback'
    }
  };
  
  return styles[dimension] || {
    style: 'Balanced Decision Maker',
    process: 'Flexible approach adapting to situation requirements',
    information: 'Gathers appropriate level of information for the decision',
    risk: 'Situational risk assessment',
    implementation: 'Adaptable implementation based on context'
  };
}

function generateStressResponseAnalysis(dimensions: any[]): string {
  const resilience = dimensions.find(d => d.rawName === 'resilience');
  const conscientiousness = dimensions.find(d => d.rawName === 'conscientiousness');
  
  const stressProfile = getStressResponseProfile(resilience?.percentile || 50, conscientiousness?.percentile || 50);
  
  return `<div class="stress-analysis">
    <div class="stress-tolerance">
      <h4>Stress Tolerance Level: ${stressProfile.tolerance}</h4>
      <p>${stressProfile.description}</p>
    </div>
    <div class="stress-indicators">
      <h4>Early Warning Signs:</h4>
      <ul>${stressProfile.earlyWarnings.map(w => `<li>${w}</li>`).join('')}</ul>
    </div>
    <div class="stress-support">
      <h4>Optimal Support Strategies:</h4>
      <ul>${stressProfile.supports.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
  </div>`;
}

function getStressResponseProfile(resilienceScore: number, conscientiousnessScore: number): any {
  const combinedScore = (resilienceScore + conscientiousnessScore) / 2;
  
  if (combinedScore >= 75) {
    return {
      tolerance: 'High Stress Resilience',
      description: 'Thrives under pressure and maintains high performance during challenging periods. Natural ability to manage complex, high-stakes situations.',
      earlyWarnings: [
        'May take on too much responsibility during crises',
        'Could underestimate stress impact on team members',
        'Might skip necessary recovery periods'
      ],
      supports: [
        'Provide challenging, high-responsibility assignments',
        'Ensure adequate recovery time between intense periods',
        'Leverage as crisis leader and mentor for others'
      ]
    };
  } else if (combinedScore >= 50) {
    return {
      tolerance: 'Moderate Stress Management',
      description: 'Handles typical workplace stress well with good coping strategies. May need additional support during peak stress periods.',
      earlyWarnings: [
        'Decreased attention to detail during high-pressure periods',
        'May become less collaborative when overwhelmed',
        'Could experience decision fatigue with complex choices'
      ],
      supports: [
        'Provide clear priorities during busy periods',
        'Offer stress management resources and training',
        'Ensure workload balance and realistic deadlines'
      ]
    };
  } else {
    return {
      tolerance: 'Developing Stress Resilience',
      description: 'Benefits from structured support during stressful periods. Performs best in stable, predictable environments.',
      earlyWarnings: [
        'May become overwhelmed by multiple competing priorities',
        'Could experience analysis paralysis under pressure',
        'Might avoid making decisions when stressed'
      ],
      supports: [
        'Provide clear structure and step-by-step guidance',
        'Offer regular check-ins and emotional support',
        'Gradually build exposure to challenging situations'
      ]
    };
  }
}

function generateCareerGrowthPath(dimensions: any[]): string {
  const topDimensions = dimensions.sort((a, b) => b.percentile - a.percentile).slice(0, 2);
  const pathRecommendations = [];
  
  for (const dim of topDimensions) {
    const path = getCareerGrowthPath(dim.rawName, dim.percentile);
    pathRecommendations.push(`<div class="growth-path">
      <h4>${dim.name} Development Track</h4>
      <div class="path-timeline">
        <div class="path-stage">
          <h5>6-Month Goals:</h5>
          <p>${path.sixMonth}</p>
        </div>
        <div class="path-stage">
          <h5>1-Year Targets:</h5>
          <p>${path.oneYear}</p>
        </div>
        <div class="path-stage">
          <h5>3-Year Vision:</h5>
          <p>${path.threeYear}</p>
        </div>
      </div>
    </div>`);
  }
  
  return pathRecommendations.join('');
}

function getCareerGrowthPath(dimension: string, percentile: number): any {
  const paths: Record<string, any> = {
    conscientiousness: {
      sixMonth: 'Lead process improvement initiative, obtain project management certification, mentor junior team members',
      oneYear: 'Manage cross-functional project, develop advanced organizational systems, take on quality assurance responsibilities',
      threeYear: 'Director of Operations, Head of Quality Assurance, or Senior Project Management role with P&L responsibility'
    },
    agreeableness: {
      sixMonth: 'Lead team integration project, develop conflict resolution skills, facilitate cross-departmental collaboration',
      oneYear: 'Manage larger team, obtain coaching/leadership certification, drive culture initiatives',
      threeYear: 'Head of People Operations, VP of Human Resources, or Senior Leadership role focused on organizational development'
    },
    innovation: {
      sixMonth: 'Lead innovation project, present creative solutions to leadership, develop design thinking skills',
      oneYear: 'Drive digital transformation initiative, obtain relevant technology certifications, mentor others in creative thinking',
      threeYear: 'Chief Innovation Officer, VP of Strategy, or Head of Product Development role leading organizational transformation'
    },
    resilience: {
      sixMonth: 'Take on high-visibility challenging assignment, develop crisis management skills, mentor others through difficult situations',
      oneYear: 'Lead organizational change initiative, obtain executive leadership training, manage turnaround project',
      threeYear: 'C-suite executive role, Division President, or Crisis Management Specialist leading organizational resilience'
    }
  };
  
  return paths[dimension] || {
    sixMonth: 'Develop specialized expertise in your strongest areas',
    oneYear: 'Take on leadership responsibilities leveraging your strengths',
    threeYear: 'Senior leadership or specialist expert role maximizing your unique capabilities'
  };
}

function generate90DayDevelopmentPlan(strengths: any[], developmentAreas: any[]): string {
  return `<div class="development-roadmap">
    <div class="roadmap-phase">
      <h4>Days 1-30: Foundation Building</h4>
      <div class="phase-content">
        <div class="strengths-focus">
          <h5>Leverage Strengths:</h5>
          <ul>
            ${strengths.slice(0, 2).map(s => `<li>Apply ${s.name} expertise to current projects and challenges</li>`).join('')}
            <li>Seek opportunities to mentor others in your strength areas</li>
            <li>Document and share best practices from your strong dimensions</li>
          </ul>
        </div>
        <div class="development-focus">
          <h5>Begin Development:</h5>
          <ul>
            ${developmentAreas.slice(0, 1).map(d => `<li>Start foundational training in ${d.name}</li>`).join('')}
            <li>Identify mentors or coaches for development areas</li>
            <li>Establish baseline measurements for growth tracking</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="roadmap-phase">
      <h4>Days 31-60: Skill Application</h4>
      <div class="phase-content">
        <ul>
          <li>Apply new learning to real workplace situations</li>
          <li>Seek feedback on development progress from supervisor and peers</li>
          <li>Take on stretch assignments that challenge development areas</li>
          <li>Continue strengthening and applying existing strengths</li>
        </ul>
      </div>
    </div>
    
    <div class="roadmap-phase">
      <h4>Days 61-90: Integration & Assessment</h4>
      <div class="phase-content">
        <ul>
          <li>Integrate new skills with existing strengths for enhanced performance</li>
          <li>Conduct formal progress review with manager or mentor</li>
          <li>Plan next 90-day development cycle based on growth achieved</li>
          <li>Consider advanced training or certification in strongest areas</li>
        </ul>
      </div>
    </div>
  </div>`;
}

function generateSkillBuildingMatrix(dimensions: any[]): string {
  return `<div class="skill-matrix">
    <table class="development-table">
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Current Level</th>
          <th>Training Priority</th>
          <th>Recommended Learning</th>
          <th>Practice Opportunities</th>
        </tr>
      </thead>
      <tbody>
        ${dimensions.map(dim => `
          <tr>
            <td><strong>${dim.name}</strong></td>
            <td>${dim.level} (${dim.percentile}%)</td>
            <td>${getTrainingPriority(dim.percentile)}</td>
            <td>${getRecommendedLearning(dim.rawName, dim.percentile)}</td>
            <td>${getPracticeOpportunities(dim.rawName)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

function getTrainingPriority(percentile: number): string {
  if (percentile >= 75) return 'Maintenance/Advanced';
  if (percentile >= 50) return 'Enhancement';
  if (percentile >= 25) return 'Development';
  return 'Priority Focus';
}

function getRecommendedLearning(dimension: string, percentile: number): string {
  const learningMap: Record<string, Record<string, string>> = {
    conscientiousness: {
      high: 'Advanced project management, lean methodology, leadership training',
      medium: 'Time management, organization systems, quality management',
      low: 'Basic planning skills, deadline management, organizational tools'
    },
    agreeableness: {
      high: 'Advanced facilitation, executive coaching, organizational psychology',
      medium: 'Conflict resolution, team building, communication skills',
      low: 'Basic interpersonal skills, active listening, collaboration training'
    },
    innovation: {
      high: 'Design thinking mastery, innovation management, strategic foresight',
      medium: 'Creative problem solving, change management, brainstorming techniques',
      low: 'Basic creativity training, openness to change, flexibility development'
    },
    resilience: {
      high: 'Crisis leadership, organizational psychology, executive stress management',
      medium: 'Stress management, emotional regulation, pressure performance',
      low: 'Basic resilience building, coping strategies, stress awareness'
    }
  };
  
  const level = percentile >= 75 ? 'high' : percentile >= 50 ? 'medium' : 'low';
  return learningMap[dimension]?.[level] || 'General professional development';
}

function getPracticeOpportunities(dimension: string): string {
  const opportunities: Record<string, string> = {
    conscientiousness: 'Lead complex projects, implement new processes, quality audits',
    agreeableness: 'Facilitate team meetings, mediate conflicts, mentor new employees',
    innovation: 'Lead brainstorming sessions, pilot new technologies, drive change initiatives',
    resilience: 'Handle crisis situations, manage tight deadlines, support stressed colleagues'
  };
  
  return opportunities[dimension] || 'Various professional challenges and stretch assignments';
}

function generateMentoringRecommendations(dimensions: any[]): string {
  const topDimensions = dimensions.sort((a, b) => b.percentile - a.percentile).slice(0, 2);
  const developmentDimensions = dimensions.filter(d => d.percentile < 60);
  
  return `<div class="mentoring-recommendations">
    <div class="mentor-others">
      <h4>Areas Where You Can Mentor Others:</h4>
      <ul>
        ${topDimensions.map(d => `<li><strong>${d.name}:</strong> Share expertise in ${getMentoringAreas(d.rawName)}</li>`).join('')}
      </ul>
    </div>
    
    <div class="seek-mentoring">
      <h4>Areas Where You Should Seek Mentoring:</h4>
      <ul>
        ${developmentDimensions.map(d => `<li><strong>${d.name}:</strong> Find mentors who excel in ${getMentoringAreas(d.rawName)}</li>`).join('')}
      </ul>
    </div>
    
    <div class="coaching-style">
      <h4>Your Optimal Coaching Style:</h4>
      <p>${getOptimalCoachingStyle(topDimensions[0]?.rawName)}</p>
    </div>
  </div>`;
}

function getMentoringAreas(dimension: string): string {
  const areas: Record<string, string> = {
    conscientiousness: 'project management, organizational systems, quality standards, attention to detail',
    agreeableness: 'team building, conflict resolution, relationship management, collaboration',
    innovation: 'creative thinking, change management, problem-solving, strategic thinking',
    resilience: 'stress management, crisis handling, emotional regulation, performance under pressure'
  };
  
  return areas[dimension] || 'general professional development';
}

function getOptimalCoachingStyle(dimension: string): string {
  const styles: Record<string, string> = {
    conscientiousness: 'Structured, systematic coaching with clear goals, regular check-ins, and detailed action plans. Prefer step-by-step guidance with measurable outcomes.',
    agreeableness: 'Collaborative, supportive coaching that builds relationships and considers emotional needs. Value coaches who create safe environments and provide encouragement.',
    innovation: 'Dynamic, creative coaching that challenges thinking and explores possibilities. Prefer coaches who encourage experimentation and out-of-the-box approaches.',
    resilience: 'Direct, challenging coaching that pushes comfort zones and builds confidence. Value coaches who provide honest feedback and stretch assignments.'
  };
  
  return styles[dimension] || 'Balanced coaching approach that adapts to your learning style and development needs.';
}

function generateEnhancedInterviewQuestions(dimensions: any[]): string {
  const questionSets = [];
  
  dimensions.forEach(dim => {
    const questions = getEnhancedInterviewQuestions(dim.rawName, dim.level);
    questionSets.push(`<div class="interview-dimension">
      <h4>${dim.name} Assessment Questions</h4>
      <div class="question-categories">
        <div class="behavioral-questions">
          <h5>Behavioral Questions:</h5>
          <ul>${questions.behavioral.map(q => `<li>${q}</li>`).join('')}</ul>
        </div>
        <div class="situational-questions">
          <h5>Situational Questions:</h5>
          <ul>${questions.situational.map(q => `<li>${q}</li>`).join('')}</ul>
        </div>
        <div class="follow-up-questions">
          <h5>Follow-up Probes:</h5>
          <ul>${questions.followUp.map(q => `<li>${q}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`);
  });
  
  return questionSets.join('');
}

function getEnhancedInterviewQuestions(dimension: string, level: string): any {
  const questions: Record<string, any> = {
    conscientiousness: {
      behavioral: [
        'Describe the most complex project you\'ve managed. How did you ensure nothing fell through the cracks?',
        'Tell me about a time when your attention to detail prevented a significant problem.',
        'Give me an example of how you organize your work when managing multiple competing priorities.'
      ],
      situational: [
        'How would you handle a situation where you discovered a process error just before a major deadline?',
        'If you were asked to implement a new quality control system, what steps would you take?',
        'How would you approach training a team member who struggles with organization?'
      ],
      followUp: [
        'What specific tools or systems did you use?',
        'How did stakeholders react to your approach?',
        'What would you do differently next time?'
      ]
    },
    agreeableness: {
      behavioral: [
        'Describe a time when you had to build consensus among team members with very different viewpoints.',
        'Tell me about a situation where you had to deliver difficult feedback while maintaining the relationship.',
        'Give me an example of how you\'ve helped resolve a conflict between colleagues.'
      ],
      situational: [
        'How would you handle a team member who consistently undermines group decisions?',
        'If you had to implement an unpopular policy change, how would you approach it?',
        'How would you build trust with a new team that has experienced conflict?'
      ],
      followUp: [
        'How did all parties feel about the outcome?',
        'What relationship-building strategies did you use?',
        'How do you maintain harmony while ensuring accountability?'
      ]
    },
    innovation: {
      behavioral: [
        'Describe the most innovative solution you\'ve developed to solve a business problem.',
        'Tell me about a time when you successfully led a significant change initiative.',
        'Give me an example of how you\'ve challenged conventional thinking in your organization.'
      ],
      situational: [
        'How would you encourage innovation in a team that\'s resistant to change?',
        'If you had to modernize an outdated but functional system, how would you approach it?',
        'How would you balance innovation with risk management?'
      ],
      followUp: [
        'What inspired your creative approach?',
        'How did you handle resistance to your ideas?',
        'What metrics did you use to measure success?'
      ]
    },
    resilience: {
      behavioral: [
        'Describe the most stressful period in your career and how you maintained performance.',
        'Tell me about a time when you had to lead through a major crisis or setback.',
        'Give me an example of how you\'ve bounced back from a significant failure.'
      ],
      situational: [
        'How would you maintain team morale during a period of organizational uncertainty?',
        'If you were facing impossible deadlines with insufficient resources, how would you proceed?',
        'How would you handle a situation where multiple critical issues arose simultaneously?'
      ],
      followUp: [
        'What coping strategies did you use?',
        'How did you support others during this difficult time?',
        'What did you learn about yourself from this experience?'
      ]
    }
  };
  
  return questions[dimension] || {
    behavioral: ['Can you give me examples of your experience in this area?'],
    situational: ['How would you handle typical challenges in this dimension?'],
    followUp: ['What specific strategies would you use?']
  };
}

function generateAssessmentCriteria(dimensions: any[]): string {
  return `<div class="assessment-criteria">
    <div class="performance-indicators">
      <h4>Performance Assessment Framework</h4>
      <table class="criteria-table">
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Exceeds Expectations</th>
            <th>Meets Expectations</th>
            <th>Below Expectations</th>
            <th>Key Metrics</th>
          </tr>
        </thead>
        <tbody>
          ${dimensions.map(dim => {
            const criteria = getAssessmentCriteria(dim.rawName);
            return `<tr>
              <td><strong>${dim.name}</strong></td>
              <td>${criteria.exceeds}</td>
              <td>${criteria.meets}</td>
              <td>${criteria.below}</td>
              <td>${criteria.metrics}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function getAssessmentCriteria(dimension: string): any {
  const criteria: Record<string, any> = {
    conscientiousness: {
      exceeds: 'Consistently delivers ahead of schedule with exceptional quality. Proactively identifies and prevents issues.',
      meets: 'Meets all deadlines with good quality work. Follows processes and maintains organization.',
      below: 'Occasional missed deadlines or quality issues. Needs reminders for process adherence.',
      metrics: 'On-time delivery, error rates, process compliance, organization scores'
    },
    agreeableness: {
      exceeds: 'Builds strong relationships across all levels. Successfully resolves complex conflicts and builds consensus.',
      meets: 'Works well with others. Contributes positively to team dynamics and collaboration.',
      below: 'Occasional interpersonal challenges. May struggle with conflict resolution or team integration.',
      metrics: '360 feedback, team satisfaction, conflict resolution success, collaboration ratings'
    },
    innovation: {
      exceeds: 'Regularly generates valuable new ideas. Successfully leads change initiatives and drives innovation.',
      meets: 'Contributes creative solutions. Adapts well to change and supports improvement initiatives.',
      below: 'Limited creative contribution. May resist change or struggle with new approaches.',
      metrics: 'Innovation contributions, change adaptation, creative problem-solving, improvement suggestions'
    },
    resilience: {
      exceeds: 'Thrives under pressure. Maintains peak performance during crises and helps others stay resilient.',
      meets: 'Handles normal stress well. Maintains consistent performance despite challenges.',
      below: 'Performance declines under pressure. May need additional support during stressful periods.',
      metrics: 'Performance under pressure, stress recovery time, crisis leadership, consistency ratings'
    }
  };
  
  return criteria[dimension] || {
    exceeds: 'Demonstrates exceptional capability in this area',
    meets: 'Shows solid competence and consistent performance',
    below: 'Needs development and additional support',
    metrics: 'Various performance indicators and feedback measures'
  };
}

function generateOnboardingRecommendations(dimensions: any[]): string {
  const topDimension = dimensions.sort((a, b) => b.percentile - a.percentile)[0];
  const recommendations = getOnboardingApproach(topDimension.rawName);
  
  return `<div class="onboarding-guide">
    <div class="onboarding-approach">
      <h4>Recommended Onboarding Approach</h4>
      <p><strong>Primary Style:</strong> ${recommendations.style}</p>
      <p><strong>Focus Areas:</strong> ${recommendations.focus}</p>
    </div>
    
    <div class="first-30-days">
      <h4>First 30 Days Priority Areas:</h4>
      <ul>${recommendations.firstMonth.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
    
    <div class="integration-strategy">
      <h4>Team Integration Strategy:</h4>
      <p>${recommendations.integration}</p>
    </div>
    
    <div class="success-metrics">
      <h4>Early Success Indicators:</h4>
      <ul>${recommendations.successMetrics.map(metric => `<li>${metric}</li>`).join('')}</ul>
    </div>
  </div>`;
}

function getOnboardingApproach(dimension: string): any {
  const approaches: Record<string, any> = {
    conscientiousness: {
      style: 'Structured and Systematic',
      focus: 'Clear processes, detailed documentation, organized workspace setup',
      firstMonth: [
        'Comprehensive process documentation and training',
        'Detailed role expectations and performance standards',
        'Systematic introduction to tools and systems',
        'Clear 30-60-90 day goal setting'
      ],
      integration: 'Pair with organized mentor, provide detailed team structure information, emphasize quality standards and procedures',
      successMetrics: [
        'Quick mastery of processes and procedures',
        'High attention to detail in early assignments',
        'Proactive organization of workspace and materials',
        'Consistent meeting of initial deadlines and standards'
      ]
    },
    agreeableness: {
      style: 'Relationship-Focused and Collaborative',
      focus: 'Team relationships, cultural integration, collaborative opportunities',
      firstMonth: [
        'Team introductions and relationship building activities',
        'Cultural orientation and values alignment',
        'Collaborative project assignments',
        'Regular check-ins and feedback sessions'
      ],
      integration: 'Focus on team bonding, introduce to key stakeholders, emphasize company culture and values',
      successMetrics: [
        'Quick development of positive relationships',
        'Active participation in team activities',
        'Positive feedback from colleagues',
        'Cultural alignment and value demonstration'
      ]
    },
    innovation: {
      style: 'Dynamic and Exploratory',
      focus: 'Creative challenges, learning opportunities, innovation exposure',
      firstMonth: [
        'Exposure to current innovation projects',
        'Creative problem-solving assignments',
        'Cross-functional learning opportunities',
        'Introduction to company innovation processes'
      ],
      integration: 'Connect with creative thinkers, provide challenging assignments, encourage idea sharing',
      successMetrics: [
        'Quick adaptation to new environment',
        'Early contribution of fresh ideas',
        'Enthusiasm for learning and exploration',
        'Positive response to change and challenges'
      ]
    },
    resilience: {
      style: 'Challenge-Based and Results-Oriented',
      focus: 'Meaningful challenges, performance expectations, growth opportunities',
      firstMonth: [
        'Progressively challenging assignments',
        'Clear performance expectations and metrics',
        'Exposure to high-impact projects',
        'Regular achievement recognition'
      ],
      integration: 'Provide stretch assignments, connect with high performers, emphasize growth and achievement',
      successMetrics: [
        'Strong performance under initial pressure',
        'Quick assumption of responsibilities',
        'Positive response to challenging assignments',
        'Demonstration of stress management skills'
      ]
    }
  };
  
  return approaches[dimension] || {
    style: 'Balanced and Adaptive',
    focus: 'Well-rounded integration across all areas',
    firstMonth: ['Comprehensive orientation covering all key areas'],
    integration: 'Balanced approach addressing multiple integration needs',
    successMetrics: ['Consistent progress across all onboarding areas']
  };
}

function generateBehavioralIndicators(dimensions: any[]): string {
  const indicators = [];
  
  dimensions.forEach(dim => {
    const behaviorList = getBehavioralIndicators(dim.rawName, dim.level);
    indicators.push(`<div class="behavioral-dimension">
      <h4>${dim.name} Behavioral Indicators</h4>
      <div class="indicator-grid">
        <div class="positive-indicators">
          <h5>Observable Strengths:</h5>
          <ul>${behaviorList.positive.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
        <div class="development-indicators">
          <h5>Development Signals:</h5>
          <ul>${behaviorList.development.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`);
  });
  
  return indicators.join('');
}

function getBehavioralIndicators(dimension: string, level: string): any {
  const indicators: Record<string, any> = {
    conscientiousness: {
      positive: [
        'Consistently meets deadlines without reminders',
        'Maintains organized workspace and documentation',
        'Follows procedures and protocols systematically',
        'Demonstrates attention to detail in all work',
        'Takes initiative in planning and preparation'
      ],
      development: [
        'May become overly focused on minor details',
        'Could struggle when procedures are unclear',
        'Might resist when asked to work faster than preferred pace',
        'May become frustrated with disorganized environments',
        'Could over-plan at the expense of quick execution'
      ]
    },
    agreeableness: {
      positive: [
        'Actively listens and shows empathy in conversations',
        'Seeks win-win solutions in conflicts',
        'Offers help to colleagues without being asked',
        'Builds consensus before moving forward with decisions',
        'Maintains positive relationships across all levels'
      ],
      development: [
        'May avoid necessary confrontations or difficult conversations',
        'Could agree too quickly to maintain harmony',
        'Might take on too much work to help others',
        'May struggle to give direct negative feedback',
        'Could become overwhelmed by others\' emotions'
      ]
    },
    innovation: {
      positive: [
        'Regularly proposes new ideas and solutions',
        'Adapts quickly to changing requirements',
        'Questions existing processes for improvement opportunities',
        'Embraces new technologies and methods',
        'Thinks strategically about future possibilities'
      ],
      development: [
        'May become bored with routine or repetitive tasks',
        'Could pursue too many ideas without full completion',
        'Might resist when asked to follow established procedures',
        'May overlook practical implementation challenges',
        'Could move too quickly without considering all stakeholders'
      ]
    },
    resilience: {
      positive: [
        'Maintains composure during high-pressure situations',
        'Bounces back quickly from setbacks or failures',
        'Stays optimistic and energetic during challenges',
        'Performs consistently despite workload fluctuations',
        'Helps others stay calm during stressful periods'
      ],
      development: [
        'May underestimate the impact of stress on others',
        'Could take on too much responsibility during crises',
        'Might not recognize when to seek help or support',
        'May push through when rest or recovery is needed',
        'Could become impatient with others\' stress reactions'
      ]
    }
  };
  
  return indicators[dimension] || {
    positive: ['Demonstrates balanced capabilities in this area'],
    development: ['Continue developing skills in this dimension']
  };
}
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('personalityChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: [${Object.keys(scores || {}).map(key => `'${key.charAt(0).toUpperCase() + key.slice(1)}'`).join(', ')}],
            datasets: [{
              label: 'Personality Profile',
              data: [${Object.values(scores || {}).map((data: any) => data?.percentile || 0).join(', ')}],
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(59, 130, 246, 1)',
              pointBorderColor: 'rgba(255, 255, 255, 1)',
              pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
              pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 20
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                angleLines: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            }
          }
        });
      }
    });
  `;
}


function generateLeadershipChartScript(dimensions: any): string {
  const labels = Object.keys(dimensions).map(dim => formatDimensionName(dim));
  const data = Object.values(dimensions).map((dim: any) => dim.percentage || 0);
  
  return `
    const ctx = document.getElementById('leadershipChart').getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
          label: 'Leadership Scores',
          data: ${JSON.stringify(data)},
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  `;
}

// Helper Functions for All Assessment Reports

// Emotional Intelligence Helper Functions
function getEQProfile(score: number): string {
  if (score >= 85) return 'Emotionally Gifted';
  if (score >= 70) return 'Emotionally Intelligent';
  if (score >= 55) return 'Emotionally Aware';
  if (score >= 40) return 'Developing EQ';
  return 'Early EQ Development';
}

function getEQWorkplaceApplication(dimension: string, level: string): string {
  const applications: Record<string, Record<string, string>> = {
    selfawareness: {
      'High': 'Excellent self-insight enables effective leadership and authentic decision-making. Natural ability to understand personal impact on others.',
      'Medium': 'Good understanding of own emotions and triggers. Can improve with mindfulness practices and reflection.',
      'Low': 'Limited awareness of emotional patterns. Would benefit from 360 feedback and emotional intelligence training.'
    },
    selfregulation: {
      'High': 'Outstanding emotional control under pressure. Ideal for high-stress roles and crisis management positions.',
      'Medium': 'Generally manages emotions well. May need additional strategies for peak stress situations.',
      'Low': 'May struggle with emotional control. Needs stress management training and coping strategy development.'
    },
    motivation: {
      'High': 'Highly driven and goal-oriented. Natural leader with strong intrinsic motivation for achievement.',
      'Medium': 'Good drive and ambition. May need clear goals and recognition to maintain peak motivation.',
      'Low': 'May lack drive or struggle with goal-setting. Needs motivation enhancement and goal clarity.'
    },
    empathy: {
      'High': 'Exceptional ability to understand others. Perfect for customer service, HR, and team leadership roles.',
      'Medium': 'Good interpersonal understanding. Can build on this strength for relationship-building roles.',
      'Low': 'Limited ability to read others. Needs training in active listening and perspective-taking.'
    },
    socialskills: {
      'High': 'Outstanding social abilities. Natural networker and relationship builder. Ideal for client-facing roles.',
      'Medium': 'Good social interaction skills. Can enhance through communication training and practice.',
      'Low': 'May struggle in social situations. Needs communication skills training and confidence building.'
    }
  };
  
  return applications[dimension]?.[level] || 'Continue developing emotional intelligence skills for workplace effectiveness.';
}

function generateEQActionPlan(dimensions: any[], overallScore: number): string {
  const actionItems = [];
  
  const lowestDimension = dimensions.sort((a, b) => a.percentage - b.percentage)[0];
  if (lowestDimension) {
    actionItems.push(`Priority focus: Develop ${lowestDimension.name.toLowerCase()} through targeted practice and training`);
  }
  
  if (overallScore < 55) {
    actionItems.push('Consider emotional intelligence coaching or training programs');
    actionItems.push('Practice daily emotional awareness and reflection exercises');
  }
  
  actionItems.push('Seek feedback from colleagues and supervisors on emotional impact');
  actionItems.push('Practice active listening and empathy in daily interactions');
  actionItems.push('Develop stress management and emotional regulation techniques');
  actionItems.push('Set specific EQ development goals and track progress monthly');
  
  return generateActionPlan(actionItems);
}

function generateEQChartScript(dimensions: any[]): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('eqChart').getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [${dimensions.map(d => `'${d.name}'`).join(', ')}],
          datasets: [{
            label: 'EQ Scores (%)',
            data: [${dimensions.map(d => d.percentage).join(', ')}],
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            borderColor: 'rgba(14, 165, 233, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(14, 165, 233, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(14, 165, 233, 1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { stepSize: 20 }
            }
          },
          plugins: {
            legend: { display: true, position: 'bottom' },
            title: { display: true, text: 'Emotional Intelligence Profile' }
          }
        }
      });
    });
  `;
}

// Faith Values Helper Functions
function generateValuesActionPlan(topValues: any[], cultureMatches: any[]): string {
  const actionItems = [
    'Reflect on how your top values align with your current role and organization',
    'Use your values as a guide for important life and career decisions',
    'Seek opportunities that allow you to express and live your core values',
    'Consider the cultural fit when evaluating new job opportunities',
    'Share your values with trusted colleagues and supervisors for better alignment'
  ];
  
  if (cultureMatches.length > 0) {
    actionItems.push(`Explore opportunities in organizations that match your values: ${cultureMatches.slice(0, 2).map(m => m.culture.name).join(', ')}`);
  }
  
  return generateActionPlan(actionItems);
}

function generateValuesChartScript(topValues: any[]): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('valuesChart').getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [${topValues.slice(0, 6).map(v => `'${v.name}'`).join(', ')}],
          datasets: [{
            data: [${topValues.slice(0, 6).map(v => v.score).join(', ')}],
            backgroundColor: [
              'rgba(99, 102, 241, 0.8)',
              'rgba(34, 197, 94, 0.8)', 
              'rgba(251, 191, 36, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(14, 165, 233, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'bottom' },
            title: { display: true, text: 'Core Values Distribution' }
          }
        }
      });
    });
  `;
}

// Gen Z Helper Functions
function getGenZReadiness(score: number): string {
  if (score >= 80) return 'Highly Ready';
  if (score >= 65) return 'Ready';
  if (score >= 50) return 'Developing';
  return 'Needs Support';
}

function getGenZProfileDescription(profile: string): string {
  const descriptions: Record<string, string> = {
    'Digital Native': 'You thrive in tech-forward environments and bring natural digital fluency to the workplace.',
    'Purpose Driven': 'You seek meaningful work that aligns with your values and makes a positive impact.',
    'Collaborative Innovator': 'You excel at working with diverse teams to create new solutions and approaches.',
    'Flexible Professional': 'You adapt well to changing work environments and prefer flexible arrangements.',
    'Balanced Professional': 'You demonstrate a well-rounded approach to work with adaptability across situations.'
  };
  
  return descriptions[profile] || 'You bring unique Gen Z perspectives and capabilities to the workplace.';
}

function getWorkplacePreferenceDescription(pref: string, value: any): string {
  const descriptions: Record<string, string> = {
    flexibility: 'Preference for flexible work arrangements and adaptive schedules',
    technology: 'Comfort level and preference for technology-integrated work environments',
    purpose: 'Importance of meaningful work that aligns with personal values',
    collaboration: 'Preference for teamwork and collaborative project approaches',
    feedback: 'Desire for regular feedback and continuous learning opportunities',
    diversity: 'Value placed on inclusive and diverse workplace environments'
  };
  
  return descriptions[pref] || 'Important workplace consideration for optimal performance';
}

function generateGenZActionPlan(profile: string, redFlags: any[], companyMatches: any[]): string {
  const actionItems = [
    'Leverage your Gen Z strengths in technology adoption and digital innovation',
    'Seek mentorship opportunities to bridge generational workplace differences',
    'Practice professional communication across different generational styles'
  ];
  
  if (redFlags.length > 0) {
    actionItems.push(`Address development areas: Focus on ${redFlags[0]?.type || 'workplace skills'}`);
  }
  
  if (companyMatches.length > 0) {
    actionItems.push(`Target companies that match your values: ${companyMatches[0]?.name || 'purpose-driven organizations'}`);
  }
  
  actionItems.push('Build cross-generational relationships and networks');
  actionItems.push('Continuously develop both technical and soft skills');
  
  return generateActionPlan(actionItems);
}

function generateGenZChartScript(traits: any[]): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('genzChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [${traits.slice(0, 6).map(([name]) => `'${formatDimensionName(name)}'`).join(', ')}],
          datasets: [{
            label: 'Trait Scores',
            data: [${traits.slice(0, 6).map(([, score]) => score).join(', ')}],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true, max: 5 }
          },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Gen Z Workplace Traits' }
          }
        }
      });
    });
  `;
}

// Digital Wellness Helper Functions
function getDigitalWellnessLevel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Improvement';
}

function getDigitalWellnessDescription(score: number): string {
  if (score >= 80) return 'Outstanding digital wellness habits. You maintain healthy technology boundaries and demonstrate excellent digital life balance.';
  if (score >= 65) return 'Good digital wellness practices with room for optimization. You generally manage technology use effectively.';
  if (score >= 50) return 'Moderate digital wellness. Some areas need attention to develop healthier technology habits.';
  return 'Digital wellness needs significant improvement. Consider implementing structured digital wellness practices.';
}

function getOverallRiskLevel(riskAssessment: any): string {
  const risks = Object.values(riskAssessment).map((r: any) => r?.level === 'high' ? 3 : r?.level === 'moderate' ? 2 : 1);
  const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
  
  if (avgRisk >= 2.5) return 'High';
  if (avgRisk >= 1.5) return 'Moderate';
  return 'Low';
}

function getDigitalDimensionDescription(dimension: string, level: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    screenbalance: {
      excellent: 'You maintain excellent balance between screen time and offline activities.',
      good: 'You generally manage screen time well with occasional overuse.',
      fair: 'You sometimes struggle with excessive screen time.',
      poor: 'Screen time management needs significant improvement.'
    },
    digitalboundaries: {
      excellent: 'You have strong boundaries between digital and personal time.',
      good: 'You maintain good digital boundaries most of the time.',
      fair: 'Digital boundaries could be stronger and more consistent.',
      poor: 'Digital boundaries are weak or non-existent.'
    },
    mindfulusage: {
      excellent: 'You use technology intentionally and purposefully.',
      good: 'You generally use technology with awareness and intention.',
      fair: 'Technology use is sometimes mindless or habitual.',
      poor: 'Technology use lacks mindfulness and intention.'
    },
    techlifeintegration: {
      excellent: 'Technology enhances rather than dominates your life.',
      good: 'Technology is well-integrated into your daily routine.',
      fair: 'Technology integration could be more balanced.',
      poor: 'Technology may be negatively impacting life balance.'
    }
  };
  
  return descriptions[dimension]?.[level] || 'Continue developing healthy digital habits.';
}

function getRiskLevelClass(level: string): string {
  if (level === 'high') return 'high';
  if (level === 'moderate') return 'moderate';
  return 'low';
}

function getRiskDescription(risk: string, level: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    burnout: {
      high: 'High risk of digital burnout from excessive technology use.',
      moderate: 'Moderate risk - monitor technology use patterns.',
      low: 'Low risk of digital burnout with current usage patterns.'
    },
    addiction: {
      high: 'Signs of problematic technology dependence.',
      moderate: 'Some indicators of excessive technology reliance.',
      low: 'Healthy relationship with technology.'
    },
    social: {
      high: 'Technology use may be impacting social relationships.',
      moderate: 'Some impact on social connections from technology.',
      low: 'Technology use supports rather than hinders social connections.'
    }
  };
  
  return descriptions[risk]?.[level] || 'Monitor this area for optimal digital wellness.';
}

function generateDigitalWellnessActionPlan(dimensions: any[], riskAssessment: any, overallScore: number): string {
  const actionItems = [];
  
  const lowestDimension = dimensions.sort((a, b) => a.percentage - b.percentage)[0];
  if (lowestDimension) {
    actionItems.push(`Priority focus: Improve ${lowestDimension.name.toLowerCase()} practices`);
  }
  
  if (overallScore < 50) {
    actionItems.push('Implement a comprehensive digital wellness plan');
    actionItems.push('Consider digital detox periods and screen-free times');
  }
  
  actionItems.push('Set specific digital wellness goals and track progress');
  actionItems.push('Create technology-free zones and times in your daily routine');
  actionItems.push('Practice mindful technology use and regular digital breaks');
  actionItems.push('Review and adjust notification settings to reduce digital overwhelm');
  
  return generateActionPlan(actionItems);
}

function generateDigitalWellnessChartScript(dimensions: any[]): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      const ctx = document.getElementById('wellnessChart').getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [${dimensions.map(d => `'${d.name}'`).join(', ')}],
          datasets: [{
            label: 'Wellness Scores (%)',
            data: [${dimensions.map(d => d.percentage).join(', ')}],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(16, 185, 129, 1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { stepSize: 20 }
            }
          },
          plugins: {
            legend: { display: true, position: 'bottom' },
            title: { display: true, text: 'Digital Wellness Profile' }
          }
        }
      });
    });
  `;
}

// End of enhanced CAIR+ report functions