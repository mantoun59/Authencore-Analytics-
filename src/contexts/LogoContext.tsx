import React, { createContext, useContext } from 'react';
import finalLogo from '../assets/authencore-logo-transparent.png';

export interface LogoOption {
  id: string;
  name: string;
  style: string;
  image: string;
}

// Single final logo option
export const logoOptions: LogoOption[] = [
  {
    id: 'final-logo',
    name: 'AuthenCore Analytics Final',
    style: 'Final approved brand logo',
    image: finalLogo
  }
];

interface LogoContextType {
  selectedLogoId: string;
  selectedLogo: LogoOption;
  setSelectedLogo: (logoId: string) => void;
  useTextLogo: false;
  setUseTextLogo: (useText: boolean) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const selectedLogoId = 'final-logo';
  const selectedLogo = logoOptions[0];

  const setSelectedLogo = () => {
    // No-op since we only have one logo now
  };

  const setUseTextLogo = () => {
    // No-op since we always use the final logo
  };

  return (
    <LogoContext.Provider value={{
      selectedLogoId,
      selectedLogo,
      setSelectedLogo,
      useTextLogo: false,
      setUseTextLogo
    }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};