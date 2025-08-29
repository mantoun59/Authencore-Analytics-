import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Activity,
  Globe,
  Building,
  Clock,
  Award,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import futureSkillsMLService from '@/services/futureSkillsMLService';
import featureStoreService from '@/services/featureStoreService';

const FutureSkillsEnhanced = () => {
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [selectedIndustry, setSelectedIndustry] = useState('Technology');
  const [selectedTimeframe, setSelectedTimeframe] = useState('5y');
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [modelMetrics, setModelMetrics] = useState({});
  const [experiments, setExperiments] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const { toast } = useToast();

  const regions = ['Global', 'North America', 'Europe', 'Asia Pacific'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education'];
  const timeframes = [
    { value: '1y', label: '1 Year' },
    { value: '3y', label: '3 Years' },
    { value: '5y', label: '5 Years' },
    { value: '10y', label: '10 Years' }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      const [catalog, metrics, experiments, importance] = await Promise.all([
        futureSkillsMLService.getSkillsCatalog(),
        futureSkillsMLService.getModelMetrics(),
        futureSkillsMLService.getExperiments(),
        featureStoreService.getFeatureImportance()
      ]);

      setSkillsCatalog(catalog);
      setModelMetrics(metrics);
      setExperiments(experiments);
      setFeatureImportance(importance);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load ML pipeline data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateForecast = async (skill = 'AI/ML') => {
    try {
      setIsLoading(true);
      
      const result = await futureSkillsMLService.generateForecast(
        selectedRegion,
        selectedIndustry,
        skill,
        selectedTimeframe
      );

      setForecast(result);
      
      toast({
        title: "Forecast Generated",
        description: `Generated ${selectedTimeframe} forecast for ${skill}`,
      });
    } catch (error) {
      console.error('Error generating forecast:', error);
      toast({
        title: "Error",
        description: "Failed to generate forecast",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthTrend = (score) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-green-600', label: 'High Growth' };
    if (score >= 60) return { icon: Activity, color: 'text-yellow-600', label: 'Moderate Growth' };
    return { icon: AlertCircle, color: 'text-red-600', label: 'Low Growth' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Future Skills AI Engine
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced ML-powered workforce demand forecasting with Prophet, LightGBM, and XGBoost models
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Forecast Configuration
            </CardTitle>
            <CardDescription>
              Configure parameters for AI-powered skills demand forecasting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {region}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {industry}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Timeframe</label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(tf => (
                      <SelectItem key={tf.value} value={tf.value}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {tf.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => generateForecast()}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Rocket className="h-4 w-4 mr-2" />
                  )}
                  Generate Forecast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forecast">AI Forecast</TabsTrigger>
            <TabsTrigger value="skills">Skills Catalog</TabsTrigger>
            <TabsTrigger value="models">ML Models</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Forecast Results */}
          <TabsContent value="forecast">
            {forecast ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Forecast Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Demand Forecast
                    </CardTitle>
                    <CardDescription>
                      {forecast.metadata.timeframe} forecast for {forecast.metadata.skill}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {Math.round(forecast.forecast).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Predicted Demand Score</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Confidence Interval</span>
                          <span className="text-sm font-medium">{Math.round(forecast.confidence.level * 100)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Lower: {forecast.confidence.lower.toLocaleString()}</span>
                          <span>Upper: {forecast.confidence.upper.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={75} 
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Globe className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                          <div className="text-sm font-medium">{forecast.metadata.region}</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Building className="h-6 w-6 mx-auto mb-1 text-green-600" />
                          <div className="text-sm font-medium">{forecast.metadata.industry}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Model Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Model Performance
                    </CardTitle>
                    <CardDescription>
                      Ensemble prediction breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(forecast.models).map(([model, prediction]: [string, any]) => (
                        <div key={model} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              model === 'prophet' ? 'bg-blue-500' :
                              model === 'lightgbm' ? 'bg-green-500' :
                              'bg-purple-500'
                            }`} />
                            <span className="font-medium capitalize">{model}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{Math.round(prediction?.value || 0).toLocaleString()}</div>
                            <div className="text-xs text-gray-500">prediction</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Forecast Generated</h3>
                  <p className="text-gray-500 mb-4">
                    Select your parameters and click "Generate Forecast" to see AI predictions
                  </p>
                  <Button onClick={() => generateForecast()} disabled={isLoading}>
                    <Rocket className="h-4 w-4 mr-2" />
                    Generate Your First Forecast
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Skills Catalog */}
          <TabsContent value="skills">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillsCatalog.map((skill) => {
                const trend = getGrowthTrend(skill.demand_score);
                const TrendIcon = trend.icon;
                
                return (
                  <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{skill.skill_name}</CardTitle>
                        <Badge variant="secondary">{skill.category}</Badge>
                      </div>
                      <CardDescription>{skill.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Demand Score</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{Math.round(skill.demand_score)}</span>
                            <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                          </div>
                        </div>
                        
                        <Progress value={skill.demand_score} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="font-medium">${Math.round(skill.salary_premium || 0).toLocaleString()}</div>
                            <div className="text-gray-500">Salary Premium</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="font-medium">{Math.round(skill.growth_rate || 0)}%</div>
                            <div className="text-gray-500">Growth Rate</div>
                          </div>
                        </div>

                        <Button
                          onClick={() => generateForecast(skill.skill_name)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={isLoading}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Forecast This Skill
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ML Models */}
          <TabsContent value="models">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Model Performance
                  </CardTitle>
                  <CardDescription>
                    Current ML model accuracy and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelMetrics).map(([key, model]: [string, any]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{model?.name || 'Unknown Model'}</h4>
                            <p className="text-sm text-gray-500">Version {model?.version || '1.0'}</p>
                          </div>
                          <Badge variant={model?.accuracy >= 0.9 ? "default" : "secondary"}>
                            {Math.round((model?.accuracy || 0) * 100)}% Accuracy
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <span className={`ml-2 font-medium ${getConfidenceColor(model?.confidence || 0)}`}>
                              {Math.round((model?.confidence || 0) * 100)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <span className="ml-2 font-medium capitalize">{model?.type || 'unknown'}</span>
                          </div>
                        </div>
                        
                        <Progress value={(model?.accuracy || 0) * 100} className="mt-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Experiments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Experiments
                  </CardTitle>
                  <CardDescription>
                    Latest ML training experiments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {experiments.map((experiment) => (
                      <div key={experiment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{experiment.model}</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-500">{experiment.status}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Accuracy:</span>
                            <span className="ml-1 font-medium">
                              {Math.round(experiment.metrics.accuracy * 100)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Training Time:</span>
                            <span className="ml-1 font-medium">
                              {Math.round(experiment.metrics.trainingTime)}s
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feature Analysis */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Feature Importance
                </CardTitle>
                <CardDescription>
                  Most important features driving the ML predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureImportance.map((feature, index) => (
                    <div key={feature.feature} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{feature.feature.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-500">{Math.round(feature.importance * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={feature.importance * 100} className="flex-1" />
                          <Badge variant="outline" className="text-xs">
                            {feature.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FutureSkillsEnhanced;