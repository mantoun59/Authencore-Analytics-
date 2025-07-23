import React from 'react';
import { useLogo } from '@/contexts/LogoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Palette } from 'lucide-react';

const LogoSelector: React.FC = () => {
  const { selectedLogoId, setSelectedLogo, logoOptions } = useLogo();

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <CardTitle>Choose Your Brand Logo</CardTitle>
        </div>
        <CardDescription>
          Select from our collection of vibrant, professional logo variations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logoOptions.map((logo) => (
            <div
              key={logo.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                selectedLogoId === logo.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedLogo(logo.id)}
            >
              {selectedLogoId === logo.id && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-primary">
                    <Check className="w-3 h-3 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
              
              <div className="flex flex-col items-center space-y-3">
                <div className="w-24 h-24 flex items-center justify-center bg-white rounded-lg shadow-sm">
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-sm">{logo.name.replace('AuthenCore Analytics ', '')}</h3>
                  <p className="text-xs text-muted-foreground">{logo.style}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Current Selection
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <img
                src={logoOptions.find(logo => logo.id === selectedLogoId)?.image}
                alt="Selected logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <p className="font-medium">
                {logoOptions.find(logo => logo.id === selectedLogoId)?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {logoOptions.find(logo => logo.id === selectedLogoId)?.style}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoSelector;