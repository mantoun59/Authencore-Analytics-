/**
 * Normative Database Service
 * Manages normative scoring data and demographic comparisons for assessments
 */

import { supabase } from '@/integrations/supabase/client';

export interface NormativeData {
  assessmentType: string;
  dimension: string;
  demographicGroup: Record<string, any>;
  sampleSize: number;
  dataPoints: number[];
  meanScore: number;
  stdDeviation: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  dataQualityScore: number;
}

export interface DemographicProfile {
  ageRange: string;
  gender: string;
  educationLevel: string;
  workExperience: string;
  industry: string;
  country: string;
  culturalBackground?: string;
  primaryLanguage?: string;
}

export interface NormativeResult {
  percentile: number;
  normativeGroup: Record<string, any>;
  sampleSize: number;
  dataAvailable: boolean;
  meanScore: number;
  yourScore: number;
  scoreInterpretation: 'exceptional' | 'above_average' | 'average' | 'below_average' | 'needs_development';
  comparison: {
    betterThanPercent: number;
    similarScoreRange: [number, number];
    improvementPotential: string;
  };
}

export class NormativeDatabaseService {
  private static instance: NormativeDatabaseService;

  static getInstance(): NormativeDatabaseService {
    if (!this.instance) {
      this.instance = new NormativeDatabaseService();
    }
    return this.instance;
  }

  /**
   * Get normative percentile for a score
   */
  async getNormativePercentile(
    assessmentType: string,
    dimension: string,
    score: number,
    demographics: Partial<DemographicProfile> = {}
  ): Promise<NormativeResult> {
    try {
      const { data, error } = await supabase.rpc('get_normative_percentiles', {
        p_assessment_type: assessmentType,
        p_dimension: dimension,
        p_score: score,
        p_demographics: demographics
      });

      if (error) {
        console.error('Error fetching normative percentiles:', error);
        return this.getDefaultNormativeResult(score);
      }

      const result = data as any;
      return {
        percentile: result.percentile || 50,
        normativeGroup: result.normative_group || {},
        sampleSize: result.sample_size || 0,
        dataAvailable: result.data_available || false,
        meanScore: result.mean_score || 50,
        yourScore: result.your_score || score,
        scoreInterpretation: result.score_interpretation || 'average',
        comparison: {
          betterThanPercent: result.percentile || 50,
          similarScoreRange: this.calculateSimilarScoreRange(result.mean_score || 50, score),
          improvementPotential: this.getImprovementPotential(result.percentile || 50)
        }
      };
    } catch (error) {
      console.error('Error in getNormativePercentile:', error);
      return this.getDefaultNormativeResult(score);
    }
  }

  /**
   * Add or update normative data
   */
  async addNormativeData(data: NormativeData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('normative_databases')
        .upsert({
          assessment_type: data.assessmentType,
          dimension: data.dimension,
          demographic_group: data.demographicGroup,
          sample_size: data.sampleSize,
          data_points: data.dataPoints,
          mean_score: data.meanScore,
          std_deviation: data.stdDeviation,
          percentile_25: data.percentiles.p25,
          percentile_50: data.percentiles.p50,
          percentile_75: data.percentiles.p75,
          percentile_90: data.percentiles.p90,
          data_quality_score: data.dataQualityScore
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
   * Get normative data for analysis
   */
  async getNormativeData(
    assessmentType: string,
    dimension?: string
  ): Promise<NormativeData[]> {
    try {
      let query = supabase
        .from('normative_databases')
        .select('*')
        .eq('assessment_type', assessmentType)
        .eq('is_active', true);

      if (dimension) {
        query = query.eq('dimension', dimension);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching normative data:', error);
        return [];
      }

      return data.map(item => ({
        assessmentType: item.assessment_type,
        dimension: item.dimension,
        demographicGroup: (item.demographic_group as any) || {},
        sampleSize: item.sample_size,
        dataPoints: item.data_points,
        meanScore: item.mean_score,
        stdDeviation: item.std_deviation,
        percentiles: {
          p25: item.percentile_25,
          p50: item.percentile_50,
          p75: item.percentile_75,
          p90: item.percentile_90
        },
        dataQualityScore: item.data_quality_score
      }));
    } catch (error) {
      console.error('Error in getNormativeData:', error);
      return [];
    }
  }

  /**
   * Store user demographics for future normative analysis
   */
  async storeDemographics(
    assessmentResultId: string,
    demographics: DemographicProfile,
    consentForResearch: boolean = false
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('assessment_demographics')
        .insert({
          assessment_result_id: assessmentResultId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          age_range: demographics.ageRange,
          gender: demographics.gender,
          education_level: demographics.educationLevel,
          work_experience: demographics.workExperience,
          industry: demographics.industry,
          country: demographics.country,
          cultural_background: demographics.culturalBackground,
          primary_language: demographics.primaryLanguage,
          consent_for_research: consentForResearch
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
   * Calculate enriched percentiles for multiple dimensions
   */
  async getEnrichedPercentiles(
    assessmentType: string,
    dimensionScores: Record<string, number>,
    demographics: Partial<DemographicProfile> = {}
  ): Promise<Record<string, NormativeResult>> {
    const results: Record<string, NormativeResult> = {};
    
    for (const [dimension, score] of Object.entries(dimensionScores)) {
      results[dimension] = await this.getNormativePercentile(
        assessmentType,
        dimension,
        score,
        demographics
      );
    }

    return results;
  }

  /**
   * Private helper methods
   */
  private getDefaultNormativeResult(score: number): NormativeResult {
    return {
      percentile: 50,
      normativeGroup: { type: 'general' },
      sampleSize: 0,
      dataAvailable: false,
      meanScore: 50,
      yourScore: score,
      scoreInterpretation: score >= 70 ? 'above_average' : score >= 30 ? 'average' : 'below_average',
      comparison: {
        betterThanPercent: 50,
        similarScoreRange: [score - 10, score + 10],
        improvementPotential: 'Limited data available for comparison'
      }
    };
  }

  private calculateSimilarScoreRange(meanScore: number, yourScore: number): [number, number] {
    const range = Math.abs(yourScore - meanScore) * 0.1 + 5;
    return [Math.max(0, yourScore - range), Math.min(100, yourScore + range)];
  }

  private getImprovementPotential(percentile: number): string {
    if (percentile >= 90) return 'Maintain excellence and mentor others';
    if (percentile >= 75) return 'Strong performance with room for advanced growth';
    if (percentile >= 50) return 'Good foundation with clear improvement opportunities';
    if (percentile >= 25) return 'Significant development potential with focused effort';
    return 'High improvement potential with structured development plan';
  }
}

export const normativeService = NormativeDatabaseService.getInstance();