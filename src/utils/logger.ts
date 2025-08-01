/**
 * Production-safe logging utility
 * Automatically disables console logs in production builds
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface Logger {
  log: (message: any, ...args: any[]) => void;
  warn: (message: any, ...args: any[]) => void;
  error: (message: any, ...args: any[]) => void;
  info: (message: any, ...args: any[]) => void;
  debug: (message: any, ...args: any[]) => void;
}

const isProduction = import.meta.env.PROD;

const createLogger = (): Logger => {
  const noop = () => {};
  
  if (isProduction) {
    return {
      log: noop,
      warn: noop,
      error: (message: any, ...args: any[]) => {
        // Only keep error logs in production for critical debugging
        console.error(message, ...args);
      },
      info: noop,
      debug: noop,
    };
  }
  
  return {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
  };
};

export const logger = createLogger();

/**
 * Performance monitoring utility
 */
export const perfLogger = {
  time: (label: string) => {
    if (!isProduction) {
      console.time(label);
    }
  },
  timeEnd: (label: string) => {
    if (!isProduction) {
      console.timeEnd(label);
    }
  },
  mark: (name: string) => {
    if (!isProduction && performance.mark) {
      performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (!isProduction && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        // Ignore if marks don't exist
      }
    }
  }
};
