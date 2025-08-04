import { useState, useEffect } from 'react';

interface UserInfo {
  fullName: string;
  age: number;
  email: string;
  gender: string;
  organization: string;
  position: string;
  experience: number;
  teamSize: string;
}

interface DimensionScore {
  raw: number;
  percentage: number;
  level: string;
  interpretation: string;
  strengths: number[];
  developmentAreas: number[];
}

interface LeadershipProfile {
  type: string;
  description: string;
  strengths: string[];
  recommendations: string[];
}

interface Recommendation {
  dimension: string;
  actions: string[];
}

interface LeadershipResults {
  dimensions: Record<string, DimensionScore>;
  overall: number;
  profile: LeadershipProfile;
  recommendations: {
    immediate: Recommendation[];
    shortTerm: Recommendation[];
    longTerm: { title: string; description: string; timeline: string; }[];
  };
}

export const useLeadershipScoring = () => {
  const [results, setResults] = useState<LeadershipResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const dimensions = [
    'strategicThinking',
    'emotionalIntelligence',
    'communicationInfluence',
    'teamDevelopment',
    'decisionMaking',
    'changeManagement'
  ];

  const calculateScores = async (responses: number[], userInfo: UserInfo): Promise<LeadershipResults> => {
    setIsCalculating(true);
    
    // Validate responses
    if (!responses || responses.length === 0) {
      setIsCalculating(false);
      throw new Error('No responses provided for scoring');
    }
    
    // Initialize scores
    const scores: Record<string, DimensionScore> = {};
    
    dimensions.forEach(dimension => {
      scores[dimension] = {
        raw: 0,
        percentage: 0,
        level: '',
        interpretation: '',
        strengths: [],
        developmentAreas: []
      };
    });

    // Calculate how many questions per dimension we actually have
    const questionsPerDimension = Math.floor(responses.length / dimensions.length);

    // Calculate raw scores for each dimension
    responses.forEach((response, index) => {
      // Ensure response is a valid number between 1-5
      const validResponse = Math.max(1, Math.min(5, Number(response) || 1));
      const dimensionIndex = Math.floor(index / questionsPerDimension);
      
      // Safety check to prevent index out of bounds
      if (dimensionIndex < dimensions.length) {
        const dimension = dimensions[dimensionIndex];
        scores[dimension].raw += validResponse;
      }
    });

    // Convert to percentages and determine levels
    dimensions.forEach(dimension => {
      const maxScore = questionsPerDimension * 5; // Dynamic calculation based on actual questions
      const rawScore = scores[dimension].raw;
      
      // Ensure we don't divide by zero
      const percentage = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
      scores[dimension].percentage = Math.max(0, Math.min(100, percentage));
      scores[dimension].level = determineLevel(percentage, userInfo.experience);
      scores[dimension].interpretation = getInterpretation(dimension, percentage);
      
      // Identify strengths and development areas
      analyzeStrengthsAndWeaknesses(dimension, scores, responses, dimensions);
    });

    // Calculate overall leadership effectiveness score
    const totalRaw = Object.values(scores).reduce((sum, score) => sum + score.raw, 0);
    const totalMax = responses.length * 5; // Dynamic calculation based on actual responses
    const overallScore = totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;
    
    // Generate leadership profile
    const leadershipProfile = generateLeadershipProfile(scores);
    
    // Generate recommendations
    const recommendations = generateRecommendations(scores);
    
    const results: LeadershipResults = {
      dimensions: scores,
      overall: overallScore,
      profile: leadershipProfile,
      recommendations
    };
    
    setResults(results);
    setIsCalculating(false);
    
    return results;
  };

  const determineLevel = (percentage: number, experience: number): string => {
    // Adjust expectations based on experience
    const experienceAdjustment = Math.min(experience * 0.5, 10);
    const adjustedScore = percentage - experienceAdjustment;
    
    if (adjustedScore >= 85) return 'Exceptional';
    if (adjustedScore >= 70) return 'Strong';
    if (adjustedScore >= 55) return 'Developing';
    return 'Emerging';
  };

  const getInterpretation = (dimension: string, percentage: number): string => {
    const interpretations: Record<string, Record<string, string>> = {
      strategicThinking: {
        high: "You demonstrate exceptional strategic thinking capabilities, consistently seeing the big picture and planning effectively for the future.",
        medium: "You show good strategic thinking skills but could benefit from more systematic long-term planning.",
        low: "Developing stronger strategic thinking skills will help you lead more effectively and create better outcomes."
      },
      emotionalIntelligence: {
        high: "Your emotional intelligence is a key leadership strength, enabling you to build strong relationships and navigate complex interpersonal dynamics.",
        medium: "You have solid emotional intelligence but could enhance your ability to read and respond to emotional cues.",
        low: "Improving your emotional intelligence will significantly enhance your leadership effectiveness and team relationships."
      },
      communicationInfluence: {
        high: "You excel at communication and influence, effectively conveying ideas and inspiring others to action.",
        medium: "Your communication is generally effective but could be more impactful with enhanced influence strategies.",
        low: "Strengthening your communication and influence skills will help you better engage and motivate your team."
      },
      teamDevelopment: {
        high: "You are highly effective at developing talent and building strong, capable teams.",
        medium: "You show good team development skills but could focus more on individual growth and succession planning.",
        low: "Investing more in team development will help you build stronger, more autonomous teams."
      },
      decisionMaking: {
        high: "Your decision-making is timely, well-informed, and balanced, inspiring confidence in your leadership.",
        medium: "You make generally good decisions but could improve your process for gathering input and communicating rationale.",
        low: "Enhancing your decision-making process will help you lead with greater confidence and effectiveness."
      },
      changeManagement: {
        high: "You excel at leading change, helping others navigate uncertainty while maintaining momentum and morale.",
        medium: "You manage change reasonably well but could be more proactive in addressing resistance and communicating vision.",
        low: "Developing stronger change management skills will help you lead transformations more successfully."
      }
    };
    
    const level = percentage >= 80 ? 'high' : percentage >= 60 ? 'medium' : 'low';
    return interpretations[dimension][level];
  };

  const analyzeStrengthsAndWeaknesses = (
    dimension: string, 
    scores: Record<string, DimensionScore>, 
    responses: number[], 
    dimensions: string[]
  ) => {
    const questionsPerDimension = Math.floor(responses.length / dimensions.length);
    const dimensionStart = dimensions.indexOf(dimension) * questionsPerDimension;
    const dimensionResponses = responses.slice(dimensionStart, dimensionStart + questionsPerDimension);
    
    // Identify strongest and weakest areas within dimension
    dimensionResponses.forEach((response, index) => {
      const validResponse = Math.max(1, Math.min(5, Number(response) || 1));
      if (validResponse >= 4) {
        scores[dimension].strengths.push(index);
      } else if (validResponse <= 2) {
        scores[dimension].developmentAreas.push(index);
      }
    });
  };

  const generateLeadershipProfile = (scores: Record<string, DimensionScore>): LeadershipProfile => {
    const topDimensions = Object.entries(scores)
      .sort((a, b) => b[1].percentage - a[1].percentage)
      .slice(0, 2)
      .map(([dim]) => dim);
    
    const profiles: Record<string, string> = {
      'strategicThinking,emotionalIntelligence': 'Visionary Leader',
      'strategicThinking,communicationInfluence': 'Strategic Communicator',
      'strategicThinking,decisionMaking': 'Strategic Decision Maker',
      'emotionalIntelligence,teamDevelopment': 'People-Focused Leader',
      'emotionalIntelligence,communicationInfluence': 'Inspirational Leader',
      'communicationInfluence,changeManagement': 'Change Champion',
      'teamDevelopment,changeManagement': 'Transformational Leader',
      'decisionMaking,changeManagement': 'Decisive Change Agent'
    };
    
    const key = topDimensions.sort().join(',');
    const profileType = profiles[key] || 'Balanced Leader';
    
    return {
      type: profileType,
      description: getProfileDescription(profileType),
      strengths: topDimensions,
      recommendations: getProfileRecommendations(topDimensions)
    };
  };

  const getProfileDescription = (profileType: string): string => {
    const descriptions: Record<string, string> = {
      'Visionary Leader': "You combine strategic thinking with emotional intelligence to inspire and guide others toward a compelling future.",
      'Strategic Communicator': "You excel at translating complex strategies into clear, actionable messages that resonate with diverse audiences.",
      'Strategic Decision Maker': "You make well-informed decisions aligned with long-term strategic objectives.",
      'People-Focused Leader': "You prioritize team development and emotional connection to build high-performing, engaged teams.",
      'Inspirational Leader': "You use emotional intelligence and communication skills to inspire and motivate others to achieve their best.",
      'Change Champion': "You effectively communicate and lead organizational transformations with enthusiasm and clarity.",
      'Transformational Leader': "You develop people while guiding them through change, creating lasting positive impact.",
      'Decisive Change Agent': "You make tough decisions quickly while managing complex organizational changes.",
      'Balanced Leader': "You demonstrate well-rounded leadership capabilities across multiple dimensions."
    };
    return descriptions[profileType];
  };

  const getProfileRecommendations = (topDimensions: string[]): string[] => {
    return [
      `Leverage your strength in ${topDimensions[0]} to enhance other areas`,
      `Use your ${topDimensions[1]} capabilities to support team development`,
      'Seek opportunities that play to your natural leadership style',
      'Consider mentoring others in your areas of strength'
    ];
  };

  const generateRecommendations = (scores: Record<string, DimensionScore>) => {
    const recommendations = {
      immediate: [] as Recommendation[],
      shortTerm: [] as Recommendation[],
      longTerm: [
        {
          title: "Executive Coaching",
          description: "Engage an executive coach to accelerate your leadership development",
          timeline: "6-12 months"
        },
        {
          title: "360-Degree Feedback",
          description: "Implement regular 360 feedback to track progress and blind spots",
          timeline: "Quarterly"
        },
        {
          title: "Leadership Development Program",
          description: "Enroll in a comprehensive leadership development program",
          timeline: "12-18 months"
        },
        {
          title: "Stretch Assignments",
          description: "Seek assignments that challenge your weakest dimensions",
          timeline: "Ongoing"
        }
      ]
    };
    
    // Analyze scores and generate targeted recommendations
    dimensions.forEach(dimension => {
      if (scores[dimension].percentage < 60) {
        recommendations.immediate.push({
          dimension: dimension,
          actions: getImmediateActions(dimension)
        });
      } else if (scores[dimension].percentage < 75) {
        recommendations.shortTerm.push({
          dimension: dimension,
          actions: getShortTermActions(dimension)
        });
      }
    });
    
    return recommendations;
  };

  const getImmediateActions = (dimension: string): string[] => {
    const actions: Record<string, string[]> = {
      strategicThinking: [
        "Schedule weekly strategic thinking time",
        "Start reading industry reports and trends",
        "Practice connecting daily tasks to bigger picture"
      ],
      emotionalIntelligence: [
        "Practice active listening in all conversations",
        "Keep an emotion journal for self-awareness",
        "Ask for feedback on your interpersonal impact"
      ],
      communicationInfluence: [
        "Prepare key messages before important conversations",
        "Practice storytelling techniques",
        "Seek feedback on your communication style"
      ],
      teamDevelopment: [
        "Schedule regular 1-on-1s with team members",
        "Create development plans for each team member",
        "Delegate one new responsibility this week"
      ],
      decisionMaking: [
        "Use a decision framework for major choices",
        "Set decision deadlines to avoid analysis paralysis",
        "Document decision rationale for future reference"
      ],
      changeManagement: [
        "Communicate more about upcoming changes",
        "Create a change readiness assessment",
        "Identify and engage change champions"
      ]
    };
    return actions[dimension] || [];
  };

  const getShortTermActions = (dimension: string): string[] => {
    const actions: Record<string, string[]> = {
      strategicThinking: [
        "Develop a 3-year vision for your team",
        "Conduct competitive analysis quarterly",
        "Create strategic KPIs and track them"
      ],
      emotionalIntelligence: [
        "Take an advanced EQ workshop",
        "Practice managing reactions in stressful situations",
        "Build deeper relationships with key stakeholders"
      ],
      communicationInfluence: [
        "Join a public speaking group",
        "Develop your executive presence",
        "Create a stakeholder engagement plan"
      ],
      teamDevelopment: [
        "Implement a team development program",
        "Create succession plans for key roles",
        "Launch a peer mentoring initiative"
      ],
      decisionMaking: [
        "Study decision-making frameworks",
        "Build a personal board of advisors",
        "Implement post-decision reviews"
      ],
      changeManagement: [
        "Get certified in change management",
        "Lead a significant change initiative",
        "Build a change management toolkit"
      ]
    };
    return actions[dimension] || [];
  };

  return {
    calculateScores,
    results,
    isCalculating,
    setResults
  };
};