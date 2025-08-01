/**
 * Assessment Consent Management Utilities
 * Handles consent tracking for legal protection across all assessments
 */

export interface AssessmentConsentData {
  userType: 'applicant' | 'employer' | 'partner';
  assessmentType: string;
  consentGiven: {
    dataCollection: boolean;
    dataProcessing: boolean;
    dataSharing: boolean;
    internationalTransfer: boolean;
    reportGeneration: boolean;
    legalTerms: boolean;
  };
  timestamp: string;
  ipAddress?: string;
  userAgent: string;
}

/**
 * Check if valid consent exists for an assessment
 */
export const hasValidConsent = (assessmentType: string): boolean => {
  try {
    const consentKey = `assessment_consent_${assessmentType}`;
    const stored = localStorage.getItem(consentKey);
    
    if (!stored) return false;
    
    const consentData = JSON.parse(stored) as AssessmentConsentData;
    
    // Check if consent is not older than 12 months
    const consentDate = new Date(consentData.timestamp);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    if (consentDate < twelveMonthsAgo) {
      localStorage.removeItem(consentKey);
      return false;
    }
    
    // Check if all required consents are given
    const allConsentsGiven = Object.values(consentData.consentGiven).every(consent => consent === true);
    
    return allConsentsGiven;
  } catch (error) {
    console.error('Error checking consent:', error);
    return false;
  }
};

/**
 * Clear consent for specific assessment
 */
export const clearAssessmentConsent = (assessmentType: string): void => {
  const consentKey = `assessment_consent_${assessmentType}`;
  localStorage.removeItem(consentKey);
};

/**
 * Clear all assessment consents
 */
export const clearAllAssessmentConsents = (): void => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('assessment_consent_')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Get consent summary for compliance reporting
 */
export const getConsentSummary = (assessmentType: string): AssessmentConsentData | null => {
  try {
    const consentKey = `assessment_consent_${assessmentType}`;
    const stored = localStorage.getItem(consentKey);
    
    if (!stored) return null;
    
    return JSON.parse(stored) as AssessmentConsentData;
  } catch (error) {
    console.error('Error retrieving consent summary:', error);
    return null;
  }
};

/**
 * Export all consent data for GDPR compliance
 */
export const exportAllConsentData = (): AssessmentConsentData[] => {
  const consentData: AssessmentConsentData[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('assessment_consent_')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          consentData.push(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error parsing consent data:', error);
      }
    }
  }
  
  return consentData;
};