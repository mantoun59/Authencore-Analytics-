import corporateBlueHero from '@/assets/corporate-blue-hero.jpg';
import corporateGrayHero from '@/assets/corporate-gray-hero.jpg';

export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'corporate' | 'premium';
  isPremium: boolean;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  heroImage?: string;
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and modern teal theme',
    category: 'default',
    isPremium: false,
    preview: {
      primary: '#00b4a6',
      secondary: '#f8fafc',
      accent: '#00b4a6',
      background: '#ffffff'
    }
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue theme for business applications',
    category: 'corporate',
    isPremium: true,
    preview: {
      primary: '#3b82f6',
      secondary: '#f1f5f9',
      accent: '#3b82f6',
      background: '#fefeff'
    },
    heroImage: corporateBlueHero
  },
  {
    id: 'corporate-gray',
    name: 'Corporate Gray',
    description: 'Sophisticated gray theme for executive dashboards',
    category: 'corporate',
    isPremium: true,
    preview: {
      primary: '#404040',
      secondary: '#f3f4f6',
      accent: '#404040',
      background: '#fafafa'
    },
    heroImage: corporateGrayHero
  }
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getAvailableThemes = (isPremium: boolean): Theme[] => {
  return themes.filter(theme => !theme.isPremium || isPremium);
};

export const applyTheme = (themeId: string, isDark: boolean = false) => {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove(...themes.map(t => `theme-${t.id}`));
  
  // Apply new theme
  if (themeId !== 'default') {
    body.classList.add(`theme-${themeId}`);
  }
  
  // Apply dark mode
  if (isDark) {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }
};