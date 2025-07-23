import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pipeline, env } from '@huggingface/transformers';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm here to help you with any questions about AuthenCore Analytics, our assessments, pricing, or anything else. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const generatorRef = useRef<any>(null);

  // Configure transformers.js
  useEffect(() => {
    env.allowLocalModels = false;
    env.useBrowserCache = true;
  }, []);

  // Initialize the model
  useEffect(() => {
    const initModel = async () => {
      try {
        console.log('🤖 Initializing AI model...');
        if (!generatorRef.current) {
          console.log('📦 Loading GPT-2 model...');
          generatorRef.current = await pipeline(
            'text-generation',
            'Xenova/gpt2',
            { device: 'wasm' } // Use WASM for browser compatibility
          );
          console.log('✅ Model loaded successfully!');
          setIsModelLoaded(true);
        }
      } catch (error) {
        console.error('❌ Failed to load model:', error);
        // Set model as loaded anyway to allow basic functionality
        setIsModelLoaded(true);
        toast({
          title: "Using Fallback Mode",
          description: "AI model couldn't load, using simple responses.",
          variant: "default"
        });
      }
    };
    
    initModel();
  }, [toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('💬 Processing message:', currentInput);
      
      let aiResponse = "";
      
      // Advanced context-aware responses
      const input = currentInput.toLowerCase();
      const words = input.split(' ');
      
      // Multi-keyword detection for more nuanced responses
      const hasKeyword = (keywords: string[]) => keywords.some(keyword => input.includes(keyword));
      const hasMultipleKeywords = (keywordSets: string[][]) => 
        keywordSets.every(set => set.some(keyword => input.includes(keyword)));
      
      // Professional assessment recommendations based on context
      if (hasKeyword(['price', 'cost', 'pricing', 'expensive', 'cheap', 'budget', '$', 'money'])) {
        if (hasKeyword(['career', 'job', 'work', 'profession'])) {
          aiResponse = "For career exploration, I recommend our CareerLaunch Assessment at $9.99 - it's our most comprehensive career discovery tool with exceptional value. It analyzes 144 questions across 18 dimensions including interests, aptitudes, personality traits, and core values to provide a complete career roadmap with RIASEC profiling and detailed PDF reports.";
        } else if (hasKeyword(['personality', 'traits', 'character'])) {
          aiResponse = "Our CAIR+ Personality Assessment at $29.99 represents premium psychological evaluation with advanced validity detection. This 100-question assessment features sophisticated percentile scoring, dual reporting capabilities, and comprehensive personality insights that exceed industry standards.";
        } else if (hasKeyword(['leadership', 'manager', 'executive', 'management'])) {
          aiResponse = "The Leadership Assessment at $34.99 is our executive-level evaluation designed for current and aspiring leaders. It includes 90 comprehensive questions with 360-degree feedback integration, advanced leadership competency mapping, and strategic development recommendations.";
        } else {
          aiResponse = "Our assessment portfolio ranges from $9.99 to $34.99, strategically priced for maximum accessibility while maintaining scientific rigor. The CareerLaunch Assessment ($9.99) offers exceptional value for comprehensive career discovery, while specialized assessments like Leadership ($34.99) provide executive-level insights. All assessments include detailed reports and actionable recommendations.";
        }
      } else if (hasKeyword(['career', 'job', 'work', 'profession', 'occupation', 'vocation'])) {
        if (hasKeyword(['change', 'transition', 'switch', 'new'])) {
          aiResponse = "Career transitions require comprehensive self-understanding. Our CareerLaunch Assessment ($9.99) is specifically designed for career changers, analyzing your transferable skills, emerging interests, and evolving values. It provides detailed exploration of 18 career dimensions with RIASEC profiling to identify optimal career paths that align with your authentic self.";
        } else if (hasKeyword(['student', 'college', 'graduate', 'university'])) {
          aiResponse = "For students and recent graduates, the CareerLaunch Assessment ($9.99) provides critical career clarity during this pivotal time. It evaluates academic strengths, emerging professional interests, and core values to guide major selection and career planning with scientifically-validated assessments.";
        } else {
          aiResponse = "The CareerLaunch Assessment ($9.99) is our flagship career discovery tool, utilizing 144 carefully crafted questions to evaluate interests, aptitudes, personality, and values across 18 comprehensive dimensions. It includes detailed RIASEC profiling, aptitude analysis, and generates professional PDF reports with specific career recommendations and development pathways.";
        }
      } else if (hasKeyword(['personality', 'traits', 'character', 'temperament', 'psychological'])) {
        aiResponse = "Our CAIR+ Personality Assessment ($29.99) represents advanced psychological evaluation with cutting-edge validity detection technology. This comprehensive 100-question assessment provides percentile scoring against normative populations, dual reporting capabilities, and deep insights into personality patterns that influence professional and personal success.";
      } else if (hasKeyword(['stress', 'resilience', 'pressure', 'overwhelm', 'burnout', 'anxiety'])) {
        if (hasKeyword(['work', 'workplace', 'job', 'professional'])) {
          aiResponse = "Workplace stress resilience is critical for professional success. Our Stress Resilience Assessment ($19.99) evaluates your adaptive capacity through 60 questions with advanced biometric simulation. It identifies stress patterns, coping mechanisms, and provides targeted strategies for building resilience in high-pressure professional environments.";
        } else {
          aiResponse = "The Stress Resilience Assessment ($19.99) provides comprehensive evaluation of your stress response patterns and adaptive capabilities. Using 60 specialized questions with biometric simulation technology, it measures resilience across multiple domains and offers evidence-based strategies for stress management and emotional regulation.";
        }
      } else if (hasKeyword(['communication', 'interpersonal', 'relationships', 'social', 'speaking'])) {
        if (hasKeyword(['workplace', 'professional', 'team', 'colleagues'])) {
          aiResponse = "Professional communication excellence drives career success. Our Communication Styles Assessment ($24.99) analyzes your communication patterns through 80 questions with sophisticated linguistic analysis. It identifies your communication strengths, potential blind spots, and provides strategies for enhancing workplace relationships and influence.";
        } else {
          aiResponse = "The Communication Styles Assessment ($24.99) provides deep analysis of your interpersonal communication patterns using 80 questions with advanced linguistic analysis. It evaluates verbal and non-verbal communication styles, identifies optimization opportunities, and offers personalized strategies for enhanced relationship building.";
        }
      } else if (hasKeyword(['leadership', 'manager', 'executive', 'management', 'supervisor', 'director'])) {
        aiResponse = "Executive leadership assessment requires sophisticated evaluation tools. Our Leadership Assessment ($34.99) is designed for current and aspiring leaders, featuring 90 comprehensive questions with 360-degree feedback capabilities. It evaluates leadership competencies, emotional intelligence in leadership contexts, and provides strategic development recommendations for executive growth.";
      } else if (hasKeyword(['emotional', 'eq', 'emotions', 'feelings', 'empathy'])) {
        aiResponse = "Emotional Intelligence is foundational to personal and professional success. Our EQ Assessment ($24.99) measures emotional intelligence across five core dimensions through 65 specialized questions. It evaluates self-awareness, self-regulation, motivation, empathy, and social skills with detailed development recommendations.";
      } else if (hasKeyword(['digital', 'technology', 'screen', 'online', 'wellness', 'balance'])) {
        aiResponse = "Digital wellness is increasingly critical in our connected world. Our Digital Wellness Assessment ($14.99) evaluates your relationship with technology through 55 questions with integrated habit tracking. It identifies digital patterns, potential areas of concern, and provides evidence-based strategies for healthy technology integration.";
      } else if (hasKeyword(['cultural', 'diversity', 'international', 'global', 'cross-cultural'])) {
        aiResponse = "Cultural Intelligence is essential for global success. Our Cultural Intelligence Assessment ($19.99) evaluates your ability to navigate cross-cultural environments through 60+ real-world scenarios across four CQ dimensions: Drive, Knowledge, Strategy, and Action. Perfect for international professionals and diverse team environments.";
      } else if (hasKeyword(['values', 'faith', 'beliefs', 'spirituality', 'meaning', 'purpose'])) {
        aiResponse = "Understanding your core values drives authentic life decisions. Our Faith & Values Assessment ($19.99) explores your fundamental beliefs and values through 70 thoughtful questions. It helps align career choices, relationship decisions, and life goals with your authentic value system for greater fulfillment and purpose.";
      } else if (hasKeyword(['gen z', 'generation', 'generational', 'young', 'millennial', 'workplace dynamics'])) {
        aiResponse = "Generational workplace dynamics significantly impact professional satisfaction. Our Gen Z Workplace Assessment ($16.99) focuses specifically on modern workplace preferences and generational communication styles through 50 targeted questions. It's invaluable for understanding and optimizing multigenerational team dynamics.";
      } else if (hasKeyword(['help', 'support', 'guidance', 'assistance', 'question', 'information'])) {
        aiResponse = "I'm here to provide expert guidance on our comprehensive assessment portfolio. AuthenCore Analytics offers scientifically-validated psychological assessments designed to unlock human potential. Whether you're seeking career clarity, personality insights, leadership development, or specialized evaluations, I can recommend the optimal assessment based on your specific goals and circumstances.";
      } else if (hasKeyword(['recommend', 'suggest', 'best', 'which', 'what should', 'advice'])) {
        aiResponse = "Optimal assessment selection depends on your specific objectives. For comprehensive career exploration, the CareerLaunch Assessment ($9.99) provides exceptional value. For leadership development, consider our Leadership Assessment ($34.99). For personal development, the CAIR+ Personality Assessment ($29.99) offers deep insights. I'd be happy to provide personalized recommendations based on your specific goals - what area of development interests you most?";
      } else if (hasKeyword(['science', 'research', 'valid', 'reliable', 'evidence', 'study'])) {
        aiResponse = "All AuthenCore Analytics assessments are built on rigorous scientific foundations with established validity and reliability. Our instruments utilize psychometrically sound methodologies, normative populations, and evidence-based frameworks. Each assessment undergoes continuous validation studies to ensure accuracy and meaningful insights for professional and personal development.";
      } else {
        // Intelligent contextual response based on message intent
        if (input.length > 50) {
          aiResponse = "Thank you for your detailed inquiry. AuthenCore Analytics specializes in comprehensive psychological assessment solutions that provide actionable insights for personal and professional development. Our scientifically-validated assessments range from career discovery to executive leadership evaluation. Could you share more about your specific development goals so I can provide targeted recommendations?";
        } else {
          aiResponse = "Welcome to AuthenCore Analytics - where we're 'Measuring Minds, Shaping Futures.' Our comprehensive assessment portfolio includes 10 scientifically-validated evaluations designed to unlock human potential. From career discovery ($9.99) to executive leadership assessment ($34.99), we provide insights that drive meaningful development. What specific area of growth interests you most?";
        }
      }

      // If AI model is loaded, try to use it for more sophisticated responses
      if (generatorRef.current && isModelLoaded) {
        try {
          console.log('🤖 Using AI model for enhanced response...');
          const contextPrompt = `You are a helpful assistant for AuthenCore Analytics. User asked: "${currentInput}". Respond helpfully about our assessments: ${aiResponse}`;
          
          const result = await generatorRef.current(contextPrompt, {
            max_new_tokens: 100,
            temperature: 0.7,
            do_sample: true,
            pad_token_id: 50256
          });
          
          // Try to extract AI response but fall back to rule-based if needed
          if (result && result[0] && result[0].generated_text) {
            const generated = result[0].generated_text;
            const responseStart = generated.indexOf('Respond helpfully') + 'Respond helpfully about our assessments: '.length;
            const aiGenerated = generated.substring(responseStart).trim();
            if (aiGenerated && aiGenerated.length > 10) {
              aiResponse = aiGenerated.split('\n')[0] || aiResponse;
            }
          }
        } catch (modelError) {
          console.log('📝 Using rule-based response (AI model failed)');
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('❌ Chat error:', error);
      
      // Fallback response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm here to help with questions about AuthenCore Analytics! Our assessments help you discover your potential. What would you like to know?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="bg-primary text-white rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AuthenCore Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary text-white ml-auto'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-1 opacity-70 ${
                            message.type === 'user' ? 'text-white' : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about AuthenCore..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChat;