import React, { useEffect } from 'react';
import { usePartner } from '@/contexts/PartnerContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, ArrowLeft } from 'lucide-react';

interface PartnerAccessControlProps {
  assessmentType: string;
  children: React.ReactNode;
}

export const PartnerAccessControl: React.FC<PartnerAccessControlProps> = ({ 
  assessmentType, 
  children 
}) => {
  const { partner, isAuthenticated, checkAssessmentAccess, logActivity } = usePartner();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && partner) {
      // Log assessment access attempt
      logActivity('access_attempt', assessmentType);
    }
  }, [isAuthenticated, partner, assessmentType, logActivity]);

  // If not authenticated as partner, render normal content (for regular users)
  if (!isAuthenticated || !partner) {
    return <>{children}</>;
  }

  const hasAccess = checkAssessmentAccess(assessmentType);
  const isExpired = new Date(partner.access_expires_at) <= new Date();

  // Partner is authenticated but doesn't have access or is expired
  if (!hasAccess || isExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-destructive/10">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-xl">Access Restricted</CardTitle>
            <CardDescription>
              {isExpired 
                ? 'Your partner access has expired'
                : 'You do not have permission to access this assessment'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Organization:</span>
                <span className="text-sm">{partner.organization_name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Username:</span>
                <span className="text-sm">{partner.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={isExpired ? "destructive" : "secondary"}>
                  {isExpired ? 'Expired' : 'Active'}
                </Badge>
              </div>
              {isExpired && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Expired on {new Date(partner.access_expires_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {isExpired 
                  ? 'Please contact your account manager to renew access.'
                  : 'Contact your account manager to request access to this assessment.'
                }
              </p>
              
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/partner-dashboard')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Partner has access - log successful access and render content
  logActivity('access_assessment', assessmentType);
  return <>{children}</>;
};