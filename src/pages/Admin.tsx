import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGenerator from "@/components/ImageGenerator";
import { PartnerManagement } from "@/components/PartnerManagement";
import AdminGuideGenerator from "@/components/AdminGuideGenerator";
import { EnhancedAIControls } from "@/components/EnhancedAIControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

const AdminPage = () => {
  return (
    <ProtectedAdminRoute>
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

            <Tabs defaultValue="partners" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="partners">Partner Management</TabsTrigger>
                <TabsTrigger value="testing">Testing Portal</TabsTrigger>
                <TabsTrigger value="ai-engine">AI Engine</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="setup-guide">Setup Guide</TabsTrigger>
                <TabsTrigger value="images">Image Generator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="partners" className="mt-6">
                <PartnerManagement />
              </TabsContent>
              
              <TabsContent value="testing" className="mt-6">
                <div className="space-y-6">
                  <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Testing Portal Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="/candidate-testing" className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <h4 className="font-medium">Candidate Testing Portal</h4>
                        <p className="text-sm text-muted-foreground">Direct access for candidates to take assessments</p>
                      </a>
                      <a href="/testing-dashboard" className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <h4 className="font-medium">Testing Dashboard</h4>
                        <p className="text-sm text-muted-foreground">Monitor and manage ongoing assessments</p>
                      </a>
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
                      <a href="/admin-analytics" className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <h4 className="font-medium">Comprehensive Analytics</h4>
                        <p className="text-sm text-muted-foreground">View detailed analytics and reports across all assessments</p>
                      </a>
                    </div>
                  </div>
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
    </ProtectedAdminRoute>
  );
};

export default AdminPage;