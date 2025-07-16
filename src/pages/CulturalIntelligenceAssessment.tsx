import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Users, 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  ArrowRight,
  ArrowLeft,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Star,
  Trophy,
  Map,
  BookOpen
} from 'lucide-react';
import { culturalScenarios, culturalChallenges, CulturalScenario, CulturalChallenge } from '@/data/culturalScenarios';
import { useCQScoring } from '@/hooks/useCQScoring';
import { useToast } from '@/hooks/use-toast';
import { EmailAdaptationChallenge } from '@/components/EmailAdaptationChallenge';
import { MeetingSchedulingChallenge } from '@/components/MeetingSchedulingChallenge';

interface CulturalIntelligenceAssessmentProps {
  onComplete?: (results: any) => void;
}

interface UserProfile {
  culturalBackground: string;
  countriesLived: string[];
  languages: Array<{ language: string; proficiency: string }>;
  internationalExperience: string;
}

const CulturalIntelligenceAssessment: React.FC<CulturalIntelligenceAssessmentProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'background' | 'assessment' | 'challenges' | 'results'>('welcome');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    culturalBackground: '',
    countriesLived: [],
    languages: [{ language: '', proficiency: '' }],
    internationalExperience: ''
  });
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [startTime, setStartTime] = useState<number>(0);
  const [showContextHelp, setShowContextHelp] = useState(false);
  
  const cqScoring = useCQScoring();
  const { toast } = useToast();

  const currentScenario = culturalScenarios[currentScenarioIndex];
  const currentChallenge = culturalChallenges[currentChallengeIndex];

  // Progress tracking
  const totalScenarios = culturalScenarios.length;
  const totalChallenges = culturalChallenges.length;
  const assessmentProgress = (currentScenarioIndex / totalScenarios) * 100;
  const challengeProgress = (currentChallengeIndex / totalChallenges) * 100;

  useEffect(() => {
    if (currentPhase === 'assessment' && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [currentPhase, startTime]);

  const handleStartAssessment = () => {
    if (!userProfile.culturalBackground || !userProfile.internationalExperience) {
      toast({
        title: "Profile Required",
        description: "Please complete your cultural background profile to begin.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentPhase('assessment');
    setStartTime(Date.now());
  };

  const handleScenarioResponse = useCallback((response: any) => {
    cqScoring.processScenarioResponse(currentScenario, response, confidenceLevel);
    
    // Move to next scenario
    if (currentScenarioIndex < totalScenarios - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setConfidenceLevel(3); // Reset confidence
      
      toast({
        title: "Response Recorded",
        description: `Scenario ${currentScenarioIndex + 1}/${totalScenarios} complete`,
      });
    } else {
      // Move to challenges phase
      setCurrentPhase('challenges');
      toast({
        title: "Scenarios Complete!",
        description: "Moving to interactive challenges...",
      });
    }
  }, [currentScenario, confidenceLevel, currentScenarioIndex, totalScenarios, cqScoring, toast]);

  const handleChallengeComplete = useCallback((challengeResults: any) => {
    // Process challenge results
    if (currentChallenge.type === 'email_adaptation') {
      cqScoring.processEmailChallenge(currentChallenge, challengeResults);
    }
    
    // Move to next challenge
    if (currentChallengeIndex < totalChallenges - 1) {
      setCurrentChallengeIndex(prev => prev + 1);
      
      toast({
        title: "Challenge Complete",
        description: `Challenge ${currentChallengeIndex + 1}/${totalChallenges} finished`,
      });
    } else {
      // Assessment complete
      setCurrentPhase('results');
      toast({
        title: "Assessment Complete!",
        description: "Generating your Cultural Intelligence profile...",
      });
      
      if (onComplete) {
        onComplete(generateResults());
      }
    }
  }, [currentChallenge, currentChallengeIndex, totalChallenges, cqScoring, onComplete, toast]);

  const generateResults = () => {
    const overallScore = cqScoring.getOverallCQScore();
    const cqLevel = cqScoring.getCQLevel();
    const dimensions = cqScoring.dimensions;
    const culturalProfiles = cqScoring.culturalProfiles;
    const strengthsWeaknesses = cqScoring.identifyStrengthsAndWeaknesses();
    
    return {
      userProfile,
      overallScore,
      cqLevel,
      dimensions,
      culturalProfiles,
      strengthsWeaknesses,
      scenarioHistory: cqScoring.scenarioHistory,
      completionTime: Date.now() - startTime
    };
  };

  const addLanguage = () => {
    setUserProfile(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', proficiency: '' }]
    }));
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    setUserProfile(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                <Globe className="h-16 w-16 text-white animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="absolute top-4 -left-4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Brain className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Cultural Intelligence Assessment
          </CardTitle>
          <CardDescription className="text-xl text-muted-foreground">
            Discover your ability to thrive in diverse global environments
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Real-World Scenarios</h3>
                <p className="text-sm text-muted-foreground">Navigate authentic cross-cultural business situations</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2">Communication Challenges</h3>
                <p className="text-sm text-muted-foreground">Adapt your style across cultural contexts</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Global Collaboration</h3>
                <p className="text-sm text-muted-foreground">Build relationships across cultural boundaries</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center space-y-4">
            <Button 
              onClick={() => setCurrentPhase('background')}
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-8 py-3"
            >
              Begin Your Global Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Assessment Duration: 20-30 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackgroundScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Tell Us About Your Cultural Journey</span>
            </CardTitle>
            <CardDescription>
              This information helps us provide more relevant scenarios and insights
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cultural Background</label>
              <Input
                placeholder="e.g., Korean-American, British-Indian, Mexican"
                value={userProfile.culturalBackground}
                onChange={(e) => setUserProfile(prev => ({ ...prev, culturalBackground: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">How would you describe your cultural heritage?</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Countries Lived In (1+ years)</label>
              <Input
                placeholder="e.g., United States, Japan, Brazil"
                value={userProfile.countriesLived.join(', ')}
                onChange={(e) => setUserProfile(prev => ({ 
                  ...prev, 
                  countriesLived: e.target.value.split(',').map(c => c.trim()).filter(c => c.length > 0)
                }))}
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium">Languages You Speak</label>
              {userProfile.languages.map((lang, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Language"
                    value={lang.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                  />
                  <Select value={lang.proficiency} onValueChange={(value) => updateLanguage(index, 'proficiency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="native">Native/Bilingual</SelectItem>
                      <SelectItem value="fluent">Fluent</SelectItem>
                      <SelectItem value="professional">Professional Working</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button variant="outline" onClick={addLanguage} className="w-full">
                + Add Another Language
              </Button>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium">International Work Experience</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'none', label: 'No international experience', desc: 'Limited exposure to global work' },
                  { value: 'some', label: 'Some international projects', desc: 'Occasional cross-cultural work' },
                  { value: 'moderate', label: 'Regular international collaboration', desc: 'Frequent global teamwork' },
                  { value: 'extensive', label: 'Extensive global experience', desc: 'Deep international expertise' }
                ].map((option) => (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      userProfile.internationalExperience === option.value 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setUserProfile(prev => ({ ...prev, internationalExperience: option.value }))}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          userProfile.internationalExperience === option.value 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`} />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">{option.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentPhase('welcome')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button onClick={handleStartAssessment} className="bg-gradient-to-r from-blue-500 to-indigo-500">
                Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAssessmentScreen = () => {
    if (!currentScenario) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Cultural Intelligence Assessment</h2>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  <Target className="h-4 w-4 mr-1" />
                  Scenario {currentScenarioIndex + 1}/{totalScenarios}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor((Date.now() - startTime) / 1000 / 60)}min
                </Badge>
              </div>
            </div>
            <Progress value={assessmentProgress} className="h-2" />
          </div>

          {/* CQ Dimensions Tracker */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {['drive', 'knowledge', 'strategy', 'action'].map((dimension) => (
              <Card key={dimension}>
                <CardContent className="pt-4">
                  <div className="text-center">
                    <div className="text-sm font-medium capitalize mb-2">CQ {dimension}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((cqScoring.dimensions[dimension as keyof typeof cqScoring.dimensions]?.score || 0) * 2, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round((cqScoring.dimensions[dimension as keyof typeof cqScoring.dimensions]?.score || 0) * 2)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Scenario Display */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{currentScenario.location.flag}</div>
                  <div>
                    <CardTitle className="text-lg">{currentScenario.title}</CardTitle>
                    <CardDescription>
                      {currentScenario.location.city}, {currentScenario.location.country} • {currentScenario.industry}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Badge variant="secondary">{currentScenario.type.replace('_', ' ')}</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Scenario Description */}
              <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-base leading-relaxed">{currentScenario.description}</p>
              </div>
              
              {/* Cultural Context Helper */}
              <div className="border border-amber-200 dark:border-amber-800 rounded-lg">
                <Button
                  variant="ghost"
                  onClick={() => setShowContextHelp(!showContextHelp)}
                  className="w-full justify-between p-4 h-auto"
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span>Cultural Context & Tips</span>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-transform ${showContextHelp ? 'rotate-90' : ''}`} />
                </Button>
                
                {showContextHelp && (
                  <div className="px-4 pb-4 border-t border-amber-200 dark:border-amber-800">
                    <ul className="space-y-2 mt-4">
                      {currentScenario.culturalContext.map((context, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{context}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Response Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">What would you do?</h4>
                
                <div className="space-y-3">
                  {currentScenario.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full p-6 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-800 transition-all"
                      onClick={() => handleScenarioResponse(option)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="text-left">
                          <p className="leading-relaxed">{option.text}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Confidence Slider */}
              <div className="space-y-4">
                <label className="font-medium">How confident are you in your choice?</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not Sure</span>
                    <span>Somewhat</span>
                    <span>Confident</span>
                    <span>Very Sure</span>
                    <span>Certain</span>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">
                      Confidence: {['', 'Not Sure', 'Somewhat', 'Confident', 'Very Sure', 'Certain'][confidenceLevel]}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderChallengesScreen = () => {
    if (!currentChallenge) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Interactive Cultural Challenges</h2>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  <Zap className="h-4 w-4 mr-1" />
                  Challenge {currentChallengeIndex + 1}/{totalChallenges}
                </Badge>
              </div>
            </div>
            <Progress value={challengeProgress} className="h-2" />
          </div>

          {/* Challenge Content */}
          {currentChallenge.type === 'email_adaptation' && (
            <EmailAdaptationChallenge
              challenge={currentChallenge}
              onComplete={handleChallengeComplete}
            />
          )}
          
          {currentChallenge.type === 'meeting_scheduling' && (
            <MeetingSchedulingChallenge
              challenge={currentChallenge}
              onComplete={handleChallengeComplete}
            />
          )}
        </div>
      </div>
    );
  };

  const renderResultsScreen = () => {
    const results = generateResults();
    const overallScore = results.overallScore;
    const dimensions = results.dimensions;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Your Cultural Intelligence Profile</h1>
            <p className="text-xl text-muted-foreground">
              Understanding your ability to work effectively across cultures
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">CQ Overview</TabsTrigger>
              <TabsTrigger value="dimensions">Four Dimensions</TabsTrigger>
              <TabsTrigger value="cultural">Cultural Map</TabsTrigger>
              <TabsTrigger value="development">Development Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overall CQ Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-6 w-6" />
                    <span>Overall Cultural Intelligence Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <div className="text-white">
                            <div className="text-3xl font-bold">{Math.round(overallScore)}</div>
                            <div className="text-sm">CQ Score</div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-green-600">{results.cqLevel}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Your Cultural Intelligence score indicates {overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'developing' : 'emerging'} capabilities 
                        for navigating cross-cultural environments and building effective global relationships.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Global Readiness</span>
                          <span>{overallScore >= 70 ? 'High' : overallScore >= 50 ? 'Moderate' : 'Developing'}</span>
                        </div>
                        <Progress value={overallScore} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-6">
              {/* Four CQ Dimensions */}
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(dimensions).map(([key, dimension]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 capitalize">
                        {key === 'drive' && <Target className="h-5 w-5" />}
                        {key === 'knowledge' && <Brain className="h-5 w-5" />}
                        {key === 'strategy' && <BarChart3 className="h-5 w-5" />}
                        {key === 'action' && <Users className="h-5 w-5" />}
                        <span>CQ {key}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Score</span>
                          <Badge variant="secondary">{Math.round(dimension.score * 2)}/100</Badge>
                        </div>
                        <Progress value={dimension.score * 2} className="h-3" />
                        
                        <div className="text-sm text-muted-foreground">
                          {key === 'drive' && 'Your motivation and interest in experiencing other cultures'}
                          {key === 'knowledge' && 'Your understanding of cultural systems and differences'}
                          {key === 'strategy' && 'Your ability to plan and check cultural interactions'}
                          {key === 'action' && 'Your capability to adapt behavior when needed'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cultural" className="space-y-6">
              {/* Cultural Competency Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="h-6 w-6" />
                    <span>Your Cultural Competency Map</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(results.culturalProfiles).map(([country, profile]) => (
                      <Card key={country} className="border-2">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{country}</span>
                            <Badge 
                              variant={profile.averageAppropriateness > 0.7 ? 'default' : 
                                     profile.averageAppropriateness > 0.4 ? 'secondary' : 'destructive'}
                            >
                              {profile.averageAppropriateness > 0.7 ? 'Strong' : 
                               profile.averageAppropriateness > 0.4 ? 'Moderate' : 'Developing'}
                            </Badge>
                          </div>
                          <Progress value={profile.averageAppropriateness * 100} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {profile.interactions} interaction{profile.interactions !== 1 ? 's' : ''}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development" className="space-y-6">
              {/* Development Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Your CQ Development Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        step: 1,
                        title: "Expand Cultural Knowledge",
                        description: "Study the cultural frameworks and business practices of key regions you work with.",
                        icon: <Brain className="h-5 w-5" />
                      },
                      {
                        step: 2,
                        title: "Practice Active Cultural Strategy",
                        description: "Before cross-cultural interactions, research and plan your approach based on cultural context.",
                        icon: <Target className="h-5 w-5" />
                      },
                      {
                        step: 3,
                        title: "Develop Behavioral Flexibility",
                        description: "Practice adapting your communication style and behavior to match cultural expectations.",
                        icon: <Users className="h-5 w-5" />
                      }
                    ].map((step) => (
                      <div key={step.step} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{step.step}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {step.icon}
                            <h4 className="font-semibold">{step.title}</h4>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500">
              <Trophy className="mr-2 h-5 w-5" />
              Download Full Report
            </Button>
            <Button variant="outline" size="lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  switch (currentPhase) {
    case 'welcome':
      return renderWelcomeScreen();
    case 'background':
      return renderBackgroundScreen();
    case 'assessment':
      return renderAssessmentScreen();
    case 'challenges':
      return renderChallengesScreen();
    case 'results':
      return renderResultsScreen();
    default:
      return renderWelcomeScreen();
  }
};

export default CulturalIntelligenceAssessment;