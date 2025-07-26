/**
 * Sample Normative Data Generator
 * Creates representative normative data for assessments across different demographic groups
 */

import { normativeService, NormativeData } from '@/services/normativeDatabaseService';

// Helper function to generate normal distribution data
const generateNormalDistribution = (mean: number, stdDev: number, size: number): number[] => {
  const data: number[] = [];
  for (let i = 0; i < size; i++) {
    // Box-Muller transformation for normal distribution
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    let value = Math.round(mean + stdDev * z0);
    // Clamp values to 0-100 range
    data.push(Math.max(0, Math.min(100, value)));
  }
  return data.sort((a, b) => a - b);
};

// Calculate percentiles from data array
const calculatePercentiles = (data: number[]): { p25: number; p50: number; p75: number; p90: number } => {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  
  return {
    p25: sorted[Math.floor(n * 0.25)],
    p50: sorted[Math.floor(n * 0.50)],
    p75: sorted[Math.floor(n * 0.75)],
    p90: sorted[Math.floor(n * 0.90)]
  };
};

// Calculate mean and standard deviation
const calculateStats = (data: number[]): { mean: number; stdDev: number } => {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  return { mean, stdDev: Math.sqrt(variance) };
};

export const generateSampleNormativeData = async (): Promise<void> => {
  console.log('Generating sample normative data...');

  const assessmentTypes = ['career-launch', 'stress-resilience', 'communication-styles'];
  
  const demographicGroups = [
    // General population
    { type: 'general' },
    
    // Age groups
    { type: 'age_specific', age_range: '18-24' },
    { type: 'age_specific', age_range: '25-34' },
    { type: 'age_specific', age_range: '35-44' },
    { type: 'age_specific', age_range: '45-54' },
    
    // Gender groups
    { type: 'gender_specific', gender: 'male' },
    { type: 'gender_specific', gender: 'female' },
    { type: 'gender_specific', gender: 'non-binary' },
    
    // Education levels
    { type: 'education_specific', education_level: 'high_school' },
    { type: 'education_specific', education_level: 'bachelor' },
    { type: 'education_specific', education_level: 'master' },
    { type: 'education_specific', education_level: 'phd' },
    
    // Work experience
    { type: 'experience_specific', work_experience: '0-2' },
    { type: 'experience_specific', work_experience: '3-5' },
    { type: 'experience_specific', work_experience: '6-10' },
    { type: 'experience_specific', work_experience: '10+' },
    
    // Industry
    { type: 'industry_specific', industry: 'technology' },
    { type: 'industry_specific', industry: 'healthcare' },
    { type: 'industry_specific', industry: 'finance' },
    { type: 'industry_specific', industry: 'education' },
    { type: 'industry_specific', industry: 'manufacturing' },
    
    // Intersectional groups
    { type: 'intersectional', gender: 'female', age_range: '25-34', education_level: 'bachelor' },
    { type: 'intersectional', gender: 'male', age_range: '35-44', education_level: 'master' },
    { type: 'intersectional', gender: 'non-binary', age_range: '18-24', education_level: 'bachelor' }
  ];

  const dimensionConfigs = {
    'career-launch': [
      { name: 'skill_readiness', baseMean: 65, baseStdDev: 15 },
      { name: 'workplace_maturity', baseMean: 70, baseStdDev: 12 },
      { name: 'communication_skills', baseMean: 68, baseStdDev: 14 },
      { name: 'problem_solving', baseMean: 72, baseStdDev: 13 },
      { name: 'leadership_potential', baseMean: 60, baseStdDev: 16 },
      { name: 'adaptability', baseMean: 75, baseStdDev: 11 }
    ],
    'stress-resilience': [
      { name: 'emotional_regulation', baseMean: 68, baseStdDev: 14 },
      { name: 'cognitive_flexibility', baseMean: 70, baseStdDev: 13 },
      { name: 'physical_resilience', baseMean: 65, baseStdDev: 15 },
      { name: 'social_support', baseMean: 72, baseStdDev: 12 },
      { name: 'adaptability', baseMean: 69, baseStdDev: 14 },
      { name: 'performance_stability', baseMean: 66, baseStdDev: 16 }
    ],
    'communication-styles': [
      { name: 'direct_communication', baseMean: 65, baseStdDev: 16 },
      { name: 'collaborative_style', baseMean: 73, baseStdDev: 12 },
      { name: 'supportive_approach', baseMean: 71, baseStdDev: 13 },
      { name: 'analytical_precision', baseMean: 67, baseStdDev: 15 }
    ]
  };

  // Apply demographic adjustments to base means
  const getDemographicAdjustedMean = (baseMean: number, group: any, dimension: string): number => {
    let adjustedMean = baseMean;
    
    // Age adjustments
    if (group.age_range) {
      switch (group.age_range) {
        case '18-24':
          adjustedMean -= 5; // Younger individuals typically score lower on workplace maturity
          break;
        case '25-34':
          adjustedMean += 2;
          break;
        case '35-44':
          adjustedMean += 5;
          break;
        case '45-54':
          adjustedMean += 3;
          break;
      }
    }
    
    // Education adjustments
    if (group.education_level) {
      switch (group.education_level) {
        case 'high_school':
          adjustedMean -= 8;
          break;
        case 'bachelor':
          adjustedMean += 2;
          break;
        case 'master':
          adjustedMean += 6;
          break;
        case 'phd':
          adjustedMean += 10;
          break;
      }
    }
    
    // Experience adjustments
    if (group.work_experience) {
      switch (group.work_experience) {
        case '0-2':
          adjustedMean -= 10;
          break;
        case '3-5':
          adjustedMean += 0;
          break;
        case '6-10':
          adjustedMean += 8;
          break;
        case '10+':
          adjustedMean += 12;
          break;
      }
    }
    
    // Industry-specific adjustments
    if (group.industry) {
      switch (group.industry) {
        case 'technology':
          if (dimension.includes('problem_solving') || dimension.includes('adaptability')) {
            adjustedMean += 8;
          }
          break;
        case 'healthcare':
          if (dimension.includes('communication') || dimension.includes('supportive')) {
            adjustedMean += 6;
          }
          break;
        case 'finance':
          if (dimension.includes('analytical') || dimension.includes('direct')) {
            adjustedMean += 7;
          }
          break;
      }
    }
    
    return Math.max(20, Math.min(95, adjustedMean)); // Keep within reasonable bounds
  };

  const getSampleSize = (group: any): number => {
    // Larger samples for general population, smaller for specific intersectional groups
    switch (group.type) {
      case 'general': return 500;
      case 'age_specific':
      case 'gender_specific': return 200;
      case 'education_specific':
      case 'experience_specific':
      case 'industry_specific': return 150;
      case 'intersectional': return 75;
      default: return 100;
    }
  };

  try {
    const normativeDatasets: NormativeData[] = [];

    for (const assessmentType of assessmentTypes) {
      const dimensions = dimensionConfigs[assessmentType];
      
      for (const dimension of dimensions) {
        for (const group of demographicGroups) {
          const sampleSize = getSampleSize(group);
          const adjustedMean = getDemographicAdjustedMean(dimension.baseMean, group, dimension.name);
          const dataPoints = generateNormalDistribution(adjustedMean, dimension.baseStdDev, sampleSize);
          const stats = calculateStats(dataPoints);
          const percentiles = calculatePercentiles(dataPoints);
          
          const normativeData: NormativeData = {
            assessmentType,
            dimension: dimension.name,
            demographicGroup: group,
            sampleSize,
            dataPoints,
            meanScore: stats.mean,
            stdDeviation: stats.stdDev,
            percentiles,
            dataQualityScore: calculateDataQuality(sampleSize, stats.stdDev)
          };
          
          normativeDatasets.push(normativeData);
        }
      }
    }

    // Add normative data to database
    console.log(`Generated ${normativeDatasets.length} normative datasets`);
    
    let addedCount = 0;
    for (const dataset of normativeDatasets) {
      const result = await normativeService.addNormativeData(dataset);
      if (result.success) {
        addedCount++;
      } else {
        console.warn(`Failed to add normative data for ${dataset.assessmentType}/${dataset.dimension}:`, result.error);
      }
    }
    
    console.log(`Successfully added ${addedCount} normative datasets to database`);
    
  } catch (error) {
    console.error('Error generating sample normative data:', error);
  }
};

// Calculate data quality score based on sample size and distribution characteristics
const calculateDataQuality = (sampleSize: number, stdDev: number): number => {
  let qualityScore = 50; // Base score
  
  // Sample size contribution (max 30 points)
  if (sampleSize >= 300) qualityScore += 30;
  else if (sampleSize >= 200) qualityScore += 25;
  else if (sampleSize >= 100) qualityScore += 20;
  else if (sampleSize >= 50) qualityScore += 15;
  else qualityScore += 10;
  
  // Distribution quality contribution (max 20 points)
  if (stdDev >= 10 && stdDev <= 20) qualityScore += 20; // Good spread
  else if (stdDev >= 8 && stdDev <= 25) qualityScore += 15; // Acceptable spread
  else qualityScore += 10; // Poor spread (too narrow or too wide)
  
  return Math.min(100, qualityScore);
};

// Export function to initialize sample data (should be called once during setup)
export const initializeSampleNormativeData = async (): Promise<boolean> => {
  try {
    console.log('Initializing sample normative data...');
    await generateSampleNormativeData();
    console.log('Sample normative data initialization complete');
    return true;
  } catch (error) {
    console.error('Failed to initialize sample normative data:', error);
    return false;
  }
};