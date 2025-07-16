import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  Users, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp, 
  Shield, 
  Award,
  Download,
  Share,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AssessmentResultsProps {
  data: any;
}

const AssessmentResults = ({ data }: AssessmentResultsProps) => {
  const [overallScore, setOverallScore] = useState(0);
  const [resilienceProfile, setResilienceProfile] = useState("");
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data) {
      calculateScores();
    }
  }, [data]);

  const calculateScores = () => {
    // Simulate score calculation based on responses
    const responses = data.responses || {};
    const responseCount = Object.keys(responses).length;
    
    // Mock scoring algorithm
    const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    setOverallScore(mockScore);

    // Determine resilience profile
    const profiles = [
      { name: "Titanium", min: 90, color: "text-slate-600", bgColor: "bg-slate-100" },
      { name: "Steel", min: 80, color: "text-gray-600", bgColor: "bg-gray-100" },
      { name: "Iron", min: 70, color: "text-zinc-600", bgColor: "bg-zinc-100" },
      { name: "Copper", min: 60, color: "text-orange-600", bgColor: "bg-orange-100" },
      { name: "Bronze", min: 50, color: "text-amber-600", bgColor: "bg-amber-100" },
      { name: "Clay", min: 0, color: "text-red-600", bgColor: "bg-red-100" }
    ];

    const profile = profiles.find(p => mockScore >= p.min) || profiles[profiles.length - 1];
    setResilienceProfile(profile.name);

    // Mock dimension scores
    setDimensionScores({
      emotional: Math.floor(Math.random() * 30) + 70,
      cognitive: Math.floor(Math.random() * 30) + 70,
      physical: Math.floor(Math.random() * 30) + 70,
      social: Math.floor(Math.random() * 30) + 70,
      change: Math.floor(Math.random() * 30) + 70,
      performance: Math.floor(Math.random() * 30) + 70
    });
  };

  const dimensions = [
    {
      key: "emotional",
      title: "Emotional Resilience",
      description: "Emotional regulation under pressure",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      key: "cognitive", 
      title: "Cognitive Flexibility",
      description: "Problem-solving under stress",
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      key: "physical",
      title: "Physical Stress Response",
      description: "Energy management and recovery",
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      key: "social",
      title: "Social Support Utilization",
      description: "Help-seeking and network building",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      key: "change",
      title: "Change Adaptability",
      description: "Comfort with ambiguity and innovation",
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      key: "performance",
      title: "Performance Under Pressure",
      description: "Deadline management and crisis leadership",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Moderate";
    return "Needs Development";
  };

  const recommendations = [
    {
      category: "Stress Management",
      items: [
        "Practice daily mindfulness meditation",
        "Implement progressive muscle relaxation",
        "Develop breathing techniques for acute stress"
      ]
    },
    {
      category: "Cognitive Development",
      items: [
        "Practice scenario planning exercises",
        "Learn rapid decision-making frameworks",
        "Engage in strategic thinking games"
      ]
    },
    {
      category: "Physical Wellness",
      items: [
        "Maintain regular exercise routine",
        "Optimize sleep hygiene practices",
        "Monitor and manage energy levels"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Assessment Complete
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Your Resilience Profile</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based on your responses across multiple scenarios and stress conditions, 
              here's your comprehensive resilience assessment.
            </p>
          </div>

          {/* Overall Score Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Overall Resilience Score</CardTitle>
              <div className="flex items-center justify-center gap-4">
                <div className="text-6xl font-bold text-primary">{overallScore}</div>
                <div className="text-left">
                  <Badge className="mb-2 bg-primary text-primary-foreground">
                    {resilienceProfile} Level
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {getScoreDescription(overallScore)} resilience capacity
                  </p>
                </div>
              </div>
              <Progress value={overallScore} className="w-full max-w-md mx-auto mt-4" />
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dimensions.map((dimension) => (
                  <Card key={dimension.key} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${dimension.bgColor}`}>
                          <dimension.icon className={`h-5 w-5 ${dimension.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dimension.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-2xl font-bold ${getScoreColor(dimensionScores[dimension.key] || 0)}`}>
                              {dimensionScores[dimension.key] || 0}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {getScoreDescription(dimensionScores[dimension.key] || 0)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress 
                        value={dimensionScores[dimension.key] || 0} 
                        className="h-2 mb-2" 
                      />
                      <p className="text-sm text-muted-foreground">
                        {dimension.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Stress Threshold
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">High</div>
                    <p className="text-sm text-muted-foreground">
                      Can handle significant pressure before performance degradation
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-blue-500" />
                      Recovery Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">Fast</div>
                    <p className="text-sm text-muted-foreground">
                      Quickly returns to baseline after stressful events
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Burnout Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">Low</div>
                    <p className="text-sm text-muted-foreground">
                      Good protective factors against chronic stress
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="space-y-6">
              {dimensions.map((dimension) => (
                <Card key={dimension.key}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${dimension.bgColor}`}>
                          <dimension.icon className={`h-6 w-6 ${dimension.color}`} />
                        </div>
                        <div>
                          <CardTitle>{dimension.title}</CardTitle>
                          <CardDescription>{dimension.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(dimensionScores[dimension.key] || 0)}`}>
                          {dimensionScores[dimension.key] || 0}
                        </div>
                        <Badge variant="outline">
                          {getScoreDescription(dimensionScores[dimension.key] || 0)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={dimensionScores[dimension.key] || 0} className="mb-4" />
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Strong baseline capacity</li>
                          <li>• Good recovery patterns</li>
                          <li>• Effective coping strategies</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-orange-600">Growth Areas</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Practice under higher stress</li>
                          <li>• Develop backup strategies</li>
                          <li>• Build support networks</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Stress Response Pattern</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Initial Response</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Strong</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Peak Performance</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Maintained</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recovery Speed</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Fast</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Adaptability Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Change Acceptance</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">High</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Innovation Under Pressure</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Strong</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Learning from Setbacks</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Excellent</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Shield className="h-8 w-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-green-800">Protective Factors</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Strong emotional regulation and social support utilization
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-blue-800">Growth Indicators</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Consistent improvement under progressive stress loading
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <Target className="h-8 w-8 text-orange-600 mb-2" />
                      <h4 className="font-medium text-orange-800">Focus Areas</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Physical stress management and long-term sustainability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Development Tab */}
            <TabsContent value="development" className="space-y-6">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{rec.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {rec.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Immediate Actions (Next 30 days)</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Implement daily stress management techniques and begin resilience training exercises
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Target className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Medium-term Goals (3-6 months)</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Build support networks and practice advanced stress inoculation scenarios
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-800">Long-term Development (6+ months)</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Leadership roles in high-pressure situations and mentoring others in resilience
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
            <Button size="lg" variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button size="lg" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AssessmentResults;