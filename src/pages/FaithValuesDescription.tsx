import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Brain, Scale, User, Heart, Users, Globe, CheckSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const FaithValuesDescription = () => {
  const dimensions = [
    {
      title: "Spiritual Cognition",
      description: "Understanding and internalisation of spiritual concepts.",
      icon: Brain
    },
    {
      title: "Moral Reasoning", 
      description: "Decision-making based on ethical and faith principles.",
      icon: Scale
    },
    {
      title: "Behaviour Consistency",
      description: "Alignment of actions with professed values.",
      icon: User
    },
    {
      title: "Emotional Integrity",
      description: "Emotions grounded in faith and values.",
      icon: Heart
    },
    {
      title: "Relational Ethics",
      description: "Values reflected in interpersonal relationships.",
      icon: Users
    },
    {
      title: "Cultural Faith Expression",
      description: "Manifestation of faith values in cultural contexts.",
      icon: Globe
    },
    {
      title: "Life Congruence",
      description: "Overall harmony between beliefs and daily living.",
      icon: CheckSquare
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
              147 Questions | 7 Dimensions | $49.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            FVAI Faith & Values Alignment Index
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/faith-values">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About FVAI Faith & Values Alignment Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Faith & Values Alignment Index (FVAI) is a deeply reflective assessment designed to help individuals understand how their daily thoughts, decisions, and behaviours align with their core faith-based values. Covering 7 key dimensions, FVAI empowers personal growth, spiritual coaching, and faith-based leadership development by providing clarity, confidence, and purpose-driven insights.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">7 Dimensions Covered in FVAI</CardTitle>
            <p className="text-muted-foreground">Explore the multidimensional structure of your faith and values alignment.</p>
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
                  Personal scores across all dimensions with interpretation and growth suggestions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score for validity, detailed coaching insights, and tailored guidance for leadership, counselling, or mentoring contexts.
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
              Ready to Explore Your Alignment?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Begin your FVAI assessment today and receive instant, actionable insights.
            </p>
            <Link to="/faith-values">
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

export default FaithValuesDescription;