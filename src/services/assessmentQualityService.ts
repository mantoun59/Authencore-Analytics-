/**
 * Centralized Assessment Quality Service
 * Consolidates bias detection, validation, uncertainty integration, and professional standards
 */

import { toast } from "sonner";
import { biasDetectionService } from "./biasDetectionService";
import { assessmentValidationService } from "./assessmentValidationService";
import { uncertaintyIntegrationService } from "./uncertaintyIntegrationService";

export interface AssessmentQualityReport {
  assessmentType: string;
  overallQuality: number; // 0-100
  isValid: boolean;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  biasAnalysis: {
    overallBiasScore: number;
    genderBias: number;
    culturalBias: number;
    ageBias: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  confidenceMetrics: {
    dataQuality: number;
    measurementError: number;
    overallConfidence: 'low' | 'moderate' | 'high';
  };
  professionalCompliance: {
    psychometricStandards: boolean;
    ethicalGuidelines: boolean;
    legalCompliance: boolean;
    appropriateUse: boolean;
  };
  lastUpdated: string;
}

export interface QualityConfiguration {
  enableBiasChecking: boolean;
  enableUncertaintyReporting: boolean;
  enableProfessionalValidation: boolean;
  biasThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  qualityThresholds: {
    minimum: number;
    good: number;
    excellent: number;
  };
}

class AssessmentQualityService {
  private static instance: AssessmentQualityService;
  
  private config: QualityConfiguration = {
    enableBiasChecking: true,
    enableUncertaintyReporting: true,
    enableProfessionalValidation: true,
    biasThresholds: {
      low: 20,
      medium: 40,
      high: 60
    },
    qualityThresholds: {
      minimum: 60,
      good: 75,
      excellent: 90
    }
  };

  public static getInstance(): AssessmentQualityService {
    if (!AssessmentQualityService.instance) {
      AssessmentQualityService.instance = new AssessmentQualityService();
    }
    return AssessmentQualityService.instance;
  }

  /**
   * Comprehensive quality assessment of an assessment type
   */
  async assessQuality(
    assessmentType: string,
    questions: any[] = [],
    scoringAlgorithm: any = {},
    sampleResponses: any[] = []
  ): Promise<AssessmentQualityReport> {
    try {
      const startTime = Date.now();
      
      // Run parallel quality checks
      const [validationResult, biasAnalysis, complianceCheck] = await Promise.all([
        this.runValidation(assessmentType, questions, scoringAlgorithm),
        this.runBiasAnalysis(assessmentType, questions),
        this.checkProfessionalCompliance(assessmentType)
      ]);

      // Calculate confidence metrics
      const confidenceMetrics = sampleResponses.length > 0 
        ? uncertaintyIntegrationService.calculateConfidenceMetrics(
            sampleResponses, 
            1.0, // 100% completion rate
            30, // Average response time
            0.8 // Sample consistency score
          )
        : {
            dataQuality: 50,
            responseConsistency: 50,
            sampleSize: 0,
            measurementError: 50,
            overallConfidence: 'low' as const
          };

      // Determine overall quality score
      const qualityComponents = {
        validation: validationResult.qualityScore * 0.4,
        bias: (100 - biasAnalysis.overallBiasScore) * 0.3,
        confidence: confidenceMetrics.dataQuality * 0.2,
        compliance: this.calculateComplianceScore(complianceCheck) * 0.1
      };

      const overallQuality = Math.round(
        Object.values(qualityComponents).reduce((sum, score) => sum + score, 0)
      );

      // Compile recommendations
      const recommendations = [
        ...validationResult.recommendations,
        ...this.generateBiasRecommendations(biasAnalysis),
        ...this.generateComplianceRecommendations(complianceCheck)
      ];

      const processingTime = Date.now() - startTime;
      console.log(`Quality assessment for ${assessmentType} completed in ${processingTime}ms`);

      return {
        assessmentType,
        overallQuality,
        isValid: validationResult.isValid && this.meetsMinimumStandards(overallQuality, biasAnalysis),
        criticalIssues: this.compileCriticalIssues(validationResult, biasAnalysis, complianceCheck),
        warnings: validationResult.warnings,
        recommendations,
        biasAnalysis: {
          overallBiasScore: biasAnalysis.overallBiasScore,
          genderBias: biasAnalysis.genderBias,
          culturalBias: biasAnalysis.culturalBias,
          ageBias: biasAnalysis.ageBias,
          riskLevel: this.determineBiasRiskLevel(biasAnalysis.overallBiasScore)
        },
        confidenceMetrics: {
          dataQuality: confidenceMetrics.dataQuality,
          measurementError: confidenceMetrics.measurementError,
          overallConfidence: confidenceMetrics.overallConfidence
        },
        professionalCompliance: complianceCheck,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error assessing quality for ${assessmentType}:`, error);
      
      return {
        assessmentType,
        overallQuality: 0,
        isValid: false,
        criticalIssues: ['Quality assessment failed due to system error'],
        warnings: ['Unable to complete comprehensive quality check'],
        recommendations: ['Review assessment structure and retry quality assessment'],
        biasAnalysis: {
          overallBiasScore: 100,
          genderBias: 0,
          culturalBias: 0,
          ageBias: 0,
          riskLevel: 'high'
        },
        confidenceMetrics: {
          dataQuality: 0,
          measurementError: 100,
          overallConfidence: 'low'
        },
        professionalCompliance: {
          psychometricStandards: false,
          ethicalGuidelines: false,
          legalCompliance: false,
          appropriateUse: false
        },
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Validate AI-generated report content for bias and appropriateness
   */
  async validateAIReport(
    report: string,
    assessmentType: string,
    candidateData?: any
  ): Promise<{
    isValid: boolean;
    correctedReport?: string;
    issues: string[];
    qualityScore: number;
  }> {
    try {
      // Check for bias in AI output
      const biasValidation = await biasDetectionService.validateAIOutput(report, assessmentType);
      
      // Check for uncertainty language
      const hasUncertaintyLanguage = this.checkUncertaintyLanguage(report);
      const hasProfessionalBoundaries = this.checkProfessionalBoundaries(report, assessmentType);
      
      const issues: string[] = [];
      let qualityScore = 100;

      if (!biasValidation.isValid) {
        issues.push(...biasValidation.warnings);
        qualityScore -= 30;
      }

      if (!hasUncertaintyLanguage) {
        issues.push('Report lacks appropriate uncertainty language');
        qualityScore -= 20;
      }

      if (!hasProfessionalBoundaries) {
        issues.push('Report may exceed professional boundaries');
        qualityScore -= 25;
      }

      // Generate corrected report if needed
      const correctedReport = !biasValidation.isValid || !hasUncertaintyLanguage
        ? await this.correctAIReport(report, issues)
        : undefined;

      return {
        isValid: issues.length === 0,
        correctedReport,
        issues,
        qualityScore: Math.max(0, qualityScore)
      };

    } catch (error) {
      console.error('Error validating AI report:', error);
      return {
        isValid: false,
        issues: ['AI report validation failed'],
        qualityScore: 0
      };
    }
  }

  /**
   * Generate quality-enhanced report with proper disclaimers and uncertainty language
   */
  async generateQualityReport(
    assessmentResults: any,
    assessmentType: string,
    includeDisclaimers: boolean = true
  ): Promise<string> {
    try {
      // Get quality assessment for this assessment type
      const qualityReport = await this.assessQuality(assessmentType);
      
      // Add uncertainty language based on confidence
      const uncertaintyReport = uncertaintyIntegrationService.generateUncertaintyReport(
        'Assessment insights based on your responses',
        {
          dataQuality: qualityReport.confidenceMetrics.dataQuality,
          responseConsistency: 80, // Default value
          sampleSize: 100, // Default value  
          measurementError: qualityReport.confidenceMetrics.measurementError,
          overallConfidence: qualityReport.confidenceMetrics.overallConfidence
        },
        assessmentType,
        assessmentResults.dimensions || []
      );

      // Generate report with quality context
      let report = this.buildBaseReport(assessmentResults, uncertaintyReport);
      
      if (includeDisclaimers) {
        report += this.addProfessionalDisclaimers(assessmentType, qualityReport);
      }

      // Validate the generated report
      const validation = await this.validateAIReport(report, assessmentType);
      
      return validation.isValid ? report : (validation.correctedReport || report);

    } catch (error) {
      console.error('Error generating quality report:', error);
      return 'Unable to generate report due to quality control requirements.';
    }
  }

  // Private helper methods

  private async runValidation(assessmentType: string, questions: any[], scoringAlgorithm: any) {
    if (this.config.enableProfessionalValidation) {
      return await assessmentValidationService.validateAssessment(
        assessmentType,
        questions,
        scoringAlgorithm
      );
    }
    
    return {
      isValid: true,
      qualityScore: 70,
      warnings: [],
      criticalIssues: [],
      recommendations: [],
      confidence: 'moderate' as const
    };
  }

  private async runBiasAnalysis(assessmentType: string, questions: any[]) {
    if (this.config.enableBiasChecking) {
      return await biasDetectionService.analyzeAssessmentBias(assessmentType);
    }
    
    return {
      overallBiasScore: 0,
      genderBias: 0,
      culturalBias: 0,
      ageBias: 0,
      stereotypingRisk: 0,
      flaggedPhrases: [],
      corrections: [],
      confidence: 'high' as const
    };
  }

  private async checkProfessionalCompliance(assessmentType: string) {
    // Check against professional standards
    const prohibited = ['faith-values', 'burnout-prevention'];
    const needsRevision = ['emotional-intelligence'];
    
    return {
      psychometricStandards: !prohibited.includes(assessmentType),
      ethicalGuidelines: !prohibited.includes(assessmentType),
      legalCompliance: !prohibited.includes(assessmentType),
      appropriateUse: !needsRevision.includes(assessmentType)
    };
  }

  private meetsMinimumStandards(qualityScore: number, biasAnalysis: any): boolean {
    return qualityScore >= this.config.qualityThresholds.minimum &&
           biasAnalysis.overallBiasScore < this.config.biasThresholds.high;
  }

  private compileCriticalIssues(validation: any, biasAnalysis: any, compliance: any): string[] {
    const issues: string[] = [];
    
    if (validation.criticalIssues?.length > 0) {
      issues.push(...validation.criticalIssues);
    }
    
    if (biasAnalysis.overallBiasScore > this.config.biasThresholds.high) {
      issues.push('High bias risk detected - immediate review required');
    }
    
    if (!compliance.legalCompliance) {
      issues.push('Assessment may violate professional or legal standards');
    }
    
    return issues;
  }

  private determineBiasRiskLevel(biasScore: number): 'low' | 'medium' | 'high' {
    if (biasScore < this.config.biasThresholds.low) return 'low';
    if (biasScore < this.config.biasThresholds.medium) return 'medium';
    return 'high';
  }

  private calculateComplianceScore(compliance: any): number {
    const scores = Object.values(compliance).map(v => v ? 100 : 0);
    return scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
  }

  private generateBiasRecommendations(biasAnalysis: any): string[] {
    const recommendations: string[] = [];
    
    if (biasAnalysis.genderBias > 20) {
      recommendations.push('Review questions for gender stereotype bias');
    }
    
    if (biasAnalysis.culturalBias > 20) {
      recommendations.push('Consider cultural sensitivity in question design');
    }
    
    if (biasAnalysis.ageBias > 20) {
      recommendations.push('Examine questions for age-related assumptions');
    }
    
    return recommendations;
  }

  private generateComplianceRecommendations(compliance: any): string[] {
    const recommendations: string[] = [];
    
    if (!compliance.psychometricStandards) {
      recommendations.push('Align with APA psychometric standards');
    }
    
    if (!compliance.appropriateUse) {
      recommendations.push('Clarify appropriate use guidelines');
    }
    
    return recommendations;
  }

  private checkUncertaintyLanguage(report: string): boolean {
    const uncertaintyPhrases = [
      'suggests', 'tends to', 'may indicate', 'appears to', 'seems to',
      'might', 'could', 'patterns suggest', 'responses indicate'
    ];
    
    const lowerReport = report.toLowerCase();
    return uncertaintyPhrases.some(phrase => lowerReport.includes(phrase));
  }

  private checkProfessionalBoundaries(report: string, assessmentType: string): boolean {
    const inappropriateTerms = [
      'diagnose', 'disorder', 'therapy', 'treatment', 'clinical',
      'perfect career', 'guaranteed', 'definitely', 'you are', 'you will'
    ];
    
    const lowerReport = report.toLowerCase();
    return !inappropriateTerms.some(term => lowerReport.includes(term));
  }

  private async correctAIReport(report: string, issues: string[]): Promise<string> {
    try {
      return await biasDetectionService.correctBias(report);
    } catch (error) {
      console.error('Error correcting AI report:', error);
      return report + '\n\n*Report generated with quality control limitations.';
    }
  }

  private buildBaseReport(results: any, uncertaintyReport: any): string {
    return `
${uncertaintyReport.primaryInsight}

Key Insights:
${results.insights || 'Based on your responses, several patterns emerge that may inform your professional development.'}

Development Areas:
${uncertaintyReport.alternatives.join('\n')}

Important Context:
${uncertaintyReport.limitations.join('\n')}

${uncertaintyReport.developmentNote}
`.trim();
  }

  private addProfessionalDisclaimers(assessmentType: string, qualityReport: any): string {
    return `

---

Professional Use Disclaimer:
This assessment is designed for professional development and self-reflection purposes. Results should be used as starting points for career conversations and growth planning, not as definitive guidance.

Quality Metrics:
- Assessment Quality Score: ${qualityReport.overallQuality}%
- Confidence Level: ${qualityReport.confidenceMetrics.overallConfidence}
- Bias Risk: ${qualityReport.biasAnalysis.riskLevel}

For important career decisions, consult with qualified career counselors or professional development specialists.
`;
  }

  // Configuration methods
  
  updateConfiguration(newConfig: Partial<QualityConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfiguration(): QualityConfiguration {
    return { ...this.config };
  }
}

export const assessmentQualityService = AssessmentQualityService.getInstance();