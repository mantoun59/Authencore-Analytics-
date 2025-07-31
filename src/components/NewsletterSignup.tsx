import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Gift, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    try {
      // Store newsletter subscription
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email.trim(),
          source: 'website_signup',
          metadata: {
            page: window.location.pathname,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;

      // Log analytics event
      await supabase.rpc('log_analytics_event', {
        p_event_type: 'newsletter_signup',
        p_entity_type: 'marketing',
        p_metadata: {
          email: email.trim(),
          source: 'website_signup'
        }
      });

      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest updates and free resources.",
      });
      
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome aboard!</h3>
            <p className="text-sm text-muted-foreground">
              Check your email for a welcome message and your free resources.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-4">
          <Gift className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Get Free Sample Reports & Updates</CardTitle>
        <CardDescription className="text-base">
          Join 5,000+ professionals receiving exclusive insights, assessment guides, and early access to new features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/80 border-border/50"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !email.trim()}
              className="bg-primary hover:bg-primary/90 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe Free
                </>
              )}
            </Button>
          </div>
          <div className="flex items-start space-x-2 text-xs text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
            <span>Free sample reports • Assessment guides • No spam • Unsubscribe anytime</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;