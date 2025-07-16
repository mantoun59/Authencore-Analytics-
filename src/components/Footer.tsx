import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Logo and Legal Links */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="bg-white p-4 rounded-lg w-fit">
              <img 
                src="/lovable-uploads/e422854d-e315-4866-9e88-3066bbf7d64b.png" 
                alt="AuthenCore Analytics" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* Legal Links */}
            <div className="space-y-2">
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
                Data Security
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
              &copy; 2024 AuthenCore Analytics. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#compliance" className="text-muted-foreground hover:text-primary transition-colors">
                Compliance
              </a>
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