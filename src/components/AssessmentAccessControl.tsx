/**
 * Assessment Access Control Component
 * Implements access control based on audit findings
 * Blocks disabled assessments and shows validation warnings
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AssessmentValidationWarning from './AssessmentValidationWarning';
import { toast } from 'sonner';

interface AssessmentAccessControlProps {
  assessmentType: string;
  children: React.ReactNode;
  onAccessDenied?: () => void;
}

interface ValidationStatus {
  validation_status: string;
  risk_level: string;
}

export const AssessmentAccessControl: React.FC<AssessmentAccessControlProps> = ({
  assessmentType,
  children,
  onAccessDenied
}) => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [assessmentType]);

  const checkAccess = async () => {
    try {
      // Check if assessment access is allowed
      const { data: hasAccess, error: accessError } = await supabase
        .rpc('check_assessment_access', { p_assessment_type: assessmentType });

      if (accessError) {
        console.error('Error checking access:', accessError);
        toast.error('Error checking assessment access');
        return;
      }

      if (!hasAccess) {
        // Assessment is disabled - deny access
        onAccessDenied?.();
        return;
      }

      // Get validation status for warnings
      const { data: validation } = await supabase
        .from('assessment_validation_status')
        .select('validation_status, risk_level')
        .eq('assessment_type', assessmentType)
        .single();

      setValidationStatus(validation);

      // Show warning for high-risk or under-review assessments
      const needsWarning = validation && (
        validation.validation_status === 'under_review' ||
        validation.risk_level === 'high' ||
        validation.risk_level === 'critical'
      );

      if (needsWarning) {
        setShowWarning(true);
      } else {
        setAccessGranted(true);
      }

    } catch (error) {
      console.error('Error in access control:', error);
      toast.error('Assessment access check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedWithWarning = async () => {
    setShowWarning(false);
    setAccessGranted(true);
    
    // Log that user proceeded despite warnings
    if (validationStatus?.risk_level === 'high' || validationStatus?.risk_level === 'critical') {
      try {
        await supabase.rpc('log_analytics_event', {
          p_event_type: 'high_risk_assessment_proceeded',
          p_entity_type: 'assessment',
          p_metadata: {
            assessment_type: assessmentType,
            risk_level: validationStatus.risk_level,
            validation_status: validationStatus.validation_status
          }
        });
      } catch (error) {
        console.error('Failed to log analytics event:', error);
      }
    }
  };

  const handleCancelAssessment = () => {
    setShowWarning(false);
    onAccessDenied?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showWarning) {
    return (
      <AssessmentValidationWarning
        assessmentType={assessmentType}
        onProceed={handleProceedWithWarning}
        onCancel={handleCancelAssessment}
      />
    );
  }

  if (accessGranted) {
    return <>{children}</>;
  }

  // Access denied - should redirect or show error
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Assessment Unavailable</h2>
        <p className="text-gray-600">This assessment is currently not available.</p>
      </div>
    </div>
  );
};

export default AssessmentAccessControl;