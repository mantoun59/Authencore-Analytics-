import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Target, Users, Brain, Star } from 'lucide-react';

interface EnhancedProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  estimatedTime: number; // in minutes
  timeSpent: number; // in minutes
  currentCategory?: string;
  questionsPerCategory?: Record<string, number>;
}

export default function EnhancedProgressIndicator({
  currentQuestion,
  totalQuestions,
  estimatedTime,
  timeSpent,
  currentCategory,
  questionsPerCategory
}: EnhancedProgressIndicatorProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const timeRemaining = Math.max(0, estimatedTime - timeSpent);
  const isOnTrack = timeSpent <= (currentQuestion / totalQuestions) * estimatedTime * 1.2;

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'riasec':
      case 'interest': return <Target className="h-4 w-4" />;
      case 'aptitude': return <Brain className="h-4 w-4" />;
      case 'personality': return <Users className="h-4 w-4" />;
      case 'values':
      case 'value': return <Star className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return "< 1 min";
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {currentCategory && (
              <div className="flex items-center gap-1 text-primary">
                {getCategoryIcon(currentCategory)}
                <span className="capitalize font-medium">{currentCategory}</span>
              </div>
            )}
          </div>
          <span className="text-muted-foreground">
            {currentQuestion} of {totalQuestions} questions
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}% complete</span>
          <span>
            {totalQuestions - currentQuestion} remaining
          </span>
        </div>
      </div>

      {/* Time Tracking */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Time spent: {formatTime(timeSpent)}</span>
          </div>
          <Badge variant={isOnTrack ? "default" : "secondary"} className="text-xs">
            {isOnTrack ? "On track" : "Take your time"}
          </Badge>
        </div>
        <div className="text-muted-foreground">
          Est. {formatTime(timeRemaining)} remaining
        </div>
      </div>

      {/* Category Progress (if available) */}
      {questionsPerCategory && Object.keys(questionsPerCategory).length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t">
          {Object.entries(questionsPerCategory).map(([category, count]) => {
            const categoryCompleted = currentCategory === category ? 
              Math.min(currentQuestion, count) : 
              (Object.keys(questionsPerCategory).indexOf(category) < Object.keys(questionsPerCategory).indexOf(currentCategory || '') ? count : 0);
            const categoryProgress = (categoryCompleted / count) * 100;
            
            return (
              <div key={category} className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  {getCategoryIcon(category)}
                  <span className="capitalize truncate">{category}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Progress value={categoryProgress} className="h-1" />
                </div>
                <span className="text-muted-foreground">
                  {categoryCompleted}/{count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}