import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, TestTube, Play } from 'lucide-react';
import { productionLogger } from '@/utils/productionConfig';

const AdminTestingTools: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testToken, setTestToken] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const { toast } = useToast();

  const assessmentTypes = [
    { value: 'cair-personality', label: 'CAIR Personality Assessment', short: 'Personality', route: '/cair-assessment' },
    { value: 'cair-cultural', label: 'CAIR Cultural Intelligence', short: 'Cultural', route: '/cultural-intelligence-assessment' },
    { value: 'communication-styles', label: 'Communication Styles', short: 'Communication', route: '/communication-styles-assessment' },
    { value: 'emotional-intelligence', label: 'Emotional Intelligence', short: 'Emotional', route: '/emotional-intelligence-assessment' },
    { value: 'leadership', label: 'Leadership Assessment', short: 'Leadership', route: '/leadership-assessment' },
    { value: 'career-launch', label: 'Career Launch Assessment', short: 'Career Launch', route: '/career-launch' },
    { value: 'burnout-prevention', label: 'Burnout Prevention & Stress Resilience', short: 'Burnout', route: '/stress-resilience' },
    { value: 'faith-values', label: 'Faith & Values Integration', short: 'Faith', route: '/faith-values-assessment' },
    { value: 'genz-workplace', label: 'Gen Z Workplace', short: 'Gen Z', route: '/genz-workplace-assessment' },
    { value: 'digital-wellness', label: 'Digital Wellness', short: 'Digital', route: '/digital-wellness-assessment' },
  ];

  const generateTestToken = async () => {
    if (!selectedAssessment || !testEmail) {
      toast({
        title: "Missing Information",
        description: "Please select an assessment type and enter a test email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Generate a test guest access token
      const { data, error } = await supabase.functions.invoke('create-test-access', {
        body: {
          assessmentType: selectedAssessment,
          email: testEmail,
          adminGenerated: true
        }
      });

      if (error) throw error;

      setTestToken(data.token);
      toast({
        title: "Test Token Generated",
        description: "Test access token created successfully!",
      });
    } catch (error: any) {
      productionLogger.error('Error generating test token:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate test token",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(testToken);
    toast({
      title: "Copied",
      description: "Test token copied to clipboard",
    });
  };

  const openTestAssessment = () => {
    if (!selectedAssessment) {
      toast({
        title: "No Assessment Selected",
        description: "Please select an assessment type first",
        variant: "destructive",
      });
      return;
    }

    const assessment = assessmentTypes.find(a => a.value === selectedAssessment);
    const testUrl = `${assessment?.route || '/assessment'}?test=true`;
    window.open(testUrl, '_blank');
  };

  const directAccessAssessment = () => {
    if (!selectedAssessment) {
      toast({
        title: "No Assessment Selected",
        description: "Please select an assessment type first",
        variant: "destructive",
      });
      return;
    }

    const assessment = assessmentTypes.find(a => a.value === selectedAssessment);
    const adminUrl = `${assessment?.route || '/assessment'}?admin=true`;
    window.location.href = adminUrl;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Assessment Testing Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quick Admin Access */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-900">Quick Admin Access</h3>
              <p className="text-sm text-blue-700 mb-4">Direct access to assessments as admin (no payment required)</p>
              <div className="space-y-2">
                <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select assessment" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50 max-h-60 overflow-auto">
                    {assessmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="hover:bg-muted">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={directAccessAssessment} 
                  className="w-full h-8" 
                  disabled={!selectedAssessment}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </div>
            </Card>

            {/* Test Token Generator */}
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-semibold mb-2 text-green-900">Generate Test Token</h3>
              <p className="text-sm text-green-700 mb-4">Create temporary access tokens for testing</p>
              <div className="space-y-2">
                <Input
                  placeholder="Test email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="h-8 text-sm"
                />
                <Button 
                  onClick={generateTestToken} 
                  className="w-full h-8"
                  disabled={loading || !selectedAssessment || !testEmail}
                >
                  Generate Token
                </Button>
                {testToken && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={testToken} readOnly className="text-xs" />
                    <Button onClick={copyToken} variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Test Mode Access */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-semibold mb-2 text-purple-900">Test Mode</h3>
              <p className="text-sm text-purple-700 mb-4">Open assessment in test mode with simulated data</p>
              <Button 
                onClick={openTestAssessment} 
                className="w-full" 
                variant="outline"
                disabled={!selectedAssessment}
              >
                Open Test Mode
              </Button>
            </Card>
          </div>

          {/* Quick Access Links */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Quick Assessment Links (All 10 Assessments)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {assessmentTypes.map((type) => (
                <Button
                  key={type.value}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`${type.route}?admin=true`, '_blank')}
                  className="text-xs h-8 px-2"
                  title={type.label}
                >
                  {type.short}
                </Button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Testing Methods:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• <strong>Quick Admin Access:</strong> Bypasses payment entirely (best for development)</li>
              <li>• <strong>Test Tokens:</strong> Simulates guest checkout without payment</li>
              <li>• <strong>Test Mode:</strong> Opens assessment with test data and debugging info</li>
              <li>• <strong>Quick Links:</strong> One-click access to any assessment as admin</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestingTools;