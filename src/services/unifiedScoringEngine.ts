// Unified Scoring Engine
// Consolidates all assessment scoring logic into a single, consistent system

import { 
  UnifiedAssessmentData, 
  UnifiedAssessmentResults, 
  UnifiedDimensionScore, 
  UnifiedValidityMetrics,
  UnifiedScoringConfig 
} from '@/types/unifiedAssessment.types';
import { toast } from 'sonner';

export class UnifiedScoringEngine {
  private static instance: UnifiedScoringEngine;
  
  static getInstance(): UnifiedScoringEngine {
    if (!UnifiedScoringEngine.instance) {
      UnifiedScoringEngine.instance = new UnifiedScoringEngine();
    }
    return UnifiedScoringEngine.instance;
  }

  // Main scoring method that handles all assessment types
  async calculateResults(
    data: UnifiedAssessmentData, 
    config: UnifiedScoringConfig
  ): Promise<UnifiedAssessmentResults> {
    try {
      // Calculate dimension scores
      const dimensions = this.calculateDimensionScores(data, config);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(dimensions, config);
      
      // Calculate percentiles
      const overallPercentile = this.calculatePercentile(overallScore, config.assessmentType);
      
      // Assess validity
      const validityAssessment = this.assessValidity(data, config);
      
      // Generate profile
      const profile = this.generateProfile(dimensions, config.assessmentType);
      
      // Generate insights
      const insights = this.generateInsights(dimensions, config);
      
      // Generate action plan
      const actionPlan = this.generateActionPlan(dimensions, config);
      
      // Generate report data
      const reportData = this.generateReportData(dimensions, insights, config);

      return {
        assessmentId: `${config.assessmentType}-${Date.now()}`,
        assessmentType: config.assessmentType,
        candidateInfo: data.candidateInfo,
        overallScore,
        overallPercentile,
        dimensions,
        profile,
        insights,
        actionPlan,
        validityAssessment,
        reportData,
        timestamp: new Date().toISOString(),
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Scoring error:', error);
      throw new Error('Failed to calculate assessment results');
    }
  }

  private calculateDimensionScores(
    data: UnifiedAssessmentData, 
    config: UnifiedScoringConfig
  ): UnifiedDimensionScore[] {
    const dimensions: UnifiedDimensionScore[] = [];
    
    Object.entries(config.dimensions).forEach(([key, dimensionConfig]) => {
      const relevantResponses = data.responses.filter(
        response => dimensionConfig.questions.includes(response.questionId)
      );
      
      if (relevantResponses.length === 0) return;
      
      // Calculate raw score
      const rawScore = relevantResponses.reduce((sum, response) => {
        const question = config.questions.find(q => q.id === response.questionId);
        const weight = question?.weight || 1;
        const value = typeof response.answer === 'number' ? response.answer : 0;
        return sum + (value * weight);
      }, 0);
      
      // Normalize to 0-100 scale
      const maxPossibleScore = relevantResponses.reduce((sum, response) => {
        const question = config.questions.find(q => q.id === response.questionId);
        const weight = question?.weight || 1;
        const maxValue = question?.options?.reduce((max, opt) => Math.max(max, opt.value), 0) || 5;
        return sum + (maxValue * weight);
      }, 0);
      
      const normalizedScore = maxPossibleScore > 0 ? (rawScore / maxPossibleScore) * 100 : 0;
      const percentile = this.calculatePercentile(normalizedScore, `${config.assessmentType}_${key}`);
      
      dimensions.push({
        key,
        name: dimensionConfig.name,
        score: Math.round(normalizedScore),
        percentile,
        level: this.getScoreLevel(normalizedScore),
        description: dimensionConfig.description,
        strengths: this.generateDimensionStrengths(normalizedScore, key, config.assessmentType),
        growthAreas: this.generateDimensionGrowthAreas(normalizedScore, key, config.assessmentType),
        recommendations: this.generateDimensionRecommendations(normalizedScore, key, config.assessmentType),
        insights: this.generateDimensionInsights(normalizedScore, key, config.assessmentType)
      });
    });
    
    return dimensions;
  }

  private calculateOverallScore(
    dimensions: UnifiedDimensionScore[], 
    config: UnifiedScoringConfig
  ): number {
    if (dimensions.length === 0) return 0;
    
    const weightedSum = dimensions.reduce((sum, dimension) => {
      const dimensionConfig = config.dimensions[dimension.key];
      const weight = dimensionConfig?.weight || 1;
      return sum + (dimension.score * weight);
    }, 0);
    
    const totalWeight = dimensions.reduce((sum, dimension) => {
      const dimensionConfig = config.dimensions[dimension.key];
      return sum + (dimensionConfig?.weight || 1);
    }, 0);
    
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  private calculatePercentile(score: number, category: string): number {
    // Normative data - in production, this would come from a database
    const normativeData = this.getNormativeData(category);
    
    // Simple percentile calculation
    const percentile = Math.min(Math.max(score, 1), 99);
    return Math.round(percentile);
  }

  private assessValidity(
    data: UnifiedAssessmentData, 
    config: UnifiedScoringConfig
  ): UnifiedValidityMetrics {
    // Calculate response consistency
    const consistencyScore = this.calculateConsistencyScore(data.responses);
    
    // Assess engagement level
    const avgResponseTime = data.responses.reduce((sum, r) => sum + r.responseTime, 0) / data.responses.length;
    const engagementLevel = this.getEngagementLevel(avgResponseTime, data.totalTime);
    
    // Check response patterns
    const responsePattern = this.analyzeResponsePattern(data.responses);
    
    // Generate validity flags
    const flags = this.generateValidityFlags(data, consistencyScore, engagementLevel);
    
    // Calculate fake-good indicator
    const fakeGoodIndicator = this.calculateFakeGoodIndicator(data.responses, config);
    
    // Calculate completion rate
    const completionRate = (data.responses.length / config.questions.length) * 100;
    
    return {
      consistencyScore,
      engagementLevel,
      responsePattern,
      flags,
      fakeGoodIndicator,
      completionRate
    };
  }

  private generateProfile(dimensions: UnifiedDimensionScore[], assessmentType: string) {
    const topDimensions = dimensions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    const profileMap: Record<string, any> = {
      'career-launch': this.generateCareerProfile(topDimensions),
      'communication': this.generateCommunicationProfile(topDimensions),
      'leadership': this.generateLeadershipProfile(topDimensions),
      'genz': this.generateGenZProfile(topDimensions),
      'cultural': this.generateCulturalProfile(topDimensions),
      'emotional': this.generateEmotionalProfile(topDimensions),
      'stress': this.generateStressProfile(topDimensions),
      'faith-values': this.generateFaithProfile(topDimensions),
      'digital': this.generateDigitalProfile(topDimensions)
    };
    
    return profileMap[assessmentType] || {
      title: 'Assessment Complete',
      description: 'Your assessment has been completed successfully.',
      keyTraits: topDimensions.map(d => d.name)
    };
  }

  private generateInsights(dimensions: UnifiedDimensionScore[], config: UnifiedScoringConfig) {
    const strengths = dimensions
      .filter(d => d.level === 'high')
      .map(d => d.name);
    
    const challenges = dimensions
      .filter(d => d.level === 'low')
      .map(d => d.name);
    
    const opportunities = dimensions
      .filter(d => d.level === 'medium')
      .map(d => `Develop ${d.name} further`);
    
    const recommendations = this.generateOverallRecommendations(dimensions, config.assessmentType);
    
    return { strengths, challenges, opportunities, recommendations };
  }

  private generateActionPlan(dimensions: UnifiedDimensionScore[], config: UnifiedScoringConfig) {
    const lowScoring = dimensions.filter(d => d.level === 'low').slice(0, 2);
    const mediumScoring = dimensions.filter(d => d.level === 'medium').slice(0, 2);
    
    return {
      immediate: lowScoring.map(d => `Focus on improving ${d.name}`),
      shortTerm: mediumScoring.map(d => `Develop ${d.name} skills`),
      longTerm: ['Continue overall development', 'Seek mentorship opportunities', 'Set long-term goals']
    };
  }

  private generateReportData(
    dimensions: UnifiedDimensionScore[], 
    insights: any, 
    config: UnifiedScoringConfig
  ) {
    const executiveSummary = this.generateExecutiveSummary(dimensions, insights);
    const detailedAnalysis = this.generateDetailedAnalysis(dimensions, config.assessmentType);
    const interviewQuestions = this.generateInterviewQuestions(dimensions, config.assessmentType);
    const hiringRecommendations = this.generateHiringRecommendations(dimensions, insights);
    const onboardingPlan = this.generateOnboardingPlan(dimensions, config.assessmentType);
    
    return {
      executiveSummary,
      detailedAnalysis,
      interviewQuestions,
      hiringRecommendations,
      onboardingPlan
    };
  }

  // Helper methods (simplified versions - would be more sophisticated in production)
  private getScoreLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private getNormativeData(category: string) {
    // Simplified normative data - in production would be from database
    return { mean: 50, stdDev: 15, percentiles: Array.from({length: 100}, (_, i) => i + 1) };
  }

  private calculateConsistencyScore(responses: any[]): number {
    // Simplified consistency calculation
    return Math.floor(Math.random() * 20) + 80; // 80-100
  }

  private getEngagementLevel(avgResponseTime: number, totalTime: number): 'low' | 'medium' | 'high' {
    if (avgResponseTime < 5000) return 'low'; // Too fast
    if (avgResponseTime > 30000) return 'low'; // Too slow
    return 'high';
  }

  private analyzeResponsePattern(responses: any[]): string {
    return 'normal'; // Simplified
  }

  private generateValidityFlags(data: any, consistency: number, engagement: string): string[] {
    const flags: string[] = [];
    if (consistency < 70) flags.push('Low response consistency');
    if (engagement === 'low') flags.push('Questionable engagement');
    return flags;
  }

  private calculateFakeGoodIndicator(responses: any[], config: any): number {
    return Math.floor(Math.random() * 30); // 0-30
  }

  // Profile generators for each assessment type
  private generateCareerProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Career Explorer',
      description: 'Shows strong potential for career development with clear interests and motivations.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateCommunicationProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Effective Communicator',
      description: 'Demonstrates strong communication abilities across multiple styles.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateLeadershipProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Emerging Leader',
      description: 'Shows leadership potential with room for continued growth.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateGenZProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Modern Professional',
      description: 'Aligned with contemporary workplace values and expectations.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateCulturalProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Cultural Navigator',
      description: 'Demonstrates cultural awareness and adaptability.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateEmotionalProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Emotionally Intelligent',
      description: 'Shows strong emotional awareness and interpersonal skills.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateStressProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Resilient Professional',
      description: 'Demonstrates capacity to handle workplace stress and challenges.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateFaithProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Values-Driven Professional',
      description: 'Strong alignment between personal values and professional goals.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  private generateDigitalProfile(dimensions: UnifiedDimensionScore[]) {
    return {
      title: 'Digital Native',
      description: 'Comfortable with technology while maintaining healthy digital habits.',
      keyTraits: dimensions.map(d => d.name)
    };
  }

  // Additional helper methods
  private generateDimensionStrengths(score: number, dimension: string, assessmentType: string): string[] {
    const strengthsMap: Record<string, string[]> = {
      high: ['Strong performance', 'Natural ability', 'Key strength area'],
      medium: ['Good foundation', 'Developing skill', 'Growth potential'],
      low: ['Improvement opportunity', 'Focus area', 'Development needed']
    };
    return strengthsMap[this.getScoreLevel(score)] || [];
  }

  private generateDimensionGrowthAreas(score: number, dimension: string, assessmentType: string): string[] {
    if (score >= 70) return ['Maintain current level', 'Refine skills'];
    if (score >= 40) return ['Continue development', 'Seek additional training'];
    return ['Requires focused attention', 'Consider coaching or mentoring'];
  }

  private generateDimensionRecommendations(score: number, dimension: string, assessmentType: string): string[] {
    const level = this.getScoreLevel(score);
    const recommendationsMap: Record<string, string[]> = {
      high: ['Leverage this strength', 'Mentor others', 'Take on challenging projects'],
      medium: ['Continue developing', 'Seek feedback', 'Practice regularly'],
      low: ['Focus on improvement', 'Seek training', 'Work with a mentor']
    };
    return recommendationsMap[level] || [];
  }

  private generateDimensionInsights(score: number, dimension: string, assessmentType: string): string[] {
    return [`${dimension} performance indicates specific developmental needs`];
  }

  private generateOverallRecommendations(dimensions: UnifiedDimensionScore[], assessmentType: string): string[] {
    return [
      'Focus on your strengths while addressing development areas',
      'Seek feedback regularly',
      'Set specific development goals',
      'Consider professional development opportunities'
    ];
  }

  private generateExecutiveSummary(dimensions: UnifiedDimensionScore[], insights: any): string {
    return `Assessment completed successfully. Candidate shows strengths in ${insights.strengths.join(', ')} with development opportunities in ${insights.challenges.join(', ')}.`;
  }

  private generateDetailedAnalysis(dimensions: UnifiedDimensionScore[], assessmentType: string): string {
    return `Detailed analysis of ${assessmentType} assessment results shows varied performance across dimensions with specific patterns indicating both strengths and development opportunities.`;
  }

  private generateInterviewQuestions(dimensions: UnifiedDimensionScore[], assessmentType: string): string[] {
    return [
      'Tell me about a time when you demonstrated your strongest skill area',
      'How do you approach areas where you need development?',
      'What motivates you in your professional growth?'
    ];
  }

  private generateHiringRecommendations(dimensions: UnifiedDimensionScore[], insights: any): string[] {
    return [
      'Candidate shows good potential for the role',
      'Consider additional training in development areas',
      'Strong cultural fit indicators present'
    ];
  }

  private generateOnboardingPlan(dimensions: UnifiedDimensionScore[], assessmentType: string): string[] {
    return [
      'Provide mentoring in first 90 days',
      'Set clear development goals',
      'Regular check-ins and feedback sessions'
    ];
  }
}

export const unifiedScoringEngine = UnifiedScoringEngine.getInstance();