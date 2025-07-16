import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Heart, Users, Zap, Target, CheckCircle2, ArrowRight, Rocket, Shield, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const Assessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 Assessment Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Professional Assessment Suite
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose from our comprehensive range of professional assessments designed to evaluate skills, 
            personality, career readiness, and workplace performance.
          </p>
        </div>
      </section>

      {/* Assessment Options */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* CareerLaunch Assessment */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Rocket className="h-8 w-8 text-blue-500" />
                  <div>
                    <CardTitle className="text-xl">CareerLaunch</CardTitle>
                    <Badge className="mt-1">Gamified</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Gamified career readiness assessment with interactive challenges and real-time feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">5 Levels</Badge>
                  <Badge variant="outline">Career Matching</Badge>
                  <Badge variant="outline">Skills Challenges</Badge>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Interactive career exploration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Real-world scenarios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Achievement system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Future planning timeline
                  </li>
                </ul>
                <Link to="/career-launch">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Start CareerLaunch <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* CAIR+ Personality Assessment */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div>
                    <CardTitle className="text-xl">CAIR+ Personality</CardTitle>
                    <Badge className="mt-1" variant="secondary">Professional</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Comprehensive personality assessment with advanced validity detection and dual reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">100 Questions</Badge>
                  <Badge variant="outline">Validity Detection</Badge>
                  <Badge variant="outline">Percentile Scoring</Badge>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Conscientiousness evaluation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Agreeableness assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Innovation & creativity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Resilience measurement
                  </li>
                </ul>
                <Link to="/cair-assessment">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                    Start CAIR+ Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Stress Resilience Assessment */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div>
                    <CardTitle className="text-xl">Stress Resilience</CardTitle>
                    <Badge className="mt-1" variant="secondary">Research-Based</Badge>
                  </div>
                </div>
                <CardDescription className="text-base">
                  Advanced stress resilience and adaptability assessment with biometric simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">60 Questions</Badge>
                  <Badge variant="outline">Biometric Sim</Badge>
                  <Badge variant="outline">Progressive Loading</Badge>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Emotional resilience
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Cognitive flexibility
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Performance under pressure
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Burnout risk prediction
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600" disabled>
                  Coming Soon <Clock className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Assessment Comparison */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose the Right Assessment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each assessment serves different purposes and provides unique insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  For Students & Early Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  CareerLaunch is perfect for exploring career options and building foundational skills
                </p>
                <Badge className="bg-blue-100 text-blue-800">Recommended: CareerLaunch</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  For Hiring & Team Building
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  CAIR+ provides comprehensive personality insights for recruitment and team dynamics
                </p>
                <Badge className="bg-purple-100 text-purple-800">Recommended: CAIR+</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  For High-Stress Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Stress Resilience assessment evaluates performance under pressure and burnout risk
                </p>
                <Badge className="bg-green-100 text-green-800">Recommended: Stress Resilience</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Assessment;