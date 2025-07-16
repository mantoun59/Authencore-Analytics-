import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingPlans = () => {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals getting started",
      features: [
        "3 Assessment Reports",
        "Basic Analytics",
        "Email Support",
        "Mobile Access",
        "PDF Export"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Standard", 
      price: "$79",
      period: "/month",
      description: "Ideal for professionals and small teams",
      features: [
        "Unlimited Assessments",
        "Advanced Analytics",
        "Priority Support",
        "Team Collaboration",
        "Custom Reports",
        "API Access"
      ],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Premium",
      price: "$149", 
      period: "/month",
      description: "Complete solution for enterprises",
      features: [
        "Everything in Standard",
        "White-label Solution",
        "Dedicated Account Manager",
        "Custom Integrations",
        "Advanced Security",
        "24/7 Phone Support",
        "Training & Onboarding"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Pricing Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your assessment needs. All plans include our core features with varying levels of access and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-6 hover:shadow-card transition-shadow ${
                plan.popular ? 'border-primary shadow-lg scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required. 
            <br />
            Need a custom solution? <span className="text-primary cursor-pointer hover:underline">Contact our team</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;