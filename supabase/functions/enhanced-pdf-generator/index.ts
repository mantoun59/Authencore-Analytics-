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

// Professional PDF generation with comprehensive features
const generateProfessionalPDF = (data: AssessmentData): Uint8Array => {
  const safeText = (text: any): string => {
    if (text === null || text === undefined || text === '') return 'N/A';
    return String(text).replace(/[()\\]/g, '\\$&').slice(0, 100);
  };

  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : Math.round(num);
  };

  // Process dimensions data properly
  const processDimensions = (dimensions: any): Array<{ name: string; score: number }> => {
    if (!dimensions) return [];
    
    if (Array.isArray(dimensions)) {
      return dimensions.map(dim => ({
        name: safeText(dim.name || 'Unknown'),
        score: safeNumber(dim.score, 0)
      }));
    }
    
    if (typeof dimensions === 'object') {
      return Object.entries(dimensions).map(([key, value]) => ({
        name: safeText(key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()),
        score: safeNumber(value, 0)
      }));
    }
    
    return [];
  };

  const processCareerMatches = (careerMatches: any): Array<{ title: string; match: number; description?: string }> => {
    if (!careerMatches || !Array.isArray(careerMatches)) return [];
    
    return careerMatches.map(match => ({
      title: safeText(match.title || match.name || 'Career Opportunity'),
      match: safeNumber(match.match || match.score || match.percentage, 0),
      description: safeText(match.description || 'Excellent career match based on your profile')
    }));
  };

  const processRecommendations = (recommendations: any): string[] => {
    if (!recommendations) return [];
    if (Array.isArray(recommendations)) {
      return recommendations.map(rec => safeText(rec)).filter(rec => rec !== 'N/A');
    }
    if (typeof recommendations === 'string') {
      return [safeText(recommendations)].filter(rec => rec !== 'N/A');
    }
    return [];
  };

  const createProgressBar = (score: number, width: number = 200): string => {
    const filled = Math.round((score / 100) * width);
    return `q
${width} 0 0 8 50 0 cm
0.9 0.9 0.9 rg
0 0 ${width} 8 re f
Q
q
${filled} 0 0 8 50 0 cm
0 0.5 0.5 rg
0 0 ${filled} 8 re f
Q`;
  };

  const riasecTypes = [
    { name: 'Realistic', color: '0 0.5 0.5 rg', desc: 'Hands-on, practical, mechanical' },
    { name: 'Investigative', color: '0.13 0.55 0.13 rg', desc: 'Research, analysis, problem-solving' },
    { name: 'Artistic', color: '1 0.6 0 rg', desc: 'Creative, expressive, innovative' },
    { name: 'Social', color: '0.18 0.55 0.34 rg', desc: 'People-focused, helping, teaching' },
    { name: 'Enterprising', color: '1 0.84 0 rg', desc: 'Leadership, business, persuasion' },
    { name: 'Conventional', color: '0.1 0.1 0.44 rg', desc: 'Organized, detail-oriented, systematic' }
  ];

  // Process data properly
  const processedDimensions = processDimensions(data.dimensions || data.riasecResults);
  const processedCareerMatches = processCareerMatches(data.careerMatches);
  const processedRecommendations = processRecommendations(data.recommendations);

  // Generate comprehensive PDF content with logo
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
/Kids [3 0 R 4 0 R 5 0 R 6 0 R 7 0 R]
/Count 5
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 8 0 R
/Resources <<
  /Font <<
    /F1 9 0 R
    /F2 10 0 R
  >>
>>
>>
endobj

4 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 11 0 R
/Resources <<
  /Font <<
    /F1 9 0 R
    /F2 10 0 R
  >>
>>
>>
endobj

5 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 12 0 R
/Resources <<
  /Font <<
    /F1 9 0 R
    /F2 10 0 R
  >>
>>
>>
endobj

6 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 13 0 R
/Resources <<
  /Font <<
    /F1 9 0 R
    /F2 10 0 R
  >>
>>
>>
endobj

7 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 14 0 R
/Resources <<
  /Font <<
    /F1 9 0 R
    /F2 10 0 R
  >>
>>
>>
endobj

8 0 obj
<<
/Length 2000
>>
stream
BT

% Header Background with Logo Area
q
0 0.5 0.5 rg
0 720 612 72 re f
Q

% Logo placeholder (simple graphics)
q
1 1 1 rg
20 740 40 40 re f
0 0.5 0.5 RG
2 w
20 740 40 40 re S
Q
BT
/F2 8 Tf
0 0.5 0.5 rg
25 760 Td
(AuthenCore) Tj
0 -8 Td
/F1 6 Tf
(Analytics) Tj
ET

% Header Text
/F2 24 Tf
1 1 1 rg
70 750 Td
(AuthenCore Analytics) Tj
0 -20 Td
/F1 14 Tf
(Career Launch Assessment Report) Tj

% Confidential Badge
q
0.86 0.2 0.34 rg
450 740 120 20 re f
Q
BT
/F2 10 Tf
1 1 1 rg
460 745 Td
(CONFIDENTIAL) Tj
ET

% User Profile Card
q
0.97 0.98 0.98 rg
50 620 512 120 re f
0 0.5 0.5 RG
2 w
50 620 512 120 re S
Q

% Profile Header
q
0 0.5 0.5 rg
50 720 512 20 re f
Q
BT
/F2 14 Tf
1 1 1 rg
60 725 Td
(Candidate Profile) Tj
ET

% User Details
BT
/F1 12 Tf
0 0 0 rg
60 690 Td
(Name: ${safeText(data.userInfo.name)}) Tj
0 -20 Td
(Email: ${safeText(data.userInfo.email)}) Tj
250 0 Td
(Date: ${safeText(data.userInfo.assessmentDate || new Date().toLocaleDateString())}) Tj
0 -20 Td
(Report ID: ${safeText(data.userInfo.reportId || 'CLR-' + Date.now())}) Tj
ET

% Key Metrics Cards
${data.overallScore ? `
q
1 1 1 rg
50 480 240 100 re f
0.8 0.8 0.8 RG
1 w
50 480 240 100 re S
0 0.5 0.5 rg
50 560 240 20 re f
Q
BT
/F2 12 Tf
1 1 1 rg
60 565 Td
(Overall Score) Tj
/F2 32 Tf
0 0.5 0.5 rg
130 520 Td
(${data.overallScore}) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
130 500 Td
(out of 100) Tj
ET
` : ''}

${data.userInfo.reliabilityScore ? `
q
1 1 1 rg
322 480 240 100 re f
0.8 0.8 0.8 RG
1 w
322 480 240 100 re S
0.13 0.55 0.13 rg
322 560 240 20 re f
Q
BT
/F2 12 Tf
1 1 1 rg
332 565 Td
(Reliability Score) Tj
/F2 32 Tf
0.13 0.55 0.13 rg
390 520 Td
(${data.userInfo.reliabilityScore}%) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
390 500 Td
(response quality) Tj
ET
` : ''}

% Executive Summary
BT
/F2 18 Tf
0 0.3 0.3 rg
50 420 Td
(Executive Summary) Tj
/F1 11 Tf
0.2 0.2 0.2 rg
50 390 Td
(This comprehensive career assessment analyzes your interests, aptitudes,) Tj
0 -15 Td
(and personality traits to provide personalized career recommendations) Tj
0 -15 Td
(based on scientifically validated methodologies.) Tj
ET

% Page Footer
BT
/F1 8 Tf
0.5 0.5 0.5 rg
50 30 Td
(AuthenCore Analytics - Professional Career Assessment Platform) Tj
450 0 Td
(Page 1 of 5) Tj
ET

ET
endstream
endobj

11 0 obj
<<
/Length 2500
>>
stream
BT

% Page Header
q
0 0.3 0.3 rg
0 740 612 30 re f
Q
BT
/F2 16 Tf
1 1 1 rg
50 750 Td
(RIASEC Interest Profile Analysis) Tj
ET

% RIASEC Description
BT
/F1 11 Tf
0.3 0.3 0.3 rg
50 700 Td
(Your interest profile based on Holland's RIASEC model:) Tj
ET

% RIASEC Dimensions
${processedDimensions.slice(0, 6).map((dim, index) => {
  const riasecType = riasecTypes[index] || riasecTypes[0];
  const yPos = 650 - (index * 80);
  return `
% ${dim.name} Section
q
0.98 0.98 0.98 rg
50 ${yPos - 50} 512 70 re f
0.8 0.8 0.8 RG
1 w
50 ${yPos - 50} 512 70 re S
Q

BT
/F2 14 Tf
${riasecType.color}
60 ${yPos - 10} Td
(${safeText(dim.name)}) Tj
/F2 20 Tf
450 0 Td
(${dim.score}) Tj
ET

BT
/F1 10 Tf
0.4 0.4 0.4 rg
60 ${yPos - 25} Td
(${riasecType.desc}) Tj
ET

% Progress Bar
q
${(dim.score / 100) * 400} 0 0 10 60 ${yPos - 45} cm
${riasecType.color}
0 0 1 1 re f
Q
q
400 0 0 10 60 ${yPos - 45} cm
0.9 0.9 0.9 rg
0 0 1 1 re f
Q
`;
}).join('')}

% Page Footer
BT
/F1 8 Tf
0.5 0.5 0.5 rg
50 30 Td
(This report is confidential and intended for professional use only) Tj
450 0 Td
(Page 2 of 5) Tj
ET

ET
endstream
endobj

12 0 obj
<<
/Length 2200
>>
stream
BT

% Page Header
q
0 0.3 0.3 rg
0 740 612 30 re f
Q
BT
/F2 16 Tf
1 1 1 rg
50 750 Td
(Top Career Recommendations) Tj
ET

% Career Intro
BT
/F1 11 Tf
0.3 0.3 0.3 rg
50 700 Td
(Based on your assessment results, here are your top career matches:) Tj
ET

% Career Cards
${processedCareerMatches.slice(0, 5).map((match, index) => {
  const yPos = 650 - (index * 90);
  const matchColor = match.match >= 80 ? '0.13 0.55 0.13 rg' : match.match >= 60 ? '1 0.6 0 rg' : '0 0.5 0.5 rg';
  return `
% Career Card ${index + 1}
q
1 1 1 rg
50 ${yPos - 60} 512 80 re f
0.8 0.8 0.8 RG
1 w
50 ${yPos - 60} 512 80 re S
Q

% Rank Badge
q
1 0.84 0 rg
60 ${yPos - 20} 25 25 re f
Q
BT
/F2 12 Tf
0 0 0 rg
70 ${yPos - 15} Td
(${index + 1}) Tj
ET

% Career Title
BT
/F2 14 Tf
0 0.3 0.3 rg
100 ${yPos - 15} Td
(${safeText(match.title)}) Tj
ET

% Match Percentage
BT
/F2 16 Tf
${matchColor}
450 ${yPos - 15} Td
(${match.match}%) Tj
ET

% Match Bar
q
${(match.match / 100) * 150} 0 0 8 100 ${yPos - 35} cm
${matchColor}
0 0 1 1 re f
Q
q
150 0 0 8 100 ${yPos - 35} cm
0.9 0.9 0.9 rg
0 0 1 1 re f
Q

% Description
${match.description ? `
BT
/F1 10 Tf
0.4 0.4 0.4 rg
100 ${yPos - 50} Td
(${safeText(match.description).slice(0, 80)}...) Tj
ET
` : ''}
`;
}).join('')}

% Page Footer
BT
/F1 8 Tf
0.5 0.5 0.5 rg
50 30 Td
(www.authencore.com) Tj
450 0 Td
(Page 3 of 5) Tj
ET

ET
endstream
endobj

13 0 obj
<<
/Length 2000
>>
stream
BT

% Page Header
q
0 0.3 0.3 rg
0 740 612 30 re f
Q
BT
/F2 16 Tf
1 1 1 rg
50 750 Td
(Personal Development Roadmap) Tj
ET

% Roadmap Intro
BT
/F1 11 Tf
0.3 0.3 0.3 rg
50 700 Td
(Your personalized development roadmap with prioritized action items:) Tj
ET

% Development Recommendations
${processedRecommendations.slice(0, 6).map((rec, index) => {
  const yPos = 650 - (index * 80);
  const priorities = [
    { label: 'Immediate Focus', color: '0.86 0.2 0.34 rg', timeframe: '1-3 months' },
    { label: 'Medium Term', color: '1 0.6 0 rg', timeframe: '3-6 months' },
    { label: 'Long-term Goal', color: '0.13 0.55 0.13 rg', timeframe: '6-12 months' }
  ];
  const priority = priorities[index % 3];
  return `
% Recommendation ${index + 1}
q
1 1 1 rg
50 ${yPos - 50} 512 70 re f
0.8 0.8 0.8 RG
1 w
50 ${yPos - 50} 512 70 re S
Q

% Priority Stripe
q
${priority.color}
50 ${yPos - 50} 5 70 re f
Q

% Step Number
q
${priority.color}
70 ${yPos - 20} 20 20 re f
Q
BT
/F2 10 Tf
1 1 1 rg
78 ${yPos - 15} Td
(${index + 1}) Tj
ET

% Priority Label
BT
/F2 11 Tf
${priority.color}
105 ${yPos - 10} Td
(${priority.label}) Tj
/F1 9 Tf
0.4 0.4 0.4 rg
300 0 Td
(Timeline: ${priority.timeframe}) Tj
ET

% Recommendation Text
BT
/F1 11 Tf
0.2 0.2 0.2 rg
105 ${yPos - 30} Td
(${safeText(rec).slice(0, 80)}...) Tj
ET
`;
}).join('')}

% Page Footer
BT
/F1 8 Tf
0.5 0.5 0.5 rg
50 30 Td
(Generated on ${new Date().toLocaleDateString()}) Tj
450 0 Td
(Page 4 of 5) Tj
ET

ET
endstream
endobj

14 0 obj
<<
/Length 1800
>>
stream
BT

% Page Header
q
0 0.3 0.3 rg
0 740 612 30 re f
Q
BT
/F2 16 Tf
1 1 1 rg
50 750 Td
(Assessment Methodology & Validity) Tj
ET

% Methodology Description
BT
/F1 11 Tf
0.3 0.3 0.3 rg
50 700 Td
(This assessment is based on scientifically validated methodologies:) Tj
ET

% Methodology Cards
q
1 1 1 rg
50 580 240 100 re f
0.8 0.8 0.8 RG
1 w
50 580 240 100 re S
Q
BT
/F2 12 Tf
0 0.5 0.5 rg
60 650 Td
(Holland RIASEC Theory) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
60 630 Td
(Six personality types and work) Tj
0 -12 Td
(environments for career matching) Tj
ET

q
1 1 1 rg
322 580 240 100 re f
0.8 0.8 0.8 RG
1 w
322 580 240 100 re S
Q
BT
/F2 12 Tf
0 0.5 0.5 rg
332 650 Td
(O*NET Career Database) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
332 630 Td
(900+ career profiles with detailed) Tj
0 -12 Td
(requirements and outcomes) Tj
ET

q
1 1 1 rg
50 450 240 100 re f
0.8 0.8 0.8 RG
1 w
50 450 240 100 re S
Q
BT
/F2 12 Tf
0 0.5 0.5 rg
60 520 Td
(Cognitive Aptitude Assessment) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
60 500 Td
(Validated measures of reasoning) Tj
0 -12 Td
(and problem-solving abilities) Tj
ET

q
1 1 1 rg
322 450 240 100 re f
0.8 0.8 0.8 RG
1 w
322 450 240 100 re S
Q
BT
/F2 12 Tf
0 0.5 0.5 rg
332 520 Td
(Response Quality Validation) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
332 500 Td
(Statistical analysis ensures) Tj
0 -12 Td
(reliable and consistent responses) Tj
ET

% Assessment Statistics
BT
/F2 14 Tf
0 0.3 0.3 rg
50 380 Td
(Assessment Statistics) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
60 350 Td
(Questions Answered: ${data.userInfo.questionsAnswered || 'N/A'}) Tj
0 -15 Td
(Time Spent: ${data.userInfo.timeSpent || 'N/A'}) Tj
0 -15 Td
(Reliability Score: ${data.userInfo.reliabilityScore || 'N/A'}%) Tj
0 -15 Td
(Report Generated: ${new Date().toLocaleDateString()}) Tj
ET

% Footer Section
q
0.95 0.95 0.95 rg
0 100 612 80 re f
Q
BT
/F2 12 Tf
0 0.3 0.3 rg
50 150 Td
(AuthenCore Analytics) Tj
/F1 10 Tf
0.4 0.4 0.4 rg
50 130 Td
(Professional Career Assessment Platform) Tj
0 -15 Td
(This report is confidential and intended for professional use only) Tj
ET

% Page Footer
BT
/F1 8 Tf
0.5 0.5 0.5 rg
50 30 Td
(Contact: www.authencore.com) Tj
450 0 Td
(Page 5 of 5) Tj
ET

ET
endstream
endobj

9 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

10 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

xref
0 15
0000000000 65535 f 
0000000010 00000 n 
0000000062 00000 n 
0000000140 00000 n 
0000000280 00000 n 
0000000420 00000 n 
0000000560 00000 n 
0000000700 00000 n 
0000000840 00000 n 
0000002890 00000 n 
0000002950 00000 n 
0000003015 00000 n 
0000005565 00000 n 
0000007815 00000 n 
0000009865 00000 n 
trailer
<<
/Size 15
/Root 1 0 R
>>
startxref
11715
%%EOF`;

  return new TextEncoder().encode(pdfContent);
};

serve(async (req) => {
  console.log('Professional PDF Generator called:', req.method);

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
    console.log('Generating professional PDF for user:', data.userInfo?.name);

    // Generate comprehensive PDF
    const pdfBuffer = generateProfessionalPDF(data);

    console.log('Professional PDF generated successfully, size:', pdfBuffer.length);

    return new Response(pdfBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(data.userInfo.name || 'Assessment').replace(/[^a-zA-Z0-9]/g, '_')}_Professional_Report.pdf"`
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