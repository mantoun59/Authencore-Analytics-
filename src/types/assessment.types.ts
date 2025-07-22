// Assessment Type Definitions

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'likert' | 'ranking' | 'text' | 'simulation';
  category: string;
  options?: Array<{
    id: string;
    text: string;
    value: number;
    indicators?: string[];
  }>;
  metadata?: Record<string, unknown>;
}

export interface AssessmentResponse {
  questionId: string;
  answer: string | number | string[] | Record<string, unknown> | unknown[];
  responseTime: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AssessmentData {
  responses: AssessmentResponse[];
  startTime: number;
  endTime: number;
  totalTime: number;
  assessmentType: string;
  candidateInfo?: CandidateInfo;
  metadata?: Record<string, unknown>;
}

export interface CandidateInfo {
  name: string;
  email: string;
  age?: number;
  experience?: string;
  position?: string;
  country?: string;
  gender?: string;
}

export interface DimensionScore {
  name: string;
  score: number;
  description: string;
  level: 'low' | 'medium' | 'high';
  recommendations?: string[];
  components?: Record<string, number>;
}

export interface AssessmentResults {
  overallScore: number;
  dimensions: DimensionScore[];
  profile: string;
  recommendations: Array<{
    category: string;
    items: string[];
  }>;
  strengths: string[];
  improvements: string[];
  metadata?: Record<string, unknown>;
}

// Communication Assessment Types
export interface CommunicationStyleScores {
  direct: number;
  supportive: number;
  analytical: number;
  expressive: number;
}

export interface CommunicationResults extends AssessmentResults {
  styles: CommunicationStyleScores;
  primaryStyle: keyof CommunicationStyleScores;
  adaptabilityScore: number;
}

// Career Launch Types
export interface CareerInterest {
  category: string;
  score: number;
  activities: string[];
}

export interface CareerRecommendation {
  title: string;
  match: number;
  description: string;
  requiredSkills: string[];
  outlook: string;
  salary?: string;
}

export interface CareerLaunchResults extends AssessmentResults {
  interests: CareerInterest[];
  skillGaps: string[];
  careerPaths: CareerRecommendation[];
  nextSteps: string[];
}

// Gen Z Assessment Types
export interface GenZDimensions {
  authenticity: number;
  flexibility: number;
  purpose: number;
  collaboration: number;
  innovation: number;
  wellbeing: number;
}

export interface GenZTrait {
  trait: string;
  level: number;
  description: string;
}

export interface CompanyMatch {
  name: string;
  match: number;
  industry: string;
  culture: string[];
  why: string;
}

export interface GenZResults {
  dimensions: GenZDimensions;
  traits: GenZTrait[];
  workplacePreferences: Record<string, Record<string, number>>;
  companyMatches: CompanyMatch[];
  redFlags: Array<{
    flag: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  employerInsights?: Record<string, unknown>;
  validityMetrics?: ValidityMetrics;
}

export interface ValidityMetrics {
  consistencyScore: number;
  engagementLevel: 'low' | 'medium' | 'high';
  responsePattern: string;
  flags: string[];
}

// Cultural Intelligence Types
export interface CQScores {
  drive: number;
  knowledge: number;
  strategy: number;
  action: number;
}

export interface CulturalScenario {
  id: string;
  title: string;
  context: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    cultural_appropriateness: number;
    reasoning: string;
  }>;
  cultural_context: string;
  learning_objective: string;
}

// Emotional Intelligence Types
export interface EQDimensions {
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
}

// Error Types
export interface AssessmentError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// API Response Types
export interface AssessmentApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: AssessmentError;
}

// Component Props Types
export interface AssessmentQuestionsProps {
  onComplete: (data: AssessmentData) => void;
  assessmentType?: string;
  questions?: AssessmentQuestion[];
}

export interface AssessmentResultsProps {
  data: AssessmentData | Record<string, unknown>; // More flexible to accept custom result formats
  assessmentType?: string;
  candidateInfo?: CandidateInfo;
}

export interface SimulationComponentProps {
  question: AssessmentQuestion;
  onResponse: (response: AssessmentResponse) => void;
  isActive: boolean;
  timeRemaining?: number;
}

export interface RankingComponentProps {
  question: AssessmentQuestion;
  options: Array<{
    id: string;
    text: string;
    description?: string;
    indicators?: string[];
  }>;
  onResponse: (response: AssessmentResponse) => void;
}

// Scoring Hook Types
export interface ScoringResult<T = AssessmentResults> {
  results: T;
  isLoading: boolean;
  error: string | null;
  generateReport?: () => Promise<void>;
}

// Context Types
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  role?: 'admin' | 'user' | 'employer' | 'partner';
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

// Partner Types
export interface Partner {
  id: string;
  username: string;
  organizationName: string;
  contactEmail: string;
  isActive: boolean;
  accessExpiresAt: string;
  permissions: string[];
}

export interface EmployerContextType {
  employer: AuthUser | null;
  candidates: Array<{
    id: string;
    fullName: string;
    email: string;
    positionApplied?: string;
    assessmentCompleted: boolean;
    invitedAt: string;
    completedAt?: string;
  }>;
  loading: boolean;
  inviteCandidate: (candidateData: {
    fullName: string;
    email: string;
    positionApplied?: string;
  }) => Promise<{ error?: string }>;
  refreshCandidates: () => Promise<void>;
}

// AI Analysis Types
export interface AIAnalysisConfig {
  model: 'gpt-4' | 'gpt-3.5-turbo';
  analysisDepth: 'standard' | 'detailed' | 'comprehensive';
  includeInsights: boolean;
  includePredictions: boolean;
}

export interface AIAnalysisResult {
  executiveSummary: {
    overallAssessment: string;
    keyInsights: string[];
    recommendations: string[];
  };
  detailedAnalysis: Record<string, unknown>;
  confidenceLevel: number;
  limitations: string[];
}