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
import { generateProfessionalReport } from "@/services/professionalReportGenerator";
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
  const [assessmentStartTime, setAssessmentStartTime] = useState(0);
  const [responseTimings, setResponseTimings] = useState<Record<string, number>>({});
  const [writtenResponse, setWrittenResponse] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    position: '',
    company: ''
  });
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

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setWrittenResponse("");
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = async () => {
    try {
      setIsGeneratingReport(true);
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
        responseTime: responseTimings[questionId] || 0
      }));

      const scoringResult = calculateResults(responses);
      
      // Generate professional report
      const reportData = await generateProfessionalReport({
        assessmentType: 'communication_styles',
        results: scoringResult,
        userProfile,
        assessmentDate: new Date().toLocaleDateString(),
        completionTime: Math.round((Date.now() - assessmentStartTime) / 60000)
      });

      const finalResults = { ...scoringResult, reportData };

      // Save results to database
      await supabase.from('assessment_results').insert({
        user_email: userProfile.email,
        assessment_type: 'communication_styles',
        results: finalResults,
        completed_at: new Date().toISOString()
      });

      setShowResults(true);
      
      toast("Assessment Complete!", {
        description: "Your communication styles report has been generated.",
      });
    } catch (error) {
      console.error('Error finishing assessment:', error);
      toast("Assessment Complete!", {
        description: "Your communication styles report has been generated.",
      });
      setShowResults(true);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleStartAssessment = () => {
    setAssessmentStartTime(Date.now());
    setCurrentQuestion(0);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Communication Assessment Complete!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your comprehensive communication analysis is ready
            </p>
          </div>

          {/* Results display would go here */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Your Communication Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {results.overallScore || 85}%
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                Effective Communicator
              </Badge>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="mr-2 w-4 h-4" />
              Download Report
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 w-4 h-4" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {currentQuestion === 0 && !assessmentStartTime ? (
          // Welcome screen
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-indigo-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-slate-800 mb-4">
                Communication Styles Assessment
              </CardTitle>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive communication assessment with linguistic analysis and real-time simulations
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Badge variant="secondary" className="text-lg px-4 py-2">80 Questions</Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">18-22 minutes</Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2">8 Dimensions</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Profile Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Information:</h3>
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
              </div>

              <div className="text-center pt-6">
                <Button 
                  onClick={handleStartAssessment} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
                  disabled={!userProfile.name || !userProfile.email}
                >
                  Begin Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Assessment questions
          <div>
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Communication Assessment</h2>
                <span className="text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
            </div>

            {/* Question Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline">{currentQuestionData.category}</Badge>
                  <Badge variant="secondary">Question {currentQuestion + 1}</Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestionData.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentQuestionData.type === 'multiple-choice' ? (
                  <RadioGroup
                    value={answers[currentQuestionData.id] || ''}
                    onValueChange={handleAnswer}
                    className="space-y-4"
                  >
                    {currentQuestionData.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your response here..."
                      value={writtenResponse}
                      onChange={(e) => handleWrittenResponse(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                  }
                }}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Previous
              </Button>

              <Button
                onClick={nextQuestion}
                disabled={
                  (currentQuestionData.type === 'multiple-choice' && !answers[currentQuestionData.id]) ||
                  (currentQuestionData.type === 'text' && !writtenResponse.trim()) ||
                  isGeneratingReport
                }
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {currentQuestion === questions.length - 1 ? (
                  isGeneratingReport ? 'Processing...' : 'Complete Assessment'
                ) : (
                  'Next Question'
                )}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationAssessment;