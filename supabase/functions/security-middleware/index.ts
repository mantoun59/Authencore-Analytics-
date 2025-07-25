import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityCheck {
  action: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  endpoint?: string;
  payload?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, user_id, ip_address, user_agent, endpoint, payload }: SecurityCheck = await req.json();

    console.log(`Security check for action: ${action}`);

    switch (action) {
      case 'rate_limit_check':
        return await handleRateLimitCheck(user_id || ip_address || 'anonymous', endpoint || 'default');
      
      case 'threat_detection':
        return await handleThreatDetection(user_id, ip_address, user_agent, payload);
      
      case 'log_security_event':
        return await handleLogSecurityEvent(user_id, payload);
      
      case 'admin_route_access_attempt':
        return await handleAdminRouteAccess(user_id, payload);
      
      default:
        console.error(`Unknown action: ${action}`);
        return new Response(JSON.stringify({ 
          error: 'Invalid action',
          allowed: false 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in security middleware:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      allowed: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleRateLimitCheck(identifier: string, endpoint: string): Promise<Response> {
  try {
    // Check rate limit using the database function
    const { data: isAllowed, error } = await supabase
      .rpc('check_rate_limit', {
        p_identifier: identifier,
        p_endpoint: endpoint,
        p_limit: 60, // 60 requests per minute
        p_window_minutes: 1
      });

    if (error) throw error;

    console.log(`Rate limit check for ${identifier} on ${endpoint}: ${isAllowed ? 'allowed' : 'blocked'}`);

    return new Response(JSON.stringify({ 
      allowed: isAllowed,
      identifier,
      endpoint 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Rate limit check error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      allowed: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleThreatDetection(
  user_id?: string, 
  ip_address?: string, 
  user_agent?: string, 
  payload?: any
): Promise<Response> {
  try {
    let suspicious = false;
    const threats: string[] = [];

    // Basic threat detection rules
    if (payload) {
      // Check for SQL injection patterns
      const sqlPatterns = [
        /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b)/i,
        /(\bOR\b\s+\d+\s*=\s*\d+|\bAND\b\s+\d+\s*=\s*\d+)/i,
        /(--|\/\*|\*\/|;)/
      ];

      const payloadStr = JSON.stringify(payload).toLowerCase();
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(payloadStr)) {
          suspicious = true;
          threats.push('potential_sql_injection');
          break;
        }
      }

      // Check for XSS patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(payloadStr)) {
          suspicious = true;
          threats.push('potential_xss');
          break;
        }
      }

      // Check for unusual data sizes
      if (payloadStr.length > 10000) {
        suspicious = true;
        threats.push('oversized_payload');
      }
    }

    // Check user agent patterns
    if (user_agent) {
      const suspiciousAgents = [
        /bot/i,
        /crawler/i,
        /scanner/i,
        /curl/i,
        /wget/i
      ];

      for (const pattern of suspiciousAgents) {
        if (pattern.test(user_agent) && !user_agent.includes('Googlebot')) {
          suspicious = true;
          threats.push('suspicious_user_agent');
          break;
        }
      }
    }

    // Use database function for more complex detection
    if (user_id && ip_address) {
      const { data: dbSuspicious, error } = await supabase
        .rpc('detect_suspicious_activity', {
          p_user_id: user_id,
          p_ip_address: ip_address,
          p_user_agent: user_agent || '',
          p_action: 'general_activity'
        });

      if (error) {
        console.error('Database threat detection error:', error);
      } else if (dbSuspicious) {
        suspicious = true;
        threats.push('database_detected_suspicious_pattern');
      }
    }

    // Log if suspicious
    if (suspicious && user_id) {
      await supabase.rpc('log_security_event', {
        p_user_id: user_id,
        p_event_type: 'threat_detected',
        p_event_details: { threats, payload_size: JSON.stringify(payload || {}).length },
        p_ip_address: ip_address,
        p_user_agent: user_agent,
        p_severity: 'warning'
      });
    }

    return new Response(JSON.stringify({ 
      suspicious,
      threats,
      risk_score: threats.length * 0.3 // Simple risk scoring
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Threat detection error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      suspicious: true // Fail secure
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleLogSecurityEvent(user_id?: string, eventData?: any): Promise<Response> {
  try {
    const { error } = await supabase.rpc('log_security_event', {
      p_user_id: user_id,
      p_event_type: eventData.event_type || 'general',
      p_event_details: eventData.details || {},
      p_ip_address: eventData.ip_address,
      p_user_agent: eventData.user_agent,
      p_severity: eventData.severity || 'info'
    });

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true,
      logged: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Log security event error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleAnalyzeSuspiciousActivity(activityData: any): Promise<Response> {
  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Use AI to analyze patterns in security events
    const prompt = `
    Analyze the following security activity data for potential threats:
    
    ${JSON.stringify(activityData, null, 2)}
    
    Provide a brief assessment of:
    1. Risk level (low/medium/high)
    2. Potential threats identified
    3. Recommended actions
    
    Respond in JSON format: {"risk_level": "", "threats": [], "recommendations": []}
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a cybersecurity expert analyzing activity patterns for threats. Respond only with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI analysis error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      risk_level: 'unknown',
      threats: ['analysis_failed'],
      recommendations: ['manual_review_required']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleAdminRouteAccess(user_id?: string, payload?: any): Promise<Response> {
  try {
    if (!user_id) {
      return new Response(JSON.stringify({ 
        allowed: false,
        error: 'User ID required for admin route access' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user_id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin role:', error);
      return new Response(JSON.stringify({ 
        allowed: false,
        error: 'Database error checking admin role' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isAdmin = !!data;

    // Log the access attempt
    await supabase.rpc('log_security_event', {
      p_user_id: user_id,
      p_event_type: 'admin_route_access',
      p_event_details: { 
        path: payload?.path,
        allowed: isAdmin,
        timestamp: new Date().toISOString()
      },
      p_ip_address: payload?.ip_address,
      p_user_agent: payload?.userAgent,
      p_severity: isAdmin ? 'info' : 'warning'
    });

    return new Response(JSON.stringify({ 
      allowed: isAdmin,
      isAdmin,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Admin route access check error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      allowed: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}