import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGenerator from "@/components/ImageGenerator";
import { PartnerManagement } from "@/components/PartnerManagement";
import AdminGuideGenerator from "@/components/AdminGuideGenerator";
import PurchaseAnalyticsDashboard from "@/components/PurchaseAnalyticsDashboard";
import SEOOptimizer from "@/components/SEOOptimizer";
import MarketingPromotion from "@/components/MarketingPromotion";
import { EnhancedAIControls } from "@/components/EnhancedAIControls";
import AdminTestingTools from "@/components/AdminTestingTools";
import AssessmentTester from "@/components/AssessmentTester";
import IntelligentAssessmentValidator from "@/components/IntelligentAssessmentValidator";
import AssessmentQualityDashboard from "@/components/AssessmentQualityDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const AdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Site Administration</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive administrative dashboard for managing partners, testing, analytics, and content generation
              </p>
            </div>

            <Tabs defaultValue="professional-standards" className="w-full">
              <TabsList className="grid w-full grid-cols-11">
                <TabsTrigger value="professional-standards">Standards</TabsTrigger>
                <TabsTrigger value="intelligent-testing">AI Testing</TabsTrigger>
                <TabsTrigger value="assessment-testing">Quick Testing</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
                <TabsTrigger value="ai-engine">AI Engine</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="purchases">Purchase Reports</TabsTrigger>
                <TabsTrigger value="seo-marketing">SEO & Marketing</TabsTrigger>
                <TabsTrigger value="setup-guide">Setup Guide</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="professional-standards" className="mt-6">
                <AssessmentQualityDashboard />
              </TabsContent>
              
              <TabsContent value="intelligent-testing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🧠 Intelligent Assessment Validation System</CardTitle>
                    <CardDescription>
                      AI-powered comprehensive testing that validates everything from A to Z: functionality, performance, security, UX, and technical implementation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IntelligentAssessmentValidator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessment-testing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Assessment Testing</CardTitle>
                    <CardDescription>
                      Fast surface-level checks for routes, components, questions, scoring, reports, payments, and logos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AssessmentTester />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="partners" className="mt-6">
                <PartnerManagement />
              </TabsContent>
              
              <TabsContent value="testing" className="mt-6">
                <div className="space-y-6">
                  {/* Admin Testing Tools */}
                  <AdminTestingTools />
                  
                  {/* Original Testing Portal */}
                  <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Testing Portal Management</h3>
                    <p className="text-muted-foreground mb-6">
                      Comprehensive testing tools for candidate assessment and management
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-primary/5 rounded-lg border hover:bg-primary/10 transition-colors">
                        <h4 className="font-semibold text-lg mb-2">Candidate Testing Portal</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Direct access portal for candidates to take assessments with guided interface
                        </p>
                        <Link 
                          to="/candidate-testing" 
                          className="inline-flex items-center text-primary hover:text-primary-glow font-medium"
                        >
                          Access Portal →
                        </Link>
                      </div>
                      
                      <div className="p-6 bg-secondary/5 rounded-lg border hover:bg-secondary/10 transition-colors">
                        <h4 className="font-semibold text-lg mb-2">Testing Dashboard</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Monitor and manage ongoing assessments, view real-time progress and results
                        </p>
                        <Link 
                          to="/testing-dashboard" 
                          className="inline-flex items-center text-primary hover:text-primary-glow font-medium"
                        >
                          Open Dashboard →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-engine" className="mt-6">
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Enhanced AI Analysis Engine</h3>
                    <p className="text-muted-foreground mb-6">
                      Configure and manage the advanced AI engine for enhanced report generation, 
                      intelligent interview questions, and sophisticated distortion scale analysis.
                    </p>
                    <EnhancedAIControls />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-6">
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Link to="/admin-analytics" className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <h4 className="font-medium">Comprehensive Analytics</h4>
                        <p className="text-sm text-muted-foreground">View detailed analytics and reports across all assessments</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="purchases" className="mt-6">
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Purchase Analytics & Notifications</h3>
                    <p className="text-muted-foreground mb-6">
                      Track purchase data, view analytics, and manage automated email reports
                    </p>
                    <PurchaseAnalyticsDashboard />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="seo-marketing" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO & Marketing Integration Hub</CardTitle>
                      <CardDescription>
                        Optimize your search presence and create professional marketing materials
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Button asChild variant="outline">
                          <Link to="/admin-marketing-materials">
                            📄 Admin Marketing Materials
                          </Link>
                        </Button>
                        <Button asChild variant="outline">
                          <Link to="/sample-reports">
                            📊 Sample Reports
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <SEOOptimizer />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Marketing Materials</CardTitle>
                      <CardDescription>
                        Professional brochures and marketing content
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MarketingPromotion />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="setup-guide" className="mt-6">
                <AdminGuideGenerator />
              </TabsContent>
              
              <TabsContent value="images" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ImageGenerator />
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-card rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4">Image Guidelines</h3>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p><strong>Professional Business:</strong> Use prompts like "professional team meeting", "modern office consultation", "business analytics dashboard"</p>
                        <p><strong>Assessment Themes:</strong> "psychological assessment illustration", "personality test visualization", "professional evaluation tools"</p>
                        <p><strong>Corporate Style:</strong> Always mention "clean, modern, corporate style" in your prompts</p>
                        <p><strong>Size:</strong> Images are generated at 1024x1024 for high quality</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default AdminPage;