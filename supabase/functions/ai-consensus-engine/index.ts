import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIEngine {
  id: string;
  engine_name: string;
  engine_type: string;
  model_version: string;
  accuracy_score: number;
  specialization: string[];
  is_active: boolean;
}

interface PredictionRequest {
  skill_name: string;
  industry: string;
  region: string;
  prediction_horizon: string;
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

    const { predictions } = await req.json() as { predictions: PredictionRequest[] };

    console.log('Starting AI consensus engine for', predictions.length, 'predictions...');

    // Get active AI engines
    const { data: aiEngines, error: enginesError } = await supabase
      .from('ai_engines')
      .select('*')
      .eq('is_active', true);

    if (enginesError) {
      throw new Error(`Failed to fetch AI engines: ${enginesError.message}`);
    }

    const consensusPredictions = [];

    for (const predictionRequest of predictions) {
      console.log(`Generating consensus for: ${predictionRequest.skill_name} in ${predictionRequest.industry} - ${predictionRequest.region}`);

      const engineResults = [];

      // Get predictions from each AI engine
      for (const engine of aiEngines as AIEngine[]) {
        try {
          const prediction = await getAIPrediction(engine, predictionRequest, supabase);
          engineResults.push({
            engine_id: engine.id,
            engine_name: engine.engine_name,
            confidence: prediction.confidence,
            demand_forecast: prediction.demand_forecast,
            growth_prediction: prediction.growth_prediction,
            risk_assessment: prediction.risk_assessment
          });
        } catch (error) {
          console.error(`Error getting prediction from ${engine.engine_name}:`, error);
          continue;
        }
      }

      if (engineResults.length === 0) {
        console.error('No successful predictions from any engine');
        continue;
      }

      // Calculate consensus
      const consensus = calculateConsensus(engineResults);
      
      // Store consensus prediction
      const { error: insertError } = await supabase
        .from('ai_consensus_predictions')
        .upsert({
          id: crypto.randomUUID(),
          skill_name: predictionRequest.skill_name,
          industry: predictionRequest.industry,
          region: predictionRequest.region,
          prediction_horizon: predictionRequest.prediction_horizon,
          consensus_score: consensus.consensus_score,
          variance_score: consensus.variance_score,
          confidence_interval: consensus.confidence_interval,
          ai_engine_results: engineResults,
          risk_factors: consensus.risk_factors,
          opportunity_factors: consensus.opportunity_factors,
          market_sentiment: consensus.market_sentiment,
          validation_score: consensus.validation_score,
          prediction_timestamp: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error storing consensus prediction:', insertError);
        continue;
      }

      consensusPredictions.push({
        ...predictionRequest,
        consensus: consensus
      });
    }

    // Log analytics
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'ai_consensus_generated',
      p_entity_type: 'ai_prediction',
      p_metadata: {
        predictions_generated: consensusPredictions.length,
        engines_used: aiEngines.length,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`AI consensus completed for ${consensusPredictions.length} predictions`);

    return new Response(JSON.stringify({
      success: true,
      consensus_predictions: consensusPredictions,
      engines_used: aiEngines.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI consensus engine:', error);
    return new Response(JSON.stringify({
      error: 'AI consensus failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getAIPrediction(engine: AIEngine, request: PredictionRequest, supabase: any) {
  // Get historical market data for context
  const { data: marketData } = await supabase
    .from('skills_market_data')
    .select('*')
    .eq('skill_name', request.skill_name)
    .eq('industry', request.industry)
    .eq('region', request.region)
    .order('data_timestamp', { ascending: false })
    .limit(10);

  // Get economic indicators
  const { data: economicData } = await supabase
    .from('economic_indicators')
    .select('*')
    .eq('region', request.region)
    .order('data_timestamp', { ascending: false })
    .limit(5);

  // Simulate different AI engine behaviors
  switch (engine.engine_type) {
    case 'openai':
      return await getOpenAIPrediction(engine, request, marketData, economicData);
    case 'anthropic':
      return await getAnthropicPrediction(engine, request, marketData, economicData);
    case 'perplexity':
      return await getPerplexityPrediction(engine, request, marketData, economicData);
    case 'huggingface':
      return await getHuggingFacePrediction(engine, request, marketData, economicData);
    default:
      return await getGenericAIPrediction(engine, request, marketData, economicData);
  }
}

async function getOpenAIPrediction(engine: AIEngine, request: PredictionRequest, marketData: any[], economicData: any[]) {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIKey) {
    throw new Error('OpenAI API key not available');
  }

  const prompt = `Analyze the future demand for "${request.skill_name}" in the "${request.industry}" industry in "${request.region}" over the next ${request.prediction_horizon}.

Historical Market Data: ${JSON.stringify(marketData?.slice(0, 3) || [])}
Economic Indicators: ${JSON.stringify(economicData?.slice(0, 2) || [])}

Provide a JSON response with:
- demand_forecast: number (0-100)
- growth_prediction: number (-50 to 100 percentage)
- confidence: number (0-100)
- risk_factors: array of strings
- opportunity_factors: array of strings
- market_sentiment: string (bullish/bearish/neutral)`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: 'You are a specialized AI for skills market analysis. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      ...result,
      confidence: Math.min(result.confidence || 75, engine.accuracy_score * 100)
    };
  } catch (error) {
    console.error('OpenAI prediction error:', error);
    return getGenericAIPrediction(engine, request, marketData, economicData);
  }
}

async function getAnthropicPrediction(engine: AIEngine, request: PredictionRequest, marketData: any[], economicData: any[]) {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  
  if (!anthropicKey) {
    throw new Error('Anthropic API key not available');
  }

  const prompt = `Analyze the skill "${request.skill_name}" market trends in ${request.industry} sector for ${request.region} region over ${request.prediction_horizon}.

Market Context: ${JSON.stringify(marketData?.slice(0, 3) || [])}
Economic Context: ${JSON.stringify(economicData?.slice(0, 2) || [])}

Return JSON with demand_forecast, growth_prediction, confidence, risk_factors, opportunity_factors, market_sentiment.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: prompt }
        ]
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.content[0].text);
    
    return {
      ...result,
      confidence: Math.min(result.confidence || 80, engine.accuracy_score * 100)
    };
  } catch (error) {
    console.error('Anthropic prediction error:', error);
    return getGenericAIPrediction(engine, request, marketData, economicData);
  }
}

async function getPerplexityPrediction(engine: AIEngine, request: PredictionRequest, marketData: any[], economicData: any[]) {
  const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
  
  if (!perplexityKey) {
    throw new Error('Perplexity API key not available');
  }

  const prompt = `Research current market trends for "${request.skill_name}" skills in "${request.industry}" industry in "${request.region}" and predict demand over ${request.prediction_horizon}. 

Context data: ${JSON.stringify({ marketData: marketData?.slice(0, 2), economicData: economicData?.slice(0, 2) })}

Provide JSON response with demand_forecast, growth_prediction, confidence, risk_factors, opportunity_factors, market_sentiment.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      ...result,
      confidence: Math.min(result.confidence || 85, engine.accuracy_score * 100)
    };
  } catch (error) {
    console.error('Perplexity prediction error:', error);
    return getGenericAIPrediction(engine, request, marketData, economicData);
  }
}

async function getHuggingFacePrediction(engine: AIEngine, request: PredictionRequest, marketData: any[], economicData: any[]) {
  // Simulate HuggingFace model prediction
  return getGenericAIPrediction(engine, request, marketData, economicData);
}

async function getGenericAIPrediction(engine: AIEngine, request: PredictionRequest, marketData: any[], economicData: any[]) {
  // Generate realistic predictions based on market data and economic indicators
  const baseScore = engine.accuracy_score * 100;
  const marketTrend = calculateMarketTrend(marketData);
  const economicImpact = calculateEconomicImpact(economicData);
  
  return {
    demand_forecast: Math.max(0, Math.min(100, baseScore + marketTrend + economicImpact + (Math.random() - 0.5) * 20)),
    growth_prediction: marketTrend * 2 + economicImpact + (Math.random() - 0.5) * 30,
    confidence: Math.max(60, Math.min(95, baseScore + (Math.random() - 0.5) * 10)),
    risk_factors: generateRiskFactors(request),
    opportunity_factors: generateOpportunityFactors(request),
    market_sentiment: generateMarketSentiment(marketTrend, economicImpact)
  };
}

function calculateMarketTrend(marketData: any[]): number {
  if (!marketData || marketData.length < 2) return 0;
  
  const recent = marketData[0];
  const older = marketData[marketData.length - 1];
  
  return ((recent?.demand_score || 50) - (older?.demand_score || 50)) / 10;
}

function calculateEconomicImpact(economicData: any[]): number {
  if (!economicData || economicData.length === 0) return 0;
  
  const gdpGrowth = economicData.find(d => d.indicator_type === 'GDP_GROWTH')?.value || 2;
  const unemployment = economicData.find(d => d.indicator_type === 'UNEMPLOYMENT_RATE')?.value || 5;
  
  return (gdpGrowth * 2) - (unemployment * 0.5);
}

function generateRiskFactors(request: PredictionRequest): string[] {
  const factors = [
    'Economic recession impact',
    'Automation displacement risk',
    'Market oversaturation',
    'Regulatory changes',
    'Technology disruption'
  ];
  
  return factors.slice(0, Math.floor(Math.random() * 3) + 1);
}

function generateOpportunityFactors(request: PredictionRequest): string[] {
  const factors = [
    'Digital transformation acceleration',
    'Emerging market growth',
    'Government incentives',
    'Industry expansion',
    'Remote work adoption'
  ];
  
  return factors.slice(0, Math.floor(Math.random() * 3) + 1);
}

function generateMarketSentiment(marketTrend: number, economicImpact: number): string {
  const combined = marketTrend + economicImpact;
  
  if (combined > 5) return 'bullish';
  if (combined < -5) return 'bearish';
  return 'neutral';
}

function calculateConsensus(engineResults: any[]) {
  const demands = engineResults.map(r => r.demand_forecast);
  const growths = engineResults.map(r => r.growth_prediction);
  const confidences = engineResults.map(r => r.confidence);
  
  const avgDemand = demands.reduce((a, b) => a + b, 0) / demands.length;
  const avgGrowth = growths.reduce((a, b) => a + b, 0) / growths.length;
  const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
  
  // Calculate variance (lower = more consensus)
  const demandVariance = demands.reduce((acc, val) => acc + Math.pow(val - avgDemand, 2), 0) / demands.length;
  const variance_score = Math.max(0, 100 - Math.sqrt(demandVariance) * 5);
  
  // Collect all risk and opportunity factors
  const allRiskFactors = engineResults.flatMap(r => r.risk_assessment || []);
  const allOpportunityFactors = engineResults.flatMap(r => r.opportunity_factors || []);
  
  // Determine market sentiment based on majority
  const sentiments = engineResults.map(r => r.market_sentiment || 'neutral');
  const sentimentCounts = sentiments.reduce((acc, sentiment) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantSentiment = Object.entries(sentimentCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  return {
    consensus_score: avgDemand,
    variance_score: variance_score,
    confidence_interval: {
      lower: Math.max(0, avgDemand - Math.sqrt(demandVariance)),
      upper: Math.min(100, avgDemand + Math.sqrt(demandVariance)),
      confidence_level: avgConfidence
    },
    risk_factors: [...new Set(allRiskFactors)].slice(0, 5),
    opportunity_factors: [...new Set(allOpportunityFactors)].slice(0, 5),
    market_sentiment: dominantSentiment,
    validation_score: variance_score * (avgConfidence / 100)
  };
}