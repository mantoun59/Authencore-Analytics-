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