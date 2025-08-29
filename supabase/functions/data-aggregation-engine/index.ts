import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataSource {
  id: string;
  source_name: string;
  api_endpoint: string;
  source_type: string;
  industry_focus: string[];
  is_active: boolean;
}

interface SkillsData {
  skill_name: string;
  industry: string;
  region: string;
  demand_score: number;
  supply_score: number;
  growth_rate: number;
  automation_risk: number;
  salary_premium: number;
  data_timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting automated data aggregation cycle...');

    // Get active data sources
    const { data: dataSources, error: sourcesError } = await supabase
      .from('data_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) {
      throw new Error(`Failed to fetch data sources: ${sourcesError.message}`);
    }

    const aggregatedData: SkillsData[] = [];
    const processedSources: string[] = [];

    // Process each data source
    for (const source of dataSources as DataSource[]) {
      try {
        console.log(`Processing data source: ${source.source_name}`);
        
        let sourceData: SkillsData[] = [];
        
        // Simulate different data source types
        switch (source.source_type) {
          case 'government_api':
            sourceData = await fetchGovernmentData(source);
            break;
          case 'recruitment_api':
            sourceData = await fetchRecruitmentData(source);
            break;
          case 'economic_api':
            sourceData = await fetchEconomicData(source);
            break;
          case 'ngo_reports':
            sourceData = await fetchNGOData(source);
            break;
          default:
            sourceData = await fetchGenericData(source);
        }

        aggregatedData.push(...sourceData);
        processedSources.push(source.source_name);

        // Update last refresh timestamp
        await supabase
          .from('data_sources')
          .update({ last_updated: new Date().toISOString() })
          .eq('id', source.id);

      } catch (error) {
        console.error(`Error processing source ${source.source_name}:`, error);
        continue;
      }
    }

    // Batch insert aggregated data
    if (aggregatedData.length > 0) {
      const { error: insertError } = await supabase
        .from('skills_market_data')
        .upsert(aggregatedData.map(data => ({
          ...data,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })), {
          onConflict: 'skill_name,industry,region,data_timestamp'
        });

      if (insertError) {
        console.error('Error inserting aggregated data:', insertError);
      }
    }

    // Update economic indicators
    await updateEconomicIndicators(supabase);

    // Log analytics event
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'automated_data_aggregation',
      p_entity_type: 'data_collection',
      p_metadata: {
        sources_processed: processedSources.length,
        data_points_collected: aggregatedData.length,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`Data aggregation completed. Processed ${processedSources.length} sources, collected ${aggregatedData.length} data points.`);

    return new Response(JSON.stringify({
      success: true,
      sources_processed: processedSources.length,
      data_points_collected: aggregatedData.length,
      processed_sources: processedSources
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in data aggregation engine:', error);
    return new Response(JSON.stringify({
      error: 'Data aggregation failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchGovernmentData(source: DataSource): Promise<SkillsData[]> {
  // Simulate government labor statistics API
  const regions = ['US', 'EU', 'APAC', 'LATAM'];
  const industries = source.industry_focus || ['Technology', 'Healthcare', 'Finance'];
  const skills = ['AI/ML', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'Digital Marketing'];
  
  return generateMockData(skills, industries, regions, 'government');
}

async function fetchRecruitmentData(source: DataSource): Promise<SkillsData[]> {
  // Simulate recruitment platform APIs (LinkedIn, Indeed, etc.)
  const regions = ['US', 'Canada', 'UK', 'Germany', 'Australia'];
  const industries = source.industry_focus || ['Technology', 'Finance', 'Healthcare'];
  const skills = ['Software Engineering', 'Product Management', 'Sales', 'Marketing', 'Operations'];
  
  return generateMockData(skills, industries, regions, 'recruitment');
}

async function fetchEconomicData(source: DataSource): Promise<SkillsData[]> {
  // Simulate economic research APIs (World Bank, IMF, etc.)
  const regions = ['Global', 'North America', 'Europe', 'Asia'];
  const industries = source.industry_focus || ['Manufacturing', 'Services', 'Technology'];
  const skills = ['Automation', 'Robotics', 'Green Energy', 'Sustainability'];
  
  return generateMockData(skills, industries, regions, 'economic');
}

async function fetchNGOData(source: DataSource): Promise<SkillsData[]> {
  // Simulate NGO and research institution data
  const regions = ['Africa', 'Latin America', 'Southeast Asia'];
  const industries = source.industry_focus || ['Education', 'Healthcare', 'Agriculture'];
  const skills = ['Digital Literacy', 'Healthcare Tech', 'Sustainable Development'];
  
  return generateMockData(skills, industries, regions, 'ngo');
}

async function fetchGenericData(source: DataSource): Promise<SkillsData[]> {
  const regions = ['Global'];
  const industries = ['Cross-Industry'];
  const skills = ['Communication', 'Leadership', 'Problem Solving'];
  
  return generateMockData(skills, industries, regions, 'generic');
}

function generateMockData(skills: string[], industries: string[], regions: string[], sourceType: string): SkillsData[] {
  const data: SkillsData[] = [];
  const now = new Date();
  
  for (const skill of skills) {
    for (const industry of industries) {
      for (const region of regions) {
        // Generate realistic market data based on source type
        const baseScores = getBaseScoresBySourceType(sourceType);
        
        data.push({
          skill_name: skill,
          industry: industry,
          region: region,
          demand_score: Math.random() * 40 + baseScores.demand + Math.random() * 20,
          supply_score: Math.random() * 30 + baseScores.supply + Math.random() * 20,
          growth_rate: (Math.random() - 0.3) * 50 + baseScores.growth,
          automation_risk: Math.random() * 100,
          salary_premium: Math.random() * 50 + baseScores.salary,
          data_timestamp: now.toISOString()
        });
      }
    }
  }
  
  return data;
}

function getBaseScoresBySourceType(sourceType: string) {
  switch (sourceType) {
    case 'government':
      return { demand: 60, supply: 40, growth: 15, salary: 20 };
    case 'recruitment':
      return { demand: 70, supply: 50, growth: 25, salary: 30 };
    case 'economic':
      return { demand: 55, supply: 45, growth: 10, salary: 15 };
    case 'ngo':
      return { demand: 45, supply: 35, growth: 20, salary: 10 };
    default:
      return { demand: 50, supply: 40, growth: 15, salary: 20 };
  }
}

async function updateEconomicIndicators(supabase: any) {
  const indicators = [
    { type: 'GDP_GROWTH', value: Math.random() * 6 - 1, region: 'US' },
    { type: 'UNEMPLOYMENT_RATE', value: Math.random() * 8 + 3, region: 'EU' },
    { type: 'INFLATION_RATE', value: Math.random() * 5 + 1, region: 'Global' },
    { type: 'TECH_ADOPTION_INDEX', value: Math.random() * 40 + 60, region: 'APAC' }
  ];

  for (const indicator of indicators) {
    await supabase
      .from('economic_indicators')
      .upsert({
        id: crypto.randomUUID(),
        indicator_type: indicator.type,
        value: indicator.value,
        region: indicator.region,
        unit: getUnitForIndicator(indicator.type),
        data_timestamp: new Date().toISOString(),
        confidence_level: 0.85 + Math.random() * 0.1
      });
  }
}

function getUnitForIndicator(type: string): string {
  switch (type) {
    case 'GDP_GROWTH':
    case 'UNEMPLOYMENT_RATE':
    case 'INFLATION_RATE':
      return 'percentage';
    case 'TECH_ADOPTION_INDEX':
      return 'index';
    default:
      return 'units';
  }
}