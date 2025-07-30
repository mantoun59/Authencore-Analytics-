// Professional Report Generator - Using unified structure
import { toast } from "sonner";
import { UnifiedAssessmentResults, UnifiedReportConfig } from "@/types/unifiedAssessment.types";
import { unifiedReportGenerator } from "./unifiedReportGenerator";

export interface ProfessionalReportConfig {
  candidateData: { name: string; email: string; date: string; };
  scores: Array<{ name: string; percentile: number; level: string; description: string; }>;
  validity: { consistencyScore: number; overallValidity: string; };
  actionPlan: string[];
  reportType: 'candidate' | 'employer';
}

export async function generateProfessionalReport(config: ProfessionalReportConfig): Promise<void> {
  try {
    // Convert to unified format
    const unifiedResults: UnifiedAssessmentResults = {
      assessmentId: `professional-${Date.now()}`,
      assessmentType: 'professional',
      candidateInfo: {
        name: config.candidateData.name,
        email: config.candidateData.email,
        completionDate: config.candidateData.date
      },
      overallScore: config.scores.reduce((sum, s) => sum + s.percentile, 0) / config.scores.length,
      overallPercentile: config.scores.reduce((sum, s) => sum + s.percentile, 0) / config.scores.length,
      dimensions: config.scores.map(score => ({
        key: score.name.toLowerCase().replace(/\s+/g, '_'),
        name: score.name,
        score: score.percentile,
        percentile: score.percentile,
        level: score.level as 'low' | 'medium' | 'high',
        description: score.description,
        strengths: score.percentile >= 70 ? ['Strong performance'] : [],
        growthAreas: score.percentile < 70 ? ['Development needed'] : [],
        recommendations: score.percentile < 70 ? ['Focus on improvement'] : ['Maintain excellence'],
        insights: [`${score.name} performance analysis`]
      })),
      profile: {
        title: 'Professional Assessment Results',
        description: 'Comprehensive professional competency assessment',
        keyTraits: config.scores.map(s => s.name)
      },
      insights: {
        strengths: config.scores.filter(s => s.percentile >= 70).map(s => s.name),
        challenges: config.scores.filter(s => s.percentile < 40).map(s => s.name),
        opportunities: config.scores.filter(s => s.percentile >= 40 && s.percentile < 70).map(s => s.name),
        recommendations: config.actionPlan
      },
      actionPlan: {
        immediate: config.actionPlan.slice(0, 2),
        shortTerm: config.actionPlan.slice(2, 4),
        longTerm: config.actionPlan.slice(4)
      },
      validityAssessment: {
        consistencyScore: config.validity.consistencyScore,
        engagementLevel: 'high',
        responsePattern: config.validity.overallValidity,
        flags: [],
        fakeGoodIndicator: 15,
        completionRate: 100
      },
      reportData: {
        executiveSummary: `Professional assessment completed with consistency score of ${config.validity.consistencyScore}%`,
        detailedAnalysis: 'Comprehensive analysis of professional competencies',
        interviewQuestions: ['Describe your professional strengths', 'How do you handle workplace challenges?'],
        hiringRecommendations: ['Review competency alignment', 'Consider development support'],
        onboardingPlan: ['Structured onboarding', 'Professional development planning']
      },
      timestamp: new Date().toISOString()
    };

    const reportConfig: UnifiedReportConfig = {
      assessmentType: 'professional',
      reportType: config.reportType,
      results: unifiedResults,
      template: 'detailed',
      includeCharts: true,
      includeRecommendations: true,
      includeActionPlan: config.reportType === 'candidate',
      branding: {
        logo: '/final-logo.png',
        colors: {
          primary: '#008080',
          secondary: '#20B2AA'
        },
        company: 'AuthenCore Analytics'
      }
    };

    await unifiedReportGenerator.generateReport(reportConfig);
  } catch (error) {
    console.error('Professional report generation error:', error);
    toast.error('Failed to generate professional report');
  }
}

export class ProfessionalReportGenerator {
  static async generateReport(config: ProfessionalReportConfig): Promise<void> {
    return generateProfessionalReport(config);
  }
}