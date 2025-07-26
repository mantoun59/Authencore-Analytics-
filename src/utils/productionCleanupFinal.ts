/**
 * Final Production Cleanup - Initialize on app start
 */

// Clean up console.log in production
if (import.meta.env.PROD) {
  // Override console methods in production
  const noop = () => {};
  
  // Keep console.error for critical error tracking
  const originalError = console.error;
  
  // Override development console methods
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = (message: string, ...args: unknown[]) => {
    // Only show warnings in development or for critical issues
    if (message.includes('security') || message.includes('error')) {
      originalError(message, ...args);
    }
  };
}

// Initialize production optimizations
export const initializeProductionOptimizations = () => {
  if (import.meta.env.PROD) {
    // Remove development attributes
    setTimeout(() => {
      const devElements = document.querySelectorAll('[data-dev], [data-debug]');
      devElements.forEach(el => el.remove());
    }, 1000);
    
    // Performance optimizations
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Clean up unused resources
        if (typeof window.gc === 'function') {
          window.gc();
        }
      });
    }
  }
};

// Auto-initialize
initializeProductionOptimizations();
