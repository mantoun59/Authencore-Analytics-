import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageSquare, TrendingUp, Target, Zap, Users, Brain, Shield, Eye, BarChart3, PieChart } from "lucide-react";
import { CommunicationStylesResults } from "@/hooks/useCommunicationStylesScoring";

interface EnhancedCommunicationStylesVisualizerProps {
  results: CommunicationStylesResults;
}

const EnhancedCommunicationStylesVisualizer: React.FC<EnhancedCommunicationStylesVisualizerProps> = ({ results }) => {
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

  // Enhanced CEI Visualization Component
  const CEIRadialChart = ({ cei, clarity, empathy, adaptability, influence }: {
    cei: number;
    clarity: number;
    empathy: number;
    adaptability: number;
    influence: number;
  }) => {
    const size = 200;
    const center = size / 2;
    const radius = 70;
    
    const components = [
      { name: 'Clarity', value: clarity, color: '#3b82f6' },
      { name: 'Empathy', value: empathy, color: '#10b981' },
      { name: 'Adaptability', value: adaptability, color: '#f59e0b' },
      { name: 'Influence', value: influence, color: '#8b5cf6' }
    ];

    const angles = components.map((_, i) => (i * 360) / components.length);
    
    const points = components.map((comp, i) => {
      const angle = (angles[i] - 90) * (Math.PI / 180);
      const distance = (comp.value / 100) * radius;
      return {
        x: center + distance * Math.cos(angle),
        y: center + distance * Math.sin(angle),
        ...comp
      };
    });

    const pathData = points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Grid circles */}
            {[20, 40, 60, 80, 100].map(percent => (
              <circle
                key={percent}
                cx={center}
                cy={center}
                r={(percent / 100) * radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity="0.3"
              />
            ))}
            
            {/* Axis lines */}
            {angles.map((angle, i) => {
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
                  opacity="0.3"
                />
              );
            })}

            {/* CEI Area */}
            <path
              d={pathData}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* Data points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={point.color}
              />
            ))}

            {/* CEI Score in center */}
            <text
              x={center}
              y={center - 5}
              textAnchor="middle"
              className="text-lg font-bold fill-slate-700"
            >
              {Math.round(cei)}
            </text>
            <text
              x={center}
              y={center + 15}
              textAnchor="middle"
              className="text-xs fill-slate-600"
            >
              CEI Score
            </text>
          </svg>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {components.map((comp, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: comp.color }}
              ></div>
              <span>{comp.name}: {Math.round(comp.value)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Assertiveness vs Expressiveness Matrix
  const CommunicationMatrix = ({ assertiveness, expressiveness, profileType }: {
    assertiveness: number;
    expressiveness: number;
    profileType: string;
  }) => {
    const size = 250;
    const margin = 30;
    const chartSize = size - (margin * 2);
    
    // Position on the matrix
    const x = margin + (assertiveness / 100) * chartSize;
    const y = margin + ((100 - expressiveness) / 100) * chartSize; // Inverted Y for proper quadrant display

    const quadrants = [
      { name: 'Director', x: margin + chartSize * 0.75, y: margin + chartSize * 0.25, color: '#ef4444' },
      { name: 'Socializer', x: margin + chartSize * 0.75, y: margin + chartSize * 0.75, color: '#f59e0b' },
      { name: 'Thinker', x: margin + chartSize * 0.25, y: margin + chartSize * 0.25, color: '#3b82f6' },
      { name: 'Supporter', x: margin + chartSize * 0.25, y: margin + chartSize * 0.75, color: '#10b981' }
    ];

    return (
      <div className="flex flex-col items-center space-y-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background quadrants */}
          <rect x={margin} y={margin} width={chartSize/2} height={chartSize/2} fill="#f1f5f9" opacity="0.3" />
          <rect x={margin + chartSize/2} y={margin} width={chartSize/2} height={chartSize/2} fill="#fef3c7" opacity="0.3" />
          <rect x={margin} y={margin + chartSize/2} width={chartSize/2} height={chartSize/2} fill="#dcfce7" opacity="0.3" />
          <rect x={margin + chartSize/2} y={margin + chartSize/2} width={chartSize/2} height={chartSize/2} fill="#fef2f2" opacity="0.3" />
          
          {/* Grid lines */}
          <line x1={margin} y1={margin + chartSize/2} x2={margin + chartSize} y2={margin + chartSize/2} stroke="#d1d5db" strokeWidth="1" />
          <line x1={margin + chartSize/2} y1={margin} x2={margin + chartSize/2} y2={margin + chartSize} stroke="#d1d5db" strokeWidth="1" />
          
          {/* Axes */}
          <line x1={margin} y1={margin} x2={margin} y2={margin + chartSize} stroke="#6b7280" strokeWidth="2" />
          <line x1={margin} y1={margin + chartSize} x2={margin + chartSize} y2={margin + chartSize} stroke="#6b7280" strokeWidth="2" />
          
          {/* Quadrant labels */}
          {quadrants.map((quad, i) => (
            <text
              key={i}
              x={quad.x}
              y={quad.y}
              textAnchor="middle"
              className="text-xs font-semibold"
              fill={quad.color}
            >
              {quad.name}
            </text>
          ))}
          
          {/* User position */}
          <circle
            cx={x}
            cy={y}
            r="6"
            fill="#1f2937"
            stroke="#fff"
            strokeWidth="2"
          />
          
          {/* Axis labels */}
          <text x={margin - 20} y={margin + 10} textAnchor="middle" className="text-xs fill-slate-600" transform={`rotate(-90, ${margin - 20}, ${margin + 10})`}>
            Expressiveness
          </text>
          <text x={margin + chartSize/2} y={size - 5} textAnchor="middle" className="text-xs fill-slate-600">
            Assertiveness
          </text>
        </svg>
        
        <div className="text-center">
          <Badge variant="outline" className="text-sm">
            {profileType} Profile
          </Badge>
          <p className="text-xs text-slate-600 mt-1">
            A: {Math.round(assertiveness)}% | E: {Math.round(expressiveness)}%
          </p>
        </div>
      </div>
    );
  };

  // Enhanced Adaptability Gauge
  const AdaptabilityGauge = ({ score }: { score: number }) => {
    const size = 180;
    const center = size / 2;
    const radius = 70;
    const strokeWidth = 12;
    
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference * 0.75; // 270 degrees
    const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;
    
    const angle = -135 + (score / 100) * 270; // Start at -135 degrees
    const needleX = center + (radius - 20) * Math.cos((angle * Math.PI) / 180);
    const needleY = center + (radius - 20) * Math.sin((angle * Math.PI) / 180);

    const getAdaptabilityLevel = (score: number) => {
      if (score >= 85) return { level: "Highly Adaptive", color: "#10b981" };
      if (score >= 70) return { level: "Adaptive", color: "#3b82f6" };
      if (score >= 55) return { level: "Moderately Adaptive", color: "#f59e0b" };
      return { level: "Developing", color: "#ef4444" };
    };

    const { level, color } = getAdaptabilityLevel(score);

    return (
      <div className="flex flex-col items-center space-y-4">
        <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
          {/* Background arc */}
          <path
            d={`M ${center - radius + strokeWidth/2} ${center} A ${radius - strokeWidth/2} ${radius - strokeWidth/2} 0 0 1 ${center + radius - strokeWidth/2} ${center}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <path
            d={`M ${center - radius + strokeWidth/2} ${center} A ${radius - strokeWidth/2} ${radius - strokeWidth/2} 0 0 1 ${center + radius - strokeWidth/2} ${center}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-135 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
          
          {/* Needle */}
          <line
            x1={center}
            y1={center}
            x2={needleX}
            y2={needleY}
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Center dot */}
          <circle
            cx={center}
            cy={center}
            r="4"
            fill="#1f2937"
          />
          
          {/* Score text */}
          <text
            x={center}
            y={center + 25}
            textAnchor="middle"
            className="text-2xl font-bold"
            fill={color}
          >
            {Math.round(score)}%
          </text>
        </svg>
        
        <div className="text-center">
          <Badge style={{ backgroundColor: color, color: 'white' }} className="text-sm">
            {level}
          </Badge>
        </div>
      </div>
    );
  };

  // Calculate CEI components
  const clarity = (results.dimensions.assertiveness.score + results.dimensions.informationProcessing.score) / 2;
  const empathy = (results.dimensions.listeningPatterns.score + results.dimensions.expressiveness.score) / 2;
  const adaptability = results.dimensions.channelPreferences.score;
  const influence = results.dimensions.influenceStrategies.score;

  return (
    <div className="space-y-8">
      {/* Enhanced Overview with Three Key Metrics */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Enhanced Communication Analytics
          </CardTitle>
          <CardDescription className="text-lg">
            {results.profile.type} Style • Advanced Visual Analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* CEI Radial Chart */}
            <div className="text-center">
              <h4 className="font-semibold text-slate-800 mb-4">Communication Effectiveness Index</h4>
              <CEIRadialChart 
                cei={results.communicationEffectivenessIndex}
                clarity={clarity}
                empathy={empathy}
                adaptability={adaptability}
                influence={influence}
              />
            </div>
            
            {/* Communication Matrix */}
            <div className="text-center">
              <h4 className="font-semibold text-slate-800 mb-4">Communication Style Matrix</h4>
              <CommunicationMatrix 
                assertiveness={results.dimensions.assertiveness.score}
                expressiveness={results.dimensions.expressiveness.score}
                profileType={results.profile.type}
              />
            </div>
            
            {/* Adaptability Gauge */}
            <div className="text-center">
              <h4 className="font-semibold text-slate-800 mb-4">Adaptability Assessment</h4>
              <AdaptabilityGauge score={results.adaptabilityScore} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Dimension Analysis with Enhanced Visuals */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-purple-600" />
            Comprehensive Dimension Breakdown
          </CardTitle>
          <CardDescription>
            Detailed analysis of each communication dimension with contextual insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(results.dimensions).map(([key, dimension]) => {
              const Icon = getDimensionIcon(key);
              const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div 
                  key={key}
                  className={`p-6 rounded-lg border-2 ${getDimensionColor(dimension.score)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-white bg-opacity-50">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{displayName}</span>
                      <p className="text-xs opacity-75">{dimension.level}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Progress value={dimension.score} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span>Score: {Math.round(dimension.score)}%</span>
                      <span>Percentile: {dimension.percentile}th</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {dimension.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Contextual Effectiveness */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-green-600" />
            Contextual Performance Analysis
          </CardTitle>
          <CardDescription>
            Communication effectiveness across different workplace scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results.contextualEffectiveness).map(([context, score]) => {
              const displayName = context.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              const barColor = getProgressColor(score);
              
              return (
                <div key={context} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">{displayName}</span>
                    <Badge variant={score >= 70 ? "default" : score >= 50 ? "secondary" : "destructive"}>
                      {Math.round(score)}%
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={score} className="h-3" />
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${barColor}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    {score >= 80 ? "Excellent performance expected" :
                     score >= 60 ? "Good performance with potential for growth" :
                     score >= 40 ? "Moderate effectiveness, development recommended" :
                     "Significant development opportunity"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Development Recommendations */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Personalized Development Roadmap
          </CardTitle>
          <CardDescription>
            AI-enhanced recommendations based on your communication profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.developmentAreas.map((area, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-6 py-4 bg-gradient-to-r from-indigo-50 to-transparent rounded-r">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="text-xs font-semibold">
                    Priority {index + 1}
                  </Badge>
                  <h4 className="font-semibold text-slate-800">{area.priority}</h4>
                  <div className="flex-1 border-b border-dotted border-slate-300"></div>
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{area.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {area.actionItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-2 text-sm text-slate-600 bg-white p-3 rounded border">
                      <span className="text-indigo-500 mt-1 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assessment Validity */}
      {results.distortionAnalysis && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-slate-600" />
              Advanced Assessment Quality Metrics
            </CardTitle>
            <CardDescription>
              Comprehensive reliability and validity analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Reliability Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Reliability</span>
                    <Badge 
                      variant={results.distortionAnalysis.reliability === 'High' ? 'default' : 
                               results.distortionAnalysis.reliability === 'Moderate' ? 'secondary' : 'destructive'}
                    >
                      {results.distortionAnalysis.reliability}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consistency</span>
                    <span className="text-sm font-medium">{results.distortionAnalysis.consistencyCheck}%</span>
                  </div>
                  <Progress value={results.distortionAnalysis.consistencyCheck} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Response Patterns</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pattern Analysis</span>
                    <span className="text-sm font-medium">{results.distortionAnalysis.responseTimePattern}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Extreme Patterns</span>
                    <span className="text-sm font-medium">{results.distortionAnalysis.extremePatterns}%</span>
                  </div>
                  <Progress value={results.distortionAnalysis.extremePatterns} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Quality Indicators</h4>
                {results.distortionAnalysis.indicators.length > 0 ? (
                  <div className="space-y-2">
                    {results.distortionAnalysis.indicators.slice(0, 3).map((indicator, index) => (
                      <div key={index} className="text-xs text-amber-700 bg-amber-50 p-2 rounded border-l-2 border-amber-400">
                        {indicator}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-green-700 bg-green-50 p-3 rounded border-l-2 border-green-400">
                    ✓ No quality concerns detected - Assessment appears highly reliable
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

export default EnhancedCommunicationStylesVisualizer;