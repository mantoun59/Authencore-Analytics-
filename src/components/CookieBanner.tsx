import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Shield, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('gdprConsent', 'true');
    localStorage.setItem('analyticsConsent', 'true');
    setIsVisible(false);
    toast({
      title: "Cookie Preferences Saved",
      description: "All cookies accepted. You can change preferences anytime.",
      duration: 3000,
    });
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('gdprConsent', 'false');
    localStorage.setItem('analyticsConsent', 'false');
    setIsVisible(false);
    toast({
      title: "Cookie Preferences Saved",
      description: "Only essential cookies will be used for site functionality.",
      duration: 3000,
    });
  };

  const handleManage = () => {
    localStorage.setItem('cookieConsent', 'essential');
    localStorage.setItem('gdprConsent', 'true');
    localStorage.setItem('analyticsConsent', 'false');
    setIsVisible(false);
    toast({
      title: "Cookie Preferences Updated",
      description: "Only essential cookies enabled. Analytics disabled.",
      duration: 3000,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elegant backdrop-blur-sm animate-slide-in-bottom">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-primary flex-shrink-0" />
              <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">
                🍪 GDPR Cookie Consent & Privacy Protection
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We respect your privacy and comply with GDPR regulations. We use essential cookies for site functionality 
                and optional cookies for analytics to improve our services. 
                <Link to="/privacy" className="text-primary hover:text-primary-glow underline ml-1 inline-flex items-center">
                  Privacy Policy <Shield className="w-3 h-3 ml-1" />
                </Link>
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-green-600 flex items-center">
                  <Shield className="w-3 h-3 mr-1" /> GDPR Compliant
                </span>
                <span className="text-xs text-blue-600 flex items-center">
                  <Settings className="w-3 h-3 mr-1" /> Granular Control
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleManage}
                className="text-muted-foreground hover:text-foreground flex items-center space-x-1"
              >
                <Settings className="w-3 h-3" />
                <span>Essential Only</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDecline}
                className="flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Decline All</span>
              </Button>
              <Button 
                size="sm"
                onClick={handleAccept}
                className="flex items-center space-x-1"
              >
                <Shield className="w-3 h-3" />
                <span>Accept All</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;