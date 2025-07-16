import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Send } from 'lucide-react';
import { CommunicationQuestion } from '@/data/communicationQuestions';

interface WrittenResponseComponentProps {
  question: CommunicationQuestion;
  onResponse: (response: string) => void;
}

export const WrittenResponseComponent: React.FC<WrittenResponseComponentProps> = ({ question, onResponse }) => {
  const [response, setResponse] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(question.timeLimit || 300);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimeUp(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (response.trim()) {
      onResponse(response);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timePercentage = ((question.timeLimit || 300) - timeRemaining) / (question.timeLimit || 300) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Written Response</span>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeRemaining < 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          {question.writtenPrompt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Progress value={timePercentage} className="h-2" />
        
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response here..."
          className="min-h-[200px] resize-none"
          disabled={isTimeUp}
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Words: {response.split(' ').filter(word => word.length > 0).length}
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!response.trim() || isTimeUp}
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>{isTimeUp ? 'Time Up' : 'Submit Response'}</span>
          </Button>
        </div>
        
        {isTimeUp && (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Time's up! Please submit your response or it will be automatically submitted.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};