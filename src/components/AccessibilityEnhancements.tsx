/**
 * Accessibility Enhancements Component
 * Provides additional accessibility features beyond basic ARIA support
 */

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
}

export const AccessibilityEnhancements: React.FC<AccessibilityEnhancementsProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved preferences
    const savedHighContrast = localStorage.getItem('high-contrast') === 'true';
    const savedFocusVisible = localStorage.getItem('focus-visible') === 'true';
    
    setHighContrast(savedHighContrast);
    setFocusVisible(savedFocusVisible);

    // Apply preferences
    if (savedHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    if (savedFocusVisible) {
      document.documentElement.classList.add('focus-visible-always');
    }

    // Add keyboard navigation support
    const handleKeydown = (e: KeyboardEvent) => {
      // Skip to main content (Alt + S)
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView();
        }
      }

      // Skip to navigation (Alt + N)
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const nav = document.querySelector('nav');
        if (nav) {
          nav.focus();
          nav.scrollIntoView();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    toast({
      title: `High contrast ${newValue ? 'enabled' : 'disabled'}`,
      description: `Visual contrast has been ${newValue ? 'increased' : 'restored to normal'}.`
    });
  };

  const toggleFocusVisible = () => {
    const newValue = !focusVisible;
    setFocusVisible(newValue);
    localStorage.setItem('focus-visible', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('focus-visible-always');
    } else {
      document.documentElement.classList.remove('focus-visible-always');
    }

    toast({
      title: `Focus indicators ${newValue ? 'enhanced' : 'normalized'}`,
      description: `Keyboard focus visibility has been ${newValue ? 'enhanced' : 'restored to default'}.`
    });
  };

  return (
    <div className="accessibility-wrapper">
      {/* Skip Links */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:p-4">
        <a href="#main-content" className="underline">
          Skip to main content (Alt + S)
        </a>
        <a href="#navigation" className="ml-4 underline">
          Skip to navigation (Alt + N)
        </a>
      </div>

      {/* Accessibility Controls */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2" role="region" aria-label="Accessibility controls">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleHighContrast}
          aria-pressed={highContrast}
          aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast mode`}
          className="bg-background/95 backdrop-blur-sm"
        >
          {highContrast ? '🔆' : '🌓'} Contrast
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFocusVisible}
          aria-pressed={focusVisible}
          aria-label={`${focusVisible ? 'Normalize' : 'Enhance'} focus indicators`}
          className="bg-background/95 backdrop-blur-sm block"
        >
          {focusVisible ? '👁️' : '🎯'} Focus
        </Button>
      </div>

      {children}
    </div>
  );
};

export default AccessibilityEnhancements;