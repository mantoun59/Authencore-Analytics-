import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'partner' | 'user';
}

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoUser: DemoUser | null;
  setDemoUser: (user: DemoUser | null) => void;
  demoPartner: any;
  setDemoPartner: (partner: any) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
};

const DEMO_USERS = {
  admin: {
    id: 'demo-admin-001',
    email: 'admin@demo.authencore.com',
    name: 'Demo Administrator',
    role: 'admin' as const,
  },
  partner: {
    id: 'demo-partner-001',
    email: 'partner@demo.authencore.com',
    name: 'Demo Partner',
    role: 'partner' as const,
  },
  user: {
    id: 'demo-user-001',
    email: 'user@demo.authencore.com',
    name: 'Demo User',
    role: 'user' as const,
  },
};

const DEMO_PARTNER = {
  id: 'demo-partner-001',
  username: 'demo_partner',
  name: 'Demo Partner Organization',
  email: 'partner@demo.authencore.com',
  isActive: true,
  tier: 'premium',
  permissions: ['assessments', 'analytics', 'reports'],
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('authencore-demo-mode');
    return saved === 'true';
  });
  
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    if (!isDemoMode) return null;
    const saved = localStorage.getItem('authencore-demo-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [demoPartner, setDemoPartner] = useState(() => {
    if (!isDemoMode) return null;
    const saved = localStorage.getItem('authencore-demo-partner');
    return saved ? JSON.parse(saved) : DEMO_PARTNER;
  });

  useEffect(() => {
    localStorage.setItem('authencore-demo-mode', isDemoMode.toString());
    if (!isDemoMode) {
      localStorage.removeItem('authencore-demo-user');
      localStorage.removeItem('authencore-demo-partner');
      setDemoUser(null);
      setDemoPartner(null);
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode && demoUser) {
      localStorage.setItem('authencore-demo-user', JSON.stringify(demoUser));
    }
  }, [isDemoMode, demoUser]);

  useEffect(() => {
    if (isDemoMode && demoPartner) {
      localStorage.setItem('authencore-demo-partner', JSON.stringify(demoPartner));
    }
  }, [isDemoMode, demoPartner]);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    if (!isDemoMode) {
      // Reset to default demo user when enabling demo mode
      setDemoUser(DEMO_USERS.user);
      setDemoPartner(DEMO_PARTNER);
    }
  };

  const value = {
    isDemoMode,
    toggleDemoMode,
    demoUser,
    setDemoUser: (user: DemoUser | null) => {
      setDemoUser(user);
      if (user && user.role === 'partner') {
        setDemoPartner(DEMO_PARTNER);
      }
    },
    demoPartner,
    setDemoPartner,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

// Demo data helpers
export const getDemoUser = (role: 'admin' | 'partner' | 'user') => DEMO_USERS[role];
export const getDemoPartner = () => DEMO_PARTNER;