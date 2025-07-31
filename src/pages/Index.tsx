import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import PsychometricsInfo from "@/components/PsychometricsInfo";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="AuthenCore Analytics - Professional Psychological Assessment Platform"
        description="Professional psychological assessment platform providing scientifically validated tests for individuals and organizations. Measuring Minds. Shaping Futures."
        keywords={["psychological assessment", "psychometric testing", "professional evaluation", "career assessment", "personality testing", "workplace assessment", "AI-powered analytics"]}
      />
      <Header />
      <Hero />
      <WhyChooseUs />
      <PsychometricsInfo />
      <HowItWorks />
      <Gallery />
      <Features />
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </div>
      <CTA />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
