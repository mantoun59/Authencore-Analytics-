import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, AlertTriangle, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface QualityScoreTooltipProps {
  qualityScore: number;
  isValid: boolean;
  warnings: string[];
  responseTime?: number;
  consistency?: number;
  completionRate?: number;
  children: React.ReactNode;
}

export const QualityScoreTooltip: React.FC<QualityScoreTooltipProps> = ({
  qualityScore,
  isValid,
  warnings,
  responseTime,
  consistency,
  completionRate,
  children,
}) => {
  const getQualityLevel = (score: number) => {
    if (score >= 85) return { level: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (score >= 70) return { level: 'Good', color: 'bg-blue-500', icon: TrendingUp };
    if (score >= 50) return { level: 'Fair', color: 'bg-yellow-500', icon: Target };
    return { level: 'Poor', color: 'bg-red-500', icon: AlertTriangle };
  };

  const quality = getQualityLevel(qualityScore);
  const QualityIcon = quality.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="w-80 p-0" side="left">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-full ${quality.color} text-white`}>
                  <QualityIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">Assessment Quality: {quality.level}</div>
                  <div className="text-sm text-muted-foreground">Score: {qualityScore}/100</div>
                </div>
              </div>

              {/* Validity Status */}
              <div className="flex items-center gap-2">
                {isValid ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Valid Assessment
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Quality Concerns
                  </Badge>
                )}
              </div>

              {/* Quality Metrics */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Quality Breakdown:</div>
                
                {completionRate !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="text-sm font-medium">{Math.round(completionRate)}%</span>
                  </div>
                )}
                
                {consistency !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Consistency</span>
                    <span className="text-sm font-medium">{Math.round(consistency * 100)}%</span>
                  </div>
                )}
                
                {responseTime !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Avg. Response Time
                    </span>
                    <span className="text-sm font-medium">{Math.round(responseTime)}s</span>
                  </div>
                )}
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Quality Indicators:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explanation */}
              <div className="text-xs text-muted-foreground border-t pt-2">
                <div className="font-medium mb-1">Quality Score Explained:</div>
                <p>
                  Based on completion rate (30%), response consistency (40%), 
                  and response timing patterns (30%). Higher scores indicate 
                  more reliable and thoughtful responses.
                </p>
              </div>
            </CardContent>
          </Card>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};