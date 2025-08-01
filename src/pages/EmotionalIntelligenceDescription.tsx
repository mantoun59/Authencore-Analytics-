import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, Settings, Users, Handshake } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const EmotionalIntelligenceDescription = () => {
  const dimensions = [
    {
      title: "Self-Awareness",
      description: "Recognising your own emotions and their impact.",
      icon: Eye
    },
    {
      title: "Self-Management", 
      description: "Managing emotions, impulses, and adapting to change.",
      icon: Settings
    },
    {
      title: "Social Awareness",
      description: "Understanding others' emotions and empathising effectively.",
      icon: Users
    },
    {
      title: "Relationship Management",
      description: "Building and maintaining healthy relationships with influence and clarity.",
      icon: Handshake
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
              60 Questions | 4 Dimensions | $24.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Emotional Intelligence Profiler
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/emotional-intelligence">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Emotional Intelligence Profiler Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground leading-relaxed">
              The Emotional Intelligence Profiler assessment evaluates your capacity to perceive, understand, manage, and use emotions effectively. Covering 4 dimensions, it empowers you to build emotional strength, resilience, and social intelligence for personal and professional success.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">4 Dimensions Covered in Emotional Intelligence</CardTitle>
            <p className="text-muted-foreground">Explore the dimensions assessed to strengthen your emotional intelligence.</p>
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
                  Insights into your emotional intelligence dimensions with practical recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance to enhance emotional and social intelligence.
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
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📊 View Sample Report</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Preview comprehensive EQ profile with practical recommendations for development.
                </p>
                <Link to="/sample-reports?assessment=emotional-intelligence">
                  <Button variant="outline" className="w-full">
                    View Sample Report
                  </Button>
                </Link>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📥 Download Sample</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Download a sample PDF to see the complete report format and insights.
                </p>
                <Button className="w-full">
                  Download Sample PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Ready to Grow Your Emotional Intelligence?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Emotional Intelligence Profiler assessment today and unlock actionable insights.
            </p>
            <Link to="/emotional-intelligence">
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

export default EmotionalIntelligenceDescription;