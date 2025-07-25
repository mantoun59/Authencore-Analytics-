import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, Heart, Lightbulb, Target, TrendingUp } from "lucide-react";

interface SmartRecommendationsProps {
  assessmentType: string;
  scores: { [key: string]: number };
  userProfile?: {
    industry?: string;
    role?: string;
    experience?: string;
  };
}

const SmartRecommendations = ({ assessmentType, scores, userProfile }: SmartRecommendationsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'development' | 'career' | 'industry'>('development');

  // Simple industry-specific recommendations
  const getIndustryRecommendations = () => {
    const industry = userProfile?.industry?.toLowerCase() || 'general';
    
    const industryTips: { [key: string]: string[] } = {
      'technology': [
        'Focus on continuous learning and staying current with tech trends',
        'Develop cross-functional collaboration skills',
        'Practice explaining technical concepts to non-technical stakeholders'
      ],
      'healthcare': [
        'Emphasize empathy and patient communication skills',
        'Build stress resilience for high-pressure situations',
        'Develop attention to detail and precision'
      ],
      'finance': [
        'Strengthen analytical and decision-making capabilities',
        'Focus on ethical decision-making frameworks',
        'Develop client relationship management skills'
      ],
      'education': [
        'Enhance communication and presentation skills',
        'Build adaptability for diverse learning styles',
        'Develop patience and mentoring capabilities'
      ],
      'general': [
        'Build versatile communication skills',
        'Develop emotional intelligence',
        'Focus on adaptability and learning agility'
      ]
    };

    return industryTips[industry] || industryTips['general'];
  };

  // Smart development recommendations based on scores
  const getDevelopmentRecommendations = () => {
    const recommendations = [];
    
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score < 60) {
        recommendations.push({
          area: dimension,
          priority: 'high',
          tips: getSpecificTips(dimension, 'low')
        });
      } else if (score < 80) {
        recommendations.push({
          area: dimension,
          priority: 'medium', 
          tips: getSpecificTips(dimension, 'medium')
        });
      }
    });

    return recommendations.slice(0, 3); // Top 3 priorities
  };

  const getSpecificTips = (dimension: string, level: string) => {
    const tipDatabase: { [key: string]: { [key: string]: string[] } } = {
      'communication': {
        'low': ['Practice active listening daily', 'Join a public speaking group', 'Record yourself presenting'],
        'medium': ['Seek feedback on presentation style', 'Practice difficult conversations', 'Learn storytelling techniques']
      },
      'leadership': {
        'low': ['Start leading small projects', 'Find a mentor', 'Read leadership books'],
        'medium': ['Practice delegation skills', 'Develop team coaching abilities', 'Learn conflict resolution']
      },
      'emotional': {
        'low': ['Practice mindfulness meditation', 'Keep an emotion journal', 'Learn to pause before reacting'],
        'medium': ['Develop empathy skills', 'Practice reading social cues', 'Learn stress management techniques']
      }
    };

    const dimKey = Object.keys(tipDatabase).find(key => 
      dimension.toLowerCase().includes(key)
    );

    return dimKey ? tipDatabase[dimKey][level] || [] : [
      'Focus on deliberate practice in this area',
      'Seek feedback from colleagues or mentors',
      'Set specific, measurable improvement goals'
    ];
  };

  const getCareerRecommendations = () => {
    const strongAreas = Object.entries(scores)
      .filter(([_, score]) => score >= 75)
      .map(([dimension]) => dimension);

    const careerPaths: { [key: string]: string[] } = {
      'communication': ['Sales', 'Marketing', 'Training', 'Consulting'],
      'leadership': ['Management', 'Project Management', 'Executive Roles'],
      'analytical': ['Data Analysis', 'Research', 'Strategic Planning'],
      'emotional': ['HR', 'Counseling', 'Team Leadership', 'Customer Success']
    };

    const suggestions = strongAreas.flatMap(area => {
      const areaKey = Object.keys(careerPaths).find(key => 
        area.toLowerCase().includes(key)
      );
      return areaKey ? careerPaths[areaKey] : [];
    });

    return [...new Set(suggestions)].slice(0, 4);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>
          Personalized development suggestions based on your results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="development">Development</TabsTrigger>
            <TabsTrigger value="career">Career Paths</TabsTrigger>
            <TabsTrigger value="industry">Industry Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="development" className="space-y-4 mt-4">
            {getDevelopmentRecommendations().map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{rec.area.replace('_', ' ')}</h4>
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <ul className="space-y-1">
                    {rec.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Target className="h-3 w-3 mt-1 text-blue-500 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="career" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recommended Career Paths
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {getCareerRecommendations().map((path, index) => (
                    <Badge key={index} variant="outline" className="justify-center p-2">
                      {path}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Based on your strongest competency areas
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industry" className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {userProfile?.industry || 'General'} Industry Tips
                </h4>
                <ul className="space-y-2">
                  {getIndustryRecommendations().map((tip, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <Heart className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;