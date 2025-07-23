import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation helper function
const validateChatbotRequest = (data: unknown) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body - must be an object');
  }
  
  const req = data as Record<string, unknown>;
  
  if (!req.message || typeof req.message !== 'string') {
    throw new Error('Invalid or missing message field - must be a string');
  }
  
  if (req.message.length > 1000) {
    throw new Error('Message too long - maximum 1000 characters');
  }
  
  if (req.sessionId && typeof req.sessionId !== 'string') {
    throw new Error('Invalid sessionId - must be a string');
  }
  
  return {
    message: req.message.trim(),
    sessionId: req.sessionId as string | undefined,
    context: req.context as Record<string, unknown> | undefined
  };
};

const SYSTEM_PROMPT = `You are a helpful AI assistant for AuthenCore Analytics, a professional psychological assessment platform. Your role is to assist users with questions about our website, assessments, and services.

ABOUT AUTHENCORE ANALYTICS:
- We are a professional psychological assessment platform
- Our mission: "Measuring Minds. Shaping Futures."
- We provide scientifically validated tests for individuals and organizations
- We offer comprehensive career assessment tools and personality evaluations

AVAILABLE ASSESSMENTS:
1. CareerLaunch Assessment ($9.99) - Best Value
   - 144 questions across 18 dimensions
   - Comprehensive career discovery assessment
   - Analyzes interests, aptitudes, personality, and values
   - Includes RIASEC profile, aptitude analysis, and PDF reports

2. CAIR+ Personality Assessment ($29.99) - Premium
   - 100 questions with validity detection
   - Comprehensive personality assessment with advanced validity detection
   - Percentile scoring and dual reporting

3. Stress Resilience Assessment ($19.99) - Popular
   - 60 questions with biometric simulation
   - Advanced stress resilience and adaptability assessment

4. Cultural Intelligence Assessment ($19.99) - Global
   - 60+ scenarios across 4 CQ dimensions
   - Comprehensive cultural intelligence assessment with real-world scenarios

5. Communication Styles Assessment ($24.99) - Advanced
   - 80 questions with linguistic analysis
   - Comprehensive communication assessment with linguistic analysis

6. Emotional Intelligence Assessment ($24.99) - EQ Focus
   - 65 questions measuring EQ dimensions
   - Comprehensive emotional intelligence assessment

7. Leadership Assessment ($34.99) - Executive
   - 90 questions with 360-degree feedback
   - Advanced leadership assessment with comprehensive feedback

8. Digital Wellness Assessment ($14.99) - Wellbeing
   - 55 questions with habit tracking
   - Comprehensive digital wellness assessment

9. Faith & Values Assessment ($19.99) - Personal
   - 70 questions exploring values alignment
   - Comprehensive faith and values assessment

10. Gen Z Workplace Assessment ($16.99) - Generational
    - 50 questions focused on Gen Z workplace dynamics
    - Generational workplace assessment

Please provide helpful, accurate information about our services. Always maintain a professional and supportive tone.`;

serve(async (req) => {
  console.log('🤖 AI Chatbot function v2.0 called at:', new Date().toISOString());
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('📋 Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    console.log('📨 Received message:', message?.substring(0, 50) + '...');

    if (!message) {
      throw new Error('Message is required');
    }

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      console.error('❌ Anthropic API key not found in environment');
      throw new Error('Anthropic API key not configured');
    }
    
    console.log('🔑 Anthropic API key found, length:', anthropicApiKey.length);

    // Prepare messages for Claude
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('🚀 Making request to Claude API...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    console.log('📊 Claude API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API error:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid Anthropic API key. Please check your API key configuration.');
      } else if (response.status === 429) {
        throw new Error('Claude API rate limit exceeded. Please try again later.');
      } else if (response.status === 400) {
        throw new Error('Invalid request to Claude API. Please try a different message.');
      } else {
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text;

    if (!assistantMessage) {
      throw new Error('No response received from Claude API');
    }

    console.log('✅ Successfully generated response, length:', assistantMessage.length);

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in ai-chatbot function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});