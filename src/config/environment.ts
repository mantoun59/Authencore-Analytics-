/**
 * Environment Configuration Management
 * Centralizes environment variables and configuration
 */

export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    environment: 'development' | 'staging' | 'production';
    version: string;
    debugMode: boolean;
  };
  features: {
    enableAnalytics: boolean;
    enablePsychometricValidation: boolean;
    enableMFA: boolean;
    enablePartnerAccess: boolean;
  };
  limits: {
    maxAssessmentDuration: number; // minutes
    maxRetries: number;
    rateLimitWindow: number; // minutes
  };
}

/**
 * Get environment configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // Use hardcoded values as fallback (current behavior)
  // In production, these should come from secure environment variables
  const config: EnvironmentConfig = {
    supabase: {
      url: "https://jlbftyjewxgetxcihban.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg"
    },
    app: {
      environment: (import.meta.env.MODE as any) || 'development',
      version: '1.0.0',
      debugMode: import.meta.env.DEV || false
    },
    features: {
      enableAnalytics: true,
      enablePsychometricValidation: true,
      enableMFA: true,
      enablePartnerAccess: true
    },
    limits: {
      maxAssessmentDuration: 45, // 45 minutes
      maxRetries: 3,
      rateLimitWindow: 1 // 1 minute
    }
  };

  return config;
};

/**
 * Validate configuration
 */
export const validateConfig = (config: EnvironmentConfig): boolean => {
  if (!config.supabase.url || !config.supabase.anonKey) {
    console.error('Missing required Supabase configuration');
    return false;
  }

  if (config.app.environment === 'production' && config.app.debugMode) {
    console.warn('Debug mode should be disabled in production');
  }

  return true;
};

/**
 * Get feature flag status
 */
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  const config = getEnvironmentConfig();
  return config.features[feature];
};

/**
 * Get environment-specific settings
 */
export const getEnvironmentSettings = () => {
  const config = getEnvironmentConfig();
  
  return {
    isDevelopment: config.app.environment === 'development',
    isProduction: config.app.environment === 'production',
    isStaging: config.app.environment === 'staging',
    debugMode: config.app.debugMode,
    showDetailedErrors: config.app.environment !== 'production'
  };
};

export const config = getEnvironmentConfig();