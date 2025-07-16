import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGenerator from "@/components/ImageGenerator";
import { PartnerManagement } from "@/components/PartnerManagement";
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
                Manage partner access and generate custom AI images
              </p>
            </div>

            <Tabs defaultValue="partners" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="partners">Partner Management</TabsTrigger>
                <TabsTrigger value="images">Image Generator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="partners" className="mt-6">
                <PartnerManagement />
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