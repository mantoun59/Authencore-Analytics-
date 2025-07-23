import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AssessmentLogo {
  id: string;
  assessmentType: string;
  logoUrl: string;
  logoFile?: File;
  name: string;
}

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

interface LogoManagerProps {
  onLogosUpdate?: (logos: AssessmentLogo[]) => void;
  existingLogos?: AssessmentLogo[];
}

const LogoManager = ({ onLogosUpdate, existingLogos = [] }: LogoManagerProps) => {
  const [logos, setLogos] = useState<AssessmentLogo[]>(existingLogos);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoName, setLogoName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setLogoName(file.name.split('.')[0]);
        setLogoUrl(''); // Clear URL if file is selected
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setLogoUrl(url);
    setLogoPreview(url);
    setLogoFile(null); // Clear file if URL is entered
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addLogo = () => {
    if (!selectedAssessment) {
      toast.error('Please select an assessment type');
      return;
    }

    if (!logoFile && !logoUrl) {
      toast.error('Please select a logo file or enter a URL');
      return;
    }

    if (!logoName.trim()) {
      toast.error('Please enter a name for the logo');
      return;
    }

    // Check if logo already exists for this assessment
    const existingLogo = logos.find(logo => logo.assessmentType === selectedAssessment);
    if (existingLogo) {
      toast.error('Logo already exists for this assessment. Remove it first to replace.');
      return;
    }

    const newLogo: AssessmentLogo = {
      id: crypto.randomUUID(),
      assessmentType: selectedAssessment,
      logoUrl: logoUrl || logoPreview,
      logoFile: logoFile || undefined,
      name: logoName.trim()
    };

    const updatedLogos = [...logos, newLogo];
    setLogos(updatedLogos);
    onLogosUpdate?.(updatedLogos);

    // Reset form
    setSelectedAssessment('');
    setLogoPreview('');
    setLogoFile(null);
    setLogoUrl('');
    setLogoName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast.success('Logo added successfully!');
  };

  const removeLogo = (id: string) => {
    const updatedLogos = logos.filter(logo => logo.id !== id);
    setLogos(updatedLogos);
    onLogosUpdate?.(updatedLogos);
    toast.success('Logo removed successfully!');
  };

  const getAssessmentLabel = (assessmentType: string) => {
    return assessmentTypes.find(type => type.value === assessmentType)?.label || assessmentType;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Assessment Logo Manager
          </CardTitle>
          <CardDescription>
            Upload or link logos for different assessments. These will appear on assessment pages and in reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Assessment Selection */}
          <div className="space-y-2">
            <Label htmlFor="assessment-select">Assessment Type</Label>
            <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
              <SelectTrigger>
                <SelectValue placeholder="Select an assessment type" />
              </SelectTrigger>
              <SelectContent>
                {assessmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Logo Name */}
          <div className="space-y-2">
            <Label htmlFor="logo-name">Logo Name</Label>
            <Input
              id="logo-name"
              value={logoName}
              onChange={(e) => setLogoName(e.target.value)}
              placeholder="Enter a name for this logo"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo-file">Upload Logo File</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="logo-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="logo-url">Or Enter Logo URL</Label>
            <Input
              id="logo-url"
              value={logoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Logo Preview */}
          {logoPreview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-h-32 max-w-full mx-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* Add Button */}
          <Button
            onClick={addLogo}
            disabled={!selectedAssessment || (!logoFile && !logoUrl) || !logoName.trim()}
            className="w-full"
          >
            <Check className="h-4 w-4 mr-2" />
            Add Logo
          </Button>
        </CardContent>
      </Card>

      {/* Existing Logos */}
      {logos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Assessment Logos</CardTitle>
            <CardDescription>
              Manage existing logos for assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logos.map((logo) => (
                <div key={logo.id} className="border rounded-lg p-4 space-y-3">
                  <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                    <img
                      src={logo.logoUrl}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{logo.name}</h4>
                    <p className="text-xs text-gray-600">
                      {getAssessmentLabel(logo.assessmentType)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeLogo(logo.id)}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LogoManager;
