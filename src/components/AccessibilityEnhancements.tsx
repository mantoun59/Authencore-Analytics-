import React, { useEffect } from 'react';

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
}

export const AccessibilityEnhancements: React.FC<AccessibilityEnhancementsProps> = ({ children }) => {
  useEffect(() => {
    // Skip links for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for modal dialogs
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][aria-modal="true"]');
        if (activeModal) {
          const closeButton = activeModal.querySelector('[aria-label*="Close"], [aria-label*="close"]') as HTMLElement;
          closeButton?.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'page-announcer';
    document.body.appendChild(announcer);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      skipLink?.remove();
      announcer?.remove();
    };
  }, []);

  // Announce route changes
  const announcePageChange = (pageName: string) => {
    const announcer = document.getElementById('page-announcer');
    if (announcer) {
      announcer.textContent = `Navigated to ${pageName}`;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };

  return (
    <div>
      {children}
    </div>
  );
};

export const useA11yAnnounce = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return { announce };
};