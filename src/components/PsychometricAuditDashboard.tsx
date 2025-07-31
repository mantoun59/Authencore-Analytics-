/**
 * Psychometric Audit Dashboard
 * Administrative interface for managing assessment validation based on audit findings
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  TrendingUp,
  Shield,
  BookOpen,
  Users,
  Gavel,
  AlertOctagon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ValidationStatus {
  id: string;
  assessment_type: string;
  validation_status: string;
  risk_level: string;
  theoretical_foundation: string;
  psychometric_rating: number;
  ethical_concerns: string[];
  notes: string;
  last_reviewed_at: string;
}

interface AuditSummary {
  total_assessments: number;
  validated: number;
  under_review: number;
  disabled: number;
  critical_risk: number;
  high_risk: number;
  average_rating: number;
}

export const PsychometricAuditDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<ValidationStatus[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    try {
      // Load all assessment validation statuses
      const { data: validationData } = await supabase
        .from('assessment_validation_status')
        .select('*')
        .order('psychometric_rating', { ascending: false });

      if (validationData) {
        setAssessments(validationData);
        
        // Calculate summary statistics
        const summary: AuditSummary = {
          total_assessments: validationData.length,
          validated: validationData.filter(a => a.validation_status === 'validated').length,
          under_review: validationData.filter(a => a.validation_status === 'under_review').length,
          disabled: validationData.filter(a => a.validation_status === 'disabled').length,
          critical_risk: validationData.filter(a => a.risk_level === 'critical').length,
          high_risk: validationData.filter(a => a.risk_level === 'high').length,
          average_rating: validationData.reduce((sum, a) => sum + (a.psychometric_rating || 0), 0) / validationData.length
        };
        
        setSummary(summary);
      }
    } catch (error) {
      console.error('Error loading audit data:', error);
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

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    if (rating >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatAssessmentName = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Psychometric Audit Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Assessment validation status based on comprehensive psychometric audit findings
          </p>
        </div>
        <Badge variant="destructive" className="text-sm">
          AUDIT REQUIRED
        </Badge>
      </div>

      {/* Critical Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertOctagon className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Critical Action Required:</strong> Independent psychometric audit revealed significant 
          validation gaps. Three assessments have been disabled for ethical/legal concerns. 
          Professional oversight required for continued operation.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                  <p className="text-2xl font-bold">{summary.total_assessments}</p>
                </div>
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Validated</p>
                  <p className="text-2xl font-bold text-green-600">{summary.validated}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">{summary.critical_risk + summary.high_risk}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className={`text-2xl font-bold ${getRatingColor(summary.average_rating)}`}>
                    {summary.average_rating.toFixed(1)}/10
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validated">Validated</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
          <TabsTrigger value="disabled">Disabled</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="border-l-4 border-l-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(assessment.validation_status)}
                      <h3 className="text-lg font-semibold">
                        {formatAssessmentName(assessment.assessment_type)}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(assessment.risk_level)}>
                        {assessment.risk_level.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {assessment.psychometric_rating}/10
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Theoretical Foundation</h4>
                      <p className="text-sm text-gray-600">{assessment.theoretical_foundation}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Audit Notes</h4>
                      <p className="text-sm text-gray-600">{assessment.notes}</p>
                    </div>
                  </div>

                  {assessment.ethical_concerns.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">Ethical Concerns</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {assessment.ethical_concerns.map((concern, index) => (
                          <li key={index} className="text-sm text-red-700">{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="validated" className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              These assessments have strong scientific foundations and are approved for use with appropriate professional oversight.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            {assessments.filter(a => a.validation_status === 'validated').map((assessment) => (
              <Card key={assessment.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        {formatAssessmentName(assessment.assessment_type)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{assessment.theoretical_foundation}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {assessment.psychometric_rating}/10
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              These assessments require additional validation or have moderate concerns that need addressing.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            {assessments.filter(a => a.validation_status === 'under_review').map((assessment) => (
              <Card key={assessment.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-yellow-800">
                      {formatAssessmentName(assessment.assessment_type)}
                    </h3>
                    <Badge className={getRiskColor(assessment.risk_level)}>
                      {assessment.risk_level.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{assessment.notes}</p>
                  
                  {assessment.ethical_concerns.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Areas for Improvement</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {assessment.ethical_concerns.map((concern, index) => (
                          <li key={index} className="text-sm text-yellow-700">{concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disabled" className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>These assessments have been disabled</strong> due to critical psychometric or ethical concerns. 
              They require substantial redesign before they can be safely used.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4">
            {assessments.filter(a => a.validation_status === 'disabled').map((assessment) => (
              <Card key={assessment.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-red-800">
                      {formatAssessmentName(assessment.assessment_type)}
                    </h3>
                    <Badge className="bg-red-100 text-red-800">
                      DISABLED
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{assessment.notes}</p>
                  
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Critical Issues</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {assessment.ethical_concerns.map((concern, index) => (
                        <li key={index} className="text-sm text-red-700">{concern}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-800">Immediate (1 week):</span>
              <span className="text-blue-700">
                Engage qualified psychometrician for comprehensive validation review
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-800">Short-term (1 month):</span>
              <span className="text-blue-700">
                Conduct reliability studies for all assessments under review
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-blue-800">Long-term (3 months):</span>
              <span className="text-blue-700">
                Establish normative databases and predictive validity studies
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychometricAuditDashboard;