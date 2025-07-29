import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatbotRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

function validateChatbotRequest(data: unknown): data is ChatbotRequest {
  if (typeof data !== 'object' || data === null) return false;
  const req = data as any;
  
  if (typeof req.message !== 'string' || req.message.trim().length === 0) return false;
  if (req.message.length > 1000) return false;
  
  if (req.conversationHistory && !Array.isArray(req.conversationHistory)) return false;
  
  return true;
}

const SYSTEM_PROMPT = `You are an AI assistant for AuthenCore Analytics, a professional psychometric assessment platform. Your role is to help users understand our assessments, answer questions about results, and provide guidance on professional development.

About AuthenCore Analytics:
- We offer validated psychometric assessments for individuals and organizations
- Our assessments include: Career Launch, Emotional Intelligence, Communication Styles, Leadership, Cultural Intelligence, Burnout Prevention, Gen Z Workplace, and Faith & Values assessments
- We provide detailed reports with actionable insights and development recommendations
- Our platform serves both individual candidates and employers for recruitment and development

Key Assessment Information:
1. Career Launch Assessment: Evaluates career readiness, professional skills, networking abilities, and goal orientation
2. Emotional Intelligence Assessment: Measures self-awareness, self-regulation, motivation, empathy, and social skills
3. Communication Styles Assessment: Analyzes communication preferences, conflict resolution, and collaboration approaches
4. Leadership Assessment: Evaluates leadership potential, decision-making, team management, and strategic thinking
5. Cultural Intelligence Assessment: Measures cross-cultural awareness, adaptation skills, and global mindset
6. Burnout Prevention Assessment: Assesses stress management, work-life balance, and resilience factors
7. Gen Z Workplace Assessment: Evaluates modern workplace preferences, values, and collaboration styles
8. Faith & Values Assessment: Explores personal values, ethical frameworks, and purpose-driven decision making

Guidelines for responses:
- Be professional, supportive, and encouraging
- Provide specific, actionable advice when possible
- Reference our assessment dimensions and scoring when relevant
- Encourage professional development and growth
- Maintain confidentiality and respect for assessment results
- Direct complex technical questions to our support team
- Focus on helping users understand and apply their results

If asked about pricing, refer users to our pricing page or contact our sales team.
If asked about technical issues, suggest contacting our support team.

Keep responses concise but helpful, typically 2-4 sentences unless more detail is specifically requested.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    if (!validateChatbotRequest(requestData)) {
      return new Response(JSON.stringify({
        error: 'Invalid request. Please provide a valid message.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { message, conversationHistory = [] } = requestData;

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    console.log('Processing chatbot request:', { messageLength: message.length, historyLength: conversationHistory.length });

    // Prepare messages for Claude API
    const messages = [
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 400) {
        throw new Error('Invalid request format');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }

    const data = await response.json();
    const assistantResponse = data.content[0]?.text || 'I apologize, but I encountered an issue generating a response. Please try again.';

    console.log('Chatbot response generated successfully');

    return new Response(JSON.stringify({
      response: assistantResponse,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Chatbot error:', error);
    
    let errorMessage = 'I encountered an error processing your request. Please try again.';
    let statusCode = 500;

    if (error.message.includes('API key')) {
      errorMessage = 'Service temporarily unavailable. Please try again later.';
      statusCode = 503;
    } else if (error.message.includes('Rate limit')) {
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
      statusCode = 429;
    } else if (error.message.includes('Invalid request')) {
      errorMessage = 'Invalid request format. Please check your message and try again.';
      statusCode = 400;
    }

    return new Response(JSON.stringify({
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});