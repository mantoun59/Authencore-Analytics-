import React from 'react';
import { Brain, Target, TrendingUp } from 'lucide-react';

const AIInsights = () => {
  return (
    <section className="py-20 bg-background mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">AI-Enhanced Development Insights</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Advanced artificial intelligence analyzes your response patterns to provide personalized, actionable insights for your professional development journey.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Pattern Recognition</h3>
            <p className="text-muted-foreground">
              AI identifies trends and patterns in your responses to provide deeper insights into your workplace preferences and professional tendencies.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Personalized Recommendations</h3>
            <p className="text-muted-foreground">
              Receive customized suggestions for professional development activities, learning opportunities, and career exploration based on your unique response patterns.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Professional Growth Planning</h3>
            <p className="text-muted-foreground">
              AI-powered analysis helps identify potential areas for growth and suggests specific actions to enhance your professional effectiveness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsights;