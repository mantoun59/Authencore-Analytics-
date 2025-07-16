import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Heart, Users, Zap, Target, CheckCircle2, ArrowRight } from "lucide-react";
import AssessmentQuestions from "@/components/AssessmentQuestions";
import AssessmentResults from "@/components/AssessmentResults";

const Assessment = () => {
  const [currentPhase, setCurrentPhase] = useState<'overview' | 'assessment' | 'results'>('overview');
  const [assessmentData, setAssessmentData] = useState(null);

  const dimensions = [
    {
      title: "Emotional Resilience",
      description: "Emotional regulation under pressure",
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "Cognitive Flexibility", 
      description: "Problem-solving under stress",
      icon: Brain,
      color: "text-blue-500"
    },
    {
      title: "Physical Stress Response",
      description: "Energy management and recovery",
      icon: Zap,
      color: "text-green-500"
    },
    {
      title: "Social Support Utilization",
      description: "Help-seeking and network building",
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "Change Adaptability",
      description: "Comfort with ambiguity and innovation",
      icon: Target,
      color: "text-orange-500"
    },
    {
      title: "Performance Under Pressure",
      description: "Deadline management and crisis leadership",
      icon: Clock,
      color: "text-yellow-500"
    }
  ];

  const phases = [
    {
      phase: "Baseline Establishment",
      duration: "10 minutes",
      description: "Calm state questions and stress history"
    },
    {
      phase: "Progressive Stress Loading", 
      duration: "20 minutes",
      description: "Increasing pressure scenarios"
    },
    {
      phase: "Recovery Assessment",
      duration: "10 minutes", 
      description: "Post-stress evaluation"
    },
    {
      phase: "Adaptability Challenges",
      duration: "15 minutes",
      description: "Unexpected changes and pivots"
    }
  ];

  const handleStartAssessment = () => {
    setCurrentPhase('assessment');
  };

  const handleAssessmentComplete = (data: any) => {
    setAssessmentData(data);
    setCurrentPhase('results');
  };

  if (currentPhase === 'assessment') {
    return <AssessmentQuestions onComplete={handleAssessmentComplete} />;
  }

  if (currentPhase === 'results') {
    return <AssessmentResults data={assessmentData} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 Assessment Module
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Stress Resilience & Adaptability Assessment
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Measuring capacity to thrive under pressure and navigate change through comprehensive, 
            multi-modal evaluation with biometric simulation and real-world scenarios.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="outline" className="text-sm">60 Multi-Modal Questions</Badge>
            <Badge variant="outline" className="text-sm">Biometric Response Simulation</Badge>
            <Badge variant="outline" className="text-sm">Progressive Stress Loading</Badge>
            <Badge variant="outline" className="text-sm">Burnout Risk Prediction</Badge>
          </div>

          <Button 
            size="lg" 
            onClick={handleStartAssessment}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Assessment Overview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Assessment Overview</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This comprehensive assessment evaluates your ability to maintain performance under pressure, 
              recover from setbacks, and adapt to changing circumstances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {dimensions.map((dimension, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <dimension.icon className={`h-6 w-6 ${dimension.color}`} />
                    <CardTitle className="text-lg">{dimension.title}</CardTitle>
                  </div>
                  <CardDescription>{dimension.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">10 questions</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Assessment Phases */}
          <div className="bg-card rounded-2xl p-8 shadow-elegant">
            <h3 className="text-2xl font-bold text-center mb-8">Assessment Methodology</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {phases.map((phase, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{phase.phase}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                  <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unique Assessment Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced methodology combines traditional assessment with innovative stress simulation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  Biometric Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Measures response time, decision pause, error rate, and stress patterns
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Click speed analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Hesitation tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Panic behavior detection
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-500" />
                  Real-World Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Industry-specific challenges that mirror actual workplace stressors
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Product launch crisis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Merger announcement
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Startup scaling challenges
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-purple-500" />
                  Adaptive Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Progressive stress loading adjusts to individual capacity
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Graduated exposure
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Safe failure environment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Immediate feedback
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resilience Profiles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Resilience Profiles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive scoring system categorizes resilience levels for targeted development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Titanium", range: "90-100", description: "Thrives under extreme pressure", color: "bg-slate-600" },
              { name: "Steel", range: "80-89", description: "Highly resilient, occasional support needed", color: "bg-gray-500" },
              { name: "Iron", range: "70-79", description: "Good resilience, benefits from resources", color: "bg-zinc-600" },
              { name: "Copper", range: "60-69", description: "Moderate resilience, needs development", color: "bg-orange-600" },
              { name: "Bronze", range: "50-59", description: "Developing resilience, requires support", color: "bg-amber-600" },
              { name: "Clay", range: "Below 50", description: "High support and development needed", color: "bg-red-600" }
            ].map((profile, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${profile.color}`}></div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <Badge variant="outline">{profile.range}</Badge>
                  </div>
                  <CardDescription>{profile.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Assess Your Resilience?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take the comprehensive assessment and receive personalized insights for building stronger resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleStartAssessment}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More About Methodology
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Assessment;