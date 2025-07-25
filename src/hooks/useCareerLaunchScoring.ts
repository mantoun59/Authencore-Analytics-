import { useState } from 'react';
import { CareerLaunchScoringEngine, CareerLaunchDimensions } from '@/services/careerLaunchScoringEngine';

interface AnswerItem {
  id: string;
  category: 'interest' | 'aptitude' | 'personality' | 'value' | 'RIASEC' | 'Aptitude' | 'Personality' | 'Values';
  dimension: string;
  score: number;
  value?: number;
  answer?: any;
  responseTime?: number;
}

interface CareerLaunchResult {
  // Raw dimension scores
  dimensionScores: CareerLaunchDimensions;
  
  // Percentile rankings
  percentileRanks: Record<string, number>;
  
  // Overall readiness indicators
  overallReadiness: number;
  readinessLevel: 'Emerging' | 'Developing' | 'Ready' | 'Advanced';
  
  // Detailed analysis
  strengths: string[];
  developmentAreas: string[];
  careerRecommendations: string[];
  
  // Quality metrics
  assessmentQuality: {
    isValid: boolean;
    warnings: string[];
    qualityScore: number;
  };
  
  // Enhanced insights
  insights: {
    careerFitProfile: string;
    workplaceReadiness: string;
    nextSteps: string[];
  };
  
  // Legacy compatibility
  interests?: any;
  aptitudes?: any;
  personality?: any;
  values?: any;
  flags?: any;
  career_fit?: any;
  action_plan?: string[];
}

export const useCareerLaunchScoring = () => {
  const [result, setResult] = useState<CareerLaunchResult | null>(null);
  const scoringEngine = CareerLaunchScoringEngine.getInstance();

  const calculateScores = (answers: AnswerItem[], candidateProfile?: any, totalTime?: number): CareerLaunchResult => {
    // Enhanced CareerLaunch Scoring initiated with responses
    
    // Validate assessment quality
    const assessmentQuality = scoringEngine.validateAssessmentQuality(answers, totalTime || 1200);
    
    // Calculate core dimension scores using advanced weighting
    const dimensionScores = scoringEngine.scoreCareerReadiness(answers, candidateProfile);
    
    // Calculate percentile rankings
    const percentileRanks = scoringEngine.calculatePercentileRanks(dimensionScores);
    
    // Calculate overall readiness score
    const overallReadiness = Math.round(
      Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 
      Object.values(dimensionScores).length
    );
    
    // Determine readiness level
    const readinessLevel = getReadinessLevel(overallReadiness);
    
    // Generate insights and recommendations
    const { strengths, developmentAreas } = identifyStrengthsAndAreas(dimensionScores);
    const careerRecommendations = generateCareerRecommendations(dimensionScores, percentileRanks);
    const insights = generateInsights(dimensionScores, overallReadiness);
    
    const newResult: CareerLaunchResult = {
      dimensionScores,
      percentileRanks,
      overallReadiness,
      readinessLevel,
      strengths,
      developmentAreas,
      careerRecommendations,
      assessmentQuality,
      insights,
      
      // Legacy compatibility - map to old format
      interests: mapToLegacyInterests(dimensionScores),
      aptitudes: mapToLegacyAptitudes(dimensionScores),
      personality: mapToLegacyPersonality(dimensionScores),
      values: mapToLegacyValues(dimensionScores),
      flags: { misalignment: generateCompatibilityFlags(dimensionScores) },
      career_fit: {
        label: insights.careerFitProfile,
        suggestions: careerRecommendations.slice(0, 3)
      },
      action_plan: insights.nextSteps
    };

    setResult(newResult);
    return newResult;
  };

  return {
    result,
    calculateScores,
    setResult
  };
};

// Helper functions for enhanced scoring

function getReadinessLevel(score: number): CareerLaunchResult['readinessLevel'] {
  if (score >= 85) return 'Advanced';
  if (score >= 70) return 'Ready';
  if (score >= 55) return 'Developing';
  return 'Emerging';
}

function identifyStrengthsAndAreas(scores: CareerLaunchDimensions): {
  strengths: string[];
  developmentAreas: string[];
} {
  const entries = Object.entries(scores);
  const sorted = entries.sort(([,a], [,b]) => b - a);
  
  const strengths = sorted
    .filter(([, score]) => score >= 75)
    .slice(0, 3)
    .map(([dimension]) => formatDimensionName(dimension));
  
  const developmentAreas = sorted
    .filter(([, score]) => score < 65)
    .slice(-3)
    .map(([dimension]) => formatDimensionName(dimension));
  
  return { strengths, developmentAreas };
}

function formatDimensionName(dimension: string): string {
  return dimension
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function generateCareerRecommendations(scores: CareerLaunchDimensions, percentiles: Record<string, number>): string[] {
  const recommendations: string[] = [];
  
  // High leadership potential
  if (scores.leadership_potential >= 75 && scores.communication_skills >= 70) {
    recommendations.push("Management Trainee Programs", "Entrepreneurship Opportunities", "Team Lead Roles");
  }
  
  // Strong problem solving
  if (scores.problem_solving >= 80) {
    recommendations.push("Data Analysis Roles", "Consulting Positions", "Research & Development");
  }
  
  // High practical skills
  if (scores.practical_skills >= 75) {
    recommendations.push("Technical Specialist Roles", "Operations Management", "Project Coordination");
  }
  
  // Strong communication
  if (scores.communication_skills >= 80) {
    recommendations.push("Client Relations", "Training & Development", "Marketing Communications");
  }
  
  // High workplace maturity
  if (scores.workplace_maturity >= 80) {
    recommendations.push("Administrative Roles", "Process Improvement", "Quality Assurance");
  }
  
  // Balanced profile
  if (Object.values(scores).every(score => score >= 65 && score <= 85)) {
    recommendations.push("General Management", "Business Analyst", "Project Manager");
  }
  
  // Default recommendations if none match
  if (recommendations.length === 0) {
    recommendations.push("Entry-Level Professional Roles", "Skill Development Programs", "Internship Opportunities");
  }
  
  return [...new Set(recommendations)]; // Remove duplicates
}

function generateInsights(scores: CareerLaunchDimensions, overallScore: number): CareerLaunchResult['insights'] {
  const topDimension = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  
  // Career fit profile
  let careerFitProfile = "Balanced Professional";
  if (scores.leadership_potential >= 80) careerFitProfile = "Natural Leader";
  else if (scores.problem_solving >= 80) careerFitProfile = "Analytical Thinker";
  else if (scores.communication_skills >= 80) careerFitProfile = "People Connector";
  else if (scores.practical_skills >= 80) careerFitProfile = "Hands-On Implementer";
  else if (scores.adaptability >= 80) careerFitProfile = "Flexible Innovator";
  
  // Workplace readiness
  let workplaceReadiness = "Ready to contribute with proper onboarding";
  if (overallScore >= 85) workplaceReadiness = "Highly prepared for immediate contribution";
  else if (overallScore >= 70) workplaceReadiness = "Well-prepared with minor skill development needed";
  else if (overallScore < 55) workplaceReadiness = "Requires significant development before workplace entry";
  
  // Next steps
  const nextSteps: string[] = [];
  if (scores.skill_readiness < 70) {
    nextSteps.push("Complete relevant certifications or training programs");
  }
  if (scores.workplace_maturity < 65) {
    nextSteps.push("Gain practical experience through internships or part-time work");
  }
  if (scores.communication_skills < 70) {
    nextSteps.push("Develop professional communication skills through practice and feedback");
  }
  if (scores.leadership_potential >= 75) {
    nextSteps.push("Seek leadership opportunities in current roles or volunteer activities");
  }
  if (nextSteps.length === 0) {
    nextSteps.push("Explore advanced opportunities that match your strengths");
  }
  
  return {
    careerFitProfile,
    workplaceReadiness,
    nextSteps
  };
}

// Legacy compatibility mapping functions
function mapToLegacyInterests(scores: CareerLaunchDimensions): any {
  return {
    realistic: scores.practical_skills,
    investigative: scores.problem_solving,
    artistic: scores.adaptability,
    social: scores.communication_skills,
    enterprising: scores.leadership_potential,
    conventional: scores.workplace_maturity
  };
}

function mapToLegacyAptitudes(scores: CareerLaunchDimensions): any {
  return [
    { name: "Problem Solving", score: scores.problem_solving },
    { name: "Communication", score: scores.communication_skills },
    { name: "Leadership", score: scores.leadership_potential },
    { name: "Practical Skills", score: scores.practical_skills }
  ].sort((a, b) => b.score - a.score);
}

function mapToLegacyPersonality(scores: CareerLaunchDimensions): any {
  return {
    conscientiousness: scores.workplace_maturity,
    openness: scores.adaptability,
    introversion: 100 - scores.communication_skills, // Inverted
    adaptability: scores.adaptability
  };
}

function mapToLegacyValues(scores: CareerLaunchDimensions): any {
  return {
    achievement: scores.leadership_potential,
    security: scores.workplace_maturity,
    creativity: scores.adaptability,
    community: scores.communication_skills
  };
}

function generateCompatibilityFlags(scores: CareerLaunchDimensions): string[] {
  const flags: string[] = [];
  
  if (scores.leadership_potential > 80 && scores.communication_skills < 60) {
    flags.push("High leadership potential but may need communication skill development");
  }
  
  if (scores.problem_solving > 80 && scores.practical_skills < 50) {
    flags.push("Strong analytical skills but may benefit from hands-on experience");
  }
  
  if (scores.adaptability > 80 && scores.workplace_maturity < 60) {
    flags.push("High adaptability but may need structure for optimal performance");
  }
  
  const minScore = Math.min(...Object.values(scores));
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore - minScore > 35) {
    flags.push("Significant variance in skills - focus on developing weaker areas");
  }
  
  return flags;
}