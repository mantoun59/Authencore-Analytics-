import { Brain, FileText, Shield, Zap, Users, Target, BarChart3, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import analyticsWorkspaceImage from "@/assets/analytics-workspace.jpg";

const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Brain,
      title: t("features.comprehensive.title"),
      description: t("features.comprehensive.description"),
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: FileText,
      title: t("features.reports.title"),
      description: t("features.reports.description"),
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: Shield,
      title: t("features.secure.title"),
      description: t("features.secure.description"),
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Zap,
      title: t("features.realTime.title"),
      description: t("features.realTime.description"),
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Users,
      title: t("features.aiPowered.title"),
      description: t("features.aiPowered.description"),
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Target,
      title: t("features.comprehensive.title"),
      description: t("features.comprehensive.description"),
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t("features.title")}
          </h2>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
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
                <CardDescription className="text-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Analytics Showcase */}
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                Professional Analytics Dashboard
              </h3>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                Access comprehensive assessment analytics through our professional dashboard. 
                Monitor progress, track development, and gain deep insights into assessment results 
                with advanced data visualization tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">Professional Reports</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-elegant">
                <img 
                  src={analyticsWorkspaceImage}
                  alt="Professional analytics dashboard showing assessment data and business intelligence"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional stats section */}
        <div className="mt-20 text-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-border/50">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Assessment Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Personality</div>
                <div className="text-sm text-foreground">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Cognitive</div>
                <div className="text-sm text-foreground">Testing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Behavioral</div>
                <div className="text-sm text-foreground">Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Professional</div>
                <div className="text-sm text-foreground">Development</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;