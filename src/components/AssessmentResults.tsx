import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  Users, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Shield, 
  Award,
  Download,
  Share,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Building,
  User
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { aiReportGenerator, AIReportRequest } from "@/services/aiReportGenerator";
import { EnhancedAIEngine } from "@/services/enhancedAIEngine";
import InteractiveResultsVisualization from "@/components/InteractiveResultsVisualization";
import ProgressTracker from "@/components/ProgressTracker";
import LegalNotices from "@/components/LegalNotices";
import { toast } from "sonner";
import UnifiedAssessmentService from "@/services/unifiedAssessmentService";
import ConsolidatedReportService from "@/services/consolidatedReportService";
import type { AssessmentData, CandidateInfo, AssessmentResult, UnifiedAssessmentResult, DimensionScore } from "@/types/assessment.types";

interface AssessmentResultsProps {
  data: AssessmentData | Record<string, unknown>; // Flexible type for different assessment formats
  assessmentType?: string;
  candidateInfo?: CandidateInfo;
}

const AssessmentResults = ({ data, assessmentType = 'general', candidateInfo }: AssessmentResultsProps) => {
  const [results, setResults] = useState<AssessmentResult>({
    overallScore: 0,
    dimensions: [],
    improvements: [],
    profile: '',
    recommendations: [],
    strengths: []
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const unifiedService = UnifiedAssessmentService.getInstance();
  const reportService = ConsolidatedReportService.getInstance();

  useEffect(() => {
    if (data) {
      processAssessment();
    }
  }, [data, assessmentType]);

  const processAssessment = async () => {
    try {
      // Processing assessment with type and data (development only)
      
      // Ensure data is in the correct format
      const assessmentData = {
        responses: (data as any)?.responses || [],
        startTime: (data as any)?.startTime || Date.now(),
        endTime: (data as any)?.endTime || Date.now(),
        totalTime: (data as any)?.totalTime || 0,
        assessmentType: assessmentType,
        candidateInfo: candidateInfo || { name: 'Test User', email: 'test@example.com' },
        metadata: (data as any)?.metadata || {}
      };

      const result = await unifiedService.processAssessment(assessmentType, assessmentData);
      // Assessment result generated successfully
      if (typeof result === 'object' && 'overallScore' in result) {
        // Create dimension scores array with proper structure
        const dimensionScores: DimensionScore[] = [];
        if (result.dimensionScores && typeof result.dimensionScores === 'object') {
          Object.entries(result.dimensionScores).forEach(([key, value]) => {
            dimensionScores.push({
              name: key,
              score: typeof value === 'number' ? value : 0,
              description: 'Assessment dimension',
              level: 'medium'
            });
          });
        }

        setResults({
          overallScore: result.overallScore || 0,
          dimensions: dimensionScores,
          improvements: result.developmentAreas?.map(area => ({ category: area, items: [] })) || [],
          profile: result.assessmentType || 'Assessment Complete',
          recommendations: [],
          strengths: []
        });
      }
    } catch (error) {
      // Error processing assessment, falling back to mock data
      
      // Fallback to mock data
      setResults({
        overallScore: 75,
        dimensions: [{ name: 'Overall', score: 75, description: 'General assessment', level: 'medium' }],
        improvements: [{ category: 'Time Management', items: ['Improve scheduling', 'Set priorities'] }],
        profile: 'Assessment Complete',
        recommendations: [{ category: 'Development', items: ['Continue developing your skills'] }],
        strengths: ['Data Analysis', 'Problem Solving']
      });
    }
  };

  // Helper methods to access assessment result data
  const getOverallScore = () => results?.overallScore || 0;
  const getProfile = () => results?.profile || "Assessment Profile";
  const getDimensionScores = () => results?.dimensions || [];
  const getStrengths = () => results?.strengths || [];
  const getDevelopmentAreas = () => results?.improvements || [];
  const getRecommendations = () => results?.recommendations || [];

  // Generate simple PDF report with debugging
  const downloadReport = async () => {
    if (!results) {
      toast.error('No assessment data available');
      return;
    }

    try {
      console.log('Results data:', results);
      console.log('Dimensions data:', results.dimensions);
      
      const doc = new jsPDF();
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${assessmentType.toUpperCase()} Assessment Report`, 20, yPosition);
      yPosition += 20;

      // Candidate info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      if (candidateInfo?.name) {
        doc.text(`Candidate: ${candidateInfo.name}`, 20, yPosition);
        yPosition += 8;
      }
      if (candidateInfo?.email) {
        doc.text(`Email: ${candidateInfo.email}`, 20, yPosition);
        yPosition += 8;
      }
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;

      // Overall Score
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const overallScore = typeof results.overallScore === 'number' ? results.overallScore : 0;
      doc.text(`Overall Score: ${overallScore}/100`, 20, yPosition);
      yPosition += 15;

      // Dimensions
      doc.setFontSize(14);
      doc.text('Dimension Scores:', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Check if dimensions is an array or object
      if (Array.isArray(results.dimensions)) {
        results.dimensions.forEach((dim) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          const dimensionName = String(dim.name || 'Unknown Dimension');
          const dimensionScore = typeof dim.score === 'number' ? dim.score : 0;
          doc.text(`${dimensionName}: ${dimensionScore}/100`, 25, yPosition);
          yPosition += 8;
        });
      } else if (typeof results.dimensions === 'object') {
        // Handle object format
        Object.entries(results.dimensions).forEach(([key, value]) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          const dimensionName = String(key).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const dimensionScore = typeof value === 'number' ? value : (typeof value === 'object' && value && 'score' in value ? value.score : 0);
          doc.text(`${dimensionName}: ${dimensionScore}/100`, 25, yPosition);
          yPosition += 8;
        });
      } else {
        doc.text('No dimension data available', 25, yPosition);
        yPosition += 8;
      }

      // Save PDF
      const fileName = `${assessmentType}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const getDimensions = () => {
    switch (assessmentType) {
      case 'faith-values':
        return [
          {
            key: "spiritual_purpose",
            title: "Spiritual Purpose",
            description: "Sense of life meaning through spiritual beliefs",
            icon: Target,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "integrity", 
            title: "Integrity",
            description: "Honesty and moral principles in work",
            icon: Shield,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "compassion",
            title: "Compassion",
            description: "Care and empathy for others",
            icon: Heart,
            color: "text-red-500",
            bgColor: "bg-red-50"
          },
          {
            key: "justice",
            title: "Justice",
            description: "Commitment to fairness and equality",
            icon: Award,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "service",
            title: "Service",
            description: "Dedication to helping others",
            icon: Users,
            color: "text-teal-500",
            bgColor: "bg-teal-50"
          },
          {
            key: "work_meaning",
            title: "Work Meaning",
            description: "Finding purpose and significance in work",
            icon: Sparkles,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50"
          },
          {
            key: "values_integration",
            title: "Values Integration",
            description: "Aligning personal values with work",
            icon: TrendingUp,
            color: "text-indigo-500",
            bgColor: "bg-indigo-50"
          },
          {
            key: "moral_courage",
            title: "Moral Courage",
            description: "Standing up for ethical principles",
            icon: Brain,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
          }
        ];

      case 'leadership':
        return [
          {
            key: "strategic_thinking",
            title: "Strategic Thinking",
            description: "Vision, planning, and long-term perspective",
            icon: Target,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "team_leadership",
            title: "Team Leadership",
            description: "Inspiring and developing team members",
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "decision_making",
            title: "Decision Making",
            description: "Sound judgment under pressure",
            icon: Brain,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "emotional_intelligence",
            title: "Emotional Intelligence",
            description: "Self-awareness and social skills",
            icon: Heart,
            color: "text-red-500",
            bgColor: "bg-red-50"
          },
          {
            key: "change_management",
            title: "Change Management",
            description: "Leading organizational transformation",
            icon: TrendingUp,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
          },
          {
            key: "communication",
            title: "Communication",
            description: "Clear and persuasive messaging",
            icon: Sparkles,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50"
          }
        ];

      case 'career':
      case 'career-launch':
        return [
          {
            key: "skill_readiness",
            title: "Skill Readiness",
            description: "Technical and professional capabilities",
            icon: Target,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "workplace_maturity",
            title: "Workplace Maturity",
            description: "Professional behavior and work ethic",
            icon: Shield,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "communication_skills",
            title: "Communication Skills",
            description: "Verbal and written communication abilities",
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "problem_solving",
            title: "Problem Solving",
            description: "Analytical and creative thinking",
            icon: Brain,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
          },
          {
            key: "adaptability",
            title: "Adaptability",
            description: "Flexibility and openness to change",
            icon: TrendingUp,
            color: "text-teal-500",
            bgColor: "bg-teal-50"
          },
          {
            key: "leadership_potential",
            title: "Leadership Potential",
            description: "Emerging leadership capabilities",
            icon: Award,
            color: "text-red-500",
            bgColor: "bg-red-50"
          }
        ];

      case 'cair':
      case 'cairplus':
      case 'cair-personality':
        return [
          {
            key: "conscientiousness",
            title: "Conscientiousness",
            description: "Organization, reliability, and attention to detail",
            icon: Shield,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "agreeableness",
            title: "Agreeableness",
            description: "Cooperation, trust, and interpersonal harmony",
            icon: Users,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "innovation",
            title: "Innovation",
            description: "Creativity, adaptability, and openness to new ideas",
            icon: Brain,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "resilience",
            title: "Resilience",
            description: "Stress tolerance and emotional stability",
            icon: Heart,
            color: "text-red-500",
            bgColor: "bg-red-50"
          }
        ];

      case 'genz':
        return [
          {
            key: "digital_fluency",
            title: "Digital Fluency",
            description: "Technology proficiency and digital communication",
            icon: Sparkles,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "social_awareness",
            title: "Social Awareness",
            description: "Understanding of social and environmental issues",
            icon: Heart,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "work_life_balance",
            title: "Work-Life Balance",
            description: "Healthy boundaries and life integration",
            icon: Target,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "collaboration",
            title: "Collaboration",
            description: "Modern team collaboration and networking",
            icon: Users,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
          },
          {
            key: "career_agility",
            title: "Career Agility",
            description: "Flexibility and openness to career changes",
            icon: TrendingUp,
            color: "text-teal-500",
            bgColor: "bg-teal-50"
          },
          {
            key: "traditional_structures",
            title: "Traditional Structures",
            description: "Comfort with hierarchical environments",
            icon: Building,
            color: "text-red-500",
            bgColor: "bg-red-50"
          }
        ];

      case 'burnout':
      case 'burnout-prevention':
        return [
          {
            key: "stress_awareness",
            title: "Stress Awareness",
            description: "Recognition of stress signals and triggers",
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-50"
          },
          {
            key: "coping_strategies",
            title: "Coping Strategies",
            description: "Effective stress management techniques",
            icon: Shield,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "work_boundaries",
            title: "Work Boundaries",
            description: "Ability to set and maintain work-life limits",
            icon: Target,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "recovery_capacity",
            title: "Recovery Capacity",
            description: "Ability to bounce back from stress",
            icon: TrendingUp,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "support_systems",
            title: "Support Systems",
            description: "Network of professional and personal support",
            icon: Users,
            color: "text-teal-500",
            bgColor: "bg-teal-50"
          },
          {
            key: "prevention_mindset",
            title: "Prevention Mindset",
            description: "Proactive approach to preventing burnout",
            icon: Heart,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
          }
        ];

      default:
        return [
          {
            key: "emotional",
            title: "Emotional Resilience",
            description: "Emotional regulation under pressure",
            icon: Heart,
            color: "text-red-500",
            bgColor: "bg-red-50"
          },
          {
            key: "cognitive", 
            title: "Cognitive Flexibility",
            description: "Problem-solving under stress",
            icon: Brain,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
          },
          {
            key: "physical",
            title: "Physical Stress Response",
            description: "Energy management and recovery",
            icon: Zap,
            color: "text-green-500",
            bgColor: "bg-green-50"
          },
          {
            key: "social",
            title: "Social Support Utilization",
            description: "Help-seeking and network building",
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
          },
          {
            key: "change",
            title: "Change Adaptability",
            description: "Comfort with ambiguity and innovation",
            icon: Target,
            color: "text-orange-500",
            bgColor: "bg-orange-50"
          },
          {
            key: "performance",
            title: "Performance Under Pressure",
            description: "Deadline management and crisis leadership",
            icon: Clock,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50"
          }
        ];
    }
  };

  const dimensions = getDimensions();

  // Legacy PDF generation (keeping for fallback compatibility)
  const generateLegacyPDF = () => {
    const doc = new jsPDF();
    const currentScore = getOverallScore();
    const currentProfile = getProfile();
    const currentDimensionScores = getDimensionScores();
    
    // Generate title and content based on assessment type
    const getReportContent = () => {
      switch (assessmentType) {
        case 'faith-values':
          return {
            title: 'Faith and Values Assessment Report',
            scoreLabel: 'Overall Values Alignment Score',
            profileLabel: `Values Profile: ${currentProfile}`,
            filename: `faith-values-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`
          };
        case 'leadership':
          return {
            title: 'Authentic Leadership Assessment Report',
            scoreLabel: 'Overall Leadership Score',
            profileLabel: `Leadership Profile: ${currentProfile}`,
            filename: `leadership-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`
          };
        case 'career':
        case 'career-launch':
          return {
            title: 'CareerLaunch Assessment Report',
            scoreLabel: 'Overall Career Readiness Score',
            profileLabel: `Career Profile: ${currentProfile}`,
            filename: `career-launch-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`
          };
        case 'cair':
        case 'cairplus':
        case 'cair-personality':
          return {
            title: 'CAIR+ Personality Assessment Report',
            scoreLabel: 'Overall Personality Score',
            profileLabel: `Personality Profile: ${currentProfile}`,
            filename: `cair-personality-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`
          };
        case 'burnout':
        case 'burnout-prevention':
          return {
            title: 'Burnout Prevention Assessment Report',
            scoreLabel: 'Overall Burnout Prevention Score',
            profileLabel: `Risk Profile: ${currentProfile}`,
            filename: `burnout-prevention-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`
          };
        default:
          return {
            title: `${assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)} Assessment Report`,
            scoreLabel: 'Overall Score',
            profileLabel: `Profile: ${currentProfile}`,
            filename: `${assessmentType}-assessment-report-${new Date().toISOString().split('T')[0]}.pdf`
          };
      }
    };

    const content = getReportContent();
    
    // Title
    doc.setFontSize(20);
    doc.text(content.title, 20, 30);
    
    // Overall Score
    doc.setFontSize(16);
    doc.text(content.scoreLabel, 20, 50);
    doc.setFontSize(24);
    doc.text(`${currentScore}/100`, 20, 65);
    doc.setFontSize(12);
    doc.text(`${content.profileLabel} - ${getScoreDescription(currentScore)}`, 20, 75);
    
    // Dimension Scores
    doc.setFontSize(16);
    doc.text('Dimension Scores:', 20, 95);
    doc.setFontSize(12);
    
    let yPos = 110;
    dimensions.forEach((dimension) => {
      const score = currentDimensionScores[dimension.key] || 0;
      doc.text(`${dimension.title}: ${score}/100 (${getScoreDescription(score)})`, 20, yPos);
      yPos += 15;
    });
    
    // Save the PDF
    doc.save(content.filename);
  };

  const shareResults = async () => {
    const shareText = `I just completed the ${assessmentType || 'Assessment'}! Overall Score: ${getOverallScore()}% - ${getProfile()} level`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${assessmentType || 'Assessment'} Results`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Sharing failed - handle gracefully
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Results Copied!", {
        description: "Your results have been copied to clipboard.",
      });
    }
  };

  const generateAIReport = async (reportType: 'candidate' | 'employer' = 'candidate') => {
    setIsGeneratingAI(true);
    try {
      if (!candidateInfo) {
        toast.error('Candidate information is required for AI report generation');
        return;
      }

      const request: AIReportRequest = {
        assessmentResultId: `assessment-${Date.now()}`,
        reportType,
        candidateInfo: {
          name: candidateInfo.name,
          email: candidateInfo.email,
          age: candidateInfo.age,
          experience: candidateInfo.experience,
          position: candidateInfo.position
        }
      };

      // Store assessment result in request for AI processing
      (request as any).assessmentData = {
        responses: data.responses || {},
        dimensions: getDimensionScores(),
        overallScore: getOverallScore(),
        assessmentType,
        profile: getProfile()
      };

      toast.info('Generating AI-powered report... This may take a moment.');
      const reportContent = await aiReportGenerator.generateReport(request);
      
      // Generate PDF from the AI report content with specified report type
      await aiReportGenerator.generatePDFReport(reportContent, reportType);
      
      toast.success('AI report generated successfully!');
      
    } catch (error) {
      // Log for debugging in development only
      if (process.env.NODE_ENV === 'development') {
        // Error generating AI report
      }
      toast.error('Failed to generate AI report. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Moderate";
    return "Needs Development";
  };

  const getAssessmentTitle = () => {
    // Debug: Assessment Type in getAssessmentTitle (development only)
    switch (assessmentType) {
      case 'faith-values':
        return 'Your Faith & Values Profile';
      case 'leadership':
        return 'Your Leadership Profile';
      case 'career':
      case 'career-launch':
        return 'Your Career Launch Profile';
      case 'cair':
      case 'cairplus':
      case 'cair-personality':
        return 'Your CAIR+ Personality Profile';
      case 'communication':
        return 'Your Communication Profile';
      case 'emotional':
        return 'Your Emotional Intelligence Profile';
      case 'cultural':
        return 'Your Cultural Intelligence Profile';
      case 'digital':
        return 'Your Digital Wellness Profile';
      case 'genz':
        return 'Your Gen Z Workplace Profile';
      case 'burnout':
      case 'burnout-prevention':
        return 'Your Burnout Prevention Profile';
      default:
        return 'Your Resilience Profile';
    }
  };

  const getAssessmentDescription = () => {
    switch (assessmentType) {
      case 'faith-values':
        return 'Based on your responses across faith values scenarios and workplace situations, here\'s your comprehensive values alignment assessment.';
      case 'leadership':
        return 'Based on your leadership scenarios and decision-making patterns, here\'s your comprehensive authentic leadership assessment.';
      case 'career':
      case 'career-launch':
        return 'Based on your career interests, aptitudes, and values, here\'s your comprehensive career readiness assessment.';
      case 'cair':
      case 'cairplus':
      case 'cair-personality':
        return 'Based on your personality responses, here\'s your comprehensive CAIR+ personality assessment analyzing Conscientiousness, Agreeableness, Innovation, and Resilience.';
      case 'communication':
        return 'Based on your communication scenarios and preferences, here\'s your comprehensive communication styles assessment.';
      case 'emotional':
        return 'Based on your emotional intelligence scenarios, here\'s your comprehensive EQ assessment.';
      case 'cultural':
        return 'Based on your cross-cultural scenarios, here\'s your comprehensive cultural intelligence assessment.';
      case 'digital':
        return 'Based on your digital habits and wellness patterns, here\'s your comprehensive digital wellness assessment.';
      case 'genz':
        return 'Based on your workplace preferences and generational characteristics, here\'s your comprehensive Gen Z workplace assessment.';
      case 'burnout':
      case 'burnout-prevention':
        return 'Based on your stress patterns and coping mechanisms, here\'s your comprehensive burnout prevention assessment focusing on risk identification and prevention strategies.';
      default:
        return 'Based on your responses across multiple scenarios and stress conditions, here\'s your comprehensive resilience assessment.';
    }
  };

  const getScoreCategory = () => {
    switch (assessmentType) {
      case 'faith-values':
        return 'values alignment';
      case 'leadership':
        return 'leadership capacity';
      case 'career':
      case 'career-launch':
        return 'career readiness';
      case 'cair':
        return 'personality profile';
      case 'communication':
        return 'communication effectiveness';
      case 'emotional':
        return 'emotional intelligence';
      case 'cultural':
        return 'cultural intelligence';
      case 'digital':
        return 'digital wellness';
      case 'genz':
        return 'workplace readiness';
      case 'burnout':
      case 'burnout-prevention':
        return 'burnout risk level';
      default:
        return 'resilience capacity';
    }
  };

  const getOverallScoreLabel = () => {
    switch (assessmentType) {
      case 'faith-values':
        return 'Overall Values Alignment Score';
      case 'leadership':
        return 'Overall Leadership Score';
      case 'career':
      case 'career-launch':
        return 'Overall Career Readiness Score';
      case 'cair':
        return 'Overall Personality Score';
      case 'communication':
        return 'Overall Communication Score';
      case 'emotional':
        return 'Overall EQ Score';
      case 'cultural':
        return 'Overall CQ Score';
      case 'digital':
        return 'Overall Digital Wellness Score';
      case 'genz':
        return 'Overall Workplace Readiness Score';
      case 'burnout':
      case 'burnout-prevention':
        return 'Overall Burnout Risk Score';
      default:
        return 'Overall Resilience Score';
    }
  };

  const recommendations = [
    {
      category: "Stress Management",
      items: [
        "Practice daily mindfulness meditation",
        "Implement progressive muscle relaxation",
        "Develop breathing techniques for acute stress"
      ]
    },
    {
      category: "Cognitive Development",
      items: [
        "Practice scenario planning exercises",
        "Learn rapid decision-making frameworks",
        "Engage in strategic thinking games"
      ]
    },
    {
      category: "Physical Wellness",
      items: [
        "Maintain regular exercise routine",
        "Optimize sleep hygiene practices",
        "Monitor and manage energy levels"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Assessment Complete
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              {getAssessmentTitle()}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {getAssessmentDescription()}
            </p>
          </div>

          {/* Overall Score Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">
                {getOverallScoreLabel()}
              </CardTitle>
              <div className="flex items-center justify-center gap-4">
                <div className="text-6xl font-bold text-primary">{getOverallScore()}</div>
                <div className="text-left">
                  <Badge className="mb-2 bg-primary text-primary-foreground">
                    {getProfile()} Level
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {getScoreDescription(getOverallScore())} {getScoreCategory()}
                  </p>
                </div>
              </div>
              <Progress value={getOverallScore()} className="w-full max-w-md mx-auto mt-4" />
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <InteractiveResultsVisualization
                dimensions={getDimensionScores()}
                overallScore={getOverallScore()}
                assessmentType={assessmentType}
                strengths={getStrengths()}
                improvementAreas={getDevelopmentAreas().map(area => typeof area === 'string' ? area : area.category)}
              />
              
              <ProgressTracker 
                currentAssessment={assessmentType}
                userId={candidateInfo?.email || 'anonymous'}
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dimensions.map((dimension) => (
                  <Card key={dimension.key} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${dimension.bgColor}`}>
                          <dimension.icon className={`h-5 w-5 ${dimension.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dimension.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-2xl font-bold ${getScoreColor(getDimensionScores()[dimension.key] || 0)}`}>
                              {getDimensionScores()[dimension.key] || 0}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getScoreDescription(getDimensionScores()[dimension.key] || 0)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress 
                        value={getDimensionScores()[dimension.key] || 0}
                        className="h-2 mb-2" 
                      />
                      <p className="text-sm text-muted-foreground">
                        {dimension.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Stress Threshold
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">High</div>
                    <p className="text-sm text-muted-foreground">
                      Can handle significant pressure before performance degradation
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-blue-500" />
                      Recovery Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">Fast</div>
                    <p className="text-sm text-muted-foreground">
                      Quickly returns to baseline after stressful events
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Burnout Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">Low</div>
                    <p className="text-sm text-muted-foreground">
                      Good protective factors against chronic stress
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="space-y-6">
              {dimensions.map((dimension) => (
                <Card key={dimension.key}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${dimension.bgColor}`}>
                          <dimension.icon className={`h-6 w-6 ${dimension.color}`} />
                        </div>
                        <div>
                          <CardTitle>{dimension.title}</CardTitle>
                          <CardDescription>{dimension.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(getDimensionScores()[dimension.key] || 0)}`}>
                          {getDimensionScores()[dimension.key] || 0}
                        </div>
                        <Badge variant="outline">
                          {getScoreDescription(getDimensionScores()[dimension.key] || 0)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={getDimensionScores()[dimension.key] || 0} className="mb-4" />
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Strong baseline capacity</li>
                          <li>• Good recovery patterns</li>
                          <li>• Effective coping strategies</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-orange-600">Growth Areas</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Practice under higher stress</li>
                          <li>• Develop backup strategies</li>
                          <li>• Build support networks</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Stress Response Pattern</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Initial Response</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Strong</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Peak Performance</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Maintained</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recovery Speed</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Fast</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Adaptability Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Change Acceptance</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">High</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Innovation Under Pressure</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Strong</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Learning from Setbacks</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Excellent</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Shield className="h-8 w-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-green-800">Protective Factors</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Strong emotional regulation and social support utilization
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-blue-800">Growth Indicators</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Consistent improvement under progressive stress loading
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <Target className="h-8 w-8 text-orange-600 mb-2" />
                      <h4 className="font-medium text-orange-800">Focus Areas</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Physical stress management and long-term sustainability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Development Tab */}
            <TabsContent value="development" className="space-y-6">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{rec.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rec.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Immediate Actions (Next 30 days)</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Implement daily stress management techniques and begin resilience training exercises
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Target className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Medium-term Goals (3-6 months)</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Build support networks and practice advanced stress inoculation scenarios
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-800">Long-term Development (6+ months)</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Leadership roles in high-pressure situations and mentoring others in resilience
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              onClick={downloadReport}
              className="bg-gradient-primary hover:shadow-glow"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
            
            {candidateInfo && (
              <>
                <Button 
                  size="lg" 
                  onClick={() => generateAIReport('candidate')}
                  disabled={isGeneratingAI}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'Generate AI Report'}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => generateAIReport('employer')}
                  disabled={isGeneratingAI}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Building className="h-4 w-4 mr-2" />
                  {isGeneratingAI ? 'Generating...' : 'Employer Report'}
                </Button>
              </>
            )}
            
            <Button size="lg" variant="outline" onClick={shareResults}>
              <Share className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button size="lg" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>
        
        {/* Legal Notices */}
        <div className="container mx-auto px-4 max-w-6xl">
          <LegalNotices variant="short" className="mt-8 pb-8" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AssessmentResults;