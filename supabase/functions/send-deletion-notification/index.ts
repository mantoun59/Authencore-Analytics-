import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend("re_5Ri8cjzV_CaMrcF1qiELw5xMkp1JcK261");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  userName: string;
  requestId?: string;
  emailType: 'deletion_request_confirmed' | 'deletion_completed' | 'deletion_processed';
  processingTime?: string;
  deletionSummary?: any;
}

const generateDeletionRequestEmail = (userName: string, requestId: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Data Deletion Request Received</h1>
    </div>
    
    <p>Dear ${userName},</p>
    
    <p>We have received your request to delete your personal data from AuthenCore Analytics. This email confirms that your request has been logged and will be processed according to GDPR requirements.</p>
    
    <div class="alert">
      <strong>Request Details:</strong><br>
      Request ID: ${requestId}<br>
      Requested: ${new Date().toLocaleDateString()}<br>
      Expected Processing: Within 30 days
    </div>
    
    <h3>What happens next?</h3>
    <ul>
      <li>Your request will be reviewed by our data protection team</li>
      <li>We will process your deletion within 30 days as required by law</li>
      <li>You will receive a confirmation email once processing is complete</li>
      <li>All your personal data will be permanently removed from our systems</li>
    </ul>
    
    <h3>Data to be deleted:</h3>
    <ul>
      <li>Assessment results and reports</li>
      <li>Progress data and saved responses</li>
      <li>Profile information and preferences</li>
      <li>Account and authentication data</li>
    </ul>
    
    <p>If you have any questions about this process, please contact our data protection team.</p>
    
    <p>Best regards,<br>
    AuthenCore Analytics Data Protection Team</p>
    
    <div class="footer">
      <p>This is an automated message. For data protection inquiries, please contact us.</p>
      <p>AuthenCore Analytics - Professional Assessment Platform</p>
    </div>
  </div>
</body>
</html>
`;

const generateDeletionCompletedEmail = (userName: string, deletionSummary: any) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .success { background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Data Deletion Completed</h1>
    </div>
    
    <p>Dear ${userName},</p>
    
    <div class="success">
      <strong>Your data has been successfully deleted from AuthenCore Analytics.</strong>
    </div>
    
    <p>This email confirms that all your personal data has been permanently removed from our systems as requested.</p>
    
    <h3>Deletion Summary:</h3>
    <ul>
      <li>Deleted: ${new Date().toLocaleDateString()}</li>
      <li>Tables cleaned: ${deletionSummary?.total_tables || 'Multiple'}</li>
      <li>Status: Complete and irreversible</li>
    </ul>
    
    <h3>What was deleted:</h3>
    <ul>
      <li>✅ All assessment results and reports</li>
      <li>✅ Progress data and saved responses</li>
      <li>✅ Profile information and preferences</li>
      <li>✅ Account and authentication data</li>
      <li>✅ All associated personal information</li>
    </ul>
    
    <p><strong>Important:</strong> This action is permanent and cannot be undone. If you wish to use AuthenCore Analytics again in the future, you will need to create a new account.</p>
    
    <p>Thank you for using AuthenCore Analytics. We respect your privacy rights and are committed to protecting personal data.</p>
    
    <p>Best regards,<br>
    AuthenCore Analytics Data Protection Team</p>
    
    <div class="footer">
      <p>This is a final confirmation of your data deletion request.</p>
      <p>For any concerns, please contact our data protection team within 30 days.</p>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 Deletion notification request received');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userName, requestId, emailType, deletionSummary }: EmailRequest = await req.json();
    
    console.log(`📤 Sending ${emailType} email to ${email}`);

    let subject: string;
    let htmlContent: string;

    switch (emailType) {
      case 'deletion_request_confirmed':
        subject = '📋 Data Deletion Request Confirmed - AuthenCore Analytics';
        htmlContent = generateDeletionRequestEmail(userName, requestId!);
        break;
        
      case 'deletion_completed':
        subject = '✅ Data Deletion Completed - AuthenCore Analytics';
        htmlContent = generateDeletionCompletedEmail(userName, deletionSummary);
        break;
        
      default:
        throw new Error(`Unknown email type: ${emailType}`);
    }

    const emailResponse = await resend.emails.send({
      from: "AuthenCore Analytics <noreply@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("❌ Error in send-deletion-notification function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);