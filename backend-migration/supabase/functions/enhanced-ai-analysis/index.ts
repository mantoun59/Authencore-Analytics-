import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

function validateEnhancedAIRequest(data: unknown): data is AnalysisRequest {
  if (typeof data !== 'object' || data === null) return false;
  const req = data as any;
  
  if (typeof req.prompt !== 'string' || req.prompt.trim().length === 0) return false;
  if (req.prompt.length > 10000) return false;
  
  if (req.model && typeof req.model !== 'string') return false;
  if (req.temperature && (typeof req.temperature !== 'number' || req.temperature < 0 || req.temperature > 2)) return false;
  if (req.maxTokens && (typeof req.maxTokens !== 'number' || req.maxTokens < 1 || req.maxTokens > 4000)) return false;
  
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const requestData = await req.json();
    
    if (!validateEnhancedAIRequest(requestData)) {
      return new Response(JSON.stringify({
        error: 'Invalid request format'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { prompt, model = 'gpt-4o-mini', temperature = 0.3, maxTokens = 1000 } = requestData;

    console.log('Processing enhanced AI analysis request');

    const systemPrompt = `You are an expert psychometric and behavioral analyst with deep expertise in:
- Psychometric assessment interpretation
- Workplace behavior analysis
- Professional development recommendations
- Statistical analysis and normative comparisons
- Bias detection and fairness in assessments

Provide detailed, professional analysis with:
1. Clear interpretation of results
2. Evidence-based insights
3. Actionable recommendations
4. Professional context and implications
5. Confidence levels in your analysis

Always maintain scientific rigor and ethical standards in your analysis.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || 'Unable to generate analysis';
    const tokensUsed = data.usage?.total_tokens || 0;

    console.log(`Enhanced AI analysis completed. Tokens used: ${tokensUsed}`);

    return new Response(JSON.stringify({
      analysis: analysis,
      model: model,
      tokensUsed: tokensUsed,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Enhanced AI analysis error:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});