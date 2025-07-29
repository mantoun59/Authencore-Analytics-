import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Heart, Users, Zap, Target, CheckCircle2, ArrowRight, Rocket, Shield, Lightbulb, MessageSquare, Globe, BarChart3, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Helper function to transform badge names to translation keys
const getBadgeTranslationKey = (badge: string): string => {
  return badge
    .toLowerCase()
    .replace(/\s+/g, '')     // Remove spaces
    .replace(/[+-]/g, '')    // Remove + and - characters
    .replace(/&/g, '')       // Remove & characters
    .replace(/[^a-z0-9]/g, ''); // Remove any other non-alphanumeric characters
};
import { assessmentsData } from "@/data/assessmentsData";
import assessmentConceptImage from "@/assets/assessment-concept.jpg";
import LogoDisplay from "@/components/LogoDisplay";
import { PaymentButton } from "@/components/PaymentButton";
import AssessmentPreviewModal from "@/components/AssessmentPreviewModal";

const Assessment = () => {
  const { t } = useTranslation();
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const getInfoRoute = (assessmentId: string) => {
    const routeMap: { [key: string]: string } = {
      'career-launch': '/career-launch-info',
      'cair-personality': '/cair-personality-info',
      'stress-resilience': '/burnout-prevention-info',
      'cultural-intelligence': '/cultural-intelligence-info',
      'communication-styles': '/communication-style-info',
      'emotional-intelligence': '/emotional-intelligence-info',
      'faith-values': '/faith-values-info',
      'genz-assessment': '/genz-workplace-info',
      'digital-wellness': '/digital-wellness-info',
      'leadership-assessment': '/authentic-leadership-info',
      'innovation-mindset': '/innovation-mindset-info'
    };
    return routeMap[assessmentId] || '/assessment';
  };
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return Rocket;
      case 'Brain': return Brain;
      case 'Shield': return Shield;
      case 'Globe': return Globe;
      case 'MessageSquare': return MessageSquare;
      case 'Heart': return Heart;
      case 'Lightbulb': return Lightbulb;
      case 'Zap': return Zap;
      case 'Monitor': return Monitor;
      case 'Users': return Users;
      default: return Target;
    }
  };

  const getSampleQuestions = (assessmentType: string) => {
    const sampleQuestions: { [key: string]: string[] } = {
      'career-launch': [
        "I feel confident about my technical skills for my desired career path",
        "I can effectively communicate my ideas in professional settings",
        "I adapt well to changing workplace priorities and requirements"
      ],
      'leadership-assessment': [
        "I inspire others to achieve their best performance",
        "I make decisions confidently even with incomplete information",
        "I provide constructive feedback that helps team members grow"
      ],
      'communication-styles': [
        "I adjust my communication style based on my audience",
        "I listen actively and ask clarifying questions",
        "I can influence others without being pushy or aggressive"
      ]
    };
    return sampleQuestions[assessmentType] || [
      "This assessment will evaluate your key competencies",
      "Questions are designed to understand your natural tendencies",
      "Your responses help create a personalized development plan"
    ];
  };

  const handlePreviewAssessment = (assessment: any) => {
    setSelectedAssessment(assessment);
    setPreviewModalOpen(true);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { icon: string, badge: string, button: string } } = {
      blue: {
        icon: 'text-blue-500',
        badge: 'bg-blue-100 text-blue-800',
        button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      },
      purple: {
        icon: 'text-purple-500',
        badge: 'bg-purple-100 text-purple-800',
        button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
      },
      green: {
        icon: 'text-green-500',
        badge: 'bg-green-100 text-green-800',
        button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
      },
      teal: {
        icon: 'text-teal-500',
        badge: 'bg-teal-100 text-teal-800',
        button: 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
      },
      indigo: {
        icon: 'text-indigo-500',
        badge: 'bg-indigo-100 text-indigo-800',
        button: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
      },
      rose: {
        icon: 'text-rose-500',
        badge: 'bg-rose-100 text-rose-800',
        button: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
      },
      amber: {
        icon: 'text-amber-500',
        badge: 'bg-amber-100 text-amber-800',
        button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
      },
      violet: {
        icon: 'text-violet-500',
        badge: 'bg-violet-100 text-violet-800',
        button: 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700'
      },
      cyan: {
        icon: 'text-cyan-500',
        badge: 'bg-cyan-100 text-cyan-800',
        button: 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700'
      },
      emerald: {
        icon: 'text-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
        button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
        <div className="max-w-6xl mx-auto text-center">
          {/* Display the new logo prominently */}
          <div className="text-center mb-12">
            <LogoDisplay size="lg" showTagline={true} className="justify-center" />
          </div>
          
          {/* Hero Image */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/d6159e3c-9371-41c3-969b-c4b47bf4f0b5.png" 
              alt={t("hero.imageAlt")}
              className="w-full max-w-4xl h-64 object-cover rounded-lg shadow-xl mx-auto"
            />
          </div>
          
          {/* Mis-hiring Cost Quotes */}
          <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center text-red-800 dark:text-red-200">{t("hero.mishiringTitle")}</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-medium text-red-700 dark:text-red-300">"{t("hero.mishiringQuote1")}"</p>
                <p className="text-xs text-muted-foreground mt-2">- {t("hero.mishiringSource1")}</p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-medium text-red-700 dark:text-red-300">"{t("hero.mishiringQuote2")}"</p>
                <p className="text-xs text-muted-foreground mt-2">- {t("hero.mishiringSource2")}</p>
              </div>
            </div>
          </div>
          
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
            🎯 {t("assessments.title")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            {t("assessments.title")} {t("landing.assessmentsTitle")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t("landing.assessmentsSubtitle")}
          </p>
        </div>
      </section>

      {/* Assessment Options */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            
            {assessmentsData.map((assessment) => {
              const IconComponent = getIconComponent(assessment.icon);
              const colorClasses = getColorClasses(assessment.color);
              
              return (
                <Card key={assessment.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  <CardHeader>
                     <div className="flex items-center gap-3 mb-4">
                       <IconComponent className={`h-8 w-8 ${colorClasses.icon}`} />
                       <div>
                         <CardTitle className="text-xl">{t(`assessments.cards.${assessment.id.replace('-', '')}.title`)}</CardTitle>
                         <Badge className="mt-1" variant="secondary">{t(`assessments.badges.${getBadgeTranslationKey(assessment.badges[0])}`)}</Badge>
                       </div>
                     </div>
                     <CardDescription className="text-base">
                       {t(`assessments.cards.${assessment.id.replace('-', '')}.description`)}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow flex flex-col">
                     <div className="flex items-center justify-between mb-4">
                       <span className="text-3xl font-bold text-primary">{assessment.price}</span>
                       <Badge className={colorClasses.badge}>
                         {t(`assessments.badges.${getBadgeTranslationKey(assessment.badges[1] || assessment.badges[0])}`)}
                       </Badge>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       <Badge variant="outline">{assessment.questions} {t("assessments.badges.questionsLabel")}</Badge>
                       <Badge variant="outline">{assessment.duration}</Badge>
                       {assessment.badges.slice(1, 3).map((badge, index) => (
                         <Badge key={index} variant="outline">{t(`assessments.badges.${getBadgeTranslationKey(badge)}`)}</Badge>
                       ))}
                     </div>
                     <ul className="space-y-2 text-sm text-muted-foreground">
                       {assessment.features.slice(0, 4).map((feature, index) => {
                         const featureKey = feature.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
                         return (
                           <li key={index} className="flex items-center gap-2">
                             <CheckCircle2 className="h-4 w-4 text-green-500" />
                             {t(`assessments.features.${featureKey}`, feature)}
                           </li>
                         );
                       })}
                     </ul>
                    <div className="flex-grow"></div>
                    <div className="space-y-2">
                      <PaymentButton
                        assessmentType={assessment.id}
                        price={assessment.price}
                        className="w-full"
                        variant="default"
                        size="default"
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handlePreviewAssessment(assessment)}
                        >
                          {t("assessmentPages.overview")}
                        </Button>
                        <Link to={getInfoRoute(assessment.id)} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            {t("assessments.learnMore")} <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Professional Assessment Showcase Card */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
              <CardHeader className="pb-0">
                <div className="relative rounded-lg overflow-hidden mb-4">
                  <img 
                    src={assessmentConceptImage}
                    alt={t("assessments.badges.mishiringalt")}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {t("assessments.badges.professional")}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl text-center">
                  {t("about.title")}
                </CardTitle>
                <CardDescription className="text-base text-center">
                  {t("about.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-primary mb-2">{t("landing.feature1Title")}</div>
                  <div className="text-sm text-muted-foreground">{t("landing.assessmentsSubtitle")}</div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t("features.aiPowered.title")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t("features.realTime.title")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t("features.secure.title")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {t("landing.feature1Title")}
                  </li>
                </ul>
                <div className="flex-grow"></div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary mb-2">
                    {t("common.save")} $9.99
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("about.subtitle")}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Assessment Comparison */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("assessments.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("assessments.subtitle")}
            </p>
          </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Target className="h-5 w-5 text-blue-500" />
                   {t("assessments.comparison.forStudents")}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground mb-4">
                   {t("assessments.comparison.studentsDescription")}
                 </p>
                 <Badge className="bg-blue-100 text-blue-800">{t("assessments.comparison.recommendedCareerLaunch")}</Badge>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Users className="h-5 w-5 text-purple-500" />
                   {t("assessments.comparison.forHiring")}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground mb-4">
                   {t("assessments.comparison.hiringDescription")}
                 </p>
                 <Badge className="bg-purple-100 text-purple-800">{t("assessments.comparison.recommendedCair")}</Badge>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Shield className="h-5 w-5 text-green-500" />
                   {t("assessments.comparison.forHighStress")}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground mb-4">
                   {t("assessments.comparison.stressDescription")}
                 </p>
                 <Badge className="bg-green-100 text-green-800">{t("assessments.comparison.recommendedStress")}</Badge>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <MessageSquare className="h-5 w-5 text-indigo-500" />
                   {t("assessments.comparison.forCommunication")}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground mb-4">
                   {t("assessments.comparison.communicationDescription")}
                 </p>
                 <Badge className="bg-indigo-100 text-indigo-800">{t("assessments.comparison.recommendedCommunication")}</Badge>
               </CardContent>
             </Card>
           </div>
        </div>
      </section>

      <Footer />
      
      {/* Assessment Preview Modal */}
      {selectedAssessment && (
        <AssessmentPreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          assessmentType={selectedAssessment.id}
          assessmentTitle={selectedAssessment.title}
          assessmentDescription={selectedAssessment.description}
          sampleQuestions={getSampleQuestions(selectedAssessment.id)}
          estimatedTime={selectedAssessment.duration}
          onStartAssessment={() => {
            setPreviewModalOpen(false);
            // Navigate to payment or start assessment
            window.location.href = getInfoRoute(selectedAssessment.id);
          }}
        />
      )}
    </div>
  );
};

export default Assessment;