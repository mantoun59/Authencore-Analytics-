import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  const popularPages = [
    { name: "Assessments", path: "/assessment", icon: Search },
    { name: "Career Launch", path: "/career-launch", icon: Search },
    { name: "About Us", path: "/about", icon: HelpCircle },
    { name: "Authentication", path: "/auth", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-lg text-muted-foreground mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Requested path: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Pages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {popularPages.map((page) => {
                    const IconComponent = page.icon;
                    return (
                      <Link
                        key={page.path}
                        to={page.path}
                        className="flex items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <IconComponent className="w-4 h-4 mr-3 text-primary" />
                        <span className="text-sm font-medium">{page.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
