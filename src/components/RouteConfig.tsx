import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Immediate load - Critical pages and description pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Assessment from "@/pages/Assessment";
import NotFound from "@/pages/NotFound";
import PsychometricAudit from "@/pages/PsychometricAudit";
import CAIRPersonalityDescription from "@/pages/CAIRPersonalityDescription";
import AuthenticLeadershipDescription from "@/pages/AuthenticLeadershipDescription";
import BurnoutPreventionDescription from "@/pages/BurnoutPreventionDescription";
import CAIRCulturalDescription from "@/pages/CAIRCulturalDescription";
import CulturalIntelligenceDescription from "@/pages/CulturalIntelligenceDescription";
import CareerLaunchDescription from "@/pages/CareerLaunchDescription";
import CommunicationStyleDescription from "@/pages/CommunicationStyleDescription";
import DigitalWellnessDescription from "@/pages/DigitalWellnessDescription";
import EmotionalIntelligenceDescription from "@/pages/EmotionalIntelligenceDescription";
import FaithValuesDescription from "@/pages/FaithValuesDescription";
import GenZWorkplaceDescription from "@/pages/GenZWorkplaceDescription";

// Lazy load - Assessment pages (large components)
const CareerLaunch = lazy(() => import("@/pages/CareerLaunch"));
const CAIRAssessment = lazy(() => import("@/pages/CAIRAssessment"));
const StressResilience = lazy(() => import("@/pages/StressResilience"));
const CulturalIntelligenceAssessment = lazy(() => import("@/pages/CulturalIntelligenceAssessment"));
const CommunicationAssessment = lazy(() => import("@/pages/CommunicationAssessment"));
const EmotionalIntelligenceAssessment = lazy(() => import("@/components/EmotionalIntelligenceAssessment"));
const FaithValuesAssessment = lazy(() => import("@/pages/FaithValuesAssessment"));
const GenZWorkplaceAssessment = lazy(() => import("@/pages/GenZWorkplaceAssessment"));
const DigitalWellnessAssessment = lazy(() => import("@/pages/DigitalWellnessAssessment"));
const LeadershipAssessment = lazy(() => import("@/pages/LeadershipAssessment"));

// New comprehensive assessments
const TechnologyIntegrationAssessment = lazy(() => import("@/pages/TechnologyIntegrationAssessment"));
const CommunicationCompetencyAssessment = lazy(() => import("@/pages/CommunicationCompetencyAssessment"));
const LeadershipBehaviorAssessment = lazy(() => import("@/pages/LeadershipBehaviorAssessment"));
const WorkValuesAssessment = lazy(() => import("@/pages/WorkValuesAssessment"));
const WorkPreferencesAssessment = lazy(() => import("@/pages/WorkPreferencesAssessment"));

// Lazy load - Information pages
const AboutPage = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CompliancePage = lazy(() => import("@/pages/CompliancePage"));
const Security = lazy(() => import("@/pages/Security"));

// Lazy load - Partner/Employer features
const PartnerLogin = lazy(() => import("@/pages/PartnerLogin"));
const PartnerDashboard = lazy(() => import("@/pages/PartnerDashboard"));
const EmployerLogin = lazy(() => import("@/pages/EmployerLogin"));
const EmployerDashboard = lazy(() => import("@/pages/EmployerDashboard"));
const SoloAssessment = lazy(() => import("@/pages/SoloAssessment"));
const Contact = lazy(() => import("@/pages/Contact"));

// Lazy load - Admin features (heavy components)
const AdminPage = lazy(() => import("@/pages/Admin"));
const AdminAnalytics = lazy(() => import("@/pages/AdminAnalytics"));
const MarketingMaterials = lazy(() => import("@/pages/MarketingMaterials"));

// Lazy load - Testing & Analytics
const CandidateTesting = lazy(() => import("@/pages/CandidateTesting"));
const TestingDashboard = lazy(() => import("@/pages/TestingDashboard"));
const EmployerAnalytics = lazy(() => import("@/pages/EmployerAnalytics"));
const PartnerAnalytics = lazy(() => import("@/pages/PartnerAnalytics"));

// Lazy load - Reports & Materials
const SampleCareerLaunchReport = lazy(() => import("@/pages/SampleCareerLaunchReport"));
const Payment = lazy(() => import("@/pages/Payment"));

// Regular import for SampleReports to fix dynamic import error
import SampleReports from "@/pages/SampleReports";

// Note: Description pages moved to immediate imports to prevent chunk loading errors

// Loading component for Suspense fallbacks
const LoadingFallback = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Card className="w-full max-w-md mx-4">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{message}</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we load the content...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const RouteConfig = () => {
  return (
    <Routes>
      {/* Critical Routes - Immediate Load */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Public Information Pages - Lazy Loaded */}
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={
        <Suspense fallback={<LoadingFallback message="Loading FAQ..." />}>
          <FAQ />
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<LoadingFallback message="Loading Privacy Policy..." />}>
          <PrivacyPolicy />
        </Suspense>
      } />
      <Route path="/compliance" element={
        <Suspense fallback={<LoadingFallback message="Loading Compliance Information..." />}>
          <CompliancePage />
        </Suspense>
      } />
      <Route path="/security" element={
        <Suspense fallback={<LoadingFallback message="Loading Security Information..." />}>
          <Security />
        </Suspense>
      } />
      
      {/* Assessment Overview - Immediate Load */}
      <Route path="/assessment" element={<Assessment />} />
      
      {/* Assessment Pages - Lazy Loaded with Custom Messages */}
      <Route path="/career-launch" element={
        <Suspense fallback={<LoadingFallback message="Preparing Career Launch Assessment..." />}>
          <CareerLaunch />
        </Suspense>
      } />
      <Route path="/cair-assessment" element={
        <Suspense fallback={<LoadingFallback message="Loading CAIR Assessment..." />}>
          <CAIRAssessment />
        </Suspense>
      } />
      <Route path="/cair" element={
        <Suspense fallback={<LoadingFallback message="Loading CAIR Assessment..." />}>
          <CAIRAssessment />
        </Suspense>
      } />
      <Route path="/stress-resilience" element={
        <Suspense fallback={<LoadingFallback message="Loading Stress & Resilience Assessment..." />}>
          <StressResilience />
        </Suspense>
      } />
      <Route path="/cultural-intelligence" element={
        <Suspense fallback={<LoadingFallback message="Loading Cultural Intelligence Assessment..." />}>
          <CulturalIntelligenceAssessment />
        </Suspense>
      } />
      <Route path="/communication-assessment" element={
        <Suspense fallback={<LoadingFallback message="Loading Communication Assessment..." />}>
          <CommunicationAssessment />
        </Suspense>
      } />
      <Route path="/communication" element={
        <Suspense fallback={<LoadingFallback message="Loading Communication Assessment..." />}>
          <CommunicationAssessment />
        </Suspense>
      } />
      <Route path="/emotional-intelligence" element={
        <Suspense fallback={<LoadingFallback message="Loading Emotional Intelligence Assessment..." />}>
          <EmotionalIntelligenceAssessment />
        </Suspense>
      } />
      <Route path="/faith-values" element={
        <Suspense fallback={<LoadingFallback message="Loading Faith & Values Assessment..." />}>
          <FaithValuesAssessment />
        </Suspense>
      } />
      <Route path="/genz-assessment" element={
        <Suspense fallback={<LoadingFallback message="Loading Gen Z Workplace Assessment..." />}>
          <GenZWorkplaceAssessment />
        </Suspense>
      } />
      <Route path="/genz" element={
        <Suspense fallback={<LoadingFallback message="Loading Gen Z Workplace Assessment..." />}>
          <GenZWorkplaceAssessment />
        </Suspense>
      } />
      <Route path="/genz-workplace" element={
        <Suspense fallback={<LoadingFallback message="Loading Gen Z Workplace Assessment..." />}>
          <GenZWorkplaceAssessment />
        </Suspense>
      } />
      <Route path="/digital-wellness" element={
        <Suspense fallback={<LoadingFallback message="Loading Digital Wellness Assessment..." />}>
          <DigitalWellnessAssessment />
        </Suspense>
      } />
      <Route path="/leadership-assessment" element={
        <Suspense fallback={<LoadingFallback message="Loading Leadership Assessment..." />}>
          <LeadershipAssessment />
        </Suspense>
      } />
      <Route path="/leadership" element={
        <Suspense fallback={<LoadingFallback message="Loading Leadership Assessment..." />}>
          <LeadershipAssessment />
        </Suspense>
      } />
      
      {/* New Comprehensive Assessments - Lazy Loaded */}
      <Route path="/technology-integration" element={
        <Suspense fallback={<LoadingFallback message="Loading Technology Integration Assessment..." />}>
          <TechnologyIntegrationAssessment />
        </Suspense>
      } />
      <Route path="/communication-competency" element={
        <Suspense fallback={<LoadingFallback message="Loading Communication Competency Assessment..." />}>
          <CommunicationCompetencyAssessment />
        </Suspense>
      } />
      <Route path="/leadership-behavior" element={
        <Suspense fallback={<LoadingFallback message="Loading Leadership Behavior Assessment..." />}>
          <LeadershipBehaviorAssessment />
        </Suspense>
      } />
      <Route path="/work-values" element={
        <Suspense fallback={<LoadingFallback message="Loading Work Values Assessment..." />}>
          <WorkValuesAssessment />
        </Suspense>
      } />
      <Route path="/work-preferences" element={
        <Suspense fallback={<LoadingFallback message="Loading Work Preferences Assessment..." />}>
          <WorkPreferencesAssessment />
        </Suspense>
      } />
      
      {/* Assessment Description Pages - Immediate Load (prevents chunk errors) */}
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
      
      {/* Partner Routes - Lazy Loaded */}
      <Route path="/partner-login" element={
        <Suspense fallback={<LoadingFallback message="Loading Partner Portal..." />}>
          <PartnerLogin />
        </Suspense>
      } />
      <Route path="/partner-dashboard" element={
        <Suspense fallback={<LoadingFallback message="Loading Partner Dashboard..." />}>
          <PartnerDashboard />
        </Suspense>
      } />
      <Route path="/partner-analytics" element={
        <Suspense fallback={<LoadingFallback message="Loading Analytics..." />}>
          <PartnerAnalytics />
        </Suspense>
      } />
      
      {/* Employer Routes - Lazy Loaded */}
      <Route path="/employer-login" element={
        <Suspense fallback={<LoadingFallback message="Loading Employer Portal..." />}>
          <EmployerLogin />
        </Suspense>
      } />
      <Route path="/employer-dashboard" element={
        <Suspense fallback={<LoadingFallback message="Loading Dashboard..." />}>
          <EmployerDashboard />
        </Suspense>
      } />
      <Route path="/employer-analytics" element={
        <Suspense fallback={<LoadingFallback message="Loading Analytics..." />}>
          <EmployerAnalytics />
        </Suspense>
      } />
      
      {/* Testing & Assessment Routes - Lazy Loaded */}
      <Route path="/solo-assessment/:token" element={
        <Suspense fallback={<LoadingFallback message="Preparing Assessment..." />}>
          <SoloAssessment />
        </Suspense>
      } />
      <Route path="/candidate-testing" element={
        <Suspense fallback={<LoadingFallback message="Loading Testing Interface..." />}>
          <CandidateTesting />
        </Suspense>
      } />
      <Route path="/testing-dashboard" element={
        <Suspense fallback={<LoadingFallback message="Loading Dashboard..." />}>
          <TestingDashboard />
        </Suspense>
      } />
      
      {/* Payment & Sample Routes - Lazy Loaded */}
      <Route path="/payment" element={
        <Suspense fallback={<LoadingFallback message="Loading Payment Options..." />}>
          <Payment />
        </Suspense>
      } />
      <Route path="/sample-career-launch-report" element={
        <Suspense fallback={<LoadingFallback message="Generating Sample Report..." />}>
          <SampleCareerLaunchReport />
        </Suspense>
      } />
      <Route path="/sample-reports" element={<SampleReports />} />
      
      {/* Contact Page */}
      <Route path="/contact" element={
        <Suspense fallback={<LoadingFallback message="Loading Contact Form..." />}>
          <Contact />
        </Suspense>
      } />
      
      {/* Protected Admin Routes - Lazy Loaded with Protection */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <Suspense fallback={<LoadingFallback message="Loading Admin Panel..." />}>
            <AdminPage />
          </Suspense>
        </ProtectedAdminRoute>
      } />
      <Route path="/admin-analytics" element={
        <ProtectedAdminRoute>
          <Suspense fallback={<LoadingFallback message="Loading Analytics Dashboard..." />}>
            <AdminAnalytics />
          </Suspense>
        </ProtectedAdminRoute>
      } />
      <Route path="/marketing-materials" element={
        <ProtectedAdminRoute>
          <Suspense fallback={<LoadingFallback message="Loading Marketing Materials..." />}>
            <MarketingMaterials />
          </Suspense>
        </ProtectedAdminRoute>
      } />
      <Route path="/psychometric-audit" element={<PsychometricAudit />} />
      
      {/* Catch-all 404 Route - MUST BE LAST */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouteConfig;