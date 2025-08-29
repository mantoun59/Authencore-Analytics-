import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Copyright as CopyrightIcon, 
  Shield, 
  FileText, 
  AlertCircle,
  Eye,
  Lock,
  Scale,
  Download,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoDisplay from "@/components/LogoDisplay";
import SEOHead from "@/components/SEOHead";

const Copyright = () => {
  const currentYear = new Date().getFullYear();
  
  const copyrightSections = [
    {
      id: "general-copyright",
      title: "General Copyright Information",
      icon: CopyrightIcon,
      content: [
        `© ${currentYear} AuthenCore Analytics Inc. All rights reserved.`,
        "AuthenCore Analytics, the AuthenCore logo, and all related marks are trademarks of AuthenCore Analytics Inc.",
        "No part of this website, platform, or related materials may be reproduced, distributed, or transmitted without explicit written permission.",
        "The design, layout, graphics, and overall look and feel of the platform are protected by copyright and trademark laws."
      ]
    },
    {
      id: "assessment-content",
      title: "Assessment Content & Methodologies",
      icon: FileText,
      content: [
        "All assessment questions, methodologies, and scoring algorithms are proprietary to AuthenCore Analytics Inc.",
        "Our assessment frameworks are based on validated psychological research and are protected as trade secrets.",
        "Users may not reproduce, copy, or create derivative works based on our assessment content.",
        "Reports generated from assessments are licensed for personal or internal organizational use only."
      ]
    },
    {
      id: "software-platform",
      title: "Software Platform & Technology",
      icon: Lock,
      content: [
        "The AuthenCore Analytics platform software is proprietary and protected by copyright law.",
        "Source code, algorithms, and technical implementations are confidential and proprietary.",
        "Reverse engineering, decompiling, or attempting to extract source code is strictly prohibited.",
        "Our AI models and predictive analytics systems are protected intellectual property."
      ]
    },
    {
      id: "user-content",
      title: "User-Generated Content",
      icon: Eye,
      content: [
        "Users retain ownership of their personal data and assessment responses.",
        "By using the platform, users grant AuthenCore Analytics a license to process and analyze their data.",
        "Assessment results and reports may be used in aggregate form for research and platform improvement.",
        "Users may not claim ownership of the assessment frameworks or methodologies."
      ]
    },
    {
      id: "third-party",
      title: "Third-Party Content & Attributions",
      icon: Scale,
      content: [
        "Some platform features may incorporate third-party libraries and tools under appropriate licenses.",
        "All third-party content is used in compliance with applicable licenses and agreements.",
        "Icons and design elements may be licensed from third-party providers.",
        "Research citations and academic references are properly attributed where applicable."
      ]
    },
    {
      id: "dmca-policy",
      title: "DMCA & Copyright Infringement Policy",
      icon: Shield,
      content: [
        "AuthenCore Analytics respects the intellectual property rights of others.",
        "We will respond to valid DMCA takedown notices in accordance with applicable law.",
        "Repeat copyright infringers may have their accounts terminated.",
        "False claims of copyright infringement may result in legal action."
      ]
    }
  ];

  const permittedUses = [
    "Personal use of assessment results and reports",
    "Internal organizational use within your company",
    "Educational use with proper attribution",
    "Research purposes with written permission",
    "Media coverage with appropriate credits"
  ];

  const prohibitedUses = [
    "Commercial redistribution of content",
    "Creating competing assessment platforms",
    "Selling or licensing our methodologies",
    "Reverse engineering platform technology",
    "Removing copyright or trademark notices"
  ];

  return (
    <>
      <SEOHead 
        title="Copyright Information | AuthenCore Analytics"
        description="Copyright and intellectual property information for AuthenCore Analytics. Learn about our proprietary assessment methodologies, platform technology, and permitted uses of our content."
        keywords="copyright, intellectual property, AuthenCore Analytics, trademarks, DMCA, content usage rights"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <LogoDisplay size="lg" showTagline={true} />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Copyright Information
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Intellectual property rights and usage guidelines for AuthenCore Analytics platform and content
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">© {currentYear} AuthenCore Analytics Inc.</Badge>
                <Badge variant="secondary">All Rights Reserved</Badge>
                <Badge variant="secondary">DMCA Protected</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Quick Reference */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <CopyrightIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Copyright Notice
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    © {currentYear} AuthenCore Analytics Inc. All rights reserved. The content, design, 
                    assessments, and technology on this platform are protected by copyright, trademark, 
                    and other intellectual property laws.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Copyright Sections */}
          <div className="space-y-8 mb-16">
            {copyrightSections.map((section, index) => (
              <Card key={section.id} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content.map((paragraph, paraIndex) => (
                    <p key={paraIndex} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Guidelines */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Usage Guidelines
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Permitted Uses */}
              <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Permitted Uses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {permittedUses.map((use, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-800 dark:text-green-200">{use}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Prohibited Uses */}
              <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Prohibited Uses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {prohibitedUses.map((use, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-red-800 dark:text-red-200">{use}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* DMCA Notice */}
          <section className="mb-16">
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  DMCA Takedown Notice Procedure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-amber-800 dark:text-amber-200">
                  If you believe that content on our platform infringes your copyright, please send a DMCA notice to our designated agent:
                </p>
                <div className="bg-background p-4 rounded-lg border">
                  <div className="space-y-2 text-sm">
                    <p><strong>DMCA Agent:</strong> Legal Department</p>
                    <p><strong>Email:</strong> dmca@authencore.com</p>
                    <p><strong>Address:</strong> AuthenCore Analytics Inc., 123 Analytics Boulevard, Suite 100, San Francisco, CA 94105</p>
                  </div>
                </div>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  Your notice must include: (1) identification of the copyrighted work, (2) identification of the infringing material, 
                  (3) your contact information, (4) a statement of good faith belief, (5) a statement under penalty of perjury, 
                  and (6) your physical or electronic signature.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Licensing Information */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Licensing & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  For special licensing arrangements, academic partnerships, or permissions beyond standard usage, 
                  please contact our licensing team. We offer various licensing options for:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Available Licenses</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Academic research licenses</li>
                      <li>• Enterprise deployment licenses</li>
                      <li>• White-label platform licensing</li>
                      <li>• API integration licenses</li>
                      <li>• Custom assessment development</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Contact Information</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📧 licensing@authencore.com</p>
                      <p>📞 +1-800-AUTHEN-1</p>
                      <p>🌐 Enterprise Portal</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    License Agreement Template
                  </Button>
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Licensing Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer Notice */}
          <section>
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Respect Intellectual Property
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                  AuthenCore Analytics is committed to protecting intellectual property rights. We invest significantly 
                  in research, development, and innovation to provide cutting-edge career analytics solutions. 
                  Your respect for our intellectual property helps us continue to innovate and serve our community.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>© {currentYear} AuthenCore Analytics Inc. | All Rights Reserved</p>
                  <p>AuthenCore Analytics™ is a registered trademark of AuthenCore Analytics Inc.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default Copyright;