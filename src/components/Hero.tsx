import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, Shield, Users, BarChart3, Award, Info, Target, MessageSquare, Globe, Heart, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import businessTeamImage from "@/assets/business-team-analytics.jpg";
import professionalAssessmentImage from "@/assets/professional-assessment.jpg";
import LogoDisplay from "@/components/LogoDisplay";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Platform Notice Banner */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Development Insights Platform:</strong> This platform provides exploratory insights for professional development and self-reflection. Results are suggestive starting points for growth, not definitive assessments.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Brain className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Professional Development Platform</span>
            </div>

            {/* Company Logo */}
            <div className="flex flex-col items-center mb-6">
              <LogoDisplay size="lg" showTagline={false} className="text-center" />
              <p className="text-lg text-foreground/70 italic mt-2">
                Empowering Professional Growth Through Self-Discovery
              </p>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Professional Development & Career Exploration Platform
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Discover Your Workplace Preferences, Communication Tendencies, and Career Interests Through Interactive Self-Discovery Experiences
            </h2>

            {/* Value Proposition */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Explore your professional development opportunities with AI-powered insights, personalized growth recommendations, and comprehensive career exploration tools designed for modern professionals.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/assessment">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  Begin Your Development Journey
                  <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/assessment">
                <Button variant="outline" size="lg">
                  Explore Development Areas
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-4">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
              <span>•</span>
              <span>Educational Purpose</span>
              <span>•</span>
              <span>Development Focused</span>
            </div>
          </div>

          {/* Right column - Professional Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={businessTeamImage}
                alt="Professional team collaborating with business analytics and assessment data in modern office"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 left-6 right-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-card backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">10</div>
                    <div className="text-xs text-muted-foreground">Development Areas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">AI-Enhanced</div>
                    <div className="text-xs text-muted-foreground">Growth Insights</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">Private</div>
                    <div className="text-xs text-muted-foreground">& Secure Platform</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Overview Section */}
            <div className="absolute -bottom-96 left-0 right-0">
              <section className="features-overview py-16 bg-background">
                <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center text-foreground mb-4">Explore Your Professional Development Areas</h2>
                  <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                    Structured self-discovery experiences designed to help you understand your workplace preferences, communication tendencies, and career interests.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <Target className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">Career Interest Exploration</h3>
                      <p className="text-muted-foreground">
                        Discover career paths that align with your interests, values, and workplace preferences through comprehensive career exploration tools.
                      </p>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <MessageSquare className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">Communication Style Discovery</h3>
                      <p className="text-muted-foreground">
                        Explore your communication preferences and learn how to adapt your style for better workplace collaboration and professional relationships.
                      </p>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <Users className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">Leadership Approach Insights</h3>
                      <p className="text-muted-foreground">
                        Understand your natural leadership tendencies and explore different leadership approaches for various workplace situations.
                      </p>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <Globe className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">Cultural Awareness Development</h3>
                      <p className="text-muted-foreground">
                        Build cultural intelligence through exploration of cross-cultural workplace dynamics and global collaboration strategies.
                      </p>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <Smartphone className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">Digital Wellness Awareness</h3>
                      <p className="text-muted-foreground">
                        Examine your technology usage patterns and discover strategies for maintaining healthy digital boundaries in the modern workplace.
                      </p>
                    </div>
                    
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <Heart className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-3">Workplace Preference Mapping</h3>
                      <p className="text-muted-foreground">
                        Explore what motivates you at work and understand your preferences for different work environments and team dynamics.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;