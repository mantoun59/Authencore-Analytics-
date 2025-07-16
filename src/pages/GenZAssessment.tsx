import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { genZScenarios, genZValues, collaborationScenarios, type GenZScenario, type GenZValue } from '@/data/genZScenarios';
import { useGenZScoring, type UserData, type ScenarioResponse } from '@/hooks/useGenZScoring';
import { Heart, ThumbsUp, Minus, ThumbsDown, AlertTriangle, Share2, Download, RotateCcw } from 'lucide-react';

type AssessmentStep = 'welcome' | 'onboarding' | 'scenarios' | 'values' | 'collaboration' | 'results';

export default function GenZAssessment() {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    birthYear: 2000,
    avatar: '🦄',
    topValues: [],
    responses: []
  });
  const [selectedValues, setSelectedValues] = useState<GenZValue[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  
  const scoring = useGenZScoring();

  const handleStartAssessment = () => {
    setStartTime(Date.now());
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = (username: string, birthYear: number, avatar: string) => {
    setUserData(prev => ({ ...prev, username, birthYear, avatar }));
    setCurrentStep('scenarios');
  };

  const handleScenarioReaction = (reaction: 'love' | 'good' | 'neutral' | 'bad' | 'toxic') => {
    const scenario = genZScenarios[currentScenario];
    const response: ScenarioResponse = {
      scenarioId: scenario.id,
      category: scenario.category,
      reaction,
      responseTime: Date.now() - startTime,
      timestamp: Date.now()
    };

    setUserData(prev => ({
      ...prev,
      responses: [...prev.responses, response]
    }));

    scoring.processReaction(scenario, reaction);

    if (currentScenario < genZScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setCurrentStep('values');
    }
  };

  const handleValuesComplete = (values: GenZValue[]) => {
    setSelectedValues(values);
    setUserData(prev => ({ ...prev, topValues: values }));
    scoring.processValues(values);
    setCurrentStep('collaboration');
  };

  const handleCollaborationComplete = (optionId: string, scores: { [key: string]: number }) => {
    setUserData(prev => ({
      ...prev,
      collaborationResponse: {
        scenarioId: 'collab001',
        selectedOption: optionId,
        scores
      }
    }));
    scoring.processCollaboration(scores);
    setCurrentStep('results');
  };

  const results = currentStep === 'results' ? scoring.calculateFinalScores(userData) : null;

  const restartAssessment = () => {
    setCurrentStep('welcome');
    setCurrentScenario(0);
    setSelectedValues([]);
    setUserData({
      username: '',
      birthYear: 2000,
      avatar: '🦄',
      topValues: [],
      responses: []
    });
    scoring.reset();
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl mb-4">🚀</div>
              <CardTitle className="text-3xl mb-2">Gen Z Workplace Assessment</CardTitle>
              <p className="text-lg text-muted-foreground">
                Discover your authentic workplace style through TikTok-style interactions
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  <span>10 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📱</span>
                  <span>Mobile-first</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span>Gen Z focused</span>
                </div>
              </div>
              <div className="text-left bg-muted p-4 rounded-lg">
                <p className="text-sm mb-2">
                  This assessment uses familiar interactions like swiping and emoji reactions to understand your authentic workplace preferences.
                </p>
                <p className="text-sm">
                  React to workplace scenarios with ❤️ 👍 😐 👎 or 🚩 - your first instinct is usually the most accurate!
                </p>
              </div>
              <Button onClick={handleStartAssessment} size="lg" className="w-full">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'scenarios') {
    const scenario = genZScenarios[currentScenario];
    const progress = ((currentScenario + 1) / genZScenarios.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {currentScenario + 1} of {genZScenarios.length}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                {scenario.category.replace('_', ' ')}
              </Badge>
              <CardTitle className="text-lg">{scenario.text}</CardTitle>
            </CardHeader>
            
            {scenario.type === 'chat_simulation' && scenario.messages && (
              <CardContent>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  {scenario.messages.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-medium text-xs text-muted-foreground">{msg.user} • {msg.time}</div>
                      <div className="mt-1">{msg.text}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          <div className="grid grid-cols-5 gap-2">
            {[
              { reaction: 'love', icon: Heart, color: 'text-red-500', label: 'Love' },
              { reaction: 'good', icon: ThumbsUp, color: 'text-green-500', label: 'Good' },
              { reaction: 'neutral', icon: Minus, color: 'text-gray-500', label: 'Neutral' },
              { reaction: 'bad', icon: ThumbsDown, color: 'text-orange-500', label: 'Bad' },
              { reaction: 'toxic', icon: AlertTriangle, color: 'text-red-600', label: 'Toxic' }
            ].map(({ reaction, icon: Icon, color, label }) => (
              <Button
                key={reaction}
                variant="outline"
                className={`aspect-square p-2 ${color}`}
                onClick={() => handleScenarioReaction(reaction as any)}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{results.workplaceProfile.emoji}</div>
              <CardTitle className="text-2xl">@{userData.username}</CardTitle>
              <p className="text-lg text-muted-foreground">{results.workplaceProfile.name}</p>
              <p className="text-sm">{results.workplaceProfile.description}</p>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm text-muted-foreground">Work Style</div>
                <div className="font-semibold">{results.workStyle}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm text-muted-foreground">Team Vibe</div>
                <div className="font-semibold">{results.teamVibe}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm text-muted-foreground">Energy Peak</div>
                <div className="font-semibold">{results.energyPeak}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-sm text-muted-foreground">Comm Style</div>
                <div className="font-semibold">{results.commStyle}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top Company Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.companyMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">{match.name}</div>
                      <div className="flex gap-2 mt-1">
                        {match.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{match.score}%</div>
                      <div className="text-sm text-muted-foreground">Match</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button onClick={restartAssessment} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>
            <Button>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <p>Assessment in progress...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}