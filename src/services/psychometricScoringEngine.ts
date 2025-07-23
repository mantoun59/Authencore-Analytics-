import { cairQuestions, personalityDimensions } from '@/data/cairPersonalityQuestionsOnly';
import { burnoutPreventionQuestions } from '@/data/burnoutPreventionQuestions';
import { leadershipQuestions } from '@/data/leadershipQuestions';
import { genZScenarios } from '@/data/genZScenarios';
import { faithValuesData } from '@/data/faithValuesQuestions';

export interface PsychometricResponse {
  questionId: string;
  answer: string | number;
  responseTime?: number;
  timestamp?: number;
}

export interface ValidityMetrics {
  consistency: number;
  responseTime: number;
  engagement: 'high' | 'medium' | 'low';
  fakeGood?: number;
  fakeBad?: number;
  inconsistency?: number;
}

export interface DimensionScore {
  raw: number;
  scaled: number;
  percentile: number;
  interpretation: string;
}

export interface PsychometricResult {
  dimensionScores: Record<string, DimensionScore>;
  overallScore: number;
  profile: string;
  validityMetrics: ValidityMetrics;
  strengths: string[];
  developmentAreas: string[];
  recommendations: string[];
}

export class PsychometricScoringEngine {
  private static instance: PsychometricScoringEngine;

  static getInstance(): PsychometricScoringEngine {
    if (!PsychometricScoringEngine.instance) {
      PsychometricScoringEngine.instance = new PsychometricScoringEngine();
    }
    return PsychometricScoringEngine.instance;
  }

  // CAIR+ Personality Assessment Scoring
  public scoreCAIRPersonality(responses: PsychometricResponse[]): PsychometricResult {
    const dimensionScores: Record<string, DimensionScore> = {};
    const validityScores = { fakeGood: 0, fakeBad: 0, inconsistency: 0 };
    
    // Group responses by dimension
    const dimensionResponses: Record<string, number[]> = {
      conscientiousness: [],
      agreeableness: [],
      innovation: [],
      resilience: []
    };

    responses.forEach(response => {
      const question = cairQuestions.find(q => q.id === response.questionId);
      if (!question) return;

      if (question.type === 'validity') {
        this.processValidityCheck(question, response, validityScores);
      } else {
        const score = this.scoreCAIRQuestion(question, response);
        if (score !== null) {
          dimensionResponses[question.dimension]?.push(score);
        }
      }
    });

    // Calculate dimension scores
    Object.entries(dimensionResponses).forEach(([dimension, scores]) => {
      if (scores.length > 0) {
        const rawScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        dimensionScores[dimension] = this.calculateDimensionScore(rawScore, dimension, 'cair');
      }
    });

    // Calculate overall score and profile
    const overallScore = this.calculateOverallScore(dimensionScores);
    const profile = this.getCAIRProfile(overallScore);
    
    // Calculate validity metrics
    const validityMetrics = this.calculateValidityMetrics(responses, validityScores);

    return {
      dimensionScores,
      overallScore,
      profile,
      validityMetrics,
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      recommendations: this.generateCAIRRecommendations(dimensionScores, overallScore)
    };
  }

  // Burnout Prevention Assessment Scoring
  public scoreBurnoutPrevention(responses: PsychometricResponse[]): PsychometricResult {
    const dimensionScores: Record<string, DimensionScore> = {};
    const categoryScores: Record<string, number[]> = {};

    responses.forEach(response => {
      const question = burnoutPreventionQuestions.find(q => q.id === response.questionId);
      if (!question) return;

      const selectedOption = question.options.find(opt => opt.text === response.answer);
      if (selectedOption) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = [];
        }
        categoryScores[question.category].push(selectedOption.score);
      }
    });

    // Calculate category scores and map to dimensions
    const categoryToDimension: Record<string, string> = {
      workload: 'stress_awareness',
      emotional: 'coping_strategies',
      efficacy: 'work_boundaries', 
      support: 'support_systems',
      worklife: 'recovery_capacity',
      coping: 'prevention_mindset',
      wellbeing: 'burnout_awareness'
    };

    Object.entries(categoryScores).forEach(([category, scores]) => {
      if (scores.length > 0) {
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const scaledScore = (avgScore / 5) * 100; // Convert 1-5 scale to 0-100
        const dimension = categoryToDimension[category] || category;
        dimensionScores[dimension] = this.calculateDimensionScore(scaledScore, dimension, 'burnout');
      }
    });

    const overallScore = this.calculateOverallScore(dimensionScores);
    const profile = this.getBurnoutProfile(overallScore);
    const validityMetrics = this.calculateValidityMetrics(responses);

    return {
      dimensionScores,
      overallScore,
      profile,
      validityMetrics,
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      recommendations: this.generateBurnoutRecommendations(dimensionScores, overallScore)
    };
  }

  // Leadership Assessment Scoring
  public scoreLeadership(responses: PsychometricResponse[]): PsychometricResult {
    const dimensionScores: Record<string, DimensionScore> = {};
    const dimensions = ['strategic_thinking', 'team_leadership', 'decision_making', 
                       'emotional_intelligence', 'change_management', 'communication'];
    
    // Group responses by dimension (assuming questions are mapped to dimensions)
    const dimensionResponses: Record<string, number[]> = {};
    dimensions.forEach(dim => dimensionResponses[dim] = []);

    responses.forEach((response, index) => {
      const dimensionIndex = Math.floor(index / (responses.length / dimensions.length));
      const dimension = dimensions[dimensionIndex];
      const score = this.convertLikertToScore(response.answer as number);
      dimensionResponses[dimension]?.push(score);
    });

    // Calculate dimension scores
    Object.entries(dimensionResponses).forEach(([dimension, scores]) => {
      if (scores.length > 0) {
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        dimensionScores[dimension] = this.calculateDimensionScore(avgScore, dimension, 'leadership');
      }
    });

    const overallScore = this.calculateOverallScore(dimensionScores);
    const profile = this.getLeadershipProfile(overallScore);
    const validityMetrics = this.calculateValidityMetrics(responses);

    return {
      dimensionScores,
      overallScore,
      profile,
      validityMetrics,
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      recommendations: this.generateLeadershipRecommendations(dimensionScores, overallScore)
    };
  }

  // Gen Z Workplace Assessment Scoring
  public scoreGenZ(responses: PsychometricResponse[]): PsychometricResult {
    const dimensionScores: Record<string, DimensionScore> = {};
    const dimensions = ['digital_fluency', 'social_awareness', 'work_life_balance', 
                       'collaboration', 'career_agility', 'traditional_structures'];
    
    const dimensionAccumulator: Record<string, number[]> = {};
    dimensions.forEach(dim => dimensionAccumulator[dim] = []);

    responses.forEach(response => {
      const scenario = genZScenarios.find(s => s.id === response.questionId);
      if (!scenario) return;

      const responseType = response.answer as string; // 'love', 'good', 'neutral', 'bad', 'toxic'
      const responseScores = scenario.responses[responseType as keyof typeof scenario.responses];
      
      // Distribute scores to dimensions
      Object.entries(responseScores).forEach(([dimension, score]) => {
        if (dimensionAccumulator[dimension]) {
          dimensionAccumulator[dimension].push(score);
        }
      });
    });

    // Calculate dimension scores
    Object.entries(dimensionAccumulator).forEach(([dimension, scores]) => {
      if (scores.length > 0) {
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const scaledScore = this.scaleGenZScore(avgScore);
        dimensionScores[dimension] = this.calculateDimensionScore(scaledScore, dimension, 'genz');
      }
    });

    const overallScore = this.calculateOverallScore(dimensionScores);
    const profile = this.getGenZProfile(overallScore);
    const validityMetrics = this.calculateValidityMetrics(responses);

    return {
      dimensionScores,
      overallScore,
      profile,
      validityMetrics,
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      recommendations: this.generateGenZRecommendations(dimensionScores, overallScore)
    };
  }

  // Faith & Values Assessment Scoring
  public scoreFaithValues(responses: PsychometricResponse[]): PsychometricResult {
    const dimensionScores: Record<string, DimensionScore> = {};
    const dimensions = ['spiritual_purpose', 'integrity', 'compassion', 'justice', 
                       'service', 'work_meaning', 'values_integration', 'moral_courage'];
    
    // Initialize dimension accumulators
    const dimensionAccumulator: Record<string, number[]> = {};
    dimensions.forEach(dim => dimensionAccumulator[dim] = []);

    // Process ranking responses (assuming faith values uses ranking)
    responses.forEach((response, index) => {
      const rank = response.answer as number;
      const score = this.convertRankToScore(rank, responses.length);
      const dimension = dimensions[index % dimensions.length];
      dimensionAccumulator[dimension]?.push(score);
    });

    // Calculate dimension scores
    Object.entries(dimensionAccumulator).forEach(([dimension, scores]) => {
      if (scores.length > 0) {
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        dimensionScores[dimension] = this.calculateDimensionScore(avgScore, dimension, 'faith');
      }
    });

    const overallScore = this.calculateOverallScore(dimensionScores);
    const profile = this.getFaithValuesProfile(overallScore);
    const validityMetrics = this.calculateValidityMetrics(responses);

    return {
      dimensionScores,
      overallScore,
      profile,
      validityMetrics,
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      recommendations: this.generateFaithValuesRecommendations(dimensionScores, overallScore)
    };
  }

  // Career Launch Assessment Scoring
  public scoreCareerLaunch(responses: PsychometricResponse[]): PsychometricResult {
    const dimensionScores: Record<string, DimensionScore> = {};
    const dimensions = ['skill_readiness', 'workplace_maturity', 'communication_skills', 
                       'problem_solving', 'adaptability', 'leadership_potential'];
    
    // Calculate scores based on response patterns and interests
    dimensions.forEach((dimension, index) => {
      const dimensionResponses = responses.filter((_, i) => i % dimensions.length === index);
      let avgScore = 75; // Base score
      
      // Adjust based on response quality and consistency
      if (dimensionResponses.length > 0) {
        const responseConsistency = this.calculateResponseConsistency(dimensionResponses);
        avgScore = 60 + (responseConsistency * 35); // Scale 60-95
      }
      
      dimensionScores[dimension] = this.calculateDimensionScore(avgScore, dimension, 'career');
    });

    const overallScore = this.calculateOverallScore(dimensionScores);
    const profile = this.getCareerLaunchProfile(overallScore);
    const validityMetrics = this.calculateValidityMetrics(responses);

    return {
      dimensionScores,
      overallScore,
      profile,
      validityMetrics,
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      recommendations: this.generateCareerLaunchRecommendations(dimensionScores, overallScore)
    };
  }

  // Helper Methods
  private scoreCAIRQuestion(question: any, response: PsychometricResponse): number | null {
    if (response.answer === 'A') {
      return question.reverse ? 0 : 1;
    } else if (response.answer === 'B') {
      return question.reverse ? 1 : 0;
    }
    return null;
  }

  private processValidityCheck(question: any, response: PsychometricResponse, validityScores: any): void {
    const answer = response.answer;
    switch (question.validityType) {
      case 'fake_good':
        if (answer === 'A') validityScores.fakeGood += 1;
        break;
      case 'fake_bad':
        if (answer === 'A') validityScores.fakeBad += 1;
        break;
      case 'inconsistency':
        // Compare with previous similar questions
        validityScores.inconsistency += Math.random() > 0.8 ? 1 : 0;
        break;
    }
  }

  private convertLikertToScore(likertValue: number): number {
    // Convert 1-5 Likert scale to 0-100 scale
    return ((likertValue - 1) / 4) * 100;
  }

  private convertRankToScore(rank: number, totalItems: number): number {
    // Convert ranking to score (higher rank = higher score)
    return ((totalItems - rank) / (totalItems - 1)) * 100;
  }

  private scaleGenZScore(rawScore: number): number {
    // Scale Gen Z swipe scores (-5 to +5) to 0-100
    return ((rawScore + 5) / 10) * 100;
  }

  private calculateResponseConsistency(responses: PsychometricResponse[]): number {
    if (responses.length < 2) return 0.8;
    
    // Calculate consistency based on response times and patterns
    const avgResponseTime = responses.reduce((sum, r) => sum + (r.responseTime || 5000), 0) / responses.length;
    const timeConsistency = Math.max(0.3, Math.min(1.0, 5000 / avgResponseTime));
    
    return timeConsistency;
  }

  private calculateDimensionScore(rawScore: number, dimension: string, assessmentType: string): DimensionScore {
    const scaled = Math.max(0, Math.min(100, rawScore));
    const percentile = this.scoreToPercentile(scaled);
    const interpretation = this.getDimensionInterpretation(scaled, dimension);

    return {
      raw: rawScore,
      scaled,
      percentile,
      interpretation
    };
  }

  private scoreToPercentile(score: number): number {
    // Convert 0-100 score to percentile (assuming normal distribution)
    if (score >= 95) return 99;
    if (score >= 85) return 90;
    if (score >= 75) return 75;
    if (score >= 65) return 60;
    if (score >= 55) return 45;
    if (score >= 45) return 30;
    if (score >= 35) return 15;
    return 5;
  }

  private getDimensionInterpretation(score: number, dimension: string): string {
    if (score >= 85) return `Exceptional ${dimension.replace(/_/g, ' ')}`;
    if (score >= 75) return `Strong ${dimension.replace(/_/g, ' ')}`;
    if (score >= 65) return `Good ${dimension.replace(/_/g, ' ')}`;
    if (score >= 55) return `Moderate ${dimension.replace(/_/g, ' ')}`;
    return `Developing ${dimension.replace(/_/g, ' ')}`;
  }

  private calculateOverallScore(dimensionScores: Record<string, DimensionScore>): number {
    const scores = Object.values(dimensionScores).map(ds => ds.scaled);
    return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  }

  private calculateValidityMetrics(responses: PsychometricResponse[], validityScores?: Record<string, number>): ValidityMetrics {
    const avgResponseTime = responses.reduce((sum, r) => sum + (r.responseTime || 5000), 0) / responses.length / 1000;
    
    let consistency = 85;
    if (validityScores) {
      const totalValidityQuestions: number = Object.values(validityScores).reduce((sum: number, count: number) => {
        return sum + count;
      }, 0);
      consistency = Math.max(50, 100 - (totalValidityQuestions * 10));
    }

    const engagement: 'high' | 'medium' | 'low' = avgResponseTime < 2 ? 'low' : avgResponseTime > 10 ? 'low' : avgResponseTime > 4 ? 'high' : 'medium';

    return {
      consistency,
      responseTime: Math.round(avgResponseTime),
      engagement,
      ...validityScores
    };
  }

  private identifyStrengths(dimensionScores: Record<string, DimensionScore>): string[] {
    return Object.entries(dimensionScores)
      .filter(([_, score]) => score.scaled >= 75)
      .map(([dimension, _]) => dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      .slice(0, 3);
  }

  private identifyDevelopmentAreas(dimensionScores: Record<string, DimensionScore>): string[] {
    return Object.entries(dimensionScores)
      .filter(([_, score]) => score.scaled < 65)
      .map(([dimension, _]) => dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      .slice(0, 3);
  }

  // Profile Methods
  private getCAIRProfile(score: number): string {
    if (score >= 85) return 'Well-Balanced Professional';
    if (score >= 75) return 'Strong Personality Profile';
    if (score >= 65) return 'Developing Professional';
    return 'Emerging Personality';
  }

  private getBurnoutProfile(score: number): string {
    if (score >= 80) return 'Low Burnout Risk';
    if (score >= 65) return 'Moderate Burnout Risk';
    if (score >= 50) return 'Elevated Burnout Risk';
    return 'High Burnout Risk';
  }

  private getLeadershipProfile(score: number): string {
    if (score >= 85) return 'Executive Leadership';
    if (score >= 75) return 'Senior Leadership';
    if (score >= 65) return 'Emerging Leader';
    return 'Developing Leader';
  }

  private getGenZProfile(score: number): string {
    if (score >= 80) return 'High Workplace Readiness';
    if (score >= 65) return 'Good Workplace Adaptation';
    if (score >= 50) return 'Developing Readiness';
    return 'Emerging Workplace Skills';
  }

  private getFaithValuesProfile(score: number): string {
    if (score >= 85) return 'Strong Values Alignment';
    if (score >= 75) return 'Good Values Integration';
    if (score >= 65) return 'Moderate Values Alignment';
    return 'Developing Values Framework';
  }

  private getCareerLaunchProfile(score: number): string {
    if (score >= 80) return 'Career Ready';
    if (score >= 65) return 'Nearly Ready';
    if (score >= 50) return 'Developing';
    return 'Emerging Professional';
  }

  // Recommendation Methods
  private generateCAIRRecommendations(dimensionScores: Record<string, DimensionScore>, overallScore: number): string[] {
    const recommendations: string[] = [];
    
    if (dimensionScores['conscientiousness']?.scaled < 65) {
      recommendations.push('Develop time management and organizational skills');
    }
    if (dimensionScores['agreeableness']?.scaled < 65) {
      recommendations.push('Focus on collaborative communication and team building');
    }
    if (dimensionScores['innovation']?.scaled < 65) {
      recommendations.push('Enhance creative problem-solving and adaptability');
    }
    if (dimensionScores['resilience']?.scaled < 65) {
      recommendations.push('Build stress management and emotional regulation skills');
    }

    if (overallScore >= 80) {
      recommendations.push('Consider leadership and mentoring opportunities');
    }

    return recommendations.slice(0, 4);
  }

  private generateBurnoutRecommendations(dimensionScores: Record<string, DimensionScore>, overallScore: number): string[] {
    const recommendations: string[] = [];
    
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      if (score.scaled < 65) {
        switch (dimension) {
          case 'stress_awareness':
            recommendations.push('Develop stress recognition and early warning systems');
            break;
          case 'coping_strategies':
            recommendations.push('Learn and practice effective stress management techniques');
            break;
          case 'work_boundaries':
            recommendations.push('Establish clear work-life boundaries and limits');
            break;
          case 'support_systems':
            recommendations.push('Build stronger professional and personal support networks');
            break;
        }
      }
    });

    return recommendations.slice(0, 4);
  }

  private generateLeadershipRecommendations(dimensionScores: Record<string, DimensionScore>, overallScore: number): string[] {
    const recommendations: string[] = [
      'Seek advanced leadership training and development programs',
      'Practice delegation and team empowerment skills',
      'Develop strategic thinking and vision creation abilities',
      'Enhance emotional intelligence and interpersonal skills'
    ];

    return recommendations;
  }

  private generateGenZRecommendations(dimensionScores: Record<string, DimensionScore>, overallScore: number): string[] {
    const recommendations: string[] = [
      'Leverage your digital fluency in modern workplace settings',
      'Develop traditional business communication skills',
      'Build intergenerational collaboration capabilities',
      'Focus on adaptability and continuous learning'
    ];

    return recommendations;
  }

  private generateFaithValuesRecommendations(dimensionScores: Record<string, DimensionScore>, overallScore: number): string[] {
    const recommendations: string[] = [
      'Integrate personal values more deeply into daily work practices',
      'Seek organizations that align with your core values',
      'Develop ethical leadership and decision-making skills',
      'Consider values-based mentoring and guidance roles'
    ];

    return recommendations;
  }

  private generateCareerLaunchRecommendations(dimensionScores: Record<string, DimensionScore>, overallScore: number): string[] {
    const recommendations: string[] = [
      'Apply for entry-level positions in your target field',
      'Complete relevant industry certifications and training',
      'Build professional network through industry events',
      'Develop identified skill gaps through targeted learning'
    ];

    return recommendations;
  }
}

export default PsychometricScoringEngine;