import { EmotionalIntelligenceResult } from '@/hooks/useEmotionalIntelligenceScoring';

interface EmotionalIntelligenceReportData {
  candidateInfo: {
    name: string;
    email: string;
    position?: string;
    organization?: string;
    assessmentDate: string;
  };
  results: EmotionalIntelligenceResult;
  reportType: 'candidate' | 'employer';
}

export const generateEmotionalIntelligenceReport = (data: EmotionalIntelligenceReportData): string => {
  const { candidateInfo, results, reportType } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emotional Intelligence Assessment Report - ${candidateInfo.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        :root {
            --primary: 217 91% 60%;
            --primary-foreground: 0 0% 98%;
            --secondary: 210 40% 96%;
            --secondary-foreground: 222.2 84% 4.9%;
            --muted: 210 40% 96%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96%;
            --accent-foreground: 222.2 84% 4.9%;
            --border: 214.3 31.8% 91.4%;
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            
            --gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
            --gradient-secondary: linear-gradient(135deg, #06b6d4, #3b82f6);
            --gradient-accent: linear-gradient(135deg, #f59e0b, #ef4444);
            --gradient-subtle: linear-gradient(180deg, #fafafa, #f1f5f9);
            --gradient-card: linear-gradient(145deg, #ffffff, #f8fafc);
            
            --shadow-elegant: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --shadow-glow: 0 0 50px rgba(59, 130, 246, 0.15);
            --shadow-depth: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes shimmer {
            0% {
                background-position: -200px 0;
            }
            100% {
                background-position: calc(200px + 100%) 0;
            }
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: hsl(var(--foreground));
            background: var(--gradient-subtle);
            overflow-x: hidden;
        }
        
        .report-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: var(--gradient-card);
            box-shadow: var(--shadow-elegant);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            animation: fadeInUp 0.6s ease-out;
        }
        
        .report-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: -50%;
            width: 200%;
            height: 4px;
            background: var(--gradient-primary);
            animation: shimmer 2s infinite;
        }
        
        .report-header {
            text-align: center;
            padding: 50px 30px;
            background: var(--gradient-primary);
            color: white;
            margin: -20px -20px 40px -20px;
            border-radius: 24px 24px 0 0;
            position: relative;
            overflow: hidden;
            animation: slideInRight 0.8s ease-out;
        }
        
        .report-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            animation: shimmer 4s linear infinite;
        }
        
        .logo {
            width: 100px;
            height: auto;
            margin-bottom: 25px;
            background: white;
            border-radius: 12px;
            padding: 12px;
            filter: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: scaleIn 0.6s ease-out 0.2s both;
            position: relative;
            z-index: 1;
            display: block;
        }
        
        .logo:hover {
            transform: scale(1.1) rotate(5deg);
        }
        
        .report-title {
            font-family: 'Playfair Display', serif;
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 12px;
            text-shadow: 0 4px 8px rgba(0,0,0,0.2);
            animation: fadeInUp 0.6s ease-out 0.3s both;
            position: relative;
            z-index: 1;
            background: linear-gradient(45deg, #ffffff, #f1f5f9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .report-subtitle {
            font-size: 1.2rem;
            opacity: 0.95;
            font-weight: 400;
            animation: fadeInUp 0.6s ease-out 0.4s both;
            position: relative;
            z-index: 1;
            letter-spacing: 0.5px;
        }
        
        .print-button {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }
        
        .section {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            animation: fadeInUp 0.6s ease-out;
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
        
        .overall-score {
            text-align: center;
            padding: 40px;
            background: var(--gradient-card);
            border-radius: 20px;
            margin-bottom: 30px;
            border: 2px solid hsl(var(--border));
        }
        
        .score-value {
            font-size: 4rem;
            font-weight: 800;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .score-label {
            font-size: 1.2rem;
            color: hsl(var(--muted-foreground));
            font-weight: 500;
        }
        
        .dimensions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }
        
        .dimension-card {
            background: var(--gradient-card);
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
            color: hsl(var(--primary));
        }
        
        .level-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .level-high {
            background: #22c55e20;
            color: #22c55e;
        }
        
        .level-medium {
            background: #f59e0b20;
            color: #f59e0b;
        }
        
        .level-low {
            background: #ef444420;
            color: #ef4444;
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
            background: var(--gradient-primary);
            border-radius: 4px;
            transition: width 0.8s ease;
        }
        
        .dimension-interpretation {
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
            line-height: 1.5;
            margin-top: 10px;
        }
        
        .recommendations-section {
            background: var(--gradient-card);
            border: 1px solid hsl(var(--border));
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .recommendations-list {
            list-style: none;
            padding: 0;
        }
        
        .recommendation-item {
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .recommendation-dimension {
            font-weight: 600;
            color: hsl(var(--primary));
            margin-bottom: 10px;
        }
        
        .recommendation-suggestions {
            list-style: none;
            padding: 0;
        }
        
        .recommendation-suggestions li {
            padding: 8px 0;
            border-bottom: 1px solid hsl(var(--border));
            position: relative;
            padding-left: 25px;
        }
        
        .recommendation-suggestions li:last-child {
            border-bottom: none;
        }
        
        .recommendation-suggestions li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: hsl(var(--primary));
            font-weight: bold;
        }
        
        ${reportType === 'employer' ? `
        .employer-section {
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border: 2px solid hsl(var(--primary));
            border-radius: 16px;
            padding: 30px;
            margin-bottom: 30px;
        }
        
        .hiring-recommendation {
            background: var(--gradient-primary);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .insight-card {
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            border-radius: 12px;
            padding: 20px;
        }
        
        .insight-label {
            font-weight: 600;
            color: hsl(var(--primary));
            margin-bottom: 8px;
        }
        
        .insight-value {
            color: hsl(var(--muted-foreground));
            font-size: 0.9rem;
            line-height: 1.5;
        }
        ` : ''}
        
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
            .dimensions-grid { grid-template-columns: 1fr; }
            .insights-grid { grid-template-columns: 1fr; }
            .report-title { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <button class="print-button" onclick="window.print()">🖨️ Print Report</button>
        
        <div class="report-header">
            <img src="/final-logo.png" alt="AuthenCore Analytics" class="logo" />
            <h1 class="report-title">Emotional Intelligence Assessment</h1>
            <p class="report-subtitle">${reportType === 'employer' ? 'Employer Hiring Report' : 'Personal Development Report'}</p>
        </div>
        
        <div class="section">
            <h2 class="section-title">👤 Assessment Information</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div><strong>Name:</strong> ${candidateInfo.name}</div>
                <div><strong>Email:</strong> ${candidateInfo.email}</div>
                ${candidateInfo.position ? `<div><strong>Position:</strong> ${candidateInfo.position}</div>` : ''}
                ${candidateInfo.organization ? `<div><strong>Organization:</strong> ${candidateInfo.organization}</div>` : ''}
                <div><strong>Assessment Date:</strong> ${candidateInfo.assessmentDate}</div>
                <div><strong>Questions:</strong> 70 items</div>
            </div>
        </div>
        
        <div class="overall-score">
            <div class="score-value">${results.overallScore}</div>
            <div class="score-label">Overall Emotional Intelligence Score</div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🧠 Emotional Intelligence Dimensions</h2>
            <div class="dimensions-grid">
                ${Object.entries(results.scores).map(([dimension, score]) => `
                    <div class="dimension-card">
                        <div class="dimension-header">
                            <div class="dimension-name">${getDimensionDisplayName(dimension)}</div>
                            <div class="dimension-score">${score.percentage}%</div>
                        </div>
                        <div class="level-badge level-${score.level.toLowerCase()}">${score.level}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${score.percentage}%"></div>
                        </div>
                        <div class="dimension-interpretation">${score.interpretation}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${results.recommendations.length > 0 ? `
        <div class="section">
            <h2 class="section-title">💡 Development Recommendations</h2>
            <div class="recommendations-list">
                ${results.recommendations.map(rec => `
                    <div class="recommendation-item">
                        <div class="recommendation-dimension">${rec.dimension}</div>
                        <ul class="recommendation-suggestions">
                            ${rec.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${reportType === 'employer' ? generateEmployerSection(results) : ''}
        
        <div class="footer">
            <p>This report was generated on ${new Date().toLocaleDateString()} using advanced emotional intelligence assessment principles.</p>
            <p>© ${new Date().getFullYear()} AuthenCore Analytics - Confidential Assessment Report</p>
        </div>
    </div>
</body>
</html>
  `;
};

function getDimensionDisplayName(dimension: string): string {
  const names: Record<string, string> = {
    selfAwareness: 'Self-Awareness',
    selfRegulation: 'Self-Regulation',
    motivation: 'Motivation',
    empathy: 'Empathy',
    socialSkills: 'Social Skills'
  };
  return names[dimension] || dimension;
}

function generateEmployerSection(results: EmotionalIntelligenceResult): string {
  const overallLevel = results.overallScore >= 80 ? 'High' : results.overallScore >= 60 ? 'Medium' : 'Low';
  const hiringRecommendation = overallLevel === 'High' ? 'HIGHLY RECOMMENDED' : 
                              overallLevel === 'Medium' ? 'RECOMMENDED WITH DEVELOPMENT' : 'CONSIDER WITH CAUTION';
  
  return `
    <div class="employer-section">
        <h2 class="section-title">👔 Employer Insights</h2>
        
        <div class="hiring-recommendation">
            <h3 style="margin-bottom: 10px;">Hiring Recommendation: ${hiringRecommendation}</h3>
            <p style="opacity: 0.9;">Overall EQ Score: ${results.overallScore}% (${overallLevel} Level)</p>
        </div>
        
        <div class="insights-grid">
            <div class="insight-card">
                <div class="insight-label">Team Collaboration</div>
                <div class="insight-value">
                    ${results.scores.socialSkills.level === 'High' ? 'Excellent team player with strong interpersonal skills' :
                      results.scores.socialSkills.level === 'Medium' ? 'Good collaboration potential with some development needs' :
                      'May struggle in team environments without support'}
                </div>
            </div>
            
            <div class="insight-card">
                <div class="insight-label">Leadership Potential</div>
                <div class="insight-value">
                    ${(results.scores.selfAwareness.level === 'High' && results.scores.socialSkills.level === 'High') ? 
                      'Strong leadership potential with emotional maturity' :
                      'Moderate leadership potential, may benefit from EQ development'}
                </div>
            </div>
            
            <div class="insight-card">
                <div class="insight-label">Stress Management</div>
                <div class="insight-value">
                    ${results.scores.selfRegulation.level === 'High' ? 'Excellent emotional control under pressure' :
                      results.scores.selfRegulation.level === 'Medium' ? 'Generally manages stress well' :
                      'May need support during high-stress periods'}
                </div>
            </div>
            
            <div class="insight-card">
                <div class="insight-label">Customer Relations</div>
                <div class="insight-value">
                    ${results.scores.empathy.level === 'High' ? 'Exceptional ability to understand and serve customers' :
                      results.scores.empathy.level === 'Medium' ? 'Good customer service potential' :
                      'May need training for customer-facing roles'}
                </div>
            </div>
            
            <div class="insight-card">
                <div class="insight-label">Adaptability</div>
                <div class="insight-value">
                    ${results.scores.motivation.level === 'High' ? 'Highly adaptable and resilient to change' :
                      results.scores.motivation.level === 'Medium' ? 'Moderately adaptable with proper support' :
                      'May struggle with organizational changes'}
                </div>
            </div>
            
            <div class="insight-card">
                <div class="insight-label">Development Investment</div>
                <div class="insight-value">
                    ${results.recommendations.length === 0 ? 'Low - Strong EQ foundation across all areas' :
                      results.recommendations.length <= 2 ? 'Moderate - Some targeted development opportunities' :
                      'High - Significant EQ development recommended'}
                </div>
            </div>
        </div>
    </div>
  `;
}