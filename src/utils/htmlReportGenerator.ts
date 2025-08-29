import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImage from '@/assets/final-logo.png';
import { enhancedReportGenerator, EnhancedReportConfig } from '@/services/enhancedReportGenerator';

export interface ReportData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    position?: string;
    company?: string;
  };
  overallScore: number;
  dimensions: Array<{
    name: string;
    score: number;
  }>;
  includeLogo?: boolean;
  organizationName?: string;
  customBranding?: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

const assessmentTitles: Record<string, string> = {
  'cair-personality': 'CAIR Personality Assessment',
  'career-launch': 'Career Launch Assessment',
  'communication-styles': 'Communication Styles Assessment',
  'emotional-intelligence': 'Emotional Intelligence Assessment',
  'leadership': 'Leadership Assessment',
  'faith-values': 'Faith & Values Integration',
  'burnout-prevention': 'Burnout Prevention Assessment',
  'genz-workplace': 'Gen Z Workplace Assessment',
  'digital-wellness': 'Digital Wellness Assessment'
};

const reportTitles: Record<string, string> = {
  'cair-personality': 'CAIR Personality Assessment Report',
  'career-launch': 'Career Launch Assessment Report',
  'communication-styles': 'Communication Styles Assessment Report',
  'emotional-intelligence': 'Emotional Intelligence Assessment Report',
  'leadership': 'Leadership Assessment Report',
  'faith-values': 'Faith & Values Integration Report',
  'burnout-prevention': 'Burnout Prevention Assessment Report',
  'genz-workplace': 'Gen Z Workplace Assessment Report',
  'digital-wellness': 'Digital Wellness Assessment Report'
};

async function getLogoBase64(): Promise<string> {
  try {
    const response = await fetch(logoImage);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading logo:', error);
    return '';
  }
}

function getScoreInterpretation(score: number): string {
  if (score >= 85) return 'Excellent performance with exceptional capabilities';
  if (score >= 70) return 'Strong performance with notable strengths';
  if (score >= 60) return 'Good performance with balanced capabilities';
  if (score >= 40) return 'Developing performance with growth opportunities';
  return 'Emerging capabilities with significant development potential';
}

function getAssessmentDimensionsTitle(assessmentType: string): string {
  const titles: Record<string, string> = {
    'cair-personality': 'Personality Dimensions',
    'career-launch': 'Career Readiness Dimensions',
    'communication-styles': 'Communication Dimensions',
    'emotional-intelligence': 'Emotional Intelligence Dimensions',
    'leadership': 'Leadership Dimensions',
    'faith-values': 'Values Alignment Dimensions',
    'burnout-prevention': 'Resilience & Prevention Dimensions',
    'genz-workplace': 'Workplace Preference Dimensions',
    'digital-wellness': 'Digital Wellness Dimensions'
  };
  return titles[assessmentType] || 'Assessment Dimensions';
}

export async function generateHtmlReport(data: ReportData): Promise<void> {
  try {
    // Convert legacy format to enhanced report config
    const enhancedConfig: EnhancedReportConfig = {
      candidateInfo: {
        name: data.userInfo.name,
        email: data.userInfo.email,
        position: data.userInfo.position,
        company: data.userInfo.company,
        completionDate: new Date().toLocaleDateString(),
        assessmentId: `${data.assessmentType.toUpperCase()}-${Date.now()}`,
        timeSpent: 0,
        questionsAnswered: 0
      },
      assessmentType: data.assessmentType,
      results: {
        overallScore: data.overallScore,
        dimensions: data.dimensions,
        candidateInfo: data.userInfo
      },
      reportType: 'candidate',
      includeCharts: true,
      includeDevelopmentPlan: true,
      includeAIInsights: true
    };

    // Use enhanced report generator instead
    await enhancedReportGenerator.generateReport(enhancedConfig);
  } catch (error) {
    console.error('Error generating enhanced report:', error);
    throw error;
  }
}