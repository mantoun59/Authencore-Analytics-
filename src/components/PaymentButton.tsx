import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentButtonProps {
  assessmentType: string;
  price?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  assessmentType,
  price,
  className = '',
  variant = 'default',
  size = 'default',
  showIcon = true
}) => {
  const navigate = useNavigate();

  const handlePaymentClick = () => {
    navigate(`/payment?assessment=${assessmentType}`);
  };

  return (
    <Button
      onClick={handlePaymentClick}
      variant={variant}
      size={size}
      className={`${className} group transition-all duration-200 hover:scale-105`}
    >
      {showIcon && (
        <div className="flex items-center mr-2">
          <Lock className="w-4 h-4 mr-1 group-hover:hidden" />
          <CreditCard className="w-4 h-4 mr-1 hidden group-hover:block" />
        </div>
      )}
      {price ? `Purchase ${price}` : 'Purchase Assessment'}
    </Button>
  );
};

// Quick access component for common assessment purchases
export const QuickPurchaseButton: React.FC<{ assessmentType: string }> = ({ assessmentType }) => {
  const getAssessmentInfo = (type: string) => {
    switch (type) {
      case 'career-launch': return { name: 'CareerLaunch', price: '$9.99' };
      case 'cair-personality': return { name: 'CAIR+ Personality', price: '$29.99' };
      case 'stress-resilience': return { name: 'Burnout Prevention Index', price: '$39.99' };
      case 'cultural-intelligence': return { name: 'Cultural Intelligence', price: '$19.99' };
      case 'communication-styles': return { name: 'Communication Styles', price: '$24.99' };
      case 'emotional-intelligence': return { name: 'Emotional Intelligence', price: '$24.99' };
      case 'faith-values': return { name: 'Faith & Values', price: '$19.99' };
      case 'genz-assessment': return { name: 'Gen Z Workplace', price: '$9.99' };
      default: return { name: 'Assessment', price: 'View Pricing' };
    }
  };

  const info = getAssessmentInfo(assessmentType);

  return (
    <PaymentButton
      assessmentType={assessmentType}
      price={info.price}
      variant="default"
      size="lg"
      className="w-full"
    />
  );
};