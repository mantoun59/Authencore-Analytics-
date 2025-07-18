import { useState } from 'react';

interface CommunicationScores {
  assertiveness: number;
  expressiveness: number;
  detail_orientation: number;
  processing_speed: number;
  channel_preference: number;
  formality: number;
  listening: number;
  empathy: number;
  influence: number;
  negotiation: number;
  conflict: number;
}

interface CommunicationStyle {
  primary: string;
  secondary: string;
  description: string;
  strengths: string[];
  development_areas: string[];
}

export const useCommunicationScoring = () => {
  const [scores, setScores] = useState<CommunicationScores>({
    assertiveness: 0,
    expressiveness: 0,
    detail_orientation: 0,
    processing_speed: 0,
    channel_preference: 0,
    formality: 0,
    listening: 0,
    empathy: 0,
    influence: 0,
    negotiation: 0,
    conflict: 0
  });

  const calculateScores = (answers: Record<string, string>) => {
    const newScores: CommunicationScores = {
      assertiveness: 0,
      expressiveness: 0,
      detail_orientation: 0,
      processing_speed: 0,
      channel_preference: 0,
      formality: 0,
      listening: 0,
      empathy: 0,
      influence: 0,
      negotiation: 0,
      conflict: 0
    };

    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionIndex, answerId]) => {
      const answerValue = answerId.toLowerCase();
      
      // Simplified scoring logic
      if (['a', 'direct', 'lead', 'address'].includes(answerValue)) {
        newScores.assertiveness += 2;
        newScores.conflict += 1;
      } else if (['b', 'engaging', 'support', 'mediate'].includes(answerValue)) {
        newScores.expressiveness += 2;
        newScores.empathy += 1;
      } else if (['c', 'structured', 'analyze', 'written'].includes(answerValue)) {
        newScores.detail_orientation += 2;
        newScores.formality += 1;
      } else {
        newScores.listening += 2;
        newScores.empathy += 1;
      }
    });

    // Normalize scores to 0-100 range
    const questionCount = Object.keys(answers).length;
    if (questionCount > 0) {
      Object.keys(newScores).forEach(key => {
        newScores[key as keyof CommunicationScores] = Math.min(100, 
          Math.round((newScores[key as keyof CommunicationScores] / questionCount) * 50)
        );
      });
    }

    setScores(newScores);
    return newScores;
  };

  const getMainStyle = (scores: CommunicationScores) => {
    const styleScores = {
      director: scores.assertiveness + scores.conflict,
      socializer: scores.expressiveness + scores.empathy,
      thinker: scores.detail_orientation + scores.formality,
      supporter: scores.listening + scores.empathy
    };

    return Object.entries(styleScores).reduce((a, b) => 
      styleScores[a[0] as keyof typeof styleScores] > styleScores[b[0] as keyof typeof styleScores] ? a : b
    )[0];
  };

  const getStyleDescription = (style: string) => {
    const descriptions = {
      director: "You communicate with clarity and decisiveness, preferring straightforward approaches.",
      socializer: "You excel at bringing people together and facilitating group discussions.",
      thinker: "You rely on data and logical frameworks to structure your communications.",
      supporter: "You prioritize relationships and create comfortable communication environments."
    };
    return descriptions[style as keyof typeof descriptions] || "Balanced communication style";
  };

  const getCommunicationStyle = (scores: CommunicationScores): CommunicationStyle => {
    const mainStyle = getMainStyle(scores);
    
    const styleProfiles = {
      director: {
        primary: "Director",
        secondary: "Results-focused",
        description: "Direct, decisive, and results-oriented communication style",
        strengths: ["Clear communication", "Quick decision making", "Goal-oriented"],
        development_areas: ["Active listening", "Emotional intelligence", "Patience"]
      },
      socializer: {
        primary: "Socializer", 
        secondary: "People-focused",
        description: "Expressive, engaging, and relationship-oriented communication style",
        strengths: ["Relationship building", "Enthusiasm", "Persuasion"],
        development_areas: ["Focus on details", "Time management", "Structure"]
      },
      thinker: {
        primary: "Thinker",
        secondary: "Process-focused", 
        description: "Analytical, systematic, and detail-oriented communication style",
        strengths: ["Logical thinking", "Attention to detail", "Quality focus"],
        development_areas: ["Speed of decision", "Flexibility", "Emotional expression"]
      },
      supporter: {
        primary: "Supporter",
        secondary: "Harmony-focused",
        description: "Supportive, collaborative, and team-oriented communication style", 
        strengths: ["Team collaboration", "Empathy", "Conflict resolution"],
        development_areas: ["Assertiveness", "Decision speed", "Taking initiative"]
      }
    };

    return styleProfiles[mainStyle as keyof typeof styleProfiles];
  };

  return {
    scores,
    calculateScores,
    getMainStyle,
    getStyleDescription,
    getCommunicationStyle
  };
};