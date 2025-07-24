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
import GenZWorkplaceAssessment from "./pages/GenZWorkplaceAssessment";
import DigitalWellnessAssessment from "./pages/DigitalWellnessAssessment";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerDashboard from "./pages/PartnerDashboard";
import LeadershipAssessment from "./pages/LeadershipAssessment";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CompliancePage from "./pages/CompliancePage";

import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { PartnerProvider } from "@/contexts/PartnerContext";
import { LogoProvider } from "@/contexts/LogoContext";
import { EmployerProvider } from "@/contexts/EmployerContext";
import EmployerLogin from "./pages/EmployerLogin";
import EmployerDashboard from "./pages/EmployerDashboard";
import SoloAssessment from "./pages/SoloAssessment";
import AdminAnalytics from "./pages/AdminAnalytics";
import CandidateTesting from "./pages/CandidateTesting";
import TestingDashboard from "./pages/TestingDashboard";
import SampleCareerLaunchReport from "./pages/SampleCareerLaunchReport";
import SampleReports from "./pages/SampleReports";
import MarketingMaterials from "./pages/MarketingMaterials";
import AuthenticLeadershipDescription from "./pages/AuthenticLeadershipDescription";
import BurnoutPreventionDescription from "./pages/BurnoutPreventionDescription";
import CAIRCulturalDescription from "./pages/CAIRCulturalDescription";
import CulturalIntelligenceDescription from "./pages/CulturalIntelligenceDescription";
import CAIRPersonalityDescription from "./pages/CAIRPersonalityDescription";
import CareerLaunchDescription from "./pages/CareerLaunchDescription";
import CommunicationStyleDescription from "./pages/CommunicationStyleDescription";
import DigitalWellnessDescription from "./pages/DigitalWellnessDescription";
import EmotionalIntelligenceDescription from "./pages/EmotionalIntelligenceDescription";
import FaithValuesDescription from "./pages/FaithValuesDescription";
import GenZWorkplaceDescription from "./pages/GenZWorkplaceDescription";
import EmployerAnalytics from "./pages/EmployerAnalytics";
import PartnerAnalytics from "./pages/PartnerAnalytics";
import ScrollToTop from "@/components/ScrollToTop";
import AIChat from "@/components/AIChat";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/genz-assessment" element={<GenZWorkplaceAssessment />} />
            <Route path="/genz" element={<GenZWorkplaceAssessment />} />
            <Route path="/genz-workplace" element={<GenZWorkplaceAssessment />} />
            <Route path="/digital-wellness" element={<DigitalWellnessAssessment />} />
            <Route path="/partner-login" element={<PartnerLogin />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/leadership-assessment" element={<LeadershipAssessment />} />
            <Route path="/leadership" element={<LeadershipAssessment />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/compliance" element={<CompliancePage />} />
            
            {/* Assessment Description Pages */}
            <Route path="/authentic-leadership-info" element={<AuthenticLeadershipDescription />} />
            <Route path="/burnout-prevention-info" element={<BurnoutPreventionDescription />} />
            <Route path="/cair-cultural-info" element={<CAIRCulturalDescription />} />
            <Route path="/cultural-intelligence-info" element={<CulturalIntelligenceDescription />} />
            <Route path="/cair-personality-info" element={<CAIRPersonalityDescription />} />
            <Route path="/career-launch-info" element={<CareerLaunchDescription />} />
            <Route path="/communication-style-info" element={<CommunicationStyleDescription />} />
            <Route path="/digital-wellness-info" element={<DigitalWellnessDescription />} />
            <Route path="/emotional-intelligence-info" element={<EmotionalIntelligenceDescription />} />
            <Route path="/faith-values-info" element={<FaithValuesDescription />} />
            <Route path="/genz-workplace-info" element={<GenZWorkplaceDescription />} />
            <Route path="/security" element={<Security />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/employer-login" element={<EmployerLogin />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/solo-assessment/:token" element={<SoloAssessment />} />
            <Route path="/admin-analytics" element={<AdminAnalytics />} />
            <Route path="/candidate-testing" element={<CandidateTesting />} />
            <Route path="/testing-dashboard" element={<TestingDashboard />} />
            <Route path="/sample-career-launch-report" element={<SampleCareerLaunchReport />} />
            <Route path="/sample-reports" element={<SampleReports />} />
            <Route path="/marketing-materials" element={<MarketingMaterials />} />
            <Route path="/employer-analytics" element={<EmployerAnalytics />} />
            <Route path="/partner-analytics" element={<PartnerAnalytics />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChat />
        </BrowserRouter>
          </EmployerProvider>
        </PartnerProvider>
      </AuthProvider>
      </LogoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
