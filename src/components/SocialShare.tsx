import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Twitter, Linkedin, Link, Mail, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  hashtags?: string[];
  className?: string;
}

const SocialShare = ({ 
  title = "AuthenCore Analytics - Professional Psychological Assessment Platform",
  description = "Discover your potential with scientifically validated assessments. Measuring Minds. Shaping Futures.",
  url = window.location.href,
  hashtags = ["psychometrics", "assessment", "careerdev", "psychology"],
  className = ""
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(" ");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags.join(",")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${url}`
  };

  const handleShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    
    // Track sharing analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        method: platform,
        content_type: 'assessment_result',
        item_id: window.location.pathname
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Share Your Results</h3>
          <p className="text-sm text-muted-foreground">
            Let others discover the power of professional assessments
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook', shareLinks.facebook)}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
          >
            <Facebook className="w-4 h-4" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter', shareLinks.twitter)}
            className="flex items-center gap-2 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600"
          >
            <Twitter className="w-4 h-4" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin', shareLinks.linkedin)}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
          >
            <Linkedin className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('email', shareLinks.email)}
            className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {copied ? "Copied!" : "Copy"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;