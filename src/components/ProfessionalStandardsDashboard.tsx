/**
 * Professional Standards Compliance Dashboard
 * Tracks compliance with APA, ITC, and other professional standards
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Shield, 
  BookOpen, 
  Users, 
  FileCheck,
  Clock,
  Star
} from 'lucide-react';

interface ComplianceStandard {
  standardType: 'APA' | 'ITC' | 'AERA' | 'ISO' | 'GDPR';
  assessmentType: string;
  complianceScore: number;
  status: 'compliant' | 'partial' | 'non_compliant';
  requirementsMet: string[];
  requirementsMissing: string[];
  lastReviewDate: string;
  nextReviewDue: string;
  criticalIssues: string[];
  remediationPlan: string[];
}

export const ProfessionalStandardsDashboard: React.FC = () => {
  const [complianceData, setComplianceData] = useState<ComplianceStandard[]>([]);
  const [selectedStandard, setSelectedStandard] = useState<string>('APA');
  const [loading, setLoading] = useState(true);

  const assessmentTypes = [
    'career_launch', 'communication_styles', 'cultural_intelligence',
    'emotional_intelligence', 'leadership', 'digital_wellness',
    'faith_values', 'stress_resilience', 'genz_workplace', 'burnout_prevention'
  ];

  const professionalStandards = {
    APA: {
      name: 'American Psychological Association',
      requirements: [
        'Test development documentation',
        'Reliability evidence (Cronbach\'s α ≥ 0.70)',
        'Construct validity evidence',
        'Content validity evidence',
        'Criterion validity evidence',
        'Normative data with representative samples',
        'Fair testing practices',
        'Professional interpretation guidelines',
        'Ethical use frameworks',
        'Bias and fairness analysis'
      ]
    },
    ITC: {
      name: 'International Test Commission',
      requirements: [
        'Test adaptation guidelines compliance',
        'Cross-cultural validity evidence',
        'Translation and localization standards',
        'Cultural bias assessment',
        'Multinational normative data',
        'Language equivalence verification',
        'Cultural sensitivity review',
        'International ethical standards'
      ]
    },
    AERA: {
      name: 'American Educational Research Association',
      requirements: [
        'Educational measurement standards',
        'Validity evidence framework',
        'Reliability documentation',
        'Fairness and accessibility',
        'Score interpretation guidelines',
        'Test security measures',
        'Professional development requirements'
      ]
    },
    ISO: {
      name: 'International Organization for Standardization',
      requirements: [
        'Quality management systems',
        'Data security standards (ISO 27001)',
        'Privacy protection (ISO 29100)',
        'Risk management frameworks',
        'Continuous improvement processes',
        'Documentation and record keeping',
        'Audit and review procedures'
      ]
    },
    GDPR: {
      name: 'General Data Protection Regulation',
      requirements: [
        'Lawful basis for processing',
        'Data subject consent mechanisms',
        'Right to access implementation',
        'Right to rectification procedures',
        'Right to erasure (right to be forgotten)',
        'Data portability capabilities',
        'Privacy by design implementation',
        'Data protection impact assessments',
        'Breach notification procedures'
      ]
    }
  };

  useEffect(() => {
    generateComplianceData();
  }, []);

  const generateComplianceData = () => {
    setLoading(true);
    const data: ComplianceStandard[] = [];

    // Generate compliance data for each assessment and standard
    assessmentTypes.forEach(assessmentType => {
      Object.keys(professionalStandards).forEach(standardType => {
        const standard = professionalStandards[standardType as keyof typeof professionalStandards];
        
        // Simulate compliance assessment (in real implementation, this would query actual data)
        const requirementsMet: string[] = [];
        const requirementsMissing: string[] = [];
        const criticalIssues: string[] = [];
        
        // Current state: Most requirements are missing (as per audit)
        standard.requirements.forEach((req, index) => {
          if (index % 4 === 0) { // Only 25% compliance
            requirementsMet.push(req);
          } else {
            requirementsMissing.push(req);
            if (req.includes('validity') || req.includes('reliability') || req.includes('bias')) {
              criticalIssues.push(`CRITICAL: ${req} not implemented`);
            }
          }
        });

        const complianceScore = (requirementsMet.length / standard.requirements.length) * 100;
        const status: ComplianceStandard['status'] = 
          complianceScore >= 80 ? 'compliant' :
          complianceScore >= 50 ? 'partial' : 'non_compliant';

        const remediationPlan = generateRemediationPlan(standardType as any, requirementsMissing);

        data.push({
          standardType: standardType as ComplianceStandard['standardType'],
          assessmentType,
          complianceScore,
          status,
          requirementsMet,
          requirementsMissing,
          lastReviewDate: '2024-01-15',
          nextReviewDue: '2024-07-15',
          criticalIssues,
          remediationPlan
        });
      });
    });

    setComplianceData(data);
    setLoading(false);
  };

  const generateRemediationPlan = (
    standardType: keyof typeof professionalStandards, 
    missing: string[]
  ): string[] => {
    const plans: Record<string, string[]> = {
      APA: [
        'Engage licensed psychologist for validation oversight',
        'Conduct reliability studies with minimum 300 participants per assessment',
        'Perform factor analysis for construct validity',
        'Establish criterion validity with external measures',
        'Develop comprehensive normative databases',
        'Implement bias detection and fairness analysis',
        'Create professional interpretation manuals',
        'Establish ethical review board'
      ],
      ITC: [
        'Conduct cross-cultural validation studies',
        'Implement professional translation processes',
        'Establish multinational normative samples',
        'Perform cultural bias assessments',
        'Create localization guidelines',
        'Implement cultural sensitivity reviews'
      ],
      AERA: [
        'Document educational measurement procedures',
        'Establish validity evidence framework',
        'Implement comprehensive reliability testing',
        'Create fairness and accessibility guidelines',
        'Develop score interpretation standards'
      ],
      ISO: [
        'Implement ISO 27001 information security management',
        'Establish quality management system (ISO 9001)',
        'Implement privacy protection standards',
        'Create risk management framework',
        'Establish audit and review procedures'
      ],
      GDPR: [
        'Implement comprehensive consent management',
        'Create data subject rights portal',
        'Establish privacy by design procedures',
        'Implement data protection impact assessments',
        'Create breach notification systems'
      ]
    };

    return plans[standardType] || [];
  };

  const getStatusColor = (status: ComplianceStandard['status']) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = (status: ComplianceStandard['status']) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <AlertTriangle className="w-4 h-4" />;
      case 'non_compliant': return <XCircle className="w-4 h-4" />;
    }
  };

  const formatAssessmentName = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getOverallComplianceScore = (standardType: string) => {
    const standardData = complianceData.filter(d => d.standardType === standardType);
    if (standardData.length === 0) return 0;
    return standardData.reduce((sum, d) => sum + d.complianceScore, 0) / standardData.length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Professional Standards Compliance</h1>
        <Badge variant="destructive" className="text-sm">
          CRITICAL: Non-Compliant
        </Badge>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Professional Standards Violation:</strong> Current compliance scores indicate 
          critical violations of professional testing standards. Immediate remediation required 
          to meet APA, ITC, and industry standards for psychometric assessment delivery.
        </AlertDescription>
      </Alert>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.keys(professionalStandards).map((standard) => {
          const overallScore = getOverallComplianceScore(standard);
          const status = overallScore >= 80 ? 'compliant' : overallScore >= 50 ? 'partial' : 'non_compliant';
          
          return (
            <Card key={standard} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{standard}</CardTitle>
                  {getStatusIcon(status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compliance:</span>
                    <span className={overallScore < 50 ? 'text-red-600' : 'text-yellow-600'}>
                      {overallScore.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={overallScore} className="h-2" />
                  <Badge className={`text-xs ${getStatusColor(status)}`}>
                    {status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={selectedStandard} onValueChange={setSelectedStandard} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {Object.keys(professionalStandards).map((standard) => (
            <TabsTrigger key={standard} value={standard}>
              {standard}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(professionalStandards).map((standardKey) => (
          <TabsContent key={standardKey} value={standardKey} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {professionalStandards[standardKey as keyof typeof professionalStandards].name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complianceData
                    .filter(d => d.standardType === standardKey)
                    .map((data) => (
                      <Card key={`${data.standardType}-${data.assessmentType}`} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {formatAssessmentName(data.assessmentType)}
                            </CardTitle>
                            <Badge className={`text-xs ${getStatusColor(data.status)}`}>
                              {data.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Compliance Score:</span>
                            <span className={data.complianceScore < 50 ? 'text-red-600' : 'text-yellow-600'}>
                              {data.complianceScore.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={data.complianceScore} className="h-2" />
                          
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Met: </span>
                              <span className="text-green-600">{data.requirementsMet.length}</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Missing: </span>
                              <span className="text-red-600">{data.requirementsMissing.length}</span>
                            </div>
                          </div>

                          {data.criticalIssues.length > 0 && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                {data.criticalIssues.length} critical issues require immediate attention
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <FileCheck className="w-3 h-3 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="default" className="flex-1">
                              <Star className="w-3 h-3 mr-1" />
                              Remediate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Remediation Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Remediation Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <strong>Priority Actions for {standardKey} Compliance:</strong>
                    </AlertDescription>
                  </Alert>
                  
                  {complianceData
                    .find(d => d.standardType === standardKey)
                    ?.remediationPlan.map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{action}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Critical Actions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Immediate Critical Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Professional Liability Risk:</strong> Operating psychometric assessments 
                without proper validation violates professional standards and creates legal liability.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="w-full justify-start" variant="destructive">
                <Users className="w-4 h-4 mr-2" />
                Engage Licensed Psychologist (Immediate)
              </Button>
              <Button className="w-full justify-start" variant="destructive">
                <Shield className="w-4 h-4 mr-2" />
                Conduct Reliability Studies (30 days)
              </Button>
              <Button className="w-full justify-start" variant="destructive">
                <FileCheck className="w-4 h-4 mr-2" />
                Implement Validity Testing (60 days)
              </Button>
              <Button className="w-full justify-start" variant="destructive">
                <BookOpen className="w-4 h-4 mr-2" />
                Create Professional Documentation (14 days)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};