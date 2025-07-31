export interface ValidationResult {
  isValid: boolean;
  completionRate: number;
  requiredFieldsMissing: string[];
  warnings: string[];
  timeSpent: number;
  responseConsistency: number;
  qualityScore: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  required?: boolean;
  category?: string;
}

export interface AssessmentResponse {
  questionId: string;
  answer: string;
  responseTime: number;
  timestamp: number;
}

export const validateAssessmentData = (
  questions: AssessmentQuestion[],
  responses: Record<string, string>,
  responseTimes: number[],
  startTime: number
): ValidationResult => {
  const requiredFieldsMissing: string[] = [];
  const warnings: string[] = [];
  
  // Calculate completion rate
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const completionRate = (answeredQuestions / totalQuestions) * 100;
  
  // Check required fields
  questions.forEach(question => {
    if (question.required && !responses[question.id]?.trim()) {
      requiredFieldsMissing.push(question.text.substring(0, 50) + '...');
    }
  });
  
  // Calculate time spent
  const timeSpent = Date.now() - startTime;
  
  // Time-based warnings
  if (timeSpent < 120000) { // Less than 2 minutes
    warnings.push('Assessment completed very quickly - please ensure all responses are thoughtful');
  } else if (timeSpent > 3600000) { // More than 1 hour
    warnings.push('Assessment took longer than expected - results may be affected by fatigue');
  }
  
  // Calculate response consistency
  const responseConsistency = calculateResponseConsistency(responseTimes);
  
  if (responseConsistency < 60) {
    warnings.push('Response patterns suggest inconsistent engagement');
  }
  
  // Check completion rate
  if (completionRate < 80) {
    warnings.push(`Only ${Math.round(completionRate)}% of questions were answered`);
  }
  
  // Overall validity
  const isValid = requiredFieldsMissing.length === 0 && 
                  completionRate >= 80 && 
                  timeSpent >= 120000 && 
                  responseConsistency >= 40;
  
  // Quality score calculation
  let qualityScore = 0;
  if (completionRate >= 95) qualityScore += 25;
  else if (completionRate >= 80) qualityScore += 15;
  
  if (responseConsistency >= 80) qualityScore += 25;
  else if (responseConsistency >= 60) qualityScore += 15;
  else if (responseConsistency >= 40) qualityScore += 5;
  
  if (timeSpent >= 300000 && timeSpent <= 2400000) qualityScore += 25; // 5-40 minutes
  else if (timeSpent >= 120000 && timeSpent <= 3600000) qualityScore += 15; // 2-60 minutes
  else if (timeSpent >= 120000) qualityScore += 5;
  
  if (requiredFieldsMissing.length === 0) qualityScore += 25;
  
  return {
    isValid,
    completionRate,
    requiredFieldsMissing,
    warnings,
    timeSpent,
    responseConsistency,
    qualityScore
  };
};

const calculateResponseConsistency = (responseTimes: number[]): number => {
  if (responseTimes.length < 3) return 100;
  
  // Calculate consistency based on response time patterns
  const avgTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower coefficient of variation = higher consistency
  const coefficientOfVariation = stdDev / avgTime;
  
  // Convert to percentage (lower CV = higher consistency score)
  const consistencyScore = Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 50)));
  
  // Check for suspicious patterns
  let suspiciousPatterns = 0;
  
  // Too many very fast responses (< 2 seconds)
  const veryFastResponses = responseTimes.filter(time => time < 2000).length;
  if (veryFastResponses > responseTimes.length * 0.3) suspiciousPatterns += 20;
  
  // Too many identical response times
  const uniqueTimes = new Set(responseTimes.map(time => Math.round(time / 1000))).size;
  if (uniqueTimes < responseTimes.length * 0.5) suspiciousPatterns += 15;
  
  // Alternating very fast/slow pattern
  let alternatingPattern = 0;
  for (let i = 1; i < responseTimes.length; i++) {
    const prev = responseTimes[i - 1];
    const curr = responseTimes[i];
    if ((prev < 3000 && curr > 15000) || (prev > 15000 && curr < 3000)) {
      alternatingPattern++;
    }
  }
  if (alternatingPattern > responseTimes.length * 0.3) suspiciousPatterns += 10;
  
  return Math.max(0, consistencyScore - suspiciousPatterns);
};

export const generateValidationReport = (validation: ValidationResult): string[] => {
  const report: string[] = [];
  
  if (validation.qualityScore >= 90) {
    report.push('Excellent assessment quality - results are highly reliable');
  } else if (validation.qualityScore >= 70) {
    report.push('Good assessment quality - results are reliable');
  } else if (validation.qualityScore >= 50) {
    report.push('Moderate assessment quality - results should be interpreted with caution');
  } else {
    report.push('Low assessment quality - results may not be reliable');
  }
  
  if (validation.completionRate < 100) {
    report.push(`${Math.round(100 - validation.completionRate)}% of questions were not answered`);
  }
  
  if (validation.responseConsistency < 60) {
    report.push('Response patterns suggest inconsistent engagement or rapid completion');
  }
  
  const timeMinutes = Math.round(validation.timeSpent / 60000);
  if (timeMinutes < 5) {
    report.push('Assessment completed very quickly - consider retaking for more accurate results');
  } else if (timeMinutes > 60) {
    report.push('Extended completion time may indicate interruptions or fatigue');
  }
  
  return report;
};

export const assessmentMeetsStandards = (validation: ValidationResult): boolean => {
  return validation.isValid && 
         validation.qualityScore >= 50 && 
         validation.completionRate >= 80 && 
         validation.responseConsistency >= 40;
};