// Production-ready logging service with performance optimization
interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
}

interface LogEntry extends LogContext {
  message: string;
  stack?: string;
}

class LoggingService {
  private static instance: LoggingService;
  private isDevelopment = import.meta.env.DEV;
  private logQueue: LogEntry[] = [];
  private flushInterval: number | null = null;
  private maxQueueSize = 100;
  private flushIntervalMs = 5000; // 5 seconds

  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  constructor() {
    // Start flush interval for production logging
    if (!this.isDevelopment) {
      this.startFlushInterval();
    }
  }

  private startFlushInterval() {
    this.flushInterval = window.setInterval(() => {
      if (this.logQueue.length > 0) {
        this.flushLogs();
      }
    }, this.flushIntervalMs);
  }

  private async flushLogs() {
    if (this.logQueue.length === 0) return;

    const logsToFlush = [...this.logQueue];
    this.logQueue = [];

    try {
      // In production, send logs to monitoring service
      // For now, we'll store them in local storage for debugging
      const existingLogs = localStorage.getItem('app_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(...logsToFlush);
      
      // Keep only last 1000 logs to prevent storage bloat
      const recentLogs = logs.slice(-1000);
      localStorage.setItem('app_logs', JSON.stringify(recentLogs));
    } catch (error) {
      // Fallback to console if storage fails
      console.error('Failed to flush logs:', error);
    }
  }

  private log(message: string, context: Partial<LogContext>) {
    const entry: LogEntry = {
      message,
      timestamp: Date.now(),
      level: context.level || 'info',
      ...context
    };

    // Always log to console in development
    if (this.isDevelopment) {
      this.logToConsole(entry);
    }

    // Add to queue for production logging
    if (!this.isDevelopment || context.level === 'error' || context.level === 'critical') {
      this.logQueue.push(entry);
      
      // Flush immediately for critical errors
      if (context.level === 'critical' || this.logQueue.length >= this.maxQueueSize) {
        this.flushLogs();
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;
    const context = entry.component ? `[${entry.component}]` : '';
    
    switch (entry.level) {
      case 'debug':
        console.debug(`${prefix}${context}`, entry.message, entry.metadata);
        break;
      case 'info':
        console.info(`${prefix}${context}`, entry.message, entry.metadata);
        break;
      case 'warn':
        console.warn(`${prefix}${context}`, entry.message, entry.metadata);
        break;
      case 'error':
      case 'critical':
        console.error(`${prefix}${context}`, entry.message, entry.metadata, entry.stack);
        break;
    }
  }

  // Public API methods
  debug(message: string, context?: Partial<LogContext>) {
    this.log(message, { ...context, level: 'debug' });
  }

  info(message: string, context?: Partial<LogContext>) {
    this.log(message, { ...context, level: 'info' });
  }

  warn(message: string, context?: Partial<LogContext>) {
    this.log(message, { ...context, level: 'warn' });
  }

  error(message: string, error?: Error, context?: Partial<LogContext>) {
    this.log(message, {
      ...context,
      level: 'error',
      metadata: {
        ...context?.metadata,
        errorName: error?.name,
        errorMessage: error?.message,
        stack: error?.stack
      }
    });
  }

  critical(message: string, error?: Error, context?: Partial<LogContext>) {
    this.log(message, {
      ...context,
      level: 'critical',
      metadata: {
        ...context?.metadata,
        errorName: error?.name,
        errorMessage: error?.message,
        stack: error?.stack
      }
    });
  }

  // Assessment-specific logging
  assessmentStart(assessmentType: string, userId?: string) {
    this.info('Assessment started', {
      component: 'Assessment',
      action: 'start',
      userId,
      metadata: { assessmentType }
    });
  }

  assessmentComplete(assessmentType: string, userId?: string, duration?: number) {
    this.info('Assessment completed', {
      component: 'Assessment',
      action: 'complete',
      userId,
      metadata: { assessmentType, duration }
    });
  }

  assessmentError(assessmentType: string, error: Error, userId?: string) {
    this.error('Assessment error', error, {
      component: 'Assessment',
      action: 'error',
      userId,
      metadata: { assessmentType }
    });
  }

  // Performance logging
  performanceLog(name: string, duration: number, metadata?: Record<string, any>) {
    this.info(`Performance: ${name}`, {
      component: 'Performance',
      metadata: { duration, ...metadata }
    });
  }

  // API logging
  apiRequest(url: string, method: string, userId?: string) {
    this.debug('API request', {
      component: 'API',
      action: 'request',
      userId,
      metadata: { url, method }
    });
  }

  apiResponse(url: string, method: string, status: number, duration: number, userId?: string) {
    const level = status >= 400 ? 'error' : 'debug';
    this.log('API response', {
      level,
      component: 'API',
      action: 'response',
      userId,
      metadata: { url, method, status, duration }
    });
  }

  // Security logging
  securityEvent(event: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, any>) {
    const level = severity === 'high' ? 'critical' : severity === 'medium' ? 'error' : 'warn';
    this.log(`Security event: ${event}`, {
      level,
      component: 'Security',
      metadata: { severity, ...metadata }
    });
  }

  // Get logs for debugging
  getLogs(level?: string, component?: string, limit = 100): LogEntry[] {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      return logs
        .filter((log: LogEntry) => !level || log.level === level)
        .filter((log: LogEntry) => !component || log.component === component)
        .slice(-limit);
    } catch {
      return [];
    }
  }

  // Clear logs
  clearLogs() {
    localStorage.removeItem('app_logs');
    this.logQueue = [];
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flushLogs(); // Final flush
  }
}

export const logger = LoggingService.getInstance();
export default logger;
