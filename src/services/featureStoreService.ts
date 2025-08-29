/**
 * Feature Store Service - ML Feature Engineering Pipeline
 * Processes raw data into ML-ready features for forecasting models
 */

import { supabase } from "@/integrations/supabase/client";

interface FeatureConfig {
  type: 'numeric' | 'categorical';
  source: string;
  transformation: string;
}

interface FeatureRegistry {
  features: Record<string, number>;
  lastUpdate: string;
  version: string;
  schema: Record<string, FeatureConfig>;
}

class FeatureStoreService {
  private features: Record<string, Record<string, FeatureConfig>>;
  private transformations: Record<string, Function>;
  private featureRegistry: Map<string, FeatureRegistry>;

  constructor() {
    this.features = this.initializeFeatures();
    this.transformations = this.setupTransformations();
    this.featureRegistry = new Map();
    this.startFeatureProcessing();
  }

  private initializeFeatures(): Record<string, Record<string, FeatureConfig>> {
    return {
      // Regional Features
      regional: {
        unemployment_rate: { type: 'numeric' as const, source: 'bls', transformation: 'normalize' },
        gdp_growth: { type: 'numeric' as const, source: 'worldBank', transformation: 'log_transform' },
        population_density: { type: 'numeric' as const, source: 'worldBank', transformation: 'standardize' },
        education_index: { type: 'numeric' as const, source: 'worldBank', transformation: 'normalize' },
        cost_of_living: { type: 'numeric' as const, source: 'internal', transformation: 'standardize' }
      },

      // Industry Features
      industry: {
        job_postings_volume: { type: 'numeric' as const, source: 'adzuna', transformation: 'log_transform' },
        avg_salary: { type: 'numeric' as const, source: 'adzuna', transformation: 'standardize' },
        growth_rate: { type: 'numeric' as const, source: 'bls', transformation: 'normalize' },
        automation_risk: { type: 'numeric' as const, source: 'internal', transformation: 'normalize' },
        innovation_index: { type: 'numeric' as const, source: 'github', transformation: 'standardize' }
      },

      // Skills Features
      skills: {
        demand_score: { type: 'numeric' as const, source: 'adzuna', transformation: 'normalize' },
        supply_score: { type: 'numeric' as const, source: 'internal', transformation: 'normalize' },
        salary_premium: { type: 'numeric' as const, source: 'adzuna', transformation: 'log_transform' },
        learning_difficulty: { type: 'numeric' as const, source: 'internal', transformation: 'normalize' },
        tech_adoption: { type: 'numeric' as const, source: 'github', transformation: 'standardize' }
      },

      // Temporal Features
      temporal: {
        month: { type: 'categorical' as const, source: 'derived', transformation: 'one_hot' },
        quarter: { type: 'categorical' as const, source: 'derived', transformation: 'one_hot' },
        year: { type: 'numeric' as const, source: 'derived', transformation: 'standardize' },
        seasonality: { type: 'numeric' as const, source: 'derived', transformation: 'cyclical' },
        trend: { type: 'numeric' as const, source: 'derived', transformation: 'linear' }
      },

      // Economic Features
      economic: {
        interest_rates: { type: 'numeric' as const, source: 'worldBank', transformation: 'normalize' },
        inflation_rate: { type: 'numeric' as const, source: 'worldBank', transformation: 'normalize' },
        stock_market_index: { type: 'numeric' as const, source: 'external', transformation: 'log_transform' },
        consumer_confidence: { type: 'numeric' as const, source: 'external', transformation: 'standardize' }
      }
    };
  }

  private setupTransformations() {
    return {
      normalize: (values: number[]) => {
        const min = Math.min(...values);
        const max = Math.max(...values);
        return values.map(v => (v - min) / (max - min));
      },

      standardize: (values: number[]) => {
        const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
        const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
        return values.map(v => (v - mean) / std);
      },

      log_transform: (values: number[]) => {
        return values.map(v => Math.log(Math.max(v, 1)));
      },

      one_hot: (categories: any[]) => {
        const unique = [...new Set(categories)];
        return categories.map(cat => {
          const encoded = new Array(unique.length).fill(0);
          encoded[unique.indexOf(cat)] = 1;
          return encoded;
        });
      },

      cyclical: (values: number[]) => {
        // Convert cyclical features (like months) to sin/cos
        return values.map(v => ({
          sin: Math.sin(2 * Math.PI * v / 12),
          cos: Math.cos(2 * Math.PI * v / 12)
        }));
      },

      linear: (values: number[]) => {
        // Linear transformation for trend features
        const min = Math.min(...values);
        return values.map(v => v - min);
      }
    };
  }

  private async startFeatureProcessing() {
    console.log('🔧 Starting Feature Processing Pipeline...');
    
    try {
      await this.processRegionalFeatures();
      await this.processIndustryFeatures();
      await this.processSkillsFeatures();
      await this.processTemporalFeatures();
      await this.processEconomicFeatures();
      
      console.log('✅ Feature processing completed');
    } catch (error) {
      console.error('❌ Feature processing failed:', error);
    }
  }

  private async processRegionalFeatures() {
    const regions = ['North America', 'Europe', 'Asia Pacific', 'Global'];

    for (const region of regions) {
      const features = await this.extractRegionalFeatures(region);
      const processedFeatures = await this.applyTransformations(features, 'regional');

      this.featureRegistry.set(`regional_${region}`, {
        features: processedFeatures,
        lastUpdate: new Date().toISOString(),
        version: '1.0',
        schema: this.features.regional
      });

      // Store in database
      await this.storeFeatures('regional', processedFeatures, region);
    }
  }

  private async processIndustryFeatures() {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education'];

    for (const industry of industries) {
      const features = await this.extractIndustryFeatures(industry);
      const processedFeatures = await this.applyTransformations(features, 'industry');

      this.featureRegistry.set(`industry_${industry}`, {
        features: processedFeatures,
        lastUpdate: new Date().toISOString(),
        version: '1.0',
        schema: this.features.industry
      });

      // Store in database
      await this.storeFeatures('industry', processedFeatures, industry);
    }
  }

  private async processSkillsFeatures() {
    const skills = ['AI/ML', 'Cloud Computing', 'Data Science', 'Cybersecurity', 'DevOps', 'Blockchain', 'IoT', 'AR/VR'];

    for (const skill of skills) {
      const features = await this.extractSkillsFeatures(skill);
      const processedFeatures = await this.applyTransformations(features, 'skills');

      this.featureRegistry.set(`skills_${skill}`, {
        features: processedFeatures,
        lastUpdate: new Date().toISOString(),
        version: '1.0',
        schema: this.features.skills
      });

      // Store in database
      await this.storeFeatures('skills', processedFeatures, skill);
    }
  }

  private async processTemporalFeatures() {
    const now = new Date();
    const features = {
      month: now.getMonth() + 1,
      quarter: Math.floor(now.getMonth() / 3) + 1,
      year: now.getFullYear(),
      seasonality: now.getMonth() + 1,
      trend: (now.getFullYear() - 2020) * 12 + now.getMonth()
    };

    const processedFeatures = await this.applyTransformations(features, 'temporal');

    this.featureRegistry.set('temporal_current', {
      features: processedFeatures,
      lastUpdate: new Date().toISOString(),
      version: '1.0',
      schema: this.features.temporal
    });

    // Store in database
    await this.storeFeatures('temporal', processedFeatures, 'current');
  }

  private async processEconomicFeatures() {
    const features = {
      interest_rates: 5.25 + Math.random() * 2,
      inflation_rate: 3.2 + Math.random() * 1,
      stock_market_index: 4200 + Math.random() * 400,
      consumer_confidence: 85 + Math.random() * 15
    };

    const processedFeatures = await this.applyTransformations(features, 'economic');

    this.featureRegistry.set('economic_current', {
      features: processedFeatures,
      lastUpdate: new Date().toISOString(),
      version: '1.0',
      schema: this.features.economic
    });

    // Store in database
    await this.storeFeatures('economic', processedFeatures, 'global');
  }

  private async extractRegionalFeatures(region: string) {
    // Simulate extracting real regional data
    return {
      unemployment_rate: 3.5 + Math.random() * 2,
      gdp_growth: 2.1 + Math.random() * 1.5,
      population_density: Math.random() * 1000 + 100,
      education_index: 0.8 + Math.random() * 0.2,
      cost_of_living: Math.random() * 50 + 75
    };
  }

  private async extractIndustryFeatures(industry: string) {
    // Simulate extracting real industry data
    return {
      job_postings_volume: Math.floor(Math.random() * 50000) + 10000,
      avg_salary: Math.floor(Math.random() * 50000) + 70000,
      growth_rate: Math.random() * 20 - 5,
      automation_risk: Math.random() * 0.8,
      innovation_index: Math.random() * 100
    };
  }

  private async extractSkillsFeatures(skill: string) {
    // Simulate extracting real skills data
    return {
      demand_score: Math.random() * 100,
      supply_score: Math.random() * 100,
      salary_premium: Math.random() * 30000 + 10000,
      learning_difficulty: Math.random() * 5 + 1,
      tech_adoption: Math.random() * 100
    };
  }

  private async applyTransformations(rawFeatures: Record<string, number>, category: string) {
    const schema = this.features[category];
    const transformed: Record<string, number> = {};

    for (const [featureName, featureValue] of Object.entries(rawFeatures)) {
      const featureConfig = schema[featureName];
      if (!featureConfig) continue;

      const transformation = this.transformations[featureConfig.transformation];
      if (transformation && typeof featureValue === 'number') {
        if (featureConfig.transformation === 'one_hot') {
          // Handle one-hot encoding differently
          transformed[featureName] = featureValue;
        } else if (featureConfig.transformation === 'cyclical') {
          // Handle cyclical features
          const cyclical = transformation([featureValue])[0];
          transformed[`${featureName}_sin`] = cyclical.sin;
          transformed[`${featureName}_cos`] = cyclical.cos;
        } else {
          transformed[featureName] = transformation([featureValue])[0];
        }
      } else {
        transformed[featureName] = featureValue;
      }
    }

    return transformed;
  }

  private async storeFeatures(category: string, features: Record<string, number>, entityId: string) {
    try {
      for (const [featureName, featureValue] of Object.entries(features)) {
        await supabase
          .from('ml_feature_store')
          .upsert({
            feature_category: category,
            feature_name: featureName,
            feature_value: featureValue,
            entity_id: entityId,
            transformation_applied: this.features[category][featureName]?.transformation || 'none',
            data_source: this.features[category][featureName]?.source || 'internal'
          });
      }
    } catch (error) {
      console.error(`Error storing ${category} features:`, error);
    }
  }

  public async getFeatures(category?: string, entityId?: string) {
    try {
      let query = supabase.from('ml_feature_store').select('*');

      if (category) {
        query = query.eq('feature_category', category);
      }

      if (entityId) {
        query = query.eq('entity_id', entityId);
      }

      const { data, error } = await query.order('collected_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  }

  public async getFeatureImportance() {
    // Simulate feature importance from latest model
    const importance = [
      { feature: 'demand_score', importance: 0.23, category: 'skills' },
      { feature: 'avg_salary', importance: 0.19, category: 'industry' },
      { feature: 'growth_rate', importance: 0.17, category: 'industry' },
      { feature: 'tech_adoption', importance: 0.15, category: 'skills' },
      { feature: 'unemployment_rate', importance: 0.12, category: 'regional' },
      { feature: 'innovation_index', importance: 0.14, category: 'industry' }
    ];

    return importance.sort((a, b) => b.importance - a.importance);
  }

  public getFeatureSchema(category?: string) {
    if (category) {
      return this.features[category] || {};
    }
    return this.features;
  }

  public getTransformations() {
    return Object.keys(this.transformations);
  }

  public async refreshFeatures() {
    console.log('🔄 Refreshing all features...');
    await this.startFeatureProcessing();
  }
}

export default new FeatureStoreService();