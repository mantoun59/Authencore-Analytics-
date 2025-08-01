import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Shield, 
  FileText, 
  Calendar,
  Mail,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DataDeletionPanel from '@/components/DataDeletionPanel';

interface UserProfile {
  email: string;
  full_name?: string;
  display_name?: string;
  created_at: string;
  updated_at: string;
}

interface AssessmentResult {
  id: string;
  assessment_type: string;
  completed_at: string;
  results: any;
}

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
      loadAssessmentResults();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssessmentResults = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('id, assessment_type, completed_at, results')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error loading assessment results:', error);
      } else {
        setAssessmentResults(data || []);
      }
    } catch (error) {
      console.error('Error loading assessment results:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    }
  };

  const formatAssessmentType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getAssessmentTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'cair': 'bg-blue-100 text-blue-800',
      'faith_values': 'bg-purple-100 text-purple-800',
      'communication': 'bg-green-100 text-green-800',
      'leadership': 'bg-orange-100 text-orange-800',
      'career_launch': 'bg-indigo-100 text-indigo-800',
      'genz_workplace': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors['default'];
  };

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {profile?.full_name || profile?.display_name || 'User'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile?.email}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="assessments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assessments" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy & Data
              </TabsTrigger>
            </TabsList>

            {/* Assessment Results Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Assessment Results</CardTitle>
                  <CardDescription>
                    View and manage your completed assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assessmentResults.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground">No assessments completed</h3>
                      <p className="text-sm text-muted-foreground">
                        Start taking assessments to see your results here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assessmentResults.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Badge className={getAssessmentTypeColor(result.assessment_type)}>
                              {formatAssessmentType(result.assessment_type)}
                            </Badge>
                            <div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  Completed: {new Date(result.completed_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Report
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <p className="text-sm text-muted-foreground">
                          {profile?.full_name || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-muted-foreground">
                          {profile?.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Account Created</label>
                        <p className="text-sm text-muted-foreground">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end">
                      <Button variant="outline">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy & Data Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <DataDeletionPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;