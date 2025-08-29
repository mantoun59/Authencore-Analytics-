import React from 'react';
import { useLogo } from '@/contexts/LogoContext';
import { useTranslation } from 'react-i18next';

interface LogoDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ 
  size = 'md', 
  showTagline = true, 
  className = '' 
}) => {
  const { selectedLogo } = useLogo();
  const { t } = useTranslation();

  // Size mapping for images - adjusted for navbar height (h-24 = 96px)
  const sizeClasses = {
    sm: 'h-10 w-auto max-w-[130px]', // 40px height for mobile (30% increase)
    md: 'h-16 w-auto max-w-[180px]', // 64px height for desktop (30% increase)
    lg: 'h-32 w-auto max-w-[360px]' // 128px height for large displays (double size)
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={selectedLogo.image} 
        alt="AuthenCore Analytics"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showTagline && (
        <p className={`text-foreground/70 italic mt-1 ml-2 ${
          size === 'lg' ? 'text-lg' : 
          size === 'md' ? 'text-base' : 
          'text-sm'
        }`}>
          Smart Career Analytics
        </p>
      )}
    </div>
  );
};

export default LogoDisplay;