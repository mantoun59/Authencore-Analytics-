import React from 'react';
import { Download, FileText, Image, Users, BarChart3, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Import marketing materials
import marketingBrochure from '@/assets/marketing-brochure-cover.jpg';
import productSheet from '@/assets/product-sheet.jpg';
import servicesOverview from '@/assets/services-overview.jpg';
import caseStudyTemplate from '@/assets/case-study-template.jpg';

interface MarketingMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  size: string;
  image: string;
  icon: React.ComponentType<any>;
}

const marketingMaterials: MarketingMaterial[] = [
  {
    id: 'company-brochure',
    title: 'Company Brochure',
    description: 'Comprehensive overview of AuthenCore Analytics services, capabilities, and value proposition. Perfect for client meetings and presentations.',
    category: 'Company Overview',
    format: 'PDF',
    size: '2.3 MB',
    image: marketingBrochure,
    icon: FileText
  },
  {
    id: 'product-sheet',
    title: 'Assessment Products Sheet',
    description: 'Detailed product specifications, features, and benefits of our psychometric assessment suite. Includes technical details and use cases.',
    category: 'Product Information',
    format: 'PDF',
    size: '1.8 MB',
    image: productSheet,
    icon: BarChart3
  },
  {
    id: 'services-overview',
    title: 'Services Overview',
    description: 'Visual overview of our complete service offerings, from individual assessments to enterprise solutions. Great for sales presentations.',
    category: 'Services',
    format: 'PNG',
    size: '1.2 MB',
    image: servicesOverview,
    icon: Briefcase
  },
  {
    id: 'case-study',
    title: 'Success Stories & Case Studies',
    description: 'Real-world implementation examples and success stories from our clients. Demonstrates ROI and practical applications.',
    category: 'Case Studies',
    format: 'PDF',
    size: '3.1 MB',
    image: caseStudyTemplate,
    icon: Users
  }
];

const MarketingMaterials: React.FC = () => {
  const { toast } = useToast();

  const handleDownload = (material: MarketingMaterial) => {
    // Create a download link for the image
    const link = document.createElement('a');
    link.href = material.image;
    link.download = `${material.title.replace(/\s+/g, '-').toLowerCase()}.${material.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: `${material.title} is being downloaded.`,
    });
  };

  const categories = Array.from(new Set(marketingMaterials.map(m => m.category)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Marketing Materials
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Download professional marketing materials to showcase AuthenCore Analytics 
              services and capabilities to your stakeholders.
            </p>
            <Badge variant="secondary" className="text-base px-4 py-2">
              All materials are professionally designed and ready to use
            </Badge>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Available Materials</h2>
            <p className="text-muted-foreground">
              Choose from our comprehensive collection of marketing materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketingMaterials.map((material) => {
              const IconComponent = material.icon;
              return (
                <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative bg-gradient-to-br from-primary/5 to-secondary/5">
                    <img
                      src={material.image}
                      alt={material.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white/80 backdrop-blur">
                        {material.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {material.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {material.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="secondary">{material.format}</Badge>
                        <Badge variant="outline">{material.size}</Badge>
                      </div>
                      
                      <Button
                        onClick={() => handleDownload(material)}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Usage Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <Card>
                <CardContent className="p-6">
                  <Image className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Brand Consistency</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain AuthenCore Analytics branding standards when using these materials
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Client Presentations</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect for client meetings, proposals, and stakeholder presentations
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <FileText className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Professional Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    High-resolution materials designed for both digital and print use
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketingMaterials;