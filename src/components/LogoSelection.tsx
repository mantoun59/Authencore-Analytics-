import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLogo, logoOptions } from '@/contexts/LogoContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LogoSelection: React.FC = () => {
  const [localSelectedLogo, setLocalSelectedLogo] = useState<string>('');
  const { setSelectedLogo, selectedLogoId } = useLogo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUseSelectedLogo = () => {
    if (localSelectedLogo) {
      setSelectedLogo(localSelectedLogo);
      toast({
        title: "Logo Updated!",
        description: `Your logo has been updated to ${logoOptions.find(l => l.id === localSelectedLogo)?.name}`,
      });
      navigate('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Logo</h1>
        <p className="text-muted-foreground">Select from the AI-generated logo alternatives for AuthenCore Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {logoOptions.map((logo) => (
          <Card 
            key={logo.id}
            className={`cursor-pointer transition-all hover:shadow-lg hover-scale ${
              localSelectedLogo === logo.id ? 'ring-2 ring-primary' : ''
            } ${selectedLogoId === logo.id ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setLocalSelectedLogo(logo.id)}
          >
            <CardContent className="p-6">
              <div className="aspect-square bg-white rounded-lg mb-4 flex items-center justify-center border">
                <img 
                  src={logo.image} 
                  alt={logo.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{logo.name}</h3>
                  <div className="flex gap-2">
                    {localSelectedLogo === logo.id && (
                      <Badge variant="default">Selected</Badge>
                    )}
                    {selectedLogoId === logo.id && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{logo.style}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {localSelectedLogo && (
        <div className="mt-8 text-center">
          <Button size="lg" onClick={handleUseSelectedLogo} className="animate-scale-in">
            Use Selected Logo
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {logoOptions.find(l => l.id === localSelectedLogo)?.name}
          </p>
        </div>
      )}

      {selectedLogoId && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Currently using: {logoOptions.find(l => l.id === selectedLogoId)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default LogoSelection;