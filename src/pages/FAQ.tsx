import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, BookOpen, Users, Settings, HelpCircle, FileText, CheckCircle, Building2, TrendingUp, Shield, Briefcase, Globe, Target, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our assessments, platform features, and business solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main FAQ Section */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Platform Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Platform Overview
                  </CardTitle>
                  <CardDescription>
                    Understanding AuthenCore and our mission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="what-is-authencore">
                      <AccordionTrigger>What is AuthenCore Analytics?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore Analytics is a comprehensive psychometric assessment platform that helps individuals and organizations make data-driven decisions about career development, hiring, and team building.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <h4 className="font-semibold mb-2">For Individuals</h4>
                              <p className="text-sm text-muted-foreground">Discover your strengths, career fit, and development opportunities through scientifically validated assessments.</p>
                            </div>
                            <div className="p-4 bg-secondary/5 rounded-lg">
                              <h4 className="font-semibold mb-2">For Organizations</h4>
                              <p className="text-sm text-muted-foreground">Reduce hiring risks, improve team performance, and make objective talent decisions with our enterprise solutions.</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="mission">
                      <AccordionTrigger>What is your mission and vision?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="font-medium text-primary">"Empowering authentic career decisions through validated psychological insights"</p>
                          <p>We believe everyone deserves to find work that aligns with their authentic self. Our mission is to provide scientifically rigorous yet accessible assessment tools that help people understand themselves and organizations build better teams.</p>
                          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Scientifically validated assessment instruments</li>
                            <li>Advanced validity detection and bias prevention</li>
                            <li>Personalized insights and development recommendations</li>
                            <li>Professional-grade reporting and analytics</li>
                            <li>Ethical assessment practices and data protection</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Assessment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Assessment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="assessment-types">
                      <AccordionTrigger>What types of assessments do you offer?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>We offer 10 specialized assessments designed for different aspects of career and personal development:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Career Launch Assessment</h5>
                              <p className="text-sm text-muted-foreground">Comprehensive career readiness and potential evaluation</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">CAIR Personality Assessment</h5>
                              <p className="text-sm text-muted-foreground">Core personality traits for workplace effectiveness</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Stress Resilience Assessment</h5>
                              <p className="text-sm text-muted-foreground">Ability to handle pressure and bounce back from setbacks</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Cultural Intelligence Assessment</h5>
                              <p className="text-sm text-muted-foreground">Skills for working effectively across cultures</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Communication Styles Assessment</h5>
                              <p className="text-sm text-muted-foreground">How you communicate and collaborate with others</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Emotional Intelligence Assessment</h5>
                              <p className="text-sm text-muted-foreground">Understanding and managing emotions effectively</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Authentic Leadership Assessment</h5>
                              <p className="text-sm text-muted-foreground">Leadership style and potential evaluation</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Digital Wellness Assessment</h5>
                              <p className="text-sm text-muted-foreground">Healthy technology use and digital balance</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Faith & Values Assessment</h5>
                              <p className="text-sm text-muted-foreground">Alignment between personal values and career choices</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Gen Z Workplace Assessment</h5>
                              <p className="text-sm text-muted-foreground">Modern workplace preferences and expectations</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="how-long">
                      <AccordionTrigger>How long do assessments take to complete?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Assessment duration varies by complexity and depth of analysis:</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Quick Assessments</span>
                              <Badge variant="outline">15-25 minutes</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Standard Assessments</span>
                              <Badge variant="outline">25-40 minutes</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Comprehensive Assessments</span>
                              <Badge variant="outline">45-60 minutes</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            You can pause and resume most assessments, but we recommend completing them in one session for the most accurate results.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="how-to-take">
                      <AccordionTrigger>How do I take an assessment?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Taking an assessment is simple and straightforward:</p>
                          <ol className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                              <span>Create a free account or log in to your existing account</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                              <span>Choose the assessment that fits your needs</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                              <span>Answer questions honestly - there are no right or wrong answers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                              <span>Receive your detailed report immediately upon completion</span>
                            </li>
                          </ol>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Important Tips</h5>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• Answer based on your natural tendencies, not what you think is expected</li>
                              <li>• Find a quiet environment without distractions</li>
                              <li>• Don't overthink your responses - your first instinct is usually most accurate</li>
                              <li>• Ensure stable internet connection before starting</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reports">
                      <AccordionTrigger>What do I receive in my assessment report?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Each assessment provides a comprehensive, personalized report including:</p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Detailed results with visual charts and graphs</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Professional PDF report for sharing or printing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Personalized development recommendations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Percentile rankings compared to similar professionals</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Career insights and role recommendations</span>
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Technical Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Technical Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="technical-requirements">
                      <AccordionTrigger>What are the technical requirements?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Our platform works on all modern devices and browsers:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="font-medium">Supported Browsers</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Chrome 90+ (recommended)</li>
                                <li>• Firefox 88+</li>
                                <li>• Safari 14+</li>
                                <li>• Edge 90+</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium">Device Requirements</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Stable internet connection</li>
                                <li>• Modern smartphone, tablet, or computer</li>
                                <li>• JavaScript enabled</li>
                                <li>• Cookies enabled</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="support">
                      <AccordionTrigger>How can I get technical support?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>We offer comprehensive support through multiple channels:</p>
                          <div className="space-y-3">
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">📧 Email Support</h5>
                              <p className="text-sm text-muted-foreground">support@authencore.com - Response within 24 hours</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">💬 Live Chat</h5>
                              <p className="text-sm text-muted-foreground">Available Monday-Friday, 9 AM - 6 PM EST</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">📚 Help Center</h5>
                              <p className="text-sm text-muted-foreground">Comprehensive guides and troubleshooting articles</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="troubleshooting">
                      <AccordionTrigger>Common Issues & Solutions</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                              <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">Assessment Won't Load</h5>
                              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                                <li>• Clear your browser cache and cookies</li>
                                <li>• Disable browser extensions temporarily</li>
                                <li>• Try incognito/private browsing mode</li>
                                <li>• Check your internet connection</li>
                              </ul>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Progress Not Saving</h5>
                              <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                                <li>• Ensure cookies are enabled in your browser</li>
                                <li>• Don't use private/incognito mode for assessments</li>
                                <li>• Complete assessments in one session when possible</li>
                                <li>• Contact support if you lose significant progress</li>
                              </ul>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Report Not Generating</h5>
                              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Wait 2-3 minutes after completing assessment</li>
                                <li>• Refresh the page if report doesn't appear</li>
                                <li>• Check your spam folder for email reports</li>
                                <li>• Ensure pop-up blockers aren't preventing downloads</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Data Privacy & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Data Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    How we protect your data and ensure privacy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="data-security">
                      <AccordionTrigger>How is my data protected?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>We employ industry-leading security measures to protect your information:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h5 className="font-medium">Technical Security</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• 256-bit SSL encryption</li>
                                <li>• Secure cloud infrastructure</li>
                                <li>• Regular security audits</li>
                                <li>• Multi-factor authentication</li>
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h5 className="font-medium">Compliance Standards</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• GDPR compliant</li>
                                <li>• CCPA compliant</li>
                                <li>• SOC 2 Type II certified</li>
                                <li>• ISO 27001 standards</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="data-sharing">
                      <AccordionTrigger>Do you share my data with third parties?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="font-medium text-green-700 dark:text-green-300">No, we never sell or share your personal assessment data.</p>
                          <p>We only share data in these specific circumstances:</p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">With your explicit consent (e.g., sharing results with your employer)</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">With service providers under strict data processing agreements</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">When required by law or to protect our legal rights</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Anonymized data for research and platform improvement</span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="data-deletion">
                      <AccordionTrigger>How can I delete my data?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>You have full control over your data and can request deletion at any time:</p>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Self-Service Options</h5>
                              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Delete individual assessment results from your dashboard</li>
                                <li>• Update or remove personal information in account settings</li>
                                <li>• Download your data before deletion (data portability)</li>
                              </ul>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                              <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">Complete Account Deletion</h5>
                              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                                <li>• Email privacy@authencore.com with deletion request</li>
                                <li>• All data permanently deleted within 30 days</li>
                                <li>• Confirmation email sent when process is complete</li>
                                <li>• Some data may be retained for legal compliance</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Business Solutions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Business Solutions
                  </CardTitle>
                  <CardDescription>
                    Enterprise features for organizations and HR teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="enterprise-features">
                      <AccordionTrigger>What enterprise features are available?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Our enterprise solutions include comprehensive features for large organizations:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h5 className="font-medium">Assessment Management</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Bulk candidate invitations</li>
                                <li>• Custom assessment batteries</li>
                                <li>• Automated reminder systems</li>
                                <li>• Progress tracking dashboards</li>
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h5 className="font-medium">Advanced Analytics</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Aggregate team insights</li>
                                <li>• Predictive analytics</li>
                                <li>• Custom reporting templates</li>
                                <li>• Bias detection monitoring</li>
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h5 className="font-medium">Integration & API</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• HRIS system integration</li>
                                <li>• ATS connector plugins</li>
                                <li>• Custom API endpoints</li>
                                <li>• Single sign-on (SSO)</li>
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h5 className="font-medium">Support & Training</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Dedicated account manager</li>
                                <li>• Training workshops</li>
                                <li>• Implementation support</li>
                                <li>• Priority technical support</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="pricing-business">
                      <AccordionTrigger>What are your business pricing options?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>We offer flexible pricing models to suit organizations of all sizes:</p>
                          <div className="space-y-3">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <h5 className="font-medium">Per-Assessment Pricing</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Pay as you go, perfect for smaller teams</p>
                              <ul className="text-sm space-y-1">
                                <li>• $15-45 per individual assessment</li>
                                <li>• Volume discounts start at 25+ assessments</li>
                                <li>• No monthly commitments</li>
                                <li>• Access to standard reporting</li>
                              </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-4 w-4 text-green-600" />
                                <h5 className="font-medium">Enterprise Subscriptions</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Monthly/annual plans for regular usage</p>
                              <ul className="text-sm space-y-1">
                                <li>• Unlimited assessments within plan limits</li>
                                <li>• Advanced analytics and reporting</li>
                                <li>• API access and integrations</li>
                                <li>• Dedicated support team</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="implementation">
                      <AccordionTrigger>How long does implementation take?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Implementation timelines vary based on complexity:</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <div>
                                <span className="font-medium">Basic Setup (50-200 employees)</span>
                                <p className="text-sm text-muted-foreground">Standard assessments, basic reporting</p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                1-2 weeks
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <div>
                                <span className="font-medium">Enterprise Setup (200-1000 employees)</span>
                                <p className="text-sm text-muted-foreground">Custom workflows, API integration</p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                3-4 weeks
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <div>
                                <span className="font-medium">Complex Enterprise (1000+ employees)</span>
                                <p className="text-sm text-muted-foreground">Multi-location, white-label, full customization</p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                6-8 weeks
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/assessments">
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Take an Assessment
                    </Button>
                  </Link>
                  <Link to="/sample-reports">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      View Sample Reports
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      About AuthenCore
                    </Button>
                  </Link>
                  <a href="mailto:support@authencore.com">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Popular Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Assessment Types</Badge>
                    <Badge variant="secondary">Pricing</Badge>
                    <Badge variant="secondary">Data Security</Badge>
                    <Badge variant="secondary">Business Solutions</Badge>
                    <Badge variant="secondary">Technical Support</Badge>
                    <Badge variant="secondary">Implementation</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Still Need Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Still Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <div className="space-y-2">
                    <a href="mailto:support@authencore.com">
                      <Button className="w-full">Contact Support</Button>
                    </a>
                    <a href="mailto:sales@authencore.com">
                      <Button variant="outline" className="w-full">Talk to Sales</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQ;