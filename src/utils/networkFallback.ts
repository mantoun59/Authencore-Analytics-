import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface FallbackOptions {
  enableRetry: boolean;
  enableCaching: boolean;
  enableOfflineMode: boolean;
  retryConfig?: Partial<RetryConfig>;
}

export class NetworkFallbackManager {
  private static instance: NetworkFallbackManager;
  private isOnline = navigator.onLine;
  private offlineQueue: Array<{ request: () => Promise<any>, resolve: Function, reject: Function }> = [];
  private cache = new Map<string, { data: any, timestamp: number, ttl: number }>();

  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    backoffMultiplier: 2
  };

  static getInstance(): NetworkFallbackManager {
    if (!NetworkFallbackManager.instance) {
      NetworkFallbackManager.instance = new NetworkFallbackManager();
    }
    return NetworkFallbackManager.instance;
  }

  constructor() {
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Network restored');
      this.isOnline = true;
      this.processOfflineQueue();
      toast.success('Connection restored', {
        description: 'Processing queued requests...'
      });
    });

    window.addEventListener('offline', () => {
      console.log('📱 Network lost');
      this.isOnline = false;
      toast.warning('Connection lost', {
        description: 'Requests will be queued for when connection returns'
      });
    });
  }

  async withFallback<T>(
    requestFn: () => Promise<T>,
    cacheKey?: string,
    options: FallbackOptions = {
      enableRetry: true,
      enableCaching: true,
      enableOfflineMode: true
    }
  ): Promise<T> {
    // Check cache first
    if (options.enableCaching && cacheKey) {
      const cached = this.getFromCache(cacheKey);
      if (cached && this.isOnline) {
        console.log(`📋 Cache hit for ${cacheKey}`);
        // Return cached data but still try to refresh in background
        this.refreshCacheInBackground(requestFn, cacheKey);
        return cached;
      }
      if (cached && !this.isOnline) {
        console.log(`📋 Using cached data offline for ${cacheKey}`);
        return cached;
      }
    }

    // If offline and no cache, queue request
    if (!this.isOnline && options.enableOfflineMode) {
      return new Promise((resolve, reject) => {
        this.offlineQueue.push({ request: requestFn, resolve, reject });
        toast.info('Request queued', {
          description: 'Will be processed when connection returns'
        });
      });
    }

    // Execute with retry logic
    if (options.enableRetry) {
      return this.executeWithRetry(requestFn, options.retryConfig, cacheKey);
    }

    try {
      const result = await requestFn();
      if (options.enableCaching && cacheKey) {
        this.saveToCache(cacheKey, result);
      }
      return result;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    retryConfig: Partial<RetryConfig> = {},
    cacheKey?: string
  ): Promise<T> {
    const config = { ...this.defaultRetryConfig, ...retryConfig };
    let lastError: Error;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const result = await requestFn();
        
        if (cacheKey) {
          this.saveToCache(cacheKey, result);
        }

        if (attempt > 0) {
          toast.success('Request succeeded', {
            description: `Succeeded after ${attempt} retries`
          });
        }

        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt + 1} failed:`, error);

        if (attempt === config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );

        console.log(`Retrying in ${delay}ms...`);
        await this.delay(delay);
      }
    }

    // Final fallback - check cache for stale data
    if (cacheKey) {
      const staleData = this.getFromCache(cacheKey, true);
      if (staleData) {
        console.log(`📋 Using stale cache data for ${cacheKey}`);
        toast.warning('Using cached data', {
          description: 'Could not fetch fresh data'
        });
        return staleData;
      }
    }

    toast.error('Request failed', {
      description: `Failed after ${config.maxRetries} retries`
    });
    throw lastError;
  }

  private async processOfflineQueue() {
    console.log(`Processing ${this.offlineQueue.length} queued requests`);
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const { request, resolve, reject } of queue) {
      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
  }

  private async refreshCacheInBackground<T>(
    requestFn: () => Promise<T>,
    cacheKey: string
  ) {
    try {
      const result = await requestFn();
      this.saveToCache(cacheKey, result);
      console.log(`🔄 Background refresh completed for ${cacheKey}`);
    } catch (error) {
      console.warn(`Background refresh failed for ${cacheKey}:`, error);
    }
  }

  private saveToCache(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getFromCache(key: string, allowStale = false): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired && !allowStale) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods for common operations
  async supabaseQuery<T>(
    queryFn: () => Promise<T>,
    cacheKey?: string,
    options?: FallbackOptions
  ): Promise<T> {
    return this.withFallback(queryFn, cacheKey, options);
  }

  async edgeFunction<T>(
    functionName: string,
    body?: any,
    cacheKey?: string
  ): Promise<T> {
    return this.withFallback(
      async () => {
        const { data, error } = await supabase.functions.invoke(functionName, { body });
        if (error) throw error;
        return data;
      },
      cacheKey,
      { enableRetry: true, enableCaching: false, enableOfflineMode: true }
    );
  }

  clearCache(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      queuedRequests: this.offlineQueue.length,
      cacheSize: this.cache.size
    };
  }
}

// Export singleton instance
export const networkFallback = NetworkFallbackManager.getInstance();

// Utility wrapper for common patterns
export const withNetworkFallback = <T>(
  requestFn: () => Promise<T>,
  cacheKey?: string,
  options?: FallbackOptions
): Promise<T> => {
  return networkFallback.withFallback(requestFn, cacheKey, options);
};