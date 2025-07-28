import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Temporarily disable server-side PDF generation to force client-side generation
  // This prevents "object object" issues in PDFs
  console.log("[GENERATE-PDF-REPORT] Server-side generation disabled - forcing client-side fallback");
  
  return new Response(
    JSON.stringify({ 
      error: { 
        message: "Server-side PDF generation temporarily disabled - use client-side generation" 
      } 
    }),
    { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    }
  );
});