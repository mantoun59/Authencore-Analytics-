import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateTestAccessRequest {
  assessmentType: string;
  email: string;
  adminGenerated?: boolean;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TEST-ACCESS] ${step}${detailsStr}`);
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

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (user) {
        const { data: isAdmin } = await supabaseClient.rpc('is_admin', { 
          _user_id: user.id 
        });
        
        if (!isAdmin) {
          throw new Error('Admin access required');
        }
      }
    }

    const { assessmentType, email, adminGenerated }: CreateTestAccessRequest = await req.json();
    logStep("Request data parsed", { assessmentType, email, adminGenerated });

    // Generate test token
    const { data: token } = await supabaseClient.rpc('generate_guest_token');

    // Create guest access token with extended expiry for testing
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days for testing

    const { error: tokenError } = await supabaseClient
      .from('guest_access_tokens')
      .insert({
        token,
        assessment_type: assessmentType,
        email,
        expires_at: expiresAt.toISOString(),
        is_active: true,
        order_id: null // No order for test tokens
      });

    if (tokenError) {
      throw new Error(`Failed to create test token: ${tokenError.message}`);
    }

    logStep("Test token created", { token, assessmentType });

    // Log analytics event
    await supabaseClient.rpc('log_analytics_event', {
      p_event_type: 'test_access_generated',
      p_entity_type: 'guest_token',
      p_metadata: {
        assessment_type: assessmentType,
        email,
        admin_generated: adminGenerated,
        token
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      token,
      assessmentType,
      expiresAt: expiresAt.toISOString(),
      message: 'Test access token generated successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR in create-test-access", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});