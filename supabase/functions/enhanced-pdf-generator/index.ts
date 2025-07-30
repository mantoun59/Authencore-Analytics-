import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssessmentData {
  assessmentType: string;
  userInfo: {
    name: string;
    email: string;
    assessmentDate?: string;
    questionsAnswered?: number;
    timeSpent?: string;
    reliabilityScore?: number;
    reportId?: string;
  };
  overallScore?: number;
  dimensions?: Array<{ name: string; score: number; description?: string; level?: string }>;
  strengths?: string[];
  developmentAreas?: string[];
  recommendations?: string[];
  careerMatches?: Array<{ title: string; match: number; description?: string }>;
  riasecResults?: Record<string, number>;
}

// Simple PDF generation using basic formatting
const generateSimplePDF = (data: AssessmentData): Uint8Array => {
  // Create a simple text-based PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 16 Tf
50 750 Td
(AuthenCore Analytics - Career Assessment Report) Tj
0 -30 Td
/F1 12 Tf
(Name: ${data.userInfo.name || 'N/A'}) Tj
0 -20 Td
(Email: ${data.userInfo.email || 'N/A'}) Tj
0 -20 Td
(Date: ${data.userInfo.assessmentDate || new Date().toLocaleDateString()}) Tj
0 -40 Td
/F1 14 Tf
(Assessment Results:) Tj
0 -25 Td
/F1 12 Tf
${data.overallScore ? `(Overall Score: ${data.overallScore}/100) Tj 0 -20 Td` : ''}
${data.userInfo.reliabilityScore ? `(Reliability: ${data.userInfo.reliabilityScore}%) Tj 0 -20 Td` : ''}
0 -30 Td
/F1 14 Tf
(Career Matches:) Tj
${data.careerMatches ? data.careerMatches.slice(0, 3).map((match, i) => 
  `0 -20 Td /F1 12 Tf (${i + 1}. ${match.title} - ${match.match}% match) Tj`
).join(' ') : ''}
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000062 00000 n 
0000000119 00000 n 
0000000246 00000 n 
0000000800 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
878
%%EOF`;

  return new TextEncoder().encode(pdfContent);
};

serve(async (req) => {
  console.log('Simple PDF Generator called:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data: AssessmentData = await req.json();
    console.log('Generating simple PDF for user:', data.userInfo?.name);

    // Generate simple PDF
    const pdfBuffer = generateSimplePDF(data);

    console.log('Simple PDF generated successfully, size:', pdfBuffer.length);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(data.userInfo.name || 'Assessment').replace(/[^a-zA-Z0-9]/g, '_')}_Report.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'PDF generation failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});