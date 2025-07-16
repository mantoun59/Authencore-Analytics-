import type { AssessmentResults } from '@/hooks/useScoring';
import type { CareerMatch } from '@/hooks/useCareerMatching';

export interface CandidateReport {
  candidateInfo: {
    name: string;
    email: string;
    completionDate: string;
    assessmentId: string;
  };
  executiveSummary: {
    overallScore: number;
    readinessLevel: string;
    topStrengths: string[];
    keyDevelopmentAreas: string[];
    recommendedNextSteps: string[];
  };
  detailedAnalysis: {
    dimensionScores: AssessmentResults['dimensions'];
    validityMetrics: AssessmentResults['validityMetrics'];
    behavioralInsights: string[];
  };
  careerMatches: CareerMatch[];
  developmentPlan: {
    immediateActions: string[];
    shortTermGoals: string[];
    longTermObjectives: string[];
  };
  resources: {
    learningPaths: string[];
    certifications: string[];
    networkingOpportunities: string[];
  };
}

export interface EmployerReport extends CandidateReport {
  riskAssessment: {
    hiringRisk: 'Low' | 'Medium' | 'High';
    successProbability: number;
    retentionRisk: 'Low' | 'Medium' | 'High';
    rampUpTime: string;
  };
  fitAnalysis: {
    culturalFit: number;
    roleAlignment: number;
    growthPotential: number;
    managerialNeeds: string[];
  };
  interviewGuide: {
    recommendedQuestions: string[];
    areasToExplore: string[];
    redFlags: string[];
  };
  onboardingRecommendations: string[];
}

export const generateCandidateReport = (
  userProfile: any,
  assessmentResults: AssessmentResults,
  careerMatches: CareerMatch[],
  gameState: any
): CandidateReport => {
  const report: CandidateReport = {
    candidateInfo: {
      name: userProfile.name,
      email: userProfile.email,
      completionDate: new Date().toLocaleDateString(),
      assessmentId: `CL-${Date.now()}`
    },
    
    executiveSummary: {
      overallScore: Math.round(assessmentResults.overallScore),
      readinessLevel: assessmentResults.careerReadiness.level,
      topStrengths: assessmentResults.careerReadiness.strengths.slice(0, 3),
      keyDevelopmentAreas: assessmentResults.careerReadiness.developmentAreas.slice(0, 3),
      recommendedNextSteps: generateNextSteps(assessmentResults, careerMatches[0])
    },

    detailedAnalysis: {
      dimensionScores: assessmentResults.dimensions,
      validityMetrics: assessmentResults.validityMetrics,
      behavioralInsights: generateBehavioralInsights(assessmentResults, gameState)
    },

    careerMatches: careerMatches.slice(0, 5),

    developmentPlan: generateDevelopmentPlan(assessmentResults, careerMatches[0]),

    resources: generateResources(careerMatches[0], assessmentResults)
  };

  return report;
};

export const generateEmployerReport = (
  candidateReport: CandidateReport,
  assessmentResults: AssessmentResults,
  gameState: any
): EmployerReport => {
  const employerReport: EmployerReport = {
    ...candidateReport,
    
    riskAssessment: generateRiskAssessment(assessmentResults, gameState),
    
    fitAnalysis: generateFitAnalysis(assessmentResults),
    
    interviewGuide: generateInterviewGuide(assessmentResults, candidateReport.careerMatches[0]),
    
    onboardingRecommendations: generateOnboardingRecommendations(assessmentResults)
  };

  return employerReport;
};

const generateNextSteps = (results: AssessmentResults, topMatch?: CareerMatch): string[] => {
  const steps: string[] = [];
  
  if (results.careerReadiness.level === 'Not Ready') {
    steps.push('Focus on building foundational workplace skills');
    steps.push('Seek mentorship or career counseling');
    steps.push('Consider additional education or training programs');
  } else if (results.careerReadiness.level === 'Developing') {
    steps.push('Gain practical experience through internships or projects');
    steps.push('Develop identified skill gaps through targeted learning');
    steps.push('Build professional network in target industry');
  } else {
    steps.push('Apply for entry-level positions in matched career fields');
    steps.push('Continue developing leadership and advanced skills');
    steps.push('Consider specialization or advanced certifications');
  }

  if (topMatch) {
    steps.push(`Explore ${topMatch.career.title} role requirements in detail`);
  }

  return steps;
};

const generateBehavioralInsights = (results: AssessmentResults, gameState: any): string[] => {
  const insights: string[] = [];
  
  // Analyze problem-solving approach
  if (results.dimensions.problem_solving.score >= 80) {
    insights.push('Demonstrates strong analytical thinking and systematic problem-solving approach');
  } else if (results.dimensions.problem_solving.score >= 60) {
    insights.push('Shows developing problem-solving skills with room for improvement in complex scenarios');
  } else {
    insights.push('Would benefit from structured training in problem-solving methodologies');
  }

  // Analyze communication style
  if (results.dimensions.communication_skills.score >= 80) {
    insights.push('Exhibits excellent communication skills and emotional intelligence');
  } else if (results.dimensions.communication_skills.score >= 60) {
    insights.push('Has solid communication foundation but could improve in challenging situations');
  } else {
    insights.push('Needs development in professional communication and interpersonal skills');
  }

  // Analyze adaptability
  if (results.dimensions.adaptability.score >= 80) {
    insights.push('Highly adaptable and comfortable with change and ambiguity');
  } else if (results.dimensions.adaptability.score >= 60) {
    insights.push('Generally adaptable but may need support during major transitions');
  } else {
    insights.push('May struggle with change and would benefit from structured transition support');
  }

  // Add engagement insights
  if (results.validityMetrics.engagementLevel === 'High') {
    insights.push('Showed high engagement and thoughtfulness throughout assessment');
  } else if (results.validityMetrics.engagementLevel === 'Medium') {
    insights.push('Demonstrated adequate engagement with some areas for improvement');
  } else {
    insights.push('May benefit from additional motivation and engagement strategies');
  }

  return insights;
};

const generateDevelopmentPlan = (results: AssessmentResults, topMatch?: CareerMatch) => {
  const plan = {
    immediateActions: [] as string[],
    shortTermGoals: [] as string[],
    longTermObjectives: [] as string[]
  };

  // Immediate actions (next 30 days)
  if (results.careerReadiness.developmentAreas.length > 0) {
    plan.immediateActions.push(`Begin skill development in ${results.careerReadiness.developmentAreas[0]}`);
  }
  plan.immediateActions.push('Create professional LinkedIn profile and resume');
  plan.immediateActions.push('Research target companies and roles');

  // Short-term goals (3-6 months)
  if (topMatch) {
    plan.shortTermGoals.push(`Complete relevant coursework or certification for ${topMatch.career.title}`);
    plan.shortTermGoals.push('Gain hands-on experience through projects or internships');
  }
  plan.shortTermGoals.push('Build professional network through industry events');
  plan.shortTermGoals.push('Develop portfolio showcasing relevant skills');

  // Long-term objectives (1-2 years)
  plan.longTermObjectives.push('Secure entry-level position in target field');
  plan.longTermObjectives.push('Establish mentorship relationships');
  plan.longTermObjectives.push('Begin leadership development journey');

  return plan;
};

const generateResources = (topMatch: CareerMatch | undefined, results: AssessmentResults) => {
  const resources = {
    learningPaths: [] as string[],
    certifications: [] as string[],
    networkingOpportunities: [] as string[]
  };

  if (topMatch) {
    // Learning paths based on career match
    const careerLearningPaths: Record<string, string[]> = {
      'Data Scientist': ['Python Programming', 'Statistics and Probability', 'Machine Learning', 'Data Visualization'],
      'UX Designer': ['Design Thinking', 'User Research Methods', 'Prototyping Tools', 'Visual Design'],
      'Product Manager': ['Product Strategy', 'Agile Methodologies', 'Market Research', 'Analytics'],
      'Digital Marketing Specialist': ['Digital Marketing Fundamentals', 'SEO/SEM', 'Social Media Marketing', 'Analytics']
    };

    resources.learningPaths = careerLearningPaths[topMatch.career.title] || [
      'Industry-specific technical skills',
      'Professional communication',
      'Project management',
      'Leadership development'
    ];

    // Certifications based on career
    const careerCertifications: Record<string, string[]> = {
      'Data Scientist': ['Google Data Analytics Certificate', 'IBM Data Science Certificate', 'Microsoft Azure Data Scientist'],
      'UX Designer': ['Google UX Design Certificate', 'Adobe Certified Expert', 'Nielsen Norman Group UX Certification'],
      'Product Manager': ['Product Management Certificate (UC Berkeley)', 'Certified Scrum Product Owner', 'Google Project Management Certificate'],
      'Digital Marketing Specialist': ['Google Ads Certification', 'Facebook Blueprint', 'HubSpot Content Marketing Certification']
    };

    resources.certifications = careerCertifications[topMatch.career.title] || [
      'Industry-relevant professional certification',
      'Project management certification',
      'Leadership development program'
    ];
  }

  // Networking opportunities
  resources.networkingOpportunities = [
    'Industry professional associations',
    'Local meetups and networking events',
    'LinkedIn professional groups',
    'Alumni networks and career fairs',
    'Mentorship programs'
  ];

  return resources;
};

const generateRiskAssessment = (results: AssessmentResults, gameState: any) => {
  let hiringRisk: 'Low' | 'Medium' | 'High' = 'Medium';
  let successProbability = 70;
  let retentionRisk: 'Low' | 'Medium' | 'High' = 'Medium';
  let rampUpTime = '3-6 months';

  // Calculate based on overall readiness
  if (results.overallScore >= 80) {
    hiringRisk = 'Low';
    successProbability = 85;
    retentionRisk = 'Low';
    rampUpTime = '2-3 months';
  } else if (results.overallScore >= 60) {
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
  if (results.validityMetrics.validityStatus === 'Invalid') {
    hiringRisk = 'High';
    successProbability -= 20;
  } else if (results.validityMetrics.validityStatus === 'Questionable') {
    successProbability -= 10;
  }

  return {
    hiringRisk,
    successProbability: Math.max(0, Math.min(100, successProbability)),
    retentionRisk,
    rampUpTime
  };
};

const generateFitAnalysis = (results: AssessmentResults) => {
  const culturalFit = Math.round(
    (results.dimensions.communication_skills.score + 
     results.dimensions.adaptability.score + 
     results.dimensions.workplace_maturity.score) / 3
  );

  const roleAlignment = Math.round(
    (results.dimensions.skill_readiness.score + 
     results.dimensions.problem_solving.score) / 2
  );

  const growthPotential = Math.round(
    (results.dimensions.growth_mindset.score + 
     results.dimensions.leadership_potential.score) / 2
  );

  const managerialNeeds: string[] = [];
  
  if (results.dimensions.workplace_maturity.score < 70) {
    managerialNeeds.push('Close supervision and clear expectations');
  }
  if (results.dimensions.communication_skills.score < 70) {
    managerialNeeds.push('Communication coaching and feedback');
  }
  if (results.dimensions.adaptability.score < 70) {
    managerialNeeds.push('Structured change management support');
  }
  if (managerialNeeds.length === 0) {
    managerialNeeds.push('Standard management approach');
  }

  return {
    culturalFit,
    roleAlignment,
    growthPotential,
    managerialNeeds
  };
};

const generateInterviewGuide = (results: AssessmentResults, topMatch?: CareerMatch) => {
  const recommendedQuestions: string[] = [];
  const areasToExplore: string[] = [];
  const redFlags: string[] = [];

  // Generate questions based on assessment results
  if (results.dimensions.problem_solving.score < 70) {
    recommendedQuestions.push('Describe a challenging problem you solved and your approach');
    areasToExplore.push('Problem-solving methodology and critical thinking');
  }

  if (results.dimensions.communication_skills.score < 70) {
    recommendedQuestions.push('Tell me about a time you had to explain a complex concept to someone');
    areasToExplore.push('Communication clarity and interpersonal skills');
  }

  if (results.dimensions.adaptability.score < 70) {
    recommendedQuestions.push('Describe how you handled a significant change or setback');
    areasToExplore.push('Flexibility and resilience under pressure');
  }

  // Add standard behavioral questions
  recommendedQuestions.push('What motivates you in your work?');
  recommendedQuestions.push('Where do you see yourself in 3-5 years?');

  // Red flags based on validity metrics
  if (results.validityMetrics.validityStatus === 'Invalid') {
    redFlags.push('Assessment validity concerns - consider re-testing');
  }
  if (results.validityMetrics.engagementLevel === 'Low') {
    redFlags.push('Low engagement during assessment - probe motivation');
  }

  return {
    recommendedQuestions,
    areasToExplore,
    redFlags
  };
};

const generateOnboardingRecommendations = (results: AssessmentResults): string[] => {
  const recommendations: string[] = [];

  if (results.dimensions.workplace_maturity.score < 70) {
    recommendations.push('Provide comprehensive workplace orientation and mentorship');
    recommendations.push('Set clear expectations and regular check-ins');
  }

  if (results.dimensions.skill_readiness.score < 70) {
    recommendations.push('Implement structured training program for technical skills');
    recommendations.push('Pair with experienced team member for knowledge transfer');
  }

  if (results.dimensions.communication_skills.score < 70) {
    recommendations.push('Include communication skills development in onboarding');
    recommendations.push('Provide feedback templates and communication guidelines');
  }

  if (recommendations.length === 0) {
    recommendations.push('Standard onboarding process with gradual responsibility increase');
    recommendations.push('Focus on company culture and team integration');
  }

  return recommendations;
};

export const generatePDFReport = async (report: CandidateReport): Promise<void> => {
  // This would typically use a PDF generation library like jsPDF
  const reportText = `
CAREER LAUNCH ASSESSMENT REPORT
================================

Candidate: ${report.candidateInfo.name}
Email: ${report.candidateInfo.email}
Assessment Date: ${report.candidateInfo.completionDate}
Assessment ID: ${report.candidateInfo.assessmentId}

EXECUTIVE SUMMARY
-----------------
Overall Score: ${report.executiveSummary.overallScore}/100
Career Readiness Level: ${report.executiveSummary.readinessLevel}

Top Strengths:
${report.executiveSummary.topStrengths.map(s => `• ${s}`).join('\n')}

Key Development Areas:
${report.executiveSummary.keyDevelopmentAreas.map(s => `• ${s}`).join('\n')}

Recommended Next Steps:
${report.executiveSummary.recommendedNextSteps.map(s => `• ${s}`).join('\n')}

CAREER MATCHES
--------------
${report.careerMatches.slice(0, 3).map(match => `
${match.career.title} - ${match.matchPercentage}% Match
Readiness: ${match.readinessLevel}
Salary Range: ${match.salaryExpectation}
Growth: ${match.growthPotential}
`).join('\n')}

DEVELOPMENT PLAN
----------------
Immediate Actions (Next 30 Days):
${report.developmentPlan.immediateActions.map(s => `• ${s}`).join('\n')}

Short-term Goals (3-6 Months):
${report.developmentPlan.shortTermGoals.map(s => `• ${s}`).join('\n')}

Long-term Objectives (1-2 Years):
${report.developmentPlan.longTermObjectives.map(s => `• ${s}`).join('\n')}

RECOMMENDED RESOURCES
---------------------
Learning Paths:
${report.resources.learningPaths.map(s => `• ${s}`).join('\n')}

Certifications:
${report.resources.certifications.map(s => `• ${s}`).join('\n')}

Networking Opportunities:
${report.resources.networkingOpportunities.map(s => `• ${s}`).join('\n')}

---
This report is confidential and intended for the named candidate only.
For questions about this assessment, contact your career counselor.
  `;

  // Create and download the file
  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CareerLaunch_Report_${report.candidateInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};