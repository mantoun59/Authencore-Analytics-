// Secure session encryption/decryption utility using AES-GCM
import { SecureStorage } from '@/utils/enhancedSecurity';

export const encryptSession = async (data: any): Promise<string> => {
  try {
    const jsonString = JSON.stringify(data);
    return await SecureStorage.encrypt(jsonString);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error encrypting session:', error);
    }
    throw new Error('Session encryption failed');
  }
};

export const decryptSession = async (encryptedData: string): Promise<any> => {
  try {
    const decrypted = await SecureStorage.decrypt(encryptedData);
    return JSON.parse(decrypted);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error decrypting session:', error);
    }
    return null;
  }
};

// Additional security helpers
export const validateSessionIntegrity = (sessionData: any): boolean => {
  // Basic validation to ensure session data structure is correct
  if (!sessionData || typeof sessionData !== 'object') {
    return false;
  }
  
  // Check required fields
  const requiredFields = ['id', 'username', 'organization_name', 'access_expires_at', 'is_active'];
  return requiredFields.every(field => sessionData.hasOwnProperty(field));
};

export const isSessionExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) <= new Date();
};