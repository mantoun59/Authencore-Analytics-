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
      
      // Simple rule-based responses for immediate functionality
      const input = currentInput.toLowerCase();
      
      if (input.includes('price') || input.includes('cost') || input.includes('$')) {
        aiResponse = "Our assessments range from $9.99 to $34.99. The CareerLaunch Assessment at $9.99 is our most popular and comprehensive option, covering 18 dimensions of career discovery.";
      } else if (input.includes('career') || input.includes('job') || input.includes('work')) {
        aiResponse = "Our CareerLaunch Assessment ($9.99) is perfect for career discovery! It analyzes your interests, aptitudes, personality, and values across 18 dimensions to help you find the right career path.";
      } else if (input.includes('personality')) {
        aiResponse = "Our CAIR+ Personality Assessment ($29.99) is a comprehensive personality evaluation with advanced validity detection and percentile scoring. It provides deep insights into your personality traits.";
      } else if (input.includes('stress') || input.includes('resilience')) {
        aiResponse = "The Stress Resilience Assessment ($19.99) measures your ability to handle stress and adapt to challenges. It includes 60 questions with biometric simulation for accurate results.";
      } else if (input.includes('communication')) {
        aiResponse = "Our Communication Styles Assessment ($24.99) analyzes how you communicate with others using 80 questions and linguistic analysis. Perfect for improving workplace relationships.";
      } else if (input.includes('leadership') || input.includes('manager')) {
        aiResponse = "The Leadership Assessment ($34.99) is our premium executive evaluation with 90 questions and 360-degree feedback capabilities. Ideal for current and aspiring leaders.";
      } else if (input.includes('emotional') || input.includes('eq')) {
        aiResponse = "Our Emotional Intelligence Assessment ($24.99) measures your EQ across multiple dimensions with 65 specialized questions. Great for personal and professional development.";
      } else if (input.includes('digital') || input.includes('wellness') || input.includes('screen')) {
        aiResponse = "The Digital Wellness Assessment ($14.99) helps you understand your digital habits and find balance. It includes 55 questions with habit tracking features.";
      } else if (input.includes('cultural') || input.includes('diversity')) {
        aiResponse = "Our Cultural Intelligence Assessment ($19.99) evaluates your ability to work across cultures using 60+ real-world scenarios across 4 CQ dimensions.";
      } else if (input.includes('values') || input.includes('faith')) {
        aiResponse = "The Faith & Values Assessment ($19.99) explores your core values and beliefs with 70 thoughtful questions to help align your life and career choices.";
      } else if (input.includes('gen z') || input.includes('generation') || input.includes('workplace')) {
        aiResponse = "Our Gen Z Workplace Assessment ($16.99) focuses on generational workplace dynamics with 50 targeted questions about modern work preferences and styles.";
      } else if (input.includes('help') || input.includes('support') || input.includes('question')) {
        aiResponse = "I'm here to help! You can ask me about our assessments, pricing, what each test measures, or how they can benefit you. What specific information would you like to know?";
      } else {
        aiResponse = "Thanks for your question! AuthenCore Analytics offers 10 professional psychological assessments ranging from $9.99 to $34.99. Would you like to know more about a specific assessment or our pricing?";
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