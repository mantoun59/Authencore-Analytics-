import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, Users, Brain, Heart, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const CAIRCulturalDescription = () => {
  const dimensions = [
    {
      title: "Openness to Diversity",
      description: "Acceptance and appreciation of cultural differences.",
      icon: Globe
    },
    {
      title: "Relational Flexibility", 
      description: "Ability to build effective relationships across cultures.",
      icon: Users
    },
    {
      title: "Cognitive Agility",
      description: "Quick learning and adjustment in diverse contexts.",
      icon: Brain
    },
    {
      title: "Emotional Resilience",
      description: "Managing emotions effectively in unfamiliar environments.",
      icon: Heart
    },
    {
      title: "Behavioural Adaptability",
      description: "Adjusting behaviours to fit cultural expectations and norms.",
      icon: User
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
              125 Questions | 5 Dimensions | $29.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            CAIR+ Cultural Adaptability Assessment
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/cair-assessment">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About CAIR+ Cultural Adaptability Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Cultural Adaptability and Integration Readiness Plus (CAIR+) assessment evaluates how effectively you can adapt, integrate, and thrive in diverse cultural environments. Covering 5 key dimensions, CAIR+ empowers expatriates, international students, and global professionals to enhance their intercultural confidence and success.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">5 Dimensions Covered in CAIR+</CardTitle>
            <p className="text-muted-foreground">Understand the key cultural adaptability dimensions assessed.</p>
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
                  Your scores across all dimensions with interpretation and practical tips for cultural integration.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised action guidance.
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
              Ready to Enhance Your Cultural Adaptability?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your CAIR+ assessment today and unlock your intercultural potential.
            </p>
            <Link to="/cair-assessment">
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

export default CAIRCulturalDescription;