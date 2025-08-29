import Header from "@/components/Header";
import AuthenCoreHero from "@/components/AuthenCoreHero";
import PlatformOverview from "@/components/PlatformOverview";
import TargetAudiences from "@/components/TargetAudiences";
import PlatformDescriptions from "@/components/PlatformDescriptions";
import ComprehensiveFeatures from "@/components/ComprehensiveFeatures";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  
  return (
    <>
      <SEOHead 
        title="AuthenCore Analytics | Professional Development & Future Skills AI Intelligence Platform"
        description="Comprehensive analytics platform combining self-development insights with AI-powered skills prediction for HR managers, individuals, and government organizations. Real-time market intelligence and predictive career analytics."
        keywords="professional development, future skills AI, career analytics, HR intelligence, workforce analytics, skills prediction, talent development, AI-powered insights, career pathways, professional growth"
      />
      <div className="min-h-screen bg-background">
        <PlatformOverview />
        <TargetAudiences />
        <PlatformDescriptions />
        <ComprehensiveFeatures />
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
};

export default Index;
