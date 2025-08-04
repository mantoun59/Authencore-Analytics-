import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Info, Shield, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AssessmentDisclaimersProps {
  assessmentType: string;
  showFull?: boolean;
}

const AssessmentDisclaimers: React.FC<AssessmentDisclaimersProps> = ({ 
  assessmentType, 
  showFull = false 
}) => {
  const getAssessmentSpecificDisclaimer = (type: string) => {
    const disclaimers = {
      'career-launch': {
        title: 'Career Development Exploration',
        content: 'This assessment explores your interests, aptitudes, and preferences to support career development conversations. Results should be used as discussion starters with career counselors, mentors, or advisors rather than definitive career guidance.',
        boundaries: 'Not appropriate for employment decisions or personnel selection.'
      },
      'communication': {
        title: 'Communication Style Insights',
        content: 'This assessment identifies communication patterns and preferences in workplace contexts. Communication effectiveness varies significantly based on relationships, situations, and cultural contexts.',
        boundaries: 'Results should complement, not replace, feedback from colleagues and supervisors.'
      },
      'workplace-wellness': {
        title: 'Workplace Wellness Patterns',
        content: 'This assessment examines workplace engagement patterns and wellness indicators. It focuses on professional wellness and is not a clinical or medical evaluation.',
        boundaries: 'Not appropriate for diagnosing burnout or other clinical conditions. Consult healthcare professionals for medical concerns.'
      },
      'emotional-intelligence': {
        title: 'Workplace Relationship Exploration',
        content: 'This assessment explores self-reported preferences in workplace relationships and emotional situations. Self-assessment has inherent limitations and should be combined with feedback from others.',
        boundaries: 'Not a clinical assessment of emotional intelligence or psychological functioning.'
      },
      'cultural-intelligence': {
        title: 'Cross-Cultural Development Insights',
        content: 'This assessment provides insights into cross-cultural engagement patterns. Cultural intelligence develops through experience, practice, and ongoing learning.',
        boundaries: 'Results should complement cultural learning and experience, not replace cultural education or exposure.'
      },
      'leadership': {
        title: 'Leadership Style Exploration',
        content: 'This assessment identifies leadership preferences and tendencies. Leadership effectiveness depends heavily on context, team dynamics, and organizational culture.',
        boundaries: 'Not appropriate for leadership selection or performance evaluation.'
      },
      'stress-resilience': {
        title: 'Resilience Development Insights',
        content: 'This assessment explores stress management patterns and resilience preferences in workplace contexts. Focus is on professional development, not clinical assessment.',
        boundaries: 'Not appropriate for medical or mental health evaluation. Consult professionals for stress-related health concerns.'
      },
      'digital-wellness': {
        title: 'Digital Workplace Wellness',
        content: 'This assessment examines digital technology use patterns and their impact on workplace wellness. Results support digital wellness planning and habit development.',
        boundaries: 'Not a clinical assessment of technology addiction or mental health conditions.'
      },
      'genz': {
        title: 'Generational Workplace Insights',
        content: 'This assessment explores workplace preferences and values. Individual differences are more significant than generational patterns.',
        boundaries: 'Results should not be used to make assumptions about capabilities or fit based on age or generation.'
      }
    };

    return disclaimers[type] || {
      title: 'Professional Development Assessment',
      content: 'This assessment provides insights for professional development and self-reflection purposes.',
      boundaries: 'Results should be used as discussion starters and development planning tools.'
    };
  };

  const disclaimer = getAssessmentSpecificDisclaimer(assessmentType);

  if (!showFull) {
    return (
      <Alert className="bg-blue-50 border-blue-200 mb-6">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>{disclaimer.title}:</strong> {disclaimer.content}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Main Assessment Disclaimer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-blue-800 text-lg">
            <Info className="h-5 w-5 mr-2" />
            {disclaimer.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-3">{disclaimer.content}</p>
          <p className="font-medium">{disclaimer.boundaries}</p>
        </CardContent>
      </Card>

      {/* Professional Boundaries */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-amber-800 text-lg">
            <Shield className="h-5 w-5 mr-2" />
            Professional Boundaries
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 space-y-2">
          <div className="space-y-1">
            <p className="font-medium">✓ Appropriate Uses:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li>Professional development planning</li>
              <li>Self-reflection and awareness building</li>
              <li>Career exploration and discussion</li>
              <li>Team development conversations</li>
              <li>Coaching and mentoring support</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-medium">✗ Inappropriate Uses:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li>Employment hiring or selection decisions</li>
              <li>Performance evaluations or reviews</li>
              <li>Clinical or medical diagnosis</li>
              <li>Legal or administrative decisions</li>
              <li>Definitive career or life guidance</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality & Interpretation */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-purple-800 text-lg">
            <BookOpen className="h-5 w-5 mr-2" />
            Understanding Your Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-purple-700 space-y-3">
          <div>
            <p className="font-medium mb-2">Interpretation Guidelines:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li>Results reflect patterns in your responses at one point in time</li>
              <li>Individual differences are complex and context-dependent</li>
              <li>Preferences and capabilities develop and change over time</li>
              <li>Cultural, situational, and personal factors influence responses</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Best Practices:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li>Discuss results with mentors, coaches, or advisors</li>
              <li>Consider results alongside other information and experiences</li>
              <li>Use insights as starting points for further exploration</li>
              <li>Seek professional guidance for important decisions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy & Confidentiality */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-green-800 text-lg">
            <Shield className="h-5 w-5 mr-2" />
            Privacy & Confidentiality
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700 space-y-2">
          <p className="text-sm">
            Your assessment responses and results are confidential and remain under your control. 
            You choose what to share and with whom. Organizations using this platform for team 
            development receive only aggregated insights unless you explicitly share individual results.
          </p>
          <p className="text-sm">
            Results are stored securely and used only for generating your personalized insights. 
            We do not share individual data with third parties without your explicit consent.
          </p>
        </CardContent>
      </Card>

      {/* Quality & Limitations Alert */}
      <Alert className="bg-gray-50 border-gray-300">
        <AlertTriangle className="h-4 w-4 text-gray-600" />
        <AlertDescription className="text-gray-700">
          <div className="space-y-2">
            <p className="font-medium">Quality & Limitations Notice:</p>
            <p className="text-sm">
              All assessments have measurement limitations and margins of error. Results include 
              confidence indicators to help you understand the reliability of insights. This platform 
              continuously monitors for bias and works to ensure fair and accurate assessments for 
              all users.
            </p>
            <p className="text-sm">
              For questions about result interpretation or professional development planning, 
              consider consulting with qualified career counselors, coaches, or other professional 
              development specialists.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AssessmentDisclaimers;