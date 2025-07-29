/**
 * GDPR Consent Management Utilities
 * Implements comprehensive consent tracking and management
 */

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: string;
  version: string;
}

export interface GDPRConsentData {
  hasConsented: boolean;
  preferences: ConsentPreferences;
  consentDate: string;
  ipAddress?: string;
  userAgent?: string;
}

const CONSENT_VERSION = '1.0';
const CONSENT_STORAGE_KEY = 'gdpr_consent_v1';

/**
 * Get current consent status
 */
export const getConsentStatus = (): GDPRConsentData | null => {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored) as GDPRConsentData;
    
    // Check if consent is still valid (not older than 12 months)
    const consentDate = new Date(data.consentDate);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    if (consentDate < twelveMonthsAgo) {
      // Consent expired, remove it
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading consent data:', error);
    return null;
  }
};

/**
 * Save consent preferences
 */
export const saveConsent = (preferences: Omit<ConsentPreferences, 'timestamp' | 'version'>): void => {
  const consentData: GDPRConsentData = {
    hasConsented: true,
    preferences: {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    },
    consentDate: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
    
    // Also set legacy flags for backward compatibility
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('gdprConsent', 'true');
    localStorage.setItem('analyticsConsent', preferences.analytics ? 'true' : 'false');
    
    // Dispatch custom event for components to react to consent changes
    window.dispatchEvent(new CustomEvent('gdpr-consent-updated', { 
      detail: consentData 
    }));
  } catch (error) {
    console.error('Error saving consent:', error);
  }
};

/**
 * Withdraw consent (right to be forgotten)
 */
export const withdrawConsent = (): void => {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('gdprConsent');
    localStorage.removeItem('analyticsConsent');
    
    // Clear other potential tracking data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('analytics') || key.includes('tracking') || key.includes('session'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    window.dispatchEvent(new CustomEvent('gdpr-consent-withdrawn'));
  } catch (error) {
    console.error('Error withdrawing consent:', error);
  }
};

/**
 * Check if specific consent type is granted
 */
export const hasConsent = (type: keyof Omit<ConsentPreferences, 'timestamp' | 'version'>): boolean => {
  const consent = getConsentStatus();
  if (!consent || !consent.hasConsented) return false;
  
  return consent.preferences[type];
};

/**
 * Check if analytics can be enabled
 */
export const canUseAnalytics = (): boolean => {
  return hasConsent('analytics');
};

/**
 * Check if marketing cookies can be used
 */
export const canUseMarketing = (): boolean => {
  return hasConsent('marketing');
};

/**
 * Get consent summary for display
 */
export const getConsentSummary = (): { 
  status: 'pending' | 'granted' | 'denied' | 'expired';
  details: string;
  date?: string;
} => {
  const consent = getConsentStatus();
  
  if (!consent) {
    return {
      status: 'pending',
      details: 'Consent required - GDPR compliance pending'
    };
  }
  
  const grantedTypes = Object.entries(consent.preferences)
    .filter(([key, value]) => key !== 'timestamp' && key !== 'version' && value)
    .map(([key]) => key);
  
  if (grantedTypes.length === 0) {
    return {
      status: 'denied',
      details: 'All optional cookies declined - only essential cookies active',
      date: consent.consentDate
    };
  }
  
  return {
    status: 'granted',
    details: `Consented to: ${grantedTypes.join(', ')}`,
    date: consent.consentDate
  };
};

/**
 * Export user data for GDPR data portability
 */
export const exportUserData = (): object => {
  const consent = getConsentStatus();
  const userData = {
    gdprConsent: consent,
    assessmentProgress: localStorage.getItem('assessment_progress'),
    userPreferences: {
      language: localStorage.getItem('i18nextLng'),
      theme: localStorage.getItem('theme')
    },
    exportedAt: new Date().toISOString(),
    note: 'This export contains all personal data stored locally on your device'
  };
  
  return userData;
};