import { formatPDFLegalFooter } from '@/utils/legalNotices';
import finalLogo from '@/assets/final-logo.png';

export interface BurnoutCandidateReportConfig {
  candidateInfo: {
    name: string;
    email: string;
    assessmentDate: string;
  };
  results: {
    overallScore: number;
    percentileScore: number;
    burnoutRiskProfile: string;
    categoryScores: Array<{
      dimension: string;
      category: string;
      score: number;
      maxScore: number;
      percentage: number;
      level: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    dimensionScores: Array<{
      dimension: string;
      category: string;
      score: number;
      maxScore: number;
      percentage: number;
      level: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    burnoutRisk: 'low' | 'medium' | 'high';
    wellnessLevel: 'excellent' | 'good' | 'fair' | 'poor';
    priorityAreas: string[];
  };
}

export const generateBurnoutCandidateReport = (config: BurnoutCandidateReportConfig): string => {
  const { candidateInfo, results } = config;
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getWellnessMessage = (level: string) => {
    switch (level) {
      case 'excellent': return "🌟 Outstanding! You're in excellent shape with strong resilience and effective wellness practices.";
      case 'good': return "💪 Great job! You have good wellness foundations with some areas for enhancement.";
      case 'fair': return "⚡ You're on the right path but there are important areas that need attention.";
      case 'poor': return "🚨 Your wellness needs immediate attention. Let's work together to build stronger foundations.";
      default: return "📊 Your wellness assessment provides valuable insights for your journey ahead.";
    }
  };

  const getMotivationalMessage = (risk: string, profile: string) => {
    if (risk === 'low') {
      return "🎉 Excellent news! Your burnout risk is low. You've built strong resilience foundations that serve you well. Keep nurturing these positive patterns while staying mindful of your ongoing wellness journey.";
    } else if (risk === 'medium') {
      return "🔄 You're in a growth zone! While your burnout risk is moderate, this is actually a powerful position - you have awareness and the opportunity to strengthen your resilience before any serious issues arise.";
    } else {
      return "🌱 Every journey starts with a single step, and taking this assessment shows your commitment to positive change. Your high-risk areas are opportunities for transformation and growth.";
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Burnout Prevention Assessment - ${candidateInfo.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .report-container {
            max-width: 1000px;
            margin: 2rem auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            position: relative;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem 3rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .logo {
            width: 150px;
            height: auto;
            margin-bottom: 2rem;
            filter: brightness(0) invert(1);
            opacity: 0.95;
        }
        
        .header h1 {
            font-size: 3.2rem;
            margin-bottom: 1rem;
            font-weight: 300;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header .subtitle {
            font-size: 1.4rem;
            opacity: 0.9;
            margin-bottom: 1.5rem;
            font-weight: 300;
        }
        
        .header .name {
            font-size: 1.6rem;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.8rem 2rem;
            border-radius: 50px;
            display: inline-block;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .content {
            padding: 3rem 2rem;
        }
        
        .section {
            margin-bottom: 3rem;
            background: #f8fafc;
            border-radius: 16px;
            padding: 2rem;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
        }
        
        .section h2 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: #1e293b;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .motivational-section {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 20px;
            padding: 2.5rem;
            margin-bottom: 3rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .motivational-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
            );
            animation: float 20s linear infinite;
        }
        
        @keyframes float {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .motivational-message {
            font-size: 1.2rem;
            line-height: 1.8;
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .score-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .score-card {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 2.5rem;
            border-radius: 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
            transform: translateY(0);
            transition: transform 0.3s ease;
        }
        
        .score-card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #3b82f6, #1d4ed8, #3b82f6);
            border-radius: 20px;
            z-index: -1;
            opacity: 0.5;
        }
        
        .score-value {
            font-size: 4rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .score-label {
            font-size: 1.1rem;
            opacity: 0.9;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .risk-indicator {
            display: inline-block;
            padding: 0.8rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1rem;
        }
        
        .category-analysis {
            display: grid;
            gap: 2rem;
        }
        
        .category-item {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .category-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }
        
        .category-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .category-name {
            font-weight: 700;
            color: #1e293b;
            font-size: 1.2rem;
        }
        
        .category-level {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .progress-bar {
            background: #f1f5f9;
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 1rem;
            position: relative;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 6px;
            position: relative;
            transition: width 1s ease-in-out;
        }
        
        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .percentage-text {
            font-weight: 600;
            color: #1e293b;
            font-size: 1.1rem;
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .insight-card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .insight-card h3 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .insight-list {
            list-style: none;
            padding: 0;
        }
        
        .insight-list li {
            padding: 0.8rem 0;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }
        
        .insight-list li:last-child {
            border-bottom: none;
        }
        
        .insight-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.8rem;
            flex-shrink: 0;
            margin-top: 0.1rem;
        }
        
        .action-plan {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 2.5rem;
            border-radius: 20px;
            margin-top: 2rem;
        }
        
        .action-plan h2 {
            color: white;
            margin-bottom: 1.5rem;
        }
        
        .action-steps {
            display: grid;
            gap: 1.5rem;
        }
        
        .action-step {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .step-number {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .footer {
            background: #1e293b;
            color: #94a3b8;
            padding: 2rem;
            text-align: center;
            font-size: 0.9rem;
            line-height: 1.8;
        }
        
        .footer strong {
            color: white;
        }
        
        .priority-areas {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .priority-card {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 0.95rem;
        }
        
        @media print {
            body {
                background: white;
            }
            .report-container {
                box-shadow: none;
                margin: 0;
            }
            .section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <div class="header-content">
                <img src="${finalLogo}" alt="AuthenCore Analytics" class="logo" />
                <h1>🌟 Your Wellness Journey</h1>
                <div class="subtitle">Burnout Prevention Assessment Results</div>
                <div class="name">${candidateInfo.name}</div>
            </div>
        </div>

        <div class="content">
            <!-- Motivational Section -->
            <div class="motivational-section">
                <h2>💪 Your Resilience Story</h2>
                <p class="motivational-message">${getMotivationalMessage(results.burnoutRisk, results.burnoutRiskProfile)}</p>
            </div>

            <!-- Score Overview -->
            <div class="section">
                <h2>📊 Your Wellness Snapshot</h2>
                <div class="score-overview">
                    <div class="score-card">
                        <div class="score-value">${Math.round(results.overallScore)}</div>
                        <div class="score-label">Resilience Score</div>
                        <div class="risk-indicator" style="background-color: ${getRiskColor(results.burnoutRisk)};">
                            ${results.burnoutRisk.toUpperCase()} RISK
                        </div>
                    </div>
                    <div class="score-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <div class="score-value">${results.percentileScore}%</div>
                        <div class="score-label">Percentile Rank</div>
                        <div class="risk-indicator" style="background: rgba(255,255,255,0.2);">
                            ${results.wellnessLevel.toUpperCase()}
                        </div>
                    </div>
                </div>
                <p style="text-align: center; font-size: 1.1rem; color: #64748b; margin-top: 1rem;">
                    ${getWellnessMessage(results.wellnessLevel)}
                </p>
            </div>

            <!-- Detailed Category Analysis -->
            <div class="section">
                <h2>🎯 Your Wellness Areas</h2>
                <div class="category-analysis">
                    ${results.categoryScores.map(category => `
                        <div class="category-item">
                            <div class="category-header">
                                <div class="category-name">${category.category || category.dimension}</div>
                                <div class="category-level">${category.level}</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(category.percentage || category.score || 0)}%;"></div>
                            </div>
                            <div class="percentage-text">${(category.percentage || category.score || 0).toFixed(1)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Personal Insights -->
            <div class="section">
                <h2>💡 Your Personal Insights</h2>
                <div class="insights-grid">
                    <div class="insight-card">
                        <h3>✨ Your Strengths</h3>
                        <ul class="insight-list">
                            ${results.strengths.map(strength => `
                                <li>
                                    <div class="insight-icon">✓</div>
                                    <span>${strength}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="insight-card">
                        <h3>🎯 Growth Opportunities</h3>
                        <ul class="insight-list">
                            ${results.challenges.map(challenge => `
                                <li>
                                    <div class="insight-icon">→</div>
                                    <span>${challenge}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Action Plan -->
            <div class="action-plan">
                <h2>🚀 Your Personalized Action Plan</h2>
                <div class="action-steps">
                    ${results.recommendations.map((recommendation, index) => `
                        <div class="action-step">
                            <div class="step-number">${index + 1}</div>
                            <p>${recommendation}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Priority Areas -->
            ${results.priorityAreas && results.priorityAreas.length > 0 ? `
            <div class="section">
                <h2>🚨 Priority Focus Areas</h2>
                <p style="margin-bottom: 1.5rem; color: #64748b;">These areas need your immediate attention for optimal wellness:</p>
                <div class="priority-areas">
                    ${results.priorityAreas.map(area => `
                        <div class="priority-card">${area}</div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>AuthenCore Analytics</strong> - Professional Assessment Solutions</p>
            <p>Generated on ${new Date().toLocaleDateString()} | Assessment ID: BPI-${Date.now()}</p>
            <p>${formatPDFLegalFooter()}</p>
        </div>
    </div>
</body>
</html>
  `;
};