import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Users, Target, Shield, TrendingUp, CheckCircle, ArrowRight, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CAIRPersonalityDescription = () => {
  const dimensions = [
    {
      icon: Target,
      title: "Conscientiousness",
      description: "Organization, reliability, and goal-oriented behavior in professional settings.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Agreeableness", 
      description: "Cooperation, trust, and interpersonal harmony in team environments.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Brain,
      title: "Intellectual Curiosity",
      description: "Creativity, adaptability, and openness to new ideas and experiences.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Shield,
      title: "Resilience",
      description: "Stress tolerance, emotional stability, and adaptability under pressure.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const features = [
    "100 scientifically validated personality questions",
    "20 sophisticated validity detection mechanisms", 
    "Percentile scoring against normative populations",
    "Dual candidate and employer reporting formats",
    "Advanced distortion analysis and reliability metrics",
    "Comprehensive personality insights and behavioral predictions"
  ];

  const applications = [
    "Pre-employment screening and candidate evaluation",
    "Team composition and role assignment optimization", 
    "Leadership development and succession planning",
    "Professional coaching and personal development",
    "Organizational culture assessment and alignment",
    "Performance prediction and career guidance"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Brain className="h-4 w-4 mr-2" />
              Premium Personality Assessment
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CAIR+ Personality Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced psychological evaluation with cutting-edge validity detection technology. 
              Comprehensive personality insights that exceed industry standards for accuracy and reliability.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {applications.map((application, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{application}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Personality Dimensions */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Personality Dimensions</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                CAIR+ evaluates four fundamental personality dimensions that predict workplace success and team dynamics.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {dimensions.map((dimension, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${dimension.bgColor}`}>
                        <dimension.icon className={`h-6 w-6 ${dimension.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{dimension.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dimension.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Assessment Details */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>25-30 Minutes</CardTitle>
                <CardDescription>Comprehensive yet efficient assessment time</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>100 Questions</CardTitle>
                <CardDescription>Scientifically validated personality items</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Advanced Validity</CardTitle>
                <CardDescription>20 sophisticated detection mechanisms</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Personality Profile?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Discover deep insights into your personality patterns with our most advanced assessment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/cair-assessment">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                      Start CAIR+ Assessment
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/sample-reports?assessment=cair">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      View Sample Report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CAIRPersonalityDescription;