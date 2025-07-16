import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Download, Clock, Users, Target, TrendingUp, Brain, MessageSquare, RotateCcw } from 'lucide-react';
import { useLeadershipScoring } from '@/hooks/useLeadershipScoring';
import { leadershipTranslations, leadershipQuestions, dimensionOrder } from '@/data/leadershipQuestions';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Language = 'en' | 'fr' | 'es';

interface UserInfo {
  fullName: string;
  age: number;
  email: string;
  gender: string;
  organization: string;
  position: string;
  experience: number;
  teamSize: string;
}

const LeadershipAssessment = () => {
  const [currentStep, setCurrentStep] = useState<'language' | 'form' | 'instructions' | 'assessment' | 'results'>('language');
  const [language, setLanguage] = useState<Language>('en');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fullName: '',
    age: 0,
    email: '',
    gender: '',
    organization: '',
    position: '',
    experience: 0,
    teamSize: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { calculateScores, results, isCalculating } = useLeadershipScoring();
  const { toast } = useToast();

  const handleRetake = () => {
    setCurrentStep('language');
    setLanguage('en');
    setUserInfo({
      fullName: '',
      age: 0,
      email: '',
      gender: '',
      organization: '',
      position: '',
      experience: 0,
      teamSize: ''
    });
    setCurrentQuestion(0);
    setResponses([]);
    setStartTime(null);
    setElapsedTime(0);
  };

  const t = leadershipTranslations[language];
  const allQuestions = dimensionOrder.flatMap(dimension => 
    leadershipQuestions[dimension as keyof typeof leadershipQuestions]
  );

  const currentDimension = dimensionOrder[Math.floor(currentQuestion / 10)];
  const currentDimensionIndex = Math.floor(currentQuestion / 10);
  const questionInDimension = (currentQuestion % 10) + 1;

  const dimensionIcons = {
    strategicThinking: Target,
    emotionalIntelligence: Brain,
    communicationInfluence: MessageSquare,
    teamDevelopment: Users,
    decisionMaking: TrendingUp,
    changeManagement: ArrowRight
  };

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.fullName || !userInfo.email || !userInfo.organization) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('instructions');
  };

  const handleBeginAssessment = () => {
    setStartTime(new Date());
    setCurrentStep('assessment');
  };

  const handleAnswerSelect = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);
  };

  const handleNextQuestion = () => {
    if (!responses[currentQuestion]) {
      toast({
        title: "Answer Required",
        description: "Please select an answer before proceeding",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (responses.length !== allQuestions.length) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before submitting",
        variant: "destructive"
      });
      return;
    }

    try {
      await calculateScores(responses, userInfo);
      setCurrentStep('results');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generatePDFReport = () => {
    // This would integrate with jsPDF for PDF generation
    toast({
      title: "PDF Generation",
      description: "PDF report generation will be implemented with jsPDF integration",
    });
  };

  const generateHTMLReport = () => {
    if (!results) return;

    const reportHTML = `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <title>Leadership Assessment - ${userInfo.fullName}</title>
        <style>
          body { font-family: -apple-system, Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
          .score-large { font-size: 48px; font-weight: bold; color: #3b82f6; }
          .dimension-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
          .progress-bar { width: 100%; height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; margin: 10px 0; }
          .progress-fill { height: 100%; transition: width 0.5s ease; }
          .high { background-color: #10b981; }
          .medium { background-color: #f59e0b; }
          .low { background-color: #ef4444; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Leadership Assessment Report</h1>
          <h2>${userInfo.fullName}</h2>
          <p>${userInfo.organization} • ${userInfo.position}</p>
        </div>
        
        <div class="score-large">Overall Score: ${results.overall}%</div>
        <p><strong>Leadership Profile:</strong> ${results.profile.type}</p>
        <p>${results.profile.description}</p>
        
        <h3>Leadership Dimensions:</h3>
        ${Object.entries(results.dimensions).map(([dimension, score]) => `
          <div class="dimension-card">
            <h4>${t[dimension as keyof typeof t]}</h4>
            <div class="progress-bar">
              <div class="progress-fill ${score.percentage >= 80 ? 'high' : score.percentage >= 60 ? 'medium' : 'low'}" 
                   style="width: ${score.percentage}%"></div>
            </div>
            <p><strong>${score.percentage}%</strong> - ${score.level}</p>
            <p>${score.interpretation}</p>
          </div>
        `).join('')}
        
        <h3>Development Recommendations:</h3>
        ${results.recommendations.immediate.length > 0 ? `
          <h4>Immediate Actions:</h4>
          <ul>
            ${results.recommendations.immediate.map(rec => `
              <li><strong>${t[rec.dimension as keyof typeof t]}:</strong>
                <ul>${rec.actions.map(action => `<li>${action}</li>`).join('')}</ul>
              </li>
            `).join('')}
          </ul>
        ` : ''}
        
        <h4>Long-term Development:</h4>
        <ul>
          ${results.recommendations.longTerm.map(rec => `
            <li><strong>${rec.title}:</strong> ${rec.description} (${rec.timeline})</li>
          `).join('')}
        </ul>
      </body>
      </html>
    `;
    
    // Create a downloadable HTML file instead of opening in new window
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leadership_Report_${userInfo.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Generated",
      description: "Your leadership assessment report has been downloaded.",
    });
  };

  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  const CurrentDimensionIcon = dimensionIcons[currentDimension as keyof typeof dimensionIcons];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Language Selection */}
          {currentStep === 'language' && (
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Leadership Assessment</CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive Leadership Effectiveness Evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl mb-6">Select Language / Choisir la langue / Seleccionar idioma</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => handleLanguageSelect('en')}>
                    🇬🇧 English
                  </Button>
                  <Button size="lg" onClick={() => handleLanguageSelect('fr')}>
                    🇫🇷 Français
                  </Button>
                  <Button size="lg" onClick={() => handleLanguageSelect('es')}>
                    🇪🇸 Español
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applicant Information Form */}
          {currentStep === 'form' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.startAssessment}</CardTitle>
                <CardDescription>Please provide your information to begin the assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t.fullName}</Label>
                      <Input
                        id="fullName"
                        value={userInfo.fullName}
                        onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">{t.age}</Label>
                      <Input
                        id="age"
                        type="number"
                        min="18"
                        max="100"
                        value={userInfo.age || ''}
                        onChange={(e) => setUserInfo({...userInfo, age: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">{t.gender}</Label>
                      <Select value={userInfo.gender} onValueChange={(value) => setUserInfo({...userInfo, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t.male}</SelectItem>
                          <SelectItem value="female">{t.female}</SelectItem>
                          <SelectItem value="other">{t.other}</SelectItem>
                          <SelectItem value="prefer-not-to-say">{t.preferNotToSay}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organization">{t.organization}</Label>
                      <Input
                        id="organization"
                        value={userInfo.organization}
                        onChange={(e) => setUserInfo({...userInfo, organization: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">{t.position}</Label>
                      <Input
                        id="position"
                        value={userInfo.position}
                        onChange={(e) => setUserInfo({...userInfo, position: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">{t.experience}</Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        max="50"
                        value={userInfo.experience || ''}
                        onChange={(e) => setUserInfo({...userInfo, experience: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teamSize">{t.teamSize}</Label>
                    <Select value={userInfo.teamSize} onValueChange={(value) => setUserInfo({...userInfo, teamSize: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No direct reports</SelectItem>
                        <SelectItem value="1-5">1-5 people</SelectItem>
                        <SelectItem value="6-20">6-20 people</SelectItem>
                        <SelectItem value="21-50">21-50 people</SelectItem>
                        <SelectItem value="51+">51+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t.startAssessment}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {currentStep === 'instructions' && (
            <Card>
              <CardHeader>
                <CardTitle>{t.instructionsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-lg">{t.instructionsText1}</p>
                  <p>{t.instructionsText2}</p>
                  <p>{t.instructionsText3}</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Key Guidelines:</h4>
                  <ul className="space-y-2">
                    <li>• {t.instruction1}</li>
                    <li>• {t.instruction2}</li>
                    <li>• {t.instruction3}</li>
                    <li>• {t.instruction4}</li>
                  </ul>
                </div>
                
                <Button onClick={handleBeginAssessment} className="w-full" size="lg">
                  {t.beginButton}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Assessment Questions */}
          {currentStep === 'assessment' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CurrentDimensionIcon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{t[currentDimension as keyof typeof t]}</CardTitle>
                      <CardDescription>
                        Question {questionInDimension} of 10 in this dimension
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatTime(elapsedTime)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Question {currentQuestion + 1} of {allQuestions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {allQuestions[currentQuestion]?.[language]}
                  </h3>
                  
                  <RadioGroup
                    value={responses[currentQuestion]?.toString()}
                    onValueChange={handleAnswerSelect}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="1" />
                      <Label htmlFor="1" className="cursor-pointer">{t.never}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="2" />
                      <Label htmlFor="2" className="cursor-pointer">{t.rarely}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="3" />
                      <Label htmlFor="3" className="cursor-pointer">{t.sometimes}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="4" />
                      <Label htmlFor="4" className="cursor-pointer">{t.often}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="5" />
                      <Label htmlFor="5" className="cursor-pointer">{t.always}</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t.previous}
                  </Button>
                  <Button onClick={handleNextQuestion}>
                    {currentQuestion === allQuestions.length - 1 ? t.submit : t.next}
                    {currentQuestion < allQuestions.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {currentStep === 'results' && results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t.resultsTitle}</CardTitle>
                  <CardDescription>
                    Assessment completed • {formatTime(elapsedTime)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{t.overallScore}</h3>
                      <div className="text-6xl font-bold text-primary my-4">
                        {results.overall}%
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {results.overall >= 85 ? t.exceptional : 
                         results.overall >= 70 ? t.strong : 
                         results.overall >= 55 ? t.developing : t.emerging}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-left">
                      <h4 className="font-semibold mb-2">{t.leadershipProfile}</h4>
                      <div className="space-y-2">
                        <p className="font-medium">{results.profile.type}</p>
                        <p className="text-muted-foreground">{results.profile.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(results.dimensions).map(([dimension, score]) => {
                  const DimensionIcon = dimensionIcons[dimension as keyof typeof dimensionIcons];
                  return (
                    <Card key={dimension}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <DimensionIcon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{t[dimension as keyof typeof t]}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{score.percentage}%</span>
                            <Badge variant={score.percentage >= 80 ? "default" : score.percentage >= 60 ? "secondary" : "destructive"}>
                              {score.level}
                            </Badge>
                          </div>
                          <Progress value={score.percentage} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            {score.interpretation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Development Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.recommendations.immediate.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Immediate Actions (0-30 days):</h4>
                      <ul className="space-y-2">
                        {results.recommendations.immediate.map((rec, index) => (
                          <li key={index} className="space-y-1">
                            <span className="font-medium">{t[rec.dimension as keyof typeof t]}:</span>
                            <ul className="ml-4 space-y-1">
                              {rec.actions.map((action, actionIndex) => (
                                <li key={actionIndex} className="text-sm text-muted-foreground">
                                  • {action}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {results.recommendations.shortTerm.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Short-term Development (1-3 months):</h4>
                      <ul className="space-y-2">
                        {results.recommendations.shortTerm.map((rec, index) => (
                          <li key={index} className="space-y-1">
                            <span className="font-medium">{t[rec.dimension as keyof typeof t]}:</span>
                            <ul className="ml-4 space-y-1">
                              {rec.actions.map((action, actionIndex) => (
                                <li key={actionIndex} className="text-sm text-muted-foreground">
                                  • {action}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Long-term Development Strategy:</h4>
                    <ul className="space-y-2">
                      {results.recommendations.longTerm.map((rec, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">{rec.title}:</span> {rec.description} ({rec.timeline})
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={generatePDFReport} className="bg-red-600 hover:bg-red-700">
                  <Download className="h-4 w-4 mr-2" />
                  {t.downloadPDF}
                </Button>
                <Button onClick={generateHTMLReport} variant="outline">
                  {t.viewReport}
                </Button>
                <Button onClick={handleRetake} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t.retake}
                </Button>
              </div>
            </div>
          )}
          
          {isCalculating && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Calculating your leadership assessment results...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LeadershipAssessment;