interface ResponseTimeData {
  questionId: string;
  responseTime: number;
  timestamp: number;
  questionType: string;
  dimension: string;
}

interface ResponsePattern {
  averageTime: number;
  medianTime: number;
  speedFlags: string[];
  engagementScore: number;
  consistencyScore: number;
}

interface AnalyticsInsights {
  timePattern: ResponsePattern;
  qualityIndicators: string[];
  recommendations: string[];
  engagementLevel: 'low' | 'moderate' | 'high';
}

export class ResponseTimeAnalytics {
  private static responses: ResponseTimeData[] = [];
  
  static recordResponse(data: ResponseTimeData) {
    this.responses.push({
      ...data,
      timestamp: Date.now()
    });
  }

  static analyzePattern(): ResponsePattern {
    if (this.responses.length === 0) {
      return {
        averageTime: 0,
        medianTime: 0,
        speedFlags: [],
        engagementScore: 0,
        consistencyScore: 0
      };
    }

    const times = this.responses.map(r => r.responseTime);
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const medianTime = this.calculateMedian(times);
    const speedFlags = this.detectSpeedFlags(times);
    const engagementScore = this.calculateEngagementScore(times);
    const consistencyScore = this.calculateConsistencyScore(times);

    return {
      averageTime,
      medianTime,
      speedFlags,
      engagementScore,
      consistencyScore
    };
  }

  static generateInsights(): AnalyticsInsights {
    const pattern = this.analyzePattern();
    const qualityIndicators = this.generateQualityIndicators(pattern);
    const recommendations = this.generateRecommendations(pattern);
    const engagementLevel = this.determineEngagementLevel(pattern);

    return {
      timePattern: pattern,
      qualityIndicators,
      recommendations,
      engagementLevel
    };
  }

  private static calculateMedian(times: number[]): number {
    const sorted = [...times].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  private static detectSpeedFlags(times: number[]): string[] {
    const flags: string[] = [];
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    
    // Too fast responses (likely not reading carefully)
    const fastResponses = times.filter(time => time < 3).length;
    if (fastResponses > times.length * 0.3) {
      flags.push('High frequency of rapid responses (<3s)');
    }

    // Too slow responses (possible disengagement)
    const slowResponses = times.filter(time => time > 120).length;
    if (slowResponses > times.length * 0.2) {
      flags.push('Extended response times detected (>2min)');
    }

    // Inconsistent pacing
    const variance = this.calculateVariance(times);
    if (variance > avgTime * 2) {
      flags.push('Highly variable response pacing');
    }

    // Declining engagement pattern
    if (this.detectDeclinePattern(times)) {
      flags.push('Response time increasing over assessment');
    }

    return flags;
  }

  private static calculateVariance(times: number[]): number {
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / times.length;
    return Math.sqrt(variance);
  }

  private static detectDeclinePattern(times: number[]): boolean {
    if (times.length < 10) return false;
    
    const firstHalf = times.slice(0, Math.floor(times.length / 2));
    const secondHalf = times.slice(Math.floor(times.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, time) => sum + time, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, time) => sum + time, 0) / secondHalf.length;
    
    return secondAvg > firstAvg * 1.5;
  }

  private static calculateEngagementScore(times: number[]): number {
    const idealRange = { min: 8, max: 45 }; // Optimal response time range
    let score = 0;
    
    times.forEach(time => {
      if (time >= idealRange.min && time <= idealRange.max) {
        score += 100;
      } else if (time < idealRange.min) {
        // Penalty for too fast (likely not reading)
        score += Math.max(0, 100 - ((idealRange.min - time) * 10));
      } else {
        // Penalty for too slow (possible disengagement)
        score += Math.max(0, 100 - ((time - idealRange.max) * 2));
      }
    });
    
    return Math.round(score / times.length);
  }

  private static calculateConsistencyScore(times: number[]): number {
    if (times.length < 3) return 100;
    
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length;
    const deviations = times.map(time => Math.abs(time - avg));
    const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
    
    // Lower deviation = higher consistency
    const normalizedDeviation = Math.min(avgDeviation / avg, 1);
    return Math.round((1 - normalizedDeviation) * 100);
  }

  private static generateQualityIndicators(pattern: ResponsePattern): string[] {
    const indicators: string[] = [];
    
    if (pattern.engagementScore >= 80) {
      indicators.push('High engagement level detected');
    } else if (pattern.engagementScore >= 60) {
      indicators.push('Moderate engagement level');
    } else {
      indicators.push('Low engagement indicators present');
    }
    
    if (pattern.consistencyScore >= 75) {
      indicators.push('Consistent response pacing');
    } else {
      indicators.push('Variable response timing patterns');
    }
    
    if (pattern.averageTime >= 10 && pattern.averageTime <= 40) {
      indicators.push('Optimal response time range');
    }
    
    return indicators;
  }

  private static generateRecommendations(pattern: ResponsePattern): string[] {
    const recommendations: string[] = [];
    
    if (pattern.averageTime < 8) {
      recommendations.push('Consider taking more time to read questions carefully');
    }
    
    if (pattern.averageTime > 60) {
      recommendations.push('Try to maintain focus and respond more promptly');
    }
    
    if (pattern.consistencyScore < 60) {
      recommendations.push('Aim for more consistent pacing throughout the assessment');
    }
    
    if (pattern.speedFlags.length > 2) {
      recommendations.push('Review response patterns for optimal assessment quality');
    }
    
    return recommendations;
  }

  private static determineEngagementLevel(pattern: ResponsePattern): 'low' | 'moderate' | 'high' {
    if (pattern.engagementScore >= 75) return 'high';
    if (pattern.engagementScore >= 50) return 'moderate';
    return 'low';
  }

  static reset() {
    this.responses = [];
  }

  static getSessionData() {
    return {
      totalResponses: this.responses.length,
      totalTime: this.responses.reduce((sum, r) => sum + r.responseTime, 0),
      startTime: this.responses.length > 0 ? this.responses[0].timestamp : null,
      endTime: this.responses.length > 0 ? this.responses[this.responses.length - 1].timestamp : null
    };
  }
}