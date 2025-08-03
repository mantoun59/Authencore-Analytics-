import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PaymentSystem } from '@/components/PaymentSystem';
import InvoicePreview from '@/components/InvoicePreview';
import { Button } from '@/components/ui/button';

const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const assessmentType = searchParams.get('assessment');
  const [showPreview, setShowPreview] = useState(false);

  const handlePaymentSuccess = (orderId: string) => {
    // Handle successful payment
    // Payment successful for order
    // You can redirect to a success page or assessment page
    // window.location.href = `/assessment-success?order=${orderId}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Toggle Preview Button */}
          <div className="text-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="mb-4"
            >
              {showPreview ? 'Hide' : 'Show'} Invoice/Receipt Preview
            </Button>
          </div>

          {/* Show either preview or payment system */}
          {showPreview ? (
            <InvoicePreview />
          ) : (
            <PaymentSystem
              assessmentType={assessmentType || undefined}
              onPaymentSuccess={handlePaymentSuccess}
              showGuestCheckout={true}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;