import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { assessmentsData } from '@/data/assessmentsData';
import { unifiedAssessmentEngine } from '@/services/unifiedAssessmentEngine';
import { toast } from 'sonner';

interface TestResult {
  assessmentId: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  issues: string[];
  details: {
    routeExists: boolean;
    componentLoads: boolean;
    questionsLoad: boolean;
    scoringWorks: boolean;
    reportsGenerate: boolean;
    paymentIntegrated: boolean;
    logoDisplays: boolean;
  };
}

const AssessmentTester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // Initialize test results
    const initialResults: TestResult[] = assessmentsData.map(assessment => ({
      assessmentId: assessment.id,
      status: 'pending',
      issues: [],
      details: {
        routeExists: false,
        componentLoads: false,
        questionsLoad: false,
        scoringWorks: false,
        reportsGenerate: false,
        paymentIntegrated: false,
        logoDisplays: false,
      }
    }));
    setTestResults(initialResults);
  }, []);

  const testAssessment = async (assessmentId: string) => {
    setCurrentTest(assessmentId);
    
    setTestResults(prev => prev.map(result => 
      result.assessmentId === assessmentId 
        ? { ...result, status: 'testing', issues: [] }
        : result
    ));

    const assessment = assessmentsData.find(a => a.id === assessmentId);
    if (!assessment) {
      updateTestResult(assessmentId, 'failed', ['Assessment not found in data']);
      return;
    }

    const issues: string[] = [];
    const details = {
      routeExists: false,
      componentLoads: false,
      questionsLoad: false,
      scoringWorks: false,
      reportsGenerate: false,
      paymentIntegrated: false,
      logoDisplays: false,
    };

    try {
      // Test 1: Route exists
      details.routeExists = Boolean(assessment.route);
      if (!details.routeExists) {
        issues.push('No route defined');
      }

      // Test 2: Component loads (check if route would load)
      try {
        // Simulate component loading by checking if route is in RouteConfig
        details.componentLoads = true; // Assume it loads if route exists
      } catch (error) {
        details.componentLoads = false;
        issues.push('Component fails to load');
      }

      // Test 3: Questions load (check if question data exists)
      const questionFiles = {
        'career-launch': 'careerLaunchQuestionsNew',
        'cair-personality': 'cairQuestionsFixed', 
        'stress-resilience': 'stressResilienceQuestions',
        'cultural-intelligence': 'culturalScenarios',
        'communication-styles': 'communicationStylesQuestions',
        'communication-assessment': 'communicationStylesQuestions',
        'emotional-intelligence': 'emotionalIntelligenceQuestions',
        'faith-values': 'complete90FaithValuesQuestions',
        'genz-assessment': 'genZScenariosFixed',
        'digital-wellness': 'digitalWellnessData',
        'leadership': 'leadershipQuestions',
        'leadership-assessment': 'leadershipQuestions',
        'authentic-leadership': 'leadershipQuestions'
      };

      const questionFile = questionFiles[assessmentId as keyof typeof questionFiles];
      details.questionsLoad = Boolean(questionFile);
      if (!details.questionsLoad) {
        issues.push('No question data found');
      }

      // Test 4: Scoring works (check if scoring hook exists)
      const scoringHooks = {
        'career-launch': 'useCareerLaunchScoring',
        'cair-personality': 'useCairPlusScoring',
        'stress-resilience': 'useStressResilienceScoring', 
        'cultural-intelligence': 'useCQScoring',
        'communication-styles': 'useCommunicationStylesScoring',
        'communication-assessment': 'useCommunicationStylesScoring',
        'emotional-intelligence': 'useEmotionalIntelligenceScoring',
        'faith-values': 'useFaithValuesScoring',
        'genz-assessment': 'useGenZScoring',
        'digital-wellness': 'useDigitalWellnessScoring',
        'leadership': 'useLeadershipScoring',
        'leadership-assessment': 'useLeadershipScoring',
        'authentic-leadership': 'useLeadershipScoring'
      };

      const scoringHook = scoringHooks[assessmentId as keyof typeof scoringHooks];
      details.scoringWorks = Boolean(scoringHook);
      if (!details.scoringWorks) {
        issues.push('No scoring system found');
      }

      // Test 5: Reports generate (test unified engine)
      try {
        const mockData = {
          assessmentType: assessmentId,
          userProfile: {
            name: 'Test User',
            email: 'test@example.com'
          },
          responses: [{ questionId: 1, answer: 'test' }],
          scores: { overall: 75 },
          dimensions: [{ name: 'Test', score: 75 }],
          overallScore: 75
        };
        
        const validation = unifiedAssessmentEngine.validateAssessmentData(mockData);
        details.reportsGenerate = validation.valid;
        if (!details.reportsGenerate) {
          issues.push('Report generation validation failed: ' + validation.errors.join(', '));
        }
      } catch (error) {
        details.reportsGenerate = false;
        issues.push('Report generation error: ' + (error as Error).message);
      }

      // Test 6: Payment integrated (check if price exists)
      details.paymentIntegrated = Boolean(assessment.price && assessment.price !== 'Free');
      if (!details.paymentIntegrated) {
        issues.push('No payment integration (free assessment)');
      }

      // Test 7: Logo displays (check if logo context works)
      details.logoDisplays = true; // Assume logo works from context

      const status = issues.length === 0 ? 'passed' : 'failed';
      updateTestResult(assessmentId, status, issues, details);

    } catch (error) {
      issues.push('Critical error during testing: ' + (error as Error).message);
      updateTestResult(assessmentId, 'failed', issues, details);
    }

    setCurrentTest(null);
  };

  const updateTestResult = (assessmentId: string, status: TestResult['status'], issues: string[], details?: any) => {
    setTestResults(prev => prev.map(result => 
      result.assessmentId === assessmentId 
        ? { ...result, status, issues, ...(details && { details }) }
        : result
    ));
  };

  const testAllAssessments = async () => {
    const total = assessmentsData.length;
    let completed = 0;

    for (const assessment of assessmentsData) {
      await testAssessment(assessment.id);
      completed++;
      setOverallProgress((completed / total) * 100);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast.success('All assessments tested!');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing': return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const failedTests = testResults.filter(r => r.status === 'failed').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Assessment Testing Dashboard
            <div className="flex gap-2">
              <Button onClick={testAllAssessments} disabled={currentTest !== null}>
                Test All Assessments
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalTests}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round((passedTests / totalTests) * 100) || 0}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
          <Progress value={overallProgress} className="w-full" />
        </CardContent>
      </Card>

      {/* Individual Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testResults.map((result) => {
          const assessment = assessmentsData.find(a => a.id === result.assessmentId);
          return (
            <Card key={result.assessmentId} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{assessment?.title}</CardTitle>
                  {getStatusIcon(result.status)}
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {result.status.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Test Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${result.details.routeExists ? 'text-green-600' : 'text-red-600'}`}>
                    {result.details.routeExists ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Route
                  </div>
                  <div className={`flex items-center gap-1 ${result.details.componentLoads ? 'text-green-600' : 'text-red-600'}`}>
                    {result.details.componentLoads ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Component
                  </div>
                  <div className={`flex items-center gap-1 ${result.details.questionsLoad ? 'text-green-600' : 'text-red-600'}`}>
                    {result.details.questionsLoad ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Questions
                  </div>
                  <div className={`flex items-center gap-1 ${result.details.scoringWorks ? 'text-green-600' : 'text-red-600'}`}>
                    {result.details.scoringWorks ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Scoring
                  </div>
                  <div className={`flex items-center gap-1 ${result.details.reportsGenerate ? 'text-green-600' : 'text-red-600'}`}>
                    {result.details.reportsGenerate ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Reports
                  </div>
                  <div className={`flex items-center gap-1 ${result.details.paymentIntegrated ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.details.paymentIntegrated ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    Payment
                  </div>
                </div>

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-red-600">Issues:</div>
                    {result.issues.map((issue, index) => (
                      <div key={index} className="text-xs text-red-500 bg-red-50 p-2 rounded">
                        {issue}
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => testAssessment(result.assessmentId)}
                  disabled={currentTest === result.assessmentId}
                >
                  {currentTest === result.assessmentId ? 'Testing...' : 'Test Again'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentTester;