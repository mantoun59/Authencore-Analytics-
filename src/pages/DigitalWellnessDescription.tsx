import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Smartphone, MessageSquare, Brain, Shield, Heart, Scale } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { AssessmentLogo } from '@/components/AssessmentLogo';

const DigitalWellnessDescription = () => {
  const dimensions = [
    {
      title: "Device Dependency",
      description: "Level of reliance and compulsion towards digital devices.",
      icon: Smartphone
    },
    {
      title: "Online Communication Health", 
      description: "Quality and balance of digital social interactions.",
      icon: MessageSquare
    },
    {
      title: "Information Processing Habits",
      description: "How you consume, filter, and process online information.",
      icon: Brain
    },
    {
      title: "Digital Boundaries",
      description: "Ability to set limits and manage digital use effectively.",
      icon: Shield
    },
    {
      title: "Emotional Impact",
      description: "Effects of digital activities on mood and wellbeing.",
      icon: Heart
    },
    {
      title: "Lifestyle Integration",
      description: "Harmonizing digital use with offline goals and values.",
      icon: Scale
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
              60 Questions | 6 Dimensions | $12.99
            </Badge>
          </div>
          
          <div className="flex justify-center mb-8">
            <AssessmentLogo 
              assessmentId="digital-wellness"
              title="Digital Wellness Quotient"
              size="2xl"
              fallbackIcon="Smartphone"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Digital Wellness Quotient
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/digital-wellness">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Digital Wellness Quotient Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground leading-relaxed">
              The Digital Wellness Quotient assessment helps you understand your relationship with digital technology and its impact on your mental health, productivity, and overall life balance. Covering 6 comprehensive dimensions, it empowers you to build healthy digital habits, improve focus, and enhance wellbeing in an increasingly connected world.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">6 Comprehensive Dimensions</CardTitle>
            <p className="text-muted-foreground">Understand the key areas assessed for your digital wellbeing.</p>
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
                  Insights into your digital habits, wellbeing scores, and practical recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance for building healthier digital habits.
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
                  <h3 className="font-semibold text-lg mb-2">📊 Individual Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive digital wellness analysis with habit tracking and optimization recommendations.
                  </p>
                  <Link to="/sample-reports?assessment=digital-wellness" className="text-primary hover:underline text-sm font-medium">
                    View Sample Digital Wellness Report →
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🏢 Coaching Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Advanced insights for building healthier digital habits and improving work-life balance.
                  </p>
                  <span className="text-sm text-muted-foreground">Available with assessment purchase</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">📱 Digital Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Personalized strategies for optimizing technology use and digital well-being.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">📱 Digital Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Practical guidance for healthier digital habits and productivity.
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
              Ready to Improve Your Digital Wellbeing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Digital Wellness Quotient assessment today and take control of your tech-life balance.
            </p>
            <Link to="/digital-wellness">
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

export default DigitalWellnessDescription;