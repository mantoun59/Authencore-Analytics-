import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Building, 
  UserCheck, 
  Globe, 
  Users, 
  BarChart3, 
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  PieChart,
  Shield
} from "lucide-react";
import hrAnalyticsDashboard from "@/assets/hr-analytics-dashboard.jpg";
import governmentAnalytics from "@/assets/government-analytics.jpg";
import individualDevelopment from "@/assets/individual-development.jpg";

const TargetAudiences = () => {
  const audiences = [
    {
      icon: Building,
      title: "HR Managers & Enterprise",
      description: "Comprehensive workforce analytics and talent development solutions",
      image: hrAnalyticsDashboard,
      benefits: [
        "Talent gap analysis and workforce planning",
        "Employee skill development tracking",
        "Predictive hiring intelligence",
        "Team performance optimization",
        "ROI measurement on training programs",
        "Succession planning insights"
      ],
      features: [
        "Real-time workforce analytics",
        "AI-powered talent insights",
        "Compliance and reporting tools"
      ],
      color: "primary",
      ctaText: "Request Enterprise Demo",
      ctaLink: "/contact"
    },
    {
      icon: UserCheck,
      title: "Individuals & Professionals",
      description: "Personal development and career advancement tools",
      image: individualDevelopment,
      benefits: [
        "Personalized career pathway recommendations",
        "Skills gap identification and development plans",
        "Market-aligned professional growth strategies",
        "Communication style optimization",
        "Leadership potential assessment",
        "Workplace preference discovery"
      ],
      features: [
        "Self-paced assessment tools",
        "AI-enhanced personal insights",
        "Career exploration guidance"
      ],
      color: "accent",
      ctaText: "Start Your Journey",
      ctaLink: "/assessment"
    },
    {
      icon: Globe,
      title: "Government & Public Sector",
      description: "Population-scale workforce intelligence and policy insights",
      image: governmentAnalytics,
      benefits: [
        "Regional skills landscape analysis",
        "Workforce development policy insights",
        "Economic impact assessment tools",
        "Educational alignment with market needs",
        "Labor market trend forecasting",
        "Population demographic analytics"
      ],
      features: [
        "Large-scale data processing",
        "Policy impact simulation",
        "Secure government-grade infrastructure"
      ],
      color: "green-600",
      ctaText: "Schedule Consultation",
      ctaLink: "/contact"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 Tailored Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Solutions for Every Organization
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From individual career development to enterprise workforce intelligence and government policy insights.
          </p>
        </div>

        {/* Audience Cards */}
        <div className="space-y-16">
          {audiences.map((audience, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-elegant transition-all duration-300 border-border/50">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Image Section */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <img 
                    src={audience.image}
                    alt={`${audience.title} analytics solution`}
                    className="w-full h-full object-cover min-h-[400px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className={`p-8 lg:p-12 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                        audience.color === 'primary' ? 'bg-primary/10' :
                        audience.color === 'accent' ? 'bg-accent/10' :
                        'bg-green-500/10'
                      }`}>
                        <audience.icon className={`w-8 h-8 ${
                          audience.color === 'primary' ? 'text-primary' :
                          audience.color === 'accent' ? 'text-accent' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-foreground">{audience.title}</CardTitle>
                        <CardDescription className="text-base mt-1">{audience.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {/* Benefits */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-foreground mb-4">Key Benefits</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {audience.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-foreground mb-4">Platform Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {audience.features.map((feature, featureIndex) => (
                          <Badge 
                            key={featureIndex} 
                            variant="secondary" 
                            className={`${
                              audience.color === 'primary' ? 'bg-primary/10 text-primary' :
                              audience.color === 'accent' ? 'bg-accent/10 text-accent' :
                              'bg-green-500/10 text-green-600'
                            }`}
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link to={audience.ctaLink}>
                      <Button 
                        size="lg" 
                        className={`group ${
                          audience.color === 'primary' ? 'bg-primary hover:bg-primary/90' :
                          audience.color === 'accent' ? 'bg-accent hover:bg-accent/90' :
                          'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {audience.ctaText}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Analytics Capabilities?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of organizations already using AuthenCore Analytics for smarter workforce decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/future-skills-ai">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  Explore AI Platform
                  <BarChart3 className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/assessment">
                <Button size="lg" variant="outline">
                  Try Development Tools
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudiences;