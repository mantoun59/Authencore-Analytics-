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
        reportData = reportType === 'employer' ? {
          assessmentType: 'Communication Styles Assessment - Employer Report',
          reportType: 'employer' as const,
          userInfo: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            assessmentDate: new Date().toLocaleDateString(),
            questionsAnswered: 75,
            timeSpent: '18 minutes',
            reliabilityScore: 94,
            reportId: `COMM-EMP-${Date.now()}`,
            position: 'Senior Marketing Coordinator',
            department: 'Marketing & Communications'
          },
          overallScore: 77,
          dimensions: [
            { name: 'Leadership Communication', score: 82, level: 'High', description: 'Demonstrates strong ability to communicate vision and direction effectively to team members and stakeholders.' },
            { name: 'Team Collaboration', score: 85, level: 'Very High', description: 'Excellent at facilitating group discussions and building consensus among diverse team members.' },
            { name: 'Client Interaction', score: 80, level: 'High', description: 'Skilled in professional client communication with ability to build and maintain business relationships.' },
            { name: 'Conflict Resolution', score: 68, level: 'Moderate', description: 'Shows potential in managing workplace conflicts but would benefit from additional training and development.' },
            { name: 'Written Communication', score: 75, level: 'High', description: 'Produces clear, professional written communications suitable for business environments.' },
            { name: 'Presentation Skills', score: 83, level: 'Very High', description: 'Confident presenter who can engage audiences and deliver compelling business presentations.' },
            { name: 'Cross-Cultural Communication', score: 72, level: 'High', description: 'Generally effective in diverse workplace settings with room for cultural sensitivity development.' }
          ],
          profile: 'Sarah demonstrates strong communication capabilities that align well with leadership and client-facing roles. Her expressive communication style and high influence capabilities make her an asset for team leadership positions. While conflict resolution skills require development, her overall communication profile suggests readiness for increased responsibilities.',
          
          employerInsights: {
            'Hiring Recommendation': 'RECOMMENDED - Strong communication skills with leadership potential',
            'Best Fit Roles': 'Team Lead, Account Manager, Project Coordinator, Training Specialist',
            'Management Potential': 'High - Shows natural leadership communication abilities',
            'Team Dynamics': 'Positive contributor who enhances team collaboration and morale',
            'Client-Facing Suitability': 'Excellent - Professional demeanor with relationship-building skills',
            'Training Investment': 'Moderate - Focus on conflict resolution and technical communication'
          },
          
          riskAssessment: {
            'Communication Risks': 'Low overall risk with minor attention needed for difficult conversations',
            'Workplace Conflicts': 'Medium risk - may avoid direct confrontation, could benefit from assertiveness training',
            'Cultural Sensitivity': 'Low risk - generally inclusive communication style',
            'Professional Boundaries': 'Low risk - maintains appropriate professional communication standards'
          },
          
          strengths: [
            'Natural leadership presence that inspires confidence in team members',
            'Exceptional presentation and public speaking abilities for client meetings',
            'Strong collaborative approach that builds team cohesion and productivity',
            'Adaptable communication style that works across different business contexts',
            'Professional written communication skills suitable for all business correspondence'
          ],
          
          developmentAreas: [
            'Conflict resolution skills for managing workplace disagreements effectively',
            'Direct feedback delivery when addressing performance or behavioral issues',
            'Technical communication for complex project documentation and specifications',
            'Cross-cultural communication sensitivity for global business interactions',
            'Time management in communication-heavy roles and lengthy meetings'
          ],
          
          managementRecommendations: [
            'Assign to client-facing roles where relationship building is critical',
            'Consider for team leadership positions with appropriate conflict resolution training',
            'Leverage presentation skills for company-wide communications and training',
            'Provide mentorship opportunities to develop executive communication skills',
            'Enroll in conflict mediation training to address development gap',
            'Partner with technical teams to improve specialized communication abilities'
          ],
          
          contextualEffectiveness: {
            'Leadership Meetings': { score: 88, description: 'Excellent at facilitating team meetings and driving productive discussions' },
            'Client Presentations': { score: 85, description: 'Highly effective at presenting to external stakeholders and closing deals' },
            'Performance Reviews': { score: 70, description: 'Good foundation but needs improvement in delivering difficult feedback' },
            'Crisis Communication': { score: 65, description: 'Shows potential but requires additional training for high-pressure situations' },
            'Cross-Department Collaboration': { score: 82, description: 'Strong ability to work across organizational boundaries and build partnerships' },
            'Training & Mentoring': { score: 80, description: 'Natural teaching ability that translates well to employee development roles' }
          },
          
          workingStyles: {
            'Preferred Management Style': 'Collaborative leadership with emphasis on team input and consensus building',
            'Feedback Reception': 'Open to constructive feedback and actively seeks opportunities for growth',
            'Stress Communication': 'Maintains professionalism under pressure but may need support during high-conflict situations',
            'Decision Communication': 'Effectively communicates decisions with clear rationale and next steps',
            'Change Management': 'Good at helping teams navigate organizational changes through clear communication'
          },
          
          distortionAnalysis: {
            'Overall Authenticity': 'High - Responses appear genuine and consistent',
            'Social Desirability': 'Moderate - Some tendency to present in favorable light, within normal range',
            'Response Consistency': 'High - Consistent response patterns throughout assessment',
            'Extreme Responding': 'Low - Balanced use of response scale indicates thoughtful consideration',
            'Impression Management': 'Moderate - Shows awareness of professional context without over-enhancement',
            'Validity Indicators': 'All validity checks passed - Results are reliable for hiring decisions'
          },
          
          careerMatches: [
            {
              career: { title: 'Account Manager', description: 'Managing client relationships and driving business growth' },
              matchPercentage: 89,
              fitScore: 87,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Technical product knowledge'],
              strengthAlignment: ['Client communication', 'Relationship building'],
              salaryExpectation: '$65,000 - $85,000',
              growthPotential: 'High',
              developmentPath: ['Account management training', 'Product expertise']
            },
            {
              career: { title: 'Team Lead/Supervisor', description: 'Leading teams and managing day-to-day operations' },
              matchPercentage: 85,
              fitScore: 83,
              readinessLevel: 'Qualified',
              skillGaps: ['Conflict resolution', 'Performance management'],
              strengthAlignment: ['Leadership communication', 'Team building'],
              salaryExpectation: '$70,000 - $90,000',
              growthPotential: 'High',
              developmentPath: ['Leadership development', 'Management training']
            },
            {
              career: { title: 'Training Specialist', description: 'Developing and delivering training programs' },
              matchPercentage: 82,
              fitScore: 80,
              readinessLevel: 'Qualified',
              skillGaps: ['Instructional design', 'Learning management systems'],
              strengthAlignment: ['Presentation skills', 'Communication clarity'],
              salaryExpectation: '$60,000 - $80,000',
              growthPotential: 'Medium',
              developmentPath: ['Training certification', 'Learning technology']
            },
            {
              career: { title: 'Project Coordinator', description: 'Coordinating cross-functional projects and teams' },
              matchPercentage: 78,
              fitScore: 75,
              readinessLevel: 'Entry Level',
              skillGaps: ['Project management tools', 'Timeline management'],
              strengthAlignment: ['Team collaboration', 'Communication coordination'],
              salaryExpectation: '$55,000 - $75,000',
              growthPotential: 'High',
              developmentPath: ['Project management certification', 'Process improvement']
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
        } : {
          assessmentType: 'Communication Styles Assessment',
          reportType: 'standard' as const,
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
      } else if (selectedAssessment === 'career-launch') {
        reportData = reportType === 'employer' ? {
          assessmentType: 'Career Launch Assessment - Employer Report',
          reportType: 'employer' as const,
          userInfo: {
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            assessmentDate: new Date().toLocaleDateString(),
            questionsAnswered: 90,
            timeSpent: '25 minutes',
            reliabilityScore: 96,
            reportId: `CAREER-EMP-${Date.now()}`,
            position: 'Marketing Analyst',
            department: 'Marketing'
          },
          overallScore: 82,
          dimensions: [
            { name: 'Technical Aptitude', score: 85, level: 'Very High', description: 'Demonstrates strong analytical and technical problem-solving capabilities essential for data-driven roles.' },
            { name: 'Leadership Potential', score: 78, level: 'High', description: 'Shows natural leadership tendencies with ability to influence and guide team decisions.' },
            { name: 'Creative Problem Solving', score: 80, level: 'High', description: 'Innovative approach to challenges with ability to think outside conventional frameworks.' },
            { name: 'Communication Skills', score: 75, level: 'High', description: 'Effective communicator with ability to present complex information clearly to diverse audiences.' },
            { name: 'Adaptability', score: 88, level: 'Very High', description: 'Exceptional flexibility in adjusting to changing work environments and new challenges.' },
            { name: 'Risk Tolerance', score: 70, level: 'Moderate', description: 'Balanced approach to risk-taking with careful consideration of potential outcomes.' }
          ],
          profile: 'Michael demonstrates strong analytical capabilities combined with leadership potential that make him well-suited for progressive career advancement. His high adaptability and technical aptitude position him for success in evolving business environments.',
          employerInsights: {
            'Hiring Recommendation': 'HIGHLY RECOMMENDED - Strong technical and leadership combination',
            'Best Fit Roles': 'Data Analyst, Product Manager, Business Analyst, Technical Lead',
            'Management Potential': 'Very High - Shows natural progression to senior roles',
            'Innovation Capacity': 'High - Brings creative solutions to business challenges',
            'Learning Agility': 'Excellent - Rapid skill acquisition and application',
            'Career Trajectory': 'Fast track potential for senior management positions'
          },
          riskAssessment: {
            'Job Stability': 'Low risk - High engagement and career progression focus',
            'Skill Obsolescence': 'Very low risk - Strong learning orientation and adaptability',
            'Team Integration': 'Low risk - Good collaboration and communication skills',
            'Role Expectations': 'Low risk - Realistic career goals and self-awareness'
          },
          distortionAnalysis: {
            'Overall Authenticity': 'Very High - Responses demonstrate genuine self-reflection',
            'Social Desirability': 'Low - Honest assessment with appropriate self-criticism',
            'Response Consistency': 'Very High - Consistent patterns across all dimensions',
            'Career Realism': 'High - Realistic expectations aligned with capabilities',
            'Validity Indicators': 'All validity checks passed - Highly reliable results'
          },
          contextualEffectiveness: {
            'Project Leadership': { score: 82, description: 'Strong ability to lead cross-functional projects and drive results' },
            'Data Analysis': { score: 88, description: 'Excellent analytical skills for complex business problems' },
            'Strategic Planning': { score: 75, description: 'Good foundation for strategic thinking with growth potential' },
            'Team Development': { score: 78, description: 'Natural mentoring ability with leadership development potential' },
            'Innovation Management': { score: 80, description: 'Creative problem-solving approach to business challenges' }
          },
          careerMatches: [
            {
              career: { title: 'Senior Business Analyst', description: 'Analyzing business processes and driving improvements' },
              matchPercentage: 92,
              fitScore: 90,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Advanced analytics tools'],
              strengthAlignment: ['Technical aptitude', 'Problem solving'],
              salaryExpectation: '$75,000 - $95,000',
              growthPotential: 'Very High',
              developmentPath: ['Advanced analytics certification', 'Business strategy training']
            }
          ]
        } : {
          assessmentType: 'Career Launch Assessment',
          reportType: 'standard' as const,
          userInfo: {
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            assessmentDate: new Date().toLocaleDateString(),
            questionsAnswered: 90,
            timeSpent: '25 minutes',
            reliabilityScore: 96,
            reportId: `CAREER-${Date.now()}`
          },
          overallScore: 82,
          dimensions: [
            { name: 'Technical Aptitude', score: 85, level: 'Very High', description: 'Your strong analytical and technical problem-solving capabilities position you well for data-driven careers.' },
            { name: 'Leadership Potential', score: 78, level: 'High', description: 'Natural leadership tendencies that will serve you well in management track positions.' },
            { name: 'Creative Problem Solving', score: 80, level: 'High', description: 'Innovative thinking approach that brings fresh perspectives to challenges.' },
            { name: 'Adaptability', score: 88, level: 'Very High', description: 'Exceptional flexibility that will help you thrive in dynamic work environments.' }
          ],
          profile: 'You have a strong foundation for career success with excellent technical skills and leadership potential. Your adaptability and problem-solving abilities make you well-suited for roles that require both analytical thinking and people management.',
          careerMatches: [
            {
              career: { title: 'Business Analyst', description: 'Analyzing business processes to drive improvements' },
              matchPercentage: 90,
              fitScore: 88,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Advanced Excel', 'SQL'],
              strengthAlignment: ['Analytical thinking', 'Problem solving'],
              salaryExpectation: '$65,000 - $85,000',
              growthPotential: 'Very High',
              developmentPath: ['Business analysis certification', 'Data analytics training']
            }
          ]
        };
      } else if (selectedAssessment === 'cair' || selectedAssessment === 'cair-personality' || selectedAssessment === 'cairplus') {
        reportData = reportType === 'employer' ? {
          assessmentType: 'CAIR+ Personality Assessment - Employer Report',
          reportType: 'employer' as const,
          userInfo: {
            name: 'David Martinez',
            email: 'david.martinez@example.com',
            assessmentDate: new Date().toLocaleDateString(),
            questionsAnswered: 120,
            timeSpent: '32 minutes',
            reliabilityScore: 97,
            reportId: `CAIR-EMP-${Date.now()}`,
            position: 'Senior Project Manager',
            department: 'Operations'
          },
          overallScore: 84,
          dimensions: [
            { 
              name: 'Conscientiousness', 
              score: 88, 
              level: 'Very High', 
              description: 'Exceptional organizational skills, reliability, and goal achievement. Demonstrates systematic approach to complex projects and consistently meets commitments.',
              subdimensions: [
                { name: 'Organization', score: 92, level: 'Exceptional', description: 'Outstanding systematic approach to workspace and task management' },
                { name: 'Reliability', score: 89, level: 'Very High', description: 'Exceptional consistency in meeting commitments and deadlines' },
                { name: 'Goal Orientation', score: 85, level: 'Very High', description: 'Strong focus on achieving specific objectives' },
                { name: 'Attention to Detail', score: 87, level: 'Very High', description: 'High precision and thoroughness in work execution' }
              ]
            },
            { 
              name: 'Agreeableness', 
              score: 79, 
              level: 'High', 
              description: 'Strong collaborative tendencies with excellent empathy and team cooperation skills. Natural relationship builder.',
              subdimensions: [
                { name: 'Cooperation', score: 82, level: 'Very High', description: 'Excellent willingness to work collaboratively toward shared goals' },
                { name: 'Empathy', score: 85, level: 'Very High', description: 'Outstanding ability to understand and relate to others\' perspectives' },
                { name: 'Trust', score: 72, level: 'High', description: 'Good faith in others\' intentions with appropriate caution' },
                { name: 'Helpfulness', score: 78, level: 'High', description: 'Strong tendency to support and assist colleagues' }
              ]
            },
            { 
              name: 'Innovation', 
              score: 75, 
              level: 'High', 
              description: 'Good creative problem-solving abilities with solid adaptability to change and new situations.',
              subdimensions: [
                { name: 'Creativity', score: 73, level: 'High', description: 'Good ability to generate novel ideas and original solutions' },
                { name: 'Adaptability', score: 80, level: 'High', description: 'Strong flexibility in adjusting to new situations and changes' },
                { name: 'Openness to Change', score: 76, level: 'High', description: 'Good acceptance and embrace of change initiatives' },
                { name: 'Risk Taking', score: 69, level: 'Moderate', description: 'Balanced approach to risk with careful consideration' }
              ]
            },
            { 
              name: 'Resilience', 
              score: 82, 
              level: 'Very High', 
              description: 'Excellent stress management and recovery abilities. Maintains high performance under pressure.',
              subdimensions: [
                { name: 'Stress Tolerance', score: 85, level: 'Very High', description: 'Outstanding ability to maintain performance under pressure' },
                { name: 'Recovery Speed', score: 78, level: 'High', description: 'Good ability to bounce back from setbacks quickly' },
                { name: 'Emotional Stability', score: 84, level: 'Very High', description: 'Excellent emotional consistency and self-regulation' },
                { name: 'Optimism', score: 80, level: 'High', description: 'Strong positive outlook and hope in challenging situations' }
              ]
            }
          ],
          profile: 'David demonstrates an exceptional blend of conscientiousness and resilience that makes him highly suitable for senior management roles. His strong organizational skills combined with collaborative leadership style position him as an ideal candidate for complex project management and team leadership positions.',
          employerInsights: {
            'Hiring Recommendation': 'HIGHLY RECOMMENDED - Outstanding leadership and management potential',
            'Best Fit Roles': 'Senior Project Manager, Operations Director, Team Lead, Department Manager',
            'Management Potential': 'Exceptional - Ready for senior leadership responsibilities',
            'Team Dynamics': 'Excellent team builder and collaborative leader',
            'Stress Handling': 'Outstanding performance under pressure and tight deadlines',
            'Development Investment': 'Low risk, high return - minimal training needed for immediate impact'
          },
          riskAssessment: {
            'Performance Risk': 'Very Low - Consistent high performer with proven reliability',
            'Leadership Risk': 'Low - Natural leadership abilities with collaborative approach',
            'Stress Management': 'Very Low - Excellent resilience and pressure handling',
            'Team Integration': 'Very Low - Strong interpersonal skills and empathy',
            'Cultural Adaptability': 'Low - Good flexibility and openness to organizational changes'
          },
          distortionAnalysis: {
            'Response Authenticity': 'Very High - Consistent genuine response patterns throughout assessment',
            'Social Desirability Bias': 'Low - Minimal tendency to present overly favorable image',
            'Impression Management': 'Moderate - Appropriate professional presentation without over-enhancement',
            'Response Consistency': 'Excellent - Highly consistent patterns across similar question types',
            'Extreme Response Bias': 'Low - Balanced use of response scale indicating thoughtful consideration',
            'Fake Good Indicators': 'Low risk - No significant inflation of positive traits',
            'Fake Bad Indicators': 'Very Low - No evidence of response minimization',
            'Random Response Pattern': 'None detected - Thoughtful and deliberate response engagement',
            'Overall Validity': 'Excellent - Results highly reliable for hiring and development decisions',
            'Confidence Level': '97% - Assessment results suitable for high-stakes employment decisions'
          },
          contextualEffectiveness: {
            'Project Leadership': { score: 92, description: 'Exceptional ability to lead complex projects and coordinate multiple stakeholders' },
            'Team Management': { score: 87, description: 'Outstanding team building and collaborative leadership capabilities' },
            'Crisis Management': { score: 84, description: 'Excellent performance under pressure with strong problem-solving approach' },
            'Strategic Planning': { score: 79, description: 'Good long-term thinking with systematic implementation approach' },
            'Change Leadership': { score: 81, description: 'Strong ability to guide teams through organizational transitions' },
            'Stakeholder Relations': { score: 85, description: 'Excellent interpersonal skills for managing diverse stakeholder relationships' }
          },
          workingStyles: {
            'Decision Making': 'Systematic and collaborative approach with thorough analysis',
            'Communication Style': 'Clear, direct, and empathetic with strong listening skills',
            'Conflict Resolution': 'Diplomatic and solution-focused with emphasis on win-win outcomes',
            'Work Pace': 'Steady and reliable with ability to accelerate when needed',
            'Leadership Approach': 'Collaborative and supportive while maintaining clear accountability',
            'Innovation Preference': 'Balanced approach valuing both stability and continuous improvement'
          },
          careerMatches: [
            {
              career: { title: 'Operations Director', description: 'Leading operational excellence and process optimization' },
              matchPercentage: 94,
              fitScore: 92,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Strategic finance knowledge'],
              strengthAlignment: ['Organizational excellence', 'Team leadership', 'Process management'],
              salaryExpectation: '$120,000 - $150,000',
              growthPotential: 'Very High',
              developmentPath: ['Executive leadership program', 'Financial management training']
            },
            {
              career: { title: 'Senior Project Manager', description: 'Managing complex multi-stakeholder projects' },
              matchPercentage: 92,
              fitScore: 90,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Advanced project methodologies'],
              strengthAlignment: ['Organization', 'Reliability', 'Team collaboration'],
              salaryExpectation: '$95,000 - $120,000',
              growthPotential: 'Very High',
              developmentPath: ['PMP certification', 'Agile/Scrum mastery']
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
        } : {
          assessmentType: 'CAIR+ Personality Assessment',
          reportType: 'standard' as const,
          userInfo: {
            name: 'David Martinez',
            email: 'david.martinez@example.com',
            assessmentDate: new Date().toLocaleDateString(),
            questionsAnswered: 120,
            timeSpent: '32 minutes',
            reliabilityScore: 97,
            reportId: `CAIR-${Date.now()}`
          },
          overallScore: 84,
          dimensions: [
            { 
              name: 'Conscientiousness', 
              score: 88, 
              level: 'Very High', 
              description: 'You have exceptional organizational skills and reliability. You naturally create structure, follow through on commitments, and maintain high standards in your work.',
              subdimensions: [
                { name: 'Organization', score: 92, level: 'Exceptional', description: 'You excel at creating and maintaining efficient systems and organized approaches to tasks' },
                { name: 'Reliability', score: 89, level: 'Very High', description: 'Others can always count on you to meet commitments and deliver quality work on time' },
                { name: 'Goal Orientation', score: 85, level: 'Very High', description: 'You have a strong focus on achieving specific objectives and measurable outcomes' }
              ]
            },
            { 
              name: 'Agreeableness', 
              score: 79, 
              level: 'High', 
              description: 'You have strong collaborative tendencies with excellent empathy and team cooperation skills. You naturally build positive relationships.',
              subdimensions: [
                { name: 'Cooperation', score: 82, level: 'Very High', description: 'You work exceptionally well with others toward shared goals and team success' },
                { name: 'Empathy', score: 85, level: 'Very High', description: 'You have an outstanding ability to understand and relate to others\' perspectives and feelings' },
                { name: 'Trust', score: 72, level: 'High', description: 'You generally have faith in others while maintaining appropriate caution' }
              ]
            },
            { 
              name: 'Innovation', 
              score: 75, 
              level: 'High', 
              description: 'You have good creative problem-solving abilities with solid adaptability to change and new situations.',
              subdimensions: [
                { name: 'Creativity', score: 73, level: 'High', description: 'You bring good creative thinking and novel approaches to problem-solving' },
                { name: 'Adaptability', score: 80, level: 'High', description: 'You adjust well to new situations and changing circumstances' },
                { name: 'Openness to Change', score: 76, level: 'High', description: 'You generally embrace change and see opportunities in new situations' }
              ]
            },
            { 
              name: 'Resilience', 
              score: 82, 
              level: 'Very High', 
              description: 'You have excellent stress management and recovery abilities. You maintain high performance under pressure and bounce back quickly from setbacks.',
              subdimensions: [
                { name: 'Stress Tolerance', score: 85, level: 'Very High', description: 'You maintain excellent performance and composure under pressure' },
                { name: 'Recovery Speed', score: 78, level: 'High', description: 'You bounce back from setbacks and disappointments relatively quickly' },
                { name: 'Emotional Stability', score: 84, level: 'Very High', description: 'You demonstrate excellent emotional consistency and self-regulation' }
              ]
            }
          ],
          profile: 'Your personality profile reveals a exceptional blend of conscientiousness and resilience that positions you well for leadership and management roles. Your strong organizational skills, combined with your collaborative nature and stress resilience, make you particularly well-suited for complex project management and team leadership positions.',
          strengths: [
            'Exceptional organizational and planning capabilities that drive project success',
            'Outstanding reliability and follow-through that builds trust with colleagues',
            'Strong collaborative leadership style that motivates and engages teams',
            'Excellent stress resilience that maintains performance under pressure',
            'High empathy and interpersonal skills that build positive relationships',
            'Good adaptability and openness to change and innovation'
          ],
          developmentAreas: [
            'Continue building creative problem-solving skills for complex challenges',
            'Develop comfort with higher levels of risk-taking for innovation opportunities',
            'Enhance strategic thinking capabilities for long-term planning',
            'Build confidence in independent decision-making in ambiguous situations'
          ],
          recommendations: [
            'Seek leadership opportunities that leverage your organizational and collaborative strengths',
            'Consider advanced project management or operations management roles',
            'Develop strategic thinking skills through mentorship or executive education',
            'Practice creative problem-solving techniques to enhance innovation capabilities',
            'Build a network of mentors and peers in senior management positions',
            'Explore opportunities that combine your organizational skills with team leadership'
          ],
          contextualEffectiveness: {
            'Team Leadership': { score: 87, description: 'Excellent collaborative leadership style that motivates teams' },
            'Project Management': { score: 92, description: 'Outstanding organizational and coordination capabilities' },
            'Stress Management': { score: 85, description: 'Excellent performance maintenance under pressure' },
            'Innovation Projects': { score: 75, description: 'Good creative contribution with room for growth' },
            'Change Adaptation': { score: 80, description: 'Strong flexibility in adjusting to new situations' },
            'Relationship Building': { score: 83, description: 'Excellent interpersonal connection and trust building' }
          },
          careerMatches: [
            {
              career: { title: 'Project Manager', description: 'Leading complex projects and coordinating teams' },
              matchPercentage: 92,
              fitScore: 90,
              readinessLevel: 'Highly Qualified',
              skillGaps: ['Advanced project methodologies'],
              strengthAlignment: ['Organization', 'Reliability', 'Team leadership'],
              salaryExpectation: '$75,000 - $95,000',
              growthPotential: 'Very High',
              developmentPath: ['PMP certification', 'Leadership development']
            },
            {
              career: { title: 'Operations Manager', description: 'Managing operational processes and efficiency' },
              matchPercentage: 89,
              fitScore: 87,
              readinessLevel: 'Qualified',
              skillGaps: ['Process optimization', 'Data analysis'],
              strengthAlignment: ['Conscientiousness', 'Team collaboration'],
              salaryExpectation: '$70,000 - $90,000',
              growthPotential: 'High',
              developmentPath: ['Operations management training', 'Lean Six Sigma']
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
        // Enhanced data for other assessments
        const assessmentProfiles = {
          'emotional-intelligence': {
            dimensions: [
              { name: 'Self-Awareness', score: 78, level: 'High', description: 'Strong understanding of your own emotions and their impact on performance and relationships.' },
              { name: 'Self-Regulation', score: 75, level: 'High', description: 'Good ability to manage emotions effectively and maintain composure under pressure.' },
              { name: 'Empathy', score: 82, level: 'Very High', description: 'Exceptional ability to understand and relate to others\' emotions and perspectives.' },
              { name: 'Social Skills', score: 80, level: 'High', description: 'Strong interpersonal skills that facilitate effective collaboration and relationship building.' }
            ],
            profile: 'You demonstrate strong emotional intelligence with particular strengths in empathy and social connection. This foundation supports effective leadership and team collaboration.',
            contextualEffectiveness: {
              'Team Leadership': { score: 82, description: 'Excellent emotional awareness enhances team dynamics' },
              'Client Relations': { score: 85, description: 'High empathy creates strong client connections' },
              'Conflict Resolution': { score: 78, description: 'Good emotional regulation supports mediation skills' },
              'Change Management': { score: 75, description: 'Self-awareness helps navigate organizational changes' }
            },
            employerDistortion: {
              'Emotional Authenticity': 'High - Genuine emotional responses indicate authentic self-awareness',
              'Empathy Inflation': 'Low risk - Empathy scores align with behavioral indicators',
              'Social Desirability': 'Moderate - Some tendency to present as emotionally mature, within normal range',
              'Self-Report Accuracy': 'High - Emotional intelligence responses show good self-insight',
              'Response Validity': 'Excellent - All emotional intelligence validity measures passed'
            }
          },
          'leadership': {
            dimensions: [
              { name: 'Vision Setting', score: 80, level: 'High', description: 'Strong ability to develop and communicate compelling future direction for teams and organizations.' },
              { name: 'Decision Making', score: 75, level: 'High', description: 'Effective at making timely decisions with appropriate consideration of available information.' },
              { name: 'Team Building', score: 85, level: 'Very High', description: 'Exceptional skills in creating cohesive, high-performing teams and fostering collaboration.' },
              { name: 'Influence', score: 78, level: 'High', description: 'Strong ability to persuade and motivate others toward shared goals and objectives.' }
            ],
            profile: 'You show strong leadership potential with particular strengths in team building and vision communication. Your collaborative approach creates environments where teams thrive.',
            contextualEffectiveness: {
              'Strategic Planning': { score: 78, description: 'Good vision-setting ability supports strategic initiatives' },
              'Team Development': { score: 88, description: 'Exceptional team building creates high-performance cultures' },
              'Change Leadership': { score: 75, description: 'Solid foundation for leading organizational transformations' },
              'Crisis Management': { score: 72, description: 'Developing skills for high-pressure decision making' }
            },
            employerDistortion: {
              'Leadership Inflation': 'Low risk - Leadership scores supported by behavioral evidence',
              'Authority Bias': 'Moderate - Some tendency to overstate leadership experience, monitored',
              'Influence Accuracy': 'High - Influence patterns align with reported capabilities',
              'Decision-Making Realism': 'High - Realistic assessment of decision-making abilities',
              'Validity Indicators': 'All leadership assessment validity checks passed'
            }
          },
          'genz': {
            dimensions: [
              { name: 'Digital Fluency', score: 92, level: 'Very High', description: 'Exceptional comfort and skill with digital tools, platforms, and emerging technologies.' },
              { name: 'Work-Life Integration', score: 75, level: 'High', description: 'Strong ability to balance professional responsibilities with personal well-being and values.' },
              { name: 'Purpose Alignment', score: 88, level: 'Very High', description: 'Clear focus on meaningful work that aligns with personal values and social impact.' },
              { name: 'Continuous Learning', score: 85, level: 'Very High', description: 'Strong commitment to ongoing skill development and adaptability in a changing workplace.' }
            ],
            profile: 'You embody the strengths of the digital generation with exceptional technological fluency and strong values alignment. Your learning agility positions you well for emerging career opportunities.',
            contextualEffectiveness: {
              'Remote Collaboration': { score: 90, description: 'Excellent digital collaboration skills for distributed teams' },
              'Innovation Projects': { score: 85, description: 'Strong technological foundation supports innovation initiatives' },
              'Social Impact Roles': { score: 88, description: 'High purpose alignment drives engagement in meaningful work' },
              'Rapid Skill Acquisition': { score: 87, description: 'Learning agility enables quick adaptation to new requirements' }
            },
            employerDistortion: {
              'Digital Competency Accuracy': 'Very High - Digital skills demonstrated through assessment performance',
              'Generation Bias': 'Low risk - Age-appropriate expectations without overstating capabilities',
              'Purpose Authenticity': 'High - Values alignment supported by consistent response patterns',
              'Learning Agility Claims': 'High - Learning orientation validated through behavioral indicators',
              'Technology Assessment Validity': 'Excellent - All digital fluency measures show high reliability'
            }
          }
        };

        const selectedProfile = assessmentProfiles[selectedAssessment as keyof typeof assessmentProfiles] || {
          dimensions: [
            { name: 'Core Competency 1', score: 75, level: 'High', description: 'Strong foundation in key skills relevant to this assessment area.' },
            { name: 'Core Competency 2', score: 80, level: 'High', description: 'Well-developed abilities that support professional effectiveness.' },
            { name: 'Core Competency 3', score: 78, level: 'High', description: 'Solid capabilities that contribute to overall performance and success.' }
          ],
          profile: 'You demonstrate strong capabilities in the key areas measured by this assessment, with a solid foundation for continued growth and development.',
          contextualEffectiveness: {
            'Professional Context 1': { score: 78, description: 'Good effectiveness in primary professional scenarios' },
            'Professional Context 2': { score: 82, description: 'Strong performance in collaborative work environments' },
            'Professional Context 3': { score: 75, description: 'Solid foundation for continued skill development' }
          },
          employerDistortion: {
            'Assessment Authenticity': 'High - Consistent response patterns indicate genuine engagement',
            'Professional Presentation': 'Moderate - Appropriate level of positive self-presentation',
            'Response Reliability': 'High - Valid and reliable assessment outcomes',
            'Hiring Suitability': 'Excellent - Results suitable for employment decision-making'
          }
        };

        reportData = reportType === 'employer' ? {
          assessmentType: `${getAssessmentDisplayName(selectedAssessment)} - Employer Report`,
          reportType: 'employer' as const,
          userInfo: {
            name: sampleData.candidateInfo.name,
            email: sampleData.candidateInfo.email,
            assessmentDate: sampleData.candidateInfo.completionDate,
            questionsAnswered: 75,
            timeSpent: '20 minutes',
            reliabilityScore: 93,
            reportId: `${selectedAssessment.toUpperCase()}-EMP-${Date.now()}`,
            position: 'Professional Role',
            department: 'Various'
          },
          overallScore: 78,
          dimensions: selectedProfile.dimensions,
          profile: selectedProfile.profile,
          employerInsights: {
            'Hiring Recommendation': 'RECOMMENDED - Strong performance across key competencies',
            'Best Fit Roles': 'Multiple professional roles based on assessment strengths',
            'Development Potential': 'High - Shows capacity for continued growth',
            'Team Contribution': 'Positive - Brings valuable skills to team environments',
            'Learning Investment': 'Moderate - Good foundation with focused development needs'
          },
          riskAssessment: {
            'Performance Risk': 'Low - Strong foundation across key competencies',
            'Cultural Fit': 'Good - Demonstrates values alignment and adaptability',
            'Growth Potential': 'High - Shows capacity for skill development and advancement'
          },
          distortionAnalysis: selectedProfile.employerDistortion || {
            'Overall Authenticity': 'High - Consistent and genuine response patterns',
            'Social Desirability': 'Moderate - Appropriate professional presentation',
            'Response Consistency': 'High - Reliable and valid assessment results',
            'Validity Indicators': 'All checks passed - Results suitable for hiring decisions'
          },
          contextualEffectiveness: selectedProfile.contextualEffectiveness,
          careerMatches: [
            {
              career: { title: 'Professional Role 1', description: 'Role aligned with assessment strengths' },
              matchPercentage: 85,
              fitScore: 82,
              readinessLevel: 'Qualified',
              skillGaps: ['Specific technical skills'],
              strengthAlignment: ['Core competencies', 'Professional skills'],
              salaryExpectation: '$60,000 - $80,000',
              growthPotential: 'High',
              developmentPath: ['Professional development', 'Skill enhancement']
            }
          ]
        } : {
          assessmentType: getAssessmentDisplayName(selectedAssessment),
          reportType: 'standard' as const,
          userInfo: {
            name: sampleData.candidateInfo.name,
            email: sampleData.candidateInfo.email,
            assessmentDate: sampleData.candidateInfo.completionDate,
            questionsAnswered: 75,
            timeSpent: '20 minutes',
            reliabilityScore: 93,
            reportId: `${selectedAssessment.toUpperCase()}-${Date.now()}`
          },
          overallScore: 78,
          dimensions: selectedProfile.dimensions,
          profile: selectedProfile.profile,
          contextualEffectiveness: selectedProfile.contextualEffectiveness,
          strengths: sampleData.executiveSummary?.topStrengths || [
            'Strong foundation in key competency areas',
            'Good potential for professional growth',
            'Effective interpersonal and communication skills'
          ],
          developmentAreas: sampleData.executiveSummary?.keyDevelopmentAreas || [
            'Continued skill development in specialized areas',
            'Enhanced leadership and management capabilities',
            'Advanced technical or industry-specific knowledge'
          ],
          recommendations: sampleData.executiveSummary?.recommendedNextSteps || [
            'Focus on developing identified growth areas',
            'Seek mentorship and professional development opportunities',
            'Consider advanced training in relevant skill areas'
          ],
          careerMatches: [
            {
              career: { title: 'Professional Role', description: 'Role matching assessment strengths' },
              matchPercentage: 82,
              fitScore: 80,
              readinessLevel: 'Qualified',
              skillGaps: ['Technical skills', 'Industry experience'],
              strengthAlignment: ['Core competencies', 'Professional abilities'],
              salaryExpectation: '$55,000 - $75,000',
              growthPotential: 'High',
              developmentPath: ['Professional development', 'Skill building']
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