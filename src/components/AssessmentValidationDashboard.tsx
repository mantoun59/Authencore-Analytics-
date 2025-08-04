/**
 * Assessment Validation Dashboard Component
 * Provides interface for conducting and monitoring psychometric validation studies
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, Clock, Users, Brain, Shield } from 'lucide-react';
import { psychometricValidationService } from '@/services/psychometricValidationService';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionConfig';

interface ValidationStatus {
  assessmentType: string;
  cronbachAlpha: number | null;
  testRetestReliability: number | null;
  constructValidity: number | null;
  normativeSampleSize: number;
  validationStatus: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  lastUpdated: string;
  criticalIssues: string[];
}

export const AssessmentValidationDashboard: React.FC = () => {
  const [validationStatuses, setValidationStatuses] = useState<ValidationStatus[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const assessmentTypes = [
    'career_launch', 'communication_styles', 'cultural_intelligence',
    'emotional_intelligence', 'leadership', 'digital_wellness',
    'faith_values', 'stress_resilience', 'genz_workplace', 'burnout_prevention'
  ];

  useEffect(() => {
    loadValidationStatuses();
  }, []);

  const loadValidationStatuses = async () => {
    setLoading(true);
    try {
      const statuses = await Promise.all(
        assessmentTypes.map(async (type) => {
          // Get existing validation data
          const { data: assessmentResults } = await supabase
            .from('assessment_results')
            .select('results, completed_at')
            .eq('assessment_type', type)
            .limit(1000);

          // Get normative data
          const { data: normativeData } = await supabase
            .from('normative_databases')
            .select('sample_size')
            .eq('assessment_type', type);

          const sampleSize = assessmentResults?.length || 0;
          const normativeSampleSize = normativeData?.reduce((sum, n) => sum + n.sample_size, 0) || 0;

          // Determine validation status
          let status: ValidationStatus['validationStatus'] = 'not_started';
          const criticalIssues: string[] = [];

          if (sampleSize < 100) {
            criticalIssues.push('Insufficient sample size for validation (minimum 100 required)');
          }
          if (normativeSampleSize < 500) {
            criticalIssues.push('Insufficient normative sample (minimum 500 required)');
          }
          if (sampleSize >= 100 && normativeSampleSize >= 500) {
            status = 'needs_review';
          }

          return {
            assessmentType: type,
            cronbachAlpha: null, // Would be calculated from actual validation
            testRetestReliability: null,
            constructValidity: null,
            normativeSampleSize,
            validationStatus: status,
            lastUpdated: new Date().toISOString(),
            criticalIssues
          };
        })
      );

      setValidationStatuses(statuses);
    } catch (error) {
      productionLogger.error('Error loading validation statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateValidationStudy = async (assessmentType: string) => {
    try {
      // Get assessment response data
      const { data: responses } = await supabase
        .from('assessment_results')
        .select('results, user_id')
        .eq('assessment_type', assessmentType);

      if (!responses || responses.length < 100) {
        alert('Insufficient data for validation study (minimum 100 responses required)');
        return;
      }

      // Convert responses to numerical arrays for analysis
      const responseArrays = responses.map(r => {
        const results = r.results as any;
        // Extract numerical responses (this would need to be customized per assessment)
        return Object.values(results.responses || {}).filter(v => typeof v === 'number') as number[];
      }).filter(arr => arr.length > 0);

      if (responseArrays.length === 0) {
        alert('No valid numerical responses found for analysis');
        return;
      }

      // Perform reliability analysis
      const reliabilityAnalysis = await psychometricValidationService.performReliabilityAnalysis(
        assessmentType,
        responseArrays
      );

      if (import.meta.env.DEV) console.log('Reliability Analysis Results:', reliabilityAnalysis);

      // Generate validation report
      const validationReport = await psychometricValidationService.generateValidationReport(assessmentType);
      
      // Store results
      await psychometricValidationService.storeValidationResults(validationReport);

      alert(`Validation study completed for ${assessmentType}. Cronbach's Alpha: ${reliabilityAnalysis.cronbachAlpha.toFixed(3)}`);
      
      // Reload statuses
      loadValidationStatuses();
    } catch (error) {
      productionLogger.error('Error initiating validation study:', error);
      alert('Error initiating validation study. Please check console for details.');
    }
  };

  const getStatusColor = (status: ValidationStatus['validationStatus']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'needs_review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ValidationStatus['validationStatus']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'needs_review': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatAssessmentName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessment Validation Dashboard</h1>
        <Badge variant="destructive" className="text-sm">
          CRITICAL: Validation Required
        </Badge>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Professional Standards Compliance Required:</strong> All assessments must undergo 
          psychometric validation to meet APA/ITC professional standards. Current status shows 
          critical compliance gaps that must be addressed immediately.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reliability">Reliability</TabsTrigger>
          <TabsTrigger value="validity">Validity</TabsTrigger>
          <TabsTrigger value="normative">Normative Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {validationStatuses.map((status) => (
              <Card key={status.assessmentType} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {formatAssessmentName(status.assessmentType)}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${getStatusColor(status.validationStatus)}`}>
                      {getStatusIcon(status.validationStatus)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sample Size:</span>
                    <span className={status.normativeSampleSize < 500 ? 'text-red-600' : 'text-green-600'}>
                      {status.normativeSampleSize}
                    </span>
                  </div>
                  
                  {status.cronbachAlpha && (
                    <div className="flex justify-between text-sm">
                      <span>Reliability (α):</span>
                      <span className={status.cronbachAlpha < 0.7 ? 'text-red-600' : 'text-green-600'}>
                        {status.cronbachAlpha.toFixed(3)}
                      </span>
                    </div>
                  )}

                  {status.criticalIssues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-red-600">Critical Issues:</h4>
                      {status.criticalIssues.map((issue, idx) => (
                        <p key={idx} className="text-xs text-red-600">{issue}</p>
                      ))}
                    </div>
                  )}

                  <Button 
                    onClick={() => initiateValidationStudy(status.assessmentType)}
                    className="w-full"
                    variant={status.validationStatus === 'not_started' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {status.validationStatus === 'not_started' ? 'Start Validation' : 'Re-run Analysis'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reliability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Reliability Analysis Standards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Required Standards:</strong>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Cronbach's Alpha ≥ 0.70 (research) or ≥ 0.80 (clinical)</li>
                    <li>• Test-retest reliability ≥ 0.70 over 2-4 week interval</li>
                    <li>• Item-total correlations ≥ 0.30</li>
                    <li>• Average inter-item correlation: 0.15-0.50</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validationStatuses.filter(s => s.cronbachAlpha).map((status) => (
                  <Card key={status.assessmentType}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {formatAssessmentName(status.assessmentType)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cronbach's Alpha:</span>
                          <span className={status.cronbachAlpha! < 0.7 ? 'text-red-600' : 'text-green-600'}>
                            {status.cronbachAlpha?.toFixed(3)}
                          </span>
                        </div>
                        <Progress 
                          value={(status.cronbachAlpha || 0) * 100} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validity Studies Required</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  <strong>Missing Validity Evidence:</strong> No construct, criterion, or content 
                  validity studies have been conducted. This is a critical professional standards violation.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Initiate Content Validity Study (Expert Panel Review)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Conduct Factor Analysis (Construct Validity)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Criterion Validity Study (External Measures)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="normative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Normative Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {validationStatuses.map((status) => (
                  <div key={status.assessmentType} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">
                      {formatAssessmentName(status.assessmentType)}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Sample:</span>
                        <span className={status.normativeSampleSize < 500 ? 'text-red-600' : 'text-green-600'}>
                          {status.normativeSampleSize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Required:</span>
                        <span>500+</span>
                      </div>
                      <Progress 
                        value={Math.min((status.normativeSampleSize / 500) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};