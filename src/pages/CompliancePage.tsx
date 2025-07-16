import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileText, Globe, Users, AlertTriangle } from "lucide-react";

const CompliancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Compliance & Security</h1>
            <p className="text-xl text-muted-foreground">
              Our commitment to data protection and regulatory compliance
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Terms of Service */}
            <Card id="terms">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our Terms of Service outline the rules and regulations for using AuthenCore Analytics assessment services. 
                  Please contact us for the complete terms and conditions.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">• Professional use of assessment tools only</p>
                  <p className="text-sm">• Compliance with ethical assessment standards</p>
                  <p className="text-sm">• Protection of assessment taker confidentiality</p>
                  <p className="text-sm">• Authorized use of assessment results</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Privacy & Data Protection */}
            <Card id="gdpr">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  Privacy & Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We are committed to protecting your privacy and personal data in accordance with applicable laws and regulations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Data Protection Standards</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>• GDPR compliance for EU users</p>
                      <p>• CCPA compliance for California users</p>
                      <p>• Secure data encryption</p>
                      <p>• Limited data retention</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Your Rights</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>• Access your personal data</p>
                      <p>• Request data correction</p>
                      <p>• Request data deletion</p>
                      <p>• Data portability</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Standards */}
            <Card id="security">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Security Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We maintain industry-standard security practices to protect your data and assessment results.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">• Encrypted data transmission and storage</p>
                  <p className="text-sm">• Regular security audits and updates</p>
                  <p className="text-sm">• Access controls and authentication</p>
                  <p className="text-sm">• Incident response procedures</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Ethics */}
            <Card id="ethics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Assessment Ethics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our assessment tools are designed and administered following professional ethical guidelines.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">• Informed consent for all assessments</p>
                  <p className="text-sm">• Fair and unbiased evaluation methods</p>
                  <p className="text-sm">• Professional interpretation of results</p>
                  <p className="text-sm">• Confidential handling of assessment data</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For questions about compliance, privacy, or our terms of service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>General Inquiries:</strong> 
                    <a href="mailto:contact@authencore.org" className="text-primary hover:underline ml-1">
                      contact@authencore.org
                    </a>
                  </p>
                  <p className="text-sm">
                    <strong>Privacy Requests:</strong> 
                    <a href="mailto:privacy@authencore.org" className="text-primary hover:underline ml-1">
                      privacy@authencore.org
                    </a>
                  </p>
                  <p className="text-sm">
                    <strong>Compliance Issues:</strong> 
                    <a href="mailto:compliance@authencore.org" className="text-primary hover:underline ml-1">
                      compliance@authencore.org
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CompliancePage;