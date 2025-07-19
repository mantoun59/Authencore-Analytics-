import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp,
  FileText,
  Calendar,
  Download,
  BarChart3
} from 'lucide-react';
import Header from '@/components/Header';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) return;

    const loadAnalytics = async () => {
      try {
        // Load various analytics data
        const [
          soloCandiatesRes,
          employerCandidatesRes,
          employersRes,
          paymentsRes,
          eventsRes
        ] = await Promise.all([
          supabase.from('solo_candidates').select('*'),
          supabase.from('employer_candidates').select('*'),
          supabase.from('employer_accounts').select('*'),
          supabase.from('payments').select('*'),
          supabase.from('analytics_events').select('*').limit(100).order('created_at', { ascending: false })
        ]);

        const soloCandidates = soloCandiatesRes.data || [];
        const employerCandidates = employerCandidatesRes.data || [];
        const employers = employersRes.data || [];
        const payments = paymentsRes.data || [];
        const events = eventsRes.data || [];

        // Calculate analytics
        const totalCandidates = soloCandidates.length + employerCandidates.length;
        const completedAssessments = soloCandidates.filter(c => c.assessment_completed).length + 
                                   employerCandidates.filter(c => c.assessment_completed).length;
        const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
        const paidSoloCandidates = soloCandidates.filter(c => c.payment_status === 'paid').length;

        // Demographics
        const countries = [...soloCandidates, ...employerCandidates]
          .filter(c => c.country)
          .reduce((acc: any, c) => {
            acc[c.country] = (acc[c.country] || 0) + 1;
            return acc;
          }, {});

        const genders = [...soloCandidates, ...employerCandidates]
          .filter(c => c.gender)
          .reduce((acc: any, c) => {
            acc[c.gender] = (acc[c.gender] || 0) + 1;
            return acc;
          }, {});

        setAnalytics({
          totalCandidates,
          completedAssessments,
          totalRevenue,
          paidSoloCandidates,
          employers: employers.length,
          activeEmployers: employers.filter(e => e.is_active).length,
          countries,
          genders,
          events,
          soloCandidates,
          employerCandidates,
          payments: payments.filter(p => p.status === 'paid')
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, isAdmin]);

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
      <ProtectedAdminRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track assessment progress and business metrics</p>
            </div>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
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
                  of {analytics.employers} total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analytics.countries || {})
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center">
                        <span>{country}</span>
                        <Badge variant="secondary">{count as number}</Badge>
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
                  {Object.entries(analytics.genders || {}).map(([gender, count]) => (
                    <div key={gender} className="flex justify-between items-center">
                      <span className="capitalize">{gender}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminAnalytics;