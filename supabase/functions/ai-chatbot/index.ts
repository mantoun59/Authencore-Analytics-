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
    const { message, conversationHistory = [], sessionId = null } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.log('OpenAI API key not found, using intelligent fallback response');
      return await handleIntelligentFallback(message, conversationHistory);
    }
    
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
    
    // Return intelligent contextual response instead of generic fallback
    const { message, conversationHistory = [] } = await req.json().catch(() => ({ message: '', conversationHistory: [] }));
    return await handleIntelligentFallback(message, conversationHistory);
  }
});

// Intelligent fallback function that provides contextual responses
async function handleIntelligentFallback(message: string, conversationHistory: any[] = []) {
  const messageContent = message?.toLowerCase() || '';
  
  // Context-aware responses based on message content
  let intelligentResponse = '';
  
  if (messageContent.includes('career') || messageContent.includes('job')) {
    intelligentResponse = `I'd love to help you with career exploration! Our **CareerLaunch Assessment** ($9.99) is perfect for discovering your ideal career path. It analyzes 18 key dimensions including your interests, aptitudes, personality, and values to provide personalized career recommendations.

🎯 **What makes it special:**
• 144 scientifically-designed questions
• RIASEC career matching system
• Detailed personality analysis
• Specific job recommendations with salary insights

Would you like to learn more about how CareerLaunch can guide your career decisions?`;
  }
  else if (messageContent.includes('personality') || messageContent.includes('traits')) {
    intelligentResponse = `For comprehensive personality insights, I recommend our **CAIR+ Personality Assessment** ($29.99). It's our most advanced personality evaluation with:

🧠 **Advanced Features:**
• 100 questions with validity detection technology
• Percentile scoring against professional benchmarks
• Dual reporting (candidate + employer perspectives)
• Deep dive into behavioral patterns and work style

This assessment is perfect for understanding your authentic self and how you interact in professional environments. What aspects of personality would you like to explore?`;
  }
  else if (messageContent.includes('leadership') || messageContent.includes('manage')) {
    intelligentResponse = `Leadership development is crucial for career advancement! Our **Authentic Leadership Assessment** ($34.99) provides executive-level insights:

👨‍💼 **Leadership Excellence:**
• 90 comprehensive questions
• 360-degree feedback capability
• Executive leadership competencies
• Personalized development roadmap

Perfect for current leaders or those aspiring to leadership roles. Would you like to discover your leadership potential and development opportunities?`;
  }
  else if (messageContent.includes('emotional') || messageContent.includes('eq')) {
    intelligentResponse = `Emotional Intelligence is a key predictor of success! Our **Emotional Intelligence Assessment** ($24.99) measures all EQ dimensions:

❤️ **EQ Development:**
• 65 targeted questions
• Self-awareness and regulation skills
• Social awareness and relationship management
• Leadership effectiveness insights

High EQ correlates with better relationships, leadership success, and career satisfaction. Ready to enhance your emotional intelligence?`;
  }
  else if (messageContent.includes('communication') || messageContent.includes('team')) {
    intelligentResponse = `Effective communication drives professional success! Our **Communication Styles Assessment** ($14.99) provides:

💬 **Communication Mastery:**
• 80 questions with linguistic analysis
• Professional communication effectiveness
• Team dynamics and interpersonal skills
• Conflict resolution strategies

Perfect for improving workplace relationships and team collaboration. What communication challenges would you like to address?`;
  }
  else if (messageContent.includes('stress') || messageContent.includes('resilience')) {
    intelligentResponse = `Building resilience is essential for thriving in today's workplace! Our **Stress & Resilience Assessment** ($19.99) offers:

💪 **Resilience Building:**
• 60 questions with stress response analysis
• Biometric-style stress simulation
• Personalized coping strategies
• Adaptability and bounce-back capacity

Learn to manage stress effectively and build unshakeable resilience. Ready to strengthen your stress management skills?`;
  }
  else if (messageContent.includes('cultural') || messageContent.includes('global')) {
    intelligentResponse = `In our global workplace, Cultural Intelligence is invaluable! Our **Cultural Intelligence Assessment** ($24.99) evaluates:

🌍 **Global Competency:**
• 60+ real-world cross-cultural scenarios
• 4 CQ dimensions: Drive, Knowledge, Strategy, Action
• Global workplace effectiveness
• Inclusive leadership capabilities

Perfect for international roles or diverse team leadership. Ready to enhance your cultural intelligence?`;
  }
  else if (messageContent.includes('price') || messageContent.includes('cost') || messageContent.includes('$')) {
    intelligentResponse = `Our assessments are designed to provide exceptional value for professional development:

💰 **Assessment Investment:**
• **CareerLaunch**: $9.99 - Complete career exploration
• **Communication Styles**: $14.99 - Professional communication
• **Digital Wellness**: $14.99 - Technology balance
• **Gen Z Workplace**: $19.99 - Modern work preferences
• **Faith & Values**: $19.99 - Values-based decisions
• **Stress & Resilience**: $19.99 - Stress management
• **Emotional Intelligence**: $24.99 - EQ development
• **Cultural Intelligence**: $24.99 - Global competency
• **CAIR+ Personality**: $29.99 - Advanced personality
• **Authentic Leadership**: $34.99 - Executive leadership

Each assessment includes detailed reports with actionable insights. Which assessment aligns with your development goals?`;
  }
  else if (messageContent.includes('hello') || messageContent.includes('hi') || messageContent.includes('hey')) {
    intelligentResponse = `Hello! I'm AuthenBot, your professional development guide at AuthenCore Analytics. I'm here to help you discover your potential through our scientifically-validated assessments.

🚀 **How can I assist you today?**
• Recommend the perfect assessment for your goals
• Explain our comprehensive evaluation process
• Guide you through career and personal development
• Answer questions about psychological insights

What area of growth interests you most - career exploration, leadership development, personality insights, or something else?`;
  }
  else {
    intelligentResponse = `I'm here to help you unlock your potential through professional assessment and development! 

🎯 **I can guide you with:**
• **Career Discovery** - Find your ideal career path
• **Personality Insights** - Understand your authentic self  
• **Leadership Development** - Build executive capabilities
• **Communication Skills** - Enhance professional relationships
• **Emotional Intelligence** - Develop EQ for success
• **Stress Resilience** - Master stress management
• **Cultural Intelligence** - Excel in global environments

Our assessments combine scientific rigor with practical insights to accelerate your professional growth. What specific challenge or goal would you like to address? I'll recommend the perfect assessment to help you succeed.`;
  }

  return new Response(JSON.stringify({ 
    response: intelligentResponse,
    success: true,
    source: 'intelligent_contextual'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}