// Enhanced Communication Report Generator - Unified Structure with Distortion Analysis
import { UnifiedAssessmentResults, UnifiedReportConfig } from '@/types/unifiedAssessment.types';
import { unifiedReportGenerator } from './unifiedReportGenerator';
import { toast } from 'sonner';

export interface CommunicationDistortionAnalysis {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  indicators: string[];
  reliability: 'High' | 'Moderate' | 'Low' | 'Questionable';
  recommendations: string[];
  consistencyCheck: number;
  extremePatterns: number;
  socialDesirabilityBias: number;
  responseTimePattern: number;
}

export interface CommunicationStylesResults {
  dimensions: {
    assertiveness: { score: number; level: string; percentile: number; description: string; };
    expressiveness: { score: number; level: string; percentile: number; description: string; };
    informationProcessing: { score: number; level: string; percentile: number; description: string; };
    channelPreferences: { score: number; level: string; percentile: number; description: string; };
    listeningPatterns: { score: number; level: string; percentile: number; description: string; };
    influenceStrategies: { score: number; level: string; percentile: number; description: string; };
    conflictCommunication: { score: number; level: string; percentile: number; description: string; };
  };
  profile: {
    type: string;
    primary: string;
    secondary: string;
    strength: string;
    challenge: string;
    workStyle: string;
  };
  distortionAnalysis: CommunicationDistortionAnalysis;
  overallScore: number;
  candidateInfo: {
    name: string;
    email: string;
    completionDate: string;
  };
}

export class EnhancedCommunicationReportGenerator {
  static async generateCandidateReport(results: CommunicationStylesResults): Promise<void> {
    try {
      const unifiedResults = this.convertToUnifiedFormat(results, 'candidate');
      
      const config: UnifiedReportConfig = {
        assessmentType: 'communication',
        reportType: 'candidate',
        results: unifiedResults,
        template: 'detailed',
        includeCharts: true,
        includeRecommendations: true,
        includeActionPlan: true,
        branding: {
          logo: '/final-logo.png',
          colors: {
            primary: '#4F46E5',
            secondary: '#7C3AED'
          },
          company: 'AuthenCore Analytics'
        }
      };

      await unifiedReportGenerator.generateReport(config);
    } catch (error) {
      console.error('Candidate report generation error:', error);
      toast.error('Failed to generate candidate report');
    }
  }

  static async generateEmployerReport(results: CommunicationStylesResults): Promise<void> {
    try {
      const unifiedResults = this.convertToUnifiedFormat(results, 'employer');
      const config: UnifiedReportConfig = {
        assessmentType: 'communication',
        reportType: 'employer',
        results: unifiedResults,
        template: 'executive',
        includeCharts: true,
        includeRecommendations: true,
        includeActionPlan: false,
        branding: {
          logo: '/final-logo.png',
          colors: {
            primary: '#059669',
            secondary: '#10B981'
          },
          company: 'AuthenCore Analytics'
        }
      };

      await unifiedReportGenerator.generateReport(config);
    } catch (error) {
      console.error('Employer report generation error:', error);
      toast.error('Failed to generate employer report');
    }
  }

  private static convertToUnifiedFormat(
    results: CommunicationStylesResults, 
    reportType: 'candidate' | 'employer'
  ): UnifiedAssessmentResults {
    const dimensions = Object.entries(results.dimensions).map(([key, dimension]) => ({
      key,
      name: this.formatDimensionName(key),
      score: dimension.score,
      percentile: dimension.percentile,
      level: this.mapLevel(dimension.level),
      description: dimension.description,
      strengths: this.getDimensionStrengths(key, dimension.score),
      growthAreas: this.getDimensionGrowthAreas(key, dimension.score),
      recommendations: this.getDimensionRecommendations(key, dimension.score, reportType),
      insights: this.getDimensionInsights(key, dimension.score, results.distortionAnalysis)
    }));

    return {
      assessmentId: `communication-${Date.now()}`,
      assessmentType: 'communication',
      candidateInfo: results.candidateInfo,
      overallScore: results.overallScore,
      overallPercentile: this.calculateOverallPercentile(results.overallScore),
      dimensions,
      profile: {
        title: `${results.profile.type} Communication Style`,
        description: `Primary: ${results.profile.primary}, Secondary: ${results.profile.secondary}`,
        keyTraits: [results.profile.strength, results.profile.workStyle]
      },
      insights: {
        strengths: this.getOverallStrengths(results),
        challenges: this.getOverallChallenges(results),
        opportunities: this.getOverallOpportunities(results),
        recommendations: this.getOverallRecommendations(results, reportType)
      },
      actionPlan: {
        immediate: this.getImmediateActions(results, reportType),
        shortTerm: this.getShortTermActions(results, reportType),
        longTerm: this.getLongTermActions(results, reportType)
      },
      validityAssessment: {
        consistencyScore: results.distortionAnalysis.consistencyCheck,
        engagementLevel: this.mapEngagementLevel(results.distortionAnalysis.responseTimePattern),
        responsePattern: results.distortionAnalysis.level.toLowerCase(),
        flags: results.distortionAnalysis.indicators,
        fakeGoodIndicator: results.distortionAnalysis.socialDesirabilityBias,
        completionRate: 100
      },
      reportData: {
        executiveSummary: this.generateExecutiveSummary(results, reportType),
        detailedAnalysis: this.generateDetailedAnalysis(results, reportType),
        interviewQuestions: this.generateInterviewQuestions(results),
        hiringRecommendations: reportType === 'employer' ? this.generateHiringRecommendations(results) : undefined,
        onboardingPlan: reportType === 'employer' ? this.generateOnboardingPlan(results) : undefined
      },
      timestamp: new Date().toISOString(),
      metadata: {
        distortionAnalysis: results.distortionAnalysis,
        communicationProfile: results.profile
      }
    };
  }

  private static formatDimensionName(key: string): string {
    const nameMap: Record<string, string> = {
      assertiveness: 'Assertiveness',
      expressiveness: 'Expressiveness', 
      informationProcessing: 'Information Processing',
      channelPreferences: 'Channel Preferences',
      listeningPatterns: 'Listening Patterns',
      influenceStrategies: 'Influence Strategies',
      conflictCommunication: 'Conflict Communication'
    };
    return nameMap[key] || key;
  }

  private static mapLevel(level: string): 'low' | 'medium' | 'high' {
    if (level === 'Low') return 'low';
    if (level === 'Very High' || level === 'High') return 'high';
    return 'medium';
  }

  private static getDimensionStrengths(key: string, score: number): string[] {
    if (score < 50) return [];
    
    const strengthsMap: Record<string, string[]> = {
      assertiveness: ['Clear communication', 'Confident expression', 'Direct feedback'],
      expressiveness: ['Emotional intelligence', 'Engaging presentation', 'Motivational speaking'],
      informationProcessing: ['Analytical thinking', 'Detail-oriented', 'Systematic approach'],
      channelPreferences: ['Multi-channel communication', 'Adaptive medium selection', 'Technology savvy'],
      listeningPatterns: ['Active listening', 'Empathetic understanding', 'Question asking'],
      influenceStrategies: ['Persuasive communication', 'Collaborative influence', 'Strategic messaging'],
      conflictCommunication: ['Conflict resolution', 'Diplomatic communication', 'De-escalation skills']
    };
    
    return strengthsMap[key] || ['Strong performance in this area'];
  }

  private static getDimensionGrowthAreas(key: string, score: number): string[] {
    if (score >= 70) return ['Maintain current excellence'];
    
    const growthMap: Record<string, string[]> = {
      assertiveness: ['Practice confident communication', 'Develop boundary setting', 'Improve direct feedback skills'],
      expressiveness: ['Enhance emotional expression', 'Develop storytelling skills', 'Practice public speaking'],
      informationProcessing: ['Improve analytical skills', 'Develop systematic thinking', 'Practice data interpretation'],
      channelPreferences: ['Expand communication channels', 'Adapt to digital tools', 'Practice multimedia presentation'],
      listeningPatterns: ['Develop active listening', 'Practice empathetic responses', 'Improve question techniques'],
      influenceStrategies: ['Learn persuasion techniques', 'Practice collaborative approaches', 'Develop strategic messaging'],
      conflictCommunication: ['Learn conflict resolution', 'Practice diplomatic language', 'Develop de-escalation skills']
    };
    
    return growthMap[key] || ['Continue development in this area'];
  }

  private static getDimensionRecommendations(key: string, score: number, reportType: string): string[] {
    const candidateRecs: Record<string, string[]> = {
      assertiveness: ['Practice assertive communication techniques', 'Join leadership training programs'],
      expressiveness: ['Take public speaking courses', 'Practice storytelling in meetings'],
      informationProcessing: ['Develop analytical thinking skills', 'Use structured problem-solving methods'],
      channelPreferences: ['Experiment with different communication tools', 'Learn digital communication best practices'],
      listeningPatterns: ['Practice active listening techniques', 'Seek feedback on listening skills'],
      influenceStrategies: ['Study persuasion and influence techniques', 'Practice collaborative decision-making'],
      conflictCommunication: ['Take conflict resolution training', 'Practice diplomatic communication']
    };

    const employerRecs: Record<string, string[]> = {
      assertiveness: ['Provide assertiveness training', 'Assign leadership opportunities'],
      expressiveness: ['Offer presentation skills training', 'Create speaking opportunities'],
      informationProcessing: ['Provide analytical tools training', 'Assign data-driven projects'],
      channelPreferences: ['Train on communication technologies', 'Encourage multi-channel practice'],
      listeningPatterns: ['Provide active listening training', 'Create listening skill assessments'],
      influenceStrategies: ['Offer influence and persuasion training', 'Assign collaborative projects'],
      conflictCommunication: ['Provide conflict resolution training', 'Create mediation opportunities']
    };

    return reportType === 'employer' ? employerRecs[key] || [] : candidateRecs[key] || [];
  }

  private static getDimensionInsights(key: string, score: number, distortion: CommunicationDistortionAnalysis): string[] {
    const insights = [`${this.formatDimensionName(key)} score of ${score} indicates specific communication patterns.`];
    
    if (distortion.level === 'High' || distortion.level === 'Very High') {
      insights.push('Results may be influenced by social desirability bias.');
    }
    
    if (distortion.reliability === 'Low' || distortion.reliability === 'Questionable') {
      insights.push('Interpret results with caution due to reliability concerns.');
    }
    
    return insights;
  }

  private static getOverallStrengths(results: CommunicationStylesResults): string[] {
    const strengths: string[] = [];
    Object.entries(results.dimensions).forEach(([key, dimension]) => {
      if (dimension.score >= 70) {
        strengths.push(this.formatDimensionName(key));
      }
    });
    
    strengths.push(results.profile.strength);
    return Array.from(new Set(strengths));
  }

  private static getOverallChallenges(results: CommunicationStylesResults): string[] {
    const challenges: string[] = [];
    Object.entries(results.dimensions).forEach(([key, dimension]) => {
      if (dimension.score < 40) {
        challenges.push(this.formatDimensionName(key));
      }
    });
    
    if (results.profile.challenge) {
      challenges.push(results.profile.challenge);
    }
    
    return Array.from(new Set(challenges));
  }

  private static getOverallOpportunities(results: CommunicationStylesResults): string[] {
    const opportunities: string[] = [];
    Object.entries(results.dimensions).forEach(([key, dimension]) => {
      if (dimension.score >= 40 && dimension.score < 70) {
        opportunities.push(`Develop ${this.formatDimensionName(key)} further`);
      }
    });
    
    return opportunities;
  }

  private static getOverallRecommendations(results: CommunicationStylesResults, reportType: string): string[] {
    const recommendations = [
      'Focus on leveraging communication strengths',
      'Address identified development areas systematically',
      'Practice adaptive communication styles',
      'Seek feedback regularly on communication effectiveness'
    ];

    if (reportType === 'employer') {
      recommendations.push(
        'Provide targeted communication training',
        'Create opportunities for communication skill practice',
        'Consider communication coaching for development areas'
      );
    }

    // Add distortion-specific recommendations
    if (results.distortionAnalysis.level === 'High' || results.distortionAnalysis.level === 'Very High') {
      recommendations.push(...results.distortionAnalysis.recommendations);
    }

    return recommendations;
  }

  private static generateExecutiveSummary(results: CommunicationStylesResults, reportType: string): string {
    const profile = results.profile.type;
    const reliability = results.distortionAnalysis.reliability;
    const overallScore = results.overallScore;
    
    let summary = `Communication assessment completed showing ${profile} communication style with overall effectiveness score of ${overallScore}%. `;
    
    if (reportType === 'employer') {
      summary += `Assessment reliability is ${reliability.toLowerCase()}. `;
      if (results.distortionAnalysis.level === 'High' || results.distortionAnalysis.level === 'Very High') {
        summary += 'Results show some response pattern concerns that should be considered in interpretation. ';
      }
      summary += `Primary communication strength is ${results.profile.strength}, with development opportunities in ${results.profile.challenge}.`;
    } else {
      summary += `Your primary communication style is ${results.profile.primary} with ${results.profile.secondary} as a secondary preference. `;
      summary += `Your key strength is ${results.profile.strength}, and you may benefit from developing ${results.profile.challenge}.`;
    }
    
    return summary;
  }

  private static generateDetailedAnalysis(results: CommunicationStylesResults, reportType: string): string {
    let analysis = `Detailed analysis reveals a ${results.profile.type} communication profile characterized by ${results.profile.workStyle}. `;
    
    const highScoring = Object.entries(results.dimensions)
      .filter(([_, dim]) => dim.score >= 70)
      .map(([key, _]) => this.formatDimensionName(key));
    
    const lowScoring = Object.entries(results.dimensions)
      .filter(([_, dim]) => dim.score < 40)
      .map(([key, _]) => this.formatDimensionName(key));
    
    if (highScoring.length > 0) {
      analysis += `Strong performance demonstrated in: ${highScoring.join(', ')}. `;
    }
    
    if (lowScoring.length > 0) {
      analysis += `Development opportunities identified in: ${lowScoring.join(', ')}. `;
    }
    
    if (reportType === 'employer') {
      analysis += `Distortion analysis indicates ${results.distortionAnalysis.level.toLowerCase()} response bias with ${results.distortionAnalysis.reliability.toLowerCase()} reliability. `;
      analysis += 'Consider these factors when making hiring and development decisions.';
    }
    
    return analysis;
  }

  private static generateInterviewQuestions(results: CommunicationStylesResults): string[] {
    const questions = [
      'Describe a time when you had to communicate complex information to a diverse audience.',
      'How do you adapt your communication style when working with different personality types?',
      `Tell me about a situation where your ${results.profile.primary.toLowerCase()} communication style was particularly effective.`,
      'Describe a time when you had to resolve a communication conflict or misunderstanding.',
      'How do you ensure your message is understood when communicating with stakeholders?'
    ];

    // Add profile-specific questions
    const profileQuestions: Record<string, string[]> = {
      'Director': ['How do you handle situations when people don\'t respond to direct communication?'],
      'Socializer': ['Give an example of how you\'ve used your interpersonal skills to influence outcomes.'],
      'Thinker': ['Describe how you communicate analytical findings to non-technical audiences.'],
      'Supporter': ['Tell me about a time when you helped facilitate team communication.'],
      'Balanced': ['How do you decide which communication approach to use in different situations?']
    };

    if (profileQuestions[results.profile.type]) {
      questions.push(...profileQuestions[results.profile.type]);
    }

    return questions;
  }

  private static generateHiringRecommendations(results: CommunicationStylesResults): string[] {
    const recommendations = [];
    
    if (results.overallScore >= 75) {
      recommendations.push('Strong candidate with excellent communication skills');
    } else if (results.overallScore >= 60) {
      recommendations.push('Good candidate with solid communication foundation');
    } else {
      recommendations.push('Consider additional communication training and support');
    }

    if (results.distortionAnalysis.reliability === 'Low' || results.distortionAnalysis.reliability === 'Questionable') {
      recommendations.push('Consider additional assessment methods to validate results');
      recommendations.push('Conduct behavioral interview to verify communication skills');
    }

    // Role-specific recommendations based on profile
    const roleRecs: Record<string, string[]> = {
      'Director': ['Well-suited for leadership and management roles', 'Consider for client-facing positions'],
      'Socializer': ['Excellent for team-based and customer service roles', 'Consider for training and development positions'],
      'Thinker': ['Well-suited for analytical and technical communication roles', 'Good fit for project management'],
      'Supporter': ['Excellent for collaborative team environments', 'Consider for HR and support roles'],
      'Balanced': ['Versatile communicator suitable for diverse roles', 'Good fit for cross-functional positions']
    };

    if (roleRecs[results.profile.type]) {
      recommendations.push(...roleRecs[results.profile.type]);
    }

    return recommendations;
  }

  private static generateOnboardingPlan(results: CommunicationStylesResults): string[] {
    const plan = [
      'Conduct communication style discussion during orientation',
      'Provide overview of team communication preferences',
      'Set expectations for communication protocols'
    ];

    // Add profile-specific onboarding
    const profilePlans: Record<string, string[]> = {
      'Director': ['Provide clear authority and decision-making parameters', 'Establish direct reporting relationships'],
      'Socializer': ['Introduce to team members early', 'Schedule regular social interactions'],
      'Thinker': ['Provide detailed role documentation', 'Allow time for information processing'],
      'Supporter': ['Assign a mentor or buddy', 'Create collaborative project opportunities'],
      'Balanced': ['Expose to various communication scenarios', 'Provide flexibility in approach']
    };

    if (profilePlans[results.profile.type]) {
      plan.push(...profilePlans[results.profile.type]);
    }

    // Add development-focused onboarding based on low-scoring dimensions
    Object.entries(results.dimensions).forEach(([key, dimension]) => {
      if (dimension.score < 50) {
        plan.push(`Provide additional support for ${this.formatDimensionName(key)} development`);
      }
    });

    return plan;
  }

  private static getImmediateActions(results: CommunicationStylesResults, reportType: string): string[] {
    if (reportType === 'employer') {
      return [
        'Review assessment results with candidate',
        'Discuss communication preferences and expectations',
        'Identify immediate training needs'
      ];
    }
    
    return [
      'Review your communication profile results',
      'Identify your primary communication strengths',
      'Note areas for immediate improvement'
    ];
  }

  private static getShortTermActions(results: CommunicationStylesResults, reportType: string): string[] {
    if (reportType === 'employer') {
      return [
        'Develop targeted communication training plan',
        'Assign communication-focused projects',
        'Provide regular feedback on communication effectiveness'
      ];
    }
    
    return [
      'Practice communication techniques in low-risk situations',
      'Seek feedback from trusted colleagues',
      'Consider communication skills training or coaching'
    ];
  }

  private static getLongTermActions(results: CommunicationStylesResults, reportType: string): string[] {
    if (reportType === 'employer') {
      return [
        'Conduct follow-up communication assessments',
        'Consider advanced communication role assignments',
        'Develop communication mentoring opportunities'
      ];
    }
    
    return [
      'Set long-term communication development goals',
      'Seek advanced training in specialized areas',
      'Consider leadership or mentoring opportunities to practice skills'
    ];
  }

  private static calculateOverallPercentile(score: number): number {
    // Simplified percentile calculation - in production would use normative data
    return Math.min(Math.max(score, 1), 99);
  }

  private static mapEngagementLevel(responseTimePattern: number): 'low' | 'medium' | 'high' {
    if (responseTimePattern < 30) return 'low';
    if (responseTimePattern > 70) return 'high';
    return 'medium';
  }
}

export const enhancedCommunicationReportGenerator = EnhancedCommunicationReportGenerator;