// Simple encryption/decryption utility for session data
const ENCRYPTION_KEY = 'authencore_session_key_2024'; // In production, use a proper key management system

export const encryptSession = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = btoa(jsonString); // Base64 encoding (simple obfuscation)
    return encrypted;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error encrypting session:', error);
    }
    return '';
  }
};

export const decryptSession = (encryptedData: string): any => {
  try {
    const decrypted = atob(encryptedData); // Base64 decoding
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