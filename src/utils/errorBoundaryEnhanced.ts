/**
 * Enhanced Error Boundary System
 * Provides comprehensive error handling with user-friendly feedback
 */

import React from 'react';
import { logger } from '@/services/loggingService';

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  eventId?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
  retryCount: number;
}

export class EnhancedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  ErrorBoundaryState
> {
  private maxRetries = 3;
  private retryTimeouts: Set<NodeJS.Timeout> = new Set();

  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = this.generateEventId();
    
    // Enhanced error logging
    logger.error('Error Boundary caught error:', error, {
      component: 'ErrorBoundary',
      metadata: {
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
        eventId,
        retryCount: this.state.retryCount,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });

    this.setState({
      errorInfo: {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name
      },
      eventId,
      retryCount: this.state.retryCount + 1
    });

    // Report to external error tracking service in production
    if (import.meta.env.PROD) {
      this.reportToErrorService(error, errorInfo, eventId);
    }
  }

  private generateEventId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportToErrorService(error: Error, errorInfo: React.ErrorInfo, eventId: string) {
    // Placeholder for external error reporting (Sentry, LogRocket, etc.)
    try {
      const errorReport = {
        eventId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        environment: import.meta.env.MODE
      };

      // Store locally for now, could be sent to external service
      localStorage.setItem(`error_${eventId}`, JSON.stringify(errorReport));
    } catch (reportError) {
      logger.error('Failed to report error to external service:', reportError);
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      const timeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          eventId: null
        });
        this.retryTimeouts.delete(timeout);
      }, 1000); // Wait 1 second before retry

      this.retryTimeouts.add(timeout);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    // Clean up timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  render() {
    if (this.state.hasError) {
      const { error, eventId, retryCount } = this.state;
      const canRetry = retryCount < this.maxRetries;

      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return React.createElement(FallbackComponent, {
          error,
          eventId,
          onRetry: canRetry ? this.handleRetry : undefined,
          onReload: this.handleReload
        });
      }

      // Default error UI
      return React.createElement('div', {
        className: 'min-h-screen flex items-center justify-center bg-gray-50 px-4'
      }, 
        React.createElement('div', {
          className: 'max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'
        },
          React.createElement('div', {
            className: 'text-red-500 mb-4'
          },
            React.createElement('svg', {
              className: 'w-12 h-12 mx-auto',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24'
            },
              React.createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
              })
            )
          ),
          React.createElement('h2', {
            className: 'text-xl font-semibold text-gray-900 mb-2'
          }, 'Oops! Something went wrong'),
          React.createElement('p', {
            className: 'text-gray-600 mb-4'
          }, 'We\'re sorry, but something unexpected happened. Our team has been notified.'),
          React.createElement('div', {
            className: 'space-y-2'
          },
            canRetry && React.createElement('button', {
              onClick: this.handleRetry,
              className: 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors'
            }, 'Try Again'),
            React.createElement('button', {
              onClick: this.handleReload,
              className: 'w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors'
            }, 'Reload Page')
          ),
          import.meta.env.DEV && eventId && React.createElement('div', {
            className: 'mt-4 text-xs text-gray-500'
          }, `Error ID: ${eventId}`)
        )
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<any>
) {
  const WrappedComponent = (props: P) => {
    return React.createElement(
      EnhancedErrorBoundary,
      { fallback },
      React.createElement(Component, props)
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason, {
      component: 'GlobalErrorHandler',
      metadata: {
        type: 'unhandledRejection',
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    });

    // Prevent the default browser error message
    event.preventDefault();
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    logger.error('Global JavaScript error:', event.error, {
      component: 'GlobalErrorHandler',
      metadata: {
        type: 'globalError',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    });
  });
};