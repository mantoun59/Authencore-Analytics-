import React, { useState, useEffect } from 'react';
import { Upload, Image, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { assessmentsData } from '@/data/assessmentsData';

export const AssessmentLogoUpload = () => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedLogos, setUploadedLogos] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load existing logos on component mount
  useEffect(() => {
    const loadExistingLogos = async () => {
      const logoUrls: Record<string, string> = {};
      
      for (const assessment of assessmentsData) {
        // Try common file extensions
        const extensions = ['png', 'jpg', 'jpeg', 'svg'];
        
        for (const ext of extensions) {
          const fileName = `${assessment.id}-logo.${ext}`;
          const { data } = supabase.storage
            .from('assessment-logos')
            .getPublicUrl(fileName);
          
          // Check if file exists by trying to fetch it
          try {
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              logoUrls[assessment.id] = data.publicUrl;
              break; // Found a logo, stop checking other extensions
            }
          } catch (error) {
            // Continue to next extension
          }
        }
      }
      
      setUploadedLogos(logoUrls);
    };
    
    loadExistingLogos();
  }, []);

  const handleFileUpload = async (file: File, assessmentId: string) => {
    try {
      setUploading(prev => ({ ...prev, [assessmentId]: true }));

      // Create a clean filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${assessmentId}-logo.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('assessment-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assessment-logos')
        .getPublicUrl(fileName);

      setUploadedLogos(prev => ({ ...prev, [assessmentId]: urlData.publicUrl }));

      toast({
        title: "Logo uploaded successfully",
        description: `Logo for ${assessmentsData.find(a => a.id === assessmentId)?.title} has been uploaded.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [assessmentId]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, assessmentId: string) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile, assessmentId);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, assessmentId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, assessmentId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Assessment Logo Manager</h2>
        <p className="text-muted-foreground">
          Upload logos for each assessment. Logos will automatically appear in assessments, reports, and other relevant pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessmentsData.map((assessment) => (
          <Card key={assessment.id} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {assessment.title}
                {uploadedLogos[assessment.id] && (
                  <Badge variant="secondary" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={(e) => handleDrop(e, assessment.id)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => {
                  const input = document.getElementById(`file-${assessment.id}`) as HTMLInputElement;
                  input?.click();
                }}
              >
                {uploadedLogos[assessment.id] ? (
                  <div className="space-y-2">
                    <img
                      src={uploadedLogos[assessment.id]}
                      alt={`${assessment.title} logo`}
                      className="w-16 h-16 object-contain mx-auto rounded"
                    />
                    <p className="text-xs text-muted-foreground">Click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {uploading[assessment.id] ? (
                      <div className="animate-spin">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      </div>
                    ) : (
                      <Image className="w-8 h-8 mx-auto text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {uploading[assessment.id] ? 'Uploading...' : 'Drop logo here or click to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 2MB</p>
                  </div>
                )}
                
                <input
                  id={`file-${assessment.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, assessment.id)}
                  disabled={uploading[assessment.id]}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📋 Logo Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Recommended size: 256x256px or larger (square aspect ratio preferred)</li>
          <li>• Supported formats: PNG, JPG, SVG</li>
          <li>• Maximum file size: 2MB</li>
          <li>• Logos will be automatically resized for different contexts</li>
          <li>• Use transparent backgrounds (PNG) for best results</li>
        </ul>
      </div>
    </div>
  );
};