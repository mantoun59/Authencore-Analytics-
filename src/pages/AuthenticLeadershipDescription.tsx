import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Target, Brain, Heart, Lightbulb, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { AssessmentLogo } from '@/components/AssessmentLogo';

const AuthenticLeadershipDescription = () => {
  const dimensions = [
    {
      title: "Self-Awareness",
      description: "Understanding of one's strengths, weaknesses, and core values.",
      icon: Brain
    },
    {
      title: "Relational Transparency", 
      description: "Openness and honesty in leader-follower relationships.",
      icon: Heart
    },
    {
      title: "Balanced Processing",
      description: "Objective evaluation of information before decision-making.",
      icon: Target
    },
    {
      title: "Internalised Moral Perspective",
      description: "Guiding actions with strong internal moral standards.",
      icon: Star
    },
    {
      title: "Emotional Intelligence",
      description: "Awareness and regulation of emotions in leadership contexts.",
      icon: Lightbulb
    },
    {
      title: "Leadership Impact",
      description: "Influence and effectiveness in inspiring and guiding others.",
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
              120 Questions | 8 Dimensions | $34.99
            </Badge>
          </div>
          
          <div className="flex justify-center mb-8">
            <AssessmentLogo 
              assessmentId="leadership-assessment"
              title="Authentic Leadership Assessment"
              size="2xl"
              fallbackIcon="Users"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Authentic Leadership Assessment
          </h1>
          
          <div className="flex justify-center mb-8">
            <Link to="/leadership-assessment">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">About Authentic Leadership Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground leading-relaxed">
              The Authentic Leadership Assessment evaluates your leadership style, integrity, and effectiveness in inspiring and guiding others. Covering 6 dimensions, it empowers leaders and organisations to nurture authentic, ethical, and high-impact leadership.
            </p>
          </CardContent>
        </Card>

        {/* Dimensions Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">8 Dimensions Covered in Authentic Leadership</CardTitle>
            <p className="text-muted-foreground">Explore the core dimensions of authentic leadership assessed.</p>
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
                  Insights into your authentic leadership dimensions with actionable recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg border bg-card">
              <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Coaching Report</h3>
                <p className="text-muted-foreground">
                  Includes your distortion scale score, coaching insights, and personalised guidance to strengthen authentic leadership skills.
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
                  <h3 className="font-semibold text-lg mb-2">📊 Leadership Profile</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive leadership assessment with authentic leadership dimensions and development roadmap.
                  </p>
                  <Link to="/sample-reports?assessment=leadership" className="text-primary hover:underline text-sm font-medium">
                    View Sample Leadership Report →
                  </Link>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">🏢 360-Degree Report</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Advanced insights for organizational leadership development and team effectiveness.
                  </p>
                  <span className="text-sm text-muted-foreground">Available with assessment purchase</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">👥 Leadership Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Evidence-based strategies for developing authentic leadership capabilities and team effectiveness.
                  </p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-2">👥 Leadership Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Evidence-based strategies for developing authentic leadership capabilities.
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
              Ready to Strengthen Your Leadership?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your Authentic Leadership Assessment today and unlock powerful insights to lead with integrity.
            </p>
            <Link to="/leadership-assessment">
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

export default AuthenticLeadershipDescription;