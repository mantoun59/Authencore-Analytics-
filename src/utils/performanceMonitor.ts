/**
 * Performance Monitoring Utility
 * Tracks component loading times and bundle sizes
 */
import React from 'react';

export interface LoadingMetrics {
  componentName: string;
  loadTime: number;
  timestamp: Date;
  bundleSize?: number;
}

class PerformanceMonitor {
  private metrics: LoadingMetrics[] = [];
  private loadStartTimes: Map<string, number> = new Map();

  /**
   * Start tracking component load time
   */
  startLoad(componentName: string): void {
    this.loadStartTimes.set(componentName, performance.now());
  }

  /**
   * Complete tracking and record metrics
   */
  endLoad(componentName: string): LoadingMetrics | null {
    const startTime = this.loadStartTimes.get(componentName);
    if (!startTime) return null;

    const loadTime = performance.now() - startTime;
    const metric: LoadingMetrics = {
      componentName,
      loadTime,
      timestamp: new Date()
    };

    this.metrics.push(metric);
    this.loadStartTimes.delete(componentName);

    // Log slow loading components in development
    if (process.env.NODE_ENV === 'development' && loadTime > 1000) {
      console.warn(`⚠️ Slow loading component: ${componentName} took ${Math.round(loadTime)}ms`);
    }

    return metric;
  }

  /**
   * Get performance metrics
   */
  getMetrics(): LoadingMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get average load time for a component
   */
  getAverageLoadTime(componentName: string): number {
    const componentMetrics = this.metrics.filter(m => m.componentName === componentName);
    if (componentMetrics.length === 0) return 0;

    const totalTime = componentMetrics.reduce((sum, m) => sum + m.loadTime, 0);
    return totalTime / componentMetrics.length;
  }

  /**
   * Clear metrics (useful for testing)
   */
  clearMetrics(): void {
    this.metrics = [];
    this.loadStartTimes.clear();
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for component performance tracking
 */
export const usePerformanceTracking = (componentName: string) => {
  React.useEffect(() => {
    performanceMonitor.startLoad(componentName);
    
    return () => {
      performanceMonitor.endLoad(componentName);
    };
  }, [componentName]);
};

/**
 * Higher-order component for automatic performance tracking
 */
export const withPerformanceTracking = <P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const TrackedComponent = (props: P) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    usePerformanceTracking(name);
    return React.createElement(WrappedComponent, props);
  };

  TrackedComponent.displayName = `withPerformanceTracking(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;
  return TrackedComponent;
};

// Performance utilities
export const PerformanceUtils = {
  /**
   * Log Core Web Vitals
   */
  logCoreWebVitals: () => {
    if ('web-vital' in window) {
      // @ts-ignore
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(console.log);
        onFID(console.log);
        onFCP(console.log);
        onLCP(console.log);
        onTTFB(console.log);
      });
    }
  },

  /**
   * Measure bundle sizes (estimation)
   */
  estimateComponentSize: (componentName: string): Promise<number> => {
    return new Promise((resolve) => {
      // Simplified estimation based on DOM nodes created
      const observer = new MutationObserver((mutations) => {
        let nodeCount = 0;
        mutations.forEach((mutation) => {
          nodeCount += mutation.addedNodes.length;
        });
        
        observer.disconnect();
        resolve(nodeCount * 100); // Rough estimation
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 1000);
    });
  }
};