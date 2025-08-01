import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { encryptSession, decryptSession, validateSessionIntegrity, isSessionExpired } from '@/utils/sessionSecurity';

interface PartnerData {
  id: string;
  username: string;
  organization_name: string;
  access_expires_at: string;
  is_active: boolean;
  permissions: string[];
}

interface PartnerContextType {
  partner: PartnerData | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAssessmentAccess: (assessmentType: string) => boolean;
  logActivity: (action: string, assessmentType?: string) => void;
  resetPassword: (username: string) => Promise<{ success: boolean; error?: string }>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const usePartner = () => {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error('usePartner must be used within a PartnerProvider');
  }
  return context;
};

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedPartner = localStorage.getItem('partner_session');
    if (storedPartner) {
      try {
        const partnerData = decryptSession(storedPartner);
        
        // Validate session integrity and expiry
        if (validateSessionIntegrity(partnerData) && !isSessionExpired(partnerData.access_expires_at)) {
          setPartner(partnerData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('partner_session');
        }
      } catch (error) {
        // Production analytics only
        if (process.env.NODE_ENV === 'development') {
          console.error('Error parsing partner session:', error);
        }
        localStorage.removeItem('partner_session');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Authenticate partner
      const { data: authData, error: authError } = await supabase.rpc('authenticate_partner', {
        p_username: username,
        p_password: password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData || authData.length === 0) {
        return { success: false, error: 'Invalid username or password' };
      }

      const partnerAuth = authData[0];

      if (partnerAuth.is_expired) {
        return { success: false, error: 'Your access has expired. Please contact support.' };
      }

      // Get partner permissions
      const { data: permissions, error: permError } = await supabase
        .from('partner_access_permissions')
        .select('assessment_type')
        .eq('partner_id', partnerAuth.partner_id)
        .eq('can_access', true);

      if (permError) {
        throw new Error(permError.message);
      }

      const partnerData: PartnerData = {
        id: partnerAuth.partner_id,
        username: partnerAuth.username,
        organization_name: partnerAuth.organization_name,
        access_expires_at: partnerAuth.access_expires_at,
        is_active: partnerAuth.is_active,
        permissions: permissions?.map(p => p.assessment_type) || []
      };

      // Store encrypted session
      const encryptedSession = encryptSession(partnerData);
      localStorage.setItem('partner_session', encryptedSession);
      setPartner(partnerData);
      setIsAuthenticated(true);

      // Log login activity
      await supabase.rpc('log_partner_activity', {
        p_partner_id: partnerAuth.partner_id,
        p_action: 'login',
        p_ip_address: null, // Could be enhanced with IP detection
        p_user_agent: navigator.userAgent
      });

      return { success: true };
    } catch (error) {
      // Production analytics only
      if (process.env.NODE_ENV === 'development') {
        console.error('Partner login error:', error);
      }
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('partner_session');
    setPartner(null);
    setIsAuthenticated(false);
  };

  const checkAssessmentAccess = (assessmentType: string) => {
    if (!partner || !isAuthenticated) return false;
    
    // Check if access has expired using the security utility
    if (isSessionExpired(partner.access_expires_at)) {
      logout();
      return false;
    }

    return partner.permissions.includes(assessmentType);
  };

  const logActivity = async (action: string, assessmentType?: string) => {
    if (!partner) return;

    try {
      await supabase.rpc('log_partner_activity', {
        p_partner_id: partner.id,
        p_action: action,
        p_assessment_type: assessmentType,
        p_ip_address: null,
        p_user_agent: navigator.userAgent
      });
    } catch (error) {
      // Production analytics only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error logging partner activity:', error);
      }
    }
  };

  const resetPassword = async (username: string) => {
    try {
      // Log the password reset request for security
      await supabase.rpc('log_security_event', {
        p_user_id: null,
        p_event_type: 'partner_password_reset_requested',
        p_event_details: { username },
        p_severity: 'info'
      });

      return { 
        success: true, 
        error: 'Password reset request has been logged. Please contact your account manager for assistance.' 
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error logging password reset request:', error);
      }
      return { 
        success: false, 
        error: 'Unable to process password reset request. Please contact support.' 
      };
    }
  };

  const value = {
    partner,
    isAuthenticated,
    login,
    logout,
    checkAssessmentAccess,
    logActivity,
    resetPassword
  };

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
};