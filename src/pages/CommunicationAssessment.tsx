import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Users, Target, Zap, ArrowRight, ArrowLeft, Share2, Download, Clock } from "lucide-react";
import { communicationStylesQuestions } from "@/data/communicationStylesQuestions";
import { useCommunicationStylesScoring } from "@/hooks/useCommunicationStylesScoring";
import { generateCommunicationReport } from "@/services/communicationReportGenerator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CommunicationAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [startTime] = useState(Date.now());
  const [responseTimings, setResponseTimings] = useState<Record<string, number>>({});
  const [writtenResponse, setWrittenResponse] = useState("");
  const { user } = useAuth();
  const { calculateResults, results, isProcessing } = useCommunicationStylesScoring();

  const questions = communicationStylesQuestions;

  const handleAnswer = (value: string) => {
    const questionId = questions[currentQuestion].id;
    const responseTime = Date.now() - startTime;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    setResponseTimings(prev => ({
      ...prev,
      [questionId]: responseTime
    }));
  };

  const handleWrittenResponse = (value: string) => {
    setWrittenResponse(value);
    const questionId = questions[currentQuestion].id;
    const responseTime = Date.now() - startTime;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    setResponseTimings(prev => ({
      ...prev,
      [questionId]: responseTime
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      const nextQuestion = questions[nextQuestionIndex];
      
      setCurrentQuestion(nextQuestionIndex);
      
      // Only set written response if the next question is a written response type
      if (nextQuestion.type === 'written-response') {
        setWrittenResponse(answers[nextQuestion.id] || "");
      } else {
        setWrittenResponse("");
      }
    } else {
      // Calculate final results
      const finalResults = await calculateResults(answers, startTime, responseTimings);
      
      try {
        if (user) {
          await supabase.from('assessment_results').insert({
            user_id: user.id,
            assessment_type: 'communication_styles',
            results: JSON.parse(JSON.stringify(finalResults)),
            completed_at: new Date().toISOString()
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
      const previousQuestionId = questions[currentQuestion - 1].id;
      const previousQuestion = questions[currentQuestion - 1];
      // Only set written response if the previous question is a written response type
      if (previousQuestion.type === 'written-response') {
        setWrittenResponse(answers[previousQuestionId] || "");
      } else {
        setWrittenResponse("");
      }
    }
  };

  const shareResults = async () => {
    if (!results) return;
    
    const shareText = `I completed the Communication Styles Assessment! My profile: ${results.profile.type} - ${results.profile.primary}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Communication Styles Assessment Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Results Copied!", {
        description: "Your results have been copied to clipboard."
      });
    }
  };

  const downloadReport = async () => {
    if (!results || !user) return;
    
    setIsGeneratingReport(true);
    try {
      const report = generateCommunicationReport(results, user.email || "User", false);
      const reportData = {
        assessmentType: 'communication_styles',
        results: report,
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
        a.download = `Communication-Styles-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Report Downloaded", {
          description: "Your communication styles report has been downloaded."
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Download Error", {
        description: "Failed to generate report. Please try again."
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];

  // Safety check - don't render if questions aren't loaded
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Safety check - don't render if current question data is missing
  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: Question data not found</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-indigo-100 text-indigo-800">
              Communication Assessment Complete
            </Badge>
            <h1 className="text-3xl font-bold mb-4">Your Communication Profile</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of your communication style and effectiveness
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  {results.profile.type} Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {results.profile.primary}
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Overall Score</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={results.overallScore} className="flex-1" />
                      <span className="text-sm font-medium">{Math.round(results.overallScore)}/100</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Communication Effectiveness</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={results.communicationEffectivenessIndex} className="flex-1" />
                      <span className="text-sm font-medium">{Math.round(results.communicationEffectivenessIndex)}/100</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Adaptability</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={results.adaptabilityScore} className="flex-1" />
                      <span className="text-sm font-medium">{Math.round(results.adaptabilityScore)}/100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                    <p className="text-sm text-muted-foreground">{results.profile.strength}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">Growth Areas</h4>
                    <p className="text-sm text-muted-foreground">{results.profile.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">Work Style</h4>
                    <p className="text-sm text-muted-foreground">{results.profile.workStyle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Communication Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(results.dimensions).map(([key, dimension]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-muted-foreground">{dimension.level}</span>
                      </div>
                      <Progress value={dimension.score} className="h-2" />
                      <p className="text-xs text-muted-foreground">{dimension.description}</p>
                    </div>
                  ))}
                </div>
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
            Communication Styles Assessment
          </Badge>
          <h1 className="text-3xl font-bold mb-4">
            Discover Your Communication Style
          </h1>
          <p className="text-muted-foreground">
            80 comprehensive questions analyzing your communication patterns across multiple dimensions
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

        {/* Module Badge */}
        <div className="mb-4">
          <Badge variant="outline" className="mb-2">
            {currentQuestionData.module.charAt(0).toUpperCase() + currentQuestionData.module.slice(1).replace('-', ' ')}
          </Badge>
          <Badge variant="secondary">
            {currentQuestionData.dimension.charAt(0).toUpperCase() + currentQuestionData.dimension.slice(1).replace('-', ' ')}
          </Badge>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestionData.question}
            </CardTitle>
            {currentQuestionData.context && (
              <CardDescription>
                {currentQuestionData.context}
              </CardDescription>
            )}
            {currentQuestionData.timeLimit && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Time limit: {currentQuestionData.timeLimit / 60} minutes
              </div>
            )}
          </CardHeader>
          <CardContent>
            {currentQuestionData.type === 'written-response' ? (
              <div className="space-y-4">
                {currentQuestionData.prompt && (
                  <p className="text-sm text-muted-foreground">{currentQuestionData.prompt}</p>
                )}
                <Textarea
                  value={writtenResponse}
                  onChange={(e) => handleWrittenResponse(e.target.value)}
                  placeholder="Enter your response here..."
                  className="min-h-32"
                />
              </div>
            ) : (
              <RadioGroup 
                value={answers[currentQuestionData.id] || ""} 
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {currentQuestionData.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
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
            disabled={!answers[currentQuestionData.id] || isProcessing}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            {isProcessing ? 'Processing...' : 
             currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationAssessment;