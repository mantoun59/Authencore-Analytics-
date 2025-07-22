import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation helper function
const validateEnhancedAIRequest = (data: unknown) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body - must be an object');
  }
  
  const req = data as Record<string, unknown>;
  
  if (!req.prompt || typeof req.prompt !== 'string') {
    throw new Error('Invalid or missing prompt field - must be a string');
  }
  
  if (req.prompt.length > 5000) {
    throw new Error('Prompt too long - maximum 5000 characters');
  }
  
  const validModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-2025-04-14'];
  const model = req.model || 'gpt-4o-mini';
  if (typeof model !== 'string' || !validModels.includes(model)) {
    throw new Error(`Invalid model - must be one of: ${validModels.join(', ')}`);
  }
  
  const temperature = req.temperature || 0.3;
  if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
    throw new Error('Invalid temperature - must be a number between 0 and 2');
  }
  
  const maxTokens = req.maxTokens || 4000;
  if (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 8000) {
    throw new Error('Invalid maxTokens - must be a number between 1 and 8000');
  }
  
  return {
    prompt: req.prompt.trim(),
    model: model as string,
    temperature: temperature as number,
    maxTokens: maxTokens as number
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('❌ OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('❌ Invalid JSON in request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate request structure
    const { prompt, model, temperature, maxTokens } = validateEnhancedAIRequest(requestBody);

    console.log(`🤖 Enhanced AI Analysis Request - Model: ${model}, Tokens: ${maxTokens}`);

    // Call OpenAI API with enhanced configuration
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI system specializing in psychometric analysis, talent assessment, and behavioral prediction. 
            You have expertise in:
            - Industrial psychology and psychometric evaluation
            - Behavioral prediction modeling
            - Statistical analysis of assessment data
            - Interview design and validation
            - Career development and guidance
            
            Always provide detailed, evidence-based analysis with specific insights and actionable recommendations.
            Return responses in valid JSON format when requested.
            Be precise, professional, and comprehensive in your analysis.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: temperature || 0.3,
        max_tokens: maxTokens || 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const aiResponse = data.choices[0].message.content;
    
    console.log('✅ Enhanced AI Analysis completed successfully');

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse,
      model: model,
      tokensUsed: data.usage?.total_tokens || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Enhanced AI Analysis Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});