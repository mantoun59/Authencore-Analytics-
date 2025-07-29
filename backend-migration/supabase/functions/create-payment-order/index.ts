import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
}

const logStep = (step: string, data?: any) => {
  console.log(`[create-payment-order] ${step}`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Function started');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { planId, assessmentType, guestInfo }: CreateOrderRequest = await req.json();
    logStep('Request parsed', { planId, assessmentType, hasGuestInfo: !!guestInfo });

    // Get user from auth header or use guest info
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
      logStep('User authenticated', { userId });
    } else if (!guestInfo) {
      throw new Error('Either authentication or guest info required');
    }

    // Get payment plan details
    let planQuery = supabase.from('payment_plans').select('*');
    
    if (planId) {
      planQuery = planQuery.eq('id', planId);
    } else if (assessmentType) {
      planQuery = planQuery.eq('plan_type', assessmentType);
    } else {
      throw new Error('Either planId or assessmentType required');
    }

    const { data: plans, error: planError } = await planQuery.single();
    
    if (planError) {
      logStep('Plan query error', planError);
      throw new Error(`Plan not found: ${planError.message}`);
    }

    logStep('Plan found', plans);

    // Check for partner discount if user is authenticated
    let finalPrice = plans.price;
    if (userId) {
      const { data: partnerPricing } = await supabase
        .from('partner_pricing')
        .select('*')
        .eq('assessment_type', plans.plan_type)
        .eq('is_active', true)
        .single();

      if (partnerPricing) {
        if (partnerPricing.discount_percentage) {
          finalPrice = plans.price * (1 - partnerPricing.discount_percentage / 100);
        } else if (partnerPricing.fixed_price) {
          finalPrice = partnerPricing.fixed_price;
        }
        logStep('Partner pricing applied', { originalPrice: plans.price, finalPrice });
      }
    }

    // Create order
    const orderData = {
      user_id: userId,
      plan_id: plans.id,
      assessment_type: plans.plan_type,
      total_amount: finalPrice,
      currency: plans.currency || 'USD',
      payment_status: 'pending',
      is_guest_order: !userId,
      guest_email: guestInfo?.email || null,
      guest_name: guestInfo?.name || null,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      logStep('Order creation error', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    logStep('Order created', order);

    // Create order items based on plan's assessment access
    const assessmentAccess = plans.assessment_access || [plans.plan_type];
    const orderItems = assessmentAccess.map((assessment: string) => ({
      order_id: order.id,
      assessment_type: assessment,
      quantity: 1,
      unit_price: finalPrice / assessmentAccess.length,
      total_price: finalPrice / assessmentAccess.length
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      logStep('Order items creation error', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Generate guest access token for guest orders
    let guestToken = null;
    if (!userId && guestInfo) {
      const { data: tokenData } = await supabase.rpc('generate_guest_token');
      guestToken = tokenData;

      if (guestToken) {
        const { error: tokenError } = await supabase
          .from('guest_access_tokens')
          .insert({
            token: guestToken,
            email: guestInfo.email,
            assessment_type: plans.plan_type,
            order_id: order.id,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          });

        if (tokenError) {
          logStep('Guest token creation error', tokenError);
        } else {
          logStep('Guest token created', { token: guestToken });
        }
      }
    }

    // Log analytics event
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'order_created',
      p_entity_type: 'order',
      p_entity_id: order.id,
      p_metadata: {
        plan_type: plans.plan_type,
        amount: finalPrice,
        is_guest_order: !userId,
        user_id: userId
      }
    });

    logStep('Order completed successfully');

    return new Response(JSON.stringify({
      success: true,
      order: {
        id: order.id,
        total_amount: finalPrice,
        currency: order.currency,
        assessment_type: plans.plan_type,
        guest_token: guestToken
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    logStep('Function error', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});