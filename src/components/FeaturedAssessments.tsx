import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Brain, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { assessmentsData } from "@/data/assessmentsData";

const FeaturedAssessments = () => {
  const { t } = useTranslation();
  // Use real assessment data - featuring the top 3 assessments
  const featuredAssessments = assessmentsData.slice(0, 3).map(assessment => ({
    title: assessment.title,
    price: assessment.price,
    icon: assessment.id === 'career-launch' ? Rocket : 
          assessment.id === 'cair-personality' ? Brain : Shield,
    description: assessment.subtitle,
    route: assessment.route
  }));

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t("landing.assessmentsTitle")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredAssessments.map((assessment, index) => {
            const IconComponent = assessment.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-card transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{assessment.description}</p>
                  <div className="text-3xl font-bold text-foreground mb-6">
                    {assessment.price}
                  </div>
                  <Link to={assessment.route}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {t("assessments.takeAssessment")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAssessments;