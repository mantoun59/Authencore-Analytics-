import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { careerLaunchQuestions } from "@/data/careerLaunchQuestionsFixed";
import { useCareerLaunchScoring } from "@/hooks/useCareerLaunchScoring";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Brain, Target, Star, Users, Settings } from "lucide-react";
import EnhancedProgressIndicator from "@/components/EnhancedProgressIndicator";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { ResponseTimeAnalytics } from "@/utils/responseTimeAnalytics";

interface CareerLaunchAssessmentProps {
  onComplete: (results: any) => void;
  userProfile: {
    name: string;
    email: string;
  };
}
import { productionLogger } from '@/utils/productionConfig';

export default function CareerLaunchAssessment({ onComplete, userProfile }: CareerLaunchAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{
    id: string;
    category: 'interest' | 'aptitude' | 'personality' | 'value';
    dimension: string;
    score: number;
  }>>([]);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showAccessibilityControls, setShowAccessibilityControls] = useState(false);
  const { calculateScores } = useCareerLaunchScoring();
  const { toast } = useToast();

  // Update time spent every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((Date.now() - startTime) / (1000 * 60)); // Convert to minutes
    }, 30000);

    return () => clearInterval(interval);
  }, [startTime]);

  const currentQuestion = careerLaunchQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / careerLaunchQuestions.length) * 100;
  
  // Calculate questions per category for enhanced progress
  const questionsPerCategory = careerLaunchQuestions.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Estimate completion time (average 45 seconds per question)
  const estimatedTime = (careerLaunchQuestions.length * 0.75); // 45 seconds = 0.75 minutes

  const handleAnswer = (selectedOption: 'A' | 'B') => {
    // Record response time analytics
    const responseTime = (Date.now() - questionStartTime) / 1000; // in seconds
    ResponseTimeAnalytics.recordResponse({
      questionId: currentQuestion.id,
      responseTime,
      timestamp: Date.now(),
      questionType: currentQuestion.category,
      dimension: currentQuestion.dimension
    });
    
    // Reset timer for next question
    setQuestionStartTime(Date.now());
    
    const score = selectedOption === 'A' ? 1 : 0;
    
    // For interests, score the selected dimension
    // For aptitudes, score based on agreement (simplified for self-assessment)
    // For personality/values, score the A option as positive for that dimension
    let actualScore = score;
    
    // Handle scoring logic based on question type
    if (currentQuestion.category === 'RIASEC') {
      // For RIASEC questions, use 5-point scale
      actualScore = selectedOption === 'A' ? 4 : 0;
    } else if (currentQuestion.category === 'Aptitude') {
      // For Aptitude questions, use 3-point scale
      actualScore = selectedOption === 'A' ? 2 : 0;
    } else if (currentQuestion.category === 'Personality') {
      // For Personality questions, use 3-point scale
      actualScore = selectedOption === 'A' ? 2 : 0;
    } else if (currentQuestion.category === 'Values') {
      // For Values questions, use 3-point scale
      actualScore = selectedOption === 'A' ? 2 : 0;
    } else {
      // Default scoring
      actualScore = selectedOption === 'A' ? 1 : 0;
    }

    // Apply reverse scoring if needed
    if (currentQuestion.isReversed) {
      const maxScore = currentQuestion.category === 'RIASEC' ? 4 : 2;
      actualScore = maxScore - actualScore;
    }

    // Apply scoring weight
    actualScore = actualScore * currentQuestion.scoringWeight;

    // Map categories and dimensions to match scoring engine
    const categoryMap: Record<string, 'interest' | 'aptitude' | 'personality' | 'value'> = {
      'RIASEC': 'interest',
      'Aptitude': 'aptitude', 
      'Personality': 'personality',
      'Values': 'value'
    };

    // Map dimensions to match scoring engine expectations
    const dimensionMap: Record<string, string> = {
      // Interest dimensions (already lowercase)
      'Realistic': 'realistic',
      'Investigative': 'investigative',
      'Artistic': 'artistic',
      'Social': 'social',
      'Enterprising': 'enterprising',
      'Conventional': 'conventional',
      // Aptitude dimensions
      'Numerical Reasoning': 'numerical',
      'Verbal Reasoning': 'verbal',
      'Spatial Thinking': 'abstract',
      'Problem Solving': 'memory',
      // Personality dimensions
      'Extraversion': 'introversion',
      'Conscientiousness': 'conscientiousness',
      'Emotional Stability': 'adaptability',
      'Openness to Experience': 'openness',
      // Values dimensions
      'Autonomy': 'creativity',
      'Security': 'security',
      'Impact': 'community',
      'Growth': 'achievement'
    };

    const mappedDimension = dimensionMap[currentQuestion.dimension] || currentQuestion.dimension.toLowerCase();

    const newAnswer = {
      id: currentQuestion.id,
      category: categoryMap[currentQuestion.category],
      dimension: mappedDimension,
      score: actualScore
    };

    setAnswers(prev => [...prev, newAnswer]);

    if (currentQuestionIndex < careerLaunchQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment([...answers, newAnswer]);
    }
  };

  const completeAssessment = async (finalAnswers: typeof answers) => {
    try {
      // Calculate scores using the enhanced scoring engine with response time data
      const sessionData = ResponseTimeAnalytics.getSessionData();
      const results = calculateScores(finalAnswers, userProfile, sessionData.totalTime / 1000);
      
      // Save to Supabase
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase.from('assessment_results').insert({
          user_id: user.user.id,
          assessment_type: 'career_launch',
          results: {
            ...results,
            candidateData: userProfile,
            rawAnswers: finalAnswers,
            completedAt: new Date().toISOString()
          } as any
        });
      }

      toast({
        title: "Assessment Complete!",
        description: "Your CareerLaunch results are ready.",
      });

      onComplete(results);
    } catch (error) {
      productionLogger.error('Error saving assessment results:', error);
      toast({
        title: "Error",
        description: "Failed to save results. Please try again.",
        variant: "destructive"
      });
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'interest': return <Target className="h-5 w-5" />;
      case 'aptitude': return <Brain className="h-5 w-5" />;
      case 'personality': return <Users className="h-5 w-5" />;
      case 'values':
      case 'value': return <Star className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'interest': return 'text-blue-600';
      case 'aptitude': return 'text-green-600';
      case 'personality': return 'text-purple-600';
      case 'values':
      case 'value': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Progress Header */}
        <EnhancedProgressIndicator
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={careerLaunchQuestions.length}
          estimatedTime={estimatedTime}
          timeSpent={timeSpent}
          currentCategory={currentQuestion.category}
          questionsPerCategory={questionsPerCategory}
        />

        {/* Question Card */}
        <Card className="mb-6 shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-br text-white ${
                currentQuestion.category === 'RIASEC' ? 'from-blue-500 to-blue-600' :
                currentQuestion.category === 'Aptitude' ? 'from-green-500 to-green-600' :
                currentQuestion.category === 'Personality' ? 'from-purple-500 to-purple-600' :
                'from-orange-500 to-orange-600'
              }`}>
                {getCategoryIcon(currentQuestion.category)}
              </div>
            </div>
            <CardTitle className="text-xl text-center leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <Button
              onClick={() => handleAnswer('A')}
              variant="outline"
              className="w-full p-6 h-auto text-left hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all duration-200 border-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center font-bold text-primary border-2 border-primary/20">
                  A
                </div>
                <span className="text-lg font-medium">{currentQuestion.optionA}</span>
              </div>
            </Button>

            <Button
              onClick={() => handleAnswer('B')}
              variant="outline"
              className="w-full p-6 h-auto text-left hover:bg-secondary/5 hover:border-secondary/50 hover:shadow-md transition-all duration-200 border-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/30 flex items-center justify-center font-bold text-secondary border-2 border-secondary/20">
                  B
                </div>
                <span className="text-lg font-medium">{currentQuestion.optionB}</span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Navigation and Controls */}
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPrevious}
            variant="ghost"
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowAccessibilityControls(true)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              aria-label="Open accessibility settings"
            >
              <Settings className="h-4 w-4" />
              Accessibility
            </Button>
            
            <div className="text-sm text-muted-foreground flex items-center">
              Progress: {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Controls Modal */}
      <AccessibilityControls
        isOpen={showAccessibilityControls}
        onClose={() => setShowAccessibilityControls(false)}
      />
    </div>
  );
}