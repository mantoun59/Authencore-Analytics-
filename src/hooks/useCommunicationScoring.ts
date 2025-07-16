import { useState, useCallback } from 'react';
import { linguisticPatterns, scoringDimensions } from '@/data/communicationQuestions';

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

interface CommunicationEffectivenessIndex {
  overall: number;
  breakdown: {
    naturalStyle: number;
    adaptability: number;
    channelMastery: number;
    difficultConversations: number;
  };
}

interface CommunicationDNA {
  assertiveness: number;
  responsiveness: number;
  channelMatrix: {
    faceToFace: number;
    video: number;
    written: number;
    informal: number;
  };
  flexibilityScore: number;
  influenceStyle: string;
  teamSynergy: number;
}

interface TeamCompatibility {
  director: number;
  socializer: number;
  thinker: number;
  supporter: number;
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

  const [responses, setResponses] = useState<Array<{
    questionId: string;
    response: any;
    timestamp: number;
    responseTime: number;
    module: string;
  }>>([]);

  const [linguisticAnalysis, setLinguisticAnalysis] = useState<{
    formalityScore: number;
    assertivenessScore: number;
    emotionScore: number;
    detailScore: number;
    wordCount: number;
    sentenceComplexity: number;
  }>({
    formalityScore: 0,
    assertivenessScore: 0,
    emotionScore: 0,
    detailScore: 0,
    wordCount: 0,
    sentenceComplexity: 0
  });

  const processResponse = useCallback((questionId: string, response: any, responseTime: number, module: string) => {
    const newResponse = {
      questionId,
      response,
      timestamp: Date.now(),
      responseTime,
      module
    };

    setResponses(prev => [...prev, newResponse]);

    // Process scores based on response type
    if (response.scores) {
      setScores(prev => {
        const newScores = { ...prev };
        
        Object.entries(response.scores).forEach(([dimension, value]) => {
          if (dimension in newScores) {
            newScores[dimension as keyof CommunicationScores] += value as number;
          }
        });
        
        return newScores;
      });
    }

    // Process linguistic analysis for written responses
    if (module === 'linguistic_analysis' && typeof response === 'string') {
      analyzeLinguisticPatterns(response);
    }
  }, []);

  const analyzeLinguisticPatterns = useCallback((text: string) => {
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Calculate formality score
    const formalWords = words.filter(word => 
      linguisticPatterns.formality.formal.includes(word)
    ).length;
    const informalWords = words.filter(word => 
      linguisticPatterns.formality.informal.includes(word)
    ).length;
    const formalityScore = (formalWords - informalWords) / words.length;

    // Calculate assertiveness score
    const assertiveWords = words.filter(word => 
      linguisticPatterns.assertiveness.high.includes(word)
    ).length;
    const passiveWords = words.filter(word => 
      linguisticPatterns.assertiveness.low.includes(word)
    ).length;
    const assertivenessScore = (assertiveWords - passiveWords) / words.length;

    // Calculate emotion score
    const emotionalWords = words.filter(word => 
      linguisticPatterns.emotion.high.includes(word)
    ).length;
    const neutralWords = words.filter(word => 
      linguisticPatterns.emotion.low.includes(word)
    ).length;
    const emotionScore = (emotionalWords - neutralWords) / words.length;

    // Calculate detail score
    const detailWords = words.filter(word => 
      linguisticPatterns.detail.high.includes(word)
    ).length;
    const generalWords = words.filter(word => 
      linguisticPatterns.detail.low.includes(word)
    ).length;
    const detailScore = (detailWords - generalWords) / words.length;

    // Calculate sentence complexity
    const avgWordsPerSentence = words.length / sentences.length;
    const sentenceComplexity = avgWordsPerSentence / 15; // Normalize to 15 words as average

    setLinguisticAnalysis({
      formalityScore,
      assertivenessScore,
      emotionScore,
      detailScore,
      wordCount: words.length,
      sentenceComplexity
    });

    // Update main scores based on linguistic analysis
    setScores(prev => ({
      ...prev,
      formality: Math.max(0, Math.min(4, prev.formality + formalityScore * 2)),
      assertiveness: Math.max(0, Math.min(4, prev.assertiveness + assertivenessScore * 2)),
      expressiveness: Math.max(0, Math.min(4, prev.expressiveness + emotionScore * 2)),
      detail_orientation: Math.max(0, Math.min(4, prev.detail_orientation + detailScore * 2))
    }));
  }, []);

  const calculateCommunicationDNA = useCallback((): CommunicationDNA => {
    const assertiveness = scores.assertiveness / 4; // Normalize to 0-1
    const responsiveness = (scores.expressiveness + scores.empathy) / 8; // Normalize to 0-1
    
    const channelMatrix = {
      faceToFace: Math.min(1, (scores.assertiveness + scores.expressiveness) / 8),
      video: Math.min(1, (scores.channel_preference + scores.expressiveness) / 8),
      written: Math.min(1, (scores.formality + scores.detail_orientation) / 8),
      informal: Math.min(1, (scores.expressiveness - scores.formality + 4) / 8)
    };

    const flexibilityScore = calculateAdaptabilityScore();
    const influenceStyle = determineInfluenceStyle();
    const teamSynergy = calculateTeamSynergy();

    return {
      assertiveness,
      responsiveness,
      channelMatrix,
      flexibilityScore,
      influenceStyle,
      teamSynergy
    };
  }, [scores]);

  const calculateAdaptabilityScore = useCallback(() => {
    // Measure how well someone adapts across different contexts
    const responseVariability = calculateResponseVariability();
    const contextualSuccess = calculateContextualSuccess();
    
    return (responseVariability + contextualSuccess) / 2;
  }, [responses]);

  const calculateResponseVariability = useCallback(() => {
    // Analyze how responses vary across different modules
    const moduleScores: Record<string, number[]> = {};
    
    responses.forEach(response => {
      if (response.response.scores) {
        if (!moduleScores[response.module]) {
          moduleScores[response.module] = [];
        }
        
        const avgScore = Object.values(response.response.scores).reduce((a: number, b: any) => a + Number(b), 0) / 
                        Object.values(response.response.scores).length;
        moduleScores[response.module].push(avgScore);
      }
    });

    // Calculate standard deviation across modules
    const moduleAverages = Object.values(moduleScores).map(scores => 
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
    
    const mean = moduleAverages.reduce((a, b) => a + b, 0) / moduleAverages.length;
    const variance = moduleAverages.reduce((sum, avg) => sum + Math.pow(avg - mean, 2), 0) / moduleAverages.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher adaptability
    return Math.max(0, 1 - standardDeviation);
  }, [responses]);

  const calculateContextualSuccess = useCallback(() => {
    // Measure success in different communication contexts
    const contextScores = {
      upward: 0, // Communication to superiors
      downward: 0, // Communication to reports
      lateral: 0, // Communication to peers
      external: 0, // Communication to clients
      conflict: 0  // Crisis communication
    };

    responses.forEach(response => {
      if (response.response.scores) {
        const avgScore = Object.values(response.response.scores).reduce((a: number, b: any) => a + Number(b), 0) / 
                        Object.values(response.response.scores).length;
        
        // Categorize based on question context
        if (response.questionId.includes('leadership') || response.questionId.includes('proposal')) {
          contextScores.upward += avgScore;
        } else if (response.questionId.includes('feedback') || response.questionId.includes('team')) {
          contextScores.downward += avgScore;
        } else if (response.questionId.includes('client') || response.questionId.includes('external')) {
          contextScores.external += avgScore;
        } else if (response.questionId.includes('conflict')) {
          contextScores.conflict += avgScore;
        } else {
          contextScores.lateral += avgScore;
        }
      }
    });

    // Calculate average success across contexts
    const contextValues = Object.values(contextScores).filter(score => score > 0);
    return contextValues.length > 0 ? 
      contextValues.reduce((a, b) => a + b, 0) / contextValues.length / 4 : 0.5;
  }, [responses]);

  const determineInfluenceStyle = useCallback(() => {
    const logicScore = scores.detail_orientation + scores.assertiveness;
    const emotionScore = scores.expressiveness + scores.empathy;
    const collaborationScore = scores.listening + scores.negotiation;
    
    const maxScore = Math.max(logicScore, emotionScore, collaborationScore);
    
    if (maxScore === logicScore) return 'Logic-driven';
    if (maxScore === emotionScore) return 'Emotion-driven';
    return 'Collaboration-driven';
  }, [scores]);

  const calculateTeamSynergy = useCallback(() => {
    // Predict team effectiveness based on communication style
    const teamFriendlyTraits = [
      scores.listening,
      scores.empathy,
      scores.negotiation,
      4 - scores.conflict // Inverse of conflict avoidance
    ];
    
    return teamFriendlyTraits.reduce((a, b) => a + b, 0) / (teamFriendlyTraits.length * 4);
  }, [scores]);

  const calculateCEI = useCallback((): CommunicationEffectivenessIndex => {
    const clarity = (scores.assertiveness + scores.detail_orientation) / 2;
    const empathy = scores.empathy;
    const adaptability = calculateAdaptabilityScore();
    const influence = scores.influence;
    
    const styleScore = (clarity * 0.25 + empathy * 0.25 + adaptability * 0.25 + influence * 0.25) / 4;
    
    const contextBonus = calculateContextualSuccess();
    const channelScore = calculateChannelEffectiveness();
    const conflictScore = scores.conflict / 4;
    
    const overall = (styleScore + contextBonus) * channelScore;
    
    return {
      overall,
      breakdown: {
        naturalStyle: styleScore,
        adaptability: contextBonus,
        channelMastery: channelScore,
        difficultConversations: conflictScore
      }
    };
  }, [scores, calculateAdaptabilityScore, calculateContextualSuccess]);

  const calculateChannelEffectiveness = useCallback(() => {
    // Measure effectiveness across different communication channels
    const channelScores = {
      faceToFace: (scores.assertiveness + scores.expressiveness) / 8,
      video: (scores.channel_preference + scores.expressiveness) / 8,
      written: (scores.formality + scores.detail_orientation) / 8,
      verbal: (scores.assertiveness + scores.listening) / 8
    };
    
    const channelValues = Object.values(channelScores);
    return channelValues.reduce((a, b) => a + b, 0) / channelValues.length;
  }, [scores]);

  const determinePrimaryProfile = useCallback(() => {
    const assertiveness = scores.assertiveness / 4;
    const responsiveness = (scores.expressiveness + scores.empathy) / 8;
    
    if (assertiveness >= 0.5 && responsiveness < 0.5) return 'director';
    if (assertiveness >= 0.5 && responsiveness >= 0.5) return 'socializer';
    if (assertiveness < 0.5 && responsiveness < 0.5) return 'thinker';
    return 'supporter';
  }, [scores]);

  const calculateTeamCompatibility = useCallback((): TeamCompatibility => {
    const myProfile = determinePrimaryProfile();
    const myAssertion = scores.assertiveness / 4;
    const myResponse = (scores.expressiveness + scores.empathy) / 8;
    
    // Calculate compatibility with each profile
    const compatibility = {
      director: calculateProfileCompatibility(myAssertion, myResponse, 0.8, 0.2),
      socializer: calculateProfileCompatibility(myAssertion, myResponse, 0.8, 0.8),
      thinker: calculateProfileCompatibility(myAssertion, myResponse, 0.2, 0.2),
      supporter: calculateProfileCompatibility(myAssertion, myResponse, 0.2, 0.8)
    };
    
    return compatibility;
  }, [scores, determinePrimaryProfile]);

  const calculateProfileCompatibility = (myAssert: number, myResp: number, theirAssert: number, theirResp: number) => {
    // Higher compatibility when there's balance (one high, one low in each dimension)
    const assertBalance = 1 - Math.abs(myAssert - theirAssert);
    const respBalance = 1 - Math.abs(myResp - theirResp);
    
    // Complementary styles work better than identical ones
    const complementary = (assertBalance + respBalance) / 2;
    
    return Math.max(0, Math.min(1, complementary));
  };

  const generateSuccessProbabilities = useCallback(() => {
    const cei = calculateCEI();
    const dna = calculateCommunicationDNA();
    
    return {
      salesConversations: Math.min(1, cei.overall * 0.78 + dna.assertiveness * 0.22),
      leadershipCommunication: Math.min(1, cei.overall * 0.81 + dna.flexibilityScore * 0.19),
      teamCollaboration: Math.min(1, cei.overall * 0.85 + dna.teamSynergy * 0.15),
      customerService: Math.min(1, cei.overall * 0.83 + scores.empathy / 4 * 0.17),
      conflictResolution: Math.min(1, cei.overall * 0.79 + scores.conflict / 4 * 0.21)
    };
  }, [calculateCEI, calculateCommunicationDNA, scores]);

  const resetScores = useCallback(() => {
    setScores({
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
    setResponses([]);
    setLinguisticAnalysis({
      formalityScore: 0,
      assertivenessScore: 0,
      emotionScore: 0,
      detailScore: 0,
      wordCount: 0,
      sentenceComplexity: 0
    });
  }, []);

  return {
    scores,
    responses,
    linguisticAnalysis,
    processResponse,
    analyzeLinguisticPatterns,
    calculateCommunicationDNA,
    calculateCEI,
    determinePrimaryProfile,
    calculateTeamCompatibility,
    generateSuccessProbabilities,
    resetScores
  };
};