import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Info, 
  BookOpen, 
  Users, 
  TrendingUp,
  Heart,
  Brain,
  Target,
  Clock,
  Shield
} from 'lucide-react';

interface ComplianceDisclaimerProps {
  type: 'site-wide' | 'pre-assessment' | 'post-assessment';
  assessmentType?: string;
  className?: string;
}

export const ComplianceDisclaimer: React.FC<ComplianceDisclaimerProps> = ({
  type,
  assessmentType,
  className = ''
}) => {
  if (type === 'site-wide') {
    return (
      <div className={`bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-3 ${className}`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 text-center">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-sm font-medium">
              <span className="font-semibold text-primary">🔍 PROFESSIONAL DEVELOPMENT PLATFORM</span>
              <span className="text-muted-foreground ml-2">
                This platform provides exploratory insights for professional development and self-reflection. 
                Results are suggestive, not definitive, and should be considered alongside other factors 
                and professional guidance where appropriate.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pre-assessment') {
    const assessmentSpecificDisclaimers = {
      'career-launch': {
        icon: Target,
        title: 'Career Exploration Notice',
        content: [
          'Provides general career direction suggestions based on interest patterns',
          'Job market conditions, skills, and opportunities vary by location and time',
          'Consult with career counselors for personalized career planning',
          'Consider multiple factors beyond this exploration in career decisions'
        ]
      },
      'faith-values': {
        icon: Heart,
        title: 'Personal Values Exploration',
        content: [
          'Intended solely for personal reflection and development',
          'Not for employment decisions or workplace evaluation',
          'Respects all belief systems and personal value structures',
          'Results should not influence hiring, promotion, or workplace treatment'
        ]
      },
      'burnout-prevention': {
        icon: Shield,
        title: 'Workplace Wellness Exploration',
        content: [
          'Educational tool for stress awareness and workplace wellness',
          'Not a clinical assessment or medical diagnosis',
          'If experiencing serious stress or mental health concerns, seek professional support',
          'Results do not replace professional mental health evaluation'
        ]
      },
      'communication-styles': {
        icon: Users,
        title: 'Communication Patterns Exploration',
        content: [
          'Explores communication preferences and tendencies',
          'Individual communication varies by context and relationship',
          'Use insights as starting points for professional development',
          'Not intended for personality diagnosis or clinical evaluation'
        ]
      },
      'default': {
        icon: Brain,
        title: 'Professional Development Exploration',
        content: [
          'Educational tool for professional development and self-awareness',
          'Results are exploratory suggestions, not definitive assessments',
          'Individual experiences and development vary significantly',
          'Use insights as part of broader professional growth planning'
        ]
      }
    };

    const disclaimer = assessmentSpecificDisclaimers[assessmentType as keyof typeof assessmentSpecificDisclaimers] || 
                     assessmentSpecificDisclaimers.default;
    
    const Icon = disclaimer.icon;

    return (
      <Card className={`border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 ${className}`}>
        <CardContent className="p-6">
          {/* Universal Disclaimer */}
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="space-y-3">
                <div className="font-semibold text-primary">Important Notice:</div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• This is an exploratory tool for professional development and self-reflection</li>
                  <li>• Results are based on your responses and general patterns, not scientific diagnosis</li>
                  <li>• Individual experiences vary significantly - use insights as starting points for reflection</li>
                  <li>• For professional guidance, consult with qualified career counselors or professionals</li>
                  <li>• Not intended for personnel selection, clinical diagnosis, or definitive life decisions</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Assessment-Specific Disclaimer */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                {disclaimer.title}
              </h3>
              <ul className="text-sm space-y-1 text-amber-700 dark:text-amber-300">
                {disclaimer.content.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-amber-700 border-amber-300">
                Professional Development
              </Badge>
              <Badge variant="outline" className="text-amber-700 border-amber-300">
                Self-Reflection Tool
              </Badge>
              <Badge variant="outline" className="text-amber-700 border-amber-300">
                Educational Purpose
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'post-assessment') {
    return (
      <Alert className={`border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800 ${className}`}>
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="space-y-3">
            <div className="font-semibold text-blue-800 dark:text-blue-200">
              Your Development Insights - Important Context:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Clock className="w-4 h-4" />
                  <span>✓ These insights are based on general patterns and your specific responses</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Users className="w-4 h-4" />
                  <span>✓ Individual experiences vary significantly from general patterns</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="w-4 h-4" />
                  <span>✓ Use these suggestions as starting points for further exploration</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Brain className="w-4 h-4" />
                  <span>✓ Consider multiple perspectives and professional guidance for important decisions</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
              Results are not standardized against clinical or professional norms
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ComplianceDisclaimer;