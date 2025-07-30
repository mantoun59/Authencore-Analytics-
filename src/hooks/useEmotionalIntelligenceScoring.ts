import { useState, useCallback } from 'react';
import { dimensionNames } from '@/data/emotionalIntelligenceQuestions';

export interface DimensionScore {
  raw: number;
  percentage: number;
  level: 'Low' | 'Medium' | 'High';
  interpretation: string;
}

export interface EmotionalIntelligenceScores {
  selfAwareness: DimensionScore;
  selfRegulation: DimensionScore;
  motivation: DimensionScore;
  empathy: DimensionScore;
  socialSkills: DimensionScore;
}

export interface EmotionalIntelligenceResult {
  scores: EmotionalIntelligenceScores;
  overallScore: number;
  recommendations: Array<{
    dimension: string;
    suggestions: string[];
  }>;
}

export const useEmotionalIntelligenceScoring = () => {
  const [result, setResult] = useState<EmotionalIntelligenceResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const getInterpretation = useCallback((dimension: string, level: string): string => {
    const interpretations = {
      selfAwareness: {
        High: "You have excellent self-awareness. You understand your emotions, strengths, weaknesses, and values clearly.",
        Medium: "You have good self-awareness but there's room for deeper understanding of your emotions and reactions.",
        Low: "Developing greater self-awareness will help you understand your emotions and reactions better."
      },
      selfRegulation: {
        High: "You demonstrate strong emotional control and can manage your impulses effectively.",
        Medium: "You generally manage emotions well but may struggle in highly stressful situations.",
        Low: "Working on emotional regulation techniques will help you manage difficult situations more effectively."
      },
      motivation: {
        High: "You are highly self-motivated and driven by internal goals and values.",
        Medium: "You have moderate self-motivation but could benefit from clearer goal-setting.",
        Low: "Building internal motivation and setting clear goals will enhance your drive and persistence."
      },
      empathy: {
        High: "You have a strong ability to understand and share the feelings of others.",
        Medium: "You understand others reasonably well but could develop deeper emotional connections.",
        Low: "Practicing active listening and perspective-taking will improve your understanding of others."
      },
      socialSkills: {
        High: "You excel at building relationships and influencing others positively.",
        Medium: "You have decent social skills but could improve in certain interpersonal areas.",
        Low: "Developing communication and relationship-building skills will enhance your interpersonal effectiveness."
      }
    };
    
    return interpretations[dimension as keyof typeof interpretations]?.[level as keyof typeof interpretations.selfAwareness] || '';
  }, []);

  const getRecommendations = useCallback((dimension: string): string[] => {
    const recommendations = {
      selfAwareness: [
        "Keep a daily emotion journal",
        "Practice mindfulness meditation",
        "Ask for feedback from trusted friends",
        "Reflect on your reactions to situations"
      ],
      selfRegulation: [
        "Learn breathing techniques for stress management",
        "Practice the pause before reacting",
        "Develop healthy coping strategies",
        "Set clear boundaries"
      ],
      motivation: [
        "Set SMART goals",
        "Create a vision board",
        "Celebrate small wins",
        "Find your 'why' for tasks"
      ],
      empathy: [
        "Practice active listening",
        "Read fiction to understand different perspectives",
        "Volunteer for community service",
        "Ask open-ended questions"
      ],
      socialSkills: [
        "Join networking groups",
        "Practice public speaking",
        "Take a communication course",
        "Seek leadership opportunities"
      ]
    };
    
    return recommendations[dimension as keyof typeof recommendations] || [];
  }, []);

  const calculateScores = useCallback((responses: number[]): EmotionalIntelligenceResult => {
    setIsCalculating(true);
    
    const dimensions = ['selfAwareness', 'selfRegulation', 'motivation', 'empathy', 'socialSkills'];
    const scores: EmotionalIntelligenceScores = {} as EmotionalIntelligenceScores;
    
    // Calculate scores for each dimension (now 14 questions each instead of 12)
    dimensions.forEach((dimension, dimensionIndex) => {
      const dimensionResponses = responses.slice(dimensionIndex * 14, (dimensionIndex + 1) * 14);
      
      // Handle reverse scoring - questions 12 and 13 (indices 12, 13) are reverse-scored
      const processedResponses = dimensionResponses.map((response, index) => {
        const isReverse = index === 12 || index === 13; // Last 2 questions are reverse-scored
        return isReverse ? (6 - response) : response; // Reverse 1-5 scale to 5-1
      });
      
      const rawScore = processedResponses.reduce((sum, response) => sum + response, 0);
      const maxScore = 70; // 14 questions × 5 max points
      const percentage = Math.round((rawScore / maxScore) * 100);
      
      let level: 'Low' | 'Medium' | 'High';
      if (percentage >= 80) level = 'High';
      else if (percentage >= 60) level = 'Medium';
      else level = 'Low';
      
      scores[dimension as keyof EmotionalIntelligenceScores] = {
        raw: rawScore,
        percentage,
        level,
        interpretation: getInterpretation(dimension, level)
      };
    });
    
    // Calculate overall score
    const totalRaw = Object.values(scores).reduce((sum, score) => sum + score.raw, 0);
    const totalMax = 350; // 70 questions × 5 max points
    const overallScore = Math.round((totalRaw / totalMax) * 100);
    
    // Generate recommendations for low-scoring dimensions
    const recommendations = dimensions
      .filter(dimension => scores[dimension as keyof EmotionalIntelligenceScores].percentage < 60)
      .map(dimension => ({
        dimension: dimensionNames[dimension as keyof typeof dimensionNames],
        suggestions: getRecommendations(dimension)
      }));
    
    const result: EmotionalIntelligenceResult = {
      scores,
      overallScore,
      recommendations
    };
    
    setResult(result);
    setIsCalculating(false);
    
    return result;
  }, [getInterpretation, getRecommendations]);

  const reset = useCallback(() => {
    setResult(null);
    setIsCalculating(false);
  }, []);

  return {
    result,
    isCalculating,
    calculateScores,
    reset
  };
};