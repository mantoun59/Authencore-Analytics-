// Production-ready optimizations and utilities
import React from 'react';
import { logger } from '@/services/loggingService';
import { performanceOptimizer } from './performanceOptimizer';

// Remove console statements in production
export const removeConsoleInProduction = () => {
  if (import.meta.env.PROD) {
    // Override console methods in production
    const noop = () => {};
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    console.warn = (message: any, ...args: any[]) => {
      logger.warn(String(message), { metadata: { args } });
    };
    console.error = (message: any, ...args: any[]) => {
      logger.error(String(message), undefined, { metadata: { args } });
    };
  }
};

// Error boundary for production
export class ProductionErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; resetError: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error in production
    logger.critical('React Error Boundary caught error', error, {
      component: 'ErrorBoundary',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });

    // Send to error reporting service in production
    if (import.meta.env.PROD) {
      this.reportErrorToService(error, errorInfo);
    }
  }

  private reportErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // In production, send to error reporting service like Sentry
    // For now, store in localStorage for debugging
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingReports = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingReports.push(errorReport);
      
      // Keep only last 50 error reports
      const recentReports = existingReports.slice(-50);
      localStorage.setItem('error_reports', JSON.stringify(recentReports));
    } catch (storageError) {
      // Fallback if localStorage fails
      logger.error('Failed to store error report', storageError as Error);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={this.resetError}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy loading utility with error handling
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent?: React.ComponentType
) => {
  const LazyComponent = React.lazy(async () => {
    try {
      return await performanceOptimizer.measureAsync('lazy-import', importFunc);
    } catch (error) {
      logger.error('Failed to load lazy component', error as Error, {
        component: 'LazyLoading'
      });
      
      return {
        default: (fallbackComponent || (() => React.createElement('div', {
          className: 'p-4 text-center text-red-600'
        }, 'Failed to load component. Please try again.'))) as T
      };
    }
  });

  return LazyComponent;
};

// Image optimization utility
export const optimizeImage = (src: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
}) => {
  // Simple image optimization for production
  if (!src) return src;
  
  const { width, height, quality = 80, format = 'webp' } = options || {};
  
  // For production, you might want to use a service like Cloudinary or ImageKit
  // For now, return original src with loading optimization
  return src;
};

// Resource preloading
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-var.woff2',
    // Add other critical font files
  ];

  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontUrl;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical CSS
  const criticalCSS = [
    // Add critical CSS files
  ];

  criticalCSS.forEach(cssUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = cssUrl;
    link.as = 'style';
    document.head.appendChild(link);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      logger.info('Service Worker registered successfully', {
        component: 'ServiceWorker',
        metadata: { scope: registration.scope }
      });

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update available notification
              logger.info('App update available', {
                component: 'ServiceWorker'
              });
            }
          });
        }
      });

      return registration;
    } catch (error) {
      logger.error('Service Worker registration failed', error as Error, {
        component: 'ServiceWorker'
      });
    }
  }
};

// Bundle analyzer utility
export const analyzeBundleInDev = () => {
  if (import.meta.env.DEV) {
    // In development, analyze bundle size
    const scripts = Array.from(document.scripts);
    const totalSize = scripts.reduce((size, script) => {
      if (script.src && script.src.includes('node_modules')) {
        return size + (script.innerHTML.length || 0);
      }
      return size;
    }, 0);

    logger.info('Bundle analysis (dev mode)', {
      component: 'BundleAnalyzer',
      metadata: {
        scriptCount: scripts.length,
        estimatedSize: totalSize,
        timestamp: Date.now()
      }
    });
  }
};

// Initialize production optimizations
export const initializeProductionOptimizations = () => {
  // Remove console logs in production
  removeConsoleInProduction();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Register service worker
  registerServiceWorker();
  
  // Monitor performance
  performanceOptimizer.monitorMemoryUsage();
  
  // Bundle analysis in dev
  analyzeBundleInDev();
  
  logger.info('Production optimizations initialized', {
    component: 'ProductionOptimizations',
    metadata: {
      environment: import.meta.env.MODE,
      timestamp: Date.now()
    }
  });
};

// Error reporting utility
export const reportError = (error: Error, context?: Record<string, any>) => {
  logger.error('Application error', error, {
    component: 'ErrorReporting',
    metadata: context
  });

  if (import.meta.env.PROD) {
    // In production, send to error reporting service
    // For now, store locally
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingReports = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingReports.push(errorReport);
      localStorage.setItem('error_reports', JSON.stringify(existingReports.slice(-50)));
    } catch (storageError) {
      // Silent fail for error reporting
    }
  }
};

export default {
  removeConsoleInProduction,
  ProductionErrorBoundary,
  createLazyComponent,
  optimizeImage,
  preloadCriticalResources,
  registerServiceWorker,
  analyzeBundleInDev,
  initializeProductionOptimizations,
  reportError
};
