import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { assessmentsData } from "@/data/assessmentsData";
import { AssessmentLogo } from "@/components/AssessmentLogo";

const FeaturedAssessments = () => {
  // Use real assessment data - featuring the top 3 assessments
  const featuredAssessments = assessmentsData.slice(0, 3);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Assessments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredAssessments.map((assessment, index) => (
            <Card key={assessment.id} className="text-center p-6 hover:shadow-card transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <AssessmentLogo 
                    assessmentId={assessment.id}
                    title={assessment.title}
                    size="lg"
                    fallbackIcon={assessment.icon}
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {assessment.title}
                </h3>
                <p className="text-muted-foreground mb-4">{assessment.subtitle}</p>
                <div className="text-3xl font-bold text-foreground mb-6">
                  {assessment.price}
                </div>
                <Link to={assessment.route}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Take Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAssessments;