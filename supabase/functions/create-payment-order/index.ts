import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  planId?: string;
  assessmentType?: string;
  guestInfo?: {
    email: string;
    name: string;
  };
  billingInfo?: any;
  quantity?: number;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-ORDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { planId, assessmentType, guestInfo, billingInfo, quantity = 1 }: CreateOrderRequest = await req.json();
    logStep("Request data parsed", { planId, assessmentType, guestInfo: !!guestInfo });

    let user = null;
    const authHeader = req.headers.get("Authorization");
    
    // Try to get authenticated user (optional for guest checkout)
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      if (!userError && userData.user) {
        user = userData.user;
        logStep("User authenticated", { userId: user.id, email: user.email });
      }
    }

    // Must have either authenticated user or guest info
    if (!user && !guestInfo) {
      throw new Error("Authentication required or guest information must be provided");
    }

    const isGuest = !user && !!guestInfo;
    logStep("Order type determined", { isGuest });

    // Get payment plan details
    let plan = null;
    let totalAmount = 0;
    let assessmentAccess = [];

    if (planId) {
      const { data: planData, error: planError } = await supabaseClient
        .from('payment_plans')
        .select('*')
        .eq('id', planId)
        .eq('is_active', true)
        .single();

      if (planError || !planData) {
        throw new Error("Invalid or inactive payment plan");
      }

      plan = planData;
      totalAmount = parseFloat(plan.price) * quantity;
      assessmentAccess = plan.assessment_access;
      logStep("Payment plan retrieved", { planName: plan.name, totalAmount });
    } else if (assessmentType) {
      // Individual assessment purchase
      const { data: planData, error: planError } = await supabaseClient
        .from('payment_plans')
        .select('*')
        .eq('plan_type', 'individual')
        .contains('assessment_access', `["${assessmentType}"]`)
        .eq('is_active', true)
        .single();

      if (planError || !planData) {
        throw new Error("Assessment type not found");
      }

      plan = planData;
      totalAmount = parseFloat(plan.price) * quantity;
      assessmentAccess = [assessmentType];
      logStep("Individual assessment plan retrieved", { assessmentType, totalAmount });
    } else {
      throw new Error("Either planId or assessmentType must be provided");
    }

    // Check for partner pricing if user is authenticated and has partner role
    if (user && quantity > 1) {
      const { data: partnerData } = await supabaseClient
        .from('partner_accounts')
        .select('id')
        .eq('contact_email', user.email)
        .eq('is_active', true)
        .single();

      if (partnerData) {
        const { data: pricingData } = await supabaseClient
          .from('partner_pricing')
          .select('*')
          .eq('partner_id', partnerData.id)
          .eq('assessment_type', assessmentType || 'all')
          .lte('min_quantity', quantity)
          .eq('is_active', true)
          .order('min_quantity', { ascending: false })
          .limit(1)
          .single();

        if (pricingData) {
          if (pricingData.fixed_price) {
            totalAmount = parseFloat(pricingData.fixed_price) * quantity;
          } else if (pricingData.discount_percentage) {
            totalAmount = totalAmount * (1 - parseFloat(pricingData.discount_percentage) / 100);
          }
          logStep("Partner pricing applied", { originalAmount: parseFloat(plan.price) * quantity, newAmount: totalAmount });
        }
      }
    }

    // Create the order
    const orderData: any = {
      user_id: user?.id || null,
      guest_email: guestInfo?.email || null,
      guest_name: guestInfo?.name || null,
      plan_id: plan.id,
      assessment_type: assessmentType || null,
      total_amount: totalAmount,
      currency: plan.currency,
      payment_status: 'pending',
      billing_info: billingInfo || null,
      is_guest_order: isGuest,
      expires_at: isGuest ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24 hours for guest orders
    };

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      logStep("Order creation failed", { error: orderError });
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    logStep("Order created successfully", { orderId: order.id });

    // Create order items
    const orderItems = assessmentAccess.map((assessment: string) => ({
      order_id: order.id,
      assessment_type: assessment,
      quantity: quantity,
      unit_price: parseFloat(plan.price),
      total_price: totalAmount / assessmentAccess.length
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      logStep("Order items creation failed", { error: itemsError });
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Generate guest access token if needed
    let guestToken = null;
    if (isGuest && assessmentType) {
      const token = crypto.randomUUID();
      const { error: tokenError } = await supabaseClient
        .from('guest_access_tokens')
        .insert({
          token: token,
          order_id: order.id,
          assessment_type: assessmentType,
          email: guestInfo!.email,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

      if (!tokenError) {
        guestToken = token;
        logStep("Guest access token created", { token });
      }
    }

    // Log analytics event
    await supabaseClient.rpc('log_analytics_event', {
      p_event_type: 'order_created',
      p_entity_type: 'order',
      p_entity_id: order.id,
      p_metadata: {
        total_amount: totalAmount,
        currency: plan.currency,
        is_guest_order: isGuest,
        assessment_type: assessmentType,
        plan_type: plan.plan_type
      }
    });

    const response = {
      orderId: order.id,
      totalAmount,
      currency: plan.currency,
      assessmentAccess,
      guestToken,
      paymentStatus: 'pending',
      // This is where you'll integrate with your payment processor
      // Return any necessary data for your payment form
      paymentData: {
        amount: totalAmount,
        currency: plan.currency,
        description: plan.name,
        customerEmail: user?.email || guestInfo?.email,
        customerName: user?.user_metadata?.full_name || guestInfo?.name
      }
    };

    logStep("Order creation completed successfully", { orderId: order.id, totalAmount });
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR in create-payment-order", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});