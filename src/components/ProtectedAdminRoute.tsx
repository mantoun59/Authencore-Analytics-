import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  // Log access attempts for security monitoring
  useEffect(() => {
    const logAccessAttempt = async () => {
      if (!authLoading && !adminLoading) {
        try {
          await supabase.functions.invoke('security-middleware', {
            body: {
              event: 'admin_route_access_attempt',
              path: location.pathname,
              userId: user?.id,
              isAdmin: isAdmin,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
            }
          });
        } catch (error) {
          console.warn('Failed to log admin access attempt:', error);
        }
      }
    };

    logAccessAttempt();
  }, [user, isAdmin, authLoading, adminLoading, location.pathname]);

  // Show loading state while checking authentication
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Verifying Access</h2>
                <p className="text-sm text-muted-foreground">
                  Checking your permissions...
                </p>
              </div>
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-muted-foreground">
                Administrator privileges are required.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={() => window.history.back()}
                className="w-full"
                variant="outline"
              >
                Go Back
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return Home
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>If you believe this is an error, please contact support.</p>
              <p className="font-mono bg-muted px-2 py-1 rounded">
                Path: {location.pathname}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedAdminRoute;