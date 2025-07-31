import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLinksProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  showLabels?: boolean;
  orientation?: "horizontal" | "vertical";
}

const SocialLinks = ({ 
  className = "",
  size = "md",
  variant = "ghost",
  showLabels = false,
  orientation = "horizontal"
}: SocialLinksProps) => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/authencore",
      icon: Facebook,
      color: "hover:text-blue-600"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/authencore",
      icon: Twitter,
      color: "hover:text-sky-500"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/authencore",
      icon: Linkedin,
      color: "hover:text-blue-700"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/authencore",
      icon: Instagram,
      color: "hover:text-pink-600"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@authencore",
      icon: Youtube,
      color: "hover:text-red-600"
    },
    {
      name: "Email",
      url: "mailto:contact@authencore.org",
      icon: Mail,
      color: "hover:text-green-600"
    }
  ];

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }[size];

  const buttonSize = {
    sm: "sm",
    md: "default",
    lg: "lg"
  }[size] as "sm" | "default" | "lg";

  const containerClass = orientation === "horizontal" 
    ? "flex items-center space-x-2" 
    : "flex flex-col space-y-2";

  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Track social media clicks
    if (typeof gtag !== 'undefined') {
      gtag('event', 'social_click', {
        platform: platform,
        event_category: 'Social Media',
        event_label: platform
      });
    }
  };

  return (
    <div className={`${containerClass} ${className}`}>
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          variant={variant}
          size={buttonSize}
          onClick={() => handleSocialClick(social.name.toLowerCase(), social.url)}
          className={`${social.color} transition-colors duration-200 ${
            showLabels ? 'justify-start' : 'p-2'
          }`}
          aria-label={`Follow us on ${social.name}`}
        >
          <social.icon className={iconSize} />
          {showLabels && (
            <span className="ml-2">{social.name}</span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default SocialLinks;