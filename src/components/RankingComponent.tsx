import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle,
  Target
} from 'lucide-react';
import { CommunicationQuestion } from '@/data/communicationQuestions';

interface RankingComponentProps {
  question: CommunicationQuestion;
  onResponse: (response: any) => void;
}

export const RankingComponent: React.FC<RankingComponentProps> = ({ question, onResponse }) => {
  const [rankedOptions, setRankedOptions] = useState(question.options || []);
  const [isComplete, setIsComplete] = useState(false);

  const moveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...rankedOptions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newOptions.length) {
      [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];
      setRankedOptions(newOptions);
    }
  };

  const handleSubmit = () => {
    // Calculate weighted scores based on ranking
    const rankedResponse = rankedOptions.map((option, index) => ({
      ...option,
      rank: index + 1,
      weight: rankedOptions.length - index // Higher weight for higher ranked items
    }));
    
    setIsComplete(true);
    setTimeout(() => {
      onResponse(rankedResponse);
    }, 1000);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-green-500';
      case 2: return 'bg-blue-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1: return 'Most Preferred';
      case 2: return 'Second Choice';
      case 3: return 'Third Choice';
      case 4: return 'Least Preferred';
      default: return `${rank}th`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Ranking Exercise</span>
        </CardTitle>
        <CardDescription>
          Drag and drop or use the arrows to rank these options in order of preference
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Instructions:</strong> Rank the following options from most preferred (1) to least preferred ({rankedOptions.length}). 
            Use the arrow buttons to move items up or down in your ranking.
          </p>
        </div>

        {/* Ranking List */}
        <div className="space-y-3">
          {rankedOptions.map((option, index) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg transition-all duration-200 ${
                isComplete ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getRankColor(index + 1)}`}>
                  {index + 1}
                </div>
                
                {/* Option Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{option.text}</span>
                    <Badge variant="outline" className="text-xs">
                      {getRankLabel(index + 1)}
                    </Badge>
                  </div>
                  
                  {/* Show indicators for ranked item */}
                  <div className="flex flex-wrap gap-1">
                    {option.indicators.slice(0, 3).map((indicator, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {indicator.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Move Controls */}
                {!isComplete && (
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveOption(index, 'up')}
                      disabled={index === 0}
                      className="w-8 h-8 p-0"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveOption(index, 'down')}
                      disabled={index === rankedOptions.length - 1}
                      className="w-8 h-8 p-0"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {/* Completion Check */}
                {isComplete && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button 
            onClick={handleSubmit}
            disabled={isComplete}
            size="lg"
            className="px-8"
          >
            {isComplete ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Ranking Complete</span>
              </div>
            ) : (
              'Submit Ranking'
            )}
          </Button>
        </div>
        
        {isComplete && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">
              Your ranking has been recorded. Moving to next question...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};