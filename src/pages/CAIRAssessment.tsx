import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateClientSidePdf } from '@/utils/clientPdfGenerator';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cairQuestions, personalityDimensions } from "@/data/cairPersonalityQuestionsOnly";
import { Shield, Brain, Users, Lightbulb, Heart, Download, Share2, Eye, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AssessmentResults from "@/components/AssessmentResults";

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
  
  const [questions] = useState(() => cairQuestions);
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
      if (question && question.type === 'personality') {
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
      if (question && question.type === 'validity') {
        switch (question.validityType) {
          case 'fake_good':
            if (response.answer === 'A') fakeGoodScore++;
            break;
          case 'fake_bad':
            if (response.answer === 'A') fakeBadScore++;
            break;
          case 'random_check':
            if (response.answer === 'A') randomResponseScore++;
            break;
          case 'inconsistency':
            // Check for consistency patterns
            if (response.answer === 'A') inconsistencyScore++;
            break;
        }
      }
    });

    // Check inconsistency patterns (questions that contradict each other)
    const teamworkResponses = [
      responses.find(r => r.questionId === 'v013'),  // prefer teamwork
      responses.find(r => r.questionId === 'v016')   // prefer working alone
    ];
    if (teamworkResponses[0] && teamworkResponses[1]) {
      if (teamworkResponses[0].answer === 'A' && teamworkResponses[1].answer === 'A') {
        inconsistencyScore++;
      }
    }

    const pressureResponses = [
      responses.find(r => r.questionId === 'v014'),  // enjoy challenges
      responses.find(r => r.questionId === 'v018')   // dislike challenging work
    ];
    if (pressureResponses[0] && pressureResponses[1]) {
      if (pressureResponses[0].answer === 'A' && pressureResponses[1].answer === 'A') {
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

  const getWorkplaceImplications = (dimension: string, percentile: number): string => {
    const implications = {
      conscientiousness: {
        high: "Highly reliable, organized, and detail-oriented. Excellent at following through on commitments and maintaining quality standards.",
        moderate: "Generally dependable with good organizational skills. May need structure and clear expectations to perform optimally.",
        low: "May benefit from external structure and deadlines. Creative and adaptable but might struggle with routine tasks."
      },
      agreeableness: {
        high: "Excellent team player, collaborative, and supportive. Strong at building consensus and maintaining workplace harmony.",
        moderate: "Balanced approach to cooperation and assertiveness. Can work well in teams while maintaining personal boundaries.",
        low: "Direct communicator who focuses on results. May excel in competitive environments and making tough decisions."
      },
      innovation: {
        high: "Creative problem-solver who thrives on new challenges. Excellent at generating ideas and adapting to change.",
        moderate: "Balances creativity with practicality. Can innovate when needed while maintaining operational efficiency.",
        low: "Prefers proven methods and stable processes. Excellent at execution and maintaining consistent quality."
      },
      resilience: {
        high: "Exceptional stress tolerance and recovery ability. Maintains performance under pressure and bounces back quickly from setbacks.",
        moderate: "Generally handles stress well with adequate support. May need time to process challenging situations.",
        low: "May be sensitive to stress and change. Benefits from supportive environment and gradual exposure to challenges."
      }
    };

    const level = percentile >= 70 ? 'high' : percentile >= 30 ? 'moderate' : 'low';
    return implications[dimension as keyof typeof implications]?.[level] || "Personality trait analysis pending.";
  };

  const getInterviewQuestions = (dimension: string, percentile: number): string[] => {
    const questions = {
      conscientiousness: {
        high: [
          "Tell me about a time when you had to manage multiple competing priorities. How did you approach it?",
          "Describe a situation where attention to detail was critical. What was your process?",
          "How do you ensure quality when working under tight deadlines?"
        ],
        moderate: [
          "Describe your typical approach to planning and organizing work projects.",
          "Tell me about a time when you had to improve a process or system.",
          "How do you balance thoroughness with efficiency in your work?"
        ],
        low: [
          "How do you handle structured environments and detailed procedures?",
          "Describe a time when you had to work within strict guidelines or deadlines.",
          "What systems or tools help you stay organized and on track?"
        ]
      },
      agreeableness: {
        high: [
          "Tell me about a time when you had to navigate a team conflict. How did you handle it?",
          "Describe a situation where you had to balance team harmony with business needs.",
          "How do you provide constructive feedback to colleagues?"
        ],
        moderate: [
          "Describe your approach to building relationships with new team members.",
          "Tell me about a time when you had to advocate for an unpopular but necessary decision.",
          "How do you handle disagreements with colleagues or supervisors?"
        ],
        low: [
          "Tell me about a time when you had to make a difficult decision that affected others.",
          "How do you approach situations where you need to be more direct or assertive?",
          "Describe your communication style when delivering challenging news."
        ]
      },
      innovation: {
        high: [
          "Describe the most innovative solution you've developed to solve a work problem.",
          "Tell me about a time when you challenged conventional thinking in your workplace.",
          "How do you approach situations where there's no established procedure?"
        ],
        moderate: [
          "Describe a time when you had to adapt to significant changes in your work environment.",
          "Tell me about a creative solution you developed within existing constraints.",
          "How do you balance innovation with practical implementation?"
        ],
        low: [
          "How do you approach learning and implementing new technologies or processes?",
          "Describe a time when you successfully improved an existing process.",
          "What's your approach when faced with ambiguous or undefined tasks?"
        ]
      },
      resilience: {
        high: [
          "Tell me about the most stressful period in your career and how you managed it.",
          "Describe a time when you failed at something important. How did you respond?",
          "How do you maintain performance during high-pressure situations?"
        ],
        moderate: [
          "Describe your strategies for managing stress and maintaining work-life balance.",
          "Tell me about a time when you had to bounce back from a setback.",
          "How do you handle criticism or negative feedback?"
        ],
        low: [
          "What type of work environment helps you perform at your best?",
          "How do you prefer to receive support when facing challenging situations?",
          "Describe your ideal pace and structure for taking on new responsibilities."
        ]
      }
    };

    const level = percentile >= 70 ? 'high' : percentile >= 30 ? 'moderate' : 'low';
    return questions[dimension as keyof typeof questions]?.[level] || ["Standard behavioral interview questions recommended."];
  };

  const getDevelopmentRecommendations = (dimension: string, percentile: number): string => {
    const recommendations = {
      conscientiousness: {
        moderate: "Focus on developing stronger planning and time management systems. Consider using project management tools and creating detailed schedules.",
        low: "Implement structured organizational systems, set regular check-in points, and consider working with a mentor on goal-setting techniques."
      },
      agreeableness: {
        moderate: "Practice assertiveness training while maintaining collaborative skills. Work on direct communication techniques for difficult conversations.",
        low: "Develop emotional intelligence and active listening skills. Consider team-building exercises and conflict resolution training."
      },
      innovation: {
        moderate: "Engage in creative thinking exercises and cross-functional projects. Seek opportunities to work on new initiatives and change management.",
        low: "Start with small innovative projects within familiar areas. Practice brainstorming techniques and seek exposure to new ideas and approaches."
      },
      resilience: {
        moderate: "Develop stress management techniques such as mindfulness or regular exercise. Build a strong support network and practice self-care strategies.",
        low: "Focus on building coping strategies gradually. Consider stress reduction techniques, seek mentorship, and ensure adequate support systems are in place."
      }
    };

    const level = percentile >= 30 ? 'moderate' : 'low';
    return recommendations[dimension as keyof typeof recommendations]?.[level] || "Continued development in this area will enhance overall effectiveness.";
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

      try {
        generateClientSidePdf({
          assessmentType: 'CAIR+ Personality',
          userInfo: {
            name: userProfile.name,
            email: userProfile.email,
            position: userProfile.position,
            company: userProfile.company
          },
          overallScore: Math.round(Object.values(scores).reduce((sum, s) => sum + s.percentile, 0) / Object.keys(scores).length),
          dimensions: Object.entries(scores).map(([key, value]) => ({
            name: personalityDimensions[key as keyof typeof personalityDimensions]?.name || key,
            score: value.percentile
          }))
        });
        
        toast({
          title: "Report Generated",
          description: "PDF report downloaded successfully!",
        });
      } catch (error) {
        console.error('PDF generation error:', error);
        toast({
          title: "Report Generation Error",
          description: "Failed to generate report. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in report generation:', error);
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
              <li>• The assessment takes approximately 25-30 minutes</li>
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

                {/* Detailed Personality Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Personality Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(scores).map(([dimension, data]) => {
                        const dimInfo = personalityDimensions[dimension as keyof typeof personalityDimensions];
                        const strengthLevel = data.percentile >= 70 ? 'Strong' : data.percentile >= 30 ? 'Moderate' : 'Developing';
                        const colorClass = data.percentile >= 70 ? 'text-green-600' : data.percentile >= 30 ? 'text-blue-600' : 'text-orange-600';
                        
                        return (
                          <div key={dimension} className="border-l-4 border-blue-200 pl-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold">{dimInfo.name}</h4>
                              <span className={`text-sm font-medium ${colorClass}`}>{strengthLevel} ({data.percentile}%)</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{dimInfo.description}</p>
                            <div className="bg-slate-50 p-2 rounded text-xs">
                              <strong>Workplace Implications:</strong> {getWorkplaceImplications(dimension, data.percentile)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Targeted Interview Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(scores).map(([dimension, data]) => (
                        <div key={dimension} className="border rounded-lg p-3">
                          <h4 className="font-semibold mb-2">{personalityDimensions[dimension as keyof typeof personalityDimensions].name}</h4>
                          <div className="space-y-2">
                            {getInterviewQuestions(dimension, data.percentile).map((question, index) => (
                              <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                                <span className="font-medium text-blue-800">Q{index + 1}:</span> {question}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Development Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Development & Coaching Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(scores)
                        .filter(([, data]) => data.percentile < 70)
                        .map(([dimension, data]) => (
                          <div key={dimension} className="bg-green-50 p-3 rounded">
                            <span className="font-medium text-green-800">{personalityDimensions[dimension as keyof typeof personalityDimensions].name} Development:</span>
                            <p className="text-sm text-green-700 mt-1">{getDevelopmentRecommendations(dimension, data.percentile)}</p>
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
  if (phase === 'results') {
    // Transform responses into AssessmentData format for UnifiedAssessmentService
    const assessmentData = {
      responses: responses.map(r => ({
        questionId: r.questionId,
        answer: r.answer,
        responseTime: r.responseTime
      })),
      candidateInfo: {
        name: userProfile.name,
        email: userProfile.email
      }
    };
    
    return (
      <AssessmentResults 
        data={assessmentData}
        assessmentType="cair-personality"
        candidateInfo={{
          name: userProfile.name,
          email: userProfile.email
        }}
      />
    );
  }

  return null;
};