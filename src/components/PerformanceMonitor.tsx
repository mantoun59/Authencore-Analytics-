import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface ServiceMetrics {
  aiRequests: number;
  edgeFunctionCalls: number;
  pdfGenerations: number;
  averageLatency: number;
  errorRate: number;
  costEstimate: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    aiRequests: 0,
    edgeFunctionCalls: 0,
    pdfGenerations: 0,
    averageLatency: 0,
    errorRate: 0,
    costEstimate: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Simulate fetching metrics - in production, this would call your analytics API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        aiRequests: Math.floor(Math.random() * 1000) + 500,
        edgeFunctionCalls: Math.floor(Math.random() * 2000) + 1000,
        pdfGenerations: Math.floor(Math.random() * 200) + 100,
        averageLatency: Math.random() * 500 + 200,
        errorRate: Math.random() * 5,
        costEstimate: Math.random() * 50 + 25
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Failed to load performance metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const performanceMetrics: MetricData[] = [
    {
      name: 'AI Service Latency',
      value: metrics.averageLatency,
      unit: 'ms',
      threshold: 1000,
      trend: metrics.averageLatency > 800 ? 'up' : 'stable',
      status: metrics.averageLatency > 1000 ? 'critical' : metrics.averageLatency > 500 ? 'warning' : 'good'
    },
    {
      name: 'Edge Function Calls',
      value: metrics.edgeFunctionCalls,
      unit: '/hour',
      threshold: 5000,
      trend: 'up',
      status: metrics.edgeFunctionCalls > 5000 ? 'warning' : 'good'
    },
    {
      name: 'Error Rate',
      value: metrics.errorRate,
      unit: '%',
      threshold: 2,
      trend: metrics.errorRate > 3 ? 'up' : 'down',
      status: metrics.errorRate > 5 ? 'critical' : metrics.errorRate > 2 ? 'warning' : 'good'
    },
    {
      name: 'Cost Estimate',
      value: metrics.costEstimate,
      unit: '$/hour',
      threshold: 100,
      trend: 'up',
      status: metrics.costEstimate > 100 ? 'critical' : metrics.costEstimate > 50 ? 'warning' : 'good'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3" />;
      case 'down': return <TrendingDown className="h-3 w-3" />;
      default: return <div className="h-3 w-3 bg-muted rounded-full" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Monitor
            </CardTitle>
            <div className="flex gap-2">
              {['1h', '24h', '7d'].map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {performanceMetrics.map((metric) => (
                  <Card key={metric.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        {getStatusIcon(metric.status)}
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">
                          {metric.value.toFixed(metric.unit === 'ms' ? 0 : 1)}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            {metric.unit}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">{metric.name}</p>
                        <Progress 
                          value={(metric.value / metric.threshold) * 100} 
                          className="mt-2 h-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">AI Requests</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.aiRequests}</p>
                    <Badge variant="secondary" className="mt-2">
                      OpenAI GPT-4
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Edge Functions</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.edgeFunctionCalls}</p>
                    <Badge variant="secondary" className="mt-2">
                      Supabase
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">PDF Generation</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{metrics.pdfGenerations}</p>
                    <Badge variant="secondary" className="mt-2">
                      HTML to PDF
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="costs" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Cost Breakdown ({selectedTimeframe})</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">OpenAI API</span>
                      <span className="font-medium">${(metrics.costEstimate * 0.6).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Supabase Edge Functions</span>
                      <span className="font-medium">${(metrics.costEstimate * 0.3).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other Services</span>
                      <span className="font-medium">${(metrics.costEstimate * 0.1).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Estimated</span>
                      <span>${metrics.costEstimate.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}