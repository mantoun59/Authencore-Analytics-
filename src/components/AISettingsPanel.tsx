import React, { createContext, useContext, useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Brain, DollarSign } from 'lucide-react';

interface AISettingsContextType {
  aiEnabled: boolean;
  setAiEnabled: (enabled: boolean) => void;
  cacheEnabled: boolean;
  setCacheEnabled: (enabled: boolean) => void;
  transparencyMode: boolean;
  setTransparencyMode: (enabled: boolean) => void;
  costOptimization: boolean;
  setCostOptimization: (enabled: boolean) => void;
}

const AISettingsContext = createContext<AISettingsContextType | undefined>(undefined);

export const useAISettings = () => {
  const context = useContext(AISettingsContext);
  if (!context) {
    throw new Error('useAISettings must be used within AISettingsProvider');
  }
  return context;
};

interface AISettingsProviderProps {
  children: React.ReactNode;
}

export const AISettingsProvider: React.FC<AISettingsProviderProps> = ({ children }) => {
  const [aiEnabled, setAiEnabled] = useState(() => {
    const saved = localStorage.getItem('ai-enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [cacheEnabled, setCacheEnabled] = useState(() => {
    const saved = localStorage.getItem('ai-cache-enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [transparencyMode, setTransparencyMode] = useState(() => {
    const saved = localStorage.getItem('ai-transparency-mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [costOptimization, setCostOptimization] = useState(() => {
    const saved = localStorage.getItem('ai-cost-optimization');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('ai-enabled', JSON.stringify(aiEnabled));
  }, [aiEnabled]);

  useEffect(() => {
    localStorage.setItem('ai-cache-enabled', JSON.stringify(cacheEnabled));
  }, [cacheEnabled]);

  useEffect(() => {
    localStorage.setItem('ai-transparency-mode', JSON.stringify(transparencyMode));
  }, [transparencyMode]);

  useEffect(() => {
    localStorage.setItem('ai-cost-optimization', JSON.stringify(costOptimization));
  }, [costOptimization]);

  return (
    <AISettingsContext.Provider
      value={{
        aiEnabled,
        setAiEnabled,
        cacheEnabled,
        setCacheEnabled,
        transparencyMode,
        setTransparencyMode,
        costOptimization,
        setCostOptimization,
      }}
    >
      {children}
    </AISettingsContext.Provider>
  );
};

export const AISettingsPanel: React.FC = () => {
  const {
    aiEnabled,
    setAiEnabled,
    cacheEnabled,
    setCacheEnabled,
    transparencyMode,
    setTransparencyMode,
    costOptimization,
    setCostOptimization,
  } = useAISettings();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Settings & Privacy
        </CardTitle>
        <CardDescription>
          Configure AI features, privacy settings, and cost optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="ai-enabled" className="text-base font-medium">
              AI Features
            </Label>
            <p className="text-sm text-muted-foreground">
              Enable AI-powered analysis and recommendations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="ai-enabled"
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
              aria-label="Toggle AI features"
            />
            <Badge variant={aiEnabled ? 'default' : 'secondary'}>
              {aiEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="cache-enabled" className="text-base font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Smart Caching
            </Label>
            <p className="text-sm text-muted-foreground">
              Cache AI responses to reduce costs and improve performance
            </p>
          </div>
          <Switch
            id="cache-enabled"
            checked={cacheEnabled}
            onCheckedChange={setCacheEnabled}
            disabled={!aiEnabled}
            aria-label="Toggle AI response caching"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="transparency-mode" className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Transparency Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Clearly label AI-generated content in reports and assessments
            </p>
          </div>
          <Switch
            id="transparency-mode"
            checked={transparencyMode}
            onCheckedChange={setTransparencyMode}
            disabled={!aiEnabled}
            aria-label="Toggle AI transparency labeling"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="cost-optimization" className="text-base font-medium">
              Cost Optimization
            </Label>
            <p className="text-sm text-muted-foreground">
              Use efficient models and batch requests to minimize costs
            </p>
          </div>
          <Switch
            id="cost-optimization"
            checked={costOptimization}
            onCheckedChange={setCostOptimization}
            disabled={!aiEnabled}
            aria-label="Toggle AI cost optimization"
          />
        </div>

        {!aiEnabled && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              When AI features are disabled, assessments will use traditional scoring methods. 
              All data processing will be done locally without AI assistance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};