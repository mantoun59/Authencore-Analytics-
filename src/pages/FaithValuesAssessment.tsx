import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AssessmentLogo from '@/components/AssessmentLogo';
import ApplicantDataForm from '@/components/ApplicantDataForm';
import { shuffledFaithValuesQuestions } from '@/data/shuffledFaithValuesQuestions';
import { useFaithValuesScoring } from '@/hooks/useFaithValuesScoring';
import { ChevronLeft, ChevronRight, GripVertical, Download, RotateCcw } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AssessmentResults from '@/components/AssessmentResults';

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  education: string;
  experience: string;
  currentPosition: string;
  company: string;
  assessmentType: string;
  additionalInfo: string;
}

interface ReflectionData {
  valuesStory: string;
  ethicalWorkplace: string;
  specificNeeds: string;
}

const FaithValuesAssessment = () => {
  const [currentStep, setCurrentStep] = useState<'info' | 'values' | 'scenarios' | 'reflection' | 'results'>('info');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [rankedValues, setRankedValues] = useState<string[]>([]);
  const [availableValues, setAvailableValues] = useState([
    { id: "achievement", name: "Achievement", description: "Accomplishment and success", icon: "🏆" },
    { id: "justice", name: "Justice", description: "Fairness and moral rightness", icon: "⚖️" },
    { id: "compassion", name: "Compassion", description: "Caring for others' wellbeing", icon: "❤️" },
    { id: "wisdom", name: "Wisdom", description: "Deep understanding and insight", icon: "🧠" },
    { id: "integrity", name: "Integrity", description: "Honesty and moral principles", icon: "🛡️" },
    { id: "service", name: "Service", description: "Helping and serving others", icon: "🤝" },
    { id: "gratitude", name: "Gratitude", description: "Thankfulness and appreciation", icon: "🙏" },
    { id: "perseverance", name: "Perseverance", description: "Persistence through challenges", icon: "💪" }
  ]);
  const [responses, setResponses] = useState<Array<{ scenarioId: string; selectedOption: number; responseTime: number }>>([]);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [reflectionData, setReflectionData] = useState<ReflectionData>({
    valuesStory: '',
    ethicalWorkplace: '',
    specificNeeds: ''
  });
  const [scenarioStartTime, setScenarioStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const { result, isCalculating, calculateScores, reset } = useFaithValuesScoring();

  const questions = shuffledFaithValuesQuestions;
  const progress = ((currentScenario + 1) / questions.length) * 100;
  const currentScenarioData = questions[currentScenario];

  useEffect(() => {
    if (currentScenarioData) {
      setScenarioStartTime(Date.now());
      setCurrentResponse('');
    }
  }, [currentScenario, currentScenarioData]);

  const handleUserDataSubmit = (data: UserData) => {
    setUserData(data);
    setCurrentStep('values');
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (result.source.droppableId === 'available' && result.destination.droppableId === 'ranked') {
      // Moving from available to ranked
      if (rankedValues.length >= 8) {
        toast({
          title: "Maximum reached",
          description: "You can only rank 8 values. Please remove one first.",
          variant: "destructive"
        });
        return;
      }
      
      const value = availableValues[sourceIndex];
      const newAvailable = [...availableValues];
      newAvailable.splice(sourceIndex, 1);
      
      const newRanked = [...rankedValues];
      newRanked.splice(destIndex, 0, value.id);
      
      setAvailableValues(newAvailable);
      setRankedValues(newRanked);
    } else if (result.source.droppableId === 'ranked' && result.destination.droppableId === 'available') {
      // Moving from ranked to available
      const valueId = rankedValues[sourceIndex];
      const value = availableValues.find(v => v.id === valueId);
      
      if (value) {
        const newRanked = [...rankedValues];
        newRanked.splice(sourceIndex, 1);
        
        const newAvailable = [...availableValues];
        newAvailable.splice(destIndex, 0, value);
        
        setRankedValues(newRanked);
        setAvailableValues(newAvailable);
      }
    } else if (result.source.droppableId === 'ranked' && result.destination.droppableId === 'ranked') {
      // Reordering within ranked
      const newRanked = [...rankedValues];
      const [reorderedItem] = newRanked.splice(sourceIndex, 1);
      newRanked.splice(destIndex, 0, reorderedItem);
      setRankedValues(newRanked);
    }
  };

  const handleValuesComplete = () => {
    if (rankedValues.length < 8) {
      toast({
        title: "Please rank all values",
        description: "You must rank all 8 values before continuing.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep('scenarios');
  };

  const handleResponseChange = (value: string) => {
    setCurrentResponse(value);
  };

  const handleNext = () => {
    if (!currentResponse) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }

    const responseTime = Date.now() - scenarioStartTime;
    const newResponse = {
      scenarioId: currentScenarioData.id,
      selectedOption: parseInt(currentResponse),
      responseTime
    };

    const newResponses = [...responses];
    newResponses[currentScenario] = newResponse;
    setResponses(newResponses);

    if (currentScenario < questions.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setCurrentStep('reflection');
    }
  };

  const handlePrevious = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
      const previousResponse = responses[currentScenario - 1];
      if (previousResponse) {
        setCurrentResponse(previousResponse.selectedOption.toString());
      }
    }
  };

  const handleSkip = () => {
    const responseTime = Date.now() - scenarioStartTime;
    const newResponse = {
      scenarioId: currentScenarioData.id,
      selectedOption: 0, // Default to first option for skipped
      responseTime
    };

    const newResponses = [...responses];
    newResponses[currentScenario] = newResponse;
    setResponses(newResponses);

    if (currentScenario < questions.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setCurrentStep('reflection');
    }
  };

  const handleReflectionSubmit = () => {
    calculateScores(rankedValues, responses);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('info');
    setUserData(null);
    setCurrentScenario(0);
    setRankedValues([]);
    setAvailableValues([
      { id: "achievement", name: "Achievement", description: "Accomplishment and success", icon: "🏆" },
      { id: "justice", name: "Justice", description: "Fairness and moral rightness", icon: "⚖️" },
      { id: "compassion", name: "Compassion", description: "Caring for others' wellbeing", icon: "❤️" },
      { id: "wisdom", name: "Wisdom", description: "Deep understanding and insight", icon: "🧠" },
      { id: "integrity", name: "Integrity", description: "Honesty and moral principles", icon: "🛡️" },
      { id: "service", name: "Service", description: "Helping and serving others", icon: "🤝" },
      { id: "gratitude", name: "Gratitude", description: "Thankfulness and appreciation", icon: "🙏" },
      { id: "perseverance", name: "Perseverance", description: "Persistence through challenges", icon: "💪" }
    ]);
    setResponses([]);
    setCurrentResponse('');
    setReflectionData({
      valuesStory: '',
      ethicalWorkplace: '',
      specificNeeds: ''
    });
    reset();
  };

  const getValueById = (id: string) => {
    return availableValues.find(v => v.id === id);
  };

  if (currentStep === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <AssessmentLogo 
                    assessmentType="faith-values" 
                    size="xl" 
                    fallbackText="FV"
                  />
                  <div className="text-6xl">🌟</div>
                </div>
                <CardTitle className="text-3xl font-bold text-primary mb-2">
                  Faith & Values Alignment Index (FVAI)
                </CardTitle>
                <p className="text-lg text-muted-foreground mb-4">
                  Comprehensive 90-question assessment across 42 dimensions
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                  <p className="text-center text-lg mb-4">
                    This comprehensive assessment uses validated psychological instruments to analyze how your faith-based values align with your professional life across spiritual foundations, moral values, workplace ethics, and life integration.
                  </p>
                  <p className="text-center text-muted-foreground">
                    Using multiple assessment techniques including Likert scales, ranking, scenarios, and semantic differentials.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl">⏱️</span>
                    <span className="text-sm">25-30 minutes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">📊</span>
                    <span className="text-sm">90 Questions | 42 Dimensions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">🔬</span>
                    <span className="text-sm">Validated Instruments</span>
                  </div>
                </div>
                
                <ApplicantDataForm 
                  assessmentType="faith-values"
                  assessmentTitle="Faith & Values Alignment Index (FVAI)"
                  onComplete={handleUserDataSubmit} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'values') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold mb-2">
                  What Matters Most to You?
                </CardTitle>
                <p className="text-muted-foreground">
                  Please rank these universal values from most to least important in your ideal workplace.
                </p>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Available Values</h3>
                      <Droppable droppableId="available">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {availableValues.map((value, index) => (
                              <Draggable key={value.id} draggableId={value.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-primary transition-colors cursor-move"
                                  >
                                    <div className="flex items-center gap-3">
                                      <GripVertical className="text-slate-400" size={20} />
                                      <span className="text-2xl">{value.icon}</span>
                                      <div>
                                        <h4 className="font-semibold">{value.name}</h4>
                                        <p className="text-sm text-muted-foreground">{value.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Your Priority Order</h3>
                      <Droppable droppableId="ranked">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {rankedValues.map((valueId, index) => {
                              const value = getValueById(valueId);
                              return value ? (
                                <Draggable key={valueId} draggableId={valueId} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-primary/10 border-2 border-primary rounded-lg p-4 cursor-move"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Badge variant="secondary" className="min-w-[30px]">
                                          {index + 1}
                                        </Badge>
                                        <span className="text-2xl">{value.icon}</span>
                                        <div>
                                          <h4 className="font-semibold">{value.name}</h4>
                                          <p className="text-sm text-muted-foreground">{value.description}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ) : null;
                            })}
                            {rankedValues.length === 0 && (
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-muted-foreground">
                                Drag values here to rank them
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      
                      <div className="mt-6 text-center">
                        <Button 
                          onClick={handleValuesComplete}
                          disabled={rankedValues.length < 8}
                          className="w-full"
                        >
                          Continue to Questions
                        </Button>
                      </div>
                    </div>
                  </div>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'scenarios') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline">
                    Question {currentScenario + 1} of {questions.length}
                  </Badge>
                  <Badge variant="secondary">
                    {currentScenarioData.category.replace('_', ' ')}
                  </Badge>
                </div>
                <Progress value={progress} className="mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {currentScenarioData.type === 'likert' ? 'Rate your agreement' : 
                     currentScenarioData.type === 'scenario' ? 'Choose your response' :
                     currentScenarioData.type === 'ranking' ? 'Rank in order' :
                     currentScenarioData.type === 'forced_choice' ? 'Choose one' :
                     'Select your response'}
                  </h3>
                  <p className="text-xl leading-relaxed">
                    {currentScenarioData.question}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup value={currentResponse} onValueChange={handleResponseChange}>
                      <div className="space-y-3">
                        {currentScenarioData.scale ? (
                          // Likert scale questions
                          Array.from({ length: currentScenarioData.scale.max - currentScenarioData.scale.min + 1 }, (_, i) => {
                            const value = currentScenarioData.scale.min + i;
                            const scaleLabels = [
                              currentScenarioData.scale.minLabel,
                              "Disagree",
                              "Somewhat Disagree", 
                              "Neither Agree nor Disagree",
                              "Somewhat Agree",
                              "Agree",
                              currentScenarioData.scale.maxLabel
                            ];
                            const label = scaleLabels[i] || value.toString();
                            
                            return (
                              <div key={value} className="flex items-center space-x-2">
                                <RadioGroupItem value={value.toString()} id={`option-${value}`} />
                                <Label 
                                  htmlFor={`option-${value}`} 
                                  className="cursor-pointer flex-1 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  {label}
                                </Label>
                              </div>
                            );
                          })
                        ) : currentScenarioData.options ? (
                          // Multiple choice questions  
                          currentScenarioData.options.map((option: any, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                              <Label 
                                htmlFor={`option-${index}`} 
                                className="cursor-pointer flex-1 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                {typeof option === 'string' ? option : option.text || JSON.stringify(option)}
                              </Label>
                            </div>
                          ))
                        ) : (
                          // Default options for questions without defined options
                          ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Agree', 'Strongly Agree'].map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} />
                              <Label 
                                htmlFor={`option-${index}`} 
                                className="cursor-pointer flex-1 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                {option}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                </RadioGroup>
                
                <div className="flex justify-between items-center mt-8">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentScenario === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    Skip Question
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    {currentScenario === questions.length - 1 ? 'Continue' : 'Next'}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'reflection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold mb-2">
                  Final Reflections
                </CardTitle>
                <p className="text-muted-foreground">
                  These open-ended questions help us better understand your perspective.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      Describe a time when your personal values guided an important decision at work:
                    </Label>
                    <Textarea
                      value={reflectionData.valuesStory}
                      onChange={(e) => setReflectionData({...reflectionData, valuesStory: e.target.value})}
                      placeholder="Share your experience..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      What does an ethical workplace look like to you?
                    </Label>
                    <Textarea
                      value={reflectionData.ethicalWorkplace}
                      onChange={(e) => setReflectionData({...reflectionData, ethicalWorkplace: e.target.value})}
                      placeholder="Describe your ideal..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">
                      Are there any specific practices or policies that are important for your workplace to have or avoid?
                    </Label>
                    <Textarea
                      value={reflectionData.specificNeeds}
                      onChange={(e) => setReflectionData({...reflectionData, specificNeeds: e.target.value})}
                      placeholder="Feel free to share..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <Button onClick={handleReflectionSubmit} className="w-full md:w-auto px-8">
                    Complete Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && result) {
    const transformedResult = {
      overallScore: Math.round(result.topValues.reduce((acc, val) => acc + val.score, 0) / result.topValues.length),
      dimensionScores: result.topValues.map(value => ({
        dimension: value.name,
        score: Math.round(value.score),
        level: value.score >= 80 ? 'High' : value.score >= 60 ? 'Medium' : 'Low',
        interpretation: value.description
      })),
      cultureMatches: result.cultureMatches.slice(0, 3).map(match => ({
        dimension: match.culture.name,
        suggestions: match.culture.characteristics
      })),
      insights: result.insights,
      validity: result.validity
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <AssessmentResults 
            data={transformedResult} 
            assessmentType="faith-values"
            candidateInfo={{
              name: userData?.fullName || '',
              email: userData?.email || '',
              experience: userData?.experience || '',
              position: userData?.currentPosition || ''
            }}
          />
          <div className="text-center mt-8">
            <Button onClick={handleRestart} variant="outline" className="flex items-center gap-2">
              <RotateCcw size={16} />
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          {isCalculating ? 'Calculating your values profile...' : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default FaithValuesAssessment;