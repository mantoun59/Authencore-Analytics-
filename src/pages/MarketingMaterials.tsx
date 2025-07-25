import React from 'react';
import { Users, Image, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MarketingMaterials: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Professional Marketing Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Marketing Materials
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional, ready-to-use marketing materials to showcase AuthenCore Analytics' 
              comprehensive assessment platform. Download branded collateral for presentations, 
              proposals, and client communications.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">12+</div>
                <div className="text-sm text-muted-foreground">Assessment Types</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-accent mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Completed Assessments</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-secondary mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-muted-foreground">Industries Served</div>
              </CardContent>
            </Card>
          </div>

          {/* Empty State - Waiting for New Materials */}
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Image className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Marketing Materials Coming Soon
              </h3>
              <p className="text-muted-foreground">
                New professional marketing materials will be available here shortly. 
                Check back soon for updated resources.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Need Custom Marketing Materials?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We can create customized marketing materials tailored to your specific needs. 
                  Contact our team for branded collateral that aligns with your organization's identity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Users className="w-5 h-5 mr-2" />
                    Contact Sales Team
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/5">
                    <Image className="w-5 h-5 mr-2" />
                    Request Custom Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MarketingMaterials;