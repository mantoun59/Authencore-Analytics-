// Consolidated Report Service - Using unified structure
import { toast } from "sonner";
import { UnifiedAssessmentResults, UnifiedReportConfig } from "@/types/unifiedAssessment.types";
import { unifiedReportGenerator } from "./unifiedReportGenerator";

export interface ReportConfig {
  title: string;
  type: 'candidate' | 'employer';
  candidate: { name: string; email: string; date: string; };
  scores: Array<{ dimension: string; score: number; percentile: number; }>;
  summary: string;
  recommendations: string[];
}

export class ConsolidatedReportService {
  static async generateReport(config: ReportConfig): Promise<void> {
    try {
      // Convert to unified format
      const unifiedResults: UnifiedAssessmentResults = {
        assessmentId: `consolidated-${Date.now()}`,
        assessmentType: 'consolidated',
        candidateInfo: {
          name: config.candidate.name,
          email: config.candidate.email,
          completionDate: config.candidate.date
        },
        overallScore: config.scores.reduce((sum, s) => sum + s.score, 0) / config.scores.length,
        overallPercentile: config.scores.reduce((sum, s) => sum + s.percentile, 0) / config.scores.length,
        dimensions: config.scores.map(score => ({
          key: score.dimension.toLowerCase().replace(/\s+/g, '_'),
          name: score.dimension,
          score: score.score,
          percentile: score.percentile,
          level: score.score >= 70 ? 'high' : score.score >= 40 ? 'medium' : 'low',
          description: `Assessment of ${score.dimension} capabilities`,
          strengths: score.score >= 70 ? ['Strong performance'] : [],
          growthAreas: score.score < 70 ? ['Development opportunity'] : [],
          recommendations: score.score < 70 ? ['Focus on improvement'] : ['Maintain excellence'],
          insights: [`${score.dimension} shows specific patterns`]
        })),
        profile: {
          title: config.title,
          description: config.summary,
          keyTraits: config.scores.map(s => s.dimension)
        },
        insights: {
          strengths: config.scores.filter(s => s.score >= 70).map(s => s.dimension),
          challenges: config.scores.filter(s => s.score < 40).map(s => s.dimension),
          opportunities: config.scores.filter(s => s.score >= 40 && s.score < 70).map(s => s.dimension),
          recommendations: config.recommendations
        },
        actionPlan: {
          immediate: config.recommendations.slice(0, 2),
          shortTerm: config.recommendations.slice(2, 4),
          longTerm: config.recommendations.slice(4)
        },
        validityAssessment: {
          consistencyScore: 85,
          engagementLevel: 'high',
          responsePattern: 'normal',
          flags: [],
          fakeGoodIndicator: 15,
          completionRate: 100
        },
        reportData: {
          executiveSummary: config.summary,
          detailedAnalysis: 'Consolidated analysis across multiple dimensions',
          interviewQuestions: ['Describe your key strengths', 'How do you handle challenges?'],
          hiringRecommendations: ['Review overall performance', 'Consider development needs'],
          onboardingPlan: ['Standard onboarding process', 'Address development areas']
        },
        timestamp: new Date().toISOString()
      };

      const reportConfig: UnifiedReportConfig = {
        assessmentType: 'consolidated',
        reportType: config.type,
        results: unifiedResults,
        template: 'standard',
        includeCharts: false,
        includeRecommendations: true,
        includeActionPlan: config.type === 'candidate'
      };

      await unifiedReportGenerator.generateReport(reportConfig);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    }
  }
}