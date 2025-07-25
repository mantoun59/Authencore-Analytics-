import React, { useState, useEffect } from 'react';
import { Users, Image, Sparkles, Upload, Download, FileText, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface MarketingFile {
  id: string;
  name: string;
  title: string;
  description: string;
  size: number;
  url: string;
  uploaded_at: string;
}

const MarketingMaterials: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<MarketingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('marketing-materials')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const filesWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('marketing-materials')
            .getPublicUrl(file.name);

          return {
            id: file.id || file.name,
            name: file.name,
            title: file.metadata?.title || file.name.replace(/\.[^/.]+$/, ""),
            description: file.metadata?.description || '',
            size: file.metadata?.size || 0,
            url: urlData.publicUrl,
            uploaded_at: file.created_at || file.updated_at || new Date().toISOString()
          };
        })
      );

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load marketing materials",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "Missing Information",
        description: "Please provide both a file and title",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}-${uploadForm.title.replace(/[^a-zA-Z0-9]/g, '-')}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('marketing-materials')
        .upload(fileName, uploadForm.file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            title: uploadForm.title,
            description: uploadForm.description,
            size: uploadForm.file.size,
            originalName: uploadForm.file.name
          }
        });

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Marketing material uploaded successfully",
      });

      // Reset form
      setUploadForm({ title: '', description: '', file: null });
      
      // Reload files
      loadFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload marketing material",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (file: MarketingFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (file: MarketingFile) => {
    try {
      const { error } = await supabase.storage
        .from('marketing-materials')
        .remove([file.name]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marketing material deleted successfully",
      });

      loadFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete marketing material",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Professional Marketing Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Marketing Materials
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional, ready-to-use marketing materials to showcase AuthenCore Analytics' 
              comprehensive assessment platform. Upload and manage branded collateral for presentations, 
              proposals, and client communications.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{files.length}</div>
                <div className="text-sm text-muted-foreground">Materials Available</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-accent mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Completed Assessments</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-secondary mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-muted-foreground">Industries Served</div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Marketing Material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Company Brochure 2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">PDF File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the marketing material..."
                    rows={3}
                  />
                </div>
                <Button type="submit" disabled={uploading} className="w-full md:w-auto">
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Material
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Files Grid */}
          {files.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card key={file.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-500" />
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {file.title}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary">PDF</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {file.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {file.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleDownload(file)}
                        size="sm" 
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        onClick={() => window.open(file.url, '_blank')}
                        size="sm" 
                        variant="outline"
                        className="px-3"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(file)}
                        size="sm" 
                        variant="outline"
                        className="px-3 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No Marketing Materials Yet
                </h3>
                <p className="text-muted-foreground">
                  Upload your first PDF marketing material using the form above.
                </p>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Need Custom Marketing Materials?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We can create customized marketing materials tailored to your specific needs. 
                  Contact our team for branded collateral that aligns with your organization's identity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Users className="w-5 h-5 mr-2" />
                    Contact Sales Team
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/5">
                    <Image className="w-5 h-5 mr-2" />
                    Request Custom Design
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MarketingMaterials;