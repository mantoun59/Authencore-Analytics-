/**
 * Security Compliance Dashboard
 * Tracks implementation status of audit recommendations
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Settings,
  FileText,
  Lock,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityImprovement {
  id: string;
  improvement_type: string;
  description: string;
  status: string; // Allow any string status from database
  metadata: any; // Use any for JSON data from database
  implemented_at: string;
  created_at: string;
}

interface ComplianceStatus {
  total_improvements: number;
  implemented: number;
  pending: number;
  requires_config: number;
  compliance_score: number;
}

const SecurityComplianceDashboard: React.FC = () => {
  const [improvements, setImprovements] = useState<SecurityImprovement[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch improvements
      const { data: improvementsData, error: improvementsError } = await supabase
        .from('security_improvements')
        .select('*')
        .order('implemented_at', { ascending: false });

      if (improvementsError) throw improvementsError;

      // Fetch compliance status
      const { data: statusData, error: statusError } = await supabase
        .rpc('get_security_compliance_status');

      if (statusError) throw statusError;

      setImprovements(improvementsData || []);
      setComplianceStatus(statusData?.[0] || null);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security compliance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'requires_dashboard_config':
        return <Settings className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'implemented': 'default',
      'pending': 'secondary',
      'requires_dashboard_config': 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'destructive'} className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Track implementation of security audit recommendations
          </p>
        </div>
      </div>

      {/* Compliance Overview */}
      {complianceStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Compliance Overview</span>
            </CardTitle>
            <CardDescription>
              Overall security implementation progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Compliance Score</span>
                  <span className="text-2xl font-bold text-primary">
                    {complianceStatus.compliance_score}%
                  </span>
                </div>
                <Progress value={complianceStatus.compliance_score} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {complianceStatus.implemented}
                  </div>
                  <div className="text-sm text-green-700">Implemented</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {complianceStatus.pending}
                  </div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {complianceStatus.requires_config}
                  </div>
                  <div className="text-sm text-blue-700">Config Required</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {complianceStatus.total_improvements}
                  </div>
                  <div className="text-sm text-gray-700">Total Items</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvements List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center space-x-2">
          <FileText className="w-6 h-6" />
          <span>Security Improvements</span>
        </h2>

        {improvements.map((improvement) => (
          <Card key={improvement.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(improvement.status)}
                    <span>{improvement.improvement_type.replace(/_/g, ' ')}</span>
                    <Badge className={getPriorityColor(improvement.metadata?.priority || 'medium')}>
                      {improvement.metadata?.priority || 'medium'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{improvement.description}</CardDescription>
                </div>
                {getStatusBadge(improvement.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {improvement.metadata?.recommendation && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendation:</strong> {improvement.metadata.recommendation}
                    </AlertDescription>
                  </Alert>
                )}

                {improvement.metadata?.features && (
                  <div>
                    <h4 className="font-medium mb-2">Features Implemented:</h4>
                    <div className="flex flex-wrap gap-2">
                      {improvement.metadata.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {improvement.metadata?.components && (
                  <div>
                    <h4 className="font-medium mb-2">Components Enhanced:</h4>
                    <div className="flex flex-wrap gap-2">
                      {improvement.metadata.components.map((component: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {improvement.metadata?.headers && (
                  <div>
                    <h4 className="font-medium mb-2">Security Headers:</h4>
                    <div className="flex flex-wrap gap-2">
                      {improvement.metadata.headers.map((header: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {header}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Implemented: {new Date(improvement.implemented_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Required Actions</span>
          </CardTitle>
          <CardDescription>
            Items requiring manual configuration in Supabase Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>OTP Expiry:</strong> Configure OTP expiration to 5 minutes in Supabase Auth settings
              </AlertDescription>
            </Alert>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Leaked Password Protection:</strong> Enable HaveIBeenPwned integration in Auth settings
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityComplianceDashboard;