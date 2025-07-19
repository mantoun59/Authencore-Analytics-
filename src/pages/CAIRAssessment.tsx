import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createAssessmentQuestions, personalityDimensions } from "@/data/cairQuestions";
import { Shield, Brain, Users, Lightbulb, Heart, Download, Share2, Eye, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  name: string;
  email: string;
  position: string;
  company: string;
}

interface AssessmentResponse {
  questionId: string;
  answer: 'A' | 'B';
  responseTime: number;
  timestamp: number;
}

interface ValidityMetrics {
  fakeGoodScore: number;
  fakeBadScore: number;
  inconsistencyScore: number;
  randomResponseScore: number;
  overallValidity: 'Valid' | 'Questionable' | 'Invalid';
  responseTimeProfile: 'Normal' | 'Too Fast' | 'Too Slow';
}

export default function CAIRAssessment() {
  const { toast } = useToast();
  const [phase, setPhase] = useState<'welcome' | 'registration' | 'instructions' | 'assessment' | 'results'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    position: '',
    company: ''
  });
  
  const [questions] = useState(() => createAssessmentQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [assessmentStartTime, setAssessmentStartTime] = useState(0);
  const [showEmployerView, setShowEmployerView] = useState(false);
  const [employerPassword, setEmployerPassword] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout>();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  useEffect(() => {
    if (phase === 'assessment' && assessmentStartTime === 0) {
      setAssessmentStartTime(Date.now());
      setQuestionStartTime(Date.now());
    }
  }, [phase, assessmentStartTime]);

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.name && userProfile.email) {
      setPhase('instructions');
    }
  };

  const startAssessment = () => {
    setPhase('assessment');
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (answer: 'A' | 'B') => {
    const responseTime = Date.now() - questionStartTime;
    
    const newResponse: AssessmentResponse = {
      questionId: currentQuestion.id,
      answer,
      responseTime,
      timestamp: Date.now()
    };

    setResponses(prev => [...prev, newResponse]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      // Assessment complete
      setPhase('results');
    }
  };

  const calculateScores = () => {
    const dimensionScores: Record<string, number[]> = {
      conscientiousness: [],
      agreeableness: [],
      innovation: [],
      resilience: []
    };

    // Calculate personality dimension scores
    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question && question.type === 'forced_choice') {
        let score = response.answer === 'A' ? 1 : 0;
        if (question.reverse) score = 1 - score;
        
        if (dimensionScores[question.dimension]) {
          dimensionScores[question.dimension].push(score);
        }
      }
    });

    // Calculate averages and percentiles
    const finalScores = Object.entries(dimensionScores).reduce((acc, [dimension, scores]) => {
      const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0.5;
      // Convert to percentile (simplified - in production use normative data)
      const percentile = Math.round(average * 100);
      acc[dimension] = { raw: average, percentile, level: getPersonalityLevel(percentile) };
      return acc;
    }, {} as Record<string, { raw: number; percentile: number; level: string }>);

    return finalScores;
  };

  const calculateValidityMetrics = (): ValidityMetrics => {
    let fakeGoodScore = 0;
    let fakeBadScore = 0;
    let inconsistencyScore = 0;
    let randomResponseScore = 0;

    responses.forEach(response => {
      const question = questions.find(q => q.id === response.questionId);
      if (question && question.type === 'distortion') {
        switch (question.distortionType) {
          case 'fake_good':
            if (response.answer === 'A') fakeGoodScore++;
            break;
          case 'fake_bad':
            if (response.answer === 'A') fakeBadScore++;
            break;
          case 'random_check':
            if (response.answer === 'B') randomResponseScore++;
            break;
        }
      }
    });

    // Check inconsistency pairs
    const teamworkPair = [
      responses.find(r => r.questionId === 'ic001'),
      responses.find(r => r.questionId === 'ic002')
    ];
    if (teamworkPair[0] && teamworkPair[1]) {
      if ((teamworkPair[0].answer === 'A' && teamworkPair[1].answer === 'A') ||
          (teamworkPair[0].answer === 'B' && teamworkPair[1].answer === 'B')) {
        inconsistencyScore++;
      }
    }

    const challengePair = [
      responses.find(r => r.questionId === 'ic003'),
      responses.find(r => r.questionId === 'ic004')
    ];
    if (challengePair[0] && challengePair[1]) {
      if ((challengePair[0].answer === 'A' && challengePair[1].answer === 'A') ||
          (challengePair[0].answer === 'B' && challengePair[1].answer === 'B')) {
        inconsistencyScore++;
      }
    }

    // Response time analysis
    const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length;
    let responseTimeProfile: ValidityMetrics['responseTimeProfile'] = 'Normal';
    if (avgResponseTime < 3000) responseTimeProfile = 'Too Fast';
    else if (avgResponseTime > 30000) responseTimeProfile = 'Too Slow';

    // Overall validity determination
    let overallValidity: ValidityMetrics['overallValidity'] = 'Valid';
    const totalFlags = fakeGoodScore + fakeBadScore + inconsistencyScore + randomResponseScore;
    
    if (totalFlags >= 6 || fakeGoodScore >= 5 || randomResponseScore >= 2) {
      overallValidity = 'Invalid';
    } else if (totalFlags >= 3 || responseTimeProfile !== 'Normal') {
      overallValidity = 'Questionable';
    }

    return {
      fakeGoodScore,
      fakeBadScore,
      inconsistencyScore,
      randomResponseScore,
      overallValidity,
      responseTimeProfile
    };
  };

  const getPersonalityLevel = (percentile: number): string => {
    if (percentile >= 85) return 'Very High';
    if (percentile >= 70) return 'High';
    if (percentile >= 30) return 'Average';
    if (percentile >= 15) return 'Low';
    return 'Very Low';
  };

  const generateCandidateReport = async () => {
    const scores = calculateScores();
    const validity = calculateValidityMetrics();
    
    try {
      const reportData = {
        assessmentType: 'cair_plus',
        results: {
          candidate: userProfile,
          assessmentDate: new Date().toLocaleDateString(),
          scores,
          validity,
          totalQuestions: questions.length,
          completionTime: Math.round((Date.now() - assessmentStartTime) / 60000)
        },
        userData: {
          name: userProfile.name,
          email: userProfile.email,
          position: userProfile.position,
          company: userProfile.company,
          date: new Date().toLocaleDateString()
        }
      };

      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: reportData
      });

      if (response.data) {
        // Open HTML report in new window for PDF printing
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response.data);
          newWindow.document.close();
          
          // Add print-friendly styles and auto-print
          setTimeout(() => {
            newWindow.focus();
            newWindow.print();
          }, 1000);

          toast({
            title: "Report Generated",
            description: "Use your browser's Print dialog to save as PDF. Select 'Save as PDF' as destination.",
          });
        } else {
          // Fallback: download as HTML if popup blocked
          const blob = new Blob([response.data], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `CAIR_Report_${userProfile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "HTML Report Downloaded",
            description: "Open the HTML file and use your browser's Print to PDF feature.",
          });
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Report Generation Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareResults = async () => {
    const scores = calculateScores();
    const topStrength = Object.entries(scores)
      .sort(([,a], [,b]) => b.percentile - a.percentile)[0];
    
    const shareText = `I just completed the CAIR+ Personality Assessment! My top strength: ${personalityDimensions[topStrength[0] as keyof typeof personalityDimensions].name}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My CAIR+ Assessment Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Results Copied!",
          description: "Your assessment results have been copied to the clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to copy results to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEmployerAccess = () => {
    // In a real implementation, this would validate against a secure backend
    if (employerPassword === 'EMPLOYER2024') {
      setShowEmployerView(true);
      toast({
        title: "Access Granted",
        description: "Employer view enabled successfully.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid employer access code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderWelcome = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* CAIR+ Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/b4befcb1-a480-4a36-b95e-796ac890d93e.png" 
            alt="CAIR+ Cultural Adaptation & Integration Readiness Plus" 
            className="mx-auto h-32 w-auto mb-6"
          />
        </div>
        
        <div className="text-6xl mb-8">🧠</div>
        <h1 className="text-5xl font-bold text-slate-800 mb-6">
          CAIR+ Personality Assessment
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Comprehensive personality profiling with advanced validity detection
        </p>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Shield, label: 'Conscientiousness', color: 'text-blue-500' },
            { icon: Users, label: 'Agreeableness', color: 'text-green-500' },
            { icon: Lightbulb, label: 'Innovation', color: 'text-orange-500' },
            { icon: Heart, label: 'Resilience', color: 'text-red-500' }
          ].map((item, index) => (
            <Card key={index} className="bg-white/70 hover:bg-white/90 transition-all hover:scale-105">
              <CardContent className="p-6 text-center">
                <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                <h3 className="font-semibold text-slate-700">{item.label}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white/80 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Assessment Features:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
            <div>✓ 100 Forced-choice questions</div>
            <div>✓ Built-in validity detection</div>
            <div>✓ Percentile-based scoring</div>
            <div>✓ Response time analysis</div>
            <div>✓ Dual reporting system</div>
            <div>✓ Professional insights</div>
          </div>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => setPhase('registration')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
        >
          Begin Assessment
        </Button>
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-slate-800">Profile Information</CardTitle>
          <CardDescription className="text-center">Please provide your details to begin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistration} className="space-y-4">
            <Input
              placeholder="Full Name"
              value={userProfile.name}
              onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={userProfile.email}
              onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              placeholder="Current Position"
              value={userProfile.position}
              onChange={(e) => setUserProfile(prev => ({ ...prev, position: e.target.value }))}
            />
            <Input
              placeholder="Company/Organization"
              value={userProfile.company}
              onChange={(e) => setUserProfile(prev => ({ ...prev, company: e.target.value }))}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Continue to Instructions
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderInstructions = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Assessment Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Important Guidelines:</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Answer honestly - there are no right or wrong answers</li>
              <li>• Choose the option that best describes you most of the time</li>
              <li>• Don't overthink - go with your first instinct</li>
              <li>• Complete all questions in one session</li>
              <li>• The assessment takes approximately 15-20 minutes</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">For Best Results:</h3>
            <ul className="space-y-2 text-amber-700">
              <li>• Find a quiet environment without distractions</li>
              <li>• Answer based on how you typically behave, not how you wish to be</li>
              <li>• Consider your behavior across different situations</li>
              <li>• Be consistent in your responses</li>
            </ul>
          </div>

          <Button onClick={startAssessment} className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssessment = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 pt-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <Badge variant={currentQuestion.type === 'distortion' ? 'destructive' : 'default'}>
              {currentQuestion.type === 'distortion' ? 'Validity Check' : 'Personality'}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center text-slate-800">
              {currentQuestion.questionText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={() => handleAnswer('A')}
                className="p-6 text-left h-auto justify-start hover:bg-blue-50 border-2 hover:border-blue-300"
              >
                <span className="font-semibold mr-3 text-blue-600">A.</span>
                {currentQuestion.optionA}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAnswer('B')}
                className="p-6 text-left h-auto justify-start hover:bg-blue-50 border-2 hover:border-blue-300"
              >
                <span className="font-semibold mr-3 text-blue-600">B.</span>
                {currentQuestion.optionB}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderResults = () => {
    const scores = calculateScores();
    const validity = calculateValidityMetrics();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Assessment Complete!</h1>
            <p className="text-slate-600">Your CAIR+ personality profile is ready</p>
          </div>

          {/* Validity Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Response Validity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={validity.overallValidity === 'Valid' ? 'default' : 
                          validity.overallValidity === 'Questionable' ? 'secondary' : 'destructive'}
                  className="text-sm"
                >
                  {validity.overallValidity}
                </Badge>
                <span className="text-sm text-slate-600">
                  Response Time: {validity.responseTimeProfile}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Personality Scores */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {Object.entries(scores).map(([dimension, data]) => {
              const dimInfo = personalityDimensions[dimension as keyof typeof personalityDimensions];
              const icons = { conscientiousness: Shield, agreeableness: Users, innovation: Lightbulb, resilience: Heart };
              const IconComponent = icons[dimension as keyof typeof icons];
              
              return (
                <Card key={dimension}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5" />
                      {dimInfo.name}
                    </CardTitle>
                    <CardDescription>{dimInfo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-slate-800">{data.percentile}%</span>
                      <Badge variant="outline">{data.level}</Badge>
                    </div>
                    <Progress value={data.percentile} className="mt-3" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={generateCandidateReport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button onClick={shareResults} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Button 
              onClick={() => setShowEmployerView(true)} 
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              Employer View
            </Button>
          </div>
        </div>

        {/* Employer Access Dialog */}
        <Dialog open={showEmployerView} onOpenChange={setShowEmployerView}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Employer Access - Confidential</DialogTitle>
              <DialogDescription>
                Advanced analytics and hiring insights for authorized personnel only
              </DialogDescription>
            </DialogHeader>
            
            {!employerPassword ? (
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter employer access code"
                  value={employerPassword}
                  onChange={(e) => setEmployerPassword(e.target.value)}
                />
                <Button onClick={handleEmployerAccess} className="w-full">
                  Access Employer Dashboard
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Validity Dashboard */}
                <Card>
                  <CardHeader>
                    <CardTitle>Validity Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{validity.fakeGoodScore}/8</div>
                        <div className="text-sm text-slate-600">Fake Good</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{validity.fakeBadScore}/4</div>
                        <div className="text-sm text-slate-600">Fake Bad</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{validity.inconsistencyScore}/2</div>
                        <div className="text-sm text-slate-600">Inconsistent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{validity.randomResponseScore}/4</div>
                        <div className="text-sm text-slate-600">Random</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hiring Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hiring Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Overall Recommendation:</span>
                        <Badge variant={validity.overallValidity === 'Valid' ? 'default' : 'destructive'}>
                          {validity.overallValidity === 'Valid' ? 'Proceed with Confidence' : 'Exercise Caution'}
                        </Badge>
                      </div>
                      
                      {validity.overallValidity !== 'Valid' && (
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-amber-800">Caution Flags:</h4>
                          <ul className="mt-2 text-amber-700 text-sm">
                            {validity.fakeGoodScore >= 4 && <li>• High social desirability responding</li>}
                            {validity.randomResponseScore >= 2 && <li>• Possible random or careless responding</li>}
                            {validity.responseTimeProfile !== 'Normal' && <li>• Unusual response time pattern</li>}
                            {validity.inconsistencyScore >= 1 && <li>• Inconsistent responses detected</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Focus Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(scores)
                        .filter(([, data]) => data.percentile < 30)
                        .map(([dimension]) => (
                          <div key={dimension} className="bg-slate-50 p-3 rounded">
                            <span className="font-medium">Explore {personalityDimensions[dimension as keyof typeof personalityDimensions].name}:</span>
                            <span className="text-sm text-slate-600 ml-2">
                              Ask for specific examples and behavioral indicators
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  if (phase === 'welcome') return renderWelcome();
  if (phase === 'registration') return renderRegistration();
  if (phase === 'instructions') return renderInstructions();
  if (phase === 'assessment') return renderAssessment();
  if (phase === 'results') return renderResults();

  return null;
};