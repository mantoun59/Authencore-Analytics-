import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, Users, Building, UserCheck, BarChart3, Target, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LogoDisplay from "@/components/LogoDisplay";
import hrAnalyticsDashboard from "@/assets/hr-analytics-dashboard.jpg";

const AuthenCoreHero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Company Logo */}
            <div className="flex flex-col items-start mb-6">
              <LogoDisplay size="lg" showTagline={false} className="text-left" />
              <p className="text-xl text-foreground/80 font-medium mt-3">
                Analytics & Intelligence Platform
              </p>
            </div>

            {/* Badge */}
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-sm px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Comprehensive Analytics Suite
            </Badge>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Professional Development & 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Future Skills Intelligence</span>
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive analytics platform combining self-development insights with AI-powered skills prediction for HR managers, individuals, and government organizations.
            </h2>

            {/* Target Audiences */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-card border border-border rounded-lg px-4 py-2">
                <Building className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium">HR Managers</span>
              </div>
              <div className="flex items-center bg-card border border-border rounded-lg px-4 py-2">
                <UserCheck className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium">Individuals</span>
              </div>
              <div className="flex items-center bg-card border border-border rounded-lg px-4 py-2">
                <Globe className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm font-medium">Government</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/future-skills-ai">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 group">
                  Explore Future Skills AI
                  <Brain className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link to="/assessment">
                <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/40">
                  Self-Development Platform
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">AI-Powered</div>
                <div className="text-xs text-muted-foreground">Skills Prediction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Real-Time</div>
                <div className="text-xs text-muted-foreground">Market Data</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Comprehensive</div>
                <div className="text-xs text-muted-foreground">Analytics Suite</div>
              </div>
            </div>
          </div>

          {/* Right column - Professional Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={hrAnalyticsDashboard}
                alt="HR managers analyzing comprehensive business analytics dashboard with skills forecasting and predictive insights"
                className="w-full h-auto object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-4 shadow-card backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-semibold text-foreground">Live Analytics</div>
                  <div className="text-xs text-muted-foreground">Real-time insights</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-card border border-border rounded-lg p-4 shadow-card backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-accent" />
                <div>
                  <div className="text-sm font-semibold text-foreground">AI Prediction</div>
                  <div className="text-xs text-muted-foreground">Future skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthenCoreHero;