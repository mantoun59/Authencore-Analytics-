import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Users, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CandidateTesting = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [candidateInfo, setCandidateInfo] = useState({
    name: "",
    email: "",
    position: ""
  });

  const assessments = [
    {
      id: "career-launch",
      title: "Career Launch Assessment",
      description: "Comprehensive career readiness evaluation",
      duration: "15-20 minutes",
      route: "/career-launch"
    },
    {
      id: "leadership",
      title: "Leadership Assessment", 
      description: "Evaluate leadership potential and style",
      duration: "10-15 minutes",
      route: "/leadership"
    },
    {
      id: "communication",
      title: "Communication Assessment",
      description: "Assess communication skills and style",
      duration: "12-18 minutes", 
      route: "/communication"
    },
    {
      id: "emotional-intelligence",
      title: "Emotional Intelligence",
      description: "Measure emotional awareness and management",
      duration: "10-15 minutes",
      route: "/emotional-intelligence"
    },
    {
      id: "stress-resilience",
      title: "Stress & Resilience",
      description: "Evaluate stress management capabilities",
      duration: "8-12 minutes",
      route: "/stress-resilience"
    },
    {
      id: "cultural-intelligence",
      title: "Cultural Intelligence",
      description: "Assess cross-cultural competency",
      duration: "10-15 minutes",
      route: "/cultural-intelligence"
    },
    {
      id: "cair",
      title: "CAIR Assessment",
      description: "Comprehensive 120-question personality assessment with validity detection",
      duration: "25-30 minutes",
      route: "/cair"
    },
    {
      id: "genz",
      title: "Gen Z Assessment",
      description: "Generation-specific workplace dynamics evaluation",
      duration: "10-15 minutes",
      route: "/genz"
    },
    {
      id: "digital-wellness",
      title: "Digital Wellness Assessment",
      description: "Evaluate digital habits and well-being",
      duration: "8-12 minutes",
      route: "/digital-wellness"
    },
    {
      id: "faith-values",
      title: "Faith & Values Assessment",
      description: "Assess personal values and belief systems",
      duration: "10-15 minutes",
      route: "/faith-values"
    }
  ];

  const handleStartAssessment = (route: string) => {
    if (!candidateInfo.name || !candidateInfo.email) {
      toast({
        title: "Information Required",
        description: "Please fill in your name and email before starting an assessment.",
        variant: "destructive"
      });
      return;
    }
    
    // Store candidate info in localStorage for the assessment
    localStorage.setItem('candidateTestingInfo', JSON.stringify(candidateInfo));
    navigate(route);
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide your feedback before submitting.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would be sent to your backend
    // Candidate feedback collected successfully
    const feedbackData = {
      ...candidateInfo,
      feedback,
      timestamp: new Date().toISOString()
    };

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve our assessments.",
    });

    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AuthenCore Analytics - Candidate Testing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to our assessment testing environment. Please complete the candidate information and select assessments to test.
          </p>
        </div>

        {/* Candidate Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Candidate Information
            </CardTitle>
            <CardDescription>
              Please provide your basic information for testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="position">Position (Optional)</Label>
                <Input
                  id="position"
                  value={candidateInfo.position}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Position applying for"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Assessments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Available Assessments
            </CardTitle>
            <CardDescription>
              Select any assessment to test the candidate experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {assessment.duration}
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => handleStartAssessment(assessment.route)}
                      className="w-full"
                    >
                      Start Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Testing Feedback
            </CardTitle>
            <CardDescription>
              Share your experience testing the assessments to help us improve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Please share your thoughts on the assessment experience, any issues encountered, suggestions for improvement, etc."
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitFeedback}>
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Testing URL: <code className="bg-muted px-2 py-1 rounded">{window.location.href}</code></p>
          <p className="mt-2">Share this link with candidates for testing purposes</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateTesting;