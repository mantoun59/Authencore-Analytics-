import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MFASetup {
  id: string;
  user_id: string;
  secret: string;
  backup_codes: string[];
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useMFA = () => {
  const [mfaSetup, setMfaSetup] = useState<MFASetup | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate MFA secret and QR code
  const setupMFA = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate secret using Web Crypto API
      const secret = generateSecret();
      const backupCodes = generateBackupCodes();

      const { data, error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user.id,
          secret,
          backup_codes: backupCodes,
          is_enabled: false
        })
        .select()
        .single();

      if (error) throw error;

      setMfaSetup(data as MFASetup);
      return {
        secret,
        backupCodes,
        qrCodeUrl: generateQRCodeUrl(user.email || user.id, secret)
      };
    } catch (error) {
      console.error('Failed to setup MFA:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify MFA token and enable MFA
  const verifyAndEnableMFA = useCallback(async (token: string) => {
    try {
      if (!mfaSetup) throw new Error('MFA not set up');

      const isValid = verifyTOTP(token, mfaSetup.secret);
      if (!isValid) throw new Error('Invalid token');

      const { error } = await supabase
        .from('user_mfa')
        .update({ is_enabled: true })
        .eq('id', mfaSetup.id);

      if (error) throw error;

      setMfaSetup({ ...mfaSetup, is_enabled: true });
      return true;
    } catch (error) {
      console.error('Failed to verify and enable MFA:', error);
      throw error;
    }
  }, [mfaSetup]);

  // Verify MFA token for login
  const verifyMFAToken = useCallback(async (token: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: mfaData, error } = await supabase
        .from('user_mfa')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_enabled', true)
        .single();

      if (error) throw error;
      if (!mfaData) throw new Error('MFA not enabled');

      // Check if it's a backup code
      if (mfaData.backup_codes.includes(token)) {
        // Remove used backup code
        const updatedCodes = mfaData.backup_codes.filter(code => code !== token);
        await supabase
          .from('user_mfa')
          .update({ backup_codes: updatedCodes })
          .eq('id', mfaData.id);
        
        return true;
      }

      // Verify TOTP token
      return verifyTOTP(token, mfaData.secret);
    } catch (error) {
      console.error('Failed to verify MFA token:', error);
      return false;
    }
  }, []);

  // Disable MFA
  const disableMFA = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_mfa')
        .update({ is_enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      setMfaSetup(null);
      return true;
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      throw error;
    }
  }, []);

  // Get MFA status
  const getMFAStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_mfa')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setMfaSetup(data as MFASetup);
      return data;
    } catch (error) {
      console.error('Failed to get MFA status:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mfaSetup,
    isLoading,
    setupMFA,
    verifyAndEnableMFA,
    verifyMFAToken,
    disableMFA,
    getMFAStatus
  };
};

// Helper functions
function generateSecret(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, byte => charset[byte % charset.length]).join('');
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(4)), 
      byte => byte.toString(16).padStart(2, '0')).join('');
    codes.push(code);
  }
  return codes;
}

function generateQRCodeUrl(email: string, secret: string): string {
  const issuer = 'AuthenCore';
  const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`;
}

function verifyTOTP(token: string, secret: string): boolean {
  // Simplified TOTP verification
  // In production, use a proper TOTP library like otplib
  const timeStep = Math.floor(Date.now() / 30000);
  const expectedToken = generateTOTP(secret, timeStep);
  return token === expectedToken;
}

function generateTOTP(secret: string, timeStep: number): string {
  // Simplified TOTP generation for demo
  // In production, use a proper TOTP library
  const hash = timeStep.toString() + secret;
  let result = 0;
  for (let i = 0; i < hash.length; i++) {
    result += hash.charCodeAt(i);
  }
  return (result % 1000000).toString().padStart(6, '0');
}