import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Brain, Heart, Zap, Target, CheckCircle2, BarChart3, TrendingUp, Clock, Shield, Lightbulb, ArrowLeft, FileText, Share2, RotateCcw, Users } from "lucide-react";
import StressResilienceVisualizer from "@/components/StressResilienceVisualizer";
import { useAuth } from "@/contexts/AuthContext";
import { burnoutPreventionQuestions } from "@/data/burnoutPreventionQuestions";
import { useStressResilienceScoring } from "@/hooks/useStressResilienceScoring";
import { generateDetailedBurnoutReport } from "@/services/burnoutReportGenerator";
import { generateProfessionalReport } from "@/services/professionalReportGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StressResilience = () => {
  const [currentStep, setCurrentStep] = useState<'overview' | 'assessment' | 'results'>('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState([3]);
  const [startTime, setStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    position: '',
    company: ''
  });
  
  const { addResponse, calculateResults, currentResults, resetAssessment, responses } = useStressResilienceScoring();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState(null);

  const currentQuestion = burnoutPreventionQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / burnoutPreventionQuestions.length) * 100;

  useEffect(() => {
    if (currentStep === 'assessment' && currentQuestionIndex === 0) {
      setStartTime(Date.now());
    }
  }, [currentStep]);

  const handleStartAssessment = () => {
    setCurrentStep('assessment');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setConfidence([3]);
    resetAssessment();
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer",
        description: "You must choose an option before proceeding.",
        variant: "destructive"
      });
      return;
    }

    const finalResponse = {
      questionId: currentQuestion.id,
      selectedOption,
      score: selectedOption,
      timeTaken: Date.now() - startTime,
      confidence: confidence[0]
    };
    
    addResponse(finalResponse);
    
    if (currentQuestionIndex < burnoutPreventionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setConfidence([3]);
    } else {
      // Pass the final responses including the current one
      completeAssessment([...responses, finalResponse]);
    }
  };

  const completeAssessment = async (finalResponses = responses) => {
    setIsSubmitting(true);
    try {
      const results = calculateResults(finalResponses);
      const completionTime = Math.round((Date.now() - startTime) / 60000);
      
      // Generate detailed burnout report
      await generateDetailedBurnoutReport({
        candidateInfo: {
          name: userProfile?.name || 'Anonymous',
          email: userProfile?.email || 'unknown@example.com',
          date: new Date().toLocaleDateString()
        },
        results: results
      });

      // Save to database - create anonymous user if needed
      let userId = user?.id;
      if (!userId) {
        // Create anonymous user entry for tracking
        const anonymousUser = await supabase.from('profiles').insert({
          user_id: crypto.randomUUID(),
          email: userProfile?.email || `anonymous-${Date.now()}@burnout-assessment.com`,
          full_name: userProfile?.name || 'Anonymous User'
        }).select().single();
        userId = anonymousUser.data?.user_id;
      }

      if (userId) {
        await supabase.from('assessment_results').insert({
          user_id: userId,
          assessment_type: 'burnout_prevention',
          results: results as any,
          completed_at: new Date().toISOString()
        });
      }
      
      setResults(results);

      setCurrentStep('results');
      
      toast({
        title: "Assessment Complete!",
        description: "Your burnout prevention report has been generated.",
      });
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error",
        description: "There was an error processing your results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Burnout Prevention Index
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Comprehensive assessment evaluating stress levels, risk factors, and resilience capabilities across 7 dimensions
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="text-base px-4 py-2">102 Questions</Badge>
                <Badge variant="secondary" className="text-base px-4 py-2">25-30 minutes</Badge>
                <Badge variant="secondary" className="text-base px-4 py-2">7 Dimensions</Badge>
                <Badge variant="secondary" className="text-base px-4 py-2">Professional Report</Badge>
              </div>
            </div>

            {/* Assessment Overview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Workload Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Assess your ability to prioritize, delegate, and manage tasks effectively</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">Emotional Exhaustion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Evaluate current levels of emotional depletion and fatigue</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Personal Efficacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Measure your belief in your capability to handle job demands</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Support Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Assess strength and accessibility of social and professional support</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">Work-Life Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Evaluate balance and harmony between personal and professional life</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">Coping & Wellness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">Measure healthy responses to stress and wellness practices</p>
                </CardContent>
              </Card>
            </div>

            {/* User Profile Form */}
            <Card className="max-w-2xl mx-auto mb-8">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Please provide your details to personalize your report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <input
                      id="position"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userProfile.position}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Your job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <input
                      id="company"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userProfile.company}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your organization"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Start Assessment */}
            <div className="text-center">
              <Button 
                onClick={handleStartAssessment}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg"
                disabled={!userProfile.name || !userProfile.email}
              >
                Begin Assessment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col pt-16 pb-4">
          <div className="container mx-auto px-4 max-w-4xl flex-1 flex flex-col">
            {/* Compact Progress Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Burnout Prevention Assessment</h2>
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1}/{burnoutPreventionQuestions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-1" />
              <p className="text-xs text-gray-600">{Math.round(progress)}% complete</p>
            </div>

            {/* Compact Question Card */}
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{currentQuestion.dimension}</Badge>
                  <Badge variant="secondary" className="text-xs">Q{currentQuestionIndex + 1}</Badge>
                </div>
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex-1">
                  <RadioGroup
                    value={selectedOption?.toString()}
                    onValueChange={(value) => setSelectedOption(parseInt(value))}
                    className="space-y-2"
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm">
                          {typeof option === 'string' ? option : option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Compact Confidence Slider */}
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-sm font-medium mb-2 block">
                    Confidence level:
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={confidence}
                      onValueChange={setConfidence}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Navigation */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    setSelectedOption(null);
                  }
                }}
                disabled={currentQuestionIndex === 0}
                size="sm"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {currentQuestionIndex === burnoutPreventionQuestions.length - 1 ? (
                  isSubmitting ? 'Processing...' : 'Complete'
                ) : (
                  'Next'
                )}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Stress Resilience Report
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive analysis with interactive visualizations
              </p>
            </div>

            {currentResults && (
              <div className="space-y-8">
                {/* Import and use the visualizer */}
                <StressResilienceVisualizer results={currentResults} />

                {/* Recommendations */}
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-700">📋 Personalized Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {currentResults.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <FileText className="mr-2 w-4 h-4" />
                    Download Detailed Report
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 w-4 h-4" />
                    Share Results
                  </Button>
                  <Button variant="outline" onClick={() => {
                    resetAssessment();
                    setCurrentStep('overview');
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setConfidence([3]);
                    setResults(null);
                  }}>
                    <RotateCcw className="mr-2 w-4 h-4" />
                    Retake Assessment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

export default StressResilience;
