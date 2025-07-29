import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Optimized response generator - moved outside component to prevent recreation
const generateResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Simplified keyword detection for better performance
  const hasKeyword = (keywords: string[]) => keywords.some(keyword => lowercaseInput.includes(keyword));
  
  // Streamlined response logic
  if (hasKeyword(['price', 'cost', 'pricing', 'expensive', 'cheap', 'budget', '$', 'money'])) {
    if (hasKeyword(['career', 'job', 'work', 'profession'])) {
      return "For career exploration, I recommend our CareerLaunch Assessment at $9.99 - it's our most comprehensive career discovery tool with exceptional value.";
    } else if (hasKeyword(['leadership', 'manager', 'executive', 'management'])) {
      return "The Authentic Leadership Assessment at $34.99 is our executive-level evaluation designed for current and aspiring leaders.";
    } else {
      return "Our assessment portfolio ranges from $9.99 to $34.99, strategically priced for maximum accessibility while maintaining scientific rigor.";
    }
  } else if (hasKeyword(['career', 'job', 'work', 'profession'])) {
    return "The CareerLaunch Assessment ($9.99) is our flagship career discovery tool, utilizing 144 carefully crafted questions to evaluate interests, aptitudes, personality, and values.";
  } else if (hasKeyword(['personality', 'traits', 'character'])) {
    return "Our CAIR+ Personality Assessment ($29.99) represents advanced psychological evaluation with cutting-edge validity detection technology.";
  } else if (hasKeyword(['help', 'support', 'guidance', 'assistance'])) {
    return "I'm here to provide expert guidance on our comprehensive assessment portfolio. What specific area of development interests you most?";
  } else {
    return "Welcome to AuthenCore Analytics - where we're 'Measuring Minds, Shaping Futures.' Our comprehensive assessment portfolio includes scientifically-validated evaluations. What specific area of growth interests you most?";
  }
};

const AIChat = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm here to help you with any questions about AuthenCore Analytics, our assessments, pricing, or anything else. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Performance optimization: Limit message history to prevent large DOM
  const MAX_MESSAGES = 20;
  
  // Function to cleanup old messages
  const cleanupMessages = useCallback((currentMessages: Message[]) => {
    if (currentMessages.length > MAX_MESSAGES) {
      // Keep the first message (greeting) and the latest messages
      return [
        currentMessages[0], // Keep greeting
        ...currentMessages.slice(-(MAX_MESSAGES - 1)) // Keep recent messages
      ];
    }
    return currentMessages;
  }, []);

  // Memoized scroll function to prevent unnecessary recreations
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Optimized effect with proper cleanup and performance monitoring
  useEffect(() => {
    if (messages.length > 1) { // Only scroll for new messages
      // Use requestAnimationFrame for better performance
      const scrollTimeout = requestAnimationFrame(() => {
        scrollToBottom();
      });
      
      return () => cancelAnimationFrame(scrollTimeout);
    }
  }, [messages.length, scrollToBottom]);

  // Optimized sendMessage function using memoization
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

    try {
      // Use optimized response generator
      let aiResponse = generateResponse(currentInput);

      // Try to use Supabase edge function for more sophisticated responses (with timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const { data, error } = await supabase.functions.invoke('ai-chatbot', {
          body: { 
            message: currentInput,
            conversationHistory: messages.slice(-2).map(m => ({ // Reduced history for performance
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content
            }))
          }
        });

        clearTimeout(timeoutId);
        
        if (data && data.response && !error) {
          aiResponse = data.response;
        }
      } catch (edgeFunctionError) {
        // Fall back to optimized rule-based response
        console.log('Using fallback response');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => cleanupMessages([...prev, assistantMessage]));
    } catch (error) {
      // Fallback response with error handling
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm here to help with questions about AuthenCore Analytics! Our assessments help you discover your potential. What would you like to know?",
        timestamp: new Date()
      };

      setMessages(prev => cleanupMessages([...prev, assistantMessage]));
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, messages]);

  // Memoized handlers for better performance
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Memoized time formatter
  const formatTime = useMemo(() => (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

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
});

AIChat.displayName = 'AIChat';

export default AIChat;