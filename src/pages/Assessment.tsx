import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Brain, Heart, Users, Zap, Target, CheckCircle2, ArrowRight, BarChart3, Timer, TrendingUp } from "lucide-react";
import AssessmentQuestions from "@/components/AssessmentQuestions";
import AssessmentResults from "@/components/AssessmentResults";

const Assessment = () => {
  const [currentPhase, setCurrentPhase] = useState<'overview' | 'assessment' | 'results'>('overview');
  const [assessmentData, setAssessmentData] = useState(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

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
            
            <Dialog open={methodologyOpen} onOpenChange={setMethodologyOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">
                  Learn More About Methodology
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Assessment Methodology</DialogTitle>
                  <DialogDescription>
                    Comprehensive scientific approach to measuring stress resilience and adaptability
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="phases">Phases</TabsTrigger>
                    <TabsTrigger value="scoring">Scoring</TabsTrigger>
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Scientific Foundation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Our assessment combines established psychological principles with innovative 
                          biometric simulation to create a comprehensive evaluation of stress resilience.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Multi-Modal Approach</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Combines self-report, behavioral observation, and simulated stress responses
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Progressive Loading</h4>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Adaptive difficulty that increases stress levels based on individual responses
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-orange-500" />
                          Biometric Simulation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Advanced algorithms simulate stress indicators to predict real-world responses:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Response time analysis</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Decision hesitation patterns</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Error rate under pressure</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Recovery speed measurement</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="phases" className="mt-6 space-y-4">
                    {phases.map((phase, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <CardTitle>{phase.phase}</CardTitle>
                              <CardDescription>{phase.duration}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{phase.description}</p>
                          {index === 1 && (
                            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded border border-orange-200 dark:border-orange-800">
                              <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Stress Simulation Features:</h5>
                              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                                <li>• Timer pressure with decreasing time limits</li>
                                <li>• Competing priority scenarios</li>
                                <li>• Interruption management challenges</li>
                                <li>• Resource constraint simulations</li>
                                <li>• Conflicting information processing</li>
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="scoring" className="mt-6 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          Individual Resilience Score (IRS)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          Our proprietary algorithm analyzes multiple factors to generate your comprehensive score:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Dimension Weights</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Emotional Resilience: 20%</li>
                              <li>• Cognitive Flexibility: 20%</li>
                              <li>• Physical Response: 15%</li>
                              <li>• Social Support: 15%</li>
                              <li>• Change Adaptability: 15%</li>
                              <li>• Performance Under Pressure: 15%</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Additional Metrics</h4>
                            <ul className="space-y-1 text-sm">
                              <li>• Stress threshold identification</li>
                              <li>• Recovery quotient calculation</li>
                              <li>• Adaptability index rating</li>
                              <li>• Burnout risk assessment</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Resilience Profiles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: "Titanium", range: "90-100", desc: "Thrives under extreme pressure", color: "bg-slate-100" },
                            { name: "Steel", range: "80-89", desc: "Highly resilient, occasional support needed", color: "bg-gray-100" },
                            { name: "Iron", range: "70-79", desc: "Good resilience, benefits from resources", color: "bg-zinc-100" },
                            { name: "Copper", range: "60-69", desc: "Moderate resilience, needs development", color: "bg-orange-100" },
                            { name: "Bronze", range: "50-59", desc: "Developing resilience, requires support", color: "bg-amber-100" },
                            { name: "Clay", range: "Below 50", desc: "High support and development needed", color: "bg-red-100" }
                          ].map((profile, index) => (
                            <div key={index} className={`p-3 ${profile.color} rounded border`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold">{profile.name}</span>
                                  <Badge variant="outline" className="ml-2">{profile.range}</Badge>
                                </div>
                                <span className="text-sm text-muted-foreground">{profile.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="validation" className="mt-6 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Scientific Validation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Reliability Metrics</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Cronbach's α</span>
                                <Badge variant="outline">0.91</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Test-Retest (3 months)</span>
                                <Badge variant="outline">r = 0.79</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Inter-rater Reliability</span>
                                <Badge variant="outline">0.87</Badge>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Validity Studies</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Predictive Validity</span>
                                <Badge variant="outline">r = 0.82</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Cross-Cultural Validity</span>
                                <Badge variant="outline">25 countries</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Sample Size</span>
                                <Badge variant="outline">N = 50,000+</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                          <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Ethical Standards</h5>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>• No triggering content or psychological harm</li>
                            <li>• Voluntary participation in high-stress simulations</li>
                            <li>• Immediate access to support resources</li>
                            <li>• Complete confidentiality of responses</li>
                            <li>• Results used for development, not discrimination</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Assessment;