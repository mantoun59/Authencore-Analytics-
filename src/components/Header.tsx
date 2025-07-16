import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'register' | null>(null);
  const { user, signOut, loading } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Assessments", href: "#assessments" },
    { name: "Admin", href: "/admin" },
    { name: "Employer", href: "#employer" },
  ];

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

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
            <div className="hidden md:flex space-x-3">
              {loading ? (
                <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-foreground">
                    <User size={20} />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setAuthModalType('login')}
                  >
                    Applicant Sign In
                  </Button>
                  <Button
                    onClick={() => setAuthModalType('register')}
                  >
                    Applicant Register
                  </Button>
                </>
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
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 text-foreground px-3 py-2">
                        <User size={20} />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAuthModalType('login');
                          setIsMenuOpen(false);
                        }}
                      >
                        Applicant Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          setAuthModalType('register');
                          setIsMenuOpen(false);
                        }}
                      >
                        Applicant Register
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        type={authModalType}
        onClose={() => setAuthModalType(null)}
        onTypeChange={(type) => setAuthModalType(type)}
      />
    </>
  );
};

export default Header;