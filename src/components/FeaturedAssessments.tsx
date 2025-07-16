import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BarChart3, TrendingUp } from "lucide-react";

const FeaturedAssessments = () => {
  const assessments = [
    {
      title: "Leadership Assessment",
      price: "$49",
      icon: Users,
      description: "Comprehensive leadership evaluation"
    },
    {
      title: "Market Analysis",
      price: "$99", 
      icon: BarChart3,
      description: "Deep market insights and trends"
    },
    {
      title: "Risk Management",
      price: "$129",
      icon: TrendingUp,
      description: "Strategic risk assessment tools"
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Assessments</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {assessments.map((assessment, index) => {
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
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Take Assessment
                  </Button>
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