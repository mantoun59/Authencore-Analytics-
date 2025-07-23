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
        if (!generatorRef.current) {
          generatorRef.current = await pipeline(
            'text-generation',
            'Xenova/gpt2',
            { device: 'webgpu' }
          );
          setIsModelLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load model:', error);
        toast({
          title: "Model Loading Error",
          description: "Failed to load AI model. Please refresh the page.",
          variant: "destructive"
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
    if (!inputMessage.trim() || isLoading || !isModelLoaded) return;

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
      if (!generatorRef.current) {
        throw new Error('AI model not loaded');
      }

      // Create context prompt about AuthenCore Analytics
      const contextPrompt = `You are a helpful assistant for AuthenCore Analytics, a professional psychological assessment platform. Our mission is "Measuring Minds. Shaping Futures." We provide scientifically validated tests for individuals and organizations including:

1. CareerLaunch Assessment ($9.99) - Career discovery assessment
2. CAIR+ Personality Assessment ($29.99) - Comprehensive personality assessment  
3. Stress Resilience Assessment ($19.99) - Stress and adaptability assessment
4. Cultural Intelligence Assessment ($19.99) - Global cultural intelligence
5. Communication Styles Assessment ($24.99) - Communication assessment
6. Emotional Intelligence Assessment ($24.99) - EQ assessment
7. Leadership Assessment ($34.99) - Executive leadership assessment
8. Digital Wellness Assessment ($14.99) - Digital wellness assessment
9. Faith & Values Assessment ($19.99) - Personal values assessment
10. Gen Z Workplace Assessment ($16.99) - Generational workplace assessment

User: ${currentInput}
Assistant:`;

      // Generate response using the local model
      const result = await generatorRef.current(contextPrompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 50256
      });

      let aiResponse = result[0].generated_text;
      
      // Extract only the assistant's response
      const assistantStart = aiResponse.indexOf('Assistant:');
      if (assistantStart !== -1) {
        aiResponse = aiResponse.substring(assistantStart + 10).trim();
      } else {
        // Fallback: take everything after the user input
        const userEnd = aiResponse.indexOf(currentInput) + currentInput.length;
        aiResponse = aiResponse.substring(userEnd).trim();
      }

      // Clean up the response
      aiResponse = aiResponse.split('\n')[0] || "I'm here to help with questions about AuthenCore Analytics!";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI generation error:', error);
      
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