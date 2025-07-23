import { useState, useEffect } from 'react';

export interface AssessmentLogo {
  id: string;
  assessmentType: string;
  logoUrl: string;
  logoFile?: File;
  name: string;
}

const STORAGE_KEY = 'assessment-logos';

export const useAssessmentLogos = () => {
  const [logos, setLogos] = useState<AssessmentLogo[]>([]);

  // Load logos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedLogos = JSON.parse(stored);
        setLogos(parsedLogos);
      }
    } catch (error) {
      console.error('Error loading logos from storage:', error);
    }
  }, []);

  // Save logos to localStorage whenever logos change
  const saveLogos = (newLogos: AssessmentLogo[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogos));
      setLogos(newLogos);
    } catch (error) {
      console.error('Error saving logos to storage:', error);
    }
  };

  // Get logo for specific assessment type
  const getLogoForAssessment = (assessmentType: string): AssessmentLogo | undefined => {
    return logos.find(logo => logo.assessmentType === assessmentType);
  };

  // Get logo URL for specific assessment type
  const getLogoUrl = (assessmentType: string): string | undefined => {
    const logo = getLogoForAssessment(assessmentType);
    return logo?.logoUrl;
  };

  // Check if assessment has a logo
  const hasLogo = (assessmentType: string): boolean => {
    return !!getLogoForAssessment(assessmentType);
  };

  // Add or update logo for assessment
  const setLogoForAssessment = (assessmentType: string, logoData: Omit<AssessmentLogo, 'id' | 'assessmentType'>) => {
    const newLogos = logos.filter(logo => logo.assessmentType !== assessmentType);
    const newLogo: AssessmentLogo = {
      id: crypto.randomUUID(),
      assessmentType,
      ...logoData
    };
    newLogos.push(newLogo);
    saveLogos(newLogos);
  };

  // Remove logo for assessment
  const removeLogoForAssessment = (assessmentType: string) => {
    const newLogos = logos.filter(logo => logo.assessmentType !== assessmentType);
    saveLogos(newLogos);
  };

  // Clear all logos
  const clearAllLogos = () => {
    saveLogos([]);
  };

  return {
    logos,
    saveLogos,
    getLogoForAssessment,
    getLogoUrl,
    hasLogo,
    setLogoForAssessment,
    removeLogoForAssessment,
    clearAllLogos
  };
};

export default useAssessmentLogos;