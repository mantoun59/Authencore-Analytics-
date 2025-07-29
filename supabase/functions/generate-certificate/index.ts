import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { candidateName, assessmentType, completionDate, reliabilityScore, validityLevel, careerFit } = await req.json()

    console.log('Generating certificate for:', candidateName)

    // Generate a professional certificate
    const certificateHTML = generateCertificateHTML({
      candidateName,
      assessmentType,
      completionDate,
      reliabilityScore,
      validityLevel,
      careerFit
    })

    return new Response(certificateHTML, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function generateCertificateHTML(data: {
  candidateName: string
  assessmentType: string
  completionDate: string
  reliabilityScore: number
  validityLevel: number
  careerFit: string
}): string {
  const certificateId = Math.random().toString(36).substr(2, 9).toUpperCase()
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessment Completion Certificate</title>
    <style>
        @page {
            margin: 0;
            size: A4 landscape;
        }
        
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .certificate {
            background: white;
            width: 100%;
            max-width: 800px;
            padding: 60px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            position: relative;
            border: 8px solid #2563eb;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #3b82f6;
            border-radius: 8px;
        }
        
        .header {
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
        }
        
        .certificate-title {
            font-size: 48px;
            font-weight: bold;
            color: #1e40af;
            margin: 30px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .recipient {
            font-size: 18px;
            color: #374151;
            margin: 20px 0;
        }
        
        .candidate-name {
            font-size: 36px;
            font-weight: bold;
            color: #1e40af;
            margin: 20px 0;
            text-decoration: underline;
            text-decoration-color: #3b82f6;
        }
        
        .completion-text {
            font-size: 20px;
            color: #374151;
            margin: 30px 0;
            line-height: 1.6;
        }
        
        .assessment-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border-left: 4px solid #2563eb;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 16px;
        }
        
        .detail-label {
            font-weight: bold;
            color: #374151;
        }
        
        .detail-value {
            color: #1e40af;
            font-weight: 600;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
        }
        
        .signature {
            text-align: center;
            flex: 1;
        }
        
        .signature-line {
            border-bottom: 2px solid #374151;
            margin-bottom: 10px;
            height: 50px;
            position: relative;
        }
        
        .signature-line::after {
            content: 'Dr. M. Richardson';
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            font-style: italic;
            color: #2563eb;
            font-size: 18px;
        }
        
        .signature-title {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .certificate-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
        
        .certificate-id {
            font-family: 'Courier New', monospace;
            background: #f3f4f6;
            padding: 5px 10px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 10px;
        }
        
        .seal {
            position: absolute;
            bottom: 80px;
            right: 80px;
            width: 120px;
            height: 120px;
            border: 6px solid #dc2626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            color: #dc2626;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
            line-height: 1.2;
            transform: rotate(-15deg);
        }
        
        @media print {
            body {
                background: white;
            }
            
            .certificate {
                box-shadow: none;
                border: 4px solid #2563eb;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo">AuthenCore Analytics</div>
            <div class="subtitle">Professional Psychometric Assessment Platform</div>
        </div>
        
        <h1 class="certificate-title">Certificate of Completion</h1>
        
        <p class="recipient">This is to certify that</p>
        
        <div class="candidate-name">${data.candidateName}</div>
        
        <p class="completion-text">
            has successfully completed the <strong>${data.assessmentType}</strong><br>
            and demonstrated commitment to professional development and self-awareness
        </p>
        
        <div class="assessment-details">
            <div class="detail-row">
                <span class="detail-label">Assessment Type:</span>
                <span class="detail-value">${data.assessmentType}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Completion Date:</span>
                <span class="detail-value">${new Date(data.completionDate).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reliability Score:</span>
                <span class="detail-value">${data.reliabilityScore}% - Excellent</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Validity Level:</span>
                <span class="detail-value">${data.validityLevel}% Confidence</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Career Profile:</span>
                <span class="detail-value">${data.careerFit}</span>
            </div>
        </div>
        
        <div class="signature-section">
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">Director of Assessment<br>AuthenCore Analytics</div>
            </div>
            
            <div class="signature" style="text-align: center;">
                <div style="margin-top: 30px;">
                    <div style="font-weight: bold; color: #1e40af;">Issued: ${new Date().toLocaleDateString()}</div>
                    <div class="certificate-id">Certificate ID: ${certificateId}</div>
                </div>
            </div>
        </div>
        
        <div class="certificate-footer">
            <p>This certificate verifies the completion of a professionally validated psychometric assessment. 
            Results are based on scientifically rigorous methodologies and can be used for career development, 
            coaching, and professional planning purposes.</p>
            
            <p><strong>Verification:</strong> This certificate can be verified at authencore.org/verify using Certificate ID: ${certificateId}</p>
        </div>
        
        <div class="seal">
            PROFESSIONAL<br>
            VALIDATED<br>
            ASSESSMENT
        </div>
    </div>
    
    <script>
        // Auto-print when opened
        setTimeout(() => {
            window.print();
        }, 1000);
    </script>
</body>
</html>
  `
}