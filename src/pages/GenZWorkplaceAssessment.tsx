import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGenZScoring, GenZScoringData } from '@/hooks/useGenZScoring';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

type AssessmentStep = 'welcome' | 'onboarding' | 'scenarios' | 'values' | 'collaboration' | 'results';

interface Scenario {
  id: string;
  category: string;
  type: string;
  text: string;
  context?: string;
  emoji?: string;
  responses: any; // JSON from database
}

interface ValueCard {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

const VALUES_CARDS: ValueCard[] = [
  { id: 'v1', emoji: '💰', title: 'Fair Pay', description: 'Competitive salary & equity' },
  { id: 'v2', emoji: '🏠', title: 'Remote First', description: 'Work from anywhere' },
  { id: 'v3', emoji: '📈', title: 'Growth Path', description: 'Clear career progression' },
  { id: 'v4', emoji: '🌱', title: 'Learning', description: 'Continuous skill development' },
  { id: 'v5', emoji: '⚖️', title: 'Work-Life Balance', description: 'Sustainable pace' },
  { id: 'v6', emoji: '🌍', title: 'Impact', description: 'Meaningful work' },
  { id: 'v7', emoji: '👥', title: 'Great Team', description: 'Collaborative culture' },
  { id: 'v8', emoji: '🎯', title: 'Autonomy', description: 'Own your work' },
  { id: 'v9', emoji: '🏥', title: 'Benefits', description: 'Health, mental, dental' },
  { id: 'v10', emoji: '🌈', title: 'Diversity', description: 'Inclusive environment' },
  { id: 'v11', emoji: '🚀', title: 'Innovation', description: 'Cutting-edge work' },
  { id: 'v12', emoji: '🤝', title: 'Transparency', description: 'Open communication' },
  { id: 'v13', emoji: '🎮', title: 'Fun Culture', description: 'Enjoy work' },
  { id: 'v14', emoji: '📚', title: 'Mentorship', description: 'Learn from experts' },
  { id: 'v15', emoji: '🏆', title: 'Recognition', description: 'Valued contributions' }
];

export default function GenZWorkplaceAssessment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { calculateFinalResults, isCalculating } = useGenZScoring();
  
  // Assessment state
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome');
  const [sessionId] = useState(() => crypto.randomUUID());
  const [startTime] = useState(Date.now());
  
  // User data
  const [userData, setUserData] = useState({
    username: '',
    birthYear: undefined as number | undefined,
    avatarEmoji: '😎'
  });
  
  // Scenarios data
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [responses, setResponses] = useState<Array<{
    scenarioId: string;
    response: string;
    responseTime: number;
    swipeData?: any;
  }>>([]);
  
  // Values selection
  const [selectedValues, setSelectedValues] = useState<Array<{
    valueId: string;
    rank: number;
  }>>([]);
  
  // Results
  const [results, setResults] = useState<any>(null);
  
  // Load scenarios from database
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('genz_assessment_scenarios')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      
      // Shuffle scenarios for variety
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setScenarios(shuffled);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      toast({
        title: "Error",
        description: "Failed to load assessment scenarios",
        variant: "destructive"
      });
    }
  };

  const handleStartAssessment = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = (username: string, birthYear: number, avatar: string) => {
    setUserData({ username, birthYear, avatarEmoji: avatar });
    setCurrentStep('scenarios');
  };

  const handleScenarioResponse = useCallback((response: 'love' | 'good' | 'meh' | 'nope' | 'toxic') => {
    const responseTime = Date.now() - (responses.length === 0 ? startTime : Date.now() - 3000);
    const currentScenario = scenarios[currentScenarioIndex];
    
    if (!currentScenario) return;

    const newResponse = {
      scenarioId: currentScenario.id,
      response,
      responseTime,
      swipeData: null // Could track swipe gestures in future
    };

    setResponses(prev => [...prev, newResponse]);

    // Move to next scenario or values step
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setCurrentStep('values');
    }
  }, [currentScenarioIndex, scenarios, responses.length, startTime]);

  const handleValuesComplete = (values: Array<{ valueId: string; rank: number }>) => {
    setSelectedValues(values);
    setCurrentStep('collaboration');
  };

  const handleCollaborationComplete = async () => {
    // For simplicity, skip detailed collaboration scenario
    await generateResults();
  };

  const generateResults = async () => {
    try {
      const scoringData: GenZScoringData = {
        sessionId,
        responses,
        valuesSelection: selectedValues,
        userData,
        startTime
      };

      const finalResults = await calculateFinalResults(scoringData, scenarios);
      
      // Save to database
      await saveResults(finalResults);
      
      setResults(finalResults);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error generating results:', error);
      toast({
        title: "Error",
        description: "Failed to generate assessment results",
        variant: "destructive"
      });
    }
  };

  const saveResults = async (results: any) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Save main results
      await supabase.from('genz_assessment_results').insert({
        user_id: user.user.id,
        session_id: sessionId,
        username: userData.username,
        birth_year: userData.birthYear,
        avatar_emoji: userData.avatarEmoji,
        workplace_profile: results.workplaceProfile,
        dimensions: results.dimensions,
        traits: results.traits,
        workplace_preferences: results.workplacePreferences,
        red_flags: results.redFlags,
        company_matches: results.companyMatches,
        employer_insights: results.employerInsights,
        validity_metrics: results.validityMetrics
      });

      // Save individual responses
      for (const response of responses) {
        await supabase.from('genz_assessment_responses').insert({
          user_id: user.user.id,
          session_id: sessionId,
          scenario_id: response.scenarioId,
          response_type: response.response,
          response_time: response.responseTime,
          swipe_data: response.swipeData
        });
      }

      // Save values selection
      for (const value of selectedValues) {
        await supabase.from('genz_values_responses').insert({
          user_id: user.user.id,
          session_id: sessionId,
          value_id: value.valueId,
          rank: value.rank
        });
      }

    } catch (error) {
      console.error('Error saving results:', error);
    }
  };

  const currentScenario = scenarios[currentScenarioIndex];
  const progress = scenarios.length > 0 ? ((currentScenarioIndex + 1) / scenarios.length) * 100 : 0;

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center space-x-4 text-4xl">
              <span className="animate-bounce">🚀</span>
              <span className="animate-bounce delay-100">💼</span>
              <span className="animate-bounce delay-200">✨</span>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gen Z Workplace Vibe Check
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              Find your perfect work match in 10 minutes
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">10 min</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">100% Anonymous</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Instant Results</p>
              </div>
            </div>
            
            <Button 
              onClick={handleStartAssessment}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Let's Go! 🎯
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              TikTok-style interface • Emoji reactions • Company matching
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (currentStep === 'scenarios') {
    return (
      <div className="min-h-screen bg-background">
        <ScenarioFeed 
          scenario={currentScenario}
          progress={progress}
          scenarioIndex={currentScenarioIndex}
          totalScenarios={scenarios.length}
          onResponse={handleScenarioResponse}
        />
      </div>
    );
  }

  if (currentStep === 'values') {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <ValuesSelection 
          values={VALUES_CARDS}
          onComplete={handleValuesComplete}
        />
      </div>
    );
  }

  if (currentStep === 'collaboration') {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quick collaboration check 👥</CardTitle>
            <p className="text-muted-foreground">How would you handle team situations?</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleCollaborationComplete}
              className="w-full"
              disabled={isCalculating}
            >
              {isCalculating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Continue to Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <ResultsDisplay results={results} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

// Component stubs - these would be separate files in a real implementation
function OnboardingFlow({ onComplete }: { onComplete: (username: string, birthYear: number, avatar: string) => void }) {
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState<number>(2000);
  const [selectedAvatar, setSelectedAvatar] = useState('😎');

  const avatars = ['😎', '🤓', '🎨', '💪', '🚀', '⚡', '🌟', '🔥'];

  return (
    <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Set up your profile 📱</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">{selectedAvatar}</div>
          <div className="grid grid-cols-4 gap-2">
            {avatars.map(emoji => (
              <button
                key={emoji}
                onClick={() => setSelectedAvatar(emoji)}
                className={`text-2xl p-2 rounded-lg transition-colors ${
                  selectedAvatar === emoji ? 'bg-primary/20' : 'hover:bg-primary/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-background border border-input"
            maxLength={20}
          />
          
          <input
            type="number"
            placeholder="Birth Year"
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            min={1997}
            max={2012}
            className="w-full p-3 rounded-lg bg-background border border-input"
          />
        </div>
        
        <Button 
          onClick={() => onComplete(username, birthYear, selectedAvatar)}
          disabled={!username || !birthYear}
          className="w-full"
        >
          I'm Ready! 🎯
        </Button>
      </CardContent>
    </Card>
  );
}

function ScenarioFeed({ 
  scenario, 
  progress, 
  scenarioIndex, 
  totalScenarios, 
  onResponse 
}: { 
  scenario: Scenario;
  progress: number;
  scenarioIndex: number;
  totalScenarios: number;
  onResponse: (response: 'love' | 'good' | 'meh' | 'nope' | 'toxic') => void;
}) {
  if (!scenario) return null;

  const reactions = [
    { key: 'love' as const, emoji: '❤️', label: 'Love it' },
    { key: 'good' as const, emoji: '👍', label: 'Good' },
    { key: 'meh' as const, emoji: '😐', label: 'Meh' },
    { key: 'nope' as const, emoji: '👎', label: 'Nope' },
    { key: 'toxic' as const, emoji: '🚩', label: 'Red flag' }
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">
            {scenarioIndex + 1}/{totalScenarios}
          </div>
          <div className="text-sm font-medium">
            {scenario.category.replace('_', ' ')}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Scenario */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-6">
            {scenario.emoji && (
              <div className="text-6xl">{scenario.emoji}</div>
            )}
            
            <div className="space-y-4">
              <p className="text-xl leading-relaxed">{scenario.text}</p>
              {scenario.context && (
                <p className="text-sm text-muted-foreground italic">
                  {scenario.context}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-3 mt-8">
              {reactions.map(reaction => (
                <Button
                  key={reaction.key}
                  variant="outline"
                  onClick={() => onResponse(reaction.key)}
                  className="h-20 flex flex-col space-y-2 hover:scale-105 transition-transform"
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                  <span className="text-xs">{reaction.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ValuesSelection({ 
  values, 
  onComplete 
}: { 
  values: ValueCard[];
  onComplete: (selection: Array<{ valueId: string; rank: number }>) => void;
}) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleValue = (valueId: string) => {
    setSelectedValues(prev => 
      prev.includes(valueId) 
        ? prev.filter(id => id !== valueId)
        : prev.length < 5 
          ? [...prev, valueId]
          : prev
    );
  };

  const handleComplete = () => {
    const selection = selectedValues.map((valueId, index) => ({
      valueId,
      rank: index + 1
    }));
    onComplete(selection);
  };

  return (
    <Card className="w-full max-w-4xl bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">What matters most? Pick your top 5 ✨</CardTitle>
        <p className="text-muted-foreground">
          Selected: {selectedValues.length}/5
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {values.map(value => (
            <button
              key={value.id}
              onClick={() => toggleValue(value.id)}
              disabled={!selectedValues.includes(value.id) && selectedValues.length >= 5}
              className={`p-4 rounded-lg border-2 transition-all text-center space-y-2 ${
                selectedValues.includes(value.id)
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-input hover:border-primary/50 hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl">{value.emoji}</div>
              <div className="text-sm font-medium">{value.title}</div>
              <div className="text-xs text-muted-foreground">{value.description}</div>
              {selectedValues.includes(value.id) && (
                <div className="text-xs font-bold text-primary">
                  #{selectedValues.indexOf(value.id) + 1}
                </div>
              )}
            </button>
          ))}
        </div>
        
        <Button 
          onClick={handleComplete}
          disabled={selectedValues.length !== 5}
          className="w-full"
        >
          Continue with my top 5 →
        </Button>
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({ results }: { results: any }) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">You're done! 🎉</h1>
          <p className="text-xl text-white/80">Here's your workplace profile</p>
        </div>
        
        {/* Profile Card */}
        <Card className="bg-gradient-subtle backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-6xl">{results.workplaceProfile.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold">@{results.userData.username}</h2>
                <p className="text-xl text-muted-foreground">{results.workplaceProfile.name}</p>
              </div>
            </div>
            <p className="text-lg mb-6">{results.workplaceProfile.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Your Strengths:</h3>
                <ul className="space-y-1">
                  {results.workplaceProfile.strengths.map((strength: string, index: number) => (
                    <li key={index} className="text-sm">• {strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">You Prefer:</h3>
                <ul className="space-y-1">
                  {results.workplaceProfile.preferences.map((pref: string, index: number) => (
                    <li key={index} className="text-sm">• {pref}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Company Matches */}
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your workplace matches 🏢</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.companyMatches.map((match: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div>
                  <h3 className="font-semibold">{match.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {match.tags.join(' • ')}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {match.score}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex space-x-4 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
          <Button onClick={() => window.location.reload()}>
            Take Again
          </Button>
        </div>
      </div>
    </div>
  );
}