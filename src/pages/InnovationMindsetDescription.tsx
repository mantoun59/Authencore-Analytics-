import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Search, Lightbulb, FlaskConical, TrendingUp, Users, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const InnovationMindsetDescription = () => {
  const dimensions = [
    {
      title: "Curiosity",
      description: "Desire to learn, question, and explore possibilities.",
      icon: Search
    },
    {
      title: "Idea Generation", 
      description: "Ability to create new and useful concepts or solutions.",
      icon: Lightbulb
    },
    {
      title: "Experimentation",
      description: "Willingness to test, iterate, and learn from failures.",
      icon: FlaskConical
    },
    {
      title: "Risk Tolerance",
      description: "Comfort with uncertainty and calculated risk-taking.",
      icon: TrendingUp
    },
    {
      title: "Adaptability",
      description: "Flexibility to change approaches based on context and feedback.",
      icon: Users
    },
    {
      title: "Execution Focus",
      description: "Translating ideas into actionable outcomes efficiently.",
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
              108 Questions | 6 Dimensions | $19.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Innovation Mindset Assessment
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
            <CardTitle className="text-2xl text-primary">About Innovation Mindset Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Innovation Mindset Assessment evaluates your ability to think creatively, take strategic risks, and drive innovation. Covering 6 dimensions, it empowers entrepreneurs, leaders, and teams to build a growth-oriented, adaptive mindset for success.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">6 Dimensions Covered in Innovation Mindset</CardTitle>
            <p className="text-muted-foreground">Explore the dimensions assessed to build your innovation capacity.</p>
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
                  Insights into your innovation mindset dimensions with actionable recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance to build innovation capacity.
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
              Ready to Unlock Your Innovation Potential?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Innovation Mindset Assessment today and discover insights to drive creativity and growth.
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

export default InnovationMindsetDescription;