import { BarChart3, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import professionalMeeting from "@/assets/professional-meeting.jpg";

const WhyChooseUs = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Expert Analysis",
      description: "Leverage our in-depth industry knowledge for reliable insights with professional assessment and analytics."
    },
    {
      icon: Shield,
      title: "Reliable Results", 
      description: "Highlights accuracy and consistency of provided insights you can trust for critical decisions."
    },
    {
      icon: Target,
      title: "Actionable Insights",
      description: "Focus on data-driven results that transform into strategic decisions for your success."
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
          <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Us</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Leverage our in-depth industry knowledge for reliable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Assessments
            </Button>
            <Button size="lg" variant="outline">
              Take Assessment
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="text-center p-8 rounded-lg hover:shadow-card transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;