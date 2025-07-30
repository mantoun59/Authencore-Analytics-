// Updated burnout report generator using new comprehensive system
import { generateBurnoutEmployerReport } from './burnoutEmployerReportGenerator';
import { generateBurnoutCandidateReport } from './burnoutCandidateReportGenerator';
import { useBurnoutPreventionScoring } from '@/hooks/useBurnoutPreventionScoring';

export interface BurnoutReportConfig {
  candidateInfo: {
    name: string;
    email: string;
    date: string;
    position?: string;
    department?: string;
  };
  results: {
    overallScore: number;
    percentileScore: number;
    burnoutRiskProfile: string;
    categoryScores: any[];
    dimensionScores: any[];
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    burnoutRisk: 'low' | 'medium' | 'high';
    wellnessLevel: 'excellent' | 'good' | 'fair' | 'poor';
    distortionMetrics: any;
    priorityAreas: string[];
  };
  reportType?: 'employer' | 'candidate';
}

export const generateDetailedBurnoutReport = async (config: BurnoutReportConfig): Promise<void> => {
  const { reportType = 'candidate' } = config;
  
  // Transform config to match new interface
  const reportConfig = {
    candidateInfo: {
      name: config.candidateInfo.name,
      email: config.candidateInfo.email,
      assessmentDate: config.candidateInfo.date,
      position: config.candidateInfo.position,
      department: config.candidateInfo.department,
    },
    results: {
      ...config.results,
      distortionMetrics: config.results.distortionMetrics || {
        responseAuthenticity: 85,
        socialDesirabilityBias: 35,
        impressionManagement: 30,
        responseConsistency: 80,
        straightLining: false,
        speedWarning: false,
        overallValidity: 'high' as const
      }
    }
  };

  let htmlContent: string;
  
  if (reportType === 'employer') {
    htmlContent = generateBurnoutEmployerReport(reportConfig);
  } else {
    htmlContent = generateBurnoutCandidateReport(reportConfig);
  }

  const reportWindow = window.open('', '_blank', 'width=1200,height=800');
  if (reportWindow) {
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    
    // Add print functionality
    setTimeout(() => {
      if (reportWindow && !reportWindow.closed) {
        reportWindow.focus();
      }
    }, 1000);
  }
};