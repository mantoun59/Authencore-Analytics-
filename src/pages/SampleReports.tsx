import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Building, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Brain,
  Heart,
  Users,
  Globe,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { aiReportGenerator, AIReportRequest } from "@/services/aiReportGenerator";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SampleReports = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('leadership');
  const [reportType, setReportType] = useState<'candidate' | 'employer'>('candidate');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSamplePDF = async () => {
    setIsGenerating(true);
    try {
      const sampleData = reportType === 'employer' 
        ? getSampleEmployerReport(selectedAssessment)
        : getSampleCandidateReport(selectedAssessment);
      
      // Convert sample data to AI report format
      const aiReportFormat = {
        candidateInfo: {
          name: sampleData.candidateInfo.name,
          email: sampleData.candidateInfo.email,
          completionDate: new Date().toISOString(),
          assessmentType: selectedAssessment,
          assessmentId: sampleData.candidateInfo.assessmentId
        },
        executiveSummary: {
          overallScore: sampleData.executiveSummary.overallScore,
          keyInsights: ["Strong analytical thinking", "Excellent communication skills", "Leadership potential"],
          topStrengths: sampleData.executiveSummary.topStrengths,
          developmentAreas: sampleData.executiveSummary.keyDevelopmentAreas,
          recommendedActions: sampleData.executiveSummary.recommendedNextSteps
        },
        detailedAnalysis: {
          dimensionScores: sampleData.dimensionScores,
          personalizedInsights: "This candidate demonstrates strong capabilities across multiple dimensions with particular strengths in strategic thinking and communication.",
          behavioralPatterns: ["Analytical approach to problems", "Collaborative working style", "Goal-oriented mindset"],
          validityMetrics: {}
        },
        actionPlan: {
          immediate: sampleData.executiveSummary.recommendedNextSteps,
          shortTerm: ["Develop leadership skills", "Expand technical expertise", "Build professional network"],
          longTerm: ["Pursue advanced certification", "Take on leadership role", "Mentor others"]
        },
        careerGuidance: {
          recommendations: (sampleData as any).careerRecommendations || ["Leadership roles", "Strategic positions", "Team management"],
          pathways: ["Individual contributor to team lead", "Specialist to manager", "Cross-functional experience"],
          skills: ["Project management", "Data analysis", "Strategic thinking", "Team leadership", "Communication skills"]
        },
        distortionAnalysis: {
          score: 15,
          reliability: 'high' as const,
          consistencyFlags: [],
          interpretation: 'Responses show high consistency and reliability, indicating authentic assessment completion.'
        }
      };
      
      toast.info(`Generating sample ${reportType} PDF report...`);
      
      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: aiReportFormat
      });

      if (response.data) {
        // Open HTML report in new window for PDF printing
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(response.data);
          newWindow.document.close();
          
          setTimeout(() => {
            newWindow.focus();
            newWindow.print();
          }, 1000);
        }
      }
      
      toast.success(`Sample ${reportType} PDF report generated successfully!`);
      
    } catch (error) {
      // Log for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Error generating sample PDF:', error);
      }
      toast.error('Failed to generate sample PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const assessments = {
    leadership: {
      title: 'Leadership Assessment',
      description: 'Comprehensive leadership evaluation with multi-dimensional analysis',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    stress: {
      title: 'Stress Resilience Assessment',
      description: 'Advanced stress resilience and adaptability evaluation',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    career: {
      title: 'CareerLaunch Assessment',
      description: 'Comprehensive career discovery assessment analyzing interests, aptitudes, personality, and values',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    cair: {
      title: 'CAIR+ Personality Assessment',
      description: 'Comprehensive personality assessment with validity detection',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    communication: {
      title: 'Communication Styles Assessment',
      description: 'Comprehensive communication assessment with linguistic analysis',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    emotional: {
      title: 'Emotional Intelligence Assessment',
      description: 'EQ assessment measuring self-awareness and social skills',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    cultural: {
      title: 'Cultural Intelligence Assessment',
      description: 'Global business and cultural awareness evaluation',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    digital: {
      title: 'Digital Wellness Assessment',
      description: 'Real-time digital wellness and behavioral tracking',
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  };

  const getSampleCandidateReport = (assessmentType: string) => {
    const baseReport = {
      candidateInfo: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        completionDate: new Date().toLocaleDateString(),
        assessmentId: `${assessmentType.toUpperCase()}-${Date.now().toString().slice(-6)}`
      }
    };

    switch (assessmentType) {
      case 'leadership':
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 82,
            readinessLevel: 'Senior Level',
            topStrengths: ['Strategic Thinking', 'Team Development', 'Decision Making'],
            keyDevelopmentAreas: ['Change Management', 'Conflict Resolution', 'Innovation Leadership'],
            recommendedNextSteps: [
              'Pursue advanced leadership certification',
              'Seek mentorship in change management',
              'Lead cross-functional strategic projects'
            ]
          },
          dimensionScores: {
            strategic_thinking: { score: 88, level: 'Excellent', interpretation: 'Strong strategic vision and planning capabilities' },
            team_leadership: { score: 85, level: 'Very Good', interpretation: 'Effective team building and motivation skills' },
            decision_making: { score: 79, level: 'Good', interpretation: 'Sound judgment with room for improvement in complex scenarios' },
            emotional_intelligence: { score: 76, level: 'Good', interpretation: 'Solid self-awareness and empathy skills' },
            change_management: { score: 71, level: 'Moderate', interpretation: 'Developing skills in leading organizational change' },
            communication: { score: 83, level: 'Very Good', interpretation: 'Clear and persuasive communication style' }
          },
          careerRecommendations: [
            'Senior Manager positions in established organizations',
            'Director-level roles in growth companies',
            'Strategic consulting opportunities'
          ]
        };
      
      case 'stress':
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 75,
            readinessLevel: 'High Resilience',
            topStrengths: ['Emotional Regulation', 'Problem-Solving Under Pressure', 'Recovery Speed'],
            keyDevelopmentAreas: ['Physical Stress Management', 'Support Network Utilization', 'Preventive Strategies'],
            recommendedNextSteps: [
              'Develop comprehensive stress management toolkit',
              'Build stronger professional support network',
              'Practice mindfulness and recovery techniques'
            ]
          },
          dimensionScores: {
            emotional_resilience: { score: 82, level: 'High', interpretation: 'Strong emotional regulation under pressure' },
            cognitive_flexibility: { score: 78, level: 'Good', interpretation: 'Effective problem-solving when stressed' },
            physical_response: { score: 68, level: 'Moderate', interpretation: 'Adequate energy management with room for improvement' },
            social_support: { score: 71, level: 'Moderate', interpretation: 'Developing skills in seeking and utilizing support' },
            adaptability: { score: 79, level: 'Good', interpretation: 'Comfortable with change and uncertainty' },
            performance_pressure: { score: 84, level: 'High', interpretation: 'Maintains high performance under deadlines' }
          },
          careerRecommendations: [
            'High-stress environment roles',
            'Crisis management positions',
            'Emergency response leadership'
          ],
          riskAssessment: {
            burnoutRisk: 'Low',
            stressThreshold: 'High',
            recoveryTime: 'Fast'
          }
        };
      
      case 'career':
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 73,
            readinessLevel: 'Career Ready',
            topStrengths: ['Learning Agility', 'Professional Communication', 'Goal Orientation'],
            keyDevelopmentAreas: ['Industry Knowledge', 'Technical Skills', 'Networking'],
            recommendedNextSteps: [
              'Apply for entry-level positions in target field',
              'Complete relevant industry certifications',
              'Build professional network through industry events'
            ]
          },
          dimensionScores: {
            skill_readiness: { score: 71, level: 'Developing', interpretation: 'Good foundation with specific skill gaps to address' },
            workplace_maturity: { score: 78, level: 'Good', interpretation: 'Professional behavior and work ethic' },
            communication_skills: { score: 81, level: 'Very Good', interpretation: 'Strong verbal and written communication' },
            problem_solving: { score: 69, level: 'Moderate', interpretation: 'Basic problem-solving with room for growth' },
            adaptability: { score: 76, level: 'Good', interpretation: 'Flexible and open to new experiences' },
            leadership_potential: { score: 67, level: 'Moderate', interpretation: 'Emerging leadership capabilities' }
          },
          careerRecommendations: [
            'Entry-level business roles',
            'Marketing and communications',
            'Project management positions'
          ],
          careerMatches: [
            { career: 'Digital Marketing Specialist', match: 85, readiness: 'Ready', growth: 'High' },
            { career: 'Business Analyst', match: 78, readiness: 'Nearly Ready', growth: 'Medium' },
            { career: 'Project Coordinator', match: 72, readiness: 'Developing', growth: 'High' }
          ]
        };
      
      default:
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 76,
            readinessLevel: 'Proficient',
            topStrengths: ['Assessment Specific Strength 1', 'Assessment Specific Strength 2', 'Assessment Specific Strength 3'],
            keyDevelopmentAreas: ['Development Area 1', 'Development Area 2', 'Development Area 3'],
            recommendedNextSteps: [
              'Focus on identified development areas',
              'Seek relevant training opportunities',
              'Apply skills in practical settings'
            ]
          },
          dimensionScores: {
            dimension_1: { score: 78, level: 'Good', interpretation: 'Strong performance in this area' },
            dimension_2: { score: 74, level: 'Moderate', interpretation: 'Adequate with room for improvement' },
            dimension_3: { score: 81, level: 'Very Good', interpretation: 'Excellent capabilities demonstrated' }
          },
          careerRecommendations: [
            'Professional development roles',
            'Industry-specific positions',
            'Growth-oriented opportunities'
          ]
        };
    }
  };

  const getSampleEmployerReport = (assessmentType: string) => {
    const candidateReport = getSampleCandidateReport(assessmentType);
    
    const employerSpecific = {
      riskAssessment: {
        hiringRisk: 'Low' as const,
        successProbability: 78,
        retentionRisk: 'Low' as const,
        rampUpTime: '2-3 months'
      },
      fitAnalysis: {
        culturalFit: 82,
        roleAlignment: 76,
        growthPotential: 84,
        managerialNeeds: [
          'Standard management approach with regular feedback',
          'Opportunities for skill development and growth',
          'Clear performance expectations and goals'
        ]
      },
      interviewGuide: {
        recommendedQuestions: [
          'Describe a challenging situation you faced and how you handled it',
          'What motivates you most in your work?',
          'How do you handle feedback and criticism?',
          'Tell me about a time you had to learn something new quickly'
        ],
        areasToExplore: [
          'Problem-solving approach and methodology',
          'Communication style and interpersonal skills',
          'Career goals and long-term aspirations',
          'Adaptability and learning agility'
        ],
        redFlags: [
          'Inconsistent responses during assessment',
          'Low engagement or rushed completion',
          'Significant gaps in key competency areas'
        ]
      },
      onboardingRecommendations: [
        'Provide comprehensive orientation program',
        'Assign experienced mentor for first 90 days',
        'Set clear 30-60-90 day goals and expectations',
        'Schedule regular check-ins and feedback sessions',
        'Offer relevant training and development opportunities'
      ]
    };

    return { ...candidateReport, ...employerSpecific };
  };

  const currentReport = reportType === 'candidate' 
    ? getSampleCandidateReport(selectedAssessment) 
    : getSampleEmployerReport(selectedAssessment);

  const renderCandidateReport = () => (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{currentReport.executiveSummary.overallScore}</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center">
              <Badge className="bg-green-100 text-green-700">
                {currentReport.executiveSummary.readinessLevel}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Readiness Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{currentReport.executiveSummary.topStrengths.length}</div>
              <div className="text-sm text-muted-foreground">Top Strengths</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{currentReport.executiveSummary.keyDevelopmentAreas.length}</div>
              <div className="text-sm text-muted-foreground">Development Areas</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-green-600">Top Strengths</h4>
              <ul className="space-y-2">
                {currentReport.executiveSummary.topStrengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-orange-600">Key Development Areas</h4>
              <ul className="space-y-2">
                {currentReport.executiveSummary.keyDevelopmentAreas.map((area, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(currentReport.dimensionScores).map(([key, dimension]) => (
              <div key={key} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                  <Badge variant="outline">{dimension.level}</Badge>
                </div>
                <div className="px-4 mb-3">
                  <Progress value={dimension.score} className="h-3" />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground px-2">
                  <span className="font-medium">{dimension.score}/100</span>
                  <span className="text-right max-w-xs">{dimension.interpretation}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentReport.executiveSummary.recommendedNextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmployerReport = () => {
    const employerReport = currentReport as any;
    
    return (
      <div className="space-y-6">
        {/* Candidate Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Candidate Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-primary">{employerReport.executiveSummary.overallScore}</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div>
                <Badge className="bg-green-100 text-green-700">
                  {employerReport.executiveSummary.readinessLevel}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Readiness Level</div>
              </div>
              <div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {employerReport.riskAssessment.hiringRisk} Risk
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Hiring Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{employerReport.riskAssessment.hiringRisk}</div>
                <div className="text-sm text-muted-foreground">Hiring Risk</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{employerReport.riskAssessment.successProbability}%</div>
                <div className="text-sm text-muted-foreground">Success Probability</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{employerReport.riskAssessment.retentionRisk}</div>
                <div className="text-sm text-muted-foreground">Retention Risk</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">{employerReport.riskAssessment.rampUpTime}</div>
                <div className="text-sm text-muted-foreground">Ramp-up Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Organizational Fit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Cultural Fit</span>
                  <span className="text-sm text-muted-foreground font-medium">{employerReport.fitAnalysis.culturalFit}%</span>
                </div>
                <div className="px-4">
                  <Progress value={employerReport.fitAnalysis.culturalFit} className="h-3" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Role Alignment</span>
                  <span className="text-sm text-muted-foreground font-medium">{employerReport.fitAnalysis.roleAlignment}%</span>
                </div>
                <div className="px-4">
                  <Progress value={employerReport.fitAnalysis.roleAlignment} className="h-3" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Growth Potential</span>
                  <span className="text-sm text-muted-foreground font-medium">{employerReport.fitAnalysis.growthPotential}%</span>
                </div>
                <div className="px-4">
                  <Progress value={employerReport.fitAnalysis.growthPotential} className="h-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">Recommended Questions</h4>
                <ul className="space-y-2">
                  {employerReport.interviewGuide.recommendedQuestions.map((question, index) => (
                    <li key={index} className="text-sm bg-blue-50 p-2 rounded">
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-orange-600">Areas to Explore</h4>
                <ul className="space-y-2">
                  {employerReport.interviewGuide.areasToExplore.map((area, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {employerReport.interviewGuide.redFlags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Red Flags</h4>
                  <ul className="space-y-2">
                    {employerReport.interviewGuide.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employerReport.onboardingRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Sample Assessment Reports</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore comprehensive sample reports for both candidates and employers 
              across our complete assessment suite
            </p>
            
            {/* Featured Career Sample Report */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold mb-3 text-primary">Featured: Career Launch Sample Report</h2>
              <p className="text-muted-foreground mb-4">
                See a complete sample of our comprehensive CareerLaunch assessment with detailed analysis and insights.
              </p>
              <Button asChild variant="default">
                <Link to="/sample-career-launch-report">
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Career Sample Report
                </Link>
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assessment" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(assessments).map(([key, assessment]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const IconComponent = assessment.icon;
                          return <IconComponent className={`h-4 w-4 ${assessment.color}`} />;
                        })()}
                        {assessment.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={reportType === 'candidate' ? 'default' : 'outline'}
                onClick={() => setReportType('candidate')}
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Candidate Report
              </Button>
              <Button
                variant={reportType === 'employer' ? 'default' : 'outline'}
                onClick={() => setReportType('employer')}
                size="sm"
              >
                <Building className="h-4 w-4 mr-2" />
                Employer Report
              </Button>
            </div>
          </div>

          {/* Assessment Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${assessments[selectedAssessment].bgColor}`}>
                  {(() => {
                    const IconComponent = assessments[selectedAssessment].icon;
                    return <IconComponent className={`h-6 w-6 ${assessments[selectedAssessment].color}`} />;
                  })()}
                </div>
                <div>
                  <CardTitle>{assessments[selectedAssessment].title}</CardTitle>
                  <CardDescription>{assessments[selectedAssessment].description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    {reportType === 'candidate' ? 'Candidate View' : 'Employer View'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Assessment ID: {currentReport.candidateInfo.assessmentId}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={generateSamplePDF}
                    disabled={isGenerating}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Download Sample PDF'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Content */}
          {reportType === 'candidate' ? renderCandidateReport() : renderEmployerReport()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SampleReports;