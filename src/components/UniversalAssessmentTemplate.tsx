import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Clock, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AssessmentQuestion {
  id: string;
  text: string;
  options: string[];
  category?: string;
  required?: boolean;
}

interface AssessmentConfig {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  duration: string;
  questionCount: number;
  color: string;
  questions: AssessmentQuestion[];
}

interface UserProfile {
  name: string;
  email: string;
  [key: string]: any;
}

interface UniversalAssessmentProps {
  config: AssessmentConfig;
  onComplete: (results: any) => void;
  userProfile?: UserProfile;
  enableBackButton?: boolean;
  enableRestart?: boolean;
  validationEnabled?: boolean;
  saveProgressEnabled?: boolean;
}

type AssessmentPhase = 'welcome' | 'registration' | 'instructions' | 'assessment' | 'confirmation';

const UniversalAssessmentTemplate: React.FC<UniversalAssessmentProps> = ({
  config,
  onComplete,
  userProfile: initialUserProfile,
  enableBackButton = true,
  enableRestart = true,
  validationEnabled = true,
  saveProgressEnabled = true
}) => {
  const { toast } = useToast();
  const [phase, setPhase] = useState<AssessmentPhase>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [userProfile, setUserProfile] = useState<UserProfile>(
    initialUserProfile || { name: '', email: '' }
  );
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const currentQuestion = config.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / config.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1;

  // Auto-save progress
  useEffect(() => {
    if (saveProgressEnabled && phase === 'assessment' && Object.keys(responses).length > 0) {
      const saveData = {
        phase,
        currentQuestionIndex,
        responses,
        userProfile,
        timestamp: Date.now()
      };
      localStorage.setItem(`assessment_${config.title}_progress`, JSON.stringify(saveData));
      setLastSaved(new Date());
    }
  }, [currentQuestionIndex, responses, phase, saveProgressEnabled, config.title, userProfile]);

  // Load saved progress
  useEffect(() => {
    if (saveProgressEnabled) {
      const saved = localStorage.getItem(`assessment_${config.title}_progress`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.timestamp && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
            setPhase(data.phase);
            setCurrentQuestionIndex(data.currentQuestionIndex);
            setResponses(data.responses);
            setUserProfile(data.userProfile);
            toast({
              title: "Progress Restored",
              description: "Your previous progress has been restored.",
            });
          }
        } catch (error) {
          console.error('Error loading saved progress:', error);
        }
      }
    }
  }, [saveProgressEnabled, config.title, toast]);

  const validateCurrentQuestion = (): boolean => {
    if (!validationEnabled) return true;
    
    const questionId = currentQuestion.id;
    const answer = responses[questionId];
    
    if (currentQuestion.required && (!answer || answer.trim() === '')) {
      setValidationErrors([`Please answer this required question before continuing.`]);
      return false;
    }
    
    setValidationErrors([]);
    return true;
  };

  const validateUserProfile = (): boolean => {
    if (!validationEnabled) return true;
    
    const errors: string[] = [];
    if (!userProfile.name?.trim()) errors.push('Name is required');
    if (!userProfile.email?.trim()) errors.push('Email is required');
    if (userProfile.email && !/\S+@\S+\.\S+/.test(userProfile.email)) {
      errors.push('Please enter a valid email address');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleResponse = (questionId: string, value: string) => {
    const responseTime = Date.now() - questionStartTime;
    setResponses(prev => ({ ...prev, [questionId]: value }));
    setResponseTimes(prev => [...prev, responseTime]);
    setValidationErrors([]);
  };

  const goToNext = () => {
    if (!validateCurrentQuestion()) return;
    
    if (isLastQuestion) {
      setPhase('confirmation');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;
    
    setIsSubmitting(true);
    
    try {
      const results = {
        responses,
        userProfile,
        metadata: {
          startTime,
          completionTime: Date.now() - startTime,
          responseTimes,
          totalQuestions: config.questions.length,
          assessmentType: config.title
        }
      };
      
      // Clear saved progress
      if (saveProgressEnabled) {
        localStorage.removeItem(`assessment_${config.title}_progress`);
      }
      
      await onComplete(results);
      
      toast({
        title: "Assessment Complete!",
        description: "Your responses have been recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartAssessment = () => {
    setPhase('welcome');
    setCurrentQuestionIndex(0);
    setResponses({});
    setValidationErrors([]);
    setStartTime(0);
    setResponseTimes([]);
    if (saveProgressEnabled) {
      localStorage.removeItem(`assessment_${config.title}_progress`);
    }
  };

  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center`}>
                  <config.icon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">
                  {config.title}
                </CardTitle>
                <CardDescription className="text-lg">
                  {config.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">{config.duration}</h3>
                    <p className="text-sm text-muted-foreground">Estimated time</p>
                  </div>
                  <div className="text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">{config.questionCount} Questions</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive assessment</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Save className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">Auto-Save</h3>
                    <p className="text-sm text-muted-foreground">Progress saved automatically</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      setPhase('registration');
                      setStartTime(Date.now());
                      setQuestionStartTime(Date.now());
                    }}
                    className="text-lg px-8 py-6"
                  >
                    Begin Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (phase === 'registration' && !initialUserProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Registration</CardTitle>
                <CardDescription>
                  Please provide your information to personalize your assessment experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {validationErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setPhase('welcome')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      if (validateUserProfile()) {
                        setPhase('instructions');
                      }
                    }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (phase === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Instructions</CardTitle>
                <CardDescription>
                  Please read these instructions carefully before starting the assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-primary/5 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">How to Complete This Assessment:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                        Read each question carefully and honestly
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                        Select the response that best represents your view
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                        There are no right or wrong answers
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                        Your progress is automatically saved
                      </li>
                      {enableBackButton && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                          You can go back to previous questions if needed
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setPhase('registration')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => setPhase('assessment')}
                    className="text-lg px-8 py-6"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (phase === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">
                      Question {currentQuestionIndex + 1} of {config.questions.length}
                    </CardTitle>
                    {currentQuestion.category && (
                      <Badge variant="secondary" className="mt-2">
                        {currentQuestion.category}
                      </Badge>
                    )}
                  </div>
                  {lastSaved && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                <Progress value={progress} className="mt-4" />
              </CardHeader>
              
              <CardContent className="space-y-6">
                {validationErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {validationErrors[0]}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-relaxed">
                    {currentQuestion.text}
                    {currentQuestion.required && <span className="text-destructive ml-1">*</span>}
                  </h3>
                  
                  <RadioGroup
                    value={responses[currentQuestion.id] || ''}
                    onValueChange={(value) => handleResponse(currentQuestion.id, value)}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 cursor-pointer font-normal"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between pt-6">
                  <div className="flex gap-2">
                    {enableBackButton && (
                      <Button
                        variant="outline"
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    {enableRestart && (
                      <Button
                        variant="outline"
                        onClick={restartAssessment}
                        className="text-destructive hover:text-destructive"
                      >
                        Restart
                      </Button>
                    )}
                  </div>
                  
                  <Button onClick={goToNext}>
                    {isLastQuestion ? 'Complete Assessment' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (phase === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <CardTitle className="text-2xl font-bold">Assessment Complete!</CardTitle>
                <CardDescription>
                  Please review your information before submitting your final results.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Assessment Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <div className="font-medium">{userProfile.name}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <div className="font-medium">{userProfile.email}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Questions Answered:</span>
                        <div className="font-medium">{Object.keys(responses).length} of {config.questions.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completion Time:</span>
                        <div className="font-medium">{Math.round((Date.now() - startTime) / 60000)} minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setPhase('assessment')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Review Answers
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

export default UniversalAssessmentTemplate;