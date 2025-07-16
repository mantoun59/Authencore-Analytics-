import { BarChart3, Shield, Target, Trophy, Users, Zap, Star, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import professionalMeeting from "@/assets/professional-meeting.jpg";

const WhyChooseUs = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Expert Analysis",
      description: "Leverage our in-depth industry knowledge for reliable insights with professional assessment and analytics.",
      stat: "95%+ Accuracy"
    },
    {
      icon: Shield,
      title: "Reliable Results", 
      description: "Highlights accuracy and consistency of provided insights you can trust for critical decisions.",
      stat: "ISO Certified"
    },
    {
      icon: Target,
      title: "Actionable Insights",
      description: "Focus on data-driven results that transform into strategic decisions for your success.",
      stat: "24/7 Support"
    }
  ];

  const achievements = [
    { icon: Trophy, label: "Industry Leader", value: "15+ Years" },
    { icon: Users, label: "Happy Clients", value: "50,000+" },
    { icon: Star, label: "Success Rate", value: "98%" },
    { icon: Award, label: "Certifications", value: "12+" }
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
            🏆 Industry-Leading Assessment Solutions
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose AuthenCore Analytics</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join thousands of professionals and organizations who trust our scientifically-validated 
            assessments to unlock human potential and drive exceptional results.
          </p>
          
          {/* Achievement Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{achievement.value}</div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </div>
              );
            })}
          </div>
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
                  <Badge variant="secondary" className="mx-auto">{feature.stat}</Badge>
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

        {/* Promotional Content */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Transform Your Organization with Data-Driven Insights
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Reduce Hiring Costs by 40%</h4>
                    <p className="text-sm text-muted-foreground">Our pre-employment assessments identify top candidates faster, reducing time-to-hire and improving retention rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Boost Team Performance by 30%</h4>
                    <p className="text-sm text-muted-foreground">Team dynamics assessments help build stronger, more cohesive teams with complementary skills.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Improve Employee Engagement by 50%</h4>
                    <p className="text-sm text-muted-foreground">Personal development assessments help employees understand their strengths and career paths.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Enterprise Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Custom assessment development
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      White-label solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      API integration support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Dedicated account management
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Limited Time:</strong> 30% off Enterprise plans
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Schedule Enterprise Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Unlock Your Potential?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the thousands of professionals who have discovered their strengths, 
            improved their performance, and accelerated their careers with our assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Assessment Journey
            </Button>
            <Button size="lg" variant="outline">
              Book a Consultation
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ⚡ Get started in under 2 minutes • 🛡️ 100% confidential • 📊 Instant results
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;