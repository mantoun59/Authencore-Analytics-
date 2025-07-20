import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Smartphone, Heart, Zap, Lightbulb, Globe, Users, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const GenZFutureReadinessDescription = () => {
  const dimensions = [
    {
      title: "Career Resilience",
      description: "Ability to adapt to changing career landscapes and challenges.",
      icon: Shield
    },
    {
      title: "Digital Adaptability", 
      description: "Flexibility and confidence in using evolving digital technologies.",
      icon: Smartphone
    },
    {
      title: "Emotional Intelligence",
      description: "Awareness, regulation, and application of emotions effectively.",
      icon: Heart
    },
    {
      title: "Learning Agility",
      description: "Speed and depth of learning new skills and knowledge areas.",
      icon: Zap
    },
    {
      title: "Entrepreneurial Mindset",
      description: "Innovative thinking, initiative, and opportunity orientation.",
      icon: Lightbulb
    },
    {
      title: "Cultural Competence",
      description: "Effectiveness in diverse social and cultural contexts.",
      icon: Globe
    },
    {
      title: "Leadership Potential",
      description: "Capacity to influence, motivate, and guide others.",
      icon: Users
    },
    {
      title: "Future Orientation",
      description: "Goal clarity, planning, and proactive future focus.",
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
              134 Questions | 8 Dimensions | $52.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Gen Z Future Readiness
          </h1>
          
          <div className="flex justify-center mb-8">
            <Button size="lg" className="px-8 py-6 text-lg">
              Start Assessment
            </Button>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Gen Z Future Readiness Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Gen Z Future Readiness assessment evaluates competencies, mindset, and adaptability for navigating a rapidly evolving world. Covering 8 dimensions, it empowers students and professionals with clarity to thrive in future careers and life pathways.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">8 Dimensions Covered in Gen Z Future Readiness</CardTitle>
            <p className="text-muted-foreground">Explore the key future readiness dimensions assessed.</p>
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
                  Your scores across all future readiness dimensions with practical recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance to thrive in the future world of work.
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

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Ready to Future-Proof Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Gen Z Future Readiness assessment today and unlock powerful insights for success.
            </p>
            <Button size="lg" className="px-12 py-6 text-lg">
              Start Now
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default GenZFutureReadinessDescription;