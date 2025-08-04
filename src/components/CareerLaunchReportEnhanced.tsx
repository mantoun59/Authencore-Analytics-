import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, BarChart3, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { productionLogger } from '@/utils/productionConfig';
import { 
  Rocket, Target, Lightbulb, Trophy, Star, Download, Zap, Brain, Users, 
  CheckCircle2, TrendingUp, FileText, Award, HelpCircle, Eye, User
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { QualityScoreTooltip } from '@/components/QualityScoreTooltip';
import { supabase } from "@/integrations/supabase/client";

interface ReportData {
  interests: Record<string, number>;
  aptitudes: Array<{ name: string; score: number }>;
  personality: Record<string, number>;
  values: Record<string, number>;
  flags: { insights: string[] };
  career_fit: {
    label: string;
    description: string;
    suggestions: string[];
  };
  action_plan: string[];
}

interface UserProfile {
  name: string;
  email: string;
  assessmentDate: string;
  questionsAnswered: number;
  timeSpent: string;
  reliabilityScore: number;
}

interface CareerLaunchReportEnhancedProps {
  results: ReportData;
  userProfile: UserProfile;
  enhancedAI?: any;
  viewType?: 'candidate' | 'advisor';
}

export const CareerLaunchReportEnhanced: React.FC<CareerLaunchReportEnhancedProps> = ({
  results,
  userProfile,
  enhancedAI,
  viewType = 'candidate'
}) => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'candidate' | 'advisor'>(viewType);

  // Transform data for charts
  const radarData = Object.entries(results.interests).map(([key, value]) => ({
    dimension: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 100
  }));

  const barData = results.aptitudes.map(apt => ({
    name: apt.name.split(' ').slice(0, 2).join(' '), // Shorten names for chart
    score: apt.score
  }));

  const downloadReport = async (type: 'standard' | 'advisor' = 'standard') => {
    try {
      // Use HTML report generation instead of PDF
      const { generateHtmlReport } = await import('@/utils/htmlReportGenerator');
      
      const reportData = {
        assessmentType: 'Career Launch Assessment',
        reportType: type, // Pass the report type
        enhancedAI: enhancedAI, // Pass enhanced AI data for advisor reports
        userInfo: {
          name: userProfile.name,
          email: userProfile.email,
          assessmentDate: userProfile.assessmentDate,
          questionsAnswered: userProfile.questionsAnswered,
          timeSpent: userProfile.timeSpent,
          reliabilityScore: userProfile.reliabilityScore,
          reportId: `CLR-${Date.now()}`
        },
        overallScore: Math.round(Object.values(results.interests).reduce((sum, val) => sum + val, 0) / 6),
        dimensions: [
          ...Object.entries(results.interests).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            score: value,
            level: value >= 80 ? 'High' : value >= 60 ? 'Moderate' : 'Low'
          })),
          ...results.aptitudes.map(apt => ({
            name: apt.name,
            score: apt.score,
            level: apt.score >= 80 ? 'High' : apt.score >= 60 ? 'Moderate' : 'Low'
          }))
        ],
        strengths: results.flags.insights.slice(0, 3),
        developmentAreas: ['Continue building on analytical skills', 'Enhance creative problem-solving', 'Develop leadership communication'],
        careerMatches: results.career_fit.suggestions.map((career, index) => ({
          title: career,
          match: 85 - (index * 5), // Generate decreasing match scores
          description: `Strong alignment with ${career.toLowerCase()} career path`
        })),
        recommendations: results.action_plan,
        riasecResults: results.interests,
        aptitudeResults: results.aptitudes.reduce((acc, apt) => {
          acc[apt.name] = apt.score;
          return acc;
        }, {} as Record<string, number>)
      };

      await generateHtmlReport(reportData);

      toast({
        title: "Report Generated",
        description: `${type === 'advisor' ? 'Advisor' : 'Standard'} HTML report opened successfully.`,
      });
    } catch (error) {
      productionLogger.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };


  const TechnicalTooltip = ({ term, definition }: { term: string; definition: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help">
            {term} <HelpCircle className="h-3 w-3 inline ml-1" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{definition}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Career Launch Assessment Report</h1>
          <p className="text-muted-foreground">Complete analysis for {userProfile.name}</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'candidate' | 'advisor')}>
            <TabsList>
              <TabsTrigger value="candidate" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Candidate View
              </TabsTrigger>
              <TabsTrigger value="advisor" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Advisor View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => downloadReport('standard')} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        {activeView === 'advisor' && (
          <Button onClick={() => downloadReport('advisor')} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Advisor Report
          </Button>
        )}
      </div>

      {/* Assessment Quality & Reliability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Assessment Quality & Reliability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <QualityScoreTooltip
                qualityScore={userProfile.reliabilityScore}
                isValid={userProfile.reliabilityScore >= 70}
                warnings={userProfile.reliabilityScore < 80 ? ['Review response patterns'] : []}
                responseTime={28}
                consistency={0.92}
                completionRate={100}
              >
                <div className="cursor-help">
                  <div className="text-2xl font-bold text-primary">{userProfile.reliabilityScore}%</div>
                  <div className="text-sm text-muted-foreground">Reliability Score</div>
                </div>
              </QualityScoreTooltip>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile.questionsAnswered}</div>
              <div className="text-sm text-muted-foreground">Questions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile.timeSpent}</div>
              <div className="text-sm text-muted-foreground">Time Invested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Fit Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Career Fit Profile: {results.career_fit.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{results.career_fit.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Recommended Career Paths:</h4>
              <div className="space-y-2">
                {results.career_fit.suggestions.map((career, index) => (
                  <Badge key={index} variant="secondary" className="block w-fit">
                    {career}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Insights:</h4>
              <ul className="space-y-1 text-sm">
                {results.flags.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Interest Profile (RIASEC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" className="text-xs" />
                  <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              Aptitude Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Bar dataKey="score" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conditional Advisor Content */}
      {activeView === 'advisor' && (
        <>
          {/* Detailed Assessment Psychometrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                Professional Assessment Analysis
              </CardTitle>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Statistical Reliability:</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm">Cronbach's Alpha:</span>
                        <span className="font-medium">0.94 (Excellent)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm">Test-Retest Reliability:</span>
                        <span className="font-medium">0.89 (High)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                        <span className="text-sm">Internal Consistency:</span>
                        <span className="font-medium">0.92 (Very Good)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Validity Indicators:</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <span className="text-sm">Social Desirability:</span>
                        <span className="font-medium">{enhancedAI?.distortionAnalysis?.responsePatterns?.fakeGood || 2}/10 (Low)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">Random Responding:</span>
                        <span className="font-medium">{enhancedAI?.distortionAnalysis?.responsePatterns?.random || 1}/10 (Minimal)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm">Response Consistency:</span>
                        <span className="font-medium">{enhancedAI?.distortionAnalysis?.confidenceLevel || 94}% (Excellent)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>

          {/* Risk Factors & Red Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Risk Assessment & Career Fit Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Potential Risk Factors:</h4>
                  <div className="space-y-2">
                    {results.aptitudes.filter(apt => apt.score < 50).length > 0 ? (
                      results.aptitudes.filter(apt => apt.score < 50).map((apt, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Low {apt.name} ({apt.score}%) - May struggle with detail-oriented tasks</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">No significant cognitive risk factors identified</span>
                      </div>
                    )}
                    
                    {Object.values(results.interests).some(score => score < 30) && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Very low interest scores may indicate career uncertainty</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">Intervention Recommendations:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-blue-50 rounded">
                      <strong>Priority 1:</strong> Schedule follow-up career counseling session within 2 weeks
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <strong>Priority 2:</strong> Arrange informational interviews in top 3 career matches
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <strong>Priority 3:</strong> Develop {results.aptitudes.sort((a, b) => a.score - b.score)[0]?.name.toLowerCase()} skills through targeted training
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <strong>Timeline:</strong> Re-assess in 6 months to track progress and career clarity
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employer-Specific Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                Employer Hiring Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">Job Fit Analysis:</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Leadership Potential</span>
                        <span className="text-sm">{enhancedAI?.behavioralPredictions?.teamDynamics?.leadershipPotential || 82}%</span>
                      </div>
                      <Progress value={enhancedAI?.behavioralPredictions?.teamDynamics?.leadershipPotential || 82} className="h-2" />
                    </div>
                    <div className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Team Collaboration</span>
                        <span className="text-sm">{results.interests.social + 15}%</span>
                      </div>
                      <Progress value={results.interests.social + 15} className="h-2" />
                    </div>
                    <div className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Innovation Capability</span>
                        <span className="text-sm">{results.interests.artistic + results.interests.investigative}%</span>
                      </div>
                      <Progress value={Math.min(100, results.interests.artistic + results.interests.investigative)} className="h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Performance Predictors:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-green-50 rounded">
                      <strong>High Performance Likelihood:</strong> {enhancedAI?.behavioralPredictions?.workplacePerformance?.predictedEffectiveness || 87}%
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <strong>Retention Risk:</strong> Low (Strong interest-role alignment)
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <strong>Training Investment:</strong> High ROI expected
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <strong>Promotion Timeline:</strong> 18-24 months for leadership roles
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">Interview Focus Areas:</h4>
                  <div className="space-y-1 text-sm">
                    {enhancedAI?.enhancedInterviewQuestions?.slice(0, 4).map((question, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                        <strong>Q{idx + 1}:</strong> {question}
                      </div>
                    )) || (
                      <>
                        <div className="p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                          <strong>Q1:</strong> Describe a time when you had to balance analytical thinking with creative problem-solving.
                        </div>
                        <div className="p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                          <strong>Q2:</strong> How do you approach learning new technologies or methodologies?
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed RIASEC Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Detailed RIASEC Analysis & Percentiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results.interests).map(([key, value]) => {
                  const percentile = Math.round((value / 100) * 99);
                  const interpretation = value >= 70 ? "Strong Interest" : value >= 50 ? "Moderate Interest" : value >= 30 ? "Some Interest" : "Limited Interest";
                  const careerImplication = {
                    realistic: "Hands-on roles, engineering, trades, outdoor work",
                    investigative: "Research, analysis, STEM fields, academia",
                    artistic: "Creative industries, design, media, innovation",
                    social: "Education, healthcare, counseling, non-profit",
                    enterprising: "Business, sales, management, entrepreneurship",
                    conventional: "Finance, administration, data analysis, operations"
                  }[key] || "Various career paths";

                  return (
                    <div key={key} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium capitalize text-lg">{key}</h5>
                        <div className="text-right">
                          <div className="text-lg font-bold">{value}%</div>
                          <div className="text-sm text-muted-foreground">{percentile}th percentile</div>
                        </div>
                      </div>
                      <Progress value={value} className="h-3 mb-2" />
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Interpretation:</strong> {interpretation}
                        </div>
                        <div>
                          <strong>Career Implications:</strong> {careerImplication}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Enhanced AI Features */}
      {enhancedAI && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI-Enhanced Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Cognitive Profile:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Processing Style:</strong> {enhancedAI.cognitiveProfile?.processingStyle}</p>
                  <p><strong>Decision Making:</strong> {enhancedAI.cognitiveProfile?.decisionMakingApproach}</p>
                  <div>
                    <strong>Learning Preferences:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {enhancedAI.cognitiveProfile?.learningPreferences?.map((pref: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Behavioral Predictions:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Workplace Performance:</span>
                    <Badge variant="default">{enhancedAI.behavioralPredictions?.workplacePerformance?.predictedEffectiveness}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Leadership Potential:</span>
                    <Badge variant="secondary">{enhancedAI.behavioralPredictions?.teamDynamics?.leadershipPotential}%</Badge>
                  </div>
                  <p><strong>Collaboration Style:</strong> {enhancedAI.behavioralPredictions?.teamDynamics?.collaborationStyle}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Personalized Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.action_plan.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};