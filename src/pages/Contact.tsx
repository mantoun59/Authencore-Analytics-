import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Contact Us - AuthenCore Analytics"
        description="Get in touch with our team for questions about assessments, enterprise solutions, or technical support. We're here to help you succeed."
        keywords={["contact", "support", "enterprise solutions", "psychological assessment help"]}
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our assessments or need custom solutions? 
              Our team is here to help you unlock your potential.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Let's Talk</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Ready to discuss your assessment needs?
                  </p>
                  <a 
                    href="mailto:contact@authencore.org"
                    className="inline-block text-primary hover:text-primary/90 font-medium"
                  >
                    Schedule a Call
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    Send us your questions anytime
                  </p>
                  <a 
                    href="mailto:contact@authencore.org"
                    className="inline-block text-primary hover:text-primary/90 font-medium"
                  >
                    contact@authencore.org
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Response Time</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    We respond within 24 hours
                  </p>
                  <span className="inline-block text-primary font-medium">
                    Monday - Friday, 9AM - 6PM EST
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Suspense fallback={<div>Loading contact form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Looking for Quick Answers?
            </h2>
            <p className="text-muted-foreground mb-6">
              Check out our FAQ section for common questions about assessments, pricing, and technical support.
            </p>
            <a 
              href="/faq"
              className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
            >
              Visit FAQ Section
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;