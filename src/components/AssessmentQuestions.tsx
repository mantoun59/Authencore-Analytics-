import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Brain, Heart, Users, Zap, Target, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AssessmentQuestionsProps {
  onComplete: (data: any) => void;
}

const AssessmentQuestions = ({ onComplete }: AssessmentQuestionsProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [startTime, setStartTime] = useState(Date.now());
  const [responseTime, setResponseTime] = useState<number[]>([]);
  const [stressLevel, setStressLevel] = useState(1);

  const phases = [
    {
      name: "Baseline Establishment",
      description: "Calm state questions to establish your natural response patterns",
      duration: "10 minutes",
      icon: Heart,
      stressMultiplier: 1,
      timeLimit: null
    },
    {
      name: "Progressive Stress Loading", 
      description: "Increasing pressure scenarios with time constraints",
      duration: "20 minutes",
      icon: Zap,
      stressMultiplier: 2,
      timeLimit: 45
    },
    {
      name: "Recovery Assessment",
      description: "Post-stress evaluation and reflection",
      duration: "10 minutes", 
      icon: Brain,
      stressMultiplier: 1,
      timeLimit: null
    },
    {
      name: "Adaptability Challenges",
      description: "Unexpected changes and pivot scenarios",
      duration: "15 minutes",
      icon: Target,
      stressMultiplier: 3,
      timeLimit: 30
    }
  ];

  const questionBank = {
    emotional: [
      {
        id: "em1",
        text: "When facing a tight deadline, I typically:",
        options: [
          "Remain calm and focused on the task",
          "Feel energized by the pressure",
          "Experience some anxiety but push through",
          "Feel overwhelmed and struggle to concentrate",
          "Panic and have difficulty functioning"
        ],
        phase: 0
      },
      {
        id: "em2", 
        text: "After a significant setback at work, I usually:",
        options: [
          "Quickly bounce back and look for solutions",
          "Take time to process but recover within a day",
          "Need several days to fully recover",
          "Struggle to regain confidence for weeks",
          "Feel deeply affected for months"
        ],
        phase: 0
      },
      {
        id: "em3",
        text: "URGENT: Your project presentation is in 2 hours and the data is corrupted. Your immediate reaction is:",
        options: [
          "Calmly assess backup options",
          "Feel stressed but start problem-solving",
          "Experience panic but force myself to act",
          "Feel paralyzed by the situation",
          "Blame others for the failure"
        ],
        phase: 1
      }
    ],
    cognitive: [
      {
        id: "cg1",
        text: "When solving complex problems under pressure, I:",
        options: [
          "Think more clearly and creatively",
          "Maintain my usual problem-solving ability",
          "Notice slight decline in thinking quality",
          "Struggle to think clearly",
          "Cannot focus on solutions at all"
        ],
        phase: 0
      },
      {
        id: "cg2",
        text: "BREAKING: New regulations require immediate changes to your process. You have 15 minutes to adapt. Your approach:",
        options: [
          "Quickly analyze and implement changes",
          "Systematically review and adapt",
          "Feel rushed but manage to adapt",
          "Struggle with the time pressure",
          "Cannot process the changes quickly enough"
        ],
        phase: 1
      }
    ],
    physical: [
      {
        id: "ph1",
        text: "During stressful periods, my sleep patterns:",
        options: [
          "Remain consistent and restful",
          "Slightly affected but manageable",
          "Noticeably disrupted",
          "Severely impacted",
          "Completely disrupted"
        ],
        phase: 0
      },
      {
        id: "ph2",
        text: "Your stress levels are HIGH right now. How is your body responding?",
        options: [
          "Feeling energized and alert",
          "Slight tension but manageable",
          "Noticeable physical stress symptoms",
          "Significant physical discomfort",
          "Overwhelming physical stress response"
        ],
        phase: 1
      }
    ],
    social: [
      {
        id: "so1", 
        text: "When overwhelmed at work, I:",
        options: [
          "Readily ask colleagues for help",
          "Eventually reach out for support",
          "Hesitate but sometimes ask for help",
          "Rarely ask for assistance",
          "Never ask for help from others"
        ],
        phase: 0
      }
    ],
    change: [
      {
        id: "ch1",
        text: "When facing unexpected organizational changes, I:",
        options: [
          "Embrace the opportunity for growth",
          "Adapt quickly with minor adjustment",
          "Take time but eventually adapt",
          "Struggle with the uncertainty",
          "Resist and find it very difficult"
        ],
        phase: 0
      },
      {
        id: "ch2",
        text: "SURPRISE CHANGE: Your role responsibilities just shifted completely. Immediate reaction:",
        options: [
          "Excited about new challenges",
          "Curious about the possibilities", 
          "Concerned but willing to try",
          "Anxious about the uncertainty",
          "Upset and resistant to change"
        ],
        phase: 3
      }
    ],
    performance: [
      {
        id: "pf1",
        text: "Under extreme pressure, my work quality:",
        options: [
          "Actually improves",
          "Remains at the same high level",
          "Slightly decreases",
          "Noticeably decreases", 
          "Significantly decreases"
        ],
        phase: 0
      }
    ]
  };

  // Flatten all questions and organize by phase
  const allQuestions = Object.values(questionBank).flat();
  const currentPhaseQuestions = allQuestions.filter(q => q.phase === currentPhase);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleAnswer = (value: string) => {
    const questionId = currentPhaseQuestions[currentQuestion]?.id;
    if (questionId) {
      const timeSpent = Date.now() - startTime;
      setResponseTime(prev => [...prev, timeSpent]);
      setResponses(prev => ({ ...prev, [questionId]: value }));
      
      // Simulate stress increase in stress phases
      if (phases[currentPhase].stressMultiplier > 1) {
        setStressLevel(prev => Math.min(prev + 0.2, 5));
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentPhaseQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentPhase < phases.length - 1) {
      setCurrentPhase(prev => prev + 1);
      setCurrentQuestion(0);
      setStressLevel(1); // Reset stress for new phase
    } else {
      // Assessment complete
      completeAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1);
      const prevPhaseQuestions = allQuestions.filter(q => q.phase === currentPhase - 1);
      setCurrentQuestion(prevPhaseQuestions.length - 1);
    }
  };

  const completeAssessment = () => {
    const assessmentData = {
      responses,
      responseTime,
      phases,
      completedAt: Date.now(),
      stressPatterns: responseTime.map((time, index) => ({
        questionIndex: index,
        responseTime: time,
        stressLevel: index < responseTime.length / 2 ? 1 : stressLevel
      }))
    };
    onComplete(assessmentData);
  };

  const totalQuestions = allQuestions.length;
  const completedQuestions = Object.keys(responses).length;
  const progress = (completedQuestions / totalQuestions) * 100;

  const currentQ = currentPhaseQuestions[currentQuestion];
  const currentAnswer = currentQ ? responses[currentQ.id] : '';
  const timeLimit = phases[currentPhase].timeLimit;
  const PhaseIcon = phases[currentPhase].icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <PhaseIcon className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">{phases[currentPhase].name}</h2>
                  <p className="text-sm text-muted-foreground">{phases[currentPhase].description}</p>
                </div>
              </div>
              <Badge variant="outline">
                {completedQuestions + 1} of {totalQuestions}
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2 mb-2" />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Phase {currentPhase + 1} of {phases.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>

            {/* Stress Indicator for High-Stress Phases */}
            {phases[currentPhase].stressMultiplier > 1 && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-orange-700 dark:text-orange-300">
                    High-Pressure Phase Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-orange-600 dark:text-orange-400">Stress Level:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div 
                        key={level}
                        className={`w-3 h-3 rounded-full ${
                          level <= stressLevel 
                            ? 'bg-orange-500' 
                            : 'bg-orange-200 dark:bg-orange-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {timeLimit && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-600 dark:text-orange-400">
                      Time limit: {timeLimit} seconds per question
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Question Card */}
          {currentQ && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">
                  {currentQ.text}
                </CardTitle>
                {phases[currentPhase].stressMultiplier > 1 && (
                  <CardDescription className="text-red-600 dark:text-red-400 font-medium">
                    ⚡ High-pressure scenario - Answer quickly!
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={currentAnswer} 
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="text-sm leading-relaxed cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={previousQuestion}
              disabled={currentPhase === 0 && currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentAnswer && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {currentPhaseQuestions.length} in this phase
              </span>
            </div>

            <Button 
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className={phases[currentPhase].stressMultiplier > 1 ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {currentPhase === phases.length - 1 && currentQuestion === currentPhaseQuestions.length - 1 
                ? "Complete Assessment" 
                : "Next"
              }
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AssessmentQuestions;