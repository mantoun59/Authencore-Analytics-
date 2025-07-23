import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployer } from '@/contexts/EmployerContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Building, 
  TrendingUp,
  FileText,
  Calendar,
  Download,
  BarChart3,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EmployerAnalytics = () => {
  const { employer, getCandidates } = useEmployer();
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!employer) {
      navigate('/employer-login');
      return;
    }
    loadAnalytics();
  }, [employer, navigate, timeRange]);

  const loadAnalytics = async () => {
    if (!employer) return;
    
    try {
      setLoading(true);
      
      // Calculate date filter
      const daysAgo = parseInt(timeRange);
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - daysAgo);

      // Get employer's candidates
      const candidates = await getCandidates();
      const filteredCandidates = candidates.filter((c: any) => 
        c.created_at && new Date(c.created_at) >= dateFilter
      );

      // Calculate metrics
      const totalCandidates = filteredCandidates.length;
      const completedAssessments = filteredCandidates.filter(c => c.assessment_completed).length;
      const pendingAssessments = totalCandidates - completedAssessments;
      const completionRate = totalCandidates > 0 ? (completedAssessments / totalCandidates) * 100 : 0;

      // Demographics
      const countries = filteredCandidates
        .filter((c: any) => c.country)
        .reduce((acc: any, c: any) => {
          acc[c.country] = (acc[c.country] || 0) + 1;
          return acc;
        }, {});

      const genders = filteredCandidates
        .filter((c: any) => c.gender)
        .reduce((acc: any, c: any) => {
          acc[c.gender] = (acc[c.gender] || 0) + 1;
          return acc;
        }, {});

      const positions = filteredCandidates
        .filter((c: any) => c.position_applied)
        .reduce((acc: any, c: any) => {
          acc[c.position_applied] = (acc[c.position_applied] || 0) + 1;
          return acc;
        }, {});

      // Time-based metrics
      const last7Days = candidates.filter((c: any) => 
        c.created_at && new Date(c.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      const avgTimeToComplete = completedAssessments > 0 ? 
        filteredCandidates
          .filter((c: any) => c.assessment_completed && c.completed_at && c.invited_at)
          .reduce((sum, c: any) => sum + (new Date(c.completed_at).getTime() - new Date(c.invited_at).getTime()), 0) / completedAssessments / (1000 * 60 * 60 * 24) : 0;

      setAnalytics({
        totalCandidates,
        completedAssessments,
        pendingAssessments,
        completionRate,
        countries,
        genders,
        positions,
        weeklyGrowth: last7Days.length,
        avgTimeToComplete: avgTimeToComplete.toFixed(1),
        candidates: filteredCandidates,
        recentCompletions: filteredCandidates
          .filter((c: any) => c.assessment_completed && c.completed_at)
          .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
          .slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const exportData = async () => {
    try {
      const csvData = [
        ['Name', 'Email', 'Position', 'Status', 'Invited', 'Completed'],
        ...analytics.candidates.map((c: any) => [
          c.full_name || 'N/A',
          c.email,
          c.position_applied || 'N/A',
          c.assessment_completed ? 'Completed' : 'Pending',
          c.invited_at,
          c.completed_at || 'N/A'
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${employer.name}_candidate_analytics.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (!employer) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/employer-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Candidate insights for {employer.name} - Last {timeRange} days
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshData} variant="outline" disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">
                Invited in selected period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.completedAssessments}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.completionRate.toFixed(1)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.pendingAssessments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgTimeToComplete}</div>
              <p className="text-xs text-muted-foreground">
                Days from invite to completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
                  <CardDescription>Assessment completion progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Completed</span>
                        <span>{analytics.completedAssessments}</span>
                      </div>
                      <Progress value={analytics.completionRate} className="h-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{analytics.completionRate.toFixed(1)}%</div>
                      <p className="text-sm text-muted-foreground">Overall completion rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Growth</CardTitle>
                  <CardDescription>New candidates this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">+{analytics.weeklyGrowth}</div>
                    <p className="text-sm text-muted-foreground">Candidates added in last 7 days</p>
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Countries</CardTitle>
                  <CardDescription>Candidate distribution by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.countries || {}).slice(0, 5).map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm">{country}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                    {Object.keys(analytics.countries || {}).length === 0 && (
                      <p className="text-sm text-muted-foreground">No country data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Candidate breakdown by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.genders || {}).map(([gender, count]) => (
                      <div key={gender} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{gender}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                    {Object.keys(analytics.genders || {}).length === 0 && (
                      <p className="text-sm text-muted-foreground">No gender data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Positions Applied</CardTitle>
                <CardDescription>Most popular positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.positions || {}).slice(0, 10).map(([position, count]) => (
                    <div key={position} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{position}</span>
                      <Badge variant="secondary">{count as number} candidates</Badge>
                    </div>
                  ))}
                  {Object.keys(analytics.positions || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground">No position data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Completions</CardTitle>
                <CardDescription>Latest assessment completions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentCompletions?.map((candidate: any) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{candidate.full_name || candidate.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {candidate.position_applied && `${candidate.position_applied} • `}
                          Completed {new Date(candidate.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="default">Completed</Badge>
                    </div>
                  ))}
                  {(!analytics.recentCompletions || analytics.recentCompletions.length === 0) && (
                    <p className="text-sm text-muted-foreground">No recent completions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default EmployerAnalytics;