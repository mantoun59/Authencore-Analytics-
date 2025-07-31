import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadershipBehaviorAssessment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Link to="/assessment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Link>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">Leadership Behaviors & Effectiveness</h1>
            <p className="text-muted-foreground mb-4">Measure your leadership behaviors across different styles and situations to enhance your leadership effectiveness.</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>17 minutes</span>
              <span>•</span>
              <span>40 questions</span>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              The Leadership Behaviors & Effectiveness assessment is currently under development. 
              This comprehensive evaluation will measure your leadership approach across six research-based leadership styles.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Assessment will include:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Visionary Leadership Assessment</li>
                <li>• Coaching Leadership Evaluation</li>
                <li>• Affiliative Leadership Analysis</li>
                <li>• Democratic Leadership Measurement</li>
                <li>• Pacesetting Leadership Review</li>
                <li>• Commanding Leadership Assessment</li>
              </ul>
            </div>
            <Button asChild>
              <Link to="/assessment">Explore Other Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadershipBehaviorAssessment;