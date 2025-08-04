import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LogoDisplay from "@/components/LogoDisplay";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Development Modules", href: "/assessment" },
    { name: "Support", href: "/support" },
    { name: "Partners", href: "/partner-login" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <LogoDisplay size="md" showTagline={false} className="hidden md:block" />
            <LogoDisplay size="sm" showTagline={false} className="md:hidden" />
          </Link>
        </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <LanguageSwitcher />
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  item.href.startsWith('#') ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                <div className="flex flex-col space-y-3 pt-4">
                  <div className="px-3">
                    <LanguageSwitcher />
                  </div>
                  {user ? (
                    <>
                      <Link 
                        to="/profile"
                        className="flex items-center space-x-2 text-foreground px-3 py-2 hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={20} />
                        <span className="text-sm">{user.email}</span>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        {t("navigation.signOut")}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" asChild>
                      <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Removed AuthModal as applicant auth is now handled in assessments */}
    </>
  );
};

export default Header;