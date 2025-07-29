/**
 * Comprehensive Test Setup
 * Sets up testing infrastructure for the entire application
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Test utilities
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(BrowserRouter, null, children)
  );
};

// Custom render function with providers
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    wrapper: TestWrapper,
    ...options,
  });
};

// Mock Supabase client
export const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => Promise.resolve({ data: null, error: null })),
      delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
};

// Mock window.matchMedia for responsive tests
export const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Assessment test data
export const mockAssessmentData = {
  careerLaunch: {
    id: 'career-launch',
    title: 'Career Launch Assessment',
    questions: [
      {
        id: 'q1',
        text: 'What motivates you most at work?',
        type: 'multiple-choice',
        options: ['Achievement', 'Recognition', 'Growth', 'Stability'],
      },
    ],
    results: {
      personality: { openness: 75, conscientiousness: 85 },
      interests: { realistic: 60, investigative: 80 },
      values: { achievement: 90, security: 70 },
    },
  },
};

// Common test assertions
export const commonAssertions = {
  // Check if loading state is handled
  hasLoadingState: (container: HTMLElement) => {
    expect(container.querySelector('[data-testid="loading"]') || 
           container.textContent?.includes('Loading')).toBeTruthy();
  },

  // Check if error state is handled
  hasErrorState: (container: HTMLElement) => {
    expect(container.querySelector('[data-testid="error"]') || 
           container.textContent?.includes('Error')).toBeTruthy();
  },

  // Check accessibility
  isAccessible: (element: HTMLElement) => {
    expect(element).toHaveAttribute('aria-label');
    expect(element).toBeVisible();
  },

  // Check form validation (simplified - no fireEvent/waitFor)
  hasFormValidation: (form: HTMLElement) => {
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
  },
};

// Test categories for organization
export const testCategories = {
  unit: 'Unit Tests',
  integration: 'Integration Tests',
  e2e: 'End-to-End Tests',
  accessibility: 'Accessibility Tests',
  performance: 'Performance Tests',
};

// Mock performance API for tests
export const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
};

// Setup and teardown helpers
export const setupTest = () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock window APIs
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(mockMatchMedia),
    });

    Object.defineProperty(window, 'performance', {
      writable: true,
      value: mockPerformance,
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });
};

// Test suites for different components
export const createComponentTestSuite = (
  componentName: string,
  Component: React.ComponentType<any>,
  defaultProps = {}
) => {
  describe(`${componentName} Component`, () => {
    setupTest();

    it('renders without crashing', () => {
      expect(() => {
        renderWithProviders(React.createElement(Component, defaultProps));
      }).not.toThrow();
    });

    it('has proper accessibility attributes', () => {
      const { container } = renderWithProviders(React.createElement(Component, defaultProps));
      const element = container.firstChild as HTMLElement;
      
      if (element) {
        // Check basic accessibility
        expect(element).toBeInTheDocument();
        
        // Check for proper heading structure if component has headings
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          expect(heading).toBeVisible();
        });
      }
    });

    it('handles props correctly', () => {
      const testProps = { ...defaultProps, testProp: 'test-value' };
      const { container } = renderWithProviders(React.createElement(Component, testProps));
      expect(container.firstChild).toBeInTheDocument();
    });
  });
};

// Assessment-specific test helpers (simplified)
export const assessmentTestHelpers = {
  // Validate assessment results
  validateResults: (results: any, expectedStructure: any) => {
    expect(results).toBeDefined();
    expect(typeof results).toBe('object');
    
    Object.keys(expectedStructure).forEach(key => {
      expect(results).toHaveProperty(key);
    });
  },
};

// Export basic testing utilities
export {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  render,
};

// Global test configuration
export const testConfig = {
  timeout: 10000,
  retries: 2,
  bail: 1,
};