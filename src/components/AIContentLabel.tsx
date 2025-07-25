import React from 'react';

interface AIContentLabelProps {
  children: React.ReactNode;
  type?: 'analysis' | 'recommendation' | 'insight' | 'generated';
  className?: string;
}

export const AIContentLabel: React.FC<AIContentLabelProps> = ({ 
  children, 
  type = 'generated',
  className = '' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'analysis': return '🔍';
      case 'recommendation': return '💡';
      case 'insight': return '📊';
      default: return '🤖';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'analysis': return 'AI Analysis';
      case 'recommendation': return 'AI Recommendation';
      case 'insight': return 'AI Insight';
      default: return 'AI Generated';
    }
  };

  return (
    <div className={`relative ${className}`} role="region" aria-label={`${getLabel()} content`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 border-l-2 border-primary/30 pl-2">
        <span role="img" aria-label={getLabel()}>{getIcon()}</span>
        <span className="font-medium">{getLabel()}</span>
      </div>
      <div className="pl-4 border-l border-primary/10">
        {children}
      </div>
    </div>
  );
};