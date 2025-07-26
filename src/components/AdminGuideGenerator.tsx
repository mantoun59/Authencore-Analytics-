import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, User, Building2, Shield, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import { formatPDFLegalFooter, formatCopyrightLine } from '@/utils/legalNotices';

const AdminGuideGenerator = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.5);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (neededSpace: number) => {
      if (yPosition + neededSpace > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('AuthenCore Analytics - Admin Setup Guide', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 30;

    // Table of Contents
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Table of Contents', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const toc = [
      '1. System Overview....................................3',
      '2. Admin Account Setup...............................4',
      '3. Partner Account Management........................6',
      '4. Employer Account Management.......................8',
      '5. User Roles and Permissions.......................10',
      '6. Security Best Practices..........................12',
      '7. Analytics and Reporting..........................14',
      '8. Troubleshooting..................................16'
    ];

    toc.forEach(item => {
      doc.text(item, margin, yPosition);
      yPosition += 8;
    });

    // Section 1: System Overview
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('1. System Overview', margin, yPosition);
    yPosition += 20;

    doc.setFontSize(12);
    doc.text('AuthenCore Analytics Roles:', margin, yPosition);
    yPosition += 15;

    const roleDescriptions = [
      {
        role: 'Admin',
        description: 'Full system access, manages all accounts, views all analytics, system configuration'
      },
      {
        role: 'Partner',
        description: 'Access to specific assessment tools, limited analytics, partner-specific features'
      },
      {
        role: 'Employer',
        description: 'Candidate management, hiring analytics, assessment results for their organization'
      },
      {
        role: 'User',
        description: 'Basic access to take assessments, view personal results'
      }
    ];

    roleDescriptions.forEach(({ role, description }) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`• ${role}:`, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      yPosition = addWrappedText(description, margin + 25, yPosition, pageWidth - margin - 25, 10);
      yPosition += 10;
    });

    // Section 2: Admin Account Setup
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Admin Account Setup', margin, yPosition);
    yPosition += 20;

    const adminSteps = [
      {
        step: 'Initial Setup',
        content: [
          '1. Access the Supabase dashboard at: https://supabase.com/dashboard',
          '2. Navigate to your project: jlbftyjewxgetxcihban',
          '3. Go to SQL Editor and run the admin role assignment query:',
          '   SELECT public.assign_admin_role(\'your-email@example.com\');',
          '4. Replace \'your-email@example.com\' with your actual email address'
        ]
      },
      {
        step: 'Account Verification',
        content: [
          '1. Login to the application at /auth',
          '2. Navigate to /admin to verify admin access',
          '3. You should see the admin dashboard with full system controls'
        ]
      },
      {
        step: 'Security Configuration',
        content: [
          '1. Enable MFA in the Security section',
          '2. Review session security settings',
          '3. Configure password policies if needed'
        ]
      }
    ];

    adminSteps.forEach(({ step, content }) => {
      checkNewPage(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(step, margin, yPosition);
      yPosition += 15;

      content.forEach(item => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition = addWrappedText(item, margin, yPosition, pageWidth - margin * 2, 10);
        yPosition += 8;
      });
      yPosition += 10;
    });

    // Section 3: Partner Account Management
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Partner Account Management', margin, yPosition);
    yPosition += 20;

    const partnerSteps = [
      {
        step: 'Creating Partner Accounts',
        content: [
          '1. Navigate to Admin → Partner Management',
          '2. Click "Add Partner" button',
          '3. Fill in required information:',
          '   - Username (unique identifier)',
          '   - Organization name',
          '   - Contact email',
          '   - Access duration (days)',
          '4. Select assessment permissions',
          '5. Generate secure password',
          '6. Save the account'
        ]
      },
      {
        step: 'Partner Permissions',
        content: [
          'Available Assessment Types:',
          '• CareerLaunch - Career Discovery & Planning',
          '• CAIR+ Personality - Advanced Personality Assessment',
          '• Burnout Prevention Index - Proactive Burnout Prevention',
          '• Cultural Intelligence - Global Business Competency',
          '• Communication Styles - Advanced Communication Analysis',
          '• Emotional Intelligence - EQ Assessment & Development',
          '• Faith & Values - Comprehensive Values Alignment',
          '• Gen Z Workplace - Generational Workplace Assessment',
          '• Digital Wellness - Digital Health & Productivity',
          '• Authentic Leadership Assessment - Authentic Leadership Development'
        ]
      },
      {
        step: 'Partner Account Management',
        content: [
          '1. View all partners in the Partner Management table',
          '2. Edit partner details and permissions',
          '3. Toggle active/inactive status',
          '4. Monitor access logs and usage',
          '5. Extend or modify access duration',
          '6. Send new credentials if needed'
        ]
      }
    ];

    partnerSteps.forEach(({ step, content }) => {
      checkNewPage(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(step, margin, yPosition);
      yPosition += 15;

      content.forEach(item => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition = addWrappedText(item, margin, yPosition, pageWidth - margin * 2, 10);
        yPosition += 8;
      });
      yPosition += 10;
    });

    // Section 4: Employer Account Management
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Employer Account Management', margin, yPosition);
    yPosition += 20;

    const employerSteps = [
      {
        step: 'Employer Registration Process',
        content: [
          '1. Employers register through /employer-login',
          '2. They create accounts with company information',
          '3. Admin approval may be required (configurable)',
          '4. Access to employer dashboard upon approval'
        ]
      },
      {
        step: 'Employer Capabilities',
        content: [
          '• Create and manage candidate assessments',
          '• View candidate results and reports',
          '• Access employer-specific analytics',
          '• Download assessment reports',
          '• Manage company assessment settings'
        ]
      },
      {
        step: 'Monitoring Employer Accounts',
        content: [
          '1. View employer list in admin dashboard',
          '2. Monitor assessment usage',
          '3. Review employer analytics',
          '4. Provide support as needed'
        ]
      }
    ];

    employerSteps.forEach(({ step, content }) => {
      checkNewPage(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(step, margin, yPosition);
      yPosition += 15;

      content.forEach(item => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition = addWrappedText(item, margin, yPosition, pageWidth - margin * 2, 10);
        yPosition += 8;
      });
      yPosition += 10;
    });

    // Section 5: User Roles and Permissions
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('5. User Roles and Permissions', margin, yPosition);
    yPosition += 20;

    const permissions = [
      {
        role: 'Admin',
        permissions: [
          '✓ Full system access',
          '✓ User management',
          '✓ Partner account creation/management',
          '✓ Global analytics and reporting',
          '✓ System configuration',
          '✓ Security settings',
          '✓ Database access'
        ]
      },
      {
        role: 'Partner',
        permissions: [
          '✓ Access assigned assessments',
          '✓ View partner analytics',
          '✓ Generate assessment reports',
          '✓ Limited data export',
          '✗ User management',
          '✗ System configuration'
        ]
      },
      {
        role: 'Employer',
        permissions: [
          '✓ Candidate management',
          '✓ Assessment administration',
          '✓ Employer analytics',
          '✓ Report generation',
          '✓ Company data management',
          '✗ Partner management',
          '✗ System-wide analytics'
        ]
      },
      {
        role: 'User',
        permissions: [
          '✓ Take assessments',
          '✓ View personal results',
          '✓ Download personal reports',
          '✗ Administrative functions',
          '✗ Other user data access'
        ]
      }
    ];

    permissions.forEach(({ role, permissions: perms }) => {
      checkNewPage(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`${role} Permissions:`, margin, yPosition);
      yPosition += 15;

      perms.forEach(perm => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(perm, margin + 10, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    });

    // Section 6: Security Best Practices
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('6. Security Best Practices', margin, yPosition);
    yPosition += 20;

    const securityPractices = [
      'Use strong, unique passwords for all admin accounts',
      'Enable multi-factor authentication (MFA)',
      'Regularly review user access and permissions',
      'Monitor system logs for suspicious activity',
      'Keep partner access duration limited',
      'Regularly audit partner and employer accounts',
      'Use secure communication for credential sharing',
      'Implement session timeout policies',
      'Regular security assessments',
      'Keep the system updated'
    ];

    securityPractices.forEach(practice => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      yPosition = addWrappedText(`• ${practice}`, margin, yPosition, pageWidth - margin * 2, 10);
      yPosition += 10;
    });

    // Section 7: Analytics and Reporting
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('7. Analytics and Reporting', margin, yPosition);
    yPosition += 20;

    const analyticsInfo = [
      {
        title: 'Admin Analytics',
        content: 'Access comprehensive system-wide analytics including user activity, assessment usage, partner performance, and system health metrics.'
      },
      {
        title: 'Partner Analytics',
        content: 'Partners can view their usage statistics, assessment completion rates, and performance metrics within their permitted assessment types.'
      },
      {
        title: 'Employer Analytics',
        content: 'Employers access candidate assessment results, hiring analytics, demographic insights, and position-specific reporting.'
      },
      {
        title: 'Data Export',
        content: 'All role levels can export relevant data in CSV format for further analysis and reporting purposes.'
      }
    ];

    analyticsInfo.forEach(({ title, content }) => {
      checkNewPage(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(title, margin, yPosition);
      yPosition += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      yPosition = addWrappedText(content, margin, yPosition, pageWidth - margin * 2, 10);
      yPosition += 15;
    });

    // Section 8: Troubleshooting
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('8. Troubleshooting', margin, yPosition);
    yPosition += 20;

    const troubleshooting = [
      {
        issue: 'Cannot access admin dashboard',
        solution: 'Verify admin role is assigned in Supabase. Check SQL query execution and user email.'
      },
      {
        issue: 'Partner login issues',
        solution: 'Check partner account status, password correctness, and access expiration date.'
      },
      {
        issue: 'Assessment permissions not working',
        solution: 'Verify partner permissions are correctly set for specific assessment types.'
      },
      {
        issue: 'Analytics not loading',
        solution: 'Check database connectivity, user permissions, and browser console for errors.'
      },
      {
        issue: 'Email notifications not sending',
        solution: 'Verify email service configuration and check Edge Functions logs.'
      }
    ];

    troubleshooting.forEach(({ issue, solution }) => {
      checkNewPage(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`Issue: ${issue}`, margin, yPosition);
      yPosition += 12;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Solution:', margin, yPosition);
      yPosition += 8;
      yPosition = addWrappedText(solution, margin + 10, yPosition, pageWidth - margin * 2 - 10, 10);
      yPosition += 15;
    });

    // Footer
    doc.addPage();
    yPosition = margin;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Support Information', margin, yPosition);
    yPosition += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const supportInfo = [
      'For technical support and additional questions:',
      '',
      'System Database: Supabase Project jlbftyjewxgetxcihban',
      'Admin Dashboard: /admin',
      'Partner Management: /admin (Partner Management tab)',
      '',
      'This guide covers the basic setup and management procedures.',
      'For advanced configurations or custom requirements,',
      'consult the technical documentation or development team.'
    ];

    supportInfo.forEach(info => {
      yPosition = addWrappedText(info, margin, yPosition, pageWidth - margin * 2, 10);
      yPosition += 8;
    });

    // Add legal footer
    addLegalFooter();

    // Helper function to add legal footer
    function addLegalFooter() {
      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 40;
      
      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

      // Add legal notices
      const legalLines = formatPDFLegalFooter();
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);

      let currentY = footerY;
      legalLines.forEach((line, index) => {
        if (line.trim()) {
          if (index === 0 || index === 1) {
            // Copyright and trademark - make them bold
            doc.setFont('helvetica', 'bold');
          } else {
            doc.setFont('helvetica', 'normal');
          }
          
          if (line.length > 80) {
            // Wrap long lines
            const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin);
            wrappedLines.forEach((wrappedLine: string) => {
              doc.text(wrappedLine, margin, currentY);
              currentY += 8;
            });
          } else {
            doc.text(line, margin, currentY);
            currentY += 8;
          }
        } else {
          currentY += 4; // Empty line spacing
        }
      });
    }

    // Save the PDF
    doc.save('AuthenCore-Admin-Setup-Guide.pdf');
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
          <Button onClick={generatePDF} className="w-full sm:w-auto" size="lg">
            <Download className="h-5 w-5 mr-2" />
            Download Admin Setup Guide (PDF)
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Generates a comprehensive PDF guide with step-by-step instructions for all account types and system management procedures.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminGuideGenerator;