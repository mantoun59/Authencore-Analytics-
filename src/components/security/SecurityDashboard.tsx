import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useSecurity } from '@/hooks/useSecurity';
import { toast } from '@/hooks/use-toast';

const SecurityDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { securityEvents, activeSessions, isLoading } = useSecurity();
  const [securityScore, setSecurityScore] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      performSecurityScan();
    }
  }, [isAdmin, adminLoading]);

  const performSecurityScan = async () => {
    setIsScanning(true);
    try {
      // Calculate security score based on various factors
      let score = 100;
      const issues: any[] = [];

      // Check for recent security events
      const recentEvents = securityEvents?.filter(event => 
        new Date(event.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ) || [];

      const failedLogins = recentEvents.filter(event => 
        event.event_type.includes('failed') || event.event_type.includes('suspicious')
      );

      if (failedLogins.length > 10) {
        score -= 20;
        issues.push({
          type: 'high',
          title: 'High Failed Login Attempts',
          description: `${failedLogins.length} failed login attempts in the last 24 hours`,
          recommendation: 'Implement stricter rate limiting and consider IP blocking'
        });
      }

      // Check for active sessions
      const sessionCount = activeSessions?.length || 0;
      if (sessionCount > 50) {
        score -= 10;
        issues.push({
          type: 'medium',
          title: 'High Active Session Count',
          description: `${sessionCount} active sessions detected`,
          recommendation: 'Monitor for unusual session patterns'
        });
      }

      // Check for recent admin access
      const adminEvents = recentEvents.filter(event => 
        event.event_type.includes('admin')
      );

      if (adminEvents.length === 0) {
        issues.push({
          type: 'info',
          title: 'No Recent Admin Activity',
          description: 'No admin security events logged recently',
          recommendation: 'Regular admin monitoring is recommended'
        });
      }

      setSecurityScore(Math.max(0, score));
      setVulnerabilities(issues);

      toast({
        title: "Security Scan Complete",
        description: `Security score: ${Math.max(0, score)}/100`,
      });
    } catch (error) {
      console.error('Security scan failed:', error);
      toast({
        title: "Security Scan Failed",
        description: "Unable to complete security assessment",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'high':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need administrator privileges to access the security dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || adminLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading security dashboard...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage application security</p>
        </div>
        <Button 
          onClick={performSecurityScan} 
          disabled={isScanning}
          variant="outline"
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Run Security Scan
            </>
          )}
        </Button>
      </div>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Overall Security Score
          </CardTitle>
          <CardDescription>
            Current security posture assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}/100
            </div>
            <Badge variant={getScoreBadgeVariant(securityScore)}>
              {securityScore >= 90 ? 'Excellent' : 
               securityScore >= 70 ? 'Good' : 'Needs Attention'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Issues */}
      {vulnerabilities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Issues</CardTitle>
            <CardDescription>
              Identified vulnerabilities and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vulnerabilities.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                  {getSeverityIcon(issue.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {issue.description}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security-related activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityEvents && securityEvents.length > 0 ? (
            <div className="space-y-2">
              {securityEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <span className="font-medium">{event.event_type}</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent security events found.</p>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active User Sessions</CardTitle>
          <CardDescription>
            Currently active user sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeSessions && activeSessions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Total active sessions: {activeSessions.length}
              </p>
              {activeSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <span className="font-medium">User Session</span>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(session.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No active sessions found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;