import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getEnvironmentSettings } from '@/config/environment';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to console and external service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Report to error tracking service (when available)
    this.reportError(error, errorInfo);

    // Custom error handler
    if (onError) {
      onError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('userId') || 'anonymous'
    };

  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state;
    const settings = getEnvironmentSettings();
    
    if (settings.showDetailedErrors && error) {
      // Copy error details to clipboard
      const errorDetails = `Error ID: ${errorId}\nMessage: ${error.message}\nStack: ${error.stack}\nComponent Stack: ${errorInfo?.componentStack}`;
      navigator.clipboard.writeText(errorDetails);
      alert('Error details copied to clipboard');
    }
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, level = 'component' } = this.props;
    const settings = getEnvironmentSettings();

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Different error UIs based on error level
      if (level === 'critical') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <CardTitle className="text-2xl">Critical Error</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    A critical error has occurred. Please refresh the page or contact support.
                  </AlertDescription>
                </Alert>
                
                {settings.showDetailedErrors && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <strong>Error:</strong> {error?.message}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={this.handleGoHome} className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                  {settings.debugMode && (
                    <Button variant="ghost" onClick={this.handleReportBug} size="sm">
                      <Bug className="w-4 h-4 mr-2" />
                      Copy Error Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      if (level === 'page') {
        return (
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center">
                <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                <CardTitle>Page Error</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Something went wrong while loading this page.
                </p>
                
                {settings.showDetailedErrors && error && (
                  <Alert>
                    <AlertDescription className="text-sm">
                      {error.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                  <Button variant="outline" onClick={this.handleGoHome}>
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Component level error (minimal UI)
      return (
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Component Error</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            This component encountered an error and couldn't render properly.
          </p>
          {settings.showDetailedErrors && error && (
            <p className="text-xs text-muted-foreground mb-3 font-mono">
              {error.message}
            </p>
          )}
          <Button size="sm" variant="outline" onClick={this.handleRetry}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      );
    }

    return children;
  }
}

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error reporting from functional components
export const useErrorHandler = () => {
  const reportError = (error: Error, context?: string) => {
    console.error(`Error in ${context}:`, error);
    
    // Report to error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    
  };

  return { reportError };
};