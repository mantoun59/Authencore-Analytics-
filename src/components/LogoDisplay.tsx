import React from 'react';
import { useLogo } from '@/contexts/LogoContext';
import TextLogo from './TextLogo';

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
  const { selectedLogo, useTextLogo } = useLogo();

  // If using text logo or no logo selected, show text logo
  if (useTextLogo || !selectedLogo) {
    return <TextLogo size={size} showTagline={showTagline} className={className} />;
  }

  // Size mapping for images - making main logo 200px
  const sizeClasses = {
    sm: 'h-8',
    md: 'w-[200px] h-auto',
    lg: 'w-[250px] h-auto'
  };

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <img 
        src={selectedLogo.image} 
        alt="AuthenCore Analytics"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showTagline && (
        <p className={`text-foreground/70 italic text-xs mt-1 ${size === 'lg' ? 'text-sm' : ''}`}>
          Reading minds, shaping future
        </p>
      )}
    </div>
  );
};

export default LogoDisplay;