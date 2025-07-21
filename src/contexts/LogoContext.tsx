import React, { createContext, useContext, useState, useEffect } from 'react';

// Import all logo options
import logo1 from '../assets/logo-generated-1.png';
import logo2 from '../assets/logo-generated-2.png';
import logo3 from '../assets/logo-generated-3.png';
import logo4 from '../assets/logo-generated-4.png';
import logo5 from '../assets/logo-generated-5.png';
import logo6 from '../assets/logo-generated-6.png';
import logo7 from '../assets/logo-generated-7.png';
import logo8 from '../assets/logo-generated-8.png';
import logo9 from '../assets/logo-generated-9.png';
import logo10 from '../assets/logo-generated-10.png';
import logo11 from '../assets/logo-generated-11.png';
import logo12 from '../assets/logo-generated-12.png';
import logo13 from '../assets/logo-generated-13.png';
import logo14 from '../assets/logo-generated-14.png';
import logo15 from '../assets/logo-generated-15.png';
import logo16 from '../assets/logo-generated-16.png';
import logo17 from '../assets/logo-generated-17.png';
import logo18 from '../assets/logo-generated-18.png';

export interface LogoOption {
  id: string;
  name: string;
  style: string;
  image: string;
}

export const logoOptions: LogoOption[] = [
  {
    id: 'custom-main',
    name: 'AuthenCore Analytics Official',
    style: 'Official brand logo with tagline',
    image: '/lovable-uploads/3d190ec3-d9ff-4d6f-802d-dbf60e262f52.png'
  },
  {
    id: 'gen-1',
    name: 'Minimalist Geometric',
    style: 'Modern minimalist with navy and gold',
    image: logo1
  },
  {
    id: 'gen-2',
    name: 'Professional Corporate',
    style: 'Elegant typography with brain symbol',
    image: logo2
  },
  {
    id: 'gen-3',
    name: 'Tech Circuit',
    style: 'Tech-focused with circuit patterns',
    image: logo3
  },
  {
    id: 'gen-4',
    name: 'Data Visualization',
    style: 'Analytics dashboard inspired',
    image: logo4
  },
  {
    id: 'gen-5',
    name: 'Geometric Abstract',
    style: 'Interlocking hexagonal shapes',
    image: logo5
  },
  {
    id: 'gen-6',
    name: 'Clean Typography',
    style: 'Elegant wordmark with accent',
    image: logo6
  },
  {
    id: 'gen-7',
    name: 'Shield Security',
    style: 'Protective shield with analytics symbols',
    image: logo7
  },
  {
    id: 'gen-8',
    name: 'DNA Spiral',
    style: 'Double helix representing authenticity',
    image: logo8
  },
  {
    id: 'gen-9',
    name: 'Crystalline Gem',
    style: 'Faceted diamond symbolizing clarity',
    image: logo9
  },
  {
    id: 'gen-10',
    name: 'Neural Networks',
    style: 'Human profile with brain connections',
    image: logo10
  },
  {
    id: 'gen-11',
    name: 'Infinity Flow',
    style: 'Continuous analysis and potential',
    image: logo11
  },
  {
    id: 'gen-12',
    name: 'Compass Navigation',
    style: 'Guidance and directional leadership',
    image: logo12
  },
  {
    id: 'gen-13',
    name: 'Ribbon Wave',
    style: 'Flowing ribbon forming AC initials',
    image: logo13
  },
  {
    id: 'gen-14',
    name: 'Keyhole Security',
    style: 'Key and lock with data streams',
    image: logo14
  },
  {
    id: 'gen-15',
    name: 'Mountain Peak',
    style: 'Peak performance and insights',
    image: logo15
  },
  {
    id: 'gen-16',
    name: 'Network Nodes',
    style: 'Connected web pattern analysis',
    image: logo16
  },
  {
    id: 'gen-17',
    name: 'Origami Fold',
    style: 'Geometric layered insights design',
    image: logo17
  },
  {
    id: 'gen-18',
    name: 'Phoenix Rising',
    style: 'Transformation and renewal theme',
    image: logo18
  }
];

interface LogoContextType {
  selectedLogoId: string | null;
  selectedLogo: LogoOption | null;
  setSelectedLogo: (logoId: string) => void;
  useTextLogo: boolean;
  setUseTextLogo: (useText: boolean) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>('custom-main');
  const [useTextLogo, setUseTextLogo] = useState<boolean>(false);

  // Load saved logo preference from localStorage
  useEffect(() => {
    const savedLogoId = localStorage.getItem('selectedLogo');
    const savedUseTextLogo = localStorage.getItem('useTextLogo');
    
    if (savedLogoId && logoOptions.find(logo => logo.id === savedLogoId)) {
      setSelectedLogoId(savedLogoId);
      setUseTextLogo(savedUseTextLogo === 'true');
    }
  }, []);

  const setSelectedLogo = (logoId: string) => {
    setSelectedLogoId(logoId);
    setUseTextLogo(false);
    localStorage.setItem('selectedLogo', logoId);
    localStorage.setItem('useTextLogo', 'false');
  };

  const selectedLogo = selectedLogoId 
    ? logoOptions.find(logo => logo.id === selectedLogoId) || null
    : null;

  return (
    <LogoContext.Provider value={{
      selectedLogoId,
      selectedLogo,
      setSelectedLogo,
      useTextLogo,
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