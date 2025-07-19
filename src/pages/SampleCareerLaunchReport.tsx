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

  // Sample assessment results data
  const sampleResults = {
    interests: {
      investigative: 85,
      artistic: 78,
      social: 70,
      enterprising: 72,
      realistic: 65,
      conventional: 60
    },
    aptitudes: [
      { name: "Abstract Logic", score: 92 },
      { name: "Verbal Reasoning", score: 88 },
      { name: "Numerical Reasoning", score: 85 },
      { name: "Memory/Attention", score: 82 }
    ],
    personality: {
      openness: 88,
      conscientiousness: 76,
      adaptability: 82,
      introversion: 65
    },
    values: {
      creativity: 85,
      achievement: 78,
      security: 65,
      community: 72
    },
    career_fit: {
      label: "Strategic Creative Thinker",
      suggestions: ["Data Scientist", "UX Research Analyst", "Product Manager", "Content Strategist", "Research Analyst"]
    },
    action_plan: [
      "Leverage your strength in abstract logic through specialized training or certification in data science or analytics.",
      "Consider internships in creative or analytical industries to explore diverse career paths.",
      "Seek opportunities with clear advancement paths and performance recognition.",
      "Explore informational interviews in your areas of interest to gain real-world insights."
    ]
  };

  const sampleUserProfile = {
    name: "Sample User",
    email: "sample@example.com"
  };

  const downloadReport = async () => {
    try {
      const reportData = {
        assessmentType: 'career_launch',
        results: sampleResults,
        userData: {
          name: sampleUserProfile.name,
          email: sampleUserProfile.email,
          date: new Date().toLocaleDateString()
        }
      };

      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: reportData
      });

      if (response.data) {
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
          title: "Sample Report Downloaded",
          description: "Your sample CareerLaunch report has been downloaded successfully.",
        });
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