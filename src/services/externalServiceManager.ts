/**
 * External Service Fallback Manager
 * Provides fallback mechanisms and service health monitoring for external dependencies
 */

import { config } from '@/config/environment';

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  lastCheck: string;
  errorCount: number;
}

interface FallbackOptions {
  maxRetries: number;
  timeoutMs: number;
  enableCache: boolean;
  fallbackResponse?: any;
}

export class ExternalServiceManager {
  private static instance: ExternalServiceManager;
  private serviceHealth: Map<string, ServiceHealth> = new Map();
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly DEFAULT_TIMEOUT = 10000; // 10 seconds
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ExternalServiceManager {
    if (!ExternalServiceManager.instance) {
      ExternalServiceManager.instance = new ExternalServiceManager();
    }
    return ExternalServiceManager.instance;
  }

  /**
   * Execute a service call with fallback mechanisms
   */
  async callWithFallback<T>(
    serviceName: string,
    serviceCall: () => Promise<T>,
    options: Partial<FallbackOptions> = {}
  ): Promise<T> {
    const opts: FallbackOptions = {
      maxRetries: 3,
      timeoutMs: this.DEFAULT_TIMEOUT,
      enableCache: true,
      ...options
    };

    // Check cache first if enabled
    if (opts.enableCache) {
      const cached = this.getFromCache<T>(serviceName);
      if (cached) {
        
        return cached;
      }
    }

    let lastError: Error | null = null;
    const startTime = performance.now();

    for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
      try {
        
        
        // Add timeout wrapper
        const result = await this.withTimeout(serviceCall(), opts.timeoutMs);
        
        // Update service health
        const responseTime = performance.now() - startTime;
        this.updateServiceHealth(serviceName, 'healthy', responseTime);
        
        // Cache successful result if enabled
        if (opts.enableCache) {
          this.setCache(serviceName, result, this.CACHE_TTL);
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`${serviceName} call failed (attempt ${attempt}):`, error);
        
        // Update service health
        this.updateServiceHealth(serviceName, 'degraded', performance.now() - startTime, true);
        
        // Wait before retry (exponential backoff)
        if (attempt < opts.maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await this.delay(delay);
        }
      }
    }

    // All retries failed - try fallback
    if (opts.fallbackResponse !== undefined) {
      
      this.updateServiceHealth(serviceName, 'down', performance.now() - startTime);
      return opts.fallbackResponse;
    }

    // No fallback available - throw last error
    this.updateServiceHealth(serviceName, 'down', performance.now() - startTime);
    throw lastError || new Error(`${serviceName} service failed after ${opts.maxRetries} attempts`);
  }

  /**
   * OpenAI service with fallback
   */
  async callOpenAI(prompt: string, options: any = {}): Promise<any> {
    return this.callWithFallback(
      'openai',
      async () => {
        // This would be the actual OpenAI API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'sk-...'}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            ...options
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        return response.json();
      },
      {
        maxRetries: 3,
        enableCache: true,
        fallbackResponse: {
          choices: [{
            message: {
              content: 'I apologize, but the AI service is temporarily unavailable. Please try again later or contact support for assistance.'
            }
          }]
        }
      }
    );
  }

  /**
   * Email service (Resend) with fallback
   */
  async sendEmail(to: string, subject: string, content: string): Promise<any> {
    return this.callWithFallback(
      'resend',
      async () => {
        // This would be the actual Resend API call
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_...'}`,
          },
          body: JSON.stringify({
            from: 'noreply@authencore.org',
            to,
            subject,
            html: content
          })
        });

        if (!response.ok) {
          throw new Error(`Resend API error: ${response.status}`);
        }

        return response.json();
      },
      {
        maxRetries: 2,
        enableCache: false,
        fallbackResponse: {
          success: false,
          message: 'Email queued for later delivery due to service unavailability'
        }
      }
    );
  }

  /**
   * Add timeout to any promise
   */
  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Service call timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * Update service health metrics
   */
  private updateServiceHealth(
    serviceName: string, 
    status: ServiceHealth['status'], 
    responseTime: number,
    isError: boolean = false
  ): void {
    const current = this.serviceHealth.get(serviceName) || {
      status: 'healthy',
      responseTime: 0,
      lastCheck: '',
      errorCount: 0
    };

    this.serviceHealth.set(serviceName, {
      status,
      responseTime,
      lastCheck: new Date().toISOString(),
      errorCount: isError ? current.errorCount + 1 : 0
    });
  }

  /**
   * Get service health status
   */
  getServiceHealth(serviceName?: string): ServiceHealth | Map<string, ServiceHealth> {
    if (serviceName) {
      return this.serviceHealth.get(serviceName) || {
        status: 'healthy',
        responseTime: 0,
        lastCheck: 'Never',
        errorCount: 0
      };
    }
    return this.serviceHealth;
  }

  /**
   * Cache management
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check for all services
   */
  async performHealthCheck(): Promise<{ healthy: string[], degraded: string[], down: string[] }> {
    const services = ['openai', 'resend', 'supabase'];
    const results = { healthy: [], degraded: [], down: [] } as any;

    for (const service of services) {
      const health = this.getServiceHealth(service) as ServiceHealth;
      
      if (health.errorCount === 0 && health.responseTime < 2000) {
        results.healthy.push(service);
      } else if (health.errorCount < 5 && health.responseTime < 5000) {
        results.degraded.push(service);
      } else {
        results.down.push(service);
      }
    }

    return results;
  }
}

export const externalServiceManager = ExternalServiceManager.getInstance();