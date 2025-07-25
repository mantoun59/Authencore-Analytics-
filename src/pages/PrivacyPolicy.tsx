import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <CardDescription>
                Authencore Analytics - Effective Date: {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Welcome to Authencore Analytics ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our assessment platform and services available at www.authencore.org.
                </p>
                <p className="text-muted-foreground">
                  Our mission is "Measuring Minds. Shaping Futures." We take this responsibility seriously and are committed to maintaining the confidentiality and security of your personal information.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium mb-3">Personal Information</h3>
                <p className="text-muted-foreground mb-4">
                  We collect personal information that you voluntarily provide when using our assessment services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li>Name, age, email address, and contact information</li>
                  <li>Professional information (organization, position, experience level)</li>
                  <li>Assessment responses and behavioral data</li>
                  <li>Account credentials and preferences</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">Technical Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Browser type, IP address, and device information</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Performance metrics and analytics data</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide personalized assessment services and generate reports</li>
                  <li>Analyze and improve our assessment methodologies</li>
                  <li>Communicate with you about your assessments and our services</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Conduct research and analytics to enhance our services</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                  <li><strong>Service Providers:</strong> Trusted third-party providers who assist in our operations</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>Organizational Reports:</strong> Aggregate data may be shared with your organization (without identifying individuals)</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Staff training on data protection procedures</li>
                  <li>Incident response and breach notification procedures</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a structured format</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Assessment data may be retained for research and validation purposes in aggregated, anonymized form.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. International Transfers</h2>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your personal information in accordance with this Privacy Policy and applicable laws.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Effective Date" at the top of this policy. Your continued use of our services after any changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">Authencore Analytics</p>
                  <p className="text-muted-foreground">Website: www.authencore.org</p>
                  <p className="text-muted-foreground">Email: privacy@authencore.org</p>
                  <p className="text-muted-foreground mt-2">
                    Data Protection Officer: Contact us through the above channels for data protection inquiries.
                  </p>
                </div>
              </section>

              <Separator />

              <section id="gdpr">
                <h2 className="text-2xl font-semibold mb-4">GDPR Compliance</h2>
                <p className="text-muted-foreground mb-4">
                  We are committed to compliance with the General Data Protection Regulation (GDPR) and your rights as a data subject:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Right to Access:</strong> You can request information about personal data we process</li>
                  <li><strong>Right to Rectification:</strong> You can request correction of inaccurate personal data</li>
                  <li><strong>Right to Erasure:</strong> You can request deletion of your personal data under certain conditions</li>
                  <li><strong>Right to Portability:</strong> You can receive your data in a structured, machine-readable format</li>
                  <li><strong>Right to Object:</strong> You can object to processing based on legitimate interests</li>
                  <li><strong>Right to Restriction:</strong> You can request limiting processing of your data</li>
                </ul>
                <p className="text-muted-foreground">
                  To exercise these rights, please contact us at contact@authencore.org. We will respond within 30 days.
                </p>
              </section>

              <Separator />

              <section id="security">
                <h2 className="text-2xl font-semibold mb-4">Data Security Standards</h2>
                <p className="text-muted-foreground mb-4">
                  We implement industry-leading security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using AES-256 encryption</li>
                  <li><strong>Access Controls:</strong> Multi-factor authentication and role-based access controls</li>
                  <li><strong>Infrastructure:</strong> Secure cloud infrastructure with regular security audits</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response procedures</li>
                  <li><strong>Compliance:</strong> Regular compliance assessments and security certifications</li>
                  <li><strong>Staff Training:</strong> Comprehensive security training for all personnel</li>
                </ul>
              </section>

              <Separator />

              <section id="ethics">
                <h2 className="text-2xl font-semibold mb-4">Assessment Ethics</h2>
                <p className="text-muted-foreground mb-4">
                  Our assessments are developed and administered according to the highest ethical standards:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Scientific Validity:</strong> All assessments are based on peer-reviewed research</li>
                  <li><strong>Cultural Sensitivity:</strong> Assessments are designed to minimize cultural bias</li>
                  <li><strong>Fair Testing:</strong> Equal opportunity testing practices for all individuals</li>
                  <li><strong>Professional Standards:</strong> Compliance with APA and other professional guidelines</li>
                  <li><strong>Transparency:</strong> Clear communication about assessment purposes and limitations</li>
                  <li><strong>Informed Consent:</strong> Participants understand what they're agreeing to</li>
                </ul>
              </section>

              <Separator />

              <section id="assessment-integrity">
                <h2 className="text-2xl font-semibold mb-4">Assessment Integrity</h2>
                <p className="text-muted-foreground mb-4">
                  We maintain the highest standards of assessment integrity and security:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Validity Detection:</strong> Advanced algorithms detect invalid response patterns</li>
                  <li><strong>Secure Delivery:</strong> Protected assessment delivery prevents unauthorized access</li>
                  <li><strong>Anti-Cheating:</strong> Multiple safeguards prevent assessment manipulation</li>
                  <li><strong>Quality Assurance:</strong> Continuous monitoring of assessment quality and reliability</li>
                  <li><strong>Professional Use:</strong> Assessments used only by qualified professionals</li>
                  <li><strong>Confidentiality:</strong> Assessment content and results are strictly confidential</li>
                </ul>
              </section>

              <Separator />

              <section id="terms">
                <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
                <p className="text-muted-foreground mb-4">
                  By using our services, you agree to the following terms and conditions:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Acceptable Use:</strong> Use services only for legitimate assessment purposes</li>
                  <li><strong>Account Security:</strong> Maintain confidentiality of your account credentials</li>
                  <li><strong>Intellectual Property:</strong> All assessment content is proprietary and protected</li>
                  <li><strong>Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee continuous service</li>
                  <li><strong>Limitation of Liability:</strong> Our liability is limited to the cost of services purchased</li>
                  <li><strong>Termination:</strong> We reserve the right to terminate accounts for violations of terms</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  For questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> contact@authencore.org</p>
                  <p><strong>Website:</strong> www.authencore.org</p>
                  <p><strong>Data Protection Officer:</strong> Available upon request</p>
                </div>
              </section>

            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;