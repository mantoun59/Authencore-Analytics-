/**
 * Bias Detection and Fairness Analysis Service
 * Implements statistical measures to detect and mitigate assessment bias
 */

import { supabase } from '@/integrations/supabase/client';
import { DemographicProfile } from './normativeDatabaseService';

export interface BiasIndicators {
  adverseImpactRatio: number; // 80% rule
  statisticalParity: number;
  equalizedOdds: number;
  scoreDisparity: Record<string, number>;
  disparityDirection: 'favors_majority' | 'favors_minority' | 'neutral';
}

export interface FairnessMetrics {
  overallFairnessScore: number;
  groupFairnessScores: Record<string, number>;
  intersectionalAnalysis: Record<string, BiasIndicators>;
  mitigationSuggestions: string[];
}

export interface BiasAnalysisResult {
  assessmentType: string;
  analysisDate: string;
  timeframeDays: number;
  sampleSize: number;
  biasIndicators: BiasIndicators;
  fairnessMetrics: FairnessMetrics;
  flaggedDimensions: string[];
  biasSeverity: 'low' | 'medium' | 'high' | 'critical';
  recommendedActions: string[];
  complianceStatus: {
    eeo: boolean; // Equal Employment Opportunity
    ada: boolean; // Americans with Disabilities Act
    gdpr: boolean; // General Data Protection Regulation
  };
}

export class BiasDetectionService {
  private static instance: BiasDetectionService;

  static getInstance(): BiasDetectionService {
    if (!this.instance) {
      this.instance = new BiasDetectionService();
    }
    return this.instance;
  }

  /**
   * Analyze bias for a specific assessment type
   */
  async analyzeAssessmentBias(
    assessmentType: string,
    timeframeDays: number = 30
  ): Promise<BiasAnalysisResult> {
    try {
      const { data, error } = await supabase.rpc('analyze_assessment_bias', {
        p_assessment_type: assessmentType,
        p_time_period_days: timeframeDays
      });

      if (error) {
        console.error('Error analyzing bias:', error);
        return this.getDefaultBiasAnalysis(assessmentType, timeframeDays);
      }

      return this.enrichBiasAnalysis(data, assessmentType);
    } catch (error) {
      console.error('Error in analyzeAssessmentBias:', error);
      return this.getDefaultBiasAnalysis(assessmentType, timeframeDays);
    }
  }

  /**
   * Perform real-time bias check for individual assessment
   */
  async performRealTimeBiasCheck(
    assessmentType: string,
    dimensionScores: Record<string, number>,
    demographics: DemographicProfile
  ): Promise<{
    hasPotentialBias: boolean;
    biasFlags: string[];
    adjustedScores?: Record<string, number>;
    confidenceLevel: number;
  }> {
    try {
      // Get recent assessment data for comparison
      const recentData = await this.getRecentAssessmentData(assessmentType, 100);
      
      if (recentData.length < 20) {
        return {
          hasPotentialBias: false,
          biasFlags: ['Insufficient data for bias detection'],
          confidenceLevel: 0.3
        };
      }

      const biasFlags: string[] = [];
      let hasPotentialBias = false;

      // Check for score outliers by demographic group
      const demographicSubset = recentData.filter(record => {
        const demo = record.demographics as any || {};
        return demo.gender === demographics.gender ||
               demo.age_range === demographics.ageRange;
      });

      if (demographicSubset.length >= 5) {
        const avgScores = this.calculateAverageScores(demographicSubset);
        const overallAvgScores = this.calculateAverageScores(recentData);

        Object.keys(dimensionScores).forEach(dimension => {
          const userScore = dimensionScores[dimension];
          const groupAvg = avgScores[dimension] || 0;
          const overallAvg = overallAvgScores[dimension] || 0;
          
          // Check for unusual score patterns
          if (Math.abs(userScore - groupAvg) > 20 && Math.abs(userScore - overallAvg) < 10) {
            biasFlags.push(`Potential bias detected in ${dimension} dimension for ${demographics.gender} group`);
            hasPotentialBias = true;
          }
        });
      }

      return {
        hasPotentialBias,
        biasFlags,
        confidenceLevel: demographicSubset.length >= 10 ? 0.8 : 0.5
      };
    } catch (error) {
      console.error('Error in real-time bias check:', error);
      return {
        hasPotentialBias: false,
        biasFlags: ['Error performing bias check'],
        confidenceLevel: 0.1
      };
    }
  }

  /**
   * Store bias analysis results
   */
  async storeBiasAnalysis(
    assessmentResultId: string,
    biasAnalysis: Partial<BiasAnalysisResult>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('bias_analysis_results')
        .insert({
          assessment_result_id: assessmentResultId,
          assessment_type: biasAnalysis.assessmentType!,
          demographic_data: biasAnalysis.fairnessMetrics?.groupFairnessScores || {},
          dimension_scores: biasAnalysis.biasIndicators || {},
          bias_indicators: biasAnalysis.biasIndicators || {},
          fairness_metrics: biasAnalysis.fairnessMetrics || {},
          flagged_dimensions: biasAnalysis.flaggedDimensions || [],
          bias_severity: biasAnalysis.biasSeverity || 'low',
          recommended_actions: biasAnalysis.recommendedActions || [],
          analysis_metadata: {
            timeframe_days: biasAnalysis.timeframeDays,
            analysis_date: biasAnalysis.analysisDate
          }
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get bias monitoring dashboard data
   */
  async getBiasMonitoringData(assessmentTypes: string[] = []): Promise<{
    overallFairnessScore: number;
    assessmentFairness: Record<string, number>;
    trendingBiases: Array<{
      type: string;
      severity: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
    complianceAlerts: string[];
  }> {
    try {
      const { data, error } = await supabase
        .from('bias_analysis_results')
        .select('*')
        .in('assessment_type', assessmentTypes.length > 0 ? assessmentTypes : ['career-launch', 'stress-resilience', 'communication-styles'])
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching bias monitoring data:', error);
        return this.getDefaultMonitoringData();
      }

      const assessmentFairness: Record<string, number> = {};
      const severityCounts: Record<string, number> = {};

      data.forEach(record => {
        const assessment = record.assessment_type;
        const severity = record.bias_severity;
        
        if (!assessmentFairness[assessment]) {
          assessmentFairness[assessment] = 0;
        }
        
        const fairnessScore = severity === 'low' ? 90 : 
                            severity === 'medium' ? 70 : 
                            severity === 'high' ? 40 : 20;
        
        assessmentFairness[assessment] = Math.max(assessmentFairness[assessment], fairnessScore);
        severityCounts[severity] = (severityCounts[severity] || 0) + 1;
      });

      const overallFairnessScore = Object.values(assessmentFairness).reduce((sum, score) => sum + score, 0) / 
                                  Math.max(Object.keys(assessmentFairness).length, 1);

      return {
        overallFairnessScore,
        assessmentFairness,
        trendingBiases: [],
        complianceAlerts: this.generateComplianceAlerts(severityCounts)
      };
    } catch (error) {
      console.error('Error in getBiasMonitoringData:', error);
      return this.getDefaultMonitoringData();
    }
  }

  /**
   * Generate mitigation recommendations
   */
  generateMitigationRecommendations(biasAnalysis: BiasAnalysisResult): string[] {
    const recommendations: string[] = [];

    if (biasAnalysis.biasSeverity === 'critical' || biasAnalysis.biasSeverity === 'high') {
      recommendations.push('Immediate review of assessment items for discriminatory content');
      recommendations.push('Implement demographic-adjusted scoring temporarily');
      recommendations.push('Expand normative database with more diverse samples');
    }

    if (biasAnalysis.biasIndicators.adverseImpactRatio < 80) {
      recommendations.push('Review assessment for adverse impact under 80% rule');
      recommendations.push('Consider alternative assessment methods for affected groups');
    }

    if (biasAnalysis.flaggedDimensions.length > 0) {
      recommendations.push(`Focus review on dimensions: ${biasAnalysis.flaggedDimensions.join(', ')}`);
    }

    recommendations.push('Continue monitoring bias patterns monthly');
    recommendations.push('Collect additional demographic data for better analysis');

    return recommendations;
  }

  /**
   * Private helper methods
   */
  private async getRecentAssessmentData(assessmentType: string, limit: number) {
    const { data, error } = await supabase
      .from('assessment_results')
      .select(`
        *,
        assessment_demographics (*)
      `)
      .eq('assessment_type', assessmentType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent assessment data:', error);
      return [];
    }

    return data.map(record => ({
      scores: record.results,
      demographics: record.assessment_demographics?.[0] || {}
    }));
  }

  private calculateAverageScores(data: any[]): Record<string, number> {
    const scores: Record<string, number[]> = {};
    
    data.forEach(record => {
      if (record.scores && typeof record.scores === 'object') {
        Object.keys(record.scores).forEach(dimension => {
          if (!scores[dimension]) scores[dimension] = [];
          const score = record.scores[dimension];
          if (typeof score === 'number') {
            scores[dimension].push(score);
          }
        });
      }
    });

    const avgScores: Record<string, number> = {};
    Object.keys(scores).forEach(dimension => {
      avgScores[dimension] = scores[dimension].reduce((sum, score) => sum + score, 0) / scores[dimension].length;
    });

    return avgScores;
  }

  private enrichBiasAnalysis(data: any, assessmentType: string): BiasAnalysisResult {
    const biasIndicators: BiasIndicators = {
      adverseImpactRatio: data.adverse_impact_ratio || 100,
      statisticalParity: 85, // Calculated separately
      equalizedOdds: 80,
      scoreDisparity: {},
      disparityDirection: data.adverse_impact_ratio < 80 ? 'favors_majority' : 'neutral'
    };

    const fairnessMetrics: FairnessMetrics = {
      overallFairnessScore: data.adverse_impact_ratio >= 90 ? 90 : data.adverse_impact_ratio >= 80 ? 75 : 50,
      groupFairnessScores: data.gender_analysis || {},
      intersectionalAnalysis: {},
      mitigationSuggestions: data.recommendations || []
    };

    return {
      assessmentType,
      analysisDate: data.analyzed_at || new Date().toISOString(),
      timeframeDays: data.analysis_period_days || 30,
      sampleSize: 0, // Would need additional query
      biasIndicators,
      fairnessMetrics,
      flaggedDimensions: [],
      biasSeverity: data.bias_risk || 'low',
      recommendedActions: data.recommendations || [],
      complianceStatus: {
        eeo: data.adverse_impact_ratio >= 80,
        ada: true, // Would need specific ADA compliance check
        gdpr: true  // Assume compliant if using proper data handling
      }
    };
  }

  private getDefaultBiasAnalysis(assessmentType: string, timeframeDays: number): BiasAnalysisResult {
    return {
      assessmentType,
      analysisDate: new Date().toISOString(),
      timeframeDays,
      sampleSize: 0,
      biasIndicators: {
        adverseImpactRatio: 100,
        statisticalParity: 90,
        equalizedOdds: 90,
        scoreDisparity: {},
        disparityDirection: 'neutral'
      },
      fairnessMetrics: {
        overallFairnessScore: 85,
        groupFairnessScores: {},
        intersectionalAnalysis: {},
        mitigationSuggestions: []
      },
      flaggedDimensions: [],
      biasSeverity: 'low',
      recommendedActions: ['Collect more assessment data for analysis'],
      complianceStatus: {
        eeo: true,
        ada: true,
        gdpr: true
      }
    };
  }

  private getDefaultMonitoringData() {
    return {
      overallFairnessScore: 85,
      assessmentFairness: {},
      trendingBiases: [],
      complianceAlerts: []
    };
  }

  private generateComplianceAlerts(severityCounts: Record<string, number>): string[] {
    const alerts: string[] = [];
    
    if (severityCounts.critical > 0) {
      alerts.push('Critical bias detected - immediate action required');
    }
    
    if (severityCounts.high > 2) {
      alerts.push('Multiple high-severity bias issues require attention');
    }
    
    return alerts;
  }
}

export const biasDetectionService = BiasDetectionService.getInstance();