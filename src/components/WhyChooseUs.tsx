import { BarChart3, Shield, Target, Trophy, Users, Zap, Star, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import professionalMeeting from "@/assets/professional-meeting.jpg";

const WhyChooseUs = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: BarChart3,
      title: "AI-Enhanced Insights",
      description: "Advanced pattern recognition identifies trends in your responses to provide personalized professional development insights and growth recommendations."
    },
    {
      icon: Shield,
      title: "Secure & Private", 
      description: "Enterprise-grade security with encrypted data storage, secure authentication, and comprehensive privacy protections for all your development data."
    },
    {
      icon: Target,
      title: "Development-Focused",
      description: "Every insight is designed to support your professional growth journey with actionable recommendations and practical strategies for workplace success."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Platform Notice Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-400 p-4 mb-16 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Development Insights Platform:</strong> This platform provides exploratory insights for professional development and self-reflection. Results are suggestive starting points for growth, not definitive assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="mb-16">
          <img 
            src={professionalMeeting}
            alt="Professional business meeting and strategic planning"
            className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-elegant"
          />
        </div>

        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 Professional Development Platform
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Our Development Platform?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Explore your workplace preferences, communication tendencies, and career interests through structured self-discovery experiences designed to promote professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Professional Features */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Professional Development Exploration
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Career Interest Exploration</h4>
                    <p className="text-sm text-muted-foreground">Discover career paths that align with your interests, values, and workplace preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Communication Pattern Insights</h4>
                    <p className="text-sm text-muted-foreground">Understand your communication style and learn to adapt for better workplace collaboration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Leadership Approach Discovery</h4>
                    <p className="text-sm text-muted-foreground">Explore your natural leadership tendencies and different approaches for various situations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Workplace Wellness Insights</h4>
                    <p className="text-sm text-muted-foreground">Build awareness of stress patterns and develop strategies for maintaining professional well-being</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Development Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      10 Development Exploration Areas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      AI-Enhanced Pattern Recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Professional Development Insights
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Career Exploration Support
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="text-center">
                  <Link to="/about">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      Learn More About Our Platform
                    </Button>
                  </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Begin Your Professional Development Journey?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore your workplace preferences, communication patterns, and career interests through our comprehensive development platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Development Areas
              </Button>
            </Link>
            <Link to="/assessment">
              <Button size="lg" variant="outline">
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;