import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Save, Check, Loader2, AlertCircle } from 'lucide-react';

interface SaveProgressIndicatorProps {
  isSaving: boolean;
  lastSaved?: Date;
  className?: string;
}

export const SaveProgressIndicator: React.FC<SaveProgressIndicatorProps> = ({
  isSaving,
  lastSaved,
  className = ""
}) => {
  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h ago`;
    }
  };

  if (isSaving) {
    return (
      <Badge variant="secondary" className={`${className} animate-pulse`}>
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Saving...
      </Badge>
    );
  }

  if (lastSaved) {
    return (
      <Badge variant="outline" className={`${className} text-green-600 border-green-200`}>
        <Check className="h-3 w-3 mr-1" />
        Saved {formatLastSaved(lastSaved)}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`${className} text-muted-foreground`}>
      <Save className="h-3 w-3 mr-1" />
      Auto-save enabled
    </Badge>
  );
};

export default SaveProgressIndicator;