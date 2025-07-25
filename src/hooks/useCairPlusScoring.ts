import { useState } from 'react';

interface SubdimensionScore {
  raw: number;
  percentile: number;
  level: string;
  questionCount: number;
}

interface DimensionScores {
  [subdimension: string]: SubdimensionScore;
}

interface CAIRPlusScores {
  conscientiousness: DimensionScores;
  agreeableness: DimensionScores;
  innovation: DimensionScores;
  resilience: DimensionScores;
  overall: {
    conscientiousness: SubdimensionScore;
    agreeableness: SubdimensionScore;
    innovation: SubdimensionScore;
    resilience: SubdimensionScore;
  };
}

interface ValidityMetrics {
  fakeGoodScore: number;
  fakeBadScore: number;
  inconsistencyScore: number;
  randomResponseScore: number;
  overallValidity: 'Valid' | 'Questionable' | 'Invalid';
  responseTimeProfile: 'Normal' | 'Too Fast' | 'Too Slow';
}

interface AssessmentResponse {
  questionId: string;
  answer: 'A' | 'B';
  responseTime: number;
  timestamp: number;
}

interface CAIRQuestion {
  id: string;
  type: 'forced_choice' | 'distortion';
  dimension: string;
  subdimension?: string;
  reverse?: boolean;
  distortionType?: string;
}

export const useCairPlusScoring = () => {
  const [scores, setScores] = useState<CAIRPlusScores | null>(null);
  
  // Subdimension definitions with their specific focus areas
  const subdimensionWeights = {
    conscientiousness: {
      organization: { weight: 1.2, description: "Systematic approach to tasks and workspace management" },
      reliability: { weight: 1.3, description: "Consistency in meeting commitments and deadlines" },
      goal_orientation: { weight: 1.1, description: "Focus on achieving specific objectives" },
      attention_to_detail: { weight: 1.2, description: "Precision and thoroughness in work" },
      rule_following: { weight: 1.0, description: "Adherence to procedures and guidelines" },
      self_improvement: { weight: 1.1, description: "Commitment to personal development" },
      self_monitoring: { weight: 1.0, description: "Awareness of own performance and progress" },
      preparation: { weight: 1.1, description: "Proactive planning and readiness" }
    },
    agreeableness: {
      cooperation: { weight: 1.3, description: "Willingness to work collaboratively" },
      helpfulness: { weight: 1.1, description: "Support and assistance to others" },
      trust: { weight: 1.0, description: "Faith in others' good intentions" },
      compassion: { weight: 1.2, description: "Empathy and concern for others" },
      empathy: { weight: 1.2, description: "Understanding others' emotions and perspectives" },
      modesty: { weight: 0.9, description: "Humility and receptiveness to feedback" },
      interpersonal_warmth: { weight: 1.1, description: "Friendliness and approachability" },
      consensus_building: { weight: 1.2, description: "Ability to build agreement and harmony" }
    },
    innovation: {
      creativity: { weight: 1.3, description: "Original thinking and idea generation" },
      openness_to_change: { weight: 1.2, description: "Adaptability and change acceptance" },
      learning_style: { weight: 1.1, description: "Approach to acquiring new knowledge" },
      ideation: { weight: 1.2, description: "Brainstorming and conceptual thinking" },
      change_tolerance: { weight: 1.1, description: "Comfort with uncertainty and change" },
      innovation_preference: { weight: 1.3, description: "Preference for novel solutions" },
      improvement_orientation: { weight: 1.1, description: "Drive to enhance existing systems" },
      ambiguity_tolerance: { weight: 1.0, description: "Comfort with unclear situations" },
      abstract_thinking: { weight: 1.1, description: "Conceptual and theoretical reasoning" },
      risk_taking: { weight: 1.0, description: "Willingness to take calculated risks" }
    },
    resilience: {
      recovery_speed: { weight: 1.3, description: "Ability to bounce back from setbacks" },
      stress_tolerance: { weight: 1.3, description: "Performance under pressure" },
      optimism: { weight: 1.1, description: "Positive outlook and hope" },
      energy_management: { weight: 1.0, description: "Sustaining energy throughout challenges" },
      emotional_stability: { weight: 1.2, description: "Emotional consistency and control" },
      pressure_performance: { weight: 1.3, description: "Maintaining quality under stress" },
      workload_management: { weight: 1.1, description: "Handling multiple demands effectively" },
      life_perspective: { weight: 1.0, description: "Overall view of challenges and opportunities" },
      persistence: { weight: 1.2, description: "Continuing despite difficulties" },
      work_recovery: { weight: 1.0, description: "Ability to separate work and personal life" }
    }
  };

  const calculateSubdimensionScores = (responses: AssessmentResponse[], questions: CAIRQuestion[]): CAIRPlusScores => {
    const dimensionData: CAIRPlusScores = {
      conscientiousness: {},
      agreeableness: {},
      innovation: {},
      resilience: {},
      overall: {
        conscientiousness: { raw: 0, percentile: 0, level: '', questionCount: 0 },
        agreeableness: { raw: 0, percentile: 0, level: '', questionCount: 0 },
        innovation: { raw: 0, percentile: 0, level: '', questionCount: 0 },
        resilience: { raw: 0, percentile: 0, level: '', questionCount: 0 }
      }
    };

    // Initialize all subdimensions
    Object.keys(subdimensionWeights).forEach(dimension => {
      Object.keys(subdimensionWeights[dimension as keyof typeof subdimensionWeights]).forEach(subdimension => {
        (dimensionData as any)[dimension][subdimension] = {
          raw: 0,
          percentile: 0,
          level: '',
          questionCount: 0
        };
      });
    });

    // Calculate subdimension scores
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (!question || question.type !== 'forced_choice') return;

      const dimension = question.dimension;
      const subdimension = question.subdimension;
      
      if (!subdimension || !dimensionData[dimension as keyof CAIRPlusScores]) return;

      let score = response.answer === 'A' ? 1 : 0;
      if (question.reverse) score = 1 - score;

      // Apply subdimension weight
      const dimensionWeights = subdimensionWeights[dimension as keyof typeof subdimensionWeights];
      const weight = dimensionWeights?.[subdimension]?.weight || 1.0;
      const weightedScore = score * weight;

      const subdimScores = (dimensionData as any)[dimension][subdimension];
      if (subdimScores) {
        subdimScores.raw += weightedScore;
        subdimScores.questionCount += 1;
      }
    });

    // Normalize scores and calculate percentiles
    Object.keys(dimensionData).forEach(dimension => {
      if (dimension === 'overall') return;
      
      const dimData = (dimensionData as any)[dimension];
      let totalDimScore = 0;
      let totalQuestions = 0;

      Object.keys(dimData).forEach(subdimension => {
        const subdimData = dimData[subdimension];
        if (subdimData.questionCount > 0) {
          // Normalize raw score
          subdimData.raw = subdimData.raw / subdimData.questionCount;
          
          // Convert to percentile (enhanced with subdimension-specific norms)
          subdimData.percentile = Math.round(
            calculateSubdimensionPercentile(dimension, subdimension, subdimData.raw)
          );
          
          subdimData.level = getPerformanceLevel(subdimData.percentile);
          
          totalDimScore += subdimData.raw * subdimData.questionCount;
          totalQuestions += subdimData.questionCount;
        }
      });

      // Calculate overall dimension score
      if (totalQuestions > 0) {
        const overallRaw = totalDimScore / totalQuestions;
        const dimensionPercentile = Math.round(calculateDimensionPercentile(dimension, overallRaw));
        dimensionData.overall[dimension as keyof typeof dimensionData.overall] = {
          raw: overallRaw,
          percentile: dimensionPercentile,
          level: getPerformanceLevel(dimensionPercentile),
          questionCount: totalQuestions
        };
      }
    });

    return dimensionData;
  };

  const calculateSubdimensionPercentile = (dimension: string, subdimension: string, rawScore: number): number => {
    // Subdimension-specific percentile calculation with normative adjustments
    const basePercentile = rawScore * 100;
    
    // Apply subdimension-specific normative adjustments
    const adjustments: Record<string, Record<string, number>> = {
      conscientiousness: {
        organization: 5,     // Slightly higher norm expectation
        reliability: 8,      // High norm expectation in workplace
        attention_to_detail: 3,
        goal_orientation: 2,
        rule_following: -2,  // Lower norm expectation (people vary more)
        self_improvement: 0,
        self_monitoring: 1,
        preparation: 4
      },
      agreeableness: {
        cooperation: 6,      // High workplace expectation
        helpfulness: 3,
        trust: -5,          // Lower baseline (trust varies significantly)
        compassion: 2,
        empathy: 1,
        modesty: -3,        // Lower baseline expectation
        interpersonal_warmth: 4,
        consensus_building: 5
      },
      innovation: {
        creativity: 0,       // No adjustment - varies widely
        openness_to_change: 3,
        learning_style: 1,
        ideation: -2,        // Lower baseline - not everyone is highly creative
        change_tolerance: 2,
        innovation_preference: -3,
        improvement_orientation: 4,
        ambiguity_tolerance: -1,
        abstract_thinking: -2,
        risk_taking: -4      // Lower baseline - most people are risk-averse
      },
      resilience: {
        recovery_speed: 2,
        stress_tolerance: 4,  // Important workplace skill
        optimism: 1,
        energy_management: 3,
        emotional_stability: 5, // High workplace importance
        pressure_performance: 6,
        workload_management: 4,
        life_perspective: 0,
        persistence: 3,
        work_recovery: 2
      }
    };

    const adjustment = adjustments[dimension]?.[subdimension] || 0;
    return Math.max(1, Math.min(99, basePercentile + adjustment));
  };

  const calculateDimensionPercentile = (dimension: string, rawScore: number): number => {
    // Overall dimension percentile calculation
    return Math.max(1, Math.min(99, rawScore * 100));
  };

  const getPerformanceLevel = (percentile: number): string => {
    if (percentile >= 90) return 'Exceptional';
    if (percentile >= 75) return 'Strong';
    if (percentile >= 60) return 'Above Average';
    if (percentile >= 40) return 'Average';
    if (percentile >= 25) return 'Below Average';
    if (percentile >= 10) return 'Developing';
    return 'Needs Attention';
  };

  const getSubdimensionInsights = (dimension: string, subdimension: string, score: SubdimensionScore) => {
    const dimensionWeights = subdimensionWeights[dimension as keyof typeof subdimensionWeights];
    const insights = dimensionWeights?.[subdimension];
    
    return {
      description: insights?.description || '',
      workplaceRelevance: getWorkplaceRelevance(dimension, subdimension, score.level),
      developmentSuggestions: getDevelopmentSuggestions(dimension, subdimension, score.level),
      interviewQuestions: getSubdimensionInterviewQuestions(dimension, subdimension, score.level)
    };
  };

  const getWorkplaceRelevance = (dimension: string, subdimension: string, level: string): string => {
    const relevanceMap: Record<string, Record<string, Record<string, string>>> = {
      conscientiousness: {
        organization: {
          'Exceptional': 'Creates and maintains highly efficient systems; excellent for project management roles',
          'Strong': 'Maintains organized workspace and systematic approach to tasks',
          'Average': 'Generally organized but may need structure for complex projects',
          'Developing': 'Would benefit from organizational training and clear systems'
        },
        reliability: {
          'Exceptional': 'Extremely dependable; never misses commitments; ideal for critical responsibilities',
          'Strong': 'Consistently meets deadlines and follows through on commitments',
          'Average': 'Generally reliable but may occasionally need reminders',
          'Developing': 'Needs supervision to ensure commitments are met'
        }
      },
      agreeableness: {
        cooperation: {
          'Exceptional': 'Outstanding team player; builds consensus; may avoid necessary conflicts',
          'Strong': 'Works well in teams; collaborative approach to problem-solving',
          'Average': 'Cooperates when needed but maintains independence',
          'Developing': 'May prefer individual work; needs coaching on collaboration'
        },
        empathy: {
          'Exceptional': 'Deeply understands others; excellent for customer service and team leadership',
          'Strong': 'Good at reading emotional cues and responding appropriately',
          'Average': 'Shows appropriate concern for others in most situations',
          'Developing': 'May need coaching on interpersonal sensitivity'
        }
      }
      // Add more mappings as needed
    };

    return relevanceMap[dimension]?.[subdimension]?.[level] || 'Standard workplace expectations apply';
  };

  const getDevelopmentSuggestions = (dimension: string, subdimension: string, level: string): string[] => {
    if (level === 'Exceptional' || level === 'Strong') {
      return [`Leverage ${subdimension} strength to mentor others`, 'Consider leadership roles that utilize this strength'];
    }

    const suggestions: Record<string, Record<string, string[]>> = {
      conscientiousness: {
        organization: ['Use digital planning tools', 'Implement daily and weekly review processes', 'Create standardized filing systems'],
        reliability: ['Set calendar reminders for all commitments', 'Break large tasks into smaller, manageable pieces', 'Establish accountability partnerships']
      },
      agreeableness: {
        cooperation: ['Practice active listening techniques', 'Join cross-functional project teams', 'Seek feedback on collaborative skills'],
        empathy: ['Practice perspective-taking exercises', 'Observe body language and emotional cues', 'Ask clarifying questions about others\' feelings']
      },
      innovation: {
        creativity: ['Engage in brainstorming sessions', 'Explore different industries for inspiration', 'Practice lateral thinking exercises'],
        openness_to_change: ['Start with small changes to build comfort', 'Focus on benefits of change', 'Seek change management training']
      },
      resilience: {
        stress_tolerance: ['Learn stress management techniques', 'Practice mindfulness and meditation', 'Build strong support networks'],
        recovery_speed: ['Develop healthy coping mechanisms', 'Practice reframing negative situations', 'Build emotional regulation skills']
      }
    };

    return suggestions[dimension]?.[subdimension] || ['Focus on continuous improvement in this area'];
  };

  const getSubdimensionInterviewQuestions = (dimension: string, subdimension: string, level: string): string[] => {
    const questions: Record<string, Record<string, string[]>> = {
      conscientiousness: {
        organization: [
          'Describe your system for managing multiple projects simultaneously.',
          'Tell me about a time when your organizational skills prevented a potential problem.',
          'How do you prioritize tasks when everything seems urgent?'
        ],
        reliability: [
          'Describe a situation where others were counting on you to deliver something critical.',
          'Tell me about a time when you had to meet a challenging deadline.',
          'How do you ensure you follow through on commitments?'
        ]
      },
      agreeableness: {
        cooperation: [
          'Tell me about a successful team project and your role in it.',
          'Describe a time when you had to work with someone difficult.',
          'How do you handle situations where team members disagree?'
        ],
        empathy: [
          'Describe a time when you had to deliver difficult news to someone.',
          'Tell me about a situation where you helped a colleague through a challenge.',
          'How do you ensure you understand others\' perspectives?'
        ]
      }
    };

    return questions[dimension]?.[subdimension] || ['Standard behavioral questions for this area'];
  };

  return {
    calculateSubdimensionScores,
    getSubdimensionInsights,
    getPerformanceLevel,
    scores,
    setScores,
    subdimensionWeights
  };
};