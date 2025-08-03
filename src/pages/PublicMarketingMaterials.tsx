import React from 'react';
import { Download, FileText, Users, ArrowRight, ExternalLink, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PublicMarketingMaterials: React.FC = () => {
  const materials = [
    {
      id: 'company-brochure',
      title: 'Company Brochure',
      description: 'Comprehensive overview of AuthenCore Analytics services and capabilities',
      type: 'Brochure',
      pages: 8,
      size: '2.1 MB'
    },
    {
      id: 'assessment-technical-specs',
      title: 'Assessment Technical Specifications',
      description: 'Detailed technical documentation for all assessment types',
      type: 'Technical Sheet',
      pages: 12,
      size: '1.8 MB'
    },
    {
      id: 'case-studies',
      title: 'Success Stories & Case Studies',
      description: 'Real-world implementations and results from client organizations',
      type: 'Case Studies',
      pages: 16,
      size: '3.2 MB'
    },
    {
      id: 'pricing-packages',
      title: 'Pricing & Service Packages',
      description: 'Detailed pricing information and service package options',
      type: 'Pricing Guide',
      pages: 6,
      size: '1.5 MB'
    }
  ];

  const handleGeneratePDF = async (materialId: string, title: string) => {
    try {
      const response = await fetch('/supabase/functions/v1/generate-marketing-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId,
          title,
          companyName: 'AuthenCore Analytics',
          generateDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const htmlContent = await response.text();
      
      // Create a new window/tab with the HTML content for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Auto-trigger print dialog after content loads
        printWindow.onload = () => {
          setTimeout(() => printWindow.print(), 100);
        };
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate marketing material. Please try again.');
    }
  };

  const handleContactSales = () => {
    window.open('mailto:sales@authencore.org?subject=Marketing Materials Request&body=Hello, I would like to request more information about your marketing materials and services.', '_blank');
  };

  const handleRequestCustom = () => {
    window.open('mailto:design@authencore.org?subject=Custom Marketing Materials&body=Hello, I would like to request custom marketing materials for my organization.', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Professional Marketing Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Marketing Materials
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Download professional marketing materials to showcase AuthenCore Analytics' 
              comprehensive assessment platform to your stakeholders and clients.
            </p>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {materials.map((material) => (
              <Card key={material.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {material.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">{material.type}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4">
                    {material.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{material.pages} pages</span>
                    <span>{material.size}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleGeneratePDF(material.id, material.title)}
                      size="sm" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate PDF
                    </Button>
                    <Button 
                      onClick={() => handleGeneratePDF(material.id, material.title)}
                      size="sm" 
                      variant="outline"
                      className="px-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
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
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleContactSales}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Sales Team
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-primary/30 hover:bg-primary/5"
                    onClick={handleRequestCustom}
                  >
                    <Users className="w-5 h-5 mr-2" />
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

export default PublicMarketingMaterials;