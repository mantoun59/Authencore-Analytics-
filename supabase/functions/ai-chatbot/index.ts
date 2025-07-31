import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  console.log('🤖 AuthenBot AI Chatbot function called at:', new Date().toISOString());
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.log('OpenAI API key not found, using fallback response');
      return new Response(JSON.stringify({ 
        response: "I'm AuthenBot, your professional assistant for AuthenCore Analytics! Our comprehensive assessment portfolio helps you discover your potential. What would you like to know?" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, conversationHistory = [], sessionId = null } = await req.json();
    
    console.log('Processing AuthenBot request:', { 
      messageLength: message?.length, 
      sessionId,
      historyLength: conversationHistory?.length 
    });

    // Get user context if available
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      } catch (error) {
        console.log('No authenticated user found');
      }
    }

    // Professional system prompt focused on assessments and career development
    const systemPrompt = `You are AuthenBot, the professional AI assistant for AuthenCore Analytics - "Measuring Minds, Shaping Futures." You are an expert in psychological assessments, career development, and professional growth.

    CORE CAPABILITIES:
    - Answer questions about our 10 comprehensive assessment types
    - Explain psychological concepts and career development
    - Provide guidance on professional growth and skill development
    - Help users understand their assessment results and next steps
    - Offer personalized assessment recommendations based on user goals

    OUR COMPREHENSIVE ASSESSMENT PORTFOLIO:
    1. CareerLaunch Assessment ($9.99) ⭐ FLAGSHIP
       - 144 questions across 18 dimensions
       - Complete career discovery tool analyzing interests, aptitudes, personality, and values
       - RIASEC profile with career matching
       - Perfect for students, career changers, and anyone seeking direction

    2. CAIR+ Personality Assessment ($29.99) 🧠 ADVANCED
       - 100 questions with advanced validity detection technology
       - Comprehensive personality evaluation with percentile scoring
       - Dual reporting for candidates and employers

    3. Authentic Leadership Assessment ($34.99) 👨‍💼 EXECUTIVE
       - 90 questions with 360-degree feedback capability
       - Executive-level leadership evaluation
       - Advanced leadership development insights

    4. Faith & Values Assessment ($19.99) 💫 PERSONAL
       - 70 questions exploring core values and beliefs
       - Values-based decision making framework
       - Personal meaning and purpose discovery

    5. Communication Styles Assessment ($14.99) 💬 PROFESSIONAL
       - 80 questions with linguistic analysis
       - Professional communication effectiveness
       - Team dynamics and interpersonal skills

    6. Emotional Intelligence Assessment ($24.99) ❤️ EQ FOCUS
       - 65 questions measuring all EQ dimensions
       - Emotional awareness and regulation skills
       - Leadership and relationship effectiveness

    7. Cultural Intelligence Assessment ($24.99) 🌍 GLOBAL
       - 60+ real-world scenarios across 4 CQ dimensions
       - Cross-cultural competency assessment
       - Global workplace effectiveness

    8. Gen Z Workplace Assessment ($19.99) 🚀 GENERATIONAL
       - 50 questions focused on next-gen workplace dynamics
       - Modern work preferences and values
       - Generational workplace insights

    9. Digital Wellness Assessment ($14.99) 📱 WELLBEING
       - 55 questions with habit tracking
       - Technology relationship evaluation
       - Digital health and balance strategies

    10. Stress & Resilience Assessment ($19.99) 💪 RESILIENCE
        - 60 questions with biometric simulation
        - Stress management and adaptability
        - Resilience building strategies

    PROFESSIONAL TONE & APPROACH:
    - Maintain a professional yet approachable demeanor
    - Provide evidence-based, scientifically-informed guidance
    - Be encouraging and growth-focused in all interactions
    - Offer specific, actionable advice and recommendations
    - Respect individual differences and privacy
    - Ask clarifying questions to provide better guidance
    - Direct users to the most appropriate assessments for their goals

    CONVERSATION GUIDELINES:
    - Always maintain professional assessment standards
    - Provide specific next steps and actionable insights
    - Reference scientific backing when discussing concepts
    - Encourage continuous professional and personal development
    - Respect confidentiality and privacy in all interactions
    - If asked about specific assessment results, request more context
    - Recommend assessments based on user's stated goals and circumstances

    PRICING GUIDANCE:
    - Our assessments range from $9.99 to $34.99
    - CareerLaunch ($9.99) offers exceptional value for comprehensive career exploration
    - Specialized assessments provide deep insights into specific areas
    - All assessments include detailed reports with actionable insights

    Remember: Your role is to guide users toward self-discovery and professional growth through our scientifically-validated assessment portfolio. Be helpful, insightful, and always professional.`;

    // Prepare conversation messages with optimized context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6), // Keep last 6 messages for better context
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI GPT-4...');

    // Call OpenAI API with latest model
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Latest GPT-4 model
        messages: messages,
        max_tokens: 600,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error details:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('OpenAI response received successfully');

    // Store conversation in database if sessionId provided
    if (sessionId) {
      try {
        const conversationData = [
          ...conversationHistory,
          { 
            role: 'user', 
            content: message, 
            timestamp: new Date().toISOString() 
          },
          { 
            role: 'assistant', 
            content: aiResponse, 
            timestamp: new Date().toISOString() 
          }
        ];

        await supabase
          .from('chatbot_conversations')
          .upsert({
            session_id: sessionId,
            user_id: userId,
            conversation_data: conversationData,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'session_id'
          });

        console.log('Conversation stored successfully in database');
      } catch (error) {
        console.error('Error storing conversation:', error);
        // Don't fail the request if storage fails
      }
    }

    // Log detailed analytics
    try {
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'chatbot_interaction',
          entity_type: 'professional_guidance',
          metadata: {
            session_id: sessionId,
            user_id: userId,
            message_length: message.length,
            response_length: aiResponse.length,
            has_conversation_history: conversationHistory.length > 0,
            interaction_type: 'assessment_guidance',
            timestamp: new Date().toISOString()
          }
        });
      
      console.log('Analytics logged successfully');
    } catch (error) {
      console.error('Error logging analytics:', error);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sessionId: sessionId,
      success: true,
      source: 'openai_gpt4'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AuthenBot ai-chatbot function:', error);
    
    // Provide comprehensive professional fallback response
    const fallbackResponse = `I apologize for the technical difficulty. I'm AuthenBot, your professional assistant for AuthenCore Analytics - "Measuring Minds, Shaping Futures."

    I'm here to help you with:
    
    🎯 **Assessment Guidance**
    • Understanding our 10 comprehensive assessment types
    • Choosing the right assessment for your goals
    • Interpreting assessment results and next steps
    
    💼 **Career Development**
    • Professional growth strategies
    • Career exploration and planning
    • Skill development recommendations
    
    🧠 **Psychological Insights**
    • Personality and behavioral patterns
    • Emotional intelligence development
    • Leadership and communication skills
    
    **Popular Assessment Recommendations:**
    • CareerLaunch Assessment ($9.99) - Perfect for career exploration
    • CAIR+ Personality Assessment ($29.99) - Deep personality insights
    • Authentic Leadership Assessment ($34.99) - Executive leadership development
    • Emotional Intelligence Assessment ($24.99) - EQ enhancement
    
    What specific area of professional or personal development would you like to explore? I'm here to provide expert guidance tailored to your goals.`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      success: false,
      source: 'fallback_professional'
    }), {
      status: 200, // Return 200 to avoid client-side errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});