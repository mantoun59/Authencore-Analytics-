import { toast } from '@/hooks/use-toast';

interface ServiceError {
  service: string;
  operation: string;
  error: Error;
  fallback?: () => void;
}

export class ServiceErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;
  private static retryDelay = 1000;

  static async handleServiceError({ service, operation, error, fallback }: ServiceError) {
    const errorKey = `${service}-${operation}`;
    const attempts = this.retryAttempts.get(errorKey) || 0;

    console.error(`[${service}] ${operation} failed:`, error);

    // Log to analytics/monitoring
    this.logError(service, operation, error, attempts);

    // Check if we should retry
    if (attempts < this.maxRetries && this.isRetryableError(error)) {
      this.retryAttempts.set(errorKey, attempts + 1);
      
      toast({
        title: "Connection Issue",
        description: `Retrying ${service} operation... (${attempts + 1}/${this.maxRetries})`,
        variant: "default"
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempts + 1)));
      return 'retry';
    }

    // Max retries exceeded or non-retryable error
    this.retryAttempts.delete(errorKey);

    if (fallback) {
      toast({
        title: "Service Unavailable",
        description: `${service} is temporarily unavailable. Using alternative method.`,
        variant: "default"
      });
      fallback();
      return 'fallback';
    }

    // Show user-friendly error
    this.showUserError(service, operation);
    return 'error';
  }

  private static isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'network error',
      'timeout',
      'fetch failed',
      'failed to fetch',
      'connection refused',
      '502',
      '503',
      '504'
    ];

    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }

  private static logError(service: string, operation: string, error: Error, attempts: number) {
    // In production, this would send to monitoring service
    const errorData = {
      service,
      operation,
      error: error.message,
      stack: error.stack,
      attempts,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store locally for debugging
    const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
    errors.push(errorData);
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('app_errors', JSON.stringify(errors));
  }

  private static showUserError(service: string, operation: string) {
    const serviceMessages: Record<string, string> = {
      'OpenAI': 'AI analysis is temporarily unavailable. Please try again later.',
      'PDF Generation': 'Report generation failed. Please try downloading again.',
      'Email': 'Email delivery failed. Please check your email address.',
      'Supabase': 'Database connection issue. Please refresh and try again.',
      'Authentication': 'Login service is temporarily unavailable.'
    };

    const message = serviceMessages[service] || 
      `${service} service is temporarily unavailable. Please try again later.`;

    toast({
      title: "Service Error",
      description: message,
      variant: "destructive"
    });
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    service: string,
    operationName: string,
    fallback?: () => T
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const result = await this.handleServiceError({
        service,
        operation: operationName,
        error: error as Error,
        fallback: fallback ? () => fallback() : undefined
      });

      if (result === 'retry') {
        return this.withRetry(operation, service, operationName, fallback);
      } else if (result === 'fallback' && fallback) {
        return fallback();
      } else {
        throw error;
      }
    }
  }

  static clearRetryHistory() {
    this.retryAttempts.clear();
  }
}

// Specific service fallbacks
export const ServiceFallbacks = {
  aiAnalysis: () => ({
    summary: "AI analysis temporarily unavailable. Report generated with standard analysis.",
    recommendations: [
      "Review your assessment results with a supervisor",
      "Consider retaking the assessment when services are restored",
      "Focus on your highest scoring dimensions for development"
    ],
    insights: "Complete analysis will be available when AI services are restored."
  }),

  pdfGeneration: () => {
    // Fallback to basic HTML view
    return "HTML report view (PDF generation unavailable)";
  },

  emailDelivery: () => {
    toast({
      title: "Email Service Unavailable",
      description: "Please download your report manually and save it locally.",
      variant: "default"
    });
  }
};

// Hook for easy component usage
export const useServiceFallback = () => {
  return {
    withRetry: ServiceErrorHandler.withRetry,
    handleError: ServiceErrorHandler.handleServiceError,
    fallbacks: ServiceFallbacks
  };
};
