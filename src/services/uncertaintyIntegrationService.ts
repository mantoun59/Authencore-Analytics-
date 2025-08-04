import { toast } from "sonner";

export interface ConfidenceMetrics {
  dataQuality: number; // 0-100
  responseConsistency: number; // 0-100
  sampleSize: number;
  measurementError: number;
  overallConfidence: 'low' | 'moderate' | 'high';
}

export interface UncertaintyReport {
  primaryInsight: string;
  confidence: ConfidenceMetrics;
  alternatives: string[];
  limitations: string[];
  contextualFactors: string[];
  developmentNote: string;
}

class UncertaintyIntegrationService {
  private confidenceThresholds = {
    high: 80,
    moderate: 60,
    low: 0
  };

  private uncertaintyPhrases = {
    high: ['suggests', 'indicates', 'your responses show'],
    moderate: ['may suggest', 'tends to indicate', 'appears to show'],
    low: ['might suggest', 'could indicate', 'preliminary patterns suggest']
  };

  calculateConfidenceMetrics(
    responses: any[],
    completionRate: number,
    responseTime: number,
    consistencyScore?: number
  ): ConfidenceMetrics {
    try {
      // Calculate data quality based on completion and response patterns
      const dataQuality = Math.min(
        completionRate * 0.6 + 
        this.calculateResponseTimeQuality(responseTime) * 0.4, 
        100
      );

      // Calculate response consistency
      const responseConsistency = consistencyScore || this.calculateConsistency(responses);

      // Calculate sample size adequacy
      const sampleSize = Math.min((responses.length / 30) * 100, 100); // 30+ responses ideal

      // Estimate measurement error
      const measurementError = Math.max(
        100 - (dataQuality + responseConsistency + sampleSize) / 3,
        5 // Minimum 5% error
      );

      // Overall confidence level
      const overallScore = (dataQuality + responseConsistency + sampleSize) / 3;
      const overallConfidence = 
        overallScore >= this.confidenceThresholds.high ? 'high' :
        overallScore >= this.confidenceThresholds.moderate ? 'moderate' : 'low';

      return {
        dataQuality: Math.round(dataQuality),
        responseConsistency: Math.round(responseConsistency),
        sampleSize: responses.length,
        measurementError: Math.round(measurementError),
        overallConfidence
      };
    } catch (error) {
      console.error('Error calculating confidence metrics:', error);
      return {
        dataQuality: 50,
        responseConsistency: 50,
        sampleSize: responses.length,
        measurementError: 50,
        overallConfidence: 'low'
      };
    }
  }

  generateUncertaintyReport(
    insight: string,
    confidence: ConfidenceMetrics,
    assessmentType: string,
    dimensions: any[]
  ): UncertaintyReport {
    try {
      const primaryInsight = this.addUncertaintyLanguage(insight, confidence.overallConfidence);
      const alternatives = this.generateAlternatives(dimensions, confidence);
      const limitations = this.generateLimitations(confidence, assessmentType);
      const contextualFactors = this.generateContextualFactors(assessmentType);
      const developmentNote = this.generateDevelopmentNote(assessmentType);

      return {
        primaryInsight,
        confidence,
        alternatives,
        limitations,
        contextualFactors,
        developmentNote
      };
    } catch (error) {
      console.error('Error generating uncertainty report:', error);
      return {
        primaryInsight: insight,
        confidence,
        alternatives: [],
        limitations: ['Analysis limited due to processing error'],
        contextualFactors: [],
        developmentNote: 'These insights should be considered preliminary.'
      };
    }
  }

  addConfidenceIntervals(score: number, confidence: ConfidenceMetrics): {
    score: number;
    lowerBound: number;
    upperBound: number;
    interpretation: string;
  } {
    try {
      const errorMargin = confidence.measurementError;
      const lowerBound = Math.max(0, score - errorMargin);
      const upperBound = Math.min(100, score + errorMargin);

      const interpretation = this.generateScoreInterpretation(
        score, 
        lowerBound, 
        upperBound, 
        confidence.overallConfidence
      );

      return {
        score,
        lowerBound: Math.round(lowerBound),
        upperBound: Math.round(upperBound),
        interpretation
      };
    } catch (error) {
      console.error('Error adding confidence intervals:', error);
      return {
        score,
        lowerBound: score - 10,
        upperBound: score + 10,
        interpretation: 'Score interpretation unavailable due to processing error'
      };
    }
  }

  private calculateResponseTimeQuality(avgResponseTime: number): number {
    // Optimal response time: 15-45 seconds per question
    if (avgResponseTime < 5) return 20; // Too fast, likely not thoughtful
    if (avgResponseTime < 10) return 60; // Fast but acceptable
    if (avgResponseTime <= 45) return 100; // Optimal range
    if (avgResponseTime <= 90) return 80; // Slower but acceptable
    if (avgResponseTime <= 180) return 60; // Very slow
    return 30; // Extremely slow, may indicate distraction
  }

  private calculateConsistency(responses: any[]): number {
    try {
      // Simple consistency check based on response variance
      if (responses.length < 10) return 50;

      const numericResponses = responses
        .map(r => typeof r === 'number' ? r : r?.value || r?.answer || 0)
        .filter(r => typeof r === 'number');

      if (numericResponses.length < 5) return 50;

      // Check for straight-lining (all same answers)
      const uniqueValues = new Set(numericResponses);
      if (uniqueValues.size === 1) return 10; // Very low consistency (straight-lining)

      // Calculate variance
      const mean = numericResponses.reduce((a, b) => a + b, 0) / numericResponses.length;
      const variance = numericResponses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericResponses.length;
      
      // Normalize variance to 0-100 scale (higher variance = more consistent/thoughtful responses)
      const normalizedVariance = Math.min(variance * 20, 100);
      
      return Math.max(normalizedVariance, 30); // Minimum 30% consistency
    } catch (error) {
      console.error('Error calculating consistency:', error);
      return 50;
    }
  }

  private addUncertaintyLanguage(insight: string, confidence: 'low' | 'moderate' | 'high'): string {
    const phrases = this.uncertaintyPhrases[confidence];
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // If insight doesn't already start with uncertainty language, add it
    const lowerInsight = insight.toLowerCase();
    const hasUncertainty = this.uncertaintyPhrases.high
      .concat(this.uncertaintyPhrases.moderate, this.uncertaintyPhrases.low)
      .some(phrase => lowerInsight.startsWith(phrase.toLowerCase()));

    if (!hasUncertainty) {
      return `${selectedPhrase.charAt(0).toUpperCase() + selectedPhrase.slice(1)} ${insight.toLowerCase()}`;
    }

    return insight;
  }

  private generateAlternatives(dimensions: any[], confidence: ConfidenceMetrics): string[] {
    try {
      const alternatives: string[] = [];

      if (confidence.overallConfidence === 'low') {
        alternatives.push('Multiple patterns are possible based on your responses');
        alternatives.push('Additional assessment may provide clearer insights');
      } else if (confidence.overallConfidence === 'moderate') {
        // Find second-highest dimensions as alternatives
        const sortedDimensions = dimensions
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(1, 3);
        
        sortedDimensions.forEach(dim => {
          alternatives.push(`You also show tendencies toward ${dim.name || dim.dimension}`);
        });
      }

      if (alternatives.length === 0) {
        alternatives.push('These patterns may vary in different contexts or situations');
      }

      return alternatives;
    } catch (error) {
      console.error('Error generating alternatives:', error);
      return ['Alternative patterns may emerge with additional data'];
    }
  }

  private generateLimitations(confidence: ConfidenceMetrics, assessmentType: string): string[] {
    const limitations: string[] = [];

    if (confidence.dataQuality < 70) {
      limitations.push('Results based on limited response data');
    }

    if (confidence.responseConsistency < 60) {
      limitations.push('Response patterns show some inconsistency');
    }

    if (confidence.sampleSize < 20) {
      limitations.push('Insights based on relatively few questions');
    }

    // Assessment-specific limitations
    switch (assessmentType) {
      case 'career-launch':
        limitations.push('Career interests may evolve with experience and exposure');
        break;
      case 'communication':
        limitations.push('Communication style varies significantly across different contexts');
        break;
      case 'cultural-intelligence':
        limitations.push('Cultural intelligence develops through experience and exposure');
        break;
      case 'emotional-intelligence':
        limitations.push('Self-reported emotional insights have inherent limitations');
        break;
      case 'leadership':
        limitations.push('Leadership effectiveness depends heavily on context and team');
        break;
    }

    limitations.push('These insights represent patterns at one point in time');
    limitations.push('Individual differences are more complex than any assessment can capture');

    return limitations;
  }

  private generateContextualFactors(assessmentType: string): string[] {
    const baseFactors = [
      'Your current life stage and experiences',
      'Recent changes in your work or personal situation',
      'Your mood and energy level when taking the assessment',
      'Cultural and social influences on your responses'
    ];

    const assessmentSpecific: { [key: string]: string[] } = {
      'career-launch': [
        'Your exposure to different career paths and opportunities',
        'Economic and industry trends affecting career choices',
        'Educational background and skill development opportunities'
      ],
      'communication': [
        'The specific relationships and teams you work with',
        'Organizational culture and communication norms',
        'Power dynamics and hierarchy in your workplace'
      ],
      'workplace-wellness': [
        'Current workload and job demands',
        'Work-life balance and personal stressors',
        'Organizational support and resources available'
      ],
      'leadership': [
        'Your current role and leadership responsibilities',
        'The maturity and experience level of your team',
        'Organizational culture and leadership expectations'
      ]
    };

    return [...baseFactors, ...(assessmentSpecific[assessmentType] || [])];
  }

  private generateDevelopmentNote(assessmentType: string): string {
    const baseNote = 'Professional development is an ongoing journey. ';
    
    const assessmentSpecific: { [key: string]: string } = {
      'career-launch': 'Your interests, skills, and values will continue to evolve as you gain experience and explore new opportunities.',
      'communication': 'Communication skills can be developed and adapted for different situations and relationships.',
      'workplace-wellness': 'Wellness patterns can improve with intentional strategies and environmental changes.',
      'leadership': 'Leadership capabilities develop through practice, feedback, and diverse experiences.',
      'cultural-intelligence': 'Cultural intelligence grows through exposure, reflection, and conscious practice.',
      default: 'These insights provide a starting point for continued growth and self-reflection.'
    };

    return baseNote + (assessmentSpecific[assessmentType] || assessmentSpecific.default);
  }

  private generateScoreInterpretation(
    score: number, 
    lowerBound: number, 
    upperBound: number, 
    confidence: 'low' | 'moderate' | 'high'
  ): string {
    const range = upperBound - lowerBound;
    const confidenceText = {
      high: 'with high confidence',
      moderate: 'with moderate confidence',
      low: 'with limited confidence'
    }[confidence];

    if (range <= 10) {
      return `Your score suggests ${this.getScoreDescription(score)} ${confidenceText}.`;
    } else if (range <= 20) {
      return `Your score likely falls between ${lowerBound} and ${upperBound}, suggesting ${this.getScoreDescription(score)} ${confidenceText}.`;
    } else {
      return `Your score has a wide range of ${lowerBound}-${upperBound}, indicating ${this.getScoreDescription(score)} with significant uncertainty.`;
    }
  }

  private getScoreDescription(score: number): string {
    if (score >= 80) return 'strong preferences or capabilities in this area';
    if (score >= 60) return 'moderate preferences or developing capabilities';
    if (score >= 40) return 'emerging patterns or balanced preferences';
    return 'less pronounced preferences in this area';
  }

  integrateProfessionalBoundaries(report: UncertaintyReport, assessmentType: string): UncertaintyReport {
    const boundaryNotes = {
      'emotional-intelligence': 'These insights reflect self-reported preferences and should not be interpreted as clinical or diagnostic information.',
      'workplace-wellness': 'This assessment focuses on workplace patterns and should not be used for clinical or medical evaluation.',
      'cultural-intelligence': 'Cultural intelligence is complex and context-dependent. These insights should complement, not replace, cultural learning and experience.',
      default: 'These insights are for professional development purposes and should be considered alongside other information and professional guidance.'
    };

    const boundaryNote = boundaryNotes[assessmentType] || boundaryNotes.default;
    
    return {
      ...report,
      limitations: [...report.limitations, boundaryNote]
    };
  }
}

export const uncertaintyIntegrationService = new UncertaintyIntegrationService();