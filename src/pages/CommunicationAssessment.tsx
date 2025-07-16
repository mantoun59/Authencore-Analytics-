import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  ArrowRight,
  ArrowLeft,
  Mic,
  Video,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { communicationQuestions, extendedQuestions, communicationProfiles } from '@/data/communicationQuestions';
import { useCommunicationScoring } from '@/hooks/useCommunicationScoring';
import { useToast } from '@/hooks/use-toast';

interface CommunicationAssessmentProps {
  onComplete?: (results: any) => void;
}

const CommunicationAssessment: React.FC<CommunicationAssessmentProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'assessment' | 'results'>('welcome');
  const [currentModule, setCurrentModule] = useState<'style_identification' | 'linguistic_analysis' | 'interactive_simulation' | 'adaptive_scenario'>('style_identification');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [moduleStartTime, setModuleStartTime] = useState<number>(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    role: '',
    industry: '',
    experience: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  
  const scoring = useCommunicationScoring();
  const { toast } = useToast();

  // Get questions for current module
  const allQuestions = [...communicationQuestions, ...extendedQuestions];
  const currentModuleQuestions = allQuestions.filter(q => q.module === currentModule);
  const currentQuestion = currentModuleQuestions[currentQuestionIndex];

  // Progress tracking
  const totalQuestions = allQuestions.length;
  const completedQuestions = scoring.responses.length;
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  const modules = [
    { id: 'style_identification', name: 'Style Identification', icon: Target, duration: 15, questions: 25 },
    { id: 'linguistic_analysis', name: 'Linguistic Analysis', icon: Brain, duration: 10, questions: 15 },
    { id: 'interactive_simulation', name: 'Interactive Simulation', icon: Users, duration: 20, questions: 25 },
    { id: 'adaptive_scenario', name: 'Adaptive Scenarios', icon: Zap, duration: 15, questions: 15 }
  ];

  const currentModuleInfo = modules.find(m => m.id === currentModule);

  useEffect(() => {
    if (currentPhase === 'assessment' && startTime === 0) {
      setStartTime(Date.now());
      setModuleStartTime(Date.now());
    }
  }, [currentPhase, startTime]);

  const handleStartAssessment = () => {
    if (!userProfile.name || !userProfile.role) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile to begin the assessment.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentPhase('assessment');
    setStartTime(Date.now());
    setModuleStartTime(Date.now());
  };

  const handleResponse = useCallback((response: any) => {
    const responseTime = Date.now() - moduleStartTime;
    
    scoring.processResponse(
      currentQuestion.id,
      response,
      responseTime,
      currentModule
    );

    // Move to next question
    if (currentQuestionIndex < currentModuleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setModuleStartTime(Date.now());
    } else {
      // Module complete
      setCompletedModules(prev => new Set([...prev, currentModule]));
      
      // Move to next module
      const currentModuleIndex = modules.findIndex(m => m.id === currentModule);
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        setCurrentModule(nextModule.id as any);
        setCurrentQuestionIndex(0);
        setModuleStartTime(Date.now());
        
        toast({
          title: "Module Complete!",
          description: `${currentModuleInfo?.name} completed. Starting ${nextModule.name}...`,
        });
      } else {
        // Assessment complete
        setCurrentPhase('results');
        toast({
          title: "Assessment Complete!",
          description: "Generating your communication profile...",
        });
        
        if (onComplete) {
          onComplete(generateResults());
        }
      }
    }
  }, [currentQuestion, currentQuestionIndex, currentModuleQuestions, currentModule, moduleStartTime, scoring, modules, currentModuleInfo, onComplete]);

  const generateResults = () => {
    const cei = scoring.calculateCEI();
    const dna = scoring.calculateCommunicationDNA();
    const primaryProfile = scoring.determinePrimaryProfile();
    const teamCompatibility = scoring.calculateTeamCompatibility();
    const successProbabilities = scoring.generateSuccessProbabilities();
    
    return {
      userProfile,
      primaryProfile,
      scores: scoring.scores,
      cei,
      dna,
      teamCompatibility,
      successProbabilities,
      linguisticAnalysis: scoring.linguisticAnalysis,
      responses: scoring.responses,
      completionTime: Date.now() - startTime
    };
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <MessageSquare className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-4">Communication Styles Assessment</CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Discover how you connect, influence, and collaborate with others
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Your Role/Title"
                  value={userProfile.role}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Select value={userProfile.industry} onValueChange={(value) => setUserProfile(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={userProfile.experience} onValueChange={(value) => setUserProfile(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Years of Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="16+">16+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assessment Overview</h3>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={module.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <module.icon className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-muted-foreground">{module.duration} min • {module.questions} questions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleStartAssessment}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3"
            >
              Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssessmentScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{currentModuleInfo?.name}</h2>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{currentModuleInfo?.icon && <currentModuleInfo.icon className="h-4 w-4 mr-1" />}Module {modules.findIndex(m => m.id === currentModule) + 1}/4</Badge>
              <Badge variant="outline">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor((Date.now() - moduleStartTime) / 1000)}s
              </Badge>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Question {currentQuestionIndex + 1} of {currentModuleQuestions.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>

        {/* Question Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentQuestion?.type === 'scenario' && <Users className="h-5 w-5" />}
              {currentQuestion?.type === 'written_response' && <Brain className="h-5 w-5" />}
              {currentQuestion?.type === 'simulation' && <Zap className="h-5 w-5" />}
              {currentQuestion?.type === 'multiple_choice' && <Target className="h-5 w-5" />}
              <span>{currentQuestion?.question}</span>
            </CardTitle>
            {currentQuestion?.context && (
              <CardDescription className="text-base">
                {currentQuestion.context}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {renderQuestionContent()}
          </CardContent>
        </Card>

        {/* Module Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {modules.map((module, index) => (
              <Badge 
                key={module.id}
                variant={module.id === currentModule ? "default" : completedModules.has(module.id) ? "secondary" : "outline"}
                className="px-3 py-1"
              >
                {completedModules.has(module.id) && <CheckCircle className="h-3 w-3 mr-1" />}
                {module.name}
              </Badge>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Total Progress: {completedQuestions}/{totalQuestions} questions
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'scenario':
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full p-4 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-800"
                onClick={() => handleResponse(option)}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    {option.id}
                  </div>
                  <div>{option.text}</div>
                </div>
              </Button>
            ))}
          </div>
        );
      
      case 'written_response':
        return <WrittenResponseComponent question={currentQuestion} onResponse={handleResponse} />;
      
      case 'simulation':
        return <SimulationComponent question={currentQuestion} onResponse={handleResponse} />;
      
      case 'ranking':
        return <RankingComponent question={currentQuestion} onResponse={handleResponse} />;
      
      default:
        return <div>Question type not supported</div>;
    }
  };

  const renderResultsScreen = () => {
    const results = generateResults();
    const primaryProfile = communicationProfiles.find(p => p.id === results.primaryProfile);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-xl text-muted-foreground">
              Your communication style has been analyzed across {totalQuestions} questions
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Communication Profile</TabsTrigger>
              <TabsTrigger value="effectiveness">Effectiveness Index</TabsTrigger>
              <TabsTrigger value="team">Team Compatibility</TabsTrigger>
              <TabsTrigger value="development">Development Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Primary Communication Style</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-3xl font-bold text-blue-600">{primaryProfile?.name}</div>
                      <p className="text-muted-foreground">{primaryProfile?.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Key Characteristics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {primaryProfile?.characteristics.map((char, index) => (
                            <Badge key={index} variant="secondary">{char}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Communication DNA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Assertiveness</span>
                        <span className="font-semibold">{Math.round(results.dna.assertiveness * 100)}%</span>
                      </div>
                      <Progress value={results.dna.assertiveness * 100} />
                      
                      <div className="flex justify-between items-center">
                        <span>Responsiveness</span>
                        <span className="font-semibold">{Math.round(results.dna.responsiveness * 100)}%</span>
                      </div>
                      <Progress value={results.dna.responsiveness * 100} />
                      
                      <div className="flex justify-between items-center">
                        <span>Flexibility</span>
                        <span className="font-semibold">{Math.round(results.dna.flexibilityScore * 100)}%</span>
                      </div>
                      <Progress value={results.dna.flexibilityScore * 100} />
                      
                      <div className="flex justify-between items-center">
                        <span>Team Synergy</span>
                        <span className="font-semibold">{Math.round(results.dna.teamSynergy * 100)}%</span>
                      </div>
                      <Progress value={results.dna.teamSynergy * 100} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Channel Effectiveness</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(results.dna.channelMatrix).map(([channel, score]) => (
                      <div key={channel} className="text-center space-y-2">
                        <div className="font-medium capitalize">{channel.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-2xl font-bold text-blue-600">{Math.round(score * 100)}%</div>
                        <Progress value={score * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effectiveness" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Communication Effectiveness Index</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-blue-600">
                        {Math.round(results.cei.overall * 100)}%
                      </div>
                      <p className="text-muted-foreground">Overall Communication Effectiveness</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Natural Style</span>
                          <span>{Math.round(results.cei.breakdown.naturalStyle * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Adaptability</span>
                          <span>{Math.round(results.cei.breakdown.adaptability * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Channel Mastery</span>
                          <span>{Math.round(results.cei.breakdown.channelMastery * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficult Conversations</span>
                          <span>{Math.round(results.cei.breakdown.difficultConversations * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Success Probabilities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(results.successProbabilities).map(([area, probability]) => (
                        <div key={area} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{area.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-semibold">{Math.round(probability * 100)}%</span>
                          </div>
                          <Progress value={probability * 100} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Compatibility Matrix</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(results.teamCompatibility).map(([profile, compatibility]) => {
                      const profileData = communicationProfiles.find(p => p.id === profile);
                      return (
                        <div key={profile} className="text-center space-y-3 p-4 border rounded-lg">
                          <div className="font-medium">{profileData?.name}</div>
                          <div className="text-2xl font-bold" style={{ color: compatibility > 0.7 ? '#10b981' : compatibility > 0.4 ? '#f59e0b' : '#ef4444' }}>
                            {Math.round(compatibility * 100)}%
                          </div>
                          <Progress value={compatibility * 100} />
                          <div className="text-sm text-muted-foreground">
                            {compatibility > 0.7 ? 'Excellent' : compatibility > 0.4 ? 'Good' : 'Challenging'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {primaryProfile?.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span>Development Areas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {primaryProfile?.blindSpots.map((blindSpot, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span>{blindSpot}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  // Render different screens based on current phase
  switch (currentPhase) {
    case 'welcome':
      return renderWelcomeScreen();
    case 'assessment':
      return renderAssessmentScreen();
    case 'results':
      return renderResultsScreen();
    default:
      return renderWelcomeScreen();
  }
};

// Sub-components for different question types
const WrittenResponseComponent: React.FC<{ question: any; onResponse: (response: string) => void }> = ({ question, onResponse }) => {
  const [response, setResponse] = useState('');
  const [timeLeft, setTimeLeft] = useState(question.timeLimit || 300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onResponse(response);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [response, onResponse]);

  const handleSubmit = () => {
    if (response.trim()) {
      onResponse(response);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{question.writtenPrompt}</p>
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Badge>
      </div>
      
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Type your response here..."
        className="min-h-32"
      />
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {response.length} characters
        </span>
        <Button 
          onClick={handleSubmit} 
          disabled={!response.trim()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Submit Response
        </Button>
      </div>
    </div>
  );
};

const SimulationComponent: React.FC<{ question: any; onResponse: (response: any) => void }> = ({ question, onResponse }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Simulation Scenario</h4>
        <p>{question.context}</p>
      </div>
      
      <div className="space-y-3">
        {question.options?.map((option: any, index: number) => (
          <Button
            key={option.id}
            variant="outline"
            className="w-full p-4 h-auto text-left justify-start"
            onClick={() => onResponse(option)}
          >
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                {option.id}
              </div>
              <div>{option.text}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

const RankingComponent: React.FC<{ question: any; onResponse: (response: any) => void }> = ({ question, onResponse }) => {
  const [rankings, setRankings] = useState<Array<{ id: string; text: string; rank: number }>>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetRank: number) => {
    e.preventDefault();
    if (draggedItem) {
      // Update rankings logic would go here
      setDraggedItem(null);
    }
  };

  const handleSubmit = () => {
    if (rankings.length === question.options?.length) {
      onResponse({ rankings });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Drag and drop to rank these options from most to least preferred:
      </p>
      
      <div className="space-y-2">
        {question.options?.map((option: any, index: number) => (
          <div
            key={option.id}
            draggable
            onDragStart={(e) => handleDragStart(e, option.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index + 1)}
            className="p-3 border border-gray-300 rounded-lg cursor-move hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div>{option.text}</div>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={rankings.length !== question.options?.length}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Submit Rankings
      </Button>
    </div>
  );
};

export default CommunicationAssessment;