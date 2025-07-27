import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AssessmentLogoProps {
  assessmentId: string;
  title: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackIcon?: string;
  showFallback?: boolean;
}

export const AssessmentLogo: React.FC<AssessmentLogoProps> = ({
  assessmentId,
  title,
  className,
  size = 'md',
  fallbackIcon = '📊',
  showFallback = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logoUrl = `https://jlbftyjewxgetxcihban.supabase.co/storage/v1/object/public/assessment-logos/${assessmentId}-logo.png`;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const fallbackClasses = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  if (imageError || !logoUrl) {
    if (!showFallback) return null;
    
    return (
      <div className={cn(
        'flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20',
        sizeClasses[size],
        className
      )}>
        <span className={cn('select-none', fallbackClasses[size])}>
          {fallbackIcon}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {isLoading && showFallback && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20',
          'animate-pulse'
        )}>
          <span className={cn('select-none', fallbackClasses[size])}>
            {fallbackIcon}
          </span>
        </div>
      )}
      
      <img
        src={logoUrl}
        alt={`${title} logo`}
        className={cn(
          'w-full h-full object-contain rounded-lg transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};