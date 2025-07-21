import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Brain, Briefcase, User, Zap, BookOpen, Users, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const CareerLaunchDescription = () => {
  const dimensions = [
    {
      title: "Interests",
      description: "Areas and fields that naturally attract and motivate you.",
      icon: Heart
    },
    {
      title: "Aptitudes", 
      description: "Your cognitive strengths and skill potentials.",
      icon: Brain
    },
    {
      title: "Work Values",
      description: "Values you prioritise in your work environment and career decisions.",
      icon: Briefcase
    },
    {
      title: "Personality Factors",
      description: "Key personality traits influencing your career fit.",
      icon: User
    },
    {
      title: "Emotional Motivators",
      description: "Emotions and drives shaping your goals and efforts.",
      icon: Zap
    },
    {
      title: "Learning Styles",
      description: "Preferred ways you acquire and process new knowledge.",
      icon: BookOpen
    },
    {
      title: "Leadership Tendencies",
      description: "Your natural approaches to influence and guide others.",
      icon: Users
    },
    {
      title: "Growth Areas",
      description: "Opportunities for development to enhance career success.",
      icon: TrendingUp
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
              144 Questions | 8 Dimensions | $9.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            CareerLaunch Student Career Guidance
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/career-launch">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About CareerLaunch Student Career Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground leading-relaxed">
              The CareerLaunch Student Career Guidance assessment helps students discover their strengths, preferences, and potential career paths with clarity and confidence. Covering 8 dimensions, it empowers students and graduates to make informed academic and career decisions aligned with their unique talents and goals.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">8 Dimensions Covered in CareerLaunch</CardTitle>
            <p className="text-muted-foreground">Discover the core dimensions assessed to guide your career choices.</p>
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
                  Insights into your interests, aptitudes, personality, and career fit with recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, career counselling insights, and actionable guidance for your academic and career journey.
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
                    Detailed personal insights including RIASEC profile, career recommendations, and development action plans.
                  </p>
                  <Link to="/sample-career-launch-report" className="text-primary hover:underline text-sm font-medium">
                    View Sample Candidate Report →
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🏢 Employer Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive analysis for hiring decisions, including personality fit and team dynamics.
                  </p>
                  <span className="text-sm text-muted-foreground">Available with assessment purchase</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Instant Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive your comprehensive PDF reports immediately upon completion.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">🚀 Career Breakthrough</h4>
                  <p className="text-sm text-muted-foreground">
                    Unlock your potential with personalized career pathways and actionable insights.
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
              Ready to Launch Your Career Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Begin your CareerLaunch assessment today and unlock powerful insights for your future.
            </p>
            <Link to="/career-launch">
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

export default CareerLaunchDescription;