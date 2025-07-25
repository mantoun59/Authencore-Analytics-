import { BarChart3, Shield, Target, Trophy, Users, Zap, Star, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import professionalMeeting from "@/assets/professional-meeting.jpg";

const WhyChooseUs = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Expert Analysis",
      description: "Leverage our in-depth industry knowledge for reliable insights with professional assessment and analytics."
    },
    {
      icon: Shield,
      title: "Reliable Results", 
      description: "Highlights accuracy and consistency of provided insights you can trust for critical decisions."
    },
    {
      icon: Target,
      title: "Actionable Insights",
      description: "Focus on data-driven results that transform into strategic decisions for your success."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
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
            🏆 Professional Assessment Solutions
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose AuthenCore Analytics</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience professional-grade psychological assessments backed by scientific research 
            and designed to provide meaningful insights for personal and professional development.
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
                Professional Assessment Solutions
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Scientifically Validated</h4>
                    <p className="text-sm text-muted-foreground">Our assessments are built on established psychological research and validated methodologies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Comprehensive Reporting</h4>
                    <p className="text-sm text-muted-foreground">Detailed insights with actionable recommendations for personal and professional development.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Secure & Confidential</h4>
                    <p className="text-sm text-muted-foreground">Your data is protected with enterprise-grade security and strict confidentiality protocols.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Assessment Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Multiple assessment types
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Instant results and reporting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Professional interpretation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Ongoing support resources
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="text-center">
                <Link to="/about">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Learn More About Our Process
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover your potential with our professionally designed assessments 
            and take the first step toward personal and professional growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Our Assessments
              </Button>
            </Link>
            <Link to="/assessment">
              <Button size="lg" variant="outline">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;