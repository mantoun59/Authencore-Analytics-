import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicantDataForm from "@/components/ApplicantDataForm";
import CareerLaunchAssessment from "@/components/CareerLaunchAssessment";
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

interface UserProfile {
  name: string;
  email: string;
}

const CareerLaunch = () => {
  const { toast } = useToast();
  const [gamePhase, setGamePhase] = useState<'welcome' | 'registration' | 'assessment' | 'results'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: ''
  });
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const handleApplicantDataComplete = (data: any) => {
    setUserProfile({
      name: data.fullName,
      email: data.email,
    });
    setGamePhase('assessment');
  };

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results);
    setGamePhase('results');
  };

  const downloadReport = async () => {
    try {
      const reportData = {
        assessmentType: 'career_launch',
        results: assessmentResults,
        userData: {
          name: userProfile.name,
          email: userProfile.email,
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
          a.download = `CareerLaunch-Report-${userProfile.name.replace(/\s+/g, '-')}.html`;
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
      console.error('Error downloading report:', error);
      toast({
        title: "Download Error",
        description: "Failed to download report. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (gamePhase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                <Rocket className="h-4 w-4 mr-2" />
                Career Discovery Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CareerLaunch
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover your perfect career path through our comprehensive assessment that analyzes your interests, aptitudes, personality, and values.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <CardTitle className="text-lg">Interest Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Discover what truly motivates and engages you using the RIASEC model.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Brain className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <CardTitle className="text-lg">Aptitude Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identify your natural talents and cognitive strengths.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <CardTitle className="text-lg">Personality Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Understand your work style and interpersonal preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Star className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <CardTitle className="text-lg">Values Alignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore what matters most to you in your career journey.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={() => setGamePhase('registration')}
                className="text-lg px-8 py-6"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Your Career Discovery
              </Button>
              <p className="text-sm text-muted-foreground">
                Assessment takes approximately 30-35 minutes • Get instant results
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (gamePhase === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Let's Get Started</h1>
              <p className="text-muted-foreground">
                Please provide some basic information to personalize your career assessment.
              </p>
            </div>
            <ApplicantDataForm 
              onComplete={handleApplicantDataComplete}
              assessmentType="Career Launch"
              assessmentTitle="Career Discovery Assessment"
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (gamePhase === 'assessment') {
    return (
      <CareerLaunchAssessment 
        onComplete={handleAssessmentComplete}
        userProfile={userProfile}
      />
    );
  }

  // Results phase
  if (gamePhase === 'results' && assessmentResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Trophy className="h-4 w-4 mr-2" />
                Assessment Complete
              </Badge>
              <h1 className="text-4xl font-bold mb-4">
                Your CareerLaunch Results
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover your personalized career insights, {userProfile.name}
              </p>
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
                      <h3 className="font-semibold text-lg mb-2">{assessmentResults.career_fit?.label || 'Career Professional'}</h3>
                      <p className="text-sm text-muted-foreground mb-3">Best-fit career suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {assessmentResults.career_fit?.suggestions?.map((career: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">{career}</Badge>
                        )) || <Badge variant="secondary">Analyst</Badge>}
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
                    {assessmentResults.aptitudes?.slice(0, 3).map((aptitude: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{aptitude.name}</span>
                        <Badge variant="outline">{aptitude.score}%</Badge>
                      </div>
                    )) || (
                      <div className="text-sm text-muted-foreground">Aptitude scores calculating...</div>
                    )}
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
                    {assessmentResults.interests && Object.entries(assessmentResults.interests)
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
                    {assessmentResults.personality && Object.entries(assessmentResults.personality)
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
                    {assessmentResults.values && Object.entries(assessmentResults.values)
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

            {assessmentResults.action_plan && assessmentResults.action_plan.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Recommended Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessmentResults.action_plan.map((action: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <div className="text-center space-y-4">
              <Button onClick={downloadReport} size="lg" className="text-lg px-8 py-6">
                <Download className="h-5 w-5 mr-2" />
                Download Full Report
              </Button>
              <p className="text-sm text-muted-foreground">
                Get a comprehensive PDF report with detailed insights and recommendations
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
};

export default CareerLaunch;