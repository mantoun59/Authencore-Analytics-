import { useState, useEffect, useRef, useCallback } from 'react';

export interface BehaviorMetrics {
  tabSwitches: number;
  focusBreaks: number;
  rapidClicks: number;
  scrollPatterns: Array<{
    duration: number;
    timestamp: Date;
    phase: string;
  }>;
  timeAwareness: Array<{
    activity: string;
    estimated: number;
    actual: number;
    accuracy: number;
    timestamp: Date;
  }>;
  distractionResponses: Array<{
    type: string;
    responseTime: number;
    dismissed: boolean;
    timestamp: Date;
  }>;
  notificationPriorities: Array<{
    options: string[];
    selected: string;
    timestamp: Date;
  }>;
}

export interface DigitalAnxietyMetrics {
  score: number;
  level: 'low' | 'moderate' | 'high';
  indicators: {
    tabSwitching: number;
    rapidClicking: number;
    focusBreaks: number;
  };
}

export interface TimeAwarenessMetrics {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  details: BehaviorMetrics['timeAwareness'];
}

export interface DistractionResistanceMetrics {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  patterns: { [key: string]: any };
}

export interface BehavioralInsights {
  digitalAnxiety: DigitalAnxietyMetrics;
  timeAwareness: TimeAwarenessMetrics;
  distractionResistance: DistractionResistanceMetrics;
  priorities: {
    workFocused: number;
    socialDistracted: number;
    balanced: number;
  } | null;
  sessionMetrics: {
    duration: number;
    focusBreaks: number;
    tabSwitches: number;
    inactivityPeriods: Array<{
      duration: number;
      phase: string;
    }>;
  };
}

export const useDigitalHabitsTracker = () => {
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics>({
    tabSwitches: 0,
    focusBreaks: 0,
    rapidClicks: 0,
    scrollPatterns: [],
    timeAwareness: [],
    distractionResponses: [],
    notificationPriorities: []
  });

  const sessionStart = useRef(new Date());
  const lastActivity = useRef(new Date());
  const inactivityPeriods = useRef<Array<{ duration: number; phase: string }>>([]);
  const currentPhase = useRef<string>('unknown');
  const inactivityChecker = useRef<NodeJS.Timeout | null>(null);
  const clickTimestamps = useRef<number[]>([]);

  const setCurrentPhase = useCallback((phase: string) => {
    currentPhase.current = phase;
  }, []);

  const recordFocusBreak = useCallback(() => {
    const breakTime = new Date();
    const duration = breakTime.getTime() - lastActivity.current.getTime();
    
    setBehaviorMetrics(prev => ({
      ...prev,
      focusBreaks: prev.focusBreaks + 1
    }));
    
    return {
      timestamp: breakTime,
      duration: duration,
      phase: currentPhase.current
    };
  }, []);

  const recordTimeEstimation = useCallback((activity: string, estimated: number, actual: number) => {
    const accuracy = Math.abs(estimated - actual) / actual;
    
    setBehaviorMetrics(prev => ({
      ...prev,
      timeAwareness: [...prev.timeAwareness, {
        activity,
        estimated,
        actual,
        accuracy: 1 - Math.min(accuracy, 1),
        timestamp: new Date()
      }]
    }));
  }, []);

  const recordDistractionResponse = useCallback((distractionType: string, responseTime: number, dismissed: boolean) => {
    setBehaviorMetrics(prev => ({
      ...prev,
      distractionResponses: [...prev.distractionResponses, {
        type: distractionType,
        responseTime,
        dismissed,
        timestamp: new Date()
      }]
    }));
  }, []);

  const recordNotificationPriority = useCallback((notifications: string[], selected: string) => {
    setBehaviorMetrics(prev => ({
      ...prev,
      notificationPriorities: [...prev.notificationPriorities, {
        options: notifications,
        selected,
        timestamp: new Date()
      }]
    }));
  }, []);

  const calculateDigitalAnxiety = useCallback((): DigitalAnxietyMetrics => {
    const duration = (new Date().getTime() - sessionStart.current.getTime()) / 60000; // minutes
    const switchRate = behaviorMetrics.tabSwitches / duration;
    const clickAnxiety = behaviorMetrics.rapidClicks;
    
    const anxietyScore = Math.min((switchRate * 10) + (clickAnxiety * 5), 100);
    
    return {
      score: Math.round(anxietyScore),
      level: anxietyScore < 20 ? 'low' : anxietyScore < 50 ? 'moderate' : 'high',
      indicators: {
        tabSwitching: switchRate,
        rapidClicking: clickAnxiety,
        focusBreaks: behaviorMetrics.focusBreaks
      }
    };
  }, [behaviorMetrics]);

  const calculateTimeAwareness = useCallback((): TimeAwarenessMetrics => {
    if (behaviorMetrics.timeAwareness.length === 0) {
      return { score: 50, level: 'fair', details: [] };
    }
    
    const avgAccuracy = behaviorMetrics.timeAwareness
      .reduce((sum, item) => sum + item.accuracy, 0) / behaviorMetrics.timeAwareness.length;
    
    return {
      score: Math.round(avgAccuracy * 100),
      level: avgAccuracy > 0.8 ? 'excellent' : 
             avgAccuracy > 0.6 ? 'good' : 
             avgAccuracy > 0.4 ? 'fair' : 'poor',
      details: behaviorMetrics.timeAwareness
    };
  }, [behaviorMetrics.timeAwareness]);

  const calculateDistractionResistance = useCallback((): DistractionResistanceMetrics => {
    const responses = behaviorMetrics.distractionResponses;
    
    if (responses.length === 0) {
      return { score: 50, level: 'fair', patterns: {} };
    }
    
    const dismissedCount = responses.filter(r => r.dismissed).length;
    const avgResponseTime = responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length;
    
    // Quick dismissal = good resistance
    const resistanceScore = (dismissedCount / responses.length) * 70 + 
                           (1 - Math.min(avgResponseTime / 5000, 1)) * 30;
    
    // Analyze patterns
    const patterns: { [key: string]: any } = {};
    responses.forEach(response => {
      if (!patterns[response.type]) {
        patterns[response.type] = {
          count: 0,
          avgResponseTime: 0,
          dismissed: 0
        };
      }
      
      patterns[response.type].count++;
      patterns[response.type].avgResponseTime += response.responseTime;
      if (response.dismissed) patterns[response.type].dismissed++;
    });
    
    // Calculate averages
    Object.keys(patterns).forEach(type => {
      patterns[type].avgResponseTime /= patterns[type].count;
      patterns[type].dismissRate = patterns[type].dismissed / patterns[type].count;
    });
    
    return {
      score: Math.round(resistanceScore),
      level: resistanceScore > 80 ? 'excellent' : 
             resistanceScore > 60 ? 'good' : 
             resistanceScore > 40 ? 'fair' : 'poor',
      patterns
    };
  }, [behaviorMetrics.distractionResponses]);

  const analyzePriorities = useCallback(() => {
    const priorities = behaviorMetrics.notificationPriorities;
    
    if (priorities.length === 0) return null;
    
    const workFocus = priorities.filter(p => p.selected === 'work-email' || p.selected === 'none').length;
    const socialFocus = priorities.filter(p => p.selected === 'social-media').length;
    
    return {
      workFocused: workFocus / priorities.length,
      socialDistracted: socialFocus / priorities.length,
      balanced: 1 - Math.abs(workFocus - socialFocus) / priorities.length
    };
  }, [behaviorMetrics.notificationPriorities]);

  const generateBehavioralInsights = useCallback((): BehavioralInsights => {
    return {
      digitalAnxiety: calculateDigitalAnxiety(),
      timeAwareness: calculateTimeAwareness(),
      distractionResistance: calculateDistractionResistance(),
      priorities: analyzePriorities(),
      sessionMetrics: {
        duration: new Date().getTime() - sessionStart.current.getTime(),
        focusBreaks: behaviorMetrics.focusBreaks,
        tabSwitches: behaviorMetrics.tabSwitches,
        inactivityPeriods: inactivityPeriods.current
      }
    };
  }, [calculateDigitalAnxiety, calculateTimeAwareness, calculateDistractionResistance, analyzePriorities, behaviorMetrics]);

  // Initialize tracking
  useEffect(() => {
    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setBehaviorMetrics(prev => ({
          ...prev,
          tabSwitches: prev.tabSwitches + 1
        }));
        recordFocusBreak();
      }
    };

    // Track rapid clicking (anxiety indicator)
    const handleClick = () => {
      const now = Date.now();
      clickTimestamps.current.push(now);
      
      // Keep only clicks from last 2 seconds
      clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 2000);
      
      if (clickTimestamps.current.length > 5) {
        setBehaviorMetrics(prev => ({
          ...prev,
          rapidClicks: prev.rapidClicks + 1
        }));
      }
      
      lastActivity.current = new Date();
    };

    // Track scrolling patterns
    let scrollTimer: NodeJS.Timeout;
    let scrollStart: number;
    
    const handleScroll = () => {
      if (!scrollStart) {
        scrollStart = Date.now();
      }
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const duration = Date.now() - scrollStart;
        setBehaviorMetrics(prev => ({
          ...prev,
          scrollPatterns: [...prev.scrollPatterns, {
            duration,
            timestamp: new Date(),
            phase: currentPhase.current
          }]
        }));
        scrollStart = 0;
      }, 200);
    };

    // Track inactivity
    inactivityChecker.current = setInterval(() => {
      const inactiveTime = new Date().getTime() - lastActivity.current.getTime();
      if (inactiveTime > 30000) { // 30 seconds
        inactivityPeriods.current.push({
          duration: inactiveTime,
          phase: currentPhase.current
        });
      }
    }, 10000);

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      if (inactivityChecker.current) {
        clearInterval(inactivityChecker.current);
      }
    };
  }, [recordFocusBreak]);

  const cleanup = useCallback(() => {
    if (inactivityChecker.current) {
      clearInterval(inactivityChecker.current);
    }
  }, []);

  return {
    behaviorMetrics,
    setCurrentPhase,
    recordTimeEstimation,
    recordDistractionResponse,
    recordNotificationPriority,
    generateBehavioralInsights,
    cleanup
  };
};
