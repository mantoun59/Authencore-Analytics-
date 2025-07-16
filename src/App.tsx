import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import AdminPage from "./pages/Admin";
import Assessment from "./pages/Assessment";
import CareerLaunch from "./pages/CareerLaunch";
import CAIRAssessment from "./pages/CAIRAssessment";
import StressResilience from "./pages/StressResilience";
import CommunicationAssessment from "./pages/CommunicationAssessment";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => {
  console.log("App rendering, React:", React);
  console.log("QueryClient:", queryClient);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/career-launch" element={<CareerLaunch />} />
            <Route path="/cair-assessment" element={<CAIRAssessment />} />
            <Route path="/communication-assessment" element={<CommunicationAssessment />} />
            <Route path="/stress-resilience" element={<StressResilience />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
