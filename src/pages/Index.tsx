import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyChooseUs from "@/components/WhyChooseUs";
import FeaturedAssessments from "@/components/FeaturedAssessments";
import HowItWorks from "@/components/HowItWorks";
import PricingPlans from "@/components/PricingPlans";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhyChooseUs />
      <FeaturedAssessments />
      <HowItWorks />
      <PricingPlans />
      <Testimonials />
      <Features />
      <CTA />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
