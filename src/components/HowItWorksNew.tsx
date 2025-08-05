import React from 'react';
import { ChevronRight, Users, Brain, Target, CheckCircle } from 'lucide-react';

const HowItWorksNew = () => {
  return (
    <section className="py-20 bg-background mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">Your Development Journey</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">1</div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Choose Your Exploration Area</h3>
              <p className="text-muted-foreground">
                Select from 10 different professional development areas including career interests, communication styles, leadership approaches, and workplace wellness.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">2</div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Engage in Self-Discovery</h3>
              <p className="text-muted-foreground">
                Respond to thoughtfully designed scenarios and questions that help you reflect on your preferences, tendencies, and workplace experiences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">3</div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Receive Development Insights</h3>
              <p className="text-muted-foreground">
                Get personalized insights about your response patterns, along with practical suggestions for professional growth and development.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-primary">4</div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Create Your Action Plan</h3>
              <p className="text-muted-foreground">
                Use your insights to inform career decisions, improve workplace relationships, and create targeted professional development goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksNew;