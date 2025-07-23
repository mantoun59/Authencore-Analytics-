import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Clock, Users, Shield, LogOut, BarChart3, FileText, Calendar } from 'lucide-react';
import { usePartner } from '@/contexts/PartnerContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

const ASSESSMENT_TYPES = [
  { id: 'emotional-intelligence', name: 'Emotional Intelligence', route: '/emotional-intelligence' },
  { id: 'leadership', name: 'Leadership', route: '/leadership' },
  { id: 'communication', name: 'Communication', route: '/communication' },
  { id: 'stress-resilience', name: 'Stress Resilience', route: '/stress-resilience' },
  { id: 'cultural-intelligence', name: 'Cultural Intelligence', route: '/cultural-intelligence' },
  { id: 'faith-values', name: 'Faith & Values', route: '/faith-values' },
  { id: 'career-launch', name: 'Career Launch', route: '/career-launch' },
  { id: 'digital-wellness', name: 'Digital Wellness', route: '/digital-wellness' },
  { id: 'cair', name: 'CAIR', route: '/cair' },
  { id: 'genz', name: 'Gen Z', route: '/genz' }
];

const PartnerDashboard = () => {
  const { partner, logout, checkAssessmentAccess, logActivity, isAuthenticated } = usePartner();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/partner-login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/partner-login');
  };

  const handleAssessmentAccess = (assessmentType: string, route: string) => {
    if (checkAssessmentAccess(assessmentType)) {
      logActivity('access_assessment', assessmentType);
      navigate(route);
    }
  };

  const isExpired = partner && new Date(partner.access_expires_at) <= new Date();
  const daysUntilExpiry = partner 
    ? Math.ceil((new Date(partner.access_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (!partner) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {partner.organization_name}</h1>
            <p className="text-muted-foreground">Partner Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {isExpired ? 'Expired' : `${daysUntilExpiry} days remaining`}
                </span>
              </div>
              <Badge variant={isExpired ? "destructive" : daysUntilExpiry <= 7 ? "destructive" : "default"}>
                {isExpired ? 'Access Expired' : 'Active'}
              </Badge>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Expiration Warning */}
        {isExpired && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Access Expired</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your partner access expired on {format(new Date(partner.access_expires_at), 'PPP')}. 
                Please contact your account manager to renew access.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="font-medium">{partner.organization_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{partner.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Access Expires</p>
                <p className="font-medium">{format(new Date(partner.access_expires_at), 'PPP')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Available Assessments
            </CardTitle>
            <CardDescription>
              Click on an assessment to begin or view sample reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASSESSMENT_TYPES.map(assessment => {
                const hasAccess = checkAssessmentAccess(assessment.id);
                const isAccessible = hasAccess && !isExpired;
                
                return (
                  <Card 
                    key={assessment.id}
                    className={`cursor-pointer transition-all ${
                      isAccessible 
                        ? 'hover:shadow-md border-primary/20' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => isAccessible && handleAssessmentAccess(assessment.id, assessment.route)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{assessment.name}</h3>
                        {hasAccess ? (
                          <Badge variant="default" className="text-xs">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            No Access
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>Assessment & Report</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/partner-analytics')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/sample-reports')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                View Sample Reports
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/about')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                About AuthenCore
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PartnerDashboard;