import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Clock, 
  FileText, 
  Users, 
  Target, 
  Brain, 
  Star, 
  Eye,
  Play,
  Download,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentInfo {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questionCount: number;
  categories: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reportType: string;
  sampleQuestions?: string[];
  features: string[];
}

interface AssessmentPreviewProps {
  assessment: AssessmentInfo;
  onStart?: () => void;
  showSampleReport?: boolean;
  variant?: 'card' | 'inline';
}

export default function AssessmentPreview({ 
  assessment, 
  onStart, 
  showSampleReport = true,
  variant = 'card'
}: AssessmentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'interest':
      case 'riasec': return <Target className="h-4 w-4" />;
      case 'aptitude': return <Brain className="h-4 w-4" />;
      case 'personality': return <Users className="h-4 w-4" />;
      case 'values': return <Star className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleSampleReport = () => {
    navigate(`/sample-reports?assessment=${assessment.id}`);
  };

  const PreviewContent = () => (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
        <p className="text-muted-foreground mb-4">{assessment.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="font-semibold">{formatDuration(assessment.duration)}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="font-semibold">{assessment.questionCount}</div>
            <div className="text-xs text-muted-foreground">Questions</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="font-semibold">{assessment.categories.length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <Badge className={getDifficultyColor(assessment.difficulty)}>
              {assessment.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Assessment Categories</h4>
        <div className="grid grid-cols-2 gap-2">
          {assessment.categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              {getCategoryIcon(category)}
              <span className="text-sm capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Questions */}
      {assessment.sampleQuestions && (
        <div>
          <h4 className="font-medium mb-3">Sample Questions</h4>
          <div className="space-y-3">
            {assessment.sampleQuestions.slice(0, 3).map((question, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary/30">
                <p className="text-sm">{question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div>
        <h4 className="font-medium mb-3">What You'll Get</h4>
        <div className="space-y-2">
          {assessment.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={onStart} className="flex-1">
          <Play className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
        {showSampleReport && (
          <Button variant="outline" onClick={handleSampleReport}>
            <Download className="w-4 h-4 mr-2" />
            Sample Report
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === 'inline') {
    return <PreviewContent />;
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getCategoryIcon(assessment.categories[0] || '')}
            {assessment.title}
          </CardTitle>
          <Badge className={getDifficultyColor(assessment.difficulty)}>
            {assessment.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{assessment.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDuration(assessment.duration)}
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {assessment.questionCount} questions
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Assessment Preview</DialogTitle>
              </DialogHeader>
              <PreviewContent />
            </DialogContent>
          </Dialog>
          
          <Button onClick={onStart} size="sm" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}