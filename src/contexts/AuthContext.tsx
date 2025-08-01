import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { RateLimiter, SecurityMonitor, SecureStorage } from '@/utils/enhancedSecurity';

interface AuthError {
  message: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  requestDataDeletion: (reason?: string) => Promise<{ error: AuthError | null }>;
  deleteUserData: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || email
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Enhanced security: Rate limiting and bot detection
    const rateLimitKey = `login_${email}`;
    if (RateLimiter.isRateLimited(rateLimitKey, 5, 15 * 60 * 1000)) {
      return { error: { message: 'Too many login attempts. Please try again later.' } };
    }

    if (SecurityMonitor.detectBotBehavior()) {
      return { error: { message: 'Automated access detected. Please verify you are human.' } };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Reset rate limit on successful login, log security events
    if (!error) {
      RateLimiter.resetRateLimit(rateLimitKey);
      await SecureStorage.setSecureItem('last_login', new Date().toISOString());
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const requestDataDeletion = async (reason: string = 'user_request') => {
    try {
      const { data, error } = await supabase.rpc('request_data_deletion', {
        p_reason: reason
      });

      return { error };
    } catch (error: any) {
      console.error('Data deletion request error:', error);
      return { error: { message: error.message || 'Failed to request data deletion' } };
    }
  };

  const deleteUserData = async () => {
    try {
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase.rpc('delete_user_data', {
        p_user_id: user.id
      });

      if (!error) {
        // Sign out after successful deletion
        await signOut();
      }

      return { error };
    } catch (error: any) {
      console.error('Data deletion error:', error);
      return { error: { message: error.message || 'Failed to delete user data' } };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    requestDataDeletion,
    deleteUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};