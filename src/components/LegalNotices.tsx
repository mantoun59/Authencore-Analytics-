import React from 'react';
import { formatFullLegalFooter, formatCopyrightLine, LEGAL_NOTICES } from '@/utils/legalNotices';
import { Separator } from './ui/separator';

interface LegalNoticesProps {
  variant?: 'full' | 'short' | 'copyright-only';
  className?: string;
}

export const LegalNotices: React.FC<LegalNoticesProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  if (variant === 'copyright-only') {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        <p className="font-medium">{formatCopyrightLine()}</p>
      </div>
    );
  }

  if (variant === 'short') {
    return (
      <div className={`text-xs text-muted-foreground space-y-2 ${className}`}>
        <Separator className="my-4" />
        <p className="font-medium">{LEGAL_NOTICES.copyright}</p>
        <p className="font-medium">{LEGAL_NOTICES.trademark}</p>
        <p>{LEGAL_NOTICES.disclaimerShort}</p>
      </div>
    );
  }

  return (
    <div className={`text-xs text-muted-foreground space-y-3 ${className}`}>
      <Separator className="my-6" />
      
      <div className="space-y-2">
        <p className="font-semibold text-foreground">{LEGAL_NOTICES.copyright}</p>
        <p className="font-semibold text-foreground">{LEGAL_NOTICES.trademark}</p>
      </div>

      <div className="space-y-2">
        <p>{LEGAL_NOTICES.confidentiality}</p>
        <p>{LEGAL_NOTICES.dataProtection}</p>
      </div>

      <div className="space-y-2">
        <p className="font-medium">DISCLAIMER:</p>
        <p>{LEGAL_NOTICES.disclaimerShort}</p>
      </div>
    </div>
  );
};

export default LegalNotices;