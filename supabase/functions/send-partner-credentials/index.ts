import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CredentialsRequest {
  email: string;
  username: string;
  password: string;
  organization: string;
  expires_at: string;
  permissions: string[];
  login_url?: string;
}

const generateCredentialsEmail = (data: CredentialsRequest) => {
  const loginUrl = data.login_url || `${Deno.env.get("SUPABASE_URL")?.replace('https://jlbftyjewxgetxcihban.supabase.co', 'https://jlbftyjewxgetxcihban.lovable.app')}/partner-login`;
  const expirationDate = new Date(data.expires_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Partner Access Credentials - AuthenCore</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .credentials-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .credential-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .credential-item:last-child { border-bottom: none; }
        .credential-label { font-weight: 600; color: #475569; }
        .credential-value { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; }
        .login-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .permissions { margin: 20px 0; }
        .permission-tag { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
        .footer { background: #f8fafc; color: #6b7280; text-align: center; padding: 20px; border-radius: 0 0 8px 8px; font-size: 14px; }
        .warning { background: #fef3cd; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .warning-icon { color: #f59e0b; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🔐 Partner Access Credentials</h1>
        <p>Welcome to AuthenCore Partner Dashboard</p>
      </div>
      
      <div class="content">
        <h2>Hello ${data.organization}!</h2>
        <p>Your partner account has been created successfully. Below are your login credentials and access details:</p>
        
        <div class="credentials-box">
          <h3>🔑 Login Credentials</h3>
          <div class="credential-item">
            <span class="credential-label">Username:</span>
            <span class="credential-value">${data.username}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">Password:</span>
            <span class="credential-value">${data.password}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">Login URL:</span>
            <span class="credential-value">${loginUrl}</span>
          </div>
          <div class="credential-item">
            <span class="credential-label">Access Expires:</span>
            <span class="credential-value">${expirationDate}</span>
          </div>
        </div>

        <div class="warning">
          <span class="warning-icon">⚠️</span>
          <strong>Important:</strong> Please save these credentials securely and do not share them with unauthorized personnel.
        </div>

        <a href="${loginUrl}" class="login-button">Access Partner Dashboard</a>

        <div class="permissions">
          <h3>📊 Available Assessments</h3>
          <p>You have access to the following assessments:</p>
          ${data.permissions.map(permission => 
            `<span class="permission-tag">${permission.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>`
          ).join('')}
        </div>

        <h3>📋 How to Get Started</h3>
        <ol>
          <li><strong>Login:</strong> Click the button above or visit the login URL</li>
          <li><strong>Dashboard:</strong> Access your partner dashboard to view available assessments</li>
          <li><strong>Assessments:</strong> Click on any assessment you have access to</li>
          <li><strong>Reports:</strong> Generate and download detailed reports</li>
        </ol>

        <h3>🔒 Security Notes</h3>
        <ul>
          <li>Your access expires on <strong>${expirationDate}</strong></li>
          <li>You can only access assessments you have permission for</li>
          <li>All activity is logged for security purposes</li>
          <li>Contact support if you need access to additional assessments</li>
        </ul>

        <h3>📞 Support</h3>
        <p>If you need assistance or have questions:</p>
        <ul>
          <li>Email your account manager</li>
          <li>Visit our support documentation</li>
          <li>Contact AuthenCore support team</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>© 2024 AuthenCore. All rights reserved.</p>
        <p>This email contains confidential information. Please handle with care.</p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: CredentialsRequest = await req.json();
    
    console.log('Sending partner credentials to:', requestData.email);
    console.log('Organization:', requestData.organization);
    console.log('Permissions:', requestData.permissions);

    const emailResponse = await resend.emails.send({
      from: "AuthenCore <noreply@authencore.com>",
      to: [requestData.email],
      subject: `🔐 Your AuthenCore Partner Access Credentials - ${requestData.organization}`,
      html: generateCredentialsEmail(requestData),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Credentials sent successfully',
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending partner credentials:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send credentials' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);