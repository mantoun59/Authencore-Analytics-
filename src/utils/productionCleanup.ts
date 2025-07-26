/**
 * Production Cleanup Utilities
 * Removes development artifacts and optimizes code for production
 */

// Remove console.log statements in production
if (import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.warn = noop;
  console.debug = noop;
  // Keep console.error for important error tracking
}

// Performance optimizations for production
export const optimizeForProduction = () => {
  if (import.meta.env.PROD) {
    // Remove development tools
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed - this is fine
      });
    }
    
    // Optimize performance
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Cleanup non-critical resources
        const developmentElements = document.querySelectorAll('[data-dev]');
        developmentElements.forEach(el => el.remove());
      });
    }
  }
};

// Initialize production optimizations
optimizeForProduction();
