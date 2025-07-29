import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  recipientEmail: string;
  reportType: 'candidate' | 'employer';
  candidateName: string;
  assessmentType: string;
  reportDownloadLink: string;
  companyName?: string;
  customMessage?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      recipientEmail,
      reportType,
      candidateName,
      assessmentType,
      reportDownloadLink,
      companyName,
      customMessage
    }: EmailRequest = await req.json();

    console.log(`Sending ${reportType} report email to ${recipientEmail}`);

    // Generate email content based on report type
    let subject: string;
    let emailTemplate: string;

    if (reportType === 'candidate') {
      subject = `Your ${assessmentType} Assessment Results - AuthenCore Analytics`;
      emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Assessment Results</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Your Assessment Results Are Ready!</h1>
            <p>AuthenCore Analytics</p>
          </div>
          <div class="content">
            <h2>Dear ${candidateName},</h2>
            <p>Thank you for completing the <strong>${assessmentType}</strong> assessment. Your comprehensive report is now available for download.</p>
            
            <p>Your report includes:</p>
            <ul>
              <li>✓ Detailed analysis of your strengths and development areas</li>
              <li>✓ Personalized insights and recommendations</li>
              <li>✓ Professional development suggestions</li>
              <li>✓ Industry-specific guidance</li>
            </ul>

            ${customMessage ? `<div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;"><p><strong>Personal Message:</strong> ${customMessage}</p></div>` : ''}

            <div style="text-align: center;">
              <a href="${reportDownloadLink}" class="button">Download Your Report</a>
            </div>

            <p><strong>Important:</strong> This link will expire in 30 days. We recommend downloading and saving your report for future reference.</p>

            <p>If you have any questions about your results or would like to discuss your professional development opportunities, please don't hesitate to reach out to our team.</p>

            <p>Best regards,<br>
            The AuthenCore Analytics Team</p>
          </div>
          <div class="footer">
            <p>© 2024 AuthenCore Analytics. All rights reserved.</p>
            <p>This email was sent to ${recipientEmail}</p>
          </div>
        </body>
        </html>
      `;
    } else {
      // Employer report
      subject = `Assessment Report for ${candidateName} - ${assessmentType}`;
      emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Candidate Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .candidate-info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Candidate Assessment Report</h1>
            <p>AuthenCore Analytics</p>
          </div>
          <div class="content">
            <h2>Assessment Complete</h2>
            
            <div class="candidate-info">
              <h3>Candidate Information</h3>
              <p><strong>Name:</strong> ${candidateName}</p>
              <p><strong>Assessment:</strong> ${assessmentType}</p>
              ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
              <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <p>The candidate has successfully completed their assessment. The comprehensive report includes:</p>
            
            <ul>
              <li>✓ Detailed competency analysis</li>
              <li>✓ Behavioral insights and predictions</li>
              <li>✓ Role fit assessment</li>
              <li>✓ Interview questions and talking points</li>
              <li>✓ Development recommendations</li>
            </ul>

            ${customMessage ? `<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;"><p><strong>Additional Notes:</strong> ${customMessage}</p></div>` : ''}

            <div style="text-align: center;">
              <a href="${reportDownloadLink}" class="button">Access Report</a>
            </div>

            <p><strong>Confidentiality Notice:</strong> This report contains confidential assessment data. Please ensure it is shared only with authorized personnel involved in the hiring or development process.</p>

            <p><strong>Report Access:</strong> The download link will remain active for 90 days. For extended access or additional reports, please contact our support team.</p>

            <p>For questions about interpreting the results or next steps in your hiring process, our assessment consultants are available to assist.</p>

            <p>Best regards,<br>
            The AuthenCore Analytics Team</p>
          </div>
          <div class="footer">
            <p>© 2024 AuthenCore Analytics. All rights reserved.</p>
            <p>This email was sent to ${recipientEmail}</p>
          </div>
        </body>
        </html>
      `;
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "AuthenCore Analytics <reports@authencore.org>",
      to: [recipientEmail],
      subject: subject,
      html: emailTemplate,
    });

    console.log("Assessment report email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.data?.id,
      message: "Report email sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-assessment-report function:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      message: "Failed to send report email"
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);