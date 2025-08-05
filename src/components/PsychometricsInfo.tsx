import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, Target, TrendingUp, Shield, CheckCircle2, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const PsychometricsInfo = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-24 bg-muted/30 mt-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🧠 {t("features.title")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("about.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Historical Development */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-xl">{t("psychometrics.historicalFoundation.title")}</CardTitle>
              </div>
              <CardDescription>{t("psychometrics.historicalFoundation.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">{t("psychometrics.historicalFoundation.birth1890s.title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("psychometrics.historicalFoundation.birth1890s.description")}</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">{t("psychometrics.historicalFoundation.intelligence1905.title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("psychometrics.historicalFoundation.intelligence1905.description")}</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">{t("psychometrics.historicalFoundation.digitalEra.title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("psychometrics.historicalFoundation.digitalEra.description")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process & Methodology */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-green-600" />
                <CardTitle className="text-xl">{t("psychometrics.scientificProcess.title")}</CardTitle>
              </div>
              <CardDescription>{t("psychometrics.scientificProcess.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("psychometrics.scientificProcess.itemDevelopment.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("psychometrics.scientificProcess.itemDevelopment.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("psychometrics.scientificProcess.validationStudies.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("psychometrics.scientificProcess.validationStudies.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("psychometrics.scientificProcess.statisticalAnalysis.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("psychometrics.scientificProcess.statisticalAnalysis.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{t("psychometrics.scientificProcess.continuousRefinement.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("psychometrics.scientificProcess.continuousRefinement.description")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accuracy & Reliability */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <CardTitle className="text-xl">{t("psychometrics.accuracyStandards.title")}</CardTitle>
              </div>
              <CardDescription>{t("psychometrics.accuracyStandards.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-800">{t("psychometrics.accuracyStandards.reliability.title")}</span>
                  <span className="text-lg font-bold text-purple-600">{t("psychometrics.accuracyStandards.reliability.level")}</span>
                </div>
                <p className="text-sm text-purple-700">{t("psychometrics.accuracyStandards.reliability.description")}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-800">{t("psychometrics.accuracyStandards.validity.title")}</span>
                  <span className="text-lg font-bold text-blue-600">{t("psychometrics.accuracyStandards.validity.level")}</span>
                </div>
                <p className="text-sm text-blue-700">{t("psychometrics.accuracyStandards.validity.description")}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-800">{t("psychometrics.accuracyStandards.predictivePower.title")}</span>
                  <span className="text-lg font-bold text-green-600">{t("psychometrics.accuracyStandards.predictivePower.level")}</span>
                </div>
                <p className="text-sm text-green-700">{t("psychometrics.accuracyStandards.predictivePower.description")}</p>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        {/* What to Expect */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              {t("psychometrics.assessmentExperience.title")}
            </CardTitle>
            <CardDescription>{t("psychometrics.assessmentExperience.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.assessmentExperience.step1.title")}</h3>
                    <p className="text-muted-foreground">{t("psychometrics.assessmentExperience.step1.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.assessmentExperience.step2.title")}</h3>
                    <p className="text-muted-foreground">{t("psychometrics.assessmentExperience.step2.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.assessmentExperience.step3.title")}</h3>
                    <p className="text-muted-foreground">{t("psychometrics.assessmentExperience.step3.description")}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.assessmentExperience.step4.title")}</h3>
                    <p className="text-muted-foreground">{t("psychometrics.assessmentExperience.step4.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.assessmentExperience.step5.title")}</h3>
                    <p className="text-muted-foreground">{t("psychometrics.assessmentExperience.step5.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.assessmentExperience.step6.title")}</h3>
                    <p className="text-muted-foreground">{t("psychometrics.assessmentExperience.step6.description")}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              {t("psychometrics.benefits.title")}
            </CardTitle>
            <CardDescription>{t("psychometrics.benefits.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.benefits.selfAwareness.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("psychometrics.benefits.selfAwareness.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.benefits.careerClarity.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("psychometrics.benefits.careerClarity.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.benefits.performanceEnhancement.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("psychometrics.benefits.performanceEnhancement.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.benefits.riskMitigation.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("psychometrics.benefits.riskMitigation.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.benefits.cognitiveUnderstanding.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("psychometrics.benefits.cognitiveUnderstanding.description")}</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t("psychometrics.benefits.competitiveAdvantage.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("psychometrics.benefits.competitiveAdvantage.description")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PsychometricsInfo;