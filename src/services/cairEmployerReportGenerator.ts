import { AssessmentData, CandidateInfo } from '@/types/assessment.types';

export interface CAIREmployerInsights {
  dimensionAnalysis: CAIRDimensionAnalysis[];
  weaknessProbe: WeaknessAnalysis;
  interviewStrategy: InterviewStrategy;
  managementRecommendations: ManagementRecommendations;
  onboardingGuidance: OnboardingGuidance;
  performancePredicators: PerformancePredicators;
  culturalFit: CulturalFitAnalysis;
  developmentPlan: DevelopmentPlan;
}

export interface CAIRDimensionAnalysis {
  dimension: string;
  percentile: number;
  level: 'exceptional' | 'strong' | 'moderate' | 'developing' | 'concern';
  workplaceImplications: string[];
  behavioralIndicators: string[];
  strengthsInRole: string[];
  potentialChallenges: string[];
  managementTips: string[];
}

export interface WeaknessAnalysis {
  primaryWeaknesses: string[];
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
  developmentPriority: 'high' | 'medium' | 'low';
  timelineForImprovement: string;
}

export interface RiskFactor {
  area: string;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
  likelihood: string;
  impact: string;
  indicators: string[];
}

export interface InterviewStrategy {
  focusAreas: string[];
  targetedQuestions: TargetedQuestion[];
  redFlagQuestions: TargetedQuestion[];
  assessmentApproach: string;
  timeAllocation: Record<string, number>;
}

export interface TargetedQuestion {
  category: string;
  question: string;
  purpose: string;
  idealResponse: string;
  redFlags: string[];
  followUpQuestions: string[];
  scoringCriteria: string[];
}

export interface ManagementRecommendations {
  communicationStyle: string;
  motivationApproaches: string[];
  feedbackStrategy: string;
  taskAssignment: string;
  teamDynamics: string;
  conflictResolution: string;
  goalSetting: string;
}

export interface OnboardingGuidance {
  structureLevel: 'high' | 'medium' | 'low';
  mentoringNeeds: string[];
  trainingPriorities: string[];
  checkInFrequency: string;
  successMetrics: string[];
  potentialStruggles: string[];
  supportSystems: string[];
}

export interface PerformancePredicators {
  strengths: PerformanceArea[];
  challenges: PerformanceArea[];
  optimalConditions: string[];
  stressFactors: string[];
  motivators: string[];
  careerPath: CareerPathGuidance;
}

export interface PerformanceArea {
  area: string;
  likelihood: string;
  description: string;
  evidence: string[];
  timeline: string;
}

export interface CareerPathGuidance {
  naturalProgression: string[];
  skillGaps: string[];
  developmentAreas: string[];
  leadershipPotential: string;
  recommendedRoles: string[];
}

export interface CulturalFitAnalysis {
  bestEnvironments: string[];
  challenges: string[];
  teamRolePreference: string;
  leadershipStyle: string;
  adaptabilityScore: number;
  diversityStrengths: string[];
}

export interface DevelopmentPlan {
  shortTerm: DevelopmentGoal[];
  longTerm: DevelopmentGoal[];
  resources: string[];
  timeline: string;
  successMetrics: string[];
  checkpoints: string[];
}

export interface DevelopmentGoal {
  area: string;
  objective: string;
  actions: string[];
  timeline: string;
  resources: string[];
  measurableOutcomes: string[];
}

export class CAIREmployerReportGenerator {
  generateDetailedEmployerReport(assessmentData: AssessmentData, candidateInfo?: CandidateInfo): CAIREmployerInsights {
    const dimensionAnalysis = this.analyzeDimensions(assessmentData);
    const weaknessAnalysis = this.analyzeWeaknesses(dimensionAnalysis);
    const interviewStrategy = this.generateInterviewStrategy(dimensionAnalysis, weaknessAnalysis);
    
    return {
      dimensionAnalysis,
      weaknessProbe: weaknessAnalysis,
      interviewStrategy,
      managementRecommendations: this.generateManagementRecommendations(dimensionAnalysis),
      onboardingGuidance: this.generateOnboardingGuidance(dimensionAnalysis, weaknessAnalysis),
      performancePredicators: this.generatePerformancePredicators(dimensionAnalysis),
      culturalFit: this.analyzeCulturalFit(dimensionAnalysis),
      developmentPlan: this.generateDevelopmentPlan(dimensionAnalysis, weaknessAnalysis)
    };
  }

  private analyzeDimensions(assessmentData: AssessmentData): CAIRDimensionAnalysis[] {
    const dimensions = ['conscientiousness', 'agreeableness', 'innovation', 'resilience'];
    
    return dimensions.map(dimension => {
      const percentile = this.calculateDimensionPercentile(dimension, assessmentData);
      const level = this.getDimensionLevel(percentile);
      
      return {
        dimension,
        percentile,
        level,
        workplaceImplications: this.getWorkplaceImplications(dimension, level),
        behavioralIndicators: this.getBehavioralIndicators(dimension, level),
        strengthsInRole: this.getStrengthsInRole(dimension, level),
        potentialChallenges: this.getPotentialChallenges(dimension, level),
        managementTips: this.getManagementTips(dimension, level)
      };
    });
  }

  private calculateDimensionPercentile(dimension: string, assessmentData: AssessmentData): number {
    // Calculate percentile based on responses
    const dimensionResponses = assessmentData.responses.filter(r => 
      r.questionId.includes(dimension.substring(0, 4))
    );
    
    if (dimensionResponses.length === 0) return 50;
    
    const avgScore = dimensionResponses.reduce((sum, response) => {
      return sum + (response.answer === 'A' ? 100 : 0);
    }, 0) / dimensionResponses.length;
    
    return Math.round(avgScore);
  }

  private getDimensionLevel(percentile: number): CAIRDimensionAnalysis['level'] {
    if (percentile >= 85) return 'exceptional';
    if (percentile >= 70) return 'strong';
    if (percentile >= 45) return 'moderate';
    if (percentile >= 25) return 'developing';
    return 'concern';
  }

  private getWorkplaceImplications(dimension: string, level: CAIRDimensionAnalysis['level']): string[] {
    const implications: Record<string, Record<CAIRDimensionAnalysis['level'], string[]>> = {
      conscientiousness: {
        exceptional: [
          "Exceptionally reliable and detail-oriented; may be perfectionist",
          "Takes initiative in maintaining quality standards",
          "Likely to exceed deadlines and deliver error-free work",
          "May struggle with ambiguous or rapidly changing priorities"
        ],
        strong: [
          "Consistently meets deadlines and maintains quality",
          "Good at following procedures and maintaining standards",
          "Reliable team member for detailed tasks",
          "May occasionally struggle with extremely tight deadlines"
        ],
        moderate: [
          "Generally organized but may need structure and clear expectations",
          "Performance varies with workload and pressure",
          "Benefits from clear deadlines and regular check-ins",
          "May struggle with complex multi-tasking"
        ],
        developing: [
          "Requires significant structure and clear guidelines",
          "May miss deadlines without close supervision",
          "Benefits from task breakdown and frequent check-ins",
          "Likely to struggle with detail-oriented tasks"
        ],
        concern: [
          "High risk of missed deadlines and quality issues",
          "Requires constant supervision and structure",
          "May not be suitable for roles requiring precision",
          "Needs immediate coaching on organizational systems"
        ]
      },
      agreeableness: {
        exceptional: [
          "Exceptional team player but may avoid necessary conflicts",
          "Creates harmonious work environment",
          "May struggle with tough decisions affecting others",
          "Risk of being taken advantage of by colleagues"
        ],
        strong: [
          "Good collaborator and team member",
          "Handles interpersonal relationships well",
          "May occasionally avoid difficult conversations",
          "Generally supports team decisions"
        ],
        moderate: [
          "Balanced approach to collaboration and assertiveness",
          "Can work well in teams with clear roles",
          "May need coaching on conflict resolution",
          "Performance depends on team dynamics"
        ],
        developing: [
          "May struggle with team collaboration",
          "Could benefit from interpersonal skills training",
          "May appear aloof or unsupportive to colleagues",
          "Needs clear guidance on team expectations"
        ],
        concern: [
          "High risk of team conflicts and poor relationships",
          "May create negative work environment",
          "Requires immediate coaching on interpersonal skills",
          "Not suitable for customer-facing or team-dependent roles"
        ]
      },
      innovation: {
        exceptional: [
          "Thrives on creative problem-solving and new challenges",
          "May become bored with routine tasks",
          "Excellent for roles requiring innovation and adaptability",
          "May struggle with highly structured environments"
        ],
        strong: [
          "Good at finding creative solutions",
          "Adapts well to change and new challenges",
          "Brings fresh perspectives to team",
          "May need balance with routine responsibilities"
        ],
        moderate: [
          "Can handle both routine and creative tasks",
          "Adapts to change with some guidance",
          "Benefits from variety in work assignments",
          "May need encouragement to think outside the box"
        ],
        developing: [
          "Prefers structured, predictable work environment",
          "May struggle with ambiguous or changing requirements",
          "Benefits from clear processes and procedures",
          "Needs coaching on adaptability and creative thinking"
        ],
        concern: [
          "High resistance to change and new approaches",
          "May become overwhelmed by ambiguous situations",
          "Requires highly structured work environment",
          "Not suitable for roles requiring innovation"
        ]
      },
      resilience: {
        exceptional: [
          "Thrives under pressure and bounces back quickly from setbacks",
          "May take on too much responsibility",
          "Excellent for high-stress, fast-paced environments",
          "Risk of burnout if not managed properly"
        ],
        strong: [
          "Handles stress well and recovers from challenges",
          "Good candidate for leadership roles",
          "Maintains performance under pressure",
          "May need support during extreme stress periods"
        ],
        moderate: [
          "Generally handles normal stress levels",
          "May struggle with extended high-pressure periods",
          "Benefits from stress management support",
          "Performance may decline under significant pressure"
        ],
        developing: [
          "May struggle with stress and pressure",
          "Requires supportive work environment",
          "Benefits from stress management training",
          "May need reduced responsibility during difficult periods"
        ],
        concern: [
          "High risk of poor performance under any stress",
          "May require extensive support and accommodation",
          "Not suitable for high-pressure or demanding roles",
          "Needs immediate stress management intervention"
        ]
      }
    };

    return implications[dimension]?.[level] || ["Standard workplace expectations apply."];
  }

  private getBehavioralIndicators(dimension: string, level: CAIRDimensionAnalysis['level']): string[] {
    const indicators: Record<string, Record<CAIRDimensionAnalysis['level'], string[]>> = {
      conscientiousness: {
        exceptional: ["Always prepared", "Meticulous attention to detail", "Proactive planning", "May appear rigid"],
        strong: ["Usually prepared", "Good attention to detail", "Plans ahead", "Generally organized"],
        moderate: ["Sometimes prepared", "Variable attention to detail", "Plans when reminded", "Needs structure"],
        developing: ["Often unprepared", "Misses details", "Poor planning", "Disorganized"],
        concern: ["Rarely prepared", "Significant detail oversight", "No planning", "Chaotic approach"]
      },
      agreeableness: {
        exceptional: ["Always supportive", "Avoids conflict", "Puts others first", "May be passive"],
        strong: ["Usually supportive", "Manages conflict well", "Good team player", "Collaborative"],
        moderate: ["Situationally supportive", "Handles some conflict", "Team player when needed", "Selective collaboration"],
        developing: ["Sometimes supportive", "Struggles with conflict", "Limited teamwork", "Prefers individual work"],
        concern: ["Rarely supportive", "Creates conflict", "Poor teamwork", "Antagonistic behavior"]
      },
      innovation: {
        exceptional: ["Constantly generates ideas", "Embraces change", "Challenges status quo", "May disrupt processes"],
        strong: ["Regularly generates ideas", "Adapts to change", "Questions approaches", "Improves processes"],
        moderate: ["Occasionally generates ideas", "Adapts with guidance", "Follows established approaches", "Makes incremental improvements"],
        developing: ["Rarely generates ideas", "Resists change", "Strictly follows procedures", "Avoids new approaches"],
        concern: ["Never generates ideas", "Strongly resists change", "Inflexible", "Disrupts innovation efforts"]
      },
      resilience: {
        exceptional: ["Thrives under pressure", "Bounces back quickly", "Stays calm in crisis", "May take excessive risks"],
        strong: ["Handles pressure well", "Recovers from setbacks", "Maintains composure", "Generally optimistic"],
        moderate: ["Manages normal pressure", "Recovers with time", "Variable composure", "Needs support"],
        developing: ["Struggles with pressure", "Slow to recover", "Loses composure", "Requires significant support"],
        concern: ["Cannot handle pressure", "Doesn't recover well", "Frequent emotional reactions", "Requires constant support"]
      }
    };

    return indicators[dimension]?.[level] || ["Standard behavioral patterns expected."];
  }

  private getStrengthsInRole(dimension: string, level: CAIRDimensionAnalysis['level']): string[] {
    if (level === 'concern' || level === 'developing') return [];
    
    const strengths: Record<string, string[]> = {
      conscientiousness: ["Quality control", "Project management", "Process improvement", "Compliance roles"],
      agreeableness: ["Team leadership", "Customer service", "Conflict mediation", "Collaborative projects"],
      innovation: ["Product development", "Problem solving", "Change management", "Strategic planning"],
      resilience: ["Crisis management", "High-pressure environments", "Leadership roles", "Challenging assignments"]
    };

    return strengths[dimension] || [];
  }

  private getPotentialChallenges(dimension: string, level: CAIRDimensionAnalysis['level']): string[] {
    const challenges: Record<string, Record<CAIRDimensionAnalysis['level'], string[]>> = {
      conscientiousness: {
        exceptional: ["May be inflexible with changing requirements", "Could slow down team with perfectionism"],
        strong: ["May struggle with very tight deadlines", "Could be frustrated by disorganized teammates"],
        moderate: ["Needs clear structure and expectations", "May struggle with complex multitasking"],
        developing: ["Requires close supervision", "May miss important deadlines"],
        concern: ["High risk of performance failures", "May not be suitable for detail-oriented work"]
      },
      agreeableness: {
        exceptional: ["May avoid necessary confrontations", "Could be taken advantage of"],
        strong: ["May struggle with tough personnel decisions", "Could avoid difficult conversations"],
        moderate: ["May need coaching on assertiveness", "Could struggle in competitive environments"],
        developing: ["May create team friction", "Could struggle with customer interactions"],
        concern: ["High risk of interpersonal conflicts", "May damage team morale"]
      },
      innovation: {
        exceptional: ["May disrupt stable processes unnecessarily", "Could become bored with routine work"],
        strong: ["May struggle with highly regulated environments", "Could be impatient with slow change"],
        moderate: ["May need encouragement to think creatively", "Could resist significant changes"],
        developing: ["May struggle with ambiguous situations", "Could resist new technologies or processes"],
        concern: ["May obstruct innovation initiatives", "Could become obsolete in changing environments"]
      },
      resilience: {
        exceptional: ["May take on too much stress", "Could burnout if not managed"],
        strong: ["May need support during extreme stress", "Could underestimate others' stress levels"],
        moderate: ["May struggle with extended pressure", "Could need stress management support"],
        developing: ["May require accommodations for stress", "Could struggle in demanding environments"],
        concern: ["High risk of stress-related performance issues", "May need extensive support systems"]
      }
    };

    return challenges[dimension]?.[level] || [];
  }

  private getManagementTips(dimension: string, level: CAIRDimensionAnalysis['level']): string[] {
    const tips: Record<string, Record<CAIRDimensionAnalysis['level'], string[]>> = {
      conscientiousness: {
        exceptional: ["Provide clear priorities to prevent over-perfection", "Set realistic deadlines", "Use their standards to mentor others"],
        strong: ["Give them ownership of quality initiatives", "Provide adequate time for thorough work", "Use as a mentor for detail-oriented tasks"],
        moderate: ["Provide clear structures and deadlines", "Regular check-ins on progress", "Break complex tasks into smaller steps"],
        developing: ["Implement daily/weekly check-ins", "Provide detailed templates and checklists", "Pair with highly organized team members"],
        concern: ["Constant supervision required", "Not suitable for independent work", "Consider role reassignment"]
      },
      agreeableness: {
        exceptional: ["Encourage assertiveness training", "Support them in difficult conversations", "Use their team-building skills"],
        strong: ["Leverage their collaboration skills", "Provide coaching on assertiveness", "Use as team harmony facilitator"],
        moderate: ["Provide clear guidelines for team interactions", "Coach on conflict resolution", "Set expectations for collaboration"],
        developing: ["Provide interpersonal skills training", "Set clear behavioral expectations", "Monitor team dynamics closely"],
        concern: ["Immediate intervention required", "Consider team separation", "Not suitable for team-dependent work"]
      },
      innovation: {
        exceptional: ["Channel creativity into appropriate projects", "Provide variety in assignments", "Use as change agent"],
        strong: ["Give them innovation projects", "Allow flexibility in approach", "Use their ideas to improve processes"],
        moderate: ["Encourage creative thinking", "Provide balance of routine and varied work", "Support with change management"],
        developing: ["Provide clear processes", "Gradual introduction to changes", "Support with adaptation"],
        concern: ["Highly structured environment required", "Avoid roles requiring adaptability", "Provide extensive change support"]
      },
      resilience: {
        exceptional: ["Monitor for burnout signs", "Ensure work-life balance", "Use for crisis situations"],
        strong: ["Give them challenging assignments", "Use as mentor for others", "Provide leadership opportunities"],
        moderate: ["Monitor stress levels", "Provide stress management resources", "Ensure adequate support"],
        developing: ["Create supportive environment", "Provide stress management training", "Regular wellness check-ins"],
        concern: ["Minimize stress factors", "Provide extensive support", "Consider role modification"]
      }
    };

    return tips[dimension]?.[level] || [];
  }

  private analyzeWeaknesses(dimensionAnalysis: CAIRDimensionAnalysis[]): WeaknessAnalysis {
    const weakDimensions = dimensionAnalysis.filter(d => 
      d.level === 'concern' || d.level === 'developing'
    );

    const primaryWeaknesses = weakDimensions.map(d => d.dimension);
    const riskFactors: RiskFactor[] = this.generateRiskFactors(weakDimensions);
    
    const developmentPriority = weakDimensions.some(d => d.level === 'concern') ? 'high' :
                              weakDimensions.length > 1 ? 'medium' : 'low';

    return {
      primaryWeaknesses,
      riskFactors,
      mitigationStrategies: this.generateMitigationStrategies(weakDimensions),
      developmentPriority,
      timelineForImprovement: this.getImprovementTimeline(developmentPriority)
    };
  }

  private generateRiskFactors(weakDimensions: CAIRDimensionAnalysis[]): RiskFactor[] {
    return weakDimensions.map(dimension => ({
      area: dimension.dimension,
      riskLevel: dimension.level === 'concern' ? 'high' : 'medium',
      description: this.getRiskDescription(dimension.dimension, dimension.level),
      likelihood: dimension.level === 'concern' ? 'Very High' : 'Moderate',
      impact: this.getRiskImpact(dimension.dimension),
      indicators: this.getRiskIndicators(dimension.dimension, dimension.level)
    }));
  }

  private getRiskDescription(dimension: string, level: CAIRDimensionAnalysis['level']): string {
    const descriptions: Record<string, string> = {
      conscientiousness: "Risk of missed deadlines, quality issues, and poor organization leading to project failures",
      agreeableness: "Risk of team conflicts, poor collaboration, and negative impact on workplace culture",
      innovation: "Risk of resistance to change, inability to adapt to new processes, and limited problem-solving capability",
      resilience: "Risk of poor performance under pressure, frequent absences, and potential burnout"
    };

    return descriptions[dimension] || "Performance risk in this area";
  }

  private getRiskImpact(dimension: string): string {
    const impacts: Record<string, string> = {
      conscientiousness: "High - Affects quality, deadlines, and team reliability",
      agreeableness: "Medium-High - Affects team dynamics and customer relationships",
      innovation: "Medium - Affects adaptability and growth potential",
      resilience: "High - Affects performance consistency and stress management"
    };

    return impacts[dimension] || "Medium impact expected";
  }

  private getRiskIndicators(dimension: string, level: CAIRDimensionAnalysis['level']): string[] {
    const indicators: Record<string, string[]> = {
      conscientiousness: ["Missed deadlines", "Quality errors", "Disorganized workspace", "Forgetting commitments"],
      agreeableness: ["Team conflicts", "Customer complaints", "Isolation from colleagues", "Resistance to collaboration"],
      innovation: ["Resistance to new processes", "Complaints about changes", "Rigid thinking patterns", "Avoiding challenges"],
      resilience: ["Stress reactions", "Performance drops under pressure", "Frequent sick days", "Emotional outbursts"]
    };

    return indicators[dimension] || [];
  }

  private generateMitigationStrategies(weakDimensions: CAIRDimensionAnalysis[]): string[] {
    const strategies: string[] = [];
    
    weakDimensions.forEach(dimension => {
      switch (dimension.dimension) {
        case 'conscientiousness':
          strategies.push(
            "Implement detailed project management systems and regular check-ins",
            "Provide organizational tools and training",
            "Assign a detail-oriented mentor or buddy system"
          );
          break;
        case 'agreeableness':
          strategies.push(
            "Provide interpersonal skills and emotional intelligence training",
            "Implement clear team collaboration guidelines",
            "Regular team building activities and feedback sessions"
          );
          break;
        case 'innovation':
          strategies.push(
            "Gradual introduction to change with extensive support",
            "Provide clear rationale for new processes and changes",
            "Assign to innovation mentor and encourage creative thinking exercises"
          );
          break;
        case 'resilience':
          strategies.push(
            "Implement stress management and wellness programs",
            "Provide supportive work environment with clear expectations",
            "Regular check-ins and mental health resources"
          );
          break;
      }
    });

    return strategies;
  }

  private getImprovementTimeline(priority: WeaknessAnalysis['developmentPriority']): string {
    switch (priority) {
      case 'high': return "3-6 months with intensive support";
      case 'medium': return "6-12 months with regular coaching";
      case 'low': return "12-18 months with periodic development";
      default: return "Timeline varies based on individual progress";
    }
  }

  private generateInterviewStrategy(
    dimensionAnalysis: CAIRDimensionAnalysis[], 
    weaknessAnalysis: WeaknessAnalysis
  ): InterviewStrategy {
    const focusAreas = weaknessAnalysis.primaryWeaknesses.concat(
      dimensionAnalysis.filter(d => d.level === 'moderate').map(d => d.dimension)
    );

    return {
      focusAreas,
      targetedQuestions: this.generateTargetedQuestions(dimensionAnalysis),
      redFlagQuestions: this.generateRedFlagQuestions(weaknessAnalysis),
      assessmentApproach: this.getAssessmentApproach(weaknessAnalysis.developmentPriority),
      timeAllocation: this.getTimeAllocation(focusAreas)
    };
  }

  private generateTargetedQuestions(dimensionAnalysis: CAIRDimensionAnalysis[]): TargetedQuestion[] {
    const questions: TargetedQuestion[] = [];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'concern' || dimension.level === 'developing') {
        questions.push(...this.getWeaknessProbeQuestions(dimension));
      }
    });

    return questions;
  }

  private getWeaknessProbeQuestions(dimension: CAIRDimensionAnalysis): TargetedQuestion[] {
    const questionSets: Record<string, TargetedQuestion[]> = {
      conscientiousness: [
        {
          category: "Organization & Planning",
          question: "Walk me through how you typically plan and organize a complex project with multiple deadlines.",
          purpose: "Assess organizational skills and planning approach",
          idealResponse: "Systematic approach with clear steps, timeline, and contingency planning",
          redFlags: ["No clear system", "Relies on others for organization", "Admits to frequent missed deadlines"],
          followUpQuestions: [
            "How do you handle when priorities change mid-project?",
            "Tell me about a time when your organization system failed you.",
            "How do you ensure you don't miss important details?"
          ],
          scoringCriteria: ["Clear methodology", "Evidence of systematic thinking", "Self-awareness of strengths/weaknesses"]
        },
        {
          category: "Quality & Attention to Detail",
          question: "Describe a situation where attention to detail was critical. How did you ensure accuracy?",
          purpose: "Evaluate detail orientation and quality focus",
          idealResponse: "Specific examples of quality control measures and systematic checking",
          redFlags: ["Casual attitude toward errors", "No quality control system", "Blames others for mistakes"],
          followUpQuestions: [
            "What happens when you're under time pressure?",
            "How do you catch your own mistakes?",
            "Tell me about a time when you missed an important detail."
          ],
          scoringCriteria: ["Quality consciousness", "Personal accountability", "Systematic approach to accuracy"]
        }
      ],
      agreeableness: [
        {
          category: "Conflict Resolution",
          question: "Tell me about a time when you had to deal with a difficult team member or customer.",
          purpose: "Assess interpersonal skills and conflict management",
          idealResponse: "Constructive approach to conflict with specific resolution strategies",
          redFlags: ["Avoids conflict entirely", "Becomes confrontational", "Blames the other person"],
          followUpQuestions: [
            "How do you handle criticism or negative feedback?",
            "Describe a time when you had to deliver bad news to someone.",
            "How do you build relationships with people you don't naturally get along with?"
          ],
          scoringCriteria: ["Emotional intelligence", "Constructive approach", "Self-awareness"]
        },
        {
          category: "Team Collaboration",
          question: "Give me an example of when you had to work closely with a team to achieve a goal.",
          purpose: "Evaluate collaboration skills and team orientation",
          idealResponse: "Clear examples of positive team contribution and mutual support",
          redFlags: ["Focuses only on own contributions", "Criticizes team members", "Prefers to work alone"],
          followUpQuestions: [
            "How do you handle when team members aren't pulling their weight?",
            "Describe your role in team decision-making.",
            "Tell me about a time when you had to compromise for the team's benefit."
          ],
          scoringCriteria: ["Team mindset", "Collaborative approach", "Mutual respect"]
        }
      ],
      innovation: [
        {
          category: "Adaptability",
          question: "Tell me about a time when you had to adapt to a significant change in your work environment or processes.",
          purpose: "Assess adaptability and openness to change",
          idealResponse: "Positive attitude toward change with specific adaptation strategies",
          redFlags: ["Strong resistance to change", "Negative attitude", "Inability to see benefits"],
          followUpQuestions: [
            "How do you typically react when established processes are changed?",
            "Describe a time when you suggested an improvement to an existing process.",
            "How do you handle ambiguous or unclear situations?"
          ],
          scoringCriteria: ["Change acceptance", "Flexibility", "Growth mindset"]
        },
        {
          category: "Problem Solving",
          question: "Describe a situation where you had to solve a problem with no clear solution or precedent.",
          purpose: "Evaluate creative thinking and problem-solving approach",
          idealResponse: "Systematic approach to ambiguous problems with creative solutions",
          redFlags: ["Waits for others to solve problems", "Only follows established procedures", "Gives up easily"],
          followUpQuestions: [
            "How do you approach learning new skills or technologies?",
            "Tell me about a time when your first solution didn't work.",
            "How do you generate new ideas or approaches?"
          ],
          scoringCriteria: ["Creative thinking", "Persistence", "Learning orientation"]
        }
      ],
      resilience: [
        {
          category: "Stress Management",
          question: "Tell me about the most stressful period in your work experience and how you handled it.",
          purpose: "Assess stress tolerance and coping mechanisms",
          idealResponse: "Healthy coping strategies and maintained performance under stress",
          redFlags: ["Avoided stressful situations", "Performance significantly declined", "No coping strategies"],
          followUpQuestions: [
            "How do you recognize when you're becoming overwhelmed?",
            "What support systems do you rely on during difficult times?",
            "Describe how you maintain work-life balance during busy periods."
          ],
          scoringCriteria: ["Self-awareness", "Coping strategies", "Performance maintenance"]
        },
        {
          category: "Recovery & Growth",
          question: "Tell me about a significant failure or setback in your career and how you bounced back.",
          purpose: "Evaluate resilience and learning from failure",
          idealResponse: "Demonstrates learning from failure and positive recovery",
          redFlags: ["Dwells on failures", "Blames others", "Doesn't learn from mistakes"],
          followUpQuestions: [
            "How do you handle criticism or negative performance reviews?",
            "What motivates you to keep going when things get tough?",
            "How has failure helped you grow professionally?"
          ],
          scoringCriteria: ["Growth mindset", "Personal accountability", "Recovery ability"]
        }
      ]
    };

    return questionSets[dimension.dimension] || [];
  }

  private generateRedFlagQuestions(weaknessAnalysis: WeaknessAnalysis): TargetedQuestion[] {
    return weaknessAnalysis.riskFactors.map(risk => ({
      category: `Red Flag Assessment - ${risk.area}`,
      question: this.getRedFlagQuestion(risk.area),
      purpose: `Identify potential red flags in ${risk.area}`,
      idealResponse: "Honest acknowledgment with demonstrated self-awareness and improvement efforts",
      redFlags: risk.indicators,
      followUpQuestions: [
        "How would your previous supervisors describe your performance in this area?",
        "What steps have you taken to improve in this area?",
        "How would you handle this challenge in our work environment?"
      ],
      scoringCriteria: ["Honesty", "Self-awareness", "Improvement mindset"]
    }));
  }

  private getRedFlagQuestion(area: string): string {
    const questions: Record<string, string> = {
      conscientiousness: "Have you ever missed an important deadline or made a significant error due to poor organization? How did you handle it?",
      agreeableness: "Describe a time when you had significant conflict with a coworker or supervisor. What was your role in the situation?",
      innovation: "Tell me about a time when you strongly disagreed with a change in your workplace. How did you respond?",
      resilience: "Have you ever felt overwhelmed at work to the point where it affected your performance? What happened?"
    };

    return questions[area] || "Describe a challenging situation in this area.";
  }

  private getAssessmentApproach(priority: WeaknessAnalysis['developmentPriority']): string {
    switch (priority) {
      case 'high':
        return "Deep behavioral interviewing focusing on specific examples, multiple scenario questions, and behavioral consistency assessment. Consider role play or practical exercises.";
      case 'medium':
        return "Targeted behavioral questions with follow-up probes, reference checks focusing on weak areas, and scenario-based questions.";
      case 'low':
        return "Standard behavioral interviewing with some targeted questions in areas of concern. Focus on growth potential and trainability.";
      default:
        return "Standard comprehensive interview approach.";
    }
  }

  private getTimeAllocation(focusAreas: string[]): Record<string, number> {
    const baseTime = 60; // minutes
    const timePerFocus = Math.floor(baseTime * 0.7 / focusAreas.length);
    
    const allocation: Record<string, number> = {
      "Opening/Rapport": 5,
      "Experience Review": 10,
      "Closing/Questions": 10
    };

    focusAreas.forEach(area => {
      allocation[area] = timePerFocus;
    });

    return allocation;
  }

  private generateManagementRecommendations(dimensionAnalysis: CAIRDimensionAnalysis[]): ManagementRecommendations {
    // Implementation for management recommendations
    return {
      communicationStyle: this.getCommunicationStyle(dimensionAnalysis),
      motivationApproaches: this.getMotivationApproaches(dimensionAnalysis),
      feedbackStrategy: this.getFeedbackStrategy(dimensionAnalysis),
      taskAssignment: this.getTaskAssignment(dimensionAnalysis),
      teamDynamics: this.getTeamDynamics(dimensionAnalysis),
      conflictResolution: this.getConflictResolution(dimensionAnalysis),
      goalSetting: this.getGoalSetting(dimensionAnalysis)
    };
  }

  private getCommunicationStyle(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const agreeable = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    const conscious = dimensionAnalysis.find(d => d.dimension === 'conscientiousness');
    
    if (agreeable?.level === 'concern' || agreeable?.level === 'developing') {
      return "Direct, clear communication with written follow-up. Focus on facts and avoid emotional language.";
    }
    if (conscious?.level === 'concern' || conscious?.level === 'developing') {
      return "Very structured communication with detailed written instructions and regular check-ins.";
    }
    return "Balanced communication style with regular feedback and clear expectations.";
  }

  private getMotivationApproaches(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const approaches: string[] = [];
    
    dimensionAnalysis.forEach(dimension => {
      switch (dimension.dimension) {
        case 'conscientiousness':
          if (dimension.level === 'strong' || dimension.level === 'exceptional') {
            approaches.push("Recognition for quality work and attention to detail");
          } else {
            approaches.push("Clear structure and achievable milestones");
          }
          break;
        case 'agreeableness':
          if (dimension.level === 'strong' || dimension.level === 'exceptional') {
            approaches.push("Team recognition and collaborative goals");
          } else {
            approaches.push("Individual goals and personal development opportunities");
          }
          break;
        case 'innovation':
          if (dimension.level === 'strong' || dimension.level === 'exceptional') {
            approaches.push("Creative challenges and autonomy in approach");
          } else {
            approaches.push("Clear processes with gradual increased responsibility");
          }
          break;
        case 'resilience':
          if (dimension.level === 'strong' || dimension.level === 'exceptional') {
            approaches.push("Challenging assignments and leadership opportunities");
          } else {
            approaches.push("Supportive environment with stress management resources");
          }
          break;
      }
    });

    return approaches;
  }

  private getFeedbackStrategy(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const agreeable = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    const resilient = dimensionAnalysis.find(d => d.dimension === 'resilience');
    
    if (agreeable?.level === 'exceptional' || agreeable?.level === 'strong') {
      return "Gentle, constructive feedback with emphasis on growth and support. Private settings preferred.";
    }
    if (resilient?.level === 'developing' || resilient?.level === 'concern') {
      return "Very supportive feedback approach with focus on strengths first, then gentle improvement areas.";
    }
    return "Direct, honest feedback with specific examples and clear improvement plans.";
  }

  private getTaskAssignment(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const conscious = dimensionAnalysis.find(d => d.dimension === 'conscientiousness');
    const innovative = dimensionAnalysis.find(d => d.dimension === 'innovation');
    
    let strategy = "Balanced mix of routine and varied tasks. ";
    
    if (conscious?.level === 'concern' || conscious?.level === 'developing') {
      strategy += "Start with simple, clearly defined tasks with detailed instructions. ";
    }
    if (innovative?.level === 'concern' || innovative?.level === 'developing') {
      strategy += "Provide structured, predictable assignments with clear procedures.";
    } else if (innovative?.level === 'strong' || innovative?.level === 'exceptional') {
      strategy += "Include creative projects and varied challenges to maintain engagement.";
    }
    
    return strategy;
  }

  private getTeamDynamics(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const agreeable = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    
    if (agreeable?.level === 'concern' || agreeable?.level === 'developing') {
      return "May work better in smaller teams or independent roles. Monitor team interactions closely.";
    }
    if (agreeable?.level === 'exceptional') {
      return "Excellent team player but may need coaching on assertiveness and healthy conflict.";
    }
    return "Good team member with standard team interaction expectations.";
  }

  private getConflictResolution(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const agreeable = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    const resilient = dimensionAnalysis.find(d => d.dimension === 'resilience');
    
    if (agreeable?.level === 'concern' || agreeable?.level === 'developing') {
      return "May require mediation support and conflict resolution training. Address issues early.";
    }
    if (resilient?.level === 'developing' || resilient?.level === 'concern') {
      return "Handle conflicts gently with support person present. Focus on solutions rather than problems.";
    }
    return "Standard conflict resolution approach with direct communication and problem-solving focus.";
  }

  private getGoalSetting(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const conscious = dimensionAnalysis.find(d => d.dimension === 'conscientiousness');
    
    if (conscious?.level === 'concern' || conscious?.level === 'developing') {
      return "Set very specific, measurable goals with frequent check-ins and clear deadlines.";
    }
    if (conscious?.level === 'exceptional') {
      return "Can handle complex, long-term goals. May need help prioritizing to avoid over-commitment.";
    }
    return "Standard SMART goal setting with regular progress reviews.";
  }

  private generateOnboardingGuidance(
    dimensionAnalysis: CAIRDimensionAnalysis[], 
    weaknessAnalysis: WeaknessAnalysis
  ): OnboardingGuidance {
    const structureLevel = weaknessAnalysis.developmentPriority === 'high' ? 'high' : 
                          weaknessAnalysis.developmentPriority === 'medium' ? 'medium' : 'low';

    return {
      structureLevel,
      mentoringNeeds: this.getMentoringNeeds(dimensionAnalysis),
      trainingPriorities: this.getTrainingPriorities(weaknessAnalysis),
      checkInFrequency: this.getCheckInFrequency(weaknessAnalysis.developmentPriority),
      successMetrics: this.getSuccessMetrics(dimensionAnalysis),
      potentialStruggles: this.getPotentialStruggles(weaknessAnalysis),
      supportSystems: this.getSupportSystems(dimensionAnalysis, weaknessAnalysis)
    };
  }

  private getMentoringNeeds(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const needs: string[] = [];
    
    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'concern' || dimension.level === 'developing') {
        switch (dimension.dimension) {
          case 'conscientiousness':
            needs.push("Organization and time management mentor");
            break;
          case 'agreeableness':
            needs.push("Interpersonal skills and communication mentor");
            break;
          case 'innovation':
            needs.push("Change management and adaptability coach");
            break;
          case 'resilience':
            needs.push("Stress management and wellness support");
            break;
        }
      }
    });

    return needs;
  }

  private getTrainingPriorities(weaknessAnalysis: WeaknessAnalysis): string[] {
    return weaknessAnalysis.primaryWeaknesses.map(weakness => {
      const trainingMap: Record<string, string> = {
        conscientiousness: "Project management and organizational systems training",
        agreeableness: "Interpersonal skills and emotional intelligence training",
        innovation: "Change management and creative problem-solving training",
        resilience: "Stress management and wellness training"
      };
      
      return trainingMap[weakness] || `${weakness} development training`;
    });
  }

  private getCheckInFrequency(priority: WeaknessAnalysis['developmentPriority']): string {
    switch (priority) {
      case 'high': return "Daily for first week, then weekly for first month";
      case 'medium': return "Weekly for first month, then bi-weekly";
      case 'low': return "Weekly for first two weeks, then monthly";
      default: return "Standard bi-weekly check-ins";
    }
  }

  private getSuccessMetrics(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const metrics: string[] = [
      "Completion of assigned tasks within deadlines",
      "Positive feedback from team members and supervisor",
      "Demonstration of improvement in weak areas"
    ];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'concern' || dimension.level === 'developing') {
        switch (dimension.dimension) {
          case 'conscientiousness':
            metrics.push("Zero missed deadlines in first 90 days");
            break;
          case 'agreeableness':
            metrics.push("Positive team collaboration feedback");
            break;
          case 'innovation':
            metrics.push("Successful adaptation to at least one new process");
            break;
          case 'resilience':
            metrics.push("Consistent performance during stressful periods");
            break;
        }
      }
    });

    return metrics;
  }

  private getPotentialStruggles(weaknessAnalysis: WeaknessAnalysis): string[] {
    return weaknessAnalysis.riskFactors.map(risk => 
      `${risk.area}: ${risk.description}`
    );
  }

  private getSupportSystems(
    dimensionAnalysis: CAIRDimensionAnalysis[], 
    weaknessAnalysis: WeaknessAnalysis
  ): string[] {
    const supports: string[] = [
      "Regular supervisor check-ins",
      "Assigned buddy/mentor system"
    ];

    if (weaknessAnalysis.developmentPriority === 'high') {
      supports.push(
        "HR support for development planning",
        "External coaching if needed",
        "Access to relevant training resources"
      );
    }

    return supports;
  }

  private generatePerformancePredicators(dimensionAnalysis: CAIRDimensionAnalysis[]): PerformancePredicators {
    const strengths: PerformanceArea[] = [];
    const challenges: PerformanceArea[] = [];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'strong' || dimension.level === 'exceptional') {
        strengths.push({
          area: dimension.dimension,
          likelihood: dimension.level === 'exceptional' ? 'Very High' : 'High',
          description: `Strong performance expected in ${dimension.dimension} related tasks`,
          evidence: dimension.strengthsInRole,
          timeline: "Immediate"
        });
      }

      if (dimension.level === 'concern' || dimension.level === 'developing') {
        challenges.push({
          area: dimension.dimension,
          likelihood: dimension.level === 'concern' ? 'Very High' : 'High',
          description: `Performance challenges likely in ${dimension.dimension} related tasks`,
          evidence: dimension.potentialChallenges,
          timeline: "Within first 90 days"
        });
      }
    });

    return {
      strengths,
      challenges,
      optimalConditions: this.getOptimalConditions(dimensionAnalysis),
      stressFactors: this.getStressFactors(dimensionAnalysis),
      motivators: this.getMotivators(dimensionAnalysis),
      careerPath: this.getCareerPathGuidance(dimensionAnalysis)
    };
  }

  private getOptimalConditions(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const conditions: string[] = [];

    dimensionAnalysis.forEach(dimension => {
      switch (dimension.dimension) {
        case 'conscientiousness':
          if (dimension.level === 'developing' || dimension.level === 'concern') {
            conditions.push("Highly structured environment with clear procedures");
          }
          break;
        case 'agreeableness':
          if (dimension.level === 'developing' || dimension.level === 'concern') {
            conditions.push("Supportive team environment with minimal conflict");
          }
          break;
        case 'innovation':
          if (dimension.level === 'developing' || dimension.level === 'concern') {
            conditions.push("Stable environment with predictable processes");
          } else if (dimension.level === 'strong' || dimension.level === 'exceptional') {
            conditions.push("Dynamic environment with opportunities for creativity");
          }
          break;
        case 'resilience':
          if (dimension.level === 'developing' || dimension.level === 'concern') {
            conditions.push("Low-stress environment with strong support systems");
          }
          break;
      }
    });

    return conditions;
  }

  private getStressFactors(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const stressors: string[] = [];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'developing' || dimension.level === 'concern') {
        switch (dimension.dimension) {
          case 'conscientiousness':
            stressors.push("Complex multi-tasking", "Ambiguous deadlines", "Disorganized environments");
            break;
          case 'agreeableness':
            stressors.push("Team conflicts", "Competitive environments", "Difficult customers");
            break;
          case 'innovation':
            stressors.push("Frequent changes", "Ambiguous situations", "Pressure to innovate");
            break;
          case 'resilience':
            stressors.push("High-pressure deadlines", "Criticism", "Overwhelming workloads");
            break;
        }
      }
    });

    return stressors;
  }

  private getMotivators(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const motivators: string[] = [];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'strong' || dimension.level === 'exceptional') {
        switch (dimension.dimension) {
          case 'conscientiousness':
            motivators.push("Quality recognition", "Detail-oriented projects", "Process improvement opportunities");
            break;
          case 'agreeableness':
            motivators.push("Team success", "Collaborative projects", "Helping others");
            break;
          case 'innovation':
            motivators.push("Creative challenges", "New technologies", "Problem-solving opportunities");
            break;
          case 'resilience':
            motivators.push("Challenging goals", "Leadership opportunities", "Crisis management roles");
            break;
        }
      }
    });

    return motivators;
  }

  private getCareerPathGuidance(dimensionAnalysis: CAIRDimensionAnalysis[]): CareerPathGuidance {
    const strengths = dimensionAnalysis.filter(d => d.level === 'strong' || d.level === 'exceptional');
    const weaknesses = dimensionAnalysis.filter(d => d.level === 'developing' || d.level === 'concern');

    return {
      naturalProgression: this.getNaturalProgression(strengths),
      skillGaps: weaknesses.map(w => w.dimension),
      developmentAreas: weaknesses.map(w => `${w.dimension} improvement`),
      leadershipPotential: this.getLeadershipPotential(dimensionAnalysis),
      recommendedRoles: this.getRecommendedRoles(strengths, weaknesses)
    };
  }

  private getNaturalProgression(strengths: CAIRDimensionAnalysis[]): string[] {
    const progressions: string[] = [];

    strengths.forEach(strength => {
      switch (strength.dimension) {
        case 'conscientiousness':
          progressions.push("Quality assurance roles", "Project management", "Process improvement specialist");
          break;
        case 'agreeableness':
          progressions.push("Team leadership", "Customer relations", "Human resources");
          break;
        case 'innovation':
          progressions.push("Product development", "Strategy roles", "Change management");
          break;
        case 'resilience':
          progressions.push("Crisis management", "Senior leadership", "High-pressure roles");
          break;
      }
    });

    return progressions;
  }

  private getLeadershipPotential(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const resilience = dimensionAnalysis.find(d => d.dimension === 'resilience');
    const agreeableness = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    const innovation = dimensionAnalysis.find(d => d.dimension === 'innovation');

    if (resilience?.level === 'strong' || resilience?.level === 'exceptional') {
      if (agreeableness?.level === 'strong' || agreeableness?.level === 'exceptional') {
        return "High leadership potential - good balance of resilience and people skills";
      }
      return "Moderate leadership potential - strong under pressure but may need interpersonal development";
    }

    if (resilience?.level === 'developing' || resilience?.level === 'concern') {
      return "Limited leadership potential - needs significant development in stress management";
    }

    return "Moderate leadership potential with targeted development";
  }

  private getRecommendedRoles(
    strengths: CAIRDimensionAnalysis[], 
    weaknesses: CAIRDimensionAnalysis[]
  ): string[] {
    const roles: string[] = [];

    // If too many weaknesses, recommend supportive roles
    if (weaknesses.length >= 3) {
      roles.push("Individual contributor roles", "Highly structured positions", "Supportive team environments");
      return roles;
    }

    // Recommend based on strengths
    const strengthAreas = strengths.map(s => s.dimension);

    if (strengthAreas.includes('conscientiousness') && strengthAreas.includes('agreeableness')) {
      roles.push("Project coordination", "Quality assurance", "Customer success");
    }

    if (strengthAreas.includes('innovation') && strengthAreas.includes('resilience')) {
      roles.push("Product development", "Strategic planning", "Change management");
    }

    if (strengthAreas.includes('agreeableness') && strengthAreas.includes('resilience')) {
      roles.push("Team leadership", "Account management", "HR business partner");
    }

    return roles.length > 0 ? roles : ["Standard professional roles with appropriate support"];
  }

  private analyzeCulturalFit(dimensionAnalysis: CAIRDimensionAnalysis[]): CulturalFitAnalysis {
    return {
      bestEnvironments: this.getBestEnvironments(dimensionAnalysis),
      challenges: this.getCulturalChallenges(dimensionAnalysis),
      teamRolePreference: this.getTeamRolePreference(dimensionAnalysis),
      leadershipStyle: this.getLeadershipStyle(dimensionAnalysis),
      adaptabilityScore: this.getAdaptabilityScore(dimensionAnalysis),
      diversityStrengths: this.getDiversityStrengths(dimensionAnalysis)
    };
  }

  private getBestEnvironments(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const environments: string[] = [];

    const innovation = dimensionAnalysis.find(d => d.dimension === 'innovation');
    const conscientiousness = dimensionAnalysis.find(d => d.dimension === 'conscientiousness');
    const agreeableness = dimensionAnalysis.find(d => d.dimension === 'agreeableness');

    if (innovation?.level === 'strong' || innovation?.level === 'exceptional') {
      environments.push("Dynamic, fast-paced environments", "Startup culture", "Innovation-focused companies");
    } else if (innovation?.level === 'developing' || innovation?.level === 'concern') {
      environments.push("Stable, established organizations", "Structured corporate environments", "Process-driven companies");
    }

    if (conscientiousness?.level === 'strong' || conscientiousness?.level === 'exceptional') {
      environments.push("Quality-focused organizations", "Regulated industries", "Detail-oriented cultures");
    }

    if (agreeableness?.level === 'strong' || agreeableness?.level === 'exceptional') {
      environments.push("Collaborative cultures", "Team-oriented organizations", "Service-focused companies");
    }

    return environments;
  }

  private getCulturalChallenges(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const challenges: string[] = [];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'developing' || dimension.level === 'concern') {
        switch (dimension.dimension) {
          case 'innovation':
            challenges.push("Rapidly changing environments", "Ambiguous cultures", "Innovation-pressured organizations");
            break;
          case 'agreeableness':
            challenges.push("Highly competitive cultures", "Conflict-heavy environments", "Individual-focused organizations");
            break;
          case 'conscientiousness':
            challenges.push("Chaotic or disorganized cultures", "Extremely fast-paced environments", "Low-structure organizations");
            break;
          case 'resilience':
            challenges.push("High-stress cultures", "Crisis-driven organizations", "Pressure-intensive environments");
            break;
        }
      }
    });

    return challenges;
  }

  private getTeamRolePreference(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const agreeableness = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    const innovation = dimensionAnalysis.find(d => d.dimension === 'innovation');
    const conscientiousness = dimensionAnalysis.find(d => d.dimension === 'conscientiousness');

    if (agreeableness?.level === 'strong' || agreeableness?.level === 'exceptional') {
      return "Team facilitator, collaborator, supportive team member";
    }

    if (innovation?.level === 'strong' || innovation?.level === 'exceptional') {
      return "Creative contributor, change agent, idea generator";
    }

    if (conscientiousness?.level === 'strong' || conscientiousness?.level === 'exceptional') {
      return "Quality controller, process coordinator, detail specialist";
    }

    return "Individual contributor with team coordination as needed";
  }

  private getLeadershipStyle(dimensionAnalysis: CAIRDimensionAnalysis[]): string {
    const agreeableness = dimensionAnalysis.find(d => d.dimension === 'agreeableness');
    const resilience = dimensionAnalysis.find(d => d.dimension === 'resilience');
    const innovation = dimensionAnalysis.find(d => d.dimension === 'innovation');

    if (agreeableness?.level === 'strong' && resilience?.level === 'strong') {
      return "Collaborative, supportive leadership style";
    }

    if (innovation?.level === 'strong' && resilience?.level === 'strong') {
      return "Transformational, change-oriented leadership";
    }

    if (resilience?.level === 'strong') {
      return "Crisis leadership, steady under pressure";
    }

    if (agreeableness?.level === 'strong') {
      return "People-focused, consensus-building style";
    }

    return "Developing leadership potential - style will emerge with experience";
  }

  private getAdaptabilityScore(dimensionAnalysis: CAIRDimensionAnalysis[]): number {
    const innovation = dimensionAnalysis.find(d => d.dimension === 'innovation');
    const resilience = dimensionAnalysis.find(d => d.dimension === 'resilience');

    let score = 50; // Base score

    if (innovation?.level === 'exceptional') score += 25;
    else if (innovation?.level === 'strong') score += 15;
    else if (innovation?.level === 'developing') score -= 10;
    else if (innovation?.level === 'concern') score -= 20;

    if (resilience?.level === 'exceptional') score += 20;
    else if (resilience?.level === 'strong') score += 10;
    else if (resilience?.level === 'developing') score -= 10;
    else if (resilience?.level === 'concern') score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private getDiversityStrengths(dimensionAnalysis: CAIRDimensionAnalysis[]): string[] {
    const strengths: string[] = [];

    dimensionAnalysis.forEach(dimension => {
      if (dimension.level === 'strong' || dimension.level === 'exceptional') {
        switch (dimension.dimension) {
          case 'agreeableness':
            strengths.push("Cross-cultural collaboration", "Inclusive team building", "Conflict mediation across differences");
            break;
          case 'innovation':
            strengths.push("Embracing diverse perspectives", "Creative problem-solving", "Change advocacy");
            break;
          case 'resilience':
            strengths.push("Supporting others through challenges", "Maintaining stability", "Crisis leadership");
            break;
          case 'conscientiousness':
            strengths.push("Ensuring equitable processes", "Attention to inclusion details", "Fair implementation");
            break;
        }
      }
    });

    return strengths;
  }

  private generateDevelopmentPlan(
    dimensionAnalysis: CAIRDimensionAnalysis[], 
    weaknessAnalysis: WeaknessAnalysis
  ): DevelopmentPlan {
    const shortTerm: DevelopmentGoal[] = [];
    const longTerm: DevelopmentGoal[] = [];

    // Generate development goals based on weaknesses
    weaknessAnalysis.primaryWeaknesses.forEach(weakness => {
      const shortTermGoal = this.createShortTermGoal(weakness);
      const longTermGoal = this.createLongTermGoal(weakness);
      
      if (shortTermGoal) shortTerm.push(shortTermGoal);
      if (longTermGoal) longTerm.push(longTermGoal);
    });

    return {
      shortTerm,
      longTerm,
      resources: this.getDevelopmentResources(weaknessAnalysis),
      timeline: weaknessAnalysis.timelineForImprovement,
      successMetrics: this.getDevelopmentSuccessMetrics(weaknessAnalysis),
      checkpoints: this.getDevelopmentCheckpoints(weaknessAnalysis.developmentPriority)
    };
  }

  private createShortTermGoal(weakness: string): DevelopmentGoal | null {
    const goals: Record<string, DevelopmentGoal> = {
      conscientiousness: {
        area: "Organization & Time Management",
        objective: "Establish basic organizational systems and improve deadline adherence",
        actions: [
          "Complete time management training course",
          "Implement daily/weekly planning system",
          "Use project management tools consistently",
          "Practice breaking large tasks into smaller components"
        ],
        timeline: "3 months",
        resources: ["Time management training", "Project management software", "Organizational mentor"],
        measurableOutcomes: [
          "Meet 90% of deadlines in month 3",
          "Complete weekly planning sessions",
          "Demonstrate organized workspace",
          "Zero missed appointments"
        ]
      },
      agreeableness: {
        area: "Interpersonal Skills",
        objective: "Develop basic collaboration and communication skills",
        actions: [
          "Complete interpersonal communication course",
          "Practice active listening techniques",
          "Participate in team building activities",
          "Seek regular feedback on team interactions"
        ],
        timeline: "3 months",
        resources: ["Communication training", "Team building workshops", "Interpersonal coach"],
        measurableOutcomes: [
          "Positive peer feedback on collaboration",
          "Zero interpersonal conflicts",
          "Active participation in team meetings",
          "Demonstrates empathy in interactions"
        ]
      },
      innovation: {
        area: "Adaptability & Openness",
        objective: "Increase comfort with change and new approaches",
        actions: [
          "Participate in change management workshop",
          "Practice new learning methods weekly",
          "Volunteer for small process improvements",
          "Shadow colleagues in different roles"
        ],
        timeline: "3 months",
        resources: ["Change management training", "Learning resources", "Change mentor"],
        measurableOutcomes: [
          "Successfully adapt to at least 2 process changes",
          "Suggest one process improvement",
          "Complete cross-training in new area",
          "Positive attitude toward changes"
        ]
      },
      resilience: {
        area: "Stress Management",
        objective: "Develop healthy coping mechanisms and stress resilience",
        actions: [
          "Complete stress management training",
          "Practice daily stress reduction techniques",
          "Establish support network",
          "Implement work-life balance strategies"
        ],
        timeline: "3 months",
        resources: ["Stress management program", "Wellness resources", "EAP counseling"],
        measurableOutcomes: [
          "Maintain performance during stressful periods",
          "Use stress management techniques daily",
          "Report improved stress levels",
          "Zero stress-related absences"
        ]
      }
    };

    return goals[weakness] || null;
  }

  private createLongTermGoal(weakness: string): DevelopmentGoal | null {
    const goals: Record<string, DevelopmentGoal> = {
      conscientiousness: {
        area: "Advanced Organization & Leadership",
        objective: "Become a model of organization and mentor others",
        actions: [
          "Lead process improvement initiatives",
          "Mentor other employees on organization",
          "Develop advanced project management skills",
          "Take on complex, multi-faceted projects"
        ],
        timeline: "12-18 months",
        resources: ["Advanced PM certification", "Leadership training", "Mentoring program"],
        measurableOutcomes: [
          "Successfully lead 2+ process improvements",
          "Mentor 2+ colleagues effectively",
          "Achieve project management certification",
          "Zero quality or deadline issues"
        ]
      },
      agreeableness: {
        area: "Leadership & Influence",
        objective: "Develop strong leadership and team building capabilities",
        actions: [
          "Take on team leadership roles",
          "Develop conflict resolution expertise",
          "Build emotional intelligence skills",
          "Lead team development initiatives"
        ],
        timeline: "12-18 months",
        resources: ["Leadership development program", "EQ training", "Team leadership coaching"],
        measurableOutcomes: [
          "Successfully lead a team project",
          "Resolve team conflicts effectively",
          "Achieve high team satisfaction scores",
          "Demonstrate advanced EQ skills"
        ]
      },
      innovation: {
        area: "Innovation Leadership",
        objective: "Become a change agent and innovation leader",
        actions: [
          "Lead innovation initiatives",
          "Develop creative problem-solving expertise",
          "Champion change management efforts",
          "Mentor others on adaptability"
        ],
        timeline: "12-18 months",
        resources: ["Innovation training", "Creative thinking workshops", "Change leadership program"],
        measurableOutcomes: [
          "Lead successful innovation project",
          "Become recognized change champion",
          "Mentor others on adaptability",
          "Develop reputation for creative solutions"
        ]
      },
      resilience: {
        area: "Crisis Leadership",
        objective: "Develop expertise in high-pressure leadership and crisis management",
        actions: [
          "Take on high-pressure assignments",
          "Develop crisis management skills",
          "Lead during challenging periods",
          "Coach others on resilience"
        ],
        timeline: "12-18 months",
        resources: ["Crisis management training", "High-pressure leadership roles", "Resilience coaching"],
        measurableOutcomes: [
          "Successfully lead during crisis",
          "Maintain team morale in difficulties",
          "Develop reputation for steady leadership",
          "Coach others on stress management"
        ]
      }
    };

    return goals[weakness] || null;
  }

  private getDevelopmentResources(weaknessAnalysis: WeaknessAnalysis): string[] {
    const resources: string[] = [
      "Learning management system access",
      "Professional development budget",
      "Internal mentoring program",
      "Regular coaching sessions"
    ];

    if (weaknessAnalysis.developmentPriority === 'high') {
      resources.push(
        "External professional coaching",
        "Specialized training programs",
        "Conference and workshop attendance",
        "Professional certification support"
      );
    }

    return resources;
  }

  private getDevelopmentSuccessMetrics(weaknessAnalysis: WeaknessAnalysis): string[] {
    const metrics: string[] = [
      "Completion of all development activities on schedule",
      "Demonstration of improved skills in weak areas",
      "Positive feedback from supervisors and peers",
      "Meeting all performance improvement goals"
    ];

    weaknessAnalysis.primaryWeaknesses.forEach(weakness => {
      switch (weakness) {
        case 'conscientiousness':
          metrics.push("Achievement of 95% deadline adherence rate");
          break;
        case 'agreeableness':
          metrics.push("Positive team collaboration scores");
          break;
        case 'innovation':
          metrics.push("Successful adaptation to organizational changes");
          break;
        case 'resilience':
          metrics.push("Consistent performance during stressful periods");
          break;
      }
    });

    return metrics;
  }

  private getDevelopmentCheckpoints(priority: WeaknessAnalysis['developmentPriority']): string[] {
    switch (priority) {
      case 'high':
        return [
          "30-day initial assessment",
          "60-day progress review",
          "90-day comprehensive evaluation",
          "6-month development milestone",
          "Annual development review"
        ];
      case 'medium':
        return [
          "60-day initial assessment", 
          "90-day progress review",
          "6-month comprehensive evaluation",
          "Annual development review"
        ];
      case 'low':
        return [
          "90-day initial assessment",
          "6-month progress review", 
          "Annual development review"
        ];
      default:
        return ["Quarterly development reviews"];
    }
  }
}