import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import AdminPage from "./pages/Admin";
import Auth from "./pages/Auth";
import Assessment from "./pages/Assessment";
import CareerLaunch from "./pages/CareerLaunch";
import CAIRAssessment from "./pages/CAIRAssessment";
import StressResilience from "./pages/StressResilience";
import CulturalIntelligenceAssessment from "./pages/CulturalIntelligenceAssessment";
import CommunicationAssessment from "./pages/CommunicationAssessment";
import EmotionalIntelligenceAssessment from "./pages/EmotionalIntelligenceAssessment";
import FaithValuesAssessment from "./pages/FaithValuesAssessment";
import GenZAssessment from "./pages/GenZAssessment";
import DigitalWellnessAssessment from "./pages/DigitalWellnessAssessment";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerDashboard from "./pages/PartnerDashboard";
import LeadershipAssessment from "./pages/LeadershipAssessment";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CompliancePage from "./pages/CompliancePage";
import SampleReports from "./pages/SampleReports";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { PartnerProvider } from "@/contexts/PartnerContext";
import { EmployerProvider } from "@/contexts/EmployerContext";
import EmployerLogin from "./pages/EmployerLogin";
import EmployerDashboard from "./pages/EmployerDashboard";
import SoloAssessment from "./pages/SoloAssessment";
import AdminAnalytics from "./pages/AdminAnalytics";
import CandidateTesting from "./pages/CandidateTesting";
import TestingDashboard from "./pages/TestingDashboard";
import SampleCareerLaunchReport from "./pages/SampleCareerLaunchReport";
import AIChat from "@/components/AIChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PartnerProvider>
          <EmployerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/career-launch" element={<CareerLaunch />} />
            <Route path="/cair-assessment" element={<CAIRAssessment />} />
            <Route path="/cair" element={<CAIRAssessment />} />
            <Route path="/stress-resilience" element={<StressResilience />} />
            <Route path="/cultural-intelligence" element={<CulturalIntelligenceAssessment />} />
            <Route path="/communication-assessment" element={<CommunicationAssessment />} />
            <Route path="/communication" element={<CommunicationAssessment />} />
            <Route path="/emotional-intelligence" element={<EmotionalIntelligenceAssessment />} />
            <Route path="/faith-values" element={<FaithValuesAssessment />} />
            <Route path="/genz-assessment" element={<GenZAssessment />} />
            <Route path="/genz" element={<GenZAssessment />} />
            <Route path="/digital-wellness" element={<DigitalWellnessAssessment />} />
            <Route path="/partner-login" element={<PartnerLogin />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/leadership-assessment" element={<LeadershipAssessment />} />
            <Route path="/leadership" element={<LeadershipAssessment />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/sample-reports" element={<SampleReports />} />
            <Route path="/security" element={<Security />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/employer-login" element={<EmployerLogin />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/solo-assessment/:token" element={<SoloAssessment />} />
            <Route path="/admin-analytics" element={<AdminAnalytics />} />
            <Route path="/candidate-testing" element={<CandidateTesting />} />
            <Route path="/testing-dashboard" element={<TestingDashboard />} />
            <Route path="/sample-career-launch-report" element={<SampleCareerLaunchReport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChat />
        </BrowserRouter>
          </EmployerProvider>
        </PartnerProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
