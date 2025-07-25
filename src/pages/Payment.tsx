import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PaymentSystem } from '@/components/PaymentSystem';

const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const assessmentType = searchParams.get('assessment');

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
        <PaymentSystem
          assessmentType={assessmentType || undefined}
          onPaymentSuccess={handlePaymentSuccess}
          showGuestCheckout={true}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Payment;