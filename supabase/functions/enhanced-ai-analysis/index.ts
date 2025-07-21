import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnhancedAIRequest {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { prompt, model, temperature, maxTokens }: EnhancedAIRequest = await req.json();

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