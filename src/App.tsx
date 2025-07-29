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
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduced retries for faster failure
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 15 * 60 * 1000, // 15 minutes garbage collection time
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Prevent unnecessary refetches
      refetchOnReconnect: false, // Prevent refetch on reconnect
    },
    mutations: {
      retry: 1, // Reduced mutation retries
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary level="critical">
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
    </ErrorBoundary>
  );
};

export default App;
