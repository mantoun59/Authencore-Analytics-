import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Brain className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Professional Psychological Assessments</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
            Welcome to<br />
            <span className="text-primary">Authencore Analytics</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional psychological assessment platform offering scientifically validated tests 
            to help individuals and organizations understand personality, aptitude, and behavioral patterns.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 group">
              Start Assessment
              <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">13</div>
              <div className="text-sm text-muted-foreground">Assessment Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Validated</div>
              <div className="text-sm text-muted-foreground">Scientific Methods</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">Secure</div>
              <div className="text-sm text-muted-foreground">Data Protection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Confidential & Secure</span>
          <span>•</span>
          <span>Professional Standards</span>
          <span>•</span>
          <span>Validated Assessments</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;