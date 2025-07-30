// Development server for Edge Functions
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

const functionRoutes = {
  '/ai-chatbot': () => import('./ai-chatbot/index.ts'),
  '/create-payment-order': () => import('./create-payment-order/index.ts'),
  '/enhanced-ai-analysis': () => import('./enhanced-ai-analysis/index.ts'),
  '/enhanced-pdf-generator': () => import('./enhanced-pdf-generator/index.ts'),
  '/generate-ai-report': () => import('./generate-ai-report/index.ts'),
  '/generate-image': () => import('./generate-image/index.ts'),
  '/process-assessment': () => import('./process-assessment/index.ts'),
  '/security-middleware': () => import('./security-middleware/index.ts'),
  '/send-assessment-report': () => import('./send-assessment-report/index.ts'),
  '/send-partner-credentials': () => import('./send-partner-credentials/index.ts'),
  '/storage-monitor': () => import('./storage-monitor/index.ts'),
  '/update-payment-status': () => import('./update-payment-status/index.ts'),
};

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  // Health check endpoint
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      environment: 'development'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    });
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Route to appropriate function
  const functionPath = url.pathname;
  const functionHandler = functionRoutes[functionPath as keyof typeof functionRoutes];
  
  if (functionHandler) {
    try {
      const module = await functionHandler();
      // The imported module should export a default handler
      if (module.default && typeof module.default === 'function') {
        return await module.default(req);
      }
      // Fallback to serve function if exported
      if (module.serve && typeof module.serve === 'function') {
        return await module.serve(req);
      }
    } catch (error) {
      console.error(`Error loading function ${functionPath}:`, error);
      return new Response(
        JSON.stringify({ 
          error: 'Function loading error',
          message: error.message 
        }),
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          },
        }
      );
    }
  }
  
  // Function not found
  return new Response(
    JSON.stringify({ 
      error: 'Function not found',
      available: Object.keys(functionRoutes)
    }),
    {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      },
    }
  );
};

console.log('🚀 Development server starting on port 8080');
console.log('📡 Available functions:', Object.keys(functionRoutes));

serve(handler, { port: 8080 });