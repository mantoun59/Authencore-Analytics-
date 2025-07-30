// Unified Assessment Service - HTML generation using unified structure
import { toast } from "sonner";
import { UnifiedAssessmentResults, UnifiedReportConfig } from "@/types/unifiedAssessment.types";
import { unifiedReportGenerator } from "./unifiedReportGenerator";

export interface AssessmentResult {
  id: string;
  candidateInfo: { name: string; email: string; date: string; };
  scores: Record<string, number>;
  overallScore: number;
  assessmentType: string;
}

export class UnifiedAssessmentService {
  static async generateReport(result: AssessmentResult): Promise<void> {
    try {
      // Convert legacy format to unified format
      const unifiedResults: UnifiedAssessmentResults = {
        assessmentId: result.id,
        assessmentType: result.assessmentType,
        candidateInfo: {
          name: result.candidateInfo.name,
          email: result.candidateInfo.email,
          completionDate: result.candidateInfo.date
        },
        overallScore: result.overallScore,
        overallPercentile: Math.min(Math.max(result.overallScore, 1), 99),
        dimensions: Object.entries(result.scores).map(([key, score]) => ({
          key,
          name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          score,
          percentile: Math.min(Math.max(score, 1), 99),
          level: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
          description: `Assessment of ${key.replace(/_/g, ' ')} capabilities`,
          strengths: score >= 70 ? ['Strong performance in this area'] : [],
          growthAreas: score < 70 ? ['Room for improvement'] : [],
          recommendations: score < 70 ? ['Focus on developing this area'] : ['Maintain current level'],
          insights: [`${key} performance indicates specific patterns`]
        })),
        profile: {
          title: 'Assessment Complete',
          description: 'Assessment has been completed successfully',
          keyTraits: Object.keys(result.scores)
        },
        insights: {
          strengths: Object.entries(result.scores).filter(([_, score]) => score >= 70).map(([key, _]) => key),
          challenges: Object.entries(result.scores).filter(([_, score]) => score < 40).map(([key, _]) => key),
          opportunities: Object.entries(result.scores).filter(([_, score]) => score >= 40 && score < 70).map(([key, _]) => key),
          recommendations: ['Continue developing your skills', 'Focus on growth areas', 'Leverage your strengths']
        },
        actionPlan: {
          immediate: ['Review assessment results', 'Identify key focus areas'],
          shortTerm: ['Create development plan', 'Seek feedback'],
          longTerm: ['Continue skill development', 'Set long-term goals']
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
          executiveSummary: `Assessment completed with overall score of ${result.overallScore}%`,
          detailedAnalysis: 'Detailed analysis of assessment results',
          interviewQuestions: ['Tell me about your strongest area', 'How do you approach challenges?'],
          hiringRecommendations: ['Consider for role', 'Provide development support'],
          onboardingPlan: ['Standard onboarding', 'Focus on development areas']
        },
        timestamp: new Date().toISOString()
      };

      const config: UnifiedReportConfig = {
        assessmentType: result.assessmentType,
        reportType: 'candidate',
        results: unifiedResults,
        template: 'standard',
        includeCharts: false,
        includeRecommendations: true,
        includeActionPlan: true
      };

      await unifiedReportGenerator.generateReport(config);
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    }
  }
}