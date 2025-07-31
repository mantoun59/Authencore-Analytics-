import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communicationCompetencyQuestions, communicationCompetencyInfo } from '@/data/communicationCompetencyQuestions';
import { useCommunicationCompetencyAssessment } from '@/hooks/useComprehensiveAssessments';
import { generateCommunicationCompetencyReport } from '@/services/comprehensiveAssessmentScoring';

const CommunicationCompetencyAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const { results, isCalculating, calculateResults } = useCommunicationCompetencyAssessment();

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < communicationCompetencyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = async () => {
    if (responses.length === communicationCompetencyQuestions.length) {
      await calculateResults(responses);
      setShowResults(true);
    }
  };

  const isComplete = responses.length === communicationCompetencyQuestions.length;
  const progress = ((currentQuestion + 1) / communicationCompetencyQuestions.length) * 100;

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary mb-2">Assessment Complete!</h1>
            <p className="text-muted-foreground">Your Communication Competency results</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Your Communication Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {results.scores.overall_communication_effectiveness.toFixed(1)}/5.0
                </div>
                <div className="text-lg font-semibold text-secondary">
                  {results.profile}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Direct vs Indirect</span>
                    <span className="text-primary font-semibold">{results.effectiveness_profile.direct_indirect.toFixed(1)}/5.0</span>
                  </div>
                  <Progress value={(results.effectiveness_profile.direct_indirect / 5) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Formal vs Informal</span>
                    <span className="text-primary font-semibold">{results.effectiveness_profile.formal_informal.toFixed(1)}/5.0</span>
                  </div>
                  <Progress value={(results.effectiveness_profile.formal_informal / 5) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Expressive vs Reserved</span>
                    <span className="text-primary font-semibold">{results.effectiveness_profile.expressive_reserved.toFixed(1)}/5.0</span>
                  </div>
                  <Progress value={(results.effectiveness_profile.expressive_reserved / 5) * 100} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Task vs Relationship</span>
                    <span className="text-primary font-semibold">{results.effectiveness_profile.task_relationship.toFixed(1)}/5.0</span>
                  </div>
                  <Progress value={(results.effectiveness_profile.task_relationship / 5) * 100} className="h-2" />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-success">Strengths</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {results.insights.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-warning">Challenges</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {results.insights.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">Opportunities</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {results.insights.opportunities.map((opportunity, index) => (
                        <li key={index}>{opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Enhancement Recommendations</h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/assessment">Take Another Assessment</Link>
                </Button>
                <Button variant="outline" onClick={() => {
                  const report = generateCommunicationCompetencyReport(results);
                  const blob = new Blob([report], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'communication-competency-report.md';
                  a.click();
                }}>
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = communicationCompetencyQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Link to="/assessment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Link>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{communicationCompetencyInfo.title}</h1>
            <p className="text-muted-foreground mb-4">{communicationCompetencyInfo.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>{communicationCompetencyInfo.duration}</span>
              <span>•</span>
              <span>{communicationCompetencyInfo.questionCount} questions</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {communicationCompetencyQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={responses[currentQuestion]?.toString()}
              onValueChange={(value) => handleResponse(parseInt(value))}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentQuestion === communicationCompetencyQuestions.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={!responses[currentQuestion] || isCalculating}
              className="flex items-center gap-2"
            >
              {isCalculating ? 'Calculating...' : 'Complete Assessment'}
              <CheckCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!responses[currentQuestion]}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationCompetencyAssessment;