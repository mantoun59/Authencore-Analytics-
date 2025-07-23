import { useAssessmentLogos } from '@/hooks/useAssessmentLogos';

interface AssessmentLogoProps {
  assessmentType: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackText?: string;
}

const AssessmentLogo = ({ 
  assessmentType, 
  className = '', 
  size = 'md',
  fallbackText 
}: AssessmentLogoProps) => {
  const { getLogoUrl, hasLogo } = useAssessmentLogos();
  const logoUrl = getLogoUrl(assessmentType);

  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  const fallbackSizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  if (!hasLogo(assessmentType)) {
    if (fallbackText) {
      return (
        <div className={`${fallbackSizeClasses[size]} bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
          {fallbackText}
        </div>
      );
    }
    return null;
  }

  return (
    <img
      src={logoUrl}
      alt={`${assessmentType} logo`}
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        console.error(`Failed to load logo for ${assessmentType}:`, logoUrl);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};

export default AssessmentLogo;