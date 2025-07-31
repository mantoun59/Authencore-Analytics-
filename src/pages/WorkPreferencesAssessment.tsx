import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkPreferencesAssessment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Link to="/assessment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Link>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">Individual Work Preferences</h1>
            <p className="text-muted-foreground mb-4">Assess your individual workplace preferences to identify optimal environments for maximum productivity and satisfaction.</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>15 minutes</span>
              <span>•</span>
              <span>35 questions</span>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-muted-foreground">
              The Individual Work Preferences assessment is currently under development. 
              This evaluation will help you understand your ideal work environment using the Job Characteristics Model.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Assessment will evaluate:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Work Environment preferences</li>
                <li>• Communication Style preferences</li>
                <li>• Career Expectations</li>
                <li>• Technology Integration comfort</li>
                <li>• Multigenerational Strategies</li>
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

export default WorkPreferencesAssessment;