import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, Target, TrendingUp, Shield, CheckCircle2, Users, Award } from "lucide-react";

const PsychometricsInfo = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            🧠 About AuthenCore Analytics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pioneers in modern psychometric assessment
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Scientifically Validated
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
              <CardDescription>Over 130 years of scientific development in psychological measurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">Birth in the 1890s</h4>
                  <p className="text-sm text-muted-foreground">Founded by pioneers like James McKeen Cattell who coined the term "mental test" and established the first systematic approaches to psychological measurement.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">Intelligence Testing (1905)</h4>
                  <p className="text-sm text-muted-foreground">Alfred Binet developed the first practical intelligence test, establishing the foundation for modern cognitive assessment and standardized testing protocols.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-foreground">Digital Era Innovation</h4>
                  <p className="text-sm text-muted-foreground">Modern psychometrics leverages AI and machine learning to provide more accurate, personalized, and actionable insights than ever before.</p>
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
              <CardDescription>Rigorous methodology ensuring reliability and validity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Item Development</h4>
                    <p className="text-sm text-muted-foreground">Each question undergoes extensive development, review by subject matter experts, and pilot testing to ensure clarity and effectiveness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Validation Studies</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive studies with diverse populations validate that assessments measure what they claim to measure and predict relevant outcomes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Statistical Analysis</h4>
                    <p className="text-sm text-muted-foreground">Advanced statistical techniques including factor analysis, item response theory, and machine learning ensure optimal assessment performance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Continuous Refinement</h4>
                    <p className="text-sm text-muted-foreground">Regular updates and improvements based on new research, user feedback, and evolving best practices in psychological measurement.</p>
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
              <CardDescription>Industry-leading benchmarks for measurement precision</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-purple-800">Reliability</span>
                  <span className="text-lg font-bold text-purple-600">α ≥ 0.85 (Excellent)</span>
                </div>
                <p className="text-sm text-purple-700">Consistent results across multiple administrations, ensuring your assessment scores are stable and dependable over time.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-800">Validity</span>
                  <span className="text-lg font-bold text-blue-600">r ≥ 0.70 (Strong)</span>
                </div>
                <p className="text-sm text-blue-700">Measures what it claims to measure, with strong correlations to real-world behaviors and outcomes that matter to you.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-800">Predictive Power</span>
                  <span className="text-lg font-bold text-green-600">R² ≥ 0.25 (Substantial)</span>
                </div>
                <p className="text-sm text-green-700">Demonstrates significant ability to predict future performance, career success, and behavioral outcomes.</p>
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
              Assessment Experience
            </CardTitle>
            <CardDescription>What to expect during your psychometric assessment journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Initial Setup</h3>
                    <p className="text-muted-foreground">Create your secure profile and select assessments tailored to your goals and interests.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Assessment Completion</h3>
                    <p className="text-muted-foreground">Complete assessments at your own pace with clear instructions and progress tracking.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Instant Processing</h3>
                    <p className="text-muted-foreground">Advanced AI algorithms analyze your responses using cutting-edge psychometric models.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Detailed Results</h3>
                    <p className="text-muted-foreground">Receive comprehensive reports with visual charts, explanations, and personalized insights.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Actionable Recommendations</h3>
                    <p className="text-muted-foreground">Get specific strategies and development plans based on your unique psychological profile.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="text-primary font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Ongoing Support</h3>
                    <p className="text-muted-foreground">Access follow-up resources, progress tracking, and additional assessments as you grow.</p>
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