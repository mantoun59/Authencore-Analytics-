// Comprehensive Assessment Scoring Engine
// Enhanced scoring for new assessment types with evidence-based calculations

export interface TechIntegrationResult {
  scores: Record<string, number>;
  interpretation: string;
  recommendations: string[];
  profile: string;
  insights: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
  };
}

export interface CommCompetencyResult {
  scores: Record<string, number>;
  interpretation: string;
  recommendations: string[];
  profile: string;
  effectiveness_profile: Record<string, number>;
  insights: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
  };
}

export interface LeadershipResult {
  scores: Record<string, number>;
  primary_style: string;
  secondary_style: string;
  interpretation: string;
  recommendations: string[];
  leadership_effectiveness: number;
  style_distribution: Record<string, number>;
  insights: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
  };
}

export interface WorkValuesResult {
  scores: Record<string, number>;
  values_hierarchy: [string, number][];
  top_values: [string, number][];
  bottom_values: [string, number][];
  values_profile: string;
  interpretation: string;
  recommendations: string[];
  insights: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
  };
}

export interface WorkPreferencesResult {
  scores: Record<string, number>;
  preference_profile: string;
  workplace_fit: Record<string, any>;
  interpretation: string;
  recommendations: string[];
  insights: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
  };
}

export class ComprehensiveAssessmentScoring {
  
  static calculateTechnologyIntegration(responses: number[]): TechIntegrationResult {
    if (responses.length !== 25) {
      throw new Error('Technology Integration assessment requires exactly 25 responses');
    }
    
    const dimensions = {
      usage_patterns: responses.slice(0, 6),      // Questions 1-6
      digital_boundaries: responses.slice(6, 12), // Questions 7-12
      tech_life_balance: responses.slice(12, 19), // Questions 13-19
      productivity_impact: responses.slice(19, 25) // Questions 20-25
    };
    
    const scores: Record<string, number> = {};
    
    for (const [dimension, items] of Object.entries(dimensions)) {
      scores[dimension] = items.reduce((a, b) => a + b, 0) / items.length;
    }
    
    scores.overall_tech_integration = 
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
    
    const profile = this.determineTechProfile(scores);
    const interpretation = this.interpretTechIntegration(scores, profile);
    const recommendations = this.generateTechRecommendations(scores);
    const insights = this.generateTechInsights(scores);
    
    return {
      scores,
      interpretation,
      recommendations,
      profile,
      insights
    };
  }
  
  static calculateCommunicationCompetencies(responses: number[]): CommCompetencyResult {
    if (responses.length !== 30) {
      throw new Error('Communication Competencies assessment requires exactly 30 responses');
    }
    
    // Effectiveness weights based on communication research
    const effectivenessWeights = {
      direct_indirect: {
        1: [4, 3, 3, 2], 2: [4, 2, 3, 3], 3: [3, 4, 3, 2], 4: [4, 2, 3, 3],
        5: [4, 3, 3, 2], 6: [3, 3, 4, 2], 7: [4, 3, 3, 3], 8: [3, 3, 4, 2]
      },
      formal_informal: {
        9: [4, 3, 3, 3], 10: [2, 3, 3, 4], 11: [3, 4, 3, 2], 12: [3, 4, 3, 3],
        13: [2, 4, 3, 3], 14: [3, 3, 4, 3], 15: [3, 3, 4, 3]
      },
      expressive_reserved: {
        16: [4, 3, 3, 3], 17: [3, 3, 4, 3], 18: [3, 4, 3, 2], 19: [4, 3, 3, 2],
        20: [3, 3, 4, 2], 21: [3, 4, 3, 3], 22: [3, 3, 4, 3], 23: [3, 4, 3, 3]
      },
      task_relationship: {
        24: [2, 4, 3, 3], 25: [2, 3, 4, 3], 26: [3, 4, 3, 3], 27: [2, 3, 4, 3],
        28: [3, 4, 3, 3], 29: [3, 4, 3, 3], 30: [3, 3, 4, 3]
      }
    };
    
    const scores: Record<string, number> = {};
    const effectiveness_profile: Record<string, number> = {};
    let questionIndex = 0;
    
    for (const [dimension, questionWeights] of Object.entries(effectivenessWeights)) {
      const dimensionScores: number[] = [];
      const effectivenessScores: number[] = [];
      
      for (const [questionNum, weights] of Object.entries(questionWeights)) {
        const response = responses[questionIndex]; // 0-3 for A-D
        const effectivenessScore = weights[response];
        dimensionScores.push(response);
        effectivenessScores.push(effectivenessScore);
        questionIndex++;
      }
      
      scores[dimension] = dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length;
      effectiveness_profile[dimension] = effectivenessScores.reduce((a, b) => a + b, 0) / effectivenessScores.length;
    }
    
    scores.overall_communication_effectiveness = 
      Object.values(effectiveness_profile).reduce((a, b) => a + b, 0) / Object.keys(effectiveness_profile).length;
    
    const profile = this.determineCommunicationProfile(scores);
    const interpretation = this.interpretCommunicationCompetencies(scores, effectiveness_profile, profile);
    const recommendations = this.generateCommunicationRecommendations(scores, effectiveness_profile);
    const insights = this.generateCommunicationInsights(scores, effectiveness_profile);
    
    return {
      scores,
      interpretation,
      recommendations,
      profile,
      effectiveness_profile,
      insights
    };
  }
  
  static calculateLeadershipBehaviors(responses: number[]): LeadershipResult {
    if (responses.length !== 40) {
      throw new Error('Leadership Behaviors assessment requires exactly 40 responses');
    }
    
    const leadershipStyles = {
      visionary_leadership: responses.slice(0, 7),    // Questions 1-7
      coaching_leadership: responses.slice(7, 14),    // Questions 8-14
      affiliative_leadership: responses.slice(14, 20), // Questions 15-20
      democratic_leadership: responses.slice(20, 27),  // Questions 21-27
      pacesetting_leadership: responses.slice(27, 34), // Questions 28-34
      commanding_leadership: responses.slice(34, 40)   // Questions 35-40
    };
    
    const scores: Record<string, number> = {};
    
    for (const [style, items] of Object.entries(leadershipStyles)) {
      scores[style] = items.reduce((a, b) => a + b, 0) / items.length;
    }
    
    // Calculate weighted overall effectiveness based on research
    const effectivenessWeights = {
      visionary_leadership: 0.20,
      coaching_leadership: 0.25,
      affiliative_leadership: 0.15,
      democratic_leadership: 0.20,
      pacesetting_leadership: 0.10,
      commanding_leadership: 0.10
    };
    
    const leadership_effectiveness = Object.entries(effectivenessWeights)
      .reduce((sum, [style, weight]) => sum + (scores[style] * weight), 0);
    
    // Identify primary and secondary styles
    const rankedStyles = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);
    
    const primary_style = rankedStyles[0][0];
    const secondary_style = rankedStyles[1][0];
    
    // Calculate style distribution
    const style_distribution = this.calculateStyleDistribution(scores);
    const interpretation = this.interpretLeadershipBehaviors(scores, primary_style, secondary_style);
    const recommendations = this.generateLeadershipRecommendations(scores, primary_style);
    const insights = this.generateLeadershipInsights(scores, style_distribution);
    
    return {
      scores,
      primary_style,
      secondary_style,
      interpretation,
      recommendations,
      leadership_effectiveness,
      style_distribution,
      insights
    };
  }
  
  static calculateWorkValues(responses: number[]): WorkValuesResult {
    if (responses.length !== 45) {
      throw new Error('Work Values assessment requires exactly 45 responses');
    }
    
    const valueDimensions = {
      achievement_recognition: responses.slice(0, 5),    // Questions 1-5
      autonomy_independence: responses.slice(5, 10),     // Questions 6-10
      social_impact_service: responses.slice(10, 15),    // Questions 11-15
      security_stability: responses.slice(15, 20),       // Questions 16-20
      growth_learning: responses.slice(20, 25),          // Questions 21-25
      work_life_integration: responses.slice(25, 30),    // Questions 26-30
      innovation_creativity: responses.slice(30, 35),    // Questions 31-35
      leadership_influence: responses.slice(35, 40),     // Questions 36-40
      collaboration_teamwork: responses.slice(40, 45)    // Questions 41-45
    };
    
    const scores: Record<string, number> = {};
    
    for (const [dimension, items] of Object.entries(valueDimensions)) {
      scores[dimension] = items.reduce((a, b) => a + b, 0) / items.length;
    }
    
    // Create values hierarchy
    const rankedValues = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);
    
    const topValues = rankedValues.slice(0, 3);
    const bottomValues = rankedValues.slice(-3);
    
    const values_profile = this.categorizeValuesProfile(scores);
    const interpretation = this.interpretWorkValues(scores, topValues, values_profile);
    const recommendations = this.generateValuesRecommendations(scores, topValues);
    const insights = this.generateValuesInsights(scores, rankedValues);
    
    return {
      scores,
      values_hierarchy: rankedValues,
      top_values: topValues,
      bottom_values: bottomValues,
      values_profile,
      interpretation,
      recommendations,
      insights
    };
  }
  
  static calculateWorkPreferences(responses: number[]): WorkPreferencesResult {
    if (responses.length !== 35) {
      throw new Error('Work Preferences assessment requires exactly 35 responses');
    }
    
    const preferenceDimensions = {
      work_preferences: responses.slice(0, 7),           // Questions 1-7
      communication_styles: responses.slice(7, 14),     // Questions 8-14
      career_expectations: responses.slice(14, 21),     // Questions 15-21
      technology_integration: responses.slice(21, 28),  // Questions 22-28
      multigenerational_strategies: responses.slice(28, 35) // Questions 29-35
    };
    
    const scores: Record<string, number> = {};
    
    for (const [dimension, items] of Object.entries(preferenceDimensions)) {
      scores[dimension] = items.reduce((a, b) => a + b, 0) / items.length;
    }
    
    const preference_profile = this.createPreferenceProfile(scores);
    const workplace_fit = this.analyzeWorkplaceFit(scores);
    const interpretation = this.interpretWorkPreferences(scores, preference_profile);
    const recommendations = this.generatePreferenceRecommendations(scores, workplace_fit);
    const insights = this.generatePreferenceInsights(scores, preference_profile);
    
    return {
      scores,
      preference_profile,
      workplace_fit,
      interpretation,
      recommendations,
      insights
    };
  }
  
  // Helper methods for Technology Integration
  private static determineTechProfile(scores: Record<string, number>): string {
    const overall = scores.overall_tech_integration;
    if (overall >= 4.5) return "Tech Harmony Master";
    if (overall >= 4.0) return "Digital Balance Achiever";
    if (overall >= 3.5) return "Tech Integration Developer";
    if (overall >= 3.0) return "Boundary Building Learner";
    return "Digital Wellness Seeker";
  }
  
  private static interpretTechIntegration(scores: Record<string, number>, profile: string): string {
    const overall = scores.overall_tech_integration;
    const usage = scores.usage_patterns;
    const boundaries = scores.digital_boundaries;
    const balance = scores.tech_life_balance;
    const productivity = scores.productivity_impact;
    
    let interpretation = `Your Technology Integration profile is "${profile}" with an overall integration score of ${overall.toFixed(2)}/5.0.\n\n`;
    
    // Analyze strengths and areas for development
    if (usage >= 4.0) {
      interpretation += "You demonstrate excellent technology usage patterns, showing intentionality and effectiveness in your digital tool selection and application. ";
    } else if (usage <= 2.5) {
      interpretation += "Your technology usage patterns suggest opportunities for more strategic and intentional technology adoption. ";
    }
    
    if (boundaries >= 4.0) {
      interpretation += "You maintain strong digital boundaries, successfully separating work and personal technology use. ";
    } else if (boundaries <= 2.5) {
      interpretation += "Strengthening your digital boundaries could significantly improve your overall technology relationship. ";
    }
    
    if (balance >= 4.0) {
      interpretation += "You've achieved excellent tech-life balance, using technology to enhance rather than complicate your life. ";
    } else if (balance <= 2.5) {
      interpretation += "Your tech-life balance shows room for improvement in integrating technology more harmoniously. ";
    }
    
    if (productivity >= 4.0) {
      interpretation += "Technology significantly enhances your productivity and goal achievement. ";
    } else if (productivity <= 2.5) {
      interpretation += "Technology may be creating more complexity than value in your work processes. ";
    }
    
    return interpretation;
  }
  
  private static generateTechRecommendations(scores: Record<string, number>): string[] {
    const recommendations: string[] = [];
    
    if (scores.usage_patterns < 3.5) {
      recommendations.push("Conduct a technology audit to identify which tools truly add value vs. create distraction");
      recommendations.push("Establish specific times for checking and responding to digital communications");
    }
    
    if (scores.digital_boundaries < 3.5) {
      recommendations.push("Create physical and temporal boundaries between work and personal technology use");
      recommendations.push("Develop a 'digital sunset' routine to disconnect from work technology each evening");
    }
    
    if (scores.tech_life_balance < 3.5) {
      recommendations.push("Schedule regular tech-free periods to engage in offline activities and relationships");
      recommendations.push("Evaluate how technology use aligns with your core values and life priorities");
    }
    
    if (scores.productivity_impact < 3.5) {
      recommendations.push("Streamline your technology stack to focus on tools that provide clear productivity benefits");
      recommendations.push("Implement time-blocking techniques to minimize technology-related task switching");
    }
    
    return recommendations;
  }
  
  private static generateTechInsights(scores: Record<string, number>): { strengths: string[]; challenges: string[]; opportunities: string[] } {
    const strengths: string[] = [];
    const challenges: string[] = [];
    const opportunities: string[] = [];
    
    // Identify strengths
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score >= 4.0) {
        switch (dimension) {
          case 'usage_patterns':
            strengths.push("Strategic technology selection and implementation");
            break;
          case 'digital_boundaries':
            strengths.push("Clear boundaries between personal and professional technology");
            break;
          case 'tech_life_balance':
            strengths.push("Healthy integration of technology with life priorities");
            break;
          case 'productivity_impact':
            strengths.push("Technology effectively enhances work productivity");
            break;
        }
      }
    });
    
    // Identify challenges
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score <= 2.5) {
        switch (dimension) {
          case 'usage_patterns':
            challenges.push("Inconsistent or overwhelming technology usage patterns");
            break;
          case 'digital_boundaries':
            challenges.push("Difficulty maintaining separation between work and personal tech");
            break;
          case 'tech_life_balance':
            challenges.push("Technology creating stress or disrupting life balance");
            break;
          case 'productivity_impact':
            challenges.push("Technology adding complexity without clear productivity gains");
            break;
        }
      }
    });
    
    // Identify opportunities
    const improvement_potential = Object.entries(scores).filter(([, score]) => score < 4.0 && score > 2.0);
    improvement_potential.forEach(([dimension]) => {
      switch (dimension) {
        case 'usage_patterns':
          opportunities.push("Optimize technology selection for maximum effectiveness");
          break;
        case 'digital_boundaries':
          opportunities.push("Develop clearer technology usage boundaries");
          break;
        case 'tech_life_balance':
          opportunities.push("Better integrate technology with personal values and priorities");
          break;
        case 'productivity_impact':
          opportunities.push("Streamline technology use for enhanced productivity");
          break;
      }
    });
    
    return { strengths, challenges, opportunities };
  }
  
  // Helper methods for Communication Competencies
  private static determineCommunicationProfile(scores: Record<string, number>): string {
    const direct = scores.direct_indirect;
    const formal = scores.formal_informal;
    const expressive = scores.expressive_reserved;
    const task = scores.task_relationship;
    
    let profile = "";
    
    // Determine primary style based on highest scoring dimensions
    if (direct >= 2.5 && task >= 2.5) profile += "Results-Focused ";
    else if (direct < 1.5 && task < 1.5) profile += "Relationship-Centered ";
    else profile += "Balanced ";
    
    if (formal >= 2.5) profile += "Structured ";
    else profile += "Flexible ";
    
    if (expressive >= 2.5) profile += "Dynamic Communicator";
    else profile += "Measured Communicator";
    
    return profile.trim();
  }
  
  private static interpretCommunicationCompetencies(
    scores: Record<string, number>, 
    effectiveness: Record<string, number>, 
    profile: string
  ): string {
    const overallEffectiveness = scores.overall_communication_effectiveness;
    
    let interpretation = `Your Communication Competencies profile is "${profile}" with an overall effectiveness score of ${overallEffectiveness.toFixed(2)}/5.0.\n\n`;
    
    // Analyze each dimension
    const dimensions = [
      { key: 'direct_indirect', name: 'Direct vs Indirect', low: 'diplomatic', high: 'direct' },
      { key: 'formal_informal', name: 'Formal vs Informal', low: 'structured', high: 'conversational' },
      { key: 'expressive_reserved', name: 'Expressive vs Reserved', low: 'measured', high: 'animated' },
      { key: 'task_relationship', name: 'Task vs Relationship', low: 'relationship-focused', high: 'results-oriented' }
    ];
    
    dimensions.forEach(dimension => {
      const score = scores[dimension.key];
      const effScore = effectiveness[dimension.key];
      const tendency = score >= 2.0 ? dimension.high : dimension.low;
      
      interpretation += `In ${dimension.name} communication, you tend toward a ${tendency} approach (effectiveness: ${effScore.toFixed(1)}/5.0). `;
    });
    
    return interpretation;
  }
  
  private static generateCommunicationRecommendations(
    scores: Record<string, number>, 
    effectiveness: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];
    
    // Generate recommendations based on effectiveness scores
    Object.entries(effectiveness).forEach(([dimension, score]) => {
      if (score < 3.5) {
        switch (dimension) {
          case 'direct_indirect':
            recommendations.push("Practice adapting your directness level based on audience sensitivity and cultural context");
            break;
          case 'formal_informal':
            recommendations.push("Develop flexibility in adjusting formality to match professional settings and relationships");
            break;
          case 'expressive_reserved':
            recommendations.push("Experiment with varying your expressiveness to match audience energy and engagement needs");
            break;
          case 'task_relationship':
            recommendations.push("Balance task focus with relationship building to enhance overall communication effectiveness");
            break;
        }
      }
    });
    
    return recommendations;
  }
  
  private static generateCommunicationInsights(
    scores: Record<string, number>, 
    effectiveness: Record<string, number>
  ): { strengths: string[]; challenges: string[]; opportunities: string[] } {
    const strengths: string[] = [];
    const challenges: string[] = [];
    const opportunities: string[] = [];
    
    Object.entries(effectiveness).forEach(([dimension, score]) => {
      if (score >= 4.0) {
        switch (dimension) {
          case 'direct_indirect':
            strengths.push("Excellent balance of clarity and diplomacy");
            break;
          case 'formal_informal':
            strengths.push("Skilled at matching formality to context");
            break;
          case 'expressive_reserved':
            strengths.push("Effective use of expression and energy");
            break;
          case 'task_relationship':
            strengths.push("Strong balance of task focus and relationship building");
            break;
        }
      } else if (score <= 2.5) {
        switch (dimension) {
          case 'direct_indirect':
            challenges.push("May struggle with directness or diplomacy balance");
            break;
          case 'formal_informal':
            challenges.push("Difficulty adjusting formality to different contexts");
            break;
          case 'expressive_reserved':
            challenges.push("Expression level may not always match audience needs");
            break;
          case 'task_relationship':
            challenges.push("May overfocus on tasks or relationships");
            break;
        }
      } else {
        switch (dimension) {
          case 'direct_indirect':
            opportunities.push("Develop greater flexibility in directness approaches");
            break;
          case 'formal_informal':
            opportunities.push("Practice adapting formality for maximum effectiveness");
            break;
          case 'expressive_reserved':
            opportunities.push("Experiment with different expression levels");
            break;
          case 'task_relationship':
            opportunities.push("Balance task and relationship priorities more effectively");
            break;
        }
      }
    });
    
    return { strengths, challenges, opportunities };
  }
  
  // Additional helper methods would be implemented for Leadership, Work Values, and Work Preferences...
  // [Continuing with remaining helper methods...]
  
  private static calculateStyleDistribution(scores: Record<string, number>): Record<string, number> {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const distribution: Record<string, number> = {};
    
    Object.entries(scores).forEach(([style, score]) => {
      distribution[style] = (score / total) * 100;
    });
    
    return distribution;
  }
  
  private static interpretLeadershipBehaviors(scores: Record<string, number>, primary: string, secondary: string): string {
    let interpretation = `Your leadership profile shows "${primary.replace('_', ' ')}" as your primary style and "${secondary.replace('_', ' ')}" as your secondary approach.\n\n`;
    
    // Add style-specific insights
    const styleInsights: Record<string, string> = {
      visionary_leadership: "You excel at inspiring others with compelling visions of the future and driving change through shared purpose.",
      coaching_leadership: "You focus on developing people's individual capabilities and helping them achieve their personal and professional goals.",
      affiliative_leadership: "You prioritize building strong relationships and creating harmony within your team.",
      democratic_leadership: "You value input from others and make decisions through collaboration and consensus-building.",
      pacesetting_leadership: "You set high standards and expect excellence while modeling the behaviors you want to see.",
      commanding_leadership: "You provide clear direction and make decisive decisions, especially in crisis situations."
    };
    
    interpretation += styleInsights[primary] + " ";
    interpretation += `Your secondary tendency toward ${secondary.replace('_', ' ')} provides additional flexibility in your leadership approach.`;
    
    return interpretation;
  }
  
  private static generateLeadershipRecommendations(scores: Record<string, number>, primaryStyle: string): string[] {
    const recommendations: string[] = [];
    
    // Find lowest scoring styles for development recommendations
    const sortedStyles = Object.entries(scores).sort(([, a], [, b]) => a - b);
    const developmentAreas = sortedStyles.slice(0, 2);
    
    developmentAreas.forEach(([style, score]) => {
      if (score < 3.0) {
        switch (style) {
          case 'visionary_leadership':
            recommendations.push("Practice communicating inspiring visions and connecting daily work to larger purpose");
            break;
          case 'coaching_leadership':
            recommendations.push("Develop skills in providing developmental feedback and supporting individual growth");
            break;
          case 'affiliative_leadership':
            recommendations.push("Focus more on building relationships and creating emotional connections with team members");
            break;
          case 'democratic_leadership':
            recommendations.push("Increase involvement of others in decision-making and actively seek diverse perspectives");
            break;
          case 'pacesetting_leadership':
            recommendations.push("Practice setting high standards while providing clear expectations and support");
            break;
          case 'commanding_leadership':
            recommendations.push("Develop comfort with making decisive decisions and providing clear direction when needed");
            break;
        }
      }
    });
    
    return recommendations;
  }
  
  private static generateLeadershipInsights(scores: Record<string, number>, distribution: Record<string, number>): { strengths: string[]; challenges: string[]; opportunities: string[] } {
    const strengths: string[] = [];
    const challenges: string[] = [];
    const opportunities: string[] = [];
    
    Object.entries(scores).forEach(([style, score]) => {
      if (score >= 4.0) {
        strengths.push(`Strong ${style.replace('_', ' ')} capabilities`);
      } else if (score <= 2.5) {
        challenges.push(`Underdeveloped ${style.replace('_', ' ')} skills`);
      } else {
        opportunities.push(`Potential to strengthen ${style.replace('_', ' ')}`);
      }
    });
    
    return { strengths, challenges, opportunities };
  }
  
  private static categorizeValuesProfile(scores: Record<string, number>): string {
    const sortedValues = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const topThree = sortedValues.slice(0, 3).map(([name]) => name);
    
    // Categorize based on top values
    if (topThree.includes('achievement_recognition') && topThree.includes('leadership_influence')) {
      return "Achievement-Oriented Leader";
    } else if (topThree.includes('autonomy_independence') && topThree.includes('innovation_creativity')) {
      return "Independent Innovator";
    } else if (topThree.includes('social_impact_service') && topThree.includes('collaboration_teamwork')) {
      return "Service-Minded Collaborator";
    } else if (topThree.includes('security_stability') && topThree.includes('work_life_integration')) {
      return "Stability-Focused Balancer";
    } else if (topThree.includes('growth_learning')) {
      return "Continuous Learner";
    } else {
      return "Multi-Faceted Professional";
    }
  }
  
  private static interpretWorkValues(scores: Record<string, number>, topValues: [string, number][], profile: string): string {
    let interpretation = `Your Work Values profile is "${profile}". Your top three values are:\n\n`;
    
    topValues.forEach(([value, score], index) => {
      const valueName = value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      interpretation += `${index + 1}. ${valueName} (${score.toFixed(2)}/5.0)\n`;
    });
    
    interpretation += `\nThis values configuration suggests you are most motivated by work that provides ${topValues[0][0].replace('_', ' ')} `;
    interpretation += `while also offering opportunities for ${topValues[1][0].replace('_', ' ')} and ${topValues[2][0].replace('_', ' ')}.`;
    
    return interpretation;
  }
  
  private static generateValuesRecommendations(scores: Record<string, number>, topValues: [string, number][]): string[] {
    const recommendations: string[] = [];
    
    topValues.forEach(([value]) => {
      switch (value) {
        case 'achievement_recognition':
          recommendations.push("Seek roles with clear performance metrics and recognition programs");
          break;
        case 'autonomy_independence':
          recommendations.push("Look for positions with flexible work arrangements and decision-making authority");
          break;
        case 'social_impact_service':
          recommendations.push("Consider organizations with strong social missions or community impact");
          break;
        case 'security_stability':
          recommendations.push("Prioritize established organizations with predictable career paths");
          break;
        case 'growth_learning':
          recommendations.push("Seek opportunities with strong professional development and learning resources");
          break;
        case 'work_life_integration':
          recommendations.push("Look for employers who actively support work-life balance initiatives");
          break;
        case 'innovation_creativity':
          recommendations.push("Pursue roles that involve creative problem-solving and innovative thinking");
          break;
        case 'leadership_influence':
          recommendations.push("Seek leadership opportunities and roles with significant decision-making impact");
          break;
        case 'collaboration_teamwork':
          recommendations.push("Look for team-oriented environments with collaborative project structures");
          break;
      }
    });
    
    return recommendations;
  }
  
  private static generateValuesInsights(scores: Record<string, number>, hierarchy: [string, number][]): { strengths: string[]; challenges: string[]; opportunities: string[] } {
    const strengths: string[] = [];
    const challenges: string[] = [];
    const opportunities: string[] = [];
    
    // Top values are strengths
    hierarchy.slice(0, 3).forEach(([value]) => {
      strengths.push(`Strong motivation for ${value.replace('_', ' ')}`);
    });
    
    // Bottom values may be challenges if very low
    hierarchy.slice(-2).forEach(([value, score]) => {
      if (score < 2.5) {
        challenges.push(`Limited motivation for ${value.replace('_', ' ')}`);
      }
    });
    
    // Middle values are opportunities
    hierarchy.slice(3, -2).forEach(([value, score]) => {
      if (score >= 3.0) {
        opportunities.push(`Potential to develop stronger ${value.replace('_', ' ')} motivation`);
      }
    });
    
    return { strengths, challenges, opportunities };
  }
  
  private static createPreferenceProfile(scores: Record<string, number>): string {
    // Simplified profile creation based on highest scores
    const sortedPrefs = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const primary = sortedPrefs[0][0];
    
    const profileMap: Record<string, string> = {
      work_preferences: "Structured Work Enthusiast",
      communication_styles: "Communication-Focused Professional",
      career_expectations: "Ambitious Career Builder",
      technology_integration: "Tech-Savvy Innovator",
      multigenerational_strategies: "Cross-Generational Collaborator"
    };
    
    return profileMap[primary] || "Balanced Professional";
  }
  
  private static analyzeWorkplaceFit(scores: Record<string, number>): Record<string, any> {
    return {
      ideal_work_environment: scores.work_preferences >= 4.0 ? "Structured and goal-oriented" : "Flexible and adaptive",
      communication_preference: scores.communication_styles >= 4.0 ? "Frequent and collaborative" : "Focused and efficient",
      career_approach: scores.career_expectations >= 4.0 ? "Ambitious and growth-focused" : "Steady and sustainable",
      technology_comfort: scores.technology_integration >= 4.0 ? "High-tech and innovative" : "Practical and efficient",
      team_dynamics: scores.multigenerational_strategies >= 4.0 ? "Diverse and inclusive" : "Focused and aligned"
    };
  }
  
  private static interpretWorkPreferences(scores: Record<string, number>, profile: string): string {
    let interpretation = `Your Work Preferences profile is "${profile}". `;
    
    const highest = Object.entries(scores).reduce((max, [key, value]) => 
      value > max.value ? { key, value } : max, { key: '', value: 0 });
    
    interpretation += `Your strongest preference area is ${highest.key.replace('_', ' ')} (${highest.value.toFixed(2)}/5.0), `;
    interpretation += `indicating this is a key factor in your ideal work environment and career satisfaction.`;
    
    return interpretation;
  }
  
  private static generatePreferenceRecommendations(scores: Record<string, number>, workplaceFit: Record<string, any>): string[] {
    const recommendations: string[] = [];
    
    Object.entries(scores).forEach(([preference, score]) => {
      if (score >= 4.0) {
        switch (preference) {
          case 'work_preferences':
            recommendations.push("Seek structured roles with clear goals and defined processes");
            break;
          case 'communication_styles':
            recommendations.push("Look for collaborative environments with strong communication culture");
            break;
          case 'career_expectations':
            recommendations.push("Pursue ambitious career paths with clear advancement opportunities");
            break;
          case 'technology_integration':
            recommendations.push("Consider tech-forward organizations that embrace innovation");
            break;
          case 'multigenerational_strategies':
            recommendations.push("Seek diverse, inclusive workplaces with cross-generational collaboration");
            break;
        }
      }
    });
    
    return recommendations;
  }
  
  private static generatePreferenceInsights(scores: Record<string, number>, profile: string): { strengths: string[]; challenges: string[]; opportunities: string[] } {
    const strengths: string[] = [];
    const challenges: string[] = [];
    const opportunities: string[] = [];
    
    Object.entries(scores).forEach(([preference, score]) => {
      if (score >= 4.0) {
        strengths.push(`Strong preference for ${preference.replace('_', ' ')}`);
      } else if (score <= 2.5) {
        challenges.push(`Limited interest in ${preference.replace('_', ' ')}`);
      } else {
        opportunities.push(`Moderate interest in ${preference.replace('_', ' ')} - potential area for development`);
      }
    });
    
    return { strengths, challenges, opportunities };
  }
}

// Export report generation functions
export const generateTechIntegrationReport = (results: TechIntegrationResult): string => {
  return `
# Technology Integration & Boundary Management Report

## Overall Technology Integration Score: ${results.scores.overall_tech_integration.toFixed(2)}/5.0

### Profile: ${results.profile}

### Dimension Breakdown:
- **Usage Patterns**: ${results.scores.usage_patterns.toFixed(2)}/5.0
- **Digital Boundaries**: ${results.scores.digital_boundaries.toFixed(2)}/5.0  
- **Tech-Life Balance**: ${results.scores.tech_life_balance.toFixed(2)}/5.0
- **Productivity Impact**: ${results.scores.productivity_impact.toFixed(2)}/5.0

### Interpretation:
${results.interpretation}

### Key Strengths:
${results.insights.strengths.map(strength => `- ${strength}`).join('\n')}

### Areas for Development:
${results.insights.challenges.map(challenge => `- ${challenge}`).join('\n')}

### Development Recommendations:
${results.recommendations.map(rec => `- ${rec}`).join('\n')}

### Next Steps:
Focus on strengthening areas where scores are below 3.5 while leveraging your technology integration strengths in higher-scoring dimensions.
  `;
};

export const generateCommunicationCompetencyReport = (results: CommCompetencyResult): string => {
  return `
# Professional Communication Competencies Report

## Overall Communication Effectiveness: ${results.scores.overall_communication_effectiveness.toFixed(2)}/5.0

### Profile: ${results.profile}

### Effectiveness by Dimension:
- **Direct vs Indirect**: ${results.effectiveness_profile.direct_indirect.toFixed(2)}/5.0
- **Formal vs Informal**: ${results.effectiveness_profile.formal_informal.toFixed(2)}/5.0
- **Expressive vs Reserved**: ${results.effectiveness_profile.expressive_reserved.toFixed(2)}/5.0
- **Task vs Relationship**: ${results.effectiveness_profile.task_relationship.toFixed(2)}/5.0

### Interpretation:
${results.interpretation}

### Communication Strengths:
${results.insights.strengths.map(strength => `- ${strength}`).join('\n')}

### Development Opportunities:
${results.insights.opportunities.map(opportunity => `- ${opportunity}`).join('\n')}

### Enhancement Recommendations:
${results.recommendations.map(rec => `- ${rec}`).join('\n')}
  `;
};