import { AlertTriangle, Lightbulb, Sparkles, Users, Target, Brain, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import businessPresentationImage from "@/assets/business-presentation.jpg";
import professionalAssessmentImage from "@/assets/professional-assessment.jpg";

const About = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Hero Image */}
        <div className="mb-16">
          <img 
            src={businessPresentationImage}
            alt="Professional business presentation showing assessment analytics and team collaboration"
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-elegant"
          />
        </div>
        {/* About Us Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">{t("about.mission")}</h2>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Who We Are */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">{t("about.whoWeAre")}</h3>
            <div className="space-y-4 text-foreground text-lg leading-relaxed">
              <p>
                {t("about.whoWeAreText1")}
              </p>
              <p>
                {t("about.whoWeAreText2")}
              </p>
            </div>
          </div>

          {/* Why We Built This */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">{t("about.whyWeBuilt")}</h3>
            <div className="space-y-4 text-foreground text-lg leading-relaxed">
              <p>
                {t("about.whyWeBuiltText1")}
              </p>
              <p>
                {t("about.whyWeBuiltText2")}
              </p>
            </div>
          </div>

          {/* Visual Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">{t("about.platformTitle")}</h3>
              <p className="text-foreground text-lg leading-relaxed">
                {t("about.platformDescription")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{t("about.aiPowered")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{t("about.securePlatform")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{t("about.teamAnalytics")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-foreground">{t("about.goalOriented")}</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={professionalAssessmentImage}
                alt="Professional using assessment analytics for business decision making"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Our Promise */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">{t("about.ourPromise")}</h3>
            <p className="text-foreground text-lg leading-relaxed">
              {t("about.promiseText")}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h3 className="text-2xl font-bold text-destructive">{t("about.disclaimer")}</h3>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">{t("about.importantNote")}</h4>
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  {t("about.disclaimerText1")}
                </p>
                <p>
                  {t("about.disclaimerText2")}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Add-On */}
          <div className="text-center py-8 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              <p className="text-lg font-medium">
                {t("about.footerText")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;