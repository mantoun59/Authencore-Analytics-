import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, CreditCard, CheckCircle, Clock } from 'lucide-react';

interface PaymentProtectionProps {
  assessmentType: string;
  children: React.ReactNode;
  requirePayment?: boolean;
}

export const PaymentProtection: React.FC<PaymentProtectionProps> = ({
  assessmentType,
  children,
  requirePayment = true
}) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, [assessmentType, searchParams]);

  const checkAccess = async () => {
    if (!requirePayment) {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    try {
      // Check if user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Check for guest token
      const guestToken = searchParams.get('token');
      if (guestToken) {
        const { data: hasGuestAccess } = await supabase.rpc('check_guest_access', {
          p_token: guestToken,
          p_assessment_type: assessmentType
        });

        if (hasGuestAccess) {
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }

      // Check user's paid orders
      if (currentUser) {
        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('user_id', currentUser.id)
          .eq('payment_status', 'completed');

        if (error) throw error;

        // Check if user has access to this assessment
        const hasAssessmentAccess = orders?.some(order => 
          order.order_items?.some((item: any) => 
            item.assessment_type === assessmentType || 
            item.assessment_type === 'all'
          )
        );

        if (hasAssessmentAccess) {
          setHasAccess(true);
        }
      }

      // Check for valid guest orders with email
      if (!currentUser) {
        // For guests, we would need to check by email or token
        // This would require additional implementation
      }

    } catch (error: any) {
      console.error('Error checking access:', error);
      toast({
        title: "Access Check Failed",
        description: "Unable to verify access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentRedirect = () => {
    window.location.href = `/payment?assessment=${assessmentType}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess && requirePayment) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Payment Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                To access the {assessmentType.replace('-', ' ')} assessment, you need to complete payment first.
              </p>
              <p className="text-sm text-muted-foreground">
                This ensures you receive your complete professional report and analysis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handlePaymentRedirect}
                className="flex-1"
                size="lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Payment
              </Button>
              
              {!user && (
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/auth'}
                  className="flex-1"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Have a guest token? Add it to your URL: ?token=YOUR_TOKEN
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};