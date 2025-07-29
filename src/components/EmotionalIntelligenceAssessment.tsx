import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Heart, Brain, Users, Target, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { emotionalIntelligenceTranslations } from "@/data/emotionalIntelligenceTranslations";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EmotionalIntelligenceAssessmentProps {
  onComplete?: (results: any) => void;
}

interface CandidateInfo {
  fullName: string;
  age: string;
  email: string;
  gender: string;
  organization?: string;
}

interface AssessmentResults {
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
  overall: number;
}

const EmotionalIntelligenceAssessment = ({ onComplete }: EmotionalIntelligenceAssessmentProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  // Map main app languages to component languages, default to Spanish if not supported
  const getComponentLanguage = (mainLang: string): 'es' | 'fr' | 'de' => {
    console.log('Main app language:', mainLang);
    switch (mainLang) {
      case 'fr': return 'fr';
      case 'de': return 'de';
      case 'es': return 'es';
      default: 
        console.log('Language not supported, defaulting to Spanish');
        return 'es'; // Default to Spanish since English isn't available in this component
    }
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'fr' | 'de'>(getComponentLanguage(i18n.language));
  const [currentStep, setCurrentStep] = useState<'info' | 'assessment' | 'results'>('info');
  const [currentDimension, setCurrentDimension] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({
    fullName: '',
    age: '',
    email: '',
    gender: '',
    organization: ''
  });
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  const dimensions = ['selfAwareness', 'selfRegulation', 'motivation', 'empathy', 'socialSkills'] as const;
  const currentDimensionKey = dimensions[currentDimension];
  const totalQuestions = 60;
  const questionsPerDimension = 12;

  const ui = emotionalIntelligenceTranslations.ui[currentLanguage];
  const questions = emotionalIntelligenceTranslations.questions;

  // Update component language when main app language changes
  useEffect(() => {
    setCurrentLanguage(getComponentLanguage(i18n.language));
  }, [i18n.language]);

  useEffect(() => {
    if (currentStep === 'assessment' && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [currentStep, startTime]);

  const handleLanguageChange = (language: 'es' | 'fr' | 'de') => {
    setCurrentLanguage(language);
  };

  const handleCandidateInfoChange = (field: keyof CandidateInfo, value: string) => {
    setCandidateInfo(prev => ({ ...prev, [field]: value }));
  };

  const startAssessment = () => {
    if (!candidateInfo.fullName || !candidateInfo.age || !candidateInfo.email || !candidateInfo.gender) {
      toast.error("Please fill in all required fields");
      return;
    }
    setCurrentStep('assessment');
    setStartTime(Date.now());
  };

  const handleResponse = (value: string) => {
    const questionIndex = currentDimension * questionsPerDimension + currentQuestion;
    const questionKey = `${currentDimensionKey}_${currentQuestion}`;
    
    setResponses(prev => ({
      ...prev,
      [questionKey]: parseInt(value)
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsPerDimension - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentDimension < dimensions.length - 1) {
      setCurrentDimension(currentDimension + 1);
      setCurrentQuestion(0);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentDimension > 0) {
      setCurrentDimension(currentDimension - 1);
      setCurrentQuestion(questionsPerDimension - 1);
    }
  };

  const calculateResults = () => {
    const dimensionScores: Record<string, number> = {};
    
    dimensions.forEach((dimension, dimIndex) => {
      let totalScore = 0;
      for (let q = 0; q < questionsPerDimension; q++) {
        const questionKey = `${dimension}_${q}`;
        totalScore += responses[questionKey] || 0;
      }
      dimensionScores[dimension] = Math.round((totalScore / (questionsPerDimension * 5)) * 100);
    });

    const overallScore = Math.round(
      Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / dimensions.length
    );

    const assessmentResults: AssessmentResults = {
      selfAwareness: dimensionScores.selfAwareness,
      selfRegulation: dimensionScores.selfRegulation,
      motivation: dimensionScores.motivation,
      empathy: dimensionScores.empathy,
      socialSkills: dimensionScores.socialSkills,
      overall: overallScore
    };

    setResults(assessmentResults);
    setCurrentStep('results');

    if (onComplete) {
      onComplete({
        candidateInfo,
        responses,
        results: assessmentResults,
        completionTime: Date.now() - startTime,
        language: currentLanguage
      });
    }
  };

  const getScoreLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= emotionalIntelligenceTranslations.scoring.thresholds.high) return 'high';
    if (score >= emotionalIntelligenceTranslations.scoring.thresholds.medium) return 'medium';
    return 'low';
  };

  const getScoreColor = (score: number): string => {
    const level = getScoreLevel(score);
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
    }
  };

  const currentQuestionIndex = currentDimension * questionsPerDimension + currentQuestion;
  const currentQuestionKey = `${currentDimensionKey}_${currentQuestion}`;
  const currentResponse = responses[currentQuestionKey];

  const DimensionIcon = ({ dimension }: { dimension: string }) => {
    switch (dimension) {
      case 'selfAwareness': return <Brain className="h-6 w-6" />;
      case 'selfRegulation': return <Heart className="h-6 w-6" />;
      case 'motivation': return <Target className="h-6 w-6" />;
      case 'empathy': return <Users className="h-6 w-6" />;
      case 'socialSkills': return <Zap className="h-6 w-6" />;
      default: return <Brain className="h-6 w-6" />;
    }
  };

  if (currentStep === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mb-4">
                <Globe className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {ui.assessmentTitle}
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Complete assessment with 60 questions across 5 emotional intelligence dimensions
                </CardDescription>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="language" className="block text-sm font-medium mb-2">
                  {ui.selectLanguage}
                </Label>
                <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">{ui.fullName} *</Label>
                  <Input
                    id="fullName"
                    value={candidateInfo.fullName}
                    onChange={(e) => handleCandidateInfoChange('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="age">{ui.age} *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={candidateInfo.age}
                    onChange={(e) => handleCandidateInfoChange('age', e.target.value)}
                    placeholder="25"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{ui.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => handleCandidateInfoChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="gender">{ui.gender} *</Label>
                <Select value={candidateInfo.gender} onValueChange={(value) => handleCandidateInfoChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{ui.male}</SelectItem>
                    <SelectItem value="female">{ui.female}</SelectItem>
                    <SelectItem value="other">{ui.other}</SelectItem>
                    <SelectItem value="prefer-not-to-say">{ui.preferNotToSay}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="organization">{ui.organization}</Label>
                <Input
                  id="organization"
                  value={candidateInfo.organization}
                  onChange={(e) => handleCandidateInfoChange('organization', e.target.value)}
                  placeholder="Company Name"
                />
              </div>

              <Button 
                onClick={startAssessment} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {ui.startAssessment}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'assessment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <DimensionIcon dimension={currentDimensionKey} />
                  {ui[currentDimensionKey as keyof typeof ui]}
                </Badge>
                <div className="text-sm text-gray-600">
                  {ui.question} {currentQuestionIndex + 1} {ui.of} {totalQuestions}
                </div>
              </div>
              
              <Progress 
                value={(currentQuestionIndex + 1) / totalQuestions * 100} 
                className="w-full"
              />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-6">
                  {questions[currentDimensionKey][currentQuestion][currentLanguage]}
                </h2>
              </div>

              <RadioGroup
                value={currentResponse?.toString()}
                onValueChange={handleResponse}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="1" />
                  <Label htmlFor="1" className="flex-1 cursor-pointer">
                    {ui.stronglyDisagree}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="2" />
                  <Label htmlFor="2" className="flex-1 cursor-pointer">
                    {ui.disagree}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="3" />
                  <Label htmlFor="3" className="flex-1 cursor-pointer">
                    {ui.neutral}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="4" />
                  <Label htmlFor="4" className="flex-1 cursor-pointer">
                    {ui.agree}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="5" />
                  <Label htmlFor="5" className="flex-1 cursor-pointer">
                    {ui.stronglyAgree}
                  </Label>
                </div>
              </RadioGroup>

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentDimension === 0 && currentQuestion === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {ui.previous}
                </Button>

                <Button
                  onClick={nextQuestion}
                  disabled={!currentResponse}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {currentQuestionIndex === totalQuestions - 1 ? ui.submit : ui.next}
                  {currentQuestionIndex === totalQuestions - 1 ? 
                    <CheckCircle2 className="h-4 w-4" /> : 
                    <ArrowRight className="h-4 w-4" />
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {ui.resultsTitle}
              </CardTitle>
              <CardDescription className="text-lg">
                {candidateInfo.fullName} • {ui.overallScore}: {results.overall}%
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 mb-4">
                  <div className="text-3xl font-bold text-blue-600">{results.overall}%</div>
                </div>
                <h3 className="text-xl font-semibold">{ui.overallScore}</h3>
              </div>

              {/* Dimension Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dimensions.map((dimension) => {
                  const score = results[dimension];
                  const level = getScoreLevel(score);
                  const interpretation = emotionalIntelligenceTranslations.interpretations[currentLanguage][level][dimension];
                  
                  return (
                    <Card key={dimension} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <DimensionIcon dimension={dimension} />
                        <h4 className="font-semibold">{ui[dimension as keyof typeof ui]}</h4>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{score}%</span>
                          <Badge variant={level === 'high' ? 'default' : level === 'medium' ? 'secondary' : 'destructive'}>
                            {level.toUpperCase()}
                          </Badge>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                      
                      <p className="text-xs text-gray-600">{interpretation.substring(0, 120)}...</p>
                    </Card>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  {ui.downloadPDF}
                </Button>
                <Button variant="outline">
                  {ui.viewReport}
                </Button>
                <Button variant="outline" onClick={() => {
                  setCurrentStep('info');
                  setCurrentDimension(0);
                  setCurrentQuestion(0);
                  setResponses({});
                  setResults(null);
                  setCandidateInfo({
                    fullName: '',
                    age: '',
                    email: '',
                    gender: '',
                    organization: ''
                  });
                }}>
                  {ui.retake}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
};

export default EmotionalIntelligenceAssessment;