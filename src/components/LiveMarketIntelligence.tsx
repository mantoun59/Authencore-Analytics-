import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Brain, Target, Globe, Users, BarChart3, Zap, AlertCircle } from 'lucide-react';

interface LiveMarketIntelligenceProps {
  skillsData: any[];
  consensusPredictions: any[];
  economicIndicators: any[];
  dataSources: any[];
}

const LiveMarketIntelligence: React.FC<LiveMarketIntelligenceProps> = ({
  skillsData,
  consensusPredictions,
  economicIndicators,
  dataSources
}) => {
  
  const processGlobalTrends = () => {
    if (!skillsData.length) return [];
    
    // Group by region and calculate averages
    const regionData = skillsData.reduce((acc: any, item: any) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          region: item.region,
          avgDemand: 0,
          avgGrowth: 0,
          skills: 0,
          automationRisk: 0
        };
      }
      acc[item.region].avgDemand += item.demand_score;
      acc[item.region].avgGrowth += item.growth_rate;
      acc[item.region].automationRisk += item.automation_risk;
      acc[item.region].skills += 1;
      return acc;
    }, {});

    return Object.values(regionData).map((region: any) => ({
      region: region.region,
      avgDemand: Math.round(region.avgDemand / region.skills),
      avgGrowth: Math.round(region.avgGrowth / region.skills * 10) / 10,
      automationRisk: Math.round(region.automationRisk / region.skills),
      skillsCount: region.skills
    }));
  };

  const processIndustryAnalysis = () => {
    if (!skillsData.length) return [];
    
    const industryData = skillsData.reduce((acc: any, item: any) => {
      if (!acc[item.industry]) {
        acc[item.industry] = {
          industry: item.industry,
          totalDemand: 0,
          avgSalaryPremium: 0,
          skillCount: 0,
          volatility: []
        };
      }
      acc[item.industry].totalDemand += item.demand_score;
      acc[item.industry].avgSalaryPremium += item.salary_premium || 0;
      acc[item.industry].skillCount += 1;
      acc[item.industry].volatility.push(item.growth_rate);
      return acc;
    }, {});

    return Object.entries(industryData)
      .map(([key, data]: [string, any]) => ({
        industry: key,
        avgDemand: Math.round(data.totalDemand / data.skillCount),
        avgSalaryPremium: Math.round(data.avgSalaryPremium / data.skillCount),
        skillCount: data.skillCount,
        volatility: Math.round(Math.sqrt(data.volatility.reduce((sum: number, val: number) => 
          sum + Math.pow(val - (data.volatility.reduce((a: number, b: number) => a + b) / data.volatility.length), 2), 0) / data.volatility.length))
      }))
      .sort((a, b) => b.avgDemand - a.avgDemand);
  };

  const processSkillsOpportunities = () => {
    if (!skillsData.length) return [];
    
    return skillsData
      .map(skill => ({
        skill: skill.skill_name,
        demand: skill.demand_score,
        growth: skill.growth_rate,
        salaryPremium: skill.salary_premium || 0,
        automationRisk: skill.automation_risk,
        opportunity: (skill.demand_score * 0.4) + (skill.growth_rate * 0.3) + 
                    ((skill.salary_premium || 0) * 0.2) + ((100 - skill.automation_risk) * 0.1)
      }))
      .sort((a, b) => b.opportunity - a.opportunity)
      .slice(0, 15);
  };

  const processDataSourceMetrics = () => {
    return dataSources.map(source => ({
      name: source.source_name,
      type: source.source_type,
      quality: source.data_quality_score || 0.85,
      industries: source.industry_focus?.length || 0,
      lastUpdate: source.last_updated,
      region: source.region || 'Global'
    }));
  };

  const globalTrends = processGlobalTrends();
  const industryAnalysis = processIndustryAnalysis();
  const skillsOpportunities = processSkillsOpportunities();
  const dataSourceMetrics = processDataSourceMetrics();

  const getOpportunityColor = (score: number) => {
    if (score > 70) return 'text-success';
    if (score > 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Global Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Global Skills Demand by Region</span>
            </CardTitle>
            <CardDescription>
              Real-time regional analysis of skills markets worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={globalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="avgDemand" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgGrowth" 
                  stackId="2"
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              <span>Industry Performance Matrix</span>
            </CardTitle>
            <CardDescription>
              Demand vs salary premium analysis across industries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={industryAnalysis}>
                <CartesianGrid />
                <XAxis 
                  type="number" 
                  dataKey="avgDemand" 
                  name="Average Demand"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis 
                  type="number" 
                  dataKey="avgSalaryPremium" 
                  name="Salary Premium"
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{data.industry}</p>
                          <p className="text-sm">Demand: {data.avgDemand}%</p>
                          <p className="text-sm">Salary Premium: {data.avgSalaryPremium}%</p>
                          <p className="text-sm">Skills: {data.skillCount}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  dataKey="avgSalaryPremium" 
                  fill="hsl(var(--primary))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills Opportunities Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-success" />
            <span>Top Skills Opportunities</span>
          </CardTitle>
          <CardDescription>
            AI-calculated opportunity scores based on demand, growth, salary, and automation resistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsOpportunities.slice(0, 12).map((skill: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{skill.skill}</h4>
                  <Badge variant="outline" className={getOpportunityColor(skill.opportunity)}>
                    {Math.round(skill.opportunity)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Demand</span>
                    <span className="font-medium">{Math.round(skill.demand)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Growth</span>
                    <span className={`font-medium ${skill.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                      {skill.growth > 0 ? '+' : ''}{Math.round(skill.growth)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Salary Premium</span>
                    <span className="font-medium">+{Math.round(skill.salaryPremium)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Automation Risk</span>
                    <span className={`font-medium ${skill.automationRisk < 30 ? 'text-success' : skill.automationRisk < 60 ? 'text-warning' : 'text-destructive'}`}>
                      {Math.round(skill.automationRisk)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>Live Data Sources Network</span>
          </CardTitle>
          <CardDescription>
            Real-time monitoring of data quality and coverage from multiple intelligence sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSourceMetrics.map((source: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{source.name}</h4>
                  <Badge variant={source.type === 'government_api' ? 'default' : 
                                 source.type === 'recruitment_api' ? 'secondary' : 
                                 source.type === 'economic_api' ? 'outline' : 'destructive'} 
                         className="text-xs">
                    {source.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Data Quality</span>
                    <span className="font-medium text-success">
                      {Math.round(source.quality * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Industries</span>
                    <span className="font-medium">{source.industries}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Region</span>
                    <span className="font-medium">{source.region}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Update</span>
                    <span className="font-medium">
                      {source.lastUpdate ? 
                        new Date(source.lastUpdate).toLocaleDateString() : 
                        'Live'
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>AI Market Intelligence Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {skillsData.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time skills tracked across global markets
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {dataSources.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Live data sources from recruitment, government, and economic institutions
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {consensusPredictions.length}
              </div>
              <p className="text-sm text-muted-foreground">
                AI consensus predictions updated continuously
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveMarketIntelligence;