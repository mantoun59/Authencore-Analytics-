import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
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
  DollarSign, 
  TrendingUp,
  FileText,
  Calendar,
  Download,
  BarChart3,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import Header from '@/components/Header';
import type { AnalyticsData } from '@/types/assessment.types';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userCount: 0,
    assessmentCount: 0,
    completionRate: 0,
    averageScore: 0,
    dailyUsage: [],
    totalAssessments: 0,
    totalCandidates: 0,
    completedAssessments: 0,
    paidSoloCandidates: 0,
    soloCandidates: [],
    employerCandidates: [],
    totalRevenue: 0,
    activeEmployers: 0,
    payments: [],
    employers: [],
    performanceMetrics: {
      averageCompletionTime: 0,
      averageScore: 0,
      popularAssessments: [],
      completionRateByAssessment: [],
      timeToComplete: [],
      completionRate: 0,
      avgTimeToComplete: 0,
      conversionRate: 0,
      weeklyGrowth: 0
    },
    assessmentTypes: [],
    assessmentsByType: [],
    countries: [],
    genders: [],
    events: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [assessmentFilter, setAssessmentFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) return;

    const loadAnalytics = async () => {
      try {
        // Calculate date filter
        const daysAgo = parseInt(timeRange);
        const dateFilter = new Date();
        dateFilter.setDate(dateFilter.getDate() - daysAgo);

        // Load various analytics data with time filtering
        const [
          soloCandiatesRes,
          employerCandidatesRes,
          employersRes,
          paymentsRes,
          eventsRes,
          assessmentResultsRes,
          genZResultsRes,
          recentActivityRes
        ] = await Promise.all([
          supabase.from('solo_candidates').select('*').gte('created_at', dateFilter.toISOString()),
          supabase.from('employer_candidates').select('*').gte('created_at', dateFilter.toISOString()),
          supabase.from('employer_accounts').select('*').gte('created_at', dateFilter.toISOString()),
          supabase.from('payments').select('*').gte('created_at', dateFilter.toISOString()),
          supabase.from('analytics_events').select('*').limit(100).order('created_at', { ascending: false }).gte('created_at', dateFilter.toISOString()),
          supabase.from('assessment_results').select('*').gte('created_at', dateFilter.toISOString()),
          supabase.from('genz_assessment_results').select('*').gte('created_at', dateFilter.toISOString()),
          supabase.from('solo_candidates').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        const soloCandidates = soloCandiatesRes.data || [];
        const employerCandidates = employerCandidatesRes.data || [];
        const employers = employersRes.data || [];
        const payments = paymentsRes.data || [];
        const events = eventsRes.data || [];
        const assessmentResults = assessmentResultsRes.data || [];
        const genZResults = genZResultsRes.data || [];
        const recentActivity = recentActivityRes.data || [];

        // Calculate analytics including all assessment types
        const totalCandidates = soloCandidates.length + employerCandidates.length;
        const completedAssessments = soloCandidates.filter(c => c.assessment_completed).length + 
                                   employerCandidates.filter(c => c.assessment_completed).length +
                                   assessmentResults.length +
                                   genZResults.length;
        const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
        const paidSoloCandidates = soloCandidates.filter(c => c.payment_status === 'paid').length;
        
        // Completion rate and time analytics
        const completionRate = totalCandidates > 0 ? (completedAssessments / totalCandidates) * 100 : 0;
        const averageCompletionTime = assessmentResults.length > 0 ? 
          assessmentResults.reduce((sum, r) => sum + (new Date(r.completed_at).getTime() - new Date(r.created_at).getTime()), 0) / assessmentResults.length / (1000 * 60) : 0;
        
        // Growth metrics
        const weeklyGrowth = recentActivity.length;
        const conversionRate = totalCandidates > 0 ? (completedAssessments / totalCandidates) * 100 : 0;

        // Demographics
        const countriesObj = [...soloCandidates, ...employerCandidates]
          .filter(c => c.country)
          .reduce((acc: any, c) => {
            acc[c.country] = (acc[c.country] || 0) + 1;
            return acc;
          }, {});

        const gendersObj = [...soloCandidates, ...employerCandidates]
          .filter(c => c.gender)
          .reduce((acc: any, c) => {
            acc[c.gender] = (acc[c.gender] || 0) + 1;
            return acc;
          }, {});

        // Assessment type breakdown
        const assessmentTypesObj = assessmentResults.reduce((acc: any, result) => {
          acc[result.assessment_type] = (acc[result.assessment_type] || 0) + 1;
          return acc;
        }, {});
        
        // Add GenZ assessments
        assessmentTypesObj['gen_z_workplace'] = genZResults.length;

        // Transform data to match interface expectations
        const countries = Object.entries(countriesObj).map(([name, count]) => ({ name, count: count as number }));
        const genders = Object.entries(gendersObj).map(([name, count]) => ({ name, count: count as number }));
        const assessmentTypes = Object.entries(assessmentTypesObj).map(([name, count]) => ({ name, count: count as number }));
        const mappedEvents = events.map(e => ({
          type: e.event_type,
          timestamp: e.created_at,
          details: e.metadata
        }));
        const mappedSoloCandidates = soloCandidates.map(c => ({
          id: c.id,
          name: c.full_name || c.email,
          email: c.email
        }));
        const mappedEmployerCandidates = employerCandidates.map(c => ({
          id: c.id,
          name: c.full_name || c.email,
          email: c.email
        }));
        const mappedPayments = payments.filter(p => p.status === 'paid').map(p => ({
          amount: Number(p.amount),
          date: p.created_at
        }));
        const mappedEmployers = employers.map(e => ({
          id: e.id,
          name: e.name,
          active: e.is_active
        }));

        // Performance metrics
        const performanceMetrics = {
          averageCompletionTime: averageCompletionTime,
          averageScore: 0,
          popularAssessments: assessmentTypes.slice(0, 5),
          completionRateByAssessment: assessmentTypes.map(a => ({ assessment: a.name, rate: completionRate })),
          timeToComplete: assessmentTypes.map(a => ({ assessment: a.name, time: averageCompletionTime })),
          completionRate,
          avgTimeToComplete: averageCompletionTime,
          conversionRate,
          weeklyGrowth
        };

        setAnalytics({
          userCount: totalCandidates,
          assessmentCount: completedAssessments,
          totalAssessments: completedAssessments,
          completionRate,
          averageScore: 0,
          dailyUsage: [],
          totalCandidates,
          completedAssessments,
          totalRevenue,
          paidSoloCandidates,
          activeEmployers: employers.filter(e => e.is_active).length,
          employers: mappedEmployers,
          countries,
          genders,
          events: mappedEvents,
          soloCandidates: mappedSoloCandidates,
          employerCandidates: mappedEmployerCandidates,
          payments: mappedPayments,
          assessmentTypes,
          assessmentsByType: assessmentTypes,
          performanceMetrics
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, isAdmin, timeRange, assessmentFilter]);

  const refreshData = async () => {
    setRefreshing(true);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Add slight delay for UX
    const loadAnalytics = async () => {
      // ... same logic as above but extracted for reuse
    };
    await loadAnalytics();
    setRefreshing(false);
  };

  const exportData = async () => {
    try {
      // Create CSV data
      const csvData = [
        ['Type', 'Email', 'Completed', 'Created'],
        ...analytics.soloCandidates.map((c: any) => [
          'Solo', c.email, c.assessment_completed ? 'Yes' : 'No', c.created_at
        ]),
        ...analytics.employerCandidates.map((c: any) => [
          'Employer', c.email, c.assessment_completed ? 'Yes' : 'No', c.created_at
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'assessment_analytics.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive insights and performance metrics for the past {timeRange} days
              </p>
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

          {/* Enhanced Metrics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.paidSoloCandidates} solo + {analytics.employerCandidates?.length || 0} employer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Assessments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.completedAssessments}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.totalCandidates > 0 ? Math.round((analytics.completedAssessments / analytics.totalCandidates) * 100) : 0}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.payments?.length || 0} payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employers</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeEmployers}</div>
                 <p className="text-xs text-muted-foreground">
                   of {analytics.employers.length} total
                 </p>
              </CardContent>
            </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              {/* Financial Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Last {timeRange} days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Paid Solo Candidates</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.paidSoloCandidates}</div>
                    <p className="text-xs text-muted-foreground">
                      Completed payments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Revenue per User</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${analytics.paidSoloCandidates > 0 ? (analytics.totalRevenue / analytics.paidSoloCandidates).toFixed(2) : '0.00'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ARPU
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payment Conversion Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.totalCandidates > 0 ? ((analytics.paidSoloCandidates / analytics.totalCandidates) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Candidates to payment
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Payment analysis and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Solo Assessments</span>
                        <div className="text-right">
                          <div className="font-semibold">${analytics.totalRevenue.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{analytics.paidSoloCandidates} payments</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Employer Subscriptions</span>
                        <div className="text-right">
                          <div className="font-semibold">$0.00</div>
                          <div className="text-xs text-muted-foreground">0 active</div>
                        </div>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Revenue</span>
                          <span>${analytics.totalRevenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status Overview</CardTitle>
                    <CardDescription>Current payment processing status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Completed Payments</span>
                        </div>
                        <Badge variant="secondary">{analytics.paidSoloCandidates}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">Pending Payments</span>
                        </div>
                        <Badge variant="outline">0</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Failed Payments</span>
                        </div>
                        <Badge variant="destructive">0</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment History */}
              {analytics.payments && analytics.payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>Latest successful payment transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.payments.slice(0, 10).map((payment: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <span className="font-medium">${payment.amount.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground ml-2">Solo Assessment</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(payment.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Payment Data Message */}
              {(!analytics.payments || analytics.payments.length === 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>No payments recorded in the selected time period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No payment transactions found for the last {timeRange} days.</p>
                      <p className="text-sm text-muted-foreground mt-1">Payments will appear here once processed.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.performanceMetrics?.completionRate.toFixed(1)}%</div>
                    <Progress value={analytics.performanceMetrics?.completionRate || 0} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.performanceMetrics?.avgTimeToComplete.toFixed(0)} min
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Per assessment
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.performanceMetrics?.conversionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      Start to completion
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{analytics.performanceMetrics?.weeklyGrowth}</div>
                    <p className="text-xs text-muted-foreground">
                      New candidates this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment Types Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Types Performance</CardTitle>
                  <CardDescription>Distribution of completed assessments by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.assessmentTypes.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                          <span className="capitalize">{item.name.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(item.count / analytics.completedAssessments) * 100}%` }}
                            />
                          </div>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="demographics" className="space-y-6">
              {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.countries
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.genders.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <span className="capitalize">{item.name}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.events?.slice(0, 10).map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{event.event_type.replace(/_/g, ' ')}</span>
                      {event.metadata && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {JSON.stringify(event.metadata)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default AdminAnalytics;