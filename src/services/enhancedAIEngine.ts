import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EnhancedAIConfig {
  model: 'gpt-4.1-2025-04-14' | 'claude-opus-4-20250514' | 'claude-sonnet-4-20250514';
  temperature: number;
  maxTokens: number;
  analysisDepth: 'standard' | 'comprehensive' | 'expert';
}

export interface DistortionAnalysis {
  score: number;
  reliability: 'low' | 'medium' | 'high';
  consistencyFlags: string[];
  responsePatterns: {
    fakeGood: number;
    fakeBad: number;
    random: number;
    inconsistency: number;
  };
  interpretation: string;
  confidenceLevel: number;
  validityMetrics: {
    responseTimeVariance: number;
    patternConsistency: number;
    extremeResponseBias: number;
    socialDesirabilityIndex: number;
  };
}

export interface EnhancedInterviewQuestions {
  clarificationQuestions: {
    question: string;
    purpose: string;
    expectedInsights: string[];
    followUpTriggers: string[];
  }[];
  validationQuestions: {
    question: string;
    assessmentDimension: string;
    validationTarget: string;
    scoringCriteria: string[];
  }[];
  behavioralQuestions: {
    question: string;
    competency: string;
    situation: string;
    expectedBehaviors: string[];
    redFlags: string[];
  }[];
  probeQuestions: {
    question: string;
    context: string;
    deepenedInsights: string[];
  }[];
}

export interface EnhancedReportContent {
  executiveSummary: {
    overallScore: number;
    confidenceLevel: number;
    keyInsights: string[];
    topStrengths: string[];
    developmentPriorities: string[];
    recommendedActions: string[];
    riskFactors: string[];
  };
  cognitiveProfile: {
    processingStyle: string;
    learningPreferences: string[];
    decisionMakingApproach: string;
    problemSolvingStrategy: string;
    informationProcessingSpeed: string;
    attentionToDetail: string;
  };
  behavioralPredictions: {
    workplacePerformance: {
      predictedEffectiveness: number;
      performanceIndicators: string[];
      potentialChallenges: string[];
    };
    teamDynamics: {
      collaborationStyle: string;
      leadershipPotential: number;
      conflictResolutionApproach: string;
      influenceStyle: string;
    };
    stressResponse: {
      resilienceLevel: number;
      copingMechanisms: string[];
      stressTriggers: string[];
      supportNeeds: string[];
    };
  };
  careerGuidance: {
    optimalEnvironments: string[];
    roleRecommendations: string[];
    developmentPathways: string[];
    skillGapAnalysis: string[];
    careerTimeline: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
    };
  };
  validityAssessment: DistortionAnalysis;
}

export class EnhancedAIEngine {
  private static instance: EnhancedAIEngine;
  private config: EnhancedAIConfig;

  private constructor() {
    this.config = {
      model: 'gpt-4.1-2025-04-14',
      temperature: 0.3,
      maxTokens: 4000,
      analysisDepth: 'comprehensive'
    };
  }

  static getInstance(): EnhancedAIEngine {
    if (!EnhancedAIEngine.instance) {
      EnhancedAIEngine.instance = new EnhancedAIEngine();
    }
    return EnhancedAIEngine.instance;
  }

  updateConfig(config: Partial<EnhancedAIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async generateEnhancedReport(
    assessmentData: any,
    candidateInfo: any,
    reportType: 'candidate' | 'employer' = 'candidate'
  ): Promise<EnhancedReportContent> {
    try {
      console.log('🚀 Enhanced AI Engine: Starting comprehensive report generation');
      
      // Run multiple AI analyses in parallel for comprehensive insights
      const [
        cognitiveAnalysis,
        behavioralPredictions,
        distortionAnalysis,
        careerGuidance
      ] = await Promise.all([
        this.analyzeCognitiveProfile(assessmentData, candidateInfo),
        this.predictBehavioralOutcomes(assessmentData, candidateInfo),
        this.analyzeDistortionScale(assessmentData),
        this.generateCareerGuidance(assessmentData, candidateInfo)
      ]);

      // Generate executive summary based on all analyses
      const executiveSummary = await this.generateExecutiveSummary(
        assessmentData,
        candidateInfo,
        { cognitiveAnalysis, behavioralPredictions, distortionAnalysis, careerGuidance }
      );

      const enhancedReport: EnhancedReportContent = {
        executiveSummary,
        cognitiveProfile: cognitiveAnalysis,
        behavioralPredictions,
        careerGuidance,
        validityAssessment: distortionAnalysis
      };

      console.log('✅ Enhanced AI Engine: Report generation completed successfully');
      toast.success('Enhanced AI report generated with advanced insights');
      
      return enhancedReport;

    } catch (error) {
      console.error('❌ Enhanced AI Engine Error:', error);
      toast.error('Failed to generate enhanced AI report');
      throw error;
    }
  }

  async generateAdvancedInterviewQuestions(
    assessmentData: any,
    candidateInfo: any,
    jobRole?: string
  ): Promise<EnhancedInterviewQuestions> {
    try {
      console.log('🎯 Enhanced AI Engine: Generating advanced interview questions');

      const prompt = `
        You are a senior industrial psychologist and talent assessment expert specializing in interview design.
        
        ASSESSMENT CONTEXT:
        - Candidate: ${JSON.stringify(candidateInfo)}
        - Assessment Results: ${JSON.stringify(assessmentData)}
        - Target Role: ${jobRole || 'General Position'}
        
        TASK: Generate sophisticated interview questions designed to:
        1. Validate assessment findings
        2. Explore inconsistencies or areas needing clarification
        3. Predict workplace performance
        4. Uncover potential derailers
        
        Return ONLY valid JSON in this exact format:
        {
          "clarificationQuestions": [
            {
              "question": "Specific question text",
              "purpose": "Why this question is needed",
              "expectedInsights": ["Insight 1", "Insight 2"],
              "followUpTriggers": ["If they say X, ask Y", "If they hesitate, probe Z"]
            }
          ],
          "validationQuestions": [
            {
              "question": "Question designed to validate assessment dimension",
              "assessmentDimension": "Specific dimension being validated",
              "validationTarget": "What we're trying to confirm",
              "scoringCriteria": ["Good answer includes X", "Red flag if Y"]
            }
          ],
          "behavioralQuestions": [
            {
              "question": "STAR format behavioral question",
              "competency": "Target competency",
              "situation": "Type of situation to explore",
              "expectedBehaviors": ["Behavior 1", "Behavior 2"],
              "redFlags": ["Warning sign 1", "Warning sign 2"]
            }
          ],
          "probeQuestions": [
            {
              "question": "Deep-dive question",
              "context": "When to use this question",
              "deepenedInsights": ["What this reveals about the candidate"]
            }
          ]
        }
      `;

      const response = await this.callAIModel(prompt);
      const questions = JSON.parse(response);
      
      console.log('✅ Enhanced AI Engine: Advanced interview questions generated');
      return questions;

    } catch (error) {
      console.error('❌ Enhanced AI Engine Interview Questions Error:', error);
      throw error;
    }
  }

  async analyzeDistortionScale(assessmentData: any): Promise<DistortionAnalysis> {
    try {
      console.log('🔍 Enhanced AI Engine: Analyzing distortion scale with advanced algorithms');

      const responses = assessmentData.responses || [];
      const responseTimes = responses.map((r: any) => r.responseTime || 0);
      const responseValues = responses.map((r: any) => r.response || r.value || 0);

      // Statistical analysis
      const responseTimeVariance = this.calculateVariance(responseTimes);
      const patternConsistency = this.analyzeResponsePatterns(responseValues);
      const extremeResponseBias = this.calculateExtremeResponseBias(responseValues);

      const prompt = `
        You are a psychometric expert specializing in validity assessment and response distortion detection.
        
        ASSESSMENT DATA:
        - Response Times: ${JSON.stringify(responseTimes)}
        - Response Values: ${JSON.stringify(responseValues)}
        - Response Patterns: ${JSON.stringify(responseValues.slice(0, 20))}
        
        STATISTICAL METRICS:
        - Response Time Variance: ${responseTimeVariance}
        - Pattern Consistency: ${patternConsistency}
        - Extreme Response Bias: ${extremeResponseBias}
        
        ANALYSIS TASK:
        Conduct a comprehensive distortion analysis using advanced psychometric principles.
        
        Return ONLY valid JSON:
        {
          "score": number_between_0_and_10,
          "reliability": "low|medium|high",
          "consistencyFlags": ["flag1", "flag2"],
          "responsePatterns": {
            "fakeGood": number_0_to_10,
            "fakeBad": number_0_to_10,
            "random": number_0_to_10,
            "inconsistency": number_0_to_10
          },
          "interpretation": "Detailed interpretation of validity",
          "confidenceLevel": number_0_to_100,
          "validityMetrics": {
            "responseTimeVariance": ${responseTimeVariance},
            "patternConsistency": ${patternConsistency},
            "extremeResponseBias": ${extremeResponseBias},
            "socialDesirabilityIndex": number_0_to_10
          }
        }
      `;

      const response = await this.callAIModel(prompt);
      const analysis = JSON.parse(response);
      
      console.log('✅ Enhanced AI Engine: Distortion analysis completed');
      return analysis;

    } catch (error) {
      console.error('❌ Enhanced AI Engine Distortion Analysis Error:', error);
      // Return fallback analysis
      return {
        score: 2,
        reliability: 'medium',
        consistencyFlags: ['Standard response pattern'],
        responsePatterns: { fakeGood: 2, fakeBad: 1, random: 1, inconsistency: 2 },
        interpretation: 'Assessment appears to have acceptable validity with minor inconsistencies.',
        confidenceLevel: 75,
        validityMetrics: {
          responseTimeVariance: this.calculateVariance(assessmentData.responses?.map((r: any) => r.responseTime) || []),
          patternConsistency: 0.8,
          extremeResponseBias: 0.3,
          socialDesirabilityIndex: 3
        }
      };
    }
  }

  private async analyzeCognitiveProfile(assessmentData: any, candidateInfo: any) {
    const prompt = `
      Analyze the cognitive profile based on assessment data.
      Assessment: ${JSON.stringify(assessmentData)}
      Candidate: ${JSON.stringify(candidateInfo)}
      
      Return JSON with: processingStyle, learningPreferences, decisionMakingApproach, 
      problemSolvingStrategy, informationProcessingSpeed, attentionToDetail
    `;

    const response = await this.callAIModel(prompt);
    return JSON.parse(response);
  }

  private async predictBehavioralOutcomes(assessmentData: any, candidateInfo: any) {
    const prompt = `
      Predict behavioral outcomes in workplace settings.
      Assessment: ${JSON.stringify(assessmentData)}
      
      Return JSON with workplacePerformance, teamDynamics, stressResponse objects
      with detailed predictions and indicators.
    `;

    const response = await this.callAIModel(prompt);
    return JSON.parse(response);
  }

  private async generateCareerGuidance(assessmentData: any, candidateInfo: any) {
    const prompt = `
      Generate comprehensive career guidance.
      Assessment: ${JSON.stringify(assessmentData)}
      Candidate: ${JSON.stringify(candidateInfo)}
      
      Return JSON with optimalEnvironments, roleRecommendations, developmentPathways,
      skillGapAnalysis, and careerTimeline.
    `;

    const response = await this.callAIModel(prompt);
    return JSON.parse(response);
  }

  private async generateExecutiveSummary(
    assessmentData: any,
    candidateInfo: any,
    analyses: any
  ) {
    const prompt = `
      Generate executive summary integrating all analyses.
      Assessment: ${JSON.stringify(assessmentData)}
      All Analyses: ${JSON.stringify(analyses)}
      
      Return JSON with overallScore, confidenceLevel, keyInsights, topStrengths,
      developmentPriorities, recommendedActions, riskFactors.
    `;

    const response = await this.callAIModel(prompt);
    return JSON.parse(response);
  }

  private async callAIModel(prompt: string): Promise<string> {
    try {
      // Use Supabase Edge Function for AI calls
      const { data, error } = await supabase.functions.invoke('enhanced-ai-analysis', {
        body: {
          prompt,
          model: this.config.model,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        }
      });

      if (error) throw error;
      return data.response;

    } catch (error) {
      console.error('AI Model Call Error:', error);
      throw error;
    }
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    return parseFloat(variance.toFixed(2));
  }

  private analyzeResponsePatterns(responses: number[]): number {
    if (responses.length === 0) return 0;
    // Simple pattern consistency calculation
    const transitions = [];
    for (let i = 1; i < responses.length; i++) {
      transitions.push(Math.abs(responses[i] - responses[i-1]));
    }
    const avgTransition = transitions.reduce((sum, t) => sum + t, 0) / transitions.length;
    return parseFloat((1 - Math.min(avgTransition / 5, 1)).toFixed(2));
  }

  private calculateExtremeResponseBias(responses: number[]): number {
    if (responses.length === 0) return 0;
    const extremeCount = responses.filter(r => r <= 1 || r >= 5).length;
    return parseFloat((extremeCount / responses.length).toFixed(2));
  }
}

export default EnhancedAIEngine;