import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting real-time market monitoring cycle...');

    // Check for significant market changes
    const alerts = await detectMarketAlerts(supabase);
    
    // Update real-time dashboard metrics
    const dashboardMetrics = await updateDashboardMetrics(supabase);
    
    // Trigger automated data refresh if needed
    const shouldRefreshData = await checkDataFreshnessThreshold(supabase);
    
    if (shouldRefreshData) {
      console.log('Triggering automated data refresh...');
      // Invoke data aggregation engine
      const { error: aggregationError } = await supabase.functions.invoke('data-aggregation-engine');
      if (aggregationError) {
        console.error('Error triggering data aggregation:', aggregationError);
      }
    }

    // Check for consensus prediction updates needed
    const consensusUpdateNeeded = await checkConsensusUpdateNeeded(supabase);
    
    if (consensusUpdateNeeded.needed) {
      console.log('Triggering AI consensus updates for', consensusUpdateNeeded.predictions.length, 'predictions');
      const { error: consensusError } = await supabase.functions.invoke('ai-consensus-engine', {
        body: { predictions: consensusUpdateNeeded.predictions }
      });
      if (consensusError) {
        console.error('Error triggering consensus updates:', consensusError);
      }
    }

    // Log monitoring cycle
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'real_time_monitoring_cycle',
      p_entity_type: 'market_monitoring',
      p_metadata: {
        alerts_generated: alerts.length,
        dashboard_metrics_updated: Object.keys(dashboardMetrics).length,
        data_refresh_triggered: shouldRefreshData,
        consensus_updates_triggered: consensusUpdateNeeded.needed,
        timestamp: new Date().toISOString()
      }
    });

    return new Response(JSON.stringify({
      success: true,
      monitoring_summary: {
        alerts_generated: alerts.length,
        dashboard_metrics: dashboardMetrics,
        data_refresh_triggered: shouldRefreshData,
        consensus_updates_triggered: consensusUpdateNeeded.needed
      },
      alerts: alerts
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in real-time market monitor:', error);
    return new Response(JSON.stringify({
      error: 'Market monitoring failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function detectMarketAlerts(supabase: any) {
  const alerts = [];
  
  // Check for sudden demand spikes
  const { data: recentData } = await supabase
    .from('skills_market_data')
    .select('*')
    .gte('data_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('data_timestamp', { ascending: false });

  if (recentData && recentData.length > 0) {
    // Group by skill and check for spikes
    const skillGroups = recentData.reduce((acc: any, item: any) => {
      const key = `${item.skill_name}-${item.industry}-${item.region}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    for (const [skillKey, data] of Object.entries(skillGroups) as [string, any[]]) {
      if (data.length < 2) continue;
      
      const sortedData = data.sort((a, b) => new Date(b.data_timestamp).getTime() - new Date(a.data_timestamp).getTime());
      const latest = sortedData[0];
      const previous = sortedData[1];
      
      const demandChange = ((latest.demand_score - previous.demand_score) / previous.demand_score) * 100;
      const growthChange = Math.abs(latest.growth_rate - previous.growth_rate);
      
      // Alert for significant changes
      if (demandChange > 25) {
        alerts.push({
          id: crypto.randomUUID(),
          alert_type: 'demand_spike',
          skill_name: latest.skill_name,
          industry: latest.industry,
          region: latest.region,
          severity: demandChange > 50 ? 'critical' : 'high',
          message: `${latest.skill_name} demand increased by ${demandChange.toFixed(1)}% in ${latest.industry} (${latest.region})`,
          metrics: {
            demand_change: demandChange,
            current_demand: latest.demand_score,
            previous_demand: previous.demand_score
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      if (demandChange < -25) {
        alerts.push({
          id: crypto.randomUUID(),
          alert_type: 'demand_drop',
          skill_name: latest.skill_name,
          industry: latest.industry,
          region: latest.region,
          severity: demandChange < -50 ? 'critical' : 'high',
          message: `${latest.skill_name} demand dropped by ${Math.abs(demandChange).toFixed(1)}% in ${latest.industry} (${latest.region})`,
          metrics: {
            demand_change: demandChange,
            current_demand: latest.demand_score,
            previous_demand: previous.demand_score
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      
      if (growthChange > 20) {
        alerts.push({
          id: crypto.randomUUID(),
          alert_type: 'growth_volatility',
          skill_name: latest.skill_name,
          industry: latest.industry,
          region: latest.region,
          severity: 'medium',
          message: `High volatility detected in ${latest.skill_name} growth projections (${latest.industry})`,
          metrics: {
            growth_change: growthChange,
            current_growth: latest.growth_rate,
            previous_growth: previous.growth_rate
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }
  }

  // Check economic indicator alerts
  const { data: economicData } = await supabase
    .from('economic_indicators')
    .select('*')
    .gte('data_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('data_timestamp', { ascending: false });

  if (economicData && economicData.length > 0) {
    const indicatorGroups = economicData.reduce((acc: any, item: any) => {
      const key = `${item.indicator_type}-${item.region}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    for (const [indicatorKey, data] of Object.entries(indicatorGroups) as [string, any[]]) {
      if (data.length < 2) continue;
      
      const sortedData = data.sort((a, b) => new Date(b.data_timestamp).getTime() - new Date(a.data_timestamp).getTime());
      const latest = sortedData[0];
      const previous = sortedData[1];
      
      const valueChange = ((latest.value - previous.value) / Math.abs(previous.value)) * 100;
      
      // Alert for significant economic changes
      if (Math.abs(valueChange) > 15) {
        alerts.push({
          id: crypto.randomUUID(),
          alert_type: 'economic_indicator_change',
          skill_name: null,
          industry: 'Economic',
          region: latest.region,
          severity: Math.abs(valueChange) > 30 ? 'critical' : 'high',
          message: `${latest.indicator_type} changed by ${valueChange.toFixed(1)}% in ${latest.region}`,
          metrics: {
            indicator_type: latest.indicator_type,
            value_change: valueChange,
            current_value: latest.value,
            previous_value: previous.value,
            unit: latest.unit
          },
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }
  }

  // Store alerts in database
  if (alerts.length > 0) {
    const { error: alertError } = await supabase
      .from('market_alerts')
      .insert(alerts);
    
    if (alertError) {
      console.error('Error storing market alerts:', alertError);
    } else {
      console.log(`Generated ${alerts.length} market alerts`);
    }
  }

  return alerts;
}

async function updateDashboardMetrics(supabase: any) {
  const metrics: any = {};
  
  // Calculate total skills tracked
  const { count: skillsCount } = await supabase
    .from('skills_market_data')
    .select('skill_name', { count: 'exact', head: true })
    .not('skill_name', 'is', null);
  
  metrics.total_skills_tracked = skillsCount || 0;

  // Calculate data freshness
  const { data: latestData } = await supabase
    .from('skills_market_data')
    .select('data_timestamp')
    .order('data_timestamp', { ascending: false })
    .limit(1);
  
  if (latestData && latestData[0]) {
    const latestTimestamp = new Date(latestData[0].data_timestamp);
    const hoursAgo = (Date.now() - latestTimestamp.getTime()) / (1000 * 60 * 60);
    metrics.data_freshness_hours = Math.round(hoursAgo * 10) / 10;
  }

  // Calculate active AI engines
  const { count: enginesCount } = await supabase
    .from('ai_engines')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  metrics.active_ai_engines = enginesCount || 0;

  // Calculate active data sources
  const { count: sourcesCount } = await supabase
    .from('data_sources')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  metrics.active_data_sources = sourcesCount || 0;

  // Calculate recent predictions
  const { count: predictionsCount } = await supabase
    .from('ai_consensus_predictions')
    .select('*', { count: 'exact', head: true })
    .gte('prediction_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  metrics.predictions_last_24h = predictionsCount || 0;

  // Update metrics in admin settings
  const { error: updateError } = await supabase
    .from('admin_settings')
    .upsert({
      id: crypto.randomUUID(),
      setting_key: 'real_time_dashboard_metrics',
      setting_value: {
        ...metrics,
        last_updated: new Date().toISOString()
      }
    }, {
      onConflict: 'setting_key'
    });

  if (updateError) {
    console.error('Error updating dashboard metrics:', updateError);
  }

  return metrics;
}

async function checkDataFreshnessThreshold(supabase: any): Promise<boolean> {
  const { data: latestData } = await supabase
    .from('skills_market_data')
    .select('data_timestamp')
    .order('data_timestamp', { ascending: false })
    .limit(1);

  if (!latestData || latestData.length === 0) {
    return true; // No data, definitely need refresh
  }

  const latestTimestamp = new Date(latestData[0].data_timestamp);
  const hoursAgo = (Date.now() - latestTimestamp.getTime()) / (1000 * 60 * 60);
  
  // Refresh if data is older than 4 hours
  return hoursAgo > 4;
}

async function checkConsensusUpdateNeeded(supabase: any) {
  // Get skills that need consensus updates (data updated but no recent consensus)
  const { data: skillsNeedingUpdate } = await supabase
    .from('skills_market_data')
    .select('skill_name, industry, region')
    .gte('updated_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()) // Updated in last 6 hours
    .limit(10); // Limit to prevent overwhelming the system

  if (!skillsNeedingUpdate || skillsNeedingUpdate.length === 0) {
    return { needed: false, predictions: [] };
  }

  // Check which ones don't have recent consensus predictions
  const predictionsNeeded = [];
  
  for (const skill of skillsNeedingUpdate) {
    const { data: recentConsensus } = await supabase
      .from('ai_consensus_predictions')
      .select('prediction_timestamp')
      .eq('skill_name', skill.skill_name)
      .eq('industry', skill.industry)
      .eq('region', skill.region)
      .gte('prediction_timestamp', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()) // Last 12 hours
      .limit(1);

    if (!recentConsensus || recentConsensus.length === 0) {
      predictionsNeeded.push({
        skill_name: skill.skill_name,
        industry: skill.industry,
        region: skill.region,
        prediction_horizon: '12_months'
      });
    }
  }

  return {
    needed: predictionsNeeded.length > 0,
    predictions: predictionsNeeded
  };
}