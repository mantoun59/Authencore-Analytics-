import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, FileText, Download, Eye } from "lucide-react";
import { communicationStylesQuestions } from "@/data/communicationStylesQuestions";
import { useCommunicationStylesScoring } from "@/hooks/useCommunicationStylesScoring";
import { useCommunicationStylesTranslation } from "@/hooks/useCommunicationStylesTranslation";
import EnhancedCommunicationStylesVisualizer from "./CommunicationStylesEnhancedVisualizer";
import TeamCompatibilityAnalyzer from "./TeamCompatibilityAnalyzer";
import { generateCommunicationStylesPDF } from "@/utils/communicationStylesPdfGenerator";
import { generateCommunicationStylesHTML } from "@/utils/communicationStylesHtmlGenerator";
import { useToast } from "@/hooks/use-toast";

interface CommunicationStylesAssessmentProps {
  onComplete?: (results: any) => void;
  participantName?: string;
  participantEmail?: string;
}

const CommunicationStylesAssessment: React.FC<CommunicationStylesAssessmentProps> = ({
  onComplete,
  participantName = "",
  participantEmail = ""
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [responseTimings, setResponseTimings] = useState<Record<string, number>>({});
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [showTeamAnalysis, setShowTeamAnalysis] = useState(false);
  
  const { results, isProcessing, calculateResults } = useCommunicationStylesScoring();
  const { translateUI, translateDimensionName, currentLanguage } = useCommunicationStylesTranslation();
  const { toast } = useToast();

  const currentQuestion = communicationStylesQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / communicationStylesQuestions.length) * 100;

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleAnswer = (value: any) => {
    const responseTime = Date.now() - questionStartTime;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    
    setResponseTimings(prev => ({
      ...prev,
      [currentQuestion.id]: responseTime
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < communicationStylesQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeAssessment = async () => {
    try {
      const assessmentResults = await calculateResults(answers, startTime, responseTimings);
      setIsComplete(true);
      onComplete?.(assessmentResults);
      
      toast({
        title: "Assessment Complete!",
        description: "Your communication styles profile has been generated.",
      });
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast({
        title: "Error",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadPDF = async () => {
    if (!results) return;
    
    try {
      const pdfBlob = await generateCommunicationStylesPDF({
        results,
        participantName: participantName || "Assessment Participant",
        participantEmail: participantEmail || "",
        includeDistortionAnalysis: true,
        includeVisualCharts: true,
        language: currentLanguage
      });
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `communication-styles-report-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Generated",
        description: "Your communication styles report has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const viewHTMLReport = async () => {
    if (!results) return;
    
    try {
      const htmlContent = generateCommunicationStylesHTML({
        results,
        participantName: participantName || "Assessment Participant",
        participantEmail: participantEmail || "",
        includeDistortionAnalysis: true,
        includeVisualCharts: true,
        language: currentLanguage
      });
      
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
      
      toast({
        title: "HTML Report Opened",
        description: "Your communication styles report opened in a new window.",
      });
    } catch (error) {
      console.error('Error generating HTML:', error);
      toast({
        title: "Error",
        description: "Failed to generate HTML report. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isComplete && results) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Actions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{translateUI('title')}</CardTitle>
                <CardDescription className="text-lg">
                  {translateUI('subtitle')} - {results.profile.type} Style
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button onClick={viewHTMLReport}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </Button>
                <Button 
                  onClick={() => setShowTeamAnalysis(!showTeamAnalysis)}
                  variant={showTeamAnalysis ? "default" : "outline"}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Team Analysis
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(results.overallScore)}%
                </div>
                <div className="text-sm text-slate-600">Overall Effectiveness</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(results.communicationEffectivenessIndex)}%
                </div>
                <div className="text-sm text-slate-600">CEI Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.adaptabilityScore)}%
                </div>
                <div className="text-sm text-slate-600">Adaptability</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {results.distortionAnalysis.reliability}
                </Badge>
                <div className="text-sm text-slate-600">Reliability</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Visualizer */}
        {!showTeamAnalysis && (
          <EnhancedCommunicationStylesVisualizer results={results} />
        )}

        {/* Team Compatibility Analysis */}
        {showTeamAnalysis && (
          <TeamCompatibilityAnalyzer 
            currentUserProfile={results}
            currentUserName={participantName || "You"}
          />
        )}
      </div>
    );
  }

  // Assessment Questions Interface
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{translateUI('title')}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {communicationStylesQuestions.length}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {translateDimensionName(currentQuestion.dimension)}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {currentQuestion.type.replace('-', ' ')}
            </Badge>
            {currentQuestion.module && (
              <Badge variant="outline" className="text-xs">
                {currentQuestion.module}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          {currentQuestion.context && (
            <CardDescription className="text-base">
              <strong>Context:</strong> {currentQuestion.context}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Content */}
          {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'scenario' ? (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswer(value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-slate-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : currentQuestion.type === 'written-response' ? (
            <div className="space-y-3">
              {currentQuestion.prompt && (
                <p className="text-sm text-slate-600 font-medium">{currentQuestion.prompt}</p>
              )}
              <Textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[120px]"
                maxLength={500}
              />
              <div className="text-xs text-slate-500 text-right">
                {(answers[currentQuestion.id] || '').length}/500 characters
              </div>
            </div>
          ) : currentQuestion.type === 'ranking' ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Rank these options from most to least like you (1 = most like you):</p>
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="number"
                    min="1"
                    max={currentQuestion.options?.length || 4}
                    value={answers[currentQuestion.id]?.[index] || ''}
                    onChange={(e) => {
                      const currentRankings = answers[currentQuestion.id] || {};
                      currentRankings[index] = parseInt(e.target.value) || '';
                      handleAnswer(currentRankings);
                    }}
                    className="w-16 p-2 border rounded text-center"
                  />
                  <span className="flex-1 text-sm">{option}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
              <p className="text-slate-600">Interactive simulation question - This would be a more complex interface</p>
              <Button 
                onClick={() => handleAnswer(3)} 
                variant="outline" 
                className="mt-3"
              >
                Complete Simulation
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm text-slate-500 self-center">
              {currentQuestionIndex + 1} / {communicationStylesQuestions.length}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] && currentQuestion.type !== 'simulation' || isProcessing}
            >
              {isProcessing ? 'Processing...' : (currentQuestionIndex === communicationStylesQuestions.length - 1 ? 'Complete' : 'Next')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
            <div>
              <strong>Time Limit:</strong> {currentQuestion.timeLimit ? `${currentQuestion.timeLimit}s` : 'None'}
            </div>
            <div>
              <strong>Question Weight:</strong> {currentQuestion.weight}x
            </div>
            <div>
              <strong>Module:</strong> {currentQuestion.module?.replace('-', ' ') || 'General'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationStylesAssessment;