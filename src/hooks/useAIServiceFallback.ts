import { useState, useCallback } from 'react';
import { AIServiceFallback } from '@/services/aiServiceFallback';

interface UseAIServiceFallbackOptions {
  cacheTTL?: number;
  maxRetries?: number;
  fallbackStrategy?: 'cache' | 'static' | 'simplified';
}

export function useAIServiceFallback(options: UseAIServiceFallbackOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'primary' | 'fallback' | 'cache' | 'offline'>('primary');

  const callService = useCallback(async (
    serviceCall: () => Promise<any>,
    cacheKey: string,
    fallbackData?: any
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AIServiceFallback.callWithFallback(
        serviceCall,
        cacheKey,
        options.fallbackStrategy || 'cache',
        {
          cacheTTL: options.cacheTTL,
          retryConfig: {
            maxRetries: options.maxRetries || 3
          },
          fallbackData
        }
      );

      setSource(result.source);
      
      if (!result.success) {
        setError(result.error || 'Service call failed');
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    callService,
    isLoading,
    error,
    source,
    clearError: () => setError(null)
  };
}