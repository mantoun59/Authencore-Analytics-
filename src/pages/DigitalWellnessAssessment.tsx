import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { digitalWellnessQuestions, digitalScenarios, timeTasks, behavioralSimulations, appCategories } from '@/data/digitalWellnessData';
import { useDigitalHabitsTracker } from '@/hooks/useDigitalHabitsTracker';
import { useDigitalWellnessScoring } from '@/hooks/useDigitalWellnessScoring';
import { Brain, Smartphone, Clock, Target, BarChart3, Shield, AlertTriangle } from 'lucide-react';

type AssessmentPhase = 'intro' | 'self-report' | 'scenarios' | 'time-tasks' | 'behavioral' | 'results';

export default function DigitalWellnessAssessment() {
  const [currentPhase, setCurrentPhase] = useState<AssessmentPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selfReportScores, setSelfReportScores] = useState<number[]>([]);
  const [scenarioScores, setScenarioScores] = useState<{ [key: string]: number }[]>([]);
  const [timeScores, setTimeScores] = useState<number[]>([]);
  const [behavioralScores, setBehavioralScores] = useState<{ [key: string]: number }[]>([]);
  const [currentResponse, setCurrentResponse] = useState<number | null>(null);
  const [timeEstimate, setTimeEstimate] = useState(0);
  const [appOrder, setAppOrder] = useState(appCategories);

  const tracker = useDigitalHabitsTracker();
  const scoring = useDigitalWellnessScoring();

  useEffect(() => {
    tracker.setCurrentPhase(currentPhase);
  }, [currentPhase, tracker.setCurrentPhase]);

  const handleStartAssessment = () => {
    setSelfReportScores(new Array(digitalWellnessQuestions.length).fill(0));
    setCurrentPhase('self-report');
    setCurrentIndex(0);
  };

  const handleSelfReportNext = () => {
    if (currentResponse === null) return;
    
    const newScores = [...selfReportScores];
    newScores[currentIndex] = currentResponse;
    setSelfReportScores(newScores);
    
    if (currentIndex < digitalWellnessQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentResponse(null);
    } else {
      setCurrentPhase('scenarios');
      setCurrentIndex(0);
      setScenarioScores([]);
    }
  };

  const handleScenarioNext = () => {
    if (currentResponse === null) return;
    
    const scenario = digitalScenarios[currentIndex];
    const selectedOption = scenario.options[currentResponse];
    setScenarioScores(prev => [...prev, selectedOption.scores]);
    
    if (currentIndex < digitalScenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentResponse(null);
    } else {
      setCurrentPhase('time-tasks');
      setCurrentIndex(0);
      setTimeScores([]);
    }
  };

  const handleTimeTaskNext = () => {
    const task = timeTasks[currentIndex];
    const actual = task.typicalRange.min + Math.random() * (task.typicalRange.max - task.typicalRange.min);
    const accuracy = Math.max(0, 100 - Math.abs(timeEstimate - actual) / actual * 100);
    
    tracker.recordTimeEstimation(task.activity, timeEstimate, actual);
    setTimeScores(prev => [...prev, accuracy]);
    
    if (currentIndex < timeTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeEstimate(0);
    } else {
      setCurrentPhase('behavioral');
      setCurrentIndex(0);
      setBehavioralScores([]);
    }
  };

  const handleBehavioralNext = () => {
    const simulation = behavioralSimulations[currentIndex];
    let scores = simulation.scoring.balancedMix; // Default scoring
    
    if (simulation.type === 'appUsage') {
      const workApps = appOrder.slice(0, 3).filter(app => app.id === 'work').length;
      const socialApps = appOrder.slice(0, 3).filter(app => app.id === 'social').length;
      
      if (workApps > socialApps) {
        scores = simulation.scoring.workFirst;
      } else if (socialApps > workApps) {
        scores = simulation.scoring.socialFirst;
      }
    }
    
    setBehavioralScores(prev => [...prev, scores]);
    
    if (currentIndex < behavioralSimulations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    const behavioralInsights = tracker.generateBehavioralInsights();
    const results = scoring.calculateScores(
      selfReportScores,
      scenarioScores,
      timeScores,
      behavioralScores,
      behavioralInsights
    );
    setCurrentPhase('results');
    tracker.cleanup();
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'intro':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🧠</div>
              <CardTitle className="text-3xl mb-2">Digital Wellness Assessment</CardTitle>
              <p className="text-lg text-muted-foreground">
                Comprehensive evaluation of your digital life balance with real-time behavioral tracking
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Brain className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm">Self-Report</span>
                  <Badge variant="outline">{digitalWellnessQuestions.length} questions</Badge>
                </div>
                <div className="flex flex-col items-center">
                  <Smartphone className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm">Scenarios</span>
                  <Badge variant="outline">{digitalScenarios.length} situations</Badge>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-orange-500 mb-2" />
                  <span className="text-sm">Time Tasks</span>
                  <Badge variant="outline">{timeTasks.length} estimations</Badge>
                </div>
                <div className="flex flex-col items-center">
                  <Target className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm">Behavioral</span>
                  <Badge variant="outline">{behavioralSimulations.length} simulations</Badge>
                </div>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border">
                <p className="text-sm text-amber-800">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  This assessment tracks your interaction patterns (tab switches, clicks, scrolling) 
                  to provide authentic insights. All data is processed locally and privately.
                </p>
              </div>
              <Button onClick={handleStartAssessment} size="lg" className="w-full">
                Begin Assessment
              </Button>
            </CardContent>
          </Card>
        );

      case 'self-report':
        const question = digitalWellnessQuestions[currentIndex];
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Digital Habits Self-Assessment</CardTitle>
                <Badge variant="outline">{currentIndex + 1} of {digitalWellnessQuestions.length}</Badge>
              </div>
              <Progress value={((currentIndex + 1) / digitalWellnessQuestions.length) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg font-medium">{question.text}</p>
              <div className="space-y-3">
                {['Never', 'Rarely', 'Sometimes', 'Often', 'Always'].map((label, value) => (
                  <label key={value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="response"
                      value={value + 1}
                      checked={currentResponse === value + 1}
                      onChange={() => setCurrentResponse(value + 1)}
                      className="text-primary"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <Button onClick={handleSelfReportNext} disabled={currentResponse === null} className="w-full">
                {currentIndex === digitalWellnessQuestions.length - 1 ? 'Complete Section' : 'Next Question'}
              </Button>
            </CardContent>
          </Card>
        );

      case 'results':
        if (!scoring.results) return <div>Loading results...</div>;
        
        const { overall, dimensions, riskAssessment, validity } = scoring.results;
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Your Digital Wellness Profile</CardTitle>
                <div className="text-4xl font-bold text-primary">{overall}%</div>
                <p className="text-muted-foreground">Overall Digital Wellness Score</p>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(dimensions).map(([key, dimension]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <Badge variant={dimension.level === 'excellent' ? 'default' : 
                                   dimension.level === 'good' ? 'secondary' : 'destructive'}>
                        {dimension.level}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">{dimension.percentage}%</div>
                    <p className="text-sm text-muted-foreground">{dimension.interpretation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(riskAssessment).map(([key, risk]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-semibold capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className={`text-2xl font-bold ${
                        risk.level === 'high' ? 'text-red-500' :
                        risk.level === 'moderate' ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {risk.level.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">{risk.score}% risk</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Assessment Validity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={validity.overallValidity === 'valid' ? 'default' : 
                              validity.overallValidity === 'questionable' ? 'secondary' : 'destructive'}>
                  {validity.overallValidity.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Response authenticity: {validity.responseConsistency}% | 
                  Time awareness alignment: {validity.timeAwarenessAlignment}%
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto py-8">
        {renderPhase()}
      </div>
    </div>
  );
}