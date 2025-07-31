import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkValuesAssessment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Link to="/assessment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Assessments
          </Link>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">Work Values & Motivation</h1>
            <p className="text-muted-foreground mb-4">Identify your core work values and motivational drivers to find greater career satisfaction and alignment.</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>16 minutes</span>
              <span>•</span>
              <span>45 questions</span>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-muted-foreground">
              The Work Values & Motivation assessment is currently under development. 
              This comprehensive evaluation will identify your core professional values using the Super Work Values Inventory framework.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold">Assessment will measure:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Achievement & Recognition motivation</li>
                <li>• Autonomy & Independence preferences</li>
                <li>• Social Impact & Service orientation</li>
                <li>• Security & Stability priorities</li>
                <li>• Growth & Learning drive</li>
                <li>• Work-Life Integration values</li>
                <li>• Innovation & Creativity motivation</li>
                <li>• Leadership & Influence aspirations</li>
                <li>• Collaboration & Teamwork preferences</li>
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

export default WorkValuesAssessment;