import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            We apologize for the inconvenience. An unexpected error occurred while processing your request.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Error Details:</p>
              <p className="text-xs text-gray-600 font-mono">{error.message}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleReload} className="w-full">
              Reload Page
            </Button>
            <Button variant="ghost" onClick={handleGoHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            If this problem persists, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundaryFallback;