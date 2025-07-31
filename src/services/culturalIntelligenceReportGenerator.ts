import { supabase } from '@/integrations/supabase/client';

// Cultural Intelligence Profile Types
export const culturalIntelligenceProfiles = {
  GLOBAL_AMBASSADOR: {
    name: "Global Ambassador",
    badge: "🌍 Global Ambassador", 
    description: "Exceptional cultural intelligence with strong cross-cultural leadership abilities",
    characteristics: ["Culturally adaptive", "Global communicator", "Cross-cultural leader", "Cultural bridge-builder"],
    strengths: ["Cultural empathy", "Global business acumen", "Cross-cultural communication", "Cultural adaptation"],
    developmentAreas: ["Deep cultural specialization", "Regional expertise", "Local relationship building"]
  },
  CULTURAL_NAVIGATOR: {
    name: "Cultural Navigator",
    badge: "🧭 Cultural Navigator",
    description: "Strong cultural awareness with effective cross-cultural communication skills", 
    characteristics: ["Culturally aware", "Adaptive communicator", "Respectful collaborator", "Open-minded"],
    strengths: ["Cultural sensitivity", "Communication adaptation", "Respectful interaction", "Cultural learning"],
    developmentAreas: ["Cultural knowledge depth", "Complex negotiation skills", "Advanced cultural frameworks"]
  },
  CROSS_CULTURAL_COLLABORATOR: {
    name: "Cross-Cultural Collaborator",
    badge: "🤝 Cross-Cultural Collaborator",
    description: "Good cultural intelligence with developing global business skills",
    characteristics: ["Team-oriented", "Culturally curious", "Collaborative", "Learning-focused"],
    strengths: ["Team collaboration", "Cultural openness", "Relationship building", "Cultural respect"],
    developmentAreas: ["Cultural knowledge", "Global business skills", "Advanced communication"]
  },
  EMERGING_GLOBAL_PROFESSIONAL: {
    name: "Emerging Global Professional", 
    badge: "🌱 Emerging Global Professional",
    description: "Developing cultural intelligence with growth potential in global contexts",
    characteristics: ["Culturally curious", "Willing to learn", "Open to diversity", "Growth-oriented"],
    strengths: ["Learning agility", "Cultural openness", "Adaptability", "Global mindset"],
    developmentAreas: ["Cultural knowledge", "Cross-cultural skills", "Global experience", "Cultural frameworks"]
  }
};

// Behavioral indicators for cultural intelligence
export const culturalBehavioralIndicators = {
  culturalKnowledge: {
    high: ["Demonstrates deep understanding of multiple cultures", "Recognizes cultural nuances", "Applies cultural frameworks effectively", "Anticipates cultural differences"],
    moderate: ["Shows awareness of cultural differences", "Understands basic cultural concepts", "Applies some cultural knowledge", "Learning cultural frameworks"],
    developing: ["Limited cultural knowledge", "Basic cultural awareness", "Needs cultural education", "Requires cultural exposure"]
  },
  crossCulturalCommunication: {
    high: ["Adapts communication style to cultural context", "Communicates effectively across cultures", "Builds rapport with diverse groups", "Facilitates cross-cultural dialogue"],
    moderate: ["Adjusts communication somewhat", "Generally effective with other cultures", "Shows cultural sensitivity", "Building cross-cultural skills"],
    developing: ["Struggles with cultural communication", "Limited adaptation ability", "Needs communication development", "Requires cultural training"]
  },
  culturalAdaptation: {
    high: ["Quickly adapts to new cultural environments", "Modifies behavior appropriately", "Thrives in diverse settings", "Helps others adapt culturally"],
    moderate: ["Adapts to familiar cultures", "Shows flexibility in known contexts", "Generally comfortable with diversity", "Developing adaptation skills"],
    developing: ["Struggles with cultural change", "Prefers familiar environments", "Limited adaptation ability", "Needs support in diverse settings"]
  },
  globalMindset: {
    high: ["Thinks globally in decision-making", "Values cultural diversity", "Seeks international perspectives", "Champions global initiatives"],
    moderate: ["Shows interest in global issues", "Appreciates cultural diversity", "Considers international factors", "Open to global opportunities"],
    developing: ["Limited global perspective", "Local focus predominates", "Needs global exposure", "Requires international development"]
  }
};

export interface CulturalIntelligenceResults {
  dimensions: {
    culturalKnowledge: { score: number; level: string; percentile: number };
    culturalEmpathy: { score: number; level: string; percentile: number };
    crossCulturalCommunication: { score: number; level: string; percentile: number };
    culturalAdaptation: { score: number; level: string; percentile: number };
    globalMindset: { score: number; level: string; percentile: number };
    internationalBusinessSkills: { score: number; level: string; percentile: number };
  };
  overallScore: number;
  cqIndex: number; // Cultural Intelligence Index (0-100)
  profile: {
    type: keyof typeof culturalIntelligenceProfiles;
    name: string;
    badge: string;
    description: string;
    characteristics: string[];
    confidence: number;
  };
  behavioralProfile: {
    culturalKnowledge: 'high' | 'moderate' | 'developing';
    crossCulturalCommunication: 'high' | 'moderate' | 'developing';
    culturalAdaptation: 'high' | 'moderate' | 'developing';
    globalMindset: 'high' | 'moderate' | 'developing';
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

export class CulturalIntelligenceReportGenerator {
  static generateCandidateReport(
    results: CulturalIntelligenceResults,
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
        <title>Cultural Intelligence Report - ${participantName}</title>
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
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
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
            background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
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
            color: #06b6d4;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #06b6d4;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .profile-badge {
            display: inline-block;
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 1.3rem;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 8px 16px rgba(6,182,212,0.3);
          }
          
          .score-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          
          .score-card {
            background: linear-gradient(135deg, #f0fdff, #e0f7fa);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #06b6d4;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .score-value {
            font-size: 3rem;
            font-weight: bold;
            color: #06b6d4;
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
            border: 2px solid #e0f7fa;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .dimension-card:hover {
            border-color: #06b6d4;
            box-shadow: 0 8px 16px rgba(6,182,212,0.15);
          }
          
          .dimension-title {
            font-size: 1.3rem;
            color: #06b6d4;
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
            background: linear-gradient(90deg, #06b6d4, #0891b2);
            border-radius: 6px;
            transition: width 0.8s ease;
          }
          
          .development-areas {
            background: #f0fdff;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
          }
          
          .development-item {
            background: white;
            border-left: 4px solid #06b6d4;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          .priority-high { border-left-color: #dc3545; }
          .priority-medium { border-left-color: #ffc107; }
          .priority-low { border-left-color: #28a745; }
          
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
            color: #06b6d4;
            font-weight: bold;
          }
          
          .cultural-scenarios {
            background: #f0fdff;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
          }
          
          .scenario-item {
            background: white;
            border: 2px solid #e0f7fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .footer {
            background: #f0fdff;
            padding: 30px;
            text-align: center;
            border-top: 2px solid #e0f7fa;
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
              <div class="logo">🌍 AuthenCore</div>
              <h1>Cultural Intelligence Assessment Report</h1>
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
              <h2 class="section-title">🌍 Cultural Intelligence Profile</h2>
              
              <div class="profile-badge">
                ${results.profile.badge}
              </div>
              
              <p style="font-size: 1.1rem; color: #555; margin: 20px 0;">
                ${results.profile.description}
              </p>
              
              <div class="score-overview">
                <div class="score-card">
                  <div class="score-value">${results.overallScore}%</div>
                  <div class="score-label">Overall Cultural Intelligence</div>
                </div>
                <div class="score-card">
                  <div class="score-value">${results.cqIndex}%</div>
                  <div class="score-label">CQ Index Score</div>
                </div>
                <div class="score-card">
                  <div class="score-value">${Math.round(results.profile.confidence)}%</div>
                  <div class="score-label">Profile Confidence</div>
                </div>
              </div>
            </div>

            <!-- Cultural Intelligence Dimensions -->
            <div class="section">
              <h2 class="section-title">📊 Cultural Intelligence Dimensions</h2>
              
              <div class="dimensions-grid">
                ${Object.entries(results.dimensions).map(([key, dimension]) => {
                  const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const behavioralLevel = dimension.score >= 80 ? 'high' : dimension.score >= 60 ? 'moderate' : 'developing';
                  
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
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Global Business Scenarios -->
            <div class="section">
              <h2 class="section-title">🌐 Global Business Applications</h2>
              
              <div class="cultural-scenarios">
                <h3 style="color: #06b6d4; margin-bottom: 20px;">Cultural Competency in Action</h3>
                
                <div class="scenario-item">
                  <h4 style="color: #06b6d4; margin-bottom: 10px;">🤝 Cross-Cultural Meetings</h4>
                  <p style="color: #555;">
                    Your CQ score of ${results.overallScore}% indicates ${results.overallScore >= 80 ? 'strong' : results.overallScore >= 60 ? 'developing' : 'emerging'} 
                    ability to facilitate effective cross-cultural meetings. You ${results.overallScore >= 80 ? 'excel at' : results.overallScore >= 60 ? 'show promise in' : 'are developing skills for'} 
                    adapting communication styles and managing cultural differences in group settings.
                  </p>
                </div>
                
                <div class="scenario-item">
                  <h4 style="color: #06b6d4; margin-bottom: 10px;">🌏 International Negotiations</h4>
                  <p style="color: #555;">
                    With your cultural intelligence profile, you ${results.cqIndex >= 75 ? 'demonstrate high competency' : results.cqIndex >= 55 ? 'show developing skills' : 'are building foundation skills'} 
                    in navigating complex international business negotiations while respecting cultural protocols.
                  </p>
                </div>
                
                <div class="scenario-item">
                  <h4 style="color: #06b6d4; margin-bottom: 10px;">🌍 Global Team Leadership</h4>
                  <p style="color: #555;">
                    Your assessment results suggest you ${results.dimensions.crossCulturalCommunication.score >= 70 ? 'can effectively lead' : results.dimensions.crossCulturalCommunication.score >= 50 ? 'are developing capacity to lead' : 'would benefit from training to lead'} 
                    diverse, geographically distributed teams with cultural sensitivity.
                  </p>
                </div>
              </div>
            </div>

            <!-- Development Plan -->
            <div class="section">
              <h2 class="section-title">🎯 Cultural Intelligence Development Plan</h2>
              
              <div class="development-areas">
                <h3 style="color: #06b6d4; margin-bottom: 20px; font-size: 1.4rem;">Priority Development Areas</h3>
                
                ${results.developmentAreas.map((area, index) => `
                  <div class="development-item priority-${area.priority.toLowerCase()}">
                    <div style="font-size: 1.2rem; font-weight: 600; color: #333; margin-bottom: 10px;">
                      ${area.dimension} 
                      <span style="background: ${area.priority === 'High' ? '#dc3545' : area.priority === 'Medium' ? '#ffc107' : '#28a745'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px;">
                        ${area.priority} Priority
                      </span>
                    </div>
                    <p style="color: #666; margin: 10px 0; font-size: 0.95rem;">${area.description}</p>
                    
                    <div style="margin-top: 15px;">
                      <strong style="color: #06b6d4; font-size: 0.9rem;">Recommended Strategies:</strong>
                      <ul class="development-strategies">
                        ${area.strategies.slice(0, 4).map(strategy => `<li>${strategy}</li>`).join('')}
                      </ul>
                    </div>
                    
                    <div style="margin-top: 15px; padding: 10px; background: #f0fdff; border-radius: 8px;">
                      <strong style="color: #06b6d4; font-size: 0.9rem;">Recommended Timeframe:</strong> 
                      <span style="color: #333;">${area.timeframe}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Cultural Learning Roadmap -->
            <div class="section">
              <h2 class="section-title">🗺️ Cultural Learning Roadmap</h2>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
                <div style="background: white; border: 2px solid #e0f7fa; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #06b6d4; margin-bottom: 15px;">📚 Immediate Learning (0-3 months)</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Complete cultural frameworks training</li>
                    <li style="padding: 8px 0; color: #555;">→ Practice cross-cultural communication</li>
                    <li style="padding: 8px 0; color: #555;">→ Seek diverse cultural interactions</li>
                    <li style="padding: 8px 0; color: #555;">→ Study specific cultural contexts</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0f7fa; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #06b6d4; margin-bottom: 15px;">🚀 Skill Building (3-6 months)</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Engage in cross-cultural projects</li>
                    <li style="padding: 8px 0; color: #555;">→ Develop cultural mentorship relationships</li>
                    <li style="padding: 8px 0; color: #555;">→ Practice cultural adaptation strategies</li>
                    <li style="padding: 8px 0; color: #555;">→ Build global business knowledge</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0f7fa; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #06b6d4; margin-bottom: 15px;">🌟 Mastery Development (6+ months)</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Lead cross-cultural initiatives</li>
                    <li style="padding: 8px 0; color: #555;">→ Develop cultural training programs</li>
                    <li style="padding: 8px 0; color: #555;">→ Pursue international assignments</li>
                    <li style="padding: 8px 0; color: #555;">→ Become cultural intelligence champion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              <strong>AuthenCore Cultural Intelligence Assessment</strong><br>
              This report provides insights into cultural intelligence and global business capabilities.<br>
              Results should be considered alongside other factors including experience, context, and specific cultural needs.<br><br>
              <em>Report generated on ${reportDate} • Confidential Cultural Intelligence Assessment</em>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static async generateAndDownloadReport(
    results: CulturalIntelligenceResults,
    participantName: string,
    participantEmail: string
  ): Promise<void> {
    const html = this.generateCandidateReport(results, participantName, participantEmail);
    
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
      a.download = `Cultural-Intelligence-Report-${participantName.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}