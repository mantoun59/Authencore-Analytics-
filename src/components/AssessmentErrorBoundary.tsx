import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class AssessmentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to analytics or error reporting service
    try {
      localStorage.setItem('last-assessment-error', JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        errorInfo
      }));
    } catch (e) {
      // Silent fallback for localStorage issues
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleGoHome = () => {
    // Clear any saved progress that might be causing issues
    try {
      localStorage.removeItem('assessment-progress');
      localStorage.removeItem('genz-assessment-progress');
    } catch (e) {
      // Silent fallback for localStorage issues
    }
    
    window.location.href = '/';
  };

  private clearErrorData = () => {
    try {
      localStorage.removeItem('last-assessment-error');
    } catch (e) {
      // Silent fallback for localStorage issues
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Assessment Error
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Something went wrong while running the assessment. This usually happens due to connection issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-100 dark:bg-red-950/50 p-4 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                  Error: {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Don't worry! Here's what you can do:</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Your progress is automatically saved and can be resumed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Check your internet connection and try again
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    If the problem persists, try refreshing the page or starting over
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                  variant="destructive"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <details>
                  <summary className="cursor-pointer hover:text-foreground">
                    Technical Details (for support)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AssessmentErrorBoundary;