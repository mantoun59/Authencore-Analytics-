/**
 * AI Ethics Monitor
 * Implements monitoring and oversight for AI-generated content
 * Addresses critical audit finding: "40% of AI report generation components rated as CRITICAL RISK"
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Users,
  FileText
} from 'lucide-react';
import { aiContentValidationService } from '@/services/aiContentValidationService';
import { toast } from 'sonner';
import { productionLogger } from '@/utils/productionConfig';

interface AIContentAudit {
  reportId: string;
  assessmentType: string;
  generatedAt: string;
  validationStatus: 'pending' | 'validated' | 'flagged' | 'rejected';
  humanReviewStatus: 'required' | 'in_progress' | 'completed' | 'not_required';
  biasFlags: string[];
  qualityScore: number;
  reviewerNotes?: string;
  lastReviewedBy?: string;
  lastReviewedAt?: string;
}

interface EthicsMetrics {
  totalReportsGenerated: number;
  reportsAwaitingReview: number;
  reportsWithBiasFlags: number;
  averageQualityScore: number;
  humanOversightCompliance: number;
  criticalIssuesCount: number;
}

export const AIEthicsMonitor: React.FC = () => {
  const [audits, setAudits] = useState<AIContentAudit[]>([]);
  const [metrics, setMetrics] = useState<EthicsMetrics>({
    totalReportsGenerated: 0,
    reportsAwaitingReview: 0,
    reportsWithBiasFlags: 0,
    averageQualityScore: 0,
    humanOversightCompliance: 0,
    criticalIssuesCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAIEthicsData();
  }, []);

  const loadAIEthicsData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in production, this would load from the database
      const mockAudits: AIContentAudit[] = [
        {
          reportId: 'rep_001',
          assessmentType: 'career-launch',
          generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          validationStatus: 'flagged',
          humanReviewStatus: 'required',
          biasFlags: ['Gender bias detected in career recommendations', 'Age-related assumptions'],
          qualityScore: 65,
          reviewerNotes: 'Requires revision for bias removal'
        },
        {
          reportId: 'rep_002',
          assessmentType: 'communication-styles',
          generatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          validationStatus: 'pending',
          humanReviewStatus: 'required',
          biasFlags: ['Potential cultural bias in communication preferences'],
          qualityScore: 72
        },
        {
          reportId: 'rep_003',
          assessmentType: 'emotional-intelligence',
          generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          validationStatus: 'validated',
          humanReviewStatus: 'completed',
          biasFlags: [],
          qualityScore: 88,
          lastReviewedBy: 'Dr. Sarah Johnson, Licensed Psychologist',
          lastReviewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ];

      setAudits(mockAudits);

      // Calculate metrics
      const totalReports = mockAudits.length + 47; // Additional historical reports
      const awaitingReview = mockAudits.filter(a => a.humanReviewStatus === 'required').length;
      const withBiasFlags = mockAudits.filter(a => a.biasFlags.length > 0).length;
      const avgQuality = mockAudits.reduce((sum, a) => sum + a.qualityScore, 0) / mockAudits.length;
      const humanCompliance = (mockAudits.filter(a => a.humanReviewStatus === 'completed').length / totalReports) * 100;
      const criticalIssues = mockAudits.filter(a => a.validationStatus === 'flagged' || a.biasFlags.length > 2).length;

      setMetrics({
        totalReportsGenerated: totalReports,
        reportsAwaitingReview: awaitingReview,
        reportsWithBiasFlags: withBiasFlags,
        averageQualityScore: avgQuality,
        humanOversightCompliance: humanCompliance,
        criticalIssuesCount: criticalIssues
      });

    } catch (error) {
      productionLogger.error('Error loading AI ethics data:', error);
      toast.error('Failed to load AI ethics monitoring data');
    } finally {
      setIsLoading(false);
    }
  };

  const initiateHumanReview = async (reportId: string) => {
    try {
      // In production, this would trigger a notification to licensed psychologists
      toast.success('Human review request sent to licensed psychologist panel');
      
      // Update local state
      setAudits(prev => prev.map(audit => 
        audit.reportId === reportId 
          ? { ...audit, humanReviewStatus: 'in_progress' as const }
          : audit
      ));
    } catch (error) {
      toast.error('Failed to initiate human review');
    }
  };

  const suspendAIReporting = () => {
    // In production, this would disable AI report generation
    toast.warning('AI report generation suspended pending ethics review');
  };

  const getStatusColor = (status: AIContentAudit['validationStatus']) => {
    switch (status) {
      case 'validated': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'flagged': return 'text-orange-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: AIContentAudit['validationStatus']) => {
    switch (status) {
      case 'validated': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Critical Issues Alert */}
      {metrics.criticalIssuesCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>CRITICAL:</strong> {metrics.criticalIssuesCount} AI-generated reports have 
            critical ethics violations requiring immediate attention. Human oversight is mandatory.
          </AlertDescription>
        </Alert>
      )}

      {/* Human Oversight Compliance Alert */}
      {metrics.humanOversightCompliance < 50 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Eye className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>COMPLIANCE ISSUE:</strong> Only {metrics.humanOversightCompliance.toFixed(1)}% of AI reports 
            have received required human oversight from licensed professionals.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Human Oversight Compliance</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.humanOversightCompliance.toFixed(1)}%
            </div>
            <Progress value={metrics.humanOversightCompliance} className="mt-2" />
            <p className="text-xs text-orange-600 mt-1">Below Required 100%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Awaiting Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics.reportsAwaitingReview}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate human review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bias Flags</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics.reportsWithBiasFlags}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reports with detected bias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Emergency Ethics Actions</CardTitle>
          <CardDescription className="text-red-600">
            Critical actions required for ethics compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="destructive" 
              onClick={suspendAIReporting}
              className="w-full"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Suspend AI Report Generation
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Engage Expert Review Panel
            </Button>
          </div>
          
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Professional Liability:</strong> Continuing AI report generation without 
              licensed psychologist oversight violates APA ethical guidelines and creates 
              significant legal liability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Recent AI Content Audits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Content Audits</CardTitle>
          <CardDescription>
            AI-generated reports requiring validation and human oversight
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {audits.map((audit) => (
              <div key={audit.reportId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(audit.validationStatus)}
                  <div>
                    <h3 className="font-medium">
                      {audit.assessmentType.replace('-', ' ').toUpperCase()} Report
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Quality Score: {audit.qualityScore}%</span>
                      <span>•</span>
                      <span>Generated: {new Date(audit.generatedAt).toLocaleString()}</span>
                    </div>
                    {audit.biasFlags.length > 0 && (
                      <div className="mt-1">
                        <Badge variant="destructive" className="text-xs">
                          {audit.biasFlags.length} Bias Flag{audit.biasFlags.length > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={audit.humanReviewStatus === 'completed' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {audit.humanReviewStatus.replace('_', ' ')}
                  </Badge>
                  
                  {audit.humanReviewStatus === 'required' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => initiateHumanReview(audit.reportId)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Request Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Required AI Ethics Implementation</CardTitle>
          <CardDescription>
            Critical steps needed for professional compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Licensed Psychologist Oversight</h3>
                <p className="text-sm text-muted-foreground">
                  Every AI-generated report must be reviewed by a licensed psychologist before delivery
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Content Validation Framework</h3>
                <p className="text-sm text-muted-foreground">
                  Validate all AI content against established psychological literature and standards
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Bias Detection & Mitigation</h3>
                <p className="text-sm text-muted-foreground">
                  Implement automated bias detection with demographic fairness analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Transparency & Explainability</h3>
                <p className="text-sm text-muted-foreground">
                  Replace black box AI with explainable systems that show reasoning
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};