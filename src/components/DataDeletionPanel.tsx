import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Trash2, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle,
  Shield,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeletionRequest {
  request_id: string;
  status: string;
  requested_at: string;
  processed_at?: string;
}

const DataDeletionPanel = () => {
  const { user, requestDataDeletion, deleteUserData } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null);
  const [reason, setReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (user) {
      checkDeletionStatus();
    }
  }, [user]);

  const checkDeletionStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('get_deletion_request_status');
      
      if (error) {
        console.error('Error checking deletion status:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setDeletionRequest(data[0]);
      }
    } catch (error) {
      console.error('Error checking deletion status:', error);
    }
  };

  const handleRequestDeletion = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for data deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await requestDataDeletion(reason);
    
    if (!error) {
      toast({
        title: "Deletion Request Submitted",
        description: "Your data deletion request has been submitted successfully.",
      });
      await checkDeletionStatus();
      setReason('');
    }
    setIsLoading(false);
  };

  const handleImmediateDeletion = async () => {
    if (confirmationText !== 'DELETE MY DATA') {
      toast({
        title: "Confirmation Required",
        description: "Please type 'DELETE MY DATA' to confirm.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await deleteUserData();
    
    if (!error) {
      toast({
        title: "Data Deleted",
        description: "Your data has been permanently deleted.",
      });
    }
    setIsLoading(false);
    setShowConfirmDialog(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Deletion Request Status */}
      {deletionRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Data Deletion Request Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(deletionRequest.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Requested:</span>
                <span>{new Date(deletionRequest.requested_at).toLocaleDateString()}</span>
              </div>
              {deletionRequest.processed_at && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Processed:</span>
                  <span>{new Date(deletionRequest.processed_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {deletionRequest.status === 'pending' && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your deletion request is being processed. This typically takes up to 30 days as required by GDPR.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* GDPR Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
          <CardDescription>
            Under GDPR and other privacy laws, you have the right to control your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Data Export</h4>
                <p className="text-sm text-muted-foreground">Download all your assessment results and reports</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Data Deletion</h4>
                <p className="text-sm text-muted-foreground">Permanently remove all your personal data from our systems</p>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>What gets deleted:</strong> All assessment results, reports, progress data, profile information, and any other personal data associated with your account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Request Data Deletion */}
      {!deletionRequest || deletionRequest.status === 'rejected' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Request Data Deletion
            </CardTitle>
            <CardDescription>
              Submit a formal request to delete your personal data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deletion-reason">Reason for deletion (optional)</Label>
              <Textarea
                id="deletion-reason"
                placeholder="Please tell us why you want to delete your data..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Processing Time:</strong> Deletion requests are typically processed within 30 days as required by law.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleRequestDeletion}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? 'Submitting Request...' : 'Submit Deletion Request'}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Separator />

      {/* Immediate Deletion */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Immediate Data Deletion
          </CardTitle>
          <CardDescription>
            Delete your data immediately without waiting for the formal process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>WARNING:</strong> This action cannot be undone. All your assessment data, results, and account information will be permanently deleted immediately.
            </AlertDescription>
          </Alert>

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full mt-4"
                disabled={deletionRequest?.status === 'pending'}
              >
                Delete My Data Immediately
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Confirm Data Deletion
                </DialogTitle>
                <DialogDescription className="space-y-2">
                  <p>This will permanently delete:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>All assessment results and reports</li>
                    <li>Progress data and saved responses</li>
                    <li>Profile information and preferences</li>
                    <li>Your account and authentication data</li>
                  </ul>
                  <p className="font-medium text-red-600 mt-4">
                    This action cannot be undone.
                  </p>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmation">
                    Type <strong>DELETE MY DATA</strong> to confirm:
                  </Label>
                  <input
                    id="confirmation"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="DELETE MY DATA"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setConfirmationText('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleImmediateDeletion}
                  disabled={isLoading || confirmationText !== 'DELETE MY DATA'}
                >
                  {isLoading ? 'Deleting...' : 'Delete My Data'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataDeletionPanel;