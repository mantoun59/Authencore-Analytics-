// Production server for Edge Functions
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('CORS_ORIGIN') || '*',
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

// Request logging middleware
const logRequest = (req: Request, startTime: number, status: number) => {
  const duration = Date.now() - startTime;
  const url = new URL(req.url);
  
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: url.pathname,
    status,
    duration,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
  }));
};

const handler = async (req: Request): Promise<Response> => {
  const startTime = Date.now();
  
  try {
    const url = new URL(req.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      const response = new Response(JSON.stringify({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: 'production',
        uptime: process.uptime?.() || 0
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      });
      
      logRequest(req, startTime, 200);
      return response;
    }
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      const response = new Response(null, { headers: corsHeaders });
      logRequest(req, startTime, 200);
      return response;
    }
    
    // Route to appropriate function
    const functionPath = url.pathname;
    const functionHandler = functionRoutes[functionPath as keyof typeof functionRoutes];
    
    if (functionHandler) {
      try {
        const module = await functionHandler();
        let response: Response;
        
        // The imported module should export a default handler
        if (module.default && typeof module.default === 'function') {
          response = await module.default(req);
        } else if (module.serve && typeof module.serve === 'function') {
          response = await module.serve(req);
        } else {
          throw new Error('No valid handler found in module');
        }
        
        logRequest(req, startTime, response.status);
        return response;
        
      } catch (error) {
        console.error(`Error in function ${functionPath}:`, error);
        
        const response = new Response(
          JSON.stringify({ 
            error: 'Internal server error'
          }),
          {
            status: 500,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders 
            },
          }
        );
        
        logRequest(req, startTime, 500);
        return response;
      }
    }
    
    // Function not found
    const response = new Response(
      JSON.stringify({ 
        error: 'Endpoint not found'
      }),
      {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
    
    logRequest(req, startTime, 404);
    return response;
    
  } catch (error) {
    console.error('Server error:', error);
    
    const response = new Response(
      JSON.stringify({ 
        error: 'Server error' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
    
    logRequest(req, startTime, 500);
    return response;
  }
};

const port = parseInt(Deno.env.get('PORT') || '3000');

console.log(`🚀 Production server starting on port ${port}`);
console.log('📡 Available functions:', Object.keys(functionRoutes));
console.log('🔒 CORS origin:', corsHeaders['Access-Control-Allow-Origin']);

serve(handler, { port });