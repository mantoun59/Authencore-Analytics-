import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, MessageSquare, Globe, Heart, Users, Smartphone, Lightbulb, Shield, Gamepad2, Flame } from 'lucide-react';

const DevelopmentAreas = () => {
  const areas = [
    {
      id: 'career-launch',
      icon: Target,
      title: '🎯 Career Path Exploration',
      duration: '30-35 minutes',
      questions: 144,
      description: 'Explore career directions that align with your interests, values, and natural work preferences. Discover potential career paths and development opportunities.',
      features: [
        'Career interest patterns',
        'Work value alignment',
        'Industry fit exploration',
        'Growth pathway suggestions'
      ],
      route: '/career-launch'
    },
    {
      id: 'communication-styles',
      icon: MessageSquare,
      title: '💬 Communication Style Discovery',
      duration: '18-22 minutes',
      questions: 80,
      description: 'Understand your communication preferences and learn to adapt your style for different workplace situations and relationships.',
      features: [
        'Communication preference patterns',
        'Workplace interaction styles',
        'Conflict resolution approaches',
        'Team collaboration insights'
      ],
      route: '/communication-styles-assessment'
    },
    {
      id: 'cultural-intelligence',
      icon: Globe,
      title: '🌍 Cultural Intelligence Building',
      duration: '20-25 minutes',
      questions: 60,
      description: 'Develop awareness of your cross-cultural competencies and strategies for effective global workplace collaboration.',
      features: [
        'Cultural awareness patterns',
        'Cross-cultural adaptation strategies',
        'Global collaboration insights',
        'Diversity engagement approaches'
      ],
      route: '/cultural-intelligence'
    },
    {
      id: 'emotional-intelligence',
      icon: Heart,
      title: '🧠 Emotional Intelligence Exploration',
      duration: '12-15 minutes',
      questions: 60,
      description: 'Explore your emotional awareness patterns and interpersonal relationship tendencies in professional settings.',
      features: [
        'Emotional awareness patterns',
        'Interpersonal relationship insights',
        'Professional relationship strategies',
        'Workplace empathy development'
      ],
      route: '/emotional-intelligence'
    },
    {
      id: 'leadership',
      icon: Users,
      title: '👥 Leadership Approach Insights',
      duration: '15-20 minutes',
      questions: 40,
      description: 'Discover your natural leadership tendencies and explore different leadership approaches for various workplace contexts.',
      features: [
        'Leadership style preferences',
        'Team management approaches',
        'Situational leadership awareness',
        'Executive presence development'
      ],
      route: '/leadership-assessment'
    },
    {
      id: 'digital-wellness',
      icon: Smartphone,
      title: '📱 Digital Wellness Awareness',
      duration: '8-12 minutes',
      questions: 25,
      description: 'Examine your technology usage patterns and develop strategies for maintaining healthy digital boundaries at work.',
      features: [
        'Technology usage patterns',
        'Digital boundary strategies',
        'Productivity optimization tips',
        'Work-life tech balance'
      ],
      route: '/digital-wellness'
    },
    // Faith & Values assessment removed
    {
      id: 'stress-resilience',
      icon: Shield,
      title: '💪 Stress Resilience Building',
      duration: '25-30 minutes',
      questions: 102,
      description: 'Understand your stress response patterns and explore strategies for building workplace resilience and well-being.',
      features: [
        'Stress response patterns',
        'Resilience building strategies',
        'Coping mechanism insights',
        'Workplace wellness planning'
      ],
      route: '/stress-resilience'
    },
    {
      id: 'genz-workplace',
      icon: Gamepad2,
      title: '🎮 Gen Z Workplace Preferences',
      duration: '14-18 minutes',
      questions: 45,
      description: 'Explore modern workplace preferences, communication styles, and career expectations for the evolving professional landscape.',
      features: [
        'Workplace preference patterns',
        'Modern communication styles',
        'Career expectation exploration',
        'Technology integration preferences'
      ],
      route: '/genz-workplace'
    },
    {
      id: 'burnout-prevention',
      icon: Flame,
      title: '🔥 Burnout Prevention Awareness',
      duration: '25-30 minutes',
      questions: 102,
      description: 'Develop awareness of workplace stress patterns and explore strategies for maintaining engagement and preventing burnout.',
      features: [
        'Workplace stress awareness',
        'Engagement pattern insights',
        'Prevention strategy exploration',
        'Work-life balance optimization'
      ],
      route: '/stress-resilience'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">Professional Development Exploration Areas</h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          Comprehensive self-discovery experiences covering key aspects of professional growth and workplace effectiveness.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area) => {
            const IconComponent = area.icon;
            return (
              <div key={area.id} className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <IconComponent className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{area.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{area.duration} • {area.questions} questions</p>
                <p className="text-muted-foreground mb-4">{area.description}</p>
                <ul className="space-y-1 mb-6">
                  {area.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={area.route}>
                  <Button variant="outline" className="w-full">
                    Begin Exploration
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DevelopmentAreas;