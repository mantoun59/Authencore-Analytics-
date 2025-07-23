import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartner } from '@/contexts/PartnerContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  Clock,
  Users,
  FileText,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Activity,
  Eye,
  Download
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

const PartnerAnalytics = () => {
  const { partner, isAuthenticated } = usePartner();
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !partner) {
      navigate('/partner-login');
      return;
    }
    loadAnalytics();
  }, [isAuthenticated, partner, navigate, timeRange]);

  const loadAnalytics = async () => {
    if (!partner) return;
    
    try {
      setLoading(true);
      
      // Calculate date filter
      const daysAgo = parseInt(timeRange);
      const dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - daysAgo);

      // Get partner access logs
      const { data: accessLogs, error } = await supabase
        .from('partner_access_logs')
        .select('*')
        .eq('partner_id', partner.id)
        .gte('created_at', dateFilter.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching access logs:', error);
        return;
      }

      // Calculate metrics
      const totalSessions = accessLogs?.length || 0;
      const uniqueDays = new Set(accessLogs?.map(log => 
        new Date(log.created_at).toDateString()
      )).size;
      
      const assessmentAccess = accessLogs?.filter(log => 
        log.action === 'access_assessment'
      ) || [];
      
      const uniqueAssessments = new Set(assessmentAccess.map(log => 
        log.assessment_type
      )).size;

      // Assessment type breakdown
      const assessmentTypes = assessmentAccess.reduce((acc: any, log) => {
        if (log.assessment_type) {
          acc[log.assessment_type] = (acc[log.assessment_type] || 0) + 1;
        }
        return acc;
      }, {});

      // Daily activity breakdown
      const dailyActivity = accessLogs?.reduce((acc: any, log) => {
        const date = new Date(log.created_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      // Recent activity (last 10 actions)
      const recentActivity = accessLogs?.slice(0, 10) || [];

      // Calculate access patterns
      const hourlyActivity = accessLogs?.reduce((acc: any, log) => {
        const hour = new Date(log.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {}) || {};

      const peakHour = Object.entries(hourlyActivity).reduce((peak, [hour, count]) => 
        (count as number) > peak.count ? { hour: parseInt(hour), count: count as number } : peak,
        { hour: 0, count: 0 }
      );

      setAnalytics({
        totalSessions,
        uniqueDays,
        uniqueAssessments,
        assessmentTypes,
        dailyActivity,
        recentActivity,
        peakHour,
        averageSessionsPerDay: uniqueDays > 0 ? (totalSessions / uniqueDays).toFixed(1) : 0,
        mostAccessedAssessment: Object.entries(assessmentTypes).reduce((most, [type, count]) => 
          (count as number) > most.count ? { type, count: count as number } : most,
          { type: 'None', count: 0 }
        )
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
        ['Date', 'Action', 'Assessment Type', 'IP Address'],
        ...analytics.recentActivity.map((log: any) => [
          new Date(log.created_at).toLocaleString(),
          log.action,
          log.assessment_type || 'N/A',
          log.ip_address || 'N/A'
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${partner.organization_name}_analytics.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (!partner) return null;

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
            <Button variant="outline" onClick={() => navigate('/partner-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Partner Analytics</h1>
              <p className="text-muted-foreground">
                Usage insights for {partner.organization_name} - Last {timeRange} days
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
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Platform access events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Days</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.uniqueDays}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.averageSessionsPerDay} avg sessions/day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Accessed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.uniqueAssessments}</div>
              <p className="text-xs text-muted-foreground">
                Different assessment types
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Activity Hour</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.peakHour.hour}:00
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.peakHour.count} sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Your partnership details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Organization</span>
                      <span className="font-medium">{partner.organization_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Username</span>
                      <span className="font-medium">{partner.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Access Expires</span>
                      <span className="font-medium">
                        {format(new Date(partner.access_expires_at), 'PPP')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge variant={new Date(partner.access_expires_at) > new Date() ? "default" : "destructive"}>
                        {new Date(partner.access_expires_at) > new Date() ? 'Active' : 'Expired'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Accessed Assessment</CardTitle>
                  <CardDescription>Your preferred assessment type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary capitalize mb-2">
                      {analytics.mostAccessedAssessment.type.replace('_', ' ')}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accessed {analytics.mostAccessedAssessment.count} times
                    </p>
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Usage</CardTitle>
                <CardDescription>Breakdown by assessment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.assessmentTypes || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="secondary">{count as number} accesses</Badge>
                    </div>
                  ))}
                  {Object.keys(analytics.assessmentTypes || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No assessment access recorded in this period
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity?.map((log: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div>
                          <div className="font-medium capitalize">
                            {log.action.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.assessment_type && `${log.assessment_type.replace('_', ' ')} • `}
                            {format(new Date(log.created_at), 'PPp')}
                          </div>
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                  {(!analytics.recentActivity || analytics.recentActivity.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity recorded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity Pattern</CardTitle>
                <CardDescription>Sessions per day in selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.dailyActivity || {}).slice(0, 7).map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between">
                      <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(
                                ((count as number) / Math.max(...Object.values(analytics.dailyActivity).map(v => Number(v) || 0))) * 100, 
                                100
                              )}%` 
                            }}
                          />
                        </div>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    </div>
                  ))}
                  {Object.keys(analytics.dailyActivity || {}).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No activity data available for this period
                    </p>
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

export default PartnerAnalytics;