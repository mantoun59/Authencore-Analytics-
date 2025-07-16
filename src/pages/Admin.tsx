import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageGenerator from "@/components/ImageGenerator";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Site Administration</h1>
            <p className="text-lg text-muted-foreground">
              Generate custom AI images for your professional assessment platform
            </p>
          </div>

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

              <div className="p-6 bg-card rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Current Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-full h-24 bg-muted rounded-lg mb-2 flex items-center justify-center text-xs text-muted-foreground">
                      Hero Section
                    </div>
                    <p className="text-xs text-muted-foreground">Professional Team</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-24 bg-muted rounded-lg mb-2 flex items-center justify-center text-xs text-muted-foreground">
                      About Page
                    </div>
                    <p className="text-xs text-muted-foreground">Consultation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-24 bg-muted rounded-lg mb-2 flex items-center justify-center text-xs text-muted-foreground">
                      How It Works
                    </div>
                    <p className="text-xs text-muted-foreground">Business Analytics</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-24 bg-muted rounded-lg mb-2 flex items-center justify-center text-xs text-muted-foreground">
                      Testimonials
                    </div>
                    <p className="text-xs text-muted-foreground">Modern Office</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;