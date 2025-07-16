import { useState, useCallback } from 'react';
import { digitalWellnessQuestions, digitalScenarios, timeTasks, behavioralSimulations } from '../data/digitalWellnessData';
import { BehavioralInsights } from './useDigitalHabitsTracker';

export interface DimensionScore {
  score: number;
  percentage: number;
  level: 'poor' | 'fair' | 'good' | 'excellent';
  interpretation: string;
}

export interface DigitalWellnessScores {
  screenBalance: DimensionScore;
  digitalBoundaries: DimensionScore;
  mindfulUsage: DimensionScore;
  techLifeIntegration: DimensionScore;
}

export interface RiskAssessment {
  burnout: {
    score: number;
    level: 'low' | 'moderate' | 'high';
    factors: string[];
  };
  productivity: {
    score: number;
    level: 'low' | 'moderate' | 'high';
    factors: string[];
  };
  workLifeBalance: {
    score: number;
    level: 'low' | 'moderate' | 'high';
    factors: string[];
  };
}

export interface ValidityCheck {
  overallValidity: 'valid' | 'questionable' | 'invalid';
  underreporting: number;
  socialDesirability: number;
  timeAwarenessAlignment: number;
  responseConsistency: number;
}

export interface DigitalWellnessResults {
  overall: number;
  dimensions: DigitalWellnessScores;
  riskAssessment: RiskAssessment;
  validity: ValidityCheck;
  behavioral: BehavioralInsights;
  recommendations: {
    immediate: Array<{ action: string; description: string }>;
    weekly: string[];
    longterm: string[];
  };
}

export const useDigitalWellnessScoring = () => {
  const [results, setResults] = useState<DigitalWellnessResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const getInterpretation = useCallback((dimension: string, level: string): string => {
    const interpretations = {
      screenBalance: {
        excellent: "You maintain an excellent balance between screen time and offline activities",
        good: "You have good screen time habits with room for minor improvements",
        fair: "Your screen time balance needs attention and adjustment",
        poor: "Your screen time habits significantly impact your well-being"
      },
      digitalBoundaries: {
        excellent: "You have strong digital boundaries and work-life separation",
        good: "You maintain good digital boundaries with occasional lapses",
        fair: "Your digital boundaries need strengthening",
        poor: "You struggle with digital boundaries and always-on connectivity"
      },
      mindfulUsage: {
        excellent: "You use technology very intentionally and purposefully",
        good: "You generally use technology with clear intentions",
        fair: "You sometimes use technology mindlessly or compulsively",
        poor: "You frequently use technology without clear purpose or awareness"
      },
      techLifeIntegration: {
        excellent: "Technology enhances your life goals and relationships beautifully",
        good: "Technology generally supports your life values and goals",
        fair: "Technology sometimes conflicts with your life priorities",
        poor: "Technology frequently interferes with your life goals and relationships"
      }
    };

    return interpretations[dimension as keyof typeof interpretations]?.[level as keyof typeof interpretations.screenBalance] || 
           "Assessment complete - results available";
  }, []);

  const calculateDimensionScore = useCallback((
    dimension: string, 
    selfReportScores: number[], 
    scenarioScores: { [key: string]: number }[], 
    timeScores: number[], 
    behavioralScores: { [key: string]: number }[]
  ): DimensionScore => {
    // Weight different assessment methods
    const weights = {
      selfReport: 0.25,
      scenarios: 0.25,
      timeAwareness: 0.20,
      behavioral: 0.30
    };

    // Calculate self-report contribution
    const selfReportQuestions = digitalWellnessQuestions.filter(q => q.dimension === dimension);
    const selfReportAvg = selfReportQuestions.length > 0 ? 
      selfReportQuestions.reduce((sum, q, idx) => {
        const score = selfReportScores[digitalWellnessQuestions.indexOf(q)];
        return sum + (q.reversed ? 6 - score : score);
      }, 0) / selfReportQuestions.length : 0;

    // Calculate scenario contribution
    const scenarioContrib = scenarioScores.reduce((sum, scores) => {
      return sum + (scores[dimension] || 0);
    }, 0) / Math.max(scenarioScores.length, 1);

    // Calculate time awareness contribution
    const timeContrib = timeScores.reduce((sum, score) => sum + score, 0) / Math.max(timeScores.length, 1);

    // Calculate behavioral contribution
    const behavioralContrib = behavioralScores.reduce((sum, scores) => {
      return sum + (scores[dimension] || 0);
    }, 0) / Math.max(behavioralScores.length, 1);

    // Weighted final score
    const finalScore = (
      (selfReportAvg * 20) * weights.selfReport +
      scenarioContrib * weights.scenarios +
      timeContrib * weights.timeAwareness +
      behavioralContrib * weights.behavioral
    );

    const percentage = Math.max(0, Math.min(100, finalScore));
    const level = percentage >= 80 ? 'excellent' : 
                 percentage >= 60 ? 'good' : 
                 percentage >= 40 ? 'fair' : 'poor';

    return {
      score: Math.round(finalScore),
      percentage: Math.round(percentage),
      level,
      interpretation: getInterpretation(dimension, level)
    };
  }, [getInterpretation]);

  const calculateRiskAssessment = useCallback((
    dimensions: DigitalWellnessScores,
    behavioral: BehavioralInsights
  ): RiskAssessment => {
    // Burnout risk calculation
    const burnoutScore = Math.round(
      (100 - dimensions.digitalBoundaries.percentage) * 0.4 +
      (100 - dimensions.screenBalance.percentage) * 0.3 +
      behavioral.digitalAnxiety.score * 0.3
    );

    const burnoutFactors = [];
    if (dimensions.digitalBoundaries.percentage < 40) burnoutFactors.push("Poor work-life boundaries");
    if (dimensions.screenBalance.percentage < 40) burnoutFactors.push("Excessive screen time");
    if (behavioral.digitalAnxiety.score > 60) burnoutFactors.push("High digital anxiety");

    // Productivity risk calculation
    const productivityScore = Math.round(
      (100 - dimensions.mindfulUsage.percentage) * 0.4 +
      (100 - behavioral.timeAwareness.score) * 0.3 +
      (100 - behavioral.distractionResistance.score) * 0.3
    );

    const productivityFactors = [];
    if (dimensions.mindfulUsage.percentage < 40) productivityFactors.push("Mindless technology use");
    if (behavioral.timeAwareness.score < 40) productivityFactors.push("Poor time awareness");
    if (behavioral.distractionResistance.score < 40) productivityFactors.push("High distractibility");

    // Work-life balance risk
    const balanceScore = Math.round(
      (100 - dimensions.digitalBoundaries.percentage) * 0.4 +
      (100 - dimensions.techLifeIntegration.percentage) * 0.3 +
      (100 - dimensions.screenBalance.percentage) * 0.3
    );

    const balanceFactors = [];
    if (dimensions.digitalBoundaries.percentage < 40) balanceFactors.push("Always-on connectivity");
    if (dimensions.techLifeIntegration.percentage < 40) balanceFactors.push("Technology conflicts with life goals");
    if (dimensions.screenBalance.percentage < 40) balanceFactors.push("Unbalanced screen time");

    return {
      burnout: {
        score: burnoutScore,
        level: burnoutScore > 70 ? 'high' : burnoutScore > 40 ? 'moderate' : 'low',
        factors: burnoutFactors
      },
      productivity: {
        score: productivityScore,
        level: productivityScore > 70 ? 'high' : productivityScore > 40 ? 'moderate' : 'low',
        factors: productivityFactors
      },
      workLifeBalance: {
        score: balanceScore,
        level: balanceScore > 70 ? 'high' : balanceScore > 40 ? 'moderate' : 'low',
        factors: balanceFactors
      }
    };
  }, []);

  const calculateValidityCheck = useCallback((
    selfReportScores: number[],
    scenarioScores: { [key: string]: number }[],
    behavioral: BehavioralInsights
  ): ValidityCheck => {
    // Check for overreporting (social desirability)
    const distortionQuestions = digitalWellnessQuestions.filter(q => q.distortionType);
    const socialDesirabilityScore = distortionQuestions.reduce((sum, q) => {
      const score = selfReportScores[digitalWellnessQuestions.indexOf(q)];
      return sum + (score === 5 ? 1 : 0); // All perfect answers suspicious
    }, 0) / distortionQuestions.length;

    // Check for underreporting by comparing self-report with behavioral data
    const selfReportAvg = selfReportScores.reduce((sum, score) => sum + score, 0) / selfReportScores.length;
    const behavioralIndicators = (behavioral.digitalAnxiety.score + (100 - behavioral.timeAwareness.score)) / 2;
    const underreporting = Math.abs(selfReportAvg * 20 - behavioralIndicators) / 100;

    // Time awareness alignment
    const timeAwarenessAlignment = behavioral.timeAwareness.score / 100;

    // Response consistency (variance in responses)
    const variance = selfReportScores.reduce((sum, score) => {
      return sum + Math.pow(score - selfReportAvg, 2);
    }, 0) / selfReportScores.length;
    const responseConsistency = Math.max(0, 1 - variance / 4); // Normalize

    // Overall validity
    const validityScore = (
      (1 - socialDesirabilityScore) * 0.3 +
      (1 - underreporting) * 0.3 +
      timeAwarenessAlignment * 0.2 +
      responseConsistency * 0.2
    );

    return {
      overallValidity: validityScore > 0.7 ? 'valid' : validityScore > 0.5 ? 'questionable' : 'invalid',
      underreporting: Math.round(underreporting * 100),
      socialDesirability: Math.round(socialDesirabilityScore * 100),
      timeAwarenessAlignment: Math.round(timeAwarenessAlignment * 100),
      responseConsistency: Math.round(responseConsistency * 100)
    };
  }, []);

  const generateRecommendations = useCallback((
    dimensions: DigitalWellnessScores,
    riskAssessment: RiskAssessment,
    behavioral: BehavioralInsights
  ) => {
    const immediate = [];
    const weekly = [];
    const longterm = [];

    // Screen Balance recommendations
    if (dimensions.screenBalance.percentage < 60) {
      immediate.push({
        action: "Implement the 20-20-20 rule",
        description: "Every 20 minutes, look at something 20 feet away for 20 seconds"
      });
      weekly.push("Set up device-free zones in your home");
      longterm.push("Develop a comprehensive digital wellness routine");
    }

    // Digital Boundaries recommendations
    if (dimensions.digitalBoundaries.percentage < 60) {
      immediate.push({
        action: "Set work communication hours",
        description: "Define clear start and end times for work-related digital communication"
      });
      weekly.push("Practice a weekly digital sabbath");
      longterm.push("Establish sustainable work-life integration practices");
    }

    // Mindful Usage recommendations
    if (dimensions.mindfulUsage.percentage < 60) {
      immediate.push({
        action: "Use app timers and limits",
        description: "Set daily time limits for social media and entertainment apps"
      });
      weekly.push("Conduct weekly digital habit audits");
      longterm.push("Develop mindful technology consumption habits");
    }

    // Tech-Life Integration recommendations
    if (dimensions.techLifeIntegration.percentage < 60) {
      immediate.push({
        action: "Align technology use with values",
        description: "Evaluate whether your technology use supports your life goals"
      });
      weekly.push("Schedule regular offline activities with loved ones");
      longterm.push("Create a personal technology philosophy");
    }

    // Behavioral-based recommendations
    if (behavioral.digitalAnxiety.score > 60) {
      immediate.push({
        action: "Practice digital breathing exercises",
        description: "Take three deep breaths before checking your phone"
      });
    }

    if (behavioral.distractionResistance.score < 40) {
      immediate.push({
        action: "Use focus apps and website blockers",
        description: "Install tools to minimize distractions during focused work time"
      });
    }

    return { immediate, weekly, longterm };
  }, []);

  const calculateScores = useCallback((
    selfReportScores: number[],
    scenarioScores: { [key: string]: number }[],
    timeScores: number[],
    behavioralScores: { [key: string]: number }[],
    behavioral: BehavioralInsights
  ): DigitalWellnessResults => {
    setIsCalculating(true);

    try {
      // Calculate dimension scores
      const dimensions: DigitalWellnessScores = {
        screenBalance: calculateDimensionScore('screenBalance', selfReportScores, scenarioScores, timeScores, behavioralScores),
        digitalBoundaries: calculateDimensionScore('digitalBoundaries', selfReportScores, scenarioScores, timeScores, behavioralScores),
        mindfulUsage: calculateDimensionScore('mindfulUsage', selfReportScores, scenarioScores, timeScores, behavioralScores),
        techLifeIntegration: calculateDimensionScore('techLifeIntegration', selfReportScores, scenarioScores, timeScores, behavioralScores)
      };

      // Calculate overall score
      const overall = Math.round(
        (dimensions.screenBalance.percentage +
         dimensions.digitalBoundaries.percentage +
         dimensions.mindfulUsage.percentage +
         dimensions.techLifeIntegration.percentage) / 4
      );

      // Calculate risk assessment
      const riskAssessment = calculateRiskAssessment(dimensions, behavioral);

      // Calculate validity
      const validity = calculateValidityCheck(selfReportScores, scenarioScores, behavioral);

      // Generate recommendations
      const recommendations = generateRecommendations(dimensions, riskAssessment, behavioral);

      const results: DigitalWellnessResults = {
        overall,
        dimensions,
        riskAssessment,
        validity,
        behavioral,
        recommendations
      };

      setResults(results);
      return results;
    } finally {
      setIsCalculating(false);
    }
  }, [calculateDimensionScore, calculateRiskAssessment, calculateValidityCheck, generateRecommendations]);

  const reset = useCallback(() => {
    setResults(null);
    setIsCalculating(false);
  }, []);

  return {
    results,
    isCalculating,
    calculateScores,
    reset
  };
};