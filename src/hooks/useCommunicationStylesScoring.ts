import { useState } from 'react';

export interface CommunicationStylesResults {
  overall: number;
  dimensions: {
    assertiveness: number;
    expressiveness: number;
    informationProcessing: number;
    channelPreferences: number;
    listeningPatterns: number;
    influenceStrategies: number;
    conflictCommunication: number;
  };
  profile: 'Director' | 'Socializer' | 'Thinker' | 'Supporter';
  cei: number; // Communication Effectiveness Index
  adaptability: number;
  channelMastery: number;
  conflictResolution: number;
}

export const useCommunicationStylesScoring = () => {
  const [results, setResults] = useState<CommunicationStylesResults | null>(null);

  const calculateResults = (answers: Record<string, any>): CommunicationStylesResults => {
    // Calculate dimension scores
    const dimensions = {
      assertiveness: calculateDimensionScore(answers, 'assertiveness'),
      expressiveness: calculateDimensionScore(answers, 'expressiveness'),
      informationProcessing: calculateDimensionScore(answers, 'information-processing'),
      channelPreferences: calculateDimensionScore(answers, 'channel-preferences'),
      listeningPatterns: calculateDimensionScore(answers, 'listening-patterns'),
      influenceStrategies: calculateDimensionScore(answers, 'influence-strategies'),
      conflictCommunication: calculateDimensionScore(answers, 'conflict-communication')
    };

    // Determine communication profile
    const profile = determineProfile(dimensions.assertiveness, dimensions.expressiveness);
    
    // Calculate CEI (Communication Effectiveness Index)
    const cei = calculateCEI(dimensions);
    
    // Calculate adaptability score
    const adaptability = calculateAdaptability(answers);
    
    // Calculate channel mastery
    const channelMastery = dimensions.channelPreferences;
    
    // Calculate conflict resolution capability
    const conflictResolution = dimensions.conflictCommunication;

    const overall = (
      dimensions.assertiveness * 0.2 +
      dimensions.expressiveness * 0.2 +
      dimensions.informationProcessing * 0.15 +
      dimensions.channelPreferences * 0.15 +
      dimensions.listeningPatterns * 0.1 +
      dimensions.influenceStrategies * 0.1 +
      dimensions.conflictCommunication * 0.1
    );

    const finalResults: CommunicationStylesResults = {
      overall,
      dimensions,
      profile,
      cei,
      adaptability,
      channelMastery,
      conflictResolution
    };

    setResults(finalResults);
    return finalResults;
  };

  const calculateDimensionScore = (answers: Record<string, any>, dimension: string): number => {
    const dimensionAnswers = Object.entries(answers).filter(([key, value]) => 
      key.includes(dimension) && value !== undefined
    );
    
    if (dimensionAnswers.length === 0) return 0;
    
    const totalScore = dimensionAnswers.reduce((sum, [key, value]) => {
      if (typeof value === 'string') {
        return sum + getOptionScore(value);
      }
      return sum + (value || 0);
    }, 0);
    
    return Math.min(100, (totalScore / dimensionAnswers.length) * 25);
  };

  const getOptionScore = (option: string): number => {
    // Score based on option index (0-3 becomes 1-4)
    const optionIndex = parseInt(option) || 0;
    return optionIndex + 1;
  };

  const determineProfile = (assertiveness: number, expressiveness: number): 'Director' | 'Socializer' | 'Thinker' | 'Supporter' => {
    const highAssertive = assertiveness > 50;
    const highExpressive = expressiveness > 50;
    
    if (highAssertive && !highExpressive) return 'Director';
    if (highAssertive && highExpressive) return 'Socializer';
    if (!highAssertive && !highExpressive) return 'Thinker';
    return 'Supporter';
  };

  const calculateCEI = (dimensions: any): number => {
    const clarity = (dimensions.assertiveness + dimensions.informationProcessing) / 2;
    const empathy = (dimensions.listeningPatterns + dimensions.expressiveness) / 2;
    const adaptability = dimensions.channelPreferences;
    const influence = dimensions.influenceStrategies;
    
    return (clarity * 0.25 + empathy * 0.25 + adaptability * 0.25 + influence * 0.25);
  };

  const calculateAdaptability = (answers: Record<string, any>): number => {
    // Count adaptive scenarios responses
    const adaptiveAnswers = Object.entries(answers).filter(([key]) => 
      key.includes('adaptive-scenarios')
    );
    
    if (adaptiveAnswers.length === 0) return 0;
    
    const adaptabilityScore = adaptiveAnswers.reduce((sum, [key, value]) => {
      return sum + getOptionScore(value);
    }, 0);
    
    return Math.min(100, (adaptabilityScore / adaptiveAnswers.length) * 25);
  };

  return {
    results,
    calculateResults
  };
};