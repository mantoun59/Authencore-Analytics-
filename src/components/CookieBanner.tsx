import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

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
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handleManage = () => {
    // In a real app, this would open a cookie preferences modal
    alert('Cookie preferences would open here. For now, this just accepts essential cookies.');
    localStorage.setItem('cookieConsent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elegant backdrop-blur-sm animate-slide-in-bottom">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <Cookie className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-foreground font-medium mb-1">
                We use cookies to enhance your experience
              </p>
              <p className="text-xs text-muted-foreground">
                By continuing to visit this site you agree to our use of cookies for analytics, 
                personalization, and advertising. 
                <a href="#privacy" className="text-primary hover:text-primary-glow underline ml-1">
                  Learn more
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleManage}
              className="text-muted-foreground hover:text-foreground"
            >
              Manage
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDecline}
            >
              Decline
            </Button>
            <Button 
              size="sm"
              onClick={handleAccept}
            >
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecline}
              className="w-8 h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;