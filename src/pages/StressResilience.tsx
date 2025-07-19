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
import { ArrowRight, Brain, Heart, Zap, Target, CheckCircle2, BarChart3, TrendingUp, Clock, Shield, Lightbulb, ArrowLeft, FileText, Share2 } from "lucide-react";
import { stressResilienceQuestions, resilienceProfiles, StressResilienceQuestion } from "@/data/stressResilienceQuestions";
import { useStressResilienceScoring } from "@/hooks/useStressResilienceScoring";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StressResilience = () => {
  const [currentStep, setCurrentStep] = useState<'overview' | 'assessment' | 'results'>('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState([3]);
  const [startTime, setStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addResponse, calculateResults, currentResults, resetAssessment, responses } = useStressResilienceScoring();
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentQuestion = stressResilienceQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / stressResilienceQuestions.length) * 100;

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
        description: "You must select an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const timeTaken = Date.now() - startTime;
    const response = {
      questionId: currentQuestion.id,
      selectedOption,
      score: currentQuestion.options[selectedOption].score,
      timeTaken,
      confidence: confidence[0]
    };

    addResponse(response);

    if (currentQuestionIndex < stressResilienceQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setConfidence([3]);
      setStartTime(Date.now());
    } else {
      handleFinishAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setConfidence([3]);
    }
  };

  const handleFinishAssessment = async () => {
    setIsSubmitting(true);
    
    try {
      // Final response if there's a selected option
      if (selectedOption !== null) {
        const timeTaken = Date.now() - startTime;
        const response = {
          questionId: currentQuestion.id,
          selectedOption,
          score: currentQuestion.options[selectedOption].score,
          timeTaken,
          confidence: confidence[0]
        };
        addResponse(response);
      }

      // Small delay to show processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep('results');
      toast({
        title: "Assessment Complete!",
        description: "Your stress resilience profile has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareResults = async () => {
    const shareText = `I just completed the Stress Resilience Assessment! Overall Score: ${currentResults?.overallScore}% - ${currentResults?.resilienceProfile} level`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Stress Resilience Assessment Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Results Copied!",
        description: "Your results have been copied to clipboard.",
      });
    }
  };

  const downloadReport = async () => {
    if (!currentResults) return;
    
    try {
      const reportData = {
        assessmentType: 'stress_resilience',
        results: currentResults,
        completedAt: new Date().toISOString(),
      };

      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: reportData
      });

      if (response.data) {
        // Open HTML report in new window for PDF printing
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response.data);
          newWindow.document.close();
          
          // Add print-friendly styles and auto-print
          setTimeout(() => {
            newWindow.focus();
            newWindow.print();
          }, 1000);

          toast({
            title: "Report Generated",
            description: "Use your browser's Print dialog to save as PDF. Select 'Save as PDF' as destination.",
          });
        } else {
          // Fallback: download as HTML if popup blocked
          const blob = new Blob([response.data], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Stress-Resilience-Report-${new Date().toISOString().split('T')[0]}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "HTML Report Downloaded",
            description: "Open the HTML file and use your browser's Print to PDF feature.",
          });
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const restartAssessment = () => {
    setCurrentStep('overview');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setConfidence([3]);
    resetAssessment();
  };

  const getStressLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStressLevelBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100';
      case 'medium': return 'bg-yellow-100';
      case 'high': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  // Calculate results when moving to results step
  useEffect(() => {
    if (currentStep === 'results' && !currentResults) {
      calculateResults(responses);
    }
  }, [currentStep, currentResults, calculateResults, responses]);

  const dimensions = [
    {
      title: "Emotional Resilience",
      description: "Ability to maintain emotional stability under stress and recover from setbacks",
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "Cognitive Flexibility",
      description: "Mental adaptability and creative problem-solving under pressure",
      icon: Brain,
      color: "text-purple-500"
    },
    {
      title: "Physical Response",
      description: "Physiological stress management and energy maintenance",
      icon: Zap,
      color: "text-yellow-500"
    },
    {
      title: "Social Support",
      description: "Effective utilization of interpersonal resources during challenges",
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Change Adaptability",
      description: "Comfort with uncertainty and ability to thrive in dynamic environments",
      icon: Shield,
      color: "text-green-500"
    },
    {
      title: "Performance Under Pressure",
      description: "Maintaining or enhancing performance when stakes are high",
      icon: Lightbulb,
      color: "text-orange-500"
    }
  ];

  const phases = [
    {
      phase: "Baseline Assessment",
      description: "Establish individual stress tolerance and response patterns",
      duration: "10 minutes"
    },
    {
      phase: "Progressive Stress Simulation",
      description: "Gradual introduction of stress factors with real-time monitoring",
      duration: "15 minutes"
    },
    {
      phase: "Peak Challenge Response",
      description: "Maximum stress scenarios to test resilience limits",
      duration: "10 minutes"
    },
    {
      phase: "Recovery Analysis",
      description: "Measure bounce-back capability and learning integration",
      duration: "5 minutes"
    }
  ];

  // Render Overview Step
  if (currentStep === 'overview') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              🎯 Assessment Module
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Stress Resilience & Adaptability Assessment
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Measuring capacity to thrive under pressure and navigate change through comprehensive, 
              multi-modal evaluation with biometric simulation and real-world scenarios.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="outline" className="text-sm">{stressResilienceQuestions.length} Multi-Modal Questions</Badge>
              <Badge variant="outline" className="text-sm">Biometric Response Simulation</Badge>
              <Badge variant="outline" className="text-sm">Progressive Stress Loading</Badge>
              <Badge variant="outline" className="text-sm">Burnout Risk Prediction</Badge>
            </div>

            <Button 
              size="lg" 
              onClick={handleStartAssessment}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Assessment Overview */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Assessment Overview</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This comprehensive assessment evaluates your ability to maintain performance under pressure, 
                recover from setbacks, and adapt to changing circumstances.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {dimensions.map((dimension, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <dimension.icon className={`h-6 w-6 ${dimension.color}`} />
                      <CardTitle className="text-lg">{dimension.title}</CardTitle>
                    </div>
                    <CardDescription>{dimension.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">Multiple questions</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Assessment Phases */}
            <div className="bg-card rounded-2xl p-8 shadow-elegant">
              <h3 className="text-2xl font-bold text-center mb-8">Assessment Methodology</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {phases.map((phase, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-semibold mb-2">{phase.phase}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                    <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resilience Profiles */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Resilience Profiles</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive scoring system categorizes resilience levels for targeted development
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resilienceProfiles.map((profile, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-4 h-4 rounded-full ${profile.color}`}></div>
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <Badge variant="outline">{profile.range.min}-{profile.range.max}</Badge>
                    </div>
                    <CardDescription>{profile.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Render Assessment Step
  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline">Question {currentQuestionIndex + 1} of {stressResilienceQuestions.length}</Badge>
                <Badge 
                  variant="outline" 
                  className={`${getStressLevelBg(currentQuestion.stressLevel)} ${getStressLevelColor(currentQuestion.stressLevel)}`}
                >
                  {currentQuestion.stressLevel.toUpperCase()} STRESS
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{currentQuestion.category.toUpperCase()}</Badge>
                  <Badge variant="outline">{currentQuestion.dimension}</Badge>
                </div>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                {currentQuestion.scenario && (
                  <CardDescription className="text-base mt-4 p-4 bg-muted rounded-lg">
                    <strong>Scenario:</strong> {currentQuestion.scenario}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={selectedOption?.toString()} 
                  onValueChange={(value) => setSelectedOption(parseInt(value))}
                  className="space-y-4"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Confidence Slider */}
                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium mb-2 block">
                    How confident are you in your answer?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">Low</span>
                    <Slider
                      value={confidence}
                      onValueChange={setConfidence}
                      max={5}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">High</span>
                  </div>
                  <div className="text-center mt-2">
                    <Badge variant="outline">Confidence: {confidence[0]}/5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : currentQuestionIndex === stressResilienceQuestions.length - 1 ? (
                  "Finish Assessment"
                ) : (
                  "Next Question"
                )}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Render Results Step
  if (currentStep === 'results' && currentResults) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary">
                ✅ Assessment Complete
              </Badge>
              <h1 className="text-4xl font-bold mb-4">Your Stress Resilience Profile</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on your responses, here's your comprehensive stress resilience assessment.
              </p>
            </div>

            {/* Overall Score */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {Math.round(currentResults.overallScore)}
                  </div>
                  <Badge variant="secondary">{currentResults.resilienceProfile}</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Percentile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentResults.percentileScore}%
                  </div>
                  <Badge variant="outline">National Average</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Burnout Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-bold mb-2 ${
                    currentResults.burnoutRisk === 'low' ? 'text-green-500' :
                    currentResults.burnoutRisk === 'medium' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {currentResults.burnoutRisk.toUpperCase()}
                  </div>
                  <Badge 
                    variant={currentResults.burnoutRisk === 'low' ? 'default' : 'destructive'}
                  >
                    {currentResults.stressManagementLevel}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Dimension Scores */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl">Dimension Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {currentResults.dimensionScores.map((dimension, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dimension.dimension}</span>
                        <Badge variant="outline">{dimension.level}</Badge>
                      </div>
                      <Progress value={dimension.percentage} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {Math.round(dimension.percentage)}% ({dimension.score}/{dimension.maxScore})
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentResults.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-orange-600">Development Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentResults.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-orange-500 mt-1" />
                        <span className="text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {currentResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-primary mt-1" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={restartAssessment} variant="outline">
                Retake Assessment
              </Button>
              <Button onClick={() => navigate('/assessment')}>
                Explore Other Assessments
              </Button>
              <Button onClick={downloadReport}>
                <FileText className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button onClick={shareResults} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default StressResilience;