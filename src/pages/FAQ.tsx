import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, BookOpen, Users, Settings, HelpCircle, FileText, CheckCircle, Building2, TrendingUp, Shield, Briefcase, Globe, Target, DollarSign, Clock } from "lucide-react";
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

              {/* Business & Industry Solutions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Business & Industry Solutions
                  </CardTitle>
                  <CardDescription>
                    Comprehensive information for organizations, HR professionals, and business leaders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="enterprise-solutions">
                      <AccordionTrigger>What enterprise solutions does AuthenCore offer?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore provides comprehensive enterprise solutions designed for organizations of all sizes, from startups to Fortune 500 companies.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Bulk Assessment Management
                              </h4>
                              <p className="text-sm text-muted-foreground">Administer assessments to hundreds of candidates simultaneously with centralized reporting and analytics.</p>
                            </div>
                            <div className="p-4 bg-secondary/5 rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Advanced Analytics Dashboard
                              </h4>
                              <p className="text-sm text-muted-foreground">Real-time insights, predictive analytics, and comprehensive reporting for data-driven hiring decisions.</p>
                            </div>
                            <div className="p-4 bg-accent/5 rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                White-Label Solutions
                              </h4>
                              <p className="text-sm text-muted-foreground">Customize the platform with your company branding and integrate seamlessly with existing systems.</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                API Integration
                              </h4>
                              <p className="text-sm text-muted-foreground">Connect with your HRIS, ATS, and other enterprise systems for streamlined workflows.</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="hr-benefits">
                      <AccordionTrigger>How can HR departments benefit from AuthenCore assessments?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>HR departments leverage AuthenCore assessments across the entire employee lifecycle to make informed decisions and improve organizational outcomes.</p>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="font-medium text-blue-900 dark:text-blue-100">Recruitment & Selection</h5>
                                <p className="text-sm text-blue-800 dark:text-blue-200">Identify top talent, reduce time-to-hire by 40%, and improve quality of hire with scientific assessment data.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="font-medium text-green-900 dark:text-green-100">Performance Management</h5>
                                <p className="text-sm text-green-800 dark:text-green-200">Create personalized development plans, identify high-potential employees, and track growth over time.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                              <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="font-medium text-purple-900 dark:text-purple-100">Team Building & Culture</h5>
                                <p className="text-sm text-purple-800 dark:text-purple-200">Build cohesive teams, improve communication, and align individual strengths with organizational culture.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                              <Briefcase className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h5 className="font-medium text-orange-900 dark:text-orange-100">Succession Planning</h5>
                                <p className="text-sm text-orange-800 dark:text-orange-200">Identify future leaders, plan career progressions, and ensure organizational continuity.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="industry-specific">
                      <AccordionTrigger>Which industries use AuthenCore assessments?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore assessments are trusted by organizations across diverse industries, each leveraging our platform for their unique needs.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">Healthcare & Life Sciences</h5>
                              <p className="text-sm text-muted-foreground">Assess emotional intelligence for patient care, stress resilience for high-pressure roles, and cultural intelligence for diverse patient populations.</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">Financial Services</h5>
                              <p className="text-sm text-muted-foreground">Evaluate leadership potential, authentic decision-making, and stress management for high-stakes financial environments.</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">Technology & Innovation</h5>
                              <p className="text-sm text-muted-foreground">Identify digital wellness awareness, communication styles for remote teams, and adaptability for fast-changing environments.</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">Education & Training</h5>
                              <p className="text-sm text-muted-foreground">Assess cultural intelligence for diverse student bodies, emotional intelligence for student interactions, and authentic leadership for administration.</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">Manufacturing & Operations</h5>
                              <p className="text-sm text-muted-foreground">Evaluate stress resilience for operational roles, leadership potential for management, and team communication for collaborative environments.</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <h5 className="font-medium mb-1">Consulting & Professional Services</h5>
                              <p className="text-sm text-muted-foreground">Assess communication styles for client interactions, cultural intelligence for global projects, and authentic leadership for team management.</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="cost-benefit">
                      <AccordionTrigger>What's the ROI of implementing AuthenCore assessments?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Organizations typically see significant returns on investment within 6-12 months of implementing AuthenCore assessments.</p>
                          <div className="space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Measurable Cost Savings</h5>
                              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                                <li>• 65% reduction in mis-hiring costs (average savings: $240,000 annually)</li>
                                <li>• 40% decrease in time-to-hire (saves 15-20 hours per position)</li>
                                <li>• 50% reduction in early turnover (first-year retention improvement)</li>
                                <li>• 30% increase in employee productivity within first quarter</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Revenue Enhancement</h5>
                              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• 25% improvement in team performance metrics</li>
                                <li>• 20% increase in customer satisfaction scores</li>
                                <li>• 35% faster promotion readiness for high-potential employees</li>
                                <li>• 45% improvement in leadership effectiveness ratings</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                              <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Strategic Benefits</h5>
                              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                                <li>• Enhanced employer brand and candidate experience</li>
                                <li>• Improved diversity and inclusion outcomes</li>
                                <li>• Reduced legal risks from hiring bias</li>
                                <li>• Data-driven succession planning capabilities</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="implementation">
                      <AccordionTrigger>How long does implementation take?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Implementation timelines vary based on organization size and complexity, but most clients are fully operational within 2-8 weeks.</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <div>
                                <span className="font-medium">Basic Setup (50-200 employees)</span>
                                <p className="text-sm text-muted-foreground">Standard assessments, basic reporting</p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                1-2 weeks
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <div>
                                <span className="font-medium">Enterprise Setup (200-1000 employees)</span>
                                <p className="text-sm text-muted-foreground">Custom workflows, API integration, advanced analytics</p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                3-4 weeks
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <div>
                                <span className="font-medium">Complex Enterprise (1000+ employees)</span>
                                <p className="text-sm text-muted-foreground">Multi-location, white-label, full customization</p>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                6-8 weeks
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Implementation Includes:</h5>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• Dedicated customer success manager</li>
                              <li>• Technical integration support</li>
                              <li>• Admin and user training sessions</li>
                              <li>• Custom branding and configuration</li>
                              <li>• Data migration assistance</li>
                              <li>• Go-live support and monitoring</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="pricing-models">
                      <AccordionTrigger>What pricing models are available for businesses?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore offers flexible pricing models to meet diverse organizational needs and budgets.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <h5 className="font-medium">Pay-Per-Assessment</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Perfect for smaller organizations or seasonal hiring</p>
                              <ul className="text-sm space-y-1">
                                <li>• Individual assessment pricing</li>
                                <li>• No monthly commitments</li>
                                <li>• Volume discounts available</li>
                                <li>• 30-day support included</li>
                              </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <h5 className="font-medium">Subscription Plans</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Ideal for regular hiring and ongoing development</p>
                              <ul className="text-sm space-y-1">
                                <li>• Monthly or annual billing</li>
                                <li>• Unlimited assessments per tier</li>
                                <li>• Advanced reporting included</li>
                                <li>• Priority support access</li>
                              </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-4 w-4 text-purple-600" />
                                <h5 className="font-medium">Enterprise Licensing</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Comprehensive solution for large organizations</p>
                              <ul className="text-sm space-y-1">
                                <li>• Custom pricing based on usage</li>
                                <li>• White-label options</li>
                                <li>• API access and integrations</li>
                                <li>• Dedicated account management</li>
                              </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-orange-600" />
                                <h5 className="font-medium">Partner Programs</h5>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">For consultants and HR service providers</p>
                              <ul className="text-sm space-y-1">
                                <li>• Reseller pricing tiers</li>
                                <li>• Co-branding opportunities</li>
                                <li>• Training and certification</li>
                                <li>• Marketing support included</li>
                              </ul>
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                            <p className="font-medium mb-2">Need a custom quote?</p>
                            <p className="text-sm text-muted-foreground mb-3">Contact our sales team for personalized pricing based on your specific requirements.</p>
                            <a href="mailto:sales@authencore.org">
                              <Button size="sm">Get Custom Quote</Button>
                            </a>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="compliance-security">
                      <AccordionTrigger>What compliance and security standards does AuthenCore meet?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore maintains the highest standards of security and compliance to protect sensitive assessment data and meet global regulatory requirements.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h5 className="font-medium flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-600" />
                                Security Certifications
                              </h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• SOC 2 Type II Compliant</li>
                                <li>• ISO 27001 Information Security</li>
                                <li>• GDPR and CCPA Compliant</li>
                                <li>• HIPAA Ready Infrastructure</li>
                                <li>• 256-bit SSL Encryption</li>
                                <li>• Multi-factor Authentication</li>
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h5 className="font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-600" />
                                Global Compliance
                              </h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• EEOC Guidelines Adherence</li>
                                <li>• ADA Accessibility Standards</li>
                                <li>• International Data Transfers</li>
                                <li>• Right to be Forgotten</li>
                                <li>• Data Portability Rights</li>
                                <li>• Regional Privacy Laws</li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Ethical Assessment Practices</h5>
                            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                              <li>• Scientifically validated instruments</li>
                              <li>• Bias detection and mitigation</li>
                              <li>• Adverse impact monitoring</li>
                              <li>• Candidate consent management</li>
                              <li>• Equal opportunity compliance</li>
                              <li>• Regular fairness auditing</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Pricing & Business Operations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing & Business Operations
                  </CardTitle>
                  <CardDescription>
                    Transparent pricing, billing, and business process information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="volume-discounts">
                      <AccordionTrigger>Are volume discounts available?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>Yes, AuthenCore offers competitive volume discounts for organizations conducting multiple assessments.</p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">10-49 assessments</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">10% discount</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">50-199 assessments</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">20% discount</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">200-499 assessments</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">30% discount</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                              <span className="font-medium">500+ assessments</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Custom pricing</Badge>
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>Annual contracts</strong> receive additional 15% discount on top of volume pricing. 
                              Contact our sales team for custom enterprise pricing for 1000+ assessments.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="billing-options">
                      <AccordionTrigger>What billing and payment options are available?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore offers flexible billing options to accommodate different organizational preferences and requirements.</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">Payment Methods</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Credit/Debit Cards (Visa, MasterCard, Amex)</li>
                                <li>• Bank Transfers (ACH/Wire)</li>
                                <li>• Purchase Orders</li>
                                <li>• Corporate Credit Lines</li>
                                <li>• International Banking</li>
                              </ul>
                            </div>
                            <div className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">Billing Frequencies</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Pay-per-use (immediate billing)</li>
                                <li>• Monthly subscriptions</li>
                                <li>• Quarterly billing cycles</li>
                                <li>• Annual prepayment (discount eligible)</li>
                                <li>• Custom enterprise terms</li>
                              </ul>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <h5 className="font-medium text-green-900 dark:text-green-100 mb-1">Enterprise Benefits</h5>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Enterprise customers receive NET 30 payment terms, dedicated account management, 
                              and custom invoicing options including multi-department cost allocation.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="refund-policy">
                      <AccordionTrigger>What is the refund and cancellation policy?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>AuthenCore maintains a fair and transparent refund policy to ensure customer satisfaction.</p>
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Individual Assessments</h5>
                              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Full refund if cancelled before assessment starts</li>
                                <li>• 50% refund if cancelled within first 25% of assessment</li>
                                <li>• No refund after 25% completion due to AI processing costs</li>
                                <li>• Technical issues: Full refund or free retake</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                              <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">Subscription Services</h5>
                              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                                <li>• 30-day money-back guarantee for new subscriptions</li>
                                <li>• Cancel anytime with 30-day notice</li>
                                <li>• Prorated refunds for unused subscription time</li>
                                <li>• Annual subscriptions: Refund remaining months minus 15% processing fee</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                              <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Enterprise Contracts</h5>
                              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                                <li>• Custom refund terms negotiated per contract</li>
                                <li>• Satisfaction guarantee periods available</li>
                                <li>• Unused assessment credits carry forward</li>
                                <li>• Contract modifications allowed with mutual agreement</li>
                              </ul>
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