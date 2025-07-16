import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, Target, TrendingUp, Shield, CheckCircle2, Users, Award } from "lucide-react";

const PsychometricsInfo = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🧠 The Science Behind Our Assessments
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Understanding Psychometrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the robust scientific foundation that powers our professional assessment platform, 
            delivering accurate insights through decades of psychological research and validation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Historical Development */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-xl">Historical Foundation</CardTitle>
              </div>
              <CardDescription>Origins and evolution of psychological measurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">1890s - Birth of Testing</h4>
                  <p className="text-sm text-muted-foreground">James McKeen Cattell coins "mental test," establishing the foundation for modern psychometrics.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">1905 - Intelligence Measurement</h4>
                  <p className="text-sm text-muted-foreground">Binet-Simon scale introduces standardized intelligence testing methods.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">1970s-Present - Digital Era</h4>
                  <p className="text-sm text-muted-foreground">Computer-adaptive testing and AI-powered analytics revolutionize assessment delivery.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process & Methodology */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-8 w-8 text-green-600" />
                <CardTitle className="text-xl">Scientific Process</CardTitle>
              </div>
              <CardDescription>How we ensure measurement precision and validity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Item Development</h4>
                    <p className="text-sm text-muted-foreground">Expert panels create questions based on established psychological theories.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Validation Studies</h4>
                    <p className="text-sm text-muted-foreground">Extensive testing with diverse populations ensures cultural fairness and accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Statistical Analysis</h4>
                    <p className="text-sm text-muted-foreground">Advanced psychometric models ensure reliability and construct validity.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Continuous Refinement</h4>
                    <p className="text-sm text-muted-foreground">Regular updates based on new research and user feedback maintain accuracy.</p>
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
                <CardTitle className="text-xl">Accuracy Standards</CardTitle>
              </div>
              <CardDescription>Proven reliability and validity metrics</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-800">Reliability</span>
                  <span className="text-lg font-bold text-purple-600">High</span>
                </div>
                <p className="text-sm text-purple-700">Consistent results across multiple testing sessions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-800">Validity</span>
                  <span className="text-lg font-bold text-blue-600">Validated</span>
                </div>
                <p className="text-sm text-blue-700">Measures what it claims to measure accurately</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-800">Predictive Power</span>
                  <span className="text-lg font-bold text-green-600">Strong</span>
                </div>
                <p className="text-sm text-green-700">Provides meaningful insights for career and personal development</p>
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
              What to Expect During Your Assessment
            </CardTitle>
            <CardDescription>A comprehensive overview of the assessment experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Pre-Assessment Setup</h3>
                    <p className="text-muted-foreground">Complete your profile and receive personalized instructions. Average setup time: 5-10 minutes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Interactive Assessment</h3>
                    <p className="text-muted-foreground">Engage with dynamic questions, scenarios, and multimedia content. Duration: 30-90 minutes depending on assessment type.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Immediate Analysis</h3>
                    <p className="text-muted-foreground">Our AI-powered system processes your responses in real-time, ensuring accurate scoring and interpretation.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Comprehensive Report</h3>
                    <p className="text-muted-foreground">Receive detailed insights with visual charts, personalized recommendations, and actionable next steps.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Follow-up Support</h3>
                    <p className="text-muted-foreground">Access to interpretation guides, career counseling resources, and optional consultation sessions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Ongoing Development</h3>
                    <p className="text-muted-foreground">Track your progress over time with periodic reassessments and skill development recommendations.</p>
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
              Benefits of Professional Psychometric Assessment
            </CardTitle>
            <CardDescription>Why psychometric testing is essential for personal and professional growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Self-Awareness</h3>
                <p className="text-sm text-muted-foreground">Gain deep insights into your personality, strengths, and areas for development.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Career Clarity</h3>
                <p className="text-sm text-muted-foreground">Make informed decisions about career paths and professional development.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Performance Enhancement</h3>
                <p className="text-sm text-muted-foreground">Optimize your work style and improve productivity through targeted insights.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Risk Mitigation</h3>
                <p className="text-sm text-muted-foreground">Identify potential challenges and develop strategies to overcome them.</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Cognitive Understanding</h3>
                <p className="text-sm text-muted-foreground">Understand your thinking patterns and decision-making processes.</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Competitive Advantage</h3>
                <p className="text-sm text-muted-foreground">Stand out in the job market with validated psychological insights.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PsychometricsInfo;