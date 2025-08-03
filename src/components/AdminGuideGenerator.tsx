import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, User, Building2, Shield, Users } from 'lucide-react';
import { formatCopyrightLine } from '@/utils/legalNotices';

const AdminGuideGenerator = () => {
  const generateHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AuthenCore Analytics - Complete Admin Setup Guide</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 20px;
      background: #f8f9fa;
    }
    .header { 
      background: linear-gradient(135deg, #008080 0%, #20b2aa 100%); 
      color: white; 
      padding: 40px; 
      border-radius: 12px; 
      margin-bottom: 30px;
      text-align: center;
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; }
    .subtitle { font-size: 1.2em; opacity: 0.9; }
    .section { 
      background: white; 
      margin: 20px 0; 
      padding: 30px; 
      border-radius: 12px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h2 { 
      color: #008080; 
      border-bottom: 3px solid #20b2aa; 
      padding-bottom: 10px; 
      margin-bottom: 20px;
      font-size: 1.8em;
    }
    h3 { 
      color: #2c3e50; 
      margin: 25px 0 15px 0; 
      font-size: 1.3em;
    }
    .step-card {
      background: #f8f9fa;
      border-left: 4px solid #008080;
      padding: 20px;
      margin: 15px 0;
      border-radius: 0 8px 8px 0;
    }
    .step-number {
      background: #008080;
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
    }
    ul { margin-left: 20px; margin-bottom: 15px; }
    li { margin: 8px 0; }
    .warning { 
      background: #fff3cd; 
      border: 1px solid #ffeaa7; 
      padding: 15px; 
      border-radius: 8px; 
      margin: 15px 0;
    }
    .success { 
      background: #d4edda; 
      border: 1px solid #c3e6cb; 
      padding: 15px; 
      border-radius: 8px; 
      margin: 15px 0;
    }
    .info { 
      background: #e7f3ff; 
      border: 1px solid #b8daff; 
      padding: 15px; 
      border-radius: 8px; 
      margin: 15px 0;
    }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 20px; 
      margin: 20px 0;
    }
    .card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    .code {
      background: #f1f3f4;
      padding: 15px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      margin: 10px 0;
      overflow-x: auto;
    }
    .toc {
      background: #e8f5e8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .toc ul { list-style: none; margin-left: 0; }
    .toc a { color: #008080; text-decoration: none; }
    .toc a:hover { text-decoration: underline; }
    @media print { 
      body { margin: 0; background: white; }
      .section { box-shadow: none; border: 1px solid #ddd; }
      .header { background: #008080 !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ AuthenCore Analytics</h1>
    <div class="subtitle">Complete Administrator Setup Guide</div>
    <p style="margin-top: 15px; opacity: 0.9;">Version 2.0 | Generated: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="toc section">
    <h2>📋 Table of Contents</h2>
    <ul>
      <li><a href="#overview">1. Platform Overview</a></li>
      <li><a href="#initial-setup">2. Initial System Setup</a></li>
      <li><a href="#admin-accounts">3. Admin Account Management</a></li>
      <li><a href="#partner-setup">4. Partner Account Setup</a></li>
      <li><a href="#employer-setup">5. Employer Account Setup</a></li>
      <li><a href="#security">6. Security Configuration</a></li>
      <li><a href="#analytics">7. Analytics & Reporting</a></li>
      <li><a href="#troubleshooting">8. Troubleshooting Guide</a></li>
      <li><a href="#support">9. Support & Resources</a></li>
    </ul>
  </div>

  <div class="section" id="overview">
    <h2>🎯 Platform Overview</h2>
    <p>AuthenCore Analytics is a comprehensive psychometric assessment platform designed for professional talent evaluation and development. This guide covers complete administrative setup for all user types.</p>
    
    <div class="grid">
      <div class="card">
        <h3>🔧 Admin Features</h3>
        <ul>
          <li>Full system configuration</li>
          <li>User account management</li>
          <li>Security oversight</li>
          <li>Analytics dashboard access</li>
          <li>Content management</li>
        </ul>
      </div>
      <div class="card">
        <h3>🤝 Partner Features</h3>
        <ul>
          <li>Assessment tool access</li>
          <li>Client management</li>
          <li>Report generation</li>
          <li>Usage analytics</li>
          <li>Custom branding</li>
        </ul>
      </div>
      <div class="card">
        <h3>🏢 Employer Features</h3>
        <ul>
          <li>Candidate assessment</li>
          <li>Hiring analytics</li>
          <li>Team compatibility</li>
          <li>Performance tracking</li>
          <li>Bulk assessments</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section" id="initial-setup">
    <h2>🚀 Initial System Setup</h2>
    
    <div class="step-card">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span class="step-number">1</span>
        <h3 style="margin: 0;">Environment Configuration</h3>
      </div>
      <p>Configure your environment variables and system settings:</p>
      <div class="code">
SUPABASE_URL=your_supabase_url<br>
SUPABASE_ANON_KEY=your_anon_key<br>
OPENAI_API_KEY=your_openai_key<br>
STRIPE_PUBLIC_KEY=your_stripe_key
      </div>
    </div>

    <div class="step-card">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span class="step-number">2</span>
        <h3 style="margin: 0;">Database Setup</h3>
      </div>
      <p>Ensure all database tables and policies are properly configured:</p>
      <ul>
        <li>Run all migration scripts</li>
        <li>Configure Row Level Security (RLS) policies</li>
        <li>Set up storage buckets for file uploads</li>
        <li>Initialize assessment data</li>
      </ul>
    </div>

    <div class="step-card">
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span class="step-number">3</span>
        <h3 style="margin: 0;">Security Configuration</h3>
      </div>
      <p>Enable essential security features:</p>
      <ul>
        <li>Enable Multi-Factor Authentication (MFA)</li>
        <li>Configure password policies</li>
        <li>Set up audit logging</li>
        <li>Enable CORS for your domains</li>
      </ul>
    </div>
  </div>

  <div class="section" id="admin-accounts">
    <h2>👑 Admin Account Management</h2>
    
    <div class="info">
      <strong>Admin Access:</strong> Admin accounts have full system access including user management, analytics, and configuration settings.
    </div>

    <h3>Creating Admin Accounts</h3>
    <div class="step-card">
      <ol>
        <li>Navigate to Admin Panel → User Management</li>
        <li>Click "Create Admin Account"</li>
        <li>Fill in required information:
          <ul>
            <li>Email address</li>
            <li>Full name</li>
            <li>Role permissions</li>
            <li>Department/Organization</li>
          </ul>
        </li>
        <li>Set initial password (user will be prompted to change)</li>
        <li>Enable MFA requirement</li>
        <li>Send invitation email</li>
      </ol>
    </div>

    <h3>Admin Permissions</h3>
    <div class="grid">
      <div class="card">
        <h4>System Administration</h4>
        <ul>
          <li>User account management</li>
          <li>System configuration</li>
          <li>Security settings</li>
        </ul>
      </div>
      <div class="card">
        <h4>Content Management</h4>
        <ul>
          <li>Assessment configuration</li>
          <li>Marketing materials</li>
          <li>Report templates</li>
        </ul>
      </div>
      <div class="card">
        <h4>Analytics Access</h4>
        <ul>
          <li>Usage statistics</li>
          <li>Performance metrics</li>
          <li>Financial reports</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section" id="partner-setup">
    <h2>🤝 Partner Account Setup</h2>
    
    <div class="info">
      <strong>Partner Access:</strong> Partners are organizations that use AuthenCore assessments for their clients. They have access to assessment tools and analytics but cannot modify system settings.
    </div>

    <h3>Creating Partner Accounts</h3>
    <div class="step-card">
      <ol>
        <li>Go to Admin Panel → Partner Management</li>
        <li>Click "Add New Partner"</li>
        <li>Enter partner organization details:
          <ul>
            <li>Organization name</li>
            <li>Primary contact information</li>
            <li>Billing address</li>
            <li>Industry/Sector</li>
          </ul>
        </li>
        <li>Set assessment limits and permissions</li>
        <li>Configure pricing tier</li>
        <li>Generate API credentials (if needed)</li>
        <li>Send welcome package</li>
      </ol>
    </div>

    <h3>Partner Configuration Options</h3>
    <ul>
      <li><strong>Assessment Access:</strong> Choose which assessments partners can access</li>
      <li><strong>Branding:</strong> Allow custom logos and color schemes</li>
      <li><strong>API Access:</strong> Enable API integration for automated workflows</li>
      <li><strong>Reporting:</strong> Set report customization permissions</li>
      <li><strong>User Limits:</strong> Define maximum number of users/assessments</li>
    </ul>
  </div>

  <div class="section" id="employer-setup">
    <h2>🏢 Employer Account Setup</h2>
    
    <div class="info">
      <strong>Employer Access:</strong> Employers use the platform for candidate screening and employee development. They focus on hiring analytics and team management.
    </div>

    <h3>Creating Employer Accounts</h3>
    <div class="step-card">
      <ol>
        <li>Navigate to Admin Panel → Employer Management</li>
        <li>Click "Create Employer Account"</li>
        <li>Complete employer profile:
          <ul>
            <li>Company name and details</li>
            <li>HR contact information</li>
            <li>Number of employees</li>
            <li>Hiring volume</li>
          </ul>
        </li>
        <li>Set assessment packages</li>
        <li>Configure team management features</li>
        <li>Enable candidate portal</li>
        <li>Provide onboarding materials</li>
      </ol>
    </div>

    <h3>Employer Features Configuration</h3>
    <div class="grid">
      <div class="card">
        <h4>Candidate Management</h4>
        <ul>
          <li>Assessment invitations</li>
          <li>Progress tracking</li>
          <li>Result analysis</li>
        </ul>
      </div>
      <div class="card">
        <h4>Team Analytics</h4>
        <ul>
          <li>Team compatibility</li>
          <li>Performance insights</li>
          <li>Hiring recommendations</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="section" id="security">
    <h2>🔒 Security Configuration</h2>
    
    <div class="warning">
      <strong>Security Alert:</strong> Always enable MFA for admin accounts and regularly review access logs.
    </div>

    <h3>Essential Security Settings</h3>
    <ul>
      <li><strong>Multi-Factor Authentication:</strong> Mandatory for all admin accounts</li>
      <li><strong>Session Management:</strong> Configure timeout and concurrent sessions</li>
      <li><strong>Password Policies:</strong> Enforce strong password requirements</li>
      <li><strong>IP Restrictions:</strong> Limit admin access to specific IP ranges</li>
      <li><strong>Audit Logging:</strong> Track all administrative actions</li>
    </ul>

    <h3>Data Protection</h3>
    <ul>
      <li>Enable data encryption at rest and in transit</li>
      <li>Configure automated backups</li>
      <li>Set up data retention policies</li>
      <li>Implement GDPR compliance measures</li>
    </ul>
  </div>

  <div class="section" id="analytics">
    <h2>📊 Analytics & Reporting</h2>
    
    <h3>Available Analytics Dashboards</h3>
    <div class="grid">
      <div class="card">
        <h4>Usage Analytics</h4>
        <ul>
          <li>Assessment completion rates</li>
          <li>User activity patterns</li>
          <li>Popular assessment types</li>
        </ul>
      </div>
      <div class="card">
        <h4>Performance Metrics</h4>
        <ul>
          <li>System response times</li>
          <li>Error rates</li>
          <li>User satisfaction scores</li>
        </ul>
      </div>
      <div class="card">
        <h4>Business Intelligence</h4>
        <ul>
          <li>Revenue tracking</li>
          <li>Customer growth</li>
          <li>ROI analysis</li>
        </ul>
      </div>
    </div>

    <h3>Setting Up Reports</h3>
    <ol>
      <li>Navigate to Admin Panel → Analytics</li>
      <li>Configure report parameters</li>
      <li>Set automated delivery schedules</li>
      <li>Define recipient lists</li>
      <li>Test report generation</li>
    </ol>
  </div>

  <div class="section" id="troubleshooting">
    <h2>🔧 Troubleshooting Guide</h2>
    
    <h3>Common Issues & Solutions</h3>
    
    <div class="step-card">
      <h4>Issue: Users Cannot Log In</h4>
      <ul>
        <li>Check if account is active</li>
        <li>Verify email address is correct</li>
        <li>Check for MFA setup issues</li>
        <li>Review security policies</li>
      </ul>
    </div>

    <div class="step-card">
      <h4>Issue: Assessment Not Loading</h4>
      <ul>
        <li>Check user permissions</li>
        <li>Verify assessment is published</li>
        <li>Review browser compatibility</li>
        <li>Check network connectivity</li>
      </ul>
    </div>

    <div class="step-card">
      <h4>Issue: Reports Not Generating</h4>
      <ul>
        <li>Verify assessment completion</li>
        <li>Check report template configuration</li>
        <li>Review system logs for errors</li>
        <li>Ensure proper permissions</li>
      </ul>
    </div>

    <h3>System Monitoring</h3>
    <p>Regular monitoring checkpoints:</p>
    <ul>
      <li>Daily: Check system health dashboard</li>
      <li>Weekly: Review user activity logs</li>
      <li>Monthly: Analyze performance metrics</li>
      <li>Quarterly: Security audit and review</li>
    </ul>
  </div>

  <div class="section" id="support">
    <h2>📞 Support & Resources</h2>
    
    <div class="grid">
      <div class="card">
        <h4>Technical Support</h4>
        <ul>
          <li>Email: support@authencore.org</li>
          <li>Priority Support: admin@authencore.org</li>
          <li>Emergency Hotline: Available 24/7</li>
        </ul>
      </div>
      <div class="card">
        <h4>Documentation</h4>
        <ul>
          <li>API Documentation</li>
          <li>User Guides</li>
          <li>Video Tutorials</li>
          <li>Best Practices Guide</li>
        </ul>
      </div>
      <div class="card">
        <h4>Training Resources</h4>
        <ul>
          <li>Admin Training Videos</li>
          <li>Webinar Schedule</li>
          <li>Certification Programs</li>
          <li>Community Forums</li>
        </ul>
      </div>
    </div>

    <div class="success">
      <strong>Support Hours:</strong> Monday-Friday 8:00 AM - 6:00 PM EST<br>
      <strong>Emergency Support:</strong> Available 24/7 for critical system issues<br>
      <strong>Response Times:</strong> Critical issues within 1 hour, general support within 24 hours
    </div>
  </div>

  <div class="section">
    <h2>📝 Additional Notes</h2>
    <ul>
      <li>Keep this guide accessible to all administrators</li>
      <li>Review and update quarterly as system features evolve</li>
      <li>Maintain backup copies of all configuration settings</li>
      <li>Document any custom configurations specific to your organization</li>
    </ul>
    
    <div class="info">
      <strong>Document Version:</strong> 2.0<br>
      <strong>Last Updated:</strong> ${new Date().toLocaleDateString()}<br>
      <strong>Next Review:</strong> ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}<br>
      <strong>Generated for:</strong> AuthenCore Analytics Platform
    </div>
  </div>

  <div style="text-align: center; margin-top: 40px; padding: 20px; border-top: 2px solid #008080;">
    <p style="color: #666; font-size: 0.9em;">
      ${formatCopyrightLine()} | AuthenCore Analytics<br>
      This document contains confidential and proprietary information.
    </p>
  </div>
</body>
</html>`;
    
    const reportWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      reportWindow.focus();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Admin Setup Guide Generator</CardTitle>
            <CardDescription>
              Generate a comprehensive setup guide for administrators covering all account types and system management
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Admin Accounts</h3>
              <p className="text-sm text-muted-foreground">Full system access and management</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold">Partner Accounts</h3>
              <p className="text-sm text-muted-foreground">Assessment tool access and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/5 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold">Employer Accounts</h3>
              <p className="text-sm text-muted-foreground">Candidate management and hiring analytics</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Guide Contents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Setup Instructions</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Admin account initialization</li>
                <li>• Partner account creation</li>
                <li>• Employer account management</li>
                <li>• Role-based permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Management Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Security best practices</li>
                <li>• Analytics and reporting</li>
                <li>• Troubleshooting guide</li>
                <li>• Support information</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={generateHTML} className="w-full sm:w-auto" size="lg">
            <Download className="h-5 w-5 mr-2" />
            View Admin Setup Guide
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Opens a comprehensive HTML guide with step-by-step instructions for all account types and system management procedures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGuideGenerator;