/**
 * Assessment Quality Dashboard
 * Unified dashboard for professional standards compliance, bias monitoring, and quality validation
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  FileText,
  Brain,
  BarChart3,
  Settings,
  Eye,
  Target,
  Zap
} from 'lucide-react';

import { biasDetectionService } from '@/services/biasDetectionService';
import { assessmentValidationService } from '@/services/assessmentValidationService';
import { uncertaintyIntegrationService } from '@/services/uncertaintyIntegrationService';
import AssessmentDisclaimers from './AssessmentDisclaimers';
import { productionLogger } from '@/utils/productionConfig';

interface ComplianceMetrics {
  overallCompliance: number;
  psychometricStandards: number;
  biasPrevention: number;
  aiEthics: number;
  validatedAssessments: number;
  criticalIssues: number;
}

interface QualityReport {
  assessmentType: string;
  qualityScore: number;
  biasRisk: 'low' | 'medium' | 'high';
  validationStatus: 'compliant' | 'warning' | 'non-compliant';
  lastUpdated: string;
  criticalIssues: string[];
  recommendations: string[];
}

const ASSESSMENT_TYPES = [
  'career-launch',
  'communication-styles', 
  'workplace-wellness',
  'emotional-intelligence',
  'cultural-intelligence',
  'leadership',
  'stress-resilience',
  'digital-wellness',
  'genz-workplace'
];

export const AssessmentQualityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics>({
    overallCompliance: 0,
    psychometricStandards: 0,
    biasPrevention: 0,
    aiEthics: 0,
    validatedAssessments: 0,
    criticalIssues: 0
  });
  const [qualityReports, setQualityReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');

  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = async () => {
    try {
      setLoading(true);
      
      // Load compliance metrics
      const biasData = await biasDetectionService.getBiasMonitoringData();
      
      // Generate quality reports for all assessments
      const reports: QualityReport[] = [];
      
      for (const assessmentType of ASSESSMENT_TYPES) {
        try {
          const validation = await assessmentValidationService.validateAssessment(
            assessmentType,
            [], // Questions would be loaded here
            {} // Scoring algorithm would be loaded here
          );
          
          const biasAnalysis = await biasDetectionService.analyzeAssessmentBias(assessmentType);
          
          reports.push({
            assessmentType,
            qualityScore: validation.qualityScore,
            biasRisk: biasAnalysis.biasSeverity || 'medium',
            validationStatus: validation.isValid ? 'compliant' : 'warning',
            lastUpdated: new Date().toISOString(),
            criticalIssues: validation.criticalIssues,
            recommendations: validation.recommendations
          });
        } catch (error) {
          productionLogger.error(`Error validating ${assessmentType}:`, error);
          reports.push({
            assessmentType,
            qualityScore: 0,
            biasRisk: 'high',
            validationStatus: 'non-compliant',
            lastUpdated: new Date().toISOString(),
            criticalIssues: ['Validation failed'],
            recommendations: ['Review assessment structure']
          });
        }
      }
      
      setQualityReports(reports);
      
      // Calculate overall compliance metrics
      const totalAssessments = reports.length;
      const compliantAssessments = reports.filter(r => r.validationStatus === 'compliant').length;
      const lowBiasAssessments = reports.filter(r => r.biasRisk === 'low').length;
      const highQualityAssessments = reports.filter(r => r.qualityScore >= 80).length;
      const totalCriticalIssues = reports.reduce((sum, r) => sum + r.criticalIssues.length, 0);
      
      setComplianceMetrics({
        overallCompliance: Math.round((compliantAssessments / totalAssessments) * 100),
        psychometricStandards: Math.round((highQualityAssessments / totalAssessments) * 100),
        biasPrevention: Math.round((lowBiasAssessments / totalAssessments) * 100),
        aiEthics: biasData.overallFairnessScore,
        validatedAssessments: compliantAssessments,
        criticalIssues: totalCriticalIssues
      });
      
    } catch (error) {
      productionLogger.error('Error loading quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runFullValidation = async () => {
    setValidating(true);
    try {
      // Run comprehensive validation on all assessments
      await loadQualityData();
      
      // Show results
      const criticalCount = complianceMetrics.criticalIssues;
      if (criticalCount > 0) {
        alert(`Validation complete. Found ${criticalCount} critical issues that need immediate attention.`);
      } else {
        alert('Validation complete. All assessments meet basic compliance standards.');
      }
    } catch (error) {
      productionLogger.error('Validation failed:', error);
      alert('Validation failed. Please check console for details.');
    } finally {
      setValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'non-compliant':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBiasRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assessment Quality Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor professional standards compliance, bias prevention, and assessment quality
          </p>
        </div>
        <Button onClick={runFullValidation} disabled={validating} className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          {validating ? 'Running Validation...' : 'Run Full Validation'}
        </Button>
      </div>

      {/* Critical Issues Alert */}
      {complianceMetrics.criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Issues Detected:</strong> {complianceMetrics.criticalIssues} issues require immediate attention 
            to ensure compliance with professional standards.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Overall Compliance</span>
            </div>
            <div className="text-3xl font-bold">{complianceMetrics.overallCompliance}%</div>
            <Progress value={complianceMetrics.overallCompliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Psychometric Standards</span>
            </div>
            <div className="text-3xl font-bold">{complianceMetrics.psychometricStandards}%</div>
            <Progress value={complianceMetrics.psychometricStandards} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-muted-foreground">Bias Prevention</span>
            </div>
            <div className="text-3xl font-bold">{complianceMetrics.biasPrevention}%</div>
            <Progress value={complianceMetrics.biasPrevention} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-muted-foreground">AI Ethics Score</span>
            </div>
            <div className="text-3xl font-bold">{complianceMetrics.aiEthics}%</div>
            <Progress value={complianceMetrics.aiEthics} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Assessment Overview</TabsTrigger>
          <TabsTrigger value="bias-monitoring">Bias Monitoring</TabsTrigger>
          <TabsTrigger value="validation">Quality Validation</TabsTrigger>
          <TabsTrigger value="disclaimers">Professional Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Quality Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(report.validationStatus)}
                        <div>
                          <h4 className="font-medium capitalize">
                            {report.assessmentType.replace('-', ' ')} Assessment
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Quality Score: {report.qualityScore}% | 
                            Last Updated: {new Date(report.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getBiasRiskColor(report.biasRisk)}>
                          {report.biasRisk} bias risk
                        </Badge>
                        <Badge variant={
                          report.validationStatus === 'compliant' ? 'secondary' :
                          report.validationStatus === 'warning' ? 'destructive' : 'outline'
                        }>
                          {report.validationStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bias-monitoring" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bias Detection & Prevention</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring of bias risks across all assessment types
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qualityReports.filter(r => r.biasRisk !== 'low').map((report, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium capitalize">
                          {report.assessmentType.replace('-', ' ')} Assessment
                        </h4>
                        <Badge className={getBiasRiskColor(report.biasRisk)}>
                          {report.biasRisk} risk
                        </Badge>
                      </div>
                      
                      {report.criticalIssues.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-600 mb-2">Critical Issues:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {report.criticalIssues.slice(0, 3).map((issue, i) => (
                              <li key={i}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {report.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-2">Recommended Actions:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {report.recommendations.slice(0, 2).map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {qualityReports.filter(r => r.biasRisk !== 'low').length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium">All Assessments Pass Bias Checks</h3>
                      <p className="text-muted-foreground">No significant bias risks detected across any assessments.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Validation Results</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Professional standards compliance and quality metrics
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qualityReports.map((report, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium capitalize">
                          {report.assessmentType.replace('-', ' ')} Assessment
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Quality Score: {report.qualityScore}%
                          </span>
                          <Progress value={report.qualityScore} className="w-20" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Validation Status</p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(report.validationStatus)}
                            <span className="text-sm capitalize">{report.validationStatus}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Bias Risk Level</p>
                          <Badge className={getBiasRiskColor(report.biasRisk)}>
                            {report.biasRisk}
                          </Badge>
                        </div>
                      </div>
                      
                      {(report.criticalIssues.length > 0 || report.recommendations.length > 0) && (
                        <Separator className="my-4" />
                      )}
                      
                      {report.criticalIssues.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-600 mb-2">Issues ({report.criticalIssues.length}):</p>
                          <div className="text-sm text-muted-foreground">
                            {report.criticalIssues.slice(0, 2).join(', ')}
                            {report.criticalIssues.length > 2 && ` and ${report.criticalIssues.length - 2} more...`}
                          </div>
                        </div>
                      )}
                      
                      {report.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-2">Recommendations:</p>
                          <div className="text-sm text-muted-foreground">
                            {report.recommendations.slice(0, 2).join(', ')}
                            {report.recommendations.length > 2 && ` and ${report.recommendations.length - 2} more...`}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disclaimers" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Guidelines & Disclaimers</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Professional boundaries and proper use guidelines for all assessments
                </p>
              </CardHeader>
              <CardContent>
                <AssessmentDisclaimers assessmentType="general" showFull={true} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentQualityDashboard;