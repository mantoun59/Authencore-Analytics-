import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  Mail, 
  Video, 
  MessageSquare, 
  Clock, 
  Users,
  Zap,
  AlertCircle
} from 'lucide-react';
import { CommunicationQuestion } from '@/data/communicationQuestions';

import type { AssessmentResponse } from '@/types/assessment.types';

interface SimulationComponentProps {
  question: CommunicationQuestion;
  onResponse: (response: AssessmentResponse) => void;
}

export const SimulationComponent: React.FC<SimulationComponentProps> = ({ question, onResponse }) => {
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showContextualInfo, setShowContextualInfo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResponseSelect = (option: { id: string; text: string; indicators: string[] }) => {
    setSelectedResponse(option.id);
    
    const assessmentResponse: AssessmentResponse = {
      questionId: question.id,
      answer: option.id,
      responseTime: timeElapsed,
      metadata: {
        selectedOption: option,
        totalTimeElapsed: timeElapsed
      }
    };
    
    // Add a small delay to show selection before moving on
    setTimeout(() => {
      onResponse(assessmentResponse);
    }, 500);
  };

  const getChannelIcon = (text: string) => {
    if (text.toLowerCase().includes('call') || text.toLowerCase().includes('phone')) {
      return <Phone className="h-4 w-4" />;
    }
    if (text.toLowerCase().includes('email')) {
      return <Mail className="h-4 w-4" />;
    }
    if (text.toLowerCase().includes('video')) {
      return <Video className="h-4 w-4" />;
    }
    if (text.toLowerCase().includes('message')) {
      return <MessageSquare className="h-4 w-4" />;
    }
    return <Zap className="h-4 w-4" />;
  };

  const getUrgencyLevel = (text: string) => {
    if (text.toLowerCase().includes('immediate') || text.toLowerCase().includes('urgent')) {
      return 'high';
    }
    if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('follow up')) {
      return 'medium';
    }
    return 'low';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Communication Simulation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm text-muted-foreground">
              {formatTime(timeElapsed)}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          Real-time communication scenario - choose your response approach
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Scenario Context */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">Scenario Context</span>
          </div>
          <p className="text-blue-800 dark:text-blue-200">{question.context}</p>
        </div>

        {/* Response Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Choose your response approach:</h4>
          
          <div className="grid gap-4">
            {question.options?.map((option, index) => {
              const urgencyLevel = getUrgencyLevel(option.text);
              const isSelected = selectedResponse === option.id;
              
              return (
                <Button
                  key={option.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full p-6 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-800 transition-all duration-200 ${
                    isSelected ? 'bg-blue-500 text-white' : ''
                  }`}
                  onClick={() => handleResponseSelect(option)}
                  disabled={selectedResponse !== null}
                >
                  <div className="flex items-start space-x-4 w-full">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-white text-blue-500' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      }`}>
                        {getChannelIcon(option.text)}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isSelected ? 'text-white' : ''}`}>
                          Option {option.id}
                        </span>
                        <Badge 
                          variant={urgencyLevel === 'high' ? 'destructive' : urgencyLevel === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {urgencyLevel === 'high' ? 'High Priority' : urgencyLevel === 'medium' ? 'Medium Priority' : 'Low Priority'}
                        </Badge>
                      </div>
                      
                      <p className={`text-sm ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                        {option.text}
                      </p>
                      
                      {/* Show indicators for selected option */}
                      {isSelected && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {option.indicators.map((indicator, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white">
                              {indicator.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Progress indication */}
        {selectedResponse && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300 font-medium">
                Processing your response...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};