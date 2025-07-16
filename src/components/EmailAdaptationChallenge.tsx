import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import { CulturalChallenge } from '@/data/culturalScenarios';

interface EmailAdaptationChallengeProps {
  challenge: CulturalChallenge;
  onComplete: (results: any) => void;
}

export const EmailAdaptationChallenge: React.FC<EmailAdaptationChallengeProps> = ({ challenge, onComplete }) => {
  const [adaptations, setAdaptations] = useState<Array<{ targetCountry: string; text: string; showHints: boolean }>>([]);
  const [isComplete, setIsComplete] = useState(false);

  React.useEffect(() => {
    if (challenge.adaptationTargets) {
      setAdaptations(
        challenge.adaptationTargets.map(target => ({
          targetCountry: target.country,
          text: '',
          showHints: false
        }))
      );
    }
  }, [challenge]);

  const updateAdaptation = (index: number, text: string) => {
    setAdaptations(prev => 
      prev.map((adaptation, i) => 
        i === index ? { ...adaptation, text } : adaptation
      )
    );
  };

  const toggleHints = (index: number) => {
    setAdaptations(prev => 
      prev.map((adaptation, i) => 
        i === index ? { ...adaptation, showHints: !adaptation.showHints } : adaptation
      )
    );
  };

  const handleSubmit = () => {
    const results = adaptations.map(adaptation => ({
      targetCountry: adaptation.targetCountry,
      text: adaptation.text
    }));
    
    setIsComplete(true);
    setTimeout(() => {
      onComplete(results);
    }, 1500);
  };

  const canSubmit = adaptations.every(adaptation => adaptation.text.trim().length > 50);

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'Japan': '🇯🇵',
      'Brazil': '🇧🇷',
      'Germany': '🇩🇪',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'France': '🇫🇷',
      'Mexico': '🇲🇽'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-6 w-6" />
            <span>Email Adaptation Challenge</span>
          </CardTitle>
          <CardDescription>
            Adapt this direct American email for different cultural contexts
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Original Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🇺🇸</span>
            <span>Original Message (US Context)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm whitespace-pre-line">
            {challenge.originalMessage}
          </div>
        </CardContent>
      </Card>

      {/* Adaptation Grid */}
      <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {adaptations.map((adaptation, index) => {
          const targetInfo = challenge.adaptationTargets?.[index];
          if (!targetInfo) return null;

          return (
            <Card key={adaptation.targetCountry} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">{getCountryFlag(adaptation.targetCountry)}</span>
                  <span>{adaptation.targetCountry}</span>
                </CardTitle>
                <CardDescription>
                  Adapt the message for {adaptation.targetCountry.toLowerCase()} business culture
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Textarea
                  value={adaptation.text}
                  onChange={(e) => updateAdaptation(index, e.target.value)}
                  placeholder={`Rewrite the email for ${adaptation.targetCountry} culture...`}
                  className="min-h-[200px] resize-none"
                  disabled={isComplete}
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {adaptation.text.length} characters
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleHints(index)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {adaptation.showHints ? 'Hide' : 'Show'} Hints
                  </Button>
                </div>
                
                {adaptation.showHints && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                      Cultural Adaptation Tips:
                    </h5>
                    <ul className="space-y-1">
                      {targetInfo.hints.map((hint, hintIndex) => (
                        <li key={hintIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-sm text-amber-700 dark:text-amber-300">{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {adaptation.text.length > 50 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Adaptation complete</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={handleSubmit}
          disabled={!canSubmit || isComplete}
          size="lg"
          className="px-8"
        >
          {isComplete ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Challenge Complete!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Submit All Adaptations</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </Button>
        
        {!canSubmit && !isComplete && (
          <p className="text-sm text-muted-foreground mt-2">
            Complete all adaptations (minimum 50 characters each) to continue
          </p>
        )}
      </div>
      
      {isComplete && (
        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
            Excellent Cultural Adaptation!
          </h3>
          <p className="text-green-600 dark:text-green-400">
            Your adaptations show strong cultural intelligence. Moving to next challenge...
          </p>
        </div>
      )}
    </div>
  );
};