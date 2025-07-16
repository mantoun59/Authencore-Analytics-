import { Brain, FileText, Shield, Zap, Users, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Comprehensive Assessments",
      description: "Professional psychological assessments covering personality, cognitive abilities, emotional intelligence, and behavioral patterns.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      description: "In-depth analysis reports with actionable insights, recommendations, and development opportunities tailored to individual results.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Your assessment data is protected with enterprise-grade security. All information remains strictly confidential.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive your comprehensive assessment results immediately upon completion with downloadable PDF reports.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Users,
      title: "Organization Insights",
      description: "Team assessment capabilities for organizations looking to understand group dynamics and optimize team performance.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Target,
      title: "Development Tracking",
      description: "Monitor personal or professional development progress with follow-up assessments and growth tracking tools.",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Assessment Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional psychological assessment tools designed to provide accurate insights into personality, behavior, and cognitive abilities.
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
            <h3 className="text-2xl font-bold mb-8 text-foreground">Assessment Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Personality</div>
                <div className="text-sm text-muted-foreground">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Cognitive</div>
                <div className="text-sm text-muted-foreground">Testing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Behavioral</div>
                <div className="text-sm text-muted-foreground">Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Professional</div>
                <div className="text-sm text-muted-foreground">Development</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;