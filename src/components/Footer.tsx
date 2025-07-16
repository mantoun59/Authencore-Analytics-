import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
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

          {/* Middle Section - Legal & Compliance */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Legal & Compliance
            </h4>
            <div className="space-y-2">
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
              <a
                href="#terms"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#gdpr"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                GDPR Compliance
              </a>
              <a
                href="#security"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Data Security Standards
              </a>
              <a
                href="#ethics"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Assessment Ethics
              </a>
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
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="tel:+15551234567"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <div>Professional Services Center</div>
                  <div>Suite 200, Business District</div>
                </div>
              </div>
              
              <div className="pt-2">
                <a
                  href="#contact"
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
              <Link to="/compliance" className="text-muted-foreground hover:text-primary transition-colors">
                Compliance Documentation
              </Link>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
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