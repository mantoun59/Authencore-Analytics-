import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Employer {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  position_applied?: string;
  assessment_completed: boolean;
  invited_at: string;
  completed_at?: string;
}

interface CandidateData {
  fullName: string;
  email: string;
  positionApplied?: string;
}

interface EmployerContextType {
  employer: Employer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  getCandidates: () => Promise<Candidate[]>;
  inviteCandidate: (candidateData: CandidateData) => Promise<{ error?: string }>;
}

const EmployerContext = createContext<EmployerContextType | undefined>(undefined);

export const useEmployer = () => {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error('useEmployer must be used within an EmployerProvider');
  }
  return context;
};

export const EmployerProvider = ({ children }: { children: ReactNode }) => {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing employer session
    const savedEmployer = localStorage.getItem('employer_session');
    if (savedEmployer) {
      try {
        const employerData = JSON.parse(savedEmployer);
        setEmployer(employerData);
      } catch (error) {
        localStorage.removeItem('employer_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('authenticate_employer', {
        p_email: email,
        p_password: password
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const employerData = {
          id: data[0].employer_id,
          name: data[0].name,
          email: data[0].email,
          is_active: data[0].is_active
        };
        setEmployer(employerData);
        localStorage.setItem('employer_session', JSON.stringify(employerData));
        
        // Log analytics event
        await supabase.rpc('log_analytics_event', {
          p_event_type: 'employer_login',
          p_entity_type: 'employer',
          p_entity_id: employerData.id,
          p_metadata: { email }
        });

        return {};
      } else {
        return { error: 'Invalid credentials' };
      }
    } catch (error: any) {
      return { error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    setEmployer(null);
    localStorage.removeItem('employer_session');
    
    if (employer) {
      supabase.rpc('log_analytics_event', {
        p_event_type: 'employer_logout',
        p_entity_type: 'employer',
        p_entity_id: employer.id
      });
    }
  };

  const getCandidates = async () => {
    if (!employer) return [];

    try {
      const { data, error } = await supabase
        .from('employer_candidates')
        .select('*')
        .eq('employer_id', employer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch candidates",
        variant: "destructive"
      });
      return [];
    }
  };

  const inviteCandidate = async (candidateData: any) => {
    if (!employer) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('employer_candidates')
        .insert({
          employer_id: employer.id,
          ...candidateData
        });

      if (error) throw error;

      // Log analytics event
      await supabase.rpc('log_analytics_event', {
        p_event_type: 'candidate_invited',
        p_entity_type: 'employer_candidate',
        p_metadata: { employer_id: employer.id, candidate_email: candidateData.email }
      });

      return {};
    } catch (error: any) {
      return { error: error.message || 'Failed to invite candidate' };
    }
  };

  return (
    <EmployerContext.Provider value={{
      employer,
      loading,
      login,
      logout,
      getCandidates,
      inviteCandidate
    }}>
      {children}
    </EmployerContext.Provider>
  );
};