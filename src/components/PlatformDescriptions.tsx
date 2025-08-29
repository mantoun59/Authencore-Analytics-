import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Target, 
  Zap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Lightbulb,
  LineChart,
  Globe,
  Cpu,
  Shield
} from "lucide-react";

const PlatformDescriptions = () => {
  const developmentModules = [
    {
      title: "Career Interest Exploration",
      description: "Discover career paths aligned with your values, interests, and workplace preferences through comprehensive exploration tools.",
      icon: Target,
      features: ["Values-based career matching", "Interest assessment tools", "Workplace preference analysis"]
    },
    {
      title: "Communication Style Analysis",
      description: "Understand your communication patterns and learn to adapt your style for enhanced workplace collaboration.",
      icon: Users,
      features: ["Communication pattern recognition", "Style adaptation strategies", "Collaboration optimization"]
    },
    {
      title: "Leadership Development",
      description: "Explore your leadership potential and discover effective approaches for different situations and team dynamics.",
      icon: TrendingUp,
      features: ["Leadership style assessment", "Situational leadership tools", "Team dynamics analysis"]
    },
    {
      title: "Professional Wellness",
      description: "Build awareness of stress patterns and develop strategies for maintaining balance and well-being in professional environments.",
      icon: Shield,
      features: ["Stress pattern recognition", "Wellness strategy development", "Work-life balance tools"]
    }
  ];

  const aiSkillsFeatures = [
    {
      title: "Real-Time Market Intelligence",
      description: "Live data feeds from global recruitment companies, government agencies, and economic institutions providing instant market insights.",
      icon: Globe,
      features: ["500+ global data sources", "Real-time market updates", "Economic trend analysis"]
    },
    {
      title: "AI-Powered Skills Prediction",
      description: "Advanced machine learning models predict future skills demand and career pathway opportunities with 94.7% accuracy.",
      icon: Brain,
      features: ["Multi-AI consensus engine", "Future demand forecasting", "Career pathway predictions"]
    },
    {
      title: "Comprehensive Analytics Dashboard",
      description: "Professional-grade analytics with interactive visualizations, customizable reports, and actionable business intelligence.",
      icon: BarChart3,
      features: ["Interactive data visualization", "Custom report generation", "Performance metrics tracking"]
    },
    {
      title: "Automated Insights Generation",
      description: "AI automatically identifies patterns, trends, and opportunities, delivering actionable insights without manual analysis.",
      icon: Lightbulb,
      features: ["Pattern recognition", "Trend identification", "Automated recommendations"]
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            📊 Platform Deep Dive
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Comprehensive Platform Capabilities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the detailed features and capabilities of both our development modules and AI skills intelligence platforms.
          </p>
        </div>

        <div className="space-y-20">
          {/* Development Modules Section */}
          <div>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Professional Development Modules</h3>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive self-assessment tools designed to promote professional growth through structured exploration and evidence-based insights.
              </p>
              <div className="mt-6">
                <Link to="/development">
                  <Button variant="outline" className="border-primary/20 hover:border-primary/40">
                    Explore Development Platform
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {developmentModules.map((module, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <module.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Development Stats */}
            <div className="mt-12 bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Assessment Areas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">Evidence-Based</div>
                  <div className="text-sm text-muted-foreground">Methodologies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">AI-Enhanced</div>
                  <div className="text-sm text-muted-foreground">Insights</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">Personalized</div>
                  <div className="text-sm text-muted-foreground">Recommendations</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Skills Intelligence Section */}
          <div>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">Future Skills AI Intelligence</h3>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Revolutionary AI-powered platform providing real-time market intelligence, skills prediction, and workforce analytics for enterprise and government use.
              </p>
              <div className="mt-6">
                <Link to="/future-skills-ai">
                  <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90">
                    Explore AI Platform
                    <Brain className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aiSkillsFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Performance Stats */}
            <div className="mt-12 bg-gradient-to-r from-accent/5 to-primary/5 rounded-2xl p-8 border border-border/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">94.7%</div>
                  <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Data Sources</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">Real-Time</div>
                  <div className="text-sm text-muted-foreground">Market Intelligence</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">Multi-AI</div>
                  <div className="text-sm text-muted-foreground">Consensus Engine</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="mt-20 text-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Integrated Platform Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LineChart className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Comprehensive Coverage</h4>
                <p className="text-muted-foreground text-sm">
                  From individual development to enterprise workforce intelligence, covering all organizational levels.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Seamless Integration</h4>
                <p className="text-muted-foreground text-sm">
                  Unified platform architecture allows smooth transitions between development and prediction tools.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Actionable Insights</h4>
                <p className="text-muted-foreground text-sm">
                  Both platforms provide practical, evidence-based recommendations for immediate implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformDescriptions;