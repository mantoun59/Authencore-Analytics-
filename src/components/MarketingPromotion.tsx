import React from 'react';
import { Download, FileText, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const MarketingPromotion: React.FC = () => {
  const materials = [
    {
      icon: FileText,
      title: 'Company Brochures',
      description: 'Professional overview materials'
    },
    {
      icon: Users,
      title: 'Case Studies',
      description: 'Real-world success stories'
    },
    {
      icon: Download,
      title: 'Product Sheets',
      description: 'Detailed service information'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Marketing Materials
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access our comprehensive collection of marketing materials to showcase 
            AuthenCore Analytics services to your stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {materials.map((material, index) => {
            const IconComponent = material.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{material.title}</h3>
                  <p className="text-sm text-muted-foreground">{material.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/marketing-materials">
            <Button size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Browse All Materials
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            High-quality PDFs and images ready for presentations
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketingPromotion;