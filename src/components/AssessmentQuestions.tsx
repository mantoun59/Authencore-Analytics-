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
import AssessmentErrorBoundary from "@/components/AssessmentErrorBoundary";

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
  const [lastAnswer, setLastAnswer] = useState<string>('');
  const [quickAdvanceTimer, setQuickAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

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
      // Phase 0 - Baseline
      { id: "em1", text: "When facing a tight deadline, I typically:", options: ["Remain calm and focused", "Feel energized by pressure", "Experience some anxiety but push through", "Feel overwhelmed", "Panic and struggle"], phase: 0 },
      { id: "em2", text: "After a significant setback at work, I usually:", options: ["Quickly bounce back", "Take time but recover within a day", "Need several days to recover", "Struggle for weeks", "Feel affected for months"], phase: 0 },
      { id: "em3", text: "My emotional response to criticism is:", options: ["Use it constructively", "Initially defensive but then reflect", "Feel hurt but try to learn", "Take it very personally", "Become very upset"], phase: 0 },
      
      // Phase 1 - Progressive Stress
      { id: "em4", text: "URGENT: Project presentation in 2 hours, data corrupted. Your reaction:", options: ["Calmly assess backup options", "Feel stressed but problem-solve", "Panic but force action", "Feel paralyzed", "Blame others"], phase: 1 },
      { id: "em5", text: "PRESSURE: Multiple urgent requests flooding in. You feel:", options: ["Energized to tackle them", "Focused on prioritizing", "Somewhat overwhelmed but managing", "Very stressed", "Completely overwhelmed"], phase: 1 },
      { id: "em6", text: "STRESS TEST: Everything going wrong today. Your emotional state:", options: ["Staying positive", "Determined to push through", "Fighting negative thoughts", "Feeling defeated", "Completely demoralized"], phase: 1 },
      
      // Phase 2 - Recovery
      { id: "em7", text: "After that intense period, how do you feel now?", options: ["Energized and proud", "Tired but accomplished", "Drained but relieved", "Exhausted and stressed", "Burned out"], phase: 2 },
      { id: "em8", text: "Reflecting on your emotional responses:", options: ["Handled it perfectly", "Did well overall", "Had some difficult moments", "Struggled emotionally", "Was overwhelmed"], phase: 2 },
      
      // Phase 3 - Adaptability
      { id: "em9", text: "SURPRISE: Your role just completely changed. Emotional reaction:", options: ["Excited about new challenges", "Curious about possibilities", "Concerned but willing", "Anxious about uncertainty", "Upset and resistant"], phase: 3 },
      { id: "em10", text: "PIVOT: Everything you've worked on is scrapped. You feel:", options: ["Ready for the new direction", "Disappointed but adaptable", "Frustrated but will adjust", "Very upset about the loss", "Angry and resistant"], phase: 3 }
    ],
    
    cognitive: [
      // Phase 0 - Baseline
      { id: "cg1", text: "When solving complex problems under pressure, I:", options: ["Think more clearly", "Maintain usual ability", "Slight decline in quality", "Struggle to think clearly", "Cannot focus"], phase: 0 },
      { id: "cg2", text: "My approach to learning from failures is:", options: ["Immediately analyze lessons", "Reflect after some time", "Eventually learn from it", "Struggle to see lessons", "Avoid thinking about it"], phase: 0 },
      { id: "cg3", text: "When facing ambiguous situations, I:", options: ["Thrive in uncertainty", "Adapt quickly", "Take time to adjust", "Feel uncomfortable", "Struggle significantly"], phase: 0 },
      
      // Phase 1 - Progressive Stress  
      { id: "cg4", text: "URGENT: Regulations changed, 15 minutes to adapt. Your approach:", options: ["Quickly analyze and implement", "Systematically review and adapt", "Feel rushed but manage", "Struggle with time pressure", "Cannot process quickly enough"], phase: 1 },
      { id: "cg5", text: "CONFLICTING INFO: Getting contradictory instructions. You:", options: ["Seek clarification efficiently", "Compare sources systematically", "Feel confused but work through it", "Get paralyzed by confusion", "Make random decisions"], phase: 1 },
      { id: "cg6", text: "MULTITASKING CRISIS: 5 urgent tasks at once. Your thinking:", options: ["Clear prioritization system", "Good but strained focus", "Scattered but functional", "Very confused", "Complete mental chaos"], phase: 1 },
      
      // Phase 2 - Recovery
      { id: "cg7", text: "Looking back at your problem-solving:", options: ["Was very effective", "Generally good decisions", "Mixed results", "Made poor choices", "Completely ineffective"], phase: 2 },
      { id: "cg8", text: "Your ability to learn from this experience:", options: ["Extracted clear insights", "Identified key lessons", "Some useful takeaways", "Limited learning", "No useful insights"], phase: 2 },
      
      // Phase 3 - Adaptability
      { id: "cg9", text: "NEW RULES: Everything changes mid-task. Your mental approach:", options: ["Quickly recalibrate thinking", "Systematically adjust approach", "Gradually adapt mindset", "Struggle to switch gears", "Cannot adjust thinking"], phase: 3 },
      { id: "cg10", text: "INNOVATION NEEDED: Old solutions won't work. You:", options: ["Generate creative alternatives", "Methodically explore options", "Eventually find new approaches", "Struggle to innovate", "Stick to old methods"], phase: 3 }
    ],
    
    physical: [
      // Phase 0 - Baseline
      { id: "ph1", text: "During stressful periods, my sleep patterns:", options: ["Remain consistent", "Slightly affected", "Noticeably disrupted", "Severely impacted", "Completely disrupted"], phase: 0 },
      { id: "ph2", text: "My energy levels under normal stress:", options: ["Actually increase", "Stay stable", "Slightly decrease", "Noticeably drop", "Become exhausted"], phase: 0 },
      { id: "ph3", text: "Physical stress symptoms I typically experience:", options: ["None", "Very mild", "Some tension", "Noticeable symptoms", "Severe physical stress"], phase: 0 },
      
      // Phase 1 - Progressive Stress
      { id: "ph4", text: "RIGHT NOW: High stress phase. How is your body responding?", options: ["Feeling energized", "Slight tension", "Noticeable stress symptoms", "Significant discomfort", "Overwhelming physical response"], phase: 1 },
      { id: "ph5", text: "PHYSICAL CHECK: Heart rate, breathing, tension levels:", options: ["All normal", "Slightly elevated", "Noticeably increased", "Significantly stressed", "Physical distress"], phase: 1 },
      { id: "ph6", text: "ENDURANCE TEST: Can you maintain physical focus?", options: ["Absolutely", "Yes, with effort", "Struggling but managing", "Very difficult", "Cannot maintain"], phase: 1 },
      
      // Phase 2 - Recovery
      { id: "ph7", text: "Physical recovery after stress:", options: ["Immediately back to normal", "Quick recovery", "Taking some time", "Slow to recover", "Still feeling effects"], phase: 2 },
      { id: "ph8", text: "Your body's stress response patterns:", options: ["Very healthy", "Generally good", "Mixed patterns", "Concerning responses", "Poor stress response"], phase: 2 },
      
      // Phase 3 - Adaptability  
      { id: "ph9", text: "SUDDEN CHANGE: Physical adaptation to new demands:", options: ["Seamlessly adjust", "Quickly adapt", "Gradually adjust", "Struggle to adapt", "Cannot adjust"], phase: 3 },
      { id: "ph10", text: "STAMINA TEST: Sustained performance during change:", options: ["Excellent endurance", "Good stamina", "Moderate endurance", "Low stamina", "Quickly exhausted"], phase: 3 }
    ],
    
    social: [
      // Phase 0 - Baseline
      { id: "so1", text: "When overwhelmed at work, I:", options: ["Readily ask for help", "Eventually reach out", "Hesitate but sometimes ask", "Rarely ask for help", "Never ask others"], phase: 0 },
      { id: "so2", text: "My support network during stress:", options: ["Very strong and active", "Good support available", "Some support", "Limited support", "No real support"], phase: 0 },
      { id: "so3", text: "Building relationships under pressure:", options: ["Gets easier", "Stays the same", "Becomes harder", "Much more difficult", "Impossible"], phase: 0 },
      
      // Phase 1 - Progressive Stress
      { id: "so4", text: "CRISIS MODE: Need help NOW. Your approach:", options: ["Immediately reach out", "Quickly identify who to ask", "Struggle but eventually ask", "Reluctant to burden others", "Try to handle alone"], phase: 1 },
      { id: "so5", text: "TEAM PRESSURE: Everyone stressed. Your social behavior:", options: ["Support others too", "Focus on collaboration", "Withdraw slightly", "Become very internal", "Isolate completely"], phase: 1 },
      { id: "so6", text: "COMMUNICATION UNDER STRESS: Your interaction style:", options: ["Clear and direct", "Generally effective", "Sometimes unclear", "Often miscommunicate", "Poor communication"], phase: 1 },
      
      // Phase 2 - Recovery
      { id: "so7", text: "Reflecting on your help-seeking:", options: ["Used support well", "Got adequate help", "Should have asked more", "Didn't get enough help", "Handled alone poorly"], phase: 2 },
      { id: "so8", text: "Social connections after stress:", options: ["Stronger than before", "Maintained well", "Somewhat strained", "Damaged relationships", "Isolated"], phase: 2 },
      
      // Phase 3 - Adaptability
      { id: "so9", text: "NEW TEAM: Suddenly working with different people:", options: ["Excited to collaborate", "Adapt quickly to dynamics", "Gradually build rapport", "Struggle with new people", "Prefer working alone"], phase: 3 },
      { id: "so10", text: "SUPPORT PIVOT: Your usual help sources unavailable:", options: ["Easily find new support", "Actively build new connections", "Eventually find help", "Struggle to find support", "Give up on getting help"], phase: 3 }
    ],
    
    change: [
      // Phase 0 - Baseline
      { id: "ch1", text: "When facing unexpected organizational changes, I:", options: ["Embrace growth opportunities", "Adapt quickly", "Take time but adapt", "Struggle with uncertainty", "Resist and find difficult"], phase: 0 },
      { id: "ch2", text: "My comfort level with ambiguity:", options: ["Thrive in uncertainty", "Handle it well", "Manage with effort", "Feel uncomfortable", "Avoid ambiguous situations"], phase: 0 },
      { id: "ch3", text: "Learning new systems or processes:", options: ["Love the challenge", "Pick up quickly", "Learn steadily", "Find it stressful", "Resist new ways"], phase: 0 },
      
      // Phase 1 - Progressive Stress
      { id: "ch4", text: "URGENT PIVOT: Strategy completely changed. Your response:", options: ["Immediately embrace new direction", "Quickly understand and adapt", "Take time to process", "Feel resistant", "Struggle to accept"], phase: 1 },
      { id: "ch5", text: "CONSTANT FLUX: Rules keep changing. You:", options: ["Stay flexible and adapt", "Track changes systematically", "Feel frustrated but adapt", "Get confused and stressed", "Cannot keep up"], phase: 1 },
      { id: "ch6", text: "INNOVATION PRESSURE: Must be creative NOW:", options: ["Thrive under creative pressure", "Generate good ideas", "Struggle but produce something", "Feel blocked", "Cannot be creative"], phase: 1 },
      
      // Phase 2 - Recovery  
      { id: "ch7", text: "Adapting to changes during stress:", options: ["Handled excellently", "Managed well overall", "Had some difficulties", "Struggled significantly", "Could not adapt"], phase: 2 },
      { id: "ch8", text: "Your change resilience assessment:", options: ["Very adaptable", "Generally flexible", "Moderately adaptable", "Somewhat rigid", "Resist change"], phase: 2 },
      
      // Phase 3 - Adaptability
      { id: "ch9", text: "ROLE SHIFT: Responsibilities completely different:", options: ["Excited about new challenges", "Curious about possibilities", "Concerned but willing", "Anxious about uncertainty", "Upset and resistant"], phase: 3 },
      { id: "ch10", text: "FUTURE UNKNOWN: Next steps unclear. Your mindset:", options: ["Excited by possibilities", "Comfortable with unknown", "Somewhat anxious", "Very uncomfortable", "Want clear plans"], phase: 3 }
    ],
    
    performance: [
      // Phase 0 - Baseline
      { id: "pf1", text: "Under extreme pressure, my work quality:", options: ["Actually improves", "Remains high", "Slightly decreases", "Noticeably decreases", "Significantly decreases"], phase: 0 },
      { id: "pf2", text: "Meeting deadlines under stress:", options: ["Always meet them", "Usually meet them", "Sometimes struggle", "Often miss them", "Frequently miss"], phase: 0 },
      { id: "pf3", text: "My leadership during crises:", options: ["Step up naturally", "Lead when needed", "Support others' leadership", "Follow others", "Avoid responsibility"], phase: 0 },
      
      // Phase 1 - Progressive Stress
      { id: "pf4", text: "PERFORMANCE CHECK: Quality under current pressure:", options: ["Excellent work", "Good quality maintained", "Acceptable quality", "Quality suffering", "Poor quality work"], phase: 1 },
      { id: "pf5", text: "SPEED vs ACCURACY: Current balance:", options: ["Both excellent", "Good balance", "Favoring speed", "Favoring accuracy", "Both suffering"], phase: 1 },
      { id: "pf6", text: "LEADERSHIP NOW: How are you performing as a leader?", options: ["Strong decisive leadership", "Good guidance", "Adequate direction", "Struggling to lead", "Not leading"], phase: 1 },
      
      // Phase 2 - Recovery
      { id: "pf7", text: "Overall performance during stress:", options: ["Exceeded expectations", "Met expectations", "Mostly met expectations", "Below expectations", "Far below expectations"], phase: 2 },
      { id: "pf8", text: "Consistency under pressure:", options: ["Very consistent", "Generally consistent", "Some variability", "Quite inconsistent", "Very inconsistent"], phase: 2 },
      
      // Phase 3 - Adaptability
      { id: "pf9", text: "PERFORMANCE PIVOT: New success metrics. You:", options: ["Excel immediately", "Adapt performance well", "Gradually improve", "Struggle to meet new standards", "Cannot adapt performance"], phase: 3 },
      { id: "pf10", text: "LEADERSHIP SHIFT: Different leadership style needed:", options: ["Seamlessly adjust style", "Adapt leadership approach", "Gradually change style", "Struggle to adjust", "Cannot change approach"], phase: 3 }
    ]
  };

  // Flatten all questions and organize by phase
  const allQuestions = Object.values(questionBank).flat();
  const currentPhaseQuestions = allQuestions.filter(q => q.phase === currentPhase);

  // Auto-save progress to localStorage
  useEffect(() => {
    const saveProgress = () => {
      try {
        const progressData = {
          currentPhase,
          currentQuestion,
          responses,
          responseTime,
          stressLevel,
          timestamp: Date.now()
        };
        localStorage.setItem('assessment-progress', JSON.stringify(progressData));
      } catch (err) {
        console.warn('Could not save assessment progress:', err);
      }
    };
    
    if (Object.keys(responses).length > 0) {
      saveProgress();
    }
  }, [currentPhase, currentQuestion, responses, responseTime, stressLevel]);

  // Load saved progress on component mount
  useEffect(() => {
    const loadSavedProgress = () => {
      try {
        const saved = localStorage.getItem('assessment-progress');
        if (saved) {
          const progressData = JSON.parse(saved);
          // Only restore if saved within last 24 hours
          if (Date.now() - progressData.timestamp < 24 * 60 * 60 * 1000) {
            setIsRecovering(true);
            setCurrentPhase(progressData.currentPhase);
            setCurrentQuestion(progressData.currentQuestion);
            setResponses(progressData.responses);
            setResponseTime(progressData.responseTime);
            setStressLevel(progressData.stressLevel);
            setTimeout(() => setIsRecovering(false), 1000);
          } else {
            // Clear old data
            localStorage.removeItem('assessment-progress');
          }
        }
      } catch (err) {
        console.warn('Could not load saved progress:', err);
        setError('Error loading saved progress');
      }
    };
    
    loadSavedProgress();
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (error) return;
      
      const questionId = currentPhaseQuestions[currentQuestion]?.id;
      const currentAnswer = questionId ? responses[questionId] : '';
      
      // Number keys for quick answer selection
      if (e.key >= '1' && e.key <= '5') {
        const optionIndex = parseInt(e.key) - 1;
        if (currentQ && optionIndex < currentQ.options.length) {
          handleAnswer(optionIndex.toString());
          // Auto-advance if same answer selected twice quickly
          if (lastAnswer === optionIndex.toString()) {
            setTimeout(nextQuestion, 300);
          }
          setLastAnswer(optionIndex.toString());
        }
      }
      
      // Arrow keys for navigation
      if (e.key === 'ArrowRight' && currentAnswer) {
        nextQuestion();
      }
      if (e.key === 'ArrowLeft' && !(currentPhase === 0 && currentQuestion === 0)) {
        previousQuestion();
      }
      
      // Enter to advance if answered
      if (e.key === 'Enter' && currentAnswer) {
        nextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPhase, currentQuestion, responses, lastAnswer, error]);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Assessment error:', event.error);
      setError(`Connection error: ${event.error?.message || 'Unknown error'}`);
    };
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Assessment promise rejection:', event.reason);
      setError(`Network error: ${event.reason?.message || 'Connection failed'}`);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleAnswer = (value: string) => {
    try {
      const questionId = currentPhaseQuestions[currentQuestion]?.id;
      if (questionId) {
        const timeSpent = Date.now() - startTime;
        setResponseTime(prev => [...prev, timeSpent]);
        setResponses(prev => ({ ...prev, [questionId]: value }));
        
        // Quick advance if same answer selected
        if (lastAnswer === value && quickAdvanceTimer === null) {
          const timer = setTimeout(() => {
            nextQuestion();
            setQuickAdvanceTimer(null);
          }, 800);
          setQuickAdvanceTimer(timer);
        } else {
          if (quickAdvanceTimer) {
            clearTimeout(quickAdvanceTimer);
            setQuickAdvanceTimer(null);
          }
        }
        
        setLastAnswer(value);
        setError(null); // Clear any previous errors
        
        // Simulate stress increase in stress phases
        if (phases[currentPhase].stressMultiplier > 1) {
          setStressLevel(prev => Math.min(prev + 0.2, 5));
        }
      }
    } catch (err) {
      console.error('Error handling answer:', err);
      setError('Error saving your answer. Please try again.');
    }
  };

  const clearProgress = () => {
    try {
      localStorage.removeItem('assessment-progress');
      setError(null);
      setCurrentPhase(0);
      setCurrentQuestion(0);
      setResponses({});
      setResponseTime([]);
      setStressLevel(1);
    } catch (err) {
      console.error('Error clearing progress:', err);
    }
  };

  const retryFromError = () => {
    setError(null);
    setIsRecovering(false);
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
    try {
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
      // Clear saved progress on completion
      localStorage.removeItem('assessment-progress');
      onComplete(assessmentData);
    } catch (err) {
      console.error('Error completing assessment:', err);
      setError('Error submitting assessment. Please try again.');
    }
  };

  const totalQuestions = allQuestions.length;
  const completedQuestions = Object.keys(responses).length;
  const progress = (completedQuestions / totalQuestions) * 100;

  const currentQ = currentPhaseQuestions[currentQuestion];
  const currentAnswer = currentQ ? responses[currentQ.id] : '';
  const timeLimit = phases[currentPhase].timeLimit;
  const PhaseIcon = phases[currentPhase].icon;

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                  ⚠️ Connection Error
                </CardTitle>
                <CardDescription className="text-red-600 dark:text-red-400">
                  {error}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Don't worry! Your progress has been automatically saved. You can continue from where you left off.
                </p>
                <div className="flex gap-3">
                  <Button onClick={retryFromError} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={clearProgress} variant="destructive">
                    Start Over
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Progress: {Object.keys(responses).length} of {totalQuestions} questions completed
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AssessmentErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
      
      {/* Recovery notification */}
      {isRecovering && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Restored your progress! Continuing from where you left off...
          </div>
        </div>
      )}
      
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
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-muted/50 hover:border-muted-foreground/20 transition-all">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="text-sm leading-relaxed cursor-pointer flex-1"
                      >
                        <span className="inline-block w-6 text-xs text-muted-foreground">{index + 1}.</span>
                        {option}
                      </Label>
                      {lastAnswer === index.toString() && quickAdvanceTimer && (
                        <div className="text-xs text-blue-500 animate-pulse">
                          Auto-advancing...
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>💡 <strong>Quick tips:</strong></div>
                    <div>• Use number keys 1-5 to select answers quickly</div>
                    <div>• Press Enter or → to advance, ← to go back</div>
                    <div>• Select the same answer twice for auto-advance</div>
                    <div>• Your progress is automatically saved</div>
                  </div>
                </div>
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
    </AssessmentErrorBoundary>
  );
};

export default AssessmentQuestions;