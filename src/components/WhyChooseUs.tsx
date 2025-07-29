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
      title: t("landing.feature2Title"),
      description: t("landing.feature2Description")
    },
    {
      icon: Shield,
      title: t("landing.feature1Title"), 
      description: t("landing.feature1Description")
    },
    {
      icon: Target,
      title: t("landing.feature2Title"),
      description: t("landing.feature2Description")
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
            🏆 {t("about.title")}
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-6">{t("features.whyChoose.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t("features.whyChoose.subtitle")}
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
                {t("about.title")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("landing.feature1Title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("landing.feature1Description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("features.comprehensive.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("features.comprehensive.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("features.secure.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("features.secure.description")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {t("features.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {t("features.comprehensive.title")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {t("features.realTime.title")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {t("about.subtitle")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {t("footer.support")}
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="text-center">
                  <Link to="/about">
                    <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      {t("hero.learnMore")}
                    </Button>
                  </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t("landing.ctaTitle")}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("landing.ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assessment">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t("assessments.title")}
              </Button>
            </Link>
            <Link to="/assessment">
              <Button size="lg" variant="outline">
                {t("landing.ctaButton")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;