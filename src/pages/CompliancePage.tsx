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
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Compliance & Security</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive regulatory compliance and security standards for talent assessment
            </p>
          </div>

          <div className="grid gap-8">
            
            {/* Regulatory Compliance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Regulatory Compliance Overview
                </CardTitle>
                <CardDescription>
                  AuthenCore Analytics adheres to the highest standards of regulatory compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">GDPR</Badge>
                      <span className="text-sm">EU General Data Protection Regulation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">CCPA</Badge>
                      <span className="text-sm">California Consumer Privacy Act</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">SOC 2</Badge>
                      <span className="text-sm">Service Organization Control 2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">ISO 27001</Badge>
                      <span className="text-sm">Information Security Management</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">HIPAA</Badge>
                      <span className="text-sm">Health Insurance Portability Act</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">APA</Badge>
                      <span className="text-sm">American Psychological Association</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">EEO</Badge>
                      <span className="text-sm">Equal Employment Opportunity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">FERPA</Badge>
                      <span className="text-sm">Family Educational Rights Privacy Act</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  Data Protection & Privacy Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">GDPR Compliance Framework</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Lawful Basis:</strong> Processing based on legitimate interest and consent</li>
                    <li>• <strong>Data Subject Rights:</strong> Access, rectification, erasure, portability, and objection</li>
                    <li>• <strong>Privacy by Design:</strong> Data protection integrated into system architecture</li>
                    <li>• <strong>Data Protection Officer:</strong> Designated DPO for EU operations</li>
                    <li>• <strong>Breach Notification:</strong> 72-hour notification protocol to supervisory authorities</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">CCPA Compliance Measures</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Right to Know:</strong> Transparent disclosure of data collection practices</li>
                    <li>• <strong>Right to Delete:</strong> Secure deletion of personal information upon request</li>
                    <li>• <strong>Right to Opt-Out:</strong> Mechanism to opt-out of data sale (we don't sell data)</li>
                    <li>• <strong>Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                    <li>• <strong>Consumer Request Portal:</strong> Dedicated system for privacy requests</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Security & Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  Security & Infrastructure Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">SOC 2 Type II Certification</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Security Controls</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Multi-factor authentication</li>
                        <li>• Access control matrices</li>
                        <li>• Vulnerability management</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Availability Controls</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 99.9% uptime guarantee</li>
                        <li>• Redundant infrastructure</li>
                        <li>• Disaster recovery plan</li>
                        <li>• Business continuity protocols</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">ISO 27001 Implementation</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Information Security Management System (ISMS):</strong> Systematic approach to managing sensitive data</li>
                    <li>• <strong>Risk Assessment:</strong> Regular evaluation of security risks and controls</li>
                    <li>• <strong>Continuous Monitoring:</strong> Real-time security monitoring and alerting</li>
                    <li>• <strong>Employee Training:</strong> Regular security awareness training programs</li>
                    <li>• <strong>Third-Party Security:</strong> Vendor risk assessment and management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Ethics & Standards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Assessment Ethics & Professional Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">APA Ethical Guidelines</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Informed Consent:</strong> Clear explanation of assessment purpose and procedures</li>
                    <li>• <strong>Confidentiality:</strong> Protection of test taker information and results</li>
                    <li>• <strong>Competence:</strong> Qualified professionals oversee assessment development</li>
                    <li>• <strong>Fairness:</strong> Bias-free assessment design and implementation</li>
                    <li>• <strong>Responsibility:</strong> Ethical use of assessment results and recommendations</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Equal Employment Opportunity Compliance</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Adverse Impact Analysis:</strong> Regular monitoring for discriminatory effects</li>
                    <li>• <strong>Validation Studies:</strong> Scientific validation of assessment instruments</li>
                    <li>• <strong>Reasonable Accommodations:</strong> Accessibility features for diverse populations</li>
                    <li>• <strong>Documentation:</strong> Comprehensive record-keeping for compliance audits</li>
                    <li>• <strong>Training:</strong> Fair employment practices training for all staff</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* International Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  International Compliance Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">European Union</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• GDPR Article 6 lawful basis</li>
                      <li>• Data Protection Impact Assessments</li>
                      <li>• Standard Contractual Clauses</li>
                      <li>• EU-US Privacy Shield compliance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">United States</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• CCPA consumer rights</li>
                      <li>• HIPAA privacy rule adherence</li>
                      <li>• FERPA educational records protection</li>
                      <li>• State-specific privacy laws</li>
                    </ul>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Asia-Pacific Region</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Australia:</strong> Privacy Act 1988 compliance</li>
                    <li>• <strong>Canada:</strong> Personal Information Protection and Electronic Documents Act</li>
                    <li>• <strong>Singapore:</strong> Personal Data Protection Act</li>
                    <li>• <strong>Japan:</strong> Act on Protection of Personal Information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Incident Response & Reporting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Incident Response & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Breach Response Protocol</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">72hrs</div>
                      <div className="text-sm">Regulatory notification timeline</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                      <div className="text-sm">Security monitoring coverage</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">30min</div>
                      <div className="text-sm">Incident response activation</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Compliance Reporting</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Annual Compliance Reports:</strong> Comprehensive review of regulatory adherence</li>
                    <li>• <strong>Audit Trails:</strong> Detailed logging of all system access and data processing</li>
                    <li>• <strong>Regulatory Updates:</strong> Continuous monitoring of changing compliance requirements</li>
                    <li>• <strong>Stakeholder Communication:</strong> Regular updates to clients and partners</li>
                    <li>• <strong>Remediation Tracking:</strong> Documentation of corrective actions and improvements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Compliance Contact & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Compliance Team</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Data Protection Officer:</strong> dpo@authencore.org</p>
                      <p><strong>Compliance Officer:</strong> compliance@authencore.org</p>
                      <p><strong>Security Team:</strong> security@authencore.org</p>
                      <p><strong>Legal Department:</strong> legal@authencore.org</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Request Types</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>• Data Subject Access Requests</p>
                      <p>• Compliance Inquiries</p>
                      <p>• Security Incident Reports</p>
                      <p>• Vendor Risk Assessments</p>
                      <p>• Audit Support</p>
                    </div>
                  </div>
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