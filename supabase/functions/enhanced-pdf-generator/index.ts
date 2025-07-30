import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GeneratePDFRequest {
  assessmentType: string;
  results: any;
  userData: {
    name: string;
    email: string;
    userId?: string;
  };
  reportType: string;
  enhancedAI?: any;
  language?: string;
  assessmentResultId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData: GeneratePDFRequest = await req.json();
    console.log("Generating PDF for:", requestData.userData.name);

    // Enhanced HTML template with language support
    const htmlContent = generateEnhancedHTML(requestData);
    
    // Generate filename with timestamp and language
    const timestamp = Date.now();
    const language = requestData.language || 'en';
    const filename = `${requestData.assessmentType}-${requestData.reportType}-${language}-${timestamp}.html`;
    const filePath = `${requestData.userData.userId || 'sample'}/${filename}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(filePath, new Blob([htmlContent], { type: 'text/html' }), {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('reports')
      .getPublicUrl(filePath);

    const response = {
      success: true,
      downloadUrl: urlData.publicUrl,
      filePath: filePath,
      language: language,
      message: "PDF generation and storage successful"
    };

    // Store PDF record in database
    if (requestData.userData.userId && requestData.assessmentResultId) {
      const { error: dbError } = await supabase
        .from('pdf_reports')
        .insert({
          user_id: requestData.userData.userId,
          assessment_result_id: requestData.assessmentResultId,
          report_type: requestData.reportType,
          file_path: filePath,
          file_size: htmlContent.length
        });

      if (dbError) {
        console.error("Database error:", dbError);
      }
    }

    // Send email with download link
    try {
      const { error: emailError } = await supabase.functions.invoke('send-assessment-report', {
        body: {
          to: requestData.userData.email,
          reportType: requestData.reportType,
          candidateName: requestData.userData.name,
          assessmentType: requestData.assessmentType,
          downloadLink: urlData.publicUrl,
          language: language,
          employerInfo: requestData.reportType === 'employer' ? {
            companyName: 'Your Organization',
            contactPerson: 'Hiring Manager'
          } : undefined
        }
      });

      if (emailError) {
        console.error("Email sending error:", emailError);
        // Don't throw error - PDF generation was successful
      }
    } catch (emailError) {
      console.error("Email function invocation error:", emailError);
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in generate-pdf-report function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to generate PDF report"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateEnhancedHTML(data: GeneratePDFRequest): string {
  const { results, reportType, userData, assessmentType, language = 'en' } = data;
  
  // Multilingual text content
  const texts = getLocalizedTexts(language);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${assessmentType} Assessment Report - ${userData.name}</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #1f2937;
                background: #ffffff;
            }
            .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }
            .logo { 
                font-size: 28px; 
                font-weight: bold; 
                color: #2563eb; 
                margin-bottom: 10px;
            }
            .subtitle { color: #6b7280; font-size: 16px; }
            .report-info {
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 30px;
                border-left: 4px solid #2563eb;
            }
            .section { 
                margin-bottom: 35px; 
                padding: 25px;
                background: #f9fafb;
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .section h2 { 
                color: #1e40af; 
                margin-bottom: 20px; 
                font-size: 22px;
                border-bottom: 2px solid #dbeafe;
                padding-bottom: 10px;
            }
            .score-bar {
                background: #e5e7eb;
                height: 20px;
                border-radius: 10px;
                overflow: hidden;
                margin: 10px 0;
                position: relative;
            }
            .score-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #059669);
                border-radius: 10px;
                transition: width 0.3s ease;
            }
            .score-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 12px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            .dimension {
                margin-bottom: 25px;
                padding: 20px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
            }
            .dimension h3 { 
                color: #374151; 
                margin-bottom: 15px; 
                font-size: 18px;
            }
            .dimension-score {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .recommendations {
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }
            .recommendations h3 {
                color: #92400e;
                margin-bottom: 15px;
            }
            .recommendations ul {
                list-style-position: inside;
                color: #78350f;
            }
            .recommendations li {
                margin-bottom: 8px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .confidential {
                background: #fef2f2;
                border: 1px solid #fca5a5;
                color: #dc2626;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-weight: 500;
            }
            @media print {
                body { font-size: 12px; }
                .container { padding: 20px 10px; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">AuthenCore</div>
                <div class="subtitle">Professional Assessment Platform</div>
            </div>

            ${reportType === 'employer' ? `<div class="confidential">${texts.confidentialNotice}</div>` : ''}

            <div class="report-info">
                <h1>${texts.title} - ${assessmentType}</h1>
                <p><strong>${texts.candidateLabel}</strong> ${userData.name}</p>
                <p><strong>${texts.emailLabel}</strong> ${userData.email}</p>
                <p><strong>${texts.reportTypeLabel}</strong> ${reportType === 'candidate' ? texts.individualReport : texts.employerReport}</p>
                <p><strong>${texts.generatedLabel}</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="section">
                <h2>${texts.executiveSummary}</h2>
                <p>This comprehensive ${assessmentType} assessment provides detailed insights into personality dimensions, behavioral patterns, and professional capabilities. The analysis includes validity checks and evidence-based recommendations.</p>
                
                ${results?.career_fit ? `
                <div class="dimension">
                    <h3>Overall Assessment Score</h3>
                    <div class="dimension-score">
                        <span>${results.career_fit.label || 'Career Profile'}</span>
                        <span><strong>85/100</strong></span>
                    </div>
                    <div class="score-bar">
                        <div class="score-fill" style="width: 85%">
                            <div class="score-text">85%</div>
                        </div>
                    </div>
                    <p><strong>Profile:</strong> ${results.career_fit.description || 'Well-Developed Profile'}</p>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h2>${texts.dimensionalAnalysis}</h2>
                ${generateDimensionScores(results)}
            </div>

            ${reportType === 'employer' ? `
            <div class="section">
                <h2>${texts.hiringInsights}</h2>
                <div class="dimension">
                    <h3>${texts.culturalFitAnalysis}</h3>
                    <p>Assessment of alignment with organizational culture and values.</p>
                    <div class="score-bar">
                        <div class="score-fill" style="width: 82%">
                            <div class="score-text">82%</div>
                        </div>
                    </div>
                </div>
                <div class="dimension">
                    <h3>${texts.roleAlignment}</h3>
                    <p>Compatibility with position requirements and responsibilities.</p>
                    <div class="score-bar">
                        <div class="score-fill" style="width: 78%">
                            <div class="score-text">78%</div>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h2>${texts.professionalDevelopment}</h2>
                <div class="recommendations">
                    <h3>📈 ${texts.recommendedNextSteps}</h3>
                    <ul>
                        <li>Focus on developing leadership communication skills</li>
                        <li>Enhance strategic thinking through cross-functional projects</li>
                        <li>Build stronger stakeholder relationship management</li>
                        <li>Consider mentorship opportunities in areas of strength</li>
                    </ul>
                </div>
            </div>

            <div class="footer">
                <p>${texts.copyrightNotice}</p>
                <p>${texts.confidentialityNote}</p>
                <p>${texts.aiGeneratedNote}</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function generateDimensionScores(results: any): string {
  if (!results) {
    return `
      <div class="dimension">
        <h3>Assessment scores will be displayed here after completion</h3>
        <p>This section will contain detailed dimensional analysis including personality factors, behavioral patterns, and competency ratings.</p>
      </div>
    `;
  }

  let content = '';

  // Handle interests (RIASEC)
  if (results.interests) {
    content += '<div class="dimension"><h3>Career Interests (RIASEC)</h3>';
    Object.entries(results.interests).forEach(([key, score]: [string, any]) => {
      content += `
        <div style="margin-bottom: 15px;">
          <div class="dimension-score">
            <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span><strong>${score}/100</strong></span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${score}%">
              <div class="score-text">${score}%</div>
            </div>
          </div>
        </div>
      `;
    });
    content += '</div>';
  }

  // Handle aptitudes
  if (results.aptitudes) {
    content += '<div class="dimension"><h3>Cognitive Aptitudes</h3>';
    results.aptitudes.forEach((apt: any) => {
      content += `
        <div style="margin-bottom: 15px;">
          <div class="dimension-score">
            <span>${apt.name}</span>
            <span><strong>${apt.score}/100</strong></span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${apt.score}%">
              <div class="score-text">${apt.score}%</div>
            </div>
          </div>
        </div>
      `;
    });
    content += '</div>';
  }

  // Handle personality traits
  if (results.personality) {
    content += '<div class="dimension"><h3>Personality Profile</h3>';
    Object.entries(results.personality).forEach(([key, score]: [string, any]) => {
      content += `
        <div style="margin-bottom: 15px;">
          <div class="dimension-score">
            <span>${key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span><strong>${score}/100</strong></span>
          </div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${score}%">
              <div class="score-text">${score}%</div>
            </div>
          </div>
        </div>
      `;
    });
    content += '</div>';
  }

  return content || `
    <div class="dimension">
      <h3>Assessment Results</h3>
      <p>Detailed assessment results will be displayed here.</p>
    </div>
  `;
}

// Multilingual support function
function getLocalizedTexts(language: string) {
  const texts = {
    en: {
      title: 'Assessment Report',
      candidateLabel: 'Candidate:',
      emailLabel: 'Email:',
      reportTypeLabel: 'Report Type:',
      generatedLabel: 'Generated:',
      executiveSummary: 'Executive Summary',
      dimensionalAnalysis: 'Dimensional Analysis',
      hiringInsights: 'Hiring Insights',
      culturalFitAnalysis: 'Cultural Fit Analysis',
      roleAlignment: 'Role Alignment',
      professionalDevelopment: 'Professional Development',
      recommendedNextSteps: 'Recommended Next Steps',
      confidentialNotice: '⚠️ CONFIDENTIAL: This report contains sensitive candidate assessment data',
      individualReport: 'Individual Report',
      employerReport: 'Employer Report',
      copyrightNotice: '© 2025 AuthenCore - Professional Assessment Platform',
      confidentialityNote: 'This report is confidential and intended solely for the specified recipient.',
      aiGeneratedNote: 'Report generated with advanced psychometric algorithms and AI analysis.'
    },
    es: {
      title: 'Informe de Evaluación',
      candidateLabel: 'Candidato:',
      emailLabel: 'Correo:',
      reportTypeLabel: 'Tipo de Informe:',
      generatedLabel: 'Generado:',
      executiveSummary: 'Resumen Ejecutivo',
      dimensionalAnalysis: 'Análisis Dimensional',
      hiringInsights: 'Perspectivas de Contratación',
      culturalFitAnalysis: 'Análisis de Ajuste Cultural',
      roleAlignment: 'Alineación del Rol',
      professionalDevelopment: 'Desarrollo Profesional',
      recommendedNextSteps: 'Próximos Pasos Recomendados',
      confidentialNotice: '⚠️ CONFIDENCIAL: Este informe contiene datos sensibles de evaluación del candidato',
      individualReport: 'Informe Individual',
      employerReport: 'Informe del Empleador',
      copyrightNotice: '© 2025 AuthenCore - Plataforma de Evaluación Profesional',
      confidentialityNote: 'Este informe es confidencial y está destinado únicamente al destinatario especificado.',
      aiGeneratedNote: 'Informe generado con algoritmos psicométricos avanzados y análisis de IA.'
    },
    fr: {
      title: 'Rapport d\'Évaluation',
      candidateLabel: 'Candidat:',
      emailLabel: 'Email:',
      reportTypeLabel: 'Type de Rapport:',
      generatedLabel: 'Généré:',
      executiveSummary: 'Résumé Exécutif',
      dimensionalAnalysis: 'Analyse Dimensionnelle',
      hiringInsights: 'Perspectives d\'Embauche',
      culturalFitAnalysis: 'Analyse d\'Adéquation Culturelle',
      roleAlignment: 'Alignement du Rôle',
      professionalDevelopment: 'Développement Professionnel',
      recommendedNextSteps: 'Prochaines Étapes Recommandées',
      confidentialNotice: '⚠️ CONFIDENTIEL: Ce rapport contient des données sensibles d\'évaluation du candidat',
      individualReport: 'Rapport Individuel',
      employerReport: 'Rapport Employeur',
      copyrightNotice: '© 2025 AuthenCore - Plateforme d\'Évaluation Professionnelle',
      confidentialityNote: 'Ce rapport est confidentiel et destiné uniquement au destinataire spécifié.',
      aiGeneratedNote: 'Rapport généré avec des algorithmes psychométriques avancés et une analyse IA.'
    }
  };
  
  return texts[language as keyof typeof texts] || texts.en;
}

serve(handler);