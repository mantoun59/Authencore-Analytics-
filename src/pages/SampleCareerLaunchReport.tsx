import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { CareerLaunchReportEnhanced } from "@/components/CareerLaunchReportEnhanced";
import { AccessibilityEnhancements } from "@/components/AccessibilityEnhancements";
import { 
  Trophy, 
  Download,
  Rocket,
  Target,
  Brain,
  Zap,
  Users,
  Star,
  Lightbulb,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

// Enhanced AI Sample Data
const enhancedAIFeatures = {
  distortionAnalysis: {
    score: 2,
    reliability: 'high',
    confidenceLevel: 94,
    responsePatterns: {
      fakeGood: 1,
      fakeBad: 0,
      random: 1,
      inconsistency: 2
    },
    interpretation: 'Assessment shows excellent validity with consistent response patterns and high reliability.'
  },
  cognitiveProfile: {
    processingStyle: 'Analytical-Creative Hybrid',
    learningPreferences: ['Visual Learning', 'Hands-on Experience', 'Collaborative Problem Solving'],
    decisionMakingApproach: 'Data-informed with intuitive validation',
    problemSolvingStrategy: 'Systematic analysis followed by creative synthesis'
  },
  behavioralPredictions: {
    workplacePerformance: {
      predictedEffectiveness: 87,
      performanceIndicators: ['High innovation potential', 'Strong team collaboration', 'Effective under pressure']
    },
    teamDynamics: {
      collaborationStyle: 'Collaborative leader with mentoring tendencies',
      leadershipPotential: 82,
      influenceStyle: 'Inspirational and consultative'
    }
  },
  enhancedInterviewQuestions: [
    'Describe a time when you had to balance analytical thinking with creative problem-solving.',
    'How do you approach learning new technologies or methodologies?',
    'Tell me about a situation where you led a team through an innovative project.',
    'How do you validate your creative ideas with data or feedback?'
  ]
};

const SampleCareerLaunchReport = () => {
  const { toast } = useToast();

  // Humanized sample data that feels real and relatable
  const sampleResults = {
    interests: {
      realistic: 75,      // Love working with your hands and solving tangible problems  
      investigative: 85,  // Your curiosity drives you to dig deep and understand how things work
      artistic: 78,       // You have a creative spark that needs an outlet
      social: 70,         // Making a difference in people's lives matters to you
      enterprising: 82,   // You're drawn to leadership and building something meaningful
      conventional: 65    // You appreciate structure, but don't want to be boxed in
    },
    aptitudes: [
      { name: "Abstract Thinking", score: 92 },
      { name: "Communication Skills", score: 88 },
      { name: "Problem Solving", score: 85 },
      { name: "Focus & Memory", score: 79 }
    ],
    personality: {
      introversion: 45,        // You're energized by people but also need your thinking time
      openness: 88,           // You're always up for new experiences and ideas  
      conscientiousness: 76,   // You get things done, but you're not obsessive about it
      adaptability: 82        // Change doesn't scare you - it excites you
    },
    values: {
      security: 65,      // Stability matters, but not at the cost of growth
      achievement: 78,   // You want to make your mark on the world
      creativity: 85,    // Innovation and originality fuel your soul
      community: 72      // You want your work to have positive impact
    },
    flags: {
      insights: [
        "Your blend of analytical thinking and creativity is rare - you could thrive in roles that let you innovate with data",
        "You're wired to be a bridge-builder between technical teams and creative visionaries"
      ]
    },
    career_fit: {
      label: "The Innovation Catalyst",
      description: "You're someone who can see patterns others miss and turn complex problems into elegant solutions. You thrive when you can combine analytical rigor with creative thinking.",
      suggestions: [
        "Data Scientist (with creative projects)",
        "UX Research Lead", 
        "Product Strategy Manager",
        "Innovation Consultant",
        "Creative Technology Director"
      ]
    },
    action_plan: [
      "Start building a portfolio that showcases both your analytical skills and creative problem-solving - this combo is your superpower",
      "Look for roles in companies that value innovation and aren't afraid to try new approaches",
      "Consider positions where you can work across departments - you're naturally good at translating between different teams", 
      "Develop skills in both data visualization and storytelling - you can make complex insights accessible and compelling",
      "Find mentors who've successfully blended analytical and creative careers - they'll understand your unique perspective"
    ]
  };

  const sampleUserProfile = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    assessmentDate: "2024-07-19",
    questionsAnswered: 145,  // Updated to reflect new question count
    timeSpent: "28 minutes",
    reliabilityScore: 94     // High reliability due to expanded question set
  };

  const downloadReport = async () => {
    try {
      const reportData = {
        assessmentType: 'career_launch',
        results: sampleResults,
        userData: {
          name: sampleUserProfile.name,
          email: sampleUserProfile.email,
          date: new Date().toLocaleDateString(),
          questionsAnswered: sampleUserProfile.questionsAnswered,
          timeSpent: sampleUserProfile.timeSpent,
          reliabilityScore: sampleUserProfile.reliabilityScore
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
            title: "Report Opened",
            description: "Use your browser's Print dialog to save as PDF. Select 'Save as PDF' as destination.",
          });
        } else {
          // Fallback: download as HTML if popup blocked
          const blob = new Blob([response.data], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Sample-CareerLaunch-Report.html`;
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
      console.error('Error downloading sample report:', error);
      toast({
        title: "Download Error",
        description: "Failed to download sample report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Trophy className="h-4 w-4 mr-2" />
              Sample Assessment Results
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Meet Alex: A CareerLaunch Success Story
            </h1>
            <p className="text-xl text-muted-foreground">
              See how our assessment helped Alex discover their perfect career path
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ✨ This is Alex's actual results format - imagine seeing your own unique strengths and career matches! 
                Ready to discover what makes you tick?
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Alex's Career Sweet Spot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-primary">{sampleResults.career_fit.label}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{sampleResults.career_fit.description}</p>
                    <p className="text-sm font-medium mb-3">Perfect roles for Alex:</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleResults.career_fit.suggestions.map((career: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">{career}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  Alex's Natural Superpowers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleResults.aptitudes.slice(0, 3).map((aptitude: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{aptitude.name}</span>
                      <Badge variant="outline">{aptitude.score}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  What Gets Alex Excited
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(sampleResults.interests)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([interest, score], index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{interest}</span>
                        <Badge variant="outline">{String(score)}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  How Alex Shows Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(sampleResults.personality)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([trait, score], index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{trait}</span>
                        <Badge variant="outline">{String(score)}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  What Drives Alex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(sampleResults.values)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([value, score], index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{value}</span>
                        <Badge variant="outline">{String(score)}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Alex's Next Steps to Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sampleResults.action_plan.map((action: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Enhanced AI Features Section */}
          <div className="space-y-6 mb-8">
            <div className="text-center">
              <Badge variant="default" className="mb-4">
                <Brain className="h-4 w-4 mr-2" />
                Enhanced AI Analysis
              </Badge>
              <h2 className="text-2xl font-bold mb-2">AI-Powered Insights</h2>
              <p className="text-muted-foreground">
                Advanced AI engine provides deeper cognitive profiling and behavioral predictions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                    Validity & Distortion Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Assessment Reliability:</span>
                    <Badge variant="default" className="bg-green-600">
                      {enhancedAIFeatures.distortionAnalysis.reliability.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">AI Confidence Level:</span>
                    <span className="text-sm font-bold text-primary">
                      {enhancedAIFeatures.distortionAnalysis.confidenceLevel}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Distortion Score:</span>
                    <Badge variant="secondary">
                      {enhancedAIFeatures.distortionAnalysis.score}/10
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {enhancedAIFeatures.distortionAnalysis.interpretation}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Cognitive Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Processing Style:</span>
                    <p className="text-sm text-muted-foreground">
                      {enhancedAIFeatures.cognitiveProfile.processingStyle}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Decision Making:</span>
                    <p className="text-sm text-muted-foreground">
                      {enhancedAIFeatures.cognitiveProfile.decisionMakingApproach}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Learning Preferences:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {enhancedAIFeatures.cognitiveProfile.learningPreferences.map((pref, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  AI-Predicted Workplace Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Predicted Effectiveness:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={enhancedAIFeatures.behavioralPredictions.workplacePerformance.predictedEffectiveness} className="w-24" />
                    <span className="text-sm font-bold">
                      {enhancedAIFeatures.behavioralPredictions.workplacePerformance.predictedEffectiveness}%
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm">Key Performance Indicators:</span>
                  <div className="mt-2 space-y-1">
                    {enhancedAIFeatures.behavioralPredictions.workplacePerformance.performanceIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-muted-foreground">{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <span className="font-medium text-sm text-blue-800">Leadership Potential:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={enhancedAIFeatures.behavioralPredictions.teamDynamics.leadershipPotential} className="w-32" />
                    <span className="text-sm font-bold text-blue-800">
                      {enhancedAIFeatures.behavioralPredictions.teamDynamics.leadershipPotential}%
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    {enhancedAIFeatures.behavioralPredictions.teamDynamics.collaborationStyle}
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="text-center space-y-6">
            <Button onClick={downloadReport} size="lg" className="text-lg px-8 py-6">
              <Download className="h-5 w-5 mr-2" />
              Download Sample Report
            </Button>
            
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Ready to Discover Your Own Career Story?</h3>
              <p className="text-muted-foreground mb-4">
                Alex's journey started with our comprehensive assessment - just like yours will! In about 25 minutes, you'll uncover your unique strengths, discover careers that truly fit who you are, and get a roadmap for your professional future. No two results are the same, because no two people are the same.
              </p>
              <Button variant="outline" asChild>
                <a href="/career-launch">
                  <Rocket className="h-4 w-4 mr-2" />
                  Start Your Career Discovery
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SampleCareerLaunchReport;