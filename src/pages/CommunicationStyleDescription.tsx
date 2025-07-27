import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, Megaphone, Heart, Ear, Users, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { AssessmentLogo } from '@/components/AssessmentLogo';

const CommunicationStyleDescription = () => {
  const dimensions = [
    {
      title: "Clarity",
      description: "Ability to express thoughts and ideas clearly.",
      icon: Eye
    },
    {
      title: "Assertiveness", 
      description: "Confidence in expressing needs and opinions respectfully.",
      icon: Megaphone
    },
    {
      title: "Empathy",
      description: "Understanding and validating others' feelings and perspectives.",
      icon: Heart
    },
    {
      title: "Listening",
      description: "Active and attentive listening skills in conversations.",
      icon: Ear
    },
    {
      title: "Adaptability",
      description: "Flexibility to adjust communication based on context and audience.",
      icon: Users
    },
    {
      title: "Influence",
      description: "Effectiveness in persuading and inspiring others through communication.",
      icon: Target
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
              80 Questions | 6 Dimensions | $24.99
            </Badge>
          </div>
          
          <div className="flex justify-center mb-8">
            <AssessmentLogo 
              assessmentId="communication-styles"
              title="Communication Style Profiler"
              size="2xl"
              fallbackIcon="MessageSquare"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Communication Style Profiler
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/communication-assessment">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Communication Style Profiler Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground leading-relaxed">
              The Communication Style Profiler assessment evaluates your natural communication preferences, strengths, and growth areas. Covering 6 dimensions, it empowers you to communicate with clarity, empathy, and impact in personal and professional settings.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">6 Dimensions Covered in Communication Style</CardTitle>
            <p className="text-muted-foreground">Explore the communication dimensions assessed for impact and growth.</p>
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
                  Insights into your communication style dimensions with practical recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance to enhance communication effectiveness.
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
                    Communication DNA profile with style analysis, channel effectiveness, and professional development recommendations.
                  </p>
                  <Link to="/sample-reports?assessment=communication" className="text-primary hover:underline text-sm font-medium">
                    View Sample Communication Report →
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🏢 Employer Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Team compatibility insights, communication coaching recommendations, and collaboration strategies.
                  </p>
                  <span className="text-sm text-muted-foreground">Available with assessment purchase</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Interactive Simulations</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-world communication scenarios and linguistic pattern analysis for practical insights.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Interactive Simulations</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-world communication scenarios and linguistic pattern analysis.
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
              Ready to Enhance Your Communication?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Communication Style Profiler assessment today and unlock insights to communicate with impact.
            </p>
            <Link to="/communication-assessment">
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

export default CommunicationStyleDescription;