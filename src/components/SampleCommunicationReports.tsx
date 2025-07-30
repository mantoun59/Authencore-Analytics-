import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Building, 
  Eye, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  Users,
  Target,
  MessageCircle,
  BarChart3,
  FileText,
  Star,
  Zap,
  Shield
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import EnhancedCommunicationStylesVisualizer from "./CommunicationStylesEnhancedVisualizer";

// Sample communication data
const sampleCandidateData = {
  participantName: "Alex Chen",
  participantEmail: "alex.chen@email.com",
  assessmentDate: "2024-01-30",
  
  // Core results structure matching the scoring hook
  overallScore: 78,
  communicationEffectivenessIndex: 82,
  adaptabilityScore: 75,
  
  profile: {
    type: "Socializer" as const,
    primary: "Enthusiastic and people-focused",
    secondary: "Optimistic and influential", 
    strength: "Building rapport and inspiring others",
    challenge: "Managing detailed analysis under pressure",
    workStyle: "Collaborative and energetic approach with focus on relationships"
  },

  dimensions: {
    assertiveness: { score: 72, level: "High" as const, percentile: 75, description: "Confident communication with clear direction" },
    expressiveness: { score: 88, level: "Very High" as const, percentile: 90, description: "Highly engaging and animated communication" },
    informationProcessing: { score: 65, level: "Low" as const, percentile: 60, description: "Developing systematic information handling" },
    channelPreferences: { score: 81, level: "High" as const, percentile: 82, description: "Adaptable across communication platforms" },
    listeningPatterns: { score: 79, level: "High" as const, percentile: 78, description: "Active listening with empathetic responses" },
    influenceStrategies: { score: 84, level: "Very High" as const, percentile: 85, description: "Effective persuasion and motivation" },
    conflictCommunication: { score: 68, level: "Moderate" as const, percentile: 65, description: "Developing conflict resolution skills" }
  },

  contextualEffectiveness: {
    leadership: 73,
    teamwork: 85,
    customerService: 82,
    salesNegotiation: 67,
    conflictResolution: 67,
    publicSpeaking: 79
  },

  distortionAnalysis: {
    score: 15,
    level: "Low" as const,
    indicators: [],
    reliability: "High" as const,
    recommendations: [],
    consistencyCheck: 0.89,
    extremePatterns: 0.1,
    socialDesirabilityBias: 0.2,
    responseTimePattern: 0.3,
    // Additional properties used in templates
    responseConsistency: 0.89,
    engagementLevel: "High",
    recommendationsConfidence: "High"
  },

  developmentAreas: [
    {
      area: "Information Processing",
      priority: "Medium",
      currentLevel: "Developing",
      description: "Building systematic approaches to handling complex information",
      actionItems: [
        "Practice structured note-taking techniques",
        "Develop frameworks for analyzing complex data",
        "Ask clarifying questions before responding"
      ]
    },
    {
      area: "Conflict Communication",
      priority: "High", 
      currentLevel: "Developing",
      description: "Enhancing skills in difficult conversations and conflict resolution",
      actionItems: [
        "Learn structured conflict resolution frameworks",
        "Practice staying objective during disagreements",
        "Develop win-win solution finding skills"
      ]
    }
  ],

  // Required by CommunicationStylesResults interface
  completedAt: new Date().toISOString(),
  timeSpent: 1200, // 20 minutes in seconds
  responsePattern: "Consistent and engaged response pattern with moderate timing variance"
};

const sampleEmployerData = {
  candidateProfile: sampleCandidateData,
  
  employerAnalysis: {
    fitAssessment: {
      overall: 82,
      cultural: 85,
      roleSpecific: 78,
      teamDynamics: 88
    },
    
    roleRecommendations: [
      {
        role: "Team Lead - Marketing",
        fitScore: 89,
        reasoning: "Excellent interpersonal skills and influence capabilities align well with motivating marketing teams",
        requirements: ["Develop analytical skills for campaign metrics", "Strengthen conflict resolution abilities"]
      },
      {
        role: "Customer Success Manager", 
        fitScore: 86,
        reasoning: "Strong customer interaction scores and relationship-building abilities",
        requirements: ["Practice systematic problem-solving approaches", "Develop technical documentation skills"]
      },
      {
        role: "Sales Representative",
        fitScore: 84,
        reasoning: "High influence strategies and expressiveness support sales success",
        requirements: ["Build consultative selling skills", "Develop CRM data management habits"]
      }
    ],

    interviewSuggestions: {
      strengths: [
        {
          area: "Relationship Building",
          questions: [
            "Tell me about a time you built strong relationships with a difficult team member",
            "How do you maintain energy and motivation in your team during challenging periods?",
            "Describe your approach to making new team members feel welcome and engaged"
          ]
        },
        {
          area: "Influence & Persuasion",
          questions: [
            "Walk me through how you convinced stakeholders to support a challenging initiative",
            "How do you adapt your communication style when presenting to different audiences?",
            "Tell me about a time you had to sell an unpopular idea to your team"
          ]
        }
      ],
      
      developmentAreas: [
        {
          area: "Analytical Thinking",
          questions: [
            "Describe your process for analyzing complex problems with multiple variables",
            "How do you ensure accuracy when working with detailed data or processes?",
            "Tell me about a time you had to make a decision with incomplete information"
          ],
          assessmentTips: "Look for structured thinking patterns and systematic approaches. May need support systems for complex analysis."
        },
        {
          area: "Conflict Resolution",
          questions: [
            "Describe a difficult conflict you had to resolve between team members",
            "How do you handle situations where you disagree strongly with a colleague?",
            "Walk me through your approach when delivering difficult feedback"
          ],
          assessmentTips: "Assess comfort level with direct confrontation. May benefit from conflict resolution training."
        }
      ]
    },

    managementRecommendations: {
      motivationFactors: [
        "Recognition for team building and relationship achievements",
        "Opportunities to lead collaborative projects",
        "Social interaction and team-based work environments",
        "Variety in daily tasks and interaction with different people"
      ],
      
      managementStyle: "Provide clear expectations while allowing autonomy in relationship-building. Offer regular feedback and social recognition. Create structured frameworks for analytical tasks.",
      
      developmentSupport: [
        "Provide systematic training in data analysis and process management",
        "Pair with detail-oriented colleagues for complex projects",
        "Offer conflict resolution and difficult conversation training",
        "Create templates and frameworks for analytical work"
      ],

      teamIntegration: {
        idealTeammates: ["Detail-oriented analysts", "Process-focused coordinators", "Strategic thinkers"],
        roleInTeam: "Team motivator and relationship catalyst",
        potentialChallenges: ["May need support with detail-heavy tasks", "Could benefit from structured conflict resolution processes"]
      }
    },

    riskFactors: [
      {
        factor: "Information Processing",
        risk: "Medium",
        description: "May struggle with detailed analysis under time pressure",
        mitigation: "Provide structured frameworks and tools for complex analysis"
      },
      {
        factor: "Conflict Avoidance",
        risk: "Medium", 
        description: "May avoid or delay difficult conversations",
        mitigation: "Provide conflict resolution training and clear escalation processes"
      }
    ]
  }
};

interface SampleCommunicationReportsProps {
  type?: 'candidate' | 'employer';
}

const SampleCommunicationReports: React.FC<SampleCommunicationReportsProps> = ({ type = 'candidate' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportType, setReportType] = useState<'candidate' | 'employer'>(type);

  const viewReport = (format: 'html' | 'print') => {
    const reportContent = generateReportHTML(reportType);
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportContent);
      newWindow.document.close();
      
      if (format === 'print') {
        setTimeout(() => {
          newWindow.focus();
          newWindow.print();
        }, 1000);
      }
    }
  };

  const generateReportHTML = (type: 'candidate' | 'employer'): string => {
    if (type === 'candidate') {
      const data = sampleCandidateData;
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Communication Styles Assessment - Candidate Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #1f2937; }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
            .section { margin: 30px 0; padding: 25px; border-left: 4px solid #3b82f6; background: #f8fafc; }
            .score-large { font-size: 36px; font-weight: bold; color: #3b82f6; }
            .score-medium { font-size: 24px; font-weight: bold; color: #059669; }
            .strength { color: #059669; font-weight: 600; }
            .development { color: #dc2626; font-weight: 600; }
            .dimension-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .dimension-card { padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; }
            .progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; margin: 8px 0; }
            .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #06b6d4); border-radius: 4px; }
            .alert { padding: 15px; border-radius: 8px; margin: 15px 0; }
            .alert-info { background: #dbeafe; border-left: 4px solid #3b82f6; }
            .alert-warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
            ul { list-style: none; padding: 0; }
            li { margin: 8px 0; padding: 8px 12px; background: white; border-radius: 4px; border-left: 3px solid #3b82f6; }
            .print-only { display: none; }
            @media print { .print-only { display: block; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🔗 AutenCore Communications</div>
            <h1>Communication Styles Assessment Report</h1>
            <div style="font-size: 18px; margin: 10px 0;">
              <strong>Participant:</strong> ${data.participantName}<br>
              <strong>Assessment Date:</strong> ${data.assessmentDate}<br>
              <strong>Report Type:</strong> Individual Development Report
            </div>
          </div>
          
          <div class="section">
            <h2>🎯 Executive Summary</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; margin: 20px 0;">
              <div>
                <div class="score-large">${data.overallScore}%</div>
                <div>Overall Effectiveness</div>
              </div>
              <div>
                <div class="score-large">${data.communicationEffectivenessIndex}%</div>
                <div>CEI Score</div>
              </div>
              <div>
                <div class="score-large">${data.adaptabilityScore}%</div>
                <div>Adaptability</div>
              </div>
            </div>
            
            <div class="alert alert-info">
              <strong>Communication Profile:</strong> ${data.profile.type} Style<br>
              <strong>Primary Strength:</strong> ${data.profile.strength}<br>
              <strong>Development Focus:</strong> ${data.profile.challenge}
            </div>
          </div>

          <div class="section">
            <h2>📊 Dimension Analysis</h2>
            <div class="dimension-grid">
              ${Object.entries(data.dimensions).map(([key, dim]: [string, any]) => `
                <div class="dimension-card">
                  <h4>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</h4>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="score-medium">${dim.score}%</span>
                    <span class="badge">${dim.level}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${dim.score}%;"></div>
                  </div>
                  <p style="font-size: 14px; margin: 8px 0 0 0;">${dim.description}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>🚀 Development Plan</h2>
            ${data.developmentAreas.map((area: any) => `
              <div style="margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h4 style="color: #dc2626;">${area.area} (${area.priority} Priority)</h4>
                <p><strong>Current Level:</strong> ${area.currentLevel}</p>
                <p>${area.description}</p>
                <h5>Action Items:</h5>
                <ul>
                  ${area.actionItems.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>🔍 Assessment Validity & Reliability</h2>
            <div class="alert alert-info">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div><strong>Response Consistency:</strong> ${Math.round(data.distortionAnalysis.responseConsistency * 100)}%</div>
                <div><strong>Engagement Level:</strong> ${data.distortionAnalysis.engagementLevel}</div>
                <div><strong>Social Desirability Bias:</strong> ${data.distortionAnalysis.socialDesirabilityBias}</div>
                <div><strong>Recommendation Confidence:</strong> ${data.distortionAnalysis.recommendationsConfidence}</div>
              </div>
            </div>
            
            <div class="alert alert-warning">
              <strong>Interpretation Guidelines:</strong><br>
              This assessment provides insights into communication preferences and tendencies. Results should be considered alongside other factors including experience, context, and situational requirements. Regular reassessment is recommended as communication styles can evolve with development and experience.
            </div>
          </div>

          <div class="section print-only">
            <h2>📞 Next Steps</h2>
            <ul>
              <li>Review development recommendations with your manager or coach</li>
              <li>Identify specific situations to practice new communication approaches</li>
              <li>Seek feedback from colleagues on communication effectiveness</li>
              <li>Consider additional assessments or training in development areas</li>
              <li>Schedule follow-up assessment in 6-12 months to track progress</li>
            </ul>
          </div>
        </body>
        </html>
      `;
    } else {
      // Employer report
      const employerData = sampleEmployerData;
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Communication Styles Assessment - Employer Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #1f2937; }
            .header { text-align: center; border-bottom: 3px solid #7c3aed; padding-bottom: 30px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 10px; }
            .section { margin: 30px 0; padding: 25px; border-left: 4px solid #7c3aed; background: #faf5ff; }
            .score-large { font-size: 36px; font-weight: bold; color: #7c3aed; }
            .fit-score { font-size: 24px; font-weight: bold; color: #059669; }
            .role-card { padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; margin: 15px 0; }
            .interview-section { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 15px 0; }
            .question-list { background: white; padding: 15px; border-radius: 6px; margin: 10px 0; }
            .risk-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .risk-low { background: #d1fae5; color: #065f46; }
            .risk-medium { background: #fef3c7; color: #92400e; }
            .risk-high { background: #fee2e2; color: #991b1b; }
            .alert { padding: 15px; border-radius: 8px; margin: 15px 0; }
            .alert-info { background: #dbeafe; border-left: 4px solid #3b82f6; }
            .alert-success { background: #d1fae5; border-left: 4px solid #059669; }
            ul { list-style: none; padding: 0; }
            li { margin: 8px 0; padding: 8px 12px; background: white; border-radius: 4px; border-left: 3px solid #7c3aed; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏢 AutenCore Employer Analytics</div>
            <h1>Communication Styles Assessment - Employer Report</h1>
            <div style="font-size: 18px; margin: 10px 0;">
              <strong>Candidate:</strong> ${employerData.candidateProfile.participantName}<br>
              <strong>Assessment Date:</strong> ${employerData.candidateProfile.assessmentDate}<br>
              <strong>Report Type:</strong> Employer Decision Support
            </div>
          </div>

          <div class="section">
            <h2>🎯 Fit Assessment Summary</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; margin: 20px 0;">
              <div>
                <div class="score-large">${employerData.employerAnalysis.fitAssessment.overall}%</div>
                <div>Overall Fit</div>
              </div>
              <div>
                <div class="fit-score">${employerData.employerAnalysis.fitAssessment.cultural}%</div>
                <div>Cultural Fit</div>
              </div>
              <div>
                <div class="fit-score">${employerData.employerAnalysis.fitAssessment.roleSpecific}%</div>
                <div>Role-Specific</div>
              </div>
              <div>
                <div class="fit-score">${employerData.employerAnalysis.fitAssessment.teamDynamics}%</div>
                <div>Team Dynamics</div>
              </div>
            </div>
            
            <div class="alert alert-success">
              <strong>Profile:</strong> ${employerData.candidateProfile.profile.type} - ${employerData.candidateProfile.profile.strength}
            </div>
          </div>

          <div class="section">
            <h2>💼 Role Recommendations</h2>
            ${employerData.employerAnalysis.roleRecommendations.map((role: any) => `
              <div class="role-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h3 style="margin: 0;">${role.role}</h3>
                  <div class="fit-score">${role.fitScore}% Fit</div>
                </div>
                <p><strong>Reasoning:</strong> ${role.reasoning}</p>
                <h4>Requirements for Success:</h4>
                <ul>
                  ${role.requirements.map((req: string) => `<li>${req}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>🎤 Interview Recommendations</h2>
            
            <h3 style="color: #059669;">✓ Strength Areas to Explore</h3>
            ${employerData.employerAnalysis.interviewSuggestions.strengths.map((strength: any) => `
              <div class="interview-section">
                <h4>${strength.area}</h4>
                <div class="question-list">
                  <strong>Suggested Questions:</strong>
                  <ul>
                    ${strength.questions.map((q: string) => `<li>${q}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}

            <h3 style="color: #dc2626;">⚠️ Development Areas to Assess</h3>
            ${employerData.employerAnalysis.interviewSuggestions.developmentAreas.map((area: any) => `
              <div class="interview-section">
                <h4>${area.area}</h4>
                <div class="question-list">
                  <strong>Suggested Questions:</strong>
                  <ul>
                    ${area.questions.map((q: string) => `<li>${q}</li>`).join('')}
                  </ul>
                  <div class="alert alert-info" style="margin-top: 10px;">
                    <strong>Assessment Tips:</strong> ${area.assessmentTips}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>👥 Management Recommendations</h2>
            
            <h3>Motivation Factors</h3>
            <ul>
              ${employerData.employerAnalysis.managementRecommendations.motivationFactors.map((factor: string) => `<li>${factor}</li>`).join('')}
            </ul>

            <h3>Recommended Management Style</h3>
            <div class="alert alert-info">
              ${employerData.employerAnalysis.managementRecommendations.managementStyle}
            </div>

            <h3>Development Support Needed</h3>
            <ul>
              ${employerData.employerAnalysis.managementRecommendations.developmentSupport.map((support: string) => `<li>${support}</li>`).join('')}
            </ul>

            <h3>Team Integration</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div>
                <h4>Ideal Teammates</h4>
                <ul>
                  ${employerData.employerAnalysis.managementRecommendations.teamIntegration.idealTeammates.map((teammate: string) => `<li>${teammate}</li>`).join('')}
                </ul>
              </div>
              <div>
                <h4>Role in Team</h4>
                <p>${employerData.employerAnalysis.managementRecommendations.teamIntegration.roleInTeam}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>⚠️ Risk Assessment</h2>
            ${employerData.employerAnalysis.riskFactors.map((risk: any) => `
              <div style="margin: 15px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h4 style="margin: 0;">${risk.factor}</h4>
                  <span class="risk-badge risk-${risk.risk.toLowerCase()}">${risk.risk} Risk</span>
                </div>
                <p><strong>Description:</strong> ${risk.description}</p>
                <p><strong>Mitigation:</strong> ${risk.mitigation}</p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>📊 Assessment Reliability</h2>
            <div class="alert alert-info">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div><strong>Response Consistency:</strong> ${Math.round(employerData.candidateProfile.distortionAnalysis.responseConsistency * 100)}%</div>
                <div><strong>Engagement Level:</strong> ${employerData.candidateProfile.distortionAnalysis.engagementLevel}</div>
                <div><strong>Social Desirability Bias:</strong> ${employerData.candidateProfile.distortionAnalysis.socialDesirabilityBias}</div>
                <div><strong>Recommendation Confidence:</strong> ${employerData.candidateProfile.distortionAnalysis.recommendationsConfidence}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Communication Styles Sample Reports</CardTitle>
              <CardDescription className="text-lg">
                Comprehensive communication assessment with distortion analysis
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button 
                variant={reportType === 'candidate' ? 'default' : 'outline'}
                onClick={() => setReportType('candidate')}
              >
                <User className="w-4 h-4 mr-2" />
                Candidate
              </Button>
              <Button 
                variant={reportType === 'employer' ? 'default' : 'outline'}
                onClick={() => setReportType('employer')}
              >
                <Building className="w-4 h-4 mr-2" />
                Employer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workplace">Workplace Fit</TabsTrigger>
          <TabsTrigger value="analysis">Visual Analysis</TabsTrigger>
          <TabsTrigger value="team">Team & Validity</TabsTrigger>
          <TabsTrigger value="report">Full Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {sampleCandidateData.overallScore}%
                  </div>
                  <div className="text-sm text-slate-600">Overall Effectiveness</div>
                  <Progress value={sampleCandidateData.overallScore} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {sampleCandidateData.communicationEffectivenessIndex}%
                  </div>
                  <div className="text-sm text-slate-600">CEI Score</div>
                  <Progress value={sampleCandidateData.communicationEffectivenessIndex} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {sampleCandidateData.adaptabilityScore}%
                  </div>
                  <div className="text-sm text-slate-600">Adaptability</div>
                  <Progress value={sampleCandidateData.adaptabilityScore} className="mt-2" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Communication Profile: {sampleCandidateData.profile.type}</h4>
                <p className="text-blue-800 text-sm mb-2">
                  <strong>Strength:</strong> {sampleCandidateData.profile.strength}
                </p>
                <p className="text-blue-800 text-sm">
                  <strong>Development Focus:</strong> {sampleCandidateData.profile.challenge}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CEI Score Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Communication Effectiveness Index (CEI) Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { subject: 'Clarity', score: 82, fullMark: 100 },
                    { subject: 'Empathy', score: 85, fullMark: 100 },
                    { subject: 'Adaptability', score: 75, fullMark: 100 },
                    { subject: 'Influence', score: 84, fullMark: 100 },
                    { subject: 'Listening', score: 79, fullMark: 100 },
                    { subject: 'Assertiveness', score: 72, fullMark: 100 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={60} domain={[0, 100]} />
                    <Radar
                      name="CEI Components"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Workplace Fit Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Workplace Fit Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">High Fit Environments</h4>
                  <div className="space-y-2">
                    {[
                      { env: "Collaborative Teams", score: 94 },
                      { env: "Customer-Facing Roles", score: 89 },
                      { env: "Creative Projects", score: 86 },
                      { env: "Mentoring Positions", score: 83 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">{item.env}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">{item.score}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-700">Development Needed</h4>
                  <div className="space-y-2">
                    {[
                      { env: "Data Analysis Roles", score: 62 },
                      { env: "High-Pressure Deadlines", score: 58 },
                      { env: "Solo Work Environments", score: 55 },
                      { env: "Technical Documentation", score: 51 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="text-sm font-medium">{item.env}</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">{item.score}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Type Specific Content */}
          {reportType === 'employer' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Employer Fit Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Top Role Recommendations</h4>
                    {sampleEmployerData.employerAnalysis.roleRecommendations.slice(0, 2).map((role, index) => (
                      <div key={index} className="mb-3 p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{role.role}</span>
                          <Badge variant="secondary">{role.fitScore}% Fit</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{role.reasoning}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Key Interview Areas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Relationship Building</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Influence & Persuasion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Analytical Thinking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Conflict Resolution</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="workplace" className="space-y-6">
          {/* Dimension Analysis Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Dimension Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(sampleCandidateData.dimensions).map(([key, dim]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    score: dim.score,
                    level: dim.level
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, 'Score']}
                      labelFormatter={(label) => `Dimension: ${label}`}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <EnhancedCommunicationStylesVisualizer results={sampleCandidateData} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Assessment Validity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Assessment Validity & Distortion Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Reliability Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Response Consistency:</span>
                      <Badge variant="outline">{Math.round(sampleCandidateData.distortionAnalysis.responseConsistency * 100)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Level:</span>
                      <Badge variant="outline">{sampleCandidateData.distortionAnalysis.engagementLevel}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Desirability Bias:</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence Level:</span>
                      <Badge variant="outline">{sampleCandidateData.distortionAnalysis.recommendationsConfidence}</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Validity Indicators</h4>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      No significant distortions detected. Results show high validity and can be used confidently for decision-making and development planning.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Interpretation Guidelines:</h5>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Results reflect authentic communication preferences</li>
                      <li>• High engagement suggests motivated participation</li>
                      <li>• Low social desirability bias indicates honest responses</li>
                      <li>• Recommendations have high confidence level</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Compatibility Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Compatibility Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">92%</div>
                  <div className="text-sm text-slate-600">Team Synergy</div>
                  <div className="text-xs text-slate-500 mt-1">With collaborative teams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">87%</div>
                  <div className="text-sm text-slate-600">Leadership Potential</div>
                  <div className="text-xs text-slate-500 mt-1">In team settings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">78%</div>
                  <div className="text-sm text-slate-600">Conflict Resolution</div>
                  <div className="text-xs text-slate-500 mt-1">Mediation capability</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Ideal Team Composition</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-green-700 mb-2">Complementary Profiles</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Detail-oriented Analysts (Thinker style)</li>
                      <li>• Process-focused Coordinators (Supporter style)</li>
                      <li>• Strategic Decision-makers (Director style)</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium text-blue-700 mb-2">Team Role</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Team motivator and relationship catalyst</li>
                      <li>• Bridge between management and team members</li>
                      <li>• Culture champion and engagement driver</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {reportType === 'employer' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Interview Question Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="strengths">
                  <TabsList>
                    <TabsTrigger value="strengths">Strength Areas</TabsTrigger>
                    <TabsTrigger value="development">Development Areas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="strengths" className="space-y-4">
                    {sampleEmployerData.employerAnalysis.interviewSuggestions.strengths.map((strength, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-green-700 mb-2">{strength.area}</h4>
                        <div className="space-y-2">
                          {strength.questions.map((question, qIndex) => (
                            <div key={qIndex} className="flex items-start gap-2">
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mt-0.5">Q{qIndex + 1}</span>
                              <span className="text-sm">{question}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="development" className="space-y-4">
                    {sampleEmployerData.employerAnalysis.interviewSuggestions.developmentAreas.map((area, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-orange-700 mb-2">{area.area}</h4>
                        <div className="space-y-2 mb-3">
                          {area.questions.map((question, qIndex) => (
                            <div key={qIndex} className="flex items-start gap-2">
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-0.5">Q{qIndex + 1}</span>
                              <span className="text-sm">{question}</span>
                            </div>
                          ))}
                        </div>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            <strong>Assessment Tips:</strong> {area.assessmentTips}
                          </AlertDescription>
                        </Alert>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Complete {reportType === 'candidate' ? 'Individual' : 'Employer'} Report
              </CardTitle>
              <CardDescription>
                {reportType === 'candidate' 
                  ? 'Comprehensive development-focused report for the candidate'
                  : 'Employer-focused report with hiring and management insights'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => viewReport('html')} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </Button>
                <Button onClick={() => viewReport('print')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold mb-2">Report Includes:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Executive summary with key scores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Detailed dimension analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Development planning and action items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Validity and reliability metrics</span>
                  </div>
                  {reportType === 'employer' && (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Role fit recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Interview question suggestions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Management recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Risk assessment and mitigation</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SampleCommunicationReports;