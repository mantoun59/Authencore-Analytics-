import React from 'react';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LogoDisplay from '@/components/LogoDisplay';
import { useNavigate } from 'react-router-dom';

const LogoGallery: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Official AuthenCore Analytics Logo</h1>
              <p className="text-foreground mt-1">
                Our finalized logo representing excellence in assessment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Display */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Official Brand Logo</CardTitle>
              <p className="text-muted-foreground">
                Our finalized logo representing AuthenCore Analytics excellence
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="p-8 bg-white rounded-lg shadow-md">
                  <LogoDisplay size="lg" showTagline={true} />
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This official logo embodies our mission to provide cutting-edge psychometric assessments 
                and analytics solutions. It represents our commitment to professional excellence and 
                innovative assessment technologies.
              </p>
              <Button onClick={() => navigate('/')} size="lg">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogoGallery;