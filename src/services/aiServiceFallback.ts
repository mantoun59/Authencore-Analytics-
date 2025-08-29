import { toast } from 'sonner';

interface FallbackResponse {
  success: boolean;
  data?: any;
  error?: string;
  source: 'primary' | 'fallback' | 'cache' | 'offline';
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class AIServiceFallback {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static isOnline = navigator.onLine;
  
  static {
    // Monitor network status
    window.addEventListener('online', () => {
      this.isOnline = true;
      toast.success('Connection restored - AI services are back online');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      toast.warning('Connection lost - Using offline fallbacks');
    });
  }

  /**
   * Main method for AI service calls with fallback strategies
   */
  static async callWithFallback(
    primaryCall: () => Promise<any>,
    cacheKey: string,
    fallbackStrategy: 'cache' | 'static' | 'simplified' = 'cache',
    options: {
      cacheTTL?: number;
      retryConfig?: Partial<RetryConfig>;
      fallbackData?: any;
    } = {}
  ): Promise<FallbackResponse> {
    const {
      cacheTTL = 3600000, // 1 hour default
      retryConfig = {},
      fallbackData
    } = options;

    const finalRetryConfig: RetryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      ...retryConfig
    };

    // Check if we're offline
    if (!this.isOnline) {
      return this.handleOfflineScenario(cacheKey, fallbackStrategy, fallbackData);
    }

    // Try primary service with retries
    try {
      const result = await this.executeWithRetry(primaryCall, finalRetryConfig);
      
      // Cache successful result
      this.setCache(cacheKey, result, cacheTTL);
      
      return {
        success: true,
        data: result,
        source: 'primary'
      };
    } catch (error) {
      console.error('Primary AI service failed:', error);
      
      // Try fallback strategies
      return this.executeFallbackStrategy(cacheKey, fallbackStrategy, fallbackData, error);
    }
  }

  /**
   * Execute function with exponential backoff retry
   */
  private static async executeWithRetry<T>(
    fn: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === config.maxRetries) {
          throw lastError;
        }
        
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );
        
        console.warn(`AI service attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Handle offline scenarios
   */
  private static handleOfflineScenario(
    cacheKey: string,
    fallbackStrategy: string,
    fallbackData?: any
  ): FallbackResponse {
    // Try cache first
    const cached = this.getCache(cacheKey);
    if (cached) {
      toast.info('Using cached AI response (offline mode)');
      return {
        success: true,
        data: cached,
        source: 'cache'
      };
    }

    // Use static fallback
    const staticFallback = this.getStaticFallback(fallbackStrategy, fallbackData);
    if (staticFallback) {
      toast.warning('Using simplified analysis (offline mode)');
      return {
        success: true,
        data: staticFallback,
        source: 'offline'
      };
    }

    return {
      success: false,
      error: 'Service unavailable offline and no cached data available',
      source: 'offline'
    };
  }

  /**
   * Execute fallback strategies when primary service fails
   */
  private static executeFallbackStrategy(
    cacheKey: string,
    strategy: string,
    fallbackData: any,
    originalError: any
  ): FallbackResponse {
    // Try cache first
    const cached = this.getCache(cacheKey);
    if (cached) {
      toast.warning('AI service temporarily unavailable - using recent cached analysis');
      return {
        success: true,
        data: cached,
        source: 'cache'
      };
    }

    // Use static fallback strategies
    switch (strategy) {
      case 'static':
        const staticResult = this.getStaticFallback('report', fallbackData);
        if (staticResult) {
          toast.warning('AI analysis unavailable - generated standard report');
          return {
            success: true,
            data: staticResult,
            source: 'fallback'
          };
        }
        break;

      case 'simplified':
        const simplifiedResult = this.getSimplifiedAnalysis(fallbackData);
        if (simplifiedResult) {
          toast.warning('AI analysis limited - using simplified evaluation');
          return {
            success: true,
            data: simplifiedResult,
            source: 'fallback'
          };
        }
        break;

      default:
        break;
    }

    // Final fallback - return error with guidance
    toast.error('AI services are currently unavailable. Please try again later.');
    return {
      success: false,
      error: `AI service unavailable: ${originalError.message}`,
      source: 'fallback'
    };
  }

  /**
   * Cache management
   */
  private static setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private static getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Static fallback responses
   */
  private static getStaticFallback(type: string, data?: any): any {
    switch (type) {
      case 'report':
        return {
          analysis: "We're currently unable to provide AI-powered insights. This report contains your assessment results with standard interpretations. For detailed AI analysis, please try generating the report again when our services are available.",
          recommendations: [
            "Review your assessment results carefully",
            "Consider areas where you scored highest as potential strengths",
            "Focus on developing areas with lower scores",
            "Seek feedback from colleagues or mentors",
            "Consider professional development opportunities"
          ],
          summary: "Assessment completed successfully. AI analysis temporarily unavailable.",
          timestamp: new Date().toISOString()
        };

      case 'analysis':
        return {
          insights: "Standard analysis based on your responses. For detailed AI insights, please try again later.",
          confidence: 0.7,
          recommendations: this.getGenericRecommendations(data),
          limitations: "This is a simplified analysis. Full AI-powered insights are temporarily unavailable."
        };

      default:
        return null;
    }
  }

  /**
   * Generate simplified analysis based on scores
   */
  private static getSimplifiedAnalysis(data: any): any {
    if (!data || !data.scores) return null;

    const scores = data.scores;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Simple scoring analysis
    Object.entries(scores).forEach(([dimension, score]) => {
      if (typeof score === 'number') {
        if (score >= 75) {
          strengths.push(dimension);
        } else if (score < 60) {
          improvements.push(dimension);
        }
      }
    });

    return {
      analysis: "Based on your assessment responses, here's a simplified analysis:",
      strengths: strengths.length > 0 ? 
        `Your strongest areas appear to be: ${strengths.join(', ')}` :
        "Your responses show a balanced profile across dimensions",
      developmentAreas: improvements.length > 0 ?
        `Areas for potential development: ${improvements.join(', ')}` :
        "No significant development areas identified",
      recommendations: this.getGenericRecommendations(data),
      note: "This is a simplified analysis. For comprehensive AI insights, please try again when services are available."
    };
  }

  /**
   * Generic recommendations based on assessment type
   */
  private static getGenericRecommendations(data?: any): string[] {
    const assessmentType = data?.assessmentType || 'general';
    
    const recommendations = {
      'career-launch': [
        "Explore career opportunities that align with your interests",
        "Develop both technical and soft skills",
        "Build a professional network in your field",
        "Seek mentorship and guidance from experienced professionals"
      ],
      'personality': [
        "Build self-awareness through reflection and feedback",
        "Practice adapting your communication style to different situations",
        "Leverage your strengths in team environments",
        "Work on developing areas that support your goals"
      ],
      'communication': [
        "Practice active listening in professional conversations",
        "Adapt your communication style to your audience",
        "Seek opportunities to present and lead discussions",
        "Build confidence in expressing your ideas clearly"
      ],
      'general': [
        "Continue developing self-awareness",
        "Seek feedback from others regularly",
        "Focus on continuous learning and improvement",
        "Build strong professional relationships"
      ]
    };

    return recommendations[assessmentType] || recommendations.general;
  }

  /**
   * Clear expired cache entries
   */
  static clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}