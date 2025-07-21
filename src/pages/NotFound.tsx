import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
          <p className="text-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-colors font-medium inline-block">
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
