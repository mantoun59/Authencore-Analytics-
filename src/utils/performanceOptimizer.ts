// Performance monitoring and optimization utilities
import { logger } from '@/services/loggingService';

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  componentName?: string;
  metadata?: Record<string, any>;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private measurements: Map<string, number> = new Map();
  private performanceEntries: PerformanceEntry[] = [];
  private observer?: PerformanceObserver;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver() {
    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordEntry({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration
          });
        }
      });

      this.observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
    }
  }

  // Start timing an operation
  startTiming(operationName: string, componentName?: string): string {
    const uniqueId = `${operationName}-${Date.now()}-${Math.random()}`;
    this.measurements.set(uniqueId, performance.now());
    
    if (componentName) {
      logger.debug(`Performance timing started: ${operationName}`, {
        component: componentName,
        metadata: { operationName, uniqueId }
      });
    }
    
    return uniqueId;
  }

  // End timing and record the duration
  endTiming(uniqueId: string, metadata?: Record<string, any>): number {
    const startTime = this.measurements.get(uniqueId);
    if (!startTime) {
      logger.warn('Performance timing not found', { metadata: { uniqueId } });
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(uniqueId);

    // Extract operation name from uniqueId
    const operationName = uniqueId.split('-')[0];
    
    this.recordEntry({
      name: operationName,
      startTime,
      duration,
      metadata
    });

    // Log slow operations
    if (duration > 100) {
      logger.warn(`Slow operation detected: ${operationName}`, {
        component: 'Performance',
        metadata: { duration, operationName, ...metadata }
      });
    }

    return duration;
  }

  // Record a performance entry
  private recordEntry(entry: PerformanceEntry) {
    this.performanceEntries.push(entry);
    
    // Keep only last 1000 entries to prevent memory leaks
    if (this.performanceEntries.length > 1000) {
      this.performanceEntries = this.performanceEntries.slice(-1000);
    }

    // Log to service for monitoring
    logger.performanceLog(entry.name, entry.duration, entry.metadata);
  }

  // Measure React component render time
  measureComponent<T>(
    componentName: string,
    renderFunction: () => T,
    metadata?: Record<string, any>
  ): T {
    const timingId = this.startTiming(`render-${componentName}`, componentName);
    
    try {
      const result = renderFunction();
      this.endTiming(timingId, { componentName, ...metadata });
      return result;
    } catch (error) {
      this.endTiming(timingId, { componentName, error: true, ...metadata });
      throw error;
    }
  }

  // Measure async operations
  async measureAsync<T>(
    operationName: string,
    asyncFunction: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const timingId = this.startTiming(operationName);
    
    try {
      const result = await asyncFunction();
      this.endTiming(timingId, metadata);
      return result;
    } catch (error) {
      this.endTiming(timingId, { error: true, ...metadata });
      throw error;
    }
  }

  // Get performance metrics
  getMetrics(): {
    averageRenderTime: number;
    slowOperations: PerformanceEntry[];
    totalOperations: number;
    componentMetrics: Record<string, { count: number; averageTime: number }>;
  } {
    const renderEntries = this.performanceEntries.filter(e => e.name.startsWith('render-'));
    const slowOperations = this.performanceEntries.filter(e => e.duration > 100);
    
    const componentMetrics: Record<string, { count: number; averageTime: number }> = {};
    
    renderEntries.forEach(entry => {
      const componentName = entry.componentName || 'Unknown';
      if (!componentMetrics[componentName]) {
        componentMetrics[componentName] = { count: 0, averageTime: 0 };
      }
      
      const current = componentMetrics[componentName];
      current.averageTime = (current.averageTime * current.count + entry.duration) / (current.count + 1);
      current.count++;
    });

    return {
      averageRenderTime: renderEntries.reduce((sum, e) => sum + e.duration, 0) / renderEntries.length || 0,
      slowOperations,
      totalOperations: this.performanceEntries.length,
      componentMetrics
    };
  }

  // Clear performance data
  clearMetrics() {
    this.performanceEntries = [];
    this.measurements.clear();
  }

  // React component wrapper for automatic performance monitoring
  static withPerformanceMonitoring<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    componentName?: string
  ) {
    const optimizer = PerformanceOptimizer.getInstance();
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

    const PerformanceMonitoredComponent = (props: P) => {
      return optimizer.measureComponent(
        name,
        () => React.createElement(WrappedComponent, props),
        { props: Object.keys(props).length }
      );
    };

    PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${name})`;
    return PerformanceMonitoredComponent;
  }

  // Bundle size analyzer
  analyzeBundleSize() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      logger.info('Network connection info', {
        component: 'Performance',
        metadata: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        }
      });
    }
  }

  // Memory usage monitoring
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryData = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };

      logger.info('Memory usage', {
        component: 'Performance',
        metadata: memoryData
      });

      // Warn if memory usage is high
      if (memoryData.usagePercentage > 80) {
        logger.warn('High memory usage detected', {
          component: 'Performance',
          metadata: memoryData
        });
      }

      return memoryData;
    }
    return null;
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearMetrics();
  }
}

// Create and export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Performance monitoring decorators/HOCs
export const measurePerformance = (operationName: string) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const timingId = performanceOptimizer.startTiming(operationName);
      
      try {
        const result = method.apply(this, args);
        
        if (result instanceof Promise) {
          return result.finally(() => {
            performanceOptimizer.endTiming(timingId);
          });
        } else {
          performanceOptimizer.endTiming(timingId);
          return result;
        }
      } catch (error) {
        performanceOptimizer.endTiming(timingId, { error: true });
        throw error;
      }
    };
  };
};

export default PerformanceOptimizer;
