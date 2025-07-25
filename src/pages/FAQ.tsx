import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, BookOpen, Users, Settings, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              FAQ & Platform Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive information about our assessment platform, frequently asked questions, 
              and downloadable resources to help you get the most out of AuthenCore Analytics.
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
                    Learn about AuthenCore Analytics and our comprehensive assessment suite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="what-is-authencore">
                      <AccordionTrigger>What is AuthenCore Analytics?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore Analytics is a professional psychological assessment platform offering 10 scientifically validated assessments for individuals, employers, and partners.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <h4 className="font-semibold mb-2">For Individuals</h4>
                              <p className="text-sm text-muted-foreground">Comprehensive career discovery, personality insights, and personal development recommendations.</p>
                            </div>
                            <div className="p-4 bg-secondary/5 rounded-lg">
                              <h4 className="font-semibold mb-2">For Organizations</h4>
                              <p className="text-sm text-muted-foreground">Advanced talent assessment, team compatibility analysis, and leadership development tools.</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="mission">
                      <AccordionTrigger>Our Mission & Approach</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="font-medium text-primary">"Measuring Minds. Shaping Futures."</p>
                          <p>We combine cutting-edge psychometric science with advanced AI technology to provide:</p>
                          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Scientifically validated assessment instruments</li>
                            <li>Advanced validity detection and quality assurance</li>
                            <li>Personalized insights and development recommendations</li>
                            <li>Professional-grade reporting and analytics</li>
                            <li>Ethical and culturally sensitive assessment practices</li>
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
                          <p>We offer 10 comprehensive assessments covering different aspects of personality, career, and workplace dynamics:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">CareerLaunch Assessment</h5>
                              <p className="text-sm text-muted-foreground">$9.99 • Career discovery and planning</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">CAIR+ Personality</h5>
                              <p className="text-sm text-muted-foreground">$29.99 • Advanced personality analysis</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Stress Resilience</h5>
                              <p className="text-sm text-muted-foreground">$19.99 • Burnout prevention</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Cultural Intelligence</h5>
                              <p className="text-sm text-muted-foreground">$19.99 • Global workplace readiness</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">Communication Styles</h5>
                              <p className="text-sm text-muted-foreground">$24.99 • Communication analysis</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">+ 5 More Assessments</h5>
                              <p className="text-sm text-muted-foreground">Leadership, EQ, Digital Wellness, etc.</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="how-long">
                      <AccordionTrigger>How long do assessments take?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Assessment duration varies by type and complexity:</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Quick Assessments</span>
                              <Badge variant="outline">15-25 minutes</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Standard Assessments</span>
                              <Badge variant="outline">25-35 minutes</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">Comprehensive Assessments</span>
                              <Badge variant="outline">35-50 minutes</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            All assessments can be paused and resumed within 24 hours of starting.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reports">
                      <AccordionTrigger>What do I receive after completing an assessment?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Upon completion, you receive a comprehensive report package:</p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Interactive online results with detailed explanations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Professional PDF report (10-25 pages)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Personalized development recommendations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Percentile rankings and score interpretations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">Career/workplace application insights</span>
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
                                <li>• Chrome (recommended)</li>
                                <li>• Firefox</li>
                                <li>• Safari</li>
                                <li>• Edge</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium">Device Requirements</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Stable internet connection</li>
                                <li>• Modern smartphone/tablet/computer</li>
                                <li>• JavaScript enabled</li>
                                <li>• Cookies enabled</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="support">
                      <AccordionTrigger>How can I get help or support?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>We offer multiple support channels to assist you:</p>
                          <div className="space-y-3">
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">Email Support</h5>
                              <p className="text-sm text-muted-foreground">
                                Contact us at <a href="mailto:contact@authencore.org" className="text-primary hover:underline">contact@authencore.org</a> for any questions or issues.
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">Documentation</h5>
                              <p className="text-sm text-muted-foreground">
                                Comprehensive guides and documentation available in our download section.
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">Response Time</h5>
                              <p className="text-sm text-muted-foreground">
                                We typically respond to support requests within 24 hours during business days.
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Quick Links & Downloads */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/assessment">
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      View All Assessments
                    </Button>
                  </Link>
                  <Link to="/sample-reports">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Sample Reports
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      About Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Downloads Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Downloads & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Access professional documentation, marketing materials, and assessment guides.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Assessment Guides</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        Comprehensive guides for each assessment type
                      </p>
                      <Link to="/marketing-materials">
                        <Button size="sm" variant="outline" className="w-full">
                          Access Guides
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Marketing Materials</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        Professional brochures and promotional content
                      </p>
                      <Link to="/marketing-materials">
                        <Button size="sm" variant="outline" className="w-full">
                          Download Materials
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">Technical Documentation</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        API documentation and integration guides
                      </p>
                      <Link to="/marketing-materials">
                        <Button size="sm" variant="outline" className="w-full">
                          View Documentation
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      Need something specific?
                    </p>
                    <a href="mailto:contact@authencore.org">
                      <Button size="sm" className="w-full">
                        Contact Support
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • Privacy & Data Security
                  </Link>
                  <Link to="/sample-reports" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • Sample Assessment Reports
                  </Link>
                  <Link to="/assessment" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • Assessment Pricing
                  </Link>
                  <a href="mailto:contact@authencore.org" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • Business Partnerships
                  </a>
                  <Link to="/marketing-materials" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • Employer Solutions
                  </Link>
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