import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Briefcase, Battery, Shield, Users, Scale, Brain, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { AssessmentLogo } from '@/components/AssessmentLogo';

const BurnoutPreventionDescription = () => {
  const dimensions = [
    {
      title: "Workload Management",
      description: "Ability to prioritise, delegate, and manage tasks effectively.",
      icon: Briefcase
    },
    {
      title: "Emotional Exhaustion", 
      description: "Current levels of emotional depletion and fatigue.",
      icon: Battery
    },
    {
      title: "Personal Efficacy",
      description: "Belief in your capability to handle job demands.",
      icon: Shield
    },
    {
      title: "Support Systems",
      description: "Strength and accessibility of social and professional support.",
      icon: Users
    },
    {
      title: "Work-Life Integration",
      description: "Balance and harmony between personal and professional life.",
      icon: Scale
    },
    {
      title: "Coping Strategies",
      description: "Healthy responses to stress and adversity.",
      icon: Brain
    },
    {
      title: "Wellbeing Practices",
      description: "Routines promoting physical, mental, and emotional wellbeing.",
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Badge variant="secondary" className="px-4 py-2 text-lg font-semibold">
              102 Questions | 7 Dimensions | $39.99
            </Badge>
          </div>
          
          <div className="flex justify-center mb-8">
            <AssessmentLogo 
              assessmentId="faith-values"
              title="Burnout Prevention Index"
              size="2xl"
              fallbackIcon="Shield"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Burnout Prevention Index
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/stress-resilience">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Burnout Prevention Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground leading-relaxed">
              The Burnout Prevention Index assessment evaluates your current stress levels, risk factors, and resilience capabilities to prevent burnout proactively. Covering 7 dimensions, it empowers you to maintain high performance with optimal health and wellbeing.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">7 Dimensions Covered in Burnout Prevention</CardTitle>
            <p className="text-muted-foreground">Explore the dimensions assessed to prevent burnout proactively.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dimensions.map((dimension, index) => {
                const IconComponent = dimension.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{dimension.title}</h3>
                      <p className="text-muted-foreground">{dimension.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reports Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Reports You Receive</CardTitle>
            <p className="text-muted-foreground">Upon completion, you will receive two detailed reports:</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Individual Report</h3>
                <p className="text-muted-foreground">
                  Insights into your burnout risk levels and resilience dimensions with practical recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance to prevent burnout and maintain wellbeing.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Both reports are delivered instantly in PDF format post payment and assessment completion.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sample Reports Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Sample Reports</h2>
            <p className="text-muted-foreground">See what you'll receive with your assessment</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">📊 Candidate Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive burnout risk assessment with personalized prevention strategies and wellness recommendations.
                  </p>
                  <Link to="/sample-reports?assessment=stress-resilience" className="text-primary hover:underline text-sm font-medium">
                    View Sample Burnout Prevention Report →
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🏢 Employer Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Organizational insights for supporting employee wellbeing and preventing workplace burnout.
                  </p>
                  <span className="text-sm text-muted-foreground">Available with assessment purchase</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">⚡ Instant Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive actionable insights and prevention strategies immediately upon completion.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">🛡️ Proactive Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Build resilience before burnout strikes with personalized prevention strategies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Ready to Prevent Burnout Effectively?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Burnout Prevention Index assessment today and protect your health and performance.
            </p>
            <Link to="/stress-resilience">
              <Button size="lg" className="px-12 py-6 text-lg">
                Start Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default BurnoutPreventionDescription;