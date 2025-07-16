import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Features />
      <CTA />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
