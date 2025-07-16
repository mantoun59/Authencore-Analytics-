import { MousePointer, FileText, BarChart3 } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Select an assessment",
      description: "Choose from our comprehensive range of professional assessments",
      icon: MousePointer
    },
    {
      number: "2", 
      title: "Complete assessment",
      description: "Answer questions designed by industry experts",
      icon: FileText
    },
    {
      number: "3",
      title: "View results",
      description: "Get detailed insights and actionable recommendations",
      icon: BarChart3
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
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