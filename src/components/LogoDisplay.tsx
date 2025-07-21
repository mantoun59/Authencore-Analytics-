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

  // Size mapping for images - updated for header
  const sizeClasses = {
    sm: 'h-12 w-auto max-w-[120px]',
    md: 'w-[180px] h-auto',
    lg: 'w-[200px] h-auto'
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