import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // Generate professional HTML content that auto-prints as PDF
    const htmlContent = generateProfessionalHTML(materialId, title, description, category);
    
    // Return HTML that will trigger browser's print dialog for PDF generation
    return new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('Error generating marketing material:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate marketing material', details: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateProfessionalHTML(materialId: string, title: string, description: string, category: string): string {
  const contentData = getContentForMaterial(materialId, title, description, category);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - AuthenCore Analytics</title>
    <style>
        @media print {
            body { 
                margin: 0; 
                font-size: 12pt;
                line-height: 1.4;
            }
            .page-break { 
                page-break-before: always; 
            }
            .no-print {
                display: none !important;
            }
            .header {
                margin: -20px -20px 30px -20px;
            }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        
        .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 40px;
            margin: -20px -20px 40px -20px;
            border-radius: 8px;
            text-align: center;
        }
        
        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
            letter-spacing: -1px;
        }
        
        .tagline {
            font-size: 18px;
            opacity: 0.9;
            font-style: italic;
        }
        
        .main-title {
            font-size: 32px;
            color: #1e40af;
            margin: 30px 0 20px 0;
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 15px;
        }
        
        .description {
            font-size: 18px;
            background: #f8fafc;
            padding: 25px;
            border-left: 5px solid #3b82f6;
            margin: 30px 0;
            border-radius: 5px;
        }
        
        .section {
            margin: 40px 0;
            padding: 30px;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        
        .section-icon {
            margin-right: 10px;
            font-size: 28px;
        }
        
        .content-list {
            list-style: none;
            padding: 0;
        }
        
        .content-list li {
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
            position: relative;
            padding-left: 30px;
        }
        
        .content-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 18px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #bae6fd;
        }
        
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #0369a1;
            display: block;
        }
        
        .stat-label {
            font-size: 14px;
            color: #0284c7;
            margin-top: 5px;
        }
        
        .footer {
            margin-top: 60px;
            padding: 30px;
            background: #1f2937;
            color: white;
            text-align: center;
            border-radius: 8px;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .contact-item {
            padding: 10px;
        }
        
        .price-tag {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 2px solid #f59e0b;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .print-notice {
            background: #fee2e2;
            border: 2px solid #fca5a5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        
        .print-button {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }
        
        .print-button:hover {
            background: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="print-notice no-print">
        <h3>📄 Professional Marketing Material Ready</h3>
        <p>Click the button below to save this as a PDF, or use your browser's File > Print > Save as PDF option.</p>
        <button class="print-button" onclick="window.print()">📥 Save as PDF</button>
        <button class="print-button" onclick="window.close()">❌ Close</button>
    </div>

    <div class="header">
        <div class="logo">AuthenCore Analytics</div>
        <div class="tagline">Transforming Talent Decisions Through Science</div>
    </div>

    <h1 class="main-title">${title}</h1>
    
    <div class="description">
        ${description}
    </div>

    ${contentData.sections.map((section: any) => `
        <div class="section">
            <h2 class="section-title">
                <span class="section-icon">${section.icon || '📊'}</span>
                ${section.title}
            </h2>
            
            ${section.type === 'list' ? `
                <ul class="content-list">
                    ${section.content.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>
            ` : section.type === 'stats' ? `
                <div class="stats-grid">
                    ${section.content.map((stat: any) => `
                        <div class="stat-card">
                            <span class="stat-number">${stat.number}</span>
                            <div class="stat-label">${stat.label}</div>
                        </div>
                    `).join('')}
                </div>
            ` : section.type === 'highlight' ? `
                <div class="highlight-box">
                    ${section.content.map((item: string) => `<p>${item}</p>`).join('')}
                </div>
            ` : `
                <div>
                    ${section.content.map((item: string) => `<p>${item}</p>`).join('')}
                </div>
            `}
        </div>
    `).join('')}

    <div class="footer">
        <h3>Contact AuthenCore Analytics</h3>
        <div class="contact-info">
            <div class="contact-item">
                <strong>Website:</strong><br>
                www.authencore.org
            </div>
            <div class="contact-item">
                <strong>Email:</strong><br>
                info@authencore.org
            </div>
            <div class="contact-item">
                <strong>Support:</strong><br>
                support@authencore.org
            </div>
        </div>
        <p style="margin-top: 20px; opacity: 0.8;">
            © 2024 AuthenCore Analytics. Professional Assessment Platform.
        </p>
    </div>
</body>
</html>`;
}

function getContentForMaterial(materialId: string, title: string, description: string, category: string) {
  const contentTemplates: Record<string, any> = {
    'company-brochure': {
      sections: [
        {
          title: 'Why Choose AuthenCore Analytics?',
          icon: '🎯',
          type: 'list',
          content: [
            'AI-Driven Scoring Engine with 85% accuracy in job performance prediction',
            'Advanced Distortion Scale & Response Validation Technology',
            'Dual Report System - Separate views for applicants and employers',
            'Multilingual Support with Co-Branded Output Options',
            'GDPR-Compliant Data Governance & Privacy Protection',
            'Certificate of Completion for Every Assessment'
          ]
        },
        {
          title: 'Success Metrics',
          icon: '📈',
          type: 'stats',
          content: [
            { number: '50,000+', label: 'Assessments Completed' },
            { number: '85%', label: 'Accuracy Rate' },
            { number: '95%', label: 'Client Satisfaction' },
            { number: '40%', label: 'Cost Reduction' },
            { number: '35%', label: 'Turnover Reduction' },
            { number: '30+', label: 'Industries Served' }
          ]
        },
        {
          title: 'Assessment Portfolio',
          icon: '📋',
          type: 'list',
          content: [
            'Career Launch Assessment - Comprehensive career discovery and planning ($9.99)',
            'CAIR+ Personality Assessment - Advanced personality profiling with validity detection ($29.99)',
            'Emotional Intelligence Assessment - EQ evaluation for workplace success ($19.99)',
            'Leadership Assessment - Executive and management capability analysis ($39.99)',
            'Cultural Intelligence Assessment - Global competency evaluation ($19.99)',
            'Burnout Prevention Index - Stress and resilience assessment ($39.99)',
            'Communication Styles Assessment - Workplace communication analysis ($19.99)',
            'Digital Wellness Assessment - Technology usage and balance evaluation ($19.99)'
          ]
        },
        {
          title: 'Enterprise Solutions',
          icon: '🏢',
          type: 'highlight',
          content: [
            'Bulk Assessment Packages with volume discounts up to 40%',
            'Custom Branding & White-Label Solutions for your organization',
            'API Integrations with popular HRIS systems (Workday, BambooHR, etc.)',
            'Dedicated Account Management and Technical Support',
            'Advanced Analytics Dashboards with real-time insights',
            'Training and Implementation Support Programs'
          ]
        }
      ]
    },
    'assessment-technical-specs': {
      sections: [
        {
          title: 'Psychometric Properties',
          icon: '🔬',
          type: 'list',
          content: [
            'Internal Consistency (Cronbach\'s α): >0.85 across all assessment dimensions',
            'Test-Retest Reliability: >0.80 over 6-month intervals',
            'Inter-rater Reliability: >0.90 for behavioral assessments',
            'Split-half Reliability: >0.88 for cognitive measures',
            'Criterion-related Validity: r=0.65 with job performance outcomes',
            'Construct Validity: Confirmed through Confirmatory Factor Analysis'
          ]
        },
        {
          title: 'Validation Studies',
          icon: '📊',
          type: 'stats',
          content: [
            { number: '15,000+', label: 'Participants in Validation' },
            { number: '0.85+', label: 'Reliability Coefficient' },
            { number: '0.65', label: 'Validity Correlation' },
            { number: '12', label: 'Months Follow-up' }
          ]
        },
        {
          title: 'Compliance & Certifications',
          icon: '🛡️',
          type: 'list',
          content: [
            'ISO 27001:2013 Information Security Management System Certified',
            'GDPR Article 25 - Data Protection by Design and by Default Compliant',
            'SOC 2 Type II Compliance for Security and Availability',
            'APA Standards for Educational and Psychological Testing Adherent',
            'EEOC Guidelines for Employee Selection Procedures Compliant',
            'Bank-level Encryption (AES-256) for Data Protection'
          ]
        }
      ]
    },
    'enterprise-solutions': {
      sections: [
        {
          title: 'Platform Capabilities',
          icon: '⚙️',
          type: 'list',
          content: [
            'Concurrent User Support: 1000+ simultaneous assessments',
            'Custom Branding: Full white-label solutions with your logo and colors',
            'API Integration: RESTful APIs with 99.9% uptime guarantee',
            'SSO Integration: SAML, OAuth 2.0, Active Directory support',
            'Advanced Analytics: Real-time dashboards and comprehensive reporting',
            'Multi-language Support: 15+ languages with cultural adaptations'
          ]
        },
        {
          title: 'Implementation & Support',
          icon: '🤝',
          type: 'highlight',
          content: [
            'Dedicated Technical Account Manager assigned to your organization',
            'Custom Integration Development and API endpoint creation',
            '24/7 Technical Support with guaranteed 4-hour response time',
            'Comprehensive Training Programs for administrators and end-users',
            'Success Metrics Tracking and ROI Analysis reporting',
            'Regular Platform Updates and Feature Enhancements'
          ]
        },
        {
          title: 'Scalability & Performance',
          icon: '📈',
          type: 'stats',
          content: [
            { number: '99.9%', label: 'Uptime Guarantee' },
            { number: '1000+', label: 'Concurrent Users' },
            { number: '<2s', label: 'Average Response Time' },
            { number: '24/7', label: 'Technical Support' }
          ]
        }
      ]
    },
    'roi-case-studies': {
      sections: [
        {
          title: 'Proven ROI Results',
          icon: '💰',
          type: 'stats',
          content: [
            { number: '35%', label: 'Turnover Reduction' },
            { number: '40%', label: 'Hiring Accuracy' },
            { number: '$50,000+', label: 'Annual Savings' },
            { number: '6 months', label: 'ROI Payback Period' }
          ]
        },
        {
          title: 'Success Case Studies',
          icon: '🏆',
          type: 'highlight',
          content: [
            'TechCorp: Reduced technical hiring time by 60% while improving quality scores',
            'HealthSystem Inc: Decreased nurse turnover from 22% to 14% in first year',
            'Global Manufacturing: Improved safety compliance by 45% through better selection',
            'Financial Services Group: Enhanced customer satisfaction scores by 28%'
          ]
        },
        {
          title: 'Implementation Benefits',
          icon: '📈',
          type: 'list',
          content: [
            'Faster hiring decisions with 50% reduction in time-to-hire',
            'Higher employee satisfaction and engagement scores',
            'Reduced training costs through better role-fit matching',
            'Improved team dynamics and collaboration effectiveness',
            'Enhanced diversity and inclusion through bias-free assessments'
          ]
        }
      ]
    },
    'pricing-packages': {
      sections: [
        {
          title: 'Individual Plans',
          icon: '👤',
          type: 'list',
          content: [
            'Solo Assessment: $9.99 - Single assessment with comprehensive report',
            'Career Package: $29.99 - 3 assessments with career coaching insights',
            'Professional Bundle: $49.99 - 5 assessments with priority support'
          ]
        },
        {
          title: 'Business Plans',
          icon: '🏢',
          type: 'list',
          content: [
            'Team Plan: $199/month - Up to 50 assessments per month',
            'Department Plan: $499/month - Up to 150 assessments per month',
            'Enterprise Plan: Custom pricing - Unlimited assessments with white-label options'
          ]
        },
        {
          title: 'Volume Discounts',
          icon: '💵',
          type: 'highlight',
          content: [
            '10-49 assessments: 15% discount on bulk purchases',
            '50-99 assessments: 25% discount on bulk purchases',
            '100-499 assessments: 35% discount on bulk purchases',
            '500+ assessments: 40% discount plus dedicated account management'
          ]
        }
      ]
    },
    'api-integration-guide': {
      sections: [
        {
          title: 'API Capabilities',
          icon: '🔌',
          type: 'list',
          content: [
            'RESTful API with JSON responses for easy integration',
            'Webhook support for real-time assessment completion notifications',
            'SSO integration with SAML, OAuth 2.0, and Active Directory',
            'HRIS system connectors for Workday, BambooHR, ADP, and more',
            'Custom endpoint development for specialized integration needs'
          ]
        },
        {
          title: 'Implementation Timeline',
          icon: '⏱️',
          type: 'stats',
          content: [
            { number: '1-2 days', label: 'Basic API Setup' },
            { number: '1 week', label: 'HRIS Integration' },
            { number: '2 weeks', label: 'Custom Development' },
            { number: '24/7', label: 'Technical Support' }
          ]
        },
        {
          title: 'Developer Resources',
          icon: '👨‍💻',
          type: 'highlight',
          content: [
            'Comprehensive API documentation with code samples',
            'SDK libraries available for popular programming languages',
            'Sandbox environment for testing and development',
            'Dedicated technical support with guaranteed response times'
          ]
        }
      ]
    }
  };

  // Default content for materials not specifically defined
  const defaultContent = {
    sections: [
      {
        title: 'Overview',
        icon: '📄',
        type: 'list',
        content: [
          description,
          'Professional-grade assessment tools with industry-leading accuracy',
          'Comprehensive reporting capabilities with actionable insights',
          'Secure, GDPR-compliant platform with bank-level encryption',
          'Expert support and implementation assistance available'
        ]
      },
      {
        title: 'Key Benefits',
        icon: '✨',
        type: 'highlight',
        content: [
          'Reduce hiring costs and improve candidate selection accuracy',
          'Streamline your assessment process with automated scoring',
          'Generate professional reports with custom branding options',
          'Access real-time analytics and performance dashboards'
        ]
      }
    ]
  };

  return contentTemplates[materialId] || defaultContent;
}