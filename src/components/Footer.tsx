import { Mail, Phone, MapPin, ExternalLink, Shield, Users, Award, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoDisplay from "@/components/LogoDisplay";
import SocialLinks from "@/components/SocialLinks";
import { formatCopyrightLine } from "@/utils/legalNotices";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleHashNavigation = (hash: string) => {
    navigate('/compliance');
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  return (
    <footer className="bg-gradient-subtle border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="mb-6">
              <LogoDisplay size="sm" showTagline={true} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced AI-powered assessment platform providing cutting-edge psychological tools for career development and organizational excellence.
            </p>
            
            <div className="space-y-4">
              <a
                href="https://www.authencore.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors story-link"
              >
                <Globe className="w-4 h-4" />
                www.authencore.org
              </a>
              
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-foreground">Follow Us</h5>
                <SocialLinks 
                  className="justify-start" 
                  size="sm" 
                  variant="ghost"
                  orientation="horizontal"
                />
              </div>
            </div>
          </div>

          {/* Assessment Tools */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Assessment Tools
            </h4>
            <div className="space-y-3">
              <Link to="/career-launch" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Career Launch Assessment
              </Link>
              <Link to="/communication-styles" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Communication Styles
              </Link>
              <Link to="/emotional-intelligence" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Emotional Intelligence
              </Link>
              <Link to="/stress-resilience" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Stress & Resilience
              </Link>
              <Link to="/cultural-intelligence" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Cultural Intelligence
              </Link>
              <Link to="/assessment" className="block text-sm font-medium text-primary hover:text-primary-glow transition-colors">
                View All Assessments →
              </Link>
            </div>
          </div>

          {/* Resources & Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Resources
            </h4>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Home
              </Link>
              <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                About Us
              </Link>
              <Link to="/sample-reports" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Sample Reports
              </Link>
              <Link to="/faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                FAQ & Support
              </Link>
              <Link to="/marketing-materials" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                Marketing Materials
              </Link>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Contact & Legal
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <a 
                    href="mailto:contact@authencore.org"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors story-link"
                  >
                    contact@authencore.org
                  </a>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/contact" className="inline-flex items-center gap-2">
                      Contact Form
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                  Privacy Policy
                </Link>
                <Link to="/compliance" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                  Terms of Service
                </Link>
                <Link to="/security" className="block text-sm text-muted-foreground hover:text-primary transition-colors story-link">
                  Security & Compliance
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="border-t border-border/50 pt-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
              <Shield className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Enterprise Security</p>
                <p className="text-xs text-muted-foreground">SOC 2 & GDPR Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
              <Award className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Psychometrically Validated</p>
                <p className="text-xs text-muted-foreground">Research-Based Assessments</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
              <Users className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Trusted by Organizations</p>
                <p className="text-xs text-muted-foreground">Professional HR Solutions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-border/50 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              {formatCopyrightLine()} | Advanced AI-Powered Talent Assessment Solutions
            </p>
            <div className="flex items-center gap-6 text-xs">
              <span className="text-muted-foreground">Built with ❤️ for HR Professionals</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;