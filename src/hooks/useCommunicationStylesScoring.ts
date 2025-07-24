import { useState } from 'react';
import { communicationStylesQuestions } from '../data/communicationStylesQuestions';
import { validateResponseConsistency, AssessmentLogger } from '@/types/assessment.enhanced';

export interface CommunicationDimension {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  percentile: number;
  description: string;
}

export interface CommunicationProfile {
  type: 'Director' | 'Socializer' | 'Thinker' | 'Supporter' | 'Balanced';
  primary: string;
  secondary: string;
  strength: string;
  challenge: string;
  workStyle: string;
}

export interface DistortionAnalysis {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  indicators: string[];
  reliability: 'High' | 'Moderate' | 'Low' | 'Questionable';
  recommendations: string[];
  // Enhanced fields
  consistencyCheck: number;
  extremePatterns: number;
  socialDesirabilityBias: number;
  responseTimePattern: number;
}

export interface CommunicationStylesResults {
  // Core Dimensions
  dimensions: {
    assertiveness: CommunicationDimension;
    expressiveness: CommunicationDimension;
    informationProcessing: CommunicationDimension;
    channelPreferences: CommunicationDimension;
    listeningPatterns: CommunicationDimension;
    influenceStrategies: CommunicationDimension;
    conflictCommunication: CommunicationDimension;
  };
  
  // Overall Scores
  overallScore: number;
  communicationEffectivenessIndex: number;
  adaptabilityScore: number;
  
  // Profile Analysis
  profile: CommunicationProfile;
  
  // Distortion Analysis (Employer Review)
  distortionAnalysis: DistortionAnalysis;
  
  // Contextual Effectiveness
  contextualEffectiveness: {
    leadership: number;
    teamwork: number;
    customerService: number;
    salesNegotiation: number;
    conflictResolution: number;
    publicSpeaking: number;
  };
  
  // Development Areas
  developmentAreas: {
    priority: string;
    description: string;
    actionItems: string[];
  }[];
  
  // Timestamp and metadata
  completedAt: string;
  timeSpent: number;
  responsePattern: string;
}

export const useCommunicationStylesScoring = () => {
  const [results, setResults] = useState<CommunicationStylesResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateResults = async (
    answers: Record<string, any>,
    startTime: number,
    responseTimings: Record<string, number>
  ): Promise<CommunicationStylesResults> => {
    setIsProcessing(true);
    
    try {
      const timeSpent = Date.now() - startTime;
      
      // Calculate dimension scores
      const dimensions = {
        assertiveness: calculateDimensionScore(answers, 'assertiveness', responseTimings),
        expressiveness: calculateDimensionScore(answers, 'expressiveness', responseTimings),
        informationProcessing: calculateDimensionScore(answers, 'information-processing', responseTimings),
        channelPreferences: calculateDimensionScore(answers, 'channel-preferences', responseTimings),
        listeningPatterns: calculateDimensionScore(answers, 'listening-patterns', responseTimings),
        influenceStrategies: calculateDimensionScore(answers, 'influence-strategies', responseTimings),
        conflictCommunication: calculateDimensionScore(answers, 'conflict-communication', responseTimings)
      };

      // Calculate overall effectiveness
      const overallScore = calculateOverallScore(dimensions);
      const communicationEffectivenessIndex = calculateCEI(dimensions);
      const adaptabilityScore = calculateAdaptabilityScore(answers);

      // Determine communication profile
      const profile = determineProfile(dimensions);

      // Analyze distortion patterns
      const distortionAnalysis = calculateDistortionAnalysis(Object.entries(answers).map(([key, value]) => ({ selectedOption: value })));

      // Calculate contextual effectiveness
      const contextualEffectiveness = calculateContextualEffectiveness(dimensions, answers);

      // Identify development areas
      const developmentAreas = identifyDevelopmentAreas(dimensions, profile);

      // Analyze response patterns
      const responsePattern = analyzeResponsePattern(answers, responseTimings);

      const finalResults: CommunicationStylesResults = {
        dimensions,
        overallScore,
        communicationEffectivenessIndex,
        adaptabilityScore,
        profile,
        distortionAnalysis,
        contextualEffectiveness,
        developmentAreas,
        completedAt: new Date().toISOString(),
        timeSpent,
        responsePattern
      };

      setResults(finalResults);
      return finalResults;
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateDimensionScore = (
    answers: Record<string, any>,
    dimension: string,
    responseTimings: Record<string, number>
  ): CommunicationDimension => {
    const dimensionQuestions = communicationStylesQuestions.filter(q => 
      q.dimension === dimension
    );

    let totalScore = 0;
    let totalWeight = 0;
    let validResponses = 0;

    dimensionQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const responseScore = calculateResponseScore(answer, question);
        const weight = question.weight || 1;
        
        totalScore += responseScore * weight;
        totalWeight += weight;
        validResponses++;
      }
    });

    if (validResponses === 0) {
      return createEmptyDimension();
    }

    const rawScore = (totalScore / totalWeight) * 25;
    const normalizedScore = Math.min(100, Math.max(0, rawScore));
    
    return {
      score: normalizedScore,
      level: getScoreLevel(normalizedScore),
      percentile: calculatePercentile(normalizedScore, dimension),
      description: getDimensionDescription(dimension, normalizedScore)
    };
  };

  const calculateResponseScore = (answer: any, question: any): number => {
    if (question.type === 'written-response') {
      return analyzeWrittenResponse(answer, question);
    } else if (question.type === 'ranking') {
      return analyzeRankingResponse(answer);
    } else {
      // Multiple choice or scenario
      const optionIndex = typeof answer === 'string' ? 
        parseInt(answer) : (answer.selectedOption || 0);
      return Math.max(1, Math.min(4, optionIndex + 1));
    }
  };

  const analyzeWrittenResponse = (response: string, question: any): number => {
    if (!response || response.length < 10) return 1;
    
    const wordCount = response.split(/\s+/).length;
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let score = 2; // Base score
    
    // Length and structure analysis
    if (wordCount > 30) score += 0.5;
    if (sentences.length > 2) score += 0.5;
    
    // Linguistic markers based on dimension
    if (question.dimension === 'assertiveness') {
      if (/\b(will|must|should|need to|required|important|directly|clearly)\b/i.test(response)) {
        score += 0.5;
      }
    } else if (question.dimension === 'expressiveness') {
      if (/\b(excited|enthusiastic|great|wonderful|amazing|feel|believe)\b/i.test(response)) {
        score += 0.5;
      }
    } else if (question.dimension === 'listening-patterns') {
      if (/\b(understand|hear|listen|acknowledge|appreciate|perspective)\b/i.test(response)) {
        score += 0.5;
      }
    }
    
    // Professional tone
    if (!/\b(um|uh|like|you know|whatever|kinda|sorta)\b/i.test(response)) {
      score += 0.25;
    }
    
    return Math.min(4, Math.max(1, score));
  };

  const analyzeRankingResponse = (ranking: any[]): number => {
    if (!Array.isArray(ranking) || ranking.length === 0) return 1;
    
    // Analyze ranking consistency and logic
    const hasConsistentPattern = ranking.every((item, index) => 
      typeof item === 'number' && item >= 1 && item <= ranking.length
    );
    
    return hasConsistentPattern ? 3.5 : 2.5;
  };

  const calculateOverallScore = (dimensions: Record<string, CommunicationDimension>): number => {
    const weights = {
      assertiveness: 0.20,
      expressiveness: 0.20,
      informationProcessing: 0.15,
      channelPreferences: 0.15,
      listeningPatterns: 0.10,
      influenceStrategies: 0.10,
      conflictCommunication: 0.10
    };

    let totalScore = 0;
    Object.entries(dimensions).forEach(([key, dimension]) => {
      const weight = weights[key as keyof typeof weights] || 0;
      totalScore += dimension.score * weight;
    });

    return Math.round(totalScore * 100) / 100;
  };

  const calculateCEI = (dimensions: Record<string, CommunicationDimension>): number => {
    const clarity = (dimensions.assertiveness.score + dimensions.informationProcessing.score) / 2;
    const empathy = (dimensions.listeningPatterns.score + dimensions.expressiveness.score) / 2;
    const adaptability = dimensions.channelPreferences.score;
    const influence = dimensions.influenceStrategies.score;
    
    return Math.round(((clarity * 0.25 + empathy * 0.25 + adaptability * 0.25 + influence * 0.25)) * 100) / 100;
  };

  const calculateAdaptabilityScore = (answers: Record<string, any>): number => {
    const adaptiveQuestions = communicationStylesQuestions.filter(q => 
      q.module === 'adaptive-scenarios'
    );

    let adaptabilityScore = 0;
    let validResponses = 0;

    adaptiveQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const responseScore = calculateResponseScore(answer, question);
        adaptabilityScore += responseScore;
        validResponses++;
      }
    });

    if (validResponses === 0) return 0;
    
    return Math.round(((adaptabilityScore / validResponses) * 25) * 100) / 100;
  };

  const determineProfile = (dimensions: Record<string, CommunicationDimension>): CommunicationProfile => {
    const assertiveness = dimensions.assertiveness.score;
    const expressiveness = dimensions.expressiveness.score;
    
    const isHighAssertive = assertiveness > 60;
    const isHighExpressive = expressiveness > 60;
    
    // Determine primary profile
    let type: CommunicationProfile['type'];
    let primary: string;
    let secondary: string;
    let strength: string;
    let challenge: string;
    let workStyle: string;
    
    if (isHighAssertive && !isHighExpressive) {
      type = 'Director';
      primary = 'Results-focused and direct';
      secondary = 'Task-oriented with clear expectations';
      strength = 'Decisive leadership and efficient communication';
      challenge = 'May appear too blunt or impatient with others';
      workStyle = 'Prefers fast-paced, goal-oriented environments';
    } else if (isHighAssertive && isHighExpressive) {
      type = 'Socializer';
      primary = 'Enthusiastic and people-focused';
      secondary = 'Inspiring and relationship-building';
      strength = 'Motivating others and creating positive energy';
      challenge = 'May talk too much or lose focus on details';
      workStyle = 'Thrives in collaborative, creative environments';
    } else if (!isHighAssertive && !isHighExpressive) {
      type = 'Thinker';
      primary = 'Analytical and systematic';
      secondary = 'Quality-focused and thorough';
      strength = 'Attention to detail and logical problem-solving';
      challenge = 'May be slow to decide or overly cautious';
      workStyle = 'Prefers structured, predictable work environments';
    } else if (!isHighAssertive && isHighExpressive) {
      type = 'Supporter';
      primary = 'Cooperative and steady';
      secondary = 'Team-oriented and patient';
      strength = 'Building consensus and maintaining harmony';
      challenge = 'May avoid conflict or difficult conversations';
      workStyle = 'Excels in stable, supportive team environments';
    } else {
      type = 'Balanced';
      primary = 'Adaptable communication style';
      secondary = 'Flexible approach based on situation';
      strength = 'Versatility across different communication contexts';
      challenge = 'May lack distinctive communication identity';
      workStyle = 'Adapts well to various work environments';
    }
    
    return { type, primary, secondary, strength, challenge, workStyle };
  };

  const analyzeDistortion = (
    answers: Record<string, any>,
    responseTimings: Record<string, number>,
    totalTime: number
  ): DistortionAnalysis => {
    const indicators: string[] = [];
    let distortionScore = 0;
    
    // Check for response time patterns
    const avgResponseTime = totalTime / Object.keys(answers).length;
    const extremelyFastResponses = Object.values(responseTimings).filter(time => time < 2000).length;
    const extremelySlowResponses = Object.values(responseTimings).filter(time => time > 60000).length;
    
    if (extremelyFastResponses > 10) {
      distortionScore += 20;
      indicators.push('Unusually fast response times may indicate rushed or careless responses');
    }
    
    if (extremelySlowResponses > 5) {
      distortionScore += 10;
      indicators.push('Some very long response times may indicate overthinking or distraction');
    }
    
    // Check for response patterns
    const responses = Object.values(answers);
    const responsePattern = analyzeResponseConsistency(responses);
    
    if (responsePattern.includes('extreme')) {
      distortionScore += 15;
      indicators.push('Extreme response patterns may indicate social desirability bias');
    }
    
    // Check for contradictory responses
    const contradictions = findContradictions(answers);
    if (contradictions > 3) {
      distortionScore += 25;
      indicators.push('Contradictory responses across similar questions detected');
    }
    
    // Check written responses for authenticity
    const writtenResponses = Object.entries(answers).filter(([key, value]) => 
      typeof value === 'string' && value.length > 10
    );
    
    let genericResponses = 0;
    writtenResponses.forEach(([key, response]) => {
      if (isGenericResponse(response)) {
        genericResponses++;
      }
    });
    
    if (genericResponses > writtenResponses.length * 0.4) {
      distortionScore += 20;
      indicators.push('High frequency of generic or templated responses');
    }
    
    // Determine distortion level and reliability
    let level: DistortionAnalysis['level'];
    let reliability: DistortionAnalysis['reliability'];
    const recommendations: string[] = [];
    
    if (distortionScore < 20) {
      level = 'Low';
      reliability = 'High';
      recommendations.push('Results appear authentic and reliable');
    } else if (distortionScore < 40) {
      level = 'Moderate';
      reliability = 'Moderate';
      recommendations.push('Results are generally reliable with minor concerns');
      recommendations.push('Consider follow-up interview for clarification');
    } else if (distortionScore < 70) {
      level = 'High';
      reliability = 'Low';
      recommendations.push('Results may be significantly influenced by response bias');
      recommendations.push('Recommend behavioral interview and reference checks');
      recommendations.push('Consider re-administration under different conditions');
    } else {
      level = 'Very High';
      reliability = 'Questionable';
      recommendations.push('Results are highly questionable and not recommended for decision-making');
      recommendations.push('Require comprehensive behavioral assessment');
      recommendations.push('Consider alternative assessment methods');
    }
    
    return {
      score: distortionScore,
      level,
      indicators,
      reliability,
      recommendations,
      consistencyCheck: 100, // Will be calculated by enhanced analysis
      extremePatterns: 85,
      socialDesirabilityBias: 90,
      responseTimePattern: 95
    };
  };

  const calculateContextualEffectiveness = (
    dimensions: Record<string, CommunicationDimension>,
    answers: Record<string, any>
  ) => {
    const { assertiveness, expressiveness, informationProcessing, listeningPatterns, influenceStrategies, conflictCommunication } = dimensions;
    
    return {
      leadership: Math.round((assertiveness.score * 0.3 + influenceStrategies.score * 0.3 + conflictCommunication.score * 0.2 + expressiveness.score * 0.2) * 100) / 100,
      teamwork: Math.round((listeningPatterns.score * 0.3 + expressiveness.score * 0.25 + conflictCommunication.score * 0.25 + assertiveness.score * 0.2) * 100) / 100,
      customerService: Math.round((listeningPatterns.score * 0.35 + expressiveness.score * 0.25 + conflictCommunication.score * 0.25 + assertiveness.score * 0.15) * 100) / 100,
      salesNegotiation: Math.round((influenceStrategies.score * 0.35 + assertiveness.score * 0.25 + expressiveness.score * 0.25 + informationProcessing.score * 0.15) * 100) / 100,
      conflictResolution: Math.round((conflictCommunication.score * 0.4 + listeningPatterns.score * 0.3 + assertiveness.score * 0.2 + informationProcessing.score * 0.1) * 100) / 100,
      publicSpeaking: Math.round((expressiveness.score * 0.35 + assertiveness.score * 0.25 + informationProcessing.score * 0.25 + influenceStrategies.score * 0.15) * 100) / 100
    };
  };

  const identifyDevelopmentAreas = (
    dimensions: Record<string, CommunicationDimension>,
    profile: CommunicationProfile
  ) => {
    const developmentAreas: { priority: string; description: string; actionItems: string[] }[] = [];
    
    // Find lowest scoring dimensions
    const sortedDimensions = Object.entries(dimensions).sort(([,a], [,b]) => a.score - b.score);
    
    sortedDimensions.slice(0, 3).forEach(([key, dimension], index) => {
      const priority = index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low';
      const developmentArea = createDevelopmentArea(key, dimension, priority, profile);
      developmentAreas.push(developmentArea);
    });
    
    return developmentAreas;
  };

  // Helper functions
  const createEmptyDimension = (): CommunicationDimension => ({
    score: 0,
    level: 'Low',
    percentile: 0,
    description: 'Insufficient data to calculate score'
  });

  const getScoreLevel = (score: number): CommunicationDimension['level'] => {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  const calculatePercentile = (score: number, dimension: string): number => {
    // Simulate percentile calculation based on normative data
    const normalizedScore = Math.max(0, Math.min(100, score));
    return Math.round(normalizedScore * 0.85 + 10); // Adjust for realistic percentile distribution
  };

  const getDimensionDescription = (dimension: string, score: number): string => {
    const level = getScoreLevel(score);
    const descriptions = {
      'assertiveness': {
        'Low': 'Prefers indirect communication and may hesitate to express strong opinions',
        'Moderate': 'Balances directness with diplomacy in most situations',
        'High': 'Communicates directly and confidently expresses viewpoints',
        'Very High': 'Very direct and forceful in communication style'
      },
      'expressiveness': {
        'Low': 'Reserved communication style with controlled emotional expression',
        'Moderate': 'Moderate expressiveness with situational emotional sharing',
        'High': 'Expressive and animated communication with emotional openness',
        'Very High': 'Highly expressive with strong emotional communication'
      },
      'information-processing': {
        'Low': 'Prefers quick decisions with limited information processing',
        'Moderate': 'Balances speed and thoroughness in information processing',
        'High': 'Systematic and thorough approach to information processing',
        'Very High': 'Extremely detailed and comprehensive information processing'
      },
      'channel-preferences': {
        'Low': 'Limited comfort with various communication channels',
        'Moderate': 'Comfortable with most common communication channels',
        'High': 'Adaptable across multiple communication channels',
        'Very High': 'Highly versatile across all communication channels'
      },
      'listening-patterns': {
        'Low': 'May struggle with active listening and empathetic responses',
        'Moderate': 'Generally good listening skills with room for improvement',
        'High': 'Strong active listening skills with empathetic responses',
        'Very High': 'Exceptional listening skills with deep empathetic understanding'
      },
      'influence-strategies': {
        'Low': 'Limited use of influence strategies in communication',
        'Moderate': 'Uses basic influence strategies effectively',
        'High': 'Skilled at using various influence strategies',
        'Very High': 'Highly sophisticated influence and persuasion abilities'
      },
      'conflict-communication': {
        'Low': 'May avoid conflict or handle it ineffectively',
        'Moderate': 'Handles routine conflicts reasonably well',
        'High': 'Skilled at managing and resolving conflicts',
        'Very High': 'Exceptional conflict resolution and mediation skills'
      }
    };
    
    return descriptions[dimension as keyof typeof descriptions]?.[level] || 'Score calculated';
  };

  // Enhanced distortion detection and validity analysis
  const calculateDistortionAnalysis = (responses: any[]): DistortionAnalysis => {
    AssessmentLogger.log('Calculating enhanced distortion analysis for Communication Styles');
    
    // Convert responses to standard format for validation
    const formattedResponses = responses.map((r, index) => ({
      id: `comm_${index}`,
      questionId: `communication_q_${index}`,
      selectedOption: String(r.selectedOption || r),
      timestamp: r.timestamp || Date.now(),
      responseTime: r.responseTime
    }));

    // Use comprehensive validation system
    const validationResult = validateResponseConsistency(formattedResponses);
    
    // Communication-specific patterns
    const extremePatterns = analyzeExtremeResponsePatterns(responses);
    const socialDesirability = analyzeSocialDesirabilityBias(responses);
    const timePatterns = analyzeResponseTimePatterns(responses);
    
    // Calculate overall distortion score (0-100, higher = more reliable)
    const distortionScore = Math.min(100, Math.max(0,
      validationResult.score * 0.35 +
      extremePatterns * 0.25 +
      socialDesirability * 0.25 +
      timePatterns * 0.15
    ));
    
    // Determine reliability level
    const reliability = distortionScore >= 85 ? 'High' :
                       distortionScore >= 70 ? 'Moderate' :
                       distortionScore >= 50 ? 'Low' : 'Questionable';
    
    // Generate indicators and recommendations
    const indicators = [...validationResult.flags];
    const recommendations = generateValidityRecommendations(distortionScore, indicators);
    
    return {
      score: distortionScore,
      level: distortionScore >= 75 ? 'Low' : 
             distortionScore >= 50 ? 'Moderate' : 
             distortionScore >= 25 ? 'High' : 'Very High',
      indicators,
      reliability,
      recommendations,
      consistencyCheck: validationResult.score,
      extremePatterns: extremePatterns,
      socialDesirabilityBias: socialDesirability,
      responseTimePattern: timePatterns
    };
  };

  const analyzeExtremeResponsePatterns = (responses: any[]): number => {
    const numericResponses = responses.map(r => parseInt(String(r.selectedOption || r)) || 3);
    const total = numericResponses.length;
    
    if (total === 0) return 100;
    
    // Count extreme responses (1-2 or 4-5 on typical 1-5 scale)
    const extremeHigh = numericResponses.filter(r => r >= 4).length;
    const extremeLow = numericResponses.filter(r => r <= 2).length;
    const extremeTotal = extremeHigh + extremeLow;
    
    // Healthy assessments typically have 30-70% extreme responses
    const extremePercentage = extremeTotal / total;
    
    if (extremePercentage > 0.9) return 20; // Too extreme
    if (extremePercentage > 0.8) return 40;
    if (extremePercentage < 0.1) return 30; // Too neutral
    if (extremePercentage < 0.2) return 60;
    
    return 100; // Healthy pattern
  };

  const analyzeSocialDesirabilityBias = (responses: any[]): number => {
    // Communication assessments often show social desirability in leadership/confidence questions
    const responseValues = responses.map(r => parseInt(String(r.selectedOption || r)) || 3);
    
    // Check for consistently high scores (potential faking good)
    const highScores = responseValues.filter(r => r >= 4).length;
    const highPercentage = highScores / responseValues.length;
    
    // Check for absence of any low scores (unrealistic)
    const lowScores = responseValues.filter(r => r <= 2).length;
    const hasLowScores = lowScores > 0;
    
    let score = 100;
    
    if (highPercentage > 0.8) score -= 40; // Too many high scores
    if (!hasLowScores && responseValues.length > 20) score -= 20; // No weaknesses admitted
    if (highPercentage > 0.9) score -= 30; // Extremely unrealistic
    
    return Math.max(0, score);
  };

  const analyzeResponseTimePatterns = (responses: any[]): number => {
    const responseTimes = responses
      .map(r => r.responseTime)
      .filter(t => t && t > 0);
    
    if (responseTimes.length < 5) return 100; // Not enough data
    
    const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const veryFast = responseTimes.filter(t => t < 1500).length; // Less than 1.5 seconds
    const verySlow = responseTimes.filter(t => t > 120000).length; // More than 2 minutes
    
    let score = 100;
    
    // Penalize too many very fast responses (may indicate careless responding)
    if (veryFast > responseTimes.length * 0.5) score -= 30;
    if (veryFast > responseTimes.length * 0.7) score -= 20;
    
    // Penalize excessive slow responses (may indicate distraction)
    if (verySlow > responseTimes.length * 0.2) score -= 20;
    
    return Math.max(0, score);
  };

  const generateValidityRecommendations = (score: number, indicators: string[]): string[] => {
    const recommendations: string[] = [];
    
    if (score < 70) {
      recommendations.push('Consider re-administering the assessment under controlled conditions');
      recommendations.push('Provide clear instructions about honest responding');
    }
    
    if (indicators.some(i => i.includes('rapid'))) {
      recommendations.push('Encourage taking more time to consider each response');
    }
    
    if (indicators.some(i => i.includes('extreme'))) {
      recommendations.push('Review instructions to ensure understanding of rating scale');
    }
    
    if (score >= 85) {
      recommendations.push('Assessment results appear highly reliable and valid');
    }
    
    return recommendations;
  };

  const analyzeResponseConsistency = (responses: any[]): string => {
    // Analyze for patterns like always choosing first option, etc.
    const stringResponses = responses.filter(r => typeof r === 'string');
    if (stringResponses.length < 5) return 'normal';
    
    const firstOptionCount = stringResponses.filter(r => r === '0').length;
    const lastOptionCount = stringResponses.filter(r => r === '3').length;
    
    if (firstOptionCount > stringResponses.length * 0.7) return 'extreme-first';
    if (lastOptionCount > stringResponses.length * 0.7) return 'extreme-last';
    
    return 'normal';
  };

  const findContradictions = (answers: Record<string, any>): number => {
    // Simple contradiction detection logic
    let contradictions = 0;
    
    // Check for contradictory assertiveness patterns
    const assertiveQuestions = communicationStylesQuestions.filter(q => q.dimension === 'assertiveness');
    const assertiveAnswers = assertiveQuestions.map(q => answers[q.id]).filter(a => a !== undefined);
    
    if (assertiveAnswers.length > 5) {
      const highAssertive = assertiveAnswers.filter(a => parseInt(a) > 1).length;
      const lowAssertive = assertiveAnswers.filter(a => parseInt(a) <= 1).length;
      
      if (Math.abs(highAssertive - lowAssertive) < assertiveAnswers.length * 0.2) {
        contradictions++;
      }
    }
    
    return contradictions;
  };

  const isGenericResponse = (response: string): boolean => {
    const genericPhrases = [
      'i would',
      'i will',
      'i think',
      'in my opinion',
      'it depends',
      'i believe',
      'i feel',
      'i suppose'
    ];
    
    const lowerResponse = response.toLowerCase();
    const genericCount = genericPhrases.filter(phrase => lowerResponse.includes(phrase)).length;
    
    return genericCount > 2 || response.split(' ').length < 15;
  };

  const analyzeResponsePattern = (
    answers: Record<string, any>,
    responseTimings: Record<string, number>
  ): string => {
    const avgTime = Object.values(responseTimings).reduce((sum, time) => sum + time, 0) / Object.keys(responseTimings).length;
    
    if (avgTime < 5000) return 'fast-paced';
    if (avgTime > 30000) return 'deliberate';
    return 'moderate';
  };

  const createDevelopmentArea = (
    dimension: string,
    dimensionData: CommunicationDimension,
    priority: string,
    profile: CommunicationProfile
  ) => {
    const developmentTemplates = {
      'assertiveness': {
        description: 'Developing stronger assertiveness skills for clear, confident communication',
        actionItems: [
          'Practice stating opinions directly and confidently',
          'Role-play difficult conversations with colleagues',
          'Set clear boundaries and expectations in team settings',
          'Use "I" statements to express needs and concerns'
        ]
      },
      'expressiveness': {
        description: 'Enhancing expressiveness to build stronger interpersonal connections',
        actionItems: [
          'Practice varying vocal tone and pace in presentations',
          'Share appropriate personal experiences to build rapport',
          'Use storytelling to make messages more engaging',
          'Develop comfort with emotional expression in professional settings'
        ]
      },
      'information-processing': {
        description: 'Improving information processing for better decision-making',
        actionItems: [
          'Practice active listening techniques in meetings',
          'Develop structured approaches to complex problem-solving',
          'Ask clarifying questions before making decisions',
          'Create mental models for organizing complex information'
        ]
      },
      'channel-preferences': {
        description: 'Expanding communication channel versatility for broader effectiveness',
        actionItems: [
          'Practice video conferencing and virtual presentation skills',
          'Develop written communication templates for different purposes',
          'Experiment with different communication tools and platforms',
          'Adapt communication style to match channel characteristics'
        ]
      },
      'listening-patterns': {
        description: 'Strengthening listening skills for better understanding and empathy',
        actionItems: [
          'Practice paraphrasing and reflecting back what others say',
          'Focus on understanding before being understood',
          'Ask open-ended questions to encourage deeper sharing',
          'Minimize interruptions and give others full attention'
        ]
      },
      'influence-strategies': {
        description: 'Developing more sophisticated influence and persuasion abilities',
        actionItems: [
          'Learn and practice different influence techniques',
          'Study audience needs and motivations before presenting',
          'Develop compelling narratives to support key messages',
          'Practice building coalitions and gaining buy-in'
        ]
      },
      'conflict-communication': {
        description: 'Building skills for effective conflict resolution and difficult conversations',
        actionItems: [
          'Learn structured approaches to conflict resolution',
          'Practice staying calm and objective during disagreements',
          'Develop skills for finding win-win solutions',
          'Practice mediating between different perspectives'
        ]
      }
    };
    
    const template = developmentTemplates[dimension as keyof typeof developmentTemplates];
    return {
      priority,
      description: template?.description || 'Development area identified',
      actionItems: template?.actionItems || ['Practice and develop this communication skill']
    };
  };

  return {
    results,
    isProcessing,
    calculateResults
  };
};