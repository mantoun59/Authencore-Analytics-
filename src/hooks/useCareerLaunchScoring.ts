import { useState, useCallback } from 'react';
import { careerDatabase } from '@/data/careerLaunchQuestions';

interface Dimensions {
  career_clarity: { score: number; weight: number };
  skill_readiness: { score: number; weight: number };
  workplace_maturity: { score: number; weight: number };
  adaptability: { score: number; weight: number };
  growth_mindset: { score: number; weight: number };
}

interface CareerMatch {
  title: string;
  match: number;
  growth: string;
  salary: string;
  readiness: number;
  category: string;
}

interface UserProfile {
  name: string;
  email: string;
  age: number;
  education_level: string;
  field_of_study: string;
  avatar: string;
}

export const useCareerLaunchScoring = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    career_clarity: { score: 0, weight: 0.20 },
    skill_readiness: { score: 0, weight: 0.25 },
    workplace_maturity: { score: 0, weight: 0.20 },
    adaptability: { score: 0, weight: 0.15 },
    growth_mindset: { score: 0, weight: 0.20 }
  });
  
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [topCareerCategories, setTopCareerCategories] = useState<string[]>([]);
  const [distortionScore, setDistortionScore] = useState(0);
  const [validityStatus, setValidityStatus] = useState<'valid' | 'questionable' | 'invalid'>('valid');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const processCareerSwipes = useCallback((swipes: Array<{action: string; category: string; id: string}>) => {
    const interests: Record<string, {liked: number; total: number}> = {};
    
    swipes.forEach(swipe => {
      const category = swipe.category;
      if (!interests[category]) interests[category] = { liked: 0, total: 0 };
      interests[category].total++;
      if (swipe.action === 'like') interests[category].liked++;
    });
    
    // Calculate career clarity from consistency
    const consistencyScores = Object.values(interests).map(cat => 
      Math.abs((cat.liked / cat.total) - 0.5) * 2
    );
    
    const clarityScore = Math.min(Math.max(...consistencyScores) * 100, 100);
    
    setDimensions(prev => ({
      ...prev,
      career_clarity: { ...prev.career_clarity, score: clarityScore }
    }));
    
    // Store top career categories
    const topCategories = Object.entries(interests)
      .sort((a, b) => b[1].liked - a[1].liked)
      .slice(0, 3)
      .map(([category]) => category);
    
    setTopCareerCategories(topCategories);
  }, []);

  const processSkillsChallenges = useCallback((challenges: Array<{type: string; score: number}>) => {
    const totalScore = challenges.reduce((sum, challenge) => sum + challenge.score, 0);
    const avgScore = totalScore / challenges.length;
    
    setDimensions(prev => ({
      ...prev,
      skill_readiness: { ...prev.skill_readiness, score: avgScore * 100 }
    }));
  }, []);

  const processWorkScenarios = useCallback((scenarios: Array<{scores: Record<string, number>}>) => {
    const dimensionScores: Record<string, number[]> = {
      adaptability: [],
      communication: [],
      emotional_intelligence: [],
      leadership: [],
      self_management: []
    };
    
    scenarios.forEach(scenario => {
      Object.entries(scenario.scores).forEach(([dimension, score]) => {
        if (dimensionScores[dimension]) {
          dimensionScores[dimension].push(score);
        }
      });
    });
    
    // Calculate workplace maturity from scenario performance
    let totalMaturity = 0;
    let validDimensions = 0;
    
    Object.entries(dimensionScores).forEach(([dimension, scores]) => {
      if (scores.length > 0) {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        totalMaturity += (avgScore + 4) / 8 * 100; // Normalize from -4 to 4 scale to 0-100
        validDimensions++;
      }
    });
    
    const maturityScore = validDimensions > 0 ? totalMaturity / validDimensions : 0;
    
    setDimensions(prev => ({
      ...prev,
      workplace_maturity: { ...prev.workplace_maturity, score: maturityScore }
    }));
    
    // Set adaptability specifically
    if (dimensionScores.adaptability.length > 0) {
      const adaptabilityScore = dimensionScores.adaptability.reduce((a, b) => a + b, 0) / dimensionScores.adaptability.length;
      setDimensions(prev => ({
        ...prev,
        adaptability: { ...prev.adaptability, score: ((adaptabilityScore + 4) / 8) * 100 }
      }));
    }
  }, []);

  const processFutureQuest = useCallback((timeline: Array<{year: number; milestone: any}>) => {
    const pathCoherence = analyzePathCoherence(timeline);
    const ambitionLevel = analyzeAmbitionLevel(timeline);
    const realismScore = analyzeRealism(timeline);
    
    const growthScore = (pathCoherence * 0.4 + ambitionLevel * 0.3 + realismScore * 0.3) * 100;
    
    setDimensions(prev => ({
      ...prev,
      growth_mindset: { ...prev.growth_mindset, score: growthScore }
    }));
  }, []);

  const analyzePathCoherence = (timeline: Array<{year: number; milestone: any}>) => {
    if (timeline.length < 2) return 0.5;
    
    let coherenceScore = 1.0;
    
    for (let i = 1; i < timeline.length; i++) {
      const current = timeline[i];
      const previous = timeline[i-1];
      
      // Check if current builds on previous
      if (!checkProgression(previous.milestone, current.milestone)) {
        coherenceScore -= 0.2;
      }
    }
    
    return Math.max(coherenceScore, 0);
  };

  const analyzeAmbitionLevel = (timeline: Array<{year: number; milestone: any}>) => {
    const ambitiousMilestones = timeline.filter(t => 
      t.milestone.type === 'position' && 
      (t.milestone.title.includes('Leadership') || t.milestone.title.includes('Executive') || t.milestone.title.includes('Business'))
    );
    
    return Math.min(ambitiousMilestones.length / 2, 1);
  };

  const analyzeRealism = (timeline: Array<{year: number; milestone: any}>) => {
    // Check if milestones are placed in realistic timeframes
    let realismScore = 1.0;
    
    timeline.forEach(item => {
      if (item.milestone.type === 'position' && item.milestone.title.includes('Executive') && item.year < 5) {
        realismScore -= 0.3;
      }
      if (item.milestone.type === 'education' && item.milestone.title.includes('Advanced') && item.year < 2) {
        realismScore -= 0.2;
      }
    });
    
    return Math.max(realismScore, 0);
  };

  const checkProgression = (previous: any, current: any) => {
    // Simple progression logic
    if (previous.type === 'education' && current.type === 'position') return true;
    if (previous.type === 'experience' && current.type === 'position') return true;
    if (previous.type === 'skill' && current.type === 'position') return true;
    return Math.random() > 0.3; // Default to likely progression
  };

  const calculateDistortionScore = useCallback((responses: Array<{type: string; responseTime: number; choice?: string}>) => {
    let distortionIndicators = 0;
    
    // Check response time patterns
    const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length;
    if (avgResponseTime < 2000) {
      distortionIndicators += 1;
    }
    
    // Check for straight-lining in rapid fire
    const rapidFireResponses = responses.filter(r => r.type === 'rapid_fire');
    if (rapidFireResponses.length > 0) {
      const allA = rapidFireResponses.filter(r => r.choice === 'A').length;
      const allB = rapidFireResponses.filter(r => r.choice === 'B').length;
      
      if (allA === rapidFireResponses.length || allB === rapidFireResponses.length) {
        distortionIndicators += 3;
      }
    }
    
    // Set validity status
    let validity: 'valid' | 'questionable' | 'invalid' = 'valid';
    if (distortionIndicators >= 4) {
      validity = 'invalid';
    } else if (distortionIndicators >= 2) {
      validity = 'questionable';
    }
    
    setDistortionScore(distortionIndicators);
    setValidityStatus(validity);
  }, []);

  const generateCareerMatches = useCallback(() => {
    const matches: CareerMatch[] = [];
    
    topCareerCategories.forEach(category => {
      const categoryKey = category as keyof typeof careerDatabase;
      if (careerDatabase[categoryKey]) {
        careerDatabase[categoryKey].forEach(career => {
          const adjustedMatch = adjustMatchScore(career.match);
          matches.push({
            ...career,
            match: adjustedMatch,
            readiness: calculateReadiness(career),
            category
          });
        });
      }
    });
    
    // Sort by match score and take top 5
    const sortedMatches = matches.sort((a, b) => b.match - a.match).slice(0, 5);
    setCareerMatches(sortedMatches);
  }, [topCareerCategories]);

  const adjustMatchScore = (baseMatch: number) => {
    const overallScore = calculateOverallScore();
    const adjustment = (overallScore - 50) / 100 * 10;
    return Math.min(Math.max(baseMatch + adjustment, 0), 100);
  };

  const calculateReadiness = (career: any) => {
    const skillScore = dimensions.skill_readiness.score;
    const maturityScore = dimensions.workplace_maturity.score;
    
    return Math.round((skillScore + maturityScore) / 2);
  };

  const calculateOverallScore = useCallback(() => {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.values(dimensions).forEach(dim => {
      totalScore += dim.score * dim.weight;
      totalWeight += dim.weight;
    });
    
    return totalScore / totalWeight;
  }, [dimensions]);

  const generateEmployerReport = useCallback(() => {
    return {
      candidateInfo: userProfile,
      overallScore: calculateOverallScore(),
      dimensionScores: dimensions,
      careerMatches,
      
      validityAnalysis: {
        status: validityStatus,
        distortionScore,
        flags: getValidityFlags(),
        recommendation: getValidityRecommendation()
      },
      
      readinessIndicators: {
        workplaceMaturity: dimensions.workplace_maturity.score,
        skillGaps: identifySkillGaps(),
        developmentPriorities: getDevelopmentPriorities(),
        estimatedRampTime: estimateRampTime()
      },
      
      culturalFit: {
        workStyle: analyzeWorkStyle(),
        teamFit: analyzeTeamFit(),
        managementStyle: recommendedManagementStyle()
      },
      
      hiringRecommendation: generateHiringRecommendation()
    };
  }, [userProfile, dimensions, careerMatches, validityStatus, distortionScore, calculateOverallScore]);

  const getValidityFlags = () => {
    const flags = [];
    
    if (distortionScore >= 2) {
      flags.push('Possible response distortion detected');
    }
    
    if (validityStatus === 'invalid') {
      flags.push('Assessment validity concerns');
    }
    
    return flags;
  };

  const getValidityRecommendation = () => {
    if (validityStatus === 'invalid') {
      return 'Consider retesting or alternative assessment methods';
    } else if (validityStatus === 'questionable') {
      return 'Proceed with caution and verify with additional assessment';
    }
    return 'Assessment results are reliable';
  };

  const identifySkillGaps = () => {
    const gaps = [];
    
    if (dimensions.skill_readiness.score < 60) {
      gaps.push('Technical skills development needed');
    }
    
    if (dimensions.workplace_maturity.score < 60) {
      gaps.push('Professional communication skills');
    }
    
    if (dimensions.adaptability.score < 60) {
      gaps.push('Change management capabilities');
    }
    
    return gaps;
  };

  const getDevelopmentPriorities = () => {
    const priorities = [];
    
    const sortedDimensions = Object.entries(dimensions)
      .sort((a, b) => a[1].score - b[1].score)
      .slice(0, 3);
    
    sortedDimensions.forEach(([dimension, data]) => {
      if (data.score < 70) {
        priorities.push({
          area: dimension.replace('_', ' '),
          priority: data.score < 50 ? 'High' : 'Medium',
          score: data.score
        });
      }
    });
    
    return priorities;
  };

  const estimateRampTime = () => {
    const overallScore = calculateOverallScore();
    
    if (overallScore >= 80) return '1-2 months';
    if (overallScore >= 65) return '2-4 months';
    if (overallScore >= 50) return '4-6 months';
    return '6+ months';
  };

  const analyzeWorkStyle = () => {
    // This would be based on rapid fire responses
    return {
      collaboration: 'Team-oriented',
      planning: 'Balanced approach',
      leadership: 'Supportive leader',
      creativity: 'Moderately creative'
    };
  };

  const analyzeTeamFit = () => {
    return {
      idealTeamSize: '5-8 people',
      preferredRole: 'Contributor',
      workEnvironment: 'Collaborative',
      communicationStyle: 'Direct but supportive'
    };
  };

  const recommendedManagementStyle = () => {
    return {
      style: 'Coaching approach',
      feedbackFrequency: 'Weekly check-ins',
      autonomyLevel: 'Moderate supervision',
      motivationFactors: ['Growth opportunities', 'Recognition', 'Team collaboration']
    };
  };

  const generateHiringRecommendation = () => {
    const overall = calculateOverallScore();
    const validity = validityStatus;
    
    if (validity === 'invalid') {
      return {
        recommendation: 'Not Recommended',
        confidence: 'Low',
        reason: 'Assessment validity concerns',
        action: 'Consider retesting or alternative assessment'
      };
    }
    
    if (overall >= 80) {
      return {
        recommendation: 'Strongly Recommended',
        confidence: 'High',
        reason: 'Excellent career readiness across all dimensions',
        action: 'Fast-track to final interview'
      };
    } else if (overall >= 65) {
      return {
        recommendation: 'Recommended',
        confidence: 'Medium',
        reason: 'Good potential with some development needs',
        action: 'Proceed with standard interview process'
      };
    } else if (overall >= 50) {
      return {
        recommendation: 'Conditional',
        confidence: 'Medium',
        reason: 'Potential present but significant development needed',
        action: 'Consider for entry-level or internship positions'
      };
    } else {
      return {
        recommendation: 'Not Ready',
        confidence: 'High',
        reason: 'Substantial gaps in career readiness',
        action: 'Recommend career development resources'
      };
    }
  };

  return {
    dimensions,
    careerMatches,
    topCareerCategories,
    distortionScore,
    validityStatus,
    userProfile,
    setUserProfile,
    processCareerSwipes,
    processSkillsChallenges,
    processWorkScenarios,
    processFutureQuest,
    calculateDistortionScore,
    generateCareerMatches,
    calculateOverallScore,
    generateEmployerReport
  };
};