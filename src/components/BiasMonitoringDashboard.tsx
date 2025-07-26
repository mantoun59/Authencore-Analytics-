/**
 * Bias Monitoring Dashboard
 * Provides comprehensive oversight of assessment fairness and bias detection
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Users, FileText } from 'lucide-react';
import { biasDetectionService } from '@/services/biasDetectionService';
import { normativeService } from '@/services/normativeDatabaseService';
import type { BiasAnalysisResult } from '@/services/biasDetectionService';

interface DashboardData {
  overallFairnessScore: number;
  assessmentFairness: Record<string, number>;
  recentAnalyses: BiasAnalysisResult[];
  complianceAlerts: string[];
  normativeDataCoverage: Record<string, number>;
}

export const BiasMonitoringDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('career-launch');
  const [analysisTimeframe, setAnalysisTimeframe] = useState<number>(30);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load bias monitoring data
      const monitoringData = await biasDetectionService.getBiasMonitoringData([
        'career-launch', 'stress-resilience', 'communication-styles'
      ]);

      // Load recent bias analyses
      const careerAnalysis = await biasDetectionService.analyzeAssessmentBias('career-launch', 30);
      const stressAnalysis = await biasDetectionService.analyzeAssessmentBias('stress-resilience', 30);
      const commAnalysis = await biasDetectionService.analyzeAssessmentBias('communication-styles', 30);

      // Load normative data coverage
      const normativeData = await Promise.all([
        normativeService.getNormativeData('career-launch'),
        normativeService.getNormativeData('stress-resilience'),
        normativeService.getNormativeData('communication-styles')
      ]);

      const normativeDataCoverage = {
        'career-launch': normativeData[0].length,
        'stress-resilience': normativeData[1].length,
        'communication-styles': normativeData[2].length
      };

      setDashboardData({
        overallFairnessScore: monitoringData.overallFairnessScore,
        assessmentFairness: monitoringData.assessmentFairness,
        recentAnalyses: [careerAnalysis, stressAnalysis, commAnalysis],
        complianceAlerts: monitoringData.complianceAlerts,
        normativeDataCoverage
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runBiasAnalysis = async () => {
    try {
      setLoading(true);
      await biasDetectionService.analyzeAssessmentBias(selectedAssessment, analysisTimeframe);
      await loadDashboardData();
    } catch (error) {
      console.error('Error running bias analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getFairnessStatus = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (score >= 80) return { label: 'Good', color: 'text-blue-600', icon: CheckCircle };
    if (score >= 70) return { label: 'Fair', color: 'text-yellow-600', icon: AlertTriangle };
    return { label: 'Needs Attention', color: 'text-red-600', icon: AlertTriangle };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bias monitoring data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load bias monitoring data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const fairnessStatus = getFairnessStatus(dashboardData.overallFairnessScore);
  const FairnessIcon = fairnessStatus.icon;

  const assessmentData = Object.entries(dashboardData.assessmentFairness).map(([name, score]) => ({
    assessment: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score,
    status: getFairnessStatus(score).label
  }));

  const pieData = [
    { name: 'Fair', value: assessmentData.filter(a => a.score >= 80).length, fill: '#10b981' },
    { name: 'Caution', value: assessmentData.filter(a => a.score >= 70 && a.score < 80).length, fill: '#f59e0b' },
    { name: 'Risk', value: assessmentData.filter(a => a.score < 70).length, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bias Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor assessment fairness and ensure equitable evaluation practices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FairnessIcon className={`h-5 w-5 ${fairnessStatus.color}`} />
          <span className={`font-semibold ${fairnessStatus.color}`}>
            {fairnessStatus.label}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {dashboardData.complianceAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <strong>Compliance Alerts:</strong>
            <ul className="mt-2 list-disc list-inside">
              {dashboardData.complianceAlerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Fairness</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overallFairnessScore}%</div>
            <Progress value={dashboardData.overallFairnessScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments Monitored</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(dashboardData.assessmentFairness).length}</div>
            <p className="text-xs text-muted-foreground">Active assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Analyses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.recentAnalyses.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normative Coverage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(dashboardData.normativeDataCoverage).reduce((sum, count) => sum + count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Data points</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="normative">Normative Data</TabsTrigger>
          <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Fairness Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assessmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="assessment" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fairness Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="career-launch">Career Launch</option>
              <option value="stress-resilience">Burnout Prevention Index</option>
              <option value="communication-styles">Communication Styles</option>
            </select>
            <select
              value={analysisTimeframe}
              onChange={(e) => setAnalysisTimeframe(Number(e.target.value))}
              className="px-3 py-2 border rounded-md"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Button onClick={runBiasAnalysis} disabled={loading}>
              Run Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {dashboardData.recentAnalyses.map((analysis, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">
                      {analysis.assessmentType.replace('-', ' ')} Assessment
                    </CardTitle>
                    <Badge variant={getSeverityColor(analysis.biasSeverity)}>
                      {analysis.biasSeverity} bias risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Adverse Impact Ratio</p>
                      <p className="text-2xl font-bold">
                        {analysis.biasIndicators.adverseImpactRatio.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.biasIndicators.adverseImpactRatio >= 80 ? 'Passes 80% rule' : 'Fails 80% rule'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sample Size</p>
                      <p className="text-2xl font-bold">{analysis.sampleSize}</p>
                      <p className="text-xs text-muted-foreground">Respondents analyzed</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Compliance Status</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={analysis.complianceStatus.eeo ? 'secondary' : 'destructive'}>
                          EEO: {analysis.complianceStatus.eeo ? 'Pass' : 'Fail'}
                        </Badge>
                        <Badge variant={analysis.complianceStatus.ada ? 'secondary' : 'destructive'}>
                          ADA: {analysis.complianceStatus.ada ? 'Pass' : 'Fail'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {analysis.recommendedActions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {analysis.recommendedActions.map((action, actionIndex) => (
                          <li key={actionIndex}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="normative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Normative Database Coverage</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ensure adequate normative data for fair comparisons across demographic groups
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dashboardData.normativeDataCoverage).map(([assessment, count]) => (
                  <div key={assessment} className="flex items-center justify-between">
                    <span className="capitalize">{assessment.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} data points</span>
                      <Badge variant={count >= 100 ? 'secondary' : count >= 50 ? 'default' : 'destructive'}>
                        {count >= 100 ? 'Adequate' : count >= 50 ? 'Limited' : 'Insufficient'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System-Wide Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Immediate Actions:</strong>
                    <ul className="mt-2 list-disc list-inside">
                      <li>Expand normative database with diverse demographic samples</li>
                      <li>Implement quarterly bias analysis reviews</li>
                      <li>Establish bias mitigation protocols for high-risk assessments</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Long-term Improvements:</strong>
                    <ul className="mt-2 list-disc list-inside">
                      <li>Develop demographic-adjusted scoring models</li>
                      <li>Implement real-time bias monitoring for all assessments</li>
                      <li>Create fairness audit trails for compliance reporting</li>
                    </ul>
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

export default BiasMonitoringDashboard;