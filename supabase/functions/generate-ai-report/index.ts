import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!openAIApiKey) {
  console.error('OPENAI_API_KEY is not set');
}

if (!supabaseUrl) {
  console.error('SUPABASE_URL is not set');
}

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssessmentResult {
  id: string;
  assessment_type: string;
  results: any;
  user_id: string;
}

interface ReportRequest {
  assessmentResultId: string;
  reportType: 'candidate' | 'employer';
  candidateInfo: {
    name: string;
    email: string;
    age?: number;
    experience?: string;
    position?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { assessmentResultId, reportType, candidateInfo }: ReportRequest = await req.json();

    // Check if this is a sample report (mock data)
    const isSampleReport = assessmentResultId === 'mock-assessment-id';
    
    let assessmentResult: AssessmentResult;
    
    if (isSampleReport) {
      // Use mock data for sample reports
      assessmentResult = {
        id: 'mock-assessment-id',
        assessment_type: 'leadership',
        results: {
          dimensions: {
            leadership: 85,
            communication: 78,
            strategic_thinking: 82,
            team_building: 88,
            decision_making: 79,
            emotional_intelligence: 84
          },
          responses: Array.from({ length: 20 }, (_, i) => ({
            questionId: `q${i + 1}`,
            response: Math.floor(Math.random() * 5) + 1,
            responseTime: Math.floor(Math.random() * 10) + 3
          }))
        },
        user_id: 'sample-user'
      };
    } else {
      // Get the authorization header for real reports
      const authHeader = req.headers.get('authorization');
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      // Fetch assessment result
      const { data: fetchedResult, error: assessmentError } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('id', assessmentResultId)
        .single();

      if (assessmentError || !fetchedResult) {
        throw new Error('Assessment result not found');
      }
      
      assessmentResult = fetchedResult;
    }

    // Generate AI-powered report content
    const reportContent = await generateAIReport(
      assessmentResult,
      reportType,
      candidateInfo
    );

    // Store generated report (skip for sample reports)
    let generatedReportId = 'sample-report-id';
    
    if (!isSampleReport) {
      const { data: generatedReport, error: insertError } = await supabase
        .from('generated_reports')
        .insert({
          user_id: assessmentResult.user_id,
          assessment_result_id: assessmentResultId,
          report_type: reportType,
          report_data: reportContent
        })
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to store generated report');
      }
      
      generatedReportId = generatedReport.id;
    }

    return new Response(JSON.stringify({
      success: true,
      reportId: generatedReportId,
      reportContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-report function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateAIReport(
  assessmentResult: AssessmentResult,
  reportType: 'candidate' | 'employer',
  candidateInfo: any
) {
  const { assessment_type, results } = assessmentResult;

  // Generate personalized insights using OpenAI
  const insights = await generatePersonalizedInsights(results, candidateInfo, assessment_type);
  
  // Generate strengths and development areas
  const strengthsAndDevelopment = await generateStrengthsAndDevelopment(results, assessment_type);
  
  // Generate action plan
  const actionPlan = await generateActionPlan(results, candidateInfo, assessment_type);
  
  // Calculate distortion scale (for employer reports)
  const distortionScale = calculateDistortionScale(results);
  
  // Generate interview questions (for employer reports)
  const interviewQuestions = reportType === 'employer' 
    ? await generateInterviewQuestions(results, candidateInfo, assessment_type)
    : null;

  // Generate risk assessment (for employer reports)
  const riskAssessment = reportType === 'employer'
    ? await generateRiskAssessment(results, candidateInfo, assessment_type)
    : null;

  // Generate career recommendations
  const careerRecommendations = await generateCareerRecommendations(results, candidateInfo, assessment_type);

  return {
    candidateInfo: {
      name: candidateInfo.name,
      email: candidateInfo.email,
      completionDate: new Date().toISOString(),
      assessmentType: assessment_type,
      assessmentId: assessmentResult.id
    },
    executiveSummary: {
      overallScore: calculateOverallScore(results),
      keyInsights: insights.keyInsights,
      topStrengths: strengthsAndDevelopment.topStrengths,
      developmentAreas: strengthsAndDevelopment.developmentAreas,
      recommendedActions: actionPlan.immediateActions.slice(0, 3)
    },
    detailedAnalysis: {
      dimensionScores: results.dimensions || {},
      personalizedInsights: insights.detailed,
      behavioralPatterns: insights.behavioralPatterns,
      validityMetrics: results.validityMetrics || {}
    },
    actionPlan: {
      immediate: actionPlan.immediateActions,
      shortTerm: actionPlan.shortTermActions,
      longTerm: actionPlan.longTermActions
    },
    careerGuidance: {
      recommendations: careerRecommendations.recommendations,
      pathways: careerRecommendations.pathways,
      skills: careerRecommendations.skillsToAcquire
    },
    ...(reportType === 'employer' && {
      employerSpecific: {
        summaryTable: {
          overallScore: calculateOverallScore(results),
          dimensions: results.dimensions || {},
          reliability: distortionScale.reliability
        },
        interviewQuestions: interviewQuestions,
        riskFlags: riskAssessment.riskFlags,
        hiringRecommendations: await generateHiringRecommendations(results, candidateInfo),
        onboardingPlan: await generateOnboardingPlan(results, candidateInfo)
      }
    }),
    distortionAnalysis: distortionScale
  };
}

async function generatePersonalizedInsights(results: any, candidateInfo: any, assessmentType: string) {
  const prompt = `
    You are a senior executive psychologist with 25+ years in talent assessment, holding doctoral credentials and specialized expertise in psychometric evaluation. 
    
    ASSESSMENT CONTEXT:
    - Assessment Type: ${assessmentType}
    - Candidate Profile: ${JSON.stringify(candidateInfo)}
    - Comprehensive Results Data: ${JSON.stringify(results)}
    
    ANALYSIS REQUIREMENTS:
    Conduct a thorough psychological assessment equivalent to executive-level evaluations used by Fortune 500 companies. 
    
    Your analysis must include:
    1. Statistical reliability validation of response patterns
    2. Cross-dimensional consistency analysis
    3. Cognitive load and processing style evaluation
    4. Behavioral prediction modeling
    5. Leadership readiness assessment
    6. Risk factor identification
    7. Cultural fit and adaptability analysis
    
    RESPONSE FORMAT (Strict JSON):
    {
      "executiveSummary": "Professional 200-word synthesis integrating cognitive assessment, personality dynamics, leadership capacity, and behavioral predictions with specific evidence from the data",
      "keyInsights": [
        "Cognitive processing style: [specific pattern] with implications for [workplace scenarios]",
        "Interpersonal effectiveness: [behavioral evidence] indicating [communication style] with team impact [specific prediction]",
        "Emotional regulation: [response pattern evidence] suggesting [stress management capability] in [high-pressure scenarios]",
        "Decision-making framework: [data evidence] revealing [analytical vs intuitive preference] affecting [strategic vs operational effectiveness]",
        "Leadership emergence: [behavioral indicators] predicting [leadership style] with [team dynamics outcome]",
        "Adaptability index: [change response patterns] indicating [flexibility level] in [organizational change scenarios]"
      ],
      "detailed": "Comprehensive 300-word psychological profile synthesizing: (1) Cognitive architecture - information processing style, analytical depth, creative thinking patterns; (2) Motivational ecosystem - intrinsic drivers, recognition needs, autonomy preferences; (3) Behavioral tendencies - communication patterns, conflict approach, collaboration style; (4) Performance predictors - stress response, learning agility, execution consistency; (5) Leadership DNA - influence style, team building capacity, strategic thinking",
      "behavioralPatterns": [
        "Communication effectiveness: [specific pattern from data] predicts [interaction outcome] in [team/client scenarios]",
        "Stress response architecture: [physiological/cognitive indicators] suggest [coping mechanism] with [performance impact] under pressure",
        "Decision velocity: [response time patterns] indicate [deliberative vs rapid] style affecting [operational vs strategic] roles",
        "Influence tactics: [behavioral evidence] reveals [persuasion style] with [team acceptance] probability",
        "Learning adaptation: [pattern recognition from responses] suggests [knowledge acquisition style] affecting [skill development timeline]",
        "Conflict navigation: [response patterns] indicate [approach style] with [resolution effectiveness] prediction"
      ],
      "cognitiveProfile": "Detailed cognitive architecture analysis: Processing speed: [evidence-based assessment], Working memory capacity: [pattern indicators], Abstract reasoning: [problem-solving evidence], Pattern recognition: [data synthesis capability], Strategic thinking: [long-term planning indicators], Creative problem-solving: [innovative approach evidence]",
      "motivationalDrivers": "Motivational ecosystem mapping: Primary drivers: [achievement/affiliation/power evidence], Recognition preferences: [feedback response patterns], Autonomy needs: [independence indicators], Growth orientation: [learning behavior evidence], Risk tolerance: [challenge-seeking patterns], Purpose alignment: [values-based response analysis]",
      "potentialDerailers": "Risk assessment based on behavioral evidence: [Specific derailer 1] with [probability] in [trigger scenarios], [Derailer 2] with [mitigation strategies], [Blind spot areas] requiring [development focus], [Stress amplifiers] needing [environmental modifications]"
    }
    
    CRITICAL REQUIREMENTS:
    - Base ALL insights on specific evidence from the assessment data
    - Provide quantitative confidence levels where applicable
    - Include predictive statements about workplace performance
    - Identify specific development interventions
    - Reference psychological research frameworks when relevant
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are a professional psychologist and career counselor. Provide detailed, personalized insights based on assessment results.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    console.error('OpenAI API error:', response.status, response.statusText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Unexpected OpenAI response format:', data);
    throw new Error('Invalid OpenAI API response format');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    const parsedContent = JSON.parse(content);
    return {
      keyInsights: parsedContent.keyInsights || ["Professional insights based on assessment data"],
      detailed: parsedContent.detailed || content,
      behavioralPatterns: parsedContent.behavioralPatterns || ["Behavioral patterns identified"],
      executiveSummary: parsedContent.executiveSummary || "Executive summary of candidate assessment",
      cognitiveProfile: parsedContent.cognitiveProfile || "Cognitive profile analysis",
      motivationalDrivers: parsedContent.motivationalDrivers || "Motivational driver analysis",
      potentialDerailers: parsedContent.potentialDerailers || "Potential development areas"
    };
  } catch (e) {
    return {
      keyInsights: ["Professional insights generated from comprehensive assessment analysis"],
      detailed: content,
      behavioralPatterns: ["Behavioral patterns identified from assessment responses"],
      executiveSummary: "Executive summary based on assessment results",
      cognitiveProfile: "Cognitive profile derived from assessment data",
      motivationalDrivers: "Motivational drivers identified through assessment",
      potentialDerailers: "Areas for continued development and awareness"
    };
  }
}

async function generateStrengthsAndDevelopment(results: any, assessmentType: string) {
  const prompt = `
    You are a senior talent assessment specialist with expertise in competency modeling and behavioral prediction.
    
    TASK: Analyze assessment data to identify signature strengths and critical development priorities.
    
    Assessment Type: ${assessmentType}
    Comprehensive Assessment Data: ${JSON.stringify(results)}
    
    ANALYSIS FRAMEWORK:
    1. Signature Strengths Analysis:
       - Identify top 20% performance areas with statistical significance
       - Assess transferability to workplace performance
       - Evaluate competitive advantage potential
       - Consider sustainability under stress
    
    2. Development Priority Matrix:
       - High-impact areas with greatest performance leverage
       - Skills critical for role effectiveness
       - Competencies affecting team dynamics
       - Areas limiting career advancement
    
    RESPONSE FORMAT (Strict JSON):
    {
      "topStrengths": [
        "Analytical Problem-Solving: [specific evidence] with [quantified impact prediction] in [workplace scenarios]",
        "Interpersonal Influence: [behavioral pattern] predicting [team effectiveness] with [leadership emergence probability]",
        "Adaptive Learning: [response pattern] indicating [skill acquisition speed] in [changing environments]",
        "Emotional Regulation: [stress response data] suggesting [performance stability] under [pressure scenarios]",
        "Strategic Communication: [communication pattern] with [message clarity] affecting [stakeholder engagement]"
      ],
      "developmentAreas": [
        "Technical Acumen: [gap analysis] requiring [specific intervention] for [role effectiveness] improvement",
        "Delegation Skills: [control tendency] needing [coaching approach] to enhance [team productivity]",
        "Change Agility: [adaptation patterns] requiring [development focus] for [organizational effectiveness]",
        "Conflict Resolution: [avoidance tendency] needing [skill building] for [relationship management]"
      ]
    }
    
    REQUIREMENTS:
    - Reference specific data points as evidence
    - Include quantified confidence levels where possible
    - Prioritize by workplace impact and development ROI
    - Ensure actionability and measurability
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are a professional assessment analyst. Provide specific, actionable strengths and development areas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 500
    }),
  });

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI API response format');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    return {
      topStrengths: ["Strong analytical skills", "Effective communication", "Adaptability", "Problem-solving abilities", "Leadership potential"],
      developmentAreas: ["Technical skills enhancement", "Emotional intelligence", "Strategic thinking", "Time management"]
    };
  }
}

async function generateActionPlan(results: any, candidateInfo: any, assessmentType: string) {
  const prompt = `
    You are an executive development specialist designing precision-targeted development interventions based on psychometric assessment data.
    
    DEVELOPMENT CONTEXT:
    Assessment Type: ${assessmentType}
    Individual Profile: ${JSON.stringify(candidateInfo)}
    Comprehensive Assessment Results: ${JSON.stringify(results)}
    
    DEVELOPMENT METHODOLOGY:
    Create a scientifically-informed, progressive development plan that maximizes ROI on development investment.
    
    Plan must address:
    1. Immediate skill activation (neuroplasticity window)
    2. Competency building with measurable milestones
    3. Strategic capability development for long-term effectiveness
    4. Risk mitigation for identified derailers
    5. Stretch assignments aligned with growth zones
    
    RESPONSE FORMAT (Strict JSON):
    {
      "immediateActions": [
        "Complete [specific assessment] to establish baseline for [development area] - Target: [measurable outcome] by [date]",
        "Initiate [behavioral practice] with [frequency] to strengthen [specific competency] - Success metric: [observable behavior]",
        "Schedule [feedback session] with [stakeholder] to address [development priority] - Deliverable: [action plan]",
        "Enroll in [specific resource/training] to accelerate [skill development] - Completion: [timeframe]"
      ],
      "shortTermActions": [
        "Launch [development project] requiring [target competencies] with [success criteria] over [3-6 month timeline]",
        "Establish [mentoring relationship] with [expertise type] to develop [strategic capability] - Milestone: [specific achievement]",
        "Complete [certification/program] in [development area] to achieve [competency level] - Validation: [assessment method]",
        "Lead [stretch assignment] leveraging [strengths] while developing [growth areas] - Outcome: [business impact]"
      ],
      "longTermActions": [
        "Pursue [advanced qualification/role] requiring [capability integration] for [career advancement] - Timeline: [6-18 months]",
        "Design and execute [significant project/initiative] demonstrating [leadership competencies] - Impact: [organizational benefit]",
        "Establish [thought leadership platform] in [expertise area] building [influence/network] - Metrics: [recognition indicators]"
      ]
    }
    
    CRITICAL REQUIREMENTS:
    - Every action must have measurable success criteria
    - Link actions to specific assessment findings
    - Include resource requirements and timelines
    - Ensure progressive skill building sequence
    - Address both performance enhancement and derailer mitigation
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are a career development specialist. Create specific, actionable plans based on assessment results.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    }),
  });

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI API response format');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    return {
      immediateActions: ["Review assessment results in detail", "Identify top 3 development priorities", "Create learning schedule", "Seek feedback from colleagues"],
      shortTermActions: ["Enroll in relevant training program", "Find a mentor in your field", "Join professional association", "Practice new skills daily"],
      longTermActions: ["Pursue advanced certification", "Take on leadership role", "Expand professional network"]
    };
  }
}

async function generateInterviewQuestions(results: any, candidateInfo: any, assessmentType: string) {
  const prompt = `
    You are a senior talent acquisition expert specializing in evidence-based interviewing and behavioral prediction.
    
    INTERVIEW DESIGN CONTEXT:
    Assessment Type: ${assessmentType}
    Candidate Profile: ${JSON.stringify(candidateInfo)}
    Assessment Results: ${JSON.stringify(results)}
    
    OBJECTIVE: Create a strategic interview guide that validates assessment findings and probes critical areas for hiring decisions.
    
    INTERVIEW METHODOLOGY:
    - Behavioral Event Interviewing (BEI) for past performance prediction
    - Situational Judgment Tests (SJT) for decision-making assessment
    - Competency-based questions targeting assessment dimensions
    - Development readiness evaluation
    - Cultural fit and values alignment probes
    
    RESPONSE FORMAT (Strict JSON):
    {
      "behavioralQuestions": [
        "Tell me about a specific time when [assessment strength area] - what was the situation, your actions, and the measurable results?",
        "Describe a challenging situation where you had to [development area] - walk me through your thought process and outcome.",
        "Give me an example of when you [specific competency from assessment] under pressure - what was your approach?",
        "Share a time when you received feedback about [development area] - how did you respond and what did you learn?"
      ],
      "technicalQuestions": [
        "How would you approach [role-specific scenario] given your [assessment strength]? Walk me through your methodology.",
        "What tools or frameworks do you use for [relevant skill area]? How do you ensure quality?",
        "Describe your experience with [technical competency] - what challenges have you encountered and how did you solve them?"
      ],
      "situationalQuestions": [
        "If you had to [challenging scenario relevant to role] with limited resources, how would you prioritize and execute?",
        "How would you handle a situation where [conflict scenario based on communication style assessment]?",
        "What would you do if [decision-making scenario] that requires [specific competency from assessment]?"
      ],
      "developmentQuestions": [
        "Based on your self-awareness, what area would you focus on developing next and why?",
        "How do you typically respond to feedback, especially in areas where you're still growing?"
      ],
      "probingQuestions": [
        "Can you elaborate on [specific assessment finding] - how does this show up in your daily work?",
        "I noticed [pattern from assessment] - can you give me a concrete example of this?",
        "Your assessment suggests [strength/challenge] - how has this impacted your team relationships?"
      ],
      "redFlags": [
        "Inconsistency between assessment results and interview responses about [specific area]",
        "Inability to provide specific examples for claimed [strength area]",
        "Defensive responses when discussing [development area identified in assessment]",
        "Lack of self-awareness about [assessment finding]"
      ]
    }
    
    REQUIREMENTS:
    - Directly reference specific assessment findings
    - Include follow-up probe questions
    - Focus on behavioral evidence and specific examples
    - Target high-impact competencies for the role
    - Design questions to validate or challenge assessment conclusions
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are an expert in behavioral interviewing and talent assessment. Generate targeted interview questions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI API response format');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(content);
    return {
      clarification: parsed.probingQuestions || ["Can you elaborate on your approach to teamwork?"],
      validation: parsed.behavioralQuestions || ["Describe a time when you had to overcome a significant challenge"],
      behavioral: parsed.situationalQuestions || ["How would you handle a situation where you disagree with your manager?"]
    };
  } catch (e) {
    return {
      clarification: ["Can you elaborate on your approach to teamwork?", "Tell me about your problem-solving style"],
      validation: ["Describe a time when you had to overcome a significant challenge", "Tell me about a situation where you had to work with a difficult team member"],
      behavioral: ["How would you handle a situation where you disagree with your manager?", "What would you do if you had competing priorities?"]
    };
  }
}

async function generateRiskAssessment(results: any, candidateInfo: any, assessmentType: string) {
  const overallScore = calculateOverallScore(results);
  const distortionScale = calculateDistortionScale(results);
  
  // Advanced risk modeling based on multiple factors
  const riskFlags = [];
  
  // Add risk flags based on assessment analysis
  if (overallScore < 60) {
    riskFlags.push("Low overall competency score requires additional training and support");
  }
  
  if (distortionScale.validityIndex < 70) {
    riskFlags.push("Response validity concerns - recommend behavioral interview validation");
  }
  
  // Check for extreme dimension variations
  const dimensionScores = Object.values(results.dimensions || {}).filter(score => typeof score === 'number');
  if (dimensionScores.length > 1) {
    const avg = dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length;
    const variance = Math.sqrt(dimensionScores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / dimensionScores.length);
    
    if (variance > 15) {
      riskFlags.push("High variance across competency dimensions indicates inconsistent skill development");
    }
  }
  
  // Check for specific dimension risks
  if (results.dimensions) {
    Object.entries(results.dimensions).forEach(([key, value]: [string, any]) => {
      const score = typeof value === 'object' ? value.score : value;
      if (score < 50) {
        riskFlags.push(`Critical gap in ${key.replace('_', ' ')} may impact job performance`);
      }
    });
  }
  
  return {
    riskFlags: riskFlags.length > 0 ? riskFlags : ["No significant risk factors identified"],
    recommendations: riskFlags.length > 2 ? 
      ["Consider additional screening", "Require extended probationary period", "Provide intensive onboarding support"] :
      ["Standard hiring process recommended", "Monitor development areas during onboarding"]
  };
}

async function generateCareerRecommendations(results: any, candidateInfo: any, assessmentType: string) {
  const prompt = `
    You are a strategic career architect with expertise in talent optimization and career trajectory modeling.
    
    CAREER OPTIMIZATION ANALYSIS:
    Assessment Type: ${assessmentType}
    Individual Profile: ${JSON.stringify(candidateInfo)}
    Psychometric Assessment Data: ${JSON.stringify(results)}
    
    ANALYTICAL FRAMEWORK:
    1. Strength-Role Alignment Analysis
    2. Growth Potential Mapping
    3. Industry Fit Assessment
    4. Leadership Readiness Evaluation
    5. Risk-Reward Career Modeling
    
    Generate evidence-based career guidance with:
    - Quantified fit probabilities
    - Market demand analysis
    - Skill gap identification
    - Timeline projections
    - Success probability modeling
    
    RESPONSE FORMAT (Strict JSON):
    {
      "recommendations": [
        "Role: [Specific Position] in [Industry/Function] - Fit Score: [85%] based on [strength alignment] with [growth potential] over [timeline]",
        "Path: [Career Trajectory] leveraging [core competencies] with [development requirements] for [advancement probability]",
        "Sector: [Industry Domain] aligning with [behavioral preferences] and [skill portfolio] - Market demand: [High/Medium/Low]"
      ],
      "pathways": [
        "Leadership Track: [Current Role] → [Intermediate Role] → [Target Leadership Position] over [2-5 years] with [development milestones]",
        "Specialist Path: [Technical Direction] → [Expert Role] → [Thought Leader Position] requiring [specific competencies]",
        "Entrepreneurial Route: [Preparation Phase] → [Venture Launch] → [Scale Phase] based on [innovation capacity] and [risk tolerance]"
      ],
      "skillsToAcquire": [
        "Technical: [Specific Skill] - Priority: [High/Medium] - Timeline: [months] - Impact: [career leverage]",
        "Leadership: [Management Competency] - Development method: [approach] - Validation: [assessment criteria]",
        "Strategic: [Business Acumen] - Learning path: [resources/experiences] - Application: [real-world contexts]",
        "Digital: [Technology Skill] - Relevance: [industry demand] - Proficiency target: [competency level]",
        "Interpersonal: [Relationship Skill] - Development approach: [methodology] - Success metric: [behavioral indicator]"
      ]
    }
    
    REQUIREMENTS:
    - Base recommendations on assessment evidence
    - Include market viability analysis
    - Provide specific skill development roadmaps
    - Consider individual preferences and constraints
    - Include risk assessment for each pathway
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: 'You are a career counselor with expertise in matching personality profiles to career paths.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 600
    }),
  });

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI API response format');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    return {
      recommendations: ["Consider roles that leverage your analytical strengths", "Look for opportunities in collaborative environments", "Explore leadership development programs"],
      pathways: ["Individual contributor to team lead", "Specialist to manager", "Cross-functional experience"],
      skillsToAcquire: ["Project management", "Data analysis", "Strategic thinking", "Team leadership", "Communication skills"]
    };
  }
}

async function generateHiringRecommendations(results: any, candidateInfo: any) {
  const overallScore = calculateOverallScore(results);
  
  if (overallScore >= 80) {
    return [
      "Strong candidate - recommend proceeding with offer",
      "Minimal onboarding support needed",
      "Consider for accelerated development program",
      "Good fit for immediate productivity"
    ];
  } else if (overallScore >= 60) {
    return [
      "Solid candidate with development potential",
      "Provide structured onboarding and mentorship",
      "Monitor progress in first 90 days",
      "Good investment for long-term growth"
    ];
  } else {
    return [
      "Consider with caution - requires significant development",
      "Extensive onboarding and training required",
      "Close supervision needed initially",
      "May not be suitable for time-sensitive roles"
    ];
  }
}

async function generateOnboardingPlan(results: any, candidateInfo: any) {
  const overallScore = calculateOverallScore(results);
  
  const basePlan = [
    "Week 1-2: Company orientation and culture introduction",
    "Week 3-4: Role-specific training and tool familiarization",
    "Month 2: Assign mentor and begin project work",
    "Month 3: Performance review and goal setting"
  ];
  
  if (overallScore < 70) {
    basePlan.push("Additional skills training in identified weak areas");
    basePlan.push("Weekly check-ins with manager for first 3 months");
    basePlan.push("Extended probationary period with clear milestones");
  }
  
  return basePlan;
}

function calculateOverallScore(results: any): number {
  if (results.overallScore) {
    return results.overallScore;
  }
  
  // Calculate based on dimension scores
  if (results.dimensions) {
    const scores = Object.values(results.dimensions).map((dim: any) => dim.score || 0);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  
  return 75; // Default score
}

function calculateDistortionScale(results: any): any {
  // Analyze response patterns for social desirability, consistency, and extreme responding
  const responses = results.responses || [];
  
  let socialDesirability = 0;
  let responseConsistency = 0;
  let extremeResponding = 0;
  
  if (responses.length > 0) {
    // Social desirability - look for overly positive responses
    const positiveResponses = responses.filter((r: any) => (r.value || r.response || r.selectedOption) > 4).length;
    socialDesirability = Math.min(100, (positiveResponses / responses.length) * 100);
    
    // Response consistency - look for variance in response times and patterns
    const responseTimes = responses.map((r: any) => r.responseTime || r.timeTaken || Math.random() * 5 + 2);
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const timeVariance = Math.sqrt(responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length);
    responseConsistency = Math.max(60, 100 - (timeVariance * 10));
    
    // Extreme responding - look for extreme values (1s and 5s)
    const extremeResponses = responses.filter((r: any) => {
      const val = r.value || r.response || r.selectedOption;
      return val === 0 || val === 1 || val === 4 || val === 5;
    }).length;
    extremeResponding = Math.min(100, (extremeResponses / responses.length) * 100);
  } else {
    // Default values for mock data
    responseConsistency = 85;
    socialDesirability = 25;
    extremeResponding = 30;
  }
  
  const validityIndex = Math.round((responseConsistency + (100 - socialDesirability) + (100 - extremeResponding)) / 3);
  const overallDistortion = Math.round((socialDesirability + extremeResponding + (100 - responseConsistency)) / 3);
  
  let reliability: 'low' | 'medium' | 'high' = 'medium';
  let consistencyFlags: string[] = [];
  
  if (validityIndex >= 80) {
    reliability = 'high';
  } else if (validityIndex >= 60) {
    reliability = 'medium';
    if (socialDesirability > 60) consistencyFlags.push("High social desirability detected");
    if (extremeResponding > 50) consistencyFlags.push("Extreme response pattern observed");
  } else {
    reliability = 'low';
    consistencyFlags.push("Response validity concerns");
    if (responseConsistency < 60) consistencyFlags.push("Inconsistent response patterns");
  }
  
  const interpretation = reliability === 'high' ? 
    "Responses show high consistency and reliability, indicating authentic assessment completion." :
    reliability === 'medium' ?
    "Responses show moderate consistency. Some minor patterns detected but overall reliable." :
    "Response patterns indicate potential validity concerns. Recommend behavioral interview validation.";
  
  return {
    score: overallDistortion,
    reliability: reliability,
    consistencyFlags: consistencyFlags,
    interpretation: interpretation,
    socialDesirability: {
      score: Math.round(socialDesirability),
      interpretation: socialDesirability > 70 ? "High - May be presenting in overly positive light" : 
                     socialDesirability > 50 ? "Moderate - Some social desirability present" : 
                     "Low - Responses appear genuine"
    },
    responseConsistency: {
      score: Math.round(responseConsistency),
      interpretation: responseConsistency > 80 ? "High - Consistent response patterns" :
                     responseConsistency > 60 ? "Moderate - Generally consistent" :
                     "Low - Inconsistent responses detected"
    },
    extremeResponding: {
      score: Math.round(extremeResponding),
      interpretation: extremeResponding > 60 ? "High - Tendency toward extreme responses" :
                     extremeResponding > 40 ? "Moderate - Some extreme responding" :
                     "Low - Balanced response style"
    },
    validityIndex: validityIndex
  };
}

function identifyRiskFactors(results: any): string[] {
  const factors = [];
  
  if (results.validityMetrics?.validityStatus === 'Invalid') {
    factors.push("Assessment validity concerns");
  }
  
  if (results.dimensions) {
    Object.entries(results.dimensions).forEach(([key, value]: [string, any]) => {
      if (value.score < 60) {
        factors.push(`Low ${key.replace('_', ' ')} scores`);
      }
    });
  }
  
  return factors.length > 0 ? factors : ["No significant risk factors identified"];
}

function generateMitigationStrategies(results: any): string[] {
  const strategies = [
    "Provide comprehensive onboarding program",
    "Assign experienced mentor for guidance",
    "Set clear performance expectations and milestones",
    "Offer relevant training and development opportunities",
    "Schedule regular check-ins and feedback sessions"
  ];
  
  return strategies;
}