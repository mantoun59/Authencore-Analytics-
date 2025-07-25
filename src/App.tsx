import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PartnerProvider } from "@/contexts/PartnerContext";
import { LogoProvider } from "@/contexts/LogoContext";
import { EmployerProvider } from "@/contexts/EmployerContext";
import RouteConfig from "@/components/RouteConfig";
import ScrollToTop from "@/components/ScrollToTop";
import AIChat from "@/components/AIChat";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LogoProvider>
          <AuthProvider>
            <PartnerProvider>
              <EmployerProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <RouteConfig />
                  <AIChat />
                </BrowserRouter>
              </EmployerProvider>
            </PartnerProvider>
          </AuthProvider>
        </LogoProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;
