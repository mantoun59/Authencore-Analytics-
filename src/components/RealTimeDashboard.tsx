import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Wifi, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap, Globe } from 'lucide-react';

interface RealTimeDashboardProps {
  metrics: any;
  alerts: any[];
  consensusPredictions: any[];
  aiEngines: any[];
  dataSources: any[];
  economicIndicators: any[];
  skillsData: any[];
  lastUpdate: Date;
}

const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({
  metrics,
  alerts,
  consensusPredictions,
  aiEngines,
  dataSources,
  economicIndicators,
  skillsData,
  lastUpdate
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getDataFreshnessStatus = (hours: number) => {
    if (hours < 1) return { color: 'text-success', icon: CheckCircle, status: 'Real-time' };
    if (hours < 4) return { color: 'text-warning', icon: Activity, status: 'Fresh' };
    return { color: 'text-destructive', icon: AlertTriangle, status: 'Stale' };
  };

  const processSkillsForChart = () => {
    if (!skillsData.length) return [];
    
    // Group by skill and get latest demand scores
    const skillGroups = skillsData.reduce((acc: any, item: any) => {
      if (!acc[item.skill_name]) {
        acc[item.skill_name] = [];
      }
      acc[item.skill_name].push(item);
      return acc;
    }, {});

    return Object.entries(skillGroups)
      .map(([skill, data]: [string, any]) => ({
        skill,
        demand: Math.round(data.reduce((sum: number, item: any) => sum + item.demand_score, 0) / data.length),
        growth: Math.round(data.reduce((sum: number, item: any) => sum + item.growth_rate, 0) / data.length),
        automation_risk: Math.round(data.reduce((sum: number, item: any) => sum + item.automation_risk, 0) / data.length)
      }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 10);
  };

  const processEconomicData = () => {
    return economicIndicators.map(indicator => ({
      indicator: indicator.indicator_type.replace('_', ' '),
      value: Math.round(indicator.value * 100) / 100,
      region: indicator.region,
      confidence: Math.round(indicator.confidence_level * 100)
    }));
  };

  const skillsChartData = processSkillsForChart();
  const economicChartData = processEconomicData();
  const freshnessStatus = getDataFreshnessStatus(metrics.data_freshness_hours || 0);

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Live Data Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <freshnessStatus.icon className={`h-4 w-4 ${freshnessStatus.color}`} />
                  <span className={`text-lg font-bold ${freshnessStatus.color}`}>
                    {freshnessStatus.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated {formatTime(lastUpdate)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Engines Active</p>
                <p className="text-2xl font-bold text-primary">{aiEngines.length}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Zap className="h-3 w-3 text-warning" />
                  <span className="text-xs text-muted-foreground">
                    Multi-engine consensus
                  </span>
                </div>
              </div>
              <Wifi className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold text-primary">{dataSources.length}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dataSources.slice(0, 3).map((source: any, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs px-1">
                      {source.source_type.split('_')[0]}
                    </Badge>
                  ))}
                </div>
              </div>
              <Globe className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-destructive">{alerts.length}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-muted-foreground">
                    Market changes detected
                  </span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Live Market Alerts</span>
            </CardTitle>
            <CardDescription>
              Real-time notifications of significant market changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.map((alert: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-card border">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{alert.message}</p>
                      <Badge variant={getAlertSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    {alert.skill_name && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.skill_name} • {alert.industry} • {alert.region}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Skills Demand Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Skills Demand</CardTitle>
            <CardDescription>
              Live market demand scores across industries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="skill" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="demand" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Economic Indicators</CardTitle>
            <CardDescription>
              Live economic data impacting skills markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {economicChartData.map((indicator: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium capitalize">{indicator.indicator}</p>
                    <p className="text-sm text-muted-foreground">{indicator.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{indicator.value}%</p>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">{indicator.confidence}% confidence</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Consensus Overview */}
      <Card>
        <CardHeader>
          <CardTitle>AI Consensus Engine Status</CardTitle>
          <CardDescription>
            Multi-AI analysis for accurate market predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiEngines.map((engine: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{engine.engine_name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {engine.engine_type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{Math.round(engine.accuracy_score * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Specialization</span>
                    <span className="font-medium text-xs">
                      {engine.specialization?.[0] || 'General'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeDashboard;