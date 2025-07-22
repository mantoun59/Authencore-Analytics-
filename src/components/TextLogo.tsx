import React from 'react';

interface TextLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const TextLogo: React.FC<TextLogoProps> = ({ 
  size = 'md', 
  showTagline = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const taglineSizes = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent ${sizeClasses[size]}`}>
        Authen<span className="text-secondary">Core</span> Analytics
      </div>
      {showTagline && (
        <p className={`text-foreground/70 italic ${taglineSizes[size]} mt-1`}>
          Where data meets trust
        </p>
      )}
    </div>
  );
};

export default TextLogo;