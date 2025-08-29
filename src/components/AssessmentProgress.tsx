import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target,
  TrendingUp
} from 'lucide-react';

interface AssessmentProgressProps {
  currentPhase: number;
  totalPhases: number;
  currentQuestion: number;
  totalQuestions: number;
  assessmentType: string;
  timeElapsed?: number;
  estimatedTimeRemaining?: number;
}

interface PhaseInfo {
  name: string;
  description: string;
  questions: number;
}

const getPhaseInformation = (assessmentType: string): PhaseInfo[] => {
  switch (assessmentType) {
    case 'career-launch':
      return [
        { name: 'Career Interests', description: 'Exploring your professional interests', questions: 15 },
        { name: 'Skills Assessment', description: 'Evaluating your current abilities', questions: 20 },
        { name: 'Values & Goals', description: 'Understanding your core values', questions: 12 },
        { name: 'Work Preferences', description: 'Identifying ideal work environment', questions: 18 }
      ];
    case 'faith-values':
      return [
        { name: 'Core Beliefs', description: 'Exploring fundamental beliefs', questions: 25 },
        { name: 'Value Systems', description: 'Understanding value priorities', questions: 20 },
        { name: 'Life Purpose', description: 'Discovering purpose and meaning', questions: 15 },
        { name: 'Integration', description: 'Applying values to daily life', questions: 20 }
      ];
    case 'cair-personality':
      return [
        { name: 'Conscientiousness', description: 'Assessing organization and discipline', questions: 16 },
        { name: 'Agreeableness', description: 'Measuring interpersonal tendencies', questions: 16 },
        { name: 'Innovation', description: 'Evaluating creativity and openness', questions: 16 },
        { name: 'Resilience', description: 'Testing stress management abilities', questions: 17 }
      ];
    default:
      return [
        { name: 'Assessment', description: 'Completing evaluation', questions: 50 }
      ];
  }
};

export default function AssessmentProgress({
  currentPhase,
  totalPhases,
  currentQuestion,
  totalQuestions,
  assessmentType,
  timeElapsed = 0,
  estimatedTimeRemaining = 0
}: AssessmentProgressProps) {
  const phases = getPhaseInformation(assessmentType);
  const overallProgress = ((currentQuestion - 1) / totalQuestions) * 100;
  
  // Calculate current phase progress
  let questionsBeforeCurrentPhase = 0;
  for (let i = 0; i < Math.max(0, currentPhase - 1); i++) {
    if (phases[i]) {
      questionsBeforeCurrentPhase += phases[i].questions;
    }
  }
  
  const currentPhaseInfo = phases[currentPhase - 1];
  const questionsInCurrentPhase = currentPhaseInfo?.questions || 1;
  const currentQuestionInPhase = currentQuestion - questionsBeforeCurrentPhase;
  const phaseProgress = (currentQuestionInPhase / questionsInCurrentPhase) * 100;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Assessment Progress</h3>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion} of {totalQuestions}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {Math.round(overallProgress)}%
            </Badge>
          </div>
          
          <Progress 
            value={overallProgress} 
            className="h-3"
          />
          
          {/* Time Information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Time elapsed: {formatTime(timeElapsed)}</span>
            </div>
            {estimatedTimeRemaining > 0 && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Est. remaining: {formatTime(estimatedTimeRemaining)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Phase Progress */}
      {phases.length > 1 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Current Phase</h4>
                <p className="text-sm text-muted-foreground">
                  {currentPhaseInfo?.name || `Phase ${currentPhase}`}
                </p>
              </div>
              <Badge variant="outline">
                Phase {currentPhase} of {totalPhases}
              </Badge>
            </div>
            
            {currentPhaseInfo && (
              <>
                <p className="text-sm text-muted-foreground">
                  {currentPhaseInfo.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Phase Progress</span>
                    <span>{Math.round(phaseProgress)}%</span>
                  </div>
                  <Progress value={phaseProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Question {currentQuestionInPhase} of {questionsInCurrentPhase} in this phase
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Phase Overview */}
      {phases.length > 1 && (
        <Card className="p-6">
          <h4 className="font-medium mb-4">Phase Overview</h4>
          <div className="space-y-3">
            {phases.map((phase, index) => {
              const phaseNumber = index + 1;
              const isCompleted = phaseNumber < currentPhase;
              const isCurrent = phaseNumber === currentPhase;
              const isUpcoming = phaseNumber > currentPhase;
              
              return (
                <div 
                  key={phaseNumber}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isCurrent ? 'bg-primary/10 border border-primary/20' : 
                    isCompleted ? 'bg-green-50 border border-green-200' : 
                    'bg-muted/50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 text-primary-foreground" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${
                        isCurrent ? 'text-primary' : 
                        isCompleted ? 'text-green-700' : 
                        'text-muted-foreground'
                      }`}>
                        {phase.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {phase.questions} questions
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {phase.description}
                    </p>
                    
                    {isCurrent && (
                      <div className="mt-2">
                        <Progress value={phaseProgress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}