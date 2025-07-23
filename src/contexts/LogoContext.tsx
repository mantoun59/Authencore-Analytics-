import React, { createContext, useContext, useState } from 'react';
import finalLogo from '../assets/final-logo.png';
import blueGreenLogo from '../assets/authencore-logo-blue-green.png';
import purpleOrangeLogo from '../assets/authencore-logo-purple-orange.png';
import redTealLogo from '../assets/authencore-logo-red-teal.png';
import goldBlueLogo from '../assets/authencore-logo-gold-blue.png';

export interface LogoOption {
  id: string;
  name: string;
  style: string;
  image: string;
}

// Multiple colored logo options
export const logoOptions: LogoOption[] = [
  {
    id: 'final-logo',
    name: 'AuthenCore Analytics Original',
    style: 'Original brand logo',
    image: finalLogo
  },
  {
    id: 'blue-green-logo',
    name: 'AuthenCore Analytics Blue-Green',
    style: 'Vibrant blue and green gradient',
    image: blueGreenLogo
  },
  {
    id: 'purple-orange-logo',
    name: 'AuthenCore Analytics Purple-Orange',
    style: 'Dynamic purple and orange gradient',
    image: purpleOrangeLogo
  },
  {
    id: 'red-teal-logo',
    name: 'AuthenCore Analytics Red-Teal',
    style: 'Bold red and teal gradient',
    image: redTealLogo
  },
  {
    id: 'gold-blue-logo',
    name: 'AuthenCore Analytics Gold-Blue',
    style: 'Elegant gold and blue gradient',
    image: goldBlueLogo
  }
];

interface LogoContextType {
  selectedLogoId: string;
  selectedLogo: LogoOption;
  setSelectedLogo: (logoId: string) => void;
  useTextLogo: boolean;
  setUseTextLogo: (useText: boolean) => void;
  logoOptions: LogoOption[];
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLogoId, setSelectedLogoIdState] = useState('final-logo');
  const [useTextLogo, setUseTextLogo] = useState(false);
  
  const selectedLogo = logoOptions.find(logo => logo.id === selectedLogoId) || logoOptions[0];

  const setSelectedLogo = (logoId: string) => {
    setSelectedLogoIdState(logoId);
  };

  return (
    <LogoContext.Provider value={{
      selectedLogoId,
      selectedLogo,
      setSelectedLogo,
      useTextLogo,
      setUseTextLogo,
      logoOptions
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