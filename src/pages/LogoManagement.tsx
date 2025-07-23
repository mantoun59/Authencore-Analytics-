import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LogoManager from '@/components/LogoManager';
import AssessmentLogo from '@/components/AssessmentLogo';
import { useAssessmentLogos, AssessmentLogo as LogoType } from '@/hooks/useAssessmentLogos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageIcon, Settings, Eye, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const LogoManagement = () => {
  const { logos, saveLogos } = useAssessmentLogos();
  const [showPreview, setShowPreview] = useState(false);

  const handleLogosUpdate = (updatedLogos: LogoType[]) => {
    saveLogos(updatedLogos);
    toast.success('Logos updated successfully!');
  };

  const assessmentTypes = [
    { value: 'faith-values', label: 'Faith and Values Assessment' },
    { value: 'stress-resilience', label: 'Stress Resilience Assessment' },
    { value: 'emotional-intelligence', label: 'Emotional Intelligence Assessment' },
    { value: 'leadership', label: 'Leadership Assessment' },
    { value: 'communication', label: 'Communication Assessment' },
    { value: 'career-launch', label: 'Career Launch Assessment' },
    { value: 'gen-z-workplace', label: 'Gen Z Workplace Assessment' },
    { value: 'digital-wellness', label: 'Digital Wellness Assessment' },
    { value: 'burnout-prevention', label: 'Burnout Prevention Assessment' },
    { value: 'cultural-intelligence', label: 'Cultural Intelligence Assessment' }
  ];

  const getAssessmentLabel = (assessmentType: string) => {
    return assessmentTypes.find(type => type.value === assessmentType)?.label || assessmentType;
  };

  const exportLogosConfig = () => {
    const config = {
      logos: logos,
      exported: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `assessment-logos-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Logo configuration exported successfully!');
  };

  const clearAllLogos = () => {
    if (window.confirm('Are you sure you want to remove all logos? This action cannot be undone.')) {
      saveLogos([]);
      toast.success('All logos cleared successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                <Settings className="h-3 w-3 mr-1" />
                Admin Panel
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">Assessment Logo Management</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload and manage logos for different assessments. These logos will appear on assessment pages and in generated reports.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            
            {logos.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={exportLogosConfig}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Config
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={clearAllLogos}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </>
            )}
          </div>

          {/* Preview Section */}
          {showPreview && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Logo Preview
                </CardTitle>
                <CardDescription>
                  See how your logos will appear across different assessment types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {assessmentTypes.map((type) => (
                    <div key={type.value} className="text-center p-4 border rounded-lg">
                      <div className="flex justify-center mb-2">
                        <AssessmentLogo 
                          assessmentType={type.value} 
                          size="lg" 
                          fallbackText={type.value.substring(0, 2).toUpperCase()}
                          className="border border-gray-200 rounded p-2"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {type.label}
                      </p>
                      <Badge 
                        variant={logos.find(logo => logo.assessmentType === type.value) ? 'default' : 'secondary'}
                        className="text-xs mt-1"
                      >
                        {logos.find(logo => logo.assessmentType === type.value) ? 'Has Logo' : 'No Logo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logo Manager Component */}
          <LogoManager 
            onLogosUpdate={handleLogosUpdate}
            existingLogos={logos}
          />

          {/* Usage Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>
                How to effectively use assessment logos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Logo Requirements</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Recommended size: 200x200px minimum</li>
                    <li>• Supported formats: PNG, JPG, SVG, WebP</li>
                    <li>• Transparent background preferred</li>
                    <li>• High contrast for readability</li>
                    <li>• Maximum file size: 5MB</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Where Logos Appear</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Assessment result pages</li>
                    <li>• PDF report headers</li>
                    <li>• Assessment preview cards</li>
                    <li>• Email report templates</li>
                    <li>• Marketing materials</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Use consistent visual styling across all assessment logos</li>
                  <li>• Ensure logos are readable at small sizes (as small as 32px)</li>
                  <li>• Consider creating different versions for light/dark themes</li>
                  <li>• Test logos in both PDF and web contexts before finalizing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LogoManagement;