/**
 * Production Optimization Utilities
 * Performance enhancements for production builds
 */

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  resourceCount: number;
  memoryUsage?: number;
}

export class ProductionOptimizer {
  private static instance: ProductionOptimizer;
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    resourceCount: 0
  };

  static getInstance(): ProductionOptimizer {
    if (!ProductionOptimizer.instance) {
      ProductionOptimizer.instance = new ProductionOptimizer();
    }
    return ProductionOptimizer.instance;
  }

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (import.meta.env.PROD) {
      this.setupPerformanceObserver();
      this.preloadCriticalResources();
      this.setupServiceWorker();
    }
  }

  /**
   * Setup performance observer for Core Web Vitals
   */
  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        // Send to analytics only in production
        this.trackMetric('lcp', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Ignore if not supported
      }

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as any;
          this.trackMetric('fid', fidEntry.processingStart - fidEntry.startTime);
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Ignore if not supported
      }

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.trackMetric('cls', clsValue);
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Ignore if not supported
      }
    }
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    const criticalResources = [
      '/authencore-logo-transparent.png',
      '/final-logo.png'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  /**
   * Setup service worker for caching
   */
  private setupServiceWorker(): void {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          if (import.meta.env.DEV) {
            console.log('SW registered: ', registration);
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.log('SW registration failed: ', error);
          }
        }
      });
    }
  }

  /**
   * Track performance metric
   */
  private trackMetric(name: string, value: number): void {
    // In production, send to analytics
    if (import.meta.env.PROD && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        custom_parameter: 'web_vitals'
      });
    }
  }

  /**
   * Optimize images lazy loading
   */
  optimizeImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        const image = img as HTMLImageElement;
        image.src = image.dataset.src!;
        image.removeAttribute('data-src');
      });
    }
  }

  /**
   * Memory cleanup
   */
  cleanup(): void {
    // Clear unused data structures
    if (window.gc && import.meta.env.DEV) {
      window.gc();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
    };
  }
}

// Initialize optimizer
export const optimizer = ProductionOptimizer.getInstance();

// Auto-initialize in production
if (import.meta.env.PROD) {
  optimizer.init();
}

// Export utility functions
export const trackPerformance = (name: string, fn: () => void) => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`Performance: ${name} took ${end - start}ms`);
  } else {
    fn();
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};