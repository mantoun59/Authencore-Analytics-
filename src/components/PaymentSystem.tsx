import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  Users, 
  Star,
  CheckCircle
} from 'lucide-react';

interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  plan_type: string;
  price: number;
  currency: string;
  billing_interval: string;
  assessment_access: any;
}

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
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ email: '', name: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchPaymentPlans();
    getCurrentUser();
  }, [assessmentType]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchPaymentPlans = async () => {
    try {
      let query = supabase
        .from('payment_plans')
        .select('*')
        .eq('is_active', true);

      if (assessmentType) {
        // Filter for specific assessment or include bulk/subscription plans
        query = query.or(`assessment_access.cs.["${assessmentType}"],assessment_access.cs.["all"]`);
      }

      const { data, error } = await query.order('price', { ascending: true });

      if (error) throw error;
      setPaymentPlans(data || []);

      // Auto-select individual plan if specific assessment type
      if (assessmentType && data) {
        const individualPlan = data.find(plan => 
          plan.plan_type === 'individual' && 
          Array.isArray(plan.assessment_access) && 
          plan.assessment_access.includes(assessmentType)
        );
        if (individualPlan) {
          setSelectedPlan(individualPlan);
        }
      }
    } catch (error: any) {
      console.error('Error fetching payment plans:', error);
      toast({
        title: "Error",
        description: "Failed to load payment plans",
        variant: "destructive",
      });
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a payment plan",
        variant: "destructive",
      });
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
      const { data, error } = await supabase.functions.invoke('create-payment-order', {
        body: {
          planId: selectedPlan.id,
          assessmentType,
          guestInfo: isGuest ? guestInfo : undefined,
          quantity,
        }
      });

      if (error) throw error;

      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful payment
      toast({
        title: "Order Created",
        description: `Order created successfully. Total: ${data.currency} ${data.totalAmount}`,
        variant: "default",
      });

      // Integrate with your payment processor here
      // Example: redirect to payment form or open payment modal
      await handlePaymentProcessing(data);

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentProcessing = async (orderData: any) => {
    // This is where you'd integrate with your payment processor
    // For now, we'll simulate the payment process
    
    toast({
      title: "Payment Processing",
      description: "Redirecting to payment form...",
      variant: "default",
    });

    // Simulate payment completion (remove this in production)
    setTimeout(async () => {
      try {
        const { error } = await supabase.functions.invoke('update-payment-status', {
          body: {
            orderId: orderData.orderId,
            paymentStatus: 'completed',
            paymentReference: 'sim_' + Math.random().toString(36).substr(2, 9),
          }
        });

        if (error) throw error;

        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully!",
          variant: "default",
        });

        onPaymentSuccess?.(orderData.orderId);
      } catch (error: any) {
        toast({
          title: "Payment Error",
          description: error.message || "Payment processing failed",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'individual': return <CreditCard className="w-5 h-5" />;
      case 'subscription': return <Star className="w-5 h-5" />;
      case 'bulk': return <Users className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPlanBadge = (plan: PaymentPlan) => {
    if (plan.plan_type === 'subscription') return <Badge variant="secondary">Subscription</Badge>;
    if (plan.plan_type === 'bulk') return <Badge variant="outline">Bulk</Badge>;
    if (plan.billing_interval === 'one-time') return <Badge variant="default">One-time</Badge>;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
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

      {/* Payment Plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`cursor-pointer transition-all ${
              selectedPlan?.id === plan.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedPlan(plan)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPlanIcon(plan.plan_type)}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                {getPlanBadge(plan)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {plan.currency} {plan.price}
                </div>
                {plan.billing_interval !== 'one-time' && (
                  <div className="text-sm text-muted-foreground">
                    per {plan.billing_interval}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {Array.isArray(plan.assessment_access) && plan.assessment_access.includes('all') ? (
                    <li>• All assessments</li>
                  ) : (
                    Array.isArray(plan.assessment_access) && plan.assessment_access.map((access: string, index: number) => (
                      <li key={index}>• {access}</li>
                    ))
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quantity Selector for Bulk Plans */}
      {selectedPlan?.plan_type === 'bulk' && (
        <Card>
          <CardHeader>
            <CardTitle>Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="quantity">Number of assessments:</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="1000"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>{selectedPlan.name}</span>
              <span>{selectedPlan.currency} {selectedPlan.price}</span>
            </div>
            {quantity > 1 && (
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{quantity}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{selectedPlan.currency} {(selectedPlan.price * quantity).toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCreateOrder}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};