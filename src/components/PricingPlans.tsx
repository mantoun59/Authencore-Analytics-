import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Building2, Star, CreditCard } from "lucide-react";
import { ContactSalesForm } from "./ContactSalesForm";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const PricingPlans = () => {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);

  const plans = [
    {
      id: "individual",
      name: "Individual Assessment",
      price: "$24.99",
      period: "",
      description: "Perfect for individual career development and personal insights",
      features: [
        "Choose any single assessment",
        "Comprehensive detailed report",
        "Instant results delivery",
        "PDF download included",
        "Mobile-friendly interface",
        "Email support"
      ],
      buttonText: "Purchase Assessment",
      popular: false,
      icon: CreditCard,
      action: () => navigate('/payment')
    },
    {
      id: "bundle",
      name: "Complete Bundle", 
      price: "$79.99",
      period: "",
      description: "All assessments included - best value for comprehensive insights",
      features: [
        "All 10+ assessment types",
        "Career Launch Assessment",
        "CAIR+ Personality Profile",
        "Communication Styles Analysis",
        "Emotional Intelligence Report",
        "Cultural Intelligence Assessment", 
        "Leadership Potential Analysis",
        "Stress & Resilience Profile",
        "Faith & Values Alignment",
        "Gen Z Workplace Assessment",
        "Digital Wellness Assessment",
        "Priority email support"
      ],
      buttonText: "Get Complete Bundle",
      popular: true,
      icon: Star,
      action: () => navigate('/payment?type=bundle')
    },
    {
      id: "enterprise",
      name: "Enterprise & Partners",
      price: "Custom",
      period: "",
      description: "Tailored solutions for organizations and partners",
      features: [
        "Volume pricing available",
        "Custom branding & white-label",
        "API integration support",
        "Dedicated account manager",
        "Advanced analytics dashboard",
        "Bulk user management",
        "Training & onboarding",
        "24/7 priority support",
        "Custom reporting formats",
        "SSO integration",
        "Compliance & security features"
      ],
      buttonText: "Contact Sales",
      popular: false,
      icon: Building2,
      action: () => setShowContactForm(true)
    }
  ];

  if (showContactForm) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowContactForm(false)}
              className="mb-6"
            >
              ← Back to Pricing
            </Button>
          </div>
          <ContactSalesForm />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect option for your assessment needs. All purchases include instant access with detailed reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative p-6 hover:shadow-card transition-all duration-300 ${
                  plan.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={plan.action}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-muted/30 rounded-lg p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold mb-2">✨ What's Included in Every Purchase</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>• Instant access & results</div>
              <div>• Detailed PDF reports</div>
              <div>• Mobile-friendly interface</div>
              <div>• Secure data handling</div>
              <div>• Professional insights</div>
              <div>• Email support included</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;