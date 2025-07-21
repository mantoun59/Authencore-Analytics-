import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

// Import generated logos
import logo1 from '../assets/logo-generated-1.png';
import logo2 from '../assets/logo-generated-2.png';
import logo3 from '../assets/logo-generated-3.png';
import logo4 from '../assets/logo-generated-4.png';
import logo5 from '../assets/logo-generated-5.png';
import logo6 from '../assets/logo-generated-6.png';
import logo7 from '../assets/logo-generated-7.png';
import logo8 from '../assets/logo-generated-8.png';
import logo9 from '../assets/logo-generated-9.png';
import logo10 from '../assets/logo-generated-10.png';
import logo11 from '../assets/logo-generated-11.png';
import logo12 from '../assets/logo-generated-12.png';
import logo13 from '../assets/logo-generated-13.png';
import logo14 from '../assets/logo-generated-14.png';
import logo15 from '../assets/logo-generated-15.png';
import logo16 from '../assets/logo-generated-16.png';
import logo17 from '../assets/logo-generated-17.png';
import logo18 from '../assets/logo-generated-18.png';

interface LogoOption {
  id: string;
  name: string;
  style: string;
  image: string;
}

const logoOptions: LogoOption[] = [
  {
    id: 'gen-1',
    name: 'Minimalist Geometric',
    style: 'Modern minimalist with navy and gold',
    image: logo1
  },
  {
    id: 'gen-2',
    name: 'Professional Corporate',
    style: 'Elegant typography with brain symbol',
    image: logo2
  },
  {
    id: 'gen-3',
    name: 'Tech Circuit',
    style: 'Tech-focused with circuit patterns',
    image: logo3
  },
  {
    id: 'gen-4',
    name: 'Data Visualization',
    style: 'Analytics dashboard inspired',
    image: logo4
  },
  {
    id: 'gen-5',
    name: 'Geometric Abstract',
    style: 'Interlocking hexagonal shapes',
    image: logo5
  },
  {
    id: 'gen-6',
    name: 'Clean Typography',
    style: 'Elegant wordmark with accent',
    image: logo6
  },
  {
    id: 'gen-7',
    name: 'Shield Security',
    style: 'Protective shield with analytics symbols',
    image: logo7
  },
  {
    id: 'gen-8',
    name: 'DNA Spiral',
    style: 'Double helix representing authenticity',
    image: logo8
  },
  {
    id: 'gen-9',
    name: 'Crystalline Gem',
    style: 'Faceted diamond symbolizing clarity',
    image: logo9
  },
  {
    id: 'gen-10',
    name: 'Neural Networks',
    style: 'Human profile with brain connections',
    image: logo10
  },
  {
    id: 'gen-11',
    name: 'Infinity Flow',
    style: 'Continuous analysis and potential',
    image: logo11
  },
  {
    id: 'gen-12',
    name: 'Compass Navigation',
    style: 'Guidance and directional leadership',
    image: logo12
  },
  {
    id: 'gen-13',
    name: 'Ribbon Wave',
    style: 'Flowing ribbon forming AC initials',
    image: logo13
  },
  {
    id: 'gen-14',
    name: 'Keyhole Security',
    style: 'Key and lock with data streams',
    image: logo14
  },
  {
    id: 'gen-15',
    name: 'Mountain Peak',
    style: 'Peak performance and insights',
    image: logo15
  },
  {
    id: 'gen-16',
    name: 'Network Nodes',
    style: 'Connected web pattern analysis',
    image: logo16
  },
  {
    id: 'gen-17',
    name: 'Origami Fold',
    style: 'Geometric layered insights design',
    image: logo17
  },
  {
    id: 'gen-18',
    name: 'Phoenix Rising',
    style: 'Transformation and renewal theme',
    image: logo18
  }
];

const LogoSelection: React.FC = () => {
  const [selectedLogo, setSelectedLogo] = useState<string>('');

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
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedLogo === logo.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedLogo(logo.id)}
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
                  {selectedLogo === logo.id && (
                    <Badge variant="default">Selected</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{logo.style}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLogo && (
        <div className="mt-8 text-center">
          <Button size="lg">
            Use Selected Logo
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {logoOptions.find(l => l.id === selectedLogo)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default LogoSelection;