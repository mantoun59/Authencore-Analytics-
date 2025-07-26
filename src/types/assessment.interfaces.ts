/**
 * Comprehensive TypeScript interfaces for assessment system
 * Replaces `any` types with proper interfaces
 */

// Base Assessment Interfaces
export interface AssessmentResponse {
  questionId: string;
  answer: string | number | boolean | string[] | number[];
  responseTime?: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentType: string;
  overallScore: number;
  dimensionScores: DimensionScore[];
  completedAt: string;
  validityMetrics?: ValidityMetrics;
  recommendations?: string[];
}

export interface DimensionScore {
  dimension: string;
  score: number;
  percentile?: number;
  description?: string;
  subcategories?: Record<string, number>;
}

export interface ValidityMetrics {
  consistencyScore: number;
  responseTimeVariance: number;
  socialDesirabilityBias: number;
  extremeResponsePattern: number;
  overallValidity: 'high' | 'medium' | 'low';
}

// Career Launch Assessment Types
export interface CareerLaunchAnswer {
  questionId: string;
  answer: string | number | boolean | string[];
  responseTime?: number;
  phase?: number;
}

export interface CareerLaunchDimensions {
  selfAwareness: number;
  careerExploration: number;
  decisionMaking: number;
  planning: number;
  problemSolving: number;
  resilience: number;
  adaptability: number;
  communication: number;
  leadership: number;
  teamwork: number;
}

export interface CareerLaunchResult {
  overallScore: number;
  dimensions: CareerLaunchDimensions;
  interests: CareerInterests;
  aptitudes: CareerAptitudes;
  personality: PersonalityProfile;
  values: WorkValues;
  flags?: RedFlag[];
  career_fit?: CareerMatch[];
  recommendations?: string[];
}

export interface CareerInterests {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface CareerAptitudes {
  numerical: number;
  verbal: number;
  spatial: number;
  logical: number;
  creative: number;
  interpersonal: number;
}

export interface PersonalityProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface WorkValues {
  achievement: number;
  autonomy: number;
  security: number;
  relationships: number;
  creativity: number;
  leadership: number;
}

export interface RedFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendation?: string;
}

export interface CareerMatch {
  career: string;
  match: number;
  readiness: string;
  growth: string;
  description?: string;
}

// Communication Assessment Types
export interface CommunicationResponse {
  questionId: string;
  response: string | number | string[];
  responseType: 'multiple_choice' | 'ranking' | 'written' | 'scenario';
  responseTime?: number;
}

export interface CommunicationDimensions {
  clarity: number;
  empathy: number;
  assertiveness: number;
  adaptability: number;
  listening: number;
  nonverbal: number;
  conflictResolution: number;
  persuasion: number;
}

// GenZ Assessment Types
export interface GenZScenarioResponse {
  scenarioId: string;
  swipeDirection: 'left' | 'right';
  responseTime: number;
  confidence?: number;
}

export interface GenZCollaborationResponse {
  scenarioId: string;
  selectedOption: string;
  optionScores: Record<string, number>;
}

export interface GenZValuesResponse {
  valueId: string;
  rank: number;
}

export interface GenZWorkplaceProfile {
  dimensions: {
    flexibility: number;
    purpose: number;
    growth: number;
    technology: number;
    diversity: number;
    feedback: number;
    autonomy: number;
    collaboration: number;
  };
  traits: string[];
  companyMatches: CompanyMatch[];
  redFlags: RedFlag[];
  workplacePreferences: WorkplacePreference[];
}

export interface CompanyMatch {
  name: string;
  match: number;
  type: string;
  description: string;
  pros: string[];
  considerations: string[];
}

export interface WorkplacePreference {
  category: string;
  preference: string;
  importance: number;
}

// Progress Management Types
export interface AssessmentProgressData {
  id: string;
  userId?: string;
  guestToken?: string;
  assessmentType: string;
  currentQuestion: number;
  currentPhase: number;
  responses: Record<string, AssessmentResponse>;
  phaseData: Record<string, unknown>;
  progressPercentage: number;
  isCompleted: boolean;
  startedAt: string;
  lastSavedAt: string;
  expiresAt: string;
}

// Employer/Partner Types
export interface EmployerCandidate {
  id: string;
  employerId: string;
  fullName: string;
  email: string;
  positionApplied?: string;
  assessmentCompleted: boolean;
  completedAt?: string;
  reportUrl?: string;
  demographics?: CandidateDemographics;
}

export interface CandidateDemographics {
  age?: number;
  gender?: string;
  country?: string;
  educationLevel?: string;
  workExperience?: string;
  industry?: string;
}

// Payment and Order Types
export interface OrderItem {
  id: string;
  orderId: string;
  assessmentType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentPlan {
  id: string;
  name: string;
  planType: string;
  price: number;
  currency: string;
  description?: string;
  maxAssessments?: number;
  assessmentAccess: string[];
  isActive: boolean;
}

// Cultural Intelligence Types
export interface CulturalScenarioResponse {
  scenarioId: string;
  response: string;
  appropriateness: number;
  explanation?: string;
  responseTime?: number;
}

export interface EmailAdaptation {
  text: string;
  targetCountry: string;
  adaptationRating?: number;
}

// Utility Types
export interface NormativeData {
  assessmentType: string;
  dimension: string;
  demographicGroup: Record<string, unknown>;
  sampleSize: number;
  meanScore: number;
  standardDeviation: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export interface BiasAnalysisResult {
  assessmentType: string;
  timeFrameDays: number;
  genderAnalysis: Record<string, {
    averageScore: number;
    sampleSize: number;
  }>;
  adverseImpactRatio: number;
  biasRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
  analyzedAt: string;
}

// Security and Validation Types
export interface SecurityEvent {
  id: string;
  userId?: string;
  eventType: string;
  eventDetails: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  lastAccessed: string;
}

// Generic utility types for replacing any
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}

// Event handler types
export type EventHandler<T = JSONValue> = (value: T) => void;
export type AsyncEventHandler<T = JSONValue> = (value: T) => Promise<void>;

// API Response types
export interface APIResponse<T = JSONValue> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: JSONObject;
  };
  status?: number;
  success?: boolean;
}

// Function parameter types to replace any[]
export type ScenarioResponse = GenZScenarioResponse | CommunicationResponse | CulturalScenarioResponse;
export type AnyResponse = AssessmentResponse | ScenarioResponse | CareerLaunchAnswer;
export type ResponseArray = AnyResponse[];

// Chart and visualization data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: JSONObject;
}

export type ChartData = ChartDataPoint[];

// Component prop types for complex data
export interface AssessmentComponentProps {
  responses: ResponseArray;
  onComplete: (results: AssessmentResult) => void;
  onProgress?: (progress: number) => void;
  candidateProfile?: CandidateDemographics;
}

export interface ReportGenerationProps {
  assessmentType: string;
  userId?: string;
  reportData: AssessmentResult;
  reportType?: 'candidate' | 'employer';
}