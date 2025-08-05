import { Button } from "@/components/ui/button";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CTA = () => {
  const { t } = useTranslation();
  const benefits = [
    t("features.reports.title"),
    t("landing.feature1Title"),
    t("features.secure.title"),
    t("features.realTime.title")
  ];

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden mt-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-radial from-white/10 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Rating */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="ml-3 text-white/90">{t("about.subtitle")}</span>
          </div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t("landing.ctaTitle")}
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("landing.ctaDescription")}
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="w-4 h-4 text-primary-glow flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/assessment">
              <Button 
                size="xl" 
                className="bg-white text-primary hover:bg-white/90 hover:scale-110 shadow-glow group font-bold"
              >
                {t("assessments.takeAssessment")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="text-white/80 text-sm">
              <span className="block">{t("about.subtitle")}</span>
              <span className="block">{t("features.realTime.title")}</span>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm mb-4">{t("footer.tagline")}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-white font-semibold">{t("navigation.admin")}</div>
              <div className="text-white font-semibold">{t("footer.company")}</div>
              <div className="text-white font-semibold">{t("about.title")}</div>
              <div className="text-white font-semibold">{t("footer.support")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;