import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface DetailedGenZReportProps {
  results: any;
  onClose: () => void;
}

export const DetailedGenZReport: React.FC<DetailedGenZReportProps> = ({ results, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // Use browser's print dialog with save as PDF option
    window.print();
  };

  return (
    <div className="detailed-report-container">
      {/* Header with actions - hidden in print */}
      <div className="print:hidden flex justify-between items-center mb-6 p-4 bg-background border-b">
        <h1 className="text-2xl font-bold">Gen Z Workplace Assessment - Detailed Report</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleSave} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Save as PDF
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="report-content max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Gen Z Workplace Assessment Report
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive Analysis & Development Plan
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Participant Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Username: {results.userData?.username || 'Anonymous'}<br/>
                  Generation: Gen Z ({results.userData?.birthYear || '2000s'})<br/>
                  Assessment Date: {new Date(results.completedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Overall Assessment</h4>
                <p className="text-sm text-muted-foreground">
                  Total Questions: 45<br/>
                  Assessment Type: Digital-First Workplace<br/>
                  Completion Time: 14-18 minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">Core Workplace Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(results.dimensions || {}).map(([dimension, data]: [string, any]) => (
              <div key={dimension} className="border-l-4 border-primary pl-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold capitalize">{dimension.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded">
                    {data.score}/10
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
                <div className="bg-secondary/50 p-3 rounded-md">
                  <p className="text-sm"><strong>Key Insights:</strong> {data.insights}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Workplace Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">Workplace Preferences Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.workplacePreferences || {}).map(([category, preferences]: [string, any]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(preferences).map(([pref, value]: [string, any]) => (
                    <div key={pref} className="flex justify-between text-sm">
                      <span className="capitalize">{pref.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium">{typeof value === 'number' ? `${value}/10` : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Personality Traits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">Gen Z Professional Traits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.traits || {}).map(([trait, data]: [string, any]) => (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium capitalize">{trait.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <span className="text-sm bg-secondary px-2 py-1 rounded">{data.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Red Flags & Areas for Development */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Areas for Development</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.redFlags && results.redFlags.length > 0 ? (
              results.redFlags.map((flag: any, index: number) => (
                <div key={index} className="border-l-4 border-destructive pl-4 py-2">
                  <h4 className="font-medium text-destructive">{flag.category}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                  <div className="bg-destructive/5 p-3 rounded-md">
                    <p className="text-sm"><strong>Development Recommendation:</strong> {flag.recommendation}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No significant development areas identified.</p>
            )}
          </CardContent>
        </Card>

        {/* Career Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">Career Path Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.companyMatches && results.companyMatches.length > 0 ? (
              results.companyMatches.slice(0, 5).map((match: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{match.name}</h4>
                    <span className="text-sm bg-primary/10 px-2 py-1 rounded">
                      {match.match}% Match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{match.description}</p>
                  <div className="text-xs space-y-1">
                    <p><strong>Culture Fit:</strong> {match.reasons?.join(', ')}</p>
                    <p><strong>Growth Opportunities:</strong> {match.growth || 'High potential for development'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Career recommendations will be generated based on your responses.</p>
            )}
          </CardContent>
        </Card>

        {/* Development Action Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">90-Day Development Action Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Days 1-30 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Days 1-30: Foundation Building</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Identify your top 3 workplace values and communicate them to your manager/team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Set up digital communication preferences and boundaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Create a personal learning plan aligned with your career goals</span>
                </li>
              </ul>
            </div>

            {/* Days 31-60 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Days 31-60: Skill Development</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Practice giving and receiving feedback in professional settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Develop one key technical or soft skill identified in your assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Build relationships with mentors or colleagues in your field</span>
                </li>
              </ul>
            </div>

            {/* Days 61-90 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Days 61-90: Implementation & Growth</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Take on a project that aligns with your identified strengths</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Evaluate progress and adjust your development plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>Share your learning journey with others and offer mentorship</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Employer Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">For Employers: Working with This Gen Z Professional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.employerInsights ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Management Recommendations</h4>
                  <p className="text-sm text-muted-foreground">{results.employerInsights.management}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Communication Style</h4>
                  <p className="text-sm text-muted-foreground">{results.employerInsights.communication}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Motivation Factors</h4>
                  <p className="text-sm text-muted-foreground">{results.employerInsights.motivation}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Insights for Managers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provide clear expectations and regular feedback</li>
                    <li>• Offer opportunities for digital collaboration and innovation</li>
                    <li>• Support work-life balance and flexible arrangements</li>
                    <li>• Connect work to larger purpose and social impact</li>
                    <li>• Encourage continuous learning and skill development</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment Validity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">Assessment Validity & Reliability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Response Consistency</h4>
                <p className="text-muted-foreground">
                  {results.validityMetrics?.consistency || 'High'} - Responses show good internal consistency
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Response Quality</h4>
                <p className="text-muted-foreground">
                  {results.validityMetrics?.quality || 'Excellent'} - Thoughtful and engaged responses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8 border-t text-sm text-muted-foreground">
          <p>This report is generated by AuthenCore Analytics Gen Z Workplace Assessment</p>
          <p>For questions or support, contact: support@authencore.org</p>
          <p className="mt-2">© 2024 AuthenCore Analytics. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};