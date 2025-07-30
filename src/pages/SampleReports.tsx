import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { EnhancedCommunicationReportGenerator } from "@/services/enhancedCommunicationReportGenerator";
import { unifiedReportGenerator } from "@/services/unifiedReportGenerator";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SampleCommunicationReports from "@/components/SampleCommunicationReports";

// Helper function to map assessment types to PDF generation function format
const getAssessmentTypeForPDF = (assessmentType: string): string => {
  const typeMapping: Record<string, string> = {
    'leadership': 'leadership_assessment',
    'leadership-assessment': 'leadership_assessment', 
    'stress-resilience': 'stress_resilience',
    'stress': 'stress_resilience',
    'burnout-prevention': 'stress_resilience',
    'burnout': 'stress_resilience',
    'career-launch': 'career_launch',
    'career': 'career_launch',
    'cair-personality': 'cair_plus',
    'cair': 'cair_plus',
    'communication': 'communication_styles',
    'emotional-intelligence': 'emotional_intelligence',
    'emotional': 'emotional_intelligence',
    'cultural-intelligence': 'cultural_intelligence',
    'cultural': 'cultural_intelligence',
    'digital-wellness': 'digital_wellness',
    'digital': 'digital_wellness',
    'faith-values': 'faith_values',
    'genz': 'genz_assessment'
  };
  
  return typeMapping[assessmentType] || assessmentType;
};

// Helper function to get display names for assessments
const getAssessmentDisplayName = (assessmentType: string): string => {
  const displayMapping: Record<string, string> = {
    'leadership': 'Leadership Assessment',
    'leadership-assessment': 'Leadership Assessment', 
    'stress-resilience': 'Stress Resilience Assessment',
    'stress': 'Stress Resilience Assessment',
    'burnout-prevention': 'Burnout Prevention Assessment',
    'burnout': 'Burnout Prevention Assessment',
    'career-launch': 'Career Launch Assessment',
    'career': 'Career Launch Assessment',
    'cair-personality': 'CAIR Plus Assessment',
    'cair': 'CAIR Plus Assessment',
    'communication': 'Communication Styles Assessment',
    'emotional-intelligence': 'Emotional Intelligence Assessment',
    'emotional': 'Emotional Intelligence Assessment',
    'cultural-intelligence': 'Cultural Intelligence Assessment',
    'cultural': 'Cultural Intelligence Assessment',
    'digital-wellness': 'Digital Wellness Assessment',
    'digital': 'Digital Wellness Assessment',
    'faith-values': 'Faith & Values Assessment',
    'genz': 'Gen Z Workplace Assessment'
  };
  
  return displayMapping[assessmentType] || 'Professional Assessment';
};

const SampleReports = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('career-launch');
  const [reportType, setReportType] = useState<'candidate' | 'employer'>('candidate');
  const [isGenerating, setIsGenerating] = useState(false);

  // URL parameter support for direct links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentParam = urlParams.get('assessment');
    // URL assessment parameter processing
    if (assessmentParam && assessments[assessmentParam as keyof typeof assessments]) {
      // Setting assessment to URL parameter
      setSelectedAssessment(assessmentParam);
    } else {
      // Assessment parameter not found, using default
    }
  }, []);

  const generateSampleReport = async () => {
    setIsGenerating(true);
    try {
      const sampleData = reportType === 'employer' 
        ? getSampleEmployerReport(selectedAssessment)
        : getSampleCandidateReport(selectedAssessment);
      
      // Use HTML report generator for ALL assessment types including communication
      const { generateHtmlReport } = await import('@/utils/htmlReportGenerator');
      
      // Communication-specific data mapping
      let reportData;
      if (selectedAssessment === 'communication' || selectedAssessment === 'communication-styles') {
        reportData = {
          assessmentType: 'Communication Styles Assessment',
          reportType: reportType === 'candidate' ? 'standard' as const : 'employer' as const,
          userInfo: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            assessmentDate: new Date().toLocaleDateString(),
            questionsAnswered: 75,
            timeSpent: '18 minutes',
            reliabilityScore: 94,
            reportId: `COMM-${Date.now()}`
          },
          overallScore: 77,
          dimensions: [
            { name: 'Assertiveness', score: 78, level: 'High', description: 'Your tendency to express opinions directly and take charge in conversations. High assertiveness indicates comfort with leading discussions and making decisions.' },
            { name: 'Expressiveness', score: 85, level: 'Very High', description: 'Your use of emotional expression, storytelling, and engaging communication. Very high expressiveness shows natural ability to captivate and motivate others.' },
            { name: 'Information Processing', score: 72, level: 'High', description: 'Your preference for detailed analysis versus quick decision-making. High processing indicates thorough consideration of information before responding.' },
            { name: 'Channel Preferences', score: 80, level: 'High', description: 'Your adaptability across different communication mediums (verbal, written, digital). High flexibility shows comfort with various communication formats.' },
            { name: 'Listening Patterns', score: 75, level: 'High', description: 'Your active listening skills and attention to others\' perspectives. High listening ability demonstrates strong empathy and understanding.' },
            { name: 'Influence Strategies', score: 82, level: 'Very High', description: 'Your ability to persuade and motivate others through communication. Very high influence indicates natural leadership and persuasion capabilities.' },
            { name: 'Conflict Communication', score: 68, level: 'Moderate', description: 'Your approach to managing disagreements and difficult conversations. Moderate level suggests room for growth in handling challenging interactions.' }
          ],
          profile: 'Dynamic Communicator - You excel at engaging others through expressive and influential communication. Your natural charisma and persuasive abilities make you effective in leadership and team environments. While you demonstrate strong listening skills, developing conflict resolution techniques will enhance your overall communication effectiveness.',
          strengths: [
            'Highly expressive and engaging communication style that captures attention',
            'Effective influence and persuasion techniques for motivating teams',
            'Adapts well to different communication channels and formats',
            'Strong active listening skills that build rapport with others',
            'Natural leadership presence in group communications'
          ],
          developmentAreas: [
            'Conflict resolution and managing difficult conversations effectively',
            'Direct communication during challenging or sensitive situations',
            'Balancing assertiveness with empathy in decision-making discussions',
            'Structured communication for complex technical topics',
            'Time management during lengthy collaborative discussions'
          ],
          recommendations: [
            'Practice active listening techniques in team meetings to enhance understanding',
            'Develop conflict mediation skills through specialized training programs',
            'Work on direct feedback delivery methods using structured frameworks',
            'Join a public speaking group to refine presentation skills',
            'Seek mentorship opportunities to develop executive communication abilities',
            'Practice written communication for complex technical documentation'
          ],
          contextualEffectiveness: {
            'Leadership Meetings': { score: 88, description: 'Excellent at facilitating discussions and driving decisions' },
            'Team Collaboration': { score: 85, description: 'Strong team player who motivates and engages colleagues' },
            'Client Presentations': { score: 82, description: 'Persuasive and engaging when presenting to external stakeholders' },
            'Conflict Resolution': { score: 65, description: 'Moderate effectiveness; benefits from structured approach' },
            'Technical Documentation': { score: 70, description: 'Good foundation but could improve clarity and structure' },
            'Cross-Cultural Communication': { score: 75, description: 'Generally effective with room for cultural sensitivity growth' }
          },
          workingStyles: {
            'Preferred Communication Style': 'Collaborative and engaging, with emphasis on relationship-building',
            'Decision Making': 'Consultative approach, seeking input before making final decisions',
            'Feedback Delivery': 'Positive and encouraging, though may avoid difficult conversations',
            'Meeting Leadership': 'Dynamic facilitator who keeps discussions engaging and productive',
            'Written Communication': 'Clear and personable, with room for more structured technical writing'
          },
          careerMatches: [
            {
              career: { title: 'Team Lead/Supervisor', description: 'Leading teams and managing projects' },
              matchPercentage: 87,
              fitScore: 85,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Conflict resolution'],
              strengthAlignment: ['Communication', 'Leadership'],
              salaryExpectation: '$65,000 - $85,000',
              growthPotential: 'High',
              developmentPath: ['Leadership training', 'Team management']
            },
            {
              career: { title: 'Customer Relationship Management', description: 'Building and maintaining customer relationships' },
              matchPercentage: 82,
              fitScore: 80,
              readinessLevel: 'Qualified',
              skillGaps: ['Technical knowledge'],
              strengthAlignment: ['Communication', 'Relationship building'],
              salaryExpectation: '$55,000 - $75,000',
              growthPotential: 'High',
              developmentPath: ['CRM systems training', 'Sales techniques']
            },
            {
              career: { title: 'Training & Development', description: 'Designing and delivering training programs' },
              matchPercentage: 79,
              fitScore: 77,
              readinessLevel: 'Qualified',
              skillGaps: ['Instructional design'],
              strengthAlignment: ['Communication', 'Teaching ability'],
              salaryExpectation: '$60,000 - $80,000',
              growthPotential: 'Medium',
              developmentPath: ['Training certification', 'Learning design']
            },
            {
              career: { title: 'Sales & Business Development', description: 'Growing business through client acquisition' },
              matchPercentage: 75,
              fitScore: 73,
              readinessLevel: 'Entry Level',
              skillGaps: ['Sales techniques', 'Market analysis'],
              strengthAlignment: ['Communication', 'Persuasion'],
              salaryExpectation: '$50,000 - $70,000',
              growthPotential: 'High',
              developmentPath: ['Sales training', 'Business development']
            }
          ],
          branding: {
            logo: '/final-logo.png',
            colors: {
              primary: '#008080',
              secondary: '#20B2AA'
            },
            company: 'AuthenCore Analytics'
          }
        };
      } else {
        // Generic data for other assessments
        reportData = {
          assessmentType: getAssessmentDisplayName(selectedAssessment),
          reportType: reportType === 'candidate' ? 'standard' as const : 'employer' as const,
          userInfo: {
            name: sampleData.candidateInfo.name,
            email: sampleData.candidateInfo.email,
            assessmentDate: sampleData.candidateInfo.completionDate,
            questionsAnswered: 60,
            timeSpent: '15 minutes',
            reliabilityScore: 92,
            reportId: `SAMPLE-${selectedAssessment.toUpperCase()}-${Date.now()}`
          },
          overallScore: sampleData.executiveSummary?.overallScore || 75,
          dimensions: Object.entries(sampleData.dimensionScores || {}).map(([key, score]: [string, any]) => ({
            name: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            score: typeof score === 'object' ? score.score : score,
            level: (typeof score === 'object' ? score.score : score) >= 70 ? 'High' : 
                   (typeof score === 'object' ? score.score : score) >= 40 ? 'Moderate' : 'Low'
          })),
          strengths: sampleData.executiveSummary?.topStrengths || [],
          developmentAreas: sampleData.executiveSummary?.keyDevelopmentAreas || [],
          recommendations: sampleData.executiveSummary?.recommendedNextSteps || [],
          careerMatches: (sampleData as any).careerMatches || (sampleData as any).careerRecommendations || [],
          branding: {
            logo: '/final-logo.png',
            colors: {
              primary: '#008080',
              secondary: '#20B2AA'
            },
            company: 'AuthenCore Analytics'
          }
        };
      }

      await generateHtmlReport(reportData);
      toast.success(`Sample ${reportType} report generated successfully!`);
      
    } catch (error) {
      console.error('Error generating sample report:', error);
      toast.error('Failed to generate sample report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to convert legacy sample data to unified format
  const convertToUnifiedFormat = (sampleData: any, assessmentType: string) => {
    return {
      assessmentId: `sample-${assessmentType}-${Date.now()}`,
      assessmentType: assessmentType,
      candidateInfo: sampleData.candidateInfo,
      overallScore: sampleData.overallScore || 75,
      overallPercentile: sampleData.overallPercentile || 75,
      dimensions: Object.entries(sampleData.scores || {}).map(([key, score]: [string, any]) => ({
        key,
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        score: typeof score === 'object' ? score.score : score,
        percentile: typeof score === 'object' ? score.percentile || score.score : score,
        level: (typeof score === 'object' ? score.score : score) >= 70 ? 'high' as const : 
               (typeof score === 'object' ? score.score : score) >= 40 ? 'medium' as const : 'low' as const,
        description: typeof score === 'object' ? score.interpretation : `Assessment of ${key}`,
        strengths: (typeof score === 'object' ? score.score : score) >= 70 ? ['Strong performance'] : [],
        growthAreas: (typeof score === 'object' ? score.score : score) < 70 ? ['Development opportunity'] : [],
        recommendations: (typeof score === 'object' ? score.score : score) < 70 ? ['Focus on improvement'] : ['Maintain excellence'],
        insights: [`Performance in ${key} shows specific patterns`]
      })),
      profile: {
        title: sampleData.profile || 'Assessment Complete',
        description: sampleData.summary || 'Assessment completed successfully',
        keyTraits: sampleData.topStrengths || []
      },
      insights: {
        strengths: sampleData.topStrengths || [],
        challenges: sampleData.keyDevelopmentAreas || [],
        opportunities: [],
        recommendations: sampleData.recommendations || []
      },
      actionPlan: {
        immediate: sampleData.recommendations?.slice(0, 2) || [],
        shortTerm: sampleData.recommendations?.slice(2, 4) || [],
        longTerm: sampleData.recommendations?.slice(4) || []
      },
      validityAssessment: {
        consistencyScore: 85,
        engagementLevel: 'high' as const,
        responsePattern: 'normal',
        flags: [],
        fakeGoodIndicator: 15,
        completionRate: 100
      },
      reportData: {
        executiveSummary: sampleData.summary || 'Assessment completed successfully',
        detailedAnalysis: 'Detailed analysis of assessment results',
        interviewQuestions: ['Tell me about your strengths', 'How do you handle challenges?'],
        hiringRecommendations: ['Consider for role', 'Provide development support'],
        onboardingPlan: ['Standard onboarding', 'Focus on development areas']
      },
      timestamp: new Date().toISOString()
    };
  };

  const generateFallbackReport = (sampleData: any, assessmentType: string, reportType: string) => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sample ${assessments[assessmentType].title} Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .section { margin: 20px 0; padding: 15px; border-left: 4px solid #0066cc; }
          .score { font-size: 24px; font-weight: bold; color: #0066cc; }
          .strength { color: #00cc00; }
          .development { color: #ff6600; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 5px 0; padding: 5px; background: #f5f5f5; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Sample ${assessments[assessmentType].title}</h1>
          <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
          <p>Candidate: ${sampleData.candidateInfo.name}</p>
          <p>Date: ${sampleData.candidateInfo.completionDate}</p>
        </div>
        
        <div class="section">
          <h3>Executive Summary</h3>
          <div class="score">Overall Score: ${sampleData.executiveSummary.overallScore}/100</div>
          <p><strong>Readiness Level:</strong> ${sampleData.executiveSummary.readinessLevel}</p>
          
          <h4 class="strength">Top Strengths:</h4>
          <ul>
            ${sampleData.executiveSummary.topStrengths.map(strength => `<li class="strength">• ${strength}</li>`).join('')}
          </ul>
          
          <h4 class="development">Development Areas:</h4>
          <ul>
            ${sampleData.executiveSummary.keyDevelopmentAreas.map(area => `<li class="development">• ${area}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h3>Detailed Analysis</h3>
          ${Object.entries(sampleData.dimensionScores).map(([key, dimension]: [string, any]) => `
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd;">
              <h4>${key.replace('_', ' ').toUpperCase()}</h4>
              <div class="score">${dimension.score}/100 - ${dimension.level}</div>
              <p>${dimension.interpretation}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h3>Recommended Next Steps</h3>
          <ul>
            ${sampleData.executiveSummary.recommendedNextSteps.map((step, index) => `<li><strong>${index + 1}.</strong> ${step}</li>`).join('')}
          </ul>
        </div>
        
        ${sampleData.careerRecommendations ? `
        <div class="section">
          <h3>Career Recommendations</h3>
          <ul>
            ${sampleData.careerRecommendations.map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </body>
      </html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportContent);
      newWindow.document.close();
      
      setTimeout(() => {
        newWindow.focus();
        newWindow.print();
      }, 1000);
    }
  };

  const assessments = {
    'leadership': {
      title: 'Leadership Assessment',
      description: 'Comprehensive leadership evaluation with multi-dimensional analysis',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    'stress-resilience': {
      title: 'Stress Resilience Assessment',
      description: 'Advanced stress resilience and adaptability evaluation',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    'burnout-prevention': {
      title: 'Burnout Prevention Assessment',
      description: 'Advanced burnout risk assessment and prevention strategies',
      icon: Brain,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    'career-launch': {
      title: 'CareerLaunch Assessment',
      description: 'Comprehensive career discovery assessment analyzing interests, aptitudes, personality, and values',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    'cair-personality': {
      title: 'CAIR+ Personality Assessment',
      description: 'Comprehensive personality assessment with validity detection',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    'communication': {
      title: 'Communication Styles Assessment',
      description: 'Comprehensive communication assessment with distortion analysis and interview suggestions',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    'emotional-intelligence': {
      title: 'Emotional Intelligence Assessment',
      description: 'EQ assessment measuring self-awareness and social skills',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    'cultural-intelligence': {
      title: 'Cultural Intelligence Assessment',
      description: 'Global business and cultural awareness evaluation',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    'digital-wellness': {
      title: 'Digital Wellness Assessment',
      description: 'Real-time digital wellness and behavioral tracking',
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    'faith-values': {
      title: 'Faith & Values Alignment Index (FVAI)',
      description: '90-question assessment analyzing faith-based values alignment across 42 dimensions',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    'genz': {
      title: 'Gen Z Workplace Assessment',
      description: 'Comprehensive Gen Z workplace readiness and cultural fit evaluation',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    // Aliases for backward compatibility
    'leadership-assessment': {
      title: 'Leadership Assessment',
      description: 'Comprehensive leadership evaluation with multi-dimensional analysis',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    'stress': {
      title: 'Stress Resilience Assessment',
      description: 'Advanced stress resilience and adaptability evaluation',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    'career': {
      title: 'CareerLaunch Assessment',
      description: 'Comprehensive career discovery assessment analyzing interests, aptitudes, personality, and values',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    'cair': {
      title: 'CAIR+ Personality Assessment',
      description: 'Comprehensive personality assessment with validity detection',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    'emotional': {
      title: 'Emotional Intelligence Assessment',
      description: 'EQ assessment measuring self-awareness and social skills',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    'cultural': {
      title: 'Cultural Intelligence Assessment',
      description: 'Global business and cultural awareness evaluation',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    'digital': {
      title: 'Digital Wellness Assessment',
      description: 'Real-time digital wellness and behavioral tracking',
      icon: Clock,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    'burnout': {
      title: 'Burnout Prevention Assessment',
      description: 'Advanced burnout risk assessment and prevention strategies',
      icon: Brain,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  };

  const getSampleCandidateReport = (assessmentType: string) => {
    // getSampleCandidateReport called with type
    
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
      case 'leadership-assessment':
        // Matched leadership case
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
      
      case 'stress-resilience':
      case 'burnout-prevention':
      case 'burnout':
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
      case 'career-launch':
        
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

      case 'faith-values':
        console.log('✅ Matched faith-values case');
        console.log('✅ Matched faith-values case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 87,
            readinessLevel: 'Strong Alignment',
            topStrengths: ['Spiritual Integration', 'Values Consistency', 'Ethical Decision Making'],
            keyDevelopmentAreas: ['Community Engagement', 'Workplace Application', 'Leadership Development'],
            recommendedNextSteps: [
              'Seek leadership roles in faith-based organizations',
              'Mentor others in values-based decision making',
              'Integrate spiritual practices into daily work'
            ]
          },
          dimensionScores: {
            spiritual_purpose: { score: 92, level: 'Excellent', interpretation: 'Strong sense of spiritual purpose and calling' },
            integrity: { score: 94, level: 'Excellent', interpretation: 'Exceptional ethical foundation and honesty' },
            compassion: { score: 88, level: 'Very Good', interpretation: 'Strong empathy and care for others' },
            justice: { score: 85, level: 'Very Good', interpretation: 'Commitment to fairness and social justice' },
            service: { score: 83, level: 'Very Good', interpretation: 'Dedication to serving others and community' },
            work_meaning: { score: 89, level: 'Very Good', interpretation: 'Clear connection between work and values' },
            values_integration: { score: 86, level: 'Very Good', interpretation: 'Consistent application of values in decisions' },
            moral_courage: { score: 81, level: 'Good', interpretation: 'Willingness to stand up for beliefs and values' }
          },
          careerRecommendations: [
            'Faith-based organizational leadership',
            'Non-profit management roles',
            'Values-driven business positions'
          ]
        };

      case 'genz':
        console.log('✅ Matched genz case');
      case 'genz-assessment':
      case 'genz-workplace':
        console.log('✅ Matched genz case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 79,
            readinessLevel: 'Gen Z Ready',
            topStrengths: ['Digital Fluency', 'Diversity Appreciation', 'Social Impact Focus'],
            keyDevelopmentAreas: ['Traditional Business Skills', 'Face-to-Face Communication', 'Formal Structure Adaptation'],
            recommendedNextSteps: [
              'Develop traditional business acumen',
              'Practice formal presentation skills',
              'Build cross-generational relationships'
            ]
          },
          dimensionScores: {
            digital_fluency: { score: 95, level: 'Excellent', interpretation: 'Outstanding digital skills and adaptation' },
            diversity_mindset: { score: 91, level: 'Excellent', interpretation: 'Strong appreciation for diversity and inclusion' },
            social_impact: { score: 87, level: 'Very Good', interpretation: 'Clear focus on meaningful work and social impact' },
            flexibility: { score: 82, level: 'High', interpretation: 'Adaptable and open to change' },
            entrepreneurship: { score: 76, level: 'Good', interpretation: 'Entrepreneurial thinking and innovation' },
            work_life_balance: { score: 89, level: 'Very Good', interpretation: 'Strong focus on work-life integration' },
            traditional_skills: { score: 64, level: 'Developing', interpretation: 'Areas for growth in traditional business skills' }
          },
          careerRecommendations: [
            'Social impact organizations',
            'Technology and innovation roles',
            'Purpose-driven companies'
          ]
        };

      case 'faith-values':
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 87,
            readinessLevel: 'Strong Alignment',
            topStrengths: ['Spiritual Integration', 'Values Consistency', 'Ethical Decision Making'],
            keyDevelopmentAreas: ['Community Engagement', 'Workplace Application', 'Leadership Development'],
            recommendedNextSteps: [
              'Seek leadership roles in faith-based organizations',
              'Mentor others in values-based decision making',
              'Integrate spiritual practices into daily work'
            ]
          },
          dimensionScores: {
            spiritual_foundation: { score: 91, level: 'Excellent', interpretation: 'Strong spiritual grounding and consistent practice' },
            moral_compass: { score: 88, level: 'Very Good', interpretation: 'Clear ethical framework guides decisions' },
            workplace_integration: { score: 79, level: 'Good', interpretation: 'Successfully applies values in professional settings' },
            community_service: { score: 82, level: 'Very Good', interpretation: 'Active in serving others and community involvement' },
            personal_growth: { score: 85, level: 'Very Good', interpretation: 'Committed to continuous spiritual development' },
            leadership_calling: { score: 83, level: 'Very Good', interpretation: 'Natural inclination to lead with values' }
          },
          careerRecommendations: [
            'Non-profit leadership roles',
            'Faith-based organizational positions',
            'Ethical consulting and advisory roles'
          ]
        };
      
      case 'genz':
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 84,
            readinessLevel: 'High Workplace Readiness',
            topStrengths: ['Digital Fluency', 'Social Awareness', 'Adaptability'],
            keyDevelopmentAreas: ['Traditional Communication', 'Hierarchy Navigation', 'Long-term Focus'],
            recommendedNextSteps: [
              'Develop formal communication skills',
              'Seek mentorship from experienced professionals',
              'Practice patience with traditional processes'
            ]
          },
          dimensionScores: {
            digital_native: { score: 95, level: 'Excellent', interpretation: 'Exceptional digital skills and technology adoption' },
            social_consciousness: { score: 89, level: 'Very Good', interpretation: 'Strong awareness of social and environmental issues' },
            work_life_balance: { score: 82, level: 'Very Good', interpretation: 'Healthy boundaries and life integration' },
            collaboration: { score: 78, level: 'Good', interpretation: 'Effective team player with modern collaboration style' },
            career_agility: { score: 85, level: 'Very Good', interpretation: 'Flexible and open to career pivots' },
            traditional_structures: { score: 68, level: 'Moderate', interpretation: 'Developing comfort with hierarchical environments' }
          },
          careerRecommendations: [
            'Startup and tech company roles',
            'Social impact positions',
            'Remote and flexible work environments'
          ]
        };
      
      case 'burnout':
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 72,
            readinessLevel: 'Moderate Risk',
            topStrengths: ['Work-Life Awareness', 'Stress Recognition', 'Support Seeking'],
            keyDevelopmentAreas: ['Boundary Setting', 'Recovery Techniques', 'Workload Management'],
            recommendedNextSteps: [
              'Implement daily stress management practices',
              'Establish clear work-life boundaries',
              'Develop comprehensive self-care routine'
            ]
          },
          dimensionScores: {
            stress_awareness: { score: 81, level: 'Very Good', interpretation: 'Good recognition of stress signals and triggers' },
            coping_strategies: { score: 69, level: 'Moderate', interpretation: 'Basic coping skills with room for improvement' },
            work_boundaries: { score: 65, level: 'Moderate', interpretation: 'Developing ability to set and maintain boundaries' },
            recovery_capacity: { score: 74, level: 'Good', interpretation: 'Reasonable ability to recover from stress' },
            support_systems: { score: 77, level: 'Good', interpretation: 'Good network of support and resources' },
            prevention_mindset: { score: 66, level: 'Moderate', interpretation: 'Growing awareness of preventive approaches' }
          },
          careerRecommendations: [
            'Lower-stress work environments',
            'Flexible schedule positions',
            'Supportive organizational cultures'
          ]
        };
      
      case 'cair':
      case 'cair-personality':
      case 'cair-assessment':
        console.log('✅ Matched cair case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 78,
            readinessLevel: 'Well-Balanced Profile',
            topStrengths: ['Conscientiousness', 'Analytical Thinking', 'Adaptability'],
            keyDevelopmentAreas: ['Assertiveness', 'Risk Taking', 'Innovation'],
            recommendedNextSteps: [
              'Practice assertiveness in team meetings',
              'Seek opportunities for creative problem-solving',
              'Develop comfort with calculated risks'
            ]
          },
          dimensionScores: {
            conscientiousness: { score: 87, level: 'Excellent', interpretation: 'Highly organized and reliable with strong attention to detail' },
            analytical_thinking: { score: 82, level: 'Very Good', interpretation: 'Strong logical reasoning and problem-solving capabilities' },
            adaptability: { score: 79, level: 'Good', interpretation: 'Flexible and comfortable with change' },
            assertiveness: { score: 65, level: 'Moderate', interpretation: 'Could benefit from more confident communication' },
            innovation: { score: 68, level: 'Moderate', interpretation: 'Developing creative and innovative thinking' },
            integrity: { score: 92, level: 'Excellent', interpretation: 'Strong ethical foundation and trustworthiness' }
          },
          careerRecommendations: [
            'Financial analysis and planning roles',
            'Quality assurance positions',
            'Research and development support'
          ]
        };
      
      case 'communication':
      case 'communication-styles':
      case 'communication-assessment':
        console.log('✅ Matched communication case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 85,
            readinessLevel: 'Strong Communicator',
            topStrengths: ['Active Listening', 'Written Communication', 'Empathy'],
            keyDevelopmentAreas: ['Public Speaking', 'Conflict Resolution', 'Cross-Cultural Communication'],
            recommendedNextSteps: [
              'Join professional speaking organization',
              'Practice conflict mediation techniques',
              'Develop cultural awareness skills'
            ]
          },
          dimensionScores: {
            active_listening: { score: 91, level: 'Excellent', interpretation: 'Exceptional ability to understand and respond to others' },
            written_communication: { score: 86, level: 'Very Good', interpretation: 'Clear and effective written expression' },
            empathy: { score: 88, level: 'Very Good', interpretation: 'Strong emotional intelligence and understanding' },
            public_speaking: { score: 72, level: 'Good', interpretation: 'Comfortable presenting but room for improvement' },
            conflict_resolution: { score: 74, level: 'Good', interpretation: 'Developing skills in managing disagreements' },
            nonverbal_communication: { score: 80, level: 'Good', interpretation: 'Good awareness of body language and cues' }
          },
          careerRecommendations: [
            'Human resources roles',
            'Customer relationship management',
            'Training and development positions'
          ]
        };
      
      case 'emotional':
      case 'emotional-intelligence':
        console.log('✅ Matched emotional-intelligence case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 81,
            readinessLevel: 'High Emotional Intelligence',
            topStrengths: ['Self-Awareness', 'Social Skills', 'Motivation'],
            keyDevelopmentAreas: ['Stress Management', 'Emotional Regulation', 'Influence'],
            recommendedNextSteps: [
              'Practice mindfulness and stress reduction techniques',
              'Develop emotional regulation strategies',
              'Build influence and persuasion skills'
            ]
          },
          dimensionScores: {
            self_awareness: { score: 89, level: 'Very Good', interpretation: 'Strong understanding of own emotions and reactions' },
            social_skills: { score: 85, level: 'Very Good', interpretation: 'Excellent interpersonal and relationship skills' },
            motivation: { score: 83, level: 'Very Good', interpretation: 'High internal drive and goal orientation' },
            stress_management: { score: 71, level: 'Moderate', interpretation: 'Developing better stress coping mechanisms' },
            empathy: { score: 86, level: 'Very Good', interpretation: 'Strong ability to understand others\' perspectives' },
            emotional_regulation: { score: 73, level: 'Good', interpretation: 'Good control over emotional responses' }
          },
          careerRecommendations: [
            'Leadership and management roles',
            'Counseling and coaching positions',
            'Team leadership opportunities'
          ]
        };
      
      case 'cultural':
      case 'cultural-intelligence':
        console.log('✅ Matched cultural-intelligence case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 76,
            readinessLevel: 'Culturally Proficient',
            topStrengths: ['Cultural Awareness', 'Language Skills', 'Adaptability'],
            keyDevelopmentAreas: ['Cross-Cultural Leadership', 'Global Business Acumen', 'Cultural Sensitivity'],
            recommendedNextSteps: [
              'Seek international project opportunities',
              'Develop cross-cultural leadership skills',
              'Study global business practices'
            ]
          },
          dimensionScores: {
            cultural_drive: { score: 78, level: 'Good', interpretation: 'Strong motivation to work across cultures' },
            cultural_knowledge: { score: 74, level: 'Good', interpretation: 'Good understanding of cultural differences' },
            cultural_strategy: { score: 72, level: 'Good', interpretation: 'Developing strategic cultural thinking' },
            cultural_action: { score: 81, level: 'Very Good', interpretation: 'Good at adapting behavior across cultures' },
            global_mindset: { score: 79, level: 'Good', interpretation: 'Strong global perspective and openness' },
            communication_adaptation: { score: 75, level: 'Good', interpretation: 'Good at adjusting communication style' }
          },
          careerRecommendations: [
            'International business roles',
            'Global project management',
            'Cross-cultural consulting'
          ]
        };
      
      case 'stress-resilience':
      case 'burnout-prevention':
      case 'burnout':
      case 'stress':
        console.log('✅ Matched stress-resilience/burnout case');
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
            workload_management: { score: 78, level: 'Good', interpretation: 'Effective task prioritization and delegation' },
            emotional_exhaustion: { score: 82, level: 'Low', interpretation: 'Strong emotional regulation under pressure' },
            personal_efficacy: { score: 86, level: 'High', interpretation: 'Strong belief in capability to handle challenges' },
            support_systems: { score: 71, level: 'Moderate', interpretation: 'Developing skills in seeking and utilizing support' },
            work_life_integration: { score: 74, level: 'Good', interpretation: 'Good balance between work and personal life' },
            coping_strategies: { score: 79, level: 'Good', interpretation: 'Effective stress management techniques' },
            wellbeing_practices: { score: 77, level: 'Good', interpretation: 'Regular wellness and self-care practices' }
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
      
      case 'digital-wellness':
      case 'digital':
        console.log('✅ Matched digital-wellness case');
        return {
          ...baseReport,
          executiveSummary: {
            overallScore: 73,
            readinessLevel: 'Digital Native',
            topStrengths: ['Technology Adoption', 'Digital Communication', 'Online Learning'],
            keyDevelopmentAreas: ['Digital Wellness', 'Screen Time Management', 'Tech-Life Balance'],
            recommendedNextSteps: [
              'Implement digital wellness practices',
              'Create structured screen time limits',
              'Develop offline hobbies and activities'
            ]
          },
          dimensionScores: {
            technology_proficiency: { score: 92, level: 'Excellent', interpretation: 'Outstanding technical skills and adaptation' },
            digital_communication: { score: 85, level: 'Very Good', interpretation: 'Excellent online communication abilities' },
            information_literacy: { score: 78, level: 'Good', interpretation: 'Good at evaluating digital information' },
            digital_wellness: { score: 58, level: 'Developing', interpretation: 'Needs improvement in managing digital habits' },
            screen_time_management: { score: 62, level: 'Developing', interpretation: 'Could benefit from better time boundaries' },
            cybersecurity_awareness: { score: 74, level: 'Good', interpretation: 'Good understanding of online safety' }
          },
          careerRecommendations: [
            'Technology and software roles',
            'Digital marketing positions',
            'Online education and training'
          ]
        };
      
      default:
        console.log('❌ No specific case found for assessment type:', assessmentType, '- falling back to default');
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

  const currentReport = useMemo(() => {
    console.log('🎯 Getting current report for assessment:', selectedAssessment);
    const report = reportType === 'employer' 
      ? getSampleEmployerReport(selectedAssessment)
      : getSampleCandidateReport(selectedAssessment);
    console.log('📋 Current report generated:', report);
    return report;
  }, [selectedAssessment, reportType]);

  const currentAssessment = useMemo(() => {
    console.log('🔍 Getting current assessment config for:', selectedAssessment);
    const assessment = assessments[selectedAssessment];
    console.log('⚙️ Assessment config:', assessment);
    return assessment;
  }, [selectedAssessment]);


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
                  <Progress 
                    value={dimension.score} 
                    className={`h-3 ${
                      dimension.score >= 71 ? '[&>div]:bg-green-500' : 
                      dimension.score >= 41 ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-red-500'
                    }`} 
                  />
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
                  <Progress 
                    value={employerReport.fitAnalysis.culturalFit} 
                    className={`h-3 ${
                      employerReport.fitAnalysis.culturalFit >= 71 ? '[&>div]:bg-green-500' : 
                      employerReport.fitAnalysis.culturalFit >= 41 ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-red-500'
                    }`} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Role Alignment</span>
                  <span className="text-sm text-muted-foreground font-medium">{employerReport.fitAnalysis.roleAlignment}%</span>
                </div>
                <div className="px-4">
                  <Progress 
                    value={employerReport.fitAnalysis.roleAlignment} 
                    className={`h-3 ${
                      employerReport.fitAnalysis.roleAlignment >= 71 ? '[&>div]:bg-green-500' : 
                      employerReport.fitAnalysis.roleAlignment >= 41 ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-red-500'
                    }`} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Growth Potential</span>
                  <span className="text-sm text-muted-foreground font-medium">{employerReport.fitAnalysis.growthPotential}%</span>
                </div>
                <div className="px-4">
                  <Progress 
                    value={employerReport.fitAnalysis.growthPotential} 
                    className={`h-3 ${
                      employerReport.fitAnalysis.growthPotential >= 71 ? '[&>div]:bg-green-500' : 
                      employerReport.fitAnalysis.growthPotential >= 41 ? '[&>div]:bg-yellow-500' : 
                      '[&>div]:bg-red-500'
                    }`} 
                  />
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
            
            {/* Featured Sample Report - Dynamic based on selected assessment */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-semibold mb-3 text-primary">
                Featured: {currentAssessment?.title || 'Assessment'} Sample Report
              </h2>
              <p className="text-muted-foreground mb-4">
                See a complete sample of our comprehensive {currentAssessment?.title || 'assessment'} with detailed analysis and insights.
              </p>
              <Button onClick={generateSampleReport} variant="default" disabled={isGenerating}>
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : `View ${currentAssessment?.title || 'Sample'} Report`}
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
                <div className={`p-2 rounded-lg ${currentAssessment?.bgColor || 'bg-gray-50'}`}>
                  {currentAssessment?.icon && (() => {
                    const IconComponent = currentAssessment.icon;
                    return <IconComponent className={`h-6 w-6 ${currentAssessment.color || 'text-gray-600'}`} />;
                  })()}
                </div>
                <div>
                  <CardTitle>{currentAssessment?.title || 'Assessment Report'}</CardTitle>
                  <CardDescription>{currentAssessment?.description || 'Sample assessment report'}</CardDescription>
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
              onClick={generateSampleReport}
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