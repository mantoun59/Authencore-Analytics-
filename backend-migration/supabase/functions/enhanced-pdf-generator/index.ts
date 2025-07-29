import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface PDFRequest {
  assessmentId: string;
  reportType: 'individual' | 'employer' | 'detailed';
  includeCharts?: boolean;
  template?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentId, reportType, includeCharts = true, template = 'default' }: PDFRequest = await req.json();

    console.log(`Generating ${reportType} PDF for assessment ${assessmentId}`);

    // Get assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) {
      throw new Error(`Assessment not found: ${assessmentError.message}`);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', assessment.user_id)
      .single();

    // Generate PDF content based on assessment type and report type
    const pdfContent = await generatePDFContent(assessment, profile, reportType, template);

    // Convert to PDF using HTML-to-PDF service
    const pdfBuffer = await generatePDFFromHTML(pdfContent);

    // Upload to storage
    const fileName = `${assessmentId}-${reportType}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('reports')
      .getPublicUrl(fileName);

    // Save PDF record
    const { data: pdfRecord, error: pdfError } = await supabase
      .from('pdf_reports')
      .insert({
        user_id: assessment.user_id,
        assessment_result_id: assessmentId,
        report_type: reportType,
        file_path: fileName,
        file_size: pdfBuffer.byteLength
      })
      .select()
      .single();

    if (pdfError) {
      console.error('Failed to save PDF record:', pdfError);
    }

    // Log generation event
    await supabase.rpc('log_analytics_event', {
      p_event_type: 'pdf_generated',
      p_entity_type: 'report',
      p_entity_id: pdfRecord?.id,
      p_metadata: {
        assessment_id: assessmentId,
        report_type: reportType,
        file_size: pdfBuffer.byteLength,
        template: template
      }
    });

    return new Response(JSON.stringify({
      success: true,
      pdfUrl: publicUrl,
      fileName: fileName,
      fileSize: pdfBuffer.byteLength,
      reportId: pdfRecord?.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('PDF generation error:', error);
    
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generatePDFContent(assessment: any, profile: any, reportType: string, template: string): Promise<string> {
  const results = assessment.results;
  const assessmentType = assessment.assessment_type;
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${reportType} Assessment Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .score-card { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .high-score { border-left: 4px solid #28a745; }
        .medium-score { border-left: 4px solid #ffc107; }
        .low-score { border-left: 4px solid #dc3545; }
        .chart-placeholder { width: 100%; height: 300px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #007bff; color: white; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AuthenCore Analytics Report</h1>
        <h2>${getAssessmentTitle(assessmentType)} - ${reportType} Report</h2>
        <p>Generated for: ${profile?.full_name || 'User'}</p>
        <p>Date: ${new Date(assessment.completed_at).toLocaleDateString()}</p>
      </div>
  `;

  // Add executive summary
  htmlContent += `
    <div class="section">
      <h3>Executive Summary</h3>
      <p>Overall Score: <strong>${results.overallScore || 'N/A'}</strong></p>
      <p>Profile: <strong>${results.profile || 'Professional Profile'}</strong></p>
    </div>
  `;

  // Add detailed scores
  if (results.scores) {
    htmlContent += `
      <div class="section">
        <h3>Detailed Scores</h3>
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Score</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
    `;

    Object.entries(results.scores).forEach(([dimension, score]: [string, any]) => {
      const scoreNum = typeof score === 'number' ? score : 0;
      const level = getScoreLevel(scoreNum);
      htmlContent += `
        <tr>
          <td>${formatDimensionName(dimension)}</td>
          <td>${scoreNum.toFixed(1)}</td>
          <td>${level}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
      </div>
    `;
  }

  // Add recommendations based on report type
  if (reportType === 'detailed' || reportType === 'individual') {
    htmlContent += generateRecommendations(results, assessmentType);
  }

  // Add employer insights for employer reports
  if (reportType === 'employer') {
    htmlContent += generateEmployerInsights(results, assessmentType);
  }

  htmlContent += `
      <div class="footer">
        <p>This report was generated by AuthenCore Analytics - Professional Assessment Platform</p>
        <p>For questions about this report, please contact your assessment administrator.</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
}

async function generatePDFFromHTML(htmlContent: string): Promise<ArrayBuffer> {
  // This is a simplified PDF generation - in production, you'd use a proper HTML-to-PDF service
  // For now, we'll create a simple PDF-like structure
  const encoder = new TextEncoder();
  return encoder.encode(htmlContent).buffer;
}

function getAssessmentTitle(type: string): string {
  const titles: Record<string, string> = {
    'career-launch': 'Career Launch Assessment',
    'burnout-prevention': 'Burnout Prevention Assessment',
    'emotional-intelligence': 'Emotional Intelligence Assessment',
    'communication-styles': 'Communication Styles Assessment',
    'leadership': 'Leadership Assessment',
    'genz-workplace': 'Gen Z Workplace Assessment'
  };
  return titles[type] || 'Professional Assessment';
}

function formatDimensionName(dimension: string): string {
  return dimension.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function getScoreLevel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Average';
  if (score >= 50) return 'Below Average';
  return 'Needs Development';
}

function generateRecommendations(results: any, assessmentType: string): string {
  const scores = results.scores || {};
  let recommendations = `
    <div class="section">
      <h3>Development Recommendations</h3>
  `;

  Object.entries(scores).forEach(([dimension, score]: [string, any]) => {
    const scoreNum = typeof score === 'number' ? score : 0;
    if (scoreNum < 70) {
      recommendations += `
        <div class="score-card low-score">
          <h4>${formatDimensionName(dimension)}</h4>
          <p>Consider focusing on developing this area through targeted training and practice.</p>
        </div>
      `;
    }
  });

  recommendations += `</div>`;
  return recommendations;
}

function generateEmployerInsights(results: any, assessmentType: string): string {
  return `
    <div class="section">
      <h3>Employer Insights</h3>
      <p>This candidate demonstrates strong potential in key areas relevant to workplace success.</p>
      <p>Consider this assessment as part of a comprehensive evaluation process.</p>
    </div>
  `;
}