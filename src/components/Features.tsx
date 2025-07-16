import { Brain, FileText, Shield, Zap, Users, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms provide deep insights into personality traits and psychological patterns with unprecedented accuracy.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: FileText,
      title: "Comprehensive Assessments",
      description: "Multiple assessment types including personality, cognitive, emotional intelligence, and behavioral analysis tests.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Your data is encrypted end-to-end and protected with enterprise-grade security measures. HIPAA and GDPR compliant.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Zap,
      title: "Instant Reports",
      description: "Get detailed, actionable reports immediately after completing your assessment with personalized recommendations.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Team Analytics",
      description: "Advanced team dynamics analysis and organizational psychology insights for better workplace collaboration.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Track your personal development journey with milestone tracking and progress visualization over time.",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the advanced capabilities that make Authencore Analytics the leading platform for psychological assessment and analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional stats section */}
        <div className="mt-20 text-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-border/50">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Trusted by Industry Leaders</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Fortune 500</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Healthcare</div>
                <div className="text-sm text-muted-foreground">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Universities</div>
                <div className="text-sm text-muted-foreground">Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Research</div>
                <div className="text-sm text-muted-foreground">Centers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;