// Type definitions for assessment data structures
export interface AssessmentResponse {
  id: string;
  questionId: string;
  selectedOption: string;
  timestamp: number;
  responseTime?: number;
}

// Enhanced types for AI Report Generator
export interface ValidityMetricsDetailed {
  consistencyScore: number;
  responsePattern: string;
  flaggedResponses: number;
  overallValidity: 'Valid' | 'Questionable' | 'Invalid';
  responseTimeVariance?: number;
  patternAnalysis?: {
    straightLining: boolean;
    rapidResponses: number;
    inconsistentPairs: number;
  };
  fakeGoodScore?: number;
  fakeBadScore?: number;
  randomResponseScore?: number;
  inconsistencyScore?: number;
  responseTimeProfile?: string;
}

export interface CognitiveProfile {
  analyticalThinking: number;
  creativeProblemSolving: number;
  decisionMakingStyle: string;
  informationProcessing: string;
  learningPreference: string;
}

export interface BehavioralPredictions {
  workStyle: string;
  communicationPreference: string;
  leadershipPotential: number;
  teamDynamics: string;
  stressResponse: string;
  adaptabilityScore: number;
}

export interface SummaryTableData {
  category: string;
  score: number;
  percentile: number;
  interpretation: string;
  recommendations: string[];
}

export interface ScenarioResponse {
  scenarioId: string;
  selectedOption: string;
  responseTime: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface SwipeData {
  direction: 'left' | 'right';
  velocity: number;
  timestamp: number;
  position: { x: number; y: number };
}

export interface CollaborationResponse {
  scenarioId: string;
  selectedOption: string;
  optionScores: Record<string, number>;
  reasoning?: string;
}

export interface AssessmentResults {
  overallScore: number;
  dimensionScores: Record<string, DimensionScore>;
  executiveSummary: ExecutiveSummary;
  recommendations: string[];
  validityMetrics?: ValidityMetrics;
}

export interface DimensionScore {
  score: number;
  level: string;
  interpretation: string;
  percentile?: number;
}

export interface ExecutiveSummary {
  overallScore: number;
  readinessLevel: string;
  topStrengths: string[];
  keyDevelopmentAreas: string[];
  recommendedNextSteps: string[];
}

export interface ValidityMetrics {
  consistencyScore: number;
  responsePattern: string;
  flaggedResponses: number;
  overallValidity: 'Valid' | 'Questionable' | 'Invalid';
}

// Use the detailed version for enhanced reporting
export type { ValidityMetricsDetailed as EnhancedValidityMetrics };

export interface EmployerReport extends AssessmentResults {
  culturalFit: number;
  roleAlignment: number;
  hiringRisk: 'Low' | 'Medium' | 'High';
  interviewGuide: InterviewQuestion[];
  redFlags: string[];
}

export interface InterviewQuestion {
  category: string;
  question: string;
  followUp?: string[];
  redFlagIndicators?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  demographicInfo?: {
    age?: number;
    gender?: string;
    country?: string;
    educationLevel?: string;
    workExperience?: string;
  };
}

export interface AssessmentSession {
  id: string;
  userId: string;
  assessmentType: string;
  startedAt: Date;
  completedAt?: Date;
  responses: AssessmentResponse[];
  currentQuestionIndex: number;
  isCompleted: boolean;
}

// Utility functions with proper typing
export class AssessmentLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  static log(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.log(`[Assessment] ${message}`, data);
    }
  }

  static warn(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      console.warn(`[Assessment Warning] ${message}`, data);
    }
  }

  static error(message: string, error?: Error | unknown): void {
    if (this.isDevelopment) {
      console.error(`[Assessment Error] ${message}`, error);
    }
    // In production, you would send this to a logging service
  }
}

// Safe error handling
export function handleAssessmentError(error: unknown, context: string): string {
  AssessmentLogger.error(`Error in ${context}:`, error);
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

// Type-safe data processing
export function processAssessmentData<T>(
  data: unknown,
  validator: (data: unknown) => data is T
): T | null {
  try {
    if (validator(data)) {
      return data;
    }
    AssessmentLogger.warn('Invalid assessment data structure', data);
    return null;
  } catch (error) {
    AssessmentLogger.error('Error processing assessment data', error);
    return null;
  }
}

// Validation functions
export function isValidAssessmentResults(data: unknown): data is AssessmentResults {
  return (
    typeof data === 'object' &&
    data !== null &&
    'overallScore' in data &&
    'dimensionScores' in data &&
    'executiveSummary' in data &&
    typeof (data as AssessmentResults).overallScore === 'number'
  );
}

export function isValidUserProfile(data: unknown): data is UserProfile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data &&
    'fullName' in data &&
    typeof (data as UserProfile).id === 'string' &&
    typeof (data as UserProfile).email === 'string'
  );
}

// Enhanced response validation
export function validateAssessmentResponse(response: unknown): response is AssessmentResponse {
  if (typeof response !== 'object' || response === null) return false;
  
  const r = response as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.questionId === 'string' &&
    typeof r.selectedOption === 'string' &&
    typeof r.timestamp === 'number' &&
    r.timestamp > 0 &&
    (r.responseTime === undefined || typeof r.responseTime === 'number')
  );
}

export function validateResponseTime(responseTime: number, questionType: string = 'default'): boolean {
  const minTimes = { default: 500, complex: 2000, simple: 200 };
  const maxTimes = { default: 300000, complex: 600000, simple: 60000 }; // 5-10 minutes max
  
  const min = minTimes[questionType as keyof typeof minTimes] || minTimes.default;
  const max = maxTimes[questionType as keyof typeof maxTimes] || maxTimes.default;
  
  return responseTime >= min && responseTime <= max;
}

export function validateResponseConsistency(responses: AssessmentResponse[]): {
  isValid: boolean;
  flags: string[];
  score: number;
} {
  const flags: string[] = [];
  let consistencyScore = 100;
  
  if (responses.length === 0) {
    return { isValid: false, flags: ['No responses provided'], score: 0 };
  }
  
  // Check for rapid-fire responses (< 1 second)
  const rapidResponses = responses.filter(r => r.responseTime && r.responseTime < 1000).length;
  if (rapidResponses > responses.length * 0.3) {
    flags.push('High number of rapid responses detected');
    consistencyScore -= 25;
  }
  
  // Check for extremely slow responses (> 5 minutes)
  const slowResponses = responses.filter(r => r.responseTime && r.responseTime > 300000).length;
  if (slowResponses > responses.length * 0.1) {
    flags.push('Unusually slow response pattern detected');
    consistencyScore -= 15;
  }
  
  // Check for pattern repetition (same option selected repeatedly)
  const optionCounts = responses.reduce((acc, r) => {
    acc[r.selectedOption] = (acc[r.selectedOption] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const maxOptionPercentage = Math.max(...Object.values(optionCounts)) / responses.length;
  if (maxOptionPercentage > 0.8) {
    flags.push('Straight-line responding detected');
    consistencyScore -= 30;
  }
  
  return {
    isValid: consistencyScore >= 60,
    flags,
    score: Math.max(0, consistencyScore)
  };
}