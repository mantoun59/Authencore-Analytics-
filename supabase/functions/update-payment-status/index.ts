import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdatePaymentRequest {
  orderId: string;
  paymentStatus: 'completed' | 'failed' | 'refunded';
  paymentReference?: string;
  paymentMetadata?: any;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[UPDATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { orderId, paymentStatus, paymentReference, paymentMetadata }: UpdatePaymentRequest = await req.json();
    logStep("Request data parsed", { orderId, paymentStatus });

    // Update order status
    const { data: order, error: updateError } = await supabaseClient
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
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    logStep("Order updated successfully", { orderId, paymentStatus });

    // If payment is completed, activate guest tokens and generate invoice
    if (paymentStatus === 'completed') {
      // Activate guest access tokens
      if (order.is_guest_order) {
        const { error: tokenError } = await supabaseClient
          .from('guest_access_tokens')
          .update({ is_active: true })
          .eq('order_id', orderId);

        if (tokenError) {
          logStep("Warning: Failed to activate guest tokens", { error: tokenError });
        } else {
          logStep("Guest tokens activated");
        }
      }

      // Log successful payment
      await supabaseClient.rpc('log_analytics_event', {
        p_event_type: 'payment_completed',
        p_entity_type: 'order',
        p_entity_id: orderId,
        p_metadata: {
          total_amount: order.total_amount,
          currency: order.currency,
          payment_reference: paymentReference
        }
      });

      // Generate invoice and send receipt
      try {
        const { error: invoiceError } = await supabaseClient.functions.invoke('generate-invoice', {
          body: { orderId }
        });
        
        if (invoiceError) {
          logStep("Warning: Failed to generate invoice", { error: invoiceError });
        } else {
          logStep("Invoice generated and receipt sent");
        }
      } catch (invoiceError) {
        logStep("Warning: Invoice generation failed", { error: invoiceError });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      orderId,
      paymentStatus,
      message: `Order ${paymentStatus} successfully`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR in update-payment-status", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});