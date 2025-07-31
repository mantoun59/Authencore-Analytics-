import { supabase } from '@/integrations/supabase/client';

// Leadership Profile Types
export const leadershipProfiles = {
  VISIONARY_LEADER: {
    name: "Visionary Leader",
    badge: "🔮 Visionary Leader",
    description: "Exceptional strategic thinking with strong influence capabilities",
    characteristics: ["Forward-thinking", "Inspirational", "Strategic planner", "Change catalyst"],
    strengths: ["Long-term vision", "Strategic planning", "Innovation leadership", "Market foresight"],
    developmentAreas: ["Operational details", "Short-term execution", "Process management"]
  },
  PEOPLE_FOCUSED_LEADER: {
    name: "People-Focused Leader", 
    badge: "🤝 People-Focused Leader",
    description: "High emotional intelligence with exceptional team development skills",
    characteristics: ["Empathetic", "Team builder", "Coaching mindset", "Relationship-oriented"],
    strengths: ["Team development", "Emotional intelligence", "Conflict resolution", "Employee engagement"],
    developmentAreas: ["Strategic thinking", "Tough decisions", "Business metrics focus"]
  },
  TRANSFORMATIONAL_LEADER: {
    name: "Transformational Leader",
    badge: "⚡ Transformational Leader", 
    description: "Outstanding change management with strong communication skills",
    characteristics: ["Change agent", "Adaptable", "Communicator", "Innovation driver"],
    strengths: ["Change leadership", "Communication", "Adaptability", "Innovation management"],
    developmentAreas: ["Stability focus", "Process optimization", "Risk management"]
  },
  DECISIVE_LEADER: {
    name: "Decisive Leader",
    badge: "⚖️ Decisive Leader",
    description: "Excellent decision-making capabilities with strong execution focus",
    characteristics: ["Analytical", "Decisive", "Results-oriented", "Problem solver"],
    strengths: ["Decision making", "Problem solving", "Data analysis", "Results delivery"],
    developmentAreas: ["Team development", "Emotional intelligence", "Long-term vision"]
  },
  BALANCED_LEADER: {
    name: "Balanced Leader", 
    badge: "🎯 Balanced Leader",
    description: "Well-rounded leadership capabilities across all dimensions",
    characteristics: ["Versatile", "Adaptable", "Well-rounded", "Consistent"],
    strengths: ["Cross-functional competence", "Adaptability", "Consistent performance", "Reliability"],
    developmentAreas: ["Specialization depth", "Signature strengths", "Distinctive leadership style"]
  },
  EMERGING_LEADER: {
    name: "Emerging Leader",
    badge: "🌱 Emerging Leader", 
    description: "Developing leadership foundation with growth potential",
    characteristics: ["Growth-oriented", "Learning focused", "Potential-driven", "Development-ready"],
    strengths: ["Learning agility", "Growth mindset", "Coachability", "Potential"],
    developmentAreas: ["All dimensions", "Leadership experience", "Skill building", "Confidence building"]
  }
};

// Behavioral indicators for workplace performance
export const leadershipBehavioralIndicators = {
  strategicThinking: {
    high: ["Develops comprehensive long-term strategies", "Anticipates market changes", "Creates innovative solutions", "Links decisions to strategic goals"],
    moderate: ["Shows strategic awareness", "Plans medium-term initiatives", "Considers broader implications", "Seeks strategic guidance"],
    developing: ["Focuses on immediate tasks", "Limited strategic perspective", "Needs strategic development", "Reactive planning approach"]
  },
  emotionalIntelligence: {
    high: ["Manages emotions effectively under pressure", "Shows empathy in difficult situations", "Builds strong relationships", "Influences through emotional connection"],
    moderate: ["Generally emotionally aware", "Handles most situations well", "Shows some empathy", "Building relationship skills"],
    developing: ["Struggles with emotional control", "Limited empathy", "Needs relationship development", "Reactive emotional responses"]
  },
  communication: {
    high: ["Communicates vision clearly", "Adapts style to audience", "Influences and persuades effectively", "Creates compelling narratives"],
    moderate: ["Communicates adequately", "Shows some influence", "Generally clear messaging", "Developing persuasion skills"],
    developing: ["Unclear communication", "Limited influence", "Needs presentation skills", "Struggles with difficult conversations"]
  },
  teamDevelopment: {
    high: ["Develops high-performing teams", "Delegates effectively", "Coaches for growth", "Creates succession plans"],
    moderate: ["Supports team development", "Delegates appropriately", "Provides some coaching", "Shows team focus"],
    developing: ["Limited team development", "Reluctant to delegate", "Needs coaching skills", "Individual contributor mindset"]
  },
  decisionMaking: {
    high: ["Makes timely, quality decisions", "Uses data effectively", "Manages risk appropriately", "Shows decision confidence"],
    moderate: ["Makes adequate decisions", "Uses some data", "Shows decision awareness", "Generally confident"],
    developing: ["Avoids difficult decisions", "Limited data use", "High risk aversion", "Lacks decision confidence"]
  },
  changeManagement: {
    high: ["Leads change initiatives", "Adapts quickly to change", "Helps others navigate change", "Drives innovation"],
    moderate: ["Manages change adequately", "Shows some adaptability", "Supports change efforts", "Open to innovation"],
    developing: ["Resists change", "Struggles with adaptation", "Needs change support", "Prefers status quo"]
  }
};

// Development strategies by dimension
export const developmentStrategies = {
  strategicThinking: [
    "Develop a personal vision and 3-year strategic plan",
    "Read business publications and analyze market trends",
    "Attend strategic planning workshops or executive education",
    "Find a strategic mentor or executive coach",
    "Practice scenario planning and risk assessment",
    "Join cross-functional strategic initiatives"
  ],
  emotionalIntelligence: [
    "Practice daily emotional awareness and reflection",
    "Develop active listening and empathy skills",
    "Seek 360-degree feedback on interpersonal effectiveness",
    "Learn conflict resolution and difficult conversation skills",
    "Practice mindfulness and stress management techniques",
    "Work with an executive coach on EQ development"
  ],
  communication: [
    "Join presentation skills or public speaking programs",
    "Practice storytelling and narrative communication",
    "Develop written communication and digital presence",
    "Learn persuasion and influence techniques",
    "Seek feedback on communication effectiveness",
    "Practice communicating complex ideas simply"
  ],
  teamDevelopment: [
    "Learn coaching and mentoring techniques",
    "Practice delegation and empowerment strategies",
    "Develop talent review and succession planning skills",
    "Study high-performing team characteristics",
    "Practice giving developmental feedback",
    "Learn to create psychological safety"
  ],
  decisionMaking: [
    "Learn data analysis and business intelligence tools",
    "Practice structured decision-making frameworks",
    "Develop risk assessment and management skills",
    "Study decision science and behavioral economics",
    "Practice making decisions under uncertainty",
    "Learn from decision successes and failures"
  ],
  changeManagement: [
    "Learn change management methodologies (Kotter, ADKAR)",
    "Practice leading change initiatives",
    "Develop adaptability and resilience skills",
    "Study innovation and transformation case studies",
    "Practice communicating change vision",
    "Learn to manage change resistance"
  ]
};

export interface LeadershipResults {
  dimensions: {
    strategicThinking: { score: number; level: string; percentile: number };
    emotionalIntelligence: { score: number; level: string; percentile: number };
    communication: { score: number; level: string; percentile: number };
    teamDevelopment: { score: number; level: string; percentile: number };
    decisionMaking: { score: number; level: string; percentile: number };
    changeManagement: { score: number; level: string; percentile: number };
  };
  overallScore: number;
  profile: {
    type: keyof typeof leadershipProfiles;
    name: string;
    badge: string;
    description: string;
    characteristics: string[];
    confidence: number;
  };
  behavioralProfile: {
    strategicThinking: 'high' | 'moderate' | 'developing';
    emotionalIntelligence: 'high' | 'moderate' | 'developing';
    communication: 'high' | 'moderate' | 'developing';
    teamDevelopment: 'high' | 'moderate' | 'developing';
    decisionMaking: 'high' | 'moderate' | 'developing';
    changeManagement: 'high' | 'moderate' | 'developing';
  };
  developmentAreas: {
    priority: 'High' | 'Medium' | 'Low';
    dimension: string;
    description: string;
    strategies: string[];
    timeframe: string;
  }[];
  completedAt: string;
  timeSpent: number;
}

export class LeadershipReportGenerator {
  static generateCandidateReport(
    results: LeadershipResults,
    participantName: string,
    participantEmail: string
  ): string {
    const reportDate = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leadership Assessment Report - ${participantName}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="25" cy="75" r="1" fill="white" opacity="0.05"/><circle cx="75" cy="25" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          }
          
          .header-content {
            position: relative;
            z-index: 1;
          }
          
          .logo {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .header h1 {
            font-size: 2rem;
            margin-bottom: 10px;
            font-weight: 300;
          }
          
          .participant-info {
            font-size: 1.1rem;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px;
          }
          
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .profile-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 1.3rem;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 8px 16px rgba(102,126,234,0.3);
          }
          
          .score-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          
          .score-card {
            background: linear-gradient(135deg, #f8f9ff, #e8ecff);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #667eea;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .score-value {
            font-size: 3rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
          }
          
          .score-label {
            font-size: 1.1rem;
            color: #666;
            font-weight: 500;
          }
          
          .dimensions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin: 30px 0;
          }
          
          .dimension-card {
            background: white;
            border: 2px solid #e0e6ff;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .dimension-card:hover {
            border-color: #667eea;
            box-shadow: 0 8px 16px rgba(102,126,234,0.15);
          }
          
          .dimension-title {
            font-size: 1.3rem;
            color: #667eea;
            margin-bottom: 15px;
            font-weight: 600;
          }
          
          .dimension-score {
            font-size: 2rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
          }
          
          .dimension-level {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 15px;
          }
          
          .level-exceptional { background: #d4edda; color: #155724; }
          .level-strong { background: #cce7ff; color: #004085; }
          .level-developing { background: #fff3cd; color: #856404; }
          .level-emerging { background: #f8d7da; color: #721c24; }
          
          .progress-bar {
            background: #e9ecef;
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin: 10px 0;
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 6px;
            transition: width 0.8s ease;
          }
          
          .behavioral-indicators {
            margin-top: 15px;
          }
          
          .behavioral-indicator {
            display: flex;
            align-items: center;
            margin: 8px 0;
            font-size: 0.9rem;
            color: #555;
          }
          
          .behavioral-indicator::before {
            content: '✓';
            color: #28a745;
            font-weight: bold;
            margin-right: 8px;
          }
          
          .development-areas {
            background: #f8f9ff;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
          }
          
          .development-item {
            background: white;
            border-left: 4px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          .priority-high { border-left-color: #dc3545; }
          .priority-medium { border-left-color: #ffc107; }
          .priority-low { border-left-color: #28a745; }
          
          .development-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }
          
          .development-strategies {
            list-style: none;
            padding: 0;
          }
          
          .development-strategies li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #555;
          }
          
          .development-strategies li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
          }
          
          .radar-chart-container {
            text-align: center;
            margin: 30px 0;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }
          
          .chart-title {
            font-size: 1.5rem;
            color: #667eea;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .footer {
            background: #f8f9ff;
            padding: 30px;
            text-align: center;
            border-top: 2px solid #e0e6ff;
          }
          
          .footer-text {
            color: #666;
            font-size: 0.9rem;
            line-height: 1.8;
          }
          
          @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-content">
              <div class="logo">🎯 AuthenCore</div>
              <h1>Leadership Assessment Report</h1>
              <div class="participant-info">
                <strong>${participantName}</strong><br>
                ${participantEmail}<br>
                Report Date: ${reportDate}
              </div>
            </div>
          </div>
          
          <div class="content">
            <!-- Executive Summary -->
            <div class="section">
              <h2 class="section-title">📊 Executive Summary</h2>
              
              <div class="profile-badge">
                ${results.profile.badge}
              </div>
              
              <p style="font-size: 1.1rem; color: #555; margin: 20px 0;">
                ${results.profile.description}
              </p>
              
              <div class="score-overview">
                <div class="score-card">
                  <div class="score-value">${results.overallScore}%</div>
                  <div class="score-label">Overall Leadership Effectiveness</div>
                </div>
                <div class="score-card">
                  <div class="score-value">${Math.round(results.profile.confidence)}%</div>
                  <div class="score-label">Profile Confidence</div>
                </div>
                <div class="score-card">
                  <div class="score-value">${Math.round(results.timeSpent / 60)}</div>
                  <div class="score-label">Minutes Completed</div>
                </div>
              </div>
            </div>

            <!-- Leadership Profile -->
            <div class="section">
              <h2 class="section-title">🎯 Leadership Profile Analysis</h2>
              
              <div style="background: #f8f9ff; padding: 25px; border-radius: 15px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-bottom: 15px;">Key Characteristics</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                  ${results.profile.characteristics.map(char => `
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="color: #28a745; font-weight: bold;">✓</span>
                      <span>${char}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div style="background: white; border: 2px solid #e0e6ff; padding: 25px; border-radius: 15px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">Profile Strengths</h3>
                <ul style="list-style: none; padding: 0;">
                  ${leadershipProfiles[results.profile.type].strengths.map(strength => `
                    <li style="padding: 8px 0; padding-left: 20px; position: relative;">
                      <span style="position: absolute; left: 0; color: #667eea; font-weight: bold;">→</span>
                      ${strength}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <!-- Dimension Analysis -->
            <div class="section">
              <h2 class="section-title">📈 Leadership Dimensions Analysis</h2>
              
              <div class="radar-chart-container">
                <div class="chart-title">Leadership Effectiveness Radar</div>
                <svg width="400" height="400" viewBox="0 0 400 400" style="margin: 0 auto;">
                  <!-- Background circles -->
                  <circle cx="200" cy="200" r="160" fill="none" stroke="#e0e6ff" stroke-width="1"/>
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#e0e6ff" stroke-width="1"/>
                  <circle cx="200" cy="200" r="80" fill="none" stroke="#e0e6ff" stroke-width="1"/>
                  <circle cx="200" cy="200" r="40" fill="none" stroke="#e0e6ff" stroke-width="1"/>
                  
                  <!-- Axis lines -->
                  <line x1="200" y1="40" x2="200" y2="360" stroke="#e0e6ff" stroke-width="1"/>
                  <line x1="40" y1="200" x2="360" y2="200" stroke="#e0e6ff" stroke-width="1"/>
                  <line x1="76" y1="76" x2="324" y2="324" stroke="#e0e6ff" stroke-width="1"/>
                  <line x1="324" y1="76" x2="76" y2="324" stroke="#e0e6ff" stroke-width="1"/>
                  
                  <!-- Data polygon -->
                  <polygon points="200,${200 - (results.dimensions.strategicThinking.score * 1.6)},${200 + (results.dimensions.communication.score * 1.6 * 0.866)},${200 + (results.dimensions.communication.score * 1.6 * 0.5)},${200 + (results.dimensions.teamDevelopment.score * 1.6 * 0.866)},${200 - (results.dimensions.teamDevelopment.score * 1.6 * 0.5)},200,${200 + (results.dimensions.decisionMaking.score * 1.6)},${200 - (results.dimensions.changeManagement.score * 1.6 * 0.866)},${200 - (results.dimensions.changeManagement.score * 1.6 * 0.5)},${200 - (results.dimensions.emotionalIntelligence.score * 1.6 * 0.866)},${200 + (results.dimensions.emotionalIntelligence.score * 1.6 * 0.5)}" 
                         fill="rgba(102,126,234,0.2)" 
                         stroke="#667eea" 
                         stroke-width="3"/>
                  
                  <!-- Labels -->
                  <text x="200" y="30" text-anchor="middle" fill="#667eea" font-weight="bold" font-size="12">Strategic</text>
                  <text x="340" y="120" text-anchor="middle" fill="#667eea" font-weight="bold" font-size="12">Emotional</text>
                  <text x="340" y="290" text-anchor="middle" fill="#667eea" font-weight="bold" font-size="12">Communication</text>
                  <text x="200" y="385" text-anchor="middle" fill="#667eea" font-weight="bold" font-size="12">Team Dev</text>
                  <text x="60" y="290" text-anchor="middle" fill="#667eea" font-weight="bold" font-size="12">Decision</text>
                  <text x="60" y="120" text-anchor="middle" fill="#667eea" font-weight="bold" font-size="12">Change</text>
                </svg>
              </div>
              
              <div class="dimensions-grid">
                ${Object.entries(results.dimensions).map(([key, dimension]) => {
                  const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const behavioralLevel = dimension.score >= 80 ? 'high' : dimension.score >= 60 ? 'moderate' : 'developing';
                  const indicators = leadershipBehavioralIndicators[key as keyof typeof leadershipBehavioralIndicators]?.[behavioralLevel] || [];
                  
                  return `
                    <div class="dimension-card">
                      <div class="dimension-title">${displayName}</div>
                      <div class="dimension-score">${dimension.score}%</div>
                      <div class="dimension-level level-${dimension.level.toLowerCase()}">${dimension.level}</div>
                      
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${dimension.score}%"></div>
                      </div>
                      
                      <div style="color: #666; font-size: 0.9rem; margin: 10px 0;">
                        ${dimension.percentile}th percentile
                      </div>
                      
                      <div class="behavioral-indicators">
                        <strong style="color: #667eea; font-size: 0.9rem;">Behavioral Indicators:</strong>
                        ${indicators.slice(0, 2).map(indicator => `
                          <div class="behavioral-indicator">${indicator}</div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Development Plan -->
            <div class="section">
              <h2 class="section-title">🎯 Leadership Development Plan</h2>
              
              <div class="development-areas">
                <h3 style="color: #667eea; margin-bottom: 20px; font-size: 1.4rem;">Priority Development Areas</h3>
                
                ${results.developmentAreas.map((area, index) => `
                  <div class="development-item priority-${area.priority.toLowerCase()}">
                    <div class="development-title">
                      ${area.dimension} 
                      <span style="background: ${area.priority === 'High' ? '#dc3545' : area.priority === 'Medium' ? '#ffc107' : '#28a745'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px;">
                        ${area.priority} Priority
                      </span>
                    </div>
                    <p style="color: #666; margin: 10px 0; font-size: 0.95rem;">${area.description}</p>
                    
                    <div style="margin-top: 15px;">
                      <strong style="color: #667eea; font-size: 0.9rem;">Recommended Strategies:</strong>
                      <ul class="development-strategies">
                        ${area.strategies.slice(0, 4).map(strategy => `<li>${strategy}</li>`).join('')}
                      </ul>
                    </div>
                    
                    <div style="margin-top: 15px; padding: 10px; background: #f8f9ff; border-radius: 8px;">
                      <strong style="color: #667eea; font-size: 0.9rem;">Recommended Timeframe:</strong> 
                      <span style="color: #333;">${area.timeframe}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action Plan -->
            <div class="section">
              <h2 class="section-title">📋 90-Day Action Plan</h2>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
                <div style="background: white; border: 2px solid #e0e6ff; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #667eea; margin-bottom: 15px;">🎯 First 30 Days</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Complete leadership self-assessment</li>
                    <li style="padding: 8px 0; color: #555;">→ Seek 360-degree feedback from team</li>
                    <li style="padding: 8px 0; color: #555;">→ Identify key development partner/coach</li>
                    <li style="padding: 8px 0; color: #555;">→ Set specific development goals</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0e6ff; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #667eea; margin-bottom: 15px;">🚀 Days 31-60</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Begin focused skill development</li>
                    <li style="padding: 8px 0; color: #555;">→ Practice new behaviors consistently</li>
                    <li style="padding: 8px 0; color: #555;">→ Seek regular feedback on progress</li>
                    <li style="padding: 8px 0; color: #555;">→ Adjust development plan based on results</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0e6ff; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #667eea; margin-bottom: 15px;">📈 Days 61-90</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Measure progress against goals</li>
                    <li style="padding: 8px 0; color: #555;">→ Integrate new habits into routine</li>
                    <li style="padding: 8px 0; color: #555;">→ Plan next phase of development</li>
                    <li style="padding: 8px 0; color: #555;">→ Share learnings with others</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              <strong>AuthenCore Leadership Assessment</strong><br>
              This report provides insights into leadership capabilities and development opportunities.<br>
              Results should be considered alongside other factors including experience, context, and organizational needs.<br><br>
              <em>Report generated on ${reportDate} • Confidential Leadership Assessment</em>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static generateEmployerReport(
    results: LeadershipResults,
    participantName: string,
    participantEmail: string,
    organizationInfo?: { name: string; position: string; teamSize: string; }
  ): string {
    const reportDate = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leadership Assessment - Employer Report</title>
        <style>
          /* Same base styles as candidate report */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          
          .logo {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .content {
            padding: 40px;
          }
          
          .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 1.8rem;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
          }
          
          .risk-high { background: #f8d7da; border-left: 4px solid #dc3545; }
          .risk-medium { background: #fff3cd; border-left: 4px solid #ffc107; }
          .risk-low { background: #d4edda; border-left: 4px solid #28a745; }
          
          .fit-assessment {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          
          .fit-card {
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e0e6ff;
          }
          
          .fit-score {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎯 AuthenCore</div>
            <h1>Leadership Assessment - Employer Report</h1>
            <div style="font-size: 1.1rem; opacity: 0.9; margin-top: 10px;">
              <strong>${participantName}</strong><br>
              ${organizationInfo?.name || 'Organization'} • ${organizationInfo?.position || 'Position'}<br>
              Report Date: ${reportDate}
            </div>
          </div>
          
          <div class="content">
            <!-- Executive Summary for Employers -->
            <div class="section">
              <h2 class="section-title">📊 Executive Summary</h2>
              
              <div style="background: #f8f9ff; padding: 25px; border-radius: 15px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-bottom: 15px;">Leadership Profile: ${results.profile.badge}</h3>
                <p style="font-size: 1.1rem; color: #555; margin-bottom: 15px;">
                  ${results.profile.description}
                </p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 20px;">
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 10px;">
                    <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${results.overallScore}%</div>
                    <div style="color: #666;">Overall Score</div>
                  </div>
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 10px;">
                    <div style="font-size: 2rem; font-weight: bold; color: #667eea;">${Math.round(results.profile.confidence)}%</div>
                    <div style="color: #666;">Profile Confidence</div>
                  </div>
                  <div style="text-align: center; padding: 15px; background: white; border-radius: 10px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #667eea;">${results.developmentAreas.length}</div>
                    <div style="color: #666;">Development Areas</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Role Fit Analysis -->
            <div class="section">
              <h2 class="section-title">🎯 Role Fit Analysis</h2>
              
              <div class="fit-assessment">
                <div class="fit-card">
                  <div class="fit-score">${this.calculateRoleFit(results, 'individual_contributor')}%</div>
                  <div>Individual Contributor</div>
                </div>
                <div class="fit-card">
                  <div class="fit-score">${this.calculateRoleFit(results, 'team_lead')}%</div>
                  <div>Team Lead</div>
                </div>
                <div class="fit-card">
                  <div class="fit-score">${this.calculateRoleFit(results, 'manager')}%</div>
                  <div>Manager</div>
                </div>
                <div class="fit-card">
                  <div class="fit-score">${this.calculateRoleFit(results, 'senior_manager')}%</div>
                  <div>Senior Manager</div>
                </div>
                <div class="fit-card">
                  <div class="fit-score">${this.calculateRoleFit(results, 'executive')}%</div>
                  <div>Executive</div>
                </div>
              </div>
            </div>

            <!-- Strengths and Risks -->
            <div class="section">
              <h2 class="section-title">⚡ Strengths & Risk Assessment</h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                  <h3 style="color: #28a745; margin-bottom: 15px;">🎯 Key Strengths</h3>
                  <div style="background: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
                    ${leadershipProfiles[results.profile.type].strengths.map(strength => `
                      <div style="display: flex; align-items: center; margin: 10px 0;">
                        <span style="color: #28a745; margin-right: 10px;">✓</span>
                        <span>${strength}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
                
                <div>
                  <h3 style="color: #dc3545; margin-bottom: 15px;">⚠️ Development Needs</h3>
                  <div style="background: #f8d7da; padding: 20px; border-radius: 10px; border-left: 4px solid #dc3545;">
                    ${leadershipProfiles[results.profile.type].developmentAreas.map(area => `
                      <div style="display: flex; align-items: center; margin: 10px 0;">
                        <span style="color: #dc3545; margin-right: 10px;">!</span>
                        <span>${area}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Hiring Recommendations -->
            <div class="section">
              <h2 class="section-title">💼 Hiring Recommendations</h2>
              
              ${this.generateHiringRecommendation(results)}
            </div>

            <!-- Interview Questions -->
            <div class="section">
              <h2 class="section-title">❓ Suggested Interview Questions</h2>
              
              <div style="background: #f8f9ff; padding: 25px; border-radius: 15px;">
                ${this.generateInterviewQuestions(results)}
              </div>
            </div>

            <!-- Performance Prediction -->
            <div class="section">
              <h2 class="section-title">📈 Performance Predictions</h2>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                ${Object.entries(results.behavioralProfile).map(([area, level]) => {
                  const displayName = area.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const indicators = leadershipBehavioralIndicators[area as keyof typeof leadershipBehavioralIndicators]?.[level] || [];
                  
                  return `
                    <div style="background: white; border: 2px solid ${level === 'high' ? '#28a745' : level === 'moderate' ? '#ffc107' : '#dc3545'}; border-radius: 10px; padding: 20px;">
                      <h4 style="color: ${level === 'high' ? '#28a745' : level === 'moderate' ? '#ffc107' : '#dc3545'}; margin-bottom: 10px;">${displayName}</h4>
                      <div style="font-size: 0.9rem; color: #666; text-transform: capitalize; margin-bottom: 10px;">${level} Performance Expected</div>
                      ${indicators.slice(0, 2).map(indicator => `
                        <div style="font-size: 0.85rem; color: #555; margin: 5px 0;">• ${indicator}</div>
                      `).join('')}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
          
          <div style="background: #f8f9ff; padding: 30px; text-align: center; border-top: 2px solid #e0e6ff;">
            <div style="color: #666; font-size: 0.9rem; line-height: 1.8;">
              <strong>AuthenCore Leadership Assessment - Employer Report</strong><br>
              This assessment provides insights for hiring and development decisions.<br>
              Results should be used alongside interviews, references, and other evaluation methods.<br><br>
              <em>Confidential Report • Generated ${reportDate}</em>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static async generateAndDownloadReport(
    results: LeadershipResults,
    participantName: string,
    participantEmail: string,
    reportType: 'candidate' | 'employer' = 'candidate',
    organizationInfo?: { name: string; position: string; teamSize: string; }
  ): Promise<void> {
    const html = reportType === 'candidate' 
      ? this.generateCandidateReport(results, participantName, participantEmail)
      : this.generateEmployerReport(results, participantName, participantEmail, organizationInfo);
    
    // Open in new window for printing/saving
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    } else {
      // Fallback: download as HTML file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Leadership-${reportType}-Report-${participantName.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  // Helper methods for employer report
  private static calculateRoleFit(results: LeadershipResults, role: string): number {
    const { dimensions } = results;
    
    const roleWeights = {
      individual_contributor: {
        strategicThinking: 0.1,
        emotionalIntelligence: 0.2,
        communication: 0.2,
        teamDevelopment: 0.1,
        decisionMaking: 0.3,
        changeManagement: 0.1
      },
      team_lead: {
        strategicThinking: 0.15,
        emotionalIntelligence: 0.25,
        communication: 0.25,
        teamDevelopment: 0.25,
        decisionMaking: 0.1,
        changeManagement: 0.0
      },
      manager: {
        strategicThinking: 0.2,
        emotionalIntelligence: 0.2,
        communication: 0.2,
        teamDevelopment: 0.3,
        decisionMaking: 0.1,
        changeManagement: 0.0
      },
      senior_manager: {
        strategicThinking: 0.3,
        emotionalIntelligence: 0.15,
        communication: 0.15,
        teamDevelopment: 0.2,
        decisionMaking: 0.1,
        changeManagement: 0.1
      },
      executive: {
        strategicThinking: 0.35,
        emotionalIntelligence: 0.15,
        communication: 0.15,
        teamDevelopment: 0.15,
        decisionMaking: 0.1,
        changeManagement: 0.1
      }
    };
    
    const weights = roleWeights[role as keyof typeof roleWeights];
    let score = 0;
    
    Object.entries(weights).forEach(([dimension, weight]) => {
      score += dimensions[dimension as keyof typeof dimensions].score * weight;
    });
    
    return Math.round(score);
  }

  private static generateHiringRecommendation(results: LeadershipResults): string {
    const overallScore = results.overallScore;
    
    if (overallScore >= 85) {
      return `
        <div style="background: #d4edda; padding: 25px; border-radius: 10px; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-bottom: 15px;">✅ Strong Hire Recommendation</h3>
          <p style="color: #155724; font-size: 1.1rem; margin-bottom: 15px;">
            This candidate demonstrates exceptional leadership capabilities across multiple dimensions. 
            They show strong potential for immediate impact and long-term success in leadership roles.
          </p>
          <ul style="color: #155724; margin-left: 20px;">
            <li>Ready for immediate leadership responsibilities</li>
            <li>Strong foundation for continued growth</li>
            <li>Low risk, high potential hire</li>
            <li>Could contribute to leadership development of others</li>
          </ul>
        </div>
      `;
    } else if (overallScore >= 70) {
      return `
        <div style="background: #fff3cd; padding: 25px; border-radius: 10px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-bottom: 15px;">⚠️ Conditional Hire Recommendation</h3>
          <p style="color: #856404; font-size: 1.1rem; margin-bottom: 15px;">
            This candidate shows good leadership potential but may benefit from additional development 
            or a structured onboarding program. Consider hire with development support.
          </p>
          <ul style="color: #856404; margin-left: 20px;">
            <li>Solid foundation with specific development needs</li>
            <li>Would benefit from mentorship or coaching</li>
            <li>Consider role-specific fit and support systems</li>
            <li>Monitor progress closely in first 90 days</li>
          </ul>
        </div>
      `;
    } else {
      return `
        <div style="background: #f8d7da; padding: 25px; border-radius: 10px; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-bottom: 15px;">❌ Development Required</h3>
          <p style="color: #721c24; font-size: 1.1rem; margin-bottom: 15px;">
            This candidate shows emerging leadership potential but requires significant development 
            before taking on full leadership responsibilities. Consider for development programs.
          </p>
          <ul style="color: #721c24; margin-left: 20px;">
            <li>Not ready for immediate leadership role</li>
            <li>Could benefit from leadership development program</li>
            <li>Consider individual contributor role with leadership training</li>
            <li>Reassess after 6-12 months of development</li>
          </ul>
        </div>
      `;
    }
  }

  private static generateInterviewQuestions(results: LeadershipResults): string {
    const lowDimensions = Object.entries(results.dimensions)
      .filter(([_, dim]) => dim.score < 70)
      .slice(0, 3);
    
    const questionMap = {
      strategicThinking: [
        "Describe a time when you had to develop a long-term strategy for your team or organization.",
        "How do you stay informed about industry trends and incorporate them into your planning?",
        "Tell me about a complex problem you solved that required looking at the big picture."
      ],
      emotionalIntelligence: [
        "Describe a situation where you had to manage your emotions during a difficult conversation.",
        "Tell me about a time when you helped a team member through a challenging period.",
        "How do you handle stress and maintain composure under pressure?"
      ],
      communication: [
        "Describe a time when you had to communicate a difficult message to your team.",
        "How do you adapt your communication style to different audiences?",
        "Tell me about a presentation or communication that didn't go as planned and what you learned."
      ],
      teamDevelopment: [
        "Describe how you've helped a team member grow and develop their skills.",
        "Tell me about a time when you had to delegate an important task.",
        "How do you build trust and psychological safety within your team?"
      ],
      decisionMaking: [
        "Describe a difficult decision you made with limited information.",
        "Tell me about a time when you had to make an unpopular decision.",
        "How do you balance data analysis with intuition in your decision-making?"
      ],
      changeManagement: [
        "Describe a significant change you led in your organization.",
        "How do you help team members adapt to change?",
        "Tell me about a time when you had to pivot strategy quickly."
      ]
    };
    
    let questions = `
      <h4 style="color: #667eea; margin-bottom: 15px;">Strengths-Based Questions</h4>
      <ul style="margin-left: 20px; margin-bottom: 25px;">
        <li style="margin: 10px 0; color: #555;">Tell me about your greatest leadership accomplishment.</li>
        <li style="margin: 10px 0; color: #555;">Describe your leadership philosophy and how it guides your actions.</li>
        <li style="margin: 10px 0; color: #555;">What feedback do you typically receive about your leadership style?</li>
      </ul>
    `;
    
    if (lowDimensions.length > 0) {
      questions += `
        <h4 style="color: #667eea; margin-bottom: 15px;">Development-Focused Questions</h4>
        <ul style="margin-left: 20px;">
      `;
      
      lowDimensions.forEach(([dimension, _]) => {
        const dimensionQuestions = questionMap[dimension as keyof typeof questionMap] || [];
        questions += `<li style="margin: 10px 0; color: #555;">${dimensionQuestions[0]}</li>`;
      });
      
      questions += '</ul>';
    }
    
    return questions;
  }
}