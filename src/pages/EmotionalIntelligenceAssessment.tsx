import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ApplicantDataForm from '@/components/ApplicantDataForm';
import { emotionalIntelligenceQuestions, dimensionNames } from '@/data/emotionalIntelligenceQuestions';
import { useEmotionalIntelligenceScoring, EmotionalIntelligenceResult } from '@/hooks/useEmotionalIntelligenceScoring';
import { ChevronLeft, ChevronRight, Download, RotateCcw } from 'lucide-react';
import AssessmentResults from '@/components/AssessmentResults';

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  currentPosition: string;
  company: string;
  assessmentType: string;
  additionalInfo: string;
}

const EmotionalIntelligenceAssessment = () => {
  const [currentStep, setCurrentStep] = useState<'info' | 'assessment' | 'results'>('info');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>(new Array(60).fill(0));
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const { toast } = useToast();
  const { result, isCalculating, calculateScores, reset } = useEmotionalIntelligenceScoring();

  const progress = ((currentQuestion + 1) / emotionalIntelligenceQuestions.length) * 100;
  const currentQuestionData = emotionalIntelligenceQuestions[currentQuestion];

  useEffect(() => {
    if (currentQuestionData && responses[currentQuestion] > 0) {
      setCurrentResponse(responses[currentQuestion].toString());
    } else {
      setCurrentResponse('');
    }
  }, [currentQuestion, responses, currentQuestionData]);

  const handleUserDataSubmit = (data: UserData) => {
    setUserData(data);
    setCurrentStep('assessment');
  };

  const handleResponseChange = (value: string) => {
    setCurrentResponse(value);
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (!currentResponse) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < emotionalIntelligenceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (responses.includes(0)) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    calculateScores(responses);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('info');
    setUserData(null);
    setCurrentQuestion(0);
    setResponses(new Array(60).fill(0));
    setCurrentResponse('');
    reset();
  };

  const getDimensionProgress = () => {
    const dimensionIndex = Math.floor(currentQuestion / 12);
    const questionInDimension = (currentQuestion % 12) + 1;
    const dimensionKey = ['selfAwareness', 'selfRegulation', 'motivation', 'empathy', 'socialSkills'][dimensionIndex];
    return {
      dimension: dimensionNames[dimensionKey as keyof typeof dimensionNames],
      progress: questionInDimension
    };
  };

  if (currentStep === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-primary mb-2">
                  Emotional Intelligence Assessment
                </CardTitle>
                <p className="text-muted-foreground">
                  This comprehensive assessment evaluates your emotional intelligence across five key dimensions through 60 carefully crafted questions.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Assessment Dimensions:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Self-Awareness</li>
                      <li>• Self-Regulation</li>
                      <li>• Motivation</li>
                      <li>• Empathy</li>
                      <li>• Social Skills</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">What You'll Get:</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• Detailed dimension scores</li>
                      <li>• Personalized insights</li>
                      <li>• Development recommendations</li>
                      <li>• Comprehensive report</li>
                    </ul>
                  </div>
                </div>
                <ApplicantDataForm 
                  assessmentType="emotional-intelligence"
                  assessmentTitle="Emotional Intelligence Assessment"
                  onComplete={handleUserDataSubmit} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'assessment') {
    const dimensionProgress = getDimensionProgress();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of {emotionalIntelligenceQuestions.length}
                  </Badge>
                  <Badge variant="secondary">
                    {dimensionProgress.dimension} ({dimensionProgress.progress}/12)
                  </Badge>
                </div>
                <Progress value={progress} className="mb-4" />
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestionData.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={currentResponse} onValueChange={handleResponseChange}>
                  <div className="space-y-3">
                    {[
                      { value: '1', label: 'Strongly Disagree' },
                      { value: '2', label: 'Disagree' },
                      { value: '3', label: 'Neutral' },
                      { value: '4', label: 'Agree' },
                      { value: '5', label: 'Strongly Agree' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    {currentQuestion === emotionalIntelligenceQuestions.length - 1 ? 'Submit' : 'Next'}
                    {currentQuestion === emotionalIntelligenceQuestions.length - 1 ? null : <ChevronRight size={16} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && result) {
    const transformedResult = {
      overallScore: result.overallScore,
      dimensionScores: Object.entries(result.scores).map(([key, value]) => ({
        dimension: dimensionNames[key as keyof typeof dimensionNames],
        score: value.percentage,
        level: value.level,
        interpretation: value.interpretation
      })),
      recommendations: result.recommendations
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <AssessmentResults 
            data={transformedResult}
            assessmentType="emotional-intelligence"
            candidateInfo={{
              name: userData?.fullName || '',
              email: userData?.email || ''
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {isCalculating ? 'Calculating your results...' : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default EmotionalIntelligenceAssessment;