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

  // Size mapping for images - navbar optimized
  const sizeClasses = {
    sm: 'h-8',
    md: 'w-[120px] h-auto',
    lg: 'w-[180px] h-auto'
  };

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <img 
        src={selectedLogo.image} 
        alt="AuthenCore Analytics"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showTagline && (
        <p className={`text-foreground/70 italic text-sm mt-1 ${size === 'lg' ? 'text-base' : ''}`}>
          Reading minds, shaping future
        </p>
      )}
    </div>
  );
};

export default LogoDisplay;