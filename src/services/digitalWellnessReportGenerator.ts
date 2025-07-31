import { supabase } from '@/integrations/supabase/client';

// Digital Wellness Profile Types
export const digitalWellnessProfiles = {
  DIGITAL_MASTER: {
    name: "Digital Master",
    badge: "💎 Digital Master",
    description: "Exceptional digital wellness with optimal technology-life balance",
    characteristics: ["Mindful tech user", "High digital productivity", "Excellent boundaries", "Tech-life harmony"],
    strengths: ["Digital boundaries", "Productivity optimization", "Mindful consumption", "Tech-wellness balance"],
    developmentAreas: ["Advanced digital strategies", "Mentoring others", "Innovation adoption"]
  },
  BALANCED_DIGITAL_USER: {
    name: "Balanced Digital User", 
    badge: "⚖️ Balanced Digital User",
    description: "Good digital wellness with effective technology management",
    characteristics: ["Conscious tech use", "Good boundaries", "Productive habits", "Wellness-aware"],
    strengths: ["Digital awareness", "Boundary setting", "Productive workflows", "Health consciousness"],
    developmentAreas: ["Advanced optimization", "Stress management", "Digital leadership"]
  },
  DEVELOPING_DIGITAL_WELLNESS: {
    name: "Developing Digital Wellness",
    badge: "🌱 Developing Digital Wellness", 
    description: "Building digital wellness habits with room for improvement",
    characteristics: ["Awareness growing", "Habit building", "Learning boundaries", "Seeking balance"],
    strengths: ["Self-awareness", "Willingness to change", "Learning mindset", "Health focus"],
    developmentAreas: ["Digital boundaries", "Productivity systems", "Stress reduction", "Mindful usage"]
  },
  DIGITAL_OVERWHELM: {
    name: "Digital Overwhelm",
    badge: "⚠️ Digital Overwhelm",
    description: "Experiencing digital stress with significant improvement needed",
    characteristics: ["High digital stress", "Poor boundaries", "Overwhelmed", "Needs support"],
    strengths: ["Recognition of issues", "Motivation to change", "Potential for growth", "Self-awareness"],
    developmentAreas: ["Immediate boundaries", "Stress management", "Digital detox", "Professional support"]
  }
};

// Behavioral indicators for digital wellness
export const digitalWellnessBehavioralIndicators = {
  digitalConsumption: {
    high: ["Mindful and purposeful digital consumption", "Curates high-quality content", "Limits unnecessary browsing", "Uses technology intentionally"],
    moderate: ["Generally mindful of digital usage", "Some awareness of consumption patterns", "Occasional mindless browsing", "Working on intentional use"],
    developing: ["High digital consumption", "Mindless scrolling habits", "Poor content curation", "Reactive technology use"]
  },
  technologyProductivity: {
    high: ["Technology enhances productivity significantly", "Optimized digital workflows", "Efficient tool usage", "Minimal digital distractions"],
    moderate: ["Technology generally helpful", "Some productivity systems", "Occasional distractions", "Building efficiency"],
    developing: ["Technology hinders productivity", "Poor digital organization", "Frequent distractions", "Inefficient workflows"]
  },
  digitalStress: {
    high: ["Minimal technology-related stress", "Excellent digital coping", "Calm relationship with tech", "Stress-free digital interactions"],
    moderate: ["Some digital stress present", "Generally manages well", "Occasional tech anxiety", "Developing coping strategies"],
    developing: ["High digital stress levels", "Tech anxiety frequent", "Overwhelmed by notifications", "Poor stress management"]
  },
  digitalBoundaries: {
    high: ["Excellent digital boundaries", "Clear tech-free times", "Healthy usage limits", "Strong self-regulation"],
    moderate: ["Some digital boundaries set", "Generally good limits", "Occasional boundary slips", "Working on consistency"],
    developing: ["Poor digital boundaries", "Always-on mentality", "Difficulty disconnecting", "Needs boundary training"]
  }
};

export interface DigitalWellnessResults {
  dimensions: {
    digitalConsumption: { score: number; level: string; percentile: number };
    technologyProductivity: { score: number; level: string; percentile: number };
    digitalStress: { score: number; level: string; percentile: number };
    informationManagement: { score: number; level: string; percentile: number };
    digitalBoundaries: { score: number; level: string; percentile: number };
    techLifeBalance: { score: number; level: string; percentile: number };
  };
  overallScore: number;
  wellnessIndex: number; // Digital Wellness Index (0-100)
  profile: {
    type: keyof typeof digitalWellnessProfiles;
    name: string;
    badge: string;
    description: string;
    characteristics: string[];
    confidence: number;
  };
  behavioralProfile: {
    digitalConsumption: 'high' | 'moderate' | 'developing';
    technologyProductivity: 'high' | 'moderate' | 'developing';
    digitalStress: 'high' | 'moderate' | 'developing';
    digitalBoundaries: 'high' | 'moderate' | 'developing';
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

export class DigitalWellnessReportGenerator {
  static generateCandidateReport(
    results: DigitalWellnessResults,
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
        <title>Digital Wellness Report - ${participantName}</title>
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
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
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
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
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
            color: #0ea5e9;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #0ea5e9;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .profile-badge {
            display: inline-block;
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 1.3rem;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 8px 16px rgba(14,165,233,0.3);
          }
          
          .score-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          
          .score-card {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #0ea5e9;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .score-value {
            font-size: 3rem;
            font-weight: bold;
            color: #0ea5e9;
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
            border: 2px solid #e0f2fe;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .dimension-card:hover {
            border-color: #0ea5e9;
            box-shadow: 0 8px 16px rgba(14,165,233,0.15);
          }
          
          .dimension-title {
            font-size: 1.3rem;
            color: #0ea5e9;
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
          
          .level-excellent { background: #d4edda; color: #155724; }
          .level-good { background: #cce7ff; color: #004085; }
          .level-developing { background: #fff3cd; color: #856404; }
          .level-poor { background: #f8d7da; color: #721c24; }
          
          .progress-bar {
            background: #e9ecef;
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin: 10px 0;
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #0ea5e9, #0284c7);
            border-radius: 6px;
            transition: width 0.8s ease;
          }
          
          .digital-tips {
            background: #f0f9ff;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
          }
          
          .tip-item {
            background: white;
            border: 2px solid #e0f2fe;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .development-areas {
            background: #f0f9ff;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
          }
          
          .development-item {
            background: white;
            border-left: 4px solid #0ea5e9;
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
            color: #0ea5e9;
            font-weight: bold;
          }
          
          .footer {
            background: #f0f9ff;
            padding: 30px;
            text-align: center;
            border-top: 2px solid #e0f2fe;
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
              <div class="logo">💻 AuthenCore</div>
              <h1>Digital Wellness Assessment Report</h1>
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
              <h2 class="section-title">💎 Digital Wellness Profile</h2>
              
              <div class="profile-badge">
                ${results.profile.badge}
              </div>
              
              <p style="font-size: 1.1rem; color: #555; margin: 20px 0;">
                ${results.profile.description}
              </p>
              
              <div class="score-overview">
                <div class="score-card">
                  <div class="score-value">${results.overallScore}%</div>
                  <div class="score-label">Overall Digital Wellness</div>
                </div>
                <div class="score-card">
                  <div class="score-value">${results.wellnessIndex}%</div>
                  <div class="score-label">Wellness Index</div>
                </div>
                <div class="score-card">
                  <div class="score-value">${Math.round(results.profile.confidence)}%</div>
                  <div class="score-label">Profile Confidence</div>
                </div>
              </div>
            </div>

            <!-- Digital Wellness Dimensions -->
            <div class="section">
              <h2 class="section-title">📊 Digital Wellness Dimensions</h2>
              
              <div class="dimensions-grid">
                ${Object.entries(results.dimensions).map(([key, dimension]) => {
                  const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const behavioralLevel = dimension.score >= 80 ? 'excellent' : dimension.score >= 60 ? 'good' : dimension.score >= 40 ? 'developing' : 'poor';
                  
                  return `
                    <div class="dimension-card">
                      <div class="dimension-title">${displayName}</div>
                      <div class="dimension-score">${dimension.score}%</div>
                      <div class="dimension-level level-${behavioralLevel}">${dimension.level}</div>
                      
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

            <!-- Digital Wellness Tips -->
            <div class="section">
              <h2 class="section-title">💡 Personalized Digital Wellness Tips</h2>
              
              <div class="digital-tips">
                <h3 style="color: #0ea5e9; margin-bottom: 20px;">Based on Your Assessment Results</h3>
                
                <div class="tip-item">
                  <h4 style="color: #0ea5e9; margin-bottom: 10px;">📱 Digital Boundaries</h4>
                  <p style="color: #555;">
                    ${results.dimensions.digitalBoundaries.score >= 70 ? 
                      'Your digital boundaries are strong. Continue maintaining tech-free times and consider mentoring others on boundary setting.' : 
                      results.dimensions.digitalBoundaries.score >= 50 ? 
                      'Your digital boundaries show promise. Focus on creating consistent tech-free zones and times throughout your day.' :
                      'Building digital boundaries is a priority. Start with small changes like phone-free meals and designated offline hours.'
                    }
                  </p>
                </div>
                
                <div class="tip-item">
                  <h4 style="color: #0ea5e9; margin-bottom: 10px;">⚡ Technology Productivity</h4>
                  <p style="color: #555;">
                    ${results.dimensions.technologyProductivity.score >= 70 ? 
                      'You excel at using technology productively. Share your strategies with others and explore advanced productivity tools.' : 
                      results.dimensions.technologyProductivity.score >= 50 ? 
                      'Your technology productivity is developing well. Focus on eliminating digital distractions and optimizing workflows.' :
                      'Technology productivity needs attention. Start by organizing digital files and reducing notification interruptions.'
                    }
                  </p>
                </div>
                
                <div class="tip-item">
                  <h4 style="color: #0ea5e9; margin-bottom: 10px;">🧘 Digital Stress Management</h4>
                  <p style="color: #555;">
                    ${results.dimensions.digitalStress.score >= 70 ? 
                      'You manage digital stress exceptionally well. Your calm relationship with technology is a strength to maintain.' : 
                      results.dimensions.digitalStress.score >= 50 ? 
                      'Digital stress is manageable but could improve. Practice mindful technology use and regular digital breaks.' :
                      'Digital stress is significantly impacting you. Consider a digital detox and professional support for technology-related anxiety.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <!-- Development Plan -->
            <div class="section">
              <h2 class="section-title">🎯 Digital Wellness Development Plan</h2>
              
              <div class="development-areas">
                <h3 style="color: #0ea5e9; margin-bottom: 20px; font-size: 1.4rem;">Priority Development Areas</h3>
                
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
                      <strong style="color: #0ea5e9; font-size: 0.9rem;">Recommended Strategies:</strong>
                      <ul class="development-strategies">
                        ${area.strategies.slice(0, 4).map(strategy => `<li>${strategy}</li>`).join('')}
                      </ul>
                    </div>
                    
                    <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 8px;">
                      <strong style="color: #0ea5e9; font-size: 0.9rem;">Recommended Timeframe:</strong> 
                      <span style="color: #333;">${area.timeframe}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Digital Wellness Action Plan -->
            <div class="section">
              <h2 class="section-title">📋 30-Day Digital Wellness Challenge</h2>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
                <div style="background: white; border: 2px solid #e0f2fe; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #0ea5e9; margin-bottom: 15px;">📱 Week 1: Digital Awareness</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Track daily screen time</li>
                    <li style="padding: 8px 0; color: #555;">→ Identify peak usage patterns</li>
                    <li style="padding: 8px 0; color: #555;">→ Notice digital stress triggers</li>
                    <li style="padding: 8px 0; color: #555;">→ Set baseline wellness metrics</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0f2fe; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #0ea5e9; margin-bottom: 15px;">⚙️ Week 2: Digital Optimization</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Organize digital workspace</li>
                    <li style="padding: 8px 0; color: #555;">→ Streamline notification settings</li>
                    <li style="padding: 8px 0; color: #555;">→ Create productivity systems</li>
                    <li style="padding: 8px 0; color: #555;">→ Eliminate digital clutter</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0f2fe; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #0ea5e9; margin-bottom: 15px;">🛡️ Week 3: Digital Boundaries</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Establish tech-free zones</li>
                    <li style="padding: 8px 0; color: #555;">→ Create digital curfews</li>
                    <li style="padding: 8px 0; color: #555;">→ Practice mindful usage</li>
                    <li style="padding: 8px 0; color: #555;">→ Build offline activities</li>
                  </ul>
                </div>
                
                <div style="background: white; border: 2px solid #e0f2fe; border-radius: 15px; padding: 25px;">
                  <h3 style="color: #0ea5e9; margin-bottom: 15px;">🌟 Week 4: Digital Mastery</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li style="padding: 8px 0; color: #555;">→ Integrate wellness habits</li>
                    <li style="padding: 8px 0; color: #555;">→ Evaluate progress made</li>
                    <li style="padding: 8px 0; color: #555;">→ Plan long-term strategies</li>
                    <li style="padding: 8px 0; color: #555;">→ Share learnings with others</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-text">
              <strong>AuthenCore Digital Wellness Assessment</strong><br>
              This report provides insights into digital wellness and technology-life balance.<br>
              Results should be considered alongside personal goals and lifestyle factors.<br><br>
              <em>Report generated on ${reportDate} • Confidential Digital Wellness Assessment</em>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static async generateAndDownloadReport(
    results: DigitalWellnessResults,
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
      a.download = `Digital-Wellness-Report-${participantName.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
}