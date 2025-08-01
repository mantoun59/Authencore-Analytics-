import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicantDataForm from "@/components/ApplicantDataForm";
import CareerLaunchAssessment from "@/components/CareerLaunchAssessment";
import { CareerLaunchReportEnhanced } from "@/components/CareerLaunchReportEnhanced";
import { PaymentProtection } from "@/components/PaymentProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateHtmlReport } from '@/utils/htmlReportGenerator';
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import ConsentAgreement from "@/components/ConsentAgreement";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = useState<'consent' | 'welcome' | 'registration' | 'assessment' | 'results'>('consent');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: ''
  });
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const handleConsentAccept = () => {
    setGamePhase('welcome');
  };

  const handleConsentDecline = () => {
    navigate('/');
  };

  const handleApplicantDataComplete = (data: any) => {
    setUserProfile({
      name: data.fullName,
      email: data.email,
    });
    setGamePhase('assessment');
  };

  const handleAssessmentComplete = (results: any) => {
    // Transform results into AssessmentData format for UnifiedAssessmentService
    const assessmentData = {
      responses: results.responses || [],
      candidateInfo: {
        name: userProfile.name,
        email: userProfile.email
      }
    };
    setAssessmentResults(assessmentData);
    setGamePhase('results');
  };

  const downloadReport = async () => {
    try {
      // Prepare rich data for PDF generation
      const pdfData = {
        assessmentType: 'CareerLaunch',
        userInfo: {
          name: userProfile.name,
          email: userProfile.email
        },
        overallScore: assessmentResults?.overallScore || 0,
        profile: `Based on your assessment, you demonstrate ${assessmentResults?.overallScore >= 80 ? 'excellent' : assessmentResults?.overallScore >= 60 ? 'strong' : 'developing'} readiness for career launch. This comprehensive evaluation covers key competencies required for professional success.`,
        dimensions: assessmentResults?.dimensions || [],
        strengths: [
          'Communication and interpersonal skills',
          'Problem-solving and analytical thinking', 
          'Adaptability and openness to learning',
          'Professional work ethic and reliability',
          'Technical competency in field of study'
        ],
        developmentAreas: [
          'Enhance leadership and management capabilities',
          'Develop advanced industry-specific skills',
          'Strengthen networking and relationship building',
          'Improve time management and prioritization',
          'Build confidence in public speaking and presentations'
        ],
        careerMatches: [
          { title: 'Data Analyst', match: 85, description: 'Strong analytical skills make you well-suited for data analysis roles' },
          { title: 'Project Coordinator', match: 78, description: 'Your organizational abilities align well with project management' },
          { title: 'Business Analyst', match: 72, description: 'Good fit for analyzing business processes and requirements' },
          { title: 'Marketing Specialist', match: 68, description: 'Creative thinking and communication skills suit marketing roles' },
          { title: 'Customer Success Manager', match: 65, description: 'People skills and problem-solving abilities match this role' }
        ],
        recommendations: [
          'Focus on building a strong professional network through industry events and LinkedIn',
          'Seek out internship or entry-level opportunities to gain practical experience',
          'Consider pursuing relevant certifications in your field of interest',
          'Develop a portfolio showcasing your skills and achievements',
          'Practice interviewing skills and prepare compelling examples of your work',
          'Research companies and roles that align with your career goals',
          'Consider finding a mentor in your desired industry',
          'Continue developing both technical and soft skills through online courses'
        ]
      };

      await generateHtmlReport(pdfData);
      
      toast({
        title: "Report Generated",
        description: "Comprehensive PDF report downloaded successfully!",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show consent agreement first
  if (gamePhase === 'consent') {
    return (
      <ConsentAgreement
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
        assessmentType="Career Launch Assessment"
        userType="applicant"
      />
    );
  }

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
              <PaymentProtection assessmentType="career-launch">
                <Button 
                  size="lg" 
                  onClick={() => setGamePhase('registration')}
                  className="text-lg px-8 py-6"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Your Career Discovery
                </Button>
              </PaymentProtection>
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
      <PaymentProtection assessmentType="career-launch">
        <CareerLaunchAssessment 
          onComplete={handleAssessmentComplete}
          userProfile={userProfile}
        />
      </PaymentProtection>
    );
  }

  // Results phase - Use unified AssessmentResults component
  if (gamePhase === 'results' && assessmentResults) {
    return (
      <CareerLaunchReportEnhanced 
        results={assessmentResults}
        userProfile={{
          name: userProfile.name,
          email: userProfile.email,
          assessmentDate: new Date().toISOString().split('T')[0],
          questionsAnswered: 145,
          timeSpent: "30 minutes", // Default time estimate
          reliabilityScore: assessmentResults.assessmentQuality?.qualityScore || 92
        }}
        enhancedAI={assessmentResults.enhancedAI}
        viewType="candidate"
      />
    );
  }

  return null;
};

export default CareerLaunch;