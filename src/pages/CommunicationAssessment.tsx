import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare, Users, Target, Zap, ArrowRight, ArrowLeft } from "lucide-react";

const CommunicationAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      text: "When presenting to a group, I prefer to:",
      options: [
        { value: "direct", label: "Get straight to the point with clear facts" },
        { value: "engaging", label: "Use stories and examples to connect" },
        { value: "collaborative", label: "Involve the audience in discussions" },
        { value: "structured", label: "Follow a detailed, logical framework" }
      ]
    },
    {
      id: 2,
      text: "In team meetings, I typically:",
      options: [
        { value: "lead", label: "Take charge and guide the discussion" },
        { value: "support", label: "Help facilitate others' contributions" },
        { value: "analyze", label: "Focus on data and logical analysis" },
        { value: "harmonize", label: "Work to maintain group harmony" }
      ]
    },
    {
      id: 3,
      text: "When giving feedback, I tend to:",
      options: [
        { value: "direct", label: "Be straightforward and specific" },
        { value: "encouraging", label: "Focus on positive reinforcement" },
        { value: "constructive", label: "Provide detailed improvement suggestions" },
        { value: "diplomatic", label: "Frame feedback gently and tactfully" }
      ]
    },
    {
      id: 4,
      text: "My preferred communication channel is:",
      options: [
        { value: "face-to-face", label: "In-person conversations" },
        { value: "video", label: "Video calls and virtual meetings" },
        { value: "written", label: "Email and written documentation" },
        { value: "instant", label: "Chat and instant messaging" }
      ]
    },
    {
      id: 5,
      text: "When resolving conflicts, I usually:",
      options: [
        { value: "address", label: "Address issues head-on immediately" },
        { value: "mediate", label: "Help parties find common ground" },
        { value: "analyze", label: "Gather all facts before acting" },
        { value: "cool-down", label: "Let emotions settle before discussing" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const styles = {
      direct: 0,
      collaborative: 0,
      analytical: 0,
      supportive: 0
    };

    answers.forEach(answer => {
      if (['direct', 'lead', 'address'].includes(answer)) {
        styles.direct++;
      } else if (['engaging', 'support', 'mediate'].includes(answer)) {
        styles.collaborative++;
      } else if (['structured', 'analyze', 'written'].includes(answer)) {
        styles.analytical++;
      } else {
        styles.supportive++;
      }
    });

    return styles;
  };

  const getMainStyle = () => {
    const results = calculateResults();
    return Object.entries(results).reduce((a, b) => results[a[0]] > results[b[0]] ? a : b)[0];
  };

  const getStyleDescription = (style: string) => {
    const descriptions = {
      direct: "You communicate with clarity and decisiveness, preferring straightforward approaches.",
      collaborative: "You excel at bringing people together and facilitating group discussions.",
      analytical: "You rely on data and logical frameworks to structure your communications.",
      supportive: "You prioritize relationships and create comfortable communication environments."
    };
    return descriptions[style as keyof typeof descriptions];
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const mainStyle = getMainStyle();
    const results = calculateResults();
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-indigo-100 text-indigo-800">
              Communication Assessment Complete
            </Badge>
            <h1 className="text-3xl font-bold mb-4">Your Communication Style</h1>
            <p className="text-muted-foreground">
              Understanding how you naturally communicate can help you adapt to different situations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  Primary Style: {mainStyle.charAt(0).toUpperCase() + mainStyle.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {getStyleDescription(mainStyle)}
                </p>
                <div className="space-y-3">
                  {Object.entries(results).map(([style, score]) => (
                    <div key={style} className="flex justify-between items-center">
                      <span className="capitalize">{style}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(score / questions.length) * 100} className="w-20" />
                        <span className="text-sm font-medium">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Practice adapting your style to your audience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Consider multiple communication channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Build awareness of others' communication preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Develop flexibility in high-stakes situations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate('/assessment')}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
            >
              Explore Other Assessments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800">
            Communication Assessment
          </Badge>
          <h1 className="text-3xl font-bold mb-4">
            Discover Your Communication Style
          </h1>
          <p className="text-muted-foreground">
            Understanding how you naturally communicate helps you adapt to different situations and audiences
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion] || ""} 
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationAssessment;