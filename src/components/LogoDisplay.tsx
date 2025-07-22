import React from 'react';
import { useLogo } from '@/contexts/LogoContext';

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

  // Size mapping for images - adjusted for navbar height (h-24 = 96px)
  const sizeClasses = {
    sm: 'h-8 w-auto max-w-[100px]', // 32px height for mobile
    md: 'h-12 w-auto max-w-[140px]', // 48px height for desktop
    lg: 'h-16 w-auto max-w-[180px]' // 64px height for large displays
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
          Reading minds, shaping future
        </p>
      )}
    </div>
  );
};

export default LogoDisplay;