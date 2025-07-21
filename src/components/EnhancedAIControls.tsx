import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, MessageSquare, Shield, TrendingUp, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedAIEngine, type EnhancedAIConfig } from '@/services/enhancedAIEngine';

interface EnhancedAIControlsProps {
  onConfigUpdate?: (config: Partial<EnhancedAIConfig>) => void;
  assessmentData?: any;
  candidateInfo?: any;
}

export const EnhancedAIControls: React.FC<EnhancedAIControlsProps> = ({
  onConfigUpdate,
  assessmentData,
  candidateInfo
}) => {
  const [config, setConfig] = useState<EnhancedAIConfig>({
    model: 'gpt-4.1-2025-04-14',
    temperature: 0.3,
    maxTokens: 4000,
    analysisDepth: 'comprehensive'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  const updateConfig = (updates: Partial<EnhancedAIConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigUpdate?.(updates);
    
    // Update the AI engine configuration
    const aiEngine = EnhancedAIEngine.getInstance();
    aiEngine.updateConfig(newConfig);
    
    toast.success('AI configuration updated');
  };

  const generateEnhancedReport = async () => {
    if (!assessmentData || !candidateInfo) {
      toast.error('Assessment data and candidate information required');
      return;
    }

    setIsGenerating(true);
    try {
      const aiEngine = EnhancedAIEngine.getInstance();
      const enhancedReport = await aiEngine.generateEnhancedReport(
        assessmentData,
        candidateInfo,
        'candidate'
      );
      
      setLastAnalysis(enhancedReport);
      toast.success('Enhanced AI analysis completed!');
    } catch (error) {
      console.error('Enhanced AI analysis failed:', error);
      toast.error('Failed to generate enhanced analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateInterviewQuestions = async () => {
    if (!assessmentData || !candidateInfo) {
      toast.error('Assessment data and candidate information required');
      return;
    }

    setIsGenerating(true);
    try {
      const aiEngine = EnhancedAIEngine.getInstance();
      const questions = await aiEngine.generateAdvancedInterviewQuestions(
        assessmentData,
        candidateInfo
      );
      
      console.log('Enhanced Interview Questions:', questions);
      toast.success('Advanced interview questions generated!');
    } catch (error) {
      console.error('Interview question generation failed:', error);
      toast.error('Failed to generate interview questions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Enhanced AI Engine Configuration
          </CardTitle>
          <CardDescription>
            Configure the advanced AI analysis parameters for comprehensive insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Model</label>
              <Select
                value={config.model}
                onValueChange={(value: any) => updateConfig({ model: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4.1-2025-04-14">
                    GPT-4.1 (Recommended)
                  </SelectItem>
                  <SelectItem value="claude-opus-4-20250514">
                    Claude Opus 4
                  </SelectItem>
                  <SelectItem value="claude-sonnet-4-20250514">
                    Claude Sonnet 4
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Depth</label>
              <Select
                value={config.analysisDepth}
                onValueChange={(value: any) => updateConfig({ analysisDepth: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Analysis</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  <SelectItem value="expert">Expert-Level Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Temperature: {config.temperature}
            </label>
            <Slider
              value={[config.temperature]}
              onValueChange={([value]) => updateConfig({ temperature: value })}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Lower values = more focused, Higher values = more creative
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Max Tokens: {config.maxTokens}
            </label>
            <Slider
              value={[config.maxTokens]}
              onValueChange={([value]) => updateConfig({ maxTokens: value })}
              min={1000}
              max={8000}
              step={500}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Analysis Tools
          </CardTitle>
          <CardDescription>
            Generate comprehensive insights using advanced AI algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="interviews" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Interviews
              </TabsTrigger>
              <TabsTrigger value="distortion" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Validity
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enhanced Report Generation</CardTitle>
                    <CardDescription>
                      Generate comprehensive reports with cognitive profiling and behavioral predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={generateEnhancedReport}
                      disabled={isGenerating || !assessmentData}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Enhanced Report'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Confidence Level</CardTitle>
                    <CardDescription>
                      Current AI analysis confidence based on data quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant={lastAnalysis?.executiveSummary?.confidenceLevel > 80 ? 'default' : 'secondary'}>
                        {lastAnalysis?.executiveSummary?.confidenceLevel || 'N/A'}% Confidence
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="interviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Interview Question Generation</CardTitle>
                  <CardDescription>
                    AI-generated interview questions tailored to assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={generateInterviewQuestions}
                    disabled={isGenerating || !assessmentData}
                    className="w-full"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Interview Questions'}
                  </Button>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge variant="outline">Clarification</Badge>
                    <Badge variant="outline">Validation</Badge>
                    <Badge variant="outline">Behavioral</Badge>
                    <Badge variant="outline">Probe</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distortion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Distortion Analysis</CardTitle>
                  <CardDescription>
                    AI-powered validity assessment with statistical analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lastAnalysis?.validityAssessment ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Distortion Score:</span>
                        <Badge variant={lastAnalysis.validityAssessment.score <= 3 ? 'default' : 'destructive'}>
                          {lastAnalysis.validityAssessment.score}/10
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Reliability:</span>
                        <Badge variant={
                          lastAnalysis.validityAssessment.reliability === 'high' ? 'default' :
                          lastAnalysis.validityAssessment.reliability === 'medium' ? 'secondary' : 'destructive'
                        }>
                          {lastAnalysis.validityAssessment.reliability}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Confidence:</span>
                        <span className="text-sm font-medium">
                          {lastAnalysis.validityAssessment.confidenceLevel}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Run enhanced analysis to view distortion metrics</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI-Generated Insights</CardTitle>
                  <CardDescription>
                    Key insights from the enhanced analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {lastAnalysis?.executiveSummary?.keyInsights ? (
                    <div className="space-y-2">
                      {lastAnalysis.executiveSummary.keyInsights.slice(0, 3).map((insight: string, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Generate enhanced report to view AI insights</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIControls;