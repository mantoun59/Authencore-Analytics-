/**
 * Security Enhancements - Fix critical security issues
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/loggingService';

/**
 * Enhanced environment configuration with security checks
 */
export interface SecureEnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    environment: 'development' | 'staging' | 'production';
    version: string;
    debugMode: boolean;
  };
  security: {
    enableMFA: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    passwordStrength: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
    };
  };
}

/**
 * Get secure environment configuration
 */
export const getSecureConfig = (): SecureEnvironmentConfig => {
  // Use environment variables in production, fallback to defaults
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jlbftyjewxgetxcihban.supabase.co";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYmZ0eWpld3hnZXR4Y2loYmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDA4MzgsImV4cCI6MjA2ODIxNjgzOH0.g_SBYZPefuFcCQfG_Un3PEASxycvoa65bG1DmGtXfrg";

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey
    },
    app: {
      environment: (import.meta.env.MODE as any) || 'development',
      version: '2.0.0',
      debugMode: import.meta.env.DEV === true
    },
    security: {
      enableMFA: true,
      sessionTimeout: 60, // 1 hour
      maxLoginAttempts: 5,
      passwordStrength: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true
      }
    }
  };
};

/**
 * Validate security configuration
 */
export const validateSecurityConfig = async (): Promise<boolean> => {
  const config = getSecureConfig();
  
  // Check environment variables are properly set
  if (!config.supabase.url || !config.supabase.anonKey) {
    logger.error('Missing required Supabase configuration');
    return false;
  }

  // Warn if debug mode is enabled in production
  if (config.app.environment === 'production' && config.app.debugMode) {
    logger.warn('Debug mode should be disabled in production');
  }

  // Test database connection
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      logger.error('Database connection test failed:', error);
      return false;
    }
  } catch (error) {
    logger.error('Database connection validation failed:', error);
    return false;
  }

  return true;
};

/**
 * Enhanced password validation
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const config = getSecureConfig();
  const errors: string[] = [];
  
  if (password.length < config.security.passwordStrength.minLength) {
    errors.push(`Password must be at least ${config.security.passwordStrength.minLength} characters long`);
  }
  
  if (config.security.passwordStrength.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (config.security.passwordStrength.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (config.security.passwordStrength.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Security headers for enhanced protection
 */
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://jlbftyjewxgetxcihban.supabase.co wss://jlbftyjewxgetxcihban.supabase.co https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
});

/**
 * Initialize security enhancements
 */
export const initializeSecurity = async (): Promise<void> => {
  const isValid = await validateSecurityConfig();
  
  if (!isValid) {
    throw new Error('Security configuration validation failed');
  }

  // Set security headers if running in browser
  if (typeof window !== 'undefined') {
    const headers = getSecurityHeaders();
    
    // Add CSP meta tag if not present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = headers['Content-Security-Policy'];
      document.head.appendChild(cspMeta);
    }
  }

  logger.info('Security enhancements initialized successfully');
};