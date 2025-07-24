import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  reportType: 'candidate' | 'employer';
  candidateName: string;
  assessmentType: string;
  downloadLink: string;
  employerInfo?: {
    companyName: string;
    contactPerson: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();
    console.log("Processing email request:", emailData);

    let emailTemplate = "";
    let subject = "";

    if (emailData.reportType === 'candidate') {
      subject = `Your ${emailData.assessmentType} Assessment Results - AuthenCore`;
      emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">AuthenCore Assessment</h1>
            <div style="height: 3px; background: linear-gradient(90deg, #2563eb, #06b6d4); margin: 0 auto; width: 100px;"></div>
          </div>
          
          <h2 style="color: #1f2937;">Hello ${emailData.candidateName}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Congratulations on completing your <strong>${emailData.assessmentType}</strong> assessment! 
            Your comprehensive report is now ready for download.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">What's in your report:</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Detailed personality dimensions analysis</li>
              <li>Strengths and development areas</li>
              <li>Personalized career recommendations</li>
              <li>Next steps for professional growth</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailData.downloadLink}" 
               style="display: inline-block; background: linear-gradient(90deg, #2563eb, #06b6d4); 
                      color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold;">
              Download Your Report
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This link will be valid for 30 days. If you have any questions, please contact our support team.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">
              © 2025 AuthenCore. Professional Assessment Platform.
            </p>
          </div>
        </div>
      `;
    } else {
      // Employer report
      subject = `Assessment Report for ${emailData.candidateName} - AuthenCore`;
      emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">AuthenCore Assessment</h1>
            <div style="height: 3px; background: linear-gradient(90deg, #2563eb, #06b6d4); margin: 0 auto; width: 100px;"></div>
          </div>
          
          <h2 style="color: #1f2937;">Hello ${emailData.employerInfo?.contactPerson || 'Hiring Manager'}!</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            The <strong>${emailData.assessmentType}</strong> assessment for candidate 
            <strong>${emailData.candidateName}</strong> has been completed successfully.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Employer Report Includes:</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Comprehensive personality analysis</li>
              <li>Cultural fit assessment</li>
              <li>Role alignment scoring</li>
              <li>Interview guide and questions</li>
              <li>Hiring risk assessment</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailData.downloadLink}" 
               style="display: inline-block; background: linear-gradient(90deg, #2563eb, #06b6d4); 
                      color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold;">
              Download Employer Report
            </a>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Confidential:</strong> This report contains sensitive candidate information. 
              Please handle according to your organization's privacy policies.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Report access expires in 90 days. For support or questions about the assessment results, 
            please contact our team.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">
              © 2025 AuthenCore. Professional Assessment Platform for ${emailData.employerInfo?.companyName || 'Your Organization'}.
            </p>
          </div>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "AuthenCore <reports@authencore.com>",
      to: [emailData.to],
      subject: subject,
      html: emailTemplate,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-assessment-report function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send assessment report email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);