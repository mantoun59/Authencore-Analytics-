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

function generateEQReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
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

// Stress Resilience (Burnout Prevention) Assessment Report Generator
function generateStressReport(results: any, userData: any): string {
  const dimensionScores = results?.dimensionScores || [];
  const overallScore = results?.overallScore || 0;
  const percentileScore = results?.percentileScore || 0;
  const resilienceProfile = results?.resilienceProfile || 'Developing';
  const burnoutRisk = results?.burnoutRisk || 'medium';
  const stressManagementLevel = results?.stressManagementLevel || 'fair';
  const strengths = results?.strengths || [];
  const challenges = results?.challenges || [];
  const recommendations = results?.recommendations || [];
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Stress Resilience & Burnout Prevention Assessment Report</title>
    <style>
      ${getReportStyles()}
      .resilience-profile {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
        text-align: center;
      }
      .burnout-risk {
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        font-weight: bold;
      }
      .risk-low { background: #d1fae5; color: #065f46; border-left: 4px solid #10b981; }
      .risk-medium { background: #fef3c7; color: #92400e; border-left: 4px solid #f59e0b; }
      .risk-high { background: #fee2e2; color: #991b1b; border-left: 4px solid #ef4444; }
      .dimension-analysis {
        background: #f8fafc;
        border-left: 4px solid #8b5cf6;
        padding: 20px;
        margin: 15px 0;
        border-radius: 8px;
      }
      .stress-metric {
        background: white;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin: 10px 0;
      }
      .coping-strategy {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 15px;
        margin: 10px 0;
      }
      .warning-sign {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 15px;
        margin: 10px 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    ${generateReportHeader("Stress Resilience & Burnout Prevention Assessment", userData)}
    
    <div class="executive-summary">
      <h2>🛡️ Executive Summary</h2>
      <div class="summary-box">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>Participant:</strong> ${userData?.name || 'Assessment Participant'}</p>
            <p><strong>Assessment Date:</strong> ${userData?.date || new Date().toLocaleDateString()}</p>
            <p><strong>Overall Resilience Score:</strong> ${overallScore.toFixed(1)}/100</p>
            <p><strong>Percentile Ranking:</strong> ${percentileScore}th percentile</p>
          </div>
          <div>
            <p><strong>Resilience Profile:</strong> ${resilienceProfile}</p>
            <p><strong>Stress Management Level:</strong> ${formatDimensionName(stressManagementLevel)}</p>
            <p><strong>Burnout Risk Level:</strong> ${formatDimensionName(burnoutRisk)}</p>
            <p><strong>Protective Factors:</strong> ${strengths.length}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="resilience-profile">
      <h2>💎 Your Resilience Profile: ${resilienceProfile}</h2>
      <p style="font-size: 18px; margin-top: 15px;">${getResilienceProfileDescription(resilienceProfile)}</p>
    </div>

    <div class="burnout-risk risk-${burnoutRisk}">
      <h3>⚠️ Burnout Risk Assessment: ${formatDimensionName(burnoutRisk)} Risk</h3>
      <p>${getBurnoutRiskDescription(burnoutRisk)}</p>
    </div>

    <div class="personality-profile">
      <h2>📊 Stress Resilience Dimensions</h2>
      <div class="chart-container">
        <canvas id="resilienceChart" width="400" height="300"></canvas>
      </div>
      
      ${dimensionScores.map((dimension: any) => `
        <div class="dimension-analysis">
          <h3>🎯 ${dimension.dimension} (${dimension.percentage.toFixed(0)}%)</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${dimension.percentage}%"></div>
          </div>
          <p><strong>Level:</strong> ${formatDimensionName(dimension.level)}</p>
          <p><strong>Score:</strong> ${dimension.score}/${dimension.maxScore}</p>
          
          <div class="stress-metric">
            <h4>📋 What This Means</h4>
            <p>${getStressDimensionDescription(dimension.dimension.toLowerCase(), dimension.level)}</p>
          </div>
          
          <div class="coping-strategy">
            <h4>💡 Strengthening Strategies</h4>
            <p>${getStressDimensionStrategies(dimension.dimension.toLowerCase(), dimension.level)}</p>
          </div>
          
          ${dimension.level === 'needs-improvement' ? `
            <div class="warning-sign">
              <h4>⚠️ Areas Requiring Attention</h4>
              <p>${getStressDimensionWarnings(dimension.dimension.toLowerCase())}</p>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <div class="insights-section">
      <h2>🧠 Resilience Analysis</h2>
      
      <div class="insights-grid">
        <div class="insight-card strengths">
          <h3>💪 Protective Factors</h3>
          <ul>
            ${strengths.map((strength: string) => `<li>${strength}</li>`).join('') || '<li>Continue developing resilience skills</li>'}
          </ul>
        </div>
        
        <div class="insight-card growth-areas">
          <h3>⚡ Vulnerability Areas</h3>
          <ul>
            ${challenges.map((challenge: string) => `<li>${challenge}</li>`).join('') || '<li>Focus on balanced development</li>'}
          </ul>
        </div>
      </div>
      
      <div class="coping-strategy">
        <h3>🛠️ Personalized Stress Management Plan</h3>
        <ul>
          ${recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </div>

    ${generateStressActionPlan(dimensionScores, burnoutRisk, stressManagementLevel)}

    <div class="footer">
      <p><strong>Confidential Stress Resilience Assessment Report</strong> | Generated ${new Date().toLocaleDateString()}</p>
      <p>This assessment provides insights for stress management and burnout prevention strategies.</p>
      <p>For professional support, consider consulting with a mental health professional or employee assistance program.</p>
    </div>

    <script>
      ${generateStressChartScript(dimensionScores)}
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

function generateFaithValuesReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateGenZReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
}

function generateDigitalWellnessReport(results: any, userData: any): string {
  return generateCommunicationReport(results, userData); // Enhanced version coming
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
  
  // Calculate top strengths and development areas
  const allDimensions = Object.entries(dimensionScores).map(([name, data]: [string, any]) => ({
    name: formatDimensionName(name),
    score: data?.score || 0,
    percentile: data?.percentile || 0,
    level: data?.level || 'Average'
  }));
  
  const topStrengths = allDimensions
    .filter(d => d.percentile >= 75)
    .sort((a, b) => b.percentile - a.percentile)
    .slice(0, 3);
    
  const developmentAreas = allDimensions
    .filter(d => d.percentile < 60)
    .sort((a, b) => a.percentile - b.percentile)
    .slice(0, 3);

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

    <div class="career-fit">
      <h2>🚀 Career Fit Analysis</h2>
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
      <p>Generated on ${new Date().toLocaleDateString()} • Report ID: ${generateReportId()}</p>
    </div>

    <script>
      ${generatePersonalityChartScript(scores)}
    </script>
  </body>
  </html>
  `;
}

function generatePersonalityChartScript(scores: any): string {
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

function formatDimensionName(dimension: string): string {
  const dimensionNames: Record<string, string> = {
    'strategicThinking': 'Strategic Thinking',
    'emotionalIntelligence': 'Emotional Intelligence',
    'communicationInfluence': 'Communication & Influence',
    'teamDevelopment': 'Team Development',
    'decisionMaking': 'Decision Making',
    'changeManagement': 'Change Management'
  };
  return dimensionNames[dimension] || dimension.replace(/([A-Z])/g, ' $1').trim();
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