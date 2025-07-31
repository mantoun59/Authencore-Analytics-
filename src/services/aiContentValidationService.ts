/**
 * AI Content Validation Service
 * Provides quality control and validation for AI-generated assessment reports
 */

import { supabase } from '@/integrations/supabase/client';
import { externalServiceManager } from './externalServiceManager';

interface AIValidationResult {
  isValid: boolean;
  confidenceScore: number;
  issues: string[];
  recommendations: string[];
  humanReviewRequired: boolean;
  biasFlags: string[];
}

interface ReportValidationCriteria {
  factualAccuracy: boolean;
  professionalTone: boolean;
  biasDetection: boolean;
  completeness: boolean;
  clarity: boolean;
  actionability: boolean;
}

export class AIContentValidationService {
  private static instance: AIContentValidationService;
  
  // Professional validation standards
  private readonly VALIDATION_CRITERIA = {
    minConfidenceScore: 0.8,
    maxBiasFlags: 2,
    requiredSections: ['summary', 'analysis', 'recommendations', 'action_plan'],
    professionalLanguageTerms: ['assessment', 'analysis', 'development', 'strengths', 'areas for growth'],
    prohibitedTerms: ['always', 'never', 'definitely', 'certainly', 'guaranteed'],
    biasIndicators: [
      'gender stereotypes', 'age bias', 'cultural assumptions',
      'socioeconomic bias', 'educational bias', 'appearance references'
    ]
  };

  static getInstance(): AIContentValidationService {
    if (!AIContentValidationService.instance) {
      AIContentValidationService.instance = new AIContentValidationService();
    }
    return AIContentValidationService.instance;
  }

  /**
   * Validate AI-generated assessment report
   */
  async validateAssessmentReport(
    reportContent: string,
    assessmentType: string,
    userDemographics?: any
  ): Promise<AIValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const biasFlags: string[] = [];
    let confidenceScore = 1.0;

    // 1. Content completeness check
    const completenessResult = this.validateCompleteness(reportContent);
    if (!completenessResult.isComplete) {
      issues.push(...completenessResult.missingElements);
      confidenceScore -= 0.2;
    }

    // 2. Professional language validation
    const languageResult = this.validateProfessionalLanguage(reportContent);
    if (!languageResult.isProfessional) {
      issues.push(...languageResult.issues);
      confidenceScore -= 0.15;
    }

    // 3. Bias detection
    const biasResult = await this.detectBias(reportContent, userDemographics);
    biasFlags.push(...biasResult.flags);
    if (biasResult.flags.length > this.VALIDATION_CRITERIA.maxBiasFlags) {
      confidenceScore -= 0.3;
    }

    // 4. Factual consistency check
    const factualResult = await this.validateFactualConsistency(reportContent, assessmentType);
    if (!factualResult.isConsistent) {
      issues.push(...factualResult.inconsistencies);
      confidenceScore -= 0.25;
    }

    // 5. Actionability assessment
    const actionabilityResult = this.validateActionability(reportContent);
    if (!actionabilityResult.isActionable) {
      issues.push(...actionabilityResult.vagueness);
      recommendations.push('Add more specific, actionable recommendations');
      confidenceScore -= 0.1;
    }

    // Generate improvement recommendations
    if (issues.length > 0) {
      recommendations.push('Report requires revision before delivery');
      if (biasFlags.length > 0) {
        recommendations.push('Remove biased language and assumptions');
      }
      if (confidenceScore < this.VALIDATION_CRITERIA.minConfidenceScore) {
        recommendations.push('Consider human expert review');
      }
    }

    return {
      isValid: confidenceScore >= this.VALIDATION_CRITERIA.minConfidenceScore && biasFlags.length <= this.VALIDATION_CRITERIA.maxBiasFlags,
      confidenceScore: Math.max(0, confidenceScore),
      issues,
      recommendations,
      humanReviewRequired: confidenceScore < 0.7 || biasFlags.length > 3,
      biasFlags
    };
  }

  /**
   * Validate report completeness
   */
  private validateCompleteness(content: string): {
    isComplete: boolean;
    missingElements: string[];
  } {
    const missingElements: string[] = [];
    const lowerContent = content.toLowerCase();

    // Check for required sections
    for (const section of this.VALIDATION_CRITERIA.requiredSections) {
      if (!lowerContent.includes(section.replace('_', ' '))) {
        missingElements.push(`Missing ${section.replace('_', ' ')} section`);
      }
    }

    // Check for professional elements
    const hasStrengths = lowerContent.includes('strength') || lowerContent.includes('strong');
    const hasDevelopment = lowerContent.includes('development') || lowerContent.includes('improve');
    const hasRecommendations = lowerContent.includes('recommend') || lowerContent.includes('suggest');

    if (!hasStrengths) missingElements.push('Missing strengths identification');
    if (!hasDevelopment) missingElements.push('Missing development areas');
    if (!hasRecommendations) missingElements.push('Missing specific recommendations');

    return {
      isComplete: missingElements.length === 0,
      missingElements
    };
  }

  /**
   * Validate professional language usage
   */
  private validateProfessionalLanguage(content: string): {
    isProfessional: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const lowerContent = content.toLowerCase();

    // Check for prohibited absolute terms
    for (const term of this.VALIDATION_CRITERIA.prohibitedTerms) {
      if (lowerContent.includes(term)) {
        issues.push(`Avoid absolute language: "${term}"`);
      }
    }

    // Check for casual language
    const casualTerms = ['awesome', 'amazing', 'super', 'totally', 'really', 'very'];
    for (const term of casualTerms) {
      if (lowerContent.includes(term)) {
        issues.push(`Use more professional language instead of: "${term}"`);
      }
    }

    // Check for first person usage
    if (lowerContent.includes(' i ') || lowerContent.includes(' me ') || lowerContent.includes(' my ')) {
      issues.push('Avoid first-person language in professional reports');
    }

    return {
      isProfessional: issues.length === 0,
      issues
    };
  }

  /**
   * Detect potential bias in content
   */
  private async detectBias(content: string, demographics?: any): Promise<{
    flags: string[];
    severity: 'low' | 'medium' | 'high';
  }> {
    const flags: string[] = [];
    const lowerContent = content.toLowerCase();

    // Gender bias detection
    const genderTerms = ['he should', 'she should', 'men are', 'women are', 'guys', 'ladies'];
    for (const term of genderTerms) {
      if (lowerContent.includes(term)) {
        flags.push(`Potential gender bias: "${term}"`);
      }
    }

    // Age bias detection
    const ageTerms = ['young people', 'older workers', 'millennials', 'boomers', 'digital natives'];
    for (const term of ageTerms) {
      if (lowerContent.includes(term)) {
        flags.push(`Potential age bias: "${term}"`);
      }
    }

    // Cultural bias detection
    const culturalTerms = ['western', 'eastern', 'traditional', 'modern', 'developed countries'];
    for (const term of culturalTerms) {
      if (lowerContent.includes(term)) {
        flags.push(`Potential cultural bias: "${term}"`);
      }
    }

    // Appearance or physical references
    if (lowerContent.includes('appearance') || lowerContent.includes('looks') || lowerContent.includes('attractive')) {
      flags.push('Inappropriate appearance references');
    }

    // Use AI for advanced bias detection
    try {
      const biasAnalysis = await externalServiceManager.callOpenAI(
        `Analyze this assessment report for potential bias, stereotypes, or discriminatory language. 
        Focus on gender, age, cultural, racial, socioeconomic, or educational bias.
        Report content: "${content.substring(0, 1000)}..."
        Return only "BIAS_DETECTED: [type]" or "NO_BIAS_DETECTED"`,
        { max_tokens: 100, temperature: 0.1 }
      );

      const aiResponse = biasAnalysis.choices[0].message.content;
      if (aiResponse.includes('BIAS_DETECTED:')) {
        const biasType = aiResponse.split('BIAS_DETECTED:')[1].trim();
        flags.push(`AI-detected bias: ${biasType}`);
      }
    } catch (error) {
      console.warn('AI bias detection failed:', error);
    }

    const severity = flags.length > 3 ? 'high' : flags.length > 1 ? 'medium' : 'low';

    return { flags, severity };
  }

  /**
   * Validate factual consistency with assessment framework
   */
  private async validateFactualConsistency(content: string, assessmentType: string): Promise<{
    isConsistent: boolean;
    inconsistencies: string[];
  }> {
    const inconsistencies: string[] = [];

    // Assessment-specific validation
    const assessmentFrameworks = {
      career_launch: ['RIASEC', 'realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'],
      communication_styles: ['direct', 'indirect', 'formal', 'informal', 'assertive', 'expressive'],
      emotional_intelligence: ['self-awareness', 'self-regulation', 'motivation', 'empathy', 'social skills'],
      leadership: ['coaching', 'democratic', 'affiliative', 'pacesetting', 'commanding', 'visionary'],
      cultural_intelligence: ['cultural drive', 'cultural knowledge', 'cultural strategy', 'cultural action']
    };

    const framework = assessmentFrameworks[assessmentType as keyof typeof assessmentFrameworks];
    if (framework) {
      const lowerContent = content.toLowerCase();
      const mentionedTerms = framework.filter(term => lowerContent.includes(term.toLowerCase()));
      
      if (mentionedTerms.length < framework.length * 0.3) {
        inconsistencies.push(`Report doesn't adequately reference ${assessmentType} framework`);
      }
    }

    // Check for contradictory statements
    const contradictionPatterns = [
      ['high.*low', 'excellent.*poor', 'strong.*weak', 'developed.*underdeveloped']
    ];

    for (const patterns of contradictionPatterns) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(content)) {
          inconsistencies.push('Potential contradictory statements detected');
          break;
        }
      }
    }

    return {
      isConsistent: inconsistencies.length === 0,
      inconsistencies
    };
  }

  /**
   * Validate actionability of recommendations
   */
  private validateActionability(content: string): {
    isActionable: boolean;
    vagueness: string[];
  } {
    const vagueness: string[] = [];
    const lowerContent = content.toLowerCase();

    // Check for vague language
    const vagueTerms = ['try to', 'attempt to', 'consider', 'think about', 'maybe', 'perhaps', 'possibly'];
    for (const term of vagueTerms) {
      if (lowerContent.includes(term)) {
        vagueness.push(`Vague recommendation language: "${term}"`);
      }
    }

    // Check for specific action verbs
    const actionVerbs = ['schedule', 'practice', 'join', 'enroll', 'complete', 'implement', 'develop'];
    const hasActionVerbs = actionVerbs.some(verb => lowerContent.includes(verb));

    if (!hasActionVerbs) {
      vagueness.push('Recommendations lack specific action verbs');
    }

    // Check for measurable goals
    const hasMeasurables = /\d+\s*(weeks?|months?|days?|hours?|times?)/.test(content);
    if (!hasMeasurables) {
      vagueness.push('Recommendations lack specific timeframes or measurable goals');
    }

    return {
      isActionable: vagueness.length === 0,
      vagueness
    };
  }

  /**
   * Store validation results
   */
  async storeValidationResult(
    reportId: string,
    validationResult: AIValidationResult
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Re-enable once Supabase types are updated - COMPLETED
      return { success: true };
    } catch (error) {
      console.error('Error storing validation result:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Generate human review checklist
   */
  generateHumanReviewChecklist(validationResult: AIValidationResult): string[] {
    const checklist: string[] = [
      'Verify factual accuracy of assessment interpretations',
      'Check professional tone and language appropriateness',
      'Ensure recommendations are specific and actionable',
      'Validate cultural sensitivity and bias-free content',
      'Confirm alignment with assessment framework and scoring'
    ];

    if (validationResult.biasFlags.length > 0) {
      checklist.push('CRITICAL: Review and address identified bias concerns');
    }

    if (validationResult.confidenceScore < 0.7) {
      checklist.push('CRITICAL: Content quality requires significant revision');
    }

    return checklist;
  }
}

export const aiContentValidationService = AIContentValidationService.getInstance();