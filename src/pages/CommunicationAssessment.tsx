import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare, Users, Target, Zap, ArrowRight, ArrowLeft, Share2, Download } from "lucide-react";
import { communicationQuestions } from "@/data/communicationQuestions";
import { useCommunicationScoring } from "@/hooks/useCommunicationScoring";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CommunicationAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { toast } = useToast();
  const { calculateScores, getMainStyle, getStyleDescription } = useCommunicationScoring();

  const questions = communicationQuestions.slice(0, 20); // Use first 20 questions for core assessment

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final results and save to database
      const results = calculateScores(answers);
      
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          await supabase.from('assessment_results').insert({
            user_id: user.user.id,
            assessment_type: 'communication_style',
            results: {
              ...results,
              completedAt: new Date().toISOString(),
              answersCount: Object.keys(answers).length
            }
          });
        }
      } catch (error) {
        console.error('Error saving results:', error);
      }
      
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const shareResults = async () => {
    const results = calculateScores(answers);
    const mainStyle = getMainStyle(results);
    
    const shareText = `I just completed the Communication Style Assessment! My primary style: ${mainStyle}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Communication Style Assessment Results',
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
    setIsGeneratingReport(true);
    try {
      const results = calculateScores(answers);
      const reportData = {
        assessmentType: 'communication_style',
        results,
        completedAt: new Date().toISOString(),
      };

      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: reportData
      });

      if (response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Communication-Style-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Report Downloaded",
          description: "Your communication style report has been downloaded.",
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const results = calculateScores(answers);
    const mainStyle = getMainStyle(results);
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-indigo-100 text-indigo-800">
              Communication Assessment Complete
            </Badge>
            <h1 className="text-3xl font-bold mb-4">Your Communication Style</h1>
            <p className="text-muted-foreground">
              Understanding how you naturally communicate can help you adapt to different situations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  Primary Style: {mainStyle.charAt(0).toUpperCase() + mainStyle.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {getStyleDescription(mainStyle)}
                </p>
                <div className="space-y-3">
                  {Object.entries(results).map(([style, score]) => (
                    <div key={style} className="flex justify-between items-center">
                      <span className="capitalize">{style}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(100, (score / 10) * 100)} className="w-20" />
                        <span className="text-sm font-medium">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Practice adapting your style to your audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Consider multiple communication channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Build awareness of others' communication preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Develop flexibility in high-stakes situations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center space-y-4">
            <div className="flex gap-4 justify-center">
              <Button onClick={shareResults} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              <Button onClick={downloadReport} disabled={isGeneratingReport}>
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingReport ? 'Generating...' : 'Download Report'}
              </Button>
            </div>
            <Button 
              onClick={() => navigate('/assessment')}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
            >
              Explore Other Assessments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800">
            Communication Assessment
          </Badge>
          <h1 className="text-3xl font-bold mb-4">
            Discover Your Communication Style
          </h1>
          <p className="text-muted-foreground">
            Understanding how you naturally communicate helps you adapt to different situations and audiences
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion].question}
            </CardTitle>
            {questions[currentQuestion].context && (
              <CardDescription>
                {questions[currentQuestion].context}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion] || ""} 
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationAssessment;