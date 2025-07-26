import { useCallback, useMemo, useRef } from 'react';

// Debounce hook for expensive operations
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
};

// Memoized computation with expiration
export const useExpireMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): T => {
  const cache = useRef<{ value: T; timestamp: number; deps: React.DependencyList }>();

  return useMemo(() => {
    const now = Date.now();
    const isExpired = !cache.current || (now - cache.current.timestamp) > ttl;
    const depsChanged = !cache.current || 
      cache.current.deps.length !== deps.length ||
      cache.current.deps.some((dep, index) => dep !== deps[index]);

    if (isExpired || depsChanged) {
      cache.current = {
        value: factory(),
        timestamp: now,
        deps: [...deps]
      };
    }

    return cache.current.value;
  }, deps);
};

// Virtual scrolling for large lists
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
    const totalHeight = items.length * itemHeight;

    return {
      totalHeight,
      visibleCount,
      getVisibleItems: (scrollTop: number) => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount, items.length);
        
        return {
          startIndex: Math.max(0, startIndex),
          endIndex,
          items: items.slice(Math.max(0, startIndex), endIndex),
          offsetY: Math.max(0, startIndex) * itemHeight
        };
      }
    };
  }, [items, itemHeight, containerHeight]);
};

// Lazy loading with intersection observer
export const useLazyLoading = (threshold = 0.1) => {
  const targetRef = useRef<HTMLElement>(null);
  const isIntersecting = useRef(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => {
          isIntersecting.current = entry.isIntersecting;
        },
        { threshold }
      ),
    [threshold]
  );

  const setTarget = useCallback((element: HTMLElement | null) => {
    if (targetRef.current) {
      observer.unobserve(targetRef.current);
    }
    
    if (element) {
      targetRef.current = element;
      observer.observe(element);
    }
  }, [observer]);

  return { setTarget, isIntersecting: () => isIntersecting.current };
};

// Performance monitoring
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  private static measures = new Map<string, number>();

  static startTiming(name: string) {
    this.marks.set(name, performance.now());
  }

  static endTiming(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start timing found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measures.set(name, duration);
    this.marks.delete(name);

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static getMetrics() {
    return {
      measures: Object.fromEntries(this.measures),
      activeTiming: Array.from(this.marks.keys())
    };
  }

  static clearMetrics() {
    this.marks.clear();
    this.measures.clear();
  }
}

// Resource preloading
export const preloadResource = (url: string, type: 'image' | 'script' | 'style' = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
  }
  
  document.head.appendChild(link);
};

// Critical resource loading
export const loadCriticalResources = () => {
  // Preload important images
  const criticalImages = [
    '/src/assets/authencore-logo.png',
    '/src/assets/hero-background.jpg'
  ];

  criticalImages.forEach(url => {
    preloadResource(url, 'image');
  });
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const used = Math.round(memInfo.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memInfo.totalJSHeapSize / 1024 / 1024);
      
      if (used > 100) { // Alert if using more than 100MB
        console.warn(`High memory usage: ${used}MB / ${total}MB`);
      }
      
      return { used, total, limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024) };
    }
    return null;
  }, []);

  return { checkMemoryUsage };
};