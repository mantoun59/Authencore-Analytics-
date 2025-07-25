import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketingPDFRequest {
  materialId: string;
  title: string;
  description: string;
  category: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Marketing PDF generation request received');
    
    const { materialId, title, description, category }: MarketingPDFRequest = await req.json();
    
    // Generate professional marketing PDF content
    const pdfContent = await generateMarketingPDF(materialId, title, description, category);
    
    // Create blob and return
    const pdfBlob = new Uint8Array(pdfContent);
    
    return new Response(pdfBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${materialId}-marketing-material.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating marketing PDF:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate marketing PDF', details: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateMarketingPDF(materialId: string, title: string, description: string, category: string): Promise<ArrayBuffer> {
  // Generate comprehensive marketing content with proper PDF structure
  const richContent = generateRichMarketingContent(materialId, title, description, category);
  
  // Create a properly formatted PDF with multiple pages and rich content
  const pdfStructure = createProfessionalPDF(richContent);
  
  const encoder = new TextEncoder();
  return encoder.encode(pdfStructure).buffer;
}

function generateRichMarketingContent(materialId: string, title: string, description: string, category: string) {
  const contentTemplates: Record<string, any> = {
    'company-brochure': {
      pages: [
        {
          title: 'AuthenCore Analytics',
          subtitle: 'Advanced Psychological Assessment Platform',
          sections: [
            {
              heading: 'Transform Your Talent Decisions',
              content: [
                'AuthenCore Analytics provides cutting-edge psychological assessments powered by AI-driven insights.',
                'Our platform delivers predictive analytics with 85% accuracy in job performance correlation.',
                'Used by Fortune 500 companies to reduce hiring costs by 40% and turnover by 35%.'
              ]
            },
            {
              heading: 'Key Differentiators',
              content: [
                '✓ AI-Driven Scoring Engine with Advanced Analytics',
                '✓ Distortion Scale & Response Validation Technology', 
                '✓ Dual Report System (Applicant & Employer Views)',
                '✓ Multilingual, Co-Branded Output Options',
                '✓ GDPR-Ready Privacy & Data Governance',
                '✓ Certificate of Completion Per Assessment'
              ]
            }
          ]
        },
        {
          title: 'Assessment Portfolio',
          sections: [
            {
              heading: 'Professional Assessment Suite',
              content: [
                'Career Launch Assessment - $9.99',
                'CAIR+ Personality Assessment - $29.99',
                'Emotional Intelligence - $19.99',
                'Leadership Assessment - $39.99',
                'Cultural Intelligence - $19.99',
                'Burnout Prevention Index - $39.99'
              ]
            },
            {
              heading: 'Enterprise Solutions',
              content: [
                'Bulk Assessment Packages',
                'Custom Branding & White-Label Options',
                'API Integrations & HRIS Connections',
                'Dedicated Account Management',
                'Advanced Analytics Dashboards'
              ]
            }
          ]
        }
      ]
    },
    'assessment-technical-specs': {
      pages: [
        {
          title: 'Technical Specifications',
          subtitle: 'Psychometric Properties & Validation Studies',
          sections: [
            {
              heading: 'Reliability Metrics',
              content: [
                'Internal Consistency (Cronbach\'s α): >0.85 across all dimensions',
                'Test-Retest Reliability: >0.80 over 6-month intervals',
                'Inter-rater Reliability: >0.90 for behavioral assessments',
                'Split-half Reliability: >0.88 for cognitive measures'
              ]
            },
            {
              heading: 'Validity Evidence',
              content: [
                'Criterion-related Validity: r=0.65 with job performance',
                'Construct Validity: Confirmed through CFA (RMSEA <0.06)',
                'Convergent Validity: High correlations with established measures',
                'Discriminant Validity: Low correlations with unrelated constructs'
              ]
            },
            {
              heading: 'Compliance Certifications',
              content: [
                'ISO 27001:2013 Information Security Management',
                'GDPR Article 25 - Data Protection by Design',
                'SOC 2 Type II Compliance',
                'APA Standards for Educational and Psychological Testing'
              ]
            }
          ]
        }
      ]
    },
    'enterprise-solutions': {
      pages: [
        {
          title: 'Enterprise Solutions',
          subtitle: 'Scalable Assessment Platform for Large Organizations',
          sections: [
            {
              heading: 'Platform Capabilities',
              content: [
                'Bulk Assessment Processing: 1000+ concurrent users',
                'Custom Branding: Full white-label solutions available',
                'API Integration: RESTful APIs with 99.9% uptime',
                'SSO Integration: SAML, OAuth, Active Directory support',
                'Advanced Analytics: Real-time dashboards and reporting'
              ]
            },
            {
              heading: 'Implementation Support',
              content: [
                'Dedicated Technical Account Manager',
                'Custom Integration Development',
                '24/7 Technical Support',
                'Training and Onboarding Programs',
                'Success Metrics and ROI Tracking'
              ]
            }
          ]
        }
      ]
    }
  };

  // Default content for materials not in templates
  const defaultContent = {
    pages: [
      {
        title: title,
        subtitle: `Professional ${category} Resource`,
        sections: [
          {
            heading: 'Overview',
            content: [description]
          },
          {
            heading: 'Key Features',
            content: [
              'Professional-grade assessment tools',
              'Comprehensive reporting capabilities',
              'Industry-leading accuracy and reliability',
              'Secure, GDPR-compliant platform'
            ]
          }
        ]
      }
    ]
  };

  return contentTemplates[materialId] || defaultContent;
}

function createProfessionalPDF(content: any): string {

  // Create multi-page PDF with rich content
  let pdfContent = "%PDF-1.4\n";
  let objectNum = 1;
  let xrefEntries: string[] = ["0000000000 65535 f "];
  
  // Catalog
  const catalogOffset = pdfContent.length;
  pdfContent += `${objectNum} 0 obj\n<< /Type /Catalog /Pages ${objectNum + 1} 0 R >>\nendobj\n`;
  xrefEntries.push(catalogOffset.toString().padStart(10, '0') + ' 00000 n ');
  objectNum++;
  
  // Pages object
  const pagesOffset = pdfContent.length;
  const pageRefs = content.pages.map((_, i) => `${objectNum + 1 + i} 0 R`).join(' ');
  pdfContent += `${objectNum} 0 obj\n<< /Type /Pages /Kids [${pageRefs}] /Count ${content.pages.length} >>\nendobj\n`;
  xrefEntries.push(pagesOffset.toString().padStart(10, '0') + ' 00000 n ');
  objectNum++;
  
  // Generate pages
  const contentObjects: string[] = [];
  content.pages.forEach((page: any, pageIndex: number) => {
    // Page object
    const pageOffset = pdfContent.length;
    const contentObjNum = objectNum + content.pages.length + pageIndex;
    pdfContent += `${objectNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 ${objectNum + content.pages.length * 2} 0 R /F2 ${objectNum + content.pages.length * 2 + 1} 0 R >> >> >>\nendobj\n`;
    xrefEntries.push(pageOffset.toString().padStart(10, '0') + ' 00000 n ');
    
    // Generate page content
    let y = 750;
    let pageContent = 'BT\n';
    
    // Header with branding
    pageContent += '/F2 28 Tf 50 ' + y + ' Td (AuthenCore Analytics) Tj\n';
    y -= 35;
    pageContent += '/F1 16 Tf 50 ' + y + ' Td (' + page.title + ') Tj\n';
    y -= 25;
    
    if (page.subtitle) {
      pageContent += '/F1 12 Tf 50 ' + y + ' Td (' + page.subtitle + ') Tj\n';
      y -= 30;
    }
    
    // Add sections
    page.sections.forEach((section: any) => {
      if (y < 100) {
        pageContent += 'ET\nBT\n'; // End and start new text block for new page
        y = 750;
      }
      
      pageContent += '/F2 14 Tf 50 ' + y + ' Td (' + section.heading + ') Tj\n';
      y -= 20;
      
      section.content.forEach((item: string) => {
        if (y < 100) return; // Skip if too low on page
        
        // Wrap long text
        const wrappedLines = wrapText(item, 80);
        wrappedLines.forEach((line: string) => {
          pageContent += '/F1 10 Tf 60 ' + y + ' Td (' + line.replace(/[()\\]/g, '\\$&') + ') Tj\n';
          y -= 15;
        });
      });
      y -= 10;
    });
    
    // Footer
    pageContent += '/F1 8 Tf 50 50 Td (AuthenCore Analytics | www.authencore.org | Page ' + (pageIndex + 1) + ') Tj\n';
    pageContent += 'ET';
    
    contentObjects.push(pageContent);
    objectNum++;
  });
  
  // Add content objects
  contentObjects.forEach((content, index) => {
    const contentOffset = pdfContent.length;
    pdfContent += `${objectNum} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`;
    xrefEntries.push(contentOffset.toString().padStart(10, '0') + ' 00000 n ');
    objectNum++;
  });
  
  // Font objects
  const fontOffset1 = pdfContent.length;
  pdfContent += `${objectNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;
  xrefEntries.push(fontOffset1.toString().padStart(10, '0') + ' 00000 n ');
  objectNum++;
  
  const fontOffset2 = pdfContent.length;
  pdfContent += `${objectNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;
  xrefEntries.push(fontOffset2.toString().padStart(10, '0') + ' 00000 n ');
  
  // Cross-reference table
  const xrefOffset = pdfContent.length;
  pdfContent += `xref\n0 ${xrefEntries.length}\n${xrefEntries.join('\n')}\n`;
  
  // Trailer
  pdfContent += `trailer\n<< /Size ${xrefEntries.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  
  return pdfContent;
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length > maxLength) {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        lines.push(word);
      }
    } else {
      currentLine += word + ' ';
    }
  });
  
  if (currentLine) {
    lines.push(currentLine.trim());
  }
  
  return lines;
}