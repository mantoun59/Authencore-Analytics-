import { MousePointer, FileText, BarChart3 } from "lucide-react";
import businessAnalytics from "@/assets/business-analytics.jpg";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Select an Assessment",
      description: "User browses and selects the desired evaluation from our comprehensive range",
      icon: MousePointer
    },
    {
      number: "2", 
      title: "Complete Assessment",
      description: "Guided process for input and completion with expert-designed questions",
      icon: FileText
    },
    {
      number: "3",
      title: "View Results",
      description: "Instantly access and review the personalized results with detailed insights",
      icon: BarChart3
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Background Image */}
        <div className="mb-16">
          <img 
            src={businessAnalytics}
            alt="Business analytics and assessment workflow"
            className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-elegant opacity-90"
          />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto -mt-12 mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;