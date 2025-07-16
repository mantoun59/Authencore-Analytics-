import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicantDataForm from "@/components/ApplicantDataForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { careerCards, skillsChallenges, workScenarios, rapidFireQuestions } from "@/data/assessmentQuestions";
import { useScoring } from "@/hooks/useScoring";
import { useCareerMatching } from "@/hooks/useCareerMatching";
import { generateCandidateReport, generateEmployerReport, generatePDFReport } from "@/services/reportGenerator";
import { 
  Rocket, 
  Target, 
  Lightbulb, 
  Building2, 
  Gamepad2, 
  Trophy, 
  Star, 
  Flame, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Download,
  Share2,
  Zap,
  Heart,
  X,
  Play
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  age: number;
  educationLevel: string;
  fieldOfStudy: string;
  avatar: string;
  language: string;
}

interface GameState {
  score: number;
  streak: number;
  level: number;
  achievements: Achievement[];
  powerUps: {
    hint: number;
    skip: number;
    eliminate: number;
  };
  startTime: number;
  currentLevelStartTime: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const CareerLaunch = () => {
  const [gamePhase, setGamePhase] = useState<'welcome' | 'registration' | 'assessment' | 'results'>('welcome');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    age: 18,
    educationLevel: '',
    fieldOfStudy: '',
    avatar: '👨‍💼',
    language: 'en'
  });
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    level: 1,
    achievements: [
      { id: 'first_swipe', title: 'First Steps', description: 'Made your first career swipe', icon: '🚀', unlocked: false },
      { id: 'speed_demon', title: 'Speed Demon', description: 'Completed rapid fire in under 60 seconds', icon: '⚡', unlocked: false },
      { id: 'streak_5', title: 'On Fire!', description: '5 correct answers in a row', icon: '🔥', unlocked: false },
      { id: 'perfectionist', title: 'Perfectionist', description: 'Scored 100% in a challenge', icon: '💯', unlocked: false },
      { id: 'explorer', title: 'Career Explorer', description: 'Explored all career categories', icon: '🧭', unlocked: false }
    ],
    powerUps: { hint: 3, skip: 2, eliminate: 2 },
    startTime: 0,
    currentLevelStartTime: 0
  });

  const [assessmentData, setAssessmentData] = useState({
    applicantData: null,
    careerSwipes: [],
    skillsChallenges: [],
    workScenarios: [],
    futureQuest: [],
    rapidFire: []
  });

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [employerModalOpen, setEmployerModalOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  // Career cards data
  const careerCards = [
    { id: 'ci_001', title: 'Data Scientist', description: 'Uncover insights from complex data to drive business decisions', tags: ['Analytics', 'Tech', 'Problem-Solving'], category: 'stem' },
    { id: 'ci_002', title: 'UX Designer', description: 'Create intuitive and beautiful user experiences', tags: ['Creative', 'Tech', 'User-Focused'], category: 'creative_tech' },
    { id: 'ci_003', title: 'Sustainability Consultant', description: 'Help organizations reduce their environmental impact', tags: ['Environment', 'Strategy', 'Impact'], category: 'social_impact' },
    { id: 'ci_004', title: 'Digital Marketing Specialist', description: 'Build brand presence across digital channels', tags: ['Creative', 'Analytics', 'Communication'], category: 'business' },
    { id: 'ci_005', title: 'Healthcare Technology Specialist', description: 'Bridge the gap between healthcare and technology', tags: ['Healthcare', 'Tech', 'Innovation'], category: 'healthcare_tech' },
    { id: 'ci_006', title: 'Product Manager', description: 'Guide products from conception to launch', tags: ['Strategy', 'Leadership', 'Innovation'], category: 'business' },
    { id: 'ci_007', title: 'AI Research Scientist', description: 'Develop cutting-edge artificial intelligence systems', tags: ['Research', 'Tech', 'Innovation'], category: 'stem' },
    { id: 'ci_008', title: 'Social Media Manager', description: 'Build communities and engagement online', tags: ['Creative', 'Communication', 'Marketing'], category: 'business' }
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Skills challenges data
  const skillsChallenges = [
    {
      id: 'sc_001',
      type: 'problem_solving',
      title: 'The Budget Puzzle',
      description: 'You have $10,000 to allocate across 5 departments. Each has different ROI rates.',
      timeLimit: 120,
      departments: [
        { name: 'Marketing', roi: 30, allocation: 0 },
        { name: 'Technology', roi: 40, allocation: 0 },
        { name: 'HR', roi: 10, allocation: 0 },
        { name: 'Operations', roi: 15, allocation: 0 },
        { name: 'R&D', roi: 5, allocation: 0 }
      ]
    },
    {
      id: 'sc_002',
      type: 'creative_thinking',
      title: 'Innovation Sprint',
      description: 'Generate as many uses as possible for a paperclip in 60 seconds',
      timeLimit: 60,
      ideas: []
    }
  ];

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [challengeInput, setChallengeInput] = useState('');
  const [budgetAllocations, setBudgetAllocations] = useState<Record<string, number>>({});

  // Work scenarios data
  const workScenarios = [
    {
      id: 'ws_001',
      title: 'The Deadline Dilemma',
      setup: 'Your team lead assigns you a project due in 2 days, but you already have 3 other deadlines this week.',
      options: [
        { id: 'A', text: 'Accept it without question to show you\'re a team player', scores: { adaptability: 2, communication: 0, self_management: -1 } },
        { id: 'B', text: 'Discuss your current workload and negotiate priorities', scores: { adaptability: 3, communication: 4, self_management: 4 } },
        { id: 'C', text: 'Delegate your other work to focus on this new project', scores: { adaptability: 2, communication: 1, self_management: 2 } },
        { id: 'D', text: 'Work overtime to complete everything', scores: { adaptability: 1, communication: 0, self_management: 1 } }
      ]
    },
    {
      id: 'ws_002',
      title: 'The Team Conflict',
      setup: 'Two team members are in a heated disagreement during a meeting, making everyone uncomfortable.',
      options: [
        { id: 'A', text: 'Stay quiet and let them work it out', scores: { leadership: 0, communication: 0, emotional_intelligence: 1 } },
        { id: 'B', text: 'Suggest taking a 5-minute break to cool down', scores: { leadership: 3, communication: 3, emotional_intelligence: 4 } },
        { id: 'C', text: 'Take a side to help resolve it faster', scores: { leadership: 1, communication: 1, emotional_intelligence: 0 } },
        { id: 'D', text: 'Redirect focus to the meeting agenda', scores: { leadership: 3, communication: 3, emotional_intelligence: 3 } }
      ]
    }
  ];

  const [currentScenario, setCurrentScenario] = useState(0);

  // Rapid fire questions
  const rapidFireQuestions = [
    { id: 'rf_001', question: 'Work alone or in teams?', optionA: 'Alone - I focus better', optionB: 'Teams - I love collaboration' },
    { id: 'rf_002', question: 'Detailed plan or figure it out as you go?', optionA: 'Detailed plan always', optionB: 'Adapt as I go' },
    { id: 'rf_003', question: 'Lead the project or support the leader?', optionA: 'Lead the way', optionB: 'Support role' },
    { id: 'rf_004', question: 'Morning person or night owl?', optionA: 'Early bird gets the worm', optionB: 'Night owl productivity' },
    { id: 'rf_005', question: 'Big picture or details?', optionA: 'See the forest', optionB: 'Focus on trees' },
    { id: 'rf_006', question: 'Take risks or play it safe?', optionA: 'Fortune favors the bold', optionB: 'Better safe than sorry' },
    { id: 'rf_007', question: 'Feedback directly or diplomatically?', optionA: 'Straight to the point', optionB: 'Gentle and tactful' },
    { id: 'rf_008', question: 'Structured routine or flexible schedule?', optionA: 'Love my routine', optionB: 'Go with the flow' },
    { id: 'rf_009', question: 'Compete or collaborate?', optionA: 'Healthy competition drives me', optionB: 'Together we achieve more' },
    { id: 'rf_010', question: 'Innovation or improvement?', optionA: 'Create something new', optionB: 'Perfect what exists' }
  ];

  const [rapidFireIndex, setRapidFireIndex] = useState(0);
  const [rapidFireStartTime, setRapidFireStartTime] = useState(0);
  const [comboCount, setComboCount] = useState(0);

  // Future quest milestones
  const futureQuestMilestones = [
    { id: 'fm_001', title: 'Complete Internship', category: 'experience', year: 1 },
    { id: 'fm_002', title: 'Graduate with Degree', category: 'education', year: 2 },
    { id: 'fm_003', title: 'Land First Job', category: 'career', year: 2 },
    { id: 'fm_004', title: 'Get Professional Certification', category: 'skills', year: 3 },
    { id: 'fm_005', title: 'Lead a Team', category: 'leadership', year: 4 },
    { id: 'fm_006', title: 'Start Own Business', category: 'entrepreneurship', year: 5 },
    { id: 'fm_007', title: 'Mentor Others', category: 'giving_back', year: 6 },
    { id: 'fm_008', title: 'Become Industry Expert', category: 'expertise', year: 8 },
    { id: 'fm_009', title: 'Write a Book', category: 'thought_leadership', year: 10 },
    { id: 'fm_010', title: 'Retire Early', category: 'financial_freedom', year: 15 }
  ];

  const [timelineSlots, setTimelineSlots] = useState<Record<number, any>>({});
  const [draggedMilestone, setDraggedMilestone] = useState<any>(null);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, milestone: any) => {
    setDraggedMilestone(milestone);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, year: number) => {
    e.preventDefault();
    if (draggedMilestone) {
      const milestoneIcon = {
        'education': '🎓',
        'career': '💼',
        'skills': '📚',
        'leadership': '👑',
        'entrepreneurship': '🚀',
        'giving_back': '🤝',
        'expertise': '🏆',
        'thought_leadership': '📖',
        'financial_freedom': '💰',
        'experience': '🎯'
      }[draggedMilestone.category] || '🎯';

      setTimelineSlots(prev => ({
        ...prev,
        [year]: {
          ...draggedMilestone,
          icon: milestoneIcon
        }
      }));
      
      setAssessmentData(prev => ({
        ...prev,
        futureQuest: [...prev.futureQuest, {
          milestoneId: draggedMilestone.id,
          year: year,
          timestamp: Date.now()
        }]
      }));

      updateScore(25);
      setDraggedMilestone(null);
    }
  };

  useEffect(() => {
    if (gamePhase === 'assessment' && gameState.startTime === 0) {
      setGameState(prev => ({ ...prev, startTime: Date.now(), currentLevelStartTime: Date.now() }));
      startTimer();
    }
  }, [gamePhase]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateScore = (points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  };

  const updateStreak = (correct: boolean) => {
    setGameState(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      
      // Check for streak achievements
      if (newStreak >= 5 && !prev.achievements.find(a => a.id === 'streak_5')?.unlocked) {
        unlockAchievement('streak_5');
      }

      return { ...prev, streak: newStreak };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setGameState(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => 
        a.id === achievementId ? { ...a, unlocked: true } : a
      )
    }));

    const achievement = gameState.achievements.find(a => a.id === achievementId);
    if (achievement) {
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const usePowerUp = (type: 'hint' | 'skip' | 'eliminate') => {
    if (gameState.powerUps[type] > 0) {
      setGameState(prev => ({
        ...prev,
        powerUps: {
          ...prev.powerUps,
          [type]: prev.powerUps[type] - 1
        }
      }));
      return true;
    }
    return false;
  };

  const handleApplicantDataComplete = (data: any) => {
    // Update user profile with the applicant data
    setUserProfile(prev => ({
      ...prev,
      name: data.fullName,
      email: data.email,
      // Map other fields as needed
    }));
    
    // Store applicant data for later use
    setAssessmentData(prev => ({
      ...prev,
      applicantData: data
    }));
    
    setGamePhase('assessment');
  };

  const handleCareerSwipe = (direction: 'left' | 'right') => {
    const currentCard = careerCards[currentCardIndex];
    
    // Track swipe
    setAssessmentData(prev => ({
      ...prev,
      careerSwipes: [...prev.careerSwipes, {
        cardId: currentCard.id,
        action: direction === 'right' ? 'like' : 'dislike',
        category: currentCard.category,
        timestamp: Date.now()
      }]
    }));

    // Unlock first swipe achievement
    if (assessmentData.careerSwipes.length === 0) {
      unlockAchievement('first_swipe');
    }

    updateScore(direction === 'right' ? 10 : 5);

    // Show swipe animation
    setSwipeDirection(direction);
    setTimeout(() => {
      setSwipeDirection(null);
      if (currentCardIndex < careerCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        nextLevel();
      }
    }, 300);
  };

  const nextLevel = () => {
    if (currentLevel < 5) {
      setCurrentLevel(prev => prev + 1);
      setGameState(prev => ({ 
        ...prev, 
        level: prev.level + 1,
        currentLevelStartTime: Date.now()
      }));
      updateScore(100); // Level completion bonus
    } else {
      // Assessment complete
      setGamePhase('results');
      stopTimer();
      calculateFinalScore();
    }
  };

  const calculateFinalScore = () => {
    // Implementation of scoring algorithm
    const baseScore = gameState.score;
    const timeBonus = Math.max(0, 1800 - timer) * 0.1; // Bonus for completing under 30 minutes
    const achievementBonus = gameState.achievements.filter(a => a.unlocked).length * 50;
    
    const finalScore = Math.round(baseScore + timeBonus + achievementBonus);
    
    setGameState(prev => ({ ...prev, score: finalScore }));
  };

  const downloadReport = () => {
    // Create a simple report with user data
    const reportData = {
      name: userProfile.name,
      email: userProfile.email,
      score: gameState.score,
      completionTime: formatTime(timer),
      achievements: gameState.achievements.filter(a => a.unlocked).length,
      careerInterests: assessmentData.careerSwipes.filter(s => s.action === 'like').length
    };

    // Create downloadable text report
    const reportText = `
CAREER LAUNCH ASSESSMENT REPORT
===============================

Student: ${reportData.name}
Email: ${reportData.email}
Assessment Date: ${new Date().toLocaleDateString()}

OVERALL PERFORMANCE
-------------------
Total Score: ${reportData.score} points
Completion Time: ${reportData.completionTime}
Achievements Unlocked: ${reportData.achievements}/5

CAREER INTERESTS
----------------
Liked Careers: ${reportData.careerInterests}/${careerCards.length}

PERFORMANCE SUMMARY
-------------------
This assessment evaluated career readiness across multiple dimensions including
career clarity, workplace skills, adaptability, and future planning.

For detailed analysis and recommendations, contact your career counselor.
    `;

    // Create and download the file
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerLaunch_Report_${userProfile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My CareerLaunch Assessment Results',
        text: `I just completed my CareerLaunch Assessment and scored ${gameState.score} points! 🚀`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I just completed my CareerLaunch Assessment and scored ${gameState.score} points! 🚀 #CareerLaunch`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard! You can now paste and share them.');
      }).catch(() => {
        alert('Share functionality not available in this browser.');
      });
    }
  };

  const handleSkillsChallenge = () => {
    const challenge = skillsChallenges[currentChallenge];
    
    if (challenge.type === 'creative_thinking') {
      // Process creative thinking challenge
      const ideas = challengeInput.split('\n').filter(idea => idea.trim());
      const score = Math.min(ideas.length * 10, 100);
      updateScore(score);
      
      if (score === 100) {
        unlockAchievement('perfectionist');
      }
    }

    if (currentChallenge < skillsChallenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setChallengeInput('');
    } else {
      nextLevel();
    }
  };

  const handleWorkScenario = (optionId: string) => {
    const scenario = workScenarios[currentScenario];
    const option = scenario.options.find(opt => opt.id === optionId);
    
    if (option) {
      // Calculate score based on option values
      const optionScore = Object.values(option.scores).reduce((sum, val) => sum + val, 0);
      updateScore(Math.max(optionScore * 10, 10));
      updateStreak(optionScore > 0);
      
      setAssessmentData(prev => ({
        ...prev,
        workScenarios: [...prev.workScenarios, {
          scenarioId: scenario.id,
          userChoice: optionId,
          timestamp: Date.now()
        }]
      }));
    }

    if (currentScenario < workScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      nextLevel();
    }
  };

  const handleRapidFire = (choice: 'A' | 'B') => {
    if (rapidFireIndex === 0) {
      setRapidFireStartTime(Date.now());
    }

    setAssessmentData(prev => ({
      ...prev,
      rapidFire: [...prev.rapidFire, {
        questionId: rapidFireQuestions[rapidFireIndex].id,
        choice,
        responseTime: Date.now() - rapidFireStartTime,
        timestamp: Date.now()
      }]
    }));

    updateScore(20);
    setComboCount(prev => prev + 1);

    if (rapidFireIndex < rapidFireQuestions.length - 1) {
      setRapidFireIndex(prev => prev + 1);
    } else {
      // Check speed achievement
      const totalTime = Date.now() - rapidFireStartTime;
      if (totalTime < 60000) { // Under 60 seconds
        unlockAchievement('speed_demon');
      }
      nextLevel();
    }
  };

  const renderWelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* CareerLaunch Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/2eb92237-a884-4a9f-a975-0c399195cf27.png" 
            alt="CareerLaunch - Helping Students Navigate Their Future" 
            className="mx-auto h-32 w-auto mb-6"
          />
        </div>
        
        <div className="text-8xl mb-8 animate-bounce">🚀</div>
        <h1 className="text-6xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          CareerLaunch Assessment
        </h1>
        <p className="text-2xl text-teal-700 mb-12">Discover Your Career Superpowers!</p>
        
        <div className="mb-12">
          <h3 className="text-xl text-slate-700 mb-8">Your Journey Includes:</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Target, label: 'Career Interests', color: 'text-red-500' },
              { icon: Lightbulb, label: 'Skills Challenge', color: 'text-amber-500' },
              { icon: Building2, label: 'Work Scenarios', color: 'text-blue-500' },
              { icon: Gamepad2, label: 'Future Quest', color: 'text-green-500' },
              { icon: Trophy, label: 'Career Match', color: 'text-purple-500' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform shadow-lg">
                <item.icon className={`h-12 w-12 ${item.color} mb-2`} />
                <span className="text-slate-700 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => setGamePhase('registration')}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
        >
          Start Your Journey <Rocket className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );

  const renderRegistrationScreen = () => (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-16">
        <ApplicantDataForm
          assessmentType="career-launch"
          assessmentTitle="CareerLaunch Assessment"
          onComplete={handleApplicantDataComplete}
        />
      </div>
      <Footer />
    </div>
  );

  const renderGameHUD = () => (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-cyan-500/30 p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-cyan-400">
            <span className="text-lg font-bold">Level {gameState.level}</span>
            <Progress value={(currentLevel / 5) * 100} className="w-32 mt-1 h-2" />
          </div>
          
          <div className="flex items-center gap-2 text-yellow-400">
            <Star className="h-5 w-5" />
            <span className="text-xl font-bold">{gameState.score}</span>
          </div>
          
          <div className="flex items-center gap-2 text-orange-400">
            <Flame className="h-5 w-5" />
            <span className="text-xl font-bold">{gameState.streak}</span>
          </div>
          
          <div className="flex items-center gap-2 text-blue-400">
            <Clock className="h-5 w-5" />
            <span className="text-lg">{formatTime(timer)}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
          {Object.entries(gameState.powerUps).map(([type, count]) => (
            <button
              key={type}
              onClick={() => usePowerUp(type as any)}
              disabled={count === 0}
              className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                count > 0 
                  ? 'border-cyan-400 bg-cyan-400/20 hover:bg-cyan-400/30' 
                  : 'border-gray-600 bg-gray-600/20 cursor-not-allowed'
              }`}
            >
              {type === 'hint' && <Lightbulb className="h-6 w-6 text-cyan-400 mx-auto" />}
              {type === 'skip' && <Play className="h-6 w-6 text-cyan-400 mx-auto" />}
              {type === 'eliminate' && <X className="h-6 w-6 text-cyan-400 mx-auto" />}
              <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLevel1 = () => {
    if (currentCardIndex >= careerCards.length) return null;
    
    const currentCard = careerCards[currentCardIndex];
    
    return (
      <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Career Interest Swiper</h2>
          <p className="text-cyan-300 text-xl mb-8">Swipe right if interested, left if not!</p>
          
          <div className="relative h-96 flex items-center justify-center">
            <Card 
              className={`w-80 h-80 bg-gradient-to-br from-cyan-500 to-purple-600 border-0 transform transition-all duration-300 ${
                swipeDirection === 'left' ? '-translate-x-40 -rotate-12 opacity-50' :
                swipeDirection === 'right' ? 'translate-x-40 rotate-12 opacity-50' : ''
              }`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">{currentCard.title}</CardTitle>
                <CardDescription className="text-cyan-100">{currentCard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentCard.tags.map((tag, index) => (
                    <Badge key={index} className="bg-white/20 text-white border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {swipeDirection && (
              <div className={`absolute text-6xl ${swipeDirection === 'left' ? 'left-8 text-red-400' : 'right-8 text-green-400'}`}>
                {swipeDirection === 'left' ? '❌' : '💚'}
              </div>
            )}
          </div>
          
          <div className="flex gap-8 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => handleCareerSwipe('left')}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 p-0"
            >
              <ThumbsDown className="h-8 w-8" />
            </Button>
            <Button
              size="lg"
              onClick={() => handleCareerSwipe('right')}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 p-0"
            >
              <ThumbsUp className="h-8 w-8" />
            </Button>
          </div>
          
          <div className="mt-8 text-cyan-300">
            Card {currentCardIndex + 1} of {careerCards.length}
          </div>
        </div>
      </div>
    );
  };

  const renderLevel2 = () => {
    const challenge = skillsChallenges[currentChallenge];
    
    return (
      <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Skills Challenge Arena</h2>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{challenge.title}</CardTitle>
              <CardDescription className="text-cyan-200">{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {challenge.type === 'creative_thinking' ? (
                <div>
                  <textarea
                    placeholder="Enter each idea on a new line..."
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    className="w-full h-40 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-cyan-300">
                      Ideas: {challengeInput.split('\n').filter(idea => idea.trim()).length}
                    </span>
                    <Button onClick={handleSkillsChallenge} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                      Submit Ideas
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white mb-4">Allocate your $10,000 budget:</p>
                  {challenge.departments?.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
                      <span className="text-white">{dept.name} (ROI: {dept.roi}%)</span>
                      <Input
                        type="number"
                        placeholder="$0"
                        className="w-32 bg-white/10 border-white/20 text-white"
                        value={budgetAllocations[dept.name] || ''}
                        onChange={(e) => setBudgetAllocations(prev => ({
                          ...prev,
                          [dept.name]: parseInt(e.target.value) || 0
                        }))}
                      />
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-cyan-300">
                      Total: ${Object.values(budgetAllocations).reduce((sum, val) => sum + val, 0).toLocaleString()}
                    </span>
                    <Button onClick={handleSkillsChallenge} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                      Submit Allocation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderLevel3 = () => {
    const scenario = workScenarios[currentScenario];
    
    return (
      <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">Real World Scenarios</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <div className="w-80 h-60 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-6xl animate-pulse">
                🎬
              </div>
            </div>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{scenario.title}</CardTitle>
                <CardDescription className="text-cyan-200">{scenario.setup}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scenario.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleWorkScenario(option.id)}
                      className="w-full p-4 text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all hover:translate-x-2"
                    >
                      <span className="text-cyan-400 font-bold mr-3">{option.id}.</span>
                      <span className="text-white">{option.text}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderLevel4 = () => (
    <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-8">Future Quest: Build Your Career Path</h2>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center text-white text-xl font-bold">
              <span>Today</span>
              <span>Year 1</span>
              <span>Year 3</span>
              <span>Year 5</span>
              <span>Year 10</span>
              <span>Dream Goal</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-6 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 -translate-y-1/2 z-0"></div>
              
              {[1, 3, 5, 10].map((year) => (
                <div
                  key={year}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, year)}
                  className="relative z-10 min-h-40 border-2 border-dashed border-cyan-400 rounded-lg p-4 bg-white/5 flex flex-col items-center justify-center hover:border-cyan-300 hover:bg-white/10 transition-all"
                >
                  <span className="text-cyan-400 font-bold mb-2">Year {year}</span>
                  {timelineSlots[year] && (
                    <div className="text-center">
                      <div className="text-2xl mb-2">{timelineSlots[year].icon}</div>
                      <span className="text-white text-sm">{timelineSlots[year].title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-xl mb-4">Drag milestones to build your path:</h4>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {futureQuestMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, milestone)}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg p-3 text-white text-center cursor-grab hover:scale-105 transition-transform active:cursor-grabbing"
                >
                  <div className="text-2xl mb-2">
                    {milestone.category === 'education' && '🎓'}
                    {milestone.category === 'career' && '💼'}
                    {milestone.category === 'skills' && '📚'}
                    {milestone.category === 'leadership' && '👑'}
                    {milestone.category === 'entrepreneurship' && '🚀'}
                    {milestone.category === 'giving_back' && '🤝'}
                    {milestone.category === 'expertise' && '🏆'}
                    {milestone.category === 'thought_leadership' && '📖'}
                    {milestone.category === 'financial_freedom' && '💰'}
                    {milestone.category === 'experience' && '🎯'}
                  </div>
                  <span className="text-sm">{milestone.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button onClick={nextLevel} className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3">
              Continue Journey
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderLevel5 = () => {
    const question = rapidFireQuestions[rapidFireIndex];
    
    return (
      <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Rapid Fire Round!</h2>
          <p className="text-cyan-300 text-xl mb-8">Quick decisions reveal your true preferences</p>
          
          <div className="mb-6">
            <Progress value={(rapidFireIndex / rapidFireQuestions.length) * 100} className="h-3" />
            <span className="text-cyan-300 mt-2 block">{rapidFireIndex + 1}/{rapidFireQuestions.length}</span>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleRapidFire('A')}
                  className="h-20 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg"
                >
                  {question.optionA}
                </Button>
                <Button
                  onClick={() => handleRapidFire('B')}
                  className="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg"
                >
                  {question.optionB}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-orange-400 text-2xl font-bold">
            Combo: {comboCount}x 🔥
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="pt-32 pb-16 px-4 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-8 animate-bounce">🎉</div>
        <h1 className="text-5xl font-bold text-white mb-6">Assessment Complete!</h1>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Your Career Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(gameState.score / 1000) * 502} 502`}
                  className="transition-all duration-2000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{gameState.score}</span>
                <span className="text-cyan-300">points</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Achievements Unlocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {gameState.achievements.filter(a => a.unlocked).map((achievement) => (
                  <div key={achievement.id} className="text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-sm text-cyan-300">{achievement.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-cyan-300">Time Taken:</span>
                <span className="text-white">{formatTime(timer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300">Best Streak:</span>
                <span className="text-white">{gameState.streak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300">Achievements:</span>
                <span className="text-white">{gameState.achievements.filter(a => a.unlocked).length}/5</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={downloadReport}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Report
          </Button>
          <Button 
            onClick={shareResults}
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Results
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setEmployerModalOpen(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Employer View
          </Button>
        </div>
      </div>
    </div>
  );

  if (gamePhase === 'welcome') return renderWelcomeScreen();
  if (gamePhase === 'registration') return renderRegistrationScreen();
  if (gamePhase === 'results') return renderResults();

  return (
    <div className="min-h-screen bg-background">
      {renderGameHUD()}
      
      {currentLevel === 1 && renderLevel1()}
      {currentLevel === 2 && renderLevel2()}
      {currentLevel === 3 && renderLevel3()}
      {currentLevel === 4 && renderLevel4()}
      {currentLevel === 5 && renderLevel5()}

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-24 right-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white p-4 rounded-2xl shadow-2xl z-50 animate-slide-in-right">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{showAchievement.icon}</span>
            <div>
              <h4 className="font-bold">{showAchievement.title}</h4>
              <p className="text-sm">{showAchievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Employer Modal */}
      <Dialog open={employerModalOpen} onOpenChange={setEmployerModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employer View - Confidential</DialogTitle>
            <DialogDescription>Advanced analytics and validity metrics for hiring decisions</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Validity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">Valid</div>
                    <div className="text-sm text-green-700">Response Pattern</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatTime(timer)}</div>
                    <div className="text-sm text-blue-700">Completion Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-purple-700">Engagement Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Career Readiness Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { factor: 'Decision Making', score: 85, color: 'bg-green-500' },
                    { factor: 'Adaptability', score: 78, color: 'bg-blue-500' },
                    { factor: 'Communication', score: 92, color: 'bg-purple-500' },
                    { factor: 'Leadership Potential', score: 71, color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{item.factor}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-8">{item.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareerLaunch;