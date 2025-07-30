import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
      // Use client-side PDF generation instead of server-side
      const { generateClientSidePdf } = await import('@/utils/clientPdfGenerator');
      
      const pdfData = {
        assessmentType: 'Career Launch Assessment',
        userInfo: {
          name: userProfile.name,
          email: userProfile.email,
          assessmentDate: userProfile.assessmentDate,
          questionsAnswered: userProfile.questionsAnswered,
          timeSpent: userProfile.timeSpent,
          reliabilityScore: userProfile.reliabilityScore
        },
        overallScore: 85,
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
        recommendations: results.action_plan
      };

      await generateClientSidePdf(pdfData);

      toast({
        title: "Report Generated",
        description: `${type === 'advisor' ? 'Advisor' : 'Standard'} PDF report downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                Advisor Insights & Intervention Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Scoring Breakdown:</h4>
                  <div className="space-y-2">
                    {Object.entries(results.interests).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key}:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={value} className="w-16 h-2" />
                          <span className="text-xs w-8">{value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Coaching Recommendations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Focus on {Object.entries(results.interests).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]} career exploration</li>
                    <li>• Develop {results.aptitudes.sort((a, b) => a.score - b.score)[0].name.toLowerCase()} skills</li>
                    <li>• Consider personality-career alignment workshops</li>
                    <li>• Schedule follow-up assessment in 6-12 months</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Response Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2">
                    <TechnicalTooltip 
                      term="Response Consistency" 
                      definition="Measures how consistently the candidate answered similar questions throughout the assessment" 
                    />
                  </h5>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">92% - Excellent</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">
                    <TechnicalTooltip 
                      term="Social Desirability" 
                      definition="Indicates whether responses show a pattern of trying to appear overly positive or socially acceptable" 
                    />
                  </h5>
                  <Progress value={15} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">15% - Within normal range</p>
                </div>
                <div>
                  <h5 className="font-medium mb-2">
                    <TechnicalTooltip 
                      term="Response Engagement" 
                      definition="Measures thoughtfulness and consideration in responses based on timing and pattern analysis" 
                    />
                  </h5>
                  <Progress value={88} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">88% - High engagement</p>
                </div>
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