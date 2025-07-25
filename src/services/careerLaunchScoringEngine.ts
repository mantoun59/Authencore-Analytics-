// Advanced CareerLaunch Scoring Engine with Psychometric Weighting
export interface CareerLaunchScoringConfig {
  dimensionWeights: Record<string, number>;
  demographicAdjustments: Record<string, Record<string, number>>;
  validityChecks: ValidityConfig;
  percentileNorms: PercentileNorms;
}

export interface ValidityConfig {
  minResponseTime: number;
  maxResponseTime: number;
  consistencyThreshold: number;
  straightLiningThreshold: number;
  speedFlagThreshold: number;
}

export interface PercentileNorms {
  riasec: Record<string, number[]>;
  aptitudes: Record<string, number[]>;
  personality: Record<string, number[]>;
  values: Record<string, number[]>;
}

export interface ScoringWeight {
  questionId: string;
  baseWeight: number;
  dimensionWeight: number;
  contextualWeight: number;
  reliabilityWeight: number;
  finalWeight: number;
}

export interface CareerLaunchDimensions {
  skill_readiness: number;
  workplace_maturity: number;
  communication_skills: number;
  problem_solving: number;
  adaptability: number;
  leadership_potential: number;
  career_exploration: number;
  practical_skills: number;
}

export class CareerLaunchScoringEngine {
  private static instance: CareerLaunchScoringEngine;
  
  private config: CareerLaunchScoringConfig = {
    dimensionWeights: {
      // RIASEC Weights (Higher weight for career-relevant dimensions)
      Realistic: 0.85,          // Technical/hands-on aptitude
      Investigative: 1.2,       // Research/analytical skills
      Artistic: 0.9,           // Creative problem-solving
      Social: 1.1,             // Interpersonal effectiveness
      Enterprising: 1.3,       // Leadership/business acumen
      Conventional: 1.0,       // Organization/attention to detail
      
      // Aptitude Weights (Cognitive abilities)
      verbal_reasoning: 1.4,    // Critical for most careers
      numerical_reasoning: 1.2, // Quantitative skills
      abstract_reasoning: 1.1,  // Problem-solving ability
      memory_attention: 0.9,    // Working memory capacity
      
      // Personality Weights (Workplace behaviors)
      conscientiousness: 1.5,   // Work ethic, reliability
      openness: 1.1,           // Adaptability, learning
      extraversion: 0.8,       // Social energy (context-dependent)
      agreeableness: 0.9,      // Teamwork orientation
      emotional_stability: 1.2, // Stress management
      
      // Values Weights (Career motivation)
      achievement: 1.3,         // Drive for success
      security: 1.0,           // Stability preference
      autonomy: 1.1,           // Independence
      altruism: 0.9,           // Service orientation
      variety: 1.0,            // Stimulation seeking
      work_life_balance: 1.2   // Sustainable career approach
    },
    
    demographicAdjustments: {
      age: {
        "18-20": 0.95,  // Account for development
        "21-23": 1.0,   // Peak assessment age
        "24-26": 1.05,  // Early career experience
        "27+": 1.1      // Mature perspective
      },
      education: {
        "high_school": 0.9,
        "some_college": 1.0,
        "bachelors": 1.1,
        "graduate": 1.2
      },
      experience: {
        "none": 0.85,
        "internship": 1.0,
        "part_time": 1.05,
        "full_time": 1.2
      }
    },
    
    validityChecks: {
      minResponseTime: 2,      // Seconds per question minimum
      maxResponseTime: 300,    // Seconds per question maximum
      consistencyThreshold: 0.7, // Internal consistency requirement
      straightLiningThreshold: 0.8, // Same response pattern threshold
      speedFlagThreshold: 1.5   // Average response time threshold
    },
    
    percentileNorms: {
      riasec: {
        Realistic: [20, 35, 50, 65, 80, 90, 95],
        Investigative: [25, 40, 55, 70, 82, 91, 96],
        Artistic: [18, 32, 48, 63, 78, 88, 94],
        Social: [22, 38, 52, 67, 81, 89, 95],
        Enterprising: [19, 34, 49, 64, 79, 89, 94],
        Conventional: [24, 39, 54, 69, 83, 91, 96]
      },
      aptitudes: {
        verbal_reasoning: [30, 45, 60, 75, 85, 92, 97],
        numerical_reasoning: [25, 40, 55, 70, 82, 90, 95],
        abstract_reasoning: [20, 35, 50, 65, 80, 88, 94],
        memory_attention: [28, 43, 58, 73, 84, 91, 96]
      },
      personality: {
        conscientiousness: [25, 40, 55, 70, 82, 90, 95],
        openness: [22, 37, 52, 67, 81, 89, 94],
        extraversion: [20, 35, 50, 65, 80, 88, 93],
        agreeableness: [30, 45, 60, 75, 85, 92, 96],
        emotional_stability: [24, 39, 54, 69, 83, 91, 95]
      },
      values: {
        achievement: [18, 33, 48, 63, 78, 87, 93],
        security: [25, 40, 55, 70, 82, 90, 95],
        autonomy: [20, 35, 50, 65, 80, 88, 94],
        altruism: [22, 37, 52, 67, 81, 89, 94],
        variety: [19, 34, 49, 64, 79, 87, 93],
        work_life_balance: [28, 43, 58, 73, 84, 91, 96]
      }
    }
  };

  static getInstance(): CareerLaunchScoringEngine {
    if (!CareerLaunchScoringEngine.instance) {
      CareerLaunchScoringEngine.instance = new CareerLaunchScoringEngine();
    }
    return CareerLaunchScoringEngine.instance;
  }

  calculateScoringWeights(responses: any[], candidateProfile?: any): ScoringWeight[] {
    return responses.map((response, index) => {
      const baseWeight = this.getBaseWeight(response);
      const dimensionWeight = this.getDimensionWeight(response.dimension);
      const contextualWeight = this.getContextualWeight(response, candidateProfile);
      const reliabilityWeight = this.getReliabilityWeight(response, responses);
      
      const finalWeight = baseWeight * dimensionWeight * contextualWeight * reliabilityWeight;
      
      return {
        questionId: response.id,
        baseWeight,
        dimensionWeight,
        contextualWeight,
        reliabilityWeight,
        finalWeight: Math.round(finalWeight * 1000) / 1000
      };
    });
  }

  private getBaseWeight(response: any): number {
    // Base weight varies by question type and position
    if (response.category === 'RIASEC') return 1.0;
    if (response.category === 'Aptitude') return 1.2;
    if (response.category === 'Personality') return 1.1;
    if (response.category === 'Values') return 0.9;
    return 1.0;
  }

  private getDimensionWeight(dimension: string): number {
    return this.config.dimensionWeights[dimension] || 1.0;
  }

  private getContextualWeight(response: any, profile?: any): number {
    let weight = 1.0;
    
    // Adjust based on candidate profile
    if (profile) {
      weight *= this.config.demographicAdjustments.age[profile.age] || 1.0;
      weight *= this.config.demographicAdjustments.education[profile.education] || 1.0;
      weight *= this.config.demographicAdjustments.experience[profile.experience] || 1.0;
    }
    
    return weight;
  }

  private getReliabilityWeight(response: any, allResponses: any[]): number {
    // Check for response patterns that might indicate low reliability
    const responseTime = response.responseTime || 5;
    let reliabilityWeight = 1.0;
    
    // Penalize very fast responses
    if (responseTime < this.config.validityChecks.speedFlagThreshold) {
      reliabilityWeight *= 0.7;
    }
    
    // Penalize very slow responses (may indicate distraction)
    if (responseTime > 60) {
      reliabilityWeight *= 0.8;
    }
    
    return reliabilityWeight;
  }

  scoreCareerReadiness(responses: any[], candidateProfile?: any): CareerLaunchDimensions {
    const weights = this.calculateScoringWeights(responses, candidateProfile);
    const dimensionScores: Partial<CareerLaunchDimensions> = {};
    
    // Group responses by career readiness dimensions
    const dimensionGroups = this.groupResponsesByCareerDimension(responses);
    
    // Calculate weighted scores for each dimension
    Object.entries(dimensionGroups).forEach(([dimension, groupResponses]) => {
      const dimensionScore = this.calculateDimensionScore(groupResponses, weights);
      dimensionScores[dimension as keyof CareerLaunchDimensions] = dimensionScore;
    });
    
    // Apply career-specific adjustments
    return this.applyCareerSpecificAdjustments(dimensionScores as CareerLaunchDimensions);
  }

  private groupResponsesByCareerDimension(responses: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {
      skill_readiness: [],
      workplace_maturity: [],
      communication_skills: [],
      problem_solving: [],
      adaptability: [],
      leadership_potential: [],
      career_exploration: [],
      practical_skills: []
    };
    
    responses.forEach(response => {
      // Map assessment dimensions to career readiness dimensions
      const careerDimension = this.mapToCareerDimension(response);
      if (groups[careerDimension]) {
        groups[careerDimension].push(response);
      }
    });
    
    return groups;
  }

  private mapToCareerDimension(response: any): string {
    // Advanced mapping logic based on question content and category
    const { category, dimension, question } = response;
    
    // RIASEC to career dimension mapping
    if (category === 'RIASEC') {
      switch (dimension) {
        case 'Realistic':
        case 'Conventional':
          return 'practical_skills';
        case 'Investigative':
          return 'problem_solving';
        case 'Artistic':
          return 'adaptability';
        case 'Social':
          return 'communication_skills';
        case 'Enterprising':
          return 'leadership_potential';
        default:
          return 'skill_readiness';
      }
    }
    
    // Aptitude to career dimension mapping
    if (category === 'Aptitude') {
      if (dimension.includes('verbal')) return 'communication_skills';
      if (dimension.includes('numerical') || dimension.includes('abstract')) return 'problem_solving';
      return 'skill_readiness';
    }
    
    // Personality to career dimension mapping
    if (category === 'Personality') {
      if (dimension === 'conscientiousness') return 'workplace_maturity';
      if (dimension === 'openness') return 'adaptability';
      if (dimension === 'extraversion') return 'communication_skills';
      if (dimension === 'emotional_stability') return 'workplace_maturity';
      return 'workplace_maturity';
    }
    
    // Values to career dimension mapping
    if (category === 'Values') {
      if (dimension === 'achievement') return 'leadership_potential';
      if (dimension === 'autonomy') return 'adaptability';
      return 'career_exploration';
    }
    
    return 'skill_readiness'; // Default
  }

  private calculateDimensionScore(responses: any[], weights: ScoringWeight[]): number {
    if (responses.length === 0) return 50; // Default neutral score
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    responses.forEach(response => {
      const weight = weights.find(w => w.questionId === response.id)?.finalWeight || 1.0;
      const score = this.normalizeResponseScore(response);
      
      weightedSum += score * weight;
      totalWeight += weight;
    });
    
    const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 50;
    return Math.max(0, Math.min(100, Math.round(rawScore)));
  }

  private normalizeResponseScore(response: any): number {
    // Convert various response formats to 0-100 scale
    if (typeof response.score === 'number') {
      return response.score;
    }
    
    if (response.value !== undefined) {
      // Assume 1-5 Likert scale
      return ((response.value - 1) / 4) * 100;
    }
    
    if (response.answer !== undefined) {
      // Assume percentage or 0-100 scale
      return Number(response.answer) || 50;
    }
    
    return 50; // Default neutral score
  }

  private applyCareerSpecificAdjustments(scores: CareerLaunchDimensions): CareerLaunchDimensions {
    // Apply career readiness specific adjustments
    const adjustedScores = { ...scores };
    
    // Boost scores for high conscientiousness + problem solving
    if (scores.workplace_maturity > 70 && scores.problem_solving > 70) {
      adjustedScores.skill_readiness = Math.min(100, scores.skill_readiness + 5);
    }
    
    // Boost leadership for high communication + adaptability
    if (scores.communication_skills > 75 && scores.adaptability > 75) {
      adjustedScores.leadership_potential = Math.min(100, scores.leadership_potential + 8);
    }
    
    // Ensure balanced profile (no single dimension dominates excessively)
    const maxScore = Math.max(...Object.values(adjustedScores));
    const minScore = Math.min(...Object.values(adjustedScores));
    
    if (maxScore - minScore > 40) {
      // Apply gentle smoothing
      Object.keys(adjustedScores).forEach(key => {
        const score = adjustedScores[key as keyof CareerLaunchDimensions];
        if (score === maxScore) {
          adjustedScores[key as keyof CareerLaunchDimensions] = Math.max(score - 3, 0);
        } else if (score === minScore) {
          adjustedScores[key as keyof CareerLaunchDimensions] = Math.min(score + 3, 100);
        }
      });
    }
    
    return adjustedScores;
  }

  calculatePercentileRanks(scores: CareerLaunchDimensions): Record<string, number> {
    const percentiles: Record<string, number> = {};
    
    Object.entries(scores).forEach(([dimension, score]) => {
      percentiles[dimension] = this.scoreToPercentile(score, dimension);
    });
    
    return percentiles;
  }

  private scoreToPercentile(score: number, dimension: string): number {
    // Use appropriate norm table based on dimension category
    let norms: number[] = [];
    
    if (['skill_readiness', 'practical_skills'].includes(dimension)) {
      norms = this.config.percentileNorms.aptitudes.verbal_reasoning;
    } else if (['workplace_maturity'].includes(dimension)) {
      norms = this.config.percentileNorms.personality.conscientiousness;
    } else if (['communication_skills'].includes(dimension)) {
      norms = this.config.percentileNorms.personality.extraversion;
    } else {
      // Default norms
      norms = [20, 35, 50, 65, 80, 90, 95];
    }
    
    // Find percentile rank
    for (let i = 0; i < norms.length; i++) {
      if (score <= norms[i]) {
        return [10, 25, 50, 75, 90, 95, 99][i];
      }
    }
    
    return 99; // Top percentile
  }

  validateAssessmentQuality(responses: any[], totalTime: number): {
    isValid: boolean;
    warnings: string[];
    qualityScore: number;
  } {
    const warnings: string[] = [];
    let qualityScore = 100;
    
    // Check response times
    const avgResponseTime = totalTime / responses.length;
    if (avgResponseTime < this.config.validityChecks.minResponseTime) {
      warnings.push("Response time appears unusually fast - results may be less reliable");
      qualityScore -= 20;
    }
    
    // Check for straight-lining
    const uniqueResponses = new Set(responses.map(r => r.value || r.answer));
    const responseVariety = uniqueResponses.size / responses.length;
    if (responseVariety < 0.3) {
      warnings.push("Limited response variety detected - consider retaking for best results");
      qualityScore -= 25;
    }
    
    // Check completion rate
    const completedResponses = responses.filter(r => r.value !== undefined || r.answer !== undefined);
    const completionRate = completedResponses.length / responses.length;
    if (completionRate < 0.9) {
      warnings.push("Some questions appear incomplete");
      qualityScore -= 15;
    }
    
    const isValid = qualityScore >= 60;
    
    return {
      isValid,
      warnings,
      qualityScore: Math.max(0, qualityScore)
    };
  }
}