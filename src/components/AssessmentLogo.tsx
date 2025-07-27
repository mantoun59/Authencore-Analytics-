import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Find the correct logo URL on component mount
  useEffect(() => {
    const findLogoUrl = async () => {
      const extensions = ['png', 'jpg', 'jpeg', 'svg'];
      
      for (const ext of extensions) {
        const fileName = `${assessmentId}-logo.${ext}`;
        const { data } = supabase.storage
          .from('assessment-logos')
          .getPublicUrl(fileName);
        
        // Check if file exists by trying to fetch it
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setLogoUrl(data.publicUrl);
            return; // Found a logo, stop checking other extensions
          }
        } catch (error) {
          // Continue to next extension
        }
      }
      
      // No logo found, set error state
      setImageError(true);
      setIsLoading(false);
    };
    
    findLogoUrl();
  }, [assessmentId]);

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