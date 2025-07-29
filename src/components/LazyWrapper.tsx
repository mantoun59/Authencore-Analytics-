/**
 * Lazy Loading Wrapper Component
 * Provides performance optimization through lazy loading
 */

import React, { Suspense, LazyExoticComponent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<any>;
}

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-destructive/10 rounded-lg border border-destructive/20">
    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold text-destructive">Oops! Something went wrong</h3>
      <p className="text-sm text-muted-foreground">
        We encountered an error while loading this component.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <details className="text-xs text-muted-foreground mt-2">
          <summary className="cursor-pointer hover:text-foreground">Error Details</summary>
          <pre className="mt-2 p-2 bg-muted rounded text-left overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
    <Button 
      onClick={resetErrorBoundary}
      variant="outline"
      size="sm"
    >
      Try Again
    </Button>
  </div>
);

/**
 * Lazy wrapper for components with error boundary and loading states
 */
export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <LoadingSpinner />,
  errorFallback = ErrorFallback
}) => (
  <ErrorBoundary FallbackComponent={errorFallback}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

/**
 * Higher-order component for creating lazy-loaded components with enhanced loading
 */
export const withLazyLoading = <P extends object>(
  Component: LazyExoticComponent<React.ComponentType<P>>,
  loadingMessage?: string
) => {
  return (props: P) => (
    <LazyWrapper 
      fallback={<LoadingSpinner message={loadingMessage} />}
    >
      <Component {...props} />
    </LazyWrapper>
  );
};

/**
 * Hook for lazy loading with intersection observer
 */
export const useLazyIntersection = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasBeenVisible, setHasBeenVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasBeenVisible(true);
        } else {
          setIsIntersecting(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { ref, isIntersecting, hasBeenVisible };
};

/**
 * Lazy container that loads children when in view
 */
interface LazyContainerProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  height?: string | number;
  className?: string;
}

export const LazyContainer: React.FC<LazyContainerProps> = ({
  children,
  placeholder = <LoadingSpinner size="sm" message="Loading content..." />,
  height = 200,
  className = ''
}) => {
  const { ref, hasBeenVisible } = useLazyIntersection();

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}
    >
      {hasBeenVisible ? children : placeholder}
    </div>
  );
};

export default LazyWrapper;