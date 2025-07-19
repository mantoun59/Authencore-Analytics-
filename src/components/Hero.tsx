import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Brain className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Professional Psychological Assessments</span>
            </div>

            {/* Company Logo */}
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/lovable-uploads/5eb5f31e-5eaa-4d7d-a93c-5c9ebf449b63.png" 
                alt="Authencore Analytics" 
                className="h-16 w-auto"
              />
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Welcome to<br />
              <span className="text-primary">Authencore Analytics</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Professional psychological assessment platform offering scientifically validated tests 
              to help individuals and organizations understand personality, aptitude, and behavioral patterns.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/assessment">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  Start Assessment
                  <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-4">
              <Shield className="w-4 h-4" />
              <span>Confidential & Secure</span>
              <span>•</span>
              <span>Professional Standards</span>
              <span>•</span>
              <span>Validated Assessments</span>
            </div>
          </div>

          {/* Right column - Professional Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src="/lovable-uploads/d4fbfb7f-31a2-45cd-9d2b-3ecc959732ab.png"
                alt="Professional team collaborating with AI-powered assessment analytics and brain interface technology"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 left-6 right-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">10</div>
                    <div className="text-xs text-muted-foreground">Assessment Types</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">Validated</div>
                    <div className="text-xs text-muted-foreground">Scientifically Researched, AI Developed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">Secure</div>
                    <div className="text-xs text-muted-foreground">Data Protection</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;