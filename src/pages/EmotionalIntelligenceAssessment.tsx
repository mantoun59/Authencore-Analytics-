import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Heart, Clock, Users, Brain, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEmotionalIntelligenceScoring } from '@/hooks/useEmotionalIntelligenceScoring';
import { emotionalIntelligenceQuestions } from '@/data/emotionalIntelligenceQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  email: string;
  position: string;
  organization: string;
}

type AssessmentPhase = 'welcome' | 'registration' | 'instructions' | 'assessment' | 'results';

export default function EmotionalIntelligenceAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { calculateEQResults, isCalculating } = useEmotionalIntelligenceScoring();
  
  const [phase, setPhase] = useState<AssessmentPhase>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    position: '',
    organization: ''
  });
  const [results, setResults] = useState<any>(null);
  const [startTime] = useState(Date.now());

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < emotionalIntelligenceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const completeAssessment = async () => {
    try {
      const endTime = Date.now();
      const completionTime = Math.round((endTime - startTime) / 1000 / 60);
      
      const assessmentResults = await calculateEQResults(responses, completionTime);
      setResults(assessmentResults);
      setPhase('results');
      
      toast({
        title: "Assessment Complete!",
        description: "Your Emotional Intelligence results are ready.",
      });
    } catch (error) {
      console.error('Error calculating results:', error);
      toast({
        title: "Error",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generatePDFReport = async () => {
    try {
      const reportData = {
        assessmentType: 'emotional-intelligence',
        results: results,
        candidateInfo: {
          name: userProfile.name,
          email: userProfile.email,
          position: userProfile.position,
          organization: userProfile.organization,
          date: new Date().toLocaleDateString()
        }
      };

      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: reportData
      });

      if (response.data) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response.data);
          newWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const progress = ((currentQuestionIndex + 1) / emotionalIntelligenceQuestions.length) * 100;
  const currentQuestion = emotionalIntelligenceQuestions[currentQuestionIndex];

  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-rose-200 shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Emotional Intelligence Assessment
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Discover your emotional intelligence abilities and learn how to enhance your interpersonal effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-rose-500" />
                    <h3 className="font-semibold">25-30 Minutes</h3>
                    <p className="text-sm text-muted-foreground">Complete assessment time</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Brain className="w-8 h-8 mx-auto text-rose-500" />
                    <h3 className="font-semibold">4 EQ Dimensions</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive analysis</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Users className="w-8 h-8 mx-auto text-rose-500" />
                    <h3 className="font-semibold">Workplace Applications</h3>
                    <p className="text-sm text-muted-foreground">Practical insights</p>
                  </div>
                </div>

                <div className="bg-rose-50 rounded-lg p-6">
                  <h3 className="font-semibold text-rose-800 mb-3">What You'll Discover:</h3>
                  <ul className="space-y-2 text-rose-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-rose-500" />
                      Your emotional self-awareness and regulation abilities
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-rose-500" />
                      How well you understand and empathize with others
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-rose-500" />
                      Your social skills and relationship management style
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-rose-500" />
                      Personalized development recommendations
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/assessment')}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Assessments
                  </Button>
                  <Button 
                    onClick={() => setPhase('registration')}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
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

  if (phase === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="border-rose-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Registration
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Please fill out the form to start the assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    placeholder="Enter your position"
                    type="text"
                    value={userProfile.position}
                    onChange={(e) => setUserProfile({ ...userProfile, position: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="Enter your organization"
                    type="text"
                    value={userProfile.organization}
                    onChange={(e) => setUserProfile({ ...userProfile, organization: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  onClick={() => setPhase('instructions')}
                >
                  Continue to Instructions
                </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="border-rose-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Instructions
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Read the instructions carefully before starting the assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-rose-700">
                    How to Complete the Assessment:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-rose-600">
                    <li>Each question presents a statement related to emotional intelligence.</li>
                    <li>Read each statement carefully and consider how well it applies to you.</li>
                    <li>Select the response that best reflects your agreement or disagreement with the statement.</li>
                    <li>Use the navigation buttons to move between questions.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-rose-700">
                    Answering the Questions:
                  </h3>
                  <p className="text-rose-600">
                    Choose the response that most closely aligns with your feelings or behaviors.
                    There are no right or wrong answers; answer honestly for the most accurate results.
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  onClick={() => setPhase('assessment')}
                >
                  Start Assessment
                </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="border-rose-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Question {currentQuestionIndex + 1} / {emotionalIntelligenceQuestions.length}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Please rate the following statement:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} className="h-2 bg-rose-200" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-rose-800">
                    {currentQuestion.questionText}
                  </p>
                  <RadioGroup defaultValue={responses[currentQuestionIndex]?.toString()} onValueChange={(value) => handleResponse(Number(value))} className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="r1" />
                      <Label htmlFor="r1">Strongly Disagree</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="r2" />
                      <Label htmlFor="r2">Disagree</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="r3" />
                      <Label htmlFor="r3">Neutral</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="r4" />
                      <Label htmlFor="r4">Agree</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="r5" />
                      <Label htmlFor="r5">Strongly Agree</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  >
                    {currentQuestionIndex === emotionalIntelligenceQuestions.length - 1 ? 'Complete' : 'Next'}
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

  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-rose-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Assessment Results
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Here is a summary of your emotional intelligence assessment results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isCalculating ? (
                  <div className="text-center">
                    <p>Calculating your results...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-rose-700">Self-Awareness:</h3>
                        <Badge className="bg-rose-100 border-rose-300 text-rose-700">{results?.selfAwareness}</Badge>
                        <p className="text-rose-600">Understanding your own emotions and how they affect others.</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-rose-700">Self-Regulation:</h3>
                        <Badge className="bg-rose-100 border-rose-300 text-rose-700">{results?.selfRegulation}</Badge>
                        <p className="text-rose-600">Managing your emotions and impulses effectively.</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-rose-700">Social Awareness:</h3>
                        <Badge className="bg-rose-100 border-rose-300 text-rose-700">{results?.socialAwareness}</Badge>
                        <p className="text-rose-600">Recognizing and understanding the emotions of others.</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-rose-700">Relationship Management:</h3>
                        <Badge className="bg-rose-100 border-rose-300 text-rose-700">{results?.relationshipManagement}</Badge>
                        <p className="text-rose-600">Building and maintaining positive relationships.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-rose-700">Overall Emotional Intelligence:</h3>
                      <Badge className="bg-rose-200 border-rose-400 text-rose-800 text-lg font-bold">{results?.overallEQ}</Badge>
                      <p className="text-rose-600">A comprehensive measure of your emotional intelligence abilities.</p>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                      onClick={generatePDFReport}
                    >
                      Generate PDF Report
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
}
