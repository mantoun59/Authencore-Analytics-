import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, CreditCard, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SoloAssessment = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const loadCandidate = async () => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('solo_candidates')
          .select('*')
          .eq('access_token', token)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Invalid Access",
            description: "Assessment not found or access expired",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        // Check if access has expired
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          toast({
            title: "Access Expired",
            description: "Your assessment access has expired",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setCandidate(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load assessment",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [token, navigate, toast]);

  const handlePayment = async () => {
    if (!candidate) return;

    setPaymentLoading(true);
    try {
      // This would integrate with your payment system
      // For now, we'll simulate payment completion
      const { error } = await supabase
        .from('solo_candidates')
        .update({ payment_status: 'paid' })
        .eq('id', candidate.id);

      if (error) throw error;

      // Log payment event
      await supabase.rpc('log_analytics_event', {
        p_event_type: 'solo_payment_completed',
        p_entity_type: 'solo_candidate',
        p_entity_id: candidate.id,
        p_metadata: { amount: 49.99, currency: 'USD' }
      });

      setCandidate({ ...candidate, payment_status: 'paid' });
      
      toast({
        title: "Payment Successful",
        description: "You can now take the assessment",
      });
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const startAssessment = () => {
    // Navigate to the appropriate assessment based on type
    navigate(`/communication-assessment?solo_token=${token}`);
  };

  const viewReport = () => {
    window.open(candidate.report_url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Communication Styles Assessment</CardTitle>
              <CardDescription>
                Discover your communication style and improve workplace interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assessment Status */}
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  {candidate.payment_status === 'paid' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={candidate.payment_status === 'paid' ? 'text-green-500' : 'text-gray-400'}>
                    Payment
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-gray-200"></div>
                <div className="flex items-center space-x-2">
                  {candidate.assessment_completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : candidate.payment_status === 'paid' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary"></div>
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={candidate.assessment_completed ? 'text-green-500' : candidate.payment_status === 'paid' ? 'text-primary' : 'text-gray-400'}>
                    Assessment
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-gray-200"></div>
                <div className="flex items-center space-x-2">
                  {candidate.report_url ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={candidate.report_url ? 'text-green-500' : 'text-gray-400'}>
                    Report
                  </span>
                </div>
              </div>

              {/* Payment Section */}
              {candidate.payment_status !== 'paid' && (
                <div className="text-center space-y-4">
                  <div className="bg-primary/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-2">Assessment Fee</h3>
                    <div className="text-3xl font-bold text-primary mb-2">$49.99</div>
                    <p className="text-sm text-muted-foreground">
                      One-time payment for complete assessment and detailed report
                    </p>
                  </div>
                  <Button 
                    onClick={handlePayment} 
                    disabled={paymentLoading}
                    className="w-full"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {paymentLoading ? "Processing..." : "Pay & Start Assessment"}
                  </Button>
                </div>
              )}

              {/* Assessment Section */}
              {candidate.payment_status === 'paid' && !candidate.assessment_completed && (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Confirmed</h3>
                    <p className="text-green-700 text-sm">
                      You can now take your communication styles assessment
                    </p>
                  </div>
                  <Button onClick={startAssessment} className="w-full">
                    Start Assessment
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Assessment takes approximately 25-30 minutes to complete
                  </p>
                </div>
              )}

              {/* Report Section */}
              {candidate.assessment_completed && candidate.report_url && (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Assessment Complete</h3>
                    <p className="text-green-700 text-sm">
                      Your detailed report is ready for download
                    </p>
                  </div>
                  <Button onClick={viewReport} className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View & Download Report
                  </Button>
                </div>
              )}

              {/* Contact Support */}
              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/contact')}>
                    Contact Support
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SoloAssessment;