import { formatPDFLegalFooter } from '@/utils/legalNotices';

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

  const getMotivationalMessage = (risk: string, profile: string) => {
    if (risk === 'low') {
      return "You're demonstrating excellent resilience! Keep up the great work maintaining your well-being.";
    } else if (risk === 'medium') {
      return "You're managing well overall, but there are opportunities to strengthen your resilience further.";
    } else {
      return "Your results indicate you may benefit from additional support. Remember, seeking help is a sign of strength.";
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Burnout Prevention Assessment Results</title>
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
        }
        
        .report-container {
            max-width: 1000px;
            margin: 2rem auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 3rem 2rem;
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
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-size: 2.8rem;
            margin-bottom: 0.5rem;
            font-weight: 300;
        }
        
        .header .subtitle {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 1rem;
        }
        
        .header .name {
            font-size: 1.4rem;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            display: inline-block;
        }
        
        .content {
            padding: 2.5rem;
        }
        
        .section {
            margin-bottom: 3rem;
            padding: 2rem;
            border-radius: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            position: relative;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #4f46e5, #7c3aed);
            border-radius: 2px;
        }
        
        .section h2 {
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-size: 1.6rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .motivational-section {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-align: center;
            padding: 2.5rem;
            border-radius: 12px;
            margin-bottom: 3rem;
        }
        
        .motivational-section h2 {
            color: white;
            margin-bottom: 1rem;
        }
        
        .motivational-message {
            font-size: 1.2rem;
            font-style: italic;
            opacity: 0.95;
        }
        
        .score-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .score-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            overflow: hidden;
        }
        
        .score-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
        }
        
        .score-value {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .score-label {
            color: #6b7280;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }
        
        .wellness-indicator {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            text-transform: capitalize;
        }
        
        .wellness-excellent { background: #dcfce7; color: #166534; }
        .wellness-good { background: #dbeafe; color: #1e40af; }
        .wellness-fair { background: #fef3c7; color: #92400e; }
        .wellness-poor { background: #fee2e2; color: #991b1b; }
        
        .category-analysis {
            display: grid;
            gap: 1.5rem;
        }
        
        .category-item {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .category-name {
            font-weight: 600;
            color: #2d3748;
            font-size: 1.1rem;
        }
        
        .category-level {
            font-size: 0.9rem;
            color: #6b7280;
        }
        
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 6px;
            background: linear-gradient(90deg, #4f46e5, #7c3aed);
            transition: width 0.8s ease;
        }
        
        .percentage-text {
            text-align: right;
            font-size: 0.9rem;
            color: #6b7280;
            font-weight: 500;
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        .insights-column {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }
        
        .insights-column h3 {
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .insights-column.strengths h3 {
            color: #059669;
        }
        
        .insights-column.challenges h3 {
            color: #dc2626;
        }
        
        .insights-list {
            list-style: none;
        }
        
        .insights-list li {
            padding: 0.75rem 0;
            border-bottom: 1px solid #f1f5f9;
            position: relative;
            padding-left: 1.5rem;
        }
        
        .insights-list li:last-child {
            border-bottom: none;
        }
        
        .strengths .insights-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #059669;
            font-weight: bold;
        }
        
        .challenges .insights-list li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #dc2626;
            font-weight: bold;
        }
        
        .recommendations-section {
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border: 1px solid #fbbf24;
            border-radius: 12px;
            padding: 2rem;
        }
        
        .recommendations-section h3 {
            color: #92400e;
            margin-bottom: 1.5rem;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .recommendations-list {
            list-style: none;
            display: grid;
            gap: 1rem;
        }
        
        .recommendations-list li {
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .footer {
            background: #2d3748;
            color: white;
            padding: 2rem;
            text-align: center;
            font-size: 0.9rem;
        }
        
        .footer p {
            margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
            .insights-grid {
                grid-template-columns: 1fr;
            }
            
            .score-overview {
                grid-template-columns: 1fr;
            }
            
            .content {
                padding: 1.5rem;
            }
        }
        
        @media print {
            body { 
                background: white; 
                -webkit-print-color-adjust: exact;
            }
            .report-container { 
                box-shadow: none; 
                margin: 0;
                border-radius: 0;
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
                    </div>
                    <div class="score-card">
                        <div class="score-value">${Math.round(results.percentileScore)}</div>
                        <div class="score-label">Percentile Ranking</div>
                    </div>
                    <div class="score-card">
                        <div class="score-value" style="font-size: 1.8rem;">${results.burnoutRiskProfile}</div>
                        <div class="score-label">Resilience Profile</div>
                    </div>
                    <div class="score-card">
                        <span class="wellness-indicator wellness-${results.wellnessLevel}">${results.wellnessLevel}</span>
                        <div class="score-label">Wellness Level</div>
                    </div>
                </div>
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
                    <div class="insights-column strengths">
                        <h3>🌟 Your Strengths</h3>
                        <ul class="insights-list">
                            ${results.strengths.length > 0 ? 
                                results.strengths.map(strength => `<li>${strength}</li>`).join('') :
                                '<li>Every challenge is an opportunity to build new strengths</li>'
                            }
                        </ul>
                    </div>
                    <div class="insights-column challenges">
                        <h3>🎯 Growth Opportunities</h3>
                        <ul class="insights-list">
                            ${results.challenges.length > 0 ? 
                                results.challenges.map(challenge => `<li>${challenge}</li>`).join('') :
                                '<li>You\'re doing great! Continue maintaining your current strategies</li>'
                            }
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Personal Action Plan -->
            <div class="section">
                <h2>🚀 Your Personal Action Plan</h2>
                <div class="recommendations-section">
                    <h3>💡 Recommended Next Steps</h3>
                    <ul class="recommendations-list">
                        ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        <li>Set aside 15 minutes daily for mindfulness or relaxation activities</li>
                        <li>Schedule regular check-ins with yourself to monitor your well-being</li>
                        <li>Build a support network of colleagues, friends, or mentors</li>
                        ${results.burnoutRisk === 'high' ? 
                            '<li><strong>Consider speaking with a counselor or therapist for additional support</strong></li>' : 
                            '<li>Celebrate your progress and maintain the strategies that work for you</li>'
                        }
                    </ul>
                </div>
            </div>

            <!-- Priority Focus Areas -->
            ${results.priorityAreas.length > 0 ? `
            <div class="section">
                <h2>🎯 Your Priority Focus Areas</h2>
                <p style="margin-bottom: 1.5rem; color: #6b7280;">These areas could benefit from your immediate attention:</p>
                <div style="display: grid; gap: 1rem;">
                    ${results.priorityAreas.map(area => `
                        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; border-left: 4px solid #ef4444;">
                            <h4 style="color: #991b1b; margin-bottom: 0.5rem;">${area}</h4>
                            <p style="color: #6b7280; font-size: 0.9rem;">Focus on developing strategies and seeking support in this area</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Encouragement Section -->
            <div class="section" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #0ea5e9;">
                <h2 style="color: #0369a1;">🌈 Remember</h2>
                <div style="background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                    <p style="font-size: 1.1rem; line-height: 1.7; color: #1e40af;">
                        Your well-being is a journey, not a destination. Every small step you take towards better self-care 
                        and stress management makes a difference. Be patient with yourself, celebrate your progress, 
                        and remember that seeking support is a sign of strength, not weakness.
                    </p>
                </div>
            </div>
        </div>

        <div class="footer">
            ${formatPDFLegalFooter()}
            <p style="margin-top: 1rem; opacity: 0.8;">
                Assessment completed on ${candidateInfo.assessmentDate}
            </p>
            <p style="opacity: 0.7;">
                Take care of yourself - you're worth it! 💙
            </p>
        </div>
    </div>
</body>
</html>`;
};