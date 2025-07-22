import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Users, FileText, Zap, Target, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface EmployerOnboardingProps {
  employer: any;
  onComplete?: () => void;
}

export default function EmployerOnboarding({ employer, onComplete }: EmployerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to AuthenCore Analytics',
      description: 'Get started with our comprehensive assessment platform',
      icon: Building,
      completed: true,
    },
    {
      id: 'explore',
      title: 'Explore Sample Reports',
      description: 'See what insights your candidates will receive',
      icon: FileText,
      completed: false,
      action: () => navigate('/sample-reports'),
      actionLabel: 'View Sample Reports'
    },
    {
      id: 'invite',
      title: 'Invite Your First Candidate',
      description: 'Send assessment invitations to potential hires',
      icon: Users,
      completed: false,
      action: () => navigate('/invite-candidate'),
      actionLabel: 'Invite Candidate'
    },
    {
      id: 'setup',
      title: 'Customize Your Profile',
      description: 'Set up your organization preferences',
      icon: Target,
      completed: false,
      action: () => navigate('/employer-settings'),
      actionLabel: 'Customize Profile'
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const markStepCompleted = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

  const handleStepAction = (step: OnboardingStep) => {
    markStepCompleted(step.id);
    if (step.action) {
      step.action();
    }
  };

  const handleSkipOnboarding = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to AuthenCore Analytics!</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let's get you set up to start evaluating candidates with our comprehensive assessment platform. 
          Follow these steps to make the most of your experience.
        </p>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completedSteps} of {steps.length} steps completed
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step.id} className={`relative ${step.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md transition-shadow'}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {step.title}
                    {step.completed && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
                {step.action && !step.completed && (
                  <Button 
                    onClick={() => handleStepAction(step)}
                    className="ml-4"
                  >
                    {step.actionLabel}
                  </Button>
                )}
                {step.completed && (
                  <div className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Completed
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Quick Access Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Access Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/sample-reports')}
            >
              <FileText className="w-8 h-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Sample Reports</div>
                <div className="text-xs text-muted-foreground">Preview assessment outputs</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/invite-candidate')}
            >
              <Users className="w-8 h-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Invite Candidates</div>
                <div className="text-xs text-muted-foreground">Start assessing talent</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/employer-dashboard')}
            >
              <Target className="w-8 h-8 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Dashboard</div>
                <div className="text-xs text-muted-foreground">Track progress</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleSkipOnboarding}>
          Skip for now
        </Button>
        <div className="flex gap-2">
          {completedSteps === steps.length ? (
            <Button onClick={handleSkipOnboarding} size="lg">
              Get Started
            </Button>
          ) : (
            <Button variant="outline" onClick={handleSkipOnboarding}>
              Complete Later
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}