import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, TrendingUp, Target, Zap, Users, Brain, Shield, Eye } from "lucide-react";
import { CommunicationStylesResults } from "@/hooks/useCommunicationStylesScoring";

interface CommunicationStylesVisualizerProps {
  results: CommunicationStylesResults;
}

const CommunicationStylesVisualizer: React.FC<CommunicationStylesVisualizerProps> = ({ results }) => {
  const getDimensionIcon = (dimension: string) => {
    const icons = {
      assertiveness: Target,
      expressiveness: MessageSquare,
      informationProcessing: Brain,
      channelPreferences: Zap,
      listeningPatterns: Eye,
      influenceStrategies: TrendingUp,
      conflictCommunication: Shield
    };
    return icons[dimension as keyof typeof icons] || MessageSquare;
  };

  const getDimensionColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const RadarChart = ({ dimensions }: { dimensions: Record<string, any> }) => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const angles = Object.keys(dimensions).map((_, i) => (i * 360) / Object.keys(dimensions).length);
    
    const points = Object.values(dimensions).map((dim: any, i) => {
      const angle = (angles[i] - 90) * (Math.PI / 180);
      const distance = (dim.score / 100) * radius;
      return {
        x: center + distance * Math.cos(angle),
        y: center + distance * Math.sin(angle)
      };
    });

    const pathData = points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    // Create grid circles
    const gridCircles = [20, 40, 60, 80, 100].map(percent => (
      <circle
        key={percent}
        cx={center}
        cy={center}
        r={(percent / 100) * radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
        opacity="0.5"
      />
    ));

    // Create axis lines
    const axisLines = angles.map((angle, i) => {
      const endAngle = (angle - 90) * (Math.PI / 180);
      const endX = center + radius * Math.cos(endAngle);
      const endY = center + radius * Math.sin(endAngle);
      
      return (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={endX}
          y2={endY}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    });

    // Labels
    const labels = Object.keys(dimensions).map((key, i) => {
      const angle = (angles[i] - 90) * (Math.PI / 180);
      const labelDistance = radius + 25;
      const x = center + labelDistance * Math.cos(angle);
      const y = center + labelDistance * Math.sin(angle);
      
      return (
        <text
          key={key}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-slate-600"
          fontSize="11"
        >
          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </text>
      );
    });

    return (
      <div className="flex justify-center">
        <svg width={size + 50} height={size + 50} viewBox={`0 0 ${size + 50} ${size + 50}`}>
          <g transform="translate(25, 25)">
            {gridCircles}
            {axisLines}
            <path
              d={pathData}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
              />
            ))}
            {labels}
          </g>
        </svg>
      </div>
    );
  };

  const BarChart = ({ data, title }: { data: Record<string, number>; title: string }) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-slate-700">{title}</h4>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="font-medium">{Math.round(value)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${getProgressColor(value)}`}
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const CircularProgress = ({ score, label, size = 120 }: { score: number; label: string; size?: number }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r="45"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-slate-700">{Math.round(score)}%</span>
          </div>
        </div>
        <span className="text-sm text-slate-600 text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overall Communication Effectiveness */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Communication Profile Overview
          </CardTitle>
          <CardDescription className="text-lg">
            {results.profile.type} Style • {results.profile.primary}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <CircularProgress 
              score={results.overallScore} 
              label="Overall Effectiveness"
              size={140}
            />
            <CircularProgress 
              score={results.communicationEffectivenessIndex} 
              label="Communication Index"
              size={140}
            />
            <CircularProgress 
              score={results.adaptabilityScore} 
              label="Adaptability Score"
              size={140}
            />
          </div>
        </CardContent>
      </Card>

      {/* Communication Dimensions Radar */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-600" />
            Communication Dimensions Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive view of your communication strengths across all dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadarChart dimensions={results.dimensions} />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.dimensions).map(([key, dimension]) => {
              const Icon = getDimensionIcon(key);
              return (
                <div 
                  key={key}
                  className={`p-4 rounded-lg border-2 ${getDimensionColor(dimension.score)}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={dimension.score} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span>{dimension.level}</span>
                      <span>{Math.round(dimension.score)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contextual Effectiveness */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-green-600" />
            Contextual Effectiveness
          </CardTitle>
          <CardDescription>
            How your communication style performs in different workplace contexts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={results.contextualEffectiveness} title="Performance by Context" />
        </CardContent>
      </Card>

      {/* Communication Profile Details */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-orange-600" />
            Detailed Profile Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Key Strengths</h4>
                <p className="text-slate-600 text-sm">{results.profile.strength}</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Work Style</h4>
                <p className="text-slate-600 text-sm">{results.profile.workStyle}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Development Areas</h4>
                <p className="text-slate-600 text-sm">{results.profile.challenge}</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-700 mb-2">Secondary Traits</h4>
                <p className="text-slate-600 text-sm">{results.profile.secondary}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Recommendations */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Development Recommendations
          </CardTitle>
          <CardDescription>
            Prioritized areas for communication skill enhancement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.developmentAreas.map((area, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    Priority {index + 1}
                  </Badge>
                  <h4 className="font-semibold text-slate-800">{area.priority}</h4>
                </div>
                <p className="text-slate-600 text-sm mb-3">{area.description}</p>
                <div className="space-y-1">
                  {area.actionItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Validity */}
      {results.distortionAnalysis && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-slate-600" />
              Assessment Validity Analysis
            </CardTitle>
            <CardDescription>
              Quality and reliability indicators for this assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reliability</span>
                  <Badge 
                    variant={results.distortionAnalysis.reliability === 'High' ? 'default' : 'secondary'}
                  >
                    {results.distortionAnalysis.reliability}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consistency Check</span>
                  <span className="text-sm text-slate-600">
                    {results.distortionAnalysis.consistencyCheck}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Pattern</span>
                  <span className="text-sm text-slate-600">
                    {results.distortionAnalysis.responseTimePattern}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-slate-700">Quality Indicators</h4>
                {results.distortionAnalysis.indicators.length > 0 ? (
                  results.distortionAnalysis.indicators.map((indicator, index) => (
                    <div key={index} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                      {indicator}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    No quality concerns detected
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunicationStylesVisualizer;