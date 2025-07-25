import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Calendar, Target, RefreshCw, BarChart3 } from "lucide-react";

interface AssessmentHistory {
  id: string;
  type: string;
  score: number;
  date: string;
  improvements?: string[];
}

interface ProgressTrackerProps {
  currentAssessment?: string;
  userId?: string;
}

const ProgressTracker = ({ currentAssessment, userId }: ProgressTrackerProps) => {
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage for now (would be from database in production)
      const stored = localStorage.getItem(`progress_${userId || 'anonymous'}`);
      if (stored) {
        setAssessmentHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = (newAssessment: AssessmentHistory) => {
    const updated = [...assessmentHistory, newAssessment];
    setAssessmentHistory(updated);
    localStorage.setItem(`progress_${userId || 'anonymous'}`, JSON.stringify(updated));
  };

  const getImprovementTrend = (assessmentType: string) => {
    const typeHistory = assessmentHistory
      .filter(h => h.type === assessmentType)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (typeHistory.length < 2) return null;
    
    const latest = typeHistory[typeHistory.length - 1];
    const previous = typeHistory[typeHistory.length - 2];
    const improvement = latest.score - previous.score;
    
    return {
      improvement,
      trend: improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'stable',
      previousScore: previous.score,
      latestScore: latest.score
    };
  };

  const getUniqueAssessmentTypes = () => {
    return [...new Set(assessmentHistory.map(h => h.type))];
  };

  const getLatestScoreForType = (type: string) => {
    const typeHistory = assessmentHistory.filter(h => h.type === type);
    return typeHistory.length > 0 ? typeHistory[typeHistory.length - 1].score : 0;
  };

  const getAverageImprovement = () => {
    const improvements = getUniqueAssessmentTypes()
      .map(type => getImprovementTrend(type))
      .filter(trend => trend !== null)
      .map(trend => trend!.improvement);
    
    if (improvements.length === 0) return 0;
    return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  };

  if (assessmentHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Progress Journey
          </CardTitle>
          <CardDescription>
            Track your growth across assessments and see your improvement over time
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-medium">Start Your Progress Journey</h3>
              <p className="text-muted-foreground text-sm">
                Complete your first assessment to begin tracking your development
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{assessmentHistory.length}</div>
                <div className="text-sm text-muted-foreground">Assessments Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {getAverageImprovement() > 0 ? '+' : ''}{getAverageImprovement().toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{getUniqueAssessmentTypes().length}</div>
                <div className="text-sm text-muted-foreground">Assessment Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress by Assessment Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progress by Assessment
          </CardTitle>
          <CardDescription>
            Your latest scores and improvement trends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {getUniqueAssessmentTypes().map(type => {
            const latestScore = getLatestScoreForType(type);
            const trend = getImprovementTrend(type);
            
            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{type.replace('-', ' ')}</span>
                    {trend && (
                      <Badge 
                        variant={trend.trend === 'up' ? 'default' : trend.trend === 'down' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {trend.improvement > 0 ? '+' : ''}{trend.improvement.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{latestScore}/100</span>
                </div>
                <Progress value={latestScore} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assessmentHistory
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((assessment, index) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{assessment.type.replace('-', ' ')}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(assessment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{assessment.score}</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Retake Suggestion */}
      {currentAssessment && assessmentHistory.some(h => h.type === currentAssessment) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">Ready for Another Challenge?</h4>
                <p className="text-sm text-muted-foreground">
                  Retake this assessment to track your improvement and see how much you've grown.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressTracker;