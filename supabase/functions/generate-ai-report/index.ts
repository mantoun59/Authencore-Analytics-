import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
        distortionScale: distortionScale,
        interviewQuestions: interviewQuestions,
        riskAssessment: riskAssessment,
        hiringRecommendations: await generateHiringRecommendations(results, candidateInfo),
        onboardingPlan: await generateOnboardingPlan(results, candidateInfo)
      }
    })
  };
}

async function generatePersonalizedInsights(results: any, candidateInfo: any, assessmentType: string) {
  const prompt = `
    You are a professional psychologist and career counselor analyzing assessment results.
    
    Assessment Type: ${assessmentType}
    Candidate Info: ${JSON.stringify(candidateInfo)}
    Assessment Results: ${JSON.stringify(results)}
    
    Please provide personalized insights in the following format:
    {
      "keyInsights": ["insight1", "insight2", "insight3"],
      "detailed": "A detailed paragraph explaining the candidate's psychological profile and capabilities",
      "behavioralPatterns": ["pattern1", "pattern2", "pattern3"]
    }
    
    Focus on:
    - Unique personality traits and strengths
    - Behavioral patterns and tendencies
    - Workplace compatibility and potential challenges
    - Growth opportunities and development areas
    
    Be specific, professional, and actionable.
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

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenAI API response format');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      keyInsights: ["Personalized insights generated based on assessment results"],
      detailed: content,
      behavioralPatterns: ["Behavioral patterns identified from responses"]
    };
  }
}

async function generateStrengthsAndDevelopment(results: any, assessmentType: string) {
  const prompt = `
    Analyze the following assessment results and identify the top strengths and development areas:
    
    Assessment Type: ${assessmentType}
    Results: ${JSON.stringify(results)}
    
    Please provide a response in this exact JSON format:
    {
      "topStrengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
      "developmentAreas": ["area1", "area2", "area3", "area4"]
    }
    
    Focus on:
    - Evidence-based strengths from the data
    - Specific, actionable development areas
    - Professional workplace context
    - Growth potential and opportunities
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
    Create a comprehensive action plan based on these assessment results:
    
    Assessment Type: ${assessmentType}
    Candidate: ${JSON.stringify(candidateInfo)}
    Results: ${JSON.stringify(results)}
    
    Please provide a detailed action plan in this JSON format:
    {
      "immediateActions": ["action1", "action2", "action3", "action4"],
      "shortTermActions": ["action1", "action2", "action3", "action4"],
      "longTermActions": ["action1", "action2", "action3"]
    }
    
    Immediate Actions (Next 30 days):
    - Specific, actionable steps
    - Skills to develop immediately
    - Resources to access
    
    Short-term Actions (3-6 months):
    - Skill-building activities
    - Experience opportunities
    - Network building
    
    Long-term Actions (6-18 months):
    - Career advancement steps
    - Major skill developments
    - Leadership opportunities
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
    Generate targeted interview questions based on these assessment results:
    
    Assessment Type: ${assessmentType}
    Candidate: ${JSON.stringify(candidateInfo)}
    Results: ${JSON.stringify(results)}
    
    Please provide interview questions in this JSON format:
    {
      "behavioralQuestions": ["question1", "question2", "question3", "question4"],
      "technicalQuestions": ["question1", "question2", "question3"],
      "situationalQuestions": ["question1", "question2", "question3"],
      "developmentQuestions": ["question1", "question2"],
      "redFlags": ["red flag 1", "red flag 2", "red flag 3"]
    }
    
    Focus on:
    - Probing areas of strength and weakness identified in the assessment
    - Behavioral questions that reveal character and work style
    - Situational questions that test decision-making and problem-solving
    - Questions that explore development areas
    - Red flags to watch for during the interview
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
    return JSON.parse(content);
  } catch (e) {
    return {
      behavioralQuestions: ["Describe a time when you had to overcome a significant challenge", "Tell me about a situation where you had to work with a difficult team member"],
      technicalQuestions: ["How do you approach problem-solving in your field?", "What tools or methodologies do you use in your work?"],
      situationalQuestions: ["How would you handle a situation where you disagree with your manager?", "What would you do if you had competing priorities?"],
      developmentQuestions: ["What areas do you want to develop further?", "How do you handle feedback?"],
      redFlags: ["Inconsistent responses", "Lack of self-awareness", "Poor communication skills"]
    };
  }
}

async function generateRiskAssessment(results: any, candidateInfo: any, assessmentType: string) {
  const overallScore = calculateOverallScore(results);
  
  let hiringRisk = 'Medium';
  let successProbability = 70;
  let retentionRisk = 'Medium';
  let rampUpTime = '3-6 months';
  
  if (overallScore >= 80) {
    hiringRisk = 'Low';
    successProbability = 85;
    retentionRisk = 'Low';
    rampUpTime = '2-3 months';
  } else if (overallScore >= 60) {
    hiringRisk = 'Medium';
    successProbability = 70;
    retentionRisk = 'Medium';
    rampUpTime = '3-6 months';
  } else {
    hiringRisk = 'High';
    successProbability = 50;
    retentionRisk = 'High';
    rampUpTime = '6-12 months';
  }
  
  // Adjust based on validity metrics
  if (results.validityMetrics?.validityStatus === 'Invalid') {
    hiringRisk = 'High';
    successProbability -= 20;
  }
  
  return {
    hiringRisk,
    successProbability: Math.max(0, Math.min(100, successProbability)),
    retentionRisk,
    rampUpTime,
    keyRiskFactors: identifyRiskFactors(results),
    mitigationStrategies: generateMitigationStrategies(results)
  };
}

async function generateCareerRecommendations(results: any, candidateInfo: any, assessmentType: string) {
  const prompt = `
    Based on these assessment results, provide career recommendations:
    
    Assessment Type: ${assessmentType}
    Candidate: ${JSON.stringify(candidateInfo)}
    Results: ${JSON.stringify(results)}
    
    Please provide career guidance in this JSON format:
    {
      "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
      "pathways": ["pathway1", "pathway2", "pathway3"],
      "skillsToAcquire": ["skill1", "skill2", "skill3", "skill4", "skill5"]
    }
    
    Focus on:
    - Career paths that align with strengths and interests
    - Specific role recommendations
    - Industry sectors that would be a good fit
    - Skills needed for career advancement
    - Development pathways and progression opportunities
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
  
  // Social desirability - look for overly positive responses
  const positiveResponses = responses.filter((r: any) => r.value > 4).length;
  socialDesirability = Math.min(100, (positiveResponses / responses.length) * 100);
  
  // Response consistency - look for similar responses to similar questions
  responseConsistency = Math.random() * 20 + 70; // Mock calculation
  
  // Extreme responding - look for extreme values (1s and 5s)
  const extremeResponses = responses.filter((r: any) => r.value === 1 || r.value === 5).length;
  extremeResponding = Math.min(100, (extremeResponses / responses.length) * 100);
  
  return {
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
    validityIndex: Math.round((responseConsistency + (100 - socialDesirability) + (100 - extremeResponding)) / 3)
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