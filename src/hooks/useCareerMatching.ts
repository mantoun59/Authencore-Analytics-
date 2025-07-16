import { useState, useCallback } from 'react';
import { careerCards } from '@/data/assessmentQuestions';
import type { AssessmentResults } from './useScoring';

export interface CareerMatch {
  career: typeof careerCards[0];
  matchPercentage: number;
  fitScore: number;
  readinessLevel: 'Not Ready' | 'Entry Level' | 'Qualified' | 'Highly Qualified';
  skillGaps: string[];
  strengthAlignment: string[];
  salaryExpectation: string;
  growthPotential: string;
  developmentPath: string[];
}

export const useCareerMatching = () => {
  const [matches, setMatches] = useState<CareerMatch[]>([]);

  const calculateCareerMatches = useCallback((
    assessmentResults: AssessmentResults,
    careerSwipes: any[],
    rapidFireResponses: any[]
  ) => {
    // Analyze career preferences from swipes
    const likedCategories = careerSwipes
      .filter(swipe => swipe.action === 'like')
      .map(swipe => swipe.category);
    
    const categoryPreference: Record<string, number> = {};
    likedCategories.forEach(category => {
      categoryPreference[category] = (categoryPreference[category] || 0) + 1;
    });

    // Analyze work preferences from rapid fire
    const workPreferences = analyzeWorkPreferences(rapidFireResponses);

    // Calculate matches for each career
    const careerMatches = careerCards.map(career => {
      const match = calculateIndividualMatch(
        career,
        assessmentResults,
        categoryPreference,
        workPreferences
      );
      return match;
    });

    // Sort by match percentage and return top matches
    const sortedMatches = careerMatches
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 8); // Top 8 matches

    setMatches(sortedMatches);
    return sortedMatches;
  }, []);

  const analyzeWorkPreferences = (rapidFireResponses: any[]) => {
    const preferences: Record<string, string> = {};
    
    rapidFireResponses.forEach(response => {
      const question = response.question || response.dimension;
      let preference = '';
      
      switch (response.dimension) {
        case 'collaboration_preference':
          preference = response.choice === 'A' ? 'individual' : 'team';
          break;
        case 'leadership_preference':
          preference = response.choice === 'A' ? 'leadership' : 'support';
          break;
        case 'risk_tolerance':
          preference = response.choice === 'A' ? 'high_risk' : 'low_risk';
          break;
        case 'structure_preference':
          preference = response.choice === 'A' ? 'structured' : 'flexible';
          break;
        case 'innovation_style':
          preference = response.choice === 'A' ? 'innovation' : 'improvement';
          break;
        case 'company_size_preference':
          preference = response.choice === 'A' ? 'startup' : 'corporate';
          break;
        case 'work_environment':
          preference = response.choice === 'A' ? 'office' : 'remote';
          break;
        default:
          preference = response.choice === 'A' ? 'option_a' : 'option_b';
      }
      
      preferences[response.dimension] = preference;
    });

    return preferences;
  };

  const calculateIndividualMatch = (
    career: typeof careerCards[0],
    assessmentResults: AssessmentResults,
    categoryPreference: Record<string, number>,
    workPreferences: Record<string, string>
  ): CareerMatch => {
    let matchScore = 0;
    let maxScore = 0;

    // 1. Category Interest Match (25%)
    const categoryScore = (categoryPreference[career.category] || 0) * 25;
    matchScore += Math.min(categoryScore, 25);
    maxScore += 25;

    // 2. Skills Readiness Match (30%)
    const skillsReadiness = assessmentResults.dimensions.skill_readiness.score;
    const skillsMatch = (skillsReadiness / 100) * 30;
    matchScore += skillsMatch;
    maxScore += 30;

    // 3. Work Style Alignment (20%)
    const workStyleScore = calculateWorkStyleAlignment(career, workPreferences);
    matchScore += workStyleScore * 20;
    maxScore += 20;

    // 4. Competency Alignment (25%)
    const competencyScore = calculateCompetencyAlignment(career, assessmentResults);
    matchScore += competencyScore * 25;
    maxScore += 25;

    const matchPercentage = Math.round((matchScore / maxScore) * 100);

    // Calculate readiness level
    const readinessLevel = calculateReadinessLevel(assessmentResults, career);

    // Identify skill gaps and strengths
    const { skillGaps, strengthAlignment } = analyzeSkillAlignment(career, assessmentResults);

    // Generate development path
    const developmentPath = generateDevelopmentPath(career, assessmentResults, skillGaps);

    return {
      career,
      matchPercentage,
      fitScore: Math.round(matchScore),
      readinessLevel,
      skillGaps,
      strengthAlignment,
      salaryExpectation: adjustSalaryExpectation(career.salaryRange, assessmentResults),
      growthPotential: career.growth,
      developmentPath
    };
  };

  const calculateWorkStyleAlignment = (
    career: typeof careerCards[0],
    workPreferences: Record<string, string>
  ): number => {
    let alignmentScore = 0;
    let factors = 0;

    // Define work style requirements for different career types
    const careerWorkStyles: Record<string, Record<string, string>> = {
      'stem': {
        collaboration_preference: 'team',
        structure_preference: 'structured',
        innovation_style: 'innovation'
      },
      'business': {
        leadership_preference: 'leadership',
        collaboration_preference: 'team',
        risk_tolerance: 'balanced'
      },
      'creative_tech': {
        innovation_style: 'innovation',
        structure_preference: 'flexible',
        collaboration_preference: 'team'
      },
      'social_impact': {
        collaboration_preference: 'team',
        leadership_preference: 'leadership',
        risk_tolerance: 'low_risk'
      }
    };

    const expectedStyles = careerWorkStyles[career.category] || {};

    Object.entries(expectedStyles).forEach(([dimension, expectedValue]) => {
      if (workPreferences[dimension]) {
        factors++;
        if (workPreferences[dimension] === expectedValue) {
          alignmentScore++;
        } else if (expectedValue === 'balanced') {
          alignmentScore += 0.5; // Partial credit for balanced requirements
        }
      }
    });

    return factors > 0 ? alignmentScore / factors : 0.5;
  };

  const calculateCompetencyAlignment = (
    career: typeof careerCards[0],
    assessmentResults: AssessmentResults
  ): number => {
    // Define competency requirements for different careers
    const competencyWeights: Record<string, Record<string, number>> = {
      'Data Scientist': {
        problem_solving: 0.3,
        skill_readiness: 0.3,
        adaptability: 0.2,
        communication_skills: 0.2
      },
      'UX Designer': {
        problem_solving: 0.25,
        communication_skills: 0.3,
        adaptability: 0.25,
        growth_mindset: 0.2
      },
      'Product Manager': {
        leadership_potential: 0.3,
        communication_skills: 0.25,
        problem_solving: 0.25,
        adaptability: 0.2
      },
      'Digital Marketing Specialist': {
        communication_skills: 0.3,
        adaptability: 0.25,
        problem_solving: 0.25,
        growth_mindset: 0.2
      }
    };

    const weights = competencyWeights[career.title] || {
      skill_readiness: 0.4,
      problem_solving: 0.3,
      communication_skills: 0.3
    };

    let weightedScore = 0;
    Object.entries(weights).forEach(([competency, weight]) => {
      const dimension = assessmentResults.dimensions[competency as keyof typeof assessmentResults.dimensions];
      if (dimension) {
        weightedScore += (dimension.score / 100) * weight;
      }
    });

    return weightedScore;
  };

  const calculateReadinessLevel = (
    assessmentResults: AssessmentResults,
    career: typeof careerCards[0]
  ): CareerMatch['readinessLevel'] => {
    const overallScore = assessmentResults.overallScore;
    const skillsScore = assessmentResults.dimensions.skill_readiness.score;

    // Consider career complexity
    const complexityCareers = ['AI Research Scientist', 'Data Scientist', 'Product Manager'];
    const isComplex = complexityCareers.includes(career.title);

    const threshold = isComplex ? 10 : 0; // Higher threshold for complex careers

    if (overallScore >= 85 + threshold && skillsScore >= 80) return 'Highly Qualified';
    if (overallScore >= 70 + threshold && skillsScore >= 65) return 'Qualified';
    if (overallScore >= 55 + threshold && skillsScore >= 50) return 'Entry Level';
    return 'Not Ready';
  };

  const analyzeSkillAlignment = (
    career: typeof careerCards[0],
    assessmentResults: AssessmentResults
  ) => {
    const careerSkills = career.skills || [];
    const userStrengths = assessmentResults.careerReadiness.strengths;
    const userWeaknesses = assessmentResults.careerReadiness.developmentAreas;

    // Map assessment dimensions to skill categories
    const skillMapping: Record<string, string[]> = {
      'Technical Skills': ['Programming', 'Analytics', 'Data Analysis', 'SQL', 'Python'],
      'Communication': ['Communication', 'Presentation', 'Writing'],
      'Leadership': ['Leadership', 'Management', 'Team Building'],
      'Problem Solving': ['Problem Solving', 'Critical Thinking', 'Analysis'],
      'Creativity': ['Design Thinking', 'Innovation', 'Creativity']
    };

    const strengthAlignment: string[] = [];
    const skillGaps: string[] = [];

    careerSkills.forEach(skill => {
      let hasStrength = false;
      
      Object.entries(skillMapping).forEach(([category, skills]) => {
        if (skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) {
          if (userStrengths.some(strength => 
            strength.toLowerCase().includes(category.toLowerCase()))) {
            strengthAlignment.push(skill);
            hasStrength = true;
          }
        }
      });

      if (!hasStrength) {
        skillGaps.push(skill);
      }
    });

    return { skillGaps, strengthAlignment };
  };

  const generateDevelopmentPath = (
    career: typeof careerCards[0],
    assessmentResults: AssessmentResults,
    skillGaps: string[]
  ): string[] => {
    const path: string[] = [];
    
    // Always start with foundation if overall score is low
    if (assessmentResults.overallScore < 60) {
      path.push('Build foundational workplace skills');
    }

    // Add skill-specific development
    if (skillGaps.length > 0) {
      path.push(`Develop ${skillGaps.slice(0, 2).join(' and ')} skills`);
    }

    // Add experience recommendations
    if (assessmentResults.careerReadiness.level === 'Not Ready' || 
        assessmentResults.careerReadiness.level === 'Developing') {
      path.push('Gain relevant internship or project experience');
    }

    // Add networking and industry knowledge
    path.push(`Learn about ${career.category} industry trends`);
    
    // Add advanced development for higher readiness levels
    if (assessmentResults.careerReadiness.level === 'Ready' || 
        assessmentResults.careerReadiness.level === 'Highly Ready') {
      path.push('Build professional network in target field');
      path.push('Pursue advanced certifications or specializations');
    }

    return path;
  };

  const adjustSalaryExpectation = (
    baseSalary: string,
    assessmentResults: AssessmentResults
  ): string => {
    // Extract numbers from salary range
    const numbers = baseSalary.match(/\d+,?\d*/g);
    if (!numbers || numbers.length < 2) return baseSalary;

    const minSalary = parseInt(numbers[0].replace(',', ''));
    const maxSalary = parseInt(numbers[1].replace(',', ''));

    // Adjust based on readiness level
    let adjustmentFactor = 1;
    switch (assessmentResults.careerReadiness.level) {
      case 'Not Ready':
        adjustmentFactor = 0.7;
        break;
      case 'Developing':
        adjustmentFactor = 0.8;
        break;
      case 'Ready':
        adjustmentFactor = 0.9;
        break;
      case 'Highly Ready':
        adjustmentFactor = 1.0;
        break;
    }

    const adjustedMin = Math.round(minSalary * adjustmentFactor);
    const adjustedMax = Math.round(maxSalary * adjustmentFactor);

    return `$${adjustedMin.toLocaleString()} - $${adjustedMax.toLocaleString()}`;
  };

  return {
    matches,
    calculateCareerMatches
  };
};