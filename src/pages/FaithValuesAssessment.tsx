import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lightbulb, Clock, Star, Book, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFaithValuesScoring } from '@/hooks/useFaithValuesScoring';
import { faithValuesData } from '@/data/faithValuesQuestions';
import { generateHtmlReport } from '@/utils/htmlReportGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  email: string;
  position: string;
  organization: string;
  faithBackground: string;
}

type AssessmentPhase = 'welcome' | 'registration' | 'instructions' | 'assessment' | 'results';

export default function FaithValuesAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { calculateScores, isCalculating } = useFaithValuesScoring();
  
  const [phase, setPhase] = useState<AssessmentPhase>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    position: '',
    organization: '',
    faithBackground: ''
  });
  const [results, setResults] = useState<any>(null);
  const [startTime] = useState(Date.now());

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < faithValuesData.universal_values.length - 1) {
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
      
      const assessmentResults = calculateScores([], []);
      setResults(assessmentResults);
      setPhase('results');
      
      toast({
        title: "Assessment Complete!",
        description: "Your Faith & Values results are ready.",
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

  const generatePDFReport = async (reportType: 'candidate' | 'employer' | 'comprehensive' = 'candidate') => {
    try {
      if (!results) {
        toast({
          title: "Error",
          description: "No results available to generate report.",
          variant: "destructive"
        });
        return;
      }

      let htmlContent = '';
      const reportData = {
        candidateInfo: {
          name: userProfile.name,
          email: userProfile.email,
          position: userProfile.position,
          organization: userProfile.organization,
          faithBackground: userProfile.faithBackground,
          date: new Date().toLocaleDateString()
        },
        results: results
      };

      if (reportType === 'candidate') {
        const { generateFVAICandidateReport } = await import('@/services/fvaiCandidateReportGenerator');
        htmlContent = generateFVAICandidateReport(reportData);
      } else if (reportType === 'employer') {
        const { generateFVAIEmployerReport } = await import('@/services/fvaiEmployerReportGenerator');
        htmlContent = generateFVAIEmployerReport(reportData);
      } else {
        const { generateFVAIReport } = await import('@/services/fvaiReportGenerator');
        htmlContent = generateFVAIReport(reportData);
      }
      
      // Create a new window/tab with the report
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(htmlContent);
        reportWindow.document.close();
      }
      
      toast({
        title: "Report Generated",
        description: `FVAI ${reportType} report opened in new tab!`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const progress = ((currentQuestionIndex + 1) / faithValuesData.universal_values.length) * 100;
  const currentQuestion = faithValuesData.universal_values[currentQuestionIndex];

  if (phase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Faith & Values Assessment
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Explore the intersection of your faith, values, and professional life with comprehensive insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <Clock className="w-8 h-8 mx-auto text-amber-500" />
                    <h3 className="font-semibold">45-50 Minutes</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive assessment</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Star className="w-8 h-8 mx-auto text-amber-500" />
                    <h3 className="font-semibold">42 Dimensions</h3>
                    <p className="text-sm text-muted-foreground">In-depth analysis</p>
                  </div>
                  <div className="text-center space-y-2">
                    <Book className="w-8 h-8 mx-auto text-amber-500" />
                    <h3 className="font-semibold">Evidence-Based</h3>
                    <p className="text-sm text-muted-foreground">Validated instruments</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-6">
                  <h3 className="font-semibold text-amber-800 mb-3">What You'll Discover:</h3>
                  <ul className="space-y-2 text-amber-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-amber-500" />
                      Your core spiritual and moral values profile
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-amber-500" />
                      How faith influences your decision-making and leadership
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-amber-500" />
                      Integration of spiritual principles in professional life
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-amber-500" />
                      Personalized spiritual growth recommendations
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/assessment')}
                    className="border-amber-200 text-amber-600 hover:bg-amber-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Assessments
                  </Button>
                  <Button 
                    onClick={() => setPhase('registration')}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Registration</CardTitle>
                <CardDescription>Please enter your details to proceed with the assessment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
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
                  <div className="grid gap-2">
                    <Label htmlFor="faithBackground">Faith Background</Label>
                    <Input
                      id="faithBackground"
                      placeholder="Enter your faith background"
                      type="text"
                      value={userProfile.faithBackground}
                      onChange={(e) => setUserProfile({ ...userProfile, faithBackground: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={() => setPhase('instructions')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Instructions</CardTitle>
                <CardDescription>Please read the instructions carefully before starting the assessment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">How to Take the Assessment:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Read each statement carefully.</li>
                    <li>Select the option that best reflects your agreement or disagreement.</li>
                    <li>Answer honestly based on your personal beliefs and experiences.</li>
                    <li>There are no right or wrong answers.</li>
                  </ul>
                </div>
                <Button onClick={() => setPhase('assessment')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Question {currentQuestionIndex + 1} of {faithValuesData.universal_values.length}</CardTitle>
                <CardDescription>{currentQuestion?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} />
                <RadioGroup defaultValue={responses[currentQuestionIndex]?.toString()} onValueChange={(value) => handleResponse(parseInt(value))} className="grid gap-2">
                  {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
                    <div className="flex items-center space-x-2" key={index}>
                      <RadioGroupItem value={(index + 1).toString()} id={`r${index}`} />
                      <Label htmlFor={`r${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
                    Previous
                  </Button>
                  <Button onClick={nextQuestion} disabled={isCalculating}>
                    {isCalculating ? 'Calculating...' : (currentQuestionIndex === faithValuesData.universal_values.length - 1 ? 'Complete' : 'Next')}
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Your Results</CardTitle>
                <CardDescription>Here is a summary of your Faith & Values Assessment results.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Overall Score: {results.overallScore}</h3>
                    <p>Completion Time: {results.completionTime} minutes</p>
                    {Object.entries(results.dimensionScores).map(([dimension, score]) => (
                      <div key={dimension} className="border rounded-md p-4">
                        <h4 className="font-semibold">{dimension}</h4>
                        <p>Score: {String(score)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Loading results...</p>
                )}
                <div className="grid md:grid-cols-3 gap-4">
                  <Button onClick={() => generatePDFReport('candidate')} disabled={!results} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    📄 Candidate Report
                  </Button>
                  <Button onClick={() => generatePDFReport('employer')} disabled={!results} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    🏢 Employer Report
                  </Button>
                  <Button onClick={() => generatePDFReport('comprehensive')} disabled={!results} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    📊 Comprehensive Report
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
}
