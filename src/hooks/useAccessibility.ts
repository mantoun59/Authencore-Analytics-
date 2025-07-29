import { useState, useEffect } from 'react';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenReaderMode: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  colorBlindMode: 'none',
  screenReaderMode: false,
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};

const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
  const root = document.documentElement;
  
  // Font size adjustments
  root.className = root.className.replace(/font-(normal|large|extra-large)/g, '');
  root.classList.add(`font-${settings.fontSize}`);
  
  // High contrast mode
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }
  
  // Color blind mode
  root.className = root.className.replace(/colorblind-(protanopia|deuteranopia|tritanopia)/g, '');
  if (settings.colorBlindMode !== 'none') {
    root.classList.add(`colorblind-${settings.colorBlindMode}`);
  }
  
  // Screen reader mode
  if (settings.screenReaderMode) {
    root.classList.add('screen-reader-mode');
  } else {
    root.classList.remove('screen-reader-mode');
  }
};