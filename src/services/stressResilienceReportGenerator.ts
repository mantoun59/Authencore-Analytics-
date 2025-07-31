// Professional Stress Resilience Report Generator
// Using generic results interface for Stress Resilience assessment

export interface StressResilienceReportData {
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    organization?: string;
    assessmentDate: string;
  };
  results: any;
  reportType: 'candidate' | 'employer';
}

// Resilience Profiles based on comprehensive scoring
const getResilienceProfile = (scores: any) => {
  const avgScore = scores.overallScore || 70;
  
  if (avgScore >= 85) return {
    type: 'Resilience Champion',
    badge: '🛡️',
    color: '#22c55e',
    description: 'Exceptional stress management and adaptability under pressure',
    level: 'Exceptional'
  };
  
  if (avgScore >= 75) return {
    type: 'Stress Navigator',
    badge: '⚡',
    color: '#3b82f6', 
    description: 'Strong coping mechanisms with effective stress response',
    level: 'High'
  };
  
  if (avgScore >= 65) return {
    type: 'Resilience Builder',
    badge: '🏗️',
    color: '#8b5cf6',
    description: 'Developing resilience skills with good foundation',
    level: 'Moderate'
  };
  
  if (avgScore >= 55) return {
    type: 'Stress Learner',
    badge: '📚',
    color: '#f59e0b',
    description: 'Learning to manage stress with emerging techniques',
    level: 'Developing'
  };
  
  return {
    type: 'Resilience Seeker',
    badge: '🌱',
    color: '#ef4444',
    description: 'Beginning stress management journey with growth potential',
    level: 'Foundation'
  };
};

export const generateStressResilienceReport = (data: StressResilienceReportData): string => {
  const { candidateInfo, results, reportType } = data;
  const profile = getResilienceProfile(results);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stress & Resilience Assessment Report - ${candidateInfo.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        :root {
            --primary: 217 91% 60%;
            --primary-foreground: 0 0% 98%;
            --secondary: 210 40% 96%;
            --secondary-foreground: 222.2 84% 4.9%;
            --muted: 210 40% 96%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --border: 214.3 31.8% 91.4%;
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --success: 142 76% 36%;
            --warning: 38 92% 50%;
            --destructive: 0 84% 60%;
            
            --gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
            --gradient-resilience: linear-gradient(135deg, #10b981, #3b82f6);
            --gradient-stress: linear-gradient(135deg, #f59e0b, #ef4444);
            --shadow-elegant: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: hsl(var(--foreground));
            background: linear-gradient(180deg, #fafafa, #f1f5f9);
        }
        
        .report-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: hsl(var(--background));
            box-shadow: var(--shadow-elegant);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .report-header {
            text-align: center;
            padding: 50px 30px;
            background: var(--gradient-resilience);
            color: white;
            margin: -20px -20px 40px -20px;
            border-radius: 24px 24px 0 0;
            position: relative;
        }
        
        .report-title {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 12px;
            text-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .report-subtitle {
            font-size: 1.2rem;
            opacity: 0.95;
            font-weight: 400;
        }
        
        .section {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: hsl(var(--foreground));
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .profile-display {
            text-align: center;
            padding: 40px;
            background: linear-gradient(135deg, #ffffff, #f8fafc);
            border-radius: 20px;
            border: 2px solid ${profile.color}30;
            margin-bottom: 30px;
        }
        
        .profile-badge {
            font-size: 4rem;
            margin-bottom: 15px;
            display: block;
        }
        
        .profile-type {
            font-size: 2rem;
            font-weight: 700;
            color: ${profile.color};
            margin-bottom: 10px;
        }
        
        .profile-description {
            color: hsl(var(--muted-foreground));
            font-size: 1.1rem;
            max-width: 500px;
            margin: 0 auto;
        }
        
        .resilience-dimensions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .dimension-card {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 25px;
            transition: all 0.3s ease;
        }
        
        .dimension-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-elegant);
        }
        
        .dimension-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .dimension-name {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .dimension-score {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${profile.color};
        }
        
        .progress-bar {
            background: hsl(var(--muted));
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--gradient-resilience);
            border-radius: 4px;
            transition: width 0.8s ease;
        }
        
        .insight-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .insight-card {
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 20px;
        }
        
        .insight-title {
            font-weight: 600;
            color: ${profile.color};
            margin-bottom: 10px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .insight-content {
            color: hsl(var(--muted-foreground));
            line-height: 1.6;
        }
        
        .action-plan {
            background: linear-gradient(135deg, #f0f9ff, #ecfdf5);
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 30px;
        }
        
        .action-item {
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            position: relative;
            padding-left: 50px;
        }
        
        .action-number {
            position: absolute;
            left: 15px;
            top: 15px;
            width: 24px;
            height: 24px;
            background: ${profile.color};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .action-title {
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .action-description {
            color: hsl(var(--muted-foreground));
            font-size: 0.95rem;
        }
        
        ${reportType === 'employer' ? `
        .employer-section {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border: 2px solid ${profile.color}40;
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .hiring-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .metric-card {
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        
        .metric-value {
            font-size: 1.8rem;
            font-weight: 700;
            color: ${profile.color};
            margin-bottom: 5px;
        }
        
        .metric-label {
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
        }
        ` : ''}
        
        .print-button {
            background: var(--gradient-resilience);
            color: white;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
        }
        
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }
        
        .footer {
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid hsl(var(--border));
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
            margin-top: 40px;
        }
        
        @media print {
            .print-button { display: none; }
            body { margin: 0; }
            .report-container { box-shadow: none; margin: 0; padding: 15px; }
        }
        
        @media (max-width: 768px) {
            .resilience-dimensions { grid-template-columns: 1fr; }
            .insight-grid { grid-template-columns: 1fr; }
            .report-title { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
        
        <div class="report-header">
            <div style="font-size: 2rem; font-weight: 800; margin-bottom: 10px;">AuthenCore Analytics</div>
            <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 20px;">Professional Assessment Solutions</div>
            <h1 class="report-title">Stress & Resilience Assessment</h1>
            <p class="report-subtitle">${reportType === 'employer' ? 'Employer Analysis Report' : 'Personal Development Report'}</p>
        </div>
        
        <div class="section">
            <h2 class="section-title">👤 Assessment Information</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div><strong>Name:</strong> ${candidateInfo.name}</div>
                <div><strong>Email:</strong> ${candidateInfo.email}</div>
                ${candidateInfo.position ? `<div><strong>Position:</strong> ${candidateInfo.position}</div>` : ''}
                ${candidateInfo.organization ? `<div><strong>Organization:</strong> ${candidateInfo.organization}</div>` : ''}
                <div><strong>Assessment Date:</strong> ${candidateInfo.assessmentDate}</div>
                <div><strong>Questions:</strong> 60 items</div>
            </div>
        </div>
        
        <div class="profile-display">
            <span class="profile-badge">${profile.badge}</span>
            <div class="profile-type">${profile.type}</div>
            <div class="profile-description">${profile.description}</div>
            <div style="margin-top: 15px; padding: 8px 20px; background: ${profile.color}20; color: ${profile.color}; border-radius: 20px; font-weight: 600; display: inline-block;">
                Resilience Level: ${profile.level}
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Resilience Dimensions</h2>
            <div class="resilience-dimensions">
                ${Object.entries(results.dimensionScores || {}).map(([key, dimension]: [string, any]) => `
                    <div class="dimension-card">
                        <div class="dimension-header">
                            <div class="dimension-name">${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</div>
                            <div class="dimension-score">${dimension.score || 70}</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${dimension.score || 70}%"></div>
                        </div>
                        <div style="color: hsl(var(--muted-foreground)); font-size: 0.9rem; margin-top: 10px;">
                            ${dimension.level || 'Moderate'} - ${dimension.description || 'Assessment dimension analysis'}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">💡 Key Insights</h2>
            <div class="insight-grid">
                <div class="insight-card">
                    <div class="insight-title">🎯 Stress Response Pattern</div>
                    <div class="insight-content">
                        Your stress response shows ${profile.level.toLowerCase()} resilience characteristics. 
                        ${results.overallScore >= 75 ? 'You demonstrate strong coping mechanisms and adaptability under pressure.' : 
                          results.overallScore >= 65 ? 'You show good stress management with opportunities for enhancement.' :
                          'Developing stronger stress management techniques will significantly improve your resilience.'}
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-title">🧠 Coping Strategies</div>
                    <div class="insight-content">
                        ${results.overallScore >= 80 ? 'Excellent use of adaptive coping strategies. Continue leveraging these strengths.' :
                          results.overallScore >= 65 ? 'Good foundation of coping skills with room for strategic improvement.' :
                          'Focus on developing healthier coping mechanisms and stress response patterns.'}
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-title">⚡ Recovery Ability</div>
                    <div class="insight-content">
                        ${results.overallScore >= 75 ? 'Strong bounce-back ability from stressful situations.' :
                          results.overallScore >= 60 ? 'Moderate recovery speed with potential for improvement.' :
                          'Building resilience skills will help you recover more quickly from challenges.'}
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-title">🌱 Growth Potential</div>
                    <div class="insight-content">
                        Every individual can enhance their resilience. Focus on ${results.overallScore >= 70 ? 'advanced stress management techniques' : 'foundational resilience building'} 
                        to unlock your full potential for handling workplace pressures.
                    </div>
                </div>
            </div>
        </div>
        
        <div class="action-plan">
            <h2 class="section-title">🎯 90-Day Resilience Development Plan</h2>
            
            <div class="action-item">
                <div class="action-number">1</div>
                <div class="action-title">Stress Awareness Building (Days 1-30)</div>
                <div class="action-description">
                    Identify personal stress triggers and develop awareness of early warning signs. Practice daily stress monitoring and reflection.
                </div>
            </div>
            
            <div class="action-item">
                <div class="action-number">2</div>
                <div class="action-title">Coping Skill Development (Days 31-60)</div>
                <div class="action-description">
                    Learn and practice evidence-based stress management techniques including mindfulness, breathing exercises, and cognitive reframing.
                </div>
            </div>
            
            <div class="action-item">
                <div class="action-number">3</div>
                <div class="action-title">Resilience Integration (Days 61-90)</div>
                <div class="action-description">
                    Apply learned techniques in real-world situations. Build support networks and develop long-term resilience strategies.
                </div>
            </div>
        </div>
        
        ${reportType === 'employer' ? `
        <div class="employer-section">
            <h2 class="section-title">👔 Employer Analysis</h2>
            
            <div class="hiring-metrics">
                <div class="metric-card">
                    <div class="metric-value">${results.overallScore}%</div>
                    <div class="metric-label">Stress Resilience</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${results.overallScore >= 75 ? 'High' : results.overallScore >= 60 ? 'Moderate' : 'Developing'}</div>
                    <div class="metric-label">Pressure Tolerance</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${results.overallScore >= 70 ? 'Excellent' : 'Good'}</div>
                    <div class="metric-label">Team Stability</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${profile.level}</div>
                    <div class="metric-label">Development Level</div>
                </div>
            </div>
            
            <div style="background: hsl(var(--background)); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: ${profile.color}; margin-bottom: 15px;">Hiring Recommendation</h3>
                <div style="font-size: 1.1rem; margin-bottom: 10px;">
                    <strong>${results.overallScore >= 75 ? 'Highly Recommended' : results.overallScore >= 65 ? 'Recommended' : 'Consider with Support'}</strong>
                </div>
                <div style="color: hsl(var(--muted-foreground));">
                    ${results.overallScore >= 75 ? 'Candidate demonstrates excellent stress management and resilience. Well-suited for high-pressure roles.' :
                      results.overallScore >= 65 ? 'Good resilience foundation with strong potential. Consider for most positions with standard support.' :
                      'Developing resilience skills. Best suited for supportive environments with growth opportunities.'}
                </div>
            </div>
            
            <div style="background: hsl(var(--background)); border-radius: 12px; padding: 20px;">
                <h3 style="color: ${profile.color}; margin-bottom: 15px;">Management Considerations</h3>
                <ul style="padding-left: 20px; color: hsl(var(--muted-foreground));">
                    <li>Provide ${results.overallScore >= 70 ? 'challenging projects with autonomy' : 'structured support and clear expectations'}</li>
                    <li>Monitor workload and stress levels ${results.overallScore < 65 ? 'closely' : 'regularly'}</li>
                    <li>Offer ${results.overallScore >= 75 ? 'leadership development opportunities' : 'stress management resources and training'}</li>
                    <li>Create ${results.overallScore >= 70 ? 'stretch assignments' : 'supportive learning environment'}</li>
                </ul>
            </div>
        </div>
        ` : ''}
        
        <div class="footer">
            <p>Generated by AuthenCore Analytics Professional Assessment Platform</p>
            <p style="margin-top: 10px; font-size: 0.8rem;">Report Date: ${new Date().toLocaleDateString()}</p>
            <p style="margin-top: 5px; font-size: 0.8rem;">This assessment is based on validated psychological instruments and should be used as part of a comprehensive evaluation process.</p>
        </div>
    </div>
</body>
</html>
  `;
};