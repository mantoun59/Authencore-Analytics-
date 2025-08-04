/**
 * Production Configuration Service
 * Centralized configuration management for production deployment
 */

export interface ProductionConfig {
  // Performance settings
  enablePerformanceMonitoring: boolean;
  enableServiceWorker: boolean;
  enableLazyLoading: boolean;
  
  // Security settings
  enableSecurityHeaders: boolean;
  enableCSP: boolean;
  enableRateLimiting: boolean;
  
  // Logging settings
  enableErrorReporting: boolean;
  enableAnalytics: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  
  // Feature flags
  enableAIReports: boolean;
  enablePaymentSystem: boolean;
  enablePartnerAccess: boolean;
  
  // API settings
  apiTimeout: number;
  maxRetries: number;
  
  // UI settings
  enableAnimations: boolean;
  enableTooltips: boolean;
}

const getProductionConfig = (): ProductionConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    // Performance settings
    enablePerformanceMonitoring: isProduction,
    enableServiceWorker: isProduction,
    enableLazyLoading: true,
    
    // Security settings
    enableSecurityHeaders: isProduction,
    enableCSP: isProduction,
    enableRateLimiting: isProduction,
    
    // Logging settings
    enableErrorReporting: isProduction,
    enableAnalytics: isProduction,
    logLevel: isProduction ? 'error' : 'debug',
    
    // Feature flags
    enableAIReports: true,
    enablePaymentSystem: true,
    enablePartnerAccess: true,
    
    // API settings
    apiTimeout: 30000, // 30 seconds
    maxRetries: 3,
    
    // UI settings
    enableAnimations: true,
    enableTooltips: true,
  };
};

// Production-safe logging
export const productionLogger = {
  error: (message: string, ...args: any[]) => {
    if (getProductionConfig().logLevel === 'error') {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (['error', 'warn'].includes(getProductionConfig().logLevel)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (['error', 'warn', 'info'].includes(getProductionConfig().logLevel)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (getProductionConfig().logLevel === 'debug') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
};

// Performance utilities
export const performanceUtils = {
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    if (!getProductionConfig().enablePerformanceMonitoring) {
      return fn();
    }
    
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      productionLogger.info(`Performance: ${name} took ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      productionLogger.error(`Performance: ${name} failed after ${end - start}ms`, error);
      throw error;
    }
  },
  
  measureSync: <T>(name: string, fn: () => T): T => {
    if (!getProductionConfig().enablePerformanceMonitoring) {
      return fn();
    }
    
    const start = performance.now();
    try {
      const result = fn();
      const end = performance.now();
      productionLogger.info(`Performance: ${name} took ${end - start}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      productionLogger.error(`Performance: ${name} failed after ${end - start}ms`, error);
      throw error;
    }
  }
};

// Security utilities
export const securityUtils = {
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS vectors
      .trim()
      .slice(0, 1000); // Limit length
  },
  
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  generateSecureId: (): string => {
    return crypto.randomUUID();
  }
};

export const productionConfig = getProductionConfig();
export default productionConfig;