import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Brain, Target, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { AssessmentLogo } from '@/components/AssessmentLogo';

const CulturalIntelligenceDescription = () => {
  const dimensions = [
    {
      title: "CQ Drive",
      description: "Interest, confidence, and drive to adapt to multicultural settings.",
      icon: Target
    },
    {
      title: "CQ Knowledge", 
      description: "Understanding of cultural systems, values, and how culture shapes thinking.",
      icon: Brain
    },
    {
      title: "CQ Strategy",
      description: "Planning and awareness of cultural cues during cross-cultural interactions.",
      icon: Globe
    },
    {
      title: "CQ Action",
      description: "Capability to adapt behavior when a cross-cultural situation requires it.",
      icon: Users
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
              60 Questions | 4 CQ Dimensions | $19.99
            </Badge>
          </div>
          
          <div className="flex justify-center mb-8">
            <AssessmentLogo 
              assessmentId="cultural-intelligence"
              title="Cultural Intelligence Assessment"
              size="2xl"
              fallbackIcon="Globe"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Cultural Intelligence Assessment
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Evaluate your ability to function effectively in culturally diverse environments through 
            real-world business scenarios and cross-cultural challenges.
          </p>
          
          <Link to="/cultural-intelligence">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
              Start Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Globe className="h-8 w-8 text-teal-500" />
              About Cultural Intelligence (CQ)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              The Cultural Intelligence Assessment measures your capability to function effectively 
              in culturally diverse settings. Based on the globally recognized Cultural Intelligence 
              framework, this assessment evaluates your cross-cultural competency through practical 
              business scenarios.
            </p>
            <p>
              Through email adaptation challenges, meeting scenarios, and global business situations, 
              you'll demonstrate your ability to navigate cultural differences, adapt your communication 
              style, and build effective relationships across cultures.
            </p>
          </CardContent>
        </Card>

        {/* Four CQ Dimensions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">The Four CQ Dimensions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dimensions.map((dimension, index) => {
              const IconComponent = dimension.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <IconComponent className="h-6 w-6 text-teal-500" />
                      {dimension.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dimension.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* What You'll Receive */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Individual Assessment Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Comprehensive CQ score across all four dimensions</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Detailed analysis of your cultural adaptation strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Strengths and development areas in cross-cultural contexts</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Personalized recommendations for CQ development</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Global Business Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>International team leadership insights</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Cross-cultural communication strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Global business effectiveness profile</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <span>Cultural adaptation scenarios and solutions</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Reports */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sample Reports</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Explore sample reports to see the depth and quality of insights you'll receive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/sample-reports?assessment=cultural-intelligence" className="text-primary hover:underline text-sm font-medium">
                View Sample Cultural Intelligence Report →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Assess Your Cultural Intelligence?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover your cross-cultural competency and unlock your global potential.
          </p>
          <Link to="/cultural-intelligence">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
              Begin Cultural Intelligence Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CulturalIntelligenceDescription;