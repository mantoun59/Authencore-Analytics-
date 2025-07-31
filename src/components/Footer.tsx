import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoDisplay from "@/components/LogoDisplay";
import SocialLinks from "@/components/SocialLinks";
import { formatCopyrightLine } from "@/utils/legalNotices";

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
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Company Info */}
          <div className="space-y-6">
            <div className="mb-4">
              <LogoDisplay size="sm" showTagline={true} />
            </div>
            <p className="text-sm text-foreground mb-4">
              {t("footer.tagline")}
            </p>
            
            <div className="space-y-4">
              <a
                href="https://www.authencore.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                www.authencore.org
              </a>
              
              {/* Social Media Links */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-foreground">{t("footer.community")}</h5>
                <SocialLinks 
                  className="justify-start" 
                  size="sm" 
                  variant="ghost"
                  orientation="horizontal"
                />
              </div>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              {t("footer.resources")}
            </h4>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                {t("navigation.home")}
              </Link>
              <Link
                to="/assessment"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                {t("navigation.assessments")}
              </Link>
              <Link
                to="/about"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                {t("navigation.about")}
              </Link>
              <Link
                to="/faq"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                {t("navigation.about")}
              </Link>
              <Link
                to="/privacy"
                className="block text-foreground hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-foreground">
              {t("footer.contact")}
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
                  {t("footer.contact")}
                </a>
              </div>
              
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  Contact Form
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-border pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-foreground text-sm">
              {formatCopyrightLine()} | Advanced AI-Powered Talent Assessment Solutions
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/faq" className="text-foreground hover:text-primary transition-colors">
                {t("footer.support")}
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