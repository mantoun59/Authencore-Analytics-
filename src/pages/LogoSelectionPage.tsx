import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LogoDisplay from '@/components/LogoDisplay';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LogoSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Official Brand Logo</CardTitle>
              <p className="text-muted-foreground">
                We are now using our final approved logo across all platforms
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="p-8 bg-white rounded-lg shadow-md">
                  <LogoDisplay size="lg" showTagline={true} />
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This is our official AuthenCore Analytics logo that represents our commitment to 
                reading minds and shaping futures through advanced psychometric assessments.
              </p>
              <Button onClick={() => navigate('/')} size="lg">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogoSelectionPage;