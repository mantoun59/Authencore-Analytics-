import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { applyTheme } from '@/lib/themes';
import { useToast } from '@/hooks/use-toast';

interface ThemeContextType {
  currentTheme: string;
  isDark: boolean;
  setTheme: (themeId: string) => Promise<void>;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Load theme from database and localStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Load from database
          const { data: userTheme } = await supabase
            .from('user_themes')
            .select('theme_name')
            .eq('user_id', user.id)
            .single();
          
          if (userTheme) {
            setCurrentTheme(userTheme.theme_name);
          }
        }
        
        // Load dark mode preference from localStorage
        const darkMode = localStorage.getItem('darkMode') === 'true';
        setIsDark(darkMode);
        
        // Apply theme
        applyTheme(currentTheme, darkMode);
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [currentTheme]);

  const setTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to database
        await supabase
          .from('user_themes')
          .upsert({
            user_id: user.id,
            theme_name: themeId,
            updated_at: new Date().toISOString()
          });
      }
      
      // Update local state
      setCurrentTheme(themeId);
      applyTheme(themeId, isDark);
      
      toast({
        title: 'Theme Updated',
        description: `Successfully applied ${themeId} theme`,
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to save theme preference',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyTheme(currentTheme, newDarkMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        isDark,
        setTheme,
        toggleDarkMode,
        isLoading
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};