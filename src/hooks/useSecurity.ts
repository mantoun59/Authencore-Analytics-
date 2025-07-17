import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_details: any;
  ip_address: string | null;
  user_agent: string | null;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  last_accessed: string;
}

export const useSecurity = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Log security events
  const logSecurityEvent = useCallback(async (
    eventType: string,
    eventDetails?: any,
    severity: 'info' | 'warning' | 'critical' = 'info'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's IP and user agent (simplified - in production you'd get these from request headers)
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: eventType,
        p_event_details: eventDetails || {},
        p_ip_address: ip,
        p_user_agent: navigator.userAgent,
        p_severity: severity
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  // Detect suspicious activity
  const detectSuspiciousActivity = useCallback(async (action: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      const { data, error } = await supabase.rpc('detect_suspicious_activity', {
        p_user_id: user.id,
        p_ip_address: ip,
        p_user_agent: navigator.userAgent,
        p_action: action
      });

      if (error) {
        console.error('Error detecting suspicious activity:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Failed to detect suspicious activity:', error);
      return false;
    }
  }, []);

  // Check rate limits
  const checkRateLimit = useCallback(async (
    endpoint: string,
    limit: number = 60,
    windowMinutes: number = 1
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const identifier = user?.id || 'anonymous';

      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: identifier,
        p_endpoint: endpoint,
        p_limit: limit,
        p_window_minutes: windowMinutes
      });

      if (error) {
        console.error('Error checking rate limit:', error);
        return false;
      }

      return data;
    } catch (error) {
      console.error('Failed to check rate limit:', error);
      return false;
    }
  }, []);

  // Get user's security events
  const getSecurityEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSecurityEvents((data as SecurityEvent[]) || []);
    } catch (error) {
      console.error('Failed to fetch security events:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user's active sessions
  const getActiveSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      setActiveSessions((data as UserSession[]) || []);
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Terminate a session
  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;
      
      await getActiveSessions(); // Refresh the list
      await logSecurityEvent('session_terminated', { session_id: sessionId });
    } catch (error) {
      console.error('Failed to terminate session:', error);
    }
  }, [getActiveSessions, logSecurityEvent]);

  return {
    securityEvents,
    activeSessions,
    isLoading,
    logSecurityEvent,
    detectSuspiciousActivity,
    checkRateLimit,
    getSecurityEvents,
    getActiveSessions,
    terminateSession
  };
};