import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Heart, Users, Zap, Target, CheckCircle2, ArrowRight, Rocket, Shield, Lightbulb, MessageSquare, Globe, BarChart3, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { assessmentsData } from "@/data/assessmentsData";
import authencoreLogo from "@/assets/authencore-analytics-logo.png";

const Assessment = () => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return Rocket;
      case 'Brain': return Brain;
      case 'Shield': return Shield;
      case 'Globe': return Globe;
      case 'MessageSquare': return MessageSquare;
      case 'Heart': return Heart;
      case 'Lightbulb': return Lightbulb;
      case 'Zap': return Zap;
      case 'Monitor': return Monitor;
      case 'Users': return Users;
      default: return Target;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { icon: string, badge: string, button: string } } = {
      blue: {
        icon: 'text-blue-500',
        badge: 'bg-blue-100 text-blue-800',
        button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      },
      purple: {
        icon: 'text-purple-500',
        badge: 'bg-purple-100 text-purple-800',
        button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
      },
      green: {
        icon: 'text-green-500',
        badge: 'bg-green-100 text-green-800',
        button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
      },
      teal: {
        icon: 'text-teal-500',
        badge: 'bg-teal-100 text-teal-800',
        button: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
      },
      indigo: {
        icon: 'text-indigo-500',
        badge: 'bg-indigo-100 text-indigo-800',
        button: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
      },
      rose: {
        icon: 'text-rose-500',
        badge: 'bg-rose-100 text-rose-800',
        button: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
      },
      amber: {
        icon: 'text-amber-500',
        badge: 'bg-amber-100 text-amber-800',
        button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
      },
      violet: {
        icon: 'text-violet-500',
        badge: 'bg-violet-100 text-violet-800',
        button: 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700'
      },
      cyan: {
        icon: 'text-cyan-500',
        badge: 'bg-cyan-100 text-cyan-800',
        button: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
      },
      emerald: {
        icon: 'text-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
        button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Display the new logo prominently */}
          <div className="mb-8">
            <img 
              src={authencoreLogo} 
              alt="Authencore Analytics - Comprehensive Cutting-Edge Assessment Tools & Rich Reports" 
              className="mx-auto h-32 w-auto"
            />
          </div>
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 Assessment Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Professional Assessment Suite
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose from our comprehensive range of {assessmentsData.length} professional assessments designed to evaluate skills, 
            personality, career readiness, and workplace performance.
          </p>
          <Link to="/sample-reports">
            <Button size="lg" className="mb-8 flex items-center gap-2 mx-auto">
              <BarChart3 className="h-5 w-5" />
              View Sample Reports
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Assessment Options */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            
            {assessmentsData.map((assessment) => {
              const IconComponent = getIconComponent(assessment.icon);
              const colorClasses = getColorClasses(assessment.color);
              
              return (
                <Card key={assessment.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className={`h-8 w-8 ${colorClasses.icon}`} />
                      <div>
                        <CardTitle className="text-xl">{assessment.title}</CardTitle>
                        <Badge className="mt-1" variant="secondary">{assessment.badges[0]}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {assessment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-primary">{assessment.price}</span>
                      <Badge className={colorClasses.badge}>
                        {assessment.badges[1] || assessment.badges[0]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{assessment.questions} Questions</Badge>
                      <Badge variant="outline">{assessment.duration}</Badge>
                      {assessment.badges.slice(1, 3).map((badge, index) => (
                        <Badge key={index} variant="outline">{badge}</Badge>
                      ))}
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {assessment.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex-grow"></div>
                    <Link to={assessment.route}>
                      <Button className={`w-full ${colorClasses.button}`}>
                        Start {assessment.title} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}

          </div>
        </div>
      </section>

      {/* Assessment Comparison */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose the Right Assessment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each assessment serves different purposes and provides unique insights for career development, hiring, and personal growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  For Students & Early Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  CareerLaunch is perfect for exploring career options and building foundational skills
                </p>
                <Badge className="bg-blue-100 text-blue-800">Recommended: CareerLaunch</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  For Hiring & Team Building
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  CAIR+ provides comprehensive personality insights for recruitment and team dynamics
                </p>
                <Badge className="bg-purple-100 text-purple-800">Recommended: CAIR+</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  For High-Stress Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Stress Resilience assessment evaluates performance under pressure and burnout risk
                </p>
                <Badge className="bg-green-100 text-green-800">Recommended: Stress Resilience</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  For Communication Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Communication Styles assessment decodes how you connect, influence, and collaborate
                </p>
                <Badge className="bg-indigo-100 text-indigo-800">Recommended: Communication</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Assessment;