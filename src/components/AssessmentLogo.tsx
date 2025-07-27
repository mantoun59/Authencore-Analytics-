import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Rocket, Brain, Shield, Globe, MessageSquare, Heart, Lightbulb, Zap, Monitor, Users, Target, CheckCircle2 } from 'lucide-react';

interface AssessmentLogoProps {
  assessmentId: string;
  title: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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

  // Get the proper Lucide icon component
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Rocket, Brain, Shield, Globe, MessageSquare, Heart, 
      Lightbulb, Zap, Monitor, Users, Target, CheckCircle2
    };
    return icons[iconName] || Target;
  };

  // Find the correct logo URL on component mount
  useEffect(() => {
    const findLogoUrl = async () => {
      console.log(`🔍 Looking for logo for assessment: ${assessmentId}`);
      const extensions = ['png', 'jpg', 'jpeg', 'svg'];
      
      for (const ext of extensions) {
        const fileName = `${assessmentId}-logo.${ext}`;
        const { data } = supabase.storage
          .from('assessment-logos')
          .getPublicUrl(fileName);
        
        console.log(`⚡ Checking: ${data.publicUrl}`);
        
        // Check if file exists by trying to fetch it
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log(`✅ Found logo: ${data.publicUrl}`);
            setLogoUrl(data.publicUrl);
            return; // Found a logo, stop checking other extensions
          } else {
            console.log(`❌ Not found (${response.status}): ${data.publicUrl}`);
          }
        } catch (error) {
          console.log(`❌ Error checking: ${data.publicUrl}`, error);
          // Continue to next extension
        }
      }
      
      // No logo found, set error state
      console.log(`🚫 No logo found for ${assessmentId}, using fallback`);
      setImageError(true);
      setIsLoading(false);
    };
    
    findLogoUrl();
  }, [assessmentId]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
    '2xl': 'w-48 h-48'
  };

  const fallbackClasses = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-6xl',
    '2xl': 'text-8xl'
  };

  if (imageError || !logoUrl) {
    if (!showFallback) return null;
    
    // Check if fallbackIcon is a Lucide icon name or emoji
    const isLucideIcon = /^[A-Z][a-zA-Z]*$/.test(fallbackIcon);
    
    if (isLucideIcon) {
      const IconComponent = getIconComponent(fallbackIcon);
      return (
        <div className={cn(
          'flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20',
          sizeClasses[size],
          className
        )}>
          <IconComponent className={cn('text-primary', sizeClasses[size])} />
        </div>
      );
    }
    
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