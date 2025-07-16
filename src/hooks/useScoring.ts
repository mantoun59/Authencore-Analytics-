import { useState, useCallback } from 'react';

export interface DimensionScore {
  score: number;
  weight: number;
  level: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Expert';
}

export interface AssessmentResults {
  overallScore: number;
  dimensions: {
    career_clarity: DimensionScore;
    skill_readiness: DimensionScore;
    workplace_maturity: DimensionScore;
    adaptability: DimensionScore;
    growth_mindset: DimensionScore;
    leadership_potential: DimensionScore;
    communication_skills: DimensionScore;
    problem_solving: DimensionScore;
  };
  validityMetrics: {
    responseTime: number;
    consistencyScore: number;
    engagementLevel: 'Low' | 'Medium' | 'High';
    validityStatus: 'Valid' | 'Questionable' | 'Invalid';
  };
  careerReadiness: {
    level: 'Not Ready' | 'Developing' | 'Ready' | 'Highly Ready';
    percentile: number;
    strengths: string[];
    developmentAreas: string[];
  };
}

export const useScoring = () => {
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const calculateDimensionLevel = (score: number): DimensionScore['level'] => {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Developing';
    return 'Novice';
  };

  const analyzeCareerInterests = useCallback((swipes: any[]) => {
    const categoryScores: Record<string, { liked: number; total: number }> = {};
    
    swipes.forEach(swipe => {
      if (!categoryScores[swipe.category]) {
        categoryScores[swipe.category] = { liked: 0, total: 0 };
      }
      categoryScores[swipe.category].total++;
      if (swipe.action === 'like') {
        categoryScores[swipe.category].liked++;
      }
    });

    // Calculate clarity score based on consistency within categories
    const clarityScores = Object.values(categoryScores).map(cat => {
      const ratio = cat.liked / cat.total;
      // Higher clarity for more decisive choices (closer to 0 or 1)
      return Math.abs(ratio - 0.5) * 2;
    });

    const clarityScore = clarityScores.length > 0 
      ? Math.max(...clarityScores) * 100 
      : 50;

    return {
      score: Math.min(Math.max(clarityScore, 0), 100),
      topCategories: Object.entries(categoryScores)
        .sort(([,a], [,b]) => b.liked / b.total - a.liked / a.total)
        .slice(0, 3)
        .map(([category]) => category)
    };
  }, []);

  const analyzeSkillsChallenges = useCallback((challenges: any[]) => {
    let totalScore = 0;
    const challengeScores: Record<string, number> = {};

    challenges.forEach(challenge => {
      let score = 0;

      switch (challenge.type) {
        case 'problem_solving':
          score = analyzeProblemSolving(challenge);
          break;
        case 'creative_thinking':
          score = analyzeCreativeThinking(challenge);
          break;
        case 'communication':
          score = analyzeCommunication(challenge);
          break;
        case 'analytical':
          score = analyzeAnalytical(challenge);
          break;
        default:
          score = 50;
      }

      challengeScores[challenge.type] = score;
      totalScore += score;
    });

    return {
      overallScore: challenges.length > 0 ? totalScore / challenges.length : 50,
      individualScores: challengeScores
    };
  }, []);

  const analyzeProblemSolving = (challenge: any): number => {
    if (!challenge.allocation) return 30;
    
    const allocations = challenge.allocation;
    const departments = challenge.departments || [];
    let score = 0;
    let totalAllocated = 0;

    departments.forEach((dept: any) => {
      const allocated = allocations[dept.name] || 0;
      totalAllocated += allocated;
      
      if (allocated >= dept.optimalRange[0] && allocated <= dept.optimalRange[1]) {
        score += 20; // Perfect allocation
      } else {
        const deviation = Math.min(
          Math.abs(allocated - dept.optimalRange[0]),
          Math.abs(allocated - dept.optimalRange[1])
        );
        score += Math.max(0, 20 - (deviation / 1000));
      }
    });

    // Penalty for over/under allocation
    const targetTotal = 100000;
    if (totalAllocated !== targetTotal) {
      score -= Math.abs(totalAllocated - targetTotal) / 1000;
    }

    return Math.max(0, Math.min(100, score));
  };

  const analyzeCreativeThinking = (challenge: any): number => {
    if (!challenge.ideas || !Array.isArray(challenge.ideas)) return 30;
    
    const ideas = challenge.ideas.filter((idea: string) => idea.trim().length > 0);
    const fluencyScore = Math.min(ideas.length / 10 * 100, 100);
    
    // Analyze originality
    const commonUses = ['hold papers', 'pick lock', 'clean ears', 'reset device', 'bookmark'];
    const originalIdeas = ideas.filter((idea: string) => 
      !commonUses.some(common => idea.toLowerCase().includes(common.toLowerCase()))
    );
    const originalityScore = ideas.length > 0 ? (originalIdeas.length / ideas.length) * 100 : 0;
    
    // Check elaboration (detailed descriptions)
    const elaboratedIdeas = ideas.filter((idea: string) => idea.split(' ').length >= 4);
    const elaborationScore = ideas.length > 0 ? (elaboratedIdeas.length / ideas.length) * 100 : 0;

    return (fluencyScore * 0.4 + originalityScore * 0.4 + elaborationScore * 0.2);
  };

  const analyzeCommunication = (challenge: any): number => {
    if (!challenge.rewrittenText) return 30;
    
    const text = challenge.rewrittenText.toLowerCase();
    let score = 0;

    // Check for positive keywords
    const positiveKeywords = ['apologize', 'understand', 'resolve', 'appreciate', 'concern'];
    const foundPositive = positiveKeywords.filter(keyword => text.includes(keyword));
    score += (foundPositive.length / positiveKeywords.length) * 40;

    // Check for professional tone (avoid negative words)
    const negativeWords = ['absolutely', 'never', 'worst', 'unacceptable', 'terrible'];
    const foundNegative = negativeWords.filter(word => text.includes(word));
    score += Math.max(0, 30 - (foundNegative.length * 10));

    // Check for structure and solution-orientation
    if (text.includes('timeline') || text.includes('next steps')) score += 15;
    if (text.includes('follow') || text.includes('update')) score += 15;

    return Math.min(100, score);
  };

  const analyzeAnalytical = (challenge: any): number => {
    if (!challenge.insights || !Array.isArray(challenge.insights)) return 30;
    
    const insights = challenge.insights;
    let score = 0;

    // Check for key analytical insights
    const expectedInsights = ['trend', 'growth', 'regional', 'seasonal', 'recommendation'];
    expectedInsights.forEach(insight => {
      if (insights.some((i: string) => i.toLowerCase().includes(insight))) {
        score += 20;
      }
    });

    return Math.min(100, score);
  };

  const analyzeWorkScenarios = useCallback((scenarios: any[]) => {
    const dimensionScores: Record<string, number[]> = {};

    scenarios.forEach(scenario => {
      const choice = scenario.userChoice;
      const option = scenario.options?.find((opt: any) => opt.id === choice);
      
      if (option && option.scores) {
        Object.entries(option.scores).forEach(([dimension, score]) => {
          if (!dimensionScores[dimension]) dimensionScores[dimension] = [];
          dimensionScores[dimension].push(score as number);
        });
      }
    });

    // Calculate average scores for each dimension
    const avgScores: Record<string, number> = {};
    Object.entries(dimensionScores).forEach(([dimension, scores]) => {
      const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      // Normalize from -3 to 5 scale to 0-100 scale
      avgScores[dimension] = Math.max(0, Math.min(100, ((avg + 3) / 8) * 100));
    });

    return avgScores;
  }, []);

  const analyzeRapidFire = useCallback((responses: any[]) => {
    const dimensionCounts: Record<string, { A: number; B: number }> = {};
    
    responses.forEach(response => {
      if (!dimensionCounts[response.dimension]) {
        dimensionCounts[response.dimension] = { A: 0, B: 0 };
      }
      dimensionCounts[response.dimension][response.choice]++;
    });

    // Calculate consistency score (how decisive the choices are)
    const consistencyScores = Object.values(dimensionCounts).map(counts => {
      const total = counts.A + counts.B;
      if (total === 0) return 0;
      const ratio = Math.max(counts.A, counts.B) / total;
      return ratio; // Higher ratio = more consistent
    });

    const avgConsistency = consistencyScores.length > 0 
      ? consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length 
      : 0.5;

    return {
      consistencyScore: avgConsistency * 100,
      dimensionPreferences: dimensionCounts
    };
  }, []);

  const calculateValidityMetrics = useCallback((assessmentData: any, timer: number) => {
    let validityFlags = 0;
    
    // Check response time
    const avgResponseTime = timer / (assessmentData.careerSwipes.length + 
      assessmentData.workScenarios.length + assessmentData.rapidFire.length);
    
    if (avgResponseTime < 2) validityFlags += 2; // Too fast
    if (avgResponseTime > 60) validityFlags += 1; // Too slow
    
    // Check for straight-lining in rapid fire
    const rapidFire = assessmentData.rapidFire || [];
    if (rapidFire.length > 0) {
      const allA = rapidFire.filter((r: any) => r.choice === 'A').length;
      const allB = rapidFire.filter((r: any) => r.choice === 'B').length;
      
      if (allA === rapidFire.length || allB === rapidFire.length) {
        validityFlags += 3; // Straight-lining detected
      }
    }

    // Determine validity status
    let validityStatus: 'Valid' | 'Questionable' | 'Invalid';
    if (validityFlags >= 4) validityStatus = 'Invalid';
    else if (validityFlags >= 2) validityStatus = 'Questionable';
    else validityStatus = 'Valid';

    // Calculate engagement level
    const engagementScore = 100 - (validityFlags * 15);
    let engagementLevel: 'Low' | 'Medium' | 'High';
    if (engagementScore >= 80) engagementLevel = 'High';
    else if (engagementScore >= 60) engagementLevel = 'Medium';
    else engagementLevel = 'Low';

    return {
      responseTime: avgResponseTime,
      consistencyScore: Math.max(0, 100 - (validityFlags * 20)),
      engagementLevel,
      validityStatus
    };
  }, []);

  const calculateFinalResults = useCallback((assessmentData: any, gameState: any, timer: number) => {
    // Analyze each section
    const careerAnalysis = analyzeCareerInterests(assessmentData.careerSwipes || []);
    const skillsAnalysis = analyzeSkillsChallenges(assessmentData.skillsChallenges || []);
    const scenarioScores = analyzeWorkScenarios(assessmentData.workScenarios || []);
    const rapidFireAnalysis = analyzeRapidFire(assessmentData.rapidFire || []);
    const validityMetrics = calculateValidityMetrics(assessmentData, timer);

    // Calculate dimension scores
    const dimensions = {
      career_clarity: {
        score: careerAnalysis.score,
        weight: 0.15,
        level: calculateDimensionLevel(careerAnalysis.score)
      },
      skill_readiness: {
        score: skillsAnalysis.overallScore,
        weight: 0.25,
        level: calculateDimensionLevel(skillsAnalysis.overallScore)
      },
      workplace_maturity: {
        score: scenarioScores.adaptability || 50,
        weight: 0.20,
        level: calculateDimensionLevel(scenarioScores.adaptability || 50)
      },
      adaptability: {
        score: (scenarioScores.adaptability || 50 + scenarioScores.change_management || 50) / 2,
        weight: 0.10,
        level: calculateDimensionLevel((scenarioScores.adaptability || 50 + scenarioScores.change_management || 50) / 2)
      },
      growth_mindset: {
        score: scenarioScores.growth_mindset || 50,
        weight: 0.10,
        level: calculateDimensionLevel(scenarioScores.growth_mindset || 50)
      },
      leadership_potential: {
        score: scenarioScores.leadership || 50,
        weight: 0.10,
        level: calculateDimensionLevel(scenarioScores.leadership || 50)
      },
      communication_skills: {
        score: (scenarioScores.communication || 50 + skillsAnalysis.individualScores.communication || 50) / 2,
        weight: 0.05,
        level: calculateDimensionLevel((scenarioScores.communication || 50 + skillsAnalysis.individualScores.communication || 50) / 2)
      },
      problem_solving: {
        score: skillsAnalysis.individualScores.problem_solving || 50,
        weight: 0.05,
        level: calculateDimensionLevel(skillsAnalysis.individualScores.problem_solving || 50)
      }
    };

    // Calculate overall score
    const overallScore = Object.values(dimensions).reduce((sum, dim) => 
      sum + (dim.score * dim.weight), 0
    );

    // Determine readiness level
    let readinessLevel: 'Not Ready' | 'Developing' | 'Ready' | 'Highly Ready';
    let percentile: number;

    if (overallScore >= 85) {
      readinessLevel = 'Highly Ready';
      percentile = 90 + (overallScore - 85) / 15 * 10;
    } else if (overallScore >= 70) {
      readinessLevel = 'Ready';
      percentile = 70 + (overallScore - 70) / 15 * 20;
    } else if (overallScore >= 50) {
      readinessLevel = 'Developing';
      percentile = 30 + (overallScore - 50) / 20 * 40;
    } else {
      readinessLevel = 'Not Ready';
      percentile = (overallScore / 50) * 30;
    }

    // Identify strengths and development areas
    const sortedDimensions = Object.entries(dimensions)
      .sort(([,a], [,b]) => b.score - a.score);
    
    const strengths = sortedDimensions
      .slice(0, 3)
      .filter(([,dim]) => dim.score >= 70)
      .map(([name]) => name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    const developmentAreas = sortedDimensions
      .slice(-3)
      .filter(([,dim]) => dim.score < 70)
      .map(([name]) => name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    const results: AssessmentResults = {
      overallScore,
      dimensions,
      validityMetrics,
      careerReadiness: {
        level: readinessLevel,
        percentile: Math.round(percentile),
        strengths,
        developmentAreas
      }
    };

    setResults(results);
    return results;
  }, [analyzeCareerInterests, analyzeSkillsChallenges, analyzeWorkScenarios, analyzeRapidFire, calculateValidityMetrics]);

  return {
    results,
    calculateFinalResults
  };
};