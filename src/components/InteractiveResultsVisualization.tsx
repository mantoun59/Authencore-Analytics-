import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  PieChart, 
  Radar, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Share, 
  Download,
  Zap,
  Heart,
  Brain,
  Users
} from "lucide-react";

interface Dimension {
  name: string;
  score: number;
  description: string;
  level: string;
  color?: string;
}

interface InteractiveResultsVisualizationProps {
  dimensions: Dimension[];
  overallScore: number;
  assessmentType: string;
  strengths: string[];
  improvementAreas: string[];
}

const InteractiveResultsVisualization = ({
  dimensions,
  overallScore,
  assessmentType,
  strengths,
  improvementAreas
}: InteractiveResultsVisualizationProps) => {
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);
  const [viewMode, setViewMode] = useState<'bars' | 'radar' | 'comparison'>('bars');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Developing';
    return 'Needs Focus';
  };

  const getDimensionIcon = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'emotional': Heart,
      'cognitive': Brain,
      'social': Users,
      'leadership': Target,
      'communication': Users,
      'resilience': Zap,
      'innovation': Lightbulb,
      'conscientiousness': Target,
      'agreeableness': Heart
    };
    
    const iconKey = Object.keys(iconMap).find(key => 
      name.toLowerCase().includes(key)
    );
    
    return iconKey ? iconMap[iconKey] : Target;
  };

  const generateInsight = (dimension: Dimension) => {
    const insights = {
      high: [
        `Your ${dimension.name.toLowerCase()} shows excellent development.`,
        `You demonstrate strong capabilities in ${dimension.name.toLowerCase()}.`,
        `This is a clear strength that sets you apart.`
      ],
      medium: [
        `Your ${dimension.name.toLowerCase()} is developing well.`,
        `You show good potential in ${dimension.name.toLowerCase()}.`,
        `This area has room for strategic improvement.`
      ],
      low: [
        `Focus on developing your ${dimension.name.toLowerCase()} skills.`,
        `This area presents a growth opportunity.`,
        `Consider targeted development in ${dimension.name.toLowerCase()}.`
      ]
    };
    
    const level = dimension.score >= 70 ? 'high' : dimension.score >= 50 ? 'medium' : 'low';
    const relevantInsights = insights[level];
    return relevantInsights[Math.floor(Math.random() * relevantInsights.length)];
  };

  const BarChartView = () => (
    <div className="space-y-4">
      {dimensions.map((dim, index) => {
        const IconComponent = getDimensionIcon(dim.name);
        return (
          <div 
            key={index} 
            className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedDimension(dim)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <span className="font-medium">{dim.name}</span>
              </div>
              <Badge className={getScoreColor(dim.score)}>
                {dim.score}/100
              </Badge>
            </div>
            <Progress value={dim.score} className="h-3 mb-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{getScoreLevel(dim.score)}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDimension(dim)}>
                View Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const RadarChartView = () => (
    <div className="relative p-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Competency Radar</h3>
        <p className="text-muted-foreground">Visual overview of your strengths and development areas</p>
      </div>
      
      {/* Simplified radar representation */}
      <div className="grid grid-cols-2 gap-4">
        {dimensions.map((dim, index) => {
          const IconComponent = getDimensionIcon(dim.name);
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium text-sm">{dim.name}</h4>
                <div className="text-2xl font-bold text-primary mt-1">{dim.score}</div>
                <Progress value={dim.score} className="h-2 mt-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const ComparisonView = () => {
    const avgScore = dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Performance Comparison</h3>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{overallScore}</div>
              <div className="text-sm text-muted-foreground">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground">{avgScore.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-green-600">Top Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {strengths.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base text-blue-600">Growth Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {improvementAreas.slice(0, 3).map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Your {assessmentType} Results</h2>
            <div className="text-4xl font-bold text-primary mb-2">{overallScore}/100</div>
            <Badge className={getScoreColor(overallScore)} variant="secondary">
              {getScoreLevel(overallScore)} Performance
            </Badge>
            <p className="text-muted-foreground mt-2">
              Interactive visualization of your assessment results
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Controls */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bars" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Detailed View
          </TabsTrigger>
          <TabsTrigger value="radar" className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bars" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Dimension Analysis</CardTitle>
              <CardDescription>
                Click on any dimension to explore detailed insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="mt-6">
          <Card>
            <CardContent>
              <RadarChartView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <ComparisonView />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dimension Detail Modal */}
      {selectedDimension && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const IconComponent = getDimensionIcon(selectedDimension.name);
                  return <IconComponent className="h-5 w-5 text-primary" />;
                })()}
                {selectedDimension.name}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDimension(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">{selectedDimension.score}/100</div>
              <Badge className={getScoreColor(selectedDimension.score)}>
                {getScoreLevel(selectedDimension.score)}
              </Badge>
            </div>
            
            <Progress value={selectedDimension.score} className="h-4" />
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-muted-foreground text-sm">{selectedDimension.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">AI Insight</h4>
                <p className="text-muted-foreground text-sm">{generateInsight(selectedDimension)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Share Results
        </Button>
      </div>
    </div>
  );
};

export default InteractiveResultsVisualization;