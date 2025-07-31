import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Intelligent response generator with context awareness
const generateIntelligentResponse = (input: string, conversationLength: number): string => {
  const lowercaseInput = input.toLowerCase().trim();
  
  // Simple greeting detection
  const simpleGreetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
  const isSimpleGreeting = simpleGreetings.some(greeting => 
    lowercaseInput === greeting || lowercaseInput === greeting + '!'
  );
  
  if (isSimpleGreeting) {
    const greetingResponses = [
      "Hi there! I'm AuthenBot. How can I help you with your professional development today?",
      "Hello! I'm here to guide you through our assessment portfolio. What interests you?",
      "Hey! Ready to explore your potential? What would you like to know about our assessments?",
      "Hi! I'm AuthenBot, your professional development assistant. What can I help you discover?"
    ];
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
  }
  
  // Short questions or single words
  if (lowercaseInput.length < 15 && !lowercaseInput.includes('?')) {
    if (lowercaseInput.includes('help')) {
      return "I'm here to help! Ask me about our assessments, career guidance, or professional development. What specific area interests you?";
    }
    if (lowercaseInput.includes('thanks') || lowercaseInput.includes('thank you')) {
      return "You're welcome! Is there anything else I can help you with regarding your professional development?";
    }
  }
  
  const hasKeyword = (keywords: string[]) => keywords.some(keyword => lowercaseInput.includes(keyword));
  
  // Enhanced keyword detection for assessments with intelligent length
  if (hasKeyword(['career', 'job', 'work', 'profession', 'future', 'path', 'direction'])) {
    if (hasKeyword(['price', 'cost', 'pricing', '$', 'money', 'fee'])) {
      return "The CareerLaunch Assessment is $9.99 - our most comprehensive career discovery tool with 144 questions analyzing your interests, aptitudes, personality, and values.";
    }
    return "Our CareerLaunch Assessment ($9.99) helps you discover your ideal career path through comprehensive analysis. Perfect for students, career changers, and anyone seeking professional clarity.";
  }
  
  if (hasKeyword(['personality', 'traits', 'character', 'behavior', 'psychology'])) {
    return "The CAIR+ Personality Assessment ($29.99) provides advanced psychological evaluation with validity detection technology for deep personality insights.";
  }
  
  if (hasKeyword(['leadership', 'manager', 'executive', 'lead', 'management', 'boss'])) {
    return "Our Authentic Leadership Assessment ($34.99) evaluates your leadership style and provides strategies for authentic leadership development.";
  }
  
  if (hasKeyword(['communication', 'speaking', 'talking', 'presentation', 'interpersonal'])) {
    return "The Communication Styles Assessment ($14.99) analyzes how you communicate and helps improve your professional relationships and team dynamics.";
  }
  
  if (hasKeyword(['emotional', 'emotion', 'eq', 'feelings', 'empathy'])) {
    return "Our Emotional Intelligence Assessment ($24.99) measures your ability to understand and manage emotions - crucial for leadership and teamwork.";
  }
  
  if (hasKeyword(['values', 'beliefs', 'faith', 'meaning', 'purpose'])) {
    return "The Faith & Values Assessment ($19.99) helps you understand your core values and how they influence your decision-making.";
  }
  
  if (hasKeyword(['stress', 'pressure', 'burnout', 'resilience', 'coping'])) {
    return "Our Stress & Resilience Assessment ($19.99) evaluates how you handle pressure and provides strategies for building resilience.";
  }
  
  if (hasKeyword(['culture', 'cultural', 'diversity', 'international', 'global'])) {
    return "The Cultural Intelligence Assessment ($24.99) measures your ability to work effectively across cultures in our globalized workplace.";
  }
  
  if (hasKeyword(['digital', 'technology', 'online', 'screen', 'wellness'])) {
    return "Our Digital Wellness Assessment ($14.99) evaluates your relationship with technology and provides strategies for healthy digital habits.";
  }
  
  if (hasKeyword(['genz', 'gen z', 'generation', 'young', 'workplace', 'millennial'])) {
    return "The Gen Z Workplace Assessment ($19.99) analyzes next-generation workplace dynamics and what younger generations value in careers.";
  }
  
  if (hasKeyword(['price', 'cost', 'pricing', 'expensive', 'cheap', 'budget', '$', 'money', 'fee'])) {
    return "Our assessments range from $9.99 to $34.99. The CareerLaunch Assessment ($9.99) offers exceptional value for comprehensive career exploration.";
  }
  
  if (hasKeyword(['help', 'support', 'guidance', 'assistance', 'confused', 'unsure'])) {
    return "I'm here to guide you through our scientifically-validated assessment portfolio. What specific area of growth or challenge interests you?";
  }
  
  if (hasKeyword(['report', 'results', 'interpretation', 'analysis', 'feedback'])) {
    return "All our assessments provide detailed reports with actionable insights, strengths analysis, growth areas, and specific development recommendations.";
  }
  
  if (hasKeyword(['accuracy', 'valid', 'reliable', 'scientific', 'research'])) {
    return "AuthenCore maintains the highest psychometric standards with scientifically validated assessments and advanced validity detection for reliable results.";
  }
  
  // Default intelligent welcome based on conversation length
  if (conversationLength <= 2) {
    return "I'm AuthenBot, your professional development assistant at AuthenCore Analytics. What area of growth interests you most?";
  }
  
  return "I can help with assessment selection, career guidance, or professional development strategies. What specific question do you have?";
};

const AIChat = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm AuthenBot, your professional development assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [conversationStarted, setConversationStarted] = useState(false);
  
  // Simple, reliable close function
  const closeChat = useCallback(() => {
    console.log('Closing chat...');
    setIsOpen(false);
  }, []);
  
  // Simple toggle function
  const toggleChat = useCallback(() => {
    console.log('Toggling chat, current state:', isOpen);
    setIsOpen(prev => !prev);
  }, [isOpen]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Performance optimization: Limit message history
  const MAX_MESSAGES = 20;
  
  const cleanupMessages = useCallback((currentMessages: Message[]) => {
    if (currentMessages.length > MAX_MESSAGES) {
      return [
        currentMessages[0], // Keep welcome message
        ...currentMessages.slice(-(MAX_MESSAGES - 1))
      ];
    }
    return currentMessages;
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      const scrollTimeout = requestAnimationFrame(() => {
        scrollToBottom();
      });
      return () => cancelAnimationFrame(scrollTimeout);
    }
  }, [messages.length, scrollToBottom]);

  // Enhanced sendMessage function with professional AI integration and timeout protection
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => cleanupMessages([...prev, userMessage]));
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    if (!conversationStarted) {
      setConversationStarted(true);
    }

    try {
      // Generate intelligent response based on context
      let aiResponse = generateIntelligentResponse(currentInput, messages.length);
      let usesFallback = true;

      try {
        // Enhanced conversation history for better context
        const conversationHistory = messages.slice(-4).map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        }));

        // Add timeout to prevent stalling
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 25000); // 25 second timeout
        });

        const apiPromise = supabase.functions.invoke('ai-chatbot', {
          body: { 
            message: currentInput,
            conversationHistory,
            sessionId
          }
        });

        const { data, error } = await Promise.race([apiPromise, timeoutPromise]) as any;

        if (data && data.response && !error) {
          aiResponse = data.response;
          usesFallback = false;
          console.log('AI response received successfully');
        } else if (error) {
          console.error('Edge function error:', error);
          // Don't throw error, let it fall back to intelligent response
        } else if (data && !data.success) {
          console.log('Edge function returned fallback, using intelligent response instead');
          // Don't use the API fallback, use our intelligent response
        }
      } catch (edgeFunctionError) {
        console.log('Using fallback response system due to:', edgeFunctionError?.message || 'API error');
        
        // Show user-friendly message for timeout
        if (edgeFunctionError?.message?.includes('timeout')) {
          toast({
            title: "Response Delay",
            description: "AI is taking longer than usual. Using quick response mode.",
            variant: "default",
          });
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => cleanupMessages([...prev, assistantMessage]));

      // Show privacy notice on first interaction
      if (!conversationStarted) {
        setTimeout(() => {
          const privacyMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'system',
            content: "🔒 Privacy Notice: This conversation is confidential and designed to help you with assessment questions and professional guidance. Your data is handled securely according to our privacy policy.",
            timestamp: new Date()
          };
          setMessages(prev => cleanupMessages([...prev, privacyMessage]));
        }, 1500);
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      // Show appropriate error message
      let errorContent = "I apologize for the technical difficulty. I'm still here to help with questions about AuthenCore Analytics, our assessments, and your professional development. Please try your question again, and I'll do my best to assist you.";
      
      if (error?.message?.includes('timeout')) {
        errorContent = "The response is taking longer than expected. Let me provide you with immediate assistance using our professional knowledge base. Please feel free to rephrase your question if needed.";
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };

      setMessages(prev => cleanupMessages([...prev, errorMessage]));
      
      toast({
        title: "Connection Issue",
        description: "Switched to offline mode. Functionality continues normally.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, messages, sessionId, conversationStarted, cleanupMessages]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const formatTime = useMemo(() => (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'assistant':
        return <Bot className="h-4 w-4 text-primary" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'system':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-primary text-white ml-auto';
      case 'system':
        return 'bg-blue-50 border border-blue-200 text-blue-800 text-sm';
      default:
        return 'bg-muted text-foreground';
    }
  };

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-primary hover:bg-primary/90 shadow-lg z-50 transition-all duration-300 hover:scale-105"
        size="icon"
        aria-label={isOpen ? "Close AuthenBot chat" : "Open AuthenBot chat"}
        type="button"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!conversationStarted && !isOpen && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </Button>

      {/* Enhanced Chat Window with proper event handling */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-96 h-[600px] z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full h-full shadow-2xl flex flex-col border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-glow text-white rounded-t-lg py-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6" />
                <div>
                  <div>AuthenBot</div>
                  <div className="text-xs font-normal opacity-90">Professional Assessment Assistant</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeChat}
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full flex-shrink-0"
                aria-label="Close chat"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
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
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${getMessageStyle(message.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getMessageIcon(message.type)}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 opacity-60" />
                            <p className={`text-xs opacity-70 ${
                              message.type === 'user' ? 'text-white' : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3 max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <Bot className="h-4 w-4 text-primary" />
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AuthenBot is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about assessments, career guidance, or professional development..."
                  disabled={isLoading}
                  className="flex-1 border-primary/20 focus:border-primary"
                  maxLength={500}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by AuthenCore Analytics • Professional Assessment Guidance
              </p>
            </div>
          </CardContent>
          </Card>
        </div>
      )}
    </>
  );
});

AIChat.displayName = 'AIChat';

export default AIChat;