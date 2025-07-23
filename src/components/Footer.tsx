import { Mail, Phone, MapPin, ExternalLink, Linkedin, Twitter, Facebook, Youtube, Instagram } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LogoDisplay from "@/components/LogoDisplay";

import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleHashNavigation = (hash: string) => {
    navigate('/compliance');
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleComingSoon = (platform: string) => {
    toast({
      title: "Coming Soon!",
      description: `Our ${platform} page will be available soon. Stay tuned!`,
    });
  };
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Section - Company Info */}
          <div className="space-y-6">
            <div className="mb-4">
              <LogoDisplay size="sm" showTagline={true} />
            </div>
            <p className="text-sm text-foreground mb-4">
              Measuring Minds. Shaping Futures.
            </p>
            
            <div className="space-y-2">
              <a
                href="https://www.authencore.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                www.authencore.org
              </a>
              
              {/* Social Media Links */}
              <div className="pt-4">
                <h5 className="text-sm font-semibold text-foreground mb-3">Follow Us</h5>
                <div className="flex space-x-4">
                  <a
                    href="https://linkedin.com/company/authencore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/authencore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleComingSoon("Facebook")}
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <a
                    href="https://youtube.com/@authencore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleComingSoon("Instagram")}
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Connect With Us
            </h4>
            <p className="text-sm text-foreground">
              Stay updated with the latest insights in talent assessment and workplace analytics.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-foreground">Newsletter</h5>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Large Social Media Icons */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-foreground">Follow Our Journey</h5>
              <div className="flex space-x-3">
                <a
                  href="https://linkedin.com/company/authencore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/authencore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="https://youtube.com/@authencore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-muted rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/candidate-testing"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Testing Portal
              </Link>
              <Link
                to="/testing-dashboard"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Testing Dashboard
              </Link>
              <Link
                to="/marketing-materials"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Downloads
              </Link>
              <Link
                to="/privacy"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Privacy Policy & Literature
              </Link>
              <Link
                to="/compliance"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Compliance Documentation
              </Link>
              <button
                onClick={() => handleHashNavigation('terms')}
                className="block text-left text-foreground hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleHashNavigation('gdpr')}
                className="block text-left text-foreground hover:text-primary transition-colors text-sm"
              >
                GDPR Compliance
              </button>
              <button
                onClick={() => handleHashNavigation('security')}
                className="block text-left text-foreground hover:text-primary transition-colors text-sm"
              >
                Data Security Standards
              </button>
              <button
                onClick={() => handleHashNavigation('ethics')}
                className="block text-left text-foreground hover:text-primary transition-colors text-sm"
              >
                Assessment Ethics
              </button>
              <button
                onClick={() => handleHashNavigation('assessment-integrity')}
                className="block text-left text-foreground hover:text-primary transition-colors text-sm"
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
                  href="mailto:contact@authencore.org"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  contact@authencore.org
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:contact@authencore.org"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Business Inquiries
                </a>
              </div>
              
              <div className="pt-2">
                <a
                  href="mailto:contact@authencore.org"
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
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-foreground text-sm">
                &copy; 2024 Authencore Analytics. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="https://linkedin.com/company/authencore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/authencore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@authencore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-foreground hover:text-primary transition-colors">
                Privacy & Literature
              </Link>
              <button
                onClick={() => handleHashNavigation('assessment-integrity')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Assessment Integrity
              </button>
              <Link to="/compliance" className="text-foreground hover:text-primary transition-colors">
                Compliance Documentation
              </Link>
              <a href="mailto:contact@authencore.org" className="text-foreground hover:text-primary transition-colors">
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