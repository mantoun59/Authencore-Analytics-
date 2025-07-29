/**
 * Production-Safe Logger - Replaces all console.* calls
 * Removes debugging output in production while maintaining error tracking
 */

import { logger } from '@/services/loggingService';

// Production-safe console replacement
class ProductionLogger {
  private static isDevelopment = import.meta.env.DEV;
  private static isProduction = import.meta.env.PROD;

  static log(...args: any[]) {
    if (this.isDevelopment) {
      console.log(...args);
    }
    // In production, use structured logging
    if (this.isProduction && args.length > 0) {
      logger.info(args[0]);
    }
  }

  static info(...args: any[]) {
    if (this.isDevelopment) {
      console.info(...args);
    }
    if (this.isProduction && args.length > 0) {
      logger.info(args[0]);
    }
  }

  static warn(...args: any[]) {
    if (this.isDevelopment) {
      console.warn(...args);
    }
    if (args.length > 0) {
      logger.warn(args[0]);
    }
  }

  static error(...args: any[]) {
    // Always log errors
    console.error(...args);
    if (args.length > 0) {
      logger.error(args[0]);
    }
  }

  static debug(...args: any[]) {
    if (this.isDevelopment) {
      console.debug(...args);
    }
    // Debug logs only in development
    if (this.isDevelopment && args.length > 0) {
      logger.debug(args[0]);
    }
  }
}

// Override global console in production
if (import.meta.env.PROD) {
  globalThis.console = {
    ...globalThis.console,
    log: ProductionLogger.log.bind(ProductionLogger),
    info: ProductionLogger.info.bind(ProductionLogger),
    warn: ProductionLogger.warn.bind(ProductionLogger),
    debug: ProductionLogger.debug.bind(ProductionLogger),
    // Keep error as-is for critical issues
    error: console.error
  };
}

export { ProductionLogger as console };
