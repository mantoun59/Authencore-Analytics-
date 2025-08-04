/**
 * Lazy loading utilities for code splitting
 * Improves initial bundle size and loading performance
 */

import { lazy, ComponentType } from 'react';

/**
 * Enhanced lazy loading with error boundary and loading states
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName?: string
) => {
  return lazy(async () => {
    try {
      const component = await importFn();
      
      // Track successful component load in dev mode
      if (import.meta.env.DEV && componentName) {
        // Component loaded successfully
      }
      
      return component;
    } catch (error) {
      // Graceful error handling
      if (import.meta.env.DEV) {
        console.error(`❌ Failed to load component: ${componentName}`, error);
      }
      
      // Return a fallback component
      return {
        default: (() => null) as unknown as T
      };
    }
  });
};

// Pre-define lazy-loaded assessment components
export const LazyAssessmentComponents = {
  CareerLaunch: createLazyComponent(
    () => import('@/pages/CareerLaunch'),
    'CareerLaunch'
  ),
  
  CommunicationStyles: createLazyComponent(
    () => import('@/pages/CommunicationStylesAssessmentPage'),
    'CommunicationStyles'
  ),
  
  EmotionalIntelligence: createLazyComponent(
    () => import('@/pages/EmotionalIntelligenceAssessment'),
    'EmotionalIntelligence'
  ),
  
  CAIRAssessment: createLazyComponent(
    () => import('@/pages/CAIRAssessment'),
    'CAIRAssessment'
  ),
  
  StressResilience: createLazyComponent(
    () => import('@/pages/StressResilience'),
    'StressResilience'
  ),
  
  LeadershipAssessment: createLazyComponent(
    () => import('@/pages/LeadershipAssessment'),
    'LeadershipAssessment'
  ),
  
  DigitalWellness: createLazyComponent(
    () => import('@/pages/DigitalWellnessAssessment'),
    'DigitalWellness'
  ),
  
  FaithValues: createLazyComponent(
    () => import('@/pages/FaithValuesAssessment'),
    'FaithValues'
  ),
  
  GenZWorkplace: createLazyComponent(
    () => import('@/pages/GenZWorkplaceAssessment'),
    'GenZWorkplace'
  ),
  
  CulturalIntelligence: createLazyComponent(
    () => import('@/pages/CulturalIntelligenceAssessment'),
    'CulturalIntelligence'
  )
};

// Admin components
export const LazyAdminComponents = {
  Admin: createLazyComponent(
    () => import('@/pages/Admin'),
    'Admin'
  ),
  
  AdminAnalytics: createLazyComponent(
    () => import('@/pages/AdminAnalytics'),
    'AdminAnalytics'
  ),
  
  EmployerDashboard: createLazyComponent(
    () => import('@/pages/EmployerDashboard'),
    'EmployerDashboard'
  ),
  
  PartnerDashboard: createLazyComponent(
    () => import('@/pages/PartnerDashboard'),
    'PartnerDashboard'
  ),
  
  TestingDashboard: createLazyComponent(
    () => import('@/pages/TestingDashboard'),
    'TestingDashboard'
  )
};

// Public pages
export const LazyPublicComponents = {
  SampleReports: createLazyComponent(
    () => import('@/pages/SampleReports'),
    'SampleReports'
  ),
  
  About: createLazyComponent(
    () => import('@/pages/About'),
    'About'
  ),
  
  FAQ: createLazyComponent(
    () => import('@/pages/FAQ'),
    'FAQ'
  ),
  
  MarketingMaterials: createLazyComponent(
    () => import('@/pages/MarketingMaterials'),
    'MarketingMaterials'
  ),
  
  Security: createLazyComponent(
    () => import('@/pages/Security'),
    'Security'
  )
};

/**
 * Preload components based on user behavior
 */
export const preloadComponent = (
  importFn: () => Promise<{ default: ComponentType<any> }>
): void => {
  // Preload after a delay to not impact initial load
  setTimeout(() => {
    importFn().catch(() => {
      // Silently fail - component will load when needed
    });
  }, 1000);
};

/**
 * Preload assessment components when user shows intent
 */
export const preloadAssessments = (): void => {
  if (import.meta.env.PROD) {
    // Preload most common assessments
    setTimeout(() => {
      preloadComponent(() => import('@/pages/CareerLaunch'));
      preloadComponent(() => import('@/pages/CommunicationStylesAssessmentPage'));
    }, 2000);
  }
};

/**
 * Bundle analyzer data for monitoring
 */
export const getBundleInfo = () => {
  if (import.meta.env.DEV) {
    return {
      loadedComponents: Object.keys(LazyAssessmentComponents).length + 
                      Object.keys(LazyAdminComponents).length + 
                      Object.keys(LazyPublicComponents).length,
      timestamp: new Date().toISOString()
    };
  }
  return null;
};