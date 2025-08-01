import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Brain, Heart, Users, Target, CheckCircle2, AlertTriangle, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PaymentButton } from "@/components/PaymentButton";
import { assessmentsData } from "@/data/assessmentsData";

const BurnoutPreventionDescription = () => {
  const assessment = assessmentsData.find(a => a.id === 'stress-resilience') || assessmentsData[2];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800">
            <Shield className="w-4 h-4 mr-2" />
            Burnout Prevention
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            {assessment.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {assessment.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <PaymentButton
              assessmentType="stress-resilience"
              price={assessment.price}
              className="text-lg px-8 py-3"
            />
            <div className="flex gap-4 justify-center">
              <Link to="/sample-reports?assessment=burnout-prevention">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  View Sample Report
                </Button>
              </Link>
              <Button size="lg" className="text-lg px-8 py-3">
                Download Sample PDF
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{assessment.duration}</div>
                <div className="text-sm text-muted-foreground">Assessment Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Brain className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{assessment.questions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-muted-foreground">Dimensions</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What It Measures */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What This Assessment Measures</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-green-500" />
                Risk Factors
              </h3>
              <ul className="space-y-3">
                {assessment.whatItMeasures.slice(0, 4).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Protective Factors
              </h3>
              <ul className="space-y-3">
                {assessment.whatItMeasures.slice(4).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">7 Key Dimensions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessment.dimensions.map((dimension, index) => {
              const icons = [Users, Heart, Zap, Shield, Target, Brain, TrendingUp];
              const IconComponent = icons[index] || Shield;
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-6 w-6 text-green-500" />
                      {dimension.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {dimension.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Assessment Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessment.features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <p className="font-medium">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Prevent Burnout?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take the comprehensive assessment and get personalized insights to maintain your wellbeing and performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PaymentButton
              assessmentType="stress-resilience"
              price={assessment.price}
              className="text-lg px-8 py-3"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BurnoutPreventionDescription;