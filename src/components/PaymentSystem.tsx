import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContactSalesForm } from './ContactSalesForm';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  Building2
} from 'lucide-react';

interface PaymentSystemProps {
  assessmentType?: string;
  onPaymentSuccess?: (orderId: string) => void;
  showGuestCheckout?: boolean;
}

interface GuestInfo {
  email: string;
  name: string;
}

export const PaymentSystem: React.FC<PaymentSystemProps> = ({
  assessmentType,
  onPaymentSuccess,
  showGuestCheckout = true
}) => {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<'individual' | 'bundle' | 'enterprise'>('individual');
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ email: '', name: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    getCurrentUser();
    // Auto-select bundle if no specific assessment type
    if (!assessmentType) {
      setSelectedOption('bundle');
    }
  }, [assessmentType]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const paymentOptions = [
    {
      id: 'individual' as const,
      name: 'Individual Assessment',
      price: 24.99,
      description: 'Single assessment of your choice',
      features: [
        'Choose any assessment type',
        'Comprehensive detailed report',
        'Instant results',
        'PDF download',
        'Email support'
      ],
      icon: CreditCard,
      badge: 'One-time'
    },
    {
      id: 'bundle' as const,
      name: 'Complete Bundle',
      price: 79.99,
      description: 'All assessments included - best value!',
      features: [
        'All 10+ assessment types',
        'Career, Personality, Leadership',
        'Communication & Cultural Intelligence',
        'Stress, Digital Wellness & more',
        'Comprehensive reports for all',
        'Priority support'
      ],
      icon: Star,
      badge: 'Most Popular',
      popular: true
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise & Partners',
      price: null,
      description: 'Custom solutions for organizations',
      features: [
        'Volume pricing',
        'Custom branding',
        'API integration',
        'Dedicated support',
        'Advanced analytics',
        'Training & onboarding'
      ],
      icon: Building2,
      badge: 'Custom Pricing'
    }
  ];

  const handleProceedToPayment = async () => {
    if (selectedOption === 'enterprise') {
      setShowContactForm(true);
      return;
    }

    if (isGuest && (!guestInfo.email || !guestInfo.name)) {
      toast({
        title: "Missing Information",
        description: "Please provide your email and name for guest checkout",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedPlan = paymentOptions.find(option => option.id === selectedOption);
      
      // Create payment order via edge function
      const { data, error } = await supabase.functions.invoke('create-payment-order', {
        body: {
          planType: selectedOption,
          assessmentType: selectedOption === 'individual' ? assessmentType : 'bundle',
          amount: selectedPlan?.price ? Math.round(selectedPlan.price * 100) : 0, // Convert to cents
          guestInfo: isGuest ? guestInfo : undefined,
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showContactForm) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setShowContactForm(false)}
          className="mb-6"
        >
          ← Back to Payment Options
        </Button>
        <ContactSalesForm />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Option</h2>
        <p className="text-muted-foreground">
          Select the perfect plan for your assessment needs
        </p>
      </div>

      {/* Authentication Choice */}
      {showGuestCheckout && !currentUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Checkout Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant={!isGuest ? "default" : "outline"}
                onClick={() => setIsGuest(false)}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Account
              </Button>
              <Button
                variant={isGuest ? "default" : "outline"}
                onClick={() => setIsGuest(true)}
                className="flex-1"
              >
                <Clock className="w-4 h-4 mr-2" />
                Guest Checkout
              </Button>
            </div>
            {isGuest && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guest-name">Full Name</Label>
                    <Input
                      id="guest-name"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guest-email">Email Address</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {paymentOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card 
              key={option.id} 
              className={`cursor-pointer transition-all ${
                selectedOption === option.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              } ${option.popular ? 'border-primary' : ''}`}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium rounded-t-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                  </div>
                  <Badge variant={option.popular ? "default" : "secondary"}>
                    {option.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {option.price ? `$${option.price}` : 'Custom'}
                  </div>
                  {option.price && (
                    <div className="text-sm text-muted-foreground">
                      one-time payment
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Includes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Summary */}
      {selectedOption !== 'enterprise' && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>{paymentOptions.find(p => p.id === selectedOption)?.name}</span>
              <span>${paymentOptions.find(p => p.id === selectedOption)?.price}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${paymentOptions.find(p => p.id === selectedOption)?.price}</span>
            </div>
            <Button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Enterprise Contact */}
      {selectedOption === 'enterprise' && (
        <Card>
          <CardHeader>
            <CardTitle>Enterprise & Partner Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Get custom pricing and solutions tailored to your organization's needs.
              Our team will work with you to create the perfect assessment solution.
            </p>
            <Button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Contact Sales Team
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};