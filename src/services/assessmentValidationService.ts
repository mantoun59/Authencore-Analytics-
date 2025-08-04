import { toast } from "sonner";
import { biasDetectionService } from "./biasDetectionService";
import { uncertaintyIntegrationService } from "./uncertaintyIntegrationService";

export interface ValidationResult {
  isValid: boolean;
  qualityScore: number; // 0-100
  warnings: string[];
  criticalIssues: string[];
  recommendations: string[];
  confidence: 'low' | 'moderate' | 'high';
}

export interface AssessmentQualityMetrics {
  questionQuality: number;
  scoringValidity: number;
  biasRisk: number;
  professionalCompliance: number;
  overallQuality: number;
}

class AssessmentValidationService {
  private qualityThresholds = {
    excellent: 90,
    good: 75,
    acceptable: 60,
    poor: 40,
    unacceptable: 0
  };

  private criticalFlags = {
    clinical_overreach: 'Assessment exceeds professional boundaries into clinical territory',
    discrimination_risk: 'High risk of bias or discrimination in questions or scoring',
    false_precision: 'Claims measurement precision that exceeds assessment capability',
    inappropriate_use: 'Assessment may be misused for employment or personnel decisions',
    insufficient_validation: 'Lacks adequate psychometric validation for intended use'
  };

  async validateAssessment(
    assessmentType: string,
    questions: any[],
    scoringAlgorithm: any,
    sampleResponses?: any[]
  ): Promise<ValidationResult> {
    try {
      const validationResults = await Promise.all([
        this.validateQuestionQuality(questions, assessmentType),
        this.validateScoringMethodology(scoringAlgorithm, assessmentType),
        this.validateProfessionalBoundaries(assessmentType),
        this.validateBiasRisk(questions, assessmentType)
      ]);

      const [
        questionValidation,
        scoringValidation,
        boundaryValidation,
        biasValidation
      ] = validationResults;

      const qualityScore = Math.round(
        (questionValidation.score + scoringValidation.score + 
         boundaryValidation.score + biasValidation.score) / 4
      );

      const warnings = [
        ...questionValidation.warnings,
        ...scoringValidation.warnings,
        ...boundaryValidation.warnings,
        ...biasValidation.warnings
      ];

      const criticalIssues = [
        ...questionValidation.criticalIssues,
        ...scoringValidation.criticalIssues,
        ...boundaryValidation.criticalIssues,
        ...biasValidation.criticalIssues
      ];

      const isValid = criticalIssues.length === 0 && qualityScore >= this.qualityThresholds.acceptable;
      const confidence = this.determineConfidence(qualityScore, criticalIssues.length);

      return {
        isValid,
        qualityScore,
        warnings,
        criticalIssues,
        recommendations: this.generateRecommendations(validationResults),
        confidence
      };
    } catch (error) {
      console.error('Error validating assessment:', error);
      return {
        isValid: false,
        qualityScore: 0,
        warnings: ['Validation process encountered errors'],
        criticalIssues: ['Unable to complete validation'],
        recommendations: ['Review assessment structure and try validation again'],
        confidence: 'low'
      };
    }
  }

  async validateQuestionQuality(questions: any[], assessmentType: string): Promise<{
    score: number;
    warnings: string[];
    criticalIssues: string[];
  }> {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    // Check question count per dimension
    const dimensionCounts = this.analyzeDimensionCoverage(questions);
    Object.entries(dimensionCounts).forEach(([dimension, count]) => {
      if (count < 8) {
        warnings.push(`Dimension "${dimension}" has only ${count} questions (minimum 8-10 recommended)`);
        score -= 10;
      }
      if (count < 5) {
        criticalIssues.push(`Insufficient questions for reliable measurement of ${dimension}`);
        score -= 20;
      }
    });

    // Check for bias in question content
    for (const question of questions) {
      const questionText = question.question || question.text || '';
      const biasAnalysis = await biasDetectionService.analyzeBias(questionText);
      
      if (biasAnalysis.overallBiasScore > 30) {
        warnings.push(`Question "${questionText.substring(0, 50)}..." shows potential bias`);
        score -= 5;
      }
      
      if (biasAnalysis.overallBiasScore > 60) {
        criticalIssues.push(`High bias risk in question: "${questionText.substring(0, 50)}..."`);
        score -= 15;
      }
    }

    // Check for inappropriate question types
    const inappropriateFlags = this.checkInappropriateQuestions(questions, assessmentType);
    warnings.push(...inappropriateFlags.warnings);
    criticalIssues.push(...inappropriateFlags.criticalIssues);
    score -= inappropriateFlags.scoreDeduction;

    return {
      score: Math.max(0, score),
      warnings,
      criticalIssues
    };
  }

  async validateScoringMethodology(scoringAlgorithm: any, assessmentType: string): Promise<{
    score: number;
    warnings: string[];
    criticalIssues: string[];
  }> {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    // Check for norm-referenced scoring
    if (!scoringAlgorithm.normData && !scoringAlgorithm.percentiles) {
      warnings.push('Scoring lacks norm-referenced interpretation');
      score -= 20;
    }

    // Check for confidence intervals
    if (!scoringAlgorithm.confidenceIntervals && !scoringAlgorithm.measurementError) {
      warnings.push('Scoring does not account for measurement error');
      score -= 15;
    }

    // Check for equal weighting assumption
    if (scoringAlgorithm.equalWeights || !scoringAlgorithm.questionWeights) {
      warnings.push('Scoring assumes equal question weights without empirical justification');
      score -= 10;
    }

    // Check for false precision
    if (scoringAlgorithm.precision && scoringAlgorithm.precision > 1) {
      criticalIssues.push('Scoring claims inappropriate precision (decimals) without supporting reliability');
      score -= 25;
    }

    // Assessment-specific validation
    const specificValidation = this.validateAssessmentSpecificScoring(scoringAlgorithm, assessmentType);
    warnings.push(...specificValidation.warnings);
    criticalIssues.push(...specificValidation.criticalIssues);
    score -= specificValidation.scoreDeduction;

    return {
      score: Math.max(0, score),
      warnings,
      criticalIssues
    };
  }

  async validateProfessionalBoundaries(assessmentType: string): Promise<{
    score: number;
    warnings: string[];
    criticalIssues: string[];
  }> {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    const boundaryViolations = {
      'faith-values': {
        critical: 'Faith and values assessment inappropriate for professional platform',
        score: -100
      },
      'burnout-prevention': {
        critical: 'Burnout assessment exceeds professional boundaries into clinical territory',
        score: -50
      },
      'emotional-intelligence': {
        warning: 'Self-report EQ assessment has limited validity and may exceed professional scope',
        score: -30
      }
    };

    const violation = boundaryViolations[assessmentType];
    if (violation) {
      if (violation.critical) {
        criticalIssues.push(violation.critical);
      } else if (violation.warning) {
        warnings.push(violation.warning);
      }
      score += violation.score;
    }

    // Check for appropriate disclaimers
    if (!this.hasAppropriateDisclaimers(assessmentType)) {
      warnings.push('Assessment lacks appropriate professional disclaimers');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      warnings,
      criticalIssues
    };
  }

  async validateBiasRisk(questions: any[], assessmentType: string): Promise<{
    score: number;
    warnings: string[];
    criticalIssues: string[];
  }> {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];
    let score = 100;

    // Cultural bias assessment
    const culturalBiasRisk = this.assessCulturalBias(questions);
    if (culturalBiasRisk > 30) {
      warnings.push('Questions may favor specific cultural perspectives');
      score -= 15;
    }
    if (culturalBiasRisk > 60) {
      criticalIssues.push('High risk of cultural bias in assessment questions');
      score -= 30;
    }

    // Gender bias assessment
    const genderBiasRisk = this.assessGenderBias(questions);
    if (genderBiasRisk > 30) {
      warnings.push('Questions may reinforce gender stereotypes');
      score -= 15;
    }
    if (genderBiasRisk > 60) {
      criticalIssues.push('High risk of gender bias in assessment questions');
      score -= 30;
    }

    // Socioeconomic bias assessment
    const socioeconomicBiasRisk = this.assessSocioeconomicBias(questions);
    if (socioeconomicBiasRisk > 30) {
      warnings.push('Questions may assume specific socioeconomic experiences');
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      warnings,
      criticalIssues
    };
  }

  private analyzeDimensionCoverage(questions: any[]): { [dimension: string]: number } {
    const coverage: { [dimension: string]: number } = {};
    
    questions.forEach(question => {
      const dimension = question.dimension || question.category || 'unknown';
      coverage[dimension] = (coverage[dimension] || 0) + 1;
    });

    return coverage;
  }

  private checkInappropriateQuestions(questions: any[], assessmentType: string): {
    warnings: string[];
    criticalIssues: string[];
    scoreDeduction: number;
  } {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];
    let scoreDeduction = 0;

    const inappropriatePatterns = {
      clinical: ['depressed', 'anxious', 'disorder', 'symptoms', 'diagnosis'],
      religious: ['faith', 'god', 'religion', 'prayer', 'spiritual', 'beliefs'],
      medical: ['medication', 'therapy', 'treatment', 'condition', 'illness'],
      personal: ['family problems', 'relationships', 'trauma', 'abuse']
    };

    questions.forEach(question => {
      const questionText = (question.question || question.text || '').toLowerCase();
      
      Object.entries(inappropriatePatterns).forEach(([category, patterns]) => {
        patterns.forEach(pattern => {
          if (questionText.includes(pattern)) {
            if (category === 'clinical' || category === 'medical') {
              criticalIssues.push(`Question contains inappropriate ${category} content: "${pattern}"`);
              scoreDeduction += 20;
            } else {
              warnings.push(`Question may contain inappropriate ${category} content: "${pattern}"`);
              scoreDeduction += 10;
            }
          }
        });
      });
    });

    return { warnings, criticalIssues, scoreDeduction };
  }

  private validateAssessmentSpecificScoring(scoringAlgorithm: any, assessmentType: string): {
    warnings: string[];
    criticalIssues: string[];
    scoreDeduction: number;
  } {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];
    let scoreDeduction = 0;

    const assessmentRequirements = {
      'emotional-intelligence': {
        requiredFeatures: ['ability-based scoring', 'expert validation'],
        warning: 'Self-report EQ scoring has fundamental validity limitations',
        scoreDeduction: 25
      },
      'cultural-intelligence': {
        requiredFeatures: ['cross-cultural validation', 'cultural norm adjustment'],
        warning: 'Cultural intelligence scoring requires cross-cultural validation',
        scoreDeduction: 20
      },
      'career-launch': {
        requiredFeatures: ['interest-aptitude integration', 'developmental norms'],
        warning: 'Career assessment should integrate multiple domains with developmental considerations',
        scoreDeduction: 15
      }
    };

    const requirements = assessmentRequirements[assessmentType];
    if (requirements) {
      warnings.push(requirements.warning);
      scoreDeduction += requirements.scoreDeduction;

      requirements.requiredFeatures.forEach(feature => {
        if (!scoringAlgorithm[feature.replace(/-/g, '')]) {
          warnings.push(`Missing required feature: ${feature}`);
          scoreDeduction += 10;
        }
      });
    }

    return { warnings, criticalIssues, scoreDeduction };
  }

  private hasAppropriateDisclaimers(assessmentType: string): boolean {
    // This would check if the assessment includes appropriate disclaimers
    // For now, returning false to ensure disclaimers are added
    return false;
  }

  private assessCulturalBias(questions: any[]): number {
    let biasScore = 0;
    const culturallyBiasedTerms = [
      'direct communication', 'individual achievement', 'competition',
      'hierarchy', 'authority', 'independence', 'self-reliance'
    ];

    questions.forEach(question => {
      const text = (question.question || question.text || '').toLowerCase();
      culturallyBiasedTerms.forEach(term => {
        if (text.includes(term)) {
          biasScore += 10;
        }
      });
    });

    return Math.min(biasScore, 100);
  }

  private assessGenderBias(questions: any[]): number {
    let biasScore = 0;
    const genderBiasedTerms = [
      'aggressive', 'nurturing', 'competitive', 'collaborative',
      'analytical', 'empathetic', 'leadership', 'supportive'
    ];

    questions.forEach(question => {
      const text = (question.question || question.text || '').toLowerCase();
      genderBiasedTerms.forEach(term => {
        if (text.includes(term)) {
          biasScore += 5;
        }
      });
    });

    return Math.min(biasScore, 100);
  }

  private assessSocioeconomicBias(questions: any[]): number {
    let biasScore = 0;
    const socioeconomicBiasedTerms = [
      'travel abroad', 'private education', 'networking events',
      'professional development', 'advanced degrees', 'internships'
    ];

    questions.forEach(question => {
      const text = (question.question || question.text || '').toLowerCase();
      socioeconomicBiasedTerms.forEach(term => {
        if (text.includes(term)) {
          biasScore += 15;
        }
      });
    });

    return Math.min(biasScore, 100);
  }

  private determineConfidence(qualityScore: number, criticalIssuesCount: number): 'low' | 'moderate' | 'high' {
    if (criticalIssuesCount > 0 || qualityScore < 50) return 'low';
    if (qualityScore < 75) return 'moderate';
    return 'high';
  }

  private generateRecommendations(validationResults: any[]): string[] {
    const recommendations: string[] = [];

    // Add specific recommendations based on validation results
    validationResults.forEach(result => {
      if (result.score < 70) {
        recommendations.push('Conduct comprehensive review and improvement of identified issues');
      }
      if (result.criticalIssues.length > 0) {
        recommendations.push('Address critical issues before deployment');
      }
    });

    // General recommendations
    recommendations.push('Implement regular bias monitoring and correction');
    recommendations.push('Add appropriate professional disclaimers and boundaries');
    recommendations.push('Consider professional psychometric validation study');

    return [...new Set(recommendations)]; // Remove duplicates
  }

  async generateComplianceReport(assessmentType: string): Promise<{
    compliant: boolean;
    standards: string[];
    violations: string[];
    recommendations: string[];
  }> {
    try {
      const standards = [
        'APA Standards for Educational and Psychological Testing',
        'International Test Commission Guidelines',
        'Professional Development Assessment Standards',
        'Equal Employment Opportunity Guidelines'
      ];

      const validation = await this.validateAssessment(assessmentType, [], {});
      
      return {
        compliant: validation.isValid,
        standards,
        violations: validation.criticalIssues,
        recommendations: validation.recommendations
      };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      return {
        compliant: false,
        standards: [],
        violations: ['Unable to generate compliance report'],
        recommendations: ['Review assessment structure and compliance requirements']
      };
    }
  }
}

export const assessmentValidationService = new AssessmentValidationService();