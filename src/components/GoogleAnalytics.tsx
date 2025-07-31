import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 Measurement ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'assessment_type',
          custom_parameter_2: 'user_type'
        }
      });
    `;
    document.head.appendChild(script2);

    // Set up gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href
      });

      // Track custom events for assessment platform
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
        custom_parameter_1: getAssessmentType(location.pathname),
        custom_parameter_2: getUserType()
      });
    }
  }, [location]);

  return null;
};

// Helper function to determine assessment type from URL
const getAssessmentType = (pathname: string): string => {
  if (pathname.includes('career-launch')) return 'career_launch';
  if (pathname.includes('communication')) return 'communication';
  if (pathname.includes('cair')) return 'cair';
  if (pathname.includes('emotional-intelligence')) return 'emotional_intelligence';
  if (pathname.includes('leadership')) return 'leadership';
  if (pathname.includes('stress-resilience')) return 'stress_resilience';
  if (pathname.includes('digital-wellness')) return 'digital_wellness';
  if (pathname.includes('genz-workplace')) return 'genz_workplace';
  if (pathname.includes('faith-values')) return 'faith_values';
  if (pathname.includes('burnout-prevention')) return 'burnout_prevention';
  if (pathname.includes('assessment')) return 'general_assessment';
  return 'website';
};

// Helper function to determine user type
const getUserType = (): string => {
  const pathname = window.location.pathname;
  if (pathname.includes('employer')) return 'employer';
  if (pathname.includes('partner')) return 'partner';
  if (pathname.includes('admin')) return 'admin';
  return 'individual';
};

// Export tracking functions for use throughout the app
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      event_category: 'Assessment Platform',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      custom_parameter_1: parameters.assessment_type || getAssessmentType(window.location.pathname),
      custom_parameter_2: parameters.user_type || getUserType(),
      ...parameters
    });
  }
};

export const trackAssessmentStart = (assessmentType: string) => {
  trackEvent('assessment_start', {
    assessment_type: assessmentType,
    event_category: 'Assessment',
    event_label: assessmentType
  });
};

export const trackAssessmentComplete = (assessmentType: string, duration: number) => {
  trackEvent('assessment_complete', {
    assessment_type: assessmentType,
    event_category: 'Assessment',
    event_label: assessmentType,
    value: duration
  });
};

export const trackReportDownload = (assessmentType: string, reportType: string) => {
  trackEvent('report_download', {
    assessment_type: assessmentType,
    report_type: reportType,
    event_category: 'Report',
    event_label: `${assessmentType}_${reportType}`
  });
};

export const trackFormSubmission = (formType: string, success: boolean) => {
  trackEvent('form_submission', {
    form_type: formType,
    success: success,
    event_category: 'Form',
    event_label: formType
  });
};

export default GoogleAnalytics;