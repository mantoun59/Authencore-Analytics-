import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, BookOpen, Users, Settings, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("faq.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main FAQ Section */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Platform Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {t("faqContent.platformOverview.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("faqContent.platformOverview.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="what-is-authencore">
                      <AccordionTrigger>{t("faqContent.platformOverview.whatIsAuthencore")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.platformOverview.whatIsAuthencoreAnswer")}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <h4 className="font-semibold mb-2">{t("faqContent.platformOverview.forIndividuals")}</h4>
                              <p className="text-sm text-muted-foreground">{t("faqContent.platformOverview.forIndividualsDesc")}</p>
                            </div>
                            <div className="p-4 bg-secondary/5 rounded-lg">
                              <h4 className="font-semibold mb-2">{t("faqContent.platformOverview.forOrganizations")}</h4>
                              <p className="text-sm text-muted-foreground">{t("faqContent.platformOverview.forOrganizationsDesc")}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="mission">
                      <AccordionTrigger>{t("faqContent.platformOverview.missionTitle")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p className="font-medium text-primary">"{t("faqContent.platformOverview.missionTagline")}"</p>
                          <p>{t("faqContent.platformOverview.missionDesc")}</p>
                          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("faqContent.platformOverview.validatedInstruments")}</li>
                            <li>{t("faqContent.platformOverview.validityDetection")}</li>
                            <li>{t("faqContent.platformOverview.personalizedInsights")}</li>
                            <li>{t("faqContent.platformOverview.professionalReporting")}</li>
                            <li>{t("faqContent.platformOverview.ethicalPractices")}</li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Assessment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {t("faqContent.assessmentInfo.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="assessment-types">
                      <AccordionTrigger>{t("faqContent.assessmentInfo.typesQuestion")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.assessmentInfo.typesAnswer")}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.careerLaunchTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.careerLaunchDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.cairPersonalityTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.cairPersonalityDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.stressResilienceTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.stressResilienceDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.culturalIntelligenceTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.culturalIntelligenceDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.communicationStylesTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.communicationStylesDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.emotionalIntelligenceTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.emotionalIntelligenceDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.authenticLeadershipTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.authenticLeadershipDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.digitalWellnessTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.digitalWellnessDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.faithValuesTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.faithValuesDesc")}</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium">{t("faqContent.assessmentInfo.genZWorkplaceTitle")}</h5>
                              <p className="text-sm text-muted-foreground">{t("faqContent.assessmentInfo.genZWorkplaceDesc")}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="how-long">
                      <AccordionTrigger>{t("faqContent.assessmentInfo.durationQuestion")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.assessmentInfo.durationAnswer")}</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">{t("faqContent.assessmentInfo.quickAssessments")}</span>
                              <Badge variant="outline">15-25 minutes</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">{t("faqContent.assessmentInfo.standardAssessments")}</span>
                              <Badge variant="outline">25-40 minutes</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">{t("faqContent.assessmentInfo.comprehensiveAssessments")}</span>
                              <Badge variant="outline">45-60 minutes</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t("faqContent.assessmentInfo.pauseNote")}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="how-to-take">
                      <AccordionTrigger>{t("faqContent.assessmentInfo.howToTakeQuestion")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.assessmentInfo.howToTakeAnswer")}</p>
                          <ol className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                              <span>{t("faqContent.assessmentInfo.step1")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                              <span>{t("faqContent.assessmentInfo.step2")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                              <span>{t("faqContent.assessmentInfo.step3")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                              <span>{t("faqContent.assessmentInfo.step4")}</span>
                            </li>
                          </ol>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{t("faqContent.assessmentInfo.importantTips")}</h5>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• {t("faqContent.assessmentInfo.tip1")}</li>
                              <li>• {t("faqContent.assessmentInfo.tip2")}</li>
                              <li>• {t("faqContent.assessmentInfo.tip3")}</li>
                              <li>• {t("faqContent.assessmentInfo.tip4")}</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="reports">
                      <AccordionTrigger>{t("faqContent.assessmentInfo.reportsQuestion")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.assessmentInfo.reportsAnswer")}</p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{t("faqContent.assessmentInfo.onlineResults")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{t("faqContent.assessmentInfo.pdfReport")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{t("faqContent.assessmentInfo.developmentRecs")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{t("faqContent.assessmentInfo.percentileRankings")}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{t("faqContent.assessmentInfo.careerInsights")}</span>
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Technical Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {t("faqContent.technicalSupport.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="technical-requirements">
                      <AccordionTrigger>{t("faqContent.technicalSupport.requirementsQuestion")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.technicalSupport.requirementsAnswer")}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h5 className="font-medium">{t("faqContent.technicalSupport.supportedBrowsers")}</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• {t("faqContent.technicalSupport.chrome")}</li>
                                <li>• {t("faqContent.technicalSupport.firefox")}</li>
                                <li>• {t("faqContent.technicalSupport.safari")}</li>
                                <li>• {t("faqContent.technicalSupport.edge")}</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium">{t("faqContent.technicalSupport.deviceRequirements")}</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• {t("faqContent.technicalSupport.stableConnection")}</li>
                                <li>• {t("faqContent.technicalSupport.modernDevice")}</li>
                                <li>• {t("faqContent.technicalSupport.javascriptEnabled")}</li>
                                <li>• {t("faqContent.technicalSupport.cookiesEnabled")}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="support">
                      <AccordionTrigger>{t("faqContent.technicalSupport.supportQuestion")}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{t("faqContent.technicalSupport.supportAnswer")}</p>
                          <div className="space-y-3">
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">{t("faqContent.technicalSupport.emailSupport")}</h5>
                              <p className="text-sm text-muted-foreground">
                                {t("faqContent.technicalSupport.emailSupportDesc")}
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">{t("faqContent.technicalSupport.documentation")}</h5>
                              <p className="text-sm text-muted-foreground">
                                {t("faqContent.technicalSupport.documentationDesc")}
                              </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">{t("faqContent.technicalSupport.responseTime")}</h5>
                              <p className="text-sm text-muted-foreground">
                                {t("faqContent.technicalSupport.responseTimeDesc")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Quick Links & Downloads */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {t("faqContent.quickActions.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/assessment">
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("faqContent.quickActions.viewAllAssessments")}
                    </Button>
                  </Link>
                  <Link to="/sample-reports">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      {t("faqContent.quickActions.sampleReports")}
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      {t("faqContent.quickActions.aboutUs")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Downloads Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    {t("faqContent.downloads.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("faqContent.downloads.description")}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">{t("faqContent.downloads.assessmentGuides")}</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("faqContent.downloads.assessmentGuidesDesc")}
                      </p>
                      <Link to="/marketing-materials">
                        <Button size="sm" variant="outline" className="w-full">
                          {t("faqContent.downloads.accessGuides")}
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">{t("faqContent.downloads.marketingMaterials")}</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("faqContent.downloads.marketingMaterialsDesc")}
                      </p>
                      <Link to="/marketing-materials">
                        <Button size="sm" variant="outline" className="w-full">
                          {t("faqContent.downloads.downloadMaterials")}
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm mb-1">{t("faqContent.downloads.technicalDocumentation")}</h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        {t("faqContent.downloads.technicalDocumentationDesc")}
                      </p>
                      <Link to="/marketing-materials">
                        <Button size="sm" variant="outline" className="w-full">
                          {t("faqContent.downloads.viewDocumentation")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      {t("faqContent.downloads.needSomethingSpecific")}
                    </p>
                    <a href="mailto:contact@authencore.org">
                      <Button size="sm" className="w-full">
                        {t("faqContent.downloads.contactSupport")}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("faqContent.popularTopics.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • {t("faqContent.popularTopics.privacyDataSecurity")}
                  </Link>
                  <Link to="/sample-reports" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • {t("faqContent.popularTopics.sampleReports")}
                  </Link>
                  <Link to="/assessment" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • {t("faqContent.popularTopics.assessmentPricing")}
                  </Link>
                  <a href="mailto:contact@authencore.org" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • {t("faqContent.popularTopics.businessPartnerships")}
                  </a>
                  <Link to="/marketing-materials" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    • {t("faqContent.popularTopics.employerSolutions")}
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQ;