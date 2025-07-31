/**
 * Assessment Validation Warning Component
 * Displays validation status and risk warnings for assessments
 * Based on psychometric audit findings
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Info,
  BookOpen,
  Users,
  Gavel
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ValidationStatus {
  assessment_type: string;
  validation_status: string;
  risk_level: string;
  theoretical_foundation: string;
  psychometric_rating: number;
  ethical_concerns: string[];
  notes: string;
}

interface ProfessionalRequirements {
  requires_qualified_administrator: boolean;
  minimum_qualification_level: string;
  requires_supervision: boolean;
  usage_restrictions: string[];
  legal_disclaimers: string[];
}

interface AssessmentValidationWarningProps {
  assessmentType: string;
  onProceed?: () => void;
  onCancel?: () => void;
}

export const AssessmentValidationWarning: React.FC<AssessmentValidationWarningProps> = ({
  assessmentType,
  onProceed,
  onCancel
}) => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [requirements, setRequirements] = useState<ProfessionalRequirements | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAccepted, setUserAccepted] = useState(false);

  useEffect(() => {
    loadValidationData();
  }, [assessmentType]);

  const loadValidationData = async () => {
    try {
      // Get validation status
      const { data: validation } = await supabase
        .from('assessment_validation_status')
        .select('*')
        .eq('assessment_type', assessmentType)
        .single();

      // Get professional requirements
      const { data: reqs } = await supabase
        .from('professional_oversight_requirements')
        .select('*')
        .eq('assessment_type', assessmentType)
        .single();

      setValidationStatus(validation);
      setRequirements(reqs);
    } catch (error) {
      console.error('Error loading validation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'under_review': return <Info className="h-5 w-5 text-yellow-600" />;
      case 'deprecated': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'disabled': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualificationDescription = (level: string) => {
    switch (level) {
      case 'graduate_psychology': return 'Graduate degree in Psychology';
      case 'career_counseling_certification': return 'Career Counseling Certification';
      case 'cross_cultural_training': return 'Cross-Cultural Training Certification';
      case 'communication_training': return 'Communication Training Certification';
      case 'leadership_development_certification': return 'Leadership Development Certification';
      case 'occupational_health_training': return 'Occupational Health Training';
      default: return level;
    }
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Block access to disabled assessments
  if (validationStatus?.validation_status === 'disabled') {
    return (
      <Card className="max-w-2xl mx-auto border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <XCircle className="h-6 w-6" />
            Assessment Currently Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>This assessment has been temporarily disabled</strong> due to psychometric validation concerns identified in our recent audit.
            </AlertDescription>
          </Alert>

          {validationStatus.ethical_concerns.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Identified Concerns:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {validationStatus.ethical_concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Alternative Recommendations:</strong> Please consider our validated assessments such as 
              Career Launch or Cultural Intelligence which have strong scientific foundations.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Choose Different Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Assessment Validation & Professional Standards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Status */}
        {validationStatus && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(validationStatus.validation_status)}
                <span className="font-medium">Validation Status</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getRiskColor(validationStatus.risk_level)}>
                  {validationStatus.risk_level.toUpperCase()} RISK
                </Badge>
                <Badge variant="outline">
                  Rating: {validationStatus.psychometric_rating}/10
                </Badge>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Theoretical Foundation</h4>
              <p className="text-sm text-gray-700">{validationStatus.theoretical_foundation}</p>
              {validationStatus.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">{validationStatus.notes}</p>
              )}
            </div>

            {/* Ethical Concerns */}
            {validationStatus.ethical_concerns.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ethical Considerations:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {validationStatus.ethical_concerns.map((concern, index) => (
                      <li key={index} className="text-sm">{concern}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Professional Requirements */}
        {requirements && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Professional Requirements
            </h3>

            {requirements.requires_qualified_administrator && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Qualified Administrator Required</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Minimum Qualification: {getQualificationDescription(requirements.minimum_qualification_level)}
                </p>
                {requirements.requires_supervision && (
                  <p className="text-sm text-blue-700">
                    ⚠️ Supervision by qualified professional required
                  </p>
                )}
              </div>
            )}

            {/* Usage Restrictions */}
            {requirements.usage_restrictions.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  Usage Restrictions
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {requirements.usage_restrictions.map((restriction, index) => (
                    <li key={index} className="text-sm text-yellow-700">{restriction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Legal Disclaimers */}
            {requirements.legal_disclaimers.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Important Disclaimers</h4>
                <ul className="list-disc list-inside space-y-1">
                  {requirements.legal_disclaimers.map((disclaimer, index) => (
                    <li key={index} className="text-sm text-red-700">{disclaimer}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* User Acknowledgment */}
        <div className="border-t pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acknowledge"
                checked={userAccepted}
                onChange={(e) => setUserAccepted(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="acknowledge" className="text-sm text-gray-700">
                I acknowledge that I have read and understand the validation status, professional requirements, 
                usage restrictions, and legal disclaimers for this assessment. I understand the limitations 
                and will use this assessment responsibly within the specified guidelines.
              </label>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>
                For questions about assessment validation or professional standards, please consult 
                the APA Standards for Educational and Psychological Testing.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <Button 
            onClick={onCancel} 
            variant="outline" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={onProceed} 
            disabled={!userAccepted}
            className="flex-1"
          >
            Proceed with Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentValidationWarning;