/**
 * Enhanced Security Utility
 * Provides encryption, rate limiting, and security monitoring
 */

import { supabase } from '@/integrations/supabase/client';

// AES-GCM encryption for sensitive local storage
class SecureStorage {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  /**
   * Generate a cryptographic key for encryption
   */
  private static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Derive key from password using PBKDF2
   */
  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data for secure local storage
   */
  static async encrypt(data: string, userKey?: string): Promise<string> {
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Use user session or derive from user ID as password
      const password = userKey || await this.getUserPassword();
      const key = await this.deriveKey(password, salt);
      
      const encodedData = this.encoder.encode(data);
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedData
      );

      // Combine salt, iv, and encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  /**
   * Decrypt data from secure local storage
   */
  static async decrypt(encryptedData: string, userKey?: string): Promise<string> {
    try {
      // Convert from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);

      const password = userKey || await this.getUserPassword();
      const key = await this.deriveKey(password, salt);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      return this.decoder.decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  /**
   * Securely store encrypted data
   */
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Secure storage failed:', error);
      throw error;
    }
  }

  /**
   * Retrieve and decrypt stored data
   */
  static async getSecureItem(key: string): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      
      return await this.decrypt(encrypted);
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      // Remove corrupted data
      localStorage.removeItem(`secure_${key}`);
      return null;
    }
  }

  /**
   * Remove securely stored item
   */
  static removeSecureItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }

  /**
   * Get user-specific password for encryption
   */
  private static async getUserPassword(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'default-fallback-key';
  }
}

// Rate limiting utilities
class RateLimiter {
  private static attempts: Map<string, { count: number; firstAttempt: number; blockedUntil?: number }> = new Map();

  /**
   * Check if action is rate limited
   */
  static isRateLimited(
    identifier: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000, // 15 minutes
    blockDurationMs: number = 30 * 60 * 1000 // 30 minutes
  ): boolean {
    const now = Date.now();
    const key = `rate_limit_${identifier}`;
    const record = this.attempts.get(key);

    // Check if currently blocked
    if (record?.blockedUntil && now < record.blockedUntil) {
      return true;
    }

    // Initialize or reset if window expired
    if (!record || (now - record.firstAttempt) > windowMs) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return false;
    }

    // Increment attempt count
    record.count++;

    // Block if exceeded max attempts
    if (record.count > maxAttempts) {
      record.blockedUntil = now + blockDurationMs;
      this.logSecurityEvent('rate_limit_exceeded', { identifier, attempts: record.count });
      return true;
    }

    return false;
  }

  /**
   * Reset rate limit for identifier
   */
  static resetRateLimit(identifier: string): void {
    this.attempts.delete(`rate_limit_${identifier}`);
  }

  /**
   * Get remaining attempts
   */
  static getRemainingAttempts(identifier: string, maxAttempts: number = 5): number {
    const record = this.attempts.get(`rate_limit_${identifier}`);
    if (!record) return maxAttempts;
    return Math.max(0, maxAttempts - record.count);
  }

  /**
   * Log security events
   */
  private static async logSecurityEvent(eventType: string, details: any): Promise<void> {
    try {
      await supabase.functions.invoke('security-middleware', {
        body: {
          event: eventType,
          details,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: await this.getClientIP()
        }
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }

  /**
   * Get client IP (best effort)
   */
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }
}

// Security monitoring
class SecurityMonitor {
  /**
   * Detect suspicious patterns in user behavior
   */
  static detectSuspiciousActivity(events: any[]): {
    isSuspicious: boolean;
    reasons: string[];
    riskScore: number;
  } {
    const reasons: string[] = [];
    let riskScore = 0;

    // Check for rapid successive logins from different IPs
    const recentLogins = events.filter(e => 
      e.event_type === 'sign_in' && 
      Date.now() - new Date(e.created_at).getTime() < 60000 // Last minute
    );

    if (recentLogins.length > 3) {
      reasons.push('Multiple rapid login attempts');
      riskScore += 30;
    }

    // Check for geographic anomalies (if IP data available)
    const uniqueIPs = new Set(events.map(e => e.ip_address).filter(Boolean));
    if (uniqueIPs.size > 5) {
      reasons.push('Multiple IP addresses used');
      riskScore += 20;
    }

    // Check for user agent switching
    const uniqueAgents = new Set(events.map(e => e.user_agent).filter(Boolean));
    if (uniqueAgents.size > 3) {
      reasons.push('Multiple user agents detected');
      riskScore += 15;
    }

    // Check for failed authentication attempts
    const failedAttempts = events.filter(e => e.event_type.includes('failed')).length;
    if (failedAttempts > 5) {
      reasons.push('Multiple failed authentication attempts');
      riskScore += 25;
    }

    return {
      isSuspicious: riskScore > 50,
      reasons,
      riskScore
    };
  }

  /**
   * Enhanced bot detection
   */
  static detectBotBehavior(): boolean {
    // Check for common bot indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const botKeywords = ['bot', 'crawler', 'spider', 'scraper', 'headless'];
    
    if (botKeywords.some(keyword => userAgent.includes(keyword))) {
      return true;
    }

    // Check for missing expected browser features
    if (!window.document || !window.localStorage || !window.sessionStorage) {
      return true;
    }

    // Check for automated behavior patterns
    if (window.navigator.webdriver) {
      return true;
    }

    return false;
  }

  /**
   * Validate session integrity
   */
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Check if token is near expiration
      const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : new Date();
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      // Refresh if expiring within 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        return !refreshError;
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }
}

// CSRF protection
class CSRFProtection {
  private static token: string | null = null;

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    this.token = crypto.randomUUID();
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token && token === this.token;
  }

  /**
   * Get current CSRF token
   */
  static getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('csrf_token');
    }
    return this.token;
  }
}

export { SecureStorage, RateLimiter, SecurityMonitor, CSRFProtection };