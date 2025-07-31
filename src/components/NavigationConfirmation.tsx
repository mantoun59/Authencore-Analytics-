import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save } from 'lucide-react';

interface NavigationConfirmationProps {
  hasUnsavedChanges: boolean;
  onSave?: () => Promise<void>;
  onDiscard?: () => void;
}

const NavigationConfirmation: React.FC<NavigationConfirmationProps> = ({
  hasUnsavedChanges,
  onSave,
  onDiscard
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setShowDialog(true);
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave();
        setShowDialog(false);
      } catch (error) {
        console.error('Error saving:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard();
    }
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Unsaved Changes
          </DialogTitle>
          <DialogDescription>
            You have unsaved changes to your assessment. What would you like to do?
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Save className="h-4 w-4" />
          <AlertDescription>
            Your progress can be saved automatically and restored when you return to continue the assessment.
          </AlertDescription>
        </Alert>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Stay on Page
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDiscard}
          >
            Discard Changes
          </Button>
          {onSave && (
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save & Continue'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationConfirmation;