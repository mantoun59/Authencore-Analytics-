import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Target, Clock, Star, ArrowRight, Lightbulb, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SkillPrediction {
  id: string;
  predicted_skills: any;
  skills_gap_analysis: any;
  recommended_learning_path: any;
  future_readiness_score: number;
  confidence_level: number;
  prediction_metadata: any;
  generated_at: string;
}

interface CareerPathway {
  id: string;
  predicted_pathways: any;
  skills_progression: any;
  market_opportunities: any;
  confidence_scores: any;
  user_current_role: string;
}

const FutureSkillsAIEngine: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skillsPrediction, setSkillsPrediction] = useState<SkillPrediction | null>(null);
  const [careerPathways, setCareerPathways] = useState<CareerPathway | null>(null);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    if (user) {
      loadExistingPredictions();
    }
  }, [user]);

  const loadExistingPredictions = async () => {
    try {
      // Load latest skills prediction
      const { data: skillsData } = await supabase
        .from('user_skills_predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (skillsData) {
        setSkillsPrediction(skillsData);
      }

      // Load latest career pathway
      const { data: pathwayData } = await supabase
        .from('career_pathway_predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pathwayData) {
        setCareerPathways(pathwayData);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  const generateSkillsPrediction = async () => {
    if (!user) {
      toast.error('Please sign in to generate predictions');
      return;
    }

    setLoading(true);
    try {
      // Get latest assessment result
      const { data: assessmentData } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!assessmentData) {
        toast.error('Please complete an assessment first');
        return;
      }

      const { data, error } = await supabase.functions.invoke('skills-prediction-engine', {
        body: {
          userId: user.id,
          assessmentData: assessmentData,
          assessmentType: assessmentData.assessment_type,
          industryContext: 'Technology',
          roleContext: 'Professional',
          timeframe: 36
        }
      });

      if (error) throw error;

      setSkillsPrediction(data.prediction);
      toast.success('🔮 Future skills prediction generated!');
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast.error('Failed to generate skills prediction');
    } finally {
      setLoading(false);
    }
  };

  const generateCareerPathways = async () => {
    if (!user) {
      toast.error('Please sign in to generate pathways');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('career-pathway-generator', {
        body: {
          userId: user.id,
          currentRole: 'Software Developer',
          skillsPredictionId: skillsPrediction?.id,
          industryPreference: 'Technology',
          careerGoals: ['Leadership', 'Technical Excellence', 'Innovation'],
          timeHorizon: 5
        }
      });

      if (error) throw error;

      setCareerPathways(data.pathway);
      toast.success('🛤️ Career pathways generated!');
    } catch (error) {
      console.error('Error generating pathways:', error);
      toast.error('Failed to generate career pathways');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillsPrediction = () => {
    if (!skillsPrediction) {
      return (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">AI Skills Prediction</h3>
          <p className="text-muted-foreground mb-6">
            Get AI-powered insights into future skills you'll need based on your assessment results
          </p>
          <Button onClick={generateSkillsPrediction} disabled={loading} size="lg">
            <Brain className="mr-2 h-5 w-5" />
            Generate Skills Prediction
          </Button>
        </div>
      );
    }

    const topSkills = Object.entries(skillsPrediction.predicted_skills || {})
      .sort(([,a], [,b]) => Number(b) - Number(a))
      .slice(0, 6);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Future Readiness</p>
                  <p className="text-3xl font-bold text-primary">
                    {Math.round(skillsPrediction.future_readiness_score)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confidence Level</p>
                  <p className="text-3xl font-bold text-secondary">
                    {Math.round(skillsPrediction.confidence_level * 100)}%
                  </p>
                </div>
                <Star className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Skills Forecast</p>
                  <p className="text-3xl font-bold text-accent">36M</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Predicted Skills
            </CardTitle>
            <CardDescription>
              Skills you'll need in the next 3 years based on AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSkills.map(([skill, confidence]) => (
                <div key={skill} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{skill}</span>
                      <Badge variant="secondary">{Math.round(Number(confidence) * 100)}%</Badge>
                    </div>
                    <Progress value={Number(confidence) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Learning Path Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(skillsPrediction.recommended_learning_path || []).slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                    {item.priority}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.skill}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.rationale}</p>
                    <p className="text-sm font-medium">Time to Learn: {item.timeToLearn}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCareerPathways = () => {
    if (!careerPathways) {
      return (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Career Pathway Generator</h3>
          <p className="text-muted-foreground mb-6">
            Get AI-powered career progression pathways tailored to your skills and goals
          </p>
          <Button onClick={generateCareerPathways} disabled={loading} size="lg">
            <MapPin className="mr-2 h-5 w-5" />
            Generate Career Pathways
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Role</p>
                  <p className="text-xl font-bold">{careerPathways.user_current_role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pathway Confidence</p>
                  <p className="text-xl font-bold text-primary">
                    {Math.round(careerPathways.confidence_scores.overall * 100)}%
                  </p>
                </div>
                <Star className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(careerPathways.predicted_pathways || []).slice(0, 4).map((pathway, index) => (
            <Card key={pathway.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pathway.title}</CardTitle>
                  <Badge variant={pathway.viabilityScore > 0.8 ? 'default' : 'secondary'}>
                    {Math.round(pathway.viabilityScore * 100)}% viable
                  </Badge>
                </div>
                <CardDescription>{pathway.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Time to achieve: {pathway.timeToAchieve}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Salary growth: {pathway.salaryGrowthPotential}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{pathway.marketDemand} demand</Badge>
                  </div>
                  
                  <div className="pt-3">
                    <h5 className="font-medium mb-2">Next Steps:</h5>
                    <ul className="text-sm space-y-1">
                      {pathway.steps?.slice(0, 2).map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-primary" />
                          {step.role}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skills Progression Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-red-600">Immediate (0-6 months)</h4>
                <div className="space-y-2">
                  {(careerPathways.skills_progression?.immediateSkills || []).map((skill, index) => (
                    <Badge key={index} variant="destructive">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-yellow-600">Short-term (6-18 months)</h4>
                <div className="space-y-2">
                  {(careerPathways.skills_progression?.shortTermSkills || []).map((skill, index) => (
                    <Badge key={index} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-600">Long-term (18+ months)</h4>
                <div className="space-y-2">
                  {(careerPathways.skills_progression?.longTermSkills || []).map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Future Skills AI Intelligence Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Predict your future skills needs and career pathways using advanced AI intelligence for up to 3 years ahead
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Skills Prediction
          </TabsTrigger>
          <TabsTrigger value="pathways" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Career Pathways
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-6">
          {renderSkillsPrediction()}
        </TabsContent>

        <TabsContent value="pathways" className="mt-6">
          {renderCareerPathways()}
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>AI is analyzing your future...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FutureSkillsAIEngine;