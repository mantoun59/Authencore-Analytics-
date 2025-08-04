import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import PsychometricsInfo from "@/components/PsychometricsInfo";
import HowItWorksNew from "@/components/HowItWorksNew";
import DevelopmentAreas from "@/components/DevelopmentAreas";
import AIInsights from "@/components/AIInsights";
import Gallery from "@/components/Gallery";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Index = () => {
  
  return (
    <div className="min-h-screen bg-background">
      <ComplianceDisclaimer type="site-wide" />
      <Header />
      <Hero />
      <WhyChooseUs />
      <HowItWorksNew />
      <DevelopmentAreas />
      <AIInsights />
      <PsychometricsInfo />
      <Gallery />
      <Features />
      <CTA />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
