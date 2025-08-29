import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Building, 
  Globe, 
  BarChart3, 
  Target, 
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import aiSkillsPrediction from "@/assets/ai-skills-prediction.jpg";
import individualDevelopment from "@/assets/individual-development.jpg";

const PlatformOverview = () => {
  const developmentFeatures = [
    "Professional self-assessment tools",
    "Career exploration insights", 
    "Communication pattern analysis",
    "Workplace preference discovery",
    "Leadership approach identification",
    "Personalized development recommendations"
  ];

  const aiFeatures = [
    "Real-time market skills intelligence",
    "AI-powered career pathway predictions", 
    "Future skills gap analysis",
    "Industry trend forecasting",
    "Multi-source data integration",
    "Automated insights generation"
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🚀 Complete Analytics Platform
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Two Powerful Platforms, One Vision
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Combine individual development insights with cutting-edge AI skills prediction for comprehensive workforce intelligence.
          </p>
        </div>

        {/* Platform Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Self-Development Platform */}
          <Card className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Self-Development
                </Badge>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3">Professional Development Platform</CardTitle>
              <CardDescription className="text-base">
                Comprehensive self-assessment and career exploration tools for individual professional growth.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="mb-6">
                <img 
                  src={individualDevelopment}
                  alt="Individual using professional development assessment platform"
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </div>
              
              <div className="space-y-3 mb-6">
                {developmentFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Target:</span> Individuals, HR Teams
                </div>
                <Link to="/assessment">
                  <Button className="group-hover:translate-x-1 transition-transform">
                    Explore Platform
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Future Skills AI Platform */}
          <Card className="relative overflow-hidden hover:shadow-elegant transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Intelligence
                </Badge>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-3">Future Skills AI Platform</CardTitle>
              <CardDescription className="text-base">
                Revolutionary AI-powered skills intelligence with real-time market data and predictive analytics.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="mb-6">
                <img 
                  src={aiSkillsPrediction}
                  alt="AI skills prediction interface with futuristic data visualizations"
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </div>
              
              <div className="space-y-3 mb-6">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Target:</span> Enterprise, Government
                </div>
                <Link to="/future-skills-ai">
                  <Button variant="outline" className="border-accent/20 hover:border-accent/40 group-hover:translate-x-1 transition-transform">
                    View AI Platform
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Benefits */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Why Choose AuthenCore Analytics?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-3">Enterprise Security</h4>
              <p className="text-muted-foreground text-sm">
                Bank-level encryption, compliance certifications, and comprehensive data protection for enterprise environments.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-3">Real-Time Intelligence</h4>
              <p className="text-muted-foreground text-sm">
                Live market data feeds, instant analytics processing, and real-time dashboard updates for immediate insights.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-3">Proven Results</h4>
              <p className="text-muted-foreground text-sm">
                Evidence-based methodologies, validated assessment tools, and measurable outcomes for professional development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;