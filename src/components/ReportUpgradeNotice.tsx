import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles, BarChart3, Target, Brain, FileText } from 'lucide-react';

export const ReportUpgradeNotice: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Reports Enhanced!</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            NEW
          </Badge>
        </div>
        
        <p className="text-blue-800 mb-4 text-sm">
          Your assessment reports now include:
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <CheckCircle className="h-4 w-4" />
            <span>AI-powered insights & analysis</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <BarChart3 className="h-4 w-4" />
            <span>Interactive charts & visualizations</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Target className="h-4 w-4" />
            <span>90-day development plans</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Brain className="h-4 w-4" />
            <span>Professional competency matrix</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <FileText className="h-4 w-4" />
            <span>Executive-quality formatting</span>
          </div>
        </div>
        
        <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
          <strong>Worth your investment:</strong> Professional reports with comprehensive analysis, actionable insights, and beautiful presentation.
        </div>
      </Card>
    </div>
  );
};