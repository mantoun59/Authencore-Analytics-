import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Play, Clock, Brain, Users, Target } from "lucide-react";

interface AssessmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentType: string;
  assessmentTitle: string;
  assessmentDescription: string;
  sampleQuestions: string[];
  estimatedTime: string;
  onStartAssessment: () => void;
}

const AssessmentPreviewModal = ({
  isOpen,
  onClose,
  assessmentType,
  assessmentTitle,
  assessmentDescription,
  sampleQuestions,
  estimatedTime,
  onStartAssessment
}: AssessmentPreviewModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getAssessmentIcon = () => {
    switch (assessmentType) {
      case 'leadership': return Users;
      case 'communication': return Target;
      case 'career-launch': return Brain;
      default: return CheckCircle2;
    }
  };

  const IconComponent = getAssessmentIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <IconComponent className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">{assessmentTitle} Preview</DialogTitle>
          </div>
          <DialogDescription>
            {assessmentDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assessment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{sampleQuestions.length * 4}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Instant PDF report upon completion
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Personalized insights and recommendations
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Professional-grade analysis
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sample Questions</span>
                <Badge variant="outline">
                  {currentQuestionIndex + 1} of {sampleQuestions.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Get a feel for the types of questions you'll encounter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress 
                value={((currentQuestionIndex + 1) / sampleQuestions.length) * 100} 
                className="w-full"
              />
              
              <div className="min-h-[100px] p-4 bg-muted/30 rounded-lg border-l-4 border-primary animate-fade-in"
                   key={currentQuestionIndex}>
                <p className="text-base leading-relaxed">
                  {sampleQuestions[currentQuestionIndex]}
                </p>
              </div>

              {/* Sample answer options */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">Sample response options:</div>
                {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
                  <div key={index} className="p-2 border rounded-lg text-sm bg-background hover:bg-muted/50 transition-colors cursor-default">
                    {option}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  size="sm"
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === sampleQuestions.length - 1}
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Ready to Get Your Full Assessment?</h3>
            <p className="text-muted-foreground mb-4">
              Take the complete assessment to receive your personalized report with detailed insights, 
              recommendations, and actionable development plans.
            </p>
            <div className="flex gap-3">
              <Button onClick={onStartAssessment} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Full Assessment
              </Button>
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentPreviewModal;