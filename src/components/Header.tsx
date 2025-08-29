import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoDisplay from "@/components/LogoDisplay";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between h-20 px-4">
        {/* Logo and Sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-foreground" />
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <LogoDisplay size="md" showTagline={true} className="text-left" />
          </Link>
        </div>

        {/* Auth section */}
        <div className="flex items-center space-x-3">
          {loading ? (
            <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile"
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
              >
                <User size={20} />
                <span className="text-sm">{user.email}</span>
              </Link>
              <Button
                variant="outline"
                onClick={() => signOut()}
              >
                {t("navigation.signOut")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;