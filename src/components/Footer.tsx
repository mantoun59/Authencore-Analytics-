import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleHashNavigation = (hash: string) => {
    navigate('/compliance');
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/5eb5f31e-5eaa-4d7d-a93c-5c9ebf449b63.png" 
                alt="Authencore Analytics" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Measuring Minds. Shaping Futures.
            </p>
            
            <div className="space-y-2">
              <a
                href="https://www.authencore.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                www.authencore.org
              </a>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/privacy"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Privacy Policy & Literature
              </Link>
              <Link
                to="/compliance"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Compliance Documentation
              </Link>
              <button
                onClick={() => handleHashNavigation('terms')}
                className="block text-left text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleHashNavigation('gdpr')}
                className="block text-left text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                GDPR Compliance
              </button>
              <button
                onClick={() => handleHashNavigation('security')}
                className="block text-left text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Data Security Standards
              </button>
              <button
                onClick={() => handleHashNavigation('ethics')}
                className="block text-left text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Assessment Ethics
              </button>
              <button
                onClick={() => handleHashNavigation('assessment-integrity')}
                className="block text-left text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Assessment Integrity
              </button>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Contact
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:contact@authencore.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  contact@authencore.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:contact@authencore.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Business Inquiries
                </a>
              </div>
              
              <div className="pt-2">
                <a
                  href="mailto:contact@authencore.com"
                  className="inline-flex items-center text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  Contact Form
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-border pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 Authencore Analytics. All rights reserved. | Advanced AI-Powered Talent Assessment Solutions
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy & Literature
              </Link>
              <button
                onClick={() => handleHashNavigation('assessment-integrity')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Assessment Integrity
              </button>
              <Link to="/compliance" className="text-muted-foreground hover:text-primary transition-colors">
                Compliance Documentation
              </Link>
              <a href="mailto:contact@authencore.com" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;