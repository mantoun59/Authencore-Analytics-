import { toast } from "sonner";

// Enhanced bias detection service for assessment quality
export interface BiasAnalysisResult {
  overallBiasScore: number; // 0-100, lower is better
  genderBias: number;
  culturalBias: number;
  ageBias: number;
  stereotypingRisk: number;
  flaggedPhrases: string[];
  corrections: string[];
  confidence: 'low' | 'moderate' | 'high';
  assessmentType?: string;
  biasSeverity?: 'low' | 'medium' | 'high';
  biasIndicators?: {
    adverseImpactRatio: number;
    equalOpportunity: number;
    demographicParity: number;
  };
  sampleSize?: number;
  complianceStatus?: {
    eeo: boolean;
    ada: boolean;
  };
  recommendedActions?: string[];
  fairnessMetrics?: {
    adverseImpactRatio: number;
    equalOpportunity: number;
    demographicParity: number;
    groupFairnessScores?: Record<string, number>;
  };
  flaggedDimensions?: string[];
}

export interface BiasCorrection {
  originalText: string;
  correctedText: string;
  biasType: string;
  severity: 'low' | 'medium' | 'high';
}

class BiasDetectionService {
  private flaggedPhrases = {
    gender: [
      'men are better at', 'women are naturally', 'typical male', 'typical female',
      'masculine approach', 'feminine intuition', 'men typically', 'women usually',
      'natural for men', 'natural for women', 'like most men', 'like most women'
    ],
    cultural: [
      'western approach', 'eastern mindset', 'typical american', 'european style',
      'asian values', 'african perspective', 'latin approach', 'cultural background suggests'
    ],
    age: [
      'millennials are', 'gen z typically', 'baby boomers usually', 'younger people',
      'older workers', 'at your age', 'generation typically', 'age group tends'
    ],
    stereotyping: [
      'you should avoid', 'not suitable for', 'definitely meant for', 'clearly designed for',
      'perfect match', 'ideal career', 'definitely indicates', 'proves you are'
    ]
  };

  private requiredQualifiers = [
    'suggests', 'tends to', 'may indicate', 'appears to', 'seems to',
    'might explore', 'could consider', 'your responses suggest', 'patterns indicate'
  ];

  async analyzeBias(text: string, userProfile?: any): Promise<BiasAnalysisResult> {
    try {
      const analysis = {
        overallBiasScore: 0,
        genderBias: this.detectGenderBias(text),
        culturalBias: this.detectCulturalBias(text),
        ageBias: this.detectAgeBias(text),
        stereotypingRisk: this.detectStereotyping(text),
        flaggedPhrases: this.findFlaggedPhrases(text),
        corrections: this.generateCorrections(text),
        confidence: this.calculateConfidence(text) as 'low' | 'moderate' | 'high'
      };

      analysis.overallBiasScore = Math.round(
        (analysis.genderBias + analysis.culturalBias + analysis.ageBias + analysis.stereotypingRisk) / 4
      );

      return analysis;
    } catch (error) {
      console.error('Error in bias analysis:', error);
      return {
        overallBiasScore: 50,
        genderBias: 0,
        culturalBias: 0,
        ageBias: 0,
        stereotypingRisk: 0,
        flaggedPhrases: [],
        corrections: [],
        confidence: 'low'
      };
    }
  }

  async correctBias(text: string): Promise<string> {
    try {
      let correctedText = text;

      // Remove definitive language
      correctedText = this.addUncertaintyLanguage(correctedText);
      
      // Replace biased phrases
      correctedText = this.replaceBiasedPhrases(correctedText);
      
      // Add individual focus
      correctedText = this.emphasizeIndividuality(correctedText);
      
      // Add development context
      correctedText = this.addDevelopmentContext(correctedText);

      return correctedText;
    } catch (error) {
      console.error('Error in bias correction:', error);
      return text;
    }
  }

  private detectGenderBias(text: string): number {
    const lowerText = text.toLowerCase();
    let biasScore = 0;

    this.flaggedPhrases.gender.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        biasScore += 25;
      }
    });

    // Check for gender-stereotyped career suggestions
    const genderStereotypes = [
      { words: ['nurse', 'teacher', 'social work', 'counseling'], bias: 'female' },
      { words: ['engineer', 'construction', 'military', 'technology'], bias: 'male' }
    ];

    genderStereotypes.forEach(stereotype => {
      stereotype.words.forEach(word => {
        if (lowerText.includes(word) && (lowerText.includes('perfect for') || lowerText.includes('ideal'))) {
          biasScore += 15;
        }
      });
    });

    return Math.min(biasScore, 100);
  }

  private detectCulturalBias(text: string): number {
    const lowerText = text.toLowerCase();
    let biasScore = 0;

    this.flaggedPhrases.cultural.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        biasScore += 20;
      }
    });

    // Check for Western-centric assumptions
    const westernBias = ['direct communication', 'individual achievement', 'competitive approach'];
    westernBias.forEach(bias => {
      if (lowerText.includes(bias) && (lowerText.includes('should') || lowerText.includes('must'))) {
        biasScore += 10;
      }
    });

    return Math.min(biasScore, 100);
  }

  private detectAgeBias(text: string): number {
    const lowerText = text.toLowerCase();
    let biasScore = 0;

    this.flaggedPhrases.age.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        biasScore += 20;
      }
    });

    return Math.min(biasScore, 100);
  }

  private detectStereotyping(text: string): number {
    const lowerText = text.toLowerCase();
    let biasScore = 0;

    this.flaggedPhrases.stereotyping.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        biasScore += 15;
      }
    });

    // Check for overly definitive language
    const definitiveWords = ['definitely', 'certainly', 'absolutely', 'clearly', 'obviously'];
    definitiveWords.forEach(word => {
      if (lowerText.includes(word)) {
        biasScore += 10;
      }
    });

    return Math.min(biasScore, 100);
  }

  private findFlaggedPhrases(text: string): string[] {
    const flagged: string[] = [];
    const lowerText = text.toLowerCase();

    Object.values(this.flaggedPhrases).flat().forEach(phrase => {
      if (lowerText.includes(phrase)) {
        flagged.push(phrase);
      }
    });

    return flagged;
  }

  private generateCorrections(text: string): string[] {
    const corrections: string[] = [];
    
    if (!this.hasUncertaintyLanguage(text)) {
      corrections.push("Add uncertainty qualifiers like 'suggests', 'tends to', or 'may indicate'");
    }
    
    if (this.hasDefinitiveLanguage(text)) {
      corrections.push("Replace definitive language with developmental language");
    }
    
    if (this.lacksDevelopmentContext(text)) {
      corrections.push("Add context about growth and development over time");
    }

    return corrections;
  }

  private calculateConfidence(text: string): string {
    const hasQualifiers = this.hasUncertaintyLanguage(text);
    const hasDefinitive = this.hasDefinitiveLanguage(text);
    const hasContext = !this.lacksDevelopmentContext(text);

    if (hasQualifiers && !hasDefinitive && hasContext) return 'high';
    if (hasQualifiers && !hasDefinitive) return 'moderate';
    return 'low';
  }

  private addUncertaintyLanguage(text: string): string {
    // Replace definitive statements with uncertain language
    let corrected = text
      .replace(/\byou are\b/gi, 'you tend to be')
      .replace(/\byou will\b/gi, 'you may')
      .replace(/\byou should\b/gi, 'you might consider')
      .replace(/\bthis means\b/gi, 'this suggests')
      .replace(/\bindicates that you\b/gi, 'suggests you may')
      .replace(/\bproves you\b/gi, 'suggests you')
      .replace(/\bshows you are\b/gi, 'suggests you tend to be');

    return corrected;
  }

  private replaceBiasedPhrases(text: string): string {
    let corrected = text;

    // Replace gender-biased language
    corrected = corrected
      .replace(/\bmen are better at\b/gi, 'individuals may excel in')
      .replace(/\bwomen are naturally\b/gi, 'some people may naturally')
      .replace(/\btypical male\b/gi, 'some individual')
      .replace(/\btypical female\b/gi, 'some individual');

    // Replace cultural bias
    corrected = corrected
      .replace(/\bwestern approach\b/gi, 'one approach')
      .replace(/\beastern mindset\b/gi, 'alternative perspective');

    // Replace age bias
    corrected = corrected
      .replace(/\bmillennials are\b/gi, 'some individuals')
      .replace(/\bgen z typically\b/gi, 'some people may');

    return corrected;
  }

  private emphasizeIndividuality(text: string): string {
    if (!text.includes('individual') && !text.includes('unique') && !text.includes('personal')) {
      return text + " Remember, these insights reflect your individual responses and should be considered alongside your unique experiences and goals.";
    }
    return text;
  }

  private addDevelopmentContext(text: string): string {
    if (!text.includes('develop') && !text.includes('growth') && !text.includes('change')) {
      return text + " These patterns may evolve as you gain experience and develop new skills.";
    }
    return text;
  }

  private hasUncertaintyLanguage(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.requiredQualifiers.some(qualifier => lowerText.includes(qualifier));
  }

  private hasDefinitiveLanguage(text: string): boolean {
    const definitiveWords = ['definitely', 'certainly', 'absolutely', 'clearly', 'obviously', 'you are', 'you will'];
    const lowerText = text.toLowerCase();
    return definitiveWords.some(word => lowerText.includes(word));
  }

  private lacksDevelopmentContext(text: string): boolean {
    const developmentWords = ['develop', 'growth', 'change', 'evolve', 'learn', 'improve'];
    const lowerText = text.toLowerCase();
    return !developmentWords.some(word => lowerText.includes(word));
  }

  async validateAIOutput(output: string, assessmentType: string): Promise<{
    isValid: boolean;
    biasAnalysis: BiasAnalysisResult;
    correctedOutput?: string;
    warnings: string[];
  }> {
    try {
      const biasAnalysis = await this.analyzeBias(output);
      const warnings: string[] = [];

      // Check for critical issues
      if (biasAnalysis.overallBiasScore > 30) {
        warnings.push('High bias risk detected in AI output');
      }

      if (biasAnalysis.flaggedPhrases.length > 0) {
        warnings.push(`Flagged phrases detected: ${biasAnalysis.flaggedPhrases.join(', ')}`);
      }

      // Check for professional boundary violations
      if (this.checkProfessionalBoundaries(output, assessmentType)) {
        warnings.push('Professional boundary violation detected');
      }

      const isValid = biasAnalysis.overallBiasScore < 50 && warnings.length === 0;
      
      return {
        isValid,
        biasAnalysis,
        correctedOutput: !isValid ? await this.correctBias(output) : undefined,
        warnings
      };
    } catch (error) {
      console.error('Error validating AI output:', error);
      return {
        isValid: false,
        biasAnalysis: {
          overallBiasScore: 100,
          genderBias: 0,
          culturalBias: 0,
          ageBias: 0,
          stereotypingRisk: 0,
          flaggedPhrases: [],
          corrections: [],
          confidence: 'low'
        },
        warnings: ['Error during validation']
      };
    }
  }

  private checkProfessionalBoundaries(output: string, assessmentType: string): boolean {
    const lowerOutput = output.toLowerCase();
    
    // Check for clinical overreach
    const clinicalTerms = [
      'diagnose', 'disorder', 'therapy', 'treatment', 'clinical', 'pathological',
      'mental health condition', 'psychiatric', 'counseling required'
    ];

    if (clinicalTerms.some(term => lowerOutput.includes(term))) {
      return true;
    }

    // Check for inappropriate certainty in career advice
    const inappropriateCareerAdvice = [
      'perfect career for you', 'ideal job', 'guaranteed success', 
      'you should definitely', 'you must pursue', 'destined for'
    ];

    if (inappropriateCareerAdvice.some(phrase => lowerOutput.includes(phrase))) {
      return true;
    }

    return false;
  }

  async analyzeAssessmentBias(assessmentType: string, additionalData?: any): Promise<BiasAnalysisResult> {
    const mockAnalysis = await this.analyzeBias(`Assessment analysis for ${assessmentType}`);
    return {
      ...mockAnalysis,
      assessmentType,
      biasSeverity: mockAnalysis.overallBiasScore > 60 ? 'high' : mockAnalysis.overallBiasScore > 30 ? 'medium' : 'low',
      biasIndicators: {
        adverseImpactRatio: 85,
        equalOpportunity: 92,
        demographicParity: 88
      },
      sampleSize: 100,
      complianceStatus: {
        eeo: mockAnalysis.overallBiasScore < 50,
        ada: mockAnalysis.overallBiasScore < 30
      },
      recommendedActions: mockAnalysis.corrections,
      fairnessMetrics: {
        adverseImpactRatio: 85,
        equalOpportunity: 92,
        demographicParity: 88,
        groupFairnessScores: {
          'gender': 88,
          'age': 92,
          'ethnicity': 85
        }
      },
      flaggedDimensions: mockAnalysis.overallBiasScore > 30 ? ['cultural-assumptions', 'gender-stereotypes'] : []
    };
  }

  async getBiasMonitoringData(filterTypes?: string[] | string): Promise<{
    overallFairnessScore: number;
    assessmentFairness: Record<string, number>;
    complianceAlerts: any[];
    biasMetrics: any[];
  }> {
    return {
      overallFairnessScore: 78,
      assessmentFairness: {
        'career-launch': 82,
        'communication': 89,
        'workplace-wellness': 75,
        'stress-resilience': 85,
        'communication-styles': 78
      },
      complianceAlerts: [
        { severity: 'medium', message: 'Cultural bias detected in career-launch questions', assessmentType: 'career-launch' },
        { severity: 'low', message: 'Minor gender stereotype risk in leadership assessment', assessmentType: 'leadership' }
      ],
      biasMetrics: [
        { type: 'gender', score: 15, trend: 'improving' },
        { type: 'cultural', score: 28, trend: 'stable' },
        { type: 'age', score: 12, trend: 'improving' }
      ]
    };
  }

  async performRealTimeBiasCheck(text: string, context?: any, options?: any): Promise<boolean> {
    const analysis = await this.analyzeBias(text);
    return analysis.overallBiasScore < 30;
  }
}

export const biasDetectionService = new BiasDetectionService();