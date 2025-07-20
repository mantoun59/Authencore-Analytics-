import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Smartphone, Target, Heart, MessageSquare, Scale, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const GenZWorkplaceDescription = () => {
  const dimensions = [
    {
      title: "Digital-First Preferences",
      description: "Comfort and preference for digital communication and tools.",
      icon: Smartphone
    },
    {
      title: "Purpose-Driven Work", 
      description: "Alignment with meaningful and impactful work.",
      icon: Target
    },
    {
      title: "Workplace Values",
      description: "Core values that guide workplace decisions and priorities.",
      icon: Heart
    },
    {
      title: "Communication Style",
      description: "Preferred methods and styles of workplace communication.",
      icon: MessageSquare
    },
    {
      title: "Work-Life Balance",
      description: "Expectations and needs for balancing work and personal life.",
      icon: Scale
    },
    {
      title: "Career Expectations",
      description: "Views on career progression, development, and success.",
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
              45 Questions | Multiple Dimensions | $9.99
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Gen Z Workplace Assessment
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/genz-workplace">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Gen Z Workplace Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Gen Z Workplace Assessment evaluates workplace preferences, values, and career expectations specific to Gen Z professionals. Covering multiple dimensions with a digital-first approach, it empowers individuals and organizations to understand and optimize Gen Z workplace experiences for maximum engagement and success.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Gen Z Focus Features</CardTitle>
            <p className="text-muted-foreground">Specialized assessment for Gen Z workplace preferences and expectations.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <Smartphone className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Digital-First</h3>
                <p className="text-sm text-muted-foreground">Optimized for digital natives</p>
              </div>
              <div className="text-center p-4">
                <Target className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Purpose-Driven</h3>
                <p className="text-sm text-muted-foreground">Focus on meaningful work</p>
              </div>
              <div className="text-center p-4">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Career-Focused</h3>
                <p className="text-sm text-muted-foreground">Modern career expectations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Key Areas Assessed</CardTitle>
            <p className="text-muted-foreground">Explore the workplace dimensions important to Gen Z professionals.</p>
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
            <p className="text-muted-foreground">Upon completion, you will receive detailed insights:</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Workplace Profile Report</h3>
                <p className="text-muted-foreground">
                  Comprehensive analysis of your workplace preferences, values, and ideal work environment.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Development Plan</h3>
                <p className="text-muted-foreground">
                  Personalized 90-day development plan with actionable insights for career growth and workplace success.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Reports are generated instantly upon assessment completion with detailed insights and recommendations.
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
                  <h3 className="font-semibold text-lg mb-2">📊 Workplace Profile Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive Gen Z workplace analysis with career preferences and development recommendations.
                  </p>
                  <span className="text-primary text-sm font-medium">Sample report available on request</span>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🏢 Development Plan</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    90-day actionable plan for career growth and workplace success tailored for Gen Z professionals.
                  </p>
                  <span className="text-sm text-muted-foreground">Available with assessment purchase</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">🌍 Multilingual Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Available in 12+ languages including Spanish, French, German, Chinese, Japanese, and more.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">📱 Digital-First Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Specialized analysis for digital natives and modern workplace preferences.
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
              Ready to Discover Your Workplace Style?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Gen Z Workplace Assessment today and unlock insights for workplace success.
            </p>
            <Link to="/genz-workplace">
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

export default GenZWorkplaceDescription;