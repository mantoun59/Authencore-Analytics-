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

interface SecurityCheck {
  action: 'rate_limit' | 'threat_detection' | 'log_event' | 'analyze_activity' | 'admin_access';
  identifier?: string;
  endpoint?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  payload?: any;
  eventData?: any;
  activityData?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params }: SecurityCheck = await req.json();

    console.log(`Security middleware: ${action}`, params);

    switch (action) {
      case 'rate_limit':
        return await handleRateLimitCheck(params.identifier!, params.endpoint!);
      
      case 'threat_detection':
        return await handleThreatDetection(params.user_id, params.ip_address, params.user_agent, params.payload);
      
      case 'log_event':
        return await handleLogSecurityEvent(params.user_id, params.eventData);
      
      case 'analyze_activity':
        return await handleAnalyzeSuspiciousActivity(params.activityData);
      
      case 'admin_access':
        return await handleAdminRouteAccess(params.user_id, params.payload);
      
      default:
        throw new Error(`Unknown security action: ${action}`);
    }

  } catch (error: any) {
    console.error('Security middleware error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleRateLimitCheck(identifier: string, endpoint: string): Promise<Response> {
  try {
    const { data: isAllowed, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: endpoint,
      p_limit: 100, // 100 requests per minute
      p_window_minutes: 1
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return new Response(JSON.stringify({ allowed: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      allowed: isAllowed,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Rate limit error:', error);
    return new Response(JSON.stringify({ allowed: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleThreatDetection(user_id?: string, ip_address?: string, user_agent?: string, payload?: any): Promise<Response> {
  try {
    const threats: string[] = [];
    let riskLevel = 'low';

    // Basic threat detection patterns
    const payloadStr = JSON.stringify(payload || {});
    
    // SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /((\b(OR|AND)\b\s+\d+\s*=\s*\d+))/i,
      /('.*--.*)/i,
      /(;.*DROP.*)/i
    ];

    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi
    ];

    // Check for SQL injection
    for (const pattern of sqlPatterns) {
      if (pattern.test(payloadStr)) {
        threats.push('sql_injection');
        riskLevel = 'high';
        break;
      }
    }

    // Check for XSS
    for (const pattern of xssPatterns) {
      if (pattern.test(payloadStr)) {
        threats.push('xss_attempt');
        riskLevel = 'high';
        break;
      }
    }

    // Check payload size
    if (payloadStr.length > 50000) {
      threats.push('oversized_payload');
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
    }

    // Check suspicious user agent
    if (user_agent) {
      const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'burp', 'curl', 'wget'];
      const lowerAgent = user_agent.toLowerCase();
      
      for (const agent of suspiciousAgents) {
        if (lowerAgent.includes(agent)) {
          threats.push('suspicious_user_agent');
          riskLevel = 'medium';
          break;
        }
      }
    }

    // Advanced detection using Supabase function
    if (user_id && ip_address) {
      const { data: isSuspicious } = await supabase.rpc('detect_suspicious_activity', {
        p_user_id: user_id,
        p_ip_address: ip_address,
        p_user_agent: user_agent || '',
        p_action: 'security_check'
      });

      if (isSuspicious) {
        threats.push('suspicious_activity_pattern');
        riskLevel = 'high';
      }
    }

    // Log threat if detected
    if (threats.length > 0) {
      await supabase.rpc('log_security_event', {
        p_user_id: user_id,
        p_event_type: 'threat_detected',
        p_event_details: {
          threats,
          risk_level: riskLevel,
          payload_size: payloadStr.length,
          user_agent: user_agent
        },
        p_ip_address: ip_address,
        p_user_agent: user_agent,
        p_severity: riskLevel === 'high' ? 'critical' : riskLevel === 'medium' ? 'warning' : 'info'
      });
    }

    return new Response(JSON.stringify({
      threats,
      riskLevel,
      blocked: riskLevel === 'high',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Threat detection error:', error);
    return new Response(JSON.stringify({
      threats: [],
      riskLevel: 'unknown',
      blocked: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleLogSecurityEvent(user_id?: string, eventData?: any): Promise<Response> {
  try {
    const { error } = await supabase.rpc('log_security_event', {
      p_user_id: user_id,
      p_event_type: eventData?.type || 'generic_security_event',
      p_event_details: eventData,
      p_ip_address: eventData?.ip_address,
      p_user_agent: eventData?.user_agent,
      p_severity: eventData?.severity || 'info'
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Security event logging error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleAnalyzeSuspiciousActivity(activityData: any): Promise<Response> {
  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const analysisPrompt = `Analyze the following security activity data and provide a risk assessment:

Activity Data: ${JSON.stringify(activityData, null, 2)}

Please provide:
1. Risk level (low, medium, high, critical)
2. Potential threats identified
3. Recommended actions
4. Confidence level in assessment

Respond in JSON format with: { "riskLevel": "", "threats": [], "recommendations": [], "confidence": "" }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert analyzing security events. Provide concise, actionable security assessments.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content;

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      parsedAnalysis = {
        riskLevel: 'medium',
        threats: ['analysis_parsing_error'],
        recommendations: ['Manual review required'],
        confidence: 'low'
      };
    }

    return new Response(JSON.stringify({
      analysis: parsedAnalysis,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Activity analysis error:', error);
    return new Response(JSON.stringify({
      analysis: {
        riskLevel: 'unknown',
        threats: ['analysis_failed'],
        recommendations: ['Manual investigation required'],
        confidence: 'none'
      },
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleAdminRouteAccess(user_id?: string, payload?: any): Promise<Response> {
  try {
    if (!user_id) {
      await supabase.rpc('log_security_event', {
        p_user_id: null,
        p_event_type: 'unauthorized_admin_access_attempt',
        p_event_details: { payload, reason: 'no_user_id' },
        p_severity: 'warning'
      });

      return new Response(JSON.stringify({
        allowed: false,
        reason: 'Authentication required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user has admin role
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user_id)
      .eq('role', 'admin');

    if (error) {
      console.error('Admin role check error:', error);
      throw error;
    }

    const isAdmin = userRoles && userRoles.length > 0;

    // Log admin access attempt
    await supabase.rpc('log_security_event', {
      p_user_id: user_id,
      p_event_type: isAdmin ? 'admin_access_granted' : 'admin_access_denied',
      p_event_details: { 
        payload,
        admin_role_found: isAdmin,
        route: payload?.route || 'unknown'
      },
      p_severity: isAdmin ? 'info' : 'warning'
    });

    return new Response(JSON.stringify({
      allowed: isAdmin,
      reason: isAdmin ? 'Admin access granted' : 'Insufficient permissions'
    }), {
      status: isAdmin ? 200 : 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Admin access check error:', error);
    
    // Log the error
    if (user_id) {
      await supabase.rpc('log_security_event', {
        p_user_id: user_id,
        p_event_type: 'admin_access_check_error',
        p_event_details: { error: error.message, payload },
        p_severity: 'error'
      });
    }

    return new Response(JSON.stringify({
      allowed: false,
      reason: 'Access check failed',
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}