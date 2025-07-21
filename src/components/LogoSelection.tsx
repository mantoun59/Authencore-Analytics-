import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import LogoDisplay from './LogoDisplay';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LogoSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Official AuthenCore Analytics Logo</CardTitle>
            <p className="text-muted-foreground">
              Our approved final logo for all platforms and materials
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-8 bg-white rounded-lg shadow-md">
                <LogoDisplay size="lg" showTagline={true} />
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This logo is now being used across all assessments, reports, and platform materials 
              to maintain consistent branding and professional appearance.
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              Continue to Platform
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogoSelection;