import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
}

interface StressResilienceResult {
  overallScore: number;
  percentileScore: number;
  resilienceProfile: string;
  dimensionScores: DimensionScore[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  burnoutRisk: 'low' | 'medium' | 'high';
  stressManagementLevel: 'excellent' | 'good' | 'fair' | 'needs-improvement';
}

interface Props {
  results: StressResilienceResult;
}

const StressResilienceVisualizer: React.FC<Props> = ({ results }) => {
  const radarData = results.dimensionScores.map(dimension => ({
    subject: dimension.dimension,
    score: dimension.percentage,
    fullMark: 100
  }));

  const barData = results.dimensionScores.map(dimension => ({
    name: dimension.dimension,
    score: dimension.percentage,
    level: dimension.level
  }));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'hsl(142, 76%, 36%)'; // green
      case 'medium': return 'hsl(48, 96%, 53%)'; // yellow
      case 'high': return 'hsl(0, 84%, 60%)'; // red
      default: return 'hsl(0, 0%, 50%)';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'hsl(142, 76%, 36%)';
      case 'good': return 'hsl(173, 58%, 39%)';
      case 'fair': return 'hsl(48, 96%, 53%)';
      case 'needs-improvement': return 'hsl(0, 84%, 60%)';
      default: return 'hsl(0, 0%, 50%)';
    }
  };

  const getProfileColor = (profile: string) => {
    switch (profile) {
      case 'Titanium': return 'hsl(215, 25%, 27%)';
      case 'Steel': return 'hsl(220, 9%, 46%)';
      case 'Iron': return 'hsl(240, 5%, 41%)';
      case 'Copper': return 'hsl(25, 95%, 53%)';
      case 'Bronze': return 'hsl(45, 93%, 47%)';
      case 'Clay': return 'hsl(0, 84%, 60%)';
      default: return 'hsl(0, 0%, 50%)';
    }
  };

  const pieData = [
    { name: 'Current Level', value: results.overallScore, color: getProfileColor(results.resilienceProfile) },
    { name: 'Potential Growth', value: 100 - results.overallScore, color: 'hsl(0, 0%, 90%)' }
  ];

  return (
    <div className="space-y-8">
      {/* Overall Score and Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Overall Resilience</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">
              {Math.round(results.overallScore)}%
            </div>
            <Badge 
              variant="secondary" 
              className="text-sm"
              style={{ backgroundColor: getProfileColor(results.resilienceProfile), color: 'white' }}
            >
              {results.resilienceProfile}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Burnout Risk</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl mb-2">
              {results.burnoutRisk === 'low' ? '🟢' : 
               results.burnoutRisk === 'medium' ? '🟡' : '🔴'}
            </div>
            <div 
              className="text-2xl font-bold mb-2 capitalize"
              style={{ color: getRiskColor(results.burnoutRisk) }}
            >
              {results.burnoutRisk}
            </div>
            <p className="text-sm text-muted-foreground">
              Risk Level
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Stress Management</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl mb-2">
              {results.stressManagementLevel === 'excellent' ? '🌟' :
               results.stressManagementLevel === 'good' ? '✅' :
               results.stressManagementLevel === 'fair' ? '⚠️' : '🔄'}
            </div>
            <div 
              className="text-xl font-bold mb-2 capitalize"
              style={{ color: getLevelColor(results.stressManagementLevel) }}
            >
              {results.stressManagementLevel.replace('-', ' ')}
            </div>
            <p className="text-sm text-muted-foreground">
              Management Level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resilience Radar Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Resilience Profile Radar</CardTitle>
          <p className="text-center text-muted-foreground">
            Your resilience across all dimensions
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Resilience Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Dimension Breakdown */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Dimension Breakdown</CardTitle>
          <p className="text-muted-foreground">
            Detailed scores for each resilience dimension
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.dimensionScores.map((dimension, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{dimension.dimension}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    {Math.round(dimension.percentage)}%
                  </span>
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: getLevelColor(dimension.level),
                      color: 'white'
                    }}
                  >
                    {dimension.level.replace('-', ' ')}
                  </Badge>
                </div>
                <Progress 
                  value={dimension.percentage} 
                  className="h-3"
                />
                <div className="text-sm text-muted-foreground">
                  {dimension.score} / {dimension.maxScore} points
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700">💪 Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.strengths.length > 0 ? (
                results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  Focus on building foundational resilience skills
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-orange-700">🎯 Growth Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.challenges.length > 0 ? (
                results.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">△</span>
                    <span className="text-sm">{challenge}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  Continue developing all areas for optimal resilience
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StressResilienceVisualizer;