import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, User, Building2, Shield, Users } from 'lucide-react';
import { formatCopyrightLine } from '@/utils/legalNotices';

const AdminGuideGenerator = () => {
  const generateHTML = () => {

    // Open HTML guide in new window for viewing/printing
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>AuthenCore Admin Setup Guide</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #008080; }
    .section { margin: 20px 0; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>AuthenCore Admin Setup Guide</h1>
  <div class="section">
    <h2>Quick Start Guide</h2>
    <p>Welcome to the AuthenCore Analytics platform administration guide...</p>
  </div>
</body>
</html>`;
    
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
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