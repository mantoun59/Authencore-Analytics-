import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  completionRate: number;
  requiredFieldsMissing: string[];
  warnings: string[];
  timeSpent: number;
  responseConsistency: number;
}

interface AssessmentValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  validationResult: ValidationResult;
  assessmentTitle: string;
}

const AssessmentValidationModal: React.FC<AssessmentValidationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  validationResult,
  assessmentTitle
}) => {
  const {
    isValid,
    completionRate,
    requiredFieldsMissing,
    warnings,
    timeSpent,
    responseConsistency
  } = validationResult;

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getConsistencyColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConsistencyLabel = (score: number): string => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            Assessment Validation
          </DialogTitle>
          <DialogDescription>
            Please review the validation results for your {assessmentTitle} assessment before submitting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Completion Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{Math.round(completionRate)}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{formatTime(timeSpent)}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className={`text-2xl font-bold ${getConsistencyColor(responseConsistency)}`}>
                {getConsistencyLabel(responseConsistency)}
              </div>
              <div className="text-sm text-muted-foreground">Response Consistency</div>
            </div>
          </div>

          {/* Validation Issues */}
          {!isValid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Assessment cannot be submitted due to the following issues:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {requiredFieldsMissing.map((field, index) => (
                      <li key={index}>Missing required field: {field}</li>
                    ))}
                    {completionRate < 80 && (
                      <li>Completion rate below 80% ({Math.round(completionRate)}%)</li>
                    )}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Please note the following warnings:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Validity Checks */}
          <div className="space-y-3">
            <h4 className="font-medium">Validity Checks</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span>Minimum time threshold</span>
                <div className="flex items-center gap-2">
                  {timeSpent >= 300000 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {timeSpent >= 300000 ? 'Passed' : 'Too fast'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span>Response consistency</span>
                <div className="flex items-center gap-2">
                  {responseConsistency >= 60 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {responseConsistency}% consistent
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span>Complete responses</span>
                <div className="flex items-center gap-2">
                  {completionRate >= 95 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : completionRate >= 80 ? (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {Math.round(completionRate)}% complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Quality Score */}
          {isValid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Assessment Quality Score</span>
              </div>
              <div className="text-green-700">
                Your assessment meets all quality standards and is ready for submission. 
                Results will be reliable and meaningful.
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {isValid ? 'Review Answers' : 'Go Back'}
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={!isValid}
            variant={isValid ? 'default' : 'destructive'}
          >
            {isValid ? 'Submit Assessment' : 'Cannot Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentValidationModal;