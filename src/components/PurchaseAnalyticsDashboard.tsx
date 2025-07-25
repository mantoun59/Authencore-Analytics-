import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Mail, 
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  Users,
  Clock
} from "lucide-react";

interface PurchaseStats {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  recentOrders: Array<{
    id: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    guest_email?: string;
  }>;
  topAssessments: Array<{
    assessment_type: string;
    count: number;
    revenue: number;
  }>;
}

const PurchaseAnalyticsDashboard = () => {
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReport, setSendingReport] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPurchaseStats = async () => {
    try {
      setLoading(true);
      
      // Get last 30 days of data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          payment_status,
          created_at,
          guest_email,
          order_items(assessment_type, quantity, total_price)
        `)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .in('payment_status', ['paid', 'completed'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0) || 0;
      const orderCount = orders?.length || 0;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      // Top assessments
      const assessmentMap = new Map();
      orders?.forEach(order => {
        order.order_items?.forEach(item => {
          const existing = assessmentMap.get(item.assessment_type) || { count: 0, revenue: 0 };
          assessmentMap.set(item.assessment_type, {
            count: existing.count + item.quantity,
            revenue: existing.revenue + parseFloat(item.total_price.toString())
          });
        });
      });

      const topAssessments = Array.from(assessmentMap.entries())
        .map(([assessment_type, data]) => ({
          assessment_type,
          count: data.count,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Recent orders
      const recentOrders = orders?.slice(0, 10).map(order => ({
        id: order.id,
        total_amount: parseFloat(order.total_amount.toString()),
        payment_status: order.payment_status,
        created_at: order.created_at,
        guest_email: order.guest_email
      })) || [];

      setStats({
        totalRevenue,
        orderCount,
        averageOrderValue,
        recentOrders,
        topAssessments
      });

    } catch (error) {
      console.error('Error fetching purchase stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch purchase statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendManualReport = async (period: 'Daily' | 'Weekly' | 'Monthly') => {
    try {
      setSendingReport(period);
      
      const { data, error } = await supabase.functions.invoke('purchase-analytics', {
        body: { 
          period, 
          adminEmail: 'admin@authencore.org',
          manual: true 
        }
      });

      if (error) throw error;

      toast({
        title: "Report Sent!",
        description: `${period} purchase report has been sent to your email`,
      });

    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: "Error",
        description: "Failed to send purchase report",
        variant: "destructive"
      });
    } finally {
      setSendingReport(null);
    }
  };

  useEffect(() => {
    fetchPurchaseStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Purchase Analytics</h2>
          <p className="text-muted-foreground">Last 30 days overview</p>
        </div>
        <Button 
          onClick={fetchPurchaseStats} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orderCount}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Report Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Purchase Reports
          </CardTitle>
          <CardDescription>
            Generate and send analytics reports manually or view scheduled reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button 
              onClick={() => sendManualReport('Daily')}
              disabled={sendingReport === 'Daily'}
              variant="outline"
            >
              {sendingReport === 'Daily' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              Daily Report
            </Button>
            
            <Button 
              onClick={() => sendManualReport('Weekly')}
              disabled={sendingReport === 'Weekly'}
              variant="outline"
            >
              {sendingReport === 'Weekly' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="w-4 h-4 mr-2" />
              )}
              Weekly Report
            </Button>
            
            <Button 
              onClick={() => sendManualReport('Monthly')}
              disabled={sendingReport === 'Monthly'}
              variant="outline"
            >
              {sendingReport === 'Monthly' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4 mr-2" />
              )}
              Monthly Report
            </Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Automated Schedule:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>📅 Daily reports: Every day at 9:00 AM</li>
              <li>📊 Weekly reports: Every Monday at 9:00 AM</li>
              <li>📈 Monthly reports: 1st of each month at 9:00 AM</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Assessments */}
        {stats?.topAssessments && stats.topAssessments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Performing Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topAssessments.map((assessment, index) => (
                  <div key={assessment.assessment_type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium capitalize">
                          {assessment.assessment_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {assessment.count} assessments
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${assessment.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {order.id.substring(0, 8)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.guest_email || 'Registered User'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total_amount.toFixed(2)}</p>
                      <Badge 
                        variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PurchaseAnalyticsDashboard;