import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BarChart3, 
  Shield, 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  Globe,
  CheckCircle2,
  Cpu,
  Database,
  Lock
} from "lucide-react";

const ComprehensiveFeatures = () => {
  const featureCategories = [
    {
      title: "AI & Intelligence",
      icon: Brain,
      color: "primary",
      features: [
        {
          icon: Cpu,
          title: "Multi-AI Consensus Engine",
          description: "Advanced AI models working together to provide accurate skills predictions and career insights."
        },
        {
          icon: BarChart3,
          title: "Real-Time Market Intelligence",
          description: "Live data feeds from global recruitment companies, government agencies, and economic institutions."
        },
        {
          icon: Target,
          title: "Predictive Analytics",
          description: "Future skills demand forecasting with industry-specific trend analysis and market projections."
        }
      ]
    },
    {
      title: "Platform Reliability",
      icon: Shield,
      color: "accent",
      features: [
        {
          icon: Lock,
          title: "Enterprise Security",
          description: "Bank-level encryption, SOC 2 compliance, and comprehensive audit trails for enterprise environments."
        },
        {
          icon: Database,
          title: "Scalable Infrastructure",
          description: "Cloud-native architecture supporting millions of assessments with 99.9% uptime guarantee."
        },
        {
          icon: Zap,
          title: "Lightning Performance",
          description: "Sub-second response times, optimized algorithms, and edge computing for global accessibility."
        }
      ]
    },
    {
      title: "Professional Development",
      icon: TrendingUp,
      color: "green-600",
      features: [
        {
          icon: Users,
          title: "Comprehensive Assessments",
          description: "10+ validated assessment tools covering personality, skills, communication, and career preferences."
        },
        {
          icon: Target,
          title: "Personalized Insights",
          description: "AI-enhanced pattern recognition providing tailored recommendations for professional growth."
        },
        {
          icon: Globe,
          title: "Career Pathway Mapping",
          description: "Dynamic career exploration with market-aligned development recommendations and skill gap analysis."
        }
      ]
    }
  ];

  const technicalSpecs = [
    { label: "API Response Time", value: "< 200ms", icon: Zap },
    { label: "Data Sources", value: "500+", icon: Database },
    { label: "Security Certifications", value: "SOC 2 Type II", icon: Shield },
    { label: "Global Availability", value: "99.9%", icon: Globe },
    { label: "AI Model Accuracy", value: "94.7%", icon: Brain },
    { label: "Languages Supported", value: "25+", icon: Users }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            ⚡ Cutting-Edge Technology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Professional-Grade Features & Reliability
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-level capabilities with consumer-friendly interfaces, backed by the latest AI technology and robust infrastructure.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-16 mb-20">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  category.color === 'primary' ? 'bg-primary/10' :
                  category.color === 'accent' ? 'bg-accent/10' :
                  'bg-green-500/10'
                }`}>
                  <category.icon className={`w-8 h-8 ${
                    category.color === 'primary' ? 'text-primary' :
                    category.color === 'accent' ? 'text-accent' :
                    'text-green-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="hover:shadow-lg transition-all duration-300 bg-background/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          category.color === 'primary' ? 'bg-primary/10' :
                          category.color === 'accent' ? 'bg-accent/10' :
                          'bg-green-500/10'
                        }`}>
                          <feature.icon className={`w-5 h-5 ${
                            category.color === 'primary' ? 'text-primary' :
                            category.color === 'accent' ? 'text-accent' :
                            'text-green-600'
                          }`} />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specifications */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Technical Excellence & Performance Metrics
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry-leading performance standards with transparent metrics and proven reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technicalSpecs.map((spec, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <spec.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{spec.value}</div>
                <div className="text-xs text-muted-foreground">{spec.label}</div>
              </div>
            ))}
          </div>

          {/* Reliability Badges */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 px-4 py-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                SOC 2 Type II Certified
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                GDPR Compliant
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 px-4 py-2">
                <Lock className="w-4 h-4 mr-2" />
                ISO 27001 Aligned
              </Badge>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                99.9% Uptime SLA
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveFeatures;