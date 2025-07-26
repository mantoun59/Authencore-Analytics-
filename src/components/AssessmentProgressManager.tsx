import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Clock, RotateCcw, Play, Save, Trash2 } from 'lucide-react';
import { useAssessmentProgress } from '@/hooks/useAssessmentProgress';

interface AssessmentProgressManagerProps {
  assessmentType: string;
  assessmentTitle: string;
  onRestore: (progressData: any) => void;
  onStartFresh: () => void;
  children?: React.ReactNode;
}

export const AssessmentProgressManager: React.FC<AssessmentProgressManagerProps> = ({
  assessmentType,
  assessmentTitle,
  onRestore,
  onStartFresh,
  children
}) => {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const {
    savedProgress,
    isRestoring,
    restoreProgress,
    clearProgress,
    checkForSavedProgress
  } = useAssessmentProgress(assessmentType);

  useEffect(() => {
    checkForSavedProgress();
  }, [checkForSavedProgress]);

  useEffect(() => {
    if (savedProgress && !showRestoreDialog) {
      setShowRestoreDialog(true);
    }
  }, [savedProgress, showRestoreDialog]);

  const handleRestore = async () => {
    const progressData = await restoreProgress();
    if (progressData) {
      onRestore(progressData);
    }
    setShowRestoreDialog(false);
  };

  const handleStartFresh = () => {
    onStartFresh();
    setShowRestoreDialog(false);
  };

  const handleClearProgress = async () => {
    await clearProgress();
    setShowClearDialog(false);
    onStartFresh();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else {
      return `${Math.round(diffInHours / 24)} days ago`;
    }
  };

  // Show restore dialog if saved progress exists
  if (savedProgress && showRestoreDialog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Save className="h-12 w-12 mx-auto text-primary mb-2" />
            </div>
            <CardTitle>Resume Assessment?</CardTitle>
            <CardDescription>
              We found your saved progress for {assessmentTitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <Progress value={savedProgress.progress_percentage} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {Math.round(savedProgress.progress_percentage)}% complete
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last saved {formatDate(savedProgress.last_saved_at)}
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleRestore} 
                disabled={isRestoring}
                className="w-full"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Continue Assessment
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleStartFresh}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowClearDialog(true)}
                className="w-full text-destructive hover:text-destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Saved Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Saved Progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your saved assessment progress. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleClearProgress}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Progress
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return <>{children}</>;
};

export default AssessmentProgressManager;