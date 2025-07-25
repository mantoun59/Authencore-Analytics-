import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseAnalytics {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  topAssessments: Array<{
    assessment_type: string;
    count: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    guest_email?: string;
  }>;
  comparisonData: {
    previousPeriodRevenue: number;
    previousPeriodOrders: number;
    revenueGrowth: number;
    orderGrowth: number;
  };
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getPurchaseAnalytics(
  startDate: string, 
  endDate: string,
  previousStartDate: string,
  previousEndDate: string
): Promise<PurchaseAnalytics> {
  console.log(`Fetching analytics from ${startDate} to ${endDate}`);
  
  // Current period analytics
  const { data: currentOrders, error: currentError } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      payment_status,
      created_at,
      guest_email,
      order_items(assessment_type, quantity, total_price)
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .in('payment_status', ['paid', 'completed']);

  if (currentError) {
    console.error('Error fetching current orders:', currentError);
    throw currentError;
  }

  // Previous period for comparison
  const { data: previousOrders, error: previousError } = await supabase
    .from('orders')
    .select('total_amount')
    .gte('created_at', previousStartDate)
    .lte('created_at', previousEndDate)
    .in('payment_status', ['paid', 'completed']);

  if (previousError) {
    console.error('Error fetching previous orders:', previousError);
    throw previousError;
  }

  // Calculate current period metrics
  const totalRevenue = currentOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
  const orderCount = currentOrders?.length || 0;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  // Calculate previous period metrics
  const previousPeriodRevenue = previousOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
  const previousPeriodOrders = previousOrders?.length || 0;

  // Calculate growth percentages
  const revenueGrowth = previousPeriodRevenue > 0 
    ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
    : 0;
  const orderGrowth = previousPeriodOrders > 0 
    ? ((orderCount - previousPeriodOrders) / previousPeriodOrders) * 100 
    : 0;

  // Top assessments by revenue and count
  const assessmentMap = new Map();
  currentOrders?.forEach(order => {
    order.order_items?.forEach(item => {
      const existing = assessmentMap.get(item.assessment_type) || { count: 0, revenue: 0 };
      assessmentMap.set(item.assessment_type, {
        count: existing.count + item.quantity,
        revenue: existing.revenue + parseFloat(item.total_price)
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

  // Recent orders (last 10)
  const recentOrders = currentOrders?.slice(-10).map(order => ({
    id: order.id,
    total_amount: parseFloat(order.total_amount),
    payment_status: order.payment_status,
    created_at: order.created_at,
    guest_email: order.guest_email
  })) || [];

  return {
    totalRevenue,
    orderCount,
    averageOrderValue,
    topAssessments,
    recentOrders,
    comparisonData: {
      previousPeriodRevenue,
      previousPeriodOrders,
      revenueGrowth,
      orderGrowth
    }
  };
}

function generateEmailHTML(analytics: PurchaseAnalytics, period: string, startDate: string, endDate: string): string {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };
  const getGrowthColor = (percent: number) => percent >= 0 ? '#10B981' : '#EF4444';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${period} Purchase Report - Authencore</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px;">📊 ${period} Purchase Report</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">${startDate} to ${endDate}</p>
      </div>

      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="margin-top: 0; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📈 Key Metrics</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Revenue</h3>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2d3748;">${formatCurrency(analytics.totalRevenue)}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: ${getGrowthColor(analytics.comparisonData.revenueGrowth)};">
              ${formatPercentage(analytics.comparisonData.revenueGrowth)} vs previous period
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Orders</h3>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2d3748;">${analytics.orderCount}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: ${getGrowthColor(analytics.comparisonData.orderGrowth)};">
              ${formatPercentage(analytics.comparisonData.orderGrowth)} vs previous period
            </p>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Average Order Value</h3>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2d3748;">${formatCurrency(analytics.averageOrderValue)}</p>
        </div>
      </div>

      ${analytics.topAssessments.length > 0 ? `
      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="margin-top: 0; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🏆 Top Performing Assessments</h2>
        ${analytics.topAssessments.map((assessment, index) => `
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="margin: 0; color: #2d3748; text-transform: capitalize;">${assessment.assessment_type.replace(/_/g, ' ')}</h4>
                <p style="margin: 5px 0 0 0; color: #718096; font-size: 14px;">${assessment.count} assessments sold</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2d3748;">${formatCurrency(assessment.revenue)}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${analytics.recentOrders.length > 0 ? `
      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="margin-top: 0; color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">🕒 Recent Orders</h2>
        ${analytics.recentOrders.slice(0, 5).map(order => `
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="margin: 0; font-size: 12px; color: #718096;">${order.id.substring(0, 8)}...</p>
                <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 14px;">${order.guest_email || 'Registered User'}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-weight: bold; color: #2d3748;">${formatCurrency(order.total_amount)}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #10B981;">${order.payment_status}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div style="background: #e2e8f0; padding: 20px; border-radius: 10px; text-align: center; margin-top: 30px;">
        <p style="margin: 0; color: #4a5568; font-size: 14px;">
          📧 This is an automated ${period.toLowerCase()} report from your Authencore dashboard.
        </p>
        <p style="margin: 10px 0 0 0; color: #718096; font-size: 12px;">
          Generated on ${new Date().toLocaleString()}
        </p>
      </div>
    </body>
    </html>
  `;
}

async function sendPurchaseReport(period: 'Daily' | 'Weekly' | 'Monthly', adminEmail?: string) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;
  let previousStartDate: Date;
  let previousEndDate: Date;

  // Calculate date ranges based on period
  switch (period) {
    case 'Daily':
      // Yesterday
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(now);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);

      // Day before yesterday
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(startDate.getDate() - 1);
      
      previousEndDate = new Date(endDate);
      previousEndDate.setDate(endDate.getDate() - 1);
      break;

    case 'Weekly':
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      // Previous 7 days
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(startDate.getDate() - 7);
      
      previousEndDate = new Date(startDate);
      previousEndDate.setHours(23, 59, 59, 999);
      break;

    case 'Monthly':
      // Last 30 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      // Previous 30 days
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(startDate.getDate() - 30);
      
      previousEndDate = new Date(startDate);
      previousEndDate.setHours(23, 59, 59, 999);
      break;
  }

  try {
    const analytics = await getPurchaseAnalytics(
      startDate.toISOString(),
      endDate.toISOString(),
      previousStartDate.toISOString(),
      previousEndDate.toISOString()
    );

    const emailHTML = generateEmailHTML(
      analytics,
      period,
      startDate.toLocaleDateString(),
      endDate.toLocaleDateString()
    );

    // Get admin email if not provided
    const recipient = adminEmail || "admin@authencore.org"; // Default admin email

    const { error: emailError } = await resend.emails.send({
      from: 'Authencore Analytics <analytics@authencore.org>',
      to: [recipient],
      subject: `${period} Purchase Report - ${analytics.orderCount} orders, ${analytics.totalRevenue.toFixed(2)} revenue`,
      html: emailHTML,
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      throw emailError;
    }

    console.log(`${period} purchase report sent successfully to ${recipient}`);
    
    // Log analytics event
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'purchase_report_sent',
      p_entity_type: 'analytics',
      p_metadata: {
        period: period.toLowerCase(),
        total_revenue: analytics.totalRevenue,
        order_count: analytics.orderCount,
        recipient: recipient,
        sent_at: new Date().toISOString()
      }
    });

    return {
      success: true,
      analytics,
      message: `${period} report sent to ${recipient}`
    };

  } catch (error) {
    console.error(`Error generating ${period} report:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { period, adminEmail, manual } = await req.json();
    
    if (!period || !['Daily', 'Weekly', 'Monthly'].includes(period)) {
      throw new Error('Valid period (Daily, Weekly, Monthly) is required');
    }

    const result = await sendPurchaseReport(period, adminEmail);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Purchase analytics error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});