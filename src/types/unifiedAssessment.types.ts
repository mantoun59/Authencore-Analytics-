// Unified Assessment Type Definitions
// This file consolidates all assessment types into a unified structure

export interface UnifiedAssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'likert' | 'ranking' | 'text' | 'simulation' | 'scenario';
  category: string;
  dimension?: string; // Which assessment dimension this question measures
  weight?: number; // Question weight in scoring
  options?: Array<{
    id: string;
    text: string;
    value: number;
    dimension?: string;
    indicators?: string[];
  }>;
  metadata?: Record<string, unknown>;
}

export interface UnifiedAssessmentResponse {
  questionId: string;
  answer: string | number | string[] | Record<string, unknown>;
  responseTime: number;
  confidence?: number;
  dimension?: string;
  metadata?: Record<string, unknown>;
}

export interface UnifiedCandidateInfo {
  name: string;
  email: string;
  age?: number;
  experience?: string;
  position?: string;
  country?: string;
  gender?: string;
  completionDate?: string;
}

export interface UnifiedDimensionScore {
  key: string;
  name: string;
  score: number;
  percentile: number;
  level: 'low' | 'medium' | 'high';
  description: string;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  components?: Record<string, number>;
  insights?: string[];
}

export interface UnifiedValidityMetrics {
  consistencyScore: number;
  engagementLevel: 'low' | 'medium' | 'high';
  responsePattern: string;
  flags: string[];
  fakeGoodIndicator: number;
  completionRate: number;
}

export interface UnifiedAssessmentData {
  responses: UnifiedAssessmentResponse[];
  startTime: number;
  endTime: number;
  totalTime: number;
  assessmentType: string;
  candidateInfo: UnifiedCandidateInfo;
  validityMetrics?: UnifiedValidityMetrics;
  metadata?: Record<string, unknown>;
}

export interface UnifiedAssessmentResults {
  assessmentId: string;
  assessmentType: string;
  candidateInfo: UnifiedCandidateInfo;
  overallScore: number;
  overallPercentile: number;
  dimensions: UnifiedDimensionScore[];
  profile: {
    title: string;
    description: string;
    keyTraits: string[];
  };
  insights: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
    recommendations: string[];
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  validityAssessment: UnifiedValidityMetrics;
  reportData: {
    executiveSummary: string;
    detailedAnalysis: string;
    interviewQuestions?: string[];
    hiringRecommendations?: string[];
    onboardingPlan?: string[];
  };
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Assessment-specific extensions
export interface CareerLaunchResults extends UnifiedAssessmentResults {
  careerInterests: Array<{
    category: string;
    score: number;
    activities: string[];
  }>;
  skillGaps: string[];
  careerPaths: Array<{
    title: string;
    match: number;
    description: string;
    requiredSkills: string[];
    outlook: string;
    salary?: string;
  }>;
}

export interface CommunicationStyleResults extends UnifiedAssessmentResults {
  communicationStyles: {
    direct: number;
    supportive: number;
    analytical: number;
    expressive: number;
  };
  primaryStyle: string;
  adaptabilityScore: number;
}

export interface GenZResults extends UnifiedAssessmentResults {
  genZDimensions: {
    authenticity: number;
    flexibility: number;
    purpose: number;
    collaboration: number;
    innovation: number;
    wellbeing: number;
  };
  workplacePreferences: Record<string, Record<string, number>>;
  companyMatches: Array<{
    name: string;
    match: number;
    industry: string;
    culture: string[];
    why: string;
  }>;
  redFlags: Array<{
    flag: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
}

export interface CulturalIntelligenceResults extends UnifiedAssessmentResults {
  cqScores: {
    drive: number;
    knowledge: number;
    strategy: number;
    action: number;
  };
  culturalAdaptability: number;
}

export interface EmotionalIntelligenceResults extends UnifiedAssessmentResults {
  eqDimensions: {
    selfAwareness: number;
    selfRegulation: number;
    motivation: number;
    empathy: number;
    socialSkills: number;
  };
  emotionalQuotient: number;
}

export interface StressResilienceResults extends UnifiedAssessmentResults {
  resilienceFactors: {
    adaptability: number;
    copingStrategies: number;
    emotionalRegulation: number;
    socialSupport: number;
    selfEfficacy: number;
  };
  burnoutRisk: 'low' | 'medium' | 'high';
}

export interface FaithValuesResults extends UnifiedAssessmentResults {
  valuesDimensions: Record<string, number>;
  faithAlignment: number;
  workplaceIntegration: number;
}

export interface LeadershipResults extends UnifiedAssessmentResults {
  leadershipStyles: Record<string, number>;
  leadershipPotential: number;
  developmentAreas: string[];
}

export interface DigitalWellnessResults extends UnifiedAssessmentResults {
  digitalHabits: Record<string, number>;
  wellnessScore: number;
  riskAreas: string[];
}

// Report Configuration
export interface UnifiedReportConfig {
  assessmentType: string;
  reportType: 'candidate' | 'employer' | 'hr' | 'development';
  results: UnifiedAssessmentResults;
  template?: 'standard' | 'detailed' | 'executive' | 'development';
  branding?: {
    logo?: string;
    colors?: Record<string, string>;
    company?: string;
  };
  customSections?: string[];
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  includeActionPlan?: boolean;
}

// Scoring Configuration
export interface UnifiedScoringConfig {
  assessmentType: string;
  questions: UnifiedAssessmentQuestion[];
  dimensions: Record<string, {
    name: string;
    description: string;
    weight: number;
    questions: string[];
  }>;
  norms?: Record<string, {
    percentiles: number[];
    mean: number;
    stdDev: number;
  }>;
  validityChecks: string[];
}

// API Response Types
export interface UnifiedAssessmentApiResponse<T = UnifiedAssessmentResults> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Component Props
export interface UnifiedAssessmentProps {
  assessmentType: string;
  questions: UnifiedAssessmentQuestion[];
  onComplete: (data: UnifiedAssessmentData) => void;
  config?: {
    allowBack?: boolean;
    showProgress?: boolean;
    timeLimit?: number;
    autoSave?: boolean;
  };
}

export interface UnifiedResultsProps {
  results: UnifiedAssessmentResults;
  config?: {
    showActions?: boolean;
    allowRetake?: boolean;
    enableSharing?: boolean;
    showReports?: boolean;
  };
}