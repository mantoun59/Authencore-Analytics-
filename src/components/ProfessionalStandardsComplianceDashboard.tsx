/**
 * Professional Standards Compliance Dashboard
 * Addresses critical audit findings and implements professional psychometric standards
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain, 
  Scale, 
  Users,
  FileText,
  Eye,
  TrendingUp,
  Settings
} from 'lucide-react';
import { psychometricValidationService } from '@/services/psychometricValidationService';
import { biasDetectionService } from '@/services/biasDetectionService';
import { aiContentValidationService } from '@/services/aiContentValidationService';
import { toast } from 'sonner';

interface AssessmentValidationStatus {
  assessmentType: string;
  overallScore: number;
  reliability: number;
  validity: number;
  biasRisk: 'low' | 'medium' | 'high' | 'critical';
  professionalCompliance: boolean;
  lastValidated: string;
  criticalIssues: string[];
  status: 'validated' | 'under_review' | 'requires_attention' | 'disabled';
}

interface ComplianceMetrics {
  overallCompliance: number;
  psychometricStandards: number;
  biasPreventionScore: number;
  aiEthicsScore: number;
  professionalStandards: number;
  criticalIssuesCount: number;
  humanOversightImplemented: boolean;
}

const ASSESSMENT_TYPES = [
  'career-launch',
  'communication-styles', 
  'cultural-intelligence',
  'emotional-intelligence',
  'leadership',
  'digital-wellness',
  'faith-values',
  'stress-resilience',
  'genz-workplace',
  'burnout-prevention'
];

export const ProfessionalStandardsComplianceDashboard: React.FC = () => {
  const [validationStatuses, setValidationStatuses] = useState<AssessmentValidationStatus[]>([]);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics>({
    overallCompliance: 0,
    psychometricStandards: 0,
    biasPreventionScore: 0,
    aiEthicsScore: 0,
    professionalStandards: 0,
    criticalIssuesCount: 0,
    humanOversightImplemented: false
  });
  const [isValidating, setIsValidating] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  useEffect(() => {
    loadValidationData();
  }, []);

  const loadValidationData = async () => {
    try {
      // Load current validation statuses
      const statuses = await Promise.all(
        ASSESSMENT_TYPES.map(async (type) => {
          const validationReport = await psychometricValidationService.generateValidationReport(type);
          const biasAnalysis = await biasDetectionService.analyzeAssessmentBias(type);
          
          return {
            assessmentType: type,
            overallScore: validationReport.overallValidityScore * 100,
            reliability: validationReport.reliabilityScore * 100,
            validity: validationReport.validityScore * 100,
            biasRisk: biasAnalysis.biasSeverity,
            professionalCompliance: validationReport.passesStandards,
            lastValidated: new Date().toISOString(),
            criticalIssues: validationReport.criticalIssues,
            status: getComplianceStatus(validationReport, biasAnalysis)
          };
        })
      );
      
      setValidationStatuses(statuses);
      
      // Calculate overall compliance metrics
      const metrics = calculateComplianceMetrics(statuses);
      setComplianceMetrics(metrics);
      
    } catch (error) {
      console.error('Error loading validation data:', error);
      toast.error('Failed to load compliance data');
    }
  };

  const getComplianceStatus = (validationReport: any, biasAnalysis: any): AssessmentValidationStatus['status'] => {
    if (biasAnalysis.biasSeverity === 'critical' || validationReport.overallValidityScore < 0.6) {
      return 'disabled';
    }
    if (biasAnalysis.biasSeverity === 'high' || validationReport.criticalIssues.length > 0) {
      return 'requires_attention';
    }
    if (validationReport.passesStandards && biasAnalysis.biasSeverity === 'low') {
      return 'validated';
    }
    return 'under_review';
  };

  const calculateComplianceMetrics = (statuses: AssessmentValidationStatus[]): ComplianceMetrics => {
    const totalAssessments = statuses.length;
    const validatedCount = statuses.filter(s => s.status === 'validated').length;
    const criticalIssuesCount = statuses.reduce((sum, s) => sum + s.criticalIssues.length, 0);
    const avgReliability = statuses.reduce((sum, s) => sum + s.reliability, 0) / totalAssessments;
    const avgValidity = statuses.reduce((sum, s) => sum + s.validity, 0) / totalAssessments;
    const lowBiasCount = statuses.filter(s => s.biasRisk === 'low').length;
    
    return {
      overallCompliance: (validatedCount / totalAssessments) * 100,
      psychometricStandards: Math.min(avgReliability, avgValidity),
      biasPreventionScore: (lowBiasCount / totalAssessments) * 100,
      aiEthicsScore: 65, // Needs improvement based on audit
      professionalStandards: (validatedCount / totalAssessments) * 100,
      criticalIssuesCount,
      humanOversightImplemented: false // To be implemented
    };
  };

  const runComprehensiveValidation = async (assessmentType?: string) => {
    setIsValidating(true);
    try {
      const assessmentsToValidate = assessmentType ? [assessmentType] : ASSESSMENT_TYPES;
      
      for (const type of assessmentsToValidate) {
        // Run psychometric validation
        await psychometricValidationService.generateValidationReport(type);
        
        // Run bias analysis
        await biasDetectionService.analyzeAssessmentBias(type);
        
        // Validate AI content (if applicable)
        // This would validate any AI-generated content for this assessment
        console.log(`Validated ${type} assessment`);
      }
      
      await loadValidationData();
      toast.success('Validation completed successfully');
      
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusColor = (status: AssessmentValidationStatus['status']) => {
    switch (status) {
      case 'validated': return 'bg-green-500';
      case 'under_review': return 'bg-yellow-500';
      case 'requires_attention': return 'bg-orange-500';
      case 'disabled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBiasRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Professional Standards Compliance</h1>
          <p className="text-muted-foreground">
            Psychometric validation, bias prevention, and AI ethics monitoring
          </p>
        </div>
        <Button 
          onClick={() => runComprehensiveValidation()} 
          disabled={isValidating}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          {isValidating ? 'Validating...' : 'Run Full Validation'}
        </Button>
      </div>

      {/* Critical Issues Alert */}
      {complianceMetrics.criticalIssuesCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>CRITICAL:</strong> {complianceMetrics.criticalIssuesCount} assessments have 
            critical compliance issues requiring immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceMetrics.overallCompliance.toFixed(1)}%
            </div>
            <Progress value={complianceMetrics.overallCompliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Psychometric Standards</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceMetrics.psychometricStandards.toFixed(1)}%
            </div>
            <Progress value={complianceMetrics.psychometricStandards} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bias Prevention</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceMetrics.biasPreventionScore.toFixed(1)}%
            </div>
            <Progress value={complianceMetrics.biasPreventionScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Ethics Score</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {complianceMetrics.aiEthicsScore.toFixed(1)}%
            </div>
            <Progress value={complianceMetrics.aiEthicsScore} className="mt-2" />
            <p className="text-xs text-orange-600 mt-1">Requires Improvement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assessments">Assessment Validation</TabsTrigger>
          <TabsTrigger value="bias">Bias Monitoring</TabsTrigger>
          <TabsTrigger value="ai-ethics">AI Ethics</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Validation Status</CardTitle>
              <CardDescription>
                Psychometric validity, reliability, and professional standards compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationStatuses.map((status) => (
                  <div key={status.assessmentType} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`} />
                      <div>
                        <h3 className="font-medium capitalize">
                          {status.assessmentType.replace('-', ' ')}
                        </h3>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>Reliability: {status.reliability.toFixed(1)}%</span>
                          <span>Validity: {status.validity.toFixed(1)}%</span>
                          <span className={getBiasRiskColor(status.biasRisk)}>
                            Bias Risk: {status.biasRisk}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={status.professionalCompliance ? 'default' : 'destructive'}>
                        {status.professionalCompliance ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => runComprehensiveValidation(status.assessmentType)}
                        disabled={isValidating}
                      >
                        Validate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bias Detection & Fairness Analysis</CardTitle>
              <CardDescription>
                Monitoring for demographic bias and ensuring fairness across all groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Action Required:</strong> Implement differential item functioning (DIF) analysis 
                    and collect diverse normative data to meet professional standards.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Gender Bias Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      No systematic analysis implemented
                    </p>
                    <Badge variant="destructive" className="mt-2">Missing</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Cultural Bias Detection</h3>
                    <p className="text-sm text-muted-foreground">
                      Cross-cultural validation required
                    </p>
                    <Badge variant="destructive" className="mt-2">Missing</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Adverse Impact Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      80% rule compliance not verified
                    </p>
                    <Badge variant="destructive" className="mt-2">Missing</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-ethics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Ethics & Transparency</CardTitle>
              <CardDescription>
                Ensuring responsible AI use in assessment reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>CRITICAL:</strong> AI report generation lacks professional validation and human oversight.
                    This violates APA ethical guidelines for psychological assessment.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Human Oversight
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      No licensed psychologist review of AI-generated content
                    </p>
                    <Badge variant="destructive">Not Implemented</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Content Validation
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      AI reports not validated against psychological literature
                    </p>
                    <Badge variant="destructive">Not Implemented</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Transparency
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Black box AI with no explainability features
                    </p>
                    <Badge variant="destructive">Not Implemented</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Bias Mitigation
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      No bias testing of AI outputs across demographics
                    </p>
                    <Badge variant="destructive">Not Implemented</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Documentation Requirements</CardTitle>
              <CardDescription>
                Missing documentation required for professional standards compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Scoring Algorithm Documentation</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Mathematical formulas</li>
                      <li>• Weighting systems</li>
                      <li>• Normative data sources</li>
                      <li>• Validation studies</li>
                    </ul>
                    <Badge variant="destructive" className="mt-2">0% Complete</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Reliability Evidence</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cronbach's Alpha (≥0.70)</li>
                      <li>• Test-retest reliability (≥0.80)</li>
                      <li>• Inter-rater reliability</li>
                      <li>• Standard error of measurement</li>
                    </ul>
                    <Badge variant="destructive" className="mt-2">0% Complete</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Validity Evidence</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Content validity studies</li>
                      <li>• Construct validity analysis</li>
                      <li>• Criterion validity</li>
                      <li>• Factor analysis results</li>
                    </ul>
                    <Badge variant="destructive" className="mt-2">0% Complete</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Expert Review Process</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Licensed psychologist review</li>
                      <li>• Subject matter expert validation</li>
                      <li>• Item development methodology</li>
                      <li>• Content review panels</li>
                    </ul>
                    <Badge variant="destructive" className="mt-2">0% Complete</Badge>
                  </div>
                </div>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Professional standards require comprehensive documentation of all psychometric 
                    properties and validation procedures. Current documentation level: 0%
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};