import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface UpdatePaymentRequest {
  orderId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentReference?: string;
  paymentMetadata?: any;
}

const logStep = (step: string, data?: any) => {
  console.log(`[update-payment-status] ${step}`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const { orderId, paymentStatus, paymentReference, paymentMetadata }: UpdatePaymentRequest = await req.json();
    
    logStep('Request parsed', { orderId, paymentStatus, hasReference: !!paymentReference });

    if (!orderId || !paymentStatus) {
      throw new Error('Order ID and payment status are required');
    }

    // Update the order with new payment status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        payment_reference: paymentReference,
        payment_metadata: paymentMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      logStep('Order update error', updateError);
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    logStep('Order updated successfully', updatedOrder);

    // Handle post-payment logic for completed payments
    if (paymentStatus === 'completed') {
      logStep('Processing completed payment');

      // Activate guest access tokens if this is a guest order
      if (updatedOrder.is_guest_order) {
        const { error: tokenError } = await supabase
          .from('guest_access_tokens')
          .update({ is_active: true })
          .eq('order_id', orderId);

        if (tokenError) {
          logStep('Token activation error', tokenError);
        } else {
          logStep('Guest tokens activated');
        }
      }

      // Log analytics event for completed payment
      await supabase.rpc('log_analytics_event', {
        p_event_type: 'payment_completed',
        p_entity_type: 'order',
        p_entity_id: orderId,
        p_metadata: {
          payment_reference: paymentReference,
          amount: updatedOrder.total_amount,
          currency: updatedOrder.currency,
          is_guest_order: updatedOrder.is_guest_order,
          assessment_type: updatedOrder.assessment_type
        }
      });

      // Send confirmation email (commented out - implement if email service is configured)
      /*
      if (updatedOrder.is_guest_order && updatedOrder.guest_email) {
        try {
          await supabase.functions.invoke('send-assessment-report', {
            body: {
              recipientEmail: updatedOrder.guest_email,
              reportType: 'payment_confirmation',
              candidateName: updatedOrder.guest_name || 'Guest User',
              assessmentType: updatedOrder.assessment_type,
              orderDetails: updatedOrder
            }
          });
          logStep('Confirmation email sent');
        } catch (emailError) {
          logStep('Email send error', emailError);
        }
      }
      */

      logStep('Post-payment processing completed');
    }

    return new Response(JSON.stringify({
      success: true,
      order: {
        id: updatedOrder.id,
        payment_status: updatedOrder.payment_status,
        payment_reference: updatedOrder.payment_reference,
        updated_at: updatedOrder.updated_at
      },
      message: `Payment status updated to ${paymentStatus}`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    logStep('Function error', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});