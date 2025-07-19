import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  Trophy, 
  Star, 
  Download,
  Zap,
  Brain,
  Users,
  CheckCircle2
} from "lucide-react";

const SampleCareerLaunchReport = () => {
  const { toast } = useToast();

  // Updated sample data reflecting the expanded 130+ question assessment
  const sampleResults = {
    interests: {
      realistic: 75,      // Technical/hands-on work  
      investigative: 85,  // Research and analysis
      artistic: 78,       // Creative expression
      social: 70,         // Helping others
      enterprising: 82,   // Leadership and business
      conventional: 65    // Organized, structured work
    },
    aptitudes: [
      { name: "Abstract Logic", score: 92 },
      { name: "Verbal Reasoning", score: 88 },
      { name: "Numerical Reasoning", score: 85 },
      { name: "Memory/Attention", score: 79 }
    ],
    personality: {
      introversion: 45,        // More extraverted
      openness: 88,           // High openness to experience  
      conscientiousness: 76,   // Well-organized
      adaptability: 82        // Flexible and adaptable
    },
    values: {
      security: 65,      // Moderate need for security
      achievement: 78,   // High achievement drive
      creativity: 85,    // Strong creative values
      community: 72      // Good community orientation
    },
    flags: {
      misalignment: [
        "High Investigative interest + High Openness suggests research roles with creative elements",
        "Strong Abstract Logic + High Creativity indicates potential for innovative problem-solving roles"
      ]
    },
    career_fit: {
      label: "Strategic Creative Thinker",
      suggestions: [
        "Data Scientist",
        "UX Research Analyst", 
        "Product Manager",
        "Innovation Consultant",
        "Research & Development Manager"
      ]
    },
    action_plan: [
      "Leverage your exceptional abstract logic skills through advanced analytics or research roles",
      "Explore opportunities in emerging fields that combine data science with creative problem-solving",
      "Consider leadership roles in innovation-focused teams or R&D departments", 
      "Develop cross-functional skills in both technical analysis and creative strategy",
      "Seek mentorship from professionals in data-driven creative industries"
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
              CareerLaunch Sample Results
            </h1>
            <p className="text-xl text-muted-foreground">
              Preview of what your personalized career insights would look like
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 This is a sample report showing what your results would look like. 
                Take the actual assessment to get your personalized career profile!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Your Career Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{sampleResults.career_fit.label}</h3>
                    <p className="text-sm text-muted-foreground mb-3">Best-fit career suggestions:</p>
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
                  Top Aptitudes
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
                  Top Interests
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
                  Personality Traits
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
                  Core Values
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
                Recommended Action Plan
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

          <div className="text-center space-y-6">
            <Button onClick={downloadReport} size="lg" className="text-lg px-8 py-6">
              <Download className="h-5 w-5 mr-2" />
              Download Sample Report
            </Button>
            
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Want Your Actual Results?</h3>
              <p className="text-muted-foreground mb-4">
                This sample shows the comprehensive insights you'll receive. Take the full assessment to get your personalized career profile based on your unique interests, aptitudes, personality, and values.
              </p>
              <Button variant="outline" asChild>
                <a href="/career-launch">
                  <Rocket className="h-4 w-4 mr-2" />
                  Take the Real Assessment
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