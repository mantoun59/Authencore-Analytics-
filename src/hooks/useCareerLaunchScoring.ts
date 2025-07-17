import { useState } from 'react';

interface AnswerItem {
  id: string;
  category: 'interest' | 'aptitude' | 'personality' | 'value';
  dimension: string;
  score: number;
}

interface AptitudeScore {
  name: string;
  score: number;
}

interface CareerLaunchResult {
  interests: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  aptitudes: AptitudeScore[];
  personality: {
    introversion: number;
    openness: number;
    conscientiousness: number;
    adaptability: number;
  };
  values: {
    security: number;
    achievement: number;
    creativity: number;
    community: number;
  };
  flags: {
    misalignment: string[];
  };
  career_fit: {
    label: string;
    suggestions: string[];
  };
  action_plan: string[];
}

export const useCareerLaunchScoring = () => {
  const [result, setResult] = useState<CareerLaunchResult | null>(null);

  const calculateScores = (answers: AnswerItem[]): CareerLaunchResult => {
    // Initialize score accumulators
    const interestTotals = {
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0
    };

    const aptitudeTotals = {
      verbal: 0,
      numerical: 0,
      abstract: 0,
      memory: 0
    };

    const personalityTotals = {
      introversion: 0,
      openness: 0,
      conscientiousness: 0,
      adaptability: 0
    };

    const valueTotals = {
      security: 0,
      achievement: 0,
      creativity: 0,
      community: 0
    };

    const counts = {
      interests: { realistic: 0, investigative: 0, artistic: 0, social: 0, enterprising: 0, conventional: 0 },
      aptitudes: { verbal: 0, numerical: 0, abstract: 0, memory: 0 },
      personality: { introversion: 0, openness: 0, conscientiousness: 0, adaptability: 0 },
      values: { security: 0, achievement: 0, creativity: 0, community: 0 }
    };

    // Process answers with error handling
    answers.forEach(answer => {
      if (answer.category === 'interest' && answer.dimension in interestTotals) {
        interestTotals[answer.dimension as keyof typeof interestTotals] += answer.score;
        counts.interests[answer.dimension as keyof typeof counts.interests]++;
      } else if (answer.category === 'aptitude' && answer.dimension in aptitudeTotals) {
        aptitudeTotals[answer.dimension as keyof typeof aptitudeTotals] += answer.score;
        counts.aptitudes[answer.dimension as keyof typeof counts.aptitudes]++;
      } else if (answer.category === 'personality' && answer.dimension in personalityTotals) {
        personalityTotals[answer.dimension as keyof typeof personalityTotals] += answer.score;
        counts.personality[answer.dimension as keyof typeof counts.personality]++;
      } else if (answer.category === 'value' && answer.dimension in valueTotals) {
        valueTotals[answer.dimension as keyof typeof valueTotals] += answer.score;
        counts.values[answer.dimension as keyof typeof counts.values]++;
      } else {
        console.warn(`Unmapped dimension: ${answer.dimension} in category: ${answer.category}`);
      }
    });

    // Calculate normalized scores (0-100)
    const interests = {
      realistic: Math.round((interestTotals.realistic / Math.max(counts.interests.realistic || 1, 1)) * 100),
      investigative: Math.round((interestTotals.investigative / Math.max(counts.interests.investigative || 1, 1)) * 100),
      artistic: Math.round((interestTotals.artistic / Math.max(counts.interests.artistic || 1, 1)) * 100),
      social: Math.round((interestTotals.social / Math.max(counts.interests.social || 1, 1)) * 100),
      enterprising: Math.round((interestTotals.enterprising / Math.max(counts.interests.enterprising || 1, 1)) * 100),
      conventional: Math.round((interestTotals.conventional / Math.max(counts.interests.conventional || 1, 1)) * 100)
    };

    const aptitudes: AptitudeScore[] = [
      { name: "Verbal Reasoning", score: Math.round((aptitudeTotals.verbal / Math.max(counts.aptitudes.verbal || 1, 1)) * 100) },
      { name: "Numerical Reasoning", score: Math.round((aptitudeTotals.numerical / Math.max(counts.aptitudes.numerical || 1, 1)) * 100) },
      { name: "Abstract Logic", score: Math.round((aptitudeTotals.abstract / Math.max(counts.aptitudes.abstract || 1, 1)) * 100) },
      { name: "Memory/Attention", score: Math.round((aptitudeTotals.memory / Math.max(counts.aptitudes.memory || 1, 1)) * 100) }
    ].sort((a, b) => b.score - a.score);

    const personality = {
      introversion: Math.round((personalityTotals.introversion / Math.max(counts.personality.introversion || 1, 1)) * 100),
      openness: Math.round((personalityTotals.openness / Math.max(counts.personality.openness || 1, 1)) * 100),
      conscientiousness: Math.round((personalityTotals.conscientiousness / Math.max(counts.personality.conscientiousness || 1, 1)) * 100),
      adaptability: Math.round((personalityTotals.adaptability / Math.max(counts.personality.adaptability || 1, 1)) * 100)
    };

    const values = {
      security: Math.round((valueTotals.security / Math.max(counts.values.security || 1, 1)) * 100),
      achievement: Math.round((valueTotals.achievement / Math.max(counts.values.achievement || 1, 1)) * 100),
      creativity: Math.round((valueTotals.creativity / Math.max(counts.values.creativity || 1, 1)) * 100),
      community: Math.round((valueTotals.community / Math.max(counts.values.community || 1, 1)) * 100)
    };

    // Generate misalignment flags
    const flags: string[] = [];
    
    if (interests.artistic > 70 && values.security < 40) {
      flags.push("High Artistic interest + Low Security value — explore creative careers with stable options.");
    }
    
    if (personality.conscientiousness < 50) {
      flags.push("Low Conscientiousness may affect structured roles like Accounting or Law.");
    }
    
    if (interests.enterprising > 70 && personality.introversion > 60) {
      flags.push("High Enterprising interest but Introverted personality — consider leadership roles in smaller teams.");
    }
    
    if (values.creativity > 70 && interests.conventional > 60) {
      flags.push("High Creativity value but Conventional interests — explore innovative roles within structured environments.");
    }

    // Generate career fit profile
    const topInterest = Object.entries(interests).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const topAptitude = aptitudes[0].name.toLowerCase();
    
    let careerLabel = "Balanced Professional";
    let suggestions: string[] = ["Consultant", "Project Manager", "Analyst"];

    if (topInterest === 'investigative' && topAptitude.includes('abstract')) {
      careerLabel = "Strategic Creative Thinker";
      suggestions = ["Content Strategist", "Research Analyst", "UX Designer"];
    } else if (topInterest === 'artistic' && values.creativity > 70) {
      careerLabel = "Creative Innovator";
      suggestions = ["Graphic Designer", "Marketing Creative", "Art Director"];
    } else if (topInterest === 'social' && personality.openness > 70) {
      careerLabel = "People-Focused Leader";
      suggestions = ["HR Manager", "Counselor", "Training Specialist"];
    } else if (topInterest === 'enterprising' && aptitudes[0].name.includes('Verbal')) {
      careerLabel = "Strategic Communicator";
      suggestions = ["Sales Manager", "Business Development", "Marketing Manager"];
    } else if (topInterest === 'realistic' && aptitudes[0].name.includes('Numerical')) {
      careerLabel = "Technical Problem Solver";
      suggestions = ["Engineer", "Data Analyst", "IT Specialist"];
    } else if (topInterest === 'conventional' && personality.conscientiousness > 70) {
      careerLabel = "Systematic Organizer";
      suggestions = ["Accountant", "Operations Manager", "Financial Analyst"];
    }

    // Generate action plan
    const actionPlan: string[] = [];
    
    if (aptitudes[0].score > 75) {
      actionPlan.push(`Leverage your strength in ${aptitudes[0].name.toLowerCase()} through specialized training or certification.`);
    }
    
    if (personality.openness > 70) {
      actionPlan.push("Consider internships in creative or analytical industries to explore diverse career paths.");
    }
    
    if (values.achievement > 70) {
      actionPlan.push("Seek opportunities with clear advancement paths and performance recognition.");
    }
    
    if (personality.conscientiousness < 60) {
      actionPlan.push("Work on building routines and organizational skills to improve performance consistency.");
    }
    
    if (actionPlan.length === 0) {
      actionPlan.push("Explore informational interviews in your areas of interest to gain real-world insights.");
    }

    const newResult: CareerLaunchResult = {
      interests,
      aptitudes,
      personality,
      values,
      flags: { misalignment: flags },
      career_fit: {
        label: careerLabel,
        suggestions
      },
      action_plan: actionPlan
    };

    setResult(newResult);
    return newResult;
  };

  return {
    result,
    calculateScores,
    setResult
  };
};