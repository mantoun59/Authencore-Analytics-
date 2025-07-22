import React from 'react';
import { Download, FileText, Image, Users, BarChart3, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

// Import marketing materials
import marketingBrochure from '@/assets/marketing-brochure-cover.jpg';
import productSheet from '@/assets/product-sheet.jpg';
import servicesOverview from '@/assets/services-overview.jpg';
import caseStudyTemplate from '@/assets/case-study-template.jpg';
import finalLogo from '@/assets/final-logo.png';

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

  const loadLogoAsBase64 = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Unable to get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load logo image'));
      img.src = finalLogo; // Use the imported logo
    });
  };

  const generateCompanyBrochure = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 50, 30);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    
    
    // Header text
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.text('AuthenCore Analytics', 80, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(128, 128, 128);
    doc.text('Reading minds, shaping future', 80, 35);
    
    // Content sections
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Company Overview', 20, 60);
    
    doc.setFontSize(12);
    doc.text('AuthenCore Analytics is a leading provider of professional psychometric', 20, 75);
    doc.text('assessments and analytics solutions. We specialize in comprehensive', 20, 85);
    doc.text('psychological evaluations for individuals and organizations.', 20, 95);
    
    doc.text('Our Services:', 20, 115);
    doc.text('• Professional Psychometric Assessments', 25, 125);
    doc.text('• Career Launch Assessments', 25, 135);
    doc.text('• Emotional Intelligence Evaluations', 25, 145);
    doc.text('• Leadership and Communication Style Analysis', 25, 155);
    doc.text('• Burnout Prevention Programs', 25, 165);
    doc.text('• Digital Wellness Assessments', 25, 175);
    
    doc.text('Why Choose AuthenCore Analytics?', 20, 195);
    doc.text('✓ Scientifically validated assessments', 25, 205);
    doc.text('✓ Professional-grade reporting', 25, 215);
    doc.text('✓ Secure and confidential processing', 25, 225);
    doc.text('✓ Immediate results and insights', 25, 235);
    doc.text('✓ Comprehensive analytics dashboard', 25, 245);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('© 2024 AuthenCore Analytics. All rights reserved.', 20, 280);
    doc.text('Professional Assessment Solutions | www.authencore-analytics.com', 20, 290);
    
    return doc;
  };

  const generateProductSheet = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    
    // Header text
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('Assessment Products & Services', 75, 25);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Career Launch Assessment', 20, 50);
    doc.setFontSize(11);
    doc.text('Comprehensive career readiness evaluation measuring key workplace', 20, 60);
    doc.text('competencies, personality traits, and professional development areas.', 20, 68);
    doc.text('• Duration: 45-60 minutes', 25, 78);
    doc.text('• Detailed PDF reports with recommendations', 25, 86);
    doc.text('• Suitable for: Job seekers, recent graduates, career changers', 25, 94);
    
    // Product 2
    doc.setFontSize(16);
    doc.text('Emotional Intelligence Assessment', 20, 110);
    doc.setFontSize(11);
    doc.text('Measures emotional awareness, regulation, and interpersonal skills', 20, 120);
    doc.text('essential for workplace success and personal development.', 20, 128);
    doc.text('• Duration: 30-40 minutes', 25, 138);
    doc.text('• EQ scores across 4 key domains', 25, 146);
    doc.text('• Development recommendations included', 25, 154);
    
    // Product 3
    doc.setFontSize(16);
    doc.text('Leadership Style Assessment', 20, 170);
    doc.setFontSize(11);
    doc.text('Identifies leadership strengths, communication preferences, and', 20, 180);
    doc.text('management style to enhance team effectiveness.', 20, 188);
    doc.text('• Duration: 35-45 minutes', 25, 198);
    doc.text('• 360-degree feedback integration available', 25, 206);
    doc.text('• Team dynamics analysis', 25, 214);
    
    // Enterprise Solutions
    doc.setFontSize(16);
    doc.setTextColor(41, 128, 185);
    doc.text('Enterprise Solutions', 20, 235);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('• Bulk assessment packages with volume discounts', 25, 245);
    doc.text('• Custom branding and white-label options', 25, 253);
    doc.text('• API integration for HRIS systems', 25, 261);
    doc.text('• Dedicated account management', 25, 269);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Contact us for pricing and custom solutions: info@authencore-analytics.com', 20, 290);
    
    return doc;
  };

  const generateCaseStudy = async () => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    // Header text  
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text('Success Story: TechCorp Implementation', 75, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Client Challenge', 20, 50);
    doc.setFontSize(11);
    doc.text('TechCorp, a growing software company with 200+ employees, faced', 20, 60);
    doc.text('challenges in hiring the right talent and reducing turnover rates.', 20, 68);
    doc.text('Their existing interview process lacked objective assessment tools.', 20, 76);
    
    doc.setFontSize(14);
    doc.text('AuthenCore Solution', 20, 95);
    doc.setFontSize(11);
    doc.text('Implemented comprehensive assessment suite including:', 20, 105);
    doc.text('• Career Launch Assessments for all new hires', 25, 115);
    doc.text('• Leadership evaluations for management candidates', 25, 123);
    doc.text('• Team compatibility analysis', 25, 131);
    doc.text('• Custom reporting dashboard for HR team', 25, 139);
    
    doc.setFontSize(14);
    doc.text('Results Achieved', 20, 158);
    doc.setFontSize(11);
    doc.text('Within 6 months of implementation:', 20, 168);
    doc.text('✓ 35% reduction in employee turnover', 25, 178);
    doc.text('✓ 40% improvement in hiring accuracy', 25, 186);
    doc.text('✓ 25% faster onboarding process', 25, 194);
    doc.text('✓ 90% employee satisfaction with role fit', 25, 202);
    doc.text('✓ $50,000 annual savings in recruitment costs', 25, 210);
    
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('"AuthenCore Analytics transformed our hiring process. We now', 20, 230);
    doc.text('make data-driven decisions and see much better outcomes."', 20, 240);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('- Sarah Johnson, HR Director, TechCorp', 20, 250);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Ready to transform your organization? Contact us today.', 20, 280);
    doc.text('Email: sales@authencore-analytics.com | Phone: (555) 123-4567', 20, 290);
    
    return doc;
  };

  const generateServicesOverview = async () => {
    const doc = new jsPDF('landscape');
    
    // Add logo
    try {
      const logoBase64 = await loadLogoAsBase64();
      doc.addImage(logoBase64, 'PNG', 20, 10, 45, 25);
    } catch (error) {
      console.warn('Logo loading failed, using text fallback');
    }
    
    // Header text
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text('AuthenCore Analytics - Complete Service Portfolio', 75, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Individual Assessments', 20, 45);
    doc.setFontSize(10);
    doc.text('• Career Launch Assessment', 25, 55);
    doc.text('• Emotional Intelligence', 25, 62);
    doc.text('• Communication Styles', 25, 69);
    doc.text('• Digital Wellness', 25, 76);
    doc.text('• Stress & Resilience', 25, 83);
    doc.text('• Burnout Prevention', 25, 90);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Professional Features', 20, 110);
    doc.setFontSize(10);
    doc.text('• Instant PDF reports', 25, 120);
    doc.text('• Scientific validation', 25, 127);
    doc.text('• Multiple languages', 25, 134);
    doc.text('• Mobile-friendly interface', 25, 141);
    doc.text('• Data security compliance', 25, 148);
    
    // Column 2
    doc.setFontSize(14);
    doc.text('Enterprise Solutions', 150, 45);
    doc.setFontSize(10);
    doc.text('• Bulk assessment packages', 155, 55);
    doc.text('• Custom branding options', 155, 62);
    doc.text('• API integrations', 155, 69);
    doc.text('• White-label solutions', 155, 76);
    doc.text('• Dedicated support', 155, 83);
    doc.text('• Training programs', 155, 90);
    
    doc.setFontSize(14);
    doc.text('Analytics & Reporting', 150, 110);
    doc.setFontSize(10);
    doc.text('• Comprehensive dashboards', 155, 120);
    doc.text('• Trend analysis', 155, 127);
    doc.text('• Benchmark comparisons', 155, 134);
    doc.text('• Export capabilities', 155, 141);
    doc.text('• Real-time insights', 155, 148);
    
    // Bottom section
    doc.setFontSize(16);
    doc.setTextColor(41, 128, 185);
    doc.text('Industry Applications', 20, 175);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Healthcare | Education | Technology | Finance | Manufacturing | Consulting | Government | Non-Profit', 25, 185);
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Contact: info@authencore-analytics.com | Visit: www.authencore-analytics.com | Call: (555) 123-4567', 20, 200);
    
    return doc;
  };

  const handleDownload = async (material: MarketingMaterial) => {
    try {
      let doc;
      let filename;
      
      switch (material.id) {
        case 'company-brochure':
          doc = await generateCompanyBrochure();
          filename = 'AuthenCore-Company-Brochure.pdf';
          break;
        case 'product-sheet':
          doc = await generateProductSheet();
          filename = 'AuthenCore-Product-Sheet.pdf';
          break;
        case 'case-study':
          doc = await generateCaseStudy();
          filename = 'AuthenCore-Case-Study.pdf';
          break;
        case 'services-overview':
          doc = await generateServicesOverview();
          filename = 'AuthenCore-Services-Overview.pdf';
          break;
        default:
          // Fallback to image download
          const response = await fetch(material.image);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `AuthenCore-${material.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Download Started",
            description: `${material.title} is being downloaded.`,
          });
          return;
      }
      
      if (doc) {
        doc.save(filename);
        toast({
          title: "Download Started",
          description: `${material.title} PDF is being downloaded.`,
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive"
      });
    }
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