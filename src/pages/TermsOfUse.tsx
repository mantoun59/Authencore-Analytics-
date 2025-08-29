import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle,
  Clock,
  Scale,
  Eye,
  Lock
} from "lucide-react";
import LogoDisplay from "@/components/LogoDisplay";
import SEOHead from "@/components/SEOHead";

const TermsOfUse = () => {
  const lastUpdated = "December 15, 2024";
  const effectiveDate = "January 1, 2025";

  const termsStructure = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing or using AuthenCore Analytics platform ('Service'), you agree to be bound by these Terms of Use ('Terms').",
        "If you disagree with any part of these terms, you may not access the Service.",
        "We reserve the right to update these Terms at any time. Continued use of the Service constitutes acceptance of revised Terms."
      ]
    },
    {
      id: "description",
      title: "2. Service Description", 
      icon: Eye,
      content: [
        "AuthenCore Analytics provides smart career analytics through professional development assessments and AI-powered skills intelligence.",
        "Our platform includes self-assessment tools, career exploration resources, and predictive analytics for workforce development.",
        "Services are provided on a subscription basis with different tiers for individuals, enterprises, and government organizations."
      ]
    },
    {
      id: "eligibility",
      title: "3. User Eligibility",
      icon: Users,
      content: [
        "You must be at least 16 years of age to use this Service.",
        "Users under 18 require parental or guardian consent.",
        "You must provide accurate, current, and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials."
      ]
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable Use Policy",
      icon: Shield,
      content: [
        "Use the Service only for lawful purposes and in accordance with these Terms.",
        "Do not attempt to gain unauthorized access to any part of the Service.",
        "Do not use the Service to transmit harmful, offensive, or illegal content.",
        "Do not reverse engineer, decompile, or attempt to extract source code from the Service.",
        "Do not share assessment results or reports without proper attribution to AuthenCore Analytics."
      ]
    },
    {
      id: "intellectual-property",
      title: "5. Intellectual Property Rights",
      icon: Lock,
      content: [
        "AuthenCore Analytics and all related trademarks, service marks, and logos are owned by AuthenCore Analytics Inc.",
        "Assessment methodologies, algorithms, and proprietary content are protected by copyright and trade secret laws.",
        "Users retain ownership of their personal data and assessment responses.",
        "Users grant us a limited license to process their data to provide the Service.",
        "Any feedback or suggestions provided to us may be used without restriction or compensation."
      ]
    },
    {
      id: "privacy-data",
      title: "6. Privacy and Data Protection",
      icon: Eye,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for detailed information.",
        "We collect and process personal data in accordance with applicable privacy laws including GDPR and CCPA.",
        "Assessment data is encrypted and stored securely using industry-standard protocols.",
        "We do not sell or share personal data with third parties for marketing purposes.",
        "Users have the right to access, correct, or delete their personal data."
      ]
    },
    {
      id: "payment-billing",
      title: "7. Payment and Billing",
      icon: Scale,
      content: [
        "Subscription fees are charged in advance on a recurring basis (monthly or annually).",
        "All fees are non-refundable except as required by law or as specified in our Refund Policy.",
        "We reserve the right to change subscription prices with 30 days advance notice.",
        "Failure to pay fees may result in suspension or termination of your account.",
        "Enterprise customers may have custom billing arrangements as specified in separate agreements."
      ]
    },
    {
      id: "disclaimers",
      title: "8. Disclaimers and Limitations",
      icon: AlertTriangle,
      content: [
        "Assessment results are for informational and developmental purposes only.",
        "Results should not be used as the sole basis for employment, educational, or life decisions.",
        "We do not guarantee the accuracy, completeness, or reliability of assessment results.",
        "The Service is provided 'as is' without warranties of any kind.",
        "We are not liable for decisions made based on assessment results or platform recommendations."
      ]
    },
    {
      id: "termination",
      title: "9. Account Termination",
      icon: Clock,
      content: [
        "You may terminate your account at any time through your account settings.",
        "We may suspend or terminate accounts for violation of these Terms.",
        "Upon termination, your access to the Service will cease immediately.",
        "We may retain certain data as required by law or for legitimate business purposes.",
        "Termination does not relieve you of any obligations incurred prior to termination."
      ]
    },
    {
      id: "governing-law",
      title: "10. Governing Law and Disputes",
      icon: Scale,
      content: [
        "These Terms are governed by the laws of the State of Delaware, United States.",
        "Any disputes arising from these Terms or the Service will be resolved through binding arbitration.",
        "Arbitration will be conducted under the rules of the American Arbitration Association.",
        "You waive any right to participate in class action lawsuits against AuthenCore Analytics.",
        "Nothing in these Terms prevents us from seeking injunctive relief in court."
      ]
    }
  ];

  return (
    <>
      <SEOHead 
        title="Terms of Use | AuthenCore Analytics"
        description="Terms of Use for AuthenCore Analytics smart career analytics platform. Understand your rights and responsibilities when using our professional development and AI-powered skills intelligence services."
        keywords="terms of use, terms of service, legal agreement, AuthenCore Analytics, user agreement, service terms"
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
                Terms of Use
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Legal terms and conditions governing your use of AuthenCore Analytics platform
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">Last Updated: {lastUpdated}</Badge>
                <Badge variant="secondary">Effective: {effectiveDate}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Introduction */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Scale className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Welcome to AuthenCore Analytics
                  </h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    These Terms of Use constitute a legally binding agreement between you and AuthenCore Analytics Inc. 
                    regarding your access to and use of our smart career analytics platform. Please read these terms 
                    carefully before using our services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Terms Sections */}
          <div className="space-y-8">
            {termsStructure.map((section, index) => (
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

          {/* Contact Information */}
          <section className="mt-16">
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Questions About These Terms?
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    If you have any questions about these Terms of Use, please contact our legal team. 
                    We're committed to transparency and helping you understand your rights and obligations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="p-4 bg-background rounded-lg border">
                      <h3 className="font-semibold text-foreground mb-2">Legal Inquiries</h3>
                      <p className="text-sm text-muted-foreground">legal@authencore.com</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border">
                      <h3 className="font-semibold text-foreground mb-2">General Support</h3>
                      <p className="text-sm text-muted-foreground">support@authencore.com</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>AuthenCore Analytics Inc.</p>
                    <p>123 Analytics Boulevard, Suite 100</p>
                    <p>San Francisco, CA 94105, United States</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Updates Notice */}
          <section className="mt-8">
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Important Notice About Updates
                    </h3>
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      We may update these Terms of Use from time to time. When we make material changes, 
                      we will notify you by email or through the platform. Your continued use of AuthenCore Analytics 
                      after such changes constitutes acceptance of the new terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;