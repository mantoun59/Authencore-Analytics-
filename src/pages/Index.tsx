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

const Index = () => {
  console.log('🏠 Index.tsx: Home page component loading...');
  console.log('🏗️ Index.tsx: Rendering home page components...');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <WhyChooseUs />
      <PsychometricsInfo />
      <HowItWorks />
      <Gallery />
      <Features />
      <CTA />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
