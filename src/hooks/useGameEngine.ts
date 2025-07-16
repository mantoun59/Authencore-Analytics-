import { useState, useCallback, useRef } from 'react';

interface PowerUps {
  hint: number;
  skip: number;
  eliminate: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface BehaviorTracking {
  mouseMovements: Array<{ x: number; y: number; timestamp: number }>;
  clickPatterns: Array<{ target: string; timestamp: number }>;
  hesitations: Array<{ questionId: string; timestamp: number; duration: number }>;
  powerUpUsage: Array<{ type: string; timestamp: number; level: number; questionId: string }>;
}

export const useGameEngine = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUps>({ hint: 3, skip: 2, eliminate: 2 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [levelScores, setLevelScores] = useState<Record<number, number>>({});
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  
  const behaviorTracking = useRef<BehaviorTracking>({
    mouseMovements: [],
    clickPatterns: [],
    hesitations: [],
    powerUpUsage: []
  });
  
  const currentQuestionId = useRef<string>('');

  const startGame = useCallback(() => {
    setStartTime(Date.now());
    setScore(0);
    setStreak(0);
    setLevel(1);
    setAchievements([]);
    setPowerUps({ hint: 3, skip: 2, eliminate: 2 });
    setLevelScores({});
    behaviorTracking.current = {
      mouseMovements: [],
      clickPatterns: [],
      hesitations: [],
      powerUpUsage: []
    };
  }, []);

  const updateScore = useCallback((points: number) => {
    setScore(prev => {
      const newScore = prev + points;
      checkAchievements(newScore);
      return newScore;
    });
  }, []);

  const updateStreak = useCallback((correct: boolean) => {
    if (correct) {
      setStreak(prev => {
        const newStreak = prev + 1;
        // Streak bonuses
        if (newStreak % 5 === 0) {
          updateScore(50 * (newStreak / 5));
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  }, [updateScore]);

  const usePowerUp = useCallback((type: keyof PowerUps) => {
    setPowerUps(prev => {
      if (prev[type] > 0) {
        const newPowerUps = { ...prev, [type]: prev[type] - 1 };
        
        // Track power-up usage
        behaviorTracking.current.powerUpUsage.push({
          type,
          timestamp: Date.now(),
          level,
          questionId: currentQuestionId.current
        });
        
        return newPowerUps;
      }
      return prev;
    });
  }, [level]);

  const checkAchievements = useCallback((currentScore: number) => {
    const newAchievements: Achievement[] = [];
    
    // Score-based achievements
    if (currentScore >= 1000 && !achievements.some(a => a.id === 'score_1000')) {
      newAchievements.push({
        id: 'score_1000',
        title: 'Rising Star',
        description: 'Scored 1000 points',
        icon: '⭐'
      });
    }
    
    if (currentScore >= 2000 && !achievements.some(a => a.id === 'score_2000')) {
      newAchievements.push({
        id: 'score_2000',
        title: 'High Achiever',
        description: 'Scored 2000 points',
        icon: '🏆'
      });
    }
    
    // Streak achievements
    if (streak >= 10 && !achievements.some(a => a.id === 'streak_10')) {
      newAchievements.push({
        id: 'streak_10',
        title: 'On Fire!',
        description: '10 correct answers in a row',
        icon: '🔥'
      });
    }
    
    if (streak >= 20 && !achievements.some(a => a.id === 'streak_20')) {
      newAchievements.push({
        id: 'streak_20',
        title: 'Unstoppable',
        description: '20 correct answers in a row',
        icon: '⚡'
      });
    }
    
    // Level completion achievements
    if (level >= 3 && !achievements.some(a => a.id === 'level_3')) {
      newAchievements.push({
        id: 'level_3',
        title: 'Scenario Master',
        description: 'Completed workplace scenarios',
        icon: '🎭'
      });
    }
    
    if (level >= 5 && !achievements.some(a => a.id === 'level_5')) {
      newAchievements.push({
        id: 'level_5',
        title: 'Assessment Complete',
        description: 'Finished all levels',
        icon: '🎯'
      });
    }
    
    // Power-up efficiency
    const totalPowerUps = Object.values(powerUps).reduce((sum, count) => sum + count, 0);
    if (totalPowerUps === 7 && !achievements.some(a => a.id === 'no_powerups')) {
      newAchievements.push({
        id: 'no_powerups',
        title: 'Self-Reliant',
        description: 'Completed without using power-ups',
        icon: '💪'
      });
    }
    
    // Show new achievements
    newAchievements.forEach(achievement => {
      setAchievements(prev => [...prev, achievement]);
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 3000);
    });
  }, [achievements, streak, level, powerUps]);

  const trackMouseMovement = useCallback((e: MouseEvent) => {
    behaviorTracking.current.mouseMovements.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
  }, []);

  const trackClick = useCallback((target: string) => {
    behaviorTracking.current.clickPatterns.push({
      target,
      timestamp: Date.now()
    });
  }, []);

  const trackHesitation = useCallback((questionId: string, duration: number) => {
    behaviorTracking.current.hesitations.push({
      questionId,
      timestamp: Date.now(),
      duration
    });
  }, []);

  const calculateEngagementScore = useCallback(() => {
    if (!startTime) return 0;
    
    const totalTime = Date.now() - startTime;
    const optimalTime = 30 * 60 * 1000; // 30 minutes
    
    return {
      completion: 1.0,
      timeEngagement: Math.min(totalTime / optimalTime, 1),
      responseConsistency: calculateResponseConsistency(),
      powerUpStrategy: calculatePowerUpEfficiency(),
      mouseActivity: calculateMouseActivity()
    };
  }, [startTime]);

  const calculateResponseConsistency = useCallback(() => {
    const hesitations = behaviorTracking.current.hesitations;
    if (hesitations.length === 0) return 1.0;
    
    const avgHesitation = hesitations.reduce((sum, h) => sum + h.duration, 0) / hesitations.length;
    return Math.max(0, 1 - (avgHesitation / 10000)); // Normalize to 0-1
  }, []);

  const calculatePowerUpEfficiency = useCallback(() => {
    const totalUsed = 7 - Object.values(powerUps).reduce((sum, count) => sum + count, 0);
    const efficiency = totalUsed / 7;
    return Math.max(0, 1 - efficiency); // Higher score for using fewer power-ups
  }, [powerUps]);

  const calculateMouseActivity = useCallback(() => {
    const movements = behaviorTracking.current.mouseMovements;
    if (movements.length === 0) return 0;
    
    // Calculate activity based on movement frequency
    const timeSpan = movements[movements.length - 1].timestamp - movements[0].timestamp;
    const activityRate = movements.length / (timeSpan / 1000); // movements per second
    
    return Math.min(activityRate / 2, 1); // Normalize to 0-1
  }, []);

  const setCurrentQuestion = useCallback((questionId: string) => {
    currentQuestionId.current = questionId;
  }, []);

  const generateEmployerMetrics = useCallback(() => {
    return {
      engagementScore: calculateEngagementScore(),
      focusMetrics: {
        averageResponseTime: calculateAverageResponseTime(),
        hesitationRate: calculateHesitationRate(),
        distractionIndicators: detectDistractionPatterns()
      },
      gamingBehavior: {
        strategicThinking: assessStrategicThinking(),
        riskTaking: assessRiskTaking(),
        adaptability: assessAdaptability()
      },
      validityIndicators: {
        rushingDetected: detectRushing(),
        randomPatterns: detectRandomResponses(),
        engagementConsistency: checkEngagementConsistency()
      }
    };
  }, [calculateEngagementScore]);

  const calculateAverageResponseTime = useCallback(() => {
    const hesitations = behaviorTracking.current.hesitations;
    if (hesitations.length === 0) return 0;
    
    return hesitations.reduce((sum, h) => sum + h.duration, 0) / hesitations.length;
  }, []);

  const calculateHesitationRate = useCallback(() => {
    const hesitations = behaviorTracking.current.hesitations;
    const totalQuestions = Object.keys(levelScores).length;
    
    return totalQuestions > 0 ? hesitations.length / totalQuestions : 0;
  }, [levelScores]);

  const detectDistractionPatterns = useCallback(() => {
    const movements = behaviorTracking.current.mouseMovements;
    if (movements.length < 10) return [];
    
    const patterns = [];
    // Detect erratic mouse movements
    let erraticCount = 0;
    for (let i = 1; i < movements.length; i++) {
      const distance = Math.sqrt(
        Math.pow(movements[i].x - movements[i-1].x, 2) + 
        Math.pow(movements[i].y - movements[i-1].y, 2)
      );
      if (distance > 100) erraticCount++;
    }
    
    if (erraticCount > movements.length * 0.3) {
      patterns.push('erratic_mouse_movement');
    }
    
    return patterns;
  }, []);

  const assessStrategicThinking = useCallback(() => {
    const powerUpUsage = behaviorTracking.current.powerUpUsage;
    const strategicUse = powerUpUsage.filter(p => p.type === 'hint').length;
    
    return Math.min(strategicUse / 3, 1); // Normalize based on optimal hint usage
  }, []);

  const assessRiskTaking = useCallback(() => {
    const skipUsage = behaviorTracking.current.powerUpUsage.filter(p => p.type === 'skip').length;
    return skipUsage / 2; // Normalize based on available skips
  }, []);

  const assessAdaptability = useCallback(() => {
    const eliminateUsage = behaviorTracking.current.powerUpUsage.filter(p => p.type === 'eliminate').length;
    return Math.min(eliminateUsage / 2, 1); // Normalize based on available eliminations
  }, []);

  const detectRushing = useCallback(() => {
    const avgResponseTime = calculateAverageResponseTime();
    return avgResponseTime < 2000; // Less than 2 seconds average
  }, [calculateAverageResponseTime]);

  const detectRandomResponses = useCallback(() => {
    // This would need more sophisticated pattern detection
    return false;
  }, []);

  const checkEngagementConsistency = useCallback(() => {
    const movements = behaviorTracking.current.mouseMovements;
    if (movements.length === 0) return false;
    
    const timeSpan = movements[movements.length - 1].timestamp - movements[0].timestamp;
    const expectedMovements = timeSpan / 1000; // Expected ~1 movement per second
    
    return movements.length >= expectedMovements * 0.5; // At least 50% of expected activity
  }, []);

  return {
    score,
    streak,
    level,
    achievements,
    powerUps,
    showAchievement,
    startTime,
    levelScores,
    startGame,
    updateScore,
    updateStreak,
    usePowerUp,
    setLevel,
    setLevelScores,
    trackMouseMovement,
    trackClick,
    trackHesitation,
    setCurrentQuestion,
    generateEmployerMetrics,
    calculateEngagementScore,
    behaviorTracking: behaviorTracking.current
  };
};