import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Download, Users, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { leadershipBehaviorQuestions } from '@/data/leadershipBehaviorQuestions';
import { useLeadershipBehaviorAssessment } from '@/hooks/useComprehensiveAssessments';
import { toast } from 'sonner';

const LeadershipBehaviorAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { results, isCalculating, calculateResults } = useLeadershipBehaviorAssessment();

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < leadershipBehaviorQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await calculateResults(responses);
      setShowResults(true);
      toast.success('Assessment completed successfully!');
    } catch (error) {
      toast.error('Failed to calculate results. Please try again.');
    }
  };

  const progress = ((currentQuestion + 1) / leadershipBehaviorQuestions.length) * 100;
  const isComplete = responses.length === leadershipBehaviorQuestions.length && responses.every(r => r !== undefined);

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <Link to="/assessment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Assessments
            </Link>
            <h1 className="text-3xl font-bold text-primary mb-2">Leadership Behaviors Results</h1>
            <p className="text-muted-foreground">Your comprehensive leadership effectiveness assessment results</p>
          </div>

          {/* Overall Score */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Overall Leadership Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{results.scores.overall}/100</div>
                <div className="text-lg text-muted-foreground mb-4">Leadership Effectiveness Score</div>
                <Progress value={results.scores.overall} className="w-full h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Leadership Style Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.scores.categories || {}).map(([category, score], index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                      <span className="text-sm font-semibold">{score}/100</span>
                    </div>
                    <Progress value={score as number} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Leadership Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {results.insights.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">Leadership Strengths</h3>
                  <ul className="space-y-1">
                    {results.insights.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.insights.challenges.length > 0 && (
                <div>
                  <h3 className="font-semibold text-orange-700 mb-2">Development Areas</h3>
                  <ul className="space-y-1">
                    {results.insights.challenges.map((challenge, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.insights.opportunities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">Growth Opportunities</h3>
                  <ul className="space-y-1">
                    {results.insights.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Award className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => {
                const report = `# Leadership Behaviors Assessment Results

## Overall Score: ${results.scores.overall}/100

## Leadership Style Scores:
${Object.entries(results.scores.categories).map(([cat, score]) => `- ${cat.replace('_', ' ')}: ${score}/100`).join('\n')}

## Strengths:
${results.insights.strengths.map(s => `- ${s}`).join('\n')}

## Development Areas:
${results.insights.challenges.map(c => `- ${c}`).join('\n')}

## Recommendations:
${results.recommendations.map(r => `- ${r}`).join('\n')}`;

                const blob = new Blob([report], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'leadership-assessment-results.md';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Link to="/assessment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Link>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">Leadership Behaviors & Effectiveness</h1>
            <p className="text-muted-foreground mb-4">Measure your leadership behaviors across different styles and situations to enhance your leadership effectiveness.</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>10 minutes</span>
              <span>•</span>
              <span>{leadershipBehaviorQuestions.length} questions</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {leadershipBehaviorQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{leadershipBehaviorQuestions[currentQuestion].text}</p>
            
            <RadioGroup 
              value={responses[currentQuestion]?.toString() || ""} 
              onValueChange={(value) => handleResponse(parseInt(value))}
            >
              {leadershipBehaviorQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-sm font-normal cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious} 
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === leadershipBehaviorQuestions.length - 1 ? (
                <Button 
                  onClick={handleComplete} 
                  disabled={!isComplete || isCalculating}
                  className="min-w-[120px]"
                >
                  {isCalculating ? 'Calculating...' : 'Complete Assessment'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  disabled={responses[currentQuestion] === undefined}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadershipBehaviorAssessment;